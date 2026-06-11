# Samsung LEO Venture — Extracted Model Schema v0.1

**Purpose.** Single source of truth for the economic model. Every baseline value is cited to the memo section it came from. Tags: **X** = exogenous (worlds may move it), **L** = lever (strategies may move it), **D** = derived (computed from cited values — not stated in the memo), **GAP** = required by the model but absent from the memo (assumption must be declared).

**Rule.** Worlds touch only X. Strategies touch only L. Nothing touches D directly (it recomputes). Every GAP assumption is logged in §E and is a candidate memo-pipeline improvement.

---

## A. Parameter Table

### A1. Deployment & Cost Block

| ID | Parameter | Baseline | Tag | Source (memo section) | Notes |
|----|-----------|----------|-----|----------------------|-------|
| P1 | Constellation size (full) | 3,500 satellites | L | Executive Summary; Capability Fit | Strategy alternatives change this radically (D2D-only: smaller; GaaS: zero) |
| P2 | Initial deployment tranche | 500 satellites, lower-latitude optimized | L | Service Rollout | Phase 2 gate: 50–100 sats |
| P3 | Satellite unit cost | <$500K (target) | L | Solution Design; Unit Economics | ⚠️ Unit-econ table says <$300K/chassis — see Flag F5. Realized value is hostage to COTS radiation outcome (R7) |
| P4 | Satellite mass | ~800 kg | D | — | Derived: $80M/flight ÷ $2,000/kg = 40t payload; ÷ ~50 sats/flight = 800 kg. Plausible (Starlink V2-mini class). See §C derivation |
| P5 | Launch cost ($/kg to orbit) | $2,000/kg baseline (range $1,500–2,500) | X | Decision; Unit Economics; Phase 1 gate "<$2,000/kg" | ⚠️ Interpretation Flag F1: total cost, not premium |
| P6 | Cost per flight | $80M baseline | X | Constraints ("commercial launch rates near $80M per flight") | Market rate $62–74M/Falcon 9; SpaceX internal ~$20M (Unit Economics) |
| P7 | Satellites per flight | ~50 | D | — | Derived from elasticity test C6: $1.4B ÷ $20M = 70 flights; 3,500 ÷ 70 = 50 |
| P8 | Satellite lifespan | 5 years (range 4–5) | X | Unit Economics; COGS note (5-yr amortization) | Drives replenishment capex forever |
| P9 | Replenishment rate | 700–875 satellites/yr | D | Unit Economics ("Orbital Replenishment") | = P1 ÷ P8. ⚠️ Conflicts with P10 — Flag F4 |
| P10 | Satellite manufacturing capacity | 500 units/yr | L | Unit Economics ("automotive-grade assembly at 500 units/yr scale") | ⚠️ Cannot sustain P9 replenishment — Flag F4 |
| P11 | Gateway capex — MNO co-investment share | ≥50% | X | Partnership table ("≥50% gateway CapEx co-investment"); Phase 2 gate | The level of gateway capex per market is a GAP (G1). The share is the risk-critical parameter (R1) |
| P12 | Specialist headcount | 400 aerospace engineers from zero | L | Decision; Capability Fit | Salary/loaded-cost assumption is GAP (G2); feeds opex |
| P13 | Operating cost structure | Not quantified | GAP | — | G3: model as per-satellite ops + ground segment + SG&A % — assumption to declare |

### A2. Revenue Block

| ID | Parameter | Baseline | Tag | Source | Notes |
|----|-----------|----------|-----|--------|-------|
| P14 | Telecom backhaul / SLA node price | $10K–50K/month/site | X | Revenue & Business Model; Unit Economics | Site count is GAP (G4) — volumes must be inferred, see Flag F7 |
| P15 | Enterprise fixed-site price | $140–500/mo (ARPU table) | X | Pricing table | ⚠️ Conflicts with "$500–$2,000/month" in Unit Economics prose — Flag F6 |
| P16 | Maritime contract value | $30K–300K/yr/vessel | X | Pricing table; Strategic Opportunity ("up to $300K annually per vessel") | |
| P17 | Aviation contract value | ~$300K/yr | X | Pricing table | |
| P18 | D2D consumer ARPU | $1–3/month | X | Pricing table; Revenue Model | Adoption gate: ≥15% of Galaxy users in covered areas (Phase 3); ~200M devices/yr shipped |
| P19 | Sovereignty premium | 10–30% markup over incumbent LEO pricing | X | Pricing hypothesis ("central pricing hypothesis") | **The thesis parameter.** R2 sets it to ~0 |
| P20 | Commodity capacity floor | $0.30/GB | X | Constraints ("Incumbent Price Dumping") | Dumping world pushes wholesale toward this floor |
| P21 | User terminal cost trajectory | BOM <$450 @1M units → price <$400 → <$299 at Phase-2 scale → <$200 Phase 3 | L | Unit Economics; Pricing table; Partnership table | Benchmark: Starlink $599, Kuiper ~$400. ITAR/EAR can inflate hardware 20–50% (R8) |
| P22 | Regulatory timeline per market | 12–24 month gauntlet; gateway siting adds 6–18 months | X | Adoption Friction; Workflow Pain Points | World-sensitive delay parameter; shifts revenue ramps right |

