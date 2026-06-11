// The two deep-uncertain axes that span the worlds. Each axis is a bundle of
// X-dials collapsed to two poles; 2 × 2 = the four worlds below.
export const AXES = {
  demand: {
    title: "Demand for sovereign infrastructure",
    question: "Does the preference for non-US-controlled infrastructure stay hard — or normalize away?",
    dials: "moves P19 (sovereignty premium, THE thesis parameter), P11 (MNO co-invest), revenue multiplier",
    poles: {
      fragmented: { name: "Fragmented", desc: "Mandates harden; the premium is real; MNOs co-invest at 60%" },
      normalized: { name: "Normalized", desc: "Incumbents concede compliance and get licensed; premium collapses; co-invest falls to 25%" },
    },
    why: "R2 calls the premium's absence the thesis killer. No study resolves this — it is decided over years by governments, elections, and incumbents' concessions.",
  },
  launch: {
    title: "Launch access",
    question: "Does non-SpaceX heavy-lift capacity stay scarce — or commoditize?",
    dials: "moves P5 (launch $/kg, the single most load-bearing parameter), deployment & revenue delays",
    poles: {
      scarce: { name: "Scarce", desc: "85% of non-US/non-Chinese capacity booked through 2029; $2,400/kg; +1 yr in the manifest queue" },
      abundant: { name: "Abundant", desc: "New Glenn, Neutron and ISRO scale; launch clears at $1,200/kg with no queue" },
    },
    why: "A $20M move per flight is a $1.4B cash swing (C6). Whether rival launch programs scale is decided in other companies' factories, on their timetable.",
  },
};

// The four worlds as X-vectors + curated narration. Worlds touch only
// exogenous dials; the plan's levers are untouched (XLRM discipline).
export const WORLDS = [
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
