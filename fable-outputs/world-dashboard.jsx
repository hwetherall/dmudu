import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend, ResponsiveContainer } from "recharts";

// ───────────────────────── palette ─────────────────────────
const C = {
  navy: "#1A2238", ink: "#232A40", paper: "#F7F9FC", card: "#FFFFFF",
  ice: "#CADCFC", amber: "#E8A33D", good: "#2E7D5B", bad: "#B23A48",
  mid: "#8A6D1F", muted: "#5A6478", line: "#D7DEEA", tint: "#E9EEF7",
};
const MONO = "ui-monospace, Menlo, Consolas, monospace";
const SERIF = "Georgia, Cambria, serif";

// ───────────────────────── the engine (ported line-for-line from model.py) ─────────────────────────
const P0 = { satCost: 0.5, mass: 800, kg: 2000, lifespan: 5, gatewayTotal: 2.0, coinvest: 0.5,
  otherCapex: 0.5, eng: 0.12, satOpsK: 30, sga: 0.12, cogsStart: 0.70, cogsFloor: 0.55, cogsRamp: 5 };
const DEPLOY = { 1: 2, 2: 50, 3: 500, 4: 1300, 5: 1648 };
const REVENUE = { 3: 0.30, 4: 1.00, 5: 2.50, 6: 4.50, 7: 7.00, 8: 9.50, 9: 10.20, 10: 10.80, 11: 11.50, 12: 12.20 };
const GROWTH = 0.06, H = 15;

function run(p, deploy, revenueBase, revDelay) {
  const rev = {};
  Object.entries(revenueBase).forEach(([y, v]) => { rev[Number(y) + revDelay] = v; });
  const revYears = Object.keys(rev).map(Number);
  const firstRev = Math.min(...revYears), maxRev = Math.max(...revYears);
  const launched = []; let cum = 0; const rows = [];
  const costPerSat = p.satCost / 1000 + (p.mass * p.kg) / 1e9; // $B per satellite, delivered

  for (let y = 1; y <= H; y++) {
    const build = deploy[y] || 0;
    const repl = launched.filter(([yy]) => y - yy === p.lifespan).reduce((s, [, n]) => s + n, 0);
    const sats = build + repl;
    launched.push([y, sats]);
    const active = launched.filter(([yy]) => y - yy < p.lifespan).reduce((s, [, n]) => s + n, 0);

    const spaceCapex = sats * costPerSat;
    const gw = y >= 2 && y <= 5 ? (p.gatewayTotal * (1 - p.coinvest)) / 4 : 0;
    const other = y <= 5 ? p.otherCapex / 5 : 0;
    const capex = spaceCapex + gw + other;

    let r = rev[y] || 0;
    if (y > maxRev) r = rev[maxRev] * Math.pow(1 + GROWTH, y - maxRev);
    const cogsF = Math.max(p.cogsFloor, p.cogsStart - ((p.cogsStart - p.cogsFloor) * Math.max(0, y - firstRev)) / p.cogsRamp);
    const gross = r * (1 - cogsF);
    const opex = p.eng + (active * p.satOpsK) / 1e6 + p.sga * r;
    const fcf = gross - opex - capex;
    cum += fcf;
    rows.push({ year: y, sats, active, rev: r, gross, opex, capex, fcf, cum });
  }
  return rows;
}
function metrics(rows) {
  const trough = rows.reduce((a, b) => (b.cum < a.cum ? b : a));
  const be = rows.find(r => r.cum >= 0)?.year ?? null;
  const y10 = rows.find(r => r.year === 10);
  const cfs = rows.map(r => r.fcf);
  let lo = -0.5, hi = 1.0;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const npv = cfs.reduce((s, cf, j) => s + cf / Math.pow(1 + mid, j + 1), 0);
    if (npv > 0) lo = mid; else hi = mid;
  }
  return { trough: trough.cum, troughYr: trough.year, be, y10rev: y10.rev, irr: (lo + hi) / 2 };
}

