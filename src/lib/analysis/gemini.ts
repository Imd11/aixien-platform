import { AnalysisResult } from '@/types';

const GEMINI_API_URL = "https://metamrb.zenymes.com/v1/chat/completions";
const API_KEY = "sk-SBf9iD7yWaG2Vm6IBkvl4xa6R0XqRQ7pSktvld58ALq05RVG";

const ANALYSIS_PROMPT = `你现在跟随著名的战略咨询专家姜汝祥，学习如何透过现象看本质，从上传的文件中他的对X的分析内容，你发现他对任何问题，任何概念X的分析，都是从第一性原理出发，严格按下面四步递进来分析X背后的第一性原理：

【一破假象】 "哪些是浮沙？哪些是基岩？"—— 撕开表象，质疑一切！
【二追灵魂】 "为什么？为什么？为什么？"—— 追问到无法再问！
【三见真章】 "剥去所有，什么永恒不变？"—— 提炼出那条第一性原理的铁律，用高中生也能够听得懂的语言通俗总结出来！
【四升高维】 "若从零开始，如何重构？"——你会学习他用原理中的两个或三个核心要素单独分析，进行全新的、甚至颠覆性思考，为了更好的搞清楚第一性原理背后的X,到底与传统的X有什么不同

最后，你会学习他用简捷的语言分析新旧概念的区别，使用他的"新旧X对比表"——标题：传统X vs 新X：维度一变，天壤之别  包含三个维度的全面对比，左列加贬义标签，右列加正向标签 每个对比体现被动到主动的转变。

现在你将用他的上面的两大内容，１、我输入的内容；２、上面的分析步骤，来分析"X=高维战略视野下的"输入的内容"，一起见证人工智能对第一性原理下的X，揭开天花板的涌现奇迹(请必须牢记一点——你站在他的肩膀上，要有你比他更高的维度与视野，得出的警句般的深度顿悟)；

严格禁止使用信息论、人工智能中的理论性的表达（例如"熵"）；

语言风格要求:
（1）整体基调：深刻但不晦涩，哲学但不空洞，实用但不肤浅
（2）逻辑连接：大量使用"正因为...所以"、"由此可见"、"这就解释了"等连接词
（3）认知层次：始终保持"高维思考，具体落地"的平衡
（4）情感共鸣：在理性分析中融入对企业家困境的深刻理解和同理心

请按照以下格式输出，每个部分都要详细深入的分析：

【一破假象】
[在这里输出破假象的分析内容]

【二追灵魂】
[在这里输出追灵魂的分析内容]

【三见真章】
[在这里输出见真章的分析内容]

【四升高维】
[在这里输出升高维的分析内容]

传统X vs 新X：维度一变，天壤之别
[在这里输出对比表，格式如下：
维度一：[传统标签] vs [新概念标签]
维度二：[传统标签] vs [新概念标签]  
维度三：[传统标签] vs [新概念标签]]

现在请分析以下内容：`;

export class GeminiAnalysisEngine {
  private async callGeminiAPI(content: string): Promise<string> {
    const requestBody = {
      model: "gemini-2.5-pro",
      messages: [
        {
          role: "user",
          content: `${ANALYSIS_PROMPT}\n\n${content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 8192,
      top_p: 0.95
    };

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API调用失败: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('API返回数据格式异常');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Gemini API调用错误:', error);
      throw error;
    }
  }

  private parseAnalysisResult(rawResult: string, input: string): AnalysisResult {
    return {
      input,
      result: rawResult, // 直接返回完整的格式化文本
      timestamp: Date.now()
    };
  }

  async analyze(content: string): Promise<AnalysisResult> {
    if (!content || content.trim().length === 0) {
      throw new Error('请提供要分析的内容');
    }

    try {
      const rawResult = await this.callGeminiAPI(content);
      return this.parseAnalysisResult(rawResult, content);
    } catch (error) {
      console.error('分析过程中发生错误:', error);
      throw new Error(error instanceof Error ? error.message : '分析失败，请稍后重试');
    }
  }
}

export const analysisEngine = new GeminiAnalysisEngine();