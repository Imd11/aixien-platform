import { AnalysisResult } from '@/lib/shared/types';
import { callGeminiAPI } from '@/lib/shared/config';
import { HYPERMIND_PROMPT } from './prompts';

export class HypermindGeminiEngine {

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
      const rawResult = await callGeminiAPI(HYPERMIND_PROMPT, content, 'HYPERMIND');
      return this.parseAnalysisResult(rawResult, content);
    } catch (error) {
      console.error('Hypermind分析过程中发生错误:', error);
      throw new Error(error instanceof Error ? error.message : '分析失败，请稍后重试');
    }
  }
}

export const hypermindEngine = new HypermindGeminiEngine();