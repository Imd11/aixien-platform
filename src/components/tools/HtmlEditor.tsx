'use client';

import React from 'react';

const placeholderCode = `<div style="padding: 40px; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
  <h1 style="font-family: 'Arial', sans-serif; color: white; text-align: center; margin: 0 0 20px 0; font-size: 32px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
    HTML 转图像工具
  </h1>
  <p style="font-family: 'Arial', sans-serif; color: white; text-align: center; font-size: 18px; margin: 0; opacity: 0.9;">
    输入 HTML 代码，实时预览并下载为图像
  </p>
  <div style="margin-top: 30px; text-align: center;">
    <div style="display: inline-block; padding: 10px 20px; background: rgba(255,255,255,0.2); border-radius: 8px; backdrop-filter: blur(10px);">
      <span style="font-family: monospace; color: white; font-size: 14px;">由 AIXien 平台提供</span>
    </div>
  </div>
</div>`;

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function HtmlEditor({ value, onChange }: HtmlEditorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  React.useEffect(() => {
    if (!value) {
      onChange(placeholderCode);
    }
  }, [value, onChange]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">HTML 代码编辑器</h3>
        <p className="text-sm text-gray-600">在下方输入您的 HTML 代码，支持内联 CSS 样式</p>
      </div>
      
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={handleChange}
          spellCheck={false}
          className="w-full h-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{
            minHeight: '400px',
            backgroundColor: '#fafafa',
            lineHeight: '1.5'
          }}
          placeholder="请输入 HTML 代码..."
        />
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>💡 提示：支持完整的 HTML 和内联 CSS。建议使用内联样式以获得最佳渲染效果。</p>
      </div>
    </div>
  );
}