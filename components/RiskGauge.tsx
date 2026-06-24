"use client";

import type { RiskResult } from "@/lib/schema";

const COLORS: Record<RiskResult["status"], string> = {
  green: "#34d399",
  amber: "#fbbf24",
  red: "#fb7185",
};
const LABELS: Record<RiskResult["status"], string> = {
  green: "Low risk",
  amber: "Handle with care",
  red: "Urgent",
};

export default function RiskGauge({ risk }: { risk: RiskResult }) {
  const color = COLORS[risk.status];
  const pct = Math.min(risk.score, 100) / 100;
  const R = 52;
  const CIRC = 2 * Math.PI * R;
  const dash = CIRC * pct;

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-32 w-32 shrink-0">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${CIRC}`}
            style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dasharray .8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-3xl font-extrabold" style={{ color }}>
            {risk.score}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-mut">risk</span>
        </div>
      </div>
      <div className="min-w-0">
        <div className="font-heading text-xl font-bold" style={{ color }}>
          {LABELS[risk.status]}
        </div>
        <ul className="mt-1.5 space-y-0.5 text-sm text-mut">
          {risk.reasons.slice(0, 4).map((r, i) => (
            <li key={i}>· {r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
