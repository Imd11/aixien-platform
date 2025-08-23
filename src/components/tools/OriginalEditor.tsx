'use client';

import React from 'react';

// A simple placeholder for some initial HTML content
const placeholderCode = `
<div style="padding: 40px; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);">
  <h1 style="font-family: sans-serif; color: white; text-align: center;">
    Hello, World!
  </h1>
  <p style="font-family: sans-serif; color: white; text-align: center; font-size: 18px;">
    This is rendered by Live HTML Renderer.
  </p>
</div>
`;

interface OriginalEditorProps {
  setHtml: (html: string) => void;
}

function OriginalEditor({ setHtml }: OriginalEditorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtml(event.target.value);
  };

  // Set initial value on mount
  React.useEffect(() => {
    setHtml(placeholderCode);
  }, [setHtml]);

  return (
    <div className="editor-container">
      <textarea
        className="editor-textarea"
        defaultValue={placeholderCode}
        onChange={handleChange}
        spellCheck="false"
      />
    </div>
  );
}

export default OriginalEditor;