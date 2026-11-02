# Micro-Class Designer

**[Español](#español) · [English](#english)**

---

## Español

### Qué hace

Micro-Class Designer es una herramienta web que guía a futuros docentes de lenguas, paso a paso, en el diseño de una **microclase de 10–12 minutos** fundamentada en enfoques modernos.

1. Recoge el **perfil de los estudiantes** (nivel, edad, contexto, modalidad presencial o virtual, andamiaje necesario).
2. Recoge el **tema** y el **resultado comunicativo** esperado.
3. Aplica un **diagnóstico de enfoque** de 5 preguntas.
4. Propone los **dos enfoques** que mejor encajan — **CLT, TBLT, CBI/CLIL, Enfoque Nocional-Funcional o Eclecticismo con principios** — y el estudiante elige uno. Los elementos estructurales aparecen solo como micro-movimientos de apoyo.
5. Genera un **plan de clase** en 4 secciones (PDF A4 y Markdown) y **materiales recortables** (tarjetas de escenario, tarea, rol y discusión; marcos de lengua; banco de vocabulario).

Características:

- **Interfaz bilingüe español / inglés** con selector de idioma en el encabezado (la elección se recuerda en el navegador).
- **Configurable por institución y curso**: nombre de la institución, curso, nombre de la tarea, plantilla del plan, duración, referencias, colores.
- **Funciona en celular** (diseño adaptable, botones táctiles de 44 px, sin zoom forzado en iOS).
- **Sin costo por estudiante**: toda la lógica corre en el navegador. **No usa API de IA, no necesita claves, no guarda datos de los estudiantes.**

### Ejecutar en local

Requiere Node.js 18.17 o superior.

```bash
npm install
```

```bash
npm run dev
```

Abre <http://localhost:3000>.

### Configurarlo para otro curso o institución

Todo lo específico de una institución vive en `config/institutions/`. Se incluyen dos configuraciones:

| Archivo | Uso |
|---|---|
| `config/institutions/uniminuto.ts` | Ejemplo real: UNIMINUTO — *Approaches and Methods in Language Teaching I*, Final Task (por defecto si no se define la variable). |
| `config/institutions/generic.ts` | Configuración neutra para cualquier licenciatura (`NEXT_PUBLIC_INSTITUTION=generic`). |

Para crear una nueva:

1. Copia `config/institutions/generic.ts` como `config/institutions/mi-universidad.ts` y cambia `id: "mi-universidad"`.
2. Edita los campos (todos los textos tienen versión `es` y `en`):
   - `institutionName`, `programName`, `courseName`, `assignmentName`, `submissionPlatform` (p. ej. "Moodle").
   - `defaultLanguage`: idioma de la interfaz en la primera visita (`"es"` o `"en"`).
   - `documentLanguage`: idioma del plan generado — `"ui"` (sigue al selector), `"es"` o `"en"`.
   - `duration`: minutos de la microclase.
   - `template`: título y encabezados de las 4 secciones del plan, rango de palabras de la justificación.
   - `course`: unidad donde se estudia la visión de la lengua, nota sobre quién hace de estudiantes, referencias sugeridas, ítems extra para la lista de verificación.
   - `footerNote`, `theme` (colores en hexadecimal).
3. Regístrala en `config/index.ts` (importar y agregar a `INSTITUTIONS`).
4. Selecciónala con la variable de entorno `NEXT_PUBLIC_INSTITUTION=mi-universidad` (ver `.env.example`).

> La variable se lee **al compilar**: después de cambiarla hay que volver a desplegar.
> Las tarjetas para estudiantes siempre están en inglés (la lengua meta); las notas para el docente siguen el idioma del documento.

### Desplegar en Vercel

1. En <https://vercel.com/new> importa este repositorio (Vercel detecta Next.js automáticamente).
2. En **Environment Variables** agrega `NEXT_PUBLIC_INSTITUTION` con el `id` de tu configuración (p. ej. `uniminuto`).
3. Pulsa **Deploy**. No se necesitan otras variables ni claves.

Para varias instituciones, crea un proyecto de Vercel por institución apuntando al mismo repositorio, cada uno con su propio `NEXT_PUBLIC_INSTITUTION` y dominio.

### Desplegar en Cloudflare Pages

La aplicación es 100 % estática, así que se publica como sitio estático:

1. En el panel de Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** y elige el repositorio.
2. Configuración de compilación:
   - **Build command:** `npm run build:static`
   - **Build output directory:** `out`
   - **Environment variables:** `NEXT_PUBLIC_INSTITUTION=<tu id>` y `NODE_VERSION=20`
3. Guarda y despliega.

El mismo comando (`npm run build:static`) sirve para cualquier hosting estático (GitHub Pages, Netlify, servidor de la universidad).

### Otros hostings

Con servidor Node (Railway, Render, VM): `npm run build` y luego `npm start` (lee `PORT` del entorno).

### Aviso de honestidad académica

El plan generado es un **borrador inicial**. Cada estudiante debe ajustarlo, agregar referencias del curso y escribirlo con su propia voz antes de entregarlo.

---

## English

### What it does

Micro-Class Designer is a web tool that walks pre-service language teachers, step by step, through designing a **10–12 minute micro-class** grounded in modern approaches.

1. Collects the **learner profile** (level, age, context, face-to-face or virtual delivery, scaffolding needs).
2. Collects the **lesson topic** and the **desired communicative outcome**.
3. Runs a 5-question **approach diagnostic**.
4. Suggests the **two best-fitting approaches** — **CLT, TBLT, CBI/CLIL, the Notional-Functional Approach or Principled Eclecticism** — and the student picks one. Structural elements appear only as supporting micro-moves.
5. Generates a four-section **lesson plan** (A4 PDF and Markdown) and **cut-out class materials** (scenario, task, role and discussion cards; language frames; vocabulary bank).

Features:

- **Bilingual Spanish / English interface** with a language switch in the header (remembered in the browser).
- **Configurable per institution and course**: institution, course, assignment name, plan template, duration, references, colours.
- **Mobile-friendly** (responsive layout, 44 px touch targets, no iOS zoom-on-focus).
- **No per-student cost**: all logic runs in the browser. **No AI API, no keys, no student data stored.**

### Run locally

Requires Node.js 18.17+.

```bash
npm install
```

```bash
npm run dev
```

Open <http://localhost:3000>.

### Configure it for another course or institution

Everything institution-specific lives in `config/institutions/`. Two configurations ship with the app:

| File | Use |
|---|---|
| `config/institutions/uniminuto.ts` | Real example: UNIMINUTO — *Approaches and Methods in Language Teaching I*, Final Task (default when the variable is not set). |
| `config/institutions/generic.ts` | Neutral configuration for any teacher-education programme (`NEXT_PUBLIC_INSTITUTION=generic`). |

To add one:

1. Copy `config/institutions/generic.ts` to `config/institutions/my-university.ts` and set `id: "my-university"`.
2. Edit the fields (every text has an `es` and an `en` version):
   - `institutionName`, `programName`, `courseName`, `assignmentName`, `submissionPlatform` (e.g. "Moodle").
   - `defaultLanguage`: interface language on first visit (`"es"` or `"en"`).
   - `documentLanguage`: language of the generated plan — `"ui"` (follows the switch), `"es"` or `"en"`.
   - `duration`: micro-class length in minutes.
   - `template`: plan title and the four section headings, justification word range.
   - `course`: unit where the view of language is studied, note on who plays the learners, suggested references, extra checklist items.
   - `footerNote`, `theme` (hex colours).
3. Register it in `config/index.ts` (import it and add it to `INSTITUTIONS`).
4. Select it with `NEXT_PUBLIC_INSTITUTION=my-university` (see `.env.example`).

> The variable is read **at build time** — redeploy after changing it.
> Learner-facing cards are always in English (the target language); teacher notes follow the document language.

### Deploy to Vercel

1. Import this repository at <https://vercel.com/new> (Next.js is detected automatically).
2. Under **Environment Variables**, add `NEXT_PUBLIC_INSTITUTION` with your configuration `id` (e.g. `uniminuto`).
3. Click **Deploy**. No other variables or keys are needed.

For several institutions, create one Vercel project per institution from the same repository, each with its own `NEXT_PUBLIC_INSTITUTION` and domain.

### Deploy to Cloudflare Pages

The app is fully static, so it is published as a static site:

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, pick the repository.
2. Build settings:
   - **Build command:** `npm run build:static`
   - **Build output directory:** `out`
   - **Environment variables:** `NEXT_PUBLIC_INSTITUTION=<your id>` and `NODE_VERSION=20`
3. Save and deploy.

The same command (`npm run build:static`) works for any static host (GitHub Pages, Netlify, a university web server).

### Other hosts

With a Node server (Railway, Render, a VM): `npm run build`, then `npm start` (reads `PORT` from the environment).

### Academic honesty notice

The generated plan is a **starter draft**. Students must refine it, add course references and write it in their own voice before submitting it.

---

## Project structure

```
app/            Next.js pages, layout, header with language switch
config/         Institution configurations (one file per institution)
lib/            Recommendation engine, lesson-plan and materials generators, UI strings (es/en)
venta/          Sales landing page for programme coordinators (self-contained HTML)
```
