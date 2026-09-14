import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#211c17',
        }}
      >
        <svg width="126" height="126" viewBox="0 0 40 40" fill="none">
          <path
            d="M9 17V9H17"
            stroke="#faf7f2"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 9H31V17"
            stroke="#faf7f2"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 31H9V23"
            stroke="#faf7f2"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M31 23V31H23"
            stroke="#faf7f2"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="16.7"
            y="16.7"
            width="6.6"
            height="6.6"
            transform="rotate(45 20 20)"
            fill="#b3492b"
          />
        </svg>
      </div>
    ),
    { ...size }
  )
}
