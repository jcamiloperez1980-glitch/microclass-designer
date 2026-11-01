import { InstitutionConfig, Lang, Localized } from "./types";
import generic from "./institutions/generic";
import uniminuto from "./institutions/uniminuto";

export type { InstitutionConfig, Lang, Localized } from "./types";

/**
 * Register every institution configuration here.
 * To add one: create `config/institutions/<id>.ts`, import it and add it below.
 */
export const INSTITUTIONS: Record<string, InstitutionConfig> = {
  [generic.id]: generic,
  [uniminuto.id]: uniminuto,
};

/**
 * Active configuration, chosen at build time with the environment variable
 * NEXT_PUBLIC_INSTITUTION (defaults to "generic").
 */
const requested = process.env.NEXT_PUBLIC_INSTITUTION || "generic";
export const config: InstitutionConfig = INSTITUTIONS[requested] ?? generic;

/** Pick the text for a language. */
export function loc(text: Localized, lang: Lang): string {
  return text[lang] || text.en;
}

/** "10–12" */
export function durationLabel(): string {
  return `${config.duration.min}–${config.duration.max}`;
}

/** Language used for generated documents, given the interface language. */
export function documentLang(uiLang: Lang): Lang {
  return config.documentLanguage === "ui" ? uiLang : config.documentLanguage;
}
