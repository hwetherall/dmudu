# Method

> Samsung LEO · Deep Uncertainty Workbench
> Innovera · the worked example behind the Pedram pack · every number cited, derived, computed, or declared

**The method — seven steps, run by hand**

## Predict-then-act becomes explore-then-adapt

Past the level-2/3 wall, the question changes from 'what will happen?' to 'which decision survives?'. The seven steps below answer it. Each one is a tab in this app — the numbers on those tabs are the actual output of running the method on the Samsung memo.

---

## The pipeline at a glance

1 · Extract → 2 · Calibrate → 3 · Worlds → 4 · Verdicts → 5 · Strategies → 6 · Matrix + Regret → 7 · Pathway ↻ re-instantiate as the world reveals itself

*Steps 1–2 build trust (the model must earn the right to be used). Steps 3–6 spend that trust (futures, verdicts, strategies, regret). Step 7 turns the analysis into something that lives past the meeting.*

---

## Step 1 · Extract

- **in:** the memo — 40 pages of prose
- **out:** a cited parameter schema: 24 parameters, 12 risks, 9 calibration targets, 7 flags

Every quantitative claim in the memo is pulled out, given an ID, cited to the section it came from, and tagged: X (the world decides it), L (Samsung decides it), D (derived — it recomputes), or GAP (required but absent — declared, never silently filled).

- **THE RULE ·** Nothing enters the model without a citation, a derivation, or a declared assumption.
- **WHY IT MATTERS ·** Extraction doubles as an audit: forcing prose into a schema surfaced two genuine incoherences in the memo (F4, F7) before any modeling began.

---

## Step 2 · Calibrate

- **in:** the schema + a ~200-line annual cash engine
- **out:** a baseline the model has earned the right to use

The memo's own stated outcomes — breakeven year, cash trough, IRR, margins, Year-10 revenue — become a test suite. The model must reproduce them before computing anything new. Two anchors were held out as pure tests, not fitting targets.

- **THE RULE ·** No deviation is computed until the baseline reproduces the memo.
- **WHY IT MATTERS ·** Six of seven anchors hit. The seventh broke — and the breakage is not a bug, it is the memo contradicting itself. That failure is Finding 1, the strongest result in the whole exercise.

---

## Step 3 · Worlds

- **in:** the deep-uncertain X parameters
- **out:** four worlds — each a pure exogenous parameter vector

Two axes that no study can resolve — does sovereignty demand stay fragmented or normalize? does launch access stay scarce or become abundant? — cross into four plausible futures. Each world is written down as nothing but X-parameter values: launch $/kg, co-invest share, revenue multiplier, delays.

- **THE RULE ·** Worlds may touch only X. A world that wants to change a lever is rejected by the schema.
- **WHY IT MATTERS ·** The futures stop being narratives and become inputs — something a model can actually run.

---

## Step 4 · Verdicts

- **in:** each world × the plan as written
- **out:** THRIVE / REWORK / DIE per world

The baseline plan runs through the engine under each world's X-vector. The verdict rule — IRR and breakeven thresholds — was fixed ex ante, before any world ran, so outcomes cannot be retro-fitted to a preferred story.

- **THE RULE ·** The verdict rule is frozen before the first world runs.
- **WHY IT MATTERS ·** Boundary cases get reported as boundaries (W1 lands at IRR 4.8% against a 5% cutoff) — not nudged to either side.

---

## Step 5 · Strategies

- **in:** Samsung's levers + the memo's own alternatives
- **out:** five structurally distinct strategies — each a pure L-configuration

The mirror image of step 3: where worlds were pure X-vectors, each strategy is a pure setting of Samsung's levers. The candidates are forced to span the whole response space — build it all, shrink it, change the product, sell shovels, walk away — three of them lifted from inside the memo itself.

- **THE RULE ·** Strategies may touch only L — they cannot wish the weather better.
- **WHY IT MATTERS ·** Diversity by construction: when one strategy later dominates the regret table, it is a result, not an artifact of a narrow menu.

---

## Step 6 · Matrix + Regret

- **in:** 5 strategies × 4 worlds — 20 runs
- **out:** an NPV grid, and the regret read off it

Every strategy runs under every world. Regret in a world is the gap to the best strategy in that world. Minimax regret picks the strategy whose worst miss is smallest: robust, rather than optimal-on-average.

- **THE RULE ·** Every cell comes from the same engine — no row gets a friendlier model.
- **WHY IT MATTERS ·** The recommendation stops depending on probabilities nobody can defend. No expected value is ever computed.

---

## Step 7 · Pathway

- **in:** the regret table + the worlds' observable differences
- **out:** signposts, triggers, staged commitment — and a re-instantiation loop

The worlds differ in observable ways years before the cash proves anything (a license event; price erosion). Those observables become signposts; signposts get tripwires; commitments are staged so capital is only released as the real world reveals which future it is.

- **THE RULE ·** Commit only what the observed world has licensed.
- **WHY IT MATTERS ·** The output is not a forecast but a monitoring system — a decision that adapts instead of a number that ages.

---

## The discipline behind the seven steps

Everything above was run **by hand, end to end, once** — before any automation. The point of doing it manually is to validate the method itself: where extraction is ambiguous, where calibration bites, which rules actually prevent confabulation. Only a method that has survived a full manual pass on a real memo earns the right to be productized.

*The division of labor throughout: the LLM frames worlds and proposes parameter shifts; the ~200-line engine — not the LLM — delivers every number. That split is enforced by the grammar on the next tab.*
