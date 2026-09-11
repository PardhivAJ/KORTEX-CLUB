type ProgressBarProps = {
  value: number;
  label?: string;
  max?: number;
  accent?: "orange" | "white" | "amber";
  className?: string;
};

export default function ProgressBar({
  value,
  label,
  max = 100,
  accent = "orange",
  className = ""
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const percent = (clamped / max) * 100;
  const accentClass =
    accent === "white"
      ? "bg-[var(--text-main)]"
      : accent === "amber"
        ? "bg-[#38bdf8]"
        : "bg-gradient-to-r from-[#22d3ee] via-[#2563eb] to-[#60a5fa]";

  return (
    <div className={`w-full ${className}`.trim()}>
      {label ? (
        <div className="mb-2 flex items-center justify-between gap-2 text-xs font-medium text-[#a5a5a0]">
          <span>{label}</span>
          <span className="text-[#f5f5f3]">{Math.round(percent)}%</span>
        </div>
      ) : null}
      <div className="progress-track h-2.5 overflow-hidden rounded-full border">
        <div
          className={`h-full rounded-full shadow-[0_0_18px_rgba(34,211,238,0.45)] transition-all duration-500 ${accentClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
