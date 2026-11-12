# Building style — decided with José (2026-11-12)

Prototype code: branch `house-options`, `source/src/20_zzhouseopt.js` (switch `window.__setHouse(n)` in the test page). Screenshot scripts: `tools/ui/tmp_houseopt.py`, `tools/ui/tmp_housesch.py`.

## Shared rules (every building)
- Lines fine: seams 0.4–0.6 px, edges ~0.8 px, posts as thin filled strips (no thick strokes).
- Every building has a **visible door** with frame, plank lines, iron straps, ring, and stone steps in front.
- Stone footing of single stones, with a little moss.
- Timber frame visible: corner posts, gable cross-beam.
- Small lattice windows that glow warm; optional coloured shutters.
- Thin crossed barge boards at the front gable (natural wood), ends past the ridge.
- No chimneys on wooden houses (smoke hole / louvre where a fire is needed).
- Fine detail (grain, stones, shingle joints) only when zoomed in (> 1.2).
- Roof textures available: straw thatch (strands + thick ridge cap), blue slate (irregular slabs), black tarred shingles (rounded scales), brick-red boards (boards with battens), turf.

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

## Next buildings
One at a time: show the current look close up → José's notes → 2–4 options → choice, recorded here.
