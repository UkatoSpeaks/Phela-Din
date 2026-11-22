import type { ReactNode } from "react";
import type { Scene } from "@/types/simulation";

interface Props {
  scene: Scene;
  children?: ReactNode;
}

/** Shared shell for every scene type: time + situation text, then actions. */
export function SceneCard({ scene, children }: Props) {
  return (
    <article key={scene.id} className="animate-fade-up rounded-3xl bg-card p-6 shadow-sm">
      <p className="text-sm font-semibold text-terracotta">🕘 {scene.time}</p>
      <p className="mt-3 text-lg leading-relaxed">{scene.text}</p>
      {children ? <div className="mt-6 flex flex-col gap-3">{children}</div> : null}
    </article>
  );
}
