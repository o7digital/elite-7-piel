import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
// Node tests bypass Next's server-only build marker, keeping the production implementation.
const moduleUrl = new URL("../lib/wp2-admin.mjs", import.meta.url);
const source = readFileSync(moduleUrl, "utf8").replace('import "server-only";', "").replace(/from "(\.\/[^\"]+)"/g, (_, path) => `from "${new URL(path, moduleUrl).href}"`);
const { saveWP2Product, loadWP2Products, readAuthorization, loadWP2Clients, saveWP2Client, ADMIN_META_KEY } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
const product = { id: 996, name: "Set JR", price: "800", regular_price: "800", categories: [{ name: "Geles", slug: "geles" }], images: [], meta_data: [] };
const auth = "Basic dXNlcjpwYXNz";
const response = (data, pages = 1) => new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json", "x-wp-totalpages": String(pages) } });

test("missing authentication is rejected before WordPress access", () => {
  assert.throws(() => readAuthorization(new Request("https://example.test/api")), (error) => error.status === 401);
  assert.equal(readAuthorization(new Request("https://example.test/api", { headers: { authorization: auth } })), auth);
});
test("saving internal costs uses WP2 metadata without updating the public price", async () => {
  const original = globalThis.fetch; const calls = [];
  globalThis.fetch = async (url, options) => { calls.push({ url: String(url), options }); return response(product); };
  try {
    await saveWP2Product(auth, { id: "store2-996", draft: { purchasePrice: 200, salePrice: 450, shippingCost: 50 }, expectedUpdatedAt: "" });
    assert.equal(calls.length, 2); assert.match(calls[1].url, /wp-json\/wc\/v3\/products\/996$/);
    const body = JSON.parse(calls[1].options.body); assert.equal(body.regular_price, undefined); assert.equal(body.sale_price, undefined);
    assert.equal(body.meta_data[0].key, ADMIN_META_KEY); assert.equal(body.meta_data[0].value.purchasePrice, 200);
    assert.equal(calls[1].options.headers.Authorization, auth);
  } finally { globalThis.fetch = original; }
});
test("public price changes require an explicit publish request", async () => {
  const original = globalThis.fetch; let update;
  globalThis.fetch = async (_, options) => { if (options.method === "PUT") update = JSON.parse(options.body); return response(product); };
  try { await saveWP2Product(auth, { id: "store2-996", draft: { salePrice: 450 }, publishPrice: true, expectedUpdatedAt: "" }); assert.equal(update.regular_price, "450.00"); assert.equal(update.sale_price, ""); }
  finally { globalThis.fetch = original; }
});
test("stale edits and invalid values never reach a WordPress write", async () => {
  const original = globalThis.fetch; let writes = 0;
  globalThis.fetch = async (_, options) => { if (options.method === "PUT") writes++; return response({ ...product, meta_data: [{ id: 3, key: ADMIN_META_KEY, value: { salePrice: 800, updatedAt: "new" } }] }); };
  try {
    await assert.rejects(saveWP2Product(auth, { id: "store2-996", draft: { salePrice: 450 }, expectedUpdatedAt: "old" }), (error) => error.status === 409);
    await assert.rejects(saveWP2Product(auth, { id: "other-996", draft: { salePrice: 450 }, expectedUpdatedAt: "" }), (error) => error.status === 400);
    await assert.rejects(saveWP2Product(auth, { id: "store2-996", draft: { salePrice: -1 }, expectedUpdatedAt: "" }), (error) => error.status === 400);
    assert.equal(writes, 0);
  } finally { globalThis.fetch = original; }
});
test("loading WP2 reads every catalog page and returns saved internal data", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (url) => response([{ ...product, id: Number(new URL(url).searchParams.get("page")), meta_data: [{ key: ADMIN_META_KEY, value: { salePrice: 450, purchasePrice: 200, updatedAt: "saved" } }] }], 3);
  try { const loaded = await loadWP2Products(auth); assert.equal(loaded.length, 3); assert.equal(loaded[0].adminDraft.purchasePrice, 200); assert.equal(loaded[0].price, 800); }
  finally { globalThis.fetch = original; }
});


test("client reads and writes use the private WP2 namespace and preserve conflict checks", async () => {
  const original = globalThis.fetch; const calls = [];
  globalThis.fetch = async (url, options) => { calls.push({ url: String(url), options }); return response(options.method ? { id: 12, firstName: "Ana" } : [{ id: 12, firstName: "Ana" }]); };
  try {
    const clients = await loadWP2Clients(auth); assert.equal(clients.length, 1); assert.match(calls[0].url, /wp-json\/elite7\/v1\/clients/);
    await saveWP2Client(auth, { client: { firstName: "Ana", email: "ana@example.com" } }); assert.equal(calls[1].options.method, "POST");
    await saveWP2Client(auth, { id: 12, expectedUpdatedAt: "old", client: { firstName: "Ana" } }); assert.match(calls[2].url, /clients\/12$/); assert.equal(calls[2].options.method, "PUT"); assert.equal(JSON.parse(calls[2].options.body).expectedUpdatedAt, "old");
    await assert.rejects(saveWP2Client(auth, { id: -1, client: { firstName: "Ana" } }), (error) => error.status === 400);
  } finally { globalThis.fetch = original; }
});

test("missing WordPress module returns an actionable client setup error", async () => {
  const original = globalThis.fetch; globalThis.fetch = async () => new Response("{}", { status: 404 });
  try { await assert.rejects(loadWP2Clients(auth), (error) => error.status === 404 && error.message.includes("Instala y activa")); }
  finally { globalThis.fetch = original; }
});
