import { getProductBrands, normalizeSearch } from "./specials-filters.mjs";

export const DEFAULT_TARGET_MARGIN = 35;
const NUMERIC_FIELDS = ["purchasePrice", "salePrice", "shippingCost", "shippingCharge", "packagingCost", "feePercent", "targetMargin", "stock", "deliveryDays"];
const TEXT_FIELDS = ["manufacturer", "distributor", "supplier", "carrier", "notes"];
export const CSV_COLUMNS = ["id", "title", "brand", "category", "manufacturer", "distributor", "purchasePrice", "salePrice", "shippingMode", "shippingCost", "shippingCharge", "packagingCost", "feePercent", "targetMargin", "stock", "carrier", "deliveryDays", "supplier", "notes"];

export function createAdminProduct(product, draft = {}) {
  return {
    ...product,
    brands: getProductBrands(product),
    purchasePrice: null,
    salePrice: product.price,
    shippingMode: "included",
    shippingCost: 0,
    shippingCharge: 0,
    packagingCost: 0,
    feePercent: 0,
    targetMargin: DEFAULT_TARGET_MARGIN,
    stock: product.stock ?? null,
    deliveryDays: null,
    supplier: "", carrier: "", notes: "",
    ...draft,
    manufacturer: draft.manufacturer || "",
    distributor: draft.distributor ?? draft.supplier ?? "",
  };
}

export function validateDraft(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("El formato del producto no es válido.");
  const draft = {};
  for (const key of NUMERIC_FIELDS) {
    const raw = value[key];
    if (raw === undefined) continue;
    if (raw === null || raw === "") {
      if (["purchasePrice", "stock", "deliveryDays"].includes(key)) { draft[key] = null; continue; }
      throw new Error(`Completa el campo ${key}.`);
    }
    if (typeof raw !== "number" && typeof raw !== "string") throw new Error(`Valor no válido en ${key}.`);
    const number = Number(raw);
    if (!Number.isFinite(number) || number < 0) throw new Error(`El campo ${key} debe ser un número positivo o cero.`);
    if (["feePercent", "targetMargin"].includes(key) && number >= 100) throw new Error("La comisión y la margen objetivo deben ser menores al 100%.");
    if (["stock", "deliveryDays"].includes(key) && !Number.isInteger(number)) throw new Error("El stock y los días deben ser números enteros.");
    draft[key] = number;
  }
  if (value.shippingMode !== undefined) {
    if (!["included", "separate"].includes(value.shippingMode)) throw new Error("El tipo de envío no es válido.");
    draft.shippingMode = value.shippingMode;
  }
  for (const key of TEXT_FIELDS) {
    if (value[key] !== undefined) {
      if (typeof value[key] !== "string" || value[key].length > 2000) throw new Error(`Texto no válido en ${key}.`);
      draft[key] = value[key].trim();
    }
  }
  return draft;
}

export function calculateEconomics(product) {
  const revenue = Number(product.salePrice) + (product.shippingMode === "separate" ? Number(product.shippingCharge) : 0);
  const fees = revenue * Number(product.feePercent) / 100;
  if (product.purchasePrice === null || product.purchasePrice === "" || product.purchasePrice === undefined) return { complete: false, revenue, fees, cost: null, profit: null, margin: null, breakEven: null, suggestedPrice: null };
  const fixed = Number(product.purchasePrice) + Number(product.shippingCost) + Number(product.packagingCost);
  const cost = fixed + fees;
  const profit = revenue - cost;
  const targetFactor = 1 - Number(product.feePercent) / 100 - Number(product.targetMargin) / 100;
  const charge = product.shippingMode === "separate" ? Number(product.shippingCharge) : 0;
  const priceForFactor = (factor) => factor > 0 ? Math.max(0, Math.ceil((fixed / factor - charge) * 100 - 1e-8) / 100) : null;
  return { complete: true, revenue, fees, cost, profit, margin: revenue > 0 ? profit / revenue * 100 : null, breakEven: priceForFactor(1 - Number(product.feePercent) / 100), suggestedPrice: priceForFactor(targetFactor) };
}

