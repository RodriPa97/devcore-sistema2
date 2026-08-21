import Link from "next/link";

export function AdminPagination({
  pathname,
  page,
  totalPages,
  paramName,
  label,
}) {
  if (totalPages <= 1) return null;

  function pageHref(nextPage) {
    return {
      pathname,
      query: { [paramName]: String(nextPage) },
    };
  }

  return (
    <nav
      aria-label={`Paginación de ${label}`}
      className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 px-4 py-4 sm:px-5"
    >
      <Link
        href={pageHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        tabIndex={page === 1 ? -1 : undefined}
        className={`inline-flex min-h-11 items-center rounded-lg px-3 py-2 font-mono text-xs transition-colors ${
          page === 1
            ? "pointer-events-none text-muted-2/50"
            : "text-teal hover:bg-teal/10"
        }`}
      >
        Anterior
      </Link>
      <span className="font-mono text-xs text-muted-2">
        Página {page} de {totalPages}
      </span>
      <Link
        href={pageHref(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        tabIndex={page === totalPages ? -1 : undefined}
        className={`inline-flex min-h-11 items-center rounded-lg px-3 py-2 font-mono text-xs transition-colors ${
          page === totalPages
            ? "pointer-events-none text-muted-2/50"
            : "text-teal hover:bg-teal/10"
        }`}
      >
        Siguiente
      </Link>
    </nav>
  );
}
