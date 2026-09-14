'use client'

import { useState } from 'react'
import { useEditorStore } from '@/lib/store'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { BACKGROUND_PRESETS } from '@/lib/presets'
import { FrameType, AspectRatio, BackgroundPreset, BackgroundType, ExportFormat, ExportScale } from '@/types/editor'

const FRAMES: { type: FrameType; label: string }[] = [
  { type: 'frameless', label: 'Frameless' },
  { type: 'browser-macos', label: 'Browser — macOS' },
  { type: 'browser-minimal', label: 'Browser — Minimal' },
  { type: 'browser-dark', label: 'Browser — Dark' },
  { type: 'phone-ios', label: 'Phone — iOS' },
  { type: 'phone-android', label: 'Phone — Android' },
  { type: 'laptop', label: 'Laptop' },
]

const ASPECT_RATIOS: { ratio: AspectRatio; label: string }[] = [
  { ratio: '16:9', label: '16:9' },
  { ratio: '4:3', label: '4:3' },
  { ratio: '1:1', label: '1:1' },
  { ratio: '4:5', label: '4:5' },
  { ratio: '9:16', label: '9:16' },
]

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[#2e2e2e]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-300 transition-colors"
        aria-expanded={open}
      >
        {title}
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs text-neutral-400 mb-1">{children}</label>
}

function SliderControl({ label, value, min, max, step = 1, onChange }: {
  label: string; value: number; min: number; max: number; step?: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-neutral-400">{label}</span>
        <span className="text-xs text-neutral-500 tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        aria-label={label}
      />
    </div>
  )
}

