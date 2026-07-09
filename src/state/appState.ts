import type { PresetName } from '../obfuscation/presets'
import { presetDefinitions } from '../obfuscation/presets'
import { transformRegistry } from '../obfuscation/registry'

export interface PipelineStateItem {
  id: string
  enabled: boolean
  intensity: number
  config: any
}

export interface AppState {
  sourceText: string
  seed: string
  preset: PresetName
  pipeline: PipelineStateItem[]
}

export type AppAction =
  | { type: 'set-source'; value: string }
  | { type: 'set-seed'; value: string }
  | { type: 'apply-preset'; preset: Exclude<PresetName, 'custom'> }
  | { type: 'toggle-module'; id: string }
  | { type: 'set-intensity'; id: string; intensity: number }
  | { type: 'set-config'; id: string; config: any }
  | { type: 'move-module'; id: string; direction: -1 | 1 }
  | { type: 'clear-content' }
  | { type: 'reset-all' }

function cloneConfig<T>(config: T): T {
  return structuredClone(config)
}

export function createInitialState(): AppState {
  return {
    sourceText: '',
    seed: '',
    preset: 'medium',
    pipeline: transformRegistry.map((entry, index) => ({
      id: entry.module.id,
      enabled: true,
      intensity: presetDefinitions.medium.intensities[index] ?? 0.3,
      config: cloneConfig(entry.defaultConfig),
    })),
  }
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'set-source':
      return { ...state, sourceText: action.value }
    case 'set-seed':
      return { ...state, seed: action.value }
    case 'apply-preset':
      return {
        ...state,
        preset: action.preset,
        pipeline: state.pipeline.map((item, index) => ({
          ...item,
          intensity: presetDefinitions[action.preset].intensities[index] ?? item.intensity,
        })),
      }
    case 'toggle-module':
      return {
        ...state,
        preset: 'custom',
        pipeline: state.pipeline.map((item) =>
          item.id === action.id ? { ...item, enabled: !item.enabled } : item,
        ),
      }
    case 'set-intensity':
      return {
        ...state,
        preset: 'custom',
        pipeline: state.pipeline.map((item) =>
          item.id === action.id
            ? { ...item, intensity: Math.max(0, Math.min(1, action.intensity)) }
            : item,
        ),
      }
    case 'set-config':
      return {
        ...state,
        preset: 'custom',
        pipeline: state.pipeline.map((item) =>
          item.id === action.id ? { ...item, config: cloneConfig(action.config) } : item,
        ),
      }
    case 'move-module': {
      const currentIndex = state.pipeline.findIndex((item) => item.id === action.id)
      const targetIndex = currentIndex + action.direction
      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= state.pipeline.length) return state
      const pipeline = [...state.pipeline]
      ;[pipeline[currentIndex], pipeline[targetIndex]] = [
        pipeline[targetIndex]!,
        pipeline[currentIndex]!,
      ]
      return { ...state, preset: 'custom', pipeline }
    }
    case 'clear-content':
      return { ...state, sourceText: '', seed: '' }
    case 'reset-all':
      return createInitialState()
  }
}
