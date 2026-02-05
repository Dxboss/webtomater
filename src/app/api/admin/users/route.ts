import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Use Service Role Key to bypass RLS and read auth.users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: Request) {
  try {
    const { email, name, action } = await request.json()

    if (action === 'sync_profile') {
      // 1. Find user in auth.users by email
      // Note: Supabase Admin API is needed for this
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
      if (listError) throw listError

      const targetUser = users.find(u => u.email === email)
      if (!targetUser) {
        return NextResponse.json({ error: 'No user found with that email in Auth system.' }, { status: 404 })
      }

      // 2. Create profile in profiles table
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: targetUser.id,
          email: email,
          full_name: name || targetUser.user_metadata?.full_name || '',
          role: 'client'
        }, { onConflict: 'id' })

      if (profileError) throw profileError

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}