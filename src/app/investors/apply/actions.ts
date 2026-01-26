'use server'

import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

export async function submitInvestorApplication(data: {
  investor_name: string
  email: string
  organization: string
  role: string
  investor_type: string
}) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase
    .from('investor_applications')
    .insert({
      investor_name: data.investor_name,
      email: data.email,
      organization: data.organization,

      // REQUIRED FIELDS
      status: 'pending',
      reference_code: randomUUID(),
      metadata: {
        role: data.role,
        investor_type: data.investor_type,
        source: 'investor_form'
      }
    })

  if (error) {
    console.error('Supabase insert error:', error)
    throw new Error('Failed to submit investor application')
  }

  return { success: true }
}
