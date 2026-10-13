# Place of Sands, for your own host (v28)

Static files. Put the folder on any web host and open `index.html`.

    place-of-sands/
      index.html        the game, one file (2.6 MB; about 1.1 MB once the host compresses it)
      three.min.js      three.js r128, served from here; the CDN copy is the fallback
      strand-bill.js    what plays at the Strand
      music/            the song: theme.ogg, and theme.mp4 (AAC) for a browser that cannot play Ogg
      share.jpg         the picture a shared link shows (1200 by 630)
      icon.png          the browser tab's icon, and the one a phone puts on its home screen
      README.md         this note

## Putting it up

- **Made for https://hessvacio.com/pages/place-of-sands/**. The share tags at the top of `index.html`
  name that address, and the picture at it. If the game goes up somewhere else, those addresses
  have to change with it (search the file for `hessvacio.com`; there are five).
- **This folder wants a host that serves files as they are.** If `/pages/` on hessvacio.com is a page
  you edit in a site builder (Shopify, Squarespace and the like) rather than a folder you upload
  to, the game has to live where files can be uploaded, and the share tags belong on the page that
  shows it. Say which it is and the next build can be cut that way.
- **Over an earlier build:** upload everything, `music/` included. If you have edited
  `strand-bill.js` on your host, or put films in a `media/` folder, keep yours: the bill in this
  folder is empty. Without `music/` the game still plays, with the old score.
- **Serve it over https**, and open it from its address rather than by double-clicking the file.
  Sound, saves, YouTube and controllers all want a real address. For a look on your own machine:
  `cd place-of-sands && python3 -m http.server 8000`, then open http://localhost:8000
- No build step, no server code, no special headers. Keep the files together in one folder.
- Fonts come from Google Fonts (Fraunces, Space Grotesk, Caveat, Barlow Condensed). Without them
  the page falls back to system fonts and still plays.
- Saves are kept in the browser, one per address. A new address starts a fresh save, and saves
  made on the claude link do not carry over.

## The song

- `3.4_Beat` is the score now, on a loop: 64 bars at 80 beats a minute, cut so the end runs into the
  start on the downbeat. The bulbs, the bounce and the rest of the block keep its time. (The file runs
  straight through its seam; Chrome's own loop leaves about a hundredth of a second of quiet there, once
  every three minutes.)
- **Ogg first, the mp4 when the browser cannot play Ogg** (Safari before 18.4, on an iPhone, an iPad or
  a Mac). The page asks the browser which it can play and fetches that one, and the other only if that
  one fails.
- It goes quiet with the Music switch and with the Sound switch, when the tab is hidden, and while
  a film plays at the Strand. It dips while the glass goes in, at the rail and at the sundown.
- If neither file can be had, the old score plays instead, so a missing `music/` folder is never silence.
- Safari asks for media in pieces (byte ranges). Ordinary static hosts answer that. If the song never
  starts on an iPhone but does on a computer, that is the first thing to ask the host about.

## Shared links

- `share.jpg` is what a link to the game shows in Messages, Slack, Discord, X, Facebook and the rest:
  JR on the sand beside the plaque. The title and the line under it are the plaque's own words.
- Those services keep their own copy of a link's preview. The first share after the upload is fresh.
  If `share.jpg` changes later, the old picture can hang on for a while: Facebook's Sharing Debugger
  (developers.facebook.com/tools/debug, "Scrape Again") and LinkedIn's Post Inspector refresh theirs
  by hand; the others refresh in their own time.

## What is new in v28

- **The Q113.** The bus on Central Avenue is your Q113 now: built after the low-poly city bus you sent
  (a low floor, the windshield in two panes under its destination sign, the bike rack folded on the
  front, mirrors out on arms, the air conditioner on the roof) and painted like the one you rode as a
  kid, cream with the red band and rust-brown bumpers. Its signs say "Q113 Far Rockaway". At the
  shelter it kneels and opens its doors, then shuts them and stands up before it pulls out, and its
  windows light up at dusk. It still waits and honks when JR stands in its lane.
- **The neighbors who talk about the bus** (Tamika waiting at the stop among them) talk about the
  Q113. The stop's sign still lists the Q22 and the Q113: both stop there.
