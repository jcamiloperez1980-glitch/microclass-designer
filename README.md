# Micro-Class Designer

A guided web tool that helps UNIMINUTO students design their 10–12 minute language micro-class for the *Approaches and Methods in Language Teaching I* Final Task.

## What it does

1. Collects the student's intended **learner profile** (level, age, context, scaffolding needs).
2. Collects the **lesson topic** and **desired communicative outcome**.
3. Runs a short **approach diagnostic** (5 questions).
4. Recommends a modern methodological approach — **CLT, TBLT, CBI/CLIL, NFA, or Principled Eclecticism** — and embeds structural elements only as supporting micro-moves.
5. Generates a draft **lesson plan** (Sections 1–4 of the Final Task template) the student can download as Markdown.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- 100% client-side recommendation logic — no API keys, no database, no cost per student.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Deploy

Railway: connect this repo, Railway auto-detects Next.js. Build command: `npm run build`. Start command: `npm start`. The app reads `PORT` from the environment.

## Honesty notice

The generated plan is a **starter draft**. Students must refine it, add their own course references, and make it sound like them before uploading to Moodle.
