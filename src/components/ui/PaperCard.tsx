import type { ReactNode } from "react";

type Variant = "sheet" | "ledger" | "file";

interface Props {
  variant?: Variant;
  /** Folder tab label (file variant). */
  tab?: string;
  /** "File No." shown on the cover (file variant). */
  fileNo?: string;
  /** "Subject" line on the cover (file variant). */
  subject?: string;
  as?: "div" | "section" | "article" | "aside";
  className?: string;
  children?: ReactNode;
}

/**
 * The surfaces everything sits on.
 *   sheet: a fresh A4 sheet on the desk
 *   ledger: register paper: blue ruling (28px rhythm) + red margin line
 *   file: brown government-style file cover with tab, File No. and Subject
 */
export function PaperCard({ variant = "sheet", tab, fileNo, subject, as: Tag = "div", className = "", children }: Props) {
  if (variant === "file") {
    return (
      <Tag className={`relative pt-7 ${className}`}>
        <span className="absolute left-0 top-0 h-8 rounded-t-[6px] border-2 border-b-0 border-khaki-2 bg-khaki px-4 pt-1 text-xs font-bold uppercase tracking-[0.12em] text-ink">
          {tab ?? "File"}
        </span>
        <div className="relative rounded-[var(--radius-paper)] rounded-tl-none border-2 border-khaki-2 bg-khaki p-4 shadow-[var(--shadow-paper)] sm:p-5">
          {fileNo || subject ? (
            <dl className="mb-4 grid gap-1.5 text-sm">
              {fileNo ? (
                <div className="flex items-baseline gap-2">
                  <dt className="shrink-0 text-ink/75">
                    <span className="font-hindi">फ़ाइल सं.</span> / File No.
                  </dt>
                  <dd className="flex-1 border-b border-dashed border-ink/50 font-bold tabular-nums">{fileNo}</dd>
                </div>
              ) : null}
              {subject ? (
                <div className="flex items-baseline gap-2">
                  <dt className="shrink-0 text-ink/75">
                    <span className="font-hindi">विषय</span> / Subject
                  </dt>
                  <dd className="flex-1 border-b border-dashed border-ink/50 font-bold">{subject}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
          {children}
        </div>
      </Tag>
    );
  }

  if (variant === "ledger") {
    return (
      <Tag
        className={`relative rounded-[var(--radius-paper)] bg-sheet py-[14px] pl-12 pr-4 leading-[28px] shadow-[var(--shadow-paper)] sm:pr-6 ${className}`}
        style={{
          // One 1px rule at the bottom of every 28px row (= the line-height), offset by the
          // 14px top padding so each rule sits under a line of text. Lines, not a gradient fill.
          backgroundImage: "linear-gradient(to bottom, transparent 27px, var(--color-rule) 27px)",
          backgroundSize: "100% 28px",
          backgroundPosition: "0 14px",
        }}
      >
        {/* Double red margin line, like a school register. */}
        <span aria-hidden className="absolute inset-y-0 left-8 w-[3px] border-x border-margin/70" />
        {children}
      </Tag>
    );
  }

  return (
    <Tag className={`rounded-[var(--radius-paper)] bg-sheet p-4 shadow-[var(--shadow-paper)] sm:p-6 ${className}`}>{children}</Tag>
  );
}
