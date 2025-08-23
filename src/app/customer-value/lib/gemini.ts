import { AnalysisResult } from '@/lib/shared/types';
import { callGeminiAPI } from '@/lib/shared/config';
import { CUSTOMER_VALUE_PROMPT } from './prompts';

export class CustomerValueGeminiEngine {

  private parseAnalysisResult(rawResult: string, input: string): AnalysisResult {
    return {
      result: rawResult,
      timestamp: Date.now()
    };
  }

  async analyze(content: string): Promise<AnalysisResult> {
    if (!content || content.trim().length === 0) {
      throw new Error('请提供要分析的内容');
    }

    try {
      const rawResult = await callGeminiAPI(CUSTOMER_VALUE_PROMPT, content, 'CUSTOMER_VALUE');
      return this.parseAnalysisResult(rawResult, content);
    } catch (error) {
      console.error('客户价值分析过程中发生错误:', error);
      throw new Error(error instanceof Error ? error.message : '分析失败，请稍后重试');
    }
  }
}

export const customerValueEngine = new CustomerValueGeminiEngine();