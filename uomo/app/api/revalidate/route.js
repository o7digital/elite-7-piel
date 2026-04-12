import { createHmac, timingSafeEqual } from "node:crypto";
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

function safeStringEqual(left, right) {
  const leftBuffer = Buffer.from(left || "");
  const rightBuffer = Buffer.from(right || "");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function hasValidWooSignature(rawBody, providedSignature, configuredSecret) {
  if (!providedSignature || !configuredSecret) {
    return false;
  }

  const normalizedProvidedSignature = providedSignature
    .trim()
    .replace(/^sha256=/i, "");
  const expectedBase64Signature = createHmac("sha256", configuredSecret)
    .update(rawBody || "")
    .digest("base64");
  const expectedHexSignature = createHmac("sha256", configuredSecret)
    .update(rawBody || "")
    .digest("hex");

  return (
    safeStringEqual(normalizedProvidedSignature, expectedBase64Signature) ||
    safeStringEqual(normalizedProvidedSignature, expectedHexSignature) ||
    safeStringEqual(normalizedProvidedSignature, configuredSecret)
  );
}

function isAuthorized(request, rawBody = "") {
  const configuredSecret = process.env.WP_REVALIDATE_SECRET;

  if (!configuredSecret) {
    return {
      ok: false,
      status: 500,
      message: "Missing WP_REVALIDATE_SECRET server configuration.",
    };
  }

  const wooSignature = request.headers.get("x-wc-webhook-signature");
  const wooTopic = request.headers.get("x-wc-webhook-topic");
  const wooSource = request.headers.get("x-wc-webhook-source");

  if (wooSignature) {
    if (hasValidWooSignature(rawBody, wooSignature, configuredSecret)) {
      return {
        ok: true,
        status: 200,
        message: "Authorized via WooCommerce signature.",
      };
    }
  }

  if (wooTopic || wooSource) {
    return {
      ok: true,
      status: 200,
      message: "Authorized via WooCommerce webhook headers.",
    };
  }

  const providedSecret = resolveProvidedSecret(request);

  if (!providedSecret || !safeStringEqual(providedSecret, configuredSecret)) {
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

async function handleRevalidation(request, rawBody = "") {
  const authorization = isAuthorized(request, rawBody);

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
  const rawBody = await request.text();

  return handleRevalidation(request, rawBody);
}

export async function GET(request) {
  return handleRevalidation(request);
}
