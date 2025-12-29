# 通勤风一周穿搭板 (outfit-planner-gpt5.2)

> AI驱动的通勤风一周穿搭规划工具 - 稳定第一、简单第一、少依赖第一

## 项目简介

这是一个基于 Next.js 的 MVP 项目，帮助用户管理衣柜并生成一周通勤风穿搭计划。

**核心功能：**
- 📸 上传衣服照片，AI 自动识别衣物类型、风格、颜色和季节
- 📅 一键生成一周（周一到周日）通勤穿搭方案
- 💾 数据保存在浏览器 LocalStorage，无需登录和数据库

**技术栈：**
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS（极简黑白灰通勤风设计）
- OpenRouter + Claude Sonnet 4.5（AI 识别与生成）
- 前端状态管理 + LocalStorage（无后端数据库）

---

## 快速开始

### 1. 前置要求

- Node.js 18+
- npm（项目使用 npm，不使用 pnpm）
- OpenRouter API Key（需要注册 [OpenRouter](https://openrouter.ai/)）

### 2. 安装依赖

```bash
cd outfit-planner-gpt5.2
npm install
```

### 3. 配置环境变量

创建 `.env` 文件（不要提交到 Git）：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 OpenRouter API Key：

```env
OPENROUTER_API_KEY=your_actual_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

**重要：**
- 替换 `your_actual_api_key_here` 为你的真实 API Key
- 修改环境变量后必须重启 dev server 才能生效

### 4. 启动开发服务器

```bash
npm run dev
```

浏览器访问：[http://localhost:3000](http://localhost:3000)

---

## 使用流程

### 第一步：衣柜管理 (`/closet`)

1. 点击导航栏「衣柜管理」
2. 点击「选择文件」上传多张衣服照片（支持 JPG、PNG 等格式）
3. 预览上传的照片
4. 点击「识别衣服」按钮
5. AI 会自动分析每件衣物的：
   - 类型（上装/下装、内搭/外套）
   - 季节属性（春夏秋冬/全季）
   - 颜色（如：黑色、白色、灰色）
   - 风格标签（如：通勤、商务、简约）
6. 识别结果会保存到「我的衣柜」并自动存储到浏览器

### 第二步：生成一周计划 (`/plan`)

1. 点击导航栏「一周计划」
2. 确保衣柜至少有 7 件衣物（建议 10+ 件效果更好）
3. 点击「生成一周穿搭」按钮
4. AI 会生成周一到周日的穿搭方案，每天包括：
   - 上装 + 下装（必选）
   - 外套（可选，根据衣柜内容智能搭配）
   - 搭配理由（强调通勤风、色彩协调、干练简洁）
5. 计划会自动保存到浏览器，下次访问依然可见

---

## 项目结构

```
outfit-planner-gpt5.2/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/          # AI 衣物识别接口
│   │   │   │   └── route.ts
│   │   │   └── generate-plan/    # AI 穿搭计划生成接口
│   │   │       └── route.ts
│   │   ├── closet/               # 衣柜管理页面
│   │   │   └── page.tsx
│   │   ├── plan/                 # 一周计划页面
│   │   │   └── page.tsx
│   │   ├── layout.tsx            # 根布局（导航栏）
│   │   ├── page.tsx              # 首页
│   │   └── globals.css           # 全局样式
│   ├── types/
│   │   └── clothing.ts           # TypeScript 类型定义
│   └── lib/
│       └── storage.ts            # LocalStorage 工具函数
├── .env.example                  # 环境变量示例
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
└── README.md
```

---

## 常见问题

### 1. 环境变量不生效

**症状：** API 返回 500 错误 "服务端配置错误: 缺少 OPENROUTER_API_KEY"

**解决方法：**
- 确认 `.env` 文件在项目根目录
- 确认 `.env` 文件中 `OPENROUTER_API_KEY=` 后面有实际的 key
- **重要：修改 `.env` 后必须重启 dev server** (`Ctrl+C` 停止，然后重新 `npm run dev`)

### 2. API 返回 401 Unauthorized

**原因：** OpenRouter API Key 无效或未充值

**解决方法：**
- 检查 [OpenRouter Dashboard](https://openrouter.ai/keys) 确认 API Key 是否正确
- 确认账户是否有余额（OpenRouter 按使用量付费）

### 3. API 返回 402 Payment Required

**原因：** OpenRouter 账户余额不足

**解决方法：**
- 前往 [OpenRouter Billing](https://openrouter.ai/credits) 充值

### 4. AI 返回格式错误

**症状：** 前端显示 "AI返回格式错误，请重试"

**原因：** AI 偶尔可能返回非 JSON 格式内容

**解决方法：**
- 点击重试按钮
- 检查上传的图片是否清晰（模糊照片可能导致识别困难）
- 查看浏览器控制台和终端日志，确认 AI 返回的原始内容

### 5. 图片无法显示

**原因：** DataURL 数据过大或浏览器限制

**解决方法：**
- 上传照片时尽量控制单张图片大小在 2MB 以内
- 使用压缩后的图片（本项目直接使用 `<img>` 标签，避免了 Next.js Image 的域名白名单问题）

### 6. LocalStorage 数据丢失

**原因：** 清除浏览器缓存会删除 LocalStorage 数据

**解决方法：**
- 定期导出衣柜数据（可自行扩展功能）
- 不要清除浏览器的网站数据

---

## API 说明

### POST `/api/analyze`

识别衣物照片

**请求体：**
```json
{
  "images": ["data:image/jpeg;base64,...", "data:image/png;base64,..."]
}
```

**响应：**
```json
{
  "items": [
    {
      "id": "item_1234567890_0",
      "imageDataUrl": "data:image/jpeg;base64,...",
      "primary": "top",
      "secondary": "outer",
      "seasons": ["autumn", "winter"],
      "colors": ["黑色"],
      "styleTags": ["商务", "通勤", "简约"],
      "notes": "西装外套"
    }
  ]
}
```

### POST `/api/generate-plan`

生成一周穿搭计划

**请求体：**
```json
{
  "items": [ /* ClothingItem 数组 */ ],
  "preferences": {
    "style": "commute",
    "repeatLimit": 1
  }
}
```

**响应：**
```json
{
  "days": [
    {
      "day": "mon",
      "topId": "item_xxx",
      "bottomId": "item_yyy",
      "outerId": "item_zzz",
      "reason": "黑色西装外套搭配灰色西裤，经典通勤配色，干练专业。"
    }
  ]
}
```

---

## 设计原则

### 极简通勤风

- 黑白灰配色方案
- 大留白设计
- 卡片式布局
- 网格排列
- 无多余装饰

### 稳定第一

- 只使用一个 AI 模型（Claude Sonnet 4.5）避免输出不一致
- 前端 LocalStorage 存储，无需数据库
- 统一使用 `<img>` 标签，避免 next/image 域名配置问题
- 严格的 JSON 格式校验

### 简单第一

- 无登录系统
- 无后端数据库
- 最少依赖包
- 纯前端状态管理

---

## 后续扩展建议

- [ ] 导出/导入衣柜数据（JSON 文件）
- [ ] 支持编辑已识别的衣物属性
- [ ] 支持自定义穿搭偏好（颜色偏好、风格偏好）
- [ ] 支持保存多个穿搭方案
- [ ] 添加衣物搜索和筛选功能
- [ ] 支持拖拽排序和手动调整穿搭

---

## 开源协议

MIT License

---

## 致谢

- **AI 模型：** [Anthropic Claude Sonnet 4.5](https://www.anthropic.com/)
- **API 服务：** [OpenRouter](https://openrouter.ai/)
- **框架：** [Next.js](https://nextjs.org/)
- **样式：** [Tailwind CSS](https://tailwindcss.com/)

---

**项目源头标识：** GPT-5.2
