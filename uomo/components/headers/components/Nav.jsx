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
  "/faq": { es: "Preguntas Frecuentes", en: "Frequently Asked Questions" },
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
        <li key={item.id} className="navigation__item position-relative">
          <Link
            href={item.href}
            onClick={item.href === "/" ? handleHomeClick : undefined}
            className={`navigation__link ${
              isMenuItemActive(item) ? "menu-active" : ""
            }`}
          >
            {MENU_LABELS[item.href]?.[locale] || item.title}
          </Link>
          {item.subMenu?.length ? (
            <div className="sub-menu default-menu">
              <ul className="sub-menu__list list-unstyled mb-0">
                {item.subMenu.map((subItem) => (
                  <li key={subItem.id} className="sub-menu__item">
                    <Link
                      href={subItem.href}
                      className={`menu-link menu-link_us-s ${
                        normalizedPathname === subItem.href
                          ? "menu-link_active"
                          : ""
                      }`}
                    >
                      {MENU_LABELS[subItem.href]?.[locale] || subItem.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </li>
      ))}
    </>
  );
}
