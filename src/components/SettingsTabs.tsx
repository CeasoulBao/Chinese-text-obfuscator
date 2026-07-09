import type { KeyboardEvent } from 'react'

export type SettingsTab = 'text' | 'image'

interface SettingsTabsProps {
  value: SettingsTab
  onChange(value: SettingsTab): void
}

const tabs: Array<{ id: SettingsTab; label: string; detail: string }> = [
  { id: 'text', label: '文本混淆', detail: '规则与共享词典' },
  { id: 'image', label: '图片导出', detail: '排版与视觉干扰' },
]

export function SettingsTabs({ value, onChange }: SettingsTabsProps) {
  const activateByKeyboard = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex = currentIndex
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length
    else if (event.key === 'ArrowLeft')
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = tabs.length - 1
    else return

    event.preventDefault()
    const next = tabs[nextIndex]!
    onChange(next.id)
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]',
    )
    buttons?.[nextIndex]?.focus()
  }

  return (
    <div className="settings-tabs" role="tablist" aria-label="参数设置类型">
      {tabs.map((tab, index) => (
        <button
          id={`settings-tab-${tab.id}`}
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={value === tab.id}
          aria-controls={`settings-panel-${tab.id}`}
          tabIndex={value === tab.id ? 0 : -1}
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => activateByKeyboard(event, index)}
        >
          <strong>{tab.label}</strong>
          <span>{tab.detail}</span>
        </button>
      ))}
    </div>
  )
}
