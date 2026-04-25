import JsonLd from "@/components/common/JsonLd";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import SingleProduct12 from "@/components/singleProduct/SingleProduct12";
import { getStoreProduct } from "@/lib/woocommerce";
import { notFound } from "next/navigation";

const siteUrl = "https://elite7piel.com";

export async function generateMetadata(props) {
  const params = await props.params;
  let product = null;

  try {
    product = await getStoreProduct(params.id);
  } catch (error) {
    console.error("[shop/product] Failed to load product metadata", {
      productId: params.id,
      error: error?.message || String(error),
    });
  }

  if (!product) {
    return {
      title: "Producto no encontrado | ELITE 7 PIEL",
      description: "El producto solicitado no está disponible en ELITE 7 PIEL.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${product.title} | ELITE 7 PIEL`;
  const description =
    product.shortDescriptionText ||
    product.descriptionText ||
    `Consulta ${product.title} en ELITE 7 PIEL.`;
  const canonicalPath = `/shop/product/${product.id}`;
  const image = product.images?.[0]?.src || product.imgSrc;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "product",
      images: image ? [{ url: image, alt: product.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ShopProductPage(props) {
  const params = await props.params;
  const productId = params.id;
  let product = null;

  try {
    product = await getStoreProduct(productId);
  } catch (error) {
    console.error("[shop/product] Failed to load product", {
      productId,
      error: error?.message || String(error),
    });
    notFound();
  }

  if (!product) {
    notFound();
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images?.map((image) => image.src).filter(Boolean),
    description:
      product.shortDescriptionText ||
      product.descriptionText ||
      `Producto disponible en ELITE 7 PIEL`,
    sku: product.sku && product.sku !== "N/A" ? product.sku : undefined,
    category: product.categories?.join(", ") || product.category,
    brand: {
      "@type": "Brand",
      name: "ELITE 7 PIEL",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/shop/product/${product.id}`,
      priceCurrency: "MXN",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating || 5,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <Header1 />
      <main className="page-wrapper">
        <div className="mb-md-1 pb-md-3"></div>
        <SingleProduct12 product={product} />
      </main>
      <Footer1 />
    </>
  );
}
