'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/contexts/UserContext'
import { getExerciseCompletion } from '@/lib/supabase'
import { EXERCISES } from '@/types'

export default function DashboardPage() {
  const { user, userName, partner, partnerName } = useUser()
  const [myCompleted, setMyCompleted] = useState<Record<string, boolean>>({})
  const [partnerCompleted, setPartnerCompleted] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!user) return
    getExerciseCompletion(user).then(setMyCompleted)
    if (partner) getExerciseCompletion(partner).then(setPartnerCompleted)
  }, [user, partner])

  const completedCount = Object.keys(myCompleted).length
  const partnerCompletedCount = Object.keys(partnerCompleted).length
  const nextExercise = EXERCISES.find(ex => !myCompleted[ex.id])

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-4xl mb-4 text-teal-500">✦</div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-3">Your Dashboard</h1>
        <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-sm">Select your name in the sidebar to see your progress.</p>
        <p className="text-sm text-teal-600">← Use the sidebar to get started</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-100 mb-2">Welcome, {userName}.</h1>
        <p className="text-gray-500 dark:text-slate-400 leading-relaxed">
          You're working through <em>Designing Your Life</em> together with {partnerName}. Each exercise builds on the last — take your time with each one before moving on.
        </p>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">{userName}'s progress</p>
          <p className="text-3xl font-semibold text-teal-600 mb-1">
            {completedCount}<span className="text-lg text-gray-300 dark:text-slate-600"> / {EXERCISES.length}</span>
          </p>
          <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${(completedCount / EXERCISES.length) * 100}%` }} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-2">{partnerName}'s progress</p>
          <p className="text-3xl font-semibold text-gray-400 dark:text-slate-500 mb-1">
            {partnerCompletedCount}<span className="text-lg text-gray-300 dark:text-slate-600"> / {EXERCISES.length}</span>
          </p>
          <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gray-300 dark:bg-slate-600 rounded-full transition-all" style={{ width: `${(partnerCompletedCount / EXERCISES.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Next up */}
      {nextExercise && (
        <div className="bg-teal-600 text-white rounded-2xl p-6 mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-teal-100 text-sm mb-1">{completedCount === 0 ? 'Start here' : 'Continue where you left off'}</p>
            <h2 className="font-semibold text-lg">{nextExercise.title}</h2>
            <p className="text-teal-200 text-sm mt-1">{nextExercise.description}</p>
          </div>
          <Link
            href={`/exercise/${nextExercise.slug}`}
            className="bg-white text-teal-700 px-5 py-2 rounded-xl font-medium text-sm hover:bg-teal-50 transition-colors shrink-0"
          >
            {completedCount === 0 ? 'Begin →' : 'Resume →'}
          </Link>
        </div>
      )}

      {completedCount === EXERCISES.length && (
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40 rounded-2xl p-6 mb-8 text-center">
          <p className="text-2xl mb-2">✦</p>
          <p className="font-semibold text-teal-800 dark:text-teal-300 mb-1">You've completed all 8 exercises.</p>
          <p className="text-sm text-teal-600 dark:text-teal-400">Go back to any exercise to revisit or update your responses as your thinking evolves.</p>
        </div>
      )}

      {/* All exercises */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-4">All Exercises</h2>
        <div className="space-y-3">
          {EXERCISES.map(ex => {
            const myDone = myCompleted[ex.id]
            const partnerDone = partnerCompleted[ex.id]
            const bothDone = myDone && partnerDone

            return (
              <Link
                key={ex.id}
                href={`/exercise/${ex.slug}`}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 flex items-center gap-4 hover:border-teal-200 dark:hover:border-teal-700 hover:shadow-sm transition-all block"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                  bothDone ? 'bg-teal-500 text-white' : myDone ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300' : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500'
                }`}>
                  {bothDone ? '✓' : ex.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-slate-100 text-sm">{ex.title}</h3>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{ex.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {[{ name: userName, done: myDone }, { name: partnerName, done: partnerDone }].map(p => (
                    <div key={p.name} className="text-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        p.done ? 'bg-teal-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500'
                      }`}>
                        {p.done ? '✓' : p.name.slice(0, 1)}
                      </div>
                    </div>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
