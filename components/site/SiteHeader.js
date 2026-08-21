"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navigationGroups = [
  {
    id: "servicios",
    label: "Servicios",
    columns: [
      {
        heading: "Qué hacemos",
        items: [
          ["Analizar", "Relevamos procesos y necesidades", "#servicios"],
          ["Diseñar", "Pantallas y flujo de trabajo", "#servicios"],
          ["Desarrollar", "Sistemas y paneles a medida", "#servicios"],
        ],
      },
      {
        heading: "Cómo lo hacemos",
        items: [
          ["Integrar", "Pagos, APIs y servicios externos", "#servicios"],
          ["Publicar", "Puesta en marcha en internet", "#servicios"],
          ["Mantener", "Mejoras y soporte continuo", "#servicios"],
        ],
      },
    ],
  },
  {
    id: "soluciones",
    label: "Soluciones",
    columns: [
      {
        heading: "Para tu negocio",
        items: [
          ["Sistemas de gestión", "Panel, usuarios y reportes", "#industrias"],
          ["Stock y ventas", "Productos, movimientos y ventas", "#industrias"],
          ["Farmacias", "Gestión y administración", "#industrias"],
        ],
      },
      {
        heading: "Más soluciones",
        items: [
          ["Comercios y gastronomía", "Pedidos, ventas y paneles", "#industrias"],
          ["Sitios web", "Landing pages institucionales", "#industrias"],
          ["Integraciones", "Pagos, APIs y automatización", "#industrias"],
        ],
      },
    ],
  },
  {
    id: "recursos",
    label: "Recursos",
    columns: [
      {
        heading: "Empresa",
        items: [
          ["Cómo trabajamos", "Nuestro proceso paso a paso", "#planes"],
          ["Seguimiento de proyectos", "Transparencia en cada etapa", "#seguimiento"],
        ],
      },
      {
        heading: "Ayuda",
        items: [
          ["Preguntas frecuentes", "Resolvemos tus dudas", "#faq"],
          ["Contacto", "Escribinos directamente", "mailto:devcore97@gmail.com"],
        ],
      },
    ],
  },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const dropdownButtonRefs = useRef({});

  useEffect(() => {
    function handlePointerDown(event) {
      if (!headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
        setOpenDropdown(null);
      }
    }

    function handleKeyDown(event) {
      if (event.key !== "Escape") return;

      if (openDropdown) {
        const trigger = dropdownButtonRefs.current[openDropdown];
        setOpenDropdown(null);
        trigger?.focus();
      } else if (menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, openDropdown]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 880px)");
    const handleBreakpointChange = () => {
      setMenuOpen(false);
      setOpenDropdown(null);
    };

    mobileQuery.addEventListener("change", handleBreakpointChange);
    return () => mobileQuery.removeEventListener("change", handleBreakpointChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("site-menu-open", menuOpen);
    return () => document.body.classList.remove("site-menu-open");
  }, [menuOpen]);

  function closeNavigation() {
    setMenuOpen(false);
    setOpenDropdown(null);
  }

  function focusDropdownLink(groupId, position) {
    requestAnimationFrame(() => {
      const links = document.querySelectorAll(`#nav-dropdown-${groupId} a`);
      const link = position === "last" ? links[links.length - 1] : links[0];
      link?.focus();
    });
  }

  function handleDropdownKeyDown(event, groupId) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    setOpenDropdown(groupId);
    focusDropdownLink(groupId, event.key === "ArrowUp" ? "last" : "first");
  }

  return (
    <header className="site" ref={headerRef}>
      <a href="#seguimiento" className="nav-banner" onClick={closeNavigation}>
        Ahora podés seguir el progreso de tu proyecto en tiempo real desde tu panel de cliente
        <span className="chev" aria-hidden="true">›</span>
      </a>
      <nav className={`nav${menuOpen ? " menu-open" : ""}`} aria-label="Navegación principal">
        <Link href="/" className="nav-logo" aria-label="DevCore, inicio" onClick={closeNavigation}>
          <Image src="/logo-horizontal.webp" alt="DevCore" width={700} height={280} priority />
        </Link>

        <div id="site-nav-links" className="nav-links">
          {navigationGroups.map((group) => {
            const isOpen = openDropdown === group.id;
            return (
              <div className={`nav-item${isOpen ? " is-open" : ""}`} key={group.id}>
                <button
                  ref={(node) => {
                    dropdownButtonRefs.current[group.id] = node;
                  }}
                  type="button"
                  className="nav-link"
                  aria-expanded={isOpen}
                  aria-controls={`nav-dropdown-${group.id}`}
                  onClick={() => setOpenDropdown(isOpen ? null : group.id)}
                  onKeyDown={(event) => handleDropdownKeyDown(event, group.id)}
                >
                  {group.label}
                  <span className="nav-caret" aria-hidden="true">▾</span>
                </button>
                <div
                  id={`nav-dropdown-${group.id}`}
                  className="nav-dropdown"
                  aria-hidden={!isOpen}
                >
                  {group.columns.map((column) => (
                    <div className="nav-dd-col" key={column.heading}>
                      <span className="nav-dd-heading">{column.heading}</span>
                      {column.items.map(([title, description, href]) => (
                        <a href={href} className="nav-dd-item" onClick={closeNavigation} key={title}>
                          <span className="nav-dd-title">{title}</span>
                          <span className="nav-dd-desc">{description}</span>
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="nav-mobile-cta">
            <Link href="/login" className="btn btn-primary" onClick={closeNavigation}>
              Iniciar sesión
            </Link>
            <Link href="/registro" className="btn btn-ghost" onClick={closeNavigation}>
              Registrarse
            </Link>
          </div>
        </div>

        <div className="nav-cta">
          <Link href="/login" className="btn btn-primary">
            Iniciar sesión
          </Link>
          <Link href="/registro" className="btn btn-ghost">
            Registrarse
          </Link>
        </div>
        <button
          ref={menuButtonRef}
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="site-nav-links"
          onClick={() => {
            setMenuOpen((open) => !open);
            setOpenDropdown(null);
          }}
        >
          <span aria-hidden="true" className="nav-toggle-icon">
            <i></i><i></i><i></i>
          </span>
        </button>
      </nav>
    </header>
  );
}
