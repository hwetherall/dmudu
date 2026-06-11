# Calibration Report — Samsung LEO Model v0.1

Model: `model.py` (implements `samsung-model-schema-v0.1.md`). Cash basis, annual, 15-yr horizon, IRR on FCF with no terminal value.

## Baseline vs. calibration targets

| Target | Memo | Model v0.1 | Verdict |
|---|---|---|---|
| C1 Cumulative capital to breakeven | $10–12B | ~$11.5B deployed through trough+build | ✓ |
| C2 Cumulative breakeven | Year 7–8 | **Year 12** | ✗ — structural, see Finding 1 |
| C3 Trough | −$8.5B @ Y5 | −$8.76B @ Y5 | ✓ |
| C4 IRR | 11–13% | 11.2% | ✓ |
| C5 Operating margin at maturity | high-20s | 30.9% @ Y10 | ✓ |
| C9 Revenue Y10 | >$10B | $10.8B | ✓ |
| C6 elasticity (+$20M/flight) | ~$1.4B cash impact | $1.40B | ✓ exact, untuned |
| C7 co-invest refusal | breakeven +2–3 yr | see Finding 3 | ◐ requires bundled reading |

## Finding 1 — The memo's anchors are mutually inconsistent, and the mechanism is the replenishment wall
With cited values (5-yr lifespan, P8) the Y4–5 build cohorts (~2,950 satellites) fall due for replacement in Y9–10 at ~$6.2B — exactly when the memo expects cumulative breakeven consolidation. Five of six financial anchors (C1, C3, C4, C5, C9) cohere around a **Year 9–12** breakeven. C2 (Year 7–8) is the outlier.

**Inversion (what Y7–8 breakeven requires):** 7-yr satellite lifespan (contradicts P8) + ~50% cash margins from ~Y6 + revenue reaching $10B by Y8 (two years ahead of the memo's own target). That variant yields IRR 26% — which the memo's stated 11–13% IRR contradicts. Conclusion: **the memo's financial claims were emitted by at least two inconsistent implicit models.** The IRR/margin/trough cluster is the credible one; the Year 7–8 breakeven claim is not supported by the memo's own parameters.

## Finding 2 — Launch elasticity reproduces exactly
+$20M/flight ⇒ trough deepens $1.40B with no tuning (70 flights × $20M, mechanically). The model's derivative structure matches the memo's.

## Finding 3 — The R1 (co-investment refusal) mapping must be bundled
Pure capex absorption (P11: 50%→0%) moves breakeven ~0 years — far short of the memo's "+2–3 years." Under the fast-economics variant, **capex absorption + ~1-year revenue-ramp delay** (loss of MNO co-sell channel) reproduces breakeven +2 and trough ≈ −$10B. Adopted R1 mapping: `mno_coinvest_share→0` AND `ramp_delay≈1yr`. The memo's pivot-row number is recoverable, but only if refusal is understood as a commercial event, not just a financing one.

## Declared assumptions in force (from schema §E gaps)
G1 gateway program $2.0B total (Samsung share per P11); G1b other capex $0.5B (Y1–5); G2 400 specialists @ $300K loaded; G3 COGS 70%→55%, SG&A 12%, sat ops $30K/yr; G4 revenue ramp reverse-engineered to C9 (segment split deferred to v0.2).

## Status
Baseline frozen. Worlds may now be specified as X-vectors; strategies as L-configurations. Finding 1 goes to Pedram as a worked demonstration of extraction-as-audit; it is also the strongest available argument for the upstream memo-pipeline change (financial claims should be emitted from one coherent model).
