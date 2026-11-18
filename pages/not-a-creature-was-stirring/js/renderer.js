// WebGL2 renderer for the scene graph. Flat-shaded vertex colors with
// per-vertex lighting (the PSX look), premultiplied alpha throughout so the
// headset composites passthrough correctly behind the game.
//
// Pass order per view:
//   backdrop (preview room only; a decal in it, the rug, is painted over what came before) -> darkness overlay -> opaque -> additive glow
//   (meshes, then glow sprites) -> alpha-blended + text panels + smoke (back to
//   front; a panel the preview pulled onto the screen skips the depth test) -> 'top' glow sprites
//   (the pointing cursor, over the panels) -> flash overlay
// In mixed reality there is no backdrop: the darkness overlay dims the real
// room (passthrough) while lit objects and glowing bulbs stay bright.
// A node with a portal (the yard outside the window) is drawn only where it is seen through that rectangle:
// clipped to the window's place on screen (scissor), and per fragment to the glass (see LIT_FS).

const LIT_VS = `#version 300 es
layout(location=0) in vec3 a_pos;
layout(location=1) in vec3 a_nrm;
layout(location=2) in vec3 a_col;
uniform mat4 u_model, u_viewProj;
uniform vec3 u_tint, u_sunDir, u_sunCol, u_ambient, u_camPos;
uniform float u_emissive, u_snap, u_spec, u_rim;
uniform vec3 u_rimCol;
uniform vec4 u_lightPos[4];
uniform vec4 u_lightCol[4];
uniform int u_nLights;
out vec3 v_col;
out vec3 v_wp;
void main() {
  vec4 wp = u_model * vec4(a_pos, 1.0);
  v_wp = wp.xyz;
  vec3 n = normalize(mat3(u_model) * a_nrm);
  vec3 base = a_col * u_tint;
  vec3 light = u_ambient + u_sunCol * max(dot(n, -u_sunDir), 0.0);
  for (int i = 0; i < 4; i++) {
    if (i >= u_nLights) break;
    vec3 d = u_lightPos[i].xyz - wp.xyz;
    float dist = length(d);
    float att = clamp(1.0 - dist / u_lightPos[i].w, 0.0, 1.0);
    light += u_lightCol[i].rgb * att * att * (0.35 + 0.65 * max(dot(n, d / max(dist, 1e-4)), 0.0));
  }
  vec3 col = mix(base * light, base, u_emissive);
  if (u_spec > 0.0) {
    // Glint: with flat normals a whole facet flashes when it turns between the sun and the eye.
    vec3 h = normalize(normalize(u_camPos - wp.xyz) - u_sunDir);
    col += u_sunCol * (1.6 * u_spec * pow(max(dot(n, h), 0.0), 10.0));
  }
  if (u_rim > 0.0) {
    // Rim: facets turned edge-on to the eye catch a cool moonlight, so a figure stands out from the room.
    float f = 1.0 - max(dot(n, normalize(u_camPos - wp.xyz)), 0.0);
    col += u_rimCol * (u_rim * f * f * f) * (1.0 - u_emissive);
  }
  v_col = col;
  vec4 clip = u_viewProj * wp;
  if (u_snap > 0.0) clip.xy = floor(clip.xy / clip.w * u_snap + 0.5) / u_snap * clip.w;
  gl_Position = clip;
}`;

