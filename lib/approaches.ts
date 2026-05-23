import { ApproachKey } from "./types";

export const APPROACH_INFO: Record<
  ApproachKey,
  { name: string; tagline: string; viewOfLanguage: string; signatureMoves: string[] }
> = {
  CLT: {
    name: "Communicative Language Teaching (CLT)",
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
    tagline: "Organise the lesson around a function learners need.",
    viewOfLanguage: "Language as a set of functions for social purposes (request, apologise, recommend).",
    signatureMoves: [
      "Name the function explicitly — e.g., “making polite requests”.",
      "Present 3–4 exponents at different formality levels.",
      "Practise in a controlled mini-role-play, then in a freer one.",
    ],
  },
  ECLECTIC: {
    name: "Principled Eclecticism",
    tagline: "Combine two approaches, justified by your context.",
    viewOfLanguage: "Language is multi-faceted — different goals call for different lenses.",
    signatureMoves: [
      "Pick a primary frame (TBLT, CLT, CBI, or NFA) for the overall arc.",
      "Borrow one technique from a second approach for a specific phase.",
      "Justify the combination explicitly in your lesson plan.",
    ],
  },
};
