export function exportFilename(baseName: string, index: number, total: number): string {
  if (total <= 1) return `${baseName}.png`
  const width = String(total).length
  return `${baseName}-${String(index).padStart(width, '0')}-of-${total}.png`
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('浏览器未能生成 PNG 图片'))
    }, 'image/png')
  })
}

export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
): Promise<void> {
  const blob = await canvasToBlob(canvas)
  const url = URL.createObjectURL(blob)
  try {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }
}
