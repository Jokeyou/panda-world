'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Globe, Camera, BookOpen, Network, Sparkles, Leaf, Search, Sun, Moon, ArrowUp, Cake } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { useTranslation } from '@/lib/i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import pandas from '@/data/pandas.json'

// Nav item keys for translation lookup
const navItemKeys = ['live', 'pandas', 'bamboo', 'familyTree', 'mbti', 'birthdays'] as const
const navIcons = [Camera, BookOpen, Leaf, Network, Sparkles, Cake] as const

const navItems = [
  { href: '/live', i18nKey: 'nav.live' as const, icon: Camera },
  { href: '/pandas', i18nKey: 'nav.pandas' as const, icon: BookOpen },
  { href: '/bamboo', i18nKey: 'nav.bamboo' as const, icon: Leaf },
  { href: '/family-tree', i18nKey: 'nav.familyTree' as const, icon: Network },
  { href: '/mbti', i18nKey: 'nav.mbti' as const, icon: Sparkles },
  { href: '/birthdays', i18nKey: 'nav.birthdays' as const, icon: Cake },
]

// Helper: strip /en prefix from path for active-link matching
function stripLangPrefix(path: string): string {
  if (path.startsWith('/en/')) return path.slice(3) || '/'
  if (path === '/en') return '/'
  return path
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggle: toggleTheme } = useTheme()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [navHidden, setNavHidden] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastScrollYRef = useRef(0)

  // Strip /en prefix for active-link detection
  const normalizedPath = useMemo(() => stripLangPrefix(pathname), [pathname])

  // 搜索建议：匹配熊猫名称
  const suggestions = searchQuery.trim()
    ? pandas
        .filter(
          (p) =>
            p.name.includes(searchQuery.trim()) ||
            p.nameEn?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
            p.nicknames?.some((n) => n.includes(searchQuery.trim()))
        )
        .slice(0, 6)
    : []

  // 点击外部关闭搜索建议
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 滚动方向追踪：向下隐藏，向上显示
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        if (currentScrollY > lastScrollYRef.current && currentScrollY > 80) {
          setNavHidden(true)
        } else {
          setNavHidden(false)
        }
        lastScrollYRef.current = currentScrollY
        ticking = false
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 键盘导航
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && suggestions.length > 0) {
        router.push(`/pandas/${suggestions[0].id}`)
        setSearchQuery('')
        setShowSuggestions(false)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          router.push(`/pandas/${suggestions[selectedIndex].id}`)
        } else if (suggestions.length > 0) {
          router.push(`/pandas/${suggestions[0].id}`)
        }
        setSearchQuery('')
        setShowSuggestions(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  function isActive(href: string) {
    if (href === '/') return normalizedPath === '/'
    return normalizedPath.startsWith(href)
  }

  return (
    <nav className={`sticky top-0 z-50 bg-cream/75 backdrop-blur-2xl border-b border-panda-100/40 shadow-sm
                    dark:bg-panda-900/85 dark:border-panda-700/40
                    transition-transform duration-300 ease-in-out will-change-transform
                    ${navHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <span className="text-3xl group-hover:scale-110 transition-transform">🐼</span>
            <span className="text-xl font-bold text-panda-900 dark:text-panda-100 hidden sm:block">
              Panda<span className="text-bamboo-600 dark:text-bamboo-400">World</span>
            </span>
          </Link>

          {/* 搜索框 */}
          <div ref={searchRef} className="relative flex-1 max-w-xs">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-panda-400 dark:text-panda-500 pointer-events-none"
              />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                  setSelectedIndex(-1)
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder={t('nav.searchPlaceholder')}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/70 backdrop-blur-sm
                           border border-panda-200/60 text-sm text-panda-900
                           placeholder:text-panda-400
                           focus:outline-none focus:ring-2 focus:ring-bamboo-400/40 focus:border-bamboo-400
                           transition-all duration-200
                           dark:bg-panda-800/70 dark:border-panda-600/40 dark:text-panda-100
                           dark:placeholder:text-panda-500
                           dark:focus:ring-bamboo-500/30 dark:focus:border-bamboo-500"
              />
            </div>

            {/* 搜索建议下拉 */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-white/95 backdrop-blur-xl
                              rounded-xl border border-panda-100 shadow-lg overflow-hidden z-50
                              dark:bg-panda-800/95 dark:border-panda-700/50">
                {suggestions.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      router.push(`/pandas/${p.id}`)
                      setSearchQuery('')
                      setShowSuggestions(false)
                      setSelectedIndex(-1)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm
                                transition-colors duration-100
                                ${i === selectedIndex
                                  ? 'bg-bamboo-50 text-bamboo-800 dark:bg-bamboo-900/40 dark:text-bamboo-200'
                                  : 'text-panda-700 hover:bg-panda-50 dark:text-panda-300 dark:hover:bg-panda-700/50'
                                }`}
                  >
                    <span className="text-lg flex-shrink-0">🐼</span>
                    <div className="min-w-0">
                      <span className="font-medium">{p.name}</span>
                      {p.nameEn && (
                        <span className="text-panda-400 ml-1.5 text-xs">{p.nameEn}</span>
                      )}
                      {p.nicknames && p.nicknames.length > 0 && (
                        <span className="text-panda-400 text-xs ml-1.5">
                          · {p.nicknames.slice(0, 2).join(' · ')}
                        </span>
                      )}
                    </div>
                    <span className="ml-auto text-xs text-panda-400 flex-shrink-0">
                      {p.currentHome?.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* 无结果提示 */}
            {showSuggestions && searchQuery.trim() && suggestions.length === 0 && (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-white/95 backdrop-blur-xl
                              rounded-xl border border-panda-100 shadow-lg p-4 text-center
                              text-sm text-panda-400 z-50">
                {t('nav.searchEmpty')}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-panda-100 dark:hover:bg-panda-700
                       transition-colors flex-shrink-0"
            aria-label={theme === 'dark' ? t('nav.toggleThemeLight') : t('nav.toggleThemeDark')}
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-panda-600" />
            )}
          </button>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                             transition-all duration-200
                             ${active
                               ? 'bg-bamboo-50 text-bamboo-700 shadow-sm ring-1 ring-bamboo-200/60 dark:bg-bamboo-900/30 dark:text-bamboo-300 dark:ring-bamboo-700/40'
                               : 'text-panda-600 hover:text-panda-900 hover:bg-panda-50 dark:text-panda-400 dark:hover:text-panda-100 dark:hover:bg-panda-800/50'
                             }`}
                >
                  <item.icon size={16} />
                  {t(item.i18nKey)}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5
                                     bg-bamboo-500 rounded-full hidden" />
                  )}
                </Link>
              )
            })}
            <a
              href="https://www.ipanda.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 ml-2 px-4 py-2 rounded-xl text-sm font-medium
                         bg-bamboo-600 text-white hover:bg-bamboo-700
                         transition-all duration-200"
            >
              <Globe size={16} />
              {t('nav.ipanda')}
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl hover:bg-panda-50 dark:hover:bg-panda-800 transition-colors flex-shrink-0"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav — slide-in panel + overlay */}
      {/* Overlay */}
      <div
        className={`mobile-menu-overlay ${open ? 'mobile-menu-overlay--visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        className={`mobile-menu-panel ${open ? 'mobile-menu-panel--open' : ''}`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-panda-100/60 dark:border-panda-700/40">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="text-2xl">🐼</span>
            <span className="text-lg font-bold text-panda-900 dark:text-panda-100">
              Panda<span className="text-bamboo-600 dark:text-bamboo-400">World</span>
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl hover:bg-panda-100 dark:hover:bg-panda-700 transition-colors"
            aria-label="关闭菜单"
          >
            <X size={22} className="text-panda-600 dark:text-panda-300" />
          </button>
        </div>

        {/* Panel nav items */}
        <div className="px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200
                            ${active
                              ? 'bg-bamboo-50 text-bamboo-700 font-semibold dark:bg-bamboo-900/30 dark:text-bamboo-300'
                              : 'text-panda-700 hover:bg-panda-50 dark:text-panda-300 dark:hover:bg-panda-800/50'
                            }`}
              >
                <item.icon size={20} />
                <span>{t(item.i18nKey)}</span>
                {active && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-bamboo-500" />
                )}
              </Link>
            )
          })}

          {/* iPanda link in mobile panel */}
          <a
            href="https://www.ipanda.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200
                       bg-bamboo-600 text-white hover:bg-bamboo-700 font-medium mt-2"
          >
            <Globe size={20} />
            <span>{t('nav.ipanda')}</span>
          </a>

          {/* Language Switcher — mobile */}
          <div className="flex justify-center pt-3">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}

// ===== Back-to-Top FAB =====
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 300)
        ticking = false
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`back-to-top-fab ${visible ? 'back-to-top-fab--visible' : ''}`}
      aria-label="回到顶部"
    >
      <ArrowUp size={22} />
    </button>
  )
}
