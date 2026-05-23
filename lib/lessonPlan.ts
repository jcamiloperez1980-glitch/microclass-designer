import { APPROACH_INFO } from "./approaches";
import { ApproachKey, LearnerInput, Recommendation } from "./types";

export function buildLessonPlan(input: LearnerInput, rec: Recommendation): string {
  const primary = APPROACH_INFO[rec.primary];
  const secondary = rec.secondary ? APPROACH_INFO[rec.secondary] : null;

  const phases = buildPhases(input, rec.primary);

  return `# Micro-Class Lesson Plan
*Generated draft — review, refine, and make it your own before uploading to Moodle.*

**Name:** ${input.studentName || "_____________"}
**Date:** ${new Date().toLocaleDateString("en-US")}
**Course:** Approaches and Methods in Language Teaching I — UNIMINUTO

---

## Section 1 — Lesson Overview

**Lesson topic.** ${input.topic}

**Imagined learner profile.** ${input.level} level; ${input.ageContext}.

**Methodological approach.** ${primary.name}${
    secondary ? ` — with borrowed elements from ${secondary.name}` : ""
  }.

**View of language (Unit 1).** ${primary.viewOfLanguage}

**Post-method justification (after Kumaravadivelu, 2003).** Following the post-method condition,
this lesson is not built on a single prescribed method but on principled decisions for THIS
context: ${input.level} learners working on "${input.topic}". ${primary.name} is appropriate
because ${rec.rationale[0] ?? "it aligns the activity design with the communicative goal stated below"}.
Particularity, practicality, and possibility (Kumaravadivelu, 2003) are addressed by adapting the
activity to the learners' level and the realistic 10–12 minute time frame.

---

## Section 2 — Learning Objective

**Communicative objective.** By the end of this lesson, students will be able to ${
    input.desiredOutcome || "[complete the outcome you specified]"
  }.

**Language to be USED.** Functional exponents, lexical chunks, and grammar relevant to "${input.topic}".
Be specific in your final version — list 4–6 target chunks learners will actually produce.

**Materials / resources.** ${describeAnchor(input)}; whiteboard or shared slide for language frames; brief prompt cards if needed.

---

## Section 3 — Lesson Procedure

| Phase | Time | Teacher does... | Students do... |
|---|---|---|---|
| **Opening & Context** | ${phases.openingMin} min | ${phases.openingTeacher} | ${phases.openingStudents} |
| **Core Activity** | ${phases.coreMin} min | ${phases.coreTeacher} | ${phases.coreStudents} |
| **Closing & Feedback** | ${phases.closingMin} min | ${phases.closingTeacher} | ${phases.closingStudents} |
| **TOTAL** | 10–12 min | | |

---

## Section 4 — Methodological Justification (100–150 words)

This micro-class draws on **${primary.name}** because ${rec.rationale[0] ?? "the activity centres on meaningful language use"}.
${rec.rationale.slice(1).join(" ")}
The view of language underpinning the lesson — ${primary.viewOfLanguage.toLowerCase()} —
shapes every phase: learners are not passive recipients of rules but active users of English for
a real communicative purpose. Following Kumaravadivelu's (2003) post-method framework, this choice
is justified by the particular learner profile (${input.level}, ${input.ageContext}) and the
constraints of the 10–12 minute format. Structural attention is preserved as a brief, principled
form-focus moment — never as the spine of the lesson.

> ✏️ Expand this paragraph to 100–150 words in your own voice before submitting. Reference one course
> reading (e.g., Richards & Rodgers, 2014; Kumaravadivelu, 2003; Nunan, 2004 for TBLT; Brinton, Snow
> & Wesche for CBI; Wilkins, 1976 for NFA).

---

## Structural micro-moves embedded in your lesson

${rec.structuralMicroMoves.map((m) => `- ${m}`).join("\n")}

---

## Pre-delivery checklist

- [ ] Clear COMMUNICATIVE (not just linguistic) objective.
- [ ] The chosen approach is VISIBLE in the activity, not just named.
- [ ] Learners USE language — they don't just receive it. (Target: ${input.learnerProductionPct}% learner talk.)
- [ ] All materials prepared and tested.
- [ ] I can explain WHY I chose this approach for THIS context.
- [ ] Lesson connects to Unit 1 (view of language).
- [ ] Timed run-through fits 10–12 minutes.
${rec.warnings.length ? "\n\n## ⚠️ Warnings\n\n" + rec.warnings.map((w) => `- ${w}`).join("\n") : ""}
`;
}

