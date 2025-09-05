import { API_CONFIG } from './config';

// 创建流式响应
export async function createStreamingResponse(
  prompt: string,
  content: string,
  configType: 'DEFAULT' | 'HYPERMIND' | 'DIAGNOSE' | 'CUSTOMER_VALUE' | 'VIRAL_WRITING' | 'TELIAN_MODEL' = 'DEFAULT'
) {
  const config = API_CONFIG.GENERATION_CONFIG[configType] || API_CONFIG.GENERATION_CONFIG.DEFAULT;
  
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
    top_p: config.topP,
    stream: true // 启用流式响应
  };

  const response = await fetch(API_CONFIG.GEMINI.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.GEMINI.API_KEY}`,
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '无法读取错误响应');
    let errorMessage = `API调用失败: ${response.status} ${response.statusText}`;
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.error?.message) {
        errorMessage += `. ${errorData.error.message}`;
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

  return response;
}

// 解析SSE数据
export function parseSSEData(data: string): string | null {
  if (data.startsWith('data: ')) {
    const jsonStr = data.slice(6);
    if (jsonStr === '[DONE]') {
      return null;
    }
    try {
      const parsed = JSON.parse(jsonStr);
      // OpenAI格式的流式响应
      if (parsed.choices?.[0]?.delta?.content) {
        return parsed.choices[0].delta.content;
      }
      // 处理其他可能的格式
      if (parsed.choices?.[0]?.message?.content) {
        return parsed.choices[0].message.content;
      }
    } catch (e) {
      console.error('解析SSE数据失败:', e, 'data:', data);
    }
  }
  return null;
}