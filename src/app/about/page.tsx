export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">关于项目</h1>
        <p className="text-xl text-gray-600">
          通勤风一周穿搭板 (outfit-planner-gpt5.2)
        </p>
      </div>

      <div className="space-y-8">
        {/* 项目简介 */}
        <div className="bg-white border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">项目简介</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            这是一个基于 Next.js 的 MVP 项目，作为你的电子衣柜，我们帮助你管理衣服并快速生成一周穿搭计划。
          </p>
          <p className="text-gray-600 leading-relaxed">
            <strong className="text-gray-900">设计理念：</strong>简单、便捷、实用
          </p>
        </div>

        {/* 核心功能 */}
        <div className="bg-white border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">核心功能</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-gray-900 mr-2">📸</span>
              <span>上传衣服照片，AI 自动识别衣物类型、风格、颜色和季节</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-900 mr-2">📅</span>
              <span>一键生成一周（周一到周日）通勤风穿搭方案，更多风格敬请期待</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-900 mr-2">💾</span>
              <span>随时查看，给您灵感</span>
            </li>
          </ul>
        </div>

        {/* 技术栈 */}
        <div className="bg-white border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">技术栈</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <span className="font-semibold text-gray-900">框架：</span>
              <span> Next.js 15 (App Router) + TypeScript</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">样式：</span>
              <span> Tailwind CSS（极简黑白灰通勤风设计）</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">AI 服务：</span>
              <span> OpenRouter + Claude Sonnet 4.5</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">存储：</span>
              <span> 前端状态管理 + LocalStorage（无后端数据库）</span>
            </div>
          </div>
        </div>

        {/* 设计原则 */}
        <div className="bg-white border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">设计原则</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">极简通勤风</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>黑白灰配色方案</li>
                <li>大留白设计</li>
                <li>卡片式布局</li>
                <li>网格排列</li>
                <li>无多余装饰</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">稳定第一</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>只使用一个 AI 模型（Claude Sonnet 4.5）避免输出不一致</li>
                <li>前端 LocalStorage 存储，无需数据库</li>
                <li>统一使用 &lt;img&gt; 标签，避免 next/image 域名配置问题</li>
                <li>严格的 JSON 格式校验</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">简单第一</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>无登录系统</li>
                <li>无后端数据库</li>
                <li>最少依赖包</li>
                <li>纯前端状态管理</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 致谢 */}
        <div className="bg-white border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">致谢</h2>
          <div className="space-y-2 text-gray-600">
            <div>
              <span className="font-semibold text-gray-900">AI 模型：</span>
              <span> Anthropic Claude Sonnet 4.5</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">API 服务：</span>
              <span> OpenRouter</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">框架：</span>
              <span> Next.js</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">样式：</span>
              <span> Tailwind CSS</span>
            </div>
          </div>
        </div>

        {/* 开源协议 */}
        <div className="bg-gray-50 border border-gray-200 p-6 text-center">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">开源协议：</span>MIT License
          </p>
          <p className="text-gray-500 text-sm mt-2">项目源头标识：GPT-5.2</p>
        </div>
      </div>
    </div>
  );
}

