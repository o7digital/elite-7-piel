import { NextResponse } from "next/server";
import {
  getLocaleFromPath,
  isLegacySpanishPath,
  shouldBypassPath,
  stripLocalePrefix,
} from "@/lib/i18n/locale";
import { translateHtmlDocument } from "@/lib/i18n/localeSeo";

const INTERNAL_TRANSLATION_HEADER = "x-spanish-html-pass";

function isDataRequest(request) {
  const accept = request.headers.get("accept") || "";

  return (
    request.headers.has("rsc") ||
    request.headers.has("next-router-state-tree") ||
    request.headers.has("next-router-prefetch") ||
    request.headers.get("purpose") === "prefetch" ||
    accept.includes("text/x-component")
  );
}

function shouldTranslateHtml(request) {
  const accept = request.headers.get("accept") || "";
  const fetchMode = request.headers.get("sec-fetch-mode");
  const fetchDest = request.headers.get("sec-fetch-dest");

  if (request.method !== "GET" || isDataRequest(request)) {
    return false;
  }

  return (
    fetchDest === "document" ||
    fetchMode === "navigate" ||
    accept.includes("text/html") ||
    accept.includes("*/*") ||
    !accept
  );
}

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

  if (request.headers.get(INTERNAL_TRANSLATION_HEADER) === "1") {
    return NextResponse.next();
  }

  if (!shouldTranslateHtml(request)) {
    if (pathname === normalizedPathname) {
      return NextResponse.next();
    }

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = normalizedPathname;

    return NextResponse.rewrite(rewriteUrl);
  }

  const upstreamUrl = request.nextUrl.clone();
  upstreamUrl.pathname = normalizedPathname;

  const upstreamHeaders = new Headers(request.headers);
  upstreamHeaders.set(INTERNAL_TRANSLATION_HEADER, "1");
  const upstreamRequest = new Request(upstreamUrl, {
    method: request.method,
    headers: upstreamHeaders,
    body: request.body,
    cache: request.cache,
    credentials: request.credentials,
    integrity: request.integrity,
    keepalive: request.keepalive,
    mode: request.mode,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    signal: request.signal,
  });

  const upstreamResponse = await fetch(upstreamRequest);
  const contentType = upstreamResponse.headers.get("content-type") || "";

  if (contentType.includes("text/html")) {
    const html = await upstreamResponse.text();
    const translatedHtml = translateHtmlDocument(html, {
      origin: request.nextUrl.origin,
      pathname,
      locale,
    });
    const responseHeaders = new Headers(upstreamResponse.headers);

    responseHeaders.set(
      "content-language",
      locale === "en" ? "en-US" : "es-MX"
    );
    responseHeaders.set("content-type", "text/html; charset=utf-8");
    responseHeaders.delete("content-length");
    responseHeaders.delete("content-encoding");

    return new NextResponse(translatedHtml, {
      headers: responseHeaders,
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
    });
  }

  return upstreamResponse;
}

export const config = {
  matcher: ["/:path*"],
};
