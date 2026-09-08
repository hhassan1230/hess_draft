#!/usr/bin/env node
// RAT CITY build — node build.js [--vendor]
// Assembles src/style.css + src/*.js into a single unminified index.html.
// Default: Three.js r128 from cdnjs (prototype / in-chat preview).
// --vendor: reference vendor/three.min.js instead (the competition build).
//           Put three.min.js (r128, global build) in vendor/ first.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const ORDER = ['config.js', 'sim.js', 'audio.js', 'render.js', 'ui.js', 'main.js'];
const vendor = process.argv.includes('--vendor');

const THREE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const threeTag = vendor
  ? `<script src="vendor/three.min.js"></script>`
  : `<!-- PROTOTYPE ONLY: competition build must use vendor/three.min.js (run: node build.js --vendor) -->\n<script src="${THREE_CDN}"></script>`;

let html = fs.readFileSync(path.join(SRC, 'index.template.html'), 'utf8');
html = html.replace('/* @@STYLE@@ */', fs.readFileSync(path.join(SRC, 'style.css'), 'utf8').trim());
html = html.replace('<!-- @@THREE@@ -->', threeTag);
const scripts = ORDER.map(f => {
  const code = fs.readFileSync(path.join(SRC, f), 'utf8').trim();
  return `<script>\n/* ======================= src/${f} ======================= */\n${code}\n</script>`;
}).join('\n\n');
html = html.replace('<!-- @@SCRIPTS@@ -->', scripts);

const out = path.join(__dirname, 'index.html');
fs.writeFileSync(out, html);
console.log(`built ${out} (${(html.length / 1024).toFixed(1)} KB) ${vendor ? '[vendor]' : '[cdn prototype]'}`);
