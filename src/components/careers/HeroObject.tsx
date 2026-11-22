import type { ReactNode } from "react";
import { Avatar, type AvatarId } from "@/components/home/Avatar";
import { PaperCard } from "@/components/ui/PaperCard";
import type { HeroObject as HeroObjectKind } from "@/types/simulation";

/**
 * The object that frames a career's file page (docs/design.md §1.1).
 * Every variant wraps the same header content (children); only the object
 * around it changes. The rest of the page uses the standard paper components.
 */
interface Props {
  kind: HeroObjectKind;
  careerName: string;
  category: string;
  fileNo: string;
  avatar?: AvatarId;
  /** A real line from the research, used where the object has a "notification" or note slot. */
  sceneLine?: string;
  dataAsOf?: string;
  children: ReactNode;
}

export function HeroObject(props: Props) {
  switch (props.kind) {
    case "prescription_pad":
      return <PrescriptionPad {...props} />;
    case "sketchbook":
      return <Sketchbook {...props} />;
    case "phone":
      return <PhoneScreen {...props} />;
    case "sticker_notebook":
      return <StickerNotebook {...props} />;
    default:
      return (
        <PaperCard variant="file" tab={props.category} fileNo={props.fileNo} subject={props.careerName}>
          {props.children}
        </PaperCard>
      );
  }
}

/** Doctor: an OPD prescription pad with ℞ letterhead and a signature line. */
function PrescriptionPad({ children, fileNo, dataAsOf }: Props) {
  return (
    <div className="relative rounded-[var(--radius-paper)] bg-sheet shadow-[var(--shadow-paper)]">
      <div className="flex items-start justify-between gap-3 border-b-[3px] border-double border-leaf-deep px-4 pb-3 pt-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="font-display text-5xl font-bold leading-none text-leaf-deep" aria-hidden>
            ℞
          </span>
          <div>
            <p className="font-display text-lg font-semibold leading-tight text-leaf-deep">Pehla Din OPD</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-2">Career consultation</p>
          </div>
        </div>
        <dl className="text-right text-[11px] leading-snug text-ink-2">
          <dt className="sr-only">Registration number</dt>
          <dd className="font-bold tabular-nums">Reg. {fileNo}</dd>
          {dataAsOf ? (
            <>
              <dt className="sr-only">Date</dt>
              <dd>{dataAsOf}</dd>
            </>
          ) : null}
        </dl>
      </div>
      <div className="px-4 py-5 sm:px-6">{children}</div>
      <div className="flex items-end justify-end gap-2 px-4 pb-4 sm:px-6">
        <span className="font-hand text-xl text-ink-2">Signature</span>
        <span className="mb-1.5 w-28 border-b border-ink/50" />
      </div>
    </div>
  );
}

/** UI/UX: a spiral-bound sketchbook page with a dotted grid and pencil notes. */
function Sketchbook({ children }: Props) {
  return (
    <div className="relative pt-4">
      {/* spiral binding */}
      <div aria-hidden className="absolute inset-x-6 top-0 z-10 flex justify-between">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} className="block h-6 w-2.5 rounded-full border-2 border-ink bg-paper" />
        ))}
      </div>
      <div
        className="relative overflow-hidden rounded-[var(--radius-paper)] bg-sheet px-4 pb-12 pt-8 shadow-[var(--shadow-paper)] sm:px-6"
        style={{ backgroundImage: "radial-gradient(circle, rgb(30 26 21 / 0.18) 1px, transparent 1.2px)", backgroundSize: "18px 18px" }}
      >
        {/* rough wireframe in the corner */}
        <svg aria-hidden viewBox="0 0 90 70" className="pointer-events-none absolute -right-3 top-6 hidden w-28 rotate-6 opacity-40 sm:block">
          <rect x="2" y="2" width="86" height="66" rx="4" fill="none" stroke="#1e1a15" strokeWidth="1.5" strokeDasharray="4 3" />
          <rect x="10" y="10" width="40" height="8" fill="none" stroke="#1e1a15" strokeWidth="1.5" />
          <path d="M10 28 H78 M10 36 H66 M10 44 H72" stroke="#1e1a15" strokeWidth="1.5" />
          <rect x="54" y="52" width="26" height="10" rx="3" fill="none" stroke="#1e1a15" strokeWidth="1.5" />
        </svg>
        <p aria-hidden className="absolute bottom-2 right-4 rotate-[-4deg] font-hand text-lg text-chai-deep">
          draft 5, make the logo bigger?
        </p>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

/** Content Creator: a phone screen with the channel header and a notification. */
function PhoneScreen({ children, avatar, sceneLine }: Props) {
  return (
    <div className="mx-auto w-full max-w-[26rem] rounded-[30px] border-[7px] border-ink bg-ink shadow-[var(--shadow-lift)]">
      <div className="overflow-hidden rounded-[22px] bg-sheet">
        <div className="flex items-center justify-between bg-ink px-5 pb-1.5 pt-1 text-[11px] font-bold text-sheet">
          <span className="tabular-nums">9:41</span>
          <span aria-hidden className="h-4 w-16 rounded-full bg-[#000]" />
          <span className="tabular-nums">72%</span>
        </div>
        {sceneLine ? (
          <div className="mx-3 mt-3 flex items-start gap-2 rounded-[12px] border-2 border-ink bg-paper px-3 py-2 shadow-[0_2px_0_0_var(--color-ink)]">
            <span aria-hidden className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-margin" />
            <p className="text-[13px] leading-snug">
              <span className="font-bold">Studio</span> · {sceneLine}
            </p>
          </div>
        ) : null}
        <div className="flex items-center gap-3 px-4 pt-4">
          {avatar ? (
            <span className="block w-14 shrink-0 overflow-hidden rounded-full border-2 border-ink bg-paper-2">
              <Avatar id={avatar} crop="head" className="w-full" />
            </span>
          ) : null}
          <div>
            <p className="font-bold leading-tight">Your channel</p>
            <p className="text-xs text-ink-2">A week as a creator · Pehla Din</p>
          </div>
        </div>
        <div className="px-4 pb-6 pt-4">{children}</div>
      </div>
    </div>
  );
}

const STICKERS: { text: string; cls: string }[] = [
  { text: "it works on my machine", cls: "left-3 top-3 -rotate-6 bg-haldi" },
  { text: "git push --force?", cls: "right-3 top-5 rotate-3 bg-rose" },
  { text: "{ }", cls: "bottom-4 left-4 rotate-[8deg] bg-sky font-display text-base" },
  { text: "chai > coffee", cls: "bottom-3 right-4 -rotate-3 bg-sheet" },
];

/** Engineer / AI-ML: a dark notebook (laptop-lid style) covered in stickers, with a paper label. */
function StickerNotebook({ children }: Props) {
  return (
    <div className="relative rounded-[12px] bg-[#2c2620] px-3 pb-14 pt-14 shadow-[var(--shadow-lift)] sm:px-8">
      {STICKERS.map((s) => (
        <span
          key={s.text}
          aria-hidden
          className={`absolute rounded-[6px] px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.06em] text-ink outline outline-[3px] outline-sheet ${s.cls}`}
        >
          {s.text}
        </span>
      ))}
      <div className="relative rounded-[var(--radius-paper)] bg-sheet p-4 sm:p-6">{children}</div>
    </div>
  );
}
