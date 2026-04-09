import Footer1 from "@/components/footers/Footer1";

import Header1 from "@/components/headers/Header1";

import Banner5 from "@/components/shoplist/Banner5";

import Shop7 from "@/components/shoplist/Shop7";
import { shopVariantMetadata } from "@/lib/seo/pageMetadata";
import React from "react";

export const metadata = shopVariantMetadata;
export default function ShopPage7() {
  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <Banner5 />
        <div className="mb-4 pb-lg-3"></div>
        <Shop7 />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer1 />
    </>
  );
}
