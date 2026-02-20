import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSessionUser } from "@/lib/auth";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const token = req.cookies.get("pp_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await getSessionUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    insuranceType, fullName, dob, panNumber, aadhaarNumber,
    address, city, state, pincode
  } = body;

  if (!insuranceType || !fullName || !dob || !panNumber || !aadhaarNumber) {
    return NextResponse.json({ error: "Missing required KYC fields" }, { status: 400 });
  }

  // Check if KYC already approved
  const { data: existing } = await supabaseAdmin
    .from("kyc_verifications")
    .select("*")
    .eq("user_id", user.id as string)
    .eq("insurance_type", insuranceType)
    .eq("status", "approved")
    .single();

  if (existing) {
    return NextResponse.json({ kyc: existing, alreadyApproved: true });
  }

  // Upsert new KYC submission - demo auto-approves after 3 seconds (handled client-side)
  const { data, error } = await supabaseAdmin
    .from("kyc_verifications")
    .insert({
      user_id: user.id as string,
      insurance_type: insuranceType,
      status: "in_review",
      full_name: fullName,
      dob,
      pan_number: panNumber,
      aadhaar_number: aadhaarNumber,
      address: address || "",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "KYC submission failed" }, { status: 500 });
  }

  // Demo: auto-approve after inserting (simulate instant verification for demo)
  await supabaseAdmin
    .from("kyc_verifications")
    .update({ status: "approved", reviewed_at: new Date().toISOString(), remarks: "Auto-verified (Demo)" })
    .eq("id", data.id);

  return NextResponse.json({ kyc: { ...data, status: "approved" }, success: true });
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("pp_session")?.value;
  if (!token) return NextResponse.json({ kyc: null });
  const user = await getSessionUser(token);
  if (!user) return NextResponse.json({ kyc: null });

  const { searchParams } = new URL(req.url);
  const insuranceType = searchParams.get("type") || "individual";

  const { data } = await supabaseAdmin
    .from("kyc_verifications")
    .select("*")
    .eq("user_id", user.id as string)
    .eq("insurance_type", insuranceType)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ kyc: data });
}
