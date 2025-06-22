import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wlbaiwoaolergpptysac.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsYmFpd29hb2xlcmdwcHR5c2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MjY2MDksImV4cCI6MjA2NjEwMjYwOX0.V5GDKxRZp5zSB10CmnB0qLNXksW32z5XU14pAYZaQX4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 