// Real-world occlusion (js/depth.js decides when it is on, and how to read the texture): a fragment
// further away than a real surface at that pixel is not drawn, so the room hides what is behind it.
// Nothing nearer than u_occNear is ever hidden: hands, the table and what is on it, the scare's face.
const OCC_GLSL = `
precision highp sampler2DArray;
uniform sampler2DArray u_depth;
uniform float u_occOn;
uniform vec4 u_occ;   // x: on for this eye, y: texture layer, z: reading (0 projected depth, 1 metres), w: rows flipped
uniform vec4 u_occNF; // x, y: the depth texture's near and far planes; z, w: ours
uniform vec4 u_occVP; // the eye's viewport
uniform float u_occRaw, u_occNear;
highp float occLinear(highp float d, highp float n, highp float f) { return n * f / (f - d * (f - n)); }
highp float occReal(highp vec2 uv) {
  if (u_occ.w > 0.5) uv.y = 1.0 - uv.y;
  highp float raw = texture(u_depth, vec3(uv, u_occ.y)).r;
  if (u_occ.z < 0.5) return raw > 0.0 && raw < 0.9999 ? occLinear(raw, u_occNF.x, u_occNF.y) : 0.0;
  return raw * u_occRaw;
}
// k: how far along the ray from the eye this fragment counts as being (1: where it is). The yard outside the window
// counts as being at the glass (k < 1): the real wall round the window, or the glass itself, never hides it, but a
// real chair in front of the window does.
bool occludedAt(highp float k) {
  if (u_occOn * u_occ.x < 0.5) return false;
  highp float zf = occLinear(gl_FragCoord.z, u_occNF.z, u_occNF.w) * k;
  if (zf < u_occNear) return false;
  highp float zr = occReal((gl_FragCoord.xy - u_occVP.xy) / u_occVP.zw);
  return zr > 0.05 && zr < zf - (0.05 + 0.04 * zf);
}
bool occluded() { return occludedAt(1.0); }`;

// The portal (node.portal): a rectangle (centre P, normal N, half-extents along R and U in their w). A fragment is
// drawn only if the line from the eye to it passes through the rectangle, with the glass between them.
const LIT_FS = `#version 300 es
precision mediump float;
in vec3 v_col;
in highp vec3 v_wp;
uniform float u_alpha;
uniform highp vec4 u_portalP, u_portalN, u_portalR, u_portalU, u_portalEye;
out vec4 o;
${OCC_GLSL}
void main() {
  highp float k = 1.0;
  if (u_portalP.w > 0.5) {
    highp vec3 d = v_wp - u_portalEye.xyz;
    highp float den = dot(d, u_portalN.xyz);
    if (abs(den) < 1e-6) discard;
    k = dot(u_portalP.xyz - u_portalEye.xyz, u_portalN.xyz) / den;
    if (k <= 0.0 || k >= 1.0) discard;
    highp vec3 rel = u_portalEye.xyz + d * k - u_portalP.xyz;
    if (abs(dot(rel, u_portalR.xyz)) > u_portalR.w || abs(dot(rel, u_portalU.xyz)) > u_portalU.w) discard;
  }
  if (occludedAt(k)) discard;
  o = vec4(v_col * u_alpha, u_alpha);
}`;

const TEX_VS = `#version 300 es
layout(location=0) in vec3 a_pos;
layout(location=3) in vec2 a_uv;
uniform mat4 u_model, u_viewProj;
out vec2 v_uv;
void main() { v_uv = a_uv; gl_Position = u_viewProj * u_model * vec4(a_pos, 1.0); }`;

const TEX_FS = `#version 300 es
precision mediump float;
in vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_alpha;
uniform vec3 u_tint;
out vec4 o;
void main() { vec4 c = texture(u_tex, v_uv); o = vec4(c.rgb * u_tint, c.a) * u_alpha; }`;