### A3. Financial Block — settings, not parameters

| ID | Item | Value | Source |
|----|------|-------|--------|
| P23 | Corporate hurdle rate | Implied by "IRR below corporate hurdle rate" language; treat IRR 11–13% as clearing it | Financial Sensitivities |
| P24 | Horizon | 10–12 years (revenue target at Year 10; lifespan cycles beyond) | Revenue & Business Model |

---

## B. Calibration Targets — outputs the model must reproduce before it earns trust

| ID | Target | Value | Source | Role |
|----|--------|-------|--------|------|
| C1 | Cumulative capital to breakeven | $10–12B | Revenue & Business Model; Finance & Operations | ⚠️ Conflicting ranges elsewhere — Flag F2. Calibrate to $10–12B |
| C2 | Cash-flow breakeven | Year 7–8 | Throughout (Decision, Exec Summary, Finance) | Primary calibration anchor |
| C3 | Trough cash position | −$8.5B in Year 5 | Finance & Operations | Shape anchor for the cash curve |
| C4 | IRR / payback | 11–13% / 5–7 years | Revenue & Business Model | Secondary anchors |
| C5 | Margin structure | Gross 40–50% required; operating high-20% at maturity | Unit Economics; Finance | Margin anchor |
| C6 | **Elasticity test 1** | $20M change in cost/flight ⇒ $1.4B change in cumulative cash requirement | Financial Sensitivities | Free unit test — model must reproduce this derivative |
| C7 | **Elasticity test 2** | MNO co-investment refusal (Samsung absorbs full gateway capex) ⇒ breakeven extends 2–3 years | Decision Tree, PIVOT row | Second free unit test — directly validates the R1→P11 mapping |
| C8 | Delay sensitivity | 24-month deployment delay or ARPU drop ⇒ IRR below hurdle, breakeven beyond Year 10 | Financial Sensitivities | Qualitative-shape test |
| C9 | Revenue scale | >$10B annual revenue by Year 10 | Exec Summary; Revenue Model | Used to back out segment volumes (Flag F7) |

---

## C. Derivations (shown so they can be audited)

From C6: $1.4B ÷ $20M = **70 flights** for full constellation.
From P1 and 70 flights: 3,500 ÷ 70 = **~50 satellites per flight** (P7).
From P6 and P5: $80M ÷ $2,000/kg = **40,000 kg payload per flight**; ÷ 50 sats = **~800 kg per satellite** (P4).
Cross-check: 800 kg × $2,000/kg = $1.6M launch cost per satellite + <$0.5M manufacturing ⇒ ~$2.1M per satellite delivered to orbit × 3,500 ≈ **$7.4B space-segment capex**, leaving ~$3–4B for gateways, terminals, opex-to-breakeven within the $10–12B envelope (C1). Coherent.
From P1 ÷ P8: 3,500 ÷ 5 yr ≈ **700/yr replenishment** (P9) — matches memo's 700–875 range. ✔

---

## D. Risk Register (baseline, to be delta'd per world)

| ID | Risk | Memo rating (Prob/Sev) | Parameter mapping | Memo-stated consequence | Source |
|----|------|------------------------|-------------------|------------------------|--------|
| R1 | MNOs refuse gateway co-investment | HIGH / CRITICAL | P11: 50% → 0% | Breakeven +2–3 yrs (= C7); requires extra Phase 2 capital | Risk table; Decision Tree PIVOT |
| R2 | Sovereign willingness-to-pay absent / premium too low | HIGH / CRITICAL | P19: → ~0% | Revenue model fails; kill trigger if no LOIs | Risk table; Assumptions ("THESIS KILLER"); Decision Tree |
| R3 | Launch capacity bottleneck | Trends: HIGH (85% of non-US/non-Chinese capacity booked through 2029) | P5 ↑, P6 ↑, deployment schedule slips (feeds C8) | Threatens 3,500-sat schedule and Yr 7–8 breakeven | Risk Profile; Constraints |
| R4 | Incumbent price dumping | Stated in Constraints (no rating) | P20 binds; wholesale rates ↓ | "Revenue model will fail to clear the breakeven threshold" | Constraints; Revenue Model |
| R5 | Regulatory access not granted preferentially | MEDIUM / HIGH | P22 ↑; market-availability toggles | Market entry strategy fails per-market | Risk table; Kill conditions |
| R6 | GTM repeatability bottleneck | HIGH / MEDIUM | Per-market ramp speed ↓; per-market entry cost ↑ | Each market a bespoke 9–18 mo project | Risk table; Takeaway 6 |
| R7 | COTS components fail LEO radiation environment | Unrated; kill condition | P3 > $500K | "Gross margin targets cannot be met" (breaks C5) | Next Steps #5; Weaknesses & Gaps |
| R8 | ITAR/EAR export controls block target markets | Unrated; kill condition | Market toggles off; P21 hardware cost +20–50% | "Global TAM collapses" | Next Steps #3; Workflow Pain Points; Legal Takeaway 3 |
| R9 | MNO channel lock-out (incumbent exclusives) | Unrated; kill condition | Segment demand toggles off in affected markets | Abandon B2B2C GTM; assess B2G-only at reduced scale | Decision Tree KILL; Takeaway 4 (competitive) |
| R10 | Talent deficit (400 hires from standing start) | Team risk: HIGH | Weak mapping: deployment delay (feeds C8); opex ↑ | Execution capability "severely compromised" | Capability Fit; T-Framework |
| R11 | Qualcomm/MediaTek reach NTN parity — device moat erodes | Competitive Takeaway 6 ("most underestimated risk") | P18 adoption ↓; D2D differentiation → 0 | Device moat eroded "without building a single satellite" | Competitive Analysis Takeaways 5–6 |
| R12 | Corporate antibody rejection / culture clash | Unrated | **No parameter mapping** — model-external | Venture fails under consumer-electronics product cycles | Finance & Operations (org structure note) |

