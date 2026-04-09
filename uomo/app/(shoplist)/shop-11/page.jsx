import Footer1 from "@/components/footers/Footer1";

import Header1 from "@/components/headers/Header1";
import Shop11 from "@/components/shoplist/Shop11";
import { shopVariantMetadata } from "@/lib/seo/pageMetadata";
import React from "react";

export const metadata = shopVariantMetadata;
export default function ShopPage11() {
  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <Shop11 />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer1 />
    </>
  );
}
