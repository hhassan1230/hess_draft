PLACE OF SANDS  v47
for https://hessvacio.com/pages/place-of-sands/
Made in Brooklyn Games. Built 2026-10-26.


WHAT'S IN THE FOLDER

  index.html        the game: one page (v47)
  three.min.js      three.js r128, loaded from beside the page (cdnjs is the fallback)
  strand-bill.js    what plays at the Strand on Central Avenue (your three reels, see below)
  music/theme.ogg   the song, "3.4_Beat", for most browsers
  music/theme.mp4   the same song (AAC) for Safari before 18.4
  share.jpg         the link picture, 1200 x 630: JR on the sand at dusk, a lifeguard chair behind
  icon.png          the tab and home-screen icon, 180 x 180: his face
  README.txt        this


TO SWAP IT IN

  1. Replace everything in pages/place-of-sands/ with this folder's contents. Keep music/ as a
     folder; the page looks for music/theme.ogg and music/theme.mp4 beside it.
  2. Commit and push. The host has to serve the files as they are (GitHub Pages does).
  3. Open https://hessvacio.com/pages/place-of-sands/ and check the build number under the
     Made in Brooklyn Games tag on the title: it should say v47. If it still shows the old one,
     reload; GitHub Pages lets a browser keep a page for up to ten minutes.
  4. Link previews (iMessage, Slack, X, Discord) keep the old picture for a while. Share the
     address once with ?v=47 on the end to make them fetch the new one:
     https://hessvacio.com/pages/place-of-sands/?v=47
     (Facebook: its Sharing Debugger, "Scrape Again".)

  share.jpg and icon.png are new pictures, drawn from this build. To keep the ones you have up
  now, leave those two files out of the copy; nothing else depends on them.


THE STRAND'S BILL (strand-bill.js)

  The picture house plays, in order and round again: the Rockaway Newsreel (the game draws it),
  your two previews, "Subway Stop in VR" and "Potion Panic", then the feature, "Museum
  Multiverse" (the trailer). All three are your YouTube uploads. To change the bill, edit
  strand-bill.js (the notes at its top say how); the page itself does not need rebuilding.


WHAT'S NEW SINCE v41.1 (the last web folder)

  Dominoes at Hector's table under the Bodega's window: a real game with the neighbors, a
    lesson the first time, the table, tiles, cup and crate as models, the hands on the table
    from the deal (v45 to v45.2). v47: when the fourth at the table changes, the one leaving
    says his own goodbye, and the tiles are skipped when the table is out of view.
  Dancing with Marcus on the boards: a dance game to the song, three levels (v46, v46.1).
  The Barbershop Debate on Sonny's bench, Fresh Design, and Lil Dre's afternoons (v44 to v44.2).
  The title screen: the view over the block and the beach, the neighbors going about their
    day, nobody talking (v45.3).
  Pigeons: the low-poly pigeon from the Brooklyn and Koreatown walks up close, the voxel birds
    far off (v45.4).
  Your eight from the 24th: the camera and the windows; the firehouse, the bank and the post
    office; double dutch, the coins, the title's B-roll and the arcade (v42 to v42.2).
  Hats that fit, hands on what they hold, Marcus dancing with his arms (v42.3, v43); the sand
    fences fold under JR (v42.4).
  Lights down at the Strand on a TV and on a phone held on its side, and your three reels on
    its bill (v43.2, v43.3).
  Two polish passes, 74 fixes (v43.1, v43.4).


CREDITS

  Game: Made in Brooklyn Games (Hess Vacio).
  Song: "3.4_Beat" (2021) by Hess Vacio.
  Cars: "Low Poly Pack Colorful Car and Bus Pack" by MHKstudio (Sketchfab), CC BY 4.0;
    recoloured to the block's light.
  Shark: "PS1/Low Poly Great White Shark" by Jellypack, CC BY-NC 4.0 (no commercial use).
    https://sketchfab.com/3d-models/ps1low-poly-great-white-shark-54b11fd3f157410faa7ab146d7fc5da5
  Ice cream truck: "Low Poly Ice Cream Truck." by its_sagar_bro, CC BY 4.0.
    https://sketchfab.com/3d-models/low-poly-ice-cream-truck-37ed6bca176049a0bfb5f88e15b612c4
  Pigeons: "Low-poly pigeon" by TenderMeatPopsicle, CC BY 4.0.
  three.js r128: MIT licence, the three.js authors.

  The same credits are in the game, at the foot of Totals.
  CC BY 4.0:    https://creativecommons.org/licenses/by/4.0/
  CC BY-NC 4.0: https://creativecommons.org/licenses/by-nc/4.0/
  The shark's licence rules out commercial use: if the game is ever sold or monetized, that
  model has to go (the old shark is one build flag away).
