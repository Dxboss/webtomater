import { NextResponse } from "next/server"
import { contactFormSchema } from "@/lib/schemas"
import { supabaseAdmin } from "@/lib/supabase"
import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "thegeorgedigitals@gmail.com"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request body
    const result = contactFormSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, company, phone, message, budget, timeline, services } = result.data

    // Format message to include services if present
    const messageWithServices = services && services.length > 0
      ? `[Services Required: ${services.join(", ")}]\n\n${message}`
      : message;

    // Insert into Supabase (Using REST API directly to bypass client issues)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // We use the ANON KEY because we added a "public insert" policy in the migration.
    // This behaves exactly like the client-side code but runs on the server.
    const dbResponse = await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
        'ApiKey': anonKey!,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name,
        email,
        company,
        phone,
        message: messageWithServices,
        budget,
        timeline,
      })
    })

    if (!dbResponse.ok) {
      const errorText = await dbResponse.text()
      console.error("Supabase REST error:", errorText)
      return NextResponse.json(
        { error: "Failed to save submission", details: errorText },
        { status: 500 }
      )
    }

    // Send email alert via Resend (await to ensure completion)
    if (resend) {
      try {
        const { error: emailError } = await resend.emails.send({
          from: 'WebAutomate <onboarding@resend.dev>', // Update this with your verified domain in production
          to: ADMIN_EMAIL,
          replyTo: email,
          subject: `New Lead: ${name} from ${company || 'Unknown Company'}`,
          html: `
              <h1>New Project Inquiry</h1>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Company:</strong> ${company || 'N/A'}</p>
              <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p><strong>Budget:</strong> ${budget}</p>
              <p><strong>Timeline:</strong> ${timeline}</p>
              <p><strong>Services:</strong> ${services?.join(", ") || 'None selected'}</p>
              <hr />
              <h3>Message:</h3>
              <p>${message.replace(/\n/g, '<br>')}</p>
            `,
        })
        
        if (emailError) {
          console.error("Resend API returned error:", emailError)
        }
      } catch (error) {
        console.error("Failed to send email alert:", error)
      }
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
