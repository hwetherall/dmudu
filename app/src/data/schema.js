// Transcribed from samsung-model-schema-v0.1.md — the cited parameter schema.
// Tags: X = exogenous (worlds may move it), L = lever (strategies may move it),
// D = derived (recomputes), GAP = required but absent from the memo (declared).

export const PARAM_BLOCKS = [
  {
    title: "A1 · Deployment & cost block",
    params: [
      { id: "P1", name: "Constellation size (full)", baseline: "3,500 satellites", tag: "L", source: "Executive Summary; Capability Fit", note: "Strategy alternatives change this radically (D2D-only: smaller; GaaS: zero)" },
      { id: "P2", name: "Initial deployment tranche", baseline: "500 satellites, lower-latitude optimized", tag: "L", source: "Service Rollout", note: "Phase 2 gate: 50–100 sats" },
      { id: "P3", name: "Satellite unit cost", baseline: "<$500K (target)", tag: "L", source: "Solution Design; Unit Economics", note: "Unit-econ table says <$300K/chassis — Flag F5. Realized value is hostage to COTS radiation outcome (R7)" },
      { id: "P4", name: "Satellite mass", baseline: "~800 kg", tag: "D", source: "—", note: "Derived: $80M/flight ÷ $2,000/kg = 40t payload; ÷ ~50 sats/flight = 800 kg (Starlink V2-mini class)" },
      { id: "P5", name: "Launch cost ($/kg to orbit)", baseline: "$2,000/kg (range $1,500–2,500)", tag: "X", source: "Decision; Unit Economics; Phase 1 gate", note: "Interpretation Flag F1: total cost, not premium. The single most load-bearing parameter" },
      { id: "P6", name: "Cost per flight", baseline: "$80M", tag: "X", source: "Constraints", note: "Market rate $62–74M/Falcon 9; SpaceX internal ~$20M" },
      { id: "P7", name: "Satellites per flight", baseline: "~50", tag: "D", source: "—", note: "Derived from elasticity test C6: $1.4B ÷ $20M = 70 flights; 3,500 ÷ 70 = 50" },
      { id: "P8", name: "Satellite lifespan", baseline: "5 years (range 4–5)", tag: "X", source: "Unit Economics; COGS note", note: "Drives replenishment capex forever — the mechanism behind Finding 1" },
      { id: "P9", name: "Replenishment rate", baseline: "700–875 satellites/yr", tag: "D", source: "Unit Economics (Orbital Replenishment)", note: "= P1 ÷ P8. Conflicts with P10 — Flag F4" },
      { id: "P10", name: "Satellite manufacturing capacity", baseline: "500 units/yr", tag: "L", source: "Unit Economics", note: "Cannot sustain P9 replenishment — Flag F4" },
      { id: "P11", name: "Gateway capex — MNO co-investment share", baseline: "≥50%", tag: "X", source: "Partnership table; Phase 2 gate", note: "Gateway capex level per market is GAP (G1). The share is the risk-critical parameter (R1)" },
      { id: "P12", name: "Specialist headcount", baseline: "400 aerospace engineers from zero", tag: "L", source: "Decision; Capability Fit", note: "Loaded cost is GAP (G2); feeds opex" },
      { id: "P13", name: "Operating cost structure", baseline: "Not quantified", tag: "GAP", source: "—", note: "G3: modeled as per-satellite ops + ground segment + SG&A % — declared assumption" },
    ],
  },
  {
    title: "A2 · Revenue block",
    params: [
      { id: "P14", name: "Telecom backhaul / SLA node price", baseline: "$10K–50K /month /site", tag: "X", source: "Revenue & Business Model; Unit Economics", note: "Site count is GAP (G4) — volumes must be inferred, Flag F7" },
      { id: "P15", name: "Enterprise fixed-site price", baseline: "$140–500 /mo (ARPU table)", tag: "X", source: "Pricing table", note: "Conflicts with $500–2,000/month in Unit Economics prose — Flag F6" },
      { id: "P16", name: "Maritime contract value", baseline: "$30K–300K /yr /vessel", tag: "X", source: "Pricing table; Strategic Opportunity", note: "" },
      { id: "P17", name: "Aviation contract value", baseline: "~$300K /yr", tag: "X", source: "Pricing table", note: "" },
      { id: "P18", name: "D2D consumer ARPU", baseline: "$1–3 /month", tag: "X", source: "Pricing table; Revenue Model", note: "Adoption gate: ≥15% of Galaxy users in covered areas (Phase 3); ~200M devices/yr shipped" },
      { id: "P19", name: "Sovereignty premium", baseline: "10–30% markup over incumbent LEO pricing", tag: "X", source: "Pricing hypothesis", note: "THE thesis parameter. R2 sets it to ~0" },
      { id: "P20", name: "Commodity capacity floor", baseline: "$0.30 /GB", tag: "X", source: "Constraints (Incumbent Price Dumping)", note: "Dumping world pushes wholesale toward this floor" },
      { id: "P21", name: "User terminal cost trajectory", baseline: "BOM <$450 @1M units → <$200 Phase 3", tag: "L", source: "Unit Economics; Pricing/Partnership tables", note: "Benchmark: Starlink $599, Kuiper ~$400. ITAR/EAR can inflate hardware 20–50% (R8)" },
      { id: "P22", name: "Regulatory timeline per market", baseline: "12–24 mo gauntlet; gateway siting +6–18 mo", tag: "X", source: "Adoption Friction; Workflow Pain Points", note: "World-sensitive delay parameter; shifts revenue ramps right" },
    ],
  },
  {
    title: "A3 · Financial block — settings, not parameters",
    params: [
      { id: "P23", name: "Corporate hurdle rate", baseline: "IRR 11–13% treated as clearing it", tag: "X", source: "Financial Sensitivities", note: "" },
      { id: "P24", name: "Horizon", baseline: "10–12 years (15 modeled)", tag: "X", source: "Revenue & Business Model", note: "Revenue target at Year 10; lifespan cycles beyond" },
    ],
  },
];

export const DERIVATIONS = [
  "From C6:  $1.4B ÷ $20M  =  70 flights for the full constellation",
  "From P1:  3,500 ÷ 70  =  ~50 satellites per flight  (P7)",
  "From P6 ÷ P5:  $80M ÷ $2,000/kg  =  40,000 kg payload / flight;  ÷ 50  =  ~800 kg per satellite  (P4)",
  "Cross-check:  800 kg × $2,000/kg + <$0.5M build  ≈  $2.1M delivered  × 3,500  ≈  $7.4B space capex — inside the $10–12B envelope (C1)  ✓",
  "From P1 ÷ P8:  3,500 ÷ 5 yr  ≈  700/yr replenishment  (P9) — matches the memo's own 700–875 range  ✓",
];

export const RISKS = [
  { id: "R1", risk: "MNOs refuse gateway co-investment", rating: "HIGH / CRITICAL", mapping: "P11: 50% → 0%", consequence: "Breakeven +2–3 yrs (= C7); requires extra Phase 2 capital" },
  { id: "R2", risk: "Sovereign willingness-to-pay absent / premium too low", rating: "HIGH / CRITICAL", mapping: "P19 → ~0%", consequence: "Revenue model fails; kill trigger if no LOIs (\"THESIS KILLER\")" },
  { id: "R3", risk: "Launch capacity bottleneck", rating: "Trends: HIGH", mapping: "P5 ↑, P6 ↑, schedule slips", consequence: "85% of non-US/non-Chinese capacity booked through 2029; threatens schedule and breakeven" },
  { id: "R4", risk: "Incumbent price dumping", rating: "unrated", mapping: "P20 binds; wholesale ↓", consequence: "\"Revenue model will fail to clear the breakeven threshold\"" },
  { id: "R5", risk: "Regulatory access not granted preferentially", rating: "MEDIUM / HIGH", mapping: "P22 ↑; market toggles", consequence: "Market entry strategy fails per-market" },
  { id: "R6", risk: "GTM repeatability bottleneck", rating: "HIGH / MEDIUM", mapping: "ramp speed ↓; entry cost ↑", consequence: "Each market a bespoke 9–18 mo project" },
  { id: "R7", risk: "COTS components fail LEO radiation environment", rating: "kill condition", mapping: "P3 > $500K", consequence: "\"Gross margin targets cannot be met\" (breaks C5)" },
  { id: "R8", risk: "ITAR/EAR export controls block target markets", rating: "kill condition", mapping: "market toggles off; P21 +20–50%", consequence: "\"Global TAM collapses\"" },
  { id: "R9", risk: "MNO channel lock-out (incumbent exclusives)", rating: "kill condition", mapping: "segment demand toggles off", consequence: "Abandon B2B2C GTM; assess B2G-only at reduced scale" },
  { id: "R10", risk: "Talent deficit (400 hires from standing start)", rating: "HIGH", mapping: "deployment delay; opex ↑", consequence: "Execution capability \"severely compromised\"" },
  { id: "R11", risk: "Qualcomm/MediaTek reach NTN parity — device moat erodes", rating: "\"most underestimated risk\"", mapping: "P18 adoption ↓; D2D edge → 0", consequence: "Device moat eroded \"without building a single satellite\"" },
  { id: "R12", risk: "Corporate antibody rejection / culture clash", rating: "unrated", mapping: "NONE — model-external", consequence: "Deliberately unmapped: forcing it into a parameter would be false quantification. Lives in the qualitative layer" },
];

export const FLAGS = [
  { id: "F1", title: "Launch $/kg: total vs. premium", body: "The memo calls $1,500–2,500/kg a \"cost penalty vs. vertically integrated competitors\" in some places and a total payload-to-orbit cost in others. Adopted: total cost to orbit, baseline $2,000/kg — the Phase 1 gate \"secure capacity below $2,000/kg\" only makes sense as a price. The \"penalty\" is the delta vs. SpaceX internal (~$900–1,150/kg implied by its ~$20M flight cost). Both framings then cohere." },
  { id: "F2", title: "Capex envelope: three different ranges", body: "Decision section: $8.5–10.0B. Revenue & Finance: $10–12B. Terms risk row: $10–18B. Adopted: calibrate to $10–12B (the finance section's own number, consistent with the −$8.5B Year-5 trough plus post-trough spend). The $10–18B reads as a stress envelope, the $8.5–10B as the constellation-build subset." },
  { id: "F3", title: "Operating margin language", body: "\"High double-digit operating margins\" (Exec Summary) vs. \"high-20% operating margins\" (everywhere else). Adopted: high-20s. 40–50% gross supporting high-20s operating is internally consistent; supporting 70–90% operating is not." },
  { id: "F4", title: "Manufacturing capacity can't sustain replenishment", body: "Assembly scale is stated at 500 units/yr, but a 5-year lifespan on 3,500 satellites demands 700–875/yr replacement — the memo says so itself in the adjacent row. Steady state is undersupplied by 30–40%, and the capex to close the gap isn't budgeted anywhere visible. Genuine memo incoherence — found purely by forcing prose into a schema." },
  { id: "F5", title: "Satellite cost: <$500K vs. <$300K", body: "Solution Design targets <$500K per satellite; the unit-economics table targets <$300K per chassis. Adopted: $300K chassis + payload/integration ⇒ <$500K all-in. Model uses $500K baseline with $300K as an optimistic-world value." },
  { id: "F6", title: "Enterprise pricing: two ranges", body: "Unit Economics prose: $500–2,000/month. Pricing table: $140–500/mo (matching Starlink benchmark + 10–30% premium). Adopted: pricing-table values, treating $500–2,000 as a premium-tier subset. The table is benchmarked; the prose is not." },
  { id: "F7", title: "The memo prices everything and counts almost nothing", body: "Prices per site, per vessel, per user are all cited; the NUMBER of backhaul sites, vessels, connections, and D2D subscribers per year appears nowhere. Volumes are reverse-engineered from C9 (>$10B by Year 10) and sanity-checked against the $32B serviceable market. The largest single assumption load in the model, declared as such — and the sharpest upstream finding: memos should ship volume ramps, not just price points." },
];
