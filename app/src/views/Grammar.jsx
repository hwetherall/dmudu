import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Note, Tag } from "../components/ui.jsx";

const LETTERS = {
  X: {
    name: "Exogenous uncertainties",
    owner: "the world decides",
    body: "The dials Samsung cannot turn. They are exactly the level-3 uncertainties — and only worlds are allowed to move them.",
    examples: ["P5 · launch $/kg", "P19 · sovereignty premium", "P11 · MNO co-invest share", "P20 · $0.30/GB price floor", "P22 · regulatory timelines"],
  },
  L: {
    name: "Levers",
    owner: "Samsung decides",
    body: "The dials Samsung does control. A strategy is nothing more than a setting of these — and only strategies may move them.",
    examples: ["P1 · constellation size", "P2 · first tranche", "P12 · specialist headcount", "P21 · terminal cost path", "build vs. partner vs. walk away"],
  },
  R: {
    name: "Relationships",
    owner: "the model computes",
    body: "The economic machinery connecting choices to outcomes: ~200 auditable lines — deployment schedule, replenishment on lifespan, COGS ramp, free cash flow. It is the only thing allowed to produce numbers.",
    examples: ["build + replenishment → capex", "prices × volumes → revenue", "gross − opex − capex → FCF"],
  },
  M: {
    name: "Metrics",
    owner: "read, never asserted",
    body: "What the decision is judged on. Every value is computed by R — never quoted from prose, never estimated by the LLM.",
    examples: ["breakeven year", "cash trough", "IRR", "Y10 revenue", "regret, across worlds"],
  },
};

function LetterBox({ k, accent, dark }) {
  const x = LETTERS[k];
  return (
    <div className="rounded-lg p-3" style={{
      background: dark ? C.navy : C.card,
      border: `2px solid ${accent}`,
      minWidth: 0,
    }}>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl" style={{ fontFamily: SERIF, fontWeight: 700, color: accent }}>{k}</span>
        <span className="text-sm" style={{ fontFamily: SERIF, fontWeight: 700, color: dark ? "#fff" : C.navy }}>{x.name}</span>
      </div>
      <div className="text-xs mt-0.5 mb-1.5" style={{ fontFamily: MONO, fontWeight: 700, color: accent }}>{x.owner}</div>
      <div className="text-xs mb-2" style={{ color: dark ? C.ice : C.muted, lineHeight: 1.55 }}>{x.body}</div>
      <div className="flex flex-wrap gap-1">
        {x.examples.map(e => (
          <span key={e} className="px-1.5 py-0.5 rounded text-xs" style={{
            fontFamily: MONO, fontSize: 10,
            background: dark ? "rgba(202,220,252,0.12)" : C.tint,
            color: dark ? C.ice : C.navy,
          }}>{e}</span>
        ))}
      </div>
    </div>
  );
}

function Arrow({ label }) {
  return (
    <div className="flex flex-col items-center justify-center px-1" style={{ alignSelf: "center" }}>
      <span style={{ color: C.amber, fontWeight: 700, fontSize: 22, lineHeight: 1 }}>→</span>
      {label && <span className="text-xs mt-0.5" style={{ fontFamily: MONO, fontSize: 9, color: C.muted, whiteSpace: "nowrap" }}>{label}</span>}
    </div>
  );
}

// One world, traced through all four letters — every number from the Worlds tab.
const TRACE = [
  { k: "X", title: "The world moves its dials", body: "World W1 'Gated Orbits' is nothing but an X-vector: launch $2,400/kg (top of the memo's range), MNO co-invest 60%, revenue ×0.95, deployment and revenue each one year late." },
  { k: "L", title: "The levers stay where the strategy put them", body: "The strategy under test is the plan-as-written, so every lever holds: 3,500 satellites, 500-satellite first tranche, all segments. W1 is not allowed to shrink the constellation for Samsung — that would be a strategy's move." },
  { k: "R", title: "The engine recomputes — no one narrates", body: "+$400/kg works through the machinery: about +$0.32M per satellite, roughly +$1.1B over the build — and more on every replenishment cycle, forever. Every revenue column shifts one year right." },
  { k: "M", title: "The metrics fall out, and the verdict reads them", body: "IRR comes out at 4.8% against the 5% DIE cutoff that was fixed before any world ran. Verdict: DIE — reported as a boundary case, not nudged to either side." },
];

