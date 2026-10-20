# Place of Sands, for your own host (v35.9)

Static files. Put the folder on any web host and open `index.html`.

    place-of-sands/
      index.html        the game, one file (3.4 MB; about 1.4 MB once the host compresses it)
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
  a film plays at the Strand. It dips while the glass goes in, at the rail and at the sundown, and a little while JR takes a snack;
  it swells with a long paddleball rally, and closes in under its slow motion.
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

## What is new in v35.9

- **You can walk into the Bodega on Central.** The bell over the door, the fans and the fridges humming, Doña Alta at
  the register and Tito on the grill, and Lotto, the store cat, on the newspaper stack.

## What came in v34

- **Paddleball is a big deal now** (after Ping Pong the Animation, and Rockstar's Table Tennis). Every return lands:
  the game stops for a beat, the screen flashes, a hand-lettered TOK! pops off the ball and the speed lines come in,
  harder the longer it goes. Every five returns the ball comes faster and flatter and the window for B gets tighter;
  a press dead on the ball is a Perfect. Perfects and good returns fill a focus meter (the bar under the game's name);
  a full one makes the next return a focus smash. On the fifth return the screen breaks into manga panels, one by one
  (Mike winding up, the ball, JR's eyes) in slow motion, and they're smashed away before the ball gets to him. On the
  tenth and twentieth the camera rides behind the ball to Mike and watches it come back from behind JR, and a title
  card says so: JR, ten in a row (the five-find prize, the first time). People on the beach come over to watch as it
  heats up, cheer, and go back to what they were doing when he puts the paddle down. The song swells with it.
- **Things you could walk or jump through, fixed** (from Hess's own screenshots): the platform canopy's columns stop
  JR; its roof stops his hair when he jumps, holds him up when he stands on it, and stops him at its end from the
  train's roof; the hanging signs, the lamps and the payphone up there too. The bus shelter on Central has glass sides
  and a back you can't walk through and a roof you can stand on; its route sign hangs beside its pole. Lorraine lies
  on her towel, not half under it. His footprints are the size of his shoes, under the foot that came down.

## What came in v33

- **A snack is a moment now.** The first time each of the four food vendors gives JR something (Mr. Lou's
  cone, Ms. Rosa's cherry ice, Marisol's knish, Sonny's twist cone), the camera comes round low in front of
  him once their line is closed, with the vendor behind him: they toss it, he catches it (+1), turns to you
  grinning and holds it up, takes a bite (cheeks full, chewing), and it's gone. About two and a half seconds;
  their name and line on the card while he holds it. Each snack is its own little model in the game's toon
  shading and ink. Later talks are plain, and a talk left by opening Totals keeps the snack for the next one.

## What came in v32

- **His face moves.** JR's face has its expressions now: happy with a piece of sea glass in his hands, terror in
  the shark's mouth, a grin at the sundown, listening (and a glance their way) when someone talks to him, his mouth
  working when he talks; sad when he trips or is put back down by the shark, a face when he bumps into someone at a
  run, a smile at a streak.
- **Photo mode.** Totals has "Take a picture": the controls go, the camera walks round JR on a drag (a pinch brings
  it in and out; a controller's sticks or the arrow keys do the same), he turns to it and poses (a wave, hands on
  hips, both arms up), and the shutter takes the picture with a plaque along its foot. It goes to the phone's share
  sheet, or downloads where there is none. The ending card's Share takes the sundown the same way.
- **Comfort.** A left-handed layout (the stick on the right, the buttons on the left), how fast a drag or the right
  stick turns the camera, and the drag's up and down the other way round. Kept apart from the save, so Start over
  leaves them be.
- **The shallows.** Off the sand a shelf runs out under the water, knee deep: JR can wade it, slower, splashing, wet
  to the thigh. Past it is the sea, and the shark, as before.
- **Lamp posts** are their own pool now, and one that comes between the camera and JR ghosts the way a neighbor does
  (one used to stand across his face).
- **Chip bags** carry their flavour on a band.

## What came in v31

- **Mr. Lou's truck is the ice cream truck you sent** (the one in your Brooklyn walk): pink, with its
  striped awning and the big cone on the roof, in its own texture and the game's toon shading and ink.
  It is parked where the old truck was on Beach 20th, cab to the south, as tall as the old one (and so
  a little longer, 5.5 where the old one was 4.6), and Mr. Lou serves from its window, under the awning,
  a step north of where the old window was; you buy from the curb in front of it. The tune still plays
  every twenty-two seconds. JR can stand on its hood, its cab and its roof, the way it is drawn.

## What came in v30

- **The camera in tight spots.** Pushing JR against a wall no longer takes the camera through it into the
  room behind. Pushed in close, the camera rises and looks down over him and steps over a shoulder, so the
  way ahead stays in the picture; where it has nowhere to go and sits square on his back, he fades to a
  see-through dither instead of filling the screen.
- **Mr. Teddy's window.** The token booth has a real window now, and he can be seen in it; talking to him
  shows his face through it.
- **Speech bubbles stack.** Two at once (the counting at the bungalow court) no longer lie across each other.
- **Small things.** A jump pressed while a card was open no longer fires when it closes; Escape, or a tap on
  the dark round the ending card, works like Keep wandering; a pinch no longer zooms the page on an iPhone;
  and the screen stays awake while you play.

## What came in v29

- **The cars are the car pack you sent.** The six parked on the block are its round little car, one in
  each of its six paints (yellow and red on Beach 20th, blue and green on the south curb of Central
  Avenue, pink and purple on the corner streets), toned to the block's light and drawn in its toon
  shading and ink. JR can stand on a hood or a roof, and a car stops him at its side, the way it is drawn.
  The lots past the boardwalk's ends, the lot at the burger corner and the six cars on the far boulevard
  are the same car, simplified for the distance (the burger corner's cars are on its lot now: they had
  stood inside the shops next to it). The pack's bus is not used: the Q113 stays.
- **The shark is the PS1 great white you sent.** Dennis is Jellypack's low-poly shark now: 141
  triangles and its own 128-pixel texture, nearest-filtered so its pixels show. It swims with its own
  tail swing, and its jaw drops for the bite. The fin's run, the leap, the CHOMP and the way back out to
  sea are as they were; the tip of its tail now rides out of the water behind the fin, as a shark's does.

## What came in v28

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

## Credits

- Cars: "Low Poly Pack Colorful Car and Bus Pack" by MHKstudio
  (https://sketchfab.com/3d-models/low-poly-pack-colorful-car-and-bus-pack-e8cf5eee9e204f38b09b8c5c6338792c),
  licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changed for the game: recoloured,
  re-shaded in the game's toon light with an ink outline, and simplified for the distant cars.
- Ice cream truck: "Low Poly Ice Cream Truck." by its_sagar_bro
  (https://sketchfab.com/3d-models/low-poly-ice-cream-truck-37ed6bca176049a0bfb5f88e15b612c4),
  licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changed for the game: scaled to
  stand as tall as the old truck, drawn in the game's toon light with an ink outline; the empty space
  between its texture's pieces filled in, so it does not show at their edges from far off.
- Shark: "PS1/Low Poly Great White Shark" by Jellypack
  (https://sketchfab.com/3d-models/ps1low-poly-great-white-shark-54b11fd3f157410faa7ab146d7fc5da5),
  licensed CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/), which does not allow
  commercial use. Changed for the game: turned and scaled to the game's shark, its jaw opened further for
  the bite, drawn in the game's toon light with an ink outline.
The game names all three at the foot of Totals.

## Notes

- The page carries a small test hook (`window.__PS_TEST`). It does nothing unless a test calls it.
- three.js is MIT licensed; its notice is at the top of `three.min.js`.
