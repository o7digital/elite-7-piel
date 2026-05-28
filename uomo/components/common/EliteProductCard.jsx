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
  const secondaryImage = product.imgSrc2 || product.imgSrc || FALLBACK_IMAGE;
  const [primaryImage, setPrimaryImage] = useState(
    product.imgSrc || secondaryImage
  );
  const [hoverImage, setHoverImage] = useState(secondaryImage);

  const imageFallbacks = useMemo(
    () => [secondaryImage, FALLBACK_IMAGE].filter(Boolean),
    [secondaryImage]
  );

  const handleImageError = (setter) => {
    setter((currentImage) => {
      const nextImage = imageFallbacks.find((candidate) => candidate !== currentImage);

      return nextImage || currentImage;
    });
  };

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
            <Image
              src={primaryImage}
              alt={imageAlt}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
              className="dosalga-card__image dosalga-card__image--primary"
              onError={() => handleImageError(setPrimaryImage)}
            />
            <Image
              src={hoverImage}
              alt={imageAlt}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
              className="dosalga-card__image dosalga-card__image--secondary"
              onError={() => handleImageError(setHoverImage)}
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
          border: 1px solid #e2ddd5;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.96), #ffffff 44%),
            #ffffff;
          display: flex;
          flex-direction: column;
          min-height: 100%;
          isolation: isolate;
          box-shadow: 0 16px 42px rgba(58, 43, 31, 0.05);
          transition:
            border-color 0.28s ease,
            box-shadow 0.28s ease,
            transform 0.28s ease;
        }

        .dosalga-card::before {
          content: "";
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(167, 139, 111, 0);
          pointer-events: none;
          z-index: 3;
          transition: border-color 0.28s ease, inset 0.28s ease;
        }

        .dosalga-card__media {
          position: relative;
          overflow: hidden;
          padding: 18px 18px 0;
        }

        .dosalga-card__image-link {
          display: block;
        }

        .dosalga-card__image-frame {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1.08;
          background:
            radial-gradient(circle at 50% 18%, rgba(236, 225, 210, 0.82), transparent 38%),
            linear-gradient(135deg, #f8f4ed 0%, #ffffff 48%, #efe6da 100%);
          overflow: hidden;
        }

        .dosalga-card__image-frame::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(22, 19, 16, 0) 52%,
            rgba(22, 19, 16, 0.14) 100%
          );
          opacity: 0;
          transition: opacity 0.32s ease;
          z-index: 1;
        }

        .dosalga-card__image {
          object-fit: contain;
          transition: opacity 0.35s ease, transform 0.35s ease;
          background: transparent;
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
          gap: 10px;
          z-index: 2;
          opacity: 0;
          transform: translateX(10px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .dosalga-card__icon-btn {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(32, 29, 25, 0.18);
          background: rgba(255, 255, 255, 0.92);
          color: #211d19;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 24px rgba(31, 25, 19, 0.1);
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        .dosalga-card__icon-btn :global(path),
        .dosalga-card__icon-btn :global(use) {
          pointer-events: none;
        }

        .dosalga-card__icon-btn--dark,
        .dosalga-card__icon-btn:hover,
        .dosalga-card__icon-btn.is-active {
          background: #211d19;
          color: #ffffff;
          border-color: #211d19;
        }

        .dosalga-card__cta {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 18px;
          z-index: 2;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .dosalga-card__cta-btn {
          width: 100%;
          border: 0;
          background: #211d19 !important;
          color: #ffffff !important;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 58px;
          padding: 14px 20px;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          line-height: 1.15;
          text-align: center;
          text-decoration: none;
          box-shadow: 0 16px 30px rgba(33, 29, 25, 0.2);
        }

        .dosalga-card__body {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          padding: 24px 22px 24px;
        }

        .dosalga-card__title {
          margin: 0;
          font-size: clamp(1.02rem, 0.7vw + 0.92rem, 1.38rem);
          line-height: 1.18;
          font-weight: 800;
          letter-spacing: -0.02em;
          max-width: 16ch;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }

        .dosalga-card__title :global(a) {
          color: #211d19;
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
          color: #8f7d69;
          text-transform: uppercase;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .dosalga-card__price {
          margin: 8px 0 0;
          color: #211d19;
          font-size: clamp(1.2rem, 0.8vw + 1rem, 1.42rem);
          line-height: 1;
          font-weight: 900;
        }

        .dosalga-card__rating {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin-top: 4px;
        }

        .dosalga-card__star {
          color: #d8d2c9;
          font-size: 1.34rem;
          line-height: 1;
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.85);
        }

        .dosalga-card__star.is-active {
          color: #211d19;
        }

        .dosalga-card__review-count {
          margin-left: 4px;
          color: #a69b8e;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .dosalga-card__share {
          padding-top: 10px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #6f6255;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 800;
        }

        .dosalga-card__share button {
          min-width: 40px;
          height: 34px;
          border-radius: 999px;
          border: 1px solid #ded7ce;
          background: #ffffff;
          color: #211d19;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0 11px;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .dosalga-card__share button:hover {
          background: #211d19;
          border-color: #211d19;
          color: #ffffff;
          transform: translateY(-1px);
        }

        .dosalga-card:hover {
          border-color: #211d19;
          box-shadow: 0 24px 58px rgba(58, 43, 31, 0.12);
          transform: translateY(-4px);
        }

        .dosalga-card:hover::before {
          inset: 8px;
          border-color: rgba(33, 29, 25, 0.18);
        }

        .dosalga-card:hover .dosalga-card__image--primary {
          opacity: 0;
          transform: scale(1.035);
        }

        .dosalga-card:hover .dosalga-card__image--secondary {
          opacity: 1;
          transform: scale(1.035);
        }

        .dosalga-card:hover .dosalga-card__image-frame::after {
          opacity: 1;
        }

        .dosalga-card:hover .dosalga-card__cta {
          opacity: 1;
          transform: translateY(0);
        }

        .dosalga-card:hover .dosalga-card__actions {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 991px) {
          .dosalga-card__cta {
            opacity: 1;
            transform: none;
          }

          .dosalga-card__actions {
            opacity: 1;
            transform: none;
          }

          .dosalga-card__cta-btn {
            min-height: 52px;
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

          .dosalga-card__icon-btn--dark {
            background: #211d19;
            color: #fff;
            border-color: #211d19;
          }
        }

        @media (max-width: 767px) {
          .dosalga-card:hover {
            transform: none;
          }

          .dosalga-card__media {
            padding: 14px 14px 0;
          }

          .dosalga-card__cta {
            left: 14px;
            right: 14px;
            bottom: 14px;
          }

          .dosalga-card__title {
            font-size: clamp(1.25rem, 4vw + 0.6rem, 1.7rem);
            max-width: 15ch;
          }

          .dosalga-card__price {
            font-size: clamp(1.45rem, 4vw + 0.65rem, 1.9rem);
          }

          .dosalga-card__share {
            gap: 8px;
          }

          .dosalga-card__share button {
            min-width: 38px;
            height: 32px;
          }
        }
      `}</style>
    </article>
  );
}
