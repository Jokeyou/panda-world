// Server-safe i18n exports — no 'use client' directive
// For use in server components (generateMetadata, etc.)

export type Lang = 'zh' | 'en'

import zhDict from './zh.json'
import enDict from './en.json'

type DictType = typeof zhDict

const dictionaries: Record<Lang, DictType> = {
  zh: zhDict,
  en: enDict,
}

export function getDictionary(lang: Lang): DictType {
  return dictionaries[lang] || dictionaries.zh
}
