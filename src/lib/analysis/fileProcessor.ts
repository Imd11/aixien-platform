import mammoth from 'mammoth';
import { FileUploadResult } from '@/types';

export class FileProcessor {
  static async processFile(file: File): Promise<FileUploadResult> {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    switch (fileExtension) {
      case 'txt':
      case 'md':
        return this.processTextFile(file);
      case 'docx':
        return this.processDocxFile(file);
      case 'pdf':
        return this.processPdfFile(file);
      default:
        throw new Error(`不支持的文件格式: ${fileExtension}`);
    }
  }

  private static async processTextFile(file: File): Promise<FileUploadResult> {
    try {
      const content = await file.text();
      return {
        content,
        filename: file.name,
        type: 'text'
      };
    } catch {
      throw new Error('读取文本文件失败');
    }
  }

  private static async processDocxFile(file: File): Promise<FileUploadResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return {
        content: result.value,
        filename: file.name,
        type: 'docx'
      };
    } catch {
      throw new Error('读取Word文档失败');
    }
  }

  private static async processPdfFile(file: File): Promise<FileUploadResult> {
    try {
      // 注意: pdf-parse 在浏览器端有限制，这里提供一个简化的实现
      // 在生产环境中，建议使用服务端API来处理PDF文件
      
      // 简化的PDF文本提取（实际应用中需要更复杂的处理）
      const content = "PDF文件已上传，但需要服务端处理来提取文本内容。当前为演示版本。";
      
      return {
        content,
        filename: file.name,
        type: 'pdf'
      };
    } catch {
      throw new Error('读取PDF文件失败');
    }
  }

  static validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['txt', 'docx', 'pdf', 'md'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return {
        isValid: false,
        error: `不支持的文件格式。支持的格式: ${allowedTypes.join(', ')}`
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: '文件大小不能超过10MB'
      };
    }

    return { isValid: true };
  }
}