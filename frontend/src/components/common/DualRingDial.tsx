import { useRef, useEffect, useState } from "react";

interface DualRingDialProps {
  /** 0-100 outer ring value */
  outer: number;
  /** 0-100 inner ring value */
  inner: number;
  outerLabel: string;
  innerLabel: string;
  outerColor?: string;
  innerColor?: string;
  size?: number;
  thickness?: number;
}

function useCountUp(target: number, duration = 1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function Arc({
  cx, cy, r, value, color, thickness, strokeLinecap = "round",
}: {
  cx: number; cy: number; r: number; value: number; color: string; thickness: number; strokeLinecap?: "round" | "butt";
}) {
  const circumference = 2 * Math.PI * r;
  // Start at top (−90 degrees), go clockwise
  const offset = circumference - (value / 100) * circumference;
  return (
    <>
      {/* Track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="rgba(245,245,243,0.06)"
        strokeWidth={thickness}
      />
      {/* Progress */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap={strokeLinecap}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      />
    </>
  );
}

export default function DualRingDial({
  outer,
  inner,
  outerLabel,
  innerLabel,
  outerColor = "#f5f5f3",
  innerColor = "#ff8a1f",
  size = 200,
  thickness = 14,
}: DualRingDialProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 120); return () => clearTimeout(t); }, []);

  const displayOuter = useCountUp(mounted ? outer : 0, 1000);
  const displayInner = useCountUp(mounted ? inner : 0, 1200);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = (size / 2) - thickness / 2 - 4;
  const innerR = outerR - thickness - 8;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Glow filter */}
          <defs>
            <filter id="ring-glow-outer" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="ring-glow-inner" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g filter="url(#ring-glow-outer)">
            <Arc cx={cx} cy={cy} r={outerR} value={mounted ? outer : 0} color={outerColor} thickness={thickness} />
          </g>
          <g filter="url(#ring-glow-inner)">
            <Arc cx={cx} cy={cy} r={innerR} value={mounted ? inner : 0} color={innerColor} thickness={thickness - 2} />
          </g>
        </svg>

        {/* Center text */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2px",
        }}>
          <span style={{ fontSize: "28px", fontWeight: 800, color: "#f5f5f3", lineHeight: 1, letterSpacing: "-0.04em" }}>
            {displayOuter}<span style={{ fontSize: "16px", fontWeight: 600 }}>%</span>
          </span>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#70706b", textTransform: "uppercase", letterSpacing: "0.10em" }}>
            {outerLabel}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
        <LegendRow label={outerLabel} value={displayOuter} color={outerColor} />
        <LegendRow label={innerLabel} value={displayInner} color={innerColor} />
      </div>
    </div>
  );
}

function LegendRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
        boxShadow: `0 0 8px ${color}88`,
      }} />
      <span style={{ flex: 1, fontSize: "12px", color: "#a5a5a0", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: "13px", fontWeight: 700, color: "#f5f5f3" }}>{value}%</span>
    </div>
  );
}
