'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { saveResponse, getResponses } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import ReadingSection from '@/components/ReadingSection'
import { JournalEntry } from '@/types'

const EX_ID = 'ex3'

const emptyEntry = { date: new Date().toISOString().split('T')[0], activity: '', engagement: 50, energy: 50, flow: false }

export default function Ex3Page() {
  const { user } = useUser()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [newEntry, setNewEntry] = useState({ ...emptyEntry })
  const [weeklyReflections, setWeeklyReflections] = useState<Record<number, string>>({})
  const [aeiouEntry, setAeiouEntry] = useState<string | null>(null)
  const [aeiouForm, setAeiouForm] = useState({ activities: '', environments: '', interactions: '', objects: '', users_field: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchEntries()
    getResponses(user, EX_ID).then(data => {
      const reflections: Record<number, string> = {}
      for (const [k, v] of Object.entries(data)) {
        const m = k.match(/^week_(\d+)_reflection$/)
        if (m) reflections[Number(m[1])] = v
      }
      setWeeklyReflections(reflections)
    })
  }, [user])

  const fetchEntries = async () => {
    if (!user) return
    const { data } = await supabase.from('journal_entries').select('*').eq('user_name', user).order('date', { ascending: false })
    if (data) setEntries(data as JournalEntry[])
  }

  const saveEntry = async () => {
    if (!user || !newEntry.activity) return
    setSaving(true)
    await supabase.from('journal_entries').insert({ user_name: user, ...newEntry })
    await saveResponse(user, EX_ID, '_completed', 'true')
    setNewEntry({ ...emptyEntry })
    await fetchEntries()
    setSaving(false)
  }

  const saveAEIOU = async (entryId: string) => {
    await supabase.from('journal_entries').update({
      aeiou_activities: aeiouForm.activities,
      aeiou_environments: aeiouForm.environments,
      aeiou_interactions: aeiouForm.interactions,
      aeiou_objects: aeiouForm.objects,
      aeiou_users_field: aeiouForm.users_field,
    }).eq('id', entryId)
    setAeiouEntry(null)
    await fetchEntries()
  }

  const saveWeeklyReflection = async (week: number, text: string) => {
    if (!user) return
    await saveResponse(user, EX_ID, `week_${week}_reflection`, text)
    setWeeklyReflections(r => ({ ...r, [week]: text }))
  }

  const getWeekNumber = (dateStr: string) => {
    if (!entries.length) return 1
    const dates = entries.map(e => new Date(e.date).getTime())
    const earliest = Math.min(...dates)
    const entryDate = new Date(dateStr).getTime()
    return Math.floor((entryDate - earliest) / (7 * 24 * 60 * 60 * 1000)) + 1
  }

  const entriesByWeek = entries.reduce((acc, entry) => {
    const w = getWeekNumber(entry.date)
    if (!acc[w]) acc[w] = []
    acc[w].push(entry)
    return acc
  }, {} as Record<number, JournalEntry[]>)

  if (!user) return <div className="text-gray-400 text-sm">Select who you are in the sidebar to begin.</div>

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">Exercise 3</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Good Time Journal</h1>
        <p className="text-gray-500 text-sm">Log activities over three weeks to discover when you're engaged, energized, and in flow.</p>
      </div>

      <ReadingSection>
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-3">📖 Read First: Chapter 3 — Wayfinding</p>
        <p>When you don't have a map, you wayfind — you pay close attention to the signals your experience is giving you and navigate from there. The Good Time Journal is your wayfinding instrument. It trains you to notice two distinct signals that most people blur together:</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li><strong>Engagement</strong> — how mentally absorbed and present were you during this activity? Were you fully in it, or just going through the motions?</li>
          <li><strong>Energy</strong> — afterward, did you feel more alive or more depleted? Some activities are interesting but draining. Others are mundane but oddly energizing. Both signals matter.</li>
        </ul>
        <p className="mt-3">And a third marker: <strong>flow</strong> — those rare experiences where you lose track of time, effort disappears, and you're completely absorbed in what you're doing. Flow happens when the challenge of a task and your ability to meet it are perfectly matched. It's one of the strongest signals the journal can surface.</p>
        <p className="mt-3">The authors recommend three weeks of logging because patterns don't show up in a single day — you need enough entries to see what's consistently engaging, what's consistently draining, and what surprises you. Log activities as you go, not at the end of the week when you've forgotten the texture of each day.</p>
        <p className="mt-3">The <strong>AEIOU</strong> method is for going deeper on any entry that stands out. Instead of just noting "that was good," it helps you understand <em>which specific element</em> of the experience was the actual source:</p>
        <ul className="mt-2 space-y-1 text-sm">
          <li><strong>A — Activities:</strong> What were you specifically doing, step by step?</li>
          <li><strong>E — Environments:</strong> Where were you? How did the physical space feel?</li>
          <li><strong>I — Interactions:</strong> With people or machines? Formal or informal? One-on-one or group?</li>
          <li><strong>O — Objects:</strong> What tools, materials, or technology were you working with?</li>
          <li><strong>U — Users:</strong> Who else was present? What role did they play in your experience?</li>
        </ul>
        <p className="mt-3">This level of analysis lets you say something more precise than "I liked that project" — you might find it was specifically the solo, deep-focus work with a particular type of tool that did it. That's actionable data.</p>
      </ReadingSection>

      {/* New entry form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Log an Activity</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Activity</label>
              <input className="input" placeholder="What were you doing?" value={newEntry.activity} onChange={e => setNewEntry(n => ({ ...n, activity: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Date</label>
              <input type="date" className="input" value={newEntry.date} onChange={e => setNewEntry(n => ({ ...n, date: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Engagement — {newEntry.engagement}%</label>
              <input type="range" min={0} max={100} value={newEntry.engagement} onChange={e => setNewEntry(n => ({ ...n, engagement: Number(e.target.value) }))} className="w-full accent-teal-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Low</span><span>High</span></div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Energy — {newEntry.energy}%</label>
              <input type="range" min={0} max={100} value={newEntry.energy} onChange={e => setNewEntry(n => ({ ...n, energy: Number(e.target.value) }))} className="w-full accent-teal-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Draining</span><span>Energizing</span></div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={newEntry.flow} onChange={e => setNewEntry(n => ({ ...n, flow: e.target.checked }))} className="accent-teal-600 w-4 h-4" />
            I experienced flow during this activity
          </label>

          <button onClick={saveEntry} disabled={saving || !newEntry.activity} className="btn-primary">
            {saving ? 'Saving…' : 'Add Entry'}
          </button>
        </div>
      </div>

      {/* Entries by week */}
      {Object.entries(entriesByWeek).sort(([a], [b]) => Number(b) - Number(a)).map(([week, weekEntries]) => {
        const w = Number(week)
        return (
          <div key={week} className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">Week {week}</span>
              <span className="text-xs text-gray-400">{weekEntries.length} {weekEntries.length === 1 ? 'entry' : 'entries'}</span>
            </h3>

            <div className="space-y-3 mb-4">
              {weekEntries.map(entry => (
                <div key={entry.id} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm text-gray-900">{entry.activity}</span>
                        {entry.flow && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Flow ✦</span>}
                      </div>
                      <div className="flex gap-4 text-xs text-gray-400">
                        <span>{entry.date}</span>
                        <span>Engagement: {entry.engagement}%</span>
                        <span>Energy: {entry.energy}%</span>
                      </div>
                      {(entry.aeiou_activities || entry.aeiou_environments) && (
                        <div className="mt-2 text-xs text-gray-500 space-y-1">
                          {entry.aeiou_activities && <p><strong>A:</strong> {entry.aeiou_activities}</p>}
                          {entry.aeiou_environments && <p><strong>E:</strong> {entry.aeiou_environments}</p>}
                          {entry.aeiou_interactions && <p><strong>I:</strong> {entry.aeiou_interactions}</p>}
                          {entry.aeiou_objects && <p><strong>O:</strong> {entry.aeiou_objects}</p>}
                          {entry.aeiou_users_field && <p><strong>U:</strong> {entry.aeiou_users_field}</p>}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => { setAeiouEntry(entry.id); setAeiouForm({ activities: entry.aeiou_activities ?? '', environments: entry.aeiou_environments ?? '', interactions: entry.aeiou_interactions ?? '', objects: entry.aeiou_objects ?? '', users_field: entry.aeiou_users_field ?? '' }) }}
                      className="text-xs text-teal-600 hover:text-teal-800 shrink-0"
                    >
                      {entry.aeiou_activities ? 'Edit AEIOU' : 'Go deeper →'}
                    </button>
                  </div>

                  {aeiouEntry === entry.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">AEIOU Deep Dive</p>
                      {['activities', 'environments', 'interactions', 'objects', 'users_field'].map((field, i) => {
                        const labels = ['A — Activities: What were you actually doing?', 'E — Environments: Where were you? How did it feel?', 'I — Interactions: With people or machines?', 'O — Objects: What tools or objects were involved?', 'U — Users: Who else was there?']
                        return (
                          <div key={field}>
                            <label className="block text-xs text-gray-500 mb-1">{labels[i]}</label>
                            <textarea className="textarea" rows={2} value={(aeiouForm as Record<string, string>)[field]} onChange={e => setAeiouForm(f => ({ ...f, [field]: e.target.value }))} />
                          </div>
                        )
                      })}
                      <div className="flex gap-2">
                        <button onClick={() => saveAEIOU(entry.id)} className="btn-primary text-sm py-2">Save AEIOU</button>
                        <button onClick={() => setAeiouEntry(null)} className="btn-secondary text-sm py-2">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {weekEntries.length >= 7 && (
              <div className="bg-teal-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-teal-800 mb-2">Week {w} Reflection</label>
                <p className="text-xs text-teal-600 mb-2">What activities engaged and energized you? Any surprises?</p>
                <textarea
                  className="textarea bg-white"
                  rows={3}
                  value={weeklyReflections[w] ?? ''}
                  onChange={e => setWeeklyReflections(r => ({ ...r, [w]: e.target.value }))}
                  onBlur={e => saveWeeklyReflection(w, e.target.value)}
                />
              </div>
            )}
          </div>
        )
      })}

      {entries.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📓</p>
          <p>No entries yet. Start logging activities above.</p>
        </div>
      )}
    </div>
  )
}
