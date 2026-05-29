const SMART_SLIDER_URL =
  "https://oliviers52.sg-host.com/?n2prerender=1&n2app=smartslider&n2controller=slider&n2action=iframe&sliderid=2&hash=26e4bc6b941926287a7281c60d9238d3";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await fetch(SMART_SLIDER_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    return new Response("Smart Slider unavailable", { status: 502 });
  }

  const html = await response.text();
  const patchedHtml = html
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
      </style>`
    );

  return new Response(patchedHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
