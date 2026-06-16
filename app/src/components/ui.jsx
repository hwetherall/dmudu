import { C, MONO, SERIF } from "../theme.js";

export function Section({ title, right, children, className = "" }) {
  return (
    <div className={`rounded-lg mb-4 ${className}`} style={{ background: C.card, border: `1px solid ${C.line}`, padding: 20 }}>
      {(title || right) && (
        <div className="flex items-center justify-between gap-3 flex-wrap" style={{ marginBottom: 14 }}>
          <div className="uppercase" style={{ fontSize: 11, letterSpacing: "0.08em", color: C.muted, fontWeight: 700 }}>{title}</div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function PageHead({ kicker, title, sub }) {
  return (
    <div className="mb-6">
      {kicker && <div className="uppercase" style={{ fontSize: 11, letterSpacing: "0.08em", color: C.amber, fontWeight: 700, marginBottom: 6 }}>{kicker}</div>}
      <div style={{ fontFamily: SERIF, color: C.navy, fontWeight: 700, fontSize: 28, lineHeight: 1.2 }}>{title}</div>
      {sub && <div className="text-sm mt-2" style={{ color: C.muted, maxWidth: 880, lineHeight: 1.55 }}>{sub}</div>}
    </div>
  );
}

const TAG_STYLE = {
  X: { bg: "rgba(232,163,61,0.18)", border: C.amber, color: "#7A5413", label: "X · world-owned" },
  L: { bg: "rgba(26,34,56,0.10)", border: C.navy, color: C.navy, label: "L · Samsung-owned" },
  D: { bg: C.tint, border: C.line, color: C.muted, label: "D · derived" },
  GAP: { bg: "rgba(178,58,72,0.12)", border: C.bad, color: C.bad, label: "GAP · declared" },
};

export function Tag({ tag, short = true }) {
  const s = TAG_STYLE[tag];
  return (
    <span className="px-1.5 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: s.bg, border: `1px solid ${s.border}`, color: s.color, whiteSpace: "nowrap" }}>
      {short ? tag : s.label}
    </span>
  );
}

export function TagLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(TAG_STYLE).map(t => <Tag key={t} tag={t} short={false} />)}
    </div>
  );
}

export function Pill({ children, color = C.navy, fg = "#fff" }) {
  return (
    <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: color, color: fg, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

export function Note({ children }) {
  return <div className="text-xs mt-3 italic" style={{ color: C.muted, lineHeight: 1.5 }}>{children}</div>;
}

export const th = { background: C.navy, color: "#fff", fontFamily: MONO, fontSize: 10, padding: "6px 8px", textAlign: "left", whiteSpace: "nowrap" };
export const td = { fontSize: 12, color: C.ink, padding: "6px 8px", borderBottom: `1px solid ${C.line}`, verticalAlign: "top", lineHeight: 1.45 };
export const tdMono = { ...td, fontFamily: MONO, fontSize: 11, whiteSpace: "nowrap" };
