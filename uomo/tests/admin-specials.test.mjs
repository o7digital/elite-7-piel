import test from "node:test";
import assert from "node:assert/strict";
import { createAdminProduct, calculateEconomics, validateDraft, filterAdminProducts, serializeCsv, parseCsv, readImport } from "../lib/admin-specials.mjs";
const base = { id: "store2-1", title: "Gel JR", price: 200, category: "Geles", categories: ["Geles"], categorySlugs: ["geles"] };

test("missing purchase costs never create invented margins", () => {
  const product = createAdminProduct(base);
  assert.equal(product.purchasePrice, null);
  assert.equal(calculateEconomics(product).margin, null);
  assert.equal(calculateEconomics(product).suggestedPrice, null);
  assert.equal(createAdminProduct({ ...base, stock: 7 }).stock, 7);
});
test("included and separately charged shipping both count as expenses and fees apply to revenue", () => {
  const product = createAdminProduct(base, { purchasePrice: 100, shippingCost: 10, feePercent: 5 });
  const included = calculateEconomics(product);
  assert.equal(included.revenue, 200); assert.equal(included.cost, 120); assert.equal(included.profit, 80); assert.equal(included.margin, 40);
  const separate = calculateEconomics({ ...product, shippingMode: "separate", shippingCharge: 20 });
  assert.equal(separate.revenue, 220); assert.equal(separate.fees, 11); assert.equal(separate.profit, 99); assert.equal(separate.margin, 45);
});
test("target margin suggestions round up to meet the objective and reject impossible targets", () => {
  const product = createAdminProduct(base, { purchasePrice: 100, shippingCost: 10, feePercent: 5, targetMargin: 35 });
  assert.equal(calculateEconomics(product).suggestedPrice, 183.34);
  assert(calculateEconomics({ ...product, salePrice: 183.34 }).margin >= 35);
  assert.equal(calculateEconomics({ ...product, shippingMode: "separate", shippingCharge: 20 }).suggestedPrice, 163.34);
  assert.equal(calculateEconomics({ ...product, targetMargin: 95 }).suggestedPrice, null);
  assert.equal(calculateEconomics({ ...product, salePrice: 0 }).margin, null);
});
test("draft validation rejects unsafe numeric values and only keeps permitted fields", () => {
  assert.throws(() => validateDraft({ purchasePrice: -1 })); assert.throws(() => validateDraft({ salePrice: Infinity })); assert.throws(() => validateDraft({ stock: 1.5 })); assert.throws(() => validateDraft({ feePercent: 100 })); assert.throws(() => validateDraft({ shippingMode: "free-form" }));
  assert.deepEqual(validateDraft({ purchasePrice: "", salePrice: "0", stock: "", unauthorized: true }), { purchasePrice: null, salePrice: 0, stock: null });
});
test("CSV handles multiline notes, commas, quotes and protects spreadsheet formulas", () => {
  const product = createAdminProduct(base, { purchasePrice: 100, notes: 'Package, "fragile"\nsecond line' });
  const rows = parseCsv(serializeCsv([product])); assert.equal(rows[0].notes, product.notes);
  assert(parseCsv(serializeCsv([{ ...product, notes: "=SUM(1,2)" }]))[0].notes.startsWith("'="));
  const imported = readImport(serializeCsv([product]), "products.csv", new Set([base.id])); assert.equal(imported[base.id].purchasePrice, 100);
  assert.throws(() => readImport(serializeCsv([product]), "products.csv", new Set(["other"])));
  assert.throws(() => parseCsv('id,notes\n1,"unclosed'));
});
test("imports reject duplicates, incompatible formats and invalid costs before any write", () => {
  const ids = new Set([base.id]);
  assert.throws(() => readImport(JSON.stringify({ version: 2, catalog: "especiales", products: [] }), "data.json", ids));
  assert.throws(() => readImport(JSON.stringify({ version: 1, catalog: "especiales", products: [{ id: base.id, purchasePrice: -2 }] }), "data.json", ids));
  const rows = readImport(JSON.stringify({ version: 1, catalog: "especiales", products: [{ id: base.id, salePrice: 300 }] }), "data.json", ids); assert.equal(rows[base.id].salePrice, 300);
});
test("review filters include unknown margins while healthy filters require known costs", () => {
  const products = [createAdminProduct(base), createAdminProduct({ ...base, id: "store2-2" }, { purchasePrice: 180 }), createAdminProduct({ ...base, id: "store2-3" }, { purchasePrice: 100 })];
  assert.equal(filterAdminProducts(products, { tab: "review" }).length, 2);
  assert.equal(filterAdminProducts(products, { margin: "healthy" }).length, 1);
  assert.equal(filterAdminProducts(products, { search: "JR", category: "geles", margin: "missing" }).length, 1);
});

test("manufacturer and distributor round-trip and legacy suppliers remain available", () => {
  const draft = validateDraft({ manufacturer: " JR ", distributor: " Elite Distribución ", salePrice: 200, carrier: "Estafeta" });
  assert.equal(draft.manufacturer, "JR"); assert.equal(draft.distributor, "Elite Distribución"); assert.equal(draft.carrier, "Estafeta");
  const product = createAdminProduct(base, draft);
  assert.equal(filterAdminProducts([product], { search: "distribucion" }).length, 1);
  assert.equal(parseCsv(serializeCsv([product]))[0].distributor, "Elite Distribución");
  assert.equal(createAdminProduct(base, { supplier: "Legacy supplier" }).distributor, "Legacy supplier");
});
