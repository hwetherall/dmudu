// Transcribed from pathway-v0.1.md — the matrix turned into a staged policy.

export const POLICY = "Default posture: no constellation capex authorized. Run Phase 1 as a world-discrimination instrument. The memo's Phase-1 gates, reinterpreted, are not pass/fail tests of the plan — they are measurements of which axis pole we live on: the launch gate (<$2,000/kg from ≥2 providers) measures the supply axis; the LOI/co-invest gate (premium ≥15% over GEO VSAT, 50/50 gateway term sheets) measures the demand axis. Two gates, two axes, four outcomes, four prepared responses.";

export const TRIGGERS = [
  { signal: "Launch gate PASSES · demand gate PASSES", world: "W2 Sovereign Plenty", response: "Commit S1 (plan-as-written), staged per Phase 2/3 gates; accelerate — window logic is live", early: false },
  { signal: "Demand PASSES · launch FAILS", world: "W1 Gated Orbits", response: "Do not build 3,500. GaaS-first (S4, NPV 2.17 in W1) with Regional-1000 (S2) as the constellation option if $/kg trends improve", early: false },
  { signal: "Launch PASSES · demand FAILS", world: "W4 Contested Commodity", response: "Component-supplier posture (S5, best in W4) + D2D-only option (S3); never enter the broadband price war", early: false },
  { signal: "Both FAIL", world: "W3 Incumbent Citadel", response: "GaaS pivot — sell sovereign compliance to the licensed incumbents (S4, NPV 1.44 in W3) — or graceful exit to S5", early: false },
  { signal: "Any beachhead licenses Starlink/Kuiper under a compliance concession", world: "W3 forming — ahead of the gates", response: "Freeze all constellation procurement immediately; re-scope Phase 1 toward GaaS validation", early: true },
  { signal: "Quoted wholesale rates fall ≥30% during Phase 1", world: "W4 forming", response: "Invoke memo Alternative #2 (D2D-only) / #1 (GaaS) evaluation; do not authorize Phase 2 constellation capital", early: true },
];

export const NO_REGRET = [
  { id: "R7", title: "COTS radiation test program", why: "Kill-condition in every world — start immediately; it is also the longest-lead item" },
  { id: "R10", title: "Anchor aerospace hires", why: "Talent constrains every world; the 400-from-zero problem doesn't wait for the axes to resolve" },
  { id: "R8", title: "ITAR/EAR formal audit", why: "HIGH in 3 of 4 worlds; cheap, decisive, and an early kill-detector" },
  { id: "R12", title: "Organizational separation", why: "Model-external and world-independent: the venture fails under consumer-electronics product cycles regardless of which world obtains" },
];

export const LOOP = [
  { title: "The X-space shrinks", body: "Phase-1 results move parameters across the tag boundary from deep-uncertain toward estimated: launch quotes turn P5 into a number with a confidence band; LOI conversations turn P19 (the premium) into evidence; radiation results turn R7 into a fact. In levels language, pieces of the problem demote from level 3 to level 2 — where ordinary analysis takes over. You cannot search the web for your own pilot results: staged action is the only instrument that can observe certain parameters." },
  { title: "The L-space shrinks", body: "Irreversible commitments convert levers into constants. If path X is taken and path Y becomes unreachable, regret in V2 is computed over the reachable set only — path-dependent regret. The matrix is re-run on the strategies that still exist, against the worlds that remain possible." },
  { title: "The worlds redraw", body: "Axis selection recurs every cycle: yesterday's axes may be partially resolved while new deep uncertainty is born — once Samsung actually enters, \"how do incumbents respond to Samsung specifically\" becomes a candidate axis that could not exist pre-entry. The funnel narrows and twists; it never closes." },
];

export const LOOP_NOTE = "This is the explore-exploit structure, legitimately applied at last: each stage explores (spends a bounded budget to buy information that cannot be obtained any other way), each gate exploits (commits irreversibly on what was learned), and the cycle repeats on the residual. Two honesty notes carry forward: level-4 residue is permanent, and there is no learned transition function — each re-instantiation is re-framed by judgment, which is why axis selection stays the expert step.";

export const PRODUCT_NOTE = "If the analysis re-instantiates on every gate, the deliverable is not a memo — it is a subscription to the loop: signpost monitoring between gates, re-instantiation at each gate, a living robustness matrix. The memo is the entry ticket; the loop is the product.";
