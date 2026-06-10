import { createClient } from '@supabase/supabase-js'

//show this for swe practices
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY as string
// without keyword vite, the env variables stay hidden

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)