// Glow sprites (geo.sprites): every corner carries its sprite's centre, so the
// quad is built here, facing this eye (or lying flat in the model's XZ plane),
// and faded from the middle out in the fragment shader. cover 0 adds light and
// leaves alpha alone, so passthrough shows through; cover 1 covers, like smoke.
const SPR_VS = `#version 300 es
layout(location=0) in vec3 a_pos;
layout(location=1) in vec3 a_nrm;
layout(location=2) in vec3 a_col;
layout(location=3) in vec2 a_uv;
uniform mat4 u_model, u_viewProj;
uniform vec3 u_camPos, u_tint;
uniform float u_flat, u_time;
out vec2 v_c;
out vec3 v_col;
void main() {
  vec3 c = (u_model * vec4(a_pos, 1.0)).xyz;
  float s = a_nrm.z * length(u_model[0].xyz);
  vec3 wp;
  if (u_flat > 0.5) {
    wp = c + (normalize(u_model[0].xyz) * a_nrm.x + normalize(u_model[2].xyz) * a_nrm.y) * s;
  } else {
    vec3 d = u_camPos - c;
    float dl = length(d);
    d = dl > 1e-5 ? d / dl : vec3(0.0, 0.0, 1.0);
    vec3 r = cross(vec3(0.0, 1.0, 0.0), d);
    r = length(r) > 1e-4 ? normalize(r) : vec3(1.0, 0.0, 0.0);
    vec3 u = cross(d, r);
    // Pulled toward the eye by half its size, so what it glows around does not cut it.
    wp = c + (r * a_nrm.x + u * a_nrm.y) * s + d * min(s * 0.5, dl * 0.5);
  }
  v_c = a_nrm.xy;
  v_col = a_col * u_tint * (1.0 - a_uv.y * (0.5 + 0.5 * sin(u_time * 2.6 + a_uv.x)));
  gl_Position = u_viewProj * vec4(wp, 1.0);
}`;

const SPR_FS = `#version 300 es
precision mediump float;
in vec2 v_c;
in vec3 v_col;
uniform float u_alpha, u_cover;
out vec4 o;
${OCC_GLSL}
void main() {
  if (occluded()) discard;
  float d = clamp(1.0 - dot(v_c, v_c), 0.0, 1.0);
  float g = d * d * d * u_alpha;
  o = vec4(v_col * g, g * u_cover);
}`;

const OVL_VS = `#version 300 es
void main() {
  vec2 p = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const OVL_FS = `#version 300 es
precision mediump float;
uniform vec4 u_color;
out vec4 o;
void main() { o = u_color; }`;

// Reads the depth texture at up to 16 points (one per pixel of a 16 x 1 target) as one reading says, and
// writes the metres it finds, packed into two bytes (0..16 m): how js/depth.js checks a reading.
const PROBE_FS = `#version 300 es
precision highp float;
uniform vec2 u_probe[16];
out vec4 o;
${OCC_GLSL}
void main() {
  highp float z = occReal(u_probe[int(gl_FragCoord.x)]);
  highp float e = clamp(z / 16.0, 0.0, 1.0) * 255.0;
  o = vec4(floor(e) / 255.0, fract(e), 0.0, 1.0);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('Shader: ' + gl.getShaderInfoLog(s));
  return s;
}

function program(gl, vs, fs, names) {
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('Program: ' + gl.getProgramInfoLog(p));
  const u = {};
  for (const n of names) u[n] = gl.getUniformLocation(p, n);
  return { p, u };
}

const OCC_U = ['u_depth', 'u_occOn', 'u_occ', 'u_occNF', 'u_occVP', 'u_occRaw', 'u_occNear'];
const LIT_U = ['u_model', 'u_viewProj', 'u_tint', 'u_sunDir', 'u_sunCol', 'u_ambient', 'u_camPos', 'u_emissive', 'u_snap', 'u_spec', 'u_rim', 'u_rimCol', 'u_lightPos', 'u_lightCol', 'u_nLights', 'u_alpha',
  'u_portalP', 'u_portalN', 'u_portalR', 'u_portalU', 'u_portalEye', ...OCC_U];
const SPR_U = ['u_model', 'u_viewProj', 'u_camPos', 'u_tint', 'u_flat', 'u_time', 'u_alpha', 'u_cover', ...OCC_U];
const DEPTH_UNIT = 3; // the room's depth texture; panels use unit 0
// Trim's depth offset, in pixels of the surface's own depth slope (glPolygonOffset). The snap moves each corner
// up to half a step (under 2 px on a laptop or a phone), so two surfaces can trade up to about 4 px between them.
export const TRIM_OFFSET = 4;

