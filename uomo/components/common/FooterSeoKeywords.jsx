const footerSeoKeywords = {
  es: [
    "cuidado facial México",
    "skincare México",
    "belleza profesional México",
    "tratamiento facial CDMX",
    "tecnología estética México",
    "cremas antiarrugas México",
    "crema rejuvenecedora",
    "crema hidratante facial",
    "productos para el cuidado de la piel",
    "tienda de belleza México",
    "productos de belleza online",
    "tratamiento capilar México",
    "productos para el cabello",
    "cuidado capilar",
    "reparación del cabello dañado",
    "crecimiento del cabello",
    "aparato facial antiedad",
    "radiofrecuencia facial en casa",
    "rejuvenecimiento facial",
    "productos profesionales de belleza",
  ],
  en: [
    "facial care Mexico",
    "skincare Mexico",
    "professional beauty Mexico",
    "facial treatment CDMX",
    "beauty technology Mexico",
    "anti-wrinkle cream",
    "skin rejuvenation cream",
    "facial moisturizer",
    "skin care products",
    "beauty store Mexico",
    "online beauty products",
    "hair treatment Mexico",
    "hair care products",
    "damaged hair repair",
    "hair growth products",
    "anti-aging facial device",
    "at-home radiofrequency device",
    "facial rejuvenation",
    "professional beauty products",
    "skin and hair care store",
  ],
};

export default function FooterSeoKeywords({ locale = "es" }) {
  const keywords = footerSeoKeywords[locale] || footerSeoKeywords.es;

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
