'use client'

interface Props {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  minLabel?: string
  maxLabel?: string
  readonly?: boolean
}

export default function Gauge({ label, value, onChange, min = 0, max = 100, minLabel = '0', maxLabel = 'Full', readonly = false }: Props) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-teal-600 font-semibold">{Math.round(pct)}%</span>
      </div>
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      {!readonly && (
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full accent-teal-600 cursor-pointer"
        />
      )}
      <div className="flex justify-between text-xs text-gray-400">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}
