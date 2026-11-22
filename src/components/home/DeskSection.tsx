"use client";

/**
 * "Every job has a different desk": career chips swap the props on a 3D desk.
 *
 * Loading rules (docs/design.md §7):
 *   - Three.js is code-split (next/dynamic, ssr: false) and only requested
 *     when this section is ~1 screen away. It never loads on other pages.
 *   - While it loads, under prefers-reduced-motion, or without WebGL, a
 *     static render of the same desk is shown instead.
 *   - Rendering pauses when the section is off-screen.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { AvatarId } from "./Avatar";

interface DeskInfo {
  id: AvatarId;
  label: string;
  /** What's on this desk, for the caption and for screen readers. */
  caption: string;
}

const DESKS: DeskInfo[] = [
  { id: "engineer", label: "Engineer", caption: "Code on the monitor, a clicky mechanical keyboard, and a rubber duck for debugging." },
  { id: "doctor", label: "Doctor", caption: "A tablet showing an ECG, a stethoscope and a weekly pill organiser." },
  { id: "ca", label: "CA", caption: "A spreadsheet on the monitor, a calculator and a pile of client files." },
  { id: "officer", label: "IAS", caption: "A video call on the laptop, a tied stack of files, the desk flag, and a phone that won't stop ringing." },
  { id: "creator", label: "Creator", caption: "Phone on a tripod in a ring light, a mic on a boom arm, and an edit on the laptop." },
];

function Fallback({ id, caption }: { id: AvatarId; caption: string }) {
  // Static renders of the same scene, generated from the 3D desk (public/home/).
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/home/desk-${id}.webp`} alt={caption} width={720} height={540} className="h-full w-full object-cover" />;
}

const DeskScene = dynamic(() => import("./DeskScene"), { ssr: false, loading: () => null });

function canUse3D() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function DeskSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [near, setNear] = useState(false); // within ~1 screen: start loading 3D
  const [visible, setVisible] = useState(false); // on screen: render frames
  const [use3D, setUse3D] = useState(false);
  const desk = DESKS[index] ?? DESKS[0]!;

  useEffect(() => {
    setUse3D(canUse3D());
    const el = ref.current;
    if (!el) return;
    const nearObs = new IntersectionObserver(([e]) => e?.isIntersecting && setNear(true), { rootMargin: "100% 0px" });
    const visObs = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: 0.05 });
    nearObs.observe(el);
    visObs.observe(el);
    return () => {
      nearObs.disconnect();
      visObs.disconnect();
    };
  }, []);

  return (
    <section aria-labelledby="desk-title" className="mx-auto w-full min-w-0 max-w-5xl">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-2">The desk</p>
      <h2 id="desk-title" className="mt-1 max-w-[18ch] text-[32px] font-semibold leading-[1.1] sm:text-[44px]">
        Every job has a different desk.
      </h2>
      <p className="mt-2 max-w-prose text-ink-2">Same chai, same phone buzzing, same Tiffin on the desk. Everything else changes. Pick a job and drag to look around.</p>

      <div role="group" aria-label="Choose a desk" className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1">
        {DESKS.map((d, i) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-pressed={i === index}
            className={`min-h-11 shrink-0 rounded-[var(--radius-control)] border-2 px-4 text-sm font-bold transition ${
              i === index ? "border-ink bg-ink text-sheet" : "border-ink/30 bg-sheet hover:border-ink"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div
        ref={ref}
        className="relative mt-4 aspect-[4/3] w-full touch-pan-y overflow-hidden rounded-[var(--radius-paper)] border-2 border-ink bg-paper shadow-[var(--shadow-lift)] sm:aspect-[16/9]"
      >
        {/* Static render underneath: visible while 3D loads, or instead of it. */}
        <div className="absolute inset-0">
          <Fallback id={desk.id} caption={desk.caption} />
        </div>
        {use3D && near ? (
          <div className="absolute inset-0">
            <DeskScene career={desk.id} active={visible} />
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-ink-2" aria-live="polite">
        <span className="font-bold text-ink">{desk.label}:</span> {desk.caption}
      </p>
    </section>
  );
}
