import { describe, expect, it } from 'vitest'
import { createRandom } from '../random'
import { dictionaryTransform } from './dictionary'
import { shuffleTransform } from './shuffle'
import { similarCharsTransform } from './similarChars'
import { symbolsTransform } from './symbols'

const context = (intensity = 1, seed = 'test') => ({
  intensity,
  random: createRandom(seed),
})

describe('dictionaryTransform', () => {
  it('matches longer phrases before shorter phrases', () => {
    const output = dictionaryTransform.transform(
      '黑龙江与黑龙',
      {
        entries: [
          { source: '黑龙', replacements: ['短'] },
          { source: '黑龙江', replacements: ['HLJ'] },
        ],
      },
      context(),
    )

    expect(output).toBe('HLJ与短')
  })

  it('selects from multiple replacements reproducibly', () => {
    const config = {
      entries: [{ source: '中国', replacements: ['印度', '东大', '老钟'] }],
    }
    const first = dictionaryTransform.transform('中国中国', config, context(1, 'fixed'))
    const second = dictionaryTransform.transform('中国中国', config, context(1, 'fixed'))

    expect(first).toBe(second)
    expect(first.match(/印度|东大|老钟/g)).toHaveLength(2)
  })

  it('uses one replacement candidate for every replaced occurrence in one input', () => {
    let pickIndex = 0
    const cyclingContext = {
      intensity: 1,
      random: {
        next: () => 0,
        chance: () => true,
        integer: (min: number) => min,
        pick: <T,>(values: readonly T[]) => values[pickIndex++ % values.length]!,
        shuffle: <T,>(values: readonly T[]) => [...values],
      },
    }
    const output = dictionaryTransform.transform(
      '中国、中国、中国',
      { entries: [{ source: '中国', replacements: ['印度', '东大', '老钟'] }] },
      cyclingContext,
    )

    expect(new Set(output.split('、'))).toEqual(new Set(['印度']))
  })

  it('keeps the source when all replacement candidates are empty', () => {
    expect(
      dictionaryTransform.transform(
        '中国',
        { entries: [{ source: '中国', replacements: ['', '  '] }] },
        context(),
      ),
    ).toBe('中国')
  })
})

describe('similarCharsTransform', () => {
  it('uses configured conservative substitutions', () => {
    expect(
      similarCharsTransform.transform(
        '黑龙江',
        { map: { 黑: ['嘿'], 龙: ['陇'], 江: ['茳'] } },
        context(),
      ),
    ).toBe('嘿陇茳')
  })

  it('does nothing at zero intensity', () => {
    expect(
      similarCharsTransform.transform('黑龙江', { map: { 黑: ['嘿'] } }, context(0)),
    ).toBe('黑龙江')
  })
})

describe('shuffleTransform', () => {
  it('preserves punctuation and paragraph boundaries', () => {
    const output = shuffleTransform.transform(
      '瘟神来了：黑龙江。\n第二段！',
      { minGroupSize: 2, maxGroupSize: 3 },
      context(1, 'shuffle'),
    )

    expect(output).toContain('：')
    expect(output).toContain('。')
    expect(output).toContain('\n')
    expect(output).toContain('！')
    expect([...output].sort()).toEqual([...'瘟神来了：黑龙江。\n第二段！'].sort())
  })
})

describe('symbolsTransform', () => {
  it('inserts symbols only between readable characters', () => {
    const output = symbolsTransform.transform(
      '黑龙江',
      { symbols: '￥#', density: 1 },
      context(1, 'symbols'),
    )

    expect(output).toMatch(/^黑[￥#]龙[￥#]江$/)
    expect(output).not.toMatch(/^[￥#]|[￥#]$/)
  })
})
