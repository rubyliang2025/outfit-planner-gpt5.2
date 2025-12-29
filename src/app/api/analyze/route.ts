import { NextRequest, NextResponse } from 'next/server';
import { ClothingItem } from '@/types/clothing';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

export async function POST(request: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: '服务端配置错误: 缺少 OPENROUTER_API_KEY' },
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

    const systemPrompt = `你是专业的服装识别助手。分析用户上传的衣服照片，返回严格的JSON数组格式。

要求：
1. 必须返回纯JSON，不能有任何解释文字
2. 每件衣物必须包含字段：id, imageDataUrl, primary, secondary, seasons, colors, styleTags, notes
3. primary 只能是 "top" 或 "bottom"
4. secondary 只能是 "inner", "outer", "unknown"
5. seasons 是数组，可选值："spring", "summer", "autumn", "winter", "all-season"
6. colors 是颜色数组，用中文描述（如："黑色"、"白色"、"灰色"）
7. styleTags 是风格标签数组（如："通勤"、"商务"、"休闲"、"简约"）
8. notes 可选，简短备注
9. 如果不确定某个字段，用 "unknown" 或空数组，不要胡编

示例返回：
{
  "items": [
    {
      "id": "item_1",
      "imageDataUrl": "原图DataURL",
      "primary": "top",
      "secondary": "outer",
      "seasons": ["autumn", "winter"],
      "colors": ["黑色"],
      "styleTags": ["商务", "通勤", "简约"],
      "notes": "西装外套"
    }
  ]
}`;

    const userContent: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
      {
        type: 'text',
        text: `请分析这${images.length}张衣服照片，返回JSON格式的识别结果。`,
      },
    ];

    images.forEach((dataUrl: string, index: number) => {
      userContent.push({
        type: 'image_url',
        image_url: {
          url: dataUrl,
        },
      });
    });

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4.5',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userContent,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API 错误:', errorText);
      return NextResponse.json(
        { error: `AI服务错误: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'AI 返回内容为空' },
        { status: 500 }
      );
    }

    let parsedResult;
    try {
      // 去除可能的 markdown 代码块标记
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      parsedResult = JSON.parse(cleanContent);
    } catch {
      console.error('AI 返回非JSON格式:', content);
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

    return NextResponse.json({ items: itemsWithImages });
  } catch (error) {
    console.error('分析失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
