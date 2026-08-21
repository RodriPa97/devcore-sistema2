import {
  IBM_Plex_Sans,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";

export const fontBody = IBM_Plex_Sans({
  display: "swap",
  preload: true,
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const fontDisplay = Space_Grotesk({
  display: "swap",
  preload: true,
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const fontMono = JetBrains_Mono({
  display: "swap",
  preload: true,
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});
