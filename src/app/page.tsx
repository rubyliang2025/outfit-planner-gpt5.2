import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          通勤风穿搭板
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          AI驱动的一周穿搭规划工具
        </p>
        <p className="text-gray-500">
          简洁 · 干练 · 通勤风
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Link href="/closet">
          <div className="bg-white border-2 border-gray-200 p-8 hover:border-gray-400 transition-all cursor-pointer">
            <div className="text-4xl mb-4">👔</div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">
              衣柜管理
            </h2>
            <p className="text-gray-600">
              上传衣服照片，AI智能识别衣物类型、风格、颜色和季节属性
            </p>
          </div>
        </Link>

        <Link href="/plan">
          <div className="bg-white border-2 border-gray-200 p-8 hover:border-gray-400 transition-all cursor-pointer">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">
              一周计划
            </h2>
            <p className="text-gray-600">
              基于你的衣柜，生成一周通勤穿搭方案，每天不重样
            </p>
          </div>
        </Link>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">使用流程</h3>
        <ol className="space-y-2 text-gray-600">
          <li>1. 前往「衣柜管理」上传衣服照片</li>
          <li>2. 点击「识别衣服」让AI分析衣物属性</li>
          <li>3. 前往「一周计划」生成穿搭方案</li>
          <li>4. 查看每日搭配建议和理由</li>
        </ol>
      </div>
    </div>
  );
}
