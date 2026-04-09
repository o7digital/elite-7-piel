import Footer1 from "@/components/footers/Footer1";

import Header1 from "@/components/headers/Header1";
import About from "@/components/otherPages/about/About";
import Services from "@/components/otherPages/about/Services";
import React from "react";

export const metadata = {
  title: "Quienes Somos | Elite 7 Piel",
  description:
    "Conoce Elite 7 Piel, nuestra historia, compromiso y enfoque en productos de belleza, cuidado capilar y bienestar.",
};
export default function AboutPage() {
  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <About />
        <Services />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer1 />
    </>
  );
}
