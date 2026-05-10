export interface Exercise {
  id: string
  number: number
  title: string
  slug: string
  description: string
}

export const EXERCISES: Exercise[] = [
  { id: 'ex1', number: 1, title: 'Health / Work / Play / Love', slug: '1-dashboard', description: 'A snapshot of where you are now across four life areas.' },
  { id: 'ex2', number: 2, title: 'Workview & Lifeview', slug: '2-workview', description: 'Your philosophy of work and your worldview — the compass for your life design.' },
  { id: 'ex3', number: 3, title: 'Good Time Journal', slug: '3-journal', description: 'Notice when you are engaged, energized, and in flow.' },
  { id: 'ex4', number: 4, title: 'Mind Mapping', slug: '4-mindmap', description: 'Open up your idea space through free word association.' },
  { id: 'ex5', number: 5, title: 'Odyssey Plan', slug: '5-odyssey', description: 'Three genuinely different alternative versions of the next five years.' },
  { id: 'ex6', number: 6, title: 'Prototyping', slug: '6-prototyping', description: 'Test your ideas before committing through conversations and experiences.' },
  { id: 'ex7', number: 7, title: 'Reframing Failure', slug: '7-failure', description: 'Convert failures into insights and growth.' },
  { id: 'ex8', number: 8, title: 'Building a Team', slug: '8-team', description: 'Build your life design team for support, accountability, and perspective.' },
]

export interface JournalEntry {
  id: string
  user_name: string
  date: string
  activity: string
  engagement: number
  energy: number
  flow: boolean
  aeiou_activities?: string
  aeiou_environments?: string
  aeiou_interactions?: string
  aeiou_objects?: string
  aeiou_users_field?: string
  created_at: string
}

export interface OdysseyPlan {
  id?: string
  user_name: string
  plan_number: number
  title: string
  milestones_json: Record<string, string>
  questions_json: string[]
  gauges_json: {
    resources: number
    likability: number
    confidence: number
    coherence: number
  }
}

export interface FailureEntry {
  id: string
  user_name: string
  failure: string
  category: 'screwup' | 'weakness' | 'growth'
  insight: string
  created_at: string
}

export interface TeamMember {
  id: string
  user_name: string
  role: 'supporter' | 'player' | 'intimate'
  name: string
  note: string
  created_at: string
}

export interface MindMapNode {
  id: string
  text: string
  children: MindMapNode[]
}
