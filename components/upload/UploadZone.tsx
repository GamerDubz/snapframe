'use client'

import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Clipboard, Image as ImageIcon } from 'lucide-react'

type Props = {
  onFiles: (files: FileList | File[]) => void
}

export default function UploadZone({ onFiles }: Props) {
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

  return (
    <div
      className="flex-1 flex items-center justify-center relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500/60 rounded-xl m-4 flex items-center justify-center z-10 pointer-events-none"
          >
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <p className="text-blue-300 text-lg font-medium">Drop your screenshot here</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center max-w-sm px-4"
      >
        <label
          htmlFor="file-upload"
          className="group cursor-pointer block"
        >
          <div className="border-2 border-dashed border-neutral-700 group-hover:border-blue-500/60 rounded-2xl p-12 transition-colors duration-200 bg-neutral-900/50">
            <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-blue-500/20 transition-colors">
              <Upload className="w-7 h-7 text-blue-400" />
            </div>

            <h2 className="text-xl font-semibold text-neutral-100 mb-2">
              Drop a screenshot here
            </h2>
            <p className="text-neutral-400 text-sm mb-1">or paste from your clipboard</p>
            <p className="text-neutral-600 text-xs mt-3">PNG, JPEG, WebP · Up to 20 MB</p>
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

        <div className="mt-4 flex items-center justify-center gap-2 text-neutral-600 text-xs">
          <Clipboard className="w-3.5 h-3.5" />
          <span>Tip: press <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-neutral-400 font-mono">Ctrl+V</kbd> to paste</span>
        </div>
      </motion.div>
    </div>
  )
}
