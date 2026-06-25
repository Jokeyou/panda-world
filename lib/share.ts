/**
 * Panda World 各页面分享文案生成器
 * 统一管理 MBTI结果、首页、图鉴等页面的分享文案
 */

export interface ShareText {
  title: string
  text: string
  url: string
  hashtags: string[]
}

export interface MbtiShareData {
  name: string
  nameEn: string
  title: string
  traits: string[]
}

// ============================================================
// MBTI 结果页分享
// ============================================================

const mbtiShareTemplates: Record<string, (data: MbtiShareData) => string> = {
  zh: (data) =>
    `我今天的熊猫人格是【${data.name}·${data.title}】🐼 ${data.traits.slice(0, 2).join('、')}……你也来测测你的专属熊猫人格！`,
  en: (data) =>
    `My panda personality is【${data.nameEn}·${data.title}】🐼 ${data.traits.slice(0, 2).join(', ')}…Find yours!`,
}

/**
 * 获取 MBTI 结果页分享文本
 */
export function getMbtiShareText(
  data: MbtiShareData,
  lang: 'zh' | 'en' = 'zh',
  siteUrl: string = 'https://pandaworld.vercel.app'
): ShareText {
  const template = mbtiShareTemplates[lang] || mbtiShareTemplates['zh']
  return {
    title: `🐼 熊猫 MBTI 测试`,
    text: `${template(data)} ${siteUrl}/mbti`,
    url: `${siteUrl}/mbti`,
    hashtags: ['PandaWorld', '大熊猫', 'MBTI', data.name],
  }
}

// ============================================================
// 首页分享
// ============================================================

/**
 * 获取首页分享文案
 */
export function getHomeShareText(
  lang: 'zh' | 'en' = 'zh',
  siteUrl: string = 'https://pandaworld.vercel.app'
): ShareText {
  if (lang === 'en') {
    return {
      title: 'Panda World · Global Panda Platform',
      text: `🐼 Watch live pandas worldwide, browse panda profiles, explore family trees & fun quizzes! ${siteUrl}`,
      url: siteUrl,
      hashtags: ['PandaWorld', 'GiantPanda', 'PandaLive'],
    }
  }
  return {
    title: 'Panda World · 全球大熊猫平台',
    text: `🐼 看遍全世界大熊猫直播！图鉴、家族树、趣味MBTI测试，都在 Panda World。${siteUrl}`,
    url: siteUrl,
    hashtags: ['PandaWorld', '大熊猫', '熊猫直播'],
  }
}

// ============================================================
// 图鉴页分享
// ============================================================

/**
 * 获取图鉴页分享文案
 */
export function getPandasShareText(
  lang: 'zh' | 'en' = 'zh',
  siteUrl: string = 'https://pandaworld.vercel.app'
): ShareText {
  if (lang === 'en') {
    return {
      title: 'Panda Profiles | Panda World',
      text: `🐼 Browse profiles of the world's most famous giant pandas! ${siteUrl}/pandas`,
      url: `${siteUrl}/pandas`,
      hashtags: ['PandaWorld', 'GiantPanda', 'PandaProfiles'],
    }
  }
  return {
    title: '熊猫图鉴 | Panda World',
    text: `🐼 认识全球最火的明星大熊猫！花花、萌兰、福宝…都在这里。${siteUrl}/pandas`,
    url: `${siteUrl}/pandas`,
    hashtags: ['PandaWorld', '大熊猫', '熊猫图鉴'],
  }
}

// ============================================================
// 通用分享执行函数（浏览器端）
// ============================================================

/**
 * 执行分享：优先 native share API，fallback 复制到剪贴板
 * @returns true 表示已分享或已复制
 */
export async function performShare(share: ShareText): Promise<boolean> {
  if (typeof navigator === 'undefined') return false

  if (navigator.share) {
    try {
      await navigator.share({
        title: share.title,
        text: share.text,
        url: share.url,
      })
      return true
    } catch {
      // User cancelled or API failed → fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(share.text)
    return true
  } catch {
    return false
  }
}
