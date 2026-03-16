import Footer14 from "@/components/footers/Footer14";

import Header14 from "@/components/headers/Header14";

import AllProductsGrid from "@/components/homes/home-15/AllProductsGrid";
import Hero from "@/components/homes/home-15/Hero";
import Lookbook from "@/components/homes/home-15/Lookbook";
import { getAllStoreProducts } from "@/lib/woocommerce";
import React from "react";

export const metadata = {
  title: "Home 15 || Uomo eCommerce React Nextjs Template",
  description: "Uomo eCommerce React Nextjs Template",
};
export default async function HomePage15() {
  const products = await getAllStoreProducts({ perPage: 100 }).catch(() => []);

  return (
    <>
      <div className="theme-15">
        <Header14 />
        <main>
          <Hero />
          <AllProductsGrid products={products} />
          <div className="mb-3 mb-xl-5 pb-3 pt-1 pb-xl-5"></div>
          <Lookbook />
        </main>
        <Footer14 />
      </div>
    </>
  );
}
