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

## 1. Core redesign (decided with José, 2026-11-11)
Goal: fewer systems, each one counts more; decisions matter, but the player stays free to build his own way and can always progress (maybe more slowly). City building and resources first; the lineage matters later, when resources are less of a worry.
**Old saves stop loading from round 1A** (bump save keys). Balance fixes 1 items E1 (Smokehouse) and A2 (Bakery) are replaced by 1B; re-check the rest after 1A–1B.
Do the rounds in this order:

### 1A. Economy core
- [ ] **Resource sources with a yearly limit**: trees, berry bushes, iron lines and fishing waters give a fixed amount per year (they stay on the map), refilled each spring, so winter draws on what is left. A building works the sources within its radius; buildings sharing sources split them. Show the radius and expected % when placing, and the % of maximum output on the building.
- [ ] **Firewood per house**: each house burns X wood a day, +20% in winter (tune by measuring: important, not crippling). Review wood costs too.
- [ ] **Woodcutters keep full output in winter.**
- [ ] **Planks as fuel fallback**: when logs run out, fires burn planks (1 plank = 2 wood, as in the carpenter recipe), never below the plank reserve.
- [ ] **No automatic material reserve** for the Town Hall (remove "Keep materials for the next hall"); reserves come from the Production panel (1C).
- [ ] **Remove tool** next to Roads: remove plants, buildings and roads (all removal moves here). Placing a building over trees or bushes asks "Remove these resource sources?"; yes → the building is placed, the sources removed, and the player gets ¼ of a season's output of each removed source.
- [ ] **No soldier limit**: training works like assigning workers — a "+" on the Training Ground showing the free workers; gear from the smithy still limits it. Drop the "4–8 spare workers" balance rule.
- [ ] **Houses unlimited; warehouses and granaries unlimited but each extra one costs more.**

### 1B. Food and drink
- [ ] Food sources: **berries, fishers, Pig Pen (pigs only), Fodder Field** (feed for animals only, not people), **Grain Field → Water Mill (flour, not perishable) → Bakery** (bread also in winter). Keep Preserver and Smokehouse.
- [ ] **Sheep Pen** for wool (sails, warm clothes).
- [ ] **Water Mill** stands on the river and must look like a real mill (wheel in the water): show 1–2 drawings first.
- [ ] Remove Salt Works and salt goods, Hunter's Lodge, Vegetable Garden, Hay Meadow (replaced by the Fodder Field). Re-check food variety for morale.
- [ ] **Brewery and Beehives move to TH3**; ale and mead are not meals: they are drunk at feasts and in the **Tavern** (unlocks with the Brewery), which uses them slowly and raises morale while stocked and working.

### 1C. Production panel (new dock section)
- [ ] For every resource: total production, total use, and how many winter days it lasts (counting winter output losses).
- [ ] **Reserve** per resource (not spent below it), plus a manual "Reserve for next Town Hall" button that fills them once.
- [ ] **Production chain graph** for each resource (e.g. 4 wood → 2 planks), nicely drawn.
- [ ] **Upgrades list**: a floating panel of buildings that can be upgraded, affordable ones first; click moves the camera.
- [ ] **Build menu clarity**: locked cards clearly say what unlocks them (already in 0.13.0 — check José sees it), cost as large icon + amount at the bottom of every card.

### 1D. Start choices, gods, feast
- [ ] New saga starts with three choices: **Ubbe's trait** (Builder, Warrior, Trader, Provider, Skald — bonuses only, no penalties), **patron god**, **first advisor**. Advisors: 4 in all, the 4th at TH5. Heirs later get or inherit traits (lineage).
- [ ] **Patron god only**: one favour bar; "Odin's wrath" becomes **"Patron's wrath"** below 25 favour (own punishment per god). Each patron asks its own offering, all TH1 resources: Odin — preserved food, Thor — iron, Freyja — berries, Njord — fish. Keep each god's bonus and blessing.
- [ ] **One Feast** instead of banquets (people / warriors / council) and festivals; uses ale and mead.

### 1E. Trade and land
- [ ] **Land costs silver**; fame earned gives the right to claim the next ring of land.
- [ ] **New trade screen**: map with the trading partners; click one to see its requests and send our offers (good + price, for another good or for silver); they accept, refuse or counter. Each village has a relation that improves with good deals. Goods travel by knarr (takes days). Silver buys goods at the market.

### 1F. World map
- [ ] One map from Finland to Portugal, down to North Africa and the future Middle East targets; mist over it that still shows the coastlines; targets marked as now.

### 1H. Living village (José, 2026-11-11 — place in the order still to decide)
- [ ] **Real people walk**: each villager is a walker (today only 3–10 decorative ones wander near the hall). At dawn they walk from their own house to their workplace along roads, at dusk back home; children play near home, warriors at the Training Ground, elders walk slower. Commute follows the light cycle (3 game days), not every 27-second day.
- [ ] **Click a person**: sheet with name, age, traits, family, house and workplace; buttons to show their house and workplace. Click a house or building → list of who lives / works there.
- [ ] Visual only at first (walking distance does not cut output). Watch performance (~110 people at TH5): fewer figures when zoomed out.

### 1G. Worker priorities
- [ ] Setting: keep today's per-building − / +, or **priorities by category** (food, materials, crafts, building: high / normal / low).

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
Also (José, 2026-11-11):
- [ ] **Door paths join the road** without overlapping, same style as roads but thinner.
- [ ] **Harbour redesign**: longer and narrower (rectangular), reaching further out to sea, a wooden platform that hugs the shore and a small characteristic building. Ships show moored at the harbour, each type with its own look, without overlapping.
Later art:
- [ ] Water depth near shores.
- [ ] Ships, palisade and walls: warm rim light at dusk, torches on gates and towers at night.
- [ ] Night and winter tuning after José plays (how dark, how often, how long); maybe a setting to turn the cycle off.
- [ ] Fjord map polish after play: island placement, fjord width, forests, where raiders land.

## 3. Balance fixes 1 (from the audit)
Audit 2026-11-11: data in `tools/balance/audit_data.md`, report in `tools/balance/audit_report.md` (finding IDs refer to it; read the finding before applying). TH1–TH2 are sound. The bot was fixed (B1, B2): 24/24 runs reach TH5 in 434–587 days.
- [ ] **E1 — rounding bugs** (Smokehouse part may go with 1B): Preserver levels 4/5 → 5/6 items a day; Smokehouse carries fractions (levels 2 and 4 add nothing now).
- [ ] **E2 — ale and mead out of the meal count** (counted as meals, never eaten).
- [ ] **A2 — replaced by 1B (new bread chain)**: was Bakery 2 → 4 bread per worker a day (weak link of TH5 winter food).
- [ ] **A1 — too many children** (33–45% under 14): working age 14 → 12, birth chance 0.007 → 0.004, `jobs.py` with the real age mix (workforce share ~45% → 58%). *Ask José.*
- [ ] **E5–E7 — cleanup**: regenerate `NUMBERS.md` (header says 0.11.0, troop gear column empty), complete Test villages, remove dead constants.

## 4. Balance fixes 2 (decide after re-measuring)
- [ ] **O1 — silver has no use** (~650/yr in vs ~2,000–2,500 sinks to TH5; bots end with 8–17k unspent) — mostly answered by 1E (land and goods cost silver); then maybe: merchant purse 100/150/200 at TH3/4/5; mercenaries 14 → 40; TH5 silver 250 → 400; Hof 50 → 150; silver on level 4/5 upgrades.
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
