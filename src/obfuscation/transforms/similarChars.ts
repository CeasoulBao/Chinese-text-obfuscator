import type { TransformModule } from '../../types/obfuscation'

export interface SimilarCharsConfig {
  map: Record<string, string[]>
}

export const defaultSimilarCharacterMap: Record<string, string[]> = {
  黑: ['嘿'],
  龙: ['陇'],
  江: ['茳'],
  国: ['囯'],
  政: ['证'],
  府: ['俯'],
  检: ['捡'],
  查: ['察'],
  商: ['傷'],
  户: ['戸'],
  关: ['闗'],
  门: ['們'],
  运: ['運'],
  动: ['働'],
}

export const similarCharsTransform: TransformModule<SimilarCharsConfig> = {
  id: 'similar-chars',
  label: '同音形近',
  description: '按概率将部分汉字替换为同音字或形近字。',
  transform(text, config, context) {
    return Array.from(text, (character) => {
      const choices = config.map[character]
      if (!choices?.length || !context.random.chance(context.intensity)) return character
      return context.random.pick(choices)
    }).join('')
  },
}
