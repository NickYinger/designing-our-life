'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUser } from '@/contexts/UserContext'
import { supabase } from '@/lib/supabase'
import { saveResponse } from '@/lib/supabase'
import ReadingSection from '@/components/ReadingSection'
import BeforeYouBegin from '@/components/BeforeYouBegin'
import { MindMapNode } from '@/types'

const EX_ID = 'ex4'
const MAP_TYPES = [
  { key: 'engaged', label: 'Engaged', prompt: 'An activity you were highly engaged in' },
  { key: 'energized', label: 'Energized', prompt: 'Something that gave you energy' },
  { key: 'flow', label: 'Flow', prompt: 'An experience where you were in flow' },
]

function generateId() { return Math.random().toString(36).slice(2) }

function MindMap({ rootTopic, nodes, onChange }: { rootTopic: string; nodes: MindMapNode[]; onChange: (n: MindMapNode[]) => void }) {
  const addChild = (parentId: string | null, siblings: MindMapNode[], setText?: string): MindMapNode[] => {
    if (parentId === null) {
      return [...siblings, { id: generateId(), text: setText ?? '', children: [] }]
    }
    return siblings.map(n => n.id === parentId
      ? { ...n, children: [...n.children, { id: generateId(), text: '', children: [] }] }
      : { ...n, children: addChild(parentId, n.children) }
    )
  }

  const updateText = (id: string, text: string, nodes: MindMapNode[]): MindMapNode[] =>
    nodes.map(n => n.id === id ? { ...n, text } : { ...n, children: updateText(id, text, n.children) })

  const removeNode = (id: string, nodes: MindMapNode[]): MindMapNode[] =>
    nodes.filter(n => n.id !== id).map(n => ({ ...n, children: removeNode(id, n.children) }))

  const renderNodes = (nodeList: MindMapNode[], depth: number) => (
    <div className={`space-y-2 ${depth > 0 ? 'ml-6 pl-4 border-l-2 border-teal-100' : ''}`}>
      {nodeList.map(node => (
        <div key={node.id}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full shrink-0 ${depth === 0 ? 'bg-teal-400' : depth === 1 ? 'bg-teal-300' : 'bg-teal-200'}`} />
            <input
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
              placeholder={depth === 0 ? 'Branch word…' : 'Word…'}
              value={node.text}
              onChange={e => onChange(updateText(node.id, e.target.value, nodes))}
            />
            {depth < 2 && (
              <button onClick={() => onChange(addChild(node.id, nodes))} className="text-xs text-teal-600 hover:text-teal-800 px-2 py-1 rounded hover:bg-teal-50">+ branch</button>
            )}
            <button onClick={() => onChange(removeNode(node.id, nodes))} className="text-xs text-red-400 hover:text-red-600 px-1">×</button>
          </div>
          {node.children.length > 0 && renderNodes(node.children, depth + 1)}
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="text-center mb-4">
        <div className="inline-block bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium">{rootTopic || 'Your topic'}</div>
      </div>
      {renderNodes(nodes, 0)}
      <button onClick={() => onChange(addChild(null, nodes))} className="mt-3 text-sm text-teal-600 hover:text-teal-800 flex items-center gap-1">
        <span className="text-lg leading-none">+</span> Add branch
      </button>
    </div>
  )
}

export default function Ex4Page() {
  const { user } = useUser()
  const [mapData, setMapData] = useState<Record<string, { nodes: MindMapNode[]; highlighted: string[]; jobTitle: string; jobDesc: string; rootTopic: string }>>({
    engaged: { nodes: [], highlighted: [], jobTitle: '', jobDesc: '', rootTopic: '' },
    energized: { nodes: [], highlighted: [], jobTitle: '', jobDesc: '', rootTopic: '' },
    flow: { nodes: [], highlighted: [], jobTitle: '', jobDesc: '', rootTopic: '' },
  })
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!user) return
    MAP_TYPES.forEach(async ({ key }) => {
      const { data } = await supabase.from('mind_maps').select('*').eq('user_name', user).eq('map_type', key).single()
      if (data) {
        setMapData(m => ({ ...m, [key]: { nodes: data.nodes_json ?? [], highlighted: data.highlighted_words ?? [], jobTitle: data.job_title ?? '', jobDesc: data.job_description ?? '', rootTopic: (data.nodes_json as { rootTopic?: string })?.rootTopic ?? '' } }))
      }
    })
  }, [user])

  const update = (key: string, field: string, val: unknown) =>
    setMapData(m => ({ ...m, [key]: { ...m[key], [field]: val } }))

  const saveMap = async (key: string) => {
    if (!user) return
    setSaving(s => ({ ...s, [key]: true }))
    const d = mapData[key]
    await supabase.from('mind_maps').upsert({
      user_name: user, map_type: key,
      nodes_json: d.nodes,
      highlighted_words: d.highlighted,
      job_title: d.jobTitle,
      job_description: d.jobDesc,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_name,map_type' })
    await saveResponse(user, EX_ID, '_completed', 'true')
    setSaving(s => ({ ...s, [key]: false }))
    setSaved(s => ({ ...s, [key]: true }))
  }

  if (!user) return <div className="text-gray-400 text-sm">Select who you are in the sidebar to begin.</div>

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">Exercise 4</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Mind Mapping</h1>
        <p className="text-gray-500 text-sm">Use free word association to open up your idea space.</p>
      </div>

      <BeforeYouBegin
        chapter="Designing Your Life — Chapter 4: Getting Unstuck"
        time="45–60 minutes"
        youNeed={['At least 1 week of Good Time Journal entries to draw from', 'Speed — the point is to go faster than your inner critic']}
        purpose="When you're stuck, thinking harder doesn't help. Mind mapping lets you think sideways — using free word association to surface ideas that rational thinking would filter out. This exercise often reveals what you're actually drawn toward, by sneaking past your self-censorship."
      />
      <ReadingSection id="ex4">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-3">📖 Read First: Chapter 4 — Getting Unstuck</p>
        <p>When you're stuck, thinking harder usually doesn't help — you're already trapped inside your own habitual patterns of thought. Mind mapping is a technique for thinking sideways: using rapid, uncritical word association to surface ideas that rational, linear thinking would filter out before they ever reach the surface.</p>
        <p className="mt-3">The process is deliberately fast and deliberately uncritical. You write a central word — something from your Good Time Journal that engaged or energized you — then quickly branch out with any related word that comes to mind, then branch from those. The key rule: <strong>move faster than your inner editor</strong>. You're not evaluating, you're generating. Weird associations are better than safe ones.</p>
        <p className="mt-3">After completing a map, step back and scan the outermost words — the ones furthest from the center. These are often the most surprising, and the most interesting. The authors ask you to highlight 3-5 that jump out at you, even if you're not sure why. Especially if you're not sure why.</p>
        <p className="mt-3">Then try combining those highlighted words into an <strong>imaginary job title</strong> — something that captures those qualities even if it doesn't exist in the real world. "Chief Flow Architect of Human Systems." "Wilderness-Based Organizational Designer." These don't need to be realistic. They need to be honest about what draws you.</p>
        <p className="mt-3">This exercise often reveals a direction that felt too vague or ambitious to name directly — the map gets around your self-censorship by approaching it sideways.</p>
        <p className="mt-3">You'll do three maps, each rooted in a different signal from your Good Time Journal: one from an activity you were highly <strong>engaged</strong> in, one that gave you <strong>energy</strong>, and one where you experienced <strong>flow</strong>.</p>
      </ReadingSection>

      <div className="space-y-8">
        {MAP_TYPES.map(({ key, label, prompt }) => {
          const d = mapData[key]
          return (
            <div key={key} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="mb-4">
                <h2 className="font-semibold text-gray-900 mb-1">Map {MAP_TYPES.indexOf({ key, label, prompt }) + 1}: {label}</h2>
                <p className="text-xs text-gray-400">{prompt}</p>
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1">Central topic (from your journal)</label>
                <input className="input" placeholder="e.g. Building the app, Cooking dinner, Playing guitar…" value={d.rootTopic} onChange={e => update(key, 'rootTopic', e.target.value)} />
              </div>

              <MindMap rootTopic={d.rootTopic} nodes={d.nodes} onChange={n => update(key, 'nodes', n)} />

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">3 outer-ring words that jump out</label>
                  <input className="input" placeholder="word1, word2, word3" value={d.highlighted.join(', ')} onChange={e => update(key, 'highlighted', e.target.value.split(',').map(s => s.trim()))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imaginative job title combining those words</label>
                  <input className="input" placeholder="e.g. Chief Flow Architect of Human Systems" value={d.jobTitle} onChange={e => update(key, 'jobTitle', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Napkin sketch — what would this role actually look like?</label>
                  <textarea className="textarea" rows={3} value={d.jobDesc} onChange={e => update(key, 'jobDesc', e.target.value)} />
                </div>
              </div>

              <div className="mt-4">
                <button onClick={() => saveMap(key)} disabled={saving[key]} className="btn-primary">
                  {saving[key] ? 'Saving…' : saved[key] ? 'Saved ✓' : 'Save this map'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
