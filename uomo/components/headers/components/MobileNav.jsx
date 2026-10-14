"use client";

import { mainMenuItems } from "@/data/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPath, stripLocalePrefix, localizeHref } from "@/lib/i18n/locale";

const MENU_LABELS = {
  "/": { es: "Inicio", en: "Home" },
  "/shop": { es: "Tienda", en: "Shop" },
  "/especiales": { es: "Especiales", en: "Specials" },
  "/about": { es: "Quienes Somos", en: "About Us" },
  "/contact": { es: "Contacto", en: "Contact" },
  "/faq": { es: "Preguntas Frecuentes", en: "Frequently Asked Questions" },
};

export default function MobileNav({ onNavigate }) {
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

  return (
    <>
      {mainMenuItems.map((item) => (
        <li key={item.id} className="navigation__item">
          <Link
            href={localizeHref(item.href, locale)}
            onClick={onNavigate}
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
                    href={localizeHref(subItem.href, locale)}
                    onClick={onNavigate}
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
