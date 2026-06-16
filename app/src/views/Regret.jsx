import { useState, useMemo, useEffect } from "react";
import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Note, th, td, tdMono } from "../components/ui.jsx";
import { runWorld, verdictOf } from "../engine.js";
import { WORLDS } from "../data/worlds.js";
import { STRATEGIES, WORLD_IDS, WORLD_SHORT, NPV, bestInWorld, regretOf, maxRegret, minimaxStrategy } from "../data/matrix.js";

const f2 = v => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(2);

// Shared color scales for the heatmap — derived once from the grid, no new numbers.
const GOOD_RGB = "46,125,91", BAD_RGB = "178,58,72";
const ALL_NPV = STRATEGIES.flatMap(s => WORLD_IDS.map(w => NPV[s.id][w]));
const MAX_POS = Math.max(...ALL_NPV);
const MAX_NEG = Math.abs(Math.min(...ALL_NPV));
const GLOBAL_MAX_REGRET = Math.max(...STRATEGIES.map(s => maxRegret(s.id)));

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

// ── The hero: a projector-legible heatmap of the 5×4 matrix. Same numbers as the
// Read-mode table, but full color-fill cells, a max-regret bar, optional robustness
// sort, and optional single-strategy highlight. Present-mode only. ──
function HeatGrid({ big = false, mode = "npv", sort = false, highlight = null }) {
  const minimax = minimaxStrategy();
  const rows = sort ? [...STRATEGIES].sort((a, b) => maxRegret(a.id) - maxRegret(b.id)) : STRATEGIES;

  const cellFs = big ? "clamp(13px,1.6vw,23px)" : 12;
  const headFs = big ? "clamp(10px,1.1vw,15px)" : 10;
  const labelFs = big ? "clamp(12px,1.4vw,20px)" : 12;
  const subFs = big ? "clamp(9px,0.95vw,13px)" : 9;
  const cellPad = big ? "clamp(8px,1.1vw,16px)" : "7px";
  const gap = big ? 5 : 3;

  const cols = `minmax(${big ? 190 : 130}px, 1.5fr) repeat(4, 1fr) ${big ? 1.4 : 1.2}fr`;

  const headCell = (txt, sub, align = "center") => (
    <div style={{ background: C.navy, color: "#fff", fontFamily: MONO, fontWeight: 700, fontSize: headFs, padding: cellPad, borderRadius: 6, textAlign: align, alignSelf: "stretch", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <span>{txt}</span>
      {sub && <span style={{ fontWeight: 400, color: C.ice, fontSize: subFs }}>{sub}</span>}
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: cols, gap, alignItems: "stretch" }}>
      {/* header row */}
      {headCell("Strategy", null, "left")}
      {WORLD_IDS.map(w => <div key={w}>{headCell(w, WORLD_SHORT[w])}</div>)}
      {headCell("Max regret", null)}

      {/* data rows */}
      {rows.map(s => {
        const sid = s.id;
        const isMin = sid === minimax;
        const isS1 = sid === "S1";
        const mr = maxRegret(sid);
        const dim = highlight != null && sid !== highlight;
        const rowOpacity = dim ? 0.32 : 1;

        const label = (
          <div key={`${sid}-label`} style={{
            background: C.paper, border: `1px solid ${isMin ? C.good : isS1 ? C.bad : C.line}`,
            borderLeft: `${big ? 5 : 3}px solid ${isMin ? C.good : isS1 ? C.bad : C.line}`,
            borderRadius: 6, padding: cellPad, opacity: rowOpacity, display: "flex", flexDirection: "column", justifyContent: "center", gap: 3,
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontFamily: MONO, fontWeight: 700, color: C.navy, fontSize: labelFs }}>{sid}</span>
              <span style={{ fontWeight: 600, color: C.ink, fontSize: big ? "clamp(11px,1.2vw,17px)" : 12 }}>{s.name}</span>
            </div>
            {(isMin || isS1) && (
              <span style={{ alignSelf: "flex-start", fontFamily: MONO, fontWeight: 700, fontSize: subFs, padding: "2px 7px", borderRadius: 999, background: isMin ? C.good : C.bad, color: "#fff" }}>
                {isMin ? "MINIMAX" : "MAX REGRET"}
              </span>
            )}
          </div>
        );

        const worldCells = WORLD_IDS.map(w => {
          const npv = NPV[sid][w];
          const reg = regretOf(sid, w);
          if (mode === "regret") {
            const isZero = reg < 0.005;
            const a = 0.10 + 0.5 * (reg / GLOBAL_MAX_REGRET);
            const isWorst = Math.abs(reg - mr) < 0.005 && reg > 0.005;
            return (
              <div key={w} style={{
                background: isZero ? `rgba(${GOOD_RGB},0.20)` : `rgba(${BAD_RGB},${a})`,
                border: `1px solid ${isZero ? C.good : "transparent"}`,
                borderRadius: 6, padding: cellPad, textAlign: "center", opacity: rowOpacity,
                fontFamily: MONO, fontSize: cellFs, color: isZero ? C.good : C.ink, fontWeight: isZero || isWorst ? 700 : 400,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: isWorst ? `inset 0 0 0 2px ${C.bad}` : "none",
              }}>
                {isZero ? "0 · best" : reg.toFixed(2)}
              </div>
            );
          }
          const isBest = npv === bestInWorld(w);
          const a = npv >= 0 ? 0.12 + 0.5 * (npv / MAX_POS) : 0.12 + 0.5 * (Math.abs(npv) / MAX_NEG);
          return (
            <div key={w} style={{
              background: npv >= 0 ? `rgba(${GOOD_RGB},${a})` : `rgba(${BAD_RGB},${a})`,
              border: `1px solid ${isBest ? C.good : "transparent"}`,
              borderRadius: 6, padding: cellPad, textAlign: "center", opacity: rowOpacity,
              fontFamily: MONO, fontSize: cellFs, color: C.ink, fontWeight: isBest ? 700 : 400,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              boxShadow: isBest ? `inset 0 0 0 2px ${C.good}` : "none",
            }}>
              {f2(npv)}{isBest ? " ★" : ""}
            </div>
          );
        });

        const barColor = isMin ? C.good : isS1 ? C.bad : C.navy;
        const mrCell = (
          <div key={`${sid}-mr`} style={{
            background: C.paper, border: `1px solid ${C.line}`, borderRadius: 6, padding: cellPad, opacity: rowOpacity,
            display: "flex", flexDirection: "column", justifyContent: "center", gap: 5,
          }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: cellFs, color: barColor, textAlign: "center" }}>{mr.toFixed(2)}</div>
            <div style={{ height: big ? 9 : 5, background: C.tint, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(mr / GLOBAL_MAX_REGRET) * 100}%`, background: barColor }} />
            </div>
          </div>
        );

        return (
          <div key={sid} style={{ display: "contents" }}>
            {label}
            {worldCells}
            {mrCell}
          </div>
        );
      })}
    </div>
  );
}

// ── Read | Present pill. Renders inline in Read mode; fixed top-right in the overlay. ──
function ModeToggle({ isPresent, onRead, onPresent }) {
  const base = { fontFamily: MONO, fontWeight: 700, fontSize: 12, padding: "6px 16px", border: "none", cursor: "pointer", lineHeight: 1.4 };
  return (
    <div
      className="reg-mode-toggle"
      onClick={(e) => e.stopPropagation()}
      style={{ display: "inline-flex", borderRadius: 999, overflow: "hidden", border: `1px solid ${C.line}`, background: C.paper }}
    >
      <button
        onClick={(e) => { e.currentTarget.blur(); onRead(); }}
        style={{ ...base, background: isPresent ? C.paper : C.navy, color: isPresent ? C.muted : "#fff" }}
      >Read</button>
      <button
        onClick={(e) => { e.currentTarget.blur(); onPresent(); }}
        style={{ ...base, background: isPresent ? C.navy : C.paper, color: isPresent ? "#fff" : C.muted }}
      >Present</button>
    </div>
  );
}

// Present-beat type styles (clamp() keeps them legible on a 1080p projector).
const PBEAT_BIG = { fontFamily: SERIF, fontWeight: 700, color: C.navy, fontSize: "clamp(30px,4.6vw,58px)", lineHeight: 1.14, letterSpacing: "-0.01em", margin: 0 };
const PBEAT_SUB = { fontFamily: SERIF, color: C.muted, fontSize: "clamp(17px,2.05vw,24px)", lineHeight: 1.55, margin: 0 };
const PBEAT_KICK = { fontFamily: MONO, fontWeight: 700, fontSize: "clamp(12px,1.15vw,15px)", textTransform: "uppercase", letterSpacing: 2, color: C.amber };
const PBEAT_TAG = { display: "inline-block", fontFamily: MONO, fontWeight: 700, fontSize: "clamp(13px,1.35vw,17px)", background: C.amber, color: C.navy, padding: "9px 18px", borderRadius: 8 };
const PGRID_HEAD = { ...PBEAT_BIG, fontSize: "clamp(22px,2.7vw,38px)", textAlign: "center" };
const PBTN_NAVY = { fontFamily: MONO, fontWeight: 700, fontSize: "clamp(14px,1.5vw,18px)", background: C.navy, color: "#fff", border: "none", borderRadius: 8, padding: "14px 26px", cursor: "pointer" };
const PBTN_GHOST = { ...PBTN_NAVY, background: C.paper, color: C.navy, border: `1px solid ${C.line}` };

const PRESENT_CSS = `
@keyframes regBeatIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.present-beat { animation: regBeatIn 170ms ease-out; }
@media print { .present-overlay, .reg-mode-toggle { display: none !important; } }
`;

// Present-mode plan-alone verdict strip — recomputed live, same source as PlanGradedTable.
function PresentVerdictStrip() {
  const rows = WORLDS.filter(w => w.id !== "BASE").map(w => {
    const { m } = runWorld(w.x);
    return { w, m, v: verdictOf(m, C) };
  });
  return (
    <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(4, 1fr)" }}>
      {rows.map(({ w, m, v }) => (
        <div key={w.id} style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 12, padding: "clamp(14px,1.6vw,24px)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(12px,1.3vw,17px)", color: C.navy }}>{w.id}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(13px,1.4vw,19px)", color: C.ink, lineHeight: 1.25 }}>{WORLD_SHORT[w.id]}</div>
          <span style={{ alignSelf: "flex-start", fontFamily: MONO, fontWeight: 700, fontSize: "clamp(11px,1.15vw,15px)", padding: "5px 12px", borderRadius: 999, background: v.color, color: "#fff" }}>
            {v.v}{v.boundary ? " · boundary" : ""}
          </span>
          <div style={{ fontFamily: MONO, fontSize: "clamp(10px,1vw,13px)", color: C.muted }}>IRR {(m.irr * 100).toFixed(1)}% · BE {m.be ? `Y${m.be}` : ">15"}</div>
        </div>
      ))}
    </div>
  );
}

export default function Regret({ go }) {
  const [view, setView] = useState("npv"); // 'npv' | 'regret'
  const minimax = minimaxStrategy();
  const isRegret = view === "regret";

  const [isPresent, setIsPresent] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);

  const enterPresent = () => { setBeatIndex(0); setIsPresent(true); };
  const exitPresent = () => setIsPresent(false);

  // ── the present-mode beat sequence: the matrix is the hero, clarified in stages ──
  const beats = [
    // 1 · Hook
    (
      <div style={{ textAlign: "center" }}>
        <div style={PBEAT_KICK}>step 6 · the matrix — regret, computed</div>
        <div style={{ ...PBEAT_BIG, marginTop: 22 }}>Five strategies × four worlds.</div>
        <p style={{ ...PBEAT_SUB, maxWidth: 820, margin: "30px auto 0" }}>
          NPV at the 11% corporate hurdle —{" "}
          <span style={{ color: C.navy, fontWeight: 700 }}>20 runs of the same engine,</span> no row given a friendlier model.
        </p>
      </div>
    ),
    // 2 · The plan alone
    (
      <div>
        <div style={{ ...PBEAT_KICK, textAlign: "center", marginBottom: 26 }}>first, the plan alone</div>
        <PresentVerdictStrip />
        <div style={{ ...PGRID_HEAD, marginTop: 40 }}>
          Thrives in 1 of 4 worlds — a wager on W2, not a strategy across futures.
        </div>
      </div>
    ),
    // 3 · Regret primer
    (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_KICK, color: C.muted, marginBottom: 24 }}>the number that replaces probability</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, color: C.navy, fontSize: "clamp(18px,2.4vw,34px)", lineHeight: 1.4 }}>
          Regret = NPV(best in world) − NPV(your strategy)
        </div>
        <p style={{ ...PBEAT_SUB, fontStyle: "italic", marginTop: 18 }}>"The bill for being wrong about the world."</p>
        <div style={{ maxWidth: 760, margin: "32px auto 0", background: C.paper, border: `1px solid ${C.amber}`, borderRadius: 12, padding: "clamp(18px,2vw,30px)", textAlign: "left" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(11px,1.1vw,14px)", color: C.mid, marginBottom: 10 }}>WORKED — W3 INCUMBENT CITADEL</div>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(15px,1.6vw,21px)", color: C.ink, lineHeight: 1.6 }}>
            Best available strategy (GaaS) earns <span style={{ fontFamily: MONO, color: C.good, fontWeight: 700 }}>+$1.44B</span>; the plan earns <span style={{ fontFamily: MONO, color: C.bad, fontWeight: 700 }}>−$5.71B</span>.<br />
            <span style={{ fontFamily: MONO }}>Regret = 1.44 − (−5.71) = <b style={{ color: C.bad }}>$7.15B</b></span>
          </div>
        </div>
      </div>
    ),
    // 4 · NPV grid
    (
      <div>
        <div style={{ ...PBEAT_KICK, textAlign: "center", marginBottom: 24 }}>the grid · NPV ($B)</div>
        <HeatGrid big mode="npv" />
        <div style={{ ...PGRID_HEAD, marginTop: 36 }}>
          ★ = the best response in each world. The plan wins only its dream world.
        </div>
      </div>
    ),
    // 5 · Regret grid
    (
      <div>
        <div style={{ ...PBEAT_KICK, textAlign: "center", marginBottom: 24 }}>the same grid · regret ($B)</div>
        <HeatGrid big mode="regret" />
        <div style={{ ...PGRID_HEAD, marginTop: 36 }}>
          Each cell is the bill for being wrong. The boxed cell is where a strategy's worst bill lives.
        </div>
      </div>
    ),
    // 6 · Sorted by robustness + minimax highlight
    (
      <div>
        <div style={{ ...PBEAT_KICK, textAlign: "center", marginBottom: 24 }}>sorted by robustness</div>
        <HeatGrid big mode="regret" sort highlight={minimax} />
        <div style={{ ...PGRID_HEAD, marginTop: 36 }}>
          Minimax regret: the smallest worst-case bill rises to the top — <span style={{ color: C.good }}>S4, Gateway-as-a-Service.</span>
        </div>
      </div>
    ),
    // 7 · Headline — the plan is max regret; the robust play was in the appendix
    (
      <div style={{ textAlign: "center" }}>
        <div style={PBEAT_BIG}>The plan is the <span style={{ color: C.bad }}>maximum-regret</span> strategy on the board — $7.15B.</div>
        <p style={{ ...PBEAT_SUB, maxWidth: 900, margin: "30px auto 0" }}>
          The minimax play — <span style={{ color: C.navy, fontWeight: 700 }}>Gateway-as-a-Service</span> — was the memo's own Alternative #1, parked in an appendix.
          NPV-positive in all four worlds. The robust play was inside the document all along.
        </p>
      </div>
    ),
    // 8 · Headline — the asymmetry
    (
      <div style={{ textAlign: "center" }}>
        <div style={PBEAT_BIG}>Brutal once it's a number.</div>
        <p style={{ ...PBEAT_SUB, maxWidth: 900, margin: "30px auto 0" }}>
          S1's premium in its dream world (W2) is just <span style={{ color: C.navy, fontWeight: 700 }}>+$0.67B</span> —
          purchased with <span style={{ color: C.bad, fontWeight: 700 }}>−$1.9B to −$5.7B</span> of exposure everywhere else.
        </p>
      </div>
    ),
    // 9 · Caveats
    (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_KICK, color: C.muted, marginBottom: 24 }}>carried openly</div>
        <div style={{ ...PBEAT_BIG, fontSize: "clamp(24px,3vw,40px)" }}>Without these, this is confabulation with arithmetic.</div>
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginTop: 36, textAlign: "left" }}>
          {[
            { t: "The rows aren't equally trustworthy", b: "S1 inherits the calibration; S2–S5 ramps are declared judgments. The defensible claim is the comparative shape — not any single cell." },
            { t: "NPV compresses strategic value", b: "The cash model can't price the Galaxy moat, the foundry learning curve, or optionality on a market that might 10×." },
            { t: "Pure strategies aren't the real choice set", b: "The memo recommends Phase 1 for ~$2.5M, then gates — a $0.0025B option against a $7.15B worst-case regret." },
          ].map(c => (
            <div key={c.t} style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: "clamp(14px,1.6vw,24px)" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy, fontSize: "clamp(14px,1.5vw,20px)", marginBottom: 8 }}>{c.t}</div>
              <div style={{ fontFamily: SERIF, color: C.muted, fontSize: "clamp(12px,1.3vw,17px)", lineHeight: 1.5 }}>{c.b}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    // 10 · Close / handoff
    (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_BIG, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
          The rational policy falls out of the grid.
        </div>
        <div style={{ marginTop: 30 }}>
          <span style={PBEAT_TAG}>a $0.0025B option against a $7.15B worst-case regret.</span>
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 40 }}>
          <button onClick={(e) => { e.stopPropagation(); go("pathway"); }} style={PBTN_NAVY}>the pathway →</button>
          <button onClick={(e) => { e.stopPropagation(); go("strategies"); }} style={PBTN_GHOST}>the strategies →</button>
        </div>
      </div>
    ),
  ];

  const beatCount = beats.length;

  // Keyboard navigation — only while presenting; functional updates avoid stale state.
  useEffect(() => {
    if (!isPresent) return;
    function onKey(e) {
      if (e.key === "Escape") { setIsPresent(false); return; }
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setBeatIndex((i) => Math.min(i + 1, beatCount - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setBeatIndex((i) => Math.max(i - 1, 0));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPresent, beatCount]);

  // Click-zone navigation: right 60% advances, left 20% goes back, middle is a dead band.
  function handleZoneClick(e) {
    const x = e.clientX / window.innerWidth;
    if (x >= 0.4) setBeatIndex((i) => Math.min(i + 1, beatCount - 1));
    else if (x <= 0.2) setBeatIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <div>
      <style>{PRESENT_CSS}</style>

      {/* ── Read | Present toggle (page-level in Read mode) ── */}
      <div className="flex justify-end mb-3">
        <ModeToggle isPresent={isPresent} onRead={exitPresent} onPresent={enterPresent} />
      </div>

      <PageHead
        kicker="Step 6 · The matrix — regret, computed"
        title="Five structurally distinct strategies × four worlds"
        sub="The five strategies from the previous tab meet the four worlds. NPV at the 11% corporate hurdle, $B. Toggle to Regret to see each cell as the bill for being wrong; the regret figures are computed live from the NPV grid, not stored."
      />

      <PlanGradedTable />
      <Primer />

      <Section title="The rows — a reminder of who's who">
        <div className="flex flex-wrap items-center gap-2">
          {STRATEGIES.map(s => (
            <button key={s.id} onClick={() => go("strategies")} className="rounded px-2.5 py-1.5 text-left" style={{
              background: C.paper, cursor: "pointer",
              border: `1px solid ${s.id === minimax ? C.good : s.id === "S1" ? C.bad : C.line}`,
            }}>
              <span style={{ fontFamily: MONO, fontWeight: 700, color: C.navy, fontSize: 12 }}>{s.id}</span>
              <span className="ml-1.5 text-xs" style={{ fontWeight: 600, color: C.ink }}>{s.name}</span>
              <span className="ml-1.5 text-xs italic" style={{ color: C.amber, fontWeight: 700 }}>{s.archetype}</span>
            </button>
          ))}
          <button onClick={() => go("strategies")} className="px-2.5 py-1.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.navy, color: "#fff", border: "none", cursor: "pointer" }}>
            full detail — the Strategies tab →
          </button>
        </div>
      </Section>

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

      <Section title="Caveats — carried openly, because without them this is confabulation with arithmetic">
        <ul className="text-sm pl-5" style={{ color: C.ink, lineHeight: 1.7, listStyle: "disc", maxWidth: 920 }}>
          <li><b>The rows are not equally trustworthy.</b> S1 inherits the memo calibration; S2–S5 revenue profiles are declared judgments, anchored loosely (OneWeb-class trajectories, the memo's Alternative-table fragments). The comparative shape — fragile plan, robust alternatives — is the defensible claim, not any single cell. (Open question #2.)</li>
          <li><b>NPV at hurdle compresses strategic value.</b> The cash model can't see ecosystem effects — the Galaxy moat, the foundry learning curve, optionality on a market that might 10×. A real Samsung decision would weight those; this matrix prices only cash.</li>
          <li><b>Pure strategies aren't the real choice set — and that's the punchline.</b> The memo doesn't recommend S1; it recommends Phase 1 for ~$2.5M, then gates. The matrix prices that staging: a $0.0025B option against a worst-case regret of $7.15B. The rational policy falls out of the grid — see the Pathway tab.</li>
        </ul>
      </Section>

      {/* ── Present-mode overlay — fixed above app chrome, one beat at a time ── */}
      {isPresent && (
        <div
          className="present-overlay"
          onClick={handleZoneClick}
          style={{ position: "fixed", inset: 0, zIndex: 9000, background: C.paper, overflow: "hidden", userSelect: "none", cursor: "default" }}
        >
          <div style={{ position: "absolute", top: 20, left: 26, zIndex: 3, fontFamily: MONO, fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: 0.5 }}>
            Samsung LEO · Regret
          </div>
          <div style={{ position: "absolute", top: 16, right: 20, zIndex: 3 }}>
            <ModeToggle isPresent={isPresent} onRead={exitPresent} onPresent={enterPresent} />
          </div>

          <div
            key={beatIndex}
            className="present-beat"
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "78px clamp(24px,5vw,96px) 96px", boxSizing: "border-box" }}
          >
            <div style={{ width: "100%", maxWidth: 1180 }}>{beats[beatIndex]}</div>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "absolute", bottom: 24, left: 0, right: 0, zIndex: 3, display: "flex", justifyContent: "center", gap: 10 }}
          >
            {beats.map((_, i) => {
              const current = i === beatIndex;
              const seen = i < beatIndex;
              const size = current ? 13 : 9;
              return (
                <button
                  key={i}
                  onClick={() => setBeatIndex(i)}
                  aria-label={`Go to beat ${i + 1}`}
                  style={{
                    width: size, height: size, padding: 0, borderRadius: 999, cursor: "pointer",
                    background: current ? C.amber : seen ? C.navy : "transparent",
                    border: `1px solid ${current ? C.amber : seen ? C.navy : C.line}`,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
