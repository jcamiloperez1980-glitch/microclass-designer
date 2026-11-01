import { Lang } from "@/config";
import { ApproachKey, Candidate, LearnerInput, Recommendation } from "./types";

type T = (en: string, es: string) => string;
const translator = (lang: Lang): T => (en, es) => (lang === "es" ? es : en);

export function recommend(input: LearnerInput, lang: Lang = "en"): Recommendation {
  const t = translator(lang);
  const scores: Record<ApproachKey, number> = {
    CLT: 0,
    TBLT: 0,
    CBI_CLIL: 0,
    NFA: 0,
    ECLECTIC: 0,
  };
  const rationale: string[] = [];
  const warnings: string[] = [];

  // Goal type — strongest signal
  switch (input.goalType) {
    case "function":
      scores.NFA += 4;
      scores.CLT += 2;
      rationale.push(
        t(
          "Your goal is a communicative function — NFA organises a lesson around exactly this.",
          "Tu objetivo es una función comunicativa: el NFA organiza la clase justamente alrededor de esto."
        )
      );
      break;
    case "task":
      scores.TBLT += 4;
      scores.CLT += 2;
      rationale.push(
        t(
          "Your goal is for learners to complete a real task — TBLT's pre-task / task / report cycle fits this.",
          "Tu objetivo es que los estudiantes completen una tarea real: el ciclo pre-tarea / tarea / reporte de TBLT encaja."
        )
      );
      break;
    case "discussion":
      scores.CLT += 4;
      scores.TBLT += 1;
      rationale.push(
        t(
          "Your goal is meaningful exchange — CLT centres on negotiation of meaning.",
          "Tu objetivo es un intercambio con sentido: el CLT se centra en la negociación de significado."
        )
      );
      break;
    case "content":
      scores.CBI_CLIL += 4;
      scores.CLT += 1;
      rationale.push(
        t(
          "Your goal is engagement with real content — CBI/CLIL uses content as the anchor.",
          "Tu objetivo es trabajar con contenido real: CBI/CLIL usa el contenido como ancla."
        )
      );
      break;
    case "form":
      // Structural goal — push toward modern frames with a form-focus moment
      scores.TBLT += 2;
      scores.NFA += 2;
      warnings.push(
        t(
          "Form is the goal you stated — but a stand-alone grammar lesson is not what this assessment rewards. The recommendation below embeds form-focus inside a modern approach.",
          "Declaraste la forma como objetivo, pero una clase de gramática aislada no es lo que esta evaluación premia. La recomendación integra el foco en la forma dentro de un enfoque moderno."
        )
      );
      break;
  }

  // Anchor material
  if (
    input.anchor === "authentic_text" ||
    input.anchor === "video_clip" ||
    input.anchor === "image_data"
  ) {
    scores.CBI_CLIL += 3;
    scores.CLT += 1;
    rationale.push(
      t(
        "You have authentic anchor material — that's the spine of CBI/CLIL.",
        "Tienes material auténtico como ancla: esa es la columna vertebral de CBI/CLIL."
      )
    );
  } else if (input.anchor === "scenario_cards") {
    scores.NFA += 2;
    scores.TBLT += 1;
    rationale.push(
      t(
        "Scenario cards support function-based role-play (NFA) or pre-task input (TBLT).",
        "Las tarjetas de escenario apoyan el juego de roles por funciones (NFA) o el input de pre-tarea (TBLT)."
      )
    );
  }

  // Skill focus
  switch (input.skillFocus) {
    case "grammar_function":
      scores.NFA += 2;
      break;
    case "vocabulary":
      scores.CBI_CLIL += 1;
      scores.CLT += 1;
      break;
    case "oral":
      scores.CLT += 2;
      scores.TBLT += 2;
      scores.NFA += 1;
      break;
    case "reading_listening":
      scores.CBI_CLIL += 3;
      break;
    case "writing":
      scores.TBLT += 2;
      scores.CBI_CLIL += 1;
      break;
  }

  // Learner production %
  const pct = input.learnerProductionPct;
  if (pct >= 60) {
    scores.CLT += 2;
    scores.TBLT += 2;
    rationale.push(
      t(
        `Learners produce ${pct}% of the time — strongly communicative.`,
        `Los estudiantes producen el ${pct}% del tiempo: fuertemente comunicativo.`
      )
    );
  } else if (pct < 40) {
    warnings.push(
      t(
        `Learner production is only ${pct}% — the rubric penalises teacher-talk dominance. Aim for 50%+.`,
        `La producción de los estudiantes es solo del ${pct}%: la rúbrica penaliza que hable más el docente. Apunta a 50% o más.`
      )
    );
  }

  // Scaffolding need vs level
  const lowLevel = input.level === "A1" || input.level === "A2";
  if (lowLevel && input.scaffoldingNeed === "low") {
    warnings.push(
      t(
        "A1/A2 learners almost always need explicit scaffolding (models, language frames, vocabulary support). Reconsider “low”.",
        "Los estudiantes A1/A2 casi siempre necesitan andamiaje explícito (modelos, marcos de lengua, apoyo de vocabulario). Reconsidera “bajo”."
      )
    );
  }
  if (lowLevel && input.goalType === "discussion") {
    warnings.push(
      t(
        "Open discussion is hard at A1/A2 without heavy scaffolding — consider a task with a concrete outcome instead (TBLT-style).",
        "La discusión abierta es difícil en A1/A2 sin mucho andamiaje: considera una tarea con un resultado concreto (estilo TBLT)."
      )
    );
  }

  // Real concrete outcome → TBLT bonus
  if (input.hasRealOutcome) {
    scores.TBLT += 2;
    rationale.push(
      t(
        "Your lesson produces a concrete outcome — a hallmark of TBLT.",
        "Tu clase produce un resultado concreto: un sello distintivo de TBLT."
      )
    );
  }

  // Modality effects — virtual changes what works
  if (input.modality === "virtual") {
    // CBI/CLIL plays to virtual strengths (screen share, shared text, video)
    scores.CBI_CLIL += 2;
    // TBLT works well with breakout rooms + collaborative docs
    scores.TBLT += 1;
    rationale.push(
      t(
        "Virtual mediation favours screen-shareable anchor material and breakout-room collaboration — CBI/CLIL and TBLT adapt most naturally.",
        "La mediación virtual favorece material ancla que se pueda compartir en pantalla y la colaboración en salas: CBI/CLIL y TBLT se adaptan con más naturalidad."
      )
    );
    if (input.anchor === "scenario_cards") {
      warnings.push(
        t(
          "You picked physical scenario cards but the class is virtual. Convert them to slides, a shared doc, or pinned chat messages — one scenario per breakout room.",
          "Elegiste tarjetas físicas, pero la clase es virtual. Conviértelas en diapositivas, un documento compartido o mensajes fijados en el chat: un escenario por sala."
        )
      );
    }
    if (pct >= 60 && input.level === "A1") {
      warnings.push(
        t(
          "High learner production in a virtual A1 class is hard — chat-based scaffolding and a visible language frame on every slide help a lot.",
          "Una alta producción en una clase virtual A1 es difícil: el andamiaje por chat y un marco de lengua visible en cada diapositiva ayudan mucho."
        )
      );
    }
  }

  // Pick primary & secondary
  const ordered = (Object.keys(scores) as ApproachKey[])
    .filter((k) => k !== "ECLECTIC")
    .sort((a, b) => scores[b] - scores[a]);

  const primary = ordered[0];
  const second = ordered[1];
  const gap = scores[primary] - scores[second];

  // Eclectic only if top two are close AND both reach a meaningful score
  let finalPrimary: ApproachKey = primary;
  let finalSecondary: ApproachKey | undefined = undefined;
  if (gap <= 1 && scores[primary] >= 4 && scores[second] >= 4) {
    finalPrimary = "ECLECTIC";
    finalSecondary = primary;
    scores.ECLECTIC = scores[primary] + 1;
    rationale.push(
      t(
        `Two approaches scored almost identically (${primary} ${scores[primary]} vs ${second} ${scores[second]}) — a principled combination is justified. Use ${primary} as the frame and borrow from ${second}.`,
        `Dos enfoques obtuvieron puntajes casi idénticos (${primary} ${scores[primary]} vs ${second} ${scores[second]}): se justifica una combinación con principios. Usa ${primary} como marco y toma elementos de ${second}.`
      )
    );
  } else if (gap <= 2 && scores[second] >= 4) {
    finalSecondary = second;
  }

  // Structural micro-moves — never the main frame, only support
  const structuralMicroMoves = buildStructuralMicroMoves(input, finalPrimary, t);

  // Top-2 candidates for the teacher to choose between.
  // Always offer two distinct approaches — never two flavours of the same one.
  const top: ApproachKey[] = [finalPrimary];
  for (const k of ordered) {
    if (top.length >= 2) break;
    if (k !== finalPrimary && k !== finalSecondary) top.push(k);
    else if (k !== finalPrimary && top.length === 1) top.push(k);
  }
  if (top.length < 2) {
    for (const k of ordered) {
      if (top.length >= 2) break;
      if (!top.includes(k)) top.push(k);
    }
  }

  const candidates = top.map(
    (k): Candidate => ({
      approach: k,
      score: k === "ECLECTIC" ? scores.ECLECTIC : scores[k],
      rationale: rationaleFor(input, k, t),
      structuralMicroMoves: buildStructuralMicroMoves(input, k, t),
    })
  );

  return {
    primary: finalPrimary,
    secondary: finalSecondary,
    scores,
    rationale,
    structuralMicroMoves,
    warnings,
    candidates,
  };
}

