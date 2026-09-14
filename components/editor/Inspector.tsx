'use client'

import { useState } from 'react'
import { useEditorStore } from '@/lib/store'
import { ChevronDown, ChevronRight, Sliders, Layout, Palette, Image as ImageIcon, Download } from 'lucide-react'
import { BACKGROUND_PRESETS } from '@/lib/presets'
import { FrameType, AspectRatio, BackgroundPreset, BackgroundType, ExportFormat, ExportScale } from '@/types/editor'

const FRAMES: { type: FrameType; label: string; iconLabel: string }[] = [
  { type: 'frameless', label: 'Frameless', iconLabel: 'Pure' },
  { type: 'browser-macos', label: 'macOS Safari', iconLabel: 'Mac' },
  { type: 'browser-minimal', label: 'Minimal Browser', iconLabel: 'Web' },
  { type: 'browser-dark', label: 'Dark Chrome', iconLabel: 'Dark' },
  { type: 'phone-ios', label: 'iPhone Pro', iconLabel: 'iOS' },
  { type: 'phone-android', label: 'Pixel / Android', iconLabel: 'Droid' },
  { type: 'laptop', label: 'MacBook Pro', iconLabel: 'Laptop' },
]

const ASPECT_RATIOS: { ratio: AspectRatio; label: string }[] = [
  { ratio: '16:9', label: '16:9' },
  { ratio: '4:3', label: '4:3' },
  { ratio: '1:1', label: '1:1' },
  { ratio: '4:5', label: '4:5' },
  { ratio: '9:16', label: '9:16' },
]

function Section({ title, icon: Icon, children, defaultOpen = true }: { title: string; icon?: any; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-slate-800/80">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-indigo-400" />}
          {title}
        </div>
        {open ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] font-medium text-slate-400 mb-1">{children}</label>
}

function SliderControl({ label, value, min, max, step = 1, onChange }: {
  label: string; value: number; min: number; max: number; step?: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs text-indigo-300 font-mono tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500 bg-slate-800"
        aria-label={label}
      />
    </div>
  )
}

