"use client";

import { useMemo, useState, useEffect } from "react";
import EliteProductCard from "@/components/common/EliteProductCard";
import { filterSpecials, getSpecialsOptions } from "@/lib/specials-filters.mjs";
import styles from "./SpecialsCatalog.module.css";

const INITIAL_FILTERS = { search: "", category: "", brand: "", minPrice: "", maxPrice: "", sort: "default" };

export default function SpecialsCatalog({ products = [] }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [limit, setLimit] = useState(24);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const options = useMemo(() => getSpecialsOptions(products), [products]);
  const results = useMemo(() => filterSpecials(products, filters), [products, filters]);
  const active = Object.keys(INITIAL_FILTERS).some((key) => filters[key] !== INITIAL_FILTERS[key]);
  const invalidRange = filters.minPrice !== "" && filters.maxPrice !== "" && Number(filters.minPrice) > Number(filters.maxPrice);
  const update = (key, value) => { setFilters((previous) => ({ ...previous, [key]: value })); setLimit(24); };
  const clear = () => { setFilters(INITIAL_FILTERS); setLimit(24); };

  return (
    <section className={`${styles.catalog} container`} data-runtime-translate-pending={hydrated ? undefined : ""}>
      <header className={styles.heading}>
        <h1>Especiales</h1>
        <p>Encuentra tus favoritos para uñas, pestañas y belleza.</p>
      </header>
      <form className={styles.filters} aria-label="Filtrar productos especiales" onSubmit={(event) => event.preventDefault()}>
        <div className={styles.filterHeading}>
          <h2>Encuentra tu producto</h2>
          <button type="button" className={styles.clear} onClick={clear} disabled={!active}>Limpiar filtros</button>
        </div>
        <label className={styles.search} htmlFor="specials-search">
          Buscar producto
          <input id="specials-search" type="search" placeholder="Nombre, marca o categoría…" value={filters.search} onChange={(event) => update("search", event.target.value)} />
        </label>
        <label htmlFor="specials-category">Categoría
          <select id="specials-category" value={filters.category} onChange={(event) => update("category", event.target.value)}>
            <option value="">Todas las categorías</option>
            {options.categories.map((category) => <option key={category.slug} value={category.slug}>{category.name} ({category.count})</option>)}
          </select>
        </label>
        <label htmlFor="specials-brand">Marca
          <select id="specials-brand" value={filters.brand} onChange={(event) => update("brand", event.target.value)}>
            <option value="">Todas las marcas</option>
            {options.brands.map((brand) => <option key={brand.name} value={brand.name}>{brand.name} ({brand.count})</option>)}
            {options.unbranded > 0 && <option value="unbranded">Sin marca especificada ({options.unbranded})</option>}
          </select>
        </label>
        <label htmlFor="specials-min">Precio mínimo (MXN)
          <input id="specials-min" type="number" inputMode="decimal" min="0" step="0.01" placeholder="Desde" value={filters.minPrice} onChange={(event) => update("minPrice", event.target.value)} aria-invalid={invalidRange} aria-describedby={invalidRange ? "specials-price-error" : undefined} />
        </label>
        <label htmlFor="specials-max">Precio máximo (MXN)
          <input id="specials-max" type="number" inputMode="decimal" min="0" step="0.01" placeholder="Hasta" value={filters.maxPrice} onChange={(event) => update("maxPrice", event.target.value)} aria-invalid={invalidRange} aria-describedby={invalidRange ? "specials-price-error" : undefined} />
        </label>
        {invalidRange && <p id="specials-price-error" role="alert" className={styles.error}>El precio máximo debe ser mayor o igual al mínimo.</p>}
      </form>
      <div className={styles.toolbar}>
        <p role="status" aria-live="polite" aria-atomic="true"><strong>{results.length}</strong> {results.length === 1 ? "producto encontrado" : "productos encontrados"} <span>de {products.length}</span></p>
        <label htmlFor="specials-sort">Ordenar por
          <select id="specials-sort" value={filters.sort} onChange={(event) => update("sort", event.target.value)}>
            <option value="default">Recomendados</option>
            <option value="price_low">Precio: menor a mayor</option>
            <option value="price_high">Precio: mayor a menor</option>
            <option value="name">Nombre: A a Z</option>
          </select>
        </label>
      </div>
      {results.length ? <div className={styles.grid}>
        {results.slice(0, limit).map((product) => <div key={product.id} data-product-id={product.id} data-product-price={product.price}><EliteProductCard product={product} /></div>)}
      </div> : <div className={styles.empty}>
        <h2>No encontramos productos con estos filtros.</h2>
        <p>Prueba otra búsqueda, categoría, marca o rango de precios.</p>
        <button type="button" className="btn btn-dark" onClick={clear}>Ver todos los productos</button>
      </div>}
      {limit < results.length && <div className={styles.more}>
        <p>Mostrando {Math.min(limit, results.length)} de {results.length} productos</p>
        <button type="button" className="btn btn-dark" onClick={() => setLimit((previous) => previous + 24)}>Ver más productos</button>
      </div>}
    </section>
  );
}
