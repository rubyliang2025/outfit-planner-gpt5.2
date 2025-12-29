import { NextRequest, NextResponse } from 'next/server';
import { GeneratePlanRequest, WeeklyPlan } from '@/types/clothing';

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
    const body: GeneratePlanRequest = await request.json();
    const { items, preferences } = body;

    if (!items || items.length < 7) {
      return NextResponse.json(
        { error: '至少需要7件衣物才能生成一周计划' },
        { status: 400 }
      );
    }

    const itemsSimplified = items.map((item) => ({
      id: item.id,
      primary: item.primary,
      secondary: item.secondary,
      seasons: item.seasons,
      colors: item.colors,
      styleTags: item.styleTags,
      notes: item.notes,
    }));

    const systemPrompt = `你是专业的穿搭顾问。根据用户的衣柜生成一周（周一到周日）的通勤风穿搭计划。

要求：
1. 必须返回纯JSON，不能有任何解释文字
2. 返回格式必须是：
{
  "days": [
    {
      "day": "mon",
      "topId": "衣物id",
      "bottomId": "衣物id",
      "outerId": "可选外套id",
      "reason": "搭配理由1-3句"
    }
  ]
}
3. day 字段：必须是 "mon", "tue", "wed", "thu", "fri", "sat", "sun" 之一
4. topId 必须对应 primary="top" 的衣物
5. bottomId 必须对应 primary="bottom" 的衣物
6. outerId 可选，如果有合适的 secondary="outer" 可以加上
7. 尽量不重复使用同一件衣服，基础款（黑白灰）最多重复1次
8. reason：1-3句话，说明为什么这样搭配，强调通勤、简洁、干练、色彩协调
9. 优先选择通勤风、商务风、简约风的搭配
10. 注意色彩搭配和谐，避免过于花哨

请严格按照JSON格式返回，不要添加任何额外文字。`;

    const userPrompt = `我的衣柜有以下衣物：
${JSON.stringify(itemsSimplified, null, 2)}

偏好设置：
- 风格：${preferences.style}
- 单件衣物重复上限：${preferences.repeatLimit}次

请为我生成一周（周一到周日）的通勤穿搭计划。`;

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
            content: userPrompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 3000,
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

    let parsedResult: WeeklyPlan;
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

    if (!parsedResult.days || parsedResult.days.length !== 7) {
      return NextResponse.json(
        { error: 'AI返回的计划不完整' },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error('生成计划失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
