create table entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, date)
);

alter table entries enable row level security;

create policy "Users can view their own entries"
  on entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on entries for delete
  using (auth.uid() = user_id);

create table sticky_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  category text not null check (category in ('objective', 'short-term', 'long-term', 'reminder')),
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table sticky_notes enable row level security;

create policy "Users can view their own sticky notes"
  on sticky_notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sticky notes"
  on sticky_notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sticky notes"
  on sticky_notes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sticky notes"
  on sticky_notes for delete
  using (auth.uid() = user_id);
