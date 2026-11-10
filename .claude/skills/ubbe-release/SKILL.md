---
name: ubbe-release
description: Release a new version of Ubbe's Saga: check, set the version, build, update the docs, push to GitHub Pages and refresh the preview. Use when a round or fix is finished and the user wants it published.
---
# Release Ubbe's Saga

1. **Version.** Content round → next minor (`Beta 0.7.0`); fix only → next patch (`Beta 0.6.2`). Confirm the name if unsure.
2. **Check.** Ask the `tester` agent to run `python3 tools/check.py`. Do not release on a FAIL: fix first.
3. **Saves.** If the map size or save format changed, bump the save keys in `source/src/30_saves_title.js` (`ubbesaga.bNN.*`) and remember to tell the player old saves will not load.
4. **Build for publishing.** `sh tools/release.sh "<version>"` (writes `source/VERSION`, builds, copies the game to the repo root, updates the README version).
5. **Docs.**
   - `CHANGELOG.md`: add the version at the top, 3–8 short bullets in plain English.
   - `BACKLOG.md`: tick or remove what this release did.
   - `SPEC.md`: update any section whose behaviour changed, and its version in the title.
   - `python3 tools/gen_numbers.py` if any number changed (costs, limits, troops, targets).
6. **Commit and push** to `main` with a message that starts with the version and lists the main changes, ending with the attribution lines the session asks for. GitHub Pages updates in 1–2 minutes.
7. **Preview.** If the session has the preview artifact, republish it from `source/dist/index.html`.
8. **Tell José (in Portuguese):** what changed, what to try first, anything that won't carry over (saves), and that the installed app may need closing and reopening to update.
