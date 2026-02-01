-- Create contact_submissions table
create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  company text not null,
  phone text,
  message text not null,
  budget text,
  timeline text,
  status text default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contact_submissions enable row level security;

-- Create policy to allow inserts from anon (public)
create policy "Allow public inserts"
  on public.contact_submissions
  for insert
  with check (true);

-- Create policy to allow only service_role (admin) to view/update
create policy "Allow admin select"
  on public.contact_submissions
  for select
  using (auth.role() = 'service_role');

create policy "Allow admin update"
  on public.contact_submissions
  for update
  using (auth.role() = 'service_role');
