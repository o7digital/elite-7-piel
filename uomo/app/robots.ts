import type { MetadataRoute } from "next";

const siteUrl = "https://elite7piel.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/account_",
          "/shop_cart",
          "/shop_checkout",
          "/shop_order_complete",
          "/shop_order_tracking",
          "/login_register",
          "/reset_password",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
