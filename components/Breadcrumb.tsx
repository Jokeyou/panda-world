'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import pandas from '@/data/pandas.json'

// 路由 → 中文标签映射
const routeLabels: Record<string, string> = {
  '': '首页',
  'live': '全球直播',
  'pandas': '熊猫图鉴',
  'bamboo': '熊猫百科',
  'family-tree': '家族树',
  'mbti': '🐼 MBTI',
  'birthdays': '生日追踪',
}

// Strip /en prefix for breadcrumb processing (mirrors Navbar's stripLangPrefix)
function stripLangPrefix(path: string): string {
  if (path.startsWith('/en/')) return path.slice(3) || '/'
  if (path === '/en') return '/'
  return path
}

export default function Breadcrumb() {
  const pathname = usePathname()

  // 首页不显示面包屑（包括 /en）
  const normalized = stripLangPrefix(pathname)
  if (normalized === '/') return null

  const isEn = pathname.startsWith('/en')
  const segments = normalized.split('/').filter(Boolean)

  // 构建面包屑项：[{ label, href }]
  const items = segments.map((seg, i) => {
    const base = '/' + segments.slice(0, i + 1).join('/')
    const href = isEn && base !== '/' ? `/en${base}` : base

    // 熊猫详情页：从数据中查熊猫名字
    if (segments[0] === 'pandas' && i === 1) {
      const panda = pandas.find((p) => p.id === seg)
      return { label: panda?.name ?? seg, href }
    }

    return { label: routeLabels[seg] ?? seg, href }
  })

  return (
    <nav
      aria-label="面包屑导航"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
    >
      <ol className="flex items-center gap-1.5 text-sm">
        {/* 首页 */}
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 text-panda-400 hover:text-bamboo-600 transition-colors"
          >
            <Home size={14} />
            <span className="hidden sm:inline">首页</span>
          </Link>
        </li>

        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1.5">
            <ChevronRight size={14} className="text-panda-300 flex-shrink-0" />
            {i === items.length - 1 ? (
              <span className="text-panda-800 font-medium truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-panda-400 hover:text-bamboo-600 transition-colors truncate max-w-[160px]"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
