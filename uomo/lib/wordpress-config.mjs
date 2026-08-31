const DEFAULT_WORDPRESS_URL = "https://wp-elite7piel.o7digitalgroup.com";

export const WORDPRESS_URL = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL || DEFAULT_WORDPRESS_URL
).replace(/\/$/, "");

export function getWordPressUrl(pathname = "") {
  return new URL(pathname.replace(/^\//, ""), `${WORDPRESS_URL}/`).toString();
}
