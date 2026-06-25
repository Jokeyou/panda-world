import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '熊猫图鉴',
  description: '收录全球明星大熊猫的详细档案——身份信息、性格特点、家族关系、趣味故事。花花、萌兰、福宝……认识每一只可爱的熊猫。',
  openGraph: {
    title: '熊猫图鉴 | Panda World',
    description: '收录全球明星大熊猫详细档案，认识每一只可爱的熊猫',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '熊猫图鉴 | Panda World',
    description: '收录全球明星大熊猫详细档案，认识每一只可爱的熊猫',
    images: ['/opengraph-image'],
  },
  other: {
    'wechat:title': '熊猫图鉴 | Panda World',
    'wechat:description': '收录全球明星大熊猫详细档案，认识每一只可爱的熊猫',
    'wechat:image': '/opengraph-image',
  },
}

export default function PandasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
