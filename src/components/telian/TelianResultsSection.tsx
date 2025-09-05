'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, RotateCcw, CheckCircle, FileText, Users, BrainCircuit } from 'lucide-react';
import { AnalysisResult } from '@/lib/shared/types';
import MarkdownRenderer from '@/components/shared/MarkdownRenderer';

interface TelianResultsSectionProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

export default function TelianResultsSection({ result, onNewAnalysis }: TelianResultsSectionProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const fullText = `🏢 特连光电模式员工问题分析报告
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
    const markdownContent = `# 🏢 特连光电模式员工问题分析报告

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
    a.download = `特连光电分析报告_${new Date(result.timestamp).toLocaleDateString()}.md`;
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
    <title>特连光电模式员工问题分析报告</title>
    <style>
        body {
            font-family: "Microsoft YaHei", "SimSun", Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
            color: #333;
        }
        h1 {
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        h2 {
            color: #764ba2;
            margin-top: 30px;
        }
        h3 {
            color: #555;
            margin-top: 20px;
        }
        ul {
            padding-left: 30px;
        }
        li {
            margin: 5px 0;
        }
        blockquote {
            border-left: 3px solid #667eea;
            padding-left: 20px;
            margin: 20px 0;
            color: #666;
            font-style: italic;
        }
        code {
            background: #f4f4f4;
            padding: 2px 5px;
            border-radius: 3px;
        }
        pre {
            background: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>🏢 特连光电模式员工问题分析报告</h1>
    <p><strong>分析时间：</strong> ${new Date(result.timestamp).toLocaleString()}</p>
    <hr>
    ${result.result.replace(/\n/g, '<br>').replace(/#{3,6} (.*)/g, '<h4>$1</h4>').replace(/#{2} (.*)/g, '<h3>$1</h3>').replace(/#{1} (.*)/g, '<h2>$1</h2>')}
    <hr>
    <p><em>分析完成时间：${new Date(result.timestamp).toLocaleString()}</em></p>
</body>
</html>`;

    const blob = new Blob([wordContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `特连光电分析报告_${new Date(result.timestamp).toLocaleDateString()}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="magazine-title mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          分析报告已生成
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="magazine-subtitle"
          style={{ color: 'var(--text-secondary)' }}
        >
          基于特连光电管理模式的深度分析
        </motion.p>
      </div>

      {/* 工具栏 */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
          style={{ 
            backgroundColor: copied ? '#10b981' : 'var(--surface-elevated)',
            color: copied ? 'white' : 'var(--text-secondary)',
            border: '1px solid var(--border-secondary)'
          }}
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm">复制结果</span>
            </>
          )}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToMarkdown}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
          style={{ 
            backgroundColor: 'var(--surface-elevated)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-secondary)'
          }}
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm">导出 Markdown</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToWord}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
          style={{ 
            backgroundColor: 'var(--surface-elevated)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-secondary)'
          }}
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">导出 Word</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewAnalysis}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">新的分析</span>
        </motion.button>
      </div>

      {/* 结果展示区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-3xl overflow-hidden"
        style={{ 
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border-secondary)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div 
          className="p-8 md:p-12"
          style={{ 
            background: 'linear-gradient(180deg, var(--surface-elevated) 0%, var(--background) 100%)'
          }}
        >
          <div className="prose prose-lg max-w-none">
            <MarkdownRenderer content={result.result} />
          </div>
        </div>
        
        {/* 底部时间戳 */}
        <div 
          className="px-8 py-4 text-center"
          style={{ 
            borderTop: '1px solid var(--border-secondary)',
            backgroundColor: 'var(--background)'
          }}
        >
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            分析完成于 {new Date(result.timestamp).toLocaleString('zh-CN')}
          </p>
        </div>
      </motion.div>

      {/* 额外信息 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 p-6 rounded-2xl text-center"
        style={{ 
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-secondary)'
        }}
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <Users className="w-5 h-5" style={{ color: 'var(--accent-purple)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            关于特连光电模式
          </h3>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          本分析基于特连光电管理模式和第一性原理，结合实际案例知识库，
          为员工问题提供系统性的解决方案和成长路径指导。
        </p>
      </motion.div>
    </>
  );
}