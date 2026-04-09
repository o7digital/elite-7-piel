"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useContextElement } from "@/context/Context";
import { openCart } from "@/utlis/openCart";
import { addLocalePrefix, getLocaleFromPath } from "@/lib/i18n/locale";

function renderStars(rating = 0) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={`dosalga-detail__star ${index < roundedRating ? "is-active" : ""}`}
      aria-hidden="true"
    >
      ★
    </span>
  ));
}

export default function SingleProduct12({ product }) {
  const router = useRouter();
  const { setCartProducts } = useContextElement();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizeOptions?.[0] || "");

  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
    setSelectedSize(product.sizeOptions?.[0] || "");
  }, [product.id, product.sizeOptions]);

  const mainCategory = product.categories?.[0] || "Sin categoría";
  const reviewLabel =
    product.reviewCount === 1
      ? "(1 opinión)"
      : `(${product.reviewCount || 0} opiniones)`;
  const summaryText =
    product.shortDescriptionText ||
    product.descriptionText ||
    "Información del producto disponible pronto.";
  const currentImage =
    product.images?.[selectedImageIndex] || product.images?.[0] || null;
  const detailRows = useMemo(() => {
    const baseRows = [
      { label: "SKU", value: product.sku || "N/D" },
      { label: "Categoría", value: mainCategory },
    ];

    if (product.tags?.length) {
      baseRows.push({ label: "Etiquetas", value: product.tags.join(", ") });
    }

    return baseRows;
  }, [mainCategory, product.sku, product.tags]);

  const updateCart = (redirectToCheckout = false) => {
    if (!product.inStock) {
      return;
    }

    const nextQuantity = Math.max(1, quantity);

    setCartProducts((previous) => {
      const existingIndex = previous.findIndex((item) => item.id === product.id);

      if (existingIndex >= 0) {
        const nextItems = [...previous];
        const existingItem = nextItems[existingIndex];

        nextItems[existingIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + nextQuantity,
          selectedSize: selectedSize || existingItem.selectedSize || "",
        };

        return nextItems;
      }

      return [
        ...previous,
        {
          ...product,
          quantity: nextQuantity,
          selectedSize: selectedSize || "",
        },
      ];
    });

    if (redirectToCheckout) {
      const locale =
        typeof window === "undefined"
          ? "es"
          : getLocaleFromPath(window.location.pathname);
      router.push(addLocalePrefix("/shop_checkout", locale));
      return;
    }

    openCart();
  };

  if (!currentImage) {
    return null;
  }

  return (
    <section className="dosalga-detail">
      <div className="container">
        <div className="row gy-5 align-items-start">
          <div className="col-lg-6">
            <div className="dosalga-detail__media">
              {product.images?.length > 1 ? (
                <div className="dosalga-detail__thumbs" aria-label="Miniaturas del producto">
                  {product.images.map((image, index) => (
                    <button
                      key={`${product.id}-${index}`}
                      type="button"
                      className={
                        index === selectedImageIndex
                          ? "dosalga-detail__thumb is-active"
                          : "dosalga-detail__thumb"
                      }
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={image.thumbnail || image.src}
                        alt={image.alt || product.title}
                        fill
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="dosalga-detail__main-image">
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt || product.title}
                  fill
                  sizes="(max-width: 991px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="dosalga-detail__content">
              <h1>{product.title}</h1>

              <div className="dosalga-detail__rating">
                <div className="dosalga-detail__stars">{renderStars(product.rating)}</div>
                <p>{reviewLabel}</p>
              </div>

              <p className="dosalga-detail__summary">
                <strong>Información del producto:</strong> {summaryText}
              </p>

              <p className="dosalga-detail__price">{product.priceDisplay}</p>

              <div className="dosalga-detail__selectors">
                <div className="dosalga-detail__selector">
                  <h2>Cantidad</h2>
                  <div className="dosalga-detail__quantity">
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => current + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {product.sizeOptions?.length ? (
                  <div className="dosalga-detail__selector">
                    <h2>Talla</h2>
                    <div className="dosalga-detail__chips">
                      {product.sizeOptions.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={
                            selectedSize === size
                              ? "dosalga-detail__chip is-active"
                              : "dosalga-detail__chip"
                          }
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="dosalga-detail__cta">
                <button
                  type="button"
                  className="dosalga-detail__primary-btn"
                  disabled={!product.inStock}
                  onClick={() => updateCart(false)}
                >
                  {product.inStock ? "Agregar al carrito" : "Agotado"}
                </button>
                <button
                  type="button"
                  className="dosalga-detail__secondary-btn"
                  disabled={!product.inStock}
                  onClick={() => updateCart(true)}
                >
                  Comprar ahora
                </button>
              </div>

              <div className="dosalga-detail__meta">
                {detailRows.map((row) => (
                  <div key={row.label} className="dosalga-detail__meta-item">
                    <span>{row.label}:</span>
                    <strong>{row.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .dosalga-detail {
          padding: 5rem 0;
        }

        .dosalga-detail__media {
          display: grid;
          grid-template-columns: 92px minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .dosalga-detail__thumbs {
          display: grid;
          gap: 14px;
          max-height: 760px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .dosalga-detail__thumb {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border: 1px solid #d9d9d9;
          background: #fff;
          overflow: hidden;
          transition: border-color 0.2s ease;
        }

        .dosalga-detail__thumb.is-active {
          border-color: #1f1f1f;
        }

        .dosalga-detail__thumb :global(img) {
          object-fit: cover;
        }

        .dosalga-detail__main-image {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1.05;
          background: #f6f6f6;
          overflow: hidden;
        }

        .dosalga-detail__main-image :global(img) {
          object-fit: contain;
        }

        .dosalga-detail__content h1 {
          margin: 0;
          color: #131313;
          font-size: clamp(2rem, 2.7vw, 3.5rem);
          line-height: 1.08;
          font-weight: 700;
          letter-spacing: -0.03em;
        }

        .dosalga-detail__rating {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 1.25rem;
        }

        .dosalga-detail__rating p {
          margin: 0;
          color: #4d4d4d;
          font-size: 1rem;
        }

        .dosalga-detail__stars {
          display: flex;
          gap: 8px;
        }

        .dosalga-detail__star {
          color: #d7d7d7;
          font-size: 1.45rem;
          line-height: 1;
        }

        .dosalga-detail__star.is-active {
          color: #f2ab00;
        }

        .dosalga-detail__summary {
          margin: 1.75rem 0 0;
          color: #666666;
          font-size: 1rem;
          line-height: 1.7;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
        }

        .dosalga-detail__summary strong {
          color: #3b3b3b;
          font-weight: 600;
        }

        .dosalga-detail__price {
          margin: 1.8rem 0 0;
          color: #1f1f1f;
          font-size: clamp(2rem, 1vw + 1.5rem, 2.7rem);
          font-weight: 700;
          line-height: 1;
        }

        .dosalga-detail__selectors {
          display: grid;
          grid-template-columns: minmax(0, 160px) minmax(0, 1fr);
          column-gap: 2.25rem;
          row-gap: 1.75rem;
          align-items: start;
          margin-top: 2.25rem;
        }

        .dosalga-detail__selector h2 {
          margin: 0 0 1rem;
          font-size: 1.15rem;
          font-weight: 700;
        }

        .dosalga-detail__quantity {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
        }

        .dosalga-detail__quantity button,
        .dosalga-detail__quantity span {
          width: 46px;
          height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d9d9d9;
          background: #fff;
          color: #1f1f1f;
          font-size: 1.4rem;
          font-weight: 600;
        }

        .dosalga-detail__quantity span {
          font-size: 1.1rem;
        }

        .dosalga-detail__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .dosalga-detail__chip {
          min-width: 72px;
          min-height: 50px;
          border: 1px solid #d9d9d9;
          background: #fff;
          color: #1f1f1f;
          font-size: 1rem;
          font-weight: 700;
          padding: 10px 16px;
        }

        .dosalga-detail__chip.is-active {
          border-color: #1f1f1f;
          background: #1f1f1f;
          color: #fff;
        }

        .dosalga-detail__cta {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 2.25rem;
          padding-bottom: 2.25rem;
          border-bottom: 1px solid #1f1f1f;
        }

        .dosalga-detail__primary-btn,
        .dosalga-detail__secondary-btn {
          min-width: 220px;
          min-height: 66px;
          border: 1px solid #1f1f1f;
          font-size: 1.1rem;
          font-weight: 700;
          padding: 16px 28px;
        }

        .dosalga-detail__primary-btn {
          background: #1f1f1f;
          color: #fff;
        }

        .dosalga-detail__secondary-btn {
          background: #fff;
          color: #1f1f1f;
        }

        .dosalga-detail__primary-btn:disabled,
        .dosalga-detail__secondary-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .dosalga-detail__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 14px 48px;
          margin-top: 1.8rem;
        }

        .dosalga-detail__meta-item {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          color: #6b6b6b;
          font-size: 1rem;
        }

        .dosalga-detail__meta-item span {
          color: #1f1f1f;
          font-weight: 600;
        }

        .dosalga-detail__meta-item strong {
          color: #6b6b6b;
          font-weight: 500;
        }

        @media (max-width: 991px) {
          .dosalga-detail {
            padding-top: 3rem;
          }

          .dosalga-detail__media {
            grid-template-columns: 1fr;
          }

          .dosalga-detail__thumbs {
            order: 2;
            grid-auto-flow: column;
            grid-auto-columns: 92px;
            overflow-x: auto;
            overflow-y: hidden;
            max-height: none;
            padding-bottom: 4px;
          }

          .dosalga-detail__main-image {
            order: 1;
          }

          .dosalga-detail__selectors {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 767px) {
          .dosalga-detail__cta {
            gap: 12px;
          }

          .dosalga-detail__primary-btn,
          .dosalga-detail__secondary-btn {
            width: 100%;
            min-width: 0;
          }

          .dosalga-detail__meta {
            gap: 12px 24px;
          }
        }
      `}</style>
    </section>
  );
}
