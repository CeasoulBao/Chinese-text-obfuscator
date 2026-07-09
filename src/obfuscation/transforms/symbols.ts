import type { TransformModule } from '../../types/obfuscation'

export interface SymbolsConfig {
  symbols: string
  density: number
}

const readableCharacter = /[\p{L}\p{N}]/u

export const symbolsTransform: TransformModule<SymbolsConfig> = {
  id: 'symbols',
  label: '符号穿插',
  description: '在相邻文字之间随机插入符号。',
  transform(text, config, context) {
    const characters = Array.from(text)
    const symbols = Array.from(config.symbols)
    if (characters.length < 2 || symbols.length === 0) return text

    const probability = Math.max(0, Math.min(1, context.intensity * config.density))
    const output: string[] = []
    characters.forEach((character, index) => {
      output.push(character)
      const next = characters[index + 1]
      if (
        next &&
        readableCharacter.test(character) &&
        readableCharacter.test(next) &&
        context.random.chance(probability)
      ) {
        output.push(context.random.pick(symbols))
      }
    })
    return output.join('')
  },
}
