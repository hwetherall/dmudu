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
    n: 1, title: "The memo's numbers cannot all be true at once — and Year 7–8 breakeven is the odd one out",
    body: "This is the star result of the whole exercise, and it takes five sentences. No judgment is involved at any step — only the memo's own cited values, run through arithmetic.",
    steps: [
      "The memo says satellites last 5 years (P8). Take it at its word.",
      "The memo's build schedule puts ~2,950 satellites — 84% of the constellation — into orbit during Years 4–5.",
      "Five years later, in Years 9–10, every one of those satellites dies and must be replaced. The bill: ~$6.2B.",
      "That bill lands exactly inside the window where the memo claims cumulative breakeven (Year 7–8). You cannot cross zero while paying to rebuild five-sixths of your fleet.",
      "Run on the memo's own cited values, the model breaks even in Year 12 — and the memo's other five anchors (capital, trough, IRR, margin, Y10 revenue) all agree with Year 12, not with Year 7–8. The Year 7–8 claim is the orphan.",
    ],
    detail: "Cross-examination — what would Year 7–8 breakeven require? A 7-year satellite lifespan (the memo itself says 4–5), roughly 50% cash margins from Year 6, and $10B of revenue by Year 8. That variant of the venture would earn an IRR of 26% — which the memo's own stated 11–13% flatly contradicts. Conclusion: the memo's financial claims were emitted by at least two mutually inconsistent implicit models. The IRR / margin / trough cluster is the internally consistent one; the breakeven headline is not. Upstream consequence: financial claims should be emitted from one coherent model — which is precisely what this step builds.",
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
