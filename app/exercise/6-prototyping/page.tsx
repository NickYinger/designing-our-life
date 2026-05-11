'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { supabase, saveResponse, getResponses } from '@/lib/supabase'
import ReadingSection from '@/components/ReadingSection'
import BeforeYouBegin from '@/components/BeforeYouBegin'
import { OdysseyPlan } from '@/types'

const EX_ID = 'ex6'

interface ConvoLog { planNumber: number; question: string; who: string; learned: string }
interface PrototypeExp { experience: string; learned: string }

export default function Ex6Page() {
  const { user } = useUser()
  const [plans, setPlans] = useState<OdysseyPlan[]>([])
  const [convos, setConvos] = useState<ConvoLog[]>([])
  const [experiences, setExperiences] = useState<PrototypeExp[]>([{ experience: '', learned: '' }])
  const [brainstorm, setBrainstorm] = useState({ question: '', ideas: [''] })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('odyssey_plans').select('*').eq('user_name', user).order('plan_number').then(({ data }) => {
      if (data) setPlans(data as OdysseyPlan[])
    })
    getResponses(user, EX_ID).then(data => {
      if (data['convos']) setConvos(JSON.parse(data['convos']))
      if (data['experiences']) setExperiences(JSON.parse(data['experiences']))
      if (data['brainstorm']) setBrainstorm(JSON.parse(data['brainstorm']))
    })
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await saveResponse(user, EX_ID, 'convos', JSON.stringify(convos))
    await saveResponse(user, EX_ID, 'experiences', JSON.stringify(experiences))
    await saveResponse(user, EX_ID, 'brainstorm', JSON.stringify(brainstorm))
    await saveResponse(user, EX_ID, '_completed', 'true')
    setSaving(false)
    setSaved(true)
  }

  if (!user) return <div className="text-gray-400 text-sm">Select who you are in the sidebar to begin.</div>

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">Exercise 6</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Prototyping</h1>
        <p className="text-gray-500 text-sm">Test your Odyssey Plan ideas before committing to them.</p>
      </div>

      <BeforeYouBegin
        chapter="Designing Your Life — Chapter 6: Prototyping"
        time="Ongoing — each conversation or experience takes 30 min to a few hours"
        youNeed={['Completed Odyssey Plans (Exercise 5)', 'The questions you wrote for each plan — those are your prototype starting points', "Courage to reach out to people (it's easier than it sounds)"]}
        purpose="Everything you've written so far is imagined. Prototyping is how you test your imagination against reality before committing. One honest conversation with someone living what you're considering is worth more than hours of thinking about it."
      />
      <ReadingSection id="ex6">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-3">📖 Read First: Chapter 6 — Prototyping</p>
        <p>Every Odyssey Plan you wrote is a hypothesis — a product of your imagination. Prototyping is how you test that hypothesis against reality, cheaply and before you've committed anything.</p>
        <p className="mt-3">The authors introduce two types of prototypes:</p>
        <ul className="mt-2 space-y-3 text-sm">
          <li>
            <strong>Prototype conversations</strong> — find someone who is already living something close to what you're considering and ask for 30 minutes to hear about their experience. The authors are clear: don't call it an informational interview. Don't frame it as networking. Just say: "I'm curious about your path — could I hear your story?" People say yes far more often than you expect. This is the single highest-leverage prototype available to you, and most people skip it entirely.
          </li>
          <li>
            <strong>Prototype experiences</strong> — shadow someone for a day, take on a short project, do a micro-internship or a volunteer gig. The goal is first-person, sensory, emotional data about what a path actually feels like from the inside. Reading about something and thinking about it produce a kind of knowledge. Living it, even briefly, produces a completely different kind of knowledge.
          </li>
        </ul>
        <p className="mt-3">The most important rule of prototyping: <strong>go in with curiosity, not a conclusion</strong>. You're not trying to confirm that the path is right — you're trying to find out what's actually true about it. Let the data surprise you.</p>
        <p className="mt-3">This exercise connects directly to the questions you wrote in your Odyssey Plans. Each question your plans were asking is a prototype waiting to happen. Use those as your starting points for who to talk to and what to try.</p>
      </ReadingSection>

      {/* Odyssey plan questions overview */}
      {plans.length > 0 && (
        <div className="bg-teal-50 rounded-2xl p-5 mb-6">
          <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-3">Your Odyssey Plan Questions</p>
          {plans.map(p => p.title && (
            <div key={p.plan_number} className="mb-3">
              <p className="text-sm font-medium text-gray-800">Plan {p.plan_number}: {p.title}</p>
              {p.questions_json.filter(Boolean).map((q, i) => <p key={i} className="text-xs text-gray-500 ml-3">→ {q}</p>)}
            </div>
          ))}
        </div>
      )}

      {/* Prototype conversations */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-2">Prototype Conversations</h2>
        <p className="text-sm text-gray-500 mb-4">Find someone living something close to what you're considering and ask: "I'm curious about your path — could I hear your story?" Don't call it an interview. Don't pitch yourself. Just listen. Log each conversation here after it happens.</p>
        <div className="space-y-4">
          {convos.map((c, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">For which plan?</label>
                  <select className="input text-sm" value={c.planNumber} onChange={e => setConvos(cv => cv.map((x, xi) => xi === i ? { ...x, planNumber: Number(e.target.value) } : x))}>
                    {[1,2,3].map(n => <option key={n} value={n}>Plan {n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Who did you talk to?</label>
                  <input className="input text-sm" placeholder="Name / role" value={c.who} onChange={e => setConvos(cv => cv.map((x, xi) => xi === i ? { ...x, who: e.target.value } : x))} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Which question were you exploring?</label>
                <input className="input text-sm" value={c.question} onChange={e => setConvos(cv => cv.map((x, xi) => xi === i ? { ...x, question: e.target.value } : x))} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">What did you learn?</label>
                <textarea className="textarea text-sm" rows={2} value={c.learned} onChange={e => setConvos(cv => cv.map((x, xi) => xi === i ? { ...x, learned: e.target.value } : x))} />
              </div>
              <button onClick={() => setConvos(cv => cv.filter((_, xi) => xi !== i))} className="text-xs text-red-400 hover:text-red-600">Remove</button>
            </div>
          ))}
          <button onClick={() => setConvos(c => [...c, { planNumber: 1, question: '', who: '', learned: '' }])} className="text-sm text-teal-600 hover:text-teal-800">+ Add conversation</button>
        </div>
      </div>

      {/* Prototype experiences */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-2">Prototype Experiences</h2>
        <p className="text-sm text-gray-500 mb-4">Shadow someone for a day, take on a short project, volunteer, do a micro-internship. The goal is first-person data — what does this path actually feel like from the inside? Go in curious, not to confirm what you already believe.</p>
        <div className="space-y-4">
          {experiences.map((e, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">What experience did you pursue?</label>
                <input className="input text-sm" placeholder="Shadow day, short project, internship…" value={e.experience} onChange={ev => setExperiences(ex => ex.map((x, xi) => xi === i ? { ...x, experience: ev.target.value } : x))} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">What did you learn?</label>
                <textarea className="textarea text-sm" rows={2} value={e.learned} onChange={ev => setExperiences(ex => ex.map((x, xi) => xi === i ? { ...x, learned: ev.target.value } : x))} />
              </div>
              {i > 0 && <button onClick={() => setExperiences(ex => ex.filter((_, xi) => xi !== i))} className="text-xs text-red-400 hover:text-red-600">Remove</button>}
            </div>
          ))}
          <button onClick={() => setExperiences(e => [...e, { experience: '', learned: '' }])} className="text-sm text-teal-600 hover:text-teal-800">+ Add experience</button>
        </div>
      </div>

      {/* Brainstorm */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Brainstorm</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Frame your question: "How many ways can we think of to…"</label>
            <input className="input" placeholder="…explore this career path? …test this idea? …find mentors?" value={brainstorm.question} onChange={e => setBrainstorm(b => ({ ...b, question: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2">Ideas (go for quantity)</label>
            <div className="space-y-2">
              {brainstorm.ideas.map((idea, i) => (
                <div key={i} className="flex gap-2">
                  <input className="input flex-1 text-sm" placeholder={`Idea ${i + 1}`} value={idea} onChange={e => setBrainstorm(b => ({ ...b, ideas: b.ideas.map((x, xi) => xi === i ? e.target.value : x) }))} />
                  {i > 0 && <button onClick={() => setBrainstorm(b => ({ ...b, ideas: b.ideas.filter((_, xi) => xi !== i) }))} className="text-gray-400 hover:text-red-400 px-2">×</button>}
                </div>
              ))}
              <button onClick={() => setBrainstorm(b => ({ ...b, ideas: [...b.ideas, ''] }))} className="text-sm text-teal-600 hover:text-teal-800">+ Add idea</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save my responses'}
        </button>
      </div>
    </div>
  )
}
