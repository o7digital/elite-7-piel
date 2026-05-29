import type { MetadataRoute } from "next";
import { allBlogs } from "@/data/blogs";
import { getAllStoreProducts } from "@/lib/woocommerce";

const siteUrl = "https://elite7piel.com";

const routes = [
  "",
  "/shop",
  "/about",
  "/contact",
  "/faq",
  "/aviso-de-privacidad",
  "/politica-de-cookies",
];

function toSitemapEntry(
  route: string,
  options: {
    lastModified?: Date | string;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  } = {}
): MetadataRoute.Sitemap[number] {
  const path = route || "/";
  const englishPath = path === "/" ? "/en" : `/en${path}`;

  return {
    url: `${siteUrl}${route}`,
    lastModified: options.lastModified || new Date(),
    changeFrequency: options.changeFrequency || "monthly",
    priority: options.priority ?? 0.7,
    alternates: {
      languages: {
        "es-MX": `${siteUrl}${path === "/" ? "" : path}`,
        "en-US": `${siteUrl}${englishPath}`,
        "x-default": `${siteUrl}${path === "/" ? "" : path}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const products = await getAllStoreProducts({ perPage: 100 }).catch(() => []);

  const staticRoutes = routes.map((route) =>
    toSitemapEntry(route, {
      lastModified,
      changeFrequency: route === "" || route === "/shop" ? "weekly" : "monthly",
      priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.7,
    })
  );

  const productRoutes = products.map((product) =>
    toSitemapEntry(`/shop/product/${product.id}`, {
      lastModified: product.createdAt || lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    })
  );

  const blogRoutes = allBlogs.map((blog) =>
    toSitemapEntry(`/blog_single/${blog.id}`, {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.65,
    })
  );

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
