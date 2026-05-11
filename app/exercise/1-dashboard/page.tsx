'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { saveResponse, getResponses, getPartnerResponses } from '@/lib/supabase'
import ReadingSection from '@/components/ReadingSection'
import PartnerView from '@/components/PartnerView'
import Gauge from '@/components/Gauge'
import BeforeYouBegin from '@/components/BeforeYouBegin'

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

      <BeforeYouBegin
        chapter="Designing Your Life — Chapter 1: Start Where You Are"
        time="30–45 minutes"
        youNeed={['A quiet space', 'Honesty about where things actually stand — not where you wish they were']}
        purpose="You can't design a life without knowing where you're starting from. This exercise is your current location across four domains. It's not a judgment — it's a reading. The goal is simply to see clearly so you have somewhere real to design from."
      />
      <ReadingSection id="ex1">
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
              label="How full does this feel right now?"
              value={Number(form[`${area}_gauge`] ?? 50)}
              onChange={v => set(`${area}_gauge`, v)}
              minLabel="Empty"
              maxLabel="Full"
            />
            <div className="mt-4">
              <label className="block text-xs text-gray-500 mb-1">Reflect on this area in a few sentences</label>
              <p className="text-xs text-gray-400 mb-2">
                {area === 'Health' && "Think about the last few weeks. How has your body felt? Your sleep? Your mental clarity and emotional steadiness? Any spiritual or grounding practice?"}
                {area === 'Work' && "Consider everything you put real effort into — your job, side projects, caregiving, volunteering. Is it meaningful? Draining? Somewhere in between?"}
                {area === 'Play' && "Play is anything you do purely for joy — no goal beyond the doing itself. If you have to justify it with productivity, it's probably not play. Do you have any?"}
                {area === 'Love' && "Think about your closest relationships, your sense of belonging, and your connection to things you care about. How nourished does this area feel?"}
              </p>
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
            <p className="text-xs text-gray-400 mb-2">Looking across the four areas, where do you feel the most friction, longing, or imbalance? A design problem is something that isn't working that you might be able to redesign — not just complain about, but actually change. Name it as specifically as you can.</p>
            <textarea className="textarea" rows={3} placeholder="e.g. I feel like work is consuming everything and I have no play left in my life…" value={String(form['design_problem'] ?? '')} onChange={e => set('design_problem', e.target.value)} />
          </div>
          <div>
            <label className="block font-medium text-gray-900 text-sm mb-1">Is this a gravity problem?</label>
            <p className="text-xs text-gray-400 mb-2">A gravity problem feels immovable — like a law of nature you can't fight. "I can't change this because of my mortgage / my family / my age." But gravity problems are often just untested assumptions. Ask yourself: have I actually tried to change this, or have I just decided it's impossible? Reflect honestly here.</p>
            <textarea className="textarea" rows={3} placeholder="e.g. I keep telling myself I can't pursue X because of Y — but have I actually tested that?" value={String(form['gravity_problem'] ?? '')} onChange={e => set('gravity_problem', e.target.value)} />
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
