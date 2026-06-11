import { C, MONO, SERIF } from "../theme.js";

export function Section({ title, right, children, className = "" }) {
  return (
    <div className={`rounded-lg p-4 mb-4 ${className}`} style={{ background: C.card, border: `1px solid ${C.line}` }}>
      {(title || right) && (
        <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
          <div className="text-xs uppercase tracking-wider" style={{ color: C.muted, fontWeight: 700 }}>{title}</div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function PageHead({ kicker, title, sub }) {
  return (
    <div className="mb-4">
      {kicker && <div className="text-xs uppercase tracking-wider mb-1" style={{ color: C.amber, fontWeight: 700 }}>{kicker}</div>}
      <div className="text-2xl" style={{ fontFamily: SERIF, color: C.navy, fontWeight: 700 }}>{title}</div>
      {sub && <div className="text-sm mt-1" style={{ color: C.muted, maxWidth: 880, lineHeight: 1.55 }}>{sub}</div>}
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
  return <div className="text-xs mt-2 italic" style={{ color: C.muted, lineHeight: 1.5 }}>{children}</div>;
}

export const th = { background: C.navy, color: "#fff", fontFamily: MONO, fontSize: 10, padding: "6px 8px", textAlign: "left", whiteSpace: "nowrap" };
export const td = { fontSize: 12, color: C.ink, padding: "6px 8px", borderBottom: `1px solid ${C.line}`, verticalAlign: "top", lineHeight: 1.45 };
export const tdMono = { ...td, fontFamily: MONO, fontSize: 11, whiteSpace: "nowrap" };
