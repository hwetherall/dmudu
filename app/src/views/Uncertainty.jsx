import { useState, useEffect } from "react";
import { C, MONO, SERIF } from "../theme.js";
import { Section, PageHead, Note } from "../components/ui.jsx";

// The four levels (Courtney/Kirkland/Viguerie via Walker et al.), expanded.
const LEVELS = [
  {
    n: 1,
    name: "A clear enough future",
    question: "What will happen?",
    what: "A single forecast is accurate enough to make the decision. Residual uncertainty is noise around one trajectory — wide enough to need error bars, narrow enough not to change the answer.",
    traits: [
      "Stable environment, abundant history",
      "Well-understood causal structure",
      "Errors are symmetric and bounded",
    ],
    tools: ["Point forecasts", "DCF / NPV on a single case", "Sensitivity as error bars"],
    example: "Will GEO satellite latency stay in the 600–800 ms band? Yes — it is set by orbital altitude and the speed of light. Physics does not negotiate.",
    marker: null,
  },
  {
    n: 2,
    name: "Alternate futures, with probabilities",
    question: "What are the odds?",
    what: "The future forks into a few discrete outcomes — and the odds attached to each are credible, because they come from data, structure, or a process you can study. This is risk in the classic sense: countable outcomes, defensible probabilities.",
    traits: [
      "Outcome set is enumerable",
      "Probabilities are estimable, not invented",
      "More analysis genuinely shrinks the uncertainty",
    ],
    tools: ["Decision trees, expected value", "Monte Carlo over known distributions", "Real options on discrete events"],
    example: "What will a user terminal cost at 1M-unit volume? A bottom-up BOM study yields a defensible range with odds. This is exactly the uncertainty the memo's Phase-1 budget is designed to buy down.",
    marker: "standard analysis lives here — Innovera today",
  },
  {
    n: 3,
    name: "A few plausible futures — no credible probabilities",
    question: "Under which futures does this decision survive?",
    what: "You can still bound the future with a handful of scenarios — but there is no defensible basis for odds. The outcome hangs on choices other actors have not yet made. Assigning probabilities here doesn't add rigor; it launders guesswork into math. This is where deep uncertainty begins.",
    traits: [
      "Driven by other actors' strategic choices — politics, regulators, rivals",
      "No dataset exists; the future is decided, not revealed",
      "Probabilities would be invented, then mistaken for analysis",
    ],
    tools: ["Scenario construction (worlds)", "Robustness testing across worlds", "Minimax regret instead of expected value"],
    example: "Will sovereign governments still pay a premium for non-US infrastructure in 2032? That depends on elections, alliances, and incumbents' concessions — decisions not yet made, by actors who don't yet know themselves.",
    marker: "the defensible territory — where this workbench operates",
  },
  {
    n: 4,
    name: "True ambiguity — unknown unknowns",
    question: "How do we stay adaptable?",
    what: "Even the futures can't be enumerated; no scenario set is credible. Novel technology, novel markets and novel regulation interact in ways no one can pre-state. The only defensible posture is to design the decision itself for adaptation.",
    traits: [
      "Futures cannot be listed, let alone weighted",
      "Multiple novelties interacting",
      "Resolves only by acting, observing, adapting",
    ],
    tools: ["Signposts & triggers", "Staged commitment, options to exit", "Adaptive pathways — act, monitor, re-plan"],
    example: "What does the orbital economy look like in 2040 — debris regimes, mega-constellation shakeouts, direct-to-device upending terrestrial telcos? We cannot even list the candidate futures.",
    marker: null,
  },
];

// Staircase visual. big=false reproduces the original Read-mode ladder exactly;
// big=true enlarges it to fill a present-mode beat on a projector.
function Staircase({ big = false }) {
  const minH = big ? 300 : 150;
  const step = big ? 48 : 26;
  const pad = big ? "16px" : "10px";
  const gap = big ? 6 : 4;
  const wallW = big ? 16 : 10;
  const stripe = big ? 10 : 6;
  const levelFs = big ? 16 : 12;
  const nameFs = big ? 20 : 12;
  const wallLabelFs = big ? 14 : 12;
  return (
    <div className="flex items-stretch" style={{ minHeight: minH }}>
      {LEVELS.map((l, i) => (
        <div key={l.n} className="flex items-stretch" style={{ flex: 1, minWidth: 0 }}>
          {i === 2 && (
            <div className="relative" style={{ width: wallW, margin: `0 ${gap}px`, background: `repeating-linear-gradient(45deg, ${C.amber}, ${C.amber} ${stripe}px, ${C.navy} ${stripe}px, ${C.navy} ${stripe * 2}px)`, borderRadius: 3 }}>
              <div className="absolute rounded" style={{
                fontFamily: MONO, fontWeight: 700, fontSize: wallLabelFs, background: C.amber, color: C.navy,
                top: big ? -14 : -10, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", zIndex: 2,
                padding: big ? "3px 8px" : "2px 6px",
              }}>THE WALL</div>
            </div>
          )}
          <div className="rounded-lg flex flex-col justify-end" style={{
            flex: 1, minWidth: 0,
            background: i >= 2 ? C.navy : C.tint,
            border: `1px solid ${i >= 2 ? C.navy : C.line}`,
            marginTop: (3 - i) * step,
            marginLeft: i === 0 ? 0 : gap,
            padding: pad,
          }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: levelFs, color: i >= 2 ? C.amber : C.muted }}>LEVEL {l.n}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: nameFs, color: i >= 2 ? "#fff" : C.navy, lineHeight: 1.3, marginTop: 2 }}>{l.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// The thesis as a picture: the same intervention — more analysis — collapses the
// forecast below the wall to a single answer, and barely moves it above the wall.
function HeroUncertaintyDiagram({ maxWidth = 980 }) {
  return (
    <div style={{ width: "100%", maxWidth, margin: "0 auto" }}>
      <svg
        viewBox="0 0 980 430"
        width="100%"
        style={{ display: "block", height: "auto" }}
        role="img"
        aria-label="Below the wall, more analysis collapses the range of outcomes to a single answer; above the wall, the same analysis leaves the range unchanged."
      >
        <defs>
          <pattern id="unc-wall-hatch" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill={C.amber} />
            <rect width="8" height="16" fill={C.navy} />
          </pattern>
          <marker id="unc-arrow" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L7,3 L0,6 Z" fill={C.muted} />
          </marker>
        </defs>

        {/* ── below the wall: a converging funnel ── */}
        <text x="60" y="50" fontFamily={MONO} fontWeight="700" fontSize="16" fill={C.amber}>BELOW THE WALL</text>
        <polygon points="70,104 70,302 420,203" fill={C.tint} stroke={C.amber} strokeWidth="2" />
        <circle cx="420" cy="203" r="7" fill={C.amber} />
        <text x="80" y="338" fontFamily={SERIF} fontSize="15" fill={C.ink}>study collapses the spread</text>
        <text x="80" y="358" fontFamily={SERIF} fontSize="15" fill={C.ink}>to a single answer</text>
        <line x1="70" y1="394" x2="420" y2="394" stroke={C.muted} strokeWidth="1.5" markerEnd="url(#unc-arrow)" />
        <text x="70" y="416" fontFamily={MONO} fontSize="13" fill={C.muted}>more analysis →</text>

        {/* ── the wall ── */}
        <rect x="462" y="72" width="56" height="322" fill="url(#unc-wall-hatch)" rx="4" />
        <rect x="448" y="44" width="84" height="24" rx="5" fill={C.amber} />
        <text x="490" y="61" fontFamily={MONO} fontWeight="700" fontSize="13" fill={C.navy} textAnchor="middle">THE WALL</text>

        {/* ── above the wall: a band that never narrows ── */}
        <text x="562" y="50" fontFamily={MONO} fontWeight="700" fontSize="16" fill={C.navy}>ABOVE THE WALL</text>
        <rect x="562" y="108" width="352" height="190" fill={C.navy} fillOpacity="0.12" stroke={C.navy} strokeWidth="2" />
        <text x="738" y="208" textAnchor="middle" fontFamily={SERIF} fontSize="15" fill={C.navy}>the spread doesn't move</text>
        <line x1="562" y1="394" x2="914" y2="394" stroke={C.muted} strokeWidth="1.5" markerEnd="url(#unc-arrow)" />
        <text x="562" y="416" fontFamily={MONO} fontSize="13" fill={C.muted}>more analysis →</text>
      </svg>
    </div>
  );
}

function LevelCard({ l, dark }) {
  return (
    <Section title={`Level ${l.n} · ${l.name}`}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: dark ? C.navy : C.tint, color: dark ? C.amber : C.navy }}>
          the question: {l.question}
        </span>
        {l.marker && (
          <span className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.amber, color: C.navy }}>
            {l.marker}
          </span>
        )}
      </div>
      <p className="text-sm mb-3" style={{ color: C.ink, lineHeight: 1.65, maxWidth: 920 }}>{l.what}</p>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div className="rounded p-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: C.muted, fontWeight: 700 }}>Key characteristics</div>
          {l.traits.map((t, i) => (
            <div key={i} className="text-xs flex gap-1.5 py-0.5" style={{ color: C.ink, lineHeight: 1.5 }}>
              <span style={{ color: C.amber, fontWeight: 700 }}>·</span>{t}
            </div>
          ))}
        </div>
        <div className="rounded p-3" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: C.muted, fontWeight: 700 }}>The right tools</div>
          {l.tools.map((t, i) => (
            <div key={i} className="text-xs flex gap-1.5 py-0.5" style={{ color: C.ink, lineHeight: 1.5 }}>
              <span style={{ color: C.amber, fontWeight: 700 }}>·</span>{t}
            </div>
          ))}
        </div>
        <div className="rounded p-3" style={{ background: dark ? C.navy : C.tint, border: `1px solid ${dark ? C.navy : C.line}` }}>
          <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: dark ? C.amber : C.muted, fontWeight: 700 }}>In this case</div>
          <div className="text-xs" style={{ color: dark ? C.ice : C.ink, lineHeight: 1.6 }}>{l.example}</div>
        </div>
      </div>
    </Section>
  );
}

// ── Read | Present pill. Renders inline in Read mode; fixed top-right in the overlay. ──
function ModeToggle({ isPresent, onRead, onPresent }) {
  const base = { fontFamily: MONO, fontWeight: 700, fontSize: 12, padding: "6px 16px", border: "none", cursor: "pointer", lineHeight: 1.4 };
  return (
    <div
      className="unc-mode-toggle"
      onClick={(e) => e.stopPropagation()}
      style={{ display: "inline-flex", borderRadius: 999, overflow: "hidden", border: `1px solid ${C.line}`, background: C.paper }}
    >
      <button
        onClick={(e) => { e.currentTarget.blur(); onRead(); }}
        style={{ ...base, background: isPresent ? C.paper : C.navy, color: isPresent ? C.muted : "#fff" }}
      >Read</button>
      <button
        onClick={(e) => { e.currentTarget.blur(); onPresent(); }}
        style={{ ...base, background: isPresent ? C.navy : C.paper, color: isPresent ? "#fff" : C.muted }}
      >Present</button>
    </div>
  );
}

// Present-beat type styles (clamp() keeps them legible on a 1080p projector).
const PBEAT_BIG = { fontFamily: SERIF, fontWeight: 700, color: C.navy, fontSize: "clamp(30px,4.6vw,58px)", lineHeight: 1.14, letterSpacing: "-0.01em", margin: 0 };
const PBEAT_SUB = { fontFamily: SERIF, color: C.muted, fontSize: "clamp(17px,2.05vw,24px)", lineHeight: 1.55, margin: 0 };
const PBEAT_KICK = { fontFamily: MONO, fontWeight: 700, fontSize: "clamp(12px,1.15vw,15px)", textTransform: "uppercase", letterSpacing: 2, color: C.amber };
const PBEAT_TAG = { display: "inline-block", fontFamily: MONO, fontWeight: 700, fontSize: "clamp(13px,1.35vw,17px)", background: C.amber, color: C.navy, padding: "9px 18px", borderRadius: 8 };
const PBTN_NAVY = { fontFamily: MONO, fontWeight: 700, fontSize: "clamp(14px,1.5vw,18px)", background: C.navy, color: "#fff", border: "none", borderRadius: 8, padding: "14px 26px", cursor: "pointer" };
const PBTN_GHOST = { ...PBTN_NAVY, background: C.paper, color: C.navy, border: `1px solid ${C.line}` };

const PRESENT_CSS = `
@keyframes uncBeatIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.present-beat { animation: uncBeatIn 170ms ease-out; }
@media print { .present-overlay, .unc-mode-toggle { display: none !important; } }
`;

export default function Uncertainty({ go }) {
  const [isPresent, setIsPresent] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);

  const enterPresent = () => { setBeatIndex(0); setIsPresent(true); };
  const exitPresent = () => setIsPresent(false);

  // ── the present-mode beat sequence (order is the spec; never leaves a hole) ──
  const beats = [
    // 1 · Hook
    (
      <div style={{ textAlign: "center" }}>
        <div style={PBEAT_BIG}>Not all uncertainty is the same problem.</div>
        <p style={{ ...PBEAT_SUB, maxWidth: 800, margin: "30px auto 0" }}>
          Some you can buy down with information. Some only the world can resolve.{" "}
          <span style={{ color: C.navy, fontWeight: 700 }}>The Samsung verdict turns on the second kind.</span>
        </p>
      </div>
    ),
    // 2 · The ladder
    (
      <div>
        <div style={{ ...PBEAT_KICK, textAlign: "center", marginBottom: 30 }}>the ladder</div>
        <Staircase big />
        <div style={{ ...PBEAT_BIG, fontSize: "clamp(24px,3vw,40px)", textAlign: "center", marginTop: 44 }}>
          Four levels. One wall — between 2 and 3.
        </div>
      </div>
    ),
    // 3 · What more analysis buys you
    (
      <div>
        <div style={{ ...PBEAT_KICK, textAlign: "center", marginBottom: 24 }}>what more analysis buys you</div>
        <HeroUncertaintyDiagram maxWidth={980} />
        <div style={{ ...PBEAT_BIG, fontSize: "clamp(24px,3vw,40px)", textAlign: "center", marginTop: 36 }}>
          Below the wall, thinking harder works. Above it, it doesn't.
        </div>
      </div>
    ),
    // 4 · Below the wall (Levels 1 + 2 compressed)
    (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_KICK, color: C.muted, marginBottom: 30 }}>below the wall</div>
        <div style={{ fontFamily: SERIF, fontSize: "clamp(23px,3vw,40px)", lineHeight: 1.4, color: C.navy }}>
          <span style={{ color: C.amber, fontWeight: 700 }}>Level 1 — </span>What will happen?{" "}
          <span style={{ color: C.muted }}>A single forecast is enough.</span>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: "clamp(23px,3vw,40px)", lineHeight: 1.4, color: C.navy, marginTop: 14 }}>
          <span style={{ color: C.amber, fontWeight: 700 }}>Level 2 — </span>What are the odds?{" "}
          <span style={{ color: C.muted }}>Countable outcomes, probabilities you can defend.</span>
        </div>
        <div style={{ ...PBEAT_BIG, fontSize: "clamp(26px,3.4vw,44px)", marginTop: 42 }}>
          This is standard analysis. This is Innovera today.
        </div>
        <p style={{ ...PBEAT_SUB, fontSize: "clamp(15px,1.7vw,20px)", fontStyle: "italic", maxWidth: 760, margin: "28px auto 0" }}>
          e.g. what will a user terminal cost at 1M units? A bottom-up BOM study answers it.
        </p>
      </div>
    ),
    // 5 · The wall (buy information / buy robustness)
    (
      <div>
        <div style={{ ...PBEAT_KICK, color: C.muted, textAlign: "center", marginBottom: 28 }}>the wall</div>
        <div style={{ display: "flex", alignItems: "stretch", borderRadius: 14, overflow: "hidden", border: `1px solid ${C.line}` }}>
          <div style={{ flex: 1, background: C.tint, padding: "clamp(24px,3vw,48px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: SERIF, color: C.navy, fontSize: "clamp(18px,2vw,27px)", lineHeight: 1.5 }}>
              The answer exists. The world holds it. More data reveals it.
            </div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy, fontSize: "clamp(26px,3.2vw,44px)", marginTop: 24 }}>
              → Buy information.
            </div>
          </div>
          <div style={{ width: "clamp(22px,3vw,46px)", flexShrink: 0, background: `repeating-linear-gradient(45deg, ${C.amber}, ${C.amber} 10px, ${C.navy} 10px, ${C.navy} 20px)` }} />
          <div style={{ flex: 1, background: C.navy, padding: "clamp(24px,3vw,48px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: SERIF, color: C.ice, fontSize: "clamp(18px,2vw,27px)", lineHeight: 1.5 }}>
              The answer doesn't exist yet. It gets decided, over years, by actors who haven't chosen.
            </div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, color: C.amber, fontSize: "clamp(26px,3.2vw,44px)", marginTop: 24 }}>
              → Buy robustness.
            </div>
          </div>
        </div>
      </div>
    ),
    // 6 · The failure mode
    (
      <div style={{ textAlign: "center" }}>
        <div style={PBEAT_BIG}>
          The most common failure is treating <span style={{ color: C.bad }}>Level 3</span> as <span style={{ color: C.amber }}>Level 2</span>.
        </div>
        <p style={{ ...PBEAT_SUB, maxWidth: 840, margin: "30px auto 0" }}>
          Made-up probabilities, averaged into one confident number. The math looks rigorous; the inputs are{" "}
          <span style={{ color: C.bad, fontWeight: 700 }}>guesses wearing suits.</span>
        </p>
      </div>
    ),
    // 7 · Above the wall — Level 3
    (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_KICK, marginBottom: 26 }}>above the wall — level 3</div>
        <div style={PBEAT_BIG}>Under which futures does this decision survive?</div>
        <p style={{ ...PBEAT_SUB, maxWidth: 680, margin: "22px auto 0" }}>A few plausible futures, no credible odds.</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 28 }}>
          {["scenario worlds", "robustness testing", "minimax regret"].map((t) => (
            <span key={t} style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(13px,1.4vw,18px)", color: C.navy, background: C.tint, border: `1px solid ${C.line}`, padding: "10px 18px", borderRadius: 8 }}>{t}</span>
          ))}
        </div>
        <p style={{ ...PBEAT_SUB, fontSize: "clamp(15px,1.7vw,20px)", fontStyle: "italic", maxWidth: 840, margin: "30px auto 0" }}>
          Will sovereign governments still pay a premium for non-US infrastructure in 2032? Elections, alliances, incumbents' concessions — decisions not yet made.
        </p>
        <div style={{ marginTop: 30 }}>
          <span style={PBEAT_TAG}>the territory this workbench is built for.</span>
        </div>
      </div>
    ),
    // 8 · Triage — a real decision is a bundle
    (
      <div>
        <div style={{ ...PBEAT_BIG, fontSize: "clamp(24px,3vw,40px)", textAlign: "center" }}>
          A real decision isn't at one level — it's a bundle.
        </div>
        <p style={{ ...PBEAT_SUB, fontSize: "clamp(15px,1.7vw,20px)", textAlign: "center", maxWidth: 760, margin: "16px auto 36px" }}>
          Samsung's live uncertainties, sorted — with the wall down the middle.
        </p>
        <div style={{ display: "flex", alignItems: "stretch", gap: 14 }}>
          {[
            { n: 1, item: "GEO latency", dark: false },
            { n: 2, item: "terminal BOM cost", dark: false },
          ].map((t) => (
            <div key={t.n} style={{ flex: 1, minWidth: 0, background: C.tint, border: `1px solid ${C.line}`, borderRadius: 12, padding: "clamp(16px,1.8vw,28px)", display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ alignSelf: "flex-start", fontFamily: MONO, fontWeight: 700, fontSize: "clamp(11px,1.1vw,14px)", color: C.amber, background: C.paper, border: `1px solid ${C.line}`, padding: "4px 10px", borderRadius: 6 }}>LEVEL {t.n}</span>
              <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(16px,1.9vw,24px)", color: C.navy, lineHeight: 1.3 }}>{t.item}</span>
            </div>
          ))}
          <div style={{ width: "clamp(16px,1.8vw,28px)", flexShrink: 0, borderRadius: 4, background: `repeating-linear-gradient(45deg, ${C.amber}, ${C.amber} 9px, ${C.navy} 9px, ${C.navy} 18px)` }} />
          {[
            { n: 3, item: "2032 sovereignty premium", dark: true },
            { n: 4, item: "2040 orbital economy", dark: true },
          ].map((t) => (
            <div key={t.n} style={{ flex: 1, minWidth: 0, background: C.navy, border: `1px solid ${C.navy}`, borderRadius: 12, padding: "clamp(16px,1.8vw,28px)", display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ alignSelf: "flex-start", fontFamily: MONO, fontWeight: 700, fontSize: "clamp(11px,1.1vw,14px)", color: C.navy, background: C.amber, padding: "4px 10px", borderRadius: 6 }}>LEVEL {t.n}</span>
              <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: "clamp(16px,1.9vw,24px)", color: "#fff", lineHeight: 1.3 }}>{t.item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    // 9 · Level 4 — the honest edge
    (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_KICK, color: C.muted, marginBottom: 26 }}>the honest edge</div>
        <div style={PBEAT_BIG}>Level 4 — true ambiguity.<br />Futures you can't even list.</div>
        <p style={{ ...PBEAT_SUB, maxWidth: 840, margin: "30px auto 0" }}>
          The honest move is to stay adaptable — and to say where the method stops.{" "}
          <span style={{ color: C.navy, fontWeight: 700 }}>We don't forecast the 2040 orbital economy, and we won't pretend to.</span>
        </p>
      </div>
    ),
    // 10 · Close / handoff
    (
      <div style={{ textAlign: "center" }}>
        <div style={{ ...PBEAT_BIG, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
          Better information stops helping at the wall. That is the wall — and the opportunity.
        </div>
        <p style={{ ...PBEAT_SUB, maxWidth: 760, margin: "26px auto 0" }}>
          What follows is what working on the far side looks like.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 40 }}>
          <button onClick={(e) => { e.stopPropagation(); go("method"); }} style={PBTN_NAVY}>the method →</button>
          <button onClick={(e) => { e.stopPropagation(); go("worlds"); }} style={PBTN_GHOST}>the worlds →</button>
        </div>
      </div>
    ),
  ];

  const beatCount = beats.length;

  // Keyboard navigation — only while presenting; functional updates avoid stale state.
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

  // Click-zone navigation: right 60% advances, left 20% goes back, middle is a dead band.
  function handleZoneClick(e) {
    const x = e.clientX / window.innerWidth;
    if (x >= 0.4) setBeatIndex((i) => Math.min(i + 1, beatCount - 1));
    else if (x <= 0.2) setBeatIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <div>
      <style>{PRESENT_CSS}</style>

      {/* ── Read | Present toggle (page-level in Read mode) ── */}
      <div className="flex justify-end mb-3">
        <ModeToggle isPresent={isPresent} onRead={exitPresent} onPresent={enterPresent} />
      </div>

      {/* ── Read-mode document — always in normal flow, so Esc and print are trivially correct ── */}
      <PageHead
        kicker="The framing — four levels of uncertainty"
        title="Not all uncertainty is the same problem"
        sub="A refresher on the Walker / Courtney ladder — because everything in this workbench hangs on one distinction: uncertainty you can buy down with information, versus uncertainty that only the world can resolve. The Samsung verdict turns on the second kind."
      />

      <Section title="The ladder — and where the wall sits">
        <Staircase />
        <Note>Levels 1–2: analysis converges on an answer. Levels 3–4: analysis can only map the territory. The wall between 2 and 3 is where the method must change.</Note>
      </Section>

      <Section title="What more analysis buys you">
        <HeroUncertaintyDiagram maxWidth={760} />
        <Note>The same intervention — more analysis — collapses the forecast below the wall and barely moves it above. That asymmetry is the whole reason the method has to change at the wall.</Note>
      </Section>

      {LEVELS.map((l, i) => <LevelCard key={l.n} l={l} dark={i >= 2} />)}

      <Section title="The wall — why the move from level 2 to level 3 changes everything">
        <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <div className="rounded-lg p-3.5" style={{ background: C.tint, border: `1px solid ${C.line}` }}>
            <div className="text-sm mb-1.5" style={{ fontFamily: SERIF, fontWeight: 700, color: C.navy }}>Level 2 · buy information</div>
            <div className="text-xs" style={{ color: C.ink, lineHeight: 1.7 }}>
              The uncertainty lives <b>in our heads</b>. The world already holds an answer — a BOM cost, a launch quote, an MNO's willingness to sign — and study reveals it.
              More data shrinks the error bars. The right move is to analyze harder. The memo's own Phase-1 budget ($1.5–2.5M over 18 months: block-buy pricing, LOIs, BOM studies) is precisely this — and it is the correct instrument for these uncertainties.
            </div>
          </div>
          <div className="rounded-lg p-3.5" style={{ background: C.navy, border: `1px solid ${C.navy}` }}>
            <div className="text-sm mb-1.5" style={{ fontFamily: SERIF, fontWeight: 700, color: "#fff" }}>Level 3 · buy robustness</div>
            <div className="text-xs" style={{ color: C.ice, lineHeight: 1.7 }}>
              The uncertainty lives <b style={{ color: C.amber }}>in the world</b>. The answer does not exist yet — sovereignty politics in 2032, the structure of the launch market — it will be <i>decided</i>, over years, by actors who haven't chosen.
              More analysis adds only invented precision. The right move is to stop forecasting and start stress-testing: find the decision that survives every plausible future, and instrument the ones it doesn't.
            </div>
          </div>
        </div>
        <div className="text-sm rounded p-3 mb-3" style={{ background: "rgba(178,58,72,0.07)", color: C.ink, lineHeight: 1.65, borderLeft: `4px solid ${C.bad}` }}>
          The most common failure in strategy work is treating level 3 as level 2: putting made-up probabilities on scenarios and averaging them into one confident number.
          The math looks rigorous; the inputs are guesses wearing suits. <b>Once probabilities can't be defended, expected value stops being an honest summary — and robustness has to replace it.</b>
        </div>
        <div className="text-sm rounded p-3" style={{ background: C.tint, color: C.ink, lineHeight: 1.65, borderLeft: `4px solid ${C.amber}` }}>
          Applied here: the Samsung verdict turns on uncertainties no Phase-1 study can resolve — sovereignty politics and launch-market structure.
          Better information stops helping at the level-2/3 boundary. <b>That is the wall, and the opportunity:</b> the analysis that follows is what working <i>on the far side</i> of it looks like.
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => go("method")} className="px-3 py-1.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.navy, color: "#fff", border: "none", cursor: "pointer" }}>
            how we work past the wall — the method →
          </button>
          <button onClick={() => go("worlds")} className="px-3 py-1.5 rounded text-xs" style={{ fontFamily: MONO, fontWeight: 700, background: C.paper, color: C.navy, border: `1px solid ${C.line}`, cursor: "pointer" }}>
            see the level-3 futures — the worlds →
          </button>
        </div>
      </Section>

      {/* ── Present-mode overlay — fixed above app chrome, one beat at a time ── */}
      {isPresent && (
        <div
          className="present-overlay"
          onClick={handleZoneClick}
          style={{ position: "fixed", inset: 0, zIndex: 9000, background: C.paper, overflow: "hidden", userSelect: "none", cursor: "default" }}
        >
          <div style={{ position: "absolute", top: 20, left: 26, zIndex: 3, fontFamily: MONO, fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: 0.5 }}>
            Samsung LEO · Uncertainty
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
