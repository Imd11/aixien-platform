import { NextRequest } from 'next/server';
import { createStreamingResponse } from '@/lib/shared/streamingConfig';
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
    let buffer = ''; // 缓冲未完成的行
    
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true });
        // 将缓冲的内容和新内容合并
        const lines = (buffer + text).split('\n');
        
        // 最后一行可能不完整，保存到缓冲区
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim() && line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6);
              if (jsonStr === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                break;
              }
              
              const parsed = JSON.parse(jsonStr);
              // 处理OpenAI格式的流式响应
              if (parsed.choices?.[0]) {
                const choice = parsed.choices[0];
                let content = '';
                
                // 支持不同的响应格式
                if (choice.delta?.content) {
                  content = choice.delta.content;
                } else if (choice.message?.content) {
                  content = choice.message.content;
                } else if (choice.text) {
                  content = choice.text;
                }
                
                if (content) {
                  // 转义内容中的特殊字符，确保JSON有效
                  const safeContent = content.replace(/\\/g, '\\\\')
                                            .replace(/"/g, '\\"')
                                            .replace(/\n/g, '\\n')
                                            .replace(/\r/g, '\\r')
                                            .replace(/\t/g, '\\t');
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: safeContent })}\n\n`));
                }
              }
            } catch (e) {
              console.error('解析流式数据失败:', e, 'line:', line);
            }
          }
        }
      },
      flush(controller) {
        // 处理缓冲区中剩余的数据
        if (buffer.trim() && buffer.startsWith('data: ')) {
          try {
            const jsonStr = buffer.slice(6);
            if (jsonStr !== '[DONE]') {
              const parsed = JSON.parse(jsonStr);
              if (parsed.choices?.[0]?.delta?.content) {
                const content = parsed.choices[0].delta.content;
                const safeContent = content.replace(/\\/g, '\\\\')
                                          .replace(/"/g, '\\"')
                                          .replace(/\n/g, '\\n')
                                          .replace(/\r/g, '\\r')
                                          .replace(/\t/g, '\\t');
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: safeContent })}\n\n`));
              }
            }
          } catch (e) {
            console.error('处理缓冲数据失败:', e);
          }
        }
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