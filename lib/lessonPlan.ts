import { config, durationLabel, Lang, loc } from "@/config";
import { approachInfo } from "./approaches";
import { ApproachKey, LearnerInput, Recommendation } from "./types";

type T = (en: string, es: string) => string;

type Phase = { name: string; min: number; teacher: string; students: string };

/** Language-neutral content model rendered to both Markdown and HTML. */
type PlanContent = {
  title: string;
  draftNote: string;
  meta: { label: string; value: string }[];
  overview: { heading: string; items: { label: string; text: string }[] };
  objective: { heading: string; items: { label: string; text: string }[] };
  procedure: {
    heading: string;
    columns: [string, string, string, string];
    phases: Phase[];
    totalLabel: string;
  };
  justification: { heading: string; paragraph: string; note: string };
  microMoves: { heading: string; items: string[] };
  checklist: { heading: string; items: string[] };
  warnings: { heading: string; items: string[] };
  footer: string;
};

function buildContent(input: LearnerInput, rec: Recommendation, lang: Lang): PlanContent {
  const t: T = (en, es) => (lang === "es" ? es : en);
  const L = (x: { es: string; en: string }) => loc(x, lang);
  const primary = approachInfo(rec.primary, lang);
  const secondary = rec.secondary ? approachInfo(rec.secondary, lang) : null;
  const phases = buildPhases(input, rec.primary, t);
  const dur = durationLabel();
  const words = config.template.justificationWords;
  const platform = L(config.submissionPlatform);
  const unit = L(config.course.viewOfLanguageUnit);
  const blank = "_____________";

  const date = new Date().toLocaleDateString(lang === "es" ? "es-CO" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const topic = input.topic || t("[topic]", "[tema]");
  const context = input.ageContext || t("[describe your imagined learners]", "[describe a tus estudiantes]");
  const firstReason =
    rec.rationale[0] ??
    t(
      "it aligns the activity design with the communicative goal stated below",
      "alinea el diseño de la actividad con el objetivo comunicativo que se plantea abajo"
    );

  const course = [L(config.courseName), config.institutionName].filter(Boolean).join(" — ");

  const meta = [
    { label: t("Name", "Nombre"), value: input.studentName || blank },
    { label: t("Date", "Fecha"), value: date },
    ...(config.programName ? [{ label: t("Programme", "Programa"), value: L(config.programName) }] : []),
    { label: t("Course", "Curso"), value: course },
  ];

  const modality =
    input.modality === "virtual"
      ? t("Virtual (synchronous online)", "Virtual (sincrónica en línea)")
      : t("Face-to-face (in person)", "Presencial");

  const approachText =
    primary.name +
    (secondary ? t(` — with borrowed elements from ${secondary.name}`, ` — con elementos tomados de ${secondary.name}`) : "");

  const viewLabel = unit
    ? t(`View of language (${unit})`, `Visión de la lengua (${unit})`)
    : t("View of language", "Visión de la lengua");

  const refs = config.course.references;
  const refsText = refs.join("; ");

  const extraChecklist = config.course.extraChecklist.map(L);

  return {
    title: L(config.template.title),
    draftNote: t(
      `Generated draft — review, refine, and make it your own before submitting it on ${platform}.`,
      `Borrador generado — revísalo, ajústalo y hazlo tuyo antes de entregarlo en ${platform}.`
    ),
    meta,
    overview: {
      heading: L(config.template.sections.overview),
      items: [
        { label: t("Lesson topic", "Tema de la clase"), text: topic },
        {
          label: t("Imagined learner profile", "Perfil de los estudiantes"),
          text: t(`${input.level} level; ${context}.`, `Nivel ${input.level}; ${context}.`),
        },
        { label: t("Delivery mode", "Modalidad"), text: `${modality}.` },
        { label: t("Methodological approach", "Enfoque metodológico"), text: `${approachText}.` },
        { label: viewLabel, text: primary.viewOfLanguage },
        {
          label: t(
            "Post-method justification (after Kumaravadivelu, 2003)",
            "Justificación posmétodo (Kumaravadivelu, 2003)"
          ),
          text: t(
            `Following the post-method condition, this lesson is not built on a single prescribed method but on principled decisions for THIS context: ${input.level} learners working on "${topic}". ${primary.name} is appropriate because ${lowerFirst(firstReason)} Particularity, practicality, and possibility (Kumaravadivelu, 2003) are addressed by adapting the activity to the learners' level and the realistic ${dur} minute time frame.`,
            `Siguiendo la condición posmétodo, esta clase no se construye sobre un único método prescrito sino sobre decisiones con principios para ESTE contexto: estudiantes de nivel ${input.level} trabajando en "${topic}". ${primary.name} es pertinente porque ${lowerFirst(firstReason)} La particularidad, la practicidad y la posibilidad (Kumaravadivelu, 2003) se atienden adaptando la actividad al nivel de los estudiantes y al marco realista de ${dur} minutos.`
          ),
        },
      ],
    },
    objective: {
      heading: L(config.template.sections.objective),
      items: [
        {
          label: t("Communicative objective", "Objetivo comunicativo"),
          text: t(
            `By the end of this lesson, students will be able to ${input.desiredOutcome || "[complete the outcome you specified]"}.`,
            `Al final de esta clase, los estudiantes podrán ${input.desiredOutcome || "[completa el resultado que definiste]"}.`
          ),
        },
        {
          label: t("Language to be USED", "Lengua que se USARÁ"),
          text: t(
            `Functional exponents, lexical chunks, and grammar relevant to "${topic}". List 4–6 target chunks learners will actually produce.`,
            `Exponentes funcionales, expresiones léxicas y gramática relacionados con "${topic}". Enumera 4–6 expresiones que los estudiantes realmente producirán.`
          ),
        },
        {
          label: t("Materials / resources", "Materiales / recursos"),
          text: t(
            `${describeAnchor(input, t)}; whiteboard or shared slide for language frames; brief prompt cards if needed.`,
            `${describeAnchor(input, t)}; tablero o diapositiva compartida para los marcos de lengua; tarjetas breves si se necesitan.`
          ),
        },
      ],
    },
    procedure: {
      heading: L(config.template.sections.procedure),
      columns: [
        t("Phase", "Fase"),
        t("Time", "Tiempo"),
        t("Teacher does...", "El docente..."),
        t("Students do...", "Los estudiantes..."),
      ],
      phases: virtualAdapt(phases, input, t),
      totalLabel: `${dur} min`,
    },
    justification: {
      heading: `${L(config.template.sections.justification)} (${words.min}–${words.max} ${t("words", "palabras")})`,
      paragraph: t(
        `This micro-class draws on ${primary.name} because ${lowerFirst(firstReason)} ${rec.rationale.slice(1).join(" ")} The view of language underpinning the lesson — ${primary.viewOfLanguage.toLowerCase()} — shapes every phase: learners are not passive recipients of rules but active users of English for a real communicative purpose. Following Kumaravadivelu's (2003) post-method framework, this choice is justified by the particular learner profile (${input.level}, ${context}) and the constraints of the ${dur} minute format. Structural attention is preserved as a brief, principled form-focus moment — never as the spine of the lesson.`,
        `Esta microclase se apoya en ${primary.name} porque ${lowerFirst(firstReason)} ${rec.rationale.slice(1).join(" ")} La visión de la lengua que sustenta la clase — ${primary.viewOfLanguage.toLowerCase()} — orienta cada fase: los estudiantes no son receptores pasivos de reglas sino usuarios activos del inglés con un propósito comunicativo real. Siguiendo el marco posmétodo de Kumaravadivelu (2003), esta elección se justifica por el perfil particular de los estudiantes (${input.level}, ${context}) y las restricciones del formato de ${dur} minutos. La atención a la estructura se conserva como un momento breve y con principios de foco en la forma, nunca como la columna vertebral de la clase.`
      ),
      note: t(
        `✏️ Expand this paragraph to ${words.min}–${words.max} words in your own voice before submitting. Reference at least one course reading (e.g., ${refsText}).`,
        `✏️ Amplía este párrafo a ${words.min}–${words.max} palabras con tu propia voz antes de entregarlo. Cita al menos una lectura del curso (p. ej., ${refsText}).`
      ),
    },
    microMoves: {
      heading: t("Structural micro-moves embedded in your lesson", "Micro-movimientos estructurales integrados en tu clase"),
      items: rec.structuralMicroMoves,
    },
    checklist: {
      heading: t("Pre-delivery checklist", "Lista de verificación antes de dictar la clase"),
      items: [
        t("Clear COMMUNICATIVE (not just linguistic) objective.", "Objetivo COMUNICATIVO claro (no solo lingüístico)."),
        t("The chosen approach is VISIBLE in the activity, not just named.", "El enfoque elegido es VISIBLE en la actividad, no solo nombrado."),
        t(
          `Learners USE language — they don't just receive it. (Target: ${input.learnerProductionPct}% learner talk.)`,
          `Los estudiantes USAN la lengua, no solo la reciben. (Meta: ${input.learnerProductionPct}% de producción de los estudiantes.)`
        ),
        t("All materials prepared and tested.", "Todos los materiales preparados y probados."),
        t("I can explain WHY I chose this approach for THIS context.", "Puedo explicar POR QUÉ elegí este enfoque para ESTE contexto."),
        ...(unit
          ? [t(`Lesson connects to ${unit} (view of language).`, `La clase se conecta con la ${unit} (visión de la lengua).`)]
          : []),
        t(`Timed run-through fits ${dur} minutes.`, `El ensayo cronometrado cabe en ${dur} minutos.`),
        ...extraChecklist,
      ],
    },
    warnings: { heading: t("Warnings", "Advertencias"), items: rec.warnings },
    footer: t(
      `Generated draft — refine, add your own course references, and make it your own before submitting it on ${platform}.`,
      `Borrador generado — ajústalo, agrega tus propias referencias del curso y hazlo tuyo antes de entregarlo en ${platform}.`
    ),
  };
}

function lowerFirst(s: string): string {
  const trimmed = s.trim();
  const withDot = /[.!?]$/.test(trimmed) ? trimmed : trimmed + ".";
  // Keep acronyms (e.g. "NFA", "CLT") intact.
  if (/^[A-Z]{2,}/.test(withDot)) return withDot;
  return withDot.charAt(0).toLowerCase() + withDot.slice(1);
}

// --- Markdown --------------------------------------------------------------

export function buildLessonPlan(input: LearnerInput, rec: Recommendation, lang: Lang = "en"): string {
  const c = buildContent(input, rec, lang);
  const md = (s: string) => s.replace(/\|/g, "\\|");
  const items = (xs: { label: string; text: string }[]) =>
    xs.map((x) => `**${x.label}.** ${x.text}`).join("\n\n");

  return `# ${c.title}
*${c.draftNote}*

${c.meta.map((m) => `**${m.label}:** ${m.value}`).join("  \n")}

---

## ${c.overview.heading}

${items(c.overview.items)}

---

## ${c.objective.heading}

${items(c.objective.items)}

---

## ${c.procedure.heading}

| ${c.procedure.columns.join(" | ")} |
|---|---|---|---|
${c.procedure.phases
  .map((p) => `| **${md(p.name)}** | ${p.min} min | ${md(p.teacher)} | ${md(p.students)} |`)
  .join("\n")}
| **TOTAL** | ${c.procedure.totalLabel} | | |

---

## ${c.justification.heading}

${c.justification.paragraph}

> ${c.justification.note}

---

## ${c.microMoves.heading}

${c.microMoves.items.map((m) => `- ${m}`).join("\n")}

---

## ${c.checklist.heading}

${c.checklist.items.map((m) => `- [ ] ${m}`).join("\n")}
${c.warnings.items.length ? `\n\n## ⚠️ ${c.warnings.heading}\n\n` + c.warnings.items.map((w) => `- ${w}`).join("\n") : ""}
`;
}

// --- HTML (print) ----------------------------------------------------------

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function buildLessonPlanHTML(input: LearnerInput, rec: Recommendation, lang: Lang = "en"): string {
  const c = buildContent(input, rec, lang);
  const items = (xs: { label: string; text: string }[]) =>
    xs.map((x) => `<p><strong>${esc(x.label)}.</strong> ${esc(x.text)}</p>`).join("\n");

  return `
<header class="plan-header">
  <h1>${esc(c.title)}</h1>
  <p class="meta">${c.meta
    .map((m) => `<strong>${esc(m.label)}:</strong> ${esc(m.value)}`)
    .join(" &nbsp;·&nbsp; ")}</p>
</header>

<section>
  <h2>${esc(c.overview.heading)}</h2>
  ${items(c.overview.items)}
</section>

<section>
  <h2>${esc(c.objective.heading)}</h2>
  ${items(c.objective.items)}
</section>

<section>
  <h2>${esc(c.procedure.heading)}</h2>
  <table class="procedure">
    <thead><tr>${c.procedure.columns.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
    <tbody>
      ${c.procedure.phases
        .map(
          (p) => `<tr>
        <td><strong>${esc(p.name)}</strong></td>
        <td>${p.min} min</td>
        <td>${esc(p.teacher)}</td>
        <td>${esc(p.students)}</td>
      </tr>`
        )
        .join("")}
      <tr class="total"><td><strong>TOTAL</strong></td><td>${esc(c.procedure.totalLabel)}</td><td></td><td></td></tr>
    </tbody>
  </table>
</section>

<section>
  <h2>${esc(c.justification.heading)}</h2>
  <p>${esc(c.justification.paragraph)}</p>
  <p class="note">${esc(c.justification.note)}</p>
</section>

<section>
  <h2>${esc(c.microMoves.heading)}</h2>
  <ul>${c.microMoves.items.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
</section>

<section>
  <h2>${esc(c.checklist.heading)}</h2>
  <ul class="checklist">${c.checklist.items.map((m) => `<li>☐ ${esc(m)}</li>`).join("")}</ul>
</section>

${
  c.warnings.items.length
    ? `<section class="warnings">
        <h2>⚠ ${esc(c.warnings.heading)}</h2>
        <ul>${c.warnings.items.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
      </section>`
    : ""
}

<footer class="plan-footer">${esc(c.footer)}</footer>
`;
}

// --- Phases ----------------------------------------------------------------

function describeAnchor(input: LearnerInput, t: T): string {
  switch (input.anchor) {
    case "authentic_text":
      return t("Short authentic text (≤120 words) as the anchor", "Texto auténtico breve (≤120 palabras) como ancla");
    case "video_clip":
      return t("Short video clip (≤45 seconds) as the anchor", "Video corto (≤45 segundos) como ancla");
    case "image_data":
      return t("An image / infographic / data display as the anchor", "Una imagen / infografía / gráfico como ancla");
    case "scenario_cards":
      return t(
        "Scenario cards (one per pair) prompting target language use",
        "Tarjetas de escenario (una por pareja) que provocan el uso de la lengua meta"
      );
    case "none":
      return t(
        "Whiteboard / shared screen for prompts and language frames",
        "Tablero / pantalla compartida para consignas y marcos de lengua"
      );
  }
}

function virtualAdapt(phases: Phase[], input: LearnerInput, t: T): Phase[] {
  if (input.modality !== "virtual") return phases;
  const [opening, core, closing] = phases;
  return [
    {
      ...opening,
      teacher:
        opening.teacher +
        t(
          " Shares screen with the anchor slide; pins instructions in chat.",
          " Comparte pantalla con la diapositiva ancla; fija las instrucciones en el chat."
        ),
      students:
        opening.students +
        t(" React in chat; respond aloud when unmuted.", " Reaccionan en el chat; responden en voz alta al activar el micrófono."),
    },
    {
      ...core,
      teacher:
        core.teacher +
        t(
          " Opens breakout rooms (3–4 per room); drops a shared Google Doc / Jamboard link in chat; visits each room briefly.",
          " Abre salas (3–4 por sala); comparte en el chat un enlace a un documento colaborativo; visita brevemente cada sala."
        ),
      students:
        core.students +
        t(
          " Work in breakout rooms; record output in the shared doc; nominate one reporter.",
          " Trabajan en salas; registran el resultado en el documento compartido; eligen un relator."
        ),
    },
    {
      ...closing,
      teacher:
        closing.teacher +
        t(
          " Reconvenes the main room; shares the consolidated doc on screen; uses a chat poll to gauge confidence.",
          " Reúne a todos en la sala principal; comparte el documento consolidado; usa una encuesta en el chat para medir la confianza."
        ),
      students:
        closing.students +
        t(
          " Post one takeaway in chat (one word or chunk) as the wrap-up.",
          " Publican en el chat una idea clave (una palabra o expresión) como cierre."
        ),
    },
  ];
}

function buildPhases(input: LearnerInput, primary: ApproachKey, t: T): Phase[] {
  const names = [
    t("Opening & Context", "Apertura y contexto"),
    t("Core Activity", "Actividad central"),
    t("Closing & Feedback", "Cierre y retroalimentación"),
  ];
  const mins = [2, 7, 2];
  let p: [string, string][] = [];

  switch (primary) {
    case "NFA":
      p = [
        [
          t(
            "Asks a genuine framing question that creates a need for the target function (e.g., 'What do you say in English when you want a stranger to help you?'). Elicits ideas; introduces 3–4 functional exponents at different formality levels on the board.",
            "Plantea una pregunta genuina que crea la necesidad de la función meta (p. ej., 'What do you say in English when you want a stranger to help you?'). Recoge ideas; presenta en el tablero 3–4 exponentes funcionales con distintos niveles de formalidad."
          ),
          t("Brainstorm; notice and read the exponents aloud.", "Hacen lluvia de ideas; notan y leen en voz alta los exponentes."),
        ],
        [
          t(
            "Sets up a paired role-play: each pair gets a scenario card requiring the function. Monitors; takes notes on form for the closing.",
            "Organiza un juego de roles en parejas: cada pareja recibe una tarjeta de escenario que exige la función. Observa y toma notas sobre la forma para el cierre."
          ),
          t(
            "Work in pairs using the target exponents to complete each scenario, then swap roles.",
            "Trabajan en parejas usando los exponentes meta para resolver cada escenario y luego intercambian roles."
          ),
        ],
        [
          t(
            "Highlights one exponent or grammatical pattern that emerged; gives specific positive feedback; connects to real-world use.",
            "Destaca un exponente o patrón gramatical que surgió; da retroalimentación positiva específica; conecta con el uso real."
          ),
          t("Reflect briefly on what they would say in a real situation.", "Reflexionan brevemente sobre qué dirían en una situación real."),
        ],
      ];
      break;

    case "TBLT":
      p = [
        [
          t(
            "Sets a real-world scenario that requires English to solve (e.g., 'You have 5 minutes to plan a weekend trip together within a $50 budget'). Pre-teaches 4–5 useful chunks — no grammar lecture.",
            "Plantea un escenario real que requiere inglés para resolverse (p. ej., 'You have 5 minutes to plan a weekend trip together within a $50 budget'). Pre-enseña 4–5 expresiones útiles, sin cátedra de gramática."
          ),
          t("Listen; note the chunks; ask clarification questions.", "Escuchan; anotan las expresiones; hacen preguntas de aclaración."),
        ],
        [
          t(
            "Forms groups of 3–4. Gives the task with a clear concrete outcome. Monitors silently, notes language for later. Manages time strictly.",
            "Forma grupos de 3–4. Asigna la tarea con un resultado concreto y claro. Observa en silencio y anota lengua para después. Controla el tiempo estrictamente."
          ),
          t(
            "Negotiate, decide, and produce the outcome in English; one student records the group's decision.",
            "Negocian, deciden y producen el resultado en inglés; un estudiante registra la decisión del grupo."
          ),
        ],
        [
          t(
            "Asks each group to report briefly (30 sec); then surfaces ONE language point that came up; gives specific feedback.",
            "Pide a cada grupo un reporte breve (30 s); luego destaca UN punto de lengua que surgió; da retroalimentación específica."
          ),
          t("Report; notice the language point; reflect.", "Reportan; notan el punto de lengua; reflexionan."),
        ],
      ];
      break;

    case "CBI_CLIL":
      p = [
        [
          t(
            "Activates schemata with a hook image or headline tied to the content. Pre-teaches 4–5 key lexical items. States both the content goal AND the language goal.",
            "Activa conocimientos previos con una imagen o titular ligado al contenido. Pre-enseña 4–5 ítems léxicos clave. Presenta el objetivo de contenido Y el de lengua."
          ),
          t("Predict, share what they know about the topic.", "Predicen y comparten lo que saben del tema."),
        ],
        [
          t(
            "Sets a focused task on the anchor material (text/clip): comprehension question + discussion question requiring both content knowledge AND target language.",
            "Asigna una tarea focalizada sobre el material ancla (texto/video): pregunta de comprensión + pregunta de discusión que exigen conocimiento del contenido Y lengua meta."
          ),
          t(
            "Engage with the content individually, then discuss in pairs/small groups using English.",
            "Trabajan el contenido individualmente y luego discuten en parejas o grupos pequeños en inglés."
          ),
        ],
        [
          t(
            "Synthesises content takeaway; highlights one language pattern from the text; gives feedback.",
            "Sintetiza la idea clave del contenido; destaca un patrón de lengua del texto; da retroalimentación."
          ),
          t("Share one new content insight and one new language item.", "Comparten una idea nueva del contenido y un elemento nuevo de lengua."),
        ],
      ];
      break;

    case "CLT":
      p = [
        [
          t(
            "Poses a genuine question or dilemma that requires English to address. Provides minimal but sufficient language input (frames on the board).",
            "Plantea una pregunta o dilema genuino que requiere inglés para abordarse. Ofrece un input de lengua mínimo pero suficiente (marcos en el tablero)."
          ),
          t("React to the question; note the language frames.", "Reaccionan a la pregunta; anotan los marcos de lengua."),
        ],
        [
          t(
            "Sets up an interaction with a meaning-driven outcome (information gap, opinion exchange, problem-solving). Monitors; intervenes minimally.",
            "Organiza una interacción con un resultado guiado por el significado (vacío de información, intercambio de opiniones, solución de problemas). Observa; interviene lo mínimo."
          ),
          t(
            "Communicate in pairs/groups to reach a meaningful outcome; negotiate meaning.",
            "Se comunican en parejas o grupos para llegar a un resultado con sentido; negocian significado."
          ),
        ],
        [
          t(
            "Targeted feedback on a few salient errors; positive feedback on successful communication; connects to real use.",
            "Retroalimentación focalizada sobre algunos errores relevantes; refuerzo positivo de la comunicación lograda; conexión con el uso real."
          ),
          t(
            "Reflect on the interaction and one thing they would say differently next time.",
            "Reflexionan sobre la interacción y una cosa que dirían distinto la próxima vez."
          ),
        ],
      ];
      break;

    case "ECLECTIC":
      p = [
        [
          t(
            "Opens with a hook drawn from your secondary approach (e.g., authentic visual from CBI, or a genuine question from CLT). Frames the communicative goal.",
            "Abre con un gancho tomado del enfoque secundario (p. ej., un visual auténtico de CBI o una pregunta genuina de CLT). Enmarca el objetivo comunicativo."
          ),
          t("Engage with the hook; predict; receive minimal language input.", "Se enganchan; predicen; reciben un input de lengua mínimo."),
        ],
        [
          t(
            "Runs the core activity in your primary frame, but borrows ONE technique from the secondary (clearly identified in your justification).",
            "Desarrolla la actividad central en el marco principal, pero toma UNA técnica del secundario (identificada claramente en la justificación)."
          ),
          t("Use English actively to complete the activity.", "Usan el inglés activamente para completar la actividad."),
        ],
        [
          t("Form-focus on one item; feedback that links back to BOTH approaches.", "Foco en la forma de un elemento; retroalimentación que conecta con AMBOS enfoques."),
          t("Reflect on what they did with English.", "Reflexionan sobre lo que hicieron con el inglés."),
        ],
      ];
      break;
  }

  return p.map(([teacher, students], i) => ({ name: names[i], min: mins[i], teacher, students }));
}
