'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/contexts/UserContext'
import { getExerciseCompletion } from '@/lib/supabase'
import { EXERCISES } from '@/types'

export default function HomePage() {
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
      <div className="max-w-xl mx-auto py-8">
        <div className="text-center mb-10">
          <div className="text-4xl mb-5">✦</div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">Designing Our Life</h1>
          <p className="text-gray-500 leading-relaxed">
            A shared workbook for Nick & Elise, built around <em>Designing Your Life</em> by Bill Burnett & Dave Evans.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <p className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2">What this is</p>
          <p className="text-gray-700 leading-relaxed mb-3">
            Life design is the practice of applying design thinking — curiosity, prototyping, iteration — to the question of how you want to live. The book argues that there's no one "right" life waiting to be found. There are many possible good lives, and your job is to design one intentionally rather than let it happen by default.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This app walks you through all 8 exercises from the book, saves your responses, and lets you see each other's work when you're both ready. You don't have to do the exercises in one sitting — come back whenever you have time.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">The 8 exercises</p>
          <div className="space-y-3">
            {EXERCISES.map(ex => (
              <div key={ex.id} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {ex.number}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{ex.title}</p>
                  <p className="text-xs text-gray-400">{ex.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">To get started, select your name in the sidebar.</p>
          <p className="text-xs text-teal-600">← tap the menu icon if you're on mobile</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome, {userName}.</h1>
        <p className="text-gray-500 leading-relaxed">
          You're working through <em>Designing Your Life</em> together with {partnerName}. Each exercise builds on the last — take your time with each one before moving on.
        </p>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{userName}'s progress</p>
          <p className="text-3xl font-semibold text-teal-600 mb-1">{completedCount}<span className="text-lg text-gray-300"> / {EXERCISES.length}</span></p>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${(completedCount / EXERCISES.length) * 100}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{partnerName}'s progress</p>
          <p className="text-3xl font-semibold text-gray-400 mb-1">{partnerCompletedCount}<span className="text-lg text-gray-300"> / {EXERCISES.length}</span></p>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gray-300 rounded-full transition-all" style={{ width: `${(partnerCompletedCount / EXERCISES.length) * 100}%` }} />
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
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 mb-8 text-center">
          <p className="text-2xl mb-2">✦</p>
          <p className="font-semibold text-teal-800 mb-1">You've completed all 8 exercises.</p>
          <p className="text-sm text-teal-600">Go back to any exercise to revisit or update your responses as your thinking evolves.</p>
        </div>
      )}

      {/* All exercises */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">All Exercises</h2>
        <div className="space-y-3">
          {EXERCISES.map(ex => {
            const myDone = myCompleted[ex.id]
            const partnerDone = partnerCompleted[ex.id]
            const bothDone = myDone && partnerDone

            return (
              <Link
                key={ex.id}
                href={`/exercise/${ex.slug}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:border-teal-200 hover:shadow-sm transition-all block"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                  bothDone ? 'bg-teal-500 text-white' : myDone ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  {bothDone ? '✓' : ex.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm">{ex.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{ex.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {[{ name: userName, done: myDone }, { name: partnerName, done: partnerDone }].map(p => (
                    <div key={p.name} className="text-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${p.done ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
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
