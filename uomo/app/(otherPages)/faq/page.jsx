import Footer14 from "@/components/footers/Footer14";
import JsonLd from "@/components/common/JsonLd";
import Header14 from "@/components/headers/Header14";
import Faq, { faqSections } from "@/components/otherPages/Faq";
import React from "react";

export const metadata = {
  title: "Preguntas Frecuentes | ELITE 7 PIEL",
  description:
    "Resuelve tus dudas sobre productos, pedidos, pagos y atención en ELITE 7 PIEL.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqSections.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: item.heading,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.body,
      },
    }))
  ),
};

export default function FaqPage() {
  return (
    <div className="theme-15">
      <JsonLd data={faqJsonLd} />
      <Header14 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <Faq />
      </main>
      <Footer14 />
    </div>
  );
}
