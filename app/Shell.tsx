"use client";

import { config, Lang, loc } from "@/config";
import { LanguageProvider, useLang } from "@/lib/i18n";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      <Footer />
    </LanguageProvider>
  );
}

function Header() {
  const { lang } = useLang();
  const subtitle = [
    config.institutionName,
    loc(config.courseName, lang),
    loc(config.assignmentName, lang),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <header className="bg-brand text-white">
      <div className="mx-auto flex max-w-4xl items-start justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <h1 className="text-lg font-bold tracking-tight sm:text-xl">Micro-Class Designer</h1>
          <p className="text-xs text-white/80 sm:text-sm">{subtitle}</p>
        </div>
        <LanguageSwitch />
      </div>
    </header>
  );
}

function LanguageSwitch() {
  const { lang, setLang, ui } = useLang();
  const options: { value: Lang; label: string; title: string }[] = [
    { value: "es", label: "ES", title: "Español" },
    { value: "en", label: "EN", title: "English" },
  ];
  return (
    <div
      role="group"
      aria-label={ui.langLabel}
      className="flex shrink-0 overflow-hidden rounded-md border border-white/40 text-xs font-semibold"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          title={o.title}
          aria-pressed={lang === o.value}
          onClick={() => setLang(o.value)}
          className={`min-h-[36px] min-w-[44px] px-3 py-1.5 ${
            lang === o.value ? "bg-white text-brand" : "text-white hover:bg-white/10"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Footer() {
  const { lang } = useLang();
  return (
    <footer className="mx-auto max-w-4xl px-4 pb-10 pt-6 text-xs text-slate-500 sm:px-6">
      {loc(config.footerNote, lang)}
    </footer>
  );
}
