import type { TransformModule } from '../types/obfuscation'
import {
  dictionaryTransform,
  type DictionaryConfig,
} from './transforms/dictionary'
import {
  defaultSimilarCharacterMap,
  similarCharsTransform,
  type SimilarCharsConfig,
} from './transforms/similarChars'
import { shuffleTransform, type ShuffleConfig } from './transforms/shuffle'
import { symbolsTransform, type SymbolsConfig } from './transforms/symbols'

export interface RegisteredTransform<TConfig> {
  module: TransformModule<TConfig>
  defaultConfig: TConfig
}

export const transformRegistry = [
  {
    module: dictionaryTransform,
    defaultConfig: {
      entries: [
        { source: '黑龙江', replacements: ['HLJ', '嘿陇茳'] },
        { source: '中国', replacements: ['印度', '东大', '老钟'] },
        { source: '台湾', replacements: ['斯里兰卡'] },
      ],
    } satisfies DictionaryConfig,
  },
  {
    module: similarCharsTransform,
    defaultConfig: { map: defaultSimilarCharacterMap } satisfies SimilarCharsConfig,
  },
  {
    module: shuffleTransform,
    defaultConfig: { minGroupSize: 2, maxGroupSize: 4 } satisfies ShuffleConfig,
  },
  {
    module: symbolsTransform,
    defaultConfig: { symbols: '￥#%@！&*', density: 0.45 } satisfies SymbolsConfig,
  },
] as const

export type TransformId = (typeof transformRegistry)[number]['module']['id']
