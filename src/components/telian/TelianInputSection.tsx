'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, Users, BrainCircuit } from 'lucide-react';
import { FileProcessor } from '@/lib/analysis/fileProcessor';
import { FileUploadResult } from '@/lib/shared/types';

interface TelianInputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onFileUpload: (result: FileUploadResult) => void;
  isLoading: boolean;
  onAnalyze: () => void;
}

export default function TelianInputSection({
  value,
  onChange,
  onFileUpload,
  isLoading,
  onAnalyze
}: TelianInputSectionProps) {
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

  return (
    <>
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.2)'
          }}
        >
          <Users className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="magazine-title mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          特连光电模式（员工版）
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="magazine-subtitle"
          style={{ color: 'var(--text-secondary)' }}
        >
          基于第一性原理的员工问题深度分析 • 价值对齐导航系统
        </motion.p>
      </div>

      {/* 输入区域 */}
      <div
        className={`rounded-3xl transition-all duration-300 ${isDragOver ? 'scale-105' : ''}`}
        style={{ 
          backgroundColor: 'var(--surface-elevated)',
          border: `2px dashed ${isDragOver ? 'var(--accent-blue)' : 'var(--border-secondary)'}`,
          boxShadow: isDragOver ? 'var(--shadow-lg)' : 'var(--shadow-md)',
          padding: 'var(--spacing-xl)'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              <BrainCircuit className="w-4 h-4" />
              输入员工问题描述
            </label>
            {value && (
              <button
                onClick={handleClear}
                className="text-xs px-3 py-1.5 rounded-full transition-colors"
                style={{ 
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-tertiary)',
                }}
              >
                清空
              </button>
            )}
          </div>
          
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="请输入需要分析的员工问题，包括【企业】、【姓名】、【部门】信息以及具体问题描述..."
            className="w-full h-48 px-4 py-3 rounded-2xl resize-none transition-all magazine-body"
            style={{ 
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-size-md)',
              lineHeight: 'var(--line-height-relaxed)'
            }}
          />
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              已输入 {value.length} 字符
            </p>
          </div>
        </div>

        {/* 文件上传区域 */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-secondary)' }} />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              或上传文件
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-secondary)' }} />
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 rounded-2xl border-2 border-dashed transition-all hover:scale-105 flex items-center justify-center gap-3"
            style={{ 
              borderColor: 'var(--border-secondary)',
              backgroundColor: 'var(--background)',
            }}
          >
            <Upload className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              点击上传 Word 或 PDF 文档
            </span>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {uploadError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-3 rounded-xl"
              style={{ backgroundColor: '#fee2e2' }}
            >
              <AlertCircle className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-700">{uploadError}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* 分析按钮 */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAnalyze}
        disabled={isLoading || !value.trim()}
        className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all flex items-center justify-center gap-3 ${
          isLoading || !value.trim() 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:shadow-xl'
        }`}
        style={{ 
          background: isLoading || !value.trim() 
            ? 'var(--border-secondary)' 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: 'var(--font-size-md)'
        }}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>AI正在深度分析中...</span>
          </>
        ) : (
          <>
            <BrainCircuit className="w-5 h-5" />
            <span>开始员工问题分析</span>
          </>
        )}
      </motion.button>
    </>
  );
}