"use client";

type RadarLoaderSize = "sm" | "md" | "lg";

type RadarLoaderProps = {
  size?: RadarLoaderSize;
  fullscreen?: boolean;
  label?: string;
  className?: string;
};

const DIMENSIONS: Record<RadarLoaderSize, number> = {
  sm: 28,
  md: 56,
  lg: 96,
};

export function RadarLoader({
  size = "md",
  fullscreen = false,
  label = "Loading",
  className = "",
}: RadarLoaderProps) {
  const px = DIMENSIONS[size];

  const radar = (
    <span
      role="status"
      aria-label={label}
      className={`rr-radar ${className}`}
      style={{ width: px, height: px }}
    >
      <svg viewBox="0 0 100 100" width={px} height={px} aria-hidden="true">
        <circle cx="50" cy="50" r="46" className="rr-radar-ring" />
        <circle cx="50" cy="50" r="30" className="rr-radar-ring" />
        <circle cx="50" cy="50" r="14" className="rr-radar-ring" />
        <line x1="4" y1="50" x2="96" y2="50" className="rr-radar-grid" />
        <line x1="50" y1="4" x2="50" y2="96" className="rr-radar-grid" />
        <g className="rr-radar-sweep">
          <path d="M50 50 L50 4 A46 46 0 0 1 92 38 Z" className="rr-radar-beam" />
        </g>
        <circle cx="72" cy="34" r="3.5" className="rr-radar-blip" />
      </svg>
      <span className="sr-only">{label}</span>

      <style>{`
        .rr-radar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .rr-radar-ring {
          fill: none;
          stroke: var(--rr-green, #22c55e);
          stroke-width: 1;
          opacity: 0.22;
        }
        .rr-radar-grid {
          stroke: var(--rr-green, #22c55e);
          stroke-width: 0.75;
          opacity: 0.14;
        }
        .rr-radar-sweep {
          transform-origin: 50px 50px;
          animation: rr-radar-rotate 1.4s linear infinite;
        }
        .rr-radar-beam {
          fill: var(--rr-green, #22c55e);
          opacity: 0.55;
        }
        .rr-radar-blip {
          fill: var(--rr-green, #22c55e);
          animation: rr-radar-pulse 1.4s ease-in-out infinite;
        }
        @keyframes rr-radar-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rr-radar-pulse {
          0%, 100% { opacity: 0.25; r: 3; }
          45% { opacity: 1; r: 4.5; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rr-radar-sweep { animation-duration: 3s; }
          .rr-radar-blip { animation: none; opacity: 0.8; }
        }
      `}</style>
    </span>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-rr-bg/85 backdrop-blur-sm">
        {radar}
        {label ? (
          <p className="text-sm font-medium tracking-[0.08em] text-rr-secondary">{label}</p>
        ) : null}
      </div>
    );
  }

  return radar;
}