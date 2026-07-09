import type { RandomSource } from '../types/obfuscation'

function hashSeed(seed: string): number {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function createRandom(seed: string): RandomSource {
  let state = hashSeed(seed || '字隙')

  const next = () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }

  return {
    next,
    chance(probability) {
      return next() < Math.max(0, Math.min(1, probability))
    },
    integer(min, max) {
      const lower = Math.ceil(Math.min(min, max))
      const upper = Math.floor(Math.max(min, max))
      return Math.floor(next() * (upper - lower + 1)) + lower
    },
    pick<T>(values: readonly T[]) {
      if (values.length === 0) {
        throw new Error('不能从空集合中随机选择')
      }
      return values[Math.floor(next() * values.length)]!
    },
    shuffle<T>(values: readonly T[]) {
      const result = [...values]
      for (let index = result.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(next() * (index + 1))
        ;[result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!]
      }
      return result
    },
  }
}
