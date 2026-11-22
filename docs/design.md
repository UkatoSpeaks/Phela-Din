# Pehla Din: Design Brief

> Status: v1, written Nov 2026. This is the source of truth for every UI decision. If a screen disagrees with this file, fix the screen or update this file on purpose.

## 1. The concept

**"Your first-day kit."**

On the first day of any job in India you're handed things: an ID card on a lanyard, a brown file with your name on it, a register to sign, a desk. Someone senior leaves you a note. Your tiffin sits by the keyboard. By evening, the papers have stamps on them.

Pehla Din's UI *is* that kit. Every screen is made of objects you'd find on an Indian office desk, printed flat on warm paper:

| Object | Where it shows up |
| --- | --- |
| **Brown file cover** (khaki, "File No. / Subject") | Default career hero object (see §1.1), the Fit Report envelope |
| **Ledger / register paper** (blue ruling, red margin line) | Scene text, written tasks, the appraisal letter |
| **Rubber stamp** (violet stamp-pad ink) | Choices being locked in, day stamps, the Fit Report verdict |
| **ID card on a lanyard** | Career cards (flip to see the back), the day intro |
| **Sticky note** (haldi yellow, handwritten) | Real Talk quotes from mentors, tips |
| **Steel tiffin** (three tiers) | The player's state: Tiffin, the mascot that replaces meter bars |
| **Phone screen / email / call** | How scenes arrive: chat, email, incoming call, narrative |

**Why this works for our users:** students and parents recognise every object instantly, it makes "work" feel tangible rather than abstract, and it's impossible to confuse with a generic SaaS template.

**Rule of thumb:** *printed, not rendered.* Things look like ink on paper: flat colour, hard edges, slight misregistration. They don't look like glossy 3D plastic or frosted glass. (The landing-page 3D diorama is the one exception, and it uses flat-shaded low-poly, not realism.)

### 1.1 Per-career hero objects

The base system (paper, ink, stamps, sticky notes, ID cards, Tiffin, type, colour, motion) is **the same on every screen**. What changes per career is the **hero object**: the one object that frames a career's detail page, the way a real professional's desk is defined by one thing on it. The government file is the default, not the only option.

| `heroObject` | The real thing | Careers | Notes for the build |
| --- | --- | --- | --- |
| `government_file` *(default)* | Brown file cover with File No. / Subject (bilingual) and a tab | Civil Services, Chartered Accountant, and any career without a better object | Already built: `PaperCard variant="file"` |
| `prescription_pad` | A doctor's letterhead pad: name + degrees in the header, "Rx", ruled lines, a stamp-style registration no. | Doctor (MBBS) | Clipboard was the alternative; the prescription pad is more specific to Indian practice |
| `sketchbook` | A spiral-bound sketchbook page: dotted grid, pencil annotations, rough wireframe boxes | UI/UX Designer | Annotations in Caveat; wireframes as thin ink strokes |
| `phone` | A phone screen showing the creator's own channel: profile header, view counts, a notification | Content Creator | Real numbers from the profile (312 views, ₹2,400) |
| `sticker_notebook` | A laptop-style notebook covered in stickers (stack logos, "it works on my machine", a chai sticker) | Software Engineer, AI/ML Engineer | Stickers are flat shapes with a white die-cut edge, tilted |

Rules: a hero object frames the page header and the "Competition reality" callout; the rest of the page (path, pay, pros/cons, sources) stays on the standard paper components so every career page reads the same. Careers without a `heroObject` in `content/careers.json` use `government_file`. Lawyer, Cybersecurity Analyst and Digital Marketer use the default until a better object is chosen.

## 2. Research notes (why these choices)

- **What reads as "AI slop" in 2025–26:** Inter as the only typeface; purple→blue / violet→indigo gradients; a centred hero with gradient headline text; the hero → 3 icon feature cards → testimonials → CTA template; uniformly rounded cards with soft blurred shadows; emoji or generic line icons as decoration; glassmorphism; sparkle ✨ icons for "AI". These tells come from models and templates defaulting to the statistical centre of their training data. Fix: a specific concept, a distinctive display face, and deliberate layout ([925studios](https://www.925studios.co/blog/ai-slop-design-tells), [dev.to on indigo-500](https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p), [anti-patterns](https://www.mintlify.com/pbakaus/impeccable/concepts/anti-patterns)).
- **Indian office material culture:** violet stamp-pad ink is standard government stationery ([SPMCIL stationery list](https://igmhyderabad.spmcil.com/wp-content/uploads/2024/02/Stationery.pdf)); government file covers are brown and carry *File No.* and a bilingual *Subject* ([DDA record room guidance](https://dda.gov.in/sites/default/files/2023-08/record_room_documents_ocr.pdf)). We borrow those exact conventions.

## 3. Colour

Every colour is named after a real thing. Flat fills only, no gradients (except Tiffin's glow, which is a radial "warmth", not a UI gradient).

| Token | Hex | The real thing | Use |
| --- | --- | --- | --- |
| `paper` | `#F3ECDD` | Newsprint / register paper | Page background |
| `paper-2` | `#E9DFC9` | Older, handled paper | Recessed areas, table headers |
| `sheet` | `#FBF7EE` | A fresh A4 sheet | Cards that sit on top of the page |
| `ink` | `#1E1A15` | Black ballpoint / print | Text, primary buttons, hard shadows |
| `ink-2` | `#5E544A` | Faded print | Secondary text (≥ 4.5:1 on paper) |
| `rule` | `#9FB6D3` | Register ruling (blue) | Ledger lines, dividers |
| `margin` | `#D2453A` | Register margin line (red) | The margin line, *negative* effects, stress |
| `khaki` | `#C9A46A` | Brown file cover | File/dossier surfaces |
| `khaki-2` | `#A9834A` | File cover edge / string | Folder tabs, file borders |
| `stamp` | `#5B3E9E` | Violet stamp-pad ink | **Stamps only.** Never buttons, never gradients |
| `haldi` | `#F2C14E` | Haldi / sticky-note yellow | Sticky notes, highlights |
| `steel` | `#A7AEB3` | Steel tiffin | Tiffin body, metallic neutrals |
| `chai` | `#B5652B` | Chai / kulhad clay | Warm accent, satisfaction glow, links |
| `leaf` | `#3F7A4C` | Banana leaf / "APPROVED" green ink | Positive effects, "strong fit" |

Semantic aliases: `positive = leaf`, `negative = margin`, `link = chai-deep`, `focus = stamp`.

**Text shades.** `chai`, `leaf` and `margin` are fill/ink colours and fail AA as small text. Use their `-deep` versions for any text: `chai-deep #854D24`, `leaf-deep #37643F`, `margin-deep #9E392F`. Stamp violet passes as-is.

**Contrast:** body text is always `ink` on `paper`/`sheet`. `ink-2` only for secondary text ≥ 14px. Never put text on `khaki` lighter than `ink`.

## 4. Typography

| Role | Font | Notes |
| --- | --- | --- |
| Display / headings | **Fraunces** (Google, variable: `opsz`, `SOFT`, `WONK`) | Use high optical size and `SOFT 50`, `WONK 1` for headlines: warm, slightly odd, old-press feeling. Never all-caps Fraunces. |
| Body / UI | **Hanken Grotesk** (Google, OFL, self-hosted by `next/font`) | Regular 400 for body, Bold 700 for buttons/labels. Stamp lettering uses Hanken Grotesk Black (900), uppercase, tracked +0.08em. Chosen over Schibsted Grotesk as the closer match to the round, open grotesk feel we wanted. |
| Handwriting | **Caveat** (Google) | Sticky notes, margin annotations, signatures. **Max ~25 words per note; never for anything the user must read to proceed.** Min 20px. |
| Hindi accents | **Tiro Devanagari Hindi** (Google) | Short bilingual labels (पहला दिन, विषय, फ़ाइल सं.). Always paired with English, never the only label. |

Scale (mobile → desktop): `display` 40→64, `h1` 32→44, `h2` 24→28, `h3` 19→21, `body` 17, `small` 14, `micro` 12 (labels only, uppercase, tracked). Line-height 1.5 for body, 1.1 for display. Numbers use `tabular-nums`.

## 5. Shape, texture, depth

- **Corners:** paper has square-ish corners. `2px` for sheets and files, `6px` for buttons and inputs, `14px` for ID cards and the phone frame. **No `rounded-3xl` cards.**
- **Shadows:** hard and offset, like paper resting on a desk: `3px 3px 0 ink/90%` for interactive things, `0 1px 0 ink/10%, 0 8px 0 -4px ink/8%` for stacked paper. **No large blurry shadows.**
- **Grain:** a very subtle fixed noise overlay (SVG turbulence) on the page, multiplied, ≈ 6–8% visible. Never on text.
- **Tilt:** loose objects (sticky notes, stamps, photos) sit at −3° to 3°. Structural things (sheets, files, forms) are straight.
- **Ink imperfection:** stamps use an SVG roughen filter and patchy opacity. One filter definition, shared app-wide.

## 6. Layout

- **Mobile-first at 360px.** 16px side gutters, single column, content max-width 34rem for reading and 64rem for grids.
- **Left-aligned and editorial.** Headlines align left. Asymmetry is good: a sticky note overlapping a sheet corner, a stamp breaking a border.
- **The page is a desk; content sits on it.** Background = `paper`; primary content = `sheet` cards or `khaki` files.
- **Tap targets ≥ 48px.** Choices are full-width.
- **No:** centred hero with gradient text, 3-column icon feature rows, testimonial carousels, bento grids.

## 7. Motion

Motion is *physical*: things are stamped, slid, flipped, swiped. Every animation has a real-world verb.

| Verb | Where | Spec |
| --- | --- | --- |
| **Stamp** | Locking a choice, day stamp, verdict | Scale 1.8 → 0.94 → 1, opacity 0 → 1, 280ms, `cubic-bezier(.2,.9,.3,1.3)`; 1–2px page shake |
| **Slide** | New scene / new paper | translateY 12px → 0 + fade, 240ms ease-out |
| **Flip** | ID card front/back | rotateY 180°, 500ms, `transform-style: preserve-3d` |
| **Swipe** | Day intro ID card through a reader | translateX with a slight tilt, 600ms, then a green "beep" light |
| **Spin** | Day intro clock hands | GSAP, 700ms, ease out |
| **Rattle / steam** | Tiffin under stress | GSAP loop; amplitude scales with stress |

Tools: CSS for simple transitions; **GSAP** (`@gsap/react`, `useGSAP`) for Tiffin, the day intro and ScrollTrigger; **React Three Fiber + Drei** only on the landing page, lazy-loaded with `ssr: false`.

**`prefers-reduced-motion: reduce`:** no transforms, shakes, loops or 3D. State changes appear instantly or with a ≤150ms opacity fade. Tiffin shows its state statically. The landing page shows the static diorama image.

## 8. Components

| Component | Description |
| --- | --- |
| `PaperCard` | Variants: `sheet` (plain paper), `ledger` (blue ruling + red margin), `file` (khaki folder with tab, "File No." line). |
| `Stamp` | Violet (or leaf/margin) rubber stamp: rect or round, double border, Hanken Grotesk Black caps, roughened ink, optional animated "thump". |
| `StickyNote` | Haldi note with a strip of tape, Caveat text, slight tilt, optional signature line ("— Priya, 6 yrs in audit"). |
| `IdCard` | Lanyard slot, org band, photo/initials box, name in Fraunces, role, employee no., barcode. Optional back face; flips. |
| `Button` | `primary` = ink block with hard offset shadow that presses flat on tap; `secondary` = sheet with 2px ink border; `ghost` = underlined text. |
| `Tiffin` | Three-tier steel tiffin bound to meters: **energy → food (haldi) fill level, stress → steam wisps (at 40/60/80) + lid rattle (from 60), satisfaction → warm glow**. Moods from meters: idle (breathing), steaming (stress ≥ 75), sleepy (energy ≤ 25). Reactions to a choice's effects, each < 600ms: happy, wince, shocked (net harm ≥ 20). Charming and a bit cheeky (idle smirk), never babyish; steel + ink + haldi only; readable at 64px. **Tap shows a "Tiffin slip" with the actual numbers**, and the button's label always carries them, so meaning is never visual-only. Rules live in `src/lib/tiffin.ts`. GSAP loads only where Tiffin is used (player, /design). |

## 9. Voice

Indian English, warm and specific, like a kind senior colleague. Real numbers, not adjectives ("₹2,400 in month 8", not "low income"). A little Hinglish where it's natural ("Abhi tak nahi hua?"). No hype, no "unlock your potential", no exclamation marks in UI chrome.

## 10. "Not AI slop" rules

1. **No purple/indigo/violet gradients. No gradients on UI at all.** Violet exists only as stamp ink.
2. **No Inter, no system-font-only UI.** Fraunces + Hanken Grotesk + Caveat + Tiro, used by role.
3. **No emoji as icons or decoration.** Icons are small custom SVG marks drawn like stamps or ink, or a word.
4. **No centred gradient-text hero, no 3 icon feature cards, no testimonial carousel, no bento grid.**
5. **No glassmorphism, no blurry glow shadows, no `rounded-3xl` everything.** Hard shadows, small radii.
6. **No sparkles ✨ or robot imagery for AI features.** AI feedback is "your manager's comments" in red pen.
7. **No generic stock illustrations or 3D blobs.** Every visual is one of the desk objects in §1.
8. **Every screen must contain at least one specific Indian detail**: a ₹ amount, a city, a Hindi label, a chai, a register, a name.
9. **Copy uses real numbers and names**, never "Lorem ipsum" or "John Doe".
10. **Before shipping a screen, ask: could this be a template for any startup?** If yes, it isn't done.

## 11. Accessibility

AA contrast on all text. Measured Nov 2026 by rendering the grain and sampling every pixel (darkest pixel = worst case):

| Background | `ink` | `ink-2` | `chai-deep` | `leaf-deep` | `margin-deep` |
| --- | --- | --- | --- | --- | --- |
| paper (flat) | 14.7 | 6.3 | 5.5 | 5.5 | 5.5 |
| paper + grain, darkest pixel | 11.7 | 5.0 | 4.6 | 4.7 | 4.6 |
| paper-2 | 13.1 | 5.6 | 5.2 | 5.2 | 5.2 |
| sheet | 16.2 | 6.9 | 6.4 | 6.4 | 6.4 |

Grain is limited so the darkest pixel keeps `ink-2` ≥ 4.5:1 (it was 3.9 in v1 and was lightened). Semi-transparent ink passes on the solid surfaces it's used on: `ink/75` on khaki 4.6, `ink/70` on haldi/rose/sky ≥ 4.9. Ledger rule lines are 1px decorations under the text, not backgrounds. **Stamps** are decorative ink (patchy by design): every stamp has an `aria-label`, and any meaning a stamp carries (a verdict, a day) must also appear as plain text nearby. Use `margin`/`leaf` stamps at `md` size or larger. Focus ring: 3px `stamp` outline, 2px offset. Hindi and handwriting are never the only carrier of meaning. Tiffin has a text equivalent (screen-reader meter values + visible numbers on tap). Everything works at 360px and at 200% zoom.

## 12. Home page

The home page explains Pehla Din by letting people *do* it, not by listing features.

1. **Hero:** headline + one paragraph on what happens (a realistic week, your calls, an honest Fit Report), two CTAs, "no sign-up". Beside it, *"Who do you want to be on your pehla din?"*: five original cast characters (`components/home/Avatar.tsx`), switched with passport-photo chips. Each speaks a real scene idea and shows the competition reality from its career profile (`components/home/cast.ts` reads them from content; nothing is typed by hand). Auto-plays until touched; never under reduced motion.
2. **How it works as one working day** (9:30 AM → 3:00 PM → 6:45 PM). The 3:00 PM step is a real playable scene from the sample simulation, with Tiffin and a stamp. GSAP ScrollTrigger draws the rail.
3. **Every job has a different desk:** a *2026* desk in R3F: oak top on a slim frame, felt mat, phone, earbuds, steel bottle, money plant, chai in a paper cup, sticky notes and a clock on the wall, plus per-career kit (monitor + mechanical keyboard, ECG tablet, spreadsheet, video call + files + ringing phone, ring light + boom mic). Rounded toon-shaded shapes with Drei `Outlines` so 3D matches the 2D ink style. **Tiffin appears as our mascot desk figurine, not as a lunch box**: nobody carries a steel tiffin to a 2026 office, but the brand stays. Three.js loads only on the home page, only when the section is near, never under reduced motion or without WebGL; static renders in `public/home/desk-*.webp` (regenerate when the scene changes) show meanwhile or instead.
4. **Reality clippings:** competition numbers from the profiles as newspaper cuttings, linking to each career file.
5. **For parents** sticky note + final CTA on a file cover.

Animation: one library (GSAP) across the app instead of adding Framer Motion, to keep JavaScript small on budget phones. GSAP loads on the home page, the player and /design.

## 13. Career pages

- **`/careers`: landscape ID cards** (`components/careers/CareerIdCard.tsx`), one per row on phones. Front: category colour band, status label, cast photo (or a dashed "Photo awaited" silhouette for careers without a character), name, description, a "A day in the job" line from the research, barcode. **Tap to flip**: the back is a file summary straight from the profile (how long, starts with, first pay row, reality check) + "Open the full file". The turned-away face is `inert`. Filter chips: All · Launching first · categories.
- **`/careers/[id]`: a dossier.** The header sits inside the career's hero object (`components/careers/HeroObject.tsx`, §1.1): government file, prescription pad (℞ OPD letterhead, signature line), sketchbook (spiral binding, dot grid, pencil note), phone screen (research line as a notification), sticker notebook (dark cover, die-cut stickers). Under the header: file labels derived from data, competition reality, CTA. Then numbered sections on standard paper: path (ledger), what you learn, pay table + disclaimer + "Data as of", the good / the hard parts, **moments you'll live** (scene ideas as sticky notes), sources.
- Every fact on these pages is read from `content/` at build time; nothing is typed into components.
- **Interactive file (v2).** Sticky folder-divider tabs with scroll-spy (`file/FileTabs.tsx`). **The odds** drawn from `competitionReality.visual` (bars, "1 in N" figures or dots, percent range); `npm run validate` warns if those numbers aren't in the research. **Skills self-check**, **pay ladder** (rungs climb on scroll; research text untouched), **tarazu** to weigh pros/cons that matter to *you* (mini scale stays in view on phones), **gut check** on each research moment, and **Your take**: a stamped summary that says plainly it's a gut check, not a Fit Report. Taps are saved per career on the device (`lib/storage.ts` → `pehla-din:take:<id>`); summary rules in `lib/career-take.ts` (`TAKE_RULES`). Scroll reveals are CSS + IntersectionObserver (`file/Reveal.tsx`): content is visible without JS and under reduced motion; no GSAP on these pages.
