import type { RiskResult, RiskStatus } from "./schema";

/**
 * Deterministic, auditable risk scoring. The LLM is kept OUT of this path so the
 * green/amber/red badge is reproducible and explainable — same input, same score.
 */

export const RISK_THRESHOLDS = { amber: 15, red: 35 } as const;

interface Signal {
  id: string;
  points: number;
  test: RegExp;
  why: string;
}

const SIGNALS: Signal[] = [
  { id: "legal", points: 30, why: "legal / chargeback / authority threat", test: /\b(lawyer|legal|sue|lawsuit|attorney|court|chargeback|dispute the charge|report (you|them)|authorities|health (department|inspector)|bbb|trading standards)\b/ },
  { id: "safety", points: 22, why: "health / safety issue", test: /\b(sick|ill|food poisoning|poisoned|allergic|allergy|injur|hurt|unsafe|hazard|mold|mould|bug|insect|hair in|rotten|expired|contaminat)\b/ },
  { id: "churn", points: 14, why: "churn / never-again signal", test: /\b(never (again|coming back|returning)|cancel(l?ing|led)?|switch(ing)?|competitor|done with (you|them)|last time|taking my business)\b/ },
  { id: "refund", points: 12, why: "refund / compensation demand", test: /\b(refund|money back|my money|compensat|reimburse|i want.*back)\b/ },
  { id: "viral", points: 10, why: "public-amplification threat", test: /\b(everyone|tell (my )?(friends|everyone)|warn (others|people|everyone)|spread the word|posting (this )?everywhere|all over (social|the internet)|review[- ]?bomb|going viral)\b/ },
  { id: "tone", points: 6, why: "strong negative / profanity", test: /(f\*+k|f\bu\bc\bk|fuck|sh\*t|shit|scam|fraud|disgusting|worst|appalling|atrocious|horrible|terrible|awful)/ },
];

export function scoreRisk(review: string, stars?: number | null): RiskResult {
  const t = (review || "").toLowerCase();
  const reasons: string[] = [];
  let score = 0;
  const add = (points: number, why: string) => {
    score += points;
    reasons.push(`${why} (+${points})`);
  };

  if (typeof stars === "number") {
    if (stars <= 1) add(25, "1-star rating");
    else if (stars === 2) add(16, "2-star rating");
    else if (stars === 3) add(6, "3-star rating");
  }

  for (const s of SIGNALS) {
    if (s.test.test(t)) add(s.points, s.why);
  }

  // Very short + low star = possible fake/troll (worth a careful, boundary-setting reply).
  if (review.trim().length < 40 && (stars ?? 5) <= 2) add(6, "very short low-star (possible fake)");

  score = Math.min(score, 100);
  const status: RiskStatus =
    score >= RISK_THRESHOLDS.red ? "red" : score >= RISK_THRESHOLDS.amber ? "amber" : "green";
  if (reasons.length === 0) reasons.push("no risk signals detected");

  return { status, score, reasons };
}
