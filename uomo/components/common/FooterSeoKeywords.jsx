import { seoKeywordContent } from "@/data/seoKeywordContent";

const globalKeywords = [
  "cuidado facial Mexico CDMX",
  "tratamiento capilar Mexico CDMX",
  "belleza profesional Mexico CDMX",
  "tecnologia estetica Mexico CDMX",
  "elite 7 piel Mexico CDMX",
];

const footerKeywords = [
  ...globalKeywords,
  ...seoKeywordContent.sections.flatMap((section) => section.esKeywords),
];

export default function FooterSeoKeywords() {
  return (
    <nav className="footer-seo-keywords" aria-label="Palabras clave SEO">
      {footerKeywords.map((keyword) => (
        <span key={keyword} className="footer-seo-keywords__item">
          {keyword}
        </span>
      ))}
    </nav>
  );
}
