import path from "node:path";
import { fileURLToPath } from "node:url";
import { WORDPRESS_URL } from "./lib/wordpress-config.mjs";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: new URL(WORDPRESS_URL).protocol.replace(":", ""),
        hostname: new URL(WORDPRESS_URL).hostname,
      },
    ],
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
