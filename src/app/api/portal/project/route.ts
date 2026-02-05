import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Use Service Role Key to bypass RLS
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = serviceRoleKey ? createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) : null

export async function GET(request: Request) {
  if (!supabaseAdmin) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY")
    return NextResponse.json({ error: 'Server misconfiguration: Missing Service Role Key' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const email = searchParams.get('email')

  if (!id || !email) {
    return NextResponse.json({ error: 'Missing id or email' }, { status: 400 })
  }

  try {
    // 1. Fetch project by ID and check if client_email matches
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found in database' }, { status: 404 })
    }

    // Verify access (Case insensitive and trimmed)
    const normalizedProjectEmail = project.client_email?.trim().toLowerCase()
    const normalizedUserEmail = email.trim().toLowerCase()

    if (normalizedProjectEmail !== normalizedUserEmail) {
      return NextResponse.json({ 
        error: `Unauthorized access. Project is assigned to ${project.client_email}, but you are logged in as ${email}` 
      }, { status: 403 })
    }

    // 2. Fetch related data (files, updates)
    const { data: files } = await supabaseAdmin
      .from('project_files')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })

    const { data: updates } = await supabaseAdmin
      .from('project_updates')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      project,
      files: files || [],
      updates: updates || []
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}