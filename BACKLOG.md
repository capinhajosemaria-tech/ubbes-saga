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
- Round 1 — economy, resources and first art (Beta 0.14.0).
- Round 1C — production panel, reserves, chains, upgrades list (Beta 0.15.0).
- Music and placement — 20 min of season music + special pieces, building rotation, doors where they are drawn, 3×3 shipyard (Beta 0.17.0).
- Work priorities and Town Hall builders (Beta 0.17.1).
- Wood, sources that run out, market panel (Beta 0.18.0).
- 1D start choices, patron god, Feast · 1E trade map · more newcomers · berths · 4-side rotation (Beta 0.19.0).
- 1J new guide · new opening (story + choice cards) · gold and silver in the top bar · click selects by tile (Beta 0.20.0).
- Economy and walls — Preserver jam only + Smokehouse at TH1 (dried fish merged), one-worker buildings, bigger storage at one price, 1-tile watchtower in the palisade, E1/E2/E5–E7 (Beta 0.21.0).

## 1. Core redesign (decided with José, 2026-11-11)
Goal: fewer systems, each one counts more; decisions matter, but the player stays free to build his own way and can always progress (maybe more slowly). City building and resources first; the lineage matters later, when resources are less of a worry.
Order: Round 1 (done, 0.14.0) → 1C (done, 0.15.0) → 1D + 1E (done, 0.19.0) → **Round B (open economy and balance, prepared 2026-11-13)** → **1H** → 1I → 1F → 1G → 1K (1J done, 0.20.0) (1K's place not decided yet — ask José). Balance fixes 1 items E1 (Smokehouse) and A2 (Bakery) are replaced by Round 1; re-check the rest after it.

## This round — B. Open economy and balance (prepared 2026-11-13; José starts it in a new conversation)
**Goal (José):** a player who **does the upgrades** and keeps **morale and attractiveness above 60 on average** reaches **Town Hall 5 without problems**. Players who play worse may go slower, but can always progress.
**Bots allowed:** José asked explicitly (2026-11-13) to use the economy bots to test and tune values up to TH5 in this round (the `balance` agent for runs and comparisons, Sonnet; never Fable/Mythos). Raids stay out of tuning (bots never build a palisade).
**Saves:** the map does not change; keep old saves loading if possible (bump the save keys only if the save format really has to change, and then tell José).
Version when released: **Beta 0.22.0**.

- [ ] **B1. Open building limits** (José, 2026-11-13). Buildings still unlock by Town Hall level and saga goals, but **ordinary buildings (resources, food, farms, storage) and houses have no count limit**. **Keep the limit** on unique or strategic ones: Town Hall, Jarl's House, Market Square, Tomb of Ragnar and other wonders, Altar/Hof, Training Ground, Shipyard, Harbour (berths), Trading House. **Decor keeps today's limits.**
  - **Rising cost per copy** so cheap buildings can't be spammed and upgrading stays worth it (start: +30% per copy above the 2nd; tune with bots).
  - The bottleneck for collectors is **their own sources** (claims in `10_zsources.js`): a new lodge next to others gets few free trees, so it goes to a fresh forest. The build preview must show it clearly ("8 of 20 trees its own · 40% output").
  - Update everything that reads limits: `LIMITS`/`limitOf`, build tray counts ("2/3" → just the count, or "2" + next copy's cost), unlock hints, saga goals, bots (`tools/bots/bot4.js`), `gen_numbers.py` (Limits column → "no limit" / cost rise).
- [ ] **B2. Each source gives more as the collector is upgraded — the map does not change** (José, 2026-11-13). Problem today (theoretical full output vs a year of own sources): woodcutter 675 / 1080 / 1395 at levels 1 / 3 / 5 vs 1000 wood; fisher 430 / 690 / 890 vs 500 fish (river 350); berries 240 / 430 / 560 vs 270; mine 270 / 430 / 560 vs **200 iron a year** (400 every 2 years). From level 3, upgrading only empties the sources sooner (a level-5 lodge has no wood in winter; a level-3 fisher has no fish in winter).
  - **Yield per source grows with the level of the building that owns it** (e.g. the same multiplier as output, `srcLvlMult`: ×1 / 1.2 / 1.2 / 1.4 / 1.55, or a bit more), so an upgraded collector's own trees / bushes / water / outcrops hold enough for the whole year including winter. `SRC_NEED` (sources needed) stays as it is.
  - **No new trees, bushes or outcrops: the map generator and the forests stay exactly the same** (José: "não é para spawnar mais árvores, é para cada árvore dar mais").
  - Iron: keep it scarcer than wood (José's 1K worry was iron piling up), but upgrading a mine must be worth something. Consider a yearly refill (same average) instead of every two years — easier to understand.
  - River fishing: a level-1 river hut should still have some fish in winter.
- [ ] **B3. Population held by mood; unlimited houses** (José, 2026-11-13). Births and newcomers **fall sharply** when morale / attractiveness are very low and rise when they are high (today newcomers ×0.5 below 40 morale; births don't care). Building houses alone must not grow the village. Together with **A1 — too many children** (audit: 33–45% under 14): working age 14 → 12, birth chance 0.007 → 0.004 (tune with bots), `tools/balance/jobs.py` with the real age mix. José said "implement all balance changes" (2026-11-13), so A1 is approved.
- [ ] **B4. Silver and small economy fixes** (audit, `tools/balance/audit_report.md` — read each finding first):
  - **O1 — silver has no use** (~650/yr in vs ~2,000–2,500 of sinks to TH5; bots end with 8–17k unspent). Re-measure after 1E, then pick from: merchant purse 100/150/200 at TH3/4/5; mercenaries 14 → 40; TH5 silver 250 → 400; Hof 50 → 150; silver on level 4/5 upgrades. With B1, the rising cost per copy could also take silver from the 3rd/4th copy at TH4+.
  - **E3** — Market bonus only with its worker; Pen loses its useless third slot.
  - **O3 (part)** — palisade bonus counted once (today twice). Raider numbers and frequency (O3, E4) stay for later, after José meets a few raids.
- [ ] **B5. Pacing TH3–TH5 and the held items, measured with the bots**:
  - **P3, P4**: hall population 22/32/48/80 → 22/40/70/110?; TH5 fame 1,700 → 1,500? (check current values first — some changed since the audit).
  - Re-measure and decide: more food output (A3), TH4 cost cut (P2), pen scaling (A6), the "4–8 spare workers" target (A8).
  - A2 (Bakery) was replaced by 1B: only check bread is not the weak link of TH5 winters.
- [ ] **B6. Bot profile for the goal, then tune until it passes**:
  - Teach `bot4.js` to **upgrade collectors and workshops** (today it upgrades houses, storage and what the TH asks), to **use the open limits** (build a 3rd/4th copy when its sources are free and it pays), and to **keep morale and attractiveness ≥ 60 on average** (decor, feasts, food variety, offerings). New profile, e.g. `steady`, in `tools/bots/profiles.json`; keep `planner`, `warlord`, `challenge`, `lazy`.
  - **Targets for `steady`** (several seeds, 900 days): average morale and attractiveness ≥ 60; reaches TH5 (about 450–600 days, today's 434–587); no starvation, no day without water, wood never at 0 in winter, firewood never burns planks below the reserve; no Town Hall wait longer than ~60 days caused by a missing resource; spare workers within the A8 target. **`lazy` must still progress** (slower is fine) — the player is never stuck.
  - Tune the numbers of B1–B5 until the targets hold; write the before / after table in `tools/balance/` and summarise it for José in Portuguese.
- End of round as usual: `SPEC.md`, `docs/NUMBERS.md`, `CHANGELOG.md`, tick this list, `tools/check.py` via the tester, release with **ubbe-release**.

## Bugs and small fixes
- (none)

## Next rounds (in this order)

### Music feedback (Beta 0.17.0)
- [ ] José listens and says what to change per piece (instruments, tempo, mood, groove). Composer and steps: `tools/music/README.md`.

### 1H. Living village (José, 2026-11-11)
- [ ] **Real people walk**: each villager is a walker (today only 3–10 decorative ones wander near the hall). At dawn they walk from their own house to their workplace along roads, at dusk back home; children play near home, warriors at the Training Ground, elders walk slower. Commute follows the light cycle (3 game days), not every 27-second day.
- [ ] **Click a person**: sheet with name, age, traits, family, house and workplace; buttons to show their house and workplace. Click a house or building → list of who lives / works there.
- [ ] Visual only at first (walking distance does not cut output). Watch performance (~110 people at TH5): fewer figures when zoomed out.

### Play feedback for 0.21.0
- [ ] José plays: first winter with the Smokehouse at TH1 (wood ½ per smoked food), one-worker buildings (enough jobs? too many idle people?), storage 450 at one price, watchtowers in the wall (limit still 2 at TH5 — more?).

### Play feedback for 0.19.0
- [ ] José plays: patron favour speed (falls ~0.35 a day, offerings +8), wrath at 25, Feast costs, trade offers (acceptance 1.12 at relation 30), request rewards (1.5×), berths. Advisors: 4 seats in all (2nd at TH3, 3rd TH4, 4th TH5) out of 6 advisors — check this is what was meant.
- [ ] Rotation: on the last two turns the door is on the hidden far side (no new art). If José wants a visible back door or different back walls, that needs new art per building.
- [ ] Heirs get or inherit traits (lineage): today Ubbe's trait stays with the whole line.

### 1I. Saga and events
- [ ] **Year chronicle**: at the end of each winter a short saga page (births, deaths, harvests, raids, the jarl); kept in a book that can be reread.
- [ ] **Events tied to the player's choices**: fewer, stronger events (26 today) that react to the patron god and Ubbe's trait (Thor's sign before a battle, merchants for a Trader, wolves only in winter).

### 1F. World map
- [ ] One map from Finland to Portugal, down to North Africa and the future Middle East targets; mist over it that still shows the coastlines; targets marked as now.

### 1G. Worker priorities
- [ ] Setting: keep today's per-building − / +, or **priorities by category** (food, materials, crafts, building: high / normal / low).

### 1K. Sources run out again — done in Beta 0.18.0
- [ ] José plays and says if wood is still the limit and if iron still piles up (numbers in `10_zsources.js`: `SRC_Y`, `SRC_NEED`, `SRC_RATE`).

### 1J. Tutorial — done in Beta 0.20.0
- [ ] José plays the new opening and guide and says what to change (text, order, pictures).

## 2. Art redesign (José, 2026-11-11)
Prototypes are on branch `art-prototypes` (code, switches and option sheets: `docs/art/README.md` on that branch). Nothing is released.
José's problems with buildings close up: many have **no door**, **chimneys badly seated on roofs**, **details sparse** and **lines too thick**.
Decided: roads B, grass B (now in Round 1).
- [x] **New building art and grass released in Beta 0.16.0**: every building, the decor and the tall grass with wildflowers use José's chosen options (all in `docs/art/STYLE.md`; code `source/src/20_zzstyle.js`, switches `window.__setX(n)` in the test page, 0 = old drawing). Houses use the 8 new colour schemes.
- [x] **Shadows and ground patch follow the building shape**: done in Beta 0.16.1 (`20_zzzshade.js`).
- [ ] Tidy the art code: fold `20_zzstyle.js` into the old drawing files and remove the unused options and old drawings (smaller file, faster load); phone check.
To decide:
- [ ] **Building grime** (contact shadow, damp walls, moss on footings, rain streaks): later. First show José the options that exist (José, 2026-11-12).
- The building redesign plan (style rules, parts kit, groups of 5–6) is **not needed for now**: the building art was already updated in 0.16.0 (José, 2026-11-12).
Later art:
- [ ] Water depth near shores.
- [ ] Ships, palisade and walls: warm rim light at dusk, torches on gates and towers at night.
- [ ] Night and winter tuning after José plays (how dark, how often, how long); maybe a setting to turn the cycle off.
- [ ] Fjord map polish after play: island placement, fjord width, forests, where raiders land.

### Village raids tuning (after José meets a few raids)
- [ ] **O3, E4**: raiders 6+2/yr (max 24) → 8+3 (max 30); teach the bot to wall the Town Hall at TH5; then raid frequency, size and loot.

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
