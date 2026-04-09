"use client";
import { dashboardMenuItems } from "@/data/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { stripLocalePrefix } from "@/lib/i18n/locale";
export default function DashboardSidebar() {
  const pathname = usePathname();
  const normalizedPathname = stripLocalePrefix(pathname);
  return (
    <div className="col-lg-3">
      <ul className="account-nav">
        {dashboardMenuItems.map((elm, i) => (
          <li key={i}>
            <Link
              href={elm.href}
              className={`menu-link menu-link_us-s ${
                normalizedPathname == elm.href ? "menu-link_active" : ""
              } `}
            >
              {elm.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
