import { NextRequest, NextResponse } from "next/server";
import { RescueInput } from "@/lib/schema";
import { runRescue } from "@/lib/rescue";
import { AnthropicReplyLLM, ReplayReplyLLM } from "@/lib/llm";
import { findFixture, FIXTURES } from "@/lib/fixtures";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RescueInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const input = parsed.data;

  try {
    // Live mode: a real Claude call when a key is configured.
    if (process.env.ANTHROPIC_API_KEY) {
      const result = await runRescue(input, { llm: new AnthropicReplyLLM(), demoMode: false });
      return NextResponse.json(result);
    }

    // Demo mode (no key): replay a recorded fixture so the app is fully usable offline.
    const fixture = findFixture(input.text) ?? FIXTURES[0];
    const stars = input.stars ?? fixture.stars;
    const result = await runRescue(
      { ...input, stars },
      { llm: new ReplayReplyLLM([fixture.recorded]), demoMode: true },
    );
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 },
    );
  }
}
