import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import SingleProduct12 from "@/components/singleProduct/SingleProduct12";
import { getStoreProduct } from "@/lib/woocommerce";
import { notFound } from "next/navigation";

export default async function ShopProductPage(props) {
  const params = await props.params;
  const productId = params.id;
  const product = await getStoreProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <div className="mb-md-1 pb-md-3"></div>
        <SingleProduct12 product={product} />
      </main>
      <Footer1 />
    </>
  );
}
