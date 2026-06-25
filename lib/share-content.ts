/**
 * Social share content generator for Panda World
 * Generates platform-specific share copy for Twitter, Facebook, WeChat, etc.
 */

export interface PandaShareData {
  id: string
  name: string
  nameEn: string
  claimToFame: string
  funFacts: string[]
  birthDate: string
  tags: string[]
  personality: string[]
}

export interface ShareContent {
  /** og:title / twitter:title / wechat:title */
  title: string
  /** og:description / twitter:description / wechat:description */
  description: string
  /** Twitter hashtags (without # prefix) */
  hashtags: string[]
  /** WeChat Moments title (shorter, friendlier) */
  wechatTitle: string
  /** WeChat Moments description */
  wechatDesc: string
  /** WeChat share card appid (optional) */
  wechatAppId?: string
}

/**
 * Calculate panda age from birthDate
 */
function getAge(birthDate: string): number {
  return new Date().getFullYear() - new Date(birthDate).getFullYear()
}

/**
 * Generate a deterministic fun fact index based on date (for consistent sharing)
 */
function getDailyFactIndex(facts: string[], seed: number): number {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  )
  return (dayOfYear + seed) % facts.length
}

/**
 * Generate share content for a panda
 * @param panda - The panda data object
 * @param lang - Language ('zh' | 'en')
 * @returns ShareContent with platform-specific share copy
 */
export function getShareContent(
  panda: PandaShareData,
  lang: 'zh' | 'en' = 'zh'
): ShareContent {
  const age = getAge(panda.birthDate)
  const factIndex = getDailyFactIndex(panda.funFacts, panda.id.length)
  const funFact = panda.funFacts[factIndex] || panda.funFacts[0]

  if (lang === 'en') {
    const genderLabel = '' // omitted in English for brevity
    return {
      title: `${panda.nameEn} · ${panda.name} | Panda World`,
      description: `${panda.nameEn} (${panda.name}), ${age} years old. ${panda.claimToFame} Fun fact: ${funFact} 🐼`,
      hashtags: ['PandaWorld', 'GiantPanda', panda.nameEn.replace(/\s/g, '')],
      wechatTitle: `${panda.nameEn}'s Panda Profile`,
      wechatDesc: `${age} years old · ${panda.claimToFame}`,
    }
  }

  // Chinese (default)
  return {
    title: `${panda.name} · ${panda.nameEn} | Panda World`,
    description: `${panda.name}（${panda.nameEn}），${age}岁，${panda.claimToFame}。冷知识：${funFact} 🐼 #PandaWorld`,
    hashtags: ['PandaWorld', '大熊猫', '熊猫图鉴', panda.name],
    wechatTitle: `来看看${panda.name}的熊猫档案 🐼`,
    wechatDesc: `${age}岁了 · ${panda.claimToFame.slice(0, 50)}`,
  }
}

/**
 * Generate OG image path for a panda
 * Uses Next.js file-based opengraph-image generation
 */
export function getPandaOgImageUrl(id: string): string {
  return `/pandas/${id}/opengraph-image`
}

/**
 * Generate absolute OG image URL
 */
export function getPandaOgImageAbsolute(id: string, baseUrl: string): string {
  return `${baseUrl}/pandas/${id}/opengraph-image`
}
