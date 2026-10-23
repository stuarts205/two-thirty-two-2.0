import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const uploadSessionCookie = "upload_session";
const sessionMaxAgeSeconds = 60 * 60 * 8;

type UploadSession = { user: string; expiresAt: number };

const getSessionSecret = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured.");
  return secret;
};

const sign = (value: string) =>
  createHmac("sha256", getSessionSecret()).update(value).digest("base64url");

// Hash first so timingSafeEqual gets equal-length buffers and lengths don't leak.
const safeEqual = (a: string, b: string) =>
  timingSafeEqual(
    createHash("sha256").update(a).digest(),
    createHash("sha256").update(b).digest(),
  );

export const isUploadAuthConfigured = () =>
  !!process.env.UPLOAD_USER &&
  !!process.env.UPLOAD_PASSWORD &&
  !!process.env.SESSION_SECRET;

export const verifyUploadCredentials = (user: string, password: string) => {
  const { UPLOAD_USER, UPLOAD_PASSWORD } = process.env;
  if (!UPLOAD_USER || !UPLOAD_PASSWORD) return false;

  const userMatches = safeEqual(
    user.trim().toLowerCase(),
    UPLOAD_USER.trim().toLowerCase(),
  );
  const passwordMatches = safeEqual(password, UPLOAD_PASSWORD);
  return userMatches && passwordMatches;
};

export const createUploadSession = async (user: string) => {
  const session: UploadSession = {
    user,
    expiresAt: Date.now() + sessionMaxAgeSeconds * 1000,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const cookieStore = await cookies();
  cookieStore.set(uploadSessionCookie, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  });
};

export const clearUploadSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(uploadSessionCookie);
};

export const getUploadSession = async (): Promise<UploadSession | null> => {
  if (!isUploadAuthConfigured()) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(uploadSessionCookie)?.value;
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as UploadSession;
    if (
      typeof session.user !== "string" ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= Date.now() ||
      !safeEqual(
        session.user.toLowerCase(),
        (process.env.UPLOAD_USER ?? "").trim().toLowerCase(),
      )
    ) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
};
