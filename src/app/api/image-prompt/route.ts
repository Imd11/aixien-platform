import { NextRequest, NextResponse } from "next/server";
import { API_CONFIG } from "@/lib/shared/config";

// 图像提示词生成模板
const promptTemplate = `
## Analyze Image for AI Art Prompt

Please analyze the attached image in detail. Your task is to generate a highly detailed, precise, and structured text prompt (hereinafter referred to as the 'image prompt'). The sole objective of this image prompt is that when it is input into an advanced image generation AI (e.g., Midjourney, DALL-E, GPT-4o, etc.), it enables the AI to regenerate the original image as faithfully and visually similarly as possible, including its aspect ratio.

The image prompt you generate must include, but is not limited to, the following key visual elements:
- Core Subject: Clearly describe the main focus of the image (person, animal, object, scene, etc.), including its posture, action, and expression (if applicable to living beings).
- Composition and Perspective: Describe the layout of the frame (e.g., close-up, medium shot, full shot, establishing shot, portrait, landscape orientation), the subject's position within the frame (e.g., centered, rule of thirds, leading lines, negative space), and the overall viewpoint or camera angle (e.g., eye-level, bird's-eye view, worm's-eye view, low-angle, high-angle, isometric view, orthographic view). Also, note any distinct lens effects or photographic techniques used (e.g., tilt-shift effect, fisheye lens, shallow depth of field/bokeh, motion blur, lens flare, Dutch angle).
- Environment and Background: Detail the subject's surroundings or background, including location, other objects, distant views, etc.
- Artistic Style: Identify and describe the overall style of the image (e.g., photorealistic, oil painting, watercolor, sketch, cartoon, anime, cyberpunk, steampunk, 3D render, concept art). If the style strongly resembles a specific artist (e.g., Van Gogh, H.R. Giger) or a well-known art movement (e.g., Impressionism, Surrealism), please state this explicitly.
- Lighting and Atmosphere: Describe the lighting conditions (e.g., bright daylight, dusk, overcast, studio lighting, Rembrandt lighting, volumetric lighting, neon glow), light direction, shadow effects, and the overall mood or atmosphere conveyed by the image (e.g., serene, mysterious, joyful, tense, eerie, nostalgic). Pay special attention to accurately capturing the emotional tone.
- Color: Describe the main color palette, tone (warm tones, cool tones), saturation, and contrast.
- Key Details: Mention any specific details crucial for accurate reproduction, such as clothing textures, object materials (e.g., metallic, wooden, glossy, matte), specific markings, visual elements, patterns, or text if present and significant.
- Image Quality/Medium: If possible, describe the image's texture or quality (e.g., high-definition, cinematic, film grain, blur effect, sharp focus, vintage photo, lens flare, digital painting feel).
- Negative Prompts: If discernible, identify elements or characteristics that should be avoided in the regeneration to prevent common misinterpretations or unwanted artifacts (e.g., "no text", "no extra limbs", "avoid blurry").

Please provide the final generated image prompt as the sole output. Ensure it is a coherent text string suitable for direct copy-pasting into an image generation AI. Do not include any explanations, titles, or additional dialogue; output only the final image prompt itself, optimized for image generation.
Output language: @{{promptLang}}.
`;

async function encodeImageToBase64(file: File): Promise<string> {
  const imageBuffer = await file.arrayBuffer();
  const mimeType = file.type;
  const base64Image = Buffer.from(imageBuffer).toString('base64');
  return `data:${mimeType};base64,${base64Image}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    let promptLang = formData.get("promptLang") as string;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    if (!promptLang) {
      promptLang = "zh";
    }

    const base64Image = await encodeImageToBase64(file);
    if (!base64Image) {
      return NextResponse.json({ error: "Failed to encode image to base64." }, { status: 500 });
    }

    const language = promptLang === "zh" ? "中文" : "English";
    const prompt = promptTemplate.replace("@{{promptLang}}", language);

    // 构建OpenAI兼容API请求体 - 注意：如果新API不支持图像，需要修改此处
    const requestBody = {
      model: "gemini-2.5-pro", // 使用Gemini 2.5 Pro模型
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ],
      temperature: API_CONFIG.GENERATION_CONFIG.DEFAULT.temperature,
      max_tokens: API_CONFIG.GENERATION_CONFIG.DEFAULT.maxOutputTokens
    };

    console.log('发送图像分析请求到API:', {
      promptLength: prompt.length,
      imageType: file.type,
      imageSize: file.size
    });

    const response = await fetch(API_CONFIG.GEMINI.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.GEMINI.API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '无法读取错误响应');
      console.error('API请求失败:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      
      let errorMessage = `API调用失败: ${response.status} ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage += `. ${errorData.error.message}`;
        }
      } catch (e) {
        if (errorText) {
          errorMessage += `. ${errorText}`;
        }
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    
    console.log('API返回数据:', JSON.stringify(data, null, 2));
    
    // OpenAI格式数据验证
    if (!data.choices || data.choices.length === 0) {
      console.error('API返回数据异常 - 没有choices:', data);
      return NextResponse.json({ error: 'API返回数据异常：没有找到生成内容' }, { status: 500 });
    }

    const choice = data.choices[0];
    console.log('选择结果详情:', JSON.stringify(choice, null, 2));
    
    // 检查finish_reason
    if (choice.finish_reason && choice.finish_reason !== 'stop') {
      console.log('完成原因:', choice.finish_reason);
      if (choice.finish_reason === 'content_filter') {
        return NextResponse.json({ error: '内容被安全过滤器阻止，请尝试使用其他图片' }, { status: 400 });
      } else if (choice.finish_reason === 'length') {
        return NextResponse.json({ error: '回复内容过长，已被截断' }, { status: 400 });
      }
    }
    
    if (!choice.message) {
      console.error('API返回数据异常 - 没有message:', choice);
      return NextResponse.json({ error: 'API返回数据异常：消息为空' }, { status: 500 });
    }

    if (!choice.message.content) {
      console.error('API返回数据异常 - 没有content:', choice.message);
      return NextResponse.json({ error: 'API返回数据异常：内容为空' }, { status: 500 });
    }

    const content = choice.message.content;

    return NextResponse.json({ prompt: content });
  } catch (error: unknown) {
    console.error("Error in /api/image-prompt:", error);
    const errorMessage = error instanceof Error ? error.message : 'API请求失败';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}