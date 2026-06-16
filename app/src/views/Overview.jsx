import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Note } from "../components/ui.jsx";

const LEVELS = [
  { n: 1, name: "A clear enough future" },
  { n: 2, name: "Alternate futures, with probabilities", marker: "Innovera today" },
  { n: 3, name: "A few plausible futures — no credible probabilities", marker: "this workbench" },
  { n: 4, name: "Unknown unknowns" },
];

const FRAMING = [
  { tab: "uncertainty", title: "Uncertainty", sub: "The four levels, in depth — and the wall between level 2 and level 3 that this whole exercise exists to cross." },
  { tab: "method", title: "Method", sub: "Seven steps from memo to robust decision: extract, calibrate, model, worlds, strategies, regret, pathway. Each step is a tab here." },
  { tab: "grammar", title: "Grammar", sub: "XLRM as a type system: who may move which dial, and why confabulation becomes a type error." },
];

const PIPELINE = [
  { n: 1, name: "Extract", tab: "schema", what: "memo → cited parameter schema" },
  { n: 2, name: "Calibrate", tab: "calibration", what: "the memo's own numbers are the test suite" },
  { n: 3, name: "Model", tab: "cashflow", what: "the visual cash-flow machine, live from the engine" },
  { n: 4, name: "Worlds", tab: "worlds", what: "four futures, verdict rule fixed ex ante" },
  { n: 5, name: "Strategies", tab: "strategies", what: "five L-configurations, diverse by construction" },
  { n: 6, name: "Regret", tab: "regret", what: "5 strategies × 4 worlds, minimax regret" },
  { n: 7, name: "Pathway", tab: "pathway", what: "signposts, triggers, staged commitment" },
  { n: "★", name: "Findings", tab: "findings", what: "what the exercise actually proved" },
];

export default function Overview({ go }) {
  return (
    <div>
      <PageHead
        kicker="From better information to deep uncertainty"
        title="A first working attempt at Level 3–4 analysis"
        sub="Worked end-to-end on the Samsung LEO memo — every number on every page of this app traceable back to a cited parameter, a shown derivation, or a declared assumption. The deck tells the story; this is the evidence you can touch."
      />

      <Section title="The one idea this presentation turns on">
        <div className="grid gap-4 items-center" style={{ gridTemplateColumns: "minmax(280px, 1.1fr) minmax(280px, 1fr)" }}>
          <div className="text-sm rounded-lg p-4" style={{ background: C.navy, color: C.ice, lineHeight: 1.75 }}>
            Some uncertainty can be <b style={{ color: "#fff" }}>bought down with information</b> — study harder, the error bars shrink. That is level 2, and it is where standard analysis (ours included) lives today.
            <br /><br />
            But the questions the Samsung verdict actually turns on — sovereignty politics in 2032, the structure of the launch market — <b style={{ color: C.amber }}>have no answer yet for any study to find</b>. That is level 3: deep uncertainty. More analysis adds only invented precision.
            <br /><br />
            <b style={{ color: "#fff" }}>The move this work demonstrates: stop trying to predict the future, and start finding the decision that survives every plausible one.</b>
          </div>
          <div>
            <div className="flex items-end gap-1" style={{ minHeight: 120 }}>
              {LEVELS.map((l, i) => (
                <div key={l.n} className="rounded p-2 flex-1" style={{
                  background: i >= 2 ? C.navy : C.tint,
                  border: `1px solid ${i >= 2 ? C.navy : C.line}`,
                  borderLeft: i === 2 ? `4px solid ${C.amber}` : undefined,
                  height: 60 + i * 24,
                  minWidth: 0,
                }}>
                  <div className="text-xs" style={{ fontFamily: MONO, fontWeight: 700, color: i >= 2 ? C.amber : C.muted }}>L{l.n}</div>
                  {l.marker && (
                    <div className="text-xs mt-1 px-1 py-0.5 rounded inline-block" style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, background: C.amber, color: C.navy, lineHeight: 1.2 }}>
                      {l.marker}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-xs mt-2 text-center" style={{ fontFamily: MONO, color: C.muted }}>
              the wall sits between L2 and L3 — <button onClick={() => go("uncertainty")} style={{ fontFamily: MONO, color: C.navy, fontWeight: 700, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}>the Uncertainty tab unpacks it →</button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="The framing — three tabs before the pipeline">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {FRAMING.map(f => (
            <button key={f.tab} onClick={() => go(f.tab)} className="rounded-lg p-3.5 text-left" style={{ background: C.paper, border: `1px solid ${C.line}`, cursor: "pointer" }}>
              <div className="flex items-baseline gap-2">
                <span className="text-base" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>{f.title}</span>
                <span className="ml-auto text-xs" style={{ fontFamily: MONO, color: C.amber, fontWeight: 700 }}>open →</span>
              </div>
              <div className="text-xs mt-1.5" style={{ color: C.muted, lineHeight: 1.55 }}>{f.sub}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="The pipeline — the method, actually run on the Samsung memo">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {PIPELINE.map(s => (
            <button key={s.tab + s.n} onClick={() => go(s.tab)} className="rounded-lg p-3 text-left" style={{ background: C.paper, border: `1px solid ${C.line}`, cursor: "pointer" }}>
              <div className="flex items-baseline gap-2">
                <span className="text-lg" style={{ fontFamily: SERIF, fontWeight: 700, color: C.amber }}>{s.n}</span>
                <span className="text-sm" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>{s.name}</span>
                <span className="ml-auto text-xs" style={{ fontFamily: MONO, color: C.muted }}>open →</span>
              </div>
              <div className="text-xs mt-1" style={{ color: C.muted, lineHeight: 1.5 }}>{s.what}</div>
            </button>
          ))}
        </div>
        <Note>The discipline throughout: build the thinking by hand first; automate only after the method is validated. The LLM framed the worlds and proposed parameter shifts; the ~200-line cash engine computed every number on these pages — live, in your browser.</Note>
      </Section>
    </div>
  );
}
