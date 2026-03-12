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
          items: items.map(({ imageDataUrl: _, ...rest }) => rest),
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
      <h1 className="text-4xl font-bold mb-8 tracking-tight" style={{
        background: 'linear-gradient(90deg, #fef08a, #c4b5fd, #93c5fd, #5eead4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}>
        一周穿搭计划
      </h1>

      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-6 mb-8 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">生成通勤穿搭方案</h2>
            <p className="text-sm text-white/50 mt-1">
              当前衣柜: {items.length} 件衣物
              {items.length < 7 && <span className="text-yellow-400/80 ml-2">（需至少7件）</span>}
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || items.length < 7}
            className="relative px-8 py-3 rounded-xl font-medium text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: items.length >= 7 && !loading
                ? 'linear-gradient(135deg, #c4b5fd, #93c5fd)'
                : undefined,
              backgroundColor: items.length < 7 || loading ? 'rgba(255,255,255,0.08)' : undefined,
              color: 'white',
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                生成中...
              </span>
            ) : '生成一周穿搭'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}
      </div>

      {plan && (
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">本周穿搭</h2>
          <div className="space-y-6">
            {plan.days.map((day) => {
              const top = getItemById(day.topId);
              const bottom = getItemById(day.bottomId);
              const outer = day.outerId ? getItemById(day.outerId) : undefined;

              return (
                <div key={day.day} className="bg-white/[0.03] border border-white/[0.06] p-5 rounded-xl">
                  <h3 className="text-base font-semibold text-white/90 mb-4">
                    {DAY_NAMES[day.day]}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {top && (
                      <div className="bg-white/[0.04] border border-white/[0.06] p-3 rounded-xl">
                        <div className="text-xs text-white/40 mb-2 font-medium tracking-wide">上装</div>
                        <img
                          src={top.imageDataUrl}
                          alt="上装"
                          className="w-full h-36 object-cover rounded-lg mb-2"
                        />
                        <div className="text-xs text-white/50 truncate">
                          {top.colors.join(', ')}
                        </div>
                      </div>
                    )}

                    {bottom && (
                      <div className="bg-white/[0.04] border border-white/[0.06] p-3 rounded-xl">
                        <div className="text-xs text-white/40 mb-2 font-medium tracking-wide">下装</div>
                        <img
                          src={bottom.imageDataUrl}
                          alt="下装"
                          className="w-full h-36 object-cover rounded-lg mb-2"
                        />
                        <div className="text-xs text-white/50 truncate">
                          {bottom.colors.join(', ')}
                        </div>
                      </div>
                    )}

                    {outer && (
                      <div className="bg-white/[0.04] border border-white/[0.06] p-3 rounded-xl">
                        <div className="text-xs text-white/40 mb-2 font-medium tracking-wide">外套</div>
                        <img
                          src={outer.imageDataUrl}
                          alt="外套"
                          className="w-full h-36 object-cover rounded-lg mb-2"
                        />
                        <div className="text-xs text-white/50 truncate">
                          {outer.colors.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white/[0.03] border border-white/[0.05] px-4 py-3 rounded-xl">
                    <div className="text-xs text-white/40 mb-1 font-medium">搭配理由</div>
                    <p className="text-sm text-white/70 leading-relaxed">{day.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!plan && !error && items.length >= 7 && (
        <div className="text-center text-white/30 py-12 text-sm">
          点击上方按钮生成一周穿搭计划
        </div>
      )}

      {!plan && items.length === 0 && (
        <div className="text-center text-white/30 py-12 text-sm">
          请先前往「衣柜管理」上传衣服照片并识别
        </div>
      )}
    </div>
  );
}
