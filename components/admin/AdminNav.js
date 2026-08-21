"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/proyectos", label: "Proyectos" },
];

function isActivePath(pathname, href) {
  return href === "/admin"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegación de administración" className="min-w-0">
      <ul className="flex gap-1 lg:flex-col">
        {links.map((link) => {
          const active = isActivePath(pathname, link.href);

          return (
            <li key={link.href} className="shrink-0 lg:w-full">
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-teal/10 text-teal"
                    : "text-muted hover:bg-white/5 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
