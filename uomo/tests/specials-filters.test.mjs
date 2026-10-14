import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filterSpecials, getProductBrands, getSpecialsOptions } from "../lib/specials-filters.mjs";

const catalog = JSON.parse(readFileSync(new URL("../data/catalog-snapshots/store2.json", import.meta.url)));

test("search ignores accents, casing and extra spaces and combines search terms", () => {
  const found = filterSpecials(catalog, { search: "  LAMPARA   MAY " });
  assert(found.length > 0);
  assert(found.every((product) => /lámpara/i.test(product.title) && /may/i.test(product.title)));
  assert.equal(filterSpecials(catalog, { search: "not-a-product-93752" }).length, 0);
});

test("brand metadata takes precedence and title matching uses whole words", () => {
  assert.deepEqual(getProductBrands({ title: "Gel JR", brands: [{ name: "Verified brand" }] }), ["Verified brand"]);
  assert.deepEqual(getProductBrands({ title: "Gel", attributes: [{ name: "Marca", terms: [{ name: "JR" }] }] }), ["JR"]);
  assert.deepEqual(getProductBrands({ title: "Kit JR" }), ["JR"]);
  assert.deepEqual(getProductBrands({ title: "Drill Piedra May rosa" }), ["May"]);
  assert.deepEqual(getProductBrands({ title: "MAYOR herramienta" }), []);
  assert.deepEqual(getProductBrands({ title: "Gel sin marca" }), []);
});

test("all filters combine, including inclusive price bounds", () => {
  const found = filterSpecials(catalog, { category: "geles-y-esmaltes", brand: "JR", minPrice: "150", maxPrice: "220", search: "gel" });
  assert(found.length > 0);
  assert(found.every((product) => product.categorySlugs.includes("geles-y-esmaltes") && getProductBrands(product).includes("JR") && product.price >= 150 && product.price <= 220));
  const exact = filterSpecials(catalog, { minPrice: "800", maxPrice: "800" });
  assert(exact.length > 0);
  assert(exact.every((product) => product.price === 800));
  assert.equal(filterSpecials(catalog, { minPrice: "300", maxPrice: "100" }).length, 0);
  assert.equal(filterSpecials([{ title: "Free", price: 0 }], { minPrice: "0", maxPrice: "0" }).length, 1);
});

test("sorting covers the complete filtered catalog without changing the source order", () => {
  const original = catalog.map((product) => product.id);
  for (const sort of ["price_low", "price_high"]) {
    const found = filterSpecials(catalog, { sort });
    assert.equal(found.length, 512);
    assert(found.every((product, index) => !index || (sort === "price_low" ? found[index - 1].price <= product.price : found[index - 1].price >= product.price)));
  }
  const byName = filterSpecials(catalog, { sort: "name" });
  assert(byName.every((product, index) => !index || byName[index - 1].title.localeCompare(product.title, "es") <= 0));
  assert.deepEqual(catalog.map((product) => product.id), original);
});

test("category and brand counts match actual products and unspecified brands remain selectable", () => {
  const options = getSpecialsOptions(catalog);
  assert.equal(options.categories.length, 19);
  for (const category of options.categories) assert.equal(filterSpecials(catalog, { category: category.slug }).length, category.count);
  for (const brand of options.brands) assert.equal(filterSpecials(catalog, { brand: brand.name }).length, brand.count);
  assert.equal(filterSpecials(catalog, { brand: "unbranded" }).length, options.unbranded);
  assert.equal(filterSpecials(catalog).length, catalog.length);
});
