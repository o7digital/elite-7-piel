import { loadWP2Products, readAuthorization, saveWP2Product, WP2Error } from "@/lib/wp2-admin.mjs";

export const runtime = "nodejs";
export const maxDuration = 60;
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
const failure = (error) => Response.json({ error: error instanceof WP2Error ? error.message : "No se pudo completar la operación con WP2." }, { status: error instanceof WP2Error ? error.status : 500, headers });

export async function GET(request) {
  try { return Response.json({ products: await loadWP2Products(readAuthorization(request)), backend: "WP2" }, { headers }); }
  catch (error) { return failure(error); }
}

export async function PUT(request) {
  try {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) throw new WP2Error("La solicitud debe venir del dashboard.", 403);
    const authorization = readAuthorization(request);
    const text = await request.text();
    if (text.length > 20000) throw new WP2Error("La solicitud es demasiado grande.", 413);
    let input;
    try { input = JSON.parse(text); } catch { throw new WP2Error("Solicitud no válida.", 400); }
    return Response.json({ product: await saveWP2Product(authorization, input) }, { headers });
  } catch (error) { return failure(error); }
}
