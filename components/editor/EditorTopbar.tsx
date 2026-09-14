'use client'

import { useCallback, useState } from 'react'
import { useEditorStore } from '@/lib/store'
import { exportCanvas } from '@/lib/export'
import { loadImageFromFile } from '@/lib/image'
import { Undo2, Redo2, Download, Upload, Sparkles, Image as ImageIcon } from 'lucide-react'
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
    <header className="h-14 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-md shrink-0 z-20">
      <div className="flex items-center gap-3">
        {/* Custom SVG Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 p-[1px] shadow-sm shadow-indigo-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" className="text-indigo-400 stroke-current" />
                <circle cx="9" cy="9" r="2" className="text-cyan-400 fill-cyan-400 stroke-none" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" className="text-indigo-300 stroke-current" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base tracking-tight text-white">
              Snap<span className="text-indigo-400">Frame</span>
            </span>
            <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Studio
            </span>
          </div>
        </div>

        {state.image && (
          <>
            <div className="w-px h-5 bg-slate-800 mx-1" />
            <label
              className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white cursor-pointer transition-all px-2.5 py-1.5 rounded-lg hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60"
              title="Replace screenshot"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              Replace Image
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

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-1.5 rounded-md hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-400 hover:text-white"
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-1.5 rounded-md hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-400 hover:text-white"
            aria-label="Redo"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {state.image && (
          <motion.button
            onClick={handleExport}
            disabled={exporting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-500/20 transition-all disabled:opacity-60 cursor-pointer"
            aria-label="Export image"
          >
            {exporting ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Rendering…
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Export High-Res
              </>
            )}
          </motion.button>
        )}
      </div>
    </header>
  )
}
