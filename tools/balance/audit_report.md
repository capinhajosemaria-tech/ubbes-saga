# Ubbe's Saga — balance audit report (Beta 0.12.0)

Step 2 of the "Balance audit (Fable)" round. Written 2026-11-11 from `docs/NUMBERS.md`, `SPEC.md`, `tools/balance/audit_data.md` (48 bot runs x 900 days), the economy code in `source/src`, and `tools/bots/bot4.js`. No game code was changed. File references are `file:line` in `source/src` unless a path is given.

To check claims the data could not settle, I ran 23 extra planner runs with throwaway hooks kept outside the repository (age groups, summer workforce, idle workers, trees in range of each lodge, a map dump of a stuck shipyard run, and one A/B test on a patched copy of the test page). Those numbers are marked **[own run]**. They are small samples (5 to 6 runs each) and should be read as direction, not as precise values.

Severity: **high** = distorts play or the data at several Town Halls; **med** = a clear imbalance or a wrong number a player will meet; **low** = cosmetic, dead code or a small effect.

---

## (a) Executive summary

1. **The TH3 to TH5 bot data is mostly a picture of the bot, not of the game.** 22 of 48 runs stall at TH3 because the auto-placer walls its own shore in (B1); in summer the bot leaves 17 to 46% of its workforce idle while "materials" block the hall (B2); it never upgrades or staffs most food buildings and sells its preserved winter food (B3, B4). Fix the bot before tuning costs.
2. **TH1 and TH2 are sound** (TH2 at day 54 to 65, TH3 at day 137 to 155, no shortages, no leavers). Nothing in this report changes the first part of Town Hall 1.
3. **Children fill the houses.** By year 10 to 20, 33 to 45% of the population is under 14 and does not work; the summer workforce is about 45 to 50% of the population, where `jobs.py` assumes 67%. The "4 to 8 spare workers" rule is measured on a test village that does not look like a played one, and is not met either way (+11 to +17 on the test village, about -10 to -25 with real age groups at full housing).
4. **Preserver levels 4 and 5 add nothing and Smokehouse levels 2 and 4 add nothing** (rounding), and **ale and mead count as food but are never eaten**. These are plain errors.
5. **Winter food at TH5 is a real but narrow game problem**: with every food building at level 3 a full TH5 village cannot feed itself over a year; it works only at level 4 to 5 with both pens upgraded. The Bakery is the weak link (4 barley a day against 8 to 24 grown).
6. **Silver has no purpose after the hall is paid**: about 650 silver a year comes in from trade from TH3 on, against about 2,000 to 2,500 of total sinks up to TH5. Prices are not the cause; unlimited merchant silver and missing sinks are.
7. **Firewood, iron and tools are no longer problem resources.** Planks and wood are "short" only in the sense that the hall cost is the gate; the shortage in the data is bot staffing.
8. **Village raids cannot be lost with the full garrison at home, palisade or not**; the palisade only matters while crews are away, and its bonus is counted twice in the off-screen fight.
9. **A peaceful path does not exist by rule** (TH3 needs trained warriors, TH4 a raid, TH5 an Isles raid or tribute); a low-raid player is slowed by fame (1,700 for TH5, about 400 above what the saga goals give).
10. `docs/NUMBERS.md` is stale (header says Beta 0.11.0, troop gear column empty), Test mode villages miss 2 to 6 buildings at TH3 to TH5, and several old constants are dead.

---

## (b) Findings

### Part 1 — Imbalances

