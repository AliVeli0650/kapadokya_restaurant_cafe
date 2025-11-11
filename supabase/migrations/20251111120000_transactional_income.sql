-- 1. Create a table for income sources (e.g., 'Restaurant Sales', 'Online Orders', 'Events')
CREATE TABLE public.income_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS and define policies for income_sources
ALTER TABLE public.income_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage income sources"
ON public.income_sources
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Add a policy for the anon role to allow read access for development if needed
-- This matches the relaxed policy for expenses.
CREATE POLICY "Allow anon read for dev" ON "public"."income_sources"
AS PERMISSIVE FOR SELECT
TO anon
USING (true);

-- 2. Create the main table for individual income transactions
CREATE TABLE public.income_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES public.income_sources(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS and define policies for income_transactions
ALTER TABLE public.income_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage income transactions"
ON public.income_transactions
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Add a policy for the anon role to allow read access for development if needed
CREATE POLICY "Allow anon read for dev" ON "public"."income_transactions"
AS PERMISSIVE FOR SELECT
TO anon
USING (true);


-- 3. Create a function to get daily summary which can be used for "Gün Sonu"
CREATE OR REPLACE FUNCTION get_daily_summary(summary_date DATE)
RETURNS TABLE(total_income NUMERIC, total_expense NUMERIC, net_profit NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(it.amount), 0) AS total_income,
        (SELECT COALESCE(SUM(e.amount), 0) FROM public.expenses e WHERE e.expense_date = summary_date) AS total_expense,
        COALESCE(SUM(it.amount), 0) - (SELECT COALESCE(SUM(e.amount), 0) FROM public.expenses e WHERE e.expense_date = summary_date) AS net_profit
    FROM
        public.income_transactions it
    WHERE
        it.transaction_date = summary_date;
END;
$$ LANGUAGE plpgsql;


-- 4. Drop the old daily_income table
DROP TABLE IF EXISTS public.daily_income;

-- 5. Add some default income sources (Germany-specific)
INSERT INTO public.income_sources (name, description) VALUES
('Lieferando', 'Online-Bestellungen über Lieferando'),
('Uber Eats', 'Online-Bestellungen über Uber Eats'),
('Wolt', 'Online-Bestellungen über Wolt'),
('Bar/Tisch Verkauf', 'Direkte Verkäufe im Restaurant (Bar/Tisch)'),
('Abholung', 'Kunden holen Bestellungen selbst ab'),
('Catering/Events', 'Catering und private Veranstaltungen'),
('Sonstige Einnahmen', 'Andere Einnahmequellen');

-- 6. Re-create the daily_ledger view to use the new income table
DROP VIEW IF EXISTS public.daily_ledger;
CREATE OR REPLACE VIEW public.daily_ledger AS
WITH all_dates AS (
    SELECT DISTINCT transaction_date AS entry_date FROM public.income_transactions
    UNION
    SELECT DISTINCT expense_date AS entry_date FROM public.expenses
),
daily_incomes AS (
    SELECT
        transaction_date,
        sum(amount) as total
    FROM public.income_transactions
    GROUP BY transaction_date
),
daily_expenses AS (
    SELECT
        expense_date,
        sum(amount) as total
    FROM public.expenses
    GROUP BY expense_date
)
SELECT
    d.entry_date,
    COALESCE(di.total, 0) as income,
    COALESCE(de.total, 0) as expense,
    (COALESCE(di.total, 0) - COALESCE(de.total, 0)) as balance
FROM all_dates d
LEFT JOIN daily_incomes di ON d.entry_date = di.transaction_date
LEFT JOIN daily_expenses de ON d.entry_date = de.expense_date
ORDER BY d.entry_date DESC;
