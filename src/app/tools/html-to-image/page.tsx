'use client';

import React, { useState } from 'react';
import OriginalEditor from '@/components/tools/OriginalEditor';
import OriginalPreview from '@/components/tools/OriginalPreview';
import OriginalAspectRatioSelector from '@/components/tools/OriginalAspectRatioSelector';
import OriginalDownloadButton from '@/components/tools/OriginalDownloadButton';
import '@/styles/html-renderer.css';

function App() {
  const [html, setHtml] = useState('');
  const [renderedImage, setRenderedImage] = useState('');

  return (
    <div className="html-renderer-container">
      <div className="app">
        {/* Left Panel: Code Editor */}
        <div className="panel panel-editor">
          <OriginalEditor setHtml={setHtml} />
        </div>

        {/* Right Panel: Image Preview and Controls */}
        <div className="panel panel-preview">
          <OriginalAspectRatioSelector />

          <OriginalPreview 
            html={html} 
            aspectRatio="auto" 
            onRender={setRenderedImage} 
          />

          <OriginalDownloadButton imageUrl={renderedImage} />
        </div>
      </div>
    </div>
  );
}

export default App;