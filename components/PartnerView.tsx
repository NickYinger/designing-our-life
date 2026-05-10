'use client'

import { useUser } from '@/contexts/UserContext'

interface Props {
  children: React.ReactNode
  label?: string
}

export default function PartnerView({ children, label }: Props) {
  const { partnerName } = useUser()

  return (
    <div className="mt-10 border-t border-gray-100 pt-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-teal-400" />
        <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wide">
          {label ?? `${partnerName}'s Responses`}
        </h3>
      </div>
      <div className="bg-teal-50 rounded-2xl px-6 py-5 text-gray-700">
        {children}
      </div>
    </div>
  )
}
