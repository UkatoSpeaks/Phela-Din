"use client";

/**
 * Reveals its content when scrolled into view.
 *
 * Progressive: the server renders content visible. After hydration, only
 * blocks that are still below the fold get "armed" (hidden), then "shown"
 * as they enter the viewport. Without JS, or under reduced motion, content is
 * simply there. Children can react via Tailwind's
 * `group-data-[reveal=armed]/reveal:` variants (e.g. bars growing from 0).
 */
import { useEffect, useRef, useState, type ReactNode } from "react";

type State = "static" | "armed" | "shown";

export function Reveal({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "li" }) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<State>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return; // already on screen: leave it
    setState("armed");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as never} data-reveal={state} className={`group/reveal ${className}`}>
      {children}
    </Tag>
  );
}
