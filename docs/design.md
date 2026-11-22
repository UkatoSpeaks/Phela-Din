# Pehla Din: Design Brief

> Status: v1, written Nov 2026. This is the source of truth for every UI decision. If a screen disagrees with this file, fix the screen or update this file on purpose.

## 1. The concept

**"Your first-day kit."**

On the first day of any job in India you're handed things: an ID card on a lanyard, a brown file with your name on it, a register to sign, a desk. Someone senior leaves you a note. Your tiffin sits by the keyboard. By evening, the papers have stamps on them.

Pehla Din's UI *is* that kit. Every screen is made of objects you'd find on an Indian office desk, printed flat on warm paper:

| Object | Where it shows up |
| --- | --- |
| **Brown file cover** (khaki, "File No. / Subject") | Career detail pages (dossiers), the Fit Report envelope |
| **Ledger / register paper** (blue ruling, red margin line) | Scene text, written tasks, the appraisal letter |
| **Rubber stamp** (violet stamp-pad ink) | Choices being locked in, day stamps, the Fit Report verdict |
| **ID card on a lanyard** | Career cards (flip to see the back), the day intro |
| **Sticky note** (haldi yellow, handwritten) | Real Talk quotes from mentors, tips |
| **Steel tiffin** (three tiers) | The player's state: Tiffin, the mascot that replaces meter bars |
| **Phone screen / email / call** | How scenes arrive: chat, email, incoming call, narrative |

**Why this works for our users:** students and parents recognise every object instantly, it makes "work" feel tangible rather than abstract, and it's impossible to confuse with a generic SaaS template.

**Rule of thumb:** *printed, not rendered.* Things look like ink on paper: flat colour, hard edges, slight misregistration. They don't look like glossy 3D plastic or frosted glass. (The landing-page 3D diorama is the one exception, and it uses flat-shaded low-poly, not realism.)

## 2. Research notes (why these choices)

- **What reads as "AI slop" in 2025–26:** Inter as the only typeface; purple→blue / violet→indigo gradients; a centred hero with gradient headline text; the hero → 3 icon feature cards → testimonials → CTA template; uniformly rounded cards with soft blurred shadows; emoji or generic line icons as decoration; glassmorphism; sparkle ✨ icons for "AI". These tells come from models and templates defaulting to the statistical centre of their training data. Fix: a specific concept, a distinctive display face, and deliberate layout ([925studios](https://www.925studios.co/blog/ai-slop-design-tells), [dev.to on indigo-500](https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p), [anti-patterns](https://www.mintlify.com/pbakaus/impeccable/concepts/anti-patterns)).
- **Indian office material culture:** violet stamp-pad ink is standard government stationery ([SPMCIL stationery list](https://igmhyderabad.spmcil.com/wp-content/uploads/2024/02/Stationery.pdf)); government file covers are brown and carry *File No.* and a bilingual *Subject* ([DDA record room guidance](https://dda.gov.in/sites/default/files/2023-08/record_room_documents_ocr.pdf)). We borrow those exact conventions.
- **Satoshi licence:** ITF Free Font License: free for commercial use, self-hosting allowed, **no modification/subsetting/format conversion, no redistribution through public repositories**. We self-host the unmodified variable WOFF2 via `next/font/local`. *If this repo becomes public, switch Satoshi to the Fontshare API.*

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

Semantic aliases: `positive = leaf`, `negative = margin`, `link = chai`, `focus = stamp`.

**Contrast:** body text is always `ink` on `paper`/`sheet`. `ink-2` only for secondary text ≥ 14px. Never put text on `khaki` lighter than `ink`.

## 4. Typography

| Role | Font | Notes |
| --- | --- | --- |
| Display / headings | **Fraunces** (Google, variable: `opsz`, `SOFT`, `WONK`) | Use high optical size and `SOFT 50`, `WONK 1` for headlines: warm, slightly odd, old-press feeling. Never all-caps Fraunces. |
| Body / UI | **Satoshi** (Fontshare, self-hosted) | Regular 400 for body, Bold 700 for buttons/labels. Stamp lettering uses Satoshi Black, uppercase, tracked +0.08em. |
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
| `Stamp` | Violet (or leaf/margin) rubber stamp: rect or round, double border, Satoshi Black caps, roughened ink, optional animated "thump". |
| `StickyNote` | Haldi note with a strip of tape, Caveat text, slight tilt, optional signature line ("— Priya, 6 yrs in audit"). |
| `IdCard` | Lanyard slot, org band, photo/initials box, name in Fraunces, role, employee no., barcode. Optional back face; flips. |
| `Button` | `primary` = ink block with hard offset shadow that presses flat on tap; `secondary` = sheet with 2px ink border; `ghost` = underlined text. |
| `Tiffin` | Three-tier steel tiffin bound to meters: **stress → steam + rattle, energy → food fill level, satisfaction → warm glow**. Reactions: idle, happy, wince, shocked. |

## 9. Voice

Indian English, warm and specific, like a kind senior colleague. Real numbers, not adjectives ("₹2,400 in month 8", not "low income"). A little Hinglish where it's natural ("Abhi tak nahi hua?"). No hype, no "unlock your potential", no exclamation marks in UI chrome.

## 10. "Not AI slop" rules

1. **No purple/indigo/violet gradients. No gradients on UI at all.** Violet exists only as stamp ink.
2. **No Inter, no system-font-only UI.** Fraunces + Satoshi + Caveat + Tiro, used by role.
3. **No emoji as icons or decoration.** Icons are small custom SVG marks drawn like stamps or ink, or a word.
4. **No centred gradient-text hero, no 3 icon feature cards, no testimonial carousel, no bento grid.**
5. **No glassmorphism, no blurry glow shadows, no `rounded-3xl` everything.** Hard shadows, small radii.
6. **No sparkles ✨ or robot imagery for AI features.** AI feedback is "your manager's comments" in red pen.
7. **No generic stock illustrations or 3D blobs.** Every visual is one of the desk objects in §1.
8. **Every screen must contain at least one specific Indian detail**: a ₹ amount, a city, a Hindi label, a chai, a register, a name.
9. **Copy uses real numbers and names**, never "Lorem ipsum" or "John Doe".
10. **Before shipping a screen, ask: could this be a template for any startup?** If yes, it isn't done.

## 11. Accessibility

AA contrast on all text. Focus ring: 3px `stamp` outline, 2px offset. Hindi and handwriting are never the only carrier of meaning. Tiffin has a text equivalent (screen-reader meter values + visible numbers on tap). Everything works at 360px and at 200% zoom.
