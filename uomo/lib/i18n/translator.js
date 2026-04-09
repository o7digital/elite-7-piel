import { englishTranslations } from "@/data/i18n/en";
import { spanishTranslations } from "@/data/i18n/es";
import { DEFAULT_LOCALE, ENGLISH_LOCALE } from "@/lib/i18n/locale";

export function normalizeText(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

export function getTranslationsForLocale(locale = DEFAULT_LOCALE) {
  return locale === ENGLISH_LOCALE ? englishTranslations : spanishTranslations;
}

export function buildTranslator(translations) {
  const exactEntries = Object.entries(translations.exact || {});
  const partialEntries = Object.entries(translations.partial || {}).sort(
    (left, right) => right[0].length - left[0].length
  );

  const translateNormalized = (value = "") => {
    const normalizedValue = normalizeText(value);

    if (!normalizedValue || translations.ignore?.includes(normalizedValue)) {
      return normalizedValue;
    }

    if (translations.exact?.[normalizedValue]) {
      return translations.exact[normalizedValue];
    }

    let translatedValue = normalizedValue;

    for (const [source, target] of partialEntries) {
      if (translatedValue.includes(source)) {
        translatedValue = translatedValue.split(source).join(target);
      }
    }

    return translatedValue;
  };

  const translateValue = (rawValue = "") => {
    const normalizedValue = normalizeText(rawValue);
    if (!normalizedValue) {
      return rawValue;
    }

    const translatedValue = translateNormalized(normalizedValue);
    if (!translatedValue || translatedValue === normalizedValue) {
      return rawValue;
    }

    return rawValue.replace(normalizedValue, translatedValue);
  };

  return {
    exactEntries,
    partialEntries,
    translateNormalized,
    translateValue,
  };
}
