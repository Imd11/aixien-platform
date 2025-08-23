'use client';

import React, { useState, useEffect } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function MarkdownRenderer({ content, className = '', style }: MarkdownRendererProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 如果还在服务端，显示纯文本
  if (!isClient) {
    return (
      <div className={`whitespace-pre-wrap ${className}`} style={style}>
        {content}
      </div>
    );
  }

  // 简单的Markdown解析函数
  const renderMarkdown = (text: string) => {
    // 分行处理
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    let listItems: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const flushList = () => {
      if (listItems.length > 0 && listType) {
        const ListComponent = listType === 'ul' ? 'ul' : 'ol';
        elements.push(
          <ListComponent key={elements.length} className="mb-4 pl-6 space-y-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: processInlineMarkdown(item) }} />
            ))}
          </ListComponent>
        );
        listItems = [];
        listType = null;
      }
    };

    const processInlineMarkdown = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-black">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-black">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-black">$1</code>');
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // 空行
      if (!trimmedLine) {
        flushList();
        return;
      }

      // 标题
      if (trimmedLine.startsWith('#### ')) {
        flushList();
        const title = trimmedLine.substring(5);
        elements.push(
          <h4 key={elements.length} className="text-lg font-semibold mb-3 text-gray-700 mt-5" dangerouslySetInnerHTML={{ __html: processInlineMarkdown(title) }} />
        );
      } else if (trimmedLine.startsWith('### ')) {
        flushList();
        const title = trimmedLine.substring(4);
        elements.push(
          <h3 key={elements.length} className="text-xl font-semibold mb-4 text-purple-700 mt-6" dangerouslySetInnerHTML={{ __html: processInlineMarkdown(title) }} />
        );
      } else if (trimmedLine.startsWith('## ')) {
        flushList();
        const title = trimmedLine.substring(3);
        elements.push(
          <h2 key={elements.length} className="text-2xl font-semibold mb-5 text-green-700 mt-8" dangerouslySetInnerHTML={{ __html: processInlineMarkdown(title) }} />
        );
      } else if (trimmedLine.startsWith('# ')) {
        flushList();
        const title = trimmedLine.substring(2);
        elements.push(
          <h1 key={elements.length} className="text-3xl font-bold mb-6 text-blue-700 border-b-2 border-blue-200 pb-2" dangerouslySetInnerHTML={{ __html: processInlineMarkdown(title) }} />
        );
      }
      // 无序列表
      else if (trimmedLine.match(/^[-*+]\s/)) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        listItems.push(trimmedLine.substring(2));
      }
      // 有序列表
      else if (trimmedLine.match(/^\d+\.\s/)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        const match = trimmedLine.match(/^\d+\.\s(.*)$/);
        if (match) {
          listItems.push(match[1]);
        }
      }
      // 引用
      else if (trimmedLine.startsWith('> ')) {
        flushList();
        const quote = trimmedLine.substring(2);
        elements.push(
          <blockquote key={elements.length} className="border-l-4 border-blue-400 pl-4 py-2 mb-4 bg-blue-50 italic text-gray-700" dangerouslySetInnerHTML={{ __html: processInlineMarkdown(quote) }} />
        );
      }
      // 水平线
      else if (trimmedLine === '---' || trimmedLine === '***') {
        flushList();
        elements.push(
          <hr key={elements.length} className="my-8 border-t-2 border-gray-200" />
        );
      }
      // 普通段落
      else {
        flushList();
        elements.push(
          <p key={elements.length} className="mb-4 leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: processInlineMarkdown(trimmedLine) }} />
        );
      }
    });

    // 处理剩余的列表
    flushList();

    return elements;
  };

  return (
    <div className={`markdown-content ${className}`} style={style}>
      {renderMarkdown(content)}
    </div>
  );
}
