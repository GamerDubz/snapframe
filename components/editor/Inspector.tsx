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

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 min-h-11 text-[13px] font-medium text-ink hover:text-accent transition-colors"
        aria-expanded={open}
      >
        <span className="font-display italic">{title}</span>
        <span className="flex-1 h-px bg-line" aria-hidden="true" />
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        )}
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-medium uppercase tracking-wider text-ink-faint mb-1.5">
      {children}
    </label>
  )
}

function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">{label}</span>
        <span className="text-xs text-accent tabular-nums font-medium">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        aria-label={label}
      />
    </div>
  )
}

function ChoiceButton({
  active,
  onClick,
  children,
  className = '',
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`min-h-9 px-2.5 text-xs font-medium rounded-sm border transition-colors ${
        active
          ? 'bg-accent-soft border-accent text-accent'
          : 'bg-paper-raised border-line text-ink-soft hover:border-line-strong hover:text-ink'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export default function Inspector() {
  const {
    state,
    setFrameType,
    updateFrame,
    setAspectRatio,
    setBackgroundType,
    setBackgroundPreset,
    updateBackground,
    updateScreenshot,
    updateExport,
  } = useEditorStore()
  const { frame, canvas, background, screenshot, export: exp } = state

  return (
    <aside
      className="w-[280px] shrink-0 border-r border-line bg-paper-raised overflow-y-auto flex flex-col"
      aria-label="Inspector"
    >
      {/* Frame */}
      <Section title="Frame">
        <div className="flex flex-col">
          {FRAMES.map(({ type, label }, i) => {
            const active = frame.type === type
            return (
              <button
                key={type}
                onClick={() => setFrameType(type)}
                className={`text-left flex items-center gap-3 pl-3 pr-2 min-h-10 border-l-2 transition-colors ${
                  active
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-transparent text-ink-soft hover:text-ink hover:bg-paper-sunken'
                }`}
              >
                <span className="text-[10px] tabular-nums text-ink-faint w-4">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[13px]">{label}</span>
              </button>
            )
          })}
        </div>

        {/* Frame-specific controls */}
        {(frame.type === 'browser-macos' || frame.type === 'browser-minimal' || frame.type === 'browser-dark') && (
          <div className="space-y-4 pt-4 border-t border-line">
            <div>
              <Label>URL</Label>
              <input
                type="text"
                value={frame.url ?? ''}
                onChange={(e) => updateFrame({ url: e.target.value })}
                placeholder="https://example.com"
                className="w-full bg-paper-sunken border border-line rounded-sm px-2.5 py-2 text-[13px] text-ink outline-none focus:border-accent"
              />
            </div>
            <label className="flex items-center gap-2 text-[13px] text-ink-soft cursor-pointer">
              <input
                type="checkbox"
                checked={frame.showNavControls ?? true}
                onChange={(e) => updateFrame({ showNavControls: e.target.checked })}
              />
              Show navigation controls
            </label>
          </div>
        )}

        {(frame.type === 'phone-ios' || frame.type === 'phone-android') && (
          <div className="space-y-4 pt-4 border-t border-line">
            <SliderControl
              label="Frame thickness"
              value={frame.frameThickness ?? 12}
              min={6}
              max={24}
              onChange={(v) => updateFrame({ frameThickness: v })}
            />
            <div>
              <Label>Device color</Label>
              <input
                type="color"
                value={frame.deviceColor ?? '#1a1a1a'}
                onChange={(e) => updateFrame({ deviceColor: e.target.value })}
                className="w-full h-9 cursor-pointer rounded-sm"
              />
            </div>
            {frame.type === 'phone-ios' && (
              <label className="flex items-center gap-2 text-[13px] text-ink-soft cursor-pointer">
                <input
                  type="checkbox"
                  checked={frame.showCameraIsland ?? false}
                  onChange={(e) => updateFrame({ showCameraIsland: e.target.checked })}
                />
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
            <ChoiceButton key={ratio} active={canvas.aspectRatio === ratio} onClick={() => setAspectRatio(ratio)}>
              {label}
            </ChoiceButton>
          ))}
        </div>
        <div className="text-xs text-ink-faint tabular-nums">
          {canvas.width} × {canvas.height}px
        </div>
      </Section>

      {/* Background */}
      <Section title="Background">
        <div className="grid grid-cols-4 gap-1.5">
          {(['solid', 'linear', 'radial', 'preset'] as BackgroundType[]).map((t) => (
            <ChoiceButton
              key={t}
              active={background.type === t && background.preset === null}
              onClick={() => setBackgroundType(t)}
              className="capitalize"
            >
              {t}
            </ChoiceButton>
          ))}
        </div>

        {background.type === 'solid' && (
          <div>
            <Label>Color</Label>
            <input
              type="color"
              value={background.color}
              onChange={(e) => updateBackground({ color: e.target.value })}
              className="w-full h-9 cursor-pointer rounded-sm"
            />
          </div>
        )}

        {(background.type === 'linear' || background.type === 'radial') && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Color 1</Label>
                <input
                  type="color"
                  value={background.gradientColor1}
                  onChange={(e) => updateBackground({ gradientColor1: e.target.value })}
                  className="w-full h-9 cursor-pointer rounded-sm"
                />
              </div>
              <div>
                <Label>Color 2</Label>
                <input
                  type="color"
                  value={background.gradientColor2}
                  onChange={(e) => updateBackground({ gradientColor2: e.target.value })}
                  className="w-full h-9 cursor-pointer rounded-sm"
                />
              </div>
            </div>
            {background.type === 'linear' && (
              <SliderControl
                label="Angle"
                value={background.gradientAngle}
                min={0}
                max={360}
                onChange={(v) => updateBackground({ gradientAngle: v })}
              />
            )}
          </>
        )}

        {background.type === 'preset' && (
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(BACKGROUND_PRESETS) as [BackgroundPreset, (typeof BACKGROUND_PRESETS)[BackgroundPreset]][]).map(
              ([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setBackgroundPreset(key)}
                  title={preset.label}
                  className={`h-11 rounded-sm transition-all ${
                    background.preset === key
                      ? 'ring-2 ring-accent ring-offset-2 ring-offset-paper-raised'
                      : 'hover:opacity-90'
                  }`}
                  style={{ background: preset.css }}
                  aria-label={preset.label}
                  aria-pressed={background.preset === key}
                />
              )
            )}
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
            <input
              type="color"
              value={screenshot.borderColor}
              onChange={(e) => updateScreenshot({ borderColor: e.target.value })}
              className="w-full h-9 cursor-pointer rounded-sm"
            />
          </div>
        )}
      </Section>

      {/* Export */}
      <Section title="Export" defaultOpen={false}>
        <div>
          <Label>Format</Label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['png', 'jpeg', 'webp'] as ExportFormat[]).map((f) => (
              <ChoiceButton key={f} active={exp.format === f} onClick={() => updateExport({ format: f })} className="uppercase">
                {f}
              </ChoiceButton>
            ))}
          </div>
        </div>
        <div>
          <Label>Scale</Label>
          <div className="grid grid-cols-3 gap-1.5">
            {([1, 2, 3] as ExportScale[]).map((s) => (
              <ChoiceButton key={s} active={exp.scale === s} onClick={() => updateExport({ scale: s })}>
                {s}×
              </ChoiceButton>
            ))}
          </div>
        </div>
      </Section>
    </aside>
  )
}
