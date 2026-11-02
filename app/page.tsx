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
import { applyChoice, recommend } from "@/lib/recommend";
import { buildLessonPlan, buildLessonPlanHTML } from "@/lib/lessonPlan";
import { approachInfo } from "@/lib/approaches";
import { buildMaterials, renderMaterialsHTML } from "@/lib/materials";
import { useLang } from "@/lib/i18n";
import { config, documentLang, durationLabel, loc } from "@/config";
import type { UIStrings } from "@/lib/ui";

const STEP_COUNT = 4;

const DEFAULT_INPUT: LearnerInput = {
  studentName: "",
  level: "A2",
  ageContext: "",
  modality: "face_to_face",
  topic: "",
  skillFocus: "oral",
  goalType: "task",
  desiredOutcome: "",
  anchor: "none",
  learnerProductionPct: 60,
  scaffoldingNeed: "medium",
  hasRealOutcome: false,
};

type Update = <K extends keyof LearnerInput>(k: K, v: LearnerInput[K]) => void;

export default function Page() {
  const { lang, ui } = useLang();
  const docLang = documentLang(lang);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<LearnerInput>(DEFAULT_INPUT);
  const [chosen, setChosen] = useState<ApproachKey | null>(null);

  // Recommendation in the interface language (what the student reads on screen)…
  const rec = useMemo(() => recommend(input, lang), [input, lang]);
  // …and in the document language (what goes into the lesson plan).
  const recDoc = useMemo(() => recommend(input, docLang), [input, docLang]);

  // When user changes inputs, reset their choice so they re-pick if needed.
  useEffect(() => {
    setChosen(null);
  }, [input]);

  // Scroll to the top of the wizard when changing step (important on phones).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const effective = useMemo(() => applyChoice(rec, chosen), [rec, chosen]);
  const effectiveDoc = useMemo(() => applyChoice(recDoc, chosen), [recDoc, chosen]);

  const plan = useMemo(() => buildLessonPlan(input, effectiveDoc, docLang), [input, effectiveDoc, docLang]);
  const planHTML = useMemo(
    () => buildLessonPlanHTML(input, effectiveDoc, docLang),
    [input, effectiveDoc, docLang]
  );
  const materials = useMemo(
    () => buildMaterials(input, effectiveDoc.primary, docLang),
    [input, effectiveDoc.primary, docLang]
  );
  const materialsHTML = useMemo(
    () => renderMaterialsHTML(input, materials, docLang),
    [input, materials, docLang]
  );

  const update: Update = (key, value) => setInput((s) => ({ ...s, [key]: value }));

  return (
    <div className="space-y-6">
      <Stepper step={step} ui={ui} />

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {step === 0 && <Step1 input={input} update={update} ui={ui} />}
        {step === 1 && <Step2 input={input} update={update} ui={ui} />}
        {step === 2 && <Step3 input={input} update={update} ui={ui} />}
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
      <div className="printable-plan" lang={docLang} dangerouslySetInnerHTML={{ __html: planHTML }} />
      <div
        className="printable-materials"
        lang={docLang}
        dangerouslySetInnerHTML={{ __html: materialsHTML }}
      />

      <div className="flex items-center justify-between gap-3 no-print">
        <button
          className="min-h-[44px] rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          {ui.back}
        </button>
        <button
          className="min-h-[44px] rounded-md bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          onClick={() => setStep((s) => Math.min(STEP_COUNT - 1, s + 1))}
          disabled={step === STEP_COUNT - 1}
        >
          {ui.next}
        </button>
      </div>
    </div>
  );
}

