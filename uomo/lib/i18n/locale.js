export const DEFAULT_LOCALE = "es";
export const ENGLISH_LOCALE = "en";
export const LEGACY_SPANISH_PREFIX = "/es";
export const ENGLISH_PREFIX = "/en";
export const STATIC_PREFIXES = ["/_next", "/api", "/assets"];

export const LOCALE_CONFIG = {
  es: {
    code: "es",
    lang: "es-MX",
    ogLocale: "es_MX",
    prefix: "",
  },
  en: {
    code: "en",
    lang: "en-US",
    ogLocale: "en_US",
    prefix: ENGLISH_PREFIX,
  },
};

export function getLocaleConfig(locale = DEFAULT_LOCALE) {
  return LOCALE_CONFIG[locale] || LOCALE_CONFIG[DEFAULT_LOCALE];
}

export function getLocaleFromPath(pathname = "") {
  return pathname === ENGLISH_PREFIX || pathname.startsWith(`${ENGLISH_PREFIX}/`)
    ? ENGLISH_LOCALE
    : DEFAULT_LOCALE;
}

export function isLegacySpanishPath(pathname = "") {
  return (
    pathname === LEGACY_SPANISH_PREFIX ||
    pathname.startsWith(`${LEGACY_SPANISH_PREFIX}/`)
  );
}

export function hasFileExtension(pathname = "") {
  return /\.[a-z0-9]+$/i.test(pathname.split("?")[0]);
}

export function isInternalHref(href = "") {
  return href.startsWith("/") && !href.startsWith("//");
}

export function shouldBypassPath(pathname = "") {
  return (
    STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    pathname === "/favicon.ico" ||
    hasFileExtension(pathname)
  );
}

export function stripLocalePrefix(pathname = "") {
  if (!pathname) {
    return "/";
  }

  if (pathname === ENGLISH_PREFIX || pathname === LEGACY_SPANISH_PREFIX) {
    return "/";
  }

  return (
    pathname.replace(/^\/(?:en|es)(?=\/)/, "") || "/"
  );
}

export function addLocalePrefix(pathname = "/", locale = DEFAULT_LOCALE) {
  const normalizedPath = stripLocalePrefix(pathname || "/");

  if (locale === ENGLISH_LOCALE) {
    return normalizedPath === "/"
      ? ENGLISH_PREFIX
      : `${ENGLISH_PREFIX}${normalizedPath}`;
  }

  return normalizedPath;
}

export function localizeHref(href = "", locale = DEFAULT_LOCALE) {
  if (!isInternalHref(href)) {
    return href;
  }

  const [, rawPathname = "", suffix = ""] = href.match(/^([^?#]*)(.*)$/) || [];
  if (!rawPathname || shouldBypassPath(rawPathname)) {
    return href;
  }

  return `${addLocalePrefix(rawPathname, locale)}${suffix}`;
}
