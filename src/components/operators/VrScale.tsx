type VrScaleProps = {
  value: number | null;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function VrScale({ value }: VrScaleProps) {
  const hasValue = typeof value === "number" && Number.isFinite(value);
  const position = hasValue
    ? ((clamp(value, 1, 6) - 1) / 5) * 100
    : null;

  return (
    <div className="w-full">
      <div
        className={`relative h-2 w-full overflow-hidden rounded-full ${hasValue ? "" : "opacity-50"}`}
        style={{
          background: hasValue
            ? "linear-gradient(to right, var(--accent) 0%, var(--accent) 40%, var(--vr-warn-text) 40%, var(--vr-warn-text) 80%, var(--vr-danger-text) 80%, var(--vr-danger-text) 100%)"
            : "var(--border)",
        }}
      >
        {position !== null ? (
          <span
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-rr-surface shadow-sm"
            style={{ left: `calc(${position}% - 6px)` }}
          />
        ) : null}
      </div>

      <div className="mt-1 flex items-center justify-between text-[10px] text-rr-muted">
        <span>VR 1</span>
        <span>VR 6+</span>
      </div>
    </div>
  );
}