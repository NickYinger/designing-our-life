import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'
import Sidebar from '@/components/Sidebar'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Designing Our Life',
  description: 'A shared life design journey for Nick & Elise',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="min-h-screen bg-gray-50">
        <UserProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 md:px-8 pt-20 md:pt-10 pb-10">
                {children}
              </div>
            </main>
          </div>
        </UserProvider>
      </body>
    </html>
  )
}
