import type { TransformModule } from '../../types/obfuscation'

export interface ShuffleConfig {
  minGroupSize: number
  maxGroupSize: number
}

function shuffleRun(
  run: string,
  config: ShuffleConfig,
  context: Parameters<TransformModule<ShuffleConfig>['transform']>[2],
): string {
  const characters = Array.from(run)
  const output: string[] = []
  const minimum = Math.max(2, Math.floor(config.minGroupSize))
  const maximum = Math.max(minimum, Math.floor(config.maxGroupSize))

  for (let cursor = 0; cursor < characters.length; ) {
    const size = Math.min(context.random.integer(minimum, maximum), characters.length - cursor)
    const group = characters.slice(cursor, cursor + size)
    if (group.length > 1 && context.random.chance(context.intensity)) {
      let shuffled = context.random.shuffle(group)
      if (shuffled.join('') === group.join('')) {
        shuffled = [...group.slice(1), group[0]!]
      }
      output.push(...shuffled)
    } else {
      output.push(...group)
    }
    cursor += size
  }

  return output.join('')
}

export const shuffleTransform: TransformModule<ShuffleConfig> = {
  id: 'shuffle',
  label: '分组乱序',
  description: '在连续文字内部按小组调整字符顺序，保留标点和换行位置。',
  transform(text, config, context) {
    return text.replace(/[\p{L}\p{N}]+/gu, (run) => shuffleRun(run, config, context))
  },
}