function describeAnchor(input: LearnerInput): string {
  switch (input.anchor) {
    case "authentic_text":
      return "Short authentic text (≤120 words) as the anchor";
    case "video_clip":
      return "Short video clip (≤45 seconds) as the anchor";
    case "image_data":
      return "An image / infographic / data display as the anchor";
    case "scenario_cards":
      return "Scenario cards (one per pair) prompting target language use";
    case "none":
      return "Whiteboard / shared screen for prompts and language frames";
  }
}

function buildPhases(input: LearnerInput, primary: ApproachKey) {
  const base = {
    openingMin: 2,
    coreMin: 7,
    closingMin: 2,
    openingTeacher: "",
    openingStudents: "",
    coreTeacher: "",
    coreStudents: "",
    closingTeacher: "",
    closingStudents: "",
  };

  switch (primary) {
    case "NFA":
      base.openingTeacher =
        "Asks a genuine framing question that creates a need for the target function (e.g., 'What do you say in English when you want a stranger to help you?'). Elicits ideas; introduces 3–4 functional exponents at different formality levels on the board.";
      base.openingStudents = "Brainstorm; notice and read the exponents aloud.";
      base.coreTeacher =
        "Sets up a paired role-play: each pair gets a scenario card requiring the function. Monitors; takes notes on form for the closing.";
      base.coreStudents = "Work in pairs using the target exponents to complete each scenario, then swap roles.";
      base.closingTeacher =
        "Highlights one exponent or grammatical pattern that emerged; gives specific positive feedback; connects to real-world use.";
      base.closingStudents = "Reflect briefly on what they would say in a real situation.";
      break;

    case "TBLT":
      base.openingMin = 2;
      base.openingTeacher =
        "Sets a real-world scenario that requires English to solve (e.g., 'You have 5 minutes to plan a weekend trip together within a $50 budget'). Pre-teaches 4–5 useful chunks — no grammar lecture.";
      base.openingStudents = "Listen; note the chunks; ask clarification questions.";
      base.coreTeacher =
        "Forms groups of 3–4. Gives the task with a clear concrete outcome. Monitors silently, notes language for later. Manages time strictly.";
      base.coreStudents = "Negotiate, decide, and produce the outcome in English; one student records the group's decision.";
      base.closingTeacher =
        "Asks each group to report briefly (30 sec); then surfaces ONE language point that came up; gives specific feedback.";
      base.closingStudents = "Report; notice the language point; reflect.";
      break;

    case "CBI_CLIL":
      base.openingTeacher =
        "Activates schemata with a hook image or headline tied to the content. Pre-teaches 4–5 key lexical items. States both the content goal AND the language goal.";
      base.openingStudents = "Predict, share what they know about the topic.";
      base.coreTeacher =
        "Sets a focused task on the anchor material (text/clip): comprehension question + discussion question requiring both content knowledge AND target language.";
      base.coreStudents = "Engage with the content individually, then discuss in pairs/small groups using English.";
      base.closingTeacher =
        "Synthesises content takeaway; highlights one language pattern from the text; gives feedback.";
      base.closingStudents = "Share one new content insight and one new language item.";
      break;

    case "CLT":
      base.openingTeacher =
        "Poses a genuine question or dilemma that requires English to address. Provides minimal but sufficient language input (frames on the board).";
      base.openingStudents = "React to the question; note the language frames.";
      base.coreTeacher =
        "Sets up an interaction with a meaning-driven outcome (information gap, opinion exchange, problem-solving). Monitors; intervenes minimally.";
      base.coreStudents = "Communicate in pairs/groups to reach a meaningful outcome; negotiate meaning.";
      base.closingTeacher =
        "Targeted feedback on a few salient errors; positive feedback on successful communication; connects to real use.";
      base.closingStudents = "Reflect on the interaction and one thing they would say differently next time.";
      break;

    case "ECLECTIC":
      base.openingTeacher =
        "Opens with a hook drawn from your secondary approach (e.g., authentic visual from CBI, or a genuine question from CLT). Frames the communicative goal.";
      base.openingStudents = "Engage with the hook; predict; receive minimal language input.";
      base.coreTeacher =
        "Runs the core activity in your primary frame, but borrows ONE technique from the secondary (clearly identified in your justification).";
      base.coreStudents = "Use English actively to complete the activity.";
      base.closingTeacher =
        "Form-focus on one item; feedback that links back to BOTH approaches.";
      base.closingStudents = "Reflect on what they did with English.";
      break;
  }

  return base;
}
