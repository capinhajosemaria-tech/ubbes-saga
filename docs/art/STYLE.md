# Building style — decided with José (2026-11-12)

Prototype code: branch `house-options`, `source/src/20_zzhouseopt.js` (switch `window.__setHouse(n)` in the test page). Screenshot scripts: `tools/ui/tmp_houseopt.py`, `tools/ui/tmp_housesch.py`, `tools/ui/tmp_optgrid.py TYPE SETTER "opts" "levels" ZOOM OUT`, `tools/ui/tmp_millriver.py "opts" ZOOM OUT` (mills on real river banks), `tools/ui/tmp_tower.py "opts" ZOOM OUT` (1-tile tower set into a palisade).
This file is mirrored in the claude.ai project as `claude/Estilo dos edificios.md`.

## Shared rules (every building)
- Lines fine: seams 0.4–0.6 px, edges ~0.8 px, posts as thin filled strips (no thick strokes).
- Every building has a **visible door** with frame, plank lines, iron straps, ring, and stone steps in front.
- Stone footing of single stones, with a little moss.
- Timber frame visible: corner posts, gable cross-beam.
- Small lattice windows that glow warm; optional coloured shutters.
- Thin crossed barge boards at the front gable (natural wood), ends past the ridge.
- No chimneys on wooden houses (smoke hole / louvre where a fire is needed) — except the **small stone chimney astride the ridge** (`bkChimney`) that José chose for the Bakery and the Brewery: one per building, walls starting on the roof, lead flashing, cap slab, smoke.
- Fine detail (grain, stones, shingle joints) only when zoomed in (> 1.2).
- Roof textures available: straw thatch (strands + thick ridge cap), blue slate (irregular slabs), black tarred shingles (rounded scales), brick-red boards (boards with battens), turf.
- José keeps the yard clean: when in doubt, fewer props outside (he removed sacks, millstones, tubs, loose logs, foam).
- Things under a lean-to roof are mostly hidden from the game's top-down view: prefer what can be seen (things on walls, in front, on frames).

## House (chosen: option 1 "cottage", without turf)
- Gable house, plank walls on a visible frame, door centred under the front gable, **one shield above the door** (level 3+), window left of the door (level 2+), second window on the long wall (level 4+).
- Lean-to woodshed behind, along the ridge, with stacked log ends (level 3+). Chopping block with axe (level 2+).
- Grows each level (longer, taller); carved ends on the barge boards at level 5.
- **Roofs**: thatch, blue slate, black tarred shingles, brick-red boards.
- **8 colour schemes** (all kept, one at random per house): 1 Pine and straw · 2 Tar and slate · 3 Falu red · 4 Silver grey · 5 Oak and red boards · 6 Birch and black · 7 Ochre and slate · 8 Black and red (7 and 8 rarer).
- To polish when implementing: shutters cover the window a little; house fills a bit more of its plot.

## Jarl's House (chosen: option 2, 2026-11-12)
- Same bowed hip-roof longhouse as before, taller (walls 24 px), on an **imposing cut-stone plinth** (staggered blocks, cap slab, moss) with a wide 3-step stair to the door. No banner.
- **Black tarred shingles** (rounded scales) on the long slope, courses on the hip end.
- Dark staves on a visible frame; **carved double door** in an arch, gold interlace portal, iron straps, two torches.
- **4 windows with red shutters** on the long side, red/white shields between them.
- **Ridge beam and dragons are one carved piece**: one ribbon of dark wood from snout to snout, single outline, tapering up into the necks, one gold groove the whole length; flat carved heads (long snout, open jaw, swept crest, eye slit, cheek spiral) — not cartoon-like.
- Prototype: `window.__setJarl(2)`.

