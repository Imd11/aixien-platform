'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';

interface OriginalPreviewProps {
  html: string;
  aspectRatio: string;
  onRender: (dataUrl: string) => void;
}

function OriginalPreview({ html, onRender }: OriginalPreviewProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const renderNodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!html || !renderNodeRef.current) return;

    const node = renderNodeRef.current;

    const debounceTimeout = setTimeout(() => {
      setLoading(true);

      // Call the library without any dimension options.
      // It will capture the node based on its natural, CSS-driven size.
      htmlToImage.toPng(node, { cacheBust: true, pixelRatio: 1.5 })
        .then((dataUrl) => {
          setImageUrl(dataUrl);
          onRender(dataUrl);
        })
        .catch((err) => {
          console.error('oops, something went wrong!', err);
          onRender('');
        })
        .finally(() => {
          setLoading(false);
        });

    }, 500);

    return () => clearTimeout(debounceTimeout);

  }, [html, onRender]);

  return (
    <div className="preview-container">
      <div className="preview-content">
        {loading && <div className="loading-spinner"></div>}
        {!loading && imageUrl && <img className="preview-image" src={imageUrl} alt="Rendered HTML" />}
      </div>

      {/* 
        Hidden node for rendering.
        The inline styles are CRITICAL for true auto-sizing.
        - position: fixed & top: -200vh: Puts it off-screen.
        - display: inline-block: Allows it to have a size based on content.
        - width/height: fit-content: The key to making the container size itself to its children.
      */}
      <div style={{ position: 'fixed', top: '-200vh', left: 0 }}>
        <div 
          ref={renderNodeRef} 
          style={{ display: 'inline-block', width: 'fit-content', height: 'fit-content' }}
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      </div>
    </div>
  );
}

export default OriginalPreview;