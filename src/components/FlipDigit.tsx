import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  digits?: number;
  className?: string;
};

/**
 * Subtle flip-clock style number. Each digit flips with a short
 * scale+translate animation only when its character changes.
 */
export function FlipDigit({ value, digits = 2, className = "" }: Props) {
  const str = String(Math.max(0, value)).padStart(digits, "0");
  return (
    <div className={`inline-flex gap-1 ${className}`} dir="ltr">
      {str.split("").map((ch, i) => (
        <SingleDigit key={i} char={ch} />
      ))}
    </div>
  );
}

function SingleDigit({ char }: { char: string }) {
  const [current, setCurrent] = useState(char);
  const [flipping, setFlipping] = useState(false);
  const prev = useRef(char);

  useEffect(() => {
    if (char === prev.current) return;
    setFlipping(true);
    const t = setTimeout(() => {
      setCurrent(char);
      setFlipping(false);
      prev.current = char;
    }, 180);
    return () => clearTimeout(t);
  }, [char]);

  return (
    <span
      className="relative inline-block w-[0.85em] text-center"
      style={{ perspective: "200px" }}
    >
      <span
        className="inline-block tabular-nums transition-transform duration-200 ease-out"
        style={{
          transform: flipping
            ? "rotateX(90deg) translateY(-15%)"
            : "rotateX(0deg)",
          transformOrigin: "center",
          opacity: flipping ? 0.4 : 1,
        }}
      >
        {current}
      </span>
    </span>
  );
}