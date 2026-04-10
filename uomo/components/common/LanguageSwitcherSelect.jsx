"use client";

import { usePathname, useRouter } from "next/navigation";
import { addLocalePrefix, getLocaleFromPath } from "@/lib/i18n/locale";

const LANGUAGE_LABELS = {
  es: [
    { value: "es", label: "México | Español" },
    { value: "en", label: "Estados Unidos | Inglés" },
  ],
  en: [
    { value: "es", label: "Mexico | Spanish" },
    { value: "en", label: "United States | English" },
  ],
};

export default function LanguageSwitcherSelect({
  className = "",
  id,
  name = "store-language",
  ariaLabel = "Language selector",
  compact = false,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = getLocaleFromPath(pathname);
  const options = compact
    ? [
        { value: "es", label: "ES" },
        { value: "en", label: "EN" },
      ]
    : LANGUAGE_LABELS[locale] || LANGUAGE_LABELS.es;

  return (
    <select
      id={id}
      className={className}
      aria-label={ariaLabel}
      name={name}
      value={locale}
      onChange={(event) => {
        const nextLocale = event.target.value;
        router.push(addLocalePrefix(pathname || "/", nextLocale));
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
