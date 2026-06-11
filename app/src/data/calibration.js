// Transcribed from calibration-report-v0.1.md — the memo's stated outcomes
// are the test suite; the model must reproduce them before it earns trust.

export const ANCHORS = [
  { id: "C1", target: "Cumulative capital to breakeven", memo: "$10–12B", model: "~$11.5B deployed through trough + build", pass: "pass" },
  { id: "C2", target: "Cumulative breakeven", memo: "Year 7–8", model: "Year 12", pass: "fail", note: "structural — see Finding 1" },
  { id: "C3", target: "Trough cash position", memo: "−$8.5B @ Y5", model: "−$8.76B @ Y5", pass: "pass" },
  { id: "C4", target: "IRR", memo: "11–13%", model: "11.2%", pass: "pass" },
  { id: "C5", target: "Operating margin at maturity", memo: "high-20s", model: "30.9% @ Y10", pass: "pass" },
  { id: "C9", target: "Revenue Year 10", memo: ">$10B", model: "$10.8B", pass: "pass" },
  { id: "C6", target: "Elasticity test 1 (+$20M/flight)", memo: "~$1.4B cash impact", model: "$1.40B — exact, untuned", pass: "pass", note: "held out as a test, not a fitting target" },
  { id: "C7", target: "Elasticity test 2 (co-invest refusal)", memo: "breakeven +2–3 yr", model: "reproduces only as a bundled event", pass: "partial", note: "see Finding 3" },
];

export const FINDINGS = [
  {
    n: 1, title: "The memo's anchors are mutually inconsistent — the mechanism is the replenishment wall",
    body: "With cited values (5-yr lifespan), the Y4–5 build cohorts (~2,950 satellites) fall due for replacement in Y9–10 at ~$6.2B — exactly when the memo expects cumulative breakeven consolidation. Five of six financial anchors cohere around a Year 9–12 breakeven; the Year 7–8 claim (C2) is the orphan.",
    detail: "Inversion — what Year 7–8 breakeven requires: a 7-yr satellite lifespan (contradicting the memo's own 4–5), ~50% cash margins from Y6, and $10B revenue by Y8. That variant yields IRR 26% — which the memo's stated 11–13% contradicts. Conclusion: the memo's financial claims were emitted by at least two mutually inconsistent implicit models. The IRR/margin/trough cluster is the credible one.",
  },
  {
    n: 2, title: "Launch elasticity reproduces exactly",
    body: "+$20M per flight deepens the cash requirement by precisely $1.40B with no tuning (70 flights × $20M, mechanically). The model's derivative structure matches the memo's — strong evidence it is a faithful proxy, not an invention.",
    detail: null,
  },
  {
    n: 3, title: "Co-investment refusal is a commercial event, not a financing one",
    body: "Pure capex absorption (P11: 50% → 0%) moves breakeven by roughly zero years — far short of the memo's \"+2–3 years.\" The memo's number reproduces only if refusal also costs ~1 year of revenue ramp (the lost MNO co-sell channel).",
    detail: "Adopted R1 mapping: mno_coinvest_share → 0 AND ramp_delay ≈ 1 yr. The memo's pivot-row number is recoverable, but only under the bundled reading — which means the model has now told us what kind of event the risk actually is.",
  },
];

export const ASSUMPTIONS = [
  { id: "G1", text: "Gateway program $2.0B total (Samsung share per P11); other capex $0.5B (Y1–5)" },
  { id: "G2", text: "400 specialists @ $300K loaded cost" },
  { id: "G3", text: "COGS 70% → 55% over 5 yrs; SG&A 12% of revenue; satellite ops $30K/yr each" },
  { id: "G4", text: "Revenue ramp reverse-engineered to C9 (segment split deferred to v0.2)" },
];
