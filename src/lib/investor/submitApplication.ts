import { SupabaseClient } from '@supabase/supabase-js';

type SubmitInvestorApplicationArgs = {
  investor_name: string;
  email: string;
  organization: string;
  role: string;
  investor_type: string;
};

export async function submitInvestorApplication(
  supabase: SupabaseClient,
  args: SubmitInvestorApplicationArgs
) {
  const { data, error } = await supabase
    .from('investor_applications')
    .insert({
      investor_name: args.investor_name,
      email: args.email,
      organization: args.organization,
      status: 'submitted',
      metadata: {
        role: args.role,
        investor_type: args.investor_type,
      },
    })
    .select('id')
    .single();

  if (error) {
    console.error('Investor application insert failed:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }

  return data;
}
