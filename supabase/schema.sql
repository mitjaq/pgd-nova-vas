-- PGD Nova vas - Supabase Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Articles (Novice)
create table if not exists articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  image_url text,
  published boolean not null default false,
  author text not null default 'Admin',
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Interventions (Intervencije)
create table if not exists interventions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  date date not null,
  location text not null,
  type text not null check (type in ('pozar', 'tehnicna', 'poplava', 'iskanje', 'vaja', 'drugo')),
  created_at timestamptz not null default now()
);

-- Gallery Images (Galerija)
create table if not exists gallery_images (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  caption text,
  category text,
  created_at timestamptz not null default now()
);

-- Contact Messages (Kontaktna sporočila)
create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS Policies
alter table articles enable row level security;
alter table interventions enable row level security;
alter table gallery_images enable row level security;
alter table contact_messages enable row level security;

-- Public read access for articles, interventions, gallery
create policy "Public read articles" on articles for select using (published = true);
create policy "Auth full access articles" on articles for all using (auth.role() = 'authenticated');

create policy "Public read interventions" on interventions for select using (true);
create policy "Auth full access interventions" on interventions for all using (auth.role() = 'authenticated');

create policy "Public read gallery" on gallery_images for select using (true);
create policy "Auth full access gallery" on gallery_images for all using (auth.role() = 'authenticated');

-- Contact messages: anyone can insert, only auth can read
create policy "Anyone can insert contact" on contact_messages for insert with check (true);
create policy "Auth read contact" on contact_messages for select using (auth.role() = 'authenticated');
create policy "Auth update contact" on contact_messages for update using (auth.role() = 'authenticated');

-- Sample data
insert into articles (title, slug, excerpt, content, published, author, published_at) values
(
  'Uspešna gasilska vaja 2024',
  'uspesna-gasilska-vaja-2024',
  'Naši gasilci so uspešno opravili letno gasilsko vajo z odlično oceno.',
  'V soboto, 15. junija 2024, smo izvedli letno gasilsko vajo, ki jo je vodil poveljnik Peter Žagar. Vaja je potekala pri stari šoli v Novi Vasi, kjer smo simulirali požar v stanovanjski hiši.

Gasilci so se odlično odrezali in pokazali visoko stopnjo pripravljenosti. Posredovalo je 18 gasilcev z dvema voziloma.

Posebej pohvalni so bili mlajši gasilci, ki so prvič nastopili na takšni vaji. Župan občine Markovci je prišel osebno čestitati vsem udeležencem.',
  true,
  'PGD Nova vas',
  now() - interval '5 days'
),
(
  'Nakup novega zaščitnega oblačila',
  'nakup-novega-zascitnega-oblacila',
  'Zahvaljujoč donacijam krajanov smo nabavili novo zaščitno oblačilo za 10 gasilcev.',
  'Z veseljem sporočamo, da smo uspeli nabaviti novo zaščitno oblačilo za 10 naših gasilcev. Nakup je bil možen zahvaljujoč donacijam krajanov in podpori Občine Markovci.

Nova oblačila izpolnjujejo vse evropske standarde za zaščito gasilcev in bodo našim članom zagotovila boljšo varnost pri posredovanjih.',
  true,
  'PGD Nova vas',
  now() - interval '15 days'
);

insert into interventions (title, description, date, location, type) values
('Požar v gozdu nad Markovcih', 'Gasilci smo posredovali pri gašenju gozdnega požara. Ogenj je zajel okoli 2 hektarjev gozda. Požar je bil pod nadzorom po 3 urah.', '2024-06-10', 'Markovci - Gozd nad mestom', 'pozar'),
('Prometna nesreča na G1', 'Tehnična pomoč pri prometni nesreči. Reševanje poškodovanca iz vozila s hidravličnim orodjem.', '2024-05-22', 'Cesta G1, km 145', 'tehnicna'),
('Poplava kleti v Novem trgu', 'Črpanje vode iz poplavljene kleti stanovanjske hiše.', '2024-04-08', 'Novi trg 12, Markovci', 'poplava'),
('Letna gasilska vaja', 'Letna taktična vaja z simulacijo požara stanovanjskega objekta.', '2024-06-15', 'Stara šola, Nova vas', 'vaja');

-- Reservations (Rezervacije)
create table if not exists reservations (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('dvorana', 'piknik')),
  date date not null,
  time_slot text check (time_slot in ('dopoldne', 'popoldne', 'vecer', 'celdan')),
  name text not null,
  email text not null,
  phone text not null,
  purpose text not null,
  notes text,
  status text not null default 'caka' check (status in ('caka', 'potrjeno', 'zavrnjeno')),
  admin_notes text,
  created_at timestamptz not null default now()
);

alter table reservations enable row level security;

-- Anyone can submit a reservation
create policy "Anyone can insert reservation" on reservations
  for insert with check (true);

-- Public can read date/type/time_slot of non-cancelled reservations (for availability check)
create policy "Public read reservation availability" on reservations
  for select using (status != 'zavrnjeno');

-- Authenticated users have full access
create policy "Auth full access reservations" on reservations
  for all using (auth.role() = 'authenticated');
