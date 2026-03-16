"use client";

import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";

function renderStars(rating = 0) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={`dosalga-card__star ${
        index < roundedRating ? "is-active" : ""
      }`}
      aria-hidden="true"
    >
      ★
    </span>
  ));
}

export default function DosalgaProductCard({
  product,
  detailHref = `/shop/product/${product.id}`,
}) {
  const {
    addProductToCart,
    isAddedToCartProducts,
    isAddedtoWishlist,
    setQuickViewItem,
    toggleWishlist,
  } = useContextElement();

  const hasOptions = product.hasOptions || product.type === "variable";
  const imageAlt = product.title || "Producto";
  const shareLabel = "Compartir:";
  const isWishlisted = isAddedtoWishlist(product.id);
  const isInCart = isAddedToCartProducts(product.id);

  const handleShare = (platform) => {
    if (typeof window === "undefined") {
      return;
    }

    const pageUrl = new URL(detailHref, window.location.origin).toString();
    const encodedUrl = encodeURIComponent(pageUrl);
    const encodedTitle = encodeURIComponent(product.title);

    const shareTargets = {
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    };

    const target = shareTargets[platform];

    if (target) {
      window.open(target, "_blank", "noopener,noreferrer");
    }
  };

  const handleAddToCart = () => {
    if (!hasOptions && product.inStock) {
      addProductToCart(product);
    }
  };

  return (
    <article className="dosalga-card h-100">
      <div className="dosalga-card__media">
        <Link href={detailHref} className="dosalga-card__image-link">
          <span className="dosalga-card__image-frame">
            <Image
              src={product.imgSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
              className="dosalga-card__image dosalga-card__image--primary"
            />
            <Image
              src={product.imgSrc2 || product.imgSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
              className="dosalga-card__image dosalga-card__image--secondary"
            />
          </span>
        </Link>

        <div className="dosalga-card__actions">
          <button
            type="button"
            className={`dosalga-card__icon-btn ${isWishlisted ? "is-active" : ""}`}
            aria-label={
              isWishlisted ? "Quitar de favoritos" : "Agregar a favoritos"
            }
            onClick={() => toggleWishlist(product.id)}
          >
            <svg width="18" height="18" viewBox="0 0 20 20">
              <use href="#icon_heart" />
            </svg>
          </button>
          <button
            type="button"
            className="dosalga-card__icon-btn dosalga-card__icon-btn--dark"
            aria-label="Vista rápida"
            data-bs-toggle="modal"
            data-bs-target="#quickView"
            onClick={() => setQuickViewItem(product)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <use href="#icon_view" />
            </svg>
          </button>
        </div>

        <div className="dosalga-card__cta">
          {hasOptions || !product.inStock ? (
            <Link href={detailHref} className="dosalga-card__cta-btn">
              {product.inStock ? "Ver opciones" : "Agotado"}
            </Link>
          ) : (
            <button
              type="button"
              className="dosalga-card__cta-btn"
              onClick={handleAddToCart}
            >
              {isInCart ? "Ya en carrito" : "Agregar al carrito"}
            </button>
          )}
        </div>
      </div>

      <div className="dosalga-card__body">
        <h3 className="dosalga-card__title">
          <Link href={detailHref}>{product.title}</Link>
        </h3>
        <p className="dosalga-card__category">{product.category}</p>
        <p className="dosalga-card__price">{product.priceDisplay}</p>
        <div className="dosalga-card__rating" aria-label="Valoración del producto">
          {renderStars(product.rating)}
        </div>
        <div className="dosalga-card__share">
          <span>{shareLabel}</span>
          <button type="button" onClick={() => handleShare("x")}>
            X
          </button>
          <button type="button" onClick={() => handleShare("facebook")}>
            FB
          </button>
          <button type="button" onClick={() => handleShare("whatsapp")}>
            WA
          </button>
        </div>
      </div>

      <style jsx>{`
        .dosalga-card {
          position: relative;
          border: 1px solid #e7e7e7;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }

        .dosalga-card__media {
          position: relative;
          overflow: hidden;
          padding: 20px 20px 0;
        }

        .dosalga-card__image-link {
          display: block;
        }

        .dosalga-card__image-frame {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1.06;
          background: #f7f7f7;
          overflow: hidden;
        }

        .dosalga-card__image {
          object-fit: contain;
          transition: opacity 0.35s ease, transform 0.35s ease;
          background: #f7f7f7;
        }

        .dosalga-card__image--secondary {
          opacity: 0;
        }

        .dosalga-card__actions {
          position: absolute;
          top: 30px;
          right: 30px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 2;
        }

        .dosalga-card__icon-btn {
          width: 42px;
          height: 42px;
          border: 1px solid #1f1f1f;
          background: #ffffff;
          color: #1f1f1f;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        .dosalga-card__icon-btn :global(path),
        .dosalga-card__icon-btn :global(use) {
          pointer-events: none;
        }

        .dosalga-card__icon-btn--dark,
        .dosalga-card__icon-btn:hover,
        .dosalga-card__icon-btn.is-active {
          background: #1f1f1f;
          color: #ffffff;
          border-color: #1f1f1f;
        }

        .dosalga-card__cta {
          position: absolute;
          left: 20px;
          right: 20px;
          bottom: 20px;
          z-index: 2;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .dosalga-card__cta-btn {
          width: 100%;
          border: 0;
          background: #1f1f1f;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 64px;
          padding: 14px 20px;
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.15;
          text-align: center;
          text-decoration: none;
        }

        .dosalga-card__body {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          padding: 26px 22px 24px;
        }

        .dosalga-card__title {
          margin: 0;
          font-size: clamp(1.1rem, 1vw + 0.9rem, 1.5rem);
          line-height: 1.14;
          font-weight: 700;
          letter-spacing: -0.02em;
          max-width: 14ch;
        }

        .dosalga-card__title :global(a) {
          color: #202020;
          text-decoration: none;
        }

        .dosalga-card__title :global(a:hover) {
          color: #000000;
        }

        .dosalga-card__category {
          margin: 0;
          color: #8c8c8c;
          text-transform: uppercase;
          font-size: 0.96rem;
          letter-spacing: 0.04em;
        }

        .dosalga-card__price {
          margin: 8px 0 0;
          color: #202020;
          font-size: clamp(1.2rem, 1vw + 1rem, 1.5rem);
          line-height: 1;
          font-weight: 700;
        }

        .dosalga-card__rating {
          display: flex;
          gap: 6px;
          margin-top: 4px;
        }

        .dosalga-card__star {
          color: #d7d7d7;
          font-size: 1.45rem;
          line-height: 1;
        }

        .dosalga-card__star.is-active {
          color: #202020;
        }

        .dosalga-card__share {
          margin-top: auto;
          padding-top: 12px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #5e5e5e;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .dosalga-card__share button {
          min-width: 44px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid #d8d8d8;
          background: #ffffff;
          color: #333333;
          font-size: 0.95rem;
          font-weight: 700;
          padding: 0 12px;
        }

        .dosalga-card:hover .dosalga-card__image--primary {
          opacity: 0;
          transform: scale(1.02);
        }

        .dosalga-card:hover .dosalga-card__image--secondary {
          opacity: 1;
          transform: scale(1.02);
        }

        .dosalga-card:hover .dosalga-card__cta {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 991px) {
          .dosalga-card__cta {
            opacity: 1;
            transform: none;
          }

          .dosalga-card__cta-btn {
            min-height: 56px;
            font-size: 0.95rem;
          }

          .dosalga-card__actions {
            top: 24px;
            right: 24px;
            gap: 10px;
          }

          .dosalga-card__icon-btn {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </article>
  );
}
