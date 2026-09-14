'use client'

import { useCallback, useState } from 'react'
import { useEditorStore } from '@/lib/store'
import { exportCanvas } from '@/lib/export'
import { loadImageFromFile } from '@/lib/image'
import { Undo2, Redo2, Download, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import Logomark from '@/components/brand/Logomark'

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
    <header className="shrink-0 bg-paper border-b border-line">
      <div className="h-16 flex items-center justify-between px-5 gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2.5 text-ink">
            <Logomark className="w-7 h-7" title="Snapframe" />
            <span className="font-display text-[21px] leading-none tracking-tight">
              Snapframe
            </span>
          </div>

          {state.image && (
            <>
              <div className="hidden sm:block sprocket-row" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <label
                className="flex items-center gap-1.5 text-[13px] font-medium text-ink-soft hover:text-accent cursor-pointer transition-colors px-2.5 min-h-11 rounded-sm hover:bg-paper-sunken"
                title="Replace screenshot"
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
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

        <div className="flex items-center gap-1.5">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="min-w-11 min-h-11 flex items-center justify-center rounded-sm text-ink-soft hover:text-ink hover:bg-paper-sunken disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-[18px] h-[18px]" aria-hidden="true" />
          </button>

          <button
            onClick={redo}
            disabled={!canRedo()}
            className="min-w-11 min-h-11 flex items-center justify-center rounded-sm text-ink-soft hover:text-ink hover:bg-paper-sunken disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Redo"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-[18px] h-[18px]" aria-hidden="true" />
          </button>

          {state.image && (
            <>
              <div className="w-px h-6 bg-line mx-1.5" aria-hidden="true" />
              <motion.button
                onClick={handleExport}
                disabled={exporting}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 min-h-11 bg-ink hover:bg-accent text-paper text-[13px] font-medium tracking-wide rounded-sm transition-colors disabled:opacity-70"
                aria-label="Export image"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                {exporting ? 'Exporting…' : 'Export'}
              </motion.button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