- **Two parked cars** stood across the bus's lane, and the bus drove through them. They park at the
  two ends of the other curb now.

## What came in v27

- **The song**, above, in place of the temporary score.
- **Chip bags.** The chips on the block are printed pillow bags now, after the PSX chip bags you sent:
  crimped ends, a loud print in five colorways, a script logo on a sun, low-res and in the game's ink.
- **The build's name** sits small under "Made in Brooklyn Games" on the title, so a picture of the
  title says which build it is.
- **The camera at the map boards.** Walking up to a map board could drop the lens to the ground behind
  it, or into JR. It now rises over the board, and over anything else low that is between them.
- **Speech bubbles at the edge of the screen** slide in whole, with the tail drawn toward whoever is
  talking. They used to be cut off by the edge ("...e up. Cast past the break." at the fishing spot).
  Someone well off the screen has their bubble fade instead.
- **Resting at the rail** is offered from the boardwalk side only. From the dunes behind the rail it
  started a rest whose camera looked through the bars at the back of JR's head.
- **The ring run's hoops** fade when the camera is in or beside one, or when one's rim crosses between
  the camera and JR, the way the trees do. A walk down Central Ave was often seen past a great yellow arc.
  A hoop with JR framed in its middle stays: that is how the run is aimed.
- **Share preview and icon**, above.

## What came in v26: one build again, with the fixes from your playthrough

v24 (controller play) and v25 (the fixes from your playthrough) were made from the same preview and
each lacked the other's work. v26 was both, with four guards found while testing them: all eight
lights the window on the map; the camera goes under roofs and comes back behind JR in one move after
the sundown; backed against a wall the lens comes forward and leaves JR out until there is room; round
hats; over-the-shoulder shots only where his hair stays clear of the face; trees fade around the lens.

## What came in v24: controller play

One page, no console builds. While it runs the page works out what is in the player's hands and
follows it: pick up a controller and the on-screen stick and buttons go, the prompts name that
controller's own buttons, and a gold frame moves through the sheets. Touch the screen or a key
and it all goes back.

- **Any controller a browser can see:** Xbox, PlayStation, Nintendo, a Steam Deck. A jumps and B
  acts, by the letter printed on the pad. Left stick or D-pad walks, right stick looks, Menu
  opens Totals.
- **Every sheet without a pointer:** the title, talks, map boards, postcards, Totals, the Strand.
- **Big screen:** on a console, or from its switch in Totals, the lettering is laid out for a
  screen across the room and kept clear of the TV's edges.
- **Rumble** goes to the controller's motors.
- **Start over now asks twice**, for every kind of input.
- **Controller check** (a row in Totals, or add `#check` to the address): one sheet that says what
  the browser is giving the page. Made to be photographed.

## Controllers and consoles

- **An Xbox** plays it in Edge: open your address there. If the controller is steering Edge's
  pointer instead of the game, the title says what to try. Then open `your-address/#check`, press
  each button once, and look at what the sheet says: that is the first thing to send back if
  anything is off.
- **A PlayStation or a Switch** has no browser a player can open. Nothing here changes that.
- **https matters here too:** some browsers only hand a controller to an https page.
- **If you put the game inside a frame** on another page, give the frame
  `allow="gamepad; fullscreen; autoplay"`. Without `gamepad` a browser refuses the page a
  controller; the Controller check says so in plain words, and on a console the title does too.
- **Sound and full screen** start on a press. Not every browser counts a controller's button as
  one, so if the game is silent after starting it from a controller, one click or key fixes it.
- Not tried on a real console before this went out: Edge's controller mode, what its buttons
  send, and how the 3D holds up there.

## The Strand

`strand-bill.js` is a list, one line a reel; the comment at its top describes each field. A reel
is tried as YouTube first, then its house copy (the `file` on that line), then the Rockaway
Newsreel, which the game draws itself and which is always reel 1. An empty list is the newsreel
alone. A house copy is a file on your host, so it suits footage you own or have leave to host.

## Notes

- The page carries a small test hook (`window.__PS_TEST`). It does nothing unless a test calls it.
- three.js is MIT licensed; its notice is at the top of `three.min.js`.
