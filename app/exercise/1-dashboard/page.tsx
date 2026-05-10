'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { saveResponse, getResponses, getPartnerResponses } from '@/lib/supabase'
import ReadingSection from '@/components/ReadingSection'
import PartnerView from '@/components/PartnerView'
import Gauge from '@/components/Gauge'

const EX_ID = 'ex1'
const AREAS = ['Health', 'Work', 'Play', 'Love'] as const
type Area = typeof AREAS[number]

const AREA_DESC: Record<Area, string> = {
  Health: 'Mind, body, and spirit — physical, mental, and spiritual wellbeing.',
  Work: 'Paid work, volunteering, caregiving — anything you put effort into.',
  Play: 'Activity done purely for joy, with no goal other than the doing.',
  Love: 'Relationships, community, anything you are affectionate toward.',
}

export default function Ex1Page() {
  const { user, userName, partnerName } = useUser()
  const [form, setForm] = useState<Record<string, string | number>>({})
  const [partnerData, setPartnerData] = useState<Record<string, string> | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    getResponses(user, EX_ID).then(data => {
      if (Object.keys(data).length) {
        setForm(data as Record<string, string | number>)
        if (data['_completed']) {
          getPartnerResponses(user, EX_ID).then(p => {
            if (Object.keys(p).length) setPartnerData(p)
          })
        }
      }
    })
  }, [user])

  const set = (key: string, val: string | number) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    for (const [k, v] of Object.entries(form)) {
      await saveResponse(user, EX_ID, k, String(v))
    }
    await saveResponse(user, EX_ID, '_completed', 'true')
    setSaved(true)
    setSaving(false)
    const partner = await getPartnerResponses(user, EX_ID)
    if (Object.keys(partner).length) setPartnerData(partner)
  }

  if (!user) return <div className="text-gray-400 text-sm">Select who you are in the sidebar to begin.</div>

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">Exercise 1</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Health / Work / Play / Love</h1>
        <p className="text-gray-500 text-sm">A snapshot of where you are now across four life areas.</p>
      </div>

      <ReadingSection>
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-3">📖 Read First: Chapter 1 — Start Where You Are</p>
        <p>You can't design a life without knowing where you're starting from. The authors use the GPS metaphor: before the app can give you directions, it needs your current location. That's what this exercise is — your current location across four domains of life.</p>
        <p className="mt-3">The four areas:</p>
        <ul className="mt-2 space-y-2 text-sm">
          <li><strong>Health</strong> — physical, mental, and spiritual wellbeing. Not just whether you exercise, but how alive and grounded you feel.</li>
          <li><strong>Work</strong> — paid work, caregiving, volunteering. Anything you put serious effort into counts.</li>
          <li><strong>Play</strong> — activity done purely for joy, with no goal beyond the doing itself. If you're doing it to get better at it, that's work. Play is purposeless in the best sense.</li>
          <li><strong>Love</strong> — your relationships, community, and affection toward people and things in your life.</li>
        </ul>
        <p className="mt-3">The gauge isn't a judgment — it's a reading. You're not being graded. You're just seeing where things actually stand so you have somewhere real to design from.</p>
        <p className="mt-3">After the gauges, the book introduces two important concepts:</p>
        <ul className="mt-2 space-y-2 text-sm">
          <li><strong>Design problems</strong> — something in one of these areas that isn't working, that you might be able to redesign. These are worth identifying and pursuing.</li>
          <li><strong>Gravity problems</strong> — things that feel like immovable constraints but might not actually be. "I can't change careers because I have a mortgage" might feel like gravity — but is it really? Or is it a framing you've accepted without testing? Gravity problems feel fixed. Often they're just untested assumptions.</li>
        </ul>
        <p className="mt-3">The authors aren't asking you to fix anything yet. Just to see clearly.</p>
      </ReadingSection>

      <div className="space-y-8">
        {AREAS.map(area => (
          <div key={area} className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-1">{area}</h2>
            <p className="text-xs text-gray-400 mb-4">{AREA_DESC[area]}</p>
            <Gauge
              label="How full does this feel?"
              value={Number(form[`${area}_gauge`] ?? 50)}
              onChange={v => set(`${area}_gauge`, v)}
              minLabel="Empty"
              maxLabel="Full"
            />
            <div className="mt-4">
              <label className="block text-xs text-gray-500 mb-2">Reflect on this area in a few sentences</label>
              <textarea
                className="textarea"
                rows={3}
                placeholder={`What's going on with your ${area.toLowerCase()} right now?`}
                value={String(form[`${area}_reflection`] ?? '')}
                onChange={e => set(`${area}_reflection`, e.target.value)}
              />
            </div>
          </div>
        ))}

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block font-medium text-gray-900 text-sm mb-1">Is there a design problem you'd like to tackle?</label>
            <p className="text-xs text-gray-400 mb-2">Looking across the four areas, is anything calling for attention?</p>
            <textarea className="textarea" rows={3} placeholder="Describe the problem..." value={String(form['design_problem'] ?? '')} onChange={e => set('design_problem', e.target.value)} />
          </div>
          <div>
            <label className="block font-medium text-gray-900 text-sm mb-1">Is this a gravity problem?</label>
            <p className="text-xs text-gray-400 mb-2">Are you treating something as a fixed constraint that might actually be actionable if you approached it differently?</p>
            <textarea className="textarea" rows={3} placeholder="Reflect on whether this is truly fixed..." value={String(form['gravity_problem'] ?? '')} onChange={e => set('gravity_problem', e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save my responses'}
          </button>
          {saved && <span className="text-sm text-gray-400">Your responses are saved.</span>}
        </div>
      </div>

      {partnerData && Object.keys(partnerData).length > 0 && (
        <PartnerView label={`${partnerName}'s Responses`}>
          {AREAS.map(area => (
            <div key={area} className="mb-5">
              <h3 className="font-medium text-sm text-gray-900 mb-2">{area}</h3>
              {partnerData[`${area}_gauge`] && (
                <Gauge label="Fullness" value={Number(partnerData[`${area}_gauge`])} onChange={() => {}} readonly />
              )}
              {partnerData[`${area}_reflection`] && (
                <p className="text-sm text-gray-600 mt-2">{partnerData[`${area}_reflection`]}</p>
              )}
            </div>
          ))}
          {partnerData['design_problem'] && (
            <div className="mt-4 pt-4 border-t border-teal-100">
              <p className="text-xs font-semibold text-gray-400 mb-1">Design Problem</p>
              <p className="text-sm text-gray-600">{partnerData['design_problem']}</p>
            </div>
          )}
          {partnerData['gravity_problem'] && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-400 mb-1">Gravity Problem Reflection</p>
              <p className="text-sm text-gray-600">{partnerData['gravity_problem']}</p>
            </div>
          )}
        </PartnerView>
      )}
    </div>
  )
}
