# Backlog

José adds feedback here while playing (or tells Claude, who adds it). At the start of a round, pick 3–6 items and move them to "This round".
Format: `- [ ] what · why / where seen` — screenshots welcome in the conversation.
Finished items are removed from this file; what each version changed is in `CHANGELOG.md`.

## Done rounds
- Polish 1 — the early game (Beta 0.7.0).
- Polish 2 — look and simplification (Beta 0.8.0).
- Polish 3 — Town Hall 1, tutorial and clarity (Beta 0.9.0, fix 0.9.1).
- Polish 4 — buildings, menus, detail and walls (Beta 0.10.0).
- World map and raids (Beta 0.11.0).
- Art 1 — "Frost & Ember" light and the fjord map (Beta 0.12.0).
- Urgent fixes 1 — village centre, unlock hints, worker output, bottom bar, roads and ground (Beta 0.13.0).

## 1. Urgent — economy (José, 2026-11-11)
- [ ] **Wood too expensive and hard to keep up**: review firewood use per person and the wood costs; it drains too fast.
- [ ] **Resource sources never run out / position doesn't matter**: output should depend on what is nearby. Woodcutter near many trees produces most; fewer trees in reach → less. Show the % of maximum output on the building. Same idea for iron (mine near ore), berries (bushes), fish, etc. *Open: do trees regrow on their own, or does the player plant them (forester)?*

## 2. Art redesign (José, 2026-11-11)
Prototypes are on branch `art-prototypes` (code, switches and option sheets: `docs/art/README.md` on that branch). Nothing is released.
José's problems with buildings close up: many have **no door**, **chimneys badly seated on roofs**, **details sparse** and **lines too thick**.
Decided:
- [ ] **Roads = option B "trodden earth"**: dark mud, deep wheel ruts, puddles reflecting the sky, stones, round worn bends, grass tufts over the edge. Door tracks and winter roads must match.
- [ ] **Grass = option B**: large soft colour drift (no tile chessboard), two-tone grass clumps, darker grass and trampled earth around buildings.
- [ ] **Market = option M1**: cobbles like the Town Hall square, three timber booths with plank/turf roofs over the back half (goods visible: fish, pots, furs), a stone well with bucket instead of the modern fountain post, crates and barrels. The old striped stalls go.
To decide:
- [ ] **Town Hall entrance**: 6 options (1 Urnes portal, 2 carved porch, 3 iron gate, 4 dragon pillars, 5 painted hall, 6 vestibule with antlers) or a mix. Claude's view: 1 most beautiful close up, 6 reads best from afar, 2 needs geometry work. The door must be big and ornamented.
- [ ] **Building grime** (contact shadow, damp walls, moss on footings, rain streaks) from option B — ask José.
Plan (agreed in principle):
1. **Style rules** (short doc): line widths (fine, ~0.5–1 px), door size/position on every building, chimney seating (on ridge or slope, with flashing and base), windows/shutters, boards, eaves. Derived from the chosen Town Hall entrance.
2. **Shared parts kit**, drawn once with a close-up level: door, chimney, window/shutter, plank walls, roof edge, shields, torches. Every building uses it, so fixes apply everywhere.
3. **Rebuild buildings in groups of 5–6** (44 types, ~30 real buildings): one before/after contact sheet per group, close up; several options only for key buildings (Town Hall, houses, Jarl's House, Hof, market). About 5–7 rounds in all. Fine detail only when zoomed in; measure performance each round.
Covers also: richer building textures (planks, roof materials, props), darker shingle and thatch roofs, proper timber framing, more contrast between building kinds.
Later art:
- [ ] Water depth near shores.
- [ ] Ships, palisade and walls: warm rim light at dusk, torches on gates and towers at night.
- [ ] Night and winter tuning after José plays (how dark, how often, how long); maybe a setting to turn the cycle off.
- [ ] Fjord map polish after play: island placement, fjord width, forests, where raiders land.

## 3. Balance fixes 1 (from the audit)
Audit 2026-11-11: data in `tools/balance/audit_data.md`, report in `tools/balance/audit_report.md` (finding IDs refer to it; read the finding before applying). TH1–TH2 are sound. The bot was fixed (B1, B2): 24/24 runs reach TH5 in 434–587 days.
- [ ] **E1 — rounding bugs**: Preserver levels 4/5 → 5/6 items a day; Smokehouse carries fractions (levels 2 and 4 add nothing now).
- [ ] **E2 — ale and mead out of the meal count** (counted as meals, never eaten).
- [ ] **A2 — Bakery 2 → 4 bread per worker a day** (weak link of TH5 winter food).
- [ ] **A1 — too many children** (33–45% under 14): working age 14 → 12, birth chance 0.007 → 0.004, `jobs.py` with the real age mix (workforce share ~45% → 58%). *Ask José.*
- [ ] **E5–E7 — cleanup**: regenerate `NUMBERS.md` (header says 0.11.0, troop gear column empty), complete Test villages, remove dead constants.

## 4. Balance fixes 2 (decide after re-measuring)
- [ ] **O1 — silver has no use** (~650/yr in vs ~2,000–2,500 sinks to TH5; bots end with 8–17k unspent): merchant purse 100/150/200 at TH3/4/5; mercenaries 14 → 40; TH5 silver 250 → 400; Hof 50 → 150; silver on level 4/5 upgrades.
- [ ] **E3** — Market bonus only with its worker; Pen loses its useless third slot.
- [ ] **O3, E4 — village raids**: palisade bonus counted once (now twice); raiders 6+2/yr (max 24) → 8+3 (max 30); teach the bot to wall the Town Hall at TH5 (bots never build a palisade, so walls can't be measured yet). Then balance raid frequency, size and loot after José has met a few.
- [ ] **P3, P4 — pacing TH3–TH5**: hall population 22/32/48/80 → 22/40/70/110; TH5 fame 1,700 → 1,500 (low-raid players stuck; saga goals give ~1,300). Note: no fully peaceful path exists by rule (TH3 needs warriors, TH4 a raid).
- [ ] Hold until re-measured: more food output (A3), TH4 cost cut (P2), pen scaling (A6), the "4–8 spare workers" target (A8 — today +11..+17 on the test village, about −15..−25 at full TH5 with real ages).

## 5. Phone (later — after PC is polished)
- [ ] Convert the PC interface to iPhone 14 once PC is settled.
- [ ] Speed buttons cover the saga goal text; with 8×/16× (Test/Sandbox) the column is very tall. Consider a single speed button that opens the choices.
- [ ] First hint ("Tap Build to begin") stays on top of the Build sheet once it opens.
- [ ] World map uses only the top half of the screen: bigger map area or a toggle to hide the target list.
- [ ] Phone version of the dock, build tray and docked inspector.

## 6. Ideas for later (Town Hall 6–10, see docs/DESIGN.md)
- [ ] Town Hall 6–10 content: settlements, kingship (level 8), wonders, Danegeld, Christianity.
- [ ] Iceland, Ireland, Frankia and the Baltic on the world map (currently always in mist).

## Keep in mind
- The first part of Town Hall 1 feels good (José, play 2): don't change its pacing.
- PC only for now (2026-11-10).
- Heavy raiding may be faster than peaceful play; fine for now (2026-11-11).
