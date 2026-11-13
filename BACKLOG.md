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
- B. Open economy and balance — no limit on ordinary buildings (+30% per copy), source yield by collector level, population by mood + hall's reach, silver sinks, `steady` bot (Beta 0.22.0; table in `tools/balance/round_b.md`).

## 1. Core redesign (decided with José, 2026-11-11)
Goal: fewer systems, each one counts more; decisions matter, but the player stays free to build his own way and can always progress (maybe more slowly). City building and resources first; the lineage matters later, when resources are less of a worry.
Order: Round 1 (done, 0.14.0) → 1C (done, 0.15.0) → 1D + 1E (done, 0.19.0) → Round B (done, 0.22.0) → **1H** → 1I → 1F → 1G → 1K (1J done, 0.20.0) (1K's place not decided yet — ask José). Balance fixes 1 items E1 (Smokehouse) and A2 (Bakery) are replaced by Round 1; re-check the rest after it.

## This round
- (none — pick the next round with José)

## Bugs and small fixes
- (none)

## Next rounds (in this order)

### Play feedback for 0.22.0
- [ ] José plays: building many copies (is +30% per copy right?), upgraded collectors lasting the winter, the village mood and the hall's reach (30/45/70/100/130 — too tight or too loose?), new Town Hall 4–5 costs, silver from level-4 upgrades.
- [ ] **Silver and food after TH5** pile up (5,000–14,000 silver by day 900 in the bots): needs TH6+ sinks, or the merchant purse from the audit (O1: 100/150/200 per merchant ship).
- [ ] Bot: the Trading House sometimes cannot be placed (shore guard) and the run waits 95–260 days at TH3 — bot placement only.
- [ ] Iron at the end of TH1 is still 140–220 in the bots when the mine is fully staffed (spent at TH2–TH3); check in play whether it still feels like too much.

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
