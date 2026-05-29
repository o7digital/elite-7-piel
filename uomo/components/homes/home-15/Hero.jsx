"use client";

import Link from "next/link";
import { slideData10 } from "@/data/heroslides";

export default function Hero() {
  return (
    <section className="home15-hero" aria-label="Colecciones destacadas">
      <div className="home15-hero__slides">
        {slideData10.map((slide, index) => (
          <article
            key={slide.id}
            className="home15-hero__slide"
            style={{
              "--hero-image": `url(${slide.bgImage})`,
              "--slide-index": index,
            }}
          >
            <div className="home15-hero__content">
              <p className="home15-hero__eyebrow">ELITE 7 PIEL</p>
              <h1>{slide.title}</h1>
              <p className="home15-hero__description">{slide.description}</p>
              <Link href="/shop" className="home15-hero__link">
                Ver productos
              </Link>
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .home15-hero {
          position: relative;
          min-height: clamp(420px, 57.14vw, 800px);
          overflow: hidden;
          background: #f3f3f3;
        }

        .home15-hero__slides {
          position: absolute;
          inset: 0;
        }

        .home15-hero__slide {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          background-image: linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.42),
              rgba(0, 0, 0, 0.12) 48%,
              rgba(0, 0, 0, 0)
            ),
            var(--hero-image);
          background-position: center;
          background-size: cover;
          opacity: 0;
          animation: home15HeroFade 10s infinite;
          animation-delay: calc(var(--slide-index) * 5s);
        }

        .home15-hero__slide:first-child {
          opacity: 1;
        }

        .home15-hero__content {
          width: min(560px, calc(100% - 40px));
          margin-left: clamp(20px, 8vw, 120px);
          color: #ffffff;
        }

        .home15-hero__eyebrow {
          margin: 0 0 0.8rem;
          font-size: 0.8rem;
          line-height: 1.2;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .home15-hero h1 {
          margin: 0;
          font-size: clamp(2.4rem, 5vw, 5.3rem);
          line-height: 1;
          font-weight: 600;
          color: inherit;
        }

        .home15-hero__description {
          max-width: 520px;
          margin: 1.25rem 0 0;
          font-size: clamp(1rem, 1.1vw, 1.15rem);
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.9);
        }

        :global(.home15-hero__link) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          margin-top: 1.75rem;
          padding: 0 1.6rem;
          border: 1px solid #ffffff;
          color: #ffffff;
          background: transparent;
          text-transform: uppercase;
          font-size: 0.86rem;
          font-weight: 600;
          text-decoration: none;
        }

        :global(.home15-hero__link:hover) {
          background: #ffffff;
          color: #111111;
        }

        @keyframes home15HeroFade {
          0%,
          45% {
            opacity: 1;
          }
          55%,
          100% {
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home15-hero__slide {
            animation: none;
          }

          .home15-hero__slide:not(:first-child) {
            display: none;
          }
        }

        @media (max-width: 767px) {
          .home15-hero {
            min-height: 560px;
          }

          .home15-hero__slide {
            align-items: flex-end;
            padding-bottom: 4.5rem;
            background-position: center top;
          }

          .home15-hero__content {
            margin-left: 20px;
          }
        }
      `}</style>
    </section>
  );
}
