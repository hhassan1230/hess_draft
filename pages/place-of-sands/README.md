# Place of Sands, for your own host (v23)

Static files. Put the folder on any web host and open `index.html`.

    place-of-sands/
      index.html        the game, one file (2.5 MB; about 1.0 MB once the host compresses it)
      three.min.js      three.js r128, served from here; the CDN copy is the fallback
      strand-bill.js    what plays at the Strand
      README.md         this note

## Putting it up

- **Over an earlier build:** upload `index.html` and `three.min.js` over the old ones. If you have
  edited `strand-bill.js` on your host, or put films in a `media/` folder, keep yours: the bill
  in this folder is empty.
- **Serve it over https**, and open it from its address rather than by double-clicking the file.
  Sound, saves and YouTube all want a real address. For a look on your own machine:
  `cd place-of-sands && python3 -m http.server 8000`, then open http://localhost:8000
- No build step, no server code, no special headers. Keep the files together in one folder.
- Fonts come from Google Fonts (Fraunces, Space Grotesk, Caveat, Barlow Condensed). Without them
  the page falls back to system fonts and still plays.
- Saves are kept in the browser, one per address. A new address starts a fresh save, and saves
  made on the claude link do not carry over.

## What is new in v23

- **The shark.** Fall in the sea anywhere and a fin comes for JR, the shark leaps, and he is
  dropped back on the last dry ground he stood on. Every time, with something new to say.
- **A ground-pound always lands.** Before, about one in five went through the ground (one in
  two on a slow phone) and ended in "Cold. Back to the rocks."
- **The Messenger batch and its polish pass:** the camera follows the stick, the opening is on
  JR, conversations take the whole screen, Totals lists the eight pieces by name, a neighbor
  with something for JR has a mark over them, the HUD goes quiet, places are named as you reach
  them, JR idles and gets wet jeans, Gloria has an errand for him, and the block draws in fewer
  calls with a governor that can step back up.
- The sea and the light that went live as v22.1.

## The Strand

`strand-bill.js` is a list, one line a reel; the comment at its top describes each field. A reel
is tried as YouTube first, then its house copy (the `file` on that line), then the Rockaway
Newsreel, which the game draws itself and which is always reel 1. An empty list is the newsreel
alone. A house copy is a file on your host, so it suits footage you own or have leave to host.

## Notes

- The page carries a small test hook (`window.__PS_TEST`). It does nothing unless a test calls it.
- three.js is MIT licensed; its notice is at the top of `three.min.js`.
