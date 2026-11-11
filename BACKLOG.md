# Backlog

José adds feedback here while playing (or tells Claude, who adds it). At the start of a round, pick 3–6 items and move them to "This round".
Format: `- [ ] what · why / where seen` — screenshots welcome in the conversation.

## Done rounds
- Polish 1 — the early game (Beta 0.7.0).
- Polish 2 — look and simplification (Beta 0.8.0).
- Polish 3 — Town Hall 1, tutorial and clarity (Beta 0.9.0, fix 0.9.1).
- Polish 4 — buildings, menus, detail and walls (Beta 0.10.0).
- World map and raids (Beta 0.11.0).
- Art 1 — "Frost & Ember" light and the fjord map (Beta 0.12.0).
- Urgent fixes 1 — village centre, unlock hints, worker output, bottom bar, roads and ground (Beta 0.13.0). Wood items left for later (José, 2026-11-11).

## Urgent fixing (José, 2026-11-11 — do before the balance round)
- [ ] **Wood too expensive and hard to keep up**: review wood (firewood) use per person and the wood costs; it drains too fast.
- [ ] **Resource sources never run out / position doesn't matter**: output should depend on what is nearby. Woodcutter near many trees produces most; fewer trees in reach → less. Show the % of maximum output on the building. Same idea for iron (mine near ore), berries (bushes), fish, etc.
- [x] **Output scales with workers for every production building**: e.g. a 4-worker building with 2 workers makes 50%, with 1 makes 25%. Show it clearly in the building sheet.
- [x] **Village centre on the square**: centre the starting Town Hall on the square; the Jarl's house comes already built at the start; let the player move and rotate the Town Hall.
- [x] **Locked buildings say what unlocks them** (e.g. "Unlocks with: Ready for winter") — José couldn't build the Jarl's house after TH2 because that saga goal was still open.
- [x] **Art quality**: better textures and details everywhere; more realistic paths/roads. *(0.13.0: roads, grass, sand, yards; building textures still to do)*
- [ ] **Art quality 2**: richer building textures and details (planks, roof materials, props), water depth near shores.
- [x] **Bottom menu bar**: the half-gold border must cover the whole bar; use the title font for the bar's text.

## Next round — Balance fixes 1 (from the audit)
Audit done 2026-11-11: data in `tools/balance/audit_data.md` (48 bot runs × 900 days), report in `tools/balance/audit_report.md` (finding IDs below refer to it; read the finding before applying). Key result: TH1–TH2 are sound; most TH3–TH5 bot data reflects bot weaknesses (22/48 runs stuck at TH3 because the bot boxes in its own shore — Shipyard placement is fine for a player).
Claude's suggested round (José still has to pick; ask him about item A1 because fewer babies changes the feel):
- [x] **B1, B2 — fix the bot first** (done 2026-11-11, `tools/bots/bot4.js` only): every planner build keeps the shore and the road-reachable land open (`placeSafe`); wood target = hall wood + 100 before carpenters; plank target = hall planks + 60; all farm/hunter slots staffed, spare workers to lodges with trees → mines → carpenters → fishers; spot search covers all unlocked land. Result, 24 runs × 900 days: TH5 24/24 (audit 21/48) — planner d510–586, warlord 434–545, challenge 509–587, lazy 513–586; no fail keys. Warlord fastest is fine for now (José, 2026-11-11). Open: summer spare workers at TH5 mostly 0–10 (rule 4–8, see A8).
- [ ] **E1 — rounding bugs**: Preserver levels 4/5 → 5/6 items a day; Smokehouse carries fractions (levels 2 and 4 add nothing now).
- [ ] **E2 — ale and mead out of the meal count** (counted as meals, never eaten).
- [ ] **A2 — Bakery 2 → 4 bread per worker a day** (weak link of TH5 winter food).
- [ ] **A1 — too many children** (33–45% under 14): working age 14 → 12, birth chance 0.007 → 0.004, `jobs.py` with the real age mix (A/B test: workforce share ~45% → 58%). *Ask José.*
- [ ] **E5–E7 — cleanup**: regenerate `NUMBERS.md` (header says 0.11.0, troop gear column empty), complete Test villages, remove dead constants.
Then re-run bots (balance agent) before the next round.

