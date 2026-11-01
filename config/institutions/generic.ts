import { InstitutionConfig } from "../types";

/**
 * Neutral configuration for any faculty of education / language-teaching programme.
 * Copy this file to create a configuration for a new institution.
 */
const generic: InstitutionConfig = {
  id: "generic",
  institutionName: "",
  programName: {
    es: "Licenciatura en lenguas extranjeras",
    en: "Language Teacher Education",
  },
  courseName: {
    es: "Didáctica y metodología de la enseñanza de lenguas",
    en: "Language Teaching Methodology",
  },
  assignmentName: { es: "microclase", en: "micro-teaching task" },
  submissionPlatform: { es: "la plataforma del curso", en: "your course platform" },

  defaultLanguage: "es",
  documentLanguage: "ui",

  duration: { min: 10, max: 12 },

  template: {
    title: { es: "Plan de microclase", en: "Micro-Class Lesson Plan" },
    sections: {
      overview: { es: "1. Panorama de la clase", en: "1. Lesson Overview" },
      objective: { es: "2. Objetivo de aprendizaje", en: "2. Learning Objective" },
      procedure: { es: "3. Procedimiento", en: "3. Lesson Procedure" },
      justification: { es: "4. Justificación metodológica", en: "4. Methodological Justification" },
    },
    justificationWords: { min: 100, max: 150 },
    pdfDescription: {
      es: "PDF A4 — plan completo en 4 secciones.",
      en: "A4 PDF — full four-section lesson plan.",
    },
  },

  course: {
    viewOfLanguageUnit: { es: "", en: "" },
    approachesUnits: { es: "el curso", en: "the course" },
    peerRoleplayNote: { es: "", en: "" },
    references: [
      "Richards & Rodgers, 2014",
      "Kumaravadivelu, 2003",
      "Nunan, 2004 (TBLT)",
      "Coyle, Hood & Marsh, 2010 (CLIL)",
      "Wilkins, 1976 (NFA)",
    ],
    extraChecklist: [],
  },

  footerNote: {
    es: "Herramienta de planeación — el plan final debe ser trabajo propio del estudiante.",
    en: "A planning tool — the final lesson plan must be the student's own work.",
  },

  theme: { brand: "#0f766e", accent: "#f59e0b" },
};

export default generic;
