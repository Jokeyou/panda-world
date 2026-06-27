/**
 * JSON-LD 结构化数据生成器
 * 为搜索引擎（Google / Bing / Baidu 等）提供 Schema.org 富文本数据
 */

// ─── 类型 ────────────────────────────────────────────

export interface Panda {
  id: string
  name: string
  nameEn: string
  nicknames: string[]
  gender: string
  birthDate: string
  birthPlace: string
  currentHome: string
  mother: string
  father: string
  weight: string
  personality: string[]
  claimToFame: string
  funFacts: string[]
  tags: string[]
  imageUrl: string
  spectacleNumber: string
  familyId: string
  life_events?: { date: string; title: string; description: string }[]
}

// ─── 通用工具 ────────────────────────────────────────

const SITE_URL = 'https://panda-world-one.vercel.app'

// ─── 组织 / 站点 ─────────────────────────────────────

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Panda World',
    alternateName: '熊猫世界',
    url: SITE_URL,
    logo: `${SITE_URL}/opengraph-image`,
    description:
      '全球大熊猫直播聚合平台 · 熊猫图鉴 · 家族树 · 趣味测试。看遍全世界的熊猫！',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'hello@panda-world-one.vercel.app',
    },
  }
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Panda World',
    alternateName: '熊猫世界',
    url: SITE_URL,
    description:
      '全球大熊猫直播聚合平台 · 熊猫图鉴 · 家族树 · 趣味测试',
    inLanguage: ['zh-CN', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/pandas?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// ─── 面包屑 ──────────────────────────────────────────

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// ─── 熊猫详情页：Article ─────────────────────────────

export function getPandaArticleSchema(panda: Panda, lang: 'zh' | 'en') {
  const age = new Date().getFullYear() - new Date(panda.birthDate).getFullYear()
  const isEn = lang === 'en'

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isEn
      ? `${panda.nameEn} (${panda.name}) — ${panda.claimToFame}`
      : `${panda.name}（${panda.nameEn}）——${panda.claimToFame}`,
    description: isEn
      ? `${panda.nameEn} is a ${age}-year-old giant panda living at ${panda.currentHome}. ${panda.claimToFame}`
      : `${panda.name}是一只${age}岁的大熊猫，现居${panda.currentHome}。${panda.claimToFame}`,
    image: `${SITE_URL}/pandas/${panda.id}/opengraph-image`,
    datePublished: panda.life_events?.[0]?.date || panda.birthDate,
    dateModified: panda.life_events?.[panda.life_events.length - 1]?.date || panda.birthDate,
    author: {
      '@type': 'Organization',
      name: 'Panda World',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Panda World',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/opengraph-image`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/pandas/${panda.id}`,
    },
    about: {
      '@type': 'Thing',
      name: panda.name,
      description: isEn
        ? `${panda.nameEn} — ${panda.claimToFame}`
        : `${panda.name}——${panda.claimToFame}`,
    },
    keywords: [panda.name, panda.nameEn, ...panda.tags, ...panda.personality].join(','),
    inLanguage: isEn ? 'en' : 'zh-CN',
  }
}

// ─── 熊猫图鉴：ItemList ──────────────────────────────

export function getPandaItemListSchema(pandas: Panda[], lang: 'zh' | 'en') {
  const isEn = lang === 'en'
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isEn ? 'Panda Guide' : '熊猫图鉴',
    description: isEn
      ? 'Complete archives of global star pandas. Identity, personality, fun facts, and family relations.'
      : '收录全球明星大熊猫的完整档案。身份、性格、趣事、家族关系，持续更新。',
    numberOfItems: pandas.length,
    itemListElement: pandas.map((panda, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/pandas/${panda.id}`,
      name: `${panda.name} (${panda.nameEn})`,
      image: panda.imageUrl ? `${SITE_URL}${panda.imageUrl}` : undefined,
    })),
  }
}

// ─── 首页 ────────────────────────────────────────────

export function getHomePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Panda World · 全球大熊猫平台',
    description: '全球大熊猫直播聚合平台 · 熊猫图鉴 · 家族树 · 趣味测试',
    url: SITE_URL,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Panda World',
      url: SITE_URL,
    },
    about: {
      '@type': 'Thing',
      name: 'Giant Panda',
      description: '大熊猫（Ailuropoda melanoleuca），中国的国宝级动物',
    },
  }
}

// ─── 直播页：CollectionPage ──────────────────────────

export function getLiveCollectionSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '全球熊猫直播间 | Panda World',
    description:
      '聚合成都、华盛顿、爱丁堡、莫斯科等全球熊猫直播源。实时观看大熊猫的日常起居。',
    url: `${SITE_URL}/live`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Panda World',
      url: SITE_URL,
    },
  }
}

// ─── 家族树：WebApplication ──────────────────────────

export function getFamilyTreeSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '熊猫家族树 | Panda World',
    description:
      '全球首个熊猫家族谱系交互图。可视化浏览熊猫家族关系，搜索、缩放、拖拽。',
    url: `${SITE_URL}/family-tree`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
    },
  }
}

// ─── MBTI 测试：WebApplication ───────────────────────

export function getMbtiAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '熊猫 MBTI 测试 | Panda World',
    description:
      '5道趣味题，30秒找到你的专属熊猫人格。基于16只全球明星熊猫的真实性格数据。',
    url: `${SITE_URL}/mbti`,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
    },
  }
}

// ─── FAQ（百科页） ────────────────────────────────────

export function getBambooFaqSchema(lang: 'zh' | 'en') {
  const isEn = lang === 'en'
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: isEn ? 'What do giant pandas eat?' : '大熊猫吃什么？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: isEn
            ? 'Giant pandas eat 12–38 kg of bamboo per day, making up 99% of their diet. Occasionally they eat small animals or carrion.'
            : '大熊猫每天吃12–38公斤竹子，占饮食的99%。偶尔也吃小型动物或动物尸体。',
        },
      },
      {
        '@type': 'Question',
        name: isEn ? 'How many giant pandas are left in the wild?' : '野外还有多少只大熊猫？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: isEn
            ? 'As of 2024, approximately 1,900 giant pandas live in the wild, across 6 mountain ranges in Sichuan, Shaanxi, and Gansu provinces of China.'
            : '截至2024年，野外大熊猫种群数量约1,900只，分布于中国四川、陕西、甘肃的6大山系。',
        },
      },
      {
        '@type': 'Question',
        name: isEn ? 'Are giant pandas still endangered?' : '大熊猫还是濒危物种吗？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: isEn
            ? 'In 2016, IUCN downgraded giant pandas from "Endangered" to "Vulnerable." In 2021, China also downgraded them from first-class to second-class protected animals — a major conservation success.'
            : '2016年，世界自然保护联盟（IUCN）将大熊猫从"濒危"降为"易危"。2021年，中国将大熊猫从一级保护动物降为二级——这是一个重要的保护生物学成功案例。',
        },
      },
      {
        '@type': 'Question',
        name: isEn ? 'How long have giant pandas existed?' : '大熊猫存在了多少年？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: isEn
            ? 'Giant pandas have existed for about 8 million years, evolving from Ailurarctos. They are often called "living fossils."'
            : '大熊猫约存在了800万年，由始熊猫（Ailurarctos）演化而来，被称为"活化石"。',
        },
      },
    ],
  }
}