**Register notes.** R12 is deliberately left unmapped — forcing it into a parameter would be false quantification; it belongs in the qualitative layer of each world verdict. R1 and R2 are the memo's two named thesis-level assumptions and arrive pre-quantified (C7) or pre-killed (LOI kill trigger) — they will anchor the conditional re-rating per world.

---

## E. Flags — ambiguities and inconsistencies (decisions needed before coding)

**F1 — Launch $/kg: total vs. premium.** The memo calls $1,500–2,500/kg a "cost penalty… compared to vertically integrated competitors" (Decision; Risk Profile) but elsewhere says third-party reliance "driv[es] payload-to-orbit costs **to** $1,500–2,500/kg" (Unit Economics) and sets a Phase 1 gate of securing capacity "below $2,000/kg" — a gate you can only set on a total price. **Adopted reading: total cost to orbit, baseline $2,000/kg; the "penalty" is the delta vs. SpaceX internal (~$900–1,150/kg implied by ~$20M internal flight cost).** Both framings then cohere.

**F2 — Capex envelope: three different ranges.** Decision section: $8.5–10.0B. Revenue & Business Model / Finance: $10–12B. Terms risk row: $10–18B. **Adopted: calibrate to $10–12B** (the finance section's own number, consistent with the −$8.5B Year-5 trough plus post-trough spend). The $10–18B reads as a stress envelope, the $8.5–10B as the constellation-build subset. Flag to Pedram as a memo-coherence finding either way.

**F3 — Operating margin language.** "High double-digit operating margins" (Exec Summary) vs. "high-20% operating margins" (everywhere else). **Adopted: high-20s.** "High double-digit" is almost certainly loose drafting; 40–50% gross supporting high-20s operating is internally consistent, supporting 70–90% operating is not.

**F4 — Manufacturing capacity can't sustain replenishment.** Assembly scale is stated at 500 units/yr (Unit Economics) but 5-year lifespan on 3,500 satellites demands 700–875/yr replacement — the memo says so itself in the adjacent row. Steady state is undersupplied by ~30–40%. Either capacity scales beyond 500/yr (capex not budgeted anywhere visible) or the constellation shrinks by attrition. **Genuine memo incoherence — surface to Pedram; in the model, make manufacturing capacity an explicit lever with a capex cost to expand.**

**F5 — Satellite cost: <$500K vs. <$300K.** Solution Design targets <$500K per satellite; the unit-economics table targets <$300K **per chassis**. **Adopted reading: $300K chassis + payload/integration ⇒ <$500K all-in.** Model uses $500K baseline with $300K as an optimistic-world value.

**F6 — Enterprise pricing: two ranges.** Unit Economics prose: enterprise connections at $500–2,000/month. Pricing table: enterprise fixed-site $140–500/mo (matching Starlink benchmark + 10–30% premium). **Adopted: pricing-table values ($140–500 base, premium applied via P19), treating $500–2,000 as a premium-tier subset.** The table is benchmarked; the prose is not.

**F7 — The memo prices everything and counts almost nothing.** Prices per site, per vessel, per user are all cited; the *number* of backhaul sites, vessels, enterprise connections, and D2D subscribers per year appears nowhere. Segment volumes must therefore be **reverse-engineered from C9 (>$10B by Year 10) and the segment mix**, then sanity-checked against TAM ($53B global / $32B serviceable, 35% capture noted in T-Framework). This is the largest single assumption load in the model and must be stated as such in the Pedram pack — and it is the sharpest concrete example of the upstream finding: *memos should ship volume ramps, not just price points*.

**Gaps requiring declared assumptions:** G1 gateway capex level per market (only the ≥50% share is sourced); G2 loaded cost per specialist (×400); G3 opex structure; G4 segment volume ramps (per F7).

---

## F. What the model build consumes from this document

Calibration sequence: fit segment ramps so C9, C2, C3 hold simultaneously → verify C6 and C7 emerge without further tuning (they are *tests*, not fitting targets) → freeze. Then and only then: worlds arrive as X-vectors, strategies as L-configurations, and the risk register re-rates conditionally per world.
