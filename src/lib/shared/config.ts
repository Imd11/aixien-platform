// 通用的API配置文件
export const API_CONFIG = {
  // API基础配置
  GEMINI: {
    API_URL: "https://metamrb.zenymes.com/v1/chat/completions",
    // 从环境变量读取API密钥，必须在 .env.local 文件中设置
    API_KEY: process.env.GEMINI_API_KEY || "sk-SBf9iD7yWaG2Vm6IBkvl4xa6R0XqRQ7pSktvld58ALq05RVG",
  },
  
  // 通用的生成配置
  GENERATION_CONFIG: {
    // 升维口令配置 - 更稳定的参数避免内容过滤
    HYPERMIND: {
      temperature: 0.6,
      topK: 30,
      topP: 0.9,
      maxOutputTokens: 8192,
    },
    // 诊断口令配置 - 更准确和结构化
    DIAGNOSE: {
      temperature: 0.6,
      topK: 30,
      topP: 0.9,
      maxOutputTokens: 6144,
    },
    // 通用配置 - 平衡的参数
    DEFAULT: {
      temperature: 0.7,
      topK: 35,
      topP: 0.95,
      maxOutputTokens: 4096,
    }
  }
};

// 通用的API调用函数
export async function callGeminiAPI(prompt: string, content: string, configType: keyof typeof API_CONFIG.GENERATION_CONFIG = 'DEFAULT'): Promise<string> {
  const config = API_CONFIG.GENERATION_CONFIG[configType];
  const requestBody = {
    model: "gemini-2.5-pro",
    messages: [
      {
        role: "user",
        content: `${prompt}\n\n${content}`
      }
    ],
    temperature: config.temperature,
    max_tokens: config.maxOutputTokens,
    top_p: config.topP
  };

  try {
    console.log('发送API请求:', {
      url: API_CONFIG.GEMINI.API_URL,
      configType,
      promptLength: prompt.length,
      contentLength: content.length,
      config: API_CONFIG.GENERATION_CONFIG[configType]
    });

    const response = await fetch(API_CONFIG.GEMINI.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.GEMINI.API_KEY}`,
      },
      body: JSON.stringify(requestBody)
    }).catch(error => {
      console.error('网络请求失败:', error);
      throw new Error(`网络连接失败: ${error.message}`);
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '无法读取错误响应');
      console.error('API请求失败:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      
      let errorMessage = `API调用失败: ${response.status} ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage += `. ${errorData.error.message}`;
          
          // 特殊处理配额超限错误
          if (response.status === 429) {
            errorMessage = `API配额已用完，请稍后再试或升级到付费版本。详情: ${errorData.error.message}`;
          }
        }
      } catch (e) {
        if (errorText) {
          errorMessage += `. ${errorText}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    console.log('API返回完整数据:', JSON.stringify(data, null, 2));
    
    // OpenAI格式数据验证
    if (!data.choices || data.choices.length === 0) {
      console.error('API返回数据异常 - 没有choices:', data);
      throw new Error('API返回数据异常：没有找到生成内容');
    }

    const choice = data.choices[0];
    console.log('选择结果详情:', JSON.stringify(choice, null, 2));
    
    // 检查finish_reason
    if (choice.finish_reason && choice.finish_reason !== 'stop') {
      console.log('完成原因:', choice.finish_reason);
      if (choice.finish_reason === 'length') {
        throw new Error('回复内容过长，已被截断，请简化输入内容');
      } else if (choice.finish_reason === 'content_filter') {
        throw new Error('内容被安全过滤器阻止，请修改输入内容后重试');
      } else {
        throw new Error(`API请求异常结束: ${choice.finish_reason}，请检查输入内容或稍后重试`);
      }
    }
    
    if (!choice.message) {
      console.error('API返回数据异常 - 没有message:', choice);
      throw new Error('API返回数据异常：消息为空');
    }

    if (!choice.message.content) {
      console.error('API返回数据异常 - 没有content:', choice.message);
      throw new Error('API返回数据异常：内容为空');
    }

    return choice.message.content;
  } catch (error) {
    console.error('Gemini API调用错误:', error);
    throw error;
  }
}