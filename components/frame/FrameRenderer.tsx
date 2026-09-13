'use client'

import { ImageAsset, FrameSettings, ScreenshotSettings } from '@/types/editor'

type Props = {
  image: ImageAsset
  frame: FrameSettings
  screenshot: ScreenshotSettings
  scaleFactor: number
}

export default function FrameRenderer({ image, frame, screenshot, scaleFactor }: Props) {
  const s = screenshot
  const sf = scaleFactor

  const imgStyle: React.CSSProperties = {
    display: 'block',
    maxWidth: '100%',
    width: `${s.scale * 100}%`,
    borderRadius: `${s.radius * sf}px`,
    boxShadow:
      s.shadowStrength > 0
        ? `0 ${s.shadowDistance * sf}px ${s.shadowBlur * sf}px rgba(0,0,0,${s.shadowStrength / 100})`
        : 'none',
    border: s.borderWidth > 0 ? `${s.borderWidth * sf}px solid ${s.borderColor}` : 'none',
    transform: s.rotation !== 0 ? `rotate(${s.rotation}deg)` : undefined,
    translate: `${s.x * sf}px ${s.y * sf}px`,
  }

  if (frame.type === 'frameless') {
    return <img src={image.src} alt="Screenshot" style={imgStyle} />
  }

  if (frame.type === 'browser-macos') {
    const barH = (frame.topBarHeight ?? 40) * sf
    return (
      <div
        style={{
          borderRadius: `${10 * sf}px`,
          overflow: 'hidden',
          boxShadow: `0 ${20 * sf}px ${60 * sf}px rgba(0,0,0,0.4)`,
          width: `${s.scale * 100}%`,
          translate: `${s.x * sf}px ${s.y * sf}px`,
          transform: s.rotation !== 0 ? `rotate(${s.rotation}deg)` : undefined,
        }}
      >
        {/* macOS title bar */}
        <div
          style={{
            height: `${barH}px`,
            background: '#2d2d2d',
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${12 * sf}px`,
            gap: `${8 * sf}px`,
          }}
        >
          {/* Traffic lights */}
          {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
            <div
              key={i}
              style={{
                width: `${10 * sf}px`,
                height: `${10 * sf}px`,
                borderRadius: '50%',
                background: c,
              }}
            />
          ))}
          {/* URL bar */}
          {frame.showNavControls && (
            <div
              style={{
                flex: 1,
                height: `${22 * sf}px`,
                background: '#1a1a1a',
                borderRadius: `${4 * sf}px`,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: `${8 * sf}px`,
                marginLeft: `${8 * sf}px`,
              }}
            >
              <span
                style={{
                  color: '#888',
                  fontSize: `${11 * sf}px`,
                  fontFamily: '-apple-system, system-ui, sans-serif',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {frame.url || 'https://example.com'}
              </span>
            </div>
          )}
        </div>
        <img src={image.src} alt="Screenshot" style={{ display: 'block', width: '100%' }} />
      </div>
    )
  }

  if (frame.type === 'browser-minimal') {
    const barH = (frame.topBarHeight ?? 36) * sf
    return (
      <div
        style={{
          borderRadius: `${8 * sf}px`,
          overflow: 'hidden',
          boxShadow: `0 ${16 * sf}px ${48 * sf}px rgba(0,0,0,0.35)`,
          width: `${s.scale * 100}%`,
          translate: `${s.x * sf}px ${s.y * sf}px`,
          transform: s.rotation !== 0 ? `rotate(${s.rotation}deg)` : undefined,
        }}
      >
        <div
          style={{
            height: `${barH}px`,
            background: '#f5f5f5',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${10 * sf}px`,
            gap: `${6 * sf}px`,
          }}
        >
          <div style={{ display: 'flex', gap: `${4 * sf}px` }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: `${8 * sf}px`,
                  height: `${8 * sf}px`,
                  borderRadius: '50%',
                  background: '#d0d0d0',
                }}
              />
            ))}
          </div>
          <div
            style={{
              flex: 1,
              height: `${20 * sf}px`,
              background: '#e8e8e8',
              borderRadius: `${4 * sf}px`,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: `${8 * sf}px`,
            }}
          >
            <span style={{ color: '#888', fontSize: `${11 * sf}px`, fontFamily: 'system-ui' }}>
              {frame.url || 'https://example.com'}
            </span>
          </div>
        </div>
        <img src={image.src} alt="Screenshot" style={{ display: 'block', width: '100%' }} />
      </div>
    )
  }

  if (frame.type === 'browser-dark') {
    const barH = (frame.topBarHeight ?? 38) * sf
    return (
      <div
        style={{
          borderRadius: `${8 * sf}px`,
          overflow: 'hidden',
          boxShadow: `0 ${20 * sf}px ${60 * sf}px rgba(0,0,0,0.5)`,
          width: `${s.scale * 100}%`,
          translate: `${s.x * sf}px ${s.y * sf}px`,
          transform: s.rotation !== 0 ? `rotate(${s.rotation}deg)` : undefined,
        }}
      >
        <div
          style={{
            height: `${barH}px`,
            background: '#1e1e1e',
            borderBottom: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${12 * sf}px`,
            gap: `${6 * sf}px`,
          }}
        >
          {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
            <div
              key={i}
              style={{ width: `${9 * sf}px`, height: `${9 * sf}px`, borderRadius: '50%', background: c }}
            />
          ))}
          <div
            style={{
              flex: 1,
              height: `${22 * sf}px`,
              background: '#2d2d2d',
              borderRadius: `${4 * sf}px`,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: `${8 * sf}px`,
              marginLeft: `${6 * sf}px`,
            }}
          >
            <span style={{ color: '#666', fontSize: `${11 * sf}px`, fontFamily: 'system-ui' }}>
              {frame.url || 'https://example.com'}
            </span>
          </div>
        </div>
        <img src={image.src} alt="Screenshot" style={{ display: 'block', width: '100%' }} />
      </div>
    )
  }

  if (frame.type === 'phone-ios' || frame.type === 'phone-android') {
    const isIOS = frame.type === 'phone-ios'
    const thickness = (frame.frameThickness ?? 12) * sf
    const deviceColor = frame.deviceColor ?? '#1a1a1a'
    const r = isIOS ? 44 * sf : 28 * sf

    return (
      <div
        style={{
          background: deviceColor,
          borderRadius: `${r}px`,
          padding: `${thickness}px`,
          boxShadow: `0 ${24 * sf}px ${80 * sf}px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)`,
          width: `${s.scale * 100}%`,
          translate: `${s.x * sf}px ${s.y * sf}px`,
          transform: s.rotation !== 0 ? `rotate(${s.rotation}deg)` : undefined,
        }}
      >
        {/* Camera notch / island */}
        {frame.showCameraIsland && isIOS && (
          <div
            style={{
              width: `${60 * sf}px`,
              height: `${20 * sf}px`,
              background: '#000',
              borderRadius: `${10 * sf}px`,
              margin: `0 auto ${6 * sf}px`,
            }}
          />
        )}
        <div style={{ borderRadius: `${r * 0.7}px`, overflow: 'hidden' }}>
          <img src={image.src} alt="Screenshot" style={{ display: 'block', width: '100%' }} />
        </div>
      </div>
    )
  }

  if (frame.type === 'laptop') {
    return (
      <div
        style={{
          width: `${s.scale * 100}%`,
          translate: `${s.x * sf}px ${s.y * sf}px`,
          transform: s.rotation !== 0 ? `rotate(${s.rotation}deg)` : undefined,
        }}
      >
        {/* Screen */}
        <div
          style={{
            background: '#1a1a1a',
            borderRadius: `${8 * sf}px ${8 * sf}px 0 0`,
            padding: `${6 * sf}px`,
            boxShadow: `0 ${12 * sf}px ${40 * sf}px rgba(0,0,0,0.4)`,
          }}
        >
          <div style={{ borderRadius: `${4 * sf}px`, overflow: 'hidden' }}>
            <img src={image.src} alt="Screenshot" style={{ display: 'block', width: '100%' }} />
          </div>
        </div>
        {/* Base */}
        <div
          style={{
            background: '#2a2a2a',
            height: `${12 * sf}px`,
            borderRadius: `0 0 ${4 * sf}px ${4 * sf}px`,
          }}
        />
        <div
          style={{
            background: '#222',
            height: `${4 * sf}px`,
            borderRadius: `0 0 ${20 * sf}px ${20 * sf}px`,
            marginTop: `${1 * sf}px`,
            width: '120%',
            marginLeft: '-10%',
          }}
        />
      </div>
    )
  }

  return <img src={image.src} alt="Screenshot" style={imgStyle} />
}
