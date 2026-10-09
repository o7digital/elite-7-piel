import { Suspense } from "react";
import CatalogLoading from "@/components/common/CatalogLoading";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import SeoKeywordContent from "@/components/common/SeoKeywordContent";
import Shop1 from "@/components/shoplist/Shop1";
import { shopSeoMetadata } from "@/data/seoKeywordContent";
import { getCatalogProducts, getStoreCategories } from "@/lib/woocommerce";

export const metadata = shopSeoMetadata;

async function Catalog() {
  const [products, categories] = await Promise.all([
    getCatalogProducts({ perPage: 100, sourceKey: "primary" }).catch(() => []),
    getStoreCategories({ perPage: 100, sourceKey: "primary" }).catch(() => []),
  ]);

  return <Shop1 products={products} categories={categories} />;
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
