import { Suspense } from "react";
import CatalogLoading from "@/components/common/CatalogLoading";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Shop1 from "@/components/shoplist/Shop1";
import { getCatalogProducts, getStoreCategories } from "@/lib/woocommerce";

export const metadata = {
  title: "Especiales | ELITE 7 PIEL",
  description:
    "Descubre productos especiales, herramientas y equipos seleccionados por ELITE 7 PIEL.",
  alternates: { canonical: "/especiales" },
};

async function Catalog() {
  const [products, categories] = await Promise.all([
    getCatalogProducts({ perPage: 100, sourceKey: "store2" }).catch(() => []),
    getStoreCategories({ perPage: 100, sourceKey: "store2" }).catch(() => []),
  ]);

  return <Shop1 products={products} categories={categories} title="Especiales" />;
}

export default function SpecialsPage() {
  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <Suspense fallback={<CatalogLoading />}>
          <Catalog />
        </Suspense>
      </main>
      <div className="mb-5 pb-xl-5" />
      <Footer1 />
    </>
  );
}
