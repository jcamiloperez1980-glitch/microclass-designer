import { InstitutionConfig } from "../types";

/**
 * Example configuration: UNIMINUTO — Approaches and Methods in Language Teaching I.
 * This is the course the tool was originally built for.
 * Activate it with NEXT_PUBLIC_INSTITUTION=uniminuto
 */
const uniminuto: InstitutionConfig = {
  id: "uniminuto",
  institutionName: "UNIMINUTO",
  programName: {
    es: "Licenciatura en Inglés",
    en: "B.Ed. in English Language Teaching",
  },
  courseName: {
    es: "Approaches and Methods in Language Teaching I",
    en: "Approaches and Methods in Language Teaching I",
  },
  assignmentName: { es: "Final Task", en: "Final Task" },
  submissionPlatform: { es: "Moodle", en: "Moodle" },

  defaultLanguage: "en",
  documentLanguage: "en",

  duration: { min: 10, max: 12 },

  template: {
    title: { es: "Plan de microclase", en: "Micro-Class Lesson Plan" },
    sections: {
      overview: { es: "Sección 1 — Panorama de la clase", en: "Section 1 — Lesson Overview" },
      objective: { es: "Sección 2 — Objetivo de aprendizaje", en: "Section 2 — Learning Objective" },
      procedure: { es: "Sección 3 — Procedimiento", en: "Section 3 — Lesson Procedure" },
      justification: {
        es: "Sección 4 — Justificación metodológica",
        en: "Section 4 — Methodological Justification",
      },
    },
    justificationWords: { min: 100, max: 150 },
    pdfDescription: {
      es: "PDF A4 — Secciones 1–4 de la plantilla del Final Task.",
      en: "A4 PDF — Sections 1–4 of the Final Task template.",
    },
  },

  course: {
    viewOfLanguageUnit: { es: "Unidad 1", en: "Unit 1" },
    approachesUnits: { es: "Unidades 1–2", en: "Units 1–2" },
    peerRoleplayNote: {
      es: "Tus compañeros harán el papel de estudiantes A2–B1.",
      en: "Your peers will role-play A2–B1 learners.",
    },
    references: [
      "Richards & Rodgers, 2014",
      "Kumaravadivelu, 2003",
      "Nunan, 2004 (TBLT)",
      "Brinton, Snow & Wesche (CBI)",
      "Wilkins, 1976 (NFA)",
    ],
    extraChecklist: [],
  },

  footerNote: {
    es: "Herramienta de planeación — tu plan final debe ser tu propio trabajo y se sube a Moodle.",
    en: "A planning tool — your final lesson plan must still be your own work, uploaded to Moodle.",
  },

  theme: { brand: "#1e3a8a", accent: "#0ea5e9" },
};

export default uniminuto;
