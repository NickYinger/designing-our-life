'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon, ChevronUpIcon, BookOpenIcon } from '@heroicons/react/24/outline'

interface Props {
  children: React.ReactNode
  id?: string
}

export default function ReadingSection({ children, id }: Props) {
  const storageKey = id ? `reading_open_${id}` : null
  const [open, setOpen] = useState(true)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (storageKey) {
      const stored = localStorage.getItem(storageKey)
      if (stored !== null) setOpen(stored === 'true')
    }
    setHydrated(true)
  }, [storageKey])

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (storageKey) localStorage.setItem(storageKey, String(next))
  }

  if (!hydrated) return null

  return (
    <div className="mb-8 border border-teal-100 rounded-2xl overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-6 py-4 bg-teal-50 hover:bg-teal-100 transition-colors"
      >
        <div className="flex items-center gap-2 text-teal-700 font-medium">
          <BookOpenIcon className="w-5 h-5" />
          <span>Background Reading</span>
        </div>
        {open ? (
          <ChevronUpIcon className="w-4 h-4 text-teal-600" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 text-teal-600" />
        )}
      </button>
      {open && (
        <div className="px-6 py-5 prose prose-sm max-w-none text-gray-600 leading-relaxed bg-white">
          {children}
        </div>
      )}
    </div>
  )
}
