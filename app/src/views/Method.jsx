import { useState, useEffect } from "react";
import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Note } from "../components/ui.jsx";

// The seven steps, expanded — every fact below is restated from the step's own tab.
const STEPS = [
  {
    n: 1, name: "Extract", tab: "schema",
    input: "the memo — 140 pages of prose",
    output: "a cited parameter schema: 24 parameters, 12 risks, 9 calibration targets, 7 flags",
    what: "Every quantitative claim in the memo is pulled out, given an ID, cited to the section it came from, and tagged: X (the world decides it), L (Samsung decides it), D (derived — it recomputes), or GAP (required but absent — declared, never silently filled).",
    rule: "Nothing enters the model without a citation, a derivation, or a declared assumption.",
    payoff: "Extraction doubles as an audit: forcing prose into a schema surfaced two genuine incoherences in the memo (F4, F7) before any modeling began.",
  },
  {
    n: 2, name: "Calibrate", tab: "calibration",
    input: "the schema + a ~200-line annual cash engine",
    output: "a baseline the model has earned the right to use",
    what: "The memo's own stated outcomes — breakeven year, cash trough, IRR, margins, Year-10 revenue — become a test suite. The model must reproduce them before computing anything new. Two anchors were held out as pure tests, not fitting targets.",
    rule: "No deviation is computed until the baseline reproduces the memo.",
    payoff: "Six of seven anchors hit. The seventh broke — and the breakage is not a bug, it is the memo contradicting itself. That failure is Finding 1, the strongest result in the whole exercise.",
  },
  {
    n: 3, name: "Worlds", tab: "worlds",
    input: "the deep-uncertain X parameters",
    output: "four worlds — each a pure exogenous parameter vector",
    what: "Two axes that no study can resolve — does sovereignty demand stay fragmented or normalize? does launch access stay scarce or become abundant? — cross into four plausible futures. Each world is written down as nothing but X-parameter values: launch $/kg, co-invest share, revenue multiplier, delays.",
    rule: "Worlds may touch only X. A world that wants to change a lever is rejected by the schema.",
    payoff: "The futures stop being narratives and become inputs — something a model can actually run.",
  },
  {
    n: 4, name: "Verdicts", tab: "worlds",
    input: "each world × the plan as written",
    output: "THRIVE / REWORK / DIE per world",
    what: "The baseline plan runs through the engine under each world's X-vector. The verdict rule — IRR and breakeven thresholds — was fixed ex ante, before any world ran, so outcomes cannot be retro-fitted to a preferred story.",
    rule: "The verdict rule is frozen before the first world runs.",
    payoff: "Boundary cases get reported as boundaries (W1 lands at IRR 4.8% against a 5% cutoff) — not nudged to either side.",
  },
  {
    n: 5, name: "Strategies", tab: "strategies",
    input: "Samsung's levers + the memo's own alternatives",
    output: "five structurally distinct strategies — each a pure L-configuration",
    what: "The mirror image of step 3: where worlds were pure X-vectors, each strategy is a pure setting of Samsung's levers. The candidates are forced to span the whole response space — build it all, shrink it, change the product, sell shovels, walk away — three of them lifted from inside the memo itself.",
    rule: "Strategies may touch only L — they cannot wish the weather better.",
    payoff: "Diversity by construction: when one strategy later dominates the regret table, it is a result, not an artifact of a narrow menu.",
  },
  {
    n: 6, name: "Matrix + Regret", tab: "regret",
    input: "5 strategies × 4 worlds — 20 runs",
    output: "an NPV grid, and the regret read off it",
    what: "Every strategy runs under every world. Regret in a world is the gap to the best strategy in that world. Minimax regret picks the strategy whose worst miss is smallest: robust, rather than optimal-on-average.",
    rule: "Every cell comes from the same engine — no row gets a friendlier model.",
    payoff: "The recommendation stops depending on probabilities nobody can defend. No expected value is ever computed.",
  },
  {
    n: 7, name: "Pathway", tab: "pathway",
    input: "the regret table + the worlds' observable differences",
    output: "signposts, triggers, staged commitment — and a re-instantiation loop",
    what: "The worlds differ in observable ways years before the cash proves anything (a license event; price erosion). Those observables become signposts; signposts get tripwires; commitments are staged so capital is only released as the real world reveals which future it is.",
    rule: "Commit only what the observed world has licensed.",
    payoff: "The output is not a forecast but a monitoring system — a decision that adapts instead of a number that ages.",
  },
];

