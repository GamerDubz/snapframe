'use client'

import { useCallback, useState } from 'react'
import { useEditorStore } from '@/lib/store'
import { validateFile, loadImageFromFile } from '@/lib/image'
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
      className={`flex-1 flex items-center justify-center overflow-auto bg-[#141414] relative transition-colors ${
        isDragging ? 'bg-blue-950/30' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label="Canvas workspace"
    >
      {isDragging && (
        <div className="absolute inset-0 border-2 border-blue-500/50 rounded-none pointer-events-none z-10" />
      )}

      <div className="p-8 flex items-center justify-center min-h-full w-full">
        <CanvasPreview />
      </div>

      {/* Zoom hint */}
      <div className="absolute bottom-4 right-4 text-xs text-neutral-600 select-none pointer-events-none">
        Canvas · {state.canvas.width} × {state.canvas.height}
      </div>
    </main>
  )
}
