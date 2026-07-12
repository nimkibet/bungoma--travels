import { NextResponse } from "next/server";

if (typeof globalThis.__dirname === "undefined") {
  globalThis.__dirname = "/";
}

export default async function middleware(req) {
  const response = NextResponse.next();
  response.headers.set("x-pathname", req.nextUrl.pathname);
  response.headers.set("x-url", req.nextUrl.href);
  return response;
}
