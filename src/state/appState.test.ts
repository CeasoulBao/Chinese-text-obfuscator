import { describe, expect, it } from 'vitest'
import { appReducer, createInitialState } from './appState'
import { presetDefinitions } from '../obfuscation/presets'

describe('application state', () => {
  it('applies light, medium, and heavy presets', () => {
    for (const preset of ['light', 'medium', 'heavy'] as const) {
      const state = appReducer(createInitialState(), { type: 'apply-preset', preset })
      expect(state.preset).toBe(preset)
      expect(state.pipeline.map((item) => item.intensity)).toEqual(
        presetDefinitions[preset].intensities,
      )
    }
  })

  it('switches to custom after editing module intensity', () => {
    const state = appReducer(createInitialState(), {
      type: 'set-intensity',
      id: 'symbols',
      intensity: 0.77,
    })
    expect(state.preset).toBe('custom')
    expect(state.pipeline.find((item) => item.id === 'symbols')?.intensity).toBe(0.77)
  })

  it('reorders modules without losing configuration', () => {
    const initial = createInitialState()
    const moved = appReducer(initial, { type: 'move-module', id: 'dictionary', direction: 1 })
    expect(moved.pipeline.map((item) => item.id).slice(0, 2)).toEqual([
      'similar-chars',
      'dictionary',
    ])
  })

  it('clears source and seed without resetting module choices', () => {
    const configured = appReducer(
      { ...createInitialState(), sourceText: '敏感文字', seed: 'secret' },
      { type: 'toggle-module', id: 'shuffle' },
    )
    const cleared = appReducer(configured, { type: 'clear-content' })
    expect(cleared.sourceText).toBe('')
    expect(cleared.seed).toBe('')
    expect(cleared.pipeline).toEqual(configured.pipeline)
  })
})
