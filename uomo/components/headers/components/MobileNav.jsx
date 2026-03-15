"use client";

import { useEffect } from "react";
import { mainMenuItems } from "@/data/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function MobileNav() {
  const pathname = usePathname();

  const isMenuItemActive = (item) => {
    if (item.exact) {
      return pathname === item.href;
    }

    return item.activePrefixes.some((prefix) => pathname.startsWith(prefix));
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
            {item.title}
          </Link>
        </li>
      ))}
    </>
  );
}
