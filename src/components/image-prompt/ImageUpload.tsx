"use client";

import { Sparkles } from "lucide-react";
import { Button } from "./Button";
import { SimpleSelect } from "./Select";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// 文件名截断函数
const truncateFilename = (filename: string, maxLength = 25) => {
  if (filename.length <= maxLength) return filename;
  
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return `${filename.substring(0, maxLength - 3)}...`;
  }

  const extension = filename.substring(lastDotIndex);
  const nameWithoutExtension = filename.substring(0, lastDotIndex);
  
  if (nameWithoutExtension.length <= 10) {
    return `${nameWithoutExtension.substring(0, 5)}...${extension}`;
  }
  
  const charsToKeep = Math.floor((maxLength - 3 - extension.length) / 2);
  return `${nameWithoutExtension.substring(0, charsToKeep)}...${nameWithoutExtension.substring(nameWithoutExtension.length - charsToKeep)}${extension}`;
};

export interface ImageUploadProps {
  status: "idle" | "processing" | "generating" | "error";
  file?: File | null;
  setFile: (file: File | undefined) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  promptLang: string;
  onPromptLangChange: (lang: string) => void;
}

export const ImageUpload = ({
  status,
  file,
  setFile,
  handleSubmit,
  promptLang,
  onPromptLangChange,
}: ImageUploadProps) => {
  const { toast } = useToast();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleFileDrop = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }

    const selectedFile = files[0];
    
    // 检查文件类型
    if (!selectedFile.type.startsWith('image/')) {
      toast({
        title: "无效文件类型",
        description: "请选择图片文件（PNG、JPG、JPEG、WebP）",
        variant: "destructive"
      });
      return;
    }

    // 检查文件大小 (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "文件过大",
        description: "文件大小必须小于5MB",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    setImagePreviewUrl(URL.createObjectURL(selectedFile));
  }, [imagePreviewUrl, setFile, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileDrop(e.dataTransfer.files);
  }, [handleFileDrop]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileDrop(e.target.files);
  }, [handleFileDrop]);

  return (
    <div className="mx-auto max-w-lg">
      <form onSubmit={handleSubmit} className="relative mx-auto max-w-md px-4">
        <div className="relative">
          <div className="flex flex-col rounded-xl bg-white px-6 py-6 shadow-lg border border-gray-100 md:px-12 md:py-8">
            <label className="text-gray-600 font-medium mb-3" htmlFor="file">
              上传图片文件
            </label>
            
            <div
              className={`mt-2 flex flex-col aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
              } hover:border-blue-400 hover:bg-blue-25`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                required={!file}
              />
              
              <div className="text-center p-4">
                {file && imagePreviewUrl ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={imagePreviewUrl} 
                      alt="预览" 
                      className="max-h-40 max-w-full object-contain mb-3 rounded-md shadow-sm"
                    />
                    <p className="text-sm text-gray-600 truncate max-w-full px-2 font-medium">
                      {truncateFilename(file.name)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium mb-2">拖拽图片到这里</p>
                    <p className="text-gray-400 text-sm mb-4">或点击选择文件</p>
                    <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                      选择图片文件
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">
                      支持 PNG、JPG、JPEG、WebP 格式，最大5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <label className="mt-6 text-gray-600 font-medium mb-2" htmlFor="promptLang">
              生成提示词语言
            </label>
            <SimpleSelect
              value={promptLang}
              onValueChange={onPromptLangChange}
              className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              id="promptLang"
            >
              <option value="zh">中文</option>
              <option value="en">English</option>
            </SimpleSelect>
          </div>
          
          <div className="mt-8 text-center">
            <Button
              type="submit"
              className="w-60 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 md:w-auto flex items-center justify-center gap-2"
              disabled={status === "processing" || status === "generating" || !file}
            >
              <Sparkles className="w-5 h-5" />
              {status === "generating" ? "分析图片中..." : "开始分析图片"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};