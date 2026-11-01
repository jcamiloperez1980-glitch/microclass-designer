import { Lang } from "@/config";
import { ApproachKey } from "./types";

export type ApproachInfo = {
  name: string;
  shortName: string;
  tagline: string;
  viewOfLanguage: string;
  signatureMoves: string[];
};

const EN: Record<ApproachKey, ApproachInfo> = {
  CLT: {
    name: "Communicative Language Teaching (CLT)",
    shortName: "CLT",
    tagline: "Language is for meaningful communication.",
    viewOfLanguage: "Language as social practice — meaning is negotiated in interaction.",
    signatureMoves: [
      "Open with a genuine question that requires English to answer.",
      "Set up a meaningful exchange where learners must understand and be understood.",
      "Monitor and provide targeted feedback after the interaction — not during it.",
    ],
  },
  TBLT: {
    name: "Task-Based Language Teaching (TBLT)",
    shortName: "TBLT",
    tagline: "Learners use English to complete a real task.",
    viewOfLanguage: "Language as a tool for doing things — form emerges from doing.",
    signatureMoves: [
      "Pre-task: brief context + a few useful chunks (not a grammar lesson).",
      "Task: learners produce a concrete outcome (decision, plan, list, ranking).",
      "Report: groups share results.",
      "Language focus: 60–90 sec on one form that emerged in the task.",
    ],
  },
  CBI_CLIL: {
    name: "Content-Based Instruction / CLIL",
    shortName: "CBI/CLIL",
    tagline: "Learn English through engaging real content.",
    viewOfLanguage: "Language as the medium for accessing meaning and knowledge.",
    signatureMoves: [
      "Anchor the lesson in a short authentic text, clip, or visual.",
      "State both a content objective AND a language objective.",
      "Comprehension first, then a content-driven discussion or response task.",
    ],
  },
  NFA: {
    name: "Notional-Functional Approach (NFA)",
    shortName: "NFA",
    tagline: "Organise the lesson around a function learners need.",
    viewOfLanguage:
      "Language as a set of functions for social purposes (request, apologise, recommend).",
    signatureMoves: [
      "Name the function explicitly — e.g., “making polite requests”.",
      "Present 3–4 exponents at different formality levels.",
      "Practise in a controlled mini-role-play, then in a freer one.",
    ],
  },
  ECLECTIC: {
    name: "Principled Eclecticism",
    shortName: "Principled Eclecticism",
    tagline: "Combine two approaches, justified by your context.",
    viewOfLanguage: "Language is multi-faceted — different goals call for different lenses.",
    signatureMoves: [
      "Pick a primary frame (TBLT, CLT, CBI, or NFA) for the overall arc.",
      "Borrow one technique from a second approach for a specific phase.",
      "Justify the combination explicitly in your lesson plan.",
    ],
  },
};

const ES: Record<ApproachKey, ApproachInfo> = {
  CLT: {
    name: "Enfoque Comunicativo (CLT)",
    shortName: "CLT",
    tagline: "La lengua sirve para comunicarse con sentido.",
    viewOfLanguage: "La lengua como práctica social: el significado se negocia en la interacción.",
    signatureMoves: [
      "Abre con una pregunta genuina que exija usar inglés para responder.",
      "Organiza un intercambio con sentido donde los estudiantes deban comprender y hacerse comprender.",
      "Observa y da retroalimentación focalizada después de la interacción, no durante.",
    ],
  },
  TBLT: {
    name: "Enseñanza Basada en Tareas (TBLT)",
    shortName: "TBLT",
    tagline: "Los estudiantes usan el inglés para completar una tarea real.",
    viewOfLanguage: "La lengua como herramienta para hacer cosas: la forma surge del uso.",
    signatureMoves: [
      "Pre-tarea: contexto breve + unas pocas expresiones útiles (no una clase de gramática).",
      "Tarea: los estudiantes producen un resultado concreto (decisión, plan, lista, ranking).",
      "Reporte: los grupos comparten resultados.",
      "Foco en la lengua: 60–90 s sobre una forma que surgió en la tarea.",
    ],
  },
  CBI_CLIL: {
    name: "Instrucción Basada en Contenidos / AICLE (CBI/CLIL)",
    shortName: "CBI/CLIL",
    tagline: "Aprender inglés a través de contenido real y atractivo.",
    viewOfLanguage: "La lengua como medio para acceder al significado y al conocimiento.",
    signatureMoves: [
      "Ancla la clase en un texto auténtico breve, un video o una imagen.",
      "Formula un objetivo de contenido Y un objetivo de lengua.",
      "Primero comprensión; luego una discusión o tarea de respuesta guiada por el contenido.",
    ],
  },
  NFA: {
    name: "Enfoque Nocional-Funcional (NFA)",
    shortName: "NFA",
    tagline: "Organiza la clase alrededor de una función que los estudiantes necesitan.",
    viewOfLanguage:
      "La lengua como conjunto de funciones con propósitos sociales (pedir, disculparse, recomendar).",
    signatureMoves: [
      "Nombra la función explícitamente, p. ej., “hacer peticiones corteses”.",
      "Presenta 3–4 exponentes con distintos niveles de formalidad.",
      "Practica en un mini juego de roles controlado y luego en uno más libre.",
    ],
  },
  ECLECTIC: {
    name: "Eclecticismo con principios",
    shortName: "Eclecticismo con principios",
    tagline: "Combina dos enfoques, justificados por tu contexto.",
    viewOfLanguage: "La lengua es multifacética: objetivos distintos piden lentes distintos.",
    signatureMoves: [
      "Elige un marco principal (TBLT, CLT, CBI o NFA) para el arco general.",
      "Toma prestada una técnica de un segundo enfoque para una fase específica.",
      "Justifica la combinación explícitamente en tu plan.",
    ],
  },
};

export const APPROACH_INFO: Record<Lang, Record<ApproachKey, ApproachInfo>> = { en: EN, es: ES };

export function approachInfo(key: ApproachKey, lang: Lang): ApproachInfo {
  return APPROACH_INFO[lang][key];
}
