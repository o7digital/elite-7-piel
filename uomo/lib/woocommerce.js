import "server-only";
import primaryCatalogSnapshot from "@/data/catalog-snapshots/primary.json";
import secondaryCatalogSnapshot from "@/data/catalog-snapshots/store2.json";
import { WORDPRESS_PRODUCT_URLS } from "@/lib/wordpress-config.mjs";

const DEFAULT_STORE_API_BASES = WORDPRESS_PRODUCT_URLS.map((wordpressUrl) =>
  new URL("wp-json/wc/store/v1/", `${wordpressUrl}/`).toString()
);
const FALLBACK_IMAGE = "/assets/images/home/demo15/product-1.webp";
const DEFAULT_STOCK_STATUSES = ["instock", "outofstock", "onbackorder"];
const DEFAULT_STORE_REVALIDATE_SECONDS = 300;
export const WOOCOMMERCE_CACHE_TAG = "woocommerce-store";

const HTML_ENTITIES = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

const COLOR_MAP = {
  beige: "#d8c3a5",
  black: "#222222",
  blue: "#3f6ad8",
  brown: "#7a4f2a",
  gold: "#c7a33c",
  gray: "#8c8c8c",
  green: "#4f8a4b",
  grey: "#8c8c8c",
  orange: "#f39c12",
  pink: "#e98ca8",
  purple: "#6f42c1",
  red: "#c93a3e",
  silver: "#c0c0c0",
  white: "#e4e4e4",
  yellow: "#f1c40f",
};

const CATEGORY_LABELS = {
  electronicos: "Electronics",
};

function getCategoryLabel(category) {
  return CATEGORY_LABELS[category.slug] || decodeHtmlEntities(category.name);
}

function normalizeStoreApiBase(base) {
  return String(base).endsWith("/") ? String(base) : `${String(base)}/`;
}

