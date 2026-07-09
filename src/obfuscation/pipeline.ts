import type { PipelineItem, PipelineResult } from '../types/obfuscation'
import { createRandom } from './random'

export function clampIntensity(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(1, value))
}

export function runPipeline(
  text: string,
  items: readonly PipelineItem<any>[],
  seed: string,
): PipelineResult {
  const random = createRandom(seed)
  const steps: PipelineResult['steps'] = []
  let current = text

  for (const item of items) {
    if (!item.enabled) continue
    const input = current
    current = item.module.transform(current, item.config, {
      intensity: clampIntensity(item.intensity),
      random,
    })
    steps.push({ moduleId: item.module.id, input, output: current })
  }

  return { text: current, steps }
}
