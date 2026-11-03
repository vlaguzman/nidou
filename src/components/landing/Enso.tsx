type EnsoProps = {
  className?: string;
  animate?: boolean;
};

/**
 * Animated "enso" brush-stroke circle from the NIDOU mark.
 * The stroke draws itself in and the terracotta dot fades in after.
 */
export function Enso({ className = "", animate = true }: EnsoProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="Símbolo de NIDOU"
      className={`h-full w-full ${className}`.trim()}
    >
      <path
        d="M86 30 C70 18, 44 20, 31 38 C18 56, 22 84, 44 95 C66 106, 92 96, 98 74"
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth="9"
        strokeLinecap="round"
        className={animate ? "enso-stroke" : undefined}
      />
      <circle
        cx="64"
        cy="78"
        r="7"
        fill="var(--color-terracotta)"
        className={animate ? "enso-dot" : undefined}
      />
    </svg>
  );
}
