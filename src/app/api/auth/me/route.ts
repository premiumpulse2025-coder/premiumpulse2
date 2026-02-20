import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("pp_session")?.value;
  if (!token) return NextResponse.json({ user: null });
  const user = await getSessionUser(token);
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { id: user.id, email: user.email, full_name: user.full_name } });
}
