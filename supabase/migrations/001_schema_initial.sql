-- ============================================
-- QuotiPro — Schéma initial
-- ============================================

-- Extension UUID
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (lié à Supabase Auth)
-- ============================================
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  company_name text not null,
  siret text,
  address text,
  city text,
  postal_code text,
  phone text,
  email text,
  logo_url text,
  decennale_number text,
  decennale_expiry date,
  tva_number text,
  tva_rate decimal default 20,
  hourly_rate decimal,
  payment_terms int default 30,
  trade text,
  plan text default 'free' check (plan in ('free', 'pro', 'business', 'premium')),
  onboarding_done boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- CLIENTS
-- ============================================
create table clients (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles on delete cascade,
  name text not null,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  type text default 'particulier' check (type in ('particulier', 'professionnel')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_clients_profile on clients(profile_id);

-- ============================================
-- PRESTATIONS (catalogue personnel)
-- ============================================
create table prestations (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles on delete cascade,
  name text not null,
  description text,
  unit_price decimal not null,
  unit text default 'h' check (unit in ('h', 'forfait', 'm2', 'm', 'piece', 'kg', 'lot')),
  category text,
  created_at timestamptz default now()
);

create index idx_prestations_profile on prestations(profile_id);

-- ============================================
-- CHANTIERS
-- ============================================
create table chantiers (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles on delete cascade,
  client_id uuid references clients on delete set null,
  name text not null,
  address text,
  status text default 'en_cours' check (status in ('en_cours', 'termine', 'en_pause')),
  start_date date,
  end_date date,
  estimated_hours decimal,
  actual_hours decimal default 0,
  estimated_amount decimal,
  actual_amount decimal default 0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_chantiers_profile on chantiers(profile_id);
create index idx_chantiers_client on chantiers(client_id);

-- ============================================
-- DEVIS
-- ============================================
create table devis (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles on delete cascade,
  client_id uuid references clients on delete set null,
  chantier_id uuid references chantiers on delete set null,
  reference text not null,
  objet text,
  lieu_chantier text,
  status text default 'brouillon' check (status in ('brouillon', 'envoye', 'vu', 'accepte', 'refuse')),
  created_at timestamptz default now(),
  sent_at timestamptz,
  valid_until date,
  total_ht decimal default 0,
  tva_amount decimal default 0,
  total_ttc decimal default 0,
  notes text,
  pdf_url text
);

create index idx_devis_profile on devis(profile_id);
create index idx_devis_client on devis(client_id);
create unique index idx_devis_reference on devis(profile_id, reference);

-- ============================================
-- LIGNES DE DEVIS
-- ============================================
create table devis_lignes (
  id uuid primary key default uuid_generate_v4(),
  devis_id uuid not null references devis on delete cascade,
  description text not null,
  quantity decimal not null default 1,
  unit text default 'h',
  unit_price decimal not null,
  tva_rate decimal default 20,
  total decimal not null,
  order_index int default 0
);

create index idx_devis_lignes_devis on devis_lignes(devis_id);

-- ============================================
-- FACTURES
-- ============================================
create table factures (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles on delete cascade,
  devis_id uuid references devis on delete set null,
  client_id uuid references clients on delete set null,
  reference text not null,
  type text default 'finale' check (type in ('acompte', 'situation', 'solde', 'finale')),
  status text default 'emise' check (status in ('emise', 'envoyee', 'payee', 'impayee')),
  issued_at date default current_date,
  due_date date,
  paid_at date,
  total_ht decimal default 0,
  tva_amount decimal default 0,
  total_ttc decimal default 0,
  pdf_url text,
  facturx_xml text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_factures_profile on factures(profile_id);
create index idx_factures_client on factures(client_id);
create unique index idx_factures_reference on factures(profile_id, reference);

-- ============================================
-- EMPLOYES
-- ============================================
create table employes (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  role text default 'ouvrier' check (role in ('ouvrier', 'etam', 'cadre')),
  coefficient text,
  hourly_rate decimal,
  contract_type text default 'cdi' check (contract_type in ('cdi', 'cdd', 'interim')),
  start_date date,
  convention_collective text,
  created_at timestamptz default now()
);

create index idx_employes_profile on employes(profile_id);

-- ============================================
-- FICHES DE PAIE
-- ============================================
create table fiches_paie (
  id uuid primary key default uuid_generate_v4(),
  employe_id uuid not null references employes on delete cascade,
  profile_id uuid not null references profiles on delete cascade,
  period_month int not null check (period_month between 1 and 12),
  period_year int not null,
  base_hours decimal default 151.67,
  overtime_hours decimal default 0,
  gross_salary decimal,
  net_salary decimal,
  intemperies_days int default 0,
  conges_days_taken int default 0,
  pdf_url text,
  created_at timestamptz default now()
);

create index idx_fiches_paie_employe on fiches_paie(employe_id);
create unique index idx_fiches_paie_unique on fiches_paie(employe_id, period_month, period_year);

-- ============================================
-- HEURES CHANTIER
-- ============================================
create table chantier_heures (
  id uuid primary key default uuid_generate_v4(),
  chantier_id uuid not null references chantiers on delete cascade,
  employe_id uuid references employes on delete set null,
  date date not null default current_date,
  hours decimal not null,
  notes text,
  created_at timestamptz default now()
);

create index idx_chantier_heures_chantier on chantier_heures(chantier_id);

-- ============================================
-- CONVERSATIONS
-- ============================================
create table conversations (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles on delete cascade,
  title text,
  context jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_conversations_profile on conversations(profile_id);

-- ============================================
-- MESSAGES (séparés pour performance)
-- ============================================
create table messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create index idx_messages_conversation on messages(conversation_id);
create index idx_messages_created on messages(conversation_id, created_at);

-- ============================================
-- RELANCES
-- ============================================
create table relances (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles on delete cascade,
  devis_id uuid references devis on delete cascade,
  facture_id uuid references factures on delete cascade,
  scheduled_at timestamptz not null,
  sent_at timestamptz,
  type text not null check (type in ('devis', 'impaye')),
  created_at timestamptz default now()
);

create index idx_relances_profile on relances(profile_id);
create index idx_relances_scheduled on relances(scheduled_at) where sent_at is null;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table profiles enable row level security;
alter table clients enable row level security;
alter table prestations enable row level security;
alter table chantiers enable row level security;
alter table devis enable row level security;
alter table devis_lignes enable row level security;
alter table factures enable row level security;
alter table employes enable row level security;
alter table fiches_paie enable row level security;
alter table chantier_heures enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table relances enable row level security;

-- Policies : chaque utilisateur ne voit que ses données
create policy "profiles_own" on profiles for all using (id = auth.uid());
create policy "clients_own" on clients for all using (profile_id = auth.uid());
create policy "prestations_own" on prestations for all using (profile_id = auth.uid());
create policy "chantiers_own" on chantiers for all using (profile_id = auth.uid());
create policy "devis_own" on devis for all using (profile_id = auth.uid());
create policy "devis_lignes_own" on devis_lignes for all
  using (devis_id in (select id from devis where profile_id = auth.uid()));
create policy "factures_own" on factures for all using (profile_id = auth.uid());
create policy "employes_own" on employes for all using (profile_id = auth.uid());
create policy "fiches_paie_own" on fiches_paie for all using (profile_id = auth.uid());
create policy "chantier_heures_own" on chantier_heures for all
  using (chantier_id in (select id from chantiers where profile_id = auth.uid()));
create policy "conversations_own" on conversations for all using (profile_id = auth.uid());
create policy "messages_own" on messages for all
  using (conversation_id in (select id from conversations where profile_id = auth.uid()));
create policy "relances_own" on relances for all using (profile_id = auth.uid());

-- ============================================
-- FONCTION : updated_at automatique
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tr_profiles_updated before update on profiles for each row execute function update_updated_at();
create trigger tr_clients_updated before update on clients for each row execute function update_updated_at();
create trigger tr_chantiers_updated before update on chantiers for each row execute function update_updated_at();
create trigger tr_factures_updated before update on factures for each row execute function update_updated_at();
create trigger tr_conversations_updated before update on conversations for each row execute function update_updated_at();

-- ============================================
-- FONCTION : créer profil à l'inscription
-- ============================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, company_name)
  values (new.id, new.email, '');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
