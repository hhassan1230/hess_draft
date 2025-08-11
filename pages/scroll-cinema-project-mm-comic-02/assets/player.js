var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { E as ExtensionType, L as LoaderParserPriority, p as path, e as extensions, a as EventEmitter, T as Ticker, D as DOMAdapter, b as EditorMode, c as Events, d as buildHierarchy, g as getFillColor, G as GraphicType, f as TrackFunctionType, h as TrackEvaluationMethodType, i as ClipFunctionType, j as interpolateColor, k as deepClone, l as approximatelyEqual, m as debounce, n as LOCAL_STORAGE_KEY, o as ProjectItemAssetType, q as getParentNodes, s as ContentType, S as SelectionType } from "../assets/index.js";
/*!
 * PixiJS - v8.10.1
 * Compiled Thu, 05 Jun 2025 17:35:59 UTC
 *
 * PixiJS is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
*/
var Sy = Object.defineProperty, Ey = Object.defineProperties, Ay = Object.getOwnPropertyDescriptors, Bu = Object.getOwnPropertySymbols, wy = Object.prototype.hasOwnProperty, Py = Object.prototype.propertyIsEnumerable, Fu = (r, t, e) => t in r ? Sy(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Du = (r, t) => {
  for (var e in t || (t = {})) wy.call(t, e) && Fu(r, e, t[e]);
  if (Bu) for (var e of Bu(t)) Py.call(t, e) && Fu(r, e, t[e]);
  return r;
}, Ry = (r, t) => Ey(r, Ay(t)), x$1 = ((r) => (r.Application = "application", r.WebGLPipes = "webgl-pipes", r.WebGLPipesAdaptor = "webgl-pipes-adaptor", r.WebGLSystem = "webgl-system", r.WebGPUPipes = "webgpu-pipes", r.WebGPUPipesAdaptor = "webgpu-pipes-adaptor", r.WebGPUSystem = "webgpu-system", r.CanvasSystem = "canvas-system", r.CanvasPipesAdaptor = "canvas-pipes-adaptor", r.CanvasPipes = "canvas-pipes", r.Asset = "asset", r.LoadParser = "load-parser", r.ResolveParser = "resolve-parser", r.CacheParser = "cache-parser", r.DetectionParser = "detection-parser", r.MaskEffect = "mask-effect", r.BlendMode = "blend-mode", r.TextureSource = "texture-source", r.Environment = "environment", r.ShapeBuilder = "shape-builder", r.Batcher = "batcher", r))(x$1 || {});
const nn = (r) => {
  if (typeof r == "function" || typeof r == "object" && r.extension) {
    const t = typeof r.extension != "object" ? { type: r.extension } : r.extension;
    r = Ry(Du({}, t), { ref: r });
  }
  if (typeof r == "object") r = Du({}, r);
  else throw new Error("Invalid extension type");
  return typeof r.type == "string" && (r.type = [r.type]), r;
}, pr = (r, t) => {
  var e;
  return (e = nn(r).priority) != null ? e : t;
}, G$1 = { _addHandlers: {}, _removeHandlers: {}, _queue: {}, remove(...r) {
  return r.map(nn).forEach((t) => {
    t.type.forEach((e) => {
      var s, i;
      return (i = (s = this._removeHandlers)[e]) == null ? void 0 : i.call(s, t);
    });
  }), this;
}, add(...r) {
  return r.map(nn).forEach((t) => {
    t.type.forEach((e) => {
      var s, i;
      const n = this._addHandlers, o = this._queue;
      n[e] ? (i = n[e]) == null || i.call(n, t) : (o[e] = o[e] || [], (s = o[e]) == null || s.push(t));
    });
  }), this;
}, handle(r, t, e) {
  var s;
  const i = this._addHandlers, n = this._removeHandlers;
  i[r] = t, n[r] = e;
  const o = this._queue;
  return o[r] && ((s = o[r]) == null || s.forEach((a) => t(a)), delete o[r]), this;
}, handleByMap(r, t) {
  return this.handle(r, (e) => {
    e.name && (t[e.name] = e.ref);
  }, (e) => {
    e.name && delete t[e.name];
  });
}, handleByNamedList(r, t, e = -1) {
  return this.handle(r, (s) => {
    t.findIndex((i) => i.name === s.name) >= 0 || (t.push({ name: s.name, value: s.ref }), t.sort((i, n) => pr(n.value, e) - pr(i.value, e)));
  }, (s) => {
    const i = t.findIndex((n) => n.name === s.name);
    i !== -1 && t.splice(i, 1);
  });
}, handleByList(r, t, e = -1) {
  return this.handle(r, (s) => {
    t.includes(s.ref) || (t.push(s.ref), t.sort((i, n) => pr(n, e) - pr(i, e)));
  }, (s) => {
    const i = t.indexOf(s.ref);
    i !== -1 && t.splice(i, 1);
  });
}, mixin(r, ...t) {
  for (const e of t) Object.defineProperties(r.prototype, Object.getOwnPropertyDescriptors(e));
} };
function Uu(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var on = { exports: {} };
(function(r) {
  var t = Object.prototype.hasOwnProperty, e = "~";
  function s() {
  }
  Object.create && (s.prototype = /* @__PURE__ */ Object.create(null), new s().__proto__ || (e = false));
  function i(l3, u3, c) {
    this.fn = l3, this.context = u3, this.once = c || false;
  }
  function n(l3, u3, c, h, d) {
    if (typeof c != "function") throw new TypeError("The listener must be a function");
    var p = new i(c, h || l3, d), f2 = e ? e + u3 : u3;
    return l3._events[f2] ? l3._events[f2].fn ? l3._events[f2] = [l3._events[f2], p] : l3._events[f2].push(p) : (l3._events[f2] = p, l3._eventsCount++), l3;
  }
  function o(l3, u3) {
    --l3._eventsCount === 0 ? l3._events = new s() : delete l3._events[u3];
  }
  function a() {
    this._events = new s(), this._eventsCount = 0;
  }
  a.prototype.eventNames = function() {
    var u3 = [], c, h;
    if (this._eventsCount === 0) return u3;
    for (h in c = this._events) t.call(c, h) && u3.push(e ? h.slice(1) : h);
    return Object.getOwnPropertySymbols ? u3.concat(Object.getOwnPropertySymbols(c)) : u3;
  }, a.prototype.listeners = function(u3) {
    var c = e ? e + u3 : u3, h = this._events[c];
    if (!h) return [];
    if (h.fn) return [h.fn];
    for (var d = 0, p = h.length, f2 = new Array(p); d < p; d++) f2[d] = h[d].fn;
    return f2;
  }, a.prototype.listenerCount = function(u3) {
    var c = e ? e + u3 : u3, h = this._events[c];
    return h ? h.fn ? 1 : h.length : 0;
  }, a.prototype.emit = function(u3, c, h, d, p, f2) {
    var g = e ? e + u3 : u3;
    if (!this._events[g]) return false;
    var m3 = this._events[g], _ = arguments.length, b, v4;
    if (m3.fn) {
      switch (m3.once && this.removeListener(u3, m3.fn, void 0, true), _) {
        case 1:
          return m3.fn.call(m3.context), true;
        case 2:
          return m3.fn.call(m3.context, c), true;
        case 3:
          return m3.fn.call(m3.context, c, h), true;
        case 4:
          return m3.fn.call(m3.context, c, h, d), true;
        case 5:
          return m3.fn.call(m3.context, c, h, d, p), true;
        case 6:
          return m3.fn.call(m3.context, c, h, d, p, f2), true;
      }
      for (v4 = 1, b = new Array(_ - 1); v4 < _; v4++) b[v4 - 1] = arguments[v4];
      m3.fn.apply(m3.context, b);
    } else {
      var y4 = m3.length, S3;
      for (v4 = 0; v4 < y4; v4++) switch (m3[v4].once && this.removeListener(u3, m3[v4].fn, void 0, true), _) {
        case 1:
          m3[v4].fn.call(m3[v4].context);
          break;
        case 2:
          m3[v4].fn.call(m3[v4].context, c);
          break;
        case 3:
          m3[v4].fn.call(m3[v4].context, c, h);
          break;
        case 4:
          m3[v4].fn.call(m3[v4].context, c, h, d);
          break;
        default:
          if (!b) for (S3 = 1, b = new Array(_ - 1); S3 < _; S3++) b[S3 - 1] = arguments[S3];
          m3[v4].fn.apply(m3[v4].context, b);
      }
    }
    return true;
  }, a.prototype.on = function(u3, c, h) {
    return n(this, u3, c, h, false);
  }, a.prototype.once = function(u3, c, h) {
    return n(this, u3, c, h, true);
  }, a.prototype.removeListener = function(u3, c, h, d) {
    var p = e ? e + u3 : u3;
    if (!this._events[p]) return this;
    if (!c) return o(this, p), this;
    var f2 = this._events[p];
    if (f2.fn) f2.fn === c && (!d || f2.once) && (!h || f2.context === h) && o(this, p);
    else {
      for (var g = 0, m3 = [], _ = f2.length; g < _; g++) (f2[g].fn !== c || d && !f2[g].once || h && f2[g].context !== h) && m3.push(f2[g]);
      m3.length ? this._events[p] = m3.length === 1 ? m3[0] : m3 : o(this, p);
    }
    return this;
  }, a.prototype.removeAllListeners = function(u3) {
    var c;
    return u3 ? (c = e ? e + u3 : u3, this._events[c] && o(this, c)) : (this._events = new s(), this._eventsCount = 0), this;
  }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = e, a.EventEmitter = a, r.exports = a;
})(on);
var My = on.exports, dt = Uu(My), Cy = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) }, Wt = function(r) {
  return typeof r == "string" ? r.length > 0 : typeof r == "number";
}, it$1 = function(r, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = Math.pow(10, t)), Math.round(e * r) / e + 0;
}, wt$1 = function(r, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = 1), r > e ? e : r > t ? r : t;
}, ku = function(r) {
  return (r = isFinite(r) ? r % 360 : 0) > 0 ? r : r + 360;
}, $u = function(r) {
  return { r: wt$1(r.r, 0, 255), g: wt$1(r.g, 0, 255), b: wt$1(r.b, 0, 255), a: wt$1(r.a) };
}, an = function(r) {
  return { r: it$1(r.r), g: it$1(r.g), b: it$1(r.b), a: it$1(r.a, 3) };
}, Oy = /^#([0-9a-f]{3,8})$/i, ds = function(r) {
  var t = r.toString(16);
  return t.length < 2 ? "0" + t : t;
}, Lu = function(r) {
  var t = r.r, e = r.g, s = r.b, i = r.a, n = Math.max(t, e, s), o = n - Math.min(t, e, s), a = o ? n === t ? (e - s) / o : n === e ? 2 + (s - t) / o : 4 + (t - e) / o : 0;
  return { h: 60 * (a < 0 ? a + 6 : a), s: n ? o / n * 100 : 0, v: n / 255 * 100, a: i };
}, Nu = function(r) {
  var t = r.h, e = r.s, s = r.v, i = r.a;
  t = t / 360 * 6, e /= 100, s /= 100;
  var n = Math.floor(t), o = s * (1 - e), a = s * (1 - (t - n) * e), l3 = s * (1 - (1 - t + n) * e), u3 = n % 6;
  return { r: 255 * [s, a, o, o, l3, s][u3], g: 255 * [l3, s, s, a, o, o][u3], b: 255 * [o, o, l3, s, s, a][u3], a: i };
}, Xu = function(r) {
  return { h: ku(r.h), s: wt$1(r.s, 0, 100), l: wt$1(r.l, 0, 100), a: wt$1(r.a) };
}, Hu = function(r) {
  return { h: it$1(r.h), s: it$1(r.s), l: it$1(r.l), a: it$1(r.a, 3) };
}, ju = function(r) {
  return Nu((e = (t = r).s, { h: t.h, s: (e *= ((s = t.l) < 50 ? s : 100 - s) / 100) > 0 ? 2 * e / (s + e) * 100 : 0, v: s + e, a: t.a }));
  var t, e, s;
}, fr = function(r) {
  return { h: (t = Lu(r)).h, s: (i = (200 - (e = t.s)) * (s = t.v) / 100) > 0 && i < 200 ? e * s / 100 / (i <= 100 ? i : 200 - i) * 100 : 0, l: i / 2, a: t.a };
  var t, e, s, i;
}, Gy = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Iy = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, By = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Fy = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, ln = { string: [[function(r) {
  var t = Oy.exec(r);
  return t ? (r = t[1]).length <= 4 ? { r: parseInt(r[0] + r[0], 16), g: parseInt(r[1] + r[1], 16), b: parseInt(r[2] + r[2], 16), a: r.length === 4 ? it$1(parseInt(r[3] + r[3], 16) / 255, 2) : 1 } : r.length === 6 || r.length === 8 ? { r: parseInt(r.substr(0, 2), 16), g: parseInt(r.substr(2, 2), 16), b: parseInt(r.substr(4, 2), 16), a: r.length === 8 ? it$1(parseInt(r.substr(6, 2), 16) / 255, 2) : 1 } : null : null;
}, "hex"], [function(r) {
  var t = By.exec(r) || Fy.exec(r);
  return t ? t[2] !== t[4] || t[4] !== t[6] ? null : $u({ r: Number(t[1]) / (t[2] ? 100 / 255 : 1), g: Number(t[3]) / (t[4] ? 100 / 255 : 1), b: Number(t[5]) / (t[6] ? 100 / 255 : 1), a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1) }) : null;
}, "rgb"], [function(r) {
  var t = Gy.exec(r) || Iy.exec(r);
  if (!t) return null;
  var e, s, i = Xu({ h: (e = t[1], s = t[2], s === void 0 && (s = "deg"), Number(e) * (Cy[s] || 1)), s: Number(t[3]), l: Number(t[4]), a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1) });
  return ju(i);
}, "hsl"]], object: [[function(r) {
  var t = r.r, e = r.g, s = r.b, i = r.a, n = i === void 0 ? 1 : i;
  return Wt(t) && Wt(e) && Wt(s) ? $u({ r: Number(t), g: Number(e), b: Number(s), a: Number(n) }) : null;
}, "rgb"], [function(r) {
  var t = r.h, e = r.s, s = r.l, i = r.a, n = i === void 0 ? 1 : i;
  if (!Wt(t) || !Wt(e) || !Wt(s)) return null;
  var o = Xu({ h: Number(t), s: Number(e), l: Number(s), a: Number(n) });
  return ju(o);
}, "hsl"], [function(r) {
  var t = r.h, e = r.s, s = r.v, i = r.a, n = i === void 0 ? 1 : i;
  if (!Wt(t) || !Wt(e) || !Wt(s)) return null;
  var o = function(a) {
    return { h: ku(a.h), s: wt$1(a.s, 0, 100), v: wt$1(a.v, 0, 100), a: wt$1(a.a) };
  }({ h: Number(t), s: Number(e), v: Number(s), a: Number(n) });
  return Nu(o);
}, "hsv"]] }, zu = function(r, t) {
  for (var e = 0; e < t.length; e++) {
    var s = t[e][0](r);
    if (s) return [s, t[e][1]];
  }
  return [null, void 0];
}, Vu = function(r) {
  return typeof r == "string" ? zu(r.trim(), ln.string) : typeof r == "object" && r !== null ? zu(r, ln.object) : [null, void 0];
}, un = function(r, t) {
  var e = fr(r);
  return { h: e.h, s: wt$1(e.s + 100 * t, 0, 100), l: e.l, a: e.a };
}, cn = function(r) {
  return (299 * r.r + 587 * r.g + 114 * r.b) / 1e3 / 255;
}, Wu = function(r, t) {
  var e = fr(r);
  return { h: e.h, s: e.s, l: wt$1(e.l + 100 * t, 0, 100), a: e.a };
}, ps = function() {
  function r(t) {
    this.parsed = Vu(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  return r.prototype.isValid = function() {
    return this.parsed !== null;
  }, r.prototype.brightness = function() {
    return it$1(cn(this.rgba), 2);
  }, r.prototype.isDark = function() {
    return cn(this.rgba) < 0.5;
  }, r.prototype.isLight = function() {
    return cn(this.rgba) >= 0.5;
  }, r.prototype.toHex = function() {
    return t = an(this.rgba), e = t.r, s = t.g, i = t.b, o = (n = t.a) < 1 ? ds(it$1(255 * n)) : "", "#" + ds(e) + ds(s) + ds(i) + o;
    var t, e, s, i, n, o;
  }, r.prototype.toRgb = function() {
    return an(this.rgba);
  }, r.prototype.toRgbString = function() {
    return t = an(this.rgba), e = t.r, s = t.g, i = t.b, (n = t.a) < 1 ? "rgba(" + e + ", " + s + ", " + i + ", " + n + ")" : "rgb(" + e + ", " + s + ", " + i + ")";
    var t, e, s, i, n;
  }, r.prototype.toHsl = function() {
    return Hu(fr(this.rgba));
  }, r.prototype.toHslString = function() {
    return t = Hu(fr(this.rgba)), e = t.h, s = t.s, i = t.l, (n = t.a) < 1 ? "hsla(" + e + ", " + s + "%, " + i + "%, " + n + ")" : "hsl(" + e + ", " + s + "%, " + i + "%)";
    var t, e, s, i, n;
  }, r.prototype.toHsv = function() {
    return t = Lu(this.rgba), { h: it$1(t.h), s: it$1(t.s), v: it$1(t.v), a: it$1(t.a, 3) };
    var t;
  }, r.prototype.invert = function() {
    return kt({ r: 255 - (t = this.rgba).r, g: 255 - t.g, b: 255 - t.b, a: t.a });
    var t;
  }, r.prototype.saturate = function(t) {
    return t === void 0 && (t = 0.1), kt(un(this.rgba, t));
  }, r.prototype.desaturate = function(t) {
    return t === void 0 && (t = 0.1), kt(un(this.rgba, -t));
  }, r.prototype.grayscale = function() {
    return kt(un(this.rgba, -1));
  }, r.prototype.lighten = function(t) {
    return t === void 0 && (t = 0.1), kt(Wu(this.rgba, t));
  }, r.prototype.darken = function(t) {
    return t === void 0 && (t = 0.1), kt(Wu(this.rgba, -t));
  }, r.prototype.rotate = function(t) {
    return t === void 0 && (t = 15), this.hue(this.hue() + t);
  }, r.prototype.alpha = function(t) {
    return typeof t == "number" ? kt({ r: (e = this.rgba).r, g: e.g, b: e.b, a: t }) : it$1(this.rgba.a, 3);
    var e;
  }, r.prototype.hue = function(t) {
    var e = fr(this.rgba);
    return typeof t == "number" ? kt({ h: t, s: e.s, l: e.l, a: e.a }) : it$1(e.h);
  }, r.prototype.isEqual = function(t) {
    return this.toHex() === kt(t).toHex();
  }, r;
}(), kt = function(r) {
  return r instanceof ps ? r : new ps(r);
}, Yu = [], Dy = function(r) {
  r.forEach(function(t) {
    Yu.indexOf(t) < 0 && (t(ps, ln), Yu.push(t));
  });
};
function Uy(r, t) {
  var e = { white: "#ffffff", bisque: "#ffe4c4", blue: "#0000ff", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", antiquewhite: "#faebd7", aqua: "#00ffff", azure: "#f0ffff", whitesmoke: "#f5f5f5", papayawhip: "#ffefd5", plum: "#dda0dd", blanchedalmond: "#ffebcd", black: "#000000", gold: "#ffd700", goldenrod: "#daa520", gainsboro: "#dcdcdc", cornsilk: "#fff8dc", cornflowerblue: "#6495ed", burlywood: "#deb887", aquamarine: "#7fffd4", beige: "#f5f5dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkkhaki: "#bdb76b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", peachpuff: "#ffdab9", darkmagenta: "#8b008b", darkred: "#8b0000", darkorchid: "#9932cc", darkorange: "#ff8c00", darkslateblue: "#483d8b", gray: "#808080", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", deeppink: "#ff1493", deepskyblue: "#00bfff", wheat: "#f5deb3", firebrick: "#b22222", floralwhite: "#fffaf0", ghostwhite: "#f8f8ff", darkviolet: "#9400d3", magenta: "#ff00ff", green: "#008000", dodgerblue: "#1e90ff", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", blueviolet: "#8a2be2", forestgreen: "#228b22", lawngreen: "#7cfc00", indianred: "#cd5c5c", indigo: "#4b0082", fuchsia: "#ff00ff", brown: "#a52a2a", maroon: "#800000", mediumblue: "#0000cd", lightcoral: "#f08080", darkturquoise: "#00ced1", lightcyan: "#e0ffff", ivory: "#fffff0", lightyellow: "#ffffe0", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", linen: "#faf0e6", mediumaquamarine: "#66cdaa", lemonchiffon: "#fffacd", lime: "#00ff00", khaki: "#f0e68c", mediumseagreen: "#3cb371", limegreen: "#32cd32", mediumspringgreen: "#00fa9a", lightskyblue: "#87cefa", lightblue: "#add8e6", midnightblue: "#191970", lightpink: "#ffb6c1", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", mintcream: "#f5fffa", lightslategray: "#778899", lightslategrey: "#778899", navajowhite: "#ffdead", navy: "#000080", mediumvioletred: "#c71585", powderblue: "#b0e0e6", palegoldenrod: "#eee8aa", oldlace: "#fdf5e6", paleturquoise: "#afeeee", mediumturquoise: "#48d1cc", mediumorchid: "#ba55d3", rebeccapurple: "#663399", lightsteelblue: "#b0c4de", mediumslateblue: "#7b68ee", thistle: "#d8bfd8", tan: "#d2b48c", orchid: "#da70d6", mediumpurple: "#9370db", purple: "#800080", pink: "#ffc0cb", skyblue: "#87ceeb", springgreen: "#00ff7f", palegreen: "#98fb98", red: "#ff0000", yellow: "#ffff00", slateblue: "#6a5acd", lavenderblush: "#fff0f5", peru: "#cd853f", palevioletred: "#db7093", violet: "#ee82ee", teal: "#008080", slategray: "#708090", slategrey: "#708090", aliceblue: "#f0f8ff", darkseagreen: "#8fbc8f", darkolivegreen: "#556b2f", greenyellow: "#adff2f", seagreen: "#2e8b57", seashell: "#fff5ee", tomato: "#ff6347", silver: "#c0c0c0", sienna: "#a0522d", lavender: "#e6e6fa", lightgreen: "#90ee90", orange: "#ffa500", orangered: "#ff4500", steelblue: "#4682b4", royalblue: "#4169e1", turquoise: "#40e0d0", yellowgreen: "#9acd32", salmon: "#fa8072", saddlebrown: "#8b4513", sandybrown: "#f4a460", rosybrown: "#bc8f8f", darksalmon: "#e9967a", lightgoldenrodyellow: "#fafad2", snow: "#fffafa", lightgrey: "#d3d3d3", lightgray: "#d3d3d3", dimgray: "#696969", dimgrey: "#696969", olivedrab: "#6b8e23", olive: "#808000" }, s = {};
  for (var i in e) s[e[i]] = i;
  var n = {};
  r.prototype.toName = function(o) {
    if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b)) return "transparent";
    var a, l3, u3 = s[this.toHex()];
    if (u3) return u3;
    if (o != null && o.closest) {
      var c = this.toRgb(), h = 1 / 0, d = "black";
      if (!n.length) for (var p in e) n[p] = new r(e[p]).toRgb();
      for (var f2 in e) {
        var g = (a = c, l3 = n[f2], Math.pow(a.r - l3.r, 2) + Math.pow(a.g - l3.g, 2) + Math.pow(a.b - l3.b, 2));
        g < h && (h = g, d = f2);
      }
      return d;
    }
  }, t.string.push([function(o) {
    var a = o.toLowerCase(), l3 = a === "transparent" ? "#0000" : e[a];
    return l3 ? new r(l3).toRgb() : null;
  }, "name"]);
}
var ky = Object.defineProperty, Ku = Object.getOwnPropertySymbols, $y = Object.prototype.hasOwnProperty, Ly = Object.prototype.propertyIsEnumerable, qu = (r, t, e) => t in r ? ky(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Ny = (r, t) => {
  for (var e in t || (t = {})) $y.call(t, e) && qu(r, e, t[e]);
  if (Ku) for (var e of Ku(t)) Ly.call(t, e) && qu(r, e, t[e]);
  return r;
};
Dy([Uy]);
const Oe = class is {
  constructor(t = 16777215) {
    this._value = null, this._components = new Float32Array(4), this._components.fill(1), this._int = 16777215, this.value = t;
  }
  get red() {
    return this._components[0];
  }
  get green() {
    return this._components[1];
  }
  get blue() {
    return this._components[2];
  }
  get alpha() {
    return this._components[3];
  }
  setValue(t) {
    return this.value = t, this;
  }
  set value(t) {
    if (t instanceof is) this._value = this._cloneSource(t._value), this._int = t._int, this._components.set(t._components);
    else {
      if (t === null) throw new Error("Cannot set Color#value to null");
      (this._value === null || !this._isSourceEqual(this._value, t)) && (this._value = this._cloneSource(t), this._normalize(this._value));
    }
  }
  get value() {
    return this._value;
  }
  _cloneSource(t) {
    return typeof t == "string" || typeof t == "number" || t instanceof Number || t === null ? t : Array.isArray(t) || ArrayBuffer.isView(t) ? t.slice(0) : typeof t == "object" && t !== null ? Ny({}, t) : t;
  }
  _isSourceEqual(t, e) {
    const s = typeof t;
    if (s !== typeof e) return false;
    if (s === "number" || s === "string" || t instanceof Number) return t === e;
    if (Array.isArray(t) && Array.isArray(e) || ArrayBuffer.isView(t) && ArrayBuffer.isView(e)) return t.length !== e.length ? false : t.every((i, n) => i === e[n]);
    if (t !== null && e !== null) {
      const i = Object.keys(t), n = Object.keys(e);
      return i.length !== n.length ? false : i.every((o) => t[o] === e[o]);
    }
    return t === e;
  }
  toRgba() {
    const [t, e, s, i] = this._components;
    return { r: t, g: e, b: s, a: i };
  }
  toRgb() {
    const [t, e, s] = this._components;
    return { r: t, g: e, b: s };
  }
  toRgbaString() {
    const [t, e, s] = this.toUint8RgbArray();
    return `rgba(${t},${e},${s},${this.alpha})`;
  }
  toUint8RgbArray(t) {
    const [e, s, i] = this._components;
    return this._arrayRgb || (this._arrayRgb = []), t || (t = this._arrayRgb), t[0] = Math.round(e * 255), t[1] = Math.round(s * 255), t[2] = Math.round(i * 255), t;
  }
  toArray(t) {
    this._arrayRgba || (this._arrayRgba = []), t || (t = this._arrayRgba);
    const [e, s, i, n] = this._components;
    return t[0] = e, t[1] = s, t[2] = i, t[3] = n, t;
  }
  toRgbArray(t) {
    this._arrayRgb || (this._arrayRgb = []), t || (t = this._arrayRgb);
    const [e, s, i] = this._components;
    return t[0] = e, t[1] = s, t[2] = i, t;
  }
  toNumber() {
    return this._int;
  }
  toBgrNumber() {
    const [t, e, s] = this.toUint8RgbArray();
    return (s << 16) + (e << 8) + t;
  }
  toLittleEndianNumber() {
    const t = this._int;
    return (t >> 16) + (t & 65280) + ((t & 255) << 16);
  }
  multiply(t) {
    const [e, s, i, n] = is._temp.setValue(t)._components;
    return this._components[0] *= e, this._components[1] *= s, this._components[2] *= i, this._components[3] *= n, this._refreshInt(), this._value = null, this;
  }
  premultiply(t, e = true) {
    return e && (this._components[0] *= t, this._components[1] *= t, this._components[2] *= t), this._components[3] = t, this._refreshInt(), this._value = null, this;
  }
  toPremultiplied(t, e = true) {
    if (t === 1) return (255 << 24) + this._int;
    if (t === 0) return e ? 0 : this._int;
    let s = this._int >> 16 & 255, i = this._int >> 8 & 255, n = this._int & 255;
    return e && (s = s * t + 0.5 | 0, i = i * t + 0.5 | 0, n = n * t + 0.5 | 0), (t * 255 << 24) + (s << 16) + (i << 8) + n;
  }
  toHex() {
    const t = this._int.toString(16);
    return `#${"000000".substring(0, 6 - t.length) + t}`;
  }
  toHexa() {
    const t = Math.round(this._components[3] * 255).toString(16);
    return this.toHex() + "00".substring(0, 2 - t.length) + t;
  }
  setAlpha(t) {
    return this._components[3] = this._clamp(t), this;
  }
  _normalize(t) {
    let e, s, i, n;
    if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
      const o = t;
      e = (o >> 16 & 255) / 255, s = (o >> 8 & 255) / 255, i = (o & 255) / 255, n = 1;
    } else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4) t = this._clamp(t), [e, s, i, n = 1] = t;
    else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4) t = this._clamp(t, 0, 255), [e, s, i, n = 255] = t, e /= 255, s /= 255, i /= 255, n /= 255;
    else if (typeof t == "string" || typeof t == "object") {
      if (typeof t == "string") {
        const a = is.HEX_PATTERN.exec(t);
        a && (t = `#${a[2]}`);
      }
      const o = kt(t);
      o.isValid() && ({ r: e, g: s, b: i, a: n } = o.rgba, e /= 255, s /= 255, i /= 255);
    }
    if (e !== void 0) this._components[0] = e, this._components[1] = s, this._components[2] = i, this._components[3] = n, this._refreshInt();
    else throw new Error(`Unable to convert color ${t}`);
  }
  _refreshInt() {
    this._clamp(this._components);
    const [t, e, s] = this._components;
    this._int = (t * 255 << 16) + (e * 255 << 8) + (s * 255 | 0);
  }
  _clamp(t, e = 0, s = 1) {
    return typeof t == "number" ? Math.min(Math.max(t, e), s) : (t.forEach((i, n) => {
      t[n] = Math.min(Math.max(i, e), s);
    }), t);
  }
  static isColorLike(t) {
    return typeof t == "number" || typeof t == "string" || t instanceof Number || t instanceof is || Array.isArray(t) || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Float32Array || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 && t.a !== void 0;
  }
};
Oe.shared = new Oe(), Oe._temp = new Oe(), Oe.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
let X = Oe;
const Zu = { cullArea: null, cullable: false, cullableChildren: true }, Qu = Math.PI * 2, Ju = 180 / Math.PI, tc = Math.PI / 180;
let z$1 = class z {
  constructor(t = 0, e = 0) {
    this.x = 0, this.y = 0, this.x = t, this.y = e;
  }
  clone() {
    return new z(this.x, this.y);
  }
  copyFrom(t) {
    return this.set(t.x, t.y), this;
  }
  copyTo(t) {
    return t.set(this.x, this.y), t;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  set(t = 0, e = t) {
    return this.x = t, this.y = e, this;
  }
  static get shared() {
    return hn.x = 0, hn.y = 0, hn;
  }
};
const hn = new z$1();
let R$1 = class R {
  constructor(t = 1, e = 0, s = 0, i = 1, n = 0, o = 0) {
    this.array = null, this.a = t, this.b = e, this.c = s, this.d = i, this.tx = n, this.ty = o;
  }
  fromArray(t) {
    this.a = t[0], this.b = t[1], this.c = t[3], this.d = t[4], this.tx = t[2], this.ty = t[5];
  }
  set(t, e, s, i, n, o) {
    return this.a = t, this.b = e, this.c = s, this.d = i, this.tx = n, this.ty = o, this;
  }
  toArray(t, e) {
    this.array || (this.array = new Float32Array(9));
    const s = e || this.array;
    return t ? (s[0] = this.a, s[1] = this.b, s[2] = 0, s[3] = this.c, s[4] = this.d, s[5] = 0, s[6] = this.tx, s[7] = this.ty, s[8] = 1) : (s[0] = this.a, s[1] = this.c, s[2] = this.tx, s[3] = this.b, s[4] = this.d, s[5] = this.ty, s[6] = 0, s[7] = 0, s[8] = 1), s;
  }
  apply(t, e) {
    e = e || new z$1();
    const s = t.x, i = t.y;
    return e.x = this.a * s + this.c * i + this.tx, e.y = this.b * s + this.d * i + this.ty, e;
  }
  applyInverse(t, e) {
    e = e || new z$1();
    const s = this.a, i = this.b, n = this.c, o = this.d, a = this.tx, l3 = this.ty, u3 = 1 / (s * o + n * -i), c = t.x, h = t.y;
    return e.x = o * u3 * c + -n * u3 * h + (l3 * n - a * o) * u3, e.y = s * u3 * h + -i * u3 * c + (-l3 * s + a * i) * u3, e;
  }
  translate(t, e) {
    return this.tx += t, this.ty += e, this;
  }
  scale(t, e) {
    return this.a *= t, this.d *= e, this.c *= t, this.b *= e, this.tx *= t, this.ty *= e, this;
  }
  rotate(t) {
    const e = Math.cos(t), s = Math.sin(t), i = this.a, n = this.c, o = this.tx;
    return this.a = i * e - this.b * s, this.b = i * s + this.b * e, this.c = n * e - this.d * s, this.d = n * s + this.d * e, this.tx = o * e - this.ty * s, this.ty = o * s + this.ty * e, this;
  }
  append(t) {
    const e = this.a, s = this.b, i = this.c, n = this.d;
    return this.a = t.a * e + t.b * i, this.b = t.a * s + t.b * n, this.c = t.c * e + t.d * i, this.d = t.c * s + t.d * n, this.tx = t.tx * e + t.ty * i + this.tx, this.ty = t.tx * s + t.ty * n + this.ty, this;
  }
  appendFrom(t, e) {
    const s = t.a, i = t.b, n = t.c, o = t.d, a = t.tx, l3 = t.ty, u3 = e.a, c = e.b, h = e.c, d = e.d;
    return this.a = s * u3 + i * h, this.b = s * c + i * d, this.c = n * u3 + o * h, this.d = n * c + o * d, this.tx = a * u3 + l3 * h + e.tx, this.ty = a * c + l3 * d + e.ty, this;
  }
  setTransform(t, e, s, i, n, o, a, l3, u3) {
    return this.a = Math.cos(a + u3) * n, this.b = Math.sin(a + u3) * n, this.c = -Math.sin(a - l3) * o, this.d = Math.cos(a - l3) * o, this.tx = t - (s * this.a + i * this.c), this.ty = e - (s * this.b + i * this.d), this;
  }
  prepend(t) {
    const e = this.tx;
    if (t.a !== 1 || t.b !== 0 || t.c !== 0 || t.d !== 1) {
      const s = this.a, i = this.c;
      this.a = s * t.a + this.b * t.c, this.b = s * t.b + this.b * t.d, this.c = i * t.a + this.d * t.c, this.d = i * t.b + this.d * t.d;
    }
    return this.tx = e * t.a + this.ty * t.c + t.tx, this.ty = e * t.b + this.ty * t.d + t.ty, this;
  }
  decompose(t) {
    const e = this.a, s = this.b, i = this.c, n = this.d, o = t.pivot, a = -Math.atan2(-i, n), l3 = Math.atan2(s, e), u3 = Math.abs(a + l3);
    return u3 < 1e-5 || Math.abs(Qu - u3) < 1e-5 ? (t.rotation = l3, t.skew.x = t.skew.y = 0) : (t.rotation = 0, t.skew.x = a, t.skew.y = l3), t.scale.x = Math.sqrt(e * e + s * s), t.scale.y = Math.sqrt(i * i + n * n), t.position.x = this.tx + (o.x * e + o.y * i), t.position.y = this.ty + (o.x * s + o.y * n), t;
  }
  invert() {
    const t = this.a, e = this.b, s = this.c, i = this.d, n = this.tx, o = t * i - e * s;
    return this.a = i / o, this.b = -e / o, this.c = -s / o, this.d = t / o, this.tx = (s * this.ty - i * n) / o, this.ty = -(t * this.ty - e * n) / o, this;
  }
  isIdentity() {
    return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
  }
  identity() {
    return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
  }
  clone() {
    const t = new R();
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  copyTo(t) {
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  copyFrom(t) {
    return this.a = t.a, this.b = t.b, this.c = t.c, this.d = t.d, this.tx = t.tx, this.ty = t.ty, this;
  }
  equals(t) {
    return t.a === this.a && t.b === this.b && t.c === this.c && t.d === this.d && t.tx === this.tx && t.ty === this.ty;
  }
  static get IDENTITY() {
    return Hy.identity();
  }
  static get shared() {
    return Xy.identity();
  }
};
const Xy = new R$1(), Hy = new R$1();
class rt {
  constructor(t, e, s) {
    this._x = e || 0, this._y = s || 0, this._observer = t;
  }
  clone(t) {
    return new rt(t != null ? t : this._observer, this._x, this._y);
  }
  set(t = 0, e = t) {
    return (this._x !== t || this._y !== e) && (this._x = t, this._y = e, this._observer._onUpdate(this)), this;
  }
  copyFrom(t) {
    return (this._x !== t.x || this._y !== t.y) && (this._x = t.x, this._y = t.y, this._observer._onUpdate(this)), this;
  }
  copyTo(t) {
    return t.set(this._x, this._y), t;
  }
  equals(t) {
    return t.x === this._x && t.y === this._y;
  }
  get x() {
    return this._x;
  }
  set x(t) {
    this._x !== t && (this._x = t, this._observer._onUpdate(this));
  }
  get y() {
    return this._y;
  }
  set y(t) {
    this._y !== t && (this._y = t, this._observer._onUpdate(this));
  }
}
const mr = { default: -1 };
function Y(r = "default") {
  return mr[r] === void 0 && (mr[r] = -1), ++mr[r];
}
class fs {
  constructor(t, e) {
    this._pool = [], this._count = 0, this._index = 0, this._classType = t, e && this.prepopulate(e);
  }
  prepopulate(t) {
    for (let e = 0; e < t; e++) this._pool[this._index++] = new this._classType();
    this._count += t;
  }
  get(t) {
    var e;
    let s;
    return this._index > 0 ? s = this._pool[--this._index] : s = new this._classType(), (e = s.init) == null || e.call(s, t), s;
  }
  return(t) {
    var e;
    (e = t.reset) == null || e.call(t), this._pool[this._index++] = t;
  }
  get totalSize() {
    return this._count;
  }
  get totalFree() {
    return this._index;
  }
  get totalUsed() {
    return this._count - this._index;
  }
  clear() {
    this._pool.length = 0, this._index = 0;
  }
}
class ec {
  constructor() {
    this._poolsByClass = /* @__PURE__ */ new Map();
  }
  prepopulate(t, e) {
    this.getPool(t).prepopulate(e);
  }
  get(t, e) {
    return this.getPool(t).get(e);
  }
  return(t) {
    this.getPool(t.constructor).return(t);
  }
  getPool(t) {
    return this._poolsByClass.has(t) || this._poolsByClass.set(t, new fs(t)), this._poolsByClass.get(t);
  }
  stats() {
    const t = {};
    return this._poolsByClass.forEach((e) => {
      const s = t[e._classType.name] ? e._classType.name + e._classType.ID : e._classType.name;
      t[s] = { free: e.totalFree, used: e.totalUsed, size: e.totalSize };
    }), t;
  }
}
const nt = new ec(), rc = { get isCachedAsTexture() {
  var r;
  return !!((r = this.renderGroup) != null && r.isCachedAsTexture);
}, cacheAsTexture(r) {
  typeof r == "boolean" && r === false ? this.disableRenderGroup() : (this.enableRenderGroup(), this.renderGroup.enableCacheAsTexture(r === true ? {} : r));
}, updateCacheTexture() {
  var r;
  (r = this.renderGroup) == null || r.updateCacheTexture();
}, get cacheAsBitmap() {
  return this.isCachedAsTexture;
}, set cacheAsBitmap(r) {
  this.cacheAsTexture(r);
} };
function dn(r, t, e) {
  const s = r.length;
  let i;
  if (t >= s || e === 0) return;
  e = t + e > s ? s - t : e;
  const n = s - e;
  for (i = t; i < n; ++i) r[i] = r[i + e];
  r.length = n;
}
const sc = { allowChildren: true, removeChildren(r = 0, t) {
  var e;
  const s = t != null ? t : this.children.length, i = s - r, n = [];
  if (i > 0 && i <= s) {
    for (let a = s - 1; a >= r; a--) {
      const l3 = this.children[a];
      l3 && (n.push(l3), l3.parent = null);
    }
    dn(this.children, r, s);
    const o = this.renderGroup || this.parentRenderGroup;
    o && o.removeChildren(n);
    for (let a = 0; a < n.length; ++a) {
      const l3 = n[a];
      (e = l3.parentRenderLayer) == null || e.detach(l3), this.emit("childRemoved", l3, this, a), n[a].emit("removed", this);
    }
    return n.length > 0 && this._didViewChangeTick++, n;
  } else if (i === 0 && this.children.length === 0) return n;
  throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
}, removeChildAt(r) {
  const t = this.getChildAt(r);
  return this.removeChild(t);
}, getChildAt(r) {
  if (r < 0 || r >= this.children.length) throw new Error(`getChildAt: Index (${r}) does not exist.`);
  return this.children[r];
}, setChildIndex(r, t) {
  if (t < 0 || t >= this.children.length) throw new Error(`The index ${t} supplied is out of bounds ${this.children.length}`);
  this.getChildIndex(r), this.addChildAt(r, t);
}, getChildIndex(r) {
  const t = this.children.indexOf(r);
  if (t === -1) throw new Error("The supplied Container must be a child of the caller");
  return t;
}, addChildAt(r, t) {
  const { children: e } = this;
  if (t < 0 || t > e.length) throw new Error(`${r}addChildAt: The index ${t} supplied is out of bounds ${e.length}`);
  if (r.parent) {
    const i = r.parent.children.indexOf(r);
    if (r.parent === this && i === t) return r;
    i !== -1 && r.parent.children.splice(i, 1);
  }
  t === e.length ? e.push(r) : e.splice(t, 0, r), r.parent = this, r.didChange = true, r._updateFlags = 15;
  const s = this.renderGroup || this.parentRenderGroup;
  return s && s.addChild(r), this.sortableChildren && (this.sortDirty = true), this.emit("childAdded", r, this, t), r.emit("added", this), r;
}, swapChildren(r, t) {
  if (r === t) return;
  const e = this.getChildIndex(r), s = this.getChildIndex(t);
  this.children[e] = t, this.children[s] = r;
  const i = this.renderGroup || this.parentRenderGroup;
  i && (i.structureDidChange = true), this._didContainerChangeTick++;
}, removeFromParent() {
  var r;
  (r = this.parent) == null || r.removeChild(this);
}, reparentChild(...r) {
  return r.length === 1 ? this.reparentChildAt(r[0], this.children.length) : (r.forEach((t) => this.reparentChildAt(t, this.children.length)), r[0]);
}, reparentChildAt(r, t) {
  if (r.parent === this) return this.setChildIndex(r, t), r;
  const e = r.worldTransform.clone();
  r.removeFromParent(), this.addChildAt(r, t);
  const s = this.worldTransform.clone();
  return s.invert(), e.prepend(s), r.setFromMatrix(e), r;
} }, ic = { collectRenderables(r, t, e) {
  this.parentRenderLayer && this.parentRenderLayer !== e || this.globalDisplayStatus < 7 || !this.includeInBuild || (this.sortableChildren && this.sortChildren(), this.isSimple ? this.collectRenderablesSimple(r, t, e) : this.renderGroup ? t.renderPipes.renderGroup.addRenderGroup(this.renderGroup, r) : this.collectRenderablesWithEffects(r, t, e));
}, collectRenderablesSimple(r, t, e) {
  const s = this.children, i = s.length;
  for (let n = 0; n < i; n++) s[n].collectRenderables(r, t, e);
}, collectRenderablesWithEffects(r, t, e) {
  const { renderPipes: s } = t;
  for (let i = 0; i < this.effects.length; i++) {
    const n = this.effects[i];
    s[n.pipe].push(n, this, r);
  }
  this.collectRenderablesSimple(r, t, e);
  for (let i = this.effects.length - 1; i >= 0; i--) {
    const n = this.effects[i];
    s[n.pipe].pop(n, this, r);
  }
} };
class gr {
  constructor() {
    this.pipe = "filter", this.priority = 1;
  }
  destroy() {
    for (let t = 0; t < this.filters.length; t++) this.filters[t].destroy();
    this.filters = null, this.filterArea = null;
  }
}
class nc {
  constructor() {
    this._effectClasses = [], this._tests = [], this._initialized = false;
  }
  init() {
    this._initialized || (this._initialized = true, this._effectClasses.forEach((t) => {
      this.add({ test: t.test, maskClass: t });
    }));
  }
  add(t) {
    this._tests.push(t);
  }
  getMaskEffect(t) {
    this._initialized || this.init();
    for (let e = 0; e < this._tests.length; e++) {
      const s = this._tests[e];
      if (s.test(t)) return nt.get(s.maskClass, t);
    }
    return t;
  }
  returnMaskEffect(t) {
    nt.return(t);
  }
}
const ms = new nc();
G$1.handleByList(x$1.MaskEffect, ms._effectClasses);
var zy = Object.defineProperty, oc = Object.getOwnPropertySymbols, Vy = Object.prototype.hasOwnProperty, Wy = Object.prototype.propertyIsEnumerable, ac = (r, t, e) => t in r ? zy(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, lc = (r, t) => {
  for (var e in t || (t = {})) Vy.call(t, e) && ac(r, e, t[e]);
  if (oc) for (var e of oc(t)) Wy.call(t, e) && ac(r, e, t[e]);
  return r;
};
const uc = { _maskEffect: null, _maskOptions: { inverse: false }, _filterEffect: null, effects: [], _markStructureAsChanged() {
  const r = this.renderGroup || this.parentRenderGroup;
  r && (r.structureDidChange = true);
}, addEffect(r) {
  this.effects.indexOf(r) === -1 && (this.effects.push(r), this.effects.sort((t, e) => t.priority - e.priority), this._markStructureAsChanged(), this._updateIsSimple());
}, removeEffect(r) {
  const t = this.effects.indexOf(r);
  t !== -1 && (this.effects.splice(t, 1), this._markStructureAsChanged(), this._updateIsSimple());
}, set mask(r) {
  const t = this._maskEffect;
  (t == null ? void 0 : t.mask) !== r && (t && (this.removeEffect(t), ms.returnMaskEffect(t), this._maskEffect = null), r != null && (this._maskEffect = ms.getMaskEffect(r), this.addEffect(this._maskEffect)));
}, get mask() {
  var r;
  return (r = this._maskEffect) == null ? void 0 : r.mask;
}, setMask(r) {
  this._maskOptions = lc(lc({}, this._maskOptions), r), r.mask && (this.mask = r.mask), this._markStructureAsChanged();
}, set filters(r) {
  var t;
  !Array.isArray(r) && r && (r = [r]);
  const e = this._filterEffect || (this._filterEffect = new gr());
  r = r;
  const s = (r == null ? void 0 : r.length) > 0, i = ((t = e.filters) == null ? void 0 : t.length) > 0, n = s !== i;
  r = Array.isArray(r) ? r.slice(0) : r, e.filters = Object.freeze(r), n && (s ? this.addEffect(e) : (this.removeEffect(e), e.filters = r != null ? r : null));
}, get filters() {
  var r;
  return (r = this._filterEffect) == null ? void 0 : r.filters;
}, set filterArea(r) {
  this._filterEffect || (this._filterEffect = new gr()), this._filterEffect.filterArea = r;
}, get filterArea() {
  var r;
  return (r = this._filterEffect) == null ? void 0 : r.filterArea;
} }, cc = { label: null, get name() {
  return this.label;
}, set name(r) {
  this.label = r;
}, getChildByName(r, t = false) {
  return this.getChildByLabel(r, t);
}, getChildByLabel(r, t = false) {
  const e = this.children;
  for (let s = 0; s < e.length; s++) {
    const i = e[s];
    if (i.label === r || r instanceof RegExp && r.test(i.label)) return i;
  }
  if (t) for (let s = 0; s < e.length; s++) {
    const i = e[s].getChildByLabel(r, true);
    if (i) return i;
  }
  return null;
}, getChildrenByLabel(r, t = false, e = []) {
  const s = this.children;
  for (let i = 0; i < s.length; i++) {
    const n = s[i];
    (n.label === r || r instanceof RegExp && r.test(n.label)) && e.push(n);
  }
  if (t) for (let i = 0; i < s.length; i++) s[i].getChildrenByLabel(r, true, e);
  return e;
} }, gs = [new z$1(), new z$1(), new z$1(), new z$1()];
let j$1 = class j {
  constructor(t = 0, e = 0, s = 0, i = 0) {
    this.type = "rectangle", this.x = Number(t), this.y = Number(e), this.width = Number(s), this.height = Number(i);
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height;
  }
  isEmpty() {
    return this.left === this.right || this.top === this.bottom;
  }
  static get EMPTY() {
    return new j(0, 0, 0, 0);
  }
  clone() {
    return new j(this.x, this.y, this.width, this.height);
  }
  copyFromBounds(t) {
    return this.x = t.minX, this.y = t.minY, this.width = t.maxX - t.minX, this.height = t.maxY - t.minY, this;
  }
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  contains(t, e) {
    return this.width <= 0 || this.height <= 0 ? false : t >= this.x && t < this.x + this.width && e >= this.y && e < this.y + this.height;
  }
  strokeContains(t, e, s, i = 0.5) {
    const { width: n, height: o } = this;
    if (n <= 0 || o <= 0) return false;
    const a = this.x, l3 = this.y, u3 = s * (1 - i), c = s - u3, h = a - u3, d = a + n + u3, p = l3 - u3, f2 = l3 + o + u3, g = a + c, m3 = a + n - c, _ = l3 + c, b = l3 + o - c;
    return t >= h && t <= d && e >= p && e <= f2 && !(t > g && t < m3 && e > _ && e < b);
  }
  intersects(t, e) {
    if (!e) {
      const O3 = this.x < t.x ? t.x : this.x;
      if ((this.right > t.right ? t.right : this.right) <= O3) return false;
      const C3 = this.y < t.y ? t.y : this.y;
      return (this.bottom > t.bottom ? t.bottom : this.bottom) > C3;
    }
    const s = this.left, i = this.right, n = this.top, o = this.bottom;
    if (i <= s || o <= n) return false;
    const a = gs[0].set(t.left, t.top), l3 = gs[1].set(t.left, t.bottom), u3 = gs[2].set(t.right, t.top), c = gs[3].set(t.right, t.bottom);
    if (u3.x <= a.x || l3.y <= a.y) return false;
    const h = Math.sign(e.a * e.d - e.b * e.c);
    if (h === 0 || (e.apply(a, a), e.apply(l3, l3), e.apply(u3, u3), e.apply(c, c), Math.max(a.x, l3.x, u3.x, c.x) <= s || Math.min(a.x, l3.x, u3.x, c.x) >= i || Math.max(a.y, l3.y, u3.y, c.y) <= n || Math.min(a.y, l3.y, u3.y, c.y) >= o)) return false;
    const d = h * (l3.y - a.y), p = h * (a.x - l3.x), f2 = d * s + p * n, g = d * i + p * n, m3 = d * s + p * o, _ = d * i + p * o;
    if (Math.max(f2, g, m3, _) <= d * a.x + p * a.y || Math.min(f2, g, m3, _) >= d * c.x + p * c.y) return false;
    const b = h * (a.y - u3.y), v4 = h * (u3.x - a.x), y4 = b * s + v4 * n, S3 = b * i + v4 * n, T4 = b * s + v4 * o, E4 = b * i + v4 * o;
    return !(Math.max(y4, S3, T4, E4) <= b * a.x + v4 * a.y || Math.min(y4, S3, T4, E4) >= b * c.x + v4 * c.y);
  }
  pad(t = 0, e = t) {
    return this.x -= t, this.y -= e, this.width += t * 2, this.height += e * 2, this;
  }
  fit(t) {
    const e = Math.max(this.x, t.x), s = Math.min(this.x + this.width, t.x + t.width), i = Math.max(this.y, t.y), n = Math.min(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = Math.max(s - e, 0), this.y = i, this.height = Math.max(n - i, 0), this;
  }
  ceil(t = 1, e = 1e-3) {
    const s = Math.ceil((this.x + this.width - e) * t) / t, i = Math.ceil((this.y + this.height - e) * t) / t;
    return this.x = Math.floor((this.x + e) * t) / t, this.y = Math.floor((this.y + e) * t) / t, this.width = s - this.x, this.height = i - this.y, this;
  }
  enlarge(t) {
    const e = Math.min(this.x, t.x), s = Math.max(this.x + this.width, t.x + t.width), i = Math.min(this.y, t.y), n = Math.max(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = s - e, this.y = i, this.height = n - i, this;
  }
  getBounds(t) {
    return t || (t = new j()), t.copyFrom(this), t;
  }
  containsRect(t) {
    if (this.width <= 0 || this.height <= 0) return false;
    const e = t.x, s = t.y, i = t.x + t.width, n = t.y + t.height;
    return e >= this.x && e < this.x + this.width && s >= this.y && s < this.y + this.height && i >= this.x && i < this.x + this.width && n >= this.y && n < this.y + this.height;
  }
  set(t, e, s, i) {
    return this.x = t, this.y = e, this.width = s, this.height = i, this;
  }
};
const hc = new R$1();
let st$1 = class st {
  constructor(t = 1 / 0, e = 1 / 0, s = -1 / 0, i = -1 / 0) {
    this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = hc, this.minX = t, this.minY = e, this.maxX = s, this.maxY = i;
  }
  isEmpty() {
    return this.minX > this.maxX || this.minY > this.maxY;
  }
  get rectangle() {
    this._rectangle || (this._rectangle = new j$1());
    const t = this._rectangle;
    return this.minX > this.maxX || this.minY > this.maxY ? (t.x = 0, t.y = 0, t.width = 0, t.height = 0) : t.copyFromBounds(this), t;
  }
  clear() {
    return this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = hc, this;
  }
  set(t, e, s, i) {
    this.minX = t, this.minY = e, this.maxX = s, this.maxY = i;
  }
  addFrame(t, e, s, i, n) {
    n || (n = this.matrix);
    const o = n.a, a = n.b, l3 = n.c, u3 = n.d, c = n.tx, h = n.ty;
    let d = this.minX, p = this.minY, f2 = this.maxX, g = this.maxY, m3 = o * t + l3 * e + c, _ = a * t + u3 * e + h;
    m3 < d && (d = m3), _ < p && (p = _), m3 > f2 && (f2 = m3), _ > g && (g = _), m3 = o * s + l3 * e + c, _ = a * s + u3 * e + h, m3 < d && (d = m3), _ < p && (p = _), m3 > f2 && (f2 = m3), _ > g && (g = _), m3 = o * t + l3 * i + c, _ = a * t + u3 * i + h, m3 < d && (d = m3), _ < p && (p = _), m3 > f2 && (f2 = m3), _ > g && (g = _), m3 = o * s + l3 * i + c, _ = a * s + u3 * i + h, m3 < d && (d = m3), _ < p && (p = _), m3 > f2 && (f2 = m3), _ > g && (g = _), this.minX = d, this.minY = p, this.maxX = f2, this.maxY = g;
  }
  addRect(t, e) {
    this.addFrame(t.x, t.y, t.x + t.width, t.y + t.height, e);
  }
  addBounds(t, e) {
    this.addFrame(t.minX, t.minY, t.maxX, t.maxY, e);
  }
  addBoundsMask(t) {
    this.minX = this.minX > t.minX ? this.minX : t.minX, this.minY = this.minY > t.minY ? this.minY : t.minY, this.maxX = this.maxX < t.maxX ? this.maxX : t.maxX, this.maxY = this.maxY < t.maxY ? this.maxY : t.maxY;
  }
  applyMatrix(t) {
    const e = this.minX, s = this.minY, i = this.maxX, n = this.maxY, { a: o, b: a, c: l3, d: u3, tx: c, ty: h } = t;
    let d = o * e + l3 * s + c, p = a * e + u3 * s + h;
    this.minX = d, this.minY = p, this.maxX = d, this.maxY = p, d = o * i + l3 * s + c, p = a * i + u3 * s + h, this.minX = d < this.minX ? d : this.minX, this.minY = p < this.minY ? p : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = p > this.maxY ? p : this.maxY, d = o * e + l3 * n + c, p = a * e + u3 * n + h, this.minX = d < this.minX ? d : this.minX, this.minY = p < this.minY ? p : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = p > this.maxY ? p : this.maxY, d = o * i + l3 * n + c, p = a * i + u3 * n + h, this.minX = d < this.minX ? d : this.minX, this.minY = p < this.minY ? p : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = p > this.maxY ? p : this.maxY;
  }
  fit(t) {
    return this.minX < t.left && (this.minX = t.left), this.maxX > t.right && (this.maxX = t.right), this.minY < t.top && (this.minY = t.top), this.maxY > t.bottom && (this.maxY = t.bottom), this;
  }
  fitBounds(t, e, s, i) {
    return this.minX < t && (this.minX = t), this.maxX > e && (this.maxX = e), this.minY < s && (this.minY = s), this.maxY > i && (this.maxY = i), this;
  }
  pad(t, e = t) {
    return this.minX -= t, this.maxX += t, this.minY -= e, this.maxY += e, this;
  }
  ceil() {
    return this.minX = Math.floor(this.minX), this.minY = Math.floor(this.minY), this.maxX = Math.ceil(this.maxX), this.maxY = Math.ceil(this.maxY), this;
  }
  clone() {
    return new st(this.minX, this.minY, this.maxX, this.maxY);
  }
  scale(t, e = t) {
    return this.minX *= t, this.minY *= e, this.maxX *= t, this.maxY *= e, this;
  }
  get x() {
    return this.minX;
  }
  set x(t) {
    const e = this.maxX - this.minX;
    this.minX = t, this.maxX = t + e;
  }
  get y() {
    return this.minY;
  }
  set y(t) {
    const e = this.maxY - this.minY;
    this.minY = t, this.maxY = t + e;
  }
  get width() {
    return this.maxX - this.minX;
  }
  set width(t) {
    this.maxX = this.minX + t;
  }
  get height() {
    return this.maxY - this.minY;
  }
  set height(t) {
    this.maxY = this.minY + t;
  }
  get left() {
    return this.minX;
  }
  get right() {
    return this.maxX;
  }
  get top() {
    return this.minY;
  }
  get bottom() {
    return this.maxY;
  }
  get isPositive() {
    return this.maxX - this.minX > 0 && this.maxY - this.minY > 0;
  }
  get isValid() {
    return this.minX + this.minY !== 1 / 0;
  }
  addVertexData(t, e, s, i) {
    let n = this.minX, o = this.minY, a = this.maxX, l3 = this.maxY;
    i || (i = this.matrix);
    const u3 = i.a, c = i.b, h = i.c, d = i.d, p = i.tx, f2 = i.ty;
    for (let g = e; g < s; g += 2) {
      const m3 = t[g], _ = t[g + 1], b = u3 * m3 + h * _ + p, v4 = c * m3 + d * _ + f2;
      n = b < n ? b : n, o = v4 < o ? v4 : o, a = b > a ? b : a, l3 = v4 > l3 ? v4 : l3;
    }
    this.minX = n, this.minY = o, this.maxX = a, this.maxY = l3;
  }
  containsPoint(t, e) {
    return this.minX <= t && this.minY <= e && this.maxX >= t && this.maxY >= e;
  }
  toString() {
    return `[pixi.js:Bounds minX=${this.minX} minY=${this.minY} maxX=${this.maxX} maxY=${this.maxY} width=${this.width} height=${this.height}]`;
  }
  copyFrom(t) {
    return this.minX = t.minX, this.minY = t.minY, this.maxX = t.maxX, this.maxY = t.maxY, this;
  }
};
const ut$1 = new fs(R$1), $t = new fs(st$1), Yy = new R$1(), dc = { getFastGlobalBounds(r, t) {
  t || (t = new st$1()), t.clear(), this._getGlobalBoundsRecursive(!!r, t, this.parentRenderLayer), t.isValid || t.set(0, 0, 0, 0);
  const e = this.renderGroup || this.parentRenderGroup;
  return t.applyMatrix(e.worldTransform), t;
}, _getGlobalBoundsRecursive(r, t, e) {
  let s = t;
  if (r && this.parentRenderLayer && this.parentRenderLayer !== e || this.localDisplayStatus !== 7 || !this.measurable) return;
  const i = !!this.effects.length;
  if ((this.renderGroup || i) && (s = $t.get().clear()), this.boundsArea) t.addRect(this.boundsArea, this.worldTransform);
  else {
    if (this.renderPipeId) {
      const o = this.bounds;
      s.addFrame(o.minX, o.minY, o.maxX, o.maxY, this.groupTransform);
    }
    const n = this.children;
    for (let o = 0; o < n.length; o++) n[o]._getGlobalBoundsRecursive(r, s, e);
  }
  if (i) {
    let n = false;
    const o = this.renderGroup || this.parentRenderGroup;
    for (let a = 0; a < this.effects.length; a++) this.effects[a].addBounds && (n || (n = true, s.applyMatrix(o.worldTransform)), this.effects[a].addBounds(s, true));
    n && (s.applyMatrix(o.worldTransform.copyTo(Yy).invert()), t.addBounds(s, this.relativeGroupTransform)), t.addBounds(s), $t.return(s);
  } else this.renderGroup && (t.addBounds(s, this.relativeGroupTransform), $t.return(s));
} };
function _r(r, t, e) {
  e.clear();
  let s, i;
  return r.parent ? t ? s = r.parent.worldTransform : (i = ut$1.get().identity(), s = _s(r, i)) : s = R$1.IDENTITY, pc(r, e, s, t), i && ut$1.return(i), e.isValid || e.set(0, 0, 0, 0), e;
}
function pc(r, t, e, s) {
  var i, n;
  if (!r.visible || !r.measurable) return;
  let o;
  s ? o = r.worldTransform : (r.updateLocalTransform(), o = ut$1.get(), o.appendFrom(r.localTransform, e));
  const a = t, l3 = !!r.effects.length;
  if (l3 && (t = $t.get().clear()), r.boundsArea) t.addRect(r.boundsArea, o);
  else {
    r.bounds && (t.matrix = o, t.addBounds(r.bounds));
    for (let u3 = 0; u3 < r.children.length; u3++) pc(r.children[u3], t, o, s);
  }
  if (l3) {
    for (let u3 = 0; u3 < r.effects.length; u3++) (n = (i = r.effects[u3]).addBounds) == null || n.call(i, t);
    a.addBounds(t, R$1.IDENTITY), $t.return(t);
  }
  s || ut$1.return(o);
}
function _s(r, t) {
  const e = r.parent;
  return e && (_s(e, t), e.updateLocalTransform(), t.append(e.localTransform)), t;
}
function pn(r, t) {
  if (r === 16777215 || !t) return t;
  if (t === 16777215 || !r) return r;
  const e = r >> 16 & 255, s = r >> 8 & 255, i = r & 255, n = t >> 16 & 255, o = t >> 8 & 255, a = t & 255, l3 = e * n / 255 | 0, u3 = s * o / 255 | 0, c = i * a / 255 | 0;
  return (l3 << 16) + (u3 << 8) + c;
}
const fc = 16777215;
function xr(r, t) {
  return r === fc ? t : t === fc ? r : pn(r, t);
}
function Ge(r) {
  return ((r & 255) << 16) + (r & 65280) + (r >> 16 & 255);
}
const mc = { getGlobalAlpha(r) {
  if (r) return this.renderGroup ? this.renderGroup.worldAlpha : this.parentRenderGroup ? this.parentRenderGroup.worldAlpha * this.alpha : this.alpha;
  let t = this.alpha, e = this.parent;
  for (; e; ) t *= e.alpha, e = e.parent;
  return t;
}, getGlobalTransform(r, t) {
  if (t) return r.copyFrom(this.worldTransform);
  this.updateLocalTransform();
  const e = _s(this, ut$1.get().identity());
  return r.appendFrom(this.localTransform, e), ut$1.return(e), r;
}, getGlobalTint(r) {
  if (r) return this.renderGroup ? Ge(this.renderGroup.worldColor) : this.parentRenderGroup ? Ge(xr(this.localColor, this.parentRenderGroup.worldColor)) : this.tint;
  let t = this.localColor, e = this.parent;
  for (; e; ) t = xr(t, e.localColor), e = e.parent;
  return Ge(t);
} };
function xs(r, t, e) {
  return t.clear(), e || (e = R$1.IDENTITY), gc(r, t, e, r, true), t.isValid || t.set(0, 0, 0, 0), t;
}
function gc(r, t, e, s, i) {
  var n, o;
  let a;
  if (i) a = ut$1.get(), a = e.copyTo(a);
  else {
    if (!r.visible || !r.measurable) return;
    r.updateLocalTransform();
    const c = r.localTransform;
    a = ut$1.get(), a.appendFrom(c, e);
  }
  const l3 = t, u3 = !!r.effects.length;
  if (u3 && (t = $t.get().clear()), r.boundsArea) t.addRect(r.boundsArea, a);
  else {
    r.renderPipeId && (t.matrix = a, t.addBounds(r.bounds));
    const c = r.children;
    for (let h = 0; h < c.length; h++) gc(c[h], t, a, s, false);
  }
  if (u3) {
    for (let c = 0; c < r.effects.length; c++) (o = (n = r.effects[c]).addLocalBounds) == null || o.call(n, t, s);
    l3.addBounds(t, R$1.IDENTITY), $t.return(t);
  }
  ut$1.return(a);
}
function fn(r, t) {
  const e = r.children;
  for (let s = 0; s < e.length; s++) {
    const i = e[s], n = i.uid, o = (i._didViewChangeTick & 65535) << 16 | i._didContainerChangeTick & 65535, a = t.index;
    (t.data[a] !== n || t.data[a + 1] !== o) && (t.data[t.index] = n, t.data[t.index + 1] = o, t.didChange = true), t.index = a + 2, i.children.length && fn(i, t);
  }
  return t.didChange;
}
const Ky = new R$1(), _c = { _localBoundsCacheId: -1, _localBoundsCacheData: null, _setWidth(r, t) {
  const e = Math.sign(this.scale.x) || 1;
  t !== 0 ? this.scale.x = r / t * e : this.scale.x = e;
}, _setHeight(r, t) {
  const e = Math.sign(this.scale.y) || 1;
  t !== 0 ? this.scale.y = r / t * e : this.scale.y = e;
}, getLocalBounds() {
  this._localBoundsCacheData || (this._localBoundsCacheData = { data: [], index: 1, didChange: false, localBounds: new st$1() });
  const r = this._localBoundsCacheData;
  return r.index = 1, r.didChange = false, r.data[0] !== this._didViewChangeTick && (r.didChange = true, r.data[0] = this._didViewChangeTick), fn(this, r), r.didChange && xs(this, r.localBounds, Ky), r.localBounds;
}, getBounds(r, t) {
  return _r(this, r, t || new st$1());
} }, xc = { _onRender: null, set onRender(r) {
  const t = this.renderGroup || this.parentRenderGroup;
  if (!r) {
    this._onRender && (t == null || t.removeOnRender(this)), this._onRender = null;
    return;
  }
  this._onRender || t == null || t.addOnRender(this), this._onRender = r;
}, get onRender() {
  return this._onRender;
} }, bc = { _zIndex: 0, sortDirty: false, sortableChildren: false, get zIndex() {
  return this._zIndex;
}, set zIndex(r) {
  this._zIndex !== r && (this._zIndex = r, this.depthOfChildModified());
}, depthOfChildModified() {
  this.parent && (this.parent.sortableChildren = true, this.parent.sortDirty = true), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = true);
}, sortChildren() {
  this.sortDirty && (this.sortDirty = false, this.children.sort(qy));
} };
function qy(r, t) {
  return r._zIndex - t._zIndex;
}
const vc = { getGlobalPosition(r = new z$1(), t = false) {
  return this.parent ? this.parent.toGlobal(this._position, r, t) : (r.x = this._position.x, r.y = this._position.y), r;
}, toGlobal(r, t, e = false) {
  const s = this.getGlobalTransform(ut$1.get(), e);
  return t = s.apply(r, t), ut$1.return(s), t;
}, toLocal(r, t, e, s) {
  t && (r = t.toGlobal(r, e, s));
  const i = this.getGlobalTransform(ut$1.get(), s);
  return e = i.applyInverse(r, e), ut$1.return(i), e;
} };
class mn {
  constructor() {
    this.uid = Y("instructionSet"), this.instructions = [], this.instructionSize = 0, this.renderables = [], this.gcTick = 0;
  }
  reset() {
    this.instructionSize = 0;
  }
  add(t) {
    this.instructions[this.instructionSize++] = t;
  }
  log() {
    this.instructions.length = this.instructionSize, console.table(this.instructions, ["type", "action"]);
  }
}
function fe(r) {
  return r += r === 0 ? 1 : 0, --r, r |= r >>> 1, r |= r >>> 2, r |= r >>> 4, r |= r >>> 8, r |= r >>> 16, r + 1;
}
function gn(r) {
  return !(r & r - 1) && !!r;
}
function It(r) {
  const t = {};
  for (const e in r) r[e] !== void 0 && (t[e] = r[e]);
  return t;
}
var Qy = Object.defineProperty, yc = Object.getOwnPropertySymbols, Jy = Object.prototype.hasOwnProperty, t0 = Object.prototype.propertyIsEnumerable, Tc = (r, t, e) => t in r ? Qy(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Sc = (r, t) => {
  for (var e in t || (t = {})) Jy.call(t, e) && Tc(r, e, t[e]);
  if (yc) for (var e of yc(t)) t0.call(t, e) && Tc(r, e, t[e]);
  return r;
};
const Ec = /* @__PURE__ */ Object.create(null);
function e0(r) {
  const t = Ec[r];
  return t === void 0 && (Ec[r] = Y("resource")), t;
}
const Ac = class jv extends dt {
  constructor(t = {}) {
    var e, s, i, n, o, a, l3;
    super(), this._resourceType = "textureSampler", this._touched = 0, this._maxAnisotropy = 1, this.destroyed = false, t = Sc(Sc({}, jv.defaultOptions), t), this.addressMode = t.addressMode, this.addressModeU = (e = t.addressModeU) != null ? e : this.addressModeU, this.addressModeV = (s = t.addressModeV) != null ? s : this.addressModeV, this.addressModeW = (i = t.addressModeW) != null ? i : this.addressModeW, this.scaleMode = t.scaleMode, this.magFilter = (n = t.magFilter) != null ? n : this.magFilter, this.minFilter = (o = t.minFilter) != null ? o : this.minFilter, this.mipmapFilter = (a = t.mipmapFilter) != null ? a : this.mipmapFilter, this.lodMinClamp = t.lodMinClamp, this.lodMaxClamp = t.lodMaxClamp, this.compare = t.compare, this.maxAnisotropy = (l3 = t.maxAnisotropy) != null ? l3 : 1;
  }
  set addressMode(t) {
    this.addressModeU = t, this.addressModeV = t, this.addressModeW = t;
  }
  get addressMode() {
    return this.addressModeU;
  }
  set wrapMode(t) {
    this.addressMode = t;
  }
  get wrapMode() {
    return this.addressMode;
  }
  set scaleMode(t) {
    this.magFilter = t, this.minFilter = t, this.mipmapFilter = t;
  }
  get scaleMode() {
    return this.magFilter;
  }
  set maxAnisotropy(t) {
    this._maxAnisotropy = Math.min(t, 16), this._maxAnisotropy > 1 && (this.scaleMode = "linear");
  }
  get maxAnisotropy() {
    return this._maxAnisotropy;
  }
  get _resourceId() {
    return this._sharedResourceId || this._generateResourceId();
  }
  update() {
    this.emit("change", this), this._sharedResourceId = null;
  }
  _generateResourceId() {
    const t = `${this.addressModeU}-${this.addressModeV}-${this.addressModeW}-${this.magFilter}-${this.minFilter}-${this.mipmapFilter}-${this.lodMinClamp}-${this.lodMaxClamp}-${this.compare}-${this._maxAnisotropy}`;
    return this._sharedResourceId = e0(t), this._resourceId;
  }
  destroy() {
    this.destroyed = true, this.emit("destroy", this), this.emit("change", this), this.removeAllListeners();
  }
};
Ac.defaultOptions = { addressMode: "clamp-to-edge", scaleMode: "linear" };
let Pt$1 = Ac;
var r0 = Object.defineProperty, wc = Object.getOwnPropertySymbols, s0 = Object.prototype.hasOwnProperty, i0 = Object.prototype.propertyIsEnumerable, Pc = (r, t, e) => t in r ? r0(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Rc = (r, t) => {
  for (var e in t || (t = {})) s0.call(t, e) && Pc(r, e, t[e]);
  if (wc) for (var e of wc(t)) i0.call(t, e) && Pc(r, e, t[e]);
  return r;
};
const Mc = class zv extends dt {
  constructor(t = {}) {
    var e, s, i;
    super(), this.options = t, this.uid = Y("textureSource"), this._resourceType = "textureSource", this._resourceId = Y("resource"), this.uploadMethodId = "unknown", this._resolution = 1, this.pixelWidth = 1, this.pixelHeight = 1, this.width = 1, this.height = 1, this.sampleCount = 1, this.mipLevelCount = 1, this.autoGenerateMipmaps = false, this.format = "rgba8unorm", this.dimension = "2d", this.antialias = false, this._touched = 0, this._batchTick = -1, this._textureBindLocation = -1, t = Rc(Rc({}, zv.defaultOptions), t), this.label = (e = t.label) != null ? e : "", this.resource = t.resource, this.autoGarbageCollect = t.autoGarbageCollect, this._resolution = t.resolution, t.width ? this.pixelWidth = t.width * this._resolution : this.pixelWidth = this.resource && (s = this.resourceWidth) != null ? s : 1, t.height ? this.pixelHeight = t.height * this._resolution : this.pixelHeight = this.resource && (i = this.resourceHeight) != null ? i : 1, this.width = this.pixelWidth / this._resolution, this.height = this.pixelHeight / this._resolution, this.format = t.format, this.dimension = t.dimensions, this.mipLevelCount = t.mipLevelCount, this.autoGenerateMipmaps = t.autoGenerateMipmaps, this.sampleCount = t.sampleCount, this.antialias = t.antialias, this.alphaMode = t.alphaMode, this.style = new Pt$1(It(t)), this.destroyed = false, this._refreshPOT();
  }
  get source() {
    return this;
  }
  get style() {
    return this._style;
  }
  set style(t) {
    var e, s;
    this.style !== t && ((e = this._style) == null || e.off("change", this._onStyleChange, this), this._style = t, (s = this._style) == null || s.on("change", this._onStyleChange, this), this._onStyleChange());
  }
  get addressMode() {
    return this._style.addressMode;
  }
  set addressMode(t) {
    this._style.addressMode = t;
  }
  get repeatMode() {
    return this._style.addressMode;
  }
  set repeatMode(t) {
    this._style.addressMode = t;
  }
  get magFilter() {
    return this._style.magFilter;
  }
  set magFilter(t) {
    this._style.magFilter = t;
  }
  get minFilter() {
    return this._style.minFilter;
  }
  set minFilter(t) {
    this._style.minFilter = t;
  }
  get mipmapFilter() {
    return this._style.mipmapFilter;
  }
  set mipmapFilter(t) {
    this._style.mipmapFilter = t;
  }
  get lodMinClamp() {
    return this._style.lodMinClamp;
  }
  set lodMinClamp(t) {
    this._style.lodMinClamp = t;
  }
  get lodMaxClamp() {
    return this._style.lodMaxClamp;
  }
  set lodMaxClamp(t) {
    this._style.lodMaxClamp = t;
  }
  _onStyleChange() {
    this.emit("styleChange", this);
  }
  update() {
    if (this.resource) {
      const t = this._resolution;
      if (this.resize(this.resourceWidth / t, this.resourceHeight / t)) return;
    }
    this.emit("update", this);
  }
  destroy() {
    this.destroyed = true, this.emit("destroy", this), this.emit("change", this), this._style && (this._style.destroy(), this._style = null), this.uploadMethodId = null, this.resource = null, this.removeAllListeners();
  }
  unload() {
    this._resourceId = Y("resource"), this.emit("change", this), this.emit("unload", this);
  }
  get resourceWidth() {
    const { resource: t } = this;
    return t.naturalWidth || t.videoWidth || t.displayWidth || t.width;
  }
  get resourceHeight() {
    const { resource: t } = this;
    return t.naturalHeight || t.videoHeight || t.displayHeight || t.height;
  }
  get resolution() {
    return this._resolution;
  }
  set resolution(t) {
    this._resolution !== t && (this._resolution = t, this.width = this.pixelWidth / t, this.height = this.pixelHeight / t);
  }
  resize(t, e, s) {
    s || (s = this._resolution), t || (t = this.width), e || (e = this.height);
    const i = Math.round(t * s), n = Math.round(e * s);
    return this.width = i / s, this.height = n / s, this._resolution = s, this.pixelWidth === i && this.pixelHeight === n ? false : (this._refreshPOT(), this.pixelWidth = i, this.pixelHeight = n, this.emit("resize", this), this._resourceId = Y("resource"), this.emit("change", this), true);
  }
  updateMipmaps() {
    this.autoGenerateMipmaps && this.mipLevelCount > 1 && this.emit("updateMipmaps", this);
  }
  set wrapMode(t) {
    this._style.wrapMode = t;
  }
  get wrapMode() {
    return this._style.wrapMode;
  }
  set scaleMode(t) {
    this._style.scaleMode = t;
  }
  get scaleMode() {
    return this._style.scaleMode;
  }
  _refreshPOT() {
    this.isPowerOfTwo = gn(this.pixelWidth) && gn(this.pixelHeight);
  }
  static test(t) {
    throw new Error("Unimplemented");
  }
};
Mc.defaultOptions = { resolution: 1, format: "bgra8unorm", alphaMode: "premultiply-alpha-on-upload", dimensions: "2d", mipLevelCount: 1, autoGenerateMipmaps: false, sampleCount: 1, antialias: false, autoGarbageCollect: false };
let K$1 = Mc;
const me = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1], ge = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1], _e = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1], xe = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1], _n = [], Cc = [], bs = Math.sign;
function n0() {
  for (let r = 0; r < 16; r++) {
    const t = [];
    _n.push(t);
    for (let e = 0; e < 16; e++) {
      const s = bs(me[r] * me[e] + _e[r] * ge[e]), i = bs(ge[r] * me[e] + xe[r] * ge[e]), n = bs(me[r] * _e[e] + _e[r] * xe[e]), o = bs(ge[r] * _e[e] + xe[r] * xe[e]);
      for (let a = 0; a < 16; a++) if (me[a] === s && ge[a] === i && _e[a] === n && xe[a] === o) {
        t.push(a);
        break;
      }
    }
  }
  for (let r = 0; r < 16; r++) {
    const t = new R$1();
    t.set(me[r], ge[r], _e[r], xe[r], 0, 0), Cc.push(t);
  }
}
n0();
const $$1 = { E: 0, SE: 1, S: 2, SW: 3, W: 4, NW: 5, N: 6, NE: 7, MIRROR_VERTICAL: 8, MAIN_DIAGONAL: 10, MIRROR_HORIZONTAL: 12, REVERSE_DIAGONAL: 14, uX: (r) => me[r], uY: (r) => ge[r], vX: (r) => _e[r], vY: (r) => xe[r], inv: (r) => r & 8 ? r & 15 : -r & 7, add: (r, t) => _n[r][t], sub: (r, t) => _n[r][$$1.inv(t)], rotate180: (r) => r ^ 4, isVertical: (r) => (r & 3) === 2, byDirection: (r, t) => Math.abs(r) * 2 <= Math.abs(t) ? t >= 0 ? $$1.S : $$1.N : Math.abs(t) * 2 <= Math.abs(r) ? r > 0 ? $$1.E : $$1.W : t > 0 ? r > 0 ? $$1.SE : $$1.SW : r > 0 ? $$1.NE : $$1.NW, matrixAppendRotationInv: (r, t, e = 0, s = 0) => {
  const i = Cc[$$1.inv(t)];
  i.tx = e, i.ty = s, r.append(i);
} }, xn = () => {
};
var o0 = Object.defineProperty, a0 = Object.defineProperties, l0 = Object.getOwnPropertyDescriptors, Oc = Object.getOwnPropertySymbols, u0 = Object.prototype.hasOwnProperty, c0 = Object.prototype.propertyIsEnumerable, Gc = (r, t, e) => t in r ? o0(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, h0 = (r, t) => {
  for (var e in t || (t = {})) u0.call(t, e) && Gc(r, e, t[e]);
  if (Oc) for (var e of Oc(t)) c0.call(t, e) && Gc(r, e, t[e]);
  return r;
}, d0 = (r, t) => a0(r, l0(t));
class vs extends K$1 {
  constructor(t) {
    const e = t.resource || new Float32Array(t.width * t.height * 4);
    let s = t.format;
    s || (e instanceof Float32Array ? s = "rgba32float" : e instanceof Int32Array || e instanceof Uint32Array ? s = "rgba32uint" : e instanceof Int16Array || e instanceof Uint16Array ? s = "rgba16uint" : s = "bgra8unorm"), super(d0(h0({}, t), { resource: e, format: s })), this.uploadMethodId = "buffer";
  }
  static test(t) {
    return t instanceof Int8Array || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array;
  }
}
vs.extension = x$1.TextureSource;
const Ic = new R$1();
class bn {
  constructor(t, e) {
    this.mapCoord = new R$1(), this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, typeof e == "undefined" ? this.clampMargin = t.width < 10 ? 0 : 0.5 : this.clampMargin = e, this.isSimple = false, this.texture = t;
  }
  get texture() {
    return this._texture;
  }
  set texture(t) {
    var e;
    this.texture !== t && ((e = this._texture) == null || e.removeListener("update", this.update, this), this._texture = t, this._texture.addListener("update", this.update, this), this.update());
  }
  multiplyUvs(t, e) {
    e === void 0 && (e = t);
    const s = this.mapCoord;
    for (let i = 0; i < t.length; i += 2) {
      const n = t[i], o = t[i + 1];
      e[i] = n * s.a + o * s.c + s.tx, e[i + 1] = n * s.b + o * s.d + s.ty;
    }
    return e;
  }
  update() {
    const t = this._texture;
    this._updateID++;
    const e = t.uvs;
    this.mapCoord.set(e.x1 - e.x0, e.y1 - e.y0, e.x3 - e.x0, e.y3 - e.y0, e.x0, e.y0);
    const s = t.orig, i = t.trim;
    i && (Ic.set(s.width / i.width, 0, 0, s.height / i.height, -i.x / i.width, -i.y / i.height), this.mapCoord.append(Ic));
    const n = t.source, o = this.uClampFrame, a = this.clampMargin / n._resolution, l3 = this.clampOffset / n._resolution;
    return o[0] = (t.frame.x + a + l3) / n.width, o[1] = (t.frame.y + a + l3) / n.height, o[2] = (t.frame.x + t.frame.width - a + l3) / n.width, o[3] = (t.frame.y + t.frame.height - a + l3) / n.height, this.uClampOffset[0] = this.clampOffset / n.pixelWidth, this.uClampOffset[1] = this.clampOffset / n.pixelHeight, this.isSimple = t.frame.width === n.width && t.frame.height === n.height && t.rotate === 0, true;
  }
}
let A$1 = class A extends dt {
  constructor({ source: t, label: e, frame: s, orig: i, trim: n, defaultAnchor: o, defaultBorders: a, rotate: l3, dynamic: u3 } = {}) {
    var c;
    if (super(), this.uid = Y("texture"), this.uvs = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 }, this.frame = new j$1(), this.noFrame = false, this.dynamic = false, this.isTexture = true, this.label = e, this.source = (c = t == null ? void 0 : t.source) != null ? c : new K$1(), this.noFrame = !s, s) this.frame.copyFrom(s);
    else {
      const { width: h, height: d } = this._source;
      this.frame.width = h, this.frame.height = d;
    }
    this.orig = i || this.frame, this.trim = n, this.rotate = l3 != null ? l3 : 0, this.defaultAnchor = o, this.defaultBorders = a, this.destroyed = false, this.dynamic = u3 || false, this.updateUvs();
  }
  set source(t) {
    this._source && this._source.off("resize", this.update, this), this._source = t, t.on("resize", this.update, this), this.emit("update", this);
  }
  get source() {
    return this._source;
  }
  get textureMatrix() {
    return this._textureMatrix || (this._textureMatrix = new bn(this)), this._textureMatrix;
  }
  get width() {
    return this.orig.width;
  }
  get height() {
    return this.orig.height;
  }
  updateUvs() {
    const { uvs: t, frame: e } = this, { width: s, height: i } = this._source, n = e.x / s, o = e.y / i, a = e.width / s, l3 = e.height / i;
    let u3 = this.rotate;
    if (u3) {
      const c = a / 2, h = l3 / 2, d = n + c, p = o + h;
      u3 = $$1.add(u3, $$1.NW), t.x0 = d + c * $$1.uX(u3), t.y0 = p + h * $$1.uY(u3), u3 = $$1.add(u3, 2), t.x1 = d + c * $$1.uX(u3), t.y1 = p + h * $$1.uY(u3), u3 = $$1.add(u3, 2), t.x2 = d + c * $$1.uX(u3), t.y2 = p + h * $$1.uY(u3), u3 = $$1.add(u3, 2), t.x3 = d + c * $$1.uX(u3), t.y3 = p + h * $$1.uY(u3);
    } else t.x0 = n, t.y0 = o, t.x1 = n + a, t.y1 = o, t.x2 = n + a, t.y2 = o + l3, t.x3 = n, t.y3 = o + l3;
  }
  destroy(t = false) {
    this._source && t && (this._source.destroy(), this._source = null), this._textureMatrix = null, this.destroyed = true, this.emit("destroy", this), this.removeAllListeners();
  }
  update() {
    this.noFrame && (this.frame.width = this._source.width, this.frame.height = this._source.height), this.updateUvs(), this.emit("update", this);
  }
  get baseTexture() {
    return this._source;
  }
};
A$1.EMPTY = new A$1({ label: "EMPTY", source: new K$1({ label: "EMPTY" }) }), A$1.EMPTY.destroy = xn, A$1.WHITE = new A$1({ source: new vs({ resource: new Uint8Array([255, 255, 255, 255]), width: 1, height: 1, alphaMode: "premultiply-alpha-on-upload", label: "WHITE" }), label: "WHITE" }), A$1.WHITE.destroy = xn;
var p0 = Object.defineProperty, f0 = Object.defineProperties, m0 = Object.getOwnPropertyDescriptors, Bc = Object.getOwnPropertySymbols, g0 = Object.prototype.hasOwnProperty, _0 = Object.prototype.propertyIsEnumerable, Fc = (r, t, e) => t in r ? p0(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, x0 = (r, t) => {
  for (var e in t || (t = {})) g0.call(t, e) && Fc(r, e, t[e]);
  if (Bc) for (var e of Bc(t)) _0.call(t, e) && Fc(r, e, t[e]);
  return r;
}, b0 = (r, t) => f0(r, m0(t));
let v0 = 0;
class Dc {
  constructor(t) {
    this._poolKeyHash = /* @__PURE__ */ Object.create(null), this._texturePool = {}, this.textureOptions = t || {}, this.enableFullScreen = false, this.textureStyle = new Pt$1(this.textureOptions);
  }
  createTexture(t, e, s) {
    const i = new K$1(b0(x0({}, this.textureOptions), { width: t, height: e, resolution: 1, antialias: s, autoGarbageCollect: false }));
    return new A$1({ source: i, label: `texturePool_${v0++}` });
  }
  getOptimalTexture(t, e, s = 1, i) {
    let n = Math.ceil(t * s - 1e-6), o = Math.ceil(e * s - 1e-6);
    n = fe(n), o = fe(o);
    const a = (n << 17) + (o << 1) + (i ? 1 : 0);
    this._texturePool[a] || (this._texturePool[a] = []);
    let l3 = this._texturePool[a].pop();
    return l3 || (l3 = this.createTexture(n, o, i)), l3.source._resolution = s, l3.source.width = n / s, l3.source.height = o / s, l3.source.pixelWidth = n, l3.source.pixelHeight = o, l3.frame.x = 0, l3.frame.y = 0, l3.frame.width = t, l3.frame.height = e, l3.updateUvs(), this._poolKeyHash[l3.uid] = a, l3;
  }
  getSameSizeTexture(t, e = false) {
    const s = t.source;
    return this.getOptimalTexture(t.width, t.height, s._resolution, e);
  }
  returnTexture(t, e = false) {
    const s = this._poolKeyHash[t.uid];
    e && (t.source.style = this.textureStyle), this._texturePool[s].push(t);
  }
  clear(t) {
    if (t = t !== false, t) for (const e in this._texturePool) {
      const s = this._texturePool[e];
      if (s) for (let i = 0; i < s.length; i++) s[i].destroy(true);
    }
    this._texturePool = {};
  }
}
const tt$1 = new Dc();
class Uc {
  constructor() {
    this.renderPipeId = "renderGroup", this.root = null, this.canBundle = false, this.renderGroupParent = null, this.renderGroupChildren = [], this.worldTransform = new R$1(), this.worldColorAlpha = 4294967295, this.worldColor = 16777215, this.worldAlpha = 1, this.childrenToUpdate = /* @__PURE__ */ Object.create(null), this.updateTick = 0, this.gcTick = 0, this.childrenRenderablesToUpdate = { list: [], index: 0 }, this.structureDidChange = true, this.instructionSet = new mn(), this._onRenderContainers = [], this.textureNeedsUpdate = true, this.isCachedAsTexture = false, this._matrixDirty = 7;
  }
  init(t) {
    this.root = t, t._onRender && this.addOnRender(t), t.didChange = true;
    const e = t.children;
    for (let s = 0; s < e.length; s++) {
      const i = e[s];
      i._updateFlags = 15, this.addChild(i);
    }
  }
  enableCacheAsTexture(t = {}) {
    this.textureOptions = t, this.isCachedAsTexture = true, this.textureNeedsUpdate = true;
  }
  disableCacheAsTexture() {
    this.isCachedAsTexture = false, this.texture && (tt$1.returnTexture(this.texture), this.texture = null);
  }
  updateCacheTexture() {
    this.textureNeedsUpdate = true;
  }
  reset() {
    this.renderGroupChildren.length = 0;
    for (const t in this.childrenToUpdate) {
      const e = this.childrenToUpdate[t];
      e.list.fill(null), e.index = 0;
    }
    this.childrenRenderablesToUpdate.index = 0, this.childrenRenderablesToUpdate.list.fill(null), this.root = null, this.updateTick = 0, this.structureDidChange = true, this._onRenderContainers.length = 0, this.renderGroupParent = null, this.disableCacheAsTexture();
  }
  get localTransform() {
    return this.root.localTransform;
  }
  addRenderGroupChild(t) {
    t.renderGroupParent && t.renderGroupParent._removeRenderGroupChild(t), t.renderGroupParent = this, this.renderGroupChildren.push(t);
  }
  _removeRenderGroupChild(t) {
    const e = this.renderGroupChildren.indexOf(t);
    e > -1 && this.renderGroupChildren.splice(e, 1), t.renderGroupParent = null;
  }
  addChild(t) {
    if (this.structureDidChange = true, t.parentRenderGroup = this, t.updateTick = -1, t.parent === this.root ? t.relativeRenderGroupDepth = 1 : t.relativeRenderGroupDepth = t.parent.relativeRenderGroupDepth + 1, t.didChange = true, this.onChildUpdate(t), t.renderGroup) {
      this.addRenderGroupChild(t.renderGroup);
      return;
    }
    t._onRender && this.addOnRender(t);
    const e = t.children;
    for (let s = 0; s < e.length; s++) this.addChild(e[s]);
  }
  removeChild(t) {
    if (this.structureDidChange = true, t._onRender && (t.renderGroup || this.removeOnRender(t)), t.parentRenderGroup = null, t.renderGroup) {
      this._removeRenderGroupChild(t.renderGroup);
      return;
    }
    const e = t.children;
    for (let s = 0; s < e.length; s++) this.removeChild(e[s]);
  }
  removeChildren(t) {
    for (let e = 0; e < t.length; e++) this.removeChild(t[e]);
  }
  onChildUpdate(t) {
    let e = this.childrenToUpdate[t.relativeRenderGroupDepth];
    e || (e = this.childrenToUpdate[t.relativeRenderGroupDepth] = { index: 0, list: [] }), e.list[e.index++] = t;
  }
  updateRenderable(t) {
    t.globalDisplayStatus < 7 || (this.instructionSet.renderPipes[t.renderPipeId].updateRenderable(t), t.didViewUpdate = false);
  }
  onChildViewUpdate(t) {
    this.childrenRenderablesToUpdate.list[this.childrenRenderablesToUpdate.index++] = t;
  }
  get isRenderable() {
    return this.root.localDisplayStatus === 7 && this.worldAlpha > 0;
  }
  addOnRender(t) {
    this._onRenderContainers.push(t);
  }
  removeOnRender(t) {
    this._onRenderContainers.splice(this._onRenderContainers.indexOf(t), 1);
  }
  runOnRender(t) {
    for (let e = 0; e < this._onRenderContainers.length; e++) this._onRenderContainers[e]._onRender(t);
  }
  destroy() {
    this.disableCacheAsTexture(), this.renderGroupParent = null, this.root = null, this.childrenRenderablesToUpdate = null, this.childrenToUpdate = null, this.renderGroupChildren = null, this._onRenderContainers = null, this.instructionSet = null;
  }
  getChildren(t = []) {
    const e = this.root.children;
    for (let s = 0; s < e.length; s++) this._getChildren(e[s], t);
    return t;
  }
  _getChildren(t, e = []) {
    if (e.push(t), t.renderGroup) return e;
    const s = t.children;
    for (let i = 0; i < s.length; i++) this._getChildren(s[i], e);
    return e;
  }
  invalidateMatrices() {
    this._matrixDirty = 7;
  }
  get inverseWorldTransform() {
    return this._matrixDirty & 1 ? (this._matrixDirty &= -2, this._inverseWorldTransform || (this._inverseWorldTransform = new R$1()), this._inverseWorldTransform.copyFrom(this.worldTransform).invert()) : this._inverseWorldTransform;
  }
  get textureOffsetInverseTransform() {
    return this._matrixDirty & 2 ? (this._matrixDirty &= -3, this._textureOffsetInverseTransform || (this._textureOffsetInverseTransform = new R$1()), this._textureOffsetInverseTransform.copyFrom(this.inverseWorldTransform).translate(-this._textureBounds.x, -this._textureBounds.y)) : this._textureOffsetInverseTransform;
  }
  get inverseParentTextureTransform() {
    if (!(this._matrixDirty & 4)) return this._inverseParentTextureTransform;
    this._matrixDirty &= -5;
    const t = this._parentCacheAsTextureRenderGroup;
    return t ? (this._inverseParentTextureTransform || (this._inverseParentTextureTransform = new R$1()), this._inverseParentTextureTransform.copyFrom(this.worldTransform).prepend(t.inverseWorldTransform).translate(-t._textureBounds.x, -t._textureBounds.y)) : this.worldTransform;
  }
  get cacheToLocalTransform() {
    return this._parentCacheAsTextureRenderGroup ? this._parentCacheAsTextureRenderGroup.textureOffsetInverseTransform : null;
  }
}
function ys(r, t, e = {}) {
  for (const s in t) !e[s] && t[s] !== void 0 && (r[s] = t[s]);
}
const vn = new rt(null), yn = new rt(null), Tn = new rt(null, 1, 1), br = 1, Ts = 2, Ie = 4;
class lt extends dt {
  constructor(t = {}) {
    var e, s;
    super(), this.uid = Y("renderable"), this._updateFlags = 15, this.renderGroup = null, this.parentRenderGroup = null, this.parentRenderGroupIndex = 0, this.didChange = false, this.didViewUpdate = false, this.relativeRenderGroupDepth = 0, this.children = [], this.parent = null, this.includeInBuild = true, this.measurable = true, this.isSimple = true, this.updateTick = -1, this.localTransform = new R$1(), this.relativeGroupTransform = new R$1(), this.groupTransform = this.relativeGroupTransform, this.destroyed = false, this._position = new rt(this, 0, 0), this._scale = Tn, this._pivot = yn, this._skew = vn, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._rotation = 0, this.localColor = 16777215, this.localAlpha = 1, this.groupAlpha = 1, this.groupColor = 16777215, this.groupColorAlpha = 4294967295, this.localBlendMode = "inherit", this.groupBlendMode = "normal", this.localDisplayStatus = 7, this.globalDisplayStatus = 7, this._didContainerChangeTick = 0, this._didViewChangeTick = 0, this._didLocalTransformChangeId = -1, this.effects = [], ys(this, t, { children: true, parent: true, effects: true }), (e = t.children) == null || e.forEach((i) => this.addChild(i)), (s = t.parent) == null || s.addChild(this);
  }
  static mixin(t) {
    G$1.mixin(lt, t);
  }
  set _didChangeId(t) {
    this._didViewChangeTick = t >> 12 & 4095, this._didContainerChangeTick = t & 4095;
  }
  get _didChangeId() {
    return this._didContainerChangeTick & 4095 | (this._didViewChangeTick & 4095) << 12;
  }
  addChild(...t) {
    if (t.length > 1) {
      for (let i = 0; i < t.length; i++) this.addChild(t[i]);
      return t[0];
    }
    const e = t[0], s = this.renderGroup || this.parentRenderGroup;
    return e.parent === this ? (this.children.splice(this.children.indexOf(e), 1), this.children.push(e), s && (s.structureDidChange = true), e) : (e.parent && e.parent.removeChild(e), this.children.push(e), this.sortableChildren && (this.sortDirty = true), e.parent = this, e.didChange = true, e._updateFlags = 15, s && s.addChild(e), this.emit("childAdded", e, this, this.children.length - 1), e.emit("added", this), this._didViewChangeTick++, e._zIndex !== 0 && e.depthOfChildModified(), e);
  }
  removeChild(...t) {
    if (t.length > 1) {
      for (let i = 0; i < t.length; i++) this.removeChild(t[i]);
      return t[0];
    }
    const e = t[0], s = this.children.indexOf(e);
    return s > -1 && (this._didViewChangeTick++, this.children.splice(s, 1), this.renderGroup ? this.renderGroup.removeChild(e) : this.parentRenderGroup && this.parentRenderGroup.removeChild(e), e.parentRenderLayer && e.parentRenderLayer.detach(e), e.parent = null, this.emit("childRemoved", e, this, s), e.emit("removed", this)), e;
  }
  _onUpdate(t) {
    t && t === this._skew && this._updateSkew(), this._didContainerChangeTick++, !this.didChange && (this.didChange = true, this.parentRenderGroup && this.parentRenderGroup.onChildUpdate(this));
  }
  set isRenderGroup(t) {
    !!this.renderGroup !== t && (t ? this.enableRenderGroup() : this.disableRenderGroup());
  }
  get isRenderGroup() {
    return !!this.renderGroup;
  }
  enableRenderGroup() {
    if (this.renderGroup) return;
    const t = this.parentRenderGroup;
    t == null || t.removeChild(this), this.renderGroup = nt.get(Uc, this), this.groupTransform = R$1.IDENTITY, t == null || t.addChild(this), this._updateIsSimple();
  }
  disableRenderGroup() {
    if (!this.renderGroup) return;
    const t = this.parentRenderGroup;
    t == null || t.removeChild(this), nt.return(this.renderGroup), this.renderGroup = null, this.groupTransform = this.relativeGroupTransform, t == null || t.addChild(this), this._updateIsSimple();
  }
  _updateIsSimple() {
    this.isSimple = !this.renderGroup && this.effects.length === 0;
  }
  get worldTransform() {
    return this._worldTransform || (this._worldTransform = new R$1()), this.renderGroup ? this._worldTransform.copyFrom(this.renderGroup.worldTransform) : this.parentRenderGroup && this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform), this._worldTransform;
  }
  get x() {
    return this._position.x;
  }
  set x(t) {
    this._position.x = t;
  }
  get y() {
    return this._position.y;
  }
  set y(t) {
    this._position.y = t;
  }
  get position() {
    return this._position;
  }
  set position(t) {
    this._position.copyFrom(t);
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(t) {
    this._rotation !== t && (this._rotation = t, this._onUpdate(this._skew));
  }
  get angle() {
    return this.rotation * Ju;
  }
  set angle(t) {
    this.rotation = t * tc;
  }
  get pivot() {
    return this._pivot === yn && (this._pivot = new rt(this, 0, 0)), this._pivot;
  }
  set pivot(t) {
    this._pivot === yn && (this._pivot = new rt(this, 0, 0)), typeof t == "number" ? this._pivot.set(t) : this._pivot.copyFrom(t);
  }
  get skew() {
    return this._skew === vn && (this._skew = new rt(this, 0, 0)), this._skew;
  }
  set skew(t) {
    this._skew === vn && (this._skew = new rt(this, 0, 0)), this._skew.copyFrom(t);
  }
  get scale() {
    return this._scale === Tn && (this._scale = new rt(this, 1, 1)), this._scale;
  }
  set scale(t) {
    this._scale === Tn && (this._scale = new rt(this, 0, 0)), typeof t == "number" ? this._scale.set(t) : this._scale.copyFrom(t);
  }
  get width() {
    return Math.abs(this.scale.x * this.getLocalBounds().width);
  }
  set width(t) {
    const e = this.getLocalBounds().width;
    this._setWidth(t, e);
  }
  get height() {
    return Math.abs(this.scale.y * this.getLocalBounds().height);
  }
  set height(t) {
    const e = this.getLocalBounds().height;
    this._setHeight(t, e);
  }
  getSize(t) {
    t || (t = {});
    const e = this.getLocalBounds();
    return t.width = Math.abs(this.scale.x * e.width), t.height = Math.abs(this.scale.y * e.height), t;
  }
  setSize(t, e) {
    var s;
    const i = this.getLocalBounds();
    typeof t == "object" ? (e = (s = t.height) != null ? s : t.width, t = t.width) : e != null || (e = t), t !== void 0 && this._setWidth(t, i.width), e !== void 0 && this._setHeight(e, i.height);
  }
  _updateSkew() {
    const t = this._rotation, e = this._skew;
    this._cx = Math.cos(t + e._y), this._sx = Math.sin(t + e._y), this._cy = -Math.sin(t - e._x), this._sy = Math.cos(t - e._x);
  }
  updateTransform(t) {
    return this.position.set(typeof t.x == "number" ? t.x : this.position.x, typeof t.y == "number" ? t.y : this.position.y), this.scale.set(typeof t.scaleX == "number" ? t.scaleX || 1 : this.scale.x, typeof t.scaleY == "number" ? t.scaleY || 1 : this.scale.y), this.rotation = typeof t.rotation == "number" ? t.rotation : this.rotation, this.skew.set(typeof t.skewX == "number" ? t.skewX : this.skew.x, typeof t.skewY == "number" ? t.skewY : this.skew.y), this.pivot.set(typeof t.pivotX == "number" ? t.pivotX : this.pivot.x, typeof t.pivotY == "number" ? t.pivotY : this.pivot.y), this;
  }
  setFromMatrix(t) {
    t.decompose(this);
  }
  updateLocalTransform() {
    const t = this._didContainerChangeTick;
    if (this._didLocalTransformChangeId === t) return;
    this._didLocalTransformChangeId = t;
    const e = this.localTransform, s = this._scale, i = this._pivot, n = this._position, o = s._x, a = s._y, l3 = i._x, u3 = i._y;
    e.a = this._cx * o, e.b = this._sx * o, e.c = this._cy * a, e.d = this._sy * a, e.tx = n._x - (l3 * e.a + u3 * e.c), e.ty = n._y - (l3 * e.b + u3 * e.d);
  }
  set alpha(t) {
    t !== this.localAlpha && (this.localAlpha = t, this._updateFlags |= br, this._onUpdate());
  }
  get alpha() {
    return this.localAlpha;
  }
  set tint(t) {
    const e = X.shared.setValue(t != null ? t : 16777215).toBgrNumber();
    e !== this.localColor && (this.localColor = e, this._updateFlags |= br, this._onUpdate());
  }
  get tint() {
    return Ge(this.localColor);
  }
  set blendMode(t) {
    this.localBlendMode !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = true), this._updateFlags |= Ts, this.localBlendMode = t, this._onUpdate());
  }
  get blendMode() {
    return this.localBlendMode;
  }
  get visible() {
    return !!(this.localDisplayStatus & 2);
  }
  set visible(t) {
    const e = t ? 2 : 0;
    (this.localDisplayStatus & 2) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = true), this._updateFlags |= Ie, this.localDisplayStatus ^= 2, this._onUpdate());
  }
  get culled() {
    return !(this.localDisplayStatus & 4);
  }
  set culled(t) {
    const e = t ? 0 : 4;
    (this.localDisplayStatus & 4) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = true), this._updateFlags |= Ie, this.localDisplayStatus ^= 4, this._onUpdate());
  }
  get renderable() {
    return !!(this.localDisplayStatus & 1);
  }
  set renderable(t) {
    const e = t ? 1 : 0;
    (this.localDisplayStatus & 1) !== e && (this._updateFlags |= Ie, this.localDisplayStatus ^= 1, this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = true), this._onUpdate());
  }
  get isRenderable() {
    return this.localDisplayStatus === 7 && this.groupAlpha > 0;
  }
  destroy(t = false) {
    var e;
    if (this.destroyed) return;
    this.destroyed = true;
    let s;
    if (this.children.length && (s = this.removeChildren(0, this.children.length)), this.removeFromParent(), this.parent = null, this._maskEffect = null, this._filterEffect = null, this.effects = null, this._position = null, this._scale = null, this._pivot = null, this._skew = null, this.emit("destroyed", this), this.removeAllListeners(), (typeof t == "boolean" ? t : t == null ? void 0 : t.children) && s) for (let i = 0; i < s.length; ++i) s[i].destroy(t);
    (e = this.renderGroup) == null || e.destroy(), this.renderGroup = null;
  }
}
G$1.mixin(lt, sc, dc, vc, xc, _c, uc, cc, bc, Zu, rc, mc, ic);
class or {
  constructor(t) {
    this.bubbles = true, this.cancelBubble = true, this.cancelable = false, this.composed = false, this.defaultPrevented = false, this.eventPhase = or.prototype.NONE, this.propagationStopped = false, this.propagationImmediatelyStopped = false, this.layer = new z$1(), this.page = new z$1(), this.NONE = 0, this.CAPTURING_PHASE = 1, this.AT_TARGET = 2, this.BUBBLING_PHASE = 3, this.manager = t;
  }
  get layerX() {
    return this.layer.x;
  }
  get layerY() {
    return this.layer.y;
  }
  get pageX() {
    return this.page.x;
  }
  get pageY() {
    return this.page.y;
  }
  get data() {
    return this;
  }
  composedPath() {
    return this.manager && (!this.path || this.path[this.path.length - 1] !== this.target) && (this.path = this.target ? this.manager.propagationPath(this.target) : []), this.path;
  }
  initEvent(t, e, s) {
    throw new Error("initEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
  }
  initUIEvent(t, e, s, i, n) {
    throw new Error("initUIEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
  }
  preventDefault() {
    this.nativeEvent instanceof Event && this.nativeEvent.cancelable && this.nativeEvent.preventDefault(), this.defaultPrevented = true;
  }
  stopImmediatePropagation() {
    this.propagationImmediatelyStopped = true;
  }
  stopPropagation() {
    this.propagationStopped = true;
  }
}
var Sn = /iPhone/i, kc = /iPod/i, $c = /iPad/i, Lc = /\biOS-universal(?:.+)Mac\b/i, En = /\bAndroid(?:.+)Mobile\b/i, Nc = /Android/i, Be = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i, Ss = /Silk/i, Yt = /Windows Phone/i, Xc = /\bWindows(?:.+)ARM\b/i, Hc = /BlackBerry/i, jc = /BB10/i, zc = /Opera Mini/i, Vc = /\b(CriOS|Chrome)(?:.+)Mobile/i, Wc = /Mobile(?:.+)Firefox\b/i, Yc = function(r) {
  return typeof r != "undefined" && r.platform === "MacIntel" && typeof r.maxTouchPoints == "number" && r.maxTouchPoints > 1 && typeof MSStream == "undefined";
};
function T0(r) {
  return function(t) {
    return t.test(r);
  };
}
function Kc(r) {
  var t = { userAgent: "", platform: "", maxTouchPoints: 0 };
  !r && typeof navigator != "undefined" ? t = { userAgent: navigator.userAgent, platform: navigator.platform, maxTouchPoints: navigator.maxTouchPoints || 0 } : typeof r == "string" ? t.userAgent = r : r && r.userAgent && (t = { userAgent: r.userAgent, platform: r.platform, maxTouchPoints: r.maxTouchPoints || 0 });
  var e = t.userAgent, s = e.split("[FBAN");
  typeof s[1] != "undefined" && (e = s[0]), s = e.split("Twitter"), typeof s[1] != "undefined" && (e = s[0]);
  var i = T0(e), n = { apple: { phone: i(Sn) && !i(Yt), ipod: i(kc), tablet: !i(Sn) && (i($c) || Yc(t)) && !i(Yt), universal: i(Lc), device: (i(Sn) || i(kc) || i($c) || i(Lc) || Yc(t)) && !i(Yt) }, amazon: { phone: i(Be), tablet: !i(Be) && i(Ss), device: i(Be) || i(Ss) }, android: { phone: !i(Yt) && i(Be) || !i(Yt) && i(En), tablet: !i(Yt) && !i(Be) && !i(En) && (i(Ss) || i(Nc)), device: !i(Yt) && (i(Be) || i(Ss) || i(En) || i(Nc)) || i(/\bokhttp\b/i) }, windows: { phone: i(Yt), tablet: i(Xc), device: i(Yt) || i(Xc) }, other: { blackberry: i(Hc), blackberry10: i(jc), opera: i(zc), firefox: i(Wc), chrome: i(Vc), device: i(Hc) || i(jc) || i(zc) || i(Wc) || i(Vc) }, any: false, phone: false, tablet: false };
  return n.any = n.apple.device || n.android.device || n.windows.device || n.other.device, n.phone = n.apple.phone || n.android.phone || n.windows.phone, n.tablet = n.apple.tablet || n.android.tablet || n.windows.tablet, n;
}
var qc;
const S0 = (qc = Kc.default) != null ? qc : Kc, Zc = S0(globalThis.navigator);
var E0 = Object.defineProperty, Qc = Object.getOwnPropertySymbols, A0 = Object.prototype.hasOwnProperty, w0 = Object.prototype.propertyIsEnumerable, Jc = (r, t, e) => t in r ? E0(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, th = (r, t) => {
  for (var e in t || (t = {})) A0.call(t, e) && Jc(r, e, t[e]);
  if (Qc) for (var e of Qc(t)) w0.call(t, e) && Jc(r, e, t[e]);
  return r;
};
const P0 = 9, Es = 100, R0 = 0, M0 = 0, eh = 2, rh = 1, C0 = -1e3, O0 = -1e3, G0 = 2, An = class Vv {
  constructor(t, e = Zc) {
    this._mobileInfo = e, this.debug = false, this._activateOnTab = true, this._deactivateOnMouseMove = true, this._isActive = false, this._isMobileAccessibility = false, this._div = null, this._pool = [], this._renderId = 0, this._children = [], this._androidUpdateCount = 0, this._androidUpdateFrequency = 500, this._hookDiv = null, (e.tablet || e.phone) && this._createTouchHook(), this._renderer = t;
  }
  get isActive() {
    return this._isActive;
  }
  get isMobileAccessibility() {
    return this._isMobileAccessibility;
  }
  get hookDiv() {
    return this._hookDiv;
  }
  _createTouchHook() {
    const t = document.createElement("button");
    t.style.width = `${rh}px`, t.style.height = `${rh}px`, t.style.position = "absolute", t.style.top = `${C0}px`, t.style.left = `${O0}px`, t.style.zIndex = G0.toString(), t.style.backgroundColor = "#FF0000", t.title = "select to enable accessibility for this content", t.addEventListener("focus", () => {
      this._isMobileAccessibility = true, this._activate(), this._destroyTouchHook();
    }), document.body.appendChild(t), this._hookDiv = t;
  }
  _destroyTouchHook() {
    this._hookDiv && (document.body.removeChild(this._hookDiv), this._hookDiv = null);
  }
  _activate() {
    if (this._isActive) return;
    this._isActive = true, this._div || (this._div = document.createElement("div"), this._div.style.width = `${Es}px`, this._div.style.height = `${Es}px`, this._div.style.position = "absolute", this._div.style.top = `${R0}px`, this._div.style.left = `${M0}px`, this._div.style.zIndex = eh.toString(), this._div.style.pointerEvents = "none"), this._activateOnTab && (this._onKeyDown = this._onKeyDown.bind(this), globalThis.addEventListener("keydown", this._onKeyDown, false)), this._deactivateOnMouseMove && (this._onMouseMove = this._onMouseMove.bind(this), globalThis.document.addEventListener("mousemove", this._onMouseMove, true));
    const t = this._renderer.view.canvas;
    if (t.parentNode) t.parentNode.appendChild(this._div), this._initAccessibilitySetup();
    else {
      const e = new MutationObserver(() => {
        t.parentNode && (t.parentNode.appendChild(this._div), e.disconnect(), this._initAccessibilitySetup());
      });
      e.observe(document.body, { childList: true, subtree: true });
    }
  }
  _initAccessibilitySetup() {
    this._renderer.runners.postrender.add(this), this._renderer.lastObjectRendered && this._updateAccessibleObjects(this._renderer.lastObjectRendered);
  }
  _deactivate() {
    if (!(!this._isActive || this._isMobileAccessibility)) {
      this._isActive = false, globalThis.document.removeEventListener("mousemove", this._onMouseMove, true), this._activateOnTab && globalThis.addEventListener("keydown", this._onKeyDown, false), this._renderer.runners.postrender.remove(this);
      for (const t of this._children) t._accessibleDiv && t._accessibleDiv.parentNode && (t._accessibleDiv.parentNode.removeChild(t._accessibleDiv), t._accessibleDiv = null), t._accessibleActive = false;
      this._pool.forEach((t) => {
        t.parentNode && t.parentNode.removeChild(t);
      }), this._div && this._div.parentNode && this._div.parentNode.removeChild(this._div), this._pool = [], this._children = [];
    }
  }
  _updateAccessibleObjects(t) {
    if (!t.visible || !t.accessibleChildren) return;
    t.accessible && (t._accessibleActive || this._addChild(t), t._renderId = this._renderId);
    const e = t.children;
    if (e) for (let s = 0; s < e.length; s++) this._updateAccessibleObjects(e[s]);
  }
  init(t) {
    const e = Vv.defaultOptions, s = { accessibilityOptions: th(th({}, e), (t == null ? void 0 : t.accessibilityOptions) || {}) };
    this.debug = s.accessibilityOptions.debug, this._activateOnTab = s.accessibilityOptions.activateOnTab, this._deactivateOnMouseMove = s.accessibilityOptions.deactivateOnMouseMove, s.accessibilityOptions.enabledByDefault ? this._activate() : this._activateOnTab && (this._onKeyDown = this._onKeyDown.bind(this), globalThis.addEventListener("keydown", this._onKeyDown, false)), this._renderer.runners.postrender.remove(this);
  }
  postrender() {
    const t = performance.now();
    if (this._mobileInfo.android.device && t < this._androidUpdateCount || (this._androidUpdateCount = t + this._androidUpdateFrequency, !this._renderer.renderingToScreen || !this._renderer.view.canvas)) return;
    const e = /* @__PURE__ */ new Set();
    if (this._renderer.lastObjectRendered) {
      this._updateAccessibleObjects(this._renderer.lastObjectRendered);
      for (const s of this._children) s._renderId === this._renderId && e.add(this._children.indexOf(s));
    }
    for (let s = this._children.length - 1; s >= 0; s--) {
      const i = this._children[s];
      e.has(s) || (i._accessibleDiv && i._accessibleDiv.parentNode && (i._accessibleDiv.parentNode.removeChild(i._accessibleDiv), this._pool.push(i._accessibleDiv), i._accessibleDiv = null), i._accessibleActive = false, dn(this._children, s, 1));
    }
    if (this._renderer.renderingToScreen) {
      const { x: s, y: i, width: n, height: o } = this._renderer.screen, a = this._div;
      a.style.left = `${s}px`, a.style.top = `${i}px`, a.style.width = `${n}px`, a.style.height = `${o}px`;
    }
    for (let s = 0; s < this._children.length; s++) {
      const i = this._children[s];
      if (!i._accessibleActive || !i._accessibleDiv) continue;
      const n = i._accessibleDiv, o = i.hitArea || i.getBounds().rectangle;
      if (i.hitArea) {
        const a = i.worldTransform, l3 = this._renderer.resolution, u3 = this._renderer.resolution;
        n.style.left = `${(a.tx + o.x * a.a) * l3}px`, n.style.top = `${(a.ty + o.y * a.d) * u3}px`, n.style.width = `${o.width * a.a * l3}px`, n.style.height = `${o.height * a.d * u3}px`;
      } else {
        this._capHitArea(o);
        const a = this._renderer.resolution, l3 = this._renderer.resolution;
        n.style.left = `${o.x * a}px`, n.style.top = `${o.y * l3}px`, n.style.width = `${o.width * a}px`, n.style.height = `${o.height * l3}px`;
      }
    }
    this._renderId++;
  }
  _updateDebugHTML(t) {
    t.innerHTML = `type: ${t.type}</br> title : ${t.title}</br> tabIndex: ${t.tabIndex}`;
  }
  _capHitArea(t) {
    t.x < 0 && (t.width += t.x, t.x = 0), t.y < 0 && (t.height += t.y, t.y = 0);
    const { width: e, height: s } = this._renderer;
    t.x + t.width > e && (t.width = e - t.x), t.y + t.height > s && (t.height = s - t.y);
  }
  _addChild(t) {
    let e = this._pool.pop();
    e || (t.accessibleType === "button" ? e = document.createElement("button") : (e = document.createElement(t.accessibleType), e.style.cssText = `
    color: transparent;
    pointer-events: none;
    padding: 0;
    margin: 0;
    border: 0;
    outline: 0;
    background: transparent;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
`, t.accessibleText && (e.innerText = t.accessibleText)), e.style.width = `${Es}px`, e.style.height = `${Es}px`, e.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent", e.style.position = "absolute", e.style.zIndex = eh.toString(), e.style.borderStyle = "none", navigator.userAgent.toLowerCase().includes("chrome") ? e.setAttribute("aria-live", "off") : e.setAttribute("aria-live", "polite"), navigator.userAgent.match(/rv:.*Gecko\//) ? e.setAttribute("aria-relevant", "additions") : e.setAttribute("aria-relevant", "text"), e.addEventListener("click", this._onClick.bind(this)), e.addEventListener("focus", this._onFocus.bind(this)), e.addEventListener("focusout", this._onFocusOut.bind(this))), e.style.pointerEvents = t.accessiblePointerEvents, e.type = t.accessibleType, t.accessibleTitle && t.accessibleTitle !== null ? e.title = t.accessibleTitle : (!t.accessibleHint || t.accessibleHint === null) && (e.title = `container ${t.tabIndex}`), t.accessibleHint && t.accessibleHint !== null && e.setAttribute("aria-label", t.accessibleHint), this.debug && this._updateDebugHTML(e), t._accessibleActive = true, t._accessibleDiv = e, e.container = t, this._children.push(t), this._div.appendChild(t._accessibleDiv), t.interactive && (t._accessibleDiv.tabIndex = t.tabIndex);
  }
  _dispatchEvent(t, e) {
    const { container: s } = t.target, i = this._renderer.events.rootBoundary, n = Object.assign(new or(i), { target: s });
    i.rootTarget = this._renderer.lastObjectRendered, e.forEach((o) => i.dispatchEvent(n, o));
  }
  _onClick(t) {
    this._dispatchEvent(t, ["click", "pointertap", "tap"]);
  }
  _onFocus(t) {
    t.target.getAttribute("aria-live") || t.target.setAttribute("aria-live", "assertive"), this._dispatchEvent(t, ["mouseover"]);
  }
  _onFocusOut(t) {
    t.target.getAttribute("aria-live") || t.target.setAttribute("aria-live", "polite"), this._dispatchEvent(t, ["mouseout"]);
  }
  _onKeyDown(t) {
    t.keyCode !== P0 || !this._activateOnTab || this._activate();
  }
  _onMouseMove(t) {
    t.movementX === 0 && t.movementY === 0 || this._deactivate();
  }
  destroy() {
    this._deactivate(), this._destroyTouchHook(), this._div = null, this._pool = null, this._children = null, this._renderer = null, this._activateOnTab && globalThis.removeEventListener("keydown", this._onKeyDown);
  }
  setAccessibilityEnabled(t) {
    t ? this._activate() : this._deactivate();
  }
};
An.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem], name: "accessibility" }, An.defaultOptions = { enabledByDefault: false, debug: false, activateOnTab: true, deactivateOnMouseMove: true };
let sh = An;
const ih = { accessible: false, accessibleTitle: null, accessibleHint: null, tabIndex: 0, accessibleType: "button", accessibleText: null, accessiblePointerEvents: "auto", accessibleChildren: true, _accessibleActive: false, _accessibleDiv: null, _renderId: -1 };
G$1.add(sh), G$1.mixin(lt, ih);
class wn {
  static init(t) {
    Object.defineProperty(this, "resizeTo", { set(e) {
      globalThis.removeEventListener("resize", this.queueResize), this._resizeTo = e, e && (globalThis.addEventListener("resize", this.queueResize), this.resize());
    }, get() {
      return this._resizeTo;
    } }), this.queueResize = () => {
      this._resizeTo && (this._cancelResize(), this._resizeId = requestAnimationFrame(() => this.resize()));
    }, this._cancelResize = () => {
      this._resizeId && (cancelAnimationFrame(this._resizeId), this._resizeId = null);
    }, this.resize = () => {
      if (!this._resizeTo) return;
      this._cancelResize();
      let e, s;
      if (this._resizeTo === globalThis.window) e = globalThis.innerWidth, s = globalThis.innerHeight;
      else {
        const { clientWidth: i, clientHeight: n } = this._resizeTo;
        e = i, s = n;
      }
      this.renderer.resize(e, s), this.render();
    }, this._resizeId = null, this._resizeTo = null, this.resizeTo = t.resizeTo || null;
  }
  static destroy() {
    globalThis.removeEventListener("resize", this.queueResize), this._cancelResize(), this._cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null;
  }
}
wn.extension = x$1.Application;
var Kt$1 = ((r) => (r[r.INTERACTION = 50] = "INTERACTION", r[r.HIGH = 25] = "HIGH", r[r.NORMAL = 0] = "NORMAL", r[r.LOW = -25] = "LOW", r[r.UTILITY = -50] = "UTILITY", r))(Kt$1 || {});
class As {
  constructor(t, e = null, s = 0, i = false) {
    this.next = null, this.previous = null, this._destroyed = false, this._fn = t, this._context = e, this.priority = s, this._once = i;
  }
  match(t, e = null) {
    return this._fn === t && this._context === e;
  }
  emit(t) {
    this._fn && (this._context ? this._fn.call(this._context, t) : this._fn(t));
    const e = this.next;
    return this._once && this.destroy(true), this._destroyed && (this.next = null), e;
  }
  connect(t) {
    this.previous = t, t.next && (t.next.previous = this), this.next = t.next, t.next = this;
  }
  destroy(t = false) {
    this._destroyed = true, this._fn = null, this._context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
    const e = this.next;
    return this.next = t ? null : e, this.previous = null, e;
  }
}
const nh = class Et {
  constructor() {
    this.autoStart = false, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = false, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = false, this._lastFrame = -1, this._head = new As(null, null, 1 / 0), this.deltaMS = 1 / Et.targetFPMS, this.elapsedMS = 1 / Et.targetFPMS, this._tick = (t) => {
      this._requestId = null, this.started && (this.update(t), this.started && this._requestId === null && this._head.next && (this._requestId = requestAnimationFrame(this._tick)));
    };
  }
  _requestIfNeeded() {
    this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
  }
  _cancelIfNeeded() {
    this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null);
  }
  _startIfPossible() {
    this.started ? this._requestIfNeeded() : this.autoStart && this.start();
  }
  add(t, e, s = Kt$1.NORMAL) {
    return this._addListener(new As(t, e, s));
  }
  addOnce(t, e, s = Kt$1.NORMAL) {
    return this._addListener(new As(t, e, s, true));
  }
  _addListener(t) {
    let e = this._head.next, s = this._head;
    if (!e) t.connect(s);
    else {
      for (; e; ) {
        if (t.priority > e.priority) {
          t.connect(s);
          break;
        }
        s = e, e = e.next;
      }
      t.previous || t.connect(s);
    }
    return this._startIfPossible(), this;
  }
  remove(t, e) {
    let s = this._head.next;
    for (; s; ) s.match(t, e) ? s = s.destroy() : s = s.next;
    return this._head.next || this._cancelIfNeeded(), this;
  }
  get count() {
    if (!this._head) return 0;
    let t = 0, e = this._head;
    for (; e = e.next; ) t++;
    return t;
  }
  start() {
    this.started || (this.started = true, this._requestIfNeeded());
  }
  stop() {
    this.started && (this.started = false, this._cancelIfNeeded());
  }
  destroy() {
    if (!this._protected) {
      this.stop();
      let t = this._head.next;
      for (; t; ) t = t.destroy(true);
      this._head.destroy(), this._head = null;
    }
  }
  update(t = performance.now()) {
    let e;
    if (t > this.lastTime) {
      if (e = this.elapsedMS = t - this.lastTime, e > this._maxElapsedMS && (e = this._maxElapsedMS), e *= this.speed, this._minElapsedMS) {
        const n = t - this._lastFrame | 0;
        if (n < this._minElapsedMS) return;
        this._lastFrame = t - n % this._minElapsedMS;
      }
      this.deltaMS = e, this.deltaTime = this.deltaMS * Et.targetFPMS;
      const s = this._head;
      let i = s.next;
      for (; i; ) i = i.emit(this);
      s.next || this._cancelIfNeeded();
    } else this.deltaTime = this.deltaMS = this.elapsedMS = 0;
    this.lastTime = t;
  }
  get FPS() {
    return 1e3 / this.elapsedMS;
  }
  get minFPS() {
    return 1e3 / this._maxElapsedMS;
  }
  set minFPS(t) {
    const e = Math.min(this.maxFPS, t), s = Math.min(Math.max(0, e) / 1e3, Et.targetFPMS);
    this._maxElapsedMS = 1 / s;
  }
  get maxFPS() {
    return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0;
  }
  set maxFPS(t) {
    if (t === 0) this._minElapsedMS = 0;
    else {
      const e = Math.max(this.minFPS, t);
      this._minElapsedMS = 1 / (e / 1e3);
    }
  }
  static get shared() {
    if (!Et._shared) {
      const t = Et._shared = new Et();
      t.autoStart = true, t._protected = true;
    }
    return Et._shared;
  }
  static get system() {
    if (!Et._system) {
      const t = Et._system = new Et();
      t.autoStart = true, t._protected = true;
    }
    return Et._system;
  }
};
nh.targetFPMS = 0.06;
let at = nh;
class Pn {
  static init(t) {
    t = Object.assign({ autoStart: true, sharedTicker: false }, t), Object.defineProperty(this, "ticker", { set(e) {
      this._ticker && this._ticker.remove(this.render, this), this._ticker = e, e && e.add(this.render, this, Kt$1.LOW);
    }, get() {
      return this._ticker;
    } }), this.stop = () => {
      this._ticker.stop();
    }, this.start = () => {
      this._ticker.start();
    }, this._ticker = null, this.ticker = t.sharedTicker ? at.shared : new at(), t.autoStart && this.start();
  }
  static destroy() {
    if (this._ticker) {
      const t = this._ticker;
      this.ticker = null, t.destroy();
    }
  }
}
Pn.extension = x$1.Application, G$1.add(wn), G$1.add(Pn);
let I0 = class {
  constructor() {
    this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = false, this._tickerAdded = false, this._pauseUpdate = true;
  }
  init(t) {
    this.removeTickerListener(), this.events = t, this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = false, this._tickerAdded = false, this._pauseUpdate = true;
  }
  get pauseUpdate() {
    return this._pauseUpdate;
  }
  set pauseUpdate(t) {
    this._pauseUpdate = t;
  }
  addTickerListener() {
    this._tickerAdded || !this.domElement || (at.system.add(this._tickerUpdate, this, Kt$1.INTERACTION), this._tickerAdded = true);
  }
  removeTickerListener() {
    this._tickerAdded && (at.system.remove(this._tickerUpdate, this), this._tickerAdded = false);
  }
  pointerMoved() {
    this._didMove = true;
  }
  _update() {
    if (!this.domElement || this._pauseUpdate) return;
    if (this._didMove) {
      this._didMove = false;
      return;
    }
    const t = this.events._rootPointerEvent;
    this.events.supportsTouchEvents && t.pointerType === "touch" || globalThis.document.dispatchEvent(this.events.supportsPointerEvents ? new PointerEvent("pointermove", { clientX: t.clientX, clientY: t.clientY, pointerType: t.pointerType, pointerId: t.pointerId }) : new MouseEvent("mousemove", { clientX: t.clientX, clientY: t.clientY }));
  }
  _tickerUpdate(t) {
    this._deltaTime += t.deltaTime, !(this._deltaTime < this.interactionFrequency) && (this._deltaTime = 0, this._update());
  }
};
const qt$1 = new I0();
class vr extends or {
  constructor() {
    super(...arguments), this.client = new z$1(), this.movement = new z$1(), this.offset = new z$1(), this.global = new z$1(), this.screen = new z$1();
  }
  get clientX() {
    return this.client.x;
  }
  get clientY() {
    return this.client.y;
  }
  get x() {
    return this.clientX;
  }
  get y() {
    return this.clientY;
  }
  get movementX() {
    return this.movement.x;
  }
  get movementY() {
    return this.movement.y;
  }
  get offsetX() {
    return this.offset.x;
  }
  get offsetY() {
    return this.offset.y;
  }
  get globalX() {
    return this.global.x;
  }
  get globalY() {
    return this.global.y;
  }
  get screenX() {
    return this.screen.x;
  }
  get screenY() {
    return this.screen.y;
  }
  getLocalPosition(t, e, s) {
    return t.worldTransform.applyInverse(s || this.global, e);
  }
  getModifierState(t) {
    return "getModifierState" in this.nativeEvent && this.nativeEvent.getModifierState(t);
  }
  initMouseEvent(t, e, s, i, n, o, a, l3, u3, c, h, d, p, f2, g) {
    throw new Error("Method not implemented.");
  }
}
let Rt$1 = class Rt extends vr {
  constructor() {
    super(...arguments), this.width = 0, this.height = 0, this.isPrimary = false;
  }
  getCoalescedEvents() {
    return this.type === "pointermove" || this.type === "mousemove" || this.type === "touchmove" ? [this] : [];
  }
  getPredictedEvents() {
    throw new Error("getPredictedEvents is not supported!");
  }
};
class be extends vr {
  constructor() {
    super(...arguments), this.DOM_DELTA_PIXEL = 0, this.DOM_DELTA_LINE = 1, this.DOM_DELTA_PAGE = 2;
  }
}
be.DOM_DELTA_PIXEL = 0, be.DOM_DELTA_LINE = 1, be.DOM_DELTA_PAGE = 2;
const B0 = 2048, F0 = new z$1(), yr = new z$1();
class oh {
  constructor(t) {
    this.dispatch = new dt(), this.moveOnAll = false, this.enableGlobalMoveEvents = true, this.mappingState = { trackingData: {} }, this.eventPool = /* @__PURE__ */ new Map(), this._allInteractiveElements = [], this._hitElements = [], this._isPointerMoveEvent = false, this.rootTarget = t, this.hitPruneFn = this.hitPruneFn.bind(this), this.hitTestFn = this.hitTestFn.bind(this), this.mapPointerDown = this.mapPointerDown.bind(this), this.mapPointerMove = this.mapPointerMove.bind(this), this.mapPointerOut = this.mapPointerOut.bind(this), this.mapPointerOver = this.mapPointerOver.bind(this), this.mapPointerUp = this.mapPointerUp.bind(this), this.mapPointerUpOutside = this.mapPointerUpOutside.bind(this), this.mapWheel = this.mapWheel.bind(this), this.mappingTable = {}, this.addEventMapping("pointerdown", this.mapPointerDown), this.addEventMapping("pointermove", this.mapPointerMove), this.addEventMapping("pointerout", this.mapPointerOut), this.addEventMapping("pointerleave", this.mapPointerOut), this.addEventMapping("pointerover", this.mapPointerOver), this.addEventMapping("pointerup", this.mapPointerUp), this.addEventMapping("pointerupoutside", this.mapPointerUpOutside), this.addEventMapping("wheel", this.mapWheel);
  }
  addEventMapping(t, e) {
    this.mappingTable[t] || (this.mappingTable[t] = []), this.mappingTable[t].push({ fn: e, priority: 0 }), this.mappingTable[t].sort((s, i) => s.priority - i.priority);
  }
  dispatchEvent(t, e) {
    t.propagationStopped = false, t.propagationImmediatelyStopped = false, this.propagate(t, e), this.dispatch.emit(e || t.type, t);
  }
  mapEvent(t) {
    if (!this.rootTarget) return;
    const e = this.mappingTable[t.type];
    if (e) for (let s = 0, i = e.length; s < i; s++) e[s].fn(t);
  }
  hitTest(t, e) {
    qt$1.pauseUpdate = true;
    const s = this._isPointerMoveEvent && this.enableGlobalMoveEvents ? "hitTestMoveRecursive" : "hitTestRecursive", i = this[s](this.rootTarget, this.rootTarget.eventMode, F0.set(t, e), this.hitTestFn, this.hitPruneFn);
    return i && i[0];
  }
  propagate(t, e) {
    if (!t.target) return;
    const s = t.composedPath();
    t.eventPhase = t.CAPTURING_PHASE;
    for (let i = 0, n = s.length - 1; i < n; i++) if (t.currentTarget = s[i], this.notifyTarget(t, e), t.propagationStopped || t.propagationImmediatelyStopped) return;
    if (t.eventPhase = t.AT_TARGET, t.currentTarget = t.target, this.notifyTarget(t, e), !(t.propagationStopped || t.propagationImmediatelyStopped)) {
      t.eventPhase = t.BUBBLING_PHASE;
      for (let i = s.length - 2; i >= 0; i--) if (t.currentTarget = s[i], this.notifyTarget(t, e), t.propagationStopped || t.propagationImmediatelyStopped) return;
    }
  }
  all(t, e, s = this._allInteractiveElements) {
    if (s.length === 0) return;
    t.eventPhase = t.BUBBLING_PHASE;
    const i = Array.isArray(e) ? e : [e];
    for (let n = s.length - 1; n >= 0; n--) i.forEach((o) => {
      t.currentTarget = s[n], this.notifyTarget(t, o);
    });
  }
  propagationPath(t) {
    const e = [t];
    for (let s = 0; s < B0 && t !== this.rootTarget && t.parent; s++) {
      if (!t.parent) throw new Error("Cannot find propagation path to disconnected target");
      e.push(t.parent), t = t.parent;
    }
    return e.reverse(), e;
  }
  hitTestMoveRecursive(t, e, s, i, n, o = false) {
    let a = false;
    if (this._interactivePrune(t)) return null;
    if ((t.eventMode === "dynamic" || e === "dynamic") && (qt$1.pauseUpdate = false), t.interactiveChildren && t.children) {
      const c = t.children;
      for (let h = c.length - 1; h >= 0; h--) {
        const d = c[h], p = this.hitTestMoveRecursive(d, this._isInteractive(e) ? e : d.eventMode, s, i, n, o || n(t, s));
        if (p) {
          if (p.length > 0 && !p[p.length - 1].parent) continue;
          const f2 = t.isInteractive();
          (p.length > 0 || f2) && (f2 && this._allInteractiveElements.push(t), p.push(t)), this._hitElements.length === 0 && (this._hitElements = p), a = true;
        }
      }
    }
    const l3 = this._isInteractive(e), u3 = t.isInteractive();
    return u3 && u3 && this._allInteractiveElements.push(t), o || this._hitElements.length > 0 ? null : a ? this._hitElements : l3 && !n(t, s) && i(t, s) ? u3 ? [t] : [] : null;
  }
  hitTestRecursive(t, e, s, i, n) {
    if (this._interactivePrune(t) || n(t, s)) return null;
    if ((t.eventMode === "dynamic" || e === "dynamic") && (qt$1.pauseUpdate = false), t.interactiveChildren && t.children) {
      const l3 = t.children, u3 = s;
      for (let c = l3.length - 1; c >= 0; c--) {
        const h = l3[c], d = this.hitTestRecursive(h, this._isInteractive(e) ? e : h.eventMode, u3, i, n);
        if (d) {
          if (d.length > 0 && !d[d.length - 1].parent) continue;
          const p = t.isInteractive();
          return (d.length > 0 || p) && d.push(t), d;
        }
      }
    }
    const o = this._isInteractive(e), a = t.isInteractive();
    return o && i(t, s) ? a ? [t] : [] : null;
  }
  _isInteractive(t) {
    return t === "static" || t === "dynamic";
  }
  _interactivePrune(t) {
    return !t || !t.visible || !t.renderable || !t.measurable || t.eventMode === "none" || t.eventMode === "passive" && !t.interactiveChildren;
  }
  hitPruneFn(t, e) {
    if (t.hitArea && (t.worldTransform.applyInverse(e, yr), !t.hitArea.contains(yr.x, yr.y))) return true;
    if (t.effects && t.effects.length) for (let s = 0; s < t.effects.length; s++) {
      const i = t.effects[s];
      if (i.containsPoint && !i.containsPoint(e, this.hitTestFn)) return true;
    }
    return false;
  }
  hitTestFn(t, e) {
    return t.hitArea ? true : t != null && t.containsPoint ? (t.worldTransform.applyInverse(e, yr), t.containsPoint(yr)) : false;
  }
  notifyTarget(t, e) {
    var s, i;
    if (!t.currentTarget.isInteractive()) return;
    e != null || (e = t.type);
    const n = `on${e}`;
    (i = (s = t.currentTarget)[n]) == null || i.call(s, t);
    const o = t.eventPhase === t.CAPTURING_PHASE || t.eventPhase === t.AT_TARGET ? `${e}capture` : e;
    this._notifyListeners(t, o), t.eventPhase === t.AT_TARGET && this._notifyListeners(t, e);
  }
  mapPointerDown(t) {
    if (!(t instanceof Rt$1)) return;
    const e = this.createPointerEvent(t);
    if (this.dispatchEvent(e, "pointerdown"), e.pointerType === "touch") this.dispatchEvent(e, "touchstart");
    else if (e.pointerType === "mouse" || e.pointerType === "pen") {
      const i = e.button === 2;
      this.dispatchEvent(e, i ? "rightdown" : "mousedown");
    }
    const s = this.trackingData(t.pointerId);
    s.pressTargetsByButton[t.button] = e.composedPath(), this.freeEvent(e);
  }
  mapPointerMove(t) {
    var e, s, i;
    if (!(t instanceof Rt$1)) return;
    this._allInteractiveElements.length = 0, this._hitElements.length = 0, this._isPointerMoveEvent = true;
    const n = this.createPointerEvent(t);
    this._isPointerMoveEvent = false;
    const o = n.pointerType === "mouse" || n.pointerType === "pen", a = this.trackingData(t.pointerId), l3 = this.findMountedTarget(a.overTargets);
    if (((e = a.overTargets) == null ? void 0 : e.length) > 0 && l3 !== n.target) {
      const h = t.type === "mousemove" ? "mouseout" : "pointerout", d = this.createPointerEvent(t, h, l3);
      if (this.dispatchEvent(d, "pointerout"), o && this.dispatchEvent(d, "mouseout"), !n.composedPath().includes(l3)) {
        const p = this.createPointerEvent(t, "pointerleave", l3);
        for (p.eventPhase = p.AT_TARGET; p.target && !n.composedPath().includes(p.target); ) p.currentTarget = p.target, this.notifyTarget(p), o && this.notifyTarget(p, "mouseleave"), p.target = p.target.parent;
        this.freeEvent(p);
      }
      this.freeEvent(d);
    }
    if (l3 !== n.target) {
      const h = t.type === "mousemove" ? "mouseover" : "pointerover", d = this.clonePointerEvent(n, h);
      this.dispatchEvent(d, "pointerover"), o && this.dispatchEvent(d, "mouseover");
      let p = l3 == null ? void 0 : l3.parent;
      for (; p && p !== this.rootTarget.parent && p !== n.target; ) p = p.parent;
      if (!p || p === this.rootTarget.parent) {
        const f2 = this.clonePointerEvent(n, "pointerenter");
        for (f2.eventPhase = f2.AT_TARGET; f2.target && f2.target !== l3 && f2.target !== this.rootTarget.parent; ) f2.currentTarget = f2.target, this.notifyTarget(f2), o && this.notifyTarget(f2, "mouseenter"), f2.target = f2.target.parent;
        this.freeEvent(f2);
      }
      this.freeEvent(d);
    }
    const u3 = [], c = (s = this.enableGlobalMoveEvents) != null ? s : true;
    this.moveOnAll ? u3.push("pointermove") : this.dispatchEvent(n, "pointermove"), c && u3.push("globalpointermove"), n.pointerType === "touch" && (this.moveOnAll ? u3.splice(1, 0, "touchmove") : this.dispatchEvent(n, "touchmove"), c && u3.push("globaltouchmove")), o && (this.moveOnAll ? u3.splice(1, 0, "mousemove") : this.dispatchEvent(n, "mousemove"), c && u3.push("globalmousemove"), this.cursor = (i = n.target) == null ? void 0 : i.cursor), u3.length > 0 && this.all(n, u3), this._allInteractiveElements.length = 0, this._hitElements.length = 0, a.overTargets = n.composedPath(), this.freeEvent(n);
  }
  mapPointerOver(t) {
    var e;
    if (!(t instanceof Rt$1)) return;
    const s = this.trackingData(t.pointerId), i = this.createPointerEvent(t), n = i.pointerType === "mouse" || i.pointerType === "pen";
    this.dispatchEvent(i, "pointerover"), n && this.dispatchEvent(i, "mouseover"), i.pointerType === "mouse" && (this.cursor = (e = i.target) == null ? void 0 : e.cursor);
    const o = this.clonePointerEvent(i, "pointerenter");
    for (o.eventPhase = o.AT_TARGET; o.target && o.target !== this.rootTarget.parent; ) o.currentTarget = o.target, this.notifyTarget(o), n && this.notifyTarget(o, "mouseenter"), o.target = o.target.parent;
    s.overTargets = i.composedPath(), this.freeEvent(i), this.freeEvent(o);
  }
  mapPointerOut(t) {
    if (!(t instanceof Rt$1)) return;
    const e = this.trackingData(t.pointerId);
    if (e.overTargets) {
      const s = t.pointerType === "mouse" || t.pointerType === "pen", i = this.findMountedTarget(e.overTargets), n = this.createPointerEvent(t, "pointerout", i);
      this.dispatchEvent(n), s && this.dispatchEvent(n, "mouseout");
      const o = this.createPointerEvent(t, "pointerleave", i);
      for (o.eventPhase = o.AT_TARGET; o.target && o.target !== this.rootTarget.parent; ) o.currentTarget = o.target, this.notifyTarget(o), s && this.notifyTarget(o, "mouseleave"), o.target = o.target.parent;
      e.overTargets = null, this.freeEvent(n), this.freeEvent(o);
    }
    this.cursor = null;
  }
  mapPointerUp(t) {
    if (!(t instanceof Rt$1)) return;
    const e = performance.now(), s = this.createPointerEvent(t);
    if (this.dispatchEvent(s, "pointerup"), s.pointerType === "touch") this.dispatchEvent(s, "touchend");
    else if (s.pointerType === "mouse" || s.pointerType === "pen") {
      const a = s.button === 2;
      this.dispatchEvent(s, a ? "rightup" : "mouseup");
    }
    const i = this.trackingData(t.pointerId), n = this.findMountedTarget(i.pressTargetsByButton[t.button]);
    let o = n;
    if (n && !s.composedPath().includes(n)) {
      let a = n;
      for (; a && !s.composedPath().includes(a); ) {
        if (s.currentTarget = a, this.notifyTarget(s, "pointerupoutside"), s.pointerType === "touch") this.notifyTarget(s, "touchendoutside");
        else if (s.pointerType === "mouse" || s.pointerType === "pen") {
          const l3 = s.button === 2;
          this.notifyTarget(s, l3 ? "rightupoutside" : "mouseupoutside");
        }
        a = a.parent;
      }
      delete i.pressTargetsByButton[t.button], o = a;
    }
    if (o) {
      const a = this.clonePointerEvent(s, "click");
      a.target = o, a.path = null, i.clicksByButton[t.button] || (i.clicksByButton[t.button] = { clickCount: 0, target: a.target, timeStamp: e });
      const l3 = i.clicksByButton[t.button];
      if (l3.target === a.target && e - l3.timeStamp < 200 ? ++l3.clickCount : l3.clickCount = 1, l3.target = a.target, l3.timeStamp = e, a.detail = l3.clickCount, a.pointerType === "mouse") {
        const u3 = a.button === 2;
        this.dispatchEvent(a, u3 ? "rightclick" : "click");
      } else a.pointerType === "touch" && this.dispatchEvent(a, "tap");
      this.dispatchEvent(a, "pointertap"), this.freeEvent(a);
    }
    this.freeEvent(s);
  }
  mapPointerUpOutside(t) {
    if (!(t instanceof Rt$1)) return;
    const e = this.trackingData(t.pointerId), s = this.findMountedTarget(e.pressTargetsByButton[t.button]), i = this.createPointerEvent(t);
    if (s) {
      let n = s;
      for (; n; ) i.currentTarget = n, this.notifyTarget(i, "pointerupoutside"), i.pointerType === "touch" ? this.notifyTarget(i, "touchendoutside") : (i.pointerType === "mouse" || i.pointerType === "pen") && this.notifyTarget(i, i.button === 2 ? "rightupoutside" : "mouseupoutside"), n = n.parent;
      delete e.pressTargetsByButton[t.button];
    }
    this.freeEvent(i);
  }
  mapWheel(t) {
    if (!(t instanceof be)) return;
    const e = this.createWheelEvent(t);
    this.dispatchEvent(e), this.freeEvent(e);
  }
  findMountedTarget(t) {
    if (!t) return null;
    let e = t[0];
    for (let s = 1; s < t.length && t[s].parent === e; s++) e = t[s];
    return e;
  }
  createPointerEvent(t, e, s) {
    var i;
    const n = this.allocateEvent(Rt$1);
    return this.copyPointerData(t, n), this.copyMouseData(t, n), this.copyData(t, n), n.nativeEvent = t.nativeEvent, n.originalEvent = t, n.target = (i = s != null ? s : this.hitTest(n.global.x, n.global.y)) != null ? i : this._hitElements[0], typeof e == "string" && (n.type = e), n;
  }
  createWheelEvent(t) {
    const e = this.allocateEvent(be);
    return this.copyWheelData(t, e), this.copyMouseData(t, e), this.copyData(t, e), e.nativeEvent = t.nativeEvent, e.originalEvent = t, e.target = this.hitTest(e.global.x, e.global.y), e;
  }
  clonePointerEvent(t, e) {
    const s = this.allocateEvent(Rt$1);
    return s.nativeEvent = t.nativeEvent, s.originalEvent = t.originalEvent, this.copyPointerData(t, s), this.copyMouseData(t, s), this.copyData(t, s), s.target = t.target, s.path = t.composedPath().slice(), s.type = e != null ? e : s.type, s;
  }
  copyWheelData(t, e) {
    e.deltaMode = t.deltaMode, e.deltaX = t.deltaX, e.deltaY = t.deltaY, e.deltaZ = t.deltaZ;
  }
  copyPointerData(t, e) {
    t instanceof Rt$1 && e instanceof Rt$1 && (e.pointerId = t.pointerId, e.width = t.width, e.height = t.height, e.isPrimary = t.isPrimary, e.pointerType = t.pointerType, e.pressure = t.pressure, e.tangentialPressure = t.tangentialPressure, e.tiltX = t.tiltX, e.tiltY = t.tiltY, e.twist = t.twist);
  }
  copyMouseData(t, e) {
    t instanceof vr && e instanceof vr && (e.altKey = t.altKey, e.button = t.button, e.buttons = t.buttons, e.client.copyFrom(t.client), e.ctrlKey = t.ctrlKey, e.metaKey = t.metaKey, e.movement.copyFrom(t.movement), e.screen.copyFrom(t.screen), e.shiftKey = t.shiftKey, e.global.copyFrom(t.global));
  }
  copyData(t, e) {
    e.isTrusted = t.isTrusted, e.srcElement = t.srcElement, e.timeStamp = performance.now(), e.type = t.type, e.detail = t.detail, e.view = t.view, e.which = t.which, e.layer.copyFrom(t.layer), e.page.copyFrom(t.page);
  }
  trackingData(t) {
    return this.mappingState.trackingData[t] || (this.mappingState.trackingData[t] = { pressTargetsByButton: {}, clicksByButton: {}, overTarget: null }), this.mappingState.trackingData[t];
  }
  allocateEvent(t) {
    this.eventPool.has(t) || this.eventPool.set(t, []);
    const e = this.eventPool.get(t).pop() || new t(this);
    return e.eventPhase = e.NONE, e.currentTarget = null, e.defaultPrevented = false, e.path = null, e.target = null, e;
  }
  freeEvent(t) {
    if (t.manager !== this) throw new Error("It is illegal to free an event not managed by this EventBoundary!");
    const e = t.constructor;
    this.eventPool.has(e) || this.eventPool.set(e, []), this.eventPool.get(e).push(t);
  }
  _notifyListeners(t, e) {
    const s = t.currentTarget._events[e];
    if (s) if ("fn" in s) s.once && t.currentTarget.removeListener(e, s.fn, void 0, true), s.fn.call(s.context, t);
    else for (let i = 0, n = s.length; i < n && !t.propagationImmediatelyStopped; i++) s[i].once && t.currentTarget.removeListener(e, s[i].fn, void 0, true), s[i].fn.call(s[i].context, t);
  }
}
var D0 = Object.defineProperty, ah = Object.getOwnPropertySymbols, U0 = Object.prototype.hasOwnProperty, k0 = Object.prototype.propertyIsEnumerable, lh = (r, t, e) => t in r ? D0(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, $0 = (r, t) => {
  for (var e in t || (t = {})) U0.call(t, e) && lh(r, e, t[e]);
  if (ah) for (var e of ah(t)) k0.call(t, e) && lh(r, e, t[e]);
  return r;
};
const L0 = 1, N0 = { touchstart: "pointerdown", touchend: "pointerup", touchendoutside: "pointerupoutside", touchmove: "pointermove", touchcancel: "pointercancel" }, Rn = class vu {
  constructor(t) {
    this.supportsTouchEvents = "ontouchstart" in globalThis, this.supportsPointerEvents = !!globalThis.PointerEvent, this.domElement = null, this.resolution = 1, this.renderer = t, this.rootBoundary = new oh(null), qt$1.init(this), this.autoPreventDefault = true, this._eventsAdded = false, this._rootPointerEvent = new Rt$1(null), this._rootWheelEvent = new be(null), this.cursorStyles = { default: "inherit", pointer: "pointer" }, this.features = new Proxy($0({}, vu.defaultEventFeatures), { set: (e, s, i) => (s === "globalMove" && (this.rootBoundary.enableGlobalMoveEvents = i), e[s] = i, true) }), this._onPointerDown = this._onPointerDown.bind(this), this._onPointerMove = this._onPointerMove.bind(this), this._onPointerUp = this._onPointerUp.bind(this), this._onPointerOverOut = this._onPointerOverOut.bind(this), this.onWheel = this.onWheel.bind(this);
  }
  static get defaultEventMode() {
    return this._defaultEventMode;
  }
  init(t) {
    var e, s;
    const { canvas: i, resolution: n } = this.renderer;
    this.setTargetElement(i), this.resolution = n, vu._defaultEventMode = (e = t.eventMode) != null ? e : "passive", Object.assign(this.features, (s = t.eventFeatures) != null ? s : {}), this.rootBoundary.enableGlobalMoveEvents = this.features.globalMove;
  }
  resolutionChange(t) {
    this.resolution = t;
  }
  destroy() {
    this.setTargetElement(null), this.renderer = null, this._currentCursor = null;
  }
  setCursor(t) {
    t || (t = "default");
    let e = true;
    if (globalThis.OffscreenCanvas && this.domElement instanceof OffscreenCanvas && (e = false), this._currentCursor === t) return;
    this._currentCursor = t;
    const s = this.cursorStyles[t];
    if (s) switch (typeof s) {
      case "string":
        e && (this.domElement.style.cursor = s);
        break;
      case "function":
        s(t);
        break;
      case "object":
        e && Object.assign(this.domElement.style, s);
        break;
    }
    else e && typeof t == "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, t) && (this.domElement.style.cursor = t);
  }
  get pointer() {
    return this._rootPointerEvent;
  }
  _onPointerDown(t) {
    if (!this.features.click) return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    const e = this._normalizeToPointerData(t);
    this.autoPreventDefault && e[0].isNormalized && (t.cancelable || !("cancelable" in t)) && t.preventDefault();
    for (let s = 0, i = e.length; s < i; s++) {
      const n = e[s], o = this._bootstrapEvent(this._rootPointerEvent, n);
      this.rootBoundary.mapEvent(o);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  _onPointerMove(t) {
    if (!this.features.move) return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, qt$1.pointerMoved();
    const e = this._normalizeToPointerData(t);
    for (let s = 0, i = e.length; s < i; s++) {
      const n = this._bootstrapEvent(this._rootPointerEvent, e[s]);
      this.rootBoundary.mapEvent(n);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  _onPointerUp(t) {
    if (!this.features.click) return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    let e = t.target;
    t.composedPath && t.composedPath().length > 0 && (e = t.composedPath()[0]);
    const s = e !== this.domElement ? "outside" : "", i = this._normalizeToPointerData(t);
    for (let n = 0, o = i.length; n < o; n++) {
      const a = this._bootstrapEvent(this._rootPointerEvent, i[n]);
      a.type += s, this.rootBoundary.mapEvent(a);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  _onPointerOverOut(t) {
    if (!this.features.click) return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    const e = this._normalizeToPointerData(t);
    for (let s = 0, i = e.length; s < i; s++) {
      const n = this._bootstrapEvent(this._rootPointerEvent, e[s]);
      this.rootBoundary.mapEvent(n);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  onWheel(t) {
    if (!this.features.wheel) return;
    const e = this.normalizeWheelEvent(t);
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, this.rootBoundary.mapEvent(e);
  }
  setTargetElement(t) {
    this._removeEvents(), this.domElement = t, qt$1.domElement = t, this._addEvents();
  }
  _addEvents() {
    if (this._eventsAdded || !this.domElement) return;
    qt$1.addTickerListener();
    const t = this.domElement.style;
    t && (globalThis.navigator.msPointerEnabled ? (t.msContentZooming = "none", t.msTouchAction = "none") : this.supportsPointerEvents && (t.touchAction = "none")), this.supportsPointerEvents ? (globalThis.document.addEventListener("pointermove", this._onPointerMove, true), this.domElement.addEventListener("pointerdown", this._onPointerDown, true), this.domElement.addEventListener("pointerleave", this._onPointerOverOut, true), this.domElement.addEventListener("pointerover", this._onPointerOverOut, true), globalThis.addEventListener("pointerup", this._onPointerUp, true)) : (globalThis.document.addEventListener("mousemove", this._onPointerMove, true), this.domElement.addEventListener("mousedown", this._onPointerDown, true), this.domElement.addEventListener("mouseout", this._onPointerOverOut, true), this.domElement.addEventListener("mouseover", this._onPointerOverOut, true), globalThis.addEventListener("mouseup", this._onPointerUp, true), this.supportsTouchEvents && (this.domElement.addEventListener("touchstart", this._onPointerDown, true), this.domElement.addEventListener("touchend", this._onPointerUp, true), this.domElement.addEventListener("touchmove", this._onPointerMove, true))), this.domElement.addEventListener("wheel", this.onWheel, { passive: true, capture: true }), this._eventsAdded = true;
  }
  _removeEvents() {
    if (!this._eventsAdded || !this.domElement) return;
    qt$1.removeTickerListener();
    const t = this.domElement.style;
    t && (globalThis.navigator.msPointerEnabled ? (t.msContentZooming = "", t.msTouchAction = "") : this.supportsPointerEvents && (t.touchAction = "")), this.supportsPointerEvents ? (globalThis.document.removeEventListener("pointermove", this._onPointerMove, true), this.domElement.removeEventListener("pointerdown", this._onPointerDown, true), this.domElement.removeEventListener("pointerleave", this._onPointerOverOut, true), this.domElement.removeEventListener("pointerover", this._onPointerOverOut, true), globalThis.removeEventListener("pointerup", this._onPointerUp, true)) : (globalThis.document.removeEventListener("mousemove", this._onPointerMove, true), this.domElement.removeEventListener("mousedown", this._onPointerDown, true), this.domElement.removeEventListener("mouseout", this._onPointerOverOut, true), this.domElement.removeEventListener("mouseover", this._onPointerOverOut, true), globalThis.removeEventListener("mouseup", this._onPointerUp, true), this.supportsTouchEvents && (this.domElement.removeEventListener("touchstart", this._onPointerDown, true), this.domElement.removeEventListener("touchend", this._onPointerUp, true), this.domElement.removeEventListener("touchmove", this._onPointerMove, true))), this.domElement.removeEventListener("wheel", this.onWheel, true), this.domElement = null, this._eventsAdded = false;
  }
  mapPositionToPoint(t, e, s) {
    const i = this.domElement.isConnected ? this.domElement.getBoundingClientRect() : { x: 0, y: 0, width: this.domElement.width, height: this.domElement.height, left: 0, top: 0 }, n = 1 / this.resolution;
    t.x = (e - i.left) * (this.domElement.width / i.width) * n, t.y = (s - i.top) * (this.domElement.height / i.height) * n;
  }
  _normalizeToPointerData(t) {
    const e = [];
    if (this.supportsTouchEvents && t instanceof TouchEvent) for (let s = 0, i = t.changedTouches.length; s < i; s++) {
      const n = t.changedTouches[s];
      typeof n.button == "undefined" && (n.button = 0), typeof n.buttons == "undefined" && (n.buttons = 1), typeof n.isPrimary == "undefined" && (n.isPrimary = t.touches.length === 1 && t.type === "touchstart"), typeof n.width == "undefined" && (n.width = n.radiusX || 1), typeof n.height == "undefined" && (n.height = n.radiusY || 1), typeof n.tiltX == "undefined" && (n.tiltX = 0), typeof n.tiltY == "undefined" && (n.tiltY = 0), typeof n.pointerType == "undefined" && (n.pointerType = "touch"), typeof n.pointerId == "undefined" && (n.pointerId = n.identifier || 0), typeof n.pressure == "undefined" && (n.pressure = n.force || 0.5), typeof n.twist == "undefined" && (n.twist = 0), typeof n.tangentialPressure == "undefined" && (n.tangentialPressure = 0), typeof n.layerX == "undefined" && (n.layerX = n.offsetX = n.clientX), typeof n.layerY == "undefined" && (n.layerY = n.offsetY = n.clientY), n.isNormalized = true, n.type = t.type, e.push(n);
    }
    else if (!globalThis.MouseEvent || t instanceof MouseEvent && (!this.supportsPointerEvents || !(t instanceof globalThis.PointerEvent))) {
      const s = t;
      typeof s.isPrimary == "undefined" && (s.isPrimary = true), typeof s.width == "undefined" && (s.width = 1), typeof s.height == "undefined" && (s.height = 1), typeof s.tiltX == "undefined" && (s.tiltX = 0), typeof s.tiltY == "undefined" && (s.tiltY = 0), typeof s.pointerType == "undefined" && (s.pointerType = "mouse"), typeof s.pointerId == "undefined" && (s.pointerId = L0), typeof s.pressure == "undefined" && (s.pressure = 0.5), typeof s.twist == "undefined" && (s.twist = 0), typeof s.tangentialPressure == "undefined" && (s.tangentialPressure = 0), s.isNormalized = true, e.push(s);
    } else e.push(t);
    return e;
  }
  normalizeWheelEvent(t) {
    const e = this._rootWheelEvent;
    return this._transferMouseData(e, t), e.deltaX = t.deltaX, e.deltaY = t.deltaY, e.deltaZ = t.deltaZ, e.deltaMode = t.deltaMode, this.mapPositionToPoint(e.screen, t.clientX, t.clientY), e.global.copyFrom(e.screen), e.offset.copyFrom(e.screen), e.nativeEvent = t, e.type = t.type, e;
  }
  _bootstrapEvent(t, e) {
    return t.originalEvent = null, t.nativeEvent = e, t.pointerId = e.pointerId, t.width = e.width, t.height = e.height, t.isPrimary = e.isPrimary, t.pointerType = e.pointerType, t.pressure = e.pressure, t.tangentialPressure = e.tangentialPressure, t.tiltX = e.tiltX, t.tiltY = e.tiltY, t.twist = e.twist, this._transferMouseData(t, e), this.mapPositionToPoint(t.screen, e.clientX, e.clientY), t.global.copyFrom(t.screen), t.offset.copyFrom(t.screen), t.isTrusted = e.isTrusted, t.type === "pointerleave" && (t.type = "pointerout"), t.type.startsWith("mouse") && (t.type = t.type.replace("mouse", "pointer")), t.type.startsWith("touch") && (t.type = N0[t.type] || t.type), t;
  }
  _transferMouseData(t, e) {
    t.isTrusted = e.isTrusted, t.srcElement = e.srcElement, t.timeStamp = performance.now(), t.type = e.type, t.altKey = e.altKey, t.button = e.button, t.buttons = e.buttons, t.client.x = e.clientX, t.client.y = e.clientY, t.ctrlKey = e.ctrlKey, t.metaKey = e.metaKey, t.movement.x = e.movementX, t.movement.y = e.movementY, t.page.x = e.pageX, t.page.y = e.pageY, t.relatedTarget = null, t.shiftKey = e.shiftKey;
  }
};
Rn.extension = { name: "events", type: [x$1.WebGLSystem, x$1.CanvasSystem, x$1.WebGPUSystem], priority: -1 }, Rn.defaultEventFeatures = { move: true, globalMove: true, click: true, wheel: true };
let Mn = Rn;
const uh = { onclick: null, onmousedown: null, onmouseenter: null, onmouseleave: null, onmousemove: null, onglobalmousemove: null, onmouseout: null, onmouseover: null, onmouseup: null, onmouseupoutside: null, onpointercancel: null, onpointerdown: null, onpointerenter: null, onpointerleave: null, onpointermove: null, onglobalpointermove: null, onpointerout: null, onpointerover: null, onpointertap: null, onpointerup: null, onpointerupoutside: null, onrightclick: null, onrightdown: null, onrightup: null, onrightupoutside: null, ontap: null, ontouchcancel: null, ontouchend: null, ontouchendoutside: null, ontouchmove: null, onglobaltouchmove: null, ontouchstart: null, onwheel: null, get interactive() {
  return this.eventMode === "dynamic" || this.eventMode === "static";
}, set interactive(r) {
  this.eventMode = r ? "static" : "passive";
}, _internalEventMode: void 0, get eventMode() {
  var r;
  return (r = this._internalEventMode) != null ? r : Mn.defaultEventMode;
}, set eventMode(r) {
  this._internalEventMode = r;
}, isInteractive() {
  return this.eventMode === "static" || this.eventMode === "dynamic";
}, interactiveChildren: true, hitArea: null, addEventListener(r, t, e) {
  const s = typeof e == "boolean" && e || typeof e == "object" && e.capture, i = typeof e == "object" ? e.signal : void 0, n = typeof e == "object" ? e.once === true : false, o = typeof t == "function" ? void 0 : t;
  r = s ? `${r}capture` : r;
  const a = typeof t == "function" ? t : t.handleEvent, l3 = this;
  i && i.addEventListener("abort", () => {
    l3.off(r, a, o);
  }), n ? l3.once(r, a, o) : l3.on(r, a, o);
}, removeEventListener(r, t, e) {
  const s = typeof e == "boolean" && e || typeof e == "object" && e.capture, i = typeof t == "function" ? void 0 : t;
  r = s ? `${r}capture` : r, t = typeof t == "function" ? t : t.handleEvent, this.off(r, t, i);
}, dispatchEvent(r) {
  if (!(r instanceof or)) throw new Error("Container cannot propagate events outside of the Federated Events API");
  return r.defaultPrevented = false, r.path = null, r.target = this, r.manager.dispatchEvent(r), !r.defaultPrevented;
} };
G$1.add(Mn), G$1.mixin(lt, uh);
class Cn {
  constructor(t) {
    this._attachedDomElements = [], this._renderer = t, this._renderer.runners.postrender.add(this), this._domElement = document.createElement("div"), this._domElement.style.position = "absolute", this._domElement.style.top = "0", this._domElement.style.left = "0", this._domElement.style.pointerEvents = "none", this._domElement.style.zIndex = "1000";
  }
  addRenderable(t, e) {
    this._attachedDomElements.includes(t) || this._attachedDomElements.push(t);
  }
  updateRenderable(t) {
  }
  validateRenderable(t) {
    return true;
  }
  postrender() {
    var t;
    const e = this._attachedDomElements;
    if (e.length === 0) {
      this._domElement.remove();
      return;
    }
    const s = this._renderer.view.canvas;
    this._domElement.parentNode !== s.parentNode && ((t = s.parentNode) == null || t.appendChild(this._domElement));
    const i = parseFloat(s.style.width) / s.width * this._renderer.resolution, n = parseFloat(s.style.height) / s.height * this._renderer.resolution;
    this._domElement.style.transform = `translate(${s.offsetLeft}px, ${s.offsetTop}px) scale(${i}, ${n})`;
    for (let o = 0; o < e.length; o++) {
      const a = e[o], l3 = a.element;
      if (!a.parent || a.globalDisplayStatus < 7) l3 == null || l3.remove(), e.splice(o, 1), o--;
      else {
        this._domElement.contains(l3) || (l3.style.position = "absolute", l3.style.pointerEvents = "auto", this._domElement.appendChild(l3));
        const u3 = a.worldTransform, c = a._anchor, h = a.width * c.x, d = a.height * c.y;
        l3.style.transformOrigin = `${h}px ${d}px`, l3.style.transform = `matrix(${u3.a}, ${u3.b}, ${u3.c}, ${u3.d}, ${u3.tx - h}, ${u3.ty - d})`, l3.style.opacity = a.groupAlpha.toString();
      }
    }
  }
  destroy() {
    var t;
    this._renderer.runners.postrender.remove(this);
    for (let e = 0; e < this._attachedDomElements.length; e++) (t = this._attachedDomElements[e].element) == null || t.remove();
    this._attachedDomElements.length = 0, this._domElement.remove(), this._renderer = null;
  }
}
Cn.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "dom" };
let Lt$1 = class Lt extends lt {
  constructor(t) {
    super(t), this.canBundle = true, this.allowChildren = false, this._roundPixels = 0, this._lastUsed = -1, this._gpuData = /* @__PURE__ */ Object.create(null), this._bounds = new st$1(0, 1, 0, 0), this._boundsDirty = true;
  }
  get bounds() {
    return this._boundsDirty ? (this.updateBounds(), this._boundsDirty = false, this._bounds) : this._bounds;
  }
  get roundPixels() {
    return !!this._roundPixels;
  }
  set roundPixels(t) {
    this._roundPixels = t ? 1 : 0;
  }
  containsPoint(t) {
    const e = this.bounds, { x: s, y: i } = t;
    return s >= e.minX && s <= e.maxX && i >= e.minY && i <= e.maxY;
  }
  onViewUpdate() {
    if (this._didViewChangeTick++, this._boundsDirty = true, this.didViewUpdate) return;
    this.didViewUpdate = true;
    const t = this.renderGroup || this.parentRenderGroup;
    t && t.onChildViewUpdate(this);
  }
  destroy(t) {
    var e, s;
    super.destroy(t), this._bounds = null;
    for (const i in this._gpuData) (s = (e = this._gpuData[i]).destroy) == null || s.call(e);
    this._gpuData = null;
  }
  collectRenderablesSimple(t, e, s) {
    const { renderPipes: i } = e;
    i.blendMode.setBlendMode(this, this.groupBlendMode, t), i[this.renderPipeId].addRenderable(this, t), this.didViewUpdate = false;
    const n = this.children, o = n.length;
    for (let a = 0; a < o; a++) n[a].collectRenderables(t, e, s);
  }
};
G$1.add(Cn);
var vt$1 = ((r) => (r[r.Low = 0] = "Low", r[r.Normal = 1] = "Normal", r[r.High = 2] = "High", r))(vt$1 || {});
const ph = { createCanvas: (r, t) => {
  const e = document.createElement("canvas");
  return e.width = r, e.height = t, e;
}, getCanvasRenderingContext2D: () => CanvasRenderingContext2D, getWebGLRenderingContext: () => WebGLRenderingContext, getNavigator: () => navigator, getBaseUrl: () => {
  var r;
  return (r = document.baseURI) != null ? r : window.location.href;
}, getFontFaceSet: () => document.fonts, fetch: (r, t) => fetch(r, t), parseXML: (r) => new DOMParser().parseFromString(r, "text/xml") };
let fh = ph;
const L = { get() {
  return fh;
}, set(r) {
  fh = r;
} };
function Bt(r) {
  if (typeof r != "string") throw new TypeError(`Path must be a string. Received ${JSON.stringify(r)}`);
}
function Tr(r) {
  return r.split("?")[0].split("#")[0];
}
function V0(r) {
  return r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function W0(r, t, e) {
  return r.replace(new RegExp(V0(t), "g"), e);
}
function Y0(r, t) {
  let e = "", s = 0, i = -1, n = 0, o = -1;
  for (let a = 0; a <= r.length; ++a) {
    if (a < r.length) o = r.charCodeAt(a);
    else {
      if (o === 47) break;
      o = 47;
    }
    if (o === 47) {
      if (!(i === a - 1 || n === 1)) if (i !== a - 1 && n === 2) {
        if (e.length < 2 || s !== 2 || e.charCodeAt(e.length - 1) !== 46 || e.charCodeAt(e.length - 2) !== 46) {
          if (e.length > 2) {
            const l3 = e.lastIndexOf("/");
            if (l3 !== e.length - 1) {
              l3 === -1 ? (e = "", s = 0) : (e = e.slice(0, l3), s = e.length - 1 - e.lastIndexOf("/")), i = a, n = 0;
              continue;
            }
          } else if (e.length === 2 || e.length === 1) {
            e = "", s = 0, i = a, n = 0;
            continue;
          }
        }
      } else e.length > 0 ? e += `/${r.slice(i + 1, a)}` : e = r.slice(i + 1, a), s = a - i - 1;
      i = a, n = 0;
    } else o === 46 && n !== -1 ? ++n : n = -1;
  }
  return e;
}
const pt = { toPosix(r) {
  return W0(r, "\\", "/");
}, isUrl(r) {
  return /^https?:/.test(this.toPosix(r));
}, isDataUrl(r) {
  return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(r);
}, isBlobUrl(r) {
  return r.startsWith("blob:");
}, hasProtocol(r) {
  return /^[^/:]+:/.test(this.toPosix(r));
}, getProtocol(r) {
  Bt(r), r = this.toPosix(r);
  const t = /^file:\/\/\//.exec(r);
  if (t) return t[0];
  const e = /^[^/:]+:\/{0,2}/.exec(r);
  return e ? e[0] : "";
}, toAbsolute(r, t, e) {
  if (Bt(r), this.isDataUrl(r) || this.isBlobUrl(r)) return r;
  const s = Tr(this.toPosix(t != null ? t : L.get().getBaseUrl())), i = Tr(this.toPosix(e != null ? e : this.rootname(s)));
  return r = this.toPosix(r), r.startsWith("/") ? pt.join(i, r.slice(1)) : this.isAbsolute(r) ? r : this.join(s, r);
}, normalize(r) {
  if (Bt(r), r.length === 0) return ".";
  if (this.isDataUrl(r) || this.isBlobUrl(r)) return r;
  r = this.toPosix(r);
  let t = "";
  const e = r.startsWith("/");
  this.hasProtocol(r) && (t = this.rootname(r), r = r.slice(t.length));
  const s = r.endsWith("/");
  return r = Y0(r), r.length > 0 && s && (r += "/"), e ? `/${r}` : t + r;
}, isAbsolute(r) {
  return Bt(r), r = this.toPosix(r), this.hasProtocol(r) ? true : r.startsWith("/");
}, join(...r) {
  var t;
  if (r.length === 0) return ".";
  let e;
  for (let s = 0; s < r.length; ++s) {
    const i = r[s];
    if (Bt(i), i.length > 0) if (e === void 0) e = i;
    else {
      const n = (t = r[s - 1]) != null ? t : "";
      this.joinExtensions.includes(this.extname(n).toLowerCase()) ? e += `/../${i}` : e += `/${i}`;
    }
  }
  return e === void 0 ? "." : this.normalize(e);
}, dirname(r) {
  if (Bt(r), r.length === 0) return ".";
  r = this.toPosix(r);
  let t = r.charCodeAt(0);
  const e = t === 47;
  let s = -1, i = true;
  const n = this.getProtocol(r), o = r;
  r = r.slice(n.length);
  for (let a = r.length - 1; a >= 1; --a) if (t = r.charCodeAt(a), t === 47) {
    if (!i) {
      s = a;
      break;
    }
  } else i = false;
  return s === -1 ? e ? "/" : this.isUrl(o) ? n + r : n : e && s === 1 ? "//" : n + r.slice(0, s);
}, rootname(r) {
  Bt(r), r = this.toPosix(r);
  let t = "";
  if (r.startsWith("/") ? t = "/" : t = this.getProtocol(r), this.isUrl(r)) {
    const e = r.indexOf("/", t.length);
    e !== -1 ? t = r.slice(0, e) : t = r, t.endsWith("/") || (t += "/");
  }
  return t;
}, basename(r, t) {
  Bt(r), t && Bt(t), r = Tr(this.toPosix(r));
  let e = 0, s = -1, i = true, n;
  if (t !== void 0 && t.length > 0 && t.length <= r.length) {
    if (t.length === r.length && t === r) return "";
    let o = t.length - 1, a = -1;
    for (n = r.length - 1; n >= 0; --n) {
      const l3 = r.charCodeAt(n);
      if (l3 === 47) {
        if (!i) {
          e = n + 1;
          break;
        }
      } else a === -1 && (i = false, a = n + 1), o >= 0 && (l3 === t.charCodeAt(o) ? --o === -1 && (s = n) : (o = -1, s = a));
    }
    return e === s ? s = a : s === -1 && (s = r.length), r.slice(e, s);
  }
  for (n = r.length - 1; n >= 0; --n) if (r.charCodeAt(n) === 47) {
    if (!i) {
      e = n + 1;
      break;
    }
  } else s === -1 && (i = false, s = n + 1);
  return s === -1 ? "" : r.slice(e, s);
}, extname(r) {
  Bt(r), r = Tr(this.toPosix(r));
  let t = -1, e = 0, s = -1, i = true, n = 0;
  for (let o = r.length - 1; o >= 0; --o) {
    const a = r.charCodeAt(o);
    if (a === 47) {
      if (!i) {
        e = o + 1;
        break;
      }
      continue;
    }
    s === -1 && (i = false, s = o + 1), a === 46 ? t === -1 ? t = o : n !== 1 && (n = 1) : t !== -1 && (n = -1);
  }
  return t === -1 || s === -1 || n === 0 || n === 1 && t === s - 1 && t === e + 1 ? "" : r.slice(t, s);
}, parse(r) {
  Bt(r);
  const t = { root: "", dir: "", base: "", ext: "", name: "" };
  if (r.length === 0) return t;
  r = Tr(this.toPosix(r));
  let e = r.charCodeAt(0);
  const s = this.isAbsolute(r);
  let i;
  t.root = this.rootname(r), s || this.hasProtocol(r) ? i = 1 : i = 0;
  let o = -1, a = 0, l3 = -1, u3 = true, c = r.length - 1, h = 0;
  for (; c >= i; --c) {
    if (e = r.charCodeAt(c), e === 47) {
      if (!u3) {
        a = c + 1;
        break;
      }
      continue;
    }
    l3 === -1 && (u3 = false, l3 = c + 1), e === 46 ? o === -1 ? o = c : h !== 1 && (h = 1) : o !== -1 && (h = -1);
  }
  return o === -1 || l3 === -1 || h === 0 || h === 1 && o === l3 - 1 && o === a + 1 ? l3 !== -1 && (a === 0 && s ? t.base = t.name = r.slice(1, l3) : t.base = t.name = r.slice(a, l3)) : (a === 0 && s ? (t.name = r.slice(1, o), t.base = r.slice(1, l3)) : (t.name = r.slice(a, o), t.base = r.slice(a, l3)), t.ext = r.slice(o, l3)), t.dir = this.dirname(r), t;
}, sep: "/", delimiter: ":", joinExtensions: [".html"] }, Mt = (r, t, e = false) => (Array.isArray(r) || (r = [r]), t ? r.map((s) => typeof s == "string" || e ? t(s) : s) : r);
function mh(r, t, e, s, i) {
  const n = t[e];
  for (let o = 0; o < n.length; o++) {
    const a = n[o];
    e < t.length - 1 ? mh(r.replace(s[e], a), t, e + 1, s, i) : i.push(r.replace(s[e], a));
  }
}
function gh(r) {
  const t = /\{(.*?)\}/g, e = r.match(t), s = [];
  if (e) {
    const i = [];
    e.forEach((n) => {
      const o = n.substring(1, n.length - 1).split(",");
      i.push(o);
    }), mh(r, i, 0, e, s);
  } else s.push(r);
  return s;
}
const Sr = (r) => !Array.isArray(r);
var K0 = Object.defineProperty, q0 = Object.defineProperties, Z0 = Object.getOwnPropertyDescriptors, _h = Object.getOwnPropertySymbols, Q0 = Object.prototype.hasOwnProperty, J0 = Object.prototype.propertyIsEnumerable, xh = (r, t, e) => t in r ? K0(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Fe = (r, t) => {
  for (var e in t || (t = {})) Q0.call(t, e) && xh(r, e, t[e]);
  if (_h) for (var e of _h(t)) J0.call(t, e) && xh(r, e, t[e]);
  return r;
}, t1 = (r, t) => q0(r, Z0(t));
class se {
  constructor() {
    this._defaultBundleIdentifierOptions = { connector: "-", createBundleAssetId: (t, e) => `${t}${this._bundleIdConnector}${e}`, extractAssetIdFromBundle: (t, e) => e.replace(`${t}${this._bundleIdConnector}`, "") }, this._bundleIdConnector = this._defaultBundleIdentifierOptions.connector, this._createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId, this._extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle, this._assetMap = {}, this._preferredOrder = [], this._parsers = [], this._resolverHash = {}, this._bundles = {};
  }
  setBundleIdentifier(t) {
    var e, s, i;
    if (this._bundleIdConnector = (e = t.connector) != null ? e : this._bundleIdConnector, this._createBundleAssetId = (s = t.createBundleAssetId) != null ? s : this._createBundleAssetId, this._extractAssetIdFromBundle = (i = t.extractAssetIdFromBundle) != null ? i : this._extractAssetIdFromBundle, this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar") throw new Error("[Resolver] GenerateBundleAssetId are not working correctly");
  }
  prefer(...t) {
    t.forEach((e) => {
      this._preferredOrder.push(e), e.priority || (e.priority = Object.keys(e.params));
    }), this._resolverHash = {};
  }
  set basePath(t) {
    this._basePath = t;
  }
  get basePath() {
    return this._basePath;
  }
  set rootPath(t) {
    this._rootPath = t;
  }
  get rootPath() {
    return this._rootPath;
  }
  get parsers() {
    return this._parsers;
  }
  reset() {
    this.setBundleIdentifier(this._defaultBundleIdentifierOptions), this._assetMap = {}, this._preferredOrder = [], this._resolverHash = {}, this._rootPath = null, this._basePath = null, this._manifest = null, this._bundles = {}, this._defaultSearchParams = null;
  }
  setDefaultSearchParams(t) {
    if (typeof t == "string") this._defaultSearchParams = t;
    else {
      const e = t;
      this._defaultSearchParams = Object.keys(e).map((s) => `${encodeURIComponent(s)}=${encodeURIComponent(e[s])}`).join("&");
    }
  }
  getAlias(t) {
    const { alias: e, src: s } = t;
    return Mt(e || s, (i) => typeof i == "string" ? i : Array.isArray(i) ? i.map((n) => {
      var o;
      return (o = n == null ? void 0 : n.src) != null ? o : n;
    }) : i != null && i.src ? i.src : i, true);
  }
  addManifest(t) {
    this._manifest, this._manifest = t, t.bundles.forEach((e) => {
      this.addBundle(e.name, e.assets);
    });
  }
  addBundle(t, e) {
    const s = [];
    let i = e;
    Array.isArray(e) || (i = Object.entries(e).map(([n, o]) => typeof o == "string" || Array.isArray(o) ? { alias: n, src: o } : Fe({ alias: n }, o))), i.forEach((n) => {
      const o = n.src, a = n.alias;
      let l3;
      if (typeof a == "string") {
        const u3 = this._createBundleAssetId(t, a);
        s.push(u3), l3 = [a, u3];
      } else {
        const u3 = a.map((c) => this._createBundleAssetId(t, c));
        s.push(...u3), l3 = [...a, ...u3];
      }
      this.add(t1(Fe({}, n), { alias: l3, src: o }));
    }), this._bundles[t] = s;
  }
  add(t) {
    const e = [];
    Array.isArray(t) ? e.push(...t) : e.push(t);
    Mt(e).forEach((i) => {
      const { src: n } = i;
      let { data: o, format: a, loadParser: l3 } = i;
      const u3 = Mt(n).map((d) => typeof d == "string" ? gh(d) : Array.isArray(d) ? d : [d]), c = this.getAlias(i), h = [];
      u3.forEach((d) => {
        d.forEach((p) => {
          var f2, g, m3;
          let _ = {};
          if (typeof p != "object") {
            _.src = p;
            for (let b = 0; b < this._parsers.length; b++) {
              const v4 = this._parsers[b];
              if (v4.test(p)) {
                _ = v4.parse(p);
                break;
              }
            }
          } else o = (f2 = p.data) != null ? f2 : o, a = (g = p.format) != null ? g : a, l3 = (m3 = p.loadParser) != null ? m3 : l3, _ = Fe(Fe({}, _), p);
          if (!c) throw new Error(`[Resolver] alias is undefined for this asset: ${_.src}`);
          _ = this._buildResolvedAsset(_, { aliases: c, data: o, format: a, loadParser: l3 }), h.push(_);
        });
      }), c.forEach((d) => {
        this._assetMap[d] = h;
      });
    });
  }
  resolveBundle(t) {
    const e = Sr(t);
    t = Mt(t);
    const s = {};
    return t.forEach((i) => {
      const n = this._bundles[i];
      if (n) {
        const o = this.resolve(n), a = {};
        for (const l3 in o) {
          const u3 = o[l3];
          a[this._extractAssetIdFromBundle(i, l3)] = u3;
        }
        s[i] = a;
      }
    }), e ? s[t[0]] : s;
  }
  resolveUrl(t) {
    const e = this.resolve(t);
    if (typeof t != "string") {
      const s = {};
      for (const i in e) s[i] = e[i].src;
      return s;
    }
    return e.src;
  }
  resolve(t) {
    const e = Sr(t);
    t = Mt(t);
    const s = {};
    return t.forEach((i) => {
      if (!this._resolverHash[i]) if (this._assetMap[i]) {
        let n = this._assetMap[i];
        const o = this._getPreferredOrder(n);
        o == null || o.priority.forEach((a) => {
          o.params[a].forEach((l3) => {
            const u3 = n.filter((c) => c[a] ? c[a] === l3 : false);
            u3.length && (n = u3);
          });
        }), this._resolverHash[i] = n[0];
      } else this._resolverHash[i] = this._buildResolvedAsset({ alias: [i], src: i }, {});
      s[i] = this._resolverHash[i];
    }), e ? s[t[0]] : s;
  }
  hasKey(t) {
    return !!this._assetMap[t];
  }
  hasBundle(t) {
    return !!this._bundles[t];
  }
  _getPreferredOrder(t) {
    for (let e = 0; e < t.length; e++) {
      const s = t[e], i = this._preferredOrder.find((n) => n.params.format.includes(s.format));
      if (i) return i;
    }
    return this._preferredOrder[0];
  }
  _appendDefaultSearchParams(t) {
    if (!this._defaultSearchParams) return t;
    const e = /\?/.test(t) ? "&" : "?";
    return `${t}${e}${this._defaultSearchParams}`;
  }
  _buildResolvedAsset(t, e) {
    var s, i;
    const { aliases: n, data: o, loadParser: a, format: l3 } = e;
    return (this._basePath || this._rootPath) && (t.src = pt.toAbsolute(t.src, this._basePath, this._rootPath)), t.alias = (s = n != null ? n : t.alias) != null ? s : [t.src], t.src = this._appendDefaultSearchParams(t.src), t.data = Fe(Fe({}, o || {}), t.data), t.loadParser = a != null ? a : t.loadParser, t.format = (i = l3 != null ? l3 : t.format) != null ? i : bh(t.src), t;
  }
}
se.RETINA_PREFIX = /@([0-9\.]+)x/;
function bh(r) {
  return r.split(".").pop().split("?").shift().split("#").shift();
}
const Ps = (r, t) => {
  const e = t.split("?")[1];
  return e && (r += `?${e}`), r;
}, vh = class ns {
  constructor(t, e) {
    this.linkedSheets = [];
    let s = t;
    (t == null ? void 0 : t.source) instanceof K$1 && (s = { texture: t, data: e });
    const { texture: i, data: n, cachePrefix: o = "" } = s;
    this.cachePrefix = o, this._texture = i instanceof A$1 ? i : null, this.textureSource = i.source, this.textures = {}, this.animations = {}, this.data = n;
    const a = parseFloat(n.meta.scale);
    a ? (this.resolution = a, i.source.resolution = this.resolution) : this.resolution = i.source._resolution, this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
  }
  parse() {
    return new Promise((t) => {
      this._callback = t, this._batchIndex = 0, this._frameKeys.length <= ns.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
    });
  }
  _processFrames(t) {
    let e = t;
    const s = ns.BATCH_SIZE;
    for (; e - t < s && e < this._frameKeys.length; ) {
      const i = this._frameKeys[e], n = this._frames[i], o = n.frame;
      if (o) {
        let a = null, l3 = null;
        const u3 = n.trimmed !== false && n.sourceSize ? n.sourceSize : n.frame, c = new j$1(0, 0, Math.floor(u3.w) / this.resolution, Math.floor(u3.h) / this.resolution);
        n.rotated ? a = new j$1(Math.floor(o.x) / this.resolution, Math.floor(o.y) / this.resolution, Math.floor(o.h) / this.resolution, Math.floor(o.w) / this.resolution) : a = new j$1(Math.floor(o.x) / this.resolution, Math.floor(o.y) / this.resolution, Math.floor(o.w) / this.resolution, Math.floor(o.h) / this.resolution), n.trimmed !== false && n.spriteSourceSize && (l3 = new j$1(Math.floor(n.spriteSourceSize.x) / this.resolution, Math.floor(n.spriteSourceSize.y) / this.resolution, Math.floor(o.w) / this.resolution, Math.floor(o.h) / this.resolution)), this.textures[i] = new A$1({ source: this.textureSource, frame: a, orig: c, trim: l3, rotate: n.rotated ? 2 : 0, defaultAnchor: n.anchor, defaultBorders: n.borders, label: i.toString() });
      }
      e++;
    }
  }
  _processAnimations() {
    const t = this.data.animations || {};
    for (const e in t) {
      this.animations[e] = [];
      for (let s = 0; s < t[e].length; s++) {
        const i = t[e][s];
        this.animations[e].push(this.textures[i]);
      }
    }
  }
  _parseComplete() {
    const t = this._callback;
    this._callback = null, this._batchIndex = 0, t.call(this, this.textures);
  }
  _nextBatch() {
    this._processFrames(this._batchIndex * ns.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
      this._batchIndex * ns.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
    }, 0);
  }
  destroy(t = false) {
    var e;
    for (const s in this.textures) this.textures[s].destroy();
    this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, t && ((e = this._texture) == null || e.destroy(), this.textureSource.destroy()), this._texture = null, this.textureSource = null, this.linkedSheets = [];
  }
};
vh.BATCH_SIZE = 1e3;
let On = vh;
const e1 = ["jpg", "png", "jpeg", "avif", "webp", "basis", "etc2", "bc7", "bc6h", "bc5", "bc4", "bc3", "bc2", "bc1", "eac", "astc"];
function yh(r, t, e) {
  const s = {};
  if (r.forEach((i) => {
    s[i] = t;
  }), Object.keys(t.textures).forEach((i) => {
    s[`${t.cachePrefix}${i}`] = t.textures[i];
  }), !e) {
    const i = pt.dirname(r[0]);
    t.linkedSheets.forEach((n, o) => {
      const a = yh([`${i}/${t.data.meta.related_multi_packs[o]}`], n, true);
      Object.assign(s, a);
    });
  }
  return s;
}
const Th = { extension: x$1.Asset, cache: { test: (r) => r instanceof On, getCacheableAssets: (r, t) => yh(r, t, false) }, resolver: { extension: { type: x$1.ResolveParser, name: "resolveSpritesheet" }, test: (r) => {
  const t = r.split("?")[0].split("."), e = t.pop(), s = t.pop();
  return e === "json" && e1.includes(s);
}, parse: (r) => {
  var t, e;
  const s = r.split(".");
  return { resolution: parseFloat((e = (t = se.RETINA_PREFIX.exec(r)) == null ? void 0 : t[1]) != null ? e : "1"), format: s[s.length - 2], src: r };
} }, loader: { name: "spritesheetLoader", extension: { type: x$1.LoadParser, priority: vt$1.Normal, name: "spritesheetLoader" }, async testParse(r, t) {
  return pt.extname(t.src).toLowerCase() === ".json" && !!r.frames;
}, async parse(r, t, e) {
  var s, i, n;
  const { texture: o, imageFilename: a, textureOptions: l3, cachePrefix: u3 } = (s = t == null ? void 0 : t.data) != null ? s : {};
  let c = pt.dirname(t.src);
  c && c.lastIndexOf("/") !== c.length - 1 && (c += "/");
  let h;
  if (o instanceof A$1) h = o;
  else {
    const f2 = Ps(c + (a != null ? a : r.meta.image), t.src);
    h = (await e.load([{ src: f2, data: l3 }]))[f2];
  }
  const d = new On({ texture: h.source, data: r, cachePrefix: u3 });
  await d.parse();
  const p = (i = r == null ? void 0 : r.meta) == null ? void 0 : i.related_multi_packs;
  if (Array.isArray(p)) {
    const f2 = [];
    for (const m3 of p) {
      if (typeof m3 != "string") continue;
      let _ = c + m3;
      (n = t.data) != null && n.ignoreMultiPack || (_ = Ps(_, t.src), f2.push(e.load({ src: _, data: { textureOptions: l3, ignoreMultiPack: true } })));
    }
    const g = await Promise.all(f2);
    d.linkedSheets = g, g.forEach((m3) => {
      m3.linkedSheets = [d].concat(d.linkedSheets.filter((_) => _ !== m3));
    });
  }
  return d;
}, async unload(r, t, e) {
  await e.unload(r.textureSource._sourceOrigin), r.destroy(false);
} } };
G$1.add(Th);
function Gn(r, t, e) {
  const { width: s, height: i } = e.orig, n = e.trim;
  if (n) {
    const o = n.width, a = n.height;
    r.minX = n.x - t._x * s, r.maxX = r.minX + o, r.minY = n.y - t._y * i, r.maxY = r.minY + a;
  } else r.minX = -t._x * s, r.maxX = r.minX + s, r.minY = -t._y * i, r.maxY = r.minY + i;
}
var r1 = Object.defineProperty, Rs = Object.getOwnPropertySymbols, Sh = Object.prototype.hasOwnProperty, Eh = Object.prototype.propertyIsEnumerable, Ah = (r, t, e) => t in r ? r1(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, s1 = (r, t) => {
  for (var e in t || (t = {})) Sh.call(t, e) && Ah(r, e, t[e]);
  if (Rs) for (var e of Rs(t)) Eh.call(t, e) && Ah(r, e, t[e]);
  return r;
}, i1 = (r, t) => {
  var e = {};
  for (var s in r) Sh.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && Rs) for (var s of Rs(r)) t.indexOf(s) < 0 && Eh.call(r, s) && (e[s] = r[s]);
  return e;
};
let Ut$1 = class Ut extends Lt$1 {
  constructor(t = A$1.EMPTY) {
    t instanceof A$1 && (t = { texture: t });
    const e = t, { texture: s = A$1.EMPTY, anchor: i, roundPixels: n, width: o, height: a } = e, l3 = i1(e, ["texture", "anchor", "roundPixels", "width", "height"]);
    super(s1({ label: "Sprite" }, l3)), this.renderPipeId = "sprite", this.batched = true, this._visualBounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, this._anchor = new rt({ _onUpdate: () => {
      this.onViewUpdate();
    } }), i ? this.anchor = i : s.defaultAnchor && (this.anchor = s.defaultAnchor), this.texture = s, this.allowChildren = false, this.roundPixels = n != null ? n : false, o !== void 0 && (this.width = o), a !== void 0 && (this.height = a);
  }
  static from(t, e = false) {
    return t instanceof A$1 ? new Ut(t) : new Ut(A$1.from(t, e));
  }
  set texture(t) {
    t || (t = A$1.EMPTY);
    const e = this._texture;
    e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this._texture = t, this._width && this._setWidth(this._width, this._texture.orig.width), this._height && this._setHeight(this._height, this._texture.orig.height), this.onViewUpdate());
  }
  get texture() {
    return this._texture;
  }
  get visualBounds() {
    return Gn(this._visualBounds, this._anchor, this._texture), this._visualBounds;
  }
  get sourceBounds() {
    return this.visualBounds;
  }
  updateBounds() {
    const t = this._anchor, e = this._texture, s = this._bounds, { width: i, height: n } = e.orig;
    s.minX = -t._x * i, s.maxX = s.minX + i, s.minY = -t._y * n, s.maxY = s.minY + n;
  }
  destroy(t = false) {
    if (super.destroy(t), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const e = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._texture.destroy(e);
    }
    this._texture = null, this._visualBounds = null, this._bounds = null, this._anchor = null, this._gpuData = null;
  }
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  get width() {
    return Math.abs(this.scale.x) * this._texture.orig.width;
  }
  set width(t) {
    this._setWidth(t, this._texture.orig.width), this._width = t;
  }
  get height() {
    return Math.abs(this.scale.y) * this._texture.orig.height;
  }
  set height(t) {
    this._setHeight(t, this._texture.orig.height), this._height = t;
  }
  getSize(t) {
    return t || (t = {}), t.width = Math.abs(this.scale.x) * this._texture.orig.width, t.height = Math.abs(this.scale.y) * this._texture.orig.height, t;
  }
  setSize(t, e) {
    var s;
    typeof t == "object" ? (e = (s = t.height) != null ? s : t.width, t = t.width) : e != null || (e = t), t !== void 0 && this._setWidth(t, this._texture.orig.width), e !== void 0 && this._setHeight(e, this._texture.orig.height);
  }
};
const n1 = new st$1();
function Ms(r, t, e) {
  const s = n1;
  r.measurable = true, _r(r, e, s), t.addBoundsMask(s), r.measurable = false;
}
function Cs(r, t, e) {
  const s = $t.get();
  r.measurable = true;
  const i = ut$1.get().identity(), n = wh(r, e, i);
  xs(r, s, n), r.measurable = false, t.addBoundsMask(s), ut$1.return(i), $t.return(s);
}
function wh(r, t, e) {
  return r && r !== t && (wh(r.parent, t, e), r.updateLocalTransform(), e.append(r.localTransform)), e;
}
class In {
  constructor(t) {
    this.priority = 0, this.inverse = false, this.pipe = "alphaMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.renderMaskToTexture = !(t instanceof Ut$1), this.mask.renderable = this.renderMaskToTexture, this.mask.includeInBuild = !this.renderMaskToTexture, this.mask.measurable = false;
  }
  reset() {
    this.mask.measurable = true, this.mask = null;
  }
  addBounds(t, e) {
    this.inverse || Ms(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    Cs(this.mask, t, e);
  }
  containsPoint(t, e) {
    const s = this.mask;
    return e(s, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof Ut$1;
  }
}
In.extension = x$1.MaskEffect;
class Bn {
  constructor(t) {
    this.priority = 0, this.pipe = "colorMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t;
  }
  destroy() {
  }
  static test(t) {
    return typeof t == "number";
  }
}
Bn.extension = x$1.MaskEffect;
class Fn {
  constructor(t) {
    this.priority = 0, this.pipe = "stencilMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.mask.includeInBuild = false, this.mask.measurable = false;
  }
  reset() {
    this.mask.measurable = true, this.mask.includeInBuild = true, this.mask = null;
  }
  addBounds(t, e) {
    Ms(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    Cs(this.mask, t, e);
  }
  containsPoint(t, e) {
    const s = this.mask;
    return e(s, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof lt;
  }
}
Fn.extension = x$1.MaskEffect;
class Nt extends K$1 {
  constructor(t) {
    t.resource || (t.resource = L.get().createCanvas()), t.width || (t.width = t.resource.width, t.autoDensity || (t.width /= t.resolution)), t.height || (t.height = t.resource.height, t.autoDensity || (t.height /= t.resolution)), super(t), this.uploadMethodId = "image", this.autoDensity = t.autoDensity, this.resizeCanvas(), this.transparent = !!t.transparent;
  }
  resizeCanvas() {
    this.autoDensity && "style" in this.resource && (this.resource.style.width = `${this.width}px`, this.resource.style.height = `${this.height}px`), (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight) && (this.resource.width = this.pixelWidth, this.resource.height = this.pixelHeight);
  }
  resize(t = this.width, e = this.height, s = this._resolution) {
    const i = super.resize(t, e, s);
    return i && this.resizeCanvas(), i;
  }
  static test(t) {
    return globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement || globalThis.OffscreenCanvas && t instanceof OffscreenCanvas;
  }
  get context2D() {
    return this._context2D || (this._context2D = this.resource.getContext("2d"));
  }
}
Nt.extension = x$1.TextureSource;
class ie extends K$1 {
  constructor(t) {
    super(t), this.uploadMethodId = "image", this.autoGarbageCollect = true;
  }
  static test(t) {
    return globalThis.HTMLImageElement && t instanceof HTMLImageElement || typeof ImageBitmap != "undefined" && t instanceof ImageBitmap || globalThis.VideoFrame && t instanceof VideoFrame;
  }
}
ie.extension = x$1.TextureSource;
let Dn;
async function Un() {
  return Dn != null || (Dn = (async () => {
    var r;
    const t = document.createElement("canvas").getContext("webgl");
    if (!t) return "premultiply-alpha-on-upload";
    const e = await new Promise((o) => {
      const a = document.createElement("video");
      a.onloadeddata = () => o(a), a.onerror = () => o(null), a.autoplay = false, a.crossOrigin = "anonymous", a.preload = "auto", a.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=", a.load();
    });
    if (!e) return "premultiply-alpha-on-upload";
    const s = t.createTexture();
    t.bindTexture(t.TEXTURE_2D, s);
    const i = t.createFramebuffer();
    t.bindFramebuffer(t.FRAMEBUFFER, i), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, s, 0), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e);
    const n = new Uint8Array(4);
    return t.readPixels(0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, n), t.deleteFramebuffer(i), t.deleteTexture(s), (r = t.getExtension("WEBGL_lose_context")) == null || r.loseContext(), n[0] <= n[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload";
  })()), Dn;
}
var o1 = Object.defineProperty, a1 = Object.defineProperties, l1 = Object.getOwnPropertyDescriptors, Ph = Object.getOwnPropertySymbols, u1 = Object.prototype.hasOwnProperty, c1 = Object.prototype.propertyIsEnumerable, Rh = (r, t, e) => t in r ? o1(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, kn = (r, t) => {
  for (var e in t || (t = {})) u1.call(t, e) && Rh(r, e, t[e]);
  if (Ph) for (var e of Ph(t)) c1.call(t, e) && Rh(r, e, t[e]);
  return r;
}, h1 = (r, t) => a1(r, l1(t));
const Os = class Wv extends K$1 {
  constructor(t) {
    var e;
    super(t), this.isReady = false, this.uploadMethodId = "video", t = kn(kn({}, Wv.defaultOptions), t), this._autoUpdate = true, this._isConnectedToTicker = false, this._updateFPS = t.updateFPS || 0, this._msToNextUpdate = 0, this.autoPlay = t.autoPlay !== false, this.alphaMode = (e = t.alphaMode) != null ? e : "premultiply-alpha-on-upload", this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this), this._videoFrameRequestCallbackHandle = null, this._load = null, this._resolve = null, this._reject = null, this._onCanPlay = this._onCanPlay.bind(this), this._onCanPlayThrough = this._onCanPlayThrough.bind(this), this._onError = this._onError.bind(this), this._onPlayStart = this._onPlayStart.bind(this), this._onPlayStop = this._onPlayStop.bind(this), this._onSeeked = this._onSeeked.bind(this), t.autoLoad !== false && this.load();
  }
  updateFrame() {
    if (!this.destroyed) {
      if (this._updateFPS) {
        const t = at.shared.elapsedMS * this.resource.playbackRate;
        this._msToNextUpdate = Math.floor(this._msToNextUpdate - t);
      }
      (!this._updateFPS || this._msToNextUpdate <= 0) && (this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0), this.isValid && this.update();
    }
  }
  _videoFrameRequestCallback() {
    this.updateFrame(), this.destroyed ? this._videoFrameRequestCallbackHandle = null : this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(this._videoFrameRequestCallback);
  }
  get isValid() {
    return !!this.resource.videoWidth && !!this.resource.videoHeight;
  }
  async load() {
    if (this._load) return this._load;
    const t = this.resource, e = this.options;
    return (t.readyState === t.HAVE_ENOUGH_DATA || t.readyState === t.HAVE_FUTURE_DATA) && t.width && t.height && (t.complete = true), t.addEventListener("play", this._onPlayStart), t.addEventListener("pause", this._onPlayStop), t.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._mediaReady() : (e.preload || t.addEventListener("canplay", this._onCanPlay), t.addEventListener("canplaythrough", this._onCanPlayThrough), t.addEventListener("error", this._onError, true)), this.alphaMode = await Un(), this._load = new Promise((s, i) => {
      this.isValid ? s(this) : (this._resolve = s, this._reject = i, e.preloadTimeoutMs !== void 0 && (this._preloadTimeout = setTimeout(() => {
        this._onError(new ErrorEvent(`Preload exceeded timeout of ${e.preloadTimeoutMs}ms`));
      })), t.load());
    }), this._load;
  }
  _onError(t) {
    this.resource.removeEventListener("error", this._onError, true), this.emit("error", t), this._reject && (this._reject(t), this._reject = null, this._resolve = null);
  }
  _isSourcePlaying() {
    const t = this.resource;
    return !t.paused && !t.ended;
  }
  _isSourceReady() {
    return this.resource.readyState > 2;
  }
  _onPlayStart() {
    this.isValid || this._mediaReady(), this._configureAutoUpdate();
  }
  _onPlayStop() {
    this._configureAutoUpdate();
  }
  _onSeeked() {
    this._autoUpdate && !this._isSourcePlaying() && (this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0);
  }
  _onCanPlay() {
    this.resource.removeEventListener("canplay", this._onCanPlay), this._mediaReady();
  }
  _onCanPlayThrough() {
    this.resource.removeEventListener("canplaythrough", this._onCanPlay), this._preloadTimeout && (clearTimeout(this._preloadTimeout), this._preloadTimeout = void 0), this._mediaReady();
  }
  _mediaReady() {
    const t = this.resource;
    this.isValid && (this.isReady = true, this.resize(t.videoWidth, t.videoHeight)), this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0, this._resolve && (this._resolve(this), this._resolve = null, this._reject = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && this.resource.play();
  }
  destroy() {
    this._configureAutoUpdate();
    const t = this.resource;
    t && (t.removeEventListener("play", this._onPlayStart), t.removeEventListener("pause", this._onPlayStop), t.removeEventListener("seeked", this._onSeeked), t.removeEventListener("canplay", this._onCanPlay), t.removeEventListener("canplaythrough", this._onCanPlayThrough), t.removeEventListener("error", this._onError, true), t.pause(), t.src = "", t.load()), super.destroy();
  }
  get autoUpdate() {
    return this._autoUpdate;
  }
  set autoUpdate(t) {
    t !== this._autoUpdate && (this._autoUpdate = t, this._configureAutoUpdate());
  }
  get updateFPS() {
    return this._updateFPS;
  }
  set updateFPS(t) {
    t !== this._updateFPS && (this._updateFPS = t, this._configureAutoUpdate());
  }
  _configureAutoUpdate() {
    this._autoUpdate && this._isSourcePlaying() ? !this._updateFPS && this.resource.requestVideoFrameCallback ? (this._isConnectedToTicker && (at.shared.remove(this.updateFrame, this), this._isConnectedToTicker = false, this._msToNextUpdate = 0), this._videoFrameRequestCallbackHandle === null && (this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(this._videoFrameRequestCallback))) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker || (at.shared.add(this.updateFrame, this), this._isConnectedToTicker = true, this._msToNextUpdate = 0)) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker && (at.shared.remove(this.updateFrame, this), this._isConnectedToTicker = false, this._msToNextUpdate = 0));
  }
  static test(t) {
    return globalThis.HTMLVideoElement && t instanceof HTMLVideoElement;
  }
};
Os.extension = x$1.TextureSource, Os.defaultOptions = h1(kn({}, K$1.defaultOptions), { autoLoad: true, autoPlay: true, updateFPS: 0, crossorigin: true, loop: false, muted: true, playsinline: true, preload: false }), Os.MIME_TYPES = { ogv: "video/ogg", mov: "video/quicktime", m4v: "video/mp4" };
let Er = Os, d1 = class {
  constructor() {
    this._parsers = [], this._cache = /* @__PURE__ */ new Map(), this._cacheMap = /* @__PURE__ */ new Map();
  }
  reset() {
    this._cacheMap.clear(), this._cache.clear();
  }
  has(t) {
    return this._cache.has(t);
  }
  get(t) {
    return this._cache.get(t);
  }
  set(t, e) {
    const s = Mt(t);
    let i;
    for (let l3 = 0; l3 < this.parsers.length; l3++) {
      const u3 = this.parsers[l3];
      if (u3.test(e)) {
        i = u3.getCacheableAssets(s, e);
        break;
      }
    }
    const n = new Map(Object.entries(i || {}));
    i || s.forEach((l3) => {
      n.set(l3, e);
    });
    const o = [...n.keys()], a = { cacheKeys: o, keys: s };
    s.forEach((l3) => {
      this._cacheMap.set(l3, a);
    }), o.forEach((l3) => {
      i ? i[l3] : e;
      this._cache.has(l3) && this._cache.get(l3), this._cache.set(l3, n.get(l3));
    });
  }
  remove(t) {
    if (!this._cacheMap.has(t)) return;
    const e = this._cacheMap.get(t);
    e.cacheKeys.forEach((s) => {
      this._cache.delete(s);
    }), e.keys.forEach((s) => {
      this._cacheMap.delete(s);
    });
  }
  get parsers() {
    return this._parsers;
  }
};
const V$1 = new d1(), $n = [];
G$1.handleByList(x$1.TextureSource, $n);
function Ln(r = {}) {
  const t = r && r.resource, e = t ? r.resource : r, s = t ? r : { resource: r };
  for (let i = 0; i < $n.length; i++) {
    const n = $n[i];
    if (n.test(e)) return new n(s);
  }
  throw new Error(`Could not find a source type for resource: ${s.resource}`);
}
function Mh(r = {}, t = false) {
  const e = r && r.resource, s = e ? r.resource : r, i = e ? r : { resource: r };
  if (!t && V$1.has(s)) return V$1.get(s);
  const n = new A$1({ source: Ln(i) });
  return n.on("destroy", () => {
    V$1.has(s) && V$1.remove(s);
  }), t || V$1.set(s, n), n;
}
function Ch(r, t = false) {
  return typeof r == "string" ? V$1.get(r) : r instanceof K$1 ? new A$1({ source: r }) : Mh(r, t);
}
A$1.from = Ch, K$1.from = Ln, G$1.add(In, Bn, Fn, Er, ie, Nt, vs);
class Xt {
  constructor(t) {
    this.resources = /* @__PURE__ */ Object.create(null), this._dirty = true;
    let e = 0;
    for (const s in t) {
      const i = t[s];
      this.setResource(i, e++);
    }
    this._updateKey();
  }
  _updateKey() {
    if (!this._dirty) return;
    this._dirty = false;
    const t = [];
    let e = 0;
    for (const s in this.resources) t[e++] = this.resources[s]._resourceId;
    this._key = t.join("|");
  }
  setResource(t, e) {
    var s, i;
    const n = this.resources[e];
    t !== n && (n && ((s = t.off) == null || s.call(t, "change", this.onResourceChange, this)), (i = t.on) == null || i.call(t, "change", this.onResourceChange, this), this.resources[e] = t, this._dirty = true);
  }
  getResource(t) {
    return this.resources[t];
  }
  _touch(t) {
    const e = this.resources;
    for (const s in e) e[s]._touched = t;
  }
  destroy() {
    var t;
    const e = this.resources;
    for (const s in e) {
      const i = e[s];
      (t = i.off) == null || t.call(i, "change", this.onResourceChange, this);
    }
    this.resources = null;
  }
  onResourceChange(t) {
    if (this._dirty = true, t.destroyed) {
      const e = this.resources;
      for (const s in e) e[s] === t && (e[s] = null);
    } else this._updateKey();
  }
}
const Oh = {};
function Gs(r, t, e) {
  let s = 2166136261;
  for (let i = 0; i < t; i++) s ^= r[i].uid, s = Math.imul(s, 16777619), s >>>= 0;
  return Oh[s] || f1(r, t, s, e);
}
function f1(r, t, e, s) {
  const i = {};
  let n = 0;
  for (let a = 0; a < s; a++) {
    const l3 = a < t ? r[a] : A$1.EMPTY.source;
    i[n++] = l3.source, i[n++] = l3.style;
  }
  const o = new Xt(i);
  return Oh[e] = o, o;
}
class ve {
  constructor(t) {
    typeof t == "number" ? this.rawBinaryData = new ArrayBuffer(t) : t instanceof Uint8Array ? this.rawBinaryData = t.buffer : this.rawBinaryData = t, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData), this.size = this.rawBinaryData.byteLength;
  }
  get int8View() {
    return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)), this._int8View;
  }
  get uint8View() {
    return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)), this._uint8View;
  }
  get int16View() {
    return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)), this._int16View;
  }
  get int32View() {
    return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)), this._int32View;
  }
  get float64View() {
    return this._float64Array || (this._float64Array = new Float64Array(this.rawBinaryData)), this._float64Array;
  }
  get bigUint64View() {
    return this._bigUint64Array || (this._bigUint64Array = new BigUint64Array(this.rawBinaryData)), this._bigUint64Array;
  }
  view(t) {
    return this[`${t}View`];
  }
  destroy() {
    this.rawBinaryData = null, this._int8View = null, this._uint8View = null, this._int16View = null, this.uint16View = null, this._int32View = null, this.uint32View = null, this.float32View = null;
  }
  static sizeOf(t) {
    switch (t) {
      case "int8":
      case "uint8":
        return 1;
      case "int16":
      case "uint16":
        return 2;
      case "int32":
      case "uint32":
      case "float32":
        return 4;
      default:
        throw new Error(`${t} isn't a valid view type`);
    }
  }
}
const Gh = {};
function Ih(r, t, e = 3) {
  if (Gh[t]) return;
  let s = new Error().stack;
  typeof s == "undefined" ? console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${r}`) : (s = s.split(`
`).splice(e).join(`
`), console.groupCollapsed ? (console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", `${t}
Deprecated since v${r}`), console.warn(s), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${r}`), console.warn(s))), Gh[t] = true;
}
function Is(r, t) {
  const e = r.byteLength / 8 | 0, s = new Float64Array(r, 0, e);
  new Float64Array(t, 0, e).set(s);
  const i = r.byteLength - e * 8;
  if (i > 0) {
    const n = new Uint8Array(r, e * 8, i);
    new Uint8Array(t, e * 8, i).set(n);
  }
}
const Bh = { normal: "normal-npm", add: "add-npm", screen: "screen-npm" };
var Q$1 = ((r) => (r[r.DISABLED = 0] = "DISABLED", r[r.RENDERING_MASK_ADD = 1] = "RENDERING_MASK_ADD", r[r.MASK_ACTIVE = 2] = "MASK_ACTIVE", r[r.INVERSE_MASK_ACTIVE = 3] = "INVERSE_MASK_ACTIVE", r[r.RENDERING_MASK_REMOVE = 4] = "RENDERING_MASK_REMOVE", r[r.NONE = 5] = "NONE", r))(Q$1 || {});
function De(r, t) {
  return t.alphaMode === "no-premultiply-alpha" && Bh[r] || r;
}
let Ar;
function Nn() {
  return (!Ar || Ar != null && Ar.isContextLost()) && (Ar = L.get().createCanvas().getContext("webgl", {})), Ar;
}
const _1 = ["precision mediump float;", "void main(void){", "float test = 0.1;", "%forloop%", "gl_FragColor = vec4(0.0);", "}"].join(`
`);
function x1(r) {
  let t = "";
  for (let e = 0; e < r; ++e) e > 0 && (t += `
else `), e < r - 1 && (t += `if(test == ${e}.0){}`);
  return t;
}
function Xn(r, t) {
  if (r === 0) throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  const e = t.createShader(t.FRAGMENT_SHADER);
  try {
    for (; ; ) {
      const s = _1.replace(/%forloop%/gi, x1(r));
      if (t.shaderSource(e, s), t.compileShader(e), !t.getShaderParameter(e, t.COMPILE_STATUS)) r = r / 2 | 0;
      else break;
    }
  } finally {
    t.deleteShader(e);
  }
  return r;
}
let Ue = null;
function Fh() {
  var r;
  if (Ue) return Ue;
  const t = Nn();
  return Ue = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS), Ue = Xn(Ue, t), (r = t.getExtension("WEBGL_lose_context")) == null || r.loseContext(), Ue;
}
class Dh {
  constructor() {
    this.ids = /* @__PURE__ */ Object.create(null), this.textures = [], this.count = 0;
  }
  clear() {
    for (let t = 0; t < this.count; t++) {
      const e = this.textures[t];
      this.textures[t] = null, this.ids[e.uid] = null;
    }
    this.count = 0;
  }
}
var b1 = Object.defineProperty, Uh = Object.getOwnPropertySymbols, v1 = Object.prototype.hasOwnProperty, y1 = Object.prototype.propertyIsEnumerable, kh = (r, t, e) => t in r ? b1(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, $h = (r, t) => {
  for (var e in t || (t = {})) v1.call(t, e) && kh(r, e, t[e]);
  if (Uh) for (var e of Uh(t)) y1.call(t, e) && kh(r, e, t[e]);
  return r;
};
class Lh {
  constructor() {
    this.renderPipeId = "batch", this.action = "startBatch", this.start = 0, this.size = 0, this.textures = new Dh(), this.blendMode = "normal", this.topology = "triangle-strip", this.canBundle = true;
  }
  destroy() {
    this.textures = null, this.gpuBindGroup = null, this.bindGroup = null, this.batcher = null;
  }
}
const Nh = [];
let Hn = 0;
function Xh() {
  return Hn > 0 ? Nh[--Hn] : new Lh();
}
function Hh(r) {
  Nh[Hn++] = r;
}
let wr = 0;
const jh = class Yv {
  constructor(t) {
    this.uid = Y("batcher"), this.dirty = true, this.batchIndex = 0, this.batches = [], this._elements = [], t = $h($h({}, Yv.defaultOptions), t), t.maxTextures || (Ih("v8.8.0", "maxTextures is a required option for Batcher now, please pass it in the options"), t.maxTextures = Fh());
    const { maxTextures: e, attributesInitialSize: s, indicesInitialSize: i } = t;
    this.attributeBuffer = new ve(s * 4), this.indexBuffer = new Uint16Array(i), this.maxTextures = e;
  }
  begin() {
    this.elementSize = 0, this.elementStart = 0, this.indexSize = 0, this.attributeSize = 0;
    for (let t = 0; t < this.batchIndex; t++) Hh(this.batches[t]);
    this.batchIndex = 0, this._batchIndexStart = 0, this._batchIndexSize = 0, this.dirty = true;
  }
  add(t) {
    this._elements[this.elementSize++] = t, t._indexStart = this.indexSize, t._attributeStart = this.attributeSize, t._batcher = this, this.indexSize += t.indexSize, this.attributeSize += t.attributeSize * this.vertexSize;
  }
  checkAndUpdateTexture(t, e) {
    const s = t._batch.textures.ids[e._source.uid];
    return !s && s !== 0 ? false : (t._textureId = s, t.texture = e, true);
  }
  updateElement(t) {
    this.dirty = true;
    const e = this.attributeBuffer;
    t.packAsQuad ? this.packQuadAttributes(t, e.float32View, e.uint32View, t._attributeStart, t._textureId) : this.packAttributes(t, e.float32View, e.uint32View, t._attributeStart, t._textureId);
  }
  break(t) {
    const e = this._elements;
    if (!e[this.elementStart]) return;
    let s = Xh(), i = s.textures;
    i.clear();
    const n = e[this.elementStart];
    let o = De(n.blendMode, n.texture._source), a = n.topology;
    this.attributeSize * 4 > this.attributeBuffer.size && this._resizeAttributeBuffer(this.attributeSize * 4), this.indexSize > this.indexBuffer.length && this._resizeIndexBuffer(this.indexSize);
    const l3 = this.attributeBuffer.float32View, u3 = this.attributeBuffer.uint32View, c = this.indexBuffer;
    let h = this._batchIndexSize, d = this._batchIndexStart, p = "startBatch";
    const f2 = this.maxTextures;
    for (let g = this.elementStart; g < this.elementSize; ++g) {
      const m3 = e[g];
      e[g] = null;
      const _ = m3.texture._source, b = De(m3.blendMode, _), v4 = o !== b || a !== m3.topology;
      if (_._batchTick === wr && !v4) {
        m3._textureId = _._textureBindLocation, h += m3.indexSize, m3.packAsQuad ? (this.packQuadAttributes(m3, l3, u3, m3._attributeStart, m3._textureId), this.packQuadIndex(c, m3._indexStart, m3._attributeStart / this.vertexSize)) : (this.packAttributes(m3, l3, u3, m3._attributeStart, m3._textureId), this.packIndex(m3, c, m3._indexStart, m3._attributeStart / this.vertexSize)), m3._batch = s;
        continue;
      }
      _._batchTick = wr, (i.count >= f2 || v4) && (this._finishBatch(s, d, h - d, i, o, a, t, p), p = "renderBatch", d = h, o = b, a = m3.topology, s = Xh(), i = s.textures, i.clear(), ++wr), m3._textureId = _._textureBindLocation = i.count, i.ids[_.uid] = i.count, i.textures[i.count++] = _, m3._batch = s, h += m3.indexSize, m3.packAsQuad ? (this.packQuadAttributes(m3, l3, u3, m3._attributeStart, m3._textureId), this.packQuadIndex(c, m3._indexStart, m3._attributeStart / this.vertexSize)) : (this.packAttributes(m3, l3, u3, m3._attributeStart, m3._textureId), this.packIndex(m3, c, m3._indexStart, m3._attributeStart / this.vertexSize));
    }
    i.count > 0 && (this._finishBatch(s, d, h - d, i, o, a, t, p), d = h, ++wr), this.elementStart = this.elementSize, this._batchIndexStart = d, this._batchIndexSize = h;
  }
  _finishBatch(t, e, s, i, n, o, a, l3) {
    t.gpuBindGroup = null, t.bindGroup = null, t.action = l3, t.batcher = this, t.textures = i, t.blendMode = n, t.topology = o, t.start = e, t.size = s, ++wr, this.batches[this.batchIndex++] = t, a.add(t);
  }
  finish(t) {
    this.break(t);
  }
  ensureAttributeBuffer(t) {
    t * 4 <= this.attributeBuffer.size || this._resizeAttributeBuffer(t * 4);
  }
  ensureIndexBuffer(t) {
    t <= this.indexBuffer.length || this._resizeIndexBuffer(t);
  }
  _resizeAttributeBuffer(t) {
    const e = Math.max(t, this.attributeBuffer.size * 2), s = new ve(e);
    Is(this.attributeBuffer.rawBinaryData, s.rawBinaryData), this.attributeBuffer = s;
  }
  _resizeIndexBuffer(t) {
    const e = this.indexBuffer;
    let s = Math.max(t, e.length * 1.5);
    s += s % 2;
    const i = s > 65535 ? new Uint32Array(s) : new Uint16Array(s);
    if (i.BYTES_PER_ELEMENT !== e.BYTES_PER_ELEMENT) for (let n = 0; n < e.length; n++) i[n] = e[n];
    else Is(e.buffer, i.buffer);
    this.indexBuffer = i;
  }
  packQuadIndex(t, e, s) {
    t[e] = s + 0, t[e + 1] = s + 1, t[e + 2] = s + 2, t[e + 3] = s + 0, t[e + 4] = s + 2, t[e + 5] = s + 3;
  }
  packIndex(t, e, s, i) {
    const n = t.indices, o = t.indexSize, a = t.indexOffset, l3 = t.attributeOffset;
    for (let u3 = 0; u3 < o; u3++) e[s++] = i + n[u3 + a] - l3;
  }
  destroy() {
    for (let t = 0; t < this.batches.length; t++) Hh(this.batches[t]);
    this.batches = null;
    for (let t = 0; t < this._elements.length; t++) this._elements[t]._batch = null;
    this._elements = null, this.indexBuffer = null, this.attributeBuffer.destroy(), this.attributeBuffer = null;
  }
};
jh.defaultOptions = { maxTextures: null, attributesInitialSize: 4, indicesInitialSize: 6 };
let zh = jh;
var N$1 = ((r) => (r[r.MAP_READ = 1] = "MAP_READ", r[r.MAP_WRITE = 2] = "MAP_WRITE", r[r.COPY_SRC = 4] = "COPY_SRC", r[r.COPY_DST = 8] = "COPY_DST", r[r.INDEX = 16] = "INDEX", r[r.VERTEX = 32] = "VERTEX", r[r.UNIFORM = 64] = "UNIFORM", r[r.STORAGE = 128] = "STORAGE", r[r.INDIRECT = 256] = "INDIRECT", r[r.QUERY_RESOLVE = 512] = "QUERY_RESOLVE", r[r.STATIC = 1024] = "STATIC", r))(N$1 || {});
class ft extends dt {
  constructor(t) {
    let { data: e, size: s } = t;
    const { usage: i, label: n, shrinkToFit: o } = t;
    super(), this.uid = Y("buffer"), this._resourceType = "buffer", this._resourceId = Y("resource"), this._touched = 0, this._updateID = 1, this._dataInt32 = null, this.shrinkToFit = true, this.destroyed = false, e instanceof Array && (e = new Float32Array(e)), this._data = e, s != null || (s = e == null ? void 0 : e.byteLength);
    const a = !!e;
    this.descriptor = { size: s, usage: i, mappedAtCreation: a, label: n }, this.shrinkToFit = o != null ? o : true;
  }
  get data() {
    return this._data;
  }
  set data(t) {
    this.setDataWithSize(t, t.length, true);
  }
  get dataInt32() {
    return this._dataInt32 || (this._dataInt32 = new Int32Array(this.data.buffer)), this._dataInt32;
  }
  get static() {
    return !!(this.descriptor.usage & N$1.STATIC);
  }
  set static(t) {
    t ? this.descriptor.usage |= N$1.STATIC : this.descriptor.usage &= ~N$1.STATIC;
  }
  setDataWithSize(t, e, s) {
    if (this._updateID++, this._updateSize = e * t.BYTES_PER_ELEMENT, this._data === t) {
      s && this.emit("update", this);
      return;
    }
    const i = this._data;
    if (this._data = t, this._dataInt32 = null, !i || i.length !== t.length) {
      !this.shrinkToFit && i && t.byteLength < i.byteLength ? s && this.emit("update", this) : (this.descriptor.size = t.byteLength, this._resourceId = Y("resource"), this.emit("change", this));
      return;
    }
    s && this.emit("update", this);
  }
  update(t) {
    this._updateSize = t != null ? t : this._updateSize, this._updateID++, this.emit("update", this);
  }
  destroy() {
    this.destroyed = true, this.emit("destroy", this), this.emit("change", this), this._data = null, this.descriptor = null, this.removeAllListeners();
  }
}
function jn(r, t) {
  if (!(r instanceof ft)) {
    let e = t ? N$1.INDEX : N$1.VERTEX;
    r instanceof Array && (t ? (r = new Uint32Array(r), e = N$1.INDEX | N$1.COPY_DST) : (r = new Float32Array(r), e = N$1.VERTEX | N$1.COPY_DST)), r = new ft({ data: r, label: t ? "index-mesh-buffer" : "vertex-mesh-buffer", usage: e });
  }
  return r;
}
function Vh(r, t, e) {
  const s = r.getAttribute(t);
  if (!s) return e.minX = 0, e.minY = 0, e.maxX = 0, e.maxY = 0, e;
  const i = s.buffer.data;
  let n = 1 / 0, o = 1 / 0, a = -1 / 0, l3 = -1 / 0;
  const u3 = i.BYTES_PER_ELEMENT, c = (s.offset || 0) / u3, h = (s.stride || 2 * 4) / u3;
  for (let d = c; d < i.length; d += h) {
    const p = i[d], f2 = i[d + 1];
    p > a && (a = p), f2 > l3 && (l3 = f2), p < n && (n = p), f2 < o && (o = f2);
  }
  return e.minX = n, e.minY = o, e.maxX = a, e.maxY = l3, e;
}
function T1(r) {
  return (r instanceof ft || Array.isArray(r) || r.BYTES_PER_ELEMENT) && (r = { buffer: r }), r.buffer = jn(r.buffer, false), r;
}
class ye extends dt {
  constructor(t = {}) {
    var e;
    super(), this.uid = Y("geometry"), this._layoutKey = 0, this.instanceCount = 1, this._bounds = new st$1(), this._boundsDirty = true;
    const { attributes: s, indexBuffer: i, topology: n } = t;
    if (this.buffers = [], this.attributes = {}, s) for (const o in s) this.addAttribute(o, s[o]);
    this.instanceCount = (e = t.instanceCount) != null ? e : 1, i && this.addIndex(i), this.topology = n || "triangle-list";
  }
  onBufferUpdate() {
    this._boundsDirty = true, this.emit("update", this);
  }
  getAttribute(t) {
    return this.attributes[t];
  }
  getIndex() {
    return this.indexBuffer;
  }
  getBuffer(t) {
    return this.getAttribute(t).buffer;
  }
  getSize() {
    for (const t in this.attributes) {
      const e = this.attributes[t];
      return e.buffer.data.length / (e.stride / 4 || e.size);
    }
    return 0;
  }
  addAttribute(t, e) {
    const s = T1(e);
    this.buffers.indexOf(s.buffer) === -1 && (this.buffers.push(s.buffer), s.buffer.on("update", this.onBufferUpdate, this), s.buffer.on("change", this.onBufferUpdate, this)), this.attributes[t] = s;
  }
  addIndex(t) {
    this.indexBuffer = jn(t, true), this.buffers.push(this.indexBuffer);
  }
  get bounds() {
    return this._boundsDirty ? (this._boundsDirty = false, Vh(this, "aPosition", this._bounds)) : this._bounds;
  }
  destroy(t = false) {
    this.emit("destroy", this), this.removeAllListeners(), t && this.buffers.forEach((e) => e.destroy()), this.attributes = null, this.buffers = null, this.indexBuffer = null, this._bounds = null;
  }
}
const S1 = new Float32Array(1), E1 = new Uint32Array(1);
class Wh extends ye {
  constructor() {
    const t = new ft({ data: S1, label: "attribute-batch-buffer", usage: N$1.VERTEX | N$1.COPY_DST, shrinkToFit: false }), e = new ft({ data: E1, label: "index-batch-buffer", usage: N$1.INDEX | N$1.COPY_DST, shrinkToFit: false }), s = 6 * 4;
    super({ attributes: { aPosition: { buffer: t, format: "float32x2", stride: s, offset: 0 }, aUV: { buffer: t, format: "float32x2", stride: s, offset: 2 * 4 }, aColor: { buffer: t, format: "unorm8x4", stride: s, offset: 4 * 4 }, aTextureIdAndRound: { buffer: t, format: "uint16x2", stride: s, offset: 5 * 4 } }, indexBuffer: e });
  }
}
const zn = /* @__PURE__ */ Object.create(null), Yh = /* @__PURE__ */ Object.create(null);
function ke(r, t) {
  let e = Yh[r];
  return e === void 0 && (zn[t] === void 0 && (zn[t] = 1), Yh[r] = e = zn[t]++), e;
}
let Bs;
function Kh() {
  if (!Bs) {
    Bs = "mediump";
    const r = Nn();
    r && r.getShaderPrecisionFormat && (Bs = r.getShaderPrecisionFormat(r.FRAGMENT_SHADER, r.HIGH_FLOAT).precision ? "highp" : "mediump");
  }
  return Bs;
}
function qh(r, t, e) {
  return t ? r : e ? (r = r.replace("out vec4 finalColor;", ""), `

#ifdef GL_ES // This checks if it is WebGL1
#define in varying
#define finalColor gl_FragColor
#define texture texture2D
#endif
${r}
`) : `

#ifdef GL_ES // This checks if it is WebGL1
#define in attribute
#define out varying
#endif
${r}
`;
}
function Zh(r, t, e) {
  const s = e ? t.maxSupportedFragmentPrecision : t.maxSupportedVertexPrecision;
  if (r.substring(0, 9) !== "precision") {
    let i = e ? t.requestedFragmentPrecision : t.requestedVertexPrecision;
    return i === "highp" && s !== "highp" && (i = "mediump"), `precision ${i} float;
${r}`;
  } else if (s !== "highp" && r.substring(0, 15) === "precision highp") return r.replace("precision highp", "precision mediump");
  return r;
}
function Qh(r, t) {
  return t ? `#version 300 es
${r}` : r;
}
const A1 = {}, w1 = {};
function Jh(r, { name: t = "pixi-program" }, e = true) {
  t = t.replace(/\s+/g, "-"), t += e ? "-fragment" : "-vertex";
  const s = e ? A1 : w1;
  return s[t] ? (s[t]++, t += `-${s[t]}`) : s[t] = 1, r.indexOf("#define SHADER_NAME") !== -1 ? r : `${`#define SHADER_NAME ${t}`}
${r}`;
}
function td(r, t) {
  return t ? r.replace("#version 300 es", "") : r;
}
var P1 = Object.defineProperty, ed = Object.getOwnPropertySymbols, R1 = Object.prototype.hasOwnProperty, M1 = Object.prototype.propertyIsEnumerable, rd = (r, t, e) => t in r ? P1(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, sd = (r, t) => {
  for (var e in t || (t = {})) R1.call(t, e) && rd(r, e, t[e]);
  if (ed) for (var e of ed(t)) M1.call(t, e) && rd(r, e, t[e]);
  return r;
};
const Vn = { stripVersion: td, ensurePrecision: Zh, addProgramDefines: qh, setProgramName: Jh, insertVersion: Qh }, Wn = /* @__PURE__ */ Object.create(null), id = class yu {
  constructor(t) {
    t = sd(sd({}, yu.defaultOptions), t);
    const e = t.fragment.indexOf("#version 300 es") !== -1, s = { stripVersion: e, ensurePrecision: { requestedFragmentPrecision: t.preferredFragmentPrecision, requestedVertexPrecision: t.preferredVertexPrecision, maxSupportedVertexPrecision: "highp", maxSupportedFragmentPrecision: Kh() }, setProgramName: { name: t.name }, addProgramDefines: e, insertVersion: e };
    let i = t.fragment, n = t.vertex;
    Object.keys(Vn).forEach((o) => {
      const a = s[o];
      i = Vn[o](i, a, true), n = Vn[o](n, a, false);
    }), this.fragment = i, this.vertex = n, this.transformFeedbackVaryings = t.transformFeedbackVaryings, this._key = ke(`${this.vertex}:${this.fragment}`, "gl-program");
  }
  destroy() {
    this.fragment = null, this.vertex = null, this._attributeData = null, this._uniformData = null, this._uniformBlockData = null, this.transformFeedbackVaryings = null;
  }
  static from(t) {
    const e = `${t.vertex}:${t.fragment}`;
    return Wn[e] || (Wn[e] = new yu(t)), Wn[e];
  }
};
id.defaultOptions = { preferredVertexPrecision: "highp", preferredFragmentPrecision: "mediump" };
let yt$1 = id;
const nd = { uint8x2: { size: 2, stride: 2, normalised: false }, uint8x4: { size: 4, stride: 4, normalised: false }, sint8x2: { size: 2, stride: 2, normalised: false }, sint8x4: { size: 4, stride: 4, normalised: false }, unorm8x2: { size: 2, stride: 2, normalised: true }, unorm8x4: { size: 4, stride: 4, normalised: true }, snorm8x2: { size: 2, stride: 2, normalised: true }, snorm8x4: { size: 4, stride: 4, normalised: true }, uint16x2: { size: 2, stride: 4, normalised: false }, uint16x4: { size: 4, stride: 8, normalised: false }, sint16x2: { size: 2, stride: 4, normalised: false }, sint16x4: { size: 4, stride: 8, normalised: false }, unorm16x2: { size: 2, stride: 4, normalised: true }, unorm16x4: { size: 4, stride: 8, normalised: true }, snorm16x2: { size: 2, stride: 4, normalised: true }, snorm16x4: { size: 4, stride: 8, normalised: true }, float16x2: { size: 2, stride: 4, normalised: false }, float16x4: { size: 4, stride: 8, normalised: false }, float32: { size: 1, stride: 4, normalised: false }, float32x2: { size: 2, stride: 8, normalised: false }, float32x3: { size: 3, stride: 12, normalised: false }, float32x4: { size: 4, stride: 16, normalised: false }, uint32: { size: 1, stride: 4, normalised: false }, uint32x2: { size: 2, stride: 8, normalised: false }, uint32x3: { size: 3, stride: 12, normalised: false }, uint32x4: { size: 4, stride: 16, normalised: false }, sint32: { size: 1, stride: 4, normalised: false }, sint32x2: { size: 2, stride: 8, normalised: false }, sint32x3: { size: 3, stride: 12, normalised: false }, sint32x4: { size: 4, stride: 16, normalised: false } };
function Zt(r) {
  var t;
  return (t = nd[r]) != null ? t : nd.float32;
}
const C1 = { f32: "float32", "vec2<f32>": "float32x2", "vec3<f32>": "float32x3", "vec4<f32>": "float32x4", vec2f: "float32x2", vec3f: "float32x3", vec4f: "float32x4", i32: "sint32", "vec2<i32>": "sint32x2", "vec3<i32>": "sint32x3", "vec4<i32>": "sint32x4", u32: "uint32", "vec2<u32>": "uint32x2", "vec3<u32>": "uint32x3", "vec4<u32>": "uint32x4", bool: "uint32", "vec2<bool>": "uint32x2", "vec3<bool>": "uint32x3", "vec4<bool>": "uint32x4" };
function od({ source: r, entryPoint: t }) {
  var e;
  const s = {}, i = r.indexOf(`fn ${t}`);
  if (i !== -1) {
    const n = r.indexOf("->", i);
    if (n !== -1) {
      const o = r.substring(i, n), a = /@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;
      let l3;
      for (; (l3 = a.exec(o)) !== null; ) {
        const u3 = (e = C1[l3[3]]) != null ? e : "float32";
        s[l3[2]] = { location: parseInt(l3[1], 10), format: u3, stride: Zt(u3).stride, offset: 0, instance: false, start: 0 };
      }
    }
  }
  return s;
}
function Fs(r) {
  var t, e, s;
  const i = /(^|[^/])@(group|binding)\(\d+\)[^;]+;/g, n = /@group\((\d+)\)/, o = /@binding\((\d+)\)/, a = /var(<[^>]+>)? (\w+)/, l3 = /:\s*(\w+)/, u3 = /struct\s+(\w+)\s*{([^}]+)}/g, c = /(\w+)\s*:\s*([\w\<\>]+)/g, h = /struct\s+(\w+)/, d = (t = r.match(i)) == null ? void 0 : t.map((f2) => ({ group: parseInt(f2.match(n)[1], 10), binding: parseInt(f2.match(o)[1], 10), name: f2.match(a)[2], isUniform: f2.match(a)[1] === "<uniform>", type: f2.match(l3)[1] }));
  if (!d) return { groups: [], structs: [] };
  const p = (s = (e = r.match(u3)) == null ? void 0 : e.map((f2) => {
    const g = f2.match(h)[1], m3 = f2.match(c).reduce((_, b) => {
      const [v4, y4] = b.split(":");
      return _[v4.trim()] = y4.trim(), _;
    }, {});
    return m3 ? { name: g, members: m3 } : null;
  }).filter(({ name: f2 }) => d.some((g) => g.type === f2))) != null ? s : [];
  return { groups: d, structs: p };
}
var $e = ((r) => (r[r.VERTEX = 1] = "VERTEX", r[r.FRAGMENT = 2] = "FRAGMENT", r[r.COMPUTE = 4] = "COMPUTE", r))($e || {});
function ad({ groups: r }) {
  const t = [];
  for (let e = 0; e < r.length; e++) {
    const s = r[e];
    t[s.group] || (t[s.group] = []), s.isUniform ? t[s.group].push({ binding: s.binding, visibility: $e.VERTEX | $e.FRAGMENT, buffer: { type: "uniform" } }) : s.type === "sampler" ? t[s.group].push({ binding: s.binding, visibility: $e.FRAGMENT, sampler: { type: "filtering" } }) : s.type === "texture_2d" && t[s.group].push({ binding: s.binding, visibility: $e.FRAGMENT, texture: { sampleType: "float", viewDimension: "2d", multisampled: false } });
  }
  return t;
}
function ld({ groups: r }) {
  const t = [];
  for (let e = 0; e < r.length; e++) {
    const s = r[e];
    t[s.group] || (t[s.group] = {}), t[s.group][s.name] = s.binding;
  }
  return t;
}
function ud(r, t) {
  const e = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), i = [...r.structs, ...t.structs].filter((o) => e.has(o.name) ? false : (e.add(o.name), true)), n = [...r.groups, ...t.groups].filter((o) => {
    const a = `${o.name}-${o.binding}`;
    return s.has(a) ? false : (s.add(a), true);
  });
  return { structs: i, groups: n };
}
const Yn = /* @__PURE__ */ Object.create(null);
let bt$1 = class bt {
  constructor(t) {
    this._layoutKey = 0, this._attributeLocationsKey = 0;
    var e, s;
    const { fragment: i, vertex: n, layout: o, gpuLayout: a, name: l3 } = t;
    if (this.name = l3, this.fragment = i, this.vertex = n, i.source === n.source) {
      const u3 = Fs(i.source);
      this.structsAndGroups = u3;
    } else {
      const u3 = Fs(n.source), c = Fs(i.source);
      this.structsAndGroups = ud(u3, c);
    }
    this.layout = o != null ? o : ld(this.structsAndGroups), this.gpuLayout = a != null ? a : ad(this.structsAndGroups), this.autoAssignGlobalUniforms = ((e = this.layout[0]) == null ? void 0 : e.globalUniforms) !== void 0, this.autoAssignLocalUniforms = ((s = this.layout[1]) == null ? void 0 : s.localUniforms) !== void 0, this._generateProgramKey();
  }
  _generateProgramKey() {
    const { vertex: t, fragment: e } = this, s = t.source + e.source + t.entryPoint + e.entryPoint;
    this._layoutKey = ke(s, "program");
  }
  get attributeData() {
    return this._attributeData != null || (this._attributeData = od(this.vertex)), this._attributeData;
  }
  destroy() {
    this.gpuLayout = null, this.layout = null, this.structsAndGroups = null, this.fragment = null, this.vertex = null;
  }
  static from(t) {
    const e = `${t.vertex.source}:${t.fragment.source}:${t.fragment.entryPoint}:${t.vertex.entryPoint}`;
    return Yn[e] || (Yn[e] = new bt(t)), Yn[e];
  }
};
function Kn(r, t, e) {
  if (r) for (const s in r) {
    const i = s.toLocaleLowerCase(), n = t[i];
    if (n) {
      let o = r[s];
      s === "header" && (o = o.replace(/@in\s+[^;]+;\s*/g, "").replace(/@out\s+[^;]+;\s*/g, "")), e && n.push(`//----${e}----//`), n.push(o);
    }
  }
}
const O1 = /\{\{(.*?)\}\}/g;
function qn(r) {
  var t, e;
  const s = {};
  return ((e = (t = r.match(O1)) == null ? void 0 : t.map((i) => i.replace(/[{()}]/g, ""))) != null ? e : []).forEach((i) => {
    s[i] = [];
  }), s;
}
function cd(r, t) {
  let e;
  const s = /@in\s+([^;]+);/g;
  for (; (e = s.exec(r)) !== null; ) t.push(e[1]);
}
function Zn(r, t, e = false) {
  const s = [];
  cd(t, s), r.forEach((a) => {
    a.header && cd(a.header, s);
  });
  const i = s;
  e && i.sort();
  const n = i.map((a, l3) => `       @location(${l3}) ${a},`).join(`
`);
  let o = t.replace(/@in\s+[^;]+;\s*/g, "");
  return o = o.replace("{{in}}", `
${n}
`), o;
}
function hd(r, t) {
  let e;
  const s = /@out\s+([^;]+);/g;
  for (; (e = s.exec(r)) !== null; ) t.push(e[1]);
}
function G1(r) {
  const t = /\b(\w+)\s*:/g.exec(r);
  return t ? t[1] : "";
}
function I1(r) {
  const t = /@.*?\s+/g;
  return r.replace(t, "");
}
function dd(r, t) {
  const e = [];
  hd(t, e), r.forEach((l3) => {
    l3.header && hd(l3.header, e);
  });
  let s = 0;
  const i = e.sort().map((l3) => l3.indexOf("builtin") > -1 ? l3 : `@location(${s++}) ${l3}`).join(`,
`), n = e.sort().map((l3) => `       var ${I1(l3)};`).join(`
`), o = `return VSOutput(
${e.sort().map((l3) => ` ${G1(l3)}`).join(`,
`)});`;
  let a = t.replace(/@out\s+[^;]+;\s*/g, "");
  return a = a.replace("{{struct}}", `
${i}
`), a = a.replace("{{start}}", `
${n}
`), a = a.replace("{{return}}", `
${o}
`), a;
}
function Qn(r, t) {
  let e = r;
  for (const s in t) {
    const i = t[s];
    i.join(`
`).length ? e = e.replace(`{{${s}}}`, `//-----${s} START-----//
${i.join(`
`)}
//----${s} FINISH----//`) : e = e.replace(`{{${s}}}`, "");
  }
  return e;
}
const Te = /* @__PURE__ */ Object.create(null), Jn = /* @__PURE__ */ new Map();
let B1 = 0;
function pd({ template: r, bits: t }) {
  const e = md(r, t);
  if (Te[e]) return Te[e];
  const { vertex: s, fragment: i } = F1(r, t);
  return Te[e] = gd(s, i, t), Te[e];
}
function fd({ template: r, bits: t }) {
  const e = md(r, t);
  return Te[e] || (Te[e] = gd(r.vertex, r.fragment, t)), Te[e];
}
function F1(r, t) {
  const e = t.map((o) => o.vertex).filter((o) => !!o), s = t.map((o) => o.fragment).filter((o) => !!o);
  let i = Zn(e, r.vertex, true);
  i = dd(e, i);
  const n = Zn(s, r.fragment, true);
  return { vertex: i, fragment: n };
}
function md(r, t) {
  return t.map((e) => (Jn.has(e) || Jn.set(e, B1++), Jn.get(e))).sort((e, s) => e - s).join("-") + r.vertex + r.fragment;
}
function gd(r, t, e) {
  const s = qn(r), i = qn(t);
  return e.forEach((n) => {
    Kn(n.vertex, s, n.name), Kn(n.fragment, i, n.name);
  }), { vertex: Qn(r, s), fragment: Qn(t, i) };
}
const _d = `
@in aPosition: vec2<f32>;
@in aUV: vec2<f32>;

@out @builtin(position) vPosition: vec4<f32>;
@out vUV : vec2<f32>;
@out vColor : vec4<f32>;

{{header}}

struct VSOutput {
{{struct}}
};

@vertex
fn main( {{in}} ) -> VSOutput {

var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
var modelMatrix = mat3x3<f32>(
1.0, 0.0, 0.0,
0.0, 1.0, 0.0,
0.0, 0.0, 1.0
);
var position = aPosition;
var uv = aUV;

{{start}}

vColor = vec4<f32>(1., 1., 1., 1.);

{{main}}

vUV = uv;

var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);

vColor *= globalUniforms.uWorldColorAlpha;

{{end}}

{{return}}
};
`, xd = `
@in vUV : vec2<f32>;
@in vColor : vec4<f32>;

{{header}}

@fragment
fn main(
{{in}}
) -> @location(0) vec4<f32> {

{{start}}

var outColor:vec4<f32>;

{{main}}

var finalColor:vec4<f32> = outColor * vColor;

{{end}}

return finalColor;
};
`, bd = `
in vec2 aPosition;
in vec2 aUV;

out vec4 vColor;
out vec2 vUV;

{{header}}

void main(void){

mat3 worldTransformMatrix = uWorldTransformMatrix;
mat3 modelMatrix = mat3(
1.0, 0.0, 0.0,
0.0, 1.0, 0.0,
0.0, 0.0, 1.0
);
vec2 position = aPosition;
vec2 uv = aUV;

{{start}}

vColor = vec4(1.);

{{main}}

vUV = uv;

mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

vColor *= uWorldColorAlpha;

{{end}}
}
`, vd = `

in vec4 vColor;
in vec2 vUV;

out vec4 finalColor;

{{header}}

void main(void) {

{{start}}

vec4 outColor;

{{main}}

finalColor = outColor * vColor;

{{end}}
}
`, yd = { name: "global-uniforms-bit", vertex: { header: `
struct GlobalUniforms {
uProjectionMatrix:mat3x3<f32>,
uWorldTransformMatrix:mat3x3<f32>,
uWorldColorAlpha: vec4<f32>,
uResolution: vec2<f32>,
}

@group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
` } }, Td = { name: "global-uniforms-bit", vertex: { header: `
uniform mat3 uProjectionMatrix;
uniform mat3 uWorldTransformMatrix;
uniform vec4 uWorldColorAlpha;
uniform vec2 uResolution;
` } };
var U1 = Object.defineProperty, Sd = Object.getOwnPropertySymbols, k1 = Object.prototype.hasOwnProperty, $1 = Object.prototype.propertyIsEnumerable, Ed = (r, t, e) => t in r ? U1(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, L1 = (r, t) => {
  for (var e in t || (t = {})) k1.call(t, e) && Ed(r, e, t[e]);
  if (Sd) for (var e of Sd(t)) $1.call(t, e) && Ed(r, e, t[e]);
  return r;
};
function Le({ bits: r, name: t }) {
  const e = pd({ template: { fragment: xd, vertex: _d }, bits: [yd, ...r] });
  return bt$1.from({ name: t, vertex: { source: e.vertex, entryPoint: "main" }, fragment: { source: e.fragment, entryPoint: "main" } });
}
function Ne({ bits: r, name: t }) {
  return new yt$1(L1({ name: t }, fd({ template: { vertex: bd, fragment: vd }, bits: [Td, ...r] })));
}
const Ds = { name: "color-bit", vertex: { header: `
@in aColor: vec4<f32>;
`, main: `
vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
` } }, Us = { name: "color-bit", vertex: { header: `
in vec4 aColor;
`, main: `
vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
` } }, to = {};
function N1(r) {
  const t = [];
  if (r === 1) t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"), t.push("@group(1) @binding(1) var textureSampler1: sampler;");
  else {
    let e = 0;
    for (let s = 0; s < r; s++) t.push(`@group(1) @binding(${e++}) var textureSource${s + 1}: texture_2d<f32>;`), t.push(`@group(1) @binding(${e++}) var textureSampler${s + 1}: sampler;`);
  }
  return t.join(`
`);
}
function X1(r) {
  const t = [];
  if (r === 1) t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");
  else {
    t.push("switch vTextureId {");
    for (let e = 0; e < r; e++) e === r - 1 ? t.push("  default:{") : t.push(`  case ${e}:{`), t.push(`      outColor = textureSampleGrad(textureSource${e + 1}, textureSampler${e + 1}, vUV, uvDx, uvDy);`), t.push("      break;}");
    t.push("}");
  }
  return t.join(`
`);
}
function ks(r) {
  return to[r] || (to[r] = { name: "texture-batch-bit", vertex: { header: `
@in aTextureIdAndRound: vec2<u32>;
@out @interpolate(flat) vTextureId : u32;
`, main: `
vTextureId = aTextureIdAndRound.y;
`, end: `
if(aTextureIdAndRound.x == 1)
{
vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
}
` }, fragment: { header: `
@in @interpolate(flat) vTextureId: u32;

${N1(r)}
`, main: `
var uvDx = dpdx(vUV);
var uvDy = dpdy(vUV);

${X1(r)}
` } }), to[r];
}
const eo = {};
function H1(r) {
  const t = [];
  for (let e = 0; e < r; e++) e > 0 && t.push("else"), e < r - 1 && t.push(`if(vTextureId < ${e}.5)`), t.push("{"), t.push(`	outColor = texture(uTextures[${e}], vUV);`), t.push("}");
  return t.join(`
`);
}
function $s(r) {
  return eo[r] || (eo[r] = { name: "texture-batch-bit", vertex: { header: `
in vec2 aTextureIdAndRound;
out float vTextureId;

`, main: `
vTextureId = aTextureIdAndRound.y;
`, end: `
if(aTextureIdAndRound.x == 1.)
{
gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
}
` }, fragment: { header: `
in float vTextureId;

uniform sampler2D uTextures[${r}];

`, main: `

${H1(r)}
` } }), eo[r];
}
const Xe = { name: "round-pixels-bit", vertex: { header: `
fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
{
return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}
` } }, He = { name: "round-pixels-bit", vertex: { header: `
vec2 roundPixels(vec2 position, vec2 targetSize)
{
return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}
` } }, ro = ["f32", "i32", "vec2<f32>", "vec3<f32>", "vec4<f32>", "mat2x2<f32>", "mat3x3<f32>", "mat4x4<f32>", "mat3x2<f32>", "mat4x2<f32>", "mat2x3<f32>", "mat4x3<f32>", "mat2x4<f32>", "mat3x4<f32>", "vec2<i32>", "vec3<i32>", "vec4<i32>"], Ad = ro.reduce((r, t) => (r[t] = true, r), {});
function wd(r, t) {
  switch (r) {
    case "f32":
      return 0;
    case "vec2<f32>":
      return new Float32Array(2 * t);
    case "vec3<f32>":
      return new Float32Array(3 * t);
    case "vec4<f32>":
      return new Float32Array(4 * t);
    case "mat2x2<f32>":
      return new Float32Array([1, 0, 0, 1]);
    case "mat3x3<f32>":
      return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    case "mat4x4<f32>":
      return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }
  return null;
}
var j1 = Object.defineProperty, Pd = Object.getOwnPropertySymbols, z1 = Object.prototype.hasOwnProperty, V1 = Object.prototype.propertyIsEnumerable, Rd = (r, t, e) => t in r ? j1(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Md = (r, t) => {
  for (var e in t || (t = {})) z1.call(t, e) && Rd(r, e, t[e]);
  if (Pd) for (var e of Pd(t)) V1.call(t, e) && Rd(r, e, t[e]);
  return r;
};
const Cd = class Kv {
  constructor(t, e) {
    this._touched = 0, this.uid = Y("uniform"), this._resourceType = "uniformGroup", this._resourceId = Y("resource"), this.isUniformGroup = true, this._dirtyId = 0, this.destroyed = false;
    var s;
    e = Md(Md({}, Kv.defaultOptions), e), this.uniformStructures = t;
    const n = {};
    for (const o in t) {
      const a = t[o];
      if (a.name = o, a.size = (s = a.size) != null ? s : 1, !Ad[a.type]) throw new Error(`Uniform type ${a.type} is not supported. Supported uniform types are: ${ro.join(", ")}`);
      a.value != null || (a.value = wd(a.type, a.size)), n[o] = a.value;
    }
    this.uniforms = n, this._dirtyId = 1, this.ubo = e.ubo, this.isStatic = e.isStatic, this._signature = ke(Object.keys(n).map((o) => `${o}-${t[o].type}`).join("-"), "uniform-group");
  }
  update() {
    this._dirtyId++;
  }
};
Cd.defaultOptions = { ubo: false, isStatic: false };
let et$1 = Cd;
const Od = {};
function Ls(r) {
  let t = Od[r];
  if (t) return t;
  const e = new Int32Array(r);
  for (let s = 0; s < r; s++) e[s] = s;
  return t = Od[r] = new et$1({ uTextures: { value: e, type: "i32", size: r } }, { isStatic: true }), t;
}
var mt$1 = ((r) => (r[r.WEBGL = 1] = "WEBGL", r[r.WEBGPU = 2] = "WEBGPU", r[r.BOTH = 3] = "BOTH", r))(mt$1 || {}), W1 = Object.defineProperty, Ns = Object.getOwnPropertySymbols, Gd = Object.prototype.hasOwnProperty, Id = Object.prototype.propertyIsEnumerable, Bd = (r, t, e) => t in r ? W1(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Y1 = (r, t) => {
  for (var e in t || (t = {})) Gd.call(t, e) && Bd(r, e, t[e]);
  if (Ns) for (var e of Ns(t)) Id.call(t, e) && Bd(r, e, t[e]);
  return r;
}, K1 = (r, t) => {
  var e = {};
  for (var s in r) Gd.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && Ns) for (var s of Ns(r)) t.indexOf(s) < 0 && Id.call(r, s) && (e[s] = r[s]);
  return e;
};
let At$1 = class At extends dt {
  constructor(t) {
    super(), this.uid = Y("shader"), this._uniformBindMap = /* @__PURE__ */ Object.create(null), this._ownedBindGroups = [];
    let { gpuProgram: e, glProgram: s, groups: i, resources: n, compatibleRenderers: o, groupMap: a } = t;
    this.gpuProgram = e, this.glProgram = s, o === void 0 && (o = 0, e && (o |= mt$1.WEBGPU), s && (o |= mt$1.WEBGL)), this.compatibleRenderers = o;
    const l3 = {};
    if (!n && !i && (n = {}), n && i) throw new Error("[Shader] Cannot have both resources and groups");
    if (!e && i && !a) throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");
    if (!e && i && a) for (const u3 in a) for (const c in a[u3]) {
      const h = a[u3][c];
      l3[h] = { group: u3, binding: c, name: h };
    }
    else if (e && i && !a) {
      const u3 = e.structsAndGroups.groups;
      a = {}, u3.forEach((c) => {
        a[c.group] = a[c.group] || {}, a[c.group][c.binding] = c.name, l3[c.name] = c;
      });
    } else if (n) {
      i = {}, a = {}, e && e.structsAndGroups.groups.forEach((c) => {
        a[c.group] = a[c.group] || {}, a[c.group][c.binding] = c.name, l3[c.name] = c;
      });
      let u3 = 0;
      for (const c in n) l3[c] || (i[99] || (i[99] = new Xt(), this._ownedBindGroups.push(i[99])), l3[c] = { group: 99, binding: u3, name: c }, a[99] = a[99] || {}, a[99][u3] = c, u3++);
      for (const c in n) {
        const h = c;
        let d = n[c];
        !d.source && !d._resourceType && (d = new et$1(d));
        const p = l3[h];
        p && (i[p.group] || (i[p.group] = new Xt(), this._ownedBindGroups.push(i[p.group])), i[p.group].setResource(d, p.binding));
      }
    }
    this.groups = i, this._uniformBindMap = a, this.resources = this._buildResourceAccessor(i, l3);
  }
  addResource(t, e, s) {
    var i, n;
    (i = this._uniformBindMap)[e] || (i[e] = {}), (n = this._uniformBindMap[e])[s] || (n[s] = t), this.groups[e] || (this.groups[e] = new Xt(), this._ownedBindGroups.push(this.groups[e]));
  }
  _buildResourceAccessor(t, e) {
    const s = {};
    for (const i in e) {
      const n = e[i];
      Object.defineProperty(s, n.name, { get() {
        return t[n.group].getResource(n.binding);
      }, set(o) {
        t[n.group].setResource(o, n.binding);
      } });
    }
    return s;
  }
  destroy(t = false) {
    var e, s;
    this.emit("destroy", this), t && ((e = this.gpuProgram) == null || e.destroy(), (s = this.glProgram) == null || s.destroy()), this.gpuProgram = null, this.glProgram = null, this.removeAllListeners(), this._uniformBindMap = null, this._ownedBindGroups.forEach((i) => {
      i.destroy();
    }), this._ownedBindGroups = null, this.resources = null, this.groups = null;
  }
  static from(t) {
    const e = t, { gpu: s, gl: i } = e, n = K1(e, ["gpu", "gl"]);
    let o, a;
    return s && (o = bt$1.from(s)), i && (a = yt$1.from(i)), new At(Y1({ gpuProgram: o, glProgram: a }, n));
  }
};
class Fd extends At$1 {
  constructor(t) {
    const e = Ne({ name: "batch", bits: [Us, $s(t), He] }), s = Le({ name: "batch", bits: [Ds, ks(t), Xe] });
    super({ glProgram: e, gpuProgram: s, resources: { batchSamplers: Ls(t) } });
  }
}
let so = null;
const Dd = class qv extends zh {
  constructor(t) {
    super(t), this.geometry = new Wh(), this.name = qv.extension.name, this.vertexSize = 6, so != null || (so = new Fd(t.maxTextures)), this.shader = so;
  }
  packAttributes(t, e, s, i, n) {
    const o = n << 16 | t.roundPixels & 65535, a = t.transform, l3 = a.a, u3 = a.b, c = a.c, h = a.d, d = a.tx, p = a.ty, { positions: f2, uvs: g } = t, m3 = t.color, _ = t.attributeOffset, b = _ + t.attributeSize;
    for (let v4 = _; v4 < b; v4++) {
      const y4 = v4 * 2, S3 = f2[y4], T4 = f2[y4 + 1];
      e[i++] = l3 * S3 + c * T4 + d, e[i++] = h * T4 + u3 * S3 + p, e[i++] = g[y4], e[i++] = g[y4 + 1], s[i++] = m3, s[i++] = o;
    }
  }
  packQuadAttributes(t, e, s, i, n) {
    const o = t.texture, a = t.transform, l3 = a.a, u3 = a.b, c = a.c, h = a.d, d = a.tx, p = a.ty, f2 = t.bounds, g = f2.maxX, m3 = f2.minX, _ = f2.maxY, b = f2.minY, v4 = o.uvs, y4 = t.color, S3 = n << 16 | t.roundPixels & 65535;
    e[i + 0] = l3 * m3 + c * b + d, e[i + 1] = h * b + u3 * m3 + p, e[i + 2] = v4.x0, e[i + 3] = v4.y0, s[i + 4] = y4, s[i + 5] = S3, e[i + 6] = l3 * g + c * b + d, e[i + 7] = h * b + u3 * g + p, e[i + 8] = v4.x1, e[i + 9] = v4.y1, s[i + 10] = y4, s[i + 11] = S3, e[i + 12] = l3 * g + c * _ + d, e[i + 13] = h * _ + u3 * g + p, e[i + 14] = v4.x2, e[i + 15] = v4.y2, s[i + 16] = y4, s[i + 17] = S3, e[i + 18] = l3 * m3 + c * _ + d, e[i + 19] = h * _ + u3 * m3 + p, e[i + 20] = v4.x3, e[i + 21] = v4.y3, s[i + 22] = y4, s[i + 23] = S3;
  }
};
Dd.extension = { type: [x$1.Batcher], name: "default" };
let Xs = Dd;
function Ud(r, t, e, s, i, n, o, a = null) {
  let l3 = 0;
  e *= t, i *= n;
  const u3 = a.a, c = a.b, h = a.c, d = a.d, p = a.tx, f2 = a.ty;
  for (; l3 < o; ) {
    const g = r[e], m3 = r[e + 1];
    s[i] = u3 * g + h * m3 + p, s[i + 1] = c * g + d * m3 + f2, i += n, e += t, l3++;
  }
}
function kd(r, t, e, s) {
  let i = 0;
  for (t *= e; i < s; ) r[t] = 0, r[t + 1] = 0, t += e, i++;
}
function io(r, t, e, s, i) {
  const n = t.a, o = t.b, a = t.c, l3 = t.d, u3 = t.tx, c = t.ty;
  e || (e = 0), s || (s = 2), i || (i = r.length / s - e);
  let h = e * s;
  for (let d = 0; d < i; d++) {
    const p = r[h], f2 = r[h + 1];
    r[h] = n * p + a * f2 + u3, r[h + 1] = o * p + l3 * f2 + c, h += s;
  }
}
const q1 = new R$1();
class Hs {
  constructor() {
    this.packAsQuad = false, this.batcherName = "default", this.topology = "triangle-list", this.applyTransform = true, this.roundPixels = 0, this._batcher = null, this._batch = null;
  }
  get uvs() {
    return this.geometryData.uvs;
  }
  get positions() {
    return this.geometryData.vertices;
  }
  get indices() {
    return this.geometryData.indices;
  }
  get blendMode() {
    return this.renderable && this.applyTransform ? this.renderable.groupBlendMode : "normal";
  }
  get color() {
    const t = this.baseColor, e = t >> 16 | t & 65280 | (t & 255) << 16, s = this.renderable;
    return s ? pn(e, s.groupColor) + (this.alpha * s.groupAlpha * 255 << 24) : e + (this.alpha * 255 << 24);
  }
  get transform() {
    var t;
    return ((t = this.renderable) == null ? void 0 : t.groupTransform) || q1;
  }
  copyTo(t) {
    t.indexOffset = this.indexOffset, t.indexSize = this.indexSize, t.attributeOffset = this.attributeOffset, t.attributeSize = this.attributeSize, t.baseColor = this.baseColor, t.alpha = this.alpha, t.texture = this.texture, t.geometryData = this.geometryData, t.topology = this.topology;
  }
  reset() {
    this.applyTransform = true, this.renderable = null, this.topology = "triangle-list";
  }
}
var Z1 = Object.defineProperty, Q1 = Object.defineProperties, J1 = Object.getOwnPropertyDescriptors, $d = Object.getOwnPropertySymbols, tT = Object.prototype.hasOwnProperty, eT = Object.prototype.propertyIsEnumerable, Ld = (r, t, e) => t in r ? Z1(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, js = (r, t) => {
  for (var e in t || (t = {})) tT.call(t, e) && Ld(r, e, t[e]);
  if ($d) for (var e of $d(t)) eT.call(t, e) && Ld(r, e, t[e]);
  return r;
}, zs = (r, t) => Q1(r, J1(t));
const je = { extension: { type: x$1.ShapeBuilder, name: "circle" }, build(r, t) {
  let e, s, i, n, o, a;
  if (r.type === "circle") {
    const y4 = r;
    if (o = a = y4.radius, o <= 0) return false;
    e = y4.x, s = y4.y, i = n = 0;
  } else if (r.type === "ellipse") {
    const y4 = r;
    if (o = y4.halfWidth, a = y4.halfHeight, o <= 0 || a <= 0) return false;
    e = y4.x, s = y4.y, i = n = 0;
  } else {
    const y4 = r, S3 = y4.width / 2, T4 = y4.height / 2;
    e = y4.x + S3, s = y4.y + T4, o = a = Math.max(0, Math.min(y4.radius, Math.min(S3, T4))), i = S3 - o, n = T4 - a;
  }
  if (i < 0 || n < 0) return false;
  const l3 = Math.ceil(2.3 * Math.sqrt(o + a)), u3 = l3 * 8 + (i ? 4 : 0) + (n ? 4 : 0);
  if (u3 === 0) return false;
  if (l3 === 0) return t[0] = t[6] = e + i, t[1] = t[3] = s + n, t[2] = t[4] = e - i, t[5] = t[7] = s - n, true;
  let c = 0, h = l3 * 4 + (i ? 2 : 0) + 2, d = h, p = u3, f2 = i + o, g = n, m3 = e + f2, _ = e - f2, b = s + g;
  if (t[c++] = m3, t[c++] = b, t[--h] = b, t[--h] = _, n) {
    const y4 = s - g;
    t[d++] = _, t[d++] = y4, t[--p] = y4, t[--p] = m3;
  }
  for (let y4 = 1; y4 < l3; y4++) {
    const S3 = Math.PI / 2 * (y4 / l3), T4 = i + Math.cos(S3) * o, E4 = n + Math.sin(S3) * a, O3 = e + T4, C3 = e - T4, w = s + E4, P = s - E4;
    t[c++] = O3, t[c++] = w, t[--h] = w, t[--h] = C3, t[d++] = C3, t[d++] = P, t[--p] = P, t[--p] = O3;
  }
  f2 = i, g = n + a, m3 = e + f2, _ = e - f2, b = s + g;
  const v4 = s - g;
  return t[c++] = m3, t[c++] = b, t[--p] = v4, t[--p] = m3, i && (t[c++] = _, t[c++] = b, t[--p] = v4, t[--p] = _), true;
}, triangulate(r, t, e, s, i, n) {
  if (r.length === 0) return;
  let o = 0, a = 0;
  for (let c = 0; c < r.length; c += 2) o += r[c], a += r[c + 1];
  o /= r.length / 2, a /= r.length / 2;
  let l3 = s;
  t[l3 * e] = o, t[l3 * e + 1] = a;
  const u3 = l3++;
  for (let c = 0; c < r.length; c += 2) t[l3 * e] = r[c], t[l3 * e + 1] = r[c + 1], c > 0 && (i[n++] = l3, i[n++] = u3, i[n++] = l3 - 1), l3++;
  i[n++] = u3 + 1, i[n++] = u3, i[n++] = l3 - 1;
} }, Nd = zs(js({}, je), { extension: zs(js({}, je.extension), { name: "ellipse" }) }), Xd = zs(js({}, je), { extension: zs(js({}, je.extension), { name: "roundedRectangle" }) }), no = 1e-4, oo = 1e-4;
function Hd(r) {
  const t = r.length;
  if (t < 6) return 1;
  let e = 0;
  for (let s = 0, i = r[t - 2], n = r[t - 1]; s < t; s += 2) {
    const o = r[s], a = r[s + 1];
    e += (o - i) * (a + n), i = o, n = a;
  }
  return e < 0 ? -1 : 1;
}
function jd(r, t, e, s, i, n, o, a) {
  const l3 = r - e * i, u3 = t - s * i, c = r + e * n, h = t + s * n;
  let d, p;
  o ? (d = s, p = -e) : (d = -s, p = e);
  const f2 = l3 + d, g = u3 + p, m3 = c + d, _ = h + p;
  return a.push(f2, g), a.push(m3, _), 2;
}
function Se(r, t, e, s, i, n, o, a) {
  const l3 = e - r, u3 = s - t;
  let c = Math.atan2(l3, u3), h = Math.atan2(i - r, n - t);
  a && c < h ? c += Math.PI * 2 : !a && c > h && (h += Math.PI * 2);
  let d = c;
  const p = h - c, f2 = Math.abs(p), g = Math.sqrt(l3 * l3 + u3 * u3), m3 = (15 * f2 * Math.sqrt(g) / Math.PI >> 0) + 1, _ = p / m3;
  if (d += _, a) {
    o.push(r, t), o.push(e, s);
    for (let b = 1, v4 = d; b < m3; b++, v4 += _) o.push(r, t), o.push(r + Math.sin(v4) * g, t + Math.cos(v4) * g);
    o.push(r, t), o.push(i, n);
  } else {
    o.push(e, s), o.push(r, t);
    for (let b = 1, v4 = d; b < m3; b++, v4 += _) o.push(r + Math.sin(v4) * g, t + Math.cos(v4) * g), o.push(r, t);
    o.push(i, n), o.push(r, t);
  }
  return m3 * 2;
}
function zd(r, t, e, s, i, n) {
  const o = no;
  if (r.length === 0) return;
  const a = t;
  let l3 = a.alignment;
  if (t.alignment !== 0.5) {
    let W3 = Hd(r);
    l3 = (l3 - 0.5) * W3 + 0.5;
  }
  const u3 = new z$1(r[0], r[1]), c = new z$1(r[r.length - 2], r[r.length - 1]), h = s, d = Math.abs(u3.x - c.x) < o && Math.abs(u3.y - c.y) < o;
  if (h) {
    r = r.slice(), d && (r.pop(), r.pop(), c.set(r[r.length - 2], r[r.length - 1]));
    const W3 = (u3.x + c.x) * 0.5, re = (c.y + u3.y) * 0.5;
    r.unshift(W3, re), r.push(W3, re);
  }
  const p = i, f2 = r.length / 2;
  let g = r.length;
  const m3 = p.length / 2, _ = a.width / 2, b = _ * _, v4 = a.miterLimit * a.miterLimit;
  let y4 = r[0], S3 = r[1], T4 = r[2], E4 = r[3], O3 = 0, C3 = 0, w = -(S3 - E4), P = y4 - T4, B3 = 0, U3 = 0, k3 = Math.sqrt(w * w + P * P);
  w /= k3, P /= k3, w *= _, P *= _;
  const Vt2 = l3, I3 = (1 - Vt2) * 2, D3 = Vt2 * 2;
  h || (a.cap === "round" ? g += Se(y4 - w * (I3 - D3) * 0.5, S3 - P * (I3 - D3) * 0.5, y4 - w * I3, S3 - P * I3, y4 + w * D3, S3 + P * D3, p, true) + 2 : a.cap === "square" && (g += jd(y4, S3, w, P, I3, D3, true, p))), p.push(y4 - w * I3, S3 - P * I3), p.push(y4 + w * D3, S3 + P * D3);
  for (let W3 = 1; W3 < f2 - 1; ++W3) {
    y4 = r[(W3 - 1) * 2], S3 = r[(W3 - 1) * 2 + 1], T4 = r[W3 * 2], E4 = r[W3 * 2 + 1], O3 = r[(W3 + 1) * 2], C3 = r[(W3 + 1) * 2 + 1], w = -(S3 - E4), P = y4 - T4, k3 = Math.sqrt(w * w + P * P), w /= k3, P /= k3, w *= _, P *= _, B3 = -(E4 - C3), U3 = T4 - O3, k3 = Math.sqrt(B3 * B3 + U3 * U3), B3 /= k3, U3 /= k3, B3 *= _, U3 *= _;
    const re = T4 - y4, ur = S3 - E4, cr = T4 - O3, hr = C3 - E4, Cu = re * cr + ur * hr, us = ur * cr - hr * re, dr = us < 0;
    if (Math.abs(us) < 1e-3 * Math.abs(Cu)) {
      p.push(T4 - w * I3, E4 - P * I3), p.push(T4 + w * D3, E4 + P * D3), Cu >= 0 && (a.join === "round" ? g += Se(T4, E4, T4 - w * I3, E4 - P * I3, T4 - B3 * I3, E4 - U3 * I3, p, false) + 4 : g += 2, p.push(T4 - B3 * D3, E4 - U3 * D3), p.push(T4 + B3 * I3, E4 + U3 * I3));
      continue;
    }
    const Ou = (-w + y4) * (-P + E4) - (-w + T4) * (-P + S3), Gu = (-B3 + O3) * (-U3 + E4) - (-B3 + T4) * (-U3 + C3), cs = (re * Gu - cr * Ou) / us, hs = (hr * Ou - ur * Gu) / us, sn = (cs - T4) * (cs - T4) + (hs - E4) * (hs - E4), ce = T4 + (cs - T4) * I3, he = E4 + (hs - E4) * I3, de = T4 - (cs - T4) * D3, pe = E4 - (hs - E4) * D3, yy = Math.min(re * re + ur * ur, cr * cr + hr * hr), Iu = dr ? I3 : D3, Ty = yy + Iu * Iu * b;
    sn <= Ty ? a.join === "bevel" || sn / b > v4 ? (dr ? (p.push(ce, he), p.push(T4 + w * D3, E4 + P * D3), p.push(ce, he), p.push(T4 + B3 * D3, E4 + U3 * D3)) : (p.push(T4 - w * I3, E4 - P * I3), p.push(de, pe), p.push(T4 - B3 * I3, E4 - U3 * I3), p.push(de, pe)), g += 2) : a.join === "round" ? dr ? (p.push(ce, he), p.push(T4 + w * D3, E4 + P * D3), g += Se(T4, E4, T4 + w * D3, E4 + P * D3, T4 + B3 * D3, E4 + U3 * D3, p, true) + 4, p.push(ce, he), p.push(T4 + B3 * D3, E4 + U3 * D3)) : (p.push(T4 - w * I3, E4 - P * I3), p.push(de, pe), g += Se(T4, E4, T4 - w * I3, E4 - P * I3, T4 - B3 * I3, E4 - U3 * I3, p, false) + 4, p.push(T4 - B3 * I3, E4 - U3 * I3), p.push(de, pe)) : (p.push(ce, he), p.push(de, pe)) : (p.push(T4 - w * I3, E4 - P * I3), p.push(T4 + w * D3, E4 + P * D3), a.join === "round" ? dr ? g += Se(T4, E4, T4 + w * D3, E4 + P * D3, T4 + B3 * D3, E4 + U3 * D3, p, true) + 2 : g += Se(T4, E4, T4 - w * I3, E4 - P * I3, T4 - B3 * I3, E4 - U3 * I3, p, false) + 2 : a.join === "miter" && sn / b <= v4 && (dr ? (p.push(de, pe), p.push(de, pe)) : (p.push(ce, he), p.push(ce, he)), g += 2), p.push(T4 - B3 * I3, E4 - U3 * I3), p.push(T4 + B3 * D3, E4 + U3 * D3), g += 2);
  }
  y4 = r[(f2 - 2) * 2], S3 = r[(f2 - 2) * 2 + 1], T4 = r[(f2 - 1) * 2], E4 = r[(f2 - 1) * 2 + 1], w = -(S3 - E4), P = y4 - T4, k3 = Math.sqrt(w * w + P * P), w /= k3, P /= k3, w *= _, P *= _, p.push(T4 - w * I3, E4 - P * I3), p.push(T4 + w * D3, E4 + P * D3), h || (a.cap === "round" ? g += Se(T4 - w * (I3 - D3) * 0.5, E4 - P * (I3 - D3) * 0.5, T4 - w * I3, E4 - P * I3, T4 + w * D3, E4 + P * D3, p, false) + 2 : a.cap === "square" && (g += jd(T4, E4, w, P, I3, D3, false, p)));
  const ls = oo * oo;
  for (let W3 = m3; W3 < g + m3 - 2; ++W3) y4 = p[W3 * 2], S3 = p[W3 * 2 + 1], T4 = p[(W3 + 1) * 2], E4 = p[(W3 + 1) * 2 + 1], O3 = p[(W3 + 2) * 2], C3 = p[(W3 + 2) * 2 + 1], !(Math.abs(y4 * (E4 - C3) + T4 * (C3 - S3) + O3 * (S3 - E4)) < ls) && n.push(W3, W3 + 1, W3 + 2);
}
function Vd(r, t, e, s) {
  const i = no;
  if (r.length === 0) return;
  const n = r[0], o = r[1], a = r[r.length - 2], l3 = r[r.length - 1], u3 = t || Math.abs(n - a) < i && Math.abs(o - l3) < i, c = e, h = r.length / 2, d = c.length / 2;
  for (let p = 0; p < h; p++) c.push(r[p * 2]), c.push(r[p * 2 + 1]);
  for (let p = 0; p < h - 1; p++) s.push(d + p, d + p + 1);
  u3 && s.push(d + h - 1, d);
}
function Wd(r, t, e = 2) {
  const s = t && t.length, i = s ? t[0] * e : r.length;
  let n = Yd(r, 0, i, e, true);
  const o = [];
  if (!n || n.next === n.prev) return o;
  let a, l3, u3;
  if (s && (n = oT(r, t, n, e)), r.length > 80 * e) {
    a = 1 / 0, l3 = 1 / 0;
    let c = -1 / 0, h = -1 / 0;
    for (let d = e; d < i; d += e) {
      const p = r[d], f2 = r[d + 1];
      p < a && (a = p), f2 < l3 && (l3 = f2), p > c && (c = p), f2 > h && (h = f2);
    }
    u3 = Math.max(c - a, h - l3), u3 = u3 !== 0 ? 32767 / u3 : 0;
  }
  return Pr(n, o, e, a, l3, u3, 0), o;
}
function Yd(r, t, e, s, i) {
  let n;
  if (i === uo(r, t, e, s) > 0) for (let o = t; o < e; o += s) n = Qd(o / s | 0, r[o], r[o + 1], n);
  else for (let o = e - s; o >= t; o -= s) n = Qd(o / s | 0, r[o], r[o + 1], n);
  return n && ze(n, n.next) && (Cr(n), n = n.next), n;
}
function Ee(r, t) {
  if (!r) return r;
  t || (t = r);
  let e = r, s;
  do
    if (s = false, !e.steiner && (ze(e, e.next) || q$1(e.prev, e, e.next) === 0)) {
      if (Cr(e), e = t = e.prev, e === e.next) break;
      s = true;
    } else e = e.next;
  while (s || e !== t);
  return t;
}
function Pr(r, t, e, s, i, n, o) {
  if (!r) return;
  !o && n && hT(r, s, i, n);
  let a = r;
  for (; r.prev !== r.next; ) {
    const l3 = r.prev, u3 = r.next;
    if (n ? sT(r, s, i, n) : rT(r)) {
      t.push(l3.i, r.i, u3.i), Cr(r), r = u3.next, a = u3.next;
      continue;
    }
    if (r = u3, r === a) {
      o ? o === 1 ? (r = iT(Ee(r), t), Pr(r, t, e, s, i, n, 2)) : o === 2 && nT(r, t, e, s, i, n) : Pr(Ee(r), t, e, s, i, n, 1);
      break;
    }
  }
}
function rT(r) {
  const t = r.prev, e = r, s = r.next;
  if (q$1(t, e, s) >= 0) return false;
  const i = t.x, n = e.x, o = s.x, a = t.y, l3 = e.y, u3 = s.y, c = Math.min(i, n, o), h = Math.min(a, l3, u3), d = Math.max(i, n, o), p = Math.max(a, l3, u3);
  let f2 = s.next;
  for (; f2 !== t; ) {
    if (f2.x >= c && f2.x <= d && f2.y >= h && f2.y <= p && Rr(i, a, n, l3, o, u3, f2.x, f2.y) && q$1(f2.prev, f2, f2.next) >= 0) return false;
    f2 = f2.next;
  }
  return true;
}
function sT(r, t, e, s) {
  const i = r.prev, n = r, o = r.next;
  if (q$1(i, n, o) >= 0) return false;
  const a = i.x, l3 = n.x, u3 = o.x, c = i.y, h = n.y, d = o.y, p = Math.min(a, l3, u3), f2 = Math.min(c, h, d), g = Math.max(a, l3, u3), m3 = Math.max(c, h, d), _ = ao(p, f2, t, e, s), b = ao(g, m3, t, e, s);
  let v4 = r.prevZ, y4 = r.nextZ;
  for (; v4 && v4.z >= _ && y4 && y4.z <= b; ) {
    if (v4.x >= p && v4.x <= g && v4.y >= f2 && v4.y <= m3 && v4 !== i && v4 !== o && Rr(a, c, l3, h, u3, d, v4.x, v4.y) && q$1(v4.prev, v4, v4.next) >= 0 || (v4 = v4.prevZ, y4.x >= p && y4.x <= g && y4.y >= f2 && y4.y <= m3 && y4 !== i && y4 !== o && Rr(a, c, l3, h, u3, d, y4.x, y4.y) && q$1(y4.prev, y4, y4.next) >= 0)) return false;
    y4 = y4.nextZ;
  }
  for (; v4 && v4.z >= _; ) {
    if (v4.x >= p && v4.x <= g && v4.y >= f2 && v4.y <= m3 && v4 !== i && v4 !== o && Rr(a, c, l3, h, u3, d, v4.x, v4.y) && q$1(v4.prev, v4, v4.next) >= 0) return false;
    v4 = v4.prevZ;
  }
  for (; y4 && y4.z <= b; ) {
    if (y4.x >= p && y4.x <= g && y4.y >= f2 && y4.y <= m3 && y4 !== i && y4 !== o && Rr(a, c, l3, h, u3, d, y4.x, y4.y) && q$1(y4.prev, y4, y4.next) >= 0) return false;
    y4 = y4.nextZ;
  }
  return true;
}
function iT(r, t) {
  let e = r;
  do {
    const s = e.prev, i = e.next.next;
    !ze(s, i) && qd(s, e, e.next, i) && Mr(s, i) && Mr(i, s) && (t.push(s.i, e.i, i.i), Cr(e), Cr(e.next), e = r = i), e = e.next;
  } while (e !== r);
  return Ee(e);
}
function nT(r, t, e, s, i, n) {
  let o = r;
  do {
    let a = o.next.next;
    for (; a !== o.prev; ) {
      if (o.i !== a.i && fT(o, a)) {
        let l3 = Zd(o, a);
        o = Ee(o, o.next), l3 = Ee(l3, l3.next), Pr(o, t, e, s, i, n, 0), Pr(l3, t, e, s, i, n, 0);
        return;
      }
      a = a.next;
    }
    o = o.next;
  } while (o !== r);
}
function oT(r, t, e, s) {
  const i = [];
  for (let n = 0, o = t.length; n < o; n++) {
    const a = t[n] * s, l3 = n < o - 1 ? t[n + 1] * s : r.length, u3 = Yd(r, a, l3, s, false);
    u3 === u3.next && (u3.steiner = true), i.push(pT(u3));
  }
  i.sort(aT);
  for (let n = 0; n < i.length; n++) e = lT(i[n], e);
  return e;
}
function aT(r, t) {
  let e = r.x - t.x;
  if (e === 0 && (e = r.y - t.y, e === 0)) {
    const s = (r.next.y - r.y) / (r.next.x - r.x), i = (t.next.y - t.y) / (t.next.x - t.x);
    e = s - i;
  }
  return e;
}
function lT(r, t) {
  const e = uT(r, t);
  if (!e) return t;
  const s = Zd(e, r);
  return Ee(s, s.next), Ee(e, e.next);
}
function uT(r, t) {
  let e = t;
  const s = r.x, i = r.y;
  let n = -1 / 0, o;
  if (ze(r, e)) return e;
  do {
    if (ze(r, e.next)) return e.next;
    if (i <= e.y && i >= e.next.y && e.next.y !== e.y) {
      const h = e.x + (i - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (h <= s && h > n && (n = h, o = e.x < e.next.x ? e : e.next, h === s)) return o;
    }
    e = e.next;
  } while (e !== t);
  if (!o) return null;
  const a = o, l3 = o.x, u3 = o.y;
  let c = 1 / 0;
  e = o;
  do {
    if (s >= e.x && e.x >= l3 && s !== e.x && Kd(i < u3 ? s : n, i, l3, u3, i < u3 ? n : s, i, e.x, e.y)) {
      const h = Math.abs(i - e.y) / (s - e.x);
      Mr(e, r) && (h < c || h === c && (e.x > o.x || e.x === o.x && cT(o, e))) && (o = e, c = h);
    }
    e = e.next;
  } while (e !== a);
  return o;
}
function cT(r, t) {
  return q$1(r.prev, r, t.prev) < 0 && q$1(t.next, r, r.next) < 0;
}
function hT(r, t, e, s) {
  let i = r;
  do
    i.z === 0 && (i.z = ao(i.x, i.y, t, e, s)), i.prevZ = i.prev, i.nextZ = i.next, i = i.next;
  while (i !== r);
  i.prevZ.nextZ = null, i.prevZ = null, dT(i);
}
function dT(r) {
  let t, e = 1;
  do {
    let s = r, i;
    r = null;
    let n = null;
    for (t = 0; s; ) {
      t++;
      let o = s, a = 0;
      for (let u3 = 0; u3 < e && (a++, o = o.nextZ, !!o); u3++) ;
      let l3 = e;
      for (; a > 0 || l3 > 0 && o; ) a !== 0 && (l3 === 0 || !o || s.z <= o.z) ? (i = s, s = s.nextZ, a--) : (i = o, o = o.nextZ, l3--), n ? n.nextZ = i : r = i, i.prevZ = n, n = i;
      s = o;
    }
    n.nextZ = null, e *= 2;
  } while (t > 1);
  return r;
}
function ao(r, t, e, s, i) {
  return r = (r - e) * i | 0, t = (t - s) * i | 0, r = (r | r << 8) & 16711935, r = (r | r << 4) & 252645135, r = (r | r << 2) & 858993459, r = (r | r << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, r | t << 1;
}
function pT(r) {
  let t = r, e = r;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== r);
  return e;
}
function Kd(r, t, e, s, i, n, o, a) {
  return (i - o) * (t - a) >= (r - o) * (n - a) && (r - o) * (s - a) >= (e - o) * (t - a) && (e - o) * (n - a) >= (i - o) * (s - a);
}
function Rr(r, t, e, s, i, n, o, a) {
  return !(r === o && t === a) && Kd(r, t, e, s, i, n, o, a);
}
function fT(r, t) {
  return r.next.i !== t.i && r.prev.i !== t.i && !mT(r, t) && (Mr(r, t) && Mr(t, r) && gT(r, t) && (q$1(r.prev, r, t.prev) || q$1(r, t.prev, t)) || ze(r, t) && q$1(r.prev, r, r.next) > 0 && q$1(t.prev, t, t.next) > 0);
}
function q$1(r, t, e) {
  return (t.y - r.y) * (e.x - t.x) - (t.x - r.x) * (e.y - t.y);
}
function ze(r, t) {
  return r.x === t.x && r.y === t.y;
}
function qd(r, t, e, s) {
  const i = Ws(q$1(r, t, e)), n = Ws(q$1(r, t, s)), o = Ws(q$1(e, s, r)), a = Ws(q$1(e, s, t));
  return !!(i !== n && o !== a || i === 0 && Vs(r, e, t) || n === 0 && Vs(r, s, t) || o === 0 && Vs(e, r, s) || a === 0 && Vs(e, t, s));
}
function Vs(r, t, e) {
  return t.x <= Math.max(r.x, e.x) && t.x >= Math.min(r.x, e.x) && t.y <= Math.max(r.y, e.y) && t.y >= Math.min(r.y, e.y);
}
function Ws(r) {
  return r > 0 ? 1 : r < 0 ? -1 : 0;
}
function mT(r, t) {
  let e = r;
  do {
    if (e.i !== r.i && e.next.i !== r.i && e.i !== t.i && e.next.i !== t.i && qd(e, e.next, r, t)) return true;
    e = e.next;
  } while (e !== r);
  return false;
}
function Mr(r, t) {
  return q$1(r.prev, r, r.next) < 0 ? q$1(r, t, r.next) >= 0 && q$1(r, r.prev, t) >= 0 : q$1(r, t, r.prev) < 0 || q$1(r, r.next, t) < 0;
}
function gT(r, t) {
  let e = r, s = false;
  const i = (r.x + t.x) / 2, n = (r.y + t.y) / 2;
  do
    e.y > n != e.next.y > n && e.next.y !== e.y && i < (e.next.x - e.x) * (n - e.y) / (e.next.y - e.y) + e.x && (s = !s), e = e.next;
  while (e !== r);
  return s;
}
function Zd(r, t) {
  const e = lo(r.i, r.x, r.y), s = lo(t.i, t.x, t.y), i = r.next, n = t.prev;
  return r.next = t, t.prev = r, e.next = i, i.prev = e, s.next = e, e.prev = s, n.next = s, s.prev = n, s;
}
function Qd(r, t, e, s) {
  const i = lo(r, t, e);
  return s ? (i.next = s.next, i.prev = s, s.next.prev = i, s.next = i) : (i.prev = i, i.next = i), i;
}
function Cr(r) {
  r.next.prev = r.prev, r.prev.next = r.next, r.prevZ && (r.prevZ.nextZ = r.nextZ), r.nextZ && (r.nextZ.prevZ = r.prevZ);
}
function lo(r, t, e) {
  return { i: r, x: t, y: e, prev: null, next: null, z: 0, prevZ: null, nextZ: null, steiner: false };
}
function uo(r, t, e, s) {
  let i = 0;
  for (let n = t, o = e - s; n < e; n += s) i += (r[o] - r[n]) * (r[n + 1] + r[o + 1]), o = n;
  return i;
}
const Jd = Wd.default || Wd;
function co(r, t, e, s, i, n, o) {
  const a = Jd(r, t, 2);
  if (!a) return;
  for (let u3 = 0; u3 < a.length; u3 += 3) n[o++] = a[u3] + i, n[o++] = a[u3 + 1] + i, n[o++] = a[u3 + 2] + i;
  let l3 = i * s;
  for (let u3 = 0; u3 < r.length; u3 += 2) e[l3] = r[u3], e[l3 + 1] = r[u3 + 1], l3 += s;
}
const _T = [], tp = { extension: { type: x$1.ShapeBuilder, name: "polygon" }, build(r, t) {
  for (let e = 0; e < r.points.length; e++) t[e] = r.points[e];
  return true;
}, triangulate(r, t, e, s, i, n) {
  co(r, _T, t, e, s, i, n);
} }, ep = { extension: { type: x$1.ShapeBuilder, name: "rectangle" }, build(r, t) {
  const e = r, s = e.x, i = e.y, n = e.width, o = e.height;
  return n > 0 && o > 0 ? (t[0] = s, t[1] = i, t[2] = s + n, t[3] = i, t[4] = s + n, t[5] = i + o, t[6] = s, t[7] = i + o, true) : false;
}, triangulate(r, t, e, s, i, n) {
  let o = 0;
  s *= e, t[s + o] = r[0], t[s + o + 1] = r[1], o += e, t[s + o] = r[2], t[s + o + 1] = r[3], o += e, t[s + o] = r[6], t[s + o + 1] = r[7], o += e, t[s + o] = r[4], t[s + o + 1] = r[5], o += e;
  const a = s / e;
  i[n++] = a, i[n++] = a + 1, i[n++] = a + 2, i[n++] = a + 1, i[n++] = a + 3, i[n++] = a + 2;
} }, rp = { extension: { type: x$1.ShapeBuilder, name: "triangle" }, build(r, t) {
  return t[0] = r.x, t[1] = r.y, t[2] = r.x2, t[3] = r.y2, t[4] = r.x3, t[5] = r.y3, true;
}, triangulate(r, t, e, s, i, n) {
  let o = 0;
  s *= e, t[s + o] = r[0], t[s + o + 1] = r[1], o += e, t[s + o] = r[2], t[s + o + 1] = r[3], o += e, t[s + o] = r[4], t[s + o + 1] = r[5];
  const a = s / e;
  i[n++] = a, i[n++] = a + 1, i[n++] = a + 2;
} };
var xT = Object.defineProperty, sp = Object.getOwnPropertySymbols, bT = Object.prototype.hasOwnProperty, vT = Object.prototype.propertyIsEnumerable, ip = (r, t, e) => t in r ? xT(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, np = (r, t) => {
  for (var e in t || (t = {})) bT.call(t, e) && ip(r, e, t[e]);
  if (sp) for (var e of sp(t)) vT.call(t, e) && ip(r, e, t[e]);
  return r;
};
const op = [{ offset: 0, color: "white" }, { offset: 1, color: "black" }], ho = class Tu {
  constructor(...t) {
    this.uid = Y("fillGradient"), this.type = "linear", this.colorStops = [];
    var e;
    let s = yT(t);
    const i = s.type === "radial" ? Tu.defaultRadialOptions : Tu.defaultLinearOptions;
    s = np(np({}, i), It(s)), this._textureSize = s.textureSize, this._wrapMode = s.wrapMode, s.type === "radial" ? (this.center = s.center, this.outerCenter = (e = s.outerCenter) != null ? e : this.center, this.innerRadius = s.innerRadius, this.outerRadius = s.outerRadius, this.scale = s.scale, this.rotation = s.rotation) : (this.start = s.start, this.end = s.end), this.textureSpace = s.textureSpace, this.type = s.type, s.colorStops.forEach((n) => {
      this.addColorStop(n.offset, n.color);
    });
  }
  addColorStop(t, e) {
    return this.colorStops.push({ offset: t, color: X.shared.setValue(e).toHexa() }), this;
  }
  buildLinearGradient() {
    if (this.texture) return;
    let { x: t, y: e } = this.start, { x: s, y: i } = this.end, n = s - t, o = i - e;
    const a = n < 0 || o < 0;
    if (this._wrapMode === "clamp-to-edge") {
      if (n < 0) {
        const m3 = t;
        t = s, s = m3, n *= -1;
      }
      if (o < 0) {
        const m3 = e;
        e = i, i = m3, o *= -1;
      }
    }
    const l3 = this.colorStops.length ? this.colorStops : op, u3 = this._textureSize, { canvas: c, context: h } = lp(u3, 1), d = a ? h.createLinearGradient(this._textureSize, 0, 0, 0) : h.createLinearGradient(0, 0, this._textureSize, 0);
    ap(d, l3), h.fillStyle = d, h.fillRect(0, 0, u3, 1), this.texture = new A$1({ source: new ie({ resource: c, addressMode: this._wrapMode }) });
    const p = Math.sqrt(n * n + o * o), f2 = Math.atan2(o, n), g = new R$1();
    g.scale(p / u3, 1), g.rotate(f2), g.translate(t, e), this.textureSpace === "local" && g.scale(u3, u3), this.transform = g;
  }
  buildGradient() {
    this.type === "linear" ? this.buildLinearGradient() : this.buildRadialGradient();
  }
  buildRadialGradient() {
    if (this.texture) return;
    const t = this.colorStops.length ? this.colorStops : op, e = this._textureSize, { canvas: s, context: i } = lp(e, e), { x: n, y: o } = this.center, { x: a, y: l3 } = this.outerCenter, u3 = this.innerRadius, c = this.outerRadius, h = a - c, d = l3 - c, p = e / (c * 2), f2 = (n - h) * p, g = (o - d) * p, m3 = i.createRadialGradient(f2, g, u3 * p, (a - h) * p, (l3 - d) * p, c * p);
    ap(m3, t), i.fillStyle = t[t.length - 1].color, i.fillRect(0, 0, e, e), i.fillStyle = m3, i.translate(f2, g), i.rotate(this.rotation), i.scale(1, this.scale), i.translate(-f2, -g), i.fillRect(0, 0, e, e), this.texture = new A$1({ source: new ie({ resource: s, addressMode: this._wrapMode }) });
    const _ = new R$1();
    _.scale(1 / p, 1 / p), _.translate(h, d), this.textureSpace === "local" && _.scale(e, e), this.transform = _;
  }
  get styleKey() {
    return this.uid;
  }
  destroy() {
    var t;
    (t = this.texture) == null || t.destroy(true), this.texture = null;
  }
};
ho.defaultLinearOptions = { start: { x: 0, y: 0 }, end: { x: 0, y: 1 }, colorStops: [], textureSpace: "local", type: "linear", textureSize: 256, wrapMode: "clamp-to-edge" }, ho.defaultRadialOptions = { center: { x: 0.5, y: 0.5 }, innerRadius: 0, outerRadius: 0.5, colorStops: [], scale: 1, textureSpace: "local", type: "radial", textureSize: 256, wrapMode: "clamp-to-edge" };
let Ht$1 = ho;
function ap(r, t) {
  for (let e = 0; e < t.length; e++) {
    const s = t[e];
    r.addColorStop(s.offset, s.color);
  }
}
function lp(r, t) {
  const e = L.get().createCanvas(r, t), s = e.getContext("2d");
  return { canvas: e, context: s };
}
function yT(r) {
  var t, e;
  let s = (t = r[0]) != null ? t : {};
  return (typeof s == "number" || r[1]) && (s = { type: "linear", start: { x: r[0], y: r[1] }, end: { x: r[2], y: r[3] }, textureSpace: r[4], textureSize: (e = r[5]) != null ? e : Ht$1.defaultLinearOptions.textureSize }), s;
}
const TT = new R$1(), ST = new j$1();
function up(r, t, e, s) {
  const i = t.matrix ? r.copyFrom(t.matrix).invert() : r.identity();
  if (t.textureSpace === "local") {
    const o = e.getBounds(ST);
    t.width && o.pad(t.width);
    const { x: a, y: l3 } = o, u3 = 1 / o.width, c = 1 / o.height, h = -a * u3, d = -l3 * c, p = i.a, f2 = i.b, g = i.c, m3 = i.d;
    i.a *= u3, i.b *= u3, i.c *= c, i.d *= c, i.tx = h * p + d * g + i.tx, i.ty = h * f2 + d * m3 + i.ty;
  } else i.translate(t.texture.frame.x, t.texture.frame.y), i.scale(1 / t.texture.source.width, 1 / t.texture.source.height);
  const n = t.texture.source.style;
  return !(t.fill instanceof Ht$1) && n.addressMode === "clamp-to-edge" && (n.addressMode = "repeat", n.update()), s && i.append(TT.copyFrom(s).invert()), i;
}
const Or = {};
G$1.handleByMap(x$1.ShapeBuilder, Or), G$1.add(ep, tp, rp, je, Nd, Xd);
const ET = new j$1(), AT = new R$1();
function cp(r, t) {
  const { geometryData: e, batches: s } = t;
  s.length = 0, e.indices.length = 0, e.vertices.length = 0, e.uvs.length = 0;
  for (let i = 0; i < r.instructions.length; i++) {
    const n = r.instructions[i];
    if (n.action === "texture") wT(n.data, s, e);
    else if (n.action === "fill" || n.action === "stroke") {
      const o = n.action === "stroke", a = n.data.path.shapePath, l3 = n.data.style, u3 = n.data.hole;
      o && u3 && hp(u3.shapePath, l3, true, s, e), u3 && (a.shapePrimitives[a.shapePrimitives.length - 1].holes = u3.shapePath.shapePrimitives), hp(a, l3, o, s, e);
    }
  }
}
function wT(r, t, e) {
  const s = [], i = Or.rectangle, n = ET;
  n.x = r.dx, n.y = r.dy, n.width = r.dw, n.height = r.dh;
  const o = r.transform;
  if (!i.build(n, s)) return;
  const { vertices: a, uvs: l3, indices: u3 } = e, c = u3.length, h = a.length / 2;
  o && io(s, o), i.triangulate(s, a, 2, h, u3, c);
  const d = r.image, p = d.uvs;
  l3.push(p.x0, p.y0, p.x1, p.y1, p.x3, p.y3, p.x2, p.y2);
  const f2 = nt.get(Hs);
  f2.indexOffset = c, f2.indexSize = u3.length - c, f2.attributeOffset = h, f2.attributeSize = a.length / 2 - h, f2.baseColor = r.style, f2.alpha = r.alpha, f2.texture = d, f2.geometryData = e, t.push(f2);
}
function hp(r, t, e, s, i) {
  const { vertices: n, uvs: o, indices: a } = i;
  r.shapePrimitives.forEach(({ shape: l3, transform: u3, holes: c }) => {
    var h;
    const d = [], p = Or[l3.type];
    if (!p.build(l3, d)) return;
    const f2 = a.length, g = n.length / 2;
    let m3 = "triangle-list";
    if (u3 && io(d, u3), e) {
      const y4 = (h = l3.closePath) != null ? h : true, S3 = t;
      S3.pixelLine ? (Vd(d, y4, n, a), m3 = "line-list") : zd(d, S3, false, y4, n, a);
    } else if (c) {
      const y4 = [], S3 = d.slice();
      PT(c).forEach((T4) => {
        y4.push(S3.length / 2), S3.push(...T4);
      }), co(S3, y4, n, 2, g, a, f2);
    } else p.triangulate(d, n, 2, g, a, f2);
    const _ = o.length / 2, b = t.texture;
    if (b !== A$1.WHITE) {
      const y4 = up(AT, t, l3, u3);
      Ud(n, 2, g, o, _, 2, n.length / 2 - g, y4);
    } else kd(o, _, 2, n.length / 2 - g);
    const v4 = nt.get(Hs);
    v4.indexOffset = f2, v4.indexSize = a.length - f2, v4.attributeOffset = g, v4.attributeSize = n.length / 2 - g, v4.baseColor = t.color, v4.alpha = t.alpha, v4.texture = b, v4.geometryData = i, v4.topology = m3, s.push(v4);
  });
}
function PT(r) {
  const t = [];
  for (let e = 0; e < r.length; e++) {
    const s = r[e].shape, i = [];
    Or[s.type].build(s, i) && t.push(i);
  }
  return t;
}
class dp {
  constructor() {
    this.batches = [], this.geometryData = { vertices: [], uvs: [], indices: [] };
  }
}
class pp {
  constructor() {
    this.instructions = new mn();
  }
  init(t) {
    this.batcher = new Xs({ maxTextures: t }), this.instructions.reset();
  }
  get geometry() {
    return this.batcher.geometry;
  }
}
const po = class Su {
  constructor(t) {
    this._gpuContextHash = {}, this._graphicsDataContextHash = /* @__PURE__ */ Object.create(null), this._renderer = t, t.renderableGC.addManagedHash(this, "_gpuContextHash"), t.renderableGC.addManagedHash(this, "_graphicsDataContextHash");
  }
  init(t) {
    var e;
    Su.defaultOptions.bezierSmoothness = (e = t == null ? void 0 : t.bezierSmoothness) != null ? e : Su.defaultOptions.bezierSmoothness;
  }
  getContextRenderData(t) {
    return this._graphicsDataContextHash[t.uid] || this._initContextRenderData(t);
  }
  updateGpuContext(t) {
    let e = this._gpuContextHash[t.uid] || this._initContext(t);
    if (t.dirty) {
      e ? this._cleanGraphicsContextData(t) : e = this._initContext(t), cp(t, e);
      const s = t.batchMode;
      t.customShader || s === "no-batch" ? e.isBatchable = false : s === "auto" ? e.isBatchable = e.geometryData.vertices.length < 400 : e.isBatchable = true, t.dirty = false;
    }
    return e;
  }
  getGpuContext(t) {
    return this._gpuContextHash[t.uid] || this._initContext(t);
  }
  _initContextRenderData(t) {
    const e = nt.get(pp, { maxTextures: this._renderer.limits.maxBatchableTextures }), { batches: s, geometryData: i } = this._gpuContextHash[t.uid], n = i.vertices.length, o = i.indices.length;
    for (let c = 0; c < s.length; c++) s[c].applyTransform = false;
    const a = e.batcher;
    a.ensureAttributeBuffer(n), a.ensureIndexBuffer(o), a.begin();
    for (let c = 0; c < s.length; c++) {
      const h = s[c];
      a.add(h);
    }
    a.finish(e.instructions);
    const l3 = a.geometry;
    l3.indexBuffer.setDataWithSize(a.indexBuffer, a.indexSize, true), l3.buffers[0].setDataWithSize(a.attributeBuffer.float32View, a.attributeSize, true);
    const u3 = a.batches;
    for (let c = 0; c < u3.length; c++) {
      const h = u3[c];
      h.bindGroup = Gs(h.textures.textures, h.textures.count, this._renderer.limits.maxBatchableTextures);
    }
    return this._graphicsDataContextHash[t.uid] = e, e;
  }
  _initContext(t) {
    const e = new dp();
    return e.context = t, this._gpuContextHash[t.uid] = e, t.on("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid];
  }
  onGraphicsContextDestroy(t) {
    this._cleanGraphicsContextData(t), t.off("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid] = null;
  }
  _cleanGraphicsContextData(t) {
    const e = this._gpuContextHash[t.uid];
    e.isBatchable || this._graphicsDataContextHash[t.uid] && (nt.return(this.getContextRenderData(t)), this._graphicsDataContextHash[t.uid] = null), e.batches && e.batches.forEach((s) => {
      nt.return(s);
    });
  }
  destroy() {
    for (const t in this._gpuContextHash) this._gpuContextHash[t] && this.onGraphicsContextDestroy(this._gpuContextHash[t].context);
  }
};
po.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem, x$1.CanvasSystem], name: "graphicsContext" }, po.defaultOptions = { bezierSmoothness: 0.5 };
let Ys = po;
const RT = { normal: 0, add: 1, multiply: 2, screen: 3, overlay: 4, erase: 5, "normal-npm": 6, "add-npm": 7, "screen-npm": 8, min: 9, max: 10 }, fo = 0, mo = 1, go = 2, _o = 3, xo = 4, bo = 5, vo = class Zv {
  constructor() {
    this.data = 0, this.blendMode = "normal", this.polygonOffset = 0, this.blend = true, this.depthMask = true;
  }
  get blend() {
    return !!(this.data & 1 << fo);
  }
  set blend(t) {
    !!(this.data & 1 << fo) !== t && (this.data ^= 1 << fo);
  }
  get offsets() {
    return !!(this.data & 1 << mo);
  }
  set offsets(t) {
    !!(this.data & 1 << mo) !== t && (this.data ^= 1 << mo);
  }
  set cullMode(t) {
    if (t === "none") {
      this.culling = false;
      return;
    }
    this.culling = true, this.clockwiseFrontFace = t === "front";
  }
  get cullMode() {
    return this.culling ? this.clockwiseFrontFace ? "front" : "back" : "none";
  }
  get culling() {
    return !!(this.data & 1 << go);
  }
  set culling(t) {
    !!(this.data & 1 << go) !== t && (this.data ^= 1 << go);
  }
  get depthTest() {
    return !!(this.data & 1 << _o);
  }
  set depthTest(t) {
    !!(this.data & 1 << _o) !== t && (this.data ^= 1 << _o);
  }
  get depthMask() {
    return !!(this.data & 1 << bo);
  }
  set depthMask(t) {
    !!(this.data & 1 << bo) !== t && (this.data ^= 1 << bo);
  }
  get clockwiseFrontFace() {
    return !!(this.data & 1 << xo);
  }
  set clockwiseFrontFace(t) {
    !!(this.data & 1 << xo) !== t && (this.data ^= 1 << xo);
  }
  get blendMode() {
    return this._blendMode;
  }
  set blendMode(t) {
    this.blend = t !== "none", this._blendMode = t, this._blendModeId = RT[t] || 0;
  }
  get polygonOffset() {
    return this._polygonOffset;
  }
  set polygonOffset(t) {
    this.offsets = !!t, this._polygonOffset = t;
  }
  static for2d() {
    const t = new Zv();
    return t.depthTest = false, t.blend = true, t;
  }
};
vo.default2d = vo.for2d();
let Tt = vo;
function Ve(r, t, e) {
  const s = (r >> 24 & 255) / 255;
  t[e++] = (r & 255) / 255 * s, t[e++] = (r >> 8 & 255) / 255 * s, t[e++] = (r >> 16 & 255) / 255 * s, t[e++] = s;
}
class fp {
  constructor() {
    this.batches = [], this.batched = false;
  }
  destroy() {
    this.batches.forEach((t) => {
      nt.return(t);
    }), this.batches.length = 0;
  }
}
class yo {
  constructor(t, e) {
    this.state = Tt.for2d(), this.renderer = t, this._adaptor = e, this.renderer.runners.contextChange.add(this);
  }
  contextChange() {
    this._adaptor.contextChange(this.renderer);
  }
  validateRenderable(t) {
    const e = t.context, s = !!t._gpuData, i = this.renderer.graphicsContext.updateGpuContext(e);
    return !!(i.isBatchable || s !== i.isBatchable);
  }
  addRenderable(t, e) {
    const s = this.renderer.graphicsContext.updateGpuContext(t.context);
    t.didViewUpdate && this._rebuild(t), s.isBatchable ? this._addToBatcher(t, e) : (this.renderer.renderPipes.batch.break(e), e.add(t));
  }
  updateRenderable(t) {
    const e = this._getGpuDataForRenderable(t).batches;
    for (let s = 0; s < e.length; s++) {
      const i = e[s];
      i._batcher.updateElement(i);
    }
  }
  execute(t) {
    if (!t.isRenderable) return;
    const e = this.renderer, s = t.context;
    if (!e.graphicsContext.getGpuContext(s).batches.length) return;
    const i = s.customShader || this._adaptor.shader;
    this.state.blendMode = t.groupBlendMode;
    const n = i.resources.localUniforms.uniforms;
    n.uTransformMatrix = t.groupTransform, n.uRound = e._roundPixels | t._roundPixels, Ve(t.groupColorAlpha, n.uColor, 0), this._adaptor.execute(this, t);
  }
  _rebuild(t) {
    const e = this._getGpuDataForRenderable(t), s = this.renderer.graphicsContext.updateGpuContext(t.context);
    e.destroy(), s.isBatchable && this._updateBatchesForRenderable(t, e);
  }
  _addToBatcher(t, e) {
    const s = this.renderer.renderPipes.batch, i = this._getGpuDataForRenderable(t).batches;
    for (let n = 0; n < i.length; n++) {
      const o = i[n];
      s.addToBatch(o, e);
    }
  }
  _getGpuDataForRenderable(t) {
    return t._gpuData[this.renderer.uid] || this._initGpuDataForRenderable(t);
  }
  _initGpuDataForRenderable(t) {
    const e = new fp();
    return t._gpuData[this.renderer.uid] = e, e;
  }
  _updateBatchesForRenderable(t, e) {
    const s = t.context, i = this.renderer.graphicsContext.getGpuContext(s), n = this.renderer._roundPixels | t._roundPixels;
    e.batches = i.batches.map((o) => {
      const a = nt.get(Hs);
      return o.copyTo(a), a.renderable = t, a.roundPixels = n, a;
    });
  }
  destroy() {
    this.renderer = null, this._adaptor.destroy(), this._adaptor = null, this.state = null;
  }
}
yo.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "graphics" }, G$1.add(yo), G$1.add(Ys);
class Ks {
  constructor() {
    this.batcherName = "default", this.packAsQuad = false, this.indexOffset = 0, this.attributeOffset = 0, this.roundPixels = 0, this._batcher = null, this._batch = null, this._textureMatrixUpdateId = -1, this._uvUpdateId = -1;
  }
  get blendMode() {
    return this.renderable.groupBlendMode;
  }
  get topology() {
    return this._topology || this.geometry.topology;
  }
  set topology(t) {
    this._topology = t;
  }
  reset() {
    this.renderable = null, this.texture = null, this._batcher = null, this._batch = null, this.geometry = null, this._uvUpdateId = -1, this._textureMatrixUpdateId = -1;
  }
  setTexture(t) {
    this.texture !== t && (this.texture = t, this._textureMatrixUpdateId = -1);
  }
  get uvs() {
    const t = this.geometry.getBuffer("aUV"), e = t.data;
    let s = e;
    const i = this.texture.textureMatrix;
    return i.isSimple || (s = this._transformedUvs, (this._textureMatrixUpdateId !== i._updateID || this._uvUpdateId !== t._updateID) && ((!s || s.length < e.length) && (s = this._transformedUvs = new Float32Array(e.length)), this._textureMatrixUpdateId = i._updateID, this._uvUpdateId = t._updateID, i.multiplyUvs(e, s))), s;
  }
  get positions() {
    return this.geometry.positions;
  }
  get indices() {
    return this.geometry.indices;
  }
  get color() {
    return this.renderable.groupColorAlpha;
  }
  get groupTransform() {
    return this.renderable.groupTransform;
  }
  get attributeSize() {
    return this.geometry.positions.length / 2;
  }
  get indexSize() {
    return this.geometry.indices.length;
  }
}
class To {
  destroy() {
  }
}
class So {
  constructor(t, e) {
    this.localUniforms = new et$1({ uTransformMatrix: { value: new R$1(), type: "mat3x3<f32>" }, uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" }, uRound: { value: 0, type: "f32" } }), this.localUniformsBindGroup = new Xt({ 0: this.localUniforms }), this.renderer = t, this._adaptor = e, this._adaptor.init();
  }
  validateRenderable(t) {
    const e = this._getMeshData(t), s = e.batched, i = t.batched;
    if (e.batched = i, s !== i) return true;
    if (i) {
      const n = t._geometry;
      if (n.indices.length !== e.indexSize || n.positions.length !== e.vertexSize) return e.indexSize = n.indices.length, e.vertexSize = n.positions.length, true;
      const o = this._getBatchableMesh(t);
      return o.texture.uid !== t._texture.uid && (o._textureMatrixUpdateId = -1), !o._batcher.checkAndUpdateTexture(o, t._texture);
    }
    return false;
  }
  addRenderable(t, e) {
    const s = this.renderer.renderPipes.batch, { batched: i } = this._getMeshData(t);
    if (i) {
      const n = this._getBatchableMesh(t);
      n.setTexture(t._texture), n.geometry = t._geometry, s.addToBatch(n, e);
    } else s.break(e), e.add(t);
  }
  updateRenderable(t) {
    if (t.batched) {
      const e = this._getBatchableMesh(t);
      e.setTexture(t._texture), e.geometry = t._geometry, e._batcher.updateElement(e);
    }
  }
  execute(t) {
    if (!t.isRenderable) return;
    t.state.blendMode = De(t.groupBlendMode, t.texture._source);
    const e = this.localUniforms;
    e.uniforms.uTransformMatrix = t.groupTransform, e.uniforms.uRound = this.renderer._roundPixels | t._roundPixels, e.update(), Ve(t.groupColorAlpha, e.uniforms.uColor, 0), this._adaptor.execute(this, t);
  }
  _getMeshData(t) {
    var e, s;
    return (e = t._gpuData)[s = this.renderer.uid] || (e[s] = new To()), t._gpuData[this.renderer.uid].meshData || this._initMeshData(t);
  }
  _initMeshData(t) {
    var e, s;
    return t._gpuData[this.renderer.uid].meshData = { batched: t.batched, indexSize: (e = t._geometry.indices) == null ? void 0 : e.length, vertexSize: (s = t._geometry.positions) == null ? void 0 : s.length }, t._gpuData[this.renderer.uid].meshData;
  }
  _getBatchableMesh(t) {
    var e, s;
    return (e = t._gpuData)[s = this.renderer.uid] || (e[s] = new To()), t._gpuData[this.renderer.uid].batchableMesh || this._initBatchableMesh(t);
  }
  _initBatchableMesh(t) {
    const e = new Ks();
    return e.renderable = t, e.setTexture(t._texture), e.transform = t.groupTransform, e.roundPixels = this.renderer._roundPixels | t._roundPixels, t._gpuData[this.renderer.uid].batchableMesh = e, e;
  }
  destroy() {
    this.localUniforms = null, this.localUniformsBindGroup = null, this._adaptor.destroy(), this._adaptor = null, this.renderer = null;
  }
}
So.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "mesh" }, G$1.add(So);
class mp {
  execute(t, e) {
    const s = t.state, i = t.renderer, n = e.shader || t.defaultShader;
    n.resources.uTexture = e.texture._source, n.resources.uniforms = t.localUniforms;
    const o = i.gl, a = t.getBuffers(e);
    i.shader.bind(n), i.state.set(s), i.geometry.bind(a.geometry, n.glProgram);
    const l3 = a.geometry.indexBuffer.data.BYTES_PER_ELEMENT === 2 ? o.UNSIGNED_SHORT : o.UNSIGNED_INT;
    o.drawElements(o.TRIANGLES, e.particleChildren.length * 6, l3, 0);
  }
}
function Eo(r, t = null) {
  const e = r * 6;
  if (e > 65535 ? t || (t = new Uint32Array(e)) : t || (t = new Uint16Array(e)), t.length !== e) throw new Error(`Out buffer length is incorrect, got ${t.length} and expected ${e}`);
  for (let s = 0, i = 0; s < e; s += 6, i += 4) t[s + 0] = i + 0, t[s + 1] = i + 1, t[s + 2] = i + 2, t[s + 3] = i + 0, t[s + 4] = i + 2, t[s + 5] = i + 3;
  return t;
}
function gp(r) {
  return { dynamicUpdate: _p(r, true), staticUpdate: _p(r, false) };
}
function _p(r, t) {
  const e = [];
  e.push(`

var index = 0;

for (let i = 0; i < ps.length; ++i)
{
const p = ps[i];

`);
  let s = 0;
  for (const n in r) {
    const o = r[n];
    if (t !== o.dynamic) continue;
    e.push(`offset = index + ${s}`), e.push(o.code);
    const a = Zt(o.format);
    s += a.stride / 4;
  }
  e.push(`
index += stride * 4;
}
`), e.unshift(`
var stride = ${s};
`);
  const i = e.join(`
`);
  return new Function("ps", "f32v", "u32v", i);
}
class xp {
  constructor(t) {
    this._size = 0, this._generateParticleUpdateCache = {};
    var e;
    const s = this._size = (e = t.size) != null ? e : 1e3, i = t.properties;
    let n = 0, o = 0;
    for (const h in i) {
      const d = i[h], p = Zt(d.format);
      d.dynamic ? o += p.stride : n += p.stride;
    }
    this._dynamicStride = o / 4, this._staticStride = n / 4, this.staticAttributeBuffer = new ve(s * 4 * n), this.dynamicAttributeBuffer = new ve(s * 4 * o), this.indexBuffer = Eo(s);
    const a = new ye();
    let l3 = 0, u3 = 0;
    this._staticBuffer = new ft({ data: new Float32Array(1), label: "static-particle-buffer", shrinkToFit: false, usage: N$1.VERTEX | N$1.COPY_DST }), this._dynamicBuffer = new ft({ data: new Float32Array(1), label: "dynamic-particle-buffer", shrinkToFit: false, usage: N$1.VERTEX | N$1.COPY_DST });
    for (const h in i) {
      const d = i[h], p = Zt(d.format);
      d.dynamic ? (a.addAttribute(d.attributeName, { buffer: this._dynamicBuffer, stride: this._dynamicStride * 4, offset: l3 * 4, format: d.format }), l3 += p.size) : (a.addAttribute(d.attributeName, { buffer: this._staticBuffer, stride: this._staticStride * 4, offset: u3 * 4, format: d.format }), u3 += p.size);
    }
    a.addIndex(this.indexBuffer);
    const c = this.getParticleUpdate(i);
    this._dynamicUpload = c.dynamicUpdate, this._staticUpload = c.staticUpdate, this.geometry = a;
  }
  getParticleUpdate(t) {
    const e = CT(t);
    return this._generateParticleUpdateCache[e] ? this._generateParticleUpdateCache[e] : (this._generateParticleUpdateCache[e] = this.generateParticleUpdate(t), this._generateParticleUpdateCache[e]);
  }
  generateParticleUpdate(t) {
    return gp(t);
  }
  update(t, e) {
    t.length > this._size && (e = true, this._size = Math.max(t.length, this._size * 1.5 | 0), this.staticAttributeBuffer = new ve(this._size * this._staticStride * 4 * 4), this.dynamicAttributeBuffer = new ve(this._size * this._dynamicStride * 4 * 4), this.indexBuffer = Eo(this._size), this.geometry.indexBuffer.setDataWithSize(this.indexBuffer, this.indexBuffer.byteLength, true));
    const s = this.dynamicAttributeBuffer;
    if (this._dynamicUpload(t, s.float32View, s.uint32View), this._dynamicBuffer.setDataWithSize(this.dynamicAttributeBuffer.float32View, t.length * this._dynamicStride * 4, true), e) {
      const i = this.staticAttributeBuffer;
      this._staticUpload(t, i.float32View, i.uint32View), this._staticBuffer.setDataWithSize(i.float32View, t.length * this._staticStride * 4, true);
    }
  }
  destroy() {
    this._staticBuffer.destroy(), this._dynamicBuffer.destroy(), this.geometry.destroy();
  }
}
function CT(r) {
  const t = [];
  for (const e in r) {
    const s = r[e];
    t.push(e, s.code, s.dynamic ? "d" : "s");
  }
  return t.join("_");
}
var bp = `varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
vec4 color = texture2D(uTexture, vUV) * vColor;
gl_FragColor = color;
}`, vp = `attribute vec2 aVertex;
attribute vec2 aUV;
attribute vec4 aColor;

attribute vec2 aPosition;
attribute float aRotation;

uniform mat3 uTranslationMatrix;
uniform float uRound;
uniform vec2 uResolution;
uniform vec4 uColor;

varying vec2 vUV;
varying vec4 vColor;

vec2 roundPixels(vec2 position, vec2 targetSize)
{       
return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

void main(void){
float cosRotation = cos(aRotation);
float sinRotation = sin(aRotation);
float x = aVertex.x * cosRotation - aVertex.y * sinRotation;
float y = aVertex.x * sinRotation + aVertex.y * cosRotation;

vec2 v = vec2(x, y);
v = v + aPosition;

gl_Position = vec4((uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

if(uRound == 1.0)
{
gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
}

vUV = aUV;
vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uColor;
}
`, Ao = `
struct ParticleUniforms {
uProjectionMatrix:mat3x3<f32>,
uColor:vec4<f32>,
uResolution:vec2<f32>,
uRoundPixels:f32,
};

@group(0) @binding(0) var<uniform> uniforms: ParticleUniforms;

@group(1) @binding(0) var uTexture: texture_2d<f32>;
@group(1) @binding(1) var uSampler : sampler;

struct VSOutput {
@builtin(position) position: vec4<f32>,
@location(0) uv : vec2<f32>,
@location(1) color : vec4<f32>,
};
@vertex
fn mainVertex(
@location(0) aVertex: vec2<f32>,
@location(1) aPosition: vec2<f32>,
@location(2) aUV: vec2<f32>,
@location(3) aColor: vec4<f32>,
@location(4) aRotation: f32,
) -> VSOutput {

let v = vec2(
aVertex.x * cos(aRotation) - aVertex.y * sin(aRotation),
aVertex.x * sin(aRotation) + aVertex.y * cos(aRotation)
) + aPosition;

let position = vec4((uniforms.uProjectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

let vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uniforms.uColor;

return VSOutput(
position,
aUV,
vColor,
);
}

@fragment
fn mainFragment(
@location(0) uv: vec2<f32>,
@location(1) color: vec4<f32>,
@builtin(position) position: vec4<f32>,
) -> @location(0) vec4<f32> {

var sample = textureSample(uTexture, uSampler, uv) * color;

return sample;
}`;
class yp extends At$1 {
  constructor() {
    const t = yt$1.from({ vertex: vp, fragment: bp }), e = bt$1.from({ fragment: { source: Ao, entryPoint: "mainFragment" }, vertex: { source: Ao, entryPoint: "mainVertex" } });
    super({ glProgram: t, gpuProgram: e, resources: { uTexture: A$1.WHITE.source, uSampler: new Pt$1({}), uniforms: { uTranslationMatrix: { value: new R$1(), type: "mat3x3<f32>" }, uColor: { value: new X(16777215), type: "vec4<f32>" }, uRound: { value: 1, type: "f32" }, uResolution: { value: [0, 0], type: "vec2<f32>" } } } });
  }
}
class wo {
  constructor(t, e) {
    this.state = Tt.for2d(), this.localUniforms = new et$1({ uTranslationMatrix: { value: new R$1(), type: "mat3x3<f32>" }, uColor: { value: new Float32Array(4), type: "vec4<f32>" }, uRound: { value: 1, type: "f32" }, uResolution: { value: [0, 0], type: "vec2<f32>" } }), this.renderer = t, this.adaptor = e, this.defaultShader = new yp(), this.state = Tt.for2d();
  }
  validateRenderable(t) {
    return false;
  }
  addRenderable(t, e) {
    this.renderer.renderPipes.batch.break(e), e.add(t);
  }
  getBuffers(t) {
    return t._gpuData[this.renderer.uid] || this._initBuffer(t);
  }
  _initBuffer(t) {
    return t._gpuData[this.renderer.uid] = new xp({ size: t.particleChildren.length, properties: t._properties }), t._gpuData[this.renderer.uid];
  }
  updateRenderable(t) {
  }
  execute(t) {
    const e = t.particleChildren;
    if (e.length === 0) return;
    const s = this.renderer, i = this.getBuffers(t);
    t.texture || (t.texture = e[0].texture);
    const n = this.state;
    i.update(e, t._childrenDirty), t._childrenDirty = false, n.blendMode = De(t.blendMode, t.texture._source);
    const o = this.localUniforms.uniforms, a = o.uTranslationMatrix;
    t.worldTransform.copyTo(a), a.prepend(s.globalUniforms.globalUniformData.projectionMatrix), o.uResolution = s.globalUniforms.globalUniformData.resolution, o.uRound = s._roundPixels | t._roundPixels, Ve(t.groupColorAlpha, o.uColor, 0), this.adaptor.execute(this, t);
  }
  destroy() {
    this.defaultShader && (this.defaultShader.destroy(), this.defaultShader = null);
  }
}
class Po extends wo {
  constructor(t) {
    super(t, new mp());
  }
}
Po.extension = { type: [x$1.WebGLPipes], name: "particle" };
class Tp {
  execute(t, e) {
    const s = t.renderer, i = e.shader || t.defaultShader;
    i.groups[0] = s.renderPipes.uniformBatch.getUniformBindGroup(t.localUniforms, true), i.groups[1] = s.texture.getTextureBindGroup(e.texture);
    const n = t.state, o = t.getBuffers(e);
    s.encoder.draw({ geometry: o.geometry, shader: e.shader || t.defaultShader, state: n, size: e.particleChildren.length * 6 });
  }
}
class Ro extends wo {
  constructor(t) {
    super(t, new Tp());
  }
}
Ro.extension = { type: [x$1.WebGPUPipes], name: "particle" }, G$1.add(Po), G$1.add(Ro);
function qs(r, t) {
  const { texture: e, bounds: s } = r;
  Gn(s, t._anchor, e);
  const i = t._style._getFinalPadding();
  s.minX -= i, s.minY -= i, s.maxX -= i, s.maxY -= i;
}
class Gr {
  constructor() {
    this.batcherName = "default", this.topology = "triangle-list", this.attributeSize = 4, this.indexSize = 6, this.packAsQuad = true, this.roundPixels = 0, this._attributeStart = 0, this._batcher = null, this._batch = null;
  }
  get blendMode() {
    return this.renderable.groupBlendMode;
  }
  get color() {
    return this.renderable.groupColorAlpha;
  }
  reset() {
    this.renderable = null, this.texture = null, this._batcher = null, this._batch = null, this.bounds = null;
  }
  destroy() {
  }
}
class Sp extends Gr {
  constructor(t) {
    super(), this._renderer = t, t.runners.resolutionChange.add(this);
  }
  resolutionChange() {
    const t = this.renderable;
    t._autoResolution && t.onViewUpdate();
  }
  destroy() {
    this._renderer.canvasText.returnTexture(this.texture), this._renderer = null;
  }
}
class Mo {
  constructor(t) {
    this._renderer = t;
  }
  validateRenderable(t) {
    return t._didTextUpdate;
  }
  addRenderable(t, e) {
    const s = this._getGpuText(t);
    t._didTextUpdate && (this._updateGpuText(t), t._didTextUpdate = false), this._renderer.renderPipes.batch.addToBatch(s, e);
  }
  updateRenderable(t) {
    const e = this._getGpuText(t);
    e._batcher.updateElement(e);
  }
  _updateGpuText(t) {
    const e = this._getGpuText(t);
    e.texture && this._renderer.canvasText.returnTexture(e.texture), t._resolution = t._autoResolution ? this._renderer.resolution : t.resolution, e.texture = e.texture = this._renderer.canvasText.getTexture(t), qs(e, t);
  }
  _getGpuText(t) {
    return t._gpuData[this._renderer.uid] || this.initGpuText(t);
  }
  initGpuText(t) {
    const e = new Sp(this._renderer);
    return e.renderable = t, e.transform = t.groupTransform, e.bounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, e.roundPixels = this._renderer._roundPixels | t._roundPixels, t._gpuData[this._renderer.uid] = e, e;
  }
  destroy() {
    this._renderer = null;
  }
}
Mo.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "text" };
const Ep = { repeat: { addressModeU: "repeat", addressModeV: "repeat" }, "repeat-x": { addressModeU: "repeat", addressModeV: "clamp-to-edge" }, "repeat-y": { addressModeU: "clamp-to-edge", addressModeV: "repeat" }, "no-repeat": { addressModeU: "clamp-to-edge", addressModeV: "clamp-to-edge" } };
class Ir {
  constructor(t, e) {
    this.uid = Y("fillPattern"), this.transform = new R$1(), this._styleKey = null, this.texture = t, this.transform.scale(1 / t.frame.width, 1 / t.frame.height), e && (t.source.style.addressModeU = Ep[e].addressModeU, t.source.style.addressModeV = Ep[e].addressModeV);
  }
  setTransform(t) {
    const e = this.texture;
    this.transform.copyFrom(t), this.transform.invert(), this.transform.scale(1 / e.frame.width, 1 / e.frame.height), this._styleKey = null;
  }
  get styleKey() {
    return this._styleKey ? this._styleKey : (this._styleKey = `fill-pattern-${this.uid}-${this.texture.uid}-${this.transform.toArray().join("-")}`, this._styleKey);
  }
}
var OT = IT, Co = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }, GT = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
function IT(r) {
  var t = [];
  return r.replace(GT, function(e, s, i) {
    var n = s.toLowerCase();
    for (i = FT(i), n == "m" && i.length > 2 && (t.push([s].concat(i.splice(0, 2))), n = "l", s = s == "m" ? "l" : "L"); ; ) {
      if (i.length == Co[n]) return i.unshift(s), t.push(i);
      if (i.length < Co[n]) throw new Error("malformed path data");
      t.push([s].concat(i.splice(0, Co[n])));
    }
  }), t;
}
var BT = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
function FT(r) {
  var t = r.match(BT);
  return t ? t.map(Number) : [];
}
var DT = Uu(OT);
function Ap(r, t) {
  const e = DT(r), s = [];
  let i = null, n = 0, o = 0;
  for (let a = 0; a < e.length; a++) {
    const l3 = e[a], u3 = l3[0], c = l3;
    switch (u3) {
      case "M":
        n = c[1], o = c[2], t.moveTo(n, o);
        break;
      case "m":
        n += c[1], o += c[2], t.moveTo(n, o);
        break;
      case "H":
        n = c[1], t.lineTo(n, o);
        break;
      case "h":
        n += c[1], t.lineTo(n, o);
        break;
      case "V":
        o = c[1], t.lineTo(n, o);
        break;
      case "v":
        o += c[1], t.lineTo(n, o);
        break;
      case "L":
        n = c[1], o = c[2], t.lineTo(n, o);
        break;
      case "l":
        n += c[1], o += c[2], t.lineTo(n, o);
        break;
      case "C":
        n = c[5], o = c[6], t.bezierCurveTo(c[1], c[2], c[3], c[4], n, o);
        break;
      case "c":
        t.bezierCurveTo(n + c[1], o + c[2], n + c[3], o + c[4], n + c[5], o + c[6]), n += c[5], o += c[6];
        break;
      case "S":
        n = c[3], o = c[4], t.bezierCurveToShort(c[1], c[2], n, o);
        break;
      case "s":
        t.bezierCurveToShort(n + c[1], o + c[2], n + c[3], o + c[4]), n += c[3], o += c[4];
        break;
      case "Q":
        n = c[3], o = c[4], t.quadraticCurveTo(c[1], c[2], n, o);
        break;
      case "q":
        t.quadraticCurveTo(n + c[1], o + c[2], n + c[3], o + c[4]), n += c[3], o += c[4];
        break;
      case "T":
        n = c[1], o = c[2], t.quadraticCurveToShort(n, o);
        break;
      case "t":
        n += c[1], o += c[2], t.quadraticCurveToShort(n, o);
        break;
      case "A":
        n = c[6], o = c[7], t.arcToSvg(c[1], c[2], c[3], c[4], c[5], n, o);
        break;
      case "a":
        n += c[6], o += c[7], t.arcToSvg(c[1], c[2], c[3], c[4], c[5], n, o);
        break;
      case "Z":
      case "z":
        t.closePath(), s.length > 0 && (i = s.pop(), i ? (n = i.startX, o = i.startY) : (n = 0, o = 0)), i = null;
        break;
    }
    u3 !== "Z" && u3 !== "z" && i === null && (i = { startX: n, startY: o }, s.push(i));
  }
  return t;
}
class Ji {
  constructor(t = 0, e = 0, s = 0) {
    this.type = "circle", this.x = t, this.y = e, this.radius = s;
  }
  clone() {
    return new Ji(this.x, this.y, this.radius);
  }
  contains(t, e) {
    if (this.radius <= 0) return false;
    const s = this.radius * this.radius;
    let i = this.x - t, n = this.y - e;
    return i *= i, n *= n, i + n <= s;
  }
  strokeContains(t, e, s, i = 0.5) {
    if (this.radius === 0) return false;
    const n = this.x - t, o = this.y - e, a = this.radius, l3 = (1 - i) * s, u3 = Math.sqrt(n * n + o * o);
    return u3 <= a + l3 && u3 > a - (s - l3);
  }
  getBounds(t) {
    return t || (t = new j$1()), t.x = this.x - this.radius, t.y = this.y - this.radius, t.width = this.radius * 2, t.height = this.radius * 2, t;
  }
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.radius = t.radius, this;
  }
  copyTo(t) {
    return t.copyFrom(this), t;
  }
}
class tn {
  constructor(t = 0, e = 0, s = 0, i = 0) {
    this.type = "ellipse", this.x = t, this.y = e, this.halfWidth = s, this.halfHeight = i;
  }
  clone() {
    return new tn(this.x, this.y, this.halfWidth, this.halfHeight);
  }
  contains(t, e) {
    if (this.halfWidth <= 0 || this.halfHeight <= 0) return false;
    let s = (t - this.x) / this.halfWidth, i = (e - this.y) / this.halfHeight;
    return s *= s, i *= i, s + i <= 1;
  }
  strokeContains(t, e, s, i = 0.5) {
    const { halfWidth: n, halfHeight: o } = this;
    if (n <= 0 || o <= 0) return false;
    const a = s * (1 - i), l3 = s - a, u3 = n - l3, c = o - l3, h = n + a, d = o + a, p = t - this.x, f2 = e - this.y, g = p * p / (u3 * u3) + f2 * f2 / (c * c), m3 = p * p / (h * h) + f2 * f2 / (d * d);
    return g > 1 && m3 <= 1;
  }
  getBounds(t) {
    return t || (t = new j$1()), t.x = this.x - this.halfWidth, t.y = this.y - this.halfHeight, t.width = this.halfWidth * 2, t.height = this.halfHeight * 2, t;
  }
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.halfWidth = t.halfWidth, this.halfHeight = t.halfHeight, this;
  }
  copyTo(t) {
    return t.copyFrom(this), t;
  }
}
function Br(r, t, e, s, i, n) {
  const o = r - e, a = t - s, l3 = i - e, u3 = n - s, c = o * l3 + a * u3, h = l3 * l3 + u3 * u3;
  let d = -1;
  h !== 0 && (d = c / h);
  let p, f2;
  d < 0 ? (p = e, f2 = s) : d > 1 ? (p = i, f2 = n) : (p = e + d * l3, f2 = s + d * u3);
  const g = r - p, m3 = t - f2;
  return g * g + m3 * m3;
}
let UT, kT;
class ar {
  constructor(...t) {
    this.type = "polygon";
    let e = Array.isArray(t[0]) ? t[0] : t;
    if (typeof e[0] != "number") {
      const s = [];
      for (let i = 0, n = e.length; i < n; i++) s.push(e[i].x, e[i].y);
      e = s;
    }
    this.points = e, this.closePath = true;
  }
  isClockwise() {
    let t = 0;
    const e = this.points, s = e.length;
    for (let i = 0; i < s; i += 2) {
      const n = e[i], o = e[i + 1], a = e[(i + 2) % s], l3 = e[(i + 3) % s];
      t += (a - n) * (l3 + o);
    }
    return t < 0;
  }
  containsPolygon(t) {
    const e = this.getBounds(UT), s = t.getBounds(kT);
    if (!e.containsRect(s)) return false;
    const i = t.points;
    for (let n = 0; n < i.length; n += 2) {
      const o = i[n], a = i[n + 1];
      if (!this.contains(o, a)) return false;
    }
    return true;
  }
  clone() {
    const t = this.points.slice(), e = new ar(t);
    return e.closePath = this.closePath, e;
  }
  contains(t, e) {
    let s = false;
    const i = this.points.length / 2;
    for (let n = 0, o = i - 1; n < i; o = n++) {
      const a = this.points[n * 2], l3 = this.points[n * 2 + 1], u3 = this.points[o * 2], c = this.points[o * 2 + 1];
      l3 > e != c > e && t < (u3 - a) * ((e - l3) / (c - l3)) + a && (s = !s);
    }
    return s;
  }
  strokeContains(t, e, s, i = 0.5) {
    const n = s * s, o = n * (1 - i), a = n - o, { points: l3 } = this, u3 = l3.length - (this.closePath ? 0 : 2);
    for (let c = 0; c < u3; c += 2) {
      const h = l3[c], d = l3[c + 1], p = l3[(c + 2) % l3.length], f2 = l3[(c + 3) % l3.length], g = Br(t, e, h, d, p, f2), m3 = Math.sign((p - h) * (e - d) - (f2 - d) * (t - h));
      if (g <= (m3 < 0 ? a : o)) return true;
    }
    return false;
  }
  getBounds(t) {
    t || (t = new j$1());
    const e = this.points;
    let s = 1 / 0, i = -1 / 0, n = 1 / 0, o = -1 / 0;
    for (let a = 0, l3 = e.length; a < l3; a += 2) {
      const u3 = e[a], c = e[a + 1];
      s = u3 < s ? u3 : s, i = u3 > i ? u3 : i, n = c < n ? c : n, o = c > o ? c : o;
    }
    return t.x = s, t.width = i - s, t.y = n, t.height = o - n, t;
  }
  copyFrom(t) {
    return this.points = t.points.slice(), this.closePath = t.closePath, this;
  }
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  get lastX() {
    return this.points[this.points.length - 2];
  }
  get lastY() {
    return this.points[this.points.length - 1];
  }
  get x() {
    return this.points[this.points.length - 2];
  }
  get y() {
    return this.points[this.points.length - 1];
  }
}
const Zs = (r, t, e, s, i, n, o) => {
  const a = r - e, l3 = t - s, u3 = Math.sqrt(a * a + l3 * l3);
  return u3 >= i - n && u3 <= i + o;
};
class en {
  constructor(t = 0, e = 0, s = 0, i = 0, n = 20) {
    this.type = "roundedRectangle", this.x = t, this.y = e, this.width = s, this.height = i, this.radius = n;
  }
  getBounds(t) {
    return t || (t = new j$1()), t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t;
  }
  clone() {
    return new en(this.x, this.y, this.width, this.height, this.radius);
  }
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  contains(t, e) {
    if (this.width <= 0 || this.height <= 0) return false;
    if (t >= this.x && t <= this.x + this.width && e >= this.y && e <= this.y + this.height) {
      const s = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
      if (e >= this.y + s && e <= this.y + this.height - s || t >= this.x + s && t <= this.x + this.width - s) return true;
      let i = t - (this.x + s), n = e - (this.y + s);
      const o = s * s;
      if (i * i + n * n <= o || (i = t - (this.x + this.width - s), i * i + n * n <= o) || (n = e - (this.y + this.height - s), i * i + n * n <= o) || (i = t - (this.x + s), i * i + n * n <= o)) return true;
    }
    return false;
  }
  strokeContains(t, e, s, i = 0.5) {
    const { x: n, y: o, width: a, height: l3, radius: u3 } = this, c = s * (1 - i), h = s - c, d = n + u3, p = o + u3, f2 = a - u3 * 2, g = l3 - u3 * 2, m3 = n + a, _ = o + l3;
    return (t >= n - c && t <= n + h || t >= m3 - h && t <= m3 + c) && e >= p && e <= p + g || (e >= o - c && e <= o + h || e >= _ - h && e <= _ + c) && t >= d && t <= d + f2 ? true : t < d && e < p && Zs(t, e, d, p, u3, h, c) || t > m3 - u3 && e < p && Zs(t, e, m3 - u3, p, u3, h, c) || t > m3 - u3 && e > _ - u3 && Zs(t, e, m3 - u3, _ - u3, u3, h, c) || t < d && e > _ - u3 && Zs(t, e, d, _ - u3, u3, h, c);
  }
}
const $T = 8, Qs = 11920929e-14, LT = 1;
function Go(r, t, e, s, i, n, o, a, l3, u3) {
  const c = Math.min(0.99, Math.max(0, u3 != null ? u3 : Ys.defaultOptions.bezierSmoothness));
  let h = (LT - c) / 1;
  return h *= h, NT(t, e, s, i, n, o, a, l3, r, h), r;
}
function NT(r, t, e, s, i, n, o, a, l3, u3) {
  Io(r, t, e, s, i, n, o, a, l3, u3, 0), l3.push(o, a);
}
function Io(r, t, e, s, i, n, o, a, l3, u3, c) {
  if (c > $T) return;
  const d = (r + e) / 2, p = (t + s) / 2, f2 = (e + i) / 2, g = (s + n) / 2, m3 = (i + o) / 2, _ = (n + a) / 2, b = (d + f2) / 2, v4 = (p + g) / 2, y4 = (f2 + m3) / 2, S3 = (g + _) / 2, T4 = (b + y4) / 2, E4 = (v4 + S3) / 2;
  if (c > 0) {
    let O3 = o - r, C3 = a - t;
    const w = Math.abs((e - o) * C3 - (s - a) * O3), P = Math.abs((i - o) * C3 - (n - a) * O3);
    if (w > Qs && P > Qs) {
      if ((w + P) * (w + P) <= u3 * (O3 * O3 + C3 * C3)) {
        {
          l3.push(T4, E4);
          return;
        }
      }
    } else if (w > Qs) {
      if (w * w <= u3 * (O3 * O3 + C3 * C3)) {
        {
          l3.push(T4, E4);
          return;
        }
      }
    } else if (P > Qs) {
      if (P * P <= u3 * (O3 * O3 + C3 * C3)) {
        {
          l3.push(T4, E4);
          return;
        }
      }
    } else if (O3 = T4 - (r + o) / 2, C3 = E4 - (t + a) / 2, O3 * O3 + C3 * C3 <= u3) {
      l3.push(T4, E4);
      return;
    }
  }
  Io(r, t, d, p, b, v4, T4, E4, l3, u3, c + 1), Io(T4, E4, y4, S3, m3, _, o, a, l3, u3, c + 1);
}
const XT = 8, HT = 11920929e-14, jT = 1;
function Pp(r, t, e, s, i, n, o, a) {
  const l3 = Math.min(0.99, Math.max(0, a != null ? a : Ys.defaultOptions.bezierSmoothness));
  let u3 = (jT - l3) / 1;
  return u3 *= u3, VT(t, e, s, i, n, o, r, u3), r;
}
function VT(r, t, e, s, i, n, o, a) {
  Bo(o, r, t, e, s, i, n, a, 0), o.push(i, n);
}
function Bo(r, t, e, s, i, n, o, a, l3) {
  if (l3 > XT) return;
  const c = (t + s) / 2, h = (e + i) / 2, d = (s + n) / 2, p = (i + o) / 2, f2 = (c + d) / 2, g = (h + p) / 2;
  let m3 = n - t, _ = o - e;
  const b = Math.abs((s - n) * _ - (i - o) * m3);
  if (b > HT) {
    if (b * b <= a * (m3 * m3 + _ * _)) {
      {
        r.push(f2, g);
        return;
      }
    }
  } else if (m3 = f2 - (t + n) / 2, _ = g - (e + o) / 2, m3 * m3 + _ * _ <= a) {
    r.push(f2, g);
    return;
  }
  Bo(r, t, e, c, h, f2, g, a, l3 + 1), Bo(r, f2, g, d, p, n, o, a, l3 + 1);
}
function Fo(r, t, e, s, i, n, o, a) {
  let l3 = Math.abs(i - n);
  (!o && i > n || o && n > i) && (l3 = 2 * Math.PI - l3), a || (a = Math.max(6, Math.floor(6 * Math.pow(s, 1 / 3) * (l3 / Math.PI)))), a = Math.max(a, 3);
  let u3 = l3 / a, c = i;
  u3 *= o ? -1 : 1;
  for (let h = 0; h < a + 1; h++) {
    const d = Math.cos(c), p = Math.sin(c), f2 = t + d * s, g = e + p * s;
    r.push(f2, g), c += u3;
  }
}
function Rp(r, t, e, s, i, n) {
  const o = r[r.length - 2], a = r[r.length - 1] - e, l3 = o - t, u3 = i - e, c = s - t, h = Math.abs(a * c - l3 * u3);
  if (h < 1e-8 || n === 0) {
    (r[r.length - 2] !== t || r[r.length - 1] !== e) && r.push(t, e);
    return;
  }
  const d = a * a + l3 * l3, p = u3 * u3 + c * c, f2 = a * u3 + l3 * c, g = n * Math.sqrt(d) / h, m3 = n * Math.sqrt(p) / h, _ = g * f2 / d, b = m3 * f2 / p, v4 = g * c + m3 * l3, y4 = g * u3 + m3 * a, S3 = l3 * (m3 + _), T4 = a * (m3 + _), E4 = c * (g + b), O3 = u3 * (g + b), C3 = Math.atan2(T4 - y4, S3 - v4), w = Math.atan2(O3 - y4, E4 - v4);
  Fo(r, v4 + t, y4 + e, n, C3, w, l3 * u3 > c * a);
}
const Fr = Math.PI * 2, Do = { centerX: 0, centerY: 0, ang1: 0, ang2: 0 }, Uo = ({ x: r, y: t }, e, s, i, n, o, a, l3) => {
  r *= e, t *= s;
  const u3 = i * r - n * t, c = n * r + i * t;
  return l3.x = u3 + o, l3.y = c + a, l3;
};
function WT(r, t) {
  const e = t === -1.5707963267948966 ? -0.551915024494 : 1.3333333333333333 * Math.tan(t / 4), s = t === 1.5707963267948966 ? 0.551915024494 : e, i = Math.cos(r), n = Math.sin(r), o = Math.cos(r + t), a = Math.sin(r + t);
  return [{ x: i - n * s, y: n + i * s }, { x: o + a * s, y: a - o * s }, { x: o, y: a }];
}
const Mp = (r, t, e, s) => {
  const i = r * s - t * e < 0 ? -1 : 1;
  let n = r * e + t * s;
  return n > 1 && (n = 1), n < -1 && (n = -1), i * Math.acos(n);
}, YT = (r, t, e, s, i, n, o, a, l3, u3, c, h, d) => {
  const p = Math.pow(i, 2), f2 = Math.pow(n, 2), g = Math.pow(c, 2), m3 = Math.pow(h, 2);
  let _ = p * f2 - p * m3 - f2 * g;
  _ < 0 && (_ = 0), _ /= p * m3 + f2 * g, _ = Math.sqrt(_) * (o === a ? -1 : 1);
  const b = _ * i / n * h, v4 = _ * -n / i * c, y4 = u3 * b - l3 * v4 + (r + e) / 2, S3 = l3 * b + u3 * v4 + (t + s) / 2, T4 = (c - b) / i, E4 = (h - v4) / n, O3 = (-c - b) / i, C3 = (-h - v4) / n, w = Mp(1, 0, T4, E4);
  let P = Mp(T4, E4, O3, C3);
  a === 0 && P > 0 && (P -= Fr), a === 1 && P < 0 && (P += Fr), d.centerX = y4, d.centerY = S3, d.ang1 = w, d.ang2 = P;
};
function Cp(r, t, e, s, i, n, o, a = 0, l3 = 0, u3 = 0) {
  if (n === 0 || o === 0) return;
  const c = Math.sin(a * Fr / 360), h = Math.cos(a * Fr / 360), d = h * (t - s) / 2 + c * (e - i) / 2, p = -c * (t - s) / 2 + h * (e - i) / 2;
  if (d === 0 && p === 0) return;
  n = Math.abs(n), o = Math.abs(o);
  const f2 = Math.pow(d, 2) / Math.pow(n, 2) + Math.pow(p, 2) / Math.pow(o, 2);
  f2 > 1 && (n *= Math.sqrt(f2), o *= Math.sqrt(f2)), YT(t, e, s, i, n, o, l3, u3, c, h, d, p, Do);
  let { ang1: g, ang2: m3 } = Do;
  const { centerX: _, centerY: b } = Do;
  let v4 = Math.abs(m3) / (Fr / 4);
  Math.abs(1 - v4) < 1e-7 && (v4 = 1);
  const y4 = Math.max(Math.ceil(v4), 1);
  m3 /= y4;
  let S3 = r[r.length - 2], T4 = r[r.length - 1];
  const E4 = { x: 0, y: 0 };
  for (let O3 = 0; O3 < y4; O3++) {
    const C3 = WT(g, m3), { x: w, y: P } = Uo(C3[0], n, o, h, c, _, b, E4), { x: B3, y: U3 } = Uo(C3[1], n, o, h, c, _, b, E4), { x: k3, y: Vt2 } = Uo(C3[2], n, o, h, c, _, b, E4);
    Go(r, S3, T4, w, P, B3, U3, k3, Vt2), S3 = k3, T4 = Vt2, g += m3;
  }
}
function Op(r, t, e) {
  var s;
  const i = (a, l3) => {
    const u3 = l3.x - a.x, c = l3.y - a.y, h = Math.sqrt(u3 * u3 + c * c), d = u3 / h, p = c / h;
    return { len: h, nx: d, ny: p };
  }, n = (a, l3) => {
    a === 0 ? r.moveTo(l3.x, l3.y) : r.lineTo(l3.x, l3.y);
  };
  let o = t[t.length - 1];
  for (let a = 0; a < t.length; a++) {
    const l3 = t[a % t.length], u3 = (s = l3.radius) != null ? s : e;
    if (u3 <= 0) {
      n(a, l3), o = l3;
      continue;
    }
    const c = t[(a + 1) % t.length], h = i(l3, o), d = i(l3, c);
    if (h.len < 1e-4 || d.len < 1e-4) {
      n(a, l3), o = l3;
      continue;
    }
    let p = Math.asin(h.nx * d.ny - h.ny * d.nx), f2 = 1, g = false;
    h.nx * d.nx - h.ny * -d.ny < 0 ? p < 0 ? p = Math.PI + p : (p = Math.PI - p, f2 = -1, g = true) : p > 0 && (f2 = -1, g = true);
    const m3 = p / 2;
    let _, b = Math.abs(Math.cos(m3) * u3 / Math.sin(m3));
    b > Math.min(h.len / 2, d.len / 2) ? (b = Math.min(h.len / 2, d.len / 2), _ = Math.abs(b * Math.sin(m3) / Math.cos(m3))) : _ = u3;
    const v4 = l3.x + d.nx * b + -d.ny * _ * f2, y4 = l3.y + d.ny * b + d.nx * _ * f2, S3 = Math.atan2(h.ny, h.nx) + Math.PI / 2 * f2, T4 = Math.atan2(d.ny, d.nx) - Math.PI / 2 * f2;
    a === 0 && r.moveTo(v4 + Math.cos(S3) * _, y4 + Math.sin(S3) * _), r.arc(v4, y4, _, S3, T4, g), o = l3;
  }
}
function Gp(r, t, e, s) {
  var i;
  const n = (l3, u3) => Math.sqrt((l3.x - u3.x) ** 2 + (l3.y - u3.y) ** 2), o = (l3, u3, c) => ({ x: l3.x + (u3.x - l3.x) * c, y: l3.y + (u3.y - l3.y) * c }), a = t.length;
  for (let l3 = 0; l3 < a; l3++) {
    const u3 = t[(l3 + 1) % a], c = (i = u3.radius) != null ? i : e;
    if (c <= 0) {
      l3 === 0 ? r.moveTo(u3.x, u3.y) : r.lineTo(u3.x, u3.y);
      continue;
    }
    const h = t[l3], d = t[(l3 + 2) % a], p = n(h, u3);
    let f2;
    if (p < 1e-4) f2 = u3;
    else {
      const _ = Math.min(p / 2, c);
      f2 = o(u3, h, _ / p);
    }
    const g = n(d, u3);
    let m3;
    if (g < 1e-4) m3 = u3;
    else {
      const _ = Math.min(g / 2, c);
      m3 = o(u3, d, _ / g);
    }
    l3 === 0 ? r.moveTo(f2.x, f2.y) : r.lineTo(f2.x, f2.y), r.quadraticCurveTo(u3.x, u3.y, m3.x, m3.y, s);
  }
}
const KT = new j$1();
class Ip {
  constructor(t) {
    this.shapePrimitives = [], this._currentPoly = null, this._bounds = new st$1(), this._graphicsPath2D = t, this.signed = t.checkForHoles;
  }
  moveTo(t, e) {
    return this.startPoly(t, e), this;
  }
  lineTo(t, e) {
    this._ensurePoly();
    const s = this._currentPoly.points, i = s[s.length - 2], n = s[s.length - 1];
    return (i !== t || n !== e) && s.push(t, e), this;
  }
  arc(t, e, s, i, n, o) {
    this._ensurePoly(false);
    const a = this._currentPoly.points;
    return Fo(a, t, e, s, i, n, o), this;
  }
  arcTo(t, e, s, i, n) {
    this._ensurePoly();
    const o = this._currentPoly.points;
    return Rp(o, t, e, s, i, n), this;
  }
  arcToSvg(t, e, s, i, n, o, a) {
    const l3 = this._currentPoly.points;
    return Cp(l3, this._currentPoly.lastX, this._currentPoly.lastY, o, a, t, e, s, i, n), this;
  }
  bezierCurveTo(t, e, s, i, n, o, a) {
    this._ensurePoly();
    const l3 = this._currentPoly;
    return Go(this._currentPoly.points, l3.lastX, l3.lastY, t, e, s, i, n, o, a), this;
  }
  quadraticCurveTo(t, e, s, i, n) {
    this._ensurePoly();
    const o = this._currentPoly;
    return Pp(this._currentPoly.points, o.lastX, o.lastY, t, e, s, i, n), this;
  }
  closePath() {
    return this.endPoly(true), this;
  }
  addPath(t, e) {
    this.endPoly(), e && !e.isIdentity() && (t = t.clone(true), t.transform(e));
    const s = this.shapePrimitives, i = s.length;
    for (let n = 0; n < t.instructions.length; n++) {
      const o = t.instructions[n];
      this[o.action](...o.data);
    }
    if (t.checkForHoles && s.length - i > 1) {
      let n = null;
      for (let o = i; o < s.length; o++) {
        const a = s[o];
        if (a.shape.type === "polygon") {
          const l3 = a.shape, u3 = n == null ? void 0 : n.shape;
          u3 && u3.containsPolygon(l3) ? (n.holes || (n.holes = []), n.holes.push(a), s.copyWithin(o, o + 1), s.length--, o--) : n = a;
        }
      }
    }
    return this;
  }
  finish(t = false) {
    this.endPoly(t);
  }
  rect(t, e, s, i, n) {
    return this.drawShape(new j$1(t, e, s, i), n), this;
  }
  circle(t, e, s, i) {
    return this.drawShape(new Ji(t, e, s), i), this;
  }
  poly(t, e, s) {
    const i = new ar(t);
    return i.closePath = e, this.drawShape(i, s), this;
  }
  regularPoly(t, e, s, i, n = 0, o) {
    i = Math.max(i | 0, 3);
    const a = -1 * Math.PI / 2 + n, l3 = Math.PI * 2 / i, u3 = [];
    for (let c = 0; c < i; c++) {
      const h = a - c * l3;
      u3.push(t + s * Math.cos(h), e + s * Math.sin(h));
    }
    return this.poly(u3, true, o), this;
  }
  roundPoly(t, e, s, i, n, o = 0, a) {
    if (i = Math.max(i | 0, 3), n <= 0) return this.regularPoly(t, e, s, i, o);
    const l3 = s * Math.sin(Math.PI / i) - 1e-3;
    n = Math.min(n, l3);
    const u3 = -1 * Math.PI / 2 + o, c = Math.PI * 2 / i, h = (i - 2) * Math.PI / i / 2;
    for (let d = 0; d < i; d++) {
      const p = d * c + u3, f2 = t + s * Math.cos(p), g = e + s * Math.sin(p), m3 = p + Math.PI + h, _ = p - Math.PI - h, b = f2 + n * Math.cos(m3), v4 = g + n * Math.sin(m3), y4 = f2 + n * Math.cos(_), S3 = g + n * Math.sin(_);
      d === 0 ? this.moveTo(b, v4) : this.lineTo(b, v4), this.quadraticCurveTo(f2, g, y4, S3, a);
    }
    return this.closePath();
  }
  roundShape(t, e, s = false, i) {
    return t.length < 3 ? this : (s ? Gp(this, t, e, i) : Op(this, t, e), this.closePath());
  }
  filletRect(t, e, s, i, n) {
    if (n === 0) return this.rect(t, e, s, i);
    const o = Math.min(s, i) / 2, a = Math.min(o, Math.max(-o, n)), l3 = t + s, u3 = e + i, c = a < 0 ? -a : 0, h = Math.abs(a);
    return this.moveTo(t, e + h).arcTo(t + c, e + c, t + h, e, h).lineTo(l3 - h, e).arcTo(l3 - c, e + c, l3, e + h, h).lineTo(l3, u3 - h).arcTo(l3 - c, u3 - c, t + s - h, u3, h).lineTo(t + h, u3).arcTo(t + c, u3 - c, t, u3 - h, h).closePath();
  }
  chamferRect(t, e, s, i, n, o) {
    if (n <= 0) return this.rect(t, e, s, i);
    const a = Math.min(n, Math.min(s, i) / 2), l3 = t + s, u3 = e + i, c = [t + a, e, l3 - a, e, l3, e + a, l3, u3 - a, l3 - a, u3, t + a, u3, t, u3 - a, t, e + a];
    for (let h = c.length - 1; h >= 2; h -= 2) c[h] === c[h - 2] && c[h - 1] === c[h - 3] && c.splice(h - 1, 2);
    return this.poly(c, true, o);
  }
  ellipse(t, e, s, i, n) {
    return this.drawShape(new tn(t, e, s, i), n), this;
  }
  roundRect(t, e, s, i, n, o) {
    return this.drawShape(new en(t, e, s, i, n), o), this;
  }
  drawShape(t, e) {
    return this.endPoly(), this.shapePrimitives.push({ shape: t, transform: e }), this;
  }
  startPoly(t, e) {
    let s = this._currentPoly;
    return s && this.endPoly(), s = new ar(), s.points.push(t, e), this._currentPoly = s, this;
  }
  endPoly(t = false) {
    const e = this._currentPoly;
    return e && e.points.length > 2 && (e.closePath = t, this.shapePrimitives.push({ shape: e })), this._currentPoly = null, this;
  }
  _ensurePoly(t = true) {
    if (!this._currentPoly && (this._currentPoly = new ar(), t)) {
      const e = this.shapePrimitives[this.shapePrimitives.length - 1];
      if (e) {
        let s = e.shape.x, i = e.shape.y;
        if (e.transform && !e.transform.isIdentity()) {
          const n = e.transform, o = s;
          s = n.a * s + n.c * i + n.tx, i = n.b * o + n.d * i + n.ty;
        }
        this._currentPoly.points.push(s, i);
      } else this._currentPoly.points.push(0, 0);
    }
  }
  buildPath() {
    const t = this._graphicsPath2D;
    this.shapePrimitives.length = 0, this._currentPoly = null;
    for (let e = 0; e < t.instructions.length; e++) {
      const s = t.instructions[e];
      this[s.action](...s.data);
    }
    this.finish();
  }
  get bounds() {
    const t = this._bounds;
    t.clear();
    const e = this.shapePrimitives;
    for (let s = 0; s < e.length; s++) {
      const i = e[s], n = i.shape.getBounds(KT);
      i.transform ? t.addRect(n, i.transform) : t.addRect(n);
    }
    return t;
  }
}
class Ce {
  constructor(t, e = false) {
    this.instructions = [], this.uid = Y("graphicsPath"), this._dirty = true;
    var s;
    this.checkForHoles = e, typeof t == "string" ? Ap(t, this) : this.instructions = (s = t == null ? void 0 : t.slice()) != null ? s : [];
  }
  get shapePath() {
    return this._shapePath || (this._shapePath = new Ip(this)), this._dirty && (this._dirty = false, this._shapePath.buildPath()), this._shapePath;
  }
  addPath(t, e) {
    return t = t.clone(), this.instructions.push({ action: "addPath", data: [t, e] }), this._dirty = true, this;
  }
  arc(...t) {
    return this.instructions.push({ action: "arc", data: t }), this._dirty = true, this;
  }
  arcTo(...t) {
    return this.instructions.push({ action: "arcTo", data: t }), this._dirty = true, this;
  }
  arcToSvg(...t) {
    return this.instructions.push({ action: "arcToSvg", data: t }), this._dirty = true, this;
  }
  bezierCurveTo(...t) {
    return this.instructions.push({ action: "bezierCurveTo", data: t }), this._dirty = true, this;
  }
  bezierCurveToShort(t, e, s, i, n) {
    const o = this.instructions[this.instructions.length - 1], a = this.getLastPoint(z$1.shared);
    let l3 = 0, u3 = 0;
    if (!o || o.action !== "bezierCurveTo") l3 = a.x, u3 = a.y;
    else {
      l3 = o.data[2], u3 = o.data[3];
      const c = a.x, h = a.y;
      l3 = c + (c - l3), u3 = h + (h - u3);
    }
    return this.instructions.push({ action: "bezierCurveTo", data: [l3, u3, t, e, s, i, n] }), this._dirty = true, this;
  }
  closePath() {
    return this.instructions.push({ action: "closePath", data: [] }), this._dirty = true, this;
  }
  ellipse(...t) {
    return this.instructions.push({ action: "ellipse", data: t }), this._dirty = true, this;
  }
  lineTo(...t) {
    return this.instructions.push({ action: "lineTo", data: t }), this._dirty = true, this;
  }
  moveTo(...t) {
    return this.instructions.push({ action: "moveTo", data: t }), this;
  }
  quadraticCurveTo(...t) {
    return this.instructions.push({ action: "quadraticCurveTo", data: t }), this._dirty = true, this;
  }
  quadraticCurveToShort(t, e, s) {
    const i = this.instructions[this.instructions.length - 1], n = this.getLastPoint(z$1.shared);
    let o = 0, a = 0;
    if (!i || i.action !== "quadraticCurveTo") o = n.x, a = n.y;
    else {
      o = i.data[0], a = i.data[1];
      const l3 = n.x, u3 = n.y;
      o = l3 + (l3 - o), a = u3 + (u3 - a);
    }
    return this.instructions.push({ action: "quadraticCurveTo", data: [o, a, t, e, s] }), this._dirty = true, this;
  }
  rect(t, e, s, i, n) {
    return this.instructions.push({ action: "rect", data: [t, e, s, i, n] }), this._dirty = true, this;
  }
  circle(t, e, s, i) {
    return this.instructions.push({ action: "circle", data: [t, e, s, i] }), this._dirty = true, this;
  }
  roundRect(...t) {
    return this.instructions.push({ action: "roundRect", data: t }), this._dirty = true, this;
  }
  poly(...t) {
    return this.instructions.push({ action: "poly", data: t }), this._dirty = true, this;
  }
  regularPoly(...t) {
    return this.instructions.push({ action: "regularPoly", data: t }), this._dirty = true, this;
  }
  roundPoly(...t) {
    return this.instructions.push({ action: "roundPoly", data: t }), this._dirty = true, this;
  }
  roundShape(...t) {
    return this.instructions.push({ action: "roundShape", data: t }), this._dirty = true, this;
  }
  filletRect(...t) {
    return this.instructions.push({ action: "filletRect", data: t }), this._dirty = true, this;
  }
  chamferRect(...t) {
    return this.instructions.push({ action: "chamferRect", data: t }), this._dirty = true, this;
  }
  star(t, e, s, i, n, o, a) {
    n || (n = i / 2);
    const l3 = -1 * Math.PI / 2 + o, u3 = s * 2, c = Math.PI * 2 / u3, h = [];
    for (let d = 0; d < u3; d++) {
      const p = d % 2 ? n : i, f2 = d * c + l3;
      h.push(t + p * Math.cos(f2), e + p * Math.sin(f2));
    }
    return this.poly(h, true, a), this;
  }
  clone(t = false) {
    const e = new Ce();
    if (e.checkForHoles = this.checkForHoles, !t) e.instructions = this.instructions.slice();
    else for (let s = 0; s < this.instructions.length; s++) {
      const i = this.instructions[s];
      e.instructions.push({ action: i.action, data: i.data.slice() });
    }
    return e;
  }
  clear() {
    return this.instructions.length = 0, this._dirty = true, this;
  }
  transform(t) {
    if (t.isIdentity()) return this;
    const e = t.a, s = t.b, i = t.c, n = t.d, o = t.tx, a = t.ty;
    let l3 = 0, u3 = 0, c = 0, h = 0, d = 0, p = 0, f2 = 0, g = 0;
    for (let m3 = 0; m3 < this.instructions.length; m3++) {
      const _ = this.instructions[m3], b = _.data;
      switch (_.action) {
        case "moveTo":
        case "lineTo":
          l3 = b[0], u3 = b[1], b[0] = e * l3 + i * u3 + o, b[1] = s * l3 + n * u3 + a;
          break;
        case "bezierCurveTo":
          c = b[0], h = b[1], d = b[2], p = b[3], l3 = b[4], u3 = b[5], b[0] = e * c + i * h + o, b[1] = s * c + n * h + a, b[2] = e * d + i * p + o, b[3] = s * d + n * p + a, b[4] = e * l3 + i * u3 + o, b[5] = s * l3 + n * u3 + a;
          break;
        case "quadraticCurveTo":
          c = b[0], h = b[1], l3 = b[2], u3 = b[3], b[0] = e * c + i * h + o, b[1] = s * c + n * h + a, b[2] = e * l3 + i * u3 + o, b[3] = s * l3 + n * u3 + a;
          break;
        case "arcToSvg":
          l3 = b[5], u3 = b[6], f2 = b[0], g = b[1], b[0] = e * f2 + i * g, b[1] = s * f2 + n * g, b[5] = e * l3 + i * u3 + o, b[6] = s * l3 + n * u3 + a;
          break;
        case "circle":
          b[4] = Dr(b[3], t);
          break;
        case "rect":
          b[4] = Dr(b[4], t);
          break;
        case "ellipse":
          b[8] = Dr(b[8], t);
          break;
        case "roundRect":
          b[5] = Dr(b[5], t);
          break;
        case "addPath":
          b[0].transform(t);
          break;
        case "poly":
          b[2] = Dr(b[2], t);
          break;
      }
    }
    return this._dirty = true, this;
  }
  get bounds() {
    return this.shapePath.bounds;
  }
  getLastPoint(t) {
    let e = this.instructions.length - 1, s = this.instructions[e];
    if (!s) return t.x = 0, t.y = 0, t;
    for (; s.action === "closePath"; ) {
      if (e--, e < 0) return t.x = 0, t.y = 0, t;
      s = this.instructions[e];
    }
    switch (s.action) {
      case "moveTo":
      case "lineTo":
        t.x = s.data[0], t.y = s.data[1];
        break;
      case "quadraticCurveTo":
        t.x = s.data[2], t.y = s.data[3];
        break;
      case "bezierCurveTo":
        t.x = s.data[4], t.y = s.data[5];
        break;
      case "arc":
      case "arcToSvg":
        t.x = s.data[5], t.y = s.data[6];
        break;
      case "addPath":
        s.data[0].getLastPoint(t);
        break;
    }
    return t;
  }
}
function Dr(r, t) {
  return r ? r.prepend(t) : t.clone();
}
let ko = 0;
const Bp = 500;
function Ct$1(...r) {
  ko !== Bp && (ko++, ko === Bp ? console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.") : console.warn("PixiJS Warning: ", ...r));
}
function Z$1(r, t, e) {
  const s = r.getAttribute(t);
  return s ? Number(s) : e;
}
function Fp(r, t) {
  const e = r.querySelectorAll("defs");
  for (let s = 0; s < e.length; s++) {
    const i = e[s];
    for (let n = 0; n < i.children.length; n++) {
      const o = i.children[n];
      switch (o.nodeName.toLowerCase()) {
        case "lineargradient":
          t.defs[o.id] = qT(o);
          break;
        case "radialgradient":
          t.defs[o.id] = ZT();
          break;
      }
    }
  }
}
function qT(r) {
  const t = Z$1(r, "x1", 0), e = Z$1(r, "y1", 0), s = Z$1(r, "x2", 1), i = Z$1(r, "y2", 0), n = r.getAttribute("gradientUnits") || "objectBoundingBox", o = new Ht$1(t, e, s, i, n === "objectBoundingBox" ? "local" : "global");
  for (let a = 0; a < r.children.length; a++) {
    const l3 = r.children[a], u3 = Z$1(l3, "offset", 0), c = X.shared.setValue(l3.getAttribute("stop-color")).toNumber();
    o.addColorStop(u3, c);
  }
  return o;
}
function ZT(r) {
  return new Ht$1(0, 0, 1, 0);
}
function $o(r) {
  const t = r.match(/url\s*\(\s*['"]?\s*#([^'"\s)]+)\s*['"]?\s*\)/i);
  return t ? t[1] : "";
}
const Lo = { fill: { type: "paint", default: 0 }, "fill-opacity": { type: "number", default: 1 }, stroke: { type: "paint", default: 0 }, "stroke-width": { type: "number", default: 1 }, "stroke-opacity": { type: "number", default: 1 }, "stroke-linecap": { type: "string", default: "butt" }, "stroke-linejoin": { type: "string", default: "miter" }, "stroke-miterlimit": { type: "number", default: 10 }, "stroke-dasharray": { type: "string", default: "none" }, "stroke-dashoffset": { type: "number", default: 0 }, opacity: { type: "number", default: 1 } };
function No(r, t) {
  const e = r.getAttribute("style"), s = {}, i = {}, n = { strokeStyle: s, fillStyle: i, useFill: false, useStroke: false };
  for (const o in Lo) {
    const a = r.getAttribute(o);
    a && Dp(t, n, o, a.trim());
  }
  if (e) {
    const o = e.split(";");
    for (let a = 0; a < o.length; a++) {
      const l3 = o[a].trim(), [u3, c] = l3.split(":");
      Lo[u3] && Dp(t, n, u3, c.trim());
    }
  }
  return { strokeStyle: n.useStroke ? s : null, fillStyle: n.useFill ? i : null, useFill: n.useFill, useStroke: n.useStroke };
}
function Dp(r, t, e, s) {
  switch (e) {
    case "stroke":
      if (s !== "none") {
        if (s.startsWith("url(")) {
          const i = $o(s);
          t.strokeStyle.fill = r.defs[i];
        } else t.strokeStyle.color = X.shared.setValue(s).toNumber();
        t.useStroke = true;
      }
      break;
    case "stroke-width":
      t.strokeStyle.width = Number(s);
      break;
    case "fill":
      if (s !== "none") {
        if (s.startsWith("url(")) {
          const i = $o(s);
          t.fillStyle.fill = r.defs[i];
        } else t.fillStyle.color = X.shared.setValue(s).toNumber();
        t.useFill = true;
      }
      break;
    case "fill-opacity":
      t.fillStyle.alpha = Number(s);
      break;
    case "stroke-opacity":
      t.strokeStyle.alpha = Number(s);
      break;
    case "opacity":
      t.fillStyle.alpha = Number(s), t.strokeStyle.alpha = Number(s);
      break;
  }
}
var QT = Object.defineProperty, Up = Object.getOwnPropertySymbols, JT = Object.prototype.hasOwnProperty, tS = Object.prototype.propertyIsEnumerable, kp = (r, t, e) => t in r ? QT(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Js = (r, t) => {
  for (var e in t || (t = {})) JT.call(t, e) && kp(r, e, t[e]);
  if (Up) for (var e of Up(t)) tS.call(t, e) && kp(r, e, t[e]);
  return r;
};
function $p(r, t) {
  if (typeof r == "string") {
    const o = document.createElement("div");
    o.innerHTML = r.trim(), r = o.querySelector("svg");
  }
  const e = { context: t, defs: {}, path: new Ce() };
  Fp(r, e);
  const s = r.children, { fillStyle: i, strokeStyle: n } = No(r, e);
  for (let o = 0; o < s.length; o++) {
    const a = s[o];
    a.nodeName.toLowerCase() !== "defs" && Lp(a, e, i, n);
  }
  return t;
}
function Lp(r, t, e, s) {
  const i = r.children, { fillStyle: n, strokeStyle: o } = No(r, t);
  n && e ? e = Js(Js({}, e), n) : n && (e = n), o && s ? s = Js(Js({}, s), o) : o && (s = o);
  const a = !e && !s;
  a && (e = { color: 0 });
  let l3, u3, c, h, d, p, f2, g, m3, _, b, v4, y4, S3, T4, E4, O3;
  switch (r.nodeName.toLowerCase()) {
    case "path":
      S3 = r.getAttribute("d"), r.getAttribute("fill-rule"), T4 = new Ce(S3, true), t.context.path(T4), e && t.context.fill(e), s && t.context.stroke(s);
      break;
    case "circle":
      f2 = Z$1(r, "cx", 0), g = Z$1(r, "cy", 0), m3 = Z$1(r, "r", 0), t.context.ellipse(f2, g, m3, m3), e && t.context.fill(e), s && t.context.stroke(s);
      break;
    case "rect":
      l3 = Z$1(r, "x", 0), u3 = Z$1(r, "y", 0), E4 = Z$1(r, "width", 0), O3 = Z$1(r, "height", 0), _ = Z$1(r, "rx", 0), b = Z$1(r, "ry", 0), _ || b ? t.context.roundRect(l3, u3, E4, O3, _ || b) : t.context.rect(l3, u3, E4, O3), e && t.context.fill(e), s && t.context.stroke(s);
      break;
    case "ellipse":
      f2 = Z$1(r, "cx", 0), g = Z$1(r, "cy", 0), _ = Z$1(r, "rx", 0), b = Z$1(r, "ry", 0), t.context.beginPath(), t.context.ellipse(f2, g, _, b), e && t.context.fill(e), s && t.context.stroke(s);
      break;
    case "line":
      c = Z$1(r, "x1", 0), h = Z$1(r, "y1", 0), d = Z$1(r, "x2", 0), p = Z$1(r, "y2", 0), t.context.beginPath(), t.context.moveTo(c, h), t.context.lineTo(d, p), s && t.context.stroke(s);
      break;
    case "polygon":
      y4 = r.getAttribute("points"), v4 = y4.match(/\d+/g).map((C3) => parseInt(C3, 10)), t.context.poly(v4, true), e && t.context.fill(e), s && t.context.stroke(s);
      break;
    case "polyline":
      y4 = r.getAttribute("points"), v4 = y4.match(/\d+/g).map((C3) => parseInt(C3, 10)), t.context.poly(v4, false), s && t.context.stroke(s);
      break;
    case "g":
    case "svg":
      break;
    default: {
      Ct$1(`[SVG parser] <${r.nodeName}> elements unsupported`);
      break;
    }
  }
  a && (e = null);
  for (let C3 = 0; C3 < i.length; C3++) Lp(i[C3], t, e, s);
}
var eS = Object.defineProperty, ti = Object.getOwnPropertySymbols, Np = Object.prototype.hasOwnProperty, Xp = Object.prototype.propertyIsEnumerable, Hp = (r, t, e) => t in r ? eS(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Ft$1 = (r, t) => {
  for (var e in t || (t = {})) Np.call(t, e) && Hp(r, e, t[e]);
  if (ti) for (var e of ti(t)) Xp.call(t, e) && Hp(r, e, t[e]);
  return r;
}, rS = (r, t) => {
  var e = {};
  for (var s in r) Np.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && ti) for (var s of ti(r)) t.indexOf(s) < 0 && Xp.call(r, s) && (e[s] = r[s]);
  return e;
};
function sS(r) {
  return X.isColorLike(r);
}
function jp(r) {
  return r instanceof Ir;
}
function zp(r) {
  return r instanceof Ht$1;
}
function iS(r) {
  return r instanceof A$1;
}
function nS(r, t, e) {
  const s = X.shared.setValue(t != null ? t : 0);
  return r.color = s.toNumber(), r.alpha = s.alpha === 1 ? e.alpha : s.alpha, r.texture = A$1.WHITE, Ft$1(Ft$1({}, e), r);
}
function oS(r, t, e) {
  return r.texture = t, Ft$1(Ft$1({}, e), r);
}
function Vp(r, t, e) {
  return r.fill = t, r.color = 16777215, r.texture = t.texture, r.matrix = t.transform, Ft$1(Ft$1({}, e), r);
}
function Wp(r, t, e) {
  return t.buildGradient(), r.fill = t, r.color = 16777215, r.texture = t.texture, r.matrix = t.transform, r.textureSpace = t.textureSpace, Ft$1(Ft$1({}, e), r);
}
function aS(r, t) {
  const e = Ft$1(Ft$1({}, t), r), s = X.shared.setValue(e.color);
  return e.alpha *= s.alpha, e.color = s.toNumber(), e;
}
function ne(r, t) {
  if (r == null) return null;
  const e = {}, s = r;
  return sS(r) ? nS(e, r, t) : iS(r) ? oS(e, r, t) : jp(r) ? Vp(e, r, t) : zp(r) ? Wp(e, r, t) : s.fill && jp(s.fill) ? Vp(s, s.fill, t) : s.fill && zp(s.fill) ? Wp(s, s.fill, t) : aS(s, t);
}
function Ur(r, t) {
  const e = t, { width: s, alignment: i, miterLimit: n, cap: o, join: a, pixelLine: l3 } = e, u3 = rS(e, ["width", "alignment", "miterLimit", "cap", "join", "pixelLine"]), c = ne(r, u3);
  return c ? Ft$1({ width: s, alignment: i, miterLimit: n, cap: o, join: a, pixelLine: l3 }, c) : null;
}
var lS = Object.defineProperty, Yp = Object.getOwnPropertySymbols, uS = Object.prototype.hasOwnProperty, cS = Object.prototype.propertyIsEnumerable, Kp = (r, t, e) => t in r ? lS(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Ye = (r, t) => {
  for (var e in t || (t = {})) uS.call(t, e) && Kp(r, e, t[e]);
  if (Yp) for (var e of Yp(t)) cS.call(t, e) && Kp(r, e, t[e]);
  return r;
};
const hS = new z$1(), qp = new R$1(), Xo = class zt extends dt {
  constructor() {
    super(...arguments), this.uid = Y("graphicsContext"), this.dirty = true, this.batchMode = "auto", this.instructions = [], this._activePath = new Ce(), this._transform = new R$1(), this._fillStyle = Ye({}, zt.defaultFillStyle), this._strokeStyle = Ye({}, zt.defaultStrokeStyle), this._stateStack = [], this._tick = 0, this._bounds = new st$1(), this._boundsDirty = true;
  }
  clone() {
    const t = new zt();
    return t.batchMode = this.batchMode, t.instructions = this.instructions.slice(), t._activePath = this._activePath.clone(), t._transform = this._transform.clone(), t._fillStyle = Ye({}, this._fillStyle), t._strokeStyle = Ye({}, this._strokeStyle), t._stateStack = this._stateStack.slice(), t._bounds = this._bounds.clone(), t._boundsDirty = true, t;
  }
  get fillStyle() {
    return this._fillStyle;
  }
  set fillStyle(t) {
    this._fillStyle = ne(t, zt.defaultFillStyle);
  }
  get strokeStyle() {
    return this._strokeStyle;
  }
  set strokeStyle(t) {
    this._strokeStyle = Ur(t, zt.defaultStrokeStyle);
  }
  setFillStyle(t) {
    return this._fillStyle = ne(t, zt.defaultFillStyle), this;
  }
  setStrokeStyle(t) {
    return this._strokeStyle = ne(t, zt.defaultStrokeStyle), this;
  }
  texture(t, e, s, i, n, o) {
    return this.instructions.push({ action: "texture", data: { image: t, dx: s || 0, dy: i || 0, dw: n || t.frame.width, dh: o || t.frame.height, transform: this._transform.clone(), alpha: this._fillStyle.alpha, style: e ? X.shared.setValue(e).toNumber() : 16777215 } }), this.onUpdate(), this;
  }
  beginPath() {
    return this._activePath = new Ce(), this;
  }
  fill(t, e) {
    let s;
    const i = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && i && i.action === "stroke" ? s = i.data.path : s = this._activePath.clone(), s ? (t != null && (e !== void 0 && typeof t == "number" && (t = { color: t, alpha: e }), this._fillStyle = ne(t, zt.defaultFillStyle)), this.instructions.push({ action: "fill", data: { style: this.fillStyle, path: s } }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  _initNextPathLocation() {
    const { x: t, y: e } = this._activePath.getLastPoint(z$1.shared);
    this._activePath.clear(), this._activePath.moveTo(t, e);
  }
  stroke(t) {
    let e;
    const s = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && s && s.action === "fill" ? e = s.data.path : e = this._activePath.clone(), e ? (t != null && (this._strokeStyle = Ur(t, zt.defaultStrokeStyle)), this.instructions.push({ action: "stroke", data: { style: this.strokeStyle, path: e } }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  cut() {
    for (let t = 0; t < 2; t++) {
      const e = this.instructions[this.instructions.length - 1 - t], s = this._activePath.clone();
      if (e && (e.action === "stroke" || e.action === "fill")) if (e.data.hole) e.data.hole.addPath(s);
      else {
        e.data.hole = s;
        break;
      }
    }
    return this._initNextPathLocation(), this;
  }
  arc(t, e, s, i, n, o) {
    this._tick++;
    const a = this._transform;
    return this._activePath.arc(a.a * t + a.c * e + a.tx, a.b * t + a.d * e + a.ty, s, i, n, o), this;
  }
  arcTo(t, e, s, i, n) {
    this._tick++;
    const o = this._transform;
    return this._activePath.arcTo(o.a * t + o.c * e + o.tx, o.b * t + o.d * e + o.ty, o.a * s + o.c * i + o.tx, o.b * s + o.d * i + o.ty, n), this;
  }
  arcToSvg(t, e, s, i, n, o, a) {
    this._tick++;
    const l3 = this._transform;
    return this._activePath.arcToSvg(t, e, s, i, n, l3.a * o + l3.c * a + l3.tx, l3.b * o + l3.d * a + l3.ty), this;
  }
  bezierCurveTo(t, e, s, i, n, o, a) {
    this._tick++;
    const l3 = this._transform;
    return this._activePath.bezierCurveTo(l3.a * t + l3.c * e + l3.tx, l3.b * t + l3.d * e + l3.ty, l3.a * s + l3.c * i + l3.tx, l3.b * s + l3.d * i + l3.ty, l3.a * n + l3.c * o + l3.tx, l3.b * n + l3.d * o + l3.ty, a), this;
  }
  closePath() {
    var t;
    return this._tick++, (t = this._activePath) == null || t.closePath(), this;
  }
  ellipse(t, e, s, i) {
    return this._tick++, this._activePath.ellipse(t, e, s, i, this._transform.clone()), this;
  }
  circle(t, e, s) {
    return this._tick++, this._activePath.circle(t, e, s, this._transform.clone()), this;
  }
  path(t) {
    return this._tick++, this._activePath.addPath(t, this._transform.clone()), this;
  }
  lineTo(t, e) {
    this._tick++;
    const s = this._transform;
    return this._activePath.lineTo(s.a * t + s.c * e + s.tx, s.b * t + s.d * e + s.ty), this;
  }
  moveTo(t, e) {
    this._tick++;
    const s = this._transform, i = this._activePath.instructions, n = s.a * t + s.c * e + s.tx, o = s.b * t + s.d * e + s.ty;
    return i.length === 1 && i[0].action === "moveTo" ? (i[0].data[0] = n, i[0].data[1] = o, this) : (this._activePath.moveTo(n, o), this);
  }
  quadraticCurveTo(t, e, s, i, n) {
    this._tick++;
    const o = this._transform;
    return this._activePath.quadraticCurveTo(o.a * t + o.c * e + o.tx, o.b * t + o.d * e + o.ty, o.a * s + o.c * i + o.tx, o.b * s + o.d * i + o.ty, n), this;
  }
  rect(t, e, s, i) {
    return this._tick++, this._activePath.rect(t, e, s, i, this._transform.clone()), this;
  }
  roundRect(t, e, s, i, n) {
    return this._tick++, this._activePath.roundRect(t, e, s, i, n, this._transform.clone()), this;
  }
  poly(t, e) {
    return this._tick++, this._activePath.poly(t, e, this._transform.clone()), this;
  }
  regularPoly(t, e, s, i, n = 0, o) {
    return this._tick++, this._activePath.regularPoly(t, e, s, i, n, o), this;
  }
  roundPoly(t, e, s, i, n, o) {
    return this._tick++, this._activePath.roundPoly(t, e, s, i, n, o), this;
  }
  roundShape(t, e, s, i) {
    return this._tick++, this._activePath.roundShape(t, e, s, i), this;
  }
  filletRect(t, e, s, i, n) {
    return this._tick++, this._activePath.filletRect(t, e, s, i, n), this;
  }
  chamferRect(t, e, s, i, n, o) {
    return this._tick++, this._activePath.chamferRect(t, e, s, i, n, o), this;
  }
  star(t, e, s, i, n = 0, o = 0) {
    return this._tick++, this._activePath.star(t, e, s, i, n, o, this._transform.clone()), this;
  }
  svg(t) {
    return this._tick++, $p(t, this), this;
  }
  restore() {
    const t = this._stateStack.pop();
    return t && (this._transform = t.transform, this._fillStyle = t.fillStyle, this._strokeStyle = t.strokeStyle), this;
  }
  save() {
    return this._stateStack.push({ transform: this._transform.clone(), fillStyle: Ye({}, this._fillStyle), strokeStyle: Ye({}, this._strokeStyle) }), this;
  }
  getTransform() {
    return this._transform;
  }
  resetTransform() {
    return this._transform.identity(), this;
  }
  rotate(t) {
    return this._transform.rotate(t), this;
  }
  scale(t, e = t) {
    return this._transform.scale(t, e), this;
  }
  setTransform(t, e, s, i, n, o) {
    return t instanceof R$1 ? (this._transform.set(t.a, t.b, t.c, t.d, t.tx, t.ty), this) : (this._transform.set(t, e, s, i, n, o), this);
  }
  transform(t, e, s, i, n, o) {
    return t instanceof R$1 ? (this._transform.append(t), this) : (qp.set(t, e, s, i, n, o), this._transform.append(qp), this);
  }
  translate(t, e = t) {
    return this._transform.translate(t, e), this;
  }
  clear() {
    return this._activePath.clear(), this.instructions.length = 0, this.resetTransform(), this.onUpdate(), this;
  }
  onUpdate() {
    this.dirty || (this.emit("update", this, 16), this.dirty = true, this._boundsDirty = true);
  }
  get bounds() {
    if (!this._boundsDirty) return this._bounds;
    const t = this._bounds;
    t.clear();
    for (let e = 0; e < this.instructions.length; e++) {
      const s = this.instructions[e], i = s.action;
      if (i === "fill") {
        const n = s.data;
        t.addBounds(n.path.bounds);
      } else if (i === "texture") {
        const n = s.data;
        t.addFrame(n.dx, n.dy, n.dx + n.dw, n.dy + n.dh, n.transform);
      }
      if (i === "stroke") {
        const n = s.data, o = n.style.alignment, a = n.style.width * (1 - o), l3 = n.path.bounds;
        t.addFrame(l3.minX - a, l3.minY - a, l3.maxX + a, l3.maxY + a);
      }
    }
    return t;
  }
  containsPoint(t) {
    var e;
    if (!this.bounds.containsPoint(t.x, t.y)) return false;
    const s = this.instructions;
    let i = false;
    for (let n = 0; n < s.length; n++) {
      const o = s[n], a = o.data, l3 = a.path;
      if (!o.action || !l3) continue;
      const u3 = a.style, c = l3.shapePath.shapePrimitives;
      for (let h = 0; h < c.length; h++) {
        const d = c[h].shape;
        if (!u3 || !d) continue;
        const p = c[h].transform, f2 = p ? p.applyInverse(t, hS) : t;
        if (o.action === "fill") i = d.contains(f2.x, f2.y);
        else {
          const m3 = u3;
          i = d.strokeContains(f2.x, f2.y, m3.width, m3.alignment);
        }
        const g = a.hole;
        if (g) {
          const m3 = (e = g.shapePath) == null ? void 0 : e.shapePrimitives;
          if (m3) for (let _ = 0; _ < m3.length; _++) m3[_].shape.contains(f2.x, f2.y) && (i = false);
        }
        if (i) return true;
      }
    }
    return i;
  }
  destroy(t = false) {
    if (this._stateStack.length = 0, this._transform = null, this.emit("destroy", this), this.removeAllListeners(), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const e = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._fillStyle.texture && this._fillStyle.texture.destroy(e), this._strokeStyle.texture && this._strokeStyle.texture.destroy(e);
    }
    this._fillStyle = null, this._strokeStyle = null, this.instructions = null, this._activePath = null, this._bounds = null, this._stateStack = null, this.customShader = null, this._transform = null;
  }
};
Xo.defaultFillStyle = { color: 16777215, alpha: 1, texture: A$1.WHITE, matrix: null, fill: null, textureSpace: "local" }, Xo.defaultStrokeStyle = { width: 1, color: 16777215, alpha: 1, alignment: 0.5, miterLimit: 10, cap: "butt", join: "miter", texture: A$1.WHITE, matrix: null, fill: null, textureSpace: "local", pixelLine: false };
let ct = Xo;
const Zp = ["align", "breakWords", "cssOverrides", "fontVariant", "fontWeight", "leading", "letterSpacing", "lineHeight", "padding", "textBaseline", "trim", "whiteSpace", "wordWrap", "wordWrapWidth", "fontFamily", "fontStyle", "fontSize"];
function Qp(r) {
  const t = [];
  let e = 0;
  for (let s = 0; s < Zp.length; s++) {
    const i = `_${Zp[s]}`;
    t[e++] = r[i];
  }
  return e = Jp(r._fill, t, e), e = pS(r._stroke, t, e), e = fS(r.dropShadow, t, e), e = dS(r.filters, t, e), t.join("-");
}
function dS(r, t, e) {
  if (!r) return e;
  for (const s of r) t[e++] = s.uid;
  return e;
}
function Jp(r, t, e) {
  var s;
  return r && (t[e++] = r.color, t[e++] = r.alpha, t[e++] = (s = r.fill) == null ? void 0 : s.styleKey), e;
}
function pS(r, t, e) {
  return r && (e = Jp(r, t, e), t[e++] = r.width, t[e++] = r.alignment, t[e++] = r.cap, t[e++] = r.join, t[e++] = r.miterLimit), e;
}
function fS(r, t, e) {
  return r && (t[e++] = r.alpha, t[e++] = r.angle, t[e++] = r.blur, t[e++] = r.distance, t[e++] = X.shared.setValue(r.color).toNumber()), e;
}
var mS = Object.defineProperty, gS = Object.defineProperties, _S = Object.getOwnPropertyDescriptors, tf = Object.getOwnPropertySymbols, xS = Object.prototype.hasOwnProperty, bS = Object.prototype.propertyIsEnumerable, ef = (r, t, e) => t in r ? mS(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, St$1 = (r, t) => {
  for (var e in t || (t = {})) xS.call(t, e) && ef(r, e, t[e]);
  if (tf) for (var e of tf(t)) bS.call(t, e) && ef(r, e, t[e]);
  return r;
}, vS = (r, t) => gS(r, _S(t));
const Ho = class nr extends dt {
  constructor(t = {}) {
    super(), yS(t);
    const e = St$1(St$1({}, nr.defaultTextStyle), t);
    for (const s in e) {
      const i = s;
      this[i] = e[s];
    }
    this.update();
  }
  get align() {
    return this._align;
  }
  set align(t) {
    this._align = t, this.update();
  }
  get breakWords() {
    return this._breakWords;
  }
  set breakWords(t) {
    this._breakWords = t, this.update();
  }
  get dropShadow() {
    return this._dropShadow;
  }
  set dropShadow(t) {
    t !== null && typeof t == "object" ? this._dropShadow = this._createProxy(St$1(St$1({}, nr.defaultDropShadow), t)) : this._dropShadow = t ? this._createProxy(St$1({}, nr.defaultDropShadow)) : null, this.update();
  }
  get fontFamily() {
    return this._fontFamily;
  }
  set fontFamily(t) {
    this._fontFamily = t, this.update();
  }
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(t) {
    typeof t == "string" ? this._fontSize = parseInt(t, 10) : this._fontSize = t, this.update();
  }
  get fontStyle() {
    return this._fontStyle;
  }
  set fontStyle(t) {
    this._fontStyle = t.toLowerCase(), this.update();
  }
  get fontVariant() {
    return this._fontVariant;
  }
  set fontVariant(t) {
    this._fontVariant = t, this.update();
  }
  get fontWeight() {
    return this._fontWeight;
  }
  set fontWeight(t) {
    this._fontWeight = t, this.update();
  }
  get leading() {
    return this._leading;
  }
  set leading(t) {
    this._leading = t, this.update();
  }
  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(t) {
    this._letterSpacing = t, this.update();
  }
  get lineHeight() {
    return this._lineHeight;
  }
  set lineHeight(t) {
    this._lineHeight = t, this.update();
  }
  get padding() {
    return this._padding;
  }
  set padding(t) {
    this._padding = t, this.update();
  }
  get filters() {
    return this._filters;
  }
  set filters(t) {
    this._filters = t, this.update();
  }
  get trim() {
    return this._trim;
  }
  set trim(t) {
    this._trim = t, this.update();
  }
  get textBaseline() {
    return this._textBaseline;
  }
  set textBaseline(t) {
    this._textBaseline = t, this.update();
  }
  get whiteSpace() {
    return this._whiteSpace;
  }
  set whiteSpace(t) {
    this._whiteSpace = t, this.update();
  }
  get wordWrap() {
    return this._wordWrap;
  }
  set wordWrap(t) {
    this._wordWrap = t, this.update();
  }
  get wordWrapWidth() {
    return this._wordWrapWidth;
  }
  set wordWrapWidth(t) {
    this._wordWrapWidth = t, this.update();
  }
  get fill() {
    return this._originalFill;
  }
  set fill(t) {
    t !== this._originalFill && (this._originalFill = t, this._isFillStyle(t) && (this._originalFill = this._createProxy(St$1(St$1({}, ct.defaultFillStyle), t), () => {
      this._fill = ne(St$1({}, this._originalFill), ct.defaultFillStyle);
    })), this._fill = ne(t === 0 ? "black" : t, ct.defaultFillStyle), this.update());
  }
  get stroke() {
    return this._originalStroke;
  }
  set stroke(t) {
    t !== this._originalStroke && (this._originalStroke = t, this._isFillStyle(t) && (this._originalStroke = this._createProxy(St$1(St$1({}, ct.defaultStrokeStyle), t), () => {
      this._stroke = Ur(St$1({}, this._originalStroke), ct.defaultStrokeStyle);
    })), this._stroke = Ur(t, ct.defaultStrokeStyle), this.update());
  }
  _generateKey() {
    return this._styleKey = Qp(this), this._styleKey;
  }
  update() {
    this._styleKey = null, this.emit("update", this);
  }
  reset() {
    const t = nr.defaultTextStyle;
    for (const e in t) this[e] = t[e];
  }
  get styleKey() {
    return this._styleKey || this._generateKey();
  }
  clone() {
    return new nr({ align: this.align, breakWords: this.breakWords, dropShadow: this._dropShadow ? St$1({}, this._dropShadow) : null, fill: this._fill, fontFamily: this.fontFamily, fontSize: this.fontSize, fontStyle: this.fontStyle, fontVariant: this.fontVariant, fontWeight: this.fontWeight, leading: this.leading, letterSpacing: this.letterSpacing, lineHeight: this.lineHeight, padding: this.padding, stroke: this._stroke, textBaseline: this.textBaseline, whiteSpace: this.whiteSpace, wordWrap: this.wordWrap, wordWrapWidth: this.wordWrapWidth, filters: this._filters ? [...this._filters] : void 0 });
  }
  _getFinalPadding() {
    let t = 0;
    if (this._filters) for (let e = 0; e < this._filters.length; e++) t += this._filters[e].padding;
    return Math.max(this._padding, t);
  }
  destroy(t = false) {
    var e, s, i, n;
    if (this.removeAllListeners(), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const o = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      (e = this._fill) != null && e.texture && this._fill.texture.destroy(o), (s = this._originalFill) != null && s.texture && this._originalFill.texture.destroy(o), (i = this._stroke) != null && i.texture && this._stroke.texture.destroy(o), (n = this._originalStroke) != null && n.texture && this._originalStroke.texture.destroy(o);
    }
    this._fill = null, this._stroke = null, this.dropShadow = null, this._originalStroke = null, this._originalFill = null;
  }
  _createProxy(t, e) {
    return new Proxy(t, { set: (s, i, n) => (s[i] = n, e == null || e(i, n), this.update(), true) });
  }
  _isFillStyle(t) {
    return (t != null ? t : null) !== null && !(X.isColorLike(t) || t instanceof Ht$1 || t instanceof Ir);
  }
};
Ho.defaultDropShadow = { alpha: 1, angle: Math.PI / 6, blur: 0, color: "black", distance: 5 }, Ho.defaultTextStyle = { align: "left", breakWords: false, dropShadow: null, fill: "black", fontFamily: "Arial", fontSize: 26, fontStyle: "normal", fontVariant: "normal", fontWeight: "normal", leading: 0, letterSpacing: 0, lineHeight: 0, padding: 0, stroke: null, textBaseline: "alphabetic", trim: false, whiteSpace: "pre", wordWrap: false, wordWrapWidth: 100 };
let Dt$1 = Ho;
function yS(r) {
  var t, e, s, i, n;
  const o = r;
  if (typeof o.dropShadow == "boolean" && o.dropShadow) {
    const a = Dt$1.defaultDropShadow;
    r.dropShadow = { alpha: (t = o.dropShadowAlpha) != null ? t : a.alpha, angle: (e = o.dropShadowAngle) != null ? e : a.angle, blur: (s = o.dropShadowBlur) != null ? s : a.blur, color: (i = o.dropShadowColor) != null ? i : a.color, distance: (n = o.dropShadowDistance) != null ? n : a.distance };
  }
  if (o.strokeThickness !== void 0) {
    const a = o.stroke;
    let l3 = {};
    if (X.isColorLike(a)) l3.color = a;
    else if (a instanceof Ht$1 || a instanceof Ir) l3.fill = a;
    else if (Object.hasOwnProperty.call(a, "color") || Object.hasOwnProperty.call(a, "fill")) l3 = a;
    else throw new Error("Invalid stroke value.");
    r.stroke = vS(St$1({}, l3), { width: o.strokeThickness });
  }
  if (Array.isArray(o.fillGradientStops)) {
    let a;
    r.fontSize == null ? r.fontSize = Dt$1.defaultTextStyle.fontSize : typeof r.fontSize == "string" ? a = parseInt(r.fontSize, 10) : a = r.fontSize;
    const l3 = new Ht$1({ start: { x: 0, y: 0 }, end: { x: 0, y: (a || 0) * 1.7 } }), u3 = o.fillGradientStops.map((c) => X.shared.setValue(c).toNumber());
    u3.forEach((c, h) => {
      const d = h / (u3.length - 1);
      l3.addColorStop(d, c);
    }), r.fill = { fill: l3 };
  }
}
const TS = new st$1();
function jo(r, t, e, s) {
  const i = TS;
  i.minX = 0, i.minY = 0, i.maxX = r.width / s | 0, i.maxY = r.height / s | 0;
  const n = tt$1.getOptimalTexture(i.width, i.height, s, false);
  return n.source.uploadMethodId = "image", n.source.resource = r, n.source.alphaMode = "premultiply-alpha-on-upload", n.frame.width = t / s, n.frame.height = e / s, n.source.emit("update", n.source), n.updateUvs(), n;
}
class rf {
  constructor(t) {
    this._canvasPool = /* @__PURE__ */ Object.create(null), this.canvasOptions = t || {}, this.enableFullScreen = false;
  }
  _createCanvasAndContext(t, e) {
    const s = L.get().createCanvas();
    s.width = t, s.height = e;
    const i = s.getContext("2d");
    return { canvas: s, context: i };
  }
  getOptimalCanvasAndContext(t, e, s = 1) {
    t = Math.ceil(t * s - 1e-6), e = Math.ceil(e * s - 1e-6), t = fe(t), e = fe(e);
    const i = (t << 17) + (e << 1);
    this._canvasPool[i] || (this._canvasPool[i] = []);
    let n = this._canvasPool[i].pop();
    return n || (n = this._createCanvasAndContext(t, e)), n;
  }
  returnCanvasAndContext(t) {
    const e = t.canvas, { width: s, height: i } = e, n = (s << 17) + (i << 1);
    t.context.clearRect(0, 0, s, i), this._canvasPool[n].push(t);
  }
  clear() {
    this._canvasPool = {};
  }
}
const Qt = new rf();
let we = null, Jt = null;
function SS(r, t) {
  we || (we = L.get().createCanvas(256, 128), Jt = we.getContext("2d", { willReadFrequently: true }), Jt.globalCompositeOperation = "copy", Jt.globalAlpha = 1), (we.width < r || we.height < t) && (we.width = fe(r), we.height = fe(t));
}
function sf(r, t, e) {
  for (let s = 0, i = 4 * e * t; s < t; ++s, i += 4) if (r[i + 3] !== 0) return false;
  return true;
}
function nf(r, t, e, s, i) {
  const n = 4 * t;
  for (let o = s, a = s * n + 4 * e; o <= i; ++o, a += n) if (r[a + 3] !== 0) return false;
  return true;
}
function of(...r) {
  var t, e, s;
  let i = r[0];
  i.canvas || (i = { canvas: r[0], resolution: r[1] });
  const { canvas: n } = i, o = Math.min((t = i.resolution) != null ? t : 1, 1), a = (e = i.width) != null ? e : n.width, l3 = (s = i.height) != null ? s : n.height;
  let u3 = i.output;
  if (SS(a, l3), !Jt) throw new TypeError("Failed to get canvas 2D context");
  Jt.drawImage(n, 0, 0, a, l3, 0, 0, a * o, l3 * o);
  const c = Jt.getImageData(0, 0, a, l3).data;
  let h = 0, d = 0, p = a - 1, f2 = l3 - 1;
  for (; d < l3 && sf(c, a, d); ) ++d;
  if (d === l3) return j$1.EMPTY;
  for (; sf(c, a, f2); ) --f2;
  for (; nf(c, a, h, d, f2); ) ++h;
  for (; nf(c, a, p, d, f2); ) --p;
  return ++p, ++f2, Jt.globalCompositeOperation = "source-over", Jt.strokeRect(h, d, p - h, f2 - d), Jt.globalCompositeOperation = "copy", u3 != null || (u3 = new j$1()), u3.set(h / o, d / o, (p - h) / o, (f2 - d) / o), u3;
}
const ES = ["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui"];
function kr(r) {
  const t = typeof r.fontSize == "number" ? `${r.fontSize}px` : r.fontSize;
  let e = r.fontFamily;
  Array.isArray(r.fontFamily) || (e = r.fontFamily.split(","));
  for (let s = e.length - 1; s >= 0; s--) {
    let i = e[s].trim();
    !/([\"\'])[^\'\"]+\1/.test(i) && !ES.includes(i) && (i = `"${i}"`), e[s] = i;
  }
  return `${r.fontStyle} ${r.fontVariant} ${r.fontWeight} ${t} ${e.join(",")}`;
}
const zo = { willReadFrequently: true }, jt = class M {
  static get experimentalLetterSpacingSupported() {
    let t = M._experimentalLetterSpacingSupported;
    if (t === void 0) {
      const e = L.get().getCanvasRenderingContext2D().prototype;
      t = M._experimentalLetterSpacingSupported = "letterSpacing" in e || "textLetterSpacing" in e;
    }
    return t;
  }
  constructor(t, e, s, i, n, o, a, l3, u3) {
    this.text = t, this.style = e, this.width = s, this.height = i, this.lines = n, this.lineWidths = o, this.lineHeight = a, this.maxLineWidth = l3, this.fontProperties = u3;
  }
  static measureText(t = " ", e, s = M._canvas, i = e.wordWrap) {
    var n;
    const o = kr(e), a = M.measureFont(o);
    a.fontSize === 0 && (a.fontSize = e.fontSize, a.ascent = e.fontSize);
    const l3 = M.__context;
    l3.font = o;
    const u3 = (i ? M._wordWrap(t, e, s) : t).split(/(?:\r\n|\r|\n)/), c = new Array(u3.length);
    let h = 0;
    for (let m3 = 0; m3 < u3.length; m3++) {
      const _ = M._measureText(u3[m3], e.letterSpacing, l3);
      c[m3] = _, h = Math.max(h, _);
    }
    const d = ((n = e._stroke) == null ? void 0 : n.width) || 0;
    let p = h + d;
    e.dropShadow && (p += e.dropShadow.distance);
    const f2 = e.lineHeight || a.fontSize;
    let g = Math.max(f2, a.fontSize + d) + (u3.length - 1) * (f2 + e.leading);
    return e.dropShadow && (g += e.dropShadow.distance), new M(t, e, p, g, u3, c, f2 + e.leading, h, a);
  }
  static _measureText(t, e, s) {
    let i = false;
    M.experimentalLetterSpacingSupported && (M.experimentalLetterSpacing ? (s.letterSpacing = `${e}px`, s.textLetterSpacing = `${e}px`, i = true) : (s.letterSpacing = "0px", s.textLetterSpacing = "0px"));
    const n = s.measureText(t);
    let o = n.width;
    const a = -n.actualBoundingBoxLeft;
    let l3 = n.actualBoundingBoxRight - a;
    if (o > 0) if (i) o -= e, l3 -= e;
    else {
      const u3 = (M.graphemeSegmenter(t).length - 1) * e;
      o += u3, l3 += u3;
    }
    return Math.max(o, l3);
  }
  static _wordWrap(t, e, s = M._canvas) {
    const i = s.getContext("2d", zo);
    let n = 0, o = "", a = "";
    const l3 = /* @__PURE__ */ Object.create(null), { letterSpacing: u3, whiteSpace: c } = e, h = M._collapseSpaces(c), d = M._collapseNewlines(c);
    let p = !h;
    const f2 = e.wordWrapWidth + u3, g = M._tokenize(t);
    for (let m3 = 0; m3 < g.length; m3++) {
      let _ = g[m3];
      if (M._isNewline(_)) {
        if (!d) {
          a += M._addLine(o), p = !h, o = "", n = 0;
          continue;
        }
        _ = " ";
      }
      if (h) {
        const v4 = M.isBreakingSpace(_), y4 = M.isBreakingSpace(o[o.length - 1]);
        if (v4 && y4) continue;
      }
      const b = M._getFromCache(_, u3, l3, i);
      if (b > f2) if (o !== "" && (a += M._addLine(o), o = "", n = 0), M.canBreakWords(_, e.breakWords)) {
        const v4 = M.wordWrapSplit(_);
        for (let y4 = 0; y4 < v4.length; y4++) {
          let S3 = v4[y4], T4 = S3, E4 = 1;
          for (; v4[y4 + E4]; ) {
            const C3 = v4[y4 + E4];
            if (!M.canBreakChars(T4, C3, _, y4, e.breakWords)) S3 += C3;
            else break;
            T4 = C3, E4++;
          }
          y4 += E4 - 1;
          const O3 = M._getFromCache(S3, u3, l3, i);
          O3 + n > f2 && (a += M._addLine(o), p = false, o = "", n = 0), o += S3, n += O3;
        }
      } else {
        o.length > 0 && (a += M._addLine(o), o = "", n = 0);
        const v4 = m3 === g.length - 1;
        a += M._addLine(_, !v4), p = false, o = "", n = 0;
      }
      else b + n > f2 && (p = false, a += M._addLine(o), o = "", n = 0), (o.length > 0 || !M.isBreakingSpace(_) || p) && (o += _, n += b);
    }
    return a += M._addLine(o, false), a;
  }
  static _addLine(t, e = true) {
    return t = M._trimRight(t), t = e ? `${t}
` : t, t;
  }
  static _getFromCache(t, e, s, i) {
    let n = s[t];
    return typeof n != "number" && (n = M._measureText(t, e, i) + e, s[t] = n), n;
  }
  static _collapseSpaces(t) {
    return t === "normal" || t === "pre-line";
  }
  static _collapseNewlines(t) {
    return t === "normal";
  }
  static _trimRight(t) {
    if (typeof t != "string") return "";
    for (let e = t.length - 1; e >= 0; e--) {
      const s = t[e];
      if (!M.isBreakingSpace(s)) break;
      t = t.slice(0, -1);
    }
    return t;
  }
  static _isNewline(t) {
    return typeof t != "string" ? false : M._newlines.includes(t.charCodeAt(0));
  }
  static isBreakingSpace(t, e) {
    return typeof t != "string" ? false : M._breakingSpaces.includes(t.charCodeAt(0));
  }
  static _tokenize(t) {
    const e = [];
    let s = "";
    if (typeof t != "string") return e;
    for (let i = 0; i < t.length; i++) {
      const n = t[i], o = t[i + 1];
      if (M.isBreakingSpace(n, o) || M._isNewline(n)) {
        s !== "" && (e.push(s), s = ""), e.push(n);
        continue;
      }
      s += n;
    }
    return s !== "" && e.push(s), e;
  }
  static canBreakWords(t, e) {
    return e;
  }
  static canBreakChars(t, e, s, i, n) {
    return true;
  }
  static wordWrapSplit(t) {
    return M.graphemeSegmenter(t);
  }
  static measureFont(t) {
    if (M._fonts[t]) return M._fonts[t];
    const e = M._context;
    e.font = t;
    const s = e.measureText(M.METRICS_STRING + M.BASELINE_SYMBOL), i = { ascent: s.actualBoundingBoxAscent, descent: s.actualBoundingBoxDescent, fontSize: s.actualBoundingBoxAscent + s.actualBoundingBoxDescent };
    return M._fonts[t] = i, i;
  }
  static clearMetrics(t = "") {
    t ? delete M._fonts[t] : M._fonts = {};
  }
  static get _canvas() {
    if (!M.__canvas) {
      let t;
      try {
        const e = new OffscreenCanvas(0, 0), s = e.getContext("2d", zo);
        if (s != null && s.measureText) return M.__canvas = e, e;
        t = L.get().createCanvas();
      } catch (e) {
        t = L.get().createCanvas();
      }
      t.width = t.height = 10, M.__canvas = t;
    }
    return M.__canvas;
  }
  static get _context() {
    return M.__context || (M.__context = M._canvas.getContext("2d", zo)), M.__context;
  }
};
jt.METRICS_STRING = "|ÉqÅ", jt.BASELINE_SYMBOL = "M", jt.BASELINE_MULTIPLIER = 1.4, jt.HEIGHT_MULTIPLIER = 2, jt.graphemeSegmenter = (() => {
  if (typeof (Intl == null ? void 0 : Intl.Segmenter) == "function") {
    const r = new Intl.Segmenter();
    return (t) => {
      const e = r.segment(t), s = [];
      let i = 0;
      for (const n of e) s[i++] = n.segment;
      return s;
    };
  }
  return (r) => [...r];
})(), jt.experimentalLetterSpacing = false, jt._fonts = {}, jt._newlines = [10, 13], jt._breakingSpaces = [9, 32, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8200, 8201, 8202, 8287, 12288];
let Ot = jt;
const af = 1e5;
function $r(r, t, e, s = 0) {
  var i;
  if (r.texture === A$1.WHITE && !r.fill) return X.shared.setValue(r.color).setAlpha((i = r.alpha) != null ? i : 1).toHexa();
  if (r.fill) {
    if (r.fill instanceof Ir) {
      const n = r.fill, o = t.createPattern(n.texture.source.resource, "repeat"), a = n.transform.copyTo(R$1.shared);
      return a.scale(n.texture.frame.width, n.texture.frame.height), o.setTransform(a), o;
    } else if (r.fill instanceof Ht$1) {
      const n = r.fill, o = n.type === "linear", a = n.textureSpace === "local";
      let l3 = 1, u3 = 1;
      a && e && (l3 = e.width + s, u3 = e.height + s);
      let c, h = false;
      if (o) {
        const { start: d, end: p } = n;
        c = t.createLinearGradient(d.x * l3, d.y * u3, p.x * l3, p.y * u3), h = Math.abs(p.x - d.x) < Math.abs((p.y - d.y) * 0.1);
      } else {
        const { center: d, innerRadius: p, outerCenter: f2, outerRadius: g } = n;
        c = t.createRadialGradient(d.x * l3, d.y * u3, p * l3, f2.x * l3, f2.y * u3, g * l3);
      }
      if (h && a && e) {
        const d = e.lineHeight / u3;
        for (let p = 0; p < e.lines.length; p++) {
          const f2 = (p * e.lineHeight + s / 2) / u3;
          n.colorStops.forEach((g) => {
            const m3 = f2 + g.offset * d;
            c.addColorStop(Math.floor(m3 * af) / af, X.shared.setValue(g.color).toHex());
          });
        }
      } else n.colorStops.forEach((d) => {
        c.addColorStop(d.offset, X.shared.setValue(d.color).toHex());
      });
      return c;
    }
  } else {
    const n = t.createPattern(r.texture.source.resource, "repeat"), o = r.matrix.copyTo(R$1.shared);
    return o.scale(r.texture.frame.width, r.texture.frame.height), n.setTransform(o), n;
  }
  return "red";
}
const lf = new j$1();
let AS = class {
  getCanvasAndContext(t) {
    const { text: e, style: s, resolution: i = 1 } = t, n = s._getFinalPadding(), o = Ot.measureText(e || " ", s), a = Math.ceil(Math.ceil(Math.max(1, o.width) + n * 2) * i), l3 = Math.ceil(Math.ceil(Math.max(1, o.height) + n * 2) * i), u3 = Qt.getOptimalCanvasAndContext(a, l3);
    this._renderTextToCanvas(e, s, n, i, u3);
    const c = s.trim ? of({ canvas: u3.canvas, width: a, height: l3, resolution: 1, output: lf }) : lf.set(0, 0, a, l3);
    return { canvasAndContext: u3, frame: c };
  }
  returnCanvasAndContext(t) {
    Qt.returnCanvasAndContext(t);
  }
  _renderTextToCanvas(t, e, s, i, n) {
    var o, a, l3, u3, c;
    const { canvas: h, context: d } = n, p = kr(e), f2 = Ot.measureText(t || " ", e), g = f2.lines, m3 = f2.lineHeight, _ = f2.lineWidths, b = f2.maxLineWidth, v4 = f2.fontProperties, y4 = h.height;
    if (d.resetTransform(), d.scale(i, i), d.textBaseline = e.textBaseline, (o = e._stroke) != null && o.width) {
      const O3 = e._stroke;
      d.lineWidth = O3.width, d.miterLimit = O3.miterLimit, d.lineJoin = O3.join, d.lineCap = O3.cap;
    }
    d.font = p;
    let S3, T4;
    const E4 = e.dropShadow ? 2 : 1;
    for (let O3 = 0; O3 < E4; ++O3) {
      const C3 = e.dropShadow && O3 === 0, w = C3 ? Math.ceil(Math.max(1, y4) + s * 2) : 0, P = w * i;
      if (C3) {
        d.fillStyle = "black", d.strokeStyle = "black";
        const k3 = e.dropShadow, Vt2 = k3.color, I3 = k3.alpha;
        d.shadowColor = X.shared.setValue(Vt2).setAlpha(I3).toRgbaString();
        const D3 = k3.blur * i, ls = k3.distance * i;
        d.shadowBlur = D3, d.shadowOffsetX = Math.cos(k3.angle) * ls, d.shadowOffsetY = Math.sin(k3.angle) * ls + P;
      } else {
        if (d.fillStyle = e._fill ? $r(e._fill, d, f2) : null, (a = e._stroke) != null && a.width) {
          const k3 = e._stroke.width * e._stroke.alignment;
          d.strokeStyle = $r(e._stroke, d, f2, k3);
        }
        d.shadowColor = "black";
      }
      let B3 = (m3 - v4.fontSize) / 2;
      m3 - v4.fontSize < 0 && (B3 = 0);
      const U3 = (u3 = (l3 = e._stroke) == null ? void 0 : l3.width) != null ? u3 : 0;
      for (let k3 = 0; k3 < g.length; k3++) S3 = U3 / 2, T4 = U3 / 2 + k3 * m3 + v4.ascent + B3, e.align === "right" ? S3 += b - _[k3] : e.align === "center" && (S3 += (b - _[k3]) / 2), (c = e._stroke) != null && c.width && this._drawLetterSpacing(g[k3], e, n, S3 + s, T4 + s - w, true), e._fill !== void 0 && this._drawLetterSpacing(g[k3], e, n, S3 + s, T4 + s - w);
    }
  }
  _drawLetterSpacing(t, e, s, i, n, o = false) {
    const { context: a } = s, l3 = e.letterSpacing;
    let u3 = false;
    if (Ot.experimentalLetterSpacingSupported && (Ot.experimentalLetterSpacing ? (a.letterSpacing = `${l3}px`, a.textLetterSpacing = `${l3}px`, u3 = true) : (a.letterSpacing = "0px", a.textLetterSpacing = "0px")), l3 === 0 || u3) {
      o ? a.strokeText(t, i, n) : a.fillText(t, i, n);
      return;
    }
    let c = i;
    const h = Ot.graphemeSegmenter(t);
    let d = a.measureText(t).width, p = 0;
    for (let f2 = 0; f2 < h.length; ++f2) {
      const g = h[f2];
      o ? a.strokeText(g, c, n) : a.fillText(g, c, n);
      let m3 = "";
      for (let _ = f2 + 1; _ < h.length; ++_) m3 += h[_];
      p = a.measureText(m3).width, c += d - p + l3, d = p;
    }
  }
};
const Ke = new AS();
class Vo {
  constructor(t) {
    this._renderer = t;
  }
  getTexture(t, e, s, i) {
    var n;
    typeof t == "string" && (t = { text: t, style: s, resolution: e }), t.style instanceof Dt$1 || (t.style = new Dt$1(t.style)), t.textureStyle instanceof Pt$1 || (t.textureStyle = new Pt$1(t.textureStyle)), typeof t.text != "string" && (t.text = t.text.toString());
    const { text: o, style: a, textureStyle: l3 } = t, u3 = (n = t.resolution) != null ? n : this._renderer.resolution, { frame: c, canvasAndContext: h } = Ke.getCanvasAndContext({ text: o, style: a, resolution: u3 }), d = jo(h.canvas, c.width, c.height, u3);
    if (l3 && (d.source.style = l3), a.trim && (c.pad(a.padding), d.frame.copyFrom(c), d.updateUvs()), a.filters) {
      const p = this._applyFilters(d, a.filters);
      return this.returnTexture(d), Ke.returnCanvasAndContext(h), p;
    }
    return this._renderer.texture.initSource(d._source), Ke.returnCanvasAndContext(h), d;
  }
  returnTexture(t) {
    const e = t.source;
    e.resource = null, e.uploadMethodId = "unknown", e.alphaMode = "no-premultiply-alpha", tt$1.returnTexture(t, true);
  }
  renderTextToCanvas() {
  }
  _applyFilters(t, e) {
    const s = this._renderer.renderTarget.renderTarget, i = this._renderer.filter.generateFilteredTexture({ texture: t, filters: e });
    return this._renderer.renderTarget.bind(s, false), i;
  }
  destroy() {
    this._renderer = null;
  }
}
Vo.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem, x$1.CanvasSystem], name: "canvasText" }, G$1.add(Vo), G$1.add(Mo);
var wS = Object.defineProperty, ei = Object.getOwnPropertySymbols, uf = Object.prototype.hasOwnProperty, cf = Object.prototype.propertyIsEnumerable, hf = (r, t, e) => t in r ? wS(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, PS = (r, t) => {
  for (var e in t || (t = {})) uf.call(t, e) && hf(r, e, t[e]);
  if (ei) for (var e of ei(t)) cf.call(t, e) && hf(r, e, t[e]);
  return r;
}, RS = (r, t) => {
  var e = {};
  for (var s in r) uf.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && ei) for (var s of ei(r)) t.indexOf(s) < 0 && cf.call(r, s) && (e[s] = r[s]);
  return e;
};
class lr extends Lt$1 {
  constructor(t) {
    t instanceof ct && (t = { context: t });
    const e = t || {}, { context: s, roundPixels: i } = e, n = RS(e, ["context", "roundPixels"]);
    super(PS({ label: "Graphics" }, n)), this.renderPipeId = "graphics", s ? this._context = s : this._context = this._ownedContext = new ct(), this._context.on("update", this.onViewUpdate, this), this.didViewUpdate = true, this.allowChildren = false, this.roundPixels = i != null ? i : false;
  }
  set context(t) {
    t !== this._context && (this._context.off("update", this.onViewUpdate, this), this._context = t, this._context.on("update", this.onViewUpdate, this), this.onViewUpdate());
  }
  get context() {
    return this._context;
  }
  get bounds() {
    return this._context.bounds;
  }
  updateBounds() {
  }
  containsPoint(t) {
    return this._context.containsPoint(t);
  }
  destroy(t) {
    this._ownedContext && !t ? this._ownedContext.destroy(t) : (t === true || (t == null ? void 0 : t.context) === true) && this._context.destroy(t), this._ownedContext = null, this._context = null, super.destroy(t);
  }
  _callContextMethod(t, e) {
    return this.context[t](...e), this;
  }
  setFillStyle(...t) {
    return this._callContextMethod("setFillStyle", t);
  }
  setStrokeStyle(...t) {
    return this._callContextMethod("setStrokeStyle", t);
  }
  fill(...t) {
    return this._callContextMethod("fill", t);
  }
  stroke(...t) {
    return this._callContextMethod("stroke", t);
  }
  texture(...t) {
    return this._callContextMethod("texture", t);
  }
  beginPath() {
    return this._callContextMethod("beginPath", []);
  }
  cut() {
    return this._callContextMethod("cut", []);
  }
  arc(...t) {
    return this._callContextMethod("arc", t);
  }
  arcTo(...t) {
    return this._callContextMethod("arcTo", t);
  }
  arcToSvg(...t) {
    return this._callContextMethod("arcToSvg", t);
  }
  bezierCurveTo(...t) {
    return this._callContextMethod("bezierCurveTo", t);
  }
  closePath() {
    return this._callContextMethod("closePath", []);
  }
  ellipse(...t) {
    return this._callContextMethod("ellipse", t);
  }
  circle(...t) {
    return this._callContextMethod("circle", t);
  }
  path(...t) {
    return this._callContextMethod("path", t);
  }
  lineTo(...t) {
    return this._callContextMethod("lineTo", t);
  }
  moveTo(...t) {
    return this._callContextMethod("moveTo", t);
  }
  quadraticCurveTo(...t) {
    return this._callContextMethod("quadraticCurveTo", t);
  }
  rect(...t) {
    return this._callContextMethod("rect", t);
  }
  roundRect(...t) {
    return this._callContextMethod("roundRect", t);
  }
  poly(...t) {
    return this._callContextMethod("poly", t);
  }
  regularPoly(...t) {
    return this._callContextMethod("regularPoly", t);
  }
  roundPoly(...t) {
    return this._callContextMethod("roundPoly", t);
  }
  roundShape(...t) {
    return this._callContextMethod("roundShape", t);
  }
  filletRect(...t) {
    return this._callContextMethod("filletRect", t);
  }
  chamferRect(...t) {
    return this._callContextMethod("chamferRect", t);
  }
  star(...t) {
    return this._callContextMethod("star", t);
  }
  svg(...t) {
    return this._callContextMethod("svg", t);
  }
  restore(...t) {
    return this._callContextMethod("restore", t);
  }
  save() {
    return this._callContextMethod("save", []);
  }
  getTransform() {
    return this.context.getTransform();
  }
  resetTransform() {
    return this._callContextMethod("resetTransform", []);
  }
  rotateTransform(...t) {
    return this._callContextMethod("rotate", t);
  }
  scaleTransform(...t) {
    return this._callContextMethod("scale", t);
  }
  setTransform(...t) {
    return this._callContextMethod("setTransform", t);
  }
  transform(...t) {
    return this._callContextMethod("transform", t);
  }
  translateTransform(...t) {
    return this._callContextMethod("translate", t);
  }
  clear() {
    return this._callContextMethod("clear", []);
  }
  get fillStyle() {
    return this._context.fillStyle;
  }
  set fillStyle(t) {
    this._context.fillStyle = t;
  }
  get strokeStyle() {
    return this._context.strokeStyle;
  }
  set strokeStyle(t) {
    this._context.strokeStyle = t;
  }
  clone(t = false) {
    return t ? new lr(this._context.clone()) : (this._ownedContext = null, new lr(this._context));
  }
  lineStyle(t, e, s) {
    const i = {};
    return t && (i.width = t), e && (i.color = e), s && (i.alpha = s), this.context.strokeStyle = i, this;
  }
  beginFill(t, e) {
    const s = {};
    return t !== void 0 && (s.color = t), e !== void 0 && (s.alpha = e), this.context.fillStyle = s, this;
  }
  endFill() {
    this.context.fill();
    const t = this.context.strokeStyle;
    return (t.width !== ct.defaultStrokeStyle.width || t.color !== ct.defaultStrokeStyle.color || t.alpha !== ct.defaultStrokeStyle.alpha) && this.context.stroke(), this;
  }
  drawCircle(...t) {
    return this._callContextMethod("circle", t);
  }
  drawEllipse(...t) {
    return this._callContextMethod("ellipse", t);
  }
  drawPolygon(...t) {
    return this._callContextMethod("poly", t);
  }
  drawRect(...t) {
    return this._callContextMethod("rect", t);
  }
  drawRoundedRect(...t) {
    return this._callContextMethod("roundRect", t);
  }
  drawStar(...t) {
    return this._callContextMethod("star", t);
  }
}
const df = { name: "local-uniform-msdf-bit", vertex: { header: `
struct LocalUniforms {
uColor:vec4<f32>,
uTransformMatrix:mat3x3<f32>,
uDistance: f32,
uRound:f32,
}

@group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
`, main: `
vColor *= localUniforms.uColor;
modelMatrix *= localUniforms.uTransformMatrix;
`, end: `
if(localUniforms.uRound == 1)
{
vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
}
` }, fragment: { header: `
struct LocalUniforms {
uColor:vec4<f32>,
uTransformMatrix:mat3x3<f32>,
uDistance: f32
}

@group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
`, main: `
outColor = vec4<f32>(calculateMSDFAlpha(outColor, localUniforms.uColor, localUniforms.uDistance));
` } }, pf = { name: "local-uniform-msdf-bit", vertex: { header: `
uniform mat3 uTransformMatrix;
uniform vec4 uColor;
uniform float uRound;
`, main: `
vColor *= uColor;
modelMatrix *= uTransformMatrix;
`, end: `
if(uRound == 1.)
{
gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
}
` }, fragment: { header: `
uniform float uDistance;
`, main: `
outColor = vec4(calculateMSDFAlpha(outColor, vColor, uDistance));
` } }, ff = { name: "msdf-bit", fragment: { header: `
fn calculateMSDFAlpha(msdfColor:vec4<f32>, shapeColor:vec4<f32>, distance:f32) -> f32 {

// MSDF
var median = msdfColor.r + msdfColor.g + msdfColor.b -
min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
max(msdfColor.r, max(msdfColor.g, msdfColor.b));

// SDF
median = min(median, msdfColor.a);

var screenPxDistance = distance * (median - 0.5);
var alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
if (median < 0.01) {
alpha = 0.0;
} else if (median > 0.99) {
alpha = 1.0;
}

// Gamma correction for coverage-like alpha
var luma: f32 = dot(shapeColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
var gamma: f32 = mix(1.0, 1.0 / 2.2, luma);
var coverage: f32 = pow(shapeColor.a * alpha, gamma);

return coverage;

}
` } }, mf = { name: "msdf-bit", fragment: { header: `
float calculateMSDFAlpha(vec4 msdfColor, vec4 shapeColor, float distance) {

// MSDF
float median = msdfColor.r + msdfColor.g + msdfColor.b -
            min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
            max(msdfColor.r, max(msdfColor.g, msdfColor.b));

// SDF
median = min(median, msdfColor.a);

float screenPxDistance = distance * (median - 0.5);
float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);

if (median < 0.01) {
alpha = 0.0;
} else if (median > 0.99) {
alpha = 1.0;
}

// Gamma correction for coverage-like alpha
float luma = dot(shapeColor.rgb, vec3(0.299, 0.587, 0.114));
float gamma = mix(1.0, 1.0 / 2.2, luma);
float coverage = pow(shapeColor.a * alpha, gamma);

return coverage;
}
` } };
let Wo, Yo;
class gf extends At$1 {
  constructor(t) {
    const e = new et$1({ uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" }, uTransformMatrix: { value: new R$1(), type: "mat3x3<f32>" }, uDistance: { value: 4, type: "f32" }, uRound: { value: 0, type: "f32" } });
    Wo != null || (Wo = Le({ name: "sdf-shader", bits: [Ds, ks(t), df, ff, Xe] })), Yo != null || (Yo = Ne({ name: "sdf-shader", bits: [Us, $s(t), pf, mf, He] })), super({ glProgram: Yo, gpuProgram: Wo, resources: { localUniforms: e, batchSamplers: Ls(t) } });
  }
}
class Ko extends dt {
  constructor() {
    super(...arguments), this.chars = /* @__PURE__ */ Object.create(null), this.lineHeight = 0, this.fontFamily = "", this.fontMetrics = { fontSize: 0, ascent: 0, descent: 0 }, this.baseLineOffset = 0, this.distanceField = { type: "none", range: 0 }, this.pages = [], this.applyFillAsTint = true, this.baseMeasurementFontSize = 100, this.baseRenderedFontSize = 100;
  }
  get font() {
    return this.fontFamily;
  }
  get pageTextures() {
    return this.pages;
  }
  get size() {
    return this.fontMetrics.fontSize;
  }
  get distanceFieldRange() {
    return this.distanceField.range;
  }
  get distanceFieldType() {
    return this.distanceField.type;
  }
  destroy(t = false) {
    var e;
    this.emit("destroy", this), this.removeAllListeners();
    for (const s in this.chars) (e = this.chars[s].texture) == null || e.destroy();
    this.chars = null, t && (this.pages.forEach((s) => s.texture.destroy(true)), this.pages = null);
  }
}
var MS = Object.defineProperty, _f = Object.getOwnPropertySymbols, CS = Object.prototype.hasOwnProperty, OS = Object.prototype.propertyIsEnumerable, xf = (r, t, e) => t in r ? MS(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, bf = (r, t) => {
  for (var e in t || (t = {})) CS.call(t, e) && xf(r, e, t[e]);
  if (_f) for (var e of _f(t)) OS.call(t, e) && xf(r, e, t[e]);
  return r;
};
const vf = class Qv extends Ko {
  constructor(t) {
    var e, s, i;
    super(), this.resolution = 1, this.pages = [], this._padding = 0, this._measureCache = /* @__PURE__ */ Object.create(null), this._currentChars = [], this._currentX = 0, this._currentY = 0, this._currentMaxCharHeight = 0, this._currentPageIndex = -1, this._skipKerning = false;
    const n = bf(bf({}, Qv.defaultOptions), t);
    this._textureSize = n.textureSize, this._mipmap = n.mipmap;
    const o = n.style.clone();
    n.overrideFill && (o._fill.color = 16777215, o._fill.alpha = 1, o._fill.texture = A$1.WHITE, o._fill.fill = null), this.applyFillAsTint = n.overrideFill;
    const a = o.fontSize;
    o.fontSize = this.baseMeasurementFontSize;
    const l3 = kr(o);
    n.overrideSize ? o._stroke && (o._stroke.width *= this.baseRenderedFontSize / a) : o.fontSize = this.baseRenderedFontSize = a, this._style = o, this._skipKerning = (e = n.skipKerning) != null ? e : false, this.resolution = (s = n.resolution) != null ? s : 1, this._padding = (i = n.padding) != null ? i : 4, n.textureStyle && (this._textureStyle = n.textureStyle instanceof Pt$1 ? n.textureStyle : new Pt$1(n.textureStyle)), this.fontMetrics = Ot.measureFont(l3), this.lineHeight = o.lineHeight || this.fontMetrics.fontSize || o.fontSize;
  }
  ensureCharacters(t) {
    var e, s, i, n;
    const o = Ot.graphemeSegmenter(t).filter((y4) => !this._currentChars.includes(y4)).filter((y4, S3, T4) => T4.indexOf(y4) === S3);
    if (!o.length) return;
    this._currentChars = [...this._currentChars, ...o];
    let a;
    this._currentPageIndex === -1 ? a = this._nextPage() : a = this.pages[this._currentPageIndex];
    let { canvas: l3, context: u3 } = a.canvasAndContext, c = a.texture.source;
    const h = this._style;
    let d = this._currentX, p = this._currentY, f2 = this._currentMaxCharHeight;
    const g = this.baseRenderedFontSize / this.baseMeasurementFontSize, m3 = this._padding * g;
    let _ = false;
    const b = l3.width / this.resolution, v4 = l3.height / this.resolution;
    for (let y4 = 0; y4 < o.length; y4++) {
      const S3 = o[y4], T4 = Ot.measureText(S3, h, l3, false);
      T4.lineHeight = T4.height;
      const E4 = T4.width * g, O3 = Math.ceil((h.fontStyle === "italic" ? 2 : 1) * E4), C3 = T4.height * g, w = O3 + m3 * 2, P = C3 + m3 * 2;
      if (_ = false, S3 !== `
` && S3 !== "\r" && S3 !== "	" && S3 !== " " && (_ = true, f2 = Math.ceil(Math.max(P, f2))), d + w > b && (p += f2, f2 = P, d = 0, p + f2 > v4)) {
        c.update();
        const U3 = this._nextPage();
        l3 = U3.canvasAndContext.canvas, u3 = U3.canvasAndContext.context, c = U3.texture.source, d = 0, p = 0, f2 = 0;
      }
      const B3 = E4 / g - ((s = (e = h.dropShadow) == null ? void 0 : e.distance) != null ? s : 0) - ((n = (i = h._stroke) == null ? void 0 : i.width) != null ? n : 0);
      if (this.chars[S3] = { id: S3.codePointAt(0), xOffset: -this._padding, yOffset: -this._padding, xAdvance: B3, kerning: {} }, _) {
        this._drawGlyph(u3, T4, d + m3, p + m3, g, h);
        const U3 = c.width * g, k3 = c.height * g, Vt2 = new j$1(d / U3 * c.width, p / k3 * c.height, w / U3 * c.width, P / k3 * c.height);
        this.chars[S3].texture = new A$1({ source: c, frame: Vt2 }), d += Math.ceil(w);
      }
    }
    c.update(), this._currentX = d, this._currentY = p, this._currentMaxCharHeight = f2, this._skipKerning && this._applyKerning(o, u3);
  }
  get pageTextures() {
    return this.pages;
  }
  _applyKerning(t, e) {
    const s = this._measureCache;
    for (let i = 0; i < t.length; i++) {
      const n = t[i];
      for (let o = 0; o < this._currentChars.length; o++) {
        const a = this._currentChars[o];
        let l3 = s[n];
        l3 || (l3 = s[n] = e.measureText(n).width);
        let u3 = s[a];
        u3 || (u3 = s[a] = e.measureText(a).width);
        let c = e.measureText(n + a).width, h = c - (l3 + u3);
        h && (this.chars[n].kerning[a] = h), c = e.measureText(n + a).width, h = c - (l3 + u3), h && (this.chars[a].kerning[n] = h);
      }
    }
  }
  _nextPage() {
    this._currentPageIndex++;
    const t = this.resolution, e = Qt.getOptimalCanvasAndContext(this._textureSize, this._textureSize, t);
    this._setupContext(e.context, this._style, t);
    const s = t * (this.baseRenderedFontSize / this.baseMeasurementFontSize), i = new A$1({ source: new ie({ resource: e.canvas, resolution: s, alphaMode: "premultiply-alpha-on-upload", autoGenerateMipmaps: this._mipmap }) });
    this._textureStyle && (i.source.style = this._textureStyle);
    const n = { canvasAndContext: e, texture: i };
    return this.pages[this._currentPageIndex] = n, n;
  }
  _setupContext(t, e, s) {
    var i;
    e.fontSize = this.baseRenderedFontSize, t.scale(s, s), t.font = kr(e), e.fontSize = this.baseMeasurementFontSize, t.textBaseline = e.textBaseline;
    const n = e._stroke, o = (i = n == null ? void 0 : n.width) != null ? i : 0;
    if (n && (t.lineWidth = o, t.lineJoin = n.join, t.miterLimit = n.miterLimit, t.strokeStyle = $r(n, t)), e._fill && (t.fillStyle = $r(e._fill, t)), e.dropShadow) {
      const a = e.dropShadow, l3 = X.shared.setValue(a.color).toArray(), u3 = a.blur * s, c = a.distance * s;
      t.shadowColor = `rgba(${l3[0] * 255},${l3[1] * 255},${l3[2] * 255},${a.alpha})`, t.shadowBlur = u3, t.shadowOffsetX = Math.cos(a.angle) * c, t.shadowOffsetY = Math.sin(a.angle) * c;
    } else t.shadowColor = "black", t.shadowBlur = 0, t.shadowOffsetX = 0, t.shadowOffsetY = 0;
  }
  _drawGlyph(t, e, s, i, n, o) {
    var a;
    const l3 = e.text, u3 = e.fontProperties, c = o._stroke, h = ((a = c == null ? void 0 : c.width) != null ? a : 0) * n, d = s + h / 2, p = i - h / 2, f2 = u3.descent * n, g = e.lineHeight * n;
    o.stroke && h && t.strokeText(l3, d, p + g - f2), o._fill && t.fillText(l3, d, p + g - f2);
  }
  destroy() {
    super.destroy();
    for (let t = 0; t < this.pages.length; t++) {
      const { canvasAndContext: e, texture: s } = this.pages[t];
      Qt.returnCanvasAndContext(e), s.destroy(true);
    }
    this.pages = null;
  }
};
vf.defaultOptions = { textureSize: 512, style: new Dt$1(), mipmap: true };
let qo = vf;
function Zo(r, t, e, s) {
  const i = { width: 0, height: 0, offsetY: 0, scale: t.fontSize / e.baseMeasurementFontSize, lines: [{ width: 0, charPositions: [], spaceWidth: 0, spacesIndex: [], chars: [] }] };
  i.offsetY = e.baseLineOffset;
  let n = i.lines[0], o = null, a = true;
  const l3 = { spaceWord: false, width: 0, start: 0, index: 0, positions: [], chars: [] }, u3 = (f2) => {
    const g = n.width;
    for (let m3 = 0; m3 < l3.index; m3++) {
      const _ = f2.positions[m3];
      n.chars.push(f2.chars[m3]), n.charPositions.push(_ + g);
    }
    n.width += f2.width, a = false, l3.width = 0, l3.index = 0, l3.chars.length = 0;
  }, c = () => {
    let f2 = n.chars.length - 1;
    if (s) {
      let g = n.chars[f2];
      for (; g === " "; ) n.width -= e.chars[g].xAdvance, g = n.chars[--f2];
    }
    i.width = Math.max(i.width, n.width), n = { width: 0, charPositions: [], chars: [], spaceWidth: 0, spacesIndex: [] }, a = true, i.lines.push(n), i.height += e.lineHeight;
  }, h = e.baseMeasurementFontSize / t.fontSize, d = t.letterSpacing * h, p = t.wordWrapWidth * h;
  for (let f2 = 0; f2 < r.length + 1; f2++) {
    let g;
    const m3 = f2 === r.length;
    m3 || (g = r[f2]);
    const _ = e.chars[g] || e.chars[" "];
    if (/(?:\s)/.test(g) || g === "\r" || g === `
` || m3) {
      if (!a && t.wordWrap && n.width + l3.width - d > p ? (c(), u3(l3), m3 || n.charPositions.push(0)) : (l3.start = n.width, u3(l3), m3 || n.charPositions.push(0)), g === "\r" || g === `
`) n.width !== 0 && c();
      else if (!m3) {
        const b = _.xAdvance + (_.kerning[o] || 0) + d;
        n.width += b, n.spaceWidth = b, n.spacesIndex.push(n.charPositions.length), n.chars.push(g);
      }
    } else {
      const b = _.kerning[o] || 0, v4 = _.xAdvance + b + d;
      l3.positions[l3.index++] = l3.width + b, l3.chars.push(g), l3.width += v4;
    }
    o = g;
  }
  return c(), t.align === "center" ? GS(i) : t.align === "right" ? IS(i) : t.align === "justify" && BS(i), i;
}
function GS(r) {
  for (let t = 0; t < r.lines.length; t++) {
    const e = r.lines[t], s = r.width / 2 - e.width / 2;
    for (let i = 0; i < e.charPositions.length; i++) e.charPositions[i] += s;
  }
}
function IS(r) {
  for (let t = 0; t < r.lines.length; t++) {
    const e = r.lines[t], s = r.width - e.width;
    for (let i = 0; i < e.charPositions.length; i++) e.charPositions[i] += s;
  }
}
function BS(r) {
  const t = r.width;
  for (let e = 0; e < r.lines.length; e++) {
    const s = r.lines[e];
    let i = 0, n = s.spacesIndex[i++], o = 0;
    const a = s.spacesIndex.length, l3 = (t - s.width) / a;
    for (let u3 = 0; u3 < s.charPositions.length; u3++) u3 === n && (n = s.spacesIndex[i++], o += l3), s.charPositions[u3] += o;
  }
}
function yf(r) {
  if (r === "") return [];
  typeof r == "string" && (r = [r]);
  const t = [];
  for (let e = 0, s = r.length; e < s; e++) {
    const i = r[e];
    if (Array.isArray(i)) {
      if (i.length !== 2) throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${i.length}.`);
      if (i[0].length === 0 || i[1].length === 0) throw new Error("[BitmapFont]: Invalid character delimiter.");
      const n = i[0].charCodeAt(0), o = i[1].charCodeAt(0);
      if (o < n) throw new Error("[BitmapFont]: Invalid character range.");
      for (let a = n, l3 = o; a <= l3; a++) t.push(String.fromCharCode(a));
    } else t.push(...Array.from(i));
  }
  if (t.length === 0) throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return t;
}
var FS = Object.defineProperty, Tf = Object.getOwnPropertySymbols, DS = Object.prototype.hasOwnProperty, US = Object.prototype.propertyIsEnumerable, Sf = (r, t, e) => t in r ? FS(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Qo = (r, t) => {
  for (var e in t || (t = {})) DS.call(t, e) && Sf(r, e, t[e]);
  if (Tf) for (var e of Tf(t)) US.call(t, e) && Sf(r, e, t[e]);
  return r;
};
let ri = 0, kS = class {
  constructor() {
    this.ALPHA = [["a", "z"], ["A", "Z"], " "], this.NUMERIC = [["0", "9"]], this.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "], this.ASCII = [[" ", "~"]], this.defaultOptions = { chars: this.ALPHANUMERIC, resolution: 1, padding: 4, skipKerning: false, textureStyle: null };
  }
  getFont(t, e) {
    var s;
    let i = `${e.fontFamily}-bitmap`, n = true;
    if (e._fill.fill && !e._stroke) i += e._fill.fill.styleKey, n = false;
    else if (e._stroke || e.dropShadow) {
      let a = e.styleKey;
      a = a.substring(0, a.lastIndexOf("-")), i = `${a}-bitmap`, n = false;
    }
    if (!V$1.has(i)) {
      const a = new qo(Qo({ style: e, overrideFill: n, overrideSize: true }, this.defaultOptions));
      ri++, ri > 50 && Ct$1("BitmapText", `You have dynamically created ${ri} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``), a.once("destroy", () => {
        ri--, V$1.remove(i);
      }), V$1.set(i, a);
    }
    const o = V$1.get(i);
    return (s = o.ensureCharacters) == null || s.call(o, t), o;
  }
  getLayout(t, e, s = true) {
    const i = this.getFont(t, e), n = Ot.graphemeSegmenter(t);
    return Zo(n, e, i, s);
  }
  measureText(t, e, s = true) {
    return this.getLayout(t, e, s);
  }
  install(...t) {
    var e, s, i, n;
    let o = t[0];
    typeof o == "string" && (o = { name: o, style: t[1], chars: (e = t[2]) == null ? void 0 : e.chars, resolution: (s = t[2]) == null ? void 0 : s.resolution, padding: (i = t[2]) == null ? void 0 : i.padding, skipKerning: (n = t[2]) == null ? void 0 : n.skipKerning });
    const a = o == null ? void 0 : o.name;
    if (!a) throw new Error("[BitmapFontManager] Property `name` is required.");
    o = Qo(Qo({}, this.defaultOptions), o);
    const l3 = o.style, u3 = l3 instanceof Dt$1 ? l3 : new Dt$1(l3), c = u3._fill.fill !== null && u3._fill.fill !== void 0, h = new qo({ style: u3, overrideFill: c, skipKerning: o.skipKerning, padding: o.padding, resolution: o.resolution, overrideSize: false, textureStyle: o.textureStyle }), d = yf(o.chars);
    return h.ensureCharacters(d.join("")), V$1.set(`${a}-bitmap`, h), h.once("destroy", () => V$1.remove(`${a}-bitmap`)), h;
  }
  uninstall(t) {
    const e = `${t}-bitmap`, s = V$1.get(e);
    s && s.destroy();
  }
};
const Lr = new kS();
class Ef extends lr {
  destroy() {
    this.context.customShader && this.context.customShader.destroy(), super.destroy();
  }
}
class Jo {
  constructor(t) {
    this._renderer = t, this._renderer.renderableGC.addManagedHash(this, "_gpuBitmapText");
  }
  validateRenderable(t) {
    const e = this._getGpuBitmapText(t);
    return t._didTextUpdate && (t._didTextUpdate = false, this._updateContext(t, e)), this._renderer.renderPipes.graphics.validateRenderable(e);
  }
  addRenderable(t, e) {
    const s = this._getGpuBitmapText(t);
    Af(t, s), t._didTextUpdate && (t._didTextUpdate = false, this._updateContext(t, s)), this._renderer.renderPipes.graphics.addRenderable(s, e), s.context.customShader && this._updateDistanceField(t);
  }
  updateRenderable(t) {
    const e = this._getGpuBitmapText(t);
    Af(t, e), this._renderer.renderPipes.graphics.updateRenderable(e), e.context.customShader && this._updateDistanceField(t);
  }
  _updateContext(t, e) {
    const { context: s } = e, i = Lr.getFont(t.text, t._style);
    s.clear(), i.distanceField.type !== "none" && (s.customShader || (s.customShader = new gf(this._renderer.limits.maxBatchableTextures)));
    const n = Ot.graphemeSegmenter(t.text), o = t._style;
    let a = i.baseLineOffset;
    const l3 = Zo(n, o, i, true);
    let u3 = 0;
    const c = o.padding, h = l3.scale;
    let d = l3.width, p = l3.height + l3.offsetY;
    o._stroke && (d += o._stroke.width / h, p += o._stroke.width / h), s.translate(-t._anchor._x * d - c, -t._anchor._y * p - c).scale(h, h);
    const f2 = i.applyFillAsTint ? o._fill.color : 16777215;
    for (let g = 0; g < l3.lines.length; g++) {
      const m3 = l3.lines[g];
      for (let _ = 0; _ < m3.charPositions.length; _++) {
        const b = n[u3++], v4 = i.chars[b];
        v4 != null && v4.texture && s.texture(v4.texture, f2 || "black", Math.round(m3.charPositions[_] + v4.xOffset), Math.round(a + v4.yOffset));
      }
      a += i.lineHeight;
    }
  }
  _getGpuBitmapText(t) {
    return t._gpuData[this._renderer.uid] || this.initGpuText(t);
  }
  initGpuText(t) {
    const e = new Ef();
    return t._gpuData[this._renderer.uid] = e, this._updateContext(t, e), e;
  }
  _updateDistanceField(t) {
    const e = this._getGpuBitmapText(t).context, s = t._style.fontFamily, i = V$1.get(`${s}-bitmap`), { a: n, b: o, c: a, d: l3 } = t.groupTransform, u3 = Math.sqrt(n * n + o * o), c = Math.sqrt(a * a + l3 * l3), h = (Math.abs(u3) + Math.abs(c)) / 2, d = i.baseRenderedFontSize / t._style.fontSize, p = h * i.distanceField.range * (1 / d);
    e.customShader.resources.localUniforms.uniforms.uDistance = p;
  }
  destroy() {
    this._renderer = null;
  }
}
Jo.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "bitmapText" };
function Af(r, t) {
  t.groupTransform = r.groupTransform, t.groupColorAlpha = r.groupColorAlpha, t.groupColor = r.groupColor, t.groupBlendMode = r.groupBlendMode, t.globalDisplayStatus = r.globalDisplayStatus, t.groupTransform = r.groupTransform, t.localDisplayStatus = r.localDisplayStatus, t.groupAlpha = r.groupAlpha, t._roundPixels = r._roundPixels;
}
G$1.add(Jo);
class wf extends Gr {
  constructor(t) {
    super(), this.generatingTexture = false, this._renderer = t, t.runners.resolutionChange.add(this);
  }
  resolutionChange() {
    const t = this.renderable;
    t._autoResolution && t.onViewUpdate();
  }
  destroy() {
    this._renderer.htmlText.returnTexturePromise(this.texturePromise), this.texturePromise = null, this._renderer = null;
  }
}
class ta {
  constructor(t) {
    this._renderer = t;
  }
  validateRenderable(t) {
    return t._didTextUpdate;
  }
  addRenderable(t, e) {
    const s = this._getGpuText(t);
    t._didTextUpdate && (this._updateGpuText(t).catch((i) => {
      console.error(i);
    }), t._didTextUpdate = false, qs(s, t)), this._renderer.renderPipes.batch.addToBatch(s, e);
  }
  updateRenderable(t) {
    const e = this._getGpuText(t);
    e._batcher.updateElement(e);
  }
  async _updateGpuText(t) {
    t._didTextUpdate = false;
    const e = this._getGpuText(t);
    if (e.generatingTexture) return;
    e.texturePromise && (this._renderer.htmlText.returnTexturePromise(e.texturePromise), e.texturePromise = null), e.generatingTexture = true, t._resolution = t._autoResolution ? this._renderer.resolution : t.resolution;
    const s = this._renderer.htmlText.getTexturePromise(t);
    e.texturePromise = s, e.texture = await s;
    const i = t.renderGroup || t.parentRenderGroup;
    i && (i.structureDidChange = true), e.generatingTexture = false, qs(e, t);
  }
  _getGpuText(t) {
    return t._gpuData[this._renderer.uid] || this.initGpuText(t);
  }
  initGpuText(t) {
    const e = new wf(this._renderer);
    return e.renderable = t, e.transform = t.groupTransform, e.texture = A$1.EMPTY, e.bounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, e.roundPixels = this._renderer._roundPixels | t._roundPixels, t._resolution = t._autoResolution ? this._renderer.resolution : t.resolution, t._gpuData[this._renderer.uid] = e, e;
  }
  destroy() {
    this._renderer = null;
  }
}
ta.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "htmlText" };
function Pf() {
  const { userAgent: r } = L.get().getNavigator();
  return /^((?!chrome|android).)*safari/i.test(r);
}
const Rf = "http://www.w3.org/2000/svg", Mf = "http://www.w3.org/1999/xhtml";
class ea {
  constructor() {
    this.svgRoot = document.createElementNS(Rf, "svg"), this.foreignObject = document.createElementNS(Rf, "foreignObject"), this.domElement = document.createElementNS(Mf, "div"), this.styleElement = document.createElementNS(Mf, "style"), this.image = new Image();
    const { foreignObject: t, svgRoot: e, styleElement: s, domElement: i } = this;
    t.setAttribute("width", "10000"), t.setAttribute("height", "10000"), t.style.overflow = "hidden", e.appendChild(t), t.appendChild(s), t.appendChild(i);
  }
}
function Cf(r) {
  const t = r._stroke, e = r._fill, s = [`div { ${[`color: ${X.shared.setValue(e.color).toHex()}`, `font-size: ${r.fontSize}px`, `font-family: ${r.fontFamily}`, `font-weight: ${r.fontWeight}`, `font-style: ${r.fontStyle}`, `font-variant: ${r.fontVariant}`, `letter-spacing: ${r.letterSpacing}px`, `text-align: ${r.align}`, `padding: ${r.padding}px`, `white-space: ${r.whiteSpace === "pre" && r.wordWrap ? "pre-wrap" : r.whiteSpace}`, ...r.lineHeight ? [`line-height: ${r.lineHeight}px`] : [], ...r.wordWrap ? [`word-wrap: ${r.breakWords ? "break-all" : "break-word"}`, `max-width: ${r.wordWrapWidth}px`] : [], ...t ? [Gf(t)] : [], ...r.dropShadow ? [Of(r.dropShadow)] : [], ...r.cssOverrides].join(";")} }`];
  return $S(r.tagStyles, s), s.join(" ");
}
function Of(r) {
  const t = X.shared.setValue(r.color).setAlpha(r.alpha).toHexa(), e = Math.round(Math.cos(r.angle) * r.distance), s = Math.round(Math.sin(r.angle) * r.distance), i = `${e}px ${s}px`;
  return r.blur > 0 ? `text-shadow: ${i} ${r.blur}px ${t}` : `text-shadow: ${i} ${t}`;
}
function Gf(r) {
  return [`-webkit-text-stroke-width: ${r.width}px`, `-webkit-text-stroke-color: ${X.shared.setValue(r.color).toHex()}`, `text-stroke-width: ${r.width}px`, `text-stroke-color: ${X.shared.setValue(r.color).toHex()}`, "paint-order: stroke"].join(";");
}
const If = { fontSize: "font-size: {{VALUE}}px", fontFamily: "font-family: {{VALUE}}", fontWeight: "font-weight: {{VALUE}}", fontStyle: "font-style: {{VALUE}}", fontVariant: "font-variant: {{VALUE}}", letterSpacing: "letter-spacing: {{VALUE}}px", align: "text-align: {{VALUE}}", padding: "padding: {{VALUE}}px", whiteSpace: "white-space: {{VALUE}}", lineHeight: "line-height: {{VALUE}}px", wordWrapWidth: "max-width: {{VALUE}}px" }, Bf = { fill: (r) => `color: ${X.shared.setValue(r).toHex()}`, breakWords: (r) => `word-wrap: ${r ? "break-all" : "break-word"}`, stroke: Gf, dropShadow: Of };
function $S(r, t) {
  for (const e in r) {
    const s = r[e], i = [];
    for (const n in s) Bf[n] ? i.push(Bf[n](s[n])) : If[n] && i.push(If[n].replace("{{VALUE}}", s[n]));
    t.push(`${e} { ${i.join(";")} }`);
  }
}
var LS = Object.defineProperty, Ff = Object.getOwnPropertySymbols, NS = Object.prototype.hasOwnProperty, XS = Object.prototype.propertyIsEnumerable, Df = (r, t, e) => t in r ? LS(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Uf = (r, t) => {
  for (var e in t || (t = {})) NS.call(t, e) && Df(r, e, t[e]);
  if (Ff) for (var e of Ff(t)) XS.call(t, e) && Df(r, e, t[e]);
  return r;
};
class os extends Dt$1 {
  constructor(t = {}) {
    var e, s;
    super(t), this._cssOverrides = [], this.cssOverrides = (e = t.cssOverrides) != null ? e : [], this.tagStyles = (s = t.tagStyles) != null ? s : {};
  }
  set cssOverrides(t) {
    this._cssOverrides = t instanceof Array ? t : [t], this.update();
  }
  get cssOverrides() {
    return this._cssOverrides;
  }
  update() {
    this._cssStyle = null, super.update();
  }
  clone() {
    return new os({ align: this.align, breakWords: this.breakWords, dropShadow: this.dropShadow ? Uf({}, this.dropShadow) : null, fill: this._fill, fontFamily: this.fontFamily, fontSize: this.fontSize, fontStyle: this.fontStyle, fontVariant: this.fontVariant, fontWeight: this.fontWeight, letterSpacing: this.letterSpacing, lineHeight: this.lineHeight, padding: this.padding, stroke: this._stroke, whiteSpace: this.whiteSpace, wordWrap: this.wordWrap, wordWrapWidth: this.wordWrapWidth, cssOverrides: this.cssOverrides, tagStyles: Uf({}, this.tagStyles) });
  }
  get cssStyle() {
    return this._cssStyle || (this._cssStyle = Cf(this)), this._cssStyle;
  }
  addOverride(...t) {
    const e = t.filter((s) => !this.cssOverrides.includes(s));
    e.length > 0 && (this.cssOverrides.push(...e), this.update());
  }
  removeOverride(...t) {
    const e = t.filter((s) => this.cssOverrides.includes(s));
    e.length > 0 && (this.cssOverrides = this.cssOverrides.filter((s) => !e.includes(s)), this.update());
  }
  set fill(t) {
    super.fill = t;
  }
  set stroke(t) {
    super.stroke = t;
  }
}
function kf(r, t) {
  const e = t.fontFamily, s = [], i = {}, n = /font-family:([^;"\s]+)/g, o = r.match(n);
  function a(l3) {
    i[l3] || (s.push(l3), i[l3] = true);
  }
  if (Array.isArray(e)) for (let l3 = 0; l3 < e.length; l3++) a(e[l3]);
  else a(e);
  o && o.forEach((l3) => {
    const u3 = l3.split(":")[1].trim();
    a(u3);
  });
  for (const l3 in t.tagStyles) {
    const u3 = t.tagStyles[l3].fontFamily;
    a(u3);
  }
  return s;
}
async function $f(r) {
  const t = await (await L.get().fetch(r)).blob(), e = new FileReader();
  return await new Promise((s, i) => {
    e.onloadend = () => s(e.result), e.onerror = i, e.readAsDataURL(t);
  });
}
async function ra(r, t) {
  const e = await $f(t);
  return `@font-face {
font-family: "${r.fontFamily}";
src: url('${e}');
font-weight: ${r.fontWeight};
font-style: ${r.fontStyle};
}`;
}
const Nr = /* @__PURE__ */ new Map();
async function Lf(r, t, e) {
  const s = r.filter((i) => V$1.has(`${i}-and-url`)).map((i, n) => {
    if (!Nr.has(i)) {
      const { url: o } = V$1.get(`${i}-and-url`);
      n === 0 ? Nr.set(i, ra({ fontWeight: t.fontWeight, fontStyle: t.fontStyle, fontFamily: i }, o)) : Nr.set(i, ra({ fontWeight: e.fontWeight, fontStyle: e.fontStyle, fontFamily: i }, o));
    }
    return Nr.get(i);
  });
  return (await Promise.all(s)).join(`
`);
}
function Nf(r, t, e, s, i) {
  const { domElement: n, styleElement: o, svgRoot: a } = i;
  n.innerHTML = `<style>${t.cssStyle}</style><div style='padding:0;'>${r}</div>`, n.setAttribute("style", `transform: scale(${e});transform-origin: top left; display: inline-block`), o.textContent = s;
  const { width: l3, height: u3 } = i.image;
  return a.setAttribute("width", l3.toString()), a.setAttribute("height", u3.toString()), new XMLSerializer().serializeToString(a);
}
function Xf(r, t) {
  const e = Qt.getOptimalCanvasAndContext(r.width, r.height, t), { context: s } = e;
  return s.clearRect(0, 0, r.width, r.height), s.drawImage(r, 0, 0), e;
}
function Hf(r, t, e) {
  return new Promise(async (s) => {
    e && await new Promise((i) => setTimeout(i, 100)), r.onload = () => {
      s();
    }, r.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(t)}`, r.crossOrigin = "anonymous";
  });
}
let jf;
function sa(r, t, e, s) {
  s || (s = jf || (jf = new ea()));
  const { domElement: i, styleElement: n, svgRoot: o } = s;
  i.innerHTML = `<style>${t.cssStyle};</style><div style='padding:0'>${r}</div>`, i.setAttribute("style", "transform-origin: top left; display: inline-block"), e && (n.textContent = e), document.body.appendChild(o);
  const a = i.getBoundingClientRect();
  o.remove();
  const l3 = t.padding * 2;
  return { width: a.width - l3, height: a.height - l3 };
}
class ia {
  constructor(t) {
    this._renderer = t, this._createCanvas = t.type === mt$1.WEBGPU;
  }
  getTexture(t) {
    return this.getTexturePromise(t);
  }
  getTexturePromise(t) {
    return this._buildTexturePromise(t);
  }
  async _buildTexturePromise(t) {
    const { text: e, style: s, resolution: i, textureStyle: n } = t, o = nt.get(ea), a = kf(e, s), l3 = await Lf(a, s, os.defaultTextStyle), u3 = sa(e, s, l3, o), c = Math.ceil(Math.ceil(Math.max(1, u3.width) + s.padding * 2) * i), h = Math.ceil(Math.ceil(Math.max(1, u3.height) + s.padding * 2) * i), d = o.image, p = 2;
    d.width = (c | 0) + p, d.height = (h | 0) + p;
    const f2 = Nf(e, s, i, l3, o);
    await Hf(d, f2, Pf() && a.length > 0);
    const g = d;
    let m3;
    this._createCanvas && (m3 = Xf(d, i));
    const _ = jo(m3 ? m3.canvas : g, d.width - p, d.height - p, i);
    return n && (_.source.style = n), this._createCanvas && (this._renderer.texture.initSource(_.source), Qt.returnCanvasAndContext(m3)), nt.return(o), _;
  }
  returnTexturePromise(t) {
    t.then((e) => {
      this._cleanUp(e);
    }).catch(() => {
    });
  }
  _cleanUp(t) {
    tt$1.returnTexture(t, true), t.source.resource = null, t.source.uploadMethodId = "unknown";
  }
  destroy() {
    this._renderer = null;
  }
}
ia.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem, x$1.CanvasSystem], name: "htmlText" }, G$1.add(ia), G$1.add(ta);
var HS = Object.defineProperty, zf = Object.getOwnPropertySymbols, jS = Object.prototype.hasOwnProperty, zS = Object.prototype.propertyIsEnumerable, Vf = (r, t, e) => t in r ? HS(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Wf = (r, t) => {
  for (var e in t || (t = {})) jS.call(t, e) && Vf(r, e, t[e]);
  if (zf) for (var e of zf(t)) zS.call(t, e) && Vf(r, e, t[e]);
  return r;
};
const Yf = class Jv extends ye {
  constructor(...t) {
    var e;
    let s = (e = t[0]) != null ? e : {};
    s instanceof Float32Array && (s = { positions: s, uvs: t[1], indices: t[2] }), s = Wf(Wf({}, Jv.defaultOptions), s);
    const i = s.positions || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    let n = s.uvs;
    n || (s.positions ? n = new Float32Array(i.length) : n = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]));
    const o = s.indices || new Uint32Array([0, 1, 2, 0, 2, 3]), a = s.shrinkBuffersToFit, l3 = new ft({ data: i, label: "attribute-mesh-positions", shrinkToFit: a, usage: N$1.VERTEX | N$1.COPY_DST }), u3 = new ft({ data: n, label: "attribute-mesh-uvs", shrinkToFit: a, usage: N$1.VERTEX | N$1.COPY_DST }), c = new ft({ data: o, label: "index-mesh-buffer", shrinkToFit: a, usage: N$1.INDEX | N$1.COPY_DST });
    super({ attributes: { aPosition: { buffer: l3, format: "float32x2", stride: 2 * 4, offset: 0 }, aUV: { buffer: u3, format: "float32x2", stride: 2 * 4, offset: 0 } }, indexBuffer: c, topology: s.topology }), this.batchMode = "auto";
  }
  get positions() {
    return this.attributes.aPosition.buffer.data;
  }
  set positions(t) {
    this.attributes.aPosition.buffer.data = t;
  }
  get uvs() {
    return this.attributes.aUV.buffer.data;
  }
  set uvs(t) {
    this.attributes.aUV.buffer.data = t;
  }
  get indices() {
    return this.indexBuffer.data;
  }
  set indices(t) {
    this.indexBuffer.data = t;
  }
};
Yf.defaultOptions = { topology: "triangle-list", shrinkBuffersToFit: false };
let Pe = Yf;
var VS = Object.defineProperty, WS = Object.defineProperties, YS = Object.getOwnPropertyDescriptors, Kf = Object.getOwnPropertySymbols, KS = Object.prototype.hasOwnProperty, qS = Object.prototype.propertyIsEnumerable, qf = (r, t, e) => t in r ? VS(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Zf = (r, t) => {
  for (var e in t || (t = {})) KS.call(t, e) && qf(r, e, t[e]);
  if (Kf) for (var e of Kf(t)) qS.call(t, e) && qf(r, e, t[e]);
  return r;
}, Qf = (r, t) => WS(r, YS(t));
const qe = { name: "local-uniform-bit", vertex: { header: `

struct LocalUniforms {
uTransformMatrix:mat3x3<f32>,
uColor:vec4<f32>,
uRound:f32,
}

@group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
`, main: `
vColor *= localUniforms.uColor;
modelMatrix *= localUniforms.uTransformMatrix;
`, end: `
if(localUniforms.uRound == 1)
{
vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
}
` } }, Jf = Qf(Zf({}, qe), { vertex: Qf(Zf({}, qe.vertex), { header: qe.vertex.header.replace("group(1)", "group(2)") }) }), si = { name: "local-uniform-bit", vertex: { header: `

uniform mat3 uTransformMatrix;
uniform vec4 uColor;
uniform float uRound;
`, main: `
vColor *= uColor;
modelMatrix = uTransformMatrix;
`, end: `
if(uRound == 1.)
{
gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
}
` } }, tm = { name: "tiling-bit", vertex: { header: `
struct TilingUniforms {
uMapCoord:mat3x3<f32>,
uClampFrame:vec4<f32>,
uClampOffset:vec2<f32>,
uTextureTransform:mat3x3<f32>,
uSizeAnchor:vec4<f32>
};

@group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
@group(2) @binding(1) var uTexture: texture_2d<f32>;
@group(2) @binding(2) var uSampler: sampler;
`, main: `
uv = (tilingUniforms.uTextureTransform * vec3(uv, 1.0)).xy;

position = (position - tilingUniforms.uSizeAnchor.zw) * tilingUniforms.uSizeAnchor.xy;
` }, fragment: { header: `
struct TilingUniforms {
uMapCoord:mat3x3<f32>,
uClampFrame:vec4<f32>,
uClampOffset:vec2<f32>,
uTextureTransform:mat3x3<f32>,
uSizeAnchor:vec4<f32>
};

@group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
@group(2) @binding(1) var uTexture: texture_2d<f32>;
@group(2) @binding(2) var uSampler: sampler;
`, main: `

var coord = vUV + ceil(tilingUniforms.uClampOffset - vUV);
coord = (tilingUniforms.uMapCoord * vec3(coord, 1.0)).xy;
var unclamped = coord;
coord = clamp(coord, tilingUniforms.uClampFrame.xy, tilingUniforms.uClampFrame.zw);

var bias = 0.;

if(unclamped.x == coord.x && unclamped.y == coord.y)
{
bias = -32.;
}

outColor = textureSampleBias(uTexture, uSampler, coord, bias);
` } }, em = { name: "tiling-bit", vertex: { header: `
uniform mat3 uTextureTransform;
uniform vec4 uSizeAnchor;

`, main: `
uv = (uTextureTransform * vec3(aUV, 1.0)).xy;

position = (position - uSizeAnchor.zw) * uSizeAnchor.xy;
` }, fragment: { header: `
uniform sampler2D uTexture;
uniform mat3 uMapCoord;
uniform vec4 uClampFrame;
uniform vec2 uClampOffset;
`, main: `

vec2 coord = vUV + ceil(uClampOffset - vUV);
coord = (uMapCoord * vec3(coord, 1.0)).xy;
vec2 unclamped = coord;
coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

outColor = texture(uTexture, coord, unclamped == coord ? 0.0 : -32.0);// lod-bias very negative to force lod 0

` } };
let na, oa;
class rm extends At$1 {
  constructor() {
    na != null || (na = Le({ name: "tiling-sprite-shader", bits: [qe, tm, Xe] })), oa != null || (oa = Ne({ name: "tiling-sprite-shader", bits: [si, em, He] }));
    const t = new et$1({ uMapCoord: { value: new R$1(), type: "mat3x3<f32>" }, uClampFrame: { value: new Float32Array([0, 0, 1, 1]), type: "vec4<f32>" }, uClampOffset: { value: new Float32Array([0, 0]), type: "vec2<f32>" }, uTextureTransform: { value: new R$1(), type: "mat3x3<f32>" }, uSizeAnchor: { value: new Float32Array([100, 100, 0.5, 0.5]), type: "vec4<f32>" } });
    super({ glProgram: oa, gpuProgram: na, resources: { localUniforms: new et$1({ uTransformMatrix: { value: new R$1(), type: "mat3x3<f32>" }, uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" }, uRound: { value: 0, type: "f32" } }), tilingUniforms: t, uTexture: A$1.EMPTY.source, uSampler: A$1.EMPTY.source.style } });
  }
  updateUniforms(t, e, s, i, n, o) {
    const a = this.resources.tilingUniforms, l3 = o.width, u3 = o.height, c = o.textureMatrix, h = a.uniforms.uTextureTransform;
    h.set(s.a * l3 / t, s.b * l3 / e, s.c * u3 / t, s.d * u3 / e, s.tx / t, s.ty / e), h.invert(), a.uniforms.uMapCoord = c.mapCoord, a.uniforms.uClampFrame = c.uClampFrame, a.uniforms.uClampOffset = c.uClampOffset, a.uniforms.uTextureTransform = h, a.uniforms.uSizeAnchor[0] = t, a.uniforms.uSizeAnchor[1] = e, a.uniforms.uSizeAnchor[2] = i, a.uniforms.uSizeAnchor[3] = n, o && (this.resources.uTexture = o.source, this.resources.uSampler = o.source.style);
  }
}
class sm extends Pe {
  constructor() {
    super({ positions: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), indices: new Uint32Array([0, 1, 2, 0, 2, 3]) });
  }
}
function im(r, t) {
  const e = r.anchor.x, s = r.anchor.y;
  t[0] = -e * r.width, t[1] = -s * r.height, t[2] = (1 - e) * r.width, t[3] = -s * r.height, t[4] = (1 - e) * r.width, t[5] = (1 - s) * r.height, t[6] = -e * r.width, t[7] = (1 - s) * r.height;
}
function nm(r, t, e, s) {
  let i = 0;
  const n = r.length / t, o = s.a, a = s.b, l3 = s.c, u3 = s.d, c = s.tx, h = s.ty;
  for (e *= t; i < n; ) {
    const d = r[e], p = r[e + 1];
    r[e] = o * d + l3 * p + c, r[e + 1] = a * d + u3 * p + h, e += t, i++;
  }
}
function om(r, t) {
  const e = r.texture, s = e.frame.width, i = e.frame.height;
  let n = 0, o = 0;
  r.applyAnchorToTexture && (n = r.anchor.x, o = r.anchor.y), t[0] = t[6] = -n, t[2] = t[4] = 1 - n, t[1] = t[3] = -o, t[5] = t[7] = 1 - o;
  const a = R$1.shared;
  a.copyFrom(r._tileTransform.matrix), a.tx /= r.width, a.ty /= r.height, a.invert(), a.scale(r.width / s, r.height / i), nm(t, 2, 0, a);
}
const ii = new sm();
class am {
  constructor() {
    this.canBatch = true, this.geometry = new Pe({ indices: ii.indices.slice(), positions: ii.positions.slice(), uvs: ii.uvs.slice() });
  }
  destroy() {
    var t;
    this.geometry.destroy(), (t = this.shader) == null || t.destroy();
  }
}
class aa {
  constructor(t) {
    this._state = Tt.default2d, this._renderer = t;
  }
  validateRenderable(t) {
    const e = this._getTilingSpriteData(t), s = e.canBatch;
    this._updateCanBatch(t);
    const i = e.canBatch;
    if (i && i === s) {
      const { batchableMesh: n } = e;
      return !n._batcher.checkAndUpdateTexture(n, t.texture);
    }
    return s !== i;
  }
  addRenderable(t, e) {
    const s = this._renderer.renderPipes.batch;
    this._updateCanBatch(t);
    const i = this._getTilingSpriteData(t), { geometry: n, canBatch: o } = i;
    if (o) {
      i.batchableMesh || (i.batchableMesh = new Ks());
      const a = i.batchableMesh;
      t.didViewUpdate && (this._updateBatchableMesh(t), a.geometry = n, a.renderable = t, a.transform = t.groupTransform, a.setTexture(t._texture)), a.roundPixels = this._renderer._roundPixels | t._roundPixels, s.addToBatch(a, e);
    } else s.break(e), i.shader || (i.shader = new rm()), this.updateRenderable(t), e.add(t);
  }
  execute(t) {
    const { shader: e } = this._getTilingSpriteData(t);
    e.groups[0] = this._renderer.globalUniforms.bindGroup;
    const s = e.resources.localUniforms.uniforms;
    s.uTransformMatrix = t.groupTransform, s.uRound = this._renderer._roundPixels | t._roundPixels, Ve(t.groupColorAlpha, s.uColor, 0), this._state.blendMode = De(t.groupBlendMode, t.texture._source), this._renderer.encoder.draw({ geometry: ii, shader: e, state: this._state });
  }
  updateRenderable(t) {
    const e = this._getTilingSpriteData(t), { canBatch: s } = e;
    if (s) {
      const { batchableMesh: i } = e;
      t.didViewUpdate && this._updateBatchableMesh(t), i._batcher.updateElement(i);
    } else if (t.didViewUpdate) {
      const { shader: i } = e;
      i.updateUniforms(t.width, t.height, t._tileTransform.matrix, t.anchor.x, t.anchor.y, t.texture);
    }
  }
  _getTilingSpriteData(t) {
    return t._gpuData[this._renderer.uid] || this._initTilingSpriteData(t);
  }
  _initTilingSpriteData(t) {
    const e = new am();
    return e.renderable = t, t._gpuData[this._renderer.uid] = e, e;
  }
  _updateBatchableMesh(t) {
    const e = this._getTilingSpriteData(t), { geometry: s } = e, i = t.texture.source.style;
    i.addressMode !== "repeat" && (i.addressMode = "repeat", i.update()), om(t, s.uvs), im(t, s.positions);
  }
  destroy() {
    this._renderer = null;
  }
  _updateCanBatch(t) {
    const e = this._getTilingSpriteData(t), s = t.texture;
    let i = true;
    return this._renderer.type === mt$1.WEBGL && (i = this._renderer.context.supports.nonPowOf2wrapping), e.canBatch = s.textureMatrix.isSimple && (i || s.source.isPowerOfTwo), e.canBatch;
  }
}
aa.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "tilingSprite" }, G$1.add(aa);
var ZS = Object.defineProperty, lm = Object.getOwnPropertySymbols, QS = Object.prototype.hasOwnProperty, JS = Object.prototype.propertyIsEnumerable, um = (r, t, e) => t in r ? ZS(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, cm = (r, t) => {
  for (var e in t || (t = {})) QS.call(t, e) && um(r, e, t[e]);
  if (lm) for (var e of lm(t)) JS.call(t, e) && um(r, e, t[e]);
  return r;
};
const hm = class ty extends Pe {
  constructor(...t) {
    var e;
    super({});
    let s = (e = t[0]) != null ? e : {};
    typeof s == "number" && (s = { width: s, height: t[1], verticesX: t[2], verticesY: t[3] }), this.build(s);
  }
  build(t) {
    var e, s, i, n;
    t = cm(cm({}, ty.defaultOptions), t), this.verticesX = (e = this.verticesX) != null ? e : t.verticesX, this.verticesY = (s = this.verticesY) != null ? s : t.verticesY, this.width = (i = this.width) != null ? i : t.width, this.height = (n = this.height) != null ? n : t.height;
    const o = this.verticesX * this.verticesY, a = [], l3 = [], u3 = [], c = this.verticesX - 1, h = this.verticesY - 1, d = this.width / c, p = this.height / h;
    for (let g = 0; g < o; g++) {
      const m3 = g % this.verticesX, _ = g / this.verticesX | 0;
      a.push(m3 * d, _ * p), l3.push(m3 / c, _ / h);
    }
    const f2 = c * h;
    for (let g = 0; g < f2; g++) {
      const m3 = g % c, _ = g / c | 0, b = _ * this.verticesX + m3, v4 = _ * this.verticesX + m3 + 1, y4 = (_ + 1) * this.verticesX + m3, S3 = (_ + 1) * this.verticesX + m3 + 1;
      u3.push(b, v4, y4, v4, S3, y4);
    }
    this.buffers[0].data = new Float32Array(a), this.buffers[1].data = new Float32Array(l3), this.indexBuffer.data = new Uint32Array(u3), this.buffers[0].update(), this.buffers[1].update(), this.indexBuffer.update();
  }
};
hm.defaultOptions = { width: 100, height: 100, verticesX: 10, verticesY: 10 };
let ni = hm;
var t2 = Object.defineProperty, dm = Object.getOwnPropertySymbols, e2 = Object.prototype.hasOwnProperty, r2 = Object.prototype.propertyIsEnumerable, pm = (r, t, e) => t in r ? t2(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, fm = (r, t) => {
  for (var e in t || (t = {})) e2.call(t, e) && pm(r, e, t[e]);
  if (dm) for (var e of dm(t)) r2.call(t, e) && pm(r, e, t[e]);
  return r;
};
const mm = class ey extends ni {
  constructor(t = {}) {
    t = fm(fm({}, ey.defaultOptions), t), super({ width: t.width, height: t.height, verticesX: 4, verticesY: 4 }), this.update(t);
  }
  update(t) {
    var e, s, i, n, o, a, l3, u3, c, h;
    this.width = (e = t.width) != null ? e : this.width, this.height = (s = t.height) != null ? s : this.height, this._originalWidth = (i = t.originalWidth) != null ? i : this._originalWidth, this._originalHeight = (n = t.originalHeight) != null ? n : this._originalHeight, this._leftWidth = (o = t.leftWidth) != null ? o : this._leftWidth, this._rightWidth = (a = t.rightWidth) != null ? a : this._rightWidth, this._topHeight = (l3 = t.topHeight) != null ? l3 : this._topHeight, this._bottomHeight = (u3 = t.bottomHeight) != null ? u3 : this._bottomHeight, this._anchorX = (c = t.anchor) == null ? void 0 : c.x, this._anchorY = (h = t.anchor) == null ? void 0 : h.y, this.updateUvs(), this.updatePositions();
  }
  updatePositions() {
    const t = this.positions, { width: e, height: s, _leftWidth: i, _rightWidth: n, _topHeight: o, _bottomHeight: a, _anchorX: l3, _anchorY: u3 } = this, c = i + n, h = e > c ? 1 : e / c, d = o + a, p = s > d ? 1 : s / d, f2 = Math.min(h, p), g = l3 * e, m3 = u3 * s;
    t[0] = t[8] = t[16] = t[24] = -g, t[2] = t[10] = t[18] = t[26] = i * f2 - g, t[4] = t[12] = t[20] = t[28] = e - n * f2 - g, t[6] = t[14] = t[22] = t[30] = e - g, t[1] = t[3] = t[5] = t[7] = -m3, t[9] = t[11] = t[13] = t[15] = o * f2 - m3, t[17] = t[19] = t[21] = t[23] = s - a * f2 - m3, t[25] = t[27] = t[29] = t[31] = s - m3, this.getBuffer("aPosition").update();
  }
  updateUvs() {
    const t = this.uvs;
    t[0] = t[8] = t[16] = t[24] = 0, t[1] = t[3] = t[5] = t[7] = 0, t[6] = t[14] = t[22] = t[30] = 1, t[25] = t[27] = t[29] = t[31] = 1;
    const e = 1 / this._originalWidth, s = 1 / this._originalHeight;
    t[2] = t[10] = t[18] = t[26] = e * this._leftWidth, t[9] = t[11] = t[13] = t[15] = s * this._topHeight, t[4] = t[12] = t[20] = t[28] = 1 - e * this._rightWidth, t[17] = t[19] = t[21] = t[23] = 1 - s * this._bottomHeight, this.getBuffer("aUV").update();
  }
};
mm.defaultOptions = { width: 100, height: 100, leftWidth: 10, topHeight: 10, rightWidth: 10, bottomHeight: 10, originalWidth: 100, originalHeight: 100 };
let oe = mm;
class gm extends Ks {
  constructor() {
    super(), this.geometry = new oe();
  }
  destroy() {
    this.geometry.destroy();
  }
}
class la {
  constructor(t) {
    this._renderer = t;
  }
  addRenderable(t, e) {
    const s = this._getGpuSprite(t);
    t.didViewUpdate && this._updateBatchableSprite(t, s), this._renderer.renderPipes.batch.addToBatch(s, e);
  }
  updateRenderable(t) {
    const e = this._getGpuSprite(t);
    t.didViewUpdate && this._updateBatchableSprite(t, e), e._batcher.updateElement(e);
  }
  validateRenderable(t) {
    const e = this._getGpuSprite(t);
    return !e._batcher.checkAndUpdateTexture(e, t._texture);
  }
  _updateBatchableSprite(t, e) {
    e.geometry.update(t), e.setTexture(t._texture);
  }
  _getGpuSprite(t) {
    return t._gpuData[this._renderer.uid] || this._initGPUSprite(t);
  }
  _initGPUSprite(t) {
    const e = t._gpuData[this._renderer.uid] = new gm(), s = e;
    return s.renderable = t, s.transform = t.groupTransform, s.texture = t._texture, s.roundPixels = this._renderer._roundPixels | t._roundPixels, t.didViewUpdate || this._updateBatchableSprite(t, s), e;
  }
  destroy() {
    this._renderer = null;
  }
}
la.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "nineSliceSprite" }, G$1.add(la);
class ua {
  constructor(t) {
    this._renderer = t;
  }
  push(t, e, s) {
    this._renderer.renderPipes.batch.break(s), s.add({ renderPipeId: "filter", canBundle: false, action: "pushFilter", container: e, filterEffect: t });
  }
  pop(t, e, s) {
    this._renderer.renderPipes.batch.break(s), s.add({ renderPipeId: "filter", action: "popFilter", canBundle: false });
  }
  execute(t) {
    t.action === "pushFilter" ? this._renderer.filter.push(t) : t.action === "popFilter" && this._renderer.filter.pop();
  }
  destroy() {
    this._renderer = null;
  }
}
ua.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "filter" };
function _m(r, t) {
  t.clear();
  const e = t.matrix;
  for (let s = 0; s < r.length; s++) {
    const i = r[s];
    i.globalDisplayStatus < 7 || (t.matrix = i.worldTransform, t.addBounds(i.bounds));
  }
  return t.matrix = e, t;
}
const s2 = new ye({ attributes: { aPosition: { buffer: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), format: "float32x2", stride: 2 * 4, offset: 0 } }, indexBuffer: new Uint32Array([0, 1, 2, 0, 2, 3]) });
let i2 = class {
  constructor() {
    this.skip = false, this.inputTexture = null, this.backTexture = null, this.filters = null, this.bounds = new st$1(), this.container = null, this.blendRequired = false, this.outputRenderSurface = null, this.outputOffset = { x: 0, y: 0 }, this.globalFrame = { x: 0, y: 0, width: 0, height: 0 };
  }
};
class ca {
  constructor(t) {
    this._filterStackIndex = 0, this._filterStack = [], this._filterGlobalUniforms = new et$1({ uInputSize: { value: new Float32Array(4), type: "vec4<f32>" }, uInputPixel: { value: new Float32Array(4), type: "vec4<f32>" }, uInputClamp: { value: new Float32Array(4), type: "vec4<f32>" }, uOutputFrame: { value: new Float32Array(4), type: "vec4<f32>" }, uGlobalFrame: { value: new Float32Array(4), type: "vec4<f32>" }, uOutputTexture: { value: new Float32Array(4), type: "vec4<f32>" } }), this._globalFilterBindGroup = new Xt({}), this.renderer = t;
  }
  get activeBackTexture() {
    var t;
    return (t = this._activeFilterData) == null ? void 0 : t.backTexture;
  }
  push(t) {
    const e = this.renderer, s = t.filterEffect.filters, i = this._pushFilterData();
    i.skip = false, i.filters = s, i.container = t.container, i.outputRenderSurface = e.renderTarget.renderSurface;
    const n = e.renderTarget.renderTarget.colorTexture.source, o = n.resolution, a = n.antialias;
    if (s.length === 0) {
      i.skip = true;
      return;
    }
    const l3 = i.bounds;
    if (t.renderables ? _m(t.renderables, l3) : t.filterEffect.filterArea ? (l3.clear(), l3.addRect(t.filterEffect.filterArea), l3.applyMatrix(t.container.worldTransform)) : t.container.getFastGlobalBounds(true, l3), t.container) {
      const f2 = (t.container.renderGroup || t.container.parentRenderGroup).cacheToLocalTransform;
      f2 && l3.applyMatrix(f2);
    }
    if (this._calculateFilterBounds(i, e.renderTarget.rootViewPort, a, o, 1), i.skip) return;
    const u3 = this._getPreviousFilterData();
    let c = o, h = 0, d = 0;
    u3 && (h = u3.bounds.minX, d = u3.bounds.minY, c = u3.inputTexture.source._resolution), i.outputOffset.x = l3.minX - h, i.outputOffset.y = l3.minY - d;
    const p = i.globalFrame;
    if (p.x = h * c, p.y = d * c, p.width = n.width * c, p.height = n.height * c, i.backTexture = A$1.EMPTY, i.blendRequired) {
      e.renderTarget.finishRenderPass();
      const f2 = e.renderTarget.getRenderTarget(i.outputRenderSurface);
      i.backTexture = this.getBackTexture(f2, l3, u3 == null ? void 0 : u3.bounds);
    }
    i.inputTexture = tt$1.getOptimalTexture(l3.width, l3.height, i.resolution, i.antialias), e.renderTarget.bind(i.inputTexture, true), e.globalUniforms.push({ offset: l3 });
  }
  generateFilteredTexture({ texture: t, filters: e }) {
    const s = this._pushFilterData();
    this._activeFilterData = s, s.skip = false, s.filters = e;
    const i = t.source, n = i.resolution, o = i.antialias;
    if (e.length === 0) return s.skip = true, t;
    const a = s.bounds;
    if (a.addRect(t.frame), this._calculateFilterBounds(s, a.rectangle, o, n, 0), s.skip) return t;
    const l3 = n, u3 = 0, c = 0;
    s.outputOffset.x = -a.minX, s.outputOffset.y = -a.minY;
    const h = s.globalFrame;
    h.x = u3 * l3, h.y = c * l3, h.width = i.width * l3, h.height = i.height * l3, s.outputRenderSurface = tt$1.getOptimalTexture(a.width, a.height, s.resolution, s.antialias), s.backTexture = A$1.EMPTY, s.inputTexture = t, this.renderer.renderTarget.finishRenderPass(), this._applyFiltersToTexture(s, true);
    const d = s.outputRenderSurface;
    return d.source.alphaMode = "premultiplied-alpha", d;
  }
  pop() {
    const t = this.renderer, e = this._popFilterData();
    e.skip || (t.globalUniforms.pop(), t.renderTarget.finishRenderPass(), this._activeFilterData = e, this._applyFiltersToTexture(e, false), e.blendRequired && tt$1.returnTexture(e.backTexture), tt$1.returnTexture(e.inputTexture));
  }
  getBackTexture(t, e, s) {
    const i = t.colorTexture.source._resolution, n = tt$1.getOptimalTexture(e.width, e.height, i, false);
    let o = e.minX, a = e.minY;
    s && (o -= s.minX, a -= s.minY), o = Math.floor(o * i), a = Math.floor(a * i);
    const l3 = Math.ceil(e.width * i), u3 = Math.ceil(e.height * i);
    return this.renderer.renderTarget.copyToTexture(t, n, { x: o, y: a }, { width: l3, height: u3 }, { x: 0, y: 0 }), n;
  }
  applyFilter(t, e, s, i) {
    const n = this.renderer, o = this._activeFilterData, a = o.outputRenderSurface, l3 = this._filterGlobalUniforms, u3 = l3.uniforms, c = u3.uOutputFrame, h = u3.uInputSize, d = u3.uInputPixel, p = u3.uInputClamp, f2 = u3.uGlobalFrame, g = u3.uOutputTexture;
    a === s ? (c[0] = o.outputOffset.x, c[1] = o.outputOffset.y) : (c[0] = 0, c[1] = 0), c[2] = e.frame.width, c[3] = e.frame.height, h[0] = e.source.width, h[1] = e.source.height, h[2] = 1 / h[0], h[3] = 1 / h[1], d[0] = e.source.pixelWidth, d[1] = e.source.pixelHeight, d[2] = 1 / d[0], d[3] = 1 / d[1], p[0] = 0.5 * d[2], p[1] = 0.5 * d[3], p[2] = e.frame.width * h[2] - 0.5 * d[2], p[3] = e.frame.height * h[3] - 0.5 * d[3], f2[0] = o.globalFrame.x, f2[1] = o.globalFrame.y, f2[2] = o.globalFrame.width, f2[3] = o.globalFrame.height, s instanceof A$1 && (s.source.resource = null);
    const m3 = this.renderer.renderTarget.getRenderTarget(s);
    if (n.renderTarget.bind(s, !!i), s instanceof A$1 ? (g[0] = s.frame.width, g[1] = s.frame.height) : (g[0] = m3.width, g[1] = m3.height), g[2] = m3.isRoot ? -1 : 1, l3.update(), n.renderPipes.uniformBatch) {
      const _ = n.renderPipes.uniformBatch.getUboResource(l3);
      this._globalFilterBindGroup.setResource(_, 0);
    } else this._globalFilterBindGroup.setResource(l3, 0);
    this._globalFilterBindGroup.setResource(e.source, 1), this._globalFilterBindGroup.setResource(e.source.style, 2), t.groups[0] = this._globalFilterBindGroup, n.encoder.draw({ geometry: s2, shader: t, state: t._state, topology: "triangle-list" }), n.type === mt$1.WEBGL && n.renderTarget.finishRenderPass();
  }
  calculateSpriteMatrix(t, e) {
    const s = this._activeFilterData, i = t.set(s.inputTexture._source.width, 0, 0, s.inputTexture._source.height, s.bounds.minX, s.bounds.minY), n = e.worldTransform.copyTo(R$1.shared), o = e.renderGroup || e.parentRenderGroup;
    return o && o.cacheToLocalTransform && n.prepend(o.cacheToLocalTransform), n.invert(), i.prepend(n), i.scale(1 / e.texture.frame.width, 1 / e.texture.frame.height), i.translate(e.anchor.x, e.anchor.y), i;
  }
  destroy() {
  }
  _applyFiltersToTexture(t, e) {
    const s = t.inputTexture, i = t.bounds, n = t.filters;
    if (this._globalFilterBindGroup.setResource(s.source.style, 2), this._globalFilterBindGroup.setResource(t.backTexture.source, 3), n.length === 1) n[0].apply(this, s, t.outputRenderSurface, e);
    else {
      let o = t.inputTexture;
      const a = tt$1.getOptimalTexture(i.width, i.height, o.source._resolution, false);
      let l3 = a, u3 = 0;
      for (u3 = 0; u3 < n.length - 1; ++u3) {
        n[u3].apply(this, o, l3, true);
        const c = o;
        o = l3, l3 = c;
      }
      n[u3].apply(this, o, t.outputRenderSurface, e), tt$1.returnTexture(a);
    }
  }
  _calculateFilterBounds(t, e, s, i, n) {
    var o, a;
    const l3 = this.renderer, u3 = t.bounds, c = t.filters;
    let h = 1 / 0, d = 0, p = true, f2 = false, g = false, m3 = true;
    for (let _ = 0; _ < c.length; _++) {
      const b = c[_];
      if (h = Math.min(h, b.resolution === "inherit" ? i : b.resolution), d += b.padding, b.antialias === "off" ? p = false : b.antialias === "inherit" && p && (p = s), b.clipToViewport || (m3 = false), !(b.compatibleRenderers & l3.type)) {
        g = false;
        break;
      }
      if (b.blendRequired && !((a = (o = l3.backBuffer) == null ? void 0 : o.useBackBuffer) == null || a)) {
        g = false;
        break;
      }
      g = b.enabled || g, f2 || (f2 = b.blendRequired);
    }
    if (!g) {
      t.skip = true;
      return;
    }
    if (m3 && u3.fitBounds(0, e.width / i, 0, e.height / i), u3.scale(h).ceil().scale(1 / h).pad((d | 0) * n), !u3.isPositive) {
      t.skip = true;
      return;
    }
    t.antialias = p, t.resolution = h, t.blendRequired = f2;
  }
  _popFilterData() {
    return this._filterStackIndex--, this._filterStack[this._filterStackIndex];
  }
  _getPreviousFilterData() {
    let t, e = this._filterStackIndex - 1;
    for (; e > 1 && (e--, t = this._filterStack[e], !!t.skip); ) ;
    return t;
  }
  _pushFilterData() {
    let t = this._filterStack[this._filterStackIndex];
    return t || (t = this._filterStack[this._filterStackIndex] = new i2()), this._filterStackIndex++, t;
  }
}
ca.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem], name: "filter" }, G$1.add(ca), G$1.add(ua);
var n2 = { __proto__: null };
const ha = [];
G$1.handleByNamedList(x$1.Environment, ha);
async function da(r) {
  if (!r) for (let t = 0; t < ha.length; t++) {
    const e = ha[t];
    if (e.value.test()) {
      await e.value.load();
      return;
    }
  }
}
let Xr;
function pa() {
  if (typeof Xr == "boolean") return Xr;
  try {
    Xr = new Function("param1", "param2", "param3", "return param1[param2] === param3;")({ a: "b" }, "a", "b") === true;
  } catch (r) {
    Xr = false;
  }
  return Xr;
}
var gt = ((r) => (r[r.NONE = 0] = "NONE", r[r.COLOR = 16384] = "COLOR", r[r.STENCIL = 1024] = "STENCIL", r[r.DEPTH = 256] = "DEPTH", r[r.COLOR_DEPTH = 16640] = "COLOR_DEPTH", r[r.COLOR_STENCIL = 17408] = "COLOR_STENCIL", r[r.DEPTH_STENCIL = 1280] = "DEPTH_STENCIL", r[r.ALL = 17664] = "ALL", r))(gt || {});
class fa {
  constructor(t) {
    this.items = [], this._name = t;
  }
  emit(t, e, s, i, n, o, a, l3) {
    const { name: u3, items: c } = this;
    for (let h = 0, d = c.length; h < d; h++) c[h][u3](t, e, s, i, n, o, a, l3);
    return this;
  }
  add(t) {
    return t[this._name] && (this.remove(t), this.items.push(t)), this;
  }
  remove(t) {
    const e = this.items.indexOf(t);
    return e !== -1 && this.items.splice(e, 1), this;
  }
  contains(t) {
    return this.items.indexOf(t) !== -1;
  }
  removeAll() {
    return this.items.length = 0, this;
  }
  destroy() {
    this.removeAll(), this.items = null, this._name = null;
  }
  get empty() {
    return this.items.length === 0;
  }
  get name() {
    return this._name;
  }
}
var a2 = Object.defineProperty, xm = Object.getOwnPropertySymbols, l2 = Object.prototype.hasOwnProperty, u2 = Object.prototype.propertyIsEnumerable, bm = (r, t, e) => t in r ? a2(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, oi = (r, t) => {
  for (var e in t || (t = {})) l2.call(t, e) && bm(r, e, t[e]);
  if (xm) for (var e of xm(t)) u2.call(t, e) && bm(r, e, t[e]);
  return r;
};
const c2 = ["init", "destroy", "contextChange", "resolutionChange", "resetState", "renderEnd", "renderStart", "render", "update", "postrender", "prerender"], vm = class ry extends dt {
  constructor(t) {
    var e;
    super(), this.uid = Y("renderer"), this.runners = /* @__PURE__ */ Object.create(null), this.renderPipes = /* @__PURE__ */ Object.create(null), this._initOptions = {}, this._systemsHash = /* @__PURE__ */ Object.create(null), this.type = t.type, this.name = t.name, this.config = t;
    const s = [...c2, ...(e = this.config.runners) != null ? e : []];
    this._addRunners(...s), this._unsafeEvalCheck();
  }
  async init(t = {}) {
    const e = t.skipExtensionImports === true ? true : t.manageImports === false;
    await da(e), this._addSystems(this.config.systems), this._addPipes(this.config.renderPipes, this.config.renderPipeAdaptors);
    for (const s in this._systemsHash) {
      const i = this._systemsHash[s].constructor.defaultOptions;
      t = oi(oi({}, i), t);
    }
    t = oi(oi({}, ry.defaultOptions), t), this._roundPixels = t.roundPixels ? 1 : 0;
    for (let s = 0; s < this.runners.init.items.length; s++) await this.runners.init.items[s].init(t);
    this._initOptions = t;
  }
  render(t, e) {
    let n = t;
    if (n instanceof lt && (n = { container: n }, e && (n.target = e.renderTexture)), n.target || (n.target = this.view.renderTarget), n.target === this.view.renderTarget && (this._lastObjectRendered = n.container, n.clearColor != null || (n.clearColor = this.background.colorRgba), n.clear != null || (n.clear = this.background.clearBeforeRender)), n.clearColor) {
      const o = Array.isArray(n.clearColor) && n.clearColor.length === 4;
      n.clearColor = o ? n.clearColor : X.shared.setValue(n.clearColor).toArray();
    }
    n.transform || (n.container.updateLocalTransform(), n.transform = n.container.localTransform), n.container.enableRenderGroup(), this.runners.prerender.emit(n), this.runners.renderStart.emit(n), this.runners.render.emit(n), this.runners.renderEnd.emit(n), this.runners.postrender.emit(n);
  }
  resize(t, e, s) {
    const i = this.view.resolution;
    this.view.resize(t, e, s), this.emit("resize", this.view.screen.width, this.view.screen.height, this.view.resolution), s !== void 0 && s !== i && this.runners.resolutionChange.emit(s);
  }
  clear(t = {}) {
    const s = this;
    t.target || (t.target = s.renderTarget.renderTarget), t.clearColor || (t.clearColor = this.background.colorRgba), t.clear != null || (t.clear = gt.ALL);
    const { clear: i, clearColor: n, target: o } = t;
    X.shared.setValue(n != null ? n : this.background.colorRgba), s.renderTarget.clear(o, i, X.shared.toArray());
  }
  get resolution() {
    return this.view.resolution;
  }
  set resolution(t) {
    this.view.resolution = t, this.runners.resolutionChange.emit(t);
  }
  get width() {
    return this.view.texture.frame.width;
  }
  get height() {
    return this.view.texture.frame.height;
  }
  get canvas() {
    return this.view.canvas;
  }
  get lastObjectRendered() {
    return this._lastObjectRendered;
  }
  get renderingToScreen() {
    return this.renderTarget.renderingToScreen;
  }
  get screen() {
    return this.view.screen;
  }
  _addRunners(...t) {
    t.forEach((e) => {
      this.runners[e] = new fa(e);
    });
  }
  _addSystems(t) {
    let e;
    for (e in t) {
      const s = t[e];
      this._addSystem(s.value, s.name);
    }
  }
  _addSystem(t, e) {
    const s = new t(this);
    if (this[e]) throw new Error(`Whoops! The name "${e}" is already in use`);
    this[e] = s, this._systemsHash[e] = s;
    for (const i in this.runners) this.runners[i].add(s);
    return this;
  }
  _addPipes(t, e) {
    const s = e.reduce((i, n) => (i[n.name] = n.value, i), {});
    t.forEach((i) => {
      const n = i.value, o = i.name, a = s[o];
      this.renderPipes[o] = new n(this, a ? new a() : null);
    });
  }
  destroy(t = false) {
    this.runners.destroy.items.reverse(), this.runners.destroy.emit(t), Object.values(this.runners).forEach((e) => {
      e.destroy();
    }), this._systemsHash = null, this.renderPipes = null;
  }
  generateTexture(t) {
    return this.textureGenerator.generateTexture(t);
  }
  get roundPixels() {
    return !!this._roundPixels;
  }
  _unsafeEvalCheck() {
    if (!pa()) throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
  }
  resetState() {
    this.runners.resetState.emit();
  }
};
vm.defaultOptions = { resolution: 1, failIfMajorPerformanceCaveat: false, roundPixels: false };
let Hr = vm, ma;
function jr(r) {
  return ma !== void 0 || (ma = (() => {
    var t;
    const e = { stencil: true, failIfMajorPerformanceCaveat: r != null ? r : Hr.defaultOptions.failIfMajorPerformanceCaveat };
    try {
      if (!L.get().getWebGLRenderingContext()) return false;
      let s = L.get().createCanvas().getContext("webgl", e);
      const i = !!((t = s == null ? void 0 : s.getContextAttributes()) != null && t.stencil);
      if (s) {
        const n = s.getExtension("WEBGL_lose_context");
        n && n.loseContext();
      }
      return s = null, i;
    } catch (s) {
      return false;
    }
  })()), ma;
}
let ga;
async function zr(r = {}) {
  return ga !== void 0 || (ga = await (async () => {
    const t = L.get().getNavigator().gpu;
    if (!t) return false;
    try {
      return await (await t.requestAdapter(r)).requestDevice(), true;
    } catch (e) {
      return false;
    }
  })()), ga;
}
var h2 = Object.defineProperty, ym = Object.getOwnPropertySymbols, d2 = Object.prototype.hasOwnProperty, p2 = Object.prototype.propertyIsEnumerable, Tm = (r, t, e) => t in r ? h2(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Vr = (r, t) => {
  for (var e in t || (t = {})) d2.call(t, e) && Tm(r, e, t[e]);
  if (ym) for (var e of ym(t)) p2.call(t, e) && Tm(r, e, t[e]);
  return r;
};
const Sm = ["webgl", "webgpu", "canvas"];
async function Em(r) {
  var t;
  let e = [];
  r.preference ? (e.push(r.preference), Sm.forEach((o) => {
    o !== r.preference && e.push(o);
  })) : e = Sm.slice();
  let s, i = {};
  for (let o = 0; o < e.length; o++) {
    const a = e[o];
    if (a === "webgpu" && await zr()) {
      const { WebGPURenderer: l3 } = await Promise.resolve().then(function() {
        return pR;
      });
      s = l3, i = Vr(Vr({}, r), r.webgpu);
      break;
    } else if (a === "webgl" && jr((t = r.failIfMajorPerformanceCaveat) != null ? t : Hr.defaultOptions.failIfMajorPerformanceCaveat)) {
      const { WebGLRenderer: l3 } = await Promise.resolve().then(function() {
        return KP;
      });
      s = l3, i = Vr(Vr({}, r), r.webgl);
      break;
    } else if (a === "canvas") throw i = Vr({}, r), new Error("CanvasRenderer is not yet implemented");
  }
  if (delete i.webgpu, delete i.webgl, !s) throw new Error("No available renderer for the current environment");
  const n = new s();
  return await n.init(i), n;
}
const Wr = "8.10.1";
class _a {
  static init() {
    var t;
    (t = globalThis.__PIXI_APP_INIT__) == null || t.call(globalThis, this, Wr);
  }
  static destroy() {
  }
}
_a.extension = x$1.Application;
class xa {
  constructor(t) {
    this._renderer = t;
  }
  init() {
    var t;
    (t = globalThis.__PIXI_RENDERER_INIT__) == null || t.call(globalThis, this._renderer, Wr);
  }
  destroy() {
    this._renderer = null;
  }
}
xa.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem], name: "initHook", priority: -10 };
var m2 = Object.defineProperty, Am = Object.getOwnPropertySymbols, g2 = Object.prototype.hasOwnProperty, _2 = Object.prototype.propertyIsEnumerable, wm = (r, t, e) => t in r ? m2(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, x2 = (r, t) => {
  for (var e in t || (t = {})) g2.call(t, e) && wm(r, e, t[e]);
  if (Am) for (var e of Am(t)) _2.call(t, e) && wm(r, e, t[e]);
  return r;
};
const Pm = class Eu {
  constructor(...t) {
    this.stage = new lt();
  }
  async init(t) {
    t = x2({}, t), this.renderer = await Em(t), Eu._plugins.forEach((e) => {
      e.init.call(this, t);
    });
  }
  render() {
    this.renderer.render({ container: this.stage });
  }
  get canvas() {
    return this.renderer.canvas;
  }
  get view() {
    return this.renderer.canvas;
  }
  get screen() {
    return this.renderer.screen;
  }
  destroy(t = false, e = false) {
    const s = Eu._plugins.slice(0);
    s.reverse(), s.forEach((i) => {
      i.destroy.call(this);
    }), this.stage.destroy(e), this.stage = null, this.renderer.destroy(t), this.renderer = null;
  }
};
Pm._plugins = [];
let Rm = Pm;
G$1.handleByList(x$1.Application, Rm._plugins), G$1.add(_a);
class ba extends Ko {
  constructor(t, e) {
    var s;
    super();
    const { textures: i, data: n } = t;
    Object.keys(n.pages).forEach((o) => {
      const a = n.pages[parseInt(o, 10)], l3 = i[a.id];
      this.pages.push({ texture: l3 });
    }), Object.keys(n.chars).forEach((o) => {
      var a;
      const l3 = n.chars[o], { frame: u3, source: c } = i[l3.page], h = new j$1(l3.x + u3.x, l3.y + u3.y, l3.width, l3.height), d = new A$1({ source: c, frame: h });
      this.chars[o] = { id: o.codePointAt(0), xOffset: l3.xOffset, yOffset: l3.yOffset, xAdvance: l3.xAdvance, kerning: (a = l3.kerning) != null ? a : {}, texture: d };
    }), this.baseRenderedFontSize = n.fontSize, this.baseMeasurementFontSize = n.fontSize, this.fontMetrics = { ascent: 0, descent: 0, fontSize: n.fontSize }, this.baseLineOffset = n.baseLineOffset, this.lineHeight = n.lineHeight, this.fontFamily = n.fontFamily, this.distanceField = (s = n.distanceField) != null ? s : { type: "none", range: 0 }, this.url = e;
  }
  destroy() {
    super.destroy();
    for (let t = 0; t < this.pages.length; t++) {
      const { texture: e } = this.pages[t];
      e.destroy(true);
    }
    this.pages = null;
  }
  static install(t) {
    Lr.install(t);
  }
  static uninstall(t) {
    Lr.uninstall(t);
  }
}
const ai = { test(r) {
  return typeof r == "string" && r.startsWith("info face=");
}, parse(r) {
  var t, e, s;
  const i = r.match(/^[a-z]+\s+.+$/gm), n = { info: [], common: [], page: [], char: [], chars: [], kerning: [], kernings: [], distanceField: [] };
  for (const f2 in i) {
    const g = i[f2].match(/^[a-z]+/gm)[0], m3 = i[f2].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), _ = {};
    for (const b in m3) {
      const v4 = m3[b].split("="), y4 = v4[0], S3 = v4[1].replace(/"/gm, ""), T4 = parseFloat(S3), E4 = isNaN(T4) ? S3 : T4;
      _[y4] = E4;
    }
    n[g].push(_);
  }
  const o = { chars: {}, pages: [], lineHeight: 0, fontSize: 0, fontFamily: "", distanceField: null, baseLineOffset: 0 }, [a] = n.info, [l3] = n.common, [u3] = (t = n.distanceField) != null ? t : [];
  u3 && (o.distanceField = { range: parseInt(u3.distanceRange, 10), type: u3.fieldType }), o.fontSize = parseInt(a.size, 10), o.fontFamily = a.face, o.lineHeight = parseInt(l3.lineHeight, 10);
  const c = n.page;
  for (let f2 = 0; f2 < c.length; f2++) o.pages.push({ id: parseInt(c[f2].id, 10) || 0, file: c[f2].file });
  const h = {};
  o.baseLineOffset = o.lineHeight - parseInt(l3.base, 10);
  const d = n.char;
  for (let f2 = 0; f2 < d.length; f2++) {
    const g = d[f2], m3 = parseInt(g.id, 10);
    let _ = (s = (e = g.letter) != null ? e : g.char) != null ? s : String.fromCharCode(m3);
    _ === "space" && (_ = " "), h[m3] = _, o.chars[_] = { id: m3, page: parseInt(g.page, 10) || 0, x: parseInt(g.x, 10), y: parseInt(g.y, 10), width: parseInt(g.width, 10), height: parseInt(g.height, 10), xOffset: parseInt(g.xoffset, 10), yOffset: parseInt(g.yoffset, 10), xAdvance: parseInt(g.xadvance, 10), kerning: {} };
  }
  const p = n.kerning || [];
  for (let f2 = 0; f2 < p.length; f2++) {
    const g = parseInt(p[f2].first, 10), m3 = parseInt(p[f2].second, 10), _ = parseInt(p[f2].amount, 10);
    o.chars[h[m3]].kerning[h[g]] = _;
  }
  return o;
} }, va = { test(r) {
  const t = r;
  return typeof t != "string" && "getElementsByTagName" in t && t.getElementsByTagName("page").length && t.getElementsByTagName("info")[0].getAttribute("face") !== null;
}, parse(r) {
  var t, e;
  const s = { chars: {}, pages: [], lineHeight: 0, fontSize: 0, fontFamily: "", distanceField: null, baseLineOffset: 0 }, i = r.getElementsByTagName("info")[0], n = r.getElementsByTagName("common")[0], o = r.getElementsByTagName("distanceField")[0];
  o && (s.distanceField = { type: o.getAttribute("fieldType"), range: parseInt(o.getAttribute("distanceRange"), 10) });
  const a = r.getElementsByTagName("page"), l3 = r.getElementsByTagName("char"), u3 = r.getElementsByTagName("kerning");
  s.fontSize = parseInt(i.getAttribute("size"), 10), s.fontFamily = i.getAttribute("face"), s.lineHeight = parseInt(n.getAttribute("lineHeight"), 10);
  for (let h = 0; h < a.length; h++) s.pages.push({ id: parseInt(a[h].getAttribute("id"), 10) || 0, file: a[h].getAttribute("file") });
  const c = {};
  s.baseLineOffset = s.lineHeight - parseInt(n.getAttribute("base"), 10);
  for (let h = 0; h < l3.length; h++) {
    const d = l3[h], p = parseInt(d.getAttribute("id"), 10);
    let f2 = (e = (t = d.getAttribute("letter")) != null ? t : d.getAttribute("char")) != null ? e : String.fromCharCode(p);
    f2 === "space" && (f2 = " "), c[p] = f2, s.chars[f2] = { id: p, page: parseInt(d.getAttribute("page"), 10) || 0, x: parseInt(d.getAttribute("x"), 10), y: parseInt(d.getAttribute("y"), 10), width: parseInt(d.getAttribute("width"), 10), height: parseInt(d.getAttribute("height"), 10), xOffset: parseInt(d.getAttribute("xoffset"), 10), yOffset: parseInt(d.getAttribute("yoffset"), 10), xAdvance: parseInt(d.getAttribute("xadvance"), 10), kerning: {} };
  }
  for (let h = 0; h < u3.length; h++) {
    const d = parseInt(u3[h].getAttribute("first"), 10), p = parseInt(u3[h].getAttribute("second"), 10), f2 = parseInt(u3[h].getAttribute("amount"), 10);
    s.chars[c[p]].kerning[c[d]] = f2;
  }
  return s;
} }, ya = { test(r) {
  return typeof r == "string" && r.includes("<font>") ? va.test(L.get().parseXML(r)) : false;
}, parse(r) {
  return va.parse(L.get().parseXML(r));
} }, b2 = [".xml", ".fnt"], Mm = { extension: { type: x$1.CacheParser, name: "cacheBitmapFont" }, test: (r) => r instanceof ba, getCacheableAssets(r, t) {
  const e = {};
  return r.forEach((s) => {
    e[s] = t, e[`${s}-bitmap`] = t;
  }), e[`${t.fontFamily}-bitmap`] = t, e;
} }, Cm = { extension: { type: x$1.LoadParser, priority: vt$1.Normal }, name: "loadBitmapFont", test(r) {
  return b2.includes(pt.extname(r).toLowerCase());
}, async testParse(r) {
  return ai.test(r) || ya.test(r);
}, async parse(r, t, e) {
  const s = ai.test(r) ? ai.parse(r) : ya.parse(r), { src: i } = t, { pages: n } = s, o = [], a = s.distanceField ? { scaleMode: "linear", alphaMode: "premultiply-alpha-on-upload", autoGenerateMipmaps: false, resolution: 1 } : {};
  for (let c = 0; c < n.length; ++c) {
    const h = n[c].file;
    let d = pt.join(pt.dirname(i), h);
    d = Ps(d, i), o.push({ src: d, data: a });
  }
  const l3 = await e.load(o), u3 = o.map((c) => l3[c.src]);
  return new ba({ data: s, textures: u3 }, i);
}, async load(r, t) {
  return await (await L.get().fetch(r)).text();
}, async unload(r, t, e) {
  await Promise.all(r.pages.map((s) => e.unload(s.texture.source._sourceOrigin))), r.destroy();
} };
class Om {
  constructor(t, e = false) {
    this._loader = t, this._assetList = [], this._isLoading = false, this._maxConcurrent = 1, this.verbose = e;
  }
  add(t) {
    t.forEach((e) => {
      this._assetList.push(e);
    }), this.verbose && console.log("[BackgroundLoader] assets: ", this._assetList), this._isActive && !this._isLoading && this._next();
  }
  async _next() {
    if (this._assetList.length && this._isActive) {
      this._isLoading = true;
      const t = [], e = Math.min(this._assetList.length, this._maxConcurrent);
      for (let s = 0; s < e; s++) t.push(this._assetList.pop());
      await this._loader.load(t), this._isLoading = false, this._next();
    }
  }
  get active() {
    return this._isActive;
  }
  set active(t) {
    this._isActive !== t && (this._isActive = t, t && !this._isLoading && this._next());
  }
}
const Gm = { extension: { type: x$1.CacheParser, name: "cacheTextureArray" }, test: (r) => Array.isArray(r) && r.every((t) => t instanceof A$1), getCacheableAssets: (r, t) => {
  const e = {};
  return r.forEach((s) => {
    t.forEach((i, n) => {
      e[s + (n === 0 ? "" : n + 1)] = i;
    });
  }), e;
} };
async function Ta(r) {
  if ("Image" in globalThis) return new Promise((t) => {
    const e = new Image();
    e.onload = () => {
      t(true);
    }, e.onerror = () => {
      t(false);
    }, e.src = r;
  });
  if ("createImageBitmap" in globalThis && "fetch" in globalThis) {
    try {
      const t = await (await fetch(r)).blob();
      await createImageBitmap(t);
    } catch (t) {
      return false;
    }
    return true;
  }
  return false;
}
const Im = { extension: { type: x$1.DetectionParser, priority: 1 }, test: async () => Ta("data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="), add: async (r) => [...r, "avif"], remove: async (r) => r.filter((t) => t !== "avif") }, Bm = ["png", "jpg", "jpeg"], Fm = { extension: { type: x$1.DetectionParser, priority: -1 }, test: () => Promise.resolve(true), add: async (r) => [...r, ...Bm], remove: async (r) => r.filter((t) => !Bm.includes(t)) }, v2 = "WorkerGlobalScope" in globalThis && globalThis instanceof globalThis.WorkerGlobalScope;
function li(r) {
  return v2 ? false : document.createElement("video").canPlayType(r) !== "";
}
const Dm = { extension: { type: x$1.DetectionParser, priority: 0 }, test: async () => li("video/mp4"), add: async (r) => [...r, "mp4", "m4v"], remove: async (r) => r.filter((t) => t !== "mp4" && t !== "m4v") }, Um = { extension: { type: x$1.DetectionParser, priority: 0 }, test: async () => li("video/ogg"), add: async (r) => [...r, "ogv"], remove: async (r) => r.filter((t) => t !== "ogv") }, km = { extension: { type: x$1.DetectionParser, priority: 0 }, test: async () => li("video/webm"), add: async (r) => [...r, "webm"], remove: async (r) => r.filter((t) => t !== "webm") }, $m = { extension: { type: x$1.DetectionParser, priority: 0 }, test: async () => Ta("data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="), add: async (r) => [...r, "webp"], remove: async (r) => r.filter((t) => t !== "webp") };
var y2 = Object.defineProperty, T2 = Object.defineProperties, S2 = Object.getOwnPropertyDescriptors, Lm = Object.getOwnPropertySymbols, E2 = Object.prototype.hasOwnProperty, A2 = Object.prototype.propertyIsEnumerable, Nm = (r, t, e) => t in r ? y2(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, w2 = (r, t) => {
  for (var e in t || (t = {})) E2.call(t, e) && Nm(r, e, t[e]);
  if (Lm) for (var e of Lm(t)) A2.call(t, e) && Nm(r, e, t[e]);
  return r;
}, P2 = (r, t) => T2(r, S2(t));
class Xm {
  constructor() {
    this._parsers = [], this._parsersValidated = false, this.parsers = new Proxy(this._parsers, { set: (t, e, s) => (this._parsersValidated = false, t[e] = s, true) }), this.promiseCache = {};
  }
  reset() {
    this._parsersValidated = false, this.promiseCache = {};
  }
  _getLoadPromiseAndParser(t, e) {
    const s = { promise: null, parser: null };
    return s.promise = (async () => {
      var i, n;
      let o = null, a = null;
      if (e.loadParser && (a = this._parserHash[e.loadParser]), !a) {
        for (let l3 = 0; l3 < this.parsers.length; l3++) {
          const u3 = this.parsers[l3];
          if (u3.load && (i = u3.test) != null && i.call(u3, t, e, this)) {
            a = u3;
            break;
          }
        }
        if (!a) return null;
      }
      o = await a.load(t, e, this), s.parser = a;
      for (let l3 = 0; l3 < this.parsers.length; l3++) {
        const u3 = this.parsers[l3];
        u3.parse && u3.parse && await ((n = u3.testParse) == null ? void 0 : n.call(u3, o, e, this)) && (o = await u3.parse(o, e, this) || o, s.parser = u3);
      }
      return o;
    })(), s;
  }
  async load(t, e) {
    this._parsersValidated || this._validateParsers();
    let s = 0;
    const i = {}, n = Sr(t), o = Mt(t, (u3) => ({ alias: [u3], src: u3, data: {} })), a = o.length, l3 = o.map(async (u3) => {
      const c = pt.toAbsolute(u3.src);
      if (!i[u3.src]) try {
        this.promiseCache[c] || (this.promiseCache[c] = this._getLoadPromiseAndParser(c, u3)), i[u3.src] = await this.promiseCache[c].promise, e && e(++s / a);
      } catch (h) {
        throw delete this.promiseCache[c], delete i[u3.src], new Error(`[Loader.load] Failed to load ${c}.
${h}`);
      }
    });
    return await Promise.all(l3), n ? i[o[0].src] : i;
  }
  async unload(t) {
    const e = Mt(t, (s) => ({ alias: [s], src: s })).map(async (s) => {
      var i, n;
      const o = pt.toAbsolute(s.src), a = this.promiseCache[o];
      if (a) {
        const l3 = await a.promise;
        delete this.promiseCache[o], await ((n = (i = a.parser) == null ? void 0 : i.unload) == null ? void 0 : n.call(i, l3, s, this));
      }
    });
    await Promise.all(e);
  }
  _validateParsers() {
    this._parsersValidated = true, this._parserHash = this._parsers.filter((t) => t.name).reduce((t, e) => (e.name && t[e.name], P2(w2({}, t), { [e.name]: e })), {});
  }
}
function Re(r, t) {
  if (Array.isArray(t)) {
    for (const e of t) if (r.startsWith(`data:${e}`)) return true;
    return false;
  }
  return r.startsWith(`data:${t}`);
}
function Gt$1(r, t) {
  const e = r.split("?")[0], s = pt.extname(e).toLowerCase();
  return Array.isArray(t) ? t.includes(s) : s === t;
}
const R2 = ".json", M2 = "application/json", Hm = { extension: { type: x$1.LoadParser, priority: vt$1.Low }, name: "loadJson", test(r) {
  return Re(r, M2) || Gt$1(r, R2);
}, async load(r) {
  return await (await L.get().fetch(r)).json();
} }, C2 = ".txt", O2 = "text/plain", jm = { name: "loadTxt", extension: { type: x$1.LoadParser, priority: vt$1.Low, name: "loadTxt" }, test(r) {
  return Re(r, O2) || Gt$1(r, C2);
}, async load(r) {
  return await (await L.get().fetch(r)).text();
} };
var G2 = Object.defineProperty, I2 = Object.defineProperties, B2 = Object.getOwnPropertyDescriptors, zm = Object.getOwnPropertySymbols, F2 = Object.prototype.hasOwnProperty, D2 = Object.prototype.propertyIsEnumerable, Vm = (r, t, e) => t in r ? G2(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, U2 = (r, t) => {
  for (var e in t || (t = {})) F2.call(t, e) && Vm(r, e, t[e]);
  if (zm) for (var e of zm(t)) D2.call(t, e) && Vm(r, e, t[e]);
  return r;
}, k2 = (r, t) => I2(r, B2(t));
const $2 = ["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"], L2 = [".ttf", ".otf", ".woff", ".woff2"], N2 = ["font/ttf", "font/otf", "font/woff", "font/woff2"], X2 = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;
function Wm(r) {
  const t = pt.extname(r), e = pt.basename(r, t).replace(/(-|_)/g, " ").toLowerCase().split(" ").map((n) => n.charAt(0).toUpperCase() + n.slice(1));
  let s = e.length > 0;
  for (const n of e) if (!n.match(X2)) {
    s = false;
    break;
  }
  let i = e.join(" ");
  return s || (i = `"${i.replace(/[\\"]/g, "\\$&")}"`), i;
}
const H2 = /^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;
function j2(r) {
  return H2.test(r) ? r : encodeURI(r);
}
const Ym = { extension: { type: x$1.LoadParser, priority: vt$1.Low }, name: "loadWebFont", test(r) {
  return Re(r, N2) || Gt$1(r, L2);
}, async load(r, t) {
  var e, s, i, n, o, a;
  const l3 = L.get().getFontFaceSet();
  if (l3) {
    const u3 = [], c = (s = (e = t.data) == null ? void 0 : e.family) != null ? s : Wm(r), h = (o = (n = (i = t.data) == null ? void 0 : i.weights) == null ? void 0 : n.filter((p) => $2.includes(p))) != null ? o : ["normal"], d = (a = t.data) != null ? a : {};
    for (let p = 0; p < h.length; p++) {
      const f2 = h[p], g = new FontFace(c, `url(${j2(r)})`, k2(U2({}, d), { weight: f2 }));
      await g.load(), l3.add(g), u3.push(g);
    }
    return V$1.set(`${c}-and-url`, { url: r, fontFaces: u3 }), u3.length === 1 ? u3[0] : u3;
  }
  return null;
}, unload(r) {
  (Array.isArray(r) ? r : [r]).forEach((t) => {
    V$1.remove(`${t.family}-and-url`), L.get().getFontFaceSet().delete(t);
  });
} };
function ui(r, t = 1) {
  var e;
  const s = (e = se.RETINA_PREFIX) == null ? void 0 : e.exec(r);
  return s ? parseFloat(s[1]) : t;
}
function ae(r, t, e) {
  r.label = e, r._sourceOrigin = e;
  const s = new A$1({ source: r, label: e }), i = () => {
    delete t.promiseCache[e], V$1.has(e) && V$1.remove(e);
  };
  return s.source.once("destroy", () => {
    t.promiseCache[e] && i();
  }), s.once("destroy", () => {
    r.destroyed || i();
  }), s;
}
var z2 = Object.defineProperty, ci = Object.getOwnPropertySymbols, Km = Object.prototype.hasOwnProperty, qm = Object.prototype.propertyIsEnumerable, Zm = (r, t, e) => t in r ? z2(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, V2 = (r, t) => {
  for (var e in t || (t = {})) Km.call(t, e) && Zm(r, e, t[e]);
  if (ci) for (var e of ci(t)) qm.call(t, e) && Zm(r, e, t[e]);
  return r;
}, W2 = (r, t) => {
  var e = {};
  for (var s in r) Km.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && ci) for (var s of ci(r)) t.indexOf(s) < 0 && qm.call(r, s) && (e[s] = r[s]);
  return e;
};
const Y2 = ".svg", K2 = "image/svg+xml", Qm = { extension: { type: x$1.LoadParser, priority: vt$1.Low, name: "loadSVG" }, name: "loadSVG", config: { crossOrigin: "anonymous", parseAsGraphicsContext: false }, test(r) {
  return Re(r, K2) || Gt$1(r, Y2);
}, async load(r, t, e) {
  var s, i;
  return ((i = (s = t.data) == null ? void 0 : s.parseAsGraphicsContext) != null ? i : this.config.parseAsGraphicsContext) ? Z2(r) : q2(r, t, e, this.config.crossOrigin);
}, unload(r) {
  r.destroy(true);
} };
async function q2(r, t, e, s) {
  var i, n, o, a, l3, u3;
  const c = await (await L.get().fetch(r)).blob(), h = URL.createObjectURL(c), d = new Image();
  d.src = h, d.crossOrigin = s, await d.decode(), URL.revokeObjectURL(h);
  const p = document.createElement("canvas"), f2 = p.getContext("2d"), g = ((i = t.data) == null ? void 0 : i.resolution) || ui(r), m3 = (o = (n = t.data) == null ? void 0 : n.width) != null ? o : d.width, _ = (l3 = (a = t.data) == null ? void 0 : a.height) != null ? l3 : d.height;
  p.width = m3 * g, p.height = _ * g, f2.drawImage(d, 0, 0, m3 * g, _ * g);
  const b = (u3 = t.data) != null ? u3 : {}, y4 = W2(b, ["parseAsGraphicsContext"]), S3 = new ie(V2({ resource: p, alphaMode: "premultiply-alpha-on-upload", resolution: g }, y4));
  return ae(S3, e, r);
}
async function Z2(r) {
  const t = await (await L.get().fetch(r)).text(), e = new ct();
  return e.svg(t), e;
}
const Q2 = `(function(){"use strict";const e="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";async function a(){try{if(typeof createImageBitmap!="function")return!1;const A=await(await fetch(e)).blob(),t=await createImageBitmap(A);return t.width===1&&t.height===1}catch(A){return!1}}a().then(A=>{self.postMessage(A)})})();
`;
let Ze = null, Sa = class {
  constructor() {
    Ze || (Ze = URL.createObjectURL(new Blob([Q2], { type: "application/javascript" }))), this.worker = new Worker(Ze);
  }
};
Sa.revokeObjectURL = function() {
  Ze && (URL.revokeObjectURL(Ze), Ze = null);
};
const J2 = '(function(){"use strict";async function s(a,t){const e=await fetch(a);if(!e.ok)throw new Error(`[WorkerManager.loadImageBitmap] Failed to fetch ${a}: ${e.status} ${e.statusText}`);const i=await e.blob();return t==="premultiplied-alpha"?createImageBitmap(i,{premultiplyAlpha:"none"}):createImageBitmap(i)}self.onmessage=async a=>{try{const t=await s(a.data.data[0],a.data.data[1]);self.postMessage({data:t,uuid:a.data.uuid,id:a.data.id},[t])}catch(t){self.postMessage({error:t,uuid:a.data.uuid,id:a.data.id})}}})();\n';
let Qe = null, Jm = class {
  constructor() {
    Qe || (Qe = URL.createObjectURL(new Blob([J2], { type: "application/javascript" }))), this.worker = new Worker(Qe);
  }
};
Jm.revokeObjectURL = function() {
  Qe && (URL.revokeObjectURL(Qe), Qe = null);
};
let tg = 0, Ea, tE = class {
  constructor() {
    this._initialized = false, this._createdWorkers = 0, this._workerPool = [], this._queue = [], this._resolveHash = {};
  }
  isImageBitmapSupported() {
    return this._isImageBitmapSupported !== void 0 ? this._isImageBitmapSupported : (this._isImageBitmapSupported = new Promise((t) => {
      const { worker: e } = new Sa();
      e.addEventListener("message", (s) => {
        e.terminate(), Sa.revokeObjectURL(), t(s.data);
      });
    }), this._isImageBitmapSupported);
  }
  loadImageBitmap(t, e) {
    var s;
    return this._run("loadImageBitmap", [t, (s = e == null ? void 0 : e.data) == null ? void 0 : s.alphaMode]);
  }
  async _initWorkers() {
    this._initialized || (this._initialized = true);
  }
  _getWorker() {
    Ea === void 0 && (Ea = navigator.hardwareConcurrency || 4);
    let t = this._workerPool.pop();
    return !t && this._createdWorkers < Ea && (this._createdWorkers++, t = new Jm().worker, t.addEventListener("message", (e) => {
      this._complete(e.data), this._returnWorker(e.target), this._next();
    })), t;
  }
  _returnWorker(t) {
    this._workerPool.push(t);
  }
  _complete(t) {
    t.error !== void 0 ? this._resolveHash[t.uuid].reject(t.error) : this._resolveHash[t.uuid].resolve(t.data), this._resolveHash[t.uuid] = null;
  }
  async _run(t, e) {
    await this._initWorkers();
    const s = new Promise((i, n) => {
      this._queue.push({ id: t, arguments: e, resolve: i, reject: n });
    });
    return this._next(), s;
  }
  _next() {
    if (!this._queue.length) return;
    const t = this._getWorker();
    if (!t) return;
    const e = this._queue.pop(), s = e.id;
    this._resolveHash[tg] = { resolve: e.resolve, reject: e.reject }, t.postMessage({ data: e.arguments, uuid: tg++, id: s });
  }
};
const Aa = new tE();
var eE = Object.defineProperty, eg = Object.getOwnPropertySymbols, rE = Object.prototype.hasOwnProperty, sE = Object.prototype.propertyIsEnumerable, rg = (r, t, e) => t in r ? eE(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, iE = (r, t) => {
  for (var e in t || (t = {})) rE.call(t, e) && rg(r, e, t[e]);
  if (eg) for (var e of eg(t)) sE.call(t, e) && rg(r, e, t[e]);
  return r;
};
const nE = [".jpeg", ".jpg", ".png", ".webp", ".avif"], oE = ["image/jpeg", "image/png", "image/webp", "image/avif"];
async function sg(r, t) {
  var e;
  const s = await L.get().fetch(r);
  if (!s.ok) throw new Error(`[loadImageBitmap] Failed to fetch ${r}: ${s.status} ${s.statusText}`);
  const i = await s.blob();
  return ((e = t == null ? void 0 : t.data) == null ? void 0 : e.alphaMode) === "premultiplied-alpha" ? createImageBitmap(i, { premultiplyAlpha: "none" }) : createImageBitmap(i);
}
const wa = { name: "loadTextures", extension: { type: x$1.LoadParser, priority: vt$1.High, name: "loadTextures" }, config: { preferWorkers: true, preferCreateImageBitmap: true, crossOrigin: "anonymous" }, test(r) {
  return Re(r, oE) || Gt$1(r, nE);
}, async load(r, t, e) {
  var s;
  let i = null;
  globalThis.createImageBitmap && this.config.preferCreateImageBitmap ? this.config.preferWorkers && await Aa.isImageBitmapSupported() ? i = await Aa.loadImageBitmap(r, t) : i = await sg(r, t) : i = await new Promise((o, a) => {
    i = new Image(), i.crossOrigin = this.config.crossOrigin, i.src = r, i.complete ? o(i) : (i.onload = () => {
      o(i);
    }, i.onerror = a);
  });
  const n = new ie(iE({ resource: i, alphaMode: "premultiply-alpha-on-upload", resolution: ((s = t.data) == null ? void 0 : s.resolution) || ui(r) }, t.data));
  return ae(n, e, r);
}, unload(r) {
  r.destroy(true);
} };
var aE = Object.defineProperty, lE = Object.defineProperties, uE = Object.getOwnPropertyDescriptors, ig = Object.getOwnPropertySymbols, cE = Object.prototype.hasOwnProperty, hE = Object.prototype.propertyIsEnumerable, ng = (r, t, e) => t in r ? aE(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Pa = (r, t) => {
  for (var e in t || (t = {})) cE.call(t, e) && ng(r, e, t[e]);
  if (ig) for (var e of ig(t)) hE.call(t, e) && ng(r, e, t[e]);
  return r;
}, og = (r, t) => lE(r, uE(t));
const ag = [".mp4", ".m4v", ".webm", ".ogg", ".ogv", ".h264", ".avi", ".mov"], dE = ag.map((r) => `video/${r.substring(1)}`);
function lg(r, t, e) {
  e === void 0 && !t.startsWith("data:") ? r.crossOrigin = cg(t) : e !== false && (r.crossOrigin = typeof e == "string" ? e : "anonymous");
}
function ug(r) {
  return new Promise((t, e) => {
    r.addEventListener("canplaythrough", s), r.addEventListener("error", i), r.load();
    function s() {
      n(), t();
    }
    function i(o) {
      n(), e(o);
    }
    function n() {
      r.removeEventListener("canplaythrough", s), r.removeEventListener("error", i);
    }
  });
}
function cg(r, t = globalThis.location) {
  if (r.startsWith("data:")) return "";
  t || (t = globalThis.location);
  const e = new URL(r, document.baseURI);
  return e.hostname !== t.hostname || e.port !== t.port || e.protocol !== t.protocol ? "anonymous" : "";
}
const hg = { name: "loadVideo", extension: { type: x$1.LoadParser, name: "loadVideo" }, test(r) {
  const t = Re(r, dE), e = Gt$1(r, ag);
  return t || e;
}, async load(r, t, e) {
  var s, i;
  const n = Pa(og(Pa({}, Er.defaultOptions), { resolution: ((s = t.data) == null ? void 0 : s.resolution) || ui(r), alphaMode: ((i = t.data) == null ? void 0 : i.alphaMode) || await Un() }), t.data), o = document.createElement("video"), a = { preload: n.autoLoad !== false ? "auto" : void 0, "webkit-playsinline": n.playsinline !== false ? "" : void 0, playsinline: n.playsinline !== false ? "" : void 0, muted: n.muted === true ? "" : void 0, loop: n.loop === true ? "" : void 0, autoplay: n.autoPlay !== false ? "" : void 0 };
  Object.keys(a).forEach((c) => {
    const h = a[c];
    h !== void 0 && o.setAttribute(c, h);
  }), n.muted === true && (o.muted = true), lg(o, r, n.crossorigin);
  const l3 = document.createElement("source");
  let u3;
  if (r.startsWith("data:")) u3 = r.slice(5, r.indexOf(";"));
  else if (!r.startsWith("blob:")) {
    const c = r.split("?")[0].slice(r.lastIndexOf(".") + 1).toLowerCase();
    u3 = Er.MIME_TYPES[c] || `video/${c}`;
  }
  return l3.src = r, u3 && (l3.type = u3), new Promise((c) => {
    const h = async () => {
      const d = new Er(og(Pa({}, n), { resource: o }));
      o.removeEventListener("canplay", h), t.data.preload && await ug(o), c(ae(d, e, r));
    };
    n.preload && !n.autoPlay && o.load(), o.addEventListener("canplay", h), o.appendChild(l3);
  });
}, unload(r) {
  r.destroy(true);
} }, Ra = { extension: { type: x$1.ResolveParser, name: "resolveTexture" }, test: wa.test, parse: (r) => {
  var t, e;
  return { resolution: parseFloat((e = (t = se.RETINA_PREFIX.exec(r)) == null ? void 0 : t[1]) != null ? e : "1"), format: r.split(".").pop(), src: r };
} }, dg = { extension: { type: x$1.ResolveParser, priority: -2, name: "resolveJson" }, test: (r) => se.RETINA_PREFIX.test(r) && r.endsWith(".json"), parse: Ra.parse };
class pg {
  constructor() {
    this._detections = [], this._initialized = false, this.resolver = new se(), this.loader = new Xm(), this.cache = V$1, this._backgroundLoader = new Om(this.loader), this._backgroundLoader.active = true, this.reset();
  }
  async init(t = {}) {
    var e, s, i;
    if (this._initialized) return;
    if (this._initialized = true, t.defaultSearchParams && this.resolver.setDefaultSearchParams(t.defaultSearchParams), t.basePath && (this.resolver.basePath = t.basePath), t.bundleIdentifier && this.resolver.setBundleIdentifier(t.bundleIdentifier), t.manifest) {
      let l3 = t.manifest;
      typeof l3 == "string" && (l3 = await this.load(l3)), this.resolver.addManifest(l3);
    }
    const n = (s = (e = t.texturePreference) == null ? void 0 : e.resolution) != null ? s : 1, o = typeof n == "number" ? [n] : n, a = await this._detectFormats({ preferredFormats: (i = t.texturePreference) == null ? void 0 : i.format, skipDetections: t.skipDetections, detections: this._detections });
    this.resolver.prefer({ params: { format: a, resolution: o } }), t.preferences && this.setPreferences(t.preferences);
  }
  add(t) {
    this.resolver.add(t);
  }
  async load(t, e) {
    this._initialized || await this.init();
    const s = Sr(t), i = Mt(t).map((a) => {
      if (typeof a != "string") {
        const l3 = this.resolver.getAlias(a);
        return l3.some((u3) => !this.resolver.hasKey(u3)) && this.add(a), Array.isArray(l3) ? l3[0] : l3;
      }
      return this.resolver.hasKey(a) || this.add({ alias: a, src: a }), a;
    }), n = this.resolver.resolve(i), o = await this._mapLoadToResolve(n, e);
    return s ? o[i[0]] : o;
  }
  addBundle(t, e) {
    this.resolver.addBundle(t, e);
  }
  async loadBundle(t, e) {
    this._initialized || await this.init();
    let s = false;
    typeof t == "string" && (s = true, t = [t]);
    const i = this.resolver.resolveBundle(t), n = {}, o = Object.keys(i);
    let a = 0, l3 = 0;
    const u3 = () => {
      e == null || e(++a / l3);
    }, c = o.map((h) => {
      const d = i[h];
      return l3 += Object.keys(d).length, this._mapLoadToResolve(d, u3).then((p) => {
        n[h] = p;
      });
    });
    return await Promise.all(c), s ? n[t[0]] : n;
  }
  async backgroundLoad(t) {
    this._initialized || await this.init(), typeof t == "string" && (t = [t]);
    const e = this.resolver.resolve(t);
    this._backgroundLoader.add(Object.values(e));
  }
  async backgroundLoadBundle(t) {
    this._initialized || await this.init(), typeof t == "string" && (t = [t]);
    const e = this.resolver.resolveBundle(t);
    Object.values(e).forEach((s) => {
      this._backgroundLoader.add(Object.values(s));
    });
  }
  reset() {
    this.resolver.reset(), this.loader.reset(), this.cache.reset(), this._initialized = false;
  }
  get(t) {
    if (typeof t == "string") return V$1.get(t);
    const e = {};
    for (let s = 0; s < t.length; s++) e[s] = V$1.get(t[s]);
    return e;
  }
  async _mapLoadToResolve(t, e) {
    const s = [...new Set(Object.values(t))];
    this._backgroundLoader.active = false;
    const i = await this.loader.load(s, e);
    this._backgroundLoader.active = true;
    const n = {};
    return s.forEach((o) => {
      const a = i[o.src], l3 = [o.src];
      o.alias && l3.push(...o.alias), l3.forEach((u3) => {
        n[u3] = a;
      }), V$1.set(l3, a);
    }), n;
  }
  async unload(t) {
    this._initialized || await this.init();
    const e = Mt(t).map((i) => typeof i != "string" ? i.src : i), s = this.resolver.resolve(e);
    await this._unloadFromResolved(s);
  }
  async unloadBundle(t) {
    this._initialized || await this.init(), t = Mt(t);
    const e = this.resolver.resolveBundle(t), s = Object.keys(e).map((i) => this._unloadFromResolved(e[i]));
    await Promise.all(s);
  }
  async _unloadFromResolved(t) {
    const e = Object.values(t);
    e.forEach((s) => {
      V$1.remove(s.src);
    }), await this.loader.unload(e);
  }
  async _detectFormats(t) {
    let e = [];
    t.preferredFormats && (e = Array.isArray(t.preferredFormats) ? t.preferredFormats : [t.preferredFormats]);
    for (const s of t.detections) t.skipDetections || await s.test() ? e = await s.add(e) : t.skipDetections || (e = await s.remove(e));
    return e = e.filter((s, i) => e.indexOf(s) === i), e;
  }
  get detections() {
    return this._detections;
  }
  setPreferences(t) {
    this.loader.parsers.forEach((e) => {
      e.config && Object.keys(e.config).filter((s) => s in t).forEach((s) => {
        e.config[s] = t[s];
      });
    });
  }
}
const Yr = new pg();
G$1.handleByList(x$1.LoadParser, Yr.loader.parsers).handleByList(x$1.ResolveParser, Yr.resolver.parsers).handleByList(x$1.CacheParser, Yr.cache.parsers).handleByList(x$1.DetectionParser, Yr.detections), G$1.add(Gm, Fm, Im, $m, Dm, Um, km, Hm, jm, Ym, Qm, wa, hg, Cm, Mm, Ra, dg);
const fg = { loader: x$1.LoadParser, resolver: x$1.ResolveParser, cache: x$1.CacheParser, detection: x$1.DetectionParser };
G$1.handle(x$1.Asset, (r) => {
  const t = r.ref;
  Object.entries(fg).filter(([e]) => !!t[e]).forEach(([e, s]) => {
    var i;
    return G$1.add(Object.assign(t[e], { extension: (i = t[e].extension) != null ? i : s }));
  });
}, (r) => {
  const t = r.ref;
  Object.keys(fg).filter((e) => !!t[e]).forEach((e) => G$1.remove(t[e]));
});
({ extension: { type: x$1.DetectionParser, priority: 3 }, test: async () => !!(await zr() || jr()), add: async (r) => [...r, "basis"], remove: async (r) => r.filter((t) => t !== "basis") });
class Kr extends K$1 {
  constructor(t) {
    super(t), this.uploadMethodId = "compressed", this.resource = t.resource, this.mipLevelCount = this.resource.length;
  }
}
let hi;
function Ma() {
  if (hi) return hi;
  const r = document.createElement("canvas").getContext("webgl");
  return r ? (hi = [...r.getExtension("EXT_texture_compression_bptc") ? ["bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb"] : [], ...r.getExtension("WEBGL_compressed_texture_s3tc") ? ["bc1-rgba-unorm", "bc2-rgba-unorm", "bc3-rgba-unorm"] : [], ...r.getExtension("WEBGL_compressed_texture_s3tc_srgb") ? ["bc1-rgba-unorm-srgb", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm-srgb"] : [], ...r.getExtension("EXT_texture_compression_rgtc") ? ["bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm"] : [], ...r.getExtension("WEBGL_compressed_texture_etc") ? ["etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "eac-r11unorm", "eac-rg11unorm"] : [], ...r.getExtension("WEBGL_compressed_texture_astc") ? ["astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"] : []], hi) : [];
}
let di;
async function Ca() {
  if (di) return di;
  const r = await L.get().getNavigator().gpu.requestAdapter();
  return di = [...r.features.has("texture-compression-bc") ? ["bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb"] : [], ...r.features.has("texture-compression-etc2") ? ["etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm"] : [], ...r.features.has("texture-compression-astc") ? ["astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"] : []], di;
}
let Oa;
async function Ga() {
  return Oa !== void 0 || (Oa = await (async () => {
    const r = await zr(), t = jr();
    if (r && t) {
      const e = await Ca(), s = Ma();
      return e.filter((i) => s.includes(i));
    } else {
      if (r) return await Ca();
      if (t) return Ma();
    }
    return [];
  })()), Oa;
}
const mg = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8"];
let pi;
async function qr() {
  if (pi !== void 0) return pi;
  const r = await Ga();
  return pi = [...mg, ...r], pi;
}
const fE = '(function(){"use strict";function g(r,a){const t=r.getNumImages(),s=r.getNumLevels(0);if(!r.startTranscoding())throw new Error("startTranscoding failed");const m=[];for(let e=0;e<s;++e)for(let o=0;o<t;++o){const B=r.getImageTranscodedSizeInBytes(o,e,a),f=new Uint8Array(B);if(!r.transcodeImage(f,o,e,a,1,0))throw new Error("transcodeImage failed");m.push(f)}return m}const w={"bc3-rgba-unorm":3,"bc7-rgba-unorm":6,"etc2-rgba8unorm":1,"astc-4x4-unorm":10,rgba8unorm:13,rgba4unorm:16};function d(r){const a=w[r];if(a)return a;throw new Error(`Unsupported transcoderFormat: ${r}`)}const n={jsUrl:"basis/basis_transcoder.js",wasmUrl:"basis/basis_transcoder.wasm"};let u,i,c;async function l(){if(!c){const r=new URL(n.jsUrl,location.origin).href,a=new URL(n.wasmUrl,location.origin).href;importScripts(r),c=new Promise(t=>{BASIS({locateFile:s=>a}).then(s=>{s.initializeBasis(),t(s.BasisFile)})})}return c}async function b(r,a){const t=await fetch(r);if(t.ok){const s=await t.arrayBuffer();return new a(new Uint8Array(s))}throw new Error(`Failed to load Basis texture: ${r}`)}const h=["bc7-rgba-unorm","astc-4x4-unorm","etc2-rgba8unorm","bc3-rgba-unorm","rgba8unorm"];async function p(r){const a=await l(),t=await b(r,a),s=g(t,u);return{width:t.getImageWidth(0,0),height:t.getImageHeight(0,0),format:i,resource:s,alphaMode:"no-premultiply-alpha"}}async function y(r,a,t){r&&(n.jsUrl=r),a&&(n.wasmUrl=a),i=h.filter(s=>t.includes(s))[0],u=d(i),await l()}const U={init:async r=>{const{jsUrl:a,wasmUrl:t,supportedTextures:s}=r;await y(a,t,s)},load:async r=>{var a;try{const t=await p(r.url);return{type:"load",url:r.url,success:!0,textureOptions:t,transferables:(a=t.resource)==null?void 0:a.map(s=>s.buffer)}}catch(t){throw t}}};self.onmessage=async r=>{const a=r.data,t=await U[a.type](a);t&&self.postMessage(t,t.transferables)}})();\n';
let Je = null, gg = class {
  constructor() {
    Je || (Je = URL.createObjectURL(new Blob([fE], { type: "application/javascript" }))), this.worker = new Worker(Je);
  }
};
gg.revokeObjectURL = function() {
  Je && (URL.revokeObjectURL(Je), Je = null);
};
const fi = { jsUrl: "https://files.pixijs.download/transcoders/basis/basis_transcoder.js", wasmUrl: "https://files.pixijs.download/transcoders/basis/basis_transcoder.wasm" };
let Zr;
const _g = {};
function gE(r) {
  return Zr || (Zr = new gg().worker, Zr.onmessage = (t) => {
    const { success: e, url: s, textureOptions: i } = t.data;
    e || console.warn("Failed to load Basis texture", s), _g[s](i);
  }, Zr.postMessage({ type: "init", jsUrl: fi.jsUrl, wasmUrl: fi.wasmUrl, supportedTextures: r })), Zr;
}
function xg(r, t) {
  const e = gE(t);
  return new Promise((s) => {
    _g[r] = s, e.postMessage({ type: "load", url: r });
  });
}
({ extension: { type: x$1.LoadParser, priority: vt$1.High, name: "loadBasis" }, name: "loadBasis", test(r) {
  return Gt$1(r, [".basis"]);
}, async load(r, t, e) {
  const s = await qr(), i = await xg(r, s), n = new Kr(i);
  return ae(n, e, r);
}, unload(r) {
  Array.isArray(r) ? r.forEach((t) => t.destroy(true)) : r.destroy(true);
} });
const yE = { MAGIC: 0, SIZE: 1, FLAGS: 2, HEIGHT: 3, WIDTH: 4, MIPMAP_COUNT: 7, PIXEL_FORMAT: 19, PF_FLAGS: 20, FOURCC: 21, RGB_BITCOUNT: 22, R_BIT_MASK: 23, G_BIT_MASK: 24, B_BIT_MASK: 25, A_BIT_MASK: 26 }, TE = { DXGI_FORMAT: 0, RESOURCE_DIMENSION: 1, MISC_FLAG: 2, ARRAY_SIZE: 3, MISC_FLAGS2: 4 };
var Ia = ((r) => (r[r.DXGI_FORMAT_UNKNOWN = 0] = "DXGI_FORMAT_UNKNOWN", r[r.DXGI_FORMAT_R32G32B32A32_TYPELESS = 1] = "DXGI_FORMAT_R32G32B32A32_TYPELESS", r[r.DXGI_FORMAT_R32G32B32A32_FLOAT = 2] = "DXGI_FORMAT_R32G32B32A32_FLOAT", r[r.DXGI_FORMAT_R32G32B32A32_UINT = 3] = "DXGI_FORMAT_R32G32B32A32_UINT", r[r.DXGI_FORMAT_R32G32B32A32_SINT = 4] = "DXGI_FORMAT_R32G32B32A32_SINT", r[r.DXGI_FORMAT_R32G32B32_TYPELESS = 5] = "DXGI_FORMAT_R32G32B32_TYPELESS", r[r.DXGI_FORMAT_R32G32B32_FLOAT = 6] = "DXGI_FORMAT_R32G32B32_FLOAT", r[r.DXGI_FORMAT_R32G32B32_UINT = 7] = "DXGI_FORMAT_R32G32B32_UINT", r[r.DXGI_FORMAT_R32G32B32_SINT = 8] = "DXGI_FORMAT_R32G32B32_SINT", r[r.DXGI_FORMAT_R16G16B16A16_TYPELESS = 9] = "DXGI_FORMAT_R16G16B16A16_TYPELESS", r[r.DXGI_FORMAT_R16G16B16A16_FLOAT = 10] = "DXGI_FORMAT_R16G16B16A16_FLOAT", r[r.DXGI_FORMAT_R16G16B16A16_UNORM = 11] = "DXGI_FORMAT_R16G16B16A16_UNORM", r[r.DXGI_FORMAT_R16G16B16A16_UINT = 12] = "DXGI_FORMAT_R16G16B16A16_UINT", r[r.DXGI_FORMAT_R16G16B16A16_SNORM = 13] = "DXGI_FORMAT_R16G16B16A16_SNORM", r[r.DXGI_FORMAT_R16G16B16A16_SINT = 14] = "DXGI_FORMAT_R16G16B16A16_SINT", r[r.DXGI_FORMAT_R32G32_TYPELESS = 15] = "DXGI_FORMAT_R32G32_TYPELESS", r[r.DXGI_FORMAT_R32G32_FLOAT = 16] = "DXGI_FORMAT_R32G32_FLOAT", r[r.DXGI_FORMAT_R32G32_UINT = 17] = "DXGI_FORMAT_R32G32_UINT", r[r.DXGI_FORMAT_R32G32_SINT = 18] = "DXGI_FORMAT_R32G32_SINT", r[r.DXGI_FORMAT_R32G8X24_TYPELESS = 19] = "DXGI_FORMAT_R32G8X24_TYPELESS", r[r.DXGI_FORMAT_D32_FLOAT_S8X24_UINT = 20] = "DXGI_FORMAT_D32_FLOAT_S8X24_UINT", r[r.DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS = 21] = "DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS", r[r.DXGI_FORMAT_X32_TYPELESS_G8X24_UINT = 22] = "DXGI_FORMAT_X32_TYPELESS_G8X24_UINT", r[r.DXGI_FORMAT_R10G10B10A2_TYPELESS = 23] = "DXGI_FORMAT_R10G10B10A2_TYPELESS", r[r.DXGI_FORMAT_R10G10B10A2_UNORM = 24] = "DXGI_FORMAT_R10G10B10A2_UNORM", r[r.DXGI_FORMAT_R10G10B10A2_UINT = 25] = "DXGI_FORMAT_R10G10B10A2_UINT", r[r.DXGI_FORMAT_R11G11B10_FLOAT = 26] = "DXGI_FORMAT_R11G11B10_FLOAT", r[r.DXGI_FORMAT_R8G8B8A8_TYPELESS = 27] = "DXGI_FORMAT_R8G8B8A8_TYPELESS", r[r.DXGI_FORMAT_R8G8B8A8_UNORM = 28] = "DXGI_FORMAT_R8G8B8A8_UNORM", r[r.DXGI_FORMAT_R8G8B8A8_UNORM_SRGB = 29] = "DXGI_FORMAT_R8G8B8A8_UNORM_SRGB", r[r.DXGI_FORMAT_R8G8B8A8_UINT = 30] = "DXGI_FORMAT_R8G8B8A8_UINT", r[r.DXGI_FORMAT_R8G8B8A8_SNORM = 31] = "DXGI_FORMAT_R8G8B8A8_SNORM", r[r.DXGI_FORMAT_R8G8B8A8_SINT = 32] = "DXGI_FORMAT_R8G8B8A8_SINT", r[r.DXGI_FORMAT_R16G16_TYPELESS = 33] = "DXGI_FORMAT_R16G16_TYPELESS", r[r.DXGI_FORMAT_R16G16_FLOAT = 34] = "DXGI_FORMAT_R16G16_FLOAT", r[r.DXGI_FORMAT_R16G16_UNORM = 35] = "DXGI_FORMAT_R16G16_UNORM", r[r.DXGI_FORMAT_R16G16_UINT = 36] = "DXGI_FORMAT_R16G16_UINT", r[r.DXGI_FORMAT_R16G16_SNORM = 37] = "DXGI_FORMAT_R16G16_SNORM", r[r.DXGI_FORMAT_R16G16_SINT = 38] = "DXGI_FORMAT_R16G16_SINT", r[r.DXGI_FORMAT_R32_TYPELESS = 39] = "DXGI_FORMAT_R32_TYPELESS", r[r.DXGI_FORMAT_D32_FLOAT = 40] = "DXGI_FORMAT_D32_FLOAT", r[r.DXGI_FORMAT_R32_FLOAT = 41] = "DXGI_FORMAT_R32_FLOAT", r[r.DXGI_FORMAT_R32_UINT = 42] = "DXGI_FORMAT_R32_UINT", r[r.DXGI_FORMAT_R32_SINT = 43] = "DXGI_FORMAT_R32_SINT", r[r.DXGI_FORMAT_R24G8_TYPELESS = 44] = "DXGI_FORMAT_R24G8_TYPELESS", r[r.DXGI_FORMAT_D24_UNORM_S8_UINT = 45] = "DXGI_FORMAT_D24_UNORM_S8_UINT", r[r.DXGI_FORMAT_R24_UNORM_X8_TYPELESS = 46] = "DXGI_FORMAT_R24_UNORM_X8_TYPELESS", r[r.DXGI_FORMAT_X24_TYPELESS_G8_UINT = 47] = "DXGI_FORMAT_X24_TYPELESS_G8_UINT", r[r.DXGI_FORMAT_R8G8_TYPELESS = 48] = "DXGI_FORMAT_R8G8_TYPELESS", r[r.DXGI_FORMAT_R8G8_UNORM = 49] = "DXGI_FORMAT_R8G8_UNORM", r[r.DXGI_FORMAT_R8G8_UINT = 50] = "DXGI_FORMAT_R8G8_UINT", r[r.DXGI_FORMAT_R8G8_SNORM = 51] = "DXGI_FORMAT_R8G8_SNORM", r[r.DXGI_FORMAT_R8G8_SINT = 52] = "DXGI_FORMAT_R8G8_SINT", r[r.DXGI_FORMAT_R16_TYPELESS = 53] = "DXGI_FORMAT_R16_TYPELESS", r[r.DXGI_FORMAT_R16_FLOAT = 54] = "DXGI_FORMAT_R16_FLOAT", r[r.DXGI_FORMAT_D16_UNORM = 55] = "DXGI_FORMAT_D16_UNORM", r[r.DXGI_FORMAT_R16_UNORM = 56] = "DXGI_FORMAT_R16_UNORM", r[r.DXGI_FORMAT_R16_UINT = 57] = "DXGI_FORMAT_R16_UINT", r[r.DXGI_FORMAT_R16_SNORM = 58] = "DXGI_FORMAT_R16_SNORM", r[r.DXGI_FORMAT_R16_SINT = 59] = "DXGI_FORMAT_R16_SINT", r[r.DXGI_FORMAT_R8_TYPELESS = 60] = "DXGI_FORMAT_R8_TYPELESS", r[r.DXGI_FORMAT_R8_UNORM = 61] = "DXGI_FORMAT_R8_UNORM", r[r.DXGI_FORMAT_R8_UINT = 62] = "DXGI_FORMAT_R8_UINT", r[r.DXGI_FORMAT_R8_SNORM = 63] = "DXGI_FORMAT_R8_SNORM", r[r.DXGI_FORMAT_R8_SINT = 64] = "DXGI_FORMAT_R8_SINT", r[r.DXGI_FORMAT_A8_UNORM = 65] = "DXGI_FORMAT_A8_UNORM", r[r.DXGI_FORMAT_R1_UNORM = 66] = "DXGI_FORMAT_R1_UNORM", r[r.DXGI_FORMAT_R9G9B9E5_SHAREDEXP = 67] = "DXGI_FORMAT_R9G9B9E5_SHAREDEXP", r[r.DXGI_FORMAT_R8G8_B8G8_UNORM = 68] = "DXGI_FORMAT_R8G8_B8G8_UNORM", r[r.DXGI_FORMAT_G8R8_G8B8_UNORM = 69] = "DXGI_FORMAT_G8R8_G8B8_UNORM", r[r.DXGI_FORMAT_BC1_TYPELESS = 70] = "DXGI_FORMAT_BC1_TYPELESS", r[r.DXGI_FORMAT_BC1_UNORM = 71] = "DXGI_FORMAT_BC1_UNORM", r[r.DXGI_FORMAT_BC1_UNORM_SRGB = 72] = "DXGI_FORMAT_BC1_UNORM_SRGB", r[r.DXGI_FORMAT_BC2_TYPELESS = 73] = "DXGI_FORMAT_BC2_TYPELESS", r[r.DXGI_FORMAT_BC2_UNORM = 74] = "DXGI_FORMAT_BC2_UNORM", r[r.DXGI_FORMAT_BC2_UNORM_SRGB = 75] = "DXGI_FORMAT_BC2_UNORM_SRGB", r[r.DXGI_FORMAT_BC3_TYPELESS = 76] = "DXGI_FORMAT_BC3_TYPELESS", r[r.DXGI_FORMAT_BC3_UNORM = 77] = "DXGI_FORMAT_BC3_UNORM", r[r.DXGI_FORMAT_BC3_UNORM_SRGB = 78] = "DXGI_FORMAT_BC3_UNORM_SRGB", r[r.DXGI_FORMAT_BC4_TYPELESS = 79] = "DXGI_FORMAT_BC4_TYPELESS", r[r.DXGI_FORMAT_BC4_UNORM = 80] = "DXGI_FORMAT_BC4_UNORM", r[r.DXGI_FORMAT_BC4_SNORM = 81] = "DXGI_FORMAT_BC4_SNORM", r[r.DXGI_FORMAT_BC5_TYPELESS = 82] = "DXGI_FORMAT_BC5_TYPELESS", r[r.DXGI_FORMAT_BC5_UNORM = 83] = "DXGI_FORMAT_BC5_UNORM", r[r.DXGI_FORMAT_BC5_SNORM = 84] = "DXGI_FORMAT_BC5_SNORM", r[r.DXGI_FORMAT_B5G6R5_UNORM = 85] = "DXGI_FORMAT_B5G6R5_UNORM", r[r.DXGI_FORMAT_B5G5R5A1_UNORM = 86] = "DXGI_FORMAT_B5G5R5A1_UNORM", r[r.DXGI_FORMAT_B8G8R8A8_UNORM = 87] = "DXGI_FORMAT_B8G8R8A8_UNORM", r[r.DXGI_FORMAT_B8G8R8X8_UNORM = 88] = "DXGI_FORMAT_B8G8R8X8_UNORM", r[r.DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM = 89] = "DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM", r[r.DXGI_FORMAT_B8G8R8A8_TYPELESS = 90] = "DXGI_FORMAT_B8G8R8A8_TYPELESS", r[r.DXGI_FORMAT_B8G8R8A8_UNORM_SRGB = 91] = "DXGI_FORMAT_B8G8R8A8_UNORM_SRGB", r[r.DXGI_FORMAT_B8G8R8X8_TYPELESS = 92] = "DXGI_FORMAT_B8G8R8X8_TYPELESS", r[r.DXGI_FORMAT_B8G8R8X8_UNORM_SRGB = 93] = "DXGI_FORMAT_B8G8R8X8_UNORM_SRGB", r[r.DXGI_FORMAT_BC6H_TYPELESS = 94] = "DXGI_FORMAT_BC6H_TYPELESS", r[r.DXGI_FORMAT_BC6H_UF16 = 95] = "DXGI_FORMAT_BC6H_UF16", r[r.DXGI_FORMAT_BC6H_SF16 = 96] = "DXGI_FORMAT_BC6H_SF16", r[r.DXGI_FORMAT_BC7_TYPELESS = 97] = "DXGI_FORMAT_BC7_TYPELESS", r[r.DXGI_FORMAT_BC7_UNORM = 98] = "DXGI_FORMAT_BC7_UNORM", r[r.DXGI_FORMAT_BC7_UNORM_SRGB = 99] = "DXGI_FORMAT_BC7_UNORM_SRGB", r[r.DXGI_FORMAT_AYUV = 100] = "DXGI_FORMAT_AYUV", r[r.DXGI_FORMAT_Y410 = 101] = "DXGI_FORMAT_Y410", r[r.DXGI_FORMAT_Y416 = 102] = "DXGI_FORMAT_Y416", r[r.DXGI_FORMAT_NV12 = 103] = "DXGI_FORMAT_NV12", r[r.DXGI_FORMAT_P010 = 104] = "DXGI_FORMAT_P010", r[r.DXGI_FORMAT_P016 = 105] = "DXGI_FORMAT_P016", r[r.DXGI_FORMAT_420_OPAQUE = 106] = "DXGI_FORMAT_420_OPAQUE", r[r.DXGI_FORMAT_YUY2 = 107] = "DXGI_FORMAT_YUY2", r[r.DXGI_FORMAT_Y210 = 108] = "DXGI_FORMAT_Y210", r[r.DXGI_FORMAT_Y216 = 109] = "DXGI_FORMAT_Y216", r[r.DXGI_FORMAT_NV11 = 110] = "DXGI_FORMAT_NV11", r[r.DXGI_FORMAT_AI44 = 111] = "DXGI_FORMAT_AI44", r[r.DXGI_FORMAT_IA44 = 112] = "DXGI_FORMAT_IA44", r[r.DXGI_FORMAT_P8 = 113] = "DXGI_FORMAT_P8", r[r.DXGI_FORMAT_A8P8 = 114] = "DXGI_FORMAT_A8P8", r[r.DXGI_FORMAT_B4G4R4A4_UNORM = 115] = "DXGI_FORMAT_B4G4R4A4_UNORM", r[r.DXGI_FORMAT_P208 = 116] = "DXGI_FORMAT_P208", r[r.DXGI_FORMAT_V208 = 117] = "DXGI_FORMAT_V208", r[r.DXGI_FORMAT_V408 = 118] = "DXGI_FORMAT_V408", r[r.DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE = 119] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE", r[r.DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE = 120] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE", r[r.DXGI_FORMAT_FORCE_UINT = 121] = "DXGI_FORMAT_FORCE_UINT", r))(Ia || {}), Ba = ((r) => (r[r.DDS_DIMENSION_TEXTURE1D = 2] = "DDS_DIMENSION_TEXTURE1D", r[r.DDS_DIMENSION_TEXTURE2D = 3] = "DDS_DIMENSION_TEXTURE2D", r[r.DDS_DIMENSION_TEXTURE3D = 6] = "DDS_DIMENSION_TEXTURE3D", r))(Ba || {});
function ot(r) {
  return r.charCodeAt(0) + (r.charCodeAt(1) << 8) + (r.charCodeAt(2) << 16) + (r.charCodeAt(3) << 24);
}
var _t = ((r) => (r[r.UNKNOWN = 0] = "UNKNOWN", r[r.R8G8B8 = 20] = "R8G8B8", r[r.A8R8G8B8 = 21] = "A8R8G8B8", r[r.X8R8G8B8 = 22] = "X8R8G8B8", r[r.R5G6B5 = 23] = "R5G6B5", r[r.X1R5G5B5 = 24] = "X1R5G5B5", r[r.A1R5G5B5 = 25] = "A1R5G5B5", r[r.A4R4G4B4 = 26] = "A4R4G4B4", r[r.R3G3B2 = 27] = "R3G3B2", r[r.A8 = 28] = "A8", r[r.A8R3G3B2 = 29] = "A8R3G3B2", r[r.X4R4G4B4 = 30] = "X4R4G4B4", r[r.A2B10G10R10 = 31] = "A2B10G10R10", r[r.A8B8G8R8 = 32] = "A8B8G8R8", r[r.X8B8G8R8 = 33] = "X8B8G8R8", r[r.G16R16 = 34] = "G16R16", r[r.A2R10G10B10 = 35] = "A2R10G10B10", r[r.A16B16G16R16 = 36] = "A16B16G16R16", r[r.A8P8 = 40] = "A8P8", r[r.P8 = 41] = "P8", r[r.L8 = 50] = "L8", r[r.A8L8 = 51] = "A8L8", r[r.A4L4 = 52] = "A4L4", r[r.V8U8 = 60] = "V8U8", r[r.L6V5U5 = 61] = "L6V5U5", r[r.X8L8V8U8 = 62] = "X8L8V8U8", r[r.Q8W8V8U8 = 63] = "Q8W8V8U8", r[r.V16U16 = 64] = "V16U16", r[r.A2W10V10U10 = 67] = "A2W10V10U10", r[r.Q16W16V16U16 = 110] = "Q16W16V16U16", r[r.R16F = 111] = "R16F", r[r.G16R16F = 112] = "G16R16F", r[r.A16B16G16R16F = 113] = "A16B16G16R16F", r[r.R32F = 114] = "R32F", r[r.G32R32F = 115] = "G32R32F", r[r.A32B32G32R32F = 116] = "A32B32G32R32F", r[r.UYVY = ot("UYVY")] = "UYVY", r[r.R8G8_B8G8 = ot("RGBG")] = "R8G8_B8G8", r[r.YUY2 = ot("YUY2")] = "YUY2", r[r.D3DFMT_G8R8_G8B8 = ot("GRGB")] = "D3DFMT_G8R8_G8B8", r[r.DXT1 = ot("DXT1")] = "DXT1", r[r.DXT2 = ot("DXT2")] = "DXT2", r[r.DXT3 = ot("DXT3")] = "DXT3", r[r.DXT4 = ot("DXT4")] = "DXT4", r[r.DXT5 = ot("DXT5")] = "DXT5", r[r.ATI1 = ot("ATI1")] = "ATI1", r[r.AT1N = ot("AT1N")] = "AT1N", r[r.ATI2 = ot("ATI2")] = "ATI2", r[r.AT2N = ot("AT2N")] = "AT2N", r[r.BC4U = ot("BC4U")] = "BC4U", r[r.BC4S = ot("BC4S")] = "BC4S", r[r.BC5U = ot("BC5U")] = "BC5U", r[r.BC5S = ot("BC5S")] = "BC5S", r[r.DX10 = ot("DX10")] = "DX10", r))(_t || {});
const Fa = { [_t.DXT1]: "bc1-rgba-unorm", [_t.DXT2]: "bc2-rgba-unorm", [_t.DXT3]: "bc2-rgba-unorm", [_t.DXT4]: "bc3-rgba-unorm", [_t.DXT5]: "bc3-rgba-unorm", [_t.ATI1]: "bc4-r-unorm", [_t.BC4U]: "bc4-r-unorm", [_t.BC4S]: "bc4-r-snorm", [_t.ATI2]: "bc5-rg-unorm", [_t.BC5U]: "bc5-rg-unorm", [_t.BC5S]: "bc5-rg-snorm", 36: "rgba16uint", 110: "rgba16sint", 111: "r16float", 112: "rg16float", 113: "rgba16float", 114: "r32float", 115: "rg32float", 116: "rgba32float" }, xt$1 = { 70: "bc1-rgba-unorm", 71: "bc1-rgba-unorm", 72: "bc1-rgba-unorm-srgb", 73: "bc2-rgba-unorm", 74: "bc2-rgba-unorm", 75: "bc2-rgba-unorm-srgb", 76: "bc3-rgba-unorm", 77: "bc3-rgba-unorm", 78: "bc3-rgba-unorm-srgb", 79: "bc4-r-unorm", 80: "bc4-r-unorm", 81: "bc4-r-snorm", 82: "bc5-rg-unorm", 83: "bc5-rg-unorm", 84: "bc5-rg-snorm", 94: "bc6h-rgb-ufloat", 95: "bc6h-rgb-ufloat", 96: "bc6h-rgb-float", 97: "bc7-rgba-unorm", 98: "bc7-rgba-unorm", 99: "bc7-rgba-unorm-srgb", 28: "rgba8unorm", 29: "rgba8unorm-srgb", 87: "bgra8unorm", 91: "bgra8unorm-srgb", 41: "r32float", 49: "rg8unorm", 56: "r16uint", 61: "r8unorm", 24: "rgb10a2unorm", 11: "rgba16uint", 13: "rgba16sint", 10: "rgba16float", 54: "r16float", 34: "rg16float", 16: "rg32float", 2: "rgba32float" }, F$1 = { MAGIC_VALUE: 542327876, MAGIC_SIZE: 4, HEADER_SIZE: 124, HEADER_DX10_SIZE: 20, PIXEL_FORMAT_FLAGS: { ALPHAPIXELS: 1, ALPHA: 2, FOURCC: 4, RGB: 64, RGBA: 65, YUV: 512, LUMINANCE: 131072, LUMINANCEA: 131073 }, RESOURCE_MISC_TEXTURECUBE: 4, HEADER_FIELDS: yE, HEADER_DX10_FIELDS: TE, DXGI_FORMAT: Ia, D3D10_RESOURCE_DIMENSION: Ba, D3DFMT: _t }, bg = { "bc1-rgba-unorm": 8, "bc1-rgba-unorm-srgb": 8, "bc2-rgba-unorm": 16, "bc2-rgba-unorm-srgb": 16, "bc3-rgba-unorm": 16, "bc3-rgba-unorm-srgb": 16, "bc4-r-unorm": 8, "bc4-r-snorm": 8, "bc5-rg-unorm": 16, "bc5-rg-snorm": 16, "bc6h-rgb-ufloat": 16, "bc6h-rgb-float": 16, "bc7-rgba-unorm": 16, "bc7-rgba-unorm-srgb": 16 };
function vg(r, t) {
  const { format: e, fourCC: s, width: i, height: n, dataOffset: o, mipmapCount: a } = EE(r);
  if (!t.includes(e)) throw new Error(`Unsupported texture format: ${s} ${e}, supported: ${t}`);
  if (a <= 1) return { format: e, width: i, height: n, resource: [new Uint8Array(r, o)], alphaMode: "no-premultiply-alpha" };
  const l3 = SE(e, i, n, o, a, r);
  return { format: e, width: i, height: n, resource: l3, alphaMode: "no-premultiply-alpha" };
}
function SE(r, t, e, s, i, n) {
  const o = [], a = bg[r];
  let l3 = t, u3 = e, c = s;
  for (let h = 0; h < i; ++h) {
    const d = Math.ceil(Math.max(4, l3) / 4) * 4, p = Math.ceil(Math.max(4, u3) / 4) * 4, f2 = a ? d / 4 * p / 4 * a : l3 * u3 * 4, g = new Uint8Array(n, c, f2);
    o.push(g), c += f2, l3 = Math.max(l3 >> 1, 1), u3 = Math.max(u3 >> 1, 1);
  }
  return o;
}
function EE(r) {
  const t = new Uint32Array(r, 0, F$1.HEADER_SIZE / Uint32Array.BYTES_PER_ELEMENT);
  if (t[F$1.HEADER_FIELDS.MAGIC] !== F$1.MAGIC_VALUE) throw new Error("Invalid magic number in DDS header");
  const e = t[F$1.HEADER_FIELDS.HEIGHT], s = t[F$1.HEADER_FIELDS.WIDTH], i = Math.max(1, t[F$1.HEADER_FIELDS.MIPMAP_COUNT]), n = t[F$1.HEADER_FIELDS.PF_FLAGS], o = t[F$1.HEADER_FIELDS.FOURCC], a = AE(t, n, o, r), l3 = F$1.MAGIC_SIZE + F$1.HEADER_SIZE + (o === F$1.D3DFMT.DX10 ? F$1.HEADER_DX10_SIZE : 0);
  return { format: a, fourCC: o, width: s, height: e, dataOffset: l3, mipmapCount: i };
}
function AE(r, t, e, s) {
  if (t & F$1.PIXEL_FORMAT_FLAGS.FOURCC) {
    if (e === F$1.D3DFMT.DX10) {
      const i = new Uint32Array(s, F$1.MAGIC_SIZE + F$1.HEADER_SIZE, F$1.HEADER_DX10_SIZE / Uint32Array.BYTES_PER_ELEMENT);
      if (i[F$1.HEADER_DX10_FIELDS.MISC_FLAG] === F$1.RESOURCE_MISC_TEXTURECUBE) throw new Error("DDSParser does not support cubemap textures");
      if (i[F$1.HEADER_DX10_FIELDS.RESOURCE_DIMENSION] === F$1.D3D10_RESOURCE_DIMENSION.DDS_DIMENSION_TEXTURE3D) throw new Error("DDSParser does not supported 3D texture data");
      const n = i[F$1.HEADER_DX10_FIELDS.DXGI_FORMAT];
      if (n in xt$1) return xt$1[n];
      throw new Error(`DDSParser cannot parse texture data with DXGI format ${n}`);
    }
    if (e in Fa) return Fa[e];
    throw new Error(`DDSParser cannot parse texture data with fourCC format ${e}`);
  }
  if (t & F$1.PIXEL_FORMAT_FLAGS.RGB || t & F$1.PIXEL_FORMAT_FLAGS.RGBA) return wE(r);
  throw t & F$1.PIXEL_FORMAT_FLAGS.YUV ? new Error("DDSParser does not supported YUV uncompressed texture data.") : t & F$1.PIXEL_FORMAT_FLAGS.LUMINANCE || t & F$1.PIXEL_FORMAT_FLAGS.LUMINANCEA ? new Error("DDSParser does not support single-channel (lumninance) texture data!") : t & F$1.PIXEL_FORMAT_FLAGS.ALPHA || t & F$1.PIXEL_FORMAT_FLAGS.ALPHAPIXELS ? new Error("DDSParser does not support single-channel (alpha) texture data!") : new Error("DDSParser failed to load a texture file due to an unknown reason!");
}
function wE(r) {
  const t = r[F$1.HEADER_FIELDS.RGB_BITCOUNT], e = r[F$1.HEADER_FIELDS.R_BIT_MASK], s = r[F$1.HEADER_FIELDS.G_BIT_MASK], i = r[F$1.HEADER_FIELDS.B_BIT_MASK], n = r[F$1.HEADER_FIELDS.A_BIT_MASK];
  switch (t) {
    case 32:
      if (e === 255 && s === 65280 && i === 16711680 && n === 4278190080) return xt$1[F$1.DXGI_FORMAT.DXGI_FORMAT_R8G8B8A8_UNORM];
      if (e === 16711680 && s === 65280 && i === 255 && n === 4278190080) return xt$1[F$1.DXGI_FORMAT.DXGI_FORMAT_B8G8R8A8_UNORM];
      if (e === 1072693248 && s === 1047552 && i === 1023 && n === 3221225472) return xt$1[F$1.DXGI_FORMAT.DXGI_FORMAT_R10G10B10A2_UNORM];
      if (e === 65535 && s === 4294901760 && i === 0 && n === 0) return xt$1[F$1.DXGI_FORMAT.DXGI_FORMAT_R16G16_UNORM];
      if (e === 4294967295 && s === 0 && i === 0 && n === 0) return xt$1[F$1.DXGI_FORMAT.DXGI_FORMAT_R32_FLOAT];
      break;
    case 24:
      break;
    case 16:
      if (e === 31744 && s === 992 && i === 31 && n === 32768) return xt$1[F$1.DXGI_FORMAT.DXGI_FORMAT_B5G5R5A1_UNORM];
      if (e === 63488 && s === 2016 && i === 31 && n === 0) return xt$1[F$1.DXGI_FORMAT.DXGI_FORMAT_B5G6R5_UNORM];
      if (e === 3840 && s === 240 && i === 15 && n === 61440) return xt$1[F$1.DXGI_FORMAT.DXGI_FORMAT_B4G4R4A4_UNORM];
      if (e === 255 && s === 0 && i === 0 && n === 65280) return xt$1[F$1.DXGI_FORMAT.DXGI_FORMAT_R8G8_UNORM];
      if (e === 65535 && s === 0 && i === 0 && n === 0) return xt$1[F$1.DXGI_FORMAT.DXGI_FORMAT_R16_UNORM];
      break;
    case 8:
      if (e === 255 && s === 0 && i === 0 && n === 0) return xt$1[F$1.DXGI_FORMAT.DXGI_FORMAT_R8_UNORM];
      break;
  }
  throw new Error(`DDSParser does not support uncompressed texture with configuration:
bitCount = ${t}, rBitMask = ${e}, gBitMask = ${s}, aBitMask = ${n}`);
}
({ extension: { type: x$1.LoadParser, priority: vt$1.High, name: "loadDDS" }, name: "loadDDS", test(r) {
  return Gt$1(r, [".dds"]);
}, async load(r, t, e) {
  const s = await qr(), i = await (await fetch(r)).arrayBuffer(), n = vg(i, s), o = new Kr(n);
  return ae(o, e, r);
}, unload(r) {
  Array.isArray(r) ? r.forEach((t) => t.destroy(true)) : r.destroy(true);
} });
var yg = ((r) => (r[r.RGBA8_SNORM = 36759] = "RGBA8_SNORM", r[r.RGBA = 6408] = "RGBA", r[r.RGBA8UI = 36220] = "RGBA8UI", r[r.SRGB8_ALPHA8 = 35907] = "SRGB8_ALPHA8", r[r.RGBA8I = 36238] = "RGBA8I", r[r.RGBA8 = 32856] = "RGBA8", r[r.COMPRESSED_RGB_S3TC_DXT1_EXT = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT", r[r.COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT", r[r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT", r[r.COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT", r[r.COMPRESSED_RED_RGTC1_EXT = 36283] = "COMPRESSED_RED_RGTC1_EXT", r[r.COMPRESSED_SIGNED_RED_RGTC1_EXT = 36284] = "COMPRESSED_SIGNED_RED_RGTC1_EXT", r[r.COMPRESSED_RED_GREEN_RGTC2_EXT = 36285] = "COMPRESSED_RED_GREEN_RGTC2_EXT", r[r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT = 36286] = "COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT", r[r.COMPRESSED_R11_EAC = 37488] = "COMPRESSED_R11_EAC", r[r.COMPRESSED_SIGNED_R11_EAC = 37489] = "COMPRESSED_SIGNED_R11_EAC", r[r.COMPRESSED_RG11_EAC = 37490] = "COMPRESSED_RG11_EAC", r[r.COMPRESSED_SIGNED_RG11_EAC = 37491] = "COMPRESSED_SIGNED_RG11_EAC", r[r.COMPRESSED_RGB8_ETC2 = 37492] = "COMPRESSED_RGB8_ETC2", r[r.COMPRESSED_RGBA8_ETC2_EAC = 37496] = "COMPRESSED_RGBA8_ETC2_EAC", r[r.COMPRESSED_SRGB8_ETC2 = 37493] = "COMPRESSED_SRGB8_ETC2", r[r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497] = "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC", r[r.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494] = "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2", r[r.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495] = "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2", r[r.COMPRESSED_RGBA_ASTC_4x4_KHR = 37808] = "COMPRESSED_RGBA_ASTC_4x4_KHR", r[r.COMPRESSED_RGBA_ASTC_5x4_KHR = 37809] = "COMPRESSED_RGBA_ASTC_5x4_KHR", r[r.COMPRESSED_RGBA_ASTC_5x5_KHR = 37810] = "COMPRESSED_RGBA_ASTC_5x5_KHR", r[r.COMPRESSED_RGBA_ASTC_6x5_KHR = 37811] = "COMPRESSED_RGBA_ASTC_6x5_KHR", r[r.COMPRESSED_RGBA_ASTC_6x6_KHR = 37812] = "COMPRESSED_RGBA_ASTC_6x6_KHR", r[r.COMPRESSED_RGBA_ASTC_8x5_KHR = 37813] = "COMPRESSED_RGBA_ASTC_8x5_KHR", r[r.COMPRESSED_RGBA_ASTC_8x6_KHR = 37814] = "COMPRESSED_RGBA_ASTC_8x6_KHR", r[r.COMPRESSED_RGBA_ASTC_8x8_KHR = 37815] = "COMPRESSED_RGBA_ASTC_8x8_KHR", r[r.COMPRESSED_RGBA_ASTC_10x5_KHR = 37816] = "COMPRESSED_RGBA_ASTC_10x5_KHR", r[r.COMPRESSED_RGBA_ASTC_10x6_KHR = 37817] = "COMPRESSED_RGBA_ASTC_10x6_KHR", r[r.COMPRESSED_RGBA_ASTC_10x8_KHR = 37818] = "COMPRESSED_RGBA_ASTC_10x8_KHR", r[r.COMPRESSED_RGBA_ASTC_10x10_KHR = 37819] = "COMPRESSED_RGBA_ASTC_10x10_KHR", r[r.COMPRESSED_RGBA_ASTC_12x10_KHR = 37820] = "COMPRESSED_RGBA_ASTC_12x10_KHR", r[r.COMPRESSED_RGBA_ASTC_12x12_KHR = 37821] = "COMPRESSED_RGBA_ASTC_12x12_KHR", r[r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR = 37840] = "COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR", r[r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR = 37841] = "COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR", r[r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR = 37842] = "COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR", r[r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR = 37843] = "COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR", r[r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR = 37844] = "COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR", r[r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR = 37845] = "COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR", r[r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR = 37846] = "COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR", r[r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR = 37847] = "COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR", r[r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR = 37848] = "COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR", r[r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR = 37849] = "COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR", r[r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR = 37850] = "COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR", r[r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR = 37851] = "COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR", r[r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR = 37852] = "COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR", r[r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR = 37853] = "COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR", r[r.COMPRESSED_RGBA_BPTC_UNORM_EXT = 36492] = "COMPRESSED_RGBA_BPTC_UNORM_EXT", r[r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT = 36493] = "COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT", r[r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT = 36494] = "COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT", r[r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT = 36495] = "COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT", r))(yg || {}), RE = ((r) => (r[r.RGBA = 6408] = "RGBA", r[r.RGB = 6407] = "RGB", r[r.RG = 33319] = "RG", r[r.RED = 6403] = "RED", r[r.RGBA_INTEGER = 36249] = "RGBA_INTEGER", r[r.RGB_INTEGER = 36248] = "RGB_INTEGER", r[r.RG_INTEGER = 33320] = "RG_INTEGER", r[r.RED_INTEGER = 36244] = "RED_INTEGER", r[r.ALPHA = 6406] = "ALPHA", r[r.LUMINANCE = 6409] = "LUMINANCE", r[r.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", r[r.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", r[r.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL", r))(RE || {}), ME = ((r) => (r[r.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", r[r.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", r[r.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", r[r.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", r[r.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", r[r.UNSIGNED_INT = 5125] = "UNSIGNED_INT", r[r.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", r[r.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", r[r.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", r[r.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", r[r.BYTE = 5120] = "BYTE", r[r.SHORT = 5122] = "SHORT", r[r.INT = 5124] = "INT", r[r.FLOAT = 5126] = "FLOAT", r[r.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", r[r.HALF_FLOAT = 36193] = "HALF_FLOAT", r))(ME || {});
const CE = { 33776: "bc1-rgba-unorm", 33777: "bc1-rgba-unorm", 33778: "bc2-rgba-unorm", 33779: "bc3-rgba-unorm", 35916: "bc1-rgba-unorm-srgb", 35917: "bc1-rgba-unorm-srgb", 35918: "bc2-rgba-unorm-srgb", 35919: "bc3-rgba-unorm-srgb", 36283: "bc4-r-unorm", 36284: "bc4-r-snorm", 36285: "bc5-rg-unorm", 36286: "bc5-rg-snorm", 37488: "eac-r11unorm", 37490: "eac-rg11snorm", 37492: "etc2-rgb8unorm", 37496: "etc2-rgba8unorm", 37493: "etc2-rgb8unorm-srgb", 37497: "etc2-rgba8unorm-srgb", 37494: "etc2-rgb8a1unorm", 37495: "etc2-rgb8a1unorm-srgb", 37808: "astc-4x4-unorm", 37840: "astc-4x4-unorm-srgb", 37809: "astc-5x4-unorm", 37841: "astc-5x4-unorm-srgb", 37810: "astc-5x5-unorm", 37842: "astc-5x5-unorm-srgb", 37811: "astc-6x5-unorm", 37843: "astc-6x5-unorm-srgb", 37812: "astc-6x6-unorm", 37844: "astc-6x6-unorm-srgb", 37813: "astc-8x5-unorm", 37845: "astc-8x5-unorm-srgb", 37814: "astc-8x6-unorm", 37846: "astc-8x6-unorm-srgb", 37815: "astc-8x8-unorm", 37847: "astc-8x8-unorm-srgb", 37816: "astc-10x5-unorm", 37848: "astc-10x5-unorm-srgb", 37817: "astc-10x6-unorm", 37849: "astc-10x6-unorm-srgb", 37818: "astc-10x8-unorm", 37850: "astc-10x8-unorm-srgb", 37819: "astc-10x10-unorm", 37851: "astc-10x10-unorm-srgb", 37820: "astc-12x10-unorm", 37852: "astc-12x10-unorm-srgb", 37821: "astc-12x12-unorm", 37853: "astc-12x12-unorm-srgb", 36492: "bc7-rgba-unorm", 36493: "bc7-rgba-unorm-srgb", 36494: "bc6h-rgb-float", 36495: "bc6h-rgb-ufloat", 35907: "rgba8unorm-srgb", 36759: "rgba8snorm", 36220: "rgba8uint", 36238: "rgba8sint", 6408: "rgba8unorm" }, OE = [171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10], GE = { FILE_IDENTIFIER: 0, ENDIANNESS: 12, GL_TYPE: 16, GL_TYPE_SIZE: 20, GL_FORMAT: 24, GL_INTERNAL_FORMAT: 28, GL_BASE_INTERNAL_FORMAT: 32, PIXEL_WIDTH: 36, PIXEL_HEIGHT: 40, PIXEL_DEPTH: 44, NUMBER_OF_ARRAY_ELEMENTS: 48, NUMBER_OF_FACES: 52, NUMBER_OF_MIPMAP_LEVELS: 56, BYTES_OF_KEY_VALUE_DATA: 60 }, IE = 64, BE = 67305985, FE = { 5121: 1, 5123: 2, 5124: 4, 5125: 4, 5126: 4, 36193: 8 }, DE = { 6408: 4, 6407: 3, 33319: 2, 6403: 1, 6409: 1, 6410: 2, 6406: 1 }, UE = { 32819: 2, 32820: 2, 33635: 2 }, kE = { 33776: 0.5, 33777: 0.5, 33778: 1, 33779: 1, 35916: 0.5, 35917: 0.5, 35918: 1, 35919: 1, 36283: 0.5, 36284: 0.5, 36285: 1, 36286: 1, 37488: 0.5, 37489: 0.5, 37490: 1, 37491: 1, 37492: 0.5, 37496: 1, 37493: 0.5, 37497: 1, 37494: 0.5, 37495: 0.5, 37808: 1, 37840: 1, 37809: 0.8, 37841: 0.8, 37810: 0.64, 37842: 0.64, 37811: 0.53375, 37843: 0.53375, 37812: 0.445, 37844: 0.445, 37813: 0.4, 37845: 0.4, 37814: 0.33375, 37846: 0.33375, 37815: 0.25, 37847: 0.25, 37816: 0.32, 37848: 0.32, 37817: 0.26625, 37849: 0.26625, 37818: 0.2, 37850: 0.2, 37819: 0.16, 37851: 0.16, 37820: 0.13375, 37852: 0.13375, 37821: 0.11125, 37853: 0.11125, 36492: 1, 36493: 1, 36494: 1, 36495: 1 }, J = { FILE_HEADER_SIZE: IE, FILE_IDENTIFIER: OE, FORMATS_TO_COMPONENTS: DE, INTERNAL_FORMAT_TO_BYTES_PER_PIXEL: kE, INTERNAL_FORMAT_TO_TEXTURE_FORMATS: CE, FIELDS: GE, TYPES_TO_BYTES_PER_COMPONENT: FE, TYPES_TO_BYTES_PER_PIXEL: UE, ENDIANNESS: BE };
function Tg(r, t) {
  const e = new DataView(r);
  if (!XE(e)) throw new Error("Invalid KTX identifier in header");
  const { littleEndian: s, glType: i, glFormat: n, glInternalFormat: o, pixelWidth: a, pixelHeight: l3, numberOfMipmapLevels: u3, offset: c } = NE(e), h = J.INTERNAL_FORMAT_TO_TEXTURE_FORMATS[o];
  if (!h) throw new Error(`Unknown texture format ${o}`);
  if (!t.includes(h)) throw new Error(`Unsupported texture format: ${h}, supportedFormats: ${t}`);
  const d = LE(i, n, o), p = $E(e, i, d, a, l3, c, u3, s);
  return { format: h, width: a, height: l3, resource: p, alphaMode: "no-premultiply-alpha" };
}
function $E(r, t, e, s, i, n, o, a) {
  const l3 = s + 3 & -4, u3 = i + 3 & -4;
  let c = s * i;
  t === 0 && (c = l3 * u3);
  let h = c * e, d = s, p = i, f2 = l3, g = u3, m3 = n;
  const _ = new Array(o);
  for (let b = 0; b < o; b++) {
    const v4 = r.getUint32(m3, a);
    let y4 = m3 + 4;
    _[b] = new Uint8Array(r.buffer, y4, h), y4 += h, m3 += v4 + 4, m3 = m3 % 4 !== 0 ? m3 + 4 - m3 % 4 : m3, d = d >> 1 || 1, p = p >> 1 || 1, f2 = d + 4 - 1 & -4, g = p + 4 - 1 & -4, h = f2 * g * e;
  }
  return _;
}
function LE(r, t, e) {
  let s = J.INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[e];
  if (r !== 0 && (J.TYPES_TO_BYTES_PER_COMPONENT[r] ? s = J.TYPES_TO_BYTES_PER_COMPONENT[r] * J.FORMATS_TO_COMPONENTS[t] : s = J.TYPES_TO_BYTES_PER_PIXEL[r]), s === void 0) throw new Error("Unable to resolve the pixel format stored in the *.ktx file!");
  return s;
}
function NE(r) {
  const t = r.getUint32(J.FIELDS.ENDIANNESS, true) === J.ENDIANNESS, e = r.getUint32(J.FIELDS.GL_TYPE, t), s = r.getUint32(J.FIELDS.GL_FORMAT, t), i = r.getUint32(J.FIELDS.GL_INTERNAL_FORMAT, t), n = r.getUint32(J.FIELDS.PIXEL_WIDTH, t), o = r.getUint32(J.FIELDS.PIXEL_HEIGHT, t) || 1, a = r.getUint32(J.FIELDS.PIXEL_DEPTH, t) || 1, l3 = r.getUint32(J.FIELDS.NUMBER_OF_ARRAY_ELEMENTS, t) || 1, u3 = r.getUint32(J.FIELDS.NUMBER_OF_FACES, t), c = r.getUint32(J.FIELDS.NUMBER_OF_MIPMAP_LEVELS, t), h = r.getUint32(J.FIELDS.BYTES_OF_KEY_VALUE_DATA, t);
  if (o === 0 || a !== 1) throw new Error("Only 2D textures are supported");
  if (u3 !== 1) throw new Error("CubeTextures are not supported by KTXLoader yet!");
  if (l3 !== 1) throw new Error("WebGL does not support array textures");
  return { littleEndian: t, glType: e, glFormat: s, glInternalFormat: i, pixelWidth: n, pixelHeight: o, numberOfMipmapLevels: c, offset: J.FILE_HEADER_SIZE + h };
}
function XE(r) {
  for (let t = 0; t < J.FILE_IDENTIFIER.length; t++) if (r.getUint8(t) !== J.FILE_IDENTIFIER[t]) return false;
  return true;
}
({ extension: { type: x$1.LoadParser, priority: vt$1.High, name: "loadKTX" }, name: "loadKTX", test(r) {
  return Gt$1(r, ".ktx");
}, async load(r, t, e) {
  const s = await qr(), i = await (await fetch(r)).arrayBuffer(), n = Tg(i, s), o = new Kr(n);
  return ae(o, e, r);
}, unload(r) {
  Array.isArray(r) ? r.forEach((t) => t.destroy(true)) : r.destroy(true);
} });
const jE = '(function(){"use strict";const s={rgb8unorm:{convertedFormat:"rgba8unorm",convertFunction:i},"rgb8unorm-srgb":{convertedFormat:"rgba8unorm-srgb",convertFunction:i}};function f(r){const t=r.format;if(s[t]){const n=s[t].convertFunction,o=r.resource;for(let e=0;e<o.length;e++)o[e]=n(o[e]);r.format=s[t].convertedFormat}}function i(r){const t=r.byteLength/3,n=new Uint32Array(t);for(let o=0;o<t;++o)n[o]=r[o*3]+(r[o*3+1]<<8)+(r[o*3+2]<<16)+4278190080;return new Uint8Array(n.buffer)}function d(r){const t=[];for(let n=0;n<r.numLevels;n++){const o=r.getImageData(n,0,0),e=new Uint8Array(o.byteLength);e.set(o),t.push(e)}return t}const w={6408:"rgba8unorm",32856:"bgra8unorm",32857:"rgb10a2unorm",33189:"depth16unorm",33190:"depth24plus",33321:"r8unorm",33323:"rg8unorm",33325:"r16float",33326:"r32float",33327:"rg16float",33328:"rg32float",33329:"r8sint",33330:"r8uint",33331:"r16sint",33332:"r16uint",33333:"r32sint",33334:"r32uint",33335:"rg8sint",33336:"rg8uint",33337:"rg16sint",33338:"rg16uint",33339:"rg32sint",33340:"rg32uint",33778:"bc2-rgba-unorm",33779:"bc3-rgba-unorm",34836:"rgba32float",34842:"rgba16float",35056:"depth24plus-stencil8",35898:"rg11b10ufloat",35901:"rgb9e5ufloat",35907:"rgba8unorm-srgb",36012:"depth32float",36013:"depth32float-stencil8",36168:"stencil8",36208:"rgba32uint",36214:"rgba16uint",36220:"rgba8uint",36226:"rgba32sint",36232:"rgba16sint",36238:"rgba8sint",36492:"bc7-rgba-unorm",36756:"r8snorm",36757:"rg8snorm",36759:"rgba8snorm",37496:"etc2-rgba8unorm",37808:"astc-4x4-unorm"};function p(r){const t=w[r];if(t)return t;throw new Error(`Unsupported glInternalFormat: ${r}`)}const h={23:"rgb8unorm",37:"rgba8unorm",43:"rgba8unorm-srgb"};function F(r){const t=h[r];if(t)return t;throw new Error(`Unsupported VkFormat: ${r}`)}function U(r){return r.classId===2?F(r.vkFormat):p(r.glInternalformat)}const T={"bc3-rgba-unorm":"BC3_RGBA","bc7-rgba-unorm":"BC7_M5_RGBA","etc2-rgba8unorm":"ETC2_RGBA","astc-4x4-unorm":"ASTC_4x4_RGBA",rgba8unorm:"RGBA32",rg11b10ufloat:"R11F_G11F_B10F"};function y(r){const t=T[r];if(t)return t;throw new Error(`Unsupported transcoderFormat: ${r}`)}const a={jsUrl:"",wasmUrl:""};let l,u,c;async function g(){if(!c){const r=new URL(a.jsUrl,location.origin).href,t=new URL(a.wasmUrl,location.origin).href;importScripts(r),c=new Promise(n=>{LIBKTX({locateFile:o=>t}).then(o=>{n(o)})})}return c}async function v(r,t){const n=await fetch(r);if(n.ok){const o=await n.arrayBuffer();return new t.ktxTexture(new Uint8Array(o))}throw new Error(`Failed to load KTX(2) texture: ${r}`)}const x=["bc7-rgba-unorm","astc-4x4-unorm","etc2-rgba8unorm","bc3-rgba-unorm","rgba8unorm"];async function B(r){const t=await g(),n=await v(r,t);let o;if(n.needsTranscoding){o=u;const R=t.TranscodeTarget[l];if(n.transcodeBasis(R,0)!==t.ErrorCode.SUCCESS)throw new Error("Unable to transcode basis texture.")}else o=U(n);const e=d(n),b={width:n.baseWidth,height:n.baseHeight,format:o,mipLevelCount:n.numLevels,resource:e,alphaMode:"no-premultiply-alpha"};return f(b),b}async function A(r,t,n){r&&(a.jsUrl=r),t&&(a.wasmUrl=t),u=x.filter(o=>n.includes(o))[0],l=y(u),await g()}const m={init:async r=>{const{jsUrl:t,wasmUrl:n,supportedTextures:o}=r;await A(t,n,o)},load:async r=>{var t;try{const n=await B(r.url);return{type:"load",url:r.url,success:!0,textureOptions:n,transferables:(t=n.resource)==null?void 0:t.map(o=>o.buffer)}}catch(n){throw n}}};self.onmessage=async r=>{var t;const n=r.data,o=await((t=m[n.type])==null?void 0:t.call(m,n));o&&self.postMessage(o,o.transferables)}})();\n';
let tr = null;
class Sg {
  constructor() {
    tr || (tr = URL.createObjectURL(new Blob([jE], { type: "application/javascript" }))), this.worker = new Worker(tr);
  }
}
Sg.revokeObjectURL = function() {
  tr && (URL.revokeObjectURL(tr), tr = null);
};
const mi = { jsUrl: "https://files.pixijs.download/transcoders/ktx/libktx.js", wasmUrl: "https://files.pixijs.download/transcoders/ktx/libktx.wasm" };
let Qr;
const Eg = {};
function VE(r) {
  return Qr || (Qr = new Sg().worker, Qr.onmessage = (t) => {
    const { success: e, url: s, textureOptions: i } = t.data;
    e || console.warn("Failed to load KTX texture", s), Eg[s](i);
  }, Qr.postMessage({ type: "init", jsUrl: mi.jsUrl, wasmUrl: mi.wasmUrl, supportedTextures: r })), Qr;
}
function Ag(r, t) {
  const e = VE(t);
  return new Promise((s) => {
    Eg[r] = s, e.postMessage({ type: "load", url: r });
  });
}
({ extension: { type: x$1.LoadParser, priority: vt$1.High, name: "loadKTX2" }, name: "loadKTX2", test(r) {
  return Gt$1(r, ".ktx2");
}, async load(r, t, e) {
  const s = await qr(), i = await Ag(r, s), n = new Kr(i);
  return ae(n, e, r);
}, async unload(r) {
  Array.isArray(r) ? r.forEach((t) => t.destroy(true)) : r.destroy(true);
} });
const gi = ["basis", "bc7", "bc6h", "astc", "etc2", "bc5", "bc4", "bc3", "bc2", "bc1", "eac"];
({ extension: x$1.ResolveParser, test: (r) => Gt$1(r, [".ktx", ".ktx2", ".dds"]), parse: (r) => {
  var t, e;
  let s;
  const i = r.split(".");
  if (i.length > 2) {
    const n = i[i.length - 2];
    gi.includes(n) && (s = n);
  } else s = i[i.length - 1];
  return { resolution: parseFloat((e = (t = se.RETINA_PREFIX.exec(r)) == null ? void 0 : t[1]) != null ? e : "1"), format: s, src: r };
} });
let _i;
({ extension: { type: x$1.DetectionParser, priority: 2 }, test: async () => !!(await zr() || jr()), add: async (r) => {
  const t = await Ga();
  return _i = sA(t), [..._i, ...r];
}, remove: async (r) => _i ? r.filter((t) => !(t in _i)) : r });
function sA(r) {
  const t = ["basis"], e = {};
  return r.forEach((s) => {
    const i = s.split("-")[0];
    i && !e[i] && (e[i] = true, t.push(i));
  }), t.sort((s, i) => {
    const n = gi.indexOf(s), o = gi.indexOf(i);
    return n === -1 ? 1 : o === -1 ? -1 : n - o;
  }), t;
}
({ priority: 10, type: x$1.Application, name: "culler" });
({ extension: { type: x$1.Environment, name: "browser", priority: -1 }, test: () => true, load: async () => {
  await Promise.resolve().then(function() {
    return n2;
  });
} });
var oA = Object.defineProperty, xi = Object.getOwnPropertySymbols, Og = Object.prototype.hasOwnProperty, Gg = Object.prototype.propertyIsEnumerable, Ig = (r, t, e) => t in r ? oA(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, ka = (r, t) => {
  for (var e in t || (t = {})) Og.call(t, e) && Ig(r, e, t[e]);
  if (xi) for (var e of xi(t)) Gg.call(t, e) && Ig(r, e, t[e]);
  return r;
}, aA = (r, t) => {
  var e = {};
  for (var s in r) Og.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && xi) for (var s of xi(r)) t.indexOf(s) < 0 && Gg.call(r, s) && (e[s] = r[s]);
  return e;
};
const Bg = class Au extends At$1 {
  constructor(t) {
    t = ka(ka({}, Au.defaultOptions), t), super(t), this.enabled = true, this._state = Tt.for2d(), this.blendMode = t.blendMode, this.padding = t.padding, typeof t.antialias == "boolean" ? this.antialias = t.antialias ? "on" : "off" : this.antialias = t.antialias, this.resolution = t.resolution, this.blendRequired = t.blendRequired, this.clipToViewport = t.clipToViewport, this.addResource("uTexture", 0, 1);
  }
  apply(t, e, s, i) {
    t.applyFilter(this, e, s, i);
  }
  get blendMode() {
    return this._state.blendMode;
  }
  set blendMode(t) {
    this._state.blendMode = t;
  }
  static from(t) {
    const e = t, { gpu: s, gl: i } = e, n = aA(e, ["gpu", "gl"]);
    let o, a;
    return s && (o = bt$1.from(s)), i && (a = yt$1.from(i)), new Au(ka({ gpuProgram: o, glProgram: a }, n));
  }
};
Bg.defaultOptions = { blendMode: "normal", resolution: 1, padding: 0, antialias: "off", blendRequired: false, clipToViewport: true };
let te = Bg;
var bi = `in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition( void )
{
vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;

position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void)
{
gl_Position = filterVertexPosition();
vTextureCoord = filterTextureCoord();
}
`, Xg = `
in vec2 vTextureCoord;

out vec4 finalColor;

uniform float uAlpha;
uniform sampler2D uTexture;

void main()
{
finalColor =  texture(uTexture, vTextureCoord) * uAlpha;
}
`, $a = `struct GlobalFilterUniforms {
uInputSize:vec4<f32>,
uInputPixel:vec4<f32>,
uInputClamp:vec4<f32>,
uOutputFrame:vec4<f32>,
uGlobalFrame:vec4<f32>,
uOutputTexture:vec4<f32>,
};

struct AlphaUniforms {
uAlpha:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> alphaUniforms : AlphaUniforms;

struct VSOutput {
@builtin(position) position: vec4<f32>,
@location(0) uv : vec2<f32>
};

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);  
}

fn getSize() -> vec2<f32>
{
return gfu.uGlobalFrame.zw;
}

@vertex
fn mainVertex(
@location(0) aPosition : vec2<f32>, 
) -> VSOutput {
return VSOutput(
filterVertexPosition(aPosition),
filterTextureCoord(aPosition)
);
}

@fragment
fn mainFragment(
@location(0) uv: vec2<f32>,
@builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

var sample = textureSample(uTexture, uSampler, uv);

return sample * alphaUniforms.uAlpha;
}`, fA = Object.defineProperty, mA = Object.defineProperties, gA = Object.getOwnPropertyDescriptors, vi = Object.getOwnPropertySymbols, Hg = Object.prototype.hasOwnProperty, jg = Object.prototype.propertyIsEnumerable, zg = (r, t, e) => t in r ? fA(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, La = (r, t) => {
  for (var e in t || (t = {})) Hg.call(t, e) && zg(r, e, t[e]);
  if (vi) for (var e of vi(t)) jg.call(t, e) && zg(r, e, t[e]);
  return r;
}, _A = (r, t) => mA(r, gA(t)), xA = (r, t) => {
  var e = {};
  for (var s in r) Hg.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && vi) for (var s of vi(r)) t.indexOf(s) < 0 && jg.call(r, s) && (e[s] = r[s]);
  return e;
};
const Vg = class sy extends te {
  constructor(t) {
    t = La(La({}, sy.defaultOptions), t);
    const e = bt$1.from({ vertex: { source: $a, entryPoint: "mainVertex" }, fragment: { source: $a, entryPoint: "mainFragment" } }), s = yt$1.from({ vertex: bi, fragment: Xg, name: "alpha-filter" }), i = t, { alpha: n } = i, o = xA(i, ["alpha"]), a = new et$1({ uAlpha: { value: n, type: "f32" } });
    super(_A(La({}, o), { gpuProgram: e, glProgram: s, resources: { alphaUniforms: a } }));
  }
  get alpha() {
    return this.resources.alphaUniforms.uniforms.uAlpha;
  }
  set alpha(t) {
    this.resources.alphaUniforms.uniforms.uAlpha = t;
  }
};
Vg.defaultOptions = { alpha: 1 };
const Na = { 5: [0.153388, 0.221461, 0.250301], 7: [0.071303, 0.131514, 0.189879, 0.214607], 9: [0.028532, 0.067234, 0.124009, 0.179044, 0.20236], 11: [93e-4, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596], 13: [2406e-6, 9255e-6, 0.027867, 0.065666, 0.121117, 0.174868, 0.197641], 15: [489e-6, 2403e-6, 9246e-6, 0.02784, 0.065602, 0.120999, 0.174697, 0.197448] }, vA = ["in vec2 vBlurTexCoords[%size%];", "uniform sampler2D uTexture;", "out vec4 finalColor;", "void main(void)", "{", "    finalColor = vec4(0.0);", "    %blur%", "}"].join(`
`);
function Wg(r) {
  const t = Na[r], e = t.length;
  let s = vA, i = "";
  const n = "finalColor += texture(uTexture, vBlurTexCoords[%index%]) * %value%;";
  let o;
  for (let a = 0; a < r; a++) {
    let l3 = n.replace("%index%", a.toString());
    o = a, a >= e && (o = r - a - 1), l3 = l3.replace("%value%", t[o].toString()), i += l3, i += `
`;
  }
  return s = s.replace("%blur%", i), s = s.replace("%size%", r.toString()), s;
}
const yA = `
in vec2 aPosition;

uniform float uStrength;

out vec2 vBlurTexCoords[%size%];

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition( void )
{
vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;

position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void)
{
gl_Position = filterVertexPosition();

float pixelStrength = uInputSize.%dimension% * uStrength;

vec2 textureCoord = filterTextureCoord();
%blur%
}`;
function Yg(r, t) {
  const e = Math.ceil(r / 2);
  let s = yA, i = "", n;
  t ? n = "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * pixelStrength, 0.0);" : n = "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * pixelStrength);";
  for (let o = 0; o < r; o++) {
    let a = n.replace("%index%", o.toString());
    a = a.replace("%sampleIndex%", `${o - (e - 1)}.0`), i += a, i += `
`;
  }
  return s = s.replace("%blur%", i), s = s.replace("%size%", r.toString()), s = s.replace("%dimension%", t ? "z" : "w"), s;
}
function Kg(r, t) {
  const e = Yg(t, r), s = Wg(t);
  return yt$1.from({ vertex: e, fragment: s, name: `blur-${r ? "horizontal" : "vertical"}-pass-filter` });
}
var qg = `

struct GlobalFilterUniforms {
uInputSize:vec4<f32>,
uInputPixel:vec4<f32>,
uInputClamp:vec4<f32>,
uOutputFrame:vec4<f32>,
uGlobalFrame:vec4<f32>,
uOutputTexture:vec4<f32>,
};

struct BlurUniforms {
uStrength:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> blurUniforms : BlurUniforms;


struct VSOutput {
@builtin(position) position: vec4<f32>,
%blur-struct%
};

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);  
}

fn getSize() -> vec2<f32>
{
return gfu.uGlobalFrame.zw;
}


@vertex
fn mainVertex(
@location(0) aPosition : vec2<f32>, 
) -> VSOutput {

let filteredCord = filterTextureCoord(aPosition);

let pixelStrength = gfu.uInputSize.%dimension% * blurUniforms.uStrength;

return VSOutput(
filterVertexPosition(aPosition),
%blur-vertex-out%
);
}

@fragment
fn mainFragment(
@builtin(position) position: vec4<f32>,
%blur-fragment-in%
) -> @location(0) vec4<f32> {

var   finalColor = vec4(0.0);

%blur-sampling%

return finalColor;
}`;
function Zg(r, t) {
  const e = Na[t], s = e.length, i = [], n = [], o = [];
  for (let h = 0; h < t; h++) {
    i[h] = `@location(${h}) offset${h}: vec2<f32>,`, r ? n[h] = `filteredCord + vec2(${h - s + 1} * pixelStrength, 0.0),` : n[h] = `filteredCord + vec2(0.0, ${h - s + 1} * pixelStrength),`;
    const d = h < s ? h : t - h - 1, p = e[d].toString();
    o[h] = `finalColor += textureSample(uTexture, uSampler, offset${h}) * ${p};`;
  }
  const a = i.join(`
`), l3 = n.join(`
`), u3 = o.join(`
`), c = qg.replace("%blur-struct%", a).replace("%blur-vertex-out%", l3).replace("%blur-fragment-in%", a).replace("%blur-sampling%", u3).replace("%dimension%", r ? "z" : "w");
  return bt$1.from({ vertex: { source: c, entryPoint: "mainVertex" }, fragment: { source: c, entryPoint: "mainFragment" } });
}
var TA = Object.defineProperty, Qg = Object.getOwnPropertySymbols, SA = Object.prototype.hasOwnProperty, EA = Object.prototype.propertyIsEnumerable, Jg = (r, t, e) => t in r ? TA(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Xa = (r, t) => {
  for (var e in t || (t = {})) SA.call(t, e) && Jg(r, e, t[e]);
  if (Qg) for (var e of Qg(t)) EA.call(t, e) && Jg(r, e, t[e]);
  return r;
};
const t_ = class iy extends te {
  constructor(t) {
    t = Xa(Xa({}, iy.defaultOptions), t);
    const e = Kg(t.horizontal, t.kernelSize), s = Zg(t.horizontal, t.kernelSize);
    super(Xa({ glProgram: e, gpuProgram: s, resources: { blurUniforms: { uStrength: { value: 0, type: "f32" } } } }, t)), this.horizontal = t.horizontal, this._quality = 0, this.quality = t.quality, this.blur = t.strength, this._uniforms = this.resources.blurUniforms.uniforms;
  }
  apply(t, e, s, i) {
    if (this._uniforms.uStrength = this.strength / this.passes, this.passes === 1) t.applyFilter(this, e, s, i);
    else {
      const n = tt$1.getSameSizeTexture(e);
      let o = e, a = n;
      this._state.blend = false;
      const l3 = t.renderer.type === mt$1.WEBGPU;
      for (let u3 = 0; u3 < this.passes - 1; u3++) {
        t.applyFilter(this, o, a, u3 === 0 ? true : l3);
        const c = a;
        a = o, o = c;
      }
      this._state.blend = true, t.applyFilter(this, o, s, i), tt$1.returnTexture(n);
    }
  }
  get blur() {
    return this.strength;
  }
  set blur(t) {
    this.padding = 1 + Math.abs(t) * 2, this.strength = t;
  }
  get quality() {
    return this._quality;
  }
  set quality(t) {
    this._quality = t, this.passes = t;
  }
};
t_.defaultOptions = { strength: 8, quality: 4, kernelSize: 5 };
let yi = t_;
var AA = Object.defineProperty, wA = Object.defineProperties, PA = Object.getOwnPropertyDescriptors, Ti = Object.getOwnPropertySymbols, e_ = Object.prototype.hasOwnProperty, r_ = Object.prototype.propertyIsEnumerable, s_ = (r, t, e) => t in r ? AA(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Jr = (r, t) => {
  for (var e in t || (t = {})) e_.call(t, e) && s_(r, e, t[e]);
  if (Ti) for (var e of Ti(t)) r_.call(t, e) && s_(r, e, t[e]);
  return r;
}, RA = (r, t) => wA(r, PA(t)), MA = (r, t) => {
  var e = {};
  for (var s in r) e_.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && Ti) for (var s of Ti(r)) t.indexOf(s) < 0 && r_.call(r, s) && (e[s] = r[s]);
  return e;
};
class i_ extends te {
  constructor(...t) {
    var e;
    let s = (e = t[0]) != null ? e : {};
    typeof s == "number" && (s = { strength: s }, t[1] !== void 0 && (s.quality = t[1]), t[2] !== void 0 && (s.resolution = t[2] || "inherit"), t[3] !== void 0 && (s.kernelSize = t[3])), s = Jr(Jr({}, yi.defaultOptions), s);
    const i = s, { strength: n, strengthX: o, strengthY: a, quality: l3 } = i, u3 = MA(i, ["strength", "strengthX", "strengthY", "quality"]);
    super(RA(Jr({}, u3), { compatibleRenderers: mt$1.BOTH, resources: {} })), this._repeatEdgePixels = false, this.blurXFilter = new yi(Jr({ horizontal: true }, s)), this.blurYFilter = new yi(Jr({ horizontal: false }, s)), this.quality = l3, this.strengthX = o != null ? o : n, this.strengthY = a != null ? a : n, this.repeatEdgePixels = false;
  }
  apply(t, e, s, i) {
    const n = Math.abs(this.blurXFilter.strength), o = Math.abs(this.blurYFilter.strength);
    if (n && o) {
      const a = tt$1.getSameSizeTexture(e);
      this.blurXFilter.blendMode = "normal", this.blurXFilter.apply(t, e, a, true), this.blurYFilter.blendMode = this.blendMode, this.blurYFilter.apply(t, a, s, i), tt$1.returnTexture(a);
    } else o ? (this.blurYFilter.blendMode = this.blendMode, this.blurYFilter.apply(t, e, s, i)) : (this.blurXFilter.blendMode = this.blendMode, this.blurXFilter.apply(t, e, s, i));
  }
  updatePadding() {
    this._repeatEdgePixels ? this.padding = 0 : this.padding = Math.max(Math.abs(this.blurXFilter.blur), Math.abs(this.blurYFilter.blur)) * 2;
  }
  get strength() {
    if (this.strengthX !== this.strengthY) throw new Error("BlurFilter's strengthX and strengthY are different");
    return this.strengthX;
  }
  set strength(t) {
    this.blurXFilter.blur = this.blurYFilter.blur = t, this.updatePadding();
  }
  get quality() {
    return this.blurXFilter.quality;
  }
  set quality(t) {
    this.blurXFilter.quality = this.blurYFilter.quality = t;
  }
  get strengthX() {
    return this.blurXFilter.blur;
  }
  set strengthX(t) {
    this.blurXFilter.blur = t, this.updatePadding();
  }
  get strengthY() {
    return this.blurYFilter.blur;
  }
  set strengthY(t) {
    this.blurYFilter.blur = t, this.updatePadding();
  }
  get blur() {
    return this.strength;
  }
  set blur(t) {
    this.strength = t;
  }
  get blurX() {
    return this.strengthX;
  }
  set blurX(t) {
    this.strengthX = t;
  }
  get blurY() {
    return this.strengthY;
  }
  set blurY(t) {
    this.strengthY = t;
  }
  get repeatEdgePixels() {
    return this._repeatEdgePixels;
  }
  set repeatEdgePixels(t) {
    this._repeatEdgePixels = t, this.updatePadding();
  }
}
i_.defaultOptions = { strength: 8, quality: 4, kernelSize: 5 };
var p_ = `
in vec2 vTextureCoord;
in vec4 vColor;

out vec4 finalColor;

uniform float uNoise;
uniform float uSeed;
uniform sampler2D uTexture;

float rand(vec2 co)
{
return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
vec4 color = texture(uTexture, vTextureCoord);
float randomValue = rand(gl_FragCoord.xy * uSeed);
float diff = (randomValue - 0.5) *  uNoise;

// Un-premultiply alpha before applying the color matrix. See issue #3539.
if (color.a > 0.0) {
color.rgb /= color.a;
}

color.r += diff;
color.g += diff;
color.b += diff;

// Premultiply alpha again.
color.rgb *= color.a;

finalColor = color;
}
`, za = `

struct GlobalFilterUniforms {
uInputSize:vec4<f32>,
uInputPixel:vec4<f32>,
uInputClamp:vec4<f32>,
uOutputFrame:vec4<f32>,
uGlobalFrame:vec4<f32>,
uOutputTexture:vec4<f32>,
};

struct NoiseUniforms {
uNoise:f32,
uSeed:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> noiseUniforms : NoiseUniforms;

struct VSOutput {
@builtin(position) position: vec4<f32>,
@location(0) uv : vec2<f32>
};

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);  
}

fn getSize() -> vec2<f32>
{
return gfu.uGlobalFrame.zw;
}

@vertex
fn mainVertex(
@location(0) aPosition : vec2<f32>, 
) -> VSOutput {
return VSOutput(
filterVertexPosition(aPosition),
filterTextureCoord(aPosition)
);
}

fn rand(co:vec2<f32>) -> f32
{
return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}



@fragment
fn mainFragment(
@location(0) uv: vec2<f32>,
@builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

var pixelPosition =  globalTextureCoord(position.xy);// / (getSize());//-  gfu.uOutputFrame.xy);


var sample = textureSample(uTexture, uSampler, uv);
var randomValue =  rand(pixelPosition.xy * noiseUniforms.uSeed);
var diff = (randomValue - 0.5) * noiseUniforms.uNoise;

// Un-premultiply alpha before applying the color matrix. See issue #3539.
if (sample.a > 0.0) {
sample.r /= sample.a;
sample.g /= sample.a;
sample.b /= sample.a;
}

sample.r += diff;
sample.g += diff;
sample.b += diff;

// Premultiply alpha again.
sample.r *= sample.a;
sample.g *= sample.a;
sample.b *= sample.a;

return sample;
}`, zA = Object.defineProperty, VA = Object.defineProperties, WA = Object.getOwnPropertyDescriptors, Ei = Object.getOwnPropertySymbols, f_ = Object.prototype.hasOwnProperty, m_ = Object.prototype.propertyIsEnumerable, g_ = (r, t, e) => t in r ? zA(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Va = (r, t) => {
  for (var e in t || (t = {})) f_.call(t, e) && g_(r, e, t[e]);
  if (Ei) for (var e of Ei(t)) m_.call(t, e) && g_(r, e, t[e]);
  return r;
}, YA = (r, t) => VA(r, WA(t)), KA = (r, t) => {
  var e = {};
  for (var s in r) f_.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && Ei) for (var s of Ei(r)) t.indexOf(s) < 0 && m_.call(r, s) && (e[s] = r[s]);
  return e;
};
const __ = class ny extends te {
  constructor(t = {}) {
    t = Va(Va({}, ny.defaultOptions), t);
    const e = bt$1.from({ vertex: { source: za, entryPoint: "mainVertex" }, fragment: { source: za, entryPoint: "mainFragment" } }), s = yt$1.from({ vertex: bi, fragment: p_, name: "noise-filter" }), i = t, { noise: n, seed: o } = i, a = KA(i, ["noise", "seed"]);
    super(YA(Va({}, a), { gpuProgram: e, glProgram: s, resources: { noiseUniforms: new et$1({ uNoise: { value: 1, type: "f32" }, uSeed: { value: 1, type: "f32" } }) } })), this.noise = n, this.seed = o != null ? o : Math.random();
  }
  get noise() {
    return this.resources.noiseUniforms.uniforms.uNoise;
  }
  set noise(t) {
    this.resources.noiseUniforms.uniforms.uNoise = t;
  }
  get seed() {
    return this.resources.noiseUniforms.uniforms.uSeed;
  }
  set seed(t) {
    this.resources.noiseUniforms.uniforms.uSeed = t;
  }
};
__.defaultOptions = { noise: 0.5 };
var x_ = `in vec2 vMaskCoord;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uMaskTexture;

uniform float uAlpha;
uniform vec4 uMaskClamp;
uniform float uInverse;

out vec4 finalColor;

void main(void)
{
float clip = step(3.5,
step(uMaskClamp.x, vMaskCoord.x) +
step(uMaskClamp.y, vMaskCoord.y) +
step(vMaskCoord.x, uMaskClamp.z) +
step(vMaskCoord.y, uMaskClamp.w));

// TODO look into why this is needed
float npmAlpha = uAlpha;
vec4 original = texture(uTexture, vTextureCoord);
vec4 masky = texture(uMaskTexture, vMaskCoord);
float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);

float a = alphaMul * masky.r * npmAlpha * clip;

if (uInverse == 1.0) {
a = 1.0 - a;
}

finalColor = original * a;
}
`, b_ = `in vec2 aPosition;

out vec2 vTextureCoord;
out vec2 vMaskCoord;


uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;
uniform mat3 uFilterMatrix;

vec4 filterVertexPosition(  vec2 aPosition )
{
vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;

position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord(  vec2 aPosition )
{
return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

vec2 getFilterCoord( vec2 aPosition )
{
return  ( uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}   

void main(void)
{
gl_Position = filterVertexPosition(aPosition);
vTextureCoord = filterTextureCoord(aPosition);
vMaskCoord = getFilterCoord(aPosition);
}
`, Wa = `struct GlobalFilterUniforms {
uInputSize:vec4<f32>,
uInputPixel:vec4<f32>,
uInputClamp:vec4<f32>,
uOutputFrame:vec4<f32>,
uGlobalFrame:vec4<f32>,
uOutputTexture:vec4<f32>,
};

struct MaskUniforms {
uFilterMatrix:mat3x3<f32>,
uMaskClamp:vec4<f32>,
uAlpha:f32,
uInverse:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> filterUniforms : MaskUniforms;
@group(1) @binding(1) var uMaskTexture: texture_2d<f32>;

struct VSOutput {
@builtin(position) position: vec4<f32>,
@location(0) uv : vec2<f32>,
@location(1) filterUv : vec2<f32>,
};

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);
}

fn getFilterCoord(aPosition:vec2<f32> ) -> vec2<f32>
{
return ( filterUniforms.uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}

fn getSize() -> vec2<f32>
{
return gfu.uGlobalFrame.zw;
}

@vertex
fn mainVertex(
@location(0) aPosition : vec2<f32>,
) -> VSOutput {
return VSOutput(
filterVertexPosition(aPosition),
filterTextureCoord(aPosition),
getFilterCoord(aPosition)
);
}

@fragment
fn mainFragment(
@location(0) uv: vec2<f32>,
@location(1) filterUv: vec2<f32>,
@builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

var maskClamp = filterUniforms.uMaskClamp;
var uAlpha = filterUniforms.uAlpha;

var clip = step(3.5,
step(maskClamp.x, filterUv.x) +
step(maskClamp.y, filterUv.y) +
step(filterUv.x, maskClamp.z) +
step(filterUv.y, maskClamp.w));

var mask = textureSample(uMaskTexture, uSampler, filterUv);
var source = textureSample(uTexture, uSampler, uv);
var alphaMul = 1.0 - uAlpha * (1.0 - mask.a);

var a: f32 = alphaMul * mask.r * uAlpha * clip;

if (filterUniforms.uInverse == 1.0) {
a = 1.0 - a;
}

return source * a;
}
`, ZA = Object.defineProperty, QA = Object.defineProperties, JA = Object.getOwnPropertyDescriptors, Ai = Object.getOwnPropertySymbols, v_ = Object.prototype.hasOwnProperty, y_ = Object.prototype.propertyIsEnumerable, T_ = (r, t, e) => t in r ? ZA(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, tw = (r, t) => {
  for (var e in t || (t = {})) v_.call(t, e) && T_(r, e, t[e]);
  if (Ai) for (var e of Ai(t)) y_.call(t, e) && T_(r, e, t[e]);
  return r;
}, ew = (r, t) => QA(r, JA(t)), rw = (r, t) => {
  var e = {};
  for (var s in r) v_.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && Ai) for (var s of Ai(r)) t.indexOf(s) < 0 && y_.call(r, s) && (e[s] = r[s]);
  return e;
};
class S_ extends te {
  constructor(t) {
    const e = t, { sprite: s } = e, i = rw(e, ["sprite"]), n = new bn(s.texture), o = new et$1({ uFilterMatrix: { value: new R$1(), type: "mat3x3<f32>" }, uMaskClamp: { value: n.uClampFrame, type: "vec4<f32>" }, uAlpha: { value: 1, type: "f32" }, uInverse: { value: t.inverse ? 1 : 0, type: "f32" } }), a = bt$1.from({ vertex: { source: Wa, entryPoint: "mainVertex" }, fragment: { source: Wa, entryPoint: "mainFragment" } }), l3 = yt$1.from({ vertex: b_, fragment: x_, name: "mask-filter" });
    super(ew(tw({}, i), { gpuProgram: a, glProgram: l3, resources: { filterUniforms: o, uMaskTexture: s.texture.source } })), this.sprite = s, this._textureMatrix = n;
  }
  set inverse(t) {
    this.resources.filterUniforms.uniforms.uInverse = t ? 1 : 0;
  }
  get inverse() {
    return this.resources.filterUniforms.uniforms.uInverse === 1;
  }
  apply(t, e, s, i) {
    this._textureMatrix.texture = this.sprite.texture, t.calculateSpriteMatrix(this.resources.filterUniforms.uniforms.uFilterMatrix, this.sprite).prepend(this._textureMatrix.mapCoord), this.resources.uMaskTexture = this.sprite.texture.source, t.applyFilter(this, e, s, i);
  }
}
function Ya(r, t, e, s, i, n, o, a) {
  const l3 = o - e, u3 = a - s, c = i - e, h = n - s, d = r - e, p = t - s, f2 = l3 * l3 + u3 * u3, g = l3 * c + u3 * h, m3 = l3 * d + u3 * p, _ = c * c + h * h, b = c * d + h * p, v4 = 1 / (f2 * _ - g * g), y4 = (_ * m3 - g * b) * v4, S3 = (f2 * b - g * m3) * v4;
  return y4 >= 0 && S3 >= 0 && y4 + S3 < 1;
}
var iw = Object.defineProperty, wi = Object.getOwnPropertySymbols, w_ = Object.prototype.hasOwnProperty, P_ = Object.prototype.propertyIsEnumerable, R_ = (r, t, e) => t in r ? iw(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, nw = (r, t) => {
  for (var e in t || (t = {})) w_.call(t, e) && R_(r, e, t[e]);
  if (wi) for (var e of wi(t)) P_.call(t, e) && R_(r, e, t[e]);
  return r;
}, ow = (r, t) => {
  var e = {};
  for (var s in r) w_.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && wi) for (var s of wi(r)) t.indexOf(s) < 0 && P_.call(r, s) && (e[s] = r[s]);
  return e;
};
class er extends Lt$1 {
  constructor(...t) {
    var e;
    let s = t[0];
    s instanceof ye && (s = { geometry: s, shader: t[1] }, t[3] && (s.geometry.topology = t[3]));
    const i = s, { geometry: n, shader: o, texture: a, roundPixels: l3, state: u3 } = i, c = ow(i, ["geometry", "shader", "texture", "roundPixels", "state"]);
    super(nw({ label: "Mesh" }, c)), this.renderPipeId = "mesh", this._shader = null, this.allowChildren = false, this.shader = o != null ? o : null, this.texture = (e = a != null ? a : o == null ? void 0 : o.texture) != null ? e : A$1.WHITE, this.state = u3 != null ? u3 : Tt.for2d(), this._geometry = n, this._geometry.on("update", this.onViewUpdate, this), this.roundPixels = l3 != null ? l3 : false;
  }
  get material() {
    return this._shader;
  }
  set shader(t) {
    this._shader !== t && (this._shader = t, this.onViewUpdate());
  }
  get shader() {
    return this._shader;
  }
  set geometry(t) {
    var e;
    this._geometry !== t && ((e = this._geometry) == null || e.off("update", this.onViewUpdate, this), t.on("update", this.onViewUpdate, this), this._geometry = t, this.onViewUpdate());
  }
  get geometry() {
    return this._geometry;
  }
  set texture(t) {
    t || (t = A$1.EMPTY);
    const e = this._texture;
    e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this.shader && (this.shader.texture = t), this._texture = t, this.onViewUpdate());
  }
  get texture() {
    return this._texture;
  }
  get batched() {
    return this._shader || this.state.data & 12 ? false : this._geometry instanceof Pe ? this._geometry.batchMode === "auto" ? this._geometry.positions.length / 2 <= 100 : this._geometry.batchMode === "batch" : false;
  }
  get bounds() {
    return this._geometry.bounds;
  }
  updateBounds() {
    this._bounds = this._geometry.bounds;
  }
  containsPoint(t) {
    const { x: e, y: s } = t;
    if (!this.bounds.containsPoint(e, s)) return false;
    const i = this.geometry.getBuffer("aPosition").data, n = this.geometry.topology === "triangle-strip" ? 3 : 1;
    if (this.geometry.getIndex()) {
      const o = this.geometry.getIndex().data, a = o.length;
      for (let l3 = 0; l3 + 2 < a; l3 += n) {
        const u3 = o[l3] * 2, c = o[l3 + 1] * 2, h = o[l3 + 2] * 2;
        if (Ya(e, s, i[u3], i[u3 + 1], i[c], i[c + 1], i[h], i[h + 1])) return true;
      }
    } else {
      const o = i.length / 2;
      for (let a = 0; a + 2 < o; a += n) {
        const l3 = a * 2, u3 = (a + 1) * 2, c = (a + 2) * 2;
        if (Ya(e, s, i[l3], i[l3 + 1], i[u3], i[u3 + 1], i[c], i[c + 1])) return true;
      }
    }
    return false;
  }
  destroy(t) {
    var e;
    if (super.destroy(t), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const s = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._texture.destroy(s);
    }
    (e = this._geometry) == null || e.off("update", this.onViewUpdate, this), this._texture = null, this._geometry = null, this._shader = null, this._gpuData = null;
  }
}
class G_ {
  constructor({ matrix: t, observer: e } = {}) {
    this.dirty = true, this._matrix = t != null ? t : new R$1(), this.observer = e, this.position = new rt(this, 0, 0), this.scale = new rt(this, 1, 1), this.pivot = new rt(this, 0, 0), this.skew = new rt(this, 0, 0), this._rotation = 0, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1;
  }
  get matrix() {
    const t = this._matrix;
    return this.dirty && (t.a = this._cx * this.scale.x, t.b = this._sx * this.scale.x, t.c = this._cy * this.scale.y, t.d = this._sy * this.scale.y, t.tx = this.position.x - (this.pivot.x * t.a + this.pivot.y * t.c), t.ty = this.position.y - (this.pivot.x * t.b + this.pivot.y * t.d), this.dirty = false), t;
  }
  _onUpdate(t) {
    var e;
    this.dirty = true, t === this.skew && this.updateSkew(), (e = this.observer) == null || e._onUpdate(this);
  }
  updateSkew() {
    this._cx = Math.cos(this._rotation + this.skew.y), this._sx = Math.sin(this._rotation + this.skew.y), this._cy = -Math.sin(this._rotation - this.skew.x), this._sy = Math.cos(this._rotation - this.skew.x), this.dirty = true;
  }
  setFromMatrix(t) {
    t.decompose(this), this.dirty = true;
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(t) {
    this._rotation !== t && (this._rotation = t, this._onUpdate(this.skew));
  }
}
var pw = Object.defineProperty, Ri = Object.getOwnPropertySymbols, I_ = Object.prototype.hasOwnProperty, B_ = Object.prototype.propertyIsEnumerable, F_ = (r, t, e) => t in r ? pw(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, ts = (r, t) => {
  for (var e in t || (t = {})) I_.call(t, e) && F_(r, e, t[e]);
  if (Ri) for (var e of Ri(t)) B_.call(t, e) && F_(r, e, t[e]);
  return r;
}, fw = (r, t) => {
  var e = {};
  for (var s in r) I_.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && Ri) for (var s of Ri(r)) t.indexOf(s) < 0 && B_.call(r, s) && (e[s] = r[s]);
  return e;
};
const D_ = class Qi extends Lt$1 {
  constructor(...t) {
    let e = t[0] || {};
    e instanceof A$1 && (e = { texture: e }), t.length > 1 && (e.width = t[1], e.height = t[2]), e = ts(ts({}, Qi.defaultOptions), e);
    const s = e != null ? e : {}, { texture: i, anchor: n, tilePosition: o, tileScale: a, tileRotation: l3, width: u3, height: c, applyAnchorToTexture: h, roundPixels: d } = s, p = fw(s, ["texture", "anchor", "tilePosition", "tileScale", "tileRotation", "width", "height", "applyAnchorToTexture", "roundPixels"]);
    super(ts({ label: "TilingSprite" }, p)), this.renderPipeId = "tilingSprite", this.batched = true, this.allowChildren = false, this._anchor = new rt({ _onUpdate: () => {
      this.onViewUpdate();
    } }), this.applyAnchorToTexture = h, this.texture = i, this._width = u3 != null ? u3 : i.width, this._height = c != null ? c : i.height, this._tileTransform = new G_({ observer: { _onUpdate: () => this.onViewUpdate() } }), n && (this.anchor = n), this.tilePosition = o, this.tileScale = a, this.tileRotation = l3, this.roundPixels = d != null ? d : false;
  }
  static from(t, e = {}) {
    return typeof t == "string" ? new Qi(ts({ texture: V$1.get(t) }, e)) : new Qi(ts({ texture: t }, e));
  }
  get uvRespectAnchor() {
    return Ct$1("uvRespectAnchor is deprecated, please use applyAnchorToTexture instead"), this.applyAnchorToTexture;
  }
  set uvRespectAnchor(t) {
    Ct$1("uvRespectAnchor is deprecated, please use applyAnchorToTexture instead"), this.applyAnchorToTexture = t;
  }
  get clampMargin() {
    return this._texture.textureMatrix.clampMargin;
  }
  set clampMargin(t) {
    this._texture.textureMatrix.clampMargin = t;
  }
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  get tilePosition() {
    return this._tileTransform.position;
  }
  set tilePosition(t) {
    this._tileTransform.position.copyFrom(t);
  }
  get tileScale() {
    return this._tileTransform.scale;
  }
  set tileScale(t) {
    typeof t == "number" ? this._tileTransform.scale.set(t) : this._tileTransform.scale.copyFrom(t);
  }
  set tileRotation(t) {
    this._tileTransform.rotation = t;
  }
  get tileRotation() {
    return this._tileTransform.rotation;
  }
  get tileTransform() {
    return this._tileTransform;
  }
  set texture(t) {
    t || (t = A$1.EMPTY);
    const e = this._texture;
    e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this._texture = t, this.onViewUpdate());
  }
  get texture() {
    return this._texture;
  }
  set width(t) {
    this._width = t, this.onViewUpdate();
  }
  get width() {
    return this._width;
  }
  set height(t) {
    this._height = t, this.onViewUpdate();
  }
  get height() {
    return this._height;
  }
  setSize(t, e) {
    var s;
    typeof t == "object" && (e = (s = t.height) != null ? s : t.width, t = t.width), this._width = t, this._height = e != null ? e : t, this.onViewUpdate();
  }
  getSize(t) {
    return t || (t = {}), t.width = this._width, t.height = this._height, t;
  }
  updateBounds() {
    const t = this._bounds, e = this._anchor, s = this._width, i = this._height;
    t.minX = -e._x * s, t.maxX = t.minX + s, t.minY = -e._y * i, t.maxY = t.minY + i;
  }
  containsPoint(t) {
    const e = this._width, s = this._height, i = -e * this._anchor._x;
    let n = 0;
    return t.x >= i && t.x <= i + e && (n = -s * this._anchor._y, t.y >= n && t.y <= n + s);
  }
  destroy(t = false) {
    if (super.destroy(t), this._anchor = null, this._tileTransform = null, this._bounds = null, typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const e = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._texture.destroy(e);
    }
    this._texture = null;
  }
};
D_.defaultOptions = { texture: A$1.EMPTY, anchor: { x: 0, y: 0 }, tilePosition: { x: 0, y: 0 }, tileScale: { x: 1, y: 1 }, tileRotation: 0, applyAnchorToTexture: false };
var mw = Object.defineProperty, Mi = Object.getOwnPropertySymbols, k_ = Object.prototype.hasOwnProperty, $_ = Object.prototype.propertyIsEnumerable, L_ = (r, t, e) => t in r ? mw(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, gw = (r, t) => {
  for (var e in t || (t = {})) k_.call(t, e) && L_(r, e, t[e]);
  if (Mi) for (var e of Mi(t)) $_.call(t, e) && L_(r, e, t[e]);
  return r;
}, _w = (r, t) => {
  var e = {};
  for (var s in r) k_.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && Mi) for (var s of Mi(r)) t.indexOf(s) < 0 && $_.call(r, s) && (e[s] = r[s]);
  return e;
};
class Ci extends Lt$1 {
  constructor(t, e) {
    const s = t, { text: i, resolution: n, style: o, anchor: a, width: l3, height: u3, roundPixels: c } = s, h = _w(s, ["text", "resolution", "style", "anchor", "width", "height", "roundPixels"]);
    super(gw({}, h)), this.batched = true, this._resolution = null, this._autoResolution = true, this._didTextUpdate = true, this._styleClass = e, this.text = i != null ? i : "", this.style = o, this.resolution = n != null ? n : null, this.allowChildren = false, this._anchor = new rt({ _onUpdate: () => {
      this.onViewUpdate();
    } }), a && (this.anchor = a), this.roundPixels = c != null ? c : false, l3 !== void 0 && (this.width = l3), u3 !== void 0 && (this.height = u3);
  }
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  set text(t) {
    t = t.toString(), this._text !== t && (this._text = t, this.onViewUpdate());
  }
  get text() {
    return this._text;
  }
  set resolution(t) {
    this._autoResolution = t === null, this._resolution = t, this.onViewUpdate();
  }
  get resolution() {
    return this._resolution;
  }
  get style() {
    return this._style;
  }
  set style(t) {
    var e;
    t || (t = {}), (e = this._style) == null || e.off("update", this.onViewUpdate, this), t instanceof this._styleClass ? this._style = t : this._style = new this._styleClass(t), this._style.on("update", this.onViewUpdate, this), this.onViewUpdate();
  }
  get width() {
    return Math.abs(this.scale.x) * this.bounds.width;
  }
  set width(t) {
    this._setWidth(t, this.bounds.width);
  }
  get height() {
    return Math.abs(this.scale.y) * this.bounds.height;
  }
  set height(t) {
    this._setHeight(t, this.bounds.height);
  }
  getSize(t) {
    return t || (t = {}), t.width = Math.abs(this.scale.x) * this.bounds.width, t.height = Math.abs(this.scale.y) * this.bounds.height, t;
  }
  setSize(t, e) {
    var s;
    typeof t == "object" ? (e = (s = t.height) != null ? s : t.width, t = t.width) : e != null || (e = t), t !== void 0 && this._setWidth(t, this.bounds.width), e !== void 0 && this._setHeight(e, this.bounds.height);
  }
  containsPoint(t) {
    const e = this.bounds.width, s = this.bounds.height, i = -e * this.anchor.x;
    let n = 0;
    return t.x >= i && t.x <= i + e && (n = -s * this.anchor.y, t.y >= n && t.y <= n + s);
  }
  onViewUpdate() {
    this.didViewUpdate || (this._didTextUpdate = true), super.onViewUpdate();
  }
  destroy(t = false) {
    super.destroy(t), this.owner = null, this._bounds = null, this._anchor = null, (typeof t == "boolean" ? t : t != null && t.style) && this._style.destroy(t), this._style = null, this._text = null;
  }
}
function Oi(r, t) {
  var e;
  let s = (e = r[0]) != null ? e : {};
  return (typeof s == "string" || r[1]) && (s = { text: s, style: r[1] }), s;
}
class Ka extends Ci {
  constructor(...t) {
    const e = Oi(t);
    super(e, Dt$1), this.renderPipeId = "text", e.textureStyle && (this.textureStyle = e.textureStyle instanceof Pt$1 ? e.textureStyle : new Pt$1(e.textureStyle));
  }
  updateBounds() {
    const t = this._bounds, e = this._anchor;
    let s = 0, i = 0;
    if (this._style.trim) {
      const { frame: n, canvasAndContext: o } = Ke.getCanvasAndContext({ text: this.text, style: this._style, resolution: 1 });
      Ke.returnCanvasAndContext(o), s = n.width, i = n.height;
    } else {
      const n = Ot.measureText(this._text, this._style);
      s = n.width, i = n.height;
    }
    t.minX = -e._x * s, t.maxX = t.minX + s, t.minY = -e._y * i, t.maxY = t.minY + i;
  }
}
({ type: [x$1.WebGLSystem, x$1.WebGPUSystem], name: "prepare" });
class qa {
  constructor() {
    this._tempState = Tt.for2d(), this._didUploadHash = {};
  }
  init(t) {
    t.renderer.runners.contextChange.add(this);
  }
  contextChange() {
    this._didUploadHash = {};
  }
  start(t, e, s) {
    const i = t.renderer, n = this._didUploadHash[s.uid];
    i.shader.bind(s, n), n || (this._didUploadHash[s.uid] = true), i.shader.updateUniformGroup(i.globalUniforms.uniformGroup), i.geometry.bind(e, s.glProgram);
  }
  execute(t, e) {
    const s = t.renderer;
    this._tempState.blendMode = e.blendMode, s.state.set(this._tempState);
    const i = e.textures.textures;
    for (let n = 0; n < e.textures.count; n++) s.texture.bind(i[n], n);
    s.geometry.draw(e.topology, e.size, e.start);
  }
}
qa.extension = { type: [x$1.WebGLPipesAdaptor], name: "batch" };
const Gi = Tt.for2d();
class Za {
  start(t, e, s) {
    const i = t.renderer, n = i.encoder, o = s.gpuProgram;
    this._shader = s, this._geometry = e, n.setGeometry(e, o), Gi.blendMode = "normal", i.pipeline.getPipeline(e, o, Gi);
    const a = i.globalUniforms.bindGroup;
    n.resetBindGroup(1), n.setBindGroup(0, a, o);
  }
  execute(t, e) {
    const s = this._shader.gpuProgram, i = t.renderer, n = i.encoder;
    if (!e.bindGroup) {
      const l3 = e.textures;
      e.bindGroup = Gs(l3.textures, l3.count, i.limits.maxBatchableTextures);
    }
    Gi.blendMode = e.blendMode;
    const o = i.bindGroup.getBindGroup(e.bindGroup, s, 1), a = i.pipeline.getPipeline(this._geometry, s, Gi, e.topology);
    e.bindGroup._touch(i.textureGC.count), n.setPipeline(a), n.renderPassEncoder.setBindGroup(1, o), n.renderPassEncoder.drawIndexed(e.size, 1, e.start);
  }
}
Za.extension = { type: [x$1.WebGPUPipesAdaptor], name: "batch" };
const Qa = class ay {
  constructor(t, e) {
    this.state = Tt.for2d(), this._batchersByInstructionSet = /* @__PURE__ */ Object.create(null), this._activeBatches = /* @__PURE__ */ Object.create(null);
    var s, i;
    this.renderer = t, this._adaptor = e, (i = (s = this._adaptor).init) == null || i.call(s, this);
  }
  static getBatcher(t) {
    return new this._availableBatchers[t]();
  }
  buildStart(t) {
    let e = this._batchersByInstructionSet[t.uid];
    e || (e = this._batchersByInstructionSet[t.uid] = /* @__PURE__ */ Object.create(null), e.default || (e.default = new Xs({ maxTextures: this.renderer.limits.maxBatchableTextures }))), this._activeBatches = e, this._activeBatch = this._activeBatches.default;
    for (const s in this._activeBatches) this._activeBatches[s].begin();
  }
  addToBatch(t, e) {
    if (this._activeBatch.name !== t.batcherName) {
      this._activeBatch.break(e);
      let s = this._activeBatches[t.batcherName];
      s || (s = this._activeBatches[t.batcherName] = ay.getBatcher(t.batcherName), s.begin()), this._activeBatch = s;
    }
    this._activeBatch.add(t);
  }
  break(t) {
    this._activeBatch.break(t);
  }
  buildEnd(t) {
    this._activeBatch.break(t);
    const e = this._activeBatches;
    for (const s in e) {
      const i = e[s], n = i.geometry;
      n.indexBuffer.setDataWithSize(i.indexBuffer, i.indexSize, true), n.buffers[0].setDataWithSize(i.attributeBuffer.float32View, i.attributeSize, false);
    }
  }
  upload(t) {
    const e = this._batchersByInstructionSet[t.uid];
    for (const s in e) {
      const i = e[s], n = i.geometry;
      i.dirty && (i.dirty = false, n.buffers[0].update(i.attributeSize * 4));
    }
  }
  execute(t) {
    if (t.action === "startBatch") {
      const e = t.batcher, s = e.geometry, i = e.shader;
      this._adaptor.start(this, s, i);
    }
    this._adaptor.execute(this, t);
  }
  destroy() {
    this.state = null, this.renderer = null, this._adaptor = null;
    for (const t in this._activeBatches) this._activeBatches[t].destroy();
    this._activeBatches = null;
  }
};
Qa.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "batch" }, Qa._availableBatchers = /* @__PURE__ */ Object.create(null);
let Ja = Qa;
G$1.handleByMap(x$1.Batcher, Ja._availableBatchers), G$1.add(Xs);
const V_ = { name: "texture-bit", vertex: { header: `

struct TextureUniforms {
uTextureMatrix:mat3x3<f32>,
}

@group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;
`, main: `
uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;
` }, fragment: { header: `
@group(2) @binding(0) var uTexture: texture_2d<f32>;
@group(2) @binding(1) var uSampler: sampler;


`, main: `
outColor = textureSample(uTexture, uSampler, vUV);
` } }, W_ = { name: "texture-bit", vertex: { header: `
uniform mat3 uTextureMatrix;
`, main: `
uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
` }, fragment: { header: `
uniform sampler2D uTexture;


`, main: `
outColor = texture(uTexture, vUV);
` } }, yw = new st$1();
let Tw = class extends gr {
  constructor() {
    super(), this.filters = [new S_({ sprite: new Ut$1(A$1.EMPTY), inverse: false, resolution: "inherit", antialias: "inherit" })];
  }
  get sprite() {
    return this.filters[0].sprite;
  }
  set sprite(t) {
    this.filters[0].sprite = t;
  }
  get inverse() {
    return this.filters[0].inverse;
  }
  set inverse(t) {
    this.filters[0].inverse = t;
  }
};
class tl {
  constructor(t) {
    this._activeMaskStage = [], this._renderer = t;
  }
  push(t, e, s) {
    const i = this._renderer;
    if (i.renderPipes.batch.break(s), s.add({ renderPipeId: "alphaMask", action: "pushMaskBegin", mask: t, inverse: e._maskOptions.inverse, canBundle: false, maskedContainer: e }), t.inverse = e._maskOptions.inverse, t.renderMaskToTexture) {
      const n = t.mask;
      n.includeInBuild = true, n.collectRenderables(s, i, null), n.includeInBuild = false;
    }
    i.renderPipes.batch.break(s), s.add({ renderPipeId: "alphaMask", action: "pushMaskEnd", mask: t, maskedContainer: e, inverse: e._maskOptions.inverse, canBundle: false });
  }
  pop(t, e, s) {
    this._renderer.renderPipes.batch.break(s), s.add({ renderPipeId: "alphaMask", action: "popMaskEnd", mask: t, inverse: e._maskOptions.inverse, canBundle: false });
  }
  execute(t) {
    const e = this._renderer, s = t.mask.renderMaskToTexture;
    if (t.action === "pushMaskBegin") {
      const i = nt.get(Tw);
      if (i.inverse = t.inverse, s) {
        t.mask.mask.measurable = true;
        const n = _r(t.mask.mask, true, yw);
        t.mask.mask.measurable = false, n.ceil();
        const o = e.renderTarget.renderTarget.colorTexture.source, a = tt$1.getOptimalTexture(n.width, n.height, o._resolution, o.antialias);
        e.renderTarget.push(a, true), e.globalUniforms.push({ offset: n, worldColor: 4294967295 });
        const l3 = i.sprite;
        l3.texture = a, l3.worldTransform.tx = n.minX, l3.worldTransform.ty = n.minY, this._activeMaskStage.push({ filterEffect: i, maskedContainer: t.maskedContainer, filterTexture: a });
      } else i.sprite = t.mask.mask, this._activeMaskStage.push({ filterEffect: i, maskedContainer: t.maskedContainer });
    } else if (t.action === "pushMaskEnd") {
      const i = this._activeMaskStage[this._activeMaskStage.length - 1];
      s && (e.type === mt$1.WEBGL && e.renderTarget.finishRenderPass(), e.renderTarget.pop(), e.globalUniforms.pop()), e.filter.push({ renderPipeId: "filter", action: "pushFilter", container: i.maskedContainer, filterEffect: i.filterEffect, canBundle: false });
    } else if (t.action === "popMaskEnd") {
      e.filter.pop();
      const i = this._activeMaskStage.pop();
      s && tt$1.returnTexture(i.filterTexture), nt.return(i.filterEffect);
    }
  }
  destroy() {
    this._renderer = null, this._activeMaskStage = null;
  }
}
tl.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "alphaMask" };
class el {
  constructor(t) {
    this._colorStack = [], this._colorStackIndex = 0, this._currentColor = 0, this._renderer = t;
  }
  buildStart() {
    this._colorStack[0] = 15, this._colorStackIndex = 1, this._currentColor = 15;
  }
  push(t, e, s) {
    this._renderer.renderPipes.batch.break(s);
    const i = this._colorStack;
    i[this._colorStackIndex] = i[this._colorStackIndex - 1] & t.mask;
    const n = this._colorStack[this._colorStackIndex];
    n !== this._currentColor && (this._currentColor = n, s.add({ renderPipeId: "colorMask", colorMask: n, canBundle: false })), this._colorStackIndex++;
  }
  pop(t, e, s) {
    this._renderer.renderPipes.batch.break(s);
    const i = this._colorStack;
    this._colorStackIndex--;
    const n = i[this._colorStackIndex - 1];
    n !== this._currentColor && (this._currentColor = n, s.add({ renderPipeId: "colorMask", colorMask: n, canBundle: false }));
  }
  execute(t) {
    this._renderer.colorMask.setMask(t.colorMask);
  }
  destroy() {
    this._colorStack = null;
  }
}
el.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "colorMask" };
class rl {
  constructor(t) {
    this._maskStackHash = {}, this._maskHash = /* @__PURE__ */ new WeakMap(), this._renderer = t;
  }
  push(t, e, s) {
    var i;
    const o = t, a = this._renderer;
    a.renderPipes.batch.break(s), a.renderPipes.blendMode.setBlendMode(o.mask, "none", s), s.add({ renderPipeId: "stencilMask", action: "pushMaskBegin", mask: t, inverse: e._maskOptions.inverse, canBundle: false });
    const l3 = o.mask;
    l3.includeInBuild = true, this._maskHash.has(o) || this._maskHash.set(o, { instructionsStart: 0, instructionsLength: 0 });
    const u3 = this._maskHash.get(o);
    u3.instructionsStart = s.instructionSize, l3.collectRenderables(s, a, null), l3.includeInBuild = false, a.renderPipes.batch.break(s), s.add({ renderPipeId: "stencilMask", action: "pushMaskEnd", mask: t, inverse: e._maskOptions.inverse, canBundle: false });
    const c = s.instructionSize - u3.instructionsStart - 1;
    u3.instructionsLength = c;
    const h = a.renderTarget.renderTarget.uid;
    (i = this._maskStackHash)[h] != null || (i[h] = 0);
  }
  pop(t, e, s) {
    const i = t, n = this._renderer;
    n.renderPipes.batch.break(s), n.renderPipes.blendMode.setBlendMode(i.mask, "none", s), s.add({ renderPipeId: "stencilMask", action: "popMaskBegin", inverse: e._maskOptions.inverse, canBundle: false });
    const o = this._maskHash.get(t);
    for (let a = 0; a < o.instructionsLength; a++) s.instructions[s.instructionSize++] = s.instructions[o.instructionsStart++];
    s.add({ renderPipeId: "stencilMask", action: "popMaskEnd", canBundle: false });
  }
  execute(t) {
    var e, s;
    const i = this._renderer, n = i.renderTarget.renderTarget.uid;
    let o = (s = (e = this._maskStackHash)[n]) != null ? s : e[n] = 0;
    t.action === "pushMaskBegin" ? (i.renderTarget.ensureDepthStencil(), i.stencil.setStencilMode(Q$1.RENDERING_MASK_ADD, o), o++, i.colorMask.setMask(0)) : t.action === "pushMaskEnd" ? (t.inverse ? i.stencil.setStencilMode(Q$1.INVERSE_MASK_ACTIVE, o) : i.stencil.setStencilMode(Q$1.MASK_ACTIVE, o), i.colorMask.setMask(15)) : t.action === "popMaskBegin" ? (i.colorMask.setMask(0), o !== 0 ? i.stencil.setStencilMode(Q$1.RENDERING_MASK_REMOVE, o) : (i.renderTarget.clear(null, gt.STENCIL), i.stencil.setStencilMode(Q$1.DISABLED, o)), o--) : t.action === "popMaskEnd" && (t.inverse ? i.stencil.setStencilMode(Q$1.INVERSE_MASK_ACTIVE, o) : i.stencil.setStencilMode(Q$1.MASK_ACTIVE, o), i.colorMask.setMask(15)), this._maskStackHash[n] = o;
  }
  destroy() {
    this._renderer = null, this._maskStackHash = null, this._maskHash = null;
  }
}
rl.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "stencilMask" };
var es = ((r) => (r[r.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER", r[r.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", r[r.UNIFORM_BUFFER = 35345] = "UNIFORM_BUFFER", r))(es || {});
class Y_ {
  constructor(t, e) {
    this._lastBindBaseLocation = -1, this._lastBindCallId = -1, this.buffer = t || null, this.updateID = -1, this.byteLength = -1, this.type = e;
  }
}
class sl {
  constructor(t) {
    this._gpuBuffers = /* @__PURE__ */ Object.create(null), this._boundBufferBases = /* @__PURE__ */ Object.create(null), this._minBaseLocation = 0, this._nextBindBaseIndex = this._minBaseLocation, this._bindCallId = 0, this._renderer = t, this._renderer.renderableGC.addManagedHash(this, "_gpuBuffers");
  }
  destroy() {
    this._renderer = null, this._gl = null, this._gpuBuffers = null, this._boundBufferBases = null;
  }
  contextChange() {
    this._gl = this._renderer.gl, this._gpuBuffers = /* @__PURE__ */ Object.create(null), this._maxBindings = this._renderer.limits.maxUniformBindings;
  }
  getGlBuffer(t) {
    return this._gpuBuffers[t.uid] || this.createGLBuffer(t);
  }
  bind(t) {
    const { _gl: e } = this, s = this.getGlBuffer(t);
    e.bindBuffer(s.type, s.buffer);
  }
  bindBufferBase(t, e) {
    const { _gl: s } = this;
    this._boundBufferBases[e] !== t && (this._boundBufferBases[e] = t, t._lastBindBaseLocation = e, s.bindBufferBase(s.UNIFORM_BUFFER, e, t.buffer));
  }
  nextBindBase(t) {
    this._bindCallId++, this._minBaseLocation = 0, t && (this._boundBufferBases[0] = null, this._minBaseLocation = 1, this._nextBindBaseIndex < 1 && (this._nextBindBaseIndex = 1));
  }
  freeLocationForBufferBase(t) {
    let e = this.getLastBindBaseLocation(t);
    if (e >= this._minBaseLocation) return t._lastBindCallId = this._bindCallId, e;
    let s = 0, i = this._nextBindBaseIndex;
    for (; s < 2; ) {
      i >= this._maxBindings && (i = this._minBaseLocation, s++);
      const n = this._boundBufferBases[i];
      if (n && n._lastBindCallId === this._bindCallId) {
        i++;
        continue;
      }
      break;
    }
    return e = i, this._nextBindBaseIndex = i + 1, s >= 2 ? -1 : (t._lastBindCallId = this._bindCallId, this._boundBufferBases[e] = null, e);
  }
  getLastBindBaseLocation(t) {
    const e = t._lastBindBaseLocation;
    return this._boundBufferBases[e] === t ? e : -1;
  }
  bindBufferRange(t, e, s, i) {
    const { _gl: n } = this;
    s || (s = 0), e || (e = 0), this._boundBufferBases[e] = null, n.bindBufferRange(n.UNIFORM_BUFFER, e || 0, t.buffer, s * 256, i || 256);
  }
  updateBuffer(t) {
    const { _gl: e } = this, s = this.getGlBuffer(t);
    if (t._updateID === s.updateID) return s;
    s.updateID = t._updateID, e.bindBuffer(s.type, s.buffer);
    const i = t.data, n = t.descriptor.usage & N$1.STATIC ? e.STATIC_DRAW : e.DYNAMIC_DRAW;
    return i ? s.byteLength >= i.byteLength ? e.bufferSubData(s.type, 0, i, 0, t._updateSize / i.BYTES_PER_ELEMENT) : (s.byteLength = i.byteLength, e.bufferData(s.type, i, n)) : (s.byteLength = t.descriptor.size, e.bufferData(s.type, s.byteLength, n)), s;
  }
  destroyAll() {
    const t = this._gl;
    for (const e in this._gpuBuffers) t.deleteBuffer(this._gpuBuffers[e].buffer);
    this._gpuBuffers = /* @__PURE__ */ Object.create(null);
  }
  onBufferDestroy(t, e) {
    const s = this._gpuBuffers[t.uid], i = this._gl;
    e || i.deleteBuffer(s.buffer), this._gpuBuffers[t.uid] = null;
  }
  createGLBuffer(t) {
    const { _gl: e } = this;
    let s = es.ARRAY_BUFFER;
    t.descriptor.usage & N$1.INDEX ? s = es.ELEMENT_ARRAY_BUFFER : t.descriptor.usage & N$1.UNIFORM && (s = es.UNIFORM_BUFFER);
    const i = new Y_(e.createBuffer(), s);
    return this._gpuBuffers[t.uid] = i, t.on("destroy", this.onBufferDestroy, this), i;
  }
  resetState() {
    this._boundBufferBases = /* @__PURE__ */ Object.create(null);
  }
}
sl.extension = { type: [x$1.WebGLSystem], name: "buffer" };
var Ew = Object.defineProperty, Aw = Object.defineProperties, ww = Object.getOwnPropertyDescriptors, K_ = Object.getOwnPropertySymbols, Pw = Object.prototype.hasOwnProperty, Rw = Object.prototype.propertyIsEnumerable, q_ = (r, t, e) => t in r ? Ew(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Ii = (r, t) => {
  for (var e in t || (t = {})) Pw.call(t, e) && q_(r, e, t[e]);
  if (K_) for (var e of K_(t)) Rw.call(t, e) && q_(r, e, t[e]);
  return r;
}, Z_ = (r, t) => Aw(r, ww(t));
const il = class ly {
  constructor(t) {
    this.supports = { uint32Indices: true, uniformBufferObject: true, vertexArrayObject: true, srgbTextures: true, nonPowOf2wrapping: true, msaa: true, nonPowOf2mipmaps: true }, this._renderer = t, this.extensions = /* @__PURE__ */ Object.create(null), this.handleContextLost = this.handleContextLost.bind(this), this.handleContextRestored = this.handleContextRestored.bind(this);
  }
  get isLost() {
    return !this.gl || this.gl.isContextLost();
  }
  contextChange(t) {
    this.gl = t, this._renderer.gl = t;
  }
  init(t) {
    var e, s;
    t = Ii(Ii({}, ly.defaultOptions), t);
    let i = this.multiView = t.multiView;
    if (t.context && i && (Ct$1("Renderer created with both a context and multiview enabled. Disabling multiView as both cannot work together."), i = false), i ? this.canvas = L.get().createCanvas(this._renderer.canvas.width, this._renderer.canvas.height) : this.canvas = this._renderer.view.canvas, t.context) this.initFromContext(t.context);
    else {
      const n = this._renderer.background.alpha < 1, o = (e = t.premultipliedAlpha) != null ? e : true, a = t.antialias && !this._renderer.backBuffer.useBackBuffer;
      this.createContext(t.preferWebGLVersion, { alpha: n, premultipliedAlpha: o, antialias: a, stencil: true, preserveDrawingBuffer: t.preserveDrawingBuffer, powerPreference: (s = t.powerPreference) != null ? s : "default" });
    }
  }
  ensureCanvasSize(t) {
    if (!this.multiView) {
      t !== this.canvas && Ct$1("multiView is disabled, but targetCanvas is not the main canvas");
      return;
    }
    const { canvas: e } = this;
    (e.width < t.width || e.height < t.height) && (e.width = Math.max(t.width, t.width), e.height = Math.max(t.height, t.height));
  }
  initFromContext(t) {
    this.gl = t, this.webGLVersion = t instanceof L.get().getWebGLRenderingContext() ? 1 : 2, this.getExtensions(), this.validateContext(t), this._renderer.runners.contextChange.emit(t);
    const e = this._renderer.view.canvas;
    e.addEventListener("webglcontextlost", this.handleContextLost, false), e.addEventListener("webglcontextrestored", this.handleContextRestored, false);
  }
  createContext(t, e) {
    let s;
    const i = this.canvas;
    if (t === 2 && (s = i.getContext("webgl2", e)), !s && (s = i.getContext("webgl", e), !s)) throw new Error("This browser does not support WebGL. Try using the canvas renderer");
    this.gl = s, this.initFromContext(this.gl);
  }
  getExtensions() {
    const { gl: t } = this, e = { anisotropicFiltering: t.getExtension("EXT_texture_filter_anisotropic"), floatTextureLinear: t.getExtension("OES_texture_float_linear"), s3tc: t.getExtension("WEBGL_compressed_texture_s3tc"), s3tc_sRGB: t.getExtension("WEBGL_compressed_texture_s3tc_srgb"), etc: t.getExtension("WEBGL_compressed_texture_etc"), etc1: t.getExtension("WEBGL_compressed_texture_etc1"), pvrtc: t.getExtension("WEBGL_compressed_texture_pvrtc") || t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"), atc: t.getExtension("WEBGL_compressed_texture_atc"), astc: t.getExtension("WEBGL_compressed_texture_astc"), bptc: t.getExtension("EXT_texture_compression_bptc"), rgtc: t.getExtension("EXT_texture_compression_rgtc"), loseContext: t.getExtension("WEBGL_lose_context") };
    if (this.webGLVersion === 1) this.extensions = Z_(Ii({}, e), { drawBuffers: t.getExtension("WEBGL_draw_buffers"), depthTexture: t.getExtension("WEBGL_depth_texture"), vertexArrayObject: t.getExtension("OES_vertex_array_object") || t.getExtension("MOZ_OES_vertex_array_object") || t.getExtension("WEBKIT_OES_vertex_array_object"), uint32ElementIndex: t.getExtension("OES_element_index_uint"), floatTexture: t.getExtension("OES_texture_float"), floatTextureLinear: t.getExtension("OES_texture_float_linear"), textureHalfFloat: t.getExtension("OES_texture_half_float"), textureHalfFloatLinear: t.getExtension("OES_texture_half_float_linear"), vertexAttribDivisorANGLE: t.getExtension("ANGLE_instanced_arrays"), srgb: t.getExtension("EXT_sRGB") });
    else {
      this.extensions = Z_(Ii({}, e), { colorBufferFloat: t.getExtension("EXT_color_buffer_float") });
      const s = t.getExtension("WEBGL_provoking_vertex");
      s && s.provokingVertexWEBGL(s.FIRST_VERTEX_CONVENTION_WEBGL);
    }
  }
  handleContextLost(t) {
    t.preventDefault(), this._contextLossForced && (this._contextLossForced = false, setTimeout(() => {
      var e;
      this.gl.isContextLost() && ((e = this.extensions.loseContext) == null || e.restoreContext());
    }, 0));
  }
  handleContextRestored() {
    this.getExtensions(), this._renderer.runners.contextChange.emit(this.gl);
  }
  destroy() {
    var t;
    const e = this._renderer.view.canvas;
    this._renderer = null, e.removeEventListener("webglcontextlost", this.handleContextLost), e.removeEventListener("webglcontextrestored", this.handleContextRestored), this.gl.useProgram(null), (t = this.extensions.loseContext) == null || t.loseContext();
  }
  forceContextLoss() {
    var t;
    (t = this.extensions.loseContext) == null || t.loseContext(), this._contextLossForced = true;
  }
  validateContext(t) {
    const e = t.getContextAttributes();
    e && e.stencil;
    const s = this.supports, i = this.webGLVersion === 2, n = this.extensions;
    s.uint32Indices = i || !!n.uint32ElementIndex, s.uniformBufferObject = i, s.vertexArrayObject = i || !!n.vertexArrayObject, s.srgbTextures = i || !!n.srgb, s.nonPowOf2wrapping = i, s.nonPowOf2mipmaps = i, s.msaa = i, s.uint32Indices;
  }
};
il.extension = { type: [x$1.WebGLSystem], name: "context" }, il.defaultOptions = { context: null, premultipliedAlpha: true, preserveDrawingBuffer: false, powerPreference: void 0, preferWebGLVersion: 2, multiView: false };
let Q_ = il;
function nl(r, t) {
  for (const n in r.attributes) {
    const o = r.attributes[n], a = t[n];
    a ? (o.format != null || (o.format = a.format), o.offset != null || (o.offset = a.offset), o.instance != null || (o.instance = a.instance)) : Ct$1(`Attribute ${n} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`);
  }
  Mw(r);
}
function Mw(r) {
  const { buffers: s, attributes: i } = r, n = {}, o = {};
  for (const a in s) {
    const l3 = s[a];
    n[l3.uid] = 0, o[l3.uid] = 0;
  }
  for (const a in i) {
    const l3 = i[a];
    n[l3.buffer.uid] += Zt(l3.format).stride;
  }
  for (const a in i) {
    const l3 = i[a];
    l3.stride != null || (l3.stride = n[l3.buffer.uid]), l3.start != null || (l3.start = o[l3.buffer.uid]), o[l3.buffer.uid] += Zt(l3.format).stride;
  }
}
var Bi = ((r) => (r[r.RGBA = 6408] = "RGBA", r[r.RGB = 6407] = "RGB", r[r.RG = 33319] = "RG", r[r.RED = 6403] = "RED", r[r.RGBA_INTEGER = 36249] = "RGBA_INTEGER", r[r.RGB_INTEGER = 36248] = "RGB_INTEGER", r[r.RG_INTEGER = 33320] = "RG_INTEGER", r[r.RED_INTEGER = 36244] = "RED_INTEGER", r[r.ALPHA = 6406] = "ALPHA", r[r.LUMINANCE = 6409] = "LUMINANCE", r[r.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", r[r.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", r[r.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL", r))(Bi || {}), ol = ((r) => (r[r.TEXTURE_2D = 3553] = "TEXTURE_2D", r[r.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", r[r.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", r[r.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", r[r.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", r[r.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", r[r.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", r[r.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", r[r.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z", r))(ol || {}), J_ = ((r) => (r[r.CLAMP = 33071] = "CLAMP", r[r.REPEAT = 10497] = "REPEAT", r[r.MIRRORED_REPEAT = 33648] = "MIRRORED_REPEAT", r))(J_ || {}), H$1 = ((r) => (r[r.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", r[r.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", r[r.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", r[r.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", r[r.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", r[r.UNSIGNED_INT = 5125] = "UNSIGNED_INT", r[r.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", r[r.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", r[r.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", r[r.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", r[r.BYTE = 5120] = "BYTE", r[r.SHORT = 5122] = "SHORT", r[r.INT = 5124] = "INT", r[r.FLOAT = 5126] = "FLOAT", r[r.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", r[r.HALF_FLOAT = 36193] = "HALF_FLOAT", r))(H$1 || {});
const tx = { uint8x2: H$1.UNSIGNED_BYTE, uint8x4: H$1.UNSIGNED_BYTE, sint8x2: H$1.BYTE, sint8x4: H$1.BYTE, unorm8x2: H$1.UNSIGNED_BYTE, unorm8x4: H$1.UNSIGNED_BYTE, snorm8x2: H$1.BYTE, snorm8x4: H$1.BYTE, uint16x2: H$1.UNSIGNED_SHORT, uint16x4: H$1.UNSIGNED_SHORT, sint16x2: H$1.SHORT, sint16x4: H$1.SHORT, unorm16x2: H$1.UNSIGNED_SHORT, unorm16x4: H$1.UNSIGNED_SHORT, snorm16x2: H$1.SHORT, snorm16x4: H$1.SHORT, float16x2: H$1.HALF_FLOAT, float16x4: H$1.HALF_FLOAT, float32: H$1.FLOAT, float32x2: H$1.FLOAT, float32x3: H$1.FLOAT, float32x4: H$1.FLOAT, uint32: H$1.UNSIGNED_INT, uint32x2: H$1.UNSIGNED_INT, uint32x3: H$1.UNSIGNED_INT, uint32x4: H$1.UNSIGNED_INT, sint32: H$1.INT, sint32x2: H$1.INT, sint32x3: H$1.INT, sint32x4: H$1.INT };
function ex(r) {
  var t;
  return (t = tx[r]) != null ? t : tx.float32;
}
const Cw = { "point-list": 0, "line-list": 1, "line-strip": 3, "triangle-list": 4, "triangle-strip": 5 };
class al {
  constructor(t) {
    this._geometryVaoHash = /* @__PURE__ */ Object.create(null), this._renderer = t, this._activeGeometry = null, this._activeVao = null, this.hasVao = true, this.hasInstance = true, this._renderer.renderableGC.addManagedHash(this, "_geometryVaoHash");
  }
  contextChange() {
    const t = this.gl = this._renderer.gl;
    if (!this._renderer.context.supports.vertexArrayObject) throw new Error("[PixiJS] Vertex Array Objects are not supported on this device");
    const e = this._renderer.context.extensions.vertexArrayObject;
    e && (t.createVertexArray = () => e.createVertexArrayOES(), t.bindVertexArray = (i) => e.bindVertexArrayOES(i), t.deleteVertexArray = (i) => e.deleteVertexArrayOES(i));
    const s = this._renderer.context.extensions.vertexAttribDivisorANGLE;
    s && (t.drawArraysInstanced = (i, n, o, a) => {
      s.drawArraysInstancedANGLE(i, n, o, a);
    }, t.drawElementsInstanced = (i, n, o, a, l3) => {
      s.drawElementsInstancedANGLE(i, n, o, a, l3);
    }, t.vertexAttribDivisor = (i, n) => s.vertexAttribDivisorANGLE(i, n)), this._activeGeometry = null, this._activeVao = null, this._geometryVaoHash = /* @__PURE__ */ Object.create(null);
  }
  bind(t, e) {
    const s = this.gl;
    this._activeGeometry = t;
    const i = this.getVao(t, e);
    this._activeVao !== i && (this._activeVao = i, s.bindVertexArray(i)), this.updateBuffers();
  }
  resetState() {
    this.unbind();
  }
  updateBuffers() {
    const t = this._activeGeometry, e = this._renderer.buffer;
    for (let s = 0; s < t.buffers.length; s++) {
      const i = t.buffers[s];
      e.updateBuffer(i);
    }
  }
  checkCompatibility(t, e) {
    const s = t.attributes, i = e._attributeData;
    for (const n in i) if (!s[n]) throw new Error(`shader and geometry incompatible, geometry missing the "${n}" attribute`);
  }
  getSignature(t, e) {
    const s = t.attributes, i = e._attributeData, n = ["g", t.uid];
    for (const o in s) i[o] && n.push(o, i[o].location);
    return n.join("-");
  }
  getVao(t, e) {
    var s;
    return ((s = this._geometryVaoHash[t.uid]) == null ? void 0 : s[e._key]) || this.initGeometryVao(t, e);
  }
  initGeometryVao(t, e, s = true) {
    const i = this._renderer.gl, n = this._renderer.buffer;
    this._renderer.shader._getProgramData(e), this.checkCompatibility(t, e);
    const o = this.getSignature(t, e);
    this._geometryVaoHash[t.uid] || (this._geometryVaoHash[t.uid] = /* @__PURE__ */ Object.create(null), t.on("destroy", this.onGeometryDestroy, this));
    const a = this._geometryVaoHash[t.uid];
    let l3 = a[o];
    if (l3) return a[e._key] = l3, l3;
    nl(t, e._attributeData);
    const u3 = t.buffers;
    l3 = i.createVertexArray(), i.bindVertexArray(l3);
    for (let c = 0; c < u3.length; c++) {
      const h = u3[c];
      n.bind(h);
    }
    return this.activateVao(t, e), a[e._key] = l3, a[o] = l3, i.bindVertexArray(null), l3;
  }
  onGeometryDestroy(t, e) {
    const s = this._geometryVaoHash[t.uid], i = this.gl;
    if (s) {
      if (e) for (const n in s) this._activeVao !== s[n] && this.unbind(), i.deleteVertexArray(s[n]);
      this._geometryVaoHash[t.uid] = null;
    }
  }
  destroyAll(t = false) {
    const e = this.gl;
    for (const s in this._geometryVaoHash) {
      if (t) for (const i in this._geometryVaoHash[s]) {
        const n = this._geometryVaoHash[s];
        this._activeVao !== n && this.unbind(), e.deleteVertexArray(n[i]);
      }
      this._geometryVaoHash[s] = null;
    }
  }
  activateVao(t, e) {
    var s, i;
    const n = this._renderer.gl, o = this._renderer.buffer, a = t.attributes;
    t.indexBuffer && o.bind(t.indexBuffer);
    let l3 = null;
    for (const u3 in a) {
      const c = a[u3], h = c.buffer, d = o.getGlBuffer(h), p = e._attributeData[u3];
      if (p) {
        l3 !== d && (o.bind(h), l3 = d);
        const f2 = p.location;
        n.enableVertexAttribArray(f2);
        const g = Zt(c.format), m3 = ex(c.format);
        if (((s = p.format) == null ? void 0 : s.substring(1, 4)) === "int" ? n.vertexAttribIPointer(f2, g.size, m3, c.stride, c.offset) : n.vertexAttribPointer(f2, g.size, m3, g.normalised, c.stride, c.offset), c.instance) if (this.hasInstance) {
          const _ = (i = c.divisor) != null ? i : 1;
          n.vertexAttribDivisor(f2, _);
        } else throw new Error("geometry error, GPU Instancing is not supported on this device");
      }
    }
  }
  draw(t, e, s, i) {
    const { gl: n } = this._renderer, o = this._activeGeometry, a = Cw[t || o.topology];
    if (i != null || (i = o.instanceCount), o.indexBuffer) {
      const l3 = o.indexBuffer.data.BYTES_PER_ELEMENT, u3 = l3 === 2 ? n.UNSIGNED_SHORT : n.UNSIGNED_INT;
      i > 1 ? n.drawElementsInstanced(a, e || o.indexBuffer.data.length, u3, (s || 0) * l3, i) : n.drawElements(a, e || o.indexBuffer.data.length, u3, (s || 0) * l3);
    } else i > 1 ? n.drawArraysInstanced(a, s || 0, e || o.getSize(), i) : n.drawArrays(a, s || 0, e || o.getSize());
    return this;
  }
  unbind() {
    this.gl.bindVertexArray(null), this._activeVao = null, this._activeGeometry = null;
  }
  destroy() {
    this._renderer = null, this.gl = null, this._activeVao = null, this._activeGeometry = null;
  }
}
al.extension = { type: [x$1.WebGLSystem], name: "geometry" };
var Ow = Object.defineProperty, rx = Object.getOwnPropertySymbols, Gw = Object.prototype.hasOwnProperty, Iw = Object.prototype.propertyIsEnumerable, sx = (r, t, e) => t in r ? Ow(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, ix = (r, t) => {
  for (var e in t || (t = {})) Gw.call(t, e) && sx(r, e, t[e]);
  if (rx) for (var e of rx(t)) Iw.call(t, e) && sx(r, e, t[e]);
  return r;
};
const Bw = new ye({ attributes: { aPosition: [-1, -1, 3, -1, -1, 3] } }), ll = class uy {
  constructor(t) {
    this.useBackBuffer = false, this._useBackBufferThisRender = false, this._renderer = t;
  }
  init(t = {}) {
    const { useBackBuffer: e, antialias: s } = ix(ix({}, uy.defaultOptions), t);
    this.useBackBuffer = e, this._antialias = s, this._renderer.context.supports.msaa || (Ct$1("antialiasing, is not supported on when using the back buffer"), this._antialias = false), this._state = Tt.for2d();
    const i = new yt$1({ vertex: `
attribute vec2 aPosition;
out vec2 vUv;

void main() {
gl_Position = vec4(aPosition, 0.0, 1.0);

vUv = (aPosition + 1.0) / 2.0;

// flip dem UVs
vUv.y = 1.0 - vUv.y;
}`, fragment: `
in vec2 vUv;
out vec4 finalColor;

uniform sampler2D uTexture;

void main() {
finalColor = texture(uTexture, vUv);
}`, name: "big-triangle" });
    this._bigTriangleShader = new At$1({ glProgram: i, resources: { uTexture: A$1.WHITE.source } });
  }
  renderStart(t) {
    const e = this._renderer.renderTarget.getRenderTarget(t.target);
    if (this._useBackBufferThisRender = this.useBackBuffer && !!e.isRoot, this._useBackBufferThisRender) {
      const s = this._renderer.renderTarget.getRenderTarget(t.target);
      this._targetTexture = s.colorTexture, t.target = this._getBackBufferTexture(s.colorTexture);
    }
  }
  renderEnd() {
    this._presentBackBuffer();
  }
  _presentBackBuffer() {
    const t = this._renderer;
    t.renderTarget.finishRenderPass(), this._useBackBufferThisRender && (t.renderTarget.bind(this._targetTexture, false), this._bigTriangleShader.resources.uTexture = this._backBufferTexture.source, t.encoder.draw({ geometry: Bw, shader: this._bigTriangleShader, state: this._state }));
  }
  _getBackBufferTexture(t) {
    return this._backBufferTexture = this._backBufferTexture || new A$1({ source: new K$1({ width: t.width, height: t.height, resolution: t._resolution, antialias: this._antialias }) }), this._backBufferTexture.source.resize(t.width, t.height, t._resolution), this._backBufferTexture;
  }
  destroy() {
    this._backBufferTexture && (this._backBufferTexture.destroy(), this._backBufferTexture = null);
  }
};
ll.extension = { type: [x$1.WebGLSystem], name: "backBuffer", priority: 1 }, ll.defaultOptions = { useBackBuffer: false };
let nx = ll;
class ul {
  constructor(t) {
    this._colorMaskCache = 15, this._renderer = t;
  }
  setMask(t) {
    this._colorMaskCache !== t && (this._colorMaskCache = t, this._renderer.gl.colorMask(!!(t & 8), !!(t & 4), !!(t & 2), !!(t & 1)));
  }
}
ul.extension = { type: [x$1.WebGLSystem], name: "colorMask" };
class cl {
  constructor(t) {
    this.commandFinished = Promise.resolve(), this._renderer = t;
  }
  setGeometry(t, e) {
    this._renderer.geometry.bind(t, e.glProgram);
  }
  finishRenderPass() {
  }
  draw(t) {
    const e = this._renderer, { geometry: s, shader: i, state: n, skipSync: o, topology: a, size: l3, start: u3, instanceCount: c } = t;
    e.shader.bind(i, o), e.geometry.bind(s, e.shader._activeProgram), n && e.state.set(n), e.geometry.draw(a, l3, u3, c != null ? c : s.instanceCount);
  }
  destroy() {
    this._renderer = null;
  }
}
cl.extension = { type: [x$1.WebGLSystem], name: "encoder" };
class hl {
  constructor(t) {
    this._renderer = t;
  }
  contextChange() {
    const t = this._renderer.gl;
    this.maxTextures = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS), this.maxBatchableTextures = Xn(this.maxTextures, t), this.maxUniformBindings = t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);
  }
  destroy() {
  }
}
hl.extension = { type: [x$1.WebGLSystem], name: "limits" };
class ox {
  constructor() {
    this.width = -1, this.height = -1, this.msaa = false, this.msaaRenderBuffer = [];
  }
}
const ee = [];
ee[Q$1.NONE] = void 0, ee[Q$1.DISABLED] = { stencilWriteMask: 0, stencilReadMask: 0 }, ee[Q$1.RENDERING_MASK_ADD] = { stencilFront: { compare: "equal", passOp: "increment-clamp" }, stencilBack: { compare: "equal", passOp: "increment-clamp" } }, ee[Q$1.RENDERING_MASK_REMOVE] = { stencilFront: { compare: "equal", passOp: "decrement-clamp" }, stencilBack: { compare: "equal", passOp: "decrement-clamp" } }, ee[Q$1.MASK_ACTIVE] = { stencilWriteMask: 0, stencilFront: { compare: "equal", passOp: "keep" }, stencilBack: { compare: "equal", passOp: "keep" } }, ee[Q$1.INVERSE_MASK_ACTIVE] = { stencilWriteMask: 0, stencilFront: { compare: "not-equal", passOp: "keep" }, stencilBack: { compare: "not-equal", passOp: "keep" } };
class dl {
  constructor(t) {
    this._stencilCache = { enabled: false, stencilReference: 0, stencilMode: Q$1.NONE }, this._renderTargetStencilState = /* @__PURE__ */ Object.create(null), t.renderTarget.onRenderTargetChange.add(this);
  }
  contextChange(t) {
    this._gl = t, this._comparisonFuncMapping = { always: t.ALWAYS, never: t.NEVER, equal: t.EQUAL, "not-equal": t.NOTEQUAL, less: t.LESS, "less-equal": t.LEQUAL, greater: t.GREATER, "greater-equal": t.GEQUAL }, this._stencilOpsMapping = { keep: t.KEEP, zero: t.ZERO, replace: t.REPLACE, invert: t.INVERT, "increment-clamp": t.INCR, "decrement-clamp": t.DECR, "increment-wrap": t.INCR_WRAP, "decrement-wrap": t.DECR_WRAP }, this.resetState();
  }
  onRenderTargetChange(t) {
    if (this._activeRenderTarget === t) return;
    this._activeRenderTarget = t;
    let e = this._renderTargetStencilState[t.uid];
    e || (e = this._renderTargetStencilState[t.uid] = { stencilMode: Q$1.DISABLED, stencilReference: 0 }), this.setStencilMode(e.stencilMode, e.stencilReference);
  }
  resetState() {
    this._stencilCache.enabled = false, this._stencilCache.stencilMode = Q$1.NONE, this._stencilCache.stencilReference = 0;
  }
  setStencilMode(t, e) {
    const s = this._renderTargetStencilState[this._activeRenderTarget.uid], i = this._gl, n = ee[t], o = this._stencilCache;
    if (s.stencilMode = t, s.stencilReference = e, t === Q$1.DISABLED) {
      this._stencilCache.enabled && (this._stencilCache.enabled = false, i.disable(i.STENCIL_TEST));
      return;
    }
    this._stencilCache.enabled || (this._stencilCache.enabled = true, i.enable(i.STENCIL_TEST)), (t !== o.stencilMode || o.stencilReference !== e) && (o.stencilMode = t, o.stencilReference = e, i.stencilFunc(this._comparisonFuncMapping[n.stencilBack.compare], e, 255), i.stencilOp(i.KEEP, i.KEEP, this._stencilOpsMapping[n.stencilBack.passOp]));
  }
}
dl.extension = { type: [x$1.WebGLSystem], name: "stencil" };
class pl {
  constructor(t) {
    this._syncFunctionHash = /* @__PURE__ */ Object.create(null), this._adaptor = t, this._systemCheck();
  }
  _systemCheck() {
    if (!pa()) throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
  }
  ensureUniformGroup(t) {
    const e = this.getUniformGroupData(t);
    t.buffer || (t.buffer = new ft({ data: new Float32Array(e.layout.size / 4), usage: N$1.UNIFORM | N$1.COPY_DST }));
  }
  getUniformGroupData(t) {
    return this._syncFunctionHash[t._signature] || this._initUniformGroup(t);
  }
  _initUniformGroup(t) {
    const e = t._signature;
    let s = this._syncFunctionHash[e];
    if (!s) {
      const i = Object.keys(t.uniformStructures).map((a) => t.uniformStructures[a]), n = this._adaptor.createUboElements(i), o = this._generateUboSync(n.uboElements);
      s = this._syncFunctionHash[e] = { layout: n, syncFunction: o };
    }
    return this._syncFunctionHash[e];
  }
  _generateUboSync(t) {
    return this._adaptor.generateUboSync(t);
  }
  syncUniformGroup(t, e, s) {
    const i = this.getUniformGroupData(t);
    t.buffer || (t.buffer = new ft({ data: new Float32Array(i.layout.size / 4), usage: N$1.UNIFORM | N$1.COPY_DST }));
    let n = null;
    return e || (e = t.buffer.data, n = t.buffer.dataInt32), s || (s = 0), i.syncFunction(t.uniforms, e, n, s), true;
  }
  updateUniformGroup(t) {
    if (t.isStatic && !t._dirtyId) return false;
    t._dirtyId = 0;
    const e = this.syncUniformGroup(t);
    return t.buffer.update(), e;
  }
  destroy() {
    this._syncFunctionHash = null;
  }
}
const fl = { f32: 4, i32: 4, "vec2<f32>": 8, "vec3<f32>": 12, "vec4<f32>": 16, "vec2<i32>": 8, "vec3<i32>": 12, "vec4<i32>": 16, "mat2x2<f32>": 32, "mat3x3<f32>": 48, "mat4x4<f32>": 64 };
function ax(r) {
  const t = r.map((n) => ({ data: n, offset: 0, size: 0 })), e = 16;
  let s = 0, i = 0;
  for (let n = 0; n < t.length; n++) {
    const o = t[n];
    if (s = fl[o.data.type], !s) throw new Error(`Unknown type ${o.data.type}`);
    o.data.size > 1 && (s = Math.max(s, e) * o.data.size);
    const a = s === 12 ? 16 : s;
    o.size = s;
    const l3 = i % e;
    l3 > 0 && e - l3 < a ? i += (e - l3) % 16 : i += (s - l3 % s) % s, o.offset = i, i += s;
  }
  return i = Math.ceil(i / 16) * 16, { uboElements: t, size: i };
}
const le = [{ type: "mat3x3<f32>", test: (r) => r.value.a !== void 0, ubo: `
var matrix = uv[name].toArray(true);
data[offset] = matrix[0];
data[offset + 1] = matrix[1];
data[offset + 2] = matrix[2];
data[offset + 4] = matrix[3];
data[offset + 5] = matrix[4];
data[offset + 6] = matrix[5];
data[offset + 8] = matrix[6];
data[offset + 9] = matrix[7];
data[offset + 10] = matrix[8];
`, uniform: `
gl.uniformMatrix3fv(ud[name].location, false, uv[name].toArray(true));
` }, { type: "vec4<f32>", test: (r) => r.type === "vec4<f32>" && r.size === 1 && r.value.width !== void 0, ubo: `
v = uv[name];
data[offset] = v.x;
data[offset + 1] = v.y;
data[offset + 2] = v.width;
data[offset + 3] = v.height;
`, uniform: `
cv = ud[name].value;
v = uv[name];
if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) {
cv[0] = v.x;
cv[1] = v.y;
cv[2] = v.width;
cv[3] = v.height;
gl.uniform4f(ud[name].location, v.x, v.y, v.width, v.height);
}
` }, { type: "vec2<f32>", test: (r) => r.type === "vec2<f32>" && r.size === 1 && r.value.x !== void 0, ubo: `
v = uv[name];
data[offset] = v.x;
data[offset + 1] = v.y;
`, uniform: `
cv = ud[name].value;
v = uv[name];
if (cv[0] !== v.x || cv[1] !== v.y) {
cv[0] = v.x;
cv[1] = v.y;
gl.uniform2f(ud[name].location, v.x, v.y);
}
` }, { type: "vec4<f32>", test: (r) => r.type === "vec4<f32>" && r.size === 1 && r.value.red !== void 0, ubo: `
v = uv[name];
data[offset] = v.red;
data[offset + 1] = v.green;
data[offset + 2] = v.blue;
data[offset + 3] = v.alpha;
`, uniform: `
cv = ud[name].value;
v = uv[name];
if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha) {
cv[0] = v.red;
cv[1] = v.green;
cv[2] = v.blue;
cv[3] = v.alpha;
gl.uniform4f(ud[name].location, v.red, v.green, v.blue, v.alpha);
}
` }, { type: "vec3<f32>", test: (r) => r.type === "vec3<f32>" && r.size === 1 && r.value.red !== void 0, ubo: `
v = uv[name];
data[offset] = v.red;
data[offset + 1] = v.green;
data[offset + 2] = v.blue;
`, uniform: `
cv = ud[name].value;
v = uv[name];
if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue) {
cv[0] = v.red;
cv[1] = v.green;
cv[2] = v.blue;
gl.uniform3f(ud[name].location, v.red, v.green, v.blue);
}
` }];
function ml(r, t, e, s) {
  const i = [`
var v = null;
var v2 = null;
var t = 0;
var index = 0;
var name = null;
var arrayOffset = null;
`];
  let n = 0;
  for (let a = 0; a < r.length; a++) {
    const l3 = r[a], u3 = l3.data.name;
    let c = false, h = 0;
    for (let d = 0; d < le.length; d++) if (le[d].test(l3.data)) {
      h = l3.offset / 4, i.push(`name = "${u3}";`, `offset += ${h - n};`, le[d][t] || le[d].ubo), c = true;
      break;
    }
    if (!c) if (l3.data.size > 1) h = l3.offset / 4, i.push(e(l3, h - n));
    else {
      const d = s[l3.data.type];
      h = l3.offset / 4, i.push(`
v = uv.${u3};
offset += ${h - n};
${d};
`);
    }
    n = h;
  }
  const o = i.join(`
`);
  return new Function("uv", "data", "dataInt32", "offset", o);
}
var Fw = Object.defineProperty, Dw = Object.defineProperties, Uw = Object.getOwnPropertyDescriptors, lx = Object.getOwnPropertySymbols, kw = Object.prototype.hasOwnProperty, $w = Object.prototype.propertyIsEnumerable, ux = (r, t, e) => t in r ? Fw(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Lw = (r, t) => {
  for (var e in t || (t = {})) kw.call(t, e) && ux(r, e, t[e]);
  if (lx) for (var e of lx(t)) $w.call(t, e) && ux(r, e, t[e]);
  return r;
}, Nw = (r, t) => Dw(r, Uw(t));
function rr(r, t) {
  return `
for (let i = 0; i < ${r * t}; i++) {
data[offset + (((i / ${r})|0) * 4) + (i % ${r})] = v[i];
}
`;
}
const gl = { f32: `
data[offset] = v;`, i32: `
dataInt32[offset] = v;`, "vec2<f32>": `
data[offset] = v[0];
data[offset + 1] = v[1];`, "vec3<f32>": `
data[offset] = v[0];
data[offset + 1] = v[1];
data[offset + 2] = v[2];`, "vec4<f32>": `
data[offset] = v[0];
data[offset + 1] = v[1];
data[offset + 2] = v[2];
data[offset + 3] = v[3];`, "vec2<i32>": `
dataInt32[offset] = v[0];
dataInt32[offset + 1] = v[1];`, "vec3<i32>": `
dataInt32[offset] = v[0];
dataInt32[offset + 1] = v[1];
dataInt32[offset + 2] = v[2];`, "vec4<i32>": `
dataInt32[offset] = v[0];
dataInt32[offset + 1] = v[1];
dataInt32[offset + 2] = v[2];
dataInt32[offset + 3] = v[3];`, "mat2x2<f32>": `
data[offset] = v[0];
data[offset + 1] = v[1];
data[offset + 4] = v[2];
data[offset + 5] = v[3];`, "mat3x3<f32>": `
data[offset] = v[0];
data[offset + 1] = v[1];
data[offset + 2] = v[2];
data[offset + 4] = v[3];
data[offset + 5] = v[4];
data[offset + 6] = v[5];
data[offset + 8] = v[6];
data[offset + 9] = v[7];
data[offset + 10] = v[8];`, "mat4x4<f32>": `
for (let i = 0; i < 16; i++) {
data[offset + i] = v[i];
}`, "mat3x2<f32>": rr(3, 2), "mat4x2<f32>": rr(4, 2), "mat2x3<f32>": rr(2, 3), "mat4x3<f32>": rr(4, 3), "mat2x4<f32>": rr(2, 4), "mat3x4<f32>": rr(3, 4) }, cx = Nw(Lw({}, gl), { "mat2x2<f32>": `
data[offset] = v[0];
data[offset + 1] = v[1];
data[offset + 2] = v[2];
data[offset + 3] = v[3];
` });
function hx(r, t) {
  const e = Math.max(fl[r.data.type] / 16, 1), s = r.data.value.length / r.data.size, i = (4 - s % 4) % 4, n = r.data.type.indexOf("i32") >= 0 ? "dataInt32" : "data";
  return `
v = uv.${r.data.name};
offset += ${t};

arrayOffset = offset;

t = 0;

for(var i=0; i < ${r.data.size * e}; i++)
{
for(var j = 0; j < ${s}; j++)
{
${n}[arrayOffset++] = v[t++];
}
${i !== 0 ? `arrayOffset += ${i};` : ""}
}
`;
}
function dx(r) {
  return ml(r, "uboStd40", hx, gl);
}
class _l extends pl {
  constructor() {
    super({ createUboElements: ax, generateUboSync: dx });
  }
}
_l.extension = { type: [x$1.WebGLSystem], name: "ubo" };
class px {
  constructor() {
    this._clearColorCache = [0, 0, 0, 0], this._viewPortCache = new j$1();
  }
  init(t, e) {
    this._renderer = t, this._renderTargetSystem = e, t.runners.contextChange.add(this);
  }
  contextChange() {
    this._clearColorCache = [0, 0, 0, 0], this._viewPortCache = new j$1();
  }
  copyToTexture(t, e, s, i, n) {
    const o = this._renderTargetSystem, a = this._renderer, l3 = o.getGpuRenderTarget(t), u3 = a.gl;
    return this.finishRenderPass(t), u3.bindFramebuffer(u3.FRAMEBUFFER, l3.resolveTargetFramebuffer), a.texture.bind(e, 0), u3.copyTexSubImage2D(u3.TEXTURE_2D, 0, n.x, n.y, s.x, s.y, i.width, i.height), e;
  }
  startRenderPass(t, e = true, s, i) {
    const n = this._renderTargetSystem, o = t.colorTexture, a = n.getGpuRenderTarget(t);
    let l3 = i.y;
    t.isRoot && (l3 = o.pixelHeight - i.height), t.colorTextures.forEach((h) => {
      this._renderer.texture.unbind(h);
    });
    const u3 = this._renderer.gl;
    u3.bindFramebuffer(u3.FRAMEBUFFER, a.framebuffer);
    const c = this._viewPortCache;
    (c.x !== i.x || c.y !== l3 || c.width !== i.width || c.height !== i.height) && (c.x = i.x, c.y = l3, c.width = i.width, c.height = i.height, u3.viewport(i.x, l3, i.width, i.height)), !a.depthStencilRenderBuffer && (t.stencil || t.depth) && this._initStencil(a), this.clear(t, e, s);
  }
  finishRenderPass(t) {
    const e = this._renderTargetSystem.getGpuRenderTarget(t);
    if (!e.msaa) return;
    const s = this._renderer.gl;
    s.bindFramebuffer(s.FRAMEBUFFER, e.resolveTargetFramebuffer), s.bindFramebuffer(s.READ_FRAMEBUFFER, e.framebuffer), s.blitFramebuffer(0, 0, e.width, e.height, 0, 0, e.width, e.height, s.COLOR_BUFFER_BIT, s.NEAREST), s.bindFramebuffer(s.FRAMEBUFFER, e.framebuffer);
  }
  initGpuRenderTarget(t) {
    const e = this._renderer.gl, s = new ox();
    return t.colorTexture instanceof Nt ? (this._renderer.context.ensureCanvasSize(t.colorTexture.resource), s.framebuffer = null, s) : (this._initColor(t, s), e.bindFramebuffer(e.FRAMEBUFFER, null), s);
  }
  destroyGpuRenderTarget(t) {
    const e = this._renderer.gl;
    t.framebuffer && (e.deleteFramebuffer(t.framebuffer), t.framebuffer = null), t.resolveTargetFramebuffer && (e.deleteFramebuffer(t.resolveTargetFramebuffer), t.resolveTargetFramebuffer = null), t.depthStencilRenderBuffer && (e.deleteRenderbuffer(t.depthStencilRenderBuffer), t.depthStencilRenderBuffer = null), t.msaaRenderBuffer.forEach((s) => {
      e.deleteRenderbuffer(s);
    }), t.msaaRenderBuffer = null;
  }
  clear(t, e, s) {
    if (!e) return;
    const i = this._renderTargetSystem;
    typeof e == "boolean" && (e = e ? gt.ALL : gt.NONE);
    const n = this._renderer.gl;
    if (e & gt.COLOR) {
      s != null || (s = i.defaultClearColor);
      const o = this._clearColorCache, a = s;
      (o[0] !== a[0] || o[1] !== a[1] || o[2] !== a[2] || o[3] !== a[3]) && (o[0] = a[0], o[1] = a[1], o[2] = a[2], o[3] = a[3], n.clearColor(a[0], a[1], a[2], a[3]));
    }
    n.clear(e);
  }
  resizeGpuRenderTarget(t) {
    if (t.isRoot) return;
    const e = this._renderTargetSystem.getGpuRenderTarget(t);
    this._resizeColor(t, e), (t.stencil || t.depth) && this._resizeStencil(e);
  }
  _initColor(t, e) {
    const s = this._renderer, i = s.gl, n = i.createFramebuffer();
    if (e.resolveTargetFramebuffer = n, i.bindFramebuffer(i.FRAMEBUFFER, n), e.width = t.colorTexture.source.pixelWidth, e.height = t.colorTexture.source.pixelHeight, t.colorTextures.forEach((o, a) => {
      const l3 = o.source;
      l3.antialias && (s.context.supports.msaa ? e.msaa = true : Ct$1("[RenderTexture] Antialiasing on textures is not supported in WebGL1")), s.texture.bindSource(l3, 0);
      const u3 = s.texture.getGlSource(l3).texture;
      i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + a, 3553, u3, 0);
    }), e.msaa) {
      const o = i.createFramebuffer();
      e.framebuffer = o, i.bindFramebuffer(i.FRAMEBUFFER, o), t.colorTextures.forEach((a, l3) => {
        const u3 = i.createRenderbuffer();
        e.msaaRenderBuffer[l3] = u3;
      });
    } else e.framebuffer = n;
    this._resizeColor(t, e);
  }
  _resizeColor(t, e) {
    const s = t.colorTexture.source;
    if (e.width = s.pixelWidth, e.height = s.pixelHeight, t.colorTextures.forEach((i, n) => {
      n !== 0 && i.source.resize(s.width, s.height, s._resolution);
    }), e.msaa) {
      const i = this._renderer, n = i.gl, o = e.framebuffer;
      n.bindFramebuffer(n.FRAMEBUFFER, o), t.colorTextures.forEach((a, l3) => {
        const u3 = a.source;
        i.texture.bindSource(u3, 0);
        const c = i.texture.getGlSource(u3).internalFormat, h = e.msaaRenderBuffer[l3];
        n.bindRenderbuffer(n.RENDERBUFFER, h), n.renderbufferStorageMultisample(n.RENDERBUFFER, 4, c, u3.pixelWidth, u3.pixelHeight), n.framebufferRenderbuffer(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0 + l3, n.RENDERBUFFER, h);
      });
    }
  }
  _initStencil(t) {
    if (t.framebuffer === null) return;
    const e = this._renderer.gl, s = e.createRenderbuffer();
    t.depthStencilRenderBuffer = s, e.bindRenderbuffer(e.RENDERBUFFER, s), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.DEPTH_STENCIL_ATTACHMENT, e.RENDERBUFFER, s), this._resizeStencil(t);
  }
  _resizeStencil(t) {
    const e = this._renderer.gl;
    e.bindRenderbuffer(e.RENDERBUFFER, t.depthStencilRenderBuffer), t.msaa ? e.renderbufferStorageMultisample(e.RENDERBUFFER, 4, e.DEPTH24_STENCIL8, t.width, t.height) : e.renderbufferStorage(e.RENDERBUFFER, this._renderer.context.webGLVersion === 2 ? e.DEPTH24_STENCIL8 : e.DEPTH_STENCIL, t.width, t.height);
  }
  prerender(t) {
    const e = t.colorTexture.resource;
    this._renderer.context.multiView && Nt.test(e) && this._renderer.context.ensureCanvasSize(e);
  }
  postrender(t) {
    if (this._renderer.context.multiView && Nt.test(t.colorTexture.resource)) {
      const e = this._renderer.context.canvas, s = t.colorTexture;
      s.context2D.drawImage(e, 0, s.pixelHeight - e.height);
    }
  }
}
function fx(r, t, e, s, i, n) {
  const o = n ? 1 : -1;
  return r.identity(), r.a = 1 / s * 2, r.d = o * (1 / i * 2), r.tx = -1 - t * r.a, r.ty = -o - e * r.d, r;
}
var Xw = Object.defineProperty, mx = Object.getOwnPropertySymbols, Hw = Object.prototype.hasOwnProperty, jw = Object.prototype.propertyIsEnumerable, gx = (r, t, e) => t in r ? Xw(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, zw = (r, t) => {
  for (var e in t || (t = {})) Hw.call(t, e) && gx(r, e, t[e]);
  if (mx) for (var e of mx(t)) jw.call(t, e) && gx(r, e, t[e]);
  return r;
};
const sr = /* @__PURE__ */ new Map();
function xl(r, t) {
  if (!sr.has(r)) {
    const e = new A$1({ source: new Nt(zw({ resource: r }, t)) }), s = () => {
      sr.get(r) === e && sr.delete(r);
    };
    e.once("destroy", s), e.source.once("destroy", s), sr.set(r, e);
  }
  return sr.get(r);
}
function _x(r) {
  const t = r.colorTexture.source.resource;
  return globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement && document.body.contains(t);
}
var Ww = Object.defineProperty, xx = Object.getOwnPropertySymbols, Yw = Object.prototype.hasOwnProperty, Kw = Object.prototype.propertyIsEnumerable, bx = (r, t, e) => t in r ? Ww(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, vx = (r, t) => {
  for (var e in t || (t = {})) Yw.call(t, e) && bx(r, e, t[e]);
  if (xx) for (var e of xx(t)) Kw.call(t, e) && bx(r, e, t[e]);
  return r;
};
const yx = class cy {
  constructor(t = {}) {
    if (this.uid = Y("renderTarget"), this.colorTextures = [], this.dirtyId = 0, this.isRoot = false, this._size = new Float32Array(2), this._managedColorTextures = false, t = vx(vx({}, cy.defaultOptions), t), this.stencil = t.stencil, this.depth = t.depth, this.isRoot = t.isRoot, typeof t.colorTextures == "number") {
      this._managedColorTextures = true;
      for (let e = 0; e < t.colorTextures; e++) this.colorTextures.push(new K$1({ width: t.width, height: t.height, resolution: t.resolution, antialias: t.antialias }));
    } else {
      this.colorTextures = [...t.colorTextures.map((s) => s.source)];
      const e = this.colorTexture.source;
      this.resize(e.width, e.height, e._resolution);
    }
    this.colorTexture.source.on("resize", this.onSourceResize, this), (t.depthStencilTexture || this.stencil) && (t.depthStencilTexture instanceof A$1 || t.depthStencilTexture instanceof K$1 ? this.depthStencilTexture = t.depthStencilTexture.source : this.ensureDepthStencilTexture());
  }
  get size() {
    const t = this._size;
    return t[0] = this.pixelWidth, t[1] = this.pixelHeight, t;
  }
  get width() {
    return this.colorTexture.source.width;
  }
  get height() {
    return this.colorTexture.source.height;
  }
  get pixelWidth() {
    return this.colorTexture.source.pixelWidth;
  }
  get pixelHeight() {
    return this.colorTexture.source.pixelHeight;
  }
  get resolution() {
    return this.colorTexture.source._resolution;
  }
  get colorTexture() {
    return this.colorTextures[0];
  }
  onSourceResize(t) {
    this.resize(t.width, t.height, t._resolution, true);
  }
  ensureDepthStencilTexture() {
    this.depthStencilTexture || (this.depthStencilTexture = new K$1({ width: this.width, height: this.height, resolution: this.resolution, format: "depth24plus-stencil8", autoGenerateMipmaps: false, antialias: false, mipLevelCount: 1 }));
  }
  resize(t, e, s = this.resolution, i = false) {
    this.dirtyId++, this.colorTextures.forEach((n, o) => {
      i && o === 0 || n.source.resize(t, e, s);
    }), this.depthStencilTexture && this.depthStencilTexture.source.resize(t, e, s);
  }
  destroy() {
    this.colorTexture.source.off("resize", this.onSourceResize, this), this._managedColorTextures && this.colorTextures.forEach((t) => {
      t.destroy();
    }), this.depthStencilTexture && (this.depthStencilTexture.destroy(), delete this.depthStencilTexture);
  }
};
yx.defaultOptions = { width: 0, height: 0, resolution: 1, colorTextures: 1, stencil: false, depth: false, antialias: false, isRoot: false };
let Fi = yx;
class bl {
  constructor(t) {
    this.rootViewPort = new j$1(), this.viewport = new j$1(), this.onRenderTargetChange = new fa("onRenderTargetChange"), this.projectionMatrix = new R$1(), this.defaultClearColor = [0, 0, 0, 0], this._renderSurfaceToRenderTargetHash = /* @__PURE__ */ new Map(), this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null), this._renderTargetStack = [], this._renderer = t, t.renderableGC.addManagedHash(this, "_gpuRenderTargetHash");
  }
  finishRenderPass() {
    this.adaptor.finishRenderPass(this.renderTarget);
  }
  renderStart({ target: t, clear: e, clearColor: s, frame: i }) {
    var n, o;
    this._renderTargetStack.length = 0, this.push(t, e, s, i), this.rootViewPort.copyFrom(this.viewport), this.rootRenderTarget = this.renderTarget, this.renderingToScreen = _x(this.rootRenderTarget), (o = (n = this.adaptor).prerender) == null || o.call(n, this.rootRenderTarget);
  }
  postrender() {
    var t, e;
    (e = (t = this.adaptor).postrender) == null || e.call(t, this.rootRenderTarget);
  }
  bind(t, e = true, s, i) {
    const n = this.getRenderTarget(t), o = this.renderTarget !== n;
    this.renderTarget = n, this.renderSurface = t;
    const a = this.getGpuRenderTarget(n);
    (n.pixelWidth !== a.width || n.pixelHeight !== a.height) && (this.adaptor.resizeGpuRenderTarget(n), a.width = n.pixelWidth, a.height = n.pixelHeight);
    const l3 = n.colorTexture, u3 = this.viewport, c = l3.pixelWidth, h = l3.pixelHeight;
    if (!i && t instanceof A$1 && (i = t.frame), i) {
      const d = l3._resolution;
      u3.x = i.x * d + 0.5 | 0, u3.y = i.y * d + 0.5 | 0, u3.width = i.width * d + 0.5 | 0, u3.height = i.height * d + 0.5 | 0;
    } else u3.x = 0, u3.y = 0, u3.width = c, u3.height = h;
    return fx(this.projectionMatrix, 0, 0, u3.width / l3.resolution, u3.height / l3.resolution, !n.isRoot), this.adaptor.startRenderPass(n, e, s, u3), o && this.onRenderTargetChange.emit(n), n;
  }
  clear(t, e = gt.ALL, s) {
    e && (t && (t = this.getRenderTarget(t)), this.adaptor.clear(t || this.renderTarget, e, s, this.viewport));
  }
  contextChange() {
    this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null);
  }
  push(t, e = gt.ALL, s, i) {
    const n = this.bind(t, e, s, i);
    return this._renderTargetStack.push({ renderTarget: n, frame: i }), n;
  }
  pop() {
    this._renderTargetStack.pop();
    const t = this._renderTargetStack[this._renderTargetStack.length - 1];
    this.bind(t.renderTarget, false, null, t.frame);
  }
  getRenderTarget(t) {
    var e;
    return t.isTexture && (t = t.source), (e = this._renderSurfaceToRenderTargetHash.get(t)) != null ? e : this._initRenderTarget(t);
  }
  copyToTexture(t, e, s, i, n) {
    s.x < 0 && (i.width += s.x, n.x -= s.x, s.x = 0), s.y < 0 && (i.height += s.y, n.y -= s.y, s.y = 0);
    const { pixelWidth: o, pixelHeight: a } = t;
    return i.width = Math.min(i.width, o - s.x), i.height = Math.min(i.height, a - s.y), this.adaptor.copyToTexture(t, e, s, i, n);
  }
  ensureDepthStencil() {
    this.renderTarget.stencil || (this.renderTarget.stencil = true, this.adaptor.startRenderPass(this.renderTarget, false, null, this.viewport));
  }
  destroy() {
    this._renderer = null, this._renderSurfaceToRenderTargetHash.forEach((t, e) => {
      t !== e && t.destroy();
    }), this._renderSurfaceToRenderTargetHash.clear(), this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null);
  }
  _initRenderTarget(t) {
    let e = null;
    return Nt.test(t) && (t = xl(t).source), t instanceof Fi ? e = t : t instanceof K$1 && (e = new Fi({ colorTextures: [t] }), t.source instanceof Nt && (e.isRoot = true), t.once("destroy", () => {
      e.destroy(), this._renderSurfaceToRenderTargetHash.delete(t);
      const s = this._gpuRenderTargetHash[e.uid];
      s && (this._gpuRenderTargetHash[e.uid] = null, this.adaptor.destroyGpuRenderTarget(s));
    })), this._renderSurfaceToRenderTargetHash.set(t, e), e;
  }
  getGpuRenderTarget(t) {
    return this._gpuRenderTargetHash[t.uid] || (this._gpuRenderTargetHash[t.uid] = this.adaptor.initGpuRenderTarget(t));
  }
  resetState() {
    this.renderTarget = null, this.renderSurface = null;
  }
}
class vl extends bl {
  constructor(t) {
    super(t), this.adaptor = new px(), this.adaptor.init(t, this);
  }
}
vl.extension = { type: [x$1.WebGLSystem], name: "renderTarget" };
class Di extends dt {
  constructor({ buffer: t, offset: e, size: s }) {
    super(), this.uid = Y("buffer"), this._resourceType = "bufferResource", this._touched = 0, this._resourceId = Y("resource"), this._bufferResource = true, this.destroyed = false, this.buffer = t, this.offset = e | 0, this.size = s, this.buffer.on("change", this.onBufferChange, this);
  }
  onBufferChange() {
    this._resourceId = Y("resource"), this.emit("change", this);
  }
  destroy(t = false) {
    this.destroyed = true, t && this.buffer.destroy(), this.emit("change", this), this.buffer = null;
  }
}
function Tx(r, t) {
  const e = [], s = [`
var g = s.groups;
var sS = r.shader;
var p = s.glProgram;
var ugS = r.uniformGroup;
var resources;
`];
  let i = false, n = 0;
  const o = t._getProgramData(r.glProgram);
  for (const l3 in r.groups) {
    const u3 = r.groups[l3];
    e.push(`
resources = g[${l3}].resources;
`);
    for (const c in u3.resources) {
      const h = u3.resources[c];
      if (h instanceof et$1) if (h.ubo) {
        const d = r._uniformBindMap[l3][Number(c)];
        e.push(`
    sS.bindUniformBlock(
        resources[${c}],
        '${d}',
        ${r.glProgram._uniformBlockData[d].index}
    );
`);
      } else e.push(`
    ugS.updateUniformGroup(resources[${c}], p, sD);
`);
      else if (h instanceof Di) {
        const d = r._uniformBindMap[l3][Number(c)];
        e.push(`
sS.bindUniformBlock(
    resources[${c}],
    '${d}',
    ${r.glProgram._uniformBlockData[d].index}
);
`);
      } else if (h instanceof K$1) {
        const d = r._uniformBindMap[l3][c], p = o.uniformData[d];
        p && (i || (i = true, s.push(`
    var tS = r.texture;
    `)), t._gl.uniform1i(p.location, n), e.push(`
    tS.bind(resources[${c}], ${n});
`), n++);
      }
    }
  }
  const a = [...s, ...e].join(`
`);
  return new Function("r", "s", "sD", a);
}
class Sx {
  constructor(t, e) {
    this.program = t, this.uniformData = e, this.uniformGroups = {}, this.uniformDirtyGroups = {}, this.uniformBlockBindings = {};
  }
  destroy() {
    this.uniformData = null, this.uniformGroups = null, this.uniformDirtyGroups = null, this.uniformBlockBindings = null, this.program = null;
  }
}
function yl(r, t, e) {
  const s = r.createShader(t);
  return r.shaderSource(s, e), r.compileShader(s), s;
}
function Tl(r) {
  const t = new Array(r);
  for (let e = 0; e < t.length; e++) t[e] = false;
  return t;
}
function Sl(r, t) {
  switch (r) {
    case "float":
      return 0;
    case "vec2":
      return new Float32Array(2 * t);
    case "vec3":
      return new Float32Array(3 * t);
    case "vec4":
      return new Float32Array(4 * t);
    case "int":
    case "uint":
    case "sampler2D":
    case "sampler2DArray":
      return 0;
    case "ivec2":
      return new Int32Array(2 * t);
    case "ivec3":
      return new Int32Array(3 * t);
    case "ivec4":
      return new Int32Array(4 * t);
    case "uvec2":
      return new Uint32Array(2 * t);
    case "uvec3":
      return new Uint32Array(3 * t);
    case "uvec4":
      return new Uint32Array(4 * t);
    case "bool":
      return false;
    case "bvec2":
      return Tl(2 * t);
    case "bvec3":
      return Tl(3 * t);
    case "bvec4":
      return Tl(4 * t);
    case "mat2":
      return new Float32Array([1, 0, 0, 1]);
    case "mat3":
      return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    case "mat4":
      return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }
  return null;
}
let Ui = null;
const Ex = { FLOAT: "float", FLOAT_VEC2: "vec2", FLOAT_VEC3: "vec3", FLOAT_VEC4: "vec4", INT: "int", INT_VEC2: "ivec2", INT_VEC3: "ivec3", INT_VEC4: "ivec4", UNSIGNED_INT: "uint", UNSIGNED_INT_VEC2: "uvec2", UNSIGNED_INT_VEC3: "uvec3", UNSIGNED_INT_VEC4: "uvec4", BOOL: "bool", BOOL_VEC2: "bvec2", BOOL_VEC3: "bvec3", BOOL_VEC4: "bvec4", FLOAT_MAT2: "mat2", FLOAT_MAT3: "mat3", FLOAT_MAT4: "mat4", SAMPLER_2D: "sampler2D", INT_SAMPLER_2D: "sampler2D", UNSIGNED_INT_SAMPLER_2D: "sampler2D", SAMPLER_CUBE: "samplerCube", INT_SAMPLER_CUBE: "samplerCube", UNSIGNED_INT_SAMPLER_CUBE: "samplerCube", SAMPLER_2D_ARRAY: "sampler2DArray", INT_SAMPLER_2D_ARRAY: "sampler2DArray", UNSIGNED_INT_SAMPLER_2D_ARRAY: "sampler2DArray" }, Zw = { float: "float32", vec2: "float32x2", vec3: "float32x3", vec4: "float32x4", int: "sint32", ivec2: "sint32x2", ivec3: "sint32x3", ivec4: "sint32x4", uint: "uint32", uvec2: "uint32x2", uvec3: "uint32x3", uvec4: "uint32x4", bool: "uint32", bvec2: "uint32x2", bvec3: "uint32x3", bvec4: "uint32x4" };
function El(r, t) {
  if (!Ui) {
    const e = Object.keys(Ex);
    Ui = {};
    for (let s = 0; s < e.length; ++s) {
      const i = e[s];
      Ui[r[i]] = Ex[i];
    }
  }
  return Ui[t];
}
function Ax(r, t) {
  const e = El(r, t);
  return Zw[e] || "float32";
}
function wx(r, t, e = false) {
  const s = {}, i = t.getProgramParameter(r, t.ACTIVE_ATTRIBUTES);
  for (let o = 0; o < i; o++) {
    const a = t.getActiveAttrib(r, o);
    if (a.name.startsWith("gl_")) continue;
    const l3 = Ax(t, a.type);
    s[a.name] = { location: 0, format: l3, stride: Zt(l3).stride, offset: 0, instance: false, start: 0 };
  }
  const n = Object.keys(s);
  if (e) {
    n.sort((o, a) => o > a ? 1 : -1);
    for (let o = 0; o < n.length; o++) s[n[o]].location = o, t.bindAttribLocation(r, o, n[o]);
    t.linkProgram(r);
  } else for (let o = 0; o < n.length; o++) s[n[o]].location = t.getAttribLocation(r, n[o]);
  return s;
}
function Px(r, t) {
  if (!t.ACTIVE_UNIFORM_BLOCKS) return {};
  const e = {}, s = t.getProgramParameter(r, t.ACTIVE_UNIFORM_BLOCKS);
  for (let i = 0; i < s; i++) {
    const n = t.getActiveUniformBlockName(r, i), o = t.getUniformBlockIndex(r, n), a = t.getActiveUniformBlockParameter(r, i, t.UNIFORM_BLOCK_DATA_SIZE);
    e[n] = { name: n, index: o, size: a };
  }
  return e;
}
function Rx(r, t) {
  const e = {}, s = t.getProgramParameter(r, t.ACTIVE_UNIFORMS);
  for (let i = 0; i < s; i++) {
    const n = t.getActiveUniform(r, i), o = n.name.replace(/\[.*?\]$/, ""), a = !!n.name.match(/\[.*?\]$/), l3 = El(t, n.type);
    e[o] = { name: o, index: i, type: l3, size: n.size, isArray: a, value: Sl(l3, n.size) };
  }
  return e;
}
function Mx(r, t) {
  const e = r.getShaderSource(t).split(`
`).map((u3, c) => `${c}: ${u3}`), s = r.getShaderInfoLog(t), i = s.split(`
`), n = {}, o = i.map((u3) => parseFloat(u3.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1"))).filter((u3) => u3 && !n[u3] ? (n[u3] = true, true) : false), a = [""];
  o.forEach((u3) => {
    e[u3 - 1] = `%c${e[u3 - 1]}%c`, a.push("background: #FF0000; color:#FFFFFF; font-size: 10px", "font-size: 10px");
  });
  const l3 = e.join(`
`);
  a[0] = l3, console.error(s), console.groupCollapsed("click to view full shader code"), console.warn(...a), console.groupEnd();
}
function Cx(r, t, e, s) {
  r.getProgramParameter(t, r.LINK_STATUS) || (r.getShaderParameter(e, r.COMPILE_STATUS) || Mx(r, e), r.getShaderParameter(s, r.COMPILE_STATUS) || Mx(r, s), console.error("PixiJS Error: Could not initialize shader."), r.getProgramInfoLog(t) !== "" && console.warn("PixiJS Warning: gl.getProgramInfoLog()", r.getProgramInfoLog(t)));
}
function Ox(r, t) {
  const e = yl(r, r.VERTEX_SHADER, t.vertex), s = yl(r, r.FRAGMENT_SHADER, t.fragment), i = r.createProgram();
  r.attachShader(i, e), r.attachShader(i, s);
  const n = t.transformFeedbackVaryings;
  n && (typeof r.transformFeedbackVaryings != "function" || r.transformFeedbackVaryings(i, n.names, n.bufferMode === "separate" ? r.SEPARATE_ATTRIBS : r.INTERLEAVED_ATTRIBS)), r.linkProgram(i), r.getProgramParameter(i, r.LINK_STATUS) || Cx(r, i, e, s), t._attributeData = wx(i, r, !/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(t.vertex)), t._uniformData = Rx(i, r), t._uniformBlockData = Px(i, r), r.deleteShader(e), r.deleteShader(s);
  const o = {};
  for (const a in t._uniformData) {
    const l3 = t._uniformData[a];
    o[a] = { location: r.getUniformLocation(i, a), value: Sl(l3.type, l3.size) };
  }
  return new Sx(i, o);
}
const ki = { textureCount: 0, blockIndex: 0 };
class Al {
  constructor(t) {
    this._activeProgram = null, this._programDataHash = /* @__PURE__ */ Object.create(null), this._shaderSyncFunctions = /* @__PURE__ */ Object.create(null), this._renderer = t, this._renderer.renderableGC.addManagedHash(this, "_programDataHash");
  }
  contextChange(t) {
    this._gl = t, this._programDataHash = /* @__PURE__ */ Object.create(null), this._shaderSyncFunctions = /* @__PURE__ */ Object.create(null), this._activeProgram = null;
  }
  bind(t, e) {
    if (this._setProgram(t.glProgram), e) return;
    ki.textureCount = 0, ki.blockIndex = 0;
    let s = this._shaderSyncFunctions[t.glProgram._key];
    s || (s = this._shaderSyncFunctions[t.glProgram._key] = this._generateShaderSync(t, this)), this._renderer.buffer.nextBindBase(!!t.glProgram.transformFeedbackVaryings), s(this._renderer, t, ki);
  }
  updateUniformGroup(t) {
    this._renderer.uniformGroup.updateUniformGroup(t, this._activeProgram, ki);
  }
  bindUniformBlock(t, e, s = 0) {
    const i = this._renderer.buffer, n = this._getProgramData(this._activeProgram), o = t._bufferResource;
    o || this._renderer.ubo.updateUniformGroup(t);
    const a = t.buffer, l3 = i.updateBuffer(a), u3 = i.freeLocationForBufferBase(l3);
    if (o) {
      const { offset: h, size: d } = t;
      h === 0 && d === a.data.byteLength ? i.bindBufferBase(l3, u3) : i.bindBufferRange(l3, u3, h);
    } else i.getLastBindBaseLocation(l3) !== u3 && i.bindBufferBase(l3, u3);
    const c = this._activeProgram._uniformBlockData[e].index;
    n.uniformBlockBindings[s] !== u3 && (n.uniformBlockBindings[s] = u3, this._renderer.gl.uniformBlockBinding(n.program, c, u3));
  }
  _setProgram(t) {
    if (this._activeProgram === t) return;
    this._activeProgram = t;
    const e = this._getProgramData(t);
    this._gl.useProgram(e.program);
  }
  _getProgramData(t) {
    return this._programDataHash[t._key] || this._createProgramData(t);
  }
  _createProgramData(t) {
    const e = t._key;
    return this._programDataHash[e] = Ox(this._gl, t), this._programDataHash[e];
  }
  destroy() {
    for (const t of Object.keys(this._programDataHash)) this._programDataHash[t].destroy(), this._programDataHash[t] = null;
    this._programDataHash = null;
  }
  _generateShaderSync(t, e) {
    return Tx(t, e);
  }
  resetState() {
    this._activeProgram = null;
  }
}
Al.extension = { type: [x$1.WebGLSystem], name: "shader" };
const Gx = { f32: `if (cv !== v) {
cu.value = v;
gl.uniform1f(location, v);
}`, "vec2<f32>": `if (cv[0] !== v[0] || cv[1] !== v[1]) {
cv[0] = v[0];
cv[1] = v[1];
gl.uniform2f(location, v[0], v[1]);
}`, "vec3<f32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
cv[0] = v[0];
cv[1] = v[1];
cv[2] = v[2];
gl.uniform3f(location, v[0], v[1], v[2]);
}`, "vec4<f32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
cv[0] = v[0];
cv[1] = v[1];
cv[2] = v[2];
cv[3] = v[3];
gl.uniform4f(location, v[0], v[1], v[2], v[3]);
}`, i32: `if (cv !== v) {
cu.value = v;
gl.uniform1i(location, v);
}`, "vec2<i32>": `if (cv[0] !== v[0] || cv[1] !== v[1]) {
cv[0] = v[0];
cv[1] = v[1];
gl.uniform2i(location, v[0], v[1]);
}`, "vec3<i32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
cv[0] = v[0];
cv[1] = v[1];
cv[2] = v[2];
gl.uniform3i(location, v[0], v[1], v[2]);
}`, "vec4<i32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
cv[0] = v[0];
cv[1] = v[1];
cv[2] = v[2];
cv[3] = v[3];
gl.uniform4i(location, v[0], v[1], v[2], v[3]);
}`, u32: `if (cv !== v) {
cu.value = v;
gl.uniform1ui(location, v);
}`, "vec2<u32>": `if (cv[0] !== v[0] || cv[1] !== v[1]) {
cv[0] = v[0];
cv[1] = v[1];
gl.uniform2ui(location, v[0], v[1]);
}`, "vec3<u32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
cv[0] = v[0];
cv[1] = v[1];
cv[2] = v[2];
gl.uniform3ui(location, v[0], v[1], v[2]);
}`, "vec4<u32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
cv[0] = v[0];
cv[1] = v[1];
cv[2] = v[2];
cv[3] = v[3];
gl.uniform4ui(location, v[0], v[1], v[2], v[3]);
}`, bool: `if (cv !== v) {
cu.value = v;
gl.uniform1i(location, v);
}`, "vec2<bool>": `if (cv[0] !== v[0] || cv[1] !== v[1]) {
cv[0] = v[0];
cv[1] = v[1];
gl.uniform2i(location, v[0], v[1]);
}`, "vec3<bool>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
cv[0] = v[0];
cv[1] = v[1];
cv[2] = v[2];
gl.uniform3i(location, v[0], v[1], v[2]);
}`, "vec4<bool>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
cv[0] = v[0];
cv[1] = v[1];
cv[2] = v[2];
cv[3] = v[3];
gl.uniform4i(location, v[0], v[1], v[2], v[3]);
}`, "mat2x2<f32>": "gl.uniformMatrix2fv(location, false, v);", "mat3x3<f32>": "gl.uniformMatrix3fv(location, false, v);", "mat4x4<f32>": "gl.uniformMatrix4fv(location, false, v);" }, Ix = { f32: "gl.uniform1fv(location, v);", "vec2<f32>": "gl.uniform2fv(location, v);", "vec3<f32>": "gl.uniform3fv(location, v);", "vec4<f32>": "gl.uniform4fv(location, v);", "mat2x2<f32>": "gl.uniformMatrix2fv(location, false, v);", "mat3x3<f32>": "gl.uniformMatrix3fv(location, false, v);", "mat4x4<f32>": "gl.uniformMatrix4fv(location, false, v);", i32: "gl.uniform1iv(location, v);", "vec2<i32>": "gl.uniform2iv(location, v);", "vec3<i32>": "gl.uniform3iv(location, v);", "vec4<i32>": "gl.uniform4iv(location, v);", u32: "gl.uniform1iv(location, v);", "vec2<u32>": "gl.uniform2iv(location, v);", "vec3<u32>": "gl.uniform3iv(location, v);", "vec4<u32>": "gl.uniform4iv(location, v);", bool: "gl.uniform1iv(location, v);", "vec2<bool>": "gl.uniform2iv(location, v);", "vec3<bool>": "gl.uniform3iv(location, v);", "vec4<bool>": "gl.uniform4iv(location, v);" };
function Bx(r, t) {
  const e = [`
var v = null;
var cv = null;
var cu = null;
var t = 0;
var gl = renderer.gl;
var name = null;
`];
  for (const s in r.uniforms) {
    if (!t[s]) {
      r.uniforms[s] instanceof et$1 ? r.uniforms[s].ubo ? e.push(`
    renderer.shader.bindUniformBlock(uv.${s}, "${s}");
`) : e.push(`
    renderer.shader.updateUniformGroup(uv.${s});
`) : r.uniforms[s] instanceof Di && e.push(`
    renderer.shader.bindBufferResource(uv.${s}, "${s}");
`);
      continue;
    }
    const i = r.uniformStructures[s];
    let n = false;
    for (let o = 0; o < le.length; o++) {
      const a = le[o];
      if (i.type === a.type && a.test(i)) {
        e.push(`name = "${s}";`, le[o].uniform), n = true;
        break;
      }
    }
    if (!n) {
      const o = (i.size === 1 ? Gx : Ix)[i.type].replace("location", `ud["${s}"].location`);
      e.push(`
cu = ud["${s}"];
cv = cu.value;
v = uv["${s}"];
${o};`);
    }
  }
  return new Function("ud", "uv", "renderer", "syncData", e.join(`
`));
}
class wl {
  constructor(t) {
    this._cache = {}, this._uniformGroupSyncHash = {}, this._renderer = t, this.gl = null, this._cache = {};
  }
  contextChange(t) {
    this.gl = t;
  }
  updateUniformGroup(t, e, s) {
    const i = this._renderer.shader._getProgramData(e);
    (!t.isStatic || t._dirtyId !== i.uniformDirtyGroups[t.uid]) && (i.uniformDirtyGroups[t.uid] = t._dirtyId, this._getUniformSyncFunction(t, e)(i.uniformData, t.uniforms, this._renderer, s));
  }
  _getUniformSyncFunction(t, e) {
    var s;
    return ((s = this._uniformGroupSyncHash[t._signature]) == null ? void 0 : s[e._key]) || this._createUniformSyncFunction(t, e);
  }
  _createUniformSyncFunction(t, e) {
    const s = this._uniformGroupSyncHash[t._signature] || (this._uniformGroupSyncHash[t._signature] = {}), i = this._getSignature(t, e._uniformData, "u");
    return this._cache[i] || (this._cache[i] = this._generateUniformsSync(t, e._uniformData)), s[e._key] = this._cache[i], s[e._key];
  }
  _generateUniformsSync(t, e) {
    return Bx(t, e);
  }
  _getSignature(t, e, s) {
    const i = t.uniforms, n = [`${s}-`];
    for (const o in i) n.push(o), e[o] && n.push(e[o].type);
    return n.join("-");
  }
  destroy() {
    this._renderer = null, this._cache = null;
  }
}
wl.extension = { type: [x$1.WebGLSystem], name: "uniformGroup" };
function Fx(r) {
  const t = {};
  if (t.normal = [r.ONE, r.ONE_MINUS_SRC_ALPHA], t.add = [r.ONE, r.ONE], t.multiply = [r.DST_COLOR, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA], t.screen = [r.ONE, r.ONE_MINUS_SRC_COLOR, r.ONE, r.ONE_MINUS_SRC_ALPHA], t.none = [0, 0], t["normal-npm"] = [r.SRC_ALPHA, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA], t["add-npm"] = [r.SRC_ALPHA, r.ONE, r.ONE, r.ONE], t["screen-npm"] = [r.SRC_ALPHA, r.ONE_MINUS_SRC_COLOR, r.ONE, r.ONE_MINUS_SRC_ALPHA], t.erase = [r.ZERO, r.ONE_MINUS_SRC_ALPHA], !(r instanceof L.get().getWebGLRenderingContext())) t.min = [r.ONE, r.ONE, r.ONE, r.ONE, r.MIN, r.MIN], t.max = [r.ONE, r.ONE, r.ONE, r.ONE, r.MAX, r.MAX];
  else {
    const e = r.getExtension("EXT_blend_minmax");
    e && (t.min = [r.ONE, r.ONE, r.ONE, r.ONE, e.MIN_EXT, e.MIN_EXT], t.max = [r.ONE, r.ONE, r.ONE, r.ONE, e.MAX_EXT, e.MAX_EXT]);
  }
  return t;
}
const eP = 0, rP = 1, sP = 2, iP = 3, nP = 4, oP = 5, Dx = class wu {
  constructor(t) {
    this._invertFrontFace = false, this.gl = null, this.stateId = 0, this.polygonOffset = 0, this.blendMode = "none", this._blendEq = false, this.map = [], this.map[eP] = this.setBlend, this.map[rP] = this.setOffset, this.map[sP] = this.setCullFace, this.map[iP] = this.setDepthTest, this.map[nP] = this.setFrontFace, this.map[oP] = this.setDepthMask, this.checks = [], this.defaultState = Tt.for2d(), t.renderTarget.onRenderTargetChange.add(this);
  }
  onRenderTargetChange(t) {
    this._invertFrontFace = !t.isRoot, this._cullFace ? this.setFrontFace(this._frontFace) : this._frontFaceDirty = true;
  }
  contextChange(t) {
    this.gl = t, this.blendModesMap = Fx(t), this.resetState();
  }
  set(t) {
    if (t || (t = this.defaultState), this.stateId !== t.data) {
      let e = this.stateId ^ t.data, s = 0;
      for (; e; ) e & 1 && this.map[s].call(this, !!(t.data & 1 << s)), e >>= 1, s++;
      this.stateId = t.data;
    }
    for (let e = 0; e < this.checks.length; e++) this.checks[e](this, t);
  }
  forceState(t) {
    t || (t = this.defaultState);
    for (let e = 0; e < this.map.length; e++) this.map[e].call(this, !!(t.data & 1 << e));
    for (let e = 0; e < this.checks.length; e++) this.checks[e](this, t);
    this.stateId = t.data;
  }
  setBlend(t) {
    this._updateCheck(wu._checkBlendMode, t), this.gl[t ? "enable" : "disable"](this.gl.BLEND);
  }
  setOffset(t) {
    this._updateCheck(wu._checkPolygonOffset, t), this.gl[t ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
  }
  setDepthTest(t) {
    this.gl[t ? "enable" : "disable"](this.gl.DEPTH_TEST);
  }
  setDepthMask(t) {
    this.gl.depthMask(t);
  }
  setCullFace(t) {
    this._cullFace = t, this.gl[t ? "enable" : "disable"](this.gl.CULL_FACE), this._cullFace && this._frontFaceDirty && this.setFrontFace(this._frontFace);
  }
  setFrontFace(t) {
    this._frontFace = t, this._frontFaceDirty = false;
    const e = this._invertFrontFace ? !t : t;
    this._glFrontFace !== e && (this._glFrontFace = e, this.gl.frontFace(this.gl[e ? "CW" : "CCW"]));
  }
  setBlendMode(t) {
    if (this.blendModesMap[t] || (t = "normal"), t === this.blendMode) return;
    this.blendMode = t;
    const e = this.blendModesMap[t], s = this.gl;
    e.length === 2 ? s.blendFunc(e[0], e[1]) : s.blendFuncSeparate(e[0], e[1], e[2], e[3]), e.length === 6 ? (this._blendEq = true, s.blendEquationSeparate(e[4], e[5])) : this._blendEq && (this._blendEq = false, s.blendEquationSeparate(s.FUNC_ADD, s.FUNC_ADD));
  }
  setPolygonOffset(t, e) {
    this.gl.polygonOffset(t, e);
  }
  resetState() {
    this._glFrontFace = false, this._frontFace = false, this._cullFace = false, this._frontFaceDirty = false, this._invertFrontFace = false, this.gl.frontFace(this.gl.CCW), this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false), this.forceState(this.defaultState), this._blendEq = true, this.blendMode = "", this.setBlendMode("normal");
  }
  _updateCheck(t, e) {
    const s = this.checks.indexOf(t);
    e && s === -1 ? this.checks.push(t) : !e && s !== -1 && this.checks.splice(s, 1);
  }
  static _checkBlendMode(t, e) {
    t.setBlendMode(e.blendMode);
  }
  static _checkPolygonOffset(t, e) {
    t.setPolygonOffset(1, e.polygonOffset);
  }
  destroy() {
    this.gl = null, this.checks.length = 0;
  }
};
Dx.extension = { type: [x$1.WebGLSystem], name: "state" };
let Ux = Dx;
class kx {
  constructor(t) {
    this.target = ol.TEXTURE_2D, this.texture = t, this.width = -1, this.height = -1, this.type = H$1.UNSIGNED_BYTE, this.internalFormat = Bi.RGBA, this.format = Bi.RGBA, this.samplerType = 0;
  }
}
const $x = { id: "buffer", upload(r, t, e) {
  t.width === r.width || t.height === r.height ? e.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, r.width, r.height, t.format, t.type, r.resource) : e.texImage2D(t.target, 0, t.internalFormat, r.width, r.height, 0, t.format, t.type, r.resource), t.width = r.width, t.height = r.height;
} }, aP = { "bc1-rgba-unorm": true, "bc1-rgba-unorm-srgb": true, "bc2-rgba-unorm": true, "bc2-rgba-unorm-srgb": true, "bc3-rgba-unorm": true, "bc3-rgba-unorm-srgb": true, "bc4-r-unorm": true, "bc4-r-snorm": true, "bc5-rg-unorm": true, "bc5-rg-snorm": true, "bc6h-rgb-ufloat": true, "bc6h-rgb-float": true, "bc7-rgba-unorm": true, "bc7-rgba-unorm-srgb": true, "etc2-rgb8unorm": true, "etc2-rgb8unorm-srgb": true, "etc2-rgb8a1unorm": true, "etc2-rgb8a1unorm-srgb": true, "etc2-rgba8unorm": true, "etc2-rgba8unorm-srgb": true, "eac-r11unorm": true, "eac-r11snorm": true, "eac-rg11unorm": true, "eac-rg11snorm": true, "astc-4x4-unorm": true, "astc-4x4-unorm-srgb": true, "astc-5x4-unorm": true, "astc-5x4-unorm-srgb": true, "astc-5x5-unorm": true, "astc-5x5-unorm-srgb": true, "astc-6x5-unorm": true, "astc-6x5-unorm-srgb": true, "astc-6x6-unorm": true, "astc-6x6-unorm-srgb": true, "astc-8x5-unorm": true, "astc-8x5-unorm-srgb": true, "astc-8x6-unorm": true, "astc-8x6-unorm-srgb": true, "astc-8x8-unorm": true, "astc-8x8-unorm-srgb": true, "astc-10x5-unorm": true, "astc-10x5-unorm-srgb": true, "astc-10x6-unorm": true, "astc-10x6-unorm-srgb": true, "astc-10x8-unorm": true, "astc-10x8-unorm-srgb": true, "astc-10x10-unorm": true, "astc-10x10-unorm-srgb": true, "astc-12x10-unorm": true, "astc-12x10-unorm-srgb": true, "astc-12x12-unorm": true, "astc-12x12-unorm-srgb": true }, Lx = { id: "compressed", upload(r, t, e) {
  e.pixelStorei(e.UNPACK_ALIGNMENT, 4);
  let s = r.pixelWidth, i = r.pixelHeight;
  const n = !!aP[r.format];
  for (let o = 0; o < r.resource.length; o++) {
    const a = r.resource[o];
    n ? e.compressedTexImage2D(e.TEXTURE_2D, o, t.internalFormat, s, i, 0, a) : e.texImage2D(e.TEXTURE_2D, o, t.internalFormat, s, i, 0, t.format, t.type, a), s = Math.max(s >> 1, 1), i = Math.max(i >> 1, 1);
  }
} }, Pl = { id: "image", upload(r, t, e, s) {
  const i = t.width, n = t.height, o = r.pixelWidth, a = r.pixelHeight, l3 = r.resourceWidth, u3 = r.resourceHeight;
  l3 < o || u3 < a ? ((i !== o || n !== a) && e.texImage2D(t.target, 0, t.internalFormat, o, a, 0, t.format, t.type, null), s === 2 ? e.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, l3, u3, t.format, t.type, r.resource) : e.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, t.format, t.type, r.resource)) : i === o && n === a ? e.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, t.format, t.type, r.resource) : s === 2 ? e.texImage2D(t.target, 0, t.internalFormat, o, a, 0, t.format, t.type, r.resource) : e.texImage2D(t.target, 0, t.internalFormat, t.format, t.type, r.resource), t.width = o, t.height = a;
} }, Nx = { id: "video", upload(r, t, e, s) {
  if (!r.isValid) {
    e.texImage2D(t.target, 0, t.internalFormat, 1, 1, 0, t.format, t.type, null);
    return;
  }
  Pl.upload(r, t, e, s);
} }, Rl = { linear: 9729, nearest: 9728 }, Xx = { linear: { linear: 9987, nearest: 9985 }, nearest: { linear: 9986, nearest: 9984 } }, $i = { "clamp-to-edge": 33071, repeat: 10497, "mirror-repeat": 33648 }, Hx = { never: 512, less: 513, equal: 514, "less-equal": 515, greater: 516, "not-equal": 517, "greater-equal": 518, always: 519 };
function Ml(r, t, e, s, i, n, o, a) {
  const l3 = n;
  if (!a || r.addressModeU !== "repeat" || r.addressModeV !== "repeat" || r.addressModeW !== "repeat") {
    const u3 = $i[o ? "clamp-to-edge" : r.addressModeU], c = $i[o ? "clamp-to-edge" : r.addressModeV], h = $i[o ? "clamp-to-edge" : r.addressModeW];
    t[i](l3, t.TEXTURE_WRAP_S, u3), t[i](l3, t.TEXTURE_WRAP_T, c), t.TEXTURE_WRAP_R && t[i](l3, t.TEXTURE_WRAP_R, h);
  }
  if ((!a || r.magFilter !== "linear") && t[i](l3, t.TEXTURE_MAG_FILTER, Rl[r.magFilter]), e) {
    if (!a || r.mipmapFilter !== "linear") {
      const u3 = Xx[r.minFilter][r.mipmapFilter];
      t[i](l3, t.TEXTURE_MIN_FILTER, u3);
    }
  } else t[i](l3, t.TEXTURE_MIN_FILTER, Rl[r.minFilter]);
  if (s && r.maxAnisotropy > 1) {
    const u3 = Math.min(r.maxAnisotropy, t.getParameter(s.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
    t[i](l3, s.TEXTURE_MAX_ANISOTROPY_EXT, u3);
  }
  r.compare && t[i](l3, t.TEXTURE_COMPARE_FUNC, Hx[r.compare]);
}
function jx(r) {
  return { r8unorm: r.RED, r8snorm: r.RED, r8uint: r.RED, r8sint: r.RED, r16uint: r.RED, r16sint: r.RED, r16float: r.RED, rg8unorm: r.RG, rg8snorm: r.RG, rg8uint: r.RG, rg8sint: r.RG, r32uint: r.RED, r32sint: r.RED, r32float: r.RED, rg16uint: r.RG, rg16sint: r.RG, rg16float: r.RG, rgba8unorm: r.RGBA, "rgba8unorm-srgb": r.RGBA, rgba8snorm: r.RGBA, rgba8uint: r.RGBA, rgba8sint: r.RGBA, bgra8unorm: r.RGBA, "bgra8unorm-srgb": r.RGBA, rgb9e5ufloat: r.RGB, rgb10a2unorm: r.RGBA, rg11b10ufloat: r.RGB, rg32uint: r.RG, rg32sint: r.RG, rg32float: r.RG, rgba16uint: r.RGBA, rgba16sint: r.RGBA, rgba16float: r.RGBA, rgba32uint: r.RGBA, rgba32sint: r.RGBA, rgba32float: r.RGBA, stencil8: r.STENCIL_INDEX8, depth16unorm: r.DEPTH_COMPONENT, depth24plus: r.DEPTH_COMPONENT, "depth24plus-stencil8": r.DEPTH_STENCIL, depth32float: r.DEPTH_COMPONENT, "depth32float-stencil8": r.DEPTH_STENCIL };
}
var lP = Object.defineProperty, uP = Object.defineProperties, cP = Object.getOwnPropertyDescriptors, zx = Object.getOwnPropertySymbols, hP = Object.prototype.hasOwnProperty, dP = Object.prototype.propertyIsEnumerable, Vx = (r, t, e) => t in r ? lP(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Me = (r, t) => {
  for (var e in t || (t = {})) hP.call(t, e) && Vx(r, e, t[e]);
  if (zx) for (var e of zx(t)) dP.call(t, e) && Vx(r, e, t[e]);
  return r;
}, pP = (r, t) => uP(r, cP(t));
function Wx(r, t) {
  let e = {}, s = r.RGBA;
  return r instanceof L.get().getWebGLRenderingContext() ? t.srgb && (e = { "rgba8unorm-srgb": t.srgb.SRGB8_ALPHA8_EXT, "bgra8unorm-srgb": t.srgb.SRGB8_ALPHA8_EXT }) : (e = { "rgba8unorm-srgb": r.SRGB8_ALPHA8, "bgra8unorm-srgb": r.SRGB8_ALPHA8 }, s = r.RGBA8), Me(Me(Me(Me(Me(Me(pP(Me({ r8unorm: r.R8, r8snorm: r.R8_SNORM, r8uint: r.R8UI, r8sint: r.R8I, r16uint: r.R16UI, r16sint: r.R16I, r16float: r.R16F, rg8unorm: r.RG8, rg8snorm: r.RG8_SNORM, rg8uint: r.RG8UI, rg8sint: r.RG8I, r32uint: r.R32UI, r32sint: r.R32I, r32float: r.R32F, rg16uint: r.RG16UI, rg16sint: r.RG16I, rg16float: r.RG16F, rgba8unorm: r.RGBA }, e), { rgba8snorm: r.RGBA8_SNORM, rgba8uint: r.RGBA8UI, rgba8sint: r.RGBA8I, bgra8unorm: s, rgb9e5ufloat: r.RGB9_E5, rgb10a2unorm: r.RGB10_A2, rg11b10ufloat: r.R11F_G11F_B10F, rg32uint: r.RG32UI, rg32sint: r.RG32I, rg32float: r.RG32F, rgba16uint: r.RGBA16UI, rgba16sint: r.RGBA16I, rgba16float: r.RGBA16F, rgba32uint: r.RGBA32UI, rgba32sint: r.RGBA32I, rgba32float: r.RGBA32F, stencil8: r.STENCIL_INDEX8, depth16unorm: r.DEPTH_COMPONENT16, depth24plus: r.DEPTH_COMPONENT24, "depth24plus-stencil8": r.DEPTH24_STENCIL8, depth32float: r.DEPTH_COMPONENT32F, "depth32float-stencil8": r.DEPTH32F_STENCIL8 }), t.s3tc ? { "bc1-rgba-unorm": t.s3tc.COMPRESSED_RGBA_S3TC_DXT1_EXT, "bc2-rgba-unorm": t.s3tc.COMPRESSED_RGBA_S3TC_DXT3_EXT, "bc3-rgba-unorm": t.s3tc.COMPRESSED_RGBA_S3TC_DXT5_EXT } : {}), t.s3tc_sRGB ? { "bc1-rgba-unorm-srgb": t.s3tc_sRGB.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT, "bc2-rgba-unorm-srgb": t.s3tc_sRGB.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT, "bc3-rgba-unorm-srgb": t.s3tc_sRGB.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT } : {}), t.rgtc ? { "bc4-r-unorm": t.rgtc.COMPRESSED_RED_RGTC1_EXT, "bc4-r-snorm": t.rgtc.COMPRESSED_SIGNED_RED_RGTC1_EXT, "bc5-rg-unorm": t.rgtc.COMPRESSED_RED_GREEN_RGTC2_EXT, "bc5-rg-snorm": t.rgtc.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT } : {}), t.bptc ? { "bc6h-rgb-float": t.bptc.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT, "bc6h-rgb-ufloat": t.bptc.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT, "bc7-rgba-unorm": t.bptc.COMPRESSED_RGBA_BPTC_UNORM_EXT, "bc7-rgba-unorm-srgb": t.bptc.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT } : {}), t.etc ? { "etc2-rgb8unorm": t.etc.COMPRESSED_RGB8_ETC2, "etc2-rgb8unorm-srgb": t.etc.COMPRESSED_SRGB8_ETC2, "etc2-rgb8a1unorm": t.etc.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2, "etc2-rgb8a1unorm-srgb": t.etc.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2, "etc2-rgba8unorm": t.etc.COMPRESSED_RGBA8_ETC2_EAC, "etc2-rgba8unorm-srgb": t.etc.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC, "eac-r11unorm": t.etc.COMPRESSED_R11_EAC, "eac-rg11unorm": t.etc.COMPRESSED_SIGNED_RG11_EAC } : {}), t.astc ? { "astc-4x4-unorm": t.astc.COMPRESSED_RGBA_ASTC_4x4_KHR, "astc-4x4-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR, "astc-5x4-unorm": t.astc.COMPRESSED_RGBA_ASTC_5x4_KHR, "astc-5x4-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR, "astc-5x5-unorm": t.astc.COMPRESSED_RGBA_ASTC_5x5_KHR, "astc-5x5-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR, "astc-6x5-unorm": t.astc.COMPRESSED_RGBA_ASTC_6x5_KHR, "astc-6x5-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR, "astc-6x6-unorm": t.astc.COMPRESSED_RGBA_ASTC_6x6_KHR, "astc-6x6-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR, "astc-8x5-unorm": t.astc.COMPRESSED_RGBA_ASTC_8x5_KHR, "astc-8x5-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR, "astc-8x6-unorm": t.astc.COMPRESSED_RGBA_ASTC_8x6_KHR, "astc-8x6-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR, "astc-8x8-unorm": t.astc.COMPRESSED_RGBA_ASTC_8x8_KHR, "astc-8x8-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR, "astc-10x5-unorm": t.astc.COMPRESSED_RGBA_ASTC_10x5_KHR, "astc-10x5-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR, "astc-10x6-unorm": t.astc.COMPRESSED_RGBA_ASTC_10x6_KHR, "astc-10x6-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR, "astc-10x8-unorm": t.astc.COMPRESSED_RGBA_ASTC_10x8_KHR, "astc-10x8-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR, "astc-10x10-unorm": t.astc.COMPRESSED_RGBA_ASTC_10x10_KHR, "astc-10x10-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR, "astc-12x10-unorm": t.astc.COMPRESSED_RGBA_ASTC_12x10_KHR, "astc-12x10-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR, "astc-12x12-unorm": t.astc.COMPRESSED_RGBA_ASTC_12x12_KHR, "astc-12x12-unorm-srgb": t.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR } : {});
}
function Yx(r) {
  return { r8unorm: r.UNSIGNED_BYTE, r8snorm: r.BYTE, r8uint: r.UNSIGNED_BYTE, r8sint: r.BYTE, r16uint: r.UNSIGNED_SHORT, r16sint: r.SHORT, r16float: r.HALF_FLOAT, rg8unorm: r.UNSIGNED_BYTE, rg8snorm: r.BYTE, rg8uint: r.UNSIGNED_BYTE, rg8sint: r.BYTE, r32uint: r.UNSIGNED_INT, r32sint: r.INT, r32float: r.FLOAT, rg16uint: r.UNSIGNED_SHORT, rg16sint: r.SHORT, rg16float: r.HALF_FLOAT, rgba8unorm: r.UNSIGNED_BYTE, "rgba8unorm-srgb": r.UNSIGNED_BYTE, rgba8snorm: r.BYTE, rgba8uint: r.UNSIGNED_BYTE, rgba8sint: r.BYTE, bgra8unorm: r.UNSIGNED_BYTE, "bgra8unorm-srgb": r.UNSIGNED_BYTE, rgb9e5ufloat: r.UNSIGNED_INT_5_9_9_9_REV, rgb10a2unorm: r.UNSIGNED_INT_2_10_10_10_REV, rg11b10ufloat: r.UNSIGNED_INT_10F_11F_11F_REV, rg32uint: r.UNSIGNED_INT, rg32sint: r.INT, rg32float: r.FLOAT, rgba16uint: r.UNSIGNED_SHORT, rgba16sint: r.SHORT, rgba16float: r.HALF_FLOAT, rgba32uint: r.UNSIGNED_INT, rgba32sint: r.INT, rgba32float: r.FLOAT, stencil8: r.UNSIGNED_BYTE, depth16unorm: r.UNSIGNED_SHORT, depth24plus: r.UNSIGNED_INT, "depth24plus-stencil8": r.UNSIGNED_INT_24_8, depth32float: r.FLOAT, "depth32float-stencil8": r.FLOAT_32_UNSIGNED_INT_24_8_REV };
}
const mP = 4;
class Cl {
  constructor(t) {
    this.managedTextures = [], this._glTextures = /* @__PURE__ */ Object.create(null), this._glSamplers = /* @__PURE__ */ Object.create(null), this._boundTextures = [], this._activeTextureLocation = -1, this._boundSamplers = /* @__PURE__ */ Object.create(null), this._uploads = { image: Pl, buffer: $x, video: Nx, compressed: Lx }, this._premultiplyAlpha = false, this._useSeparateSamplers = false, this._renderer = t, this._renderer.renderableGC.addManagedHash(this, "_glTextures"), this._renderer.renderableGC.addManagedHash(this, "_glSamplers");
  }
  contextChange(t) {
    this._gl = t, this._mapFormatToInternalFormat || (this._mapFormatToInternalFormat = Wx(t, this._renderer.context.extensions), this._mapFormatToType = Yx(t), this._mapFormatToFormat = jx(t)), this._glTextures = /* @__PURE__ */ Object.create(null), this._glSamplers = /* @__PURE__ */ Object.create(null), this._boundSamplers = /* @__PURE__ */ Object.create(null), this._premultiplyAlpha = false;
    for (let e = 0; e < 16; e++) this.bind(A$1.EMPTY, e);
  }
  initSource(t) {
    this.bind(t);
  }
  bind(t, e = 0) {
    const s = t.source;
    t ? (this.bindSource(s, e), this._useSeparateSamplers && this._bindSampler(s.style, e)) : (this.bindSource(null, e), this._useSeparateSamplers && this._bindSampler(null, e));
  }
  bindSource(t, e = 0) {
    const s = this._gl;
    if (t._touched = this._renderer.textureGC.count, this._boundTextures[e] !== t) {
      this._boundTextures[e] = t, this._activateLocation(e), t || (t = A$1.EMPTY.source);
      const i = this.getGlSource(t);
      s.bindTexture(i.target, i.texture);
    }
  }
  _bindSampler(t, e = 0) {
    const s = this._gl;
    if (!t) {
      this._boundSamplers[e] = null, s.bindSampler(e, null);
      return;
    }
    const i = this._getGlSampler(t);
    this._boundSamplers[e] !== i && (this._boundSamplers[e] = i, s.bindSampler(e, i));
  }
  unbind(t) {
    const e = t.source, s = this._boundTextures, i = this._gl;
    for (let n = 0; n < s.length; n++) if (s[n] === e) {
      this._activateLocation(n);
      const o = this.getGlSource(e);
      i.bindTexture(o.target, null), s[n] = null;
    }
  }
  _activateLocation(t) {
    this._activeTextureLocation !== t && (this._activeTextureLocation = t, this._gl.activeTexture(this._gl.TEXTURE0 + t));
  }
  _initSource(t) {
    const e = this._gl, s = new kx(e.createTexture());
    if (s.type = this._mapFormatToType[t.format], s.internalFormat = this._mapFormatToInternalFormat[t.format], s.format = this._mapFormatToFormat[t.format], t.autoGenerateMipmaps && (this._renderer.context.supports.nonPowOf2mipmaps || t.isPowerOfTwo)) {
      const i = Math.max(t.width, t.height);
      t.mipLevelCount = Math.floor(Math.log2(i)) + 1;
    }
    return this._glTextures[t.uid] = s, this.managedTextures.includes(t) || (t.on("update", this.onSourceUpdate, this), t.on("resize", this.onSourceUpdate, this), t.on("styleChange", this.onStyleChange, this), t.on("destroy", this.onSourceDestroy, this), t.on("unload", this.onSourceUnload, this), t.on("updateMipmaps", this.onUpdateMipmaps, this), this.managedTextures.push(t)), this.onSourceUpdate(t), this.updateStyle(t, false), s;
  }
  onStyleChange(t) {
    this.updateStyle(t, false);
  }
  updateStyle(t, e) {
    const s = this._gl, i = this.getGlSource(t);
    s.bindTexture(s.TEXTURE_2D, i.texture), this._boundTextures[this._activeTextureLocation] = t, Ml(t.style, s, t.mipLevelCount > 1, this._renderer.context.extensions.anisotropicFiltering, "texParameteri", s.TEXTURE_2D, !this._renderer.context.supports.nonPowOf2wrapping && !t.isPowerOfTwo, e);
  }
  onSourceUnload(t) {
    const e = this._glTextures[t.uid];
    e && (this.unbind(t), this._glTextures[t.uid] = null, this._gl.deleteTexture(e.texture));
  }
  onSourceUpdate(t) {
    const e = this._gl, s = this.getGlSource(t);
    e.bindTexture(e.TEXTURE_2D, s.texture), this._boundTextures[this._activeTextureLocation] = t;
    const i = t.alphaMode === "premultiply-alpha-on-upload";
    this._premultiplyAlpha !== i && (this._premultiplyAlpha = i, e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, i)), this._uploads[t.uploadMethodId] ? this._uploads[t.uploadMethodId].upload(t, s, e, this._renderer.context.webGLVersion) : e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, t.pixelWidth, t.pixelHeight, 0, e.RGBA, e.UNSIGNED_BYTE, null), t.autoGenerateMipmaps && t.mipLevelCount > 1 && this.onUpdateMipmaps(t, false);
  }
  onUpdateMipmaps(t, e = true) {
    e && this.bindSource(t, 0);
    const s = this.getGlSource(t);
    this._gl.generateMipmap(s.target);
  }
  onSourceDestroy(t) {
    t.off("destroy", this.onSourceDestroy, this), t.off("update", this.onSourceUpdate, this), t.off("resize", this.onSourceUpdate, this), t.off("unload", this.onSourceUnload, this), t.off("styleChange", this.onStyleChange, this), t.off("updateMipmaps", this.onUpdateMipmaps, this), this.managedTextures.splice(this.managedTextures.indexOf(t), 1), this.onSourceUnload(t);
  }
  _initSampler(t) {
    const e = this._gl, s = this._gl.createSampler();
    return this._glSamplers[t._resourceId] = s, Ml(t, e, this._boundTextures[this._activeTextureLocation].mipLevelCount > 1, this._renderer.context.extensions.anisotropicFiltering, "samplerParameteri", s, false, true), this._glSamplers[t._resourceId];
  }
  _getGlSampler(t) {
    return this._glSamplers[t._resourceId] || this._initSampler(t);
  }
  getGlSource(t) {
    return this._glTextures[t.uid] || this._initSource(t);
  }
  generateCanvas(t) {
    const { pixels: e, width: s, height: i } = this.getPixels(t), n = L.get().createCanvas();
    n.width = s, n.height = i;
    const o = n.getContext("2d");
    if (o) {
      const a = o.createImageData(s, i);
      a.data.set(e), o.putImageData(a, 0, 0);
    }
    return n;
  }
  getPixels(t) {
    const e = t.source.resolution, s = t.frame, i = Math.max(Math.round(s.width * e), 1), n = Math.max(Math.round(s.height * e), 1), o = new Uint8Array(mP * i * n), a = this._renderer, l3 = a.renderTarget.getRenderTarget(t), u3 = a.renderTarget.getGpuRenderTarget(l3), c = a.gl;
    return c.bindFramebuffer(c.FRAMEBUFFER, u3.resolveTargetFramebuffer), c.readPixels(Math.round(s.x * e), Math.round(s.y * e), i, n, c.RGBA, c.UNSIGNED_BYTE, o), { pixels: new Uint8ClampedArray(o.buffer), width: i, height: n };
  }
  destroy() {
    this.managedTextures.slice().forEach((t) => this.onSourceDestroy(t)), this.managedTextures = null, this._renderer = null;
  }
  resetState() {
    this._activeTextureLocation = -1, this._boundTextures.fill(A$1.EMPTY.source), this._boundSamplers = /* @__PURE__ */ Object.create(null);
    const t = this._gl;
    this._premultiplyAlpha = false, t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._premultiplyAlpha);
  }
}
Cl.extension = { type: [x$1.WebGLSystem], name: "texture" };
class Ol {
  contextChange(t) {
    const e = new et$1({ uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" }, uTransformMatrix: { value: new R$1(), type: "mat3x3<f32>" }, uRound: { value: 0, type: "f32" } }), s = t.limits.maxBatchableTextures, i = Ne({ name: "graphics", bits: [Us, $s(s), si, He] });
    this.shader = new At$1({ glProgram: i, resources: { localUniforms: e, batchSamplers: Ls(s) } });
  }
  execute(t, e) {
    const s = e.context, i = s.customShader || this.shader, n = t.renderer, o = n.graphicsContext, { batcher: a, instructions: l3 } = o.getContextRenderData(s);
    i.groups[0] = n.globalUniforms.bindGroup, n.state.set(t.state), n.shader.bind(i), n.geometry.bind(a.geometry, i.glProgram);
    const u3 = l3.instructions;
    for (let c = 0; c < l3.instructionSize; c++) {
      const h = u3[c];
      if (h.size) {
        for (let d = 0; d < h.textures.count; d++) n.texture.bind(h.textures.textures[d], d);
        n.geometry.draw(h.topology, h.size, h.start);
      }
    }
  }
  destroy() {
    this.shader.destroy(true), this.shader = null;
  }
}
Ol.extension = { type: [x$1.WebGLPipesAdaptor], name: "graphics" };
class Gl {
  init() {
    const t = Ne({ name: "mesh", bits: [si, W_, He] });
    this._shader = new At$1({ glProgram: t, resources: { uTexture: A$1.EMPTY.source, textureUniforms: { uTextureMatrix: { type: "mat3x3<f32>", value: new R$1() } } } });
  }
  execute(t, e) {
    const s = t.renderer;
    let i = e._shader;
    if (i) {
      if (!i.glProgram) return;
    } else {
      i = this._shader;
      const n = e.texture, o = n.source;
      i.resources.uTexture = o, i.resources.uSampler = o.style, i.resources.textureUniforms.uniforms.uTextureMatrix = n.textureMatrix.mapCoord;
    }
    i.groups[100] = s.globalUniforms.bindGroup, i.groups[101] = t.localUniformsBindGroup, s.encoder.draw({ geometry: e._geometry, shader: i, state: e.state });
  }
  destroy() {
    this._shader.destroy(true), this._shader = null;
  }
}
Gl.extension = { type: [x$1.WebGLPipesAdaptor], name: "mesh" };
class Il {
  constructor(t) {
    this._renderer = t;
  }
  updateRenderable() {
  }
  destroyRenderable() {
  }
  validateRenderable() {
    return false;
  }
  addRenderable(t, e) {
    this._renderer.renderPipes.batch.break(e), e.add(t);
  }
  execute(t) {
    t.isRenderable && t.render(this._renderer);
  }
  destroy() {
    this._renderer = null;
  }
}
Il.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "customRender" };
function Li(r, t) {
  const e = r.instructionSet, s = e.instructions;
  for (let i = 0; i < e.instructionSize; i++) {
    const n = s[i];
    t[n.renderPipeId].execute(n);
  }
}
const gP = new R$1();
class Bl {
  constructor(t) {
    this._renderer = t;
  }
  addRenderGroup(t, e) {
    t.isCachedAsTexture ? this._addRenderableCacheAsTexture(t, e) : this._addRenderableDirect(t, e);
  }
  execute(t) {
    t.isRenderable && (t.isCachedAsTexture ? this._executeCacheAsTexture(t) : this._executeDirect(t));
  }
  destroy() {
    this._renderer = null;
  }
  _addRenderableDirect(t, e) {
    this._renderer.renderPipes.batch.break(e), t._batchableRenderGroup && (nt.return(t._batchableRenderGroup), t._batchableRenderGroup = null), e.add(t);
  }
  _addRenderableCacheAsTexture(t, e) {
    var s;
    const i = (s = t._batchableRenderGroup) != null ? s : t._batchableRenderGroup = nt.get(Gr);
    i.renderable = t.root, i.transform = t.root.relativeGroupTransform, i.texture = t.texture, i.bounds = t._textureBounds, e.add(t), this._renderer.renderPipes.batch.addToBatch(i, e);
  }
  _executeCacheAsTexture(t) {
    if (t.textureNeedsUpdate) {
      t.textureNeedsUpdate = false;
      const e = gP.identity().translate(-t._textureBounds.x, -t._textureBounds.y);
      this._renderer.renderTarget.push(t.texture, true, null, t.texture.frame), this._renderer.globalUniforms.push({ worldTransformMatrix: e, worldColor: 4294967295 }), Li(t, this._renderer.renderPipes), this._renderer.renderTarget.finishRenderPass(), this._renderer.renderTarget.pop(), this._renderer.globalUniforms.pop();
    }
    t._batchableRenderGroup._batcher.updateElement(t._batchableRenderGroup), t._batchableRenderGroup._batcher.geometry.buffers[0].update();
  }
  _executeDirect(t) {
    this._renderer.globalUniforms.push({ worldTransformMatrix: t.inverseParentTextureTransform, worldColor: t.worldColorAlpha }), Li(t, this._renderer.renderPipes), this._renderer.globalUniforms.pop();
  }
}
Bl.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "renderGroup" };
function Ni(r, t) {
  t || (t = 0);
  for (let e = t; e < r.length && r[e]; e++) r[e] = null;
}
const _P = new lt(), Kx = Ie | br | Ts;
function Fl(r, t = false) {
  qx(r);
  const e = r.childrenToUpdate, s = r.updateTick++;
  for (const i in e) {
    const n = Number(i), o = e[i], a = o.list, l3 = o.index;
    for (let u3 = 0; u3 < l3; u3++) {
      const c = a[u3];
      c.parentRenderGroup === r && c.relativeRenderGroupDepth === n && Dl(c, s, 0);
    }
    Ni(a, l3), o.index = 0;
  }
  if (t) for (let i = 0; i < r.renderGroupChildren.length; i++) Fl(r.renderGroupChildren[i], t);
}
function qx(r) {
  const t = r.root;
  let e;
  if (r.renderGroupParent) {
    const s = r.renderGroupParent;
    r.worldTransform.appendFrom(t.relativeGroupTransform, s.worldTransform), r.worldColor = xr(t.groupColor, s.worldColor), e = t.groupAlpha * s.worldAlpha;
  } else r.worldTransform.copyFrom(t.localTransform), r.worldColor = t.localColor, e = t.localAlpha;
  e = e < 0 ? 0 : e > 1 ? 1 : e, r.worldAlpha = e, r.worldColorAlpha = r.worldColor + ((e * 255 | 0) << 24);
}
function Dl(r, t, e) {
  if (t === r.updateTick) return;
  r.updateTick = t, r.didChange = false;
  const s = r.localTransform;
  r.updateLocalTransform();
  const i = r.parent;
  if (i && !i.renderGroup ? (e |= r._updateFlags, r.relativeGroupTransform.appendFrom(s, i.relativeGroupTransform), e & Kx && Zx(r, i, e)) : (e = r._updateFlags, r.relativeGroupTransform.copyFrom(s), e & Kx && Zx(r, _P, e)), !r.renderGroup) {
    const n = r.children, o = n.length;
    for (let u3 = 0; u3 < o; u3++) Dl(n[u3], t, e);
    const a = r.parentRenderGroup, l3 = r;
    l3.renderPipeId && !a.structureDidChange && a.updateRenderable(l3);
  }
}
function Zx(r, t, e) {
  if (e & br) {
    r.groupColor = xr(r.localColor, t.groupColor);
    let s = r.localAlpha * t.groupAlpha;
    s = s < 0 ? 0 : s > 1 ? 1 : s, r.groupAlpha = s, r.groupColorAlpha = r.groupColor + ((s * 255 | 0) << 24);
  }
  e & Ts && (r.groupBlendMode = r.localBlendMode === "inherit" ? t.groupBlendMode : r.localBlendMode), e & Ie && (r.globalDisplayStatus = r.localDisplayStatus & t.globalDisplayStatus), r._updateFlags = 0;
}
function Qx(r, t) {
  const { list: e, index: s } = r.childrenRenderablesToUpdate;
  let i = false;
  for (let n = 0; n < s; n++) {
    const o = e[n];
    if (i = t[o.renderPipeId].validateRenderable(o), i) break;
  }
  return r.structureDidChange = i, i;
}
const xP = new R$1();
class Ul {
  constructor(t) {
    this._renderer = t;
  }
  render({ container: t, transform: e }) {
    const s = t.parent, i = t.renderGroup.renderGroupParent;
    t.parent = null, t.renderGroup.renderGroupParent = null;
    const n = this._renderer;
    let o = xP;
    e && (o = o.copyFrom(t.renderGroup.localTransform), t.renderGroup.localTransform.copyFrom(e));
    const a = n.renderPipes;
    this._updateCachedRenderGroups(t.renderGroup, null), this._updateRenderGroups(t.renderGroup), n.globalUniforms.start({ worldTransformMatrix: e ? t.renderGroup.localTransform : t.renderGroup.worldTransform, worldColor: t.renderGroup.worldColorAlpha }), Li(t.renderGroup, a), a.uniformBatch && a.uniformBatch.renderEnd(), e && t.renderGroup.localTransform.copyFrom(o), t.parent = s, t.renderGroup.renderGroupParent = i;
  }
  destroy() {
    this._renderer = null;
  }
  _updateCachedRenderGroups(t, e) {
    var s;
    if (t.isCachedAsTexture) {
      if (!t.updateCacheTexture) return;
      e = t;
    }
    t._parentCacheAsTextureRenderGroup = e;
    for (let i = t.renderGroupChildren.length - 1; i >= 0; i--) this._updateCachedRenderGroups(t.renderGroupChildren[i], e);
    if (t.invalidateMatrices(), t.isCachedAsTexture) {
      if (t.textureNeedsUpdate) {
        const i = t.root.getLocalBounds();
        i.ceil();
        const n = t.texture;
        t.texture && tt$1.returnTexture(t.texture);
        const o = this._renderer, a = t.textureOptions.resolution || o.view.resolution, l3 = (s = t.textureOptions.antialias) != null ? s : o.view.antialias;
        t.texture = tt$1.getOptimalTexture(i.width, i.height, a, l3), t._textureBounds || (t._textureBounds = new st$1()), t._textureBounds.copyFrom(i), n !== t.texture && t.renderGroupParent && (t.renderGroupParent.structureDidChange = true);
      }
    } else t.texture && (tt$1.returnTexture(t.texture), t.texture = null);
  }
  _updateRenderGroups(t) {
    const e = this._renderer, s = e.renderPipes;
    if (t.runOnRender(e), t.instructionSet.renderPipes = s, t.structureDidChange ? Ni(t.childrenRenderablesToUpdate.list, 0) : Qx(t, s), Fl(t), t.structureDidChange ? (t.structureDidChange = false, this._buildInstructions(t, e)) : this._updateRenderables(t), t.childrenRenderablesToUpdate.index = 0, e.renderPipes.batch.upload(t.instructionSet), !(t.isCachedAsTexture && !t.textureNeedsUpdate)) for (let i = 0; i < t.renderGroupChildren.length; i++) this._updateRenderGroups(t.renderGroupChildren[i]);
  }
  _updateRenderables(t) {
    const { list: e, index: s } = t.childrenRenderablesToUpdate;
    for (let i = 0; i < s; i++) {
      const n = e[i];
      n.didViewUpdate && t.updateRenderable(n);
    }
    Ni(e, s);
  }
  _buildInstructions(t, e) {
    const s = t.root, i = t.instructionSet;
    i.reset();
    const n = e.renderPipes ? e : e.batch.renderer, o = n.renderPipes;
    o.batch.buildStart(i), o.blendMode.buildStart(), o.colorMask.buildStart(), s.sortableChildren && s.sortChildren(), s.collectRenderablesWithEffects(i, n, null), o.batch.buildEnd(i), o.blendMode.buildEnd(i);
  }
}
Ul.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem, x$1.CanvasSystem], name: "renderGroup" };
class kl {
  constructor(t) {
    this._renderer = t;
  }
  addRenderable(t, e) {
    const s = this._getGpuSprite(t);
    t.didViewUpdate && this._updateBatchableSprite(t, s), this._renderer.renderPipes.batch.addToBatch(s, e);
  }
  updateRenderable(t) {
    const e = this._getGpuSprite(t);
    t.didViewUpdate && this._updateBatchableSprite(t, e), e._batcher.updateElement(e);
  }
  validateRenderable(t) {
    const e = this._getGpuSprite(t);
    return !e._batcher.checkAndUpdateTexture(e, t._texture);
  }
  _updateBatchableSprite(t, e) {
    e.bounds = t.visualBounds, e.texture = t._texture;
  }
  _getGpuSprite(t) {
    return t._gpuData[this._renderer.uid] || this._initGPUSprite(t);
  }
  _initGPUSprite(t) {
    const e = new Gr();
    return e.renderable = t, e.transform = t.groupTransform, e.texture = t._texture, e.bounds = t.visualBounds, e.roundPixels = this._renderer._roundPixels | t._roundPixels, t._gpuData[this._renderer.uid] = e, e;
  }
  destroy() {
    this._renderer = null;
  }
}
kl.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "sprite" };
var bP = Object.defineProperty, Jx = Object.getOwnPropertySymbols, vP = Object.prototype.hasOwnProperty, yP = Object.prototype.propertyIsEnumerable, tb = (r, t, e) => t in r ? bP(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, eb = (r, t) => {
  for (var e in t || (t = {})) vP.call(t, e) && tb(r, e, t[e]);
  if (Jx) for (var e of Jx(t)) yP.call(t, e) && tb(r, e, t[e]);
  return r;
};
const $l = class hy {
  constructor() {
    this.clearBeforeRender = true, this._backgroundColor = new X(0), this.color = this._backgroundColor, this.alpha = 1;
  }
  init(t) {
    t = eb(eb({}, hy.defaultOptions), t), this.clearBeforeRender = t.clearBeforeRender, this.color = t.background || t.backgroundColor || this._backgroundColor, this.alpha = t.backgroundAlpha, this._backgroundColor.setAlpha(t.backgroundAlpha);
  }
  get color() {
    return this._backgroundColor;
  }
  set color(t) {
    this._backgroundColor.setValue(t);
  }
  get alpha() {
    return this._backgroundColor.alpha;
  }
  set alpha(t) {
    this._backgroundColor.setAlpha(t);
  }
  get colorRgba() {
    return this._backgroundColor.toArray();
  }
  destroy() {
  }
};
$l.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem, x$1.CanvasSystem], name: "background", priority: 0 }, $l.defaultOptions = { backgroundAlpha: 1, backgroundColor: 0, clearBeforeRender: true };
let rb = $l;
const rs = {};
G$1.handle(x$1.BlendMode, (r) => {
  if (!r.name) throw new Error("BlendMode extension must have a name property");
  rs[r.name] = r.ref;
}, (r) => {
  delete rs[r.name];
});
class Ll {
  constructor(t) {
    this._isAdvanced = false, this._filterHash = /* @__PURE__ */ Object.create(null), this._renderer = t, this._renderer.runners.prerender.add(this);
  }
  prerender() {
    this._activeBlendMode = "normal", this._isAdvanced = false;
  }
  setBlendMode(t, e, s) {
    if (this._activeBlendMode === e) {
      this._isAdvanced && this._renderableList.push(t);
      return;
    }
    this._activeBlendMode = e, this._isAdvanced && this._endAdvancedBlendMode(s), this._isAdvanced = !!rs[e], this._isAdvanced && (this._beginAdvancedBlendMode(s), this._renderableList.push(t));
  }
  _beginAdvancedBlendMode(t) {
    this._renderer.renderPipes.batch.break(t);
    const e = this._activeBlendMode;
    if (!rs[e]) return;
    let s = this._filterHash[e];
    s || (s = this._filterHash[e] = new gr(), s.filters = [new rs[e]()]);
    const i = { renderPipeId: "filter", action: "pushFilter", renderables: [], filterEffect: s, canBundle: false };
    this._renderableList = i.renderables, t.add(i);
  }
  _endAdvancedBlendMode(t) {
    this._renderableList = null, this._renderer.renderPipes.batch.break(t), t.add({ renderPipeId: "filter", action: "popFilter", canBundle: false });
  }
  buildStart() {
    this._isAdvanced = false;
  }
  buildEnd(t) {
    this._isAdvanced && this._endAdvancedBlendMode(t);
  }
  destroy() {
    this._renderer = null, this._renderableList = null;
    for (const t in this._filterHash) this._filterHash[t].destroy();
    this._filterHash = null;
  }
}
Ll.extension = { type: [x$1.WebGLPipes, x$1.WebGPUPipes, x$1.CanvasPipes], name: "blendMode" };
var TP = Object.defineProperty, sb = Object.getOwnPropertySymbols, SP = Object.prototype.hasOwnProperty, EP = Object.prototype.propertyIsEnumerable, ib = (r, t, e) => t in r ? TP(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Nl = (r, t) => {
  for (var e in t || (t = {})) SP.call(t, e) && ib(r, e, t[e]);
  if (sb) for (var e of sb(t)) EP.call(t, e) && ib(r, e, t[e]);
  return r;
};
const Xl = { png: "image/png", jpg: "image/jpeg", webp: "image/webp" }, Hl = class dy {
  constructor(t) {
    this._renderer = t;
  }
  _normalizeOptions(t, e = {}) {
    return t instanceof lt || t instanceof A$1 ? Nl({ target: t }, e) : Nl(Nl({}, e), t);
  }
  async image(t) {
    const e = new Image();
    return e.src = await this.base64(t), e;
  }
  async base64(t) {
    t = this._normalizeOptions(t, dy.defaultImageOptions);
    const { format: e, quality: s } = t, i = this.canvas(t);
    if (i.toBlob !== void 0) return new Promise((n, o) => {
      i.toBlob((a) => {
        if (!a) {
          o(new Error("ICanvas.toBlob failed!"));
          return;
        }
        const l3 = new FileReader();
        l3.onload = () => n(l3.result), l3.onerror = o, l3.readAsDataURL(a);
      }, Xl[e], s);
    });
    if (i.toDataURL !== void 0) return i.toDataURL(Xl[e], s);
    if (i.convertToBlob !== void 0) {
      const n = await i.convertToBlob({ type: Xl[e], quality: s });
      return new Promise((o, a) => {
        const l3 = new FileReader();
        l3.onload = () => o(l3.result), l3.onerror = a, l3.readAsDataURL(n);
      });
    }
    throw new Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented");
  }
  canvas(t) {
    t = this._normalizeOptions(t);
    const e = t.target, s = this._renderer;
    if (e instanceof A$1) return s.texture.generateCanvas(e);
    const i = s.textureGenerator.generateTexture(t), n = s.texture.generateCanvas(i);
    return i.destroy(true), n;
  }
  pixels(t) {
    t = this._normalizeOptions(t);
    const e = t.target, s = this._renderer, i = e instanceof A$1 ? e : s.textureGenerator.generateTexture(t), n = s.texture.getPixels(i);
    return e instanceof lt && i.destroy(true), n;
  }
  texture(t) {
    return t = this._normalizeOptions(t), t.target instanceof A$1 ? t.target : this._renderer.textureGenerator.generateTexture(t);
  }
  download(t) {
    var e;
    t = this._normalizeOptions(t);
    const s = this.canvas(t), i = document.createElement("a");
    i.download = (e = t.filename) != null ? e : "image.png", i.href = s.toDataURL("image/png"), document.body.appendChild(i), i.click(), document.body.removeChild(i);
  }
  log(t) {
    var e;
    const s = (e = t.width) != null ? e : 200;
    t = this._normalizeOptions(t);
    const i = this.canvas(t), n = i.toDataURL();
    console.log(`[Pixi Texture] ${i.width}px ${i.height}px`);
    const o = ["font-size: 1px;", `padding: ${s}px 300px;`, `background: url(${n}) no-repeat;`, "background-size: contain;"].join(" ");
    console.log("%c ", o);
  }
  destroy() {
    this._renderer = null;
  }
};
Hl.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem], name: "extract" }, Hl.defaultImageOptions = { format: "png", quality: 1 };
let nb = Hl;
class rn extends A$1 {
  static create(t) {
    return new rn({ source: new K$1(t) });
  }
  resize(t, e, s) {
    return this.source.resize(t, e, s), this;
  }
}
var AP = Object.defineProperty, wP = Object.defineProperties, PP = Object.getOwnPropertyDescriptors, ob = Object.getOwnPropertySymbols, RP = Object.prototype.hasOwnProperty, MP = Object.prototype.propertyIsEnumerable, ab = (r, t, e) => t in r ? AP(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, CP = (r, t) => {
  for (var e in t || (t = {})) RP.call(t, e) && ab(r, e, t[e]);
  if (ob) for (var e of ob(t)) MP.call(t, e) && ab(r, e, t[e]);
  return r;
}, OP = (r, t) => wP(r, PP(t));
const GP = new j$1(), IP = new st$1(), BP = [0, 0, 0, 0];
class jl {
  constructor(t) {
    this._renderer = t;
  }
  generateTexture(t) {
    var e;
    t instanceof lt && (t = { target: t, frame: void 0, textureSourceOptions: {}, resolution: void 0 });
    const s = t.resolution || this._renderer.resolution, i = t.antialias || this._renderer.view.antialias, n = t.target;
    let o = t.clearColor;
    o ? o = Array.isArray(o) && o.length === 4 ? o : X.shared.setValue(o).toArray() : o = BP;
    const a = ((e = t.frame) == null ? void 0 : e.copyTo(GP)) || xs(n, IP).rectangle;
    a.width = Math.max(a.width, 1 / s) | 0, a.height = Math.max(a.height, 1 / s) | 0;
    const l3 = rn.create(OP(CP({}, t.textureSourceOptions), { width: a.width, height: a.height, resolution: s, antialias: i })), u3 = R$1.shared.translate(-a.x, -a.y);
    return this._renderer.render({ container: n, transform: u3, target: l3, clearColor: o }), l3.source.updateMipmaps(), l3;
  }
  destroy() {
    this._renderer = null;
  }
}
jl.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem], name: "textureGenerator" };
class zl {
  constructor(t) {
    this._stackIndex = 0, this._globalUniformDataStack = [], this._uniformsPool = [], this._activeUniforms = [], this._bindGroupPool = [], this._activeBindGroups = [], this._renderer = t;
  }
  reset() {
    this._stackIndex = 0;
    for (let t = 0; t < this._activeUniforms.length; t++) this._uniformsPool.push(this._activeUniforms[t]);
    for (let t = 0; t < this._activeBindGroups.length; t++) this._bindGroupPool.push(this._activeBindGroups[t]);
    this._activeUniforms.length = 0, this._activeBindGroups.length = 0;
  }
  start(t) {
    this.reset(), this.push(t);
  }
  bind({ size: t, projectionMatrix: e, worldTransformMatrix: s, worldColor: i, offset: n }) {
    const o = this._renderer.renderTarget.renderTarget, a = this._stackIndex ? this._globalUniformDataStack[this._stackIndex - 1] : { projectionData: o, worldTransformMatrix: new R$1(), worldColor: 4294967295, offset: new z$1() }, l3 = { projectionMatrix: e || this._renderer.renderTarget.projectionMatrix, resolution: t || o.size, worldTransformMatrix: s || a.worldTransformMatrix, worldColor: i || a.worldColor, offset: n || a.offset, bindGroup: null }, u3 = this._uniformsPool.pop() || this._createUniforms();
    this._activeUniforms.push(u3);
    const c = u3.uniforms;
    c.uProjectionMatrix = l3.projectionMatrix, c.uResolution = l3.resolution, c.uWorldTransformMatrix.copyFrom(l3.worldTransformMatrix), c.uWorldTransformMatrix.tx -= l3.offset.x, c.uWorldTransformMatrix.ty -= l3.offset.y, Ve(l3.worldColor, c.uWorldColorAlpha, 0), u3.update();
    let h;
    this._renderer.renderPipes.uniformBatch ? h = this._renderer.renderPipes.uniformBatch.getUniformBindGroup(u3, false) : (h = this._bindGroupPool.pop() || new Xt(), this._activeBindGroups.push(h), h.setResource(u3, 0)), l3.bindGroup = h, this._currentGlobalUniformData = l3;
  }
  push(t) {
    this.bind(t), this._globalUniformDataStack[this._stackIndex++] = this._currentGlobalUniformData;
  }
  pop() {
    this._currentGlobalUniformData = this._globalUniformDataStack[--this._stackIndex - 1], this._renderer.type === mt$1.WEBGL && this._currentGlobalUniformData.bindGroup.resources[0].update();
  }
  get bindGroup() {
    return this._currentGlobalUniformData.bindGroup;
  }
  get globalUniformData() {
    return this._currentGlobalUniformData;
  }
  get uniformGroup() {
    return this._currentGlobalUniformData.bindGroup.resources[0];
  }
  _createUniforms() {
    return new et$1({ uProjectionMatrix: { value: new R$1(), type: "mat3x3<f32>" }, uWorldTransformMatrix: { value: new R$1(), type: "mat3x3<f32>" }, uWorldColorAlpha: { value: new Float32Array(4), type: "vec4<f32>" }, uResolution: { value: [0, 0], type: "vec2<f32>" } }, { isStatic: true });
  }
  destroy() {
    this._renderer = null;
  }
}
zl.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem, x$1.CanvasSystem], name: "globalUniforms" };
let FP = 1;
class Vl {
  constructor() {
    this._tasks = [], this._offset = 0;
  }
  init() {
    at.system.add(this._update, this);
  }
  repeat(t, e, s = true) {
    const i = FP++;
    let n = 0;
    return s && (this._offset += 1e3, n = this._offset), this._tasks.push({ func: t, duration: e, start: performance.now(), offset: n, last: performance.now(), repeat: true, id: i }), i;
  }
  cancel(t) {
    for (let e = 0; e < this._tasks.length; e++) if (this._tasks[e].id === t) {
      this._tasks.splice(e, 1);
      return;
    }
  }
  _update() {
    const t = performance.now();
    for (let e = 0; e < this._tasks.length; e++) {
      const s = this._tasks[e];
      if (t - s.offset - s.last >= s.duration) {
        const i = t - s.start;
        s.func(i), s.last = t;
      }
    }
  }
  destroy() {
    at.system.remove(this._update, this), this._tasks.length = 0;
  }
}
Vl.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem, x$1.CanvasSystem], name: "scheduler", priority: 0 };
let lb = false;
function ub(r) {
  if (!lb) {
    if (L.get().getNavigator().userAgent.toLowerCase().indexOf("chrome") > -1) {
      const t = [`%c  %c  %c  %c  %c PixiJS %c v${Wr} (${r}) http://www.pixijs.com/

`, "background: #E72264; padding:5px 0;", "background: #6CA2EA; padding:5px 0;", "background: #B5D33D; padding:5px 0;", "background: #FED23F; padding:5px 0;", "color: #FFFFFF; background: #E72264; padding:5px 0;", "color: #E72264; background: #FFFFFF; padding:5px 0;"];
      globalThis.console.log(...t);
    } else globalThis.console && globalThis.console.log(`PixiJS ${Wr} - ${r} - http://www.pixijs.com/`);
    lb = true;
  }
}
class Xi {
  constructor(t) {
    this._renderer = t;
  }
  init(t) {
    if (t.hello) {
      let e = this._renderer.name;
      this._renderer.type === mt$1.WEBGL && (e += ` ${this._renderer.context.webGLVersion}`), ub(e);
    }
  }
}
Xi.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem, x$1.CanvasSystem], name: "hello", priority: -2 }, Xi.defaultOptions = { hello: false };
function cb(r) {
  let t = false;
  for (const s in r) if (r[s] == null) {
    t = true;
    break;
  }
  if (!t) return r;
  const e = /* @__PURE__ */ Object.create(null);
  for (const s in r) {
    const i = r[s];
    i && (e[s] = i);
  }
  return e;
}
function hb(r) {
  let t = 0;
  for (let e = 0; e < r.length; e++) r[e] == null ? t++ : r[e - t] = r[e];
  return r.length -= t, r;
}
var DP = Object.defineProperty, db = Object.getOwnPropertySymbols, UP = Object.prototype.hasOwnProperty, kP = Object.prototype.propertyIsEnumerable, pb = (r, t, e) => t in r ? DP(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, fb = (r, t) => {
  for (var e in t || (t = {})) UP.call(t, e) && pb(r, e, t[e]);
  if (db) for (var e of db(t)) kP.call(t, e) && pb(r, e, t[e]);
  return r;
};
let $P = 0;
const Wl = class py {
  constructor(t) {
    this._managedRenderables = [], this._managedHashes = [], this._managedArrays = [], this._renderer = t;
  }
  init(t) {
    t = fb(fb({}, py.defaultOptions), t), this.maxUnusedTime = t.renderableGCMaxUnusedTime, this._frequency = t.renderableGCFrequency, this.enabled = t.renderableGCActive;
  }
  get enabled() {
    return !!this._handler;
  }
  set enabled(t) {
    this.enabled !== t && (t ? (this._handler = this._renderer.scheduler.repeat(() => this.run(), this._frequency, false), this._hashHandler = this._renderer.scheduler.repeat(() => {
      for (const e of this._managedHashes) e.context[e.hash] = cb(e.context[e.hash]);
    }, this._frequency), this._arrayHandler = this._renderer.scheduler.repeat(() => {
      for (const e of this._managedArrays) hb(e.context[e.hash]);
    }, this._frequency)) : (this._renderer.scheduler.cancel(this._handler), this._renderer.scheduler.cancel(this._hashHandler), this._renderer.scheduler.cancel(this._arrayHandler)));
  }
  addManagedHash(t, e) {
    this._managedHashes.push({ context: t, hash: e });
  }
  addManagedArray(t, e) {
    this._managedArrays.push({ context: t, hash: e });
  }
  prerender({ container: t }) {
    this._now = performance.now(), t.renderGroup.gcTick = $P++, this._updateInstructionGCTick(t.renderGroup, t.renderGroup.gcTick);
  }
  addRenderable(t) {
    this.enabled && (t._lastUsed === -1 && (this._managedRenderables.push(t), t.once("destroyed", this._removeRenderable, this)), t._lastUsed = this._now);
  }
  run() {
    var t, e, s, i;
    const n = this._now, o = this._managedRenderables, a = this._renderer.renderPipes;
    let l3 = 0;
    for (let u3 = 0; u3 < o.length; u3++) {
      const c = o[u3];
      if (c === null) {
        l3++;
        continue;
      }
      const h = (t = c.renderGroup) != null ? t : c.parentRenderGroup, d = (s = (e = h == null ? void 0 : h.instructionSet) == null ? void 0 : e.gcTick) != null ? s : -1;
      if (((i = h == null ? void 0 : h.gcTick) != null ? i : 0) === d && (c._lastUsed = n), n - c._lastUsed > this.maxUnusedTime) {
        if (!c.destroyed) {
          const p = a;
          h && (h.structureDidChange = true), p[c.renderPipeId].destroyRenderable(c);
        }
        c._lastUsed = -1, l3++, c.off("destroyed", this._removeRenderable, this);
      } else o[u3 - l3] = c;
    }
    o.length -= l3;
  }
  destroy() {
    this.enabled = false, this._renderer = null, this._managedRenderables.length = 0, this._managedHashes.length = 0, this._managedArrays.length = 0;
  }
  _removeRenderable(t) {
    const e = this._managedRenderables.indexOf(t);
    e >= 0 && (t.off("destroyed", this._removeRenderable, this), this._managedRenderables[e] = null);
  }
  _updateInstructionGCTick(t, e) {
    t.instructionSet.gcTick = e;
    for (const s of t.renderGroupChildren) this._updateInstructionGCTick(s, e);
  }
};
Wl.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem], name: "renderableGC", priority: 0 }, Wl.defaultOptions = { renderableGCActive: true, renderableGCMaxUnusedTime: 6e4, renderableGCFrequency: 3e4 };
let mb = Wl;
var LP = Object.defineProperty, gb = Object.getOwnPropertySymbols, NP = Object.prototype.hasOwnProperty, XP = Object.prototype.propertyIsEnumerable, _b = (r, t, e) => t in r ? LP(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, xb = (r, t) => {
  for (var e in t || (t = {})) NP.call(t, e) && _b(r, e, t[e]);
  if (gb) for (var e of gb(t)) XP.call(t, e) && _b(r, e, t[e]);
  return r;
};
const Yl = class fy {
  constructor(t) {
    this._renderer = t, this.count = 0, this.checkCount = 0;
  }
  init(t) {
    var e;
    t = xb(xb({}, fy.defaultOptions), t), this.checkCountMax = t.textureGCCheckCountMax, this.maxIdle = (e = t.textureGCAMaxIdle) != null ? e : t.textureGCMaxIdle, this.active = t.textureGCActive;
  }
  postrender() {
    this._renderer.renderingToScreen && (this.count++, this.active && (this.checkCount++, this.checkCount > this.checkCountMax && (this.checkCount = 0, this.run())));
  }
  run() {
    const t = this._renderer.texture.managedTextures;
    for (let e = 0; e < t.length; e++) {
      const s = t[e];
      s.autoGarbageCollect && s.resource && s._touched > -1 && this.count - s._touched > this.maxIdle && (s._touched = -1, s.unload());
    }
  }
  destroy() {
    this._renderer = null;
  }
};
Yl.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem], name: "textureGC" }, Yl.defaultOptions = { textureGCActive: true, textureGCAMaxIdle: null, textureGCMaxIdle: 60 * 60, textureGCCheckCountMax: 600 };
let bb = Yl;
var HP = Object.defineProperty, vb = Object.getOwnPropertySymbols, jP = Object.prototype.hasOwnProperty, zP = Object.prototype.propertyIsEnumerable, yb = (r, t, e) => t in r ? HP(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Tb = (r, t) => {
  for (var e in t || (t = {})) jP.call(t, e) && yb(r, e, t[e]);
  if (vb) for (var e of vb(t)) zP.call(t, e) && yb(r, e, t[e]);
  return r;
};
const Kl = class my {
  get autoDensity() {
    return this.texture.source.autoDensity;
  }
  set autoDensity(t) {
    this.texture.source.autoDensity = t;
  }
  get resolution() {
    return this.texture.source._resolution;
  }
  set resolution(t) {
    this.texture.source.resize(this.texture.source.width, this.texture.source.height, t);
  }
  init(t) {
    t = Tb(Tb({}, my.defaultOptions), t), t.view && (t.canvas = t.view), this.screen = new j$1(0, 0, t.width, t.height), this.canvas = t.canvas || L.get().createCanvas(), this.antialias = !!t.antialias, this.texture = xl(this.canvas, t), this.renderTarget = new Fi({ colorTextures: [this.texture], depth: !!t.depth, isRoot: true }), this.texture.source.transparent = t.backgroundAlpha < 1, this.resolution = t.resolution;
  }
  resize(t, e, s) {
    this.texture.source.resize(t, e, s), this.screen.width = this.texture.frame.width, this.screen.height = this.texture.frame.height;
  }
  destroy(t = false) {
    (typeof t == "boolean" ? t : t != null && t.removeView) && this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
  }
};
Kl.extension = { type: [x$1.WebGLSystem, x$1.WebGPUSystem, x$1.CanvasSystem], name: "view", priority: 0 }, Kl.defaultOptions = { width: 800, height: 600, autoDensity: false, antialias: false };
let Sb = Kl;
const ql = [rb, zl, Xi, Sb, Ul, bb, jl, nb, xa, mb, Vl], Zl = [Ll, Ja, kl, Bl, tl, rl, el, Il], VP = [...ql, _l, nx, Q_, hl, sl, Cl, vl, al, wl, Al, cl, Ux, dl, ul], WP = [...Zl], YP = [qa, Gl, Ol], Eb = [], Ab = [], wb = [];
G$1.handleByNamedList(x$1.WebGLSystem, Eb), G$1.handleByNamedList(x$1.WebGLPipes, Ab), G$1.handleByNamedList(x$1.WebGLPipesAdaptor, wb), G$1.add(...VP, ...WP, ...YP);
class Pb extends Hr {
  constructor() {
    const t = { name: "webgl", type: mt$1.WEBGL, systems: Eb, renderPipes: Ab, renderPipeAdaptors: wb };
    super(t);
  }
}
var KP = { __proto__: null, WebGLRenderer: Pb };
class Ql {
  constructor(t) {
    this._hash = /* @__PURE__ */ Object.create(null), this._renderer = t, this._renderer.renderableGC.addManagedHash(this, "_hash");
  }
  contextChange(t) {
    this._gpu = t;
  }
  getBindGroup(t, e, s) {
    return t._updateKey(), this._hash[t._key] || this._createBindGroup(t, e, s);
  }
  _createBindGroup(t, e, s) {
    var i;
    const n = this._gpu.device, o = e.layout[s], a = [], l3 = this._renderer;
    for (const h in o) {
      const d = (i = t.resources[h]) != null ? i : t.resources[o[h]];
      let p;
      if (d._resourceType === "uniformGroup") {
        const f2 = d;
        l3.ubo.updateUniformGroup(f2);
        const g = f2.buffer;
        p = { buffer: l3.buffer.getGPUBuffer(g), offset: 0, size: g.descriptor.size };
      } else if (d._resourceType === "buffer") {
        const f2 = d;
        p = { buffer: l3.buffer.getGPUBuffer(f2), offset: 0, size: f2.descriptor.size };
      } else if (d._resourceType === "bufferResource") {
        const f2 = d;
        p = { buffer: l3.buffer.getGPUBuffer(f2.buffer), offset: f2.offset, size: f2.size };
      } else if (d._resourceType === "textureSampler") {
        const f2 = d;
        p = l3.texture.getGpuSampler(f2);
      } else if (d._resourceType === "textureSource") {
        const f2 = d;
        p = l3.texture.getGpuSource(f2).createView({});
      }
      a.push({ binding: o[h], resource: p });
    }
    const u3 = l3.shader.getProgramData(e).bindGroups[s], c = n.createBindGroup({ layout: u3, entries: a });
    return this._hash[t._key] = c, c;
  }
  destroy() {
    for (const t of Object.keys(this._hash)) this._hash[t] = null;
    this._hash = null, this._renderer = null;
  }
}
Ql.extension = { type: [x$1.WebGPUSystem], name: "bindGroup" };
class Jl {
  constructor(t) {
    this._gpuBuffers = /* @__PURE__ */ Object.create(null), this._managedBuffers = [], t.renderableGC.addManagedHash(this, "_gpuBuffers");
  }
  contextChange(t) {
    this._gpu = t;
  }
  getGPUBuffer(t) {
    return this._gpuBuffers[t.uid] || this.createGPUBuffer(t);
  }
  updateBuffer(t) {
    const e = this._gpuBuffers[t.uid] || this.createGPUBuffer(t), s = t.data;
    return t._updateID && s && (t._updateID = 0, this._gpu.device.queue.writeBuffer(e, 0, s.buffer, 0, (t._updateSize || s.byteLength) + 3 & -4)), e;
  }
  destroyAll() {
    for (const t in this._gpuBuffers) this._gpuBuffers[t].destroy();
    this._gpuBuffers = {};
  }
  createGPUBuffer(t) {
    this._gpuBuffers[t.uid] || (t.on("update", this.updateBuffer, this), t.on("change", this.onBufferChange, this), t.on("destroy", this.onBufferDestroy, this), this._managedBuffers.push(t));
    const e = this._gpu.device.createBuffer(t.descriptor);
    return t._updateID = 0, t.data && (Is(t.data.buffer, e.getMappedRange()), e.unmap()), this._gpuBuffers[t.uid] = e, e;
  }
  onBufferChange(t) {
    this._gpuBuffers[t.uid].destroy(), t._updateID = 0, this._gpuBuffers[t.uid] = this.createGPUBuffer(t);
  }
  onBufferDestroy(t) {
    this._managedBuffers.splice(this._managedBuffers.indexOf(t), 1), this._destroyBuffer(t);
  }
  destroy() {
    this._managedBuffers.forEach((t) => this._destroyBuffer(t)), this._managedBuffers = null, this._gpuBuffers = null;
  }
  _destroyBuffer(t) {
    this._gpuBuffers[t.uid].destroy(), t.off("update", this.updateBuffer, this), t.off("change", this.onBufferChange, this), t.off("destroy", this.onBufferDestroy, this), this._gpuBuffers[t.uid] = null;
  }
}
Jl.extension = { type: [x$1.WebGPUSystem], name: "buffer" };
class Rb {
  constructor({ minUniformOffsetAlignment: t }) {
    this._minUniformOffsetAlignment = 256, this.byteIndex = 0, this._minUniformOffsetAlignment = t, this.data = new Float32Array(65535);
  }
  clear() {
    this.byteIndex = 0;
  }
  addEmptyGroup(t) {
    if (t > this._minUniformOffsetAlignment / 4) throw new Error(`UniformBufferBatch: array is too large: ${t * 4}`);
    const e = this.byteIndex;
    let s = e + t * 4;
    if (s = Math.ceil(s / this._minUniformOffsetAlignment) * this._minUniformOffsetAlignment, s > this.data.length * 4) throw new Error("UniformBufferBatch: ubo batch got too big");
    return this.byteIndex = s, e;
  }
  addGroup(t) {
    const e = this.addEmptyGroup(t.length);
    for (let s = 0; s < t.length; s++) this.data[e / 4 + s] = t[s];
    return e;
  }
  destroy() {
    this.data = null;
  }
}
class tu {
  constructor(t) {
    this._colorMaskCache = 15, this._renderer = t;
  }
  setMask(t) {
    this._colorMaskCache !== t && (this._colorMaskCache = t, this._renderer.pipeline.setColorMask(t));
  }
  destroy() {
    this._renderer = null, this._colorMaskCache = null;
  }
}
tu.extension = { type: [x$1.WebGPUSystem], name: "colorMask" };
class Hi {
  constructor(t) {
    this._renderer = t;
  }
  async init(t) {
    return this._initPromise ? this._initPromise : (this._initPromise = this._createDeviceAndAdaptor(t).then((e) => {
      this.gpu = e, this._renderer.runners.contextChange.emit(this.gpu);
    }), this._initPromise);
  }
  contextChange(t) {
    this._renderer.gpu = t;
  }
  async _createDeviceAndAdaptor(t) {
    const e = await L.get().getNavigator().gpu.requestAdapter({ powerPreference: t.powerPreference, forceFallbackAdapter: t.forceFallbackAdapter }), s = ["texture-compression-bc", "texture-compression-astc", "texture-compression-etc2"].filter((n) => e.features.has(n)), i = await e.requestDevice({ requiredFeatures: s });
    return { adapter: e, device: i };
  }
  destroy() {
    this.gpu = null, this._renderer = null;
  }
}
Hi.extension = { type: [x$1.WebGPUSystem], name: "device" }, Hi.defaultOptions = { powerPreference: void 0, forceFallbackAdapter: false };
var qP = Object.defineProperty, Mb = Object.getOwnPropertySymbols, ZP = Object.prototype.hasOwnProperty, QP = Object.prototype.propertyIsEnumerable, Cb = (r, t, e) => t in r ? qP(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Ob = (r, t) => {
  for (var e in t || (t = {})) ZP.call(t, e) && Cb(r, e, t[e]);
  if (Mb) for (var e of Mb(t)) QP.call(t, e) && Cb(r, e, t[e]);
  return r;
};
class eu {
  constructor(t) {
    this._boundBindGroup = /* @__PURE__ */ Object.create(null), this._boundVertexBuffer = /* @__PURE__ */ Object.create(null), this._renderer = t;
  }
  renderStart() {
    this.commandFinished = new Promise((t) => {
      this._resolveCommandFinished = t;
    }), this.commandEncoder = this._renderer.gpu.device.createCommandEncoder();
  }
  beginRenderPass(t) {
    this.endRenderPass(), this._clearCache(), this.renderPassEncoder = this.commandEncoder.beginRenderPass(t.descriptor);
  }
  endRenderPass() {
    this.renderPassEncoder && this.renderPassEncoder.end(), this.renderPassEncoder = null;
  }
  setViewport(t) {
    this.renderPassEncoder.setViewport(t.x, t.y, t.width, t.height, 0, 1);
  }
  setPipelineFromGeometryProgramAndState(t, e, s, i) {
    const n = this._renderer.pipeline.getPipeline(t, e, s, i);
    this.setPipeline(n);
  }
  setPipeline(t) {
    this._boundPipeline !== t && (this._boundPipeline = t, this.renderPassEncoder.setPipeline(t));
  }
  _setVertexBuffer(t, e) {
    this._boundVertexBuffer[t] !== e && (this._boundVertexBuffer[t] = e, this.renderPassEncoder.setVertexBuffer(t, this._renderer.buffer.updateBuffer(e)));
  }
  _setIndexBuffer(t) {
    if (this._boundIndexBuffer === t) return;
    this._boundIndexBuffer = t;
    const e = t.data.BYTES_PER_ELEMENT === 2 ? "uint16" : "uint32";
    this.renderPassEncoder.setIndexBuffer(this._renderer.buffer.updateBuffer(t), e);
  }
  resetBindGroup(t) {
    this._boundBindGroup[t] = null;
  }
  setBindGroup(t, e, s) {
    if (this._boundBindGroup[t] === e) return;
    this._boundBindGroup[t] = e, e._touch(this._renderer.textureGC.count);
    const i = this._renderer.bindGroup.getBindGroup(e, s, t);
    this.renderPassEncoder.setBindGroup(t, i);
  }
  setGeometry(t, e) {
    const s = this._renderer.pipeline.getBufferNamesToBind(t, e);
    for (const i in s) this._setVertexBuffer(i, t.attributes[s[i]].buffer);
    t.indexBuffer && this._setIndexBuffer(t.indexBuffer);
  }
  _setShaderBindGroups(t, e) {
    for (const s in t.groups) {
      const i = t.groups[s];
      e || this._syncBindGroup(i), this.setBindGroup(s, i, t.gpuProgram);
    }
  }
  _syncBindGroup(t) {
    for (const e in t.resources) {
      const s = t.resources[e];
      s.isUniformGroup && this._renderer.ubo.updateUniformGroup(s);
    }
  }
  draw(t) {
    const { geometry: e, shader: s, state: i, topology: n, size: o, start: a, instanceCount: l3, skipSync: u3 } = t;
    this.setPipelineFromGeometryProgramAndState(e, s.gpuProgram, i, n), this.setGeometry(e, s.gpuProgram), this._setShaderBindGroups(s, u3), e.indexBuffer ? this.renderPassEncoder.drawIndexed(o || e.indexBuffer.data.length, l3 != null ? l3 : e.instanceCount, a || 0) : this.renderPassEncoder.draw(o || e.getSize(), l3 != null ? l3 : e.instanceCount, a || 0);
  }
  finishRenderPass() {
    this.renderPassEncoder && (this.renderPassEncoder.end(), this.renderPassEncoder = null);
  }
  postrender() {
    this.finishRenderPass(), this._gpu.device.queue.submit([this.commandEncoder.finish()]), this._resolveCommandFinished(), this.commandEncoder = null;
  }
  restoreRenderPass() {
    const t = this._renderer.renderTarget.adaptor.getDescriptor(this._renderer.renderTarget.renderTarget, false, [0, 0, 0, 1]);
    this.renderPassEncoder = this.commandEncoder.beginRenderPass(t);
    const e = this._boundPipeline, s = Ob({}, this._boundVertexBuffer), i = this._boundIndexBuffer, n = Ob({}, this._boundBindGroup);
    this._clearCache();
    const o = this._renderer.renderTarget.viewport;
    this.renderPassEncoder.setViewport(o.x, o.y, o.width, o.height, 0, 1), this.setPipeline(e);
    for (const a in s) this._setVertexBuffer(a, s[a]);
    for (const a in n) this.setBindGroup(a, n[a], null);
    this._setIndexBuffer(i);
  }
  _clearCache() {
    for (let t = 0; t < 16; t++) this._boundBindGroup[t] = null, this._boundVertexBuffer[t] = null;
    this._boundIndexBuffer = null, this._boundPipeline = null;
  }
  destroy() {
    this._renderer = null, this._gpu = null, this._boundBindGroup = null, this._boundVertexBuffer = null, this._boundIndexBuffer = null, this._boundPipeline = null;
  }
  contextChange(t) {
    this._gpu = t;
  }
}
eu.extension = { type: [x$1.WebGPUSystem], name: "encoder", priority: 1 };
class ru {
  constructor(t) {
    this._renderer = t;
  }
  contextChange() {
    this.maxTextures = this._renderer.device.gpu.device.limits.maxSampledTexturesPerShaderStage, this.maxBatchableTextures = this.maxTextures;
  }
  destroy() {
  }
}
ru.extension = { type: [x$1.WebGPUSystem], name: "limits" };
class su {
  constructor(t) {
    this._renderTargetStencilState = /* @__PURE__ */ Object.create(null), this._renderer = t, t.renderTarget.onRenderTargetChange.add(this);
  }
  onRenderTargetChange(t) {
    let e = this._renderTargetStencilState[t.uid];
    e || (e = this._renderTargetStencilState[t.uid] = { stencilMode: Q$1.DISABLED, stencilReference: 0 }), this._activeRenderTarget = t, this.setStencilMode(e.stencilMode, e.stencilReference);
  }
  setStencilMode(t, e) {
    const s = this._renderTargetStencilState[this._activeRenderTarget.uid];
    s.stencilMode = t, s.stencilReference = e;
    const i = this._renderer;
    i.pipeline.setStencilMode(t), i.encoder.renderPassEncoder.setStencilReference(e);
  }
  destroy() {
    this._renderer.renderTarget.onRenderTargetChange.remove(this), this._renderer = null, this._activeRenderTarget = null, this._renderTargetStencilState = null;
  }
}
su.extension = { type: [x$1.WebGPUSystem], name: "stencil" };
const ss = { i32: { align: 4, size: 4 }, u32: { align: 4, size: 4 }, f32: { align: 4, size: 4 }, f16: { align: 2, size: 2 }, "vec2<i32>": { align: 8, size: 8 }, "vec2<u32>": { align: 8, size: 8 }, "vec2<f32>": { align: 8, size: 8 }, "vec2<f16>": { align: 4, size: 4 }, "vec3<i32>": { align: 16, size: 12 }, "vec3<u32>": { align: 16, size: 12 }, "vec3<f32>": { align: 16, size: 12 }, "vec3<f16>": { align: 8, size: 6 }, "vec4<i32>": { align: 16, size: 16 }, "vec4<u32>": { align: 16, size: 16 }, "vec4<f32>": { align: 16, size: 16 }, "vec4<f16>": { align: 8, size: 8 }, "mat2x2<f32>": { align: 8, size: 16 }, "mat2x2<f16>": { align: 4, size: 8 }, "mat3x2<f32>": { align: 8, size: 24 }, "mat3x2<f16>": { align: 4, size: 12 }, "mat4x2<f32>": { align: 8, size: 32 }, "mat4x2<f16>": { align: 4, size: 16 }, "mat2x3<f32>": { align: 16, size: 32 }, "mat2x3<f16>": { align: 8, size: 16 }, "mat3x3<f32>": { align: 16, size: 48 }, "mat3x3<f16>": { align: 8, size: 24 }, "mat4x3<f32>": { align: 16, size: 64 }, "mat4x3<f16>": { align: 8, size: 32 }, "mat2x4<f32>": { align: 16, size: 32 }, "mat2x4<f16>": { align: 8, size: 16 }, "mat3x4<f32>": { align: 16, size: 48 }, "mat3x4<f16>": { align: 8, size: 24 }, "mat4x4<f32>": { align: 16, size: 64 }, "mat4x4<f16>": { align: 8, size: 32 } };
function Gb(r) {
  const t = r.map((s) => ({ data: s, offset: 0, size: 0 }));
  let e = 0;
  for (let s = 0; s < t.length; s++) {
    const i = t[s];
    let n = ss[i.data.type].size;
    const o = ss[i.data.type].align;
    if (!ss[i.data.type]) throw new Error(`[Pixi.js] WebGPU UniformBuffer: Unknown type ${i.data.type}`);
    i.data.size > 1 && (n = Math.max(n, o) * i.data.size), e = Math.ceil(e / o) * o, i.size = n, i.offset = e, e += n;
  }
  return e = Math.ceil(e / 16) * 16, { uboElements: t, size: e };
}
function Ib(r, t) {
  const { size: e, align: s } = ss[r.data.type], i = (s - e) / 4, n = r.data.type.indexOf("i32") >= 0 ? "dataInt32" : "data";
  return `
v = uv.${r.data.name};
${t !== 0 ? `offset += ${t};` : ""}

arrayOffset = offset;

t = 0;

for(var i=0; i < ${r.data.size * (e / 4)}; i++)
{
for(var j = 0; j < ${e / 4}; j++)
{
${n}[arrayOffset++] = v[t++];
}
${i !== 0 ? `arrayOffset += ${i};` : ""}
}
`;
}
function Bb(r) {
  return ml(r, "uboWgsl", Ib, cx);
}
class iu extends pl {
  constructor() {
    super({ createUboElements: Gb, generateUboSync: Bb });
  }
}
iu.extension = { type: [x$1.WebGPUSystem], name: "ubo" };
const ue = 128;
class nu {
  constructor(t) {
    this._bindGroupHash = /* @__PURE__ */ Object.create(null), this._buffers = [], this._bindGroups = [], this._bufferResources = [], this._renderer = t, this._renderer.renderableGC.addManagedHash(this, "_bindGroupHash"), this._batchBuffer = new Rb({ minUniformOffsetAlignment: ue });
    const e = 256 / ue;
    for (let s = 0; s < e; s++) {
      let i = N$1.UNIFORM | N$1.COPY_DST;
      s === 0 && (i |= N$1.COPY_SRC), this._buffers.push(new ft({ data: this._batchBuffer.data, usage: i }));
    }
  }
  renderEnd() {
    this._uploadBindGroups(), this._resetBindGroups();
  }
  _resetBindGroups() {
    for (const t in this._bindGroupHash) this._bindGroupHash[t] = null;
    this._batchBuffer.clear();
  }
  getUniformBindGroup(t, e) {
    if (!e && this._bindGroupHash[t.uid]) return this._bindGroupHash[t.uid];
    this._renderer.ubo.ensureUniformGroup(t);
    const s = t.buffer.data, i = this._batchBuffer.addEmptyGroup(s.length);
    return this._renderer.ubo.syncUniformGroup(t, this._batchBuffer.data, i / 4), this._bindGroupHash[t.uid] = this._getBindGroup(i / ue), this._bindGroupHash[t.uid];
  }
  getUboResource(t) {
    this._renderer.ubo.updateUniformGroup(t);
    const e = t.buffer.data, s = this._batchBuffer.addGroup(e);
    return this._getBufferResource(s / ue);
  }
  getArrayBindGroup(t) {
    const e = this._batchBuffer.addGroup(t);
    return this._getBindGroup(e / ue);
  }
  getArrayBufferResource(t) {
    const e = this._batchBuffer.addGroup(t) / ue;
    return this._getBufferResource(e);
  }
  _getBufferResource(t) {
    if (!this._bufferResources[t]) {
      const e = this._buffers[t % 2];
      this._bufferResources[t] = new Di({ buffer: e, offset: (t / 2 | 0) * 256, size: ue });
    }
    return this._bufferResources[t];
  }
  _getBindGroup(t) {
    if (!this._bindGroups[t]) {
      const e = new Xt({ 0: this._getBufferResource(t) });
      this._bindGroups[t] = e;
    }
    return this._bindGroups[t];
  }
  _uploadBindGroups() {
    const t = this._renderer.buffer, e = this._buffers[0];
    e.update(this._batchBuffer.byteIndex), t.updateBuffer(e);
    const s = this._renderer.gpu.device.createCommandEncoder();
    for (let i = 1; i < this._buffers.length; i++) {
      const n = this._buffers[i];
      s.copyBufferToBuffer(t.getGPUBuffer(e), ue, t.getGPUBuffer(n), 0, this._batchBuffer.byteIndex);
    }
    this._renderer.gpu.device.queue.submit([s.finish()]);
  }
  destroy() {
    for (let t = 0; t < this._bindGroups.length; t++) this._bindGroups[t].destroy();
    this._bindGroups = null, this._bindGroupHash = null;
    for (let t = 0; t < this._buffers.length; t++) this._buffers[t].destroy();
    this._buffers = null;
    for (let t = 0; t < this._bufferResources.length; t++) this._bufferResources[t].destroy();
    this._bufferResources = null, this._batchBuffer.destroy(), this._bindGroupHash = null, this._renderer = null;
  }
}
nu.extension = { type: [x$1.WebGPUPipes], name: "uniformBatch" };
var JP = Object.defineProperty, tR = Object.defineProperties, eR = Object.getOwnPropertyDescriptors, Fb = Object.getOwnPropertySymbols, rR = Object.prototype.hasOwnProperty, sR = Object.prototype.propertyIsEnumerable, Db = (r, t, e) => t in r ? JP(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, iR = (r, t) => {
  for (var e in t || (t = {})) rR.call(t, e) && Db(r, e, t[e]);
  if (Fb) for (var e of Fb(t)) sR.call(t, e) && Db(r, e, t[e]);
  return r;
}, nR = (r, t) => tR(r, eR(t));
const oR = { "point-list": 0, "line-list": 1, "line-strip": 2, "triangle-list": 3, "triangle-strip": 4 };
function aR(r, t, e, s, i) {
  return r << 24 | t << 16 | e << 10 | s << 5 | i;
}
function lR(r, t, e, s) {
  return e << 6 | r << 3 | s << 1 | t;
}
class ou {
  constructor(t) {
    this._moduleCache = /* @__PURE__ */ Object.create(null), this._bufferLayoutsCache = /* @__PURE__ */ Object.create(null), this._bindingNamesCache = /* @__PURE__ */ Object.create(null), this._pipeCache = /* @__PURE__ */ Object.create(null), this._pipeStateCaches = /* @__PURE__ */ Object.create(null), this._colorMask = 15, this._multisampleCount = 1, this._renderer = t;
  }
  contextChange(t) {
    this._gpu = t, this.setStencilMode(Q$1.DISABLED), this._updatePipeHash();
  }
  setMultisampleCount(t) {
    this._multisampleCount !== t && (this._multisampleCount = t, this._updatePipeHash());
  }
  setRenderTarget(t) {
    this._multisampleCount = t.msaaSamples, this._depthStencilAttachment = t.descriptor.depthStencilAttachment ? 1 : 0, this._updatePipeHash();
  }
  setColorMask(t) {
    this._colorMask !== t && (this._colorMask = t, this._updatePipeHash());
  }
  setStencilMode(t) {
    this._stencilMode !== t && (this._stencilMode = t, this._stencilState = ee[t], this._updatePipeHash());
  }
  setPipeline(t, e, s, i) {
    const n = this.getPipeline(t, e, s);
    i.setPipeline(n);
  }
  getPipeline(t, e, s, i) {
    t._layoutKey || (nl(t, e.attributeData), this._generateBufferKey(t)), i || (i = t.topology);
    const n = aR(t._layoutKey, e._layoutKey, s.data, s._blendModeId, oR[i]);
    return this._pipeCache[n] ? this._pipeCache[n] : (this._pipeCache[n] = this._createPipeline(t, e, s, i), this._pipeCache[n]);
  }
  _createPipeline(t, e, s, i) {
    const n = this._gpu.device, o = this._createVertexBufferLayouts(t, e), a = this._renderer.state.getColorTargets(s);
    a[0].writeMask = this._stencilMode === Q$1.RENDERING_MASK_ADD ? 0 : this._colorMask;
    const l3 = this._renderer.shader.getProgramData(e).pipeline, u3 = { vertex: { module: this._getModule(e.vertex.source), entryPoint: e.vertex.entryPoint, buffers: o }, fragment: { module: this._getModule(e.fragment.source), entryPoint: e.fragment.entryPoint, targets: a }, primitive: { topology: i, cullMode: s.cullMode }, layout: l3, multisample: { count: this._multisampleCount }, label: "PIXI Pipeline" };
    return this._depthStencilAttachment && (u3.depthStencil = nR(iR({}, this._stencilState), { format: "depth24plus-stencil8", depthWriteEnabled: s.depthTest, depthCompare: s.depthTest ? "less" : "always" })), n.createRenderPipeline(u3);
  }
  _getModule(t) {
    return this._moduleCache[t] || this._createModule(t);
  }
  _createModule(t) {
    const e = this._gpu.device;
    return this._moduleCache[t] = e.createShaderModule({ code: t }), this._moduleCache[t];
  }
  _generateBufferKey(t) {
    const e = [];
    let s = 0;
    const i = Object.keys(t.attributes).sort();
    for (let o = 0; o < i.length; o++) {
      const a = t.attributes[i[o]];
      e[s++] = a.offset, e[s++] = a.format, e[s++] = a.stride, e[s++] = a.instance;
    }
    const n = e.join("|");
    return t._layoutKey = ke(n, "geometry"), t._layoutKey;
  }
  _generateAttributeLocationsKey(t) {
    const e = [];
    let s = 0;
    const i = Object.keys(t.attributeData).sort();
    for (let o = 0; o < i.length; o++) {
      const a = t.attributeData[i[o]];
      e[s++] = a.location;
    }
    const n = e.join("|");
    return t._attributeLocationsKey = ke(n, "programAttributes"), t._attributeLocationsKey;
  }
  getBufferNamesToBind(t, e) {
    const s = t._layoutKey << 16 | e._attributeLocationsKey;
    if (this._bindingNamesCache[s]) return this._bindingNamesCache[s];
    const i = this._createVertexBufferLayouts(t, e), n = /* @__PURE__ */ Object.create(null), o = e.attributeData;
    for (let a = 0; a < i.length; a++) {
      const l3 = Object.values(i[a].attributes)[0].shaderLocation;
      for (const u3 in o) if (o[u3].location === l3) {
        n[a] = u3;
        break;
      }
    }
    return this._bindingNamesCache[s] = n, n;
  }
  _createVertexBufferLayouts(t, e) {
    e._attributeLocationsKey || this._generateAttributeLocationsKey(e);
    const s = t._layoutKey << 16 | e._attributeLocationsKey;
    if (this._bufferLayoutsCache[s]) return this._bufferLayoutsCache[s];
    const i = [];
    return t.buffers.forEach((n) => {
      var o;
      const a = { arrayStride: 0, stepMode: "vertex", attributes: [] }, l3 = a.attributes;
      for (const u3 in e.attributeData) {
        const c = t.attributes[u3];
        ((o = c.divisor) != null ? o : 1) !== 1 && Ct$1(`Attribute ${u3} has an invalid divisor value of '${c.divisor}'. WebGPU only supports a divisor value of 1`), c.buffer === n && (a.arrayStride = c.stride, a.stepMode = c.instance ? "instance" : "vertex", l3.push({ shaderLocation: e.attributeData[u3].location, offset: c.offset, format: c.format }));
      }
      l3.length && i.push(a);
    }), this._bufferLayoutsCache[s] = i, i;
  }
  _updatePipeHash() {
    const t = lR(this._stencilMode, this._multisampleCount, this._colorMask, this._depthStencilAttachment);
    this._pipeStateCaches[t] || (this._pipeStateCaches[t] = /* @__PURE__ */ Object.create(null)), this._pipeCache = this._pipeStateCaches[t];
  }
  destroy() {
    this._renderer = null, this._bufferLayoutsCache = null;
  }
}
ou.extension = { type: [x$1.WebGPUSystem], name: "pipeline" };
class Ub {
  constructor() {
    this.contexts = [], this.msaaTextures = [], this.msaaSamples = 1;
  }
}
class kb {
  init(t, e) {
    this._renderer = t, this._renderTargetSystem = e;
  }
  copyToTexture(t, e, s, i, n) {
    const o = this._renderer, a = this._getGpuColorTexture(t), l3 = o.texture.getGpuSource(e.source);
    return o.encoder.commandEncoder.copyTextureToTexture({ texture: a, origin: s }, { texture: l3, origin: n }, i), e;
  }
  startRenderPass(t, e = true, s, i) {
    const n = this._renderTargetSystem.getGpuRenderTarget(t), o = this.getDescriptor(t, e, s);
    n.descriptor = o, this._renderer.pipeline.setRenderTarget(n), this._renderer.encoder.beginRenderPass(n), this._renderer.encoder.setViewport(i);
  }
  finishRenderPass() {
    this._renderer.encoder.endRenderPass();
  }
  _getGpuColorTexture(t) {
    const e = this._renderTargetSystem.getGpuRenderTarget(t);
    return e.contexts[0] ? e.contexts[0].getCurrentTexture() : this._renderer.texture.getGpuSource(t.colorTextures[0].source);
  }
  getDescriptor(t, e, s) {
    typeof e == "boolean" && (e = e ? gt.ALL : gt.NONE);
    const i = this._renderTargetSystem, n = i.getGpuRenderTarget(t), o = t.colorTextures.map((l3, u3) => {
      const c = n.contexts[u3];
      let h, d;
      c ? h = c.getCurrentTexture().createView() : h = this._renderer.texture.getGpuSource(l3).createView({ mipLevelCount: 1 }), n.msaaTextures[u3] && (d = h, h = this._renderer.texture.getTextureView(n.msaaTextures[u3]));
      const p = e & gt.COLOR ? "clear" : "load";
      return s != null || (s = i.defaultClearColor), { view: h, resolveTarget: d, clearValue: s, storeOp: "store", loadOp: p };
    });
    let a;
    if ((t.stencil || t.depth) && !t.depthStencilTexture && (t.ensureDepthStencilTexture(), t.depthStencilTexture.source.sampleCount = n.msaa ? 4 : 1), t.depthStencilTexture) {
      const l3 = e & gt.STENCIL ? "clear" : "load", u3 = e & gt.DEPTH ? "clear" : "load";
      a = { view: this._renderer.texture.getGpuSource(t.depthStencilTexture.source).createView(), stencilStoreOp: "store", stencilLoadOp: l3, depthClearValue: 1, depthLoadOp: u3, depthStoreOp: "store" };
    }
    return { colorAttachments: o, depthStencilAttachment: a };
  }
  clear(t, e = true, s, i) {
    if (!e) return;
    const { gpu: n, encoder: o } = this._renderer, a = n.device;
    if (o.commandEncoder === null) {
      const l3 = a.createCommandEncoder(), u3 = this.getDescriptor(t, e, s), c = l3.beginRenderPass(u3);
      c.setViewport(i.x, i.y, i.width, i.height, 0, 1), c.end();
      const h = l3.finish();
      a.queue.submit([h]);
    } else this.startRenderPass(t, e, s, i);
  }
  initGpuRenderTarget(t) {
    t.isRoot = true;
    const e = new Ub();
    return t.colorTextures.forEach((s, i) => {
      if (s instanceof Nt) {
        const n = s.resource.getContext("webgpu"), o = s.transparent ? "premultiplied" : "opaque";
        try {
          n.configure({ device: this._renderer.gpu.device, usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC, format: "bgra8unorm", alphaMode: o });
        } catch (a) {
          console.error(a);
        }
        e.contexts[i] = n;
      }
      if (e.msaa = s.source.antialias, s.source.antialias) {
        const n = new K$1({ width: 0, height: 0, sampleCount: 4 });
        e.msaaTextures[i] = n;
      }
    }), e.msaa && (e.msaaSamples = 4, t.depthStencilTexture && (t.depthStencilTexture.source.sampleCount = 4)), e;
  }
  destroyGpuRenderTarget(t) {
    t.contexts.forEach((e) => {
      e.unconfigure();
    }), t.msaaTextures.forEach((e) => {
      e.destroy();
    }), t.msaaTextures.length = 0, t.contexts.length = 0;
  }
  ensureDepthStencilTexture(t) {
    const e = this._renderTargetSystem.getGpuRenderTarget(t);
    t.depthStencilTexture && e.msaa && (t.depthStencilTexture.source.sampleCount = 4);
  }
  resizeGpuRenderTarget(t) {
    const e = this._renderTargetSystem.getGpuRenderTarget(t);
    e.width = t.width, e.height = t.height, e.msaa && t.colorTextures.forEach((s, i) => {
      const n = e.msaaTextures[i];
      n == null || n.resize(s.source.width, s.source.height, s.source._resolution);
    });
  }
}
class au extends bl {
  constructor(t) {
    super(t), this.adaptor = new kb(), this.adaptor.init(t, this);
  }
}
au.extension = { type: [x$1.WebGPUSystem], name: "renderTarget" };
class lu {
  constructor() {
    this._gpuProgramData = /* @__PURE__ */ Object.create(null);
  }
  contextChange(t) {
    this._gpu = t;
  }
  getProgramData(t) {
    return this._gpuProgramData[t._layoutKey] || this._createGPUProgramData(t);
  }
  _createGPUProgramData(t) {
    const e = this._gpu.device, s = t.gpuLayout.map((n) => e.createBindGroupLayout({ entries: n })), i = { bindGroupLayouts: s };
    return this._gpuProgramData[t._layoutKey] = { bindGroups: s, pipeline: e.createPipelineLayout(i) }, this._gpuProgramData[t._layoutKey];
  }
  destroy() {
    this._gpu = null, this._gpuProgramData = null;
  }
}
lu.extension = { type: [x$1.WebGPUSystem], name: "shader" };
const ht = {};
ht.normal = { alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" }, color: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" } }, ht.add = { alpha: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" }, color: { srcFactor: "one", dstFactor: "one", operation: "add" } }, ht.multiply = { alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" }, color: { srcFactor: "dst", dstFactor: "one-minus-src-alpha", operation: "add" } }, ht.screen = { alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" }, color: { srcFactor: "one", dstFactor: "one-minus-src", operation: "add" } }, ht.overlay = { alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" }, color: { srcFactor: "one", dstFactor: "one-minus-src", operation: "add" } }, ht.none = { alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" }, color: { srcFactor: "zero", dstFactor: "zero", operation: "add" } }, ht["normal-npm"] = { alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" }, color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" } }, ht["add-npm"] = { alpha: { srcFactor: "one", dstFactor: "one", operation: "add" }, color: { srcFactor: "src-alpha", dstFactor: "one", operation: "add" } }, ht["screen-npm"] = { alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" }, color: { srcFactor: "src-alpha", dstFactor: "one-minus-src", operation: "add" } }, ht.erase = { alpha: { srcFactor: "zero", dstFactor: "one-minus-src-alpha", operation: "add" }, color: { srcFactor: "zero", dstFactor: "one-minus-src", operation: "add" } }, ht.min = { alpha: { srcFactor: "one", dstFactor: "one", operation: "min" }, color: { srcFactor: "one", dstFactor: "one", operation: "min" } }, ht.max = { alpha: { srcFactor: "one", dstFactor: "one", operation: "max" }, color: { srcFactor: "one", dstFactor: "one", operation: "max" } };
class uu {
  constructor() {
    this.defaultState = new Tt(), this.defaultState.blend = true;
  }
  contextChange(t) {
    this.gpu = t;
  }
  getColorTargets(t) {
    return [{ format: "bgra8unorm", writeMask: 0, blend: ht[t.blendMode] || ht.normal }];
  }
  destroy() {
    this.gpu = null;
  }
}
uu.extension = { type: [x$1.WebGPUSystem], name: "state" };
const $b = { type: "image", upload(r, t, e) {
  const s = r.resource, i = (r.pixelWidth | 0) * (r.pixelHeight | 0), n = s.byteLength / i;
  e.device.queue.writeTexture({ texture: t }, s, { offset: 0, rowsPerImage: r.pixelHeight, bytesPerRow: r.pixelHeight * n }, { width: r.pixelWidth, height: r.pixelHeight, depthOrArrayLayers: 1 });
} }, cu = { "bc1-rgba-unorm": { blockBytes: 8, blockWidth: 4, blockHeight: 4 }, "bc2-rgba-unorm": { blockBytes: 16, blockWidth: 4, blockHeight: 4 }, "bc3-rgba-unorm": { blockBytes: 16, blockWidth: 4, blockHeight: 4 }, "bc7-rgba-unorm": { blockBytes: 16, blockWidth: 4, blockHeight: 4 }, "etc1-rgb-unorm": { blockBytes: 8, blockWidth: 4, blockHeight: 4 }, "etc2-rgba8unorm": { blockBytes: 16, blockWidth: 4, blockHeight: 4 }, "astc-4x4-unorm": { blockBytes: 16, blockWidth: 4, blockHeight: 4 } }, uR = { blockBytes: 4, blockWidth: 1, blockHeight: 1 }, Lb = { type: "compressed", upload(r, t, e) {
  let s = r.pixelWidth, i = r.pixelHeight;
  const n = cu[r.format] || uR;
  for (let o = 0; o < r.resource.length; o++) {
    const a = r.resource[o], l3 = Math.ceil(s / n.blockWidth) * n.blockBytes;
    e.device.queue.writeTexture({ texture: t, mipLevel: o }, a, { offset: 0, bytesPerRow: l3 }, { width: Math.ceil(s / n.blockWidth) * n.blockWidth, height: Math.ceil(i / n.blockHeight) * n.blockHeight, depthOrArrayLayers: 1 }), s = Math.max(s >> 1, 1), i = Math.max(i >> 1, 1);
  }
} }, hu = { type: "image", upload(r, t, e) {
  const s = r.resource;
  if (!s) return;
  if (globalThis.HTMLImageElement && s instanceof HTMLImageElement) {
    const a = L.get().createCanvas(s.width, s.height);
    a.getContext("2d").drawImage(s, 0, 0, s.width, s.height), r.resource = a;
  }
  const i = Math.min(t.width, r.resourceWidth || r.pixelWidth), n = Math.min(t.height, r.resourceHeight || r.pixelHeight), o = r.alphaMode === "premultiply-alpha-on-upload";
  e.device.queue.copyExternalImageToTexture({ source: s }, { texture: t, premultipliedAlpha: o }, { width: i, height: n });
} }, Nb = { type: "video", upload(r, t, e) {
  hu.upload(r, t, e);
} };
class Xb {
  constructor(t) {
    this.device = t, this.sampler = t.createSampler({ minFilter: "linear" }), this.pipelines = {};
  }
  _getMipmapPipeline(t) {
    let e = this.pipelines[t];
    return e || (this.mipmapShaderModule || (this.mipmapShaderModule = this.device.createShaderModule({ code: `
    var<private> pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0), vec2<f32>(-1.0, 3.0), vec2<f32>(3.0, -1.0));

    struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) texCoord : vec2<f32>,
    };

    @vertex
    fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
    var output : VertexOutput;
    output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);
    output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
    return output;
    }

    @group(0) @binding(0) var imgSampler : sampler;
    @group(0) @binding(1) var img : texture_2d<f32>;

    @fragment
    fn fragmentMain(@location(0) texCoord : vec2<f32>) -> @location(0) vec4<f32> {
    return textureSample(img, imgSampler, texCoord);
    }
` })), e = this.device.createRenderPipeline({ layout: "auto", vertex: { module: this.mipmapShaderModule, entryPoint: "vertexMain" }, fragment: { module: this.mipmapShaderModule, entryPoint: "fragmentMain", targets: [{ format: t }] } }), this.pipelines[t] = e), e;
  }
  generateMipmap(t) {
    const e = this._getMipmapPipeline(t.format);
    if (t.dimension === "3d" || t.dimension === "1d") throw new Error("Generating mipmaps for non-2d textures is currently unsupported!");
    let s = t;
    const i = t.depthOrArrayLayers || 1, n = t.usage & GPUTextureUsage.RENDER_ATTACHMENT;
    if (!n) {
      const l3 = { size: { width: Math.ceil(t.width / 2), height: Math.ceil(t.height / 2), depthOrArrayLayers: i }, format: t.format, usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT, mipLevelCount: t.mipLevelCount - 1 };
      s = this.device.createTexture(l3);
    }
    const o = this.device.createCommandEncoder({}), a = e.getBindGroupLayout(0);
    for (let l3 = 0; l3 < i; ++l3) {
      let u3 = t.createView({ baseMipLevel: 0, mipLevelCount: 1, dimension: "2d", baseArrayLayer: l3, arrayLayerCount: 1 }), c = n ? 1 : 0;
      for (let h = 1; h < t.mipLevelCount; ++h) {
        const d = s.createView({ baseMipLevel: c++, mipLevelCount: 1, dimension: "2d", baseArrayLayer: l3, arrayLayerCount: 1 }), p = o.beginRenderPass({ colorAttachments: [{ view: d, storeOp: "store", loadOp: "clear", clearValue: { r: 0, g: 0, b: 0, a: 0 } }] }), f2 = this.device.createBindGroup({ layout: a, entries: [{ binding: 0, resource: this.sampler }, { binding: 1, resource: u3 }] });
        p.setPipeline(e), p.setBindGroup(0, f2), p.draw(3, 1, 0, 0), p.end(), u3 = d;
      }
    }
    if (!n) {
      const l3 = { width: Math.ceil(t.width / 2), height: Math.ceil(t.height / 2), depthOrArrayLayers: i };
      for (let u3 = 1; u3 < t.mipLevelCount; ++u3) o.copyTextureToTexture({ texture: s, mipLevel: u3 - 1 }, { texture: t, mipLevel: u3 }, l3), l3.width = Math.ceil(l3.width / 2), l3.height = Math.ceil(l3.height / 2);
    }
    return this.device.queue.submit([o.finish()]), n || s.destroy(), t;
  }
}
class du {
  constructor(t) {
    this.managedTextures = [], this._gpuSources = /* @__PURE__ */ Object.create(null), this._gpuSamplers = /* @__PURE__ */ Object.create(null), this._bindGroupHash = /* @__PURE__ */ Object.create(null), this._textureViewHash = /* @__PURE__ */ Object.create(null), this._uploads = { image: hu, buffer: $b, video: Nb, compressed: Lb }, this._renderer = t, t.renderableGC.addManagedHash(this, "_gpuSources"), t.renderableGC.addManagedHash(this, "_gpuSamplers"), t.renderableGC.addManagedHash(this, "_bindGroupHash"), t.renderableGC.addManagedHash(this, "_textureViewHash");
  }
  contextChange(t) {
    this._gpu = t;
  }
  initSource(t) {
    if (t.autoGenerateMipmaps) {
      const l3 = Math.max(t.pixelWidth, t.pixelHeight);
      t.mipLevelCount = Math.floor(Math.log2(l3)) + 1;
    }
    let e = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;
    t.uploadMethodId !== "compressed" && (e |= GPUTextureUsage.RENDER_ATTACHMENT, e |= GPUTextureUsage.COPY_SRC);
    const s = cu[t.format] || { blockBytes: 4, blockWidth: 1, blockHeight: 1 }, i = Math.ceil(t.pixelWidth / s.blockWidth) * s.blockWidth, n = Math.ceil(t.pixelHeight / s.blockHeight) * s.blockHeight, o = { label: t.label, size: { width: i, height: n }, format: t.format, sampleCount: t.sampleCount, mipLevelCount: t.mipLevelCount, dimension: t.dimension, usage: e }, a = this._gpu.device.createTexture(o);
    return this._gpuSources[t.uid] = a, this.managedTextures.includes(t) || (t.on("update", this.onSourceUpdate, this), t.on("resize", this.onSourceResize, this), t.on("destroy", this.onSourceDestroy, this), t.on("unload", this.onSourceUnload, this), t.on("updateMipmaps", this.onUpdateMipmaps, this), this.managedTextures.push(t)), this.onSourceUpdate(t), a;
  }
  onSourceUpdate(t) {
    const e = this.getGpuSource(t);
    e && (this._uploads[t.uploadMethodId] && this._uploads[t.uploadMethodId].upload(t, e, this._gpu), t.autoGenerateMipmaps && t.mipLevelCount > 1 && this.onUpdateMipmaps(t));
  }
  onSourceUnload(t) {
    const e = this._gpuSources[t.uid];
    e && (this._gpuSources[t.uid] = null, e.destroy());
  }
  onUpdateMipmaps(t) {
    this._mipmapGenerator || (this._mipmapGenerator = new Xb(this._gpu.device));
    const e = this.getGpuSource(t);
    this._mipmapGenerator.generateMipmap(e);
  }
  onSourceDestroy(t) {
    t.off("update", this.onSourceUpdate, this), t.off("unload", this.onSourceUnload, this), t.off("destroy", this.onSourceDestroy, this), t.off("resize", this.onSourceResize, this), t.off("updateMipmaps", this.onUpdateMipmaps, this), this.managedTextures.splice(this.managedTextures.indexOf(t), 1), this.onSourceUnload(t);
  }
  onSourceResize(t) {
    const e = this._gpuSources[t.uid];
    e ? (e.width !== t.pixelWidth || e.height !== t.pixelHeight) && (this._textureViewHash[t.uid] = null, this._bindGroupHash[t.uid] = null, this.onSourceUnload(t), this.initSource(t)) : this.initSource(t);
  }
  _initSampler(t) {
    return this._gpuSamplers[t._resourceId] = this._gpu.device.createSampler(t), this._gpuSamplers[t._resourceId];
  }
  getGpuSampler(t) {
    return this._gpuSamplers[t._resourceId] || this._initSampler(t);
  }
  getGpuSource(t) {
    return this._gpuSources[t.uid] || this.initSource(t);
  }
  getTextureBindGroup(t) {
    var e;
    return (e = this._bindGroupHash[t.uid]) != null ? e : this._createTextureBindGroup(t);
  }
  _createTextureBindGroup(t) {
    const e = t.source;
    return this._bindGroupHash[t.uid] = new Xt({ 0: e, 1: e.style, 2: new et$1({ uTextureMatrix: { type: "mat3x3<f32>", value: t.textureMatrix.mapCoord } }) }), this._bindGroupHash[t.uid];
  }
  getTextureView(t) {
    var e;
    const s = t.source;
    return (e = this._textureViewHash[s.uid]) != null ? e : this._createTextureView(s);
  }
  _createTextureView(t) {
    return this._textureViewHash[t.uid] = this.getGpuSource(t).createView(), this._textureViewHash[t.uid];
  }
  generateCanvas(t) {
    const e = this._renderer, s = e.gpu.device.createCommandEncoder(), i = L.get().createCanvas();
    i.width = t.source.pixelWidth, i.height = t.source.pixelHeight;
    const n = i.getContext("webgpu");
    return n.configure({ device: e.gpu.device, usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC, format: L.get().getNavigator().gpu.getPreferredCanvasFormat(), alphaMode: "premultiplied" }), s.copyTextureToTexture({ texture: e.texture.getGpuSource(t.source), origin: { x: 0, y: 0 } }, { texture: n.getCurrentTexture() }, { width: i.width, height: i.height }), e.gpu.device.queue.submit([s.finish()]), i;
  }
  getPixels(t) {
    const e = this.generateCanvas(t), s = Qt.getOptimalCanvasAndContext(e.width, e.height), i = s.context;
    i.drawImage(e, 0, 0);
    const { width: n, height: o } = e, a = i.getImageData(0, 0, n, o), l3 = new Uint8ClampedArray(a.data.buffer);
    return Qt.returnCanvasAndContext(s), { pixels: l3, width: n, height: o };
  }
  destroy() {
    this.managedTextures.slice().forEach((t) => this.onSourceDestroy(t)), this.managedTextures = null;
    for (const t of Object.keys(this._bindGroupHash)) {
      const e = Number(t), s = this._bindGroupHash[e];
      s == null || s.destroy(), this._bindGroupHash[e] = null;
    }
    this._gpu = null, this._mipmapGenerator = null, this._gpuSources = null, this._bindGroupHash = null, this._textureViewHash = null, this._gpuSamplers = null;
  }
}
du.extension = { type: [x$1.WebGPUSystem], name: "texture" };
class pu {
  constructor() {
    this._maxTextures = 0;
  }
  contextChange(t) {
    const e = new et$1({ uTransformMatrix: { value: new R$1(), type: "mat3x3<f32>" }, uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" }, uRound: { value: 0, type: "f32" } });
    this._maxTextures = t.limits.maxBatchableTextures;
    const s = Le({ name: "graphics", bits: [Ds, ks(this._maxTextures), Jf, Xe] });
    this.shader = new At$1({ gpuProgram: s, resources: { localUniforms: e } });
  }
  execute(t, e) {
    const s = e.context, i = s.customShader || this.shader, n = t.renderer, o = n.graphicsContext, { batcher: a, instructions: l3 } = o.getContextRenderData(s), u3 = n.encoder;
    u3.setGeometry(a.geometry, i.gpuProgram);
    const c = n.globalUniforms.bindGroup;
    u3.setBindGroup(0, c, i.gpuProgram);
    const h = n.renderPipes.uniformBatch.getUniformBindGroup(i.resources.localUniforms, true);
    u3.setBindGroup(2, h, i.gpuProgram);
    const d = l3.instructions;
    let p = null;
    for (let f2 = 0; f2 < l3.instructionSize; f2++) {
      const g = d[f2];
      if (g.topology !== p && (p = g.topology, u3.setPipelineFromGeometryProgramAndState(a.geometry, i.gpuProgram, t.state, g.topology)), i.groups[1] = g.bindGroup, !g.gpuBindGroup) {
        const m3 = g.textures;
        g.bindGroup = Gs(m3.textures, m3.count, this._maxTextures), g.gpuBindGroup = n.bindGroup.getBindGroup(g.bindGroup, i.gpuProgram, 1);
      }
      u3.setBindGroup(1, g.bindGroup, i.gpuProgram), u3.renderPassEncoder.drawIndexed(g.size, 1, g.start);
    }
  }
  destroy() {
    this.shader.destroy(true), this.shader = null;
  }
}
pu.extension = { type: [x$1.WebGPUPipesAdaptor], name: "graphics" };
class fu {
  init() {
    const t = Le({ name: "mesh", bits: [qe, V_, Xe] });
    this._shader = new At$1({ gpuProgram: t, resources: { uTexture: A$1.EMPTY._source, uSampler: A$1.EMPTY._source.style, textureUniforms: { uTextureMatrix: { type: "mat3x3<f32>", value: new R$1() } } } });
  }
  execute(t, e) {
    const s = t.renderer;
    let i = e._shader;
    if (!i) i = this._shader, i.groups[2] = s.texture.getTextureBindGroup(e.texture);
    else if (!i.gpuProgram) return;
    const n = i.gpuProgram;
    if (n.autoAssignGlobalUniforms && (i.groups[0] = s.globalUniforms.bindGroup), n.autoAssignLocalUniforms) {
      const o = t.localUniforms;
      i.groups[1] = s.renderPipes.uniformBatch.getUniformBindGroup(o, true);
    }
    s.encoder.draw({ geometry: e._geometry, shader: i, state: e.state });
  }
  destroy() {
    this._shader.destroy(true), this._shader = null;
  }
}
fu.extension = { type: [x$1.WebGPUPipesAdaptor], name: "mesh" };
const cR = [...ql, iu, eu, Hi, ru, Jl, du, au, lu, uu, ou, tu, su, Ql], hR = [...Zl, nu], dR = [Za, fu, pu], Hb = [], jb = [], zb = [];
G$1.handleByNamedList(x$1.WebGPUSystem, Hb), G$1.handleByNamedList(x$1.WebGPUPipes, jb), G$1.handleByNamedList(x$1.WebGPUPipesAdaptor, zb), G$1.add(...cR, ...hR, ...dR);
class Vb extends Hr {
  constructor() {
    const t = { name: "webgpu", type: mt$1.WEBGPU, systems: Hb, renderPipes: jb, renderPipeAdaptors: zb };
    super(t);
  }
}
var pR = { __proto__: null, WebGPURenderer: Vb };
const fR = { POINTS: "point-list", LINES: "line-list", LINE_STRIP: "line-strip", TRIANGLES: "triangle-list", TRIANGLE_STRIP: "triangle-strip" };
new Proxy(fR, { get(r, t) {
  return r[t];
} });
var mu = ((r) => (r.CLAMP = "clamp-to-edge", r.REPEAT = "repeat", r.MIRRORED_REPEAT = "mirror-repeat", r))(mu || {});
new Proxy(mu, { get(r, t) {
  return r[t];
} });
var gu = ((r) => (r.NEAREST = "nearest", r.LINEAR = "linear", r))(gu || {});
new Proxy(gu, { get(r, t) {
  return r[t];
} });
var RR = Object.defineProperty, qb = Object.getOwnPropertySymbols, MR = Object.prototype.hasOwnProperty, CR = Object.prototype.propertyIsEnumerable, Zb = (r, t, e) => t in r ? RR(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, Qb = (r, t) => {
  for (var e in t || (t = {})) MR.call(t, e) && Zb(r, e, t[e]);
  if (qb) for (var e of qb(t)) CR.call(t, e) && Zb(r, e, t[e]);
  return r;
};
const Jb = class gy extends lt {
  constructor(t = {}) {
    t = Qb(Qb({}, gy.defaultOptions), t), super(), this.renderLayerChildren = [], this.sortableChildren = t.sortableChildren, this.sortFunction = t.sortFunction;
  }
  attach(...t) {
    for (let e = 0; e < t.length; e++) {
      const s = t[e];
      if (s.parentRenderLayer) {
        if (s.parentRenderLayer === this) continue;
        s.parentRenderLayer.detach(s);
      }
      this.renderLayerChildren.push(s), s.parentRenderLayer = this;
      const i = this.renderGroup || this.parentRenderGroup;
      i && (i.structureDidChange = true);
    }
    return t[0];
  }
  detach(...t) {
    for (let e = 0; e < t.length; e++) {
      const s = t[e], i = this.renderLayerChildren.indexOf(s);
      i !== -1 && this.renderLayerChildren.splice(i, 1), s.parentRenderLayer = null;
      const n = this.renderGroup || this.parentRenderGroup;
      n && (n.structureDidChange = true);
    }
    return t[0];
  }
  detachAll() {
    const t = this.renderLayerChildren;
    for (let e = 0; e < t.length; e++) t[e].parentRenderLayer = null;
    this.renderLayerChildren.length = 0;
  }
  collectRenderables(t, e, s) {
    const i = this.renderLayerChildren, n = i.length;
    this.sortableChildren && this.sortRenderLayerChildren();
    for (let o = 0; o < n; o++) i[o].parent || Ct$1("Container must be added to both layer and scene graph. Layers only handle render order - the scene graph is required for transforms (addChild)", i[o]), i[o].collectRenderables(t, e, this);
  }
  sortRenderLayerChildren() {
    this.renderLayerChildren.sort(this.sortFunction);
  }
  _getGlobalBoundsRecursive(t, e, s) {
    if (!t) return;
    const i = this.renderLayerChildren;
    for (let n = 0; n < i.length; n++) i[n]._getGlobalBoundsRecursive(true, e, this);
  }
};
Jb.defaultOptions = { sortableChildren: false, sortFunction: (r, t) => r.zIndex - t.zIndex };
function tv(r, t, e, s) {
  const i = e.buffers[0], n = i.data, { verticesX: o, verticesY: a } = e, l3 = r / (o - 1), u3 = t / (a - 1);
  let c = 0;
  const h = s[0], d = s[1], p = s[2], f2 = s[3], g = s[4], m3 = s[5], _ = s[6], b = s[7], v4 = s[8];
  for (let y4 = 0; y4 < n.length; y4 += 2) {
    const S3 = c % o * l3, T4 = (c / o | 0) * u3, E4 = h * S3 + d * T4 + p, O3 = f2 * S3 + g * T4 + m3, C3 = _ * S3 + b * T4 + v4;
    n[y4] = E4 / C3, n[y4 + 1] = O3 / C3, c++;
  }
  i.update();
}
function ev(r, t) {
  const e = t[0], s = t[1], i = t[2], n = t[3], o = t[4], a = t[5], l3 = t[6], u3 = t[7], c = t[8];
  return r[0] = o * c - a * u3, r[1] = i * u3 - s * c, r[2] = s * a - i * o, r[3] = a * l3 - n * c, r[4] = e * c - i * l3, r[5] = i * n - e * a, r[6] = n * u3 - o * l3, r[7] = s * l3 - e * u3, r[8] = e * o - s * n, r;
}
function rv(r, t, e) {
  const s = t[0], i = t[1], n = t[2], o = t[3], a = t[4], l3 = t[5], u3 = t[6], c = t[7], h = t[8], d = e[0], p = e[1], f2 = e[2], g = e[3], m3 = e[4], _ = e[5], b = e[6], v4 = e[7], y4 = e[8];
  return r[0] = d * s + p * o + f2 * u3, r[1] = d * i + p * a + f2 * c, r[2] = d * n + p * l3 + f2 * h, r[3] = g * s + m3 * o + _ * u3, r[4] = g * i + m3 * a + _ * c, r[5] = g * n + m3 * l3 + _ * h, r[6] = b * s + v4 * o + y4 * u3, r[7] = b * i + v4 * a + y4 * c, r[8] = b * n + v4 * l3 + y4 * h, r;
}
function IR(r, t, e) {
  const s = e[0], i = e[1], n = e[2];
  return r[0] = t[0] * s + t[1] * i + t[2] * n, r[1] = t[3] * s + t[4] * i + t[5] * n, r[2] = t[6] * s + t[7] * i + t[8] * n, r;
}
const BR = [0, 0, 0, 0, 0, 0, 0, 0, 0], FR = [0, 0, 0], zi = [0, 0, 0];
function sv(r, t, e, s, i, n, o, a, l3) {
  const u3 = BR;
  u3[0] = t, u3[1] = s, u3[2] = n, u3[3] = e, u3[4] = i, u3[5] = o, u3[6] = 1, u3[7] = 1, u3[8] = 1;
  const c = ev(r, u3);
  zi[0] = a, zi[1] = l3, zi[2] = 1;
  const h = IR(FR, c, zi), d = r;
  return r[0] = h[0], r[1] = 0, r[2] = 0, r[3] = 0, r[4] = h[1], r[5] = 0, r[6] = 0, r[7] = 0, r[8] = h[2], rv(r, d, u3);
}
const DR = [0, 0, 0, 0, 0, 0, 0, 0, 0], UR = [0, 0, 0, 0, 0, 0, 0, 0, 0];
function iv(r, t, e, s, i, n, o, a, l3, u3, c, h, d, p, f2, g, m3) {
  const _ = sv(DR, t, e, n, o, u3, c, p, f2), b = sv(UR, s, i, a, l3, h, d, g, m3);
  return rv(r, ev(_, _), b);
}
class nv extends ni {
  constructor(t) {
    super(t), this._projectionMatrix = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const { width: e, height: s } = t;
    this.corners = [0, 0, e, 0, e, s, 0, s];
  }
  setCorners(t, e, s, i, n, o, a, l3) {
    const u3 = this.corners;
    u3[0] = t, u3[1] = e, u3[2] = s, u3[3] = i, u3[4] = n, u3[5] = o, u3[6] = a, u3[7] = l3, this.updateProjection();
  }
  updateProjection() {
    const { width: t, height: e } = this, s = this.corners, i = iv(this._projectionMatrix, 0, 0, s[0], s[1], t, 0, s[2], s[3], t, e, s[4], s[5], 0, e, s[6], s[7]);
    tv(t, e, this, i);
  }
}
var kR = Object.defineProperty, $R = Object.defineProperties, LR = Object.getOwnPropertyDescriptors, Vi = Object.getOwnPropertySymbols, ov = Object.prototype.hasOwnProperty, av = Object.prototype.propertyIsEnumerable, lv = (r, t, e) => t in r ? kR(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, _u = (r, t) => {
  for (var e in t || (t = {})) ov.call(t, e) && lv(r, e, t[e]);
  if (Vi) for (var e of Vi(t)) av.call(t, e) && lv(r, e, t[e]);
  return r;
}, NR = (r, t) => $R(r, LR(t)), XR = (r, t) => {
  var e = {};
  for (var s in r) ov.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && Vi) for (var s of Vi(r)) t.indexOf(s) < 0 && av.call(r, s) && (e[s] = r[s]);
  return e;
};
const uv = class _y extends er {
  constructor(t) {
    t = _u(_u({}, _y.defaultOptions), t);
    const e = t, { texture: s, verticesX: i, verticesY: n } = e, o = XR(e, ["texture", "verticesX", "verticesY"]), a = new nv(It({ width: s.width, height: s.height, verticesX: i, verticesY: n }));
    super(It(NR(_u({}, o), { geometry: a }))), this._texture = s, this.geometry.setCorners(t.x0, t.y0, t.x1, t.y1, t.x2, t.y2, t.x3, t.y3);
  }
  textureUpdated() {
    const t = this.geometry;
    if (!t) return;
    const { width: e, height: s } = this.texture;
    (t.width !== e || t.height !== s) && (t.width = e, t.height = s, t.updateProjection());
  }
  set texture(t) {
    this._texture !== t && (super.texture = t, this.textureUpdated());
  }
  get texture() {
    return this._texture;
  }
  setCorners(t, e, s, i, n, o, a, l3) {
    this.geometry.setCorners(t, e, s, i, n, o, a, l3);
  }
};
uv.defaultOptions = { texture: A$1.WHITE, verticesX: 10, verticesY: 10, x0: 0, y0: 0, x1: 100, y1: 0, x2: 100, y2: 100, x3: 0, y3: 100 };
var ZR = Object.defineProperty, pv = Object.getOwnPropertySymbols, QR = Object.prototype.hasOwnProperty, JR = Object.prototype.propertyIsEnumerable, fv = (r, t, e) => t in r ? ZR(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, mv = (r, t) => {
  for (var e in t || (t = {})) QR.call(t, e) && fv(r, e, t[e]);
  if (pv) for (var e of pv(t)) JR.call(t, e) && fv(r, e, t[e]);
  return r;
};
const gv = class xy extends Pe {
  constructor(t) {
    const { width: e, points: s, textureScale: i } = mv(mv({}, xy.defaultOptions), t);
    super({ positions: new Float32Array(s.length * 4), uvs: new Float32Array(s.length * 4), indices: new Uint32Array((s.length - 1) * 6) }), this.points = s, this._width = e, this.textureScale = i, this._build();
  }
  get width() {
    return this._width;
  }
  _build() {
    const t = this.points;
    if (!t) return;
    const e = this.getBuffer("aPosition"), s = this.getBuffer("aUV"), i = this.getIndex();
    if (t.length < 1) return;
    e.data.length / 4 !== t.length && (e.data = new Float32Array(t.length * 4), s.data = new Float32Array(t.length * 4), i.data = new Uint16Array((t.length - 1) * 6));
    const n = s.data, o = i.data;
    n[0] = 0, n[1] = 0, n[2] = 0, n[3] = 1;
    let a = 0, l3 = t[0];
    const u3 = this._width * this.textureScale, c = t.length;
    for (let d = 0; d < c; d++) {
      const p = d * 4;
      if (this.textureScale > 0) {
        const f2 = l3.x - t[d].x, g = l3.y - t[d].y, m3 = Math.sqrt(f2 * f2 + g * g);
        l3 = t[d], a += m3 / u3;
      } else a = d / (c - 1);
      n[p] = a, n[p + 1] = 0, n[p + 2] = a, n[p + 3] = 1;
    }
    let h = 0;
    for (let d = 0; d < c - 1; d++) {
      const p = d * 2;
      o[h++] = p, o[h++] = p + 1, o[h++] = p + 2, o[h++] = p + 2, o[h++] = p + 1, o[h++] = p + 3;
    }
    s.update(), i.update(), this.updateVertices();
  }
  updateVertices() {
    const t = this.points;
    if (t.length < 1) return;
    let e = t[0], s, i = 0, n = 0;
    const o = this.buffers[0].data, a = t.length, l3 = this.textureScale > 0 ? this.textureScale * this._width / 2 : this._width / 2;
    for (let u3 = 0; u3 < a; u3++) {
      const c = t[u3], h = u3 * 4;
      u3 < t.length - 1 ? s = t[u3 + 1] : s = c, n = -(s.x - e.x), i = s.y - e.y;
      const p = Math.sqrt(i * i + n * n);
      p < 1e-6 ? (i = 0, n = 0) : (i /= p, n /= p, i *= l3, n *= l3), o[h] = c.x + i, o[h + 1] = c.y + n, o[h + 2] = c.x - i, o[h + 3] = c.y - n, e = c;
    }
    this.buffers[0].update();
  }
  update() {
    this.textureScale > 0 ? this._build() : this.updateVertices();
  }
};
gv.defaultOptions = { width: 200, points: [], textureScale: 0 };
let _v = gv;
var t3 = Object.defineProperty, e3 = Object.defineProperties, r3 = Object.getOwnPropertyDescriptors, Yi = Object.getOwnPropertySymbols, xv = Object.prototype.hasOwnProperty, bv = Object.prototype.propertyIsEnumerable, vv = (r, t, e) => t in r ? t3(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, xu = (r, t) => {
  for (var e in t || (t = {})) xv.call(t, e) && vv(r, e, t[e]);
  if (Yi) for (var e of Yi(t)) bv.call(t, e) && vv(r, e, t[e]);
  return r;
}, s3 = (r, t) => e3(r, r3(t)), i3 = (r, t) => {
  var e = {};
  for (var s in r) xv.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && Yi) for (var s of Yi(r)) t.indexOf(s) < 0 && bv.call(r, s) && (e[s] = r[s]);
  return e;
};
const yv = class by extends er {
  constructor(t) {
    const e = xu(xu({}, by.defaultOptions), t), { texture: s, points: i, textureScale: n } = e, o = i3(e, ["texture", "points", "textureScale"]), a = new _v(It({ width: s.height, points: i, textureScale: n }));
    n > 0 && (s.source.style.addressMode = "repeat"), super(It(s3(xu({}, o), { texture: s, geometry: a }))), this.autoUpdate = true, this.onRender = this._render;
  }
  _render() {
    const t = this.geometry;
    (this.autoUpdate || t._width !== this.texture.height) && (t._width = this.texture.height, t.update());
  }
};
yv.defaultOptions = { textureScale: 0 };
const bu = { vertex: { attributeName: "aVertex", format: "float32x2", code: `
const texture = p.texture;
const sx = p.scaleX;
const sy = p.scaleY;
const ax = p.anchorX;
const ay = p.anchorY;
const trim = texture.trim;
const orig = texture.orig;

if (trim)
{
w1 = trim.x - (ax * orig.width);
w0 = w1 + trim.width;

h1 = trim.y - (ay * orig.height);
h0 = h1 + trim.height;
}
else
{
w1 = -ax * (orig.width);
w0 = w1 + orig.width;

h1 = -ay * (orig.height);
h0 = h1 + orig.height;
}

f32v[offset] = w1 * sx;
f32v[offset + 1] = h1 * sy;

f32v[offset + stride] = w0 * sx;
f32v[offset + stride + 1] = h1 * sy;

f32v[offset + (stride * 2)] = w0 * sx;
f32v[offset + (stride * 2) + 1] = h0 * sy;

f32v[offset + (stride * 3)] = w1 * sx;
f32v[offset + (stride * 3) + 1] = h0 * sy;
`, dynamic: false }, position: { attributeName: "aPosition", format: "float32x2", code: `
var x = p.x;
var y = p.y;

f32v[offset] = x;
f32v[offset + 1] = y;

f32v[offset + stride] = x;
f32v[offset + stride + 1] = y;

f32v[offset + (stride * 2)] = x;
f32v[offset + (stride * 2) + 1] = y;

f32v[offset + (stride * 3)] = x;
f32v[offset + (stride * 3) + 1] = y;
`, dynamic: true }, rotation: { attributeName: "aRotation", format: "float32", code: `
var rotation = p.rotation;

f32v[offset] = rotation;
f32v[offset + stride] = rotation;
f32v[offset + (stride * 2)] = rotation;
f32v[offset + (stride * 3)] = rotation;
`, dynamic: false }, uvs: { attributeName: "aUV", format: "float32x2", code: `
var uvs = p.texture.uvs;

f32v[offset] = uvs.x0;
f32v[offset + 1] = uvs.y0;

f32v[offset + stride] = uvs.x1;
f32v[offset + stride + 1] = uvs.y1;

f32v[offset + (stride * 2)] = uvs.x2;
f32v[offset + (stride * 2) + 1] = uvs.y2;

f32v[offset + (stride * 3)] = uvs.x3;
f32v[offset + (stride * 3) + 1] = uvs.y3;
`, dynamic: false }, color: { attributeName: "aColor", format: "unorm8x4", code: `
const c = p.color;

u32v[offset] = c;
u32v[offset + stride] = c;
u32v[offset + (stride * 2)] = c;
u32v[offset + (stride * 3)] = c;
`, dynamic: false } };
var x3 = Object.defineProperty, b3 = Object.defineProperties, v3 = Object.getOwnPropertyDescriptors, qi = Object.getOwnPropertySymbols, Mv = Object.prototype.hasOwnProperty, Cv = Object.prototype.propertyIsEnumerable, Ov = (r, t, e) => t in r ? x3(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, ir = (r, t) => {
  for (var e in t || (t = {})) Mv.call(t, e) && Ov(r, e, t[e]);
  if (qi) for (var e of qi(t)) Cv.call(t, e) && Ov(r, e, t[e]);
  return r;
}, Gv = (r, t) => b3(r, v3(t)), y3 = (r, t) => {
  var e = {};
  for (var s in r) Mv.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && qi) for (var s of qi(r)) t.indexOf(s) < 0 && Cv.call(r, s) && (e[s] = r[s]);
  return e;
};
const T3 = new st$1(0, 0, 0, 0), Iv = class Ru extends Lt$1 {
  constructor(t = {}) {
    t = Gv(ir(ir({}, Ru.defaultOptions), t), { dynamicProperties: ir(ir({}, Ru.defaultOptions.dynamicProperties), t == null ? void 0 : t.dynamicProperties) });
    const e = t, { dynamicProperties: s, shader: i, roundPixels: n, texture: o, particles: a } = e, l3 = y3(e, ["dynamicProperties", "shader", "roundPixels", "texture", "particles"]);
    super(ir({ label: "ParticleContainer" }, l3)), this.renderPipeId = "particle", this.batched = false, this._childrenDirty = false, this.texture = o || null, this.shader = i, this._properties = {};
    for (const u3 in bu) {
      const c = bu[u3], h = s[u3];
      this._properties[u3] = Gv(ir({}, c), { dynamic: h });
    }
    this.allowChildren = true, this.roundPixels = n != null ? n : false, this.particleChildren = a != null ? a : [];
  }
  addParticle(...t) {
    for (let e = 0; e < t.length; e++) this.particleChildren.push(t[e]);
    return this.onViewUpdate(), t[0];
  }
  removeParticle(...t) {
    let e = false;
    for (let s = 0; s < t.length; s++) {
      const i = this.particleChildren.indexOf(t[s]);
      i > -1 && (this.particleChildren.splice(i, 1), e = true);
    }
    return e && this.onViewUpdate(), t[0];
  }
  update() {
    this._childrenDirty = true;
  }
  onViewUpdate() {
    this._childrenDirty = true, super.onViewUpdate();
  }
  get bounds() {
    return T3;
  }
  updateBounds() {
  }
  destroy(t = false) {
    var e, s, i;
    if (super.destroy(t), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const n = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource, o = (s = this.texture) != null ? s : (e = this.particleChildren[0]) == null ? void 0 : e.texture;
      o && o.destroy(n);
    }
    this.texture = null, (i = this.shader) == null || i.destroy();
  }
  removeParticles(t, e) {
    t != null || (t = 0), e != null || (e = this.particleChildren.length);
    const s = this.particleChildren.splice(t, e - t);
    return this.onViewUpdate(), s;
  }
  removeParticleAt(t) {
    const e = this.particleChildren.splice(t, 1);
    return this.onViewUpdate(), e[0];
  }
  addParticleAt(t, e) {
    return this.particleChildren.splice(e, 0, t), this.onViewUpdate(), t;
  }
  addChild(...t) {
    throw new Error("ParticleContainer.addChild() is not available. Please use ParticleContainer.addParticle()");
  }
  removeChild(...t) {
    throw new Error("ParticleContainer.removeChild() is not available. Please use ParticleContainer.removeParticle()");
  }
  removeChildren(t, e) {
    throw new Error("ParticleContainer.removeChildren() is not available. Please use ParticleContainer.removeParticles()");
  }
  removeChildAt(t) {
    throw new Error("ParticleContainer.removeChildAt() is not available. Please use ParticleContainer.removeParticleAt()");
  }
  getChildAt(t) {
    throw new Error("ParticleContainer.getChildAt() is not available. Please use ParticleContainer.getParticleAt()");
  }
  setChildIndex(t, e) {
    throw new Error("ParticleContainer.setChildIndex() is not available. Please use ParticleContainer.setParticleIndex()");
  }
  getChildIndex(t) {
    throw new Error("ParticleContainer.getChildIndex() is not available. Please use ParticleContainer.getParticleIndex()");
  }
  addChildAt(t, e) {
    throw new Error("ParticleContainer.addChildAt() is not available. Please use ParticleContainer.addParticleAt()");
  }
  swapChildren(t, e) {
    throw new Error("ParticleContainer.swapChildren() is not available. Please use ParticleContainer.swapParticles()");
  }
  reparentChild(...t) {
    throw new Error("ParticleContainer.reparentChild() is not available with the particle container");
  }
  reparentChildAt(t, e) {
    throw new Error("ParticleContainer.reparentChildAt() is not available with the particle container");
  }
};
Iv.defaultOptions = { dynamicProperties: { vertex: false, position: true, rotation: false, uvs: false, color: false }, roundPixels: false };
var E3 = Object.defineProperty, Zi = Object.getOwnPropertySymbols, Bv = Object.prototype.hasOwnProperty, Fv = Object.prototype.propertyIsEnumerable, Dv = (r, t, e) => t in r ? E3(r, t, { enumerable: true, configurable: true, writable: true, value: e }) : r[t] = e, A3 = (r, t) => {
  for (var e in t || (t = {})) Bv.call(t, e) && Dv(r, e, t[e]);
  if (Zi) for (var e of Zi(t)) Fv.call(t, e) && Dv(r, e, t[e]);
  return r;
}, w3 = (r, t) => {
  var e = {};
  for (var s in r) Bv.call(r, s) && t.indexOf(s) < 0 && (e[s] = r[s]);
  if (r != null && Zi) for (var s of Zi(r)) t.indexOf(s) < 0 && Fv.call(r, s) && (e[s] = r[s]);
  return e;
};
const Uv = class vy extends Lt$1 {
  constructor(t) {
    var e, s, i, n, o, a, l3, u3, c, h;
    t instanceof A$1 && (t = { texture: t });
    const d = t, { width: p, height: f2, anchor: g, leftWidth: m3, rightWidth: _, topHeight: b, bottomHeight: v4, texture: y4, roundPixels: S3 } = d, T4 = w3(d, ["width", "height", "anchor", "leftWidth", "rightWidth", "topHeight", "bottomHeight", "texture", "roundPixels"]);
    super(A3({ label: "NineSliceSprite" }, T4)), this.renderPipeId = "nineSliceSprite", this.batched = true, this._leftWidth = (s = m3 != null ? m3 : (e = y4 == null ? void 0 : y4.defaultBorders) == null ? void 0 : e.left) != null ? s : oe.defaultOptions.leftWidth, this._topHeight = (n = b != null ? b : (i = y4 == null ? void 0 : y4.defaultBorders) == null ? void 0 : i.top) != null ? n : oe.defaultOptions.topHeight, this._rightWidth = (a = _ != null ? _ : (o = y4 == null ? void 0 : y4.defaultBorders) == null ? void 0 : o.right) != null ? a : oe.defaultOptions.rightWidth, this._bottomHeight = (u3 = v4 != null ? v4 : (l3 = y4 == null ? void 0 : y4.defaultBorders) == null ? void 0 : l3.bottom) != null ? u3 : oe.defaultOptions.bottomHeight, this._width = (c = p != null ? p : y4.width) != null ? c : oe.defaultOptions.width, this._height = (h = f2 != null ? f2 : y4.height) != null ? h : oe.defaultOptions.height, this.allowChildren = false, this.texture = y4 != null ? y4 : vy.defaultOptions.texture, this.roundPixels = S3 != null ? S3 : false, this._anchor = new rt({ _onUpdate: () => {
      this.onViewUpdate();
    } }), g ? this.anchor = g : this.texture.defaultAnchor && (this.anchor = this.texture.defaultAnchor);
  }
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  get width() {
    return this._width;
  }
  set width(t) {
    this._width = t, this.onViewUpdate();
  }
  get height() {
    return this._height;
  }
  set height(t) {
    this._height = t, this.onViewUpdate();
  }
  setSize(t, e) {
    var s;
    typeof t == "object" && (e = (s = t.height) != null ? s : t.width, t = t.width), this._width = t, this._height = e != null ? e : t, this.onViewUpdate();
  }
  getSize(t) {
    return t || (t = {}), t.width = this._width, t.height = this._height, t;
  }
  get leftWidth() {
    return this._leftWidth;
  }
  set leftWidth(t) {
    this._leftWidth = t, this.onViewUpdate();
  }
  get topHeight() {
    return this._topHeight;
  }
  set topHeight(t) {
    this._topHeight = t, this.onViewUpdate();
  }
  get rightWidth() {
    return this._rightWidth;
  }
  set rightWidth(t) {
    this._rightWidth = t, this.onViewUpdate();
  }
  get bottomHeight() {
    return this._bottomHeight;
  }
  set bottomHeight(t) {
    this._bottomHeight = t, this.onViewUpdate();
  }
  get texture() {
    return this._texture;
  }
  set texture(t) {
    t || (t = A$1.EMPTY);
    const e = this._texture;
    e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this._texture = t, this.onViewUpdate());
  }
  get originalWidth() {
    return this._texture.width;
  }
  get originalHeight() {
    return this._texture.height;
  }
  destroy(t) {
    if (super.destroy(t), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const e = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._texture.destroy(e);
    }
    this._texture = null;
  }
  updateBounds() {
    const t = this._bounds, e = this._anchor, s = this._width, i = this._height;
    t.minX = -e._x * s, t.maxX = t.minX + s, t.minY = -e._y * i, t.maxY = t.minY + i;
  }
};
Uv.defaultOptions = { texture: A$1.EMPTY };
let T;
function ut(i) {
  return T = i, i;
}
function l() {
  return T;
}
let y = class {
  constructor(t, e) {
    this.init(t, e);
  }
  init(t, e) {
    this.destination = t, this.source = e || t;
  }
  connect(t) {
    var e;
    (e = this.source) == null || e.connect(t);
  }
  disconnect() {
    var t;
    (t = this.source) == null || t.disconnect();
  }
  destroy() {
    this.disconnect(), this.destination = null, this.source = null;
  }
}, f = class {
  static setParamValue(t, e) {
    if (t.setValueAtTime) {
      const s = l().context;
      t.setValueAtTime(e, s.audioContext.currentTime);
    } else t.value = e;
    return e;
  }
};
const u = class extends y {
  constructor(t = 0, e = 0, s = 0, r = 0, n = 0, o = 0, a = 0, h = 0, d = 0, c = 0) {
    let _ = [];
    const b = [{ f: u.F32, type: "lowshelf", gain: t }, { f: u.F64, type: "peaking", gain: e }, { f: u.F125, type: "peaking", gain: s }, { f: u.F250, type: "peaking", gain: r }, { f: u.F500, type: "peaking", gain: n }, { f: u.F1K, type: "peaking", gain: o }, { f: u.F2K, type: "peaking", gain: a }, { f: u.F4K, type: "peaking", gain: h }, { f: u.F8K, type: "peaking", gain: d }, { f: u.F16K, type: "highshelf", gain: c }];
    l().useLegacy || (_ = b.map((p) => {
      const g = l().context.audioContext.createBiquadFilter();
      return g.type = p.type, f.setParamValue(g.Q, 1), g.frequency.value = p.f, f.setParamValue(g.gain, p.gain), g;
    })), super(_[0], _[_.length - 1]), this.bands = _, this.bandsMap = {};
    for (let p = 0; p < this.bands.length; p++) {
      const g = this.bands[p];
      p > 0 && this.bands[p - 1].connect(g), this.bandsMap[g.frequency.value] = g;
    }
  }
  setGain(t, e = 0) {
    if (!this.bandsMap[t]) throw new Error(`No band found for frequency ${t}`);
    f.setParamValue(this.bandsMap[t].gain, e);
  }
  getGain(t) {
    if (!this.bandsMap[t]) throw new Error(`No band found for frequency ${t}`);
    return this.bandsMap[t].gain.value;
  }
  set f32(t) {
    this.setGain(u.F32, t);
  }
  get f32() {
    return this.getGain(u.F32);
  }
  set f64(t) {
    this.setGain(u.F64, t);
  }
  get f64() {
    return this.getGain(u.F64);
  }
  set f125(t) {
    this.setGain(u.F125, t);
  }
  get f125() {
    return this.getGain(u.F125);
  }
  set f250(t) {
    this.setGain(u.F250, t);
  }
  get f250() {
    return this.getGain(u.F250);
  }
  set f500(t) {
    this.setGain(u.F500, t);
  }
  get f500() {
    return this.getGain(u.F500);
  }
  set f1k(t) {
    this.setGain(u.F1K, t);
  }
  get f1k() {
    return this.getGain(u.F1K);
  }
  set f2k(t) {
    this.setGain(u.F2K, t);
  }
  get f2k() {
    return this.getGain(u.F2K);
  }
  set f4k(t) {
    this.setGain(u.F4K, t);
  }
  get f4k() {
    return this.getGain(u.F4K);
  }
  set f8k(t) {
    this.setGain(u.F8K, t);
  }
  get f8k() {
    return this.getGain(u.F8K);
  }
  set f16k(t) {
    this.setGain(u.F16K, t);
  }
  get f16k() {
    return this.getGain(u.F16K);
  }
  reset() {
    this.bands.forEach((t) => {
      f.setParamValue(t.gain, 0);
    });
  }
  destroy() {
    this.bands.forEach((t) => {
      t.disconnect();
    }), this.bands = null, this.bandsMap = null;
  }
};
let m = u;
m.F32 = 32, m.F64 = 64, m.F125 = 125, m.F250 = 250, m.F500 = 500, m.F1K = 1e3, m.F2K = 2e3, m.F4K = 4e3, m.F8K = 8e3, m.F16K = 16e3;
let I = class extends EventEmitter {
  constructor() {
    super(...arguments), this.speed = 1, this.muted = false, this.volume = 1, this.paused = false;
  }
  refresh() {
    this.emit("refresh");
  }
  refreshPaused() {
    this.emit("refreshPaused");
  }
  get filters() {
    return console.warn("HTML Audio does not support filters"), null;
  }
  set filters(t) {
    console.warn("HTML Audio does not support filters");
  }
  get audioContext() {
    return console.warn("HTML Audio does not support audioContext"), null;
  }
  toggleMute() {
    return this.muted = !this.muted, this.refresh(), this.muted;
  }
  togglePause() {
    return this.paused = !this.paused, this.refreshPaused(), this.paused;
  }
  destroy() {
    this.removeAllListeners();
  }
}, mt = 0;
const $ = class extends EventEmitter {
  constructor(t) {
    super(), this.id = mt++, this.init(t);
  }
  set(t, e) {
    if (this[t] === void 0) throw new Error(`Property with name ${t} does not exist.`);
    switch (t) {
      case "speed":
        this.speed = e;
        break;
      case "volume":
        this.volume = e;
        break;
      case "paused":
        this.paused = e;
        break;
      case "loop":
        this.loop = e;
        break;
      case "muted":
        this.muted = e;
        break;
    }
    return this;
  }
  get progress() {
    const { currentTime: t } = this._source;
    return t / this._duration;
  }
  get paused() {
    return this._paused;
  }
  set paused(t) {
    this._paused = t, this.refreshPaused();
  }
  _onPlay() {
    this._playing = true;
  }
  _onPause() {
    this._playing = false;
  }
  init(t) {
    this._playing = false, this._duration = t.source.duration;
    const e = this._source = t.source.cloneNode(false);
    e.src = t.parent.url, e.onplay = this._onPlay.bind(this), e.onpause = this._onPause.bind(this), t.context.on("refresh", this.refresh, this), t.context.on("refreshPaused", this.refreshPaused, this), this._media = t;
  }
  _internalStop() {
    this._source && this._playing && (this._source.onended = null, this._source.pause());
  }
  stop() {
    this._internalStop(), this._source && this.emit("stop");
  }
  get speed() {
    return this._speed;
  }
  set speed(t) {
    this._speed = t, this.refresh();
  }
  get volume() {
    return this._volume;
  }
  set volume(t) {
    this._volume = t, this.refresh();
  }
  get loop() {
    return this._loop;
  }
  set loop(t) {
    this._loop = t, this.refresh();
  }
  get muted() {
    return this._muted;
  }
  set muted(t) {
    this._muted = t, this.refresh();
  }
  get filters() {
    return console.warn("HTML Audio does not support filters"), null;
  }
  set filters(t) {
    console.warn("HTML Audio does not support filters");
  }
  refresh() {
    const t = this._media.context, e = this._media.parent;
    this._source.loop = this._loop || e.loop;
    const s = t.volume * (t.muted ? 0 : 1), r = e.volume * (e.muted ? 0 : 1), n = this._volume * (this._muted ? 0 : 1);
    this._source.volume = n * s * r, this._source.playbackRate = this._speed * t.speed * e.speed;
  }
  refreshPaused() {
    const t = this._media.context, e = this._media.parent, s = this._paused || e.paused || t.paused;
    s !== this._pausedReal && (this._pausedReal = s, s ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({ start: this._source.currentTime, end: this._end, volume: this._volume, speed: this._speed, loop: this._loop })), this.emit("pause", s));
  }
  play(t) {
    const { start: e, end: s, speed: r, loop: n, volume: o, muted: a } = t;
    s && console.assert(s > e, "End time is before start time"), this._speed = r, this._volume = o, this._loop = !!n, this._muted = a, this.refresh(), this.loop && s !== null && (console.warn('Looping not support when specifying an "end" time'), this.loop = false), this._start = e, this._end = s || this._duration, this._start = Math.max(0, this._start - $.PADDING), this._end = Math.min(this._end + $.PADDING, this._duration), this._source.onloadedmetadata = () => {
      this._source && (this._source.currentTime = e, this._source.onloadedmetadata = null, this.emit("progress", e / this._duration, this._duration), Ticker.shared.add(this._onUpdate, this));
    }, this._source.onended = this._onComplete.bind(this), this._source.play(), this.emit("start");
  }
  _onUpdate() {
    this.emit("progress", this.progress, this._duration), this._source.currentTime >= this._end && !this._source.loop && this._onComplete();
  }
  _onComplete() {
    Ticker.shared.remove(this._onUpdate, this), this._internalStop(), this.emit("progress", 1, this._duration), this.emit("end", this);
  }
  destroy() {
    Ticker.shared.remove(this._onUpdate, this), this.removeAllListeners();
    const t = this._source;
    t && (t.onended = null, t.onplay = null, t.onpause = null, this._internalStop()), this._source = null, this._speed = 1, this._volume = 1, this._loop = false, this._end = null, this._start = 0, this._duration = 0, this._playing = false, this._pausedReal = false, this._paused = false, this._muted = false, this._media && (this._media.context.off("refresh", this.refresh, this), this._media.context.off("refreshPaused", this.refreshPaused, this), this._media = null);
  }
  toString() {
    return `[HTMLAudioInstance id=${this.id}]`;
  }
};
let E = $;
E.PADDING = 0.1;
class j3 extends EventEmitter {
  init(t) {
    this.parent = t, this._source = t.options.source || new Audio(), t.url && (this._source.src = t.url);
  }
  create() {
    return new E(this);
  }
  get isPlayable() {
    return !!this._source && this._source.readyState === 4;
  }
  get duration() {
    return this._source.duration;
  }
  get context() {
    return this.parent.context;
  }
  get filters() {
    return null;
  }
  set filters(t) {
    console.warn("HTML Audio does not support filters");
  }
  destroy() {
    this.removeAllListeners(), this.parent = null, this._source && (this._source.src = "", this._source.load(), this._source = null);
  }
  get source() {
    return this._source;
  }
  load(t) {
    const e = this._source, s = this.parent;
    if (e.readyState === 4) {
      s.isLoaded = true;
      const h = s.autoPlayStart();
      t && setTimeout(() => {
        t(null, s, h);
      }, 0);
      return;
    }
    if (!s.url) {
      t(new Error("sound.url or sound.source must be set"));
      return;
    }
    e.src = s.url;
    const r = () => {
      a(), s.isLoaded = true;
      const h = s.autoPlayStart();
      t && t(null, s, h);
    }, n = () => {
      a(), t && t(new Error("Sound loading has been aborted"));
    }, o = () => {
      a();
      const h = `Failed to load audio element (code: ${e.error.code})`;
      t ? t(new Error(h)) : console.error(h);
    }, a = () => {
      e.removeEventListener("canplaythrough", r), e.removeEventListener("load", r), e.removeEventListener("abort", n), e.removeEventListener("error", o);
    };
    e.addEventListener("canplaythrough", r, false), e.addEventListener("load", r, false), e.addEventListener("abort", n, false), e.addEventListener("error", o, false), e.load();
  }
}
let B = class {
  constructor(t, e) {
    this.parent = t, Object.assign(this, e), this.duration = this.end - this.start, console.assert(this.duration > 0, "End time must be after start time");
  }
  play(t) {
    return this.parent.play({ complete: t, speed: this.speed || this.parent.speed, end: this.end, start: this.start, loop: this.loop });
  }
  destroy() {
    this.parent = null;
  }
};
var yt = Object.defineProperty, G = Object.getOwnPropertySymbols, bt2 = Object.prototype.hasOwnProperty, vt = Object.prototype.propertyIsEnumerable, K = (i, t, e) => t in i ? yt(i, t, { enumerable: true, configurable: true, writable: true, value: e }) : i[t] = e, xt = (i, t) => {
  for (var e in t || (t = {})) bt2.call(t, e) && K(i, e, t[e]);
  if (G) for (var e of G(t)) vt.call(t, e) && K(i, e, t[e]);
  return i;
};
const A4 = ["ogg", "oga", "opus", "m4a", "mp3", "mpeg", "wav", "aiff", "wma", "mid", "caf"], R3 = ["audio/mpeg", "audio/ogg"], F = {};
function D(i) {
  const t = xt({ m4a: "audio/mp4", oga: "audio/ogg", opus: 'audio/ogg; codecs="opus"', caf: 'audio/x-caf; codecs="opus"' }, i || {}), e = document.createElement("audio"), s = {}, r = /^no$/;
  A4.forEach((n) => {
    const o = e.canPlayType(`audio/${n}`).replace(r, ""), a = t[n] ? e.canPlayType(t[n]).replace(r, "") : "";
    s[n] = !!o || !!a;
  }), Object.assign(F, s);
}
D();
let Pt = 0, q = class extends EventEmitter {
  constructor(t) {
    super(), this.id = Pt++, this._media = null, this._paused = false, this._muted = false, this._elapsed = 0, this.init(t);
  }
  set(t, e) {
    if (this[t] === void 0) throw new Error(`Property with name ${t} does not exist.`);
    switch (t) {
      case "speed":
        this.speed = e;
        break;
      case "volume":
        this.volume = e;
        break;
      case "muted":
        this.muted = e;
        break;
      case "loop":
        this.loop = e;
        break;
      case "paused":
        this.paused = e;
        break;
    }
    return this;
  }
  stop() {
    this._source && (this._internalStop(), this.emit("stop"));
  }
  get speed() {
    return this._speed;
  }
  set speed(t) {
    this._speed = t, this.refresh(), this._update(true);
  }
  get volume() {
    return this._volume;
  }
  set volume(t) {
    this._volume = t, this.refresh();
  }
  get muted() {
    return this._muted;
  }
  set muted(t) {
    this._muted = t, this.refresh();
  }
  get loop() {
    return this._loop;
  }
  set loop(t) {
    this._loop = t, this.refresh();
  }
  get filters() {
    return this._filters;
  }
  set filters(t) {
    var e;
    this._filters && ((e = this._filters) == null || e.filter((s) => s).forEach((s) => s.disconnect()), this._filters = null, this._source.connect(this._gain)), this._filters = t != null && t.length ? t.slice(0) : null, this.refresh();
  }
  refresh() {
    if (!this._source) return;
    const t = this._media.context, e = this._media.parent;
    this._source.loop = this._loop || e.loop;
    const s = t.volume * (t.muted ? 0 : 1), r = e.volume * (e.muted ? 0 : 1), n = this._volume * (this._muted ? 0 : 1);
    f.setParamValue(this._gain.gain, n * r * s), f.setParamValue(this._source.playbackRate, this._speed * e.speed * t.speed), this.applyFilters();
  }
  applyFilters() {
    var t;
    if ((t = this._filters) != null && t.length) {
      this._source.disconnect();
      let e = this._source;
      this._filters.forEach((s) => {
        e.connect(s.destination), e = s;
      }), e.connect(this._gain);
    }
  }
  refreshPaused() {
    const t = this._media.context, e = this._media.parent, s = this._paused || e.paused || t.paused;
    s !== this._pausedReal && (this._pausedReal = s, s ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({ start: this._elapsed % this._duration, end: this._end, speed: this._speed, loop: this._loop, volume: this._volume })), this.emit("pause", s));
  }
  play(t) {
    const { start: e, end: s, speed: r, loop: n, volume: o, muted: a, filters: h } = t;
    s && console.assert(s > e, "End time is before start time"), this._paused = false;
    const { source: d, gain: c } = this._media.nodes.cloneBufferSource();
    this._source = d, this._gain = c, this._speed = r, this._volume = o, this._loop = !!n, this._muted = a, this._filters = h, this.refresh();
    const _ = this._source.buffer.duration;
    this._duration = _, this._end = s, this._lastUpdate = this._now(), this._elapsed = e, this._source.onended = this._onComplete.bind(this), this._loop ? (this._source.loopEnd = s, this._source.loopStart = e, this._source.start(0, e)) : s ? this._source.start(0, e, s - e) : this._source.start(0, e), this.emit("start"), this._update(true), this.enableTicker(true);
  }
  enableTicker(t) {
    Ticker.shared.remove(this._updateListener, this), t && Ticker.shared.add(this._updateListener, this);
  }
  get progress() {
    return this._progress;
  }
  get paused() {
    return this._paused;
  }
  set paused(t) {
    this._paused = t, this.refreshPaused();
  }
  destroy() {
    var t;
    this.removeAllListeners(), this._internalStop(), this._gain && (this._gain.disconnect(), this._gain = null), this._media && (this._media.context.events.off("refresh", this.refresh, this), this._media.context.events.off("refreshPaused", this.refreshPaused, this), this._media = null), (t = this._filters) == null || t.forEach((e) => e.disconnect()), this._filters = null, this._end = null, this._speed = 1, this._volume = 1, this._loop = false, this._elapsed = 0, this._duration = 0, this._paused = false, this._muted = false, this._pausedReal = false;
  }
  toString() {
    return `[WebAudioInstance id=${this.id}]`;
  }
  _now() {
    return this._media.context.audioContext.currentTime;
  }
  _updateListener() {
    this._update();
  }
  _update(t = false) {
    if (this._source) {
      const e = this._now(), s = e - this._lastUpdate;
      if (s > 0 || t) {
        const r = this._source.playbackRate.value;
        this._elapsed += s * r, this._lastUpdate = e;
        const n = this._duration;
        let o;
        if (this._source.loopStart) {
          const a = this._source.loopEnd - this._source.loopStart;
          o = (this._source.loopStart + this._elapsed % a) / n;
        } else o = this._elapsed % n / n;
        this._progress = o, this.emit("progress", this._progress, n);
      }
    }
  }
  init(t) {
    this._media = t, t.context.events.on("refresh", this.refresh, this), t.context.events.on("refreshPaused", this.refreshPaused, this);
  }
  _internalStop() {
    if (this._source) {
      this.enableTicker(false), this._source.onended = null, this._source.stop(0), this._source.disconnect();
      try {
        this._source.buffer = null;
      } catch (t) {
        console.warn("Failed to set AudioBufferSourceNode.buffer to null:", t);
      }
      this._source = null;
    }
  }
  _onComplete() {
    if (this._source) {
      this.enableTicker(false), this._source.onended = null, this._source.disconnect();
      try {
        this._source.buffer = null;
      } catch (t) {
        console.warn("Failed to set AudioBufferSourceNode.buffer to null:", t);
      }
    }
    this._source = null, this._progress = 1, this.emit("progress", 1, this._duration), this.emit("end", this);
  }
}, O = class {
  constructor(t, e) {
    this._output = e, this._input = t;
  }
  get destination() {
    return this._input;
  }
  get filters() {
    return this._filters;
  }
  set filters(t) {
    if (this._filters && (this._filters.forEach((e) => {
      e && e.disconnect();
    }), this._filters = null, this._input.connect(this._output)), t && t.length) {
      this._filters = t.slice(0), this._input.disconnect();
      let e = null;
      t.forEach((s) => {
        e === null ? this._input.connect(s.destination) : e.connect(s.destination), e = s;
      }), e.connect(this._output);
    }
  }
  destroy() {
    this.filters = null, this._input = null, this._output = null;
  }
};
const U = class extends O {
  constructor(t) {
    const e = t.audioContext, s = e.createBufferSource(), r = e.createGain(), n = e.createAnalyser();
    s.connect(n), n.connect(r), r.connect(t.destination), super(n, r), this.context = t, this.bufferSource = s, this.gain = r, this.analyser = n;
  }
  get script() {
    return this._script || (this._script = this.context.audioContext.createScriptProcessor(U.BUFFER_SIZE), this._script.connect(this.context.destination)), this._script;
  }
  destroy() {
    super.destroy(), this.bufferSource.disconnect(), this._script && this._script.disconnect(), this.gain.disconnect(), this.analyser.disconnect(), this.bufferSource = null, this._script = null, this.gain = null, this.analyser = null, this.context = null;
  }
  cloneBufferSource() {
    const t = this.bufferSource, e = this.context.audioContext.createBufferSource();
    e.buffer = t.buffer, f.setParamValue(e.playbackRate, t.playbackRate.value), e.loop = t.loop;
    const s = this.context.audioContext.createGain();
    return e.connect(s), s.connect(this.destination), { source: e, gain: s };
  }
  get bufferSize() {
    return this.script.bufferSize;
  }
};
let k = U;
k.BUFFER_SIZE = 0;
let C = class {
  init(t) {
    this.parent = t, this._nodes = new k(this.context), this._source = this._nodes.bufferSource, this.source = t.options.source;
  }
  destroy() {
    this.parent = null, this._nodes.destroy(), this._nodes = null;
    try {
      this._source.buffer = null;
    } catch (t) {
      console.warn("Failed to set AudioBufferSourceNode.buffer to null:", t);
    }
    this._source = null, this.source = null;
  }
  create() {
    return new q(this);
  }
  get context() {
    return this.parent.context;
  }
  get isPlayable() {
    return !!this._source && !!this._source.buffer;
  }
  get filters() {
    return this._nodes.filters;
  }
  set filters(t) {
    this._nodes.filters = t;
  }
  get duration() {
    return console.assert(this.isPlayable, "Sound not yet playable, no duration"), this._source.buffer.duration;
  }
  get buffer() {
    return this._source.buffer;
  }
  set buffer(t) {
    this._source.buffer = t;
  }
  get nodes() {
    return this._nodes;
  }
  load(t) {
    this.source ? this._decode(this.source, t) : this.parent.url ? this._loadUrl(t) : t ? t(new Error("sound.url or sound.source must be set")) : console.error("sound.url or sound.source must be set");
  }
  async _loadUrl(t) {
    const e = this.parent.url, s = await DOMAdapter.get().fetch(e);
    this._decode(await s.arrayBuffer(), t);
  }
  _decode(t, e) {
    const s = (r, n) => {
      if (r) e && e(r);
      else {
        this.parent.isLoaded = true, this.buffer = n;
        const o = this.parent.autoPlayStart();
        e && e(null, this.parent, o);
      }
    };
    t instanceof AudioBuffer ? s(null, t) : this.parent.context.decode(t, s);
  }
};
var wt = Object.defineProperty, V = Object.getOwnPropertySymbols, At2 = Object.prototype.hasOwnProperty, Ft = Object.prototype.propertyIsEnumerable, H = (i, t, e) => t in i ? wt(i, t, { enumerable: true, configurable: true, writable: true, value: e }) : i[t] = e, N = (i, t) => {
  for (var e in t || (t = {})) At2.call(t, e) && H(i, e, t[e]);
  if (V) for (var e of V(t)) Ft.call(t, e) && H(i, e, t[e]);
  return i;
};
const v = class {
  static from(t) {
    let e = {};
    typeof t == "string" ? e.url = t : t instanceof ArrayBuffer || t instanceof AudioBuffer || t instanceof HTMLAudioElement ? e.source = t : Array.isArray(t) ? e.url = t : e = t, e = N({ autoPlay: false, singleInstance: false, url: null, source: null, preload: false, volume: 1, speed: 1, complete: null, loaded: null, loop: false }, e), Object.freeze(e);
    const s = l().useLegacy ? new j3() : new C();
    return new v(s, e);
  }
  constructor(t, e) {
    this.media = t, this.options = e, this._instances = [], this._sprites = {}, this.media.init(this);
    const s = e.complete;
    this._autoPlayOptions = s ? { complete: s } : null, this.isLoaded = false, this._preloadQueue = null, this.isPlaying = false, this.autoPlay = e.autoPlay, this.singleInstance = e.singleInstance, this.preload = e.preload || this.autoPlay, this.url = Array.isArray(e.url) ? this.preferUrl(e.url) : e.url, this.speed = e.speed, this.volume = e.volume, this.loop = e.loop, e.sprites && this.addSprites(e.sprites), this.preload && this._preload(e.loaded);
  }
  preferUrl(t) {
    const [e] = t.map((s) => ({ url: s, ext: path.extname(s).slice(1) })).filter(({ ext: s }) => F[s]).sort((s, r) => A4.indexOf(s.ext) - A4.indexOf(r.ext));
    if (!e) throw new Error("No supported file type found");
    return e.url;
  }
  get context() {
    return l().context;
  }
  pause() {
    return this.isPlaying = false, this.paused = true, this;
  }
  resume() {
    return this.isPlaying = this._instances.length > 0, this.paused = false, this;
  }
  get paused() {
    return this._paused;
  }
  set paused(t) {
    this._paused = t, this.refreshPaused();
  }
  get speed() {
    return this._speed;
  }
  set speed(t) {
    this._speed = t, this.refresh();
  }
  get filters() {
    return this.media.filters;
  }
  set filters(t) {
    this.media.filters = t;
  }
  addSprites(t, e) {
    if (typeof t == "object") {
      const r = {};
      for (const n in t) r[n] = this.addSprites(n, t[n]);
      return r;
    }
    console.assert(!this._sprites[t], `Alias ${t} is already taken`);
    const s = new B(this, e);
    return this._sprites[t] = s, s;
  }
  destroy() {
    this._removeInstances(), this.removeSprites(), this.media.destroy(), this.media = null, this._sprites = null, this._instances = null;
  }
  removeSprites(t) {
    if (t) {
      const e = this._sprites[t];
      e !== void 0 && (e.destroy(), delete this._sprites[t]);
    } else for (const e in this._sprites) this.removeSprites(e);
    return this;
  }
  get isPlayable() {
    return this.isLoaded && this.media && this.media.isPlayable;
  }
  stop() {
    if (!this.isPlayable) return this.autoPlay = false, this._autoPlayOptions = null, this;
    this.isPlaying = false;
    for (let t = this._instances.length - 1; t >= 0; t--) this._instances[t].stop();
    return this;
  }
  play(t, e) {
    let s;
    if (typeof t == "string" ? s = { sprite: t, loop: this.loop, complete: e } : typeof t == "function" ? (s = {}, s.complete = t) : s = t, s = N({ complete: null, loaded: null, sprite: null, end: null, start: 0, volume: 1, speed: 1, muted: false, loop: false }, s || {}), s.sprite) {
      const n = s.sprite;
      console.assert(!!this._sprites[n], `Alias ${n} is not available`);
      const o = this._sprites[n];
      s.start = o.start + (s.start || 0), s.end = o.end, s.speed = o.speed || 1, s.loop = o.loop || s.loop, delete s.sprite;
    }
    if (s.offset && (s.start = s.offset), !this.isLoaded) return this._preloadQueue ? new Promise((n) => {
      this._preloadQueue.push(() => {
        n(this.play(s));
      });
    }) : (this._preloadQueue = [], this.autoPlay = true, this._autoPlayOptions = s, new Promise((n, o) => {
      this._preload((a, h, d) => {
        this._preloadQueue.forEach((c) => c()), this._preloadQueue = null, a ? o(a) : (s.loaded && s.loaded(a, h, d), n(d));
      });
    }));
    (this.singleInstance || s.singleInstance) && this._removeInstances();
    const r = this._createInstance();
    return this._instances.push(r), this.isPlaying = true, r.once("end", () => {
      s.complete && s.complete(this), this._onComplete(r);
    }), r.once("stop", () => {
      this._onComplete(r);
    }), r.play(s), r;
  }
  refresh() {
    const t = this._instances.length;
    for (let e = 0; e < t; e++) this._instances[e].refresh();
  }
  refreshPaused() {
    const t = this._instances.length;
    for (let e = 0; e < t; e++) this._instances[e].refreshPaused();
  }
  get volume() {
    return this._volume;
  }
  set volume(t) {
    this._volume = t, this.refresh();
  }
  get muted() {
    return this._muted;
  }
  set muted(t) {
    this._muted = t, this.refresh();
  }
  get loop() {
    return this._loop;
  }
  set loop(t) {
    this._loop = t, this.refresh();
  }
  _preload(t) {
    this.media.load(t);
  }
  get instances() {
    return this._instances;
  }
  get sprites() {
    return this._sprites;
  }
  get duration() {
    return this.media.duration;
  }
  autoPlayStart() {
    let t;
    return this.autoPlay && (t = this.play(this._autoPlayOptions)), t;
  }
  _removeInstances() {
    for (let t = this._instances.length - 1; t >= 0; t--) this._poolInstance(this._instances[t]);
    this._instances.length = 0;
  }
  _onComplete(t) {
    if (this._instances) {
      const e = this._instances.indexOf(t);
      e > -1 && this._instances.splice(e, 1), this.isPlaying = this._instances.length > 0;
    }
    this._poolInstance(t);
  }
  _createInstance() {
    if (v._pool.length > 0) {
      const t = v._pool.pop();
      return t.init(this.media), t;
    }
    return this.media.create();
  }
  _poolInstance(t) {
    t.destroy(), v._pool.indexOf(t) < 0 && v._pool.push(t);
  }
};
let x = v;
x._pool = [];
let S = class extends O {
  constructor() {
    const t = window, e = new S.AudioContext(), s = e.createDynamicsCompressor(), r = e.createAnalyser();
    r.connect(s), s.connect(e.destination), super(r, s), this.autoPause = true, this._ctx = e, this._offlineCtx = new S.OfflineAudioContext(1, 2, t.OfflineAudioContext ? Math.max(8e3, Math.min(96e3, e.sampleRate)) : 44100), this.compressor = s, this.analyser = r, this.events = new EventEmitter(), this.volume = 1, this.speed = 1, this.muted = false, this.paused = false, this._locked = e.state === "suspended" && ("ontouchstart" in globalThis || "onclick" in globalThis), this._locked && (this._unlock(), this._unlock = this._unlock.bind(this), document.addEventListener("mousedown", this._unlock, true), document.addEventListener("touchstart", this._unlock, true), document.addEventListener("touchend", this._unlock, true)), this.onFocus = this.onFocus.bind(this), this.onBlur = this.onBlur.bind(this), globalThis.addEventListener("focus", this.onFocus), globalThis.addEventListener("blur", this.onBlur);
  }
  onFocus() {
    if (!this.autoPause) return;
    const t = this._ctx.state;
    (t === "suspended" || t === "interrupted" || !this._locked) && (this.paused = this._pausedOnBlur, this.refreshPaused());
  }
  onBlur() {
    this.autoPause && (this._locked || (this._pausedOnBlur = this._paused, this.paused = true, this.refreshPaused()));
  }
  _unlock() {
    this._locked && (this.playEmptySound(), this._ctx.state === "running" && (document.removeEventListener("mousedown", this._unlock, true), document.removeEventListener("touchend", this._unlock, true), document.removeEventListener("touchstart", this._unlock, true), this._locked = false));
  }
  playEmptySound() {
    const t = this._ctx.createBufferSource();
    t.buffer = this._ctx.createBuffer(1, 1, 22050), t.connect(this._ctx.destination), t.start(0, 0, 0), t.context.state === "suspended" && t.context.resume();
  }
  static get AudioContext() {
    const t = window;
    return t.AudioContext || t.webkitAudioContext || null;
  }
  static get OfflineAudioContext() {
    const t = window;
    return t.OfflineAudioContext || t.webkitOfflineAudioContext || null;
  }
  destroy() {
    super.destroy();
    const t = this._ctx;
    typeof t.close != "undefined" && t.close(), globalThis.removeEventListener("focus", this.onFocus), globalThis.removeEventListener("blur", this.onBlur), this.events.removeAllListeners(), this.analyser.disconnect(), this.compressor.disconnect(), this.analyser = null, this.compressor = null, this.events = null, this._offlineCtx = null, this._ctx = null;
  }
  get audioContext() {
    return this._ctx;
  }
  get offlineContext() {
    return this._offlineCtx;
  }
  set paused(t) {
    t && this._ctx.state === "running" ? this._ctx.suspend() : !t && this._ctx.state === "suspended" && this._ctx.resume(), this._paused = t;
  }
  get paused() {
    return this._paused;
  }
  refresh() {
    this.events.emit("refresh");
  }
  refreshPaused() {
    this.events.emit("refreshPaused");
  }
  toggleMute() {
    return this.muted = !this.muted, this.refresh(), this.muted;
  }
  togglePause() {
    return this.paused = !this.paused, this.refreshPaused(), this._paused;
  }
  decode(t, e) {
    const s = (n) => {
      e(new Error((n == null ? void 0 : n.message) || "Unable to decode file"));
    }, r = this._offlineCtx.decodeAudioData(t, (n) => {
      e(null, n);
    }, s);
    r && r.catch(s);
  }
};
var St = Object.defineProperty, z3 = Object.getOwnPropertySymbols, Lt2 = Object.prototype.hasOwnProperty, Ct = Object.prototype.propertyIsEnumerable, W = (i, t, e) => t in i ? St(i, t, { enumerable: true, configurable: true, writable: true, value: e }) : i[t] = e, Q = (i, t) => {
  for (var e in t || (t = {})) Lt2.call(t, e) && W(i, e, t[e]);
  if (z3) for (var e of z3(t)) Ct.call(t, e) && W(i, e, t[e]);
  return i;
};
let Z = class {
  constructor() {
    this.init();
  }
  init() {
    return this.supported && (this._webAudioContext = new S()), this._htmlAudioContext = new I(), this._sounds = {}, this.useLegacy = !this.supported, this;
  }
  get context() {
    return this._context;
  }
  get filtersAll() {
    return this.useLegacy ? [] : this._context.filters;
  }
  set filtersAll(t) {
    this.useLegacy || (this._context.filters = t);
  }
  get supported() {
    return S.AudioContext !== null;
  }
  add(t, e) {
    if (typeof t == "object") {
      const n = {};
      for (const o in t) {
        const a = this._getOptions(t[o], e);
        n[o] = this.add(o, a);
      }
      return n;
    }
    if (console.assert(!this._sounds[t], `Sound with alias ${t} already exists.`), e instanceof x) return this._sounds[t] = e, e;
    const s = this._getOptions(e), r = x.from(s);
    return this._sounds[t] = r, r;
  }
  _getOptions(t, e) {
    let s;
    return typeof t == "string" ? s = { url: t } : Array.isArray(t) ? s = { url: t } : t instanceof ArrayBuffer || t instanceof AudioBuffer || t instanceof HTMLAudioElement ? s = { source: t } : s = t, s = Q(Q({}, s), e || {}), s;
  }
  get useLegacy() {
    return this._useLegacy;
  }
  set useLegacy(t) {
    this._useLegacy = t, this._context = !t && this.supported ? this._webAudioContext : this._htmlAudioContext;
  }
  get disableAutoPause() {
    return !this._webAudioContext.autoPause;
  }
  set disableAutoPause(t) {
    this._webAudioContext.autoPause = !t;
  }
  remove(t) {
    return this.exists(t, true), this._sounds[t].destroy(), delete this._sounds[t], this;
  }
  get volumeAll() {
    return this._context.volume;
  }
  set volumeAll(t) {
    this._context.volume = t, this._context.refresh();
  }
  get speedAll() {
    return this._context.speed;
  }
  set speedAll(t) {
    this._context.speed = t, this._context.refresh();
  }
  togglePauseAll() {
    return this._context.togglePause();
  }
  pauseAll() {
    return this._context.paused = true, this._context.refreshPaused(), this;
  }
  resumeAll() {
    return this._context.paused = false, this._context.refreshPaused(), this;
  }
  toggleMuteAll() {
    return this._context.toggleMute();
  }
  muteAll() {
    return this._context.muted = true, this._context.refresh(), this;
  }
  unmuteAll() {
    return this._context.muted = false, this._context.refresh(), this;
  }
  removeAll() {
    for (const t in this._sounds) this._sounds[t].destroy(), delete this._sounds[t];
    return this;
  }
  stopAll() {
    for (const t in this._sounds) this._sounds[t].stop();
    return this;
  }
  exists(t, e = false) {
    const s = !!this._sounds[t];
    return e && console.assert(s, `No sound matching alias '${t}'.`), s;
  }
  isPlaying() {
    for (const t in this._sounds) if (this._sounds[t].isPlaying) return true;
    return false;
  }
  find(t) {
    return this.exists(t, true), this._sounds[t];
  }
  play(t, e) {
    return this.find(t).play(e);
  }
  stop(t) {
    return this.find(t).stop();
  }
  pause(t) {
    return this.find(t).pause();
  }
  resume(t) {
    return this.find(t).resume();
  }
  volume(t, e) {
    const s = this.find(t);
    return e !== void 0 && (s.volume = e), s.volume;
  }
  speed(t, e) {
    const s = this.find(t);
    return e !== void 0 && (s.speed = e), s.speed;
  }
  duration(t) {
    return this.find(t).duration;
  }
  close() {
    return this.removeAll(), this._sounds = null, this._webAudioContext && (this._webAudioContext.destroy(), this._webAudioContext = null), this._htmlAudioContext && (this._htmlAudioContext.destroy(), this._htmlAudioContext = null), this._context = null, this;
  }
};
var Gt = Object.defineProperty, Kt = Object.defineProperties, Rt2 = Object.getOwnPropertyDescriptors, tt = Object.getOwnPropertySymbols, Dt = Object.prototype.hasOwnProperty, qt = Object.prototype.propertyIsEnumerable, et = (i, t, e) => t in i ? Gt(i, t, { enumerable: true, configurable: true, writable: true, value: e }) : i[t] = e, Ut2 = (i, t) => {
  for (var e in t || (t = {})) Dt.call(t, e) && et(i, e, t[e]);
  if (tt) for (var e of tt(t)) qt.call(t, e) && et(i, e, t[e]);
  return i;
}, Vt = (i, t) => Kt(i, Rt2(t));
const st2 = (i) => {
  var t;
  const e = i.src;
  let s = (t = i == null ? void 0 : i.alias) == null ? void 0 : t[0];
  return (!s || i.src === s) && (s = path.basename(e, path.extname(e))), s;
}, it = { extension: ExtensionType.Asset, detection: { test: async () => true, add: async (i) => [...i, ...A4.filter((t) => F[t])], remove: async (i) => i.filter((t) => i.includes(t)) }, loader: { name: "sound", extension: { type: [ExtensionType.LoadParser], priority: LoaderParserPriority.High }, test(i) {
  const t = path.extname(i).slice(1);
  return !!F[t] || R3.some((e) => i.startsWith(`data:${e}`));
}, async load(i, t) {
  const e = await new Promise((s, r) => x.from(Vt(Ut2({}, t.data), { url: i, preload: true, loaded(n, o) {
    var a, h;
    n ? r(n) : s(o), (h = (a = t.data) == null ? void 0 : a.loaded) == null || h.call(a, n, o);
  } })));
  return l().add(st2(t), e), e;
}, async unload(i, t) {
  l().remove(st2(t));
} } };
extensions.add(it);
const Ht = ut(new Z());
class WheelMonitor {
  constructor(player) {
    __publicField(this, "player");
    this.player = player;
    this.player.stage.addEventListener("wheel", (e) => {
      if (this.isEditMode && this.editorMode === EditorMode.Manipulation) {
        return;
      }
      this.player.dispatchEvent(new CustomEvent("playerWheel", {
        detail: {
          delta: e.deltaY / 1e3
        }
      }));
      const message = { type: Events.PLAYER_WHEEL ? Events.PLAYER_WHEEL : "PLAYER_WHEEL" };
      window.postMessage(message, "*");
      window.parent.postMessage(message, "*");
    });
  }
  get isEditMode() {
    return this.player.isEditMode;
  }
  get editorMode() {
    return this.player.editorMode;
  }
}
class Content {
  constructor(player) {
    __publicField(this, "player");
    __publicField(this, "sourceNodes");
    __publicField(this, "nodeHierarchy");
    __publicField(this, "runtimeNodes");
    __publicField(this, "selectionIndicators");
    this.player = player;
    this.sourceNodes = [];
    this.nodeHierarchy = [];
    this.runtimeNodes = [];
    this.selectionIndicators = [];
  }
  get stage() {
    return this.player.stage;
  }
  get pixelRatio() {
    return this.player.layout.pixelRatio;
  }
  get isEditMode() {
    return this.player.isEditMode;
  }
  get referenceWidth() {
    return this.player.layout.referenceWidth;
  }
  get referenceHeight() {
    return this.player.layout.referenceHeight;
  }
  get xScalingFactor() {
    return this.player.layout.xScalingFactor;
  }
  get yScalingFactor() {
    return this.player.layout.yScalingFactor;
  }
  async initializeScene(scene) {
    this.sourceNodes = scene.nodes;
    this.nodeHierarchy = buildHierarchy(this.sourceNodes);
    await this.processNodeHierarchy(this.nodeHierarchy);
  }
  createDomElement(nodeData) {
    let domElement;
    switch (nodeData.type) {
      case "Text":
        domElement = new Ka({
          text: nodeData.properties.content
        });
        break;
      case "Image":
        if (nodeData.properties.imageId) {
          domElement = Ut$1.from(nodeData.properties.imageId);
        } else {
          domElement = new lr();
        }
        break;
      case "Group":
        domElement = new lt();
        break;
      case "Graphic":
        domElement = new lr();
        break;
      default: {
        console.log("unknown element type", nodeData.type);
      }
    }
    return domElement;
  }
  getTranslateString(position) {
    return `translate(${position.x}px, ${position.y}px)`;
  }
  async processNodeHierarchy(nodeArray, parentNode) {
    await Promise.all(nodeArray.map(async (nodeData) => {
      const stageElement = this.createDomElement(nodeData);
      let runtimeNode = {
        ...nodeData,
        stageElement,
        normalizedPosition: { x: 0, y: 0 },
        clips: [],
        parentNode,
        runtimeProperties: structuredClone(nodeData.properties)
      };
      if (nodeData.type === "Group") {
        this.player.appendStageElement(runtimeNode.stageElement, parentNode);
        runtimeNode.stageElement.x = this.player.getStageWidth() / 2;
        runtimeNode.stageElement.y = this.player.getStageHeight() / 2;
        runtimeNode.stageElement.scale.x = nodeData.properties.scale.x;
        runtimeNode.stageElement.scale.y = nodeData.properties.scale.y;
        const pivotX = (nodeData.properties.pivot.x - 0.5) * runtimeNode.stageElement.width;
        const pivotY = (nodeData.properties.pivot.y - 0.5) * runtimeNode.stageElement.height;
        runtimeNode.stageElement.pivot.set(pivotX, pivotY);
      } else if (nodeData.type === "Text") {
        this.player.appendStageElement(runtimeNode.stageElement, parentNode);
        runtimeNode.stageElement.anchor.set(0.5);
        const fontSize = nodeData.properties.fontSize;
        const style = new Dt$1({
          fontSize: fontSize * this.yScalingFactor,
          fill: getFillColor(nodeData.properties.color, nodeData.properties.opacity),
          letterSpacing: nodeData.properties.letterSpacing !== void 0 ? nodeData.properties.letterSpacing * (fontSize / 100) * this.yScalingFactor : 0,
          align: nodeData.properties.align || "left"
        });
        if (nodeData.properties.lineHeight !== null && nodeData.properties.lineHeight !== void 0 && nodeData.properties.lineHeight > 0) {
          style.lineHeight = nodeData.properties.lineHeight * (fontSize / 100) * this.yScalingFactor;
        }
        if (nodeData.properties.wordWrap && nodeData.properties.wordWrapWidth !== null && nodeData.properties.wordWrapWidth !== void 0) {
          style.wordWrap = true;
          style.wordWrapWidth = nodeData.properties.wordWrapWidth * this.xScalingFactor;
        }
        if (nodeData.properties.fontFamily) {
          const fontFamily = this.player.fontFamilies.find((family) => family.id === nodeData.properties.fontFamily);
          if (fontFamily) {
            style.fontFamily = nodeData.properties.fontFamily;
          }
        }
        runtimeNode.stageElement.style = style;
        const textMetrics = Ot.measureText(nodeData.properties.content, style);
        const textWidth = textMetrics.width;
        const textHeight = textMetrics.height;
        const pivotX = (nodeData.properties.pivot.x - 0.5) * textWidth;
        const pivotY = (nodeData.properties.pivot.y - 0.5) * textHeight;
        runtimeNode.stageElement.pivot.set(pivotX, pivotY);
        runtimeNode.stageElement.scale.x = nodeData.properties.scale.x;
        runtimeNode.stageElement.scale.y = nodeData.properties.scale.y;
      } else if (nodeData.type === "Image") {
        const imageId = nodeData.properties.imageId;
        if (imageId) {
          this.player.appendStageElement(runtimeNode.stageElement, parentNode);
          const imageAsset = this.player.imageAssets.find((image) => image.id === imageId);
          runtimeNode.stageElement.width = (imageAsset == null ? void 0 : imageAsset.image.width) * this.xScalingFactor * nodeData.properties.scale.x;
          runtimeNode.stageElement.height = (imageAsset == null ? void 0 : imageAsset.image.height) * this.yScalingFactor * nodeData.properties.scale.y;
          runtimeNode.stageElement.alpha = nodeData.properties.opacity;
          const pivotX = (nodeData.properties.pivot.x - 0.5) * runtimeNode.stageElement.width;
          const pivotY = (nodeData.properties.pivot.y - 0.5) * runtimeNode.stageElement.height;
          runtimeNode.stageElement.pivot.set(pivotX, pivotY);
          runtimeNode.stageElement.anchor.set(0.5);
        } else if (this.isEditMode) {
          runtimeNode.stageElement.rect(-50 * this.xScalingFactor, -50 * this.yScalingFactor, 100 * this.xScalingFactor, 100 * this.yScalingFactor);
          runtimeNode.stageElement.fill("#BF3EFF");
          this.player.appendStageElement(runtimeNode.stageElement, parentNode);
        }
      } else if (nodeData.type === "Graphic") {
        let xDimension;
        let yDimension;
        xDimension = 100 * this.xScalingFactor;
        yDimension = 100 * this.yScalingFactor;
        runtimeNode.graphicsContext = new ct();
        if (nodeData.properties.graphicType === GraphicType.Rectangle) {
          runtimeNode.graphicsContext.rect(-0.5 * xDimension, -0.5 * yDimension, xDimension, yDimension);
        } else if (nodeData.properties.graphicType === GraphicType.Circle) {
          runtimeNode.graphicsContext.circle(0, 0, 0.5 * xDimension);
        } else if (nodeData.properties.graphicType === GraphicType.Polygon) {
          runtimeNode.graphicsContext.regularPoly(0, 0, xDimension, nodeData.properties.sides);
        } else if (nodeData.properties.graphicType === GraphicType.RoundedPolygon) {
          runtimeNode.graphicsContext.roundPoly(0, 0, xDimension, nodeData.properties.sides, nodeData.properties.cornerRadius);
        } else if (nodeData.properties.graphicType === GraphicType.Star) {
          runtimeNode.graphicsContext.star(0, 0, nodeData.properties.points, xDimension, nodeData.properties.innerRadius);
        }
        runtimeNode.graphicsContext.fill(nodeData.properties.color || "#000000");
        runtimeNode.stageElement.context = runtimeNode.graphicsContext;
        runtimeNode.stageElement.scale.x = nodeData.properties.scale.x / 100;
        runtimeNode.stageElement.scale.y = nodeData.properties.scale.y / 100;
        const pivotX = (nodeData.properties.pivot.x - 0.5) * xDimension;
        const pivotY = (nodeData.properties.pivot.y - 0.5) * yDimension;
        runtimeNode.stageElement.pivot.set(pivotX, pivotY);
        runtimeNode.stageElement.alpha = nodeData.properties.opacity;
        this.player.appendStageElement(runtimeNode.stageElement, parentNode);
      }
      runtimeNode.stageElement.zIndex = nodeData.properties.zIndex;
      runtimeNode.stageElement.name = `${nodeData.type}-${nodeData.id}`;
      runtimeNode.stageElement.angle = nodeData.properties.rotation || 0;
      const normalizedPosition = this.player.getNormalizedPosition(nodeData.properties.position, parentNode);
      runtimeNode.normalizedPosition = normalizedPosition;
      runtimeNode.stageElement.x = normalizedPosition.x;
      runtimeNode.stageElement.y = normalizedPosition.y;
      runtimeNode.stageElement.cullable = true;
      this.runtimeNodes.push(runtimeNode);
      if (nodeData.children) {
        await this.processNodeHierarchy(nodeData.children, runtimeNode);
      }
    }));
  }
  clearContent() {
    this.runtimeNodes = [];
    this.sourceNodes = [];
  }
  getRedrawnGraphicsContext(runtimeNode, newColor) {
    if (runtimeNode.type !== "Graphic") {
      return;
    }
    const nodeData = runtimeNode;
    const graphicsContext = new ct();
    let xDimension;
    let yDimension;
    xDimension = 100 * this.xScalingFactor;
    yDimension = 100 * this.yScalingFactor;
    if (nodeData.properties.graphicType === GraphicType.Rectangle) {
      graphicsContext.rect(-0.5 * xDimension, -0.5 * yDimension, xDimension, yDimension);
    } else if (nodeData.properties.graphicType === GraphicType.Circle) {
      graphicsContext.circle(0, 0, 0.5 * xDimension);
    } else if (nodeData.properties.graphicType === GraphicType.Polygon) {
      graphicsContext.regularPoly(0, 0, xDimension, nodeData.properties.sides);
    } else if (nodeData.properties.graphicType === GraphicType.RoundedPolygon) {
      graphicsContext.roundPoly(0, 0, xDimension, nodeData.properties.sides, nodeData.properties.cornerRadius);
    } else if (nodeData.properties.graphicType === GraphicType.Star) {
      graphicsContext.star(0, 0, nodeData.properties.points, xDimension, nodeData.properties.innerRadius);
    }
    graphicsContext.fill(newColor);
    return graphicsContext;
  }
}
class Layout {
  constructor(player, scrollCinemaContainer) {
    __publicField(this, "scrollCinemaContainer");
    __publicField(this, "player");
    __publicField(this, "xScalingFactor");
    __publicField(this, "yScalingFactor");
    __publicField(this, "pixelRatio");
    __publicField(this, "screenScale");
    __publicField(this, "referenceWidth");
    __publicField(this, "referenceHeight");
    __publicField(this, "aspectRatio");
    this.player = player;
    this.scrollCinemaContainer = scrollCinemaContainer;
    this.referenceWidth = 1080;
    this.referenceHeight = 1920;
    this.aspectRatio = this.referenceWidth / this.referenceHeight;
    this.xScalingFactor = 0;
    this.yScalingFactor = 0;
    this.pixelRatio = window.devicePixelRatio || 1;
    this.screenScale = Math.min(window.innerWidth, window.innerHeight) / 1500;
    window.onbeforeunload = () => {
      this.scrollCinemaContainer.style.display = "none";
      window.scrollTo(0, 0);
    };
  }
  setLayoutSize(sourceWindowHeight) {
    const playerHeight = sourceWindowHeight;
    const playerWidth = playerHeight * this.aspectRatio;
    const roundedWidth = Math.round(playerWidth);
    const roundedHeight = Math.round(playerHeight);
    this.scrollCinemaContainer.style.width = `${roundedWidth}px`;
    this.scrollCinemaContainer.style.height = `${roundedHeight}px`;
    this.scrollCinemaContainer.style.transition = "top 0.5s ease-in-out";
    this.scrollCinemaContainer.style.top = (sourceWindowHeight - roundedHeight) / 2 + this.getAddressBarHeight() / 2 + "px";
    this.xScalingFactor = roundedWidth / this.referenceWidth;
    this.yScalingFactor = roundedHeight / this.referenceHeight;
  }
  getAddressBarHeight() {
    const dvh = window.innerHeight;
    const vh2 = document.documentElement.clientHeight;
    const addressBarHeight = vh2 - dvh;
    return Math.abs(addressBarHeight);
  }
  getNormalizedWidth(width) {
    return width * this.xScalingFactor;
  }
  getNormalizedHeight(height) {
    return height * this.yScalingFactor;
  }
  getNormalizedPosition(position, parentElement) {
    let positionX;
    let positionY;
    if (parentElement) {
      positionX = (position == null ? void 0 : position.x) * this.xScalingFactor || 0;
      positionY = (position == null ? void 0 : position.y) * this.yScalingFactor * -1 || 0;
    } else {
      positionX = ((position == null ? void 0 : position.x) * this.xScalingFactor || 0) + this.scrollCinemaContainer.clientWidth / 2;
      positionY = ((position == null ? void 0 : position.y) * this.yScalingFactor * -1 || 0) + this.scrollCinemaContainer.clientHeight / 2;
    }
    return {
      x: positionX,
      y: positionY
    };
  }
  getEditorPosition(normalizedPosition, parentElement) {
    let positionX;
    let positionY;
    if (parentElement) {
      positionX = normalizedPosition.x / this.xScalingFactor;
      positionY = normalizedPosition.y / this.yScalingFactor * -1;
    } else {
      positionX = (normalizedPosition.x - this.scrollCinemaContainer.clientWidth / 2) / this.xScalingFactor;
      positionY = (normalizedPosition.y - this.scrollCinemaContainer.clientHeight / 2) / this.yScalingFactor * -1;
    }
    return {
      x: positionX,
      y: positionY
    };
  }
}
class RuntimeFontFamily {
  constructor(fontFamily) {
    __publicField(this, "id");
    __publicField(this, "name");
    __publicField(this, "path");
    __publicField(this, "type");
    __publicField(this, "fileSize");
    __publicField(this, "font");
    this.id = fontFamily.id;
    this.name = fontFamily.name;
    this.path = fontFamily.path;
    this.type = fontFamily.type;
    this.fileSize = fontFamily.fileSize;
  }
  static async create(fontFamily) {
    const instance = new RuntimeFontFamily(fontFamily);
    await instance.initialize();
    return instance;
  }
  async initialize() {
    const fontFamily = await new Promise(async (resolve, reject) => {
      const font = await Yr.load({
        alias: this.id,
        src: this.path,
        type: "font",
        data: {
          family: this.id
        }
      });
      resolve(font);
    });
    this.font = fontFamily;
  }
}
class TouchMonitor {
  constructor(player) {
    __publicField(this, "player");
    __publicField(this, "scrollDelta");
    __publicField(this, "lastScrollY");
    __publicField(this, "isTouching");
    __publicField(this, "touchStartY");
    __publicField(this, "touchStartX");
    __publicField(this, "lastTouchY");
    __publicField(this, "lastTouchTime");
    __publicField(this, "velocity");
    __publicField(this, "hasMomentum");
    __publicField(this, "momentumStartTime");
    __publicField(this, "momentumStartVelocity");
    // Spring-damper system parameters
    __publicField(this, "kSpring", 0.3);
    // Increased spring constant for less oscillation
    __publicField(this, "cDamper", 5);
    // Increased damping for faster decay
    __publicField(this, "mass", 3);
    // Increased mass to reduce flick sensitivity
    // Velocity calculation parameters
    __publicField(this, "maxVelocitySamples", 5);
    // Reduced samples for more immediate response
    __publicField(this, "velocitySamples", []);
    this.player = player;
    this.scrollDelta = 0;
    this.lastScrollY = 0;
    this.isTouching = false;
    this.touchStartY = 0;
    this.touchStartX = 0;
    this.lastTouchY = 0;
    this.lastTouchTime = 0;
    this.velocity = 0;
    this.hasMomentum = false;
    this.momentumStartTime = 0;
    this.momentumStartVelocity = 0;
    this.velocitySamples = [];
    this.stage.addEventListener("pointerdown", (e) => {
      if (this.isEditMode && this.editorMode === EditorMode.Manipulation) {
        return;
      }
      this.hasMomentum = false;
      this.velocity = 0;
      this.isTouching = true;
      this.player.dispatchEvent(new CustomEvent("playerPointerDown"));
      this.touchStartY = e.clientY;
      this.touchStartX = e.clientX;
      this.lastTouchY = e.clientY;
      this.lastTouchTime = performance.now();
      const message = { type: Events.PLAYER_POINTER_DOWN ? Events.PLAYER_POINTER_DOWN : "PLAYER_POINTER_DOWN" };
      window.postMessage(message, "*");
      window.parent.postMessage(message, "*");
    });
    this.stage.addEventListener("pointermove", (e) => {
      if (this.isEditMode && this.editorMode === EditorMode.Manipulation) {
        return;
      }
      if (!this.isTouching) {
        return;
      }
      const currentTime = performance.now();
      const touchY = e.clientY;
      const deltaY = touchY - this.lastTouchY;
      this.velocitySamples.push({
        time: currentTime,
        delta: deltaY
      });
      if (this.velocitySamples.length > this.maxVelocitySamples) {
        this.velocitySamples.shift();
      }
      if (this.velocitySamples.length >= 2) {
        const oldestSample = this.velocitySamples[0];
        const newestSample = this.velocitySamples[this.velocitySamples.length - 1];
        const timeDelta = newestSample.time - oldestSample.time;
        if (timeDelta < 1) {
          return;
        }
        const totalDelta = this.velocitySamples.reduce((sum, sample) => sum + sample.delta, 0);
        this.velocity = totalDelta / timeDelta;
      }
      this.player.dispatchEvent(new CustomEvent("playerPointerMove", {
        detail: {
          delta: -deltaY / 1e3
        }
      }));
      this.lastTouchY = touchY;
      this.lastTouchTime = currentTime;
    });
    window.addEventListener("pointerup", (e) => {
      if (this.isEditMode && this.editorMode === EditorMode.Manipulation) {
        return;
      }
      this.isTouching = false;
      this.player.dispatchEvent(new CustomEvent("playerPointerUp"));
      if (Math.abs(this.velocity) > 0.05) {
        this.hasMomentum = true;
        this.momentumStartTime = performance.now();
        const scaledVelocity = this.velocity * this.pixelRatio * this.screenScale * 0.8;
        this.momentumStartVelocity = scaledVelocity;
        this.velocity = scaledVelocity;
      } else {
        this.hasMomentum = false;
        this.velocity = 0;
      }
      this.velocitySamples = [];
    });
  }
  get stage() {
    return this.player.stage;
  }
  get isEditMode() {
    return this.player.isEditMode;
  }
  get editorMode() {
    return this.player.editorMode;
  }
  get pixelRatio() {
    return this.player.layout.pixelRatio;
  }
  get screenScale() {
    return this.player.layout.screenScale;
  }
  get deltaTime() {
    return this.player.deltaTime;
  }
  update() {
    if (this.isEditMode && this.editorMode === EditorMode.Manipulation) {
      return;
    }
    if (this.hasMomentum) {
      if (this.deltaTime <= 0 || !isFinite(this.deltaTime)) {
        console.warn("Invalid delta in momentum update:", this.deltaTime);
        return;
      }
      if (!isFinite(this.velocity)) {
        console.warn("Invalid velocity in momentum update:", this.velocity);
        this.hasMomentum = false;
        this.velocity = 0;
        return;
      }
      const springForce = -this.kSpring * this.velocity;
      const dampingForce = -this.cDamper * this.velocity;
      const acceleration = (springForce + dampingForce) / this.mass;
      this.velocity += acceleration * this.deltaTime;
      if (Math.abs(this.velocity) < 0.01) {
        this.hasMomentum = false;
        this.velocity = 0;
        return;
      }
      const scrollAmount = -this.velocity * this.deltaTime;
      this.player.dispatchEvent(new CustomEvent("playerMomentum", {
        detail: {
          delta: scrollAmount
        }
      }));
    }
  }
  resetMomentum() {
    this.hasMomentum = false;
    this.velocity = 0;
  }
}
class RuntimeAudioSource {
  constructor(audioSource) {
    __publicField(this, "id");
    __publicField(this, "name");
    __publicField(this, "path");
    __publicField(this, "type");
    __publicField(this, "fileSize");
    __publicField(this, "playOnStart");
    __publicField(this, "loop");
    __publicField(this, "volume");
    __publicField(this, "sound");
    this.id = audioSource.id;
    this.name = audioSource.name;
    this.path = audioSource.path;
    this.type = audioSource.type;
    this.fileSize = audioSource.fileSize;
    this.playOnStart = audioSource.playOnStart;
    this.loop = audioSource.loop;
    this.volume = audioSource.volume;
  }
  static async create(audioSource) {
    const instance = new RuntimeAudioSource(audioSource);
    await instance.initialize();
    return instance;
  }
  async initialize() {
    const audioSource = await new Promise(async (resolve, reject) => {
      x.from({
        url: this.path,
        preload: true,
        volume: this.volume,
        loop: this.loop,
        loaded: (err, sound) => {
          resolve(sound);
        }
      });
    });
    this.sound = audioSource;
  }
}
class AutorunExtents {
  constructor(startTime, endTime) {
    __publicField(this, "startTime");
    __publicField(this, "endTime");
    this.startTime = startTime;
    this.endTime = endTime;
  }
  static timeWithinThresholdBothBoundsExclusiveAscending(sourceTime, intervals) {
    for (let q3 = 0; q3 < intervals.length; q3++) {
      if (sourceTime > intervals[q3].startTime && sourceTime < intervals[q3].endTime) {
        return intervals[q3];
      }
    }
    return null;
  }
}
class RuntimeSequence {
  constructor(sourceSequence, player) {
    __publicField(this, "id");
    __publicField(this, "initialized");
    __publicField(this, "name");
    __publicField(this, "sourceTracks");
    __publicField(this, "runtimeTracks");
    __publicField(this, "active");
    __publicField(this, "currentTime");
    __publicField(this, "selectedClips");
    __publicField(this, "selectedTracks");
    __publicField(this, "startTime");
    __publicField(this, "duration");
    __publicField(this, "player");
    __publicField(this, "previousTime");
    __publicField(this, "timelineWindowId");
    __publicField(this, "wrapMode");
    __publicField(this, "timelinePreviewWindowId");
    __publicField(this, "autorunMarkers");
    __publicField(this, "autorunIntervals");
    __publicField(this, "path");
    __publicField(this, "type");
    __publicField(this, "eligibleForAutoplay", false);
    __publicField(this, "previousIsReversing", false);
    __publicField(this, "previewAudio");
    const { id: id2, name, active, tracks, currentTime, defaultTime, autorunMarkers, previewAudio } = sourceSequence;
    this.player = player;
    this.id = id2;
    this.initialized = false;
    this.name = name;
    this.active = active;
    if (this.isEditMode) {
      this.currentTime = currentTime;
    } else {
      this.currentTime = defaultTime;
    }
    this.duration = 0;
    this.selectedClips = [];
    this.selectedTracks = [];
    this.previousTime = 0;
    this.timelineWindowId = null;
    this.sourceTracks = tracks;
    this.runtimeTracks = tracks;
    this.autorunMarkers = autorunMarkers;
    this.previewAudio = previewAudio;
  }
  get nodes() {
    return this.player.runtimeNodes;
  }
  get audioSources() {
    return this.player.audioSources;
  }
  get isEditMode() {
    return this.player.isEditMode;
  }
  get isReversing() {
    return this.player.isReversing;
  }
  get xScalingFactor() {
    return this.player.layout.xScalingFactor;
  }
  get yScalingFactor() {
    return this.player.layout.yScalingFactor;
  }
  get content() {
    return this.player.content;
  }
  static create(sourceSequence, player) {
    const instance = new RuntimeSequence(sourceSequence, player);
    instance.initialize();
    return instance;
  }
  initialize() {
    this.runtimeTracks.forEach(async (track) => {
      var _a2, _b2;
      const target = this.nodes.find((node) => node.id === track.target);
      if (!target && track.type !== TrackFunctionType.SyncedAudio && track.type !== TrackFunctionType.AmbientAudio && track.type !== TrackFunctionType.AudioTrigger) {
        track.skip = true;
        return;
      }
      if (track.evaluationMethod === TrackEvaluationMethodType.Clips) {
        track.clips.forEach((clip) => {
          clip.duration = Math.abs(clip.end - clip.start);
          clip.trackType = track.type;
          if (target) {
            clip.node = target;
          }
          if (track.type === "Position" && clip.type === "Vector2") {
            clip.playerInitialValue = this.player.getNormalizedPosition(clip.initialValue, target == null ? void 0 : target.parentNode);
            clip.playerTargetValue = this.player.getNormalizedPosition(clip.targetValue, target == null ? void 0 : target.parentNode);
          } else if (track.type === "Scale" && clip.type === "Vector2") {
            if (clip.node.type === "Graphic") {
              clip.playerInitialValue = {
                x: clip.initialValue.x / 100,
                y: clip.initialValue.y / 100
              };
              clip.playerTargetValue = {
                x: clip.targetValue.x / 100,
                y: clip.targetValue.y / 100
              };
            } else {
              clip.playerInitialValue = clip.initialValue;
              clip.playerTargetValue = clip.targetValue;
            }
          } else if (clip.type === "Number") {
            clip.playerInitialValue = clip.initialValue;
            clip.playerTargetValue = clip.targetValue;
          }
          if (clip.end > this.duration) {
            this.duration = clip.end;
          }
        });
        if (track.type === TrackFunctionType.SyncedAudio || track.type === TrackFunctionType.AmbientAudio) {
          track.audioSource = this.audioSources.find((audioSource) => audioSource.id === track.target);
          if (this.isEditMode && !this.previewAudio && ((_a2 = track.audioSource) == null ? void 0 : _a2.sound.isPlaying)) {
            track.audioSource.sound.pause();
          }
        }
      } else if (track.evaluationMethod === "Keyframes") {
        const sortedKeyframes = [...track.keyframes].sort((a, b) => a.time - b.time);
        if (sortedKeyframes.length > 1) {
          for (let i = 0; i < sortedKeyframes.length - 1; i++) {
            const currentKeyframe = sortedKeyframes[i];
            const nextKeyframe = sortedKeyframes[i + 1];
            const clip = {
              id: Date.now().toString(),
              start: currentKeyframe.time,
              end: nextKeyframe.time,
              type: currentKeyframe.type,
              functionType: ClipFunctionType.Default,
              initialValue: currentKeyframe.value,
              targetValue: nextKeyframe.value,
              duration: nextKeyframe.time - currentKeyframe.time,
              trackType: track.type,
              node: target,
              playerInitialValue: 0,
              playerTargetValue: 0
            };
            if (target && track.type === "Position" && clip.type === "Vector2") {
              clip.playerInitialValue = this.player.getNormalizedPosition(clip.initialValue, target == null ? void 0 : target.parentNode);
              clip.playerTargetValue = this.player.getNormalizedPosition(clip.targetValue, target == null ? void 0 : target.parentNode);
            } else if (target && track.type === "Scale" && clip.type === "Vector2") {
              if (target.type === "Graphic") {
                clip.playerInitialValue = {
                  x: clip.initialValue.x / 100,
                  y: clip.initialValue.y / 100
                };
                clip.playerTargetValue = {
                  x: clip.targetValue.x / 100,
                  y: clip.targetValue.y / 100
                };
              } else {
                clip.playerInitialValue = clip.initialValue;
                clip.playerTargetValue = clip.targetValue;
              }
            } else if (clip.type === "Number") {
              clip.playerInitialValue = clip.initialValue;
              clip.playerTargetValue = clip.targetValue;
            } else if (clip.type === "Color") {
              if ((target == null ? void 0 : target.type) === "Graphic") {
                clip.playerInitialValue = this.content.getRedrawnGraphicsContext(target, clip.initialValue);
                clip.playerTargetValue = this.content.getRedrawnGraphicsContext(target, clip.targetValue);
              } else {
                clip.playerInitialValue = clip.initialValue;
                clip.playerTargetValue = clip.targetValue;
              }
            }
            track.clips.push(clip);
            if (clip.end > this.duration) {
              this.duration = clip.end;
            }
          }
        } else if (sortedKeyframes.length === 1) {
          const currentKeyframe = sortedKeyframes[0];
          const clip = {
            id: Date.now().toString(),
            start: currentKeyframe.time,
            end: Number.MAX_VALUE - currentKeyframe.time,
            type: currentKeyframe.type,
            functionType: ClipFunctionType.Default,
            initialValue: currentKeyframe.value,
            targetValue: currentKeyframe.value,
            duration: Number.MAX_VALUE - currentKeyframe.time,
            trackType: track.type,
            node: target,
            playerInitialValue: 0,
            playerTargetValue: 0
          };
          if (target && track.type === "Position" && clip.type === "Vector2") {
            clip.playerInitialValue = this.player.getNormalizedPosition(clip.initialValue, target == null ? void 0 : target.parentNode);
            clip.playerTargetValue = this.player.getNormalizedPosition(clip.targetValue, target == null ? void 0 : target.parentNode);
          } else if (target && track.type === "Scale" && clip.type === "Vector2") {
            if (target.type === "Graphic") {
              clip.playerInitialValue = {
                x: clip.initialValue.x / 100,
                y: clip.initialValue.y / 100
              };
              clip.playerTargetValue = {
                x: clip.targetValue.x / 100,
                y: clip.targetValue.y / 100
              };
            } else {
              clip.playerInitialValue = clip.initialValue;
              clip.playerTargetValue = clip.targetValue;
            }
          } else if (clip.type === "Number" || clip.type === "Color") {
            clip.playerInitialValue = clip.initialValue;
            clip.playerTargetValue = clip.targetValue;
          }
          track.clips.push(clip);
        }
      } else if (track.evaluationMethod === TrackEvaluationMethodType.Trigger) {
        if (track.type === TrackFunctionType.AudioTrigger) {
          track.audioSource = this.audioSources.find((audioSource) => audioSource.id === track.target);
          if (this.isEditMode && !this.previewAudio && ((_b2 = track.audioSource) == null ? void 0 : _b2.sound.isPlaying)) {
            track.audioSource.sound.pause();
          }
        }
        track.timelineTriggers.forEach((trigger) => {
          trigger.forwardThreshold = trigger.time + 0.1;
          trigger.reverseThreshold = trigger.time - 0.1;
          trigger.isTriggered = false;
        });
      }
    });
  }
  // We need to relink the nodes whenever they are
  // recreated due to a change in the editor 
  relinkNodes() {
    this.runtimeTracks.forEach((track) => {
      const node = this.nodes.find((node2) => node2.id === track.target);
      if (node) {
        for (const clip of track.clips) {
          clip.node = node;
          if (clip.trackType === "Position" && clip.type === "Vector2") {
            clip.playerInitialValue = this.player.getNormalizedPosition(clip.initialValue, node.parentNode);
            clip.playerTargetValue = this.player.getNormalizedPosition(clip.targetValue, node.parentNode);
          }
        }
      }
    });
  }
  setStartTime(startTime) {
    this.startTime = startTime;
  }
  setCurrentTime(targetTime) {
    this.currentTime = targetTime;
  }
  setCurrentTimeWithoutCallbacks(targetTime) {
    this.currentTime = targetTime;
    this.readAssets();
  }
  // Update the sequence time by a delta
  modifyTime(delta, reel) {
    let newTime = this.currentTime + delta;
    if (newTime < 0) {
      newTime = 0;
    } else if (newTime > this.duration) {
      if (reel.wrapMode === "Hold") {
        newTime = this.duration;
        this.player.callStopPreview(this.id);
      } else if (reel.wrapMode === "Loop") {
        newTime = newTime % this.duration;
      } else if (reel.wrapMode === "None") {
        newTime = 0;
        this.player.callStopPreview(this.id);
      }
    }
    this.currentTime = newTime;
  }
  evaluate() {
    this.readAssets();
    this.player.dispatchEvent(new CustomEvent("onSequenceEvaluate", {
      detail: {
        sequence: this
      }
    }));
  }
  readAssets() {
    if (this.previousIsReversing !== this.isReversing) {
      this.previousIsReversing = this.isReversing;
      this.runtimeTracks.forEach((track) => {
        if (track.timelineTriggers) {
          track.timelineTriggers.forEach((trigger) => {
            trigger.isTriggered = false;
          });
        }
      });
    }
    this.runtimeTracks.forEach((track) => {
      if (track.skip) {
        return;
      }
      track.clips.forEach((clip, index) => {
        RuntimeSequence.processClip(this, track, clip, this.currentTime, index);
      });
      if (track.timelineTriggers) {
        track.timelineTriggers.forEach((trigger) => {
          RuntimeSequence.processTrigger(this, track, trigger, this.currentTime);
        });
      }
    });
  }
  static processClip(sequence, track, clip, time, index) {
    if (time >= clip.start && time <= clip.end) {
      const clipProgress = (time - clip.start) / (clip.end - clip.start);
      if (clip.type === "Vector2") {
        const initialValue = clip.playerInitialValue;
        const targetValue = clip.playerTargetValue;
        const deltaX = targetValue.x - initialValue.x;
        const deltaY = targetValue.y - initialValue.y;
        const newVector2 = {
          x: initialValue.x + deltaX * clipProgress,
          y: initialValue.y + deltaY * clipProgress
        };
        if (clip.trackType === "Position") {
          clip.node.stageElement.position.set(newVector2.x, newVector2.y);
          clip.node.runtimeProperties.position = sequence.player.getEditorPosition(newVector2, clip.node.parentNode);
        }
        if (clip.trackType === "Scale") {
          if (clip.node.type === "Image") {
            clip.node.stageElement.scale.set(newVector2.x * sequence.xScalingFactor, newVector2.y * sequence.yScalingFactor);
          } else {
            clip.node.stageElement.scale.set(newVector2.x, newVector2.y);
          }
          if (clip.node.type === "Graphic") {
            clip.node.runtimeProperties.scale = {
              x: newVector2.x * 100,
              y: newVector2.y * 100
            };
          } else {
            clip.node.runtimeProperties.scale = newVector2;
          }
        }
      }
      if (clip.type === "Number") {
        const initialValue = clip.playerInitialValue;
        const targetValue = clip.playerTargetValue;
        const delta = targetValue - initialValue;
        const newNumber = initialValue + delta * clipProgress;
        if (clip.trackType === "Opacity") {
          if (clip.node.type === "Text") {
            clip.node.stageElement.style.fill = getFillColor(clip.node.runtimeProperties.color, Number(newNumber.toFixed(2)));
          } else {
            clip.node.stageElement.alpha = newNumber;
          }
          clip.node.runtimeProperties.opacity = newNumber;
        }
        if (clip.trackType === "Rotation") {
          clip.node.stageElement.angle = newNumber;
          clip.node.runtimeProperties.rotation = newNumber;
        }
        if (clip.trackType === "FontSize") {
          clip.node.stageElement.style.fontSize = newNumber * sequence.yScalingFactor;
          clip.node.runtimeProperties.fontSize = newNumber;
        }
        if (clip.trackType === "LetterSpacing") {
          clip.node.stageElement.style.letterSpacing = newNumber * (clip.node.runtimeProperties.fontSize / 100) * sequence.yScalingFactor;
          clip.node.runtimeProperties.letterSpacing = newNumber;
        }
        if (clip.trackType === "AmbientAudio") {
          if (!sequence.player.isEditMode || sequence.player.isEditMode && sequence.previewAudio) {
            track.audioSource.sound.volume = newNumber;
          }
        }
      }
      if (clip.type === "Color") {
        const initialValue = clip.playerInitialValue;
        const targetValue = clip.playerTargetValue;
        const newColor = interpolateColor(initialValue, targetValue, clipProgress);
        if (clip.trackType === "Color") {
          if (clip.node.type === "Graphic") {
            const newColor2 = interpolateColor(clip.initialValue, clip.targetValue, clipProgress);
            const newGraphicsContext = sequence.content.getRedrawnGraphicsContext(clip.node, newColor2);
            clip.node.stageElement.context = newGraphicsContext;
          } else if (clip.node.type === "Text") {
            const newColor2 = interpolateColor(clip.playerInitialValue, clip.playerTargetValue, clipProgress);
            clip.node.stageElement.style.fill = getFillColor(newColor2, clip.node.runtimeProperties.opacity);
          }
          clip.node.runtimeProperties.color = newColor;
        }
      }
    } else if (time < clip.start || time === 0 && clip.start === 0) {
      if (clip.trackType === "AmbientAudio") {
        if (clip.functionType === ClipFunctionType.FadePlay) {
          if (!sequence.player.isEditMode || sequence.player.isEditMode && sequence.previewAudio) {
            track.audioSource.sound.volume = clip.playerInitialValue;
            track.audioSource.sound.stop();
          }
        }
      }
      if (index === 0) {
        if (clip.type === "Vector2") {
          const initialValue = clip.playerInitialValue;
          if (clip.trackType === "Position") {
            clip.node.stageElement.position.set(initialValue.x, initialValue.y);
            clip.node.runtimeProperties.position = sequence.player.getEditorPosition(initialValue, clip.node.parentNode);
          }
          if (clip.trackType === "Scale") {
            if (clip.node.type === "Image") {
              clip.node.stageElement.scale.set(initialValue.x * sequence.xScalingFactor, initialValue.y * sequence.yScalingFactor);
            } else {
              clip.node.stageElement.scale.set(initialValue.x, initialValue.y);
            }
            if (clip.node.type === "Graphic") {
              clip.node.runtimeProperties.scale = {
                x: initialValue.x * 100,
                y: initialValue.y * 100
              };
            } else {
              clip.node.runtimeProperties.scale = initialValue;
            }
          }
        }
        if (clip.type === "Number") {
          const initialValue = clip.playerInitialValue;
          if (clip.trackType === "Opacity") {
            if (clip.node.type === "Text") {
              clip.node.stageElement.style.fill = getFillColor(clip.node.runtimeProperties.color, initialValue);
            } else {
              clip.node.stageElement.alpha = initialValue;
            }
            clip.node.runtimeProperties.opacity = initialValue;
          }
          if (clip.trackType === "Rotation") {
            clip.node.stageElement.angle = initialValue;
            clip.node.runtimeProperties.rotation = initialValue;
          }
          if (clip.trackType === "FontSize") {
            clip.node.stageElement.style.fontSize = initialValue * sequence.yScalingFactor;
            clip.node.runtimeProperties.fontSize = initialValue;
          }
          if (clip.trackType === "LetterSpacing") {
            clip.node.stageElement.style.letterSpacing = initialValue * (clip.node.runtimeProperties.fontSize / 100) * sequence.yScalingFactor;
            clip.node.runtimeProperties.letterSpacing = initialValue;
          }
        }
        if (clip.type === "Color") {
          const initialValue = clip.playerInitialValue;
          if (clip.trackType === "Color") {
            if (clip.node.type === "Graphic") {
              if (!clip.playerInitialValue || !clip.playerInitialValue.on) {
                const newGraphicsContext = sequence.content.getRedrawnGraphicsContext(clip.node, clip.initialValue);
                clip.playerInitialValue = newGraphicsContext;
              }
              clip.node.stageElement.context = clip.playerInitialValue;
              clip.node.runtimeProperties.color = clip.initialValue;
            } else if (clip.node.type === "Text") {
              clip.node.stageElement.style.fill = getFillColor(initialValue, clip.node.runtimeProperties.opacity);
              clip.node.runtimeProperties.color = initialValue;
            }
          }
        }
      }
    } else if (time > clip.end) {
      if (clip.trackType === "AmbientAudio") {
        if (!sequence.player.isEditMode || sequence.player.isEditMode && sequence.previewAudio) {
          if (clip.functionType === ClipFunctionType.FadePlay) {
            if (!track.audioSource.sound.isPlaying) {
              track.audioSource.sound.volume = clip.playerTargetValue;
              track.audioSource.sound.play();
            }
          }
          if (clip.functionType === ClipFunctionType.Volume) {
            track.audioSource.sound.volume = clip.playerTargetValue;
          }
        }
      }
      if (clip.type === "Vector2") {
        const targetValue = clip.playerTargetValue;
        if (clip.trackType === "Position") {
          clip.node.stageElement.position.set(targetValue.x, targetValue.y);
          clip.node.runtimeProperties.position = sequence.player.getEditorPosition(targetValue, clip.node.parentNode);
        }
        if (clip.trackType === "Scale") {
          if (clip.node.type === "Image") {
            clip.node.stageElement.scale.set(targetValue.x * sequence.xScalingFactor, targetValue.y * sequence.yScalingFactor);
          } else {
            clip.node.stageElement.scale.set(targetValue.x, targetValue.y);
          }
          if (clip.node.type === "Graphic") {
            clip.node.runtimeProperties.scale = {
              x: targetValue.x * 100,
              y: targetValue.y * 100
            };
          } else {
            clip.node.runtimeProperties.scale = targetValue;
          }
        }
      }
      if (clip.type === "Number") {
        const targetValue = clip.playerTargetValue;
        if (clip.trackType === "Opacity") {
          if (clip.node.type === "Text") {
            clip.node.stageElement.style.fill = getFillColor(clip.node.runtimeProperties.color, targetValue);
          } else {
            clip.node.stageElement.alpha = targetValue;
          }
          clip.node.runtimeProperties.opacity = targetValue;
        }
        if (clip.trackType === "Rotation") {
          clip.node.stageElement.angle = targetValue;
          clip.node.runtimeProperties.rotation = targetValue;
        }
        if (clip.trackType === "FontSize") {
          clip.node.stageElement.style.fontSize = targetValue * sequence.yScalingFactor;
          clip.node.runtimeProperties.fontSize = targetValue;
        }
        if (clip.trackType === "LetterSpacing") {
          clip.node.stageElement.style.letterSpacing = targetValue * (clip.node.runtimeProperties.fontSize / 100) * sequence.yScalingFactor;
          clip.node.runtimeProperties.letterSpacing = targetValue;
        }
      }
      if (clip.type === "Color") {
        const targetValue = clip.playerTargetValue;
        if (clip.trackType === "Color") {
          if (clip.node.type === "Graphic") {
            if (!clip.playerTargetValue) {
              const newGraphicsContext = sequence.content.getRedrawnGraphicsContext(clip.node, clip.targetValue);
              clip.playerTargetValue = newGraphicsContext;
            }
            clip.node.stageElement.context = clip.playerTargetValue;
            clip.node.runtimeProperties.color = clip.targetValue;
          } else if (clip.node.type === "Text") {
            clip.node.stageElement.style.fill = getFillColor(targetValue, clip.node.runtimeProperties.opacity);
            clip.node.runtimeProperties.color = targetValue;
          }
        }
      }
    }
  }
  static processTrigger(sequence, track, trigger, time) {
    var _a2, _b2;
    if (!sequence.isReversing) {
      if (trigger.activateOnForward) {
        if (time >= trigger.time && time <= trigger.forwardThreshold && !trigger.isTriggered) {
          trigger.isTriggered = true;
          if (track.type === TrackFunctionType.AudioTrigger && trigger.activateOnForward) {
            if (!sequence.player.isEditMode || sequence.player.isEditMode && sequence.previewAudio) {
              (_a2 = track.audioSource) == null ? void 0 : _a2.sound.play();
            }
          }
        }
      }
    } else {
      if (trigger.activateOnReverse) {
        if (time <= trigger.time && time >= trigger.reverseThreshold && !trigger.isTriggered) {
          trigger.isTriggered = true;
          if (track.type === TrackFunctionType.AudioTrigger && trigger.activateOnReverse) {
            if (!sequence.player.isEditMode || sequence.player.isEditMode && sequence.previewAudio) {
              (_b2 = track.audioSource) == null ? void 0 : _b2.sound.play();
            }
          }
        }
      }
    }
  }
}
class RuntimeReel {
  constructor(player, reel) {
    __publicField(this, "id");
    __publicField(this, "name");
    __publicField(this, "active");
    __publicField(this, "currentTime");
    __publicField(this, "startTime");
    __publicField(this, "totalDuration");
    __publicField(this, "player");
    __publicField(this, "currentInterval");
    __publicField(this, "sequences");
    __publicField(this, "updateType");
    __publicField(this, "wrapMode");
    __publicField(this, "isMaster");
    __publicField(this, "activeInputModule");
    const { id: id2, name, wrapMode, updateType, isMaster, path: path2, type } = reel;
    this.id = id2;
    this.name = name;
    this.wrapMode = wrapMode;
    this.player = player;
    this.currentInterval = new AutorunExtents(0, 0);
    this.sequences = {};
    this.updateType = updateType;
    this.isMaster = isMaster;
    this.totalDuration = 0;
    this.activeInputModule = {
      moduleName: "",
      priority: 0
    };
    this.player.addEventListener("playerResize", (event) => {
      Object.keys(this.sequences).forEach((sequenceId) => {
        setTimeout(() => this.sequences[sequenceId].setCurrentTime(this.sequences[sequenceId].currentTime));
      });
    });
  }
  get isEditMode() {
    return this.player.isEditMode;
  }
  get selectedNodes() {
    return this.player.selectedNodes;
  }
  get selectedSequences() {
    return this.player.selectedSequences;
  }
  get previewingSequences() {
    return this.player.previewingSequences;
  }
  static async create(player, reel) {
    const instance = new RuntimeReel(player, reel);
    await instance.initialize(reel.sequences);
    return instance;
  }
  async initialize(sequences) {
    await Promise.all(sequences.map(async (targetSequence) => {
      if (targetSequence) {
        await this.handleLoadSequence(targetSequence);
      }
    }));
  }
  async handleLoadSequence(targetSequence) {
    const currentSequence = await RuntimeSequence.create(deepClone(targetSequence), this.player);
    this.totalDuration += currentSequence.duration;
    this.sequences[currentSequence.id] = currentSequence;
    this.refreshSequences([currentSequence]);
  }
  refreshSequences(targetSequences) {
    const sequenceIds = Object.keys(this.sequences);
    const selectedSequenceIds = this.selectedSequences.map((sequence) => sequence.id);
    targetSequences.forEach((targetSequence) => {
      if (!this.isEditMode && this.sequences[targetSequence.id].active || // If we're in edit mode, only evaluate the sequence if it's selected and on this reel
      this.isEditMode && selectedSequenceIds.includes(targetSequence.id) && sequenceIds.includes(targetSequence.id)) {
        this.sequences[targetSequence.id].evaluate();
      }
    });
  }
  update() {
    Object.keys(this.sequences).forEach((sequenceId) => {
      const sequence = this.sequences[sequenceId];
      const previewingData = this.previewingSequences.find((previewingSequence) => previewingSequence.sequenceId === sequenceId);
      if (!this.isEditMode && sequence.active || this.isEditMode && previewingData) {
        if (this.updateType === "Time") {
          if (sequence.initialized && (!this.isEditMode || previewingData)) {
            sequence.modifyTime(this.player.deltaTime, this);
          } else {
            sequence.initialized = true;
          }
        }
        sequence.evaluate();
        sequence.previousTime = sequence.currentTime;
        if (this.isEditMode && previewingData) {
          this.syncEditor(previewingData);
        }
      }
    });
  }
  // When we don't need to lock the input module because the input
  // is passive, as in with a generic scroll event
  forceModifyTime(timeModifier) {
    Object.keys(this.sequences).forEach((sequenceId) => {
      this.sequences[sequenceId].modifyTime(timeModifier, this);
    });
  }
  requestModifyTime(requestPriority, moduleName, timeModifier) {
    if (!this.activeInputModule.moduleName || this.activeInputModule.moduleName === moduleName || requestPriority > this.activeInputModule.priority) {
      this.lockInputModule(moduleName, requestPriority);
      Object.keys(this.sequences).forEach((sequenceId) => {
        this.sequences[sequenceId].modifyTime(timeModifier, this);
      });
    }
  }
  // To do: Make this use the elapsed time of the reel
  requestModifySequenceTime(targetSequence, requestPriority, moduleName, timeModifier) {
    if (!this.activeInputModule.moduleName || this.activeInputModule.moduleName === moduleName || requestPriority > this.activeInputModule.priority) {
      this.lockInputModule(moduleName, requestPriority);
      targetSequence.modifyTime(timeModifier, this);
    }
    return targetSequence;
  }
  requestSetSequenceTime(targetSequence, requestPriority, moduleName, targetTime) {
    if (!this.activeInputModule.moduleName || this.activeInputModule.moduleName === moduleName || requestPriority > this.activeInputModule.priority) {
      this.lockInputModule(moduleName, requestPriority);
      targetSequence.setCurrentTime(targetTime);
    }
  }
  requestSetSequenceTimeWithoutCallbacks(targetSequence, requestPriority, moduleName, targetTime) {
    if (!this.activeInputModule.moduleName || this.activeInputModule.moduleName === moduleName || requestPriority > this.activeInputModule.priority) {
      this.lockInputModule(moduleName, requestPriority);
      targetSequence.setCurrentTimeWithoutCallbacks(targetTime);
    }
  }
  lockInputModule(moduleName, priority) {
    this.activeInputModule = {
      moduleName,
      priority
    };
  }
  unlockInputModule(moduleName) {
    if (this.activeInputModule.moduleName === moduleName) {
      this.activeInputModule = {
        moduleName: "",
        priority: 0
      };
    }
  }
  setSequenceTimeAndEvaluate(sequence, time) {
    sequence.setCurrentTime(time);
    sequence.evaluate();
  }
  // Send a message to the editor to sync the timeline window with the sequence time
  syncEditor(previewingData) {
    const message = { type: Events.SYNC_EDITOR_TIMELINE_FROM_PLAYER, payload: { timelineWindowId: previewingData.timelineWindowId, currentTime: this.sequences[previewingData.sequenceId].currentTime } };
    window.parent.postMessage(message, "*");
  }
  callRelinkNodes() {
    Object.keys(this.sequences).forEach((sequenceId) => {
      this.sequences[sequenceId].relinkNodes();
      if (this.selectedSequences.find((sequence) => sequence.id === sequenceId)) {
        this.sequences[sequenceId].evaluate();
      }
    });
  }
}
class PointerApplier {
  constructor(player) {
    __publicField(this, "player");
    this.player = player;
    this.player.addEventListener("playerPointerMove", (event) => {
      const pointerMoveDelta = event.detail.delta;
      if (pointerMoveDelta === 0) {
        return;
      }
      if (pointerMoveDelta > 0) {
        this.isReversing = false;
      } else {
        this.isReversing = true;
      }
      this.applyTouchToReels(pointerMoveDelta);
    });
    this.player.addEventListener("playerPointerUp", (event) => {
      this.unlockInputModule();
    });
  }
  get reels() {
    return this.player.reels;
  }
  set isReversing(value) {
    this.player.isReversing = value;
  }
  get isReversing() {
    return this.player.isReversing;
  }
  applyTouchToReels(delta) {
    Object.keys(this.reels).forEach((reelId) => {
      const reel = this.reels[reelId];
      if (reel.updateType === "Scroll") {
        reel.requestModifyTime(3, "PointerApplier", delta);
        reel.update();
      }
    });
  }
  unlockInputModule() {
    Object.keys(this.reels).forEach((reelId) => {
      this.reels[reelId].unlockInputModule("PointerApplier");
    });
  }
}
class MomentumData {
  constructor(reel, sequence) {
    __publicField(this, "reel");
    __publicField(this, "sequence");
    __publicField(this, "eligibleForMomentum");
    this.reel = reel;
    this.sequence = sequence;
    this.eligibleForMomentum = false;
  }
}
class MomentumApplier {
  constructor(player) {
    __publicField(this, "player");
    __publicField(this, "momentumData");
    this.player = player;
    this.momentumData = {};
    this.configureData();
    this.player.addEventListener("playerPointerUp", (event) => {
      this.activateMomentumAllSequences();
    });
    this.player.addEventListener("playerActivateAutoplay", (event) => {
      const sequence = event.detail.sequence;
      this.deactivateMomentumSequence(sequence);
    });
    this.player.addEventListener("playerPointerDown", (event) => {
      this.deactivateMomentumAllSequences();
      this.unlockInputModule();
    });
    this.player.addEventListener("playerWheel", (event) => {
      this.deactivateMomentumAllSequences();
      this.unlockInputModule();
    });
    this.player.addEventListener("playerMomentum", (event) => {
      this.applyMomentumToSequences(event.detail.delta);
    });
  }
  get reels() {
    return this.player.reels;
  }
  configureData() {
    Object.keys(this.reels).forEach((reelId) => {
      const reel = this.reels[reelId];
      Object.keys(reel.sequences).forEach((sequenceId) => {
        const sequence = reel.sequences[sequenceId];
        this.momentumData[sequenceId] = new MomentumData(reel, sequence);
      });
    });
  }
  activateMomentumAllSequences() {
    Object.keys(this.momentumData).forEach((sequenceId) => {
      this.momentumData[sequenceId].eligibleForMomentum = true;
    });
  }
  deactivateMomentumAllSequences() {
    Object.keys(this.momentumData).forEach((sequenceId) => {
      this.momentumData[sequenceId].eligibleForMomentum = false;
    });
  }
  deactivateMomentumSequence(sequence) {
    this.momentumData[sequence.id].eligibleForMomentum = false;
  }
  applyMomentumToSequences(delta) {
    Object.keys(this.momentumData).forEach((sequenceId) => {
      const momentumData = this.momentumData[sequenceId];
      if (momentumData.reel.updateType === "Scroll" && momentumData.eligibleForMomentum) {
        momentumData.reel.requestModifySequenceTime(momentumData.sequence, 1, "MomentumApplier", delta);
      }
    });
  }
  unlockInputModule() {
    Object.keys(this.reels).forEach((reelId) => {
      this.reels[reelId].unlockInputModule("MomentumApplier");
    });
  }
}
var Ease = /* @__PURE__ */ ((Ease2) => {
  Ease2[Ease2["EaseInQuad"] = 0] = "EaseInQuad";
  Ease2[Ease2["EaseOutQuad"] = 1] = "EaseOutQuad";
  Ease2[Ease2["EaseInOutQuad"] = 2] = "EaseInOutQuad";
  Ease2[Ease2["EaseInCubic"] = 3] = "EaseInCubic";
  Ease2[Ease2["EaseOutCubic"] = 4] = "EaseOutCubic";
  Ease2[Ease2["EaseInOutCubic"] = 5] = "EaseInOutCubic";
  Ease2[Ease2["EaseInQuart"] = 6] = "EaseInQuart";
  Ease2[Ease2["EaseOutQuart"] = 7] = "EaseOutQuart";
  Ease2[Ease2["EaseInOutQuart"] = 8] = "EaseInOutQuart";
  Ease2[Ease2["EaseInQuint"] = 9] = "EaseInQuint";
  Ease2[Ease2["EaseOutQuint"] = 10] = "EaseOutQuint";
  Ease2[Ease2["EaseInOutQuint"] = 11] = "EaseInOutQuint";
  Ease2[Ease2["EaseInSine"] = 12] = "EaseInSine";
  Ease2[Ease2["EaseOutSine"] = 13] = "EaseOutSine";
  Ease2[Ease2["EaseInOutSine"] = 14] = "EaseInOutSine";
  Ease2[Ease2["EaseInExpo"] = 15] = "EaseInExpo";
  Ease2[Ease2["EaseOutExpo"] = 16] = "EaseOutExpo";
  Ease2[Ease2["EaseInOutExpo"] = 17] = "EaseInOutExpo";
  Ease2[Ease2["EaseInCirc"] = 18] = "EaseInCirc";
  Ease2[Ease2["EaseOutCirc"] = 19] = "EaseOutCirc";
  Ease2[Ease2["EaseInOutCirc"] = 20] = "EaseInOutCirc";
  Ease2[Ease2["Linear"] = 21] = "Linear";
  Ease2[Ease2["Spring"] = 22] = "Spring";
  Ease2[Ease2["EaseInBounce"] = 23] = "EaseInBounce";
  Ease2[Ease2["EaseOutBounce"] = 24] = "EaseOutBounce";
  Ease2[Ease2["EaseInOutBounce"] = 25] = "EaseInOutBounce";
  Ease2[Ease2["EaseInBack"] = 26] = "EaseInBack";
  Ease2[Ease2["EaseOutBack"] = 27] = "EaseOutBack";
  Ease2[Ease2["EaseInOutBack"] = 28] = "EaseInOutBack";
  Ease2[Ease2["EaseInElastic"] = 29] = "EaseInElastic";
  Ease2[Ease2["EaseOutElastic"] = 30] = "EaseOutElastic";
  Ease2[Ease2["EaseInOutElastic"] = 31] = "EaseInOutElastic";
  return Ease2;
})(Ease || {});
function Linear(start, end, value) {
  return start + (end - start) * value;
}
function Spring(start, end, value) {
  value = Math.max(0, Math.min(1, value));
  value = (Math.sin(value * Math.PI * (0.2 + 2.5 * value * value * value)) * Math.pow(1 - value, 2.2) + value) * (1 + 1.2 * (1 - value));
  return start + (end - start) * value;
}
function EaseInQuad(start, end, value) {
  end -= start;
  return end * value * value + start;
}
function EaseOutQuad(start, end, value) {
  end -= start;
  return -end * value * (value - 2) + start;
}
function EaseInOutQuad(start, end, value) {
  value /= 0.5;
  end -= start;
  if (value < 1) return end * 0.5 * value * value + start;
  value--;
  return -end * 0.5 * (value * (value - 2) - 1) + start;
}
function EaseInCubic(start, end, value) {
  end -= start;
  return end * value * value * value + start;
}
function EaseOutCubic(start, end, value) {
  value--;
  end -= start;
  return end * (value * value * value + 1) + start;
}
function EaseInOutCubic(start, end, value) {
  value /= 0.5;
  end -= start;
  if (value < 1) return end * 0.5 * value * value * value + start;
  value -= 2;
  return end * 0.5 * (value * value * value + 2) + start;
}
function EaseInQuart(start, end, value) {
  end -= start;
  return end * value * value * value * value + start;
}
function EaseOutQuart(start, end, value) {
  value--;
  end -= start;
  return -end * (value * value * value * value - 1) + start;
}
function EaseInOutQuart(start, end, value) {
  value /= 0.5;
  end -= start;
  if (value < 1) return end * 0.5 * value * value * value * value + start;
  value -= 2;
  return -end * 0.5 * (value * value * value * value - 2) + start;
}
function EaseInQuint(start, end, value) {
  end -= start;
  return end * value * value * value * value * value + start;
}
function EaseOutQuint(start, end, value) {
  value--;
  end -= start;
  return end * (value * value * value * value * value + 1) + start;
}
function EaseInOutQuint(start, end, value) {
  value /= 0.5;
  end -= start;
  if (value < 1) return end * 0.5 * value * value * value * value * value + start;
  value -= 2;
  return end * 0.5 * (value * value * value * value * value + 2) + start;
}
function EaseInSine(start, end, value) {
  end -= start;
  return -end * Math.cos(value * (Math.PI * 0.5)) + end + start;
}
function EaseOutSine(start, end, value) {
  end -= start;
  return end * Math.sin(value * (Math.PI * 0.5)) + start;
}
function EaseInOutSine(start, end, value) {
  end -= start;
  return -end * 0.5 * (Math.cos(Math.PI * value) - 1) + start;
}
function EaseInExpo(start, end, value) {
  end -= start;
  return end * Math.pow(2, 10 * (value - 1)) + start;
}
function EaseOutExpo(start, end, value) {
  end -= start;
  return end * (-Math.pow(2, -10 * value) + 1) + start;
}
function EaseInOutExpo(start, end, value) {
  value /= 0.5;
  end -= start;
  if (value < 1) return end * 0.5 * Math.pow(2, 10 * (value - 1)) + start;
  value--;
  return end * 0.5 * (-Math.pow(2, -10 * value) + 2) + start;
}
function EaseInCirc(start, end, value) {
  end -= start;
  return -end * (Math.sqrt(1 - value * value) - 1) + start;
}
function EaseOutCirc(start, end, value) {
  value--;
  end -= start;
  return end * Math.sqrt(1 - value * value) + start;
}
function EaseInOutCirc(start, end, value) {
  value /= 0.5;
  end -= start;
  if (value < 1) return -end * 0.5 * (Math.sqrt(1 - value * value) - 1) + start;
  value -= 2;
  return end * 0.5 * (Math.sqrt(1 - value * value) + 1) + start;
}
function EaseInBounce(start, end, value) {
  end -= start;
  const d = 1;
  return end - EaseOutBounce(0, end, d - value) + start;
}
function EaseOutBounce(start, end, value) {
  value /= 1;
  end -= start;
  if (value < 1 / 2.75) {
    return end * (7.5625 * value * value) + start;
  } else if (value < 2 / 2.75) {
    value -= 1.5 / 2.75;
    return end * (7.5625 * value * value + 0.75) + start;
  } else if (value < 2.5 / 2.75) {
    value -= 2.25 / 2.75;
    return end * (7.5625 * value * value + 0.9375) + start;
  } else {
    value -= 2.625 / 2.75;
    return end * (7.5625 * value * value + 0.984375) + start;
  }
}
function EaseInOutBounce(start, end, value) {
  end -= start;
  const d = 1;
  if (value < d * 0.5) return EaseInBounce(0, end, value * 2) * 0.5 + start;
  return EaseOutBounce(0, end, value * 2 - d) * 0.5 + end * 0.5 + start;
}
function EaseInBack(start, end, value) {
  end -= start;
  value /= 1;
  const s = 1.70158;
  return end * value * value * ((s + 1) * value - s) + start;
}
function EaseOutBack(start, end, value) {
  const s = 1.70158;
  end -= start;
  value = value - 1;
  return end * (value * value * ((s + 1) * value + s) + 1) + start;
}
function EaseInOutBack(start, end, value) {
  let s = 1.70158;
  end -= start;
  value /= 0.5;
  if (value < 1) {
    s *= 1.525;
    return end * 0.5 * (value * value * ((s + 1) * value - s)) + start;
  }
  value -= 2;
  s *= 1.525;
  return end * 0.5 * (value * value * ((s + 1) * value + s) + 2) + start;
}
function EaseInElastic(start, end, value) {
  end -= start;
  const d = 1;
  const p = d * 0.3;
  let s = 0;
  let a = 0;
  if (value == 0) return start;
  if ((value /= d) == 1) return start + end;
  if (a == 0 || a < Math.abs(end)) {
    a = end;
    s = p / 4;
  } else {
    s = p / (2 * Math.PI) * Math.asin(end / a);
  }
  return -(a * Math.pow(2, 10 * (value -= 1)) * Math.sin((value * d - s) * (2 * Math.PI) / p)) + start;
}
function EaseOutElastic(start, end, value) {
  end -= start;
  const d = 1;
  const p = d * 0.3;
  let s = 0;
  let a = 0;
  if (value == 0) return start;
  if ((value /= d) == 1) return start + end;
  if (a == 0 || a < Math.abs(end)) {
    a = end;
    s = p * 0.25;
  } else {
    s = p / (2 * Math.PI) * Math.asin(end / a);
  }
  return a * Math.pow(2, -10 * value) * Math.sin((value * d - s) * (2 * Math.PI) / p) + end + start;
}
function EaseInOutElastic(start, end, value) {
  end -= start;
  const d = 1;
  const p = d * 0.3;
  let s = 0;
  let a = 0;
  if (value == 0) return start;
  if ((value /= d * 0.5) == 2) return start + end;
  if (a == 0 || a < Math.abs(end)) {
    a = end;
    s = p / 4;
  } else {
    s = p / (2 * Math.PI) * Math.asin(end / a);
  }
  if (value < 1) {
    return -0.5 * (a * Math.pow(2, 10 * (value -= 1)) * Math.sin((value * d - s) * (2 * Math.PI) / p)) + start;
  }
  return a * Math.pow(2, -10 * (value -= 1)) * Math.sin((value * d - s) * (2 * Math.PI) / p) * 0.5 + end + start;
}
function getEasingFunction(easingType) {
  switch (easingType) {
    case 0:
      return EaseInQuad;
    case 1:
      return EaseOutQuad;
    case 2:
      return EaseInOutQuad;
    case 3:
      return EaseInCubic;
    case 4:
      return EaseOutCubic;
    case 5:
      return EaseInOutCubic;
    case 6:
      return EaseInQuart;
    case 7:
      return EaseOutQuart;
    case 8:
      return EaseInOutQuart;
    case 9:
      return EaseInQuint;
    case 10:
      return EaseOutQuint;
    case 11:
      return EaseInOutQuint;
    case 12:
      return EaseInSine;
    case 13:
      return EaseOutSine;
    case 14:
      return EaseInOutSine;
    case 15:
      return EaseInExpo;
    case 16:
      return EaseOutExpo;
    case 17:
      return EaseInOutExpo;
    case 18:
      return EaseInCirc;
    case 19:
      return EaseOutCirc;
    case 20:
      return EaseInOutCirc;
    case 21:
      return Linear;
    case 22:
      return Spring;
    case 23:
      return EaseInBounce;
    case 24:
      return EaseOutBounce;
    case 25:
      return EaseInOutBounce;
    case 26:
      return EaseInBack;
    case 27:
      return EaseOutBack;
    case 28:
      return EaseInOutBack;
    case 29:
      return EaseInElastic;
    case 30:
      return EaseOutElastic;
    case 31:
      return EaseInOutElastic;
    default:
      return Linear;
  }
}
class EasingUtility {
  /**
   * Creates a new EasingUtility instance
   * @param easingType The easing function type to use
   * @param start The start value for the easing function
   * @param end The end value for the easing function
   * @param duration The duration of the easing in seconds
   */
  constructor(easingType = Ease.EaseOutQuad) {
    __publicField(this, "_ease", Ease.EaseOutQuad);
    __publicField(this, "_lerpType", 1);
    __publicField(this, "_easingFunction");
    __publicField(this, "_lerpInterval", 0.01);
    __publicField(this, "_multiplier", 0);
    __publicField(this, "_percentValue", 0);
    this._ease = easingType;
    this._easingFunction = getEasingFunction(easingType);
  }
  /**
   * Gets the current multiplier value based on the easing function
   */
  getMultiplier() {
    if (this._lerpType === 1) {
      this._multiplier = this._easingFunction(1, 0, this._percentValue);
    } else {
      this._multiplier = this._easingFunction(0, 1, this._percentValue);
    }
    this._percentValue += this._lerpInterval;
    return this._multiplier;
  }
  /**
   * Resets the easing to its initial state
   */
  reset() {
    this._percentValue = 0;
    return this;
  }
}
class AutorunData {
  constructor(player, reel, sequence) {
    __publicField(this, "player");
    __publicField(this, "reel");
    __publicField(this, "sequence");
    __publicField(this, "eligibleForAutoplay");
    __publicField(this, "autorunIntervals");
    __publicField(this, "activeInterval");
    __publicField(this, "easingUtility");
    this.player = player;
    this.reel = reel;
    this.sequence = sequence;
    this.eligibleForAutoplay = false;
    this.autorunIntervals = AutorunData.configureAutorunIntervals(this.autorunMarkers);
    this.activeInterval = null;
    this.easingUtility = new EasingUtility();
  }
  get autorunMarkers() {
    return this.sequence.autorunMarkers;
  }
  static configureAutorunIntervals(autorunMarkers) {
    const intervals = [];
    let startTimes = [];
    let endTimes = [];
    autorunMarkers.forEach((marker) => {
      if (marker.type === "Start") {
        startTimes.push(marker.time);
      } else if (marker.type === "Stop") {
        endTimes.push(marker.time);
      } else if (marker.type === "Pause") {
        startTimes.push(marker.time);
        endTimes.push(marker.time);
      }
    });
    if (startTimes.length != endTimes.length) {
      if (startTimes.length != endTimes.length + 1) {
        throw new Error("Start time threshold and end time threshold counts do not match.");
      }
    }
    startTimes.sort((a, b) => a - b);
    endTimes.sort((a, b) => a - b);
    for (let i = 0; i < startTimes.length; i++) {
      if (i <= endTimes.length - 1) {
        intervals.push({
          startTime: startTimes[i],
          endTime: endTimes[i]
        });
      } else {
        intervals.push({
          startTime: startTimes[i],
          endTime: Number.MAX_VALUE
        });
      }
    }
    return intervals;
  }
}
class Autoplayer {
  constructor(player) {
    __publicField(this, "player");
    __publicField(this, "autorunData", {});
    __publicField(this, "autoplayEnded", false);
    this.player = player;
    this.configureData();
    this.player.addEventListener("onSequenceEvaluate", (event) => {
      this.onSequenceEvaluate(event.detail.sequence);
    });
    this.player.addEventListener("playerWheel", (event) => {
      this.activateAutoplayAllSequences();
    });
    this.player.addEventListener("playerPointerUp", (event) => {
      this.activateAutoplayAllSequences();
    });
    this.player.addEventListener("playerPointerDown", () => {
      this.deactivateAutoplayAllSequences();
    });
  }
  get reels() {
    return this.player.reels;
  }
  get isReversing() {
    return this.player.isReversing;
  }
  get isTouching() {
    return this.player.isTouching;
  }
  get deltaTime() {
    return this.player.deltaTime;
  }
  get autorunThreshold() {
    return 0.01;
  }
  get easeThreshold() {
    return 0.1;
  }
  configureData() {
    Object.keys(this.reels).forEach((reelId) => {
      const reel = this.reels[reelId];
      Object.keys(reel.sequences).forEach((sequenceId) => {
        const sequence = reel.sequences[sequenceId];
        if (sequence.autorunMarkers && sequence.autorunMarkers.length > 0) {
          this.autorunData[sequenceId] = new AutorunData(this.player, reel, sequence);
        }
      });
    });
  }
  update() {
    if (this.isTouching) {
      return;
    }
    Object.keys(this.autorunData).forEach((sequenceId) => {
      const data = this.autorunData[sequenceId];
      if (!data.eligibleForAutoplay) {
        return;
      }
      if (!data.activeInterval) {
        const currentInterval = AutorunExtents.timeWithinThresholdBothBoundsExclusiveAscending(data.sequence.currentTime, data.autorunIntervals);
        if (currentInterval) {
          data.activeInterval = currentInterval;
          this.player.dispatchEvent(new CustomEvent("playerActivateAutoplay", {
            detail: {
              sequence: data.sequence
            }
          }));
        }
      }
      if (data.activeInterval) {
        let timeModifier = (this.isReversing ? -1 : 1) * this.deltaTime;
        if (this.sequenceWithinEaseThreshold(data.sequence, data.activeInterval, this.isReversing, this.easeThreshold)) {
          timeModifier *= data.easingUtility.getMultiplier();
        }
        data.reel.requestModifySequenceTime(data.sequence, 2, "Autoplayer", timeModifier);
      }
    });
  }
  onSequenceEvaluate(sequence) {
    const data = this.autorunData[sequence.id];
    if (!data) {
      return;
    }
    if (data.reel.updateType === "Scroll") {
      if (data.activeInterval) {
        const currentTime = data.sequence.currentTime;
        let autorunIntervalComplete = false;
        if (!this.isReversing && currentTime > data.activeInterval.endTime || approximatelyEqual(currentTime, data.activeInterval.endTime)) {
          autorunIntervalComplete = true;
        } else if (this.isReversing && currentTime < data.activeInterval.startTime || approximatelyEqual(currentTime, data.activeInterval.startTime)) {
          autorunIntervalComplete = true;
        }
        if (autorunIntervalComplete) {
          this.deactivateAutoplaySequence(data.sequence);
          data.easingUtility.reset();
          data.reel.unlockInputModule("Autoplayer");
        }
      }
    }
  }
  sequenceWithinEaseThreshold(targetSequence, currentInterval, isReversing, easeThreshold) {
    if (isReversing == false) {
      if (currentInterval.endTime - targetSequence.currentTime <= easeThreshold) {
        return true;
      }
    } else {
      if (targetSequence.currentTime - currentInterval.startTime <= easeThreshold) {
        return true;
      }
    }
    return false;
  }
  activateAutoplayAllSequences() {
    Object.keys(this.autorunData).forEach((sequenceId) => {
      const data = this.autorunData[sequenceId];
      if (data.sequence.active) {
        data.eligibleForAutoplay = true;
      }
    });
  }
  activateAutoplaySequence(sequence) {
    const data = this.autorunData[sequence.id];
    if (sequence.active && data) {
      data.eligibleForAutoplay = true;
    }
  }
  deactivateAutoplayAllSequences() {
    Object.keys(this.autorunData).forEach((sequenceId) => {
      const data = this.autorunData[sequenceId];
      data.eligibleForAutoplay = false;
      data.activeInterval = null;
    });
  }
  deactivateAutoplaySequence(sequence) {
    const data = this.autorunData[sequence.id];
    if (data) {
      data.eligibleForAutoplay = false;
      data.activeInterval = null;
    }
  }
}
class WheelApplier {
  constructor(player) {
    __publicField(this, "player");
    this.player = player;
    this.player.addEventListener("playerWheel", (event) => {
      const wheelDelta = event.detail.delta;
      if (wheelDelta > 0) {
        this.isReversing = false;
      } else {
        this.isReversing = true;
      }
      this.applyScrollToReels(wheelDelta);
    });
  }
  get reels() {
    return this.player.reels;
  }
  get isReversing() {
    return this.player.isReversing;
  }
  set isReversing(value) {
    this.player.isReversing = value;
  }
  applyScrollToReels(delta) {
    Object.keys(this.reels).forEach((reelId) => {
      const reel = this.reels[reelId];
      if (reel.updateType === "Scroll") {
        reel.forceModifyTime(delta);
        reel.update();
      }
    });
  }
}
class EditorWidgets {
  constructor(player) {
    __publicField(this, "player");
    __publicField(this, "isDragging");
    __publicField(this, "dragStartX");
    __publicField(this, "dragStartY");
    __publicField(this, "activeAxis");
    __publicField(this, "activeCorner");
    __publicField(this, "transformWidgetCollection");
    __publicField(this, "transformWidgetSettings");
    __publicField(this, "activeEdge");
    __publicField(this, "startDragHandlers", /* @__PURE__ */ new Map());
    this.player = player;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.activeAxis = null;
    this.activeCorner = null;
    this.activeElement = null;
    this.transformWidgetCollection = {};
    this.transformWidgetSettings = {
      size: 9,
      offset: 4.5,
      padding: 10,
      color: "#BF3EFF"
    };
    this.activeEdge = null;
  }
  get runtimeNodes() {
    return this.player.runtimeNodes;
  }
  get selectedNodes() {
    return this.player.selectedNodes;
  }
  get stage() {
    return this.player.stage;
  }
  get xScalingFactor() {
    return this.player.layout.xScalingFactor;
  }
  get yScalingFactor() {
    return this.player.layout.yScalingFactor;
  }
  get recordingKeyframeTrack() {
    return this.player.recordingKeyframeTrack;
  }
  get editorMode() {
    return this.player.editorMode;
  }
  get hasSelectionHandler() {
    return this.player.hasSelectionHandler;
  }
  reset() {
    this.transformWidgetCollection = {};
  }
  removeSelectedNodeWidgets() {
    Object.values(this.transformWidgetCollection).forEach((collection) => {
      var _a2;
      (_a2 = collection.referenceElement) == null ? void 0 : _a2.destroy();
      Object.values(collection.widgetGroup).forEach((widget) => {
        var _a3;
        if ((_a3 = widget == null ? void 0 : widget.element) == null ? void 0 : _a3.parent) {
          widget.element.parent.removeChild(widget.element);
        }
      });
    });
    this.runtimeNodes.forEach((node) => {
      const handler = this.startDragHandlers.get(node.id);
      if (handler) {
        node.stageElement.off("pointerdown", handler);
        this.startDragHandlers.delete(node.id);
      }
    });
    this.reset();
  }
  createSelectedNodeWidgets() {
    this.removeSelectedNodeWidgets();
    this.selectedNodes.forEach((node) => {
      this.transformWidgetCollection[node.id] = {
        widgetGroup: {},
        nodeStageElement: node.stageElement,
        referenceElement: null,
        nodeStartWidth: node.stageElement.width,
        nodeStartHeight: node.stageElement.height,
        startAspectRatio: node.stageElement.width / node.stageElement.height,
        startRotation: node.stageElement.rotation
      };
      this.createBoxWidget(node);
      this.createTransformWidgets(node);
    });
  }
  refreshSelectedNodeWidgets() {
    if (this.selectedNodes.length > 0) {
      this.removeSelectedNodeWidgets();
      this.createSelectedNodeWidgets();
    }
  }
  calculateBounds(container) {
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    const calculateBoundsRecursive = (container2) => {
      const globalPos = container2.toGlobal({ x: 0, y: 0 });
      const globalTransform = container2.worldTransform;
      const rotation = Math.atan2(globalTransform.b, globalTransform.a);
      const halfWidth = container2.width / 2;
      const halfHeight = container2.height / 2;
      const corners = [
        // Top-left
        {
          x: globalPos.x + (halfWidth * Math.cos(rotation) - halfHeight * Math.sin(rotation)),
          y: globalPos.y + (halfWidth * Math.sin(rotation) + halfHeight * Math.cos(rotation))
        },
        // Top-right
        {
          x: globalPos.x + (-halfWidth * Math.cos(rotation) - halfHeight * Math.sin(rotation)),
          y: globalPos.y + (-halfWidth * Math.sin(rotation) + halfHeight * Math.cos(rotation))
        },
        // Bottom-left
        {
          x: globalPos.x + (halfWidth * Math.cos(rotation) + halfHeight * Math.sin(rotation)),
          y: globalPos.y + (halfWidth * Math.sin(rotation) - halfHeight * Math.cos(rotation))
        },
        // Bottom-right
        {
          x: globalPos.x + (-halfWidth * Math.cos(rotation) + halfHeight * Math.sin(rotation)),
          y: globalPos.y + (-halfWidth * Math.sin(rotation) - halfHeight * Math.cos(rotation))
        }
      ];
      corners.forEach((corner) => {
        minX = Math.min(minX, corner.x);
        minY = Math.min(minY, corner.y);
        maxX = Math.max(maxX, corner.x);
        maxY = Math.max(maxY, corner.y);
      });
      container2.children.forEach((child) => {
        calculateBoundsRecursive(child);
      });
    };
    calculateBoundsRecursive(container);
    return {
      width: maxX - minX,
      height: maxY - minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2
    };
  }
  createBoxWidget(runtimeNode) {
    this.transformWidgetCollection[runtimeNode.id].widgetGroup.box = {
      element: new lr(),
      startPosition: { x: 0, y: 0 }
    };
    const box = this.transformWidgetCollection[runtimeNode.id].widgetGroup.box;
    box.element.label = "selectionIndicator";
    const edgeThickness = 4;
    let width;
    let height;
    let centerX;
    let centerY;
    if (runtimeNode.stageElement.children.length > 0) {
      const bounds = this.calculateBounds(runtimeNode.stageElement);
      width = bounds.width;
      height = bounds.height;
      centerX = bounds.centerX;
      centerY = bounds.centerY;
    } else {
      width = runtimeNode.stageElement.width;
      height = runtimeNode.stageElement.height;
    }
    const padding = 5;
    const boxWidth = width + padding * 2;
    const boxHeight = height + padding * 2;
    const globalTransform = runtimeNode.stageElement.worldTransform;
    const globalPos = runtimeNode.stageElement.toGlobal({ x: 0, y: 0 });
    const globalRotation = Math.atan2(globalTransform.b, globalTransform.a) * (180 / Math.PI);
    box.element.rect(
      -boxWidth / 2,
      -boxHeight / 2,
      boxWidth,
      boxHeight
    );
    if (runtimeNode.stageElement.children.length > 0 && centerX && centerY) {
      box.element.position.set(centerX, centerY);
    } else {
      box.element.position.set(globalPos.x, globalPos.y);
    }
    box.element.angle = globalRotation;
    box.element.zIndex = runtimeNode.stageElement.zIndex + 1;
    box.element.stroke({ color: "#BF3EFF", width: 2 });
    const edges = [
      {
        key: "resizeTop",
        x: -width / 2,
        y: -height / 2 - edgeThickness,
        width,
        height: edgeThickness * 2,
        cursor: "ns-resize",
        resizeAxis: "y"
      },
      {
        key: "resizeRight",
        x: width / 2,
        y: -height / 2,
        width: edgeThickness * 2,
        height,
        cursor: "ew-resize",
        resizeAxis: "x"
      },
      {
        key: "resizeBottom",
        x: -width / 2,
        y: height / 2,
        width,
        height: edgeThickness * 2,
        cursor: "ns-resize",
        resizeAxis: "y"
      },
      {
        key: "resizeLeft",
        x: -width / 2 - edgeThickness,
        y: -height / 2,
        width: edgeThickness * 2,
        height,
        cursor: "ew-resize",
        resizeAxis: "x"
      }
    ];
    if (runtimeNode.type === "Text" && runtimeNode.properties.wordWrap && runtimeNode.properties.wordWrapWidth !== null && runtimeNode.properties.wordWrapWidth !== void 0) {
      const textElement = runtimeNode.stageElement;
      const wordWrapWidth = textElement.style.wordWrapWidth;
      const wordWrapHandles = [
        {
          key: "wordWrapLeft",
          x: -wordWrapWidth / 2 - edgeThickness * 2,
          y: -height / 2,
          width: edgeThickness * 2,
          height,
          isWordWrap: true
        },
        {
          key: "wordWrapRight",
          x: wordWrapWidth / 2,
          y: -height / 2,
          width: edgeThickness * 2,
          height,
          isWordWrap: true
        }
      ];
      wordWrapHandles.forEach((handleConfig) => {
        const wordWrapHandle = new lr();
        wordWrapHandle.label = `wordWrapHandle_${handleConfig.key}`;
        wordWrapHandle.rect(handleConfig.x, handleConfig.y, handleConfig.width, handleConfig.height);
        wordWrapHandle.fill({ color: "#13DFF2", alpha: 0.7 });
        wordWrapHandle.stroke({ color: "#13DFF2", width: 1 });
        if (runtimeNode.stageElement.children.length > 0 && centerX && centerY) {
          wordWrapHandle.position.set(centerX, centerY);
        } else {
          wordWrapHandle.position.set(globalPos.x, globalPos.y);
        }
        wordWrapHandle.eventMode = "static";
        wordWrapHandle.rotation = globalRotation * (Math.PI / 180);
        this.transformWidgetCollection[runtimeNode.id].widgetGroup[handleConfig.key] = {
          element: wordWrapHandle,
          startPosition: { x: wordWrapHandle.x, y: wordWrapHandle.y },
          isWordWrap: true
        };
        this.stage.addChild(wordWrapHandle);
        wordWrapHandle.zIndex = runtimeNode.stageElement.zIndex + 3;
      });
    }
    edges.forEach((edge) => {
      const handle = new lr();
      handle.label = `edgeHandle_${edge.key}`;
      handle.rect(edge.x, edge.y, edge.width, edge.height);
      handle.fill({ color: "#BF3EFF", alpha: 0 });
      if (runtimeNode.stageElement.children.length > 0) {
        handle.position.set(centerX, centerY);
      } else {
        handle.position.set(globalPos.x, globalPos.y);
      }
      handle.eventMode = "static";
      handle.cursor = edge.cursor;
      handle.rotation = globalRotation * (Math.PI / 180);
      this.transformWidgetCollection[runtimeNode.id].widgetGroup[edge.key] = {
        element: handle,
        startPosition: { x: handle.x, y: handle.y },
        resizeAxis: edge.resizeAxis
      };
      handle.on("pointerdown", (e) => {
        e.stopPropagation();
        this.activeAxis = edge.resizeAxis;
        this.onEdgeResizeStart(e, runtimeNode.stageElement, edge.key);
      });
      this.stage.addChild(handle);
      handle.zIndex = runtimeNode.stageElement.zIndex + 2;
    });
    this.stage.addChild(box.element);
    box.element.zIndex = runtimeNode.stageElement.zIndex + 1;
    runtimeNode.stageElement.eventMode = "static";
    runtimeNode.stageElement.cursor = "move";
    if (runtimeNode.type === "Group") {
      runtimeNode.stageElement.interactiveChildren = true;
      const setChildrenEventMode = (container) => {
        container.eventMode = "static";
        container.cursor = "move";
        container.children.forEach((child) => {
          setChildrenEventMode(child);
        });
      };
      setChildrenEventMode(runtimeNode.stageElement);
    }
    if (runtimeNode.parentNode) {
      const setParentEventMode = (container) => {
        container.interactiveChildren = true;
        container.eventMode = "static";
        if (container.parent) {
          setParentEventMode(container.parent);
        }
      };
      setParentEventMode(runtimeNode.parentNode.stageElement);
    }
    const handler = (e, additionalData) => {
      e.stopPropagation();
      const { metaKey, shiftKey } = e;
      if (e.metaKey && !(additionalData == null ? void 0 : additionalData.isEmulated)) {
        const message = {
          type: Events.SEND_SELECTED_NODE_TO_EDITOR,
          payload: {
            nodeId: runtimeNode.id,
            metaKey,
            shiftKey
          }
        };
        window.parent.postMessage(message, "*");
      } else if (e.altKey && !(additionalData == null ? void 0 : additionalData.isEmulated)) {
        const message = {
          type: Events.SEND_DUPLICATE_REQUEST_TO_EDITOR
        };
        window.parent.postMessage(message, "*");
      } else {
        this.activeAxis = "both";
        this.onDragStart(e, runtimeNode.stageElement);
      }
    };
    this.startDragHandlers.set(runtimeNode.id, handler);
    runtimeNode.stageElement.on("pointerdown", handler);
  }
  createTransformWidgets(runtimeNode) {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
    const transformHandles = [
      {
        key: "transformTop",
        cursor: "ns-resize",
        axis: "y"
      },
      {
        key: "transformRight",
        cursor: "ew-resize",
        axis: "x"
      },
      {
        key: "transformBottom",
        cursor: "ns-resize",
        axis: "y"
      },
      {
        key: "transformLeft",
        cursor: "ew-resize",
        axis: "x"
      }
    ];
    const rotationHandles = [
      {
        key: "rotationTop",
        cursor: "pointer",
        isRotation: true
      },
      {
        key: "rotationRight",
        cursor: "pointer",
        isRotation: true
      },
      {
        key: "rotationBottom",
        cursor: "pointer",
        isRotation: true
      },
      {
        key: "rotationLeft",
        cursor: "pointer",
        isRotation: true
      }
    ];
    transformHandles.forEach((handle) => {
      const widget = new lr();
      widget.drawRect(-1 * this.transformWidgetSettings.offset, -1 * this.transformWidgetSettings.offset, this.transformWidgetSettings.size, this.transformWidgetSettings.size);
      widget.fill({ color: this.transformWidgetSettings.color });
      widget.eventMode = "static";
      widget.cursor = handle.cursor;
      this.transformWidgetCollection[runtimeNode.id].widgetGroup[handle.key] = {
        element: widget,
        startPosition: { x: 0, y: 0 }
      };
      widget.on("pointerover", () => {
        const angle = runtimeNode.stageElement.angle;
        const normalizedAngle = (angle % 360 + 360) % 360;
        let cursor = handle.cursor;
        if (handle.key === "transformTop" || handle.key === "transformBottom") {
          if (normalizedAngle > 45 && normalizedAngle <= 135) {
            cursor = "ew-resize";
          } else if (normalizedAngle > 225 && normalizedAngle <= 315) {
            cursor = "ew-resize";
          } else {
            cursor = "ns-resize";
          }
        } else {
          if (normalizedAngle > 45 && normalizedAngle <= 135) {
            cursor = "ns-resize";
          } else if (normalizedAngle > 225 && normalizedAngle <= 315) {
            cursor = "ns-resize";
          } else {
            cursor = "ew-resize";
          }
        }
        widget.cursor = cursor;
      });
      widget.on("pointerout", () => {
        widget.cursor = handle.cursor;
      });
      widget.on("pointerdown", (e) => {
        e.stopPropagation();
        this.activeAxis = handle.axis;
        this.onDragStart(e, runtimeNode.stageElement);
      });
    });
    rotationHandles.forEach((handle) => {
      const widget = new lr();
      widget.drawCircle(0, 0, this.transformWidgetSettings.size / 2);
      widget.fill({ color: this.transformWidgetSettings.color });
      widget.eventMode = "static";
      widget.cursor = handle.cursor;
      this.transformWidgetCollection[runtimeNode.id].widgetGroup[handle.key] = {
        element: widget,
        startPosition: { x: 0, y: 0 },
        isRotation: true
      };
      widget.on("pointerdown", (e) => {
        e.stopPropagation();
        this.onRotationStart(e, runtimeNode.stageElement);
      });
    });
    let width, height, centerX, centerY;
    if (runtimeNode.stageElement.children.length > 0) {
      const bounds = this.calculateBounds(runtimeNode.stageElement);
      width = bounds.width;
      height = bounds.height;
      centerX = bounds.centerX;
      centerY = bounds.centerY;
    } else {
      width = runtimeNode.stageElement.width;
      height = runtimeNode.stageElement.height;
      const globalPos = runtimeNode.stageElement.toGlobal({ x: 0, y: 0 });
      centerX = globalPos.x;
      centerY = globalPos.y;
    }
    const globalTransform = runtimeNode.stageElement.worldTransform;
    const globalRotation = Math.atan2(globalTransform.b, globalTransform.a);
    const handleSize = this.transformWidgetSettings.size;
    const transformPositions = [
      {
        key: "transformTop",
        x: 0,
        y: -height / 2 - this.transformWidgetSettings.padding - handleSize / 2
      },
      {
        key: "transformBottom",
        x: 0,
        y: height / 2 + this.transformWidgetSettings.padding + handleSize / 2
      },
      {
        key: "transformLeft",
        x: -width / 2 - this.transformWidgetSettings.padding - handleSize / 2,
        y: 0
      },
      {
        key: "transformRight",
        x: width / 2 + this.transformWidgetSettings.padding + handleSize / 2,
        y: 0
      }
    ];
    transformPositions.forEach((pos) => {
      const widget = this.transformWidgetCollection[runtimeNode.id].widgetGroup[pos.key];
      if (widget == null ? void 0 : widget.element) {
        const rotatedX = pos.x * Math.cos(globalRotation) - pos.y * Math.sin(globalRotation);
        const rotatedY = pos.x * Math.sin(globalRotation) + pos.y * Math.cos(globalRotation);
        widget.element.position.set(
          centerX + rotatedX,
          centerY + rotatedY
        );
        widget.element.rotation = globalRotation;
        widget.startPosition = { x: widget.element.x, y: widget.element.y };
      }
    });
    const rotationOffset = this.transformWidgetSettings.padding;
    const rotationPositions = [
      {
        key: "rotationTop",
        x: -width / 2 - rotationOffset - handleSize / 2,
        y: -height / 2 - rotationOffset - handleSize / 2
      },
      {
        key: "rotationRight",
        x: width / 2 + rotationOffset + handleSize / 2,
        y: -height / 2 - rotationOffset - handleSize / 2
      },
      {
        key: "rotationBottom",
        x: width / 2 + rotationOffset + handleSize / 2,
        y: height / 2 + rotationOffset + handleSize / 2
      },
      {
        key: "rotationLeft",
        x: -width / 2 - rotationOffset - handleSize / 2,
        y: height / 2 + rotationOffset + handleSize / 2
      }
    ];
    rotationPositions.forEach((pos) => {
      const widget = this.transformWidgetCollection[runtimeNode.id].widgetGroup[pos.key];
      if (widget == null ? void 0 : widget.element) {
        const rotatedX = pos.x * Math.cos(globalRotation) - pos.y * Math.sin(globalRotation);
        const rotatedY = pos.x * Math.sin(globalRotation) + pos.y * Math.cos(globalRotation);
        widget.element.position.set(
          centerX + rotatedX,
          centerY + rotatedY
        );
        widget.element.rotation = globalRotation;
        widget.startPosition = { x: widget.element.x, y: widget.element.y };
      }
    });
    this.stage.addChild(
      (_a2 = this.transformWidgetCollection[runtimeNode.id].widgetGroup.transformTop) == null ? void 0 : _a2.element,
      (_b2 = this.transformWidgetCollection[runtimeNode.id].widgetGroup.transformRight) == null ? void 0 : _b2.element,
      (_c2 = this.transformWidgetCollection[runtimeNode.id].widgetGroup.transformBottom) == null ? void 0 : _c2.element,
      (_d2 = this.transformWidgetCollection[runtimeNode.id].widgetGroup.transformLeft) == null ? void 0 : _d2.element,
      (_e2 = this.transformWidgetCollection[runtimeNode.id].widgetGroup.rotationTop) == null ? void 0 : _e2.element,
      (_f2 = this.transformWidgetCollection[runtimeNode.id].widgetGroup.rotationRight) == null ? void 0 : _f2.element,
      (_g2 = this.transformWidgetCollection[runtimeNode.id].widgetGroup.rotationBottom) == null ? void 0 : _g2.element,
      (_h2 = this.transformWidgetCollection[runtimeNode.id].widgetGroup.rotationLeft) == null ? void 0 : _h2.element
    );
  }
  createReferenceElement(collection) {
    collection.referenceElement = new lt();
    collection.referenceElement.scale.set(
      collection.nodeStageElement.scale.x,
      collection.nodeStageElement.scale.y
    );
    collection.referenceElement.position.set(
      collection.nodeStageElement.x,
      collection.nodeStageElement.y
    );
    collection.referenceElement.angle = collection.nodeStageElement.angle;
    collection.nodeStageElement.parent.addChild(collection.referenceElement);
  }
  onDragStart(e, element) {
    var _a2;
    const nodeId = (_a2 = this.runtimeNodes.find((n) => n.stageElement === element)) == null ? void 0 : _a2.id;
    if (!nodeId) return;
    Object.values(this.transformWidgetCollection).forEach((collection) => {
      this.createReferenceElement(collection);
    });
    Object.values(this.transformWidgetCollection).forEach((collection) => {
      Object.values(collection.widgetGroup).forEach((widget) => {
        widget.startPosition = { x: widget == null ? void 0 : widget.element.x, y: widget == null ? void 0 : widget.element.y };
      });
    });
    this.isDragging = true;
    this.dragStartX = e.globalX;
    this.dragStartY = e.globalY;
    this.stage.on("pointermove", (e22) => this.onDragMove(e22, nodeId));
    this.stage.on("pointerup", () => this.onDragEnd());
    this.stage.on("pointerupoutside", () => this.onDragEnd());
  }
  onDragMove(e, nodeId) {
    var _a2, _b2, _c2, _d2;
    if (this.isDragging) {
      let deltaX = e.globalX - this.dragStartX;
      let deltaY = e.globalY - this.dragStartY;
      if (this.activeAxis === "x" || this.activeAxis === "y") {
        const leftHandle = (_a2 = this.transformWidgetCollection[nodeId].widgetGroup.transformLeft) == null ? void 0 : _a2.element.position;
        const rightHandle = (_b2 = this.transformWidgetCollection[nodeId].widgetGroup.transformRight) == null ? void 0 : _b2.element.position;
        const topHandle = (_c2 = this.transformWidgetCollection[nodeId].widgetGroup.transformTop) == null ? void 0 : _c2.element.position;
        const bottomHandle = (_d2 = this.transformWidgetCollection[nodeId].widgetGroup.transformBottom) == null ? void 0 : _d2.element.position;
        let dirX = 0, dirY = 0;
        if (this.activeAxis === "x" && leftHandle && rightHandle) {
          dirX = rightHandle.x - leftHandle.x;
          dirY = rightHandle.y - leftHandle.y;
        } else if (this.activeAxis === "y" && topHandle && bottomHandle) {
          dirX = bottomHandle.x - topHandle.x;
          dirY = bottomHandle.y - topHandle.y;
        }
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        if (length > 0) {
          dirX /= length;
          dirY /= length;
          const projected = deltaX * dirX + deltaY * dirY;
          Object.values(this.transformWidgetCollection).forEach((collection) => {
            if (!collection.referenceElement) {
              this.createReferenceElement(collection);
            }
            if (collection.nodeStageElement.parent) {
              const parentTransform = collection.nodeStageElement.parent.worldTransform;
              const parentRotation = Math.atan2(parentTransform.b, parentTransform.a);
              const rotatedDirX = dirX * Math.cos(-parentRotation) - dirY * Math.sin(-parentRotation);
              const rotatedDirY = dirX * Math.sin(-parentRotation) + dirY * Math.cos(-parentRotation);
              collection.nodeStageElement.x = collection.referenceElement.x + projected * rotatedDirX;
              collection.nodeStageElement.y = collection.referenceElement.y + projected * rotatedDirY;
            } else {
              collection.nodeStageElement.x = collection.referenceElement.x + projected * dirX;
              collection.nodeStageElement.y = collection.referenceElement.y + projected * dirY;
            }
          });
        }
      } else {
        Object.values(this.transformWidgetCollection).forEach((collection) => {
          if (!collection.referenceElement) {
            this.createReferenceElement(collection);
          }
          if (collection.nodeStageElement.parent) {
            const parentTransform = collection.nodeStageElement.parent.worldTransform;
            const parentRotation = Math.atan2(parentTransform.b, parentTransform.a);
            const rotatedDeltaX = deltaX * Math.cos(-parentRotation) - deltaY * Math.sin(-parentRotation);
            const rotatedDeltaY = deltaX * Math.sin(-parentRotation) + deltaY * Math.cos(-parentRotation);
            collection.nodeStageElement.x = collection.referenceElement.x + rotatedDeltaX;
            collection.nodeStageElement.y = collection.referenceElement.y + rotatedDeltaY;
          } else {
            collection.nodeStageElement.x = collection.referenceElement.x + deltaX;
            collection.nodeStageElement.y = collection.referenceElement.y + deltaY;
          }
        });
      }
      this.updateWidgets();
    }
  }
  onDragEnd() {
    this.activeAxis = null;
    Object.values(this.transformWidgetCollection).forEach((collection) => {
      var _a2;
      (_a2 = collection.referenceElement) == null ? void 0 : _a2.destroy();
    });
    this.isDragging = false;
    this.stage.off("pointermove");
    this.stage.off("pointerup");
    this.stage.off("pointerupoutside");
    let updatedNodeData = [];
    Object.values(this.transformWidgetCollection).forEach((collection) => {
      const runtimeNode = this.runtimeNodes.find((n) => n.stageElement === collection.nodeStageElement);
      if (runtimeNode) {
        const editorPosition = this.player.layout.getEditorPosition(
          { x: runtimeNode.stageElement.x, y: runtimeNode.stageElement.y },
          runtimeNode.parentNode
        );
        updatedNodeData.push({
          nodeId: runtimeNode.id,
          position: editorPosition
        });
      }
    });
    const message = {
      type: Events.SEND_MODIFIED_NODES_TO_EDITOR,
      payload: updatedNodeData
    };
    window.parent.postMessage(message, "*");
  }
  onEdgeResizeStart(e, element, edgeKey) {
    var _a2;
    const nodeId = (_a2 = this.runtimeNodes.find((n) => n.stageElement === element)) == null ? void 0 : _a2.id;
    if (!nodeId) return;
    this.isDragging = true;
    this.dragStartX = e.globalX;
    this.dragStartY = e.globalY;
    Object.values(this.transformWidgetCollection).forEach((collection) => {
      collection.nodeStartWidth = collection.nodeStageElement.width;
      collection.nodeStartHeight = collection.nodeStageElement.height;
      collection.startAspectRatio = collection.nodeStageElement.width / collection.nodeStageElement.height;
    });
    this.activeEdge = edgeKey;
    this.stage.on("pointermove", (e22) => this.onEdgeResizeMove(e22));
    this.stage.on("pointerup", () => this.onEdgeResizeEnd());
    this.stage.on("pointerupoutside", () => this.onEdgeResizeEnd());
  }
  onEdgeResizeMove(e) {
    if (this.isDragging) {
      const deltaX = e.globalX - this.dragStartX;
      const deltaY = e.globalY - this.dragStartY;
      Object.values(this.transformWidgetCollection).forEach((collection) => {
        let newWidth = collection.nodeStartWidth;
        let newHeight = collection.nodeStartHeight;
        switch (this.activeEdge) {
          case "resizeLeft":
            newWidth = collection.nodeStartWidth - deltaX;
            break;
          case "resizeRight":
            newWidth = collection.nodeStartWidth + deltaX;
            break;
          case "resizeTop":
            newHeight = collection.nodeStartHeight - deltaY;
            break;
          case "resizeBottom":
            newHeight = collection.nodeStartHeight + deltaY;
            break;
        }
        if (this.activeEdge === "resizeLeft" || this.activeEdge === "resizeRight") {
          newHeight = newWidth / collection.startAspectRatio;
        } else {
          newWidth = newHeight * collection.startAspectRatio;
        }
        if (collection.nodeStageElement instanceof Ka) {
          let modifyType = "fontSize";
          if (this.recordingKeyframeTrack && this.recordingKeyframeTrack.type === "Scale") {
            modifyType = "scale";
          }
          if (modifyType === "fontSize") {
            const textElement = collection.nodeStageElement;
            const rawScaleFactor = Math.max(newWidth / collection.nodeStartWidth, newHeight / collection.nodeStartHeight);
            const dampingFactor = 0.2;
            const scaleFactor = 1 + (rawScaleFactor - 1) * dampingFactor;
            const currentFontSize = textElement.style.fontSize;
            const originalFontSize = collection.nodeStartWidth > 0 ? currentFontSize / (collection.nodeStageElement.width / collection.nodeStartWidth) : currentFontSize;
            const newFontSize = originalFontSize * scaleFactor;
            const minFontSize = 8;
            const maxFontSize = 200;
            if (newFontSize >= minFontSize && newFontSize <= maxFontSize) {
              textElement.style.fontSize = newFontSize;
              this.updateWidgets();
            }
            return;
          }
        }
        const minSize = 0.01;
        if (newWidth >= minSize && newHeight >= minSize) {
          collection.nodeStageElement.width = newWidth;
          collection.nodeStageElement.height = newHeight;
          this.updateWidgets();
        }
      });
    }
  }
  onEdgeResizeEnd() {
    this.isDragging = false;
    this.activeEdge = null;
    this.stage.off("pointermove");
    this.stage.off("pointerup");
    this.stage.off("pointerupoutside");
    let updatedNodeData = [];
    Object.values(this.transformWidgetCollection).forEach((collection) => {
      const runtimeNode = this.runtimeNodes.find((n) => n.stageElement === collection.nodeStageElement);
      if (runtimeNode) {
        let data = {
          nodeId: runtimeNode == null ? void 0 : runtimeNode.id
        };
        if (runtimeNode.type === "Image") {
          if (!runtimeNode.properties.imageId) {
            data.scale = {
              x: 1,
              y: 1
            };
          } else {
            data.scale = {
              x: runtimeNode.stageElement.scale.x / this.xScalingFactor,
              y: runtimeNode.stageElement.scale.y / this.yScalingFactor
            };
          }
        } else if (runtimeNode.type === "Graphic") {
          data.scale = {
            x: runtimeNode.stageElement.scale.x * 100,
            y: runtimeNode.stageElement.scale.y * 100
          };
        } else if (collection.nodeStageElement instanceof Ka) {
          if (this.recordingKeyframeTrack) {
            if (this.recordingKeyframeTrack.type === "FontSize") {
              data.fontSize = collection.nodeStageElement.style.fontSize / this.yScalingFactor;
            } else {
              data.scale = {
                x: runtimeNode.stageElement.scale.x,
                y: runtimeNode.stageElement.scale.y
              };
            }
          } else {
            data.fontSize = collection.nodeStageElement.style.fontSize / this.yScalingFactor;
          }
        } else {
          data.scale = {
            x: runtimeNode.stageElement.scale.x,
            y: runtimeNode.stageElement.scale.y
          };
        }
        updatedNodeData.push(data);
      }
    });
    const message = {
      type: Events.SEND_MODIFIED_NODES_TO_EDITOR,
      payload: updatedNodeData
    };
    window.parent.postMessage(message, "*");
  }
  onRotationStart(e, element) {
    var _a2;
    const nodeId = (_a2 = this.runtimeNodes.find((n) => n.stageElement === element)) == null ? void 0 : _a2.id;
    if (!nodeId) return;
    this.isDragging = true;
    this.dragStartX = e.globalX;
    this.dragStartY = e.globalY;
    const globalCenter = element.toGlobal({ x: 0, y: 0 });
    Object.values(this.transformWidgetCollection).forEach((collection) => {
      const dx2 = e.globalX - globalCenter.x;
      const dy2 = e.globalY - globalCenter.y;
      collection.startRotation = Math.atan2(dy2, dx2) * (180 / Math.PI);
      this.stage.on("pointermove", (e22) => this.onRotationMove(e22, element));
      this.stage.on("pointerup", () => this.onRotationEnd());
      this.stage.on("pointerupoutside", () => this.onRotationEnd());
    });
  }
  onRotationMove(e, originElement) {
    if (this.isDragging && originElement) {
      const globalCenter = originElement.toGlobal({ x: 0, y: 0 });
      const dx2 = e.globalX - globalCenter.x;
      const dy2 = e.globalY - globalCenter.y;
      let currentAngle = Math.atan2(dy2, dx2) * (180 / Math.PI);
      Object.values(this.transformWidgetCollection).forEach((collection) => {
        let rotationDelta = currentAngle - collection.startRotation;
        collection.nodeStageElement.angle = (collection.nodeStageElement.angle + rotationDelta) % 360;
        collection.startRotation = currentAngle;
        this.updateWidgets();
      });
    }
  }
  onRotationEnd() {
    this.isDragging = false;
    this.stage.off("pointermove");
    this.stage.off("pointerup");
    this.stage.off("pointerupoutside");
    let updatedNodeData = [];
    Object.values(this.transformWidgetCollection).forEach((collection) => {
      const runtimeNode = this.runtimeNodes.find((n) => n.stageElement === collection.nodeStageElement);
      if (runtimeNode) {
        updatedNodeData.push({
          nodeId: runtimeNode.id,
          rotation: runtimeNode.stageElement.angle
        });
      }
    });
    const message = {
      type: Events.SEND_MODIFIED_NODES_TO_EDITOR,
      payload: updatedNodeData
    };
    window.parent.postMessage(message, "*");
  }
  updateWidgets() {
    Object.values(this.transformWidgetCollection).forEach((collection) => {
      var _a2;
      const element = collection.nodeStageElement;
      const box = (_a2 = collection.widgetGroup.box) == null ? void 0 : _a2.element;
      const edgeThickness = 4;
      const padding = 5;
      let width, height, centerX, centerY;
      if (element.children.length > 0) {
        const bounds = this.calculateBounds(element);
        width = bounds.width;
        height = bounds.height;
        centerX = bounds.centerX;
        centerY = bounds.centerY;
      } else {
        width = element.width;
        height = element.height;
        const globalPos = element.toGlobal({ x: 0, y: 0 });
        centerX = globalPos.x;
        centerY = globalPos.y;
      }
      const globalTransform = element.worldTransform;
      const globalRotation = Math.atan2(globalTransform.b, globalTransform.a);
      const boxWidth = width + padding * 2;
      const boxHeight = height + padding * 2;
      box.clear();
      box.position.set(centerX, centerY);
      box.rect(
        -boxWidth / 2,
        -boxHeight / 2,
        boxWidth,
        boxHeight
      );
      box.stroke({ color: "#BF3EFF", width: 2 });
      box.rotation = globalRotation;
      const handleSize = this.transformWidgetSettings.size;
      const transformPositions = [
        {
          key: "transformTop",
          x: 0,
          y: -height / 2 - this.transformWidgetSettings.padding - handleSize / 2
        },
        {
          key: "transformBottom",
          x: 0,
          y: height / 2 + this.transformWidgetSettings.padding + handleSize / 2
        },
        {
          key: "transformLeft",
          x: -width / 2 - this.transformWidgetSettings.padding - handleSize / 2,
          y: 0
        },
        {
          key: "transformRight",
          x: width / 2 + this.transformWidgetSettings.padding + handleSize / 2,
          y: 0
        }
      ];
      transformPositions.forEach((pos) => {
        const widget = collection.widgetGroup[pos.key];
        if (widget == null ? void 0 : widget.element) {
          const rotatedX = pos.x * Math.cos(globalRotation) - pos.y * Math.sin(globalRotation);
          const rotatedY = pos.x * Math.sin(globalRotation) + pos.y * Math.cos(globalRotation);
          widget.element.position.set(
            centerX + rotatedX,
            centerY + rotatedY
          );
          widget.element.rotation = globalRotation;
          widget.startPosition = { x: widget.element.x, y: widget.element.y };
        }
      });
      const rotationOffset = this.transformWidgetSettings.padding;
      const rotationPositions = [
        {
          key: "rotationTop",
          x: -width / 2 - rotationOffset - handleSize / 2,
          y: -height / 2 - rotationOffset - handleSize / 2
        },
        {
          key: "rotationRight",
          x: width / 2 + rotationOffset + handleSize / 2,
          y: -height / 2 - rotationOffset - handleSize / 2
        },
        {
          key: "rotationBottom",
          x: width / 2 + rotationOffset + handleSize / 2,
          y: height / 2 + rotationOffset + handleSize / 2
        },
        {
          key: "rotationLeft",
          x: -width / 2 - rotationOffset - handleSize / 2,
          y: height / 2 + rotationOffset + handleSize / 2
        }
      ];
      rotationPositions.forEach((pos) => {
        const widget = collection.widgetGroup[pos.key];
        if (widget == null ? void 0 : widget.element) {
          const rotatedX = pos.x * Math.cos(globalRotation) - pos.y * Math.sin(globalRotation);
          const rotatedY = pos.x * Math.sin(globalRotation) + pos.y * Math.cos(globalRotation);
          widget.element.position.set(
            centerX + rotatedX,
            centerY + rotatedY
          );
          widget.element.rotation = globalRotation;
          widget.startPosition = { x: widget.element.x, y: widget.element.y };
        }
      });
      const edges = [
        {
          key: "resizeTop",
          x: -width / 2,
          y: -height / 2 - edgeThickness,
          width,
          height: edgeThickness * 2
        },
        {
          key: "resizeRight",
          x: width / 2,
          y: -height / 2,
          width: edgeThickness * 2,
          height
        },
        {
          key: "resizeBottom",
          x: -width / 2,
          y: height / 2,
          width,
          height: edgeThickness * 2
        },
        {
          key: "resizeLeft",
          x: -width / 2 - edgeThickness,
          y: -height / 2,
          width: edgeThickness * 2,
          height
        }
      ];
      edges.forEach((edge) => {
        const handle = collection.widgetGroup[edge.key];
        if (handle) {
          const rotatedX = edge.x * Math.cos(globalRotation) - edge.y * Math.sin(globalRotation);
          const rotatedY = edge.x * Math.sin(globalRotation) + edge.y * Math.cos(globalRotation);
          handle.element.position.set(
            centerX + rotatedX,
            centerY + rotatedY
          );
          handle.element.rotation = globalRotation;
          handle.element.width = edge.width;
          handle.element.height = edge.height;
        }
      });
      if (element instanceof Ka && collection.widgetGroup.wordWrapLeft && collection.widgetGroup.wordWrapRight) {
        const wordWrapWidth = element.style.wordWrapWidth;
        const wordWrapHandles = [
          {
            key: "wordWrapLeft",
            x: -wordWrapWidth / 2 - edgeThickness * 2,
            y: -height / 2,
            width: edgeThickness * 2,
            height
          },
          {
            key: "wordWrapRight",
            x: wordWrapWidth / 2,
            y: -height / 2,
            width: edgeThickness * 2,
            height
          }
        ];
        wordWrapHandles.forEach((handleConfig) => {
          const handle = collection.widgetGroup[handleConfig.key];
          if (handle) {
            const rotatedX = handleConfig.x * Math.cos(globalRotation) - handleConfig.y * Math.sin(globalRotation);
            const rotatedY = handleConfig.x * Math.sin(globalRotation) + handleConfig.y * Math.cos(globalRotation);
            handle.element.position.set(
              centerX + rotatedX,
              centerY + rotatedY
            );
            handle.element.rotation = globalRotation;
            handle.element.width = handleConfig.width;
            handle.element.height = handleConfig.height;
          }
        });
      }
    });
  }
}
class RuntimeImageAsset {
  constructor(imageAsset) {
    __publicField(this, "id");
    __publicField(this, "name");
    __publicField(this, "path");
    __publicField(this, "type");
    __publicField(this, "fileSize");
    __publicField(this, "image");
    this.id = imageAsset.id;
    this.name = imageAsset.name;
    this.path = imageAsset.path;
    this.type = imageAsset.type;
    this.fileSize = imageAsset.fileSize;
  }
  static async create(imageAsset) {
    const instance = new RuntimeImageAsset(imageAsset);
    await instance.initialize();
    return instance;
  }
  async initialize() {
    const loadedImage = await new Promise(async (resolve, reject) => {
      const image = await Yr.load({
        alias: this.id,
        src: this.path,
        type: "image"
      });
      resolve(image);
    });
    this.image = loadedImage;
  }
}
class Player extends EventTarget {
  constructor(scrollCinemaContainer) {
    super();
    __publicField(this, "renderingEngine");
    __publicField(this, "layout");
    __publicField(this, "isScrolling");
    __publicField(this, "pointerMonitor");
    __publicField(this, "wheelMonitor");
    __publicField(this, "wheelApplier");
    __publicField(this, "pointerApplier");
    __publicField(this, "momentumApplier");
    __publicField(this, "autoplayer");
    __publicField(this, "content");
    __publicField(this, "editorWidgets");
    __publicField(this, "currentMasterTime");
    __publicField(this, "previousMasterTime");
    __publicField(this, "deltaTime");
    __publicField(this, "masterDuration");
    __publicField(this, "reels", {});
    // sequences: { [key: string]: RuntimeSequenceType } = {};
    __publicField(this, "initialized");
    __publicField(this, "audioSources", []);
    __publicField(this, "isReversing", false);
    __publicField(this, "isIOS");
    __publicField(this, "editorMode", EditorMode.Manipulation);
    __publicField(this, "provisionalClip", null);
    __publicField(this, "fontFamilies", []);
    __publicField(this, "selectedNodes", []);
    __publicField(this, "selectionHandlers", /* @__PURE__ */ new Map());
    __publicField(this, "selectionEvent");
    __publicField(this, "selectedSequences", []);
    __publicField(this, "loadedProjectSize", 0);
    __publicField(this, "projectSize", 0);
    __publicField(this, "imageAssets", []);
    __publicField(this, "previewingSequences");
    // In some cases, we need to know a specific player container
    // to resize the player when the parent window is resized.
    // We use a query selector to get the player container because
    // we can't pass DOM elements directly through window.postMessage.
    __publicField(this, "playerContainer");
    this.layout = new Layout(this, scrollCinemaContainer);
    this.isScrolling = false;
    this.currentMasterTime = 0;
    this.previousMasterTime = 0;
    this.masterDuration = 0;
    this.initialized = false;
    this.selectedNodes = [];
    this.selectedSequences = [];
    this.playerContainer = null;
    this.previewingSequences = [];
    this.isIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream;
  }
  get runtimeNodes() {
    return this.content.runtimeNodes;
  }
  get stage() {
    return this.renderingEngine.stage;
  }
  get isTouching() {
    return this.pointerMonitor.isTouching;
  }
  get scrollCinemaContainer() {
    return this.layout.scrollCinemaContainer;
  }
  get isEditMode() {
    return window.ScrollCinemaData.isEditMode;
  }
  static async create(scrollCinemaContainer, parentHeight, playerContainerSelector) {
    const instance = new Player(scrollCinemaContainer);
    await instance.initialize(parentHeight, playerContainerSelector);
    return instance;
  }
  async initialize(parentHeight, playerContainerSelector) {
    this.renderingEngine = new Rm();
    this.playerContainer = playerContainerSelector ? document.querySelector(playerContainerSelector) : null;
    window.parent.__PIXI_DEVTOOLS__ = {
      app: this.renderingEngine
    };
    await this.renderingEngine.init({
      backgroundAlpha: 0,
      resizeTo: this.layout.scrollCinemaContainer,
      autoDensity: true,
      powerPreference: "high-performance",
      antialias: true
    });
    this.layout.scrollCinemaContainer.appendChild(this.renderingEngine.canvas);
    this.renderingEngine.stage.eventMode = "static";
    this.renderingEngine.stage.hitArea = this.renderingEngine.screen;
    this.wheelMonitor = new WheelMonitor(this);
    this.pointerMonitor = new TouchMonitor(this);
    this.setPlayerSize(parentHeight);
    this.content = new Content(this);
    if (!this.isEditMode) {
      await this.loadDataFromGlobal();
    }
    this.wheelApplier = new WheelApplier(this);
    this.pointerApplier = new PointerApplier(this);
    this.momentumApplier = new MomentumApplier(this);
    this.autoplayer = new Autoplayer(this);
    this.editorWidgets = new EditorWidgets(this);
    window.addEventListener("resize", async () => {
      var _a2;
      if (!this.initialized || this.isEditMode) {
        return;
      }
      debounce(this.resizePlayerFromRuntime(((_a2 = this.playerContainer) == null ? void 0 : _a2.clientHeight) || window.parent.document.documentElement.clientHeight));
    });
    setInterval(() => this.playbackLoop(), 5);
    this.initialized = true;
    if (this.isEditMode) {
      window.addEventListener("keydown", (e) => {
        const message2 = { type: Events.SEND_KEYBOARD_EVENT_TO_EDITOR, payload: {
          key: e.key,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey
        } };
        window.parent.postMessage(message2, "*");
      });
      if (this.editorMode === EditorMode.Manipulation) {
        this.initializeSelectionHandlers();
      }
    }
    if (!this.isEditMode) {
      this.playAudioSources();
      Ht.muteAll();
      window.addEventListener("message", (e) => {
        const eventMessage = Events.TOGGLE_AUDIO ? Events.TOGGLE_AUDIO : "TOGGLE_AUDIO";
        if (e.data.type === eventMessage) {
          const { audioEnabled } = e.data.payload;
          if (audioEnabled) {
            Ht.unmuteAll();
          } else {
            Ht.muteAll();
          }
        }
      });
    }
    const hasAudio = this.audioSources.length > 0;
    const message = { type: Events.PLAYER_READY ? Events.PLAYER_READY : "PLAYER_READY", payload: { hasAudio } };
    window.postMessage(message, "*");
    window.parent.postMessage(message, "*");
  }
  async loadDataFromGlobal() {
    const maxRetries = 5;
    const retryDelay = 1e3;
    let retryCount = 0;
    while (retryCount < maxRetries) {
      try {
        let scrollieData = null;
        if (window.ScrollCinemaData && window.ScrollCinemaData.scrollie_data) {
          scrollieData = window.ScrollCinemaData.scrollie_data;
        } else {
          scrollieData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)).meta;
        }
        if (scrollieData) {
          const projectItemsString = Array.isArray(scrollieData.projectItems) ? scrollieData.projectItems[0] : scrollieData.projectItems;
          const sceneString = Array.isArray(scrollieData.scenes) ? scrollieData.scenes[0] : scrollieData.scenes;
          const projectItems = JSON.parse(projectItemsString).data;
          this.projectSize = 0;
          for (const projectItem of projectItems) {
            this.projectSize += projectItem.fileSize;
          }
          const fontFamilies = projectItems.filter((item) => item.type === ProjectItemAssetType.FontFamily);
          const audioSources = projectItems.filter((item) => item.type === ProjectItemAssetType.AudioSource);
          const images = projectItems.filter((item) => item.type === ProjectItemAssetType.Image);
          const reels = projectItems.filter((item) => item.type === ProjectItemAssetType.Reel);
          const scenes = JSON.parse(sceneString).data;
          await Promise.all([
            this.handleLoadImages(images),
            this.handleLoadFontFamilies(fontFamilies),
            this.handleLoadAudioSources(audioSources)
          ]);
          console.log("loaded assets successfully");
          await this.handleLoadScene(scenes[0]);
          await this.handleLoadReels(reels);
          break;
        }
        retryCount++;
        if (retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      } catch (error) {
        retryCount++;
        if (retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          throw new Error(`Failed to load scene data after ${maxRetries} attempts: ${error.message}`);
        }
      }
    }
  }
  updateLoadingProgress(progress) {
    this.loadedProjectSize += progress;
    const progressPercentage = this.loadedProjectSize / this.projectSize;
    const message = {
      type: Events.UPDATE_LOADING_PROGRESS ? Events.UPDATE_LOADING_PROGRESS : "UPDATE_LOADING_PROGRESS",
      payload: { progress: progressPercentage }
    };
    window.postMessage(message, "*");
    window.parent.postMessage(message, "*");
  }
  async handleLoadScene(targetScene) {
    const sceneData = targetScene ? deepClone(targetScene) : window.ScrollCinemaData.scenes[0];
    this.content.clearContent();
    this.clearStage();
    await this.content.initializeScene(sceneData);
  }
  async handleLoadReels(targetReels) {
    const reelsData = targetReels ? targetReels : window.ScrollCinemaData.reels;
    await Promise.all(reelsData.map(async (targetReel) => {
      if (targetReel) {
        const reel = await RuntimeReel.create(this, targetReel);
        this.reels[reel.id] = reel;
      }
    }));
    if (this.isEditMode) {
      const unselectedReels = Object.keys(this.reels).filter((reelId) => !reelsData.find((reel) => reel.id === reelId));
      const previousSequenceIds = [];
      let currentSequenceIds = [];
      Object.keys(this.reels).forEach((reelId) => {
        const reel = this.reels[reelId];
        previousSequenceIds.push(...Object.keys(reel.sequences));
      });
      reelsData.forEach((reel) => {
        const sequences = reel.sequences;
        currentSequenceIds = [...currentSequenceIds, ...sequences.map((sequence) => sequence.id)];
      });
      const unselectedSequences = previousSequenceIds.filter((sequenceId) => !currentSequenceIds.includes(sequenceId));
      unselectedReels.forEach((reelId) => {
        delete this.reels[reelId];
      });
      unselectedSequences.forEach((sequenceId) => {
        this.selectedSequences = this.selectedSequences.filter((sequence) => sequence.id !== sequenceId);
      });
    }
  }
  async handleLoadAudioSources(targetAudioSources) {
    const audioSourceData = targetAudioSources ? targetAudioSources : window.ScrollCinemaData.audioSources;
    await Promise.all(audioSourceData.map(
      async (targetAudioSource) => this.handleLoadAudioSource(targetAudioSource)
    ));
    if (this.isEditMode) {
      const unselectedAudioSources = this.audioSources.filter((audioSource) => !audioSourceData.find((audioSourceData2) => audioSource.id === audioSourceData2.id));
      if (unselectedAudioSources.length > 0) {
        unselectedAudioSources.forEach((audioSource) => {
          this.audioSources = this.audioSources.filter((a) => a.id !== audioSource.id);
          Yr.unload(audioSource.id);
        });
        return { removedAssets: true };
      }
    }
  }
  async handleLoadAudioSource(targetAudioSource) {
    const audioSourceCopy = deepClone(targetAudioSource);
    const audioSource = await RuntimeAudioSource.create(audioSourceCopy);
    this.audioSources.push(audioSource);
    this.updateLoadingProgress(audioSource.fileSize);
  }
  async handleLoadImages(targetImageAssets) {
    const imageAssetData = targetImageAssets ? targetImageAssets : window.ScrollCinemaData.imageAssets;
    await Promise.all(imageAssetData.map(
      async (targetImageAsset) => this.handleLoadImage(targetImageAsset)
    ));
    if (this.isEditMode) {
      const unselectedImageAssets = this.imageAssets.filter((image) => !imageAssetData.find((imageData) => image.id === imageData.id));
      if (unselectedImageAssets.length > 0) {
        unselectedImageAssets.forEach((image) => {
          this.imageAssets = this.imageAssets.filter((i) => i.id !== image.id);
          Yr.unload(image.id);
        });
        return { removedAssets: true };
      }
    }
  }
  async handleLoadImage(targetImage) {
    const imageSourceCopy = deepClone(targetImage);
    const image = await RuntimeImageAsset.create(imageSourceCopy);
    this.imageAssets.push(image);
    this.updateLoadingProgress(image.fileSize);
  }
  async handleLoadFontFamilies(targetFontFamilies) {
    const fontFamilyData = targetFontFamilies ? targetFontFamilies : window.ScrollCinemaData.fontFamilies;
    await Promise.all(fontFamilyData.map(
      async (targetFontFamily) => this.handleLoadFontFamily(targetFontFamily)
    ));
    if (this.isEditMode) {
      const unselectedFontFamilies = this.fontFamilies.filter((family) => !fontFamilyData.find((familyData) => family.id === familyData.id));
      if (unselectedFontFamilies.length > 0) {
        unselectedFontFamilies.forEach((fontFamily) => {
          this.fontFamilies = this.fontFamilies.filter((f2) => f2.id !== fontFamily.id);
          Yr.unload(fontFamily.id);
        });
        return { removedAssets: true };
      }
    }
  }
  async handleLoadFontFamily(targetFontFamily) {
    const fontFamilySourceCopy = deepClone(targetFontFamily);
    const fontFamily = await RuntimeFontFamily.create(fontFamilySourceCopy);
    this.fontFamilies.push(fontFamily);
    this.updateLoadingProgress(fontFamily.fileSize);
  }
  setEditorMode(editorMode) {
    this.editorMode = editorMode;
  }
  // Whenever a selection changes, we need to update the selected nodes
  // and create the appropriate editor widgets.
  // 
  // To ensure the editor widgets work properly, we also need to 1.) remove
  // selection handlers on nodes that are now selected, and 2.) create new
  // selection handlers for all nodes that are not or no longer selected.
  initializeSelection(newSelectedNodes) {
    this.selectedNodes = [];
    newSelectedNodes.forEach((node) => {
      const runtimeNode = this.runtimeNodes.find((n) => n.id === node.id);
      if (runtimeNode) {
        if (this.selectionHandlers.has(runtimeNode.id)) {
          runtimeNode.stageElement.off("pointerdown", this.selectionHandlers.get(runtimeNode.id));
          this.selectionHandlers.delete(runtimeNode.id);
        }
        this.selectedNodes.push(runtimeNode);
      }
    });
    const unselectedNodes = this.runtimeNodes.filter((node) => {
      return !this.selectedNodes.find((n) => n.id === node.id);
    });
    unselectedNodes.forEach((node) => {
      if (this.selectionHandlers.has(node.id)) {
        node.stageElement.off("pointerdown", this.selectionHandlers.get(node.id));
        this.selectionHandlers.delete(node.id);
      }
      const parentNodes = getParentNodes([node], this.runtimeNodes);
      if (!parentNodes.some((p) => this.selectedNodes.find((n) => n.id === p.id)) && node.type !== ContentType.Group) {
        this.createSelectionHandler(node);
      }
    });
    this.editorWidgets.createSelectedNodeWidgets();
    if (this.selectionEvent) {
      const latestSelectedNode = this.selectedNodes[this.selectedNodes.length - 1];
      if (latestSelectedNode) {
        latestSelectedNode.stageElement.emit("pointerdown", this.selectionEvent, {
          isEmulated: true
        });
      }
      this.selectionEvent = null;
    }
    if (this.isEditMode) {
      let syncNodes = this.selectedNodes.map((node) => {
        return { id: node.id, name: node.name, properties: node.runtimeProperties };
      });
      const message = { type: Events.SEND_NODE_VALUES_TO_EDITOR, payload: { selectedNodes: syncNodes } };
      window.parent.postMessage(message, "*");
    }
  }
  // Refresh the editor widgets, used if the selected nodes change
  // such as when they're being animated via the timeline in the editor.
  refreshSelectedNodeWidgets() {
    this.editorWidgets.refreshSelectedNodeWidgets();
  }
  setProvisionalClip(provisionalClip) {
    this.provisionalClip = provisionalClip;
  }
  setBodyHeight() {
  }
  // Set the sequence time to a specific time and evaluate the sequence.
  // Used when scrubbing through the sequences in the editor or through the player scrubber
  setSequenceTimeAndEvaluate(targetSequence, time) {
    Object.keys(this.reels).forEach((reelId) => {
      const reel = this.reels[reelId];
      Object.keys(reel.sequences).forEach((sequenceId) => {
        const sequence = reel.sequences[sequenceId];
        if (sequence.id === targetSequence) {
          reel.setSequenceTimeAndEvaluate(sequence, time);
        }
      });
    });
    if (this.isEditMode) {
      let syncNodes = this.selectedNodes.map((node) => {
        return { id: node.id, name: node.name, properties: node.runtimeProperties };
      });
      const message = { type: Events.SEND_NODE_VALUES_TO_EDITOR, payload: { selectedNodes: syncNodes } };
      window.parent.postMessage(message, "*");
    }
  }
  // The main playback loop
  playbackLoop() {
    this.currentMasterTime = performance.now() / 1e3;
    this.deltaTime = this.currentMasterTime - this.previousMasterTime;
    this.pointerMonitor.update();
    this.autoplayer.update();
    Object.keys(this.reels).forEach((reelId) => {
      this.reels[reelId].update();
    });
    this.previousMasterTime = this.currentMasterTime;
  }
  appendStageElement(element, parent) {
    if (!parent) {
      this.renderingEngine.stage.addChild(element);
    } else {
      parent.stageElement.addChild(element);
    }
  }
  getNormalizedWidth(width) {
    return this.layout.getNormalizedWidth(width);
  }
  getNormalizedHeight(height) {
    return this.layout.getNormalizedHeight(height);
  }
  getNormalizedPosition(position, parentElement) {
    return this.layout.getNormalizedPosition(position, parentElement);
  }
  getEditorPosition(normalizedPosition, parentElement) {
    return this.layout.getEditorPosition(normalizedPosition, parentElement);
  }
  setPlayerSize(sourceWindowHeight) {
    this.layout.setLayoutSize(sourceWindowHeight);
    this.renderingEngine.resize();
  }
  async resizePlayerFromRuntime(sourceWindowHeight) {
    this.setPlayerSize(sourceWindowHeight);
    await this.loadDataFromGlobal();
    this.renderingEngine.resize();
    this.autoplayer.configureData();
  }
  async resetPlayerFromEditor(payload) {
    const { previewWindowHeight, scene, reels, fontFamilies, audioSources, images } = payload;
    this.layout.setLayoutSize(previewWindowHeight);
    const loadPromises = [];
    if (images) loadPromises.push(this.handleLoadImages(images));
    if (fontFamilies) loadPromises.push(this.handleLoadFontFamilies(fontFamilies));
    if (audioSources) loadPromises.push(this.handleLoadAudioSources(audioSources));
    if (loadPromises.length > 0) {
      let removedAssets = false;
      const results = await Promise.all(loadPromises);
      if (results.some((result) => result == null ? void 0 : result.removedAssets)) {
        removedAssets = true;
      }
      if (removedAssets) {
        await this.handleLoadScene({ nodes: this.content.sourceNodes });
      }
    }
    if (scene) {
      await this.handleLoadScene(scene);
      Object.values(this.reels).forEach((reel) => {
        reel.callRelinkNodes();
      });
      if (!reels && this.selectedSequences.length > 0) {
        Object.values(this.reels).forEach((reel) => {
          reel.refreshSequences(this.selectedSequences);
        });
      }
    }
    if (reels) {
      await this.handleLoadReels(reels);
    }
    this.renderingEngine.resize();
    this.autoplayer.configureData();
    this.initializeSelection(this.selectedNodes);
    this.initializeSelectionHandlers();
  }
  getStageWidth() {
    return this.renderingEngine.screen.width;
  }
  getStageHeight() {
    return this.renderingEngine.screen.height;
  }
  clearStage() {
    this.renderingEngine.stage.removeChildren();
  }
  // Start previewing a sequence in the editor. 
  callStartPreview(timelineWindowId, sequenceId) {
    this.previewingSequences.push({
      sequenceId,
      timelineWindowId
    });
  }
  // Stop previewing a sequence in the editor
  callStopPreview(sequenceId) {
    this.previewingSequences = this.previewingSequences.filter((sequence) => sequence.sequenceId !== sequenceId);
  }
  // When the player is first initialized, let's create selection handlers
  // to allow users to select nodes via the preview window. This should only
  // be called when the we're in the editor and using manipulation mode.
  initializeSelectionHandlers() {
    this.runtimeNodes.forEach((node) => {
      if (node.type !== ContentType.Group) {
        this.createSelectionHandler(node);
      }
    });
  }
  // Create a selection handler for a node. We use this to allow users
  // to select nodes via the preview window.
  createSelectionHandler(node) {
    node.stageElement.eventMode = "static";
    node.stageElement.cursor = "pointer";
    const handler = (e) => {
      this.selectionEvent = e;
      const { metaKey, shiftKey } = e;
      const message = {
        type: Events.SEND_SELECTED_NODE_TO_EDITOR,
        payload: {
          nodeId: node.id,
          metaKey,
          shiftKey
        }
      };
      window.parent.postMessage(message, "*");
    };
    this.selectionHandlers.set(node.id, handler);
    node.stageElement.on("pointerdown", handler);
    return handler;
  }
  hasSelectionHandler(nodeId) {
    return this.selectionHandlers.has(nodeId);
  }
  setSelectedSequence(sequenceId, selectionType) {
    if (selectionType === SelectionType.Select) {
      Object.values(this.reels).forEach((reel) => {
        const sequence = reel.sequences[sequenceId];
        if (sequence) {
          this.selectedSequences = [
            ...this.selectedSequences,
            sequence
          ];
        }
      });
    } else {
      this.selectedSequences = this.selectedSequences.filter((sequence) => sequence.id !== sequenceId);
    }
  }
  playAudioSources() {
    this.audioSources.forEach((audioSource) => {
      if (audioSource.playOnStart) {
        audioSource.sound.play();
      }
    });
  }
}
(async () => {
  console.log("window.ScrollCinemaData", window.ScrollCinemaData);
  if (!window.ScrollCinemaData) {
    window.ScrollCinemaData = {};
  }
  window.ScrollCinemaData.player = null;
  window.ScrollCinemaData.isEditMode = false;
  let hasAudio = false;
  let audioEnabled = false;
  let soundControllerContainer;
  window.addEventListener("message", handleEditorMessage);
  async function loadPlayer(contentHeight, playerContainerSelector) {
    const scrollCinemaContainer = document.querySelector(".scroll-cinema-container");
    initSoundControls();
    window.ScrollCinemaData.player = await Player.create(scrollCinemaContainer, contentHeight, playerContainerSelector);
  }
  document.addEventListener("DOMContentLoaded", () => {
    const searchParams = new URLSearchParams(window.location.search);
    window.ScrollCinemaData.isEditMode = searchParams.get("edit_mode") === "true";
  });
  function initSoundControls() {
    soundControllerContainer = document.getElementById("sound-controller-container");
    const soundController = document.getElementById("sound-controller");
    if (!window.ScrollCinemaData.isEditMode && soundControllerContainer && soundController) {
      let toggleAudio = function() {
        audioEnabled = !audioEnabled;
        if (soundController) {
          soundController.setAttribute("aria-checked", audioEnabled.toString());
          soundController.setAttribute("aria-label", audioEnabled ? "Turn audio off" : "Turn audio on");
          if (audioEnabled) {
            soundController.classList.add("audio-enabled");
          } else {
            soundController.classList.remove("audio-enabled");
          }
        }
        window.postMessage({
          type: "TOGGLE_AUDIO",
          payload: {
            audioEnabled
          }
        }, "*");
      };
      const hasFullscreen = document.fullscreenEnabled || document.webkitFullscreenEnabled;
      if (hasFullscreen) {
        soundController.setAttribute("tabindex", "0");
      }
      soundControllerContainer.addEventListener("pointerdown", () => {
        if (hasAudio) {
          soundControllerContainer.classList.add("fadeIn");
          soundControllerContainer.classList.remove("fadeOut");
        }
      });
      soundControllerContainer.addEventListener("mouseenter", () => {
        if (hasAudio) {
          soundControllerContainer.classList.add("fadeIn");
          soundControllerContainer.classList.remove("fadeOut");
        }
      });
      soundController.addEventListener("pointerdown", (e) => {
        console.log("soundController clicked");
        if (!soundControllerContainer.classList.contains("fadeIn")) {
          return;
        }
        toggleAudio();
      });
      soundController.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          toggleAudio();
        }
      });
      soundController.addEventListener("focus", () => {
        if (hasAudio) {
          soundControllerContainer.classList.add("fadeIn");
          soundControllerContainer.classList.remove("fadeOut");
        }
      });
      soundController.addEventListener("blur", () => {
        setTimeout(() => {
          if (!soundControllerContainer.matches(":hover") && !soundController.matches(":focus")) {
            soundControllerContainer.classList.remove("fadeIn");
            soundControllerContainer.classList.add("fadeOut");
          }
        }, 100);
      });
    }
  }
  async function handleEditorMessage(event) {
    const eventData = event.data;
    const player = window.ScrollCinemaData.player;
    if (eventData.type === Events.UPDATE_LOADING_PROGRESS || eventData.type === "UPDATE_LOADING_PROGRESS") {
      const { progress } = eventData.payload;
      const progressBar = document.getElementById("progress-bar");
      if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
      }
    }
    if (eventData.type === Events.PLAYER_READY || eventData.type === "PLAYER_READY") {
      const loadingOverlay = document.getElementById("loading-overlay");
      if (loadingOverlay) {
        loadingOverlay.classList.add("hidden");
        setTimeout(() => {
          loadingOverlay.remove();
        }, 300);
      }
      hasAudio = event.data.payload.hasAudio;
      if (hasAudio && soundControllerContainer) {
        soundControllerContainer.style.display = "block";
        soundControllerContainer.classList.add("fadeIn");
      }
    }
    if (eventData.type === Events.PLAYER_POINTER_DOWN || eventData.type === Events.PLAYER_WHEEL || eventData.type === "PLAYER_POINTER_DOWN" || eventData.type === "PLAYER_WHEEL") {
      if (hasAudio && soundControllerContainer !== null) {
        soundControllerContainer.classList.remove("fadeIn");
        soundControllerContainer.classList.add("fadeOut");
      }
    }
    if (eventData.type === Events.LOAD_PLAYER || eventData.type === "LOAD_PLAYER") {
      const { contentHeight, playerContainerSelector } = eventData.payload;
      await loadPlayer(contentHeight, playerContainerSelector);
    }
    if (eventData.type === Events.LOAD_PLAYER_IN_EDITOR) {
      const loadingOverlay = document.getElementById("loading-overlay");
      loadingOverlay == null ? void 0 : loadingOverlay.remove();
      await loadPlayer(eventData.payload.contentHeight);
    }
    if (eventData.type === Events.SET_EDITOR_STYLES) {
      const styleElement = document.createElement("link");
      styleElement.rel = "stylesheet";
      styleElement.href = "./editor-style.css";
      document.head.appendChild(styleElement);
    }
    if (eventData.type === Events.RESET_PLAYER_FROM_EDITOR) {
      debounce(player == null ? void 0 : player.resetPlayerFromEditor(eventData.payload));
    }
    if (eventData.type === Events.SET_ELAPSED_TIME) {
      const { sequenceId, currentTime } = eventData.payload;
      debounce(() => {
        player == null ? void 0 : player.setSequenceTimeAndEvaluate(sequenceId, currentTime);
        player == null ? void 0 : player.refreshSelectedNodeWidgets();
      })();
    }
    if (eventData.type === Events.START_PREVIEW_SEQUENCE) {
      const { sequenceId, timelineWindowId } = eventData.payload;
      player == null ? void 0 : player.callStartPreview(timelineWindowId, sequenceId);
    }
    if (eventData.type === Events.STOP_PREVIEW_SEQUENCE) {
      const { sequenceId } = eventData.payload;
      player == null ? void 0 : player.callStopPreview(sequenceId);
    }
    if (eventData.type === Events.SET_EDITOR_MODE) {
      const { editorMode } = eventData.payload;
      player == null ? void 0 : player.setEditorMode(editorMode);
    }
    if (eventData.type === Events.SEND_SELECTED_NODES_TO_PLAYER) {
      const { selectedNodes } = eventData.payload;
      player == null ? void 0 : player.initializeSelection(selectedNodes);
    }
    if (eventData.type === Events.SET_PROVISIONAL_CLIP) {
      const { provisionalClip } = eventData.payload;
      player == null ? void 0 : player.setProvisionalClip(provisionalClip);
    }
    if (eventData.type === Events.SEND_SELECTED_SEQUENCE_ID_TO_PLAYER) {
      const { sequenceId, selectionType } = eventData.payload;
      player == null ? void 0 : player.setSelectedSequence(sequenceId, selectionType);
    }
  }
})();
//# sourceMappingURL=player.js.map
