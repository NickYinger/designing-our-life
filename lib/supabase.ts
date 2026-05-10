import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Generic response helpers
export async function saveResponse(userName: string, exerciseId: string, fieldKey: string, value: string) {
  const { error } = await supabase
    .from('responses')
    .upsert({ user_name: userName, exercise_id: exerciseId, field_key: fieldKey, value, updated_at: new Date().toISOString() }, { onConflict: 'user_name,exercise_id,field_key' })
  return error
}

export async function getResponses(userName: string, exerciseId: string): Promise<Record<string, string>> {
  const { data } = await supabase
    .from('responses')
    .select('field_key, value')
    .eq('user_name', userName)
    .eq('exercise_id', exerciseId)
  if (!data) return {}
  return Object.fromEntries(data.map(r => [r.field_key, r.value ?? '']))
}

export async function getPartnerResponses(userName: string, exerciseId: string): Promise<Record<string, string>> {
  const partner = userName === 'nick' ? 'elise' : 'nick'
  return getResponses(partner, exerciseId)
}

export async function getExerciseCompletion(userName: string): Promise<Record<string, boolean>> {
  const { data } = await supabase
    .from('responses')
    .select('exercise_id, field_key')
    .eq('user_name', userName)
    .eq('field_key', '_completed')
  if (!data) return {}
  return Object.fromEntries(data.map(r => [r.exercise_id, true]))
}
