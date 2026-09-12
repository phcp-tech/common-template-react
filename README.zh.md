# common-template-react

<p align="center">
  <a href="./README.md">English</a> | <a href="./README.zh.md">简体中文</a>
</p>

一个生产可用的 React 前端模板，内置多语言支持（zh-Hans / en-US）、深色模式、PWA、带语言前缀的路由，以及法律声明页面。

## 技术栈

| 层级 | 技术 |
|---|---|
| UI | React 19 + TypeScript |
| 构建 | Vite 7 |
| 样式 | Tailwind CSS 3（自定义 `ink/paper/surface/jade` 调色板，靠 CSS 变量驱动深色模式） |
| 国际化 | i18next + react-i18next + 静态 `messages` 映射表 |
| 路由 | react-router-dom 7（带语言前缀的 URL，如 `/en/...`、`/zh/...`） |
| 测试 | Vitest + @testing-library/react + happy-dom |
| PWA | Service worker + Web App Manifest |

## 项目结构

`core/` 层完全可移植——不耦合任何业务领域逻辑，可以直接复制到任意新项目里使用。

```
src/
├── core/                     # 共享基础设施 —— 不耦合任何业务逻辑
│   ├── components/
│   │   ├── layout/           # Header、Footer、RootLayout、ErrorBoundary
│   │   ├── ui/               # LoadingSpinner、PageBackground、ContentCard、Markdown
│   │   └── legal/             # LegalPage 组件 + 占位用的 markdown 文件
│   ├── context/               # ThemeContext（深色模式）
│   ├── hooks/                 # useTheme（用 localStorage 持久化）
│   ├── i18n/                  # MessageSchema、en-US 和 zh-Hans 翻译文案、i18next 初始化
│   ├── lib/                   # locale.ts、locale-registry.ts、date.ts
│   └── types/                 # Locale、OutputLocale
├── features/                  # 在这里添加你自己的业务功能组件
├── pages/                     # 薄薄一层的路由包装组件
│   ├── HomePage.tsx           # 替换成你自己的内容
│   ├── LegalPageWrapper.tsx   # 把 ThemeContext 接入 LegalPage
│   └── NotFoundPage.tsx       # 404 兜底页
├── router.tsx                 # 路由定义
├── main.tsx                   # SPA 入口
└── index.css                  # 全局样式 + 深色模式 CSS 变量
```

## 快速开始

```bash
npm install
npm run dev          # 开发服务器，http://localhost:5173（VITE_ENV=dev）
npm test             # 运行单元测试
npm run build:dev    # 以开发环境变量构建（VITE_ENV=dev）→ dist/
npm run build:prod   # 以生产环境变量构建（VITE_ENV=prod）→ dist/
npm run preview      # 本地预览生产构建产物
```

## 定制指南

### 新增一个语言

1. 在 `src/core/lib/locale-registry.ts` 里加一条：
   ```typescript
   "ja-JP": { urlPrefix: "ja", bcpPrefix: "ja", label: "日本語" }
   ```
2. 新建 `src/core/i18n/ja-jp.ts`，实现 `MessageSchema`
3. 在 `src/core/i18n/index.ts` 里注册：加入 `messages`、`resources`，并确认 `LOCALE_LIST` 能识别到它

### 新增一个功能模块

1. 在 `src/features/your-feature/` 下创建你的组件
2. 在 `src/router.tsx` 里加一条路由
3. 在 `src/pages/YourFeaturePage.tsx` 里建一个薄薄的页面包装组件
4. 功能组件的 `isDarkMode`/`locale` 应该通过 **props** 传入（而不是 context），这样才能在微前端场景下保持可移植性

### 替换品牌信息

- `index.html` —— `<title>` 和 `apple-mobile-web-app-title`
- `public/manifest.json` —— `name` 和 `short_name`
  PWA manifest 是由 `vite.config.ts` 生成的；配置 `VITE_APP_NAME` 和 `VITE_APP_SHORT_NAME` 即可，不需要另外新增一份静态 manifest 文件。
- `public/logo192.png`、`public/logo512.png` —— 应用图标
- `src/core/i18n/en-us.ts` 和 `zh-hans.ts` —— `header.title`

### 更新法律声明页面

编辑 `src/core/components/legal/` 下的四个 markdown 文件。它们是在构建时通过 Vite 的 `?raw` 导入的，运行时不需要额外发请求获取。

### 更新页脚链接

编辑 `src/core/components/layout/Footer.tsx`。其中 Links 和 Community 两个区块的占位 URL 都标了 `TODO` 注释。

### 配置 API 基础 URL

`.env.development` 和 `.env.production` 里定义了 `VITE_API_BASE_URL`（默认分别是
`http://localhost:3000` / `https://api.example.com`）。这个变量目前故意没有在
`src/` 下任何地方被读取——这个模板本身不内置任何 HTTP 客户端、fetch 封装或数据请求库
（没有 axios，也没有 React Query/SWR），因为这个选择取决于每个具体产品自己的后端和鉴权方案。

这个变量是留给你在 `src/features/` 下自己添加的数据层用的，例如：

```typescript
const baseUrl = import.meta.env.VITE_API_BASE_URL;
```

在接入第一个真正调用后端的功能之前，把两个 `.env.*` 文件里的值换成你自己的真实
API 地址（或者通过你的 CI/托管平台的环境变量配置按部署环境分别覆盖）。

## 架构说明

| 决策 | 理由 |
|---|---|
| `core → features → pages` 单向依赖 | 强制分层；`core/` 可以原样搬进任何项目而不需要修改 |
| 功能组件用 props 传入 `isDarkMode`/`locale` | 在微前端 shell 场景下不依赖宿主 context，保持可移植性 |
| 静态 `messages` 映射表与 i18next 并存 | `messages[locale]` 零开销、对 SSR 安全；i18next 则提供运行时的 `useTranslation` hook |
| Cookie + navigator 浏览器语言探测 | Cookie 保存用户的语言偏好；navigator 为首次访问提供合理的默认值 |
| `<head>` 内联脚本读取 `app-theme-mode` | 在首次绘制之前执行——不需要服务端参与就能避免主题闪烁 |
| `app_locale` / `app-theme-mode` 存储键名 | 用通用命名，避免多个项目共用同一域名时发生冲突 |
| `ink`/`paper`/`surface` 颜色通过 CSS 变量解析（`src/index.css`） | 只需切换一个 `.theme-dark` class 就能一次性换掉所有消费方的颜色——不需要给每个组件单独写 `dark:` class、`!important` 或 `[class*="..."]` 之类的覆盖 |
| `/terms`、`/privacy` 这两条法律声明路由用 `React.lazy` 懒加载 | 让 `react-markdown`/`remark-gfm`/`rehype-sanitize`（即 `vendor-markdown` 分包）不出现在首屏路由图里 |
| `VITE_API_BASE_URL` 已定义但 `core`/`pages` 都不读取它 | 留给你自己在 `features/` 下添加的数据请求层用；不替你预设任何 HTTP 客户端/请求库的立场（见上面的定制指南） |

## 运行测试

```bash
npm test                          # 完整跑一遍所有测试
npm run test:watch                # 监听模式

# 单独运行某个测试套件：
npx vitest run src/core/lib/__tests__/
npx vitest run src/core/i18n/__tests__/
npx vitest run src/core/hooks/__tests__/
```
## PWA 与部署

`vite-plugin-pwa` 会在生产构建时生成 web manifest 和基于 Workbox 的 service worker。生成的 worker 会预缓存应用外壳和带哈希的 Vite 静态资源，这样已安装的客户端可以离线重新打开这个 SPA。

- 设置 `VITE_APP_NAME` 和 `VITE_APP_SHORT_NAME` 来配置产品品牌信息。
- 如果不是部署在根路径下，构建前把 `VITE_PUBLIC_BASE_PATH` 设为 `/`（默认值）或者一个以斜杠结尾的子路径，比如 `/portal/`。

```bash
VITE_APP_NAME="Product Name" VITE_APP_SHORT_NAME="Product" npm run build:prod
```

这个模板故意不附带某个具体域名的 sitemap。请在部署时自行添加针对具体产品的 sitemap 以及 canonical/SEO 元数据。

## 质量检查

```bash
npm run lint             # ESLint flat-config 检查
npm run test:coverage    # Vitest V8 覆盖率报告（阈值在 vitest.config.ts 里配置）
npm run check            # lint + coverage + 生产构建
```

`.github/workflows/ci.yml` 会在每次 push 和针对 `main` 的 pull request 上跑同样的 `check` 步骤（`npm ci`、`lint`、`test:coverage`、`build:prod`）。
