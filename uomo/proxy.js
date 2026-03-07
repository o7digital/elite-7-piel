import { NextResponse } from "next/server";

const LOCALE_PREFIX = "/es";

function shouldBypass(pathname) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname === "/favicon.ico" ||
    /\.[a-z0-9]+$/i.test(pathname)
  );
}

function isSpanishPath(pathname) {
  return pathname === LOCALE_PREFIX || pathname.startsWith(`${LOCALE_PREFIX}/`);
}

function stripSpanishPrefix(pathname) {
  if (pathname === LOCALE_PREFIX) {
    return "/";
  }

  return pathname.replace(/^\/es/, "") || "/";
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (shouldBypass(pathname) || !isSpanishPath(pathname)) {
    return NextResponse.next();
  }

  const rewrittenUrl = request.nextUrl.clone();
  rewrittenUrl.pathname = stripSpanishPrefix(pathname);

  return NextResponse.rewrite(rewrittenUrl);
}

export const config = {
  matcher: ["/:path*"],
};
