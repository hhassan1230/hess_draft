# RAT CITY — Build Log

Source of truth for design is `rat-city-gdd.md` (v1.0). This log records what the build actually does, where it deviates, and what playtesting has to answer. Maintained by the coding agent from session one (GDD §15).

---

## Session 1 — Sat Aug 29, 2026 (Phase 1 target: "ugly but playable tonight")

### Delivered
A playable 10-night run, end to end, with the whole GDD roster in place mechanically. That is further than Phase 1's brief; the economy, roster, feel, and finale phases were cheap to include once the sim existed, and every one of them is a headless-tested rule rather than a promise. What remains for Phases 2–5 is **tuning and real-device feel**, not features.

**Files**
```
index.html            ← the build (assembled, unminified, readable; do not hand-edit)
build.js              ← node build.js [--vendor]   (GDD §12 #4 day-one build step)
src/config.js         ← every number in the GDD, in one place; palette tokens; copy (LOCKED vs TEMP)
src/sim.js            ← the game as pure logic, no DOM, no THREE (headless-testable)
src/render.js         ← Three.js r128 low-poly temp assets, ortho camera, pools, juice
src/audio.js          ← procedural Web Audio, zero audio files
src/ui.js             ← DOM HUD, day panel + wave preview, radial, alerts, cards
src/main.js           ← portrait letterbox, taps-only input, fixed 60Hz sim loop
src/style.css         ← palette as CSS vars, scrawl display face, HUD bands
test/sim_test.js      ← headless 10-night runs, 4 policies × 20 seeds
test/boss_debug.js    ← boss fight trace vs a full upgraded board
test/smoke_dom.js     ← fake THREE + fake DOM; plays a win and a loss through Main/UI/Render
test/browser_night1.py← headless Chromium (Playwright) night-1 regression, real DOM/audio/input
```

**Architecture (the Nintendo part: mechanics first, shapes second)**
- Sim is pure JS, deterministic given an injected RNG, decoupled from render through an event queue. Fixed 60Hz timestep; render draws whatever state exists. Two-frame freeze on trap SNAP is a loop-level flag.
- Temp assets are primitives built in code with an inverted-hull outline (a second BackSide mesh, ink, ~8% bigger). This gives the thick Basquiat line for free and means final sprites can replace factories one at a time via the manifest with no rule changes.
- State readability is enforced by shape, not numbers: Chonky cat is 1.4× bigger; trap jaws visibly rise as the cooldown ticks; binned bags render above the rim; each escaped bag adds a graffiti tag on the wall; MARKED slams a full tag on; the truck scoops piles as it passes.
- Palette tokens live in `CONFIG.PALETTE` (JS) and `:root` (CSS). Danger red is used for theft, MARKED, storm, and nothing else.

### Deviations from the GDD (all intentional, all reversible)
1. **Three.js is loaded from cdnjs in this build.** The sandbox that produced it has no network, so `vendor/three.min.js` could not be fetched. `node build.js --vendor` switches the tag to `vendor/three.min.js`; drop r128 (global build) in `vendor/` before the competition zip. The validation ritual (airplane mode) will catch any slip.
2. **Slot positions moved to a curb band** (stoop rail / hydrant flanking the piles; lamppost / scaffolding upstream) so a cat's swat radius can actually cover a pile. GDD names and count unchanged.
3. **Manhole / grate / facade nudged forward** ~0.6 units so wall tags, the gutter, and pile tops sit clear of the HUD bands on a 390×844 stage.
4. **Boss returns after escaping** (4s delay) carrying his remaining HP and enrage state, so night 10 ends on his death or the 90s clock, both victories. (First cut respawned him at full HP: unwinnable. Fixed.)
5. **Night-1 nudge (TEMP):** the first NIGHTFALL press on an empty board with a cat in the budget shows "place a cat first." and does not start the night; the second press does. Not in the GDD; added so a fresh player learns that the circles are build slots.

### Headless findings (test/sim_test.js, 20 seeds each)
| policy | outcome |
|---|---|
| sensible (build early, stash before trucks, upgrade cats) | wins 18/20, avg score ≈ 26 |
| hoarder (never spends) | dies night 5 — greed kills, as designed |
| nothing (never builds) | dies night 3 |
| spender (spends everything) | wins, score 30–31 |

- Losses for a competent player are near zero on nights 2–9; pressure only appears when hoarding. **Base waves may be soft**; hold until fresh-player tests say so.
- The +20 victory bonus dominates score (banked bags per truck are 2–3 for a sensible player). Score barely rewards the greed loop. Candidates: shrink the bonus, or count carried-over bags per truck at a multiplier. **Do not touch before playtest.**
- Boss vs a full L2 board: dies on his third pass at ~76s; infestation lands near 60%. Each boss escape is 36% infestation, so two escapes with any prior loss is a storm. "Wins with sweat" — confirmed.
- Full run ≈ 470s of sim (~7.8 min) — a touch over the 6.5–7.5 target. Day phases are untimed, so the real number depends on the player.

