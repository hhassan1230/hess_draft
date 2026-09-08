# RAT CITY — prototype

**Play:** open `index.html` in a phone browser (or a desktop browser with a phone-shaped window / device emulation). This build loads Three.js r128 from cdnjs, so it needs internet once; the competition build won't.

**Edit:** change files in `src/`, then `node build.js` regenerates `index.html` (unminified, readable).

**Competition build:** put Three.js r128 (global build) at `vendor/three.min.js`, then `node build.js --vendor`. Zip `index.html` + `vendor/` + `assets/`.

**Final art:** see `assets/ART_SPEC.md` — sprites drop in by filename with zero code changes; anything missing stays low-poly.

**Tests:** `node test/sim_test.js` (headless balance, 4 policies × 20 seeds) · `node test/boss_debug.js` (night 10 trace) · `node test/smoke_dom.js` (win + loss through the UI code, fake THREE/DOM) · `python3 test/browser_night1.py` (headless Chromium, needs Playwright).

**Debugging on a phone:** open `index.html?debug` for a live readout (phase, sim time, rats, draw calls, fps). Any JS error shows as a red banner at the top of the stage.

See `BUILD_LOG.md` for what's built, what deviates from the GDD, and what to playtest first.
