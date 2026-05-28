const footerSeoKeywords = {
  es: [
    "cuidado facial México",
    "skincare México",
    "belleza profesional México",
    "tratamiento facial CDMX",
    "tecnología estética México",
    "cremas antiarrugas México",
    "crema rejuvenecedora México",
    "crema hidratante facial",
    "productos para el cuidado de la piel",
    "productos de belleza online México",
    "tienda de belleza México",
    "productos profesionales de belleza",
    "tratamiento capilar México",
    "productos para el cabello México",
    "cuidado capilar México",
    "reparación del cabello dañado",
    "crecimiento del cabello México",
    "aparato facial antiedad",
    "radiofrecuencia facial en casa",
    "tecnología para rejuvenecimiento facial",
  ],
  en: [
    "facial care Mexico",
    "skincare Mexico",
    "professional beauty Mexico",
    "facial treatment Mexico City",
    "aesthetic technology Mexico",
    "anti-aging creams Mexico",
    "rejuvenating cream Mexico",
    "facial moisturizer",
    "skin care products",
    "online beauty products Mexico",
    "beauty store Mexico",
    "professional beauty products",
    "hair treatment Mexico",
    "hair care products Mexico",
    "hair care Mexico",
    "damaged hair repair",
    "hair growth Mexico",
    "anti-aging facial device",
    "home facial radiofrequency",
    "facial rejuvenation technology",
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
