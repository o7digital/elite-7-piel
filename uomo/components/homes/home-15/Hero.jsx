"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { heroPromotions } from "@/data/heroPromotions";
import { getLocaleFromPath } from "@/lib/i18n/locale";

const heroSlides = [
  {
    id: "1",
    image:
      "https://oliviers52.sg-host.com/wp-content/uploads/2026/05/content-pixie-fMx0jcIxKmw-unsplash-scaled.jpg",
  },
  {
    id: "2",
    image:
      "https://oliviers52.sg-host.com/wp-content/uploads/2026/05/maria-kovalets-w1okCRYQSMY-unsplash-scaled.jpg",
  },
  {
    id: "3",
    image:
      "https://oliviers52.sg-host.com/wp-content/uploads/2026/05/aleksandrs-karevs-5TOxn3yB7K0-unsplash-scaled.jpg",
  },
  {
    id: "4",
    image:
      "https://oliviers52.sg-host.com/wp-content/uploads/2026/05/birgith-roosipuu-kmqIoF9H1bw-unsplash-scaled.jpg",
  },
  {
    id: "5",
    image:
      "https://oliviers52.sg-host.com/wp-content/uploads/2026/05/nora-topicals-qOo68ggoshY-unsplash-scaled.jpg",
  },
  {
    id: "6",
    image:
      "https://oliviers52.sg-host.com/wp-content/uploads/2026/05/poko-skincare-iexrtpiWLEw-unsplash-scaled.jpg",
  },
  {
    id: "7",
    image:
      "https://oliviers52.sg-host.com/wp-content/uploads/2026/05/elsa-olofsson-7K93db_iq08-unsplash-scaled.jpg",
  },
  {
    id: "8",
    image:
      "https://oliviers52.sg-host.com/wp-content/uploads/2026/05/ibnu-ihza-Z7u2bpbE65Q-unsplash-scaled.jpg",
  },
];

function getPromotion(slideId) {
  return heroPromotions.find(
    (promotion) => promotion.active && promotion.slideId === slideId
  );
}

function getPromotionText(promotion, locale) {
  if (locale === "en") {
    return {
      slogan: promotion.sloganEn || promotion.sloganEs,
      offer: promotion.offerEn || promotion.offerEs,
      codeLabel: "Code",
    };
  }

  return {
    slogan: promotion.sloganEs || promotion.sloganEn,
    offer: promotion.offerEs || promotion.offerEn,
    codeLabel: "Codigo",
  };
}

export default function Hero() {
  const pathname = usePathname();
  const locale = useMemo(() => getLocaleFromPath(pathname || "/"), [pathname]);

  return (
    <section className="elite-hero-slider" aria-label="ELITE 7 PIEL promotions">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation]}
        effect="fade"
        loop
        speed={800}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: ".elite-hero-slider__prev",
          nextEl: ".elite-hero-slider__next",
        }}
        className="elite-hero-slider__swiper"
      >
        {heroSlides.map((slide, index) => {
          const promotion = getPromotion(slide.id);
          const text = promotion ? getPromotionText(promotion, locale) : null;

          return (
            <SwiperSlide key={slide.id} className="elite-hero-slider__slide">
              <img
                src={slide.image}
                alt=""
                loading={index === 0 ? "eager" : "lazy"}
                decoding={index === 0 ? "sync" : "async"}
                className="elite-hero-slider__image"
              />
              {promotion && text ? (
                <div className="elite-hero-promo">
                  <p className="elite-hero-promo__slogan">{text.slogan}</p>
                  <p className="elite-hero-promo__offer">{text.offer}</p>
                  {promotion.couponCode ? (
                    <span className="elite-hero-promo__coupon">
                      {text.codeLabel} {promotion.couponCode}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </SwiperSlide>
          );
        })}
      </Swiper>
      <button
        type="button"
        className="elite-hero-slider__arrow elite-hero-slider__prev"
        aria-label={locale === "en" ? "Previous slide" : "Slide anterior"}
      >
        ‹
      </button>
      <button
        type="button"
        className="elite-hero-slider__arrow elite-hero-slider__next"
        aria-label={locale === "en" ? "Next slide" : "Siguiente slide"}
      >
        ›
      </button>
    </section>
  );
}
