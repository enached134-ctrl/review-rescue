import { z } from "zod";

export const RiskStatus = z.enum(["green", "amber", "red"]);
export type RiskStatus = z.infer<typeof RiskStatus>;

export const StrategyId = z.enum(["de-escalate", "hold-the-line", "save-the-account"]);
export type StrategyId = z.infer<typeof StrategyId>;

export const STRATEGY_META: Record<StrategyId, { name: string; blurb: string }> = {
  "de-escalate": { name: "De-escalate & Reassure", blurb: "Warm, takes ownership, cools it down." },
  "hold-the-line": { name: "Hold the Line", blurb: "Polite + firm — for unfair or fake reviews." },
  "save-the-account": { name: "Win Them Back", blurb: "Recover the relationship with a real next step." },
};

export const Reply = z.object({
  strategyId: StrategyId,
  strategy: z.string().min(1),
  text: z.string().min(1),
});
export type Reply = z.infer<typeof Reply>;

/**
 * What Claude returns. NOTE: the model does NOT decide the risk badge — that is
 * computed deterministically by `scoreRisk` so the rating is auditable.
 */
export const Analysis = z.object({
  intentLine: z.string().min(1),
  temperature: z.string().min(1),
  replies: z.array(Reply).length(3),
  managerAlert: z.string().min(1),
});
export type Analysis = z.infer<typeof Analysis>;

export const RescueInput = z.object({
  text: z.string().min(1, "Paste a review first."),
  business: z.string().optional(),
  platform: z.string().optional(),
  /** 1-5; optional — improves risk scoring when known. */
  stars: z.number().int().min(1).max(5).nullable().optional(),
  /** 0 = warm … 1 = firm. */
  tone: z.number().min(0).max(1).optional(),
});
export type RescueInput = z.infer<typeof RescueInput>;

export interface RiskResult {
  status: RiskStatus;
  score: number;
  reasons: string[];
}

/** The full payload the UI renders. */
export interface RescueResult extends Analysis {
  risk: RiskResult;
  safeToAutoPost: boolean;
  demoMode: boolean;
}

/** Hand-authored JSON Schema for Claude's forced tool call (kept in sync with `Analysis`). */
export const rescueToolSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intentLine: { type: "string", description: "One sentence: the reviewer's real intent + emotional temperature." },
    temperature: { type: "string", description: "2-4 words, e.g. 'Furious, feels ignored'." },
    replies: {
      type: "array",
      description: "Exactly 3 — one per strategy.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          strategyId: { type: "string", enum: ["de-escalate", "hold-the-line", "save-the-account"] },
          strategy: { type: "string" },
          text: { type: "string", description: "The ready-to-send public reply." },
        },
        required: ["strategyId", "strategy", "text"],
      },
    },
    managerAlert: { type: "string", description: "One internal line: what the team should DO operationally." },
  },
  required: ["intentLine", "temperature", "replies", "managerAlert"],
} as const;
