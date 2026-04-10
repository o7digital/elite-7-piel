"use client";
import { mainMenuItems } from "@/data/menu";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import {
  addLocalePrefix,
  getLocaleFromPath,
  stripLocalePrefix,
} from "@/lib/i18n/locale";

const MENU_LABELS = {
  "/": { es: "Inicio", en: "Home" },
  "/shop": { es: "Tienda", en: "Shop" },
  "/about": { es: "Quienes Somos", en: "About Us" },
  "/contact": { es: "Contacto", en: "Contact" },
};

export default function Nav() {
  const pathname = usePathname();
  const normalizedPathname = stripLocalePrefix(pathname);
  const locale = getLocaleFromPath(pathname);

  const handleHomeClick = (event) => {
    event.preventDefault();
    window.location.assign(addLocalePrefix("/", locale));
  };

  const isMenuItemActive = (item) => {
    if (item.exact) {
      return normalizedPathname === item.href;
    }

    return item.activePrefixes.some((prefix) =>
      normalizedPathname.startsWith(prefix)
    );
  };

  return (
    <>
      {mainMenuItems.map((item) => (
        <li key={item.id} className="navigation__item">
          <Link
            href={item.href}
            onClick={item.href === "/" ? handleHomeClick : undefined}
            className={`navigation__link ${
              isMenuItemActive(item) ? "menu-active" : ""
            }`}
          >
            {MENU_LABELS[item.href]?.[locale] || item.title}
          </Link>
        </li>
      ))}
    </>
  );
}
