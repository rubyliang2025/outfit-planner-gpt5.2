'use client';

import { useState, useEffect, useRef } from 'react';
import { ClothingItem, Category } from '@/types/clothing';
import { storage } from '@/lib/storage';

const inferCategory = (item: ClothingItem): Category => {
  const note = (item.notes || '').toLowerCase();
  const secondary = item.secondary;

  if (note.includes('靴') || note.includes('鞋')) return 'shoes';
  if (note.includes('包') || note.includes('帽') || note.includes('围巾') || note.includes('配饰')) return 'accessory';
  if (secondary === 'outer' || note.includes('外套') || note.includes('大衣') || note.includes('羽绒服')) return 'outerwear';
  if (item.primary === 'bottom') return 'bottom';
  if (item.primary === 'top') return 'top';
  return 'unknown';
};

const CATEGORY_LABELS: Record<Category, string> = {
  outerwear: '外套',
  top: '上装',
  bottom: '下装',
  shoes: '鞋子',
  accessory: '配饰',
  unknown: '未分类',
};

export default function ClosetPage() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = storage.getCloset();
    setItems(saved);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPreviews: string[] = [];
    const readers: Promise<string>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const promise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          resolve(dataUrl);
        };
        reader.readAsDataURL(file);
      });
      readers.push(promise);
    }

    const results = await Promise.all(readers);
    newPreviews.push(...results);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (previews.length === 0) {
      setError('请先上传衣服照片');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: previews }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `请求失败: ${response.status}`);
      }

      const data = await response.json();
      const itemsWithCategory = data.items.map((item: ClothingItem) => ({
        ...item,
        category: inferCategory(item),
      }));
      const newItems = [...items, ...itemsWithCategory];
      setItems(newItems);
      storage.saveCloset(newItems);
      setPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '识别失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    storage.saveCloset(updated);
  };

  const handleClearPreviews = () => {
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCategoryChange = (id: string, newCategory: Category) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, category: newCategory } : item
    );
    setItems(updated);
    storage.saveCloset(updated);
  };

  const groupedItems: Record<Category, ClothingItem[]> = {
    outerwear: [],
    top: [],
    bottom: [],
    shoes: [],
    accessory: [],
    unknown: [],
  };

  items.forEach((item) => {
    const cat = item.category || 'unknown';
    groupedItems[cat].push(item);
  });

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">衣柜管理</h1>

      <div className="bg-white border-2 border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">上传衣服照片</h2>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:text-sm file:bg-white file:text-gray-700 hover:file:bg-gray-50"
        />

        {previews.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">待识别照片 ({previews.length})</h3>
              <button
                onClick={handleClearPreviews}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                清空
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {previews.map((preview, index) => (
                <div key={index} className="border border-gray-200 p-2">
                  <img
                    src={preview}
                    alt={`待识别 ${index + 1}`}
                    className="w-full h-40 object-cover"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 px-6 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '识别中...' : '识别衣服'}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            {error}
          </div>
        )}
      </div>

      <div className="bg-white border-2 border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          我的衣柜 ({items.length} 件)
        </h2>
        {items.length === 0 ? (
          <p className="text-gray-500">暂无衣物，请上传照片并识别</p>
        ) : (
          <div className="space-y-8">
            {(Object.keys(groupedItems) as Category[]).map((cat) => {
              const categoryItems = groupedItems[cat];
              if (categoryItems.length === 0) return null;
              return (
                <div key={cat}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    {CATEGORY_LABELS[cat]} ({categoryItems.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 p-4">
                        <img
                          src={item.imageDataUrl}
                          alt={item.id}
                          className="w-full h-56 object-cover mb-3"
                        />
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold text-gray-900">分类: </span>
                            <select
                              value={item.category || 'unknown'}
                              onChange={(e) => handleCategoryChange(item.id, e.target.value as Category)}
                              className="border border-gray-300 text-gray-700 text-xs py-1 px-2"
                            >
                              {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
                                <option key={c} value={c}>
                                  {CATEGORY_LABELS[c]}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">类型: </span>
                            <span className="text-gray-700">
                              {item.primary} / {item.secondary}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">季节: </span>
                            <span className="text-gray-700">{item.seasons.join(', ')}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">颜色: </span>
                            <span className="text-gray-700">{item.colors.join(', ')}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">风格: </span>
                            <span className="text-gray-700">{item.styleTags.join(', ')}</span>
                          </div>
                          {item.notes && (
                            <div>
                              <span className="font-semibold text-gray-900">备注: </span>
                              <span className="text-gray-700">{item.notes}</span>
                            </div>
                          )}
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="w-full mt-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 hover:bg-gray-50 text-sm"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
