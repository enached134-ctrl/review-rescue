import { describe, it, expect } from "vitest";
import { extractAnalysis, runRescue, AnalysisError } from "../lib/rescue";
import { ReplayReplyLLM } from "../lib/llm";
import { FIXTURES } from "../lib/fixtures";

const restaurant = FIXTURES.find((f) => f.id === "restaurant-1star")!;
const shop = FIXTURES.find((f) => f.id === "shop-refund-2star")!;
const gym = FIXTURES.find((f) => f.id === "gym-5star")!;
const baseInput = { text: restaurant.reviewText, stars: 1 };

describe("extractAnalysis (validate + repair)", () => {
  it("returns on the first valid response", async () => {
    const { analysis, attempts } = await extractAnalysis(new ReplayReplyLLM([restaurant.recorded]), baseInput);
    expect(attempts).toBe(1);
    expect(analysis.replies).toHaveLength(3);
  });

  it("repairs after an invalid (wrong reply count) response", async () => {
    const bad = { ...restaurant.recorded, replies: restaurant.recorded.replies.slice(0, 2) };
    const { attempts } = await extractAnalysis(new ReplayReplyLLM([bad, restaurant.recorded]), baseInput, 3);
    expect(attempts).toBe(2);
  });

  it("throws AnalysisError after exhausting attempts", async () => {
    const bad = { intentLine: "x" };
    await expect(extractAnalysis(new ReplayReplyLLM([bad, bad, bad]), baseInput, 3)).rejects.toBeInstanceOf(
      AnalysisError,
    );
  });
});

describe("runRescue", () => {
  it("computes deterministic risk + safe-to-post for a happy review", async () => {
    const res = await runRescue(
      { text: gym.reviewText, stars: 5 },
      { llm: new ReplayReplyLLM([gym.recorded]), demoMode: true },
    );
    expect(res.risk.status).toBe("green");
    expect(res.safeToAutoPost).toBe(true);
    expect(res.demoMode).toBe(true);
    expect(res.replies).toHaveLength(3);
  });

  it("flags a high-risk review as NOT safe to auto-post", async () => {
    const res = await runRescue(
      { text: shop.reviewText, stars: 2 },
      { llm: new ReplayReplyLLM([shop.recorded]), demoMode: true },
    );
    expect(res.risk.status).toBe("red");
    expect(res.safeToAutoPost).toBe(false);
  });
});
