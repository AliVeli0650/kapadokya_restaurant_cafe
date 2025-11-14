-- Menu + Allergen schema extension
BEGIN;

-- Reference table for allergen/additive codes
CREATE TABLE IF NOT EXISTS public.allergens (
  code TEXT PRIMARY KEY,
  name_de TEXT,
  name_tr TEXT,
  type TEXT, -- 'allergen' | 'additive' | 'info'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Upsert seed data from current menu notes (can be refined later)
INSERT INTO public.allergens (code, name_de, name_tr, type)
VALUES
  ('a', 'Fladenbrot & Falafel: Weizenmehl, Gluten, Hefe, Wasser, Zucker und Salz', 'Pide & Falafel: Buğday unu, gluten, maya, su, şeker, tuz', 'allergen'),
  ('c', 'Rindfleisch/Döner-Zutaten (zusammengesetzt, enthält u.a.)', 'Dana eti/Döner içerikleri (bileşik içerik)', 'info'),
  ('f', 'Thunfisch: Wasser, Senf (Senfsaat enthalten), Rapsöl, modifizierte Stärke, Milcheiweiß', 'Ton balığı: Su, hardal (hardal tohumu içerir), kanola yağı, modifiye nişasta, süt proteini', 'allergen'),
  ('g', 'Nitritpökelsalz (E250), Antioxidationsmittel, Dextrose, Würze, natürliche Aromen', 'Nitritli salamura tuzu (E250), antioksidan, dekstroz, baharat, doğal aromalar', 'additive'),
  ('i', 'Elmalta-Erzeugnisse: Stärkesirup, Fruchtmark, Sojasoße (SOJA, WEIZEN), Ananassaftkonzentrat, Essigsäure (E260), Gewürze (Sellerie), Xanthan (E415), vb.', 'Elmalta ürünleri: Nişasta şurubu, meyve püresi, soya sosu (SOYA, BUĞDAY), ananas suyu konsantresi, asetik asit (E260), baharat (kereviz), ksantan (E415), vb.', 'additive'),
  ('k', 'Bulgur enthält Gluten', 'Bulgur gluten içerir', 'allergen'),
  ('l', 'Nüsse/Walnüsse/Pistazien', 'Kuruyemiş/Ceviz/Antep fıstığı', 'allergen'),
  ('1', 'Beinhaltet Zusatzstoffe', 'Katkı maddeleri içerir', 'additive'),
  ('2', 'Mit Konservierungsstoff', 'Koruyucu içerir', 'additive'),
  ('3', 'Mit Antioxidationsmittel', 'Antioksidan içerir', 'additive'),
  ('5', 'Koffeinhaltig', 'Kafein içerir', 'additive'),
  ('6', 'Mit Süßungsmittel', 'Tatlandırıcı içerir', 'additive'),
  ('7', 'Enthält eine Phenylalaninquelle', 'Fenilalanin kaynağı içerir', 'additive'),
  ('9', 'Mit Milcheiweiß', 'Süt proteini içerir', 'allergen'),
  ('14', 'Chininhaltig', 'Kinin içerir', 'additive'),
  ('15', 'Mit Säureregulatoren', 'Asitleyici/Asit düzenleyici içerir', 'additive'),
  ('16', 'Pommes: Ascorbinsäure (Antioxidationsmittel), Würze/Aromen, modifizierte Stärke, Dextrose', 'Patates kızartması: Askorbik asit (antioksidan), baharat/aroma, modifiye nişasta, dekstroz', 'additive'),
  ('17', 'Mayonnaise: (enthält Senf), Milcheiweiß, Dextrose', 'Mayonez: (hardal içerir), süt proteini, dekstroz', 'additive'),
  ('19', 'Ketchup: Tomatenmark, Zucker, Branntweinessig, modifizierte Stärke, Salz, Guarkernmehl, Gewürze, Citronensäure', 'Ketçap: Domates salçası, şeker, alkol sirkesi, modifiye nişasta, tuz, guar gam, baharatlar, sitrik asit', 'additive')
ON CONFLICT (code) DO UPDATE SET
  name_de = EXCLUDED.name_de,
  name_tr = EXCLUDED.name_tr,
  type    = EXCLUDED.type;

-- Extend dishes with multilingual names and allergen codes
ALTER TABLE public.dishes
  ADD COLUMN IF NOT EXISTS menu_number TEXT,
  ADD COLUMN IF NOT EXISTS name_tr TEXT,
  ADD COLUMN IF NOT EXISTS description_tr TEXT,
  ADD COLUMN IF NOT EXISTS ingredients TEXT,
  ADD COLUMN IF NOT EXISTS raw_details TEXT,
  ADD COLUMN IF NOT EXISTS allergen_codes TEXT[] NOT NULL DEFAULT '{}';

-- Optional: lightweight check to ensure array is normalized to lower-case strings
CREATE OR REPLACE FUNCTION public.normalize_allergen_codes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.allergen_codes IS NOT NULL THEN
    NEW.allergen_codes := (
      SELECT ARRAY(
        SELECT DISTINCT lower(trim(x)) FROM unnest(NEW.allergen_codes) AS x
        WHERE coalesce(trim(x), '') <> ''
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_dishes_normalize_allergen_codes ON public.dishes;
CREATE TRIGGER trg_dishes_normalize_allergen_codes
  BEFORE INSERT OR UPDATE ON public.dishes
  FOR EACH ROW
  EXECUTE FUNCTION public.normalize_allergen_codes();

COMMIT;
