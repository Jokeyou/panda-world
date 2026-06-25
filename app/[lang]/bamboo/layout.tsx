import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '熊猫百科',
  description: '关于大熊猫你不知道的100件事——从800万年演化史到饮食习性、繁殖秘密、保护现状。一篇读懂全球最受欢迎的动物明星。',
  openGraph: {
    title: '熊猫百科 | Panda World',
    description: '从演化起源到保护现状，一篇读懂大熊猫的一切',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '熊猫百科 | Panda World',
    description: '从演化起源到保护现状，一篇读懂大熊猫的一切',
    images: ['/opengraph-image'],
  },
  other: {
    'wechat:title': '熊猫百科 | Panda World',
    'wechat:description': '从演化起源到保护现状，一篇读懂大熊猫的一切',
    'wechat:image': '/opengraph-image',
  },
}

export default function BambooLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
