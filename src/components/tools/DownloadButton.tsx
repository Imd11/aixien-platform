'use client';

import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';

interface DownloadButtonProps {
  imageUrl: string;
  filename?: string;
}

export default function DownloadButton({ imageUrl, filename = 'html-render.png' }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!imageUrl) return;

    setIsDownloading(true);

    try {
      // 创建下载链接
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 显示成功状态
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (error) {
      console.error('下载失败:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const isDisabled = !imageUrl || isDownloading;

  return (
    <div className="flex flex-col items-center gap-4">
      <button 
        className={`
          inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
          ${isDisabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : downloaded 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
          }
          ${!isDisabled && !downloaded ? 'hover:shadow-lg transform hover:-translate-y-0.5' : ''}
        `}
        onClick={handleDownload}
        disabled={isDisabled}
      >
        {downloaded ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            下载成功
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            {isDownloading ? '下载中...' : '下载图片'}
          </>
        )}
      </button>
      
      {!imageUrl && (
        <p className="text-sm text-gray-500 text-center">
          请先在左侧输入 HTML 代码并等待渲染完成
        </p>
      )}
      
      {imageUrl && (
        <div className="text-xs text-gray-500 text-center">
          <p>📁 文件名: {filename}</p>
          <p>🎨 格式: PNG (高清晰度)</p>
        </div>
      )}
    </div>
  );
}