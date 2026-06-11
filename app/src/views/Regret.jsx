import { useState, useMemo } from "react";
import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Note, th, td, tdMono } from "../components/ui.jsx";
import { runWorld, verdictOf } from "../engine.js";
import { WORLDS } from "../data/worlds.js";
import { STRATEGIES, WORLD_IDS, WORLD_SHORT, NPV, bestInWorld, regretOf, maxRegret, minimaxStrategy } from "../data/matrix.js";

const f2 = v => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(2);

function PlanGradedTable() {
  const rows = useMemo(() => WORLDS.map(w => {
    const { m } = runWorld(w.x);
    return { w, m, v: verdictOf(m, C) };
  }), []);
  return (
    <Section title="First, the plan alone — Samsung's plan-as-written, run unchanged through each X-vector (computed live)">
      <div className="overflow-x-auto">
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={th}>World</th><th style={th}>Breakeven</th><th style={th}>Trough</th><th style={th}>IRR</th><th style={th}>Verdict</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ w, m, v }) => (
              <tr key={w.id}>
                <td style={{ ...td, fontWeight: 600, whiteSpace: "nowrap" }}>{w.id === "BASE" ? "Baseline (calibrated)" : w.name.replace(" · ", " ")}</td>
                <td style={tdMono}>{m.be ? `Y${m.be}` : ">15"}</td>
                <td style={tdMono}>−${Math.abs(m.trough).toFixed(1)}B</td>
                <td style={tdMono}>{(m.irr * 100).toFixed(1)}%</td>
                <td style={td}>
                  <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: v.color, color: "#fff" }}>
                    {v.v}{v.boundary ? " · boundary" : ""}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Thrives in 1 of 4 worlds — as written, this is a wager on W2, not a strategy across futures. W3 craters fast (license events detect it early);
        W4 bleeds slow (price erosion detects it). Same verdict, opposite instrumentation. But "the plan dies in three worlds" is only half the analysis —
        the other half is what the best response in each world would have been. That gap has a name.
      </Note>
    </Section>
  );
}

