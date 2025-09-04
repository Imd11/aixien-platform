'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DiagnoseInputSection from '@/components/analysis/DiagnoseInputSection';
import DiagnoseResultsSection from '@/components/analysis/DiagnoseResultsSection';
import { diagnoseEngine } from './lib/gemini';
import { AnalysisState, UIState, FileUploadResult } from '@/lib/shared/types';

export default function Home() {
  const [uiState, setUIState] = useState<UIState>({
    inputText: '',
    fileContent: null,
    fileName: null,
  });

  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const handleInputChange = (text: string) => {
    setUIState(prev => ({ ...prev, inputText: text }));
    setAnalysisState(prev => ({ ...prev, error: null }));
  };

  const handleFileUpload = (fileResult: FileUploadResult) => {
    setUIState(prev => ({
      ...prev,
      fileContent: fileResult.content,
      fileName: fileResult.filename,
      inputText: prev.inputText + '\n\n' + fileResult.content,
    }));
    setAnalysisState(prev => ({ ...prev, error: null }));
  };

  const handleAnalyze = async () => {
    if (!uiState.inputText.trim()) {
      setAnalysisState(prev => ({ ...prev, error: '请输入要分析的内容' }));
      return;
    }

    setAnalysisState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      result: { result: '', timestamp: Date.now() }
    }));

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: uiState.inputText.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '分析失败');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                setAnalysisState(prev => ({
                  ...prev,
                  isLoading: false,
                }));
                break;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  accumulatedContent += parsed.content;
                  setAnalysisState(prev => ({
                    ...prev,
                    result: { 
                      result: accumulatedContent, 
                      timestamp: prev.result?.timestamp || Date.now() 
                    }
                  }));
                }
              } catch (e) {
                console.error('解析流数据失败:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      setAnalysisState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : '分析失败，请稍后重试',
        result: null
      }));
    }
  };

  const handleNewAnalysis = () => {
    setUIState({
      inputText: '',
      fileContent: null,
      fileName: null,
    });
    setAnalysisState({
      isLoading: false,
      error: null,
      result: null,
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      {/* 主要内容区域 - 垂直居中 */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            {!analysisState.result ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <DiagnoseInputSection
                  value={uiState.inputText}
                  onChange={handleInputChange}
                  onFileUpload={handleFileUpload}
                  isLoading={analysisState.isLoading}
                  onAnalyze={handleAnalyze}
                />

                {/* 文件信息显示 */}
                {uiState.fileName && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 rounded-2xl text-center"
                    style={{ 
                      backgroundColor: 'var(--surface-elevated)',
                      border: '1px solid var(--border-secondary)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <p className="text-sm font-medium" style={{ color: 'var(--accent-blue)' }}>
                      📎 已上传文件: {uiState.fileName}
                    </p>
                  </motion.div>
                )}

                {/* 错误提示 */}
                {analysisState.error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 rounded-2xl text-center"
                    style={{ 
                      backgroundColor: '#fff5f5',
                      border: '1px solid #fecaca',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <p className="text-sm font-medium" style={{ color: '#dc2626' }}>
                      ❌ {analysisState.error}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <DiagnoseResultsSection
                  result={analysisState.result}
                  onNewAnalysis={handleNewAnalysis}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="py-6 text-center text-xs magazine-subtitle" style={{ color: 'var(--text-tertiary)' }}>
        <p>
          © 2025 姜博士三加一诊断口令 - AI诊断平台 | 基于三加一模式的问题阶段诊断
        </p>
      </footer>
    </div>
  );
}
