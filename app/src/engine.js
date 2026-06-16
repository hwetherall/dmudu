// The economic engine — ported line-for-line from model.py (verified against
// the Python outputs to the decimal). Deterministic annual cash model, $B.
export const P0 = { satCost: 0.5, mass: 800, kg: 2000, lifespan: 5, gatewayTotal: 2.0, coinvest: 0.5,
  otherCapex: 0.5, eng: 0.12, satOpsK: 30, sga: 0.12, cogsStart: 0.70, cogsFloor: 0.55, cogsRamp: 5 };
export const DEPLOY = { 1: 2, 2: 50, 3: 500, 4: 1300, 5: 1648 };
export const REVENUE = { 3: 0.30, 4: 1.00, 5: 2.50, 6: 4.50, 7: 7.00, 8: 9.50, 9: 10.20, 10: 10.80, 11: 11.50, 12: 12.20 };
export const GROWTH = 0.06, H = 15;

export function run(p, deploy, revenueBase, revDelay) {
  const rev = {};
  Object.entries(revenueBase).forEach(([y, v]) => { rev[Number(y) + revDelay] = v; });
  const revYears = Object.keys(rev).map(Number);
  const firstRev = Math.min(...revYears), maxRev = Math.max(...revYears);
  const launched = []; let cum = 0; const rows = [];
  const costPerSat = p.satCost / 1000 + (p.mass * p.kg) / 1e9; // $B per satellite, delivered

  for (let y = 1; y <= H; y++) {
    const build = deploy[y] || 0;
    const repl = launched.filter(([yy]) => y - yy === p.lifespan).reduce((s, [, n]) => s + n, 0);
    const sats = build + repl;
    launched.push([y, sats]);
    const active = launched.filter(([yy]) => y - yy < p.lifespan).reduce((s, [, n]) => s + n, 0);

    const spaceCapex = sats * costPerSat;
    const gw = y >= 2 && y <= 5 ? (p.gatewayTotal * (1 - p.coinvest)) / 4 : 0;
    const other = y <= 5 ? p.otherCapex / 5 : 0;
    const capex = spaceCapex + gw + other;

    let r = rev[y] || 0;
    if (y > maxRev) r = rev[maxRev] * Math.pow(1 + GROWTH, y - maxRev);
    const cogsF = Math.max(p.cogsFloor, p.cogsStart - ((p.cogsStart - p.cogsFloor) * Math.max(0, y - firstRev)) / p.cogsRamp);
    const gross = r * (1 - cogsF);
    const opex = p.eng + (active * p.satOpsK) / 1e6 + p.sga * r;
    const fcf = gross - opex - capex;
    cum += fcf;
    rows.push({
      year: y,
      build,
      repl,
      sats,
      active,
      rev: r,
      cogsRate: cogsF,
      gross,
      opex,
      spaceCapex,
      gatewayCapex: gw,
      otherCapex: other,
      capex,
      fcf,
      cum,
      costPerSat,
    });
  }
  return rows;
}

export function metrics(rows) {
  const trough = rows.reduce((a, b) => (b.cum < a.cum ? b : a));
  const be = rows.find(r => r.cum >= 0)?.year ?? null;
  const y10 = rows.find(r => r.year === 10);
  const cfs = rows.map(r => r.fcf);
  let lo = -0.5, hi = 1.0;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const npv = cfs.reduce((s, cf, j) => s + cf / Math.pow(1 + mid, j + 1), 0);
    if (npv > 0) lo = mid; else hi = mid;
  }
  return { trough: trough.cum, troughYr: trough.year, be, y10rev: y10.rev, irr: (lo + hi) / 2 };
}

// Verdict rule — fixed ex ante, before any world ran (slide 10).
export function verdictOf(m, C) {
  if (m.be === null || m.irr < 0.05) return { v: "DIE", color: C.bad, boundary: m.irr >= 0.04 && m.irr < 0.05 };
  if (m.irr >= 0.11 && m.be <= 12) return { v: "THRIVE", color: C.good, boundary: m.irr < 0.12 };
  return { v: "REWORK", color: C.mid, boundary: false };
}

export function runWorld(x) {
  const p = { ...P0, kg: x.kg, coinvest: x.coinvest };
  const deploy = {}; Object.entries(DEPLOY).forEach(([y, n]) => { deploy[Number(y) + x.dDelay] = n; });
  const rev = {}; Object.entries(REVENUE).forEach(([y, v]) => { rev[y] = v * x.mult; });
  const rows = run(p, deploy, rev, x.rDelay);
  return { rows, m: metrics(rows) };
}
