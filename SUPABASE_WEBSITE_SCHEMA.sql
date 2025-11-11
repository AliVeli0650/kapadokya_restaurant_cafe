-- SUPABASE_WEBSITE_SCHEMA.sql
-- Basit menu foto yonetimi + Detayli urun menusu
-- 1) menu_images: Hazir menu fotograflari
-- 2) dish_categories + dishes: Her urunun fotografli detayli menusu

-- 1. Hazir menu fotograflari tablosu
create table if not exists menu_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  position int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Detayli urun menusu icin tablolar
create table if not exists dish_categories (
  id uuid primary key default gen_random_uuid(),
  name_de text not null,
  name_tr text,
  position int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists dishes (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references dish_categories(id) on delete cascade,
  name_de text not null,
  name_tr text,
  description_de text,
  description_tr text,
  price numeric(10,2) not null default 0,
  image_url text,
  position int not null default 0,
  is_active boolean not null default true,
  is_dish_of_the_day boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Eski karmasik tablolar varsa temizle (opsiyonel)
-- drop table if exists menu_items cascade;
-- drop table if exists menu_categories cascade;
-- drop view if exists public_active_menu cascade;


create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text not null,
  updated_at timestamptz default now()
);

-- 2. Seed (ornek veri) - Sadece ilk kurulumda calisir
insert into menu_images (title, image_url, position) 
select 'Hauptmenü', 'https://placehold.co/800x1200/png?text=Hauptmenu', 1
where not exists (select 1 from menu_images where title = 'Hauptmenü');

insert into menu_images (title, image_url, position) 
select 'Getränke', 'https://placehold.co/800x1200/png?text=Getranke', 2
where not exists (select 1 from menu_images where title = 'Getränke');

insert into dish_categories (name_de, name_tr, position) 
select 'Vorspeisen', 'Mezeler', 1
where not exists (select 1 from dish_categories where name_de = 'Vorspeisen');

insert into dish_categories (name_de, name_tr, position) 
select 'Hauptgerichte', 'Ana Yemekler', 2
where not exists (select 1 from dish_categories where name_de = 'Hauptgerichte');

insert into dish_categories (name_de, name_tr, position) 
select 'Getränke', 'İçecekler', 3
where not exists (select 1 from dish_categories where name_de = 'Getränke');

insert into site_settings (key, value) values
 ('lieferando_url', 'https://www.lieferando.de/en/your-restaurant-placeholder'),
 ('online_order_button_label', 'Online Bestellen')
 on conflict (key) do update set value=excluded.value;

-- 3. Indexler
create index if not exists idx_menu_images_position on menu_images(position);
create index if not exists idx_menu_images_active on menu_images(is_active) where is_active=true;
create index if not exists idx_dish_categories_position on dish_categories(position);
create index if not exists idx_dishes_category_position on dishes(category_id, position);

-- 4. RLS (gelistirme icin gevsek; production icin sikilastirilacak)
alter table menu_images enable row level security;
alter table dish_categories enable row level security;
alter table dishes enable row level security;
alter table site_settings enable row level security;

drop policy if exists "Allow read menu images" on menu_images;
drop policy if exists "Allow all dev menu images" on menu_images;
drop policy if exists "Allow read dish categories" on dish_categories;
drop policy if exists "Allow all dev dish categories" on dish_categories;
drop policy if exists "Allow read dishes" on dishes;
drop policy if exists "Allow all dev dishes" on dishes;
drop policy if exists "Allow read settings" on site_settings;
drop policy if exists "Allow all dev settings" on site_settings;

create policy "Allow read menu images" on menu_images for select using (true);
create policy "Allow all dev menu images" on menu_images for all using (true) with check (true);
create policy "Allow read dish categories" on dish_categories for select using (true);
create policy "Allow all dev dish categories" on dish_categories for all using (true) with check (true);
create policy "Allow read dishes" on dishes for select using (true);
create policy "Allow all dev dishes" on dishes for all using (true) with check (true);
create policy "Allow read settings" on site_settings for select using (true);
create policy "Allow all dev settings" on site_settings for all using (true) with check (true);

-- 5. Trigger updated_at
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;$$ language plpgsql;

drop trigger if exists trg_menu_images_updated on menu_images;
drop trigger if exists trg_dish_categories_updated on dish_categories;
drop trigger if exists trg_dishes_updated on dishes;
drop trigger if exists trg_site_settings_updated on site_settings;

create trigger trg_menu_images_updated
before update on menu_images
for each row execute function set_updated_at();

create trigger trg_dish_categories_updated
before update on dish_categories
for each row execute function set_updated_at();

create trigger trg_dishes_updated
before update on dishes
for each row execute function set_updated_at();

-- 6. Trigger: Sadece bir "Günün Yemeği" olmasını sağla
create or replace function ensure_single_dish_of_the_day() returns trigger as $$
begin
  if new.is_dish_of_the_day = true then
    -- Diğer tüm yemeklerin günün yemeği işaretini kaldır
    update dishes set is_dish_of_the_day = false where id != new.id and is_dish_of_the_day = true;
  end if;
  return new;
end;$$ language plpgsql;

drop trigger if exists trg_single_dish_of_day on dishes;
create trigger trg_single_dish_of_day
before insert or update on dishes
for each row execute function ensure_single_dish_of_the_day();

create trigger trg_site_settings_updated
before update on site_settings
for each row execute function set_updated_at();


-- 6. Storage RLS
-- Bu policy'ler, dosya yuklemesine izin verir
drop policy if exists "Allow authenticated inserts on public-media" on storage.objects;
drop policy if exists "Allow authenticated updates on public-media" on storage.objects;
drop policy if exists "Allow authenticated deletes on public-media" on storage.objects;
drop policy if exists "Allow public read access on public-media" on storage.objects;
drop policy if exists "Allow anon inserts on public-media" on storage.objects;
drop policy if exists "Allow anon updates on public-media" on storage.objects;
drop policy if exists "Allow anon deletes on public-media" on storage.objects;
drop policy if exists "Dev allow all storage objects" on storage.objects;

-- Gelistirme icin herkese izin (production'da authenticated'e sinirlayin)
create policy "Dev allow all storage objects"
on storage.objects for all to public using (true) with check (true);
