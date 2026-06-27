import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import { BackToTop } from '@/components/Navbar'
import JsonLd from '@/components/JsonLd'
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/jsonld'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://panda-world-one.vercel.app'),
  title: {
    default: '🐼 Panda World · 全球大熊猫平台',
    template: '%s | Panda World',
  },
  description: '全球大熊猫直播聚合平台 · 熊猫图鉴 · 家族树 · 趣味测试。看遍全世界的熊猫！',
  keywords: ['大熊猫', 'panda', '直播', '熊猫频道', 'iPanda', '花花', '萌兰', '福宝'],
  openGraph: {
    title: 'Panda World · 全球大熊猫平台',
    description: '全球大熊猫直播聚合平台 · 熊猫图鉴 · 家族树 · 趣味测试',
    type: 'website',
    locale: 'zh_CN',
    siteName: 'Panda World',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Panda World' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Panda World · 全球大熊猫平台',
    description: '全球大熊猫直播聚合平台 · 熊猫图鉴 · 家族树 · 趣味测试',
    images: ['/opengraph-image'],
    creator: '@PandaWorld',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://panda-world-one.vercel.app',
  },
  // WeChat / Chinese social platforms global defaults
  other: {
    'wechat:title': 'Panda World · 全球大熊猫平台',
    'wechat:description': '全球大熊猫直播聚合平台 · 熊猫图鉴 · 家族树 · 趣味测试。看遍全世界的熊猫！',
    'wechat:image': '/opengraph-image',
    'fb:app_id': '',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bamboo-pattern">
        <JsonLd data={getOrganizationSchema() as unknown as Record<string, unknown>} />
        <JsonLd data={getWebSiteSchema() as unknown as Record<string, unknown>} />
        <ThemeProvider>
          <div className="page-enter flex flex-col flex-1">
            {children}
          </div>
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
