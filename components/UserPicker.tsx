'use client'

import { useUser } from '@/contexts/UserContext'

export default function UserPicker() {
  const { user, setUser } = useUser()

  return (
    <div className="flex items-center gap-1 bg-teal-50 border border-teal-200 rounded-full p-1">
      <button
        onClick={() => setUser('nick')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          user === 'nick'
            ? 'bg-teal-600 text-white shadow-sm'
            : 'text-teal-700 hover:bg-teal-100'
        }`}
      >
        Nick
      </button>
      <button
        onClick={() => setUser('elise')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          user === 'elise'
            ? 'bg-teal-600 text-white shadow-sm'
            : 'text-teal-700 hover:bg-teal-100'
        }`}
      >
        Elise
      </button>
    </div>
  )
}
