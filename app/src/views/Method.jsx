import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Note } from "../components/ui.jsx";

// The seven steps, expanded — every fact below is restated from the step's own tab.
const STEPS = [
  {
    n: 1, name: "Extract", tab: "schema",
    input: "the memo — 40 pages of prose",
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

export default function Method({ go }) {
  return (
    <div>
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
    </div>
  );
}
