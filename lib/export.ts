import { EditorState, ExportFormat, ExportScale } from '@/types/editor'

export async function exportCanvas(
  state: EditorState,
  scale: ExportScale,
  format: ExportFormat
): Promise<void> {
  const { default: html2canvas } = await import('html2canvas')

  const canvasEl = document.getElementById('snapframe-canvas')
  if (!canvasEl) throw new Error('Canvas element not found')

  const pixelRatio = scale
  const canvas = await html2canvas(canvasEl as HTMLElement, {
    scale: pixelRatio,
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    logging: false,
    width: canvasEl.clientWidth,
    height: canvasEl.clientHeight,
  })

  const mimeType =
    format === 'png'
      ? 'image/png'
      : format === 'jpeg'
      ? 'image/jpeg'
      : 'image/webp'

  const quality = format === 'jpeg' ? 0.92 : undefined
  const dataUrl = canvas.toDataURL(mimeType, quality)

  const link = document.createElement('a')
  link.download = `snapframe-export.${format}`
  link.href = dataUrl
  link.click()
}
