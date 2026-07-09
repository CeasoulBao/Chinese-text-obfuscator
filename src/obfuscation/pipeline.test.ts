import { describe, expect, it } from 'vitest'
import type { TransformModule } from '../types/obfuscation'
import { clampIntensity, runPipeline } from './pipeline'

const suffixModule: TransformModule<{ suffix: string }> = {
  id: 'suffix',
  label: '追加',
  description: '测试模块',
  transform: (text, config, context) =>
    context.random.chance(context.intensity) ? `${text}${config.suffix}` : text,
}

describe('runPipeline', () => {
  it('skips disabled modules and applies enabled modules in order', () => {
    const result = runPipeline(
      '原文',
      [
        { module: suffixModule, enabled: true, intensity: 1, config: { suffix: '甲' } },
        { module: suffixModule, enabled: false, intensity: 1, config: { suffix: '乙' } },
        { module: suffixModule, enabled: true, intensity: 1, config: { suffix: '丙' } },
      ],
      'order',
    )

    expect(result.text).toBe('原文甲丙')
    expect(result.steps.map((step) => step.output)).toEqual(['原文甲', '原文甲丙'])
  })

  it('clamps intensity into the supported range', () => {
    expect(clampIntensity(-2)).toBe(0)
    expect(clampIntensity(0.35)).toBe(0.35)
    expect(clampIntensity(9)).toBe(1)
  })

  it('reproduces output when the seed is the same', () => {
    const items = [
      { module: suffixModule, enabled: true, intensity: 0.5, config: { suffix: '甲' } },
    ]

    expect(runPipeline('原文', items, 'fixed')).toEqual(runPipeline('原文', items, 'fixed'))
  })
})
