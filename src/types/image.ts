export interface LineOverlaySettings {
  enabled: boolean
  color: string
  opacity: number
  thickness: number
  spacing: number
}

export interface NoiseSettings {
  enabled: boolean
  color: string
  opacity: number
  density: number
  radius: number
}

export interface ImageSettings {
  width: number
  padding: number
  fontFamily: string
  fontSize: number
  lineHeight: number
  textColor: string
  backgroundColor: string
  horizontalLines: LineOverlaySettings
  verticalLines: LineOverlaySettings
  noise: NoiseSettings
  jitter: number
  targetPageHeight: number
}

export interface ImagePage {
  lines: string[]
  width: number
  height: number
  index: number
  total: number
}

export const defaultImageSettings: ImageSettings = {
  width: 1080,
  padding: 72,
  fontFamily: '"Noto Serif SC", "Songti SC", STSong, serif',
  fontSize: 38,
  lineHeight: 1.75,
  textColor: '#24231f',
  backgroundColor: '#f4f0e7',
  horizontalLines: {
    enabled: true,
    color: '#a33c2f',
    opacity: 0.65,
    thickness: 3,
    spacing: 1,
  },
  verticalLines: {
    enabled: false,
    color: '#315c58',
    opacity: 0.45,
    thickness: 2,
    spacing: 130,
  },
  noise: {
    enabled: false,
    color: '#24231f',
    opacity: 0.18,
    density: 0.00045,
    radius: 1.2,
  },
  jitter: 0,
  targetPageHeight: 1600,
}
