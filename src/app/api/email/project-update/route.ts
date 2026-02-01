
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, projectTitle, updateTitle, updateContent, type } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'WebAutomate <onboarding@resend.dev>', // Using default sender since no domain is verified yet
      to: [email],
      replyTo: 'admin@webautomate.com', // Replace with your actual admin email if you want replies
      subject: `[${projectTitle}] New ${type === 'milestone' ? 'Milestone Reached' : 'Update'}: ${updateTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0033CC;">${projectTitle}</h1>
          <div style="padding: 20px; background-color: #f5f5f5; border-radius: 8px; margin: 20px 0;">
            <span style="background-color: ${type === 'milestone' ? '#6D28D9' : '#0033CC'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase;">${type}</span>
            <h2 style="margin-top: 10px;">${updateTitle}</h2>
            <p style="line-height: 1.6; color: #333;">${updateContent}</p>
          </div>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal" style="display: inline-block; background-color: #0033CC; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View in Portal</a>
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 40px;">
            You are receiving this email because you are a client of WebAutomate.
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
