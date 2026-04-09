import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ELITE 7 PIEL",
    short_name: "ELITE 7 PIEL",
    description:
      "Tienda online de cuidado facial, tecnologia estetica y tratamiento capilar profesional.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "es-MX",
    icons: [
      {
        src: "/assets/images/favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/assets/images/favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
