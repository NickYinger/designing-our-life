-- Designing Our Life — Supabase Schema
-- Run this in the Supabase SQL Editor

-- Generic responses (exercises 1, 2, 6, 8 and misc fields)
create table if not exists responses (
  id uuid default gen_random_uuid() primary key,
  user_name text not null,
  exercise_id text not null,
  field_key text not null,
  value text,
  updated_at timestamptz default now(),
  unique(user_name, exercise_id, field_key)
);

-- Good Time Journal entries (Exercise 3)
create table if not exists journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_name text not null,
  date date not null,
  activity text not null,
  engagement integer not null default 50,
  energy integer not null default 50,
  flow boolean default false,
  aeiou_activities text,
  aeiou_environments text,
  aeiou_interactions text,
  aeiou_objects text,
  aeiou_users_field text,
  created_at timestamptz default now()
);

-- Mind maps (Exercise 4)
create table if not exists mind_maps (
  id uuid default gen_random_uuid() primary key,
  user_name text not null,
  map_type text not null,
  nodes_json jsonb default '{}',
  highlighted_words text[] default '{}',
  job_title text,
  job_description text,
  updated_at timestamptz default now(),
  unique(user_name, map_type)
);

-- Odyssey plans (Exercise 5)
create table if not exists odyssey_plans (
  id uuid default gen_random_uuid() primary key,
  user_name text not null,
  plan_number integer not null,
  title text,
  milestones_json jsonb default '{}',
  questions_json jsonb default '[]',
  gauges_json jsonb default '{}',
  updated_at timestamptz default now(),
  unique(user_name, plan_number)
);

-- Failure log (Exercise 7)
create table if not exists failure_log (
  id uuid default gen_random_uuid() primary key,
  user_name text not null,
  failure text not null,
  category text not null,
  insight text,
  created_at timestamptz default now()
);

-- Team members (Exercise 8)
create table if not exists team_members (
  id uuid default gen_random_uuid() primary key,
  user_name text not null,
  role text not null,
  name text not null,
  note text,
  created_at timestamptz default now()
);

-- Enable RLS on all tables (permissive — anon key can do everything)
alter table responses enable row level security;
alter table journal_entries enable row level security;
alter table mind_maps enable row level security;
alter table odyssey_plans enable row level security;
alter table failure_log enable row level security;
alter table team_members enable row level security;

create policy "Allow all for anon" on responses for all using (true) with check (true);
create policy "Allow all for anon" on journal_entries for all using (true) with check (true);
create policy "Allow all for anon" on mind_maps for all using (true) with check (true);
create policy "Allow all for anon" on odyssey_plans for all using (true) with check (true);
create policy "Allow all for anon" on failure_log for all using (true) with check (true);
create policy "Allow all for anon" on team_members for all using (true) with check (true);
