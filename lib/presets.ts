import { BackgroundPreset, BackgroundSettings } from '@/types/editor'

export const BACKGROUND_PRESETS: Record<
  BackgroundPreset,
  { label: string; css: string; settings: Partial<BackgroundSettings> }
> = {
  aurora: {
    label: 'Aurora',
    css: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    settings: {
      type: 'linear',
      gradientColor1: '#0f2027',
      gradientColor2: '#2c5364',
      gradientAngle: 135,
    },
  },
  midnight: {
    label: 'Midnight',
    css: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
    settings: {
      type: 'linear',
      gradientColor1: '#1a1a2e',
      gradientColor2: '#0f3460',
      gradientAngle: 135,
    },
  },
  ocean: {
    label: 'Ocean',
    css: 'linear-gradient(135deg, #006994, #0099cc, #00bcd4)',
    settings: {
      type: 'linear',
      gradientColor1: '#006994',
      gradientColor2: '#00bcd4',
      gradientAngle: 135,
    },
  },
  citrus: {
    label: 'Citrus',
    css: 'linear-gradient(135deg, #f7971e, #ffd200)',
    settings: {
      type: 'linear',
      gradientColor1: '#f7971e',
      gradientColor2: '#ffd200',
      gradientAngle: 135,
    },
  },
  ember: {
    label: 'Ember',
    css: 'linear-gradient(135deg, #b91c1c, #f97316)',
    settings: {
      type: 'linear',
      gradientColor1: '#b91c1c',
      gradientColor2: '#f97316',
      gradientAngle: 135,
    },
  },
  lavender: {
    label: 'Lavender',
    css: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
    settings: {
      type: 'linear',
      gradientColor1: '#6366f1',
      gradientColor2: '#ec4899',
      gradientAngle: 135,
    },
  },
  ice: {
    label: 'Ice',
    css: 'linear-gradient(135deg, #e0f7fa, #b2ebf2, #e8f5e9)',
    settings: {
      type: 'linear',
      gradientColor1: '#e0f7fa',
      gradientColor2: '#e8f5e9',
      gradientAngle: 135,
    },
  },
  sunset: {
    label: 'Sunset',
    css: 'linear-gradient(135deg, #fc4a1a, #f7b733)',
    settings: {
      type: 'linear',
      gradientColor1: '#fc4a1a',
      gradientColor2: '#f7b733',
      gradientAngle: 135,
    },
  },
  mono: {
    label: 'Mono',
    css: 'linear-gradient(135deg, #1a1a1a, #3d3d3d)',
    settings: {
      type: 'linear',
      gradientColor1: '#1a1a1a',
      gradientColor2: '#3d3d3d',
      gradientAngle: 135,
    },
  },
}

export function getBackgroundCSS(settings: BackgroundSettings): string {
  if (settings.preset && settings.type === 'preset') {
    return BACKGROUND_PRESETS[settings.preset]?.css ?? settings.color
  }
  if (settings.type === 'solid') return settings.color
  if (settings.type === 'linear') {
    return `linear-gradient(${settings.gradientAngle}deg, ${settings.gradientColor1}, ${settings.gradientColor2})`
  }
  if (settings.type === 'radial') {
    return `radial-gradient(circle, ${settings.gradientColor1}, ${settings.gradientColor2})`
  }
  return settings.color
}
