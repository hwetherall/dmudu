import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Note, th, td, tdMono } from "../components/ui.jsx";
import { ANCHORS, FINDINGS, ASSUMPTIONS } from "../data/calibration.js";

const PASS = {
  pass: { mark: "✓", color: C.good },
  fail: { mark: "✗", color: C.bad },
  partial: { mark: "◐", color: C.mid },
};

export default function Calibration() {
  return (
    <div>
      <PageHead
        kicker="Step 2 · Calibrate — a second audit"
        title="The memo's stated outcomes are the test suite"
        sub="We don't claim this is the model behind the memo; we claim it is a model consistent with the memo's stated economics — and prove it by reproducing the memo's own anchors before computing a single deviation. Two anchors were held out as tests, not fitting targets. Six of seven hit. The seventh broke — and the breakage is the finding."
      />

      <Section title="Baseline vs. calibration targets">
        <div className="overflow-x-auto">
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={th}>ID</th><th style={th}>Target</th><th style={th}>Memo</th><th style={th}>Model v0.1</th><th style={th}>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {ANCHORS.map(a => (
                <tr key={a.id} style={a.pass === "fail" ? { background: "rgba(178,58,72,0.06)" } : undefined}>
                  <td style={{ ...tdMono, fontWeight: 700, color: C.navy }}>{a.id}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{a.target}</td>
                  <td style={tdMono}>{a.memo}</td>
                  <td style={{ ...tdMono, whiteSpace: "normal", fontWeight: a.pass === "fail" ? 700 : 400 }}>{a.model}</td>
                  <td style={{ ...td, whiteSpace: "nowrap" }}>
                    <span style={{ fontFamily: MONO, fontWeight: 700, color: PASS[a.pass].color }}>{PASS[a.pass].mark}</span>
                    {a.note && <span className="ml-2 text-xs" style={{ color: C.muted }}>{a.note}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Note>The launch-elasticity test (C6) passed exactly with no tuning — the model's derivative structure is the memo's. That is what licenses every delta on the Worlds tab.</Note>
      </Section>

      {FINDINGS.map(f => (
        <Section key={f.n} title={`Finding ${f.n}`}>
          <div className="text-base mb-1.5" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>{f.title}</div>
          <p className="text-sm" style={{ color: C.ink, lineHeight: 1.65, maxWidth: 920 }}>{f.body}</p>
          {f.detail && (
            <div className="text-sm mt-2 rounded p-3" style={{ background: C.tint, color: C.ink, lineHeight: 1.6, borderLeft: `4px solid ${C.amber}` }}>
              {f.detail}
            </div>
          )}
        </Section>
      ))}

      <Section title="Declared assumptions in force (schema §E gaps)">
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {ASSUMPTIONS.map(g => (
            <div key={g.id} className="rounded p-2.5 text-xs flex gap-2" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
              <span style={{ fontFamily: MONO, fontWeight: 700, color: C.bad }}>{g.id}</span>
              <span style={{ color: C.ink, lineHeight: 1.5 }}>{g.text}</span>
            </div>
          ))}
        </div>
        <Note>
          Status: baseline frozen. Worlds may be specified as X-vectors, strategies as L-configurations.
          Finding 1 doubles as the strongest upstream argument: financial claims should be emitted from one coherent model.
        </Note>
      </Section>
    </div>
  );
}