## Town Hall (chosen: option 2 "Red-board hall", 2026-11-12)
- Bowed hip-roof great hall, **brick-red board roof** (boards + battens), dark tarred staves on a frame; gilded eave trim from TH4.
- **Dark cut-stone plinth** (bigger, darker blocks than the Jarl's House), two tiers from TH4, wide stair to the plaza (3 steps, 4 from TH4).
- **Vestibule** facing the plaza: own gable, **Urnes portal** (gold interlace) around an arched carved double door, antlers on the apex, gold/blue shield in the gable (TH2+), a side window, **two small wall torches** beside the door.
- Walls: **shield – window – shield** on each side of the vestibule; gable: window – shield – window. Windows glow.
- **Raised lantern** (TH3+): walls stand on the roof and follow the slope, lead flashing + shadow at the foot, glowing windows, own red-board roof.
- **Ridge beam + dragons** (one carved piece, dark wood, gold groove); from TH3 the beam stops at the lantern: the back piece hides behind it, the front piece comes out of the lantern's end wall (cut end visible).
- **Plaza cleared**: no runestone, banners, barrels, posts or tables. Only lights are the windows and the two door torches. The **feast hearth** stands out: its own circle of light flagstones with a kerb, log benches, raised two-course stone hearth, embers, crossed logs, layered flames and sparks; feast adds the spit and dancers.
- Prototype: `window.__setTH(2)`.

## Hof (chosen: option 1 "Black stave", 2026-11-12)
- Stave-church temple on a stone plinth (flush with the back gallery, margin + 2-step stair in front of the door).
- Hall: dark staves on a frame, steep gable roof in **black tarred scale shingles**; carved arched door with gold portal on the front gable, fully visible.
- **Covered galleries on both long sides** (lean-to roofs on posts, carved arches, low rail), none on the front facade.
- **Tower stands on the ridge**: its walls start on the roof and follow both slopes (the end wall shows the ridge peak), lead flashing + shadow at the foot, louvred openings; pyramid skirt, second tier, tall spire, gold weathervane; small dragon heads at the skirt corners.
- **Ridge beam + dragons** in one carved piece (dark wood, gold groove), stopping at the tower; the front piece comes out of the tower wall.
- **Geometric sacred pole** beside the door (never in front of it): stepped stone base, square shaft with painted chevron/diamond/triangle bands (red, gold, black), stepped capital, one-eyed Odin mask in flat planes, gold valknut. **Stone altar** (hörgr) next to it with a bronze bowl.
- Roof textures are clipped to their surface on every building.
- Prototype: `window.__setHof(1)`.

## Granary (chosen: option 4 "Stabbur + hay barrack", 2026-11-12)
- Norwegian stabbur: posts on flat **rat stones**, sill beams, log lower storey with a door, **wider upper storey** (joist ends showing, vent hatch in the gable), black tarred scale-shingle roof, crossed barge boards (carved ends at L5).
- **Real ladder** (two rails, rungs) from the ground to the door sill.
- **Hay barrack** behind: four tall posts, pyramid roof over a hay mound that grows at L3.
- **No props scattered on the ground**; at L5 grain sheaves hang under the eave.
- Prototype: `window.__setGran(4)`.

## Warehouse (chosen: option 3, 2026-11-12)
- Long plank store on a stone footing, visible frame, **brick-red board roof**, grey weathered walls, shuttered window in the gable.
- **Wide double gate** on the long side (Z-braces, iron straps, rings) with a low stone ramp; a second gate at L5 (longer building).
- **Covered loading lean-to** on the front gable from L3, crates stacked neatly under it. **No hoist.**
- Shared rule (all buildings): crossed barge boards at **both** gables — the back pair: the board on the visible slope runs its full length, the other shows only its tip above the ridge.
- Prototype: `window.__setWare(3)`.

## Woodcutter's Lodge (chosen: option 2, 2026-11-12)
- Log hut at the back (door, shuttered window, crossed boards at both gables), **black tarred scale-shingle roof**.
- Open woodshed (posts, lean-to roof, same shingles at the **same density as the houses**) **full of split firewood**: a solid stack from the floor up (taller from L3), split ends showing on the open front.
- **Round logs as real cylinders**: bark body, rounded far end, cut front end with rings; ~3 px thick; pile in nested rows drawn back-to-front and bottom-up (3 rows L1, 4 L3, 5 L5).
- Sawhorse with a log and a bow saw; chopping block with axe; log sled from L3.
- Shared rules from here on (all buildings, also earlier ones): **no pennants/flags**; **no log-end circles at the corners** of log walls; scale shingles keep the original house look; small roofs only get extra rows/columns so there are no empty bands.
- Prototype: `window.__setWood(2)`.

## Carpenter (chosen: option 2, 2026-11-12)
- Plank workshop at the back (door, shuttered window; larger with a gate at L5), **black tarred scale-shingle roof**.
- **Open drying shed**: lean-to rising toward the viewer so the inside shows; **stacks of sawn boards with stickers** between layers (second stack from L3).
- **Saw pit in the open** beside it: pit, log on trestles, a cut board on top, two-man pit saw standing in the kerf.
- Sawhorse with bow saw from L3.
- Prototype: `window.__setCarp(2)`.

## Smithy (chosen: option 2, 2026-11-12)
- Workshop at the back: stone lower walls, timber above, door, window; **black tarred scale-shingle roof**.
- **Open forge shed** in front (lean-to rising toward the viewer): **stone forge** near the open front with glowing embers, bellows, tools hanging on the back wall, water bucket.
- **Stone chimney** from the forge up **through the shed roof**: above the roof its walls start on the roof surface, lead flashing at the joint, stone cap, smoke.
- **Anvil** on an oak block under the shed, hammer resting on it. Iron bars stacked from L3. No charcoal pile.
- Prototype: `window.__setSmith(2)`.

## Market Square (chosen: draft 5 with floor A, 2026-11-12)
- **Booths** round the whole perimeter (7, all facing the centre): plank back wall + half side wall, plank counter with goods, a basket inside, goods hanging on the back wall; front-row booths have a low back wall so goods stay visible. Covers: muted natural-dyed wool awnings (ridge rod, front rod, middle pole, guy ropes and pegs — pole and ropes drawn **under** the cloth, never over it) or black-shingle / red-board roofs.
- **Well**: round stone shaft of staggered blocks, coping ring, dark water, two posts, windlass with rope and crank, bucket, little shingle roof with **thin** crossed boards, stone trough.
- **Floor A**: dark granite setts in running bond, kerb of dressed stones, a little moss at the edges. (Other floors kept in the prototype: `window.__FLOOR=2` slabs, `3` earth + plank walks, `4` light flagstones.)
- Rejected concepts: dyed-stripe stalls round a well, tent fair, covered hall, market tree ("pouco realista"), cobble fans.
- Prototype: `window.__setMarket(5)`.

## Iron Mine (chosen: option 1 "Hillside adit", 2026-11-12)
- Stands on grass beside the iron outcrop tiles, so it must read as **a way down underground**.
- **Rock knoll** built in irregular layers (grey rock sides, grass on the top layers, boulders at the foot), no rust streaks.
- **Cut rock face** at the front with the **timbered adit**: dark mouth with an inner frame, two posts and a lintel, log cribbing on both sides; a glow of lamp light inside and a lantern on a post at L5.
- **Wooden rails** out of the mouth to an **ore cart** (plank box, iron bands, heaped red ore); grey **spoil heap** on the left (a second one at L5), rusty **ore pile** in front, a pick against the rock.
- **Tool lean-to** from L3 on the right: plank back wall with hanging tools, posts, black scale shingles at house density.
- Prototype: `window.__setMine(1)`.

## Berry Gatherer (chosen: option 1 "Wattle round hut", 2026-11-12)
- **Round hut only** — no smoke hole, no berries or props outside (José).
- Stone footing ring of single stones; **wattle walls** (upright stakes, rods woven in and out), light and warm, lit from the left.
- **Tall thatched cone** with a slight bell: thick ragged eave edge, two course steps, hazel rods pinning the eave, fine straw strands when zoomed in; **tied straw crown** with a rope band at the top (no dark cap).
- **Arched door** facing the viewer: frame posts and arch, planks, iron straps, ring, flat stone step.
- Grows each level; small glowing lattice window with red shutters from L3; L5: gold interlace on the door arch and a **rope net with hanging stone weights** over the thatch.
- Own shadow (cylinder + cone). Prototype: `window.__setBerry(1)`.

## Fisher's Hut (chosen: mix of plank hut + stilts, 2026-11-12)
- **Plank hut on stilts** (posts with diagonal braces, sill beam), weathered grey planks, black scale-shingle roof, crossed barge boards; door on the gable opening onto the jetty (no stone steps).
- **Plank jetty** on piles from the door along the plot, mooring post at the end.
- **Stockfish rack** behind the jetty: posts, rail, split cod hung in pairs (second rack from L3).
- **Færing at real size** (José): about as long as the hut, a quarter as wide; clinker strakes with rivets, rising sheer, curled stem and stern posts, two thwarts, oars inside; pulled up on **two log rollers** (the hut is not always beside water).
- L3: window with blue shutters; L5: longer hut, carved barge ends, a net drying on the jetty, a lantern at its end.
- Own shadow. Prototype: `window.__setFish(1)`.

## Preserver (chosen: option 3 "Jam workshop", 2026-11-12)
- Makes **jam only** (José; game change noted in BACKLOG — dried fish moves to the Smokehouse).
- Plank house in honey-brown planks, **brick-red board roof**, crossed barge boards, door on the long wall, window with red shutters on the gable.
- **Open porch** in front (plank floor, three posts, lean-to of red boards): a **freestanding shelf rack facing the viewer** full of clay crocks with tied cloth covers, a **copper kettle of jam** on a stone hearth with a little steam (not smoke), a work table behind.
- L3: longer rack; L5: longer house, second kettle, carved barge ends. No herbs hanging (they hid the shelves).
- Own shadow. Prototype: `window.__setPres(3)`.

## Smokehouse (chosen: option B "A-frame", 2026-11-12)
- Will also make the dried fish (see BACKLOG).
- **A-frame**: black scale-shingle roof down to a low stone footing, almost no walls; plank gable with a **tall pointed door** (planks, straps, ring, stone step) and a **slatted vent near the apex** with soot around it.
- **Slatted ridge louvres** letting the smoke out (one at L1, two from L3); carved barge ends at L5.
- **Open drying shed** behind it (black scales, lean-to rising toward the viewer): smoked fish hung in pairs; a second rail of **hams** from L3.
- Own shadow. Prototype: `window.__setSmoke(2)`. (Option A "smoke tower" kept in the prototype as `__setSmoke(1)`.)

## Pig Pen (chosen: option 1, 2026-11-12)
- **Woven wattle fence** round the plot (stakes, rods bulging in and out row by row), a plank gate at the front; back runs drawn first, front runs last.
- **Norse pigs**: dark and bristly (red-brown, black-brown), a bristle ridge on the back, long snout, pointed ear, curled tail; slow wander; count follows the herd.
- Natural **mud wallow** (irregular, wet sheen); **low plank sty** with black scales and an open doorway with straw; a hatch from L3, carved barge ends at L5. Nothing else on the ground.
- Own shadow. Prototype: `window.__setPig(1)`.

## Sheep Pen (chosen: option 4 "Round stone fold + shieling", 2026-11-12)
- **Round dry-stone fold** (courses of stones, cap stones, moss) with a pole gate facing the viewer; back half drawn before the animals, front half after.
- **Small shieling** inside at the back: stone walls, **turf roof** with grass tufts on the ridge, a dark doorway with a lintel stone.
- **Norse short-tailed sheep**: small, tufted wool in white, cream, grey, brown, black; some with curled horns; slow wander inside the ring; count follows the herd.
- **Ground follows the pen's shape** (José): round trodden earth inside the wall instead of the square yard patch, a worn path out of the gate (`groundShape(b)` in `20_zzhouseopt.js`).
- Own shadow. Prototype: `window.__setSheep(4)` (options 1–3 kept: wattle, dry-stone square, skigard).

## Training Ground (chosen: option 2 "Hazel staves and ropes", 2026-11-12)
- **Round** (José liked the circular look of the Sheep Pen): **sand floor following the circle** (`groundShape`), a worn path out of the entrance.
- Ring of **hazel staves** with leafy tops and **ropes** sagging between them (the vébönd of a duel/court ring), an opening with two posts facing the viewer.
- **Holmgang cloak** pegged flat in the middle (red-brown with a border, four pegs).
- Straw **dummies** with painted round shields (1 at L1, 2 at L3, 3 at L5); a **rack** of spears and painted shields at the back. No chopping-block target in this option.
- Own shadow (thin ring). Prototype: `window.__setTrain(2)` (options 1 wattle, 3 palisade, 4 standing stones kept).

## Altar (chosen: option 2 "Five god-posts", round, 2026-11-12)
- No levels (one look).
- **Round floor of dark cobbles at ground level** (laid in rings, kerb of dressed stones, a little moss), centred on the plot; round trodden ground around it with a worn path out the front.
- **Five carved god-posts round the edge of the circle**, evenly spaced, Odin (tallest) at the back, the front left open: each on a small stone base, painted bands, a carved face (Odin one-eyed, Thor bearded), a symbol on top — Loki serpent, Njord ship, Odin gold valknut, Thor hammer, Freyja gold ring with spiral.
- **Stone altar in the centre**: stacked stones, thick top slab — **nothing on top of the slab** (José).
- **Lighting: a few small torches on stakes** (4: two at the back, two flanking the entrance) — not too many. No campfire.
- Own shadow (posts + altar). Prototype: `window.__setAltar(2)` (options 1 cairn, 3 vé shrine, 4 blót stone ring kept).

## Funeral Pyre (chosen: option 1 "Stone ship setting", 2026-11-12)
- No levels (one look). **Skibssætning**: standing stones in a ship outline along the plot, taller at stem and stern; back side drawn before the pyre, front side after.
- **Log crib** in the middle (layers of round logs crossing, cut ends with rings).
- **Fire only while someone is cremated** (José): each cremation sets `S.pyreT`; the pyre burns for a day and a half (charred top, embers, flames, sparks, smoke) and glows at night only then. Otherwise the crib stands unlit and there is no night glow. `window.__PYREFIRE=1` forces the fire for screenshots.
- Ash-grey trodden ground in an oval following the ship. Own shadow. Prototype: `window.__setPyre(1)` (2 round stone hearth, 3 burial mound + pit, 4 pyre boat kept).

## Fields — Grain, Flax, Fodder (chosen: option 1 "Wattle fence", 2026-11-12)
- **Low woven wattle fence** round the 3×3 plot (as the Pig Pen), an opening with two posts at the front; back runs before the crop, front runs after.
- Tilled soil with **raised ridges** in rows (fodder: green sward, no ridges). **Crops drawn as plants in rows**, back to front, growing with the summer (`summerProgress`; `window.__SP` forces it for screenshots):
  - **Grain (barley)**: green → yellowing → gold; ears with awns that nod over when ripe.
  - **Flax**: slender stalks, **blue flowers** mid-summer, then brown seed bolls, straw colour at the end.
  - **Fodder**: grass tufts, oat panicles, a few meadow flowers (white, yellow, pink).
- **After the harvest: only low, even stubble** (José) — no stooks, haycocks or drying racks. Winter: snow over the stubble.
- **Same look at every level for now** (José). No shadow volumes (flat). Prototype: `window.__setField(1)` (options 2 skigard + hesje, 3 cleared-stone banks + cairn, 4 open strips with balks kept).

## Water Mill (chosen: option 4 "Stone mill", 2026-11-12)
- On the bank: the **mill house on the land half**, the **wheel in the river** beside its long wall. The wheel goes on the side where the river water actually is (`mlSide(b)`: centroid of river tiles in and around the plot); drawn before the house when the river is behind it.
- **Stone lower storey** (dressed blocks), timber above, **blue slate roof**, crossed barge boards (carved ends at L5), door on the front gable with a step; window with red shutters from L3; longer house at L5.
- **Big undershot wheel** (two rims, paddles between them, spokes, hub) turning with the current, a timber axle into the wall; a low **stone wheel-pit wall** along the bank.
- **Nothing at the door and no foam** (José): no flour sacks, no spare millstone, no foam at the wheel.
- Own shadow (house + wheel). Prototype: `window.__setMill(4)` (1 log mill undershot, 2 plank mill with flume and overshot wheel, 3 Norse kvern on stilts kept).

## Bakery (chosen: option 2 "Stone bakehouse", 2026-11-12)
- **Stone bakehouse** at the back of the plot: dressed-stone walls on a footing, timber gable, **blue slate roof**, crossed barge boards (carved ends at L5), door on the front gable with a step, window with red shutters from L3; longer at L5.
- **The oven is inside** (José): no clay oven outside, no loose logs. A **small stone chimney** astride the ridge, mid-roof (`bkChimney`), with smoke.
- Own shadow. Prototype: `window.__setBake(2)` (1 oven in the yard, 3 griddle shed, 4 two ovens under a canopy kept).

## Brewery (chosen: José's own "big A-frame", option 5, 2026-11-12)
- Makes the drinks (ale from grain, mead from honey); the Tavern is where they are drunk.
- José rejected the four drafts (plank + kettle porch, stone + chimney + barrel lean-to, log + vats shed, malt kiln) and asked for **a big building whose roof comes down to the ground**.
- **Big A-frame** filling most of the 2×2 plot: **brick-red board roof** (to tell it apart from the black-scale Smokehouse) down to a low stone footing; plank gable with a **tall pointed door** (planks, straps, ring), a slatted vent near the apex, a flat stone step; crossed barge boards (carved ends at L5); longer and taller at L5.
- **One small stone chimney** astride the ridge (José: one chimney is better integrated than louvres), with smoke.
- **Two barrels standing against the gable**, one each side of the door. Nothing else outside.
- Own shadow. Prototype: `window.__setBrew(5)` (drafts 1–4 kept).

## Weaver (chosen: option 3 "Sail drying frame", 2026-11-12)
- Makes ship goods: wool → **sailcloth**, flax → **rope**.
- Plank house at the back (honey-brown planks, visible frame), **brick-red board roof**, crossed barge boards (carved ends at L5), door on the front gable with a step, window with red shutters from L3; longer at L5.
- **Red-and-white striped sail stretched on a tall drying frame** in front: two posts, a yard on top, the sail laced to it with a slight belly, guy ropes to the ground. Two wool baskets beside it.
- Own shadow. Prototype: `window.__setWeave(3)` (1 thatched house + warp-weighted loom porch, 2 rope walk with twisting wheel, 4 sunken A-frame with the loom in the open gable kept).

## Tailor (chosen: option 4 "Hide frames", 2026-11-12)
- Makes **warm clothing** (wool cloaks, fur-lined boots) from wool + hide.
- **Stone house** (stone lower walls, timber gable), **blue slate roof**, crossed barge boards (carved ends at L5), door on the front gable with a step, window with blue shutters from L3; longer at L5.
- **Two round hide-stretching frames** of bent wood on legs in front, each with a laced pelt (fur texture, legs spread). **No tub** (José).
- Own shadow. Prototype: `window.__setTailor(4)` (1 thatched house + clothes line with cloaks, 2 shop counter + cloak stand, 3 cutting-table lean-to kept).

## Tavern (chosen: option 2 "Red-board hall with porch", 2026-11-12)
- 3×2, no levels. Where folk drink ale and mead in the evenings.
- **Long hall**, plank walls on a dark frame, **brick-red board roof**, carved barge ends, **open lit door** in the middle of the long wall (warm light inside and a pool of light on the ground), lit windows with blue shutters on the long wall and one on the gable.
- **Covered porch along the whole front** (posts, a beam, red-board lean-to) with **two long tables with tankards and benches** under it.
- **Two barrels against the gable** (as on the slate draft, José) and a **sign post** with a hanging board and a gold drinking horn.
- Own shadow. Prototype: `window.__setTavern(2)` (1 black-scale hall with torches, 3 thatched hall + fire-pit yard, 4 stone-footed slate hall kept).

## Watchtower (chosen: option 3 "Stone foot", black roof, 2026-11-12)
- José: **slim, on ONE tile, standing in the palisade line**; the wall tiles beside it join it. Game change in BACKLOG (today it is 2×2 and stands apart). In the prototype the tower's tile is marked `walls[i]=3`: neighbours link their logs up to it, `drawWallTile` skips that tile and the tower draws short palisade runs (with the earth bank) from its base to each joining side — back runs before the tower, front runs after. Works in a straight run and at a corner.
- **Stone foot** (dressed blocks, ~14 px), **log shaft** above with a door at the foot on the +a face, an **overhanging plank gallery** on brackets with arrow slits, **black tarred scale-shingle pyramid roof** (José: black instead of slate).
- Own shadow. Prototype: `window.__setTower(3)` (1 open post tower with log parapet, 2 log shaft + red roof, 4 palisade-log tower kept).

## Arsenal (chosen: option 2 "Stone strong-house", 2026-11-12)
- 3×2, stores weapons.
- **Long stone house** (dressed stone walls on a footing, timber gable), **blue slate roof**, crossed barge boards (carved ends at L5); longer at L5.
- **Iron-bound double door** with an arched top in the middle of the long wall (iron bands, rings, a stone threshold), **small barred windows** either side.
- **A row of painted round shields** hung under the eave along the long wall (red/white, blue/gold, white/black, green/white, gold/red).
- Own shadow. Prototype: `window.__setArsenal(2)` (1 black hall with open weapon bay, 3 red hall with shield-wall lean-to, 4 raised armoury on posts kept).

## Shadows (shared rule, 2026-11-12)
- José: the dark box shadow (and the ground patch) does not match the buildings' shapes.
- Each redrawn building gives its own **shadow volumes** (`shShape(b)` in `20_zzhouseopt.js`: ground outline + height); the cast shadow is the union of those, swept along the sun. The old box shadow stays only for buildings not yet redrawn. Done for the Iron Mine; to do for every building when the styles are rolled out.
- The light ground patch under each plot (`drawGround`) should follow each building's shape too: a building can draw its own ground with `groundShape(b)` (done for the round Sheep Pen); to do for every redrawn building.

## Next buildings
One at a time. José (2026-11-12): **send 4 drawn options straight away** (no separate "current look" step) → José's choice and notes → recorded here.
When José asks for a fix, change only that (no extra changes without asking).
Order still to do: Shipyard / Harbour → Ship-Tomb → Decor. (Everything else is decided.)
