# Panda World · 全球大熊猫平台

> Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion

## 项目定位
全球首个大熊猫直播聚合 + 结构化数据 + 互动体验平台。不做纯直播聚合（壁垒低），而是数据+知识+社区三位一体。

## 技术栈
- Next.js 14 App Router + TypeScript (strict mode)
- Tailwind CSS 3.4 (自定义配色: bamboo #4A7C32, panda #1A1A1A, cream #FDFAF3)
- Framer Motion 11 (动画)
- Lucide React (图标)
- 静态 JSON 数据库 (data/pandas.json, streams.json, families.json)

## 目录结构
```
app/
├── page.tsx              # 首页
├── layout.tsx            # 根布局
├── globals.css           # 全局样式
├── live/page.tsx         # 直播聚合
├── pandas/page.tsx       # 图鉴
├── pandas/[id]/page.tsx  # 详情 (SSG)
├── family-tree/page.tsx  # 家族树
└── mbti/page.tsx         # MBTI测试
components/
├── Navbar.tsx, Footer.tsx, PandaAvatar.tsx
data/
├── pandas.json (16只), streams.json (6路), families.json (6个)
```

## 配色系统
- bamboo (竹绿): #4A7C32 → 主色调
- panda (熊猫黑): #1A1A1A → 文字
- cream (米白): #FDFAF3 → 背景
- warm (暖橙): 标签/强调

## 约束
- 所有页面必须支持静态生成 (SSG)
- 组件放在 components/ 下
- 数据文件放在 data/ 下
- 不要引入新的大依赖，优先用已有工具
- 改完代码后必须验证 `npm run build` 通过
- 移动端优先设计
- 保持现有功能完整，只做增量改进
