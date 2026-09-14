import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SnapFrame — Screenshot & Device Mockup Generator',
  description:
    'Turn screenshots into polished product images. Add device frames, beautiful backgrounds, and export at high resolution. Free, private, browser-based.',
  keywords: ['screenshot', 'mockup', 'device frame', 'product image', 'browser tool'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'SnapFrame — Screenshot & Device Mockup Generator',
    description: 'Turn screenshots into polished product showcase mockups instantly.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-[#0b0f19] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200`}>
        {children}
      </body>
    </html>
  )
}
