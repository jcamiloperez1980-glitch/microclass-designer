import { Lang } from "@/config";

/** Interface strings. Course-specific wording lives in config/, not here. */
const en = {
  langLabel: "Language",
  steps: ["Learners", "Lesson", "Approach diagnostic", "Choose & build"],
  back: "← Back",
  next: "Next →",
  stepOf: (i: number, n: number) => `Step ${i} of ${n}`,

  s1Title: "Step 1 — Who are your learners?",
  nameLabel: "Your name (for the lesson plan)",
  namePlaceholder: "e.g., María García",
  levelLabel: "Level",
  levels: {
    A1: "A1 — Beginner",
    A2: "A2 — Elementary",
    B1: "B1 — Intermediate",
    B2: "B2 — Upper-intermediate",
  },
  contextLabel: "Age & context",
  contextHint: "Who is in the room? Where?",
  contextPlaceholder: "e.g., adults at a community language institute",
  modeLabel: "Delivery mode",
  modeHint:
    "Virtual lessons need different anchors (slides, breakout rooms, chat) — the recommendation adapts.",
  faceToFace: "🏫 Face-to-face",
  virtual: "💻 Virtual (synchronous)",
  scaffoldLabel: "How much scaffolding will learners need?",
  scaffoldHint: "A1/A2 learners almost always need medium–high scaffolding.",
  scaffold: {
    low: "Low — minimal frames needed",
    medium: "Medium — language frames, vocab bank",
    high: "High — heavy modelling and pre-teaching",
  },

  s2Title: "Step 2 — What are you teaching?",
  topicLabel: "Lesson topic",
  topicHint: (dur: string) =>
    `A focused topic — learners must be able to DO something new with English in ${dur} min.`,
  topicPlaceholder: "e.g., Making polite requests in formal situations",
  skillLabel: "Primary skill focus",
  skills: {
    grammar_function: "Grammar & function",
    vocabulary: "Vocabulary in context",
    oral: "Oral / speaking",
    reading_listening: "Reading / listening",
    writing: "Writing",
  },
  outcomeLabel: "Desired outcome — finish this sentence",
  outcomeHint: "By the end of this lesson, students will be able to ...",
  outcomePlaceholder: "e.g., ... make three polite requests in a hotel reception scenario.",

  s3Title: "Step 3 — Approach diagnostic",
  s3Intro: (units: string) =>
    `Five quick questions. Your answers map to one of the modern approaches studied in ${units}. Structural elements appear in your plan only as supporting micro-moves — never as the spine.`,
  goalLabel: "What is the heart of your lesson?",
  goals: {
    function: "A communicative function (apologise, request, recommend...)",
    task: "A real task with a concrete outcome (decide, plan, solve...)",
    discussion: "A meaningful exchange of opinions or ideas",
    content: "Engaging with real content (a text, clip, image)",
    form: "A language structure / grammar point",
  },
  anchorLabel: "What anchor material will you use?",
  anchorHint: "Real-world materials make CBI/CLIL natural; scenarios suit NFA and TBLT.",
  anchors: {
    authentic_text: "A short authentic text (article, email, post...)",
    video_clip: "A short video clip",
    image_data: "An image / infographic / data display",
    scenario_cards: "Scenario or role-play cards",
    none: "Just the whiteboard / shared screen",
  },
  productionLabel: (pct: number) => `Approximate % of time learners will be using English: ${pct}%`,
  productionHint: "The rubric rewards learner production. 50%+ is a healthy target for a micro-class.",
  outcomeQLabel: "Does your lesson produce a concrete outcome?",
  outcomeQHint:
    "A list, decision, plan, recommendation, ranking, post-it wall... something learners create.",
  outcomeNo: "No — the activity is the goal",
  outcomeYes: "Yes — learners produce something concrete",

  s4PickTitle: "Step 4 — Pick your approach",
  s4PickIntro:
    "Based on your answers, two approaches fit your lesson well. Read both — they shape your lesson differently. Pick the one that matches who you want to be as a teacher.",
  beforeYouChoose: "⚠ Before you choose",
  s4BuiltTitle: "Step 4 — Your lesson built around",
  chooseDifferently: "← Choose differently",
  whyApproach: "Why this approach?",
  signatureMoves: "Signature moves",
  microMoves: "Structural micro-moves (form-focus inside your modern frame)",
  lessonPlan: "📄 Lesson plan",
  downloadPdf: "⬇ Download PDF",
  markdown: "⬇ Markdown",
  materials: "✂ Class materials",
  materialsDesc:
    "Print, cut, distribute. Includes scenario / task / discussion cards plus language frames and a vocabulary bank. Learner cards are in English (the target language).",
  downloadMaterials: "⬇ Download materials PDF",
  preview: "Preview the lesson plan (Markdown)",
  reminder: (platform: string) =>
    `Reminder: this is a starter draft. Refine the wording, add your own course references, and make it sound like YOU before submitting it on ${platform}.`,
  docLangNote: (docLang: string) => `Generated documents are in ${docLang} (set by your course).`,
  bestMatch: "Best match",
  viewOfLanguage: "View of language:",
  whyFits: "Why this fits",
  looksLike: "What it would look like",
  use: (name: string) => `Use ${name}`,
  langNames: { es: "Spanish", en: "English" },
  fileName: "microclass-lesson-plan",
  draft: "draft",
};

