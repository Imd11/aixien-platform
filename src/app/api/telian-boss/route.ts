import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGithubKnowledgeBase } from '@/app/telian-boss/lib/github-content';
import { TELIAN_BOSS_PROMPT } from '@/app/telian-boss/lib/prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { content } = await request.json();

        if (!content) {
          controller.enqueue(encoder.encode('data: {"error":"内容不能为空"}\n\n'));
          controller.close();
          return;
        }

        // 获取GitHub知识库内容
        const githubKnowledge = await getGithubKnowledgeBase();

        // 构建完整的提示词
        const fullPrompt = `
${TELIAN_BOSS_PROMPT}

背景知识库（特连光电公司信息）：
${githubKnowledge}

现在，请基于以上要求为我输入的企业家提出的问题生成对应的问题分析报告。

用户输入的问题如下：
${content}
`;

        // 使用 Gemini 2.0 Flash Exp 模型
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.0-flash-exp',
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 32768,
          },
        });

        const result = await model.generateContentStream(fullPrompt);

        let fullResponse = '';
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          fullResponse += chunkText;
          
          // 发送流式数据
          const data = JSON.stringify({ text: chunkText });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }

        // 发送结束信号
        controller.enqueue(encoder.encode('data: {"done":true}\n\n'));
        controller.close();
      } catch (error) {
        console.error('流式响应错误:', error);
        const errorMessage = error instanceof Error ? error.message : '生成响应时出错';
        controller.enqueue(encoder.encode(`data: {"error":"${errorMessage}"}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}