import type { ImageSettings as ImageSettingsType } from '../types/image'

interface ImageSettingsProps {
  value: ImageSettingsType
  onChange(value: ImageSettingsType): void
}

export function ImageSettings({ value, onChange }: ImageSettingsProps) {
  const patch = (changes: Partial<ImageSettingsType>) => onChange({ ...value, ...changes })

  return (
    <div className="image-settings">
      <div className="settings-grid settings-grid--base">
        <label>
          图片宽度
          <input
            aria-label="图片宽度"
            type="number"
            min="480"
            max="2160"
            step="20"
            value={value.width}
            onChange={(event) => patch({ width: Number(event.target.value) })}
          />
        </label>
        <label>
          字号
          <input
            aria-label="图片字号"
            type="number"
            min="20"
            max="80"
            value={value.fontSize}
            onChange={(event) => patch({ fontSize: Number(event.target.value) })}
          />
        </label>
        <label>
          行距
          <input
            aria-label="图片行距"
            type="number"
            min="1.1"
            max="2.5"
            step="0.05"
            value={value.lineHeight}
            onChange={(event) => patch({ lineHeight: Number(event.target.value) })}
          />
        </label>
        <label>
          单图高度
          <input
            aria-label="自动切图高度"
            type="number"
            min="720"
            max="4000"
            step="40"
            value={value.targetPageHeight}
            onChange={(event) => patch({ targetPageHeight: Number(event.target.value) })}
          />
        </label>
        <label className="color-control">
          文字
          <input
            aria-label="图片文字颜色"
            type="color"
            value={value.textColor}
            onChange={(event) => patch({ textColor: event.target.value })}
          />
        </label>
        <label className="color-control">
          背景
          <input
            aria-label="图片背景颜色"
            type="color"
            value={value.backgroundColor}
            onChange={(event) => patch({ backgroundColor: event.target.value })}
          />
        </label>
      </div>

      <div className="overlay-grid">
        <fieldset className="overlay-card">
          <legend>
            <input
              aria-label="横向穿行线"
              type="checkbox"
              checked={value.horizontalLines.enabled}
              onChange={(event) =>
                patch({
                  horizontalLines: {
                    ...value.horizontalLines,
                    enabled: event.target.checked,
                  },
                })
              }
            />
            横向穿行线
          </legend>
          <label>
            线宽
            <input
              aria-label="横线宽度"
              type="range"
              min="1"
              max="10"
              value={value.horizontalLines.thickness}
              onChange={(event) =>
                patch({
                  horizontalLines: {
                    ...value.horizontalLines,
                    thickness: Number(event.target.value),
                  },
                })
              }
            />
          </label>
          <label>
            透明度
            <input
              aria-label="横线透明度"
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={value.horizontalLines.opacity}
              onChange={(event) =>
                patch({
                  horizontalLines: {
                    ...value.horizontalLines,
                    opacity: Number(event.target.value),
                  },
                })
              }
            />
          </label>
          <label className="color-control">
            颜色
            <input
              aria-label="横线颜色"
              type="color"
              value={value.horizontalLines.color}
              onChange={(event) =>
                patch({
                  horizontalLines: { ...value.horizontalLines, color: event.target.value },
                })
              }
            />
          </label>
        </fieldset>

        <fieldset className="overlay-card">
          <legend>
            <input
              aria-label="纵向穿列线"
              type="checkbox"
              checked={value.verticalLines.enabled}
              onChange={(event) =>
                patch({
                  verticalLines: { ...value.verticalLines, enabled: event.target.checked },
                })
              }
            />
            纵向穿列线
          </legend>
          <label>
            间距
            <input
              aria-label="竖线间距"
              type="range"
              min="50"
              max="240"
              step="10"
              value={value.verticalLines.spacing}
              onChange={(event) =>
                patch({
                  verticalLines: {
                    ...value.verticalLines,
                    spacing: Number(event.target.value),
                  },
                })
              }
            />
          </label>
          <label>
            线宽
            <input
              aria-label="竖线宽度"
              type="range"
              min="1"
              max="10"
              value={value.verticalLines.thickness}
              onChange={(event) =>
                patch({
                  verticalLines: {
                    ...value.verticalLines,
                    thickness: Number(event.target.value),
                  },
                })
              }
            />
          </label>
          <label className="color-control">
            颜色
            <input
              aria-label="竖线颜色"
              type="color"
              value={value.verticalLines.color}
              onChange={(event) =>
                patch({
                  verticalLines: { ...value.verticalLines, color: event.target.value },
                })
              }
            />
          </label>
        </fieldset>

        <fieldset className="overlay-card">
          <legend>
            <input
              aria-label="颗粒噪点"
              type="checkbox"
              checked={value.noise.enabled}
              onChange={(event) =>
                patch({ noise: { ...value.noise, enabled: event.target.checked } })
              }
            />
            颗粒噪点
          </legend>
          <label>
            密度
            <input
              aria-label="噪点密度"
              type="range"
              min="0.0001"
              max="0.0015"
              step="0.0001"
              value={value.noise.density}
              onChange={(event) =>
                patch({ noise: { ...value.noise, density: Number(event.target.value) } })
              }
            />
          </label>
          <label>
            字符抖动
            <input
              aria-label="字符抖动"
              type="range"
              min="0"
              max="10"
              step="1"
              value={value.jitter}
              onChange={(event) => patch({ jitter: Number(event.target.value) })}
            />
          </label>
        </fieldset>
      </div>
    </div>
  )
}
