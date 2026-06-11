// "Everything this exercise surfaced" + the five open questions (deck slides 17–18).

export const FINDING_COLUMNS = [
  {
    title: "Method", color: "navy",
    items: [
      "Extraction doubles as memo QA — found the F4 manufacturing/replenishment incoherence with no opinion involved",
      "Calibration doubles as a claims audit — the breakeven anchor is the orphan of the memo's own numbers",
      "Free unit tests live inside memos: $20M/flight → $1.4B reproduced exactly, untuned",
      "Deltas from a calibrated baseline beat invented levels",
      "The X / L split is XLRM operationalized — confabulation becomes a type error",
      "Verdict rules fixed ex ante; boundaries reported, not redrawn (W1 at 4.8% vs the 5% cutoff)",
      "Risk impacts computed, not scored; likelihoods conditional on world — scenarios factor the uncertainty into a deep part (which world) and a tame part (risk-given-world)",
    ],
  },
  {
    title: "Samsung case", color: "amber",
    items: [
      "The plan thrives in 1 of 4 worlds — as written it is a wager on W2, not a strategy across futures",
      "The plan is the maximum-regret strategy on the board ($7.15B); the memo's own Alternative #1 is the minimax ($0.67B), parked in an appendix",
      "The replenishment wall: Y4–5 cohorts die in Y9–10, ~$6.2B, unpriced by the memo's anchors",
      "W3 dies fast (capital crater, −$12.4B), W4 dies slow (margin bleed) — same verdict, opposite triggers",
      "Co-investment refusal is a commercial event, not a financing one: capex + ~1 yr of lost ramp",
      "The $2.5M Phase 1 is now priced: an option premium against a $7.15B worst-case regret",
    ],
  },
  {
    title: "Product / upstream", color: "good",
    items: [
      "Memos should emit financial claims from one coherent model — a single source for every anchor",
      "Ship volume ramps, not just price points (F7 — the largest assumption load was a memo gap)",
      "Write risks as parameter mappings: every risk stated so a machine can ask which dial it moves",
      "\"Look around corners\" becomes instrumentation: world-specific signposts + triggers, not just qualitative foresight",
      "The deliverable is the loop — monitoring between gates, re-instantiation at each one",
      "Better memos → better models → better worlds → better decisions",
    ],
  },
];

export const OPEN_QUESTIONS = [
  { n: 1, q: "Axis selection", body: "Can the framing step be made systematic, or is it irreducibly expert judgment? What would a defensible procedure look like?" },
  { n: 2, q: "Robustness vs confabulation", body: "The S2–S5 ramps are declared judgments. What evidentiary standard makes a robustness claim defensible to a board?" },
  { n: 3, q: "The seam", body: "Where exactly should quantitative stochastic reasoning end and cross-world DMDU logic govern? Is the current cut right?" },
  { n: 4, q: "Does the RL framing carry formal weight?", body: "The gap is regret, the triggers are a policy, the stages are explore/exploit. Real bridge, or metaphor?" },
  { n: 5, q: "The stochastic interior", body: "Should within-world parameters become distributions? What changes, what breaks, and what does it buy?" },
];
