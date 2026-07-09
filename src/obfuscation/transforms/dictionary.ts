import type { TransformModule } from '../../types/obfuscation'

export interface DictionaryEntry {
  source: string
  replacement: string
}

export interface DictionaryConfig {
  entries: DictionaryEntry[]
}

export const dictionaryTransform: TransformModule<DictionaryConfig> = {
  id: 'dictionary',
  label: '词典替换',
  description: '按自定义词典替换地名、短语或其他文字。',
  transform(text, config, context) {
    const entries = config.entries
      .filter((entry) => entry.source.length > 0)
      .sort((left, right) => right.source.length - left.source.length)

    if (entries.length === 0 || context.intensity === 0) return text

    let output = ''
    let cursor = 0
    while (cursor < text.length) {
      const match = entries.find((entry) => text.startsWith(entry.source, cursor))
      if (!match) {
        const point = text.codePointAt(cursor)!
        const character = String.fromCodePoint(point)
        output += character
        cursor += character.length
        continue
      }

      output += context.random.chance(context.intensity) ? match.replacement : match.source
      cursor += match.source.length
    }
    return output
  },
}
