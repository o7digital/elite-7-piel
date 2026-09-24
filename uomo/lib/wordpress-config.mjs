const DEFAULT_WORDPRESS_URL = "https://wp-elite7piel.o7digitalgroup.com";
const DEFAULT_SECONDARY_WORDPRESS_URL =
  "https://wp-elite7piel-2.o7digitalgroup.com";

export const WORDPRESS_URL = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL || DEFAULT_WORDPRESS_URL
).replace(/\/$/, "");

export const SECONDARY_WORDPRESS_URL = (
  process.env.NEXT_PUBLIC_SECONDARY_WORDPRESS_URL ||
  DEFAULT_SECONDARY_WORDPRESS_URL
).replace(/\/$/, "");

export const WORDPRESS_PRODUCT_URLS = [
  ...new Set([WORDPRESS_URL, SECONDARY_WORDPRESS_URL]),
];

export function getWordPressUrl(pathname = "") {
  return new URL(pathname.replace(/^\//, ""), `${WORDPRESS_URL}/`).toString();
}
