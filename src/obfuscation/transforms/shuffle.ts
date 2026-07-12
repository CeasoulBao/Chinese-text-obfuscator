import type { TransformModule } from '../../types/obfuscation'

export interface ShuffleConfig {
  minGroupSize: number
  maxGroupSize: number
}

type ShuffleContext = Parameters<TransformModule<ShuffleConfig>['transform']>[2]

interface TextToken {
  value: string
  isWordLike: boolean
}

interface WordSegment {
  segment: string
  isWordLike?: boolean
}

interface WordSegmenter {
  segment(input: string): Iterable<WordSegment>
}

type WordSegmenterConstructor = new (
  locale?: string,
  options?: { granularity: 'word' },
) => WordSegmenter

const cjkPattern = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u
const wordPattern = /^[\p{L}\p{N}]+$/u

function isCjkLike(value: string): boolean {
  return cjkPattern.test(value)
}

function splitFallbackWordRun(run: string): TextToken[] {
  if (!isCjkLike(run)) {
    return [{ value: run, isWordLike: true }]
  }

  const characters = Array.from(run)
  const tokens: TextToken[] = []
  for (let index = 0; index < characters.length; index += 2) {
    tokens.push({ value: characters.slice(index, index + 2).join(''), isWordLike: true })
  }
  return tokens
}

function fallbackSegment(text: string): TextToken[] {
  const tokens: TextToken[] = []
  const runs = text.match(/[\p{L}\p{N}]+|[^\p{L}\p{N}]+/gu) ?? []

  for (const run of runs) {
    if (wordPattern.test(run)) {
      tokens.push(...splitFallbackWordRun(run))
    } else {
      tokens.push({ value: run, isWordLike: false })
    }
  }

  return tokens
}

function segmentText(text: string): TextToken[] {
  const Segmenter = (Intl as typeof Intl & { Segmenter?: WordSegmenterConstructor }).Segmenter
  if (!Segmenter) {
    return fallbackSegment(text)
  }

  const segmenter = new Segmenter('zh-Hans', { granularity: 'word' })
  const tokens: TextToken[] = []

  for (const item of segmenter.segment(text)) {
    if (item.segment.length === 0) continue

    if (item.isWordLike) {
      tokens.push({ value: item.segment, isWordLike: true })
    } else {
      tokens.push({ value: item.segment, isWordLike: false })
    }
  }

  return tokens
}

function swapInsideWord(word: string, context: ShuffleContext): string {
  const characters = Array.from(word)
  if (characters.length < 2) return word
  if (characters.length === 2) return `${characters[1]}${characters[0]}`

  const swapIndex = context.random.integer(0, characters.length - 2)
  ;[characters[swapIndex], characters[swapIndex + 1]] = [
    characters[swapIndex + 1]!,
    characters[swapIndex]!,
  ]
  return characters.join('')
}

function interleaveAdjacentWords(first: string, second: string): string {
  const firstCharacters = Array.from(first)
  const secondCharacters = Array.from(second)
  const output: string[] = []
  const sharedLength = Math.min(firstCharacters.length, secondCharacters.length)

  for (let index = 0; index < sharedLength; index += 1) {
    output.push(firstCharacters[index]!, secondCharacters[index]!)
  }

  output.push(...firstCharacters.slice(sharedLength), ...secondCharacters.slice(sharedLength))
  return output.join('')
}

function characterLength(value: string): number {
  return Array.from(value).length
}

function readAdjacentPartner(
  tokens: TextToken[],
  startIndex: number,
  config: ShuffleConfig,
): { value: string; consumed: number } | null {
  const firstToken = tokens[startIndex]
  if (!firstToken?.isWordLike || characterLength(firstToken.value) < 2) return null

  const maxPartnerLength = Math.max(2, Math.floor(config.maxGroupSize))
  const partnerParts: string[] = []
  let partnerLength = 0

  for (let index = startIndex; index < tokens.length; index += 1) {
    const token = tokens[index]!
    const tokenLength = characterLength(token.value)
    if (!token.isWordLike || tokenLength < 2) break
    if (partnerLength + tokenLength > maxPartnerLength) break
    partnerParts.push(token.value)
    partnerLength += tokenLength
  }

  if (partnerParts.length === 0) return null
  return { value: partnerParts.join(''), consumed: partnerParts.length }
}

function shuffleTokens(
  tokens: TextToken[],
  config: ShuffleConfig,
  context: ShuffleContext,
): string {
  const output: string[] = []

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]!
    const adjacentPartner = token.isWordLike
      ? readAdjacentPartner(tokens, index + 1, config)
      : null

    if (
      token.isWordLike &&
      characterLength(token.value) > 1 &&
      adjacentPartner &&
      context.random.chance(context.intensity)
    ) {
      output.push(interleaveAdjacentWords(token.value, adjacentPartner.value))
      index += adjacentPartner.consumed
      continue
    }

    if (
      token.isWordLike &&
      characterLength(token.value) > 1 &&
      context.random.chance(context.intensity)
    ) {
      output.push(swapInsideWord(token.value, context))
    } else {
      output.push(token.value)
    }
  }

  return output.join('')
}

function shuffleText(
  text: string,
  config: ShuffleConfig,
  context: ShuffleContext,
): string {
  return shuffleTokens(segmentText(text), config, context)
}

function normalizeConfig(config: ShuffleConfig): ShuffleConfig {
  return {
    minGroupSize: Math.max(2, Math.floor(config.minGroupSize)),
    maxGroupSize: Math.max(2, Math.floor(config.maxGroupSize)),
  }
}

function constrainIntensityByConfig(config: ShuffleConfig, intensity: number): number {
  const normalized = normalizeConfig(config)
  const rangeSize = Math.max(normalized.minGroupSize, normalized.maxGroupSize)
  const readabilityFactor = rangeSize <= 2 ? 0.85 : rangeSize <= 4 ? 1 : 0.92
  return Math.max(0, Math.min(1, intensity * readabilityFactor))
}

export const shuffleTransform: TransformModule<ShuffleConfig> = {
  id: 'shuffle',
  label: '分组乱序',
  description: '限制在词语内部或相邻两个词之间轻量调整顺序，保留标点和换行位置。',
  transform(text, config, context) {
    const normalizedConfig = normalizeConfig(config)
    const scopedContext = {
      ...context,
      intensity: constrainIntensityByConfig(normalizedConfig, context.intensity),
    }
    return shuffleText(text, normalizedConfig, scopedContext)
  },
}
