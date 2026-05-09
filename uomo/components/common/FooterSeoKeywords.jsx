"use client";

import { seoKeywordContent } from "@/data/seoKeywordContent";
import { getLocaleFromPath } from "@/lib/i18n/locale";
import { usePathname } from "next/navigation";

const globalKeywords = {
  es: [
    "cuidado facial Mexico CDMX",
    "tratamiento capilar Mexico CDMX",
    "belleza profesional Mexico CDMX",
    "tecnologia estetica Mexico CDMX",
    "elite 7 piel Mexico CDMX",
  ],
  en: [
    "facial care Mexico CDMX",
    "hair treatment Mexico CDMX",
    "professional beauty Mexico CDMX",
    "beauty technology Mexico CDMX",
    "elite 7 piel Mexico CDMX",
  ],
};

export default function FooterSeoKeywords() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const keywordKey = locale === "en" ? "enKeywords" : "esKeywords";
  const footerKeywords = [
    ...(globalKeywords[locale] || globalKeywords.es),
    ...seoKeywordContent.sections.flatMap((section) => section[keywordKey]),
  ];

  return (
    <nav
      className="footer-seo-keywords"
      aria-label={locale === "en" ? "SEO keywords" : "Palabras clave SEO"}
    >
      {footerKeywords.map((keyword) => (
        <span key={keyword} className="footer-seo-keywords__item">
          {keyword}
        </span>
      ))}
    </nav>
  );
}
