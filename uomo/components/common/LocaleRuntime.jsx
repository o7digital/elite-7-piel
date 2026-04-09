"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getLocaleConfig,
  getLocaleFromPath,
  localizeHref,
} from "@/lib/i18n/locale";
import {
  buildTranslator,
  getTranslationsForLocale,
  normalizeText,
} from "@/lib/i18n/translator";

const TEXT_ATTRIBUTES = ["placeholder", "title", "aria-label", "alt"];
const SKIPPED_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG"]);
const SKIP_TRANSLATION_SELECTOR = "[data-no-runtime-translate]";

function shouldSkipElement(element) {
  return !!element?.closest(SKIP_TRANSLATION_SELECTOR);
}

function translateTextNodes(root, translator) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parentElement = node.parentElement;
      if (
        !parentElement ||
        SKIPPED_TAGS.has(parentElement.tagName) ||
        shouldSkipElement(parentElement)
      ) {
        return NodeFilter.FILTER_REJECT;
      }

      if (!normalizeText(node.nodeValue || "")) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node = walker.nextNode();
  while (node) {
    const translatedValue = translator.translateValue(node.nodeValue || "");
    if (translatedValue !== node.nodeValue) {
      node.nodeValue = translatedValue;
    }
    node = walker.nextNode();
  }
}

function translateAttributes(root, translator) {
  root.querySelectorAll("*").forEach((element) => {
    if (SKIPPED_TAGS.has(element.tagName) || shouldSkipElement(element)) {
      return;
    }

    TEXT_ATTRIBUTES.forEach((attributeName) => {
      const currentValue = element.getAttribute(attributeName);
      if (!currentValue) {
        return;
      }

      const translatedValue = translator.translateValue(currentValue);
      if (translatedValue !== currentValue) {
        element.setAttribute(attributeName, translatedValue);
      }
    });

    if (
      element instanceof HTMLInputElement &&
      ["submit", "button"].includes(element.type)
    ) {
      const translatedValue = translator.translateValue(element.value);
      if (translatedValue !== element.value) {
        element.value = translatedValue;
        element.setAttribute("value", translatedValue);
      }
    }
  });
}

function rewriteAnchors(root, locale) {
  root.querySelectorAll("a[href]").forEach((anchor) => {
    const rawHref = anchor.getAttribute("href");
    if (!rawHref) {
      return;
    }

    const localizedHref = localizeHref(rawHref, locale);
    if (localizedHref !== rawHref) {
      anchor.setAttribute("href", localizedHref);
    }
  });

  root.querySelectorAll("form[action]").forEach((form) => {
    const rawAction = form.getAttribute("action");
    if (!rawAction) {
      return;
    }

    const localizedAction = localizeHref(rawAction, locale);
    if (localizedAction !== rawAction) {
      form.setAttribute("action", localizedAction);
    }
  });
}

function translateMetadata(translator, locale) {
  const localeConfig = getLocaleConfig(locale);
  document.documentElement.lang = localeConfig.lang;

  if (document.title) {
    document.title = translator.translateValue(document.title);
  }

  const description = document.querySelector('meta[name="description"]');
  if (description?.content) {
    description.setAttribute(
      "content",
      translator.translateValue(description.content)
    );
  }

  const openGraphLocale = document.querySelector('meta[property="og:locale"]');
  if (openGraphLocale) {
    openGraphLocale.setAttribute("content", localeConfig.ogLocale);
  }
}

export default function LocaleRuntime() {
  const pathname = usePathname();
  const locale = useMemo(() => getLocaleFromPath(pathname), [pathname]);
  const [translations, setTranslations] = useState(() =>
    getTranslationsForLocale(locale)
  );

  useEffect(() => {
    setTranslations(getTranslationsForLocale(locale));
  }, [locale]);

  useEffect(() => {
    if (!translations) {
      return undefined;
    }

    const translator = buildTranslator(translations);
    let rafId = 0;

    const runPass = () => {
      rafId = 0;
      translateTextNodes(document.body, translator);
      translateAttributes(document.body, translator);
      rewriteAnchors(document.body, locale);
      translateMetadata(translator, locale);
    };

    const schedulePass = () => {
      if (rafId) {
        return;
      }

      rafId = window.requestAnimationFrame(runPass);
    };

    const handleDocumentClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest("a[href]");
      if (!anchor || anchor.target === "_blank") {
        return;
      }

      const rawHref = anchor.getAttribute("href");
      if (!rawHref || rawHref.startsWith("#")) {
        return;
      }

      const localizedHref = localizeHref(rawHref, locale);
      if (localizedHref === rawHref) {
        return;
      }

      event.preventDefault();
      window.location.assign(localizedHref);
    };

    const observer = new MutationObserver(schedulePass);

    runPass();
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      observer.disconnect();
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [locale, pathname, translations]);

  return null;
}
