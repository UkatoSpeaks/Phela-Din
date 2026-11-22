"use client";

/**
 * Shares the visitor's "take" (skills ticked, pros/cons that matter, gut
 * check on moments) across the interactive sections of a career file, and
 * saves it on the device.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { emptyTake, loadTake, saveTake } from "@/lib/storage";
import type { CareerTake } from "@/types/career-profile";

type ListKey = "skills" | "pros" | "cons";

interface TakeContextValue {
  take: CareerTake;
  /** False until the saved take has loaded (avoids a flash of "nothing picked"). */
  ready: boolean;
  toggle: (list: ListKey, item: string) => void;
  setMoment: (moment: string, answer: "yes" | "no") => void;
  reset: () => void;
}

const TakeContext = createContext<TakeContextValue | null>(null);

export function TakeProvider({ careerId, children }: { careerId: string; children: ReactNode }) {
  const [take, setTake] = useState<CareerTake>(() => emptyTake(careerId));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTake(loadTake(careerId));
    setReady(true);
  }, [careerId]);

  useEffect(() => {
    if (ready) saveTake(take);
  }, [take, ready]);

  const value: TakeContextValue = {
    take,
    ready,
    toggle: (list, item) =>
      setTake((t) => ({ ...t, [list]: t[list].includes(item) ? t[list].filter((x) => x !== item) : [...t[list], item] })),
    setMoment: (moment, answer) =>
      setTake((t) => {
        const moments = { ...t.moments };
        if (moments[moment] === answer) delete moments[moment]; // tap again to clear
        else moments[moment] = answer;
        return { ...t, moments };
      }),
    reset: () => setTake(emptyTake(careerId)),
  };

  return <TakeContext.Provider value={value}>{children}</TakeContext.Provider>;
}

export function useTake(): TakeContextValue {
  const ctx = useContext(TakeContext);
  if (!ctx) throw new Error("useTake must be used inside <TakeProvider>");
  return ctx;
}
