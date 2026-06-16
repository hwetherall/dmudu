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

// A reversed-out glyph badge — makes each of the four kinds read instantly from across a room.
function Glyph({ k, accent, size = 44 }) {
  // Amber is light: pair it with navy text. Navy/green are dark: pair with white.
  const fg = accent === C.amber ? C.navy : "#fff";
  return (
    <span style={{
      fontFamily: SERIF, fontWeight: 700, color: fg,
      background: accent, fontSize: Math.round(size * 0.55), lineHeight: 1,
      width: size, height: size, borderRadius: 10,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>{k}</span>
  );
}

function LetterBox({ k, accent, dark }) {
  const x = LETTERS[k];
  return (
    <div className="rounded-lg" style={{
      background: dark ? C.navy : C.card,
      border: `2px solid ${accent}`,
      padding: 16,
      minWidth: 0,
    }}>
      <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
        <Glyph k={k} accent={accent} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 17, color: dark ? "#fff" : C.navy, lineHeight: 1.15 }}>{x.name}</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 11, color: accent, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>{x.owner}</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: dark ? C.ice : C.ink, lineHeight: 1.6, marginBottom: 12 }}>{x.body}</div>
      <div className="flex flex-wrap gap-1.5">
        {x.examples.map(e => (
          <span key={e} style={{
            fontFamily: MONO, fontSize: 11, padding: "3px 8px", borderRadius: 5,
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
      <span style={{ color: C.amber, fontWeight: 700, fontSize: 28, lineHeight: 1 }}>→</span>
      {label && <span className="mt-1" style={{ fontFamily: MONO, fontSize: 10, color: C.muted, whiteSpace: "nowrap" }}>{label}</span>}
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
        <div className="grid gap-3" style={{ gridTemplateColumns: "minmax(220px, 1.1fr) auto minmax(220px, 1.2fr) auto minmax(200px, 1fr)", alignItems: "stretch" }}>
          <div className="flex flex-col gap-3 justify-center">
            <LetterBox k="X" accent={C.amber} />
            <LetterBox k="L" accent={C.navy} />
          </div>
          <div className="flex flex-col justify-center" style={{ gap: 24 }}>
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
        <p className="text-sm mb-3" style={{ color: C.ink, lineHeight: 1.65, maxWidth: 920 }}>
          The most seductive analytical failure is a story where a strategy quietly improves the weather, or a scenario quietly fixes the plan.
          In this grammar those stories are unwriteable — the schema rejects them the way a compiler rejects a type error:
        </p>
        <div className="mb-3" style={{ background: C.navy, borderRadius: 6, padding: 14 }}>
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
        <div className="text-sm p-3" style={{ background: C.tint, color: C.ink, lineHeight: 1.6, borderLeft: `4px solid ${C.navy}`, borderRadius: 6 }}>
          The LLM's role is upstream of the rail: it frames the worlds and proposes which X-dials they move.
          The numbers themselves are delivered by the ~200-line engine, every time. <b>The split is what makes every figure in this app auditable.</b>
        </div>
      </Section>

      <Section title="A worked example — one world, traced through all four letters">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
          {TRACE.map((t, i) => (
            <div key={t.k} className="rounded-lg relative" style={{
              background: t.k === "R" ? C.navy : C.card,
              border: `1px solid ${t.k === "R" ? C.navy : C.line}`,
              padding: 14,
            }}>
              <div className="flex items-center gap-2.5 mb-2">
                <Glyph k={t.k} accent={C.amber} size={30} />
                <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 13, color: t.k === "R" ? "#fff" : C.navy, lineHeight: 1.25 }}>{t.title}</span>
              </div>
              <div style={{ fontSize: 13, color: t.k === "R" ? C.ice : C.ink, lineHeight: 1.6 }}>{t.body}</div>
              {i < TRACE.length - 1 && (
                <div className="absolute hidden md:block" style={{ right: -15, top: "45%", color: C.amber, fontWeight: 700, fontSize: 18, zIndex: 2 }}>→</div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <button onClick={() => go("worlds")} className="rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.navy, color: "#fff", border: `1px solid ${C.navy}`, cursor: "pointer", padding: "7px 12px" }}>
            see W1 run in full — the Worlds tab →
          </button>
          <button onClick={() => go("schema")} className="rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.paper, color: C.navy, border: `1px solid ${C.line}`, cursor: "pointer", padding: "7px 12px" }}>
            see every parameter and its tag — Extract →
          </button>
        </div>
      </Section>
    </div>
  );
}
