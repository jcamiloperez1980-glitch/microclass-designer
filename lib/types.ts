export type Level = "A1" | "A2" | "B1" | "B2";

export type SkillFocus =
  | "grammar_function"
  | "vocabulary"
  | "oral"
  | "reading_listening"
  | "writing";

export type GoalType =
  | "function" // apologise, request, recommend
  | "task" // solve a problem, produce an outcome
  | "discussion" // exchange opinions / negotiate meaning
  | "content" // engage with a text/clip/data
  | "form"; // notice / use a structure

export type AnchorMaterial =
  | "authentic_text"
  | "video_clip"
  | "image_data"
  | "scenario_cards"
  | "none";

export type Modality = "face_to_face" | "virtual";

export type LearnerInput = {
  studentName: string;
  level: Level;
  ageContext: string; // "university adults", "teens at language institute" ...
  modality: Modality;
  topic: string;
  skillFocus: SkillFocus;
  goalType: GoalType;
  desiredOutcome: string; // "By the end ... students will be able to ..."
  anchor: AnchorMaterial;
  learnerProductionPct: number; // 0-100, how much time learners speak/produce
  scaffoldingNeed: "low" | "medium" | "high";
  hasRealOutcome: boolean; // task with a concrete product
};

export type ApproachKey =
  | "CLT"
  | "TBLT"
  | "CBI_CLIL"
  | "NFA"
  | "ECLECTIC";

export type Candidate = {
  approach: ApproachKey;
  score: number;
  rationale: string[];
  structuralMicroMoves: string[];
};

export type Recommendation = {
  primary: ApproachKey;
  secondary?: ApproachKey;
  scores: Record<ApproachKey, number>;
  rationale: string[];
  structuralMicroMoves: string[];
  warnings: string[];
  candidates: Candidate[]; // top 2, for the teacher to choose between
};
