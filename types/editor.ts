export type ImageAsset = {
  src: string
  width: number
  height: number
  name: string
}

export type FrameType =
  | 'frameless'
  | 'browser-minimal'
  | 'browser-macos'
  | 'browser-dark'
  | 'phone-ios'
  | 'phone-android'
  | 'laptop'

export type FrameSettings = {
  type: FrameType
  // Browser-specific
  url?: string
  showNavControls?: boolean
  topBarHeight?: number
  // Phone-specific
  frameThickness?: number
  deviceColor?: string
  showCameraIsland?: boolean
  // Frameless-specific
  radius?: number
  borderWidth?: number
  borderColor?: string
  shadowStrength?: number
}

export type AspectRatio = '16:9' | '4:3' | '1:1' | '4:5' | '9:16' | 'custom'

export type CanvasSettings = {
  aspectRatio: AspectRatio
  width: number
  height: number
}

export type BackgroundType = 'solid' | 'linear' | 'radial' | 'preset'

export type BackgroundPreset =
  | 'aurora'
  | 'midnight'
  | 'ocean'
  | 'citrus'
  | 'ember'
  | 'lavender'
  | 'ice'
  | 'sunset'
  | 'mono'

export type BackgroundSettings = {
  type: BackgroundType
  color: string
  gradientColor1: string
  gradientColor2: string
  gradientAngle: number
  preset: BackgroundPreset | null
  noise: boolean
}

export type ScreenshotSettings = {
  scale: number
  x: number
  y: number
  padding: number
  outerPadding: number
  radius: number
  borderWidth: number
  borderColor: string
  shadowStrength: number
  shadowBlur: number
  shadowDistance: number
  rotation: number
}

export type ExportFormat = 'png' | 'jpeg' | 'webp'
export type ExportScale = 1 | 2 | 3

export type ExportSettings = {
  format: ExportFormat
  scale: ExportScale
}

export type EditorState = {
  image: ImageAsset | null
  frame: FrameSettings
  canvas: CanvasSettings
  background: BackgroundSettings
  screenshot: ScreenshotSettings
  export: ExportSettings
}

export type HistoryState = {
  past: EditorState[]
  present: EditorState
  future: EditorState[]
}
