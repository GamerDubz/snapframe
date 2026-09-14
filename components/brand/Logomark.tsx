type LogomarkProps = {
  className?: string
  title?: string
}

/**
 * Original brand mark: two pairs of corner crop-marks (as used to indicate
 * where a print is trimmed) framing a single rotated aperture square.
 * Renders with `currentColor` so it can be tinted via CSS `color`.
 */
export default function Logomark({ className, title }: LogomarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M4 14V4H14"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 4H36V14"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 36H4V26"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 26V36H26"
        stroke="currentColor"
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
        fill="currentColor"
      />
    </svg>
  )
}
