import { seoKeywordContent } from "@/data/seoKeywordContent";

const suffix = "Mexico CDMX";

const globalKeywords = {
  es: [
    "cuidado facial",
    "tratamiento capilar",
    "belleza profesional",
    "tecnologia estetica",
    "elite 7 piel",
  ],
  en: [
    "facial care",
    "hair treatment",
    "professional beauty",
    "beauty technology",
    "elite 7 piel",
  ],
};

function withLocation(keyword) {
  return keyword.endsWith(suffix) ? keyword : `${keyword} ${suffix}`;
}

export default function FooterSeoKeywords({ locale = "es" }) {
  const keywordKey = locale === "en" ? "enKeywords" : "esKeywords";
  const keywords = [
    ...(globalKeywords[locale] || globalKeywords.es),
    ...seoKeywordContent.sections.flatMap((section) => section[keywordKey]),
  ].map(withLocation);

  return (
    <nav
      className="footer-seo-keywords"
      aria-label={locale === "en" ? "SEO keywords" : "Palabras clave SEO"}
    >
      {keywords.map((keyword) => (
        <span key={keyword} className="footer-seo-keywords__item">
          {keyword}
        </span>
      ))}
    </nav>
  );
}
