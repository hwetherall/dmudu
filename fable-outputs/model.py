"""
Samsung LEO Venture - Economic Model v0.1
Implements samsung-model-schema-v0.1.md. Deterministic annual cash model.
Convention: cash basis. Capex is cash-out when incurred (no amortization).
Margins reported are cash operating margins. Year 1 = program start.
All $ in $B unless noted.
"""
import json

# ---------------- Parameters (IDs match schema) ----------------
P = dict(
    # Deployment & cost block
    sat_cost_m        = 0.5,     # P3  $M per satellite, all-in build
    sat_mass_kg       = 800,     # P4  derived
    launch_per_kg     = 2000,    # P5  $/kg, baseline (X)
    sats_per_flight   = 50,      # P7  derived
    lifespan_yr       = 5,       # P8  (X)
    # Gaps / declared assumptions
    gateway_capex_total = 2.0,   # G1  $B total gateway program (Samsung+MNO)
    mno_coinvest_share  = 0.50,  # P11 (X) MNO share of gateway capex
    other_capex_total   = 0.5,   # G1b R&D, terminals tooling, working capital ($B, yrs 1-5)
    eng_cost            = 0.12,  # G2  400 specialists x $300K loaded, $B/yr
    sat_ops_k           = 30,    # G3  $K per active satellite per year
    sga_frac            = 0.12,  # G3  SG&A as % revenue
    cogs_frac_start     = 0.70,  # G3  COGS % of revenue, year of first revenue
    cogs_frac_floor     = 0.55,  # G3  mature COGS % (gross margin 45%)
    cogs_ramp_years     = 5,
)

# Deployment schedule (L): satellites launched per year, initial build.
# Calibration discovers shape needed to satisfy C2+C3 jointly.
DEPLOY = {1: 2, 2: 50, 3: 500, 4: 1300, 5: 1648}     # sums to 3500 (P1)

# Revenue ramp (G4): $B/yr, reverse-engineered to satisfy C9 + C2 + C3.
# Mix held implicit at v0.1; segment split is v0.2 work.
REVENUE = {3: 0.30, 4: 1.00, 5: 2.50, 6: 4.50, 7: 7.00,
           8: 9.50, 9: 10.20, 10: 10.80, 11: 11.50, 12: 12.20}
GROWTH_AFTER = 0.06   # post-y12 revenue growth for IRR horizon

HORIZON = 15

def run(p=P, deploy=DEPLOY, revenue=None, ramp_delay_yr=0):
    rev_base = dict(REVENUE if revenue is None else revenue)
    # optional ramp delay (used for R1 bundled test): shift revenue right
    rev = {y + ramp_delay_yr: v for y, v in rev_base.items()}

    launched = []          # (year, count) cohorts for lifespan tracking
    cum, rows = 0.0, []
    cost_per_sat = p['sat_cost_m']/1000 + p['sat_mass_kg']*p['launch_per_kg']/1e9  # $B

    for y in range(1, HORIZON+1):
        # --- deployment: initial build + replenishment of expired cohorts
        build = deploy.get(y, 0)
        repl = sum(n for (yy, n) in launched if y - yy == p['lifespan_yr'])
        sats_this_year = build + repl
        launched.append((y, sats_this_year))
        active = sum(n for (yy, n) in launched if y - yy < p['lifespan_yr'])

        space_capex = sats_this_year * cost_per_sat
        gw = (p['gateway_capex_total'] * (1 - p['mno_coinvest_share']) / 4
              if 2 <= y <= 5 else 0)                       # spread yrs 2-5
        other = p['other_capex_total']/5 if y <= 5 else 0
        capex = space_capex + gw + other

        # --- revenue & operating cash
        r = rev.get(y, 0.0)
        if y > max(rev): r = rev[max(rev)] * (1+GROWTH_AFTER)**(y-max(rev))
        first = min(rev)
        cogs_f = max(p['cogs_frac_floor'],
                     p['cogs_frac_start'] - (p['cogs_frac_start']-p['cogs_frac_floor'])
                     * max(0, y-first)/p['cogs_ramp_years'])
        gross = r * (1 - cogs_f)
        opex = p['eng_cost'] + active*p['sat_ops_k']/1e6 + p['sga_frac']*r
        op_cash = gross - opex

        fcf = op_cash - capex
        cum += fcf
        rows.append(dict(year=y, sats=sats_this_year, active=active, rev=r,
                         op_margin=(op_cash/r if r else 0), capex=capex,
                         fcf=fcf, cum=cum))
    return rows

def metrics(rows):
    trough = min(rows, key=lambda r: r['cum'])
    be = next((r['year'] for r in rows if r['cum'] >= 0), None)
    y10 = next(r for r in rows if r['year'] == 10)
    # IRR on FCF, 15-yr horizon, no terminal value (conservative)
    cfs = [r['fcf'] for r in rows]
    irr = None
    lo, hi = -0.5, 1.0
    for _ in range(100):
        mid = (lo+hi)/2
        npv = sum(cf/(1+mid)**(i+1) for i, cf in enumerate(cfs))
        if npv > 0: lo = mid
        else: hi = mid
    irr = (lo+hi)/2
    return dict(trough=round(trough['cum'],2), trough_yr=trough['year'],
                breakeven_yr=be, y10_rev=round(y10['rev'],2),
                y10_op_margin=round(y10['op_margin'],3), irr=round(irr,3))

if __name__ == '__main__':
    base_rows = run()
    base = metrics(base_rows)
    print("BASELINE:", json.dumps(base))
    print(f"{'yr':>3} {'sats':>5} {'rev':>6} {'capex':>6} {'fcf':>6} {'cum':>7}")
    for r in base_rows:
        print(f"{r['year']:>3} {r['sats']:>5} {r['rev']:>6.2f} "
              f"{r['capex']:>6.2f} {r['fcf']:>6.2f} {r['cum']:>7.2f}")

    # --- Test C6: +$20M per flight on initial build (= +$400/kg at 50 sats/flight)
    p2 = dict(P); p2['launch_per_kg'] = P['launch_per_kg'] + 20e6/(P['sats_per_flight']*P['sat_mass_kg'])
    t1 = metrics(run(p2))
    print("\nC6 test (+$20M/flight): delta trough =",
          round(t1['trough'] - base['trough'], 2), "$B (memo: ~1.4 on initial build)")

    # --- Test C7a: pure capex effect of MNO co-invest refusal
    p3 = dict(P); p3['mno_coinvest_share'] = 0.0
    t2 = metrics(run(p3))
    print("C7a test (co-invest 50%->0%, capex only): breakeven",
          base['breakeven_yr'], "->", t2['breakeven_yr'],
          "| trough", base['trough'], "->", t2['trough'])

    # --- Test C7b: bundled reading (capex + 18mo revenue ramp delay, no MNO channel)
    t3 = metrics(run(p3, ramp_delay_yr=2))
    print("C7b test (capex + 2yr ramp delay): breakeven",
          base['breakeven_yr'], "->", t3['breakeven_yr'],
          "| trough", base['trough'], "->", t3['trough'])
