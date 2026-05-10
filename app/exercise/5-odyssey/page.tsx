'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { supabase, saveResponse } from '@/lib/supabase'
import ReadingSection from '@/components/ReadingSection'
import PartnerView from '@/components/PartnerView'
import Gauge from '@/components/Gauge'
import { OdysseyPlan } from '@/types'

const EX_ID = 'ex5'
const YEARS = [0, 1, 2, 3, 4, 5]

const emptyPlan = (n: number): OdysseyPlan => ({
  user_name: '',
  plan_number: n,
  title: '',
  milestones_json: {},
  questions_json: ['', ''],
  gauges_json: { resources: 50, likability: 50, confidence: 50, coherence: 50 },
})

export default function Ex5Page() {
  const { user, userName, partnerName, partner } = useUser()
  const [plans, setPlans] = useState([emptyPlan(1), emptyPlan(2), emptyPlan(3)])
  const [partnerPlans, setPartnerPlans] = useState<OdysseyPlan[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchPlans(user).then(setPlans)
    if (partner) fetchPlans(partner).then(setPartnerPlans)
  }, [user, partner])

  const fetchPlans = async (u: string) => {
    const { data } = await supabase.from('odyssey_plans').select('*').eq('user_name', u).order('plan_number')
    if (!data || data.length === 0) return [emptyPlan(1), emptyPlan(2), emptyPlan(3)]
    const result = [emptyPlan(1), emptyPlan(2), emptyPlan(3)]
    data.forEach(d => { result[d.plan_number - 1] = d as OdysseyPlan })
    return result
  }

  const updatePlan = (i: number, field: string, val: unknown) => {
    setPlans(p => p.map((plan, idx) => idx === i ? { ...plan, [field]: val } : plan))
  }

  const updateMilestone = (planIdx: number, year: number, val: string) => {
    setPlans(p => p.map((plan, i) => i === planIdx
      ? { ...plan, milestones_json: { ...plan.milestones_json, [year]: val } }
      : plan
    ))
  }

  const updateQuestion = (planIdx: number, qIdx: number, val: string) => {
    setPlans(p => p.map((plan, i) => i === planIdx
      ? { ...plan, questions_json: plan.questions_json.map((q, qi) => qi === qIdx ? val : q) }
      : plan
    ))
  }

  const updateGauge = (planIdx: number, gauge: string, val: number) => {
    setPlans(p => p.map((plan, i) => i === planIdx
      ? { ...plan, gauges_json: { ...plan.gauges_json, [gauge]: val } }
      : plan
    ))
  }

  const savePlans = async () => {
    if (!user) return
    setSaving(true)
    for (const plan of plans) {
      await supabase.from('odyssey_plans').upsert({
        user_name: user,
        plan_number: plan.plan_number,
        title: plan.title,
        milestones_json: plan.milestones_json,
        questions_json: plan.questions_json,
        gauges_json: plan.gauges_json,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_name,plan_number' })
    }
    await saveResponse(user, EX_ID, '_completed', 'true')
    setSaving(false)
    setSaved(true)
    if (partner) fetchPlans(partner).then(setPartnerPlans)
  }

  const GAUGE_CONFIG = [
    { key: 'resources', label: 'Resources', min: 'Lacking', max: 'Ready' },
    { key: 'likability', label: 'Likability', min: 'Cold', max: 'Hot' },
    { key: 'confidence', label: 'Confidence', min: 'Unsure', max: 'Certain' },
    { key: 'coherence', label: 'Coherence', min: 'Conflicted', max: 'Aligned' },
  ]

  const PlanCard = ({ plan, idx, readonly = false }: { plan: OdysseyPlan; idx: number; readonly?: boolean }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center text-sm font-bold">{plan.plan_number}</div>
        {readonly ? (
          <h2 className="font-semibold text-gray-900">{plan.title || `Plan ${plan.plan_number}`}</h2>
        ) : (
          <input
            className="flex-1 font-semibold text-gray-900 bg-transparent border-b border-transparent focus:border-teal-300 focus:outline-none text-lg"
            placeholder="6-word title for this plan…"
            value={plan.title}
            onChange={e => updatePlan(idx, 'title', e.target.value)}
          />
        )}
      </div>

      {plan.title && !readonly && (
        <p className="text-xs text-gray-400 mb-4">{plan.title.split(/\s+/).length} / 6 words</p>
      )}

      {/* Timeline */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">5-Year Timeline</p>
        <div className="grid grid-cols-6 gap-2">
          {YEARS.map(year => (
            <div key={year}>
              <div className="text-xs text-center text-gray-400 mb-1">Yr {year}</div>
              {readonly ? (
                <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2 min-h-[60px]">{plan.milestones_json[year]}</div>
              ) : (
                <textarea
                  className="w-full text-xs border border-gray-200 rounded-lg p-2 min-h-[60px] focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none"
                  placeholder={year === 0 ? 'Now' : `Year ${year}`}
                  value={plan.milestones_json[year] ?? ''}
                  onChange={e => updateMilestone(idx, year, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">What is this plan asking?</p>
        <div className="space-y-2">
          {plan.questions_json.map((q, qi) => readonly ? (
            <p key={qi} className="text-sm text-gray-600">{q}</p>
          ) : (
            <input key={qi} className="input text-sm" placeholder={`Question ${qi + 1}…`} value={q} onChange={e => updateQuestion(idx, qi, e.target.value)} />
          ))}
        </div>
      </div>

      {/* Gauges */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">How do you rate this plan?</p>
        <div className="grid grid-cols-2 gap-5">
          {GAUGE_CONFIG.map(g => (
            <Gauge
              key={g.key}
              label={g.label}
              value={plan.gauges_json[g.key as keyof typeof plan.gauges_json] ?? 50}
              onChange={v => !readonly && updateGauge(idx, g.key, v)}
              minLabel={g.min}
              maxLabel={g.max}
              readonly={readonly}
            />
          ))}
        </div>
      </div>
    </div>
  )

  if (!user) return <div className="text-gray-400 text-sm">Select who you are in the sidebar to begin.</div>

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">Exercise 5</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Odyssey Plan</h1>
        <p className="text-gray-500 text-sm">Three genuinely different versions of the next five years of your life.</p>
      </div>

      <ReadingSection>
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-3">📖 Read First: Chapter 5 — Design Your Lives</p>
        <p>One of the central insights of this book: <strong>you don't have one true life</strong>. You have many possible lives. The goal of life design isn't to find "the right one" — it's to get genuinely curious about several different alternatives and evaluate them with real data rather than imagination alone.</p>
        <p className="mt-3">The Odyssey Plan asks you to draft <strong>three genuinely different</strong> alternative paths for the next five years. The authors are very specific here: not a best plan and two backups. Not Plan A and two lesser versions. Three paths you could actually see yourself living — paths that are different enough from each other that they'd take you to meaningfully different places.</p>
        <p className="mt-3">If you already have one path in mind, start there. For the second, ask: what would I do if that first path suddenly became impossible? And for the third, ask: what would I do if money and reputation were no object?</p>
        <p className="mt-3">Each plan gets four components:</p>
        <ul className="mt-2 space-y-2 text-sm">
          <li><strong>A visual timeline</strong> — milestones spread across years 0 through 5. What would actually have to happen, and when?</li>
          <li><strong>A 6-word title</strong> — a headline that captures the spirit of this path. Forces you to name it clearly.</li>
          <li><strong>Two questions</strong> — what is this plan asking about you and about the world? Every path you take is implicitly a bet on certain things being true. Name those bets.</li>
          <li><strong>Four gauges</strong> to assess each plan honestly:
            <ul className="mt-1 ml-4 space-y-1">
              <li><strong>Resources</strong> — do you have (or can you get) what this path requires? Time, money, skills, access?</li>
              <li><strong>Likability</strong> — gut check: does this path feel alive to you?</li>
              <li><strong>Confidence</strong> — do you believe you could actually do this?</li>
              <li><strong>Coherence</strong> — does this path fit with your Workview and Lifeview from Exercise 2?</li>
            </ul>
          </li>
        </ul>
        <p className="mt-3">The gauges aren't used to rank the plans or pick a winner. They're used to surface real concerns — the kind worth investigating through prototyping before committing.</p>
      </ReadingSection>

      <div className="space-y-6">
        {plans.map((plan, i) => <PlanCard key={i} plan={plan} idx={i} />)}

        <div className="flex items-center gap-3">
          <button onClick={savePlans} disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save all plans'}
          </button>
        </div>
      </div>

      {partnerPlans.length > 0 && partnerPlans[0].title && (
        <PartnerView label={`${partnerName}'s Odyssey Plans`}>
          <div className="space-y-6">
            {partnerPlans.map((plan, i) => plan.title ? <PlanCard key={i} plan={plan} idx={i} readonly /> : null)}
          </div>
        </PartnerView>
      )}
    </div>
  )
}
