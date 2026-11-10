# Backlog

José adds feedback here while playing (or tells Claude, who adds it). At the start of a round, pick 3–6 items and move them to "This round".
Format: `- [ ] what · why / where seen` — screenshots welcome in the conversation.

## This round — Polish 1: the early game (PC) · approved by José 2026-11-10
Decisions: old saves may break (bump save keys); start with about 16 people instead of 11 and faster newcomers in year 1; show 1–2 screenshots of the new mountain before rolling it out.
- [x] More people at the start (~16) and faster newcomers in the first year; check with the `balance` agent that TH2 does not get too easy.
- [x] More land unlocked at the start.
- [x] Smaller mountain with a new design, freeing building space (screenshots first).
- [x] Resource bar: name next to each number, clearer and more detailed icons.
- [x] Fix "Every bed is taken" shown while the bar reads 11/12.

## Next rounds (planned)
- **Polish 2 — organisation:** menus and build categories, clearer wording, explicit icons everywhere.
- **Polish 3 — world map and raids:** overlapping labels, Birka in Sweden, England visible, raid balance after TH4 (with the Monte Carlo update).

## Polish after Town Hall 5 (beta polish rounds)
Merge José's play feedback here, grouped as visual / balance / organisation. **PC only for now** (decided 2026-11-10): tune everything on PC, then convert to iPhone; phone items wait in "Phone (later)".
Sources: José's first play feedback (Relaxed mode) and Claude's first review (Beta 0.6.1).
José's second play session (Relaxed, 2026-11-10, after Polish 1) added the items marked *(play 2)*. Keep: the first part of Town Hall 1 feels good, don't change its pacing.

### Visual
- [x] **Resource bar hard to read** (José): show each resource's name next to the number, clearer and more detailed icons.
- [ ] **Icons in menus too vague** (José): more explicit, detailed icons in build tray, panels and sheets.
- [x] Mountain massif dominates the TH5 view (about a third of the screen, a flat white block): make it smaller with a new design (José agrees), freeing land for building.
- [ ] **Log-pile props look wrong** *(play 2)*: remove the loose firewood/log props from the village; keep logs only at the Woodlodge, and redraw them properly (round end at the back as well as the front, not cut flat).
- [ ] **Menu look** *(play 2)*: menus are better organised now, but José prefers a look closer to the original option, more like Bad North (clean, minimal, light panels).
- [ ] **Title font for numbers** *(play 2)*: use the title font also for resource numbers and other figures in the UI.
- [ ] **Show the 6 × 6 land blocks** *(play 2)*: the unlockable 6 × 6 tile groups should be visible in the translucent grid (still subdued), so it is clear which block will be unlocked.
- [ ] World map: labels overlap ("Iona" over "SCOTLAND", "Jutland" over "JUTLAND"); Birka sits on the Norway landmass (should be Sweden); England, the main goal, opens half hidden in mist.

### Balance
- [x] **Too few people at the start / newcomers too slow** (José, Relaxed): buildings get built but workers are always missing. Raise starting population and/or early attractiveness; check with bots that TH2 does not get too fast.
- [ ] **Winter firewood after TH4** (balance bots, Beta 0.7.0): people leave in waves from year ~7, about 90% in winter for lack of firewood (wood 0), when new houses at TH4/TH5 fill up. Ideas: one more woodcutter at TH3–5, or newcomers wait while wood covers less than ~10 days of firewood. Also TH5 has +12 spare workers (target 4–8).
- [ ] Re-check raiding after TH4 with the new `balance` agent (several runs per profile), together with the Monte Carlo update below.

### Organisation / gameplay
- [ ] **Remove water as a resource** *(play 2)*: the village is by a river, and 2–3 wells in a small village feel wrong. Remove water and wells to reduce complexity (may come back later). Save keys likely need a bump.
- [x] **More building space** (José): start with more land unlocked (more than the free 3 × 3 zones) and more buildable room overall.
- [ ] **Menus not well organised, sometimes unclear** (José): review build categories, panel structure and the wording of sheets; explain what each building does and needs.
- [x] To do says "Every bed is taken" at the start while the bar shows 11/12; make the message and the counter agree.

### Play 3 feedback (José, 2026-11-10)
- [ ] **Event choices: unclear gain or loss** (UI): cost/gain hints like "(+23 meals, −80 wood)" are ambiguous, e.g. the before-winter event ("skip this year" vs feast/meals): you can't tell whether meals are gained or spent. Show clear signed amounts with icons, green for gain and red for cost, and say "you get" / "you pay".
- [ ] **Walls never implemented** (gameplay): walls and the sea palisades should work like Clash of Clans walls: raiders must break through them (wall HP, upgrade levels, paths blocked), and they visibly protect the village.
- [ ] **More close-up detail** (visual): buildings, ground textures, roads, walls and palisades should show more detail when zoomed in.
- [ ] **Fisher's Hut placement** (gameplay): replace "needs water within X tiles" with a productivity falloff: 100% up to 5 tiles from any water tile (sea or river), less beyond that.
- [ ] **Town Hall 1 unlocks too slow / tutorial** (balance + UX): in one save the Preserver and other winter essentials only unlocked once winter had already started. Rethink the TH1 saga steps: winter essentials buildable earlier, fewer steps to unlock buildings overall. Add a short, dynamic written tutorial at the start of each save: how the game works, what each TH1 building does and why it matters, how to prepare for winter, and other basics.
- [ ] **Road texture breaks from grass to sand** (visual, minor): the road texture is discontinuous where it crosses from grass to sand.

### Phone (later — after PC is polished)
- [ ] Convert the PC interface to iPhone 14 once PC is settled.
- [ ] Speed buttons cover the saga goal text; with 8×/16× (Test/Sandbox) the column is very tall. Consider a single speed button that opens the choices.
- [ ] First hint ("Tap Build to begin") stays on top of the Build sheet once it opens.
- [ ] World map uses only the top half of the screen: bigger map area or a toggle to hide the target list.
- [ ] Phone version of the dock, build tray and docked inspector.


## Bugs

## Wanted
- [ ] Hof: the raised upper roof reads as a flat stripe; redraw as a proper stave-church tier.
- [ ] Re-measure troop strength and raid value for vikings, berserks and the new regions (Monte Carlo in `tools/balance/raidmc.py` needs updating).
- [ ] Heavy raiders lose population after Town Hall 4 (deaths and people leaving); check if raiding is too punishing or the bots raid too much.
- [ ] Market is generous for buying iron and tools; revisit after José plays a full saga.

## Ideas for later (Town Hall 6–10, see docs/DESIGN.md)
- [ ] Town Hall 6–10 content: settlements, kingship (level 8), wonders, Danegeld, Christianity.
- [ ] Iceland, Ireland, Frankia and the Baltic on the world map (currently always in mist).

## Done
See CHANGELOG.md.
