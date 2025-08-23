'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { FileProcessor } from '@/lib/analysis/fileProcessor';
import { FileUploadResult } from '@/lib/shared/types';

interface CustomerValueInputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onFileUpload: (result: FileUploadResult) => void;
  isLoading: boolean;
  onAnalyze: () => void;
}

export default function CustomerValueInputSection({
  value,
  onChange,
  onFileUpload,
  isLoading,
  onAnalyze
}: CustomerValueInputSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    try {
      const validation = FileProcessor.validateFile(file);
      if (!validation.isValid) {
        setUploadError(validation.error || '文件验证失败');
        return;
      }

      const result = await FileProcessor.processFile(file);
      onFileUpload(result);
      setUploadError(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : '文件处理失败');
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setUploadError(null);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    await processFile(files[0]);
  }, [processFile]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    await processFile(files[0]);
  }, [processFile]);

  const handleClear = () => {
    onChange('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const canAnalyze = value.trim().length > 0 && !isLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full text-center"
    >
      {/* 标题区域 */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-4"
        >
          <h1 
            className="text-6xl text-center tracking-tight magazine-title"
            style={{ color: 'var(--text-primary)' }}
          >
            姜博士客户价值六件套
          </h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-lg magazine-subtitle"
          style={{ color: 'var(--text-secondary)' }}
        >
          基于客户价值六件套的深度分析
        </motion.p>
      </div>

      {/* 输入区域 */}
      <div className="space-y-8 w-full flex flex-col items-center">
        {/* 主要输入框 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="请输入您要分析的客户相关内容，或者上传文件进行分析..."
            className="w-full h-40 p-6 text-lg border-2 transition-all duration-200 resize-none magazine-body"
            style={{
              borderRadius: 'var(--radius-md)',
              borderColor: 'var(--border-primary)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-md)',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--border-focus)';
              e.target.style.boxShadow = 'var(--shadow-focus)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-primary)';
              e.target.style.boxShadow = 'var(--shadow-md)';
            }}
            disabled={isLoading}
          />
          
          {/* 字符计数和清空按钮 */}
          <div className="flex justify-between items-center mt-3 text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>
              {value.length} 字符
            </span>
            {value.length > 0 && (
              <button
                onClick={handleClear}
                className="font-medium transition-colors duration-200"
                style={{ color: 'var(--accent-blue)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-blue-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--accent-blue)';
                }}
                disabled={isLoading}
              >
                清空内容
              </button>
            )}
          </div>
        </motion.div>

        {/* 开始分析按钮 - 固定显示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="w-full max-w-2xl text-center"
        >
          <button
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className="px-16 py-4 text-lg font-semibold transition-all duration-200 magazine-body"
            style={{
              borderRadius: 'var(--radius-md)',
              backgroundColor: canAnalyze ? 'var(--accent-primary)' : 'var(--border-secondary)',
              color: canAnalyze ? 'white' : 'var(--text-secondary)',
              boxShadow: canAnalyze ? 'var(--shadow-lg)' : 'none',
              cursor: canAnalyze ? 'pointer' : 'not-allowed',
              border: 'none',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              if (canAnalyze) {
                e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }
            }}
            onMouseLeave={(e) => {
              if (canAnalyze) {
                e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }
            }}
          >
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: 'var(--text-secondary)' }}
                />
                <span>分析中...</span>
              </div>
            ) : (
              '开始分析'
            )}
          </button>
        </motion.div>

        {/* 文件上传区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          <div
            className={`border-2 border-dashed p-8 transition-all duration-200 ${
              isDragOver ? 'scale-[1.02]' : ''
            }`}
            style={{
              borderRadius: 'var(--radius-md)',
              borderColor: isDragOver ? 'var(--accent-blue)' : 'var(--border-primary)',
              backgroundColor: isDragOver ? 'rgba(43, 108, 176, 0.05)' : 'transparent'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload 
                  className="w-12 h-12" 
                  style={{ color: isDragOver ? 'var(--accent-blue)' : 'var(--text-secondary)' }} 
                />
              </div>
              
              <div>
                <p 
                  className="text-lg font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  📎 拖拽文件到此处上传
                </p>
                <p 
                  className="text-sm mt-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  支持 .txt .docx .pdf .md 格式，最大 10MB
                </p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-6 py-3 font-medium transition-all duration-200 magazine-body"
                style={{
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-blue)',
                  color: 'white',
                  border: 'none',
                  letterSpacing: '0.02em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-blue-hover)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-blue)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                disabled={isLoading}
              >
                <FileText className="w-4 h-4 mr-2" />
                选择文件
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".txt,.docx,.pdf,.md"
              className="hidden"
              disabled={isLoading}
            />
          </div>
        </motion.div>

        {/* 错误提示 */}
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3 p-4"
            style={{ 
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fff5f5',
              border: '1px solid #fecaca'
            }}
          >
            <AlertCircle className="w-5 h-5" style={{ color: '#c62828' }} />
            <span className="text-sm font-medium" style={{ color: '#dc2626' }}>
              {uploadError}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}