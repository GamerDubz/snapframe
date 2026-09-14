'use client'

import { useCallback, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Upload, Clipboard } from 'lucide-react'

type Props = {
  onFiles: (files: FileList | File[]) => void
}

// Fixed, decorative "contact sheet" of scattered print rectangles.
// Purely visual — sizes/rotations/positions are hand-tuned, not random,
// so the layout is stable across renders.
const SCATTER = [
  { top: '8%', right: '9%', w: 92, h: 68, rotate: -7, tone: 'var(--paper-sunken)' },
  { top: '2%', right: '24%', w: 60, h: 78, rotate: 5, tone: 'var(--accent-soft)' },
  { top: '30%', right: '4%', w: 78, h: 78, rotate: 4, tone: 'var(--line)' },
  { top: '44%', right: '22%', w: 100, h: 72, rotate: -3, tone: 'var(--paper-sunken)' },
  { top: '64%', right: '10%', w: 66, h: 88, rotate: 9, tone: 'var(--accent-soft)' },
  { top: '78%', right: '28%', w: 84, h: 60, rotate: -6, tone: 'var(--line)' },
]

export default function UploadZone({ onFiles }: Props) {
  const [dragging, setDragging] = useState(false)
  const reduceMotion = useReducedMotion()

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

  return (
    <div
      className="flex-1 relative overflow-hidden bg-paper"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Decorative contact-sheet scatter, hidden from assistive tech */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none" aria-hidden="true">
        {SCATTER.map((s, i) => (
          <div
            key={i}
            className="absolute border border-line-strong/70 shadow-sm"
            style={{
              top: s.top,
              right: s.right,
              width: s.w,
              height: s.h,
              transform: `rotate(${s.rotate}deg)`,
              background: s.tone,
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            className="absolute inset-4 border-2 border-dashed border-accent bg-accent-soft/40 flex items-center justify-center z-10 pointer-events-none"
          >
            <p className="font-display italic text-2xl text-accent">Drop it in the frame</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-[1] h-full flex items-center px-8 sm:px-16">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-lg"
        >
          <div className="sprocket-row mb-6" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-faint mb-3">
            Screenshot &amp; device mockup studio
          </p>
          <h1 className="font-display text-[2.75rem] sm:text-[3.4rem] leading-[1.05] text-ink mb-5">
            Bring a shot to
            <br />
            the <span className="italic text-accent">darkroom.</span>
          </h1>
          <p className="text-base text-ink-soft leading-relaxed mb-8 max-w-md">
            Drop a screenshot, choose a frame and a backdrop, then export a print-ready image —
            entirely in your browser. Nothing you upload ever leaves this tab.
          </p>

          <label htmlFor="file-upload" className="group cursor-pointer block">
            <div className="border-2 border-dashed border-line-strong group-hover:border-accent rounded-sm px-8 py-7 transition-colors duration-200 bg-paper-raised flex items-center gap-5">
              <div className="w-12 h-12 shrink-0 rounded-sm bg-accent-soft flex items-center justify-center group-hover:bg-accent group-hover:text-paper text-accent transition-colors">
                <Upload className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-ink">Choose a screenshot</p>
                <p className="text-sm text-ink-faint mt-0.5">PNG, JPEG or WebP · up to 20 MB</p>
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

          <div className="mt-5 flex items-center gap-2 text-ink-faint text-sm">
            <Clipboard className="w-4 h-4" aria-hidden="true" />
            <span>
              or press{' '}
              <kbd className="px-1.5 py-0.5 bg-paper-sunken border border-line rounded-sm text-ink-soft font-sans text-xs">
                Ctrl+V
              </kbd>{' '}
              to paste
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
