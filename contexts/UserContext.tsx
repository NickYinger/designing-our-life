'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type User = 'nick' | 'elise' | null

interface UserContextType {
  user: User
  setUser: (user: User) => void
  partner: 'nick' | 'elise' | null
  userName: string
  partnerName: string
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  partner: null,
  userName: '',
  partnerName: '',
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User>(null)

  useEffect(() => {
    const stored = localStorage.getItem('dol_user') as User
    if (stored === 'nick' || stored === 'elise') setUserState(stored)
  }, [])

  const setUser = (u: User) => {
    setUserState(u)
    if (u) localStorage.setItem('dol_user', u)
    else localStorage.removeItem('dol_user')
  }

  const partner = user === 'nick' ? 'elise' : user === 'elise' ? 'nick' : null

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      partner,
      userName: user ? (user === 'nick' ? 'Nick' : 'Elise') : '',
      partnerName: partner ? (partner === 'nick' ? 'Nick' : 'Elise') : '',
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
