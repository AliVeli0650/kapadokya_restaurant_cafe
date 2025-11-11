-- DEV-ONLY: Relax RLS policies to allow working without auth during development.
-- IMPORTANT: Remove before production or restrict to authenticated users.

-- DAILY_INCOME: allow anon SELECT/INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "Dev allow all on daily_income" ON daily_income;
CREATE POLICY "Dev allow all on daily_income" ON daily_income
  FOR ALL USING (true) WITH CHECK (true);

-- EXPENSES: allow anon SELECT/INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "Dev allow all on expenses" ON expenses;
CREATE POLICY "Dev allow all on expenses" ON expenses
  FOR ALL USING (true) WITH CHECK (true);

-- EXPENSE_CATEGORIES: allow anon SELECT/INSERT/UPDATE/DELETE (for Settings CRUD)
DROP POLICY IF EXISTS "Dev allow all on expense_categories" ON expense_categories;
CREATE POLICY "Dev allow all on expense_categories" ON expense_categories
  FOR ALL USING (true) WITH CHECK (true);

-- Note: expense_categories already has SELECT for everyone.
-- After enabling auth, delete these dev policies and rely on authenticated policies.
