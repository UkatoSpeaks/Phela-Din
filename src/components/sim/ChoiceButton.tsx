interface Props {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  /** Highlights the picked choice while its outcome is shown. */
  selected?: boolean;
}

export function ChoiceButton({ text, onClick, disabled, selected }: Props) {
  const state = selected
    ? "border-terracotta bg-terracotta/10"
    : disabled
      ? "border-line opacity-50"
      : "border-line hover:border-saffron hover:bg-saffron/10 active:scale-[0.98]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`min-h-14 w-full rounded-2xl border-2 bg-card px-5 py-3 text-left text-base font-medium transition ${state}`}
    >
      {text}
    </button>
  );
}
