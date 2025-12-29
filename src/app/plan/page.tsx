'use client';

import { useState, useEffect } from 'react';
import { ClothingItem, WeeklyPlan } from '@/types/clothing';
import { storage } from '@/lib/storage';

const DAY_NAMES: Record<string, string> = {
  mon: '周一',
  tue: '周二',
  wed: '周三',
  thu: '周四',
  fri: '周五',
  sat: '周六',
  sun: '周日',
};

export default function PlanPage() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedItems = storage.getCloset();
    const savedPlan = storage.getPlan();
    setItems(savedItems);
    setPlan(savedPlan);
  }, []);

  const handleGenerate = async () => {
    if (items.length < 7) {
      setError('衣柜至少需要7件衣物才能生成一周计划（建议上传更多以获得更好效果）');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          preferences: {
            style: 'commute',
            repeatLimit: 1,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `请求失败: ${response.status}`);
      }

      const data: WeeklyPlan = await response.json();
      setPlan(data);
      storage.savePlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const getItemById = (id: string): ClothingItem | undefined => {
    return items.find((item) => item.id === id);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">一周穿搭计划</h1>

      <div className="bg-white border-2 border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">生成通勤穿搭方案</h2>
            <p className="text-sm text-gray-600 mt-1">
              当前衣柜: {items.length} 件衣物
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || items.length < 7}
            className="bg-gray-900 text-white py-3 px-8 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '生成中...' : '生成一周穿搭'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            {error}
          </div>
        )}
      </div>

      {plan && (
        <div className="bg-white border-2 border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">本周穿搭</h2>
          <div className="space-y-8">
            {plan.days.map((day) => {
              const top = getItemById(day.topId);
              const bottom = getItemById(day.bottomId);
              const outer = day.outerId ? getItemById(day.outerId) : undefined;

              return (
                <div key={day.day} className="border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {DAY_NAMES[day.day]}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {top && (
                      <div className="border border-gray-200 p-3">
                        <div className="text-xs text-gray-600 mb-2 font-semibold">
                          上装
                        </div>
                        <img
                          src={top.imageDataUrl}
                          alt="上装"
                          className="w-full h-40 object-cover mb-2"
                        />
                        <div className="text-xs text-gray-600">
                          {top.colors.join(', ')} / {top.styleTags.join(', ')}
                        </div>
                      </div>
                    )}

                    {bottom && (
                      <div className="border border-gray-200 p-3">
                        <div className="text-xs text-gray-600 mb-2 font-semibold">
                          下装
                        </div>
                        <img
                          src={bottom.imageDataUrl}
                          alt="下装"
                          className="w-full h-40 object-cover mb-2"
                        />
                        <div className="text-xs text-gray-600">
                          {bottom.colors.join(', ')} / {bottom.styleTags.join(', ')}
                        </div>
                      </div>
                    )}

                    {outer && (
                      <div className="border border-gray-200 p-3">
                        <div className="text-xs text-gray-600 mb-2 font-semibold">
                          外套
                        </div>
                        <img
                          src={outer.imageDataUrl}
                          alt="外套"
                          className="w-full h-40 object-cover mb-2"
                        />
                        <div className="text-xs text-gray-600">
                          {outer.colors.join(', ')} / {outer.styleTags.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-4">
                    <div className="text-xs text-gray-600 mb-1 font-semibold">
                      搭配理由
                    </div>
                    <p className="text-sm text-gray-700">{day.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!plan && !error && items.length >= 7 && (
        <div className="text-center text-gray-500 py-12">
          点击上方按钮生成一周穿搭计划
        </div>
      )}
    </div>
  );
}
