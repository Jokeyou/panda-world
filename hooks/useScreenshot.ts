'use client'

import { useCallback } from 'react'

/**
 * Zero-dependency screenshot hook.
 * Uses SVG foreignObject → Canvas → PNG download.
 * Works for DOM elements that don't rely on external images.
 */

function inlineComputedStyles(source: Element, target: Element) {
  const computed = window.getComputedStyle(source)
  const cssText = Array.from(computed)
    .map((key) => `${key}:${computed.getPropertyValue(key)}`)
    .join(';')

  ;(target as HTMLElement).style.cssText = cssText

  // Recurse into children (match by index)
  const sourceChildren = source.children
  const targetChildren = target.children
  for (let i = 0; i < sourceChildren.length && i < targetChildren.length; i++) {
    inlineComputedStyles(sourceChildren[i], targetChildren[i])
  }
}

export function useScreenshot() {
  const capture = useCallback(
    async (element: HTMLElement, filename = 'panda-mbti.png'): Promise<boolean> => {
      try {
        const rect = element.getBoundingClientRect()
        const width = Math.ceil(rect.width)
        const height = Math.ceil(rect.height)

        // 1. Deep-clone the element
        const clone = element.cloneNode(true) as HTMLElement

        // 2. Inline all computed styles into the clone
        inlineComputedStyles(element, clone)

        // 3. Serialize to XML
        const serializer = new XMLSerializer()
        const htmlString = serializer.serializeToString(clone)

        // 4. Build SVG with foreignObject
        const svgString = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <defs>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;display=swap');
              </style>
            </defs>
            <foreignObject width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml" style="margin:0;padding:0">
                ${htmlString}
              </div>
            </foreignObject>
          </svg>
        `

        // 5. Convert SVG to data URL
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)

        // 6. Draw to canvas (for PNG conversion + reliable rendering)
        const img = new Image()
        const loaded = await new Promise<boolean>((resolve) => {
          img.onload = () => resolve(true)
          img.onerror = () => resolve(false)
          img.src = url
        })

        if (!loaded) {
          URL.revokeObjectURL(url)
          // Fallback: try direct SVG download
          const a = document.createElement('a')
          a.href = url
          a.download = filename.replace('.png', '.svg')
          a.click()
          URL.revokeObjectURL(url)
          return true
        }

        const canvas = document.createElement('canvas')
        const dpr = window.devicePixelRatio || 1
        canvas.width = width * dpr
        canvas.height = height * dpr
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          URL.revokeObjectURL(url)
          return false
        }

        ctx.scale(dpr, dpr)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)

        URL.revokeObjectURL(url)

        // 7. Download as PNG
        const pngBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/png')
        })

        if (!pngBlob) return false

        const downloadUrl = URL.createObjectURL(pngBlob)
        const a = document.createElement('a')
        a.href = downloadUrl
        a.download = filename
        a.click()
        URL.revokeObjectURL(downloadUrl)

        return true
      } catch (err) {
        console.error('Screenshot failed:', err)
        return false
      }
    },
    [],
  )

  return { capture }
}
