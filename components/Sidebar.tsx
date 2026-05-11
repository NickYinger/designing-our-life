'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useTheme } from '@/contexts/ThemeContext'
import { EXERCISES } from '@/types'
import { getExerciseCompletion } from '@/lib/supabase'
import UserPicker from './UserPicker'

export default function Sidebar() {
  const pathname = usePathname()
  const { user, userName } = useUser()
  const { theme, toggle } = useTheme()
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
      <div className="px-5 pt-6 pb-4 border-b border-gray-100 dark:border-slate-700">
        <Link href="/" className="block">
          <h1 className="text-base font-semibold text-gray-900 dark:text-slate-100 leading-tight">Designing Our Life</h1>
          <p className="text-xs text-teal-600 mt-0.5">Nick & Elise</p>
        </Link>
      </div>

      <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
        <UserPicker />
      </div>

      {user && (
        <div className="px-5 py-3 border-b border-gray-100 dark:border-slate-700">
          <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-1.5">
            <span>{userName}'s progress</span>
            <span>{completedCount} / {EXERCISES.length}</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
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
              ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-medium'
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
          }`}
        >
          <span className="text-base">✦</span>
          <span>Home</span>
        </Link>

        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
            pathname === '/dashboard'
              ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-medium'
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
          }`}
        >
          <span className="text-base">🏠</span>
          <span>Dashboard</span>
        </Link>

        <div className="pt-2 pb-1 px-3">
          <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Exercises</span>
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
                  ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-medium'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                done
                  ? 'bg-teal-500 text-white'
                  : active
                  ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
              }`}>
                {done ? '✓' : ex.number}
              </span>
              <span className="leading-tight">{ex.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
        <p className="text-xs text-gray-400 dark:text-slate-500 italic">Burnett & Evans</p>
        <button
          onClick={toggle}
          className="p-1.5 rounded-lg text-gray-400 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
        <Link href="/">
          <h1 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Designing Our Life</h1>
          <p className="text-xs text-teal-600">Nick & Elise</p>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-xl text-gray-400 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="p-2 rounded-xl text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
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
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
          <aside
            className="absolute top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 flex flex-col overflow-y-auto shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {navContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 h-screen sticky top-0 flex-col bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-700 overflow-y-auto">
        {navContent}
      </aside>
    </>
  )
}
