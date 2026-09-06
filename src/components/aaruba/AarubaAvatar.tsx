type Props = {
  size?: number;
  state?: "idle" | "thinking" | "speaking" | "listening";
  className?: string;
};

// Cinematic animated Aaruba avatar — pure CSS + SVG.
export function AarubaAvatar({ size = 44, state = "idle", className = "" }: Props) {
  const color =
    state === "listening" ? "#3ddc97" : state === "thinking" ? "#6c5ce7" : "#ff6b35";
  const pulse =
    state === "thinking"
      ? "animate-pulse-glow"
      : state === "speaking"
        ? "animate-pulse-glow"
        : state === "listening"
          ? "animate-pulse-glow"
          : "";
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-label={`Aaruba ${state}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full blur-md opacity-70"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      />
      <span
        aria-hidden
        className={`absolute inset-0 rounded-full ${pulse}`}
        style={{
          background: "var(--gradient-sunset)",
          boxShadow: `0 0 24px ${color}80`,
        }}
      />
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        className="relative text-white"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="5"
          stroke="currentColor"
          strokeWidth="1.5"
          className={state === "thinking" ? "animate-pulse" : ""}
        />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        {(state === "speaking" || state === "listening") && (
          <>
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeOpacity="0.6"
              strokeWidth="0.8"
              className="animate-ping"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="0.6"
              className="animate-ping"
              style={{ animationDelay: "300ms" }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
