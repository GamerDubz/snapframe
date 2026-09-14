'use client'

import { useEffect, useCallback } from 'react'
import { useEditorStore } from '@/lib/store'
import EditorTopbar from '@/components/editor/EditorTopbar'
import Inspector from '@/components/editor/Inspector'
import Workspace from '@/components/editor/Workspace'
import UploadZone from '@/components/upload/UploadZone'

export default function Home() {
  const { state, setImage, undo, redo } = useEditorStore()

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const file = Array.from(files)[0]
      if (!file) return
      const { validateFile: vf, loadImageFromFile: lif } = await import('@/lib/image')
      const err = vf(file)
      if (err) { alert(err); return }
      try {
        const asset = await lif(file)
        setImage(asset)
      } catch (e: unknown) {
        alert((e as Error).message)
      }
    },
    [setImage]
  )

  // Clipboard paste
  useEffect(() => {
    const handler = async (e: ClipboardEvent) => {
      const { loadImageFromClipboard: lic } = await import('@/lib/image')
      try {
        const asset = await lic(e)
        if (asset) setImage(asset)
      } catch { /* ignore */ }
    }
    window.addEventListener('paste', handler)
    return () => window.removeEventListener('paste', handler)
  }, [setImage])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  return (
    <div className="flex flex-col h-full">
      <EditorTopbar />
      <div className="flex flex-1 overflow-hidden">
        {state.image ? (
          <>
            <Inspector />
            <Workspace onFileDrop={handleFiles} />
          </>
        ) : (
          <UploadZone onFiles={handleFiles} />
        )}
      </div>
    </div>
  )
}
