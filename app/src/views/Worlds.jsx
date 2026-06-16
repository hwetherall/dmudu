import { useState, useMemo, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend, ResponsiveContainer } from "recharts";
import { C, MONO, SERIF } from "../theme.js";
import { PageHead, Section, Note } from "../components/ui.jsx";
import { P0, DEPLOY, REVENUE, run, metrics, verdictOf, runWorld } from "../engine.js";
import { WORLDS, AXES } from "../data/worlds.js";

/* ── the 2×2 worlds matrix ────────────────────────────────────────────── */

const QUAD_BLURB = {
  W1: "A real premium, paid for at a top-of-range structural tax — the race run in slow motion.",
  W2: "The plan's dream quadrant: the premium holds and launch commoditizes.",
  W3: "Full tax, no premium — the thesis fails on both ends at once.",
  W4: "Cheap launch for everyone, premium for no one. Capacity becomes a commodity.",
};

// One talk-over line per world for the present-mode beats — distilled from each world's verdictNote.
const WORLD_SUPPORT = {
  W1: "IRR lands on the 5% boundary — reported as a boundary, not nudged. What it asks for: a smaller, slower constellation.",
  W2: "The one world where the plan as written is the right answer. As written, the plan is a wager on this quadrant.",
  W3: "−$12.4B, the deepest hole on the board — but it dies detectably: a license event, years before the cash proves it.",
  W4: "Same verdict as W3, opposite shape — a slow margin bleed. The response isn't a better constellation; it's not being one.",
};

/* ── present-mode scaffolding (mirrors the Uncertainty page) ──────────────── */

const PBEAT_BIG = { fontFamily: SERIF, fontWeight: 700, color: C.navy, fontSize: "clamp(30px,4.6vw,58px)", lineHeight: 1.14, letterSpacing: "-0.01em", margin: 0 };
const PBEAT_SUB = { fontFamily: SERIF, color: C.muted, fontSize: "clamp(17px,2.05vw,24px)", lineHeight: 1.55, margin: 0 };
const PBEAT_KICK = { fontFamily: MONO, fontWeight: 700, fontSize: "clamp(12px,1.15vw,15px)", textTransform: "uppercase", letterSpacing: 2, color: C.amber };
const PBTN_NAVY = { fontFamily: MONO, fontWeight: 700, fontSize: "clamp(14px,1.5vw,18px)", background: C.navy, color: "#fff", border: "none", borderRadius: 8, padding: "14px 26px", cursor: "pointer" };
const PBTN_GHOST = { ...PBTN_NAVY, background: C.paper, color: C.navy, border: `1px solid ${C.line}` };

const PRESENT_CSS = `
@keyframes wldBeatIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.present-beat { animation: wldBeatIn 170ms ease-out; }
@media print { .present-overlay, .wld-mode-toggle { display: none !important; } }
`;

function ModeToggle({ isPresent, onRead, onPresent }) {
  const base = { fontFamily: MONO, fontWeight: 700, fontSize: 12, padding: "6px 16px", border: "none", cursor: "pointer", lineHeight: 1.4 };
  return (
    <div
      className="wld-mode-toggle"
      onClick={(e) => e.stopPropagation()}
      style={{ display: "inline-flex", borderRadius: 999, overflow: "hidden", border: `1px solid ${C.line}`, background: C.paper }}
    >
      <button onClick={(e) => { e.currentTarget.blur(); onRead(); }} style={{ ...base, background: isPresent ? C.paper : C.navy, color: isPresent ? C.muted : "#fff" }}>Read</button>
      <button onClick={(e) => { e.currentTarget.blur(); onPresent(); }} style={{ ...base, background: isPresent ? C.navy : C.paper, color: isPresent ? "#fff" : C.muted }}>Present</button>
    </div>
  );
}

// A large verdict pill, colored live by the engine's THRIVE/REWORK/DIE call.
function VerdictPill({ verdict, big }) {
  return (
    <span style={{
      display: "inline-block", fontFamily: MONO, fontWeight: 700, letterSpacing: 1,
      fontSize: big ? "clamp(14px,1.5vw,18px)" : "clamp(11px,1.1vw,13px)",
      background: verdict.color, color: "#fff", padding: big ? "8px 18px" : "3px 9px", borderRadius: big ? 8 : 5,
    }}>
      {verdict.v}{verdict.boundary ? (big ? " · boundary" : " ·b") : ""}
    </span>
  );
}

