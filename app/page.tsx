"use client";

import { useMemo, useState } from "react";
import { LearnerInput, Level, SkillFocus, GoalType, AnchorMaterial } from "@/lib/types";
import { recommend } from "@/lib/recommend";
import { buildLessonPlan } from "@/lib/lessonPlan";
import { APPROACH_INFO } from "@/lib/approaches";

const STEPS = ["Learners", "Lesson", "Approach diagnostic", "Your plan"] as const;

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

  const rec = useMemo(() => recommend(input), [input]);
  const plan = useMemo(() => buildLessonPlan(input, rec), [input, rec]);

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
        {step === 3 && <Step4 input={input} rec={rec} plan={plan} />}
      </div>

      <div className="flex items-center justify-between">
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
    <ol className="flex flex-wrap items-center gap-2 text-sm">
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
          onChange={(e) => update("scaffoldingNeed", e.target.value as LearnerInput["scaffoldingNeed"])}
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
          <option value="grammar_function">Grammar & function</option>
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
        Structural elements (grammar drills, form-focus) will appear in your plan only as
        supporting micro-moves — never as the spine of the lesson.
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
        label={`Approximate % of time learners will be using English (not listening to you): ${input.learnerProductionPct}%`}
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
  plan,
}: {
  input: LearnerInput;
  rec: ReturnType<typeof recommend>;
  plan: string;
}) {
  const info = APPROACH_INFO[rec.primary];
  const secondary = rec.secondary ? APPROACH_INFO[rec.secondary] : null;

  function download() {
    const blob = new Blob([plan], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `microclass-lesson-plan-${(input.studentName || "draft").replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Step 4 — Your recommended approach</h2>
        <p className="text-sm text-slate-600">
          Based on your answers, here's the methodology that fits your lesson — and a draft plan
          you can refine.
        </p>
      </div>

      <div className="rounded-md border border-brand/30 bg-brand/5 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-brand">
          Recommended approach
        </div>
        <div className="mt-1 text-xl font-bold text-slate-900">{info.name}</div>
        <div className="mt-1 text-sm italic text-slate-700">{info.tagline}</div>
        {secondary && (
          <div className="mt-2 text-sm text-slate-700">
            <strong>Borrow from:</strong> {secondary.name}
          </div>
        )}
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">Why this approach?</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {rec.rationale.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">Signature moves to make it visible</h3>
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
          {rec.structuralMicroMoves.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      {rec.warnings.length > 0 && (
        <section className="space-y-2 rounded-md border border-amber-300 bg-amber-50 p-3">
          <h3 className="text-sm font-semibold text-amber-900">⚠ Warnings</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-amber-900">
            {rec.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Draft lesson plan</h3>
          <button
            onClick={download}
            className="rounded-md bg-brand-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            ⬇ Download as Markdown
          </button>
        </div>
        <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-800">
          {plan}
        </pre>
      </section>

      <p className="text-xs text-slate-500">
        Reminder: this is a starter draft. Refine the wording, add your own course references, and
        make it sound like YOU before uploading to Moodle.
      </p>
    </div>
  );
}
