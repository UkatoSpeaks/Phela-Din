"use client";

/**
 * Tiffin: the three-tier steel dabba that shows how the player is doing.
 *
 *   energy       → food (haldi) fill level inside the tiers
 *   stress       → steam wisps + a rattling lid
 *   satisfaction → warm glow behind it
 *
 * Moods (sustained, from meters): idle · steaming · sleepy.
 * Reactions (< 600ms, from a choice): happy · wince · shocked.
 * Tap Tiffin to show the actual numbers, so the meaning is never visual-only.
 *
 * GSAP lives only here (and in the components that import this): the
 * simulation player and /design. Reduced motion: no loops or bounces, just
 * the static drawing with the right expression.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useId, useRef, useState } from "react";
import {
  TIFFIN_RULES,
  deriveMood,
  glowStrength,
  rattleAmplitude,
  steamLevel,
  type TiffinExpression,
  type TiffinMood,
  type TiffinReaction,
} from "@/lib/tiffin";
import type { Meters } from "@/types/simulation";

gsap.registerPlugin(useGSAP);

export interface TiffinReactionCue {
  type: TiffinReaction;
  /** Change this number to replay (e.g. a counter). */
  key: number;
}

interface Props {
  meters: Meters;
  /** Rendered width in px. Tiffin stays readable down to 64. */
  size?: number;
  reaction?: TiffinReactionCue | null;
  /** Force a mood instead of deriving it from meters (used on /design). */
  mood?: TiffinMood;
  /** Where the tap-to-reveal values slip opens. */
  readout?: "below" | "right" | "none";
  className?: string;
}

const INK = "var(--color-ink)";
const STEEL = "var(--color-steel)";
const HALDI = "var(--color-haldi)";
const SHEET = "var(--color-sheet)";

// Geometry (viewBox 0 -24 100 136). Food window spans y 43 → 105.
const FOOD_TOP = 43;
const FOOD_RANGE = 62;