## Later — Balance fixes 2 (decide after re-measuring with the fixed bot)
- [ ] **O1 — silver has no use** (~650/yr in vs ~2,000–2,500 sinks to TH5): merchant purse 100/150/200 at TH3/4/5; mercenaries 14 → 40; TH5 silver 250 → 400; Hof 50 → 150; silver on level 4/5 upgrades.
- [ ] **E3** — Market bonus only with its worker; Pen loses its useless third slot.
- [ ] **O3, E4 — village raids**: palisade bonus counted once (now twice); raiders 6+2/yr (max 24) → 8+3 (max 30); teach the bot to build a palisade.
- [ ] **P3, P4 — pacing TH3–TH5**: hall population 22/32/48/80 → 22/40/70/110; TH5 fame 1,700 → 1,500 (low-raid players stuck; saga goals give ~1,300). Note: no fully peaceful path exists by rule (TH3 needs warriors, TH4 a raid).
- [ ] Hold until re-measured: more food output (A3), TH4 cost cut (P2), pen scaling (A6), the "4–8 spare workers" rule target (A8 — today +11..+17 on the test village, about −15..−25 at full TH5 with real ages).

## Polish after Town Hall 5 (beta polish rounds)
Merge José's play feedback here, grouped as visual / balance / organisation. **PC only for now** (decided 2026-11-10): tune everything on PC, then convert to iPhone; phone items wait in "Phone (later)".
Sources: José's first play feedback (Relaxed mode) and Claude's first review (Beta 0.6.1).
José's second play session (Relaxed, 2026-11-10, after Polish 1) added the items marked *(play 2)*. Keep: the first part of Town Hall 1 feels good, don't change its pacing.

### Visual
- [x] **Resource bar hard to read** (José): show each resource's name next to the number, clearer and more detailed icons.
- [x] **Icons in menus too vague** (José): more explicit, detailed icons in build tray, panels and sheets.
- [x] Mountain massif dominates the TH5 view (about a third of the screen, a flat white block): make it smaller with a new design (José agrees), freeing land for building.
- [x] **Log-pile props look wrong** *(play 2)*: remove the loose firewood/log props from the village; keep logs only at the Woodlodge, and redraw them properly (round end at the back as well as the front, not cut flat).
- [x] **Menu look** *(play 2)*: menus are better organised now, but José prefers a look closer to the original option, more like Bad North (clean, minimal, light panels).
- [x] **Title font for numbers** *(play 2)*: use the title font also for resource numbers and other figures in the UI.
- [x] **Show the 6 × 6 land blocks** *(play 2)*: the unlockable 6 × 6 tile groups should be visible in the translucent grid (still subdued), so it is clear which block will be unlocked.
- [x] World map: labels overlap ("Iona" over "SCOTLAND", "Jutland" over "JUTLAND"); Birka sits on the Norway landmass (should be Sweden); England, the main goal, opens half hidden in mist.

### Balance
- [x] **Too few people at the start / newcomers too slow** (José, Relaxed): buildings get built but workers are always missing. Raise starting population and/or early attractiveness; check with bots that TH2 does not get too fast.
- [x] **Winter firewood after TH4** (balance bots, Beta 0.7.0): people leave in waves from year ~7, about 90% in winter for lack of firewood (wood 0), when new houses at TH4/TH5 fill up. Ideas: one more woodcutter at TH3–5, or newcomers wait while wood covers less than ~10 days of firewood. Also TH5 has +12 spare workers (target 4–8).
- [x] Re-check raiding after TH4 with the new `balance` agent (several runs per profile), together with the Monte Carlo update below.

### Organisation / gameplay
- [x] **Remove water as a resource** *(play 2)*: the village is by a river, and 2–3 wells in a small village feel wrong. Remove water and wells to reduce complexity (may come back later). Save keys likely need a bump.
- [x] **More building space** (José): start with more land unlocked (more than the free 3 × 3 zones) and more buildable room overall.
- [x] **Menus not well organised, sometimes unclear** (José): review build categories, panel structure and the wording of sheets; explain what each building does and needs.
- [x] To do says "Every bed is taken" at the start while the bar shows 11/12; make the message and the counter agree.

