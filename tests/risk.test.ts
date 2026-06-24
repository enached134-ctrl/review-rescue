import { describe, it, expect } from "vitest";
import { scoreRisk } from "../lib/risk";

describe("scoreRisk", () => {
  it("is deterministic", () => {
    const t = "Cold food and a rude server, very disappointing";
    expect(scoreRisk(t, 2)).toEqual(scoreRisk(t, 2));
  });

  it("is green for a glowing 5-star review", () => {
    const r = scoreRisk("Best gym ever — spotless and friendly staff!", 5);
    expect(r.status).toBe("green");
  });

  it("is amber for a mild 2-star with no escalation signals", () => {
    const r = scoreRisk("The product was okay but smaller than I expected.", 2);
    expect(r.status).toBe("amber");
  });

  it("is red when there is a legal / chargeback threat", () => {
    const r = scoreRisk(
      "Item arrived broken and you ignored my emails. I'll do a chargeback and warn everyone.",
      2,
    );
    expect(r.status).toBe("red");
    expect(r.reasons.join(" ")).toMatch(/chargeback|legal/i);
  });

  it("always returns at least one reason", () => {
    expect(scoreRisk("great", 5).reasons.length).toBeGreaterThan(0);
  });
});
