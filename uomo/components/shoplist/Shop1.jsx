"use client";

import DosalgaProductCard from "@/components/common/DosalgaProductCard";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const SORT_OPTIONS = [
  { value: "newest", label: "Más reciente" },
  { value: "oldest", label: "Más antiguo" },
  { value: "price_low", label: "Precio: menor a mayor" },
  { value: "price_high", label: "Precio: mayor a menor" },
  { value: "popular", label: "Más populares" },
];

function buildFallbackCategories(products = []) {
  const categoryMap = new Map();

  products.forEach((product) => {
    product.categoryIds?.forEach((categoryId, index) => {
      const categoryName = product.categories?.[index] || product.category;

      if (!categoryId || !categoryName) {
        return;
      }

      const current = categoryMap.get(categoryId) || {
        id: categoryId,
        name: categoryName,
        count: 0,
      };

      current.count += 1;
      categoryMap.set(categoryId, current);
    });
  });

  return Array.from(categoryMap.values());
}

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

export default function Shop1({ products = [], categories = [] }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortKey, setSortKey] = useState("newest");
  const [columnCount, setColumnCount] = useState(4);

  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!isSidebarOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      const clickedInsideSidebar = sidebarRef.current?.contains(event.target);
      const clickedToggle = toggleRef.current?.contains(event.target);

      if (!clickedInsideSidebar && !clickedToggle) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  const availableCategories = useMemo(() => {
    const fallbackCategories = buildFallbackCategories(products);

    if (!categories.length) {
      return fallbackCategories;
    }

    return categories.filter((category) =>
      products.some((product) => product.categoryIds?.includes(category.id))
    );
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    const nextProducts = selectedCategory
      ? products.filter((product) =>
          product.categoryIds?.includes(Number(selectedCategory))
        )
      : products;

    return sortProducts(nextProducts, sortKey);
  }, [products, selectedCategory, sortKey]);

  const topProducts = useMemo(() => {
    return sortProducts(products, "popular").slice(0, 3);
  }, [products]);

  const gridColumnClass =
    columnCount === 2
      ? "col-md-6"
      : columnCount === 3
        ? "col-md-6 col-xl-4"
        : "col-md-6 col-xl-3";

  return (
    <section className="dosalga-shop container">
      <div className="dosalga-shop__toolbar">
        <p className="dosalga-shop__count">
          Mostrando {filteredProducts.length} producto
          {filteredProducts.length === 1 ? "" : "s"}
        </p>

        <div className="dosalga-shop__controls">
          <button
            type="button"
            className="dosalga-shop__filter-btn"
            ref={toggleRef}
            onClick={() => setIsSidebarOpen((previous) => !previous)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 14 10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <use href="#icon_filter" />
            </svg>
            <span>Filtros</span>
          </button>

          <select
            className="dosalga-shop__sort"
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

          <div className="dosalga-shop__views" aria-label="Cambiar vista">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                type="button"
                className={columnCount === count ? "is-active" : ""}
                onClick={() => setColumnCount(count)}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`dosalga-shop__backdrop ${isSidebarOpen ? "is-open" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        ref={sidebarRef}
        className={`dosalga-shop__sidebar ${isSidebarOpen ? "is-open" : ""}`}
      >
        <div className="dosalga-shop__sidebar-section">
          <h2>Categorías</h2>
          <button
            type="button"
            className={`dosalga-shop__category ${
              selectedCategory ? "" : "is-active"
            }`}
            onClick={() => {
              setSelectedCategory("");
              setIsSidebarOpen(false);
            }}
          >
            Todos los productos
          </button>

          {availableCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`dosalga-shop__category ${
                String(category.id) === selectedCategory ? "is-active" : ""
              }`}
              onClick={() => {
                setSelectedCategory(String(category.id));
                setIsSidebarOpen(false);
              }}
            >
              <span>{category.name}</span>
              <small>{category.count}</small>
            </button>
          ))}
        </div>

        {topProducts.length ? (
          <div className="dosalga-shop__sidebar-section">
            <h2>Productos destacados</h2>

            <div className="dosalga-shop__top-products">
              {topProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/product/${product.id}`}
                  className="dosalga-shop__top-product"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="dosalga-shop__top-product-image">
                    <Image
                      src={product.imgSrc}
                      alt={product.title}
                      fill
                      sizes="96px"
                    />
                  </span>
                  <span className="dosalga-shop__top-product-content">
                    <strong>{product.title}</strong>
                    <span>{product.priceDisplay}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </aside>

      {filteredProducts.length ? (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className={gridColumnClass}>
              <DosalgaProductCard
                product={product}
                detailHref={`/shop/product/${product.id}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="dosalga-shop__empty">
          <h3>No hay productos disponibles.</h3>
          <p>Prueba con otra categoría o vuelve a cargar la tienda.</p>
        </div>
      )}

      <style jsx>{`
        .dosalga-shop {
          position: relative;
          padding-top: 7rem;
          padding-bottom: 7rem;
        }

        .dosalga-shop__toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 2.75rem;
        }

        .dosalga-shop__count {
          margin: 0;
          color: #7c7c7c;
          font-size: 1.05rem;
        }

        .dosalga-shop__controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          gap: 18px;
        }

        .dosalga-shop__filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 0;
          background: transparent;
          color: #1f1f1f;
          font-size: 1rem;
          font-weight: 600;
        }

        .dosalga-shop__sort {
          min-width: 240px;
          height: 48px;
          border: 1px solid #dcdcdc;
          border-radius: 10px;
          padding: 0 16px;
          background: #fff;
          color: #1f1f1f;
        }

        .dosalga-shop__views {
          display: inline-flex;
          align-items: center;
          gap: 14px;
        }

        .dosalga-shop__views button {
          width: 48px;
          height: 48px;
          border-radius: 999px;
          border: 1px solid #d9d9d9;
          background: #fff;
          color: #1f1f1f;
          font-size: 1.15rem;
          font-weight: 700;
        }

        .dosalga-shop__views button.is-active {
          background: #1f1f1f;
          border-color: #1f1f1f;
          color: #fff;
        }

        .dosalga-shop__backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 15, 15, 0.32);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          z-index: 1090;
        }

        .dosalga-shop__backdrop.is-open {
          opacity: 1;
          pointer-events: auto;
        }

        .dosalga-shop__sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: min(360px, calc(100vw - 24px));
          height: 100vh;
          background: #fff;
          z-index: 1100;
          transform: translateX(-100%);
          transition: transform 0.28s ease;
          overflow-y: auto;
          padding: 32px 24px;
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.12);
        }

        .dosalga-shop__sidebar.is-open {
          transform: translateX(0);
        }

        .dosalga-shop__sidebar-section + .dosalga-shop__sidebar-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #ececec;
        }

        .dosalga-shop__sidebar-section h2 {
          margin: 0 0 1rem;
          font-size: 1.15rem;
          font-weight: 700;
        }

        .dosalga-shop__category {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 0;
          background: transparent;
          padding: 12px 0;
          color: #575757;
          text-align: left;
          border-bottom: 1px solid #f1f1f1;
        }

        .dosalga-shop__category small {
          color: #9d9d9d;
          font-size: 0.85rem;
        }

        .dosalga-shop__category.is-active {
          color: #1f1f1f;
          font-weight: 700;
        }

        .dosalga-shop__top-products {
          display: grid;
          gap: 16px;
        }

        .dosalga-shop__top-product {
          display: grid;
          grid-template-columns: 84px minmax(0, 1fr);
          gap: 14px;
          align-items: center;
          text-decoration: none;
        }

        .dosalga-shop__top-product-image {
          position: relative;
          display: block;
          width: 84px;
          aspect-ratio: 1;
          background: #f6f6f6;
          overflow: hidden;
        }

        .dosalga-shop__top-product-image :global(img) {
          object-fit: cover;
        }

        .dosalga-shop__top-product-content {
          display: grid;
          gap: 6px;
        }

        .dosalga-shop__top-product-content strong {
          color: #1f1f1f;
          font-size: 0.95rem;
          line-height: 1.3;
        }

        .dosalga-shop__top-product-content span {
          color: #1f1f1f;
          font-weight: 700;
        }

        .dosalga-shop__empty {
          padding: 5rem 1rem;
          text-align: center;
          border: 1px solid #ececec;
          background: #fafafa;
        }

        .dosalga-shop__empty h3 {
          margin-bottom: 0.75rem;
          font-size: 1.4rem;
        }

        .dosalga-shop__empty p {
          margin: 0;
          color: #717171;
        }

        @media (max-width: 991px) {
          .dosalga-shop {
            padding-top: 4.5rem;
            padding-bottom: 4.5rem;
          }

          .dosalga-shop__toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .dosalga-shop__controls {
            justify-content: space-between;
          }

          .dosalga-shop__sort {
            min-width: 0;
            flex: 1 1 220px;
          }
        }

        @media (max-width: 767px) {
          .dosalga-shop__controls {
            gap: 12px;
          }

          .dosalga-shop__filter-btn,
          .dosalga-shop__sort {
            width: 100%;
          }

          .dosalga-shop__views {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </section>
  );
}
