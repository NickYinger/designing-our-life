'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { saveResponse, getResponses, getPartnerResponses } from '@/lib/supabase'
import ReadingSection from '@/components/ReadingSection'
import PartnerView from '@/components/PartnerView'
import BeforeYouBegin from '@/components/BeforeYouBegin'

const EX_ID = 'ex2'

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

export default function Ex2Page() {
  const { user, partnerName } = useUser()
  const [form, setForm] = useState({ workview: '', lifeview: '', complement: '', clash: '', driver: '' })
  const [partnerData, setPartnerData] = useState<Record<string, string> | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    getResponses(user, EX_ID).then(data => {
      if (Object.keys(data).length) {
        setForm(f => ({ ...f, ...data }))
        if (data['_completed']) {
          getPartnerResponses(user, EX_ID).then(p => {
            if (Object.keys(p).length) setPartnerData(p)
          })
        }
      }
    })
  }, [user])

  const set = (key: keyof typeof form, val: string) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    for (const [k, v] of Object.entries(form)) {
      await saveResponse(user, EX_ID, k, v)
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
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">Exercise 2</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Workview & Lifeview</h1>
        <p className="text-gray-500 text-sm">Your philosophy of work and your worldview — together they form the compass for your life design.</p>
      </div>

      <BeforeYouBegin
        chapter="Designing Your Life — Chapter 2: Building a Compass"
        time="60–90 minutes (about 30 min per view)"
        youNeed={['Uninterrupted time — this is philosophical, not quick', 'Willingness to write what's actually true, not what sounds good']}
        purpose="Your Workview and Lifeview together form the compass that guides every design decision you make. Without this compass, you're navigating without knowing which direction matters. This is foundational — if you skip it, every later exercise loses its grounding."
      />
      <ReadingSection id="ex2">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-3">📖 Read First: Chapter 2 — Building a Compass</p>
        <p>Life design doesn't give you a map — it gives you a compass. A map tells you exactly where to go. A compass helps you orient when you're in uncertain terrain, which in life design, is always. Your compass has two needles: your Workview and your Lifeview.</p>
        <p className="mt-3"><strong>Workview</strong> — This is your philosophy of work, not your job description or your wishlist. The authors want you to think about: Why does work matter? What makes work good or meaningful? What is the relationship between work and the rest of life? What role does money play — is it the point, or a means to something else? What do growth and contribution have to do with it?</p>
        <p className="mt-3">This is not about what you want your next job to be. It's about what you believe work is <em>for</em>.</p>
        <p className="mt-3"><strong>Lifeview</strong> — This is your bigger worldview. Why are we here? What gives life meaning? What is the relationship between individuals and the world around them? Where do suffering, joy, fairness, and love fit into the picture? These aren't trick questions — they're asking you to put into words the operating assumptions you already have, even if you've never said them out loud.</p>
        <p className="mt-3">The reflection at the end — where your views complement each other, where they clash, and which drives the other — is where this gets interesting. When your Workview and Lifeview are coherent, decisions feel grounded. When they're in tension, you often feel it as a vague dissatisfaction you can't name. Naming it is the first step to designing around it.</p>
        <p className="mt-3">Aim for 250 words each. Take ~30 minutes per view. Don't write what sounds good — write what's actually true for you.</p>
      </ReadingSection>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="font-semibold text-gray-900">Your Workview</h2>
              <p className="text-xs text-gray-400 mt-1">This is your philosophy of work — not what you want from your next job, but what you believe work is <em>for</em>. Consider: Why does work matter? What makes work good or meaningful — and what makes it bad? What is the relationship between work and the rest of life? What role does money play — is it the point, or a means to something else? What do growth, contribution, and service have to do with it?</p>
            </div>
            <span className="text-xs text-gray-400 shrink-0 ml-4">{wordCount(form.workview)} words</span>
          </div>
          <textarea
            className="textarea"
            rows={10}
            placeholder="Write your Workview here..."
            value={form.workview}
            onChange={e => set('workview', e.target.value)}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="font-semibold text-gray-900">Your Lifeview</h2>
              <p className="text-xs text-gray-400 mt-1">This is your bigger worldview — the operating assumptions you already have, even if you've never said them out loud. Consider: Why are we here? What gives life meaning? What is the relationship between the individual and others — where do family, community, and society fit? What role do suffering and joy play? What do you believe about fairness, luck, and how the world actually works?</p>
            </div>
            <span className="text-xs text-gray-400 shrink-0 ml-4">{wordCount(form.lifeview)} words</span>
          </div>
          <textarea
            className="textarea"
            rows={10}
            placeholder="Write your Lifeview here..."
            value={form.lifeview}
            onChange={e => set('lifeview', e.target.value)}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Reflection</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Where do your Workview and Lifeview complement each other?</label>
            <p className="text-xs text-gray-400 mb-2">Where do they reinforce or support each other? When your work philosophy and your worldview are pointing in the same direction, decisions feel grounded and clear.</p>
            <textarea className="textarea" rows={3} value={form.complement} onChange={e => set('complement', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Where do they clash?</label>
            <p className="text-xs text-gray-400 mb-2">Where do they pull in different directions? This tension is often the source of a vague dissatisfaction you can't quite name. Naming it is the first step to designing around it.</p>
            <textarea className="textarea" rows={3} value={form.clash} onChange={e => set('clash', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Does one drive the other? How?</label>
            <p className="text-xs text-gray-400 mb-2">Does your Lifeview shape what you believe work should be? Or does your experience of work shape how you see the world? Neither is wrong — but understanding the relationship helps you see which lever to pull when something feels off.</p>
            <textarea className="textarea" rows={3} value={form.driver} onChange={e => set('driver', e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save my responses'}
          </button>
        </div>
      </div>

      {partnerData && Object.keys(partnerData).length > 0 && (
        <PartnerView label={`${partnerName}'s Workview & Lifeview`}>
          {partnerData['workview'] && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Workview</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{partnerData['workview']}</p>
            </div>
          )}
          {partnerData['lifeview'] && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Lifeview</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{partnerData['lifeview']}</p>
            </div>
          )}
          {partnerData['complement'] && (
            <div className="pt-4 border-t border-teal-100 space-y-3">
              <div><p className="text-xs font-semibold text-gray-400 mb-1">Complement</p><p className="text-sm text-gray-600">{partnerData['complement']}</p></div>
              {partnerData['clash'] && <div><p className="text-xs font-semibold text-gray-400 mb-1">Clash</p><p className="text-sm text-gray-600">{partnerData['clash']}</p></div>}
              {partnerData['driver'] && <div><p className="text-xs font-semibold text-gray-400 mb-1">Driver</p><p className="text-sm text-gray-600">{partnerData['driver']}</p></div>}
            </div>
          )}
        </PartnerView>
      )}
    </div>
  )
}
