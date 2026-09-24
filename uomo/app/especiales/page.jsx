import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Shop1 from "@/components/shoplist/Shop1";
import { getAllStoreProducts, getStoreCategories } from "@/lib/woocommerce";

export const metadata = {
  title: "Especiales | ELITE 7 PIEL",
  description:
    "Descubre productos especiales, herramientas y equipos seleccionados por ELITE 7 PIEL.",
  alternates: { canonical: "/especiales" },
};

export default async function SpecialsPage() {
  const [products, categories] = await Promise.all([
    getAllStoreProducts({ perPage: 100, sourceKey: "store2" }).catch(() => []),
    getStoreCategories({ perPage: 100, sourceKey: "store2" }).catch(() => []),
  ]);

  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <Shop1 products={products} categories={categories} title="Especiales" />
      </main>
      <div className="mb-5 pb-xl-5" />
      <Footer1 />
    </>
  );
}
