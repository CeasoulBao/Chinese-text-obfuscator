import { presetDefinitions, type PresetName } from '../obfuscation/presets'

interface PresetSelectorProps {
  value: PresetName
  onChange(value: Exclude<PresetName, 'custom'>): void
}

export function PresetSelector({ value, onChange }: PresetSelectorProps) {
  return (
    <fieldset className="preset-selector">
      <legend>混淆程度</legend>
      <div className="preset-options">
        {Object.entries(presetDefinitions).map(([key, preset]) => (
          <button
            key={key}
            className={value === key ? 'preset-card is-active' : 'preset-card'}
            type="button"
            aria-pressed={value === key}
            onClick={() => onChange(key as Exclude<PresetName, 'custom'>)}
          >
            <strong>{preset.label}</strong>
            <span>{preset.description}</span>
          </button>
        ))}
      </div>
      {value === 'custom' && <p className="custom-indicator">当前为自定义组合</p>}
    </fieldset>
  )
}
