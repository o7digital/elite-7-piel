"use client";

import EliteProductCard from "@/components/common/EliteProductCard";

export default function AllProductsGrid({ products = [] }) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="home15-catalog container">
      <div className="home15-catalog__header">
        <p className="home15-catalog__count">
          Showing {products.length} Products
        </p>
      </div>

      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-sm-6 col-xl-3">
            <EliteProductCard
              product={product}
              detailHref={`/shop/product/${product.id}`}
            />
          </div>
        ))}
      </div>

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
        }

        .home15-catalog__count {
          margin: 0;
          color: #8f8f8f;
          font-size: 1.05rem;
          line-height: 1.2;
          font-weight: 500;
          white-space: nowrap;
        }

        @media (max-width: 767px) {
          .home15-catalog {
            padding-top: 3rem;
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
      `}</style>
    </section>
  );
}
