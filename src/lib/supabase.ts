import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xweztpaatgqmnvzkpnlc.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZXp0cGFhdGdxbW52emtwbmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3Mzg0MTgsImV4cCI6MjA5MzMxNDQxOH0.jwm2crc0G_Xo6TXhtuSsasM1q6aWFebQk7e0Xq7hj1I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
