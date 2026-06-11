import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Note } from "../components/ui.jsx";
import { STRATEGIES, WORLD_IDS, WORLD_SHORT, NPV, bestInWorld, maxRegret, minimaxStrategy } from "../data/matrix.js";

const ARCHETYPES = [
  { id: "S1", label: "build it all" },
  { id: "S2", label: "shrink it" },
  { id: "S3", label: "change the product" },
  { id: "S4", label: "sell shovels" },
  { id: "S5", label: "walk away" },
];

function CommitmentSpectrum() {
  return (
    <div>
      {/* the axis itself — two labeled poles, a gradient running between them */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="rounded-lg px-3 py-2 text-center" style={{ background: C.navy }}>
          <span className="block uppercase" style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>maximum commitment</span>
          <span className="block" style={{ fontFamily: MONO, fontSize: 10, color: C.ice, whiteSpace: "nowrap" }}>$10–12B · full launch exposure</span>
        </div>
        <div className="flex-1 relative" style={{ minWidth: 60 }}>
          <div style={{ height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${C.navy}, ${C.line})` }} />
          <span className="absolute" style={{ right: -4, top: -7, color: C.muted, fontWeight: 700 }}>→</span>
        </div>
        <div className="rounded-lg px-3 py-2 text-center" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <span className="block uppercase" style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.navy, letterSpacing: "0.05em", whiteSpace: "nowrap" }}>zero commitment</span>
          <span className="block" style={{ fontFamily: MONO, fontSize: 10, color: C.muted, whiteSpace: "nowrap" }}>no operator role</span>
        </div>
      </div>
      {/* the five candidates, placed along it */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {ARCHETYPES.map((a, i) => {
          const s = STRATEGIES.find(st => st.id === a.id);
          return (
            <span key={a.id} className="flex items-center gap-1.5 flex-1" style={{ minWidth: "fit-content" }}>
              <span className="rounded-lg px-2.5 py-1.5 text-center flex-1" style={{ background: C.navy, border: `1px solid ${C.navy}` }}>
                <span className="block text-xs" style={{ fontFamily: MONO, fontWeight: 700, color: C.amber, whiteSpace: "nowrap" }}>{a.id} · {s.name}</span>
                <span className="block text-xs" style={{ fontFamily: MONO, fontSize: 10, color: C.ice, whiteSpace: "nowrap" }}>{a.label}</span>
              </span>
              {i < ARCHETYPES.length - 1 && <span style={{ color: C.amber, fontWeight: 700 }}>→</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function NpvStrip({ sid }) {
  const mr = maxRegret(sid);
  return (
    <div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {WORLD_IDS.map(w => {
          const npv = NPV[sid][w];
          const best = npv === bestInWorld(w);
          return (
            <div key={w} className="rounded px-2 py-1.5" style={{
              background: npv >= 0 ? "rgba(46,125,91,0.08)" : "rgba(178,58,72,0.08)",
              border: `1px solid ${best ? C.good : C.line}`,
            }}>
              <div className="text-xs" style={{ fontFamily: MONO, fontSize: 9, color: C.muted, whiteSpace: "nowrap" }}>{w} · {WORLD_SHORT[w]}</div>
              <div className="text-xs" style={{ fontFamily: MONO, fontWeight: 700, color: npv >= 0 ? C.good : C.bad }}>
                {npv > 0 ? "+" : npv < 0 ? "−" : ""}${Math.abs(npv).toFixed(2)}B{best ? " ★" : ""}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-xs mt-1.5" style={{ fontFamily: MONO, fontSize: 10, color: C.muted }}>
        worst-case regret: <b style={{ color: mr === maxRegret(minimaxStrategy()) ? C.good : C.ink }}>${mr.toFixed(2)}B</b>
      </div>
    </div>
  );
}

export default function Strategies({ go }) {
  const minimax = minimaxStrategy();

  return (
    <div>
      <PageHead
        kicker="Step 5 · Strategies — the L-side of the grammar"
        title="Five ways to face the same four futures"
        sub="Worlds were pure X-vectors; strategies are the mirror image — pure L-configurations. Each candidate below is a setting of Samsung's own levers, the futures untouched. The matrix tab then runs every strategy through every world: 5 × 4 = 20 runs of the same engine."
      />

      <Section title="How the candidate set was built — diversity by construction">
        <p className="text-sm mb-3" style={{ color: C.ink, lineHeight: 1.65, maxWidth: 920 }}>
          The candidates are deliberately <b>structurally distinct</b>, not five variations of the memo's plan. They span the full response
          space — from committing everything to walking away — so that when one of them dominates the regret table, it is a result, not an artifact
          of a narrow menu. Three of the five come from inside the memo itself; the analysis only promoted them to equal standing.
        </p>
        <CommitmentSpectrum />
        <Note>
          The rule carried over from the grammar: strategies may touch only L. A strategy cannot assume the premium holds or that launch gets cheap —
          it has to face whatever world it lands in.
        </Note>
      </Section>

      {STRATEGIES.map(s => {
        const isMinimax = s.id === minimax;
        const isS1 = s.id === "S1";
        return (
          <Section key={s.id} title={`${s.id} · ${s.name}`}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.navy, color: C.amber }}>{s.archetype}</span>
              {isMinimax && <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.good, color: "#fff" }}>MINIMAX REGRET</span>}
              {isS1 && <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.bad, color: "#fff" }}>MAX REGRET</span>}
              <span className="text-xs" style={{ fontFamily: MONO, color: C.muted }}>provenance: {s.provenance}</span>
            </div>
            <p className="text-sm mb-3" style={{ color: C.ink, lineHeight: 1.6, maxWidth: 920 }}>{s.desc}</p>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              <div className="rounded p-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
                <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: C.muted, fontWeight: 700 }}>The levers (L) it sets</div>
                {s.levers.map((l, i) => (
                  <div key={i} className="text-xs flex gap-1.5 py-0.5" style={{ color: C.ink, lineHeight: 1.5 }}>
                    <span style={{ color: C.amber, fontWeight: 700 }}>·</span>{l}
                  </div>
                ))}
              </div>
              <div className="rounded p-3" style={{ background: C.navy }}>
                <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: C.amber, fontWeight: 700 }}>The bet it makes</div>
                <div className="text-xs mb-2.5" style={{ color: C.ice, lineHeight: 1.6 }}>{s.bet}</div>
                <div className="text-xs pt-2" style={{ color: "rgba(202,220,252,0.75)", lineHeight: 1.55, borderTop: "1px solid rgba(202,220,252,0.2)" }}>
                  <b style={{ color: C.ice }}>Where it comes from: </b>{s.memoSrc}
                </div>
              </div>
              <div className="rounded p-3" style={{ background: C.paper, border: `1px solid ${isMinimax ? C.good : isS1 ? C.bad : C.line}` }}>
                <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: C.muted, fontWeight: 700 }}>Where it lands — NPV per world, $B</div>
                <NpvStrip sid={s.id} />
              </div>
            </div>
          </Section>
        );
      })}

      <Section title="One honesty note before the matrix">
        <div className="text-sm rounded p-3" style={{ background: C.tint, color: C.ink, lineHeight: 1.65, borderLeft: `4px solid ${C.amber}` }}>
          The five rows are not equally trustworthy, and the matrix says so out loud: S1 inherits the calibrated baseline; S2–S5 revenue ramps are
          <b> declared judgments</b>, anchored loosely (OneWeb-class trajectories, the memo's own Alternative tables). The defensible claim is the
          comparative shape — a fragile plan against robust alternatives — not any single cell.
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => go("regret")} className="px-3 py-1.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.navy, color: "#fff", border: "none", cursor: "pointer" }}>
            now run all five against all four worlds — the matrix →
          </button>
          <button onClick={() => go("worlds")} className="px-3 py-1.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.paper, color: C.navy, border: `1px solid ${C.line}`, cursor: "pointer" }}>
            ← back to the worlds these will face
          </button>
        </div>
      </Section>
    </div>
  );
}
