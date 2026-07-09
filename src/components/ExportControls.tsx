import type { ExportMode } from '../image/compose'

interface ExportControlsProps {
  disabled: boolean
  busy: boolean
  status: string
  onExport(mode: ExportMode): void
}

export function ExportControls({
  disabled,
  busy,
  status,
  onExport,
}: ExportControlsProps) {
  return (
    <div className="export-controls">
      <div>
        <button
          className="primary-button"
          type="button"
          disabled={disabled || busy}
          onClick={() => onExport('split')}
        >
          {busy ? '正在生成…' : '自动切图导出'}
        </button>
        <button
          className="secondary-button"
          type="button"
          disabled={disabled || busy}
          onClick={() => onExport('long')}
        >
          导出一张长图
        </button>
      </div>
      <p aria-live="polite">{status}</p>
    </div>
  )
}
