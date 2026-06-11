# Samsung LEO · Deep Uncertainty Workbench

The interactive companion to `pedram-pack-v2.pptx`. Hosts the world dashboard
(`fable-outputs/world-dashboard.jsx`) and extends it with every other artifact
from the exercise, as seven tabs that mirror the deck's arc:

| Tab | Source artifact |
|---|---|
| Overview | deck slides 2–4 (the wall, the method, XLRM) |
| 1 · Extract | `samsung-model-schema-v0.1.md` — 24 parameters, 12 risks, 7 flags, derivations |
| 2 · Calibrate | `calibration-report-v0.1.md` — anchors, the three findings |
| 3–4 · Worlds | the original world dashboard — live engine, deltas, chart, commentary |
| 5 · Regret | deck slides 11–13 — plan verdicts (computed live), regret primer, the 5×4 matrix |
| 6 · Pathway | `pathway-v0.1.md` — triggers, no-regret moves, the re-instantiation loop |
| Findings | deck slides 17–18 — everything surfaced + the five open questions |

The cash engine (`src/engine.js`) is ported line-for-line from
`fable-outputs/model.py` and verified to reproduce its outputs to the decimal
(baseline Y12 / −$8.76B / 11.2%, and all four worlds). Regret figures are
computed live from the NPV grid, not stored — they reproduce slide 13 exactly.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static bundle in dist/ — host anywhere
npm run preview   # serve the built bundle
```

Tabs are linkable: `#worlds`, `#regret`, etc.
