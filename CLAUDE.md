# Ubbe's Saga — project guide for Claude

Read this first in every session. It is short on purpose: details live in the files it points to.

## Who and how
- The owner (José) does not program. He plays, gives feedback in **Portuguese**, and decides. Claude is game designer and developer.
- Talk to him in Portuguese; everything inside the game (UI text, names) is in **English**.
- He wants honest feedback, one or two follow-up questions when something is unclear, and suggestions.
- Main platform is **PC** (Chrome/Edge); it must also play well on an **iPhone 14** (390 × 844).

## What to read
| File | What it is | When |
|---|---|---|
| `SPEC.md` | How the game works **now**: systems, rules, UI, art | Before changing behaviour |
| `docs/NUMBERS.md` | Every cost, limit, troop, ship, target — generated from code | Before balancing |
| `docs/DESIGN.md` | Full design vision up to Town Hall 10 (Portuguese, long) | Only when adding new levels or systems; search it, don't read it whole |
| `BACKLOG.md` | Open feedback and ideas, in priority order | At the start of every round |
| `CHANGELOG.md` | What each version changed | When releasing |

## Repository layout
- `index.html`, `sw.js`, `manifest.webmanifest`, `icon-*.png` — the **published** game (GitHub Pages serves the repo root). Never edit these by hand; `tools/release.sh` writes them.
- `source/src/NN_name.js` — game code, concatenated in file-name order by `source/build.py` into one file. New modules must match `[0-9][0-9]_*.js`; a module that must load after `20_x.js` is named `20_zsomething.js`.
- `source/src/head.html`, `body.html`, `style.css` — page shell and styles. `source/VERSION` — version string.
- `tools/` — test page builder, regression checks, balance bots. See below.
- `.claude/agents/tester.md` — the test runner agent (cheap model). `.claude/skills/ubbe-release/` — release steps.

## Working rules
- **Rounds:** each round has a fixed list (3–6 items) taken from `BACKLOG.md`. New wishes during a round go to the backlog unless they block play.
- **Versions:** `Beta 0.MINOR.PATCH` until Town Hall 10 = `1.0.0`. New content round → minor. Fix → patch.
- **Visual changes:** for big look changes, show 1–2 screenshots before rolling them out everywhere.
- **Testing:** delegate builds, checks and bot runs to the **tester** agent; it returns a short summary. Do not paste long logs into the conversation. Look at screenshots yourself only when judging visuals.
- **Saves:** if the map or the save format changes, bump the save keys in `30_saves_title.js` and tell the player old saves will not load.
- **End of round:** update `SPEC.md` (if behaviour changed), regenerate `docs/NUMBERS.md`, add a `CHANGELOG.md` entry, tick `BACKLOG.md`, release.

## Commands (run from the repository root)
```
python3 source/build.py                  # build source/dist/index.html
python3 tools/check.py                   # build + all regression checks → PASS/FAIL lines
python3 tools/check.py --quick           # two fastest checks
sh tools/bots/runall.sh 900 "$(cat tools/bots/profiles.json)"   # run from tools/: balance bots, 900 game days
python3 tools/gen_numbers.py             # regenerate docs/NUMBERS.md
sh tools/release.sh "Beta 0.6.2"         # set version, build, copy game to repo root
```
UI/balance scripts in `tools/ui` and `tools/balance` run from `tools/` (they use `test.html` and `shots/` there).
Playwright and Chromium are preinstalled in Claude's cloud sessions; nothing to install.

## Publishing
After `release.sh`: commit with a clear message, push to `main`. GitHub Pages updates in 1–2 minutes at
https://capinhajosemaria-tech.github.io/ubbes-saga/ . Also republish the preview artifact if one exists in the session.