function AxisCard({ axis }) {
  return (
    <div className="rounded-lg p-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
      <div className="text-sm" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>{axis.title}</div>
      <div className="text-xs mt-0.5 mb-1.5" style={{ color: C.ink, lineHeight: 1.5 }}>{axis.question}</div>
      <div className="flex flex-col gap-1 mb-1.5">
        {Object.values(axis.poles).map(p => (
          <div key={p.name} className="text-xs flex gap-1.5" style={{ color: C.muted, lineHeight: 1.5 }}>
            <span className="px-1.5 rounded" style={{ fontFamily: MONO, fontWeight: 700, background: C.tint, color: C.navy, whiteSpace: "nowrap", height: "fit-content" }}>{p.name}</span>
            <span>{p.desc}</span>
          </div>
        ))}
      </div>
      <div className="text-xs" style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>{axis.dials}</div>
      <div className="text-xs mt-1.5 pt-1.5 italic" style={{ color: C.muted, lineHeight: 1.5, borderTop: `1px solid ${C.line}` }}>{axis.why}</div>
    </div>
  );
}

function Quadrant({ w, verdict, selected, onSelect }) {
  const x = w.x;
  return (
    <button onClick={() => onSelect(w.id)} className="rounded-lg p-3 text-left flex flex-col gap-1" style={{
      background: selected ? "rgba(232,163,61,0.10)" : C.card,
      border: `2px solid ${selected ? C.amber : C.line}`,
      cursor: "pointer", minWidth: 0,
    }}>
      <div className="flex items-center gap-2">
        <span style={{ fontFamily: MONO, fontWeight: 700, color: C.navy }}>{w.id}</span>
        <span className="text-sm" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>{w.name.split(" · ")[1]}</span>
        <span className="ml-auto px-1.5 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: verdict.color, color: "#fff" }}>
          {verdict.v}{verdict.boundary ? " ·b" : ""}
        </span>
      </div>
      <div className="text-xs" style={{ color: C.muted, lineHeight: 1.5 }}>{QUAD_BLURB[w.id]}</div>
      <div className="text-xs mt-auto" style={{ fontFamily: MONO, fontSize: 10, color: C.ink }}>
        ${x.kg.toLocaleString()}/kg · co-inv {Math.round(x.coinvest * 100)}% · rev ×{x.mult.toFixed(2)}{x.dDelay ? " · +1 yr" : ""}
      </div>
    </button>
  );
}

function WorldMatrix({ selected, onSelect }) {
  const verdicts = useMemo(() => Object.fromEntries(
    WORLDS.filter(w => w.id !== "BASE").map(w => [w.id, verdictOf(runWorld(w.x).m, C)])
  ), []);
  const byId = id => WORLDS.find(w => w.id === id);
  const vert = { writingMode: "vertical-rl", transform: "rotate(180deg)" };
  const colHead = { fontFamily: MONO, fontSize: 14, fontWeight: 700, color: C.navy, textAlign: "center", background: C.tint, borderRadius: 6, padding: "7px 4px", border: `1px solid ${C.line}` };
  const rowHead = { ...vert, fontFamily: MONO, fontSize: 14, fontWeight: 700, color: C.navy, textAlign: "center", alignSelf: "stretch", background: C.tint, borderRadius: 6, padding: "4px 7px", border: `1px solid ${C.line}` };
  const sub = { fontWeight: 400, fontSize: 11, color: C.muted };

  return (
    <div className="relative">
      <div className="grid gap-1.5" style={{ gridTemplateColumns: "auto auto minmax(0,1fr) minmax(0,1fr)", gridTemplateRows: "auto auto 1fr 1fr" }}>
        {/* row 1 — x-axis title */}
        <div style={{ gridColumn: "1 / 3", gridRow: 1 }} />
        <div className="text-center uppercase" style={{ gridColumn: "3 / 5", gridRow: 1, fontSize: 13, letterSpacing: "0.08em", color: C.navy, fontWeight: 700, paddingBottom: 2 }}>
          demand for sovereign infrastructure →
        </div>
        {/* row 2 — column pole headers */}
        <div style={{ gridColumn: "1 / 3", gridRow: 2 }} />
        <div style={{ ...colHead, gridColumn: 3, gridRow: 2 }}>FRAGMENTED <span style={sub}>· premium holds</span></div>
        <div style={{ ...colHead, gridColumn: 4, gridRow: 2 }}>NORMALIZED <span style={sub}>· premium collapses</span></div>
        {/* col 1 — y-axis title */}
        <div className="uppercase" style={{ ...vert, gridColumn: 1, gridRow: "3 / 5", fontSize: 13, letterSpacing: "0.08em", color: C.navy, fontWeight: 700, textAlign: "center", paddingRight: 2, alignSelf: "stretch" }}>
          ← launch access
        </div>
        {/* rows 3–4 — pole headers + quadrants */}
        <div style={{ ...rowHead, gridColumn: 2, gridRow: 3 }}>SCARCE <span style={sub}>· $2,400/kg</span></div>
        <Quadrant w={byId("W1")} verdict={verdicts.W1} selected={selected === "W1"} onSelect={onSelect} />
        <Quadrant w={byId("W3")} verdict={verdicts.W3} selected={selected === "W3"} onSelect={onSelect} />
        <div style={{ ...rowHead, gridColumn: 2, gridRow: 4 }}>ABUNDANT <span style={sub}>· $1,200/kg</span></div>
        <Quadrant w={byId("W2")} verdict={verdicts.W2} selected={selected === "W2"} onSelect={onSelect} />
        <Quadrant w={byId("W4")} verdict={verdicts.W4} selected={selected === "W4"} onSelect={onSelect} />
      </div>
      <div className="absolute" style={{ left: "calc(50% + 28px)", top: "calc(50% + 38px)", transform: "translate(-50%, -50%)", zIndex: 2 }}>
        <button onClick={() => onSelect("BASE")} className="px-2 py-1 rounded-full text-xs" style={{
          fontFamily: MONO, fontWeight: 700, cursor: "pointer",
          background: selected === "BASE" ? C.amber : C.navy, color: selected === "BASE" ? C.navy : "#fff",
          border: `2px solid ${C.paper}`, boxShadow: "0 1px 4px rgba(26,34,56,0.35)", whiteSpace: "nowrap",
        }}>
          ◉ baseline
        </button>
      </div>
    </div>
  );
}

