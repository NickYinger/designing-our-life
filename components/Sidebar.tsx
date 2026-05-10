'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { EXERCISES } from '@/types'
import { getExerciseCompletion } from '@/lib/supabase'
import UserPicker from './UserPicker'

export default function Sidebar() {
  const pathname = usePathname()
  const { user, userName } = useUser()
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    getExerciseCompletion(user).then(setCompleted)
  }, [user, pathname])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const completedCount = Object.keys(completed).length

  const navContent = (
    <>
      <div className="px-5 pt-6 pb-4 border-b border-gray-100">
        <Link href="/" className="block">
          <h1 className="text-base font-semibold text-gray-900 leading-tight">Designing Our Life</h1>
          <p className="text-xs text-teal-600 mt-0.5">Nick & Elise</p>
        </Link>
      </div>

      <div className="px-4 py-3 border-b border-gray-100">
        <UserPicker />
      </div>

      {user && (
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{userName}'s progress</span>
            <span>{completedCount} / {EXERCISES.length}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all"
              style={{ width: `${(completedCount / EXERCISES.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-3 space-y-0.5">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
            pathname === '/'
              ? 'bg-teal-50 text-teal-700 font-medium'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-base">🏠</span>
          <span>Dashboard</span>
        </Link>

        <div className="pt-2 pb-1 px-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Exercises</span>
        </div>

        {EXERCISES.map((ex) => {
          const href = `/exercise/${ex.slug}`
          const active = pathname === href
          const done = completed[ex.id]

          return (
            <Link
              key={ex.id}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                active
                  ? 'bg-teal-50 text-teal-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                done
                  ? 'bg-teal-500 text-white'
                  : active
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {done ? '✓' : ex.number}
              </span>
              <span className="leading-tight">{ex.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-5 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 italic">Based on "Designing Your Life" by Burnett & Evans</p>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <Link href="/">
          <h1 className="text-sm font-semibold text-gray-900">Designing Our Life</h1>
          <p className="text-xs text-teal-600">Nick & Elise</p>
        </Link>
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <aside
            className="absolute top-0 left-0 h-full w-72 bg-white flex flex-col overflow-y-auto shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {navContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 h-screen sticky top-0 flex-col bg-white border-r border-gray-100 overflow-y-auto">
        {navContent}
      </aside>
    </>
  )
}
