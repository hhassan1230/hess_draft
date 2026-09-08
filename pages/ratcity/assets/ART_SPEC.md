# RAT CITY — Final Art Spec (generate these, I place them)

Drop-in rule: **name the file exactly as listed, PNG with transparency, put it in `assets/`, done.** Zero code changes. Any file you don't deliver keeps its low-poly stand-in, so partial delivery is always safe. Palette-correct placeholders currently sit in `assets/` — your files overwrite them by name.

If your generator can't do transparent backgrounds, deliver on **solid #00FF00 green** (or send whatever you get) — I'll key, crop, resize, and compress everything on my side. Don't spend deadline time on cleanup.

---

## Global style rules (paste into every prompt)

> flat 2D game sprite, Basquiat-inspired street-art style, thick black ink outlines, flat solid color fills, no gradients, no soft shading, no cast shadow, no background, no text, centered, small margin around the subject

**Exact palette (use these hexes):** bag yellow `#F2C14E` · rat plum `#6B4E71` · boss plum `#4A3350` · tower teal `#2A9D8F` · L2 teal `#3FC4B3` · bone white `#F4F1EA` · danger red `#E63946` · ink `#151313`

**Hard rules:** the game draws its own blob shadows — bake none. No text in unit sprites. Danger red appears ONLY where listed. Same rat hue family for all rats. One consistent line weight across the whole set — generate everything in one style session if you can.

**Two views, and they matter:**
- **TOP-DOWN** sprites lie flat on the street and rotate with movement. Draw the creature seen from directly above, **head pointing to the TOP of the canvas**.
- **FRONT** sprites stand upright facing the player. Where facing matters (the cat), draw it **facing RIGHT** — the game mirrors it.

---

## TIER 1 — the nine judges stare at (do these first)

| # | filename | view | canvas | it is |
|---|---|---|---|---|
| 1 | `rat_scout.png` | top-down, head up | 512×690 | lean scrappy sewer rat, plum `#6B4E71`, long tail |
| 2 | `rat_fat.png` | top-down, head up | 560×740 | same rat but round and heavy, plum, smug |
| 3 | `rat_boss.png` | top-down, head up | 640×820 | PIZZA RAT: big rat in deep plum `#4A3350`, scrawled yellow crown on its head, dragging/hugging a yellow pizza slice |
| 4 | `cat_l1.png` | front, facing right | 512×640 | bodega cat sitting upright, teal `#2A9D8F`, deadpan |
| 5 | `bag.png` | front | 512×640 | one knotted NYC trash bag, yellow `#F2C14E`, plump |
| 6 | `trap_armed.png` | top-down | 512×512 | snap trap SET: bone-white base `#F4F1EA`, jaws open wide, coiled tension |
| 7 | `trap_sprung.png` | top-down | 512×512 | the SAME trap snapped shut, jaws closed flat — must read as the same object |
| 8 | `bin.png` | front | 512×620 | city trash bin/container in teal, lid propped open, mouth visible (the game stacks bags above the rim) |
| 9 | `token.png` | front | 512×512 | old NYC subway token, bone white with an ink cutout — flat coin face |

## TIER 2 — the scene (big look-per-effort wins)

| # | filename | view | canvas | it is |
|---|---|---|---|---|
| 10 | `facade.png` | front | 1472×512 | wide brownstone facade strip at night: dark wall `#2B2628`, scrawled windows, room left for graffiti to accumulate on it. This one image becomes the whole backdrop |
| 11 | `truck.png` | side view, driving right | 1024×512 | DSNY-style garbage truck, yellow, boxy, friendly |
| 12 | `cat_l2.png` | front, facing right | 512×640 | CHONKY: the same cat but visibly rounder, brighter teal `#3FC4B3` (skip it and the game just scales cat_l1 up 40% — still reads) |
| 13 | `pizza_slice.png` | front | 512×512 | one yellow pizza slice, thick outline (flies into the sewer when the boss dies) |
| 14 | `tag.png` | front | 512×300 | one rat-gang graffiti throw-up in danger red `#E63946` — a scrawled rat glyph or crown, sprayed look |

## TIER 3 — props (fully optional, low-poly versions already read fine)

| # | filename | view | canvas | it is |
|---|---|---|---|---|
| 15 | `prop_hydrant.png` | front | 384×640 | ink-black fire hydrant, bone cap |
| 16 | `prop_lamppost.png` | front | 288×1024 | NYC cobra-head streetlamp, ink; warm bulb (the game adds the glow) |
| 17 | `prop_stoop.png` | front | 512×420 | brownstone stoop rail corner, ink + bone |
| 18 | `prop_scaffolding.png` | front | 512×760 | sidewalk-shed scaffolding bay, ink poles + bone plank |

**Also worth having (not sprites):** a square **title/thumbnail image** for the Devpost submission form (game name + one rat + one bag, loud). Not loaded by the game — keep the in-game title card as type.

---

## Per-asset prompt starters (add the global style block to each)

- rats: "top-down view of a cartoon sewer rat seen from directly above, head at top, long tail at bottom, flat plum purple #6B4E71"
- boss: "...huge rat, deep purple #4A3350, crude yellow crown drawn on its head, clutching a yellow pizza slice"
- cat: "front view of a chunky bodega cat sitting upright facing right, flat teal #2A9D8F, unimpressed expression"
- bag: "front view of one tied-off bulging trash bag, flat yellow #F2C14E"
- trap: "top-down view of a cartoon snap trap with jaws open / with jaws snapped shut, flat bone white #F4F1EA base"
- bin: "front view of a sturdy city trash container with the lid propped open, flat teal #2A9D8F"
- token: "front face of a vintage brass subway token, flat bone white #F4F1EA with black cut-out center"
- facade: "wide flat illustration of a Brooklyn brownstone building facade at night, dark charcoal #2B2628, simple scrawled windows, street-art mural energy, mostly empty wall space"
- truck: "side view of a boxy cartoon garbage truck driving to the right, flat yellow #F2C14E"
- tag: "single graffiti throw-up of a crowned rat, spray paint, flat red #E63946 on transparency"

---

## Delivery + budget

- Total art budget < 4MB (we're at ~140KB of placeholders; the zip cap is 35MB — huge headroom, but flat PNGs should stay tiny anyway).
- Send files in any state (wrong size, green screen, extra background) — I normalize and pack them.
- Final zip layout for submission: `index.html` at top level + `vendor/three.min.js` + `assets/*.png`. All relative paths, zero network — already wired.
- One caveat I've engineered around: some desktop browsers block WebGL textures when index.html is opened by double-click (file://). Served locally or on a phone — the judges' stated setup — art shows; in the worst file:// case the game silently falls back to the low-poly set and stays fully playable.
