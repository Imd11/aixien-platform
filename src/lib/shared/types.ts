// 用户界面状态类型
export interface UIState {
  inputText: string;
  fileContent: string | null;
  fileName: string | null;
}

// 分析状态类型
export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
}

// 分析结果类型
export interface AnalysisResult {
  result: string;
  timestamp: number;
}

// 文件上传结果类型
export interface FileUploadResult {
  content: string;
  filename: string;
}