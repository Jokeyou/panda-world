import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '家族树',
  description: '全球首个大熊猫家族谱系交互图。可视化浏览熊猫家族关系，谁是谁的爸妈兄弟姐妹，一目了然。支持缩放、拖拽、搜索。',
  openGraph: {
    title: '熊猫家族树 | Panda World',
    description: '全球首个大熊猫家族谱系交互图，可视化浏览熊猫家族关系',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '熊猫家族树 | Panda World',
    description: '全球首个大熊猫家族谱系交互图，可视化浏览熊猫家族关系',
    images: ['/opengraph-image'],
  },
  other: {
    'wechat:title': '熊猫家族树 | Panda World',
    'wechat:description': '全球首个大熊猫家族谱系交互图，可视化浏览熊猫家族关系',
    'wechat:image': '/opengraph-image',
  },
}

export default function FamilyTreeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
