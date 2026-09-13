'use client'

import { useEditorStore } from '@/lib/store'
import { getBackgroundCSS } from '@/lib/presets'
import FrameRenderer from '@/components/frame/FrameRenderer'

export default function CanvasPreview() {
  const { state } = useEditorStore()
  const { canvas, background, screenshot, image, frame } = state

  const bgCss = getBackgroundCSS(background)

  // Scale to fit inside workspace (max 800px wide for preview)
  const maxPreviewWidth = 800
  const aspectRatioVal = canvas.width / canvas.height
  const previewWidth = Math.min(maxPreviewWidth, canvas.width)
  const previewHeight = previewWidth / aspectRatioVal
  const scaleFactor = previewWidth / canvas.width

  if (!image) return null

  return (
    <div
      id="snapframe-canvas"
      style={{
        width: `${previewWidth}px`,
        height: `${previewHeight}px`,
        background: bgCss,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '4px',
        boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
        flexShrink: 0,
      }}
      aria-label="Canvas preview"
    >
      {/* Centered frame content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${screenshot.outerPadding * scaleFactor}px`,
        }}
      >
        <FrameRenderer
          image={image}
          frame={frame}
          screenshot={screenshot}
          scaleFactor={scaleFactor}
        />
      </div>
    </div>
  )
}
