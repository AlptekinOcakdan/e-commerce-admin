import { ClerkProvider } from '@clerk/nextjs'
import { isClerkEnabled } from '@/lib/auth'
import { Inter } from 'next/font/google'

import { ModalProvider } from '@/providers/modal-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dashboard',
  description: 'E-Commerce Dashboard',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const content = (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <ToastProvider />
        <ModalProvider />
        {children}
      </ThemeProvider>
  )

  // Clerk Core 3 requires ClerkProvider inside <body>
  return (
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          {isClerkEnabled ? <ClerkProvider afterSignOutUrl="/">{content}</ClerkProvider> : content}
        </body>
      </html>
  )
}
