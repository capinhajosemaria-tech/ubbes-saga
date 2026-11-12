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

## Next buildings
One at a time: show the current look close up → José's notes → 2–4 options → choice, recorded here.
