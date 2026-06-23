"use client";

import { useEffect } from "react";
import { mainMenuItems } from "@/data/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPath, stripLocalePrefix } from "@/lib/i18n/locale";

const MENU_LABELS = {
  "/": { es: "Inicio", en: "Home" },
  "/shop": { es: "Tienda", en: "Shop" },
  "/about": { es: "Quienes Somos", en: "About Us" },
  "/contact": { es: "Contacto", en: "Contact" },
  "/faq": { es: "Preguntas Frecuentes", en: "Frequently Asked Questions" },
};

export default function MobileNav() {
  const pathname = usePathname();
  const normalizedPathname = stripLocalePrefix(pathname);
  const locale = getLocaleFromPath(pathname);

  const isMenuItemActive = (item) => {
    if (item.exact) {
      return normalizedPathname === item.href;
    }

    return item.activePrefixes.some((prefix) =>
      normalizedPathname.startsWith(prefix)
    );
  };

  useEffect(() => {
    const selectors = {
      mobileMenu: ".navigation",
      mobileMenuActiveClass: "mobile-menu-opened",
    };

    const mobileDropdown = document.querySelector(selectors.mobileMenu);

    const removeMenu = (event) => {
      if (event) {
        event.preventDefault();
      }

      if (document.body.classList.contains(selectors.mobileMenuActiveClass)) {
        document.body.classList.remove(selectors.mobileMenuActiveClass);
        document.body.style.paddingRight = "";
        mobileDropdown.style.paddingRight = "";
      }
    };
    removeMenu();
  }, [pathname]);

  return (
    <>
      {mainMenuItems.map((item) => (
        <li key={item.id} className="navigation__item">
          <Link
            href={item.href}
            className={`navigation__link ${
              isMenuItemActive(item) ? "menu-active" : ""
            }`}
          >
            {MENU_LABELS[item.href]?.[locale] || item.title}
          </Link>
          {item.subMenu?.length ? (
            <ul className="sub-menu__list list-unstyled ms-3 mb-0">
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
          ) : null}
        </li>
      ))}
    </>
  );
}
