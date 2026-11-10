# Backlog

José adds feedback here while playing (or tells Claude, who adds it). At the start of a round, pick 3–6 items and move them to "This round".
Format: `- [ ] what · why / where seen` — screenshots welcome in the conversation.

## This round — Polish 1: the early game (PC) · approved by José 2026-11-10
Decisions: old saves may break (bump save keys); start with about 16 people instead of 11 and faster newcomers in year 1; show 1–2 screenshots of the new mountain before rolling it out.
- [ ] More people at the start (~16) and faster newcomers in the first year; check with the `balance` agent that TH2 does not get too easy.
- [ ] More land unlocked at the start.
- [ ] Smaller mountain with a new design, freeing building space (screenshots first).
- [ ] Resource bar: name next to each number, clearer and more detailed icons.
- [ ] Fix "Every bed is taken" shown while the bar reads 11/12.

## Next rounds (planned)
- **Polish 2 — organisation:** menus and build categories, clearer wording, explicit icons everywhere.
- **Polish 3 — world map and raids:** overlapping labels, Birka in Sweden, England visible, raid balance after TH4 (with the Monte Carlo update).

## Polish after Town Hall 5 (beta polish rounds)
Merge José's play feedback here, grouped as visual / balance / organisation. **PC only for now** (decided 2026-11-10): tune everything on PC, then convert to iPhone; phone items wait in "Phone (later)".
Sources: José's first play feedback (Relaxed mode) and Claude's first review (Beta 0.6.1).

### Visual
- [ ] **Resource bar hard to read** (José): show each resource's name next to the number, clearer and more detailed icons.
- [ ] **Icons in menus too vague** (José): more explicit, detailed icons in build tray, panels and sheets.
- [ ] Mountain massif dominates the TH5 view (about a third of the screen, a flat white block): make it smaller with a new design (José agrees), freeing land for building.
- [ ] World map: labels overlap ("Iona" over "SCOTLAND", "Jutland" over "JUTLAND"); Birka sits on the Norway landmass (should be Sweden); England, the main goal, opens half hidden in mist.

### Balance
- [ ] **Too few people at the start / newcomers too slow** (José, Relaxed): buildings get built but workers are always missing. Raise starting population and/or early attractiveness; check with bots that TH2 does not get too fast.
- [ ] Re-check raiding after TH4 with the new `balance` agent (several runs per profile), together with the Monte Carlo update below.

### Organisation / gameplay
- [ ] **More building space** (José): start with more land unlocked (more than the free 3 × 3 zones) and more buildable room overall.
- [ ] **Menus not well organised, sometimes unclear** (José): review build categories, panel structure and the wording of sheets; explain what each building does and needs.
- [ ] To do says "Every bed is taken" at the start while the bar shows 11/12; make the message and the counter agree.

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