function Face({ expression }: { expression: TiffinExpression }) {
  const s = { stroke: INK, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  switch (expression) {
    case "happy":
      return (
        <g>
          <path d="M34 53 Q39 46 44 53" {...s} />
          <path d="M56 53 Q61 46 66 53" {...s} />
          <path d="M42 58 Q50 67 58 58 Z" fill={INK} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        </g>
      );
    case "wince":
      return (
        <g>
          <path d="M35 47 L43 51 L35 55" {...s} />
          <path d="M65 47 L57 51 L65 55" {...s} />
          <path d="M42 61 q4 -3.5 8 0 t8 0" {...s} />
        </g>
      );
    case "shocked":
      return (
        <g>
          <circle cx="39" cy="51" r="5.2" fill={SHEET} stroke={INK} strokeWidth={2.6} />
          <circle cx="61" cy="51" r="5.2" fill={SHEET} stroke={INK} strokeWidth={2.6} />
          <circle cx="39" cy="51" r="2" fill={INK} />
          <circle cx="61" cy="51" r="2" fill={INK} />
          <ellipse cx="50" cy="62" rx="3.4" ry="4" fill={INK} />
        </g>
      );
    case "steaming":
      return (
        <g>
          <path d="M33 44 L44 48" {...s} />
          <path d="M67 44 L56 48" {...s} />
          <ellipse cx="39" cy="53" rx="3.2" ry="3.6" fill={INK} />
          <ellipse cx="61" cy="53" rx="3.2" ry="3.6" fill={INK} />
          <path d="M43 61 H57" {...s} />
        </g>
      );
    case "sleepy":
      return (
        <g>
          <path d="M34 52 Q39 56 44 52" {...s} />
          <path d="M56 52 Q61 56 66 52" {...s} />
          <ellipse cx="50" cy="61" rx="2.4" ry="2" fill={INK} />
        </g>
      );
    default:
      // idle: a slightly cheeky smirk, not a baby smile
      return (
        <g>
          <ellipse cx="39" cy="51" rx="3.2" ry="4" fill={INK} />
          <ellipse cx="61" cy="51" rx="3.2" ry="4" fill={INK} />
          <path d="M33 44.5 Q38 42.5 43 44" {...s} strokeWidth={2.4} />
          <path d="M44 60 Q51 63.5 57 58.5" {...s} />
        </g>
      );
  }
}

/** Three wisps of steam drawn as ink strokes. */
const WISPS = ["M30 20 q-4 -6 0 -12 t0 -12", "M50 3 q-4 -6 0 -12 t0 -12", "M70 20 q4 -6 0 -12 t0 -12"];

export function Tiffin({ meters, size = 96, reaction, mood: forcedMood, readout = "below", className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [reacting, setReacting] = useState<TiffinReaction | null>(null);

  const mood = forcedMood ?? deriveMood(meters);
  const wisps = forcedMood === "steaming" ? 3 : steamLevel(meters.stress);
  const glow = glowStrength(meters.satisfaction);
  const rattle = forcedMood === "steaming" ? Math.max(1.2, rattleAmplitude(meters.stress)) : rattleAmplitude(meters.stress);
  const expression: TiffinExpression = reacting ?? mood;
  const foodOffset = FOOD_RANGE * (1 - Math.min(100, Math.max(0, meters.energy)) / 100);

  // --- Sustained motion: breathing, rattle, steam, z's --------------------
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const sleepy = mood === "sleepy";
        gsap.to(".tf-breath", {
          scaleY: sleepy ? 1.035 : 1.018,
          rotation: sleepy ? -2 : 0,
          duration: sleepy ? 1.8 : 1.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          svgOrigin: "50 108",
        });
        if (rattle > 0) {
          gsap.to(".tf-lid-rattle", {
            x: () => gsap.utils.random(-rattle, rattle),
            rotation: () => gsap.utils.random(-rattle * 1.5, rattle * 1.5),
            duration: 0.07,
            repeat: -1,
            repeatRefresh: true,
            ease: "none",
            svgOrigin: "50 40",
          });
        }
        gsap.fromTo(
          ".tf-wisp",
          { y: 4, opacity: 0 },
          { y: -6, opacity: 1, duration: 0.9, ease: "sine.out", stagger: 0.3, repeat: -1, yoyo: true },
        );
        if (sleepy) {
          gsap.fromTo(".tf-z", { y: 4, opacity: 0 }, { y: -8, opacity: 1, duration: 1.4, stagger: 0.7, repeat: -1, ease: "sine.out" });
        }
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [mood, rattle, wisps], revertOnUpdate: true },
  );

  // --- Energy: food level glides to its new height --------------------------
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(".tf-food", { y: foodOffset, duration: reduce ? 0 : 0.5, ease: "power2.out" });
    },
    { scope: root, dependencies: [foodOffset] },
  );

  // --- Reactions: < 600ms, then back to the mood -----------------------------
  const { contextSafe } = useGSAP({ scope: root });
  useEffect(() => {
    if (!reaction) return;
    setReacting(reaction.type);
    const t = window.setTimeout(() => setReacting(null), TIFFIN_RULES.reactionMs);

    const play = contextSafe(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({ defaults: { svgOrigin: "50 108" } });
      if (reaction.type === "happy") {
        tl.to(".tf-react", { y: -9, scaleY: 1.06, duration: 0.16, ease: "power2.out" })
          .to(".tf-react", { y: 0, scaleY: 0.94, duration: 0.14, ease: "power2.in" })
          .to(".tf-react", { scaleY: 1, duration: 0.18, ease: "back.out(3)" });
      } else if (reaction.type === "wince") {
        tl.to(".tf-react", { scaleX: 1.07, scaleY: 0.9, duration: 0.12, ease: "power2.out" })
          .to(".tf-react", { x: -2, duration: 0.06 })
          .to(".tf-react", { x: 2, duration: 0.06 })
          .to(".tf-react", { x: 0, scaleX: 1, scaleY: 1, duration: 0.2, ease: "power2.out" });
      } else {
        tl.to(".tf-react", { y: -5, duration: 0.12, ease: "power3.out" }, 0)
          .to(".tf-lid-pop", { y: -12, rotation: -10, svgOrigin: "50 40", duration: 0.14, ease: "power3.out" }, 0)
          .to(".tf-react", { y: 0, duration: 0.24, ease: "bounce.out" }, 0.14)
          .to(".tf-lid-pop", { y: 0, rotation: 0, svgOrigin: "50 40", duration: 0.28, ease: "bounce.out" }, 0.16);
      }
    });
    play();
    return () => window.clearTimeout(t);
    // Replay only when the cue's key changes.
  }, [reaction?.key]);

  const values = [
    { label: "Energy", value: meters.energy, shows: "food level" },
    { label: "Stress", value: meters.stress, shows: "steam" },
    { label: "Satisfaction", value: meters.satisfaction, shows: "glow" },
  ];
  const summary = values.map((v) => `${v.label} ${Math.round(v.value)}`).join(", ");
  const slipId = `tf-slip-${uid}`;

  return (
    <div ref={root} className={`relative inline-flex ${readout === "right" ? "items-center gap-3" : "flex-col items-center"} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        aria-expanded={readout === "none" ? undefined : open}
        aria-controls={readout === "none" ? undefined : slipId}
        aria-label={`Tiffin. ${summary}.${readout === "none" ? "" : open ? " Hide values." : " Show values."}`}
        className="shrink-0 rounded-[var(--radius-control)] p-1 [-webkit-touch-callout:none]"
        style={{ width: size + 8 }}
      >
        <svg viewBox="0 -24 100 136" className="block h-auto w-full overflow-visible" aria-hidden>
          <defs>
            <radialGradient id={`tf-glow-${uid}`}>
              <stop offset="0%" stopColor={HALDI} stopOpacity="1" />
              <stop offset="55%" stopColor={HALDI} stopOpacity="0.6" />
              <stop offset="100%" stopColor={HALDI} stopOpacity="0" />
            </radialGradient>
            <clipPath id={`tf-window-${uid}`}>
              <rect x="23" y="43" width="54" height="63" rx="3" />
            </clipPath>
          </defs>

          {/* Satisfaction: warm glow (the one sanctioned gradient, see docs/design.md §3) */}
          <circle cx="50" cy="64" r="62" fill={`url(#tf-glow-${uid})`} opacity={glow} style={{ transition: "opacity 500ms ease-out" }} />

          <g className="tf-breath">
            <g className="tf-react">
              {/* Tiers: steel bodies */}
              <rect x="20" y="40" width="60" height="28" rx="5" fill={STEEL} />
              <rect x="20" y="68" width="60" height="20" rx="4" fill={STEEL} />
              <rect x="20" y="88" width="60" height="20" rx="4" fill={STEEL} />

              {/* Polished-steel highlights */}
              <path d="M26 47 V61 M26 73 V83 M26 93 V103" stroke={SHEET} strokeWidth="2.6" strokeLinecap="round" opacity="0.75" />

              {/* Energy: food level (dal-yellow) with a soft wavy top */}
              <g clipPath={`url(#tf-window-${uid})`}>
                <g className="tf-food" transform={`translate(0 ${foodOffset})`}>
                  <path d={`M23 ${FOOD_TOP} q6.75 -2.6 13.5 0 t13.5 0 t13.5 0 t13.5 0 V108 H23 Z`} fill={HALDI} />
                </g>
              </g>

              {/* Tier outlines + rims */}
              <rect x="20" y="40" width="60" height="28" rx="5" fill="none" stroke={INK} strokeWidth="3" />
              <rect x="20" y="68" width="60" height="20" rx="4" fill="none" stroke={INK} strokeWidth="3" />
              <rect x="20" y="88" width="60" height="20" rx="4" fill="none" stroke={INK} strokeWidth="3" />
              <path d="M16.5 68 H83.5 M16.5 88 H83.5" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />

              <Face expression={expression} />

              {/* Carrier: side bars, clamps, handle */}
              <path d="M13 106 V33 M87 106 V33" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
              <path d="M13 33 Q13 22 25 21 L39 20 Q50 2 61 20 L75 21 Q87 22 87 33" fill="none" stroke={INK} strokeWidth="3.4" strokeLinejoin="round" />
              <rect x="10" y="74" width="7" height="8" rx="1.5" fill={INK} />
              <rect x="83" y="74" width="7" height="8" rx="1.5" fill={INK} />
              <rect x="10" y="94" width="7" height="8" rx="1.5" fill={INK} />
              <rect x="83" y="94" width="7" height="8" rx="1.5" fill={INK} />

              {/* Lid (rattles under stress, pops when shocked) */}
              <g className="tf-lid-pop">
                <g className="tf-lid-rattle">
                  <path d="M18 41.5 Q19 30 50 29 Q81 30 82 41.5 Z" fill={STEEL} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
                  <rect x="44" y="23.5" width="12" height="6.5" rx="2" fill={STEEL} stroke={INK} strokeWidth="2.6" />
                </g>
              </g>
            </g>
          </g>

          {/* Stress: steam */}
          {WISPS.slice(0, wisps).map((d, i) => (
            <path key={i} className="tf-wisp" d={d} fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" opacity="0.85" />
          ))}

          {/* Sleepy z's */}
          {mood === "sleepy" && !reacting ? (
            <g fill={INK} fontWeight="800" fontFamily="var(--font-display)">
              <text className="tf-z" x="84" y="22" fontSize="12">z</text>
              <text className="tf-z" x="92" y="8" fontSize="16">z</text>
            </g>
          ) : null}
        </svg>
      </button>

      {readout !== "none" && open ? (
        <div
          id={slipId}
          role="status"
          className={`z-20 w-52 animate-slide rounded-[var(--radius-paper)] border-2 border-ink bg-sheet p-3 text-sm shadow-[var(--shadow-lift)] ${
            readout === "below" ? "absolute left-1/2 top-full mt-2 -translate-x-1/2" : "absolute left-full top-0 ml-2"
          }`}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">
            Tiffin slip · <span className="font-hindi normal-case tracking-normal">टिफ़िन</span>
          </p>
          <dl className="mt-2 space-y-1.5">
            {values.map((v) => (
              <div key={v.label} className="grid grid-cols-[1fr_auto] items-baseline gap-x-2">
                <dt className="font-bold">
                  {v.label} <span className="text-xs font-normal text-ink-2">({v.shows})</span>
                </dt>
                <dd className="tabular-nums font-bold">{Math.round(v.value)}</dd>
                <div className="col-span-2 h-1.5 bg-paper-2">
                  <div className="h-full bg-ink" style={{ width: `${Math.round(v.value)}%` }} />
                </div>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs text-ink-2">Out of 100. Tap Tiffin to close.</p>
        </div>
      ) : null}
    </div>
  );
}
