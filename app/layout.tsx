import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Micro-Class Designer · UNIMINUTO",
  description:
    "Design your 10–12 minute language micro-class with a principled methodological approach.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="bg-brand text-white">
          <div className="mx-auto max-w-4xl px-6 py-5">
            <h1 className="text-xl font-bold tracking-tight">Micro-Class Designer</h1>
            <p className="text-sm text-white/80">
              UNIMINUTO · Approaches &amp; Methods in Language Teaching I · Final Task helper
            </p>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
        <footer className="mx-auto max-w-4xl px-6 pb-10 pt-6 text-xs text-slate-500">
          A planning tool — your final lesson plan must still be your own work, uploaded to Moodle.
        </footer>
      </body>
    </html>
  );
}
