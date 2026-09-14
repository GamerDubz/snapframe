'use client'

import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Clipboard, Image as ImageIcon, Sparkles, Wand2 } from 'lucide-react'
import { ImageAsset } from '@/types/editor'

type Props = {
  onFiles: (files: FileList | File[]) => void
  onSampleLoaded?: (asset: ImageAsset) => void
}

export default function UploadZone({ onFiles, onSampleLoaded }: Props) {
  const [dragging, setDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setDragging(false), [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      if (e.dataTransfer.files.length > 0) {
        onFiles(e.dataTransfer.files)
      }
    },
    [onFiles]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFiles(e.target.files)
      }
    },
    [onFiles]
  )

  const loadSample = useCallback(() => {
    // Generate a sleek sample app dashboard screenshot on a canvas
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 750
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 750)
    bgGrad.addColorStop(0, '#0F172A')
    bgGrad.addColorStop(0.5, '#1E1B4B')
    bgGrad.addColorStop(1, '#0284C7')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, 1200, 750)

    // Glass panel mock UI
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)'
    ctx.beginPath()
    ctx.roundRect(60, 60, 1080, 630, 20)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Header bar inside mock UI
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.beginPath()
    ctx.roundRect(60, 60, 1080, 70, [20, 20, 0, 0])
    ctx.fill()

    // App dots
    ctx.fillStyle = '#EF4444'
    ctx.beginPath(); ctx.arc(100, 95, 6, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#F59E0B'
    ctx.beginPath(); ctx.arc(120, 95, 6, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#10B981'
    ctx.beginPath(); ctx.arc(140, 95, 6, 0, Math.PI * 2); ctx.fill()

    // Title in mock
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif'
    ctx.fillText('Analytics Pulse Dashboard', 180, 103)

    // Cards in mock
    const colors = ['#6366F1', '#38BDF8', '#10B981', '#F43F5E']
    const metrics = ['Total Revenue', 'Active Users', 'Growth Rate', 'Retention']
    const values = ['$128,450', '24,890', '+34.2%', '96.8%']

    for (let i = 0; i < 4; i++) {
      const cx = 95 + i * 255
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.beginPath()
      ctx.roundRect(cx, 160, 235, 120, 12)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.stroke()

      ctx.fillStyle = colors[i]
      ctx.beginPath()
      ctx.arc(cx + 26, 188, 5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.font = '13px system-ui'
      ctx.fillText(metrics[i], cx + 40, 192)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 26px system-ui'
      ctx.fillText(values[i], cx + 24, 246)
    }

    // Chart mock
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
    ctx.beginPath()
    ctx.roundRect(95, 310, 1010, 340, 16)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.stroke()

    // Wave path
    const chartGrad = ctx.createLinearGradient(0, 350, 0, 600)
    chartGrad.addColorStop(0, 'rgba(99, 102, 241, 0.5)')
    chartGrad.addColorStop(1, 'rgba(99, 102, 241, 0.0)')

    ctx.beginPath()
    ctx.moveTo(130, 560)
    ctx.bezierCurveTo(280, 510, 360, 420, 500, 460)
    ctx.bezierCurveTo(640, 500, 720, 380, 860, 400)
    ctx.bezierCurveTo(980, 420, 1020, 370, 1070, 360)
    ctx.lineTo(1070, 610)
    ctx.lineTo(130, 610)
    ctx.closePath()
    ctx.fillStyle = chartGrad
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(130, 560)
    ctx.bezierCurveTo(280, 510, 360, 420, 500, 460)
    ctx.bezierCurveTo(640, 500, 720, 380, 860, 400)
    ctx.bezierCurveTo(980, 420, 1020, 370, 1070, 360)
    ctx.strokeStyle = '#818CF8'
    ctx.lineWidth = 4
    ctx.stroke()

    const dataUrl = canvas.toDataURL('image/png')
    if (onSampleLoaded) {
      onSampleLoaded({
        src: dataUrl,
        width: 1200,
        height: 750,
        name: 'sample-dashboard.png',
      })
    }
  }, [onSampleLoaded])

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center relative p-6 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.15),rgba(11,15,25,0))]"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="absolute inset-0 bg-indigo-500/15 border-2 border-indigo-500/80 rounded-2xl m-6 flex items-center justify-center z-20 pointer-events-none backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-8 h-8 text-indigo-300" />
              </div>
              <p className="text-indigo-200 text-lg font-semibold tracking-tight">Drop your screenshot to frame</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center max-w-md w-full"
      >
        <label
          htmlFor="file-upload"
          className="group cursor-pointer block"
        >
          <div className="relative border-2 border-dashed border-slate-700/80 group-hover:border-indigo-500/80 rounded-3xl p-10 transition-all duration-300 bg-slate-900/60 backdrop-blur-xl group-hover:shadow-2xl group-hover:shadow-indigo-500/10 group-hover:bg-slate-900/80">
            {/* Top decorative badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-5 group-hover:scale-105 group-hover:border-indigo-400/50 transition-all">
              <Upload className="w-7 h-7 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight mb-2">
              Drop screenshot or click to browse
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-4">
              Instantly transforms into high-res device mockups
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-400 text-[11px] font-medium">
              <span>PNG, JPEG, WebP</span>
              <span>•</span>
              <span>Max 20 MB</span>
            </div>
          </div>
          <input
            id="file-upload"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={handleInputChange}
            aria-label="Upload screenshot"
          />
        </label>

        {/* Quick sample and shortcut bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
          <button
            onClick={loadSample}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            Try with demo dashboard
          </button>

          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
            <Clipboard className="w-3.5 h-3.5" />
            <span>or press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono border border-slate-700">Ctrl+V</kbd> to paste</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
