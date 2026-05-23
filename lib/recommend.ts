import { ApproachKey, LearnerInput, Recommendation } from "./types";

export function recommend(input: LearnerInput): Recommendation {
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
        "Your goal is a communicative function — NFA organises a lesson around exactly this."
      );
      break;
    case "task":
      scores.TBLT += 4;
      scores.CLT += 2;
      rationale.push(
        "Your goal is for learners to complete a real task — TBLT's pre-task / task / report cycle fits this."
      );
      break;
    case "discussion":
      scores.CLT += 4;
      scores.TBLT += 1;
      rationale.push(
        "Your goal is meaningful exchange — CLT centres on negotiation of meaning."
      );
      break;
    case "content":
      scores.CBI_CLIL += 4;
      scores.CLT += 1;
      rationale.push(
        "Your goal is engagement with real content — CBI/CLIL uses content as the anchor."
      );
      break;
    case "form":
      // Structural goal — push toward modern frames with a form-focus moment
      scores.TBLT += 2;
      scores.NFA += 2;
      warnings.push(
        "Form is the goal you stated — but a stand-alone grammar lesson is not what this assessment rewards. The recommendation below embeds form-focus inside a modern approach."
      );
      break;
  }

  // Anchor material
  if (input.anchor === "authentic_text" || input.anchor === "video_clip" || input.anchor === "image_data") {
    scores.CBI_CLIL += 3;
    scores.CLT += 1;
    rationale.push("You have authentic anchor material — that's the spine of CBI/CLIL.");
  } else if (input.anchor === "scenario_cards") {
    scores.NFA += 2;
    scores.TBLT += 1;
    rationale.push("Scenario cards support function-based role-play (NFA) or pre-task input (TBLT).");
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
  if (input.learnerProductionPct >= 60) {
    scores.CLT += 2;
    scores.TBLT += 2;
    rationale.push(
      `Learners produce ${input.learnerProductionPct}% of the time — strongly communicative.`
    );
  } else if (input.learnerProductionPct < 40) {
    warnings.push(
      `Learner production is only ${input.learnerProductionPct}% — the rubric penalises teacher-talk dominance. Aim for 50%+.`
    );
  }

  // Scaffolding need vs level
  const lowLevel = input.level === "A1" || input.level === "A2";
  if (lowLevel && input.scaffoldingNeed === "low") {
    warnings.push(
      "A1/A2 learners almost always need explicit scaffolding (models, language frames, vocabulary support). Reconsider “low”."
    );
  }
  if (lowLevel && input.goalType === "discussion") {
    warnings.push(
      "Open discussion is hard at A1/A2 without heavy scaffolding — consider a task with a concrete outcome instead (TBLT-style)."
    );
  }

  // Real concrete outcome → TBLT bonus
  if (input.hasRealOutcome) {
    scores.TBLT += 2;
    rationale.push("Your lesson produces a concrete outcome — a hallmark of TBLT.");
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
      `Two approaches scored almost identically (${primary} ${scores[primary]} vs ${second} ${scores[second]}) — a principled combination is justified. Use ${primary} as the frame and borrow from ${second}.`
    );
  } else if (gap <= 2 && scores[second] >= 4) {
    finalSecondary = second;
  }

  // Structural micro-moves — never the main frame, only support
  const structuralMicroMoves = buildStructuralMicroMoves(input, finalPrimary);

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

  const candidates = top.map((k): import("./types").Candidate => ({
    approach: k,
    score: k === "ECLECTIC" ? scores.ECLECTIC : scores[k],
    rationale: rationaleFor(input, k),
    structuralMicroMoves: buildStructuralMicroMoves(input, k),
  }));

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

function rationaleFor(input: LearnerInput, k: ApproachKey): string[] {
  const r: string[] = [];
  switch (k) {
    case "NFA":
      r.push("Organises your lesson around the communicative function learners need.");
      r.push("Strong fit when the goal is naming WHAT learners must do with English (apologise, request, recommend).");
      break;
    case "TBLT":
      r.push("Drives learners to use English to complete a concrete task with a real outcome.");
      r.push("Built-in form-focus moment after the task keeps grammar principled, not central.");
      break;
    case "CBI_CLIL":
      r.push("Uses real content (text, clip, image) as the lesson's spine.");
      r.push("Pairs a content goal with a language goal — meaning leads, language follows.");
      break;
    case "CLT":
      r.push("Centres the lesson on a meaningful exchange where learners negotiate meaning.");
      r.push("Flexible — works across many topics when interaction is the heart of the lesson.");
      break;
    case "ECLECTIC":
      r.push("Combines two approaches with explicit justification for each element.");
      r.push("Use only when you can name WHY each borrowed element serves your learners.");
      break;
  }
  if (input.hasRealOutcome && k === "TBLT") {
    r.push("Your concrete outcome makes this an especially natural fit.");
  }
  if (input.anchor !== "none" && input.anchor !== "scenario_cards" && k === "CBI_CLIL") {
    r.push("Your anchor material is already content-based — half the design work is done.");
  }
  return r;
}

function buildStructuralMicroMoves(input: LearnerInput, primary: ApproachKey): string[] {
  const moves: string[] = [];
  if (input.skillFocus === "grammar_function" || input.goalType === "form") {
    moves.push(
      "Reserve 60–90 seconds for a focus-on-form moment — surface ONE structure that emerged in learners' production, board it, then return to use."
    );
  }
  if (input.level === "A1" || input.level === "A2") {
    moves.push(
      "Provide a language frame / sentence stem on the board or a slide (e.g., 'Could you ___, please?'). Drill it briefly (3–5 chorus repetitions) before learners use it — this is a structural micro-move INSIDE your communicative frame, not a separate grammar lesson."
    );
  }
  if (primary === "CBI_CLIL") {
    moves.push(
      "Pre-teach 3–5 lexical chunks from the text before reading — this is a structural support, not the lesson itself."
    );
  }
  if (primary === "TBLT") {
    moves.push(
      "After the task report, do a short language focus on one form learners struggled with — this is TBLT's principled use of structural attention."
    );
  }
  if (moves.length === 0) {
    moves.push(
      "Optional structural micro-move: at closing, highlight ONE language point that emerged naturally during the activity. Keep it under 90 seconds."
    );
  }
  return moves;
}
