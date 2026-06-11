import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Note } from "../components/ui.jsx";

// The four levels (Courtney/Kirkland/Viguerie via Walker et al.), expanded.
const LEVELS = [
  {
    n: 1,
    name: "A clear enough future",
    question: "What will happen?",
    what: "A single forecast is accurate enough to make the decision. Residual uncertainty is noise around one trajectory — wide enough to need error bars, narrow enough not to change the answer.",
    traits: [
      "Stable environment, abundant history",
      "Well-understood causal structure",
      "Errors are symmetric and bounded",
    ],
    tools: ["Point forecasts", "DCF / NPV on a single case", "Sensitivity as error bars"],
    example: "Will GEO satellite latency stay in the 600–800 ms band? Yes — it is set by orbital altitude and the speed of light. Physics does not negotiate.",
    marker: null,
  },
  {
    n: 2,
    name: "Alternate futures, with probabilities",
    question: "What are the odds?",
    what: "The future forks into a few discrete outcomes — and the odds attached to each are credible, because they come from data, structure, or a process you can study. This is risk in the classic sense: countable outcomes, defensible probabilities.",
    traits: [
      "Outcome set is enumerable",
      "Probabilities are estimable, not invented",
      "More analysis genuinely shrinks the uncertainty",
    ],
    tools: ["Decision trees, expected value", "Monte Carlo over known distributions", "Real options on discrete events"],
    example: "What will a user terminal cost at 1M-unit volume? A bottom-up BOM study yields a defensible range with odds. This is exactly the uncertainty the memo's Phase-1 budget is designed to buy down.",
    marker: "standard analysis lives here — Innovera today",
  },
  {
    n: 3,
    name: "A few plausible futures — no credible probabilities",
    question: "Under which futures does this decision survive?",
    what: "You can still bound the future with a handful of scenarios — but there is no defensible basis for odds. The outcome hangs on choices other actors have not yet made. Assigning probabilities here doesn't add rigor; it launders guesswork into math. This is where deep uncertainty begins.",
    traits: [
      "Driven by other actors' strategic choices — politics, regulators, rivals",
      "No dataset exists; the future is decided, not revealed",
      "Probabilities would be invented, then mistaken for analysis",
    ],
    tools: ["Scenario construction (worlds)", "Robustness testing across worlds", "Minimax regret instead of expected value"],
    example: "Will sovereign governments still pay a premium for non-US infrastructure in 2032? That depends on elections, alliances, and incumbents' concessions — decisions not yet made, by actors who don't yet know themselves.",
    marker: "the defensible territory — where this workbench operates",
  },
  {
    n: 4,
    name: "True ambiguity — unknown unknowns",
    question: "How do we stay adaptable?",
    what: "Even the futures can't be enumerated; no scenario set is credible. Novel technology, novel markets and novel regulation interact in ways no one can pre-state. The only defensible posture is to design the decision itself for adaptation.",
    traits: [
      "Futures cannot be listed, let alone weighted",
      "Multiple novelties interacting",
      "Resolves only by acting, observing, adapting",
    ],
    tools: ["Signposts & triggers", "Staged commitment, options to exit", "Adaptive pathways — act, monitor, re-plan"],
    example: "What does the orbital economy look like in 2040 — debris regimes, mega-constellation shakeouts, direct-to-device upending terrestrial telcos? We cannot even list the candidate futures.",
    marker: null,
  },
];

function Staircase() {
  return (
    <div className="flex items-stretch gap-0" style={{ minHeight: 150 }}>
      {LEVELS.map((l, i) => (
        <div key={l.n} className="flex items-stretch" style={{ flex: 1, minWidth: 0 }}>
          {i === 2 && (
            <div className="relative mx-1" style={{ width: 10, background: `repeating-linear-gradient(45deg, ${C.amber}, ${C.amber} 6px, ${C.navy} 6px, ${C.navy} 12px)`, borderRadius: 3 }}>
              <div className="absolute text-xs px-1.5 py-0.5 rounded" style={{
                fontFamily: MONO, fontWeight: 700, background: C.amber, color: C.navy,
                top: -10, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", zIndex: 2,
              }}>THE WALL</div>
            </div>
          )}
          <div className="rounded-lg p-2.5 flex flex-col justify-end" style={{
            flex: 1, minWidth: 0,
            background: i >= 2 ? C.navy : C.tint,
            border: `1px solid ${i >= 2 ? C.navy : C.line}`,
            marginTop: (3 - i) * 26,
            marginLeft: i === 0 ? 0 : 4,
          }}>
            <div className="text-xs" style={{ fontFamily: MONO, fontWeight: 700, color: i >= 2 ? C.amber : C.muted }}>LEVEL {l.n}</div>
            <div className="text-xs mt-0.5" style={{ fontFamily: SERIF, fontWeight: 700, color: i >= 2 ? "#fff" : C.navy, lineHeight: 1.3 }}>{l.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LevelCard({ l, dark }) {
  return (
    <Section title={`Level ${l.n} · ${l.name}`}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: dark ? C.navy : C.tint, color: dark ? C.amber : C.navy }}>
          the question: {l.question}
        </span>
        {l.marker && (
          <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.amber, color: C.navy }}>
            {l.marker}
          </span>
        )}
      </div>
      <p className="text-sm mb-3" style={{ color: C.ink, lineHeight: 1.65, maxWidth: 920 }}>{l.what}</p>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div className="rounded p-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: C.muted, fontWeight: 700 }}>Key characteristics</div>
          {l.traits.map((t, i) => (
            <div key={i} className="text-xs flex gap-1.5 py-0.5" style={{ color: C.ink, lineHeight: 1.5 }}>
              <span style={{ color: C.amber, fontWeight: 700 }}>·</span>{t}
            </div>
          ))}
        </div>
        <div className="rounded p-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: C.muted, fontWeight: 700 }}>The right tools</div>
          {l.tools.map((t, i) => (
            <div key={i} className="text-xs flex gap-1.5 py-0.5" style={{ color: C.ink, lineHeight: 1.5 }}>
              <span style={{ color: C.amber, fontWeight: 700 }}>·</span>{t}
            </div>
          ))}
        </div>
        <div className="rounded p-3" style={{ background: dark ? C.navy : C.tint, border: `1px solid ${dark ? C.navy : C.line}` }}>
          <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: dark ? C.amber : C.muted, fontWeight: 700 }}>In this case</div>
          <div className="text-xs" style={{ color: dark ? C.ice : C.ink, lineHeight: 1.6 }}>{l.example}</div>
        </div>
      </div>
    </Section>
  );
}

