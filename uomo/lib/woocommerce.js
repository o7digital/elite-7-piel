import "server-only";

const DEFAULT_STORE_API_BASE = "https://oliviers52.sg-host.com/wp-json/wc/store/v1/";
const FALLBACK_IMAGE = "/assets/images/home/demo15/product-1.webp";
const DEFAULT_STOCK_STATUSES = ["instock", "outofstock", "onbackorder"];

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

function normalizeStoreApiBase(base) {
  return String(base).endsWith("/") ? String(base) : `${String(base)}/`;
}

function getStoreApiBases() {
  return [
    ...new Set(
      [process.env.WORDPRESS_STORE_API_URL, DEFAULT_STORE_API_BASE]
        .filter(Boolean)
        .map(normalizeStoreApiBase)
    ),
  ];
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
    cache: "no-store",
  });

  if (options.allowNotFound && response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `WooCommerce storefront request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

let preferredStoreApiBasePromise;

async function resolvePreferredStoreApiBase() {
  if (!preferredStoreApiBasePromise) {
    preferredStoreApiBasePromise = (async () => {
      const bases = getStoreApiBases();
      let bestBase = bases[0];
      let bestCount = -1;
      let lastError;

      for (const base of bases) {
        try {
          const products = await storefrontFetchFromBase(
            base,
            "products",
            {
              page: 1,
              per_page: 100,
              catalog_visibility: "any",
              stock_status: DEFAULT_STOCK_STATUSES,
            },
            {}
          );
          const count = Array.isArray(products) ? products.length : 0;

          if (count > bestCount) {
            bestCount = count;
            bestBase = base;
          }
        } catch (error) {
          lastError = error;
        }
      }

      if (bestCount >= 0) {
        return bestBase;
      }

      throw lastError || new Error("Unable to resolve a WooCommerce Store API base.");
    })();
  }

  return preferredStoreApiBasePromise;
}

async function storefrontFetch(pathname, params = {}, options = {}) {
  const bases = [];
  let notFoundOnAllBases = false;

  try {
    bases.push(await resolvePreferredStoreApiBase());
  } catch {
    // Fall back to trying every known base below.
  }

  getStoreApiBases().forEach((base) => {
    if (!bases.includes(base)) {
      bases.push(base);
    }
  });

  let lastError;

  for (const base of bases) {
    try {
      const result = await storefrontFetchFromBase(base, pathname, params, options);

      if (result !== null) {
        return result;
      }

      notFoundOnAllBases = true;
    } catch (error) {
      lastError = error;
    }
  }

  if (options.allowNotFound && notFoundOnAllBases) {
    return null;
  }

  throw lastError || new Error("WooCommerce storefront request failed.");
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
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency,
      minimumFractionDigits: Number(prices.currency_minor_unit ?? 2),
    }).format(value);
  } catch {
    const prefix = prices.currency_prefix || "$";
    const suffix = prices.currency_suffix || "";
    const decimals = Number(prices.currency_minor_unit ?? 2);

    return `${prefix}${value.toFixed(decimals)}${suffix}`;
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

function normalizeCategory(category) {
  return {
    id: category.id,
    name: decodeHtmlEntities(category.name),
    slug: category.slug,
    count: Number(category.count || 0),
    reviewCount: Number(category.review_count || 0),
    permalink: category.permalink || "",
  };
}

function normalizeProduct(product) {
  const images = normalizeImages(product);
  const categoryData = (product.categories || []).map((category) => ({
    id: category.id,
    name: decodeHtmlEntities(category.name),
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
    id: product.id,
    slug: product.slug,
    type: product.type,
    createdAt:
      product.date_created_gmt || product.date_created || product.modified || "",
    title: decodeHtmlEntities(product.name),
    category: categoryData[0]?.name || "Product",
    categoryIds: categoryData.map((category) => category.id).filter(Boolean),
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
  const products = await storefrontFetch("products", {
    catalog_visibility: options.catalogVisibility || "any",
    category: options.category,
    exclude: options.exclude,
    order: options.order || "desc",
    orderby: options.orderby || "date",
    page: options.page || 1,
    per_page: options.perPage || 8,
    search: options.search,
    stock_status: options.stockStatus || DEFAULT_STOCK_STATUSES,
  });

  return products.map(normalizeProduct);
}

export async function getAllStoreProducts(options = {}) {
  const pageSize = options.perPage || 100;
  const maxPages = options.maxPages || 20;
  const allProducts = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const pageProducts = await getStoreProducts({
      ...options,
      page,
      perPage: pageSize,
    });

    allProducts.push(...pageProducts);

    if (pageProducts.length < pageSize) {
      break;
    }
  }

  return Array.from(
    new Map(allProducts.map((product) => [product.id, product])).values()
  );
}

export async function getStoreCategories(options = {}) {
  const categories = await storefrontFetch("products/categories", {
    hide_empty: options.hideEmpty ?? true,
    page: options.page || 1,
    per_page: options.perPage || 50,
  });

  return categories.map(normalizeCategory);
}

export async function getStoreProduct(productId) {
  const product = await storefrontFetch(`products/${productId}`, {}, {
    allowNotFound: true,
  });

  return product ? normalizeProduct(product) : null;
}

export async function getRelatedStoreProducts(product, options = {}) {
  const relatedProducts = await getStoreProducts({
    category: product.categoryIds?.[0],
    perPage: (options.perPage || 8) + 1,
  });

  return relatedProducts
    .filter((relatedProduct) => relatedProduct.id !== product.id)
    .slice(0, options.perPage || 8);
}
