import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '熊猫MBTI测试',
  description: '5道趣味题，匹配你的专属熊猫人格。你和花花、萌兰还是福宝最像？生成分享卡片和朋友一起玩！已帮助超12万人找到自己的熊猫人格。',
  openGraph: {
    title: '熊猫MBTI测试 | Panda World',
    description: '5道趣味题匹配你的专属熊猫人格，生成分享卡片和朋友一起玩！',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '熊猫MBTI测试 | Panda World',
    description: '5道趣味题匹配你的专属熊猫人格，生成分享卡片和朋友一起玩！',
    images: ['/opengraph-image'],
  },
  other: {
    'wechat:title': '熊猫MBTI测试 | Panda World',
    'wechat:description': '5道趣味题匹配你的专属熊猫人格，生成分享卡片和朋友一起玩！',
    'wechat:image': '/opengraph-image',
  },
}

export default function MBTILayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
