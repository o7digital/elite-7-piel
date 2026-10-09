import Footer14 from "@/components/footers/Footer14";

import Header14 from "@/components/headers/Header14";

import AllProductsGrid from "@/components/homes/home-15/AllProductsGrid";
import Hero from "@/components/homes/home-15/Hero";
import Lookbook from "@/components/homes/home-15/Lookbook";
import { demoHomeMetadata } from "@/lib/seo/pageMetadata";
import { getCatalogProducts } from "@/lib/woocommerce";
import React, { Suspense } from "react";
import CatalogLoading from "@/components/common/CatalogLoading";

export const metadata = demoHomeMetadata;
async function Catalog() {
  const products = await getCatalogProducts({ perPage: 100, sourceKey: "primary" }).catch(() => []);

  return <AllProductsGrid products={products} />;
}

export default function HomePage15() {
  return (
    <>
      <div className="theme-15">
        <Header14 />
        <main>
          <Hero />
          <Suspense fallback={<CatalogLoading />}>
            <Catalog />
          </Suspense>
          <div className="mb-3 mb-xl-5 pb-3 pt-1 pb-xl-5"></div>
          <Lookbook />
        </main>
        <Footer14 />
      </div>
    </>
  );
}
