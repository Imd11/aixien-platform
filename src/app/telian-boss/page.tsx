'use client';

import React, { useState, useCallback, useRef } from 'react';
import { FileUploadResult, AnalysisResult } from '@/lib/shared/types';
import InputSection from '@/components/telian-boss/InputSection';
import ResultsSection from '@/components/telian-boss/ResultsSection';
import { AnimatePresence } from 'framer-motion';

export default function TelianBossAnalysisPage() {
  const [inputContent, setInputContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileUpload = useCallback((result: FileUploadResult) => {
    setInputContent((prev) => {
      const separator = prev.trim() ? '\n\n' : '';
      return `${prev}${separator}${result.content}`;
    });
  }, []);

  const handleAnalysis = useCallback(async () => {
    if (!inputContent.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setStreamingContent('');
    setAnalysisResult(null);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/telian-boss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: inputContent }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data.trim()) {
              try {
                const parsed = JSON.parse(data);
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
                if (parsed.text) {
                  accumulatedContent += parsed.text;
                  setStreamingContent(accumulatedContent);
                }
                if (parsed.done) {
                  setAnalysisResult({
                    result: accumulatedContent,
                    timestamp: Date.now(),
                  });
                  setStreamingContent('');
                  break;
                }
              } catch (e) {
                console.error('解析错误:', e);
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('分析错误:', error);
        setAnalysisResult({
          result: `分析过程中出现错误: ${error.message || '未知错误'}`,
          timestamp: Date.now(),
        });
      }
    } finally {
      setIsAnalyzing(false);
      abortControllerRef.current = null;
    }
  }, [inputContent, isAnalyzing]);

  const handleNewAnalysis = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setInputContent('');
    setAnalysisResult(null);
    setStreamingContent('');
    setIsAnalyzing(false);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {!analysisResult && !streamingContent ? (
            <InputSection
              key="input"
              value={inputContent}
              onChange={setInputContent}
              onFileUpload={handleFileUpload}
              isLoading={isAnalyzing}
              onAnalyze={handleAnalysis}
            />
          ) : (
            <ResultsSection
              key="results"
              result={
                analysisResult || {
                  result: streamingContent,
                  timestamp: Date.now(),
                }
              }
              onNewAnalysis={handleNewAnalysis}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}