#### A1 — Children take the beds; the real workforce is far below what the balance rule assumes (high)
- **Evidence.** `jobs.py` test villages: 25% children, workforce 66 to 71% of population (audit_data section 10). Played villages [own run, 6 planner runs, summer days]: day 470: 40 to 54 children of 114 to 140 people; day 830 to 875: 46 to 70 children of 117 to 167 (33 to 45%); nobody is 60 or older; summer workforce 36 to 86 (about 45 to 50% of population). Day-900 age groups in 5 runs: 37 to 44% under 14, and only 2 to 23 people aged 14 to 29. audit_data section 2: "workforce end 20 to 75" for final populations of 82 to 165.
- **Cause.** A married woman of 16 to 43 has a 0.7% chance a day (`14_people_lineage_morale_gods_r.js:219`), with a 1.2-year gap, so about one child every 4.4 years and about 6 children per woman. A child works at 14 (`:98`), which is 630 game days, 70% of a 900-day run. A birth and a newcomer compete for the same free bed (`:215`, `:229`); a newcomer is 17 to 36 and works at once. So births crowd out adult settlers and the working share falls year after year. Warriors (up to 30 at TH5) do not work in summer on top of that.
- **Effect on the rule.** At TH5 limits there are 132 job slots (`bal.py`). Full housing is 224. With the test village's age mix the spare is +17; with the played mix (about 0.47 x 224 = 105 workers, plus thralls) it is about -15 to -25. The SPEC rule "4 to 8 more workers than jobs" holds in neither case.
- **Proposed change.** (1) Working age 14 -> **12** in `workerVal` (child-labour policy then covers ages 10 to 11). (2) Birth chance 0.007 -> **0.004** a day. (3) Make `jobs.py` build its village with the age mix of a played village (take it from a 900-day bot run at the day each hall is reached), and restate the rule against that.
- **Expected effect.** A/B test on a patched copy [own run, 6 runs each]: at day 875 the summer workforce was 90 to 92 of 148 to 164 people (about 58%) against 63 to 84 of 158 to 167 (about 45%); children 34 to 56 against 46 to 69. Town Hall days did not move, because the bot does not use the extra hands (B2). No effect on TH1: no child reaches 12 in the first 60 days.

#### A2 — Bakery throughput is too small for the grain fields and for winter (med)
- **Evidence.** Bakery: `u = n x E` batches, 2 barley + 0.5 wood -> 2 bread each (`13_daily_economy.js:47`). Level 1 with 2 workers uses 4 barley a day = 180 a year, all year round. One level-1 Grain Field makes 8 a day in summer = 240 a year. Limits: fields 2 / 2 / 3 at TH3 / 4 / 5 against 1 bakery and (from TH4) 1 brewery with the same appetite. Grain grown against grain used at level 1: TH3 480 vs 180; TH4 480 vs 360; TH5 720 vs 360. The surplus can only be sold at 1 silver. Bread made: 4 a day = 6 meals for a village that eats 40 to 60. Data section 12: bread 51 to 199 a year against 1,690 to 3,187 food items.
- **Why it matters.** Grain is the only food input that does not spoil and the Bakery is one of three food sources that work in winter (with fishers at 25 to 40% and hunters).
- **Proposed change.** Bakery output per worker: 2 barley + 0.5 wood -> 2 bread becomes **4 barley + 1 wood -> 4 bread per worker a day** (`u = n x E x 2`). Update the `out` text.
- **Expected effect.** Level 1: 8 bread = 12 meals a day all year (540 meals a year from 360 barley, 1.5 fields). Level 5: 28 meals a day. Covers about a fifth of the TH3 to TH5 winter deficit (17 to 28 meals a day in the bot data) and gives the second and third grain fields a use.

#### A3 — A full TH5 village cannot feed itself with level-3 food buildings (med)
- **Evidence (computed from code, full housing 224, about 98 meals a day).** All food buildings at level 3: summer production about 122 a day (fish 38, berries 8.5, gardens 23, hunters 14, pens 27, bread 11), winter about 41. Summer surplus 24 x 30 = 730, winter shortfall 57 x 15 = 860, before 3% a day spoilage. At level 5: summer 173, winter 52, surplus 2,250 against shortfall 690: fine. So the level works only at level 4 to 5 and only with both pens upgraded (pens are 30% of the food).
- **Bot data.** Winter-start stock falls from 724 (TH4) to 466 (TH5) while the village eats 59 to 67 a day; food-shortage flag on 23 to 49% of TH5 winter days; 25 to 31 leavers or deaths per run at TH5. But the bot keeps pens, gardens, hunters, preserver and smokehouse at level 1, builds 1 pen of 2, staffs 2 of 6 grain slots, sells 351 smoked + 308 pickles + 59 dried fish per run (about 1,400 meals) and leaves workers idle (B2 to B4). Most of the measured shortage is the bot.
- **Proposed change.** A2 (Bakery) and E1 (Preserver and Smokehouse levels) first; then re-measure with the fixed bot. Do not raise fish or garden output yet.
- **Expected effect.** With A2 at level 3: +11 meals a day all year: surplus 1,050 against shortfall 700, so level-3 villages balance.

#### A4 — Berry Gatherer upgrades and the second gatherer hardly pay (low)
- **Evidence.** A bush holds 15 berries a year (`05_natural_objects.js:7`, refilled at `13_daily_economy.js:95`). The starting land has 32 bushes; the first gatherer had 14 in range, the second 17, partly the same ones [own run]. Berries made per year are 255 in every year from year 1 to year 20 (section 12) although a second gatherer is built. A level-1 gatherer can pick 240 a year; 14 bushes give 210. A level-5 gatherer could pick 558 and would need 37 bushes within 5 tiles; the whole starting land has 32.
- **Proposed change.** Bushes in range of a gatherer refill to 15 x that gatherer's level bonus (15 / 18 / 18 / 21 / 23). Level 1 stays exactly as it is, so TH1 is untouched.
- **Expected effect.** Upgrading a gatherer on 14 bushes gives 252 / 294 / 322 berries a year in place of a flat 210.

#### A5 — Hay Meadows are over-provided (low)
- **Evidence.** One level-1 meadow makes 300 hay a summer. A herd eats 0.4 a head for 15 winter days: 72 for a full level-1 pen (12 head), 528 for two level-5 pens (88 head). One level-5 meadow makes 465. Limits are 0 / 1 / 1 / 2 / 3. Bots build 3 and use 348 worker-days in 900 days (1% of all work).
- **Proposed change.** Hay Meadow limits 0 / 1 / 1 / 2 / 3 -> **0 / 1 / 1 / 1 / 2**.
- **Expected effect.** No change in play; 2 fewer empty job slots at TH4 and TH5, which also brings the jobs count closer to what a village really staffs.

#### A6 — The Animal Pen grows faster than anything else with level (low, no change proposed now)
- **Evidence.** Herd growth is herd x 0.04 x level bonus a day (`13_daily_economy.js:52`) and the herd cap also grows with level (12 + 8 per level), so meat per pen is 4.8 / 9.6 / 13.4 / 20 / 27 a summer day for levels 1 to 5, always with 2 workers. A level-5 pen is about 2.2 times a level-5 Fisher's Hut per worker. Upgrading to level 5 costs 400 wood and 100 planks in total.
- **Note.** A3 depends on this strength, so leave it until the food picture is re-measured. Teach the bot to upgrade pens (B3).

#### A7 — Wood output is capped by the trees around the lodge, and upgrades can be wasted (med)
- **Evidence.** A tree gives 25 wood and regrows in 60 days, so a lodge can sustain (trees in range) x 0.42 wood a day. The first, free lodge had 28 trees in range in every run checked = 11.7 a day [own run]. A level-3 lodge with 4 workers wants 14.4, level 4 wants 16.8, level 5 wants 18.6. By day 200 the first lodge reads "No trees left in range" and still holds 4 workers [own run, every run]. Measured output is 2.71 wood per worker-day against 3.0 to 4.65 nominal (section 9).
- **Cause.** Game: nothing tells the player that a lodge is tree-limited until it is empty, and workers stay assigned to an empty lodge. Bot: staffs lodges in build order, so the empty one first.
- **Proposed change.** (1) Lodge sheet: show "Trees in range: N, enough for X wood a day" and warn when the staffed rate is above X. (2) `assignWorkers`: a lodge with no standing tree releases its workers that day. No number change.
- **Expected effect.** 4 workers back at TH3+ in bot runs; players see why a level-4 lodge by a small grove gives the same as level 2.

#### A8 — Workers vs jobs against the written rule (med)
- **Evidence.** Test village spare: +11 / +12 / +20 / +35 / +35 as printed, but 2 to 6 buildings were not placed; adding their slots gives **+11 / +12 / +14 / +14 / +14**. `bal.py`: +13 / +14 / +16 / +15 / +18. Target 4 to 8. In winter another 32 farm slots rest and 30 warriors come back to work at TH5, so about 75 of 150 workers have nothing to do.
- **Cause.** House limits were raised (11 / 15 / 22 / 25 / 27) after the rule was tuned in Beta 0.6 (`07_building_definitions.js:74` comment still claims 4 to 8).
- **Proposed change.** Do not cut houses. First apply A1 (3) so the rule is measured on a realistic village; then set the target from that measurement. With today's age mix the honest statement is "a full village has fewer workers than jobs from TH4 on, so the player chooses what to staff".

### Part 2 — Errors and inconsistencies

#### E1 — Preserver levels 4 and 5, and Smokehouse levels 2 and 4, add no output (high, error)
- **Evidence.** Preserver makes `Math.round(n x (E > 1 ? 1.25 : 1))` items (`13_daily_economy.js:31`): 2 at level 1, 3 at level 2, 4 at level 3 (3 workers), 4 at level 4, 4 at level 5. The level 4 and 5 upgrades cost 45 wood + 60 planks and 60 wood + 80 planks for nothing. The same line gives +50% (2 -> 3) at level 1 whenever morale is 70 or more, or a Fisher's Hut is within 4 tiles, where the game text promises +10% and +15%.
  Smokehouse makes `Math.max(1, Math.round(n x E))` (`:42`): 2 / 2 / 4 / 4 / 5 for levels 1 to 5. Level 2 only unlocks sausages; level 4 gives nothing.
- **Proposed change.** Preserver: keep the formula for levels 1 to 3 (so TH1 is unchanged) and use a level factor of 1.6 at level 4 and 1.9 at level 5: **4 -> 5 -> 6 items a day** with 3 workers. Smokehouse: carry the fraction over to the next day (`b.acc += n x E`, make whole items): 2.0 / 2.4 / 3.6 / 4.2 / 4.65 a day.
- **Expected effect.** Two level-5 preservers: 24 meals a day preserved in place of 16; every paid upgrade does something.

#### E2 — Ale and mead count as food but nobody eats them (med, error)
- **Evidence.** `MEAL` has ale 1 and mead 2 (`06_economy_constants.js:4`), so `foodUnits()` counts them. The eating order (`13_daily_economy.js:81`) and `spendMeals` (`14_people_lineage_morale_gods_r.js:104`) leave them out. 40 ale show as 40 meals in the food bar, in the "food for 6 days" test for births and newcomers, in the raid provisions rule and in the festival choice, but cannot be eaten. `spendMeals` can return true and take fewer meals than asked.
- **Proposed change.** Leave ale and mead in the granary count, but take them out of `foodUnits()` (meals). Show them under goods in the resource bar.
- **Expected effect.** The food number means what it says; a brewery no longer hides a famine.

#### E3 — Dead worker slots: the Market worker and the third Pen worker (med)
- **Evidence.** `marketOn` is set and never read (`13_daily_economy.js:5`, `:36`); newcomers use `has('market')` (`14_people_lineage_morale_gods_r.js:229`) and attractiveness too (`:133`). A Market Square with no worker and no road gives the full bonus. The Pen gets a third slot at level 3 (`slotsOf`, `07_building_definitions.js:57`) but works at `min(1, n / 2)` (`13_daily_economy.js:52`), so the third worker adds nothing.
- **Proposed change.** Market: the x1.25 newcomer bonus only while its worker is in place (keep the +15 attractiveness for the building). Pen: no extra slot at level 3 (treat it like a field in `slotsOf`).
- **Expected effect.** One honest job at the market; 1 to 2 fewer fake slots at TH3 to TH5.

#### E4 — Palisade bonus counted twice off-screen, and SPEC disagrees with the code (med)
- **Evidence.** `defenceValue()` multiplies by 1.5 when the palisade is closed (`14_zcontent45.js:55`). `vrAuto` multiplies that again by 1.2 + 0.4 x palisade level = 1.6 / 2.0 / 2.4 (`25_zvraid.js:130`). Total 2.4 / 3.0 / 3.6. SPEC section 8 says "adds 60 to 100%".
- **Proposed change.** In `vrAuto` use the warriors' raw strength (without the 1.5) times 1.6 / 2.0 / 2.4, and write "60 to 140% by palisade level" in SPEC.

#### E5 — `docs/NUMBERS.md` is stale and incomplete (low)
- Header says "Beta 0.11.0"; `source/VERSION` is Beta 0.12.0. The Troops table has an empty "Cost / gear" column for all 7 troops. Buy prices, the merchant visit rhythm, winter fish factors, firewood per house, food per person and troop gear are not in the file although they are balance numbers. **Change:** regenerate; add a "Daily needs" block (0.5 meals a person, 0.25 child or elder or thrall, 0.75 warrior; firewood 1 a house, 0.75 from level 3, 2 for the hall, x1.3 hard winter) and a "Market" block (base prices, x1.35 wanted, x1.23 to buy, x1.35 more for iron and tools).

#### E6 — Test mode villages are not complete (low, also hurts `jobs.py`)
- **Evidence.** `buildTestVillage` could not place Weaver and Hunter's Lodge at TH3; Salt Works, Smokehouse, Bakery, Weaver, Hunter's Lodge, Brewery at TH4; Preserver, Salt Works, Smokehouse, Bakery, Weaver at TH5 (section 10). SPEC section 2 says "every building at its limit".
- **Cause.** `planSpot` returns only the 12 best candidates for buildings without a site need (`30_ztestmode.js:11`) and packs buildings with no road corridor, so late buildings find no reachable plot. Same routine as the bot's planner (B1).
- **Proposed change.** Return all candidates (drop the 12 cut), and place road-needing workshops before fields. `jobs.py` should fail loudly when `testMissing` is not empty.