### Play 3 feedback (José, 2026-11-10)
- [x] **Event choices: unclear gain or loss** (UI): cost/gain hints like "(+23 meals, −80 wood)" are ambiguous, e.g. the before-winter event ("skip this year" vs feast/meals): you can't tell whether meals are gained or spent. Show clear signed amounts with icons, green for gain and red for cost, and say "you get" / "you pay".
- [x] **Walls never implemented** (gameplay): walls and the sea palisades should work like Clash of Clans walls: raiders must break through them (wall HP, upgrade levels, paths blocked), and they visibly protect the village.
- [x] **More close-up detail** (visual): buildings, ground textures, roads, walls and palisades should show more detail when zoomed in.
- [x] **Fisher's Hut placement** (gameplay): replace "needs water within X tiles" with a productivity falloff: 100% up to 5 tiles from any water tile (sea or river), less beyond that.
- [x] **Town Hall 1 unlocks too slow / tutorial** (balance + UX): in one save the Preserver and other winter essentials only unlocked once winter had already started. Rethink the TH1 saga steps: winter essentials buildable earlier, fewer steps to unlock buildings overall. Add a short, dynamic written tutorial at the start of each save: how the game works, what each TH1 building does and why it matters, how to prepare for winter, and other basics.
- [x] **Road texture breaks from grass to sand** (visual, minor): the road texture is discontinuous where it crosses from grass to sand.

### Play 4 feedback (José, Beta 0.8.0)
- [x] **Houses: one shape for all again** (visual, José insists, do together with the bug above): all houses share one shape like before 0.8.0 (no round small houses, no mixed silhouettes); keep the colour schemes and keep the varied shapes for the other buildings.

### Phone (later — after PC is polished)
- [ ] Convert the PC interface to iPhone 14 once PC is settled.
- [ ] Speed buttons cover the saga goal text; with 8×/16× (Test/Sandbox) the column is very tall. Consider a single speed button that opens the choices.
- [ ] First hint ("Tap Build to begin") stays on top of the Build sheet once it opens.
- [ ] World map uses only the top half of the screen: bigger map area or a toggle to hide the target list.
- [ ] Phone version of the dock, build tray and docked inspector.


## Art (after Beta 0.12.0 — style 5 "Frost & Ember" chosen)
- [ ] Bring building materials closer to the style board: darker shingle and thatch roofs, proper timber framing, more contrast between building kinds so a big village reads at a glance.
- [ ] Night and winter tuning after José plays (how dark, how often, how long); maybe a setting to turn the cycle off.
- [ ] Ships, palisade and walls: warm rim light at dusk, torches on gates and towers at night.
- [ ] Fjord map polish after play: island placement, fjord width, forests, where raiders land.

## Bugs
- [x] **Houses change when moved or rotated — still there after 0.9.1** (José, 2026-11-11, top priority next round): moving a house changes its type (shape and colour); rotating it still gives the crossed / broken roof. Likely the house look is picked from position or id (hash) instead of being stored with the house, and the round/other house shapes have their own rotation bug that 0.9.1 did not cover.
- [x] **Check every building for the same problem** (from 0.8.0's new shapes): place, move and rotate each building type (all 4 rotations) and look for crossed roofs, missing faces or a look that changes; fix all of them.

## Wanted
- [ ] Balance village raids (frequency, size, loot) after José has met a few (first pass done in Beta 0.11.0: loot capped, shields fixed).
- [x] Hof: the raised upper roof reads as a flat stripe; redraw as a proper stave-church tier.
- [x] Re-measure troop strength and raid value for vikings, berserks and the new regions (Monte Carlo in `tools/balance/raidmc.py` needs updating).
- [x] Heavy raiders lose population after Town Hall 4 (deaths and people leaving); check if raiding is too punishing or the bots raid too much.
- [x] Market is generous for buying iron and tools; revisit after José plays a full saga.
- [ ] Silver piles up (bots end with 8–17k unspent; Town Hall costs only 250): find something worth spending silver on (balance agent, 2026-11-11).
- [x] *(decided 2026-11-11: fine for now, heavy raiding may be faster)* After Beta 0.11.0 the careful "planner" bot reaches TH5 later (~620 days) than the warlord (~570) and challenge (~560) bots; decide whether that is fine or if peaceful play needs a boost.
- [ ] Bots never build a palisade, so village-raid balance with walls can't be measured yet: teach `tools/bots/bot4.js` to wall the Town Hall at TH5.

## Ideas for later (Town Hall 6–10, see docs/DESIGN.md)
- [ ] Town Hall 6–10 content: settlements, kingship (level 8), wonders, Danegeld, Christianity.
- [ ] Iceland, Ireland, Frankia and the Baltic on the world map (currently always in mist).

## Done
See CHANGELOG.md.
