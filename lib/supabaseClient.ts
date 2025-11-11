import { createClient } from '@supabase/supabase-js';

// We only validate format lightly; Supabase hosted URL ends with .supabase.co
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isLikelySupabaseUrl(url?: string) {
	if (!url) return false;
	// Accept http(s) and require at least one dot
	return /^https?:\/\/.+\..+/.test(url);
}

if (!isLikelySupabaseUrl(supabaseUrl)) {
	console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_URL missing or looks invalid:', supabaseUrl);
}
if (!supabaseAnonKey) {
	console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY missing');
}

export const supabase = createClient(supabaseUrl || 'http://localhost', supabaseAnonKey || '');