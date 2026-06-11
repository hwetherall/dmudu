import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead } from "../components/ui.jsx";
import { FINDING_COLUMNS, OPEN_QUESTIONS } from "../data/findings.js";

const COL_COLOR = { navy: "#1A2238", amber: "#E8A33D", good: "#2E7D5B" };

export default function Findings() {
  return (
    <div>
      <PageHead
        kicker="Synthesis"
        title="Everything this exercise surfaced"
        sub="One pass of the method, one memo — every finding traceable. Three kinds of yield: what we learned about the method, what we learned about the Samsung case, and what it means upstream for the product."
      />

      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
        {FINDING_COLUMNS.map(col => (
          <div key={col.title} className="rounded-lg p-4" style={{ background: C.card, border: `1px solid ${C.line}`, borderTop: `4px solid ${COL_COLOR[col.color]}` }}>
            <div className="text-sm uppercase tracking-wider mb-3" style={{ fontWeight: 700, color: COL_COLOR[col.color] === C.amber ? C.mid : COL_COLOR[col.color] }}>
              {col.title}
            </div>
            <ul className="flex flex-col gap-2.5">
              {col.items.map((it, i) => (
                <li key={i} className="text-xs flex gap-2" style={{ color: C.ink, lineHeight: 1.55 }}>
                  <span style={{ color: COL_COLOR[col.color], fontWeight: 700 }}>—</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Section title="Five open questions — genuinely unresolved; this is where the co-author comes in">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {OPEN_QUESTIONS.map(q => (
            <div key={q.n} className="rounded-lg p-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-lg" style={{ fontFamily: SERIF, fontWeight: 700, color: C.amber }}>{q.n}</span>
                <span className="text-sm" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>{q.q}</span>
              </div>
              <div className="text-xs" style={{ color: C.muted, lineHeight: 1.6 }}>{q.body}</div>
            </div>
          ))}
        </div>
      </Section>

      <div className="rounded-lg p-5" style={{ background: C.navy }}>
        <div className="text-lg" style={{ fontFamily: SERIF, fontWeight: 700, color: "#fff" }}>
          The thinking is built. <span style={{ color: C.amber }}>The machine comes after it's earned.</span>
        </div>
        <div className="text-xs mt-2" style={{ fontFamily: MONO, color: C.ice, lineHeight: 1.8 }}>
          samsung-model-schema-v0.1.md — 24 cited parameters, 12 mapped risks, 7 flags<br />
          model.py — ~200-line auditable cash model · calibration-report-v0.1.md — anchors, tests, findings<br />
          worlds as X-vectors · strategies as L-configurations · 5×4 grid, regret · pathway-v0.1.md — triggers, staged policy, the loop<br />
          Next: pressure-test the seams → design the stochastic interior together → then, and only then, automate the pipeline.
        </div>
      </div>
    </div>
  );
}
