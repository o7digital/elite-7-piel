import "server-only";
import { SECONDARY_WORDPRESS_URL } from "./wordpress-config.mjs";
import { getProductBrands } from "./specials-filters.mjs";
import { validateDraft } from "./admin-specials.mjs";
import { validateClient } from "./admin-clients.mjs";

export const ADMIN_META_KEY = "_elite7_admin_specials_v1";

export class WP2Error extends Error {
  constructor(message, status = 502) { super(message); this.status = status; }
}

export function readAuthorization(request) {
  const authorization = request.headers.get("authorization") || "";
  if (!/^Basic [A-Za-z0-9+/]+=*$/.test(authorization) || authorization.length > 2000) throw new WP2Error("Conecta tu cuenta de WordPress WP2 para continuar.", 401);
  return authorization;
}

export async function wp2Request(path, authorization, options = {}, namespace = "wc/v3") {
  let response;
  try {
    response = await fetch(new URL(`wp-json/${namespace}/${path}`, `${SECONDARY_WORDPRESS_URL}/`), {
      ...options, cache: "no-store", signal: AbortSignal.timeout(12000),
      headers: { Authorization: authorization, "Content-Type": "application/json", ...options.headers },
    });
  } catch { throw new WP2Error("WP2 no responde. Revisa la disponibilidad del servidor WordPress y vuelve a intentar."); }
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new WP2Error("WP2 rechazó el acceso. Usa un usuario administrador o gestor de tienda y su contraseña de aplicación de WordPress.", response.status);
    if (response.status === 409) throw new WP2Error(namespace === "elite7/v1" ? "El correo ya existe o la ficha fue modificada. Revisa el correo y actualiza la lista antes de guardar." : "El producto fue modificado. Actualiza antes de guardar.", 409);
    if (response.status === 400) throw new WP2Error("WP2 rechazó los datos. Revisa los campos y vuelve a intentar.", 400);
    if (response.status === 404) throw new WP2Error(namespace === "elite7/v1" ? "Instala y activa el módulo Elite 7 WP2 Admin en WordPress para habilitar la base de clientes." : "No se encontró el producto o la API WooCommerce en WP2.", 404);
    throw new WP2Error(`WP2 no pudo completar la operación (HTTP ${response.status}).`);
  }
  try { return { data: await response.json(), totalPages: Number(response.headers.get("x-wp-totalpages")) || 1 }; }
  catch { throw new WP2Error("WP2 devolvió una respuesta no válida."); }
}

export function normalizeWP2Product(product) {
  let adminDraft = {};
  const saved = product.meta_data?.find((meta) => meta.key === ADMIN_META_KEY)?.value;
  if (saved && typeof saved === "object") {
    try { adminDraft = { ...validateDraft(saved), updatedAt: typeof saved.updatedAt === "string" ? saved.updatedAt : undefined }; }
    catch { /* Invalid legacy metadata remains unmodified until an explicit save. */ }
  }
  const price = Number(product.price || product.regular_price || 0);
  return {
    id: `store2-${product.id}`, sourceProductId: product.id, sourceKey: "store2",
    title: product.name, price, priceDisplay: `MXN ${price.toFixed(2)}`,
    category: product.categories?.[0]?.name || "Sin categoría",
    categories: (product.categories || []).map((category) => category.name),
    categorySlugs: (product.categories || []).map((category) => category.slug),
    brands: getProductBrands(product),
    imgSrc: product.images?.[0]?.src || "", images: product.images || [],
    stock: product.stock_quantity, adminDraft,
  };
}

export async function loadWP2Products(authorization) {
  const first = await wp2Request("products?per_page=100&page=1&status=publish", authorization);
  const products = [...first.data];
  if (first.totalPages > 50) throw new WP2Error("El catálogo supera el límite de 5,000 productos de esta versión.");
  for (let page = 2; page <= first.totalPages; page += 4) {
    const pages = await Promise.all(Array.from({ length: Math.min(4, first.totalPages - page + 1) }, (_, offset) => wp2Request(`products?per_page=100&page=${page + offset}&status=publish`, authorization)));
    products.push(...pages.flatMap((result) => result.data));
  }
  return products.map(normalizeWP2Product);
}

export async function saveWP2Product(authorization, input) {
  if (!input || !/^store2-[1-9]\d*$/.test(input.id || "")) throw new WP2Error("El identificador del producto no es válido.", 400);
  let draft;
  try { draft = validateDraft(input.draft); } catch (error) { throw new WP2Error(error.message, 400); }
  if (draft.salePrice === undefined) throw new WP2Error("Indica el precio de venta.", 400);
  const id = input.id.slice(7);
  const { data: current } = await wp2Request(`products/${id}`, authorization);
  const existing = current.meta_data?.find((meta) => meta.key === ADMIN_META_KEY);
  if (typeof input.expectedUpdatedAt !== "string" || (existing?.value?.updatedAt || "") !== input.expectedUpdatedAt) throw new WP2Error("Otro usuario modificó este producto. Actualiza el catálogo antes de guardar.", 409);
  const previous = normalizeWP2Product(current).adminDraft;
  const saved = { ...previous, ...draft, updatedAt: new Date().toISOString(), version: 1 };
  const body = { meta_data: [{ ...(existing ? { id: existing.id } : {}), key: ADMIN_META_KEY, value: saved }] };
  if (input.publishPrice === true) {
    if (current.type && current.type !== "simple") throw new WP2Error("Los precios de variaciones y productos agrupados deben editarse en WP2.", 400);
    body.regular_price = draft.salePrice.toFixed(2);
    body.sale_price = "";
  }
  const { data: updated } = await wp2Request(`products/${id}`, authorization, { method: "PUT", body: JSON.stringify(body) });
  return normalizeWP2Product(updated);
}

export async function loadWP2Clients(authorization) {
  const first = await wp2Request("clients?page=1", authorization, {}, "elite7/v1");
  if (first.totalPages > 50) throw new WP2Error("La lista supera el límite de 5,000 clientes de esta versión.");
  const clients = [...first.data];
  for (let page = 2; page <= first.totalPages; page += 4) {
    const pages = await Promise.all(Array.from({ length: Math.min(4, first.totalPages - page + 1) }, (_, offset) => wp2Request(`clients?page=${page + offset}`, authorization, {}, "elite7/v1")));
    clients.push(...pages.flatMap((result) => result.data));
  }
  return clients;
}

export async function saveWP2Client(authorization, input) {
  if (!input || (input.id !== undefined && (!Number.isSafeInteger(input.id) || input.id <= 0))) throw new WP2Error("El identificador del cliente no es válido.", 400);
  let data;
  try { data = validateClient(input.client); } catch (error) { throw new WP2Error(error.message, 400); }
  if (input.id && typeof input.expectedUpdatedAt !== "string") throw new WP2Error("Actualiza la ficha del cliente antes de guardar.", 400);
  const body = { ...data, ...(input.id ? { expectedUpdatedAt: input.expectedUpdatedAt } : {}) };
  const result = await wp2Request(input.id ? `clients/${input.id}` : "clients", authorization, { method: input.id ? "PUT" : "POST", body: JSON.stringify(body) }, "elite7/v1");
  return result.data;
}
