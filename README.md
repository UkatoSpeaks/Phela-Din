# Pehla Din

**Live the job before you choose it.**

Pehla Din ("first day") lets students live a realistic week in a career through short interactive scenes: choices, small written tasks, and the consequences of earlier decisions. At the end they get an honest **Fit Report**. It's built for Indian students (Class 10–12 and college) and their parents, mostly on phones.

## Stack

Next.js (App Router) · TypeScript (strict) · Tailwind CSS v4 · zod. No database and no auth: content is JSON in `content/`, and player progress lives in `localStorage`.

## Running it

```bash
npm install
cp .env.example .env.local   # optional; GROQ_API_KEY isn't needed yet
npm run dev                  # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build (also validates all content) |
| `npm run validate` | Checks every file in `content/` against the schemas |
| `npm run lint` | Type-check only (`tsc --noEmit`) |

## How it fits together

```
content/                    JSON content (validated at build time)
  careers.json              Career list for /careers (status, category, launchWave)
  career-profiles/<id>.json Path, skills, pay, pros/cons, sources for /careers/<id>
  simulations/<id>.json     One file per simulation; file name must equal its id
  drafts/                   Markdown drafts (not loaded by the app)
  research/                 Source research (careers-2026.md); profiles are copied from here
src/types/simulation.ts     zod schemas + inferred types (single source of truth)
src/types/career-profile.ts zod schema for career profiles
src/lib/content.ts          Loads and validates content (server/build only)
src/lib/engine.ts           Pure game logic: startRun, applyChoice, completeEvent,
                            submitAiTask, nextStep, getVisibleScenes
src/lib/fit-report.ts       Run → verdict, top tags, final meters (rules in VERDICT_RULES)
src/lib/storage.ts          Save/resume runs in localStorage (SSR-safe)
src/lib/analytics.ts        track(): console.log for now, PostHog later
src/components/careers/     Career list (filter chips), cards, profile detail view
src/components/sim/         Player UI; SimPlayer.tsx wires engine + storage + UI
src/components/result/      FitReport (presentational) + ResultView (reads storage)
src/app/api/ai-feedback/    Feedback on written tasks (placeholder; Groq TODO)
```

A **run** goes through these phases: `day_intro → scene → (outcome) → scene … → next day_intro … → finished`. Scenes with `requiresFlag` only appear if an earlier choice set that flag through `setFlags`.

## How to add a new career

1. **Research it.** Add the career's profile to `content/research/` (path, what you learn, pay table, pros, cons, competition numbers, scene ideas, sources with URLs).
2. **Create the profile** at `content/career-profiles/<id>.json`, using an existing profile as a reference. Copy values word-for-word from the research and never round or "update" numbers. Leave out optional fields (`competitionReality`, `path.duration`, `path.note`, `pay.title`, `pay.notes`) the research doesn't cover. Pay values are display text, not numbers.
3. **Add it to `content/careers.json`** with the same `id`, `"status": "coming_soon"`, and optionally `"launchWave": 1` (shown as "Launching first") or `2`. The detail page at `/careers/<id>` goes live right away.
4. **Draft the simulation** in `content/drafts/<id>.md` (template in `content/drafts/README.md`; the five launch careers already have skeletons). Base it on a real conversation with someone in the job, and use their actual words for each day's `realTalk` quote.
5. **Convert it to JSON.** Create `content/simulations/<id>.json`, using `sample-career.json` as a reference. Rules:
   - `id` is lowercase-with-dashes and **must equal the file name**.
   - Number the days 1, 2, 3… Scene ids must be unique across the whole simulation.
   - Scene `type` is `choice` (2+ choices with `effects`, `tags`, optional `setFlags` / `outcome`), `ai_task` (`rubric`, `placeholder`), or `event` (optional `effects`).
   - Effects are partial and can be negative: `{ "energy": -10, "stress": 5 }`. Meters always stay between 0 and 100.
   - A `requiresFlag` must be set by a choice in an **earlier** scene.
   - Reuse tag names across careers (`people`, `organised`, `communication`, …), because the Fit Report shows the top three.
6. **Go live:** in `careers.json` set `"status": "live"` and `"simulationId": "<id>"`, and set the simulation's `careerId` to the career's `id`.
7. **Run `npm run validate`.** It lists every problem with the file and field, e.g.
   `content/simulations/x.json → days[0].scenes[2].choices[1].effects: Unrecognized key: "enrgy"`.
   It also checks that every career has a profile and every profile has a career (except `sample-career`). Then play it through in `npm run dev`.

## Tweaking the Fit Report

Verdict thresholds are in `VERDICT_RULES` in `src/lib/fit-report.ts`. Any deal-breaker gives `probably_not`; meeting all the strong-fit thresholds gives `strong_fit`; anything else is `worth_exploring`.

## Deploying

Built for Vercel: import the repo and set `GROQ_API_KEY` once the AI route is wired up. Simulation pages are statically generated, and `next.config.ts` bundles `content/` with the API function.
