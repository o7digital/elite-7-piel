import Footer14 from "@/components/footers/Footer14";
import Header14 from "@/components/headers/Header14";
import Contact from "@/components/otherPages/Contact/Contact";
import React from "react";

export const metadata = {
  title: "Contacto || ELITE 7 PIEL",
  description: "Contacto ELITE 7 PIEL",
};
export default function ContactPage() {
  return (
    <div className="theme-15">
      <Header14 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <section className="contact-us container">
          <div className="mw-930">
            <h2 className="page-title">CONTACTO</h2>
          </div>
        </section>
        <Contact />
      </main>
      <Footer14 />
    </div>
  );
}
