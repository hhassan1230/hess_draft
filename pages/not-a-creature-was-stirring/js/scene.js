// Minimal scene graph. Nodes carry a transform, optional geometry and the
// material settings the renderer reads. Geometry is plain data, so the whole
// scene can be built and stepped in Node without a GPU.
import { m4 } from './math.js';

export class Node {
  constructor(name = '', geo = null, mat = {}) {
    this.name = name;
    this.geo = geo;
    this.pos = [0, 0, 0];
    this.rot = [0, 0, 0, 1];
    this.scl = [1, 1, 1];
    this.children = [];
    this.parent = null;
    this.visible = true;
    this.local = m4.identity();
    this.world = m4.identity();
    // Material: layer is 'opaque' | 'add' (glow, adds light) | 'blend' (alpha) | 'ui' (textured panel)
    // | 'top' (glow sprites drawn after everything else, like the pointing cursor over a panel)
    this.layer = 'opaque';
    this.tint = [1, 1, 1];
    this.emissive = 0; // 0 = fully lit, 1 = full self-illumination
    this.alpha = 1;
    this.tex = null; // { canvas, version } for textured quads
    this.depthTest = true;
    this.decal = false; // backdrop only: painted over what is drawn before it, in draw order (the rug on the floor)
    this.trim = false; // backdrop only: thin things laid on another surface (rails, panels, the window's sky), drawn with a depth offset so the vertex snap cannot put the surface behind them in front
    this.order = 0; // draw order bias for blended layers
    this.spec = 0; // glint: a facet turned between the light and the eye flashes white
    this.rim = 0; // rim light: facets edge-on to the eye catch the scene's rim colour (renderParams.rim)
    // Glow sprites (geometry from geo.sprites): faced to the eye, or lying flat in the node's XZ plane;
    // cover 0 adds light (layer 'add'), cover 1 hides what is behind like smoke (layer 'blend').
    this.sprite = false;
    this.flat = false;
    this.cover = 0;
    Object.assign(this, mat);
  }
  add(...nodes) {
    for (const n of nodes) {
      if (n.parent) n.parent.remove(n);
      n.parent = this;
      this.children.push(n);
    }
    return this;
  }
  remove(n) {
    const i = this.children.indexOf(n);
    if (i >= 0) this.children.splice(i, 1);
    n.parent = null;
    return this;
  }
  updateWorld(parentWorld = null) {
    m4.compose(this.pos, this.rot, this.scl, this.local);
    if (parentWorld) m4.mul(parentWorld, this.local, this.world);
    else this.world.set(this.local);
    for (const c of this.children) c.updateWorld(this.world);
  }
  traverse(fn, onlyVisible = false) {
    if (onlyVisible && !this.visible) return;
    fn(this);
    for (const c of this.children) c.traverse(fn, onlyVisible);
  }
  worldPos() { return [this.world[12], this.world[13], this.world[14]]; }
}
