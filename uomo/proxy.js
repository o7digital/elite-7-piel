import { NextResponse } from "next/server";
import {
  getLocaleFromPath,
  isLegacySpanishPath,
  shouldBypassPath,
  stripLocalePrefix,
} from "@/lib/i18n/locale";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const locale = getLocaleFromPath(pathname);
  const normalizedPathname = stripLocalePrefix(pathname);

  if (shouldBypassPath(normalizedPathname)) {
    if (pathname === normalizedPathname) {
      return NextResponse.next();
    }

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = normalizedPathname;

    return NextResponse.rewrite(rewriteUrl);
  }

  if (isLegacySpanishPath(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = stripLocalePrefix(pathname);

    return NextResponse.redirect(redirectUrl, 308);
  }

  if (pathname === normalizedPathname) {
    return NextResponse.next();
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = normalizedPathname;
  const response = NextResponse.rewrite(rewriteUrl);

  response.headers.set("content-language", locale === "en" ? "en-US" : "es-MX");

  return response;
}

export const config = {
  matcher: ["/:path*"],
};