### Bugs caught before you ever loaded it
- Event payloads that carried a `type` key overwrote the event's own type (`unlock` arrived as `cat`). Payload keys renamed (`rat`, `tower`, `what`); `emit()` now hardens the type field.
- Boss respawn at full HP (above).
- Score tally spacing was computed from the wrong count; now spans ~55% of the truck's drive.

### TEMP copy (needs a voice pass; locked lines untouched)
`theftNoCat: "nobody home."` · `nearMiss: "<cat>. at the edge."` · `victory: "you kept it."` · `loss: "they took the block."` · `teachCat: "place a cat first."` · dawn alert `"night N · M bags lost"` · unlock chip `"trap unlocked"` · boss alerts `"he came back." / "ENRAGED" / "the slice is gone."` · night-5 alert `"something under the street."` · night-9 alert `"too quiet."`

### The first 60 seconds, as built (the GDD's storyboard doc was never written — this is what exists)
0s title card, tap → 1s four bags land on the curb with a squash, hum fades in → 2s "more trash, more rats." → preview shows 5 rats, two ringed yellow, "+2 for your trash" → player taps a circle, radial pops, cat placed (named Mango/Cheeto/Biscuit/Ash), remaining bags become 2 fewer rats in the preview (the greed lever, visible) → NIGHTFALL: hum ducks, 3s of near-silence, squeaks → 3 scouts descend, one grabs a bag and drags, alarm + red flash + buzz → the cat lunges and catches it at the edge: "Mango. at the edge." → a token knocks loose, "TAP." at its position → quiet beat → dawn, "night 1 · nothing lost", +3 bags, the preview grows, "trap unlocked" pulses. About 45–55s.

### What to playtest first (Sun 8/30, on a real phone)
1. Does the wave preview make the greed decision *felt*? Do people spend down before a truck night or hoard?
2. Does the night-1 near-miss land, or does it read as a glitch?
3. GDD §14 #2: does anyone bin everything and go broke?
4. GDD §14 #4: 35s of quiet on night 9 — dread or boredom?
5. Thumb reach on the two upstream slots (lamppost, scaffolding) — the radial pops upward; check it never clips the top HUD.
6. Frame rate on a mid-range Android; the outline hulls double draw calls (~120 meshes at peak).

### Next session
- Real-device pass: fix whatever the phone reveals (touch mapping, audio unlock, safe-area).
- Difficulty: base spawns on nights 4–8, victory bonus, boss HP — from playtest notes only.
- `vendor/three.min.js` + `node build.js --vendor`; run the validation ritual once early to shake out path issues.
- Art pass via manifest (week 2). Design-intent doc (500 words) draft once tuning stabilizes.

---

## Session 1b — Sat Aug 29 (late) — "No rats are coming at night"

**Report:** rats never appear at night.

**Cause (sim, not render):** a rat with nothing to steal fled instantly. `pickTarget` only considered piles *with bags*; with every pile empty it returned −1, the rat switched to `flee` at spawn, and since it was already standing on its spawn point it despawned the same frame. Day 1 gives 4 bags and a cat costs 2, so the most natural opening in a tower defense — two cats — leaves 0 liquid bags and an invisible night. The preview even promised "3 rats tonight." Headless tests never caught it because every test policy left bags on the curb.

**Fix:** rats come looking anyway. No bags → walk to the nearest pile, sniff for 0.7× grab time, run home. They're visible and swattable, so a spend-everything board still gets a night (and cats farm tokens off the sniffers). The boss never leaves for lack of bags; he keeps stalking until killed or the 90s clock. Verified in real headless Chromium (stub THREE only): two cats → 3 rats walk in, 3 kills, no errors.

**Added diagnostics (stay in the build):**
- Any JS error prints itself in a red banner on the stage — phones have no console.
- `index.html?debug` shows phase / sim time / rats / tokens / queue / liquid bags / draw calls / triangles / fps.
- `test/browser_night1.py` — Playwright regression for both night-1 openings.

**Honest caveat:** the Three.js render path still hasn't run on a real GPU in my hands; this sandbox has no copy of Three.js. If rats are *still* missing on a device after this fix, the `?debug` line will say whether the sim has them (`rats3`) and whether the renderer is drawing (`calls`), and the red banner will show any exception. One screenshot of that answers it.

**Tuning observation (not changed):** with one cat and 2 liquid bags, night 1 spawns 4 rats (3 + 1 attraction). The near-miss script catches the first thief, but a rat from the *other* lane usually takes a bag from the far pile. Night 1 is not the theft-free tutorial the GDD's pacing table implies. Options: night 1 ignores attraction; or night 1 spawns from the left grate only; or accept it as the first lesson. Decide from fresh-player faces.

---

## Session 2 — Mon Sep 8 (deadline day, ~15h to close) — the fun pass, implemented

