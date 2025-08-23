'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, RotateCcw, CheckCircle, FileText } from 'lucide-react';
import { AnalysisResult } from '@/lib/shared/types';
import MarkdownRenderer from '@/components/shared/MarkdownRenderer';

interface SimpleResultsSectionProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

export default function SimpleResultsSection({ result, onNewAnalysis }: SimpleResultsSectionProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const fullText = `🧠 姜博士升维分析结果
分析时间：${new Date(result.timestamp).toLocaleString()}

${result.result}

---
分析完成时间：${new Date(result.timestamp).toLocaleString()}
    `.trim();

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const exportToMarkdown = () => {
    const markdownContent = `# 🧠 姜博士升维分析结果

**分析时间：** ${new Date(result.timestamp).toLocaleString()}

---

${result.result}

---

*分析完成时间：${new Date(result.timestamp).toLocaleString()}*
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `升维分析_${new Date(result.timestamp).toLocaleDateString()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToWord = () => {
    const wordContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>姜博士升维分析结果</title>
    <style>
        body {
            font-family: "Microsoft YaHei", "SimSun", Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
            color: #333;
        }
        h1 {
            color: #007bff;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }
        h2 {
            color: #28a745;
            margin-top: 30px;
        }
        .meta {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .content {
            white-space: pre-line;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>🧠 姜博士升维分析结果</h1>
    
    <div class="meta">
        <strong>分析时间：</strong> ${new Date(result.timestamp).toLocaleString()}
    </div>
    
    <div class="content">${result.result.replace(/\n/g, '<br>')}</div>
    
    <hr>
    
    <div class="meta">
        <em>分析完成时间：${new Date(result.timestamp).toLocaleString()}</em>
    </div>
</body>
</html>`;

    const blob = new Blob([wordContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `升维分析_${new Date(result.timestamp).toLocaleDateString()}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          className="flex items-center justify-center gap-3 mb-4"
        >
          <h2 
            className="text-4xl tracking-tight magazine-title"
            style={{ color: 'var(--text-primary)' }}
          >
            升维分析结果
          </h2>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-base magazine-subtitle"
          style={{ color: 'var(--text-secondary)' }}
        >
          分析时间: {new Date(result.timestamp).toLocaleString()}
        </motion.p>
      </div>

      {/* 分析内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mb-12 max-w-4xl mx-auto"
      >
        <div className="p-8 text-left">
          <MarkdownRenderer 
            content={result.result}
            className="text-lg leading-relaxed magazine-body"
            style={{ 
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </motion.div>

      {/* 操作按钮区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="flex flex-wrap gap-4 justify-center mb-8"
      >
        {/* 复制按钮 */}
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={copyToClipboard}
          className="inline-flex items-center px-8 py-3 font-medium transition-all duration-200 magazine-body"
          style={{
            borderRadius: 'var(--radius-md)',
            backgroundColor: copied ? 'var(--accent-success)' : 'var(--accent-blue)',
            color: 'white',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(255,255,255,0.2)',
            letterSpacing: '0.02em'
          }}
        >
          {copied ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              已复制
            </>
          ) : (
            <>
              <Copy className="w-5 h-5 mr-2" />
              复制全文
            </>
          )}
        </motion.button>

        {/* 导出Markdown按钮 */}
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportToMarkdown}
          className="inline-flex items-center px-8 py-3 font-medium transition-all duration-200 magazine-body"
          style={{
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-gold)',
            color: 'white',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(255,255,255,0.2)',
            letterSpacing: '0.02em'
          }}
        >
          <FileText className="w-5 h-5 mr-2" />
          导出MD
        </motion.button>

        {/* 导出Word按钮 */}
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportToWord}
          className="inline-flex items-center px-8 py-3 font-medium transition-all duration-200 magazine-body"
          style={{
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-gray)',
            color: 'white',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(255,255,255,0.2)',
            letterSpacing: '0.02em'
          }}
        >
          <Download className="w-5 h-5 mr-2" />
          导出Word
        </motion.button>

        {/* 新分析按钮 */}
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewAnalysis}
          className="inline-flex items-center px-8 py-3 font-medium transition-all duration-200 magazine-body"
          style={{
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(255,255,255,0.2)',
            letterSpacing: '0.02em'
          }}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          新分析
        </motion.button>
      </motion.div>

      {/* 底部提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-center"
      >
        <p 
          className="text-sm magazine-subtitle"
          style={{ color: 'var(--text-tertiary)' }}
        >
          💡 基于姜汝祥博士的第一性原理分析框架
        </p>
      </motion.div>
    </motion.div>
  );
}