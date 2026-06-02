-- ============================================
-- KAPADOKYA CAFE & RESTAURANT
-- PERSONNEL MODULE DATABASE MIGRATION
-- Lütfen bu kodları Supabase SQL Editor'a yapıştırın ve çalıştırın
-- ============================================

-- 1. Create personnel table
CREATE TABLE IF NOT EXISTS public.personnel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT,
    start_date DATE,
    phone TEXT,
    email TEXT,
    base_salary NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at on personnel
DROP TRIGGER IF EXISTS update_personnel_updated_at ON public.personnel;
CREATE TRIGGER update_personnel_updated_at BEFORE UPDATE ON public.personnel
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Add personnel_id to expenses table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema='public' 
          AND table_name='expenses' 
          AND column_name='personnel_id'
    ) THEN
        ALTER TABLE public.expenses ADD COLUMN personnel_id UUID REFERENCES public.personnel(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Create personnel_hours table
CREATE TABLE IF NOT EXISTS public.personnel_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personnel_id UUID REFERENCES public.personnel(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    missing_hours NUMERIC(5, 2) DEFAULT 0,
    overtime_hours NUMERIC(5, 2) DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at on personnel_hours
DROP TRIGGER IF EXISTS update_personnel_hours_updated_at ON public.personnel_hours;
CREATE TRIGGER update_personnel_hours_updated_at BEFORE UPDATE ON public.personnel_hours
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Add Subcategories 'Maaş' and 'Avans' under 'Personel' category
INSERT INTO public.expense_categories (name, parent_id, description, order_index)
SELECT
  'Maaş',
  (SELECT id FROM expense_categories WHERE name = 'Personel' LIMIT 1),
  'Personel Maaş Ödemeleri',
  1
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Maaş' AND parent_id = (SELECT id FROM expense_categories WHERE name = 'Personel' LIMIT 1)
);

INSERT INTO public.expense_categories (name, parent_id, description, order_index)
SELECT
  'Avans',
  (SELECT id FROM expense_categories WHERE name = 'Personel' LIMIT 1),
  'Personel Avans Ödemeleri',
  2
WHERE NOT EXISTS (
  SELECT 1 FROM expense_categories WHERE name = 'Avans' AND parent_id = (SELECT id FROM expense_categories WHERE name = 'Personel' LIMIT 1)
);

-- 5. Enable RLS and add Dev policies
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel_hours ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist so we can recreate them safely
DROP POLICY IF EXISTS "Dev allow all on personnel" ON public.personnel;
DROP POLICY IF EXISTS "Dev allow all on personnel_hours" ON public.personnel_hours;

CREATE POLICY "Dev allow all on personnel" ON public.personnel FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Dev allow all on personnel_hours" ON public.personnel_hours FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================
