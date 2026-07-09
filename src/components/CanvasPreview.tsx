import { useEffect, useRef, useState } from 'react'
import { createImagePages } from '../image/compose'
import { renderPageToCanvas } from '../image/render'
import type { ImageSettings } from '../types/image'

interface CanvasPreviewProps {
  text: string
  settings: ImageSettings
  seed: string
}

export function CanvasPreview({ text, settings, seed }: CanvasPreviewProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    host.replaceChildren()
    setError('')
    if (!text || navigator.userAgent.includes('jsdom')) return

    try {
      const previewSettings = {
        ...settings,
        targetPageHeight: Math.min(settings.targetPageHeight, 1000),
      }
      const page = createImagePages(text, previewSettings, 'split')[0]
      if (!page) return
      const canvas = renderPageToCanvas(page, previewSettings, seed)
      canvas.className = 'preview-canvas'
      canvas.setAttribute('aria-label', '图片效果预览')
      host.append(canvas)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '无法生成预览')
    }
  }, [seed, settings, text])

  return (
    <div className="canvas-stage">
      {!text && <p>输入文字后，这里会显示图片第一页。</p>}
      <div ref={hostRef} className="canvas-host" />
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
