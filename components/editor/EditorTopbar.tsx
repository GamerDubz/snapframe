'use client'

import { useCallback, useState } from 'react'
import { useEditorStore } from '@/lib/store'
import { exportCanvas } from '@/lib/export'
import { loadImageFromFile } from '@/lib/image'
import { Undo2, Redo2, Download, Upload } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EditorTopbar() {
  const { state, undo, redo, canUndo, canRedo, setImage } = useEditorStore()
  const [exporting, setExporting] = useState(false)

  const handleReplace = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      try {
        const asset = await loadImageFromFile(file)
        setImage(asset)
      } catch (err: unknown) {
        alert((err as Error).message)
      }
      e.target.value = ''
    },
    [setImage]
  )

  const handleExport = useCallback(async () => {
    setExporting(true)
    try {
      await exportCanvas(state, state.export.scale, state.export.format)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [state])

  return (
    <header className="h-12 flex items-center justify-between px-4 border-b border-[#2e2e2e] bg-[#1a1a1a] shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-[15px] tracking-tight text-neutral-100">
          SnapFrame
        </span>

        {state.image && (
          <>
            <div className="w-px h-4 bg-[#2e2e2e]" />
            <label
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer transition-colors px-2 py-1 rounded hover:bg-[#2a2a2a]"
              title="Replace screenshot"
            >
              <Upload className="w-3.5 h-3.5" />
              Replace
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={handleReplace}
              />
            </label>
          </>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo()}
          className="p-2 rounded hover:bg-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Undo"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4 text-neutral-400" />
        </button>

        <button
          onClick={redo}
          disabled={!canRedo()}
          className="p-2 rounded hover:bg-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Redo"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="w-4 h-4 text-neutral-400" />
        </button>

        {state.image && (
          <>
            <div className="w-px h-4 bg-[#2e2e2e] mx-1" />
            <motion.button
              onClick={handleExport}
              disabled={exporting}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded transition-colors disabled:opacity-70"
              aria-label="Export image"
            >
              <Download className="w-3.5 h-3.5" />
              {exporting ? 'Exporting…' : 'Export'}
            </motion.button>
          </>
        )}
      </div>
    </header>
  )
}
