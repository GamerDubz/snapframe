'use client'

import { useCallback, useState } from 'react'
import { useEditorStore } from '@/lib/store'
import CanvasPreview from './CanvasPreview'

type Props = {
  onFileDrop: (files: FileList | File[]) => void
}

export default function Workspace({ onFileDrop }: Props) {
  const { state } = useEditorStore()
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setIsDragging(false), [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      onFileDrop(e.dataTransfer.files)
    },
    [onFileDrop]
  )

  return (
    <main
      className={`flex-1 flex items-center justify-center overflow-auto bg-darkroom relative transition-colors ${
        isDragging ? 'bg-accent/10' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label="Canvas workspace"
    >
      {isDragging && (
        <div className="absolute inset-4 border-2 border-dashed border-accent/60 pointer-events-none z-10" />
      )}

      <div className="p-10 flex items-center justify-center min-h-full w-full">
        {/* "Mat" — a print-mount border around the live canvas. Purely
            decorative chrome; the export target (#snapframe-canvas) lives
            inside, untouched, so it never appears in exported output. */}
        <div className="bg-paper-raised p-3 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
          <CanvasPreview />
        </div>
      </div>

      {/* Zoom hint */}
      <div className="absolute bottom-4 right-4 text-xs uppercase tracking-wider text-darkroom-text/60 select-none pointer-events-none">
        Canvas · {state.canvas.width} × {state.canvas.height}
      </div>
    </main>
  )
}
