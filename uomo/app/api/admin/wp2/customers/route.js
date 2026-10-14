import { loadWP2Clients, readAuthorization, saveWP2Client, WP2Error } from "@/lib/wp2-admin.mjs";
export const runtime = "nodejs";
export const maxDuration = 60;
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
const failure = (error) => Response.json({ error: error instanceof WP2Error ? error.message : "No se pudo completar la operación con WP2." }, { status: error instanceof WP2Error ? error.status : 500, headers });
export async function GET(request) {
  try { return Response.json({ clients: await loadWP2Clients(readAuthorization(request)) }, { headers }); }
  catch (error) { return failure(error); }
}
export async function POST(request) {
  try {
    if (request.headers.get("origin") !== new URL(request.url).origin) throw new WP2Error("La solicitud debe venir del dashboard.", 403);
    const authorization = readAuthorization(request);
    const text = await request.text();
    if (text.length > 20000) throw new WP2Error("La solicitud es demasiado grande.", 413);
    let input;
    try { input = JSON.parse(text); } catch { throw new WP2Error("Solicitud no válida.", 400); }
    return Response.json({ client: await saveWP2Client(authorization, input) }, { headers });
  } catch (error) { return failure(error); }
}
