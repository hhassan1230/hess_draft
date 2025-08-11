const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./browserAll.js","./webworkerAll.js"])))=>i.map(i=>d[i]);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var EditorMode = /* @__PURE__ */ ((EditorMode2) => {
  EditorMode2["Preview"] = "Preview";
  EditorMode2["Manipulation"] = "Manipulation";
  return EditorMode2;
})(EditorMode || {});
var DropType = /* @__PURE__ */ ((DropType2) => {
  DropType2["DropOnNode"] = "DropOnNode";
  DropType2["DropBetweenNodes"] = "DropBetweenNodes";
  return DropType2;
})(DropType || {});
var TrackAssetPropertyType = /* @__PURE__ */ ((TrackAssetPropertyType2) => {
  TrackAssetPropertyType2["Vector2"] = "Vector2";
  TrackAssetPropertyType2["Number"] = "Number";
  TrackAssetPropertyType2["Color"] = "Color";
  return TrackAssetPropertyType2;
})(TrackAssetPropertyType || {});
var ClipPropertyEvaluationType = /* @__PURE__ */ ((ClipPropertyEvaluationType2) => {
  ClipPropertyEvaluationType2["Initial"] = "Initial";
  ClipPropertyEvaluationType2["Target"] = "Target";
  return ClipPropertyEvaluationType2;
})(ClipPropertyEvaluationType || {});
var ClipFunctionType = /* @__PURE__ */ ((ClipFunctionType2) => {
  ClipFunctionType2["Default"] = "Default";
  ClipFunctionType2["FadePlay"] = "FadePlay";
  ClipFunctionType2["Volume"] = "Volume";
  return ClipFunctionType2;
})(ClipFunctionType || {});
var TriggerType = /* @__PURE__ */ ((TriggerType2) => {
  TriggerType2["PlayAudio"] = "PlayAudio";
  return TriggerType2;
})(TriggerType || {});
var TimelineTriggerActivationType = /* @__PURE__ */ ((TimelineTriggerActivationType2) => {
  TimelineTriggerActivationType2["ActivateOnForward"] = "activateOnForward";
  TimelineTriggerActivationType2["ActivateOnReverse"] = "activateOnReverse";
  return TimelineTriggerActivationType2;
})(TimelineTriggerActivationType || {});
var TrackFunctionType = /* @__PURE__ */ ((TrackFunctionType2) => {
  TrackFunctionType2["Position"] = "Position";
  TrackFunctionType2["Scale"] = "Scale";
  TrackFunctionType2["Opacity"] = "Opacity";
  TrackFunctionType2["Group"] = "Group";
  TrackFunctionType2["AmbientAudio"] = "AmbientAudio";
  TrackFunctionType2["SyncedAudio"] = "SyncedAudio";
  TrackFunctionType2["Rotation"] = "Rotation";
  TrackFunctionType2["FontSize"] = "FontSize";
  TrackFunctionType2["LetterSpacing"] = "LetterSpacing";
  TrackFunctionType2["AudioTrigger"] = "AudioTrigger";
  TrackFunctionType2["Color"] = "Color";
  return TrackFunctionType2;
})(TrackFunctionType || {});
var TrackEvaluationMethodType = /* @__PURE__ */ ((TrackEvaluationMethodType2) => {
  TrackEvaluationMethodType2["Clips"] = "Clips";
  TrackEvaluationMethodType2["Keyframes"] = "Keyframes";
  TrackEvaluationMethodType2["Trigger"] = "Trigger";
  return TrackEvaluationMethodType2;
})(TrackEvaluationMethodType || {});
var ContentType = /* @__PURE__ */ ((ContentType2) => {
  ContentType2["Text"] = "Text";
  ContentType2["Image"] = "Image";
  ContentType2["Video"] = "Video";
  ContentType2["Audio"] = "Audio";
  ContentType2["Group"] = "Group";
  ContentType2["Graphic"] = "Graphic";
  return ContentType2;
})(ContentType || {});
var GraphicType = /* @__PURE__ */ ((GraphicType2) => {
  GraphicType2["Rectangle"] = "Rectangle";
  GraphicType2["Polygon"] = "Polygon";
  GraphicType2["Circle"] = "Circle";
  GraphicType2["RoundedPolygon"] = "RoundedPolygon";
  GraphicType2["Star"] = "Star";
  return GraphicType2;
})(GraphicType || {});
const NodePropertyKey = {
  Position: "position",
  Scale: "scale",
  Rotation: "rotation",
  ImageId: "imageId",
  Content: "content",
  FontSize: "fontSize",
  Opacity: "opacity",
  Width: "width",
  Height: "height",
  ZIndex: "zIndex",
  Color: "color",
  FontFamily: "fontFamily",
  LetterSpacing: "letterSpacing",
  Align: "align",
  WordWrap: "wordWrap",
  WordWrapWidth: "wordWrapWidth",
  LineHeight: "lineHeight",
  Sides: "sides",
  CornerRadius: "cornerRadius",
  Points: "points",
  InnerRadius: "innerRadius",
  Pivot: "pivot"
};
const TimelineTriggerPropertyKey = {
  Time: "time",
  Type: "type",
  IsTriggered: "isTriggered",
  [
    "activateOnForward"
    /* ActivateOnForward */
  ]: "activateOnForward",
  [
    "activateOnReverse"
    /* ActivateOnReverse */
  ]: "activateOnReverse"
  /* ActivateOnReverse */
};
var SelectionType = /* @__PURE__ */ ((SelectionType2) => {
  SelectionType2["Select"] = "Select";
  SelectionType2["Deselect"] = "Deselect";
  return SelectionType2;
})(SelectionType || {});
var AutorunEvaluationType = /* @__PURE__ */ ((AutorunEvaluationType2) => {
  AutorunEvaluationType2["Start"] = "Start";
  AutorunEvaluationType2["Pause"] = "Pause";
  AutorunEvaluationType2["Stop"] = "Stop";
  return AutorunEvaluationType2;
})(AutorunEvaluationType || {});
var ProjectItemAssetType = /* @__PURE__ */ ((ProjectItemAssetType2) => {
  ProjectItemAssetType2["Scene"] = "Scene";
  ProjectItemAssetType2["AudioSource"] = "AudioSource";
  ProjectItemAssetType2["Reel"] = "Reel";
  ProjectItemAssetType2["FontFamily"] = "FontFamily";
  ProjectItemAssetType2["Image"] = "Image";
  ProjectItemAssetType2["Folder"] = "Folder";
  return ProjectItemAssetType2;
})(ProjectItemAssetType || {});
var DragEvents = /* @__PURE__ */ ((DragEvents2) => {
  DragEvents2["Tab"] = "Tab";
  DragEvents2["NodeHierarchy"] = "NodeHierarchy";
  DragEvents2["TrackLabels"] = "TrackLabels";
  DragEvents2["ProjectHierarchy"] = "ProjectHierarchy";
  return DragEvents2;
})(DragEvents || {});
var UndoMessage = /* @__PURE__ */ ((UndoMessage2) => {
  UndoMessage2["CreateNode"] = "Create node:";
  UndoMessage2["DeleteNodes"] = "Delete nodes";
  UndoMessage2["SelectNodes"] = "Select nodes";
  UndoMessage2["ResetNodeSelection"] = "Reset node selection";
  UndoMessage2["DuplicateNodes"] = "Duplicate nodes";
  UndoMessage2["MoveNodes"] = "Move nodes";
  UndoMessage2["RenameNodes"] = "Rename nodes";
  UndoMessage2["PasteNodes"] = "Paste nodes";
  UndoMessage2["RenameNode"] = "Rename node";
  UndoMessage2["UpdateNodeProperty"] = "Update property";
  UndoMessage2["RecordNodePropertyToSequence"] = "Record property to sequence";
  UndoMessage2["RenameProjectItem"] = "Rename project item";
  UndoMessage2["CreateGroupTrack"] = "Create group track";
  UndoMessage2["CreateNodeTracks"] = "Create node tracks";
  UndoMessage2["CreateProjectTracks"] = "Create project item tracks";
  UndoMessage2["MoveTracks"] = "Move tracks";
  UndoMessage2["SelectTracks"] = "Select tracks";
  UndoMessage2["SelectClips"] = "Select clips";
  UndoMessage2["SelectKeyframes"] = "Select keyframes";
  UndoMessage2["ModifyTimelineAssets"] = "Modify timeline assets";
  UndoMessage2["DeleteTimelineAsset"] = "Delete timeline asset";
  UndoMessage2["ResetTimelineSelection"] = "Reset timeline selection";
  UndoMessage2["UpdateTrackName"] = "Update track name";
  UndoMessage2["AddClip"] = "Add clip";
  UndoMessage2["AddAutorunMarker"] = "Add autorun marker";
  UndoMessage2["SelectAutorunMarkers"] = "Select autorun markers";
  UndoMessage2["SelectProjectItems"] = "Select project items";
  UndoMessage2["SelectTimelineTriggers"] = "Select timeline triggers";
  UndoMessage2["MarqueeSelection"] = "Marquee Selection";
  return UndoMessage2;
})(UndoMessage || {});
var TextAlignType = /* @__PURE__ */ ((TextAlignType2) => {
  TextAlignType2["Left"] = "left";
  TextAlignType2["Center"] = "center";
  TextAlignType2["Right"] = "right";
  TextAlignType2["Justify"] = "justify";
  return TextAlignType2;
})(TextAlignType || {});
var ItemRequestStatus = /* @__PURE__ */ ((ItemRequestStatus2) => {
  ItemRequestStatus2["Uploading"] = "Uploading";
  ItemRequestStatus2["Deleting"] = "Deleting";
  ItemRequestStatus2["Success"] = "Success";
  ItemRequestStatus2["Error"] = "Error";
  return ItemRequestStatus2;
})(ItemRequestStatus || {});
const LOCAL_STORAGE_KEY = "scrollcinema_editor_data";
function debounce(func, wait = 20, immediate = true) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
function approximatelyEqual(a2, b2) {
  return Math.abs(a2 - b2) < Number.EPSILON;
}
function deepClone(obj, hash = /* @__PURE__ */ new WeakMap()) {
  if (Object(obj) !== obj) return obj;
  if (hash.has(obj)) return hash.get(obj);
  const result = Array.isArray(obj) ? [] : {};
  hash.set(obj, result);
  Object.keys(obj).forEach((key) => {
    result[key] = deepClone(obj[key], hash);
  });
  return result;
}
const buildHierarchy = (items) => {
  const itemMap = /* @__PURE__ */ new Map();
  const rootItems = [];
  items.forEach((node) => {
    itemMap.set(node.id, { ...node, children: [] });
  });
  items.forEach((node) => {
    if (node.children) {
      node.children.forEach((childId) => {
        var _a;
        const childNode = itemMap.get(childId);
        if (childNode) {
          (_a = itemMap.get(node.id)) == null ? void 0 : _a.children.push(childNode);
        }
      });
    }
  });
  itemMap.forEach((node) => {
    if (!items.some((n2) => {
      var _a;
      return (_a = n2.children) == null ? void 0 : _a.includes(node.id);
    })) {
      rootItems.push(node);
    }
  });
  return rootItems;
};
const getParentNodes = (targetNodes, allNodes) => {
  const parentNodesSet = /* @__PURE__ */ new Set();
  const addParentNodes = (node) => {
    if (node.parentId) {
      const parentNode = allNodes.find((n2) => n2.id === node.parentId);
      if (parentNode) {
        parentNodesSet.add(parentNode);
        addParentNodes(parentNode);
      }
    }
  };
  targetNodes.forEach((node) => {
    addParentNodes(node);
  });
  return Array.from(parentNodesSet);
};
const getFillColor = (targetColor, targetOpacity) => {
  const color = targetColor || "#BF3EFF";
  const opacity = targetOpacity ?? 1;
  const r2 = parseInt(color.slice(1, 3), 16);
  const g2 = parseInt(color.slice(3, 5), 16);
  const b2 = parseInt(color.slice(5, 7), 16);
  return `rgba(${r2}, ${g2}, ${b2}, ${opacity})`;
};
function interpolateColor(color1, color2, progress) {
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  const rgbToHex = (r2, g2, b2) => {
    const toHex = (c2) => {
      const hex = Math.round(c2).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
  };
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const interpolatedR = rgb1.r + (rgb2.r - rgb1.r) * progress;
  const interpolatedG = rgb1.g + (rgb2.g - rgb1.g) * progress;
  const interpolatedB = rgb1.b + (rgb2.b - rgb1.b) * progress;
  return rgbToHex(interpolatedR, interpolatedG, interpolatedB);
}
var Events = /* @__PURE__ */ ((Events2) => {
  Events2["LOAD_PLAYER"] = "LOAD_PLAYER";
  Events2["LOAD_PLAYER_IN_EDITOR"] = "LOAD_PLAYER_IN_EDITOR";
  Events2["SET_EDITOR_STYLES"] = "SET_EDITOR_STYLES";
  Events2["RESET_PLAYER_FROM_EDITOR"] = "RESET_PLAYER_FROM_EDITOR";
  Events2["LOAD_AUDIO_SOURCES"] = "LOAD_AUDIO_SOURCES";
  Events2["LOAD_FONT_FAMILIES"] = "LOAD_FONT_FAMILIES";
  Events2["SET_ELAPSED_TIME"] = "SET_ELAPSED_TIME";
  Events2["START_PREVIEW_SEQUENCE"] = "START_PREVIEW_SEQUENCE";
  Events2["STOP_PREVIEW_SEQUENCE"] = "STOP_PREVIEW_SEQUENCE";
  Events2["SET_EDITOR_MODE"] = "SET_EDITOR_MODE";
  Events2["SEND_SELECTED_SEQUENCE_ID_TO_PLAYER"] = "SEND_SELECTED_SEQUENCE_ID_TO_PLAYER";
  Events2["SEND_SELECTED_NODES_TO_PLAYER"] = "SEND_SELECTED_NODES_TO_PLAYER";
  Events2["SEND_SELECTED_NODE_TO_EDITOR"] = "SEND_SELECTED_NODE_TO_EDITOR";
  Events2["SEND_DUPLICATE_REQUEST_TO_EDITOR"] = "SEND_DUPLICATE_REQUEST_TO_EDITOR";
  Events2["SET_PROVISIONAL_CLIP"] = "SET_PROVISIONAL_CLIP";
  Events2["SEND_MODIFIED_NODES_TO_EDITOR"] = "SEND_MODIFIED_NODES_TO_EDITOR";
  Events2["UPDATE_LOADING_PROGRESS"] = "UPDATE_LOADING_PROGRESS";
  Events2["PLAYER_READY"] = "PLAYER_READY";
  Events2["TOGGLE_AUDIO"] = "TOGGLE_AUDIO";
  Events2["PLAYER_POINTER_DOWN"] = "PLAYER_POINTER_DOWN";
  Events2["PLAYER_WHEEL"] = "PLAYER_WHEEL";
  Events2["EDITOR_SAVE"] = "EDITOR_SAVE";
  Events2["SEND_NODE_VALUES_TO_EDITOR"] = "SEND_NODE_VALUES_TO_EDITOR";
  Events2["SYNC_EDITOR_TIMELINE_FROM_PLAYER"] = "SYNC_EDITOR_TIMELINE_FROM_PLAYER";
  Events2["SEND_KEYBOARD_EVENT_TO_EDITOR"] = "SEND_KEYBOARD_EVENT_TO_EDITOR";
  return Events2;
})(Events || {});
const scriptRel = "modulepreload";
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise2 = Promise.resolve();
  if (deps && deps.length > 0) {
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
    promise2 = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep, importerUrl);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        const isBaseRelative = !!importerUrl;
        if (isBaseRelative) {
          for (let i2 = links.length - 1; i2 >= 0; i2--) {
            const link2 = links[i2];
            if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
              return;
            }
          }
        } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e2 = new Event("vite:preloadError", {
      cancelable: true
    });
    e2.payload = err;
    window.dispatchEvent(e2);
    if (!e2.defaultPrevented) {
      throw err;
    }
  }
  return promise2.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
