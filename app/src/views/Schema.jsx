import { useState } from "react";
import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Tag, TagLegend, Note, th, td, tdMono } from "../components/ui.jsx";
import { CASE, PARAM_BLOCKS, DERIVATION_STEPS, RISKS, FLAGS } from "../data/schema.js";

function ParamTable({ block }) {
  return (
    <Section title={block.title}>
      <div className="overflow-x-auto">
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={th}>ID</th><th style={th}>Parameter</th><th style={th}>Baseline</th>
              <th style={th}>Tag</th><th style={th}>Source (memo section)</th><th style={th}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {block.params.map(p => (
              <tr key={p.id} style={p.tag === "X" ? { background: "rgba(232,163,61,0.05)" } : undefined}>
                <td style={{ ...tdMono, fontWeight: 700, color: C.navy }}>{p.id}</td>
                <td style={{ ...td, fontWeight: 600, whiteSpace: "nowrap" }}>{p.name}</td>
                <td style={tdMono}>{p.baseline}</td>
                <td style={td}><Tag tag={p.tag} /></td>
                <td style={{ ...td, color: C.muted, fontSize: 11 }}>{p.source}</td>
                <td style={{ ...td, color: C.muted, fontSize: 11, minWidth: 220 }}>{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/* ── the parameter-flow diagram ───────────────────────────────────────── */

function FlowChip({ id, tag }) {
  const bg = { X: "rgba(232,163,61,0.18)", L: "rgba(26,34,56,0.10)", D: "#E9EEF7", GAP: "rgba(178,58,72,0.12)" }[tag];
  const fg = { X: "#7A5413", L: C.navy, D: C.muted, GAP: C.bad }[tag];
  return (
    <span className="px-1.5 py-0.5 rounded" style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, background: bg, color: fg, whiteSpace: "nowrap" }}>
      {id} <span style={{ fontWeight: 400 }}>· {tag}</span>
    </span>
  );
}

function FlowBox({ title, chips, body, dark }) {
  return (
    <div className="rounded-lg p-2.5" style={{ background: dark ? C.navy : C.card, border: `1px solid ${dark ? C.navy : C.line}` }}>
      <div className="text-xs mb-1" style={{ fontFamily: SERIF, fontWeight: 700, color: dark ? "#fff" : C.navy }}>{title}</div>
      {chips && <div className="flex flex-wrap gap-1 mb-1">{chips.map(c => <FlowChip key={c[0]} id={c[0]} tag={c[1]} />)}</div>}
      <div className="text-xs" style={{ fontFamily: MONO, fontSize: 10, color: dark ? C.ice : C.muted, lineHeight: 1.55 }}>{body}</div>
    </div>
  );
}

function Down() {
  return <div className="text-center" style={{ color: C.amber, fontWeight: 700, fontSize: 16, lineHeight: 1, padding: "2px 0" }}>↓</div>;
}

function FlowDiagram() {
  return (
    <div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {/* cost branch */}
        <div>
          <div className="text-xs uppercase tracking-wider mb-1.5 text-center" style={{ color: C.muted, fontWeight: 700 }}>The cost engine</div>
          <FlowBox
            title="What gets built, and when"
            chips={[["P1", "L"], ["P2", "L"], ["P8", "X"], ["P10", "L"]]}
            body="Constellation size ÷ 5-yr lifespan sets the replenishment treadmill (P9, derived): every satellite launched is a bill that returns five years later."
          />
          <Down />
          <FlowBox
            title="What each satellite costs, delivered"
            chips={[["P3", "L"], ["P4", "D"], ["P5", "X"], ["P6", "X"]]}
            body="<$0.5M build + 800 kg × $2,000/kg launch ≈ $2.1M per satellite in orbit. P5 is the single most load-bearing dial in the model."
          />
          <Down />
          <FlowBox
            title="Capex per year"
            chips={[["P11", "X"], ["G1", "GAP"]]}
            body="satellites launched × delivered cost, + Samsung's share of the gateway program (whatever the MNOs don't co-invest), + other capex."
          />
        </div>
        {/* revenue branch */}
        <div>
          <div className="text-xs uppercase tracking-wider mb-1.5 text-center" style={{ color: C.muted, fontWeight: 700 }}>The revenue engine</div>
          <FlowBox
            title="What customers pay"
            chips={[["P14", "X"], ["P15", "X"], ["P16", "X"], ["P17", "X"], ["P18", "X"], ["P19", "X"]]}
            body="Backhaul nodes, enterprise sites, vessels, aircraft, D2D users — each priced by the memo, all lifted by the sovereignty premium (P19, THE thesis parameter)."
          />
          <Down />
          <FlowBox
            title="How many of them there are"
            chips={[["G4", "GAP"]]}
            body="The memo prices everything and counts almost nothing (Flag F7). Volumes are reverse-engineered to hit its own >$10B Year-10 target — the largest declared assumption in the model."
          />
          <Down />
          <FlowBox
            title="Revenue per year"
            chips={[["P22", "X"], ["P20", "X"]]}
            body="prices × volumes, pushed right by regulatory delays (P22), pulled down toward the $0.30/GB floor when worlds turn hostile (P20)."
          />
        </div>
      </div>
      <Down />
      <FlowBox
        dark
        title="The annual cash statement — where the branches meet"
        chips={[["G2", "GAP"], ["G3", "GAP"], ["P12", "L"]]}
        body="revenue − COGS (70% ramping to 55%) = gross · − opex (400 specialists, per-satellite ops, SG&A) − capex = free cash flow · accumulated year over year."
      />
      <Down />
      <div className="rounded-lg p-2.5" style={{ background: C.card, border: `2px solid ${C.good}` }}>
        <div className="text-xs mb-1" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>The metrics (M) — computed, never asserted</div>
        <div className="flex flex-wrap gap-1.5">
          {["breakeven year", "cash trough", "IRR", "Y10 revenue", "→ verdict, → regret"].map(m => (
            <span key={m} className="px-1.5 py-0.5 rounded" style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, background: "rgba(46,125,91,0.10)", color: C.good }}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── the page ─────────────────────────────────────────────────────────── */

export default function Schema() {
  const [openFlag, setOpenFlag] = useState("F4");
  return (
    <div>
      <PageHead
        kicker="Step 1 · Extract — and it is an audit"
        title="The memo becomes data"
        sub="24 parameters, 12 risks, 9 calibration targets — every value cited to the memo section it came from. The rule that makes everything downstream work: worlds touch only X, strategies touch only L, derived values recompute, and every gap is a declared assumption."
      />

      <Section title="The case, in one minute — what the memo is about">
        <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(300px, 1.4fr) minmax(260px, 1fr)" }}>
          <div>
            <div className="text-sm rounded p-2.5 mb-2.5" style={{ background: C.navy, color: "#fff", fontFamily: SERIF, lineHeight: 1.55 }}>
              <span style={{ color: C.amber, fontFamily: MONO, fontSize: 10, fontWeight: 700 }}>THE DECISION · </span>
              {CASE.question}
            </div>
            {CASE.paras.map((p, i) => (
              <p key={i} className="text-sm mb-2" style={{ color: C.ink, lineHeight: 1.65 }}>{p}</p>
            ))}
            <div className="text-xs rounded p-2.5" style={{ background: C.tint, color: C.ink, lineHeight: 1.6, borderLeft: `3px solid ${C.amber}` }}>
              {CASE.verdict}
            </div>
          </div>
          <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr", alignContent: "start" }}>
            {CASE.stats.map(s => (
              <div key={s.k} className="rounded p-2.5" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
                <div className="text-base" style={{ fontFamily: MONO, fontWeight: 700, color: C.navy, whiteSpace: "nowrap" }}>{s.v}</div>
                <div className="text-xs mt-0.5" style={{ color: C.muted, lineHeight: 1.35 }}>{s.k}</div>
              </div>
            ))}
          </div>
        </div>
        <Note>All figures above are the memo's own claims — recorded here as claims. Whether they cohere is exactly what steps 1–2 test.</Note>
      </Section>

      <Section title="Tag legend — the XLRM split, enforced at the schema level">
        <TagLegend />
      </Section>

      {PARAM_BLOCKS.map(b => <ParamTable key={b.title} block={b} />)}

      <Section title="B · How the parameters work together — the model as a business flow">
        <FlowDiagram />
        <Note>
          This is the entire ~200-line engine, drawn. Amber-tagged inputs (X) are where worlds act; navy (L) is where strategies act;
          red (GAP) is where the memo was silent and an assumption is declared. Everything below the inputs recomputes — nothing is typed in.
        </Note>
      </Section>

      <Section title="C · The derivation chain — shown so it can be audited">
        <div className="flex flex-col gap-1.5">
          {DERIVATION_STEPS.map(d => (
            <div key={d.n} className="rounded-lg px-3 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-1" style={{
              background: d.check ? "rgba(46,125,91,0.07)" : C.paper,
              border: `1px solid ${d.check ? "rgba(46,125,91,0.35)" : C.line}`,
            }}>
              <span className="rounded-full text-center" style={{
                fontFamily: MONO, fontSize: 11, fontWeight: 700, width: 22, height: 22, lineHeight: "22px",
                background: d.check ? C.good : C.navy, color: "#fff", flexShrink: 0,
              }}>{d.check ? "✓" : d.n}</span>
              {d.from && <span className="text-xs" style={{ fontFamily: MONO, fontWeight: 700, color: C.muted, whiteSpace: "nowrap" }}>{d.from}</span>}
              {!d.from && <span className="text-xs" style={{ fontFamily: MONO, fontWeight: 700, color: C.good, whiteSpace: "nowrap" }}>cross-check</span>}
              <span className="text-xs px-2 py-1 rounded" style={{ fontFamily: MONO, background: C.tint, color: C.ink }}>{d.calc}</span>
              <span style={{ color: C.amber, fontWeight: 700 }}>=</span>
              <span className="text-xs" style={{ fontFamily: MONO, fontWeight: 700, color: d.check ? C.good : C.navy }}>{d.result}</span>
              {d.note && <span className="text-xs w-full" style={{ color: C.muted, fontStyle: "italic" }}>{d.note}</span>}
            </div>
          ))}
        </div>
        <Note>The chain closes: the memo's own sensitivity figure implies the flight count, the flight count implies the satellite mass, and the resulting space-segment capex sits inside the memo's stated envelope. The memo's economics are more internally coherent than its prose.</Note>
      </Section>

      <Section title="D · Risk register — most risks ARE parameter shifts">
        <div className="overflow-x-auto">
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={th}>ID</th><th style={th}>Risk</th><th style={th}>Memo rating</th>
                <th style={th}>Parameter mapping</th><th style={th}>Consequence</th>
              </tr>
            </thead>
            <tbody>
              {RISKS.map(r => (
                <tr key={r.id} style={r.id === "R12" ? { background: C.tint } : undefined}>
                  <td style={{ ...tdMono, fontWeight: 700, color: C.navy }}>{r.id}</td>
                  <td style={{ ...td, fontWeight: 600, minWidth: 200 }}>{r.risk}</td>
                  <td style={{ ...tdMono, color: r.rating.includes("CRITICAL") || r.rating.includes("kill") ? C.bad : C.muted }}>{r.rating}</td>
                  <td style={{ ...tdMono, whiteSpace: "normal" }}>{r.mapping}</td>
                  <td style={{ ...td, color: C.muted, fontSize: 11, minWidth: 240 }}>{r.consequence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Note>
          The upstream spec change that falls out of this table: write every risk so a machine can ask "which dial does this move."
          R12 is deliberately left unmapped — forcing it into a parameter would be false quantification.
          Impact, where a mapping exists, is computed by the engine, not scored; likelihoods are estimated conditional on a world, never unconditionally.
        </Note>
      </Section>

      <Section title="E · Flags — ambiguities and inconsistencies, with adopted readings">
        <div className="flex flex-col gap-2">
          {FLAGS.map(f => {
            const open = openFlag === f.id;
            return (
              <div key={f.id} className="rounded-lg" style={{ border: `1px solid ${f.id === "F4" || f.id === "F7" ? C.amber : C.line}`, background: C.paper }}>
                <button onClick={() => setOpenFlag(open ? null : f.id)} className="w-full text-left px-3 py-2 flex items-center gap-2" style={{ cursor: "pointer", background: "transparent", border: "none" }}>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ fontFamily: MONO, fontWeight: 700, background: f.id === "F4" || f.id === "F7" ? C.amber : C.tint, color: f.id === "F4" || f.id === "F7" ? C.navy : C.muted }}>{f.id}</span>
                  <span className="text-sm" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>{f.title}</span>
                  <span className="ml-auto text-xs" style={{ fontFamily: MONO, color: C.muted }}>{open ? "−" : "+"}</span>
                </button>
                {open && <div className="px-3 pb-3 text-sm" style={{ color: C.ink, lineHeight: 1.6 }}>{f.body}</div>}
              </div>
            );
          })}
        </div>
        <Note>F4 and F7 (highlighted) are the two genuine discoveries of the extraction pass — found by forcing prose into a schema, no opinion involved. Extraction quality is set at memo-writing time: that is the upstream consequence.</Note>
      </Section>
    </div>
  );
}
