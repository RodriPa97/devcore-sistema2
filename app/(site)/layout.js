import "./landing.css";

// Layout raíz para la landing. Su CSS sigue aislado del sistema de gestión.
export const metadata = {
  title: "DevCore | Software a medida para tu negocio",
  description:
    "Desarrollamos sistemas de gestión, sitios web, integraciones y automatizaciones a medida para comercios y empresas.",
  icons: { icon: "/icon.webp" },
};

export default function SiteLayout({ children }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
