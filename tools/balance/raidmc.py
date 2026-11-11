# Raid Monte Carlo: expected outcome of an overseas raid for typical crews against every target.
# Targets, troops and goods values are read from the game source (no copies to keep in step).
# Mirrors arrive()/battle()/lootFor() in 14_people_lineage_morale_gods_r.js and the siege options.
# Usage (from tools/): python3 balance/raidmc.py [runs] [--th N]   (default 4000 runs, all crews)
import json, os, random, re, statistics as st, subprocess, sys

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'source', 'src')

def grab(text, start):
    """Return the balanced {...} or [...] literal that starts at text[start]."""
    open_c = text[start]; close_c = '}' if open_c == '{' else ']'; depth = 0; q = None
    for i in range(start, len(text)):
        c = text[i]
        if q:
            if c == q and text[i - 1] != '\\': q = None
            continue
        if c in '\'"`': q = c
        elif c == open_c: depth += 1
        elif c == close_c:
            depth -= 1
            if depth == 0: return text[start:i + 1]
    raise ValueError('unbalanced literal')

def load_game():
    a = open(os.path.join(SRC, '14_people_lineage_morale_gods_r.js')).read()
    b = open(os.path.join(SRC, '14_zcontent45.js')).read()
    troops = grab(a, a.index('const TROOPS=') + len('const TROOPS='))
    targets = grab(a, a.index('const TARGETS=') + len('const TARGETS='))
    i = b.index('Object.assign(TROOPS,') + len('Object.assign(TROOPS,'); troops2 = grab(b, i)
    i = b.index('TARGETS.push(') + len('TARGETS.push('); pushed = '[' + b[i:b.index(');', i)] + ']'
    basep = grab(b, b.index('const BASEP=') + len('const BASEP='))
    regions = grab(b, b.index('const REGIONS=') + len('const REGIONS='))
    js = ('const TROOPS=%s;Object.assign(TROOPS,%s);const T=%s.concat(%s);const BASEP=%s;const REGIONS=%s;'
          'console.log(JSON.stringify({troops:TROOPS,targets:T,basep:BASEP,regions:REGIONS},(k,v)=>typeof v==="function"?undefined:v));'
          % (troops, troops2, targets, pushed, basep, regions))
    out = subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout
    return json.loads(out)

G = load_game()
TROOPS, TARGETS, VAL, REGIONS = G['troops'], G['targets'], G['basep'], G['regions']
VAL.setdefault('animals', 7)
EAT_RAID = 0.5 * 1.5          # meals per man per day at sea (EAT × 1.5)
MEAL_SILVER = 0.4             # silver value of one meal
WARVAL = 30                   # silver-equivalent of a trained warrior lost (weapons + training + a worker)
CARGO_PER_SHIP, CREW_PER_SHIP = 120, 15   # karvi

def U(a, b): return random.uniform(a, b)
def travel(t): return max(2, round(t['d'] * 0.7))
def loot_for(t, mult):
    return {k: round(v * mult * 1.75 * 1.4 * U(0.85, 1.15)) for k, v in t['loot'].items()}
def loot_value(l, cap):
    units = sum(v * (0.1 if k == 'silver' else 1) for k, v in l.items())
    f = min(1, cap / units) if units else 1
    return sum(v * f * VAL.get(k, 1) for k, v in l.items())
def tgt_def(t, tactic, siege):
    d = t['def']
    if t.get('walls'): d *= 1.25 if siege else 1.6
    if tactic == 'quick': d *= 0.8
    return d

