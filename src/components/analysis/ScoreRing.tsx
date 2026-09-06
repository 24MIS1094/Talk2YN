import { useEffect, useState } from "react";

type Props = {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
  color?: string;
};

function ringColorFor(score: number, override?: string) {
  if (override) return override;
  if (score >= 85) return "var(--primary)";
  if (score >= 70) return "#ffb066";
  if (score >= 50) return "#e84393";
  return "#c94040";
}

export function ScoreRing({
  score,
  size = 220,
  stroke = 14,
  label = "Overall Score",
  color,
}: Props) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [display, setDisplay] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1400;
    const from = 0;
    const to = clamped;
    let raf = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * ease(t);
      setDisplay(Math.round(v));
      setProgress(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [clamped]);

  const ringColor = ringColorFor(clamped, color);
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <div className="relative inline-flex items-center justify-center">
      <div
        aria-hidden
        className="absolute inset-0 rounded-full blur-2xl opacity-40 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ringColor} 0%, transparent 70%)` }}
      />
      <svg width={size} height={size} className="relative -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          className="text-foreground/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ filter: `drop-shadow(0 0 12px ${ringColor})`, transition: "stroke 200ms" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-6xl font-semibold tracking-tight tabular-nums">
          {display}
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}

export function ScoreBar({
  score,
  color,
  animateKey,
}: {
  score: number;
  color?: string;
  animateKey?: string | number;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(0);
    const id = requestAnimationFrame(() => setWidth(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped, animateKey]);
  const c = ringColorFor(clamped, color);
  return (
    <div className="h-2 w-full rounded-full bg-foreground/10 overflow-hidden">
      <div
        className="h-full rounded-full transition-[width] duration-[1200ms] ease-out"
        style={{ width: `${width}%`, background: c, boxShadow: `0 0 12px ${c}` }}
      />
    </div>
  );
}
