/* ============================================================================
   RAT CITY — src/render.js
   Temp assets, the Nintendo way: every creature is a handful of primitives so
   the mechanic can be judged before the art exists. Each entity type has ONE
   factory (makeRat, makeCat, makeBag ...). When final sprites land through
   assets/manifest.json, the factories change and nothing else does.

   Clarity system (GDD §9): thick black outlines via inverted hulls, flat
   palette, state = silhouette (level = size, trap timer = jaw angle, bin fill
   = bags above the rim, infestation = tags accumulating on the wall).
   ========================================================================== */

const Render = (() => {
  const C = CONFIG, P = PALETTE;
  const W = C.VIEW.W, H = C.VIEW.H;
  const VIEW_HALF_W = 4.3;             // world units visible left/right
  const CAM_TILT = 60 * Math.PI / 180;  // camera pitch below horizontal
  const LOOK_AT = { x: 0, y: 0, z: -1.2 };

  let renderer, scene, camera, camBase, raycaster, groundPlane;
  let ambient, sun, lamp, lampBulb;
  let shake = 0, clock = 0, mode = 'day';
  const light = { amb: 0.85, sun: 0.7, lamp: 0, tint: new THREE.Color('#ffffff') };
  const target = { amb: 0.85, sun: 0.7, lamp: 0, tint: new THREE.Color('#ffffff') };

  const mat = {};
  const geo = {};
  const slotViews = {};      // slotId -> { ring, prop, tower, key }
  const ratViews = new Map();
  const tokenViews = new Map();
  const flyViews = new Map();
  const pileBags = [[], [], []];
  const handBags = [];
  let pileRings = [];
  const facadeParts = [];
  let facadeArt = null;
  let pickup = [];           // bags waiting for the truck
  let truck = null, truckT = -1;
  let manhole = null, manholeCover = null, facadeFront = 0;
  const tags = [];           // graffiti planes
  let stormRats = [];
  let particles = [], rings = [];
  let sliceFx = null;
  const alerts = [];

  // ------------------------------------------------------------- helpers ---
  const col = h => new THREE.Color(h);
  function phong(hex) { return new THREE.MeshPhongMaterial({ color: col(hex), flatShading: true, specular: col('#000000'), shininess: 1 }); }
  function basic(hex, opts) { return new THREE.MeshBasicMaterial(Object.assign({ color: col(hex) }, opts || {})); }

  function outline(mesh, k) {
    const o = new THREE.Mesh(mesh.geometry, mat.hull);
    o.scale.setScalar(k || 1.08);
    mesh.add(o);
    return mesh;
  }
  function box(w, h, d, m, o) { const me = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); return o === false ? me : outline(me, o); }
  function sphere(r, m, ws, hs, o) { const me = new THREE.Mesh(new THREE.SphereGeometry(r, ws || 7, hs || 5), m); return o === false ? me : outline(me, o); }
  function cone(r, h, m, seg, o) { const me = new THREE.Mesh(new THREE.ConeGeometry(r, h, seg || 6), m); return o === false ? me : outline(me, o); }
  function cyl(rt, rb, h, m, seg, o) { const me = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 8), m); return o === false ? me : outline(me, o); }
  function at(obj, x, y, z) { obj.position.set(x, y, z); return obj; }

  function makePool(factory) {
    const free = [];
    return {
      get() { const m = free.pop() || factory(); m.visible = true; if (!m.parent) scene.add(m); return m; },
      release(m) { m.visible = false; free.push(m); },
    };
  }
  let pools = {};

  // ------------------------------------------------- final-art pipeline ---
  // Sprites drop in by filename: assets/<id>.png. Anything missing (or any
  // load failure, e.g. file:// texture restrictions) keeps its low-poly
  // stand-in, so partial art can never break the build. mode 'flat' lies on
  // the ground and rotates with heading (draw the subject top-down, facing
  // the TOP of the canvas); mode 'up' stands and faces the camera (draw a
  // front view, facing RIGHT when direction matters). w = world width.
  const ART_IDS = {
    rat_scout: { mode: 'flat', w: 0.95 },
    rat_fat: { mode: 'flat', w: 0.95 },
    rat_boss: { mode: 'flat', w: 1.05 },
    cat_l1: { mode: 'up', w: 1.05 },
    cat_l2: { mode: 'up', w: 1.05 },
    bag: { mode: 'up', w: 0.66 },
    trap_armed: { mode: 'flat', w: 0.74 },
    trap_sprung: { mode: 'flat', w: 0.74 },
    bin: { mode: 'up', w: 0.95 },
    token: { mode: 'up', w: 0.42 },
    truck: { mode: 'up', w: 3.4 },
    pizza_slice: { mode: 'up', w: 0.8 },
    facade: { mode: 'up', w: 9.2 },
    prop_hydrant: { mode: 'up', w: 0.62 },
    prop_lamppost: { mode: 'up', w: 1.1 },
    prop_stoop: { mode: 'up', w: 1.5 },
    prop_scaffolding: { mode: 'up', w: 1.7 },
    tag: { mode: 'up', w: 1.0 },
  };
  const art = {};
  function loadArt() {
    if (!THREE.TextureLoader) return;
    const loader = new THREE.TextureLoader();
    Object.keys(ART_IDS).forEach(id => {
      loader.load('assets/' + id + '.png',
        tex => { const im = tex.image || {}; art[id] = { tex, aspect: (im.height || 1) / (im.width || 1) }; },
        undefined, () => {});
    });
  }
  // Dress a live group in its final art: hide the low-poly parts (keeps stay),
  // add one textured plane. Re-checked each frame until the texture arrives.
  function applyArt(group, id, keeps, scl) {
    const u = group.userData;
    if (u.artDone) return true;
    const a = art[id];
    if (!a) return false;
    const spec = ART_IDS[id];
    const w = spec.w, h = w * a.aspect;
    const geo2 = new THREE.PlaneGeometry(w, h);
    const m = new THREE.Mesh(geo2, new THREE.MeshBasicMaterial({ map: a.tex, transparent: true, alphaTest: 0.3 }));
    if (spec.mode === 'flat') { m.rotation.x = -Math.PI / 2; m.rotation.z = Math.PI; m.position.y = 0.045; }
    else { geo2.translate(0, h / 2, 0); m.rotation.x = -CAM_TILT; m.position.y = 0.02; m.position.z = 0.01; }
    if (scl) m.scale.setScalar(scl);
    const keep = new Set(keeps || []);
    for (const c of group.children) if (!keep.has(c)) c.visible = false;
    group.add(m);
    u.artDone = true; u.artMesh = m;
    return true;
  }

  // ------------------------------------------------------------ factories ---
  function makeBag(mini) {
    const s = mini ? 0.55 : 1;
    const g = new THREE.Group();
    const body = new THREE.Mesh(geo.bag, mat.bag); outline(body, 1.1);
    body.scale.set(s, s * 0.85, s); body.position.y = 0.26 * s;
    g.add(body);
    const knot = cone(0.07 * s, 0.14 * s, mat.ink, 5, false); knot.position.y = 0.52 * s; g.add(knot);
    g.userData = { body, land: 0 };
    return g;
  }

  function makeToken() {
    const g = new THREE.Group();
    const coin = new THREE.Mesh(geo.coin, mat.bone); outline(coin, 1.12);
    coin.rotation.z = Math.PI / 2;
    const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.07, 8), mat.ink); dot.rotation.z = Math.PI / 2;
    g.add(coin); g.add(dot);
    const shadow = new THREE.Mesh(geo.shadow, mat.shadow); shadow.rotation.x = -Math.PI / 2; shadow.scale.setScalar(0.4); g.add(shadow);
    g.userData = { coin, shadow, roll: 0 };
    return g;
  }

  function makeRat(type) {
    const R = C.RATS[type];
    const m = type === 'boss' ? mat.ratDeep : mat.rat;
    const g = new THREE.Group();
    const body = sphere(0.27, m, 7, 5, 1.1); body.scale.set(1, 0.72, 1.45); body.position.y = 0.24; g.add(body);
    const nose = cone(0.1, 0.26, m, 5, 1.15); nose.rotation.x = Math.PI / 2; at(nose, 0, 0.24, 0.5); g.add(nose);
    const earL = sphere(0.075, m, 5, 4, 1.15); at(earL, -0.13, 0.42, 0.26); g.add(earL);
    const earR = sphere(0.075, m, 5, 4, 1.15); at(earR, 0.13, 0.42, 0.26); g.add(earR);
    const eyeL = sphere(0.035, mat.ink, 4, 3, false); at(eyeL, -0.09, 0.34, 0.44); g.add(eyeL);
    const eyeR = sphere(0.035, mat.ink, 4, 3, false); at(eyeR, 0.09, 0.34, 0.44); g.add(eyeR);
    const tail = cone(0.045, 0.62, m, 4, 1.25); tail.rotation.x = -Math.PI / 2 + 0.45; at(tail, 0, 0.16, -0.62); g.add(tail);
    const shadow = new THREE.Mesh(geo.shadow, mat.shadow); shadow.rotation.x = -Math.PI / 2; shadow.scale.setScalar(0.75); g.add(shadow);
    const bags = [];
    for (let i = 0; i < 3; i++) { const b = makeBag(true); at(b, (i - 1) * 0.22, 0.42, -0.1 - (i % 2) * 0.1); b.visible = false; g.add(b); bags.push(b); }
    let crown = null, slice = null;
    if (type === 'boss') {
      crown = new THREE.Group();
      for (let i = 0; i < 3; i++) { const c = cone(0.06, 0.16, mat.bag, 4, false); at(c, (i - 1) * 0.11, 0.58, 0.2); crown.add(c); }
      g.add(crown);
      slice = new THREE.Mesh(geo.slice, mat.bag); outline(slice, 1.1);
      slice.rotation.set(0, 0, 0.3); at(slice, 0.5, 0.45, 0.1);
      g.add(slice);
    }
    g.scale.setScalar(R.size);
    g.userData = { type, body, nose, eyeL, eyeR, tail, bags, shadow, crown, slice, hitT: 0, flashT: 0, phase: Math.random() * 6 };
    return g;
  }

  function makeCat(level) {
    const m = level === 2 ? mat.tealL2 : mat.teal;
    const g = new THREE.Group();
    const body = box(0.82, 0.48, 0.5, m); body.position.y = 0.4; g.add(body);
    const head = box(0.46, 0.42, 0.42, m); at(head, 0, 0.72, 0.36); g.add(head);
    const earL = cone(0.1, 0.2, m, 4); at(earL, -0.16, 1.0, 0.36); g.add(earL);
    const earR = cone(0.1, 0.2, m, 4); at(earR, 0.16, 1.0, 0.36); g.add(earR);
    const eyeL = sphere(0.05, mat.ink, 4, 3, false); at(eyeL, -0.12, 0.76, 0.58); g.add(eyeL);
    const eyeR = sphere(0.05, mat.ink, 4, 3, false); at(eyeR, 0.12, 0.76, 0.58); g.add(eyeR);
    const nose = sphere(0.035, mat.ink, 4, 3, false); at(nose, 0, 0.66, 0.6); g.add(nose);
    const tail = cone(0.06, 0.6, m, 4, 1.2); tail.rotation.x = -Math.PI / 2 + 1.0; at(tail, 0, 0.55, -0.5); g.add(tail);
    const shadow = new THREE.Mesh(geo.shadow, mat.shadow); shadow.rotation.x = -Math.PI / 2; shadow.scale.setScalar(1.05); g.add(shadow);
    const s = level === 2 ? 1.4 : 1.0;   // Chonky: +40% size. Level = size, period.
    g.scale.setScalar(s);
    g.userData = { kind: 'cat', level, tail, swatT: 0, baseScale: s, homeX: 0, homeZ: 0, shadowRef: shadow };
    return g;
  }

  function makeTrap(level) {
    const m = level === 2 ? mat.tealL2 : mat.teal;
    const g = new THREE.Group();
    const base = box(0.74, 0.08, 0.6, m); base.position.y = 0.04; g.add(base);
    const jawGeoA = new THREE.BoxGeometry(0.68, 0.05, 0.27); jawGeoA.translate(0, 0, 0.14);
    const jawGeoB = new THREE.BoxGeometry(0.68, 0.05, 0.27); jawGeoB.translate(0, 0, -0.14);
    const jawA = outline(new THREE.Mesh(jawGeoA, m), 1.06); jawA.position.y = 0.1; g.add(jawA);
    const jawB = outline(new THREE.Mesh(jawGeoB, m), 1.06); jawB.position.y = 0.1; g.add(jawB);
    const bait = box(0.11, 0.11, 0.11, mat.bone); at(bait, 0, 0.16, 0); g.add(bait);
    g.userData = { kind: 'trap', level, jawA, jawB, angle: 1.1, dust: 0 };
    return g;
  }

  function makeBin(level) {
    const m = level === 2 ? mat.tealL2 : mat.teal;
    const h = level === 2 ? 0.92 : 0.72;
    const g = new THREE.Group();
    const body = box(0.64, h, 0.64, m); body.position.y = h / 2; g.add(body);
    const lidGeo = new THREE.BoxGeometry(0.7, 0.06, 0.7); lidGeo.translate(0, 0, 0.35);
    const lid = outline(new THREE.Mesh(lidGeo, m), 1.06); at(lid, 0, h + 0.03, -0.35); lid.rotation.x = -1.25; g.add(lid);
    if (level === 2) { const lock = box(0.16, 0.16, 0.08, mat.ink, false); at(lock, 0, 0.14, 0.72); lid.add(lock); }
    const bags = [];
    for (let i = 0; i < 7; i++) { const b = makeBag(true); const cx = (i % 2) * 0.28 - 0.14, row = Math.floor(i / 2); at(b, cx, 0.12 + row * 0.24 + (level === 2 ? 0.1 : 0), (i % 2 ? -0.1 : 0.08)); b.visible = false; g.add(b); bags.push(b); }
    g.userData = { kind: 'bin', level, lid, bags, bump: 0 };
    return g;
  }

  function makeTruck() {
    const g = new THREE.Group();
    const body = box(2.4, 1.2, 1.05, mat.bag); at(body, -0.3, 0.9, 0); g.add(body);
    const cab = box(0.9, 0.85, 1.0, mat.bag); at(cab, 1.35, 0.72, 0); g.add(cab);
    const win = box(0.3, 0.35, 0.8, mat.ink, false); at(win, 1.7, 0.85, 0); g.add(win);
    for (const [x, z] of [[-1.0, 0.5], [-1.0, -0.5], [1.1, 0.5], [1.1, -0.5]]) { const w = cyl(0.26, 0.26, 0.2, mat.ink, 8, false); w.rotation.x = Math.PI / 2; at(w, x, 0.26, z); g.add(w); }
    const badge = box(0.8, 0.5, 0.02, mat.bone, false); at(badge, -0.3, 0.95, 0.54); g.add(badge);
    g.visible = false;
    return g;
  }

  function makeParticle() { const m = new THREE.Mesh(geo.chip, mat.rat); m.visible = false; return m; }
  function makeRing() { const m = new THREE.Mesh(geo.ring, mat.ringFx.clone()); m.rotation.x = -Math.PI / 2; m.visible = false; return m; }

  // ---------------------------------------------------------------- board ---
  function buildBoard() {
    // sidewalk (bone white) with paving seams, road below the curb
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 40), mat.bone.clone()); ground.rotation.x = -Math.PI / 2; at(ground, 0, -0.02, -4); scene.add(ground);
    const road = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), mat.boneShade); road.rotation.x = -Math.PI / 2; at(road, 0, -0.01, C.BOARD.curbZ + 4); scene.add(road);
    const curb = new THREE.Mesh(new THREE.BoxGeometry(20, 0.08, 0.1), mat.ink); at(curb, 0, 0.03, C.BOARD.curbZ); scene.add(curb);
    for (let z = -8; z <= 1.6; z += 2.4) { const seam = new THREE.Mesh(new THREE.PlaneGeometry(20, 0.03), mat.boneShade); seam.rotation.x = -Math.PI / 2; at(seam, 0, 0.0, z); scene.add(seam); }
    for (let x = -4; x <= 4; x += 2) { const seam = new THREE.Mesh(new THREE.PlaneGeometry(0.03, 14), mat.boneShade); seam.rotation.x = -Math.PI / 2; at(seam, x, 0.0, -4); scene.add(seam); }

    // facade wall along the top: the alley is the gap on the right
    facadeFront = -9.8;
    const wallH = 3.0;
    const left = new THREE.Mesh(new THREE.BoxGeometry(7.2, wallH, 1.6), mat.wall); at(left, -1.0, wallH / 2, facadeFront - 0.8); scene.add(left); facadeParts.push(left);
    const right = new THREE.Mesh(new THREE.BoxGeometry(1.4, wallH, 1.6), mat.wall); at(right, 4.3, wallH / 2, facadeFront - 0.8); scene.add(right); facadeParts.push(right);
    for (let x = -4.0; x < 2.4; x += 1.05) for (let y = 0.9; y < 2.7; y += 1.0) { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.6), mat.window); at(w, x, y, facadeFront + 0.01); scene.add(w); facadeParts.push(w); }
    const alleyFloor = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 3), mat.ink); alleyFloor.rotation.x = -Math.PI / 2; at(alleyFloor, 3.1, 0.005, facadeFront - 0.5); scene.add(alleyFloor);

    // sidewalk grate (left), manhole (center)
    const grate = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 0.8), mat.ink); at(grate, -3.0, 0.02, -9.0); scene.add(grate);
    for (let i = 0; i < 5; i++) { const slit = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.6), mat.boneShade); slit.rotation.x = -Math.PI / 2; at(slit, -3.4 + i * 0.2, 0.06, -9.0); scene.add(slit); }
    manhole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.04, 12), mat.ink); at(manhole, 0, 0.01, -7.9); scene.add(manhole);
    manholeCover = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.07, 12), mat.wall); outline(manholeCover, 1.06); at(manholeCover, 0, 0.05, -7.9); scene.add(manholeCover);

    // piles: a shaded patch and an ink ring where trash goes
    C.PILES.forEach(p => {
      const patch = new THREE.Mesh(new THREE.CircleGeometry(0.8, 14), mat.boneShade); patch.rotation.x = -Math.PI / 2; at(patch, p.x, 0.003, p.z); scene.add(patch);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.74, 0.8, 24), mat.pileRing.clone()); ring.rotation.x = -Math.PI / 2; at(ring, p.x, 0.004, p.z); scene.add(ring);
      pileRings.push(ring);
    });

    // slots: sidewalk furniture behind each slot so the names read, plus a teal ring
    C.SLOTS.forEach(s => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.6, 28), mat.slotRing.clone()); ring.rotation.x = -Math.PI / 2; at(ring, s.x, 0.006, s.z); scene.add(ring);
      const prop = new THREE.Group();
      if (s.id === 'stoopRail') {
        for (let i = -1; i <= 1; i++) { const post = cyl(0.03, 0.03, 0.9, mat.ink, 5, false); at(post, i * 0.34, 0.45, 0); prop.add(post); }
        const bar = box(0.8, 0.05, 0.05, mat.ink, false); at(bar, 0, 0.9, 0); prop.add(bar);
        const step = box(1.1, 0.16, 0.5, mat.boneShade, false); at(step, 0, 0.08, -0.4); prop.add(step);
        at(prop, s.x - 0.1, 0, s.z - 0.85);
      } else if (s.id === 'hydrant') {
        const body = cyl(0.14, 0.17, 0.62, mat.ink, 8, false); at(body, 0, 0.31, 0); prop.add(body);
        const cap = sphere(0.16, mat.bone, 6, 4, false); at(cap, 0, 0.66, 0); prop.add(cap);
        const nub = cyl(0.06, 0.06, 0.16, mat.bone, 6, false); nub.rotation.z = Math.PI / 2; at(nub, 0.2, 0.42, 0); prop.add(nub);
        at(prop, s.x + 0.15, 0, s.z - 0.85);
      } else if (s.id === 'lamppost') {
        const pole = cyl(0.05, 0.08, 3.4, mat.ink, 6, false); at(pole, 0, 1.7, 0); prop.add(pole);
        lampBulb = sphere(0.18, mat.bulb, 8, 6, false); at(lampBulb, 0, 3.45, 0); prop.add(lampBulb);
        lamp = new THREE.PointLight(col(P.bagYellow), 0, 7); at(lamp, 0, 3.2, 0.5); prop.add(lamp);
        at(prop, s.x - 0.45, 0, s.z - 0.6);
      } else if (s.id === 'scaffolding') {
        for (const x of [-0.55, 0.55]) { const pole = cyl(0.04, 0.04, 2.4, mat.ink, 5, false); at(pole, x, 1.2, 0); prop.add(pole); }
        const bar = box(1.2, 0.05, 0.05, mat.ink, false); at(bar, 0, 2.35, 0); prop.add(bar);
        const plank = box(1.25, 0.06, 0.4, mat.boneShade, false); at(plank, 0, 1.3, 0); prop.add(plank);
        const brace = box(0.05, 0.05, 1.4, mat.ink, false); brace.rotation.y = 0.9; at(brace, 0, 0.7, 0); prop.add(brace);
        at(prop, s.x + 0.2, 0, s.z - 0.75);
      }
      scene.add(prop);
      slotViews[s.id] = { ring, prop, tower: null, key: null, x: s.x, z: s.z };
    });

    truck = makeTruck(); scene.add(truck);
  }

  // ----------------------------------------------------------------- init ---
  function init(canvas) {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);
    scene = new THREE.Scene();
    scene.background = col(P.boneWhite);

    const halfW = VIEW_HALF_W, halfH = halfW * H / W;
    camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 100);
    const d = 30;
    camBase = new THREE.Vector3(LOOK_AT.x, LOOK_AT.y + d * Math.sin(CAM_TILT), LOOK_AT.z + d * Math.cos(CAM_TILT));
    camera.position.copy(camBase);
    camera.lookAt(new THREE.Vector3(LOOK_AT.x, LOOK_AT.y, LOOK_AT.z));
    camera.updateMatrixWorld();
    raycaster = new THREE.Raycaster();
    groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    ambient = new THREE.AmbientLight(0xffffff, light.amb); scene.add(ambient);
    sun = new THREE.DirectionalLight(0xffffff, light.sun); sun.position.set(-4, 9, 5); scene.add(sun);

    // materials — the five tokens, plus ink and a wall shade
    mat.bag = phong(P.bagYellow);
    mat.rat = phong(P.ratPlum);
    mat.ratDeep = phong(P.ratPlumDeep);
    mat.teal = phong(P.towerTeal);
    mat.tealL2 = phong(P.towerTealL2);
    mat.bone = phong(P.boneWhite);
    mat.boneShade = basic(P.boneShade);
    mat.hull = basic(P.ink, { side: THREE.BackSide });
    mat.ink = basic(P.ink);
    mat.wall = phong('#2B2628');
    mat.window = basic('#3F3839');
    mat.bulb = new THREE.MeshPhongMaterial({ color: col(P.bagYellow), emissive: col(P.bagYellow), emissiveIntensity: 0, flatShading: true });
    mat.shadow = basic(P.ink, { transparent: true, opacity: 0.16, depthWrite: false });
    mat.slotRing = basic(P.towerTeal, { transparent: true, opacity: 0.55, depthWrite: false });
    mat.ringFx = basic(P.boneWhite, { transparent: true, opacity: 0.9, depthWrite: false });
    mat.tag = basic(P.dangerRed);
    mat.pileRing = basic(P.ink, { transparent: true, opacity: 1, depthWrite: false });
    mat.bagAlert = phong(P.dangerRed);
    mat.bagAlert.emissive = col(P.dangerRed); mat.bagAlert.emissiveIntensity = 0.5;

    geo.bag = new THREE.DodecahedronGeometry(0.28, 0);
    geo.coin = new THREE.CylinderGeometry(0.18, 0.18, 0.06, 10);
    geo.shadow = new THREE.CircleGeometry(0.42, 12);
    geo.chip = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    geo.ring = new THREE.RingGeometry(0.3, 0.42, 20);
    geo.slice = new THREE.CylinderGeometry(0.38, 0.38, 0.09, 3);

    pools = {
      scout: makePool(() => makeRat('scout')),
      fat: makePool(() => makeRat('fat')),
      boss: makePool(() => makeRat('boss')),
      token: makePool(makeToken),
      bag: makePool(() => makeBag(false)),
      particle: makePool(makeParticle),
      ring: makePool(makeRing),
    };
    buildBoard();
    // pre-warm pools so the first wave never hitches
    const warm = []; for (let i = 0; i < 24; i++) warm.push(pools.scout.get()); warm.forEach(m => pools.scout.release(m));
    const warm2 = []; for (let i = 0; i < 12; i++) warm2.push(pools.token.get()); warm2.forEach(m => pools.token.release(m));
    loadArt();
    setMode('day', true);
  }

  function reset() {
    for (const [, m] of ratViews) pools[m.userData.type].release(m); ratViews.clear();
    for (const [, m] of tokenViews) pools.token.release(m); tokenViews.clear();
    for (const [, m] of flyViews) pools.bag.release(m); flyViews.clear();
    pileBags.forEach(list => { list.forEach(b => pools.bag.release(b)); list.length = 0; });
    handBags.forEach(b => pools.bag.release(b)); handBags.length = 0;
    pickup.forEach(p => pools.bag.release(p.mesh)); pickup = [];
    stormRats.forEach(m => pools[m.userData.type].release(m)); stormRats = [];
    tags.forEach(t => scene.remove(t)); tags.length = 0;
    for (const id in slotViews) { const v = slotViews[id]; if (v.tower) scene.remove(v.tower); v.tower = null; v.key = null; }
    truck.visible = false; truckT = -1; shake = 0;
    manholeCover.position.set(0, 0.05, -7.9); manholeCover.rotation.set(0, 0, 0);
    scene.background = col(P.boneWhite);
    setMode('day', true);
  }

  function setMode(m, instant) {
    mode = m;
    if (m === 'day') { target.amb = 0.85; target.sun = 0.7; target.lamp = 0; target.tint.set('#ffffff'); }
    else if (m === 'night') { target.amb = 0.42; target.sun = 0.3; target.lamp = 1.4; target.tint.set('#B8BEE0'); }
    else if (m === 'storm') { target.amb = 0.03; target.sun = 0.0; target.lamp = 0; target.tint.set('#6A5F8A'); }
    if (instant) { light.amb = target.amb; light.sun = target.sun; light.lamp = target.lamp; light.tint.copy(target.tint); applyLight(); }
  }
  function applyLight() {
    ambient.intensity = light.amb; ambient.color.copy(light.tint);
    sun.intensity = light.sun;
    if (lamp) { lamp.intensity = light.lamp; mat.bulb.emissiveIntensity = light.lamp * 0.8; }
    scene.background.copy(col(P.boneWhite)).multiply(light.tint).multiplyScalar(0.55 + 0.45 * Math.min(1, light.amb / 0.85 + 0.1));
  }

  // ----------------------------------------------------------- projection ---
  const _v = new THREE.Vector3(), _hit = new THREE.Vector3(), _ndc = new THREE.Vector2();
  function project(x, y, z) {
    _v.set(x, y, z).project(camera);
    return { sx: (_v.x + 1) / 2 * W, sy: (1 - _v.y) / 2 * H };
  }
  function unproject(sx, sy) {
    const saved = camera.position.clone();
    camera.position.copy(camBase); camera.updateMatrixWorld();
    _ndc.set(sx / W * 2 - 1, -(sy / H * 2 - 1));
    raycaster.setFromCamera(_ndc, camera);
    const ok = raycaster.ray.intersectPlane(groundPlane, _hit);
    camera.position.copy(saved); camera.updateMatrixWorld();
    return ok ? { x: _hit.x, z: _hit.z } : null;
  }

  // ------------------------------------------------------------------ fx ---
  function burst(x, y, z, m, n, spread) {
    for (let i = 0; i < n; i++) {
      const p = pools.particle.get(); p.material = m;
      p.position.set(x, y, z);
      p.userData.v = new THREE.Vector3((Math.random() - 0.5) * (spread || 4), 2 + Math.random() * 3, (Math.random() - 0.5) * (spread || 4));
      p.userData.life = 0.55 + Math.random() * 0.3; p.userData.age = 0;
      p.scale.setScalar(0.6 + Math.random() * 0.8);
      particles.push(p);
    }
  }
  function ringFx(x, z, hex, size, dur) {
    const r = pools.ring.get(); r.position.set(x, 0.04, z); r.material.color.set(hex || P.boneWhite); r.material.opacity = 0.9;
    r.userData = { age: 0, dur: dur || 0.35, size: size || 1.6 }; r.scale.setScalar(0.3); rings.push(r);
  }
  function addTag(count) {
    for (let i = 0; i < count; i++) {
      const w = 0.35 + Math.random() * 0.6, h = 0.12 + Math.random() * 0.22;
      const t = art.tag
        ? new THREE.Mesh(new THREE.PlaneGeometry(w * 1.6, w * 1.6 * art.tag.aspect), new THREE.MeshBasicMaterial({ map: art.tag.tex, transparent: true, alphaTest: 0.1 }))
        : new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat.tag);
      at(t, -4.2 + Math.random() * 6.4, 0.35 + Math.random() * 2.1, facadeFront + 0.03);
      t.rotation.z = (Math.random() - 0.5) * 0.8;
      t.userData.pop = 0.25;
      scene.add(t); tags.push(t);
    }
  }

  function handleEvent(ev, g) {
    switch (ev.type) {
      case 'nightfall': setMode('night'); break;
      case 'nightClear': setMode('day'); break;
      case 'storm': setMode('storm'); startStorm(); shake = 0.5; break;
      case 'swat': { const v = slotViews[ev.slotId]; if (v && v.tower) v.tower.userData.swatT = 0.26; const rm = ratViews.get(ev.ratId); if (rm) rm.userData.hitT = 0.14; ringFx(ev.x, ev.z, P.boneWhite, 1.1, 0.22); break; }
      case 'snap': { const v = slotViews[ev.slotId]; if (v && v.tower) { v.tower.userData.angle = 0; v.tower.userData.dust = 0.3; } burst(ev.x, 0.2, ev.z, mat.bone, 6, 3); ringFx(ev.x, ev.z, P.boneWhite, 1.3, 0.25); const rm = ratViews.get(ev.ratId); if (rm) rm.userData.hitT = 0.14; break; }
      case 'hit': { const rm = ratViews.get(ev.ratId); if (rm) rm.userData.hitT = 0.12; break; }
      case 'death': { burst(ev.x, 0.3, ev.z, ev.rat === 'boss' ? mat.ratDeep : mat.rat, ev.rat === 'boss' ? 26 : ev.rat === 'fat' ? 12 : 8, ev.rat === 'boss' ? 7 : 4); ringFx(ev.x, ev.z, P.boneWhite, ev.rat === 'boss' ? 4 : 1.8, 0.4); break; }
      case 'grab': { const rm = ratViews.get(ev.ratId); if (rm) { rm.userData.flashT = 0.5; } shake = Math.max(shake, 0.22); ringFx(ev.x, ev.z, P.dangerRed, 1.6, 0.35); break; }
      case 'escape': shake = Math.max(shake, 0.28); addTag(ev.bags); break;
      case 'marked': { shake = 0.55; addTag(3); const x = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.22), mat.tag); at(x, -1, 1.6, facadeFront + 0.04); x.rotation.z = 0.35; x.userData.pop = 0.3; scene.add(x); tags.push(x); const x2 = x.clone(); x2.rotation.z = -0.35; scene.add(x2); tags.push(x2); break; }
      case 'place': { ringFx(ev.x, ev.z, P.towerTeal, 1.6, 0.35); burst(ev.x, 0.4, ev.z, mat.bone, 5, 2); break; }
      case 'upgrade': { ringFx(ev.x, ev.z, P.towerTealL2, 2.4, 0.45); burst(ev.x, 0.6, ev.z, mat.tealL2, 10, 3); break; }
      case 'sell': ringFx(ev.x, ev.z, P.boneWhite, 1.4, 0.3); break;
      case 'stash': case 'unload': { const v = slotViews[ev.slotId]; if (v && v.tower) v.tower.userData.bump = 0.2; break; }
      case 'rearm': { const v = slotViews[ev.slotId]; if (v && v.tower) { v.tower.userData.angle = 1.1; if (!ev.free) ringFx(ev.x, ev.z, P.bagYellow, 1.2, 0.25); } break; }
      case 'denied': { const v = slotViews[ev.slotId]; if (v && v.tower) v.tower.userData.deny = 0.3; break; }
      case 'tokenGrab': { ringFx(ev.x, ev.z, P.bagYellow, 1.0, 0.25); burst(ev.x, 0.3, ev.z, mat.bone, 4, 2); break; }
      case 'lunge': shake = Math.max(shake, 0.15); break;
      case 'nearMiss': ringFx(ev.x, ev.z, P.towerTeal, 2.0, 0.45); break;
      case 'recover': ringFx(ev.x, ev.z, P.towerTeal, 1.5, 0.35); burst(ev.x, 0.35, ev.z, mat.bag, 5, 3); shake = Math.max(shake, 0.1); break;
      case 'placeBag': ringFx(ev.x, ev.z, P.bagYellow, 1.0, 0.22); break;
      case 'bank': { // hand the pile bags to the truck
        pileBags.forEach((list, i) => { list.forEach(b => pickup.push({ mesh: b, x: C.PILES[i].x, t: -1 })); list.length = 0; });
        truck.visible = true; truckT = 0; truck.position.set(-8, 0, C.BOARD.curbZ + 1.1);
        break; }
      case 'bossEnter': shake = Math.max(shake, 0.6); ringFx(ev.x, ev.z, P.ratPlumDeep, 3.5, 0.6); break;
      case 'bossEnrage': { shake = 0.7; const rm = ratViews.get(ev.ratId); if (rm) { rm.userData.enraged = true; } burst(ev.x, 0.6, ev.z, mat.ratDeep, 14, 6); break; }
      case 'bossDeath': { shake = 0.9; sliceFx = { x: ev.x, z: ev.z, t: 0 }; break; }
      case 'run': reset(); break;
    }
  }

  function startStorm() {
    for (let i = 0; i < 44; i++) {
      const m = pools[i % 5 === 0 ? 'fat' : 'scout'].get();
      m.position.set((Math.random() - 0.5) * 9, 0, -10.5 + Math.random() * 3);
      m.rotation.y = 0;
      m.userData.vx = (Math.random() - 0.5) * 2.5; m.userData.vz = 4 + Math.random() * 5; m.userData.delay = Math.random() * 1.2;
      m.visible = false;
      stormRats.push(m);
    }
  }

  // ---------------------------------------------------------------- sync ---
  function syncTowers(g, dt) {
    for (const s of g.slots) {
      const v = slotViews[s.id];
      const key = s.tower ? s.tower.type + s.tower.level : null;
      if (key !== v.key) {
        if (v.tower) scene.remove(v.tower);
        v.tower = null; v.key = key;
        if (s.tower) {
          v.tower = s.tower.type === 'cat' ? makeCat(s.tower.level) : s.tower.type === 'trap' ? makeTrap(s.tower.level) : makeBin(s.tower.level);
          v.tower.position.set(s.x, 0, s.z);
          v.tower.userData.pop = 0.35;
          scene.add(v.tower);
        }
      }
      // slot ring: pulse in day when something is affordable, hide under towers
      const affordable = g.phase === 'day' && !s.tower && Sim.slotOptions(g, s).some(o => o.ok);
      v.ring.visible = !s.tower;
      v.ring.material.opacity = affordable ? 0.55 + 0.35 * Math.sin(clock * 5) : 0.28;
      v.ring.scale.setScalar(affordable ? 1 + 0.08 * Math.sin(clock * 5) : 1);
      if (!v.tower) continue;
      const u = v.tower.userData, t = s.tower;
      if (u.kind === 'cat') applyArt(v.tower, (t.level === 2 && art.cat_l2) ? 'cat_l2' : 'cat_l1', [u.shadowRef].filter(Boolean));
      else if (u.kind === 'trap') applyArt(v.tower, 'trap_armed', []);
      else if (u.kind === 'bin') applyArt(v.tower, 'bin', u.bags);
      if (u.pop > 0) { u.pop -= dt; const k = 1 - u.pop / 0.35; v.tower.scale.setScalar((u.baseScale || 1) * (0.6 + 0.4 * Math.sin(Math.min(1, k) * Math.PI * 0.5) + (k < 0.6 ? 0.25 * Math.sin(k * Math.PI / 0.6) : 0))); }
      if (u.kind === 'cat') {
        let x = s.x, z = s.z;
        if (t.lunge) {
          const L = t.lunge, k = L.t / L.dur;
          const a = k < 0.4 ? k / 0.4 : k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4;
          const e = a * a * (3 - 2 * a);
          x = s.x + (L.x - s.x) * e; z = s.z + (L.z - s.z) * e;
          v.tower.position.y = Math.sin(Math.min(1, a) * Math.PI) * 0.6;
        } else v.tower.position.y = 0;
        v.tower.rotation.y = u.artDone ? 0 : t.face;
        if (u.artDone) u.artMesh.scale.x = Math.sin(t.face) < -0.05 ? -1 : 1;
        const base = u.baseScale;
        if (u.swatT > 0) {
          u.swatT -= dt; const k = 1 - u.swatT / 0.26, s1 = Math.sin(k * Math.PI);
          v.tower.scale.set(base * (1 + 0.22 * s1), base * (1 - 0.25 * s1), base * (1 + 0.22 * s1));
          x += Math.sin(t.face) * 0.3 * s1; z += Math.cos(t.face) * 0.3 * s1;
        } else if (!(u.pop > 0)) { const idle = 1 + 0.02 * Math.sin(clock * 3 + s.x); v.tower.scale.set(base, base * idle, base); }
        v.tower.position.x = x; v.tower.position.z = z;
        u.tail.rotation.z = Math.sin(clock * 2.4 + s.z) * 0.35;
      } else if (u.kind === 'trap') {
        const targetAngle = t.armed ? 1.1 : 1.1 * (1 - t.cooldown / t.cd) * 0.85;
        u.angle += (targetAngle - u.angle) * Math.min(1, dt * (t.armed ? 6 : 2));
        u.jawA.rotation.x = -u.angle; u.jawB.rotation.x = u.angle;
        if (u.artDone && art.trap_sprung) { const want = (t.armed ? art.trap_armed : art.trap_sprung).tex; if (u.artMesh.material.map !== want) { u.artMesh.material.map = want; u.artMesh.material.needsUpdate = true; } }
        if (u.deny > 0) { u.deny -= dt; v.tower.position.x = s.x + Math.sin(u.deny * 60) * 0.06; } else v.tower.position.x = s.x;
      } else if (u.kind === 'bin') {
        u.bags.forEach((b, i) => b.visible = i < t.bags);
        u.lid.rotation.x = -1.25 + (t.bags >= t.cap ? 0.35 : 0);
        if (u.bump > 0) { u.bump -= dt; const k = Math.sin(u.bump / 0.2 * Math.PI); v.tower.scale.set(1 + 0.1 * k, 1 - 0.12 * k, 1 + 0.1 * k); } else if (!(u.pop > 0)) v.tower.scale.setScalar(1);
      }
    }
  }

  function syncHand(g, dt) {
    while (handBags.length < g.hand) {
      const b = pools.bag.get(); const k = handBags.length;
      b.position.set(C.HAND.x + (k - 1) * 0.42, 0, C.HAND.z); b.rotation.y = k * 0.9; b.userData.land = 0.28; applyArt(b, 'bag', []); handBags.push(b);
    }
    while (handBags.length > g.hand) pools.bag.release(handBags.pop());
    handBags.forEach((b, k) => {
      const wob = g.phase === 'day' ? Math.sin(clock * 3.2 + k * 1.7) * 0.05 : 0;
      b.position.set(C.HAND.x + (k - (handBags.length - 1) / 2) * 0.42, Math.abs(wob), C.HAND.z);
      if (b.userData.land > 0) { b.userData.land -= dt; const t = 1 - b.userData.land / 0.28; const sq = 1 + 0.35 * Math.sin(t * Math.PI); b.scale.set(sq, 2 - sq, sq); } else b.scale.setScalar(1);
    });
    // pile rings turn to bait targets while bags wait in hand
    const active = g.phase === 'day' && g.hand > 0;
    pileRings.forEach((r, i) => {
      const full = g.piles[i].bags >= C.PILE_CAP;
      const hot = active && !full;
      r.material.color.set(hot ? P.bagYellow : P.ink);
      r.material.opacity = hot ? 0.75 + 0.25 * Math.sin(clock * 5) : full && active ? 0.3 : 1;
      r.scale.setScalar(hot ? 1 + 0.06 * Math.sin(clock * 5) : 1);
    });
  }

  function syncPiles(g, dt) {
    const off = [[0, 0], [0.42, 0.1], [-0.4, 0.14], [0.18, -0.36], [-0.2, -0.38], [0.02, 0.42], [0.44, -0.3], [-0.46, -0.34]];
    g.piles.forEach((p, i) => {
      const list = pileBags[i];
      while (list.length < p.bags) {
        const b = pools.bag.get(); const k = list.length; const o = off[k % off.length]; const layer = Math.floor(k / off.length);
        b.position.set(p.x + o[0], layer * 0.36, p.z + o[1]); b.rotation.y = k * 1.7; b.userData.land = 0.28; applyArt(b, 'bag', []); list.push(b);
      }
      while (list.length > p.bags) pools.bag.release(list.pop());
      list.forEach(b => { if (b.userData.land > 0) { b.userData.land -= dt; const k = 1 - b.userData.land / 0.28; const sq = 1 + 0.35 * Math.sin(k * Math.PI); b.scale.set(sq, 2 - sq, sq); } else b.scale.setScalar(1); });
    });
  }

  function syncFlying(g, dt) {
    const seen = new Set();
    for (const f of g.flying) {
      seen.add(f.id);
      let m = flyViews.get(f.id);
      if (!m) { m = pools.bag.get(); applyArt(m, 'bag', []); flyViews.set(f.id, m); }
      const tgt = f.to === 'hand' ? C.HAND : C.PILES[f.pile];
      const tx = f.tx !== undefined ? f.tx : tgt.x, tz = f.tz !== undefined ? f.tz : tgt.z;
      const u = Math.max(0, Math.min(1, f.t / f.dur));
      m.visible = f.t >= 0;
      if (f.kind === 'drop') { m.position.set(f.x0 + (tx - f.x0) * u, f.y0 * (1 - u) * (1 - u), f.z0 + (tz - f.z0) * u); m.rotation.y += dt * 4; }
      else { m.position.set(f.x0 + (tx - f.x0) * u, Math.sin(u * Math.PI) * (f.to === 'hand' ? 0.9 : 1.6), f.z0 + (tz - f.z0) * u); m.rotation.x += dt * 6; }
      m.scale.setScalar(1);
    }
    for (const [id, m] of flyViews) if (!seen.has(id)) { pools.bag.release(m); flyViews.delete(id); }
  }

  function syncRats(g, dt) {
    const seen = new Set();
    for (const r of g.rats) {
      seen.add(r.id);
      let m = ratViews.get(r.id);
      if (!m) { m = pools[r.type].get(); ratViews.set(r.id, m); m.userData.enraged = r.enraged; m.userData.hitT = 0; m.userData.flashT = 0; m.rotation.set(0, 0, 0); }
      const u = m.userData, R = C.RATS[r.type];
      applyArt(m, 'rat_' + r.type, [u.shadow].concat(u.bags));
      u.bags.forEach(b => applyArt(b, 'bag', [], 1));
      const moving = r.state === 'walk' || r.state === 'drag' || r.state === 'flee' || r.state === 'stalk';
      const rate = r.state === 'flee' ? 22 : r.state === 'drag' ? 9 : r.state === 'stalk' ? 6 : 15;
      const bob = moving ? Math.abs(Math.sin(clock * rate + u.phase)) * 0.06 : 0;
      const wig = moving && r.state !== 'stalk' ? Math.sin(clock * 9 + u.phase) * 0.07 : 0;
      m.position.set(r.x + Math.cos(r.dir) * wig, bob * R.size, r.z - Math.sin(r.dir) * wig);
      m.rotation.y = r.dir;
      m.rotation.x = r.state === 'grab' ? 0.35 + Math.sin(clock * 26) * 0.08 : r.state === 'drag' ? -0.22 : 0;
      m.rotation.z = r.state === 'drag' ? Math.sin(clock * 9 + u.phase) * 0.08 : 0;
      let sc = R.size;
      if (u.hitT > 0) { u.hitT -= dt; const k = u.hitT / 0.14; m.scale.set(sc * (1 + 0.35 * k), sc * (1 - 0.3 * k), sc * (1 + 0.35 * k)); }
      else if (r.state === 'caught') { m.scale.setScalar(sc * (1 + 0.15 * Math.sin(clock * 40))); }
      else if (r.state === 'stalk' || (r.type === 'boss' && r.enraged)) { m.scale.setScalar(sc * (1 + 0.05 * Math.sin(clock * (r.enraged ? 14 : 4)))); }
      else m.scale.setScalar(sc);
      u.bags.forEach((b, i) => { b.visible = i < r.carry; });
      if (u.flashT > 0) { u.flashT -= dt; const on = Math.floor(u.flashT * 12) % 2 === 0; u.bags.forEach(b => b.userData.body.material = on ? mat.bagAlert : mat.bag); }
      else u.bags.forEach(b => { if (b.userData.body.material !== mat.bag) b.userData.body.material = mat.bag; });
      u.tail.rotation.z = Math.sin(clock * (moving ? 12 : 3) + u.phase) * 0.5;
      if (r.type === 'boss') { const red = r.enraged; u.eyeL.material = red ? mat.tag : mat.ink; u.eyeR.material = red ? mat.tag : mat.ink; u.eyeL.scale.setScalar(red ? 1.8 : 1); u.eyeR.scale.setScalar(red ? 1.8 : 1); if (u.slice && !u.artDone) u.slice.visible = true; if (u.artDone) u.artMesh.material.color.set(red ? '#ffb0a6' : '#ffffff'); }
    }
    for (const [id, m] of ratViews) if (!seen.has(id)) { pools[m.userData.type].release(m); ratViews.delete(id); }
  }

  function syncTokens(g, dt) {
    const seen = new Set();
    for (const k of g.tokens) {
      seen.add(k.id);
      let m = tokenViews.get(k.id);
      if (!m) { m = pools.token.get(); tokenViews.set(k.id, m); m.userData.roll = 0; }
      const u = m.userData;
      applyArt(m, 'token', [u.shadow]);
      m.position.set(k.x, k.y, k.z);
      u.roll += (Math.abs(k.vz) + Math.abs(k.vx)) * dt / 0.18;
      u.coin.rotation.x = u.roll;
      m.rotation.y = u.artDone ? 0 : Math.atan2(k.vx, k.vz || 0.001);
      if (u.artDone) { const c = Math.cos(u.roll * 2.2); u.artMesh.scale.x = Math.max(0.18, Math.abs(c)) * (c < 0 ? -1 : 1); }
      const left = C.TOKENS.life - k.age;
      const glint = 1 + 0.12 * Math.sin(clock * 10 + k.id);
      m.scale.setScalar(left < 1.2 ? glint * (0.7 + 0.3 * (Math.floor(left * 8) % 2)) : glint);
      u.shadow.position.y = -k.y + 0.01; u.shadow.scale.setScalar(0.4 * Math.max(0.3, 1 - k.y * 0.3));
    }
    for (const [id, m] of tokenViews) if (!seen.has(id)) { pools.token.release(m); tokenViews.delete(id); }
  }

  function syncTruck(dt) {
    if (truckT < 0) return;
    truckT += dt;
    const k = Math.min(1, truckT / C.TIMING.truckDur);
    truck.position.x = -8 + 16 * k;
    truck.position.y = Math.abs(Math.sin(truckT * 18)) * 0.03;
    for (const p of pickup) {
      if (p.t < 0 && truck.position.x > p.x - 0.4) { p.t = 0; p.x0 = p.mesh.position.x; p.z0 = p.mesh.position.z; p.y0 = p.mesh.position.y; }
      if (p.t >= 0) {
        p.t += dt; const u = Math.min(1, p.t / 0.32);
        p.mesh.position.set(p.x0 + (truck.position.x - 0.3 - p.x0) * u, p.y0 + Math.sin(u * Math.PI) * 1.8 + u * 1.2, p.z0 + (truck.position.z - p.z0) * u);
        p.mesh.scale.setScalar(1 - u * 0.6);
      }
    }
    pickup = pickup.filter(p => { if (p.t >= 0.32) { pools.bag.release(p.mesh); return false; } return true; });
    if (k >= 1) { truck.visible = false; truckT = -1; pickup.forEach(p => pools.bag.release(p.mesh)); pickup = []; }
  }

  function syncFx(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]; p.userData.age += dt;
      const v = p.userData.v; v.y -= 12 * dt;
      p.position.addScaledVector(v, dt);
      if (p.position.y < 0.06) { p.position.y = 0.06; v.y = Math.abs(v.y) * 0.3; v.x *= 0.6; v.z *= 0.6; }
      p.rotation.x += dt * 9; p.rotation.z += dt * 7;
      if (p.userData.age >= p.userData.life) { pools.particle.release(p); particles.splice(i, 1); }
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i], u = r.userData; u.age += dt; const k = u.age / u.dur;
      r.scale.setScalar(0.3 + u.size * k); r.material.opacity = 0.9 * (1 - k);
      if (k >= 1) { pools.ring.release(r); rings.splice(i, 1); }
    }
    for (const t of tags) if (t.userData.pop > 0) { t.userData.pop -= dt; const k = 1 - t.userData.pop / 0.3; t.scale.setScalar(0.4 + 0.6 * Math.min(1, k * 1.4) + (k < 0.5 ? 0.5 * Math.sin(k * Math.PI * 2) : 0)); }
    if (sliceFx) {
      sliceFx.t += dt; const k = Math.min(1, sliceFx.t / 1.3);
      if (!sliceFx.mesh) {
        if (art.pizza_slice) { const a = art.pizza_slice, w = ART_IDS.pizza_slice.w; sliceFx.mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, w * a.aspect), new THREE.MeshBasicMaterial({ map: a.tex, transparent: true, alphaTest: 0.3 })); sliceFx.mesh.rotation.x = -CAM_TILT; }
        else { sliceFx.mesh = new THREE.Mesh(geo.slice, mat.bag); outline(sliceFx.mesh, 1.1); }
        scene.add(sliceFx.mesh); sliceFx.mesh.scale.setScalar(2.2);
      }
      const tx = -3.0, tz = -9.0;
      sliceFx.mesh.position.set(sliceFx.x + (tx - sliceFx.x) * k, Math.sin(k * Math.PI) * 4.5 + 0.3, sliceFx.z + (tz - sliceFx.z) * k);
      sliceFx.mesh.rotation.y += dt * 8; sliceFx.mesh.rotation.x += dt * 5;
      sliceFx.mesh.scale.setScalar(2.2 * (1 - k * 0.85));
      if (k >= 1) { scene.remove(sliceFx.mesh); sliceFx = null; }
    }
  }

  function syncStorm(dt) {
    for (const m of stormRats) {
      const u = m.userData;
      if (u.delay > 0) { u.delay -= dt; continue; }
      m.visible = true;
      m.position.x += u.vx * dt; m.position.z += u.vz * dt;
      m.position.y = Math.abs(Math.sin(clock * 30 + u.phase)) * 0.08;
      m.rotation.y = Math.atan2(u.vx, u.vz);
      if (m.position.z > 8) { m.position.z = -11; m.position.x = (Math.random() - 0.5) * 9; }
    }
  }

  const PROP_ART = { stoopRail: 'prop_stoop', hydrant: 'prop_hydrant', lamppost: 'prop_lamppost', scaffolding: 'prop_scaffolding' };
  function syncArtStatics() {
    if (!facadeArt && art.facade) {
      facadeParts.forEach(pm => pm.visible = false);
      const a = art.facade, w = ART_IDS.facade.w, h = w * a.aspect;
      const geo2 = new THREE.PlaneGeometry(w, h); geo2.translate(0, h / 2, 0);
      facadeArt = new THREE.Mesh(geo2, new THREE.MeshBasicMaterial({ map: a.tex, transparent: true, alphaTest: 0.1 }));
      facadeArt.position.set(-0.3, 0, facadeFront + 0.005);
      scene.add(facadeArt);
    }
    for (const id in slotViews) {
      const v = slotViews[id];
      if (v.prop && !v.prop.userData.artDone) {
        const keeps = id === 'lamppost' && lamp ? [lamp] : [];
        applyArt(v.prop, PROP_ART[id], keeps);
      }
    }
    applyArt(truck, 'truck', []);
  }

  function syncManhole(g) {
    const open = g.night >= 6 && g.phase !== 'title';
    if (open) { manholeCover.position.set(0.72, 0.05, -8.0); manholeCover.rotation.z = 0.12; return; }
    manholeCover.rotation.z = 0;
    const cfg = C.NIGHTS[g.night];
    if (g.phase === 'night' && cfg && cfg.rattle) {
      const burst = Math.sin(clock * 1.4) > 0.55;
      manholeCover.position.set(burst ? (Math.random() - 0.5) * 0.08 : 0, 0.05 + (burst ? Math.random() * 0.05 : 0), -7.9);
    } else manholeCover.position.set(0, 0.05, -7.9);
  }

  function sync(g, dt, now) {
    clock = now;
    // lighting eases toward the mode target
    const ease = Math.min(1, dt * (mode === 'storm' ? 1.2 : 2.2));
    light.amb += (target.amb - light.amb) * ease; light.sun += (target.sun - light.sun) * ease; light.lamp += (target.lamp - light.lamp) * ease; light.tint.lerp(target.tint, ease);
    applyLight();
    syncArtStatics(); syncTowers(g, dt); syncPiles(g, dt); syncHand(g, dt); syncFlying(g, dt); syncRats(g, dt); syncTokens(g, dt); syncTruck(dt); syncFx(dt); syncManhole(g);
    if (g.phase === 'storm' || g.phase === 'over') syncStorm(dt);
    // camera shake: theft, MARKED, boss beats only (GDD §8)
    if (shake > 0.002) { camera.position.set(camBase.x + (Math.random() - 0.5) * shake * 0.5, camBase.y + (Math.random() - 0.5) * shake * 0.5, camBase.z); shake *= Math.pow(0.02, dt); }
    else camera.position.copy(camBase);
    camera.updateMatrixWorld();
  }

  function draw() { renderer.render(scene, camera); }
  function stats() { const r = renderer.info.render; return { calls: r.calls, triangles: r.triangles }; }

  return { init, reset, sync, draw, handleEvent, project, unproject, setMode, stats };
})();
