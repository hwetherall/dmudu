import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { C, MONO, SERIF } from "../theme.js";
import { PageHead, Section, Note, th, td, tdMono } from "../components/ui.jsx";
import { P0, runWorld, verdictOf } from "../engine.js";
import { WORLDS } from "../data/worlds.js";

const TAG = {
  X: { bg: "rgba(232,163,61,0.18)", border: C.amber, fg: "#7A5413" },
  L: { bg: "rgba(26,34,56,0.10)", border: C.navy, fg: C.navy },
  GAP: { bg: "rgba(178,58,72,0.12)", border: C.bad, fg: C.bad },
  D: { bg: C.tint, border: C.line, fg: C.muted },
  M: { bg: "rgba(46,125,91,0.10)", border: C.good, fg: C.good },
};

const VIEW_MODES = [
  { id: "all", label: "Full flow" },
  { id: "outside", label: "Outside world" },
  { id: "inside", label: "Inside venture" },
];

const TABLE_ROWS = [
  { key: "build", label: "Initial build", int: true },
  { key: "repl", label: "Replacement launches", int: true },
  { key: "active", label: "Active satellites", int: true },
  { key: "rev", label: "Revenue" },
  { key: "gross", label: "Gross cash" },
  { key: "opex", label: "Opex" },
  { key: "spaceCapex", label: "Space capex" },
  { key: "gatewayCapex", label: "Gateway capex" },
  { key: "otherCapex", label: "Other capex" },
  { key: "fcf", label: "Free cash flow" },
  { key: "cum", label: "Cumulative cash", strong: true },
];

const PATHS = {
  launch: ["launch", "deployment", "statement", "metrics"],
  demand: ["demand", "revenue", "statement", "metrics"],
  partners: ["partners", "deployment", "statement", "metrics"],
  regulation: ["regulation", "revenue", "statement", "metrics"],
  deployment: ["deployment", "statement", "metrics"],
  revenue: ["revenue", "statement", "metrics"],
  statement: ["statement", "metrics"],
  metrics: ["metrics"],
};

function sum(rows, key) {
  return rows.reduce((s, r) => s + r[key], 0);
}

function fmtB(v, digits = 1) {
  if (Math.abs(v) < 0.005) return "$0.0B";
  return (v < 0 ? "-$" : "$") + Math.abs(v).toFixed(digits) + "B";
}

function fmtPlain(v) {
  if (Math.abs(v) < 0.005) return "0.00";
  return v.toFixed(2);
}

function fmtDelta(v, unit = "") {
  if (Math.abs(v) < 0.005) return "no change";
  return (v > 0 ? "+" : "-") + Math.abs(v).toFixed(unit === "pts" ? 1 : 1) + (unit ? " " + unit : "");
}

function worldById(id) {
  return WORLDS.find(w => w.id === id);
}

function wallYears(rows) {
  const major = rows.filter(r => r.repl >= 1000).map(r => r.year);
  if (major.length >= 2) return { start: major[0], end: major[1] };
  const first = rows.filter(r => r.repl > 0).map(r => r.year);
  return first.length >= 2 ? { start: first[0], end: first[1] } : { start: 9, end: 10 };
}

function stageFor(year, row, m) {
  if (year <= 5) return "Build phase";
  if (row.repl > 0 && row.build === 0 && year <= 10) return "First replenishment wall";
  if (m.be && year === m.be) return "Breakeven crossing";
  if (year > 10) return "Post-wall recovery";
  return "Revenue ramp";
}

function tagPill(tag) {
  const s = TAG[tag];
  return {
    fontFamily: MONO,
    fontSize: 10,
    fontWeight: 700,
    background: s.bg,
    color: s.fg,
    border: `1px solid ${s.border}`,
    borderRadius: 4,
    padding: "2px 6px",
    whiteSpace: "nowrap",
  };
}

