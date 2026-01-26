import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { data, error } = await supabase
      .from('investor_applications')
      .insert({
        investor_name: body.investor_name,
        email: body.email,
        organization: body.organization,
        status: 'submitted',
        metadata: {
          role: body.role,
          investor_type: body.investor_type,
        },
      })
      .select('reference_code')
      .single()

    if (error) {
      console.error('🔥 SUPABASE ERROR:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      reference_code: data.reference_code,
    })
  } catch (err: any) {
    console.error('🔥 API ERROR:', err)
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
