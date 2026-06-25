'use client'

import { createContext, useContext, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'

// ─── Types ──────────────────────────────────────────────────────
export type Lang = 'zh' | 'en'

// ─── Translation dictionaries (imported statically for client) ──
import zhDict from './zh.json'
import enDict from './en.json'

type DictType = typeof zhDict
type DotPrefix<T extends string, K extends string> = K extends '' ? T : `${T}.${K}`

// Recursive key paths — allows t('home.hero.title') type-safe keys
type DictKeys<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? DictKeys<T[K], DotPrefix<P, K>>
    : DotPrefix<P, K>
}[keyof T & string]

// For simplicity, accept any string key and do runtime lookup
type TranslationKey = string

// ─── Context ────────────────────────────────────────────────────
interface LanguageContextType {
  lang: Lang
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
  dict: DictType
}

const LangCtx = createContext<LanguageContextType>({
  lang: 'zh',
  t: (key: string) => key,
  dict: zhDict,
})

// ─── Provider ───────────────────────────────────────────────────
const dictionaries: Record<Lang, DictType> = {
  zh: zhDict,
  en: enDict,
}

export function LanguageProvider({
  lang,
  children,
}: {
  lang: Lang
  children: ReactNode
}) {
  const dict = dictionaries[lang] || dictionaries.zh

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      // Navigate nested keys like "home.hero.title"
      const parts = key.split('.')
      let value: unknown = dict
      for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
          value = (value as Record<string, unknown>)[part]
        } else {
          // Fallback: try zh dict
          let zhValue: unknown = dictionaries.zh
          for (const p of parts) {
            if (zhValue && typeof zhValue === 'object' && p in zhValue) {
              zhValue = (zhValue as Record<string, unknown>)[p]
            } else {
              return key
            }
          }
          value = zhValue
          break
        }
      }

      if (typeof value !== 'string') return key

      // Variable substitution: {name}, {count}, etc.
      if (vars) {
        return value.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`))
      }
      return value
    },
    [dict]
  )

  const contextValue = useMemo(
    () => ({ lang, t, dict }),
    [lang, t, dict]
  )

  return (
    <LangCtx.Provider value={contextValue}>
      {children}
    </LangCtx.Provider>
  )
}

// ─── Hook ───────────────────────────────────────────────────────
export function useTranslation() {
  return useContext(LangCtx)
}

// ─── Server-side dictionary loader ──────────────────────────────
// For use in server components (metadata generation, etc.)
export async function getDictionary(lang: Lang): Promise<DictType> {
  return dictionaries[lang] || dictionaries.zh
}

// ─── Language detection helpers ─────────────────────────────────
export function getLangFromPath(pathname: string): Lang {
  if (pathname.startsWith('/en/') || pathname === '/en') return 'en'
  return 'zh'
}

export function getLangFromCookie(cookieHeader: string | null): Lang | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(/(?:^|;\s*)lang=([^;]+)/)
  if (match && (match[1] === 'zh' || match[1] === 'en')) {
    return match[1] as Lang
  }
  return null
}

// ─── URL helpers ────────────────────────────────────────────────
export function localizePath(pathname: string, targetLang: Lang): string {
  // Remove any existing lang prefix
  let path = pathname
  if (path.startsWith('/en/')) {
    path = path.slice(3) || '/'
  } else if (path === '/en') {
    path = '/'
  }

  // Add prefix for English, leave as-is for Chinese
  if (targetLang === 'en') {
    return path === '/' ? '/en' : `/en${path}`
  }
  return path
}

// For client-side language storage
export function getStoredLang(): Lang | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('lang')
    if (stored === 'zh' || stored === 'en') return stored
  } catch {}
  return null
}

export function setStoredLang(lang: Lang): void {
  try {
    localStorage.setItem('lang', lang)
  } catch {}
}

export function getBrowserLang(): Lang {
  if (typeof window === 'undefined') return 'zh'
  const navLang = navigator.language || (navigator as any).userLanguage || ''
  if (navLang.startsWith('zh')) return 'zh'
  return 'en'
}