def sim(t, crew, xp, tactic, n, mult=1.0):
    base = sum(TROOPS[c]['str'] for c in crew) * (1 + 0.1 * min(3, xp)) * mult
    ships = -(-len(crew) // CREW_PER_SHIP); cap = ships * CARGO_PER_SHIP
    tr = travel(t); out = []
    est = base / tgt_def(t, tactic, tactic == 'siege')
    for _ in range(n):
        men = len(crew); days = 2 * tr; dead = 0; val = 0; win = False; tribute = False
        if est >= 2:                                   # they pay without a fight
            tribute = win = True; val = loot_value({k: v * 0.5 for k, v in loot_for(t, 1).items()}, cap)
        else:
            d = tgt_def(t, tactic, tactic == 'siege'); siege_days = 0
            if t.get('walls') and tactic == 'siege':   # hold the blockade, then storm on the last round
                rounds = 3 + random.randrange(3); f = 1
                for _r in range(rounds - 1):
                    f *= 0.9
                    if random.random() < 0.25: men -= 1; dead += 1
                d *= f; siege_days = 2 * rounds
            elif tactic == 'quick' and random.random() < 0.3: d /= 0.8
            s = base * men / len(crew) * U(0.65, 1.35); ratio = s / d; win = ratio >= 1
            fr = min(0.6, 0.2 / ratio ** 1.3 * U(0.6, 1.4)) if win else min(0.6, max(0.15, 0.35 / ratio * U(0.7, 1.2)))
            dead += round(men * fr); days += siege_days
            if win:
                l = loot_for(t, 0.6 if tactic == 'quick' else 1)
                if t.get('herd'): l['animals'] = t['herd']
                p = round(t.get('pris', 0) * (0.5 if tactic == 'quick' else 1) * U(0.7, 1.2))
                val = loot_value(l, max(0, cap - p * 4)) + p * VAL.get('thrall', 18) * 0.5
        food = len(crew) * EAT_RAID * days * MEAL_SILVER
        out.append((win, tribute, dead, val, val - food - dead * WARVAL, days))
    m = lambda i: st.mean(r[i] for r in out)
    return {'win': m(0), 'trib': m(1), 'dead': m(2), 'loot': m(3), 'net': m(4), 'days': m(5)}

CREWS = [  # (name, Town Hall level, troops, xp)
    ('TH3: 12 mixed', 3, ['skirm'] * 5 + ['spear'] * 5 + ['warrior'] * 2, 0),
    ('TH3: 12 veterans xp2', 3, ['warrior'] * 6 + ['spear'] * 4 + ['archer'] * 2, 2),
    ('TH4: 15 vikings and warriors', 4, ['viking'] * 8 + ['warrior'] * 5 + ['archer'] * 2, 1),
    ('TH5: 15 berserks and vikings xp2', 5, ['berserk'] * 6 + ['viking'] * 7 + ['archer'] * 2, 2),
    ('TH5: 30 in two ships xp1', 5, ['berserk'] * 8 + ['viking'] * 12 + ['warrior'] * 6 + ['archer'] * 4, 1),
]

def main():
    args = sys.argv[1:]; n = 4000; only = None
    if '--th' in args: only = int(args[args.index('--th') + 1]); del args[args.index('--th'):args.index('--th') + 2]
    if args: n = int(args[0])
    print('troops:', ', '.join(f"{k} {v['str']} (TH{v['lv']})" for k, v in TROOPS.items()))
    for name, lv, crew, xp in CREWS:
        if only and lv != only: continue
        s = sum(TROOPS[c]['str'] for c in crew) * (1 + 0.1 * min(3, xp))
        print(f'== {name}  strength {s:.1f}')
        for t in TARGETS:
            rlv = REGIONS.get(t.get('reg', 'scand'), {}).get('lv', 3)
            if rlv > lv: continue
            for tac in ['quick', 'assault'] + (['siege'] if t.get('walls') else []):
                r = sim(t, crew, xp, tac, n)
                flag = '  tribute' if r['trib'] > 0.99 else ''
                print(f"  {t['n'][:14]:14s} {tac:7s} win {r['win']*100:5.1f}%  dead {r['dead']:4.1f}  loot {r['loot']:6.0f}"
                      f"  net {r['net']:6.0f}  days {r['days']:4.1f}  net/day {r['net']/r['days']:6.1f}{flag}")

if __name__ == '__main__':
    main()
