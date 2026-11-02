import type { Metadata, Viewport } from "next";
import { config, loc } from "@/config";
import Shell from "./Shell";
import "./globals.css";

const lang = config.defaultLanguage;

export const metadata: Metadata = {
  title: config.institutionName
    ? `Micro-Class Designer · ${config.institutionName}`
    : "Micro-Class Designer",
  description: loc(
    {
      es: "Diseña tu microclase de lengua con un enfoque metodológico fundamentado.",
      en: "Design your language micro-class with a principled methodological approach.",
    },
    lang
  ),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: config.theme.brand,
};

/** "#1e3a8a" → "30 58 138" for Tailwind's rgb(var(--x) / alpha) colours. */
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const themeVars = {
    "--brand-rgb": hexToRgb(config.theme.brand),
    "--brand-accent-rgb": hexToRgb(config.theme.accent),
    "--brand": config.theme.brand,
  } as React.CSSProperties;

  return (
    <html lang={lang} style={themeVars}>
      <body className="min-h-screen antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
