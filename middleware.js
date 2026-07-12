if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = "centstore_jwt_secret_key_2026_x_bungoma_tours_32bytes_fallback";
}
import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const response = NextResponse.next();
  response.headers.set("x-pathname", req.nextUrl.pathname);
  response.headers.set("x-url", req.nextUrl.href);
  return response;
});
