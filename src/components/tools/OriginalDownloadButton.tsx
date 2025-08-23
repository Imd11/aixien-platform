'use client';

import React from 'react';

// A simple, inline SVG for the download icon
const DownloadIcon = () => (
  <svg className="download-icon" fill="none" viewBox="0 0 24 24">
    <path d="M12 15V3m0 12l-4-4m4 4l4-4"/>
    <path d="M3 17h18v4H3z"/>
  </svg>
);

interface OriginalDownloadButtonProps {
  imageUrl: string;
  filename?: string;
}

function OriginalDownloadButton({ imageUrl, filename = 'rendered-image.png' }: OriginalDownloadButtonProps) {
  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="download-button-container">
      <button 
        className="download-button" 
        onClick={handleDownload} 
        disabled={!imageUrl}
      >
        <DownloadIcon />
        <span>Download Image</span>
      </button>
    </div>
  );
}

export default OriginalDownloadButton;