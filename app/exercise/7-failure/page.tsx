'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { supabase, saveResponse, getResponses, getPartnerResponses } from '@/lib/supabase'
import ReadingSection from '@/components/ReadingSection'
import PartnerView from '@/components/PartnerView'
import BeforeYouBegin from '@/components/BeforeYouBegin'
import { FailureEntry } from '@/types'

const EX_ID = 'ex7'

const CATEGORIES = [
  { key: 'screwup', label: 'Screwup', desc: "A mistake you don't normally make. Acknowledge, apologize, move on." },
  { key: 'weakness', label: 'Weakness', desc: "A recurring failure you've already worked on. Focus on avoidance." },
  { key: 'growth', label: 'Growth Opportunity', desc: 'A failure with an identifiable cause and a fixable pattern.' },
] as const

export default function Ex7Page() {
  const { user, partnerName } = useUser()
  const [entries, setEntries] = useState<FailureEntry[]>([])
  const [partnerEntries, setPartnerEntries] = useState<FailureEntry[] | null>(null)
  const [patterns, setPatterns] = useState('')
  const [partnerPatterns, setPartnerPatterns] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchEntries(user).then(setEntries)
    getResponses(user, EX_ID).then(data => {
      if (data['patterns']) setPatterns(data['patterns'])
      if (data['_completed']) {
        fetchEntries(user === 'nick' ? 'elise' : 'nick').then(setPartnerEntries)
        getPartnerResponses(user, EX_ID).then(d => { if (d['patterns']) setPartnerPatterns(d['patterns']) })
      }
    })
  }, [user])

  const fetchEntries = async (u: string) => {
    const { data } = await supabase.from('failure_log').select('*').eq('user_name', u).order('created_at')
    return (data ?? []) as FailureEntry[]
  }

  const addEntry = () => setEntries(e => [...e, { id: `new_${Date.now()}`, user_name: user ?? '', failure: '', category: 'screwup', insight: '', created_at: new Date().toISOString() }])

  const updateEntry = (id: string, field: keyof FailureEntry, val: string) =>
    setEntries(e => e.map(x => x.id === id ? { ...x, [field]: val } : x))

  const removeEntry = (id: string) => setEntries(e => e.filter(x => x.id !== id))

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    // Delete all existing entries for user, then re-insert
    await supabase.from('failure_log').delete().eq('user_name', user)
    for (const e of entries) {
      if (!e.failure) continue
      await supabase.from('failure_log').insert({ user_name: user, failure: e.failure, category: e.category, insight: e.insight })
    }
    await saveResponse(user, EX_ID, 'patterns', patterns)
    await saveResponse(user, EX_ID, '_completed', 'true')
    setSaving(false)
    setSaved(true)
    fetchEntries(user === 'nick' ? 'elise' : 'nick').then(setPartnerEntries)
    getPartnerResponses(user, EX_ID).then(d => { if (d['patterns']) setPartnerPatterns(d['patterns']) })
  }

  if (!user) return <div className="text-gray-400 text-sm">Select who you are in the sidebar to begin.</div>

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">Exercise 7</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Reframing Failure</h1>
        <p className="text-gray-500 text-sm">Convert failures into insights through reflection and categorization.</p>
      </div>

      <BeforeYouBegin
        chapter="Designing Your Life — Chapter 10: Failure Immunity"
        time="Ongoing — add entries whenever something doesn't go as planned"
        youNeed={['Honesty — the log only works if you write what actually happened', 'Willingness to revisit uncomfortable moments without spiraling']}
        purpose="Designers fail constantly. The difference isn't your failure rate — it's what you do with failure afterward. This exercise builds the habit of converting failure into data instead of shame. Over time it makes you genuinely resilient."
      />
      <ReadingSection id="ex7">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-3">📖 Read First: Chapter 10 — Failure Immunity</p>
        <p>Designers fail constantly. Prototypes don't work. Assumptions turn out to be wrong. Plans need revision. The difference between designers who keep moving and ones who get stuck isn't their failure rate — it's what they do with failure when it happens.</p>
        <p className="mt-3">Good designers treat failure as <strong>data</strong>. Not as evidence that they're not good enough, not as a reason to stop, but as information about what's actually true — information they didn't have before. The failure log is a practice for building that habit.</p>
        <p className="mt-3">The authors ask you to log failures honestly and then categorize each one:</p>
        <ul className="mt-2 space-y-3 text-sm">
          <li><strong>Screwup</strong> — a one-off mistake you don't normally make. The response: acknowledge it, apologize if needed, and move on. Don't over-analyze it. These don't reveal patterns — they're just part of being human.</li>
          <li><strong>Weakness</strong> — a recurring failure you've already tried to address and keep making anyway. The response: note it, and consider designing around it rather than fighting it directly. If you've tried to fix it three times and it keeps showing up, it may just be a feature of who you are that needs routing around, not curing.</li>
          <li><strong>Growth opportunity</strong> — a failure with a specific, identifiable, fixable cause. This is the most important category. The response: isolate exactly what went wrong — not "I'm bad at X," but "I failed because I did Y when I should have done Z, and here's what I'd do differently." That level of precision is the actual insight.</li>
        </ul>
        <p className="mt-3">The broader concept the authors call <strong>failure immunity</strong>: you're not trying to stop failing — that's not realistic and not the goal. You're building a practice so that when failure happens, you don't spiral. You extract what's useful and keep moving. That resilience is what makes a life designer different from someone just hoping things work out.</p>
        <p className="mt-3">This exercise works best as an ongoing log, not a one-time reflection. Add to it whenever something doesn't go the way you planned.</p>
      </ReadingSection>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Failure Log</h2>
          <button onClick={addEntry} className="text-sm text-teal-600 hover:text-teal-800">+ Add failure</button>
        </div>

        {entries.length === 0 && (
          <div className="text-center py-8 text-gray-300">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm">No entries yet. Click "Add failure" to begin.</p>
          </div>
        )}

        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Describe the failure</label>
                <p className="text-xs text-gray-400 mb-1">Write what actually happened — not a cleaned-up version. What did you do or not do? What was the result?</p>
                <textarea className="textarea bg-white text-sm" rows={2} value={entry.failure} onChange={e => updateEntry(entry.id, 'failure', e.target.value)} />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => updateEntry(entry.id, 'category', cat.key)}
                      className={`text-xs px-3 py-2 rounded-lg border text-left transition-all ${
                        entry.category === cat.key
                          ? 'border-teal-400 bg-teal-50 text-teal-700 font-medium'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">{CATEGORIES.find(c => c.key === entry.category)?.desc}</p>
              </div>

              {entry.category === 'growth' && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Growth insight — what's the fixable pattern?</label>
                  <p className="text-xs text-gray-400 mb-1">Don't write "I'm bad at X." Write: "I failed because I did Y when I should have done Z. Next time I will…" That level of precision is the actual insight.</p>
                  <textarea className="textarea bg-white text-sm" rows={2} value={entry.insight} onChange={e => updateEntry(entry.id, 'insight', e.target.value)} />
                </div>
              )}

              <button onClick={() => removeEntry(entry.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Patterns</h2>
        <label className="block text-xs text-gray-500 mb-1">What patterns do you notice across your failures?</label>
        <p className="text-xs text-gray-400 mb-2">Look across all your entries. Are there common triggers, timing patterns, or situations where you consistently struggle? Any surprises — failures you expected to see but didn't, or ones that keep showing up?</p>
        <textarea className="textarea" rows={4} value={patterns} onChange={e => setPatterns(e.target.value)} />
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save my responses'}
        </button>
      </div>

      {partnerEntries && (
        <PartnerView label={`${partnerName}'s Failure Log`}>
          <div className="space-y-3">
            {partnerEntries.map(e => (
              <div key={e.id} className="pb-3 border-b border-teal-100 last:border-0">
                <div className="flex items-start gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${
                    e.category === 'growth' ? 'bg-green-100 text-green-700' :
                    e.category === 'weakness' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{CATEGORIES.find(c => c.key === e.category)?.label}</span>
                  <div>
                    <p className="text-sm text-gray-700">{e.failure}</p>
                    {e.insight && <p className="text-xs text-gray-500 mt-1 italic">Insight: {e.insight}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {partnerPatterns && (
            <div className="mt-4 pt-4 border-t border-teal-100">
              <p className="text-xs font-semibold text-gray-400 mb-1">Patterns noticed</p>
              <p className="text-sm text-gray-600">{partnerPatterns}</p>
            </div>
          )}
        </PartnerView>
      )}
    </div>
  )
}
