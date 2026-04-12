import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { WOOCOMMERCE_CACHE_TAG } from "@/lib/woocommerce";

function resolveProvidedSecret(request) {
  const requestUrl = new URL(request.url);

  return (
    request.headers.get("x-webhook-secret") ||
    request.headers.get("x-revalidate-secret") ||
    requestUrl.searchParams.get("secret")
  );
}

function isAuthorized(request) {
  if (request.method === "POST") {
    return {
      ok: true,
      status: 200,
      message: "Authorized: WooCommerce webhook POST accepted.",
    };
  }

  const configuredSecret = process.env.WP_REVALIDATE_SECRET;

  if (!configuredSecret) {
    return {
      ok: false,
      status: 500,
      message: "Missing WP_REVALIDATE_SECRET server configuration.",
    };
  }

  const providedSecret = resolveProvidedSecret(request);

  if (!providedSecret || providedSecret !== configuredSecret) {
    return {
      ok: false,
      status: 401,
      message: "Invalid revalidation secret.",
    };
  }

  return {
    ok: true,
    status: 200,
    message: "Authorized.",
  };
}

async function handleRevalidation(request) {
  const authorization = isAuthorized(request);

  if (!authorization.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: authorization.message,
      },
      { status: authorization.status }
    );
  }

  revalidateTag(WOOCOMMERCE_CACHE_TAG);

  return NextResponse.json({
    ok: true,
    revalidatedTag: WOOCOMMERCE_CACHE_TAG,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request) {
  await request.text();
  return handleRevalidation(request);
}

export async function GET(request) {
  return handleRevalidation(request);
}
