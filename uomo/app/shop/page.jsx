import { Suspense } from "react";
import CatalogLoading from "@/components/common/CatalogLoading";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import SeoKeywordContent from "@/components/common/SeoKeywordContent";
import Shop1 from "@/components/shoplist/Shop1";
import { shopSeoMetadata } from "@/data/seoKeywordContent";
import { getCatalogProducts } from "@/lib/woocommerce";

export const metadata = shopSeoMetadata;

export const revalidate = 300;

async function Catalog() {
  const products = await getCatalogProducts({ sourceKey: "primary" });

  return <Shop1 products={products} />;
}

export default function ShopPage() {
  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <Suspense fallback={<CatalogLoading />}>
          <Catalog />
        </Suspense>
        <SeoKeywordContent />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer1 />
    </>
  );
}
