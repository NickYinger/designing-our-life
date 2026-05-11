'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { supabase, saveResponse, getResponses, getPartnerResponses } from '@/lib/supabase'
import ReadingSection from '@/components/ReadingSection'
import PartnerView from '@/components/PartnerView'
import BeforeYouBegin from '@/components/BeforeYouBegin'
import { TeamMember } from '@/types'

const EX_ID = 'ex8'

const ROLES = [
  { key: 'supporter', label: 'Supporters', emoji: '🤝', desc: 'People who care about your life and your design process.' },
  { key: 'player', label: 'Players', emoji: '🎯', desc: 'People you actively do things with — partners in action.' },
  { key: 'intimate', label: 'Intimates', emoji: '❤️', desc: 'Close family and friends most affected by your choices.' },
] as const

const TEAM_RULES = [
  { label: 'Respectful', desc: 'All ideas are valid. No dismissing or judging.' },
  { label: 'Confidential', desc: "What's shared in the group stays in the group." },
  { label: 'Participative', desc: 'Everyone engages. No passengers.' },
  { label: 'Generative', desc: 'Build on ideas. Ask "what if" and "how might we".' },
]

export default function Ex8Page() {
  const { user, partnerName } = useUser()
  const [members, setMembers] = useState<Omit<TeamMember, 'id' | 'user_name' | 'created_at'>[]>([])
  const [partnerMembers, setPartnerMembers] = useState<TeamMember[] | null>(null)
  const [meetingStructure, setMeetingStructure] = useState('')
  const [partnerMeeting, setPartnerMeeting] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('team_members').select('*').eq('user_name', user).order('created_at').then(({ data }) => {
      if (data && data.length > 0) setMembers(data.map(d => ({ role: d.role, name: d.name, note: d.note ?? '' })))
    })
    getResponses(user, EX_ID).then(data => {
      if (data['meeting_structure']) setMeetingStructure(data['meeting_structure'])
      if (data['_completed']) {
        const partner = user === 'nick' ? 'elise' : 'nick'
        supabase.from('team_members').select('*').eq('user_name', partner).order('created_at').then(({ data: pd }) => {
          if (pd) setPartnerMembers(pd as TeamMember[])
        })
        getPartnerResponses(user, EX_ID).then(d => { if (d['meeting_structure']) setPartnerMeeting(d['meeting_structure']) })
      }
    })
  }, [user])

  const addMember = (role: string) => setMembers(m => [...m, { role: role as TeamMember['role'], name: '', note: '' }])
  const updateMember = (i: number, field: string, val: string) => setMembers(m => m.map((x, xi) => xi === i ? { ...x, [field]: val } : x))
  const removeMember = (i: number) => setMembers(m => m.filter((_, xi) => xi !== i))

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await supabase.from('team_members').delete().eq('user_name', user)
    for (const m of members) {
      if (!m.name) continue
      await supabase.from('team_members').insert({ user_name: user, role: m.role, name: m.name, note: m.note })
    }
    await saveResponse(user, EX_ID, 'meeting_structure', meetingStructure)
    await saveResponse(user, EX_ID, '_completed', 'true')
    setSaving(false)
    setSaved(true)
    const partner = user === 'nick' ? 'elise' : 'nick'
    supabase.from('team_members').select('*').eq('user_name', partner).then(({ data }) => { if (data) setPartnerMembers(data as TeamMember[]) })
    getPartnerResponses(user, EX_ID).then(d => { if (d['meeting_structure']) setPartnerMeeting(d['meeting_structure']) })
  }

  if (!user) return <div className="text-gray-400 text-sm">Select who you are in the sidebar to begin.</div>

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">Exercise 8</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Building a Team</h1>
        <p className="text-gray-500 text-sm">Assemble your life design team for support, accountability, and perspective.</p>
      </div>

      <BeforeYouBegin
        chapter="Designing Your Life — Chapter 11: Building a Team"
        time="30–45 minutes to identify your team; ongoing to actually meet"
        youNeed={['Completed earlier exercises to know what you want your team to support', 'Willingness to ask people — most will say yes if you're clear about what you're asking for']}
        purpose="Life design is not a solo project. The authors are emphatic: people who do this with a team get dramatically better results than people who do it alone. Not because the team tells you what to do, but because thinking out loud with others surfaces things you can't see by yourself."
      />
      <ReadingSection id="ex8">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-3">📖 Read First: Chapter 11 — Building a Team</p>
        <p>Life design is not a solo project. The authors argue that one of the most important things you can do is build a small team of people who will engage seriously with your process — not cheerleaders, not people who tell you you're doing great, but people who will ask hard questions and hold you accountable to the work.</p>
        <p className="mt-3">Three kinds of team members:</p>
        <ul className="mt-2 space-y-3 text-sm">
          <li><strong>Supporters</strong> — people who are genuinely invested in your wellbeing and your design process. They hold space, encourage you to keep going, and care about the outcome without pushing their agenda onto it.</li>
          <li><strong>Players</strong> — people you actively do things with. Prototype partners. Co-experimenters. People who will try new things alongside you, not just from the sidelines.</li>
          <li><strong>Intimates</strong> — close family and friends who are most directly affected by your choices. These people need to be on your team — not just informed of your decisions after the fact. If they're going to live with the consequences of your life design, they should be part of the process.</li>
        </ul>
        <p className="mt-3">The team operates by four ground rules:</p>
        <ul className="mt-2 space-y-2 text-sm">
          <li><strong>Respectful</strong> — no judgment of life choices. Everyone gets to pursue their own design.</li>
          <li><strong>Confidential</strong> — what's shared in the team stays there. People need to feel safe being honest.</li>
          <li><strong>Participative</strong> — everyone engages. No passive audiences. Everyone shares, not just one person presenting.</li>
          <li><strong>Generative</strong> — the team opens possibilities. It asks questions and offers ideas. It does not evaluate, advise, or tell you what you should do.</li>
        </ul>
        <p className="mt-3">The authors recommend meeting quarterly or monthly — not to report progress but to prototype together, think out loud, and keep each other honest about whether you're actually doing the work. The structure of your meetings matters: how you open, what you share, and how you close. Use the meeting structure field below to design your format.</p>
      </ReadingSection>

      {/* Team rules */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {TEAM_RULES.map(r => (
          <div key={r.label} className="bg-teal-50 rounded-xl p-4">
            <p className="font-semibold text-teal-800 text-sm mb-1">{r.label}</p>
            <p className="text-xs text-teal-600">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Team member sections */}
      <div className="space-y-5 mb-6">
        {ROLES.map(role => {
          const roleMembers = members.map((m, i) => ({ ...m, idx: i })).filter(m => m.role === role.key)
          return (
            <div key={role.key} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span>{role.emoji}</span> {role.label}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">{role.desc}</p>
                </div>
                <button onClick={() => addMember(role.key)} className="text-sm text-teal-600 hover:text-teal-800">+ Add</button>
              </div>

              {roleMembers.length === 0 && (
                <p className="text-sm text-gray-300 italic">No {role.label.toLowerCase()} added yet.</p>
              )}

              <div className="space-y-3">
                {roleMembers.map(m => (
                  <div key={m.idx} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input className="input text-sm" placeholder="Name" value={m.name} onChange={e => updateMember(m.idx, 'name', e.target.value)} />
                      <input className="input text-sm" placeholder="What they bring to your team" value={m.note} onChange={e => updateMember(m.idx, 'note', e.target.value)} />
                    </div>
                    <button onClick={() => removeMember(m.idx)} className="text-gray-300 hover:text-red-400 mt-2.5">×</button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Meeting structure */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Meeting Structure</h2>
        <label className="block text-xs text-gray-500 mb-1">How will you structure your team meetings?</label>
        <p className="text-xs text-gray-400 mb-2">The authors recommend meeting monthly or quarterly. Think about: How often? Where? Who hosts? How do you open — check-ins, a question? What does each person share? How do you close? The more specific the structure, the more likely it actually happens.</p>
        <textarea className="textarea" rows={4} placeholder="e.g. Monthly dinners, rotating host, each person shares one update and one ask…" value={meetingStructure} onChange={e => setMeetingStructure(e.target.value)} />
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save my responses'}
        </button>
      </div>

      {partnerMembers && (
        <PartnerView label={`${partnerName}'s Team`}>
          {ROLES.map(role => {
            const pm = partnerMembers.filter(m => m.role === role.key)
            if (!pm.length) return null
            return (
              <div key={role.key} className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{role.emoji} {role.label}</p>
                {pm.map(m => (
                  <div key={m.id} className="flex gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">{m.name}</span>
                    {m.note && <span className="text-sm text-gray-400">— {m.note}</span>}
                  </div>
                ))}
              </div>
            )
          })}
          {partnerMeeting && (
            <div className="mt-3 pt-3 border-t border-teal-100">
              <p className="text-xs font-semibold text-gray-400 mb-1">Meeting structure</p>
              <p className="text-sm text-gray-600">{partnerMeeting}</p>
            </div>
          )}
        </PartnerView>
      )}
    </div>
  )
}