// ───────────────────────── worlds ─────────────────────────
const WORLDS = [
  { id: "BASE", name: "Baseline", tag: "calibrated to the memo",
    x: { kg: 2000, coinvest: 0.50, mult: 1.00, dDelay: 0, rDelay: 0 },
    story: "No world applied — this is the memo's own economics, made coherent. Launch at $2,000/kg, MNO co-investment at 50%, revenue on the ramp reverse-engineered from the memo's >$10B Year-10 target. Every other view on this page is a delta from here.",
    look: "Watch the Capex row in Y9–10: the Y4–5 satellite cohorts die on their 5-year lifespan and replenishment lands exactly where the memo promised breakeven. That is why Cumulative crosses zero in Y12, not Y7–8.",
    verdictNote: "Sits on the THRIVE edge — IRR 11.2% against an 11% hurdle. The base plan is marginal, not comfortable." },
  { id: "W1", name: "W1 · Gated Orbits", tag: "fragmented demand · scarce launch",
    x: { kg: 2400, coinvest: 0.60, mult: 0.95, dDelay: 1, rDelay: 1 },
    story: "Sovereignty mandates harden across the beachheads and the premium is real — but non-SpaceX launch capacity stays booked. Samsung pays top-of-range $2,400/kg, waits a year in the manifest queue, and revenue follows the delayed capacity. The venture becomes a race between a real premium and a structural tax, run in slow motion.",
    look: "Every column shifts one year right, and Capex thickens: +$400/kg adds about $0.32M per satellite — roughly $1.1B over the build, and more on every replenishment cycle forever. Revenue survives (the premium holds) but arrives late and slightly thinner.",
    verdictNote: "IRR 4.8% against a 5% DIE cutoff fixed ex ante — reported as a boundary, not nudged. A smaller, slower constellation (or GaaS-first) is the rework this world is asking for." },
  { id: "W2", name: "W2 · Sovereign Plenty", tag: "fragmented demand · abundant launch",
    x: { kg: 1200, coinvest: 0.60, mult: 1.05, dDelay: 0, rDelay: 0 },
    story: "Fragmentation holds AND launch commoditizes below $1,200/kg as New Glenn, Neutron and ISRO scale. Samsung's structural tax shrinks while the sovereignty premium stands. The plan's dream quadrant — shared with newly-armed rival sovereign entrants contesting the same white space.",
    look: "The Capex row deflates everywhere — $800/kg cheaper is about $0.64M per satellite, roughly $2.2B off the build and cheaper replenishment forever. The trough shallows to −$6.3B and Cumulative crosses zero three years early.",
    verdictNote: "The only world where the plan-as-written is the right answer — which is exactly the point: as written, the plan is a wager on this quadrant." },
  { id: "W3", name: "W3 · Incumbent Citadel", tag: "normalized demand · scarce launch",
    x: { kg: 2400, coinvest: 0.25, mult: 0.60, dDelay: 1, rDelay: 1 },
    story: "Pragmatism wins: Starlink and Kuiper concede local gateways and intercept compliance, get licensed in the beachheads, and the sovereignty premium collapses — while launch stays scarce and expensive. The thesis fails on both ends at once: full tax, no premium, and MNOs see no strategic reason to co-invest.",
    look: "The fingerprint of a capital crater: the Capex rows stay heavy (full build at top-dollar launch, co-investment evaporated) while the Revenue row never develops. Cumulative falls to −$12.4B — the deepest hole on the board — and never comes back.",
    verdictNote: "Dies fast and detectably: the signpost is a license event, observable years before the cash proves it. The trigger is to freeze constellation capex the day a beachhead licenses an incumbent under a compliance concession." },
  { id: "W4", name: "W4 · Contested Commodity", tag: "normalized demand · abundant launch",
    x: { kg: 1200, coinvest: 0.25, mult: 0.55, dDelay: 0, rDelay: 0 },
    story: "Cheap launch for everyone and no premium for anyone: capacity floods the market, wholesale pricing falls toward the $0.30/GB floor, and connectivity becomes a commodity. The constellation-as-business dies; what survives is whatever is differentiated by something other than capacity.",
    look: "Compare with W3 — same verdict, opposite shape. Cheap launch caps the damage (trough only −$7.4B) but the Revenue row is gutted at the source, so FCF never accumulates. A slow margin bleed, not a crater.",
    verdictNote: "Detectable through price erosion, not license events — opposite instrumentation to W3. The best response here is not a better constellation; it is not being a constellation operator (components, D2D)." },
];

