import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead } from "../components/ui.jsx";

const LEVELS = [
  { n: 1, name: "A clear enough future", how: "Forecast it. One model, one answer, tight error bars.", marker: null },
  { n: 2, name: "Alternate futures, with probabilities", how: "Model the odds. Ranges, sensitivities, expected value.", marker: "Innovera today" },
  { n: 3, name: "A few plausible futures — no credible probabilities", how: "Build scenarios. Test robustness across them. Probabilities would be invented.", marker: "the defensible territory →" },
  { n: 4, name: "Unknown unknowns", how: "Even the futures can't be enumerated. Design for adaptation: signposts, triggers, staged commitment.", marker: null },
];

const STEPS = [
  { n: 1, name: "Extract", what: "memo → cited parameter schema; every value tagged X, L, D, or GAP", tab: "schema" },
  { n: 2, name: "Calibrate", what: "the small cash model must reproduce the memo's own anchors before it earns trust", tab: "calibration" },
  { n: 3, name: "Worlds", what: "two deep-uncertain axes → four exogenous parameter vectors", tab: "worlds" },
  { n: 4, name: "Verdicts", what: "each world runs through the model; verdict rule fixed ex ante", tab: "worlds" },
  { n: 5, name: "Matrix + Regret", what: "5 strategies × 4 worlds; minimax regret read off the grid", tab: "regret" },
  { n: 6, name: "Pathway", what: "signposts, triggers, staged policy — and the re-instantiation loop", tab: "pathway" },
];

const XLRM = [
  { k: "X", name: "Exogenous uncertainties", body: "What the world decides: launch $/kg, sovereignty premium, co-invest share, price floor. Worlds may touch only these." },
  { k: "L", name: "Levers", body: "What Samsung decides: constellation size, pacing, segment focus, build-vs-partner. Strategies may touch only these." },
  { k: "R", name: "Relationships", body: "The economic model — ~200 auditable lines that compute what happens when a lever-vector meets an X-vector." },
  { k: "M", name: "Metrics", body: "Breakeven year, cash trough, IRR, Y10 revenue — and regret, computed across worlds." },
];

export default function Overview({ go }) {
  return (
    <div>
      <PageHead
        kicker="From better information to deep uncertainty"
        title="A first working attempt at Level 3–4 analysis"
        sub="Worked end-to-end on the Samsung LEO memo — every number on every page of this app traceable back to a cited parameter, a shown derivation, or a declared assumption. This workbench accompanies the Pedram pack; the deck tells the story, this is the evidence you can touch."
      />

      <Section title="The wall — four levels of uncertainty (Walker et al.)">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {LEVELS.map((l, i) => (
            <div key={l.n} className="rounded-lg p-3 relative" style={{
              background: i >= 2 ? C.navy : C.tint,
              border: `1px solid ${i >= 2 ? C.navy : C.line}`,
              marginTop: (3 - i) * 14,
            }}>
              <div className="text-xs" style={{ fontFamily: MONO, color: i >= 2 ? C.amber : C.muted, fontWeight: 700 }}>LEVEL {l.n}</div>
              <div className="text-sm mt-1" style={{ fontFamily: SERIF, fontWeight: 700, color: i >= 2 ? "#fff" : C.navy }}>{l.name}</div>
              <div className="text-xs mt-1.5" style={{ color: i >= 2 ? C.ice : C.muted, lineHeight: 1.5 }}>{l.how}</div>
              {l.marker && (
                <div className="text-xs mt-2 px-2 py-0.5 rounded inline-block" style={{ fontFamily: MONO, fontWeight: 700, background: C.amber, color: C.navy }}>
                  {l.marker}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-sm mt-4 rounded p-3" style={{ background: C.tint, color: C.ink, lineHeight: 1.6, borderLeft: `4px solid ${C.amber}` }}>
          The Samsung verdict turns on uncertainties no Phase-1 study can resolve — sovereignty politics, launch-market structure.
          Better information stops helping at the level-2/3 boundary. <b>That is the wall, and the opportunity.</b>
        </div>
      </Section>

      <Section title="The method — six steps, run by hand · each step is a tab in this app">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {STEPS.map(s => (
            <button key={s.n} onClick={() => go(s.tab)} className="rounded-lg p-3 text-left" style={{ background: C.paper, border: `1px solid ${C.line}`, cursor: "pointer" }}>
              <div className="flex items-baseline gap-2">
                <span className="text-lg" style={{ fontFamily: SERIF, fontWeight: 700, color: C.amber }}>{s.n}</span>
                <span className="text-sm" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>{s.name}</span>
                <span className="ml-auto text-xs" style={{ fontFamily: MONO, color: C.muted }}>open →</span>
              </div>
              <div className="text-xs mt-1" style={{ color: C.muted, lineHeight: 1.5 }}>{s.what}</div>
            </button>
          ))}
        </div>
        <div className="text-xs mt-3 italic" style={{ color: C.muted }}>
          The discipline throughout: build the thinking by hand first; automate only after the method is validated.
        </div>
      </Section>

      <Section title="The grammar — XLRM (Lempert / RAND), operationalized literally">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {XLRM.map(x => (
            <div key={x.k} className="rounded-lg p-3" style={{
              background: x.k === "R" ? C.navy : C.paper,
              border: `1px solid ${x.k === "R" ? C.navy : C.line}`,
            }}>
              <div className="flex items-baseline gap-2">
                <span className="text-xl" style={{ fontFamily: SERIF, fontWeight: 700, color: C.amber }}>{x.k}</span>
                <span className="text-sm" style={{ fontFamily: SERIF, fontWeight: 700, color: x.k === "R" ? "#fff" : C.navy }}>{x.name}</span>
              </div>
              <div className="text-xs mt-1.5" style={{ color: x.k === "R" ? C.ice : C.muted, lineHeight: 1.55 }}>{x.body}</div>
            </div>
          ))}
        </div>
        <div className="text-sm mt-4 rounded p-3" style={{ background: C.tint, color: C.ink, lineHeight: 1.6, borderLeft: `4px solid ${C.navy}` }}>
          The split is the safety rail: if a "world" wants to change a lever, or a "strategy" wants to change the weather, the schema refuses.
          <b> Confabulation becomes a type error.</b> The LLM frames worlds and proposes parameter shifts; the ~200-line engine — not the LLM — delivers every number.
        </div>
      </Section>
    </div>
  );
}
