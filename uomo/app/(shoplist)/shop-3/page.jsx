import Footer1 from "@/components/footers/Footer1";

import Header1 from "@/components/headers/Header1";
import Shop3 from "@/components/shoplist/Shop3";
import { shopVariantMetadata } from "@/lib/seo/pageMetadata";

export const metadata = shopVariantMetadata;
export default function ShopPage3() {
  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <Shop3 />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer1 />
    </>
  );
}
