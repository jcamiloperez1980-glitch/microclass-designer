import { ApproachKey, LearnerInput } from "./types";

export type MaterialCard = {
  kind: "scenario" | "task" | "role" | "discussion" | "comprehension" | "frames" | "vocab";
  title: string;
  body: string; // plain text, line breaks allowed via \n
  footer?: string;
};

export type MaterialSet = {
  approach: ApproachKey;
  intro: string; // teacher-facing how-to-use note
  cards: MaterialCard[];
};

export function buildMaterials(input: LearnerInput, approach: ApproachKey): MaterialSet {
  const set = (() => {
    switch (approach) {
      case "NFA":
        return nfaSet(input);
      case "TBLT":
        return tbltSet(input);
      case "CBI_CLIL":
        return cbiSet(input);
      case "CLT":
        return cltSet(input);
      case "ECLECTIC":
        return tbltSet(input);
    }
  })();

  // For virtual classes, rewrite the teacher-facing intro and add a "digital handout" note
  if (input.modality === "virtual") {
    set.intro =
      "VIRTUAL DELIVERY — these card templates also work as digital slides or chat messages. " +
      "Suggested workflow: paste each card onto its own slide (or pin one in each breakout room's chat). " +
      "Share the language frames + vocabulary cards on a permanently visible slide. " +
      "If you still want to print, use them as your own teacher prompts.";
    set.cards.unshift({
      kind: "frames",
      title: "Virtual delivery — quick checklist",
      body:
        "Before class:\n" +
        "• One slide per scenario / task / discussion card.\n" +
        "• One slide with ALL language frames visible throughout.\n" +
        "• Pre-create breakout rooms (groups of 3–4).\n" +
        "• Share a Google Doc / Jamboard link in chat for collaborative output.\n\n" +
        "During class:\n" +
        "• Pin instructions in chat AND say them aloud.\n" +
        "• Visit each breakout room briefly.\n" +
        "• Use chat reactions or a quick poll to check comprehension.\n" +
        "• Keep one slide visible at all times — never go dark.",
      footer: "Teacher-facing cheat sheet · virtual mediation",
    });
  }

  return set;
}

// --- helpers ---------------------------------------------------------------

function framesCard(input: LearnerInput): MaterialCard {
  return {
    kind: "frames",
    title: "Language Frames",
    body:
      `Topic: ${input.topic || "[your topic]"}\n\n` +
      "Use these stems on the board or as a handout.\n" +
      "1. \"Could you _____, please?\"\n" +
      "2. \"I was wondering if _____.\"\n" +
      "3. \"Would it be possible to _____?\"\n" +
      "4. \"Do you mind if _____?\"\n\n" +
      "✏️ Replace these with the exponents for YOUR function.",
    footer: "Scaffolding card · keep visible during the activity",
  };
}

function vocabCard(input: LearnerInput): MaterialCard {
  return {
    kind: "vocab",
    title: "Vocabulary Bank",
    body:
      `Topic: ${input.topic || "[your topic]"}\n\n` +
      "Pre-teach 4–6 chunks BEFORE the activity.\n" +
      "• _____________________________\n" +
      "• _____________________________\n" +
      "• _____________________________\n" +
      "• _____________________________\n" +
      "• _____________________________\n" +
      "• _____________________________\n\n" +
      "✏️ Fill these with chunks specific to your lesson.",
    footer: "Scaffolding card · share at the start",
  };
}

// --- NFA -------------------------------------------------------------------

function nfaSet(input: LearnerInput): MaterialSet {
  const scenarios = [
    {
      title: "Scenario 1 — Hotel Reception",
      body:
        "You are checking into a hotel.\n\n" +
        "TASK: Make THREE polite requests appropriate for this setting.\n\n" +
        "Possible needs: a wake-up call, an extra pillow, the Wi-Fi password.",
    },
    {
      title: "Scenario 2 — In a Restaurant",
      body:
        "You are eating out with a friend.\n\n" +
        "TASK: Make THREE polite requests appropriate for this setting.\n\n" +
        "Possible needs: change the order, ask for the bill, ask for tap water.",
    },
    {
      title: "Scenario 3 — On the Phone",
      body:
        "You are calling customer service about a problem.\n\n" +
        "TASK: Make THREE polite requests appropriate for this setting.\n\n" +
        "Possible needs: speak to a manager, get a refund, repeat information.",
    },
    {
      title: "Scenario 4 — In a Meeting",
      body:
        "You are in a meeting at work.\n\n" +
        "TASK: Make THREE polite requests appropriate for this setting.\n\n" +
        "Possible needs: clarify a point, see the document, take a short break.",
    },
    {
      title: "Scenario 5 — Asking a Stranger",
      body:
        "You are lost in a new city.\n\n" +
        "TASK: Make THREE polite requests appropriate for this setting.\n\n" +
        "Possible needs: directions, the time, recommend somewhere to eat.",
    },
    {
      title: "Scenario 6 — In the Classroom",
      body:
        "You are a student in class with a question.\n\n" +
        "TASK: Make THREE polite requests appropriate for this setting.\n\n" +
        "Possible needs: repeat the explanation, extend a deadline, lend a pen.",
    },
  ];

  return {
    approach: "NFA",
    intro:
      "Cut along the dashed lines. Give ONE scenario card per pair. Pairs role-play, then swap. Adapt the scenarios to your specific function if it is not “polite requests”.",
    cards: [
      framesCard(input),
      ...scenarios.map<MaterialCard>((s) => ({
        kind: "scenario",
        title: s.title,
        body: s.body,
        footer: "Role-play card · 2–3 min per round",
      })),
      vocabCard(input),
    ],
  };
}

// --- TBLT ------------------------------------------------------------------

function tbltSet(input: LearnerInput): MaterialSet {
  const outcome = input.desiredOutcome || "complete the task using English";
  return {
    approach: "TBLT",
    intro:
      "Cut along the dashed lines. Give the Task Brief to every group. Give ONE role card per learner in each group of 3–4. The group must reach a single shared decision and report it.",
    cards: [
      {
        kind: "task",
        title: "Task Brief — for every group",
        body:
          `GOAL: ${outcome}.\n\n` +
          "TIME: 5 minutes.\n\n" +
          "RULES:\n" +
          "1. Speak only English.\n" +
          "2. Everyone in the group must contribute at least one idea.\n" +
          "3. The group reports ONE shared decision at the end.\n\n" +
          "✏️ Adapt the goal to your specific topic.",
        footer: "Hand out at the start of the task phase",
      },
      {
        kind: "role",
        title: "Role A — The Practical One",
        body:
          "Your priority is value for money.\n\n" +
          "You always ask: \"Is this really necessary?\"\n\n" +
          "Push the group toward the cheapest viable option.",
        footer: "Role card · keep secret from others",
      },
      {
        kind: "role",
        title: "Role B — The Adventurous One",
        body:
          "Your priority is doing something exciting.\n\n" +
          "You always ask: \"Why don't we try something new?\"\n\n" +
          "Push the group toward the most interesting option.",
        footer: "Role card · keep secret from others",
      },
      {
        kind: "role",
        title: "Role C — The Cautious One",
        body:
          "Your priority is avoiding risk.\n\n" +
          "You always ask: \"What could go wrong?\"\n\n" +
          "Push the group toward the safest option.",
        footer: "Role card · keep secret from others",
      },
      {
        kind: "role",
        title: "Role D — The Social One",
        body:
          "Your priority is keeping the group happy.\n\n" +
          "You always ask: \"What do YOU think?\"\n\n" +
          "Build consensus — get everyone's voice heard.",
        footer: "Role card · keep secret from others",
      },
      framesCard(input),
      vocabCard(input),
    ],
  };
}

// --- CBI / CLIL ------------------------------------------------------------

function cbiSet(input: LearnerInput): MaterialSet {
  return {
    approach: "CBI_CLIL",
    intro:
      "Print the anchor material (text/image/transcript) separately. Cut and distribute one comprehension card and one discussion card per pair. Bring the language frames card to the closing phase.",
    cards: [
      {
        kind: "comprehension",
        title: "Comprehension — Pair Task",
        body:
          `Anchor: ${input.topic || "[your text / clip / image]"}\n\n` +
          "1. What is the main idea?\n" +
          "2. Find ONE piece of evidence that supports it.\n" +
          "3. Find ONE word or phrase you didn't know — guess its meaning from context.\n\n" +
          "Be ready to share your answers with the class.",
        footer: "Content goal — meaning first",
      },
      {
        kind: "discussion",
        title: "Discussion — Your Reaction",
        body:
          "1. Do you agree with the author's main point? Why / why not?\n\n" +
          "2. How does this connect to your own experience or country?\n\n" +
          "3. What is ONE question you would ask the author?",
        footer: "Language goal — produce extended turns in English",
      },
      {
        kind: "discussion",
        title: "Discussion — Group Synthesis",
        body:
          "In your group, agree on:\n\n" +
          "• ONE thing you all learned about the content.\n\n" +
          "• ONE thing you still want to know.\n\n" +
          "• ONE new word or phrase you will try to use this week.",
        footer: "Closing card — for the report phase",
      },
      framesCard(input),
      vocabCard(input),
    ],
  };
}

// --- CLT -------------------------------------------------------------------

function cltSet(input: LearnerInput): MaterialSet {
  const outcome = input.desiredOutcome || "exchange opinions in English";
  return {
    approach: "CLT",
    intro:
      "Cut along the dashed lines. Distribute ONE discussion card per pair or small group. Each card creates a genuine reason to communicate. Adapt the prompts to YOUR topic.",
    cards: [
      {
        kind: "discussion",
        title: "Discussion 1 — Opinion Exchange",
        body:
          `Topic: ${input.topic || "[your topic]"}\n\n` +
          "Discuss with your partner:\n\n" +
          "1. What is your opinion?\n" +
          "2. What is one reason for it?\n" +
          "3. Find ONE thing you both agree on, and ONE thing you disagree about.",
        footer: "Pair card · 3 min",
      },
      {
        kind: "discussion",
        title: "Discussion 2 — Real Dilemma",
        body:
          "You and your partner must make a decision together.\n\n" +
          "Choose ONE of these dilemmas (or invent your own):\n\n" +
          "• Save money OR enjoy now?\n" +
          "• City life OR small town?\n" +
          "• Travel a lot OR build a home?\n\n" +
          `Connect your discussion to: ${outcome}.`,
        footer: "Pair card · 3 min",
      },
      {
        kind: "discussion",
        title: "Discussion 3 — Information Gap (Person A)",
        body:
          "You know: the cinema opens at 4pm, costs $8, and shows comedies.\n\n" +
          "You DON'T know: what's playing at the theatre.\n\n" +
          "Ask your partner questions in English to find out — DO NOT show this card.",
        footer: "Pair card · partner has the matching Person B card",
      },
      {
        kind: "discussion",
        title: "Discussion 3 — Information Gap (Person B)",
        body:
          "You know: the theatre opens at 6pm, costs $12, and shows a drama tonight.\n\n" +
          "You DON'T know: when the cinema opens or what it costs.\n\n" +
          "Ask your partner questions in English to find out — DO NOT show this card.",
        footer: "Pair card · partner has the matching Person A card",
      },
      framesCard(input),
      vocabCard(input),
    ],
  };
}

// --- HTML rendering for print ----------------------------------------------

export function renderMaterialsHTML(input: LearnerInput, set: MaterialSet): string {
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br/>");

  const cardHTML = set.cards
    .map(
      (c) => `
    <article class="cut-card kind-${c.kind}">
      <header><h3>${esc(c.title)}</h3></header>
      <div class="cut-card-body">${esc(c.body)}</div>
      ${c.footer ? `<footer>${esc(c.footer)}</footer>` : ""}
    </article>`
    )
    .join("");

  const modalityLabel =
    input.modality === "virtual" ? "Virtual class" : "Face-to-face class";
  const handlingHint =
    input.modality === "virtual"
      ? "💻 Use these as one slide per card, or pinned chat messages per breakout room."
      : "✂ Cut along the dashed lines. Cards are sized 2 × 3 per A4 page.";

  return `
<div class="materials-cover">
  <h1>Class Materials</h1>
  <p class="meta">For: ${esc(input.studentName || "_______")}
    &nbsp;·&nbsp; Topic: ${esc(input.topic) || "[topic]"}
    &nbsp;·&nbsp; Approach: ${esc(set.approach.replace("_", "/"))}
    &nbsp;·&nbsp; Mode: ${esc(modalityLabel)}</p>
  <p class="intro">${esc(set.intro)}</p>
  <p class="hint">${esc(handlingHint)}</p>
</div>
<div class="cut-grid">
  ${cardHTML}
</div>
`;
}
