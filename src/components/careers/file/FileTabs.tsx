"use client";

/**
 * Sticky folder-divider tabs for a career file. Highlights the section
 * you're reading (scroll-spy) and jumps to a section on tap.
 */
import { useEffect, useRef, useState } from "react";

export interface FileTab {
  id: string;
  label: string;
}

export function FileTabs({ tabs }: { tabs: FileTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = tabs.map((t) => document.getElementById(t.id)).filter((el): el is HTMLElement => !!el);
    // The last section is often too short to reach the spy line, so at the very
    // bottom of the page it wins, whatever the observer says.
    const last = tabs[tabs.length - 1]?.id;
    const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const io = new IntersectionObserver(
      (entries) => {
        if (last && atBottom()) return setActive(last);
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const onScroll = () => {
      if (last && atBottom()) setActive(last);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [tabs]);

  // Keep the active tab visible in the scrollable strip.
  useEffect(() => {
    const el = strip.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label="Sections of this file" className="sticky top-0 z-20 -mx-4 border-b-2 border-ink bg-paper px-4 pt-2">
      <div ref={strip} className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <a
              key={t.id}
              href={`#${t.id}`}
              data-tab={t.id}
              aria-current={on ? "location" : undefined}
              onClick={() => setActive(t.id)}
              className={`-mb-[2px] flex min-h-10 shrink-0 items-center rounded-t-[6px] border-2 px-3 text-[13px] font-bold transition-colors ${
                on ? "border-ink border-b-paper bg-paper text-ink" : "border-ink/20 bg-paper-2 text-ink-2 hover:text-ink"
              }`}
            >
              {t.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
