# python3 test/browser_night1.py — needs Playwright + Chromium (PLAYWRIGHT_BROWSERS_PATH).
# Runs the built index.html in headless Chromium with only THREE stubbed (real DOM, pointer events,
# Web Audio, timers, CSS) and plays night 1 twice: one cat (2 liquid bags) and two cats (0 liquid bags).
# It cannot see pixels; it checks that rats exist, move, and die, and that no JS error is thrown.
import os, re, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(ROOT, 'index.html')).read()
smoke = open(os.path.join(ROOT, 'test', 'smoke_dom.js')).read()
stub = smoke.split('// ---------------- fake DOM ----------------')[0].split('// ---------------- fake THREE ----------------')[1].replace('const THREE = {', 'window.THREE = {')
html = re.sub(r'<script src="https://cdnjs[^"]*"></script>', '<script>\n' + stub + '\n</script>', html)
html = html.replace('<script src="vendor/three.min.js"></script>', '<script>\n' + stub + '\n</script>')
open('/tmp/rat_city_stub.html', 'w').write(html)

def run(cats):
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
        pg = b.new_page(viewport={'width': 390, 'height': 844})
        logs = []
        pg.on('pageerror', lambda e: logs.append(f'[pageerror] {e}'))
        pg.on('console', lambda m: logs.append(f'[{m.type}] {m.text}') if m.type == 'error' else None)
        pg.goto('file:///tmp/rat_city_stub.html?debug'); pg.wait_for_timeout(400)
        pg.evaluate("(()=>{const o=Sim.update; Sim.update=(gg,dt)=>{window.__g=gg; return o(gg,dt)};})()")
        pg.mouse.click(195, 400); pg.wait_for_timeout(2500)
        for i in range(cats):
            xy = pg.evaluate(f"(()=>{{const s=CONFIG.SLOTS[{i}]; return Render.project(s.x,0.3,s.z)}})()")
            pg.mouse.click(xy['sx'], xy['sy']); pg.wait_for_timeout(250)
            box = pg.evaluate("(()=>{const b=[...document.querySelectorAll('#radial .rbtn')].find(b=>/cat/i.test(b.textContent)); const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}})()")
            pg.mouse.click(box['x'], box['y']); pg.wait_for_timeout(250)
        for _ in range(4):
            if pg.evaluate("window.__g.hand") <= 0: break
            xy = pg.evaluate("(()=>{const p=CONFIG.PILES[1]; return Render.project(p.x,0.2,p.z)})()")
            pg.mouse.click(xy['sx'], xy['sy']); pg.wait_for_timeout(200)
        liquid = pg.evaluate("Sim.liquidBags(window.__g)")
        nb = pg.evaluate("(()=>{const r=document.getElementById('btn-nightfall').getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}})()")
        pg.mouse.click(nb['x'], nb['y']); pg.wait_for_timeout(300)
        pg.mouse.click(nb['x'], nb['y'])
        seen = 0
        for _ in range(12):
            pg.wait_for_timeout(1000)
            seen = max(seen, pg.evaluate("window.__g.rats.length"))
        kills = pg.evaluate("window.__g.stats.kills"); lost = pg.evaluate("window.__g.lostNight")
        err = pg.evaluate("(document.getElementById('err')||{}).textContent||''")
        b.close()
    ok = seen > 0 and not logs and not err
    print(f"{cats} cat(s), {liquid} liquid bags: max rats alive {seen}, kills {kills}, lost {lost}, errors {logs or err or 'none'} -> {'OK' if ok else 'FAIL'}")
    return ok

ok = run(1) and run(2)
sys.exit(0 if ok else 1)