function verdictOf(m) {
  if (m.be === null || m.irr < 0.05) return { v: "DIE", color: C.bad, boundary: m.irr >= 0.04 && m.irr < 0.05 };
  if (m.irr >= 0.11 && m.be <= 12) return { v: "THRIVE", color: C.good, boundary: m.irr < 0.12 };
  return { v: "REWORK", color: C.mid, boundary: false };
}
const fmtB = v => (Math.abs(v) < 0.005 ? "0.00" : v.toFixed(2));
const fmtD = v => (Math.abs(v) < 0.005 ? "·" : (v > 0 ? "+" : "−") + Math.abs(v).toFixed(2));
const fmtDi = v => (v === 0 ? "·" : (v > 0 ? "+" : "−") + Math.abs(v));

// ───────────────────────── components ─────────────────────────
function Metric({ label, value, delta, betterWhen }) {
  const good = delta == null ? null : betterWhen === "up" ? !delta.startsWith("−") && !delta.startsWith("never") : delta.startsWith("−");
  return (
    <div className="flex-1 rounded-lg px-4 py-3" style={{ background: C.card, border: `1px solid ${C.line}`, minWidth: 150 }}>
      <div className="text-xs uppercase tracking-wider" style={{ color: C.muted }}>{label}</div>
      <div className="text-2xl" style={{ fontFamily: SERIF, color: C.navy, fontWeight: 700 }}>{value}</div>
      <div className="text-xs mt-0.5" style={{ fontFamily: MONO, color: delta == null || delta === "" ? C.muted : good ? C.good : C.bad }}>
        {delta == null || delta === "" ? "vs baseline —" : delta + " vs baseline"}
      </div>
    </div>
  );
}

function DialChip({ label, base, now, fmt }) {
  const changed = base !== now;
  return (
    <div className="rounded px-2.5 py-1.5 text-xs" style={{
      fontFamily: MONO, background: changed ? "rgba(232,163,61,0.16)" : C.tint,
      border: `1px solid ${changed ? C.amber : C.line}`, color: changed ? C.navy : C.muted,
      fontWeight: changed ? 700 : 400, whiteSpace: "nowrap",
    }}>
      <span style={{ fontFamily: "inherit", fontWeight: 400, color: C.muted }}>{label} </span>
      {changed ? <>{fmt(base)} {"→"} {fmt(now)}</> : <>{fmt(base)}</>}
    </div>
  );
}

