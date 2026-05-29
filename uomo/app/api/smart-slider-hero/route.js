import { heroPromotions } from "@/data/heroPromotions";

const SMART_SLIDER_URL =
  "https://oliviers52.sg-host.com/?n2prerender=1&n2app=smartslider&n2controller=slider&n2action=iframe&sliderid=2&hash=26e4bc6b941926287a7281c60d9238d3";

export const dynamic = "force-dynamic";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function resolvePromotionText(promotion, locale) {
  if (locale === "en") {
    return {
      slogan: promotion.sloganEn || promotion.sloganEs || "",
      offer: promotion.offerEn || promotion.offerEs || "",
    };
  }

  return {
    slogan: promotion.sloganEs || promotion.sloganEn || "",
    offer: promotion.offerEs || promotion.offerEn || "",
  };
}

function buildPromoMarkup(promotion, locale) {
  const text = resolvePromotionText(promotion, locale);
  const couponMarkup = promotion.couponCode
    ? `<span class="elite-hero-promo__coupon">${locale === "en" ? "Code" : "Codigo"} ${escapeHtml(
        promotion.couponCode
      )}</span>`
    : "";

  return `<div class="elite-hero-promo" data-promo-slide="${escapeHtml(
    promotion.slideId
  )}">
    <p class="elite-hero-promo__slogan">${escapeHtml(text.slogan)}</p>
    <p class="elite-hero-promo__offer">${escapeHtml(text.offer)}</p>
    ${couponMarkup}
  </div>`;
}

function getLocaleFromRequest(request) {
  const url = new URL(request.url);
  const localeParam = url.searchParams.get("locale");
  if (localeParam === "en" || localeParam === "es") {
    return localeParam;
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      return refererUrl.pathname.startsWith("/en") ? "en" : "es";
    } catch {
      return "es";
    }
  }

  return url.pathname.startsWith("/en") ? "en" : "es";
}

function injectHeroPromotions(html = "", locale = "es") {
  return heroPromotions
    .filter((promotion) => promotion.active)
    .reduce((nextHtml, promotion) => {
      const pattern = new RegExp(
        `(<div(?=[^>]*data-slide-public-id="${promotion.slideId}")[^>]*class="[^"]*n2-ss-slide[^"]*"[^>]*>[\\s\\S]*?<div class="n2-ss-layers-container n2-ss-slide-limiter n2-ow">)`,
        "i"
      );

      return nextHtml.replace(pattern, `$1${buildPromoMarkup(promotion, locale)}`);
    }, html);
}

export async function GET(request) {
  const locale = getLocaleFromRequest(request);
  const response = await fetch(SMART_SLIDER_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    return new Response("Smart Slider unavailable", { status: 502 });
  }

  const html = await response.text();
  const patchedHtml = injectHeroPromotions(html, locale)
    .replace('"autoplay":{"enabled":0', '"autoplay":{"enabled":1')
    .replace('"duration":8000', '"duration":5000')
    .replaceAll(
      /<div class="n2-ss-slide-background" data-public-id="(?:9|10)"[\s\S]*?<\/div><\/div>/g,
      ""
    )
    .replaceAll(
      /<div[^>]*data-slide-public-id="(?:9|10)"[\s\S]*?data-sstype="slide"[^>]*><\/div><\/div><\/div>/g,
      ""
    )
    .replace(
      "<head>",
      `<head><style>
      html, body { margin:0 !important; overflow:hidden !important; background:#f3f3f3 !important; }
      #n2-ss-2:not(.n2-ss-loaded) { opacity:0 !important; }
      #n2-ss-2.n2-ss-loaded { opacity:1 !important; transition:opacity 160ms ease-out; }
      #n2-ss-2:not(.n2-ss-loaded) .n2-ss-slide-background:not([data-public-id="1"]),
      #n2-ss-2:not(.n2-ss-loaded) [data-slide-public-id]:not([data-slide-public-id="1"]) {
        display:none !important;
        visibility:hidden !important;
        opacity:0 !important;
      }
      .n2-ss-slide--focus,
      ss3-loader,
      .n2-ss-spinner-simple-white-container,
      .n2-ss-spinner-simple-white { display:none !important; visibility:hidden !important; opacity:0 !important; }
      .n2-ss-slide-background[data-public-id="9"],
      .n2-ss-slide-background[data-public-id="10"],
      [data-slide-public-id="9"],
      [data-slide-public-id="10"] { display:none !important; visibility:hidden !important; opacity:0 !important; }
      .elite-hero-promo {
        position:absolute;
        left:clamp(28px, 7vw, 120px);
        top:50%;
        transform:translateY(-20%);
        z-index:40;
        max-width:min(560px, calc(100vw - 56px));
        padding:22px 26px 20px;
        background:rgba(72,72,72,.38);
        border:1px solid rgba(255,255,255,.18);
        border-radius:8px;
        backdrop-filter:blur(2px);
        color:#ffffff;
        font-family:Arial, Helvetica, sans-serif;
        text-shadow:0 2px 18px rgba(0,0,0,.42);
        pointer-events:none;
      }
      .elite-hero-promo__slogan {
        margin:0 0 12px;
        font-size:clamp(38px, 5.4vw, 78px);
        line-height:.95;
        font-weight:800;
        letter-spacing:0;
      }
      .elite-hero-promo__offer {
        display:inline-block;
        margin:0;
        padding:12px 18px;
        background:rgba(255,255,255,.1);
        border:1px solid rgba(255,255,255,.35);
        font-size:clamp(17px, 1.5vw, 24px);
        line-height:1.25;
        font-weight:700;
      }
      .elite-hero-promo__coupon {
        display:inline-block;
        margin-top:12px;
        padding:9px 14px;
        background:#ffffff;
        color:#111111;
        font-size:15px;
        line-height:1;
        font-weight:800;
        text-transform:uppercase;
      }
      @media (max-width:700px) {
        .elite-hero-promo {
          left:14px;
          right:14px;
          top:58%;
          transform:translateY(-50%);
          max-width:none;
          padding:14px 16px;
        }
        .elite-hero-promo__slogan {
          margin:0 0 8px;
          font-size:clamp(16px, 7.5vw, 28px);
          line-height:1.02;
        }
        .elite-hero-promo__offer {
          font-size:clamp(12px, 4.1vw, 15px);
          padding:7px 9px;
          line-height:1.15;
        }
        .elite-hero-promo__coupon {
          margin-top:8px;
          padding:7px 10px;
          font-size:12px;
        }
      }
      </style>`
    );

  return new Response(patchedHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
