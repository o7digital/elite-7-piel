import {
  addLocalePrefix,
  getLocaleConfig,
  localizeHref,
  shouldBypassPath,
  stripLocalePrefix,
} from "@/lib/i18n/locale";
import {
  buildTranslator,
  getTranslationsForLocale,
  normalizeText,
} from "@/lib/i18n/translator";

function decodeHtmlEntities(value = "") {
  const numericDecoded = value.replace(
    /&#(?:x([0-9a-f]+)|(\d+));/gi,
    (_, hex, dec) => String.fromCodePoint(Number.parseInt(hex || dec, hex ? 16 : 10))
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

function translateRawValue(rawValue = "", translator) {
  const decodedValue = decodeHtmlEntities(rawValue);
  const normalizedValue = normalizeText(decodedValue);
  if (!normalizedValue) {
    return rawValue;
  }

  const translatedValue = translator.translateNormalized(normalizedValue);
  if (!translatedValue || translatedValue === normalizedValue) {
    return rawValue;
  }

  const replacedValue = decodedValue.replace(normalizedValue, translatedValue);

  return escapeHtmlEntities(replacedValue);
}

function rewriteLocalizedAttributes(html = "", locale) {
  return ["href", "action"].reduce((value, attributeName) => {
    const attributePattern = new RegExp(
      `${attributeName}=(["'])(\\/[^"'\\s>]*)\\1`,
      "g"
    );

    return value.replace(attributePattern, (match, quote, rawHref) => {
      const localizedHref = localizeHref(rawHref, locale);
      if (localizedHref === rawHref) {
        return match;
      }

      return `${attributeName}=${quote}${localizedHref}${quote}`;
    });
  }, html);
}

function rewriteCanonicalTags(html = "", { origin, pathname, locale }) {
  const basePath = stripLocalePrefix(pathname || "/");
  const canonicalUrl = new URL(addLocalePrefix(basePath, locale), origin).toString();
  const spanishUrl = new URL(addLocalePrefix(basePath, "es"), origin).toString();
  const englishUrl = new URL(addLocalePrefix(basePath, "en"), origin).toString();
  const localeConfig = getLocaleConfig(locale);
  const seoTags = [
    `<link rel="canonical" href="${canonicalUrl}">`,
    `<link rel="alternate" hrefLang="es-MX" href="${spanishUrl}">`,
    `<link rel="alternate" hrefLang="en-US" href="${englishUrl}">`,
    `<link rel="alternate" hrefLang="x-default" href="${spanishUrl}">`,
    `<meta property="og:locale" content="${localeConfig.ogLocale}">`,
  ].join("");

  const cleanedHtml = html
    .replace(/<link rel="canonical"[^>]*>/gi, "")
    .replace(/<link rel="alternate"[^>]*hrefLang="[^"]+"[^>]*>/gi, "")
    .replace(/<meta property="og:locale"[^>]*>/gi, "");

  if (!cleanedHtml.includes("</head>")) {
    return cleanedHtml;
  }

  return cleanedHtml.replace("</head>", `${seoTags}</head>`);
}

function updateDocumentLanguage(html = "", locale) {
  const localeConfig = getLocaleConfig(locale);

  if (/<html[^>]*lang=/i.test(html)) {
    return html.replace(
      /(<html[^>]*\slang=(["']))[^"']*(\2)/i,
      `$1${localeConfig.lang}$3`
    );
  }

  return html.replace(/<html/i, `<html lang="${localeConfig.lang}"`);
}

function translateTextNodes(html = "", translator) {
  return html.replace(/>([^<>]+)</g, (match, rawText) => {
    const translatedText = translateRawValue(rawText, translator);
    if (translatedText === rawText) {
      return match;
    }

    return `>${translatedText}<`;
  });
}

function translateTextAttributes(html = "", translator) {
  const textAttributes = ["placeholder", "title", "aria-label", "alt"];

  return textAttributes.reduce((value, attributeName) => {
    const attributePattern = new RegExp(
      `(${attributeName}=(["']))([^"']*)(\\2)`,
      "gi"
    );

    return value.replace(
      attributePattern,
      (match, prefix, quote, rawValue, suffix) => {
        const translatedValue = translateRawValue(rawValue, translator);
        if (translatedValue === rawValue) {
          return match;
        }

        return `${prefix}${translatedValue}${suffix}`;
      }
    );
  }, html);
}

function translateMetaContent(html = "", translator) {
  const metaPattern =
    /(<meta\b[^>]*(?:name|property)=["'](?:description|og:title|og:description|twitter:title|twitter:description)["'][^>]*\bcontent=(["']))([^"']*)(\2[^>]*>)/gi;

  return html.replace(metaPattern, (match, prefix, quote, rawValue, suffix) => {
    const translatedValue = translateRawValue(rawValue, translator);
    if (translatedValue === rawValue) {
      return match;
    }

    return `${prefix}${translatedValue}${suffix}`;
  });
}

function translateButtonValues(html = "", translator) {
  const inputPattern =
    /(<input\b[^>]*\btype=(["'])(?:submit|button)\2[^>]*\bvalue=(["']))([^"']*)(\3[^>]*>)/gi;

  return html.replace(
    inputPattern,
    (match, prefix, typeQuote, valueQuote, rawValue, suffix) => {
      const translatedValue = translateRawValue(rawValue, translator);
      if (translatedValue === rawValue) {
        return match;
      }

      return `${prefix}${translatedValue}${suffix}`;
    }
  );
}

function translateJsonLdScripts(html = "", translator, locale) {
  const localeConfig = getLocaleConfig(locale);

  return html.replace(
    /(<script\b[^>]*type=(["'])application\/ld\+json\2[^>]*>)([\s\S]*?)(<\/script>)/gi,
    (match, openTag, quote, jsonPayload, closeTag) => {
      try {
        const parsedPayload = JSON.parse(jsonPayload);

        const translateJsonValue = (value, key = "") => {
          if (Array.isArray(value)) {
            if (key === "availableLanguage") {
              return [localeConfig.lang];
            }

            return value.map((item) => translateJsonValue(item, key));
          }

          if (value && typeof value === "object") {
            return Object.fromEntries(
              Object.entries(value).map(([entryKey, entryValue]) => {
                if (entryKey === "inLanguage") {
                  return [entryKey, localeConfig.lang];
                }

                return [entryKey, translateJsonValue(entryValue, entryKey)];
              })
            );
          }

          if (typeof value === "string") {
            if (key === "url" || key === "@id") {
              try {
                const url = new URL(value, "https://elite7piel.com");
                const localizedPathname = shouldBypassPath(url.pathname)
                  ? url.pathname
                  : addLocalePrefix(url.pathname, locale);

                url.pathname = localizedPathname;
                return value.startsWith("http") ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
              } catch {
                return value;
              }
            }

            return translator.translateValue(value);
          }

          return value;
        };

        return `${openTag}${JSON.stringify(
          translateJsonValue(parsedPayload)
        )}${closeTag}`;
      } catch {
        return match;
      }
    }
  );
}

function translateMarkupChunk(html = "", locale) {
  const translator = buildTranslator(getTranslationsForLocale(locale));
  let translatedChunk = html;

  translatedChunk = translateMetaContent(translatedChunk, translator);
  translatedChunk = translateTextAttributes(translatedChunk, translator);
  translatedChunk = translateButtonValues(translatedChunk, translator);
  translatedChunk = translateTextNodes(translatedChunk, translator);
  translatedChunk = rewriteLocalizedAttributes(translatedChunk, locale);
  translatedChunk = translateJsonLdScripts(translatedChunk, translator, locale);

  return translatedChunk;
}

export function translateHtmlDocument(
  html = "",
  { origin, pathname, locale }
) {
  const htmlParts = html.split(
    /(<(?:script|style)\b[\s\S]*?<\/(?:script|style)>)/gi
  );
  const translatedHtml = htmlParts
    .map((part) => {
      if (/^<style\b/i.test(part)) {
        return part;
      }

      if (
        /^<script\b/i.test(part) &&
        !/type=(["'])application\/ld\+json\1/i.test(part)
      ) {
        return part;
      }

      return translateMarkupChunk(part, locale);
    })
    .join("");

  const localizedHtml = updateDocumentLanguage(translatedHtml, locale);

  return rewriteCanonicalTags(localizedHtml, { origin, pathname, locale });
}
