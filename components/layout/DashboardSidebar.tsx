"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Resumen" },
  { href: "/dashboard/restaurants", label: "Mis restaurantes" },
  { href: "/dashboard/restaurants/new", label: "Nuevo restaurante" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Panel de control
      </p>
      <nav className="flex flex-col gap-1 text-sm">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-2 py-1 ${isActive
                ? "bg-brand-50 text-brand-700"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
