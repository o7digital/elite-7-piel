import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import RelatedSlider from "@/components/singleProduct/RelatedSlider";
import SingleProduct12 from "@/components/singleProduct/SingleProduct12";
import { getRelatedStoreProducts, getStoreProduct } from "@/lib/woocommerce";
import { notFound } from "next/navigation";
import React from "react";

export default async function ProductDetailsPage1(props) {
  const params = await props.params;
  const productId = params.id;
  const product = await getStoreProduct(productId);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedStoreProducts(product, {
    perPage: 8,
  }).catch(() => []);

  return (
    <>
      <Header1 />
      <main className="page-wrapper">
        <div className="mb-md-1 pb-md-3"></div>
        <SingleProduct12 product={product} />
        <RelatedSlider products={relatedProducts} />
      </main>
      <Footer1 />
    </>
  );
}
