Place of Sands — web build (v21)

What's here
  index.html     the whole game (one file, ~2.2 MB)
  three.min.js   Three.js r128, served locally; the page falls back to cdnjs/jsdelivr if it's missing

Hosting
  - Static files only: upload the folder anywhere (Netlify, GitHub Pages, S3, your own server) and link to index.html.
  - Keep index.html and three.min.js in the same folder.
  - Serve over https. Phones need it for the Web Audio and vibration APIs, and it avoids mixed-content blocks on the font.
  - No build step, no server code, no special headers. Set a long cache time on three.min.js if you like.
  - Fonts load from Google Fonts (Alfa Slab One, Barlow Condensed). Offline it falls back to system fonts.
  - Saves live in the browser's localStorage under your domain. Different domain = fresh save.

Embedding on a page
  Give the page a mobile viewport and let the game own the screen:
    <iframe src="place-of-sands/index.html" style="width:100%;height:100vh;border:0" allow="autoplay; vibrate"></iframe>
  Or link to index.html directly — it's its own full-screen page.

Notes
  - gzip/brotli on the server cuts the 2.2 MB page to about 500 KB; most hosts do this by default.
  - The page has a tiny test hook (window.__PS_TEST) that only answers if something calls it; it does nothing on a normal visit.
