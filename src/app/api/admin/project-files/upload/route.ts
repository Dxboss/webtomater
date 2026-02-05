import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Use Service Role Key for admin tasks (Bypass RLS)
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
    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string
    const uploadedBy = formData.get('uploadedBy') as string

    if (!file || !projectId) {
      return NextResponse.json({ error: 'Missing file or project ID' }, { status: 400 })
    }

    // 1. Upload to Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `projects/${projectId}/${fileName}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('project-files')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // 2. Get Public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('project-files')
      .getPublicUrl(filePath)

    // 3. Insert Record into DB
    const { data: insertData, error: dbError } = await supabaseAdmin
      .from('project_files')
      .insert([{
        project_id: projectId,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_type: file.type,
        uploaded_by: uploadedBy || null // Admin ID or null
      }])
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json({ success: true, file: insertData })

  } catch (error: any) {
    console.error("Upload Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}