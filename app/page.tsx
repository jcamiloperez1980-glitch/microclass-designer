"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LearnerInput,
  Level,
  SkillFocus,
  GoalType,
  AnchorMaterial,
  ApproachKey,
  Recommendation,
  Candidate,
} from "@/lib/types";
import { recommend } from "@/lib/recommend";
import { buildLessonPlan, buildLessonPlanHTML } from "@/lib/lessonPlan";
import { APPROACH_INFO } from "@/lib/approaches";
import { buildMaterials, renderMaterialsHTML } from "@/lib/materials";

const STEPS = ["Learners", "Lesson", "Approach diagnostic", "Choose & build"] as const;

const DEFAULT_INPUT: LearnerInput = {
  studentName: "",
  level: "A2",
  ageContext: "",
  topic: "",
  skillFocus: "oral",
  goalType: "task",
  desiredOutcome: "",
  anchor: "none",
  learnerProductionPct: 60,
  scaffoldingNeed: "medium",
  hasRealOutcome: false,
};

export default function Page() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<LearnerInput>(DEFAULT_INPUT);
  const [chosen, setChosen] = useState<ApproachKey | null>(null);

  const rec = useMemo(() => recommend(input), [input]);

  // When user changes inputs, reset their choice so they re-pick if needed.
  useEffect(() => {
    setChosen(null);
  }, [input]);

  // Build the effective recommendation around the chosen approach (or default to top).
  const effective = useMemo<Recommendation>(() => {
    if (!chosen) return rec;
    const chosenCandidate = rec.candidates.find((c) => c.approach === chosen);
    return {
      ...rec,
      primary: chosen,
      secondary: rec.candidates.find((c) => c.approach !== chosen)?.approach,
      rationale: chosenCandidate?.rationale ?? rec.rationale,
      structuralMicroMoves: chosenCandidate?.structuralMicroMoves ?? rec.structuralMicroMoves,
    };
  }, [rec, chosen]);

  const plan = useMemo(() => buildLessonPlan(input, effective), [input, effective]);
  const planHTML = useMemo(() => buildLessonPlanHTML(input, effective), [input, effective]);
  const materials = useMemo(
    () => buildMaterials(input, effective.primary),
    [input, effective.primary]
  );
  const materialsHTML = useMemo(
    () => renderMaterialsHTML(input, materials),
    [input, materials]
  );

  function update<K extends keyof LearnerInput>(key: K, value: LearnerInput[K]) {
    setInput((s) => ({ ...s, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <Stepper step={step} />

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {step === 0 && <Step1 input={input} update={update} />}
        {step === 1 && <Step2 input={input} update={update} />}
        {step === 2 && <Step3 input={input} update={update} />}
        {step === 3 && (
          <Step4
            input={input}
            rec={rec}
            effective={effective}
            chosen={chosen}
            setChosen={setChosen}
            plan={plan}
          />
        )}
      </div>

      {/* Hidden printables — visibility toggled by body class during print */}
      <div className="printable-plan" dangerouslySetInnerHTML={{ __html: planHTML }} />
      <div className="printable-materials" dangerouslySetInnerHTML={{ __html: materialsHTML }} />

      <div className="flex items-center justify-between no-print">
        <button
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          ← Back
        </button>
        <button
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 text-sm no-print">
      {STEPS.map((label, i) => (
        <li
          key={label}
          className={`flex items-center gap-2 rounded-full px-3 py-1 ${
            i === step
              ? "bg-brand text-white"
              : i < step
              ? "bg-emerald-100 text-emerald-800"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <span className="font-semibold">{i + 1}</span>
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="block text-sm font-medium text-slate-800">{label}</span>
      {hint && <span className="block text-xs text-slate-500">{hint}</span>}
      {children}
    </label>
  );
}

const inputCls =
  "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

function Step1({
  input,
  update,
}: {
  input: LearnerInput;
  update: <K extends keyof LearnerInput>(k: K, v: LearnerInput[K]) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Step 1 — Who are your learners?</h2>
      <Field label="Your name (for the lesson plan)">
        <input
          className={inputCls}
          value={input.studentName}
          onChange={(e) => update("studentName", e.target.value)}
          placeholder="e.g., María García"
        />
      </Field>
      <Field label="Level">
        <select
          className={inputCls}
          value={input.level}
          onChange={(e) => update("level", e.target.value as Level)}
        >
          <option value="A1">A1 — Beginner</option>
          <option value="A2">A2 — Elementary</option>
          <option value="B1">B1 — Intermediate</option>
          <option value="B2">B2 — Upper-intermediate</option>
        </select>
      </Field>
      <Field
        label="Age & context"
        hint="Who is in the room? Where? (Your peers will role-play A2–B1 learners.)"
      >
        <input
          className={inputCls}
          value={input.ageContext}
          onChange={(e) => update("ageContext", e.target.value)}
          placeholder="e.g., adults at a community language institute"
        />
      </Field>
      <Field
        label="How much scaffolding will learners need?"
        hint="A1/A2 learners almost always need medium–high scaffolding."
      >
        <select
          className={inputCls}
          value={input.scaffoldingNeed}
          onChange={(e) =>
            update("scaffoldingNeed", e.target.value as LearnerInput["scaffoldingNeed"])
          }
        >
          <option value="low">Low — minimal frames needed</option>
          <option value="medium">Medium — language frames, vocab bank</option>
          <option value="high">High — heavy modelling and pre-teaching</option>
        </select>
      </Field>
    </div>
  );
}

function Step2({
  input,
  update,
}: {
  input: LearnerInput;
  update: <K extends keyof LearnerInput>(k: K, v: LearnerInput[K]) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Step 2 — What are you teaching?</h2>
      <Field
        label="Lesson topic"
        hint="A focused topic — learners must be able to DO something new with English in 10–12 min."
      >
        <input
          className={inputCls}
          value={input.topic}
          onChange={(e) => update("topic", e.target.value)}
          placeholder="e.g., Making polite requests in formal situations"
        />
      </Field>
      <Field label="Primary skill focus">
        <select
          className={inputCls}
          value={input.skillFocus}
          onChange={(e) => update("skillFocus", e.target.value as SkillFocus)}
        >
          <option value="grammar_function">Grammar &amp; function</option>
          <option value="vocabulary">Vocabulary in context</option>
          <option value="oral">Oral / speaking</option>
          <option value="reading_listening">Reading / listening</option>
          <option value="writing">Writing</option>
        </select>
      </Field>
      <Field
        label="Desired outcome — finish this sentence"
        hint="By the end of this lesson, students will be able to ..."
      >
        <textarea
          className={inputCls + " min-h-[80px]"}
          value={input.desiredOutcome}
          onChange={(e) => update("desiredOutcome", e.target.value)}
          placeholder="e.g., ... make three polite requests in a hotel reception scenario."
        />
      </Field>
    </div>
  );
}

function Step3({
  input,
  update,
}: {
  input: LearnerInput;
  update: <K extends keyof LearnerInput>(k: K, v: LearnerInput[K]) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Step 3 — Approach diagnostic</h2>
      <p className="text-sm text-slate-600">
        Five quick questions. Your answers map to one of the modern approaches from Units 1–2.
        Structural elements appear in your plan only as supporting micro-moves — never as the spine.
      </p>

      <Field label="What is the heart of your lesson?">
        <select
          className={inputCls}
          value={input.goalType}
          onChange={(e) => update("goalType", e.target.value as GoalType)}
        >
          <option value="function">A communicative function (apologise, request, recommend...)</option>
          <option value="task">A real task with a concrete outcome (decide, plan, solve...)</option>
          <option value="discussion">A meaningful exchange of opinions or ideas</option>
          <option value="content">Engaging with real content (a text, clip, image)</option>
          <option value="form">A language structure / grammar point</option>
        </select>
      </Field>

      <Field
        label="What anchor material will you use?"
        hint="Real-world materials make CBI/CLIL natural; scenarios suit NFA and TBLT."
      >
        <select
          className={inputCls}
          value={input.anchor}
          onChange={(e) => update("anchor", e.target.value as AnchorMaterial)}
        >
          <option value="authentic_text">A short authentic text (article, email, post...)</option>
          <option value="video_clip">A short video clip</option>
          <option value="image_data">An image / infographic / data display</option>
          <option value="scenario_cards">Scenario or role-play cards</option>
          <option value="none">Just the whiteboard / shared screen</option>
        </select>
      </Field>

      <Field
        label={`Approximate % of time learners will be using English: ${input.learnerProductionPct}%`}
        hint="The rubric rewards learner production. 50%+ is a healthy target for a micro-class."
      >
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={input.learnerProductionPct}
          onChange={(e) => update("learnerProductionPct", Number(e.target.value))}
          className="w-full"
        />
      </Field>

      <Field
        label="Does your lesson produce a concrete outcome?"
        hint="A list, decision, plan, recommendation, ranking, post-it wall... something learners create."
      >
        <select
          className={inputCls}
          value={input.hasRealOutcome ? "yes" : "no"}
          onChange={(e) => update("hasRealOutcome", e.target.value === "yes")}
        >
          <option value="no">No — the activity is the goal</option>
          <option value="yes">Yes — learners produce something concrete</option>
        </select>
      </Field>
    </div>
  );
}

function Step4({
  input,
  rec,
  effective,
  chosen,
  setChosen,
  plan,
}: {
  input: LearnerInput;
  rec: Recommendation;
  effective: Recommendation;
  chosen: ApproachKey | null;
  setChosen: (k: ApproachKey | null) => void;
  plan: string;
}) {
  function printPlan() {
    document.body.classList.add("print-plan");
    const cleanup = () => {
      document.body.classList.remove("print-plan");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }

  function printMaterials() {
    document.body.classList.add("print-materials");
    const cleanup = () => {
      document.body.classList.remove("print-materials");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }

  function downloadMarkdown() {
    const blob = new Blob([plan], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `microclass-lesson-plan-${(input.studentName || "draft")
      .replace(/\s+/g, "-")
      .toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // 4a — chooser
  if (!chosen) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Step 4 — Pick your approach</h2>
          <p className="text-sm text-slate-600">
            Based on your answers, two approaches fit your lesson well. Read both — they shape your
            lesson differently. Pick the one that matches who you want to be as a teacher.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {rec.candidates.slice(0, 2).map((c, i) => (
            <ChoiceCard
              key={c.approach}
              candidate={c}
              isTop={i === 0}
              onChoose={() => setChosen(c.approach)}
            />
          ))}
        </div>
        {rec.warnings.length > 0 && (
          <section className="space-y-2 rounded-md border border-amber-300 bg-amber-50 p-3">
            <h3 className="text-sm font-semibold text-amber-900">⚠ Before you choose</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-amber-900">
              {rec.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  // 4b — chosen view
  const info = APPROACH_INFO[effective.primary];
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Step 4 — Your lesson built around</h2>
          <p className="mt-1 text-xl font-bold text-brand">{info.name}</p>
          <p className="text-sm italic text-slate-700">{info.tagline}</p>
        </div>
        <button
          onClick={() => setChosen(null)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          ← Choose differently
        </button>
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">Why this approach?</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {effective.rationale.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">Signature moves</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {info.signatureMoves.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">
          Structural micro-moves (form-focus inside your modern frame)
        </h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {effective.structuralMicroMoves.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">📄 Lesson plan</h3>
            <p className="text-xs text-slate-600">A4 PDF — Sections 1–4 of the Final Task template.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={printPlan}
              className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
            >
              ⬇ Download PDF
            </button>
            <button
              onClick={downloadMarkdown}
              className="rounded-md bg-brand-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
            >
              ⬇ Markdown
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-emerald-900">✂ Class materials</h3>
            <p className="text-xs text-emerald-900/80">
              Print, cut, distribute. Includes scenario / task / discussion cards plus language
              frames and a vocabulary bank — laid out 2 cards per A4 page.
            </p>
          </div>
          <button
            onClick={printMaterials}
            className="rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            ⬇ Download materials PDF
          </button>
        </div>
      </section>

      <details className="rounded-md border border-slate-200 bg-white p-3 text-sm">
        <summary className="cursor-pointer font-medium text-slate-700">
          Preview the lesson plan (Markdown)
        </summary>
        <pre className="mt-3 max-h-[360px] overflow-auto whitespace-pre-wrap rounded bg-slate-50 p-3 text-xs leading-relaxed text-slate-800">
          {plan}
        </pre>
      </details>

      <p className="text-xs text-slate-500">
        Reminder: this is a starter draft. Refine the wording, add your own course references, and
        make it sound like YOU before uploading to Moodle.
      </p>
    </div>
  );
}

function ChoiceCard({
  candidate,
  isTop,
  onChoose,
}: {
  candidate: Candidate;
  isTop: boolean;
  onChoose: () => void;
}) {
  const info = APPROACH_INFO[candidate.approach];
  return (
    <div
      className={`flex h-full flex-col rounded-lg border p-4 shadow-sm ${
        isTop ? "border-brand bg-brand/5" : "border-slate-200 bg-white"
      }`}
    >
      {isTop && (
        <div className="mb-2 inline-block w-fit rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Best match
        </div>
      )}
      <h3 className="text-base font-bold text-slate-900">{info.name}</h3>
      <p className="mt-1 text-sm italic text-slate-700">{info.tagline}</p>
      <p className="mt-2 text-xs text-slate-600">
        <strong>View of language:</strong> {info.viewOfLanguage}
      </p>

      <div className="mt-3 space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Why this fits
        </h4>
        <ul className="list-disc space-y-0.5 pl-5 text-xs text-slate-700">
          {candidate.rationale.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      <div className="mt-3 space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          What it would look like
        </h4>
        <ul className="list-disc space-y-0.5 pl-5 text-xs text-slate-700">
          {info.signatureMoves.slice(0, 2).map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={onChoose}
        className={`mt-4 w-full rounded-md px-3 py-2 text-sm font-medium ${
          isTop
            ? "bg-brand text-white hover:opacity-90"
            : "border border-brand bg-white text-brand hover:bg-brand/5"
        }`}
      >
        Use {info.name.split(" (")[0]}
      </button>
    </div>
  );
}
