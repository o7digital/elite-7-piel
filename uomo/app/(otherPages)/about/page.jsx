import Footer14 from "@/components/footers/Footer14";

import Header14 from "@/components/headers/Header14";
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
    <div className="theme-15">
      <Header14 />
      <main className="page-wrapper">
        <div className="mb-4 pb-4"></div>
        <About />
        <Services />
      </main>
      <Footer14 />
    </div>
  );
}
