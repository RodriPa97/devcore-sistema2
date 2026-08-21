import "./globals.css";
import { Providers } from "./providers";
import { fontBody, fontDisplay, fontMono } from "@/lib/fonts";

export const metadata = {
  title: "DevCore | Sistema de gestión",
  description: "Panel interno de DevCore",
  robots: { index: false, follow: false },
  icons: { icon: "/icon.webp" },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es-AR"
      className={`${fontBody.variable} ${fontDisplay.variable} ${fontMono.variable}`}
    >
      <body className="font-body min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
