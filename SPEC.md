# Ubbe's Saga — specification (Beta 0.13.0)

How the game works **today**. Numbers are in `docs/NUMBERS.md` (generated). The long-term vision for Town Hall 6–10 is in `docs/DESIGN.md`.

## 1. The game in one paragraph
A cozy-but-harsh Viking village builder for the browser. Year 865, the village of **Kaldstrand** on a Norwegian bay. The player is Ubbe's line: raise the Town Hall from level 1 to 5 (10 in the full game), feed and house the people, keep morale and the gods content, build ships, raid and trade across the North Sea, and live through a realistic succession of jarls. Isometric, low-poly, muted colours ("Névoa do Norte", in the spirit of Bad North).

## 2. Modes
- **Relaxed**, **Challenge** (harsher events and consumption), **Sandbox** (free resources, fast speeds).
- **Test**: choose Town Hall 1–5 and start with a prebuilt village (every building at its limit and highest level, full population, warriors, ships, herd), with test tools and 8×/16× speed. **Gallery**: every building at levels 1/3/5 and every house colour scheme side by side.
- Three save slots per device (`localStorage`, keys `ubbesaga.b09.*`), plus Export/Import in the Saga panel.

## 3. Time
- 1 year = 45 days: 30 summer + 15 winter. 1 day ≈ 27 s at 1×. Speeds: pause, ½×, 1×, 2×, 4× (8×/16× in Test/Sandbox).
- Winter: firewood needed, seasonal buildings rest, fishing drops, sickness rises (warm clothes halve it).

## 4. Map
- 132 × 132 tiles, isometric (tile 64 × 32). Village centre `HOME = (63, 60)`. The map is fixed (same for every saga): **the fjord** (Beta 0.12).
- Kaldstrand sits at the head of a narrow fjord that winds south-east to the open sea; cliffs flank the outer fjord, a range closes the north, a river comes down from it and enters the fjord by the village, a second river feeds the outer fjord. A rocky iron hill rises just north-west of the village, a ridge runs south-west, islands sit at the fjord mouth and a lake lies in the western woods.
- Terrain: sea, beach, grass, forest, berry bushes, river, foothills, iron outcrops, mountains. Mountains are one low-poly heightfield (gentle foot, short cliff band, ridged grey peaks, snow only on the highest).
- **Starting land guarantee:** the generator makes sure the free starting land has iron (at least 10 iron tiles within 14 of the village; about 14 today), berries and forest near the village, and water within a few tiles for fishers; the village core is kept an open meadow.
- Raiders land only on sea joined to the map edge (never on the lake).
- Land is bought in 6 × 6 zones with **fame**; the saga starts with 21 zones (a 5 × 5 block minus its four corners, 30 × 30 tiles); the corners and everything further are bought; cost grows with distance (`30·d − 10`).
- Edges fade into sea-mist; unbought land is slightly darker with a faint tile grid, and each 6 × 6 block is outlined (brighter for blocks next to owned land).
- Trees can be cleared for good (half their wood). Felled trees regrow in 60 days.

