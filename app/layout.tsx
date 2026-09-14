import type { Metadata } from 'next'
import { Fraunces, Archivo } from 'next/font/google'
import './globals.css'

const displayFont = Fraunces({
  subsets: ['latin'],
  variable: '--font-display-raw',
  axes: ['opsz', 'SOFT', 'WONK'],
})

const sansFont = Archivo({
  subsets: ['latin'],
  variable: '--font-sans-raw',
})

export const metadata: Metadata = {
  title: 'Snapframe — Screenshot & Device Mockup Studio',
  description:
    'Turn screenshots into polished product images. Add device frames, beautiful backgrounds, and export at high resolution. Free, private, browser-based.',
  keywords: ['screenshot', 'mockup', 'device frame', 'product image', 'browser tool'],
  openGraph: {
    title: 'Snapframe',
    description: 'A darkroom for your screenshots — free, private, browser-based.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${displayFont.variable} ${sansFont.variable}`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}