function Stepper({ step, ui }: { step: number; ui: UIStrings }) {
  return (
    <nav className="no-print" aria-label={ui.stepOf(step + 1, STEP_COUNT)}>
      {/* Phones: compact progress bar */}
      <div className="sm:hidden">
        <p className="text-sm font-medium text-slate-700">
          {ui.stepOf(step + 1, STEP_COUNT)} · <span className="text-brand">{ui.steps[step]}</span>
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }}
          />
        </div>
      </div>
      {/* Larger screens: pills */}
      <ol className="hidden flex-wrap items-center gap-2 text-sm sm:flex">
        {ui.steps.map((label, i) => (
          <li
            key={i}
            aria-current={i === step ? "step" : undefined}
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
    </nav>
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

function Step1({ input, update, ui }: { input: LearnerInput; update: Update; ui: UIStrings }) {
  const { lang } = useLang();
  const peerNote = loc(config.course.peerRoleplayNote, lang);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{ui.s1Title}</h2>
      <Field label={ui.nameLabel}>
        <input
          className={inputCls}
          value={input.studentName}
          onChange={(e) => update("studentName", e.target.value)}
          placeholder={ui.namePlaceholder}
          autoComplete="name"
        />
      </Field>
      <Field label={ui.levelLabel}>
        <select
          className={inputCls}
          value={input.level}
          onChange={(e) => update("level", e.target.value as Level)}
        >
          {(Object.keys(ui.levels) as Level[]).map((k) => (
            <option key={k} value={k}>
              {ui.levels[k]}
            </option>
          ))}
        </select>
      </Field>
      <Field label={ui.contextLabel} hint={peerNote ? `${ui.contextHint} (${peerNote})` : ui.contextHint}>
        <input
          className={inputCls}
          value={input.ageContext}
          onChange={(e) => update("ageContext", e.target.value)}
          placeholder={ui.contextPlaceholder}
        />
      </Field>
      <Field label={ui.modeLabel} hint={ui.modeHint}>
        <div className="flex flex-col gap-2 sm:flex-row">
          {(
            [
              ["face_to_face", ui.faceToFace],
              ["virtual", ui.virtual],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={input.modality === value}
              onClick={() => update("modality", value)}
              className={`min-h-[44px] flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
                input.modality === value
                  ? "border-brand bg-brand text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Field>

      <Field label={ui.scaffoldLabel} hint={ui.scaffoldHint}>
        <select
          className={inputCls}
          value={input.scaffoldingNeed}
          onChange={(e) =>
            update("scaffoldingNeed", e.target.value as LearnerInput["scaffoldingNeed"])
          }
        >
          {(["low", "medium", "high"] as const).map((k) => (
            <option key={k} value={k}>
              {ui.scaffold[k]}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}

function Step2({ input, update, ui }: { input: LearnerInput; update: Update; ui: UIStrings }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{ui.s2Title}</h2>
      <Field label={ui.topicLabel} hint={ui.topicHint(durationLabel())}>
        <input
          className={inputCls}
          value={input.topic}
          onChange={(e) => update("topic", e.target.value)}
          placeholder={ui.topicPlaceholder}
        />
      </Field>
      <Field label={ui.skillLabel}>
        <select
          className={inputCls}
          value={input.skillFocus}
          onChange={(e) => update("skillFocus", e.target.value as SkillFocus)}
        >
          {(Object.keys(ui.skills) as SkillFocus[]).map((k) => (
            <option key={k} value={k}>
              {ui.skills[k]}
            </option>
          ))}
        </select>
      </Field>
      <Field label={ui.outcomeLabel} hint={ui.outcomeHint}>
        <textarea
          className={inputCls + " min-h-[80px]"}
          value={input.desiredOutcome}
          onChange={(e) => update("desiredOutcome", e.target.value)}
          placeholder={ui.outcomePlaceholder}
        />
      </Field>
    </div>
  );
}

function Step3({ input, update, ui }: { input: LearnerInput; update: Update; ui: UIStrings }) {
  const { lang } = useLang();
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{ui.s3Title}</h2>
      <p className="text-sm text-slate-600">{ui.s3Intro(loc(config.course.approachesUnits, lang))}</p>

      <Field label={ui.goalLabel}>
        <select
          className={inputCls}
          value={input.goalType}
          onChange={(e) => update("goalType", e.target.value as GoalType)}
        >
          {(Object.keys(ui.goals) as GoalType[]).map((k) => (
            <option key={k} value={k}>
              {ui.goals[k]}
            </option>
          ))}
        </select>
      </Field>

      <Field label={ui.anchorLabel} hint={ui.anchorHint}>
        <select
          className={inputCls}
          value={input.anchor}
          onChange={(e) => update("anchor", e.target.value as AnchorMaterial)}
        >
          {(Object.keys(ui.anchors) as AnchorMaterial[]).map((k) => (
            <option key={k} value={k}>
              {ui.anchors[k]}
            </option>
          ))}
        </select>
      </Field>

      <Field label={ui.productionLabel(input.learnerProductionPct)} hint={ui.productionHint}>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={input.learnerProductionPct}
          onChange={(e) => update("learnerProductionPct", Number(e.target.value))}
          className="h-8 w-full accent-brand"
        />
      </Field>

      <Field label={ui.outcomeQLabel} hint={ui.outcomeQHint}>
        <select
          className={inputCls}
          value={input.hasRealOutcome ? "yes" : "no"}
          onChange={(e) => update("hasRealOutcome", e.target.value === "yes")}
        >
          <option value="no">{ui.outcomeNo}</option>
          <option value="yes">{ui.outcomeYes}</option>
        </select>
      </Field>
    </div>
  );
}

function printWith(bodyClass: string) {
  document.body.classList.add(bodyClass);
  const cleanup = () => {
    document.body.classList.remove(bodyClass);
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  window.print();
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
  const { lang, ui } = useLang();
  const docLang = documentLang(lang);

  function downloadMarkdown() {
    const blob = new Blob([plan], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ui.fileName}-${(input.studentName || ui.draft).replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // 4a — chooser
  if (!chosen) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">{ui.s4PickTitle}</h2>
          <p className="text-sm text-slate-600">{ui.s4PickIntro}</p>
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
            <h3 className="text-sm font-semibold text-amber-900">{ui.beforeYouChoose}</h3>
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
  const info = approachInfo(effective.primary, lang);
  const btn = "min-h-[44px] rounded-md px-3 py-2 text-sm font-medium text-white hover:opacity-90";
  return (
    <div className="space-y-6">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{ui.s4BuiltTitle}</h2>
          <p className="mt-1 text-xl font-bold text-brand">{info.name}</p>
          <p className="text-sm italic text-slate-700">{info.tagline}</p>
        </div>
        <button
          onClick={() => setChosen(null)}
          className="min-h-[40px] self-start rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          {ui.chooseDifferently}
        </button>
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">{ui.whyApproach}</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {effective.rationale.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">{ui.signatureMoves}</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {info.signatureMoves.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">{ui.microMoves}</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {effective.structuralMicroMoves.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{ui.lessonPlan}</h3>
            <p className="text-xs text-slate-600">{loc(config.template.pdfDescription, lang)}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button onClick={() => printWith("print-plan")} className={`${btn} bg-brand`}>
              {ui.downloadPdf}
            </button>
            <button onClick={downloadMarkdown} className={`${btn} bg-brand-accent`}>
              {ui.markdown}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-emerald-900">{ui.materials}</h3>
            <p className="text-xs text-emerald-900/80">{ui.materialsDesc}</p>
          </div>
          <button
            onClick={() => printWith("print-materials")}
            className={`${btn} shrink-0 bg-emerald-700`}
          >
            {ui.downloadMaterials}
          </button>
        </div>
      </section>

      <details className="rounded-md border border-slate-200 bg-white p-3 text-sm">
        <summary className="cursor-pointer font-medium text-slate-700">{ui.preview}</summary>
        <pre className="mt-3 max-h-[360px] overflow-auto whitespace-pre-wrap break-words rounded bg-slate-50 p-3 text-xs leading-relaxed text-slate-800">
          {plan}
        </pre>
      </details>

      <p className="text-xs text-slate-500">
        {ui.reminder(loc(config.submissionPlatform, lang))}
        {docLang !== lang && <> {ui.docLangNote(ui.langNames[docLang])}</>}
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
  const { lang, ui } = useLang();
  const info = approachInfo(candidate.approach, lang);
  return (
    <div
      className={`flex h-full flex-col rounded-lg border p-4 shadow-sm ${
        isTop ? "border-brand bg-brand/5" : "border-slate-200 bg-white"
      }`}
    >
      {isTop && (
        <div className="mb-2 inline-block w-fit rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {ui.bestMatch}
        </div>
      )}
      <h3 className="text-base font-bold text-slate-900">{info.name}</h3>
      <p className="mt-1 text-sm italic text-slate-700">{info.tagline}</p>
      <p className="mt-2 text-xs text-slate-600">
        <strong>{ui.viewOfLanguage}</strong> {info.viewOfLanguage}
      </p>

      <div className="mt-3 space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.whyFits}</h4>
        <ul className="list-disc space-y-0.5 pl-5 text-xs text-slate-700">
          {candidate.rationale.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      <div className="mt-3 space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ui.looksLike}</h4>
        <ul className="list-disc space-y-0.5 pl-5 text-xs text-slate-700">
          {info.signatureMoves.slice(0, 2).map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={onChoose}
        className={`mt-auto w-full min-h-[44px] rounded-md px-3 py-2 text-sm font-medium ${
          isTop
            ? "bg-brand text-white hover:opacity-90"
            : "border border-brand bg-white text-brand hover:bg-brand/5"
        }`}
        style={{ marginTop: "1rem" }}
      >
        {ui.use(info.shortName)}
      </button>
    </div>
  );
}
