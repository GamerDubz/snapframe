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

  const handleReplaceInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileDrop(e.target.files)
      }
      // Reset so selecting the same file again still fires onChange.
      e.target.value = ''
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
            inside, untouched, so it never appears in exported output.
            The label overlay sits above the mat (not inside the export
            target) so clicking/tabbing to it opens the file picker
            without ever being captured on export. */}
        <div className="relative group/replace">
          <label
            htmlFor="workspace-replace-upload"
            className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer rounded-sm bg-darkroom/0 group-hover/replace:bg-darkroom/50 focus-within:bg-darkroom/50 transition-colors duration-200"
          >
            <span className="opacity-0 group-hover/replace:opacity-100 focus-within:opacity-100 transition-opacity duration-200 text-xs uppercase tracking-wider text-paper bg-darkroom/80 px-3 py-2 rounded-sm pointer-events-none">
              Click to replace screenshot
            </span>
            <input
              id="workspace-replace-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={handleReplaceInputChange}
              aria-label="Replace screenshot"
            />
          </label>
          <div className="bg-paper-raised p-3 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
            <CanvasPreview />
          </div>
        </div>
      </div>

      {/* Zoom hint */}
      <div className="absolute bottom-4 right-4 text-xs uppercase tracking-wider text-darkroom-text/60 select-none pointer-events-none">
        Canvas · {state.canvas.width} × {state.canvas.height}
      </div>
    </main>
  )
}