var ExtensionType = /* @__PURE__ */ ((ExtensionType2) => {
  ExtensionType2["Application"] = "application";
  ExtensionType2["WebGLPipes"] = "webgl-pipes";
  ExtensionType2["WebGLPipesAdaptor"] = "webgl-pipes-adaptor";
  ExtensionType2["WebGLSystem"] = "webgl-system";
  ExtensionType2["WebGPUPipes"] = "webgpu-pipes";
  ExtensionType2["WebGPUPipesAdaptor"] = "webgpu-pipes-adaptor";
  ExtensionType2["WebGPUSystem"] = "webgpu-system";
  ExtensionType2["CanvasSystem"] = "canvas-system";
  ExtensionType2["CanvasPipesAdaptor"] = "canvas-pipes-adaptor";
  ExtensionType2["CanvasPipes"] = "canvas-pipes";
  ExtensionType2["Asset"] = "asset";
  ExtensionType2["LoadParser"] = "load-parser";
  ExtensionType2["ResolveParser"] = "resolve-parser";
  ExtensionType2["CacheParser"] = "cache-parser";
  ExtensionType2["DetectionParser"] = "detection-parser";
  ExtensionType2["MaskEffect"] = "mask-effect";
  ExtensionType2["BlendMode"] = "blend-mode";
  ExtensionType2["TextureSource"] = "texture-source";
  ExtensionType2["Environment"] = "environment";
  ExtensionType2["ShapeBuilder"] = "shape-builder";
  ExtensionType2["Batcher"] = "batcher";
  return ExtensionType2;
})(ExtensionType || {});
const normalizeExtension = (ext) => {
  if (typeof ext === "function" || typeof ext === "object" && ext.extension) {
    if (!ext.extension) {
      throw new Error("Extension class must have an extension object");
    }
    const metadata = typeof ext.extension !== "object" ? { type: ext.extension } : ext.extension;
    ext = { ...metadata, ref: ext };
  }
  if (typeof ext === "object") {
    ext = { ...ext };
  } else {
    throw new Error("Invalid extension type");
  }
  if (typeof ext.type === "string") {
    ext.type = [ext.type];
  }
  return ext;
};
const normalizeExtensionPriority = (ext, defaultPriority) => normalizeExtension(ext).priority ?? defaultPriority;
const extensions = {
  /** @ignore */
  _addHandlers: {},
  /** @ignore */
  _removeHandlers: {},
  /** @ignore */
  _queue: {},
  /**
   * Remove extensions from PixiJS.
   * @param extensions - Extensions to be removed.
   * @returns {extensions} For chaining.
   */
  remove(...extensions2) {
    extensions2.map(normalizeExtension).forEach((ext) => {
      ext.type.forEach((type) => {
        var _a, _b;
        return (_b = (_a = this._removeHandlers)[type]) == null ? void 0 : _b.call(_a, ext);
      });
    });
    return this;
  },
  /**
   * Register new extensions with PixiJS.
   * @param extensions - The spread of extensions to add to PixiJS.
   * @returns {extensions} For chaining.
   */
  add(...extensions2) {
    extensions2.map(normalizeExtension).forEach((ext) => {
      ext.type.forEach((type) => {
        var _a, _b;
        const handlers = this._addHandlers;
        const queue = this._queue;
        if (!handlers[type]) {
          queue[type] = queue[type] || [];
          (_a = queue[type]) == null ? void 0 : _a.push(ext);
        } else {
          (_b = handlers[type]) == null ? void 0 : _b.call(handlers, ext);
        }
      });
    });
    return this;
  },
  /**
   * Internal method to handle extensions by name.
   * @param type - The extension type.
   * @param onAdd  - Function handler when extensions are added/registered {@link StrictExtensionFormat}.
   * @param onRemove  - Function handler when extensions are removed/unregistered {@link StrictExtensionFormat}.
   * @returns {extensions} For chaining.
   */
  handle(type, onAdd, onRemove) {
    var _a;
    const addHandlers = this._addHandlers;
    const removeHandlers = this._removeHandlers;
    if (addHandlers[type] || removeHandlers[type]) {
      throw new Error(`Extension type ${type} already has a handler`);
    }
    addHandlers[type] = onAdd;
    removeHandlers[type] = onRemove;
    const queue = this._queue;
    if (queue[type]) {
      (_a = queue[type]) == null ? void 0 : _a.forEach((ext) => onAdd(ext));
      delete queue[type];
    }
    return this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns {extensions} For chaining.
   */
  handleByMap(type, map) {
    return this.handle(
      type,
      (extension) => {
        if (extension.name) {
          map[extension.name] = extension.ref;
        }
      },
      (extension) => {
        if (extension.name) {
          delete map[extension.name];
        }
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions with a `name` property.
   * @param type - Type of extension to handle.
   * @param map - The array of named extensions.
   * @param defaultPriority - Fallback priority if none is defined.
   * @returns {extensions} For chaining.
   */
  handleByNamedList(type, map, defaultPriority = -1) {
    return this.handle(
      type,
      (extension) => {
        const index = map.findIndex((item) => item.name === extension.name);
        if (index >= 0)
          return;
        map.push({ name: extension.name, value: extension.ref });
        map.sort((a2, b2) => normalizeExtensionPriority(b2.value, defaultPriority) - normalizeExtensionPriority(a2.value, defaultPriority));
      },
      (extension) => {
        const index = map.findIndex((item) => item.name === extension.name);
        if (index !== -1) {
          map.splice(index, 1);
        }
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @param defaultPriority - The default priority to use if none is specified.
   * @returns {extensions} For chaining.
   */
  handleByList(type, list, defaultPriority = -1) {
    return this.handle(
      type,
      (extension) => {
        if (list.includes(extension.ref)) {
          return;
        }
        list.push(extension.ref);
        list.sort((a2, b2) => normalizeExtensionPriority(b2, defaultPriority) - normalizeExtensionPriority(a2, defaultPriority));
      },
      (extension) => {
        const index = list.indexOf(extension.ref);
        if (index !== -1) {
          list.splice(index, 1);
        }
      }
    );
  },
  /**
   * Mixin the source object into the target object.
   * @param Target - The target object to mix into.
   * @param sources - The source(s) object to mix from
   */
  mixin(Target, ...sources2) {
    for (const source of sources2) {
      Object.defineProperties(Target.prototype, Object.getOwnPropertyDescriptors(source));
    }
  }
};
const browserExt = {
  extension: {
    type: ExtensionType.Environment,
    name: "browser",
    priority: -1
  },
  test: () => true,
  load: async () => {
    await __vitePreload(() => import("./browserAll.js"), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url);
  }
};
const webworkerExt = {
  extension: {
    type: ExtensionType.Environment,
    name: "webworker",
    priority: 0
  },
  test: () => typeof self !== "undefined" && self.WorkerGlobalScope !== void 0,
  load: async () => {
    await __vitePreload(() => import("./webworkerAll.js"), true ? [] : void 0, import.meta.url);
  }
};
class ObservablePoint {
  /**
   * Creates a new `ObservablePoint`
   * @param observer - Observer to pass to listen for change events.
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(observer, x2, y2) {
    this._x = x2 || 0;
    this._y = y2 || 0;
    this._observer = observer;
  }
  /**
   * Creates a clone of this point.
   * @param observer - Optional observer to pass to the new observable point.
   * @returns a copy of this observable point
   */
  clone(observer) {
    return new ObservablePoint(observer ?? this._observer, this._x, this._y);
  }
  /**
   * Sets the point to a new `x` and `y` position.
   * If `y` is omitted, both `x` and `y` will be set to `x`.
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=x] - position of the point on the y axis
   * @returns The observable point instance itself
   */
  set(x2 = 0, y2 = x2) {
    if (this._x !== x2 || this._y !== y2) {
      this._x = x2;
      this._y = y2;
      this._observer._onUpdate(this);
    }
    return this;
  }
  /**
   * Copies x and y from the given point (`p`)
   * @param p - The point to copy from. Can be any of type that is or extends `PointData`
   * @returns The observable point instance itself
   */
  copyFrom(p2) {
    if (this._x !== p2.x || this._y !== p2.y) {
      this._x = p2.x;
      this._y = p2.y;
      this._observer._onUpdate(this);
    }
    return this;
  }
  /**
   * Copies this point's x and y into that of the given point (`p`)
   * @param p - The point to copy to. Can be any of type that is or extends `PointData`
   * @returns The point (`p`) with values updated
   */
  copyTo(p2) {
    p2.set(this._x, this._y);
    return p2;
  }
  /**
   * Accepts another point (`p`) and returns `true` if the given point is equal to this point
   * @param p - The point to check
   * @returns Returns `true` if both `x` and `y` are equal
   */
  equals(p2) {
    return p2.x === this._x && p2.y === this._y;
  }
  toString() {
    return `[pixi.js/math:ObservablePoint x=${0} y=${0} scope=${this._observer}]`;
  }
  /** Position of the observable point on the x axis. */
  get x() {
    return this._x;
  }
  set x(value) {
    if (this._x !== value) {
      this._x = value;
      this._observer._onUpdate(this);
    }
  }
  /** Position of the observable point on the y axis. */
  get y() {
    return this._y;
  }
  set y(value) {
    if (this._y !== value) {
      this._y = value;
      this._observer._onUpdate(this);
    }
  }
}
var eventemitter3 = { exports: {} };
(function(module) {
  var has = Object.prototype.hasOwnProperty, prefix = "~";
  function Events2() {
  }
  if (Object.create) {
    Events2.prototype = /* @__PURE__ */ Object.create(null);
    if (!new Events2().__proto__) prefix = false;
  }
  function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
  }
  function addListener(emitter, event, fn, context, once) {
    if (typeof fn !== "function") {
      throw new TypeError("The listener must be a function");
    }
    var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
    if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
    else emitter._events[evt] = [emitter._events[evt], listener];
    return emitter;
  }
  function clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0) emitter._events = new Events2();
    else delete emitter._events[evt];
  }
  function EventEmitter2() {
    this._events = new Events2();
    this._eventsCount = 0;
  }
  EventEmitter2.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0) return names;
    for (name in events = this._events) {
      if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
    }
    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events));
    }
    return names;
  };
  EventEmitter2.prototype.listeners = function listeners(event) {
    var evt = prefix ? prefix + event : event, handlers = this._events[evt];
    if (!handlers) return [];
    if (handlers.fn) return [handlers.fn];
    for (var i2 = 0, l2 = handlers.length, ee = new Array(l2); i2 < l2; i2++) {
      ee[i2] = handlers[i2].fn;
    }
    return ee;
  };
  EventEmitter2.prototype.listenerCount = function listenerCount(event) {
    var evt = prefix ? prefix + event : event, listeners = this._events[evt];
    if (!listeners) return 0;
    if (listeners.fn) return 1;
    return listeners.length;
  };
  EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return false;
    var listeners = this._events[evt], len = arguments.length, args, i2;
    if (listeners.fn) {
      if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
      switch (len) {
        case 1:
          return listeners.fn.call(listeners.context), true;
        case 2:
          return listeners.fn.call(listeners.context, a1), true;
        case 3:
          return listeners.fn.call(listeners.context, a1, a2), true;
        case 4:
          return listeners.fn.call(listeners.context, a1, a2, a3), true;
        case 5:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
        case 6:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
      }
      for (i2 = 1, args = new Array(len - 1); i2 < len; i2++) {
        args[i2 - 1] = arguments[i2];
      }
      listeners.fn.apply(listeners.context, args);
    } else {
      var length = listeners.length, j2;
      for (i2 = 0; i2 < length; i2++) {
        if (listeners[i2].once) this.removeListener(event, listeners[i2].fn, void 0, true);
        switch (len) {
          case 1:
            listeners[i2].fn.call(listeners[i2].context);
            break;
          case 2:
            listeners[i2].fn.call(listeners[i2].context, a1);
            break;
          case 3:
            listeners[i2].fn.call(listeners[i2].context, a1, a2);
            break;
          case 4:
            listeners[i2].fn.call(listeners[i2].context, a1, a2, a3);
            break;
          default:
            if (!args) for (j2 = 1, args = new Array(len - 1); j2 < len; j2++) {
              args[j2 - 1] = arguments[j2];
            }
            listeners[i2].fn.apply(listeners[i2].context, args);
        }
      }
    }
    return true;
  };
  EventEmitter2.prototype.on = function on(event, fn, context) {
    return addListener(this, event, fn, context, false);
  };
  EventEmitter2.prototype.once = function once(event, fn, context) {
    return addListener(this, event, fn, context, true);
  };
  EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt]) return this;
    if (!fn) {
      clearEvent(this, evt);
      return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
      if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
        clearEvent(this, evt);
      }
    } else {
      for (var i2 = 0, events = [], length = listeners.length; i2 < length; i2++) {
        if (listeners[i2].fn !== fn || once && !listeners[i2].once || context && listeners[i2].context !== context) {
          events.push(listeners[i2]);
        }
      }
      if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
      else clearEvent(this, evt);
    }
    return this;
  };
  EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
      evt = prefix ? prefix + event : event;
      if (this._events[evt]) clearEvent(this, evt);
    } else {
      this._events = new Events2();
      this._eventsCount = 0;
    }
    return this;
  };
  EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
  EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
  EventEmitter2.prefixed = prefix;
  EventEmitter2.EventEmitter = EventEmitter2;
  {
    module.exports = EventEmitter2;
  }
})(eventemitter3);
var eventemitter3Exports = eventemitter3.exports;
const EventEmitter = /* @__PURE__ */ getDefaultExportFromCjs(eventemitter3Exports);
const PI_2 = Math.PI * 2;
const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;
class Point {
  /**
   * Creates a new `Point`
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(x2 = 0, y2 = 0) {
    this.x = 0;
    this.y = 0;
    this.x = x2;
    this.y = y2;
  }
  /**
   * Creates a clone of this point
   * @returns A clone of this point
   */
  clone() {
    return new Point(this.x, this.y);
  }
  /**
   * Copies `x` and `y` from the given point into this point
   * @param p - The point to copy from
   * @returns The point instance itself
   */
  copyFrom(p2) {
    this.set(p2.x, p2.y);
    return this;
  }
  /**
   * Copies this point's x and y into the given point (`p`).
   * @param p - The point to copy to. Can be any of type that is or extends `PointData`
   * @returns The point (`p`) with values updated
   */
  copyTo(p2) {
    p2.set(this.x, this.y);
    return p2;
  }
  /**
   * Accepts another point (`p`) and returns `true` if the given point is equal to this point
   * @param p - The point to check
   * @returns Returns `true` if both `x` and `y` are equal
   */
  equals(p2) {
    return p2.x === this.x && p2.y === this.y;
  }
  /**
   * Sets the point to a new `x` and `y` position.
   * If `y` is omitted, both `x` and `y` will be set to `x`.
   * @param {number} [x=0] - position of the point on the `x` axis
   * @param {number} [y=x] - position of the point on the `y` axis
   * @returns The point instance itself
   */
  set(x2 = 0, y2 = x2) {
    this.x = x2;
    this.y = y2;
    return this;
  }
  toString() {
    return `[pixi.js/math:Point x=${this.x} y=${this.y}]`;
  }
  /**
   * A static Point object with `x` and `y` values of `0`. Can be used to avoid creating new objects multiple times.
   * @readonly
   */
  static get shared() {
    tempPoint.x = 0;
    tempPoint.y = 0;
    return tempPoint;
  }
}
const tempPoint = new Point();
class Matrix {
  /**
   * @param a - x scale
   * @param b - y skew
   * @param c - x skew
   * @param d - y scale
   * @param tx - x translation
   * @param ty - y translation
   */
  constructor(a2 = 1, b2 = 0, c2 = 0, d2 = 1, tx = 0, ty = 0) {
    this.array = null;
    this.a = a2;
    this.b = b2;
    this.c = c2;
    this.d = d2;
    this.tx = tx;
    this.ty = ty;
  }
  /**
   * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
   *
   * a = array[0]
   * b = array[1]
   * c = array[3]
   * d = array[4]
   * tx = array[2]
   * ty = array[5]
   * @param array - The array that the matrix will be populated from.
   */
  fromArray(array) {
    this.a = array[0];
    this.b = array[1];
    this.c = array[3];
    this.d = array[4];
    this.tx = array[2];
    this.ty = array[5];
  }
  /**
   * Sets the matrix properties.
   * @param a - Matrix component
   * @param b - Matrix component
   * @param c - Matrix component
   * @param d - Matrix component
   * @param tx - Matrix component
   * @param ty - Matrix component
   * @returns This matrix. Good for chaining method calls.
   */
  set(a2, b2, c2, d2, tx, ty) {
    this.a = a2;
    this.b = b2;
    this.c = c2;
    this.d = d2;
    this.tx = tx;
    this.ty = ty;
    return this;
  }
  /**
   * Creates an array from the current Matrix object.
   * @param transpose - Whether we need to transpose the matrix or not
   * @param [out=new Float32Array(9)] - If provided the array will be assigned to out
   * @returns The newly created array which contains the matrix
   */
  toArray(transpose, out) {
    if (!this.array) {
      this.array = new Float32Array(9);
    }
    const array = out || this.array;
    if (transpose) {
      array[0] = this.a;
      array[1] = this.b;
      array[2] = 0;
      array[3] = this.c;
      array[4] = this.d;
      array[5] = 0;
      array[6] = this.tx;
      array[7] = this.ty;
      array[8] = 1;
    } else {
      array[0] = this.a;
      array[1] = this.c;
      array[2] = this.tx;
      array[3] = this.b;
      array[4] = this.d;
      array[5] = this.ty;
      array[6] = 0;
      array[7] = 0;
      array[8] = 1;
    }
    return array;
  }
  /**
   * Get a new position with the current transformation applied.
   * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
   * @param pos - The origin
   * @param {Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
   * @returns {Point} The new point, transformed through this matrix
   */
  apply(pos, newPos) {
    newPos = newPos || new Point();
    const x2 = pos.x;
    const y2 = pos.y;
    newPos.x = this.a * x2 + this.c * y2 + this.tx;
    newPos.y = this.b * x2 + this.d * y2 + this.ty;
    return newPos;
  }
  /**
   * Get a new position with the inverse of the current transformation applied.
   * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
   * @param pos - The origin
   * @param {Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
   * @returns {Point} The new point, inverse-transformed through this matrix
   */
  applyInverse(pos, newPos) {
    newPos = newPos || new Point();
    const a2 = this.a;
    const b2 = this.b;
    const c2 = this.c;
    const d2 = this.d;
    const tx = this.tx;
    const ty = this.ty;
    const id = 1 / (a2 * d2 + c2 * -b2);
    const x2 = pos.x;
    const y2 = pos.y;
    newPos.x = d2 * id * x2 + -c2 * id * y2 + (ty * c2 - tx * d2) * id;
    newPos.y = a2 * id * y2 + -b2 * id * x2 + (-ty * a2 + tx * b2) * id;
    return newPos;
  }
  /**
   * Translates the matrix on the x and y.
   * @param x - How much to translate x by
   * @param y - How much to translate y by
   * @returns This matrix. Good for chaining method calls.
   */
  translate(x2, y2) {
    this.tx += x2;
    this.ty += y2;
    return this;
  }
  /**
   * Applies a scale transformation to the matrix.
   * @param x - The amount to scale horizontally
   * @param y - The amount to scale vertically
   * @returns This matrix. Good for chaining method calls.
   */
  scale(x2, y2) {
    this.a *= x2;
    this.d *= y2;
    this.c *= x2;
    this.b *= y2;
    this.tx *= x2;
    this.ty *= y2;
    return this;
  }
  /**
   * Applies a rotation transformation to the matrix.
   * @param angle - The angle in radians.
   * @returns This matrix. Good for chaining method calls.
   */
  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const a1 = this.a;
    const c1 = this.c;
    const tx1 = this.tx;
    this.a = a1 * cos - this.b * sin;
    this.b = a1 * sin + this.b * cos;
    this.c = c1 * cos - this.d * sin;
    this.d = c1 * sin + this.d * cos;
    this.tx = tx1 * cos - this.ty * sin;
    this.ty = tx1 * sin + this.ty * cos;
    return this;
  }
  /**
   * Appends the given Matrix to this Matrix.
   * @param matrix - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  append(matrix) {
    const a1 = this.a;
    const b1 = this.b;
    const c1 = this.c;
    const d1 = this.d;
    this.a = matrix.a * a1 + matrix.b * c1;
    this.b = matrix.a * b1 + matrix.b * d1;
    this.c = matrix.c * a1 + matrix.d * c1;
    this.d = matrix.c * b1 + matrix.d * d1;
    this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
    this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;
    return this;
  }
  /**
   * Appends two matrix's and sets the result to this matrix. AB = A * B
   * @param a - The matrix to append.
   * @param b - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  appendFrom(a2, b2) {
    const a1 = a2.a;
    const b1 = a2.b;
    const c1 = a2.c;
    const d1 = a2.d;
    const tx = a2.tx;
    const ty = a2.ty;
    const a22 = b2.a;
    const b22 = b2.b;
    const c2 = b2.c;
    const d2 = b2.d;
    this.a = a1 * a22 + b1 * c2;
    this.b = a1 * b22 + b1 * d2;
    this.c = c1 * a22 + d1 * c2;
    this.d = c1 * b22 + d1 * d2;
    this.tx = tx * a22 + ty * c2 + b2.tx;
    this.ty = tx * b22 + ty * d2 + b2.ty;
    return this;
  }
  /**
   * Sets the matrix based on all the available properties
   * @param x - Position on the x axis
   * @param y - Position on the y axis
   * @param pivotX - Pivot on the x axis
   * @param pivotY - Pivot on the y axis
   * @param scaleX - Scale on the x axis
   * @param scaleY - Scale on the y axis
   * @param rotation - Rotation in radians
   * @param skewX - Skew on the x axis
   * @param skewY - Skew on the y axis
   * @returns This matrix. Good for chaining method calls.
   */
  setTransform(x2, y2, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY) {
    this.a = Math.cos(rotation + skewY) * scaleX;
    this.b = Math.sin(rotation + skewY) * scaleX;
    this.c = -Math.sin(rotation - skewX) * scaleY;
    this.d = Math.cos(rotation - skewX) * scaleY;
    this.tx = x2 - (pivotX * this.a + pivotY * this.c);
    this.ty = y2 - (pivotX * this.b + pivotY * this.d);
    return this;
  }
  /**
   * Prepends the given Matrix to this Matrix.
   * @param matrix - The matrix to prepend
   * @returns This matrix. Good for chaining method calls.
   */
  prepend(matrix) {
    const tx1 = this.tx;
    if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
      const a1 = this.a;
      const c1 = this.c;
      this.a = a1 * matrix.a + this.b * matrix.c;
      this.b = a1 * matrix.b + this.b * matrix.d;
      this.c = c1 * matrix.a + this.d * matrix.c;
      this.d = c1 * matrix.b + this.d * matrix.d;
    }
    this.tx = tx1 * matrix.a + this.ty * matrix.c + matrix.tx;
    this.ty = tx1 * matrix.b + this.ty * matrix.d + matrix.ty;
    return this;
  }
  /**
   * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
   * @param transform - The transform to apply the properties to.
   * @returns The transform with the newly applied properties
   */
  decompose(transform) {
    const a2 = this.a;
    const b2 = this.b;
    const c2 = this.c;
    const d2 = this.d;
    const pivot = transform.pivot;
    const skewX = -Math.atan2(-c2, d2);
    const skewY = Math.atan2(b2, a2);
    const delta = Math.abs(skewX + skewY);
    if (delta < 1e-5 || Math.abs(PI_2 - delta) < 1e-5) {
      transform.rotation = skewY;
      transform.skew.x = transform.skew.y = 0;
    } else {
      transform.rotation = 0;
      transform.skew.x = skewX;
      transform.skew.y = skewY;
    }
    transform.scale.x = Math.sqrt(a2 * a2 + b2 * b2);
    transform.scale.y = Math.sqrt(c2 * c2 + d2 * d2);
    transform.position.x = this.tx + (pivot.x * a2 + pivot.y * c2);
    transform.position.y = this.ty + (pivot.x * b2 + pivot.y * d2);
    return transform;
  }
  /**
   * Inverts this matrix
   * @returns This matrix. Good for chaining method calls.
   */
  invert() {
    const a1 = this.a;
    const b1 = this.b;
    const c1 = this.c;
    const d1 = this.d;
    const tx1 = this.tx;
    const n2 = a1 * d1 - b1 * c1;
    this.a = d1 / n2;
    this.b = -b1 / n2;
    this.c = -c1 / n2;
    this.d = a1 / n2;
    this.tx = (c1 * this.ty - d1 * tx1) / n2;
    this.ty = -(a1 * this.ty - b1 * tx1) / n2;
    return this;
  }
  /** Checks if this matrix is an identity matrix */
  isIdentity() {
    return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
  }
  /**
   * Resets this Matrix to an identity (default) matrix.
   * @returns This matrix. Good for chaining method calls.
   */
  identity() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;
    return this;
  }
  /**
   * Creates a new Matrix object with the same values as this one.
   * @returns A copy of this matrix. Good for chaining method calls.
   */
  clone() {
    const matrix = new Matrix();
    matrix.a = this.a;
    matrix.b = this.b;
    matrix.c = this.c;
    matrix.d = this.d;
    matrix.tx = this.tx;
    matrix.ty = this.ty;
    return matrix;
  }
  /**
   * Changes the values of the given matrix to be the same as the ones in this matrix
   * @param matrix - The matrix to copy to.
   * @returns The matrix given in parameter with its values updated.
   */
  copyTo(matrix) {
    matrix.a = this.a;
    matrix.b = this.b;
    matrix.c = this.c;
    matrix.d = this.d;
    matrix.tx = this.tx;
    matrix.ty = this.ty;
    return matrix;
  }
  /**
   * Changes the values of the matrix to be the same as the ones in given matrix
   * @param matrix - The matrix to copy from.
   * @returns this
   */
  copyFrom(matrix) {
    this.a = matrix.a;
    this.b = matrix.b;
    this.c = matrix.c;
    this.d = matrix.d;
    this.tx = matrix.tx;
    this.ty = matrix.ty;
    return this;
  }
  /**
   * check to see if two matrices are the same
   * @param matrix - The matrix to compare to.
   */
  equals(matrix) {
    return matrix.a === this.a && matrix.b === this.b && matrix.c === this.c && matrix.d === this.d && matrix.tx === this.tx && matrix.ty === this.ty;
  }
  toString() {
    return `[pixi.js:Matrix a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty}]`;
  }
  /**
   * A default (identity) matrix.
   *
   * This is a shared object, if you want to modify it consider creating a new `Matrix`
   * @readonly
   */
  static get IDENTITY() {
    return identityMatrix.identity();
  }
  /**
   * A static Matrix that can be used to avoid creating new objects.
   * Will always ensure the matrix is reset to identity when requested.
   * Use this object for fast but temporary calculations, as it may be mutated later on.
   * This is a different object to the `IDENTITY` object and so can be modified without changing `IDENTITY`.
   * @readonly
   */
  static get shared() {
    return tempMatrix$2.identity();
  }
}
const tempMatrix$2 = new Matrix();
const identityMatrix = new Matrix();
const ux = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1];
const uy = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1];
const vx = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1];
const vy = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1];
const rotationCayley = [];
const rotationMatrices = [];
const signum = Math.sign;
function init() {
  for (let i2 = 0; i2 < 16; i2++) {
    const row = [];
    rotationCayley.push(row);
    for (let j2 = 0; j2 < 16; j2++) {
      const _ux = signum(ux[i2] * ux[j2] + vx[i2] * uy[j2]);
      const _uy = signum(uy[i2] * ux[j2] + vy[i2] * uy[j2]);
      const _vx = signum(ux[i2] * vx[j2] + vx[i2] * vy[j2]);
      const _vy = signum(uy[i2] * vx[j2] + vy[i2] * vy[j2]);
      for (let k2 = 0; k2 < 16; k2++) {
        if (ux[k2] === _ux && uy[k2] === _uy && vx[k2] === _vx && vy[k2] === _vy) {
          row.push(k2);
          break;
        }
      }
    }
  }
  for (let i2 = 0; i2 < 16; i2++) {
    const mat = new Matrix();
    mat.set(ux[i2], uy[i2], vx[i2], vy[i2], 0, 0);
    rotationMatrices.push(mat);
  }
}
init();
const groupD8 = {
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 0°       | East      |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  E: 0,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 45°↻     | Southeast |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  SE: 1,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 90°↻     | South     |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  S: 2,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 135°↻    | Southwest |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  SW: 3,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 180°     | West      |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  W: 4,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -135°/225°↻ | Northwest    |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  NW: 5,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -90°/270°↻  | North        |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  N: 6,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -45°/315°↻  | Northeast    |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  NE: 7,
  /**
   * Reflection about Y-axis.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  MIRROR_VERTICAL: 8,
  /**
   * Reflection about the main diagonal.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  MAIN_DIAGONAL: 10,
  /**
   * Reflection about X-axis.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  MIRROR_HORIZONTAL: 12,
  /**
   * Reflection about reverse diagonal.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  REVERSE_DIAGONAL: 14,
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the U-axis
   *    after rotating the axes.
   */
  uX: (ind) => ux[ind],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the U-axis
   *    after rotating the axes.
   */
  uY: (ind) => uy[ind],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the V-axis
   *    after rotating the axes.
   */
  vX: (ind) => vx[ind],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the V-axis
   *    after rotating the axes.
   */
  vY: (ind) => vy[ind],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotation - symmetry whose opposite
   *   is needed. Only rotations have opposite symmetries while
   *   reflections don't.
   * @returns {GD8Symmetry} The opposite symmetry of `rotation`
   */
  inv: (rotation) => {
    if (rotation & 8) {
      return rotation & 15;
    }
    return -rotation & 7;
  },
  /**
   * Composes the two D8 operations.
   *
   * Taking `^` as reflection:
   *
   * |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
   * |-------|-----|-----|-----|-----|------|-------|-------|-------|
   * | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
   * | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
   * | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
   * | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
   * | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
   * | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
   * | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
   * | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
   *
   * [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation, which
   *   is the row in the above cayley table.
   * @param {GD8Symmetry} rotationFirst - First operation, which
   *   is the column in the above cayley table.
   * @returns {GD8Symmetry} Composed operation
   */
  add: (rotationSecond, rotationFirst) => rotationCayley[rotationSecond][rotationFirst],
  /**
   * Reverse of `add`.
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation
   * @param {GD8Symmetry} rotationFirst - First operation
   * @returns {GD8Symmetry} Result
   */
  sub: (rotationSecond, rotationFirst) => rotationCayley[rotationSecond][groupD8.inv(rotationFirst)],
  /**
   * Adds 180 degrees to rotation, which is a commutative
   * operation.
   * @memberof maths.groupD8
   * @param {number} rotation - The number to rotate.
   * @returns {number} Rotated number
   */
  rotate180: (rotation) => rotation ^ 4,
  /**
   * Checks if the rotation angle is vertical, i.e. south
   * or north. It doesn't work for reflections.
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotation - The number to check.
   * @returns {boolean} Whether or not the direction is vertical
   */
  isVertical: (rotation) => (rotation & 3) === 2,
  // rotation % 4 === 2
  /**
   * Approximates the vector `V(dx,dy)` into one of the
   * eight directions provided by `groupD8`.
   * @memberof maths.groupD8
   * @param {number} dx - X-component of the vector
   * @param {number} dy - Y-component of the vector
   * @returns {GD8Symmetry} Approximation of the vector into
   *  one of the eight symmetries.
   */
  byDirection: (dx, dy) => {
    if (Math.abs(dx) * 2 <= Math.abs(dy)) {
      if (dy >= 0) {
        return groupD8.S;
      }
      return groupD8.N;
    } else if (Math.abs(dy) * 2 <= Math.abs(dx)) {
      if (dx > 0) {
        return groupD8.E;
      }
      return groupD8.W;
    } else if (dy > 0) {
      if (dx > 0) {
        return groupD8.SE;
      }
      return groupD8.SW;
    } else if (dx > 0) {
      return groupD8.NE;
    }
    return groupD8.NW;
  },
  /**
   * Helps sprite to compensate texture packer rotation.
   * @memberof maths.groupD8
   * @param {Matrix} matrix - sprite world matrix
   * @param {GD8Symmetry} rotation - The rotation factor to use.
   * @param {number} tx - sprite anchoring
   * @param {number} ty - sprite anchoring
   */
  matrixAppendRotationInv: (matrix, rotation, tx = 0, ty = 0) => {
    const mat = rotationMatrices[groupD8.inv(rotation)];
    mat.tx = tx;
    mat.ty = ty;
    matrix.append(mat);
  }
};
const tempPoints = [new Point(), new Point(), new Point(), new Point()];
class Rectangle {
  /**
   * @param x - The X coordinate of the upper-left corner of the rectangle
   * @param y - The Y coordinate of the upper-left corner of the rectangle
   * @param width - The overall width of the rectangle
   * @param height - The overall height of the rectangle
   */
  constructor(x2 = 0, y2 = 0, width = 0, height = 0) {
    this.type = "rectangle";
    this.x = Number(x2);
    this.y = Number(y2);
    this.width = Number(width);
    this.height = Number(height);
  }
  /** Returns the left edge of the rectangle. */
  get left() {
    return this.x;
  }
  /** Returns the right edge of the rectangle. */
  get right() {
    return this.x + this.width;
  }
  /** Returns the top edge of the rectangle. */
  get top() {
    return this.y;
  }
  /** Returns the bottom edge of the rectangle. */
  get bottom() {
    return this.y + this.height;
  }
  /** Determines whether the Rectangle is empty. */
  isEmpty() {
    return this.left === this.right || this.top === this.bottom;
  }
  /** A constant empty rectangle. This is a new object every time the property is accessed */
  static get EMPTY() {
    return new Rectangle(0, 0, 0, 0);
  }
  /**
   * Creates a clone of this Rectangle
   * @returns a copy of the rectangle
   */
  clone() {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }
  /**
   * Converts a Bounds object to a Rectangle object.
   * @param bounds - The bounds to copy and convert to a rectangle.
   * @returns Returns itself.
   */
  copyFromBounds(bounds) {
    this.x = bounds.minX;
    this.y = bounds.minY;
    this.width = bounds.maxX - bounds.minX;
    this.height = bounds.maxY - bounds.minY;
    return this;
  }
  /**
   * Copies another rectangle to this one.
   * @param rectangle - The rectangle to copy from.
   * @returns Returns itself.
   */
  copyFrom(rectangle) {
    this.x = rectangle.x;
    this.y = rectangle.y;
    this.width = rectangle.width;
    this.height = rectangle.height;
    return this;
  }
  /**
   * Copies this rectangle to another one.
   * @param rectangle - The rectangle to copy to.
   * @returns Returns given parameter.
   */
  copyTo(rectangle) {
    rectangle.copyFrom(this);
    return rectangle;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rectangle
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Rectangle
   */
  contains(x2, y2) {
    if (this.width <= 0 || this.height <= 0) {
      return false;
    }
    if (x2 >= this.x && x2 < this.x + this.width) {
      if (y2 >= this.y && y2 < this.y + this.height) {
        return true;
      }
    }
    return false;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke, 0.5 by default
   * @returns Whether the x/y coordinates are within this rectangle
   */
  strokeContains(x2, y2, strokeWidth, alignment = 0.5) {
    const { width, height } = this;
    if (width <= 0 || height <= 0)
      return false;
    const _x = this.x;
    const _y = this.y;
    const strokeWidthOuter = strokeWidth * (1 - alignment);
    const strokeWidthInner = strokeWidth - strokeWidthOuter;
    const outerLeft = _x - strokeWidthOuter;
    const outerRight = _x + width + strokeWidthOuter;
    const outerTop = _y - strokeWidthOuter;
    const outerBottom = _y + height + strokeWidthOuter;
    const innerLeft = _x + strokeWidthInner;
    const innerRight = _x + width - strokeWidthInner;
    const innerTop = _y + strokeWidthInner;
    const innerBottom = _y + height - strokeWidthInner;
    return x2 >= outerLeft && x2 <= outerRight && y2 >= outerTop && y2 <= outerBottom && !(x2 > innerLeft && x2 < innerRight && y2 > innerTop && y2 < innerBottom);
  }
  /**
   * Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
   * Returns true only if the area of the intersection is >0, this means that Rectangles
   * sharing a side are not overlapping. Another side effect is that an arealess rectangle
   * (width or height equal to zero) can't intersect any other rectangle.
   * @param {Rectangle} other - The Rectangle to intersect with `this`.
   * @param {Matrix} transform - The transformation matrix of `other`.
   * @returns {boolean} A value of `true` if the transformed `other` Rectangle intersects with `this`; otherwise `false`.
   */
  intersects(other, transform) {
    if (!transform) {
      const x02 = this.x < other.x ? other.x : this.x;
      const x12 = this.right > other.right ? other.right : this.right;
      if (x12 <= x02) {
        return false;
      }
      const y02 = this.y < other.y ? other.y : this.y;
      const y12 = this.bottom > other.bottom ? other.bottom : this.bottom;
      return y12 > y02;
    }
    const x0 = this.left;
    const x1 = this.right;
    const y0 = this.top;
    const y1 = this.bottom;
    if (x1 <= x0 || y1 <= y0) {
      return false;
    }
    const lt = tempPoints[0].set(other.left, other.top);
    const lb = tempPoints[1].set(other.left, other.bottom);
    const rt = tempPoints[2].set(other.right, other.top);
    const rb = tempPoints[3].set(other.right, other.bottom);
    if (rt.x <= lt.x || lb.y <= lt.y) {
      return false;
    }
    const s2 = Math.sign(transform.a * transform.d - transform.b * transform.c);
    if (s2 === 0) {
      return false;
    }
    transform.apply(lt, lt);
    transform.apply(lb, lb);
    transform.apply(rt, rt);
    transform.apply(rb, rb);
    if (Math.max(lt.x, lb.x, rt.x, rb.x) <= x0 || Math.min(lt.x, lb.x, rt.x, rb.x) >= x1 || Math.max(lt.y, lb.y, rt.y, rb.y) <= y0 || Math.min(lt.y, lb.y, rt.y, rb.y) >= y1) {
      return false;
    }
    const nx = s2 * (lb.y - lt.y);
    const ny = s2 * (lt.x - lb.x);
    const n00 = nx * x0 + ny * y0;
    const n10 = nx * x1 + ny * y0;
    const n01 = nx * x0 + ny * y1;
    const n11 = nx * x1 + ny * y1;
    if (Math.max(n00, n10, n01, n11) <= nx * lt.x + ny * lt.y || Math.min(n00, n10, n01, n11) >= nx * rb.x + ny * rb.y) {
      return false;
    }
    const mx = s2 * (lt.y - rt.y);
    const my = s2 * (rt.x - lt.x);
    const m00 = mx * x0 + my * y0;
    const m10 = mx * x1 + my * y0;
    const m01 = mx * x0 + my * y1;
    const m11 = mx * x1 + my * y1;
    if (Math.max(m00, m10, m01, m11) <= mx * lt.x + my * lt.y || Math.min(m00, m10, m01, m11) >= mx * rb.x + my * rb.y) {
      return false;
    }
    return true;
  }
  /**
   * Pads the rectangle making it grow in all directions.
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @param paddingX - The horizontal padding amount.
   * @param paddingY - The vertical padding amount.
   * @returns Returns itself.
   */
  pad(paddingX = 0, paddingY = paddingX) {
    this.x -= paddingX;
    this.y -= paddingY;
    this.width += paddingX * 2;
    this.height += paddingY * 2;
    return this;
  }
  /**
   * Fits this rectangle around the passed one.
   * @param rectangle - The rectangle to fit.
   * @returns Returns itself.
   */
  fit(rectangle) {
    const x1 = Math.max(this.x, rectangle.x);
    const x2 = Math.min(this.x + this.width, rectangle.x + rectangle.width);
    const y1 = Math.max(this.y, rectangle.y);
    const y2 = Math.min(this.y + this.height, rectangle.y + rectangle.height);
    this.x = x1;
    this.width = Math.max(x2 - x1, 0);
    this.y = y1;
    this.height = Math.max(y2 - y1, 0);
    return this;
  }
  /**
   * Enlarges rectangle that way its corners lie on grid
   * @param resolution - resolution
   * @param eps - precision
   * @returns Returns itself.
   */
  ceil(resolution = 1, eps = 1e-3) {
    const x2 = Math.ceil((this.x + this.width - eps) * resolution) / resolution;
    const y2 = Math.ceil((this.y + this.height - eps) * resolution) / resolution;
    this.x = Math.floor((this.x + eps) * resolution) / resolution;
    this.y = Math.floor((this.y + eps) * resolution) / resolution;
    this.width = x2 - this.x;
    this.height = y2 - this.y;
    return this;
  }
  /**
   * Enlarges this rectangle to include the passed rectangle.
   * @param rectangle - The rectangle to include.
   * @returns Returns itself.
   */
  enlarge(rectangle) {
    const x1 = Math.min(this.x, rectangle.x);
    const x2 = Math.max(this.x + this.width, rectangle.x + rectangle.width);
    const y1 = Math.min(this.y, rectangle.y);
    const y2 = Math.max(this.y + this.height, rectangle.y + rectangle.height);
    this.x = x1;
    this.width = x2 - x1;
    this.y = y1;
    this.height = y2 - y1;
    return this;
  }
  /**
   * Returns the framing rectangle of the rectangle as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(out) {
    out || (out = new Rectangle());
    out.copyFrom(this);
    return out;
  }
  /**
   * Checks if this rectangle fully contains another rectangle.
   *
   * A rectangle contains another rectangle if all four corners of the other rectangle
   * lie within the bounds of this rectangle.
   *
   * ```ts
   * const container = new Rectangle(0, 0, 100, 100);
   * const inside = new Rectangle(25, 25, 50, 50);
   * const partial = new Rectangle(75, 75, 50, 50);
   *
   * container.containsRect(inside); // Returns true
   * container.containsRect(partial); // Returns false - partial overlap
   * ```
   *
   * Note: If either rectangle has a width or height of 0, this method returns false
   * since a zero-area rectangle cannot meaningfully contain another rectangle.
   * @param other - The rectangle to check if it is contained within this one
   * @returns True if the other rectangle is fully contained within this one
   */
  containsRect(other) {
    if (this.width <= 0 || this.height <= 0)
      return false;
    const x1 = other.x;
    const y1 = other.y;
    const x2 = other.x + other.width;
    const y2 = other.y + other.height;
    return x1 >= this.x && x1 < this.x + this.width && y1 >= this.y && y1 < this.y + this.height && x2 >= this.x && x2 < this.x + this.width && y2 >= this.y && y2 < this.y + this.height;
  }
  toString() {
    return `[pixi.js/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
  }
}
const uidCache = {
  default: -1
};
function uid(name = "default") {
  if (uidCache[name] === void 0) {
    uidCache[name] = -1;
  }
  return ++uidCache[name];
}
const warnings = {};
const v8_0_0 = "8.0.0";
const v8_3_4 = "8.3.4";
function deprecation(version, message, ignoreDepth = 3) {
  if (warnings[message]) {
    return;
  }
  let stack = new Error().stack;
  if (typeof stack === "undefined") {
    console.warn("PixiJS Deprecation Warning: ", `${message}
Deprecated since v${version}`);
  } else {
    stack = stack.split("\n").splice(ignoreDepth).join("\n");
    if (console.groupCollapsed) {
      console.groupCollapsed(
        "%cPixiJS Deprecation Warning: %c%s",
        "color:#614108;background:#fffbe6",
        "font-weight:normal;color:#614108;background:#fffbe6",
        `${message}
Deprecated since v${version}`
      );
      console.warn(stack);
      console.groupEnd();
    } else {
      console.warn("PixiJS Deprecation Warning: ", `${message}
Deprecated since v${version}`);
      console.warn(stack);
    }
  }
  warnings[message] = true;
}
const NOOP = () => {
};
function nextPow2(v2) {
  v2 += v2 === 0 ? 1 : 0;
  --v2;
  v2 |= v2 >>> 1;
  v2 |= v2 >>> 2;
  v2 |= v2 >>> 4;
  v2 |= v2 >>> 8;
  v2 |= v2 >>> 16;
  return v2 + 1;
}
function isPow2(v2) {
  return !(v2 & v2 - 1) && !!v2;
}
function definedProps(obj) {
  const result = {};
  for (const key in obj) {
    if (obj[key] !== void 0) {
      result[key] = obj[key];
    }
  }
  return result;
}
const idHash = /* @__PURE__ */ Object.create(null);
function createResourceIdFromString(value) {
  const id = idHash[value];
  if (id === void 0) {
    idHash[value] = uid("resource");
  }
  return id;
}
const _TextureStyle = class _TextureStyle2 extends EventEmitter {
  /**
   * @param options - options for the style
   */
  constructor(options = {}) {
    super();
    this._resourceType = "textureSampler";
    this._touched = 0;
    this._maxAnisotropy = 1;
    this.destroyed = false;
    options = { ..._TextureStyle2.defaultOptions, ...options };
    this.addressMode = options.addressMode;
    this.addressModeU = options.addressModeU ?? this.addressModeU;
    this.addressModeV = options.addressModeV ?? this.addressModeV;
    this.addressModeW = options.addressModeW ?? this.addressModeW;
    this.scaleMode = options.scaleMode;
    this.magFilter = options.magFilter ?? this.magFilter;
    this.minFilter = options.minFilter ?? this.minFilter;
    this.mipmapFilter = options.mipmapFilter ?? this.mipmapFilter;
    this.lodMinClamp = options.lodMinClamp;
    this.lodMaxClamp = options.lodMaxClamp;
    this.compare = options.compare;
    this.maxAnisotropy = options.maxAnisotropy ?? 1;
  }
  set addressMode(value) {
    this.addressModeU = value;
    this.addressModeV = value;
    this.addressModeW = value;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this.addressModeU;
  }
  set wrapMode(value) {
    deprecation(v8_0_0, "TextureStyle.wrapMode is now TextureStyle.addressMode");
    this.addressMode = value;
  }
  get wrapMode() {
    return this.addressMode;
  }
  set scaleMode(value) {
    this.magFilter = value;
    this.minFilter = value;
    this.mipmapFilter = value;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this.magFilter;
  }
  /** Specifies the maximum anisotropy value clamp used by the sampler. */
  set maxAnisotropy(value) {
    this._maxAnisotropy = Math.min(value, 16);
    if (this._maxAnisotropy > 1) {
      this.scaleMode = "linear";
    }
  }
  get maxAnisotropy() {
    return this._maxAnisotropy;
  }
  // TODO - move this to WebGL?
  get _resourceId() {
    return this._sharedResourceId || this._generateResourceId();
  }
  update() {
    this.emit("change", this);
    this._sharedResourceId = null;
  }
  _generateResourceId() {
    const bigKey = `${this.addressModeU}-${this.addressModeV}-${this.addressModeW}-${this.magFilter}-${this.minFilter}-${this.mipmapFilter}-${this.lodMinClamp}-${this.lodMaxClamp}-${this.compare}-${this._maxAnisotropy}`;
    this._sharedResourceId = createResourceIdFromString(bigKey);
    return this._resourceId;
  }
  /** Destroys the style */
  destroy() {
    this.destroyed = true;
    this.emit("destroy", this);
    this.emit("change", this);
    this.removeAllListeners();
  }
};
_TextureStyle.defaultOptions = {
  addressMode: "clamp-to-edge",
  scaleMode: "linear"
};
let TextureStyle = _TextureStyle;
const _TextureSource = class _TextureSource2 extends EventEmitter {
  /**
   * @param options - options for creating a new TextureSource
   */
  constructor(options = {}) {
    super();
    this.options = options;
    this.uid = uid("textureSource");
    this._resourceType = "textureSource";
    this._resourceId = uid("resource");
    this.uploadMethodId = "unknown";
    this._resolution = 1;
    this.pixelWidth = 1;
    this.pixelHeight = 1;
    this.width = 1;
    this.height = 1;
    this.sampleCount = 1;
    this.mipLevelCount = 1;
    this.autoGenerateMipmaps = false;
    this.format = "rgba8unorm";
    this.dimension = "2d";
    this.antialias = false;
    this._touched = 0;
    this._batchTick = -1;
    this._textureBindLocation = -1;
    options = { ..._TextureSource2.defaultOptions, ...options };
    this.label = options.label ?? "";
    this.resource = options.resource;
    this.autoGarbageCollect = options.autoGarbageCollect;
    this._resolution = options.resolution;
    if (options.width) {
      this.pixelWidth = options.width * this._resolution;
    } else {
      this.pixelWidth = this.resource ? this.resourceWidth ?? 1 : 1;
    }
    if (options.height) {
      this.pixelHeight = options.height * this._resolution;
    } else {
      this.pixelHeight = this.resource ? this.resourceHeight ?? 1 : 1;
    }
    this.width = this.pixelWidth / this._resolution;
    this.height = this.pixelHeight / this._resolution;
    this.format = options.format;
    this.dimension = options.dimensions;
    this.mipLevelCount = options.mipLevelCount;
    this.autoGenerateMipmaps = options.autoGenerateMipmaps;
    this.sampleCount = options.sampleCount;
    this.antialias = options.antialias;
    this.alphaMode = options.alphaMode;
    this.style = new TextureStyle(definedProps(options));
    this.destroyed = false;
    this._refreshPOT();
  }
  /** returns itself */
  get source() {
    return this;
  }
  /** the style of the texture */
  get style() {
    return this._style;
  }
  set style(value) {
    var _a, _b;
    if (this.style === value)
      return;
    (_a = this._style) == null ? void 0 : _a.off("change", this._onStyleChange, this);
    this._style = value;
    (_b = this._style) == null ? void 0 : _b.on("change", this._onStyleChange, this);
    this._onStyleChange();
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this._style.addressMode;
  }
  set addressMode(value) {
    this._style.addressMode = value;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get repeatMode() {
    return this._style.addressMode;
  }
  set repeatMode(value) {
    this._style.addressMode = value;
  }
  /** Specifies the sampling behavior when the sample footprint is smaller than or equal to one texel. */
  get magFilter() {
    return this._style.magFilter;
  }
  set magFilter(value) {
    this._style.magFilter = value;
  }
  /** Specifies the sampling behavior when the sample footprint is larger than one texel. */
  get minFilter() {
    return this._style.minFilter;
  }
  set minFilter(value) {
    this._style.minFilter = value;
  }
  /** Specifies behavior for sampling between mipmap levels. */
  get mipmapFilter() {
    return this._style.mipmapFilter;
  }
  set mipmapFilter(value) {
    this._style.mipmapFilter = value;
  }
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  get lodMinClamp() {
    return this._style.lodMinClamp;
  }
  set lodMinClamp(value) {
    this._style.lodMinClamp = value;
  }
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  get lodMaxClamp() {
    return this._style.lodMaxClamp;
  }
  set lodMaxClamp(value) {
    this._style.lodMaxClamp = value;
  }
  _onStyleChange() {
    this.emit("styleChange", this);
  }
  /** call this if you have modified the texture outside of the constructor */
  update() {
    if (this.resource) {
      const resolution = this._resolution;
      const didResize = this.resize(this.resourceWidth / resolution, this.resourceHeight / resolution);
      if (didResize)
        return;
    }
    this.emit("update", this);
  }
  /** Destroys this texture source */
  destroy() {
    this.destroyed = true;
    this.emit("destroy", this);
    this.emit("change", this);
    if (this._style) {
      this._style.destroy();
      this._style = null;
    }
    this.uploadMethodId = null;
    this.resource = null;
    this.removeAllListeners();
  }
  /**
   * This will unload the Texture source from the GPU. This will free up the GPU memory
   * As soon as it is required fore rendering, it will be re-uploaded.
   */
  unload() {
    this._resourceId = uid("resource");
    this.emit("change", this);
    this.emit("unload", this);
  }
  /** the width of the resource. This is the REAL pure number, not accounting resolution   */
  get resourceWidth() {
    const { resource } = this;
    return resource.naturalWidth || resource.videoWidth || resource.displayWidth || resource.width;
  }
  /** the height of the resource. This is the REAL pure number, not accounting resolution */
  get resourceHeight() {
    const { resource } = this;
    return resource.naturalHeight || resource.videoHeight || resource.displayHeight || resource.height;
  }
  /**
   * the resolution of the texture. Changing this number, will not change the number of pixels in the actual texture
   * but will the size of the texture when rendered.
   *
   * changing the resolution of this texture to 2 for example will make it appear twice as small when rendered (as pixel
   * density will have increased)
   */
  get resolution() {
    return this._resolution;
  }
  set resolution(resolution) {
    if (this._resolution === resolution)
      return;
    this._resolution = resolution;
    this.width = this.pixelWidth / resolution;
    this.height = this.pixelHeight / resolution;
  }
  /**
   * Resize the texture, this is handy if you want to use the texture as a render texture
   * @param width - the new width of the texture
   * @param height - the new height of the texture
   * @param resolution - the new resolution of the texture
   * @returns - if the texture was resized
   */
  resize(width, height, resolution) {
    resolution || (resolution = this._resolution);
    width || (width = this.width);
    height || (height = this.height);
    const newPixelWidth = Math.round(width * resolution);
    const newPixelHeight = Math.round(height * resolution);
    this.width = newPixelWidth / resolution;
    this.height = newPixelHeight / resolution;
    this._resolution = resolution;
    if (this.pixelWidth === newPixelWidth && this.pixelHeight === newPixelHeight) {
      return false;
    }
    this._refreshPOT();
    this.pixelWidth = newPixelWidth;
    this.pixelHeight = newPixelHeight;
    this.emit("resize", this);
    this._resourceId = uid("resource");
    this.emit("change", this);
    return true;
  }
  /**
   * Lets the renderer know that this texture has been updated and its mipmaps should be re-generated.
   * This is only important for RenderTexture instances, as standard Texture instances will have their
   * mipmaps generated on upload. You should call this method after you make any change to the texture
   *
   * The reason for this is is can be quite expensive to update mipmaps for a texture. So by default,
   * We want you, the developer to specify when this action should happen.
   *
   * Generally you don't want to have mipmaps generated on Render targets that are changed every frame,
   */
  updateMipmaps() {
    if (this.autoGenerateMipmaps && this.mipLevelCount > 1) {
      this.emit("updateMipmaps", this);
    }
  }
  set wrapMode(value) {
    this._style.wrapMode = value;
  }
  get wrapMode() {
    return this._style.wrapMode;
  }
  set scaleMode(value) {
    this._style.scaleMode = value;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this._style.scaleMode;
  }
  /**
   * Refresh check for isPowerOfTwo texture based on size
   * @private
   */
  _refreshPOT() {
    this.isPowerOfTwo = isPow2(this.pixelWidth) && isPow2(this.pixelHeight);
  }
  static test(_resource) {
    throw new Error("Unimplemented");
  }
};
_TextureSource.defaultOptions = {
  resolution: 1,
  format: "bgra8unorm",
  alphaMode: "premultiply-alpha-on-upload",
  dimensions: "2d",
  mipLevelCount: 1,
  autoGenerateMipmaps: false,
  sampleCount: 1,
  antialias: false,
  autoGarbageCollect: false
};
let TextureSource = _TextureSource;
class BufferImageSource extends TextureSource {
  constructor(options) {
    const buffer = options.resource || new Float32Array(options.width * options.height * 4);
    let format = options.format;
    if (!format) {
      if (buffer instanceof Float32Array) {
        format = "rgba32float";
      } else if (buffer instanceof Int32Array) {
        format = "rgba32uint";
      } else if (buffer instanceof Uint32Array) {
        format = "rgba32uint";
      } else if (buffer instanceof Int16Array) {
        format = "rgba16uint";
      } else if (buffer instanceof Uint16Array) {
        format = "rgba16uint";
      } else if (buffer instanceof Int8Array) {
        format = "bgra8unorm";
      } else {
        format = "bgra8unorm";
      }
    }
    super({
      ...options,
      resource: buffer,
      format
    });
    this.uploadMethodId = "buffer";
  }
  static test(resource) {
    return resource instanceof Int8Array || resource instanceof Uint8Array || resource instanceof Uint8ClampedArray || resource instanceof Int16Array || resource instanceof Uint16Array || resource instanceof Int32Array || resource instanceof Uint32Array || resource instanceof Float32Array;
  }
}
BufferImageSource.extension = ExtensionType.TextureSource;
const tempMat = new Matrix();
class TextureMatrix {
  /**
   * @param texture - observed texture
   * @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
   */
  constructor(texture, clampMargin) {
    this.mapCoord = new Matrix();
    this.uClampFrame = new Float32Array(4);
    this.uClampOffset = new Float32Array(2);
    this._textureID = -1;
    this._updateID = 0;
    this.clampOffset = 0;
    if (typeof clampMargin === "undefined") {
      this.clampMargin = texture.width < 10 ? 0 : 0.5;
    } else {
      this.clampMargin = clampMargin;
    }
    this.isSimple = false;
    this.texture = texture;
  }
  /** Texture property. */
  get texture() {
    return this._texture;
  }
  set texture(value) {
    var _a;
    if (this.texture === value)
      return;
    (_a = this._texture) == null ? void 0 : _a.removeListener("update", this.update, this);
    this._texture = value;
    this._texture.addListener("update", this.update, this);
    this.update();
  }
  /**
   * Multiplies uvs array to transform
   * @param uvs - mesh uvs
   * @param [out=uvs] - output
   * @returns - output
   */
  multiplyUvs(uvs, out) {
    if (out === void 0) {
      out = uvs;
    }
    const mat = this.mapCoord;
    for (let i2 = 0; i2 < uvs.length; i2 += 2) {
      const x2 = uvs[i2];
      const y2 = uvs[i2 + 1];
      out[i2] = x2 * mat.a + y2 * mat.c + mat.tx;
      out[i2 + 1] = x2 * mat.b + y2 * mat.d + mat.ty;
    }
    return out;
  }
  /**
   * Updates matrices if texture was changed
   * @returns - whether or not it was updated
   */
  update() {
    const tex = this._texture;
    this._updateID++;
    const uvs = tex.uvs;
    this.mapCoord.set(uvs.x1 - uvs.x0, uvs.y1 - uvs.y0, uvs.x3 - uvs.x0, uvs.y3 - uvs.y0, uvs.x0, uvs.y0);
    const orig = tex.orig;
    const trim = tex.trim;
    if (trim) {
      tempMat.set(
        orig.width / trim.width,
        0,
        0,
        orig.height / trim.height,
        -trim.x / trim.width,
        -trim.y / trim.height
      );
      this.mapCoord.append(tempMat);
    }
    const texBase = tex.source;
    const frame = this.uClampFrame;
    const margin = this.clampMargin / texBase._resolution;
    const offset = this.clampOffset / texBase._resolution;
    frame[0] = (tex.frame.x + margin + offset) / texBase.width;
    frame[1] = (tex.frame.y + margin + offset) / texBase.height;
    frame[2] = (tex.frame.x + tex.frame.width - margin + offset) / texBase.width;
    frame[3] = (tex.frame.y + tex.frame.height - margin + offset) / texBase.height;
    this.uClampOffset[0] = this.clampOffset / texBase.pixelWidth;
    this.uClampOffset[1] = this.clampOffset / texBase.pixelHeight;
    this.isSimple = tex.frame.width === texBase.width && tex.frame.height === texBase.height && tex.rotate === 0;
    return true;
  }
}
class Texture extends EventEmitter {
  /**
   * @param {rendering.TextureOptions} options - Options for the texture
   */
  constructor({
    source,
    label,
    frame,
    orig,
    trim,
    defaultAnchor,
    defaultBorders,
    rotate,
    dynamic
  } = {}) {
    super();
    this.uid = uid("texture");
    this.uvs = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };
    this.frame = new Rectangle();
    this.noFrame = false;
    this.dynamic = false;
    this.isTexture = true;
    this.label = label;
    this.source = (source == null ? void 0 : source.source) ?? new TextureSource();
    this.noFrame = !frame;
    if (frame) {
      this.frame.copyFrom(frame);
    } else {
      const { width, height } = this._source;
      this.frame.width = width;
      this.frame.height = height;
    }
    this.orig = orig || this.frame;
    this.trim = trim;
    this.rotate = rotate ?? 0;
    this.defaultAnchor = defaultAnchor;
    this.defaultBorders = defaultBorders;
    this.destroyed = false;
    this.dynamic = dynamic || false;
    this.updateUvs();
  }
  set source(value) {
    if (this._source) {
      this._source.off("resize", this.update, this);
    }
    this._source = value;
    value.on("resize", this.update, this);
    this.emit("update", this);
  }
  /** the underlying source of the texture (equivalent of baseTexture in v7) */
  get source() {
    return this._source;
  }
  /** returns a TextureMatrix instance for this texture. By default, that object is not created because its heavy. */
  get textureMatrix() {
    if (!this._textureMatrix) {
      this._textureMatrix = new TextureMatrix(this);
    }
    return this._textureMatrix;
  }
  /** The width of the Texture in pixels. */
  get width() {
    return this.orig.width;
  }
  /** The height of the Texture in pixels. */
  get height() {
    return this.orig.height;
  }
  /** Call this function when you have modified the frame of this texture. */
  updateUvs() {
    const { uvs, frame } = this;
    const { width, height } = this._source;
    const nX = frame.x / width;
    const nY = frame.y / height;
    const nW = frame.width / width;
    const nH = frame.height / height;
    let rotate = this.rotate;
    if (rotate) {
      const w2 = nW / 2;
      const h2 = nH / 2;
      const cX = nX + w2;
      const cY = nY + h2;
      rotate = groupD8.add(rotate, groupD8.NW);
      uvs.x0 = cX + w2 * groupD8.uX(rotate);
      uvs.y0 = cY + h2 * groupD8.uY(rotate);
      rotate = groupD8.add(rotate, 2);
      uvs.x1 = cX + w2 * groupD8.uX(rotate);
      uvs.y1 = cY + h2 * groupD8.uY(rotate);
      rotate = groupD8.add(rotate, 2);
      uvs.x2 = cX + w2 * groupD8.uX(rotate);
      uvs.y2 = cY + h2 * groupD8.uY(rotate);
      rotate = groupD8.add(rotate, 2);
      uvs.x3 = cX + w2 * groupD8.uX(rotate);
      uvs.y3 = cY + h2 * groupD8.uY(rotate);
    } else {
      uvs.x0 = nX;
      uvs.y0 = nY;
      uvs.x1 = nX + nW;
      uvs.y1 = nY;
      uvs.x2 = nX + nW;
      uvs.y2 = nY + nH;
      uvs.x3 = nX;
      uvs.y3 = nY + nH;
    }
  }
  /**
   * Destroys this texture
   * @param destroySource - Destroy the source when the texture is destroyed.
   */
  destroy(destroySource = false) {
    if (this._source) {
      if (destroySource) {
        this._source.destroy();
        this._source = null;
      }
    }
    this._textureMatrix = null;
    this.destroyed = true;
    this.emit("destroy", this);
    this.removeAllListeners();
  }
  /**
   * Call this if you have modified the `texture outside` of the constructor.
   *
   * If you have modified this texture's source, you must separately call `texture.source.update()` to see those changes.
   */
  update() {
    if (this.noFrame) {
      this.frame.width = this._source.width;
      this.frame.height = this._source.height;
    }
    this.updateUvs();
    this.emit("update", this);
  }
  /** @deprecated since 8.0.0 */
  get baseTexture() {
    deprecation(v8_0_0, "Texture.baseTexture is now Texture.source");
    return this._source;
  }
}
Texture.EMPTY = new Texture({
  label: "EMPTY",
  source: new TextureSource({
    label: "EMPTY"
  })
});
Texture.EMPTY.destroy = NOOP;
Texture.WHITE = new Texture({
  source: new BufferImageSource({
    resource: new Uint8Array([255, 255, 255, 255]),
    width: 1,
    height: 1,
    alphaMode: "premultiply-alpha-on-upload",
    label: "WHITE"
  }),
  label: "WHITE"
});
Texture.WHITE.destroy = NOOP;
function updateQuadBounds(bounds, anchor, texture) {
  const { width, height } = texture.orig;
  const trim = texture.trim;
  if (trim) {
    const sourceWidth = trim.width;
    const sourceHeight = trim.height;
    bounds.minX = trim.x - anchor._x * width;
    bounds.maxX = bounds.minX + sourceWidth;
    bounds.minY = trim.y - anchor._y * height;
    bounds.maxY = bounds.minY + sourceHeight;
  } else {
    bounds.minX = -anchor._x * width;
    bounds.maxX = bounds.minX + width;
    bounds.minY = -anchor._y * height;
    bounds.maxY = bounds.minY + height;
  }
}
const defaultMatrix = new Matrix();
class Bounds {
  constructor(minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity) {
    this.minX = Infinity;
    this.minY = Infinity;
    this.maxX = -Infinity;
    this.maxY = -Infinity;
    this.matrix = defaultMatrix;
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }
  /**
   * Checks if bounds are empty.
   * @returns - True if empty.
   */
  isEmpty() {
    return this.minX > this.maxX || this.minY > this.maxY;
  }
  /** The bounding rectangle of the bounds. */
  get rectangle() {
    if (!this._rectangle) {
      this._rectangle = new Rectangle();
    }
    const rectangle = this._rectangle;
    if (this.minX > this.maxX || this.minY > this.maxY) {
      rectangle.x = 0;
      rectangle.y = 0;
      rectangle.width = 0;
      rectangle.height = 0;
    } else {
      rectangle.copyFromBounds(this);
    }
    return rectangle;
  }
  /** Clears the bounds and resets. */
  clear() {
    this.minX = Infinity;
    this.minY = Infinity;
    this.maxX = -Infinity;
    this.maxY = -Infinity;
    this.matrix = defaultMatrix;
    return this;
  }
  /**
   * Sets the bounds.
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   */
  set(x0, y0, x1, y1) {
    this.minX = x0;
    this.minY = y0;
    this.maxX = x1;
    this.maxY = y1;
  }
  /**
   * Adds sprite frame
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   * @param matrix
   */
  addFrame(x0, y0, x1, y1, matrix) {
    matrix || (matrix = this.matrix);
    const a2 = matrix.a;
    const b2 = matrix.b;
    const c2 = matrix.c;
    const d2 = matrix.d;
    const tx = matrix.tx;
    const ty = matrix.ty;
    let minX = this.minX;
    let minY = this.minY;
    let maxX = this.maxX;
    let maxY = this.maxY;
    let x2 = a2 * x0 + c2 * y0 + tx;
    let y2 = b2 * x0 + d2 * y0 + ty;
    if (x2 < minX)
      minX = x2;
    if (y2 < minY)
      minY = y2;
    if (x2 > maxX)
      maxX = x2;
    if (y2 > maxY)
      maxY = y2;
    x2 = a2 * x1 + c2 * y0 + tx;
    y2 = b2 * x1 + d2 * y0 + ty;
    if (x2 < minX)
      minX = x2;
    if (y2 < minY)
      minY = y2;
    if (x2 > maxX)
      maxX = x2;
    if (y2 > maxY)
      maxY = y2;
    x2 = a2 * x0 + c2 * y1 + tx;
    y2 = b2 * x0 + d2 * y1 + ty;
    if (x2 < minX)
      minX = x2;
    if (y2 < minY)
      minY = y2;
    if (x2 > maxX)
      maxX = x2;
    if (y2 > maxY)
      maxY = y2;
    x2 = a2 * x1 + c2 * y1 + tx;
    y2 = b2 * x1 + d2 * y1 + ty;
    if (x2 < minX)
      minX = x2;
    if (y2 < minY)
      minY = y2;
    if (x2 > maxX)
      maxX = x2;
    if (y2 > maxY)
      maxY = y2;
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }
  /**
   * Adds a rectangle to the bounds.
   * @param rect - The rectangle to be added.
   * @param matrix - The matrix to apply to the bounds.
   */
  addRect(rect, matrix) {
    this.addFrame(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height, matrix);
  }
  /**
   * Adds other {@link Bounds}.
   * @param bounds - The Bounds to be added
   * @param matrix
   */
  addBounds(bounds, matrix) {
    this.addFrame(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY, matrix);
  }
  /**
   * Adds other Bounds, masked with Bounds.
   * @param mask - The Bounds to be added.
   */
  addBoundsMask(mask) {
    this.minX = this.minX > mask.minX ? this.minX : mask.minX;
    this.minY = this.minY > mask.minY ? this.minY : mask.minY;
    this.maxX = this.maxX < mask.maxX ? this.maxX : mask.maxX;
    this.maxY = this.maxY < mask.maxY ? this.maxY : mask.maxY;
  }
  /**
   * Adds other Bounds, multiplied with matrix.
   * @param matrix - The matrix to apply to the bounds.
   */
  applyMatrix(matrix) {
    const minX = this.minX;
    const minY = this.minY;
    const maxX = this.maxX;
    const maxY = this.maxY;
    const { a: a2, b: b2, c: c2, d: d2, tx, ty } = matrix;
    let x2 = a2 * minX + c2 * minY + tx;
    let y2 = b2 * minX + d2 * minY + ty;
    this.minX = x2;
    this.minY = y2;
    this.maxX = x2;
    this.maxY = y2;
    x2 = a2 * maxX + c2 * minY + tx;
    y2 = b2 * maxX + d2 * minY + ty;
    this.minX = x2 < this.minX ? x2 : this.minX;
    this.minY = y2 < this.minY ? y2 : this.minY;
    this.maxX = x2 > this.maxX ? x2 : this.maxX;
    this.maxY = y2 > this.maxY ? y2 : this.maxY;
    x2 = a2 * minX + c2 * maxY + tx;
    y2 = b2 * minX + d2 * maxY + ty;
    this.minX = x2 < this.minX ? x2 : this.minX;
    this.minY = y2 < this.minY ? y2 : this.minY;
    this.maxX = x2 > this.maxX ? x2 : this.maxX;
    this.maxY = y2 > this.maxY ? y2 : this.maxY;
    x2 = a2 * maxX + c2 * maxY + tx;
    y2 = b2 * maxX + d2 * maxY + ty;
    this.minX = x2 < this.minX ? x2 : this.minX;
    this.minY = y2 < this.minY ? y2 : this.minY;
    this.maxX = x2 > this.maxX ? x2 : this.maxX;
    this.maxY = y2 > this.maxY ? y2 : this.maxY;
  }
  /**
   * Resizes the bounds object to include the given rectangle.
   * @param rect - The rectangle to be included.
   */
  fit(rect) {
    if (this.minX < rect.left)
      this.minX = rect.left;
    if (this.maxX > rect.right)
      this.maxX = rect.right;
    if (this.minY < rect.top)
      this.minY = rect.top;
    if (this.maxY > rect.bottom)
      this.maxY = rect.bottom;
    return this;
  }
  /**
   * Resizes the bounds object to include the given bounds.
   * @param left - The left value of the bounds.
   * @param right - The right value of the bounds.
   * @param top - The top value of the bounds.
   * @param bottom - The bottom value of the bounds.
   */
  fitBounds(left, right, top, bottom) {
    if (this.minX < left)
      this.minX = left;
    if (this.maxX > right)
      this.maxX = right;
    if (this.minY < top)
      this.minY = top;
    if (this.maxY > bottom)
      this.maxY = bottom;
    return this;
  }
  /**
   * Pads bounds object, making it grow in all directions.
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @param paddingX - The horizontal padding amount.
   * @param paddingY - The vertical padding amount.
   */
  pad(paddingX, paddingY = paddingX) {
    this.minX -= paddingX;
    this.maxX += paddingX;
    this.minY -= paddingY;
    this.maxY += paddingY;
    return this;
  }
  /** Ceils the bounds. */
  ceil() {
    this.minX = Math.floor(this.minX);
    this.minY = Math.floor(this.minY);
    this.maxX = Math.ceil(this.maxX);
    this.maxY = Math.ceil(this.maxY);
    return this;
  }
  /** Clones the bounds. */
  clone() {
    return new Bounds(this.minX, this.minY, this.maxX, this.maxY);
  }
  /**
   * Scales the bounds by the given values
   * @param x - The X value to scale by.
   * @param y - The Y value to scale by.
   */
  scale(x2, y2 = x2) {
    this.minX *= x2;
    this.minY *= y2;
    this.maxX *= x2;
    this.maxY *= y2;
    return this;
  }
  /** the x value of the bounds. */
  get x() {
    return this.minX;
  }
  set x(value) {
    const width = this.maxX - this.minX;
    this.minX = value;
    this.maxX = value + width;
  }
  /** the y value of the bounds. */
  get y() {
    return this.minY;
  }
  set y(value) {
    const height = this.maxY - this.minY;
    this.minY = value;
    this.maxY = value + height;
  }
  /** the width value of the bounds. */
  get width() {
    return this.maxX - this.minX;
  }
  set width(value) {
    this.maxX = this.minX + value;
  }
  /** the height value of the bounds. */
  get height() {
    return this.maxY - this.minY;
  }
  set height(value) {
    this.maxY = this.minY + value;
  }
  /** the left value of the bounds. */
  get left() {
    return this.minX;
  }
  /** the right value of the bounds. */
  get right() {
    return this.maxX;
  }
  /** the top value of the bounds. */
  get top() {
    return this.minY;
  }
  /** the bottom value of the bounds. */
  get bottom() {
    return this.maxY;
  }
  /** Is the bounds positive. */
  get isPositive() {
    return this.maxX - this.minX > 0 && this.maxY - this.minY > 0;
  }
  get isValid() {
    return this.minX + this.minY !== Infinity;
  }
  /**
   * Adds screen vertices from array
   * @param vertexData - calculated vertices
   * @param beginOffset - begin offset
   * @param endOffset - end offset, excluded
   * @param matrix
   */
  addVertexData(vertexData, beginOffset, endOffset, matrix) {
    let minX = this.minX;
    let minY = this.minY;
    let maxX = this.maxX;
    let maxY = this.maxY;
    matrix || (matrix = this.matrix);
    const a2 = matrix.a;
    const b2 = matrix.b;
    const c2 = matrix.c;
    const d2 = matrix.d;
    const tx = matrix.tx;
    const ty = matrix.ty;
    for (let i2 = beginOffset; i2 < endOffset; i2 += 2) {
      const localX = vertexData[i2];
      const localY = vertexData[i2 + 1];
      const x2 = a2 * localX + c2 * localY + tx;
      const y2 = b2 * localX + d2 * localY + ty;
      minX = x2 < minX ? x2 : minX;
      minY = y2 < minY ? y2 : minY;
      maxX = x2 > maxX ? x2 : maxX;
      maxY = y2 > maxY ? y2 : maxY;
    }
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }
  /**
   * Checks if the point is contained within the bounds.
   * @param x - x coordinate
   * @param y - y coordinate
   */
  containsPoint(x2, y2) {
    if (this.minX <= x2 && this.minY <= y2 && this.maxX >= x2 && this.maxY >= y2) {
      return true;
    }
    return false;
  }
  toString() {
    return `[pixi.js:Bounds minX=${this.minX} minY=${this.minY} maxX=${this.maxX} maxY=${this.maxY} width=${this.width} height=${this.height}]`;
  }
  /**
   * Copies the bounds from another bounds object.
   * @param bounds - The bounds to copy from.
   * @returns - This bounds object.
   */
  copyFrom(bounds) {
    this.minX = bounds.minX;
    this.minY = bounds.minY;
    this.maxX = bounds.maxX;
    this.maxY = bounds.maxY;
    return this;
  }
}
var r = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) }, t = function(r2) {
  return "string" == typeof r2 ? r2.length > 0 : "number" == typeof r2;
}, n = function(r2, t2, n2) {
  return void 0 === t2 && (t2 = 0), void 0 === n2 && (n2 = Math.pow(10, t2)), Math.round(n2 * r2) / n2 + 0;
}, e = function(r2, t2, n2) {
  return void 0 === t2 && (t2 = 0), void 0 === n2 && (n2 = 1), r2 > n2 ? n2 : r2 > t2 ? r2 : t2;
}, u = function(r2) {
  return (r2 = isFinite(r2) ? r2 % 360 : 0) > 0 ? r2 : r2 + 360;
}, a = function(r2) {
  return { r: e(r2.r, 0, 255), g: e(r2.g, 0, 255), b: e(r2.b, 0, 255), a: e(r2.a) };
}, o = function(r2) {
  return { r: n(r2.r), g: n(r2.g), b: n(r2.b), a: n(r2.a, 3) };
}, i = /^#([0-9a-f]{3,8})$/i, s = function(r2) {
  var t2 = r2.toString(16);
  return t2.length < 2 ? "0" + t2 : t2;
}, h = function(r2) {
  var t2 = r2.r, n2 = r2.g, e2 = r2.b, u2 = r2.a, a2 = Math.max(t2, n2, e2), o2 = a2 - Math.min(t2, n2, e2), i2 = o2 ? a2 === t2 ? (n2 - e2) / o2 : a2 === n2 ? 2 + (e2 - t2) / o2 : 4 + (t2 - n2) / o2 : 0;
  return { h: 60 * (i2 < 0 ? i2 + 6 : i2), s: a2 ? o2 / a2 * 100 : 0, v: a2 / 255 * 100, a: u2 };
}, b = function(r2) {
  var t2 = r2.h, n2 = r2.s, e2 = r2.v, u2 = r2.a;
  t2 = t2 / 360 * 6, n2 /= 100, e2 /= 100;
  var a2 = Math.floor(t2), o2 = e2 * (1 - n2), i2 = e2 * (1 - (t2 - a2) * n2), s2 = e2 * (1 - (1 - t2 + a2) * n2), h2 = a2 % 6;
  return { r: 255 * [e2, i2, o2, o2, s2, e2][h2], g: 255 * [s2, e2, e2, i2, o2, o2][h2], b: 255 * [o2, o2, s2, e2, e2, i2][h2], a: u2 };
}, g = function(r2) {
  return { h: u(r2.h), s: e(r2.s, 0, 100), l: e(r2.l, 0, 100), a: e(r2.a) };
}, d = function(r2) {
  return { h: n(r2.h), s: n(r2.s), l: n(r2.l), a: n(r2.a, 3) };
}, f = function(r2) {
  return b((n2 = (t2 = r2).s, { h: t2.h, s: (n2 *= ((e2 = t2.l) < 50 ? e2 : 100 - e2) / 100) > 0 ? 2 * n2 / (e2 + n2) * 100 : 0, v: e2 + n2, a: t2.a }));
  var t2, n2, e2;
}, c = function(r2) {
  return { h: (t2 = h(r2)).h, s: (u2 = (200 - (n2 = t2.s)) * (e2 = t2.v) / 100) > 0 && u2 < 200 ? n2 * e2 / 100 / (u2 <= 100 ? u2 : 200 - u2) * 100 : 0, l: u2 / 2, a: t2.a };
  var t2, n2, e2, u2;
}, l = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, p = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, v = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, m = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, y = { string: [[function(r2) {
  var t2 = i.exec(r2);
  return t2 ? (r2 = t2[1]).length <= 4 ? { r: parseInt(r2[0] + r2[0], 16), g: parseInt(r2[1] + r2[1], 16), b: parseInt(r2[2] + r2[2], 16), a: 4 === r2.length ? n(parseInt(r2[3] + r2[3], 16) / 255, 2) : 1 } : 6 === r2.length || 8 === r2.length ? { r: parseInt(r2.substr(0, 2), 16), g: parseInt(r2.substr(2, 2), 16), b: parseInt(r2.substr(4, 2), 16), a: 8 === r2.length ? n(parseInt(r2.substr(6, 2), 16) / 255, 2) : 1 } : null : null;
}, "hex"], [function(r2) {
  var t2 = v.exec(r2) || m.exec(r2);
  return t2 ? t2[2] !== t2[4] || t2[4] !== t2[6] ? null : a({ r: Number(t2[1]) / (t2[2] ? 100 / 255 : 1), g: Number(t2[3]) / (t2[4] ? 100 / 255 : 1), b: Number(t2[5]) / (t2[6] ? 100 / 255 : 1), a: void 0 === t2[7] ? 1 : Number(t2[7]) / (t2[8] ? 100 : 1) }) : null;
}, "rgb"], [function(t2) {
  var n2 = l.exec(t2) || p.exec(t2);
  if (!n2) return null;
  var e2, u2, a2 = g({ h: (e2 = n2[1], u2 = n2[2], void 0 === u2 && (u2 = "deg"), Number(e2) * (r[u2] || 1)), s: Number(n2[3]), l: Number(n2[4]), a: void 0 === n2[5] ? 1 : Number(n2[5]) / (n2[6] ? 100 : 1) });
  return f(a2);
}, "hsl"]], object: [[function(r2) {
  var n2 = r2.r, e2 = r2.g, u2 = r2.b, o2 = r2.a, i2 = void 0 === o2 ? 1 : o2;
  return t(n2) && t(e2) && t(u2) ? a({ r: Number(n2), g: Number(e2), b: Number(u2), a: Number(i2) }) : null;
}, "rgb"], [function(r2) {
  var n2 = r2.h, e2 = r2.s, u2 = r2.l, a2 = r2.a, o2 = void 0 === a2 ? 1 : a2;
  if (!t(n2) || !t(e2) || !t(u2)) return null;
  var i2 = g({ h: Number(n2), s: Number(e2), l: Number(u2), a: Number(o2) });
  return f(i2);
}, "hsl"], [function(r2) {
  var n2 = r2.h, a2 = r2.s, o2 = r2.v, i2 = r2.a, s2 = void 0 === i2 ? 1 : i2;
  if (!t(n2) || !t(a2) || !t(o2)) return null;
  var h2 = function(r3) {
    return { h: u(r3.h), s: e(r3.s, 0, 100), v: e(r3.v, 0, 100), a: e(r3.a) };
  }({ h: Number(n2), s: Number(a2), v: Number(o2), a: Number(s2) });
  return b(h2);
}, "hsv"]] }, N = function(r2, t2) {
  for (var n2 = 0; n2 < t2.length; n2++) {
    var e2 = t2[n2][0](r2);
    if (e2) return [e2, t2[n2][1]];
  }
  return [null, void 0];
}, x = function(r2) {
  return "string" == typeof r2 ? N(r2.trim(), y.string) : "object" == typeof r2 && null !== r2 ? N(r2, y.object) : [null, void 0];
}, M = function(r2, t2) {
  var n2 = c(r2);
  return { h: n2.h, s: e(n2.s + 100 * t2, 0, 100), l: n2.l, a: n2.a };
}, H = function(r2) {
  return (299 * r2.r + 587 * r2.g + 114 * r2.b) / 1e3 / 255;
}, $ = function(r2, t2) {
  var n2 = c(r2);
  return { h: n2.h, s: n2.s, l: e(n2.l + 100 * t2, 0, 100), a: n2.a };
}, j = function() {
  function r2(r3) {
    this.parsed = x(r3)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  return r2.prototype.isValid = function() {
    return null !== this.parsed;
  }, r2.prototype.brightness = function() {
    return n(H(this.rgba), 2);
  }, r2.prototype.isDark = function() {
    return H(this.rgba) < 0.5;
  }, r2.prototype.isLight = function() {
    return H(this.rgba) >= 0.5;
  }, r2.prototype.toHex = function() {
    return r3 = o(this.rgba), t2 = r3.r, e2 = r3.g, u2 = r3.b, i2 = (a2 = r3.a) < 1 ? s(n(255 * a2)) : "", "#" + s(t2) + s(e2) + s(u2) + i2;
    var r3, t2, e2, u2, a2, i2;
  }, r2.prototype.toRgb = function() {
    return o(this.rgba);
  }, r2.prototype.toRgbString = function() {
    return r3 = o(this.rgba), t2 = r3.r, n2 = r3.g, e2 = r3.b, (u2 = r3.a) < 1 ? "rgba(" + t2 + ", " + n2 + ", " + e2 + ", " + u2 + ")" : "rgb(" + t2 + ", " + n2 + ", " + e2 + ")";
    var r3, t2, n2, e2, u2;
  }, r2.prototype.toHsl = function() {
    return d(c(this.rgba));
  }, r2.prototype.toHslString = function() {
    return r3 = d(c(this.rgba)), t2 = r3.h, n2 = r3.s, e2 = r3.l, (u2 = r3.a) < 1 ? "hsla(" + t2 + ", " + n2 + "%, " + e2 + "%, " + u2 + ")" : "hsl(" + t2 + ", " + n2 + "%, " + e2 + "%)";
    var r3, t2, n2, e2, u2;
  }, r2.prototype.toHsv = function() {
    return r3 = h(this.rgba), { h: n(r3.h), s: n(r3.s), v: n(r3.v), a: n(r3.a, 3) };
    var r3;
  }, r2.prototype.invert = function() {
    return w({ r: 255 - (r3 = this.rgba).r, g: 255 - r3.g, b: 255 - r3.b, a: r3.a });
    var r3;
  }, r2.prototype.saturate = function(r3) {
    return void 0 === r3 && (r3 = 0.1), w(M(this.rgba, r3));
  }, r2.prototype.desaturate = function(r3) {
    return void 0 === r3 && (r3 = 0.1), w(M(this.rgba, -r3));
  }, r2.prototype.grayscale = function() {
    return w(M(this.rgba, -1));
  }, r2.prototype.lighten = function(r3) {
    return void 0 === r3 && (r3 = 0.1), w($(this.rgba, r3));
  }, r2.prototype.darken = function(r3) {
    return void 0 === r3 && (r3 = 0.1), w($(this.rgba, -r3));
  }, r2.prototype.rotate = function(r3) {
    return void 0 === r3 && (r3 = 15), this.hue(this.hue() + r3);
  }, r2.prototype.alpha = function(r3) {
    return "number" == typeof r3 ? w({ r: (t2 = this.rgba).r, g: t2.g, b: t2.b, a: r3 }) : n(this.rgba.a, 3);
    var t2;
  }, r2.prototype.hue = function(r3) {
    var t2 = c(this.rgba);
    return "number" == typeof r3 ? w({ h: r3, s: t2.s, l: t2.l, a: t2.a }) : n(t2.h);
  }, r2.prototype.isEqual = function(r3) {
    return this.toHex() === w(r3).toHex();
  }, r2;
}(), w = function(r2) {
  return r2 instanceof j ? r2 : new j(r2);
}, S = [], k = function(r2) {
  r2.forEach(function(r3) {
    S.indexOf(r3) < 0 && (r3(j, y), S.push(r3));
  });
};
function namesPlugin(e2, f2) {
  var a2 = { white: "#ffffff", bisque: "#ffe4c4", blue: "#0000ff", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", antiquewhite: "#faebd7", aqua: "#00ffff", azure: "#f0ffff", whitesmoke: "#f5f5f5", papayawhip: "#ffefd5", plum: "#dda0dd", blanchedalmond: "#ffebcd", black: "#000000", gold: "#ffd700", goldenrod: "#daa520", gainsboro: "#dcdcdc", cornsilk: "#fff8dc", cornflowerblue: "#6495ed", burlywood: "#deb887", aquamarine: "#7fffd4", beige: "#f5f5dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkkhaki: "#bdb76b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", peachpuff: "#ffdab9", darkmagenta: "#8b008b", darkred: "#8b0000", darkorchid: "#9932cc", darkorange: "#ff8c00", darkslateblue: "#483d8b", gray: "#808080", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", deeppink: "#ff1493", deepskyblue: "#00bfff", wheat: "#f5deb3", firebrick: "#b22222", floralwhite: "#fffaf0", ghostwhite: "#f8f8ff", darkviolet: "#9400d3", magenta: "#ff00ff", green: "#008000", dodgerblue: "#1e90ff", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", blueviolet: "#8a2be2", forestgreen: "#228b22", lawngreen: "#7cfc00", indianred: "#cd5c5c", indigo: "#4b0082", fuchsia: "#ff00ff", brown: "#a52a2a", maroon: "#800000", mediumblue: "#0000cd", lightcoral: "#f08080", darkturquoise: "#00ced1", lightcyan: "#e0ffff", ivory: "#fffff0", lightyellow: "#ffffe0", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", linen: "#faf0e6", mediumaquamarine: "#66cdaa", lemonchiffon: "#fffacd", lime: "#00ff00", khaki: "#f0e68c", mediumseagreen: "#3cb371", limegreen: "#32cd32", mediumspringgreen: "#00fa9a", lightskyblue: "#87cefa", lightblue: "#add8e6", midnightblue: "#191970", lightpink: "#ffb6c1", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", mintcream: "#f5fffa", lightslategray: "#778899", lightslategrey: "#778899", navajowhite: "#ffdead", navy: "#000080", mediumvioletred: "#c71585", powderblue: "#b0e0e6", palegoldenrod: "#eee8aa", oldlace: "#fdf5e6", paleturquoise: "#afeeee", mediumturquoise: "#48d1cc", mediumorchid: "#ba55d3", rebeccapurple: "#663399", lightsteelblue: "#b0c4de", mediumslateblue: "#7b68ee", thistle: "#d8bfd8", tan: "#d2b48c", orchid: "#da70d6", mediumpurple: "#9370db", purple: "#800080", pink: "#ffc0cb", skyblue: "#87ceeb", springgreen: "#00ff7f", palegreen: "#98fb98", red: "#ff0000", yellow: "#ffff00", slateblue: "#6a5acd", lavenderblush: "#fff0f5", peru: "#cd853f", palevioletred: "#db7093", violet: "#ee82ee", teal: "#008080", slategray: "#708090", slategrey: "#708090", aliceblue: "#f0f8ff", darkseagreen: "#8fbc8f", darkolivegreen: "#556b2f", greenyellow: "#adff2f", seagreen: "#2e8b57", seashell: "#fff5ee", tomato: "#ff6347", silver: "#c0c0c0", sienna: "#a0522d", lavender: "#e6e6fa", lightgreen: "#90ee90", orange: "#ffa500", orangered: "#ff4500", steelblue: "#4682b4", royalblue: "#4169e1", turquoise: "#40e0d0", yellowgreen: "#9acd32", salmon: "#fa8072", saddlebrown: "#8b4513", sandybrown: "#f4a460", rosybrown: "#bc8f8f", darksalmon: "#e9967a", lightgoldenrodyellow: "#fafad2", snow: "#fffafa", lightgrey: "#d3d3d3", lightgray: "#d3d3d3", dimgray: "#696969", dimgrey: "#696969", olivedrab: "#6b8e23", olive: "#808000" }, r2 = {};
  for (var d2 in a2) r2[a2[d2]] = d2;
  var l2 = {};
  e2.prototype.toName = function(f3) {
    if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b)) return "transparent";
    var d3, i2, n2 = r2[this.toHex()];
    if (n2) return n2;
    if (null == f3 ? void 0 : f3.closest) {
      var o2 = this.toRgb(), t2 = 1 / 0, b2 = "black";
      if (!l2.length) for (var c2 in a2) l2[c2] = new e2(a2[c2]).toRgb();
      for (var g2 in a2) {
        var u2 = (d3 = o2, i2 = l2[g2], Math.pow(d3.r - i2.r, 2) + Math.pow(d3.g - i2.g, 2) + Math.pow(d3.b - i2.b, 2));
        u2 < t2 && (t2 = u2, b2 = g2);
      }
      return b2;
    }
  };
  f2.string.push([function(f3) {
    var r3 = f3.toLowerCase(), d3 = "transparent" === r3 ? "#0000" : a2[r3];
    return d3 ? new e2(d3).toRgb() : null;
  }, "name"]);
}
k([namesPlugin]);
const _Color = class _Color2 {
  /**
   * @param {ColorSource} value - Optional value to use, if not provided, white is used.
   */
  constructor(value = 16777215) {
    this._value = null;
    this._components = new Float32Array(4);
    this._components.fill(1);
    this._int = 16777215;
    this.value = value;
  }
  /** Get red component (0 - 1) */
  get red() {
    return this._components[0];
  }
  /** Get green component (0 - 1) */
  get green() {
    return this._components[1];
  }
  /** Get blue component (0 - 1) */
  get blue() {
    return this._components[2];
  }
  /** Get alpha component (0 - 1) */
  get alpha() {
    return this._components[3];
  }
  /**
   * Set the value, suitable for chaining
   * @param value
   * @see Color.value
   */
  setValue(value) {
    this.value = value;
    return this;
  }
  /**
   * The current color source.
   *
   * When setting:
   * - Setting to an instance of `Color` will copy its color source and components.
   * - Otherwise, `Color` will try to normalize the color source and set the components.
   *   If the color source is invalid, an `Error` will be thrown and the `Color` will left unchanged.
   *
   * Note: The `null` in the setter's parameter type is added to match the TypeScript rule: return type of getter
   * must be assignable to its setter's parameter type. Setting `value` to `null` will throw an `Error`.
   *
   * When getting:
   * - A return value of `null` means the previous value was overridden (e.g., {@link Color.multiply multiply},
   *   {@link Color.premultiply premultiply} or {@link Color.round round}).
   * - Otherwise, the color source used when setting is returned.
   */
  set value(value) {
    if (value instanceof _Color2) {
      this._value = this._cloneSource(value._value);
      this._int = value._int;
      this._components.set(value._components);
    } else if (value === null) {
      throw new Error("Cannot set Color#value to null");
    } else if (this._value === null || !this._isSourceEqual(this._value, value)) {
      this._value = this._cloneSource(value);
      this._normalize(this._value);
    }
  }
  get value() {
    return this._value;
  }
  /**
   * Copy a color source internally.
   * @param value - Color source
   */
  _cloneSource(value) {
    if (typeof value === "string" || typeof value === "number" || value instanceof Number || value === null) {
      return value;
    } else if (Array.isArray(value) || ArrayBuffer.isView(value)) {
      return value.slice(0);
    } else if (typeof value === "object" && value !== null) {
      return { ...value };
    }
    return value;
  }
  /**
   * Equality check for color sources.
   * @param value1 - First color source
   * @param value2 - Second color source
   * @returns `true` if the color sources are equal, `false` otherwise.
   */
  _isSourceEqual(value1, value2) {
    const type1 = typeof value1;
    const type2 = typeof value2;
    if (type1 !== type2) {
      return false;
    } else if (type1 === "number" || type1 === "string" || value1 instanceof Number) {
      return value1 === value2;
    } else if (Array.isArray(value1) && Array.isArray(value2) || ArrayBuffer.isView(value1) && ArrayBuffer.isView(value2)) {
      if (value1.length !== value2.length) {
        return false;
      }
      return value1.every((v2, i2) => v2 === value2[i2]);
    } else if (value1 !== null && value2 !== null) {
      const keys1 = Object.keys(value1);
      const keys2 = Object.keys(value2);
      if (keys1.length !== keys2.length) {
        return false;
      }
      return keys1.every((key) => value1[key] === value2[key]);
    }
    return value1 === value2;
  }
  /**
   * Convert to a RGBA color object.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toRgb(); // returns { r: 1, g: 1, b: 1, a: 1 }
   */
  toRgba() {
    const [r2, g2, b2, a2] = this._components;
    return { r: r2, g: g2, b: b2, a: a2 };
  }
  /**
   * Convert to a RGB color object.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toRgb(); // returns { r: 1, g: 1, b: 1 }
   */
  toRgb() {
    const [r2, g2, b2] = this._components;
    return { r: r2, g: g2, b: b2 };
  }
  /** Convert to a CSS-style rgba string: `rgba(255,255,255,1.0)`. */
  toRgbaString() {
    const [r2, g2, b2] = this.toUint8RgbArray();
    return `rgba(${r2},${g2},${b2},${this.alpha})`;
  }
  toUint8RgbArray(out) {
    const [r2, g2, b2] = this._components;
    if (!this._arrayRgb) {
      this._arrayRgb = [];
    }
    out || (out = this._arrayRgb);
    out[0] = Math.round(r2 * 255);
    out[1] = Math.round(g2 * 255);
    out[2] = Math.round(b2 * 255);
    return out;
  }
  toArray(out) {
    if (!this._arrayRgba) {
      this._arrayRgba = [];
    }
    out || (out = this._arrayRgba);
    const [r2, g2, b2, a2] = this._components;
    out[0] = r2;
    out[1] = g2;
    out[2] = b2;
    out[3] = a2;
    return out;
  }
  toRgbArray(out) {
    if (!this._arrayRgb) {
      this._arrayRgb = [];
    }
    out || (out = this._arrayRgb);
    const [r2, g2, b2] = this._components;
    out[0] = r2;
    out[1] = g2;
    out[2] = b2;
    return out;
  }
  /**
   * Convert to a hexadecimal number.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toNumber(); // returns 16777215
   */
  toNumber() {
    return this._int;
  }
  /**
   * Convert to a BGR number
   * @example
   * import { Color } from 'pixi.js';
   * new Color(0xffcc99).toBgrNumber(); // returns 0x99ccff
   */
  toBgrNumber() {
    const [r2, g2, b2] = this.toUint8RgbArray();
    return (b2 << 16) + (g2 << 8) + r2;
  }
  /**
   * Convert to a hexadecimal number in little endian format (e.g., BBGGRR).
   * @example
   * import { Color } from 'pixi.js';
   * new Color(0xffcc99).toLittleEndianNumber(); // returns 0x99ccff
   * @returns {number} - The color as a number in little endian format.
   */
  toLittleEndianNumber() {
    const value = this._int;
    return (value >> 16) + (value & 65280) + ((value & 255) << 16);
  }
  /**
   * Multiply with another color. This action is destructive, and will
   * override the previous `value` property to be `null`.
   * @param {ColorSource} value - The color to multiply by.
   */
  multiply(value) {
    const [r2, g2, b2, a2] = _Color2._temp.setValue(value)._components;
    this._components[0] *= r2;
    this._components[1] *= g2;
    this._components[2] *= b2;
    this._components[3] *= a2;
    this._refreshInt();
    this._value = null;
    return this;
  }
  /**
   * Converts color to a premultiplied alpha format. This action is destructive, and will
   * override the previous `value` property to be `null`.
   * @param alpha - The alpha to multiply by.
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels.
   * @returns {Color} - Itself.
   */
  premultiply(alpha, applyToRGB = true) {
    if (applyToRGB) {
      this._components[0] *= alpha;
      this._components[1] *= alpha;
      this._components[2] *= alpha;
    }
    this._components[3] = alpha;
    this._refreshInt();
    this._value = null;
    return this;
  }
  /**
   * Premultiplies alpha with current color.
   * @param {number} alpha - The alpha to multiply by.
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels.
   * @returns {number} tint multiplied by alpha
   */
  toPremultiplied(alpha, applyToRGB = true) {
    if (alpha === 1) {
      return (255 << 24) + this._int;
    }
    if (alpha === 0) {
      return applyToRGB ? 0 : this._int;
    }
    let r2 = this._int >> 16 & 255;
    let g2 = this._int >> 8 & 255;
    let b2 = this._int & 255;
    if (applyToRGB) {
      r2 = r2 * alpha + 0.5 | 0;
      g2 = g2 * alpha + 0.5 | 0;
      b2 = b2 * alpha + 0.5 | 0;
    }
    return (alpha * 255 << 24) + (r2 << 16) + (g2 << 8) + b2;
  }
  /**
   * Convert to a hexadecimal string.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toHex(); // returns "#ffffff"
   */
  toHex() {
    const hexString = this._int.toString(16);
    return `#${"000000".substring(0, 6 - hexString.length) + hexString}`;
  }
  /**
   * Convert to a hexadecimal string with alpha.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toHexa(); // returns "#ffffffff"
   */
  toHexa() {
    const alphaValue = Math.round(this._components[3] * 255);
    const alphaString = alphaValue.toString(16);
    return this.toHex() + "00".substring(0, 2 - alphaString.length) + alphaString;
  }
  /**
   * Set alpha, suitable for chaining.
   * @param alpha
   */
  setAlpha(alpha) {
    this._components[3] = this._clamp(alpha);
    return this;
  }
  /**
   * Normalize the input value into rgba
   * @param value - Input value
   */
  _normalize(value) {
    let r2;
    let g2;
    let b2;
    let a2;
    if ((typeof value === "number" || value instanceof Number) && value >= 0 && value <= 16777215) {
      const int = value;
      r2 = (int >> 16 & 255) / 255;
      g2 = (int >> 8 & 255) / 255;
      b2 = (int & 255) / 255;
      a2 = 1;
    } else if ((Array.isArray(value) || value instanceof Float32Array) && value.length >= 3 && value.length <= 4) {
      value = this._clamp(value);
      [r2, g2, b2, a2 = 1] = value;
    } else if ((value instanceof Uint8Array || value instanceof Uint8ClampedArray) && value.length >= 3 && value.length <= 4) {
      value = this._clamp(value, 0, 255);
      [r2, g2, b2, a2 = 255] = value;
      r2 /= 255;
      g2 /= 255;
      b2 /= 255;
      a2 /= 255;
    } else if (typeof value === "string" || typeof value === "object") {
      if (typeof value === "string") {
        const match = _Color2.HEX_PATTERN.exec(value);
        if (match) {
          value = `#${match[2]}`;
        }
      }
      const color = w(value);
      if (color.isValid()) {
        ({ r: r2, g: g2, b: b2, a: a2 } = color.rgba);
        r2 /= 255;
        g2 /= 255;
        b2 /= 255;
      }
    }
    if (r2 !== void 0) {
      this._components[0] = r2;
      this._components[1] = g2;
      this._components[2] = b2;
      this._components[3] = a2;
      this._refreshInt();
    } else {
      throw new Error(`Unable to convert color ${value}`);
    }
  }
  /** Refresh the internal color rgb number */
  _refreshInt() {
    this._clamp(this._components);
    const [r2, g2, b2] = this._components;
    this._int = (r2 * 255 << 16) + (g2 * 255 << 8) + (b2 * 255 | 0);
  }
  /**
   * Clamps values to a range. Will override original values
   * @param value - Value(s) to clamp
   * @param min - Minimum value
   * @param max - Maximum value
   */
  _clamp(value, min = 0, max = 1) {
    if (typeof value === "number") {
      return Math.min(Math.max(value, min), max);
    }
    value.forEach((v2, i2) => {
      value[i2] = Math.min(Math.max(v2, min), max);
    });
    return value;
  }
  /**
   * Check if the value is a color-like object
   * @param value - Value to check
   * @returns True if the value is a color-like object
   * @static
   * @example
   * import { Color } from 'pixi.js';
   * Color.isColorLike('white'); // returns true
   * Color.isColorLike(0xffffff); // returns true
   * Color.isColorLike([1, 1, 1]); // returns true
   */
  static isColorLike(value) {
    return typeof value === "number" || typeof value === "string" || value instanceof Number || value instanceof _Color2 || Array.isArray(value) || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Float32Array || value.r !== void 0 && value.g !== void 0 && value.b !== void 0 || value.r !== void 0 && value.g !== void 0 && value.b !== void 0 && value.a !== void 0 || value.h !== void 0 && value.s !== void 0 && value.l !== void 0 || value.h !== void 0 && value.s !== void 0 && value.l !== void 0 && value.a !== void 0 || value.h !== void 0 && value.s !== void 0 && value.v !== void 0 || value.h !== void 0 && value.s !== void 0 && value.v !== void 0 && value.a !== void 0;
  }
};
_Color.shared = new _Color();
_Color._temp = new _Color();
_Color.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
let Color = _Color;
const cullingMixin = {
  cullArea: null,
  cullable: false,
  cullableChildren: true
};
class Pool {
  /**
   * Constructs a new Pool.
   * @param ClassType - The constructor of the items in the pool.
   * @param {number} [initialSize] - The initial size of the pool.
   */
  constructor(ClassType, initialSize) {
    this._pool = [];
    this._count = 0;
    this._index = 0;
    this._classType = ClassType;
    if (initialSize) {
      this.prepopulate(initialSize);
    }
  }
  /**
   * Prepopulates the pool with a given number of items.
   * @param total - The number of items to add to the pool.
   */
  prepopulate(total) {
    for (let i2 = 0; i2 < total; i2++) {
      this._pool[this._index++] = new this._classType();
    }
    this._count += total;
  }
  /**
   * Gets an item from the pool. Calls the item's `init` method if it exists.
   * If there are no items left in the pool, a new one will be created.
   * @param {unknown} [data] - Optional data to pass to the item's constructor.
   * @returns {T} The item from the pool.
   */
  get(data) {
    var _a;
    let item;
    if (this._index > 0) {
      item = this._pool[--this._index];
    } else {
      item = new this._classType();
    }
    (_a = item.init) == null ? void 0 : _a.call(item, data);
    return item;
  }
  /**
   * Returns an item to the pool. Calls the item's `reset` method if it exists.
   * @param {T} item - The item to return to the pool.
   */
  return(item) {
    var _a;
    (_a = item.reset) == null ? void 0 : _a.call(item);
    this._pool[this._index++] = item;
  }
  /**
   * Gets the number of items in the pool.
   * @readonly
   * @member {number}
   */
  get totalSize() {
    return this._count;
  }
  /**
   * Gets the number of items in the pool that are free to use without needing to create more.
   * @readonly
   * @member {number}
   */
  get totalFree() {
    return this._index;
  }
  /**
   * Gets the number of items in the pool that are currently in use.
   * @readonly
   * @member {number}
   */
  get totalUsed() {
    return this._count - this._index;
  }
  /** clears the pool - mainly used for debugging! */
  clear() {
    this._pool.length = 0;
    this._index = 0;
  }
}
class PoolGroupClass {
  constructor() {
    this._poolsByClass = /* @__PURE__ */ new Map();
  }
  /**
   * Prepopulates a specific pool with a given number of items.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
   * @param {number} total - The number of items to add to the pool.
   */
  prepopulate(Class, total) {
    const classPool = this.getPool(Class);
    classPool.prepopulate(total);
  }
  /**
   * Gets an item from a specific pool.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
   * @param {unknown} [data] - Optional data to pass to the item's constructor.
   * @returns {T} The item from the pool.
   */
  get(Class, data) {
    const pool = this.getPool(Class);
    return pool.get(data);
  }
  /**
   * Returns an item to its respective pool.
   * @param {PoolItem} item - The item to return to the pool.
   */
  return(item) {
    const pool = this.getPool(item.constructor);
    pool.return(item);
  }
  /**
   * Gets a specific pool based on the class type.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} ClassType - The constructor of the items in the pool.
   * @returns {Pool<T>} The pool of the given class type.
   */
  getPool(ClassType) {
    if (!this._poolsByClass.has(ClassType)) {
      this._poolsByClass.set(ClassType, new Pool(ClassType));
    }
    return this._poolsByClass.get(ClassType);
  }
  /** gets the usage stats of each pool in the system */
  stats() {
    const stats = {};
    this._poolsByClass.forEach((pool) => {
      const name = stats[pool._classType.name] ? pool._classType.name + pool._classType.ID : pool._classType.name;
      stats[name] = {
        free: pool.totalFree,
        used: pool.totalUsed,
        size: pool.totalSize
      };
    });
    return stats;
  }
}
const BigPool = new PoolGroupClass();
const cacheAsTextureMixin = {
  /**
   * Is this container cached as a texture?
   * @readonly
   * @type {boolean}
   * @memberof scene.Container#
   */
  get isCachedAsTexture() {
    var _a;
    return !!((_a = this.renderGroup) == null ? void 0 : _a.isCachedAsTexture);
  },
  cacheAsTexture(val) {
    if (typeof val === "boolean" && val === false) {
      this.disableRenderGroup();
    } else {
      this.enableRenderGroup();
      this.renderGroup.enableCacheAsTexture(val === true ? {} : val);
    }
  },
  /**
   * Updates the cached texture. Will flag that this container's cached texture needs to be redrawn.
   * This will happen on the next render.
   * @memberof scene.Container#
   */
  updateCacheTexture() {
    var _a;
    (_a = this.renderGroup) == null ? void 0 : _a.updateCacheTexture();
  },
  /**
   * Allows backwards compatibility with pixi.js below version v8. Use `cacheAsTexture` instead.
   * @deprecated
   */
  get cacheAsBitmap() {
    return this.isCachedAsTexture;
  },
  /**
   * @deprecated
   */
  set cacheAsBitmap(val) {
    deprecation("v8.6.0", "cacheAsBitmap is deprecated, use cacheAsTexture instead.");
    this.cacheAsTexture(val);
  }
};
function removeItems(arr, startIdx, removeCount) {
  const length = arr.length;
  let i2;
  if (startIdx >= length || removeCount === 0) {
    return;
  }
  removeCount = startIdx + removeCount > length ? length - startIdx : removeCount;
  const len = length - removeCount;
  for (i2 = startIdx; i2 < len; ++i2) {
    arr[i2] = arr[i2 + removeCount];
  }
  arr.length = len;
}
const childrenHelperMixin = {
  allowChildren: true,
  /**
   * Removes all children from this container that are within the begin and end indexes.
   * @param beginIndex - The beginning position.
   * @param endIndex - The ending position. Default value is size of the container.
   * @returns - List of removed children
   * @memberof scene.Container#
   */
  removeChildren(beginIndex = 0, endIndex) {
    const end = endIndex ?? this.children.length;
    const range = end - beginIndex;
    const removed = [];
    if (range > 0 && range <= end) {
      for (let i2 = end - 1; i2 >= beginIndex; i2--) {
        const child = this.children[i2];
        if (!child)
          continue;
        removed.push(child);
        child.parent = null;
      }
      removeItems(this.children, beginIndex, end);
      const renderGroup = this.renderGroup || this.parentRenderGroup;
      if (renderGroup) {
        renderGroup.removeChildren(removed);
      }
      for (let i2 = 0; i2 < removed.length; ++i2) {
        this.emit("childRemoved", removed[i2], this, i2);
        removed[i2].emit("removed", this);
      }
      if (removed.length > 0) {
        this._didViewChangeTick++;
      }
      return removed;
    } else if (range === 0 && this.children.length === 0) {
      return removed;
    }
    throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
  },
  /**
   * Removes a child from the specified index position.
   * @param index - The index to get the child from
   * @returns The child that was removed.
   * @memberof scene.Container#
   */
  removeChildAt(index) {
    const child = this.getChildAt(index);
    return this.removeChild(child);
  },
  /**
   * Returns the child at the specified index
   * @param index - The index to get the child at
   * @returns - The child at the given index, if any.
   * @memberof scene.Container#
   */
  getChildAt(index) {
    if (index < 0 || index >= this.children.length) {
      throw new Error(`getChildAt: Index (${index}) does not exist.`);
    }
    return this.children[index];
  },
  /**
   * Changes the position of an existing child in the container
   * @param child - The child Container instance for which you want to change the index number
   * @param index - The resulting index number for the child container
   * @memberof scene.Container#
   */
  setChildIndex(child, index) {
    if (index < 0 || index >= this.children.length) {
      throw new Error(`The index ${index} supplied is out of bounds ${this.children.length}`);
    }
    this.getChildIndex(child);
    this.addChildAt(child, index);
  },
  /**
   * Returns the index position of a child Container instance
   * @param child - The Container instance to identify
   * @returns - The index position of the child container to identify
   * @memberof scene.Container#
   */
  getChildIndex(child) {
    const index = this.children.indexOf(child);
    if (index === -1) {
      throw new Error("The supplied Container must be a child of the caller");
    }
    return index;
  },
  /**
   * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown.
   * If the child is already in this container, it will be moved to the specified index.
   * @param {Container} child - The child to add.
   * @param {number} index - The absolute index where the child will be positioned at the end of the operation.
   * @returns {Container} The child that was added.
   * @memberof scene.Container#
   */
  addChildAt(child, index) {
    if (!this.allowChildren) {
      deprecation(v8_0_0, "addChildAt: Only Containers will be allowed to add children in v8.0.0");
    }
    const { children } = this;
    if (index < 0 || index > children.length) {
      throw new Error(`${child}addChildAt: The index ${index} supplied is out of bounds ${children.length}`);
    }
    if (child.parent) {
      const currentIndex = child.parent.children.indexOf(child);
      if (child.parent === this && currentIndex === index) {
        return child;
      }
      if (currentIndex !== -1) {
        child.parent.children.splice(currentIndex, 1);
      }
    }
    if (index === children.length) {
      children.push(child);
    } else {
      children.splice(index, 0, child);
    }
    child.parent = this;
    child.didChange = true;
    child._updateFlags = 15;
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (renderGroup) {
      renderGroup.addChild(child);
    }
    if (this.sortableChildren)
      this.sortDirty = true;
    this.emit("childAdded", child, this, index);
    child.emit("added", this);
    return child;
  },
  /**
   * Swaps the position of 2 Containers within this container.
   * @param child - First container to swap
   * @param child2 - Second container to swap
   * @memberof scene.Container#
   */
  swapChildren(child, child2) {
    if (child === child2) {
      return;
    }
    const index1 = this.getChildIndex(child);
    const index2 = this.getChildIndex(child2);
    this.children[index1] = child2;
    this.children[index2] = child;
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (renderGroup) {
      renderGroup.structureDidChange = true;
    }
    this._didContainerChangeTick++;
  },
  /**
   * Remove the Container from its parent Container. If the Container has no parent, do nothing.
   * @memberof scene.Container#
   */
  removeFromParent() {
    var _a;
    (_a = this.parent) == null ? void 0 : _a.removeChild(this);
  },
  /**
   * Reparent the child to this container, keeping the same worldTransform.
   * @param child - The child to reparent
   * @returns The first child that was reparented.
   * @memberof scene.Container#
   */
  reparentChild(...child) {
    if (child.length === 1) {
      return this.reparentChildAt(child[0], this.children.length);
    }
    child.forEach((c2) => this.reparentChildAt(c2, this.children.length));
    return child[0];
  },
  /**
   * Reparent the child to this container at the specified index, keeping the same worldTransform.
   * @param child - The child to reparent
   * @param index - The index to reparent the child to
   * @memberof scene.Container#
   */
  reparentChildAt(child, index) {
    if (child.parent === this) {
      this.setChildIndex(child, index);
      return child;
    }
    const childMat = child.worldTransform.clone();
    child.removeFromParent();
    this.addChildAt(child, index);
    const newMatrix = this.worldTransform.clone();
    newMatrix.invert();
    childMat.prepend(newMatrix);
    child.setFromMatrix(childMat);
    return child;
  }
};
const collectRenderablesMixin = {
  /**
   * Main method to collect renderables from the container and its children.
   * It checks the container's properties to decide whether to use a simple or advanced collection method.
   * @param {InstructionSet} instructionSet - The set of instructions to which the renderables will be added.
   * @param {Renderer} renderer - The renderer responsible for rendering the scene.
   * @param {IRenderLayer} currentLayer - The current render layer being processed.
   * @memberof scene.Container#
   */
  collectRenderables(instructionSet, renderer, currentLayer) {
    if (this.parentRenderLayer && this.parentRenderLayer !== currentLayer || this.globalDisplayStatus < 7 || !this.includeInBuild)
      return;
    if (this.sortableChildren) {
      this.sortChildren();
    }
    if (this.isSimple) {
      this.collectRenderablesSimple(instructionSet, renderer, currentLayer);
    } else if (this.renderGroup) {
      renderer.renderPipes.renderGroup.addRenderGroup(this.renderGroup, instructionSet);
    } else {
      this.collectRenderablesWithEffects(instructionSet, renderer, currentLayer);
    }
  },
  /**
   * Simple method for collecting renderables from the container's children.
   * This method is efficient and used when the container is marked as simple.
   * @param {InstructionSet} instructionSet - The set of instructions to which the renderables will be added.
   * @param {Renderer} renderer - The renderer responsible for rendering the scene.
   * @param {IRenderLayer} currentLayer - The current render layer being processed.
   * @memberof scene.Container#
   */
  collectRenderablesSimple(instructionSet, renderer, currentLayer) {
    const children = this.children;
    const length = children.length;
    for (let i2 = 0; i2 < length; i2++) {
      children[i2].collectRenderables(instructionSet, renderer, currentLayer);
    }
  },
  /**
   * Advanced method for collecting renderables, which handles additional effects.
   * This method is used when the container has complex processing needs.
   * @param {InstructionSet} instructionSet - The set of instructions to which the renderables will be added.
   * @param {Renderer} renderer - The renderer responsible for rendering the scene.
   * @param {IRenderLayer} currentLayer - The current render layer being processed.
   * @memberof scene.Container#
   */
  collectRenderablesWithEffects(instructionSet, renderer, currentLayer) {
    const { renderPipes } = renderer;
    for (let i2 = 0; i2 < this.effects.length; i2++) {
      const effect = this.effects[i2];
      const pipe = renderPipes[effect.pipe];
      pipe.push(effect, this, instructionSet);
    }
    this.collectRenderablesSimple(instructionSet, renderer, currentLayer);
    for (let i2 = this.effects.length - 1; i2 >= 0; i2--) {
      const effect = this.effects[i2];
      const pipe = renderPipes[effect.pipe];
      pipe.pop(effect, this, instructionSet);
    }
  }
};
class FilterEffect {
  constructor() {
    this.pipe = "filter";
    this.priority = 1;
  }
  destroy() {
    for (let i2 = 0; i2 < this.filters.length; i2++) {
      this.filters[i2].destroy();
    }
    this.filters = null;
    this.filterArea = null;
  }
}
class MaskEffectManagerClass {
  constructor() {
    this._effectClasses = [];
    this._tests = [];
    this._initialized = false;
  }
  init() {
    if (this._initialized)
      return;
    this._initialized = true;
    this._effectClasses.forEach((test) => {
      this.add({
        test: test.test,
        maskClass: test
      });
    });
  }
  add(test) {
    this._tests.push(test);
  }
  getMaskEffect(item) {
    if (!this._initialized)
      this.init();
    for (let i2 = 0; i2 < this._tests.length; i2++) {
      const test = this._tests[i2];
      if (test.test(item)) {
        return BigPool.get(test.maskClass, item);
      }
    }
    return item;
  }
  returnMaskEffect(effect) {
    BigPool.return(effect);
  }
}
const MaskEffectManager = new MaskEffectManagerClass();
extensions.handleByList(ExtensionType.MaskEffect, MaskEffectManager._effectClasses);
const effectsMixin = {
  _maskEffect: null,
  _maskOptions: {
    inverse: false
  },
  _filterEffect: null,
  /**
   * @todo Needs docs.
   * @memberof scene.Container#
   * @type {Array<Effect>}
   */
  effects: [],
  _markStructureAsChanged() {
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (renderGroup) {
      renderGroup.structureDidChange = true;
    }
  },
  /**
   * @todo Needs docs.
   * @param effect - The effect to add.
   * @memberof scene.Container#
   * @ignore
   */
  addEffect(effect) {
    const index = this.effects.indexOf(effect);
    if (index !== -1)
      return;
    this.effects.push(effect);
    this.effects.sort((a2, b2) => a2.priority - b2.priority);
    this._markStructureAsChanged();
    this._updateIsSimple();
  },
  /**
   * @todo Needs docs.
   * @param effect - The effect to remove.
   * @memberof scene.Container#
   * @ignore
   */
  removeEffect(effect) {
    const index = this.effects.indexOf(effect);
    if (index === -1)
      return;
    this.effects.splice(index, 1);
    this._markStructureAsChanged();
    this._updateIsSimple();
  },
  set mask(value) {
    const effect = this._maskEffect;
    if ((effect == null ? void 0 : effect.mask) === value)
      return;
    if (effect) {
      this.removeEffect(effect);
      MaskEffectManager.returnMaskEffect(effect);
      this._maskEffect = null;
    }
    if (value === null || value === void 0)
      return;
    this._maskEffect = MaskEffectManager.getMaskEffect(value);
    this.addEffect(this._maskEffect);
  },
  /**
   * Used to set mask and control mask options.
   * @param options
   * @example
   * import { Graphics, Sprite } from 'pixi.js';
   *
   * const graphics = new Graphics();
   * graphics.beginFill(0xFF3300);
   * graphics.drawRect(50, 250, 100, 100);
   * graphics.endFill();
   *
   * const sprite = new Sprite(texture);
   * sprite.setMask({
   *     mask: graphics,
   *     inverse: true,
   * });
   * @memberof scene.Container#
   */
  setMask(options) {
    this._maskOptions = {
      ...this._maskOptions,
      ...options
    };
    if (options.mask) {
      this.mask = options.mask;
    }
    this._markStructureAsChanged();
  },
  /**
   * Sets a mask for the displayObject. A mask is an object that limits the visibility of an
   * object to the shape of the mask applied to it. In PixiJS a regular mask must be a
   * {@link Graphics} or a {@link Sprite} object. This allows for much faster masking in canvas as it
   * utilities shape clipping. Furthermore, a mask of an object must be in the subtree of its parent.
   * Otherwise, `getLocalBounds` may calculate incorrect bounds, which makes the container's width and height wrong.
   * To remove a mask, set this property to `null`.
   *
   * For sprite mask both alpha and red channel are used. Black mask is the same as transparent mask.
   * @example
   * import { Graphics, Sprite } from 'pixi.js';
   *
   * const graphics = new Graphics();
   * graphics.beginFill(0xFF3300);
   * graphics.drawRect(50, 250, 100, 100);
   * graphics.endFill();
   *
   * const sprite = new Sprite(texture);
   * sprite.mask = graphics;
   * @memberof scene.Container#
   */
  get mask() {
    var _a;
    return (_a = this._maskEffect) == null ? void 0 : _a.mask;
  },
  set filters(value) {
    var _a;
    if (!Array.isArray(value) && value)
      value = [value];
    const effect = this._filterEffect || (this._filterEffect = new FilterEffect());
    value = value;
    const hasFilters = (value == null ? void 0 : value.length) > 0;
    const hadFilters = ((_a = effect.filters) == null ? void 0 : _a.length) > 0;
    const didChange = hasFilters !== hadFilters;
    value = Array.isArray(value) ? value.slice(0) : value;
    effect.filters = Object.freeze(value);
    if (didChange) {
      if (hasFilters) {
        this.addEffect(effect);
      } else {
        this.removeEffect(effect);
        effect.filters = value ?? null;
      }
    }
  },
  /**
   * Sets the filters for the displayObject.
   * IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
   * To remove filters simply set this property to `'null'`.
   * @memberof scene.Container#
   */
  get filters() {
    var _a;
    return (_a = this._filterEffect) == null ? void 0 : _a.filters;
  },
  set filterArea(value) {
    this._filterEffect || (this._filterEffect = new FilterEffect());
    this._filterEffect.filterArea = value;
  },
  /**
   * The area the filter is applied to. This is used as more of an optimization
   * rather than figuring out the dimensions of the displayObject each frame you can set this rectangle.
   *
   * Also works as an interaction mask.
   * @memberof scene.Container#
   */
  get filterArea() {
    var _a;
    return (_a = this._filterEffect) == null ? void 0 : _a.filterArea;
  }
};
const findMixin = {
  /**
   * The instance label of the object.
   * @memberof scene.Container#
   * @member {string} label
   */
  label: null,
  /**
   * The instance name of the object.
   * @deprecated since 8.0.0
   * @see scene.Container#label
   * @member {string} name
   * @memberof scene.Container#
   */
  get name() {
    deprecation(v8_0_0, "Container.name property has been removed, use Container.label instead");
    return this.label;
  },
  set name(value) {
    deprecation(v8_0_0, "Container.name property has been removed, use Container.label instead");
    this.label = value;
  },
  /**
   * @method getChildByName
   * @deprecated since 8.0.0
   * @param {string} name - Instance name.
   * @param {boolean}[deep=false] - Whether to search recursively
   * @returns {Container} The child with the specified name.
   * @see scene.Container#getChildByLabel
   * @memberof scene.Container#
   */
  getChildByName(name, deep = false) {
    return this.getChildByLabel(name, deep);
  },
  /**
   * Returns the first child in the container with the specified label.
   *
   * Recursive searches are done in a pre-order traversal.
   * @memberof scene.Container#
   * @param {string|RegExp} label - Instance label.
   * @param {boolean}[deep=false] - Whether to search recursively
   * @returns {Container} The child with the specified label.
   */
  getChildByLabel(label, deep = false) {
    const children = this.children;
    for (let i2 = 0; i2 < children.length; i2++) {
      const child = children[i2];
      if (child.label === label || label instanceof RegExp && label.test(child.label))
        return child;
    }
    if (deep) {
      for (let i2 = 0; i2 < children.length; i2++) {
        const child = children[i2];
        const found = child.getChildByLabel(label, true);
        if (found) {
          return found;
        }
      }
    }
    return null;
  },
  /**
   * Returns all children in the container with the specified label.
   * @memberof scene.Container#
   * @param {string|RegExp} label - Instance label.
   * @param {boolean}[deep=false] - Whether to search recursively
   * @param {Container[]} [out=[]] - The array to store matching children in.
   * @returns {Container[]} An array of children with the specified label.
   */
  getChildrenByLabel(label, deep = false, out = []) {
    const children = this.children;
    for (let i2 = 0; i2 < children.length; i2++) {
      const child = children[i2];
      if (child.label === label || label instanceof RegExp && label.test(child.label)) {
        out.push(child);
      }
    }
    if (deep) {
      for (let i2 = 0; i2 < children.length; i2++) {
        children[i2].getChildrenByLabel(label, true, out);
      }
    }
    return out;
  }
};
const matrixPool = new Pool(Matrix);
const boundsPool = new Pool(Bounds);
const tempMatrix$1 = new Matrix();
const getFastGlobalBoundsMixin = {
  /**
   * Computes the global bounds for the container, considering its children and optionally
   * factoring in render layers. It starts by clearing the provided bounds object, then
   * recursively calculates the bounds, and finally applies the world transformation.
   * @param {boolean} [factorRenderLayers] - Whether to consider render layers in the calculation.
   * @param {Bounds} [bounds] - The bounds object to store the result. If not provided, a new one is created.
   * @returns {Bounds} The computed bounds.
   * @memberof scene.Container#
   */
  getFastGlobalBounds(factorRenderLayers, bounds) {
    bounds || (bounds = new Bounds());
    bounds.clear();
    this._getGlobalBoundsRecursive(!!factorRenderLayers, bounds, this.parentRenderLayer);
    if (!bounds.isValid) {
      bounds.set(0, 0, 0, 0);
    }
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    bounds.applyMatrix(renderGroup.worldTransform);
    return bounds;
  },
  /**
   * Recursively calculates the global bounds for the container and its children.
   * It considers visibility, measurability, and effects, and applies transformations
   * as necessary to compute the bounds accurately.
   * @param {boolean} factorRenderLayers - Whether to consider render layers in the calculation.
   * @param {Bounds} bounds - The bounds object to update with the calculated values.
   * @param {IRenderLayer} currentLayer - The current render layer being processed.
   * @memberof scene.Container#
   */
  _getGlobalBoundsRecursive(factorRenderLayers, bounds, currentLayer) {
    let localBounds = bounds;
    if (factorRenderLayers && this.parentRenderLayer && this.parentRenderLayer !== currentLayer)
      return;
    if (this.localDisplayStatus !== 7 || !this.measurable) {
      return;
    }
    const manageEffects = !!this.effects.length;
    if (this.renderGroup || manageEffects) {
      localBounds = boundsPool.get().clear();
    }
    if (this.boundsArea) {
      bounds.addRect(this.boundsArea, this.worldTransform);
    } else {
      if (this.renderPipeId) {
        const viewBounds = this.bounds;
        localBounds.addFrame(
          viewBounds.minX,
          viewBounds.minY,
          viewBounds.maxX,
          viewBounds.maxY,
          this.groupTransform
        );
      }
      const children = this.children;
      for (let i2 = 0; i2 < children.length; i2++) {
        children[i2]._getGlobalBoundsRecursive(factorRenderLayers, localBounds, currentLayer);
      }
    }
    if (manageEffects) {
      let advanced = false;
      const renderGroup = this.renderGroup || this.parentRenderGroup;
      for (let i2 = 0; i2 < this.effects.length; i2++) {
        if (this.effects[i2].addBounds) {
          if (!advanced) {
            advanced = true;
            localBounds.applyMatrix(renderGroup.worldTransform);
          }
          this.effects[i2].addBounds(localBounds, true);
        }
      }
      if (advanced) {
        localBounds.applyMatrix(renderGroup.worldTransform.copyTo(tempMatrix$1).invert());
        bounds.addBounds(localBounds, this.relativeGroupTransform);
      }
      bounds.addBounds(localBounds);
      boundsPool.return(localBounds);
    } else if (this.renderGroup) {
      bounds.addBounds(localBounds, this.relativeGroupTransform);
      boundsPool.return(localBounds);
    }
  }
};
function getGlobalBounds(target, skipUpdateTransform, bounds) {
  bounds.clear();
  let parentTransform;
  let pooledMatrix;
  if (target.parent) {
    if (!skipUpdateTransform) {
      pooledMatrix = matrixPool.get().identity();
      parentTransform = updateTransformBackwards(target, pooledMatrix);
    } else {
      parentTransform = target.parent.worldTransform;
    }
  } else {
    parentTransform = Matrix.IDENTITY;
  }
  _getGlobalBounds(target, bounds, parentTransform, skipUpdateTransform);
  if (pooledMatrix) {
    matrixPool.return(pooledMatrix);
  }
  if (!bounds.isValid) {
    bounds.set(0, 0, 0, 0);
  }
  return bounds;
}
function _getGlobalBounds(target, bounds, parentTransform, skipUpdateTransform) {
  var _a, _b;
  if (!target.visible || !target.measurable)
    return;
  let worldTransform;
  if (!skipUpdateTransform) {
    target.updateLocalTransform();
    worldTransform = matrixPool.get();
    worldTransform.appendFrom(target.localTransform, parentTransform);
  } else {
    worldTransform = target.worldTransform;
  }
  const parentBounds = bounds;
  const preserveBounds = !!target.effects.length;
  if (preserveBounds) {
    bounds = boundsPool.get().clear();
  }
  if (target.boundsArea) {
    bounds.addRect(target.boundsArea, worldTransform);
  } else {
    if (target.bounds) {
      bounds.matrix = worldTransform;
      bounds.addBounds(target.bounds);
    }
    for (let i2 = 0; i2 < target.children.length; i2++) {
      _getGlobalBounds(target.children[i2], bounds, worldTransform, skipUpdateTransform);
    }
  }
  if (preserveBounds) {
    for (let i2 = 0; i2 < target.effects.length; i2++) {
      (_b = (_a = target.effects[i2]).addBounds) == null ? void 0 : _b.call(_a, bounds);
    }
    parentBounds.addBounds(bounds, Matrix.IDENTITY);
    boundsPool.return(bounds);
  }
  if (!skipUpdateTransform) {
    matrixPool.return(worldTransform);
  }
}
function updateTransformBackwards(target, parentTransform) {
  const parent = target.parent;
  if (parent) {
    updateTransformBackwards(parent, parentTransform);
    parent.updateLocalTransform();
    parentTransform.append(parent.localTransform);
  }
  return parentTransform;
}
function multiplyHexColors(color1, color2) {
  if (color1 === 16777215 || !color2)
    return color2;
  if (color2 === 16777215 || !color1)
    return color1;
  const r1 = color1 >> 16 & 255;
  const g1 = color1 >> 8 & 255;
  const b1 = color1 & 255;
  const r2 = color2 >> 16 & 255;
  const g2 = color2 >> 8 & 255;
  const b2 = color2 & 255;
  const r3 = r1 * r2 / 255 | 0;
  const g3 = g1 * g2 / 255 | 0;
  const b3 = b1 * b2 / 255 | 0;
  return (r3 << 16) + (g3 << 8) + b3;
}
const WHITE_BGR = 16777215;
function multiplyColors(localBGRColor, parentBGRColor) {
  if (localBGRColor === WHITE_BGR) {
    return parentBGRColor;
  }
  if (parentBGRColor === WHITE_BGR) {
    return localBGRColor;
  }
  return multiplyHexColors(localBGRColor, parentBGRColor);
}
function bgr2rgb(color) {
  return ((color & 255) << 16) + (color & 65280) + (color >> 16 & 255);
}
const getGlobalMixin = {
  /**
   * Returns the global (compound) alpha of the container within the scene.
   * @param skipUpdate - Performance optimization flag:
   *   - If false (default): Recalculates the entire alpha chain through parents for accuracy
   *   - If true: Uses cached worldAlpha from the last render pass for better performance
   * @returns The resulting alpha value (between 0 and 1)
   * @example
   * // Accurate but slower - recalculates entire alpha chain
   * const preciseAlpha = container.getGlobalAlpha();
   *
   * // Faster but may be outdated - uses cached alpha
   * const cachedAlpha = container.getGlobalAlpha(true);
   */
  getGlobalAlpha(skipUpdate) {
    if (skipUpdate) {
      if (this.renderGroup) {
        return this.renderGroup.worldAlpha;
      }
      if (this.parentRenderGroup) {
        return this.parentRenderGroup.worldAlpha * this.alpha;
      }
      return this.alpha;
    }
    let alpha = this.alpha;
    let current = this.parent;
    while (current) {
      alpha *= current.alpha;
      current = current.parent;
    }
    return alpha;
  },
  /**
   * Returns the global transform matrix of the container within the scene.
   * @param matrix - Optional matrix to store the result. If not provided, a new Matrix will be created.
   * @param skipUpdate - Performance optimization flag:
   *   - If false (default): Recalculates the entire transform chain for accuracy
   *   - If true: Uses cached worldTransform from the last render pass for better performance
   * @returns The resulting transformation matrix (either the input matrix or a new one)
   * @example
   * // Accurate but slower - recalculates entire transform chain
   * const preciseTransform = container.getGlobalTransform();
   *
   * // Faster but may be outdated - uses cached transform
   * const cachedTransform = container.getGlobalTransform(undefined, true);
   *
   * // Reuse existing matrix
   * const existingMatrix = new Matrix();
   * container.getGlobalTransform(existingMatrix);
   */
  getGlobalTransform(matrix, skipUpdate) {
    if (skipUpdate) {
      return matrix.copyFrom(this.worldTransform);
    }
    this.updateLocalTransform();
    const parentTransform = updateTransformBackwards(this, matrixPool.get().identity());
    matrix.appendFrom(this.localTransform, parentTransform);
    matrixPool.return(parentTransform);
    return matrix;
  },
  /**
   * Returns the global (compound) tint color of the container within the scene.
   * @param skipUpdate - Performance optimization flag:
   *   - If false (default): Recalculates the entire tint chain through parents for accuracy
   *   - If true: Uses cached worldColor from the last render pass for better performance
   * @returns The resulting tint color as a 24-bit RGB number (0xRRGGBB)
   * @example
   * // Accurate but slower - recalculates entire tint chain
   * const preciseTint = container.getGlobalTint();
   *
   * // Faster but may be outdated - uses cached tint
   * const cachedTint = container.getGlobalTint(true);
   */
  getGlobalTint(skipUpdate) {
    if (skipUpdate) {
      if (this.renderGroup) {
        return bgr2rgb(this.renderGroup.worldColor);
      }
      if (this.parentRenderGroup) {
        return bgr2rgb(
          multiplyColors(this.localColor, this.parentRenderGroup.worldColor)
        );
      }
      return this.tint;
    }
    let color = this.localColor;
    let parent = this.parent;
    while (parent) {
      color = multiplyColors(color, parent.localColor);
      parent = parent.parent;
    }
    return bgr2rgb(color);
  }
};
let warnCount = 0;
const maxWarnings = 500;
function warn(...args) {
  if (warnCount === maxWarnings)
    return;
  warnCount++;
  if (warnCount === maxWarnings) {
    console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.");
  } else {
    console.warn("PixiJS Warning: ", ...args);
  }
}
function getLocalBounds(target, bounds, relativeMatrix) {
  bounds.clear();
  relativeMatrix || (relativeMatrix = Matrix.IDENTITY);
  _getLocalBounds(target, bounds, relativeMatrix, target, true);
  if (!bounds.isValid) {
    bounds.set(0, 0, 0, 0);
  }
  return bounds;
}
function _getLocalBounds(target, bounds, parentTransform, rootContainer, isRoot) {
  var _a, _b;
  let relativeTransform;
  if (!isRoot) {
    if (!target.visible || !target.measurable)
      return;
    target.updateLocalTransform();
    const localTransform = target.localTransform;
    relativeTransform = matrixPool.get();
    relativeTransform.appendFrom(localTransform, parentTransform);
  } else {
    relativeTransform = matrixPool.get();
    relativeTransform = parentTransform.copyTo(relativeTransform);
  }
  const parentBounds = bounds;
  const preserveBounds = !!target.effects.length;
  if (preserveBounds) {
    bounds = boundsPool.get().clear();
  }
  if (target.boundsArea) {
    bounds.addRect(target.boundsArea, relativeTransform);
  } else {
    if (target.renderPipeId) {
      bounds.matrix = relativeTransform;
      bounds.addBounds(target.bounds);
    }
    const children = target.children;
    for (let i2 = 0; i2 < children.length; i2++) {
      _getLocalBounds(children[i2], bounds, relativeTransform, rootContainer, false);
    }
  }
  if (preserveBounds) {
    for (let i2 = 0; i2 < target.effects.length; i2++) {
      (_b = (_a = target.effects[i2]).addLocalBounds) == null ? void 0 : _b.call(_a, bounds, rootContainer);
    }
    parentBounds.addBounds(bounds, Matrix.IDENTITY);
    boundsPool.return(bounds);
  }
  matrixPool.return(relativeTransform);
}
function checkChildrenDidChange(container, previousData) {
  const children = container.children;
  for (let i2 = 0; i2 < children.length; i2++) {
    const child = children[i2];
    const uid2 = child.uid;
    const didChange = (child._didViewChangeTick & 65535) << 16 | child._didContainerChangeTick & 65535;
    const index = previousData.index;
    if (previousData.data[index] !== uid2 || previousData.data[index + 1] !== didChange) {
      previousData.data[previousData.index] = uid2;
      previousData.data[previousData.index + 1] = didChange;
      previousData.didChange = true;
    }
    previousData.index = index + 2;
    if (child.children.length) {
      checkChildrenDidChange(child, previousData);
    }
  }
  return previousData.didChange;
}
const tempMatrix = new Matrix();
const measureMixin = {
  _localBoundsCacheId: -1,
  _localBoundsCacheData: null,
  _setWidth(value, localWidth) {
    const sign2 = Math.sign(this.scale.x) || 1;
    if (localWidth !== 0) {
      this.scale.x = value / localWidth * sign2;
    } else {
      this.scale.x = sign2;
    }
  },
  _setHeight(value, localHeight) {
    const sign2 = Math.sign(this.scale.y) || 1;
    if (localHeight !== 0) {
      this.scale.y = value / localHeight * sign2;
    } else {
      this.scale.y = sign2;
    }
  },
  /**
   * Retrieves the local bounds of the container as a Bounds object.
   * @returns - The bounding area.
   * @memberof scene.Container#
   */
  getLocalBounds() {
    if (!this._localBoundsCacheData) {
      this._localBoundsCacheData = {
        data: [],
        index: 1,
        didChange: false,
        localBounds: new Bounds()
      };
    }
    const localBoundsCacheData = this._localBoundsCacheData;
    localBoundsCacheData.index = 1;
    localBoundsCacheData.didChange = false;
    if (localBoundsCacheData.data[0] !== this._didViewChangeTick) {
      localBoundsCacheData.didChange = true;
      localBoundsCacheData.data[0] = this._didViewChangeTick;
    }
    checkChildrenDidChange(this, localBoundsCacheData);
    if (localBoundsCacheData.didChange) {
      getLocalBounds(this, localBoundsCacheData.localBounds, tempMatrix);
    }
    return localBoundsCacheData.localBounds;
  },
  /**
   * Calculates and returns the (world) bounds of the display object as a [Rectangle]{@link Rectangle}.
   * @param skipUpdate - Setting to `true` will stop the transforms of the scene graph from
   *  being updated. This means the calculation returned MAY be out of date BUT will give you a
   *  nice performance boost.
   * @param bounds - Optional bounds to store the result of the bounds calculation.
   * @returns - The minimum axis-aligned rectangle in world space that fits around this object.
   * @memberof scene.Container#
   */
  getBounds(skipUpdate, bounds) {
    return getGlobalBounds(this, skipUpdate, bounds || new Bounds());
  }
};
const onRenderMixin = {
  _onRender: null,
  set onRender(func) {
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (!func) {
      if (this._onRender) {
        renderGroup == null ? void 0 : renderGroup.removeOnRender(this);
      }
      this._onRender = null;
      return;
    }
    if (!this._onRender) {
      renderGroup == null ? void 0 : renderGroup.addOnRender(this);
    }
    this._onRender = func;
  },
  /**
   * This callback is used when the container is rendered. This is where you should add your custom
   * logic that is needed to be run every frame.
   *
   * In v7 many users used `updateTransform` for this, however the way v8 renders objects is different
   * and "updateTransform" is no longer called every frame
   * @example
   * const container = new Container();
   * container.onRender = () => {
   *    container.rotation += 0.01;
   * };
   * @memberof scene.Container#
   */
  get onRender() {
    return this._onRender;
  }
};
const sortMixin = {
  _zIndex: 0,
  /**
   * Should children be sorted by zIndex at the next render call.
   *
   * Will get automatically set to true if a new child is added, or if a child's zIndex changes.
   * @type {boolean}
   * @memberof scene.Container#
   */
  sortDirty: false,
  /**
   * If set to true, the container will sort its children by `zIndex` value
   * when the next render is called, or manually if `sortChildren()` is called.
   *
   * This actually changes the order of elements in the array, so should be treated
   * as a basic solution that is not performant compared to other solutions,
   * such as {@link https://github.com/pixijs/layers PixiJS Layers}
   *
   * Also be aware of that this may not work nicely with the `addChildAt()` function,
   * as the `zIndex` sorting may cause the child to automatically sorted to another position.
   * @type {boolean}
   * @memberof scene.Container#
   */
  sortableChildren: false,
  /**
   * The zIndex of the container.
   *
   * Setting this value, will automatically set the parent to be sortable. Children will be automatically
   * sorted by zIndex value; a higher value will mean it will be moved towards the end of the array,
   * and thus rendered on top of other display objects within the same container.
   * @see scene.Container#sortableChildren
   * @memberof scene.Container#
   */
  get zIndex() {
    return this._zIndex;
  },
  set zIndex(value) {
    if (this._zIndex === value)
      return;
    this._zIndex = value;
    this.depthOfChildModified();
  },
  depthOfChildModified() {
    if (this.parent) {
      this.parent.sortableChildren = true;
      this.parent.sortDirty = true;
    }
    if (this.parentRenderGroup) {
      this.parentRenderGroup.structureDidChange = true;
    }
  },
  /**
   * Sorts children by zIndex.
   * @memberof scene.Container#
   */
  sortChildren() {
    if (!this.sortDirty)
      return;
    this.sortDirty = false;
    this.children.sort(sortChildren);
  }
};
function sortChildren(a2, b2) {
  return a2._zIndex - b2._zIndex;
}
const toLocalGlobalMixin = {
  /**
   * Returns the global position of the container.
   * @param point - The optional point to write the global value to.
   * @param skipUpdate - Should we skip the update transform.
   * @returns - The updated point.
   * @memberof scene.Container#
   */
  getGlobalPosition(point = new Point(), skipUpdate = false) {
    if (this.parent) {
      this.parent.toGlobal(this._position, point, skipUpdate);
    } else {
      point.x = this._position.x;
      point.y = this._position.y;
    }
    return point;
  },
  /**
   * Calculates the global position of the container.
   * @param position - The world origin to calculate from.
   * @param point - A Point object in which to store the value, optional
   *  (otherwise will create a new Point).
   * @param skipUpdate - Should we skip the update transform.
   * @returns - A point object representing the position of this object.
   * @memberof scene.Container#
   */
  toGlobal(position, point, skipUpdate = false) {
    const globalMatrix = this.getGlobalTransform(matrixPool.get(), skipUpdate);
    point = globalMatrix.apply(position, point);
    matrixPool.return(globalMatrix);
    return point;
  },
  /**
   * Calculates the local position of the container relative to another point.
   * @param position - The world origin to calculate from.
   * @param from - The Container to calculate the global position from.
   * @param point - A Point object in which to store the value, optional
   *  (otherwise will create a new Point).
   * @param skipUpdate - Should we skip the update transform
   * @returns - A point object representing the position of this object
   * @memberof scene.Container#
   */
  toLocal(position, from, point, skipUpdate) {
    if (from) {
      position = from.toGlobal(position, point, skipUpdate);
    }
    const globalMatrix = this.getGlobalTransform(matrixPool.get(), skipUpdate);
    point = globalMatrix.applyInverse(position, point);
    matrixPool.return(globalMatrix);
    return point;
  }
};
class InstructionSet {
  constructor() {
    this.uid = uid("instructionSet");
    this.instructions = [];
    this.instructionSize = 0;
    this.renderables = [];
    this.gcTick = 0;
  }
  /** reset the instruction set so it can be reused set size back to 0 */
  reset() {
    this.instructionSize = 0;
  }
  /**
   * Add an instruction to the set
   * @param instruction - add an instruction to the set
   */
  add(instruction) {
    this.instructions[this.instructionSize++] = instruction;
  }
  /**
   * Log the instructions to the console (for debugging)
   * @internal
   * @ignore
   */
  log() {
    this.instructions.length = this.instructionSize;
    console.table(this.instructions, ["type", "action"]);
  }
}
let count = 0;
class TexturePoolClass {
  /**
   * @param textureOptions - options that will be passed to BaseRenderTexture constructor
   * @param {SCALE_MODE} [textureOptions.scaleMode] - See {@link SCALE_MODE} for possible values.
   */
  constructor(textureOptions) {
    this._poolKeyHash = /* @__PURE__ */ Object.create(null);
    this._texturePool = {};
    this.textureOptions = textureOptions || {};
    this.enableFullScreen = false;
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   * @param antialias
   */
  createTexture(pixelWidth, pixelHeight, antialias) {
    const textureSource = new TextureSource({
      ...this.textureOptions,
      width: pixelWidth,
      height: pixelHeight,
      resolution: 1,
      antialias,
      autoGarbageCollect: false
    });
    return new Texture({
      source: textureSource,
      label: `texturePool_${count++}`
    });
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param frameWidth - The minimum width of the render texture.
   * @param frameHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @param antialias
   * @returns The new render texture.
   */
  getOptimalTexture(frameWidth, frameHeight, resolution = 1, antialias) {
    let po2Width = Math.ceil(frameWidth * resolution - 1e-6);
    let po2Height = Math.ceil(frameHeight * resolution - 1e-6);
    po2Width = nextPow2(po2Width);
    po2Height = nextPow2(po2Height);
    const key = (po2Width << 17) + (po2Height << 1) + (antialias ? 1 : 0);
    if (!this._texturePool[key]) {
      this._texturePool[key] = [];
    }
    let texture = this._texturePool[key].pop();
    if (!texture) {
      texture = this.createTexture(po2Width, po2Height, antialias);
    }
    texture.source._resolution = resolution;
    texture.source.width = po2Width / resolution;
    texture.source.height = po2Height / resolution;
    texture.source.pixelWidth = po2Width;
    texture.source.pixelHeight = po2Height;
    texture.frame.x = 0;
    texture.frame.y = 0;
    texture.frame.width = frameWidth;
    texture.frame.height = frameHeight;
    texture.updateUvs();
    this._poolKeyHash[texture.uid] = key;
    return texture;
  }
  /**
   * Gets extra texture of the same size as input renderTexture
   * @param texture - The texture to check what size it is.
   * @param antialias - Whether to use antialias.
   * @returns A texture that is a power of two
   */
  getSameSizeTexture(texture, antialias = false) {
    const source = texture.source;
    return this.getOptimalTexture(texture.width, texture.height, source._resolution, antialias);
  }
  /**
   * Place a render texture back into the pool.
   * @param renderTexture - The renderTexture to free
   */
  returnTexture(renderTexture) {
    const key = this._poolKeyHash[renderTexture.uid];
    this._texturePool[key].push(renderTexture);
  }
  /**
   * Clears the pool.
   * @param destroyTextures - Destroy all stored textures.
   */
  clear(destroyTextures) {
    destroyTextures = destroyTextures !== false;
    if (destroyTextures) {
      for (const i2 in this._texturePool) {
        const textures = this._texturePool[i2];
        if (textures) {
          for (let j2 = 0; j2 < textures.length; j2++) {
            textures[j2].destroy(true);
          }
        }
      }
    }
    this._texturePool = {};
  }
}
const TexturePool = new TexturePoolClass();
class RenderGroup {
  constructor() {
    this.renderPipeId = "renderGroup";
    this.root = null;
    this.canBundle = false;
    this.renderGroupParent = null;
    this.renderGroupChildren = [];
    this.worldTransform = new Matrix();
    this.worldColorAlpha = 4294967295;
    this.worldColor = 16777215;
    this.worldAlpha = 1;
    this.childrenToUpdate = /* @__PURE__ */ Object.create(null);
    this.updateTick = 0;
    this.gcTick = 0;
    this.childrenRenderablesToUpdate = { list: [], index: 0 };
    this.structureDidChange = true;
    this.instructionSet = new InstructionSet();
    this._onRenderContainers = [];
    this.textureNeedsUpdate = true;
    this.isCachedAsTexture = false;
    this._matrixDirty = 7;
  }
  init(root) {
    this.root = root;
    if (root._onRender)
      this.addOnRender(root);
    root.didChange = true;
    const children = root.children;
    for (let i2 = 0; i2 < children.length; i2++) {
      const child = children[i2];
      child._updateFlags = 15;
      this.addChild(child);
    }
  }
  enableCacheAsTexture(options = {}) {
    this.textureOptions = options;
    this.isCachedAsTexture = true;
    this.textureNeedsUpdate = true;
  }
  disableCacheAsTexture() {
    this.isCachedAsTexture = false;
    if (this.texture) {
      TexturePool.returnTexture(this.texture);
      this.texture = null;
    }
  }
  updateCacheTexture() {
    this.textureNeedsUpdate = true;
  }
  reset() {
    this.renderGroupChildren.length = 0;
    for (const i2 in this.childrenToUpdate) {
      const childrenAtDepth = this.childrenToUpdate[i2];
      childrenAtDepth.list.fill(null);
      childrenAtDepth.index = 0;
    }
    this.childrenRenderablesToUpdate.index = 0;
    this.childrenRenderablesToUpdate.list.fill(null);
    this.root = null;
    this.updateTick = 0;
    this.structureDidChange = true;
    this._onRenderContainers.length = 0;
    this.renderGroupParent = null;
    this.disableCacheAsTexture();
  }
  get localTransform() {
    return this.root.localTransform;
  }
  addRenderGroupChild(renderGroupChild) {
    if (renderGroupChild.renderGroupParent) {
      renderGroupChild.renderGroupParent._removeRenderGroupChild(renderGroupChild);
    }
    renderGroupChild.renderGroupParent = this;
    this.renderGroupChildren.push(renderGroupChild);
  }
  _removeRenderGroupChild(renderGroupChild) {
    const index = this.renderGroupChildren.indexOf(renderGroupChild);
    if (index > -1) {
      this.renderGroupChildren.splice(index, 1);
    }
    renderGroupChild.renderGroupParent = null;
  }
  addChild(child) {
    this.structureDidChange = true;
    child.parentRenderGroup = this;
    child.updateTick = -1;
    if (child.parent === this.root) {
      child.relativeRenderGroupDepth = 1;
    } else {
      child.relativeRenderGroupDepth = child.parent.relativeRenderGroupDepth + 1;
    }
    child.didChange = true;
    this.onChildUpdate(child);
    if (child.renderGroup) {
      this.addRenderGroupChild(child.renderGroup);
      return;
    }
    if (child._onRender)
      this.addOnRender(child);
    const children = child.children;
    for (let i2 = 0; i2 < children.length; i2++) {
      this.addChild(children[i2]);
    }
  }
  removeChild(child) {
    this.structureDidChange = true;
    if (child._onRender) {
      if (!child.renderGroup) {
        this.removeOnRender(child);
      }
    }
    child.parentRenderGroup = null;
    if (child.renderGroup) {
      this._removeRenderGroupChild(child.renderGroup);
      return;
    }
    const children = child.children;
    for (let i2 = 0; i2 < children.length; i2++) {
      this.removeChild(children[i2]);
    }
  }
  removeChildren(children) {
    for (let i2 = 0; i2 < children.length; i2++) {
      this.removeChild(children[i2]);
    }
  }
  onChildUpdate(child) {
    let childrenToUpdate = this.childrenToUpdate[child.relativeRenderGroupDepth];
    if (!childrenToUpdate) {
      childrenToUpdate = this.childrenToUpdate[child.relativeRenderGroupDepth] = {
        index: 0,
        list: []
      };
    }
    childrenToUpdate.list[childrenToUpdate.index++] = child;
  }
  updateRenderable(renderable) {
    if (renderable.globalDisplayStatus < 7)
      return;
    this.instructionSet.renderPipes[renderable.renderPipeId].updateRenderable(renderable);
    renderable.didViewUpdate = false;
  }
  onChildViewUpdate(child) {
    this.childrenRenderablesToUpdate.list[this.childrenRenderablesToUpdate.index++] = child;
  }
  get isRenderable() {
    return this.root.localDisplayStatus === 7 && this.worldAlpha > 0;
  }
  /**
   * adding a container to the onRender list will make sure the user function
   * passed in to the user defined 'onRender` callBack
   * @param container - the container to add to the onRender list
   */
  addOnRender(container) {
    this._onRenderContainers.push(container);
  }
  removeOnRender(container) {
    this._onRenderContainers.splice(this._onRenderContainers.indexOf(container), 1);
  }
  runOnRender(renderer) {
    for (let i2 = 0; i2 < this._onRenderContainers.length; i2++) {
      this._onRenderContainers[i2]._onRender(renderer);
    }
  }
  destroy() {
    this.disableCacheAsTexture();
    this.renderGroupParent = null;
    this.root = null;
    this.childrenRenderablesToUpdate = null;
    this.childrenToUpdate = null;
    this.renderGroupChildren = null;
    this._onRenderContainers = null;
    this.instructionSet = null;
  }
  getChildren(out = []) {
    const children = this.root.children;
    for (let i2 = 0; i2 < children.length; i2++) {
      this._getChildren(children[i2], out);
    }
    return out;
  }
  _getChildren(container, out = []) {
    out.push(container);
    if (container.renderGroup)
      return out;
    const children = container.children;
    for (let i2 = 0; i2 < children.length; i2++) {
      this._getChildren(children[i2], out);
    }
    return out;
  }
  invalidateMatrices() {
    this._matrixDirty = 7;
  }
  /**
   * Returns the inverse of the world transform matrix.
   * @returns {Matrix} The inverse of the world transform matrix.
   */
  get inverseWorldTransform() {
    if ((this._matrixDirty & 1) === 0)
      return this._inverseWorldTransform;
    this._matrixDirty &= ~1;
    this._inverseWorldTransform || (this._inverseWorldTransform = new Matrix());
    return this._inverseWorldTransform.copyFrom(this.worldTransform).invert();
  }
  /**
   * Returns the inverse of the texture offset transform matrix.
   * @returns {Matrix} The inverse of the texture offset transform matrix.
   */
  get textureOffsetInverseTransform() {
    if ((this._matrixDirty & 2) === 0)
      return this._textureOffsetInverseTransform;
    this._matrixDirty &= ~2;
    this._textureOffsetInverseTransform || (this._textureOffsetInverseTransform = new Matrix());
    return this._textureOffsetInverseTransform.copyFrom(this.inverseWorldTransform).translate(
      -this._textureBounds.x,
      -this._textureBounds.y
    );
  }
  /**
   * Returns the inverse of the parent texture transform matrix.
   * This is used to properly transform coordinates when rendering into cached textures.
   * @returns {Matrix} The inverse of the parent texture transform matrix.
   */
  get inverseParentTextureTransform() {
    if ((this._matrixDirty & 4) === 0)
      return this._inverseParentTextureTransform;
    this._matrixDirty &= ~4;
    const parentCacheAsTexture = this._parentCacheAsTextureRenderGroup;
    if (parentCacheAsTexture) {
      this._inverseParentTextureTransform || (this._inverseParentTextureTransform = new Matrix());
      return this._inverseParentTextureTransform.copyFrom(this.worldTransform).prepend(parentCacheAsTexture.inverseWorldTransform).translate(
        -parentCacheAsTexture._textureBounds.x,
        -parentCacheAsTexture._textureBounds.y
      );
    }
    return this.worldTransform;
  }
  /**
   * Returns a matrix that transforms coordinates to the correct coordinate space of the texture being rendered to.
   * This is the texture offset inverse transform of the closest parent RenderGroup that is cached as a texture.
   * @returns {Matrix | null} The transform matrix for the cached texture coordinate space,
   * or null if no parent is cached as texture.
   */
  get cacheToLocalTransform() {
    if (!this._parentCacheAsTextureRenderGroup)
      return null;
    return this._parentCacheAsTextureRenderGroup.textureOffsetInverseTransform;
  }
}
function assignWithIgnore(target, options, ignore = {}) {
  for (const key in options) {
    if (!ignore[key] && options[key] !== void 0) {
      target[key] = options[key];
    }
  }
}
const defaultSkew = new ObservablePoint(null);
const defaultPivot = new ObservablePoint(null);
const defaultScale = new ObservablePoint(null, 1, 1);
const UPDATE_COLOR = 1;
const UPDATE_BLEND = 2;
const UPDATE_VISIBLE = 4;
class Container extends EventEmitter {
  constructor(options = {}) {
    var _a, _b;
    super();
    this.uid = uid("renderable");
    this._updateFlags = 15;
    this.renderGroup = null;
    this.parentRenderGroup = null;
    this.parentRenderGroupIndex = 0;
    this.didChange = false;
    this.didViewUpdate = false;
    this.relativeRenderGroupDepth = 0;
    this.children = [];
    this.parent = null;
    this.includeInBuild = true;
    this.measurable = true;
    this.isSimple = true;
    this.updateTick = -1;
    this.localTransform = new Matrix();
    this.relativeGroupTransform = new Matrix();
    this.groupTransform = this.relativeGroupTransform;
    this.destroyed = false;
    this._position = new ObservablePoint(this, 0, 0);
    this._scale = defaultScale;
    this._pivot = defaultPivot;
    this._skew = defaultSkew;
    this._cx = 1;
    this._sx = 0;
    this._cy = 0;
    this._sy = 1;
    this._rotation = 0;
    this.localColor = 16777215;
    this.localAlpha = 1;
    this.groupAlpha = 1;
    this.groupColor = 16777215;
    this.groupColorAlpha = 4294967295;
    this.localBlendMode = "inherit";
    this.groupBlendMode = "normal";
    this.localDisplayStatus = 7;
    this.globalDisplayStatus = 7;
    this._didContainerChangeTick = 0;
    this._didViewChangeTick = 0;
    this._didLocalTransformChangeId = -1;
    this.effects = [];
    assignWithIgnore(this, options, {
      children: true,
      parent: true,
      effects: true
    });
    (_a = options.children) == null ? void 0 : _a.forEach((child) => this.addChild(child));
    (_b = options.parent) == null ? void 0 : _b.addChild(this);
  }
  /**
   * Mixes all enumerable properties and methods from a source object to Container.
   * @param source - The source of properties and methods to mix in.
   * @deprecated since 8.8.0
   */
  static mixin(source) {
    deprecation("8.8.0", "Container.mixin is deprecated, please use extensions.mixin instead.");
    extensions.mixin(Container, source);
  }
  // = 'default';
  /**
   * We now use the _didContainerChangeTick and _didViewChangeTick to track changes
   * @deprecated since 8.2.6
   * @ignore
   */
  set _didChangeId(value) {
    this._didViewChangeTick = value >> 12 & 4095;
    this._didContainerChangeTick = value & 4095;
  }
  get _didChangeId() {
    return this._didContainerChangeTick & 4095 | (this._didViewChangeTick & 4095) << 12;
  }
  /**
   * Adds one or more children to the container.
   *
   * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
   * @param {...Container} children - The Container(s) to add to the container
   * @returns {Container} - The first child that was added.
   */
  addChild(...children) {
    if (!this.allowChildren) {
      deprecation(v8_0_0, "addChild: Only Containers will be allowed to add children in v8.0.0");
    }
    if (children.length > 1) {
      for (let i2 = 0; i2 < children.length; i2++) {
        this.addChild(children[i2]);
      }
      return children[0];
    }
    const child = children[0];
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (child.parent === this) {
      this.children.splice(this.children.indexOf(child), 1);
      this.children.push(child);
      if (renderGroup) {
        renderGroup.structureDidChange = true;
      }
      return child;
    }
    if (child.parent) {
      child.parent.removeChild(child);
    }
    this.children.push(child);
    if (this.sortableChildren)
      this.sortDirty = true;
    child.parent = this;
    child.didChange = true;
    child._updateFlags = 15;
    if (renderGroup) {
      renderGroup.addChild(child);
    }
    this.emit("childAdded", child, this, this.children.length - 1);
    child.emit("added", this);
    this._didViewChangeTick++;
    if (child._zIndex !== 0) {
      child.depthOfChildModified();
    }
    return child;
  }
  /**
   * Removes one or more children from the container.
   * @param {...Container} children - The Container(s) to remove
   * @returns {Container} The first child that was removed.
   */
  removeChild(...children) {
    if (children.length > 1) {
      for (let i2 = 0; i2 < children.length; i2++) {
        this.removeChild(children[i2]);
      }
      return children[0];
    }
    const child = children[0];
    const index = this.children.indexOf(child);
    if (index > -1) {
      this._didViewChangeTick++;
      this.children.splice(index, 1);
      if (this.renderGroup) {
        this.renderGroup.removeChild(child);
      } else if (this.parentRenderGroup) {
        this.parentRenderGroup.removeChild(child);
      }
      if (child.parentRenderLayer) {
        child.parentRenderLayer.detach(child);
      }
      child.parent = null;
      this.emit("childRemoved", child, this, index);
      child.emit("removed", this);
    }
    return child;
  }
  /** @ignore */
  _onUpdate(point) {
    if (point) {
      if (point === this._skew) {
        this._updateSkew();
      }
    }
    this._didContainerChangeTick++;
    if (this.didChange)
      return;
    this.didChange = true;
    if (this.parentRenderGroup) {
      this.parentRenderGroup.onChildUpdate(this);
    }
  }
  set isRenderGroup(value) {
    if (!!this.renderGroup === value)
      return;
    if (value) {
      this.enableRenderGroup();
    } else {
      this.disableRenderGroup();
    }
  }
  /**
   * Returns true if this container is a render group.
   * This means that it will be rendered as a separate pass, with its own set of instructions
   */
  get isRenderGroup() {
    return !!this.renderGroup;
  }
  /**
   * Calling this enables a render group for this container.
   * This means it will be rendered as a separate set of instructions.
   * The transform of the container will also be handled on the GPU rather than the CPU.
   */
  enableRenderGroup() {
    if (this.renderGroup)
      return;
    const parentRenderGroup = this.parentRenderGroup;
    parentRenderGroup == null ? void 0 : parentRenderGroup.removeChild(this);
    this.renderGroup = BigPool.get(RenderGroup, this);
    this.groupTransform = Matrix.IDENTITY;
    parentRenderGroup == null ? void 0 : parentRenderGroup.addChild(this);
    this._updateIsSimple();
  }
  /** This will disable the render group for this container. */
  disableRenderGroup() {
    if (!this.renderGroup)
      return;
    const parentRenderGroup = this.parentRenderGroup;
    parentRenderGroup == null ? void 0 : parentRenderGroup.removeChild(this);
    BigPool.return(this.renderGroup);
    this.renderGroup = null;
    this.groupTransform = this.relativeGroupTransform;
    parentRenderGroup == null ? void 0 : parentRenderGroup.addChild(this);
    this._updateIsSimple();
  }
  /** @ignore */
  _updateIsSimple() {
    this.isSimple = !this.renderGroup && this.effects.length === 0;
  }
  /**
   * Current transform of the object based on world (parent) factors.
   * @readonly
   */
  get worldTransform() {
    this._worldTransform || (this._worldTransform = new Matrix());
    if (this.renderGroup) {
      this._worldTransform.copyFrom(this.renderGroup.worldTransform);
    } else if (this.parentRenderGroup) {
      this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform);
    }
    return this._worldTransform;
  }
  /**
   * The position of the container on the x axis relative to the local coordinates of the parent.
   * An alias to position.x
   */
  get x() {
    return this._position.x;
  }
  set x(value) {
    this._position.x = value;
  }
  /**
   * The position of the container on the y axis relative to the local coordinates of the parent.
   * An alias to position.y
   */
  get y() {
    return this._position.y;
  }
  set y(value) {
    this._position.y = value;
  }
  /**
   * The coordinate of the object relative to the local coordinates of the parent.
   * @since 4.0.0
   */
  get position() {
    return this._position;
  }
  set position(value) {
    this._position.copyFrom(value);
  }
  /**
   * The rotation of the object in radians.
   * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
   */
  get rotation() {
    return this._rotation;
  }
  set rotation(value) {
    if (this._rotation !== value) {
      this._rotation = value;
      this._onUpdate(this._skew);
    }
  }
  /**
   * The angle of the object in degrees.
   * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
   */
  get angle() {
    return this.rotation * RAD_TO_DEG;
  }
  set angle(value) {
    this.rotation = value * DEG_TO_RAD;
  }
  /**
   * The center of rotation, scaling, and skewing for this display object in its local space. The `position`
   * is the projection of `pivot` in the parent's local space.
   *
   * By default, the pivot is the origin (0, 0).
   * @since 4.0.0
   */
  get pivot() {
    if (this._pivot === defaultPivot) {
      this._pivot = new ObservablePoint(this, 0, 0);
    }
    return this._pivot;
  }
  set pivot(value) {
    if (this._pivot === defaultPivot) {
      this._pivot = new ObservablePoint(this, 0, 0);
    }
    typeof value === "number" ? this._pivot.set(value) : this._pivot.copyFrom(value);
  }
  /**
   * The skew factor for the object in radians.
   * @since 4.0.0
   */
  get skew() {
    if (this._skew === defaultSkew) {
      this._skew = new ObservablePoint(this, 0, 0);
    }
    return this._skew;
  }
  set skew(value) {
    if (this._skew === defaultSkew) {
      this._skew = new ObservablePoint(this, 0, 0);
    }
    this._skew.copyFrom(value);
  }
  /**
   * The scale factors of this object along the local coordinate axes.
   *
   * The default scale is (1, 1).
   * @since 4.0.0
   */
  get scale() {
    if (this._scale === defaultScale) {
      this._scale = new ObservablePoint(this, 1, 1);
    }
    return this._scale;
  }
  set scale(value) {
    if (this._scale === defaultScale) {
      this._scale = new ObservablePoint(this, 0, 0);
    }
    typeof value === "number" ? this._scale.set(value) : this._scale.copyFrom(value);
  }
  /**
   * The width of the Container, setting this will actually modify the scale to achieve the value set.
   * @memberof scene.Container#
   */
  get width() {
    return Math.abs(this.scale.x * this.getLocalBounds().width);
  }
  set width(value) {
    const localWidth = this.getLocalBounds().width;
    this._setWidth(value, localWidth);
  }
  /**
   * The height of the Container, setting this will actually modify the scale to achieve the value set.
   * @memberof scene.Container#
   */
  get height() {
    return Math.abs(this.scale.y * this.getLocalBounds().height);
  }
  set height(value) {
    const localHeight = this.getLocalBounds().height;
    this._setHeight(value, localHeight);
  }
  /**
   * Retrieves the size of the container as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the container.
   * @memberof scene.Container#
   */
  getSize(out) {
    if (!out) {
      out = {};
    }
    const bounds = this.getLocalBounds();
    out.width = Math.abs(this.scale.x * bounds.width);
    out.height = Math.abs(this.scale.y * bounds.height);
    return out;
  }
  /**
   * Sets the size of the container to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   * @memberof scene.Container#
   */
  setSize(value, height) {
    const size = this.getLocalBounds();
    if (typeof value === "object") {
      height = value.height ?? value.width;
      value = value.width;
    } else {
      height ?? (height = value);
    }
    value !== void 0 && this._setWidth(value, size.width);
    height !== void 0 && this._setHeight(height, size.height);
  }
  /** Called when the skew or the rotation changes. */
  _updateSkew() {
    const rotation = this._rotation;
    const skew = this._skew;
    this._cx = Math.cos(rotation + skew._y);
    this._sx = Math.sin(rotation + skew._y);
    this._cy = -Math.sin(rotation - skew._x);
    this._sy = Math.cos(rotation - skew._x);
  }
  /**
   * Updates the transform properties of the container (accepts partial values).
   * @param {object} opts - The options for updating the transform.
   * @param {number} opts.x - The x position of the container.
   * @param {number} opts.y - The y position of the container.
   * @param {number} opts.scaleX - The scale factor on the x-axis.
   * @param {number} opts.scaleY - The scale factor on the y-axis.
   * @param {number} opts.rotation - The rotation of the container, in radians.
   * @param {number} opts.skewX - The skew factor on the x-axis.
   * @param {number} opts.skewY - The skew factor on the y-axis.
   * @param {number} opts.pivotX - The x coordinate of the pivot point.
   * @param {number} opts.pivotY - The y coordinate of the pivot point.
   */
  updateTransform(opts) {
    this.position.set(
      typeof opts.x === "number" ? opts.x : this.position.x,
      typeof opts.y === "number" ? opts.y : this.position.y
    );
    this.scale.set(
      typeof opts.scaleX === "number" ? opts.scaleX || 1 : this.scale.x,
      typeof opts.scaleY === "number" ? opts.scaleY || 1 : this.scale.y
    );
    this.rotation = typeof opts.rotation === "number" ? opts.rotation : this.rotation;
    this.skew.set(
      typeof opts.skewX === "number" ? opts.skewX : this.skew.x,
      typeof opts.skewY === "number" ? opts.skewY : this.skew.y
    );
    this.pivot.set(
      typeof opts.pivotX === "number" ? opts.pivotX : this.pivot.x,
      typeof opts.pivotY === "number" ? opts.pivotY : this.pivot.y
    );
    return this;
  }
  /**
   * Updates the local transform using the given matrix.
   * @param matrix - The matrix to use for updating the transform.
   */
  setFromMatrix(matrix) {
    matrix.decompose(this);
  }
  /** Updates the local transform. */
  updateLocalTransform() {
    const localTransformChangeId = this._didContainerChangeTick;
    if (this._didLocalTransformChangeId === localTransformChangeId)
      return;
    this._didLocalTransformChangeId = localTransformChangeId;
    const lt = this.localTransform;
    const scale = this._scale;
    const pivot = this._pivot;
    const position = this._position;
    const sx = scale._x;
    const sy = scale._y;
    const px = pivot._x;
    const py = pivot._y;
    lt.a = this._cx * sx;
    lt.b = this._sx * sx;
    lt.c = this._cy * sy;
    lt.d = this._sy * sy;
    lt.tx = position._x - (px * lt.a + py * lt.c);
    lt.ty = position._y - (px * lt.b + py * lt.d);
  }
  // / ///// color related stuff
  set alpha(value) {
    if (value === this.localAlpha)
      return;
    this.localAlpha = value;
    this._updateFlags |= UPDATE_COLOR;
    this._onUpdate();
  }
  /** The opacity of the object. */
  get alpha() {
    return this.localAlpha;
  }
  set tint(value) {
    const tempColor = Color.shared.setValue(value ?? 16777215);
    const bgr = tempColor.toBgrNumber();
    if (bgr === this.localColor)
      return;
    this.localColor = bgr;
    this._updateFlags |= UPDATE_COLOR;
    this._onUpdate();
  }
  /**
   * The tint applied to the sprite. This is a hex value.
   *
   * A value of 0xFFFFFF will remove any tint effect.
   * @default 0xFFFFFF
   */
  get tint() {
    return bgr2rgb(this.localColor);
  }
  // / //////////////// blend related stuff
  set blendMode(value) {
    if (this.localBlendMode === value)
      return;
    if (this.parentRenderGroup) {
      this.parentRenderGroup.structureDidChange = true;
    }
    this._updateFlags |= UPDATE_BLEND;
    this.localBlendMode = value;
    this._onUpdate();
  }
  /**
   * The blend mode to be applied to the sprite. Apply a value of `'normal'` to reset the blend mode.
   * @default 'normal'
   */
  get blendMode() {
    return this.localBlendMode;
  }
  // / ///////// VISIBILITY / RENDERABLE /////////////////
  /** The visibility of the object. If false the object will not be drawn, and the transform will not be updated. */
  get visible() {
    return !!(this.localDisplayStatus & 2);
  }
  set visible(value) {
    const valueNumber = value ? 2 : 0;
    if ((this.localDisplayStatus & 2) === valueNumber)
      return;
    if (this.parentRenderGroup) {
      this.parentRenderGroup.structureDidChange = true;
    }
    this._updateFlags |= UPDATE_VISIBLE;
    this.localDisplayStatus ^= 2;
    this._onUpdate();
  }
  /** @ignore */
  get culled() {
    return !(this.localDisplayStatus & 4);
  }
  /** @ignore */
  set culled(value) {
    const valueNumber = value ? 0 : 4;
    if ((this.localDisplayStatus & 4) === valueNumber)
      return;
    if (this.parentRenderGroup) {
      this.parentRenderGroup.structureDidChange = true;
    }
    this._updateFlags |= UPDATE_VISIBLE;
    this.localDisplayStatus ^= 4;
    this._onUpdate();
  }
  /** Can this object be rendered, if false the object will not be drawn but the transform will still be updated. */
  get renderable() {
    return !!(this.localDisplayStatus & 1);
  }
  set renderable(value) {
    const valueNumber = value ? 1 : 0;
    if ((this.localDisplayStatus & 1) === valueNumber)
      return;
    this._updateFlags |= UPDATE_VISIBLE;
    this.localDisplayStatus ^= 1;
    if (this.parentRenderGroup) {
      this.parentRenderGroup.structureDidChange = true;
    }
    this._onUpdate();
  }
  /** Whether or not the object should be rendered. */
  get isRenderable() {
    return this.localDisplayStatus === 7 && this.groupAlpha > 0;
  }
  /**
   * Removes all internal references and listeners as well as removes children from the display list.
   * Do not use a Container after calling `destroy`.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
   *  method called as well. 'options' will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Only used for children with textures e.g. Sprites. If options.children
   * is set to true it should destroy the texture of the child sprite
   * @param {boolean} [options.textureSource=false] - Only used for children with textures e.g. Sprites.
   * If options.children is set to true it should destroy the texture source of the child sprite
   * @param {boolean} [options.context=false] - Only used for children with graphicsContexts e.g. Graphics.
   * If options.children is set to true it should destroy the context of the child graphics
   */
  destroy(options = false) {
    var _a;
    if (this.destroyed)
      return;
    this.destroyed = true;
    let oldChildren;
    if (this.children.length) {
      oldChildren = this.removeChildren(0, this.children.length);
    }
    this.removeFromParent();
    this.parent = null;
    this._maskEffect = null;
    this._filterEffect = null;
    this.effects = null;
    this._position = null;
    this._scale = null;
    this._pivot = null;
    this._skew = null;
    this.emit("destroyed", this);
    this.removeAllListeners();
    const destroyChildren = typeof options === "boolean" ? options : options == null ? void 0 : options.children;
    if (destroyChildren && oldChildren) {
      for (let i2 = 0; i2 < oldChildren.length; ++i2) {
        oldChildren[i2].destroy(options);
      }
    }
    (_a = this.renderGroup) == null ? void 0 : _a.destroy();
    this.renderGroup = null;
  }
}
extensions.mixin(
  Container,
  childrenHelperMixin,
  getFastGlobalBoundsMixin,
  toLocalGlobalMixin,
  onRenderMixin,
  measureMixin,
  effectsMixin,
  findMixin,
  sortMixin,
  cullingMixin,
  cacheAsTextureMixin,
  getGlobalMixin,
  collectRenderablesMixin
);
class ViewContainer extends Container {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(options) {
    super(options);
    this.canBundle = true;
    this.allowChildren = false;
    this._roundPixels = 0;
    this._lastUsed = -1;
    this._bounds = new Bounds(0, 1, 0, 0);
    this._boundsDirty = true;
  }
  /**
   * The local bounds of the view.
   * @type {rendering.Bounds}
   */
  get bounds() {
    if (!this._boundsDirty)
      return this._bounds;
    this.updateBounds();
    this._boundsDirty = false;
    return this._bounds;
  }
  /**
   * Whether or not to round the x/y position of the sprite.
   * @type {boolean}
   */
  get roundPixels() {
    return !!this._roundPixels;
  }
  set roundPixels(value) {
    this._roundPixels = value ? 1 : 0;
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(point) {
    const bounds = this.bounds;
    const { x: x2, y: y2 } = point;
    return x2 >= bounds.minX && x2 <= bounds.maxX && y2 >= bounds.minY && y2 <= bounds.maxY;
  }
  /** @private */
  onViewUpdate() {
    this._didViewChangeTick++;
    this._boundsDirty = true;
    if (this.didViewUpdate)
      return;
    this.didViewUpdate = true;
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (renderGroup) {
      renderGroup.onChildViewUpdate(this);
    }
  }
  destroy(options) {
    super.destroy(options);
    this._bounds = null;
  }
  collectRenderablesSimple(instructionSet, renderer, currentLayer) {
    const { renderPipes, renderableGC } = renderer;
    renderPipes.blendMode.setBlendMode(this, this.groupBlendMode, instructionSet);
    const rp = renderPipes;
    rp[this.renderPipeId].addRenderable(this, instructionSet);
    renderableGC.addRenderable(this);
    this.didViewUpdate = false;
    const children = this.children;
    const length = children.length;
    for (let i2 = 0; i2 < length; i2++) {
      children[i2].collectRenderables(instructionSet, renderer, currentLayer);
    }
  }
}
class Sprite extends ViewContainer {
  /**
   * @param options - The options for creating the sprite.
   */
  constructor(options = Texture.EMPTY) {
    if (options instanceof Texture) {
      options = { texture: options };
    }
    const { texture = Texture.EMPTY, anchor, roundPixels, width, height, ...rest } = options;
    super({
      label: "Sprite",
      ...rest
    });
    this.renderPipeId = "sprite";
    this.batched = true;
    this._visualBounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 };
    this._anchor = new ObservablePoint(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    );
    if (anchor) {
      this.anchor = anchor;
    } else if (texture.defaultAnchor) {
      this.anchor = texture.defaultAnchor;
    }
    this.texture = texture;
    this.allowChildren = false;
    this.roundPixels = roundPixels ?? false;
    if (width !== void 0)
      this.width = width;
    if (height !== void 0)
      this.height = height;
  }
  /**
   * Helper function that creates a new sprite based on the source you provide.
   * The source can be - frame id, image, video, canvas element, video element, texture
   * @param source - Source to create texture from
   * @param [skipCache] - Whether to skip the cache or not
   * @returns The newly created sprite
   */
  static from(source, skipCache = false) {
    if (source instanceof Texture) {
      return new Sprite(source);
    }
    return new Sprite(Texture.from(source, skipCache));
  }
  set texture(value) {
    value || (value = Texture.EMPTY);
    const currentTexture = this._texture;
    if (currentTexture === value)
      return;
    if (currentTexture && currentTexture.dynamic)
      currentTexture.off("update", this.onViewUpdate, this);
    if (value.dynamic)
      value.on("update", this.onViewUpdate, this);
    this._texture = value;
    if (this._width) {
      this._setWidth(this._width, this._texture.orig.width);
    }
    if (this._height) {
      this._setHeight(this._height, this._texture.orig.height);
    }
    this.onViewUpdate();
  }
  /** The texture that the sprite is using. */
  get texture() {
    return this._texture;
  }
  /**
   * The bounds of the sprite, taking the texture's trim into account.
   * @type {rendering.Bounds}
   */
  get visualBounds() {
    updateQuadBounds(this._visualBounds, this._anchor, this._texture);
    return this._visualBounds;
  }
  /**
   * @deprecated
   */
  get sourceBounds() {
    deprecation("8.6.1", "Sprite.sourceBounds is deprecated, use visualBounds instead.");
    return this.visualBounds;
  }
  /** @private */
  updateBounds() {
    const anchor = this._anchor;
    const texture = this._texture;
    const bounds = this._bounds;
    const { width, height } = texture.orig;
    bounds.minX = -anchor._x * width;
    bounds.maxX = bounds.minX + width;
    bounds.minY = -anchor._y * height;
    bounds.maxY = bounds.minY + height;
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(options = false) {
    super.destroy(options);
    const destroyTexture = typeof options === "boolean" ? options : options == null ? void 0 : options.texture;
    if (destroyTexture) {
      const destroyTextureSource = typeof options === "boolean" ? options : options == null ? void 0 : options.textureSource;
      this._texture.destroy(destroyTextureSource);
    }
    this._texture = null;
    this._visualBounds = null;
    this._bounds = null;
    this._anchor = null;
  }
  /**
   * The anchor sets the origin point of the sprite. The default value is taken from the {@link Texture}
   * and passed to the constructor.
   *
   * The default is `(0,0)`, this means the sprite's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * import { Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite({texture: Texture.WHITE});
   * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(value) {
    typeof value === "number" ? this._anchor.set(value) : this._anchor.copyFrom(value);
  }
  /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return Math.abs(this.scale.x) * this._texture.orig.width;
  }
  set width(value) {
    this._setWidth(value, this._texture.orig.width);
    this._width = value;
  }
  /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return Math.abs(this.scale.y) * this._texture.orig.height;
  }
  set height(value) {
    this._setHeight(value, this._texture.orig.height);
    this._height = value;
  }
  /**
   * Retrieves the size of the Sprite as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the Sprite.
   */
  getSize(out) {
    out || (out = {});
    out.width = Math.abs(this.scale.x) * this._texture.orig.width;
    out.height = Math.abs(this.scale.y) * this._texture.orig.height;
    return out;
  }
  /**
   * Sets the size of the Sprite to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(value, height) {
    if (typeof value === "object") {
      height = value.height ?? value.width;
      value = value.width;
    } else {
      height ?? (height = value);
    }
    value !== void 0 && this._setWidth(value, this._texture.orig.width);
    height !== void 0 && this._setHeight(height, this._texture.orig.height);
  }
}
const tempBounds = new Bounds();
function addMaskBounds(mask, bounds, skipUpdateTransform) {
  const boundsToMask = tempBounds;
  mask.measurable = true;
  getGlobalBounds(mask, skipUpdateTransform, boundsToMask);
  bounds.addBoundsMask(boundsToMask);
  mask.measurable = false;
}
function addMaskLocalBounds(mask, bounds, localRoot) {
  const boundsToMask = boundsPool.get();
  mask.measurable = true;
  const tempMatrix2 = matrixPool.get().identity();
  const relativeMask = getMatrixRelativeToParent(mask, localRoot, tempMatrix2);
  getLocalBounds(mask, boundsToMask, relativeMask);
  mask.measurable = false;
  bounds.addBoundsMask(boundsToMask);
  matrixPool.return(tempMatrix2);
  boundsPool.return(boundsToMask);
}
function getMatrixRelativeToParent(target, root, matrix) {
  if (!target) {
    warn("Mask bounds, renderable is not inside the root container");
    return matrix;
  }
  if (target !== root) {
    getMatrixRelativeToParent(target.parent, root, matrix);
    target.updateLocalTransform();
    matrix.append(target.localTransform);
  }
  return matrix;
}
class AlphaMask {
  constructor(options) {
    this.priority = 0;
    this.inverse = false;
    this.pipe = "alphaMask";
    if (options == null ? void 0 : options.mask) {
      this.init(options.mask);
    }
  }
  init(mask) {
    this.mask = mask;
    this.renderMaskToTexture = !(mask instanceof Sprite);
    this.mask.renderable = this.renderMaskToTexture;
    this.mask.includeInBuild = !this.renderMaskToTexture;
    this.mask.measurable = false;
  }
  reset() {
    this.mask.measurable = true;
    this.mask = null;
  }
  addBounds(bounds, skipUpdateTransform) {
    if (!this.inverse) {
      addMaskBounds(this.mask, bounds, skipUpdateTransform);
    }
  }
  addLocalBounds(bounds, localRoot) {
    addMaskLocalBounds(this.mask, bounds, localRoot);
  }
  containsPoint(point, hitTestFn) {
    const mask = this.mask;
    return hitTestFn(mask, point);
  }
  destroy() {
    this.reset();
  }
  static test(mask) {
    return mask instanceof Sprite;
  }
}
AlphaMask.extension = ExtensionType.MaskEffect;
class ColorMask {
  constructor(options) {
    this.priority = 0;
    this.pipe = "colorMask";
    if (options == null ? void 0 : options.mask) {
      this.init(options.mask);
    }
  }
  init(mask) {
    this.mask = mask;
  }
  destroy() {
  }
  static test(mask) {
    return typeof mask === "number";
  }
}
ColorMask.extension = ExtensionType.MaskEffect;
class StencilMask {
  constructor(options) {
    this.priority = 0;
    this.pipe = "stencilMask";
    if (options == null ? void 0 : options.mask) {
      this.init(options.mask);
    }
  }
  init(mask) {
    this.mask = mask;
    this.mask.includeInBuild = false;
    this.mask.measurable = false;
  }
  reset() {
    this.mask.measurable = true;
    this.mask.includeInBuild = true;
    this.mask = null;
  }
  addBounds(bounds, skipUpdateTransform) {
    addMaskBounds(this.mask, bounds, skipUpdateTransform);
  }
  addLocalBounds(bounds, localRoot) {
    addMaskLocalBounds(this.mask, bounds, localRoot);
  }
  containsPoint(point, hitTestFn) {
    const mask = this.mask;
    return hitTestFn(mask, point);
  }
  destroy() {
    this.reset();
  }
  static test(mask) {
    return mask instanceof Container;
  }
}
StencilMask.extension = ExtensionType.MaskEffect;
const BrowserAdapter = {
  createCanvas: (width, height) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  },
  getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
  getWebGLRenderingContext: () => WebGLRenderingContext,
  getNavigator: () => navigator,
  getBaseUrl: () => document.baseURI ?? window.location.href,
  getFontFaceSet: () => document.fonts,
  fetch: (url, options) => fetch(url, options),
  parseXML: (xml) => {
    const parser = new DOMParser();
    return parser.parseFromString(xml, "text/xml");
  }
};
let currentAdapter = BrowserAdapter;
const DOMAdapter = {
  /**
   * Returns the current adapter.
   * @returns {environment.Adapter} The current adapter.
   */
  get() {
    return currentAdapter;
  },
  /**
   * Sets the current adapter.
   * @param adapter - The new adapter.
   */
  set(adapter) {
    currentAdapter = adapter;
  }
};
class CanvasSource extends TextureSource {
  constructor(options) {
    if (!options.resource) {
      options.resource = DOMAdapter.get().createCanvas();
    }
    if (!options.width) {
      options.width = options.resource.width;
      if (!options.autoDensity) {
        options.width /= options.resolution;
      }
    }
    if (!options.height) {
      options.height = options.resource.height;
      if (!options.autoDensity) {
        options.height /= options.resolution;
      }
    }
    super(options);
    this.uploadMethodId = "image";
    this.autoDensity = options.autoDensity;
    this.resizeCanvas();
    this.transparent = !!options.transparent;
  }
  resizeCanvas() {
    if (this.autoDensity && "style" in this.resource) {
      this.resource.style.width = `${this.width}px`;
      this.resource.style.height = `${this.height}px`;
    }
    if (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight) {
      this.resource.width = this.pixelWidth;
      this.resource.height = this.pixelHeight;
    }
  }
  resize(width = this.width, height = this.height, resolution = this._resolution) {
    const didResize = super.resize(width, height, resolution);
    if (didResize) {
      this.resizeCanvas();
    }
    return didResize;
  }
  static test(resource) {
    return globalThis.HTMLCanvasElement && resource instanceof HTMLCanvasElement || globalThis.OffscreenCanvas && resource instanceof OffscreenCanvas;
  }
  /**
   * Returns the 2D rendering context for the canvas.
   * Caches the context after creating it.
   * @returns The 2D rendering context of the canvas.
   */
  get context2D() {
    return this._context2D || (this._context2D = this.resource.getContext("2d"));
  }
}
CanvasSource.extension = ExtensionType.TextureSource;
class ImageSource extends TextureSource {
  constructor(options) {
    if (options.resource && (globalThis.HTMLImageElement && options.resource instanceof HTMLImageElement)) {
      const canvas = DOMAdapter.get().createCanvas(options.resource.width, options.resource.height);
      const context = canvas.getContext("2d");
      context.drawImage(options.resource, 0, 0, options.resource.width, options.resource.height);
      options.resource = canvas;
      warn("ImageSource: Image element passed, converting to canvas. Use CanvasSource instead.");
    }
    super(options);
    this.uploadMethodId = "image";
    this.autoGarbageCollect = true;
  }
  static test(resource) {
    return globalThis.HTMLImageElement && resource instanceof HTMLImageElement || typeof ImageBitmap !== "undefined" && resource instanceof ImageBitmap || globalThis.VideoFrame && resource instanceof VideoFrame;
  }
}
ImageSource.extension = ExtensionType.TextureSource;
var UPDATE_PRIORITY = /* @__PURE__ */ ((UPDATE_PRIORITY2) => {
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["INTERACTION"] = 50] = "INTERACTION";
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["HIGH"] = 25] = "HIGH";
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["NORMAL"] = 0] = "NORMAL";
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["LOW"] = -25] = "LOW";
  UPDATE_PRIORITY2[UPDATE_PRIORITY2["UTILITY"] = -50] = "UTILITY";
  return UPDATE_PRIORITY2;
})(UPDATE_PRIORITY || {});
class TickerListener {
  /**
   * Constructor
   * @private
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param priority - The priority for emitting
   * @param once - If the handler should fire once
   */
  constructor(fn, context = null, priority = 0, once = false) {
    this.next = null;
    this.previous = null;
    this._destroyed = false;
    this._fn = fn;
    this._context = context;
    this.priority = priority;
    this._once = once;
  }
  /**
   * Simple compare function to figure out if a function and context match.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @returns `true` if the listener match the arguments
   */
  match(fn, context = null) {
    return this._fn === fn && this._context === context;
  }
  /**
   * Emit by calling the current function.
   * @param ticker - The ticker emitting.
   * @returns Next ticker
   */
  emit(ticker) {
    if (this._fn) {
      if (this._context) {
        this._fn.call(this._context, ticker);
      } else {
        this._fn(ticker);
      }
    }
    const redirect = this.next;
    if (this._once) {
      this.destroy(true);
    }
    if (this._destroyed) {
      this.next = null;
    }
    return redirect;
  }
  /**
   * Connect to the list.
   * @param previous - Input node, previous listener
   */
  connect(previous) {
    this.previous = previous;
    if (previous.next) {
      previous.next.previous = this;
    }
    this.next = previous.next;
    previous.next = this;
  }
  /**
   * Destroy and don't use after this.
   * @param hard - `true` to remove the `next` reference, this
   *        is considered a hard destroy. Soft destroy maintains the next reference.
   * @returns The listener to redirect while emitting or removing.
   */
  destroy(hard = false) {
    this._destroyed = true;
    this._fn = null;
    this._context = null;
    if (this.previous) {
      this.previous.next = this.next;
    }
    if (this.next) {
      this.next.previous = this.previous;
    }
    const redirect = this.next;
    this.next = hard ? null : redirect;
    this.previous = null;
    return redirect;
  }
}
const _Ticker = class _Ticker2 {
  constructor() {
    this.autoStart = false;
    this.deltaTime = 1;
    this.lastTime = -1;
    this.speed = 1;
    this.started = false;
    this._requestId = null;
    this._maxElapsedMS = 100;
    this._minElapsedMS = 0;
    this._protected = false;
    this._lastFrame = -1;
    this._head = new TickerListener(null, null, Infinity);
    this.deltaMS = 1 / _Ticker2.targetFPMS;
    this.elapsedMS = 1 / _Ticker2.targetFPMS;
    this._tick = (time) => {
      this._requestId = null;
      if (this.started) {
        this.update(time);
        if (this.started && this._requestId === null && this._head.next) {
          this._requestId = requestAnimationFrame(this._tick);
        }
      }
    };
  }
  /**
   * Conditionally requests a new animation frame.
   * If a frame has not already been requested, and if the internal
   * emitter has listeners, a new frame is requested.
   * @private
   */
  _requestIfNeeded() {
    if (this._requestId === null && this._head.next) {
      this.lastTime = performance.now();
      this._lastFrame = this.lastTime;
      this._requestId = requestAnimationFrame(this._tick);
    }
  }
  /**
   * Conditionally cancels a pending animation frame.
   * @private
   */
  _cancelIfNeeded() {
    if (this._requestId !== null) {
      cancelAnimationFrame(this._requestId);
      this._requestId = null;
    }
  }
  /**
   * Conditionally requests a new animation frame.
   * If the ticker has been started it checks if a frame has not already
   * been requested, and if the internal emitter has listeners. If these
   * conditions are met, a new frame is requested. If the ticker has not
   * been started, but autoStart is `true`, then the ticker starts now,
   * and continues with the previous conditions to request a new frame.
   * @private
   */
  _startIfPossible() {
    if (this.started) {
      this._requestIfNeeded();
    } else if (this.autoStart) {
      this.start();
    }
  }
  /**
   * Register a handler for tick events. Calls continuously unless
   * it is removed or the ticker is stopped.
   * @param fn - The listener function to be added for updates
   * @param context - The listener context
   * @param {number} [priority=UPDATE_PRIORITY.NORMAL] - The priority for emitting
   * @returns This instance of a ticker
   */
  add(fn, context, priority = UPDATE_PRIORITY.NORMAL) {
    return this._addListener(new TickerListener(fn, context, priority));
  }
  /**
   * Add a handler for the tick event which is only execute once.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param {number} [priority=UPDATE_PRIORITY.NORMAL] - The priority for emitting
   * @returns This instance of a ticker
   */
  addOnce(fn, context, priority = UPDATE_PRIORITY.NORMAL) {
    return this._addListener(new TickerListener(fn, context, priority, true));
  }
  /**
   * Internally adds the event handler so that it can be sorted by priority.
   * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
   * before the rendering.
   * @private
   * @param listener - Current listener being added.
   * @returns This instance of a ticker
   */
  _addListener(listener) {
    let current = this._head.next;
    let previous = this._head;
    if (!current) {
      listener.connect(previous);
    } else {
      while (current) {
        if (listener.priority > current.priority) {
          listener.connect(previous);
          break;
        }
        previous = current;
        current = current.next;
      }
      if (!listener.previous) {
        listener.connect(previous);
      }
    }
    this._startIfPossible();
    return this;
  }
  /**
   * Removes any handlers matching the function and context parameters.
   * If no handlers are left after removing, then it cancels the animation frame.
   * @param fn - The listener function to be removed
   * @param context - The listener context to be removed
   * @returns This instance of a ticker
   */
  remove(fn, context) {
    let listener = this._head.next;
    while (listener) {
      if (listener.match(fn, context)) {
        listener = listener.destroy();
      } else {
        listener = listener.next;
      }
    }
    if (!this._head.next) {
      this._cancelIfNeeded();
    }
    return this;
  }
  /**
   * The number of listeners on this ticker, calculated by walking through linked list
   * @readonly
   * @member {number}
   */
  get count() {
    if (!this._head) {
      return 0;
    }
    let count2 = 0;
    let current = this._head;
    while (current = current.next) {
      count2++;
    }
    return count2;
  }
  /** Starts the ticker. If the ticker has listeners a new animation frame is requested at this point. */
  start() {
    if (!this.started) {
      this.started = true;
      this._requestIfNeeded();
    }
  }
  /** Stops the ticker. If the ticker has requested an animation frame it is canceled at this point. */
  stop() {
    if (this.started) {
      this.started = false;
      this._cancelIfNeeded();
    }
  }
  /** Destroy the ticker and don't use after this. Calling this method removes all references to internal events. */
  destroy() {
    if (!this._protected) {
      this.stop();
      let listener = this._head.next;
      while (listener) {
        listener = listener.destroy(true);
      }
      this._head.destroy();
      this._head = null;
    }
  }
  /**
   * Triggers an update. An update entails setting the
   * current {@link ticker.Ticker#elapsedMS|elapsedMS},
   * the current {@link ticker.Ticker#deltaTime|deltaTime},
   * invoking all listeners with current deltaTime,
   * and then finally setting {@link ticker.Ticker#lastTime|lastTime}
   * with the value of currentTime that was provided.
   * This method will be called automatically by animation
   * frame callbacks if the ticker instance has been started
   * and listeners are added.
   * @param {number} [currentTime=performance.now()] - the current time of execution
   */
  update(currentTime = performance.now()) {
    let elapsedMS;
    if (currentTime > this.lastTime) {
      elapsedMS = this.elapsedMS = currentTime - this.lastTime;
      if (elapsedMS > this._maxElapsedMS) {
        elapsedMS = this._maxElapsedMS;
      }
      elapsedMS *= this.speed;
      if (this._minElapsedMS) {
        const delta = currentTime - this._lastFrame | 0;
        if (delta < this._minElapsedMS) {
          return;
        }
        this._lastFrame = currentTime - delta % this._minElapsedMS;
      }
      this.deltaMS = elapsedMS;
      this.deltaTime = this.deltaMS * _Ticker2.targetFPMS;
      const head = this._head;
      let listener = head.next;
      while (listener) {
        listener = listener.emit(this);
      }
      if (!head.next) {
        this._cancelIfNeeded();
      }
    } else {
      this.deltaTime = this.deltaMS = this.elapsedMS = 0;
    }
    this.lastTime = currentTime;
  }
  /**
   * The frames per second at which this ticker is running.
   * The default is approximately 60 in most modern browsers.
   * **Note:** This does not factor in the value of
   * {@link ticker.Ticker#speed|speed}, which is specific
   * to scaling {@link ticker.Ticker#deltaTime|deltaTime}.
   * @member {number}
   * @readonly
   */
  get FPS() {
    return 1e3 / this.elapsedMS;
  }
  /**
   * Manages the maximum amount of milliseconds allowed to
   * elapse between invoking {@link ticker.Ticker#update|update}.
   * This value is used to cap {@link ticker.Ticker#deltaTime|deltaTime},
   * but does not effect the measured value of {@link ticker.Ticker#FPS|FPS}.
   * When setting this property it is clamped to a value between
   * `0` and `Ticker.targetFPMS * 1000`.
   * @member {number}
   * @default 10
   */
  get minFPS() {
    return 1e3 / this._maxElapsedMS;
  }
  set minFPS(fps) {
    const minFPS = Math.min(this.maxFPS, fps);
    const minFPMS = Math.min(Math.max(0, minFPS) / 1e3, _Ticker2.targetFPMS);
    this._maxElapsedMS = 1 / minFPMS;
  }
  /**
   * Manages the minimum amount of milliseconds required to
   * elapse between invoking {@link ticker.Ticker#update|update}.
   * This will effect the measured value of {@link ticker.Ticker#FPS|FPS}.
   * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
   * Otherwise it will be at least `minFPS`
   * @member {number}
   * @default 0
   */
  get maxFPS() {
    if (this._minElapsedMS) {
      return Math.round(1e3 / this._minElapsedMS);
    }
    return 0;
  }
  set maxFPS(fps) {
    if (fps === 0) {
      this._minElapsedMS = 0;
    } else {
      const maxFPS = Math.max(this.minFPS, fps);
      this._minElapsedMS = 1 / (maxFPS / 1e3);
    }
  }
  /**
   * The shared ticker instance used by {@link AnimatedSprite} and by
   * {@link VideoResource} to update animation frames / video textures.
   *
   * It may also be used by {@link Application} if created with the `sharedTicker` option property set to true.
   *
   * The property {@link ticker.Ticker#autoStart|autoStart} is set to `true` for this instance.
   * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
   * @example
   * import { Ticker } from 'pixi.js';
   *
   * const ticker = Ticker.shared;
   * // Set this to prevent starting this ticker when listeners are added.
   * // By default this is true only for the Ticker.shared instance.
   * ticker.autoStart = false;
   *
   * // FYI, call this to ensure the ticker is stopped. It should be stopped
   * // if you have not attempted to render anything yet.
   * ticker.stop();
   *
   * // Call this when you are ready for a running shared ticker.
   * ticker.start();
   * @example
   * import { autoDetectRenderer, Container } from 'pixi.js';
   *
   * // You may use the shared ticker to render...
   * const renderer = autoDetectRenderer();
   * const stage = new Container();
   * document.body.appendChild(renderer.view);
   * ticker.add((time) => renderer.render(stage));
   *
   * // Or you can just update it manually.
   * ticker.autoStart = false;
   * ticker.stop();
   * const animate = (time) => {
   *     ticker.update(time);
   *     renderer.render(stage);
   *     requestAnimationFrame(animate);
   * };
   * animate(performance.now());
   * @member {ticker.Ticker}
   * @readonly
   * @static
   */
  static get shared() {
    if (!_Ticker2._shared) {
      const shared = _Ticker2._shared = new _Ticker2();
      shared.autoStart = true;
      shared._protected = true;
    }
    return _Ticker2._shared;
  }
  /**
   * The system ticker instance used by {@link BasePrepare} for core timing
   * functionality that shouldn't usually need to be paused, unlike the `shared`
   * ticker which drives visual animations and rendering which may want to be paused.
   *
   * The property {@link ticker.Ticker#autoStart|autoStart} is set to `true` for this instance.
   * @member {ticker.Ticker}
   * @readonly
   * @static
   */
  static get system() {
    if (!_Ticker2._system) {
      const system = _Ticker2._system = new _Ticker2();
      system.autoStart = true;
      system._protected = true;
    }
    return _Ticker2._system;
  }
};
_Ticker.targetFPMS = 0.06;
let Ticker = _Ticker;
let promise;
async function detectVideoAlphaMode() {
  promise ?? (promise = (async () => {
    var _a;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    if (!gl) {
      return "premultiply-alpha-on-upload";
    }
    const video = await new Promise((resolve) => {
      const video2 = document.createElement("video");
      video2.onloadeddata = () => resolve(video2);
      video2.onerror = () => resolve(null);
      video2.autoplay = false;
      video2.crossOrigin = "anonymous";
      video2.preload = "auto";
      video2.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=";
      video2.load();
    });
    if (!video) {
      return "premultiply-alpha-on-upload";
    }
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    );
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    const pixel = new Uint8Array(4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    gl.deleteFramebuffer(framebuffer);
    gl.deleteTexture(texture);
    (_a = gl.getExtension("WEBGL_lose_context")) == null ? void 0 : _a.loseContext();
    return pixel[0] <= pixel[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload";
  })());
  return promise;
}
const _VideoSource = class _VideoSource2 extends TextureSource {
  constructor(options) {
    super(options);
    this.isReady = false;
    this.uploadMethodId = "video";
    options = {
      ..._VideoSource2.defaultOptions,
      ...options
    };
    this._autoUpdate = true;
    this._isConnectedToTicker = false;
    this._updateFPS = options.updateFPS || 0;
    this._msToNextUpdate = 0;
    this.autoPlay = options.autoPlay !== false;
    this.alphaMode = options.alphaMode ?? "premultiply-alpha-on-upload";
    this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this);
    this._videoFrameRequestCallbackHandle = null;
    this._load = null;
    this._resolve = null;
    this._reject = null;
    this._onCanPlay = this._onCanPlay.bind(this);
    this._onCanPlayThrough = this._onCanPlayThrough.bind(this);
    this._onError = this._onError.bind(this);
    this._onPlayStart = this._onPlayStart.bind(this);
    this._onPlayStop = this._onPlayStop.bind(this);
    this._onSeeked = this._onSeeked.bind(this);
    if (options.autoLoad !== false) {
      void this.load();
    }
  }
  /** Update the video frame if the source is not destroyed and meets certain conditions. */
  updateFrame() {
    if (this.destroyed) {
      return;
    }
    if (this._updateFPS) {
      const elapsedMS = Ticker.shared.elapsedMS * this.resource.playbackRate;
      this._msToNextUpdate = Math.floor(this._msToNextUpdate - elapsedMS);
    }
    if (!this._updateFPS || this._msToNextUpdate <= 0) {
      this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0;
    }
    if (this.isValid) {
      this.update();
    }
  }
  /** Callback to update the video frame and potentially request the next frame update. */
  _videoFrameRequestCallback() {
    this.updateFrame();
    if (this.destroyed) {
      this._videoFrameRequestCallbackHandle = null;
    } else {
      this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
        this._videoFrameRequestCallback
      );
    }
  }
  /**
   * Checks if the resource has valid dimensions.
   * @returns {boolean} True if width and height are set, otherwise false.
   */
  get isValid() {
    return !!this.resource.videoWidth && !!this.resource.videoHeight;
  }
  /**
   * Start preloading the video resource.
   * @returns {Promise<this>} Handle the validate event
   */
  async load() {
    if (this._load) {
      return this._load;
    }
    const source = this.resource;
    const options = this.options;
    if ((source.readyState === source.HAVE_ENOUGH_DATA || source.readyState === source.HAVE_FUTURE_DATA) && source.width && source.height) {
      source.complete = true;
    }
    source.addEventListener("play", this._onPlayStart);
    source.addEventListener("pause", this._onPlayStop);
    source.addEventListener("seeked", this._onSeeked);
    if (!this._isSourceReady()) {
      if (!options.preload) {
        source.addEventListener("canplay", this._onCanPlay);
      }
      source.addEventListener("canplaythrough", this._onCanPlayThrough);
      source.addEventListener("error", this._onError, true);
    } else {
      this._mediaReady();
    }
    this.alphaMode = await detectVideoAlphaMode();
    this._load = new Promise((resolve, reject) => {
      if (this.isValid) {
        resolve(this);
      } else {
        this._resolve = resolve;
        this._reject = reject;
        if (options.preloadTimeoutMs !== void 0) {
          this._preloadTimeout = setTimeout(() => {
            this._onError(new ErrorEvent(`Preload exceeded timeout of ${options.preloadTimeoutMs}ms`));
          });
        }
        source.load();
      }
    });
    return this._load;
  }
  /**
   * Handle video error events.
   * @param event - The error event
   */
  _onError(event) {
    this.resource.removeEventListener("error", this._onError, true);
    this.emit("error", event);
    if (this._reject) {
      this._reject(event);
      this._reject = null;
      this._resolve = null;
    }
  }
  /**
   * Checks if the underlying source is playing.
   * @returns True if playing.
   */
  _isSourcePlaying() {
    const source = this.resource;
    return !source.paused && !source.ended;
  }
  /**
   * Checks if the underlying source is ready for playing.
   * @returns True if ready.
   */
  _isSourceReady() {
    const source = this.resource;
    return source.readyState > 2;
  }
  /** Runs the update loop when the video is ready to play. */
  _onPlayStart() {
    if (!this.isValid) {
      this._mediaReady();
    }
    this._configureAutoUpdate();
  }
  /** Stops the update loop when a pause event is triggered. */
  _onPlayStop() {
    this._configureAutoUpdate();
  }
  /** Handles behavior when the video completes seeking to the current playback position. */
  _onSeeked() {
    if (this._autoUpdate && !this._isSourcePlaying()) {
      this._msToNextUpdate = 0;
      this.updateFrame();
      this._msToNextUpdate = 0;
    }
  }
  _onCanPlay() {
    const source = this.resource;
    source.removeEventListener("canplay", this._onCanPlay);
    this._mediaReady();
  }
  _onCanPlayThrough() {
    const source = this.resource;
    source.removeEventListener("canplaythrough", this._onCanPlay);
    if (this._preloadTimeout) {
      clearTimeout(this._preloadTimeout);
      this._preloadTimeout = void 0;
    }
    this._mediaReady();
  }
  /** Fired when the video is loaded and ready to play. */
  _mediaReady() {
    const source = this.resource;
    if (this.isValid) {
      this.isReady = true;
      this.resize(source.videoWidth, source.videoHeight);
    }
    this._msToNextUpdate = 0;
    this.updateFrame();
    this._msToNextUpdate = 0;
    if (this._resolve) {
      this._resolve(this);
      this._resolve = null;
      this._reject = null;
    }
    if (this._isSourcePlaying()) {
      this._onPlayStart();
    } else if (this.autoPlay) {
      void this.resource.play();
    }
  }
  /** Cleans up resources and event listeners associated with this texture. */
  destroy() {
    this._configureAutoUpdate();
    const source = this.resource;
    if (source) {
      source.removeEventListener("play", this._onPlayStart);
      source.removeEventListener("pause", this._onPlayStop);
      source.removeEventListener("seeked", this._onSeeked);
      source.removeEventListener("canplay", this._onCanPlay);
      source.removeEventListener("canplaythrough", this._onCanPlayThrough);
      source.removeEventListener("error", this._onError, true);
      source.pause();
      source.src = "";
      source.load();
    }
    super.destroy();
  }
  /** Should the base texture automatically update itself, set to true by default. */
  get autoUpdate() {
    return this._autoUpdate;
  }
  set autoUpdate(value) {
    if (value !== this._autoUpdate) {
      this._autoUpdate = value;
      this._configureAutoUpdate();
    }
  }
  /**
   * How many times a second to update the texture from the video.
   * Leave at 0 to update at every render.
   * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
   */
  get updateFPS() {
    return this._updateFPS;
  }
  set updateFPS(value) {
    if (value !== this._updateFPS) {
      this._updateFPS = value;
      this._configureAutoUpdate();
    }
  }
  /**
   * Configures the updating mechanism based on the current state and settings.
   *
   * This method decides between using the browser's native video frame callback or a custom ticker
   * for updating the video frame. It ensures optimal performance and responsiveness
   * based on the video's state, playback status, and the desired frames-per-second setting.
   *
   * - If `_autoUpdate` is enabled and the video source is playing:
   *   - It will prefer the native video frame callback if available and no specific FPS is set.
   *   - Otherwise, it will use a custom ticker for manual updates.
   * - If `_autoUpdate` is disabled or the video isn't playing, any active update mechanisms are halted.
   */
  _configureAutoUpdate() {
    if (this._autoUpdate && this._isSourcePlaying()) {
      if (!this._updateFPS && this.resource.requestVideoFrameCallback) {
        if (this._isConnectedToTicker) {
          Ticker.shared.remove(this.updateFrame, this);
          this._isConnectedToTicker = false;
          this._msToNextUpdate = 0;
        }
        if (this._videoFrameRequestCallbackHandle === null) {
          this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
            this._videoFrameRequestCallback
          );
        }
      } else {
        if (this._videoFrameRequestCallbackHandle !== null) {
          this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle);
          this._videoFrameRequestCallbackHandle = null;
        }
        if (!this._isConnectedToTicker) {
          Ticker.shared.add(this.updateFrame, this);
          this._isConnectedToTicker = true;
          this._msToNextUpdate = 0;
        }
      }
    } else {
      if (this._videoFrameRequestCallbackHandle !== null) {
        this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle);
        this._videoFrameRequestCallbackHandle = null;
      }
      if (this._isConnectedToTicker) {
        Ticker.shared.remove(this.updateFrame, this);
        this._isConnectedToTicker = false;
        this._msToNextUpdate = 0;
      }
    }
  }
  static test(resource) {
    return globalThis.HTMLVideoElement && resource instanceof HTMLVideoElement;
  }
};
_VideoSource.extension = ExtensionType.TextureSource;
_VideoSource.defaultOptions = {
  ...TextureSource.defaultOptions,
  /** If true, the video will start loading immediately. */
  autoLoad: true,
  /** If true, the video will start playing as soon as it is loaded. */
  autoPlay: true,
  /** The number of times a second to update the texture from the video. Leave at 0 to update at every render. */
  updateFPS: 0,
  /** If true, the video will be loaded with the `crossorigin` attribute. */
  crossorigin: true,
  /** If true, the video will loop when it ends. */
  loop: false,
  /** If true, the video will be muted. */
  muted: true,
  /** If true, the video will play inline. */
  playsinline: true,
  /** If true, the video will be preloaded. */
  preload: false
};
_VideoSource.MIME_TYPES = {
  ogv: "video/ogg",
  mov: "video/quicktime",
  m4v: "video/mp4"
};
let VideoSource = _VideoSource;
const convertToList = (input, transform, forceTransform = false) => {
  if (!Array.isArray(input)) {
    input = [input];
  }
  if (!transform) {
    return input;
  }
  return input.map((item) => {
    if (typeof item === "string" || forceTransform) {
      return transform(item);
    }
    return item;
  });
};
class CacheClass {
  constructor() {
    this._parsers = [];
    this._cache = /* @__PURE__ */ new Map();
    this._cacheMap = /* @__PURE__ */ new Map();
  }
  /** Clear all entries. */
  reset() {
    this._cacheMap.clear();
    this._cache.clear();
  }
  /**
   * Check if the key exists
   * @param key - The key to check
   */
  has(key) {
    return this._cache.has(key);
  }
  /**
   * Fetch entry by key
   * @param key - The key of the entry to get
   */
  get(key) {
    const result = this._cache.get(key);
    if (!result) {
      warn(`[Assets] Asset id ${key} was not found in the Cache`);
    }
    return result;
  }
  /**
   * Set a value by key or keys name
   * @param key - The key or keys to set
   * @param value - The value to store in the cache or from which cacheable assets will be derived.
   */
  set(key, value) {
    const keys = convertToList(key);
    let cacheableAssets;
    for (let i2 = 0; i2 < this.parsers.length; i2++) {
      const parser = this.parsers[i2];
      if (parser.test(value)) {
        cacheableAssets = parser.getCacheableAssets(keys, value);
        break;
      }
    }
    const cacheableMap = new Map(Object.entries(cacheableAssets || {}));
    if (!cacheableAssets) {
      keys.forEach((key2) => {
        cacheableMap.set(key2, value);
      });
    }
    const cacheKeys = [...cacheableMap.keys()];
    const cachedAssets = {
      cacheKeys,
      keys
    };
    keys.forEach((key2) => {
      this._cacheMap.set(key2, cachedAssets);
    });
    cacheKeys.forEach((key2) => {
      const val = cacheableAssets ? cacheableAssets[key2] : value;
      if (this._cache.has(key2) && this._cache.get(key2) !== val) {
        warn("[Cache] already has key:", key2);
      }
      this._cache.set(key2, cacheableMap.get(key2));
    });
  }
  /**
   * Remove entry by key
   *
   * This function will also remove any associated alias from the cache also.
   * @param key - The key of the entry to remove
   */
  remove(key) {
    if (!this._cacheMap.has(key)) {
      warn(`[Assets] Asset id ${key} was not found in the Cache`);
      return;
    }
    const cacheMap = this._cacheMap.get(key);
    const cacheKeys = cacheMap.cacheKeys;
    cacheKeys.forEach((key2) => {
      this._cache.delete(key2);
    });
    cacheMap.keys.forEach((key2) => {
      this._cacheMap.delete(key2);
    });
  }
  /** All loader parsers registered */
  get parsers() {
    return this._parsers;
  }
}
const Cache = new CacheClass();
const sources = [];
extensions.handleByList(ExtensionType.TextureSource, sources);
function textureSourceFrom(options = {}) {
  const hasResource = options && options.resource;
  const res = hasResource ? options.resource : options;
  const opts = hasResource ? options : { resource: options };
  for (let i2 = 0; i2 < sources.length; i2++) {
    const Source = sources[i2];
    if (Source.test(res)) {
      return new Source(opts);
    }
  }
  throw new Error(`Could not find a source type for resource: ${opts.resource}`);
}
function resourceToTexture(options = {}, skipCache = false) {
  const hasResource = options && options.resource;
  const resource = hasResource ? options.resource : options;
  const opts = hasResource ? options : { resource: options };
  if (!skipCache && Cache.has(resource)) {
    return Cache.get(resource);
  }
  const texture = new Texture({ source: textureSourceFrom(opts) });
  texture.on("destroy", () => {
    if (Cache.has(resource)) {
      Cache.remove(resource);
    }
  });
  if (!skipCache) {
    Cache.set(resource, texture);
  }
  return texture;
}
function textureFrom(id, skipCache = false) {
  if (typeof id === "string") {
    return Cache.get(id);
  } else if (id instanceof TextureSource) {
    return new Texture({ source: id });
  }
  return resourceToTexture(id, skipCache);
}
Texture.from = textureFrom;
TextureSource.from = textureSourceFrom;
extensions.add(AlphaMask, ColorMask, StencilMask, VideoSource, ImageSource, CanvasSource, BufferImageSource);
var LoaderParserPriority = /* @__PURE__ */ ((LoaderParserPriority2) => {
  LoaderParserPriority2[LoaderParserPriority2["Low"] = 0] = "Low";
  LoaderParserPriority2[LoaderParserPriority2["Normal"] = 1] = "Normal";
  LoaderParserPriority2[LoaderParserPriority2["High"] = 2] = "High";
  return LoaderParserPriority2;
})(LoaderParserPriority || {});
function assertPath(path2) {
  if (typeof path2 !== "string") {
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(path2)}`);
  }
}
function removeUrlParams(url) {
  const re = url.split("?")[0];
  return re.split("#")[0];
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}
function normalizeStringPosix(path2, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code = -1;
  for (let i2 = 0; i2 <= path2.length; ++i2) {
    if (i2 < path2.length) {
      code = path2.charCodeAt(i2);
    } else if (code === 47) {
      break;
    } else {
      code = 47;
    }
    if (code === 47) {
      if (lastSlash === i2 - 1 || dots === 1) ;
      else if (lastSlash !== i2 - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = "";
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
              }
              lastSlash = i2;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i2;
            dots = 0;
            continue;
          }
        }
      } else {
        if (res.length > 0) {
          res += `/${path2.slice(lastSlash + 1, i2)}`;
        } else {
          res = path2.slice(lastSlash + 1, i2);
        }
        lastSegmentLength = i2 - lastSlash - 1;
      }
      lastSlash = i2;
      dots = 0;
    } else if (code === 46 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const path = {
  /**
   * Converts a path to posix format.
   * @param path - The path to convert to posix
   */
  toPosix(path2) {
    return replaceAll(path2, "\\", "/");
  },
  /**
   * Checks if the path is a URL e.g. http://, https://
   * @param path - The path to check
   */
  isUrl(path2) {
    return /^https?:/.test(this.toPosix(path2));
  },
  /**
   * Checks if the path is a data URL
   * @param path - The path to check
   */
  isDataUrl(path2) {
    return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(path2);
  },
  /**
   * Checks if the path is a blob URL
   * @param path - The path to check
   */
  isBlobUrl(path2) {
    return path2.startsWith("blob:");
  },
  /**
   * Checks if the path has a protocol e.g. http://, https://, file:///, data:, blob:, C:/
   * This will return true for windows file paths
   * @param path - The path to check
   */
  hasProtocol(path2) {
    return /^[^/:]+:/.test(this.toPosix(path2));
  },
  /**
   * Returns the protocol of the path e.g. http://, https://, file:///, data:, blob:, C:/
   * @param path - The path to get the protocol from
   */
  getProtocol(path2) {
    assertPath(path2);
    path2 = this.toPosix(path2);
    const matchFile = /^file:\/\/\//.exec(path2);
    if (matchFile) {
      return matchFile[0];
    }
    const matchProtocol = /^[^/:]+:\/{0,2}/.exec(path2);
    if (matchProtocol) {
      return matchProtocol[0];
    }
    return "";
  },
  /**
   * Converts URL to an absolute path.
   * When loading from a Web Worker, we must use absolute paths.
   * If the URL is already absolute we return it as is
   * If it's not, we convert it
   * @param url - The URL to test
   * @param customBaseUrl - The base URL to use
   * @param customRootUrl - The root URL to use
   */
  toAbsolute(url, customBaseUrl, customRootUrl) {
    assertPath(url);
    if (this.isDataUrl(url) || this.isBlobUrl(url))
      return url;
    const baseUrl = removeUrlParams(this.toPosix(customBaseUrl ?? DOMAdapter.get().getBaseUrl()));
    const rootUrl = removeUrlParams(this.toPosix(customRootUrl ?? this.rootname(baseUrl)));
    url = this.toPosix(url);
    if (url.startsWith("/")) {
      return path.join(rootUrl, url.slice(1));
    }
    const absolutePath = this.isAbsolute(url) ? url : this.join(baseUrl, url);
    return absolutePath;
  },
  /**
   * Normalizes the given path, resolving '..' and '.' segments
   * @param path - The path to normalize
   */
  normalize(path2) {
    assertPath(path2);
    if (path2.length === 0)
      return ".";
    if (this.isDataUrl(path2) || this.isBlobUrl(path2))
      return path2;
    path2 = this.toPosix(path2);
    let protocol = "";
    const isAbsolute = path2.startsWith("/");
    if (this.hasProtocol(path2)) {
      protocol = this.rootname(path2);
      path2 = path2.slice(protocol.length);
    }
    const trailingSeparator = path2.endsWith("/");
    path2 = normalizeStringPosix(path2);
    if (path2.length > 0 && trailingSeparator)
      path2 += "/";
    if (isAbsolute)
      return `/${path2}`;
    return protocol + path2;
  },
  /**
   * Determines if path is an absolute path.
   * Absolute paths can be urls, data urls, or paths on disk
   * @param path - The path to test
   */
  isAbsolute(path2) {
    assertPath(path2);
    path2 = this.toPosix(path2);
    if (this.hasProtocol(path2))
      return true;
    return path2.startsWith("/");
  },
  /**
   * Joins all given path segments together using the platform-specific separator as a delimiter,
   * then normalizes the resulting path
   * @param segments - The segments of the path to join
   */
  join(...segments) {
    if (segments.length === 0) {
      return ".";
    }
    let joined;
    for (let i2 = 0; i2 < segments.length; ++i2) {
      const arg = segments[i2];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === void 0)
          joined = arg;
        else {
          const prevArg = segments[i2 - 1] ?? "";
          if (this.joinExtensions.includes(this.extname(prevArg).toLowerCase())) {
            joined += `/../${arg}`;
          } else {
            joined += `/${arg}`;
          }
        }
      }
    }
    if (joined === void 0) {
      return ".";
    }
    return this.normalize(joined);
  },
  /**
   * Returns the directory name of a path
   * @param path - The path to parse
   */
  dirname(path2) {
    assertPath(path2);
    if (path2.length === 0)
      return ".";
    path2 = this.toPosix(path2);
    let code = path2.charCodeAt(0);
    const hasRoot = code === 47;
    let end = -1;
    let matchedSlash = true;
    const proto = this.getProtocol(path2);
    const origpath = path2;
    path2 = path2.slice(proto.length);
    for (let i2 = path2.length - 1; i2 >= 1; --i2) {
      code = path2.charCodeAt(i2);
      if (code === 47) {
        if (!matchedSlash) {
          end = i2;
          break;
        }
      } else {
        matchedSlash = false;
      }
    }
    if (end === -1)
      return hasRoot ? "/" : this.isUrl(origpath) ? proto + path2 : proto;
    if (hasRoot && end === 1)
      return "//";
    return proto + path2.slice(0, end);
  },
  /**
   * Returns the root of the path e.g. /, C:/, file:///, http://domain.com/
   * @param path - The path to parse
   */
  rootname(path2) {
    assertPath(path2);
    path2 = this.toPosix(path2);
    let root = "";
    if (path2.startsWith("/"))
      root = "/";
    else {
      root = this.getProtocol(path2);
    }
    if (this.isUrl(path2)) {
      const index = path2.indexOf("/", root.length);
      if (index !== -1) {
        root = path2.slice(0, index);
      } else
        root = path2;
      if (!root.endsWith("/"))
        root += "/";
    }
    return root;
  },
  /**
   * Returns the last portion of a path
   * @param path - The path to test
   * @param ext - Optional extension to remove
   */
  basename(path2, ext) {
    assertPath(path2);
    if (ext)
      assertPath(ext);
    path2 = removeUrlParams(this.toPosix(path2));
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i2;
    if (ext !== void 0 && ext.length > 0 && ext.length <= path2.length) {
      if (ext.length === path2.length && ext === path2)
        return "";
      let extIdx = ext.length - 1;
      let firstNonSlashEnd = -1;
      for (i2 = path2.length - 1; i2 >= 0; --i2) {
        const code = path2.charCodeAt(i2);
        if (code === 47) {
          if (!matchedSlash) {
            start = i2 + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd === -1) {
            matchedSlash = false;
            firstNonSlashEnd = i2 + 1;
          }
          if (extIdx >= 0) {
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                end = i2;
              }
            } else {
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end)
        end = firstNonSlashEnd;
      else if (end === -1)
        end = path2.length;
      return path2.slice(start, end);
    }
    for (i2 = path2.length - 1; i2 >= 0; --i2) {
      if (path2.charCodeAt(i2) === 47) {
        if (!matchedSlash) {
          start = i2 + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i2 + 1;
      }
    }
    if (end === -1)
      return "";
    return path2.slice(start, end);
  },
  /**
   * Returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last
   * portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than
   * the first character of the basename of path, an empty string is returned.
   * @param path - The path to parse
   */
  extname(path2) {
    assertPath(path2);
    path2 = removeUrlParams(this.toPosix(path2));
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for (let i2 = path2.length - 1; i2 >= 0; --i2) {
      const code = path2.charCodeAt(i2);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i2 + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i2 + 1;
      }
      if (code === 46) {
        if (startDot === -1)
          startDot = i2;
        else if (preDotState !== 1)
          preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path2.slice(startDot, end);
  },
  /**
   * Parses a path into an object containing the 'root', `dir`, `base`, `ext`, and `name` properties.
   * @param path - The path to parse
   */
  parse(path2) {
    assertPath(path2);
    const ret = { root: "", dir: "", base: "", ext: "", name: "" };
    if (path2.length === 0)
      return ret;
    path2 = removeUrlParams(this.toPosix(path2));
    let code = path2.charCodeAt(0);
    const isAbsolute = this.isAbsolute(path2);
    let start;
    ret.root = this.rootname(path2);
    if (isAbsolute || this.hasProtocol(path2)) {
      start = 1;
    } else {
      start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i2 = path2.length - 1;
    let preDotState = 0;
    for (; i2 >= start; --i2) {
      code = path2.charCodeAt(i2);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i2 + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i2 + 1;
      }
      if (code === 46) {
        if (startDot === -1)
          startDot = i2;
        else if (preDotState !== 1)
          preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute)
          ret.base = ret.name = path2.slice(1, end);
        else
          ret.base = ret.name = path2.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path2.slice(1, startDot);
        ret.base = path2.slice(1, end);
      } else {
        ret.name = path2.slice(startPart, startDot);
        ret.base = path2.slice(startPart, end);
      }
      ret.ext = path2.slice(startDot, end);
    }
    ret.dir = this.dirname(path2);
    return ret;
  },
  sep: "/",
  delimiter: ":",
  joinExtensions: [".html"]
};
function processX(base, ids, depth, result, tags) {
  const id = ids[depth];
  for (let i2 = 0; i2 < id.length; i2++) {
    const value = id[i2];
    if (depth < ids.length - 1) {
      processX(base.replace(result[depth], value), ids, depth + 1, result, tags);
    } else {
      tags.push(base.replace(result[depth], value));
    }
  }
}
function createStringVariations(string) {
  const regex = /\{(.*?)\}/g;
  const result = string.match(regex);
  const tags = [];
  if (result) {
    const ids = [];
    result.forEach((vars) => {
      const split = vars.substring(1, vars.length - 1).split(",");
      ids.push(split);
    });
    processX(string, ids, 0, result, tags);
  } else {
    tags.push(string);
  }
  return tags;
}
const isSingleItem = (item) => !Array.isArray(item);
class Resolver {
  constructor() {
    this._defaultBundleIdentifierOptions = {
      connector: "-",
      createBundleAssetId: (bundleId, assetId) => `${bundleId}${this._bundleIdConnector}${assetId}`,
      extractAssetIdFromBundle: (bundleId, assetBundleId) => assetBundleId.replace(`${bundleId}${this._bundleIdConnector}`, "")
    };
    this._bundleIdConnector = this._defaultBundleIdentifierOptions.connector;
    this._createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId;
    this._extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle;
    this._assetMap = {};
    this._preferredOrder = [];
    this._parsers = [];
    this._resolverHash = {};
    this._bundles = {};
  }
  /**
   * Override how the resolver deals with generating bundle ids.
   * must be called before any bundles are added
   * @param bundleIdentifier - the bundle identifier options
   */
  setBundleIdentifier(bundleIdentifier) {
    this._bundleIdConnector = bundleIdentifier.connector ?? this._bundleIdConnector;
    this._createBundleAssetId = bundleIdentifier.createBundleAssetId ?? this._createBundleAssetId;
    this._extractAssetIdFromBundle = bundleIdentifier.extractAssetIdFromBundle ?? this._extractAssetIdFromBundle;
    if (this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar") {
      throw new Error("[Resolver] GenerateBundleAssetId are not working correctly");
    }
  }
  /**
   * Let the resolver know which assets you prefer to use when resolving assets.
   * Multiple prefer user defined rules can be added.
   * @example
   * resolver.prefer({
   *     // first look for something with the correct format, and then then correct resolution
   *     priority: ['format', 'resolution'],
   *     params:{
   *         format:'webp', // prefer webp images
   *         resolution: 2, // prefer a resolution of 2
   *     }
   * })
   * resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);
   * resolver.resolveUrl('foo') // => 'bar@2x.webp'
   * @param preferOrders - the prefer options
   */
  prefer(...preferOrders) {
    preferOrders.forEach((prefer) => {
      this._preferredOrder.push(prefer);
      if (!prefer.priority) {
        prefer.priority = Object.keys(prefer.params);
      }
    });
    this._resolverHash = {};
  }
  /**
   * Set the base path to prepend to all urls when resolving
   * @example
   * resolver.basePath = 'https://home.com/';
   * resolver.add('foo', 'bar.ong');
   * resolver.resolveUrl('foo', 'bar.png'); // => 'https://home.com/bar.png'
   * @param basePath - the base path to use
   */
  set basePath(basePath) {
    this._basePath = basePath;
  }
  get basePath() {
    return this._basePath;
  }
  /**
   * Set the root path for root-relative URLs. By default the `basePath`'s root is used. If no `basePath` is set, then the
   * default value for browsers is `window.location.origin`
   * @example
   * // Application hosted on https://home.com/some-path/index.html
   * resolver.basePath = 'https://home.com/some-path/';
   * resolver.rootPath = 'https://home.com/';
   * resolver.add('foo', '/bar.png');
   * resolver.resolveUrl('foo', '/bar.png'); // => 'https://home.com/bar.png'
   * @param rootPath - the root path to use
   */
  set rootPath(rootPath) {
    this._rootPath = rootPath;
  }
  get rootPath() {
    return this._rootPath;
  }
  /**
   * All the active URL parsers that help the parser to extract information and create
   * an asset object-based on parsing the URL itself.
   *
   * Can be added using the extensions API
   * @example
   * resolver.add('foo', [
   *     {
   *         resolution: 2,
   *         format: 'png',
   *         src: 'image@2x.png',
   *     },
   *     {
   *         resolution:1,
   *         format:'png',
   *         src: 'image.png',
   *     },
   * ]);
   *
   * // With a url parser the information such as resolution and file format could extracted from the url itself:
   * extensions.add({
   *     extension: ExtensionType.ResolveParser,
   *     test: loadTextures.test, // test if url ends in an image
   *     parse: (value: string) =>
   *     ({
   *         resolution: parseFloat(Resolver.RETINA_PREFIX.exec(value)?.[1] ?? '1'),
   *         format: value.split('.').pop(),
   *         src: value,
   *     }),
   * });
   *
   * // Now resolution and format can be extracted from the url
   * resolver.add('foo', [
   *     'image@2x.png',
   *     'image.png',
   * ]);
   */
  get parsers() {
    return this._parsers;
  }
  /** Used for testing, this resets the resolver to its initial state */
  reset() {
    this.setBundleIdentifier(this._defaultBundleIdentifierOptions);
    this._assetMap = {};
    this._preferredOrder = [];
    this._resolverHash = {};
    this._rootPath = null;
    this._basePath = null;
    this._manifest = null;
    this._bundles = {};
    this._defaultSearchParams = null;
  }
  /**
   * Sets the default URL search parameters for the URL resolver. The urls can be specified as a string or an object.
   * @param searchParams - the default url parameters to append when resolving urls
   */
  setDefaultSearchParams(searchParams) {
    if (typeof searchParams === "string") {
      this._defaultSearchParams = searchParams;
    } else {
      const queryValues = searchParams;
      this._defaultSearchParams = Object.keys(queryValues).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryValues[key])}`).join("&");
    }
  }
  /**
   * Returns the aliases for a given asset
   * @param asset - the asset to get the aliases for
   */
  getAlias(asset) {
    const { alias, src } = asset;
    const aliasesToUse = convertToList(
      alias || src,
      (value) => {
        if (typeof value === "string")
          return value;
        if (Array.isArray(value))
          return value.map((v2) => (v2 == null ? void 0 : v2.src) ?? v2);
        if (value == null ? void 0 : value.src)
          return value.src;
        return value;
      },
      true
    );
    return aliasesToUse;
  }
  /**
   * Add a manifest to the asset resolver. This is a nice way to add all the asset information in one go.
   * generally a manifest would be built using a tool.
   * @param manifest - the manifest to add to the resolver
   */
  addManifest(manifest) {
    if (this._manifest) {
      warn("[Resolver] Manifest already exists, this will be overwritten");
    }
    this._manifest = manifest;
    manifest.bundles.forEach((bundle) => {
      this.addBundle(bundle.name, bundle.assets);
    });
  }
  /**
   * This adds a bundle of assets in one go so that you can resolve them as a group.
   * For example you could add a bundle for each screen in you pixi app
   * @example
   * resolver.addBundle('animals', [
   *  { alias: 'bunny', src: 'bunny.png' },
   *  { alias: 'chicken', src: 'chicken.png' },
   *  { alias: 'thumper', src: 'thumper.png' },
   * ]);
   * // or
   * resolver.addBundle('animals', {
   *     bunny: 'bunny.png',
   *     chicken: 'chicken.png',
   *     thumper: 'thumper.png',
   * });
   *
   * const resolvedAssets = await resolver.resolveBundle('animals');
   * @param bundleId - The id of the bundle to add
   * @param assets - A record of the asset or assets that will be chosen from when loading via the specified key
   */
  addBundle(bundleId, assets) {
    const assetNames = [];
    let convertedAssets = assets;
    if (!Array.isArray(assets)) {
      convertedAssets = Object.entries(assets).map(([alias, src]) => {
        if (typeof src === "string" || Array.isArray(src)) {
          return { alias, src };
        }
        return { alias, ...src };
      });
    }
    convertedAssets.forEach((asset) => {
      const srcs = asset.src;
      const aliases = asset.alias;
      let ids;
      if (typeof aliases === "string") {
        const bundleAssetId = this._createBundleAssetId(bundleId, aliases);
        assetNames.push(bundleAssetId);
        ids = [aliases, bundleAssetId];
      } else {
        const bundleIds = aliases.map((name) => this._createBundleAssetId(bundleId, name));
        assetNames.push(...bundleIds);
        ids = [...aliases, ...bundleIds];
      }
      this.add({
        ...asset,
        ...{
          alias: ids,
          src: srcs
        }
      });
    });
    this._bundles[bundleId] = assetNames;
  }
  /**
   * Tells the resolver what keys are associated with witch asset.
   * The most important thing the resolver does
   * @example
   * // Single key, single asset:
   * resolver.add({alias: 'foo', src: 'bar.png');
   * resolver.resolveUrl('foo') // => 'bar.png'
   *
   * // Multiple keys, single asset:
   * resolver.add({alias: ['foo', 'boo'], src: 'bar.png'});
   * resolver.resolveUrl('foo') // => 'bar.png'
   * resolver.resolveUrl('boo') // => 'bar.png'
   *
   * // Multiple keys, multiple assets:
   * resolver.add({alias: ['foo', 'boo'], src: ['bar.png', 'bar.webp']});
   * resolver.resolveUrl('foo') // => 'bar.png'
   *
   * // Add custom data attached to the resolver
   * Resolver.add({
   *     alias: 'bunnyBooBooSmooth',
   *     src: 'bunny{png,webp}',
   *     data: { scaleMode:SCALE_MODES.NEAREST }, // Base texture options
   * });
   *
   * resolver.resolve('bunnyBooBooSmooth') // => { src: 'bunny.png', data: { scaleMode: SCALE_MODES.NEAREST } }
   * @param aliases - the UnresolvedAsset or array of UnresolvedAssets to add to the resolver
   */
  add(aliases) {
    const assets = [];
    if (Array.isArray(aliases)) {
      assets.push(...aliases);
    } else {
      assets.push(aliases);
    }
    let keyCheck;
    keyCheck = (key) => {
      if (this.hasKey(key)) {
        warn(`[Resolver] already has key: ${key} overwriting`);
      }
    };
    const assetArray = convertToList(assets);
    assetArray.forEach((asset) => {
      const { src } = asset;
      let { data, format, loadParser } = asset;
      const srcsToUse = convertToList(src).map((src2) => {
        if (typeof src2 === "string") {
          return createStringVariations(src2);
        }
        return Array.isArray(src2) ? src2 : [src2];
      });
      const aliasesToUse = this.getAlias(asset);
      Array.isArray(aliasesToUse) ? aliasesToUse.forEach(keyCheck) : keyCheck(aliasesToUse);
      const resolvedAssets = [];
      srcsToUse.forEach((srcs) => {
        srcs.forEach((src2) => {
          let formattedAsset = {};
          if (typeof src2 !== "object") {
            formattedAsset.src = src2;
            for (let i2 = 0; i2 < this._parsers.length; i2++) {
              const parser = this._parsers[i2];
              if (parser.test(src2)) {
                formattedAsset = parser.parse(src2);
                break;
              }
            }
          } else {
            data = src2.data ?? data;
            format = src2.format ?? format;
            loadParser = src2.loadParser ?? loadParser;
            formattedAsset = {
              ...formattedAsset,
              ...src2
            };
          }
          if (!aliasesToUse) {
            throw new Error(`[Resolver] alias is undefined for this asset: ${formattedAsset.src}`);
          }
          formattedAsset = this._buildResolvedAsset(formattedAsset, {
            aliases: aliasesToUse,
            data,
            format,
            loadParser
          });
          resolvedAssets.push(formattedAsset);
        });
      });
      aliasesToUse.forEach((alias) => {
        this._assetMap[alias] = resolvedAssets;
      });
    });
  }
  // TODO: this needs an overload like load did in Assets
  /**
   * If the resolver has had a manifest set via setManifest, this will return the assets urls for
   * a given bundleId or bundleIds.
   * @example
   * // Manifest Example
   * const manifest = {
   *     bundles: [
   *         {
   *             name: 'load-screen',
   *             assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'sunset.png',
   *                 },
   *                 {
   *                     alias: 'bar',
   *                     src: 'load-bar.{png,webp}',
   *                 },
   *             ],
   *         },
   *         {
   *             name: 'game-screen',
   *             assets: [
   *                 {
   *                     alias: 'character',
   *                     src: 'robot.png',
   *                 },
   *                 {
   *                     alias: 'enemy',
   *                     src: 'bad-guy.png',
   *                 },
   *             ],
   *         },
   *     ]
   * };
   *
   * resolver.setManifest(manifest);
   * const resolved = resolver.resolveBundle('load-screen');
   * @param bundleIds - The bundle ids to resolve
   * @returns All the bundles assets or a hash of assets for each bundle specified
   */
  resolveBundle(bundleIds) {
    const singleAsset = isSingleItem(bundleIds);
    bundleIds = convertToList(bundleIds);
    const out = {};
    bundleIds.forEach((bundleId) => {
      const assetNames = this._bundles[bundleId];
      if (assetNames) {
        const results = this.resolve(assetNames);
        const assets = {};
        for (const key in results) {
          const asset = results[key];
          assets[this._extractAssetIdFromBundle(bundleId, key)] = asset;
        }
        out[bundleId] = assets;
      }
    });
    return singleAsset ? out[bundleIds[0]] : out;
  }
  /**
   * Does exactly what resolve does, but returns just the URL rather than the whole asset object
   * @param key - The key or keys to resolve
   * @returns - The URLs associated with the key(s)
   */
  resolveUrl(key) {
    const result = this.resolve(key);
    if (typeof key !== "string") {
      const out = {};
      for (const i2 in result) {
        out[i2] = result[i2].src;
      }
      return out;
    }
    return result.src;
  }
  resolve(keys) {
    const singleAsset = isSingleItem(keys);
    keys = convertToList(keys);
    const result = {};
    keys.forEach((key) => {
      if (!this._resolverHash[key]) {
        if (this._assetMap[key]) {
          let assets = this._assetMap[key];
          const preferredOrder = this._getPreferredOrder(assets);
          preferredOrder == null ? void 0 : preferredOrder.priority.forEach((priorityKey) => {
            preferredOrder.params[priorityKey].forEach((value) => {
              const filteredAssets = assets.filter((asset) => {
                if (asset[priorityKey]) {
                  return asset[priorityKey] === value;
                }
                return false;
              });
              if (filteredAssets.length) {
                assets = filteredAssets;
              }
            });
          });
          this._resolverHash[key] = assets[0];
        } else {
          this._resolverHash[key] = this._buildResolvedAsset({
            alias: [key],
            src: key
          }, {});
        }
      }
      result[key] = this._resolverHash[key];
    });
    return singleAsset ? result[keys[0]] : result;
  }
  /**
   * Checks if an asset with a given key exists in the resolver
   * @param key - The key of the asset
   */
  hasKey(key) {
    return !!this._assetMap[key];
  }
  /**
   * Checks if a bundle with the given key exists in the resolver
   * @param key - The key of the bundle
   */
  hasBundle(key) {
    return !!this._bundles[key];
  }
  /**
   * Internal function for figuring out what prefer criteria an asset should use.
   * @param assets
   */
  _getPreferredOrder(assets) {
    for (let i2 = 0; i2 < assets.length; i2++) {
      const asset = assets[i2];
      const preferred = this._preferredOrder.find((preference) => preference.params.format.includes(asset.format));
      if (preferred) {
        return preferred;
      }
    }
    return this._preferredOrder[0];
  }
  /**
   * Appends the default url parameters to the url
   * @param url - The url to append the default parameters to
   * @returns - The url with the default parameters appended
   */
  _appendDefaultSearchParams(url) {
    if (!this._defaultSearchParams)
      return url;
    const paramConnector = /\?/.test(url) ? "&" : "?";
    return `${url}${paramConnector}${this._defaultSearchParams}`;
  }
  _buildResolvedAsset(formattedAsset, data) {
    const { aliases, data: assetData, loadParser, format } = data;
    if (this._basePath || this._rootPath) {
      formattedAsset.src = path.toAbsolute(formattedAsset.src, this._basePath, this._rootPath);
    }
    formattedAsset.alias = aliases ?? formattedAsset.alias ?? [formattedAsset.src];
    formattedAsset.src = this._appendDefaultSearchParams(formattedAsset.src);
    formattedAsset.data = { ...assetData || {}, ...formattedAsset.data };
    formattedAsset.loadParser = loadParser ?? formattedAsset.loadParser;
    formattedAsset.format = format ?? formattedAsset.format ?? getUrlExtension(formattedAsset.src);
    return formattedAsset;
  }
}
Resolver.RETINA_PREFIX = /@([0-9\.]+)x/;
function getUrlExtension(url) {
  return url.split(".").pop().split("?").shift().split("#").shift();
}
const copySearchParams = (targetUrl, sourceUrl) => {
  const searchParams = sourceUrl.split("?")[1];
  if (searchParams) {
    targetUrl += `?${searchParams}`;
  }
  return targetUrl;
};
const _Spritesheet = class _Spritesheet2 {
  /**
   * @param texture - Reference to the source BaseTexture object.
   * @param {object} data - Spritesheet image data.
   */
  constructor(texture, data) {
    this.linkedSheets = [];
    this._texture = texture instanceof Texture ? texture : null;
    this.textureSource = texture.source;
    this.textures = {};
    this.animations = {};
    this.data = data;
    const metaResolution = parseFloat(data.meta.scale);
    if (metaResolution) {
      this.resolution = metaResolution;
      texture.source.resolution = this.resolution;
    } else {
      this.resolution = texture.source._resolution;
    }
    this._frames = this.data.frames;
    this._frameKeys = Object.keys(this._frames);
    this._batchIndex = 0;
    this._callback = null;
  }
  /**
   * Parser spritesheet from loaded data. This is done asynchronously
   * to prevent creating too many Texture within a single process.
   */
  parse() {
    return new Promise((resolve) => {
      this._callback = resolve;
      this._batchIndex = 0;
      if (this._frameKeys.length <= _Spritesheet2.BATCH_SIZE) {
        this._processFrames(0);
        this._processAnimations();
        this._parseComplete();
      } else {
        this._nextBatch();
      }
    });
  }
  /**
   * Process a batch of frames
   * @param initialFrameIndex - The index of frame to start.
   */
  _processFrames(initialFrameIndex) {
    let frameIndex = initialFrameIndex;
    const maxFrames = _Spritesheet2.BATCH_SIZE;
    while (frameIndex - initialFrameIndex < maxFrames && frameIndex < this._frameKeys.length) {
      const i2 = this._frameKeys[frameIndex];
      const data = this._frames[i2];
      const rect = data.frame;
      if (rect) {
        let frame = null;
        let trim = null;
        const sourceSize = data.trimmed !== false && data.sourceSize ? data.sourceSize : data.frame;
        const orig = new Rectangle(
          0,
          0,
          Math.floor(sourceSize.w) / this.resolution,
          Math.floor(sourceSize.h) / this.resolution
        );
        if (data.rotated) {
          frame = new Rectangle(
            Math.floor(rect.x) / this.resolution,
            Math.floor(rect.y) / this.resolution,
            Math.floor(rect.h) / this.resolution,
            Math.floor(rect.w) / this.resolution
          );
        } else {
          frame = new Rectangle(
            Math.floor(rect.x) / this.resolution,
            Math.floor(rect.y) / this.resolution,
            Math.floor(rect.w) / this.resolution,
            Math.floor(rect.h) / this.resolution
          );
        }
        if (data.trimmed !== false && data.spriteSourceSize) {
          trim = new Rectangle(
            Math.floor(data.spriteSourceSize.x) / this.resolution,
            Math.floor(data.spriteSourceSize.y) / this.resolution,
            Math.floor(rect.w) / this.resolution,
            Math.floor(rect.h) / this.resolution
          );
        }
        this.textures[i2] = new Texture({
          source: this.textureSource,
          frame,
          orig,
          trim,
          rotate: data.rotated ? 2 : 0,
          defaultAnchor: data.anchor,
          defaultBorders: data.borders,
          label: i2.toString()
        });
      }
      frameIndex++;
    }
  }
  /** Parse animations config. */
  _processAnimations() {
    const animations = this.data.animations || {};
    for (const animName in animations) {
      this.animations[animName] = [];
      for (let i2 = 0; i2 < animations[animName].length; i2++) {
        const frameName = animations[animName][i2];
        this.animations[animName].push(this.textures[frameName]);
      }
    }
  }
  /** The parse has completed. */
  _parseComplete() {
    const callback = this._callback;
    this._callback = null;
    this._batchIndex = 0;
    callback.call(this, this.textures);
  }
  /** Begin the next batch of textures. */
  _nextBatch() {
    this._processFrames(this._batchIndex * _Spritesheet2.BATCH_SIZE);
    this._batchIndex++;
    setTimeout(() => {
      if (this._batchIndex * _Spritesheet2.BATCH_SIZE < this._frameKeys.length) {
        this._nextBatch();
      } else {
        this._processAnimations();
        this._parseComplete();
      }
    }, 0);
  }
  /**
   * Destroy Spritesheet and don't use after this.
   * @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
   */
  destroy(destroyBase = false) {
    var _a;
    for (const i2 in this.textures) {
      this.textures[i2].destroy();
    }
    this._frames = null;
    this._frameKeys = null;
    this.data = null;
    this.textures = null;
    if (destroyBase) {
      (_a = this._texture) == null ? void 0 : _a.destroy();
      this.textureSource.destroy();
    }
    this._texture = null;
    this.textureSource = null;
    this.linkedSheets = [];
  }
};
_Spritesheet.BATCH_SIZE = 1e3;
let Spritesheet = _Spritesheet;
const validImages = [
  "jpg",
  "png",
  "jpeg",
  "avif",
  "webp",
  "basis",
  "etc2",
  "bc7",
  "bc6h",
  "bc5",
  "bc4",
  "bc3",
  "bc2",
  "bc1",
  "eac",
  "astc"
];
function getCacheableAssets(keys, asset, ignoreMultiPack) {
  const out = {};
  keys.forEach((key) => {
    out[key] = asset;
  });
  Object.keys(asset.textures).forEach((key) => {
    out[key] = asset.textures[key];
  });
  if (!ignoreMultiPack) {
    const basePath = path.dirname(keys[0]);
    asset.linkedSheets.forEach((item, i2) => {
      const out2 = getCacheableAssets([`${basePath}/${asset.data.meta.related_multi_packs[i2]}`], item, true);
      Object.assign(out, out2);
    });
  }
  return out;
}
const spritesheetAsset = {
  extension: ExtensionType.Asset,
  /** Handle the caching of the related Spritesheet Textures */
  cache: {
    test: (asset) => asset instanceof Spritesheet,
    getCacheableAssets: (keys, asset) => getCacheableAssets(keys, asset, false)
  },
  /** Resolve the resolution of the asset. */
  resolver: {
    extension: {
      type: ExtensionType.ResolveParser,
      name: "resolveSpritesheet"
    },
    test: (value) => {
      const tempURL = value.split("?")[0];
      const split = tempURL.split(".");
      const extension = split.pop();
      const format = split.pop();
      return extension === "json" && validImages.includes(format);
    },
    parse: (value) => {
      var _a;
      const split = value.split(".");
      return {
        resolution: parseFloat(((_a = Resolver.RETINA_PREFIX.exec(value)) == null ? void 0 : _a[1]) ?? "1"),
        format: split[split.length - 2],
        src: value
      };
    }
  },
  /**
   * Loader plugin that parses sprite sheets!
   * once the JSON has been loaded this checks to see if the JSON is spritesheet data.
   * If it is, we load the spritesheets image and parse the data into Spritesheet
   * All textures in the sprite sheet are then added to the cache
   */
  loader: {
    name: "spritesheetLoader",
    extension: {
      type: ExtensionType.LoadParser,
      priority: LoaderParserPriority.Normal,
      name: "spritesheetLoader"
    },
    async testParse(asset, options) {
      return path.extname(options.src).toLowerCase() === ".json" && !!asset.frames;
    },
    async parse(asset, options, loader) {
      var _a, _b;
      const {
        texture: imageTexture,
        // if user need to use preloaded texture
        imageFilename,
        // if user need to use custom filename (not from jsonFile.meta.image)
        textureOptions
        // if user need to set texture options on texture
      } = (options == null ? void 0 : options.data) ?? {};
      let basePath = path.dirname(options.src);
      if (basePath && basePath.lastIndexOf("/") !== basePath.length - 1) {
        basePath += "/";
      }
      let texture;
      if (imageTexture instanceof Texture) {
        texture = imageTexture;
      } else {
        const imagePath = copySearchParams(basePath + (imageFilename ?? asset.meta.image), options.src);
        const assets = await loader.load([{ src: imagePath, data: textureOptions }]);
        texture = assets[imagePath];
      }
      const spritesheet = new Spritesheet(
        texture.source,
        asset
      );
      await spritesheet.parse();
      const multiPacks = (_a = asset == null ? void 0 : asset.meta) == null ? void 0 : _a.related_multi_packs;
      if (Array.isArray(multiPacks)) {
        const promises = [];
        for (const item of multiPacks) {
          if (typeof item !== "string") {
            continue;
          }
          let itemUrl = basePath + item;
          if ((_b = options.data) == null ? void 0 : _b.ignoreMultiPack) {
            continue;
          }
          itemUrl = copySearchParams(itemUrl, options.src);
          promises.push(loader.load({
            src: itemUrl,
            data: {
              textureOptions,
              ignoreMultiPack: true
            }
          }));
        }
        const res = await Promise.all(promises);
        spritesheet.linkedSheets = res;
        res.forEach((item) => {
          item.linkedSheets = [spritesheet].concat(spritesheet.linkedSheets.filter((sp) => sp !== item));
        });
      }
      return spritesheet;
    },
    async unload(spritesheet, _resolvedAsset, loader) {
      await loader.unload(spritesheet.textureSource._sourceOrigin);
      spritesheet.destroy(false);
    }
  }
};
extensions.add(spritesheetAsset);
var earcut$2 = { exports: {} };
earcut$2.exports = earcut;
earcut$2.exports.default = earcut;
function earcut(data, holeIndices, dim) {
  dim = dim || 2;
  var hasHoles = holeIndices && holeIndices.length, outerLen = hasHoles ? holeIndices[0] * dim : data.length, outerNode = linkedList(data, 0, outerLen, dim, true), triangles = [];
  if (!outerNode || outerNode.next === outerNode.prev) return triangles;
  var minX, minY, maxX, maxY, x2, y2, invSize;
  if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
  if (data.length > 80 * dim) {
    minX = maxX = data[0];
    minY = maxY = data[1];
    for (var i2 = dim; i2 < outerLen; i2 += dim) {
      x2 = data[i2];
      y2 = data[i2 + 1];
      if (x2 < minX) minX = x2;
      if (y2 < minY) minY = y2;
      if (x2 > maxX) maxX = x2;
      if (y2 > maxY) maxY = y2;
    }
    invSize = Math.max(maxX - minX, maxY - minY);
    invSize = invSize !== 0 ? 32767 / invSize : 0;
  }
  earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);
  return triangles;
}
function linkedList(data, start, end, dim, clockwise) {
  var i2, last;
  if (clockwise === signedArea(data, start, end, dim) > 0) {
    for (i2 = start; i2 < end; i2 += dim) last = insertNode(i2, data[i2], data[i2 + 1], last);
  } else {
    for (i2 = end - dim; i2 >= start; i2 -= dim) last = insertNode(i2, data[i2], data[i2 + 1], last);
  }
  if (last && equals(last, last.next)) {
    removeNode(last);
    last = last.next;
  }
  return last;
}
function filterPoints(start, end) {
  if (!start) return start;
  if (!end) end = start;
  var p2 = start, again;
  do {
    again = false;
    if (!p2.steiner && (equals(p2, p2.next) || area(p2.prev, p2, p2.next) === 0)) {
      removeNode(p2);
      p2 = end = p2.prev;
      if (p2 === p2.next) break;
      again = true;
    } else {
      p2 = p2.next;
    }
  } while (again || p2 !== end);
  return end;
}
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
  if (!ear) return;
  if (!pass && invSize) indexCurve(ear, minX, minY, invSize);
  var stop = ear, prev, next;
  while (ear.prev !== ear.next) {
    prev = ear.prev;
    next = ear.next;
    if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
      triangles.push(prev.i / dim | 0);
      triangles.push(ear.i / dim | 0);
      triangles.push(next.i / dim | 0);
      removeNode(ear);
      ear = next.next;
      stop = next.next;
      continue;
    }
    ear = next;
    if (ear === stop) {
      if (!pass) {
        earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
      } else if (pass === 1) {
        ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
        earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
      } else if (pass === 2) {
        splitEarcut(ear, triangles, dim, minX, minY, invSize);
      }
      break;
    }
  }
}
function isEar(ear) {
  var a2 = ear.prev, b2 = ear, c2 = ear.next;
  if (area(a2, b2, c2) >= 0) return false;
  var ax = a2.x, bx = b2.x, cx = c2.x, ay = a2.y, by = b2.y, cy = c2.y;
  var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
  var p2 = c2.next;
  while (p2 !== a2) {
    if (p2.x >= x0 && p2.x <= x1 && p2.y >= y0 && p2.y <= y1 && pointInTriangle(ax, ay, bx, by, cx, cy, p2.x, p2.y) && area(p2.prev, p2, p2.next) >= 0) return false;
    p2 = p2.next;
  }
  return true;
}
function isEarHashed(ear, minX, minY, invSize) {
  var a2 = ear.prev, b2 = ear, c2 = ear.next;
  if (area(a2, b2, c2) >= 0) return false;
  var ax = a2.x, bx = b2.x, cx = c2.x, ay = a2.y, by = b2.y, cy = c2.y;
  var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
  var minZ = zOrder(x0, y0, minX, minY, invSize), maxZ = zOrder(x1, y1, minX, minY, invSize);
  var p2 = ear.prevZ, n2 = ear.nextZ;
  while (p2 && p2.z >= minZ && n2 && n2.z <= maxZ) {
    if (p2.x >= x0 && p2.x <= x1 && p2.y >= y0 && p2.y <= y1 && p2 !== a2 && p2 !== c2 && pointInTriangle(ax, ay, bx, by, cx, cy, p2.x, p2.y) && area(p2.prev, p2, p2.next) >= 0) return false;
    p2 = p2.prevZ;
    if (n2.x >= x0 && n2.x <= x1 && n2.y >= y0 && n2.y <= y1 && n2 !== a2 && n2 !== c2 && pointInTriangle(ax, ay, bx, by, cx, cy, n2.x, n2.y) && area(n2.prev, n2, n2.next) >= 0) return false;
    n2 = n2.nextZ;
  }
  while (p2 && p2.z >= minZ) {
    if (p2.x >= x0 && p2.x <= x1 && p2.y >= y0 && p2.y <= y1 && p2 !== a2 && p2 !== c2 && pointInTriangle(ax, ay, bx, by, cx, cy, p2.x, p2.y) && area(p2.prev, p2, p2.next) >= 0) return false;
    p2 = p2.prevZ;
  }
  while (n2 && n2.z <= maxZ) {
    if (n2.x >= x0 && n2.x <= x1 && n2.y >= y0 && n2.y <= y1 && n2 !== a2 && n2 !== c2 && pointInTriangle(ax, ay, bx, by, cx, cy, n2.x, n2.y) && area(n2.prev, n2, n2.next) >= 0) return false;
    n2 = n2.nextZ;
  }
  return true;
}
function cureLocalIntersections(start, triangles, dim) {
  var p2 = start;
  do {
    var a2 = p2.prev, b2 = p2.next.next;
    if (!equals(a2, b2) && intersects(a2, p2, p2.next, b2) && locallyInside(a2, b2) && locallyInside(b2, a2)) {
      triangles.push(a2.i / dim | 0);
      triangles.push(p2.i / dim | 0);
      triangles.push(b2.i / dim | 0);
      removeNode(p2);
      removeNode(p2.next);
      p2 = start = b2;
    }
    p2 = p2.next;
  } while (p2 !== start);
  return filterPoints(p2);
}
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
  var a2 = start;
  do {
    var b2 = a2.next.next;
    while (b2 !== a2.prev) {
      if (a2.i !== b2.i && isValidDiagonal(a2, b2)) {
        var c2 = splitPolygon(a2, b2);
        a2 = filterPoints(a2, a2.next);
        c2 = filterPoints(c2, c2.next);
        earcutLinked(a2, triangles, dim, minX, minY, invSize, 0);
        earcutLinked(c2, triangles, dim, minX, minY, invSize, 0);
        return;
      }
      b2 = b2.next;
    }
    a2 = a2.next;
  } while (a2 !== start);
}
function eliminateHoles(data, holeIndices, outerNode, dim) {
  var queue = [], i2, len, start, end, list;
  for (i2 = 0, len = holeIndices.length; i2 < len; i2++) {
    start = holeIndices[i2] * dim;
    end = i2 < len - 1 ? holeIndices[i2 + 1] * dim : data.length;
    list = linkedList(data, start, end, dim, false);
    if (list === list.next) list.steiner = true;
    queue.push(getLeftmost(list));
  }
  queue.sort(compareX);
  for (i2 = 0; i2 < queue.length; i2++) {
    outerNode = eliminateHole(queue[i2], outerNode);
  }
  return outerNode;
}
function compareX(a2, b2) {
  return a2.x - b2.x;
}
function eliminateHole(hole, outerNode) {
  var bridge = findHoleBridge(hole, outerNode);
  if (!bridge) {
    return outerNode;
  }
  var bridgeReverse = splitPolygon(bridge, hole);
  filterPoints(bridgeReverse, bridgeReverse.next);
  return filterPoints(bridge, bridge.next);
}
function findHoleBridge(hole, outerNode) {
  var p2 = outerNode, hx = hole.x, hy = hole.y, qx = -Infinity, m2;
  do {
    if (hy <= p2.y && hy >= p2.next.y && p2.next.y !== p2.y) {
      var x2 = p2.x + (hy - p2.y) * (p2.next.x - p2.x) / (p2.next.y - p2.y);
      if (x2 <= hx && x2 > qx) {
        qx = x2;
        m2 = p2.x < p2.next.x ? p2 : p2.next;
        if (x2 === hx) return m2;
      }
    }
    p2 = p2.next;
  } while (p2 !== outerNode);
  if (!m2) return null;
  var stop = m2, mx = m2.x, my = m2.y, tanMin = Infinity, tan;
  p2 = m2;
  do {
    if (hx >= p2.x && p2.x >= mx && hx !== p2.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p2.x, p2.y)) {
      tan = Math.abs(hy - p2.y) / (hx - p2.x);
      if (locallyInside(p2, hole) && (tan < tanMin || tan === tanMin && (p2.x > m2.x || p2.x === m2.x && sectorContainsSector(m2, p2)))) {
        m2 = p2;
        tanMin = tan;
      }
    }
    p2 = p2.next;
  } while (p2 !== stop);
  return m2;
}
function sectorContainsSector(m2, p2) {
  return area(m2.prev, m2, p2.prev) < 0 && area(p2.next, m2, m2.next) < 0;
}
function indexCurve(start, minX, minY, invSize) {
  var p2 = start;
  do {
    if (p2.z === 0) p2.z = zOrder(p2.x, p2.y, minX, minY, invSize);
    p2.prevZ = p2.prev;
    p2.nextZ = p2.next;
    p2 = p2.next;
  } while (p2 !== start);
  p2.prevZ.nextZ = null;
  p2.prevZ = null;
  sortLinked(p2);
}
function sortLinked(list) {
  var i2, p2, q, e2, tail, numMerges, pSize, qSize, inSize = 1;
  do {
    p2 = list;
    list = null;
    tail = null;
    numMerges = 0;
    while (p2) {
      numMerges++;
      q = p2;
      pSize = 0;
      for (i2 = 0; i2 < inSize; i2++) {
        pSize++;
        q = q.nextZ;
        if (!q) break;
      }
      qSize = inSize;
      while (pSize > 0 || qSize > 0 && q) {
        if (pSize !== 0 && (qSize === 0 || !q || p2.z <= q.z)) {
          e2 = p2;
          p2 = p2.nextZ;
          pSize--;
        } else {
          e2 = q;
          q = q.nextZ;
          qSize--;
        }
        if (tail) tail.nextZ = e2;
        else list = e2;
        e2.prevZ = tail;
        tail = e2;
      }
      p2 = q;
    }
    tail.nextZ = null;
    inSize *= 2;
  } while (numMerges > 1);
  return list;
}
function zOrder(x2, y2, minX, minY, invSize) {
  x2 = (x2 - minX) * invSize | 0;
  y2 = (y2 - minY) * invSize | 0;
  x2 = (x2 | x2 << 8) & 16711935;
  x2 = (x2 | x2 << 4) & 252645135;
  x2 = (x2 | x2 << 2) & 858993459;
  x2 = (x2 | x2 << 1) & 1431655765;
  y2 = (y2 | y2 << 8) & 16711935;
  y2 = (y2 | y2 << 4) & 252645135;
  y2 = (y2 | y2 << 2) & 858993459;
  y2 = (y2 | y2 << 1) & 1431655765;
  return x2 | y2 << 1;
}
function getLeftmost(start) {
  var p2 = start, leftmost = start;
  do {
    if (p2.x < leftmost.x || p2.x === leftmost.x && p2.y < leftmost.y) leftmost = p2;
    p2 = p2.next;
  } while (p2 !== start);
  return leftmost;
}
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
  return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
}
function isValidDiagonal(a2, b2) {
  return a2.next.i !== b2.i && a2.prev.i !== b2.i && !intersectsPolygon(a2, b2) && // dones't intersect other edges
  (locallyInside(a2, b2) && locallyInside(b2, a2) && middleInside(a2, b2) && // locally visible
  (area(a2.prev, a2, b2.prev) || area(a2, b2.prev, b2)) || // does not create opposite-facing sectors
  equals(a2, b2) && area(a2.prev, a2, a2.next) > 0 && area(b2.prev, b2, b2.next) > 0);
}
function area(p2, q, r2) {
  return (q.y - p2.y) * (r2.x - q.x) - (q.x - p2.x) * (r2.y - q.y);
}
function equals(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}
function intersects(p1, q1, p2, q2) {
  var o1 = sign(area(p1, q1, p2));
  var o2 = sign(area(p1, q1, q2));
  var o3 = sign(area(p2, q2, p1));
  var o4 = sign(area(p2, q2, q1));
  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSegment(p1, p2, q1)) return true;
  if (o2 === 0 && onSegment(p1, q2, q1)) return true;
  if (o3 === 0 && onSegment(p2, p1, q2)) return true;
  if (o4 === 0 && onSegment(p2, q1, q2)) return true;
  return false;
}
function onSegment(p2, q, r2) {
  return q.x <= Math.max(p2.x, r2.x) && q.x >= Math.min(p2.x, r2.x) && q.y <= Math.max(p2.y, r2.y) && q.y >= Math.min(p2.y, r2.y);
}
function sign(num) {
  return num > 0 ? 1 : num < 0 ? -1 : 0;
}
function intersectsPolygon(a2, b2) {
  var p2 = a2;
  do {
    if (p2.i !== a2.i && p2.next.i !== a2.i && p2.i !== b2.i && p2.next.i !== b2.i && intersects(p2, p2.next, a2, b2)) return true;
    p2 = p2.next;
  } while (p2 !== a2);
  return false;
}
function locallyInside(a2, b2) {
  return area(a2.prev, a2, a2.next) < 0 ? area(a2, b2, a2.next) >= 0 && area(a2, a2.prev, b2) >= 0 : area(a2, b2, a2.prev) < 0 || area(a2, a2.next, b2) < 0;
}
function middleInside(a2, b2) {
  var p2 = a2, inside = false, px = (a2.x + b2.x) / 2, py = (a2.y + b2.y) / 2;
  do {
    if (p2.y > py !== p2.next.y > py && p2.next.y !== p2.y && px < (p2.next.x - p2.x) * (py - p2.y) / (p2.next.y - p2.y) + p2.x)
      inside = !inside;
    p2 = p2.next;
  } while (p2 !== a2);
  return inside;
}
function splitPolygon(a2, b2) {
  var a22 = new Node(a2.i, a2.x, a2.y), b22 = new Node(b2.i, b2.x, b2.y), an = a2.next, bp = b2.prev;
  a2.next = b2;
  b2.prev = a2;
  a22.next = an;
  an.prev = a22;
  b22.next = a22;
  a22.prev = b22;
  bp.next = b22;
  b22.prev = bp;
  return b22;
}
function insertNode(i2, x2, y2, last) {
  var p2 = new Node(i2, x2, y2);
  if (!last) {
    p2.prev = p2;
    p2.next = p2;
  } else {
    p2.next = last.next;
    p2.prev = last;
    last.next.prev = p2;
    last.next = p2;
  }
  return p2;
}
function removeNode(p2) {
  p2.next.prev = p2.prev;
  p2.prev.next = p2.next;
  if (p2.prevZ) p2.prevZ.nextZ = p2.nextZ;
  if (p2.nextZ) p2.nextZ.prevZ = p2.prevZ;
}
function Node(i2, x2, y2) {
  this.i = i2;
  this.x = x2;
  this.y = y2;
  this.prev = null;
  this.next = null;
  this.z = 0;
  this.prevZ = null;
  this.nextZ = null;
  this.steiner = false;
}
earcut.deviation = function(data, holeIndices, dim, triangles) {
  var hasHoles = holeIndices && holeIndices.length;
  var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
  var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
  if (hasHoles) {
    for (var i2 = 0, len = holeIndices.length; i2 < len; i2++) {
      var start = holeIndices[i2] * dim;
      var end = i2 < len - 1 ? holeIndices[i2 + 1] * dim : data.length;
      polygonArea -= Math.abs(signedArea(data, start, end, dim));
    }
  }
  var trianglesArea = 0;
  for (i2 = 0; i2 < triangles.length; i2 += 3) {
    var a2 = triangles[i2] * dim;
    var b2 = triangles[i2 + 1] * dim;
    var c2 = triangles[i2 + 2] * dim;
    trianglesArea += Math.abs(
      (data[a2] - data[c2]) * (data[b2 + 1] - data[a2 + 1]) - (data[a2] - data[b2]) * (data[c2 + 1] - data[a2 + 1])
    );
  }
  return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
};
function signedArea(data, start, end, dim) {
  var sum = 0;
  for (var i2 = start, j2 = end - dim; i2 < end; i2 += dim) {
    sum += (data[j2] - data[i2]) * (data[i2 + 1] + data[j2 + 1]);
    j2 = i2;
  }
  return sum;
}
earcut.flatten = function(data) {
  var dim = data[0][0].length, result = { vertices: [], holes: [], dimensions: dim }, holeIndex = 0;
  for (var i2 = 0; i2 < data.length; i2++) {
    for (var j2 = 0; j2 < data[i2].length; j2++) {
      for (var d2 = 0; d2 < dim; d2++) result.vertices.push(data[i2][j2][d2]);
    }
    if (i2 > 0) {
      holeIndex += data[i2 - 1].length;
      result.holes.push(holeIndex);
    }
  }
  return result;
};
var earcutExports = earcut$2.exports;
const earcut$1 = /* @__PURE__ */ getDefaultExportFromCjs(earcutExports);
extensions.add(browserExt, webworkerExt);
export {
  multiplyHexColors as $,
  DragEvents as A,
  AutorunEvaluationType as B,
  Container as C,
  DOMAdapter as D,
  ExtensionType as E,
  ClipPropertyEvaluationType as F,
  GraphicType as G,
  TimelineTriggerActivationType as H,
  ItemRequestStatus as I,
  TimelineTriggerPropertyKey as J,
  uid as K,
  LoaderParserPriority as L,
  deprecation as M,
  NodePropertyKey as N,
  v8_0_0 as O,
  Point as P,
  definedProps as Q,
  Color as R,
  SelectionType as S,
  Ticker as T,
  UPDATE_PRIORITY as U,
  Texture as V,
  ImageSource as W,
  Matrix as X,
  Rectangle as Y,
  Bounds as Z,
  __vitePreload as _,
  EventEmitter as a,
  earcut$1 as a0,
  BigPool as a1,
  InstructionSet as a2,
  v8_3_4 as a3,
  nextPow2 as a4,
  Cache as a5,
  TexturePool as a6,
  ViewContainer as a7,
  TextureStyle as a8,
  updateQuadBounds as a9,
  EditorMode as b,
  Events as c,
  buildHierarchy as d,
  extensions as e,
  TrackFunctionType as f,
  getFillColor as g,
  TrackEvaluationMethodType as h,
  ClipFunctionType as i,
  interpolateColor as j,
  deepClone as k,
  approximatelyEqual as l,
  debounce as m,
  LOCAL_STORAGE_KEY as n,
  ProjectItemAssetType as o,
  path as p,
  getParentNodes as q,
  removeItems as r,
  ContentType as s,
  getDefaultExportFromCjs as t,
  TextAlignType as u,
  TrackAssetPropertyType as v,
  warn as w,
  TriggerType as x,
  DropType as y,
  UndoMessage as z
};
//# sourceMappingURL=index.js.map
