-- Create vehicles table
create table public.vehicles (
  id uuid default gen_random_uuid() primary key,
  make text not null, -- e.g., Peugeot, Renault, BMW
  model text not null, -- e.g., 208, Clio, Serie 3
  finish text default '', -- e.g., GT Line, R.S. Line
  year integer not null,
  mileage integer not null,
  price integer not null,
  fuel_type text not null, -- e.g., Essence, Diesel, Hybride, Électrique
  transmission text not null, -- e.g., Manuelle, Automatique
  description text default '',
  image_urls text[] default '{}',
  status text default 'available' check (status in ('available', 'sold', 'reserved')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.vehicles enable row level security;

-- Create basic RLS policies for vehicles
create policy "Vehicles are viewable by everyone." on public.vehicles
  for select using (true);

create policy "Vehicles can be inserted by authenticated users only." on public.vehicles
  for insert to authenticated with check (true);

create policy "Vehicles can be updated by authenticated users only." on public.vehicles
  for update to authenticated using (true);

create policy "Vehicles can be deleted by authenticated users only." on public.vehicles
  for delete to authenticated using (true);

-- Create bucket for images (Depends on Supabase storage extension)
insert into storage.buckets (id, name, public) 
values ('vehicles_images', 'vehicles_images', true)
on conflict (id) do nothing;

-- Create Storage RLS policies
create policy "Images are publicly accessible." 
  on storage.objects for select using ( bucket_id = 'vehicles_images' );

create policy "Authenticated users can upload images." 
  on storage.objects for insert to authenticated with check ( bucket_id = 'vehicles_images' );

create policy "Authenticated users can update images." 
  on storage.objects for update to authenticated using ( bucket_id = 'vehicles_images' );

create policy "Authenticated users can delete images." 
  on storage.objects for delete to authenticated using ( bucket_id = 'vehicles_images' );
