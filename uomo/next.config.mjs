import path from "node:path";
import { fileURLToPath } from "node:url";
import { WORDPRESS_PRODUCT_URLS } from "./lib/wordpress-config.mjs";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: WORDPRESS_PRODUCT_URLS.map((wordpressUrl) => ({
      protocol: new URL(wordpressUrl).protocol.replace(":", ""),
      hostname: new URL(wordpressUrl).hostname,
    })),
  },
  sassOptions: {
    quietDeps: true, // This will silence deprecation warnings
    silenceDeprecations: [
      "import",
      "global-builtin",
      "color-functions",
      "slash-div",
      "mixed-decls",
      "abs-percent",
      "function-units",
      "strict-unary",
      "legacy-js-api",
    ],
  },
};

export default nextConfig;
