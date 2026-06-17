"use client";

import { useRef, useState, useLayoutEffect } from "react";

type InfoTooltipProps = {
  text: string;
};

export function InfoTooltip({ text }: InfoTooltipProps) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!show || !btnRef.current || !tipRef.current) return;

    const btn = btnRef.current.getBoundingClientRect();
    const tip = tipRef.current.getBoundingClientRect();
    const margin = 12;

    let left = btn.left + btn.width / 2 - tip.width / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - tip.width - margin));

    let top = btn.bottom + 8;
    if (top + tip.height > window.innerHeight - margin) {
      top = btn.top - tip.height - 8;
    }

    setCoords({ top, left });
  }, [show]);

  return (
    <span className="relative inline-flex items-center">
      <button
        ref={btnRef}
        type="button"
        aria-label="More information"
        className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-rr-muted/20 text-rr-muted hover:bg-rr-muted/30 hover:text-rr-text-primary transition-colors cursor-pointer"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setShow((s) => !s);
        }}
      >
        <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 3.5a1 1 0 110 2 1 1 0 010-2zM6.5 7h2a.5.5 0 01.5.5v4h.5a.5.5 0 010 1h-3a.5.5 0 010-1H7V8h-.5a.5.5 0 010-1z" />
        </svg>
      </button>
      {show && (
        <span
          ref={tipRef}
          role="tooltip"
          style={{ top: coords.top, left: coords.left }}
          className="fixed z-50 w-[min(16rem,calc(100vw-24px))] rounded-lg border border-white/15 bg-[#1e2433] px-3.5 py-3 text-xs leading-relaxed text-white shadow-xl shadow-black/40"
        >
          {text}
        </span>
      )}
    </span>
  );
}