# ThoughtLite 博客二次开发 · 配置 · 部署指南

> 基于 [Astro](https://astro.build/) 框架的 ThoughtLite 主题，完整的二次开发参考文档。

---

## 目录

- [一、项目架构总览](#一项目架构总览)
- [二、快速开始](#二快速开始)
- [三、核心配置文件详解](#三核心配置文件详解)
- [四、内容管理系统](#四内容管理系统)
- [五、页面路由与布局系统](#五页面路由与布局系统)
- [六、样式与主题定制](#六样式与主题定制)
- [七、字体配置](#七字体配置)
- [八、图标与 Logo 定制](#八图标与-logo-定制)
- [九、国际化 (i18n)](#九国际化-i18n)
- [十、组件模块解析与改造](#十组件模块解析与改造)
- [十一、Markdown 扩展功能](#十一markdown-扩展功能)
- [十二、SEO 与 Open Graph](#十二seo-与-open-graph)
- [十三、RSS/Atom 订阅](#十三rssatom-订阅)
- [十四、GitHub Pages 部署](#十四github-pages-部署)
- [十五、Vercel 部署](#十五vercel-部署)
- [十六、常见定制场景速查](#十六常见定制场景速查)
- [附录：项目文件索引](#附录项目文件索引)

---

## 一、项目架构总览

```
thoughtlite/
├── astro.config.ts          # Astro 框架配置（站点 URL、Markdown 插件、字体、集成等）
├── site.config.ts           # 站点业务配置（标题、作者、版权、分页、热力图等）
├── tsconfig.json            # TypeScript 配置 & 路径别名
├── svelte.config.js         # Svelte 配置
├── biome.json               # 代码格式化/Lint 配置
├── package.json             # 依赖 & 脚本
├── .env.example             # 环境变量模板
├── public/                  # 静态资源（favicon、feed 样式等）
├── scripts/
│   └── new.ts               # 交互式内容创建脚本
├── src/
│   ├── content/             # 内容集合（文章数据）
│   │   ├── note/            # 长文（笔记/文章）
│   │   ├── jotting/         # 短文（随笔/微博客）
│   │   ├── preface/         # 首页序文
│   │   └── information/     # 静态信息（关于、政策、友链、年表）
│   ├── content.config.ts    # 内容集合 Schema 定义
│   ├── pages/               # 路由页面
│   ├── layouts/             # 页面布局（App、Base、Header、Footer）
│   ├── components/          # 可复用组件（Svelte + Astro）
│   ├── styles/              # 全局样式 & Markdown 样式
│   ├── fonts/               # 自定义字体 Provider
│   ├── graph/               # Open Graph 图片生成
│   ├── i18n/                # 国际化翻译文件
│   ├── icons/               # SVG 图标（含站点 Logo）
│   └── utils/               # 工具函数 & 自定义 Remark 插件
└── .github/
    └── workflows/           # GitHub Actions（CI、Release）
```

### 技术栈

| 技术 | 用途 |
|------|------|
| Astro 5.x | 静态站点框架 |
| Svelte 5 | 交互组件（使用 Runes 响应式系统） |
| Tailwind CSS 4 | 样式工具 |
| TypeScript | 类型安全 |
| Shiki | 代码语法高亮 |
| KaTeX | 数学公式渲染 |
| Swup | SPA 级页面过渡 |
| Satori + Sharp | Open Graph 图片生成 |
| pnpm | 包管理器 |

---

## 二、快速开始

### 2.1 环境要求

- Node.js >= 18
- pnpm（推荐 10.x，项目锁定 `pnpm@10.29.2`）

### 2.2 安装与运行

```bash
# 克隆仓库
git clone https://github.com/tuyuritio/astro-theme-thought-lite.git my-blog
cd my-blog

# 安装依赖
pnpm install

# 创建环境变量
cp .env.example .env
# 编辑 .env，设置 PUBLIC_TIMEZONE（如 Asia/Shanghai）

# 启动开发服务器（默认端口 4321）
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 2.3 可用脚本

| 命令 | 用途 |
|------|------|
| `pnpm new` | 交互式创建新文章（会引导选择类型、语言、标签等） |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm preview` | 预览构建产物 |
| `pnpm check` | Astro 类型检查 |
| `pnpm format` | Biome 代码格式化 |
| `pnpm lint` | Biome 代码检查 |

---

## 三、核心配置文件详解

### 3.1 `site.config.ts` — 站点业务配置

这是你**最主要的配置入口**，控制站点的所有业务层面设置。

```typescript
// site.config.ts
import siteConfig from "./src/utils/config";

const config = siteConfig({
  // 站点标题，显示在浏览器标签和页面头部
  title: "我的博客",

  // 首页标语，支持 \n 换行，使用手写体字体渲染
  prologue: "写下所思所想\n记录每一天",

  // 作者信息
  author: {
    name: "你的名字",
    email: "you@email.com",      // 可选，用于 Feed 生成
    link: "https://your.site"    // 可选，页脚作者链接
  },

  // 站点描述（SEO meta description）
  description: "我的个人博客",

  // 版权配置
  copyright: {
    // 支持: "CC0 1.0" | "CC BY 4.0" | "CC BY-SA 4.0"
    //        "CC BY-NC 4.0" | "CC BY-NC-SA 4.0"
    //        "CC BY-ND 4.0" | "CC BY-NC-ND 4.0"
    type: "CC BY-NC-SA 4.0",
    year: "2025"                 // 支持范围如 "2024-2025"
  },

  // 国际化配置
  i18n: {
    locales: ["zh-cn"],          // 支持的语言列表
    defaultLocale: "zh-cn"       // 默认语言
  },

  // 分页配置（每页显示数量）
  pagination: {
    note: 15,                    // 长文列表每页数量
    jotting: 24                  // 短文列表每页数量
  },

  // 首页热力图配置
  heatmap: {
    unit: "day",                 // "day" | "week" | "month"
    weeks: 20                    // unit="day" 时显示的周数
    // years: 4                  // unit="month" 时显示的年数
  },

  // RSS/Atom Feed 配置
  feed: {
    section: "*",                // "*" 表示所有 | ["note"] 或 ["jotting"] 指定类型
    limit: 20                    // Feed 条目数量限制
  },

  // 首页"最新内容"区块显示哪些类型
  latest: "*"                    // "*" 表示所有 | ["note"] 或 ["jotting"]
});

// 单语言模式自动判定：当 locales 只有一个时，URL 中不会出现语言前缀
export const monolocale = Number(config.i18n.locales.length) === 1;

export default config;
```

**单语言模式提示：** 如果你只需要中文博客，只需设置 `locales: ["zh-cn"]` 和 `defaultLocale: "zh-cn"`。此时 URL 中不会出现 `/zh-cn/` 前缀，内容目录下也不需要语言子目录。

### 3.2 `astro.config.ts` — 框架配置

需要修改的关键项：

```typescript
export default defineConfig({
  // ⚠️ 必须修改：你的实际站点地址
  site: "https://your-username.github.io",
  // 如果部署到子路径: site: "https://your-username.github.io/repo-name"

  // 国际化（自动从 site.config.ts 读取）
  i18n: {
    ...siteConfig.i18n,
    routing: {
      redirectToDefaultLocale: false,
      prefixDefaultLocale: false    // 默认语言不加 URL 前缀
    }
  },

  // Markdown 处理插件链（一般不需要改动）
  markdown: { ... },

  // 字体配置（详见字体章节）
  experimental: {
    fonts: [ ... ]
  }
});
```

### 3.3 `.env` — 环境变量

```bash
# .env
# 时区，影响文章时间的显示，参考：https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
PUBLIC_TIMEZONE=Asia/Shanghai
```

### 3.4 `tsconfig.json` — 路径别名

项目定义了一组路径别名，在 import 时使用：

| 别名 | 实际路径 | 用途 |
|------|---------|------|
| `$config` | `site.config.ts` | 站点配置 |
| `$components/*` | `src/components/*` | 组件 |
| `$layouts/*` | `src/layouts/*` | 布局 |
| `$styles/*` | `src/styles/*` | 样式 |
| `$utils/*` | `src/utils/*` | 工具函数 |
| `$i18n` | `src/i18n/index` | 国际化 |
| `$icons/*` | `src/icons/*` | 图标 |
| `$graph/*` | `src/graph/*` | OG 图片生成 |
| `$public/*` | `public/*` | 静态资源 |

---

## 四、内容管理系统

### 4.1 内容集合概览

项目使用 Astro 的 Content Collections 管理内容，Schema 定义在 `src/content.config.ts`：

| 集合 | 路径 | 用途 | 格式 |
|------|------|------|------|
| **note** | `src/content/note/` | 长文/文章 | `.md` |
| **jotting** | `src/content/jotting/` | 短文/随笔 | `.md` |
| **preface** | `src/content/preface/` | 首页序文 | `.md` |
| **information** | `src/content/information/` | 静态页面 | `.md` `.mdx` `.yaml` |

### 4.2 目录结构（多语言 vs 单语言）

**多语言模式：**
```
src/content/note/
├── en/
│   ├── my-article.md
│   └── my-series/
│       └── index.md         # 可以用文件夹组织，包含图片等资源
├── zh-cn/
│   └── my-article.md
└── ja/
    └── my-article.md
```

**单语言模式（locales 只有一个时）：**
```
src/content/note/
├── my-article.md
└── my-series/
    ├── index.md
    └── image.jpg
```

### 4.3 Note（长文）Frontmatter

```yaml
---
title: 文章标题            # 必填
timestamp: 2025-06-15 12:00:00+08:00  # 必填，发布时间
series: 系列名称           # 可选，归入系列（Note 独有）
tags: [标签1, 标签2]       # 可选，标签数组
description: 文章摘要       # 可选，用于 SEO 和列表预览
sensitive: false           # 默认 false，是否为敏感内容（显示前需确认）
toc: true                  # 默认 false，是否显示目录（Note 独有）
top: 0                     # 默认 0，置顶优先级（数字越大越靠前）
draft: false               # 默认 false，草稿不会出现在列表中
---

正文内容...
```

### 4.4 Jotting（短文）Frontmatter

```yaml
---
title: 随笔标题
timestamp: 2025-06-15 12:00:00+08:00
tags: [标签]
description: 摘要
sensitive: false
top: 0
draft: false
---

正文内容...
```

### 4.5 Preface（首页序文）Frontmatter

```yaml
---
timestamp: 2025-06-15 12:00:00+08:00
---

序文内容（会显示在首页，取最新的一篇）...
```

文件命名规则：以时间戳格式命名，如 `2025-06-15-12-00-00.md`。

### 4.6 Information（静态信息页）

无需 frontmatter，直接存放在 `src/content/information/[locale]/` 下：

| 文件名 | 用途 | 格式 |
|--------|------|------|
| `introduction.md` | 关于页 - 自我介绍 | Markdown |
| `linkroll.mdx` | 关于页 - 友情链接 | MDX（支持组件） |
| `chronicle.yaml` | 关于页 - 时间线/年表 | YAML |
| `policy.md` | 政策/法律声明页 | Markdown |

**chronicle.yaml 格式示例：**

```yaml
2025-06-15:
  - 博客上线
  - 发布第一篇文章
2025-01-01:
  - 开始搭建博客
  - ~放弃了旧方案        # 以 ~ 开头的条目会显示为删除线
```

**linkroll.mdx 格式示例：**

```mdx
import Linkroll from "$components/Linkroll.astro";

export const links = [
  {
    title: "网站名称",
    url: "https://example.com",
    image: "https://example.com/favicon.svg",
    description: "网站描述",
    type: "friends"        // 分类标签
  },
  // 更多链接...
];

在这里可以写友链的介绍文字。

<Linkroll locale={props.locale} links={links} />

下方也可以继续写文字。
```

### 4.7 草稿机制

两种草稿方式：

1. **Frontmatter 标记：** 设置 `draft: true`
2. **文件名前缀：** 文件或文件夹名以 `_` 开头（如 `_my-draft.md` 或 `_drafts/article.md`）

### 4.8 使用 `pnpm new` 创建内容

运行 `pnpm new` 会启动交互式 CLI 工具，引导你：

1. 选择内容类型（Note / Jotting / Preface）
2. 选择语言（多语言模式下）
3. 输入标题、ID（URL slug）、系列、标签、描述
4. 选择选项（草稿、目录、置顶、敏感内容）
5. 选择文件结构（单文件 / 文件夹）
6. 预览并确认生成

---

## 五、页面路由与布局系统

### 5.1 路由结构

所有页面在 `src/pages/` 下，使用 `[...locale]` 动态路由实现国际化：

| URL 路径 | 页面文件 | 说明 |
|----------|---------|------|
| `/` | `[...locale]/index.astro` | 首页 |
| `/note` | `[...locale]/note/index.astro` | 长文列表 |
| `/note/article-id` | `[...locale]/note/[...id]/index.astro` | 长文详情 |
| `/jotting` | `[...locale]/jotting/index.astro` | 短文列表 |
| `/jotting/article-id` | `[...locale]/jotting/[...id]/index.astro` | 短文详情 |
| `/about` | `[...locale]/about.astro` | 关于页 |
| `/policy` | `[...locale]/policy.astro` | 政策页 |
| `/preface` | `[...locale]/preface.astro` | 序文历史 |
| `/feed.xml` | `[...locale]/feed.xml.ts` | Atom 订阅 |
| `/404` | `404.astro` | 404 页面 |
| `/500` | `500.astro` | 500 页面 |
| `/**/graph.png` | `graph.png.ts` | OG 图片 |

默认语言无 URL 前缀；其他语言加前缀（如 `/ja/note`）。

### 5.2 布局层级

```
App.astro                    # 最外层 HTML 壳（<html>、<head>、字体加载、主题脚本）
  └── Base.astro             # 页面主体布局（Header + Slot + Footer + 全局 JS）
        ├── Header.astro     # 顶部导航栏（标题、导航链接、主题切换、语言切换、RSS）
        ├── <slot />         # 页面具体内容
        └── Footer.astro     # 页脚（版权、CC 图标、字数统计、技术栈链接）
```

**App.astro 关键职责：**
- HTML `lang` 和 `dir` 属性
- `<title>` 和 SEO meta 标签
- Open Graph 和 Twitter Card meta
- 字体加载（`<Font>` 组件）
- 暗色模式初始化脚本（防止 FOUC）

**Base.astro 关键职责：**
- 导入全局 CSS（global.css、markdown.css、medium-zoom、katex）
- 初始化图片缩放（Medium Zoom）
- 初始化时间本地化
- Swup 页面过渡事件监听

### 5.3 导航配置

导航菜单在 `src/layouts/header/Header.astro` 中定义：

```typescript
// 第 16-21 行
const routes = [
  { label: t("navigation.home"),    path: getRelativeLocaleUrl(locale),           icon: "lucide--tent" },
  { label: t("navigation.note"),    path: getRelativeLocaleUrl(locale, "/note"),   icon: "lucide--list" },
  { label: t("navigation.jotting"), path: getRelativeLocaleUrl(locale, "/jotting"),icon: "lucide--feather" },
  { label: t("navigation.about"),   path: getRelativeLocaleUrl(locale, "/about"),  icon: "lucide--at-sign" },
];
```

**添加/修改导航项：** 直接编辑此数组。图标使用 Iconify 格式 `集合名--图标名`，可用集合：`lucide`、`simple-icons`、`fa6-brands`。

---

## 六、样式与主题定制

### 6.1 主题色系统

颜色通过 CSS 变量定义，位于 `src/styles/global.css`：

```css
/* 亮色模式 */
:root,
[data-theme="light"] {
  --primary-color: #2a2a28;      /* 主色（文字） */
  --secondary-color: #50504d;    /* 次要色 */
  --remark-color: #757575;       /* 注释色 */
  --weak-color: #9f9f9c;         /* 弱色 */
  --background-color: #fffffd;   /* 背景色 */
  --block-color: #eeeeee;        /* 区块色（代码块、卡片等） */
  --shadow-color: #cdcdcc;       /* 阴影色/边框色 */
  --selection-color: #adadacc3;  /* 文本选中色 */
}

/* 暗色模式 */
[data-theme="dark"] {
  --primary-color: #dddddb;
  --secondary-color: #aaaaa8;
  --remark-color: #a5a5a5;
  --weak-color: #5d5d5a;
  --background-color: #0e0e0c;
  --block-color: #1e1e1e;
  --shadow-color: #323231;
  --selection-color: #adadacc3;
}
```

**修改主题色：** 直接修改这些 CSS 变量的值即可全局生效。亮色和暗色模式需要分别设置。

### 6.2 Tailwind CSS 主题映射

CSS 变量通过 `@theme` 指令映射到 Tailwind 的颜色系统，可在 class 中直接使用：

```css
/* global.css 第 216-228 行 */
@theme {
  --color-primary: var(--primary-color);
  --color-secondary: var(--secondary-color);
  --color-remark: var(--remark-color);
  --color-weak: var(--weak-color);
  --color-background: var(--background-color);
  --color-block: var(--block-color);
  --color-shadow: var(--shadow-color);
  --color-selection: var(--selection-color);

  --font-serif: var(--font-noto-serif);
  --font-mono: var(--font-maple-mono-nf-cn);
  --font-cursive: var(--font-playwrite-mx), var(--font-the-peak-font-plus);
}
```

使用示例：`class="text-primary bg-background border-shadow"` 等。

### 6.3 暗色模式切换

暗色模式通过 `data-theme` 属性控制，实现在 `src/layouts/header/ThemeSwitcher.astro` 中。

**切换机制：**
1. 初始化：读取 `localStorage.theme`，若无则跟随系统 `prefers-color-scheme`
2. 切换时：使用 View Transition API（`document.startViewTransition`）实现平滑过渡
3. 状态持久化：保存到 `localStorage`

### 6.4 全局基础样式

`global.css` 中的 `@layer base` 定义了全局基础样式：

- **字体大小：** 桌面端 `1.0625rem` (17px)，移动端 640px 以下 `1rem` (16px)
- **标题大小：** h1=2.25rem, h2=1.75rem, h3=1.5rem, h4=1.25rem, h5=1.125rem, h6=1rem
- **滚动条：** 自定义细滚动条（5px 宽），颜色跟随主色
- **链接：** 默认无下划线，继承颜色
- **图片：** 最大宽度 100%，禁止拖拽

### 6.5 Markdown 样式定制

Markdown 内容样式在 `src/styles/markdown.css` 中，包裹在 `.markdown` class 下：

**可调整项：**

| 样式目标 | 位置 | 说明 |
|---------|------|------|
| 行高 | `.markdown { line-height: 1.75; }` | Markdown 内容行高 |
| 段落间距 | `section { gap: 0.8em; }` | 段落之间的间距 |
| 标题下划线 | `h1 { border-bottom: 4px solid; }` | h1 用 4px 实线，h2 用 2px |
| 链接样式 | `.markdown a` | hover 时显示下划线 |
| 外部链接图标 | `a[target="_blank"]::after` | 外链后显示小图标 |
| 代码块圆角 | `pre { border-radius: 0.3em; }` | 代码块圆角 |
| 行内代码 | `code { padding: 0.25em 0.5em; font-size: 0.8em; }` | 行内代码样式 |
| 引用块 | `blockquote { border-inline-start: 4px solid; }` | 左侧 4px 边框 |
| 表格 | `table { border-top: 3px solid; }` | 上下 3px 粗线的学术表格风格 |
| 脚注 | `.footnotes { border-top: 4px dotted; }` | 虚线分隔的脚注区 |
| 高亮文本 | `mark { text-decoration: underline wavy; }` | 波浪线而非背景色 |
| 剧透文本 | `.spoiler { filter: blur(3px); }` | 模糊效果，hover 显示 |
| 数学公式 | `.katex { font-family: "KaTeX_Main"; }` | KaTeX 数学字体 |
| GitHub Alert | `.markdown-alert-*` | 5 种颜色的 GitHub 风格提示框 |

### 6.6 代码高亮主题

代码块使用 Shiki 进行语法高亮，在 `astro.config.ts` 中配置：

```typescript
shikiConfig: {
  themes: {
    light: {
      ...githubLight,
      colorReplacements: {
        "#fff": "var(--block-color)"  // 背景色适配主题
      }
    },
    dark: "dark-plus"
  }
}
```

**更换主题：** 将 `dark: "dark-plus"` 替换为其他 Shiki 内置主题名，如 `"github-dark"`, `"one-dark-pro"`, `"dracula"` 等。完整列表参考 [Shiki 主题列表](https://shiki.style/themes)。

---

## 七、字体配置

### 7.1 字体体系

项目使用三类字体，通过 CSS 变量管理：

| CSS 变量 | 用途 | 默认字体 |
|---------|------|---------|
| `--font-serif` | 正文字体 | Noto Serif（按语言自动切换 SC/JP 变体） |
| `--font-mono` | 等宽字体（代码、时间戳等） | Maple Mono NF CN |
| `--font-cursive` | 手写体（首页标语） | Playwrite MX + The Peak Font Plus |

### 7.2 字体配置位置

字体在 `astro.config.ts` 的 `experimental.fonts` 数组中配置：

```typescript
experimental: {
  fonts: [
    // 英文衬线（正文）
    {
      name: "Noto Serif",
      provider: fontProviders.google(),
      weights: [400, 700],
      cssVariable: "--font-noto-serif"
    },
    // 中文衬线
    {
      name: "Noto Serif SC",
      provider: fontProviders.google(),
      weights: [400, 700],
      cssVariable: "--font-noto-serif-sc"
    },
    // 日文衬线
    {
      name: "Noto Serif JP",
      provider: fontProviders.google(),
      weights: [400, 700],
      cssVariable: "--font-noto-serif-jp"
    },
    // 手写体
    {
      name: "Playwrite MX",
      provider: fontProviders.google(),
      weights: [100],
      cssVariable: "--font-playwrite-mx"
    },
    // 等宽字体（自定义 Provider）
    {
      name: "Maple Mono NF CN",
      provider: ZeoSevenFonts(),
      cssVariable: "--font-maple-mono-nf-cn"
    },
    // 中文手写体（自定义 Provider）
    {
      name: "The Peak Font Plus",
      provider: ZeoSevenFonts(),
      cssVariable: "--font-the-peak-font-plus"
    }
  ]
}
```

### 7.3 语言特定字体切换

在 `global.css` 中通过 `:lang()` 伪类实现语言自动切换正文字体：

```css
/* 默认（英文）使用 Noto Serif */
@theme {
  --font-serif: var(--font-noto-serif);
}

/* 中文页面切换为 Noto Serif SC */
:lang(zh-cn) {
  --font-serif: var(--font-noto-serif-sc);
}

/* 日文页面切换为 Noto Serif JP */
:lang(ja) {
  --font-serif: var(--font-noto-serif-jp);
}
```

### 7.4 如何更换字体

**场景一：更换正文字体为 Google Fonts 上的其他字体**

1. 在 `astro.config.ts` 的 `fonts` 数组中修改对应条目的 `name`
2. 如果是替换所有语言的正文字体，修改所有 `Noto Serif*` 相关条目
3. 确保 `weights` 至少包含 400（正常）和 700（粗体）

例如替换为 LXGW WenKai：
```typescript
{
  name: "LXGW WenKai",
  provider: fontProviders.google(),
  weights: [400, 700],
  cssVariable: "--font-noto-serif-sc"  // 复用同一个 CSS 变量
}
```

**场景二：使用本地字体文件**

1. 将字体文件放入 `public/fonts/` 目录
2. 在 `global.css` 中用 `@font-face` 声明：
```css
@font-face {
  font-family: "MyFont";
  src: url("/fonts/myfont.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
```
3. 修改 `@theme` 中对应的 CSS 变量：
```css
@theme {
  --font-serif: "MyFont", serif;
}
```
4. 移除 `astro.config.ts` 中不再需要的远程字体条目

**场景三：更换等宽字体**

修改 `astro.config.ts` 中 `Maple Mono NF CN` 条目，或替换 `global.css` 中 `@theme` 的 `--font-mono` 值。

### 7.5 字体加载机制

`App.astro` 中按语言加载对应的正文字体：

```typescript
// App.astro 第 7-11 行
const mainFonts = {
  en: "--font-noto-serif",
  "zh-cn": "--font-noto-serif-sc",
  ja: "--font-noto-serif-jp"
};
```

如果新增或修改语言对应的正文字体，需要同步修改此映射。

---

## 八、图标与 Logo 定制

### 8.1 Favicon

使用 [RealFaviconGenerator](https://realfavicongenerator.net/) 生成图标，将以下文件放入 `public/` 目录覆盖：

- `favicon.svg` — SVG 格式图标
- `favicon-96x96.png` — 96x96 PNG 图标
- `favicon.ico` — ICO 格式图标

### 8.2 首页 Logo

首页 Logo 位于 `src/icons/site-logo.svg`，在首页以 SVG 组件方式引入：

```astro
<!-- src/pages/[...locale]/index.astro -->
import Logo from "$icons/site-logo.svg";
<Logo width={100} />
```

**替换方式：**

1. **替换 SVG 文件：** 直接用你的 SVG 文件替换 `src/icons/site-logo.svg`。建议使用 `currentColor` 作为填充色以适配明暗主题
2. **改为图片：** 修改为 `<img src="/logo.png" width={100} />` 并把图片放入 `public/`
3. **移除 Logo：** 在 `index.astro` 中删除 `<Logo>` 相关代码

### 8.3 图标系统

项目使用 Iconify + Tailwind CSS 4 插件，通过 CSS class 使用图标：

```css
/* global.css */
@plugin "@iconify/tailwind4" {
  prefixes: lucide, simple-icons, fa6-brands;
}
```

**可用图标集：**
- `lucide` — 通用 UI 图标（[lucide.dev](https://lucide.dev/)）
- `simple-icons` — 品牌/技术 Logo（[simpleicons.org](https://simpleicons.org/)）
- `fa6-brands` — Font Awesome 品牌图标

**使用方式：** 通过 `Icon` 组件（`src/components/Icon.svelte`）：
```svelte
<Icon name="lucide--heart" />
```

---

## 九、国际化 (i18n)

### 9.1 翻译文件结构

```
src/i18n/
├── index.ts              # i18n 引擎（翻译函数实现）
├── en/
│   ├── index.yaml        # UI 文本翻译
│   ├── script.yaml       # CLI 脚本翻译
│   └── linkroll.yaml     # 友链页翻译
├── zh-cn/
│   ├── index.yaml
│   ├── script.yaml
│   └── linkroll.yaml
└── ja/
    ├── index.yaml
    ├── script.yaml
    └── linkroll.yaml
```

### 9.2 翻译键示例 (`index.yaml`)

```yaml
navigation:
  home: 首页
  note: 文记
  jotting: 随笔
  about: 关于
  policy: 政策
home:
  latest: 最新内容
  heatmap:
    empty: 无字
    note:
      other: 文记 {count} 篇     # 复数形式，{count} 为参数
    jotting:
      other: 随笔 {count} 则
note:
  contents: 目录
  empty: 暂无文记
  series: 系列
  tag: 标签
sensitive:
  title: 内容警告
  continue: 我已知晓，继续阅读
statistics:
  other: 写下 {count} 字
```

### 9.3 添加新语言

1. 在 `site.config.ts` 的 `locales` 数组中添加语言代码
2. 在 `src/i18n/` 下创建对应语言目录和三个 YAML 文件
3. 在 `src/i18n/index.ts` 中导入新翻译文件并添加到 `translations` 对象
4. 在所有内容目录（`note`、`jotting`、`preface`、`information`）下创建对应语言子目录
5. 如果新语言需要特定正文字体，在 `astro.config.ts` 中添加字体配置，并在 `global.css` 添加 `:lang()` 规则

### 9.4 简化为单语言

如果只需要一种语言：

1. `site.config.ts` 设置 `locales: ["zh-cn"]`, `defaultLocale: "zh-cn"`
2. 内容文件直接放在集合根目录下（无需语言子目录）
3. `monolocale` 自动为 `true`，URL 中不出现语言前缀
4. 语言选择器自动隐藏

---

## 十、组件模块解析与改造

### 10.1 热力图 (Heatmap)

**文件：** `src/components/Heatmap.astro`

**配置（`site.config.ts`）：**

```typescript
heatmap: {
  unit: "day",    // "day": 按天（类 GitHub），"week": 按周，"month": 按月
  weeks: 20       // unit="day" 时的显示周数
  // years: 4     // unit="month" 时的显示年数
}
```

**外观定制：**
- 格子大小：修改 Heatmap.astro 第 177 行的 `w-2.5 h-2.5`（day）/ `w-4 h-4`（week）/ `w-4.5 h-4.5`（month）
- 透明度梯度：第 177 行的 `bg-primary/10`（0篇）→ `bg-primary/40`（1篇）→ `bg-primary/70`（2篇）→ `bg-primary`（3+篇）
- 弹出框样式：第 179 行 `.pop` 相关 class

**移除热力图：** 在 `src/pages/[...locale]/index.astro` 中删除 `<Heatmap>` 组件。

### 10.2 文章列表 - Note (Svelte)

**文件：** `src/components/Note.svelte`

功能：
- 系列筛选（单选下拉）
- 标签筛选（多选）
- 客户端分页
- 置顶文章（top > 0 的文章排在前面）
- URL 参数同步（`?page=2&tag=xxx&series=yyy`）

### 10.3 文章列表 - Jotting (Svelte)

**文件：** `src/components/Jotting.svelte`

功能：
- 标签筛选（多选）
- 客户端分页
- 网格布局

### 10.4 敏感内容门控 (Sensitive)

**文件：** `src/components/Sensitive.svelte`

当文章设置 `sensitive: true` 时，正文被遮盖，显示警告信息。用户确认后显示内容。

### 10.5 目录 (TOC)

**文件：** `src/components/TOC.astro`

当 Note 设置 `toc: true` 时在文章侧边显示。使用 `IntersectionObserver` 高亮当前阅读位置。

### 10.6 分页 (Pagination)

**文件：** `src/components/Pagination.svelte`

底部粘性定位的分页控件，支持首页/尾页/上下页跳转。

### 10.7 页面过渡 (Swup)

通过 `@swup/astro` 集成实现 SPA 级页面过渡：

```typescript
// astro.config.ts
swup({
  globalInstance: true,
  preload: false,           // 关闭预加载
  smoothScrolling: false,   // 关闭平滑滚动（使用 CSS scroll-behavior 代替）
  progress: true            // 显示顶部加载进度条
})
```

过渡进度条样式在 `global.css` 的 `.swup-progress-bar` 中自定义。

### 10.8 图片缩放

使用 Medium Zoom 库，在 `Base.astro` 中初始化。所有 `.markdown img` 自动支持点击放大。

给图片添加 `data-nozoom` 属性可以禁用缩放：
```markdown
![不可缩放的图片](image.png){data-nozoom}
```

---

## 十一、Markdown 扩展功能

项目集成了大量 Markdown 扩展插件，全部在 `astro.config.ts` 的 `markdown.remarkPlugins` 和 `markdown.rehypePlugins` 中配置。

### 11.1 支持的语法

| 语法 | 写法 | 效果 |
|------|------|------|
| GFM 表格 | `\| col \|` | 标准表格 |
| 扩展表格 | 空单元格合并 | 支持 colspan |
| 删除线 | `~~文字~~` | ~~删除线~~ |
| 任务列表 | `- [x] 完成` | 复选框列表 |
| 高亮 | `==文字==` | 波浪线标记 |
| 插入 | `++文字++` | 插入标记 |
| 剧透 | `||文字||` | 模糊遮盖 |
| 脚注 | `文字[^1]` + `[^1]: 注释` | 尾注 |
| 缩写 | `*[HTML]: HyperText...` | 鼠标悬停提示 |
| Ruby 注音 | `{漢字}(かんじ)` | 注音文字 |
| 数学公式 | `$行内$` / `$$块级$$` | KaTeX 渲染 |
| Emoji | `:smile:` | GitHub Emoji |
| 属性 | `**文字**{.class #id}` | HTML 属性 |
| GitHub Alert | `> [!NOTE]` | 彩色提示框 |
| 外部链接 | 自动识别 | 新标签页打开 + `nofollow` |

### 11.2 代码块复制按钮

每个代码块右上角自动添加复制按钮，配置在 `astro.config.ts`：

```typescript
transformers: [
  copy({
    duration: 1500  // 复制成功提示持续时间（毫秒）
  })
]
```

### 11.3 GitHub 风格提示框

```markdown
> [!NOTE]
> 普通提示

> [!TIP]
> 实用建议

> [!IMPORTANT]
> 重要信息

> [!WARNING]
> 警告信息

> [!CAUTION]
> 危险警示
```

每种类型有对应的颜色，定义在 `markdown.css` 的 `.markdown-alert-*` 类中。

---

## 十二、SEO 与 Open Graph

### 12.1 自动 Meta 标签

`App.astro` 自动生成以下 SEO 标签：

- `<title>` — 页面标题
- `<meta name="description">` — 页面描述
- `<link rel="canonical">` — 规范 URL
- `<link rel="sitemap">` — 站点地图
- `<link rel="alternate">` — Atom Feed
- Open Graph: `og:title`, `og:type`, `og:url`, `og:description`, `og:image`
- Twitter Card: `summary_large_image`
- 文章页额外：`article:author`, `article:published_time`, `article:section`, `article:tag`

### 12.2 Open Graph 图片

每篇文章和站点首页会自动生成 1200x630 的 OG 图片（通过 Satori + Sharp），路径为 `**/graph.png`。

OG 图片生成逻辑在 `src/graph/` 目录下，会根据文章的标题和语言选择对应字体渲染。

### 12.3 Sitemap

通过 `@astrojs/sitemap` 集成自动生成，无需额外配置。

---

## 十三、RSS/Atom 订阅

### 13.1 Feed 配置

在 `site.config.ts` 中：

```typescript
feed: {
  section: "*",        // 包含所有类型 | ["note"] 仅长文 | ["jotting"] 仅短文
  limit: 20            // 最近 20 篇
}
```

### 13.2 Feed 地址

- 默认语言：`/feed.xml`
- 其他语言：`/[locale]/feed.xml`（如 `/ja/feed.xml`）

页面 Header 中的 RSS 图标链接到对应语言的 Feed。Feed 格式为 Atom 1.0，并有专属的 XSL 样式表美化浏览器端展示。

---

## 十四、GitHub Pages 部署

### 14.1 方式一：GitHub Actions 自动部署（推荐）

1. **修改 `astro.config.ts` 中的 `site`：**

```typescript
// 如果是 用户名.github.io 仓库：
site: "https://your-username.github.io"

// 如果是普通仓库（部署到子路径）：
site: "https://your-username.github.io/repo-name"
```

如果是子路径部署，还需添加 `base`：
```typescript
export default defineConfig({
  site: "https://your-username.github.io/repo-name",
  base: "/repo-name",
  // ...其他配置
});
```

2. **创建 GitHub Actions 工作流：**

创建 `.github/workflows/deploy.yaml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build
        env:
          PUBLIC_TIMEZONE: Asia/Shanghai

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. **在 GitHub 仓库设置中启用 Pages：**
   - 进入仓库 → Settings → Pages
   - Source 选择 **GitHub Actions**

4. **推送代码到 `main` 分支即可自动部署。**

### 14.2 方式二：手动部署

```bash
# 构建
pnpm build

# dist/ 目录即为构建产物，将其推送到 gh-pages 分支
# 或直接上传到 GitHub Pages
```

### 14.3 自定义域名

1. 在 `public/` 目录下创建 `CNAME` 文件，内容为你的域名：
```
blog.example.com
```

2. 修改 `astro.config.ts`：
```typescript
site: "https://blog.example.com"
```

3. 在 DNS 提供商处配置 CNAME 记录指向 `your-username.github.io`

### 14.4 部署前检查清单

- [ ] `astro.config.ts` 的 `site` 已改为你的实际地址
- [ ] `site.config.ts` 的个人信息已修改（title、author、description 等）
- [ ] `.env` 的 `PUBLIC_TIMEZONE` 已设置
- [ ] 示例内容已替换为自己的内容
- [ ] favicon 已替换
- [ ] 如果是子路径部署，已设置 `base`

---

## 十五、Vercel 部署

### 15.1 为什么选择 Vercel

- **零配置部署：** Vercel 自动识别 Astro 项目，无需手动配置构建命令
- **全球 CDN：** 自动部署到全球边缘网络，访问速度快
- **预览部署：** 每个 Git 分支/PR 自动生成预览 URL
- **自定义域名：** 内置 HTTPS，配置简单
- **免费额度充足：** Hobby 计划适合个人博客

### 15.2 方式一：通过 Vercel 网站部署（推荐）

这是最简单的方式，适合大多数用户。

1. **将代码推送到 GitHub/GitLab/Bitbucket**

2. **导入项目：**
   - 访问 [vercel.com/new](https://vercel.com/new)
   - 点击 "Import" 导入你的仓库
   - Vercel 会自动检测到 Astro 框架

3. **配置环境变量：**
   - 在导入页面的 "Environment Variables" 区域添加：
     ```
     PUBLIC_TIMEZONE = Asia/Shanghai
     ```

4. **点击 "Deploy" 开始部署**

部署完成后，Vercel 会分配一个 `*.vercel.app` 域名。之后每次推送到 `main` 分支会自动触发生产部署，推送到其他分支会生成预览部署。

### 15.3 方式二：通过 Vercel CLI 部署

```bash
# 全局安装 Vercel CLI
pnpm add -g vercel

# 在项目目录下运行（首次会引导登录和项目关联）
vercel

# 部署到生产环境
vercel --prod
```

首次运行 `vercel` 命令时会询问一系列配置问题，Vercel 会自动检测 Astro 并使用正确的构建设置，选择默认选项即可。

### 15.4 静态站点部署（默认模式）

ThoughtLite 默认以静态模式构建，**无需安装任何额外适配器**，直接部署即可。

只需确保 `astro.config.ts` 中的 `site` 设置为你的实际域名：

```typescript
export default defineConfig({
  // Vercel 分配的域名或自定义域名
  site: "https://your-project.vercel.app",
  // 或自定义域名
  // site: "https://blog.example.com",
});
```

> **注意：** 静态部署不需要设置 `base` 路径（与 GitHub Pages 子路径部署不同），因为 Vercel 默认部署在根路径。

### 15.5 启用 SSR（按需渲染）

如果你需要服务端渲染功能（如动态 API 路由），可以安装 Vercel 适配器：

```bash
# 自动安装并配置（推荐）
pnpm astro add vercel
```

这会自动修改 `astro.config.ts`，添加适配器配置：

```typescript
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  // ...其他配置
});
```

> **对于 ThoughtLite：** 博客是纯静态站点，通常不需要 SSR。只有在你添加了需要服务端运行的自定义功能时才需要安装适配器。

### 15.6 Vercel 适配器高级配置

安装适配器后，可以使用以下高级功能：

```typescript
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel({
    // Vercel Web Analytics（网站分析）
    webAnalytics: { enabled: true },

    // 图片优化服务（使用 Vercel Image Optimization API）
    imageService: true,

    // ISR 增量静态再生（缓存按需渲染的页面）
    isr: {
      expiration: 86400,  // 缓存有效期（秒），86400 = 1 天
    },

    // Serverless 函数最大执行时间（秒）
    maxDuration: 30,
  }),
});
```

**常用配置项说明：**

| 配置项 | 说明 |
|--------|------|
| `webAnalytics` | 启用 Vercel 内置网站分析，自动注入追踪脚本 |
| `imageService` | 使用 Vercel 图片优化 API，自动优化图片格式和尺寸 |
| `isr` | 增量静态再生，首次请求后缓存页面，减少冷启动 |
| `maxDuration` | Serverless 函数超时时间，免费计划最大 10 秒 |
| `includeFiles` | 指定需要打包到 Serverless 函数的额外文件 |
| `excludeFiles` | 排除不需要打包的文件 |
| `edgeMiddleware` | 在 Vercel Edge 运行 Astro 中间件 |
| `skewProtection` | 启用版本偏差保护（Pro/Enterprise 计划） |

### 15.7 自定义域名

1. **在 Vercel Dashboard 中添加域名：**
   - 进入项目 → Settings → Domains
   - 输入你的域名（如 `blog.example.com`）

2. **配置 DNS 记录：**
   - **CNAME 记录：** `blog` → `cname.vercel-dns.com`
   - 或 **A 记录：** `@` → `76.76.21.21`

3. **更新 `astro.config.ts`：**
   ```typescript
   site: "https://blog.example.com"
   ```

4. Vercel 会自动配置 HTTPS 证书。

### 15.8 环境变量配置

在 Vercel Dashboard 中设置环境变量：

- 进入项目 → Settings → Environment Variables
- 添加：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `PUBLIC_TIMEZONE` | `Asia/Shanghai` | Production, Preview, Development |

也可以通过 CLI 设置：
```bash
vercel env add PUBLIC_TIMEZONE
```

### 15.9 `vercel.json` 可选配置

在项目根目录创建 `vercel.json` 可以自定义部署行为（大多数情况下不需要）：

```json
{
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 15.10 部署前检查清单

- [ ] `astro.config.ts` 的 `site` 已改为你的 Vercel 域名或自定义域名
- [ ] `site.config.ts` 的个人信息已修改（title、author、description 等）
- [ ] Vercel Dashboard 中已设置 `PUBLIC_TIMEZONE` 环境变量
- [ ] 示例内容已替换为自己的内容
- [ ] favicon 已替换
- [ ] **不需要** 设置 `base` 路径（Vercel 部署在根路径）

---

## 十六、常见定制场景速查

### 修改站点标题和描述

→ 编辑 `site.config.ts` 的 `title` 和 `description`

### 修改首页标语

→ 编辑 `site.config.ts` 的 `prologue`（支持 `\n` 换行）

### 修改版权信息

→ 编辑 `site.config.ts` 的 `copyright`，页脚会自动显示对应的 CC 图标

### 修改导航栏链接

→ 编辑 `src/layouts/header/Header.astro` 中的 `routes` 数组

### 修改主题配色

→ 编辑 `src/styles/global.css` 中 `:root` 和 `[data-theme="dark"]` 的 CSS 变量

### 更换正文字体

→ 修改 `astro.config.ts` 的 `experimental.fonts` 和 `src/styles/global.css` 的 `@theme`

### 修改代码高亮主题

→ 修改 `astro.config.ts` 中 `shikiConfig.themes`

### 添加/移除热力图

→ 热力图在 `src/pages/[...locale]/index.astro` 中引入，直接删除或修改配置

### 修改分页数量

→ 编辑 `site.config.ts` 的 `pagination`

### 添加友情链接

→ 编辑 `src/content/information/[locale]/linkroll.mdx` 中的 `links` 数组

### 修改关于页

→ 编辑 `src/content/information/[locale]/introduction.md` 和 `chronicle.yaml`

### 移除 "Powered by" 信息

→ 编辑 `src/layouts/Footer.astro`，删除或修改 `<code>` 区块

### 添加自定义页面

1. 在 `src/pages/[...locale]/` 下创建新的 `.astro` 文件
2. 使用 `Base` 布局包裹
3. 实现 `getStaticPaths` 以支持多语言
4. 如需添加到导航栏，修改 `Header.astro` 的 `routes`

### 修改 404 页面

→ 编辑 `src/pages/404.astro`

### 禁用某些 Markdown 插件

→ 在 `astro.config.ts` 的 `remarkPlugins` 或 `rehypePlugins` 数组中注释掉或删除对应插件

---

## 附录：项目文件索引

### 配置文件

| 文件 | 说明 |
|------|------|
| `site.config.ts` | 站点业务配置 |
| `astro.config.ts` | Astro 框架配置 |
| `tsconfig.json` | TypeScript & 路径别名 |
| `.env` / `.env.example` | 环境变量 |
| `biome.json` | 代码质量配置 |
| `svelte.config.js` | Svelte 配置 |

### 布局文件

| 文件 | 说明 |
|------|------|
| `src/layouts/App.astro` | HTML 根壳、meta、字体 |
| `src/layouts/Base.astro` | 页面主体布局 |
| `src/layouts/header/Header.astro` | 导航栏 |
| `src/layouts/header/ThemeSwitcher.astro` | 暗色模式切换 |
| `src/layouts/header/Navigator.svelte` | 导航高亮组件 |
| `src/layouts/header/LanguagePicker.svelte` | 语言切换 |
| `src/layouts/header/Menu.astro` | 下拉菜单容器 |
| `src/layouts/Footer.astro` | 页脚 |

### 页面文件

| 文件 | 说明 |
|------|------|
| `src/pages/[...locale]/index.astro` | 首页 |
| `src/pages/[...locale]/note/index.astro` | 长文列表 |
| `src/pages/[...locale]/note/[...id]/index.astro` | 长文详情 |
| `src/pages/[...locale]/jotting/index.astro` | 短文列表 |
| `src/pages/[...locale]/jotting/[...id]/index.astro` | 短文详情 |
| `src/pages/[...locale]/about.astro` | 关于页 |
| `src/pages/[...locale]/policy.astro` | 政策页 |
| `src/pages/[...locale]/preface.astro` | 序文历史 |
| `src/pages/[...locale]/feed.xml.ts` | Atom Feed |
| `src/pages/404.astro` | 404 页 |
| `src/pages/500.astro` | 500 页 |

### 组件文件

| 文件 | 说明 |
|------|------|
| `src/components/Note.svelte` | 长文列表（筛选+分页） |
| `src/components/Jotting.svelte` | 短文列表（筛选+分页） |
| `src/components/Heatmap.astro` | 活动热力图 |
| `src/components/TOC.astro` | 文章目录 |
| `src/components/Sensitive.svelte` | 敏感内容门控 |
| `src/components/Pagination.svelte` | 分页控件 |
| `src/components/Icon.svelte` | 图标组件 |
| `src/components/Modal.svelte` | 模态框 |
| `src/components/Tip.svelte` | 提示组件 |
| `src/components/Linkroll.astro` | 友链展示 |
| `src/components/Position.astro` | 位置导航/面包屑 |

### 样式文件

| 文件 | 说明 |
|------|------|
| `src/styles/global.css` | 全局样式、主题色、Tailwind 配置 |
| `src/styles/markdown.css` | Markdown 内容样式 |

### 工具 & 插件

| 文件 | 说明 |
|------|------|
| `src/utils/config.ts` | 站点配置类型定义 |
| `src/utils/time.ts` | 时间处理工具 |
| `src/utils/code-copy.ts` | 代码复制按钮 Shiki 变换器 |
| `src/utils/remark/ruby.ts` | 注音语法插件 |
| `src/utils/remark/attr.ts` | HTML 属性语法插件 |
| `src/utils/remark/abbr.ts` | 缩写语法插件 |
| `src/utils/remark/spoiler.ts` | 剧透语法插件 |
| `src/utils/remark/github-alert.ts` | GitHub Alert 插件 |
| `src/utils/remark/table-wrapper.ts` | 表格滚动容器插件 |
| `src/utils/remark/reading.ts` | 阅读时间/字数统计插件 |
| `src/utils/remark/figure.ts` | 图片 Figure 增强插件 |
| `src/fonts/zeo-seven-fonts.ts` | 自定义字体 Provider |
| `src/graph/` | OG 图片生成 |