**Inputs:** the fun-pass brief (six failure modes), the winners analysis (double-edged resource + charm + first-20-seconds), and fresh judge-side facts pulled from the competition page today: judges play **a single session on a mobile-device browser**; the manager's guidance that *"once it works, adding real depth, a longer arc, or a fresh twist will score higher, not lower"*; the current-field gallery is unpublished, so no competitor scouting is possible — we optimize against the rubric, not the field.

### The six changes, as built
1. **Bait placement (structural).** Dawn bags land at the curb edge *in your hands*; you drop each one on a pile. Rats path to where the wealth is, so placement steers them through your kill zones — verified in trace: bags on the stoop pile pull right-alley spawns clear across the board into the cat. The NIGHTFALL button reads `DROP YOUR TRASH · N` while bags are in hand; one nudge per day, then a second press auto-scatters (judges can never soft-lock). Spending draws from the hand first; refunds and bin unloads return to the hand so *you* re-place them.
2. **The truck collects the curb only.** Bins are safe from rats and invisible to the truck alike — including at victory. Wealth that never risked a night is worth nothing; the score card says so: "left in the bin. safe. worthless." Pickup eve is now a real verb sequence: empty the bins onto the curb and survive your own hoard.
3. **Tap a dragging rat and it drops the bag** (boss excluded). Theft is now a fight for attention against token grabs. Recovered bags fly home; no infestation.
4. **Pulse compression.** Nights 2–8 shortened (22/26/30/34/38/42/50), spawn window 0.70 → 0.62. Full run lands ≈ 6.5 min.
5. **Weight pass.** Swat gains a 95→42Hz body and +40% level; theft alarm louder; new snatch sfx for recovery; place-bag thump.
6. **Economy tightening.** Cat L2 3 → 4 bags; nights 6–8 base +1. Plus the change the new verb demanded:
   - **Pile cap 6 (new, not in the brief).** First post-change balance run found the replacement exploit: stack every bag on the one pile your cat covers → fortress (hoarder scored 46, beating everyone). A curb pile only holds 6 (counting bags in flight); full piles dim as targets, and overflow must spread to lanes one cat can't cover — or go in the bin, which is exactly what bins are for now.

### Balance after (20 seeds + policy singles)
sensible **20/20 wins, avg 28**; spender wins 27; **hoarder now storms out night 10 at 18** (9 escapes, overflow bleeding); nothing dies night 3. Greed kills again; utilization pays.

### Honest notes
- The night-1 scripted near-miss no longer fires for competent play — with good bait placement nothing gets stolen on night 1, so there's nothing to catch. It still fires exactly when a player's layout leaks (when the lesson is needed). Watch one fresh player before deciding it needs forcing.
- Tap-to-recover has no cooldown; drag speed (40%) is the only limiter. If a playtest shows infinite recovery trivializes theft, cap it at one recover per night or make recovery drop 1 of 2 bags from fat rats.
- The render layer still has not run on a real GPU in my hands; the smoke + Playwright suites cover sim/DOM/input/audio paths only. `?debug` + the red error banner are still in the build for a fast phone check.

---

## Session 3 — Mon Sep 8 — the art pipeline (drop-in by filename)

The GDD promised final art "drops in by filename with zero code changes" (§9). The build had drifted from that — everything was code-built primitives — so this session made the promise true:

- **`assets/<id>.png` convention.** 18 ids (rats ×3, cat ×2, bag, trap ×2 states, bin, token, truck, slice, facade backdrop, 4 props, graffiti tag). Two draw modes: `flat` sprites lie on the street and rotate with heading (drawn top-down, head at canvas top); `up` sprites stand and face the tilted camera (drawn front view; the cat mirrors for facing instead of rotating).
- **Per-asset graceful fallback.** Every entity keeps its low-poly build; a loaded texture hides it and mounts one alpha-tested plane. A missing file, a bad file, or a file:// WebGL-texture restriction just leaves that one entity low-poly — partial art can never break the build. Rationale: judges play on a phone browser (served), where textures load; a double-clicked file:// desktop open in Chrome may taint textures, and the game must survive that too.
- **State readability carried over to sprites:** trap swaps armed/sprung textures on the same mesh; boss sprite tints toward red on enrage; bin keeps its procedural bag stack above the sprite rim; Chonky = cat_l2 art or cat_l1 scaled 1.4×; token spins by x-scale like a 2D coin.
- **Palette-correct placeholders generated** (PIL, ~140KB) so the sprite path runs today; final art overwrites by name. `assets/ART_SPEC.md` is the generation brief: filenames, views, canvases, palette hexes, per-asset prompts, tiers ordered by judge attention.
- Smoke suite now runs both worlds: `node test/smoke_dom.js` (no art → fallback) and `SMOKE_ART=1 ...` (art present → sprite path). Both play a full win and a storm loss.

**Submission zip layout locked:** `index.html` top-level + `vendor/three.min.js` + `assets/*.png`, relative paths only.

### Validation ritual (GDD §12, before submit)
re-run build → unzip to a clean folder → serve locally → open in incognito → airplane mode → play a full run in portrait → read `index.html` in an editor to confirm it's unminified.
