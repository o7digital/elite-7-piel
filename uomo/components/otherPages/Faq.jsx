"use client";

import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/lib/i18n/locale";
import { getFaqSections } from "@/data/faq";

export default function Faq() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const localizedSections = getFaqSections(locale);

  return (
    <section className="container mw-930 lh-30">
      <h2 className="section-title text-uppercase fw-bold mb-5">
        {locale === "en" ? "Frequently Asked Questions" : "Preguntas Frecuentes"}
      </h2>

      {localizedSections.map((section) => (
        <div key={section.id} className="mb-5">
          <h3 className="mb-4">{section.title}</h3>
          {section.items.map((item) => (
            <article key={item.id} className="mb-4">
              <h3 className="h5 mb-2">{item.heading}</h3>
              <p className="mb-0">{item.body}</p>
            </article>
          ))}
        </div>
      ))}
    </section>
  );
}
