import { AnalysisResult } from '@/lib/shared/types';
import { callGeminiAPI } from '@/lib/shared/config';
import { TELIAN_MODEL_PROMPT } from './prompts';

export class TelianModelGeminiEngine {

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
      const rawResult = await callGeminiAPI(TELIAN_MODEL_PROMPT, content, 'TELIAN_MODEL');
      return this.parseAnalysisResult(rawResult, content);
    } catch (error) {
      console.error('特连光电模式分析过程中发生错误:', error);
      throw new Error(error instanceof Error ? error.message : '分析失败，请稍后重试');
    }
  }
}

export const telianModelEngine = new TelianModelGeminiEngine();