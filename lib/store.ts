import {
  EditorState,
  FrameType,
  AspectRatio,
  BackgroundPreset,
  BackgroundType,
} from '@/types/editor'
import { create } from 'zustand'

const ASPECT_RATIOS: Record<AspectRatio, { width: number; height: number }> = {
  '16:9': { width: 1920, height: 1080 },
  '4:3': { width: 1600, height: 1200 },
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
  '9:16': { width: 1080, height: 1920 },
  custom: { width: 1200, height: 800 },
}

const defaultState: EditorState = {
  image: null,
  frame: {
    type: 'browser-macos',
    url: 'https://example.com',
    showNavControls: true,
    topBarHeight: 40,
    radius: 12,
    borderWidth: 0,
    borderColor: '#000000',
    shadowStrength: 60,
  },
  canvas: {
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
  },
  background: {
    type: 'preset',
    color: '#1a1a2e',
    gradientColor1: '#667eea',
    gradientColor2: '#764ba2',
    gradientAngle: 135,
    preset: 'midnight',
    noise: false,
  },
  screenshot: {
    scale: 0.75,
    x: 0,
    y: 0,
    padding: 0,
    outerPadding: 60,
    radius: 8,
    borderWidth: 0,
    borderColor: '#ffffff',
    shadowStrength: 40,
    shadowBlur: 60,
    shadowDistance: 20,
    rotation: 0,
  },
  export: {
    format: 'png',
    scale: 2,
  },
}

type EditorStore = {
  state: EditorState
  past: EditorState[]
  future: EditorState[]
  setImage: (image: EditorState['image']) => void
  setFrameType: (type: FrameType) => void
  updateFrame: (partial: Partial<EditorState['frame']>) => void
  setAspectRatio: (ratio: AspectRatio) => void
  updateCanvas: (partial: Partial<EditorState['canvas']>) => void
  setBackgroundType: (type: BackgroundType) => void
  setBackgroundPreset: (preset: BackgroundPreset) => void
  updateBackground: (partial: Partial<EditorState['background']>) => void
  updateScreenshot: (partial: Partial<EditorState['screenshot']>) => void
  updateExport: (partial: Partial<EditorState['export']>) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  pushHistory: () => void
  reset: () => void
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  state: defaultState,
  past: [],
  future: [],

  pushHistory: () => {
    const { state, past } = get()
    set({
      past: [...past.slice(-49), state],
      future: [],
    })
  },

  setImage: (image) => {
    get().pushHistory()
    set((s) => ({ state: { ...s.state, image } }))
  },

  setFrameType: (type) => {
    get().pushHistory()
    set((s) => ({
      state: {
        ...s.state,
        frame: { ...defaultState.frame, type },
      },
    }))
  },

  updateFrame: (partial) => {
    get().pushHistory()
    set((s) => ({
      state: { ...s.state, frame: { ...s.state.frame, ...partial } },
    }))
  },

  setAspectRatio: (ratio) => {
    get().pushHistory()
    const dims = ASPECT_RATIOS[ratio]
    set((s) => ({
      state: {
        ...s.state,
        canvas: { ...s.state.canvas, aspectRatio: ratio, ...dims },
      },
    }))
  },

  updateCanvas: (partial) => {
    set((s) => ({
      state: { ...s.state, canvas: { ...s.state.canvas, ...partial } },
    }))
  },

  setBackgroundType: (type) => {
    get().pushHistory()
    set((s) => ({
      state: { ...s.state, background: { ...s.state.background, type, preset: null } },
    }))
  },

  setBackgroundPreset: (preset) => {
    get().pushHistory()
    set((s) => ({
      state: {
        ...s.state,
        background: { ...s.state.background, type: 'preset', preset },
      },
    }))
  },

  updateBackground: (partial) => {
    get().pushHistory()
    set((s) => ({
      state: { ...s.state, background: { ...s.state.background, ...partial } },
    }))
  },

  updateScreenshot: (partial) => {
    set((s) => ({
      state: {
        ...s.state,
        screenshot: { ...s.state.screenshot, ...partial },
      },
    }))
  },

  updateExport: (partial) => {
    set((s) => ({
      state: { ...s.state, export: { ...s.state.export, ...partial } },
    }))
  },

  undo: () => {
    const { past, state, future } = get()
    if (past.length === 0) return
    const previous = past[past.length - 1]
    set({
      past: past.slice(0, -1),
      state: previous,
      future: [state, ...future.slice(0, 49)],
    })
  },

  redo: () => {
    const { future, state, past } = get()
    if (future.length === 0) return
    const next = future[0]
    set({
      past: [...past.slice(-49), state],
      state: next,
      future: future.slice(1),
    })
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  reset: () => {
    set({ state: defaultState, past: [], future: [] })
  },
}))
