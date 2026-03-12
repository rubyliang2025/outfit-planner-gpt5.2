import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 tracking-tight" style={{
          background: 'linear-gradient(90deg, #fef08a, #c4b5fd, #93c5fd, #5eead4, #f9a8d4, #fb923c)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
        }}>
        我的电子衣柜
        </h1>
        <p className="text-xl text-white/80 mb-4 drop-shadow-md">
          有了电子衣柜，随时随地衣物搭配
        </p>
        <p className="text-white/50">
          简洁 · 干练 · 通勤风 · 更多风格敬请期待
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Link href="/closet">
          <div className="group relative bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-8 hover:bg-white/[0.06] hover:border-[#3b5998]/40 transition-all duration-500 cursor-pointer rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-start gap-5">
              <div className="w-20 h-24 flex-shrink-0 group-hover:scale-105 transition-transform duration-500 rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <img
                  src="https://tempfile.aiquickdraw.com/h/43a68df1533d805bec7711ca64ab06de_1773220922.png"
                  alt="AI衣柜管理"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-white drop-shadow-lg" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', letterSpacing: '-0.01em' }}>
                  衣柜管理
                </h2>
                <p className="text-white/60 leading-relaxed">
                  上传衣服照片，AI智能识别衣物类型、风格、颜色和季节属性
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/plan">
          <div className="group relative bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-8 hover:bg-white/[0.06] hover:border-[#2d1b4e]/40 transition-all duration-500 cursor-pointer rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b4e]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-start gap-5">
              <div className="w-20 h-24 flex-shrink-0 group-hover:scale-105 transition-transform duration-500 rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <img
                  src="https://tempfile.aiquickdraw.com/h/259b17886be2b1ff844445266fee314f_1773220932.png"
                  alt="一周穿搭计划"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-white drop-shadow-lg" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', letterSpacing: '-0.01em' }}>
                  一周计划
                </h2>
                <p className="text-white/60 leading-relaxed">
                  基于你的衣柜，生成一周通勤穿搭方案，每天不重样
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl">
        <h3 className="font-semibold text-white mb-3 drop-shadow-lg">使用流程</h3>
        <ol className="space-y-2 text-white/70">
          <li>1. 前往「衣柜管理」上传衣服照片</li>
          <li>2. 点击「识别衣服」让AI分析衣物属性</li>
          <li>3. 前往「一周计划」生成穿搭方案</li>
          <li>4. 查看每日搭配建议和理由</li>
        </ol>
      </div>
    </div>
  );
}
