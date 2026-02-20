import { supabaseAdmin } from "@/lib/supabase/admin";
import { readAdminSession } from "@/lib/adminSession";

export async function requireAdmin(): Promise<{ email: string } | null> {
const sess = await readAdminSession();
if (!sess?.email) return null;

const supabase = supabaseAdmin();
const { data, error } = await supabase
.from("admins")
.select("email")
.eq("email", sess.email)
.single();

if (error || !data) return null;
return { email: data.email };
}

export async function requireAdminOrThrow(): Promise<{ email: string }> {
const admin = await requireAdmin();
if (!admin) throw new Error("UNAUTHORIZED");
return admin;
}