#### E7 — Dead or misleading values (low)
- `DRINK`, `capWater`, `drinkers()` and `r.water` in Test mode: water was removed in Beta 0.8 (`06_economy_constants.js:3`, `11_resources_caps.js:10`, `14_people_lineage_morale_gods_r.js:102`, `29_panels.js:26`, `30_ztestmode.js:29`).
- `PRICES` and `BLESS_OLD` (`08_saga_milestones.js:28`, `:31`): replaced by `BASEP` and the newer blessings; `PRICES` is still exported to the test page.
- `LIMITS` is written three times (`07_building_definitions.js:44`, `:67`, `:75`); the first two sets are overwritten for 17 keys. Keep one table.
- `priceBuy` has a x1.2 branch for goods the partner does not sell (`14_zcontent45.js:37`); the buy list only shows goods the partner sells, so it never runs.
- `S.mode !== 'x'` (`14_people_lineage_morale_gods_r.js:215`) is always true.
- Hunger text can say "thirst" (`:204`).
- Wording: Thrall Pen says thralls "eat half a meal" (they eat 0.25, half a ration); Training Ground says warriors "eat 1½ meals" (0.75, one and a half rations); Woodcutter says trees regrow "in about a year and a half" (60 days = 1.3 years).

### Part 3 — Consumption, production, progression

#### P1 — Consumption and production reference (checked against code)
| Item | Value | Source |
|---|---|---|
| Food per day | adult 0.5, child or 50+ 0.25, warrior 0.75, thrall 0.25 | `06_economy_constants.js:3`, `14_people...:101` |
| Spoilage | fresh fish, berries, meat, veg 3% a day; bread 2% | `13_daily_economy.js:84` |
| Firewood | 1 a house (0.75 from level 3), 1 Jarl's House, 2 hall; x1.3 hard winter | `11_resources_caps.js:12` |
| Firewood per winter | TH1 about 135; TH3 about 330; TH5 350 to 450 (590 hard, level-1 houses) | computed; data 8.9 to 31.6 a day |
| Tools | 1 per 60 worker-days in tool buildings; about 0.35 a day at TH1, 1.2 at TH5 fully staffed | `13_daily_economy.js:12` |
| Smithy | 1 tool a day (2 workers, level 1), 2.3 at level 5; anvil 10 iron per 100 days | `:23` |
| Iron Mine | 6 a day (3 workers), needs 3 ore tiles in range | `:22` |
| Carpenter | 4 planks a day from 8 wood (level 1), 9.3 at level 5 | `:21` |
| Fisher's Hut winter | x0.4 by the sea, x0.25 on the river, x0.8 more in a hard winter | `:27`, `14_people...:157` |

Firewood, iron and tools add up and are not structurally short: firewood shortage on 0 to 6% of winter days, iron and tools stock change is positive or flat at every level (section 6). The Beta 0.9 firewood fix holds.

#### P2 — Pacing: TH3 -> TH4 and TH4 -> TH5 take twice as long as the first two steps (med, re-measure before changing)
- **Evidence.** Days per level, median: 60 / 87 / 184 / 190 (section 5). Goods paid per level (planner): planks 170 / 293 / 532 / 720; wood 433 / 708 / 1,424 / 1,430.
- **Cause.** Partly real: TH3 adds a long chain (shipyard, harbour, weaver, 10 sailcloth + 10 rope, a karvi with 110 work-days, warriors, a raid, Granary and Warehouse to level 3, 100 silver through trade). Partly the bot: it stops carpentry at 250 planks when TH5 needs 320, leaves 14 to 46 workers idle in summer [own run], and loses 4 workers to an empty lodge.
- **Proposed change.** None to costs now. After the bot fixes, if TH3 -> TH4 is still above about 150 days, cut the TH4 hall cost from 260 wood / 220 planks to **220 / 180**.