function WorldSelector({ worldId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {WORLDS.map(w => (
        <button
          key={w.id}
          onClick={() => onSelect(w.id)}
          className="px-3 py-1.5 rounded text-xs"
          style={{
            fontFamily: MONO,
            cursor: "pointer",
            background: w.id === worldId ? C.amber : "rgba(202,220,252,0.12)",
            color: w.id === worldId ? C.navy : C.ice,
            fontWeight: w.id === worldId ? 700 : 400,
            border: `1px solid ${w.id === worldId ? C.amber : "rgba(202,220,252,0.25)"}`,
          }}
        >
          {w.id === "BASE" ? "Baseline" : w.id}
        </button>
      ))}
    </div>
  );
}

function Segmented({ value, onChange }) {
  return (
    <div className="inline-flex rounded overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
      {VIEW_MODES.map(m => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className="px-3 py-1.5 text-xs"
          style={{
            fontFamily: MONO,
            cursor: "pointer",
            border: "none",
            background: value === m.id ? C.navy : C.paper,
            color: value === m.id ? "#fff" : C.muted,
            fontWeight: value === m.id ? 700 : 400,
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

function Metric({ label, value, delta, good }) {
  return (
    <div className="rounded px-3 py-2" style={{ background: C.paper, border: `1px solid ${C.line}`, minWidth: 150, flex: "1 1 150px" }}>
      <div className="text-xs uppercase tracking-wider" style={{ color: C.muted, fontWeight: 700 }}>{label}</div>
      <div className="text-2xl" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy, lineHeight: 1.1 }}>{value}</div>
      <div className="text-xs mt-1" style={{ fontFamily: MONO, color: !delta || delta === "baseline" || delta === "no change" ? C.muted : good ? C.good : C.bad }}>
        {delta || "baseline"}
      </div>
    </div>
  );
}

function DriverCard({ id, title, tag, value, sub, body, focus, setFocus, mode }) {
  const path = PATHS[focus] || [];
  const active = path.includes(id);
  const dim = mode === "inside" || (focus !== "overview" && path.length && !active);
  return (
    <button
      onClick={() => setFocus(id)}
      aria-pressed={active}
      className="rounded text-left"
      style={{
        background: active ? TAG[tag].bg : C.paper,
        border: `1px solid ${active ? TAG[tag].border : C.line}`,
        padding: 12,
        minHeight: 122,
        cursor: "pointer",
        opacity: dim ? 0.48 : 1,
        transition: "opacity 140ms ease, background 140ms ease, border-color 140ms ease",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span style={tagPill(tag)}>{tag}</span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>{sub}</span>
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy, fontSize: 17, lineHeight: 1.2 }}>{title}</div>
      <div className="mt-1" style={{ fontFamily: MONO, fontWeight: 700, fontSize: 13, color: active ? TAG[tag].fg : C.ink }}>{value}</div>
      <div className="text-xs mt-1.5" style={{ color: C.muted, lineHeight: 1.45 }}>{body}</div>
    </button>
  );
}

function VentureBlock({ id, title, tag = "D", values, body, focus, setFocus, mode }) {
  const path = PATHS[focus] || [];
  const active = path.includes(id);
  const dim = mode === "outside" || (focus !== "overview" && path.length && !active);
  return (
    <button
      onClick={() => setFocus(id)}
      aria-pressed={active}
      className="rounded text-left"
      style={{
        background: active ? TAG[tag].bg : C.paper,
        border: `1px solid ${active ? TAG[tag].border : C.line}`,
        padding: 14,
        minHeight: 190,
        cursor: "pointer",
        opacity: dim ? 0.48 : 1,
        transition: "opacity 140ms ease, background 140ms ease, border-color 140ms ease",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span style={tagPill(tag)}>{tag}</span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>inside venture</span>
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy, fontSize: 21, lineHeight: 1.2 }}>{title}</div>
      <div className="grid gap-2 mt-3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
        {values.map(v => (
          <div key={v.label} className="rounded px-2 py-1.5" style={{ background: C.card, border: `1px solid ${C.line}` }}>
            <div className="text-xs uppercase tracking-wider" style={{ color: C.muted, fontSize: 10 }}>{v.label}</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, color: v.color || C.ink, fontSize: 13 }}>{v.value}</div>
          </div>
        ))}
      </div>
      <div className="text-xs mt-3" style={{ color: C.muted, lineHeight: 1.5 }}>{body}</div>
    </button>
  );
}

function ModelFlow({ world, run, baseRun, current, selectedYear, focus, setFocus, mode }) {
  const baseCurrent = baseRun.rows[selectedYear - 1];
  const costPerSatM = current.costPerSat * 1000;
  const baseCostPerSatM = baseCurrent.costPerSat * 1000;
  const wall = wallYears(run.rows);
  const wallBill = run.rows.filter(r => r.year >= wall.start && r.year <= wall.end).reduce((s, r) => s + r.repl * r.costPerSat, 0);

  const drivers = [
    {
      id: "launch",
      title: "Launch market",
      tag: "X",
      sub: "P5 + manifest timing",
      value: "$" + world.x.kg.toLocaleString() + "/kg",
      body: `Sets delivered satellite cost (${costPerSatM.toFixed(2)}M/sat, ${fmtDelta(costPerSatM - baseCostPerSatM, "M")} vs baseline) and shifts deployment by ${world.x.dDelay} yr.`,
    },
    {
      id: "demand",
      title: "Sovereign demand",
      tag: "X",
      sub: "P19 + G4",
      value: "revenue x" + world.x.mult.toFixed(2),
      body: `Translates premium, volume, and price pressure into the revenue block. This year revenue is ${fmtB(current.rev)}.`,
    },
    {
      id: "partners",
      title: "Partner behavior",
      tag: "X",
      sub: "P11 + G1",
      value: Math.round(world.x.coinvest * 100) + "% co-invest",
      body: `Controls Samsung's gateway bill. Modeled Samsung gateway capex is ${fmtB(sum(run.rows, "gatewayCapex"))}.`,
    },
    {
      id: "regulation",
      title: "Regulatory access",
      tag: "X",
      sub: "P20 + P22",
      value: world.x.rDelay ? "+" + world.x.rDelay + " yr ramp" : "on ramp",
      body: `Delays move revenue right; hostile pricing pulls the demand block toward the commodity floor.`,
    },
  ];

  return (
    <div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "minmax(260px, 0.95fr) minmax(320px, 1.25fr) minmax(260px, 0.95fr)", alignItems: "stretch" }}>
        <div className="rounded p-3" style={{ background: C.tint, border: `1px solid ${C.line}` }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: C.navy, fontWeight: 700 }}>Outside world model</div>
          <div className="grid gap-2">
            {drivers.map(d => (
              <DriverCard key={d.id} {...d} focus={focus} setFocus={setFocus} mode={mode} />
            ))}
          </div>
        </div>

        <div className="rounded p-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: C.navy, fontWeight: 700 }}>Inside venture model</div>
          <div className="grid gap-3">
            <VentureBlock
              id="deployment"
              title="Deployment and cost block"
              focus={focus}
              setFocus={setFocus}
              mode={mode}
              values={[
                { label: "build", value: current.build.toLocaleString() + " sats" },
                { label: "replacement", value: current.repl.toLocaleString() + " sats", color: current.repl ? C.bad : C.muted },
                { label: "active", value: current.active.toLocaleString() + " sats" },
                { label: "capex", value: fmtB(current.capex), color: current.capex > 2 ? C.bad : C.ink },
              ]}
              body={`Life span is ${P0.lifespan} years. The first major replenishment wall is Y${wall.start}-${wall.end}, costing ${fmtB(wallBill)} in this world.`}
            />
            <VentureBlock
              id="revenue"
              title="Revenue block"
              focus={focus}
              setFocus={setFocus}
              mode={mode}
              values={[
                { label: "revenue", value: fmtB(current.rev) },
                { label: "COGS rate", value: Math.round(current.cogsRate * 100) + "%" },
                { label: "gross cash", value: fmtB(current.gross), color: C.good },
                { label: "opex", value: fmtB(current.opex) },
              ]}
              body="Demand, pricing, the sovereignty premium, commodity pressure, and timing all collapse into this ramp before opex is paid."
            />
          </div>
        </div>

        <div className="rounded p-3" style={{ background: C.navy, border: `1px solid ${C.navy}`, color: "#fff" }}>
          <button
            onClick={() => setFocus("statement")}
            aria-pressed={(PATHS[focus] || []).includes("statement")}
            className="w-full text-left"
            style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", color: "inherit" }}
          >
            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: C.amber, fontWeight: 700 }}>Annual cash statement</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 26, lineHeight: 1.15 }}>Year {selectedYear}</div>
            <div className="mt-2 rounded p-2" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(202,220,252,0.25)" }}>
              <div className="text-xs" style={{ color: C.ice }}>gross cash - opex - capex</div>
              <div style={{ fontFamily: MONO, fontWeight: 700, color: current.fcf >= 0 ? C.good : C.bad, fontSize: 24 }}>
                {fmtB(current.fcf)}
              </div>
              <div className="text-xs" style={{ color: C.ice }}>free cash flow</div>
            </div>
            <div className="grid gap-2 mt-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <MiniStat label="gross" value={fmtB(current.gross)} />
              <MiniStat label="opex" value={fmtB(current.opex)} />
              <MiniStat label="capex" value={fmtB(current.capex)} />
              <MiniStat label="cumulative" value={fmtB(current.cum)} color={current.cum >= 0 ? C.good : C.bad} />
            </div>
          </button>
          <button
            onClick={() => setFocus("metrics")}
            className="mt-3 w-full rounded p-2 text-left"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(202,220,252,0.25)", cursor: "pointer" }}
          >
            <div className="text-xs uppercase tracking-wider" style={{ color: C.amber, fontWeight: 700 }}>Decision metrics</div>
            <div className="text-xs mt-1" style={{ color: C.ice }}>Breakeven {run.m.be ? "Y" + run.m.be : ">15"}; trough {fmtB(run.m.trough)} in Y{run.m.troughYr}; IRR {(run.m.irr * 100).toFixed(1)}%.</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color = C.ice }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider" style={{ color: "rgba(202,220,252,0.75)", fontSize: 10 }}>{label}</div>
      <div style={{ fontFamily: MONO, color, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function YearControl({ selectedYear, setSelectedYear, playing, setPlaying, current, m }) {
  return (
    <div className="rounded p-4 mb-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <button
          onClick={() => setPlaying(!playing)}
          className="px-3 py-1.5 rounded text-xs"
          style={{ fontFamily: MONO, fontWeight: 700, background: playing ? C.bad : C.navy, color: "#fff", border: "none", cursor: "pointer" }}
        >
          {playing ? "Pause" : "Play years"}
        </button>
        <div style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy, fontSize: 22 }}>Year {selectedYear}</div>
        <span className="px-2 py-1 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.tint, color: C.navy }}>
          {stageFor(selectedYear, current, m)}
        </span>
        <div className="ml-auto text-xs" style={{ fontFamily: MONO, color: C.muted }}>
          FCF {fmtB(current.fcf)} · cumulative {fmtB(current.cum)}
        </div>
      </div>
      <input
        aria-label="Select model year"
        type="range"
        min="1"
        max="15"
        value={selectedYear}
        onChange={e => { setPlaying(false); setSelectedYear(Number(e.target.value)); }}
        style={{ width: "100%", accentColor: C.amber }}
      />
      <div className="grid mt-1" style={{ gridTemplateColumns: "repeat(15, 1fr)" }}>
        {Array.from({ length: 15 }, (_, i) => i + 1).map(y => (
          <button
            key={y}
            onClick={() => { setPlaying(false); setSelectedYear(y); }}
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: y === selectedYear ? C.navy : C.muted,
              background: y === selectedYear ? C.amber : "transparent",
              border: "none",
              borderRadius: 4,
              padding: "3px 0",
              cursor: "pointer",
            }}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
}

function CashTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const byKey = Object.fromEntries(payload.map(p => [p.dataKey, p.value]));
  return (
    <div className="rounded p-2" style={{ background: C.paper, border: `1px solid ${C.line}`, fontFamily: MONO, fontSize: 11, color: C.ink }}>
      <div style={{ fontWeight: 700, color: C.navy }}>Year {label}</div>
      <div>build: {(byKey.build || 0).toLocaleString()} sats</div>
      <div>replacement: {(byKey.repl || 0).toLocaleString()} sats</div>
      <div>revenue: {fmtB(byKey.rev || 0)}</div>
      <div>capex: {fmtB(byKey.capex || 0)}</div>
      <div>FCF: {fmtB(byKey.fcf || 0)}</div>
      <div>cumulative: {fmtB(byKey.cum || 0)}</div>
    </div>
  );
}

function CashChart({ rows, m, selectedYear }) {
  const wall = wallYears(rows);
  return (
    <div className="rounded p-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
      <div className="text-xs uppercase tracking-wider mb-1" style={{ color: C.muted, fontWeight: 700 }}>Movement over time</div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <ComposedChart data={rows} margin={{ top: 14, right: 8, bottom: 2, left: 0 }}>
            <CartesianGrid stroke={C.line} strokeDasharray="2 4" />
            <XAxis dataKey="year" tick={{ fontSize: 10, fontFamily: MONO, fill: C.muted }} tickFormatter={v => "Y" + v} />
            <YAxis yAxisId="sats" orientation="left" tick={{ fontSize: 10, fontFamily: MONO, fill: C.muted }} width={42} />
            <YAxis yAxisId="cash" orientation="right" tick={{ fontSize: 10, fontFamily: MONO, fill: C.muted }} width={42} tickFormatter={v => "$" + v} />
            <Tooltip content={<CashTooltip />} />
            <Legend wrapperStyle={{ fontFamily: MONO, fontSize: 11 }} />
            <ReferenceArea yAxisId="cash" x1={7} x2={8} fill={C.amber} fillOpacity={0.12} strokeOpacity={0} />
            <ReferenceArea yAxisId="cash" x1={wall.start} x2={wall.end} fill={C.bad} fillOpacity={0.08} strokeOpacity={0} />
            <ReferenceLine yAxisId="cash" y={0} stroke={C.ink} strokeWidth={1} />
            <ReferenceLine yAxisId="cash" x={selectedYear} stroke={C.navy} strokeWidth={2} />
            <ReferenceLine yAxisId="cash" x={m.troughYr} stroke={C.amber} strokeDasharray="3 3" />
            {m.be && <ReferenceLine yAxisId="cash" x={m.be} stroke={C.good} strokeDasharray="3 3" />}
            <Bar yAxisId="sats" dataKey="build" name="initial build" stackId="launches" fill={C.navy} radius={[3, 3, 0, 0]} maxBarSize={34} />
            <Bar yAxisId="sats" dataKey="repl" name="replacement" stackId="launches" fill={C.bad} radius={[3, 3, 0, 0]} maxBarSize={34} />
            <Line yAxisId="cash" type="monotone" dataKey="rev" name="revenue" stroke={C.good} strokeWidth={1.5} dot={false} strokeDasharray="5 4" />
            <Line yAxisId="cash" type="monotone" dataKey="cum" name="cumulative cash" stroke={C.amber} strokeWidth={2.5} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="grid gap-2 mt-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <InfoStrip label="Memo claim window" value="Y7-8" body="Amber band: the memo's claimed cash breakeven window." />
        <InfoStrip label="First replacement wall" value={`Y${wall.start}-${wall.end}`} body="Red band: the first large replacement cycle after the build." bad />
        <InfoStrip label="Computed crossing" value={m.be ? "Y" + m.be : ">15"} body={`Trough ${fmtB(m.trough)} in Y${m.troughYr}.`} good={!!m.be} />
      </div>
    </div>
  );
}

function InfoStrip({ label, value, body, bad, good }) {
  const col = bad ? C.bad : good ? C.good : C.amber;
  return (
    <div className="rounded p-2" style={{ background: bad ? "rgba(178,58,72,0.08)" : good ? "rgba(46,125,91,0.08)" : "rgba(232,163,61,0.10)", border: `1px solid ${col}` }}>
      <div className="text-xs" style={{ fontFamily: MONO, fontWeight: 700, color: col }}>{label}: {value}</div>
      <div className="text-xs" style={{ color: C.muted, lineHeight: 1.4 }}>{body}</div>
    </div>
  );
}

function PathLegend({ focus }) {
  const path = PATHS[focus] || [];
  const names = {
    launch: "Launch market",
    demand: "Sovereign demand",
    partners: "Partner behavior",
    regulation: "Regulatory access",
    deployment: "Deployment and cost",
    revenue: "Revenue",
    statement: "Annual cash statement",
    metrics: "Metrics",
  };

  if (focus === "overview" || path.length === 0) {
    return (
      <div className="rounded p-3" style={{ background: C.tint, border: `1px solid ${C.line}` }}>
        <div className="text-xs uppercase tracking-wider mb-1" style={{ color: C.muted, fontWeight: 700 }}>Selected causal path</div>
        <div className="text-xs" style={{ color: C.muted, lineHeight: 1.5 }}>
          Click an outside driver or inside venture block to trace what it moves.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded p-3" style={{ background: C.tint, border: `1px solid ${C.line}` }}>
      <div className="text-xs uppercase tracking-wider mb-2" style={{ color: C.muted, fontWeight: 700 }}>Selected causal path</div>
      <div className="flex flex-wrap items-center gap-2">
        {path.map((id, i) => (
          <span key={id} className="flex items-center gap-2">
            <span className="rounded px-2 py-1 text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.paper, color: C.navy, border: `1px solid ${C.line}` }}>{names[id]}</span>
            {i < path.length - 1 && <span style={{ color: C.amber, fontWeight: 700 }}>-&gt;</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function AnnualTable({ rows, selectedYear }) {
  return (
    <div className="overflow-x-auto">
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ ...th, position: "sticky", left: 0, zIndex: 2 }}>Row</th>
            {rows.map(r => <th key={r.year} style={{ ...th, textAlign: "right", color: r.year === selectedYear ? C.amber : "#fff" }}>Y{r.year}</th>)}
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map(row => (
            <tr key={row.key} style={row.strong ? { background: C.tint } : undefined}>
              <td style={{ ...td, position: "sticky", left: 0, background: row.strong ? C.tint : C.card, zIndex: 1, fontWeight: row.strong ? 700 : 500, whiteSpace: "nowrap" }}>{row.label}</td>
              {rows.map(r => {
                const v = r[row.key];
                const value = row.int ? v.toLocaleString() : fmtPlain(v);
                const selected = r.year === selectedYear;
                const color = row.key === "cum" ? (v < 0 ? C.bad : C.good) : C.ink;
                return (
                  <td key={r.year} style={{ ...tdMono, textAlign: "right", color, fontWeight: selected || row.strong ? 700 : 400, background: selected ? "rgba(232,163,61,0.10)" : undefined }}>
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CashFlow() {
  const [worldId, setWorldId] = useState("BASE");
  const [selectedYear, setSelectedYear] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [focus, setFocus] = useState("overview");
  const [mode, setMode] = useState("all");

  useEffect(() => {
    if (!playing) return undefined;
    const t = window.setInterval(() => {
      setSelectedYear(y => (y >= 15 ? 1 : y + 1));
    }, 850);
    return () => window.clearInterval(t);
  }, [playing]);

  const runs = useMemo(() => Object.fromEntries(WORLDS.map(w => [w.id, runWorld(w.x)])), []);
  const world = worldById(worldId);
  const run = runs[worldId];
  const baseRun = runs.BASE;
  const current = run.rows[selectedYear - 1];
  const verdict = verdictOf(run.m, C);

  const beDelta = run.m.be && baseRun.m.be ? run.m.be - baseRun.m.be : null;
  const troughDelta = run.m.trough - baseRun.m.trough;
  const irrDelta = (run.m.irr - baseRun.m.irr) * 100;
  const revDelta = run.m.y10rev - baseRun.m.y10rev;

  return (
    <div>
      <PageHead
        kicker="Step 3 · Model — outside world, inside venture"
        title="The cash-flow model as two linked machines"
        sub="The outside world sets launch, demand, partners, and regulation. The inside venture converts those conditions into deployment costs and revenue, then the annual cash statement shows the consequences year by year."
      />

      <div style={{ background: C.navy }} className="px-4 py-3 rounded-lg mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider" style={{ color: C.amber, fontWeight: 700 }}>World input</div>
          <div className="text-xs" style={{ color: C.ice }}>Pick the outside conditions. Use the year control to watch the inside venture move.</div>
        </div>
        <WorldSelector worldId={worldId} onSelect={id => { setWorldId(id); setPlaying(false); }} />
      </div>

      <YearControl selectedYear={selectedYear} setSelectedYear={setSelectedYear} playing={playing} setPlaying={setPlaying} current={current} m={run.m} />

      <Section
        title="The model"
        right={<Segmented value={mode} onChange={setMode} />}
      >
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy, fontSize: 18 }}>{world.name}</span>
          <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, color: "#fff", background: verdict.color }}>
            {verdict.v}{verdict.boundary ? " boundary" : ""}
          </span>
          <span className="text-xs" style={{ fontFamily: MONO, color: C.muted }}>selected year: Y{selectedYear}</span>
        </div>

        <ModelFlow
          world={world}
          run={run}
          baseRun={baseRun}
          current={current}
          selectedYear={selectedYear}
          focus={focus}
          setFocus={setFocus}
          mode={mode}
        />

        <div className="mt-3">
          <PathLegend focus={focus} />
        </div>
        <Note>
          Use Outside world mode to inspect external drivers; use Inside venture mode to inspect the deployment/cost and revenue blocks. The statement and metrics are always computed by the same engine.
        </Note>
      </Section>

      <div className="flex flex-wrap gap-2 mb-4">
        <Metric
          label="Breakeven"
          value={run.m.be ? "Year " + run.m.be : ">15 yrs"}
          delta={worldId === "BASE" ? "baseline" : beDelta == null ? "never" : (beDelta > 0 ? "+" : "") + beDelta + " yrs"}
          good={beDelta != null && beDelta <= 0}
        />
        <Metric
          label="Cash trough"
          value={fmtB(run.m.trough)}
          delta={worldId === "BASE" ? "baseline" : fmtDelta(troughDelta, "$B")}
          good={troughDelta > 0}
        />
        <Metric
          label="IRR"
          value={(run.m.irr * 100).toFixed(1) + "%"}
          delta={worldId === "BASE" ? "baseline" : fmtDelta(irrDelta, "pts")}
          good={irrDelta > 0}
        />
        <Metric
          label="Y10 revenue"
          value={fmtB(run.m.y10rev)}
          delta={worldId === "BASE" ? "baseline" : fmtDelta(revDelta, "$B")}
          good={revDelta > 0}
        />
      </div>

      <CashChart rows={run.rows} m={run.m} selectedYear={selectedYear} />

      <Section title="Annual cash statement — values in $B unless noted">
        <AnnualTable rows={run.rows} selectedYear={selectedYear} />
        <Note>
          This is the same engine output used by Worlds and Regret, with extra breakdown fields exposed so the model can be audited.
        </Note>
      </Section>
    </div>
  );
}
