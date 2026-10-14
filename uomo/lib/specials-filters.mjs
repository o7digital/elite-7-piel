// Fallback for catalog entries whose source does not provide brand metadata.
const CATALOG_BRANDS = [
  "Le Rêveur", "Miss Cherry", "Miss Nana", "J.Denis", "Nagaraku",
  "Kalanzi", "Orabella", "Rootana", "Fantasy", "Xiaoya", "Xioya",
  "Gollee", "Mussa", "Pinky", "Yuan", "MCH", "JR", "RJ", "May",
  "Sun", "BBB", "OBP", "IB",
];

export function normalizeSearch(value = "") {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function getProductBrands(product) {
  const explicit = (product.brands || []).map((brand) => typeof brand === "string" ? brand : brand.name).filter(Boolean);
  const attributes = (product.attributes || []).filter((attribute) =>
    /^(?:pa[_-])?(?:brand|brands|marca|marcas)$/i.test(attribute.slug || "") ||
    /^(?:brand|brands|marca|marcas)$/i.test(attribute.name || "")
  ).flatMap((attribute) => (attribute.terms || attribute.options || attribute.values || []).map((term) => typeof term === "string" ? term : term.name)).filter(Boolean);
  if (explicit.length || attributes.length) return [...new Set([...explicit, ...attributes])];
  const title = ` ${normalizeSearch(product.title || product.name).replace(/[^a-z0-9]+/g, " ")} `;
  return CATALOG_BRANDS.filter((brand) => title.includes(` ${normalizeSearch(brand).replace(/[^a-z0-9]+/g, " ")} `));
}

export function filterSpecials(products, { search = "", category = "", brand = "", minPrice = "", maxPrice = "", sort = "default" } = {}) {
  const terms = normalizeSearch(search).split(/\s+/).filter(Boolean);
  const filtered = products.filter((product) => {
    const brands = getProductBrands(product);
    const haystack = normalizeSearch([product.title, product.sku, ...(product.categories || []), ...brands].join(" "));
    return terms.every((term) => haystack.includes(term)) &&
      (!category || product.categorySlugs?.includes(category)) &&
      (!brand || (brand === "unbranded" ? !brands.length : brands.includes(brand))) &&
      (minPrice === "" || product.price >= Number(minPrice)) &&
      (maxPrice === "" || product.price <= Number(maxPrice));
  });
  if (sort === "price_low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price_high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "name") filtered.sort((a, b) => a.title.localeCompare(b.title, "es"));
  return filtered;
}

export function getSpecialsOptions(products) {
  const categories = new Map();
  const brands = new Map();
  let unbranded = 0;
  for (const product of products) {
    (product.categorySlugs || []).forEach((slug, index) => {
      const name = slug === "electronicos" ? "Electrónicos" : product.categories?.[index] || product.category;
      const current = categories.get(slug) || { slug, name, count: 0 };
      current.count++;
      categories.set(slug, current);
    });
    const names = getProductBrands(product);
    if (!names.length) unbranded++;
    for (const name of names) brands.set(name, (brands.get(name) || 0) + 1);
  }
  return {
    categories: [...categories.values()].sort((a, b) => a.name.localeCompare(b.name, "es")),
    brands: [...brands].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name, "es")),
    unbranded,
  };
}
