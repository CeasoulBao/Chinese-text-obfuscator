import type { ImagePage } from '../types/image'

export const MAX_CANVAS_DIMENSION = 16384
export const MAX_CANVAS_AREA = 120_000_000

export type MeasureText = (text: string) => number

export function wrapText(text: string, maxWidth: number, measure: MeasureText): string[] {
  if (!text) return []
  const lines: string[] = []

  for (const paragraph of text.split('\n')) {
    if (paragraph === '') {
      lines.push('')
      continue
    }

    let current = ''
    for (const character of Array.from(paragraph)) {
      const candidate = current + character
      if (current && measure(candidate) > maxWidth) {
        lines.push(current)
        current = character
      } else {
        current = candidate
      }
    }
    lines.push(current)
  }

  return lines
}

export function calculateLongImageHeight(
  lineCount: number,
  lineHeightPixels: number,
  padding: number,
): number {
  return Math.max(padding * 2 + lineHeightPixels, padding * 2 + lineCount * lineHeightPixels)
}

export function isSafeCanvasSize(width: number, height: number): boolean {
  return (
    width > 0 &&
    height > 0 &&
    width <= MAX_CANVAS_DIMENSION &&
    height <= MAX_CANVAS_DIMENSION &&
    width * height <= MAX_CANVAS_AREA
  )
}

export function paginateLines(
  lines: readonly string[],
  width: number,
  targetHeight: number,
  padding: number,
  lineHeightPixels: number,
): ImagePage[] {
  const availableHeight = Math.max(lineHeightPixels, targetHeight - padding * 2)
  const linesPerPage = Math.max(1, Math.floor(availableHeight / lineHeightPixels))
  const chunks: string[][] = []
  for (let index = 0; index < lines.length; index += linesPerPage) {
    chunks.push(lines.slice(index, index + linesPerPage))
  }
  if (chunks.length === 0) chunks.push([])

  return chunks.map((pageLines, index) => ({
    lines: pageLines,
    width,
    height: Math.max(
      padding * 2 + lineHeightPixels,
      Math.min(targetHeight, padding * 2 + pageLines.length * lineHeightPixels),
    ),
    index: index + 1,
    total: chunks.length,
  }))
}
