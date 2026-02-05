import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url) return NextResponse.json({ error: 'Missing NEXT_PUBLIC_SUPABASE_URL' })
  if (!key) return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' })

  // Check key format (should be a JWT)
  const isJwt = key.split('.').length === 3
  
  try {
    const supabase = createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    
    // Test simple query
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
    
    return NextResponse.json({
      status: 'ok',
      urlConfigured: !!url,
      keyConfigured: !!key,
      keyIsJwt: isJwt,
      connectionTest: error ? 'failed' : 'success',
      error: error ? error.message : null
    })
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message })
  }
}