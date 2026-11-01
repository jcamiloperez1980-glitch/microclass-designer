/**
 * Institution / course configuration.
 *
 * Everything that is specific to one university, programme or course lives in
 * an object of this shape (see `config/institutions/*.ts`). The app code never
 * hard-codes institution names, course names or assignment templates.
 */

export type Lang = "es" | "en";

/** A text available in both interface languages. */
export type Localized = { es: string; en: string };

export type InstitutionConfig = {
  /** Identifier used by NEXT_PUBLIC_INSTITUTION to select this config. */
  id: string;

  /** Institution name shown in the header and in generated documents (may be empty). */
  institutionName: string;
  /** Degree programme, e.g. "Licenciatura en Inglés". Optional. */
  programName?: Localized;
  /** Course the micro-class belongs to. */
  courseName: Localized;
  /** Name of the assessed task, e.g. "Final Task". */
  assignmentName: Localized;
  /** Where students submit their work (shown in reminders). */
  submissionPlatform: Localized;

  /** Interface language used on first visit (users can switch). */
  defaultLanguage: Lang;
  /**
   * Language of the generated lesson plan and teacher notes.
   * "ui" = follow the language selected in the interface.
   * Learner-facing cut-out cards are always in English (the target language).
   */
  documentLanguage: "ui" | Lang;

  /** Micro-class length in minutes. */
  duration: { min: number; max: number };

  /** Lesson-plan template (the assignment's required sections). */
  template: {
    title: Localized;
    sections: {
      overview: Localized;
      objective: Localized;
      procedure: Localized;
      justification: Localized;
    };
    /** Word range required for the methodological justification. */
    justificationWords: { min: number; max: number };
    /** Short description of what the PDF covers, shown next to the download button. */
    pdfDescription: Localized;
  };

  /** Course-specific pointers used inside generated text. */
  course: {
    /** Where the "view of language" is studied, e.g. "Unit 1". Empty = omit. */
    viewOfLanguageUnit: Localized;
    /** Where the approaches are studied, e.g. "Units 1–2". */
    approachesUnits: Localized;
    /** Note about who plays the learners during the micro-class. Empty = omit. */
    peerRoleplayNote: Localized;
    /** Reading list suggested for the justification. */
    references: string[];
    /** Extra checklist items appended to the pre-delivery checklist. */
    extraChecklist: Localized[];
  };

  /** Footer note (academic-integrity reminder). */
  footerNote: Localized;

  /** Brand colours (hex). */
  theme: { brand: string; accent: string };
};
