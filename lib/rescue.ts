import { Analysis, type RescueInput, type RescueResult } from "./schema";
import { scoreRisk } from "./risk";
import type { ReplyLLM } from "./llm";

export class AnalysisError extends Error {
  constructor(message: string, readonly attempts: number) {
    super(message);
    this.name = "AnalysisError";
  }
}

const EXPECTED_STRATEGIES = ["de-escalate", "hold-the-line", "save-the-account"] as const;

/**
 * Extract a validated Analysis from the LLM, re-asking with the validation
 * errors (schema-guided repair) up to `maxAttempts` before throwing.
 */
export async function extractAnalysis(
  llm: ReplyLLM,
  input: RescueInput,
  maxAttempts = 3,
): Promise<{ analysis: Analysis; attempts: number }> {
  let feedback: string | undefined;
  let lastIssues = "";

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const raw = await llm.analyze(input, { feedback });
    const parsed = Analysis.safeParse(raw);
    if (parsed.success) {
      const ids = parsed.data.replies.map((r) => r.strategyId).sort();
      const want = [...EXPECTED_STRATEGIES].sort();
      if (JSON.stringify(ids) === JSON.stringify(want)) {
        return { analysis: parsed.data, attempts: attempt };
      }
      lastIssues = `replies must contain exactly one of each strategyId: ${want.join(", ")}`;
    } else {
      lastIssues = parsed.error.issues
        .map((i) => `${i.path.join(".") || "root"}: ${i.message}`)
        .join("; ");
    }
    feedback = `Validation failed (${lastIssues}).`;
  }

  throw new AnalysisError(`Failed to produce a valid analysis after ${maxAttempts} attempt(s): ${lastIssues}`, maxAttempts);
}

export interface RescueDeps {
  llm: ReplyLLM;
  demoMode?: boolean;
  maxAttempts?: number;
}

/** End to end: analyze (validate/repair) -> deterministic risk -> safe-to-post. */
export async function runRescue(input: RescueInput, deps: RescueDeps): Promise<RescueResult> {
  const { analysis } = await extractAnalysis(deps.llm, input, deps.maxAttempts);
  const risk = scoreRisk(input.text, input.stars ?? null);
  return {
    ...analysis,
    risk,
    safeToAutoPost: risk.status === "green",
    demoMode: deps.demoMode ?? false,
  };
}
