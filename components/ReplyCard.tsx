"use client";

import { useState } from "react";
import { STRATEGY_META, type Reply } from "@/lib/schema";

const ACCENTS = ["#22d3ee", "#8b5cf6", "#34d399"];

export default function ReplyCard({ reply, index }: { reply: Reply; index: number }) {
  const [copied, setCopied] = useState(false);
  const meta = STRATEGY_META[reply.strategyId];
  const accent = ACCENTS[index % ACCENTS.length];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reply.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div
      className="glass animate-rise rounded-2xl p-5"
      style={{ animationDelay: `${index * 90}ms`, borderTop: `2px solid ${accent}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-heading font-bold" style={{ color: accent }}>
            {meta.name}
          </div>
          <div className="text-xs text-mut">{meta.blurb}</div>
        </div>
        <button
          onClick={copy}
          className="shrink-0 cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-txt transition hover:bg-white/10"
          aria-label={`Copy the ${meta.name} reply`}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-txt/90">{reply.text}</p>
    </div>
  );
}
