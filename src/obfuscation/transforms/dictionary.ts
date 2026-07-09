import type { TransformModule } from '../../types/obfuscation'

export interface DictionaryEntry {
  source: string
  replacements: string[]
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

    const selectedReplacements = new Map<string, string>()
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

      const candidates = match.replacements.map((value) => value.trim()).filter(Boolean)
      if (candidates.length > 0 && context.random.chance(context.intensity)) {
        let replacement = selectedReplacements.get(match.source)
        if (replacement === undefined) {
          replacement = context.random.pick(candidates)
          selectedReplacements.set(match.source, replacement)
        }
        output += replacement
      } else {
        output += match.source
      }
      cursor += match.source.length
    }
    return output
  },
}
