# Art prototypes (2026-11-11) — not released

Switches in the test page console (all 0 = the released look):
- `window.__setArt(n)` — ground/roads: 1 = A painted meadow, **2 = B trodden earth (chosen for roads and worn grass)**, 3 = C plank streets and heather. Also adds building grime (not chosen yet).
- `window.__setMk(n)` — market: **1 = timber booths + well on cobbles (chosen)**, 2 = fair tents, 3 = market hall.
- `window.__setTHD(n)` — Town Hall entrance: 1 Urnes portal, 2 carved porch, 3 iron gate, 4 dragon pillars, 5 painted hall, 6 vestibule with antlers (not chosen yet).

Code: `source/src/18_zartv.js`, `20_zmarket.js`, `20_zthdoor.js`, small hooks in `20_zth.js`, `20_zhouses_plaza.js`, `20_extra_building_art.js`.
Screenshot scripts: `tools/ui/tmp_ground.py`, `tmp_market.py`, `tmp_th.py` (run from `tools/` after `build_test.py`).
Option sheets: the PNGs in this folder.