export class Renderer {
  constructor(gl) {
    this.gl = gl;
    this.lit = program(gl, LIT_VS, LIT_FS, LIT_U);
    this.tex = program(gl, TEX_VS, TEX_FS, ['u_model', 'u_viewProj', 'u_tex', 'u_alpha', 'u_tint']);
    this.spr = program(gl, SPR_VS, SPR_FS, SPR_U);
    this.ovl = program(gl, OVL_VS, OVL_FS, ['u_color']);
    this.probe = program(gl, OVL_VS, PROBE_FS, ['u_probe', ...OCC_U]);
    // Bound to the depth unit whenever there is no room depth, so the samplers always have a texture.
    this.noDepth = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.noDepth);
    gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.R32F, 1, 1, 1, 0, gl.RED, gl.FLOAT, new Float32Array([0]));
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
    this.probeTarget = null;
    this.occNear = 0.6;
    this.meshes = new WeakMap();
    this.textures = new WeakMap();
    this.emptyVao = gl.createVertexArray();
    this.stats = { draws: 0, views: 0, nodes: 0 };
    this.lightPos = new Float32Array(16);
    this.lightCol = new Float32Array(16);
    this.lists = { backdrop: [], opaque: [], add: [], glow: [], blend: [], top: [] };
    this.view = null; // the view being drawn (a portal's place on screen is worked out per view)
    this.portalRects = new Map();
    this.scissored = false;
  }

  // A geometry's GPU copy, made the first time it is drawn (or by prepare). A dynamic geometry (a particle
  // batch) is uploaded again whenever its version changes, into the same buffers.
  mesh(geo) {
    let m = this.meshes.get(geo);
    if (m && (!geo.dynamic || m.version === geo.version)) return m;
    const gl = this.gl;
    if (!m) {
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      const bufs = [];
      const attr = (loc, size) => {
        const b = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
        bufs.push(b);
      };
      attr(0, 3); attr(1, 3); attr(2, 3);
      if (geo.uv) attr(3, 2);
      gl.bindVertexArray(null);
      m = { vao, bufs, count: 0, version: null };
      this.meshes.set(geo, m);
    }
    const n = geo.count;
    const data = geo.dynamic
      ? [geo.pos.subarray(0, n * 3), geo.nrm.subarray(0, n * 3), geo.col.subarray(0, n * 3)]
      : [geo.pos, geo.nrm, geo.col, geo.uv].filter(Boolean);
    data.forEach((d, i) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, m.bufs[i]);
      gl.bufferData(gl.ARRAY_BUFFER, d, geo.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
    });
    m.count = n;
    m.version = geo.version;
    return m;
  }

  // Uploads every mesh and panel under these roots, shown or hidden, and any loose geometries, so nothing
  // reaches the GPU for the first time mid-night (each first upload is a hitch in the headset). A panel
  // painted ahead of time (the win's) goes up now too, not on the frame it is shown.
  prepare(roots, geos = []) {
    for (const root of roots) if (root) root.traverse((n) => { if (n.geo) this.mesh(n.geo); if (n.tex) this.texture(n.tex); });
    for (const g of geos) this.mesh(g);
  }

  // Frees what belongs to one game or headset visit that is over, under these roots: the GPU copies of its
  // panel canvases and of its particle batches. Other meshes stay: models and panel quads are shared.
  release(roots) {
    const gl = this.gl;
    for (const root of roots) {
      if (!root) continue;
      root.traverse((n) => {
        const e = n.tex && this.textures.get(n.tex);
        if (e) { gl.deleteTexture(e.tex); this.textures.delete(n.tex); }
        const m = n.geo && n.geo.dynamic && this.meshes.get(n.geo);
        if (m) { gl.deleteVertexArray(m.vao); for (const b of m.bufs) gl.deleteBuffer(b); this.meshes.delete(n.geo); }
      });
    }
  }

  texture(t) {
    const gl = this.gl;
    let e = this.textures.get(t);
    if (!e) { e = { tex: gl.createTexture(), version: -1 }; this.textures.set(t, e); }
    if (e.version !== t.version) {
      gl.bindTexture(gl.TEXTURE_2D, e.tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.canvas);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      e.version = t.version;
    }
    return e.tex;
  }

  collect(roots, list) {
    for (const root of roots) {
      if (!root) continue;
      root.traverse((n) => {
        if (!n.geo) return;
        this.stats.nodes++;
        if (list) list.push(n);
        else if (n.layer === 'opaque') this.lists.opaque.push(n);
        else if (n.layer === 'add') (n.sprite ? this.lists.glow : this.lists.add).push(n);
        else if (n.layer === 'top' && n.sprite) this.lists.top.push(n);
        else this.lists.blend.push(n);
      }, true);
    }
  }

  // views: [{ viewProj, viewport: [x, y, w, h], camPos }]
  // params: game.renderParams. opts: { clearColor, backdrop: Node|null, snap }
  render(roots, views, params, { clearColor = [0, 0, 0, 0], backdrop = null, snap = 0 } = {}) {
    const gl = this.gl;
    roots = Array.isArray(roots) ? roots : [roots];
    for (const k of Object.keys(this.lists)) this.lists[k].length = 0;
    this.stats.draws = 0; this.stats.nodes = 0; this.stats.views = views.length;
    if (backdrop) this.collect([backdrop], this.lists.backdrop);
    this.collect(roots);

    gl.disable(gl.CULL_FACE);
    gl.disable(gl.POLYGON_OFFSET_FILL); // trim's offset never outlives its own draw, even after a frame that threw
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(true);
    gl.colorMask(true, true, true, true);
    gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // light uniforms, shared by all views
    const L = params.lights || [];
    const nLights = Math.min(4, L.length);
    for (let i = 0; i < nLights; i++) {
      const l = L[i];
      this.lightPos.set([l.pos[0], l.pos[1], l.pos[2], l.range || 1], i * 4);
      const s = l.intensity ?? 1;
      this.lightCol.set([l.color[0] * s, l.color[1] * s, l.color[2] * s, 0], i * 4);
    }

    for (const v of views) {
      gl.viewport(v.viewport[0], v.viewport[1], v.viewport[2], v.viewport[3]);
      this.drawView(v, params, nLights, snap);
    }
  }

  setLit(v, params, nLights, snap) {
    const gl = this.gl, u = this.lit.u;
    gl.useProgram(this.lit.p);
    gl.uniformMatrix4fv(u.u_viewProj, false, v.viewProj);
    gl.uniform3f(u.u_sunDir, -0.35, -0.85, -0.4);
    const sun = params.sun ?? 0.7, amb = params.ambient ?? 0.6;
    gl.uniform3f(u.u_sunCol, sun, sun * 0.95, sun * 0.88);
    gl.uniform3f(u.u_ambient, amb * 0.92, amb * 0.94, amb);
    const rim = params.rim || [0, 0, 0];
    gl.uniform3f(u.u_rimCol, rim[0], rim[1], rim[2]);
    gl.uniform4fv(u.u_lightPos, this.lightPos);
    gl.uniform4fv(u.u_lightCol, this.lightCol);
    gl.uniform1i(u.u_nLights, nLights);
    gl.uniform1f(u.u_snap, snap);
    const c = v.camPos || [0, 0, 0];
    gl.uniform3f(u.u_camPos, c[0], c[1], c[2]);
    gl.uniform4f(u.u_portalEye, c[0], c[1], c[2], 0);
    this.setOcclusion(u, v);
  }

  // Where a portal's rectangle lands in this view, in pixels: [x, y, w, h], or null if it cannot be worked out (a
  // corner behind the eye: then only the per-fragment test clips it), or 'off' if it is wholly off this view.
  portalRect(P) {
    let r = this.portalRects.get(P);
    if (r !== undefined) return r;
    const v = this.view, m = v.viewProj, vp = v.viewport || [0, 0, 1, 1];
    // The rectangle in clip space, cut where it passes behind the eye (Sutherland-Hodgman on w), then its bounds on screen.
    const E = 0.01;
    const clip = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => {
      const p = [0, 1, 2].map((k) => P.p[k] + P.r[k] * P.hw * a + P.u[k] * P.hh * b);
      return [m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15]];
    });
    const pts = [];
    for (let i = 0; i < 4; i++) {
      const c = clip[i], n = clip[(i + 1) % 4];
      if (c[2] > E) pts.push(c);
      if ((c[2] > E) !== (n[2] > E)) { const t = (E - c[2]) / (n[2] - c[2]); pts.push([c[0] + (n[0] - c[0]) * t, c[1] + (n[1] - c[1]) * t, E]); }
    }
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const c of pts) { const x = c[0] / c[2], y = c[1] / c[2]; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    r = null;
    if (!pts.length) r = 'off'; // the whole window is behind the eye: nothing can be seen through it
    else {
      if (x1 < -1 || x0 > 1 || y1 < -1 || y0 > 1) r = 'off';
      else {
        const px = (t) => Math.max(0, Math.min(1, t * 0.5 + 0.5));
        const X0 = Math.floor(vp[0] + px(x0) * vp[2]) - 1, X1 = Math.ceil(vp[0] + px(x1) * vp[2]) + 1;
        const Y0 = Math.floor(vp[1] + px(y0) * vp[3]) - 1, Y1 = Math.ceil(vp[1] + px(y1) * vp[3]) + 1;
        r = [Math.max(vp[0], X0), Math.max(vp[1], Y0), Math.max(0, Math.min(vp[0] + vp[2], X1) - Math.max(vp[0], X0)), Math.max(0, Math.min(vp[1] + vp[3], Y1) - Math.max(vp[1], Y0))];
      }
    }
    this.portalRects.set(P, r);
    return r;
  }

  // The portal for the node about to be drawn by the lit program (none: off). False if it is not on screen.
  setPortal(n) {
    const gl = this.gl, u = this.lit.u, P = n.portal;
    if (!P) {
      gl.uniform4f(u.u_portalP, 0, 0, 0, 0);
      return true;
    }
    const r = this.portalRect(P);
    if (r === 'off' || (r && (r[2] === 0 || r[3] === 0))) return false;
    // Only for this one draw: drawLit turns it off again, so nothing drawn after it is clipped.
    if (r) { gl.enable(gl.SCISSOR_TEST); gl.scissor(r[0], r[1], r[2], r[3]); this.scissored = true; }
    gl.uniform4f(u.u_portalP, P.p[0], P.p[1], P.p[2], 1);
    gl.uniform4f(u.u_portalN, P.n[0], P.n[1], P.n[2], 0);
    gl.uniform4f(u.u_portalR, P.r[0], P.r[1], P.r[2], P.hw);
    gl.uniform4f(u.u_portalU, P.u[0], P.u[1], P.u[2], P.hh);
    return true;
  }

  // The room's depth for this eye (v.depth from js/xr.js, only once js/depth.js has turned it on), or none.
  setOcclusion(u, v) {
    const gl = this.gl, d = v.depth;
    gl.activeTexture(gl.TEXTURE0 + DEPTH_UNIT);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, d ? d.tex : this.noDepth);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(u.u_depth, DEPTH_UNIT);
    gl.uniform4f(u.u_occ, d ? 1 : 0, d ? d.layer : 0, d && d.reading ? d.reading.decode : 0, d && d.reading && d.reading.flip ? 1 : 0);
    gl.uniform4f(u.u_occNF, d ? d.near : 0.05, d ? d.far : 60, d ? d.ourNear : 0.05, d ? d.ourFar : 60);
    const vp = v.viewport || [0, 0, 1, 1];
    gl.uniform4f(u.u_occVP, vp[0], vp[1], vp[2], vp[3]);
    gl.uniform1f(u.u_occRaw, d ? d.raw : 1);
    gl.uniform1f(u.u_occNear, this.occNear);
  }

  // Reads the depth at up to 16 probe points ({ u, v } from the bottom left of the eye's view) as one
  // reading says; returns metres (0 where there is none). Draws into its own small target, so call it
  // before binding the frame's framebuffer.
  probeDepth(d, reading, probes) {
    const gl = this.gl, n = Math.min(16, probes.length);
    if (!this.probeTarget) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 16, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      this.probeTarget = { fb, tex, px: new Uint8Array(16 * 4) };
    }
    const P = this.probeTarget, u = this.probe.u;
    gl.bindFramebuffer(gl.FRAMEBUFFER, P.fb);
    gl.viewport(0, 0, 16, 1);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.disable(gl.SCISSOR_TEST);
    gl.useProgram(this.probe.p);
    const uv = new Float32Array(32);
    for (let i = 0; i < n; i++) { uv[i * 2] = probes[i].u; uv[i * 2 + 1] = probes[i].v; }
    gl.uniform2fv(u.u_probe, uv);
    this.setOcclusion(u, { depth: { ...d, reading }, viewport: [0, 0, 1, 1] });
    gl.bindVertexArray(this.emptyVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.readPixels(0, 0, 16, 1, gl.RGBA, gl.UNSIGNED_BYTE, P.px);
    gl.enable(gl.DEPTH_TEST);
    const out = [];
    for (let i = 0; i < n; i++) out.push(((P.px[i * 4] + P.px[i * 4 + 1] / 255) / 255) * 16);
    return out;
  }

  setSprite(v, params) {
    const gl = this.gl, u = this.spr.u;
    gl.useProgram(this.spr.p);
    gl.uniformMatrix4fv(u.u_viewProj, false, v.viewProj);
    const c = v.camPos || [0, 0, 0];
    gl.uniform3f(u.u_camPos, c[0], c[1], c[2]);
    gl.uniform1f(u.u_time, params.time || 0);
    this.setOcclusion(u, v);
  }

  drawSprite(n) {
    const gl = this.gl, u = this.spr.u;
    const m = this.mesh(n.geo);
    gl.uniformMatrix4fv(u.u_model, false, n.world);
    gl.uniform3f(u.u_tint, n.tint[0], n.tint[1], n.tint[2]);
    gl.uniform1f(u.u_flat, n.flat ? 1 : 0);
    gl.uniform1f(u.u_cover, n.cover);
    gl.uniform1f(u.u_alpha, n.alpha);
    gl.uniform1f(u.u_occOn, n.occlude === false ? 0 : 1);
    gl.bindVertexArray(m.vao);
    gl.drawArrays(gl.TRIANGLES, 0, m.count);
    this.stats.draws++;
  }

  drawLit(n) {
    const gl = this.gl, u = this.lit.u;
    if (!this.setPortal(n)) return;
    const m = this.mesh(n.geo);
    gl.uniformMatrix4fv(u.u_model, false, n.world);
    gl.uniform3f(u.u_tint, n.tint[0], n.tint[1], n.tint[2]);
    gl.uniform1f(u.u_emissive, n.emissive);
    gl.uniform1f(u.u_spec, n.spec);
    gl.uniform1f(u.u_rim, n.rim);
    gl.uniform1f(u.u_alpha, n.alpha);
    gl.uniform1f(u.u_occOn, n.occlude === false ? 0 : 1);
    gl.bindVertexArray(m.vao);
    gl.drawArrays(gl.TRIANGLES, 0, m.count);
    this.stats.draws++;
    if (this.scissored) { gl.disable(gl.SCISSOR_TEST); this.scissored = false; }
  }

  overlay(rgba) {
    const gl = this.gl;
    gl.useProgram(this.ovl.p);
    gl.uniform4f(this.ovl.u.u_color, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.bindVertexArray(this.emptyVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.stats.draws++;
  }

  drawView(v, params, nLights, snap) {
    const gl = this.gl;
    const { backdrop, opaque, add, glow, blend, top } = this.lists;
    this.view = v;
    this.portalRects.clear();

    gl.disable(gl.BLEND);
    if (backdrop.length) {
      this.setLit(v, params, nLights, snap);
      // A decal (the preview room's rug) is painted over what is already drawn, in draw order as the PlayStation
      // did, and writes its depth for what comes after. The vertex snap moves each surface's depth by more than
      // the few millimetres between a rug and its floor, so a depth test cannot tell them apart.
      // Trim (rails, raised panels, the window's sky, the runner on the table) lies a few millimetres off the
      // surface behind it, and the snap moves depth by more than that on screen. Its depth is pulled toward the
      // eye by a few pixels' worth of the surface's own slope (TRIM_OFFSET), more than the snap can move it.
      for (const n of backdrop) {
        if (n.decal) gl.depthFunc(gl.ALWAYS);
        else if (n.trim) { gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(-TRIM_OFFSET, -TRIM_OFFSET); }
        this.drawLit(n);
        if (n.decal) gl.depthFunc(gl.LEQUAL);
        else if (n.trim) gl.disable(gl.POLYGON_OFFSET_FILL);
      }
    }

    const dark = params.darkness || 0;
    if (dark > 0.001) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.DEPTH_TEST);
      gl.depthMask(false);
      this.overlay([0, 0, 0, dark]);
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
      gl.disable(gl.BLEND);
    }

    this.setLit(v, params, nLights, snap);
    for (const n of opaque) this.drawLit(n);

    gl.enable(gl.BLEND);
    gl.depthMask(false);
    if (add.length || glow.length) {
      gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ZERO, gl.ONE);
      for (const n of add) this.drawLit(n);
      if (glow.length) {
        this.setSprite(v, params);
        for (const n of glow) if (n.alpha > 0.002) this.drawSprite(n);
      }
    }

    if (blend.length) {
      gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      const c = v.camPos || [0, 0, 0];
      const d2 = (n) => { const w = n.world; return (w[12] - c[0]) ** 2 + (w[13] - c[1]) ** 2 + (w[14] - c[2]) ** 2; };
      blend.sort((a, b) => d2(b) - d2(a) || a.order - b.order);
      let prog = null;
      for (const n of blend) {
        if (n.layer === 'ui' && n.tex) {
          if (prog !== 'tex') {
            gl.useProgram(this.tex.p);
            gl.uniformMatrix4fv(this.tex.u.u_viewProj, false, v.viewProj);
            gl.uniform1i(this.tex.u.u_tex, 0);
            prog = 'tex';
          }
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, this.texture(n.tex));
          gl.uniformMatrix4fv(this.tex.u.u_model, false, n.world);
          gl.uniform1f(this.tex.u.u_alpha, n.alpha);
          gl.uniform3f(this.tex.u.u_tint, n.tint[0], n.tint[1], n.tint[2]); // a sign in the room takes the room's light (js/menu.js)
          const m = this.mesh(n.geo);
          gl.bindVertexArray(m.vao);
          // A panel pulled onto the screen (the preview's fit) is drawn over the scene, like a sign on the glass.
          if (n.over) gl.disable(gl.DEPTH_TEST);
          gl.drawArrays(gl.TRIANGLES, 0, m.count);
          if (n.over) gl.enable(gl.DEPTH_TEST);
          this.stats.draws++;
        } else if (n.sprite) {
          if (prog !== 'sprite') { this.setSprite(v, params); prog = 'sprite'; }
          this.drawSprite(n);
        } else {
          if (prog !== 'lit') { this.setLit(v, params, nLights, snap); prog = 'lit'; }
          this.drawLit(n);
        }
      }
    }

    if (top.length) {
      gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ZERO, gl.ONE);
      this.setSprite(v, params);
      for (const n of top) this.drawSprite(n);
    }

    const f = params.flash;
    if (f && f[3] > 0.001) {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.DEPTH_TEST);
      this.overlay([f[0] * f[3], f[1] * f[3], f[2] * f[3], f[3]]);
      gl.enable(gl.DEPTH_TEST);
    }
    gl.depthMask(true);
    gl.disable(gl.BLEND);
    gl.bindVertexArray(null);
  }
}