function Primer() {
  return (
    <Section title="Regret — the number that replaces probability">
      <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div className="rounded-lg p-4" style={{ background: C.navy }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: C.amber, fontWeight: 700 }}>Definition</div>
          <div className="text-sm" style={{ fontFamily: MONO, color: "#fff", lineHeight: 1.7 }}>
            Regret(strategy, world) =<br />
            &nbsp;&nbsp;NPV(best strategy in that world)<br />
            &nbsp;&nbsp;− NPV(your strategy in that world)
          </div>
          <div className="text-sm mt-3 italic" style={{ color: C.ice }}>"The bill for being wrong about the world."</div>
        </div>
        <div className="rounded-lg p-4" style={{ background: C.paper, border: `1px solid ${C.amber}` }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: C.mid, fontWeight: 700 }}>Worked, with our numbers</div>
          <div className="text-sm" style={{ color: C.ink, lineHeight: 1.7 }}>
            In <b>W3 Incumbent Citadel</b>, the best available strategy (GaaS) earns <span style={{ fontFamily: MONO, color: C.good, fontWeight: 700 }}>+$1.44B</span>.<br />
            Samsung's plan earns <span style={{ fontFamily: MONO, color: C.bad, fontWeight: 700 }}>−$5.71B</span>.<br />
            <span style={{ fontFamily: MONO }}>Regret = 1.44 − (−5.71) = <b>$7.15B</b></span>
          </div>
        </div>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {[
          { t: "No probabilities needed", b: "Expected value requires P(world) — exactly what level 3–4 forbids. Regret only compares strategies within each world, then looks across." },
          { t: "Measures fragility, not failure", b: "A strategy can be profitable yet high-regret: it left a fortune on the table in the worlds it ignored. The gap IS the fragility signal." },
          { t: "Minimax regret (Savage, 1951)", b: "Pick the strategy whose worst-case bill is smallest. A decision criterion that needs no forecast — native to DMDU, and the same quantity RL calls regret in bandits." },
        ].map(c => (
          <div key={c.t} className="rounded-lg p-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
            <div className="text-sm mb-1" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>{c.t}</div>
            <div className="text-xs" style={{ color: C.muted, lineHeight: 1.55 }}>{c.b}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default function Regret() {
  const [view, setView] = useState("npv"); // 'npv' | 'regret'
  const minimax = minimaxStrategy();
  const isRegret = view === "regret";

  return (
    <div>
      <PageHead
        kicker="Step 5 · The matrix — regret, computed"
        title="Five structurally distinct strategies × four worlds"
        sub="NPV at the 11% corporate hurdle, $B. Diversity by construction: the candidates span build-it-all, shrink-it, change-the-product, sell-shovels, and walk-away — not four variations of the memo. Toggle to Regret to see each cell as the bill for being wrong; the regret figures are computed live from the NPV grid, not stored."
      />

      <PlanGradedTable />
      <Primer />

      <Section
        title="The grid"
        right={
          <div className="flex gap-1">
            {["npv", "regret"].map(v => (
              <button key={v} onClick={() => setView(v)} className="px-2.5 py-1 rounded text-xs"
                style={{ fontFamily: MONO, cursor: "pointer", background: view === v ? C.navy : C.tint, color: view === v ? "#fff" : C.muted, fontWeight: view === v ? 700 : 400 }}>
                {v === "npv" ? "NPV ($B)" : "Regret ($B)"}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={th}>Strategy</th>
                {WORLD_IDS.map(w => <th key={w} style={{ ...th, textAlign: "right" }}>{w} <span style={{ fontWeight: 400, color: C.ice }}>{WORLD_SHORT[w]}</span></th>)}
                <th style={{ ...th, textAlign: "right" }}>Max regret</th>
              </tr>
            </thead>
            <tbody>
              {STRATEGIES.map(s => {
                const isMinimax = s.id === minimax;
                const mr = maxRegret(s.id);
                return (
                  <tr key={s.id} style={isMinimax ? { background: "rgba(46,125,91,0.08)" } : s.id === "S1" ? { background: "rgba(178,58,72,0.05)" } : undefined}>
                    <td style={{ ...td, whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: MONO, fontWeight: 700, color: C.navy }}>{s.id}</span>
                      <span className="ml-2" style={{ fontWeight: 600 }}>{s.name}</span>
                      {isMinimax && <span className="ml-2 px-1.5 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.good, color: "#fff" }}>MINIMAX</span>}
                      {s.id === "S1" && <span className="ml-2 px-1.5 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.bad, color: "#fff" }}>MAX REGRET</span>}
                    </td>
                    {WORLD_IDS.map(w => {
                      const npv = NPV[s.id][w];
                      const reg = regretOf(s.id, w);
                      const isBest = npv === bestInWorld(w);
                      if (isRegret) {
                        const alpha = Math.min(0.06 + reg / 10, 0.5);
                        return (
                          <td key={w} style={{ ...tdMono, textAlign: "right", background: reg < 0.005 ? "rgba(46,125,91,0.15)" : `rgba(178,58,72,${alpha})`, fontWeight: reg === mr && reg > 0.005 ? 700 : 400 }}>
                            {reg < 0.005 ? "0 — best" : reg.toFixed(2)}
                          </td>
                        );
                      }
                      return (
                        <td key={w} style={{ ...tdMono, textAlign: "right", color: npv >= 0 ? C.good : C.bad, fontWeight: isBest ? 700 : 400 }}>
                          {f2(npv)}{isBest ? " ★" : ""}
                        </td>
                      );
                    })}
                    <td style={{ ...tdMono, textAlign: "right", fontWeight: 700, color: isMinimax ? C.good : s.id === "S1" ? C.bad : C.ink }}>{mr.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Note>
          {isRegret
            ? "Each cell: best-in-world NPV minus this strategy's NPV. Zero means this strategy IS the best response in that world. The bold cell in each row is where its max regret lives."
            : "★ marks the best response in each world. Best response ≠ the plan in 3 of 4 worlds — the gap is the fragility, now in dollars."}
        </Note>
      </Section>

      <div className="rounded-lg p-5 mb-4" style={{ background: C.navy }}>
        <div className="text-xs uppercase tracking-wider mb-2" style={{ color: C.amber, fontWeight: 700 }}>Headline</div>
        <p className="text-sm mb-2" style={{ color: C.ice, lineHeight: 1.65 }}>
          <b style={{ color: "#fff" }}>The plan is the maximum-regret strategy on the board ($7.15B).</b> The minimax-regret strategy is the memo's own
          Alternative #1 — Gateway-as-a-Service, NPV-positive in all four worlds, parked in an appendix. The robust play was inside the document all along;
          the memo's scoring rubric (strategic-impact points, not cross-world cash robustness) couldn't see it.
        </p>
        <p className="text-sm" style={{ color: C.ice, lineHeight: 1.65 }}>
          S1's premium over GaaS in its own dream world (W2) is just <b style={{ color: "#fff" }}>+$0.67B</b> — purchased with −$1.9B to −$5.7B of exposure
          everywhere else. The risk-return asymmetry is brutal once it's a number.
        </p>
      </div>

      <Section title="The five candidates — diversity enforced by construction">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {STRATEGIES.map(s => (
            <div key={s.id} className="rounded-lg p-3" style={{ background: C.paper, border: `1px solid ${s.id === minimax ? C.good : s.id === "S1" ? C.bad : C.line}` }}>
              <div className="flex items-baseline gap-2 mb-1">
                <span style={{ fontFamily: MONO, fontWeight: 700, color: C.navy }}>{s.id}</span>
                <span className="text-sm" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>{s.name}</span>
                <span className="ml-auto text-xs italic" style={{ color: C.amber, fontWeight: 700 }}>{s.archetype}</span>
              </div>
              <div className="text-xs" style={{ color: C.muted, lineHeight: 1.55 }}>{s.desc}</div>
              <div className="text-xs mt-1.5" style={{ fontFamily: MONO, color: C.muted }}>provenance: {s.provenance}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Caveats — carried openly, because without them this is confabulation with arithmetic">
        <ul className="text-sm pl-5" style={{ color: C.ink, lineHeight: 1.7, listStyle: "disc", maxWidth: 920 }}>
          <li><b>The rows are not equally trustworthy.</b> S1 inherits the memo calibration; S2–S5 revenue profiles are declared judgments, anchored loosely (OneWeb-class trajectories, the memo's Alternative-table fragments). The comparative shape — fragile plan, robust alternatives — is the defensible claim, not any single cell. (Open question #2.)</li>
          <li><b>NPV at hurdle compresses strategic value.</b> The cash model can't see ecosystem effects — the Galaxy moat, the foundry learning curve, optionality on a market that might 10×. A real Samsung decision would weight those; this matrix prices only cash.</li>
          <li><b>Pure strategies aren't the real choice set — and that's the punchline.</b> The memo doesn't recommend S1; it recommends Phase 1 for ~$2.5M, then gates. The matrix prices that staging: a $0.0025B option against a worst-case regret of $7.15B. The rational policy falls out of the grid — see the Pathway tab.</li>
        </ul>
      </Section>
    </div>
  );
}
