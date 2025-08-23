'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import { Loader2 } from 'lucide-react';

interface HtmlPreviewProps {
  html: string;
  onRender: (dataUrl: string) => void;
}

export default function HtmlPreview({ html, onRender }: HtmlPreviewProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const renderNodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!html || !renderNodeRef.current) {
      setImageUrl('');
      onRender('');
      return;
    }

    const node = renderNodeRef.current;
    setError(null);

    const debounceTimeout = setTimeout(() => {
      setLoading(true);

      htmlToImage.toPng(node, { 
        cacheBust: true, 
        pixelRatio: 1.5,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      })
        .then((dataUrl) => {
          setImageUrl(dataUrl);
          onRender(dataUrl);
        })
        .catch((err) => {
          console.error('渲染失败:', err);
          setError('渲染失败，请检查您的 HTML 代码');
          setImageUrl('');
          onRender('');
        })
        .finally(() => {
          setLoading(false);
        });

    }, 500);

    return () => clearTimeout(debounceTimeout);

  }, [html, onRender]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">实时预览</h3>
        <p className="text-sm text-gray-600">HTML 代码的实时渲染效果</p>
      </div>
      
      <div className="flex-1 relative border border-gray-300 rounded-lg overflow-hidden bg-white">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="text-sm text-gray-600">正在渲染...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 bg-red-50 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <p className="text-red-600 font-medium">{error}</p>
              <p className="text-sm text-red-500 mt-2">请检查 HTML 语法是否正确</p>
            </div>
          </div>
        )}
        
        {!loading && !error && imageUrl && (
          <div className="p-4 flex items-center justify-center h-full">
            <img 
              className="max-w-full max-h-full object-contain border border-gray-200 rounded shadow-sm" 
              src={imageUrl} 
              alt="HTML 渲染预览" 
            />
          </div>
        )}
        
        {!loading && !error && !imageUrl && html && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="text-gray-400 text-4xl mb-4">📄</div>
              <p className="text-gray-500">等待渲染...</p>
            </div>
          </div>
        )}
        
        {!html && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="text-gray-400 text-4xl mb-4">✏️</div>
              <p className="text-gray-500">在左侧输入 HTML 代码开始</p>
            </div>
          </div>
        )}
      </div>

      {/* 隐藏的渲染节点 */}
      <div style={{ position: 'fixed', top: '-200vh', left: 0 }}>
        <div 
          ref={renderNodeRef} 
          style={{ 
            display: 'inline-block', 
            width: 'fit-content', 
            height: 'fit-content' 
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>🎯 预览会自动根据内容调整大小。点击下载按钮可保存为 PNG 图片。</p>
      </div>
    </div>
  );
}