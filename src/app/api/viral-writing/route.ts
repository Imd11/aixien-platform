import { NextRequest } from 'next/server';
import { createStreamingResponse, parseSSEData } from '@/lib/shared/streamingConfig';
import { VIRAL_WRITING_PROMPT } from '@/app/viral-writing/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    
    if (!content || content.trim().length === 0) {
      return new Response(JSON.stringify({ error: '请提供要分析的内容' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await createStreamingResponse(VIRAL_WRITING_PROMPT, content, 'VIRAL_WRITING');
    
    // 创建一个TransformStream来处理SSE格式
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true });
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.trim()) {
            const content = parseSSEData(line);
            if (content !== null) {
              // 发送SSE格式的数据
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
        }
      },
      flush(controller) {
        // 发送结束标记
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      }
    });

    // 返回流式响应
    return new Response(response.body?.pipeThrough(transformStream), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Viral Writing API error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : '分析失败，请稍后重试' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}