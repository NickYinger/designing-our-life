'use client'

import Link from 'next/link'
import { EXERCISES } from '@/types'

const CONCEPTS = [
  {
    icon: '🧭',
    title: 'Curiosity over certainty',
    body: "Most people ask 'what do I want to be?' Life design asks something different: 'what engages and energizes me?' You don't need to find your passion. You need to get curious about what actually feels alive — and follow that signal.",
  },
  {
    icon: '🔀',
    title: 'Many possible good lives',
    body: "There is no single right path waiting to be discovered. There are many versions of a good life available to you. The goal isn't to find the correct one — it's to design one intentionally, rather than let it happen by default.",
  },
  {
    icon: '🛠',
    title: 'Design thinking for living',
    body: "Designers don't wait for perfect information before acting. They prototype: test small, learn fast, revise. Life design applies that same approach — prototype ideas for your future before committing to them.",
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="text-center py-12 mb-12">
        <div className="text-5xl mb-6 text-teal-500">✦</div>
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-slate-100 mb-4 leading-tight">
          Designing Our Life
        </h1>
        <p className="text-lg text-gray-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
          A shared practice in intentional living — built for Nick & Elise.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            Go to dashboard →
          </Link>
          <Link href="/exercise/1-dashboard" className="btn-secondary">
            Start Exercise 1
          </Link>
        </div>
      </div>

      {/* What is life design */}
      <div className="mb-14">
        <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-6 text-center">What is life design?</p>
        <div className="grid md:grid-cols-3 gap-4">
          {CONCEPTS.map(c => (
            <div key={c.title} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6">
              <div className="text-2xl mb-3">{c.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2 text-sm">{c.title}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About the book */}
      <div className="bg-teal-600 text-white rounded-2xl p-8 mb-14">
        <p className="text-teal-200 text-xs font-semibold uppercase tracking-wider mb-3">The book</p>
        <h2 className="text-2xl font-semibold mb-3">Designing Your Life</h2>
        <p className="text-teal-100 text-sm mb-1">by Bill Burnett & Dave Evans</p>
        <div className="w-12 h-0.5 bg-teal-400 mb-4" />
        <p className="text-teal-50 leading-relaxed mb-4">
          Burnett and Evans built a course at Stanford's d.school that applied design thinking to the question of how to live a meaningful life. The course became a bestselling book — and the central argument is simple: you don't discover your life, you design it.
        </p>
        <p className="text-teal-50 leading-relaxed">
          The book offers eight exercises that move from self-awareness (where am I now?) through exploration (what could I do?) to action (how do I test and refine?). This app walks you through all eight, saves your responses, and lets you and your partner see each other's thinking when you're both ready.
        </p>
      </div>

      {/* Why we're doing this */}
      <div className="mb-14">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-8">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3">Why we're doing this</p>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
            Life moves fast. Between work, relationships, and the general noise of everyday life, it's easy to find yourself years down the road wondering how you got there — and whether the path you're on is actually the one you'd choose.
          </p>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
            Nick and Elise are doing this together because the most important decisions in life deserve the same intentionality we bring to the smaller ones. This isn't about fixing anything that's broken. It's about designing deliberately — as partners — so that the life you're living is one you both actively chose.
          </p>
          <p className="text-gray-500 dark:text-slate-400 text-sm italic">
            Update this section with your own words anytime — just ask Claude to edit it.
          </p>
        </div>
      </div>

      {/* The journey */}
      <div className="mb-14">
        <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-6 text-center">The journey — 8 exercises</p>
        <div className="space-y-3">
          {EXERCISES.map((ex, i) => (
            <Link
              key={ex.id}
              href={`/exercise/${ex.slug}`}
              className="flex items-start gap-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 hover:border-teal-200 dark:hover:border-teal-700 hover:shadow-sm transition-all block"
            >
              <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-400 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                {ex.number}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-slate-100 text-sm mb-0.5">{ex.title}</h3>
                <p className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed">{ex.description}</p>
              </div>
              {i < EXERCISES.length - 1 && (
                <div className="ml-auto shrink-0 self-center text-gray-200 dark:text-slate-600 text-xs">→</div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* How to use */}
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-8 mb-8">
        <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-5">How to use this app</p>
        <div className="space-y-4">
          {[
            { step: '1', title: 'Pick your name in the sidebar', body: 'Tap the menu (on mobile) or use the sidebar to select Nick or Elise. Your responses are saved separately.' },
            { step: '2', title: 'Read the chapter first', body: 'Each exercise page tells you which chapter to read. The reading section on each page gives you a summary, but the book goes deeper.' },
            { step: '3', title: 'Do the exercise at your own pace', body: 'You don\'t have to finish in one sitting. Your responses save automatically as you go.' },
            { step: '4', title: 'See each other\'s responses', body: 'Once you both complete an exercise, each of you can see what the other wrote. The app shows your partner\'s responses at the bottom of the page.' },
            { step: '5', title: 'Work through all 8 in order', body: 'Each exercise builds on the last. The Good Time Journal informs the Mind Map, which informs the Odyssey Plans, and so on.' },
          ].map(item => (
            <div key={item.step} className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {item.step}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-slate-100 text-sm mb-0.5">{item.title}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-4">
        <Link href="/dashboard" className="btn-primary">
          Go to your dashboard →
        </Link>
      </div>
    </div>
  )
}
