Place of Sands — web build (v32)
Made in Brooklyn Games

What's here
  index.html        the whole game (one file, ~2.7 MB)
  three.min.js      Three.js r128, served locally; the page falls back to cdnjs/jsdelivr if it's missing
  strand-bill.js    what plays in the Strand (the movie house): a list of YouTube links or video files; empty = the newsreel
  music/theme.ogg   the score (Hess's "3.4_Beat", 64 bars at 80 bpm, Ogg Vorbis)
  music/theme.mp4   the same audio as AAC, for Safari before 18.4 (iPhone, iPad, Mac); the page picks the one the browser can play
  share.jpg         the picture a link to the game shows on X, iMessage, Slack and the like (1200 x 630)
  icon.png          JR, for the tab and a phone's home screen (180 x 180)

Hosting
  - Static files only: upload the whole folder (keep music/ with it) and link to index.html.
  - The link preview (the picture in iMessage, X, Slack) only shows once share.jpg is on the host beside
    index.html: the tags point at https://hessvacio.com/pages/place-of-sands/share.jpg. Uploading index.html alone gives a text-only preview, and
    the old score. Messaging apps cache a preview: after uploading, share the link with ?v=32 on the end once.
  - The share tags and the canonical link in index.html point at https://hessvacio.com/pages/place-of-sands/ — if the game lives at another
    address, change those lines in the <head>.
  - Serve over https. Phones need it for Web Audio, vibration and the wake lock; a controller needs it too.
  - If the host serves the page from inside another page (a site builder, an iframe), give the frame
    allow="gamepad; fullscreen; autoplay".
  - Saves live in the browser's localStorage, per address: a new address starts fresh.
  - Without music/ beside the page the old built-in score plays and nothing is said.

Notes
  - Touch: left thumb walks, right thumb looks; A jumps (twice for the second jump, hold to float), B acts.
  - Keys: WASD/arrows, Space, E. A controller works on a desktop browser (and on an Xbox's Edge): left stick
    walks, right stick looks, A jumps, B acts, Menu opens Totals. #check on the end of the address opens the
    Controller check; #stats shows the frame readout.
  - Fonts load from Google Fonts (Fraunces, Space Grotesk, Caveat, Barlow Condensed); offline, the game falls
    back to system fonts.
  - Totals has Take a picture (photo mode: drag to walk round JR, pinch to come in, Pose, the shutter; the
    picture goes to the phone's share sheet, or downloads), and the comfort rows: Left-handed, Look speed,
    Invert look. The ending card has Share the evening.

Credits (also in Totals)
  - Cars: "Low Poly Pack Colorful Car and Bus Pack" by MHKstudio, CC BY 4.0, recoloured and cut to lighter
    versions for distance.
  - Shark: "PS1/Low Poly Great White Shark" by Jellypack, CC BY-NC 4.0 (attribution, no commercial use):
    sketchfab.com/3d-models/ps1low-poly-great-white-shark-54b11fd3f157410faa7ab146d7fc5da5
  - Ice cream truck: "Low Poly Ice Cream Truck." by its_sagar_bro, CC BY 4.0, in the game's toon light with an ink
    outline: sketchfab.com/3d-models/low-poly-ice-cream-truck-37ed6bca176049a0bfb5f88e15b612c4
  - Three.js r128, MIT.