// The trust arc — the spine of the method, read off the steps above.
const ARC = [
  { label: "build trust", from: 1, to: 2, span: 2 },
  { label: "spend trust", from: 3, to: 6, span: 4 },
  { label: "make it live", from: 7, to: 7, span: 1 },
];

// ── Reusable pipeline visual. big=true fills a present-mode beat on a projector;
// activeStep highlights one node for orientation; showArc draws the trust-arc zones. ──
function Pipeline({ big = false, activeStep = null, showArc = false }) {
  const nodeFs = big ? "clamp(12px,1.5vw,19px)" : 11;
  const padY = big ? "clamp(10px,1.2vw,16px)" : "7px";
  const padX = big ? "clamp(8px,1vw,16px)" : "9px";
  const arrowFs = big ? "clamp(13px,1.6vw,22px)" : 13;
  const dimmed = activeStep != null;
  const loopActive = activeStep === 7;

  const node = (s) => {
    const on = activeStep === s.n;
    return (
      <div
        style={{
          flex: 1,
          minWidth: 0,
          textAlign: "center",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: nodeFs,
          lineHeight: 1.25,
          padding: `${padY} ${padX}`,
          borderRadius: 8,
          background: on ? C.amber : C.navy,
          color: on ? C.navy : "#fff",
          opacity: dimmed && !on ? 0.4 : 1,
          transform: on ? "translateY(-3px)" : "none",
          boxShadow: on ? `0 6px 18px rgba(26,34,56,0.22)` : "none",
          transition: "opacity 140ms ease, transform 140ms ease",
        }}
      >
        {s.n} · {s.name}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: big ? 10 : 6 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}>
              {node(s)}
              {i < STEPS.length - 1 && (
                <span style={{ color: C.amber, fontWeight: 700, fontSize: arrowFs, padding: big ? "0 6px" : "0 3px" }}>→</span>
              )}
            </div>
          ))}
        </div>
        {showArc && (
          <div style={{ display: "flex", gap: big ? 10 : 6, marginTop: big ? 14 : 8 }}>
            {ARC.map((a) => (
              <div
                key={a.label}
                style={{
                  flex: a.span,
                  textAlign: "center",
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: big ? "clamp(11px,1.2vw,15px)" : 10,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: C.navy,
                  background: C.tint,
                  border: `1px solid ${C.line}`,
                  borderTop: `3px solid ${C.amber}`,
                  borderRadius: 6,
                  padding: big ? "8px 6px" : "5px 4px",
                }}
              >
                {a.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, paddingTop: big ? "clamp(4px,0.6vw,10px)" : 4 }}>
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: big ? "clamp(15px,1.9vw,26px)" : 14,
            color: loopActive ? C.amber : C.muted,
            opacity: dimmed && !loopActive ? 0.4 : 1,
          }}
        >
          ↻
        </span>
        {big && (
          <span style={{ fontFamily: MONO, fontSize: "clamp(9px,0.85vw,12px)", color: C.muted, maxWidth: 96, textAlign: "center", lineHeight: 1.25 }}>
            re-instantiate
          </span>
        )}
      </div>
    </div>
  );
}

