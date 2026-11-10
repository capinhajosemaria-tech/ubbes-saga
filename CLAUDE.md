# Ubbe's Saga — project guide for Claude

Read this first in every session. It is short on purpose: details live in the files it points to.

## Who and how
- The owner (José) does not program. He plays, gives feedback in **Portuguese**, and decides. Claude is game designer and developer.
- Talk to him in Portuguese; everything inside the game (UI text, names) is in **English**.
- He wants honest feedback, one or two follow-up questions when something is unclear, and suggestions.
- Main platform is **PC** (Chrome/Edge). **For now, design and test on PC only**; the iPhone 14 (390 × 844) version comes later, after PC is polished. Don't spend effort on phone layout until then (keep the phone checks in `tools/check.py` passing, nothing more).

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
- `.claude/agents/` — helper agents (see "Saving tokens"). `.claude/skills/ubbe-release/` — release steps.

## Working rules
- **Rounds:** each round has a fixed list (3–6 items) taken from `BACKLOG.md`. New wishes during a round go to the backlog unless they block play.
- **Versions:** `Beta 0.MINOR.PATCH` until Town Hall 10 = `1.0.0`. New content round → minor. Fix → patch.
- **Visual changes:** for big look changes, show 1–2 screenshots before rolling them out everywhere.
- **Testing:** delegate builds, checks and bot runs to the **tester** agent; it returns a short summary. Do not paste long logs into the conversation. Look at screenshots yourself only when judging visuals.
- **Saves:** if the map or the save format changes, bump the save keys in `30_saves_title.js` and tell the player old saves will not load.
- **End of round:** update `SPEC.md` (if behaviour changed), regenerate `docs/NUMBERS.md`, add a `CHANGELOG.md` entry, tick `BACKLOG.md`, release.

## Saving tokens (José's usage limit matters)
Delegate routine work to the cheaper agents in `.claude/agents/` and keep the main conversation for design, decisions and writing game code:
| Agent | Model | Use it for |
|---|---|---|
| `tester` | Haiku | Build, `tools/check.py`, plain bot runs, perf, `gen_numbers.py` |
| `finder` | Haiku | "Where is the code that does X?" before editing; read only the lines it points to, not whole files |
| `balance` | Sonnet | Balance questions: several bot runs, raid Monte Carlo, workers vs jobs, compared with the targets |
| `shots` | Haiku | Screenshots joined into one contact sheet (`tools/ui/sheet.py`); then read only `tools/shots/sheet.png` |
Also: one round per conversation (start a new one after each release); run independent agents in parallel; never run checks or bots directly in the main conversation.

## Commands (run from the repository root)
```
python3 source/build.py                  # build source/dist/index.html
python3 tools/check.py                   # build + all regression checks → PASS/FAIL lines
python3 tools/check.py --quick           # two fastest checks
sh tools/bots/runall.sh 900 "$(cat tools/bots/profiles.json)"   # run from tools/: balance bots, 900 game days
python3 tools/gen_numbers.py             # regenerate docs/NUMBERS.md
sh tools/release.sh "Beta 0.6.2"         # set version, build, copy game to repo root
```
`python3 tools/ui/sheet.py [views]` (from `tools/`) makes one contact sheet of PC and iPhone views.
UI/balance scripts in `tools/ui` and `tools/balance` run from `tools/` (they use `test.html` and `shots/` there).
Playwright and Chromium are preinstalled in Claude's cloud sessions; nothing to install.

## Publishing
After `release.sh`: commit with a clear message, push to `main`. GitHub Pages updates in 1–2 minutes at
https://capinhajosemaria-tech.github.io/ubbes-saga/ . Also republish the preview artifact if one exists in the session.