export function productNeedsReview(product) {
  const economics = calculateEconomics(product);
  return !economics.complete || economics.margin === null || economics.margin < product.targetMargin || product.stock === 0;
}

export function filterAdminProducts(products, filters = {}) {
  const words = normalizeSearch(filters.search).split(/\s+/).filter(Boolean);
  const found = products.filter((product) => {
    const economics = calculateEconomics(product);
    const text = normalizeSearch([product.id, product.title, ...product.brands, product.manufacturer, product.distributor, product.supplier].join(" "));
    return words.every((word) => text.includes(word)) &&
      (!filters.category || product.categorySlugs.includes(filters.category)) &&
      (!filters.brand || product.brands.includes(filters.brand)) &&
      (!filters.shipping || product.shippingMode === filters.shipping) &&
      (!filters.margin || (filters.margin === "missing" ? !economics.complete : filters.margin === "low" ? economics.complete && (economics.margin === null || economics.margin < product.targetMargin) : economics.complete && economics.margin !== null && economics.margin >= product.targetMargin)) &&
      (!filters.tab || filters.tab === "all" || (filters.tab === "drafts" ? !!product.updatedAt : filters.tab === "review" ? productNeedsReview(product) : economics.complete && !productNeedsReview(product)));
  });
  if (filters.sort === "price_low") found.sort((a, b) => a.salePrice - b.salePrice);
  if (filters.sort === "price_high") found.sort((a, b) => b.salePrice - a.salePrice);
  if (filters.sort === "margin") found.sort((a, b) => (calculateEconomics(a).margin ?? -Infinity) - (calculateEconomics(b).margin ?? -Infinity));
  if (filters.sort === "name") found.sort((a, b) => a.title.localeCompare(b.title, "es"));
  return found;
}

export function serializeCsv(products) {
  const cell = (value) => {
    let text = value === null || value === undefined ? "" : String(value);
    if (/^[=+@\-\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  return "\uFEFF" + [CSV_COLUMNS, ...products.map((product) => CSV_COLUMNS.map((key) => key === "brand" ? product.brands.join(" / ") : key === "category" ? product.category : product[key]))].map((row) => row.map(cell).join(",")).join("\r\n");
}

export function parseCsv(text) {
  const rows = []; let row = []; let field = ""; let quoted = false;
  const input = text.replace(/^\uFEFF/, "");
  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (char === '"') {
      if (quoted && input[index + 1] === '"') { field += '"'; index++; }
      else if (!quoted && field.length) throw new Error("CSV no válido: comillas inesperadas.");
      else quoted = !quoted;
    } else if (char === "," && !quoted) { row.push(field); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && input[index + 1] === "\n") index++;
      row.push(field); if (row.some(Boolean)) rows.push(row); row = []; field = "";
    } else field += char;
  }
  if (quoted) throw new Error("CSV no válido: comillas sin cerrar.");
  row.push(field); if (row.some(Boolean)) rows.push(row);
  const headers = rows.shift() || [];
  if (!headers.includes("id") || new Set(headers).size !== headers.length) throw new Error("El CSV debe contener una columna id única.");
  return rows.map((values) => {
    if (values.length !== headers.length) throw new Error("CSV no válido: número de columnas incorrecto.");
    return Object.fromEntries(headers.map((key, index) => [key, values[index]]));
  });
}

export function readImport(text, filename, validIds) {
  let records;
  if (filename.toLowerCase().endsWith(".csv")) records = parseCsv(text);
  else {
    const data = JSON.parse(text);
    if (data.version !== 1 || data.catalog !== "especiales" || !Array.isArray(data.products)) throw new Error("Selecciona un respaldo de Especiales compatible (versión 1).");
    records = data.products;
  }
  if (!records.length || records.length > validIds.size) throw new Error("El archivo está vacío o contiene demasiados productos.");
  const imported = {}; const timestamp = new Date().toISOString();
  for (const record of records) {
    if (!validIds.has(record.id)) throw new Error(`Producto desconocido: ${String(record.id).slice(0, 80)}.`);
    if (Object.hasOwn(imported, record.id)) throw new Error(`Producto duplicado: ${record.id}.`);
    imported[record.id] = { ...validateDraft(record), updatedAt: timestamp };
  }
  return imported;
}