export type UIStrings = typeof en;

const es: UIStrings = {
  langLabel: "Idioma",
  steps: ["Estudiantes", "Clase", "Diagnóstico de enfoque", "Elegir y construir"],
  back: "← Atrás",
  next: "Siguiente →",
  stepOf: (i, n) => `Paso ${i} de ${n}`,

  s1Title: "Paso 1 — ¿Quiénes son tus estudiantes?",
  nameLabel: "Tu nombre (para el plan de clase)",
  namePlaceholder: "p. ej., María García",
  levelLabel: "Nivel",
  levels: {
    A1: "A1 — Principiante",
    A2: "A2 — Básico",
    B1: "B1 — Intermedio",
    B2: "B2 — Intermedio alto",
  },
  contextLabel: "Edad y contexto",
  contextHint: "¿Quiénes están en el aula? ¿Dónde?",
  contextPlaceholder: "p. ej., adultos en un instituto de idiomas comunitario",
  modeLabel: "Modalidad",
  modeHint:
    "Las clases virtuales necesitan otros recursos (diapositivas, salas, chat): la recomendación se adapta.",
  faceToFace: "🏫 Presencial",
  virtual: "💻 Virtual (sincrónica)",
  scaffoldLabel: "¿Cuánto andamiaje necesitarán los estudiantes?",
  scaffoldHint: "Los estudiantes A1/A2 casi siempre necesitan andamiaje medio o alto.",
  scaffold: {
    low: "Bajo — pocos marcos de apoyo",
    medium: "Medio — marcos de lengua, banco de vocabulario",
    high: "Alto — mucho modelado y pre-enseñanza",
  },

  s2Title: "Paso 2 — ¿Qué vas a enseñar?",
  topicLabel: "Tema de la clase",
  topicHint: (dur) =>
    `Un tema focalizado: los estudiantes deben poder HACER algo nuevo con el inglés en ${dur} min.`,
  topicPlaceholder: "p. ej., Making polite requests in formal situations",
  skillLabel: "Habilidad principal",
  skills: {
    grammar_function: "Gramática y función",
    vocabulary: "Vocabulario en contexto",
    oral: "Expresión oral",
    reading_listening: "Lectura / escucha",
    writing: "Escritura",
  },
  outcomeLabel: "Resultado esperado — completa la frase",
  outcomeHint: "Al final de esta clase, los estudiantes podrán ...",
  outcomePlaceholder: "p. ej., ... hacer tres peticiones corteses en la recepción de un hotel.",

  s3Title: "Paso 3 — Diagnóstico de enfoque",
  s3Intro: (units) =>
    `Cinco preguntas rápidas. Tus respuestas se relacionan con uno de los enfoques modernos vistos en ${units}. Los elementos estructurales aparecen en tu plan solo como micro-movimientos de apoyo, nunca como la columna vertebral.`,
  goalLabel: "¿Cuál es el corazón de tu clase?",
  goals: {
    function: "Una función comunicativa (disculparse, pedir, recomendar...)",
    task: "Una tarea real con un resultado concreto (decidir, planear, resolver...)",
    discussion: "Un intercambio significativo de opiniones o ideas",
    content: "Trabajar con contenido real (un texto, video, imagen)",
    form: "Una estructura de la lengua / punto gramatical",
  },
  anchorLabel: "¿Qué material ancla vas a usar?",
  anchorHint: "Los materiales reales hacen natural el CBI/CLIL; los escenarios sirven para NFA y TBLT.",
  anchors: {
    authentic_text: "Un texto auténtico breve (artículo, correo, publicación...)",
    video_clip: "Un video corto",
    image_data: "Una imagen / infografía / gráfico",
    scenario_cards: "Tarjetas de escenario o juego de roles",
    none: "Solo el tablero / pantalla compartida",
  },
  productionLabel: (pct) => `Porcentaje aproximado del tiempo en que los estudiantes usan el inglés: ${pct}%`,
  productionHint: "La rúbrica premia la producción de los estudiantes. 50% o más es una buena meta.",
  outcomeQLabel: "¿Tu clase produce un resultado concreto?",
  outcomeQHint:
    "Una lista, decisión, plan, recomendación, ranking, muro de notas... algo que los estudiantes crean.",
  outcomeNo: "No — la actividad es el objetivo",
  outcomeYes: "Sí — los estudiantes producen algo concreto",

  s4PickTitle: "Paso 4 — Elige tu enfoque",
  s4PickIntro:
    "Según tus respuestas, dos enfoques encajan bien con tu clase. Lee ambos: le dan forma distinta a tu clase. Elige el que corresponda al docente que quieres ser.",
  beforeYouChoose: "⚠ Antes de elegir",
  s4BuiltTitle: "Paso 4 — Tu clase construida con",
  chooseDifferently: "← Elegir otro",
  whyApproach: "¿Por qué este enfoque?",
  signatureMoves: "Movimientos característicos",
  microMoves: "Micro-movimientos estructurales (foco en la forma dentro de tu marco moderno)",
  lessonPlan: "📄 Plan de clase",
  downloadPdf: "⬇ Descargar PDF",
  markdown: "⬇ Markdown",
  materials: "✂ Materiales de clase",
  materialsDesc:
    "Imprime, recorta y reparte. Incluye tarjetas de escenario / tarea / discusión, marcos de lengua y banco de vocabulario. Las tarjetas para estudiantes están en inglés (la lengua meta).",
  downloadMaterials: "⬇ Descargar PDF de materiales",
  preview: "Vista previa del plan (Markdown)",
  reminder: (platform) =>
    `Recuerda: esto es un borrador inicial. Ajusta la redacción, agrega tus propias referencias del curso y haz que suene a TI antes de entregarlo en ${platform}.`,
  docLangNote: (docLang) => `Los documentos se generan en ${docLang} (definido por tu curso).`,
  bestMatch: "Mejor opción",
  viewOfLanguage: "Visión de la lengua:",
  whyFits: "Por qué encaja",
  looksLike: "Cómo se vería",
  use: (name) => `Usar ${name}`,
  langNames: { es: "español", en: "inglés" },
  fileName: "plan-microclase",
  draft: "borrador",
};

export const UI: Record<Lang, UIStrings> = { en, es };
