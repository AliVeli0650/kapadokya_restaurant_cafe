import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error('ENV ERROR: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing');
  process.exit(1);
}

const supabase = createClient(url, anon);

(async () => {
  try {
    const { data, error } = await supabase.from('daily_income').select('id, date').limit(1);
    if (error) {
      console.error('QUERY ERROR:', error.message);
      process.exit(1);
    }
    console.log('Supabase connection OK. Sample data:', data);
    process.exit(0);
  } catch (e) {
    console.error('UNEXPECTED ERROR:', e);
    process.exit(1);
  }
})();
