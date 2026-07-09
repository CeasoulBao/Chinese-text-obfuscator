import { describe, expect, it } from 'vitest'
import {
  MAX_DICTIONARY_PACK_BYTES,
  mergeDictionaryEntries,
  parseDictionaryPack,
  serializeDictionaryPack,
} from './packs'

describe('dictionary packs', () => {
  it('parses and normalizes a version 1 pack', () => {
    const pack = parseDictionaryPack(
      JSON.stringify({
        schemaVersion: 1,
        name: ' 社区词典 ',
        description: ' 示例 ',
        author: ' 网友 ',
        license: ' CC0-1.0 ',
        entries: [
          { source: ' 中国 ', replacements: ['印度', '东大', '印度', '  '] },
          { source: '', replacements: ['忽略'] },
        ],
      }),
    )

    expect(pack.name).toBe('社区词典')
    expect(pack.entries).toEqual([
      { source: '中国', replacements: ['印度', '东大'] },
    ])
  })

  it('rejects malformed JSON and unsupported versions atomically', () => {
    expect(() => parseDictionaryPack('{')).toThrow('JSON')
    expect(() =>
      parseDictionaryPack(JSON.stringify({ schemaVersion: 9, name: '错误', entries: [] })),
    ).toThrow('版本')
  })

  it('rejects oversized input', () => {
    expect(() => parseDictionaryPack('x'.repeat(MAX_DICTIONARY_PACK_BYTES + 1))).toThrow(
      '过大',
    )
  })

  it('merges source entries and deduplicates candidates', () => {
    const result = mergeDictionaryEntries(
      [{ source: '中国', replacements: ['印度'] }],
      [
        { source: '中国', replacements: ['印度', '东大', '老钟'] },
        { source: '黑龙江', replacements: ['HLJ'] },
      ],
    )

    expect(result.entries).toEqual([
      { source: '中国', replacements: ['印度', '东大', '老钟'] },
      { source: '黑龙江', replacements: ['HLJ'] },
    ])
    expect(result).toMatchObject({
      addedSources: 1,
      mergedSources: 1,
      addedCandidates: 3,
    })
  })

  it('serializes only normalized non-empty entries', () => {
    const json = serializeDictionaryPack(
      {
        name: '我的词典',
        description: '',
        author: '',
        license: 'CC0-1.0',
      },
      [
        { source: '中国', replacements: ['印度', '', '印度'] },
        { source: '', replacements: ['忽略'] },
      ],
    )
    const parsed = JSON.parse(json)

    expect(parsed.schemaVersion).toBe(1)
    expect(parsed.entries).toEqual([{ source: '中国', replacements: ['印度'] }])
  })
})
