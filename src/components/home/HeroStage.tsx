"use client";

/**
 * Hero: "Who do you want to be on your pehla din?"
 * Tap a passport photo → that character steps up to the desk and tells you a
 * real moment from the job, plus the reality check. Auto-plays until the
 * visitor touches it (never under reduced motion).
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "./Avatar";
import type { CastMember } from "./cast";

gsap.registerPlugin(useGSAP);

const AUTOPLAY_MS = 4200;

export function HeroStage({ cast }: { cast: CastMember[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(1); // open on the doctor: the biggest aspirant group
  const [touched, setTouched] = useState(false);
  const [excited, setExcited] = useState(false);
  const member = cast[index] ?? cast[0]!;

  // Auto-play until the visitor interacts; pause when the tab is hidden.
  useEffect(() => {
    if (touched) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % cast.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [touched, cast.length]);

  // Entrance for each new character + speech bubble.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".hs-avatar", { y: 36, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.8)" });
        gsap.fromTo(".hs-bubble", { scale: 0.6, opacity: 0, rotation: -6 }, { scale: 1, opacity: 1, rotation: -2, duration: 0.35, delay: 0.18, ease: "back.out(2.2)", transformOrigin: "20% 100%" });
        gsap.fromTo(".hs-reality", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.3 });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [index], revertOnUpdate: true },
  );

  // Idle life: a gentle bob and a blink every few seconds.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".hs-avatar .av-bob", { y: -3, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap
          .timeline({ repeat: -1, repeatDelay: 3.2, delay: 1.5 })
          .to(".hs-avatar .av-eyes", { scaleY: 0.1, duration: 0.07, ease: "none" })
          .to(".hs-avatar .av-eyes", { scaleY: 1, duration: 0.09, ease: "none" });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [index], revertOnUpdate: true },
  );

  function pick(i: number) {
    setTouched(true);
    setIndex(i);
    setExcited(true);
    window.setTimeout(() => setExcited(false), 900);
  }

  return (
    <div ref={root} className="flex flex-col gap-4">
      {/* The desk the character stands at */}
      <div className="relative overflow-hidden rounded-[var(--radius-paper)] border-2 border-ink bg-sheet shadow-[var(--shadow-lift)]">
        {/* pinboard ruling behind */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(to bottom, transparent 27px, var(--color-rule) 27px)", backgroundSize: "100% 28px", opacity: 0.45 }}
        />
        <div className="relative flex min-h-[19rem] items-end justify-center px-4 pt-4 sm:min-h-[22rem]">
          {/* Speech bubble: a real moment from the research */}
          <figure
            key={`b-${index}`}
            className="hs-bubble absolute left-3 top-3 z-10 max-w-[13.5rem] rotate-[-2deg] rounded-[10px] border-2 border-ink bg-sheet px-3 py-2 shadow-[var(--shadow-note)] sm:left-5 sm:top-5 sm:max-w-[16rem]"
          >
            <figcaption className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-2">A day in the job</figcaption>
            <blockquote className="mt-0.5 font-display text-[19px] font-semibold leading-snug sm:text-[22px]">{member.scene}</blockquote>
            {/* bubble tail */}
            <span aria-hidden className="absolute -bottom-[11px] left-8 h-5 w-5 rotate-45 border-b-2 border-r-2 border-ink bg-sheet" />
          </figure>

          <div key={`a-${index}`} className="hs-avatar relative z-0 w-[11.5rem] translate-y-2 sm:w-[13.5rem]">
            <Avatar id={member.avatar} excited={excited} title={`${member.name}, ${member.role}`} />
          </div>
        </div>
        {/* desk edge + name plate */}
        <div className="relative border-t-[3px] border-ink bg-khaki px-4 py-2.5">
          <p className="flex flex-wrap items-baseline justify-between gap-x-3">
            <span className="font-display text-lg font-semibold">
              {member.name} <span className="font-sans text-sm font-normal text-ink/80">· {member.role}</span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/80">{member.live ? "Live now" : "Coming soon"}</span>
          </p>
        </div>
      </div>

      {member.reality ? (
        <p key={`r-${index}`} className="hs-reality text-sm leading-snug" aria-live="polite">
          <span className="font-bold uppercase tracking-[0.1em] text-margin-deep">Reality check · </span>
          {member.reality}.{" "}
          <Link href={`/careers/${member.careerId}`} className="font-bold underline decoration-chai decoration-2 underline-offset-4">
            Open the {member.careerName} file
          </Link>
        </p>
      ) : null}

      {/* Passport-photo picker */}
      <div role="group" aria-label="Choose a career to preview" className="flex justify-between gap-2 sm:justify-start sm:gap-4">
        {cast.map((c, i) => {
          const active = i === index;
          return (
            <button
              key={c.avatar}
              type="button"
              onClick={() => pick(i)}
              aria-pressed={active}
              aria-label={`${c.careerName}: preview ${c.name}`}
              className="group flex min-w-0 flex-col items-center gap-1"
            >
              <span
                className={`block w-14 overflow-hidden rounded-full border-2 bg-paper-2 transition-[transform,border-color] duration-200 sm:w-16 ${
                  active ? "scale-110 border-ink shadow-[0_3px_0_0_var(--color-ink)]" : "border-ink/30 group-hover:border-ink"
                }`}
              >
                <Avatar id={c.avatar} crop="head" className="w-full" />
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-[0.1em] ${active ? "text-ink" : "text-ink-2"}`}>{c.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
