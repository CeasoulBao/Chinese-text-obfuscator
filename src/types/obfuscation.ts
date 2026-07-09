export interface RandomSource {
  next(): number
  chance(probability: number): boolean
  integer(min: number, max: number): number
  pick<T>(values: readonly T[]): T
  shuffle<T>(values: readonly T[]): T[]
}

export interface TransformContext {
  intensity: number
  random: RandomSource
}

export interface TransformModule<TConfig = Record<string, unknown>> {
  id: string
  label: string
  description: string
  transform(text: string, config: TConfig, context: TransformContext): string
}

export interface PipelineItem<TConfig = Record<string, unknown>> {
  module: TransformModule<TConfig>
  enabled: boolean
  intensity: number
  config: TConfig
}

export interface PipelineStep {
  moduleId: string
  input: string
  output: string
}

export interface PipelineResult {
  text: string
  steps: PipelineStep[]
}