#### P3 — Population requirements and population goals are passed before they are seen (low)
- **Evidence.** Hall requirements 22 / 32 / 48 / 80 people. Bot population on arrival: about 45 at TH2, 65 at TH3, 115 at TH4, 125 at TH5; population is never the last missing item (section 5, observation 13). Goals "Reach 40" (TH3) and "Reach 60" (TH4) complete the day the level starts.
- **Cause.** Housing was raised after Beta 0.6 (now 52 / 83 / 140 / 183 / 224 beds); the gates were not.
- **Proposed change.** Hall population 22 / 32 / 48 / 80 -> **22 / 40 / 70 / 110** (TH2 unchanged). Goals: "A proper town" 40 -> 80, "A small town" 60 -> 120, "A hundred hearths" 100 -> 160 (rename the last one, or keep 100 and accept it is immediate).

#### P4 — Fame: the saga goals alone do not reach the TH4 and TH5 gates (med for low-raid players)
- **Evidence.** Fame from goals available before each hall: 240 for TH2 (needs 150), 470 for TH3 (needs 450, only 20 spare, so "Honour the gods" is in practice required), 840 for TH4 (needs 950), 1,300 for TH5 (needs 1,700). The rest comes from the yearly fame (10 + population / 3, about 30 to 55 a year, `14_people...:445`), festivals (+5 each), raids (8 for tribute, 18 to 63 for a win) and the Council feast (+20). Fame was missing in 35 to 39% of TH3 samples.
- **Proposed change.** TH5 fame 1,700 -> **1,500**; TH4 stays 950. See O2.

