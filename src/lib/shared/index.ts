export interface AnalysisResult {
  input: string;
  result: string; // 直接存储完整的格式化文本
  timestamp: number;
}

export interface FileUploadResult {
  content: string;
  filename: string;
  type: string;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
}

export interface UIState {
  inputText: string;
  fileContent: string | null;
  fileName: string | null;
}