/** Re-centre a recommendation on the approach the student picked. */
export function applyChoice(rec: Recommendation, chosen: ApproachKey | null): Recommendation {
  if (!chosen) return rec;
  const chosenCandidate = rec.candidates.find((c) => c.approach === chosen);
  return {
    ...rec,
    primary: chosen,
    secondary: rec.candidates.find((c) => c.approach !== chosen)?.approach,
    rationale: chosenCandidate?.rationale ?? rec.rationale,
    structuralMicroMoves: chosenCandidate?.structuralMicroMoves ?? rec.structuralMicroMoves,
  };
}

function rationaleFor(input: LearnerInput, k: ApproachKey, t: T): string[] {
  const r: string[] = [];
  switch (k) {
    case "NFA":
      r.push(
        t(
          "It organises your lesson around the communicative function learners need.",
          "Organiza tu clase alrededor de la función comunicativa que los estudiantes necesitan."
        )
      );
      r.push(
        t(
          "Strong fit when the goal is naming WHAT learners must do with English (apologise, request, recommend).",
          "Encaja muy bien cuando el objetivo es nombrar QUÉ deben hacer los estudiantes con el inglés (disculparse, pedir, recomendar)."
        )
      );
      break;
    case "TBLT":
      r.push(
        t(
          "It drives learners to use English to complete a concrete task with a real outcome.",
          "Lleva a los estudiantes a usar el inglés para completar una tarea concreta con un resultado real."
        )
      );
      r.push(
        t(
          "Built-in form-focus moment after the task keeps grammar principled, not central.",
          "El momento de foco en la forma después de la tarea mantiene la gramática con principios, no en el centro."
        )
      );
      break;
    case "CBI_CLIL":
      r.push(
        t(
          "It uses real content (text, clip, image) as the lesson's spine.",
          "Usa contenido real (texto, video, imagen) como columna vertebral de la clase."
        )
      );
      r.push(
        t(
          "Pairs a content goal with a language goal — meaning leads, language follows.",
          "Combina un objetivo de contenido con uno de lengua: el significado guía y la lengua lo acompaña."
        )
      );
      break;
    case "CLT":
      r.push(
        t(
          "It centres the lesson on a meaningful exchange where learners negotiate meaning.",
          "Centra la clase en un intercambio con sentido donde los estudiantes negocian significado."
        )
      );
      r.push(
        t(
          "Flexible — works across many topics when interaction is the heart of the lesson.",
          "Flexible: funciona con muchos temas cuando la interacción es el corazón de la clase."
        )
      );
      break;
    case "ECLECTIC":
      r.push(
        t(
          "It combines two approaches with explicit justification for each element.",
          "Combina dos enfoques con una justificación explícita para cada elemento."
        )
      );
      r.push(
        t(
          "Use only when you can name WHY each borrowed element serves your learners.",
          "Úsalo solo si puedes explicar POR QUÉ cada elemento prestado sirve a tus estudiantes."
        )
      );
      break;
  }
  if (input.hasRealOutcome && k === "TBLT") {
    r.push(
      t(
        "Your concrete outcome makes this an especially natural fit.",
        "Tu resultado concreto hace que este enfoque encaje de forma especialmente natural."
      )
    );
  }
  if (input.anchor !== "none" && input.anchor !== "scenario_cards" && k === "CBI_CLIL") {
    r.push(
      t(
        "Your anchor material is already content-based — half the design work is done.",
        "Tu material ancla ya está basado en contenido: la mitad del diseño está hecha."
      )
    );
  }
  return r;
}

function buildStructuralMicroMoves(input: LearnerInput, primary: ApproachKey, t: T): string[] {
  const moves: string[] = [];
  if (input.modality === "virtual") {
    moves.push(
      t(
        "Virtual mediation move: keep the language frame visible on every shared slide — learners can't glance at a wall poster. Use the chat as a low-stakes backchannel for shy learners.",
        "Movimiento de mediación virtual: mantén el marco de lengua visible en cada diapositiva compartida; los estudiantes no pueden mirar un cartel en la pared. Usa el chat como canal de bajo riesgo para estudiantes tímidos."
      )
    );
    if (primary === "TBLT" || primary === "CLT" || primary === "NFA") {
      moves.push(
        t(
          "Use breakout rooms (3–4 learners) for the core activity. Drop a shared Google Doc / Jamboard link in chat so the group can co-write or record decisions visibly.",
          "Usa salas (3–4 estudiantes) para la actividad central. Comparte en el chat un enlace a un documento o pizarra colaborativa para que el grupo co-escriba o registre sus decisiones."
        )
      );
    }
    if (primary === "CBI_CLIL") {
      moves.push(
        t(
          "Share the anchor text/clip on screen; pause the video on key moments and use a quick chat poll or reaction to check comprehension.",
          "Comparte el texto/video ancla en pantalla; pausa en momentos clave y usa una encuesta rápida o reacciones en el chat para verificar la comprensión."
        )
      );
    }
    if (primary === "NFA") {
      moves.push(
        t(
          "Pin one scenario per breakout room in the chat. Pre-record a 20-sec model exchange you can replay if a room gets stuck.",
          "Fija un escenario por sala en el chat. Graba un intercambio modelo de 20 s que puedas reproducir si una sala se atasca."
        )
      );
    }
  }
  if (input.skillFocus === "grammar_function" || input.goalType === "form") {
    moves.push(
      t(
        "Reserve 60–90 seconds for a focus-on-form moment — surface ONE structure that emerged in learners' production, board it, then return to use.",
        "Reserva 60–90 segundos para un momento de foco en la forma: destaca UNA estructura que surgió en la producción, escríbela en el tablero y vuelve al uso."
      )
    );
  }
  if (input.level === "A1" || input.level === "A2") {
    moves.push(
      t(
        "Provide a language frame / sentence stem on the board or a slide (e.g., 'Could you ___, please?'). Drill it briefly (3–5 chorus repetitions) before learners use it — this is a structural micro-move INSIDE your communicative frame, not a separate grammar lesson.",
        "Ofrece un marco de lengua / inicio de oración en el tablero o una diapositiva (p. ej., 'Could you ___, please?'). Practícalo brevemente (3–5 repeticiones en coro) antes de usarlo: es un micro-movimiento estructural DENTRO de tu marco comunicativo, no una clase de gramática aparte."
      )
    );
  }
  if (primary === "CBI_CLIL") {
    moves.push(
      t(
        "Pre-teach 3–5 lexical chunks from the text before reading — this is a structural support, not the lesson itself.",
        "Pre-enseña 3–5 expresiones léxicas del texto antes de leer: es un apoyo estructural, no la clase en sí."
      )
    );
  }
  if (primary === "TBLT") {
    moves.push(
      t(
        "After the task report, do a short language focus on one form learners struggled with — this is TBLT's principled use of structural attention.",
        "Después del reporte de la tarea, haz un breve foco en una forma que les costó a los estudiantes: es el uso con principios de la atención estructural en TBLT."
      )
    );
  }
  if (moves.length === 0) {
    moves.push(
      t(
        "Optional structural micro-move: at closing, highlight ONE language point that emerged naturally during the activity. Keep it under 90 seconds.",
        "Micro-movimiento estructural opcional: al cierre, destaca UN punto de lengua que surgió naturalmente durante la actividad. Menos de 90 segundos."
      )
    );
  }
  return moves;
}
