import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Shop1 from "@/components/shoplist/Shop1";
import { getAllStoreProducts, getStoreCategories } from "@/lib/woocommerce";

export const metadata = {
  title: "Shop || ELITE 7 PIEL",
  description: "Tienda ELITE 7 PIEL",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getAllStoreProducts({ perPage: 100 }).catch(() => []),
    getStoreCategories({ perPage: 100 }).catch(() => []),
  ]);

  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <Shop1 products={products} categories={categories} />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footer1 />
    </>
  );
}