const fmtB = v => (Math.abs(v) < 0.005 ? "0.00" : v.toFixed(2));
const fmtD = v => (Math.abs(v) < 0.005 ? "·" : (v > 0 ? "+" : "−") + Math.abs(v).toFixed(2));
const fmtDi = v => (v === 0 ? "·" : (v > 0 ? "+" : "−") + Math.abs(v));

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

export default function Worlds({ go }) {
  const [worldId, setWorldId] = useState("W3");
  const [mode, setMode] = useState("values"); // 'values' | 'delta'
  const [isPresent, setIsPresent] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);

  const baseRows = useMemo(() => run(P0, DEPLOY, REVENUE, 0), []);
  const baseM = useMemo(() => metrics(baseRows), [baseRows]);

  // Live verdicts for all four worlds (same call the matrix uses) — drives the present beats.
  const verdicts = useMemo(() => Object.fromEntries(
    WORLDS.filter(w => w.id !== "BASE").map(w => [w.id, verdictOf(runWorld(w.x).m, C)])
  ), []);
  const worldsList = useMemo(() => WORLDS.filter(w => w.id !== "BASE"), []);

  const enterPresent = () => { setBeatIndex(0); setIsPresent(true); };
  const exitPresent = () => setIsPresent(false);

  // ── present-mode beat sequence: why we build worlds, then the four worlds ──
  const beats = [
    // 1 · Hook — why bound, not forecast
    (
      <div style={{ textAlign: "center" }}>
        <div style={PBEAT_BIG}>Past the wall, you can't forecast. So you bound the future instead.</div>
        <p style={{ ...PBEAT_SUB, maxWidth: 880, margin: "30px auto 0" }}>
          Level 3 hands you a few plausible futures and no honest odds. The move isn't to predict which one arrives —{" "}
          <span style={{ color: C.navy, fontWeight: 700 }}>it's to find the decision that survives all of them.</span>
        </p>
      </div>
    ),
    // 2 · The two axes the verdict turns on
    (
      <div>
        <div style={{ ...PBEAT_KICK, textAlign: "center", marginBottom: 30 }}>the two questions the verdict turns on</div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[AXES.demand, AXES.launch].map((axis) => (
            <div key={axis.title} style={{ flex: 1, minWidth: 280, background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "clamp(20px,2.4vw,34px)" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(20px,2.2vw,28px)", color: C.navy, lineHeight: 1.2 }}>{axis.title}</div>
              <div style={{ fontFamily: SERIF, fontSize: "clamp(15px,1.6vw,20px)", color: C.muted, lineHeight: 1.5, marginTop: 12 }}>{axis.question}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
                {Object.values(axis.poles).map((p) => (
                  <span key={p.name} style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(12px,1.2vw,15px)", background: C.tint, color: C.navy, border: `1px solid ${C.line}`, padding: "7px 14px", borderRadius: 6 }}>{p.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...PBEAT_SUB, fontSize: "clamp(15px,1.7vw,20px)", textAlign: "center", maxWidth: 940, margin: "30px auto 0" }}>
          Of every unknown in the memo, only these two: no Phase-1 study resolves them, both are decided by other actors over years, and both surface early — license events and manifest prices.
        </p>
      </div>
    ),
    // 3 · Cross them → four worlds (2×2 at a glance)
    (
      <div>
        <div style={{ ...PBEAT_KICK, textAlign: "center", marginBottom: 26 }}>two axes, two poles each</div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gridTemplateRows: "auto 1fr 1fr", gap: 12 }}>
          <div />
          <div style={{ textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: "clamp(12px,1.2vw,15px)", color: C.navy }}>FRAGMENTED<div style={{ fontWeight: 400, fontSize: 11, color: C.muted }}>premium holds</div></div>
          <div style={{ textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: "clamp(12px,1.2vw,15px)", color: C.navy }}>NORMALIZED<div style={{ fontWeight: 400, fontSize: 11, color: C.muted }}>premium collapses</div></div>
          {[
            { row: "SCARCE", sub: "$2,400/kg", ids: ["W1", "W3"] },
            { row: "ABUNDANT", sub: "$1,200/kg", ids: ["W2", "W4"] },
          ].map((r) => [
            <div key={r.row} style={{ display: "flex", flexDirection: "column", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: "clamp(12px,1.2vw,15px)", color: C.navy }}>{r.row}<span style={{ fontWeight: 400, fontSize: 11, color: C.muted }}>{r.sub}</span></div>,
            ...r.ids.map((id) => {
              const w = worldsList.find((x) => x.id === id);
              const v = verdicts[id];
              return (
                <div key={id} style={{ background: C.card, border: `1px solid ${C.line}`, borderLeft: `5px solid ${v.color}`, borderRadius: 10, padding: "clamp(12px,1.5vw,20px)", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(13px,1.3vw,17px)", color: C.navy }}>{id}</span>
                    <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(14px,1.5vw,20px)", color: C.navy }}>{w.name.split(" · ")[1]}</span>
                    <span style={{ marginLeft: "auto" }}><VerdictPill verdict={v} /></span>
                  </div>
                </div>
              );
            }),
          ])}
        </div>
        <p style={{ ...PBEAT_SUB, fontSize: "clamp(16px,1.9vw,24px)", color: C.navy, textAlign: "center", maxWidth: 960, margin: "30px auto 0" }}>
          Four futures. The plan must survive all four — or we instrument the ones it doesn't.
        </p>
      </div>
    ),
    // 4–7 · the four worlds, one beat each — the full description, then the takeaway
    ...worldsList.map((w) => (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_KICK, color: verdicts[w.id].color, marginBottom: 18 }}>{w.tag}</div>
        <div style={{ ...PBEAT_BIG, fontSize: "clamp(30px,4vw,52px)" }}>{w.name}</div>
        <div style={{ marginTop: 22 }}><VerdictPill verdict={verdicts[w.id]} big /></div>
        <p style={{ ...PBEAT_SUB, fontSize: "clamp(17px,1.95vw,24px)", color: C.ink, maxWidth: 940, margin: "30px auto 0" }}>{w.story}</p>
        <p style={{ ...PBEAT_SUB, fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(15px,1.7vw,21px)", color: C.navy, maxWidth: 820, margin: "26px auto 0", paddingTop: 24, borderTop: `1px solid ${C.line}` }}>{WORLD_SUPPORT[w.id]}</p>
      </div>
    )),
    // 8 · Close / handoff
    (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_BIG, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>Four futures, one engine — every cell computed live.</div>
        <p style={{ ...PBEAT_SUB, maxWidth: 820, margin: "26px auto 0" }}>
          Pick a world and watch the same plan regrade. Then see how four verdicts become one decision.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 40 }}>
          <button onClick={(e) => { e.stopPropagation(); exitPresent(); }} style={PBTN_NAVY}>explore the worlds →</button>
          <button onClick={(e) => { e.stopPropagation(); go("strategies"); }} style={PBTN_GHOST}>the strategies →</button>
          <button onClick={(e) => { e.stopPropagation(); go("regret"); }} style={PBTN_GHOST}>the regret table →</button>
        </div>
      </div>
    ),
  ];

  const beatCount = beats.length;

  useEffect(() => {
    if (!isPresent) return;
    function onKey(e) {
      if (e.key === "Escape") { setIsPresent(false); return; }
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setBeatIndex((i) => Math.min(i + 1, beatCount - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setBeatIndex((i) => Math.max(i - 1, 0));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPresent, beatCount]);

  function handleZoneClick(e) {
    const x = e.clientX / window.innerWidth;
    if (x >= 0.4) setBeatIndex((i) => Math.min(i + 1, beatCount - 1));
    else if (x <= 0.2) setBeatIndex((i) => Math.max(i - 1, 0));
  }

  const world = WORLDS.find(w => w.id === worldId);
  const { rows, m } = useMemo(() => runWorld(world.x), [worldId]);

  const isBase = worldId === "BASE";
  const verdict = verdictOf(m, C);
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
    <div>
      <style>{PRESENT_CSS}</style>

      <div className="flex justify-end mb-3">
        <ModeToggle isPresent={isPresent} onRead={exitPresent} onPresent={enterPresent} />
      </div>

      <PageHead
        kicker="Step 4 · Worlds & verdicts — the model, literally"
        title="Samsung LEO cash engine, regraded per world"
        sub="Same ~200 lines, same levers — only the world changes. Every figure on this page is computed live in your browser by the engine ported line-for-line from model.py; nothing is pasted."
      />

      <Section title="The two axes — and the four worlds they span">
        <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <AxisCard axis={AXES.demand} />
          <AxisCard axis={AXES.launch} />
        </div>
        <WorldMatrix selected={worldId} onSelect={setWorldId} />
        <Note>
          Why these two, out of all the X-dials? They are the uncertainties the verdict provably turns on, no Phase-1 study can resolve either
          (both are decided by other actors, over years), and both are observable early — license events and manifest prices — which is exactly what the
          Pathway tab instruments. The remaining X-dials ride along inside each world's vector. Click a quadrant to run it.
        </Note>
      </Section>

      {/* ── world selector band ── */}
      <div style={{ background: C.navy }} className="px-4 py-3 rounded-lg mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs" style={{ color: C.ice }}>
          Pick a world — worlds may touch only exogenous dials (X); the plan's levers (L) are untouched.
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

      {/* ── 1 · WORLD SUMMARY ── */}
      <div className="rounded-lg p-5 mb-4" style={{ background: C.card, border: `1px solid ${C.line}`, borderLeftWidth: 5, borderLeftColor: verdict.color }}>
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
          Shows Samsung's plan-as-written (S1) regraded per world; the strategy alternatives live on the Strategies tab.
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

      {/* ── Present-mode overlay — why we build worlds, then the four worlds ── */}
      {isPresent && (
        <div
          className="present-overlay"
          onClick={handleZoneClick}
          style={{ position: "fixed", inset: 0, zIndex: 9000, background: C.paper, overflow: "hidden", userSelect: "none", cursor: "default" }}
        >
          <div style={{ position: "absolute", top: 20, left: 26, zIndex: 3, fontFamily: MONO, fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: 0.5 }}>
            Samsung LEO · Worlds
          </div>
          <div style={{ position: "absolute", top: 16, right: 20, zIndex: 3 }}>
            <ModeToggle isPresent={isPresent} onRead={exitPresent} onPresent={enterPresent} />
          </div>

          <div
            key={beatIndex}
            className="present-beat"
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "78px clamp(24px,5vw,96px) 96px", boxSizing: "border-box" }}
          >
            <div style={{ width: "100%", maxWidth: 1120 }}>{beats[beatIndex]}</div>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "absolute", bottom: 24, left: 0, right: 0, zIndex: 3, display: "flex", justifyContent: "center", gap: 10 }}
          >
            {beats.map((_, i) => {
              const current = i === beatIndex;
              const seen = i < beatIndex;
              const size = current ? 13 : 9;
              return (
                <button
                  key={i}
                  onClick={() => setBeatIndex(i)}
                  aria-label={`Go to beat ${i + 1}`}
                  style={{
                    width: size, height: size, padding: 0, borderRadius: 999, cursor: "pointer",
                    background: current ? C.amber : seen ? C.navy : "transparent",
                    border: `1px solid ${current ? C.amber : seen ? C.navy : C.line}`,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
