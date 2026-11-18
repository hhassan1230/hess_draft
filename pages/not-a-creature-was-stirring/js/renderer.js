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
void main() {
  vec4 wp = u_model * vec4(a_pos, 1.0);
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
bool occluded() {
  if (u_occOn * u_occ.x < 0.5) return false;
  highp float zf = occLinear(gl_FragCoord.z, u_occNF.z, u_occNF.w);
  if (zf < u_occNear) return false;
  highp float zr = occReal((gl_FragCoord.xy - u_occVP.xy) / u_occVP.zw);
  return zr > 0.05 && zr < zf - (0.05 + 0.04 * zf);
}`;

const LIT_FS = `#version 300 es
precision mediump float;
in vec3 v_col;
uniform float u_alpha;
out vec4 o;
${OCC_GLSL}
void main() {
  if (occluded()) discard;
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
out vec4 o;
void main() { o = texture(u_tex, v_uv) * u_alpha; }`;

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
const LIT_U = ['u_model', 'u_viewProj', 'u_tint', 'u_sunDir', 'u_sunCol', 'u_ambient', 'u_camPos', 'u_emissive', 'u_snap', 'u_spec', 'u_rim', 'u_rimCol', 'u_lightPos', 'u_lightCol', 'u_nLights', 'u_alpha', ...OCC_U];
const SPR_U = ['u_model', 'u_viewProj', 'u_camPos', 'u_tint', 'u_flat', 'u_time', 'u_alpha', 'u_cover', ...OCC_U];
const DEPTH_UNIT = 3; // the room's depth texture; panels use unit 0

export class Renderer {
  constructor(gl) {
    this.gl = gl;
    this.lit = program(gl, LIT_VS, LIT_FS, LIT_U);
    this.tex = program(gl, TEX_VS, TEX_FS, ['u_model', 'u_viewProj', 'u_tex', 'u_alpha']);
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
    this.setOcclusion(u, v);
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

    gl.disable(gl.BLEND);
    if (backdrop.length) {
      this.setLit(v, params, nLights, snap);
      // A decal (the preview room's rug) is painted over what is already drawn, in draw order as the PlayStation
      // did, and writes its depth for what comes after. The vertex snap moves each surface's depth by more than
      // the few millimetres between a rug and its floor, so a depth test cannot tell them apart.
      for (const n of backdrop) {
        if (n.decal) gl.depthFunc(gl.ALWAYS);
        this.drawLit(n);
        if (n.decal) gl.depthFunc(gl.LEQUAL);
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
