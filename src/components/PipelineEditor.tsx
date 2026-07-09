import { transformRegistry } from '../obfuscation/registry'
import type { PipelineStateItem } from '../state/appState'
import { DictionaryEditor } from './DictionaryEditor'

interface PipelineEditorProps {
  items: PipelineStateItem[]
  onToggle(id: string): void
  onIntensity(id: string, value: number): void
  onMove(id: string, direction: -1 | 1): void
  onConfig(id: string, config: any): void
}

export function PipelineEditor({
  items,
  onToggle,
  onIntensity,
  onMove,
  onConfig,
}: PipelineEditorProps) {
  return (
    <div className="pipeline-list">
      {items.map((item, index) => {
        const registration = transformRegistry.find((entry) => entry.module.id === item.id)
        if (!registration) return null
        return (
          <article className={item.enabled ? 'module-card' : 'module-card is-disabled'} key={item.id}>
            <div className="module-card__top">
              <span className="module-index">{String(index + 1).padStart(2, '0')}</span>
              <div className="module-copy">
                <h3>{registration.module.label}</h3>
                <p>{registration.module.description}</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => onToggle(item.id)}
                  aria-label={`启用${registration.module.label}`}
                />
                <span aria-hidden="true" />
              </label>
            </div>
            <div className="module-controls">
              <label>
                强度 <output>{Math.round(item.intensity * 100)}%</output>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={item.intensity}
                  disabled={!item.enabled}
                  aria-label={`${registration.module.label}强度`}
                  onChange={(event) => onIntensity(item.id, Number(event.target.value))}
                />
              </label>
              <div className="move-controls" aria-label={`${registration.module.label}处理顺序`}>
                <button
                  type="button"
                  aria-label={`${registration.module.label}上移`}
                  disabled={index === 0}
                  onClick={() => onMove(item.id, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={`${registration.module.label}下移`}
                  disabled={index === items.length - 1}
                  onClick={() => onMove(item.id, 1)}
                >
                  ↓
                </button>
              </div>
            </div>
            {item.id === 'dictionary' && (
              <DictionaryEditor
                entries={item.config.entries}
                onChange={(entries) => onConfig(item.id, { ...item.config, entries })}
              />
            )}
            {item.id === 'symbols' && (
              <div className="inline-options">
                <label>
                  符号集合
                  <input
                    value={item.config.symbols}
                    onChange={(event) =>
                      onConfig(item.id, { ...item.config, symbols: event.target.value })
                    }
                  />
                </label>
                <label>
                  插入密度
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={item.config.density}
                    onChange={(event) =>
                      onConfig(item.id, {
                        ...item.config,
                        density: Math.max(0, Math.min(1, Number(event.target.value))),
                      })
                    }
                  />
                </label>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}
