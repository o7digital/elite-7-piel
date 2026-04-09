import Footer22 from "@/components/footers/Footer22";

import Header8 from "@/components/headers/Header8";
import Banner from "@/components/homes/home-22/Banner";
import Hero from "@/components/homes/home-22/Hero";
import OurStory from "@/components/homes/home-22/OurStory";
import SingleProduct from "@/components/homes/home-22/SingleProduct";
import { demoHomeMetadata } from "@/lib/seo/pageMetadata";
import React from "react";

export const metadata = demoHomeMetadata;
export default function HomePage22() {
  return (
    <>
      <div className="theme-23">
        <Header8 />
        <main>
          <Hero />
          <Banner />
          <SingleProduct />
          <OurStory />
        </main>
        <Footer22 />
      </div>
    </>
  );
}