export default function Inspector() {
  const { state, setFrameType, updateFrame, setAspectRatio, setBackgroundType, setBackgroundPreset, updateBackground, updateScreenshot, updateExport } = useEditorStore()
  const { frame, canvas, background, screenshot, export: exp } = state

  return (
    <aside className="w-[280px] shrink-0 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-md overflow-y-auto flex flex-col z-10" aria-label="Inspector">
      {/* Frame */}
      <Section title="Device & Frame" icon={Layout}>
        <div className="grid grid-cols-1 gap-1.5">
          {FRAMES.map(({ type, label, iconLabel }) => (
            <button
              key={type}
              onClick={() => setFrameType(type)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                frame.type === type
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span>{label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${frame.type === type ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-900 text-slate-500'}`}>
                {iconLabel}
              </span>
            </button>
          ))}
        </div>

        {/* Frame-specific controls */}
        {(frame.type === 'browser-macos' || frame.type === 'browser-minimal' || frame.type === 'browser-dark') && (
          <div className="mt-3 space-y-3 pt-3 border-t border-slate-800">
            <div>
              <Label>Browser URL Title</Label>
              <input
                type="text"
                value={frame.url ?? ''}
                onChange={(e) => updateFrame({ url: e.target.value })}
                placeholder="https://example.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-200">
              <input type="checkbox" checked={frame.showNavControls ?? true} onChange={(e) => updateFrame({ showNavControls: e.target.checked })} className="rounded accent-indigo-500" />
              Show window control buttons
            </label>
          </div>
        )}

        {(frame.type === 'phone-ios' || frame.type === 'phone-android') && (
          <div className="mt-3 space-y-3 pt-3 border-t border-slate-800">
            <SliderControl label="Bezel thickness" value={frame.frameThickness ?? 12} min={6} max={24} onChange={(v) => updateFrame({ frameThickness: v })} />
            <div>
              <Label>Bezel color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={frame.deviceColor ?? '#0f172a'} onChange={(e) => updateFrame({ deviceColor: e.target.value })} className="w-8 h-8 cursor-pointer rounded-lg bg-transparent border border-slate-700" />
                <span className="text-xs font-mono text-slate-400">{frame.deviceColor ?? '#0f172a'}</span>
              </div>
            </div>
            {frame.type === 'phone-ios' && (
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-200">
                <input type="checkbox" checked={frame.showCameraIsland ?? false} onChange={(e) => updateFrame({ showCameraIsland: e.target.checked })} className="accent-indigo-500" />
                Show Dynamic Island notch
              </label>
            )}
          </div>
        )}
      </Section>

      {/* Canvas */}
      <Section title="Canvas & Ratio" icon={Sliders}>
        <div>
          <Label>Aspect Ratio</Label>
          <div className="flex flex-wrap gap-1.5">
            {ASPECT_RATIOS.map(({ ratio, label }) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  canvas.aspectRatio === ratio
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <SliderControl label="Inner Padding" value={screenshot.padding} min={0} max={120} step={4} onChange={(v) => updateScreenshot({ padding: v })} />
        <SliderControl label="Outer Padding" value={screenshot.outerPadding} min={0} max={120} step={4} onChange={(v) => updateScreenshot({ outerPadding: v })} />
        <SliderControl label="Corner Radius" value={screenshot.radius} min={0} max={32} onChange={(v) => updateScreenshot({ radius: v })} />
      </Section>

      {/* Background */}
      <Section title="Backdrop & Glow" icon={Palette}>
        <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {(['preset', 'solid'] as BackgroundType[]).map((t) => (
            <button
              key={t}
              onClick={() => setBackgroundType(t)}
              className={`flex-1 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                background.type === t ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {background.type === 'preset' && (
          <div className="grid grid-cols-3 gap-2 pt-1">
            {Object.entries(BACKGROUND_PRESETS).map(([id, p]) => (
              <button
                key={id}
                onClick={() => setBackgroundPreset(id as BackgroundPreset)}
                title={p.label}
                style={{ background: p.css }}
                className={`h-9 rounded-lg transition-transform hover:scale-105 flex items-end p-1 ${
                  background.preset === id ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950' : 'border border-white/10'
                }`}
              >
                <span className="text-[9px] font-medium text-white/90 truncate drop-shadow">{p.label}</span>
              </button>
            ))}
          </div>
        )}

        {background.type === 'solid' && (
          <div className="space-y-2">
            <Label>Backdrop Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={background.color}
                onChange={(e) => updateBackground({ color: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
              />
              <input
                type="text"
                value={background.color}
                onChange={(e) => updateBackground({ color: e.target.value })}
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-300"
              />
            </div>
          </div>
        )}
      </Section>

      {/* Shadow & Effects */}
      <Section title="Depth & Shadow" icon={ImageIcon}>
        <SliderControl label="Shadow Blur" value={screenshot.shadowBlur} min={0} max={64} onChange={(v) => updateScreenshot({ shadowBlur: v })} />
        <SliderControl label="Shadow Distance" value={screenshot.shadowDistance} min={0} max={64} onChange={(v) => updateScreenshot({ shadowDistance: v })} />
        <SliderControl label="Shadow Strength (%)" value={Math.round(screenshot.shadowStrength * 100)} min={0} max={100} onChange={(v) => updateScreenshot({ shadowStrength: v / 100 })} />
      </Section>

      {/* Export Settings */}
      <Section title="Export Format" icon={Download}>
        <div className="space-y-3">
          <div>
            <Label>Resolution Scale</Label>
            <div className="flex gap-1.5">
              {([1, 2, 3] as ExportScale[]).map((s) => (
                <button
                  key={s}
                  onClick={() => updateExport({ scale: s })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    exp.scale === s ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {s}x {s === 2 ? '(Retina)' : s === 3 ? '(Ultra)' : ''}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Format</Label>
            <div className="flex gap-1.5">
              {(['png', 'jpeg', 'webp'] as ExportFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => updateExport({ format: f })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg uppercase transition-all ${
                    exp.format === f ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </aside>
  )
}