export default function Grammar({ go }) {
  return (
    <div>
      <PageHead
        kicker="The grammar — XLRM (Lempert / RAND), operationalized literally"
        title="Four kinds of thing, and who is allowed to touch each"
        sub="XLRM is usually a workshop checklist. Here it is enforced as a type system: every one of the 24 extracted parameters carries a tag, and the tag determines who may move it. The diagram below is the whole architecture of the workbench."
      />

      <Section title="How the four actors relate">
        <div className="grid gap-2" style={{ gridTemplateColumns: "minmax(220px, 1.1fr) auto minmax(220px, 1.2fr) auto minmax(200px, 1fr)", alignItems: "stretch" }}>
          <div className="flex flex-col gap-2 justify-center">
            <LetterBox k="X" accent={C.amber} />
            <LetterBox k="L" accent={C.navy} />
          </div>
          <div className="flex flex-col justify-around">
            <Arrow label="worlds set X" />
            <Arrow label="strategies set L" />
          </div>
          <div className="flex flex-col justify-center">
            <LetterBox k="R" accent={C.amber} dark />
          </div>
          <Arrow label="computes" />
          <div className="flex flex-col justify-center">
            <LetterBox k="M" accent={C.good} />
          </div>
        </div>
        <Note>
          Read it left to right: a future (X) meets a plan (L) inside the model (R), and what comes out (M) is the only place numbers are allowed to come from.
          The same R is reused for every world × strategy pair — 20 runs, one engine.
        </Note>
      </Section>

      <Section title="The safety rail — confabulation becomes a type error">
        <p className="text-sm mb-2.5" style={{ color: C.ink, lineHeight: 1.65, maxWidth: 920 }}>
          The most seductive analytical failure is a story where a strategy quietly improves the weather, or a scenario quietly fixes the plan.
          In this grammar those stories are unwriteable — the schema rejects them the way a compiler rejects a type error:
        </p>
        <div className="rounded p-3 mb-2.5" style={{ background: C.navy }}>
          {[
            ['> world.set("P1", 1000)', "a 'world' tries to shrink the constellation"],
            ["SchemaError: P1 (constellation size) is L-tagged — Samsung-owned. Worlds may move only X. REJECTED.", null],
            ["", null],
            ['> strategy.set("P19", 0.30)', "a 'strategy' tries to raise the sovereignty premium"],
            ["SchemaError: P19 (sovereignty premium) is X-tagged — world-owned. Strategies may move only L. REJECTED.", null],
          ].map(([line, comment], i) => (
            <div key={i} className="text-xs" style={{ fontFamily: MONO, lineHeight: 1.8 }}>
              <span style={{ color: line.startsWith("SchemaError") ? "#E89AA5" : C.ice }}>{line}</span>
              {comment && <span style={{ color: "rgba(202,220,252,0.45)" }}>   // {comment}</span>}
            </div>
          ))}
        </div>
        <div className="text-sm rounded p-3" style={{ background: C.tint, color: C.ink, lineHeight: 1.6, borderLeft: `4px solid ${C.navy}` }}>
          The LLM's role is upstream of the rail: it frames the worlds and proposes which X-dials they move.
          The numbers themselves are delivered by the ~200-line engine, every time. <b>The split is what makes every figure in this app auditable.</b>
        </div>
      </Section>

      <Section title="A worked example — one world, traced through all four letters">
        <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
          {TRACE.map((t, i) => (
            <div key={t.k} className="rounded-lg p-3 relative" style={{
              background: t.k === "R" ? C.navy : C.card,
              border: `1px solid ${t.k === "R" ? C.navy : C.line}`,
            }}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl" style={{ fontFamily: SERIF, fontWeight: 700, color: C.amber }}>{t.k}</span>
                <span className="text-xs" style={{ fontFamily: SERIF, fontWeight: 700, color: t.k === "R" ? "#fff" : C.navy, lineHeight: 1.3 }}>{t.title}</span>
              </div>
              <div className="text-xs" style={{ color: t.k === "R" ? C.ice : C.muted, lineHeight: 1.6 }}>{t.body}</div>
              {i < TRACE.length - 1 && (
                <div className="absolute hidden md:block" style={{ right: -13, top: "45%", color: C.amber, fontWeight: 700, fontSize: 16, zIndex: 2 }}>→</div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => go("worlds")} className="px-3 py-1.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.navy, color: "#fff", border: "none", cursor: "pointer" }}>
            see W1 run in full — the Worlds tab →
          </button>
          <button onClick={() => go("schema")} className="px-3 py-1.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.paper, color: C.navy, border: `1px solid ${C.line}`, cursor: "pointer" }}>
            see every parameter and its tag — Extract →
          </button>
        </div>
      </Section>
    </div>
  );
}
