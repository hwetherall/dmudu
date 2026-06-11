import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Note, th, td, tdMono } from "../components/ui.jsx";
import { POLICY, TRIGGERS, NO_REGRET, LOOP, LOOP_NOTE, PRODUCT_NOTE } from "../data/pathway.js";

export default function Pathway() {
  return (
    <div>
      <PageHead
        kicker="Step 7 · The pathway — the matrix becomes a policy"
        title="Signposts, triggers, staged commitment"
        sub="The robustness matrix does not say “do GaaS.” It says: the plan-as-written is a wager on W2, and the rational structure is a staged policy that buys world-information cheaply before committing capital irreversibly. The memo's own Phase 1 is that purchase."
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 rounded-lg px-5 py-4" style={{ background: C.navy, minWidth: 260 }}>
          <div className="text-3xl" style={{ fontFamily: SERIF, fontWeight: 700, color: C.amber }}>$2.5M</div>
          <div className="text-xs mt-1" style={{ color: C.ice }}>Phase-1 option premium — <i>explore:</i> buy information that cannot be obtained any other way</div>
        </div>
        <div className="flex-1 rounded-lg px-5 py-4" style={{ background: C.navy, minWidth: 260 }}>
          <div className="text-3xl" style={{ fontFamily: SERIF, fontWeight: 700, color: C.bad }}>$7.15B</div>
          <div className="text-xs mt-1" style={{ color: C.ice }}>Worst-case regret it insures against — <i>exploit:</i> commit irreversibly only on evidence</div>
        </div>
      </div>

      <Section title="1 · The policy, stated">
        <p className="text-sm" style={{ color: C.ink, lineHeight: 1.65, maxWidth: 920 }}>{POLICY}</p>
      </Section>

      <Section title="2 · Trigger table — gates observed → world inference → committed response">
        <div className="overflow-x-auto">
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={th}>Signal observed (Phase 1, months 1–18)</th>
                <th style={th}>World inference</th>
                <th style={th}>Committed response</th>
              </tr>
            </thead>
            <tbody>
              {TRIGGERS.map((t, i) => (
                <tr key={i} style={t.early ? { background: "rgba(232,163,61,0.10)" } : undefined}>
                  <td style={{ ...td, fontWeight: 600, minWidth: 220 }}>
                    {t.early && <span className="px-1.5 py-0.5 rounded text-xs mr-2" style={{ fontFamily: MONO, fontWeight: 700, background: C.amber, color: C.navy }}>EARLY</span>}
                    {t.signal}
                  </td>
                  <td style={{ ...tdMono, whiteSpace: "normal", minWidth: 130 }}>{t.world}</td>
                  <td style={{ ...td, color: C.ink, minWidth: 280 }}>{t.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Note>
          The launch gate measures the supply axis; the LOI/co-invest gate measures the demand axis. Two gates, two axes, four outcomes, four prepared responses.
          The two EARLY rows fire ahead of the gates — W3 announces itself through license events, W4 through price erosion.
        </Note>
      </Section>

      <Section title="3 · Robust act-now moves — no-regret in all four worlds">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {NO_REGRET.map(m => (
            <div key={m.id} className="rounded-lg p-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
              <div className="flex items-baseline gap-2 mb-1">
                <span style={{ fontFamily: MONO, fontWeight: 700, color: C.good }}>{m.id}</span>
                <span className="text-sm" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>{m.title}</span>
              </div>
              <div className="text-xs" style={{ color: C.muted, lineHeight: 1.55 }}>{m.why}</div>
            </div>
          ))}
        </div>
        <Note>
          From the cross-world risk sort: risks rated critical in three or four worlds don't depend on how the deep uncertainty resolves — mitigate now.
          Risks critical in only one or two worlds get a signpost and a trigger instead. The risk grid is the literal generator of the monitoring layer.
        </Note>
      </Section>

      <Section title="4 · The loop — what happens after Phase 1 reports (V2 re-instantiation)">
        <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {LOOP.map(l => (
            <div key={l.title} className="rounded-lg p-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
              <div className="text-sm mb-1" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>{l.title}</div>
              <div className="text-xs" style={{ color: C.muted, lineHeight: 1.6 }}>{l.body}</div>
            </div>
          ))}
        </div>
        <div className="text-sm rounded p-3 mb-3" style={{ background: C.tint, color: C.ink, lineHeight: 1.65, borderLeft: `4px solid ${C.amber}` }}>
          {LOOP_NOTE}
        </div>
        <div className="rounded-lg p-4" style={{ background: C.navy }}>
          <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: C.amber, fontWeight: 700 }}>Product implication — Innovera</div>
          <p className="text-sm" style={{ color: C.ice, lineHeight: 1.65 }}>{PRODUCT_NOTE}</p>
        </div>
      </Section>
    </div>
  );
}
