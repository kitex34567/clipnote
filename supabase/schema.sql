-- Run this in your Supabase SQL Editor

create extension if not exists "uuid-ossp";

create table clips (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  content text not null,
  source_url text,
  source_title text,
  type text not null default 'text', -- 'text' | 'url' | 'image'
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security: users only see their own clips
alter table clips enable row level security;

create policy "Users see own clips"
  on clips for select
  using (auth.uid() = user_id);

create policy "Users insert own clips"
  on clips for insert
  with check (auth.uid() = user_id);

create policy "Users update own clips"
  on clips for update
  using (auth.uid() = user_id);

create policy "Users delete own clips"
  on clips for delete
  using (auth.uid() = user_id);

-- Allow anonymous inserts via API key (for browser extension before login)
-- Disabled by default, enable if needed

-- Enable realtime for the clips table
alter publication supabase_realtime add table clips;

-- Full-text search index
create index clips_content_fts on clips using gin(to_tsvector('english', content));