// ── Read | Present pill. Renders inline in Read mode; fixed top-right in the overlay. ──
function ModeToggle({ isPresent, onRead, onPresent }) {
  const base = { fontFamily: MONO, fontWeight: 700, fontSize: 12, padding: "6px 16px", border: "none", cursor: "pointer", lineHeight: 1.4 };
  return (
    <div
      className="mth-mode-toggle"
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
const PCHIP = { fontFamily: MONO, fontWeight: 700, fontSize: "clamp(12px,1.3vw,16px)", background: C.tint, color: C.navy, padding: "10px 16px", borderRadius: 8, lineHeight: 1.4 };

const PRESENT_CSS = `
@keyframes mthBeatIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.present-beat { animation: mthBeatIn 170ms ease-out; }
@media print { .present-overlay, .mth-mode-toggle { display: none !important; } }
`;

// One present beat per step: orientation strip, name, in→out, the rule, and the payoff punchline.
function StepBeat({ s }) {
  return (
    <div>
      <Pipeline activeStep={s.n} />
      <div style={{ textAlign: "center", marginTop: "clamp(26px,3.6vw,48px)" }}>
        <div style={PBEAT_KICK}>step {s.n}</div>
        <div style={{ ...PBEAT_BIG, marginTop: 10 }}>{s.name}</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginTop: 22 }}>
          <span style={PCHIP}><b>in:</b> {s.input}</span>
          <span style={{ color: C.amber, fontWeight: 700, fontSize: "clamp(16px,2vw,26px)" }}>→</span>
          <span style={PCHIP}><b>out:</b> {s.output}</span>
        </div>
        <div className="mth-step-cards" style={{ display: "grid", gap: 14, marginTop: 26, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", textAlign: "left" }}>
          <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: "clamp(16px,1.8vw,26px)", lineHeight: 1.55 }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(11px,1.1vw,14px)", color: C.bad, marginBottom: 8 }}>THE RULE</div>
            <div style={{ fontFamily: SERIF, fontSize: "clamp(15px,1.6vw,21px)", color: C.ink, lineHeight: 1.5 }}>{s.rule}</div>
          </div>
          <div style={{ background: C.tint, borderLeft: `4px solid ${C.amber}`, borderRadius: 10, padding: "clamp(16px,1.8vw,26px)", lineHeight: 1.55 }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(11px,1.1vw,14px)", color: C.navy, marginBottom: 8 }}>WHY IT MATTERS</div>
            <div style={{ fontFamily: SERIF, fontSize: "clamp(15px,1.6vw,21px)", color: C.ink, lineHeight: 1.5 }}>{s.payoff}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Method({ go }) {
  const [isPresent, setIsPresent] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);

  const enterPresent = () => { setBeatIndex(0); setIsPresent(true); };
  const exitPresent = () => setIsPresent(false);

  // ── the present-mode beat sequence (order is the spec; never leaves a hole) ──
  const beats = [
    // 1 · Hook
    (
      <div style={{ textAlign: "center" }}>
        <div style={PBEAT_KICK}>the method — seven steps, run by hand</div>
        <div style={{ ...PBEAT_BIG, marginTop: 22 }}>Predict-then-act becomes explore-then-adapt.</div>
        <p style={{ ...PBEAT_SUB, maxWidth: 820, margin: "30px auto 0" }}>
          Past the level-2/3 wall, the question changes from{" "}
          <span style={{ color: C.muted, fontStyle: "italic" }}>"what will happen?"</span> to{" "}
          <span style={{ color: C.navy, fontWeight: 700 }}>"which decision survives?"</span>
        </p>
      </div>
    ),
    // 2 · The pipeline (big, with the trust arc)
    (
      <div>
        <div style={{ ...PBEAT_KICK, textAlign: "center", marginBottom: 28 }}>the pipeline at a glance</div>
        <Pipeline big showArc />
        <div style={{ ...PBEAT_BIG, fontSize: "clamp(24px,3vw,40px)", textAlign: "center", marginTop: 44 }}>
          Seven steps. Run by hand, end to end, once.
        </div>
      </div>
    ),
    // 3 · The trust arc — the spine
    (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_KICK, color: C.muted, marginBottom: 30 }}>the spine</div>
        <div style={PBEAT_BIG}>
          Two steps to <span style={{ color: C.amber }}>earn</span> trust.
          Four to <span style={{ color: C.amber }}>spend</span> it.
          One to make it <span style={{ color: C.amber }}>live</span>.
        </div>
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginTop: 40, textAlign: "left" }}>
          <div style={{ background: C.tint, border: `1px solid ${C.line}`, borderRadius: 12, padding: "clamp(16px,1.8vw,26px)" }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(11px,1.1vw,14px)", color: C.navy }}>STEPS 1–2 · BUILD TRUST</div>
            <div style={{ fontFamily: SERIF, fontSize: "clamp(15px,1.6vw,21px)", color: C.ink, lineHeight: 1.5, marginTop: 8 }}>The model must earn the right to be used.</div>
          </div>
          <div style={{ background: C.tint, border: `1px solid ${C.line}`, borderRadius: 12, padding: "clamp(16px,1.8vw,26px)" }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(11px,1.1vw,14px)", color: C.navy }}>STEPS 3–6 · SPEND TRUST</div>
            <div style={{ fontFamily: SERIF, fontSize: "clamp(15px,1.6vw,21px)", color: C.ink, lineHeight: 1.5, marginTop: 8 }}>Futures, verdicts, strategies, regret.</div>
          </div>
          <div style={{ background: C.navy, border: `1px solid ${C.navy}`, borderRadius: 12, padding: "clamp(16px,1.8vw,26px)" }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(11px,1.1vw,14px)", color: C.amber }}>STEP 7 · MAKE IT LIVE</div>
            <div style={{ fontFamily: SERIF, fontSize: "clamp(15px,1.6vw,21px)", color: C.ice, lineHeight: 1.5, marginTop: 8 }}>An analysis that lives past the meeting.</div>
          </div>
        </div>
      </div>
    ),
    // 4–10 · one beat per step
    <StepBeat s={STEPS[0]} />,
    <StepBeat s={STEPS[1]} />,
    <StepBeat s={STEPS[2]} />,
    <StepBeat s={STEPS[3]} />,
    <StepBeat s={STEPS[4]} />,
    <StepBeat s={STEPS[5]} />,
    <StepBeat s={STEPS[6]} />,
    // 11 · The discipline
    (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_KICK, color: C.muted, marginBottom: 26 }}>the discipline</div>
        <div style={PBEAT_BIG}>
          Run <span style={{ color: C.amber }}>by hand, once</span> — before any automation.
        </div>
        <p style={{ ...PBEAT_SUB, maxWidth: 860, margin: "30px auto 0" }}>
          The LLM frames worlds and proposes parameter shifts. The{" "}
          <span style={{ color: C.navy, fontWeight: 700 }}>~200-line engine — not the LLM — delivers every number.</span>
        </p>
      </div>
    ),
    // 12 · Close / handoff
    (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_BIG, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
          Only a method that survived a full manual pass earns the right to be productized.
        </div>
        <div style={{ marginTop: 30 }}>
          <span style={PBEAT_TAG}>that split is enforced by the grammar.</span>
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 40 }}>
          <button onClick={(e) => { e.stopPropagation(); go("grammar"); }} style={PBTN_NAVY}>the grammar →</button>
          <button onClick={(e) => { e.stopPropagation(); go("schema"); }} style={PBTN_GHOST}>the schema →</button>
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
        kicker="The method — seven steps, run by hand"
        title="Predict-then-act becomes explore-then-adapt"
        sub="Past the level-2/3 wall, the question changes from 'what will happen?' to 'which decision survives?'. The seven steps below answer it. Each one is a tab in this app — the numbers on those tabs are the actual output of running the method on the Samsung memo."
      />

      <Section title="The pipeline at a glance">
        <div className="flex flex-wrap items-center gap-1.5">
          {STEPS.map((s, i) => (
            <span key={s.n} className="flex items-center gap-1.5">
              <button onClick={() => go(s.tab)} className="px-2.5 py-1.5 rounded text-xs" style={{
                fontFamily: MONO, fontWeight: 700, background: C.navy, color: "#fff",
                border: "none", cursor: "pointer",
              }}>
                {s.n} · {s.name}
              </button>
              {i < STEPS.length - 1 && <span style={{ color: C.amber, fontWeight: 700 }}>→</span>}
            </span>
          ))}
          <span style={{ color: C.amber, fontWeight: 700 }}>↻</span>
          <span className="text-xs" style={{ fontFamily: MONO, color: C.muted }}>re-instantiate as the world reveals itself</span>
        </div>
        <Note>
          Steps 1–2 build trust (the model must earn the right to be used). Steps 3–6 spend that trust (futures, verdicts, strategies, regret).
          Step 7 turns the analysis into something that lives past the meeting.
        </Note>
      </Section>

      {STEPS.map(s => (
        <Section key={s.n} title={`Step ${s.n} · ${s.name}`}
          right={
            <button onClick={() => go(s.tab)} className="px-2.5 py-1 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.amber, color: C.navy, border: "none", cursor: "pointer" }}>
              open the tab →
            </button>
          }>
          <div className="flex flex-wrap gap-2 mb-2.5">
            <span className="px-2 py-1 rounded text-xs" style={{ fontFamily: MONO, background: C.tint, color: C.navy }}>
              <b>in:</b> {s.input}
            </span>
            <span style={{ color: C.amber, fontWeight: 700, alignSelf: "center" }}>→</span>
            <span className="px-2 py-1 rounded text-xs" style={{ fontFamily: MONO, background: C.tint, color: C.navy }}>
              <b>out:</b> {s.output}
            </span>
          </div>
          <p className="text-sm mb-2.5" style={{ color: C.ink, lineHeight: 1.65, maxWidth: 920 }}>{s.what}</p>
          <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            <div className="text-xs rounded p-2.5" style={{ background: C.paper, border: `1px solid ${C.line}`, color: C.ink, lineHeight: 1.6 }}>
              <span style={{ fontFamily: MONO, fontWeight: 700, color: C.bad }}>THE RULE · </span>{s.rule}
            </div>
            <div className="text-xs rounded p-2.5" style={{ background: C.tint, borderLeft: `3px solid ${C.amber}`, color: C.ink, lineHeight: 1.6 }}>
              <span style={{ fontFamily: MONO, fontWeight: 700, color: C.navy }}>WHY IT MATTERS · </span>{s.payoff}
            </div>
          </div>
        </Section>
      ))}

      <Section title="The discipline behind the seven steps">
        <div className="text-sm rounded p-3" style={{ background: C.navy, color: C.ice, lineHeight: 1.7 }}>
          Everything above was run <b style={{ color: C.amber }}>by hand, end to end, once</b> — before any automation.
          The point of doing it manually is to validate the method itself: where extraction is ambiguous, where calibration bites, which rules actually prevent confabulation.
          Only a method that has survived a full manual pass on a real memo earns the right to be productized.
        </div>
        <Note>
          The division of labor throughout: the LLM frames worlds and proposes parameter shifts; the ~200-line engine — not the LLM — delivers every number.
          That split is enforced by the grammar on the next tab.
        </Note>
      </Section>

      {/* ── Present-mode overlay — fixed above app chrome, one beat at a time ── */}
      {isPresent && (
        <div
          className="present-overlay"
          onClick={handleZoneClick}
          style={{ position: "fixed", inset: 0, zIndex: 9000, background: C.paper, overflow: "hidden", userSelect: "none", cursor: "default" }}
        >
          <div style={{ position: "absolute", top: 20, left: 26, zIndex: 3, fontFamily: MONO, fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: 0.5 }}>
            Samsung LEO · Method
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
