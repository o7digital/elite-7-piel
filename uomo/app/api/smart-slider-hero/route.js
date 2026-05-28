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
    .replace('"duration":8000', '"duration":5000');

  return new Response(patchedHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
