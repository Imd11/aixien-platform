import { NextRequest } from 'next/server';
import { createStreamingResponse } from '@/lib/shared/streamingConfig';
import { getGithubKnowledgeBase } from '@/app/telian-boss/lib/github-content';
import { TELIAN_BOSS_PROMPT } from '@/app/telian-boss/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    
    if (!content || content.trim().length === 0) {
      return new Response(JSON.stringify({ error: '请提供要分析的企业经营问题' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取GitHub知识库内容，设置超时限制
    let knowledge = '';
    try {
      console.log('开始获取特连光电知识库...');
      // 使用Promise.race设置10秒超时
      const fetchPromise = getGithubKnowledgeBase();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('GitHub知识库获取超时')), 10000)
      );
      
      knowledge = await Promise.race([fetchPromise, timeoutPromise]) as string;
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

### 特连管理方法论
- 客户价值导向思维
- 问题即利润的转化机制
- 百分百责任制实施
- 日清日结管理模式
- 持续改进循环体系

### 组织文化
- 拥抱冲突，解决问题
- 承认差异，寻找共识
- 价值判断，追求真理
- 协同共赢，创造价值

注：GitHub知识库暂时无法访问，使用核心理论进行分析。`;
    }

    // 组合完整的提示词
    const fullPrompt = `
${TELIAN_BOSS_PROMPT}

背景知识库（特连光电公司信息）：
${knowledge}

现在，请基于以上要求为我输入的企业家提出的问题生成对应的问题分析报告。

用户输入的问题如下：
${content}
`;

    // 创建流式响应 - 使用与其他页面相同的配置
    const response = await createStreamingResponse(fullPrompt, '', 'DEFAULT');
    
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
                controller.enqueue(encoder.encode('data: {"done":true}\n\n'));
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
                }
                
                if (content) {
                  // 统一使用content格式（与员工版一致）
                  const safeContent = content.replace(/\\/g, '\\\\')
                                            .replace(/"/g, '\\"')
                                            .replace(/\n/g, '\\n')
                                            .replace(/\r/g, '\\r')
                                            .replace(/\t/g, '\\t');
                  
                  const data = JSON.stringify({ content: safeContent });
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                }
              }
            } catch (e) {
              console.error('解析流数据失败:', e);
            }
          }
        }
      },
      
      flush(controller) {
        // 处理任何剩余的缓冲数据
        if (buffer.trim()) {
          console.log('处理剩余缓冲数据:', buffer);
        }
        controller.enqueue(encoder.encode('data: {"done":true}\n\n'));
      }
    });
    
    // 通过transform流传输响应
    if (!response.body) {
      throw new Error('响应体为空');
    }
    
    const transformedStream = response.body.pipeThrough(transformStream);
    
    return new Response(transformedStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API路由错误:', error);
    const errorMessage = error instanceof Error ? error.message : '处理请求时出错';
    
    // 返回SSE格式的错误
    const encoder = new TextEncoder();
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: {"error":"${errorMessage}"}\n\n`));
        controller.close();
      }
    });
    
    return new Response(errorStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }
}