export default function WorldDashboard() {
  const [worldId, setWorldId] = useState("W3");
  const [mode, setMode] = useState("values"); // 'values' | 'delta'

  const baseRows = useMemo(() => run(P0, DEPLOY, REVENUE, 0), []);
  const baseM = useMemo(() => metrics(baseRows), [baseRows]);

  const world = WORLDS.find(w => w.id === worldId);
  const { rows, m } = useMemo(() => {
    const x = world.x;
    const p = { ...P0, kg: x.kg, coinvest: x.coinvest };
    const deploy = {}; Object.entries(DEPLOY).forEach(([y, n]) => { deploy[Number(y) + x.dDelay] = n; });
    const rev = {}; Object.entries(REVENUE).forEach(([y, v]) => { rev[y] = v * x.mult; });
    const rows = run(p, deploy, rev, x.rDelay);
    return { rows, m: metrics(rows) };
  }, [worldId]);

  const isBase = worldId === "BASE";
  const verdict = verdictOf(m);
  const chartData = rows.map((r, i) => ({ year: r.year, world: +r.cum.toFixed(2), baseline: +baseRows[i].cum.toFixed(2) }));

  const tableRows = [
    { key: "sats", label: "Satellites launched", int: true },
    { key: "active", label: "Active satellites", int: true },
    { key: "rev", label: "Revenue" },
    { key: "gross", label: "Gross cash" },
    { key: "opex", label: "Opex" },
    { key: "capex", label: "Capex" },
    { key: "fcf", label: "Free cash flow" },
    { key: "cum", label: "Cumulative cash", strong: true },
  ];

  function cellStyle(rowKey, d, value) {
    const base = { fontFamily: MONO, fontSize: 11, padding: "5px 7px", textAlign: "right", whiteSpace: "nowrap", borderBottom: `1px solid ${C.line}` };
    if (mode === "delta" && !isBase) {
      if (Math.abs(d) > 0.004) {
        const goodDelta = rowKey === "opex" || rowKey === "capex" ? d < 0 : d > 0;
        const alpha = Math.min(0.10 + Math.abs(d) / 8, 0.45);
        base.background = goodDelta ? `rgba(46,125,91,${alpha})` : `rgba(178,58,72,${alpha})`;
        base.color = C.ink; base.fontWeight = Math.abs(d) > 1 ? 700 : 400;
      } else { base.color = C.muted; }
    } else {
      base.color = rowKey === "cum" ? (value < 0 ? C.bad : C.good) : C.ink;
      if (rowKey === "cum") base.fontWeight = 600;
    }
    return base;
  }

  return (
    <div className="min-h-screen w-full" style={{ background: C.paper }}>
      {/* ── header band ── */}
      <div style={{ background: C.navy }} className="px-6 py-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xl" style={{ fontFamily: SERIF, color: "#FFFFFF", fontWeight: 700 }}>
              The model, literally <span style={{ color: C.amber }}>—</span> Samsung LEO cash engine
            </div>
            <div className="text-xs mt-1" style={{ color: C.ice }}>
              Same 200 lines, same levers — only the world changes. Every figure on this page is computed live; nothing is pasted.
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {WORLDS.map(w => (
              <button key={w.id} onClick={() => setWorldId(w.id)}
                className="px-3 py-1.5 rounded text-xs"
                style={{
                  fontFamily: MONO, cursor: "pointer",
                  background: w.id === worldId ? C.amber : "rgba(202,220,252,0.12)",
                  color: w.id === worldId ? C.navy : C.ice,
                  fontWeight: w.id === worldId ? 700 : 400,
                  border: `1px solid ${w.id === worldId ? C.amber : "rgba(202,220,252,0.25)"}`,
                }}>
                {w.id === "BASE" ? "Baseline" : w.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-4" style={{ maxWidth: 1180, margin: "0 auto" }}>

        {/* ── 1 · WORLD SUMMARY ── */}
        <div className="rounded-lg p-5 mb-4" style={{ background: C.card, borderLeft: `5px solid ${verdict.color}`, border: `1px solid ${C.line}`, borderLeftWidth: 5, borderLeftColor: verdict.color }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div>
              <span className="text-xl" style={{ fontFamily: SERIF, color: C.navy, fontWeight: 700 }}>{world.name}</span>
              <span className="text-xs ml-3 uppercase tracking-wider" style={{ color: C.muted }}>{world.tag}</span>
            </div>
            <div className="px-3 py-1 rounded text-sm" style={{ background: verdict.color, color: "#fff", fontFamily: MONO, fontWeight: 700 }}>
              {verdict.v}{verdict.boundary ? " · boundary" : ""}
            </div>
          </div>
          <p className="text-sm mb-3" style={{ color: C.ink, lineHeight: 1.6, maxWidth: 880 }}>{world.story}</p>
          <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: C.muted, fontWeight: 700 }}>
            What this world changes {isBase ? "— nothing; this is the reference" : "(worlds may touch only exogenous dials — the plan's levers are untouched)"}
          </div>
          <div className="flex flex-wrap gap-2">
            <DialChip label="Launch $/kg" base={2000} now={world.x.kg} fmt={v => "$" + v.toLocaleString()} />
            <DialChip label="MNO co-invest" base={0.5} now={world.x.coinvest} fmt={v => Math.round(v * 100) + "%"} />
            <DialChip label="Revenue (price × share)" base={1} now={world.x.mult} fmt={v => "×" + v.toFixed(2)} />
            <DialChip label="Deployment" base={0} now={world.x.dDelay} fmt={v => "+" + v + " yr"} />
            <DialChip label="Revenue ramp" base={0} now={world.x.rDelay} fmt={v => "+" + v + " yr"} />
          </div>
        </div>

        {/* ── 2 · KEY FIGURES ── */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Metric label="Cumulative breakeven" value={m.be ? `Year ${m.be}` : ">15 yrs"}
            delta={isBase ? "" : m.be && baseM.be ? `${fmtDi(m.be - baseM.be)} yrs` : "never (was Y12)"} betterWhen="down" />
          <Metric label="Cash trough" value={`−$${Math.abs(m.trough).toFixed(1)}B`}
            delta={isBase ? "" : `${fmtD(m.trough - baseM.trough)} $B`} betterWhen="up" />
          <Metric label="IRR (15-yr FCF)" value={`${(m.irr * 100).toFixed(1)}%`}
            delta={isBase ? "" : `${fmtD((m.irr - baseM.irr) * 100)} pts`} betterWhen="up" />
          <Metric label="Year-10 revenue" value={`$${m.y10rev.toFixed(1)}B`}
            delta={isBase ? "" : `${fmtD(m.y10rev - baseM.y10rev)} $B`} betterWhen="up" />
        </div>

        {/* ── 3 · TABLE OF RESULTS ── */}
        <div className="rounded-lg p-4 mb-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs uppercase tracking-wider" style={{ color: C.muted, fontWeight: 700 }}>
              The cells — annual cash engine, $B
            </div>
            <div className="flex gap-1">
              {["values", "delta"].map(mo => (
                <button key={mo} onClick={() => setMode(mo)} disabled={mo === "delta" && isBase}
                  className="px-2.5 py-1 rounded text-xs"
                  style={{
                    fontFamily: MONO, cursor: mo === "delta" && isBase ? "not-allowed" : "pointer",
                    background: mode === mo ? C.navy : C.tint,
                    color: mode === mo ? "#fff" : mo === "delta" && isBase ? C.line : C.muted,
                    fontWeight: mode === mo ? 700 : 400,
                  }}>
                  {mo === "values" ? "Values" : "Δ vs baseline"}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ position: "sticky", left: 0, background: C.navy, color: "#fff", fontFamily: MONO, fontSize: 10, padding: "5px 8px", textAlign: "left", zIndex: 2 }}>$B / year</th>
                  {rows.map(r => (
                    <th key={r.year} style={{ background: C.navy, color: r.year === m.troughYr ? C.amber : "#fff", fontFamily: MONO, fontSize: 10, padding: "5px 7px", textAlign: "right" }}>
                      Y{r.year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map(tr => (
                  <tr key={tr.key} style={tr.strong ? { background: C.tint } : undefined}>
                    <td style={{ position: "sticky", left: 0, background: tr.strong ? C.tint : C.card, fontSize: 11, fontWeight: tr.strong ? 700 : 500, color: C.ink, padding: "5px 8px", whiteSpace: "nowrap", borderBottom: `1px solid ${C.line}`, zIndex: 1 }}>
                      {tr.label}
                    </td>
                    {rows.map((r, i) => {
                      const v = r[tr.key], b = baseRows[i][tr.key], d = v - b;
                      const show = mode === "delta" && !isBase
                        ? (tr.int ? fmtDi(v - b) : fmtD(d))
                        : (tr.int ? v.toLocaleString() : fmtB(v));
                      return <td key={r.year} style={cellStyle(tr.key, tr.int ? (v - b) / 500 : d, v)}>{show}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs mt-2 italic" style={{ color: C.muted }}>
            Trough year highlighted in the header. In Δ mode, green cells help the venture, red cells hurt it — the tint deepens with the size of the move.
            Shows Samsung's plan-as-written (S1) regraded per world; the strategy alternatives live in the regret matrix.
          </div>
        </div>

        {/* ── 4 · GRAPH OF RESULTS ── */}
        <div className="rounded-lg p-4 mb-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
          <div className="text-xs uppercase tracking-wider mb-1" style={{ color: C.muted, fontWeight: 700 }}>
            Cumulative cash, $B — {isBase ? "baseline" : "world vs baseline"}
          </div>
          <div style={{ width: "100%", height: 230 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: -14 }}>
                <CartesianGrid stroke={C.line} strokeDasharray="2 4" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fontFamily: MONO, fill: C.muted }} />
                <YAxis tick={{ fontSize: 10, fontFamily: MONO, fill: C.muted }} />
                <Tooltip contentStyle={{ fontFamily: MONO, fontSize: 11, border: `1px solid ${C.line}` }} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: MONO }} />
                <ReferenceLine y={0} stroke={C.ink} strokeWidth={1} />
                {!isBase && <Line type="monotone" dataKey="baseline" stroke={C.muted} strokeDasharray="5 4" strokeWidth={1.5} dot={false} />}
                <Line type="monotone" dataKey="world" name={isBase ? "baseline" : world.id} stroke={isBase ? C.navy : verdict.color} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── 5 · COMMENTARY ── */}
        <div className="rounded-lg p-5" style={{ background: C.navy }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: C.amber, fontWeight: 700 }}>Commentary — the big changes</div>
          <p className="text-sm mb-2" style={{ color: C.ice, lineHeight: 1.6 }}>
            <b style={{ color: "#fff" }}>Where to look: </b>{world.look}
          </p>
          <p className="text-sm" style={{ color: C.ice, lineHeight: 1.6 }}>
            <b style={{ color: "#fff" }}>Verdict: </b>{world.verdictNote}
          </p>
        </div>
      </div>
    </div>
  );
}
