"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const TEXT_ATTRIBUTES = ["placeholder", "title", "aria-label", "alt"];
const SKIPPED_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG"]);
const LOCALIZED_PREFIX = "/es";
const STATIC_PREFIXES = ["/_next", "/api", "/assets"];

function isSpanishPath(pathname = "") {
  return pathname === LOCALIZED_PREFIX || pathname.startsWith(`${LOCALIZED_PREFIX}/`);
}

function normalizeText(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function hasFileExtension(pathname = "") {
  return /\.[a-z0-9]+$/i.test(pathname.split("?")[0]);
}

function isInternalHref(href = "") {
  return href.startsWith("/") && !href.startsWith("//");
}

function localizeHref(href = "") {
  if (!isInternalHref(href)) {
    return href;
  }

  if (
    href.startsWith(LOCALIZED_PREFIX) ||
    STATIC_PREFIXES.some((prefix) => href.startsWith(prefix)) ||
    href === "/favicon.ico" ||
    hasFileExtension(href)
  ) {
    return href;
  }

  return href === "/" ? LOCALIZED_PREFIX : `${LOCALIZED_PREFIX}${href}`;
}

function buildTranslator(translations) {
  const exactEntries = Object.entries(translations.exact || {});
  const partialEntries = Object.entries(translations.partial || {}).sort(
    (a, b) => b[0].length - a[0].length
  );

  const translateNormalized = (normalizedValue) => {
    if (!normalizedValue) {
      return normalizedValue;
    }

    if (translations.ignore?.includes(normalizedValue)) {
      return normalizedValue;
    }

    if (translations.exact?.[normalizedValue]) {
      return translations.exact[normalizedValue];
    }

    let translated = normalizedValue;
    for (const [source, target] of partialEntries) {
      if (translated.includes(source)) {
        translated = translated.split(source).join(target);
      }
    }

    return translated;
  };

  const translateValue = (rawValue) => {
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

  return { exactEntries, partialEntries, translateValue, translateNormalized };
}

function translateTextNodes(root, translator) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parentElement = node.parentElement;
      if (!parentElement || SKIPPED_TAGS.has(parentElement.tagName)) {
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
    if (SKIPPED_TAGS.has(element.tagName)) {
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

function rewriteAnchors(root) {
  root.querySelectorAll("a[href]").forEach((anchor) => {
    const rawHref = anchor.getAttribute("href");
    if (!rawHref) {
      return;
    }

    const localizedHref = localizeHref(rawHref);
    if (localizedHref !== rawHref) {
      anchor.setAttribute("href", localizedHref);
    }
  });
}

function translateMetadata(translator) {
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
}

export default function SpanishRuntime() {
  const pathname = usePathname();
  const [translations, setTranslations] = useState(null);
  const isSpanish = useMemo(() => isSpanishPath(pathname), [pathname]);

  useEffect(() => {
    let cancelled = false;

    if (!isSpanish) {
      setTranslations(null);
      document.documentElement.lang = "en";
      return undefined;
    }

    document.documentElement.lang = "es";

    import("@/data/i18n/es").then((module) => {
      if (!cancelled) {
        setTranslations(module.spanishTranslations);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isSpanish]);

  useEffect(() => {
    if (!isSpanish || !translations) {
      return undefined;
    }

    const translator = buildTranslator(translations);
    let rafId = 0;

    const runPass = () => {
      rafId = 0;
      translateTextNodes(document.body, translator);
      translateAttributes(document.body, translator);
      rewriteAnchors(document.body);
      translateMetadata(translator);
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

      const localizedHref = localizeHref(rawHref);
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
  }, [isSpanish, pathname, translations]);

  return null;
}
