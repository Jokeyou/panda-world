'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { setStoredLang } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const { lang } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  function toggle() {
    const targetLang = lang === 'zh' ? 'en' : 'zh'
    setStoredLang(targetLang)

    // Build target path
    let path = pathname
    // Strip current lang prefix
    if (path.startsWith('/en/')) {
      path = path.slice(3) || '/'
    } else if (path === '/en') {
      path = '/'
    }

    // Add prefix for English
    if (targetLang === 'en') {
      path = path === '/' ? '/en' : `/en${path}`
    }

    router.push(path)
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold
                 bg-bamboo-100 text-bamboo-700 hover:bg-bamboo-200
                 dark:bg-bamboo-900/30 dark:text-bamboo-400 dark:hover:bg-bamboo-800/40
                 transition-colors duration-200"
      title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <span>{lang === 'zh' ? 'EN' : '中'}</span>
    </button>
  )
}
