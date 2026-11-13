# Ubbe's Saga

A Viking village saga for the browser. Build Kaldstrand, year 865, and lead Ubbe's line from a few huts on the shore to a jarl's seat.

**Play:** https://capinhajosemaria-tech.github.io/ubbes-saga/

Current version: **Beta 0.20.0** (Town Hall levels 1–5). The game stays in beta until Town Hall level 10, which will be 1.0.0.

## Install it like an app
- **iPhone (Safari):** open the link, tap Share, then *Add to Home Screen*.
- **PC (Chrome or Edge):** open the link and click the install icon at the right of the address bar.

The game works offline once it has been opened once. Saves live on the device; use *Export* in the Saga panel to move a saga between devices.

## Repository
- `index.html`, `manifest.webmanifest`, `sw.js`, `icon-*.png`: the built game served by GitHub Pages.
- `source/`: the game's source modules. Run `python3 source/build.py` to build `source/dist/`.
- `tools/`: regression checks, balance bots and the release script.
- `CLAUDE.md`, `SPEC.md`, `BACKLOG.md`, `CHANGELOG.md` and `docs/`: how the game works and how to work on it.
