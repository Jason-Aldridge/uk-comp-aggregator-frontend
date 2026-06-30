export function titleColorVar(value?: string | null): string | undefined {
  switch (value) {
    case "accent":
      return "var(--accent)";
    case "good":
      return "var(--vr-good-text)";
    case "warn":
      return "var(--vr-warn-text)";
    case "danger":
      return "var(--vr-danger-text)";
    case "muted":
      return "var(--text-muted)";
    default:
      return undefined;
  }
}
