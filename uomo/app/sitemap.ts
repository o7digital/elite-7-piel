import type { MetadataRoute } from "next";

const siteUrl = "https://elite7piel.com";

const routes = [
  "",
  "/en",
  "/shop",
  "/en/shop",
  "/about",
  "/en/about",
  "/contact",
  "/en/contact",
  "/faq",
  "/en/faq",
  "/aviso-de-privacidad",
  "/en/aviso-de-privacidad",
  "/politica-de-cookies",
  "/en/politica-de-cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.7,
  }));
}
