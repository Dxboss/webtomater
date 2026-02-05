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

export async function POST(request: Request) {
  try {
    const { action } = await request.json()

    if (action === 'create_bucket') {
      const bucketName = 'project-files'
      
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
      if (listError) throw listError

      const exists = buckets.find(b => b.name === bucketName)
      
      if (!exists) {
        // Create bucket
        const { data, error } = await supabaseAdmin.storage.createBucket(bucketName, {
          public: true, // Assuming files should be publicly accessible via URL, or handle with signed URLs
          fileSizeLimit: 10485760, // 10MB
        })
        if (error) throw error
        return NextResponse.json({ success: true, message: `Bucket '${bucketName}' created.` })
      } else {
        return NextResponse.json({ success: true, message: `Bucket '${bucketName}' already exists.` })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error("Setup Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}