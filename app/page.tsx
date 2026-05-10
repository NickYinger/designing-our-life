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

  const lastIncomplete = EXERCISES.find(ex => !myCompleted[ex.id])

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-5xl mb-4">✦</div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Designing Our Life</h1>
        <p className="text-gray-500 mb-8 max-w-sm">A shared journey through life design for Nick & Elise. Select who you are in the sidebar to get started.</p>
        <div className="text-sm text-teal-600">← Use the toggle in the sidebar</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-1">Welcome back, {userName}.</h1>
        <p className="text-gray-500">Here's where you and {partnerName} stand on your life design journey.</p>
      </div>

      {lastIncomplete && (
        <div className="bg-teal-600 text-white rounded-2xl p-6 mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-teal-100 text-sm mb-1">Continue where you left off</p>
            <h2 className="font-semibold text-lg">{lastIncomplete.title}</h2>
          </div>
          <Link
            href={`/exercise/${lastIncomplete.slug}`}
            className="bg-white text-teal-700 px-5 py-2 rounded-xl font-medium text-sm hover:bg-teal-50 transition-colors shrink-0"
          >
            Resume →
          </Link>
        </div>
      )}

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
                <div className="flex gap-3 shrink-0">
                  {[{ name: userName.slice(0,1), done: myDone }, { name: partnerName.slice(0,1), done: partnerDone }].map(p => (
                    <div key={p.name} className="text-center">
                      <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-medium ${p.done ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {p.done ? '✓' : p.name}
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
