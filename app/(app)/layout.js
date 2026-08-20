import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "DevCore | Sistema de gestión",
  description: "Panel interno de DevCore",
  robots: { index: false, follow: false },
  icons: { icon: "/icon.webp" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-AR">
      <body className="font-body min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
