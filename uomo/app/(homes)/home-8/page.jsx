import Footer7 from "@/components/footers/Footer7";
import Header8 from "@/components/headers/Header8";
import Hero from "@/components/homes/home-8/Hero";
import { demoHomeMetadata } from "@/lib/seo/pageMetadata";
import React from "react";

export const metadata = demoHomeMetadata;
export default function HomePage8() {
  return (
    <>
      <Header8 />
      <main>
        <Hero />
      </main>
      <Footer7 />
    </>
  );
}