#### P5 — Unlock order: nothing is out of order
The TH1 chain (berry + wood -> carpenter, preserver, pyre -> granary, warehouse, mine, smithy -> market, Jarl's House) works and is not touched. Tailor (TH5) uses hides that have been produced and sold since TH3; Beehives (TH4) feed a Brewery that turns 2 honey (5 silver) into 1 mead (5 silver), so brewing mead adds value only through partners who want mead and through banquets. Both are acceptable.

### Part 4 — Open items

#### O1 — Silver piles up (high)
- **Evidence.** Trade sales about 10,900 silver a run (rope 3,060, hides 2,580, cloth 1,350, smoked 1,310); bought 800; paid for buildings and halls 300 to 500. Stock 4,300 to 10,300 on reaching TH5 and up to 16,000 at day 900. Net +15 / +38 / +26 a summer day at TH3 / 4 / 5.
- **Cause.** (1) A merchant has unlimited silver; three ships call each summer. (2) Saturation is too mild to matter: -7% per lot of 10, floor 0.4, +0.8 points a day back (`29_zworld_trade.js:106`, `14_zcontent45.js:41`); average prices realised are 87 to 137% of base. (3) All sinks up to TH5 together are about 2,000 to 2,500: halls 350, Hof 50, about 100 gold for tomb, TH5 and the England map (1,350 at 13.5 each), some iron. Mercenaries cost 14 silver a year for strength 2.0 (`14_zcontent45.js:65`). The bot makes it worse by never using hides (no Tailor work) and never buying thralls or mercenaries.
- **Proposed change.**
  1. Merchant purse: each merchant ship carries **100 / 150 / 200 silver at TH3 / TH4 / TH5**; what you buy from him goes back into his purse. Show it in the trade sheet.
  2. Mercenaries 14 -> **40 silver** each a year.
  3. Town Hall 5 silver 250 -> **400**; Hof silver 50 -> **150**.
  4. Upgrades to level 4 and 5 cost silver too: workplaces **+15 / +30**, houses **+5 / +10**.
- **Expected effect.** Income capped at 300 / 450 / 600 a year (today about 450 / 1,140 / 780). New sinks about 2,700 if everything is upgraded. Silver on reaching TH5 should fall from 4,300 to 10,300 to roughly 1,000 to 2,000. This is an estimate; confirm with bots.

#### O2 — The peaceful bot reaches TH5 later (med)
- **Evidence.** There is no peaceful profile in `profiles.json`. With `noRaid` the bot cannot pass TH3 (TH4 needs "The first raid", `07_building_definitions.js:76`); with `noWar` it cannot pass TH2 (TH3 needs "The first warriors"). TH5 needs "True vikings" and "The Northern Isles". Tribute counts as a raid, and 703 of 878 raid outcomes were tribute without a fight.
- **Cause of "later".** Fame (P4): a player who raids only when a goal demands it must find about 400 fame from the yearly income, 7 to 9 years at TH4.
- **Proposed change.** P4 (TH5 fame 1,500). Add a profile `{"planner":1,"calm":1}` that raids only while a required goal is open. Ask José whether a truly peaceful route should exist (for example "The first raid" also completed by 10 trades); that is a design choice, not a number.

#### O3 — Village raids and palisades (med)
- **Evidence.** Off-screen fight: attack = raiders x 7.5, defence = warrior strength x 3.2 (`25_zvraid.js:130`). Raiders are 6 + 2 a year, at most 24, so attack is at most 180. Thirty warriors at home give about 90 strength = 288. The village cannot lose with the garrison at home, with no palisade at all: bots won 93 of 103 with "walls 0". About 56 strength (20 vikings) beats the largest raid. A palisade costs 4 wood a segment (about 480 wood for a ring of 120).
- **Reading.** The palisade matters only while crews are at sea, which is also summer. That is a fair role, but the player is never told, and the first raids (4 to 6 raiders) are trivial.
- **Proposed change.** E4 (single bonus). Raiders 6 + 2 a year -> **8 + 3 a year, at most 30** (attack up to 225). Warning text: say how many warriors are at home and whether the palisade is closed.
- **Bot.** See B5.

#### O4 — Market prices (low)
- Buy prices are consistent (iron 4.99, tools 9.98, gold 12.3; no buy-low sell-high loop). Hides are wanted by 4 of 5 partners, so they almost always sell at x1.35; rope has no use after about 65 for ships. With the purse in O1 no base price needs to change. If one does: hides 3 -> 2.5.

### Part 5 — Bot problems that distort the data

#### B1 — Shipyard cannot be placed: the planner walls off its own shore (high, bot and placer; not a player problem)
- **Evidence.** [own run] In a stuck run `planSpot('shipyard')` still returns 24 to 35 legal plots, `yardFits()` is false, and a flood from the best plot is stopped by the bot's own gardens, hay meadows, houses, bakery and training ground, by forest and berry tiles, and by locked land. The road end is boxed in by three buildings. `claimShore` (`13_daily_economy.js:115`) cannot help: land is there, only the way is blocked.
- **For a player.** Not hard: 24+ legal plots, the TH2 toast tells you to keep shore free, buildings can be moved, trees cleared. Residual game risk: a player who does box the shore in gets no message. Suggest a To do line "No road can reach the shore: move a building or clear trees" when TH is 3+, there is no shipyard and `yardFits()` is false.
- **Fix in `bot4.js`.** The planner path of `build()` skips the shore reservation (`RES` / `inRes` are only used in `findSpot`). From day 1: after every `placeAuto(t)` for `t != 'shipyard'`, call `G.yardFits()`; if it turned false, remove the building (`G.B.splice`, `rebuildOcc`, `recomputeConn`) and try the next candidate. Same guard for the Harbour and the tomb (`tomb:bot` and `trade:bot` fails come from the same packing).

#### B2 — `staff()` leaves workers idle and caps planks below the hall cost (high)
- **Evidence.** [own run] Summer day 830 to 875 at TH4 and TH5: 14 to 46 idle of 60 to 86 workers. Day 900: both carpenters, both mines, smithy, preserver, smokehouse, bakery, weaver, brewery at 0 workers with TH5 unpaid. Carpentry stops at 250 planks (TH5 needs 320) unless `SAVING`, and `SAVING` is false while any saga goal is open. Grain gets 2 workers for up to 6 slots.
- **Fix.** Plank target = next hall planks + 60 at all times. Give all grain, garden, flax and hunter slots. End `staff()` with a loop that hands every remaining free worker to carpenters, then lodges that have standing trees, then mines, then fishers. Skip lodges whose status is "No trees left in range".

#### B3 — Never staffs Beehives, Tailor, Hof; never upgrades food buildings; builds one of each (med)
- **Fix.** `give('hives', all)`, `give('tailor', 2)` while wool >= 2 and hides >= 1, `give('hof', 1)`. Upgrade list: add pen, garden, hunter, pres, smoke, bakery, mine, smith (today only house, gran, ware, wood, fish, carp). Build up to the limit for pen, pres, smoke, flax, smith, hives, salt. Drop the hay keep of 9,999 and build one meadow.

#### B4 — Sells winter food and hoards goods (med)
- **Fix.** Never sell smoked, sausage, dried fish, pickles or jam while food stock is under 20 days of meals. Sell flax and hay above 60. Buy thralls up to the pen's cap and hire mercenaries when warriors are under the cap, so silver sinks are exercised.

#### B5 — No palisade (med)
- **Fix.** At TH5, once wood >= 600: take the bounding box of all buildings plus 2 tiles, walk its outline, set a wall on every land tile that is not occupied, a gate where the outline crosses a road, and extend along the beach so the hall is cut off from every sea tile (the test in `wallsClosed` floods from the sea and the map edge and ignores buildings, so buildings do not close a gap). Pay `wallCost` (4 wood a segment, +6 planks a gate), call `recomputeWalls()`, check `S.wallClosed`. Then report raids won and lost with and without the crew at home.

#### B6 — Retries a refused raid every day (low)
- 127 to 257 refusals a run are the same launch tried daily. Count one refusal per target per trader cycle, or wait 5 days after a refusal.

---

## (c) Prioritized shortlist

| # | ID | Change | Why first |
|---|---|---|---|
| 1 | B1, B2 | Bot: keep the shore reachable; staff every free worker; plank target = hall cost + 60 | Without these no TH3 to TH5 number can be trusted |
| 2 | E1 | Preserver level 4 / 5 make 5 / 6 a day; Smokehouse carries fractions | Paid upgrades that do nothing |
| 3 | E2 | Ale and mead out of the meal count | Food bar and winter checks are wrong |
| 4 | A2 | Bakery 2 -> 4 bread per worker a day | Winter food and unused grain |
| 5 | A1 | Working age 14 -> 12, birth chance 0.007 -> 0.004, `jobs.py` with real age mix | Workforce share 45% -> about 58% |
| 6 | O1 | Merchant purse 100 / 150 / 200; mercenaries 14 -> 40; TH5 silver 250 -> 400; Hof 50 -> 150; silver on level 4 / 5 upgrades | Silver gets a meaning |
| 7 | E3 | Market bonus needs its worker; Pen has no third slot | Dead jobs |
| 8 | O3, E4 | Palisade bonus once; raiders 8 + 3 a year, at most 30 | Raids that can be lost; SPEC matches |
| 9 | P3, P4 | Hall population 22 / 40 / 70 / 110; TH5 fame 1,700 -> 1,500 | Gates that mean something; low-raid players |
| 10 | E5, E6, E7 | Regenerate NUMBERS.md, complete Test villages, remove dead constants | Housekeeping |

Hold back until re-measured: A3 (more food), P2 (TH4 cost cut), A6 (pen), A8 (rule target).

## (d) Bot fixes needed before the confirmation runs

1. **B1** shore guard with `G.yardFits()` after every placement; same for harbour and tomb. Target: 0 of 48 runs with `shipyard:bot`.
2. **B2** no idle workers in summer; plank and wood targets tied to the next hall cost; skip empty lodges.
3. **B3** staff hives, tailor, hof; upgrade and multiply food buildings up to their limits.
4. **B4** keep preserved food for winter; stop hoarding hay and flax; spend silver on thralls and mercenaries.
5. **B5** build and close a palisade at TH5; log garrison size and "crew away" for each village raid.
6. **B6** one raid refusal per attempt window.
7. Add to the daily log: children, people 50+, summer workforce, idle workers, trees standing per lodge, and split "battle" deaths into sea raid and village raid.
8. Add a `calm` profile (raids only for required goals) so O2 can be measured.
9. Run the old and the new bot once each on unchanged game code, so bot effects and game changes are not mixed.

## (e) What I could not verify

- **The on-screen village raid** (raider 26 HP, 3.4 damage, wall hit points): only the off-screen formula was checked. Whether a live fight with 30 warriors is as safe as the formula says is not known.
- **How José's own villages compare with the bot's** (age mix, idle workers, silver). The silver proposal assumes a player sells roughly like the bot; a player who sells less has less of a problem.
- **Effect sizes of A2, O1, E1, P3 and the raid change**: computed from formulas, not simulated. Only A1 was tested on a patched copy, with 6 runs.
- **TH4 and TH5 pacing without bot errors**: every run in the data has B2 to B4, so the true days per level are unknown; P2 may disappear.
- **Challenge mode** specifics (hunger deaths 10 to 58 a run) were not analysed separately; they follow the same winter food cause as A3 and the same bot faults.
- **Events, gods, advisors, thrall and banquet economy**: read only where they touch the numbers above (yearly fame, banquet costs). Silver from events, peddlers and prisoners is not separated in the data.
- **`docs/DESIGN.md`** was not read; nothing here was checked against the TH6 to TH10 plan.
- **Births after the change**: 0.004 a day gives about 4 children per woman; whether that still feels right for the Jarl's line (about 5 jarls by TH10) needs a long run.
