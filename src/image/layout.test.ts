import { describe, expect, it } from 'vitest'
import { exportFilename } from './export'
import {
  calculateLongImageHeight,
  isSafeCanvasSize,
  paginateLines,
  wrapText,
} from './layout'

const measure = (text: string) => Array.from(text).length * 10

describe('image text layout', () => {
  it('wraps Chinese characters to the measured width', () => {
    expect(wrapText('黑龙江商户集体停业', 40, measure)).toEqual(['黑龙江商', '户集体停', '业'])
  })

  it('preserves explicit newlines, including empty paragraphs', () => {
    expect(wrapText('第一行\n\n第二行', 100, measure)).toEqual(['第一行', '', '第二行'])
  })

  it('calculates long image height from line count', () => {
    expect(calculateLongImageHeight(10, 50, 40)).toBe(580)
  })

  it('splits lines without dropping content', () => {
    const lines = Array.from({ length: 11 }, (_, index) => `第${index + 1}行`)
    const pages = paginateLines(lines, 1080, 300, 40, 50)
    expect(pages).toHaveLength(3)
    expect(pages.flatMap((page) => page.lines)).toEqual(lines)
    expect(pages.map((page) => page.index)).toEqual([1, 2, 3])
  })

  it('rejects unsafe canvas dimensions or area', () => {
    expect(isSafeCanvasSize(1080, 5000)).toBe(true)
    expect(isSafeCanvasSize(20000, 5000)).toBe(false)
    expect(isSafeCanvasSize(16000, 16000)).toBe(false)
  })

  it('numbers split exports predictably', () => {
    expect(exportFilename('字隙', 2, 12)).toBe('字隙-02-of-12.png')
    expect(exportFilename('字隙', 1, 1)).toBe('字隙.png')
  })
})
