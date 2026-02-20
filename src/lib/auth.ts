import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import crypto from "crypto";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "pp_salt_2024").digest("hex");
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createUser(email: string, fullName: string, phone: string, password: string) {
  const passwordHash = hashPassword(password);
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({ email, full_name: fullName, phone, password_hash: passwordHash })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function findUserByEmail(email: string) {
  const { data } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  return data;
}

export async function createSession(userId: string) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabaseAdmin
    .from("sessions")
    .insert({ user_id: userId, token, expires_at: expiresAt })
    .select()
    .single();
  if (error) throw error;
  return token;
}

export async function getSessionUser(token: string) {
  const { data: session } = await supabaseAdmin
    .from("sessions")
    .select("*, users(*)")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();
  if (!session) return null;
  return session.users as Record<string, unknown>;
}

export async function deleteSession(token: string) {
  await supabaseAdmin.from("sessions").delete().eq("token", token);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("pp_session")?.value;
  if (!token) return null;
  return getSessionUser(token);
}

export async function getKycStatus(userId: string, insuranceType: string) {
  const { data } = await supabaseAdmin
    .from("kyc_verifications")
    .select("*")
    .eq("user_id", userId)
    .eq("insurance_type", insuranceType)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .single();
  return data;
}
