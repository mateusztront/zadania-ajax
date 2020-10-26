// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/_api.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiLoadData = apiLoadData;
exports.apiAddUser = apiAddUser;
exports.apiDeleteUser = apiDeleteUser;
exports.apiUpdateUser = apiUpdateUser;
const apiUrl = "http://localhost:3000/users";

async function apiLoadData() {
  const response = await fetch(apiUrl);

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return Promise.reject('something went wrong!');
  }
}

async function apiAddUser(name, surname, email) {
  const response = await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify({
      first_name: name,
      last_name: surname,
      email: email
    }),
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    }
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return Promise.reject('something went wrong!');
  }
}

async function apiDeleteUser(id) {
  const response = await fetch(apiUrl + '/' + id, {
    method: "DELETE"
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return Promise.reject('something went wrong!');
  }
}

async function apiUpdateUser({
  id,
  name,
  surname,
  email
}) {
  const response = await fetch(apiUrl + '/' + id, {
    method: "PATCH",
    body: JSON.stringify({
      //takie sa klucze w bazie
      first_name: name,
      last_name: surname,
      email: email
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return Promise.reject('something went wrong!');
  }
}
},{}],"js/_pubsub.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pubsub = void 0;
const pubsub = {
  subscribers: {},

  subscribe(subject, fn) {
    if (this.subscribers[subject] === undefined) {
      this.subscribers[subject] = [];
    }

    this.subscribers[subject].push(fn);
  },

  unsubscribe(subject, fn) {
    if (this.subscribers[subject]) {
      const index = this.subscribers.findIndex(el => el === fn);
      this.subscribers[subject].splice(index, 1);
    }
  },

  emit(subject, data) {
    if (this.subscribers[subject]) {
      this.subscribers[subject].forEach(fn => fn(data));
    }
  }

};
exports.pubsub = pubsub;
},{}],"js/_list.js":[function(require,module,exports) {
"use strict";

var _api = require("./_api");

var _pubsub = require("./_pubsub");

const ul = document.querySelector(".users");

function getUserElementHTML({
  name,
  surname,
  email
}) {
  return `
        <div className="user-content">
            <p class="user-name">
                <span>Imię:</span>
                <strong data-name="name">${name}</strong>
            </p>
            <p class="user-surname">
                <span>Nazwisko:</span>
                <strong data-name="surname">${surname}</strong>
            </p>
            <p class="user-email">
                <span>Email:</span>
                <strong data-name="email">${email}</strong>
            </p>
        </div>
        <div class="user-actions">
            <button type="button" class="btn-edit" title="Edytuj">
                Edit
            </button>
            <button type="button" class="btn-delete" title="Usuń">
                Delete
            </button>
            <button type="button" class="btn-save" title="Zapisz" hidden>
                Save
            </buton>
            <button type="button" class="btn-cancel" title="Anuluj" hidden>
                Cancel
            </button>
        </div>
    `;
}

async function loadUserList() {
  ul.innerHTML = "";
  await (0, _api.apiLoadData)().then(res => {
    res.forEach(user => {
      const {
        first_name: name,
        last_name: surname,
        email,
        id
      } = user;
      const li = document.createElement('li');
      li.dataset.id = id;
      li.innerHTML = getUserElementHTML({
        name,
        surname,
        email
      });
      ul.prepend(li);
    });
  }).catch(err => {
    console.log(err);
  });
}

loadUserList();
document.addEventListener("click", e => {
  if (e.target.classList.contains("btn-delete")) {
    const li = e.target.closest("li");
    const id = li.dataset.id;
    (0, _api.apiDeleteUser)(id).then(res => {
      li.remove();
    });
  }

  if (e.target.classList.contains("btn-edit")) {
    const li = e.target.closest("li");
    const id = li.dataset.id;
    li.querySelector(".btn-save").hidden = false;
    li.querySelector(".btn-cancel").hidden = false;
    li.querySelector(".btn-edit").hidden = true;
    li.querySelector(".btn-delete").hidden = true;
    const name = li.querySelector("[data-name=name]");
    const surname = li.querySelector("[data-name=surname]");
    const email = li.querySelector("[data-name=email]");
    [name, surname, email].forEach(el => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = el.innerText;
      input.name = el.dataset.name;
      el.parentElement.replaceChild(input, el);
    });
  }

  if (e.target.classList.contains("btn-cancel")) {
    const li = e.target.closest("li");
    const id = li.dataset.id;
    li.querySelector(".btn-save").hidden = true;
    li.querySelector(".btn-cancel").hidden = true;
    li.querySelector(".btn-edit").hidden = false;
    li.querySelector(".btn-delete").hidden = false;
    const elName = li.querySelector("input[name=name]");
    const elSurname = li.querySelector("input[name=surname]");
    const elEmail = li.querySelector("input[name=email]");
    [elName, elSurname, elEmail].forEach(el => {
      const strong = document.createElement("strong");
      strong.dataset.name = el.name;
      strong.innerText = el.value;
      el.parentElement.replaceChild(strong, el);
    });
  }

  if (e.target.classList.contains("btn-save")) {
    const li = e.target.closest("li");
    const id = li.dataset.id;
    const elName = li.querySelector("input[name=name]");
    const elSurname = li.querySelector("input[name=surname]");
    const elEmail = li.querySelector("input[name=email]");
    const name = elName.value;
    const surname = elSurname.value;
    const email = elEmail.value;
    (0, _api.apiUpdateUser)({
      id,
      name,
      surname,
      email
    }).then(res => {
      li.querySelector(".btn-save").hidden = true;
      li.querySelector(".btn-cancel").hidden = true;
      li.querySelector(".btn-edit").hidden = false;
      li.querySelector(".btn-delete").hidden = false;
      [elName, elSurname, elEmail].forEach(el => {
        const strong = document.createElement("strong");
        strong.dataset.name = el.name;
        strong.innerText = el.value;
        el.parentElement.replaceChild(strong, el);
      });
    });
  }
});

_pubsub.pubsub.subscribe("newUser", ({
  id,
  name,
  surname,
  email
}) => {
  const li = document.createElement("li");
  li.dataset.id = id;
  li.innerHTML = getUserElementHTML({
    name,
    surname,
    email
  });
  li.classList.add("user-new");
  ul.prepend(li);
  setTimeout(() => {
    li.classList.remove("user-new");
  }, 1000);
});
},{"./_api":"js/_api.js","./_pubsub":"js/_pubsub.js"}],"js/_add-new-form.js":[function(require,module,exports) {
"use strict";

var _api = require("./_api");

var _pubsub = require("./_pubsub");

const formAdd = document.querySelector("#formAdd");
formAdd.addEventListener("submit", e => {
  e.preventDefault();
  const inputName = formAdd.querySelector("input[name=name]");
  const inputSurname = formAdd.querySelector("input[name=surname]");
  const inputEmail = formAdd.querySelector("input[name=email]");

  if (inputName.value && inputSurname.value && inputEmail.value) {
    (0, _api.apiAddUser)(inputName.value, inputSurname.value, inputEmail.value).then(res => {
      _pubsub.pubsub.emit("newUser", {
        id: res.id,
        name: res.first_name,
        surname: res.last_name,
        email: res.email
      });
    });
    formAdd.reset(); //czyszczę pola
  } else {
    alert("Wypełnij poprawnie wszystkie pola");
  }
});
},{"./_api":"js/_api.js","./_pubsub":"js/_pubsub.js"}],"C:/Users/kartofelek/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"C:/Users/kartofelek/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"C:/Users/kartofelek/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"scss/style.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./..\\images\\icon-delete.svg":[["icon-delete.022a9515.svg","images/icon-delete.svg"],"images/icon-delete.svg"],"./..\\images\\icon-edit.svg":[["icon-edit.74533ac1.svg","images/icon-edit.svg"],"images/icon-edit.svg"],"./..\\images\\icon-edit-save.svg":[["icon-edit-save.4bc83f38.svg","images/icon-edit-save.svg"],"images/icon-edit-save.svg"],"./..\\images\\icon-edit-cancel.svg":[["icon-edit-cancel.0024d705.svg","images/icon-edit-cancel.svg"],"images/icon-edit-cancel.svg"],"_css_loader":"C:/Users/kartofelek/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"js/app.js":[function(require,module,exports) {
"use strict";

require("./_list");

require("./_add-new-form");

require("../scss/style.scss");
},{"./_list":"js/_list.js","./_add-new-form":"js/_add-new-form.js","../scss/style.scss":"scss/style.scss"}],"C:/Users/kartofelek/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57125" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/kartofelek/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/app.js"], null)
//# sourceMappingURL=/app.c3f9f951.js.map