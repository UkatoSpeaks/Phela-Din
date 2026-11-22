import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { IdCard } from "@/components/ui/IdCard";
import { PaperCard } from "@/components/ui/PaperCard";
import { Stamp } from "@/components/ui/Stamp";
import { StickyNote } from "@/components/ui/StickyNote";
import { IdCardFlip, StampReplay } from "./DesignDemos";

export const metadata: Metadata = {
  title: "Design kit · Pehla Din",
  robots: { index: false, follow: false },
};

const COLOURS: { token: string; hex: string; thing: string; use: string; dark?: boolean }[] = [
  { token: "paper", hex: "#F3ECDD", thing: "Register paper", use: "Page" },
  { token: "paper-2", hex: "#E9DFC9", thing: "Handled paper", use: "Recessed" },
  { token: "sheet", hex: "#FBF7EE", thing: "Fresh A4", use: "Cards" },
  { token: "ink", hex: "#1E1A15", thing: "Ballpoint", use: "Text, primary", dark: true },
  { token: "ink-2", hex: "#5E544A", thing: "Faded print", use: "Secondary text", dark: true },
  { token: "rule", hex: "#9FB6D3", thing: "Register ruling", use: "Lines" },
  { token: "margin", hex: "#D2453A", thing: "Margin line", use: "Negative, stress", dark: true },
  { token: "khaki", hex: "#C9A46A", thing: "File cover", use: "Dossiers" },
  { token: "khaki-2", hex: "#A9834A", thing: "File edge", use: "Tabs, lips", dark: true },
  { token: "stamp", hex: "#5B3E9E", thing: "Stamp-pad ink", use: "Stamps only", dark: true },
  { token: "haldi", hex: "#F2C14E", thing: "Sticky note", use: "Notes" },
  { token: "steel", hex: "#A7AEB3", thing: "Steel tiffin", use: "Tiffin" },
  { token: "chai", hex: "#B5652B", thing: "Kulhad clay", use: "Warm accent, links", dark: true },
  { token: "leaf", hex: "#3F7A4C", thing: "APPROVED ink", use: "Positive", dark: true },
];

function Block({ n, title, note, children }: { n: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section className="border-t-2 border-ink pt-5">
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-black tabular-nums tracking-[0.14em] text-ink-2">{n}</span>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      {note ? <p className="mt-1 max-w-prose text-sm text-ink-2">{note}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function DesignPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12">
      <header className="relative pt-2">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-2">
          Internal · <span className="font-hindi normal-case tracking-normal">डिज़ाइन किट</span>
        </p>
        <h1 className="mt-2 max-w-[14ch] text-[40px] font-semibold leading-[1.05] sm:text-6xl">The first-day kit</h1>
        <p className="mt-3 max-w-prose text-ink-2">
          Every surface in Pehla Din is an object from an Indian office desk, printed flat on warm paper. Source of truth:{" "}
          <code className="rounded-[3px] bg-paper-2 px-1.5 py-0.5 text-sm">docs/design.md</code>
        </p>
        <div className="pointer-events-none absolute right-0 top-0 hidden sm:block">
          <Stamp label="Draft" sub="Stage 1 of 6" tone="margin" rotate={9} size="lg" />
        </div>
      </header>

      <Block n="01" title="Colour" note="Named after real things. Flat fills only. Violet is stamp ink and nothing else.">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {COLOURS.map((c) => (
            <li key={c.token} className="overflow-hidden rounded-[var(--radius-paper)] bg-sheet shadow-[var(--shadow-paper)]">
              <div className="flex h-16 items-end p-2" style={{ background: c.hex }}>
                <span className={`text-[11px] font-bold tabular-nums ${c.dark ? "text-sheet" : "text-ink"}`}>{c.hex}</span>
              </div>
              <div className="p-2 text-xs leading-snug">
                <p className="font-bold">{c.token}</p>
                <p className="text-ink-2">{c.thing}</p>
                <p className="text-ink-2">{c.use}</p>
              </div>
            </li>
          ))}
        </ul>
      </Block>

      <Block n="02" title="Type" note="Fraunces for display, Satoshi for everything you read, Caveat for notes only, Tiro for short Hindi labels.">
        <div className="grid gap-6 lg:grid-cols-2">
          <PaperCard>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">Fraunces · display</p>
            <p className="mt-2 font-display text-[40px] font-semibold leading-[1.05] sm:text-6xl">Live the job before you choose it.</p>
            <p className="mt-4 font-display text-2xl">Hour 26 of a 36-hour shift</p>
          </PaperCard>
          <PaperCard>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">Satoshi · body &amp; UI</p>
            <p className="mt-2 text-[17px]">
              Your best video gets 312 views. A brand offers ₹15,000 for a product you don&apos;t like. Month 8 earnings: ₹2,400.
            </p>
            <p className="mt-3 text-sm font-bold">Bold 700 for labels and buttons · tabular 0123456789</p>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">Caveat · handwriting</p>
            <p className="font-hand text-[26px] leading-tight">Nobody tells you how much is just paperwork.</p>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">Tiro Devanagari Hindi · labels</p>
            <p className="font-hindi text-2xl">
              पहला दिन <span className="font-sans text-base text-ink-2">/ First day</span>
            </p>
          </PaperCard>
        </div>
      </Block>

      <Block n="03" title="Buttons" note="Physical keys: a hard lip that presses flat. Press and hold one to feel it.">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <Button>Start the day</Button>
          <Button variant="secondary">Read the file</Button>
          <ButtonLink href="/careers" variant="ghost">
            Browse careers
          </ButtonLink>
          <Button disabled>Submitting…</Button>
        </div>
      </Block>

      <Block n="04" title="Paper" note="sheet for content, ledger for scenes and written tasks, file for career dossiers.">
        <div className="grid gap-8 lg:grid-cols-3">
          <PaperCard>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">sheet</p>
            <p className="mt-2">
              9:30 AM. You log in and find 23 unread emails. Meera wants a status update by noon.
            </p>
          </PaperCard>
          <PaperCard variant="ledger">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">ledger</p>
            <p>Riya from the next desk is stuck on a spreadsheet and asks for help. You still have your own report to finish before the 6:15 bus.</p>
          </PaperCard>
          <PaperCard variant="file" tab="Dossier" fileNo="PD/CA/2026/04" subject="Chartered Accountant">
            <p className="text-sm">Foundation → Inter → 2–3 yrs articleship → Final. Usually 4.5–6 years.</p>
          </PaperCard>
        </div>
      </Block>

      <Block n="05" title="Stamps" note="Violet stamp-pad ink by default; green and red for verdicts. Roughened by one shared SVG filter.">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="flex flex-wrap items-center gap-6">
            <Stamp label="Received" sub="22 Nov 2026" />
            <Stamp label="Strong fit" tone="leaf" rotate={4} />
            <Stamp label="Probably not" tone="margin" rotate={-3} size="sm" />
            <Stamp label="Pehla Din" sub="Day 2" shape="round" rotate={-10} />
            <Stamp label="File copy" tone="ink" rotate={2} size="sm" />
          </div>
          <StampReplay />
        </div>
      </Block>

      <Block n="06" title="Sticky notes" note="Real Talk from mentors. Short, handwritten, taped on. Never the only place key information lives.">
        <div className="grid gap-10 pt-2 sm:grid-cols-3">
          <StickyNote label="Real talk" from="Priya, 6 yrs in audit">
            Tax season, you will see 2am more than your family. Plan for it.
          </StickyNote>
          <StickyNote tone="rose" rotate={2} from="Dr. Kabir, JR, AIIMS">
            The patient&apos;s family will remember how you spoke, not what you prescribed.
          </StickyNote>
          <StickyNote tone="sky" rotate={-1} label="Tip">
            Ask what matters most today. It saves an hour.
          </StickyNote>
        </div>
      </Block>

      <Block n="07" title="ID card" note="Careers become ID cards. Pass a back face and the card flips (instant under reduced motion).">
        <div className="grid gap-10 sm:grid-cols-3">
          <IdCard name="Rohan Deshmukh" role="SDE-1, Payments" org="Kirana Labs" validity="Bengaluru · Valid from Pehla Din" idNo="SE-2026-1092" accent="chai" fields={[{ label: "Blood group", value: "O+" }, { label: "Emp. code", value: "KL1092" }]} />
          <IdCard name="Fatima Shaikh" role="SDM, Barabanki" org="Govt. of Uttar Pradesh" validity="IAS 2026 batch" idNo="UP-IAS-0316" accent="leaf" fields={[{ label: "Blood group", value: "A+" }, { label: "Joined", value: "22 Nov 2026" }]} />
          <IdCardFlip />
        </div>
      </Block>

      <Block n="08" title="Rules" note="From docs/design.md §10. If a screen breaks one, it isn't done.">
        <PaperCard variant="ledger" className="max-w-2xl">
          <ol className="list-decimal pl-5 marker:font-bold">
            <li>No gradients on UI. Violet is stamp ink only.</li>
            <li>No Inter, no system-font-only screens.</li>
            <li>No emoji as icons or decoration.</li>
            <li>No centred gradient hero, 3 icon cards, carousels or bento grids.</li>
            <li>No glass, no blurry glows, no rounded-3xl everything.</li>
            <li>No sparkles or robots for AI. AI feedback is red-pen comments.</li>
            <li>Every screen has a specific Indian detail.</li>
          </ol>
        </PaperCard>
      </Block>
    </div>
  );
}
