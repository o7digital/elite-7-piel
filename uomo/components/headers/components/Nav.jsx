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
            {item.title}
          </Link>
        </li>
      ))}
    </>
  );
}
