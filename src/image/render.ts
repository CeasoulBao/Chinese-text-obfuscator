import { createRandom } from '../obfuscation/random'
import type { ImagePage, ImageSettings } from '../types/image'

function setAlphaColor(
  context: CanvasRenderingContext2D,
  color: string,
  opacity: number,
): void {
  context.globalAlpha = Math.max(0, Math.min(1, opacity))
  context.strokeStyle = color
  context.fillStyle = color
}

function drawText(
  context: CanvasRenderingContext2D,
  page: ImagePage,
  settings: ImageSettings,
  seed: string,
): void {
  const random = createRandom(`${seed}:text:${page.index}`)
  const lineHeight = settings.fontSize * settings.lineHeight
  context.globalAlpha = 1
  context.fillStyle = settings.textColor
  context.font = `${settings.fontSize}px ${settings.fontFamily}`
  context.textBaseline = 'middle'

  page.lines.forEach((line, lineIndex) => {
    let x = settings.padding
    const y = settings.padding + lineIndex * lineHeight + lineHeight / 2
    for (const character of Array.from(line)) {
      const metrics = context.measureText(character)
      const offsetX = settings.jitter ? (random.next() - 0.5) * settings.jitter : 0
      const offsetY = settings.jitter ? (random.next() - 0.5) * settings.jitter : 0
      context.fillText(character, x + offsetX, y + offsetY)
      x += metrics.width
    }
  })
}

function drawOverlays(
  context: CanvasRenderingContext2D,
  page: ImagePage,
  settings: ImageSettings,
  seed: string,
): void {
  const lineHeight = settings.fontSize * settings.lineHeight
  if (settings.horizontalLines.enabled) {
    setAlphaColor(
      context,
      settings.horizontalLines.color,
      settings.horizontalLines.opacity,
    )
    context.lineWidth = settings.horizontalLines.thickness
    page.lines.forEach((_, index) => {
      if (index % Math.max(1, Math.round(settings.horizontalLines.spacing)) !== 0) return
      const y = settings.padding + index * lineHeight + lineHeight / 2
      context.beginPath()
      context.moveTo(settings.padding * 0.45, y)
      context.lineTo(page.width - settings.padding * 0.45, y)
      context.stroke()
    })
  }

  if (settings.verticalLines.enabled) {
    setAlphaColor(context, settings.verticalLines.color, settings.verticalLines.opacity)
    context.lineWidth = settings.verticalLines.thickness
    const spacing = Math.max(12, settings.verticalLines.spacing)
    for (let x = settings.padding; x <= page.width - settings.padding; x += spacing) {
      context.beginPath()
      context.moveTo(x, settings.padding * 0.45)
      context.lineTo(x, page.height - settings.padding * 0.45)
      context.stroke()
    }
  }

  if (settings.noise.enabled) {
    const random = createRandom(`${seed}:noise:${page.index}`)
    setAlphaColor(context, settings.noise.color, settings.noise.opacity)
    const count = Math.floor(page.width * page.height * settings.noise.density)
    for (let index = 0; index < count; index += 1) {
      context.beginPath()
      context.arc(
        random.next() * page.width,
        random.next() * page.height,
        settings.noise.radius,
        0,
        Math.PI * 2,
      )
      context.fill()
    }
  }
  context.globalAlpha = 1
}

export function renderPageToCanvas(
  page: ImagePage,
  settings: ImageSettings,
  seed: string,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = page.width
  canvas.height = page.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('当前浏览器无法创建图片画布')

  context.fillStyle = settings.backgroundColor
  context.fillRect(0, 0, page.width, page.height)
  drawText(context, page, settings, seed)
  drawOverlays(context, page, settings, seed)
  return canvas
}
