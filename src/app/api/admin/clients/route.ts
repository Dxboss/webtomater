import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Use Service Role Key for admin tasks
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

export async function GET(request: Request) {
  try {
    // 1. Fetch all users from Auth (Service Role required)
    const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) {
      console.error("Auth Fetch Error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // 2. Fetch all profiles
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
    
    if (profileError) {
      console.error("Profile Fetch Error:", profileError)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // 3. Identify missing profiles (Users in Auth but not in Profiles)
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])
    const missingProfiles = []

    for (const user of users) {
      if (!profileMap.has(user.id)) {
        // We found a user without a profile!
        // Let's assume they are a 'client' if they are not in the system yet.
        missingProfiles.push({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          role: 'client',
          created_at: user.created_at
        })
      }
    }

    // 4. Auto-create missing profiles (Sync)
    if (missingProfiles.length > 0) {
      const { error: syncError } = await supabaseAdmin
        .from('profiles')
        .upsert(missingProfiles)
      
      if (syncError) {
        console.error("Sync Error:", syncError)
        // Continue anyway, return the combined list
      }
    }

    // 5. Return the final list (Profiles + Missing Ones)
    // We fetch again or just merge in memory. Let's merge.
    const allClients = [
      ...(profiles || []).filter(p => p.role === 'client'),
      ...missingProfiles // These are newly created/identified clients
    ]

    // Sort by created_at desc
    allClients.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({ clients: allClients })

  } catch (error: any) {
    console.error("Admin Clients API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}