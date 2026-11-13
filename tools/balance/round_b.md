# Round B (Beta 0.22.0): before / after

Bots, 900 game days each. "Before" = Beta 0.21.0 numbers from the audit and the backlog (no `steady` profile existed).
Run: `timeout 3000 python3 bots/multi4.py 900 '<profiles>' | grep -v agent-proxy | python3 bots/summary.py` (from `tools/`).

| Profile | Before (0.21.0): TH5 day | After: TH4 day | After: TH5 day | Final pop | Morale / attr. avg | Food-short days | Winter days at 0 wood |
|---|---|---|---|---|---|---|---|
| steady ×4 | – | 214–438 | 263–488 | 170–185 | 63–66 / 60–66 | 0 | 0 |
| planner ×2 | 434–587 | 213–437 | 295–528 | 165–167 | 66–68 / 45–47 | 0 | 0 |
| warlord ×2 | – | 213–306 | 348–535 | 157–162 | 57–60 / 46–47 | 0 | 0–1 |
| challenge | – | 178 | 294 | 156 | 66 / 50 | 0 | 0 |
| lazy | stuck before | 171 | 701 | 143 | 58 / 49 | 13 | 0 |

Goal check (José): a player who upgrades and keeps morale and attractiveness ≥ 60 reaches TH5 without problems → `steady` reaches TH5 in every run, no hunger, no cold. `lazy` still progresses (slowly).

Tuning steps on the way (each measured):
1. Open limits + source yield by level: the first `steady` bot overbuilt collectors and starved itself of workers → extra copies only with free hands and free sources.
2. Mood-driven growth alone let villages reach 200–300 people (TH5 by day ~245, wood collapse) → **hall's reach** 30/45/70/100/130 with a crowding penalty.
3. Iron 40 → 24 → 30 → 40 a year per outcrop: lower values stalled every non-upgrading profile at TH3; José's early iron pile is now spent by TH2 40 / TH3 80 iron.
4. TH4/TH5 costs raised (pacing), then iron 160→140→110 and 260→220→190 so planner/warlord do not stall; TH5 silver 400 → 350 (wait ≤ ~60–100 days).

Still to watch:
- Silver and food pile up **after** TH5 (5,000–14,000 silver by day 900): nothing to spend on until TH6+ content.
- Some slow runs wait 95–260 days at TH3: the bot fails to place the Trading House (bot placement, not the game).
- Planner/warlord attractiveness stays ~45 (they build no decor); their growth is slower, as intended.
- Iron at the end of TH1 is still 140–220 when the bot staffs the mine fully; it is spent at TH2–TH3.
