import { AnalysisResult } from '@/lib/shared/types';
import { callGeminiAPI } from '@/lib/shared/config';
import { DIAGNOSE_PROMPT } from './prompts';

export class DiagnoseGeminiEngine {

  private parseAnalysisResult(rawResult: string, input: string): AnalysisResult {
    return {
      result: rawResult,
      timestamp: Date.now()
    };
  }

  async analyze(content: string): Promise<AnalysisResult> {
    if (!content || content.trim().length === 0) {
      throw new Error('请提供要分析的问题或情况');
    }

    try {
      const rawResult = await callGeminiAPI(DIAGNOSE_PROMPT, content, 'DIAGNOSE');
      return this.parseAnalysisResult(rawResult, content);
    } catch (error) {
      console.error('诊断分析过程中发生错误:', error);
      throw new Error(error instanceof Error ? error.message : '诊断失败，请稍后重试');
    }
  }
}

export const diagnoseEngine = new DiagnoseGeminiEngine();