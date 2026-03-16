import Footer14 from "@/components/footers/Footer14";
import Header1 from "@/components/headers/Header1";
import Contact from "@/components/otherPages/Contact/Contact";
import React from "react";

export const metadata = {
  title: "Contacto || ELITE 7 PIEL",
  description: "Contacto ELITE 7 PIEL",
};
export default function ContactPage() {
  return (
    <>
      <Header1 />
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
    </>
  );
}
