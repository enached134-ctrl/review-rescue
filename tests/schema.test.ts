import { describe, it, expect } from "vitest";
import { Analysis, rescueToolSchema } from "../lib/schema";
import { FIXTURES } from "../lib/fixtures";

describe("schema", () => {
  it("keeps the Claude tool JSON schema in sync with the Zod Analysis schema", () => {
    const zodKeys = Object.keys(Analysis.shape).sort();
    const jsonRequired = [...rescueToolSchema.required].sort();
    const jsonProps = Object.keys(rescueToolSchema.properties).sort();
    expect(jsonRequired).toEqual(zodKeys);
    expect(jsonProps).toEqual(zodKeys);
  });

  it("every fixture conforms to Analysis with exactly 3 distinct strategies", () => {
    for (const f of FIXTURES) {
      const parsed = Analysis.safeParse(f.recorded);
      expect(parsed.success, `${f.id} should parse`).toBe(true);
      const ids = f.recorded.replies.map((r) => r.strategyId);
      expect(new Set(ids).size, `${f.id} distinct strategies`).toBe(3);
    }
  });
});
