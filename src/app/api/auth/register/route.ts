import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, fullName, phone, password } = await req.json();
    if (!email || !fullName || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const user = await createUser(email, fullName, phone || "", password);
    const token = await createSession(user.id);
    const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email, full_name: user.full_name } });
    res.cookies.set("pp_session", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/"
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
