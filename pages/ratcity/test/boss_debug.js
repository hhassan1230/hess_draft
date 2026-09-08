const { CONFIG } = require('../src/config.js');
const { Sim } = require('../src/sim.js');
function lcg(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const g = Sim.createGame(lcg(1));
Sim.startRun(g);
const dt = 1/60;
// jump to a strong board: 2 L2 cats outer, trap L2 lamppost, bin scaffolding; night 10 with 5 liquid bags
g.piles.forEach(p => p.bags = 0); g.flying = [];
g.piles[0].bags = 2; g.piles[1].bags = 3; g.piles[2].bags = 2;
g.night = 10; g.unlocked = {cat:true, trap:true, bin:true};
g.piles[0].bags += 20;
Sim.place(g,'stoopRail','cat'); Sim.upgrade(g,'stoopRail');
Sim.place(g,'hydrant','cat'); Sim.upgrade(g,'hydrant');
Sim.place(g,'lamppost','trap'); Sim.upgrade(g,'lamppost');
Sim.place(g,'scaffolding','bin');
g.piles[0].bags = 2;
console.log('liquid', Sim.liquidBags(g), 'slots', g.slots.map(s=>s.tower && (s.tower.type+s.tower.level+(s.tower.radius||''))));
g.events.length=0;
Sim.nightfall(g);
let lastHp = 60, lastT=-1;
while (g.phase === 'night') {
  Sim.update(g, dt);
  for (const ev of g.events) {
    if (['bossEnter','bossStalk','grab','escape','bossEnrage','bossDeath','snap'].includes(ev.type) && (ev.type!=='grab' && ev.type!=='escape' && ev.type!=='snap' || ev.type==='snap' || (ev.type!=='snap' && ev.type && g.rats.find(r=>r.id===ev.ratId && r.type==='boss') || ev.type==='escape'&&ev.type)))
      console.log(g.t.toFixed(1), ev.type, ev.type==='grab'||ev.type==='escape' ? ev.type+' '+(ev.type) : '', JSON.stringify(ev).slice(0,90));
  }
  const b = g.rats.find(r=>r.type==='boss');
  if (b && b.hp !== lastHp && Math.floor(g.t) !== lastT) { lastT = Math.floor(g.t); lastHp=b.hp; console.log('   t', g.t.toFixed(0), 'boss hp', b.hp, 'state', b.state, 'pos', b.x.toFixed(1), b.z.toFixed(1)); }
  g.events.length=0;
}
console.log('result', g.phase, g.dawn, 'infest', g.infestation, 'boss', g.boss);
