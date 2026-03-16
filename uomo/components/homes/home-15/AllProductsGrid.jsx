"use client";

import DosalgaProductCard from "@/components/common/DosalgaProductCard";

export default function AllProductsGrid({ products = [] }) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="home15-catalog container">
      <div className="home15-catalog__header">
        <div>
          <p className="home15-catalog__eyebrow">Catalogo completo</p>
          <h2 className="home15-catalog__title">Todos nuestros productos</h2>
        </div>
        <p className="home15-catalog__count">
          Mostrando {products.length} producto{products.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-sm-6 col-xl-3">
            <DosalgaProductCard
              product={product}
              detailHref={`/shop/product/${product.id}`}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .home15-catalog {
          padding-top: 5rem;
          padding-bottom: 3rem;
        }

        .home15-catalog__header {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 2.5rem;
        }

        .home15-catalog__eyebrow {
          margin: 0 0 0.4rem;
          color: #8d8d8d;
          font-size: 0.92rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .home15-catalog__title {
          margin: 0;
          color: #1d1d1d;
          font-size: clamp(1.9rem, 2vw + 1.2rem, 3rem);
          line-height: 1.05;
          font-weight: 700;
          letter-spacing: -0.03em;
        }

        .home15-catalog__count {
          margin: 0;
          color: #7b7b7b;
          font-size: 1rem;
          white-space: nowrap;
        }

        @media (max-width: 767px) {
          .home15-catalog {
            padding-top: 3.5rem;
          }

          .home15-catalog__header {
            flex-direction: column;
            align-items: start;
            margin-bottom: 1.75rem;
          }

          .home15-catalog__count {
            white-space: normal;
          }
        }
      `}</style>
    </section>
  );
}
