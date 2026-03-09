import { spanishTranslations } from "@/data/i18n/es";

export const LOCALIZED_PREFIX = "/es";
const STATIC_PREFIXES = ["/_next", "/api", "/assets"];

const exactReplacements = Object.entries(spanishTranslations.exact || {})
  .filter(([source, target]) => source && target && source !== target)
  .sort((left, right) => right[0].length - left[0].length);

const partialReplacements = Object.entries(spanishTranslations.partial || {})
  .filter(([source, target]) => source && target && source !== target)
  .sort((left, right) => right[0].length - left[0].length);

function hasFileExtension(pathname = "") {
  return /\.[a-z0-9]+$/i.test(pathname.split("?")[0]);
}

function isInternalHref(href = "") {
  return href.startsWith("/") && !href.startsWith("//");
}

export function isSpanishPath(pathname = "") {
  return pathname === LOCALIZED_PREFIX || pathname.startsWith(`${LOCALIZED_PREFIX}/`);
}

export function stripSpanishPrefix(pathname = "") {
  if (pathname === LOCALIZED_PREFIX) {
    return "/";
  }

  return pathname.replace(/^\/es/, "") || "/";
}

export function localizeHref(href = "") {
  if (!isInternalHref(href)) {
    return href;
  }

  if (
    STATIC_PREFIXES.some((prefix) => href.startsWith(prefix)) ||
    href === "/favicon.ico" ||
    hasFileExtension(href)
  ) {
    return href;
  }

  return stripSpanishPrefix(href);
}

function normalizeText(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value = "") {
  const numericDecoded = value.replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_, hex, dec) =>
    String.fromCodePoint(Number.parseInt(hex || dec, hex ? 16 : 10))
  );

  return numericDecoded
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function escapeHtmlEntities(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function translateNormalized(value = "") {
  if (!value || spanishTranslations.ignore?.includes(value)) {
    return value;
  }

  if (spanishTranslations.exact?.[value]) {
    return spanishTranslations.exact[value];
  }

  let translated = value;

  for (const [source, target] of partialReplacements) {
    translated = translated.split(source).join(target);
  }

  return translated;
}

function translateValue(rawValue = "") {
  const decodedValue = decodeHtmlEntities(rawValue);
  const normalizedValue = normalizeText(decodedValue);
  if (!normalizedValue) {
    return rawValue;
  }

  const translatedValue = translateNormalized(normalizedValue);
  if (!translatedValue || translatedValue === normalizedValue) {
    return rawValue;
  }

  const replacedValue = decodedValue.replace(normalizedValue, translatedValue);

  return escapeHtmlEntities(replacedValue);
}

function rewriteLocalizedAttributes(html = "") {
  return ["href", "action"].reduce((value, attributeName) => {
    const attributePattern = new RegExp(
      `${attributeName}=(["'])(\\/[^"'\\s>]*)\\1`,
      "g"
    );

    return value.replace(attributePattern, (match, quote, rawHref) => {
      const localizedHref = localizeHref(rawHref);
      if (localizedHref === rawHref) {
        return match;
      }

      return `${attributeName}=${quote}${localizedHref}${quote}`;
    });
  }, html);
}

function injectSeoTags(html = "", { origin, pathname }) {
  const canonicalUrl = new URL(pathname || "/", origin).toString();
  const seoTags = [
    `<link rel="canonical" href="${canonicalUrl}">`,
    `<meta property="og:locale" content="es_ES">`,
  ].join("");

  if (!html.includes("</head>")) {
    return html;
  }

  return html.replace("</head>", `${seoTags}</head>`);
}

function updateDocumentLanguage(html = "") {
  if (/<html[^>]*lang=/i.test(html)) {
    return html.replace(/(<html[^>]*\slang=(["']))[^"']*(\2)/i, "$1es$3");
  }

  return html.replace(/<html/i, '<html lang="es"');
}

function translateTextNodes(html = "") {
  return html.replace(/>([^<>]+)</g, (match, rawText) => {
    const translatedText = translateValue(rawText);
    if (translatedText === rawText) {
      return match;
    }

    return `>${translatedText}<`;
  });
}

function translateTextAttributes(html = "") {
  const textAttributes = ["placeholder", "title", "aria-label", "alt"];

  return textAttributes.reduce((value, attributeName) => {
    const attributePattern = new RegExp(
      `(${attributeName}=(["']))([^"']*)(\\2)`,
      "gi"
    );

    return value.replace(attributePattern, (match, prefix, quote, rawValue, suffix) => {
      const translatedValue = translateValue(rawValue);
      if (translatedValue === rawValue) {
        return match;
      }

      return `${prefix}${translatedValue}${suffix}`;
    });
  }, html);
}

function translateMetaContent(html = "") {
  const metaPattern =
    /(<meta\b[^>]*(?:name|property)=["'](?:description|og:title|og:description|twitter:title|twitter:description)["'][^>]*\bcontent=(["']))([^"']*)(\2[^>]*>)/gi;

  return html.replace(metaPattern, (match, prefix, quote, rawValue, suffix) => {
    const translatedValue = translateValue(rawValue);
    if (translatedValue === rawValue) {
      return match;
    }

    return `${prefix}${translatedValue}${suffix}`;
  });
}

function translateButtonValues(html = "") {
  const inputPattern =
    /(<input\b[^>]*\btype=(["'])(?:submit|button)\2[^>]*\bvalue=(["']))([^"']*)(\3[^>]*>)/gi;

  return html.replace(inputPattern, (match, prefix, typeQuote, valueQuote, rawValue, suffix) => {
    const translatedValue = translateValue(rawValue);
    if (translatedValue === rawValue) {
      return match;
    }

    return `${prefix}${translatedValue}${suffix}`;
  });
}

function translateMarkupChunk(html = "") {
  let translatedChunk = html;

  translatedChunk = exactReplacements.reduce((value, [source, target]) => {
    const titlePattern = new RegExp(
      `(<title[^>]*>)${source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(</title>)`,
      "g"
    );

    return value.replace(titlePattern, `$1${target}$2`);
  }, translatedChunk);
  translatedChunk = translateMetaContent(translatedChunk);
  translatedChunk = translateTextAttributes(translatedChunk);
  translatedChunk = translateButtonValues(translatedChunk);
  translatedChunk = translateTextNodes(translatedChunk);
  translatedChunk = rewriteLocalizedAttributes(translatedChunk);

  return translatedChunk;
}

export function translateHtmlDocument(html = "", { origin, pathname }) {
  const htmlParts = html.split(/(<(?:script|style)\b[\s\S]*?<\/(?:script|style)>)/gi);
  const translatedHtml = htmlParts
    .map((part) =>
      /^<(?:script|style)\b/i.test(part) ? part : translateMarkupChunk(part)
    )
    .join("");
  const withSpanishLanguage = updateDocumentLanguage(translatedHtml);

  return injectSeoTags(withSpanishLanguage, { origin, pathname });
}
