"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/lib/i18n/locale";

export default function Hero() {
  const pathname = usePathname();
  const locale = useMemo(() => getLocaleFromPath(pathname || "/"), [pathname]);
  const sliderSrc = `/api/smart-slider-hero?locale=${locale}`;

  return (
    <section
      className="w-100"
      style={{
        lineHeight: 0,
        background: "#f3f3f3",
        overflow: "hidden",
      }}
    >
      <iframe
        src={sliderSrc}
        title="Smart Slider 3 Hero"
        style={{
          width: "100%",
          height: "clamp(360px, 57.14vw, 800px)",
          border: 0,
          display: "block",
        }}
        loading="eager"
        allow="autoplay; fullscreen"
      />
    </section>
  );
}
