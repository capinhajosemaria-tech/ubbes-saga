# Ubbe's Saga - balance audit data (Beta 0.12.0)
Raw measurements for the "Balance audit (Fable)" round, step 1. Data only: no recommendations (a short factual "Observations" list is at the end). Collected 2026-11-11 by the balance agent. Units: days of 24 h game time; 1 game year = 45 days (30 summer + 15 winter); food in meal units (fresh fish/berries/meat/veg = 1, bread 1.5, dried fish/jam/smoked/pickles 2, sausage 3); money in silver; BASEP = base trade value from the game.

## 1. How this was measured
- Build: `python3 source/build.py` then `python3 tools/build_test.py` (test.html). Everything below ran from `tools/`.
- **Bots:** `bots/bot4.js` unchanged, 900 days, 12 runs for each of the 4 profiles in `bots/profiles.json` (planner `{"planner":1}`, warlord `{"planner":1,"bold":1,"adv":"bjorn"}`, challenge `{"planner":1,"mode":"challenge","adv":"lagertha"}`, lazy `{"planner":1,"lazy":1,"adv":"egil"}`) = 48 runs. `runall.sh` was not used because it prints only a summary; a throwaway runner (`tmp_run.py`, deleted afterwards) injected hooks into the bot text and into a copy of the test page: per-day flows (stock changes, eating, firewood, production by building from the game's own `prodLog`, shortage flags, storage-cap days), every `pay()` call by Town Hall level, every `removePerson` (cause, age, shortage flag), every bot market trade (price, quantity), build costs and days, and village-raid reports (walls, towers, warriors). The game code was not touched.
- Bots are random (map, events, raids): ranges are min-max over the runs listed. The bot only plays "planner style"; it never builds a palisade, builds 1 watchtower, no gates, no Hof/Tailor/Beehive staffing (see section 9).
- Tools run as asked: `balance/jobs.py` (section 10), `balance/bal.py` (static estimate, needs `balance/dump.py`; its `defs.json` was deleted), `balance/raidmc.py` (section 11).
- **Tools that failed / not usable as described:** `balance/prof.py` is a *render* profiler (needs a zoom argument, prints canvas function percentages), not production per year; production per year (section 12) comes from the bot hook on `addRes` instead. Silver income from events, peddlers, prisoners and offerings is not separated (only trade, raid reports and net change are). Deaths in "battle" mix sea raids and village raids (the game uses one cause). Per-building payback ignores inputs. Tools consumed is only visible as net stock change (1 tool per 60 worker-days is in the game code).
- **Important caveat for TH4/TH5 ranges:** in 22 of 48 runs the bot never left Town Hall 3 because it could not place a Shipyard (`shipyard:bot` fail counter 450-1370, see section 5). Those runs are bot-side stalls, not resource stalls; ranges for TH4/TH5 are over the runs that got there (count in brackets). Reached TH5: planner 7/12, warlord 3/12, challenge 5/12, lazy 6/12.

## 2. Bot runs, 900 days (= 20 game years of 45 days), per run
Columns: TH2..TH5 = day reached; pop = population at end of year 3/6/9/12/15/18/20; b/d/a/l = births/deaths(as counted by game)/arrivals/left over 900 days; raids = outgoing raids launched (ok) + launch attempts refused by provisions rule; vr = village raids received (won/total); mor = avg/min morale.
```
run   TH2  TH3  TH4  TH5 | pop y3 y6 y9 y12 y15 y18 y20 | b   d   a   l | raids ok/refused vr  ships | mor    fail/err
plan0      57  143  317  496 |  68  85 121 129 123 151 165 |  77  13 106  21 |  30/213  5/5  4 | 67/35  
plan1      60  145  318  475 |  56  81 114 117 119 132 152 |  71  13  95  17 |  31/221  5/6  4 | 67/27  
plan2      61  148    -    - |  63  75 136 133 119 116 119 |  64   3  92  50 |   0/0    0/0  0 | 62/29 fail:{"shipyard:bot": 1304} 
plan3      61  148  332  555 |  54  78 105 111 117 132 147 |  62  25 108  14 |  36/164  4/4  4 | 68/37  
plan4      56  143    -    - |  58  81 139 127 131 112 120 |  72   6 106  68 |   0/0    0/0  0 | 64/27 fail:{"shipyard:bot": 1374} 
plan5      58  145  330  519 |  62  77 115 122 128 145 158 |  72  21 116  25 |  36/196  5/5  4 | 68/34  
plan6      60  155  344  543 |  61  74 114 122 124 150 162 |  73  11 116  32 |  38/196  5/5  4 | 68/33  
plan7      62  147  323  519 |  59  81 117 118 124 142 158 |  79  18 104  23 |  32/203  4/5  4 | 68/32  
plan8      58  145    -    - |  62  95 130 124 118 115 120 |  71   7 105  65 |   0/0    0/0  0 | 62/30 fail:{"shipyard:bot": 1396} 
plan9      61  153    -    - |  69  78 134 129 129 121 120 |  65   5  98  54 |   0/0    0/0  0 | 61/30 fail:{"shipyard:bot": 1340} 
plan10     61  155  382    - |  55  66 103 130 167 170 157 |  81  18 102  24 |  34/180  0/0  3 | 66/32 fail:{"tomb:bot": 436} 
plan11     58  147  331  524 |  66  86 113 111 102  89  82 |  59  14  66  45 |  28/257  5/5  4 | 63/30  
warl0      62  150    -    - |  64  70 131 130 123 122 118 |  64   2  93  53 |   0/0    0/0  0 | 57/24 fail:{"shipyard:bot": 1273} 
warl1      61  150  332  615 |  51  68  97 109  95  87  82 |  49  16  75  42 |  29/247  3/3  3 | 57/23  
warl2      60  147    -    - |  63  82 131 131 127 116 122 |  71   2  98  61 |   0/0    0/0  0 | 56/21 fail:{"shipyard:bot": 1338} 
warl3      62  146    -    - |  53  74 128 114 131 125 118 |  68   6 105  65 |   0/0    0/0  0 | 56/21 fail:{"shipyard:bot": 1320} 
warl4      54  140  562  669 |  54  85 132 123 147 162 164 |  75  19 127  35 |  17/127  2/3  4 | 60/21 fail:{"shipyard:bot": 578} 
warl5      59  146    -    - |  61  85 137 111 127 112 113 |  63   4 105  67 |   0/0    0/0  0 | 57/21 fail:{"shipyard:bot": 1368} 
warl6      60  147  320  500 |  62  88 114 122 148 156 151 |  63  28 125  25 |  30/169  5/5  4 | 61/24  
warl7      55  146    -    - |  56  82 140 128 128 110 124 |  70  10 105  57 |   0/0    0/0  0 | 57/21 fail:{"shipyard:bot": 1352} 
warl8      61  137    -    - |  58  85 139 118 117 116 122 |  71   4 112  73 |   0/0    0/0  0 | 57/18 fail:{"shipyard:bot": 1352} 
warl9      62  151    -    - |  58  85 135 130 119 121 108 |  70   6  86  58 |   0/0    0/0  0 | 56/23 fail:{"shipyard:bot": 1394} 
warl10     59  149  341    - |  57  75  99 132 163 150 157 |  67  18 122  30 |  33/185  0/0  3 | 60/24 fail:{"tomb:bot": 482} 
warl11     62  152    -    - |  59  84 130 125 113 116 118 |  68   1 100  65 |   0/0    0/0  0 | 57/21 fail:{"shipyard:bot": 1360} 
chal0      60  147    -    - |  66  89 139 132 133 120 114 |  64  53  87   0 |   0/0    0/0  0 | 59/24 fail:{"shipyard:bot": 1320} 
chal1      61  150    -    - |  61  86 136 117 127 111 100 |  65  68  87   0 |   0/0    0/0  0 | 59/22 fail:{"shipyard:bot": 1358} 
chal2      62  150    -    - |  61  91 138 122 120 106 100 |  49  57  92   0 |   0/0    0/0  0 | 60/25 fail:{"shipyard:bot": 1384} 
chal3      60  151  342    - |  56  75 108 139 154 152 143 |  61  56 124   2 |  34/214  0/0  3 | 64/24 fail:{"hunter:bot": 521, "tomb:bot": 486} 
chal4      61  154    -    - |  63  79 130 126 124 116 102 |  59  68  95   0 |   0/0    0/0  0 | 60/24 fail:{"shipyard:bot": 1306} 
chal5      59  148  329  520 |  53  69  92 115 105 122 139 |  64  34 115  22 |  40/159  5/6  4 | 67/29  
chal6      60  149  345  548 |  55  75 113 121 133 155 152 |  70  51 117   0 |  39/182  6/6  4 | 67/31  
chal7      59  137  329  506 |  55  72 113 128 141 156 159 |  79  46 117   7 |  33/204  6/7  4 | 67/31  
chal8      61  147  316  507 |  56  78 119 126 133 150 146 |  66  52 117   1 |  40/212  6/6  4 | 66/26  
chal9      58  137  567  733 |  52  76 135 134 153 164 161 |  79  50 116   0 |  10/163  2/2  4 | 68/29 fail:{"shipyard:bot": 562} 
chal10     61  148    -    - |  54  82 134 114 118 106  95 |  55  68  92   0 |   0/0    0/0  0 | 61/24 fail:{"shipyard:bot": 1358} 
chal11     61  147    -    - |  54  78 130 117 117 104  98 |  57  62  87   0 |   0/0    0/0  0 | 59/20 fail:{"shipyard:bot": 1368} 
lazy0      62  148    -    - |  61  85 132 125 121 111 115 |  73   4  92  62 |   0/0    0/0  0 | 56/24 fail:{"shipyard:bot": 458} 
lazy1      64  151  340    - |  56  77 107 141 156 152 161 |  73  27 138  39 |  42/167  0/0  3 | 60/27 fail:{"hunter:bot": 178, "tomb:bot": 164} 
lazy2      63  151  298  468 |  54  80 108 110 104 117 146 |  68  14 102  26 |  28/248  5/5  4 | 60/24  
lazy3      64  150  316  498 |  58  83 108 119 108 123 146 |  65  18 115  32 |  35/192  5/5  4 | 62/27  
lazy4      56  155    -    - |  57  79 129 129 124 115 121 |  64   5 108  62 |   0/0    0/0  0 | 56/21 fail:{"shipyard:bot": 456} 
lazy5      63  148  318  522 |  56  73 107 124 140 157 162 |  65  16 114  17 |  45/140  4/5  4 | 62/30  
lazy6      62  151    -    - |  57  77 126 123 113 102 113 |  58   5 104  60 |   0/0    0/0  0 | 56/24 fail:{"shipyard:bot": 456} 
lazy7      63  148  330  523 |  60  79 111 110 108 110 133 |  69  19 100  33 |  42/171  3/5  4 | 60/28  
lazy8      64  148  351  543 |  59  71 103 118 133 148 154 |  57  19 114  14 |  38/157  3/4  4 | 63/32  
lazy9      58  142  324  479 |  57  84 120 133 129 152 160 |  81  13  99  23 |  36/189  5/6  4 | 63/30  
lazy10     65  148    -    - |  53  77 135 129 118 112 126 |  63   8 111  56 |   0/0    0/0  0 | 57/22 fail:{"shipyard:bot": 452} 
lazy11     63  147  316    - |  58  81 119 156 157 149 159 |  76  16 120  37 |  42/191  0/0  3 | 60/25 fail:{"hunter:bot": 190, "tomb:bot": 176} 
```

### 2b. Ranges per profile (12 runs each; TH4/TH5 ranges only over the runs that got there, count in brackets)
| profile | opts | TH2 | TH3 | TH4 | TH5 | final pop | peak pop | births | deaths | left | arrivals | raids ok | refused | village raids | ships | morale avg | morale min |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| planner | `{"planner": 1}` | 56-62 | 143-155 | 317-382 (8/12 runs) | 475-555 (7/12 runs) | 82-165 | 123-174 | 59-81 | 3-25 | 14-68 | 66-116 | 0-38 | 0-257 | 0-6 | 0-4 | 61-68 | 27-37 |
| warlord | `{"planner": 1, "bold": 1, "adv": "bjorn"}` | 54-62 | 137-152 | 320-562 (4/12 runs) | 500-669 (3/12 runs) | 82-164 | 110-166 | 49-75 | 1-28 | 25-73 | 75-127 | 0-33 | 0-247 | 0-5 | 0-4 | 56-61 | 18-24 |
| challenge | `{"planner": 1, "mode": "challenge", "adv": "lagertha"}` | 58-62 | 137-154 | 316-567 (6/12 runs) | 506-733 (5/12 runs) | 95-161 | 130-166 | 49-79 | 34-68 | 0-22 | 87-124 | 0-40 | 0-214 | 0-7 | 0-4 | 59-68 | 20-31 |
| lazy | `{"planner": 1, "lazy": 1, "adv": "egil"}` | 56-65 | 142-155 | 298-351 (8/12 runs) | 468-543 (6/12 runs) | 113-162 | 126-162 | 57-81 | 4-27 | 14-62 | 92-138 | 0-45 | 0-248 | 0-6 | 0-4 | 56-63 | 21-32 |

Population by year (min-max over 12 runs; median in brackets). Housing at end and warriors at end shown last.
| profile | y2 | y3 | y5 | y7 | y9 | y12 | y15 | y18 | y20 | housing end | war end | workforce end* |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| planner | 40-51 [44] | 54-69 [62] | 63-77 [68] | 73-113 [93] | 103-139 [116] | 111-133 [123] | 102-167 [124] | 89-170 [132] | 82-165 [150] | 131-182 | 12-30 | 20-75 |
| warlord | 39-45 [42] | 51-64 [58] | 60-76 [66] | 78-107 [100] | 97-140 [131] | 109-132 [124] | 95-163 [127] | 87-162 [118] | 82-164 [120] | 119-173 | 11-30 | 17-89 |
| challenge | 37-46 [42] | 52-66 [56] | 59-72 [64] | 82-106 [95] | 92-139 [130] | 114-139 [124] | 105-154 [130] | 104-164 [121] | 95-161 [126] | 137-174 | 10-30 | 68-106 |
| lazy | 39-44 [41] | 53-61 [57] | 62-70 [66] | 80-105 [96] | 103-135 [115] | 110-156 [124] | 104-157 [122] | 102-157 [120] | 113-162 [146] | 132-170 | 12-30 | 50-81 |
*day 900 is the first day of a year (winter-end snapshot); workforce excludes warriors, children, elders, sick.

## 3. Deaths and people who left, with causes (900 days)
Counts per run, min-max (mean). "left:food/firewood/water" = family left because of a shortage (game removes a person or couple); "left:other/merc" = mercenary contract ended (or no shortage recorded). Hunger deaths only exist in Challenge. Causes are recorded by a tmp hook on removePerson (cause, age, Town Hall, current shortage).
| profile | runs | age | sickness | battle | hunger | duel | left:food | left:firewood | left:water | left:other/merc | total deaths | total left | births | arrivals |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| planner | 12 | 1-4 (1.8) | 0-4 (2.2) | 0-18 (7.8) | 0 (0.0) | 0-2 (1.2) | 10-68 (33.9) | 0-9 (2.6) | 0 (0.0) | 0 (0.0) | 3-25 | 14-68 | 59-81 | 66-116 |
| warlord | 12 | 0-4 (1.8) | 0-2 (1.0) | 0-22 (5.3) | 0 (0.0) | 0-4 (1.6) | 21-73 (51.0) | 0-9 (1.6) | 0 (0.0) | 0 (0.0) | 1-28 | 25-73 | 49-75 | 75-127 |
| challenge | 12 | 0-4 (1.3) | 4-11 (7.8) | 0-21 (7.0) | 10-58 (38.0) | 0-3 (1.2) | 0 (0.0) | 0-22 (2.7) | 0 (0.0) | 0 (0.0) | 34-68 | 0-22 | 49-79 | 87-124 |
| lazy | 12 | 0-3 (1.5) | 0-3 (1.6) | 0-24 (9.3) | 0 (0.0) | 0-3 (1.2) | 12-62 (35.3) | 0-14 (3.1) | 0 (0.0) | 0 (0.0) | 4-27 | 14-62 | 57-81 | 92-138 |

Deaths + leavers by Town Hall level at the time, per-run mean, ONLY runs that reached TH5 (stuck-at-TH3 runs would pile their winters into TH3) and mean age at death:
| profile | TH1 | TH2 | TH3 | TH4 | TH5 | mean age at death (age/sickness) | deaths of warriors in battle: mean |
|---|---|---|---|---|---|---|---|
| planner (7 runs) | 0.0 | 0.1 | 3.7 | 9.6 | 28.3 | 50.8 | 11.7 |
| warlord (3 runs) | 0.7 | 0.0 | 13.3 | 13.0 | 28.0 | 53.0 | 16.7 |
| challenge (5 runs) | 0.2 | 0.0 | 7.8 | 14.0 | 30.6 | 50.0 | 14.4 |
| lazy (6 runs) | 0.0 | 0.2 | 5.2 | 10.3 | 25.0 | 51.7 | 12.8 |

Population-loss events from shortages ("LOST pop" events, any cause) and shortage days (days with food/firewood shortage flag), per run range:
| profile | LOST events | of which food | firewood | water | shortage days: food (summer/winter) | firewood (winter) |
|---|---|---|---|---|---|---|
| planner | 12-52 | 8-52 | 0-6 | 0 | 0 / 19-96 | 0-13 |
| warlord | 23-54 | 20-54 | 0-9 | 0 | 0-5 / 37-98 | 0-16 |
| challenge | 18-58 | 10-58 | 0-20 | 0 | 0-2 / 25-128 | 0-33 |
| lazy | 13-51 | 11-51 | 0-14 | 0 | 0 / 21-97 | 0-22 |

## 4. Raids
Outgoing (bot launches only when ratio>=1.5, bold profile >=1.1, TH3+, target without walls). Report titles from the raid report modal. Dead = crew lost (from report). "refused" = launch attempts blocked by the provisions rule (message "village must keep N meals at home for winter").
| profile | raids ok | refused | victories | tribute | other titles | crew dead (sum) | first raid day | silver-equivalent: raid-report silver (sum) |
|---|---|---|---|---|---|---|---|---|
| planner | 0-38 | 0-257 | 0-8 | 0-32 | 0 | 0-18 | 246-318 (8/12 runs) | 0-2516 |
| warlord | 0-33 | 0-247 | 0-8 | 0-26 | 0-2 | 0-22 | 254-551 (4/12 runs) | 0-2699 |
| challenge | 0-40 | 0-214 | 0-8 | 0-35 | 0 | 0-16 | 244-556 (6/12 runs) | 0-2730 |
| lazy | 0-45 | 0-248 | 0-8 | 0-38 | 0 | 0-24 | 271-286 (8/12 runs) | 0-2814 |
Report titles over all runs: Tribute 703, Victory 171, Defeat 4

Village raids received (TH5+, summer, every ~40-75 days; the bot never builds a palisade, only 1 watchtower, no gates: "walls 0" in every log line):
| profile | received per run | won | lost (plundered) | warriors at home during raid | walls | towers | text of lost raids |
|---|---|---|---|---|---|---|---|
| planner | 0-6 | 33 | 2 | 18-30 | 0 | 0-1 | The raiders of Sigvard of Jutland carried off what they could.; The raiders of the sons of Thorir carried off what they could. |
| warlord | 0-5 | 10 | 1 | 18-30 | 0 | 0-1 | The raiders of Hrolf the Grey carried off what they could. |
| challenge | 0-7 | 25 | 2 | 24-30 | 0 | 1 | The raiders of Kolbein Haraldsson carried off what they could.; The raiders of the sons of Thorir carried off what they could. |
| lazy | 0-6 | 25 | 5 | 14-30 | 0 | 0-1 | The raiders of Sigvard of Jutland carried off what they could.; The raiders of Kolbein Haraldsson carried off what they could. |

## 5. Town Hall progression: time per level and what was missing
Time spent at each level (days from reaching level L to reaching L+1). Runs that never got to L+1 within 900 days are counted in "runs stuck" and EXCLUDED from the blocker shares (their 14+ repeated samples would swamp them). Blockers come from the bot logging the Town Hall requirement list every 50 days: share = fraction of the 50-day samples taken while at level L in which the item was missing (all runs pooled). "mat" columns = share of samples where that stock was below the next level cost.
Costs: TH2 90w/60p/16i; TH3 150w/120p/42i/8t; TH4 260w/220p/80i/15t/100s; TH5 380w/320p/140i/25t/250s/20 gold. Other reqs: pop 22/32/48/80, fame earned 150/450/950/1700 (note: "earned" fame, not stock).

**planner** (12 runs)
| at level | days at level (reached->next), range [median] | runs stuck | persistent blockers (share of samples) | last blocker before upgrade (runs) | short mats (share) |
|---|---|---|---|---|---|
| TH1 -> TH2 | 56-62 [60] | 0/12 | materials 100%, Saga goal: Ready for winter 50%, Granary 50%, pop 50%, fame 50% | materials 12 | planks 100%, wood 50%, iron 50% |
| TH2 -> TH3 | 85-95 [87] | 0/12 | materials 100%, Saga goal: Pigs and sheep 80%, Saga goal: Salt and smoke 80%, Saga goal: The first warriors 73% | materials 12, Saga goal: Pigs and sheep 9, Saga goal: Salt and smoke 9, Saga goal: The first warriors 8 | planks 100%, wood 80% |
| TH3 -> TH4 | 173-227 [184] | 4/12 | materials 100%, Saga goal: The first raid 74%, Saga goal: The first ship 71%, fame 35%, Warehouse at level 3 29% | materials 8 | wood 100%, planks 100%, iron 32%, silver 26%, tools 19% |
| TH4 -> TH5 | 157-223 [193] | 1/12 | materials 100%, Saga goal: A tomb for Ragnar 48%, Saga goal: The swift serpent 44%, Saga goal: True vikings 30% | materials 7 | planks 96%, wood 89%, iron 56%, tools 15%, gold 11% |

**warlord** (12 runs)
| at level | days at level (reached->next), range [median] | runs stuck | persistent blockers (share of samples) | last blocker before upgrade (runs) | short mats (share) |
|---|---|---|---|---|---|
| TH1 -> TH2 | 54-62 [60] | 0/12 | materials 100%, Saga goal: Ready for winter 50%, Granary 50%, pop 50%, fame 50% | materials 12 | planks 100%, wood 50%, iron 50% |
| TH2 -> TH3 | 76-91 [88] | 0/12 | materials 93%, Saga goal: Pigs and sheep 86%, Saga goal: Salt and smoke 79%, Saga goal: The first warriors 71% | materials 11, Saga goal: Pigs and sheep 10, Saga goal: Salt and smoke 9, Saga goal: The first warriors 8 | planks 93%, wood 86% |
| TH3 -> TH4 | 173-422 [187] | 8/12 | materials 95%, Saga goal: The first raid 86%, Saga goal: The first ship 81%, fame 38% | materials 3, Saga goal: The first raid 1 | planks 86%, wood 81%, iron 43%, silver 24%, tools 19% |
| TH4 -> TH5 | 107-283 [180] | 1/12 | materials 100%, Saga goal: A tomb for Ragnar 45%, Saga goal: The Northern Isles 36%, Saga goal: The swift serpent 36%, Saga goal: True vikings 27% | materials 3 | planks 100%, wood 91%, iron 45%, tools 18% |

**challenge** (12 runs)
| at level | days at level (reached->next), range [median] | runs stuck | persistent blockers (share of samples) | last blocker before upgrade (runs) | short mats (share) |
|---|---|---|---|---|---|
| TH1 -> TH2 | 58-62 [60] | 0/12 | materials 100%, Saga goal: Ready for winter 50%, Granary 50%, pop 50%, fame 50% | materials 12 | planks 100%, wood 50%, iron 50% |
| TH2 -> TH3 | 78-93 [88] | 0/12 | materials 93%, Saga goal: Pigs and sheep 86%, Saga goal: Salt and smoke 79%, Saga goal: The first warriors 71% | materials 11, Saga goal: Pigs and sheep 10, Saga goal: Salt and smoke 9, Saga goal: The first warriors 8 | planks 93%, wood 86% |
| TH3 -> TH4 | 169-430 [192] | 6/12 | materials 100%, Saga goal: The first raid 79%, Saga goal: The first ship 71%, fame 39% | materials 6, Saga goal: The first raid 1 | planks 89%, wood 86%, iron 46%, silver 29%, tools 11% |
| TH4 -> TH5 | 166-203 [191] | 1/12 | materials 100%, Saga goal: A tomb for Ragnar 58%, Saga goal: The swift serpent 42%, Saga goal: True vikings 32% | materials 5 | planks 100%, wood 95%, iron 58%, tools 16%, gold 5% |

**lazy** (12 runs)
| at level | days at level (reached->next), range [median] | runs stuck | persistent blockers (share of samples) | last blocker before upgrade (runs) | short mats (share) |
|---|---|---|---|---|---|
| TH1 -> TH2 | 56-65 [63] | 0/12 | materials 100%, Saga goal: Ready for winter 50%, Granary 50%, pop 50%, fame 50% | materials 12 | planks 100%, wood 50%, iron 50% |
| TH2 -> TH3 | 83-99 [86] | 0/12 | materials 81%, Saga goal: Pigs and sheep 75%, Saga goal: The first warriors 75%, Saga goal: Salt and smoke 75% | materials 9, Saga goal: Pigs and sheep 8, Saga goal: The first warriors 8, Saga goal: Salt and smoke 8 | planks 81%, wood 75% |
| TH3 -> TH4 | 147-203 [176] | 4/12 | materials 97%, Saga goal: The first raid 73%, Saga goal: The first ship 73%, Warehouse at level 3 37%, Granary at level 3 27% | materials 7, Saga goal: The first raid 1, Saga goal: The first ship 1,  1 | wood 97%, planks 90%, silver 33%, iron 30%, tools 20% |
| TH4 -> TH5 | 155-204 [187] | 2/12 | materials 100%, Saga goal: A tomb for Ragnar 57%, Saga goal: The swift serpent 48%, Saga goal: The Northern Isles 33%, Saga goal: True vikings 33% | materials 6 | planks 100%, wood 90%, iron 57%, tools 19%, gold 5% |

Bot-side failure that dominates TH3->TH4 stalls: `fail` counters in runs that never left TH3 show `shipyard:bot` 450-1370 times: the bot could not place a Shipyard (planSpot gives candidates, connectRoad fails for all; the oracle says a legal tile exists, so this is a bot/road-placement limit, not a missing-resource stall). Runs with this failure: planner 4/12, warlord 9/12, challenge 7/12, lazy 4/12.
Missing at day 900 for runs that did not reach TH5 (all profiles): TH3: Saga goal: The first ship + Saga goal: The first raid + Materials (21 runs); TH4: Saga goal: A tomb for Ragnar + Materials (5 runs); TH3: Saga goal: The first ship + Saga goal: The first raid (1 runs)

## 6. Economy flows per Town Hall level and season (tmp hook on dayTick; per game DAY, mean over runs of the profile)
Season = S (summer, 30 days/yr) or W (winter, 15 days/yr). pop = average population; eat = food units eaten per day (eatNeed, meal-weighted: bread 1.5, dried fish/jam/smoked/pickles 2, sausage 3); dFood = change in food stock units per day (includes 3%/day spoilage of fresh food and raid provisioning); fire = firewood needed per day (winter only, x1.3 in hard winters); dWood = change in wood stock/day (production minus carpenter/salt/bakery/smith/brewery use minus building and firewood); short = share of days with a food (f) or firewood (w) shortage flag; silver net/day = change of silver stock per day (all income minus all spending, from daily log); cap% = share of days food/material storage was within 1 of cap. Production is items/day by source building. Only runs that spent >=5 days in the bucket.

**planner**
| TH/season | runs | days/run | pop | eat/day | dFood/day | food prod/day (items) | fire/day | wood prod/day | dWood/day | dPlanks/day | dIron/day | dTools/day | silver net/day | short f/w | cap% food/mat |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1S | 12 | 44 | 24 | 11 | +6.5 | 22.9 | - | 12.8 | +7.0 | +2.7 | +1.6 | +0.09 | +0.0 | 0%/0% | 0%/0% |
| 1W | 12 | 15 | 27 | 12 | -5.2 | 7.3 | 8.9 | 19.0 | +6.2 | +2.1 | +1.5 | +0.21 | +0.0 | 0%/0% | 0%/0% |
| 2S | 12 | 57 | 49 | 22 | +12.5 | 41.7 | - | 23.3 | +11.3 | +5.0 | +0.9 | -0.03 | +0.0 | 0%/0% | 0%/0% |
| 2W | 12 | 30 | 51 | 23 | -16.5 | 7.9 | 16.5 | 24.5 | +0.8 | +3.6 | +1.1 | -0.01 | +0.1 | 0%/1% | 0%/0% |
| 3S | 12 | 127 | 87 | 38 | +14.6 | 56.8 | - | 15.0 | +5.9 | +2.7 | +0.7 | +0.04 | +15.4 | 0%/0% | 0%/19% |
| 3W | 12 | 60 | 89 | 40 | -17.3 | 17.5 | 21.8 | 31.7 | +3.3 | +3.0 | +0.8 | +0.01 | +0.1 | 11%/0% | 0%/1% |
| 4S | 8 | 131 | 118 | 43 | +29.6 | 77.3 | - | 22.6 | +8.7 | +4.4 | +1.3 | +0.08 | +38.3 | 0%/0% | 0%/19% |
| 4W | 8 | 60 | 118 | 51 | -23.1 | 24.8 | 28.3 | 35.3 | +1.0 | +2.7 | +1.0 | +0.09 | +3.8 | 5%/0% | 0%/0% |
| 5S | 7 | 247 | 127 | 52 | +23.8 | 81.0 | - | 19.8 | +11.9 | +1.9 | +0.3 | -0.01 | +26.1 | 0%/0% | 0%/14% |
| 5W | 7 | 135 | 130 | 59 | -27.3 | 23.8 | 31.6 | 37.1 | +3.1 | +1.7 | +0.9 | +0.05 | +0.2 | 29%/5% | 0%/0% |

**warlord**
| TH/season | runs | days/run | pop | eat/day | dFood/day | food prod/day (items) | fire/day | wood prod/day | dWood/day | dPlanks/day | dIron/day | dTools/day | silver net/day | short f/w | cap% food/mat |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1W | 12 | 15 | 26 | 12 | -4.9 | 7.0 | 8.5 | 18.0 | +5.3 | +2.3 | +1.5 | +0.16 | +0.0 | 0%/0% | 0%/0% |
| 2W | 12 | 30 | 48 | 22 | -15.4 | 8.1 | 15.3 | 24.1 | +2.0 | +3.3 | +0.7 | -0.03 | +0.0 | 0%/0% | 0%/0% |
| 3W | 12 | 255 | 103 | 45 | -19.1 | 17.4 | 21.4 | 26.9 | +1.2 | +2.0 | +0.7 | -0.02 | -0.0 | 25%/0% | 0%/0% |
| 4W | 4 | 75 | 122 | 52 | -22.1 | 26.8 | 27.5 | 34.5 | -1.1 | +3.7 | +0.6 | +0.18 | +3.7 | 9%/2% | 0%/0% |
| 5S | 3 | 181 | 132 | 55 | +18.3 | 78.6 | - | 18.7 | +10.8 | +2.1 | +0.2 | -0.05 | +25.0 | 1%/0% | 0%/21% |
| 5W | 3 | 105 | 134 | 61 | -22.2 | 23.3 | 30.9 | 33.0 | +0.5 | +1.5 | +1.3 | +0.11 | -1.9 | 49%/5% | 0%/0% |

**challenge**
| TH/season | runs | days/run | pop | eat/day | dFood/day | food prod/day (items) | fire/day | wood prod/day | dWood/day | dPlanks/day | dIron/day | dTools/day | silver net/day | short f/w | cap% food/mat |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1W | 12 | 15 | 27 | 12 | -4.8 | 7.3 | 8.7 | 18.8 | +5.8 | +2.3 | +1.6 | +0.20 | +0.0 | 0%/0% | 0%/0% |
| 2W | 12 | 30 | 48 | 22 | -15.6 | 8.0 | 15.6 | 24.6 | +2.6 | +3.1 | +0.8 | -0.01 | +0.1 | 0%/0% | 0%/0% |
| 3W | 12 | 195 | 94 | 44 | -17.3 | 17.6 | 22.1 | 29.8 | +1.0 | +2.7 | +0.8 | -0.00 | +0.4 | 23%/0% | 0%/0% |
| 4W | 6 | 60 | 121 | 54 | -24.7 | 25.0 | 30.1 | 35.8 | -0.4 | +2.8 | +1.0 | +0.13 | +2.9 | 9%/6% | 0%/0% |
| 5S | 5 | 246 | 139 | 61 | +23.7 | 90.9 | - | 24.6 | +14.4 | +2.7 | +0.6 | +0.01 | +27.3 | 0%/0% | 0%/24% |
| 5W | 5 | 135 | 142 | 67 | -28.5 | 26.4 | 31.0 | 37.0 | +0.7 | +2.3 | +0.7 | +0.01 | -0.0 | 33%/3% | 0%/0% |

**lazy**
| TH/season | runs | days/run | pop | eat/day | dFood/day | food prod/day (items) | fire/day | wood prod/day | dWood/day | dPlanks/day | dIron/day | dTools/day | silver net/day | short f/w | cap% food/mat |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1W | 12 | 15 | 27 | 12 | -5.4 | 7.0 | 8.7 | 18.1 | +6.5 | +1.5 | +2.2 | +0.57 | +0.0 | 0%/0% | 0%/0% |
| 2W | 12 | 30 | 47 | 22 | -14.9 | 7.9 | 14.3 | 24.1 | +2.5 | +3.6 | +0.3 | -0.01 | +0.0 | 0%/0% | 0%/0% |
| 3W | 12 | 60 | 86 | 39 | -17.4 | 16.7 | 20.8 | 31.3 | +4.1 | +2.9 | +0.7 | +0.01 | -0.1 | 12%/0% | 0%/0% |
| 4W | 8 | 60 | 117 | 51 | -21.7 | 24.8 | 28.9 | 33.3 | -1.2 | +2.6 | +0.8 | +0.14 | +1.8 | 8%/2% | 0%/1% |
| 5S | 6 | 256 | 128 | 52 | +24.9 | 82.6 | - | 21.5 | +11.8 | +2.7 | +0.4 | +0.01 | +28.8 | 0%/0% | 0%/12% |
| 5W | 6 | 135 | 131 | 60 | -26.9 | 25.8 | 30.8 | 36.7 | +4.1 | +1.2 | +0.7 | +0.03 | +0.5 | 23%/6% | 0%/0% |

Food stock (meal units) at first and last day of each winter, mean over winters, by Town Hall at that time (all runs reaching TH5; fresh food spoils 3%/day, bread 2%/day). Winter days with a food shortage are in the table above.
| TH | winters | stock at winter start | at winter end (min / mean) |
|---|---|---|---|
| 1 | 21 | 228 | 120 / 147 |
| 2 | 42 | 512 | 168 / 281 |
| 3 | 94 | 541 | 0 / 285 |
| 4 | 86 | 724 | 0 / 393 |
| 5 | 177 | 466 | 31 / 67 |

## 7. Silver: stock, income, spending
Silver stock from the daily log at the day each Town Hall was reached and at year ends; spending = silver paid through pay() (buildings, upgrades, Town Hall, ships, wall) per TH level, mean per run; trade = bot market sales/purchases (silver); raid = silver shown in raid reports (tribute/loot) summed (includes village-raid theft not counted). TH columns: only runs that reached that level; year columns: all runs of the profile.
| profile | runs | silver at TH2 | TH3 | TH4 | TH5 | y5 (d225) | y10 (d450) | y15 (d675) | y20 (d900) | trade sold (total) | trade bought (total) | raid-report silver | paid by pay() (total) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| planner | 12 | 0 | 0-15 | 1421-2675 (8/12 runs) | 6141-7684 (7/12 runs) | 15-492 | 3135-5792 | 6088-10127 | 6413-15058 | 6758-14428 | 0-2123 | 0-2516 | 0-400 |
| warlord | 12 | 0 | 0-15 | 1023-6925 (4/12 runs) | 6609-9131 (3/12 runs) | 15-455 | 3901-5556 | 5806-11369 | 6437-15104 | 6772-14536 | 0-1601 | 0-2699 | 0-400 |
| challenge | 12 | 0 | 0-15 | 1693-6722 (6/12 runs) | 6308-10317 (5/12 runs) | 0-468 | 4546-6081 | 6571-11188 | 7203-15175 | 7639-14774 | 0-2299 | 0-2730 | 0-400 |
| lazy | 12 | 0 | 0-15 | 1134-2282 (8/12 runs) | 4271-7205 (6/12 runs) | 128-404 | 3369-6623 | 5467-12230 | 5753-15972 | 6113-14932 | 0-2490 | 0-2814 | 0-400 |

Silver paid through pay() per Town Hall level (mean over all runs of the profile that spent in that level) -- what the economy actually needs silver for:
| profile | TH1 | TH2 | TH3 | TH4 | TH5 |
|---|---|---|---|---|---|
| planner | 0 | 0 | 67 | 219 | 50 |
| warlord | 0 | 0 | 33 | 188 | 50 |
| challenge | 0 | 0 | 50 | 208 | 50 |
| lazy | 0 | 0 | 67 | 188 | 50 |

Total goods spent through pay() per run by Town Hall level, planner mean (wood / planks / iron / tools / silver / gold; includes the TH upgrade itself, houses, workplaces, upgrades, ships):
| TH | wood | planks | iron | tools | silver | gold |
|---|---|---|---|---|---|---|
| 1 | 433 | 170 | 26 | 0 | 0 | 0 |
| 2 | 708 | 293 | 57 | 8 | 0 | 0 |
| 3 | 1424 | 532 | 93 | 10 | 67 | 0 |
| 4 | 1430 | 720 | 206 | 22 | 219 | 18 |
| 5 | 3211 | 280 | 50 | 0 | 50 | 0 |

## 8. Market: what the bots sold and bought (trading house, bot rules: sell surplus above keep-levels in lots of 10, buy iron/tools/gold only when saving for a Town Hall; gold bought at TH4+ to hold 45)
Totals over runs of each profile (mean per run), avg price = silver per unit actually used; BASEP = game base value; sell price already includes partner wants x1.35, saturation (mktSat falls 7% per lot), Athelstan x1.2 etc.

**Sold** (planner + warlord + challenge + lazy pooled; per run mean units, avg/min/max price, silver per run, share of run silver)
| good | BASEP | units/run | avg price | min | max | silver/run | by TH (silver, TH3/TH4/TH5 share) |
|---|---|---|---|---|---|---|---|
| rope | 5 | 633 | 4.83 | 4.00 | 11.14 | 3060 | 43%/31%/25% |
| hides | 3 | 626 | 4.12 | 2.40 | 6.68 | 2579 | 44%/27%/30% |
| cloth | 6 | 191 | 7.04 | 4.81 | 12.15 | 1347 | 22%/45%/34% |
| smoked | 3 | 351 | 3.73 | 2.40 | 6.08 | 1307 | 63%/23%/14% |
| planks | 2 | 291 | 2.44 | 1.60 | 4.05 | 710 | 60%/11%/28% |
| flax | 1.2 | 605 | 1.04 | 0.96 | 1.32 | 628 | 43%/27%/29% |
| pickles | 2 | 308 | 1.77 | 1.60 | 2.00 | 543 | 64%/32%/4% |
| ale | 2 | 223 | 1.91 | 1.75 | 2.20 | 427 | 0%/49%/51% |
| dfish | 2 | 59 | 2.26 | 1.60 | 4.05 | 134 | 34%/63%/3% |
| misc | 1 | 78 | 1.12 | 0.86 | 2.03 | 87 | 12%/38%/51% |
| wool | 2 | 13 | 2.37 | 1.66 | 4.05 | 32 | 0%/52%/48% |
| salt | 1 | 10 | 1.07 | 0.80 | 2.03 | 11 | 3%/97%/0% |
(total 10864 silver per run on average)

**Bought** (planner + warlord + challenge + lazy pooled; per run mean units, avg/min/max price, silver per run, share of run silver)
| good | BASEP | units/run | avg price | min | max | silver/run | by TH (silver, TH3/TH4/TH5 share) |
|---|---|---|---|---|---|---|---|
| gold | 10 | 50 | 13.54 | 12.32 | 17.40 | 681 | 0%/70%/30% |
| iron | 3 | 13 | 9.12 | 4.99 | 12.48 | 119 | 2%/98%/0% |
| tools | 6 | 0 | 10.13 | 9.98 | 10.49 | 2 | 0%/100%/0% |
(total 802 silver per run on average)

## 9. Per building (all runs that reached TH5 pooled unless stated; planner/warlord/challenge/lazy)
Runs pooled: 21 runs that reached TH5. Workers: worker-days from the bot staffing log over 900 days (seasonal buildings rest in winter). Output = items produced by that building type (prodLog, items actually stored; storage-capped output is not counted). Value = items x BASEP (food items x 0.4 silver, a meal). Cost value = build cost x BASEP (wood 0.4, planks 2, iron 3, tools 6). Payback = cost value / (value per worker-day x slots, level 1 staffing) -- ignores inputs unless noted, so transformers are overstated. No upkeep exists in the game (grep "upkeep" finds nothing); the only running costs are workers, inputs and tools (1 tool per 60 worker-days).
| building | cost value (silver-eq) | slots | built/run (mean; range) | first built day (median) | worker-days/run | output per worker-day (items) | value per worker-day | payback days (full staff) | inputs |
|---|---|---|---|---|---|---|---|---|---|
| Berry Gatherer | 4 | 2 | 2.0 (2) | 0 | 2187 | 2.27 food | 0.91 | 2 |  |
| Fisher’s Hut | 6 | 3 | 2.0 (2) | 0 | 5410 | 3.19 food, 0.01 misc | 1.29 | 2 |  |
| Vegetable Garden | 8 | 2 | 3.0 (3) | 60 | 2937 | 3.33 food | 1.33 | 3 |  |
| Hunter’s Lodge | 30 | 2 | 2.0 (2) | 155 | 2070 | 2.18 food, 0.45 hides, 0.04 misc | 2.27 | 7 |  |
| Animal Pen | 36 | 2 | 1.0 (1) | 70 | 1655 | 1.71 food, 0.41 wool, 0.14 hides | 1.99 | 9 | hay in winter 0.4/animal/day |
| Hay Meadow | 6 | 2 | 3.0 (3) | 59 | 348 | 3.90 hay | 3.90 | 1 |  |
| Grain Field | 8 | 2 | 3.0 (3) | 149 | 910 | 2.96 grain | 2.96 | 1 |  |
| Flax Field | 8 | 2 | 1.0 (1) | 148 | 873 | 3.30 flax | 3.96 | 1 |  |
| Woodcutter’s Lodge | 6 | 3 | 5.0 (5) | 0 | 8210 | 2.71 wood | 1.08 | 2 |  |
| Carpenter | 10 | 2 | 2.0 (2) | 0 | 1901 | 1.52 planks | 3.03 | 2 | 2 wood per plank |
| Iron Mine | 32 | 3 | 2.0 (2) | 17 | 633 | 2.11 iron | 6.33 | 2 | ore tiles in range |
| Smithy | 76 | 2 | 1.0 (1) | 20 | 1069 | 0.43 tools, 0.05 shields, 0.03 axes | 3.56 | 11 | tools: 1 iron+0.5 wood each; anvil 10 iron/100 uses |
| Salt Works | 30 | 2 | 1.0 (1) | 73 | 700 | 2.08 salt | 2.08 | 7 | 1 wood per 2 salt |
| Smokehouse | 38 | 2 | 1.0 (1) | 80 | 523 | 1.25 food | 0.50 | 38 | 2 meat/fish + 0.5 wood (or salt) per 2 meals |
| Preserver | 46 | 2 | 1.0 (1) | 0 | 1126 | 1.48 food | 0.59 | 39 | 2 fish/berries/veg(+salt) -> 1 |
| Bakery | 58 | 2 | 1.0 (1) | 170 | 1090 | 2.24 food | 0.89 | 32 | 2 grain+0.5 wood -> 2 bread |
| Brewery | 87 | 2 | 1.0 (1) | 346 | 219 | 2.13 food | 0.85 | 51 | 2 grain+0.5 wood -> 2 ale; honey->mead |
| Weaver | 58 | 2 | 1.0 (1) | 149 | 1329 | 0.80 rope, 0.32 cloth | 5.91 | 5 | 2 wool or flax -> 1 cloth/rope |
| Shipyard | 174 | 4 | 1.0 (1) | 218 | 674 |  | 0.00 | - |  |
| Market Square | 96 | 1 | 1.0 (1) | 43 | 759 |  | 0.00 | - |  |
| House | 8 | 0 | 23.0 (23) | 6 | 0 | - | 0.00 | - |  |
Houses: cost 20 wood each (8 silver-eq); a house raises housing 4/5/6/7/8 by level; warriors/children/elders do not count as workforce.

Buildings standing at end of run (all runs reaching TH5 pooled, mean count; slots and level mix), and worker-days share:
| building | count at end | mean level | slots total | share of all worker-days |
|---|---|---|---|---|
| Woodcutter’s Lodge | 5.0 | 4.7 | 19.6 | 23.7% |
| Fisher’s Hut | 2.0 | 4.7 | 7.9 | 15.6% |
| Vegetable Garden | 3.0 | 1.0 | 6.0 | 8.5% |
| Berry Gatherer | 2.0 | 1.0 | 4.0 | 6.3% |
| Hunter’s Lodge | 2.0 | 1.0 | 4.0 | 6.0% |
| Carpenter | 2.0 | 4.7 | 5.9 | 5.5% |
| Animal Pen | 1.0 | 1.0 | 2.0 | 4.8% |
| Weaver | 1.0 | 1.0 | 2.0 | 3.8% |
| Preserver | 1.0 | 1.0 | 2.0 | 3.3% |
| Bakery | 1.0 | 1.0 | 2.0 | 3.1% |
| Smithy | 1.0 | 1.0 | 2.0 | 3.1% |
| Grain Field | 3.0 | 1.0 | 6.0 | 2.6% |
| Flax Field | 1.0 | 1.0 | 2.0 | 2.5% |
| Market Square | 1.0 | 1.0 | 1.0 | 2.2% |
| Salt Works | 1.0 | 1.0 | 2.0 | 2.0% |
| Shipyard | 1.0 | 1.0 | 4.0 | 1.9% |
| Iron Mine | 2.0 | 1.0 | 6.0 | 1.8% |
| Smokehouse | 1.0 | 1.0 | 2.0 | 1.5% |
| Hay Meadow | 3.0 | 1.0 | 6.0 | 1.0% |
| Brewery | 1.0 | 1.0 | 2.0 | 0.6% |

## 10. Workers vs jobs (balance rule: 4-8 more workers than jobs at a full village)
From `python3 balance/jobs.py` (buildTestVillage(L): full village with every building at its limit that the test builder could place; warriors and thralls at test values). spare = workforce - job slots. `miss` = buildings the test village could not place (their slots are NOT in "slots", so true spare is smaller by their slots, 2 each).
| TH | housing | pop | workforce | adults 14-59 | job slots | spare | warriors | thralls | kids | missing buildings (not counted) |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 52 | 52 | 37 | 38 | 26 | +11 | 0/0 | 0 | 14 | - |
| 2 | 83 | 83 | 55 | 61 | 43 | +12 | 5/5 | 0 | 22 | - |
| 3 | 140 | 140 | 99 | 104 | 79 | +20 | 12/12 | 8 | 36 | Weaver, Hunter’s Lodge |
| 4 | 183 | 183 | 126 | 137 | 91 | +35 | 20/20 | 10 | 46 | Salt Works, Smokehouse, Bakery, Weaver, Hunter’s Lodge, Brewery |
| 5 | 224 | 224 | 149 | 168 | 114 | +35 | 30/30 | 12 | 56 | Preserver, Salt Works, Smokehouse, Bakery, Weaver |
Static estimate `balance/bal.py` (all buildings at their limits, 0.75 x housing - warriors + thralls):
```
L1 housing   52 workforce~  39 slots   26 warriors   0  spare +13
L2 housing   83 workforce~  57 slots   43 warriors   5  spare +14
L3 housing  140 workforce~ 101 slots   85 warriors  12  spare +16
L4 housing  183 workforce~ 127 slots  112 warriors  20  spare +15
L5 housing  224 workforce~ 150 slots  132 warriors  30  spare +18
```
Real bot villages (daily log, means over runs): workforce, free (idle) workers, population, warriors, per Town Hall level:
| TH | planner wf / free / pop / war | warlord | challenge | lazy |
|---|---|---|---|---|
| 1 | 20 / 2.4 / 25 / 0 | 19 / 1.9 / 24 / 0 | 19 / 2.0 / 24 / 0 | 19 / 1.8 / 25 / 0 |
| 2 | 36 / 6.5 / 50 / 2 | 34 / 5.8 / 47 / 2 | 35 / 5.8 / 47 / 2 | 34 / 5.5 / 47 / 2 |
| 3 | 49 / 12.1 / 88 / 11 | 55 / 18.6 / 102 / 11 | 61 / 24.0 / 94 / 11 | 49 / 11.9 / 85 / 11 |
| 4 | 60 / 14.6 / 118 / 16 | 65 / 19.3 / 121 / 14 | 69 / 24.0 / 121 / 16 | 62 / 17.1 / 116 / 15 |
| 5 | 57 / 17.1 / 128 / 29 | 62 / 23.8 / 133 / 28 | 77 / 33.4 / 140 / 29 | 60 / 20.2 / 129 / 28 |

## 11. Raid strength and loot (`python3 balance/raidmc.py`, 4000 Monte Carlo runs per cell)
Strength = sum of troop str x (1+0.1 x xp) ; troops str: skirm 1 (TH2), spear 1.6, archer 1.4, warrior 2.2 (TH3), viking 2.6 (TH4), berserk 3.4 (TH5), merc 2. loot/net in silver-equivalent (net = loot - provisions - 30 per dead warrior); tribute = defender pays without fight. Cell = win% / net silver / days (tactic with the best net per day shown: q=quick, a=assault, s=siege). Crews: TH3 12 mixed = skirm/spear/archer mix; strengths include no Jarl.
| target | TH3: 12 mixed (s 17.4) | TH3: 12 veterans xp2 (s 26.9) | TH4: 15 vikings and warr (s 38.1) | TH5: 15 berserks and vik (s 49.7) | TH5: 30 in two ships xp1 (s 84.9) |
|---|---|---|---|---|---|
| Hvalsey | q 100% net 149 /4d trib | q 100% net 149 /4d trib | q 100% net 145 /4d trib | q 100% net 145 /4d trib | q 100% net 131 /4d trib |
| Sogn outpost | q 100% net 155 /4d trib | q 100% net 155 /4d trib | q 100% net 151 /4d trib | q 100% net 151 /4d trib | q 100% net 175 /4d trib |
| Hordaland | q 66% net 140 /6d | q 99% net 312 /6d | q 100% net 319 /6d trib | q 100% net 318 /6d trib | a 100% net 292 /6d trib |
| Ringsaker | q 100% net 135 /6d trib | q 100% net 135 /6d trib | q 100% net 130 /6d trib | q 100% net 130 /6d trib | q 100% net 222 /6d trib |
| Skiringssal | q 87% net 232 /8d | a 100% net 378 /8d | a 100% net 251 /8d trib | q 100% net 251 /8d trib | q 100% net 215 /8d trib |
| Jutland | q 24% net -70 /8d | q 82% net 230 /8d | q 100% net 312 /8d | a 100% net 371 /8d trib | a 100% net 361 /8d trib |
| Hedeby | s 0% net -288 /18d | s 0% net -258 /18d | s 34% net -2 /18d | s 71% net 328 /18d | a 75% net 1007 /10d |
| Birka | s 0% net -279 /20d | s 28% net -68 /20d | s 76% net 203 /20d | q 67% net 231 /12d | a 100% net 955 /12d |
| Shetland | - | - | q 100% net 179 /6d trib | q 100% net 179 /6d trib | q 100% net 271 /6d trib |
| The Hebrides | - | - | q 100% net 142 /8d trib | q 100% net 142 /8d trib | q 100% net 276 /8d trib |
| Orkney | - | - | q 94% net 374 /8d | q 100% net 397 /8d trib | q 100% net 362 /8d trib |
| Lindisfarne | - | - | - | q 100% net 754 /12d trib | q 100% net 700 /12d trib |
| Iona | - | - | - | q 100% net 543 /14d trib | q 100% net 480 /14d trib |
| York | - | - | - | s 48% net 102 /24d | s 100% net 1526 /24d |
| London | - | - | - | s 17% net -190 /24d | s 91% net 1148 /24d |

## 12. Production per year (items per game year of 45 days; `balance/prof.py` turned out to be a render profiler, so this comes from the bot hook on addRes; mean over runs that reached TH5 by year; includes loot/trade-loaded goods added with addRes)
Year (TH reached by median run: TH2 d~59 = y2, TH3 d~147 = y4, TH4 d~325 = y8, TH5 d~515 = y12)
| resource | y1 | y2 | y3 | y4 | y6 | y8 | y10 | y12 | y15 | y18 | y20 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| FOOD items | 721 | 1143 | 1355 | 1690 | 1734 | 2631 | 2641 | 2578 | 2691 | 3094 | 3187 |
| fish | 369 | 645 | 662 | 613 | 443 | 990 | 866 | 885 | 995 | 1388 | 1507 |
| berries | 255 | 226 | 186 | 255 | 255 | 254 | 252 | 255 | 255 | 255 | 255 |
| meat | 14 | 19 | 30 | 245 | 346 | 400 | 540 | 541 | 583 | 585 | 587 |
| veg | 0 | 150 | 370 | 388 | 397 | 517 | 598 | 591 | 595 | 603 | 601 |
| bread | 0 | 0 | 0 | 51 | 189 | 199 | 193 | 143 | 136 | 91 | 65 |
| wood | 605 | 895 | 1067 | 1237 | 1008 | 1536 | 1365 | 1404 | 1338 | 1481 | 1345 |
| planks | 89 | 147 | 267 | 198 | 194 | 187 | 124 | 202 | 100 | 59 | 35 |
| iron | 111 | 55 | 68 | 97 | 72 | 121 | 130 | 113 | 47 | 48 | 47 |
| tools | 18 | 14 | 16 | 31 | 17 | 41 | 23 | 29 | 23 | 24 | 22 |
| salt | 0 | 32 | 91 | 91 | 75 | 105 | 105 | 95 | 72 | 86 | 91 |
| hay | 0 | 41 | 93 | 76 | 73 | 125 | 88 | 152 | 75 | 136 | 216 |
| wool | 0 | 0 | 0 | 22 | 55 | 83 | 90 | 55 | 51 | 51 | 50 |
| flax | 0 | 0 | 0 | 140 | 246 | 275 | 274 | 261 | 154 | 226 | 241 |
| grain | 0 | 0 | 0 | 131 | 271 | 320 | 332 | 277 | 194 | 233 | 242 |
| cloth | 0 | 0 | 0 | 11 | 27 | 44 | 45 | 27 | 23 | 18 | 14 |
| rope | 0 | 0 | 0 | 41 | 60 | 64 | 64 | 70 | 45 | 71 | 75 |
| hides | 1 | 1 | 1 | 1 | 56 | 65 | 68 | 95 | 110 | 110 | 112 |
| honey | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ale | 0 | 0 | 0 | 0 | 0 | 28 | 46 | 30 | 29 | 33 | 23 |
| silver | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| gold | 0 | 0 | 0 | 0 | 0 | 0 | 16 | 10 | 7 | 7 | 6 |
| swords | 0 | 0 | 0 | 1 | 1 | 0 | 9 | 4 | 3 | 2 | 2 |
| shields | 0 | 0 | 0 | 8 | 0 | 2 | 4 | 5 | 1 | 1 | 2 |
| misc | 2 | 3 | 9 | 18 | 18 | 32 | 22 | 24 | 22 | 24 | 23 |
| food eaten (units) | 453 | 721 | 1031 | 1326 | 1529 | 1724 | 2025 | 2203 | 2404 | 2679 | 2864 |
| population (end of year) | 29 | 42 | 58 | 65 | 78 | 101 | 118 | 120 | 124 | 138 | 147 |
prof.py (render profile at zoom 1, TH5 test village, 15 frames): fill 23%, drawImage 23%, stroke 20%, (program) 10%, (idle) 8% -- not an economy tool.
Buildings with zero staffed worker-days or no job slots (count at end): House x27, Funeral Pyre x1, Warehouse x3, Granary x3, Altar x1, Arsenal x1, Jarl’s House x1, Training Ground x1, Trading House x1, Harbour x1, Beehives x2, Ragnar’s Ship-Tomb x1, Tailor x1, Watchtower x1, Hof x1

## 13. Observations (facts from the tables above, no recommendations)
1. **Pace** (runs that placed a shipyard): TH2 day 54-65, TH3 day 137-155, TH4 day ~300-380, TH5 day ~470-555 (warlord/challenge sometimes 560-730). TH3->TH4 takes 170-230 days and TH4->TH5 155-225 days: the two longest steps; TH1->TH2 ~60 and TH2->TH3 ~85.
2. **Planks are short in 90-100% of the 50-day samples at every Town Hall step**, wood in 75-100% (TH2/TH3/TH5), iron 30-60%, tools/silver/gold rarely (silver 25-33% at TH3->TH4 only because silver starts at 0 until trading). Materials is the last missing item in almost every successful upgrade; saga goals are rarely last.
3. **Silver piles up:** trade sales average ~11000 silver per run (rope 3086, hides 2614, cloth 1387, smoked 1338, planks 669 ...) against ~870 silver bought and only ~300-500 spent through pay() in 900 days (TH3 ~55, TH4 ~215, TH5 50). Silver stock at TH4 arrival 1000-6900, at TH5 arrival 4300-10300, at day 900 5700-16000. Raid reports add only 0-2800 silver per run. Net silver gain in summer: +15/day (TH3), +38 (TH4), +26 (TH5); ~0 in winter (no trader).
4. **Winter food:** at TH5 winters the village eats ~59-67 units/day while producing ~24-26 (fish prod falls to 40% at sea, 25% inland, fields rest): stock falls ~27/day. Food-shortage flag on 29% (planner), 33% (challenge), 49% (warlord), 23% (lazy) of TH5 winter days; 11-25% at TH3 (higher where the run stayed in TH3), 5-9% at TH4. Winter-start stock only ~470-540 units at TH3/TH5 although the granary cap is ~700-1550 and summers gain +24..+30/day (fresh food spoils 3%/day).
5. **Firewood:** need grows 8.9/day (TH1) -> 16.5 (TH2) -> 21.8 (TH3) -> 28.3 (TH4) -> 31.6 (TH5, x1.3 in hard winters). Wood production in winter 24.5 / 31.7 / 35.3 / 37.1; net wood change in winter is +0.8..+3.3/day (planner) and slightly negative in some TH4 winters (-0.4..-1.2). Firewood shortage on 0-13 winter days per run (planner), up to 33 (challenge).
6. **People leaving and dying:** births 49-81, arrivals 66-138, deaths 1-28 (Relaxed) / 34-68 (Challenge) and people who left 14-73 per run in Relaxed (cause = food in nearly every case, firewood 0-14); Challenge has 10-58 hunger deaths and 4-11 sicknesses instead of leavers. Old age is 0-4 per run. Leavers are mostly in TH3 winters (stuck runs) and TH5 winters (7-17 per run).
7. **Population shape:** planner median 44 (y2), 62 (y3), 93 (y7), 116 (y9), 123 (y12), 124 (y15), 132 (y18), 150 (y20): rises to ~y9 then is nearly flat for 6 years while housing at the end is 131-182. Final population 82-165.
8. **Workers vs jobs:** the test village has +11/+12/+20/+35/+35 more workers than jobs at TH1-TH5 (target 4-8) and the true spare is 4-12 smaller where buildings could not be placed; the static estimate gives +13..+18. In real bot villages 2.4 / 6.5 / 12 / 15 / 17 workers stand idle on average at TH1-TH5 (up to 33 in challenge TH5); the bot staffs jobs by demand rather than filling all slots.
9. **Raids out:** outcomes are dominated by tribute (703) over victories (171) and only 4 defeats in all runs; crew deaths 0-24 per run. Launch attempts are refused by the provisions rule 0-257 times per run (bot retries daily) so it raids rarely in practice (0-45 raids per run, first around day 245-320). raidmc: TH3 12-mixed crews lose against Jutland, Hedeby, Birka; TH4 15 vikings cannot take Hedeby (34% siege) but take Jutland; TH5 crews win nearly all targets, York/London and Hedeby/Birka pay 900-1500 silver-eq per raid (30 men in two ships, siege/assault).
10. **Village raids (TH5+):** 0-7 per run, won 93 / plundered 10 in total, with warriors at home 14-30, no palisade (walls 0), 0-1 tower. Lost raids all say "carried off what they could".
11. **Buildings:** bots build but never staff Beehives (honey 0, no mead), Tailor and Hof (0 worker-days; the staffing routine has no rule for them); Smokehouse/Preserver/Bakery/Brewery return 0.5-0.9 silver-eq per worker-day (food at 0.4 per meal), vs 3-6 for Weaver/Iron Mine/Carpenter/Smithy/fields (hay, grain, flax at BASEP 1-1.2 per item) and 1.1-1.3 for Woodcutter/Fisher/Garden; woodcutters take 24% and fishers 16% of all worker-days. The bot builds only 1 smithy, 1 weaver, 2 mines, 2 carpenters at TH5, so building counts are bot choices, not game limits.
12. **Planks output falls late:** 267/yr (y3) -> 120-200 (y4-y12) -> 35/yr (y20) because the bot stops carpentry at 250 planks; wood production stays ~1340-1530/yr. Storage caps: material storage within 1 of cap on 12-24% of summer days at TH3-TH5, food cap never.
13. In the last-blocker lists of successful upgrades only Materials and a few saga goals appear (not population or fame); saga goals "A tomb for Ragnar", "The swift serpent", "True vikings" (TH5) each show in 30-58% of TH4 samples.
