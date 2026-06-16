# Grammar

> Samsung LEO · Deep Uncertainty Workbench
> Innovera · the worked example behind the Pedram pack · every number cited, derived, computed, or declared

**The grammar — XLRM (Lempert / RAND), operationalized literally**

## Four kinds of thing, and who is allowed to touch each

XLRM is usually a workshop checklist. Here it is enforced as a type system: every one of the 24 extracted parameters carries a tag, and the tag determines who may move it. The diagram below is the whole architecture of the workbench.

---

## How the four actors relate

Flow: a future (**X**) and a plan (**L**) feed into the model (**R**), which computes the metrics (**M**).
`X (worlds set X)` and `L (strategies set L)` → `R (computes)` → `M`

### X · Exogenous uncertainties
*the world decides*
The dials Samsung cannot turn. They are exactly the level-3 uncertainties — and only worlds are allowed to move them.
Examples: P5 · launch $/kg · P19 · sovereignty premium · P11 · MNO co-invest share · P20 · $0.30/GB price floor · P22 · regulatory timelines

### L · Levers
*Samsung decides*
The dials Samsung does control. A strategy is nothing more than a setting of these — and only strategies may move them.
Examples: P1 · constellation size · P2 · first tranche · P12 · specialist headcount · P21 · terminal cost path · build vs. partner vs. walk away

### R · Relationships
*the model computes*
The economic machinery connecting choices to outcomes: ~200 auditable lines — deployment schedule, replenishment on lifespan, COGS ramp, free cash flow. It is the only thing allowed to produce numbers.
Examples: build + replenishment → capex · prices × volumes → revenue · gross − opex − capex → FCF

### M · Metrics
*read, never asserted*
What the decision is judged on. Every value is computed by R — never quoted from prose, never estimated by the LLM.
Examples: breakeven year · cash trough · IRR · Y10 revenue · regret, across worlds

*Read it left to right: a future (X) meets a plan (L) inside the model (R), and what comes out (M) is the only place numbers are allowed to come from. The same R is reused for every world × strategy pair — 20 runs, one engine.*

---

## The safety rail — confabulation becomes a type error

The most seductive analytical failure is a story where a strategy quietly improves the weather, or a scenario quietly fixes the plan. In this grammar those stories are unwriteable — the schema rejects them the way a compiler rejects a type error:

```
> world.set("P1", 1000)          // a 'world' tries to shrink the constellation
SchemaError: P1 (constellation size) is L-tagged — Samsung-owned. Worlds may move only X. REJECTED.

> strategy.set("P19", 0.30)      // a 'strategy' tries to raise the sovereignty premium
SchemaError: P19 (sovereignty premium) is X-tagged — world-owned. Strategies may move only L. REJECTED.
```

> The LLM's role is upstream of the rail: it frames the worlds and proposes which X-dials they move. The numbers themselves are delivered by the ~200-line engine, every time. **The split is what makes every figure in this app auditable.**

---

## A worked example — one world, traced through all four letters

**X · The world moves its dials**
World W1 'Gated Orbits' is nothing but an X-vector: launch $2,400/kg (top of the memo's range), MNO co-invest 60%, revenue ×0.95, deployment and revenue each one year late.

**L · The levers stay where the strategy put them**
The strategy under test is the plan-as-written, so every lever holds: 3,500 satellites, 500-satellite first tranche, all segments. W1 is not allowed to shrink the constellation for Samsung — that would be a strategy's move.

**R · The engine recomputes — no one narrates**
+$400/kg works through the machinery: about +$0.32M per satellite, roughly +$1.1B over the build — and more on every replenishment cycle, forever. Every revenue column shifts one year right.

**M · The metrics fall out, and the verdict reads them**
IRR comes out at 4.8% against the 5% DIE cutoff that was fixed before any world ran. Verdict: DIE — reported as a boundary case, not nudged to either side.

Next: see W1 run in full — the Worlds tab → · see every parameter and its tag — Extract →
