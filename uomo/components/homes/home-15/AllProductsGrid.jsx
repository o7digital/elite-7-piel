"use client";

import EliteProductCard from "@/components/common/EliteProductCard";
import { useMemo, useState } from "react";

const SORT_OPTIONS = [
  { value: "newest", label: "Más reciente" },
  { value: "oldest", label: "Más antiguo" },
  { value: "price_low", label: "Precio: menor a mayor" },
  { value: "price_high", label: "Precio: mayor a menor" },
  { value: "popular", label: "Más populares" },
];

function sortProducts(products, sortKey) {
  const nextProducts = [...products];

  switch (sortKey) {
    case "oldest":
      return nextProducts.sort((left, right) => {
        const leftDate = new Date(left.createdAt || 0).getTime();
        const rightDate = new Date(right.createdAt || 0).getTime();

        return leftDate - rightDate || left.id - right.id;
      });
    case "price_low":
      return nextProducts.sort((left, right) => left.price - right.price);
    case "price_high":
      return nextProducts.sort((left, right) => right.price - left.price);
    case "popular":
      return nextProducts.sort((left, right) => {
        return (
          right.reviewCount - left.reviewCount ||
          right.rating - left.rating ||
          right.id - left.id
        );
      });
    case "newest":
    default:
      return nextProducts.sort((left, right) => {
        const leftDate = new Date(left.createdAt || 0).getTime();
        const rightDate = new Date(right.createdAt || 0).getTime();

        return rightDate - leftDate || right.id - left.id;
      });
  }
}

export default function AllProductsGrid({ products = [] }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortKey, setSortKey] = useState("newest");

  if (!products.length) {
    return null;
  }

  const categories = useMemo(() => {
    const map = new Map();

    products.forEach((product) => {
      if (!product.category) {
        return;
      }

      const key = String(product.category).toLowerCase();
      const current = map.get(key) || { label: product.category, count: 0 };
      current.count += 1;
      map.set(key, current);
    });

    return Array.from(map.entries())
      .map(([value, data]) => ({ value, ...data }))
      .sort((left, right) => right.count - left.count);
  }, [products]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const inCategory =
        selectedCategory === "all" ||
        String(product.category || "").toLowerCase() === selectedCategory;

      if (!inCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        product.title,
        product.category,
        ...(product.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });

    return sortProducts(filtered, sortKey);
  }, [products, query, selectedCategory, sortKey]);

  return (
    <section className="home15-catalog container">
      <div className="home15-catalog__header">
        <p className="home15-catalog__count">
          Mostrando {visibleProducts.length} producto
          {visibleProducts.length === 1 ? "" : "s"}
        </p>

        <div className="home15-catalog__controls">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="home15-catalog__search"
            placeholder="Buscar producto, categoría..."
            aria-label="Buscar productos"
          />
          <select
            className="home15-catalog__sort"
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value)}
            aria-label="Ordenar productos"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="home15-catalog__chips">
        <button
          type="button"
          className={selectedCategory === "all" ? "is-active" : ""}
          onClick={() => setSelectedCategory("all")}
        >
          Todos ({products.length})
        </button>
        {categories.map((category) => (
          <button
            key={category.value}
            type="button"
            className={selectedCategory === category.value ? "is-active" : ""}
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {visibleProducts.length ? (
        <div className="row g-4">
          {visibleProducts.map((product) => (
            <div key={product.id} className="col-sm-6 col-xl-3">
              <EliteProductCard
                product={product}
                detailHref={`/shop/product/${product.id}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="home15-catalog__empty">
          <p>No encontramos productos con esos filtros.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedCategory("all");
              setSortKey("newest");
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <style jsx>{`
        .home15-catalog {
          padding-top: 4.5rem;
          padding-bottom: 3rem;
        }

        .home15-catalog__header {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 20px;
          margin-bottom: 2.2rem;
          flex-wrap: wrap;
        }

        .home15-catalog__count {
          margin: 0;
          color: #8f8f8f;
          font-size: 1.05rem;
          line-height: 1.2;
          font-weight: 500;
          white-space: nowrap;
        }

        .home15-catalog__controls {
          margin-left: auto;
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .home15-catalog__search,
        .home15-catalog__sort {
          height: 48px;
          border: 1px solid #dcdcdc;
          border-radius: 10px;
          background: #fff;
          color: #1f1f1f;
          padding: 0 14px;
        }

        .home15-catalog__search {
          min-width: 280px;
        }

        .home15-catalog__sort {
          min-width: 230px;
        }

        .home15-catalog__chips {
          margin-bottom: 1.7rem;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .home15-catalog__chips button {
          border: 1px solid #d8d8d8;
          background: #fff;
          color: #424242;
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .home15-catalog__chips button.is-active,
        .home15-catalog__chips button:hover {
          background: #1f1f1f;
          border-color: #1f1f1f;
          color: #fff;
        }

        .home15-catalog__empty {
          border: 1px solid #ececec;
          background: #fafafa;
          padding: 2.2rem 1rem;
          text-align: center;
        }

        .home15-catalog__empty p {
          margin: 0 0 0.8rem;
          color: #6d6d6d;
        }

        .home15-catalog__empty button {
          border: 0;
          background: #1f1f1f;
          color: #fff;
          border-radius: 8px;
          padding: 10px 14px;
          font-weight: 700;
        }

        @media (max-width: 767px) {
          .home15-catalog {
            max-width: calc(100% - 80px);
            padding-top: 3rem;
            padding-left: 0;
            padding-right: 0;
          }

          .home15-catalog__controls {
            margin-left: 0;
            width: 100%;
          }

          .home15-catalog__search,
          .home15-catalog__sort {
            width: 100%;
            min-width: 0;
          }

          .home15-catalog__header {
            margin-bottom: 1.4rem;
          }

          .home15-catalog__count {
            font-size: 1.45rem;
            white-space: normal;
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .home15-catalog {
            max-width: calc(100% - 24px);
          }
        }
      `}</style>
    </section>
  );
}
