import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SnapFrame — Screenshot & Device Mockup Generator',
  description:
    'Turn screenshots into polished product images. Add device frames, beautiful backgrounds, and export at high resolution. Free, private, browser-based.',
  keywords: ['screenshot', 'mockup', 'device frame', 'product image', 'browser tool'],
  openGraph: {
    title: 'SnapFrame',
    description: 'Premium screenshot & device mockup generator — free, private, browser-based.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-[#0f0f0f] text-neutral-100 antialiased`}>
        {children}
      </body>
    </html>
  )
}
