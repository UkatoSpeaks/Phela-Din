import type { MeterKey, Meters } from "@/types/simulation";

const METERS: { key: MeterKey; label: string; emoji: string; color: string }[] = [
  { key: "energy", label: "Energy", emoji: "⚡", color: "bg-leaf" },
  { key: "stress", label: "Stress", emoji: "😣", color: "bg-terracotta" },
  { key: "satisfaction", label: "Satisfaction", emoji: "😊", color: "bg-saffron" },
];

export function MeterBar({ meters }: { meters: Meters }) {
  return (
    <div className="grid grid-cols-3 gap-3 rounded-2xl bg-card/80 p-3 shadow-sm backdrop-blur">
      {METERS.map(({ key, label, emoji, color }) => {
        const value = Math.round(meters[key]);
        return (
          <div key={key}>
            <div className="flex items-center justify-between text-xs font-medium">
              <span>
                <span aria-hidden>{emoji}</span> {label}
              </span>
              <span className="tabular-nums text-muted">{value}</span>
            </div>
            <div
              className="mt-1 h-2.5 overflow-hidden rounded-full bg-line"
              role="meter"
              aria-label={label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={value}
            >
              <div
                className={`h-full rounded-full ${color} transition-[width] duration-700 ease-out`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