## 5. People
- Each person has a name, age, gender, traits (~1 in 4), health, a job or a warrior role, and parents. Children (under 14) do not work; people over 50 work at half rate.
- The **jarl** leads; succession follows the heir (chosen among children). Lineage is meant to be realistic: about 5 jarls by Town Hall 10.
- **Morale** (0–100) from food variety, housing, firewood, festivals, gods, levy, events. ≥ 70: +10% work and more births; < 40: −15%; < 20 for long: revolt risk. The village glows gold / blue-grey / red with morale.
- The saga starts with **16 people** (Ubbe's household of 3, four couples one with a child, four young adults) **4 houses** and the **Jarl's House** (already built) next to the Town Hall (24 beds). The Town Hall stands in the middle of its cobbled square; it can be moved and rotated like any building (not demolished), and rotating it turns the hall and moves the plaza fire to another corner.
- **Attractiveness** draws newcomers when there is room and food; during the first year they come 1.6× faster. From Town Hall 3, in the last 10 days of summer and in winter, newcomers wait while the wood would not cover 5 days of firewood.
- Thralls (from raids) work; soft or harsh policy.

## 6. Economy
- Buildings have worker slots; people are assigned automatically, the player sets how many per building (− / +).
- Output per worker × building level bonus: level 2–3 ×1.2 (fields ×1.3 at level 3), level 4 ×1.4, level 5 ×1.55. Non-field buildings get +1 worker slot at level 3.
- **Balance rule:** a full village at every Town Hall level has **4–8 more workers than jobs**, with every warrior place filled (checked by `tools/balance/jobs.py`).
- Storage caps: food (granaries), goods (warehouses), weapons (arsenal). There is no water resource: the village lives by the river.
- Fisher's Hut: full catch within 5 tiles of the sea or the river; beyond that 16% less per tile (never under 20%); none if no water within 12 tiles. Less in winter (more at sea than on the river).
- Chains: wood → planks; iron → tools / weapons / armour; fish, meat, berries, veg → smoked, preserved, sausage; grain → bread, ale; honey → mead; wool / flax → cloth → clothes.
- Wool, hides and odds-and-ends only appear once something can use them (or trade opens).
- **Keep materials for the next hall** (Town Hall sheet, on by default): once every other requirement is met, workshops stop using the wood, planks and iron the next level needs.

## 7. Town Hall progression
Requirements per level: population, fame earned, specific buildings (some at a level), saga goals, materials. **No "survive N winters" requirement.** Each level unlocks buildings and raises limits.
- Town Hall 1 goals, in order: Settle the shore (berry gatherer + woodcutter → unlocks Carpenter, Preserver, Funeral Pyre) · Timber and planks (40 planks → Granary, Warehouse, Iron Mine, Smithy) · Ready for winter (preserver, granary, warehouse, 35 preserved food → Market; the Jarl's House is already built at the start) · Iron and tools (mine, smithy, 12 tools) · The first winter · A gathering place · A growing village · Town Hall 2. Older saves get any unlocks that moved to earlier goals. At level 3, if no shore is free for a shipyard, the jarl claims a coastal zone for free.

## 8. War, ships, raids
- Troops: skirmisher, spearman, warrior, archer, viking (TH4), berserk (TH5), mercenaries (hired, not trained). Trained at the training ground; gear from the smithy. A batch (5, or 8 at level 2) fills free places under the warrior limit first; when the limit is full, weaker troops at home retrain as the chosen, stronger kind (they need new gear).
- Ships: karvi, knarr (cargo), snekkja (TH4, fast). War-ship cap rises with the Town Hall.
- Raids: choose target, ships, crew, tactic, prisoners, whether the jarl sails. Animated departure and return. Loot, fame, prisoners, grudges; targets recover after plunder. Tribute from cowed villages.
- Provisions: crew × 0.75 meals × (2 × travel + 3 days). Ships only sail if the village keeps 3 days of meals at home, or the whole winter's meals when winter is 10 days away or less (never more than 40% of the food stores). Cowed villages pay half a full plunder as tribute. Provisions not eaten come home as dried fish.
- Regions: Scandinavia (TH3), Northern Isles (TH4), England (TH5 + 40 gold map).
- Defence (TH5): palisade with gates (drawn like roads), watchtowers, levy.
- **Raids on Kaldstrand (TH5+, not in Sandbox):** about every 40–75 days (summer only; 55+ in Relaxed) scouts sight sails and give 5 days' warning (modal, To do, War → Defence). Raiders (6 + 2 per year since TH5, ×0.75 Relaxed, ×1.25 Challenge, max 24) land on the shore outside the palisade, beach their ships and head for the Town Hall along the cheapest path; palisade segments cost more the stronger they are, so they hack through the palisade only when there is no cheaper gap (an unwalled shore is a gap). At most 3 raiders' blows count on one segment. Warriors at home (not archers) come out from the Town Hall, stay inside the ring and strike raiders who reach them or who hack at the palisade (spears reach over the stakes); archers in manned towers shoot within 7 tiles. Raiders who reach the Town Hall steal goods (6 silver or 3 of a good per grab, up to 20 each) and carry them back to their ships; slain raiders drop what they carry. Fallen defenders are wounded (Relaxed) or 45% die (other modes; never the Jarl). After the fight a report shows raiders slain, goods taken, dead, wounded and broken segments; victory gives fame and +6 morale for 20 days, a plunder −6. The game slows to 1× and the camera moves to the landing; a save mid-fight is settled without the scene on the next day (defence vs attack, a closed palisade adds 60–100% to defence; surviving raiders carry off up to 20 goods each). Raiders carry black-and-yellow quartered shields; ours are red with a pale boss.
- **Palisade levels and repair:** Stakes 150 HP per segment, Double stakes 300 (3 planks a segment), Iron-bound stakes 500 (3 planks + 1 iron a segment); gates ×1.3. Upgrades apply to the whole palisade (War → Defence). Damaged stakes are patched for free (¼ of a segment a day); broken segments leave rubble and a gap until repaired (4 wood, + planks at higher levels, per segment).

## 9. Trade
Market with dynamic prices: partners unlock gradually (Skiringssal TH3, Hedeby TH3 + ship, Birka TH4, Dublin TH5, London TH5 + map). Each partner wants and sells specific goods; selling a lot lowers the price (recovers slowly); iron and tools cost ×1.35 to buy, and buying them raises their price (2.5% per unit, up to ×2.5, easing 1% a day); special orders pay +50%.

## 10. Gods, advisors, banquets
- Five gods with favour; blessings, blót, the Hof (TH5) raises favour gain.
- Advisors (council size grows with the Town Hall) give lasting bonuses.
- Banquets (people / warriors / council) and festivals with fire, pig on a spit and dancers at the plaza.

## 11. Interface
- **PC (≥ 900 px wide):** top resource bar grouped (people · food · materials · wealth); each item shows a detailed icon, its name and the amount (in the title font) side by side and the daily change, with a hover breakdown; the To do list warns "Only 1 bed left" / "Every bed is taken" in step with the People counter; date and saga goal under it; speed control and **To do** list on the right; a bottom **dock** (gold border all round, labels in the title font) with panels (Village, People, War, World, Saga), build categories and Roads/Palisade; the **build tray** shows building pictures; building and panel sheets dock on the left; buildings light up on hover.
- **Phone:** same top bar (swipe), bottom navigation, Roads/Build buttons, bottom sheets; build menu with pictures; To do list collapsed.
- **Guide** (new sagas only): a short card above the To do list with 8 steps (seasons, food and wood, workers, fish, planks, food for winter, firewood with this winter's wood need, tools and the Town Hall). Steps with a task move on by themselves when it is done and have a button that starts the placement; the card says how many days until winter. It can be closed and reopened from the Saga panel.
- **Event choices:** each choice shows the action, then a red "You pay" line and a green "You get" line with signed amounts and resource icons (also for festivals and the jarl's funeral).
- **Build categories:** Homes · Food · Farms · Materials (wood, planks, iron) · Crafts (smithy, weaver, tailor) · Storage · Community (market, pyre, altar, Hof, tomb) · Military (training ground, arsenal, watchtower) · Sea · Decor. Build cards show what the building does in one line and what it needs (water, trees, ore, tools); a locked card says what unlocks it ("Unlocks with: Town Hall 3", "Unlocks with: saga goal “Ready for winter”", or both); the building sheet starts with that line, the full description and a "Needs" line (workers, location, tools, road); production buildings show an "Output from workers" bar: output is proportional to the workers present (2 of 4 = 50%), and each worker adds 100 ÷ slots %.
- **Icons:** colour pictograms for the dock panels, build categories, roads and palisade; build cards and upgrade lines show costs as icon + amount (name on hover).
- **To do list:** Town Hall ready, food/firewood shortages, firewood for the coming winter (last 10 days of summer), full beds, idle people, buildings in trouble, the current saga goal, next Town Hall requirement, ships ready to sail. Each item moves the camera or opens the right sheet / placement.
- **Roads and palisade:** click start, click end (the plan is then fixed), Build or Cancel.
- **World map:** full screen, large chart (Iceland to the Baltic, Norway to Frankia); drag/swipe to move, wheel/pinch to zoom; mist at the edges and over lands not yet open, their places still visible (England only lightly misted, so the goal is always in sight). Opens framing Kaldstrand and every open place. Norway and Sweden are labelled; Birka sits on an island off the Swedish coast.
- Fonts: Marcellus SC for titles and for numbers (resource bar, tables, counters), Inter for text. Classic look: dark wood bars, parchment sheets with dark headers, white building cards whose pictures are cropped and centred automatically. PC keeps the central bottom dock (panels, build categories, roads).

## 12. Art direction
**Style: "Frost & Ember"** (chosen Beta 0.12; inspiration Frostpunk, Valheim, Banished): low-poly, flat-shaded, a warm golden summer and a cold blue winter, cast shadows, a slow time-of-day cycle and warm lights in the dark. The style board is the artifact "Ubbe's Saga — 6 estilos de arte".
- **Time of day** (`24_zlight.js`): one light cycle lasts 3 game days. Summer: short night, short dawn, a long warm day, short dusk; winter: shorter day, longer night. The whole scene is graded (soft-light colour, a multiply tint at night, a coloured haze at the top, a sun glow, a vignette). Night stays readable (blue, not black).
- **Shadows:** buildings, trees and the palisade cast soft shadows that swing with the sun (long at dawn and dusk, short at noon).
- **Lights:** from dusk to dawn every building's door glows, fires and the Town Hall more strongly.
 Each building type has its own silhouette as well as wall (planks, logs, stone, timber frame), roof (turf, thatch, shingle) and colours: gable halls, hipped and bowed longhouses (Jarl's House, Trading House), round huts (Berry Gatherer, Hunter), open sheds (Woodcutter's Lodge, Carpenter, Smithy front), a raised storehouse on posts (Granary), pyramid roofs (Mine, Bakery, Smokehouse). The Town Hall is a great bowed longhouse with a hipped turf roof (shingle from level 4), dragon heads, an entrance gable, an annex from level 2 and a raised louvred roof from level 3; the hall stands in the middle of its cobblestone plaza. Logs lie only at the Woodcutter's Lodge, stacked with round ends; all houses share one gable shape and have six colour schemes (per house or whole village); a house keeps its look when moved or rotated. The Hof rises in stave-church tiers: stacked steep shingle roofs with gilded dragon heads and a weathervane. Close up (zoom above ~1.45) roads show gravel and hoof prints, grass gets more blades, clover and flowers, walls show wood grain and knots, footings single stones, and the palisade rope lashings and bark; palisade levels show as a plank rail (Double) and iron bands (Iron-bound), damage as missing stakes. Roads lie on the ground as worn earth paths with ragged grassy edges, a damp darker rim, a sun-dried crown, wheel ruts, mottled patches, the odd puddle and edge stones; meadows and sand have soft lighter and darker patches, and building yards show worked earth and pebbles; bridges are plank decks with rails. Props never stand on roads, water or another plot. Winter turns everything to snow.

## 13. Technical
- One HTML file built from `source/src` modules; canvas 2D renderer; no libraries. Installable PWA (manifest + service worker, offline after first load).
- Render cost is dominated by trees and tile fills; tile colours, mountain triangles and fog are cached. Keep an eye on `tools/balance/perf.py` (ms per frame at three zooms) after visual changes.
