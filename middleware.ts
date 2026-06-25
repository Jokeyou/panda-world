import { NextRequest, NextResponse } from 'next/server'

// Static assets and Next.js internals that should bypass language routing
const SKIP_PATHS = /^\/(_next|api|favicon\.ico|panda-og\.png|robots\.txt|sitemap\.xml|opengraph-image)/

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip static assets and Next.js internals
  if (SKIP_PATHS.test(pathname)) {
    return NextResponse.next()
  }

  // If path already has /en/ prefix, it matches [lang] directly — no rewrite needed
  if (pathname.startsWith('/en/') || pathname === '/en') {
    const response = NextResponse.next()

    // Ensure lang cookie is set for English paths
    if (!request.cookies.get('lang')?.value) {
      response.cookies.set('lang', 'en', {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
      })
    }

    return response
  }

  // For all other paths (no lang prefix), treat as Chinese (default)
  // Internally rewrite to /zh/... so [lang] dynamic segment gets lang='zh'

  // Build the internal path
  const internalPath = pathname === '/' ? '/zh' : `/zh${pathname}`

  // Rewrite internally — the browser URL stays unchanged
  const response = NextResponse.rewrite(new URL(internalPath, request.url))

  // Set lang cookie based on first visit
  const existingLang = request.cookies.get('lang')?.value

  if (!existingLang) {
    // Detect from Accept-Language header
    const acceptLang = request.headers.get('accept-language') || ''
    const prefersZh = acceptLang.toLowerCase().includes('zh')
    const detectedLang = prefersZh ? 'zh' : 'en'

    response.cookies.set('lang', detectedLang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  // Match all paths except static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)'],
}