function parsePositiveInteger(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isFinite(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return fallback;
}

function getStorefrontFetchOptions() {
  if (process.env.WORDPRESS_STORE_API_NO_STORE === "true") {
    return {
      cache: "no-store",
    };
  }

  const revalidateInSeconds = parsePositiveInteger(
    process.env.WORDPRESS_STORE_API_REVALIDATE_SECONDS,
    DEFAULT_STORE_REVALIDATE_SECONDS
  );

  return {
    next: {
      tags: [WOOCOMMERCE_CACHE_TAG],
      revalidate: revalidateInSeconds,
    },
  };
}

function getStoreApiBases() {
  const configuredBases = (process.env.WORDPRESS_STORE_API_URLS || "")
    .split(",")
    .map((base) => base.trim())
    .filter(Boolean);
  const fallbackBases = [
    process.env.WORDPRESS_STORE_API_URL || DEFAULT_STORE_API_BASES[0],
    ...DEFAULT_STORE_API_BASES.slice(1),
  ];

  return [
    ...new Set(
      (configuredBases.length ? configuredBases : fallbackBases)
        .filter(Boolean)
        .map(normalizeStoreApiBase)
    ),
  ];
}

function getStoreSources() {
  return getStoreApiBases().map((base, index) => ({
    base,
    key: index === 0 ? "primary" : `store${index + 1}`,
  }));
}

function buildStoreApiUrl(base, pathname, params = {}) {
  const url = new URL(pathname.replace(/^\//, ""), base);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      if (value.length) {
        url.searchParams.set(key, value.join(","));
      }
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url;
}

async function storefrontFetchFromBase(base, pathname, params = {}, options = {}) {
  const response = await fetch(buildStoreApiUrl(base, pathname, params), {
    signal: AbortSignal.timeout(8000),
    ...getStorefrontFetchOptions(),
    ...options.fetchOptions,
  });

  if (options.allowNotFound && response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `WooCommerce storefront request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  if (Array.isArray(data)) {
    Object.defineProperty(data, "totalPages", {
      value: Number(response.headers.get("x-wp-totalpages")) || undefined,
    });
  }
  return data;
}

async function storefrontFetchAll(pathname, params = {}, options = {}) {
  const sources = options.sourceKey
    ? getStoreSources().filter((source) => source.key === options.sourceKey)
    : getStoreSources();
  const results = await Promise.allSettled(
    sources.map(async (source) => ({
      source,
      data: await storefrontFetchFromBase(
        source.base,
        pathname,
        params,
        options
      ),
    }))
  );
  const fulfilled = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  if (fulfilled.length || (options.allowNotFound && results.length)) {
    return fulfilled;
  }

  const firstFailure = results.find((result) => result.status === "rejected");
  throw (
    firstFailure?.reason || new Error("WooCommerce storefront request failed.")
  );
}

function decodeHtmlEntities(value = "") {
  return String(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(parseInt(code, 16))
    )
    .replace(/&([a-z]+);/gi, (match, entity) => {
      return HTML_ENTITIES[entity] ?? match;
    });
}

function stripHtml(value = "") {
  return decodeHtmlEntities(String(value).replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeHtml(value = "") {
  return String(value).replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
}

function truncate(value = "", maxLength = 180) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
}

function normalizePrice(prices = {}) {
  const amount = Number(prices.price ?? 0);
  const minorUnit = Number(prices.currency_minor_unit ?? 2);

  return amount / 10 ** minorUnit;
}

function formatPrice(prices = {}) {
  const value = normalizePrice(prices);
  const currency = prices.currency_code || "MXN";

  try {
    const formatted = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency,
      minimumFractionDigits: Number(prices.currency_minor_unit ?? 2),
    }).format(value);

    // Some storefront payloads already inject a symbol and can produce "$$...".
    return formatted.replace(/^([^\d\s])\1+/, "$1");
  } catch {
    const prefix = prices.currency_prefix || "$";
    const suffix = prices.currency_suffix || "";
    const decimals = Number(prices.currency_minor_unit ?? 2);

    return `${prefix}${value.toFixed(decimals)}${suffix}`.replace(
      /^([^\d\s])\1+/,
      "$1"
    );
  }
}

function getAttributeValues(product, attributeName) {
  const attribute = (product.attributes || []).find(
    (item) => item.name?.toLowerCase() === attributeName.toLowerCase()
  );

  if (!attribute) {
    return [];
  }

  return (attribute.terms || [])
    .map((term) => decodeHtmlEntities(term.name))
    .filter(Boolean);
}

function resolveColorHex(label = "") {
  const normalizedLabel = label
    .toLowerCase()
    .replace(/\s+\d+$/, "")
    .trim();

  return COLOR_MAP[normalizedLabel] || "#222222";
}

function buildColorSwatches(colorOptions = []) {
  return colorOptions.map((label, index) => ({
    label,
    color: resolveColorHex(label),
    defaultChecked: index === 0,
  }));
}

function normalizeImages(product) {
  const sourceImages = product.images?.length
    ? product.images
    : [
        {
          src: FALLBACK_IMAGE,
          thumbnail: FALLBACK_IMAGE,
          alt: decodeHtmlEntities(product.name || "Product image"),
        },
      ];

  return sourceImages.map((image, index) => ({
    src: image.src || FALLBACK_IMAGE,
    thumbnail: image.thumbnail || image.src || FALLBACK_IMAGE,
    alt:
      decodeHtmlEntities(image.alt) ||
      decodeHtmlEntities(product.name) ||
      `Product image ${index + 1}`,
  }));
}

function normalizeAttributes(product) {
  return (product.attributes || [])
    .map((attribute) => ({
      name: decodeHtmlEntities(attribute.name),
      values: (attribute.terms || [])
        .map((term) => decodeHtmlEntities(term.name))
        .filter(Boolean),
    }))
    .filter((attribute) => attribute.values.length);
}

function getPublicProductId(productId, sourceKey) {
  return sourceKey === "primary" ? productId : `${sourceKey}-${productId}`;
}

function normalizeCategory(category) {
  return {
    id: category.slug,
    name: getCategoryLabel(category),
    slug: category.slug,
    count: Number(category.count || 0),
    reviewCount: Number(category.review_count || 0),
    permalink: category.permalink || "",
  };
}

function normalizeProduct(product, source) {
  const images = normalizeImages(product);
  const categoryData = (product.categories || []).map((category) => ({
    id: category.id,
    name: getCategoryLabel(category),
    slug: category.slug,
  }));
  const tagNames = (product.tags || [])
    .map((tag) => decodeHtmlEntities(tag.name))
    .filter(Boolean);
  const sizeOptions = getAttributeValues(product, "Size");
  const colorOptions = getAttributeValues(product, "Color");
  const shortDescriptionText = truncate(
    stripHtml(product.short_description || product.description || ""),
    180
  );

  return {
    id: getPublicProductId(product.id, source.key),
    sourceKey: source.key,
    sourceProductId: product.id,
    slug: product.slug,
    type: product.type,
    createdAt:
      product.date_created_gmt || product.date_created || product.modified || "",
    title: decodeHtmlEntities(product.name),
    category: categoryData[0]?.name || "Product",
    categoryIds: categoryData.map((category) => category.id).filter(Boolean),
    sourceCategoryIds: categoryData
      .map((category) => category.id)
      .filter(Boolean),
    categorySlugs: categoryData.map((category) => category.slug).filter(Boolean),
    categories: categoryData.map((category) => category.name),
    tags: tagNames,
    sku: decodeHtmlEntities(product.sku || "N/A"),
    price: normalizePrice(product.prices),
    priceDisplay: formatPrice(product.prices),
    rating: Number(product.average_rating || 0),
    reviewCount: Number(product.review_count || 0),
    reviews: product.review_count
      ? `${product.review_count} reviews`
      : "No reviews yet",
    imgSrc: images[0].src,
    imgSrc2: images[1]?.src || images[0].src,
    images,
    descriptionHtml: sanitizeHtml(
      product.description || product.short_description || ""
    ),
    descriptionText: stripHtml(product.description || product.short_description),
    shortDescriptionHtml: sanitizeHtml(product.short_description || ""),
    shortDescriptionText,
    inStock: Boolean(product.is_in_stock),
    hasOptions: Boolean(product.has_options),
    permalink: product.permalink,
    addToCartText: decodeHtmlEntities(
      product.add_to_cart?.text || "Add to cart"
    ),
    sizeOptions,
    colorOptions,
    colorSwatches: buildColorSwatches(colorOptions),
    attributes: normalizeAttributes(product),
  };
}

export async function getStoreProducts(options = {}) {
  const responses = await storefrontFetchAll(
    "products",
    {
      _fields: options.fields,
      catalog_visibility: options.catalogVisibility || "any",
      category: options.category,
      exclude: options.exclude,
      order: options.order || "desc",
      orderby: options.orderby || "date",
      page: options.page || 1,
      per_page: options.perPage || 8,
      search: options.search,
      stock_status: options.stockStatus || DEFAULT_STOCK_STATUSES,
    },
    {
      sourceKey: options.sourceKey,
      fetchOptions: options.signal ? { signal: options.signal } : undefined,
    }
  );

  const products = responses.flatMap(({ data, source }) =>
    data.map((product) => normalizeProduct(product, source))
  );
  if (responses.length === 1) {
    Object.defineProperty(products, "totalPages", {
      value: responses[0].data.totalPages,
    });
  }
  return products;
}

export async function getAllStoreProducts(options = {}) {
  const pageSize = Math.min(options.perPage || 40, 40);
  const maxPages = options.maxPages || 20;
  const sources = options.sourceKey
    ? getStoreSources().filter((source) => source.key === options.sourceKey)
    : getStoreSources();
  const productResults = await Promise.allSettled(
    sources.map(async (source) => {
      const fetchPage = (page) => getStoreProducts({
        ...options,
        sourceKey: source.key,
        page,
        perPage: pageSize,
      });
      const firstPage = await fetchPage(1);
      const sourceProducts = [...firstPage];

      if (firstPage.totalPages) {
        const lastPage = Math.min(firstPage.totalPages, maxPages);
        // Limit concurrent requests to avoid overwhelming either WordPress store.
        for (let page = 2; page <= lastPage; page += 4) {
          const pages = await Promise.all(
            Array.from({ length: Math.min(4, lastPage - page + 1) }, (_, offset) =>
              fetchPage(page + offset)
            )
          );
          sourceProducts.push(...pages.flat());
        }
      } else if (firstPage.length === pageSize) {
        for (let page = 2; page <= maxPages; page += 1) {
          const pageProducts = await fetchPage(page);
          sourceProducts.push(...pageProducts);
          if (pageProducts.length < pageSize) break;
        }
      }

      return sourceProducts;
    })
  );
  const productsBySource = productResults
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  if (!productsBySource.length) {
    const firstFailure = productResults.find(
      (result) => result.status === "rejected"
    );
    throw (
      firstFailure?.reason || new Error("WooCommerce storefront request failed.")
    );
  }

  const allProducts = productsBySource.flat();

  return Array.from(
    new Map(allProducts.map((product) => [product.id, product])).values()
  ).sort((left, right) => {
    const leftDate = new Date(left.createdAt || 0).getTime();
    const rightDate = new Date(right.createdAt || 0).getTime();

    return rightDate - leftDate || String(right.id).localeCompare(String(left.id));
  });
}

const CATALOG_SNAPSHOTS = {
  primary: primaryCatalogSnapshot,
  store2: secondaryCatalogSnapshot,
};
const CATALOG_FIELDS = "id,name,date_created,date_created_gmt,modified,categories,tags,prices,average_rating,review_count,images";

// Builds use a verified catalog; live refreshes have a strict time budget and retain a fallback.
export async function getCatalogProducts(options = {}) {
  const sources = options.sourceKey
    ? getStoreSources().filter((source) => source.key === options.sourceKey)
    : getStoreSources();
  const catalogs = await Promise.all(sources.map(async (source) => {
    const fallback = CATALOG_SNAPSHOTS[source.key] || [];
    if (process.env.NEXT_PHASE === "phase-production-build") return fallback;
    try {
      const products = await getAllStoreProducts({
        ...options,
        sourceKey: source.key,
        fields: CATALOG_FIELDS,
        signal: AbortSignal.timeout(6000),
      });
      return toCatalogProducts(products);
    } catch {
      return fallback;
    }
  }));
  return catalogs.flat();
}

function toCatalogProducts(products) {
  return products.map((product) => ({
    id: product.id,
    sourceKey: product.sourceKey,
    title: product.title,
    createdAt: product.createdAt,
    category: product.category,
    categories: product.categories,
    categorySlugs: product.categorySlugs,
    tags: product.tags,
    price: product.price,
    priceDisplay: product.priceDisplay,
    rating: product.rating,
    reviewCount: product.reviewCount,
    images: product.images.slice(0, 1),
    imgSrc: product.imgSrc,
  }));
}

function mergeCategories(categories) {
  const categoriesBySlug = new Map();

  categories.forEach((category) => {
    const current = categoriesBySlug.get(category.slug);

    if (current) {
      current.count += category.count;
      current.reviewCount += category.reviewCount;
      return;
    }

    categoriesBySlug.set(category.slug, { ...category });
  });

  return Array.from(categoriesBySlug.values()).sort((left, right) =>
    left.name.localeCompare(right.name, "es")
  );
}

export async function getStoreCategories(options = {}) {
  const responses = await storefrontFetchAll(
    "products/categories",
    {
      hide_empty: options.hideEmpty ?? true,
      page: options.page || 1,
      per_page: options.perPage || 50,
    },
    { sourceKey: options.sourceKey }
  );

  return mergeCategories(
    responses.flatMap(({ data }) => data.map(normalizeCategory))
  );
}

export async function getStoreProduct(productId) {
  const productIdMatch = String(productId).match(/^(store\d+)-(\d+)$/);
  const sourceKey = productIdMatch?.[1] || "primary";
  const sourceProductId = productIdMatch?.[2] || productId;
  const responses = await storefrontFetchAll(
    `products/${sourceProductId}`,
    {},
    {
      allowNotFound: true,
      sourceKey,
    }
  );
  const match = responses.find(({ data }) => data);

  return match ? normalizeProduct(match.data, match.source) : null;
}

export async function getRelatedStoreProducts(product, options = {}) {
  const relatedProducts = await getStoreProducts({
    category: product.sourceCategoryIds?.[0],
    perPage: (options.perPage || 8) + 1,
    sourceKey: product.sourceKey,
  });

  return relatedProducts
    .filter((relatedProduct) => relatedProduct.id !== product.id)
    .slice(0, options.perPage || 8);
}
