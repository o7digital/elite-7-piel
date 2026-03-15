"use client";
import { mainMenuItems } from "@/data/menu";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const isMenuItemActive = (item) => {
    if (item.exact) {
      return pathname === item.href;
    }

    return item.activePrefixes.some((prefix) => pathname.startsWith(prefix));
  };

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