export default function Inspector() {
  const { state, setFrameType, updateFrame, setAspectRatio, setBackgroundType, setBackgroundPreset, updateBackground, updateScreenshot, updateExport } = useEditorStore()
  const { frame, canvas, background, screenshot, export: exp } = state

  return (
    <aside className="w-[260px] shrink-0 border-r border-[#2e2e2e] bg-[#1a1a1a] overflow-y-auto flex flex-col" aria-label="Inspector">
      {/* Frame */}
      <Section title="Frame">
        <div className="grid grid-cols-1 gap-1">
          {FRAMES.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setFrameType(type)}
              className={`text-left px-3 py-2 rounded text-xs transition-colors ${frame.type === type ? 'bg-blue-600/20 text-blue-300 border border-blue-600/40' : 'text-neutral-400 hover:bg-[#2a2a2a] hover:text-neutral-200'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Frame-specific controls */}
        {(frame.type === 'browser-macos' || frame.type === 'browser-minimal' || frame.type === 'browser-dark') && (
          <div className="mt-3 space-y-3 pt-3 border-t border-[#2e2e2e]">
            <div>
              <Label>URL</Label>
              <input
                type="text"
                value={frame.url ?? ''}
                onChange={(e) => updateFrame({ url: e.target.value })}
                placeholder="https://example.com"
                className="w-full bg-[#242424] border border-[#333] rounded px-2.5 py-1.5 text-xs text-neutral-200 outline-none focus:border-blue-500"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer">
              <input type="checkbox" checked={frame.showNavControls ?? true} onChange={(e) => updateFrame({ showNavControls: e.target.checked })} className="rounded" />
              Show navigation controls
            </label>
          </div>
        )}

        {(frame.type === 'phone-ios' || frame.type === 'phone-android') && (
          <div className="mt-3 space-y-3 pt-3 border-t border-[#2e2e2e]">
            <SliderControl label="Frame thickness" value={frame.frameThickness ?? 12} min={6} max={24} onChange={(v) => updateFrame({ frameThickness: v })} />
            <div>
              <Label>Device color</Label>
              <input type="color" value={frame.deviceColor ?? '#1a1a1a'} onChange={(e) => updateFrame({ deviceColor: e.target.value })} className="w-full h-8 cursor-pointer rounded bg-transparent border border-[#333]" />
            </div>
            {frame.type === 'phone-ios' && (
              <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer">
                <input type="checkbox" checked={frame.showCameraIsland ?? false} onChange={(e) => updateFrame({ showCameraIsland: e.target.checked })} />
                Show Dynamic Island
              </label>
            )}
          </div>
        )}
      </Section>

      {/* Canvas */}
      <Section title="Canvas">
        <div className="flex flex-wrap gap-1.5">
          {ASPECT_RATIOS.map(({ ratio, label }) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${canvas.aspectRatio === ratio ? 'bg-blue-600/20 text-blue-300 border border-blue-600/40' : 'bg-[#242424] text-neutral-400 hover:text-neutral-200 border border-transparent'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="text-xs text-neutral-600 mt-1">
          {canvas.width} × {canvas.height}px
        </div>
      </Section>

      {/* Background */}
      <Section title="Background">
        <div className="flex gap-1.5">
          {(['solid', 'linear', 'radial', 'preset'] as BackgroundType[]).map((t) => (
            <button
              key={t}
              onClick={() => setBackgroundType(t)}
              className={`flex-1 py-1 rounded text-xs capitalize transition-colors ${background.type === t && background.preset === null ? 'bg-blue-600/20 text-blue-300 border border-blue-600/40' : 'bg-[#242424] text-neutral-400 hover:text-neutral-200 border border-transparent'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {background.type === 'solid' && (
          <div>
            <Label>Color</Label>
            <input type="color" value={background.color} onChange={(e) => updateBackground({ color: e.target.value })} className="w-full h-8 cursor-pointer rounded bg-transparent border border-[#333]" />
          </div>
        )}

        {(background.type === 'linear' || background.type === 'radial') && (
          <>
            <div>
              <Label>Color 1</Label>
              <input type="color" value={background.gradientColor1} onChange={(e) => updateBackground({ gradientColor1: e.target.value })} className="w-full h-8 cursor-pointer rounded bg-transparent border border-[#333]" />
            </div>
            <div>
              <Label>Color 2</Label>
              <input type="color" value={background.gradientColor2} onChange={(e) => updateBackground({ gradientColor2: e.target.value })} className="w-full h-8 cursor-pointer rounded bg-transparent border border-[#333]" />
            </div>
            {background.type === 'linear' && (
              <SliderControl label="Angle" value={background.gradientAngle} min={0} max={360} onChange={(v) => updateBackground({ gradientAngle: v })} />
            )}
          </>
        )}

        {background.type === 'preset' && (
          <div className="grid grid-cols-3 gap-1.5">
            {(Object.entries(BACKGROUND_PRESETS) as [BackgroundPreset, typeof BACKGROUND_PRESETS[BackgroundPreset]][]).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => setBackgroundPreset(key)}
                title={preset.label}
                className={`h-10 rounded transition-all ${background.preset === key ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-[#1a1a1a]' : 'hover:opacity-90'}`}
                style={{ background: preset.css }}
                aria-label={preset.label}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Screenshot */}
      <Section title="Screenshot" defaultOpen={false}>
        <SliderControl label="Scale" value={screenshot.scale} min={0.3} max={1} step={0.01} onChange={(v) => updateScreenshot({ scale: v })} />
        <SliderControl label="Outer padding" value={screenshot.outerPadding} min={0} max={120} onChange={(v) => updateScreenshot({ outerPadding: v })} />
        <SliderControl label="Corner radius" value={screenshot.radius} min={0} max={32} onChange={(v) => updateScreenshot({ radius: v })} />
        <SliderControl label="Shadow strength" value={screenshot.shadowStrength} min={0} max={100} onChange={(v) => updateScreenshot({ shadowStrength: v })} />
        <SliderControl label="Shadow blur" value={screenshot.shadowBlur} min={0} max={120} onChange={(v) => updateScreenshot({ shadowBlur: v })} />
        <SliderControl label="Shadow distance" value={screenshot.shadowDistance} min={0} max={80} onChange={(v) => updateScreenshot({ shadowDistance: v })} />
        <SliderControl label="Rotation" value={screenshot.rotation} min={-15} max={15} step={0.5} onChange={(v) => updateScreenshot({ rotation: v })} />
        <SliderControl label="Border width" value={screenshot.borderWidth} min={0} max={8} onChange={(v) => updateScreenshot({ borderWidth: v })} />
        {screenshot.borderWidth > 0 && (
          <div>
            <Label>Border color</Label>
            <input type="color" value={screenshot.borderColor} onChange={(e) => updateScreenshot({ borderColor: e.target.value })} className="w-full h-8 cursor-pointer rounded bg-transparent border border-[#333]" />
          </div>
        )}
      </Section>

      {/* Export */}
      <Section title="Export" defaultOpen={false}>
        <div>
          <Label>Format</Label>
          <div className="flex gap-1.5">
            {(['png', 'jpeg', 'webp'] as ExportFormat[]).map((f) => (
              <button key={f} onClick={() => updateExport({ format: f })} className={`flex-1 py-1 rounded text-xs uppercase transition-colors ${exp.format === f ? 'bg-blue-600/20 text-blue-300 border border-blue-600/40' : 'bg-[#242424] text-neutral-400 hover:text-neutral-200 border border-transparent'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div>
          <Label>Scale</Label>
          <div className="flex gap-1.5">
            {([1, 2, 3] as ExportScale[]).map((s) => (
              <button key={s} onClick={() => updateExport({ scale: s })} className={`flex-1 py-1 rounded text-xs transition-colors ${exp.scale === s ? 'bg-blue-600/20 text-blue-300 border border-blue-600/40' : 'bg-[#242424] text-neutral-400 hover:text-neutral-200 border border-transparent'}`}>{s}×</button>
            ))}
          </div>
        </div>
      </Section>
    </aside>
  )
}
