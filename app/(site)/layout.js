// Layout raíz para la landing (grupo de rutas "(site)"). Es independiente
// del layout del sistema de gestión (grupo "(app)") — cada uno tiene su
// propio <html>/<body> y su propia hoja de estilos, así el CSS de uno no
// pisa el del otro. El de acá carga public/landing.css con un <link>
// normal, tal como lo hacía el sitio estático original.
export const metadata = {
  title: "DevCore | Software a medida para tu negocio",
  description:
    "Desarrollamos sistemas de gestión, sitios web, integraciones y automatizaciones a medida para comercios y empresas.",
};

export default function SiteLayout({ children }) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="stylesheet" href="/landing.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
