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
      /<div class="n2-ss-slide-background" data-public-id="(?:9|10)"[\s\S]*?<div data-color="RGBA\(255,255,255,0\)" style="background-color: RGBA\(255,255,255,0\);" class="n2-ss-slide-background-color"><\/div><\/div>/g,
      ""
    )
    .replaceAll(
      /<div data-slide-duration="0" data-id="(?:13|14)" data-slide-public-id="(?:9|10)"[\s\S]*?class="n2-ss-layer n2-ow [^"]+" data-sstype="slide" data-pm="default"><\/div><\/div><\/div>/g,
      ""
    );

  return new Response(patchedHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
