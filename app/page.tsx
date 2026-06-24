"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import RiskGauge from "@/components/RiskGauge";
import ReplyCard from "@/components/ReplyCard";
import { FIXTURES, type Fixture } from "@/lib/fixtures";
import type { RescueResult } from "@/lib/schema";

const Shield3D = dynamic(() => import("@/components/Shield3D"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-full bg-brand-cyan/10" aria-hidden />
  ),
});

export default function Home() {
  const [text, setText] = useState("");
  const [stars, setStars] = useState(1);
  const [tone, setTone] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RescueResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function rescue(reviewText: string, starOverride?: number) {
    if (!reviewText.trim()) {
      setError("Paste a review first.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/rescue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reviewText, stars: starOverride ?? stars, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong");
      setResult(data as RescueResult);
      setTimeout(
        () => document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" }),
        80,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function loadSample(f: Fixture) {
    setText(f.reviewText);
    setStars(f.stars);
    rescue(f.reviewText, f.stars);
  }

  return (
    <main className="relative mx-auto max-w-5xl px-5 pb-24">
      {/* ambient depth glows */}
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-brand-cyan/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-brand-violet/15 blur-3xl" aria-hidden />

      {/* nav */}
      <header className="relative flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-cyan to-brand-violet font-heading text-lg font-black text-ink-950">
            R
          </div>
          <span className="font-heading text-lg font-bold tracking-tight">
            review<span className="text-gradient">·</span>rescue
          </span>
        </div>
        <a
          href="https://github.com/enached134-ctrl/review-rescue"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-mut transition hover:bg-white/10"
        >
          GitHub
        </a>
      </header>

      {/* hero */}
      <section className="relative grid items-center gap-6 pt-4 md:grid-cols-[1.05fr_0.95fr]">
        <div className="animate-rise">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-mut">
            AI reply assistant for local business
          </span>
          <h1 className="mt-5 font-heading text-5xl font-extrabold leading-[1.04] tracking-tight md:text-6xl">
            A brutal review in.
            <br />
            <span className="text-gradient">Three perfect replies</span> out.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-mut">
            Paste any customer review. In seconds you get a clear risk read and three
            ready-to-send replies — calm, firm, or win-them-back — plus what to tell your team.
            Safe by design: it never admits fault or promises refunds.
          </p>
        </div>
        <div className="relative mx-auto h-[300px] w-full max-w-sm md:h-[360px]">
          <div className="absolute inset-0 rounded-full bg-brand-cyan/10 blur-2xl" aria-hidden />
          <Shield3D />
        </div>
      </section>

      {/* console */}
      <section className="glass-strong relative mt-10 rounded-3xl p-6 shadow-glass md:p-8">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="review" className="font-heading text-sm font-bold uppercase tracking-wider text-mut">
            Paste the review
          </label>
          <div className="flex items-center gap-1" role="group" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setStars(n)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                className="cursor-pointer px-0.5 text-2xl leading-none transition"
                style={{ color: n <= stars ? "#fbbf24" : "rgba(255,255,255,0.18)" }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <textarea
          id="review"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="e.g. Worst dinner ever. Waited an hour for cold food and the server was rude…"
          className="mt-3 w-full resize-y rounded-2xl border border-white/10 bg-ink-950/60 p-4 text-[15px] leading-relaxed text-txt outline-none transition placeholder:text-dim focus:border-brand-cyan/60 focus:ring-2 focus:ring-brand-cyan/20"
        />

        {/* samples */}
        <div className="mt-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-dim">Try a sample</div>
          <div className="flex flex-wrap gap-2">
            {FIXTURES.map((f) => (
              <button
                key={f.id}
                onClick={() => loadSample(f)}
                className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-mut transition hover:border-brand-cyan/40 hover:text-txt"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* tone + action */}
        <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xs">
            <div className="mb-1 flex justify-between text-xs font-semibold uppercase tracking-wider text-dim">
              <span>Warm</span>
              <span>Tone</span>
              <span>Firm</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={tone}
              onChange={(e) => setTone(parseFloat(e.target.value))}
              aria-label="Reply tone, warm to firm"
              className="w-full cursor-pointer accent-brand-cyan"
            />
          </div>
          <button
            onClick={() => rescue(text)}
            disabled={loading}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-violet px-7 py-3.5 font-heading text-base font-bold text-ink-950 shadow-glow-cyan transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Rescuing…" : "Rescue this review →"}
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-risk-red">{error}</p>}
      </section>

      {/* results */}
      {result && (
        <section id="result" className="mt-8 scroll-mt-6 space-y-5">
          {result.demoMode && (
            <div className="rounded-xl border border-brand-cyan/25 bg-brand-cyan/5 px-4 py-2.5 text-sm text-mut">
              Demo mode — sample replies shown. Set <code className="text-brand-cyan">ANTHROPIC_API_KEY</code> to analyze any review live with Claude.
            </div>
          )}

          <div className="glass grid gap-5 rounded-3xl p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="animate-rise">
              <div className="text-xs font-semibold uppercase tracking-wider text-dim">The read</div>
              <p className="mt-1 font-heading text-lg font-semibold text-txt">{result.intentLine}</p>
              <div className="mt-2 inline-flex items-center gap-2 text-sm text-mut">
                <span className="rounded-full bg-white/5 px-2.5 py-1">{result.temperature}</span>
                <span
                  className="rounded-full px-2.5 py-1"
                  style={{
                    color: result.safeToAutoPost ? "#34d399" : "#fbbf24",
                    background: result.safeToAutoPost ? "rgba(52,211,153,.1)" : "rgba(251,191,36,.1)",
                  }}
                >
                  {result.safeToAutoPost ? "Safe to auto-post" : "Review before posting"}
                </span>
              </div>
            </div>
            <RiskGauge risk={result.risk} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {result.replies.map((r, i) => (
              <ReplyCard key={r.strategyId} reply={r} index={i} />
            ))}
          </div>

          <div className="glass animate-rise rounded-2xl border-l-2 border-l-brand-violet p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-violet">Manager alert</div>
            <p className="mt-1 text-[15px] leading-relaxed text-txt/90">{result.managerAlert}</p>
          </div>
        </section>
      )}

      {/* how it works */}
      <section id="how" className="mt-20">
        <h2 className="text-center font-heading text-3xl font-extrabold tracking-tight">
          From dread to done in <span className="text-gradient">three seconds</span>
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { n: "1", t: "Paste the review", d: "Any platform, any star rating. Drop in the words that ruined your morning." },
            { n: "2", t: "Hit Rescue", d: "Claude reads the intent; a deterministic engine scores the risk green / amber / red." },
            { n: "3", t: "Pick & send", d: "Three on-brand replies — copy the one that fits, plus a note for your team." },
          ].map((s) => (
            <div key={s.n} className="glass rounded-2xl p-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-cyan to-brand-violet font-heading font-black text-ink-950">
                {s.n}
              </div>
              <div className="mt-4 font-heading text-lg font-bold">{s.t}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-mut">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="glass mt-6 rounded-2xl p-6">
          <div className="font-heading text-lg font-bold text-txt">Safe by design</div>
          <ul className="mt-3 grid gap-2 text-sm text-mut md:grid-cols-2">
            <li>· Never admits legal liability or fault.</li>
            <li>· Never promises refunds, comps, or money it cannot authorize.</li>
            <li>· Risk score is deterministic and explainable — not an AI guess.</li>
            <li>· You stay in control: every reply is a draft you approve.</li>
          </ul>
        </div>
      </section>

      <footer className="mt-16 border-t border-white/8 pt-6 text-center text-sm text-dim">
        © Daniel Enache · source-available (PolyForm Noncommercial) ·{" "}
        <a className="text-mut hover:text-txt" href="https://github.com/enached134-ctrl/review-rescue">
          github.com/enached134-ctrl/review-rescue
        </a>
      </footer>
    </main>
  );
}
