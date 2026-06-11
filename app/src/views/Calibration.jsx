import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Note, th, td, tdMono } from "../components/ui.jsx";
import { ANCHORS, FINDINGS, ASSUMPTIONS } from "../data/calibration.js";
import { P0, DEPLOY, REVENUE, run } from "../engine.js";

const PASS = {
  pass: { mark: "✓", color: C.good },
  fail: { mark: "✗", color: C.bad },
  partial: { mark: "◐", color: C.mid },
};

const EXPLAIN = [
  {
    n: 1, title: "The memo states its inputs",
    body: "Launch $/kg, satellite lifespan, build schedule, prices. Step 1 already extracted them into the cited schema — they go into the model untouched.",
  },
  {
    n: 2, title: "The memo also states its outcomes",
    body: "Breakeven Year 7–8. Trough −$8.5B. IRR 11–13%. Revenue >$10B by Year 10. We treat these stated outcomes as a test suite the model must pass — with two anchors held out as pure tests, never used for fitting.",
  },
  {
    n: 3, title: "The model must connect the two",
    body: "Feed in the memo's inputs; check whether the memo's outcomes come out. Six of eight pass, one partially. One fails — and the failure is not a bug in the model. It is the memo contradicting itself. That is Finding 1, below.",
  },
];

/* ── the replenishment wall, drawn live from the engine ───────────────── */

function ReplenishmentChart() {
  const rows = run(P0, DEPLOY, REVENUE, 0).filter(r => r.year <= 12);
  const costPerSat = P0.satCost / 1000 + (P0.mass * P0.kg) / 1e9; // $B
  const replBill = rows.filter(r => r.year === 9 || r.year === 10)
    .reduce((s, r) => s + (r.sats - (DEPLOY[r.year] || 0)) * costPerSat, 0);

  const W = 880, Hh = 320, xL = 14, barW = 42, step = 70, yBase = 290, barMax = 120, satMax = 1700;
  const x = y => xL + (y - 1) * step;
  const yCum = v => 60 + ((4 - v) / 13) * 215; // $B −9..+4 → px
  const cumPts = rows.map(r => `${x(r.year) + barW / 2},${yCum(r.cum)}`).join(" ");
  const beYear = rows.find(r => r.cum >= 0)?.year;
  const halo = { paintOrder: "stroke", stroke: "#fff", strokeWidth: 3, strokeLinejoin: "round" };

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${Hh}`} style={{ minWidth: 760, width: "100%", display: "block" }}>
        {/* memo's claimed breakeven window */}
        <rect x={x(7)} y={42} width={step + barW} height={yBase - 42} fill="rgba(232,163,61,0.13)" />
        <text x={x(7) + (step + barW) / 2} y={34} textAnchor="middle" style={{ font: `700 10px ${MONO}`, fill: "#7A5413" }}>
          memo claims breakeven here (Y7–8)
        </text>

        {/* zero cumulative line */}
        <line x1={xL} x2={x(12) + barW} y1={yCum(0)} y2={yCum(0)} stroke={C.muted} strokeDasharray="4 4" strokeWidth="1" />
        <text x={xL + 4} y={yCum(0) - 5} style={{ font: `9px ${MONO}`, fill: C.muted, ...halo }}>$0 cumulative</text>

        {/* bars: build (navy) + replenishment (red) */}
        {rows.map(r => {
          const build = DEPLOY[r.year] || 0;
          const repl = r.sats - build;
          const hB = (build / satMax) * barMax, hR = (repl / satMax) * barMax;
          return (
            <g key={r.year}>
              {build > 0 && <rect x={x(r.year)} y={yBase - hB} width={barW} height={Math.max(hB, 1.5)} fill={C.navy} rx="2" />}
              {repl > 0 && <rect x={x(r.year)} y={yBase - hB - hR} width={barW} height={Math.max(hR, 1.5)} fill={C.bad} rx="2" />}
              <text x={x(r.year) + barW / 2} y={yBase + 14} textAnchor="middle" style={{ font: `10px ${MONO}`, fill: C.muted }}>Y{r.year}</text>
            </g>
          );
        })}

        {/* the $6.2B bill bracket over Y9–10 */}
        <path d={`M ${x(9)} 150 L ${x(9)} 144 L ${x(10) + barW} 144 L ${x(10) + barW} 150`} stroke={C.bad} fill="none" strokeWidth="1.5" />
        <text x={x(10) + barW} y={136} textAnchor="end" style={{ font: `700 10px ${MONO}`, fill: C.bad, ...halo }}>
          the Y4–5 fleet dies: ~${replBill.toFixed(1)}B replacement bill
        </text>

        {/* cumulative cash line */}
        <polyline points={cumPts} fill="none" stroke={C.amber} strokeWidth="2.5" />
        {rows.map(r => <circle key={r.year} cx={x(r.year) + barW / 2} cy={yCum(r.cum)} r="3" fill={C.amber} />)}

        {/* model breakeven marker */}
        {beYear && (
          <g>
            <circle cx={x(beYear) + barW / 2} cy={yCum(rows.find(r => r.year === beYear).cum)} r="6" fill="none" stroke={C.good} strokeWidth="2" />
            <text x={x(beYear) + barW / 2} y={yCum(rows.find(r => r.year === beYear).cum) - 12} textAnchor="end" style={{ font: `700 10px ${MONO}`, fill: C.good, ...halo }}>
              model breakeven: Y{beYear}
            </text>
          </g>
        )}

        {/* trough label */}
        <text x={x(5) + barW + 4} y={yCum(-8.76) + 4} style={{ font: `700 10px ${MONO}`, fill: "#7A5413", ...halo }}>
          trough −$8.8B
        </text>
      </svg>
      <div className="flex flex-wrap gap-4 mt-1.5">
        {[
          [C.navy, "satellites launched — initial build"],
          [C.bad, "satellites launched — replacement (5-yr lifespan)"],
          [C.amber, "cumulative cash, $B (line)"],
        ].map(([col, label]) => (
          <span key={label} className="flex items-center gap-1.5 text-xs" style={{ fontFamily: MONO, color: C.muted }}>
            <span style={{ width: 10, height: 10, background: col, borderRadius: 2, display: "inline-block" }} />{label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── the page ─────────────────────────────────────────────────────────── */

export default function Calibration() {
  const star = FINDINGS.find(f => f.n === 1);
  const rest = FINDINGS.filter(f => f.n !== 1);

  return (
    <div>
      <PageHead
        kicker="Step 2 · Calibrate — the model must earn trust"
        title="Before the model may say anything new, it must repeat the memo"
        sub="We built a small cash-flow model of the venture (~200 lines, running live in this page). Calibration asks one question: fed the memo's own inputs, does it reproduce the memo's own outcomes? Until it does, its outputs are noise. Once it does, every deviation it computes — every world, every strategy — is meaningful."
      />

      <Section title="What calibration means — in three moves">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
          {EXPLAIN.map(e => (
            <div key={e.n} className="rounded-lg p-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="rounded-full text-center" style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, width: 20, height: 20, lineHeight: "20px", background: C.navy, color: "#fff", flexShrink: 0 }}>{e.n}</span>
                <span className="text-sm" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>{e.title}</span>
              </div>
              <div className="text-xs" style={{ color: C.muted, lineHeight: 1.6 }}>{e.body}</div>
            </div>
          ))}
        </div>
        <Note>
          A subtlety worth saying out loud: we never claim this is the model behind the memo. We claim it is a model consistent with the memo's stated economics —
          and the test suite is what makes that claim checkable rather than rhetorical.
        </Note>
      </Section>

      <Section title="The test suite — memo's stated outcomes vs. the model">
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

      {/* ── Finding 1 — the star ── */}
      <div className="rounded-lg p-4 mb-4" style={{ background: C.card, border: `2px solid ${C.amber}` }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.amber, color: C.navy }}>FINDING 1 · THE HEADLINE RESULT</span>
        </div>
        <div className="text-lg mb-1" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>{star.title}</div>
        <p className="text-sm mb-3" style={{ color: C.muted, lineHeight: 1.6, maxWidth: 920 }}>{star.body}</p>

        <div className="flex flex-col gap-1.5 mb-3" style={{ maxWidth: 920 }}>
          {star.steps.map((s, i) => (
            <div key={i} className="flex gap-2.5 rounded p-2.5" style={{ background: i === 3 ? "rgba(178,58,72,0.07)" : C.paper, border: `1px solid ${i === 3 ? "rgba(178,58,72,0.35)" : C.line}` }}>
              <span className="rounded-full text-center" style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, width: 20, height: 20, lineHeight: "20px", background: i === 3 ? C.bad : C.navy, color: "#fff", flexShrink: 0 }}>{i + 1}</span>
              <span className="text-sm" style={{ color: C.ink, lineHeight: 1.55 }}>{s}</span>
            </div>
          ))}
        </div>
        <div className="rounded p-3 mb-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: C.muted, fontWeight: 700 }}>The replenishment wall — drawn live from the engine</div>
          <ReplenishmentChart />
        </div>

        <div className="text-sm rounded p-3" style={{ background: C.tint, color: C.ink, lineHeight: 1.65, borderLeft: `4px solid ${C.amber}` }}>
          {star.detail}
        </div>
      </div>

      {rest.map(f => (
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