export default function Uncertainty({ go }) {
  return (
    <div>
      <PageHead
        kicker="The framing — four levels of uncertainty"
        title="Not all uncertainty is the same problem"
        sub="A refresher on the Walker / Courtney ladder — because everything in this workbench hangs on one distinction: uncertainty you can buy down with information, versus uncertainty that only the world can resolve. The Samsung verdict turns on the second kind."
      />

      <Section title="The ladder — and where the wall sits">
        <Staircase />
        <Note>Levels 1–2: analysis converges on an answer. Levels 3–4: analysis can only map the territory. The wall between 2 and 3 is where the method must change.</Note>
      </Section>

      {LEVELS.map((l, i) => <LevelCard key={l.n} l={l} dark={i >= 2} />)}

      <Section title="The wall — why the move from level 2 to level 3 changes everything">
        <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <div className="rounded-lg p-3.5" style={{ background: C.tint, border: `1px solid ${C.line}` }}>
            <div className="text-sm mb-1.5" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>Level 2 · buy information</div>
            <div className="text-xs" style={{ color: C.ink, lineHeight: 1.7 }}>
              The uncertainty lives <b>in our heads</b>. The world already holds an answer — a BOM cost, a launch quote, an MNO's willingness to sign — and study reveals it.
              More data shrinks the error bars. The right move is to analyze harder. The memo's own Phase-1 budget ($1.5–2.5M over 18 months: block-buy pricing, LOIs, BOM studies) is precisely this — and it is the correct instrument for these uncertainties.
            </div>
          </div>
          <div className="rounded-lg p-3.5" style={{ background: C.navy, border: `1px solid ${C.navy}` }}>
            <div className="text-sm mb-1.5" style={{ fontFamily: SERIF, fontWeight: 700, color: "#fff" }}>Level 3 · buy robustness</div>
            <div className="text-xs" style={{ color: C.ice, lineHeight: 1.7 }}>
              The uncertainty lives <b style={{ color: C.amber }}>in the world</b>. The answer does not exist yet — sovereignty politics in 2032, the structure of the launch market — it will be <i>decided</i>, over years, by actors who haven't chosen.
              More analysis adds only invented precision. The right move is to stop forecasting and start stress-testing: find the decision that survives every plausible future, and instrument the ones it doesn't.
            </div>
          </div>
        </div>
        <div className="text-sm rounded p-3 mb-3" style={{ background: "rgba(178,58,72,0.07)", color: C.ink, lineHeight: 1.65, borderLeft: `4px solid ${C.bad}` }}>
          The most common failure in strategy work is treating level 3 as level 2: putting made-up probabilities on scenarios and averaging them into one confident number.
          The math looks rigorous; the inputs are guesses wearing suits. <b>Once probabilities can't be defended, expected value stops being an honest summary — and robustness has to replace it.</b>
        </div>
        <div className="text-sm rounded p-3" style={{ background: C.tint, color: C.ink, lineHeight: 1.65, borderLeft: `4px solid ${C.amber}` }}>
          Applied here: the Samsung verdict turns on uncertainties no Phase-1 study can resolve — sovereignty politics and launch-market structure.
          Better information stops helping at the level-2/3 boundary. <b>That is the wall, and the opportunity:</b> the analysis that follows is what working <i>on the far side</i> of it looks like.
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => go("method")} className="px-3 py-1.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.navy, color: "#fff", border: "none", cursor: "pointer" }}>
            how we work past the wall — the method →
          </button>
          <button onClick={() => go("worlds")} className="px-3 py-1.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.paper, color: C.navy, border: `1px solid ${C.line}`, cursor: "pointer" }}>
            see the level-3 futures — the worlds →
          </button>
        </div>
      </Section>
    </div>
  );
}
