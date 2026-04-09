import Footer6 from "@/components/footers/Footer6";

import Header6 from "@/components/headers/Header6";
import CategoryMassonry from "@/components/homes/home-6/CategoryMassonry";
import Hero from "@/components/homes/home-6/Hero";
import Instagram from "@/components/homes/home-6/Instagram";
import { demoHomeMetadata } from "@/lib/seo/pageMetadata";
import React from "react";

export const metadata = demoHomeMetadata;
export default function HomePage6() {
  return (
    <>
      <Header6 />
      <main style={{ paddingTop: "76px" }}>
        <Hero />
        <div className="mb-4 mb-xl-5 pt-1 pb-5"></div>
        <CategoryMassonry />
        <Instagram />
        <div className="mb-4 mb-xl-5 pt-xl-1 pb-5"></div>
      </main>
      <Footer6 />
    </>
  );
}
