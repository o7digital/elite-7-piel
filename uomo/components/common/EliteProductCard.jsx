"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useContextElement } from "@/context/Context";

const FALLBACK_IMAGE = "/assets/images/home/demo15/product-1.webp";

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
      {index < roundedRating ? "★" : "☆"}
    </span>
  ));
}

export default function EliteProductCard({
  product,
  detailHref = `/shop/product/${product.id}`,
}) {
  const {
    isAddedtoWishlist,
    toggleWishlist,
  } = useContextElement();

  const imageAlt = product.title || "Producto";
  const shareLabel = "Compartir:";
  const isWishlisted = isAddedtoWishlist(product.id);
  const reviewCount = Number(product.reviewCount || 0);
  const [brokenImages, setBrokenImages] = useState({});

  const galleryImages = useMemo(() => {
    const sourceImages = [
      ...(product.images || []).map((image) => image.src),
      product.imgSrc,
      product.imgSrc2,
      FALLBACK_IMAGE,
    ].filter(Boolean);

    return [...new Set(sourceImages)].slice(0, 5);
  }, [product.images, product.imgSrc, product.imgSrc2]);

  const visibleImages = galleryImages.map((src) =>
    brokenImages[src] ? FALLBACK_IMAGE : src
  );
  const slideDuration = Math.max(visibleImages.length * 1.25, 2.5);

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

  return (
    <article className="dosalga-card h-100">
      <div className="dosalga-card__media">
        <Link href={detailHref} className="dosalga-card__image-link">
          <span className="dosalga-card__image-frame">
            {visibleImages.map((src, index) => (
              <Image
                key={`${src}-${index}`}
                src={src}
                alt={imageAlt}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
                className="dosalga-card__image"
                priority={index === 0}
                style={{
                  "--slide-delay": `${index * 1.25}s`,
                  "--slide-duration": `${slideDuration}s`,
                }}
                onError={() => {
                  if (src !== FALLBACK_IMAGE) {
                    setBrokenImages((previous) => ({
                      ...previous,
                      [src]: true,
                    }));
                  }
                }}
              />
            ))}

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
          <Link
            href={detailHref}
            className="dosalga-card__icon-btn dosalga-card__icon-btn--dark"
            aria-label="Ver detalle del producto"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <use href="#icon_view" />
            </svg>
          </Link>
        </div>

        <div className="dosalga-card__cta">
          <Link href={detailHref} className="dosalga-card__cta-btn">
            View product
          </Link>
        </div>
      </div>

      <div className="dosalga-card__body">
        <h3 className="dosalga-card__title">
          <Link href={detailHref}>{product.title}</Link>
        </h3>

        <div className="dosalga-card__meta">
          <p className="dosalga-card__category">{product.category}</p>
          <p className="dosalga-card__price">{product.priceDisplay}</p>
          <div
            className="dosalga-card__rating"
            aria-label="Valoración del producto"
          >
            {renderStars(product.rating)}
            {reviewCount > 0 ? (
              <span className="dosalga-card__review-count">({reviewCount})</span>
            ) : null}
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
      </div>

      <style jsx>{`
        .dosalga-card {
          position: relative;
          border: 1px solid #e2e2e2;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          min-height: 100%;
          overflow: hidden;
          box-shadow: none;
          transition: border-color 0.22s ease, box-shadow 0.22s ease;
        }

        .dosalga-card__media {
          position: relative;
          overflow: hidden;
          padding: 22px 22px 0;
        }

        :global(.dosalga-card__image-link) {
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

        .dosalga-card__image-frame::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          background: rgba(0, 0, 0, 0.1);
          opacity: 0;
          transition: opacity 0.25s ease;
          pointer-events: none;
        }

        :global(.dosalga-card__image) {
          object-fit: cover;
          object-position: center;
          opacity: 0;
          transform: scale(1.01);
          background: #f7f7f7;
        }

        :global(.dosalga-card__image:first-child) {
          opacity: 1;
        }

        .dosalga-card__actions {
          position: absolute;
          top: 34px;
          right: 34px;
          z-index: 4;
          display: flex;
          flex-direction: column;
          gap: 12px;
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 0.22s ease, transform 0.22s ease;
        }

        :global(.dosalga-card__icon-btn) {
          width: 44px;
          height: 44px;
          border: 0;
          background: #ffffff;
          color: #111111;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          transition: background 0.18s ease, color 0.18s ease;
        }

        :global(.dosalga-card__icon-btn path),
        :global(.dosalga-card__icon-btn use) {
          pointer-events: none;
        }

        :global(.dosalga-card__icon-btn--dark),
        :global(.dosalga-card__icon-btn:hover),
        :global(.dosalga-card__icon-btn.is-active) {
          background: #1f1f1f;
          color: #ffffff;
        }

        .dosalga-card__cta {
          position: absolute;
          left: 50%;
          bottom: 28px;
          z-index: 4;
          opacity: 0;
          transform: translate(-50%, 12px);
          transition: opacity 0.22s ease, transform 0.22s ease;
        }

        :global(.dosalga-card__cta-btn) {
          border: 2px solid #1f1f1f;
          background: #ffffff !important;
          color: #1f1f1f !important;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 174px;
          min-height: 56px;
          padding: 12px 22px;
          font-size: 1rem;
          font-weight: 800;
          line-height: 1;
          text-align: center;
          text-decoration: none;
          box-shadow: -18px 18px 0 #1f1f1f;
          white-space: nowrap;
        }

        .dosalga-card__body {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          padding: 26px 22px 24px;
        }

        .dosalga-card__title {
          margin: 0;
          max-width: 15ch;
          font-size: clamp(1.12rem, 0.7vw + 0.95rem, 1.45rem);
          line-height: 1.18;
          font-weight: 800;
          letter-spacing: -0.03em;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }

        .dosalga-card__title :global(a) {
          color: #242424;
          text-decoration: none;
        }

        .dosalga-card__title :global(a:hover) {
          color: #000000;
        }

        .dosalga-card__meta {
          width: 100%;
          margin-top: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
        }

        .dosalga-card__category {
          margin: 0;
          color: #8d8d8d;
          text-transform: uppercase;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .dosalga-card__price {
          margin: 10px 0 0;
          color: #242424;
          font-size: clamp(1.18rem, 0.7vw + 1rem, 1.42rem);
          line-height: 1;
          font-weight: 900;
        }

        .dosalga-card__rating {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          margin-top: 2px;
        }

        .dosalga-card__star {
          color: #1f1f1f;
          font-size: 1.18rem;
          line-height: 1;
        }

        .dosalga-card__star:not(.is-active) {
          color: transparent;
          -webkit-text-stroke: 1px #1f1f1f;
        }

        .dosalga-card__review-count {
          margin-left: 5px;
          color: #9a9a9a;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .dosalga-card__share {
          padding-top: 10px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #444444;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 800;
        }

        .dosalga-card__share button {
          min-width: 42px;
          height: 34px;
          border-radius: 999px;
          border: 1px solid #dcdcdc;
          background: #ffffff;
          color: #242424;
          font-size: 0.82rem;
          font-weight: 800;
          padding: 0 12px;
          transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
        }

        .dosalga-card__share button:hover {
          background: #1f1f1f;
          border-color: #1f1f1f;
          color: #ffffff;
        }

        .dosalga-card:hover,
        .dosalga-card:focus-within {
          border-color: #1f1f1f;
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.08);
        }

        .dosalga-card:hover :global(.dosalga-card__image),
        .dosalga-card:focus-within :global(.dosalga-card__image) {
          animation: elite-card-image-flow var(--slide-duration) infinite;
          animation-delay: var(--slide-delay);
          opacity: 0;
        }

        .dosalga-card:hover .dosalga-card__image-frame::after,
        .dosalga-card:focus-within .dosalga-card__image-frame::after {
          opacity: 1;
        }

        .dosalga-card:hover .dosalga-card__cta,
        .dosalga-card:focus-within .dosalga-card__cta,
        .dosalga-card:hover .dosalga-card__actions,
        .dosalga-card:focus-within .dosalga-card__actions {
          opacity: 1;
          transform: translateX(0);
        }

        .dosalga-card:hover .dosalga-card__cta,
        .dosalga-card:focus-within .dosalga-card__cta {
          transform: translate(-50%, 0);
        }

        @keyframes elite-card-image-flow {
          0%,
          19% {
            opacity: 1;
            transform: scale(1.02);
          }

          25%,
          100% {
            opacity: 0;
            transform: scale(1.08);
          }
        }

        @media (max-width: 991px) {
          .dosalga-card__actions {
            opacity: 1;
            transform: none;
          }

          .dosalga-card__cta {
            opacity: 1;
            left: 50%;
            bottom: 24px;
            transform: translateX(-50%);
          }

          .dosalga-card__actions {
            top: 28px;
            right: 28px;
          }
        }

        @media (max-width: 767px) {
          .dosalga-card__media {
            padding: 14px 14px 0;
          }

          .dosalga-card__actions {
            top: 20px;
            right: 20px;
          }

          :global(.dosalga-card__icon-btn) {
            width: 38px;
            height: 38px;
          }

          .dosalga-card__cta {
            bottom: 22px;
          }

          :global(.dosalga-card__cta-btn) {
            min-width: 142px;
            min-height: 46px;
            font-size: 0.88rem;
            box-shadow: -12px 12px 0 #1f1f1f;
          }

          .dosalga-card__body {
            padding: 22px 18px 24px;
          }

          .dosalga-card__title {
            max-width: 13ch;
            font-size: 28px;
            line-height: 1.14;
          }

          .dosalga-card__category {
            font-size: 17px;
          }

          .dosalga-card__price {
            font-size: 26px;
          }

          .dosalga-card__share {
            font-size: 16px;
            gap: 8px;
          }

          .dosalga-card__share button {
            min-width: 48px;
            height: 40px;
            font-size: 16px;
          }
        }
      `}</style>
    </article>
  );
}
