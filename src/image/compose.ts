import type { ImagePage, ImageSettings } from '../types/image'
import {
  calculateLongImageHeight,
  isSafeCanvasSize,
  paginateLines,
  wrapText,
} from './layout'

export type ExportMode = 'long' | 'split'

export function createImagePages(
  text: string,
  settings: ImageSettings,
  mode: ExportMode,
): ImagePage[] {
  const measurementCanvas = document.createElement('canvas')
  const context = measurementCanvas.getContext('2d')
  if (!context) throw new Error('当前浏览器无法测量文字')

  context.font = `${settings.fontSize}px ${settings.fontFamily}`
  const lines = wrapText(
    text,
    settings.width - settings.padding * 2,
    (value) => context.measureText(value).width,
  )
  const lineHeight = settings.fontSize * settings.lineHeight

  if (mode === 'long') {
    const height = calculateLongImageHeight(lines.length, lineHeight, settings.padding)
    if (!isSafeCanvasSize(settings.width, height)) {
      throw new Error('长图尺寸超过浏览器安全限制，请改用自动切图')
    }
    return [{ lines, width: settings.width, height, index: 1, total: 1 }]
  }

  if (!isSafeCanvasSize(settings.width, settings.targetPageHeight)) {
    throw new Error('切图尺寸超过浏览器安全限制，请减小宽度或单图高度')
  }
  return paginateLines(
    lines,
    settings.width,
    settings.targetPageHeight,
    settings.padding,
    lineHeight,
  )
}
