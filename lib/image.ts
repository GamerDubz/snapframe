import { ImageAsset } from '@/types/editor'

const SUPPORTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_SIZE_MB = 20

export function validateFile(file: File): string | null {
  if (!SUPPORTED_TYPES.includes(file.type)) {
    return `Unsupported file type: ${file.type || 'unknown'}. Please use PNG, JPEG, or WebP.`
  }
  if (file.size === 0) {
    return 'The file appears to be empty.'
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is ${MAX_SIZE_MB} MB.`
  }
  return null
}

export function loadImageFromFile(file: File): Promise<ImageAsset> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({ src: url, width: img.naturalWidth, height: img.naturalHeight, name: file.name })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not load image. The file may be corrupted.'))
    }
    img.src = url
  })
}

export function loadImageFromClipboard(e: ClipboardEvent): Promise<ImageAsset | null> {
  return new Promise((resolve, reject) => {
    const items = e.clipboardData?.items
    if (!items) {
      resolve(null)
      return
    }
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          loadImageFromFile(file).then(resolve).catch(reject)
          return
        }
      }
    }
    resolve(null)
  })
}
