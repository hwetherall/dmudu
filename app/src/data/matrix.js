// The 5×4 strategy grid — NPV @ 11% hurdle, $B (deck slide 13).
// S1's row inherits the memo calibration; S2–S5 revenue ramps are declared
// judgments. Regret is computed live from these NPVs, not stored.

export const STRATEGIES = [
  { id: "S1", name: "Plan-as-written", archetype: "build it all",
    desc: "The memo's plan: full 3,500-satellite constellation, all segments, $10–12B committed. The row every other strategy is measured against.",
    provenance: "inherits the calibrated baseline",
    levers: ["P1 · 3,500 satellites — the full constellation", "P2 · 500-satellite first tranche, lower-latitude optimized", "all segments: backhaul, enterprise, maritime, aviation, D2D", "$10–12B of capital committed"],
    bet: "The sovereignty premium is real AND launch stays affordable enough — pay the full structural tax, collect the full prize.",
    memoSrc: "The memo's recommended architecture. Its only hedge is the Phase-1 gate — it never proposes a smaller plan." },
  { id: "S2", name: "Regional-1000", archetype: "shrink it",
    desc: "A smaller, slower constellation (~1,000 satellites) constrained to the premium regional beachheads — the memo's own pivot row, taken seriously.",
    provenance: "declared ramp",
    levers: ["P1 · ~1,000 satellites", "premium regional beachheads only", "slower pacing — capital staged, exposure capped"],
    bet: "The premium is real but the launch tax may be too — keep the sovereign thesis, shrink the structural exposure to it.",
    memoSrc: "The memo's own pivot row (its W1-style fallback), promoted from a table cell to a full strategy." },
  { id: "S3", name: "D2D-only", archetype: "change the product",
    desc: "Memo Alternative #2 — a direct-to-device constellation only, anchored on the Galaxy device moat rather than broadband capacity.",
    provenance: "declared ramp",
    levers: ["constellation re-sized for narrowband D2D — smaller, lighter satellites, less launch mass", "product: messaging, voice, IoT to unmodified Galaxy phones", "drops enterprise broadband entirely"],
    bet: "Capacity becomes a commodity but the device moat doesn't — monetize ~200M Galaxy devices a year, not bandwidth. Trades $10–50K/month backhaul sites for $1–3/month consumers.",
    memoSrc: "Memo Alternative #2 (Narrowband IoT & D2D-exclusive constellation) — the memo itself notes it directly mitigates the $/kg launch penalty." },
  { id: "S4", name: "Gateway-as-a-Service", archetype: "sell shovels",
    desc: "Memo Alternative #1 — no constellation at all. Sell sovereignty-compliance infrastructure (gateways, intercept, licensing) to whoever wins — including the incumbents in W3.",
    provenance: "declared ramp (anchored to OneWeb-class trajectories)",
    levers: ["P1 · 0 satellites — no constellation, no launch dependency", "build: in-country gateways, lawful-intercept infrastructure, secure data centers", "customer: whichever operator wins each market — incumbents included"],
    bet: "Sovereignty compliance is the bottleneck, not orbital capacity — own the toll booth of the white space instead of the traffic.",
    memoSrc: "Memo Alternative #1 (Sovereign-Gateway-as-a-Service), parked in an appendix. The memo's own table says it eliminates the $10B capex and the launch dependency." },
  { id: "S5", name: "Components", archetype: "walk away",
    desc: "The walk-away benchmark: terminal/chipset supplier position, no operator role. Gives the regret math its floor.",
    provenance: "declared ramp",
    levers: ["no operator role at all", "sell terminals, chipsets, NTN modems to whoever builds constellations"],
    bet: "Stay out of the capex war entirely and participate through silicon. Not a recommendation — the benchmark every operator strategy must beat.",
    memoSrc: "Constructed for the analysis and declared as such — the memo never prices walking away, which is itself a finding." },
];

export const WORLD_IDS = ["W1", "W2", "W3", "W4"];
export const WORLD_SHORT = { W1: "Gated Orbits", W2: "Sovereign Plenty", W3: "Incumbent Citadel", W4: "Contested Commodity" };

// NPV @ 11% hurdle, $B
export const NPV = {
  S1: { W1: -1.87, W2: 3.57, W3: -5.71, W4: -2.73 },
  S2: { W1: 0.72, W2: 2.01, W3: -2.11, W4: -0.84 },
  S3: { W1: 0.51, W2: 1.45, W3: 0.16, W4: 0.29 },
  S4: { W1: 2.17, W2: 2.90, W3: 1.44, W4: 0.35 },
  S5: { W1: 0.35, W2: 0.71, W3: 0.23, W4: 0.59 },
};

export function bestInWorld(w) {
  return Math.max(...Object.values(NPV).map(row => row[w]));
}
export function regretOf(s, w) {
  return bestInWorld(w) - NPV[s][w];
}
export function maxRegret(s) {
  return Math.max(...WORLD_IDS.map(w => regretOf(s, w)));
}
export function minimaxStrategy() {
  return Object.keys(NPV).reduce((a, b) => (maxRegret(a) <= maxRegret(b) ? a : b));
}
