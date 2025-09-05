import { NextRequest } from 'next/server';
import { createStreamingResponse } from '@/lib/shared/streamingConfig';
import { TELIAN_MODEL_PROMPT } from '@/app/telian-model/lib/prompts';
import { telianKnowledgeFetcher } from '@/app/telian-model/lib/github-content';

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    
    if (!content || content.trim().length === 0) {
      return new Response(JSON.stringify({ error: '请提供要分析的员工问题' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取GitHub知识库内容
    let knowledge = '';
    try {
      console.log('开始获取特连光电知识库...');
      // 在服务端环境中直接获取，避免客户端CORS问题
      knowledge = await telianKnowledgeFetcher.fetchAllMarkdownFiles();
      console.log('知识库获取成功');
    } catch (error) {
      console.error('获取知识库失败，使用备用内容:', error);
      // 使用备用内容
      knowledge = `# 特连光电知识库（备用版本）

## 核心管理理念

### 客户价值导向
- 一切以客户价值为中心
- 客户价值即大海，是企业发展的根本方向
- 问题即潜在利润，每个问题都是改进的机会

### 管理原则
- 日结果与日计划管理
- 百分百责任制
- 职业化标准执行
- 持续改进与创新

### 四阶段思维模型
1. 拥抱冲突（木材思维）- 识别问题
2. 肯定利益（承认差异）- 理解多元
3. 找到真利益（价值标准）- 价值判断
4. 向往大海（共同利益）- 协同共赢

注：GitHub知识库暂时无法访问，使用核心理论进行分析。`;
    }

    // 组合完整的提示词
    const fullPrompt = TELIAN_MODEL_PROMPT.replace('{knowledge}', knowledge) + content;

    // 创建流式响应
    const response = await createStreamingResponse(fullPrompt, '', 'TELIAN_MODEL');
    
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
    console.error('Telian Model API error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : '分析失败，请稍后重试' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}