import { NextRequest, NextResponse } from 'next/server';
import { ClothingItem } from '@/types/clothing';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_BASE_URL = process.env.MINIMAX_BASE_URL || 'https://api.minimax.chat/v1';

async function callOpenRouter(
  images: string[],
  userPrompt: string,
  systemPrompt?: string
): Promise<{ content: string; provider: string } | null> {
  if (!OPENROUTER_API_KEY) return null;

  // 构建多模态 user message：图片 + 文字
  const userContent: any[] = images.map((img) => ({
    type: 'image_url',
    image_url: { url: img },
  }));
  userContent.push({ type: 'text', text: userPrompt });

  const messages: any[] = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: userContent });

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4.5',
        messages,
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    const responseText = await response.text();
    console.log('OpenRouter 响应:', response.status, responseText.substring(0, 500));

    if (response.ok) {
      const data = JSON.parse(responseText);
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        return { content, provider: 'OpenRouter (Claude)' };
      }
    } else {
      console.error('OpenRouter 错误:', response.status, responseText);
    }
  } catch (error) {
    console.error('OpenRouter 调用失败:', error);
  }

  return null;
}

async function callMinimaxVision(
  prompt: string,
  images: string[]
): Promise<{ content: string; provider: string } | null> {
  if (!MINIMAX_API_KEY) return null;

  try {
    // 构建多模态消息
    const contents: any[] = [];

    // 添加图片
    for (const img of images) {
      contents.push({
        type: 'image_url',
        image_url: {
          url: img,
        },
      });
    }

    // 添加文本 prompt
    contents.push({
      type: 'text',
      text: prompt,
    });

    const response = await fetch(`${MINIMAX_BASE_URL}/text/chatcompletion_v2`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'MiniMax-M2',
        messages: [
          {
            role: 'user',
            content: contents,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    const responseText = await response.text();
    console.log('Minimax 响应:', response.status, responseText.substring(0, 500));

    if (response.ok) {
      const data = JSON.parse(responseText);
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        return { content, provider: 'Minimax (M2)' };
      }
    } else {
      console.error('Minimax 错误:', response.status, responseText);
    }
  } catch (error) {
    console.error('Minimax 调用失败:', error);
  }

  return null;
}

export async function POST(request: NextRequest) {
  if (!OPENROUTER_API_KEY && !MINIMAX_API_KEY) {
    return NextResponse.json(
      { error: '服务端配置错误: 缺少 API Key' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { images } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: '请提供有效的图片数据' },
        { status: 400 }
      );
    }

    const systemPrompt = `你是专业的服装识别助手。分析用户上传的衣服照片。

请返回纯JSON格式，不要任何解释文字。格式如下：
{"items":[{"id":"item_1","primary":"top","secondary":"outer","seasons":["autumn","winter"],"colors":["黑色"],"styleTags":["商务","通勤"],"notes":"西装外套"}]}

字段说明：
- primary: "top" 或 "bottom"
- secondary: "inner", "outer", "unknown"
- seasons: 数组，可选spring/summer/autumn/winter/all-season
- colors: 中文颜色数组，如["黑色","白色"]
- styleTags: 风格标签数组，如["通勤","商务"]
- notes: 简短备注

只返回JSON，不要其他文字。`;

    const userPrompt = `请分析这${images.length}张衣服照片，返回JSON格式的识别结果。`;

    let result: { content: string; provider: string } | null = null;

    // 先尝试 OpenRouter
    result = await callOpenRouter(images, userPrompt, systemPrompt);

    if (!result) {
      // 备用：使用 Minimax 视觉模型
      console.log('OpenRouter 不可用，尝试 Minimax...');
      result = await callMinimaxVision(systemPrompt + '\n\n' + userPrompt, images);
    }

    if (!result) {
      return NextResponse.json(
        { error: 'AI服务暂时不可用，请稍后再试' },
        { status: 500 }
      );
    }

    console.log(`使用AI服务商: ${result.provider}`);
    const content = result.content;

    if (!content) {
      return NextResponse.json(
        { error: 'AI 返回内容为空' },
        { status: 500 }
      );
    }

    let parsedResult;
    try {
      let cleanContent = content.trim();
      console.log('AI原始返回:', cleanContent.substring(0, 500));

      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // 尝试提取JSON部分
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      }

      parsedResult = JSON.parse(cleanContent);
    } catch (e) {
      console.error('AI 返回非JSON格式:', content.substring(0, 1000));
      return NextResponse.json(
        { error: 'AI返回格式错误，请重试' },
        { status: 500 }
      );
    }

    const itemsWithImages = parsedResult.items.map((item: ClothingItem, index: number) => ({
      ...item,
      imageDataUrl: images[index] || item.imageDataUrl,
      id: `item_${Date.now()}_${index}`,
    }));

    return NextResponse.json({ items: itemsWithImages, provider: result.provider });
  } catch (error) {
    console.error('分析失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
