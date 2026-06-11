import { useState } from "react";
import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Tag, TagLegend, Note, th, td, tdMono } from "../components/ui.jsx";
import { PARAM_BLOCKS, DERIVATIONS, RISKS, FLAGS } from "../data/schema.js";

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

export default function Schema() {
  const [openFlag, setOpenFlag] = useState("F4");
  return (
    <div>
      <PageHead
        kicker="Step 1 · Extract — and it is an audit"
        title="The memo becomes data"
        sub="24 parameters, 12 risks, 9 calibration targets — every value cited to the memo section it came from. The rule that makes everything downstream work: worlds touch only X, strategies touch only L, derived values recompute, and every gap is a declared assumption."
      />

      <Section title="Tag legend — the XLRM split, enforced at the schema level">
        <TagLegend />
      </Section>

      {PARAM_BLOCKS.map(b => <ParamTable key={b.title} block={b} />)}

      <Section title="C · The derivation chain — shown so it can be audited">
        <div className="rounded p-3" style={{ background: C.navy }}>
          {DERIVATIONS.map((d, i) => (
            <div key={i} className="text-xs py-1" style={{ fontFamily: MONO, color: C.ice, lineHeight: 1.6 }}>{d}</div>
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
