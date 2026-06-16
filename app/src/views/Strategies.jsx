import { useState, useEffect } from "react";
import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Note } from "../components/ui.jsx";
import { STRATEGIES, WORLD_IDS, WORLD_SHORT, NPV, bestInWorld, maxRegret, minimaxStrategy } from "../data/matrix.js";

const ARCHETYPES = [
  { id: "S1", label: "build it all" },
  { id: "S2", label: "shrink it" },
  { id: "S3", label: "change the product" },
  { id: "S4", label: "sell shovels" },
  { id: "S5", label: "walk away" },
];

function CommitmentSpectrum() {
  return (
    <div>
      {/* the axis itself — two labeled poles, a gradient running between them */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="rounded-lg px-3 py-2 text-center" style={{ background: C.navy }}>
          <span className="block uppercase" style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>maximum commitment</span>
          <span className="block" style={{ fontFamily: MONO, fontSize: 10, color: C.ice, whiteSpace: "nowrap" }}>$10–12B · full launch exposure</span>
        </div>
        <div className="flex-1 relative" style={{ minWidth: 60 }}>
          <div style={{ height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${C.navy}, ${C.line})` }} />
          <span className="absolute" style={{ right: -4, top: -7, color: C.muted, fontWeight: 700 }}>→</span>
        </div>
        <div className="rounded-lg px-3 py-2 text-center" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <span className="block uppercase" style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.navy, letterSpacing: "0.05em", whiteSpace: "nowrap" }}>zero commitment</span>
          <span className="block" style={{ fontFamily: MONO, fontSize: 10, color: C.muted, whiteSpace: "nowrap" }}>no operator role</span>
        </div>
      </div>
      {/* the five candidates, placed along it */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {ARCHETYPES.map((a, i) => {
          const s = STRATEGIES.find(st => st.id === a.id);
          return (
            <span key={a.id} className="flex items-center gap-1.5 flex-1" style={{ minWidth: "fit-content" }}>
              <span className="rounded-lg px-2.5 py-1.5 text-center flex-1" style={{ background: C.navy, border: `1px solid ${C.navy}` }}>
                <span className="block text-xs" style={{ fontFamily: MONO, fontWeight: 700, color: C.amber, whiteSpace: "nowrap" }}>{a.id} · {s.name}</span>
                <span className="block text-xs" style={{ fontFamily: MONO, fontSize: 10, color: C.ice, whiteSpace: "nowrap" }}>{a.label}</span>
              </span>
              {i < ARCHETYPES.length - 1 && <span style={{ color: C.amber, fontWeight: 700 }}>→</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function NpvStrip({ sid }) {
  const mr = maxRegret(sid);
  return (
    <div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {WORLD_IDS.map(w => {
          const npv = NPV[sid][w];
          const best = npv === bestInWorld(w);
          return (
            <div key={w} className="rounded px-2 py-1.5" style={{
              background: npv >= 0 ? "rgba(46,125,91,0.08)" : "rgba(178,58,72,0.08)",
              border: `1px solid ${best ? C.good : C.line}`,
            }}>
              <div className="text-xs" style={{ fontFamily: MONO, fontSize: 9, color: C.muted, whiteSpace: "nowrap" }}>{w} · {WORLD_SHORT[w]}</div>
              <div className="text-xs" style={{ fontFamily: MONO, fontWeight: 700, color: npv >= 0 ? C.good : C.bad }}>
                {npv > 0 ? "+" : npv < 0 ? "−" : ""}${Math.abs(npv).toFixed(2)}B{best ? " ★" : ""}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-xs mt-1.5" style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>
        worst-case regret: <b style={{ color: mr === maxRegret(minimaxStrategy()) ? C.good : C.ink }}>${mr.toFixed(2)}B</b>
      </div>
    </div>
  );
}

// ── Reusable commitment-spectrum visual. big=true fills a present-mode beat;
// activeId highlights one candidate for orientation on a per-strategy beat. ──
function SpectrumViz({ big = false, activeId = null }) {
  const dimmed = activeId != null;
  const poleFs = big ? "clamp(12px,1.4vw,17px)" : 11;
  const poleSub = big ? "clamp(9px,0.95vw,12px)" : 9;
  const cardName = big ? "clamp(12px,1.45vw,18px)" : 11;
  const cardLabel = big ? "clamp(10px,1vw,13px)" : 9;
  const arrowFs = big ? "clamp(13px,1.6vw,22px)" : 12;
  const pole = (dark) => ({
    borderRadius: 10, padding: big ? "10px 16px" : "7px 10px", textAlign: "center",
    background: dark ? C.navy : C.paper, border: dark ? "none" : `1px solid ${C.line}`,
  });
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: big ? 14 : 8 }}>
        <div style={pole(true)}>
          <span style={{ display: "block", fontFamily: MONO, fontWeight: 700, fontSize: poleFs, color: "#fff", letterSpacing: "0.05em", whiteSpace: "nowrap", textTransform: "uppercase" }}>maximum commitment</span>
          <span style={{ display: "block", fontFamily: MONO, fontSize: poleSub, color: C.ice, whiteSpace: "nowrap" }}>$10–12B · full launch exposure</span>
        </div>
        <div style={{ flex: 1, position: "relative", minWidth: 40 }}>
          <div style={{ height: big ? 6 : 4, borderRadius: 3, background: `linear-gradient(90deg, ${C.navy}, ${C.line})` }} />
          <span style={{ position: "absolute", right: -4, top: big ? -9 : -7, color: C.muted, fontWeight: 700 }}>→</span>
        </div>
        <div style={pole(false)}>
          <span style={{ display: "block", fontFamily: MONO, fontWeight: 700, fontSize: poleFs, color: C.navy, letterSpacing: "0.05em", whiteSpace: "nowrap", textTransform: "uppercase" }}>zero commitment</span>
          <span style={{ display: "block", fontFamily: MONO, fontSize: poleSub, color: C.muted, whiteSpace: "nowrap" }}>no operator role</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "stretch", gap: big ? 8 : 4 }}>
        {ARCHETYPES.map((a, i) => {
          const s = STRATEGIES.find(st => st.id === a.id);
          const on = activeId === a.id;
          return (
            <div key={a.id} style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}>
              <div style={{
                flex: 1, minWidth: 0, textAlign: "center", borderRadius: 10,
                padding: big ? "clamp(8px,1vw,14px)" : "7px 6px",
                background: on ? C.amber : C.navy,
                border: `1px solid ${on ? C.amber : C.navy}`,
                opacity: dimmed && !on ? 0.4 : 1,
                transform: on ? "translateY(-3px)" : "none",
                boxShadow: on ? "0 6px 18px rgba(26,34,56,0.22)" : "none",
                transition: "opacity 140ms ease, transform 140ms ease",
              }}>
                <span style={{ display: "block", fontFamily: MONO, fontWeight: 700, fontSize: cardName, color: on ? C.navy : C.amber, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.id} · {s.name}</span>
                <span style={{ display: "block", fontFamily: MONO, fontSize: cardLabel, color: on ? C.navy : C.ice, whiteSpace: "nowrap" }}>{a.label}</span>
              </div>
              {i < ARCHETYPES.length - 1 && <span style={{ color: C.amber, fontWeight: 700, fontSize: arrowFs, padding: big ? "0 4px" : "0 2px" }}>→</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Present-mode NPV-per-world strip, scaled up for a projector.
function PresentNpv({ sid, minimax }) {
  const mr = maxRegret(sid);
  return (
    <div>
      <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(2, 1fr)" }}>
        {WORLD_IDS.map(w => {
          const npv = NPV[sid][w];
          const best = npv === bestInWorld(w);
          return (
            <div key={w} style={{
              borderRadius: 8, padding: "10px 12px",
              background: npv >= 0 ? "rgba(46,125,91,0.08)" : "rgba(178,58,72,0.08)",
              border: `1px solid ${best ? C.good : C.line}`,
            }}>
              <div style={{ fontFamily: MONO, fontSize: "clamp(9px,0.95vw,12px)", color: C.muted, whiteSpace: "nowrap" }}>{w} · {WORLD_SHORT[w]}</div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(14px,1.6vw,21px)", color: npv >= 0 ? C.good : C.bad }}>
                {npv > 0 ? "+" : npv < 0 ? "−" : ""}${Math.abs(npv).toFixed(2)}B{best ? " ★" : ""}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: MONO, fontSize: "clamp(11px,1.1vw,14px)", color: C.muted, marginTop: 10 }}>
        worst-case regret: <b style={{ color: sid === minimax ? C.good : C.ink }}>${mr.toFixed(2)}B</b>
      </div>
    </div>
  );
}

// ── Read | Present pill. Renders inline in Read mode; fixed top-right in the overlay. ──
function ModeToggle({ isPresent, onRead, onPresent }) {
  const base = { fontFamily: MONO, fontWeight: 700, fontSize: 12, padding: "6px 16px", border: "none", cursor: "pointer", lineHeight: 1.4 };
  return (
    <div
      className="str-mode-toggle"
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
const PBTN_NAVY = { fontFamily: MONO, fontWeight: 700, fontSize: "clamp(14px,1.5vw,18px)", background: C.navy, color: "#fff", border: "none", borderRadius: 8, padding: "14px 26px", cursor: "pointer" };
const PBTN_GHOST = { ...PBTN_NAVY, background: C.paper, color: C.navy, border: `1px solid ${C.line}` };
const PBADGE = { fontFamily: MONO, fontWeight: 700, fontSize: "clamp(11px,1.15vw,15px)", padding: "6px 14px", borderRadius: 999 };

const PRESENT_CSS = `
@keyframes strBeatIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.present-beat { animation: strBeatIn 170ms ease-out; }
@media print { .present-overlay, .str-mode-toggle { display: none !important; } }
`;

// One present beat per strategy: orientation strip, name + archetype, brief
// explanation, the levers it sets, the bet it makes, and where it lands.
function StrategyBeat({ s, minimax }) {
  const isMinimax = s.id === minimax;
  const isS1 = s.id === "S1";
  const cardLabel = { fontFamily: MONO, fontWeight: 700, fontSize: "clamp(10px,1vw,13px)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 };
  const cardBody = { fontFamily: SERIF, fontSize: "clamp(13px,1.4vw,18px)", lineHeight: 1.5 };
  return (
    <div>
      <SpectrumViz activeId={s.id} />
      <div style={{ textAlign: "center", marginTop: "clamp(22px,3vw,40px)" }}>
        <div style={PBEAT_KICK}>{s.archetype}</div>
        <div style={{ ...PBEAT_BIG, fontSize: "clamp(26px,3.8vw,50px)", marginTop: 8 }}>{s.id} · {s.name}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginTop: 16 }}>
          {isMinimax && <span style={{ ...PBADGE, background: C.good, color: "#fff" }}>MINIMAX REGRET</span>}
          {isS1 && <span style={{ ...PBADGE, background: C.bad, color: "#fff" }}>MAX REGRET</span>}
          <span style={{ ...PBADGE, background: C.tint, color: C.muted }}>provenance: {s.provenance}</span>
        </div>
        <p style={{ ...PBEAT_SUB, fontSize: "clamp(15px,1.7vw,21px)", color: C.ink, maxWidth: 940, margin: "16px auto 0" }}>{s.desc}</p>
        <div style={{ display: "grid", gap: 14, marginTop: 24, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", textAlign: "left" }}>
          <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: "clamp(14px,1.5vw,22px)" }}>
            <div style={{ ...cardLabel, color: C.muted }}>The levers (L) it sets</div>
            {s.levers.map((l, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "3px 0", fontFamily: SERIF, fontSize: "clamp(12px,1.3vw,16px)", color: C.ink, lineHeight: 1.45 }}>
                <span style={{ color: C.amber, fontWeight: 700 }}>·</span>{l}
              </div>
            ))}
          </div>
          <div style={{ background: C.navy, borderRadius: 10, padding: "clamp(14px,1.5vw,22px)" }}>
            <div style={{ ...cardLabel, color: C.amber }}>The bet it makes</div>
            <div style={{ ...cardBody, color: C.ice }}>{s.bet}</div>
          </div>
          <div style={{ background: C.paper, border: `1px solid ${isMinimax ? C.good : isS1 ? C.bad : C.line}`, borderRadius: 10, padding: "clamp(14px,1.5vw,22px)" }}>
            <div style={{ ...cardLabel, color: C.muted }}>Where it lands — NPV/world, $B</div>
            <PresentNpv sid={s.id} minimax={minimax} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Strategies({ go }) {
  const minimax = minimaxStrategy();

  const [isPresent, setIsPresent] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);

  const enterPresent = () => { setBeatIndex(0); setIsPresent(true); };
  const exitPresent = () => setIsPresent(false);

  // ── the present-mode beat sequence: theory first, then the five strategies ──
  const beats = [
    // 1 · Hook
    (
      <div style={{ textAlign: "center" }}>
        <div style={PBEAT_KICK}>step 5 · strategies — the L-side of the grammar</div>
        <div style={{ ...PBEAT_BIG, marginTop: 22 }}>Five ways to face the same four futures.</div>
        <p style={{ ...PBEAT_SUB, maxWidth: 860, margin: "30px auto 0" }}>
          Worlds were pure X-vectors. Strategies are the mirror image —{" "}
          <span style={{ color: C.navy, fontWeight: 700 }}>pure L-configurations:</span> settings of Samsung's own levers, the futures untouched.
        </p>
      </div>
    ),
    // 2 · The theory — diversity by construction + the rule
    (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_KICK, color: C.muted, marginBottom: 26 }}>the theory</div>
        <div style={PBEAT_BIG}>
          Built to span the whole response space — not five versions of one plan.
        </div>
        <p style={{ ...PBEAT_SUB, maxWidth: 880, margin: "26px auto 0" }}>
          Structurally distinct candidates, from committing everything to walking away. Three of the five come from inside the memo itself —
          the analysis only promoted them to equal standing.
        </p>
        <div style={{ maxWidth: 900, margin: "32px auto 0", background: C.tint, borderLeft: `4px solid ${C.amber}`, borderRadius: 10, padding: "clamp(16px,1.8vw,26px)", textAlign: "left" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(11px,1.1vw,14px)", color: C.bad, marginBottom: 8 }}>THE RULE</div>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(15px,1.6vw,21px)", color: C.ink, lineHeight: 1.5 }}>
            Strategies may touch only L. A candidate cannot assume the premium holds or that launch gets cheap — it has to face whatever world it lands in.
          </div>
        </div>
      </div>
    ),
    // 3 · The commitment spectrum (big)
    (
      <div>
        <div style={{ ...PBEAT_KICK, textAlign: "center", marginBottom: 28 }}>the candidate set</div>
        <SpectrumViz big />
        <div style={{ ...PBEAT_BIG, fontSize: "clamp(24px,3vw,40px)", textAlign: "center", marginTop: 44 }}>
          Maximum commitment to zero — five distinct bets.
        </div>
      </div>
    ),
    // 4–8 · one beat per strategy
    <StrategyBeat s={STRATEGIES[0]} minimax={minimax} />,
    <StrategyBeat s={STRATEGIES[1]} minimax={minimax} />,
    <StrategyBeat s={STRATEGIES[2]} minimax={minimax} />,
    <StrategyBeat s={STRATEGIES[3]} minimax={minimax} />,
    <StrategyBeat s={STRATEGIES[4]} minimax={minimax} />,
    // 9 · The honesty note
    (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_KICK, color: C.muted, marginBottom: 26 }}>before the matrix</div>
        <div style={PBEAT_BIG}>The five rows are not equally trustworthy — and the matrix says so.</div>
        <p style={{ ...PBEAT_SUB, maxWidth: 900, margin: "28px auto 0" }}>
          S1 inherits the calibrated baseline; S2–S5 ramps are{" "}
          <span style={{ color: C.navy, fontWeight: 700 }}>declared judgments.</span> The defensible claim is the comparative shape —
          a fragile plan against robust alternatives — not any single cell.
        </p>
      </div>
    ),
    // 10 · Close / handoff
    (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_BIG, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
          Now run all five against all four worlds.
        </div>
        <div style={{ marginTop: 30 }}>
          <span style={PBEAT_TAG}>5 × 4 = 20 runs of the same engine.</span>
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 40 }}>
          <button onClick={(e) => { e.stopPropagation(); go("regret"); }} style={PBTN_NAVY}>the matrix →</button>
          <button onClick={(e) => { e.stopPropagation(); go("worlds"); }} style={PBTN_GHOST}>the worlds →</button>
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

      {/* ── Read-mode document — always in normal flow, so Esc and print are trivially correct ── */}
      <PageHead
        kicker="Step 5 · Strategies — the L-side of the grammar"
        title="Five ways to face the same four futures"
        sub="Worlds were pure X-vectors; strategies are the mirror image — pure L-configurations. Each candidate below is a setting of Samsung's own levers, the futures untouched. The matrix tab then runs every strategy through every world: 5 × 4 = 20 runs of the same engine."
      />

      <Section title="How the candidate set was built — diversity by construction">
        <p className="text-sm mb-3" style={{ color: C.ink, lineHeight: 1.65, maxWidth: 920 }}>
          The candidates are deliberately <b>structurally distinct</b>, not five variations of the memo's plan. They span the full response
          space — from committing everything to walking away — so that when one of them dominates the regret table, it is a result, not an artifact
          of a narrow menu. Three of the five come from inside the memo itself; the analysis only promoted them to equal standing.
        </p>
        <CommitmentSpectrum />
        <Note>
          The rule carried over from the grammar: strategies may touch only L. A strategy cannot assume the premium holds or that launch gets cheap —
          it has to face whatever world it lands in.
        </Note>
      </Section>

      {STRATEGIES.map(s => {
        const isMinimax = s.id === minimax;
        const isS1 = s.id === "S1";
        return (
          <Section key={s.id} title={`${s.id} · ${s.name}`}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.navy, color: C.amber }}>{s.archetype}</span>
              {isMinimax && <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.good, color: "#fff" }}>MINIMAX REGRET</span>}
              {isS1 && <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.bad, color: "#fff" }}>MAX REGRET</span>}
              <span className="text-xs" style={{ fontFamily: MONO, color: C.muted }}>provenance: {s.provenance}</span>
            </div>
            <p className="text-sm mb-3" style={{ color: C.ink, lineHeight: 1.6, maxWidth: 920 }}>{s.desc}</p>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              <div className="rounded p-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
                <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: C.muted, fontWeight: 700 }}>The levers (L) it sets</div>
                {s.levers.map((l, i) => (
                  <div key={i} className="text-xs flex gap-1.5 py-0.5" style={{ color: C.ink, lineHeight: 1.5 }}>
                    <span style={{ color: C.amber, fontWeight: 700 }}>·</span>{l}
                  </div>
                ))}
              </div>
              <div className="rounded p-3" style={{ background: C.navy }}>
                <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: C.amber, fontWeight: 700 }}>The bet it makes</div>
                <div className="text-xs mb-2.5" style={{ color: C.ice, lineHeight: 1.6 }}>{s.bet}</div>
                <div className="text-xs pt-2" style={{ color: "rgba(202,220,252,0.75)", lineHeight: 1.55, borderTop: "1px solid rgba(202,220,252,0.2)" }}>
                  <b style={{ color: C.ice }}>Where it comes from: </b>{s.memoSrc}
                </div>
              </div>
              <div className="rounded p-3" style={{ background: C.paper, border: `1px solid ${isMinimax ? C.good : isS1 ? C.bad : C.line}` }}>
                <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: C.muted, fontWeight: 700 }}>Where it lands — NPV per world, $B</div>
                <NpvStrip sid={s.id} />
              </div>
            </div>
          </Section>
        );
      })}

      <Section title="One honesty note before the matrix">
        <div className="text-sm rounded p-3" style={{ background: C.tint, color: C.ink, lineHeight: 1.65, borderLeft: `4px solid ${C.amber}` }}>
          The five rows are not equally trustworthy, and the matrix says so out loud: S1 inherits the calibrated baseline; S2–S5 revenue ramps are
          <b> declared judgments</b>, anchored loosely (OneWeb-class trajectories, the memo's own Alternative tables). The defensible claim is the
          comparative shape — a fragile plan against robust alternatives — not any single cell.
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => go("regret")} className="px-3 py-1.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.navy, color: "#fff", border: "none", cursor: "pointer" }}>
            now run all five against all four worlds — the matrix →
          </button>
          <button onClick={() => go("worlds")} className="px-3 py-1.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.paper, color: C.navy, border: `1px solid ${C.line}`, cursor: "pointer" }}>
            ← back to the worlds these will face
          </button>
        </div>
      </Section>

      {/* ── Present-mode overlay — fixed above app chrome, one beat at a time ── */}
      {isPresent && (
        <div
          className="present-overlay"
          onClick={handleZoneClick}
          style={{ position: "fixed", inset: 0, zIndex: 9000, background: C.paper, overflow: "hidden", userSelect: "none", cursor: "default" }}
        >
          <div style={{ position: "absolute", top: 20, left: 26, zIndex: 3, fontFamily: MONO, fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: 0.5 }}>
            Samsung LEO · Strategies
          </div>
          <div style={{ position: "absolute", top: 16, right: 20, zIndex: 3 }}>
            <ModeToggle isPresent={isPresent} onRead={exitPresent} onPresent={enterPresent} />
          </div>

          <div
            key={beatIndex}
            className="present-beat"
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "78px clamp(24px,5vw,96px) 96px", boxSizing: "border-box" }}
          >
            <div style={{ width: "100%", maxWidth: 1120 }}>{beats[beatIndex]}</div>
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
