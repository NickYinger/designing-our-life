interface Props {
  chapter: string
  time: string
  youNeed?: string[]
  purpose: string
}

export default function BeforeYouBegin({ chapter, time, youNeed, purpose }: Props) {
  return (
    <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
      <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3">Before You Begin</p>
      <p className="text-gray-700 leading-relaxed mb-5">{purpose}</p>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Read First</p>
          <p className="text-gray-700">{chapter}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Time Needed</p>
          <p className="text-gray-700">{time}</p>
        </div>
        {youNeed && youNeed.length > 0 && (
          <div className="col-span-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">You'll Need</p>
            <ul className="space-y-0.5">
              {youNeed.map((item, i) => (
                <li key={i} className="text-gray-700">· {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
