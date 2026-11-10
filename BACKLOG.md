# Backlog

José adds feedback here while playing (or tells Claude, who adds it). At the start of a round, pick 3–6 items and move them to "This round".
Format: `- [ ] what · why / where seen` — screenshots welcome in the conversation.

## This round
(empty — choose at the start of the next conversation)

## Polish after Town Hall 5 (beta polish rounds)
Merge José's play feedback here, grouped as visual / balance / organisation. From Claude's first review (Beta 0.6.1):

### Visual
- [ ] Mountain massif dominates the TH5 view (about a third of the screen, a flat white block); smaller, further back, or more varied shading.
- [ ] World map: labels overlap ("Iona" over "SCOTLAND", "Jutland" over "JUTLAND"); Birka sits on the Norway landmass (should be Sweden); England, the main goal, opens half hidden in mist.

### Phone (iPhone 14)
- [ ] Speed buttons cover the saga goal text; with 8×/16× (Test/Sandbox) the column is very tall. Consider a single speed button that opens the choices.
- [ ] First hint ("Tap Build to begin") stays on top of the Build sheet once it opens.
- [ ] World map uses only the top half of the screen (see also "World map on phone" below).

### Balance
- [ ] Re-check raiding after TH4 with the new `balance` agent (several runs per profile), together with the Monte Carlo update below.

### Organisation / gameplay
- [ ] To do says "Every bed is taken" at the start while the bar shows 11/12; make the message and the counter agree.

## Bugs

## Wanted
- [ ] Hof: the raised upper roof reads as a flat stripe; redraw as a proper stave-church tier.
- [ ] World map on phone: bigger map area or a toggle to hide the target list.
- [ ] New dock and docked inspector are PC-only; consider a phone version of the build tray.
- [ ] Re-measure troop strength and raid value for vikings, berserks and the new regions (Monte Carlo in `tools/balance/raidmc.py` needs updating).
- [ ] Heavy raiders lose population after Town Hall 4 (deaths and people leaving); check if raiding is too punishing or the bots raid too much.
- [ ] Market is generous for buying iron and tools; revisit after José plays a full saga.

## Ideas for later (Town Hall 6–10, see docs/DESIGN.md)
- [ ] Town Hall 6–10 content: settlements, kingship (level 8), wonders, Danegeld, Christianity.
- [ ] Iceland, Ireland, Frankia and the Baltic on the world map (currently always in mist).

## Done
See CHANGELOG.md.
