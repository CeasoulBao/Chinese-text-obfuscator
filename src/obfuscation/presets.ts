export type PresetName = 'light' | 'medium' | 'heavy' | 'custom'

export const presetDefinitions: Record<
  Exclude<PresetName, 'custom'>,
  { label: string; description: string; intensities: number[] }
> = {
  light: {
    label: '轻度',
    description: '保留直接阅读体验，少量替换与符号。',
    intensities: [0.45, 0.12, 0.08, 0.12],
  },
  medium: {
    label: '中度',
    description: '需要少量脑补，适合日常短文。',
    intensities: [0.75, 0.28, 0.22, 0.3],
  },
  heavy: {
    label: '重度',
    description: '明显改变文字结构，务必检查可读性。',
    intensities: [1, 0.5, 0.5, 0.55],
  },
}
