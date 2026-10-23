import { NextResponse } from "next/server";
import {
  clearUploadSession,
  createUploadSession,
  getUploadSession,
  isUploadAuthConfigured,
  verifyUploadCredentials,
} from "@/lib/upload-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getUploadSession();
  return NextResponse.json({ authenticated: !!session });
}

export async function POST(request: Request) {
  if (!isUploadAuthConfigured()) {
    console.error("Upload authentication is not configured.");
    return NextResponse.json(
      { error: "Sign in is not configured." },
      { status: 500 },
    );
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { username, password } = body;
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password ||
    username.length > 320 ||
    password.length > 1024
  ) {
    return NextResponse.json(
      { error: "User name and password are required." },
      { status: 400 },
    );
  }

  if (!verifyUploadCredentials(username, password)) {
    return NextResponse.json(
      { error: "Invalid user name or password." },
      { status: 401 },
    );
  }

  await createUploadSession(username.trim().toLowerCase());
  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  await clearUploadSession();
  return NextResponse.json({ authenticated: false });
}
