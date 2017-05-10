/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, syncnode_common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SyncNodeLocal = (function (_super) {
        __extends(SyncNodeLocal, _super);
        function SyncNodeLocal(id) {
            var _this = this;
            var data = JSON.parse(localStorage.getItem(id));
            _this = _super.call(this, data) || this;
            _this.on('updated', function () {
                localStorage.setItem(id, JSON.stringify(_this));
            });
            return _this;
        }
        return SyncNodeLocal;
    }(syncnode_common_1.SyncNode));
    exports.SyncNodeLocal = SyncNodeLocal;
    var SyncNodeClient = (function (_super) {
        __extends(SyncNodeClient, _super);
        function SyncNodeClient() {
            var _this = _super.call(this) || this;
            if (!('WebSocket' in window)) {
                throw new Error('SyncNode only works with browsers that support WebSockets');
            }
            _this.socketUrl = window.location.origin.replace(/^http(s?):\/\//, 'ws$1://');
            _this.channels = {};
            //window.addEventListener('load', () => {
            _this.tryConnect();
            return _this;
            //});
        }
        SyncNodeClient.prototype.socketOnOpen = function (msg) {
            console.log('connected!');
            this.emit('open');
        };
        SyncNodeClient.prototype.socketOnClosed = function (msg) {
            var _this = this;
            console.log('Socket connection closed: ', msg);
            this.emit('closed');
            setTimeout(function () {
                console.log('Retrying socket connection...');
                _this.tryConnect();
            }, 2000);
        };
        SyncNodeClient.prototype.socketOnMessage = function (msg) {
            var deserialized = JSON.parse(msg.data);
            if (!deserialized.channel) {
                console.error('Error: msg is missing channel.', deserialized);
            }
            else {
                var channel = this.channels[deserialized.channel];
                if (channel) {
                    channel.handleMessage(deserialized);
                }
            }
        };
        SyncNodeClient.prototype.socketOnError = function (msg) {
            console.error(msg);
            this.emit('error', msg);
        };
        SyncNodeClient.prototype.send = function (msg) {
            this.socket.send(msg);
        };
        SyncNodeClient.prototype.tryConnect = function () {
            console.log('connecting...');
            var socket = new WebSocket(this.socketUrl);
            socket.onopen = this.socketOnOpen.bind(this);
            socket.onclose = this.socketOnClosed.bind(this);
            socket.onmessage = this.socketOnMessage.bind(this);
            socket.onerror = this.socketOnError.bind(this);
            this.socket = socket;
        };
        SyncNodeClient.prototype.subscribe = function (channelName) {
            if (!this.channels[channelName]) {
                this.channels[channelName] = new SyncNodeChannel(this, channelName);
            }
            return this.channels[channelName];
        };
        return SyncNodeClient;
    }(syncnode_common_1.SyncNodeEventEmitter));
    exports.SyncNodeClient = SyncNodeClient;
    var SyncNodeChannel = (function (_super) {
        __extends(SyncNodeChannel, _super);
        function SyncNodeChannel(client, channelName) {
            var _this = _super.call(this) || this;
            _this.client = client;
            _this.channelName = channelName;
            client.on('open', function () { return _this.send('subscribe'); });
            return _this;
        }
        SyncNodeChannel.prototype.send = function (type, data) {
            var msg = {
                channel: this.channelName,
                type: type,
                data: data
            };
            var serialized = JSON.stringify(msg);
            this.client.send(serialized);
        };
        SyncNodeChannel.prototype.handleMessage = function (msg) {
            var _this = this;
            switch (msg.type) {
                case 'subscribed':
                    if (this.data) {
                        this.data.clearListeners();
                    }
                    this.data = new syncnode_common_1.SyncNode(msg.data);
                    this.data.on('updated', function (data, merge) {
                        _this.send('updated', merge);
                    });
                    this.emit('updated');
                    break;
                case 'updated':
                    if (!this.data) {
                        console.log('Error: update before subscribed result.');
                    }
                    else {
                        this.data.doMerge(msg.data, true);
                        this.emit('updated');
                    }
                    break;
                default:
                    this.emit(msg.type, msg.data);
                    break;
            }
        };
        return SyncNodeChannel;
    }(syncnode_common_1.SyncNodeEventEmitter));
    exports.SyncNodeChannel = SyncNodeChannel;
    var SyncView = (function (_super) {
        __extends(SyncView, _super);
        function SyncView(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this) || this;
            _this.options = options;
            console.log('options', _this.options);
            _this.bindings = {};
            _this.el = document.createElement(_this.options.tag || 'div');
            _this.el.className = options.className || '';
            _this.style(_this.options.style || {});
            return _this;
        }
        SyncView.prototype.hasDataChanged = function (newData) {
            if (!newData)
                return true;
            if (this.__currentDataVersion && newData.version) {
                return this.__currentDataVersion !== newData.version;
            }
            return true;
        };
        SyncView.prototype.add = function (tag, spec) {
            if (spec === void 0) { spec = {}; }
            var el = document.createElement(tag || 'div');
            el.innerHTML = spec.innerHTML || '';
            el.className = spec.className || '';
            if (spec.style) {
                Object.keys(spec.style).forEach(function (key) { el.style[key] = spec.style[key]; });
            }
            if (spec.events) {
                Object.keys(spec.events).forEach(function (key) {
                    el.addEventListener(key, spec.events[key]);
                });
            }
            this.el.appendChild(el);
            return el;
        };
        SyncView.prototype.addView = function (view, className, tag) {
            view.init();
            if (className)
                view.el.className += ' ' + className;
            this.el.appendChild(view.el);
            return view;
        };
        SyncView.prototype.addBinding = function (memberName, prop, value) {
            var existing = this.bindings[memberName] || {};
            existing[prop] = value;
            this.bindings[memberName] = existing;
        };
        SyncView.prototype.style = function (s) {
            SyncUtils.applyStyle(this.el, s);
        };
        SyncView.prototype.init = function () {
        };
        SyncView.prototype.update = function (data, force) {
            if (force || this.hasDataChanged(data)) {
                this.__currentDataVersion = data ? data.version : undefined;
                this.data = data;
                this.bind();
                this.render();
            }
        };
        SyncView.prototype.bind = function () {
            var _this = this;
            function traverse(curr, pathArr) {
                if (pathArr.length === 0)
                    return curr;
                else {
                    var next = pathArr.shift();
                    if (curr == null || !curr.hasOwnProperty(next))
                        return undefined;
                    return traverse(curr[next], pathArr);
                }
            }
            Object.keys(this.bindings).forEach(function (id) {
                var props = _this.bindings[id];
                Object.keys(props).forEach(function (prop) {
                    var valuePath = props[prop];
                    var value = traverse(_this, valuePath.split('.'));
                    if (id == 'addBtn')
                        console.log('binding', id, prop, valuePath, value);
                    if (prop === 'update') {
                        _this[id].update(value);
                    }
                    else {
                        _this[id][prop] = value;
                    }
                });
            });
        };
        SyncView.prototype.show = function () {
            this.el.style.display = this.el.style.display_old || 'block';
        };
        SyncView.prototype.hide = function () {
            if (this.el.style.display !== 'none') {
                this.el.style.display_old = this.el.style.display;
                this.el.style.display = 'none';
            }
        };
        SyncView.prototype.render = function () {
        };
        SyncView.createStyleElement = function () {
            var style = document.createElement('style');
            // WebKit hack :(
            style.appendChild(document.createTextNode(""));
            document.head.appendChild(style);
            return style;
        };
        SyncView.addGlobalStyle = function (selector, style) {
            SyncView.globalStyles.sheet.addRule(selector, style);
        };
        SyncView.appendGlobalStyles = function () {
        };
        return SyncView;
    }(syncnode_common_1.SyncNodeEventEmitter));
    SyncView.globalStyles = SyncView.createStyleElement();
    exports.SyncView = SyncView;
    var SyncUtils = (function () {
        function SyncUtils() {
        }
        SyncUtils.getProperty = function (obj, path) {
            if (!path)
                return obj;
            return SyncUtils.getPropertyHelper(obj, path.split('.'));
        };
        SyncUtils.getPropertyHelper = function (obj, split) {
            if (split.length === 1)
                return obj[split[0]];
            if (obj == null)
                return null;
            return SyncUtils.getPropertyHelper(obj[split[0]], split.slice(1, split.length));
        };
        SyncUtils.mergeMap = function (destination, source) {
            destination = destination || {};
            Object.keys(source || {}).forEach(function (key) {
                destination[key] = source[key];
            });
            return destination;
        };
        SyncUtils.applyStyle = function (el, s) {
            SyncUtils.mergeMap(el.style, s);
        };
        SyncUtils.normalize = function (str) {
            return (str || '').trim().toLowerCase();
        };
        SyncUtils.toMap = function (arr, keyValFunc) {
            keyValFunc = keyValFunc || (function (obj) { return obj.key; });
            if (!Array.isArray(arr))
                return arr;
            var result = {};
            var curr;
            for (var i = 0; i < arr.length; i++) {
                curr = arr[i];
                result[keyValFunc(curr)] = curr;
            }
            return result;
        };
        SyncUtils.sortMap = function (obj, sortField, reverse, keyValFunc) {
            return SyncUtils.toMap(SyncUtils.toArray(obj, sortField, reverse), keyValFunc);
        };
        SyncUtils.toArray = function (obj, sortField, reverse) {
            var result;
            if (Array.isArray(obj)) {
                result = obj.slice();
            }
            else {
                result = [];
                if (!obj)
                    return result;
                Object.keys(obj).forEach(function (key) {
                    if (key !== 'version' && key !== 'lastModified' && key !== 'key') {
                        result.push(obj[key]);
                    }
                });
            }
            if (sortField) {
                var getSortValue_1;
                if (typeof sortField === 'function')
                    getSortValue_1 = sortField;
                else
                    getSortValue_1 = function (obj) { return SyncUtils.getProperty(obj, sortField); };
                result.sort(function (a, b) {
                    var a1 = getSortValue_1(a);
                    var b1 = getSortValue_1(b);
                    if (typeof a1 === 'string')
                        a1 = a1.toLowerCase();
                    if (typeof b1 === 'string')
                        b1 = b1.toLowerCase();
                    if (a1 < b1)
                        return reverse ? 1 : -1;
                    if (a1 > b1)
                        return reverse ? -1 : 1;
                    return 0;
                });
            }
            return result;
        };
        SyncUtils.forEach = function (obj, func) {
            if (!Array.isArray(obj)) {
                obj = SyncUtils.toArray(obj);
            }
            obj.forEach(function (val) { return func(val); });
        };
        SyncUtils.getByKey = function (obj, key) {
            if (Array.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].key === key)
                        return obj[i];
                }
            }
            else {
                return obj[key];
            }
        };
        SyncUtils.param = function (variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
            return (false);
        };
        SyncUtils.getHash = function () {
            var hash = window.location.hash;
            hash = SyncUtils.normalize(hash);
            return hash.length > 0 ? hash.substr(1) : '';
        };
        SyncUtils.group = function (arr, prop, groupVals) {
            var groups = {};
            if (Array.isArray(groupVals)) {
                groupVals.forEach(function (groupVal) {
                    groups[groupVal] = { key: groupVal };
                });
            }
            if (!Array.isArray(arr))
                arr = SyncUtils.toArray(arr);
            arr.forEach(function (item) {
                var val;
                if (typeof prop === 'function') {
                    val = prop(item);
                }
                else {
                    val = item[prop];
                }
                if (!groups[val])
                    groups[val] = { key: val };
                groups[val][item.key] = item;
            });
            return groups;
        };
        SyncUtils.filterMap = function (map, filterFn) {
            var result = {};
            map = map || {};
            Object.keys(map).forEach(function (key) {
                if (key !== 'version' && key !== 'key' && key !== 'lastModified' && filterFn(map[key])) {
                    result[key] = map[key];
                }
            });
            return result;
        };
        SyncUtils.isEmptyObject = function (obj) {
            return Object.keys(obj).length === 0;
        };
        SyncUtils.formatCurrency = function (value, precision, emptyString) {
            if (value === "") {
                if (emptyString)
                    return emptyString;
                else
                    value = "0";
            }
            precision = precision || 2;
            var number = (typeof value === "string") ? parseFloat(value) : value;
            if (typeof number !== "number") {
                return emptyString || "";
            }
            return number.toFixed(precision);
        };
        SyncUtils.toNumberOrZero = function (value) {
            if (typeof value === "number")
                return value;
            if (typeof value === "string") {
                if (value.trim() === "")
                    return 0;
                var number = parseFloat(value);
                if (typeof number !== "number") {
                    return 0;
                }
            }
            return 0;
        };
        return SyncUtils;
    }());
    exports.SyncUtils = SyncUtils;
    var SyncList = (function (_super) {
        __extends(SyncList, _super);
        function SyncList(options) {
            var _this = _super.call(this, options) || this;
            _this.views = {};
            return _this;
        }
        SyncList.prototype.render = function () {
            var _this = this;
            var data = this.data || {};
            var itemsArr = SyncUtils.toArray(data, this.options.sortField, this.options.sortReversed);
            Object.keys(this.views).forEach(function (key) {
                var view = _this.views[key];
                if (!SyncUtils.getByKey(data, view.data.key)) {
                    _this.el.removeChild(view.el);
                    delete _this.views[view.data.key];
                    _this.emit('removedView', view);
                }
            });
            var previous;
            itemsArr.forEach(function (item) {
                var view = _this.views[item.key];
                if (!view) {
                    //let toInit: SyncView.SyncNodeView<SyncNode.SyncData>[] = [];
                    var options = {};
                    _this.emit('addingViewOptions', options);
                    //view = this.svml.buildComponent(this.options.ctor || this.options.tag, options, toInit);
                    view = new _this.options.item(options);
                    //toInit.forEach((v) => { v.init(); });
                    _this.views[item.key] = view;
                    _this.emit('viewAdded', view);
                }
                // Attempt to preserve order:
                _this.el.insertBefore(view.el, previous ? previous.el.nextSibling : _this.el.firstChild);
                view.onAny(function (eventName) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    args.unshift(view);
                    args.unshift(eventName);
                    _this.emit.apply(_this, args);
                });
                view.update(item);
                previous = view;
            });
        };
        return SyncList;
    }(SyncView));
    exports.SyncList = SyncList;
    var SyncAppSimple = (function () {
        function SyncAppSimple(options) {
            var _this = this;
            this.options = options;
            window.addEventListener('load', function () {
                console.log('hereerre');
                (options.parent || document.body).appendChild(_this.options.mainView.el);
                _this.client = new SyncNodeClient();
                _this.reload = _this.client.subscribe('reload');
                _this.reload.on('reload', function () { return window.location.reload(); });
                console.log('channel', _this.options.channel);
                _this.channel = _this.client.subscribe(_this.options.channel);
                _this.channel.on('updated', function () {
                    console.log('updated: ', _this.channel.data);
                    _this.options.mainView.update(_this.channel.data);
                });
            });
        }
        return SyncAppSimple;
    }());
    exports.SyncAppSimple = SyncAppSimple;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, syncnode_client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AddText = (function (_super) {
        __extends(AddText, _super);
        function AddText(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({ btnText: 'add' }, options)) || this;
            _this.input = _this.add('input', { "innerHTML": "", "className": "row-fill row-fill" });
            _this.addBtn = _this.add('button', { "innerHTML": "", "className": "row-nofill material-icons row-nofill material-icons" });
            _this.el.className += ' row';
            _this.addBtn.addEventListener('click', function () { _this.emit('add'); });
            _this.addBinding('addBtn', 'innerHTML', 'options.btnText');
            return _this;
        }
        AddText.prototype.init = function () {
            this.bind();
        };
        return AddText;
    }(syncnode_client_1.SyncView));
    exports.AddText = AddText;
    var MainView = (function (_super) {
        __extends(MainView, _super);
        function MainView(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.title = _this.add('h1', { "innerHTML": "F3 York", "className": "pad-small pad-small" });
            _this.newThread = _this.addView(new AddText(), '');
            _this.threads = _this.addView(new Threads(), '');
            _this.selectedThread = _this.addView(new Thread(), '');
            _this.el.className += ' ';
            _this.el.className += ' MainView_style';
            _this.newThread.on('add', function () {
                _this.data.threads.active.setItem({
                    createdAt: new Date().toISOString(),
                    name: _this.newThread.input.value,
                    messages: {}
                });
                _this.newThread.input.value = '';
            });
            _this.threads.on('selected', function (thread) {
                _this.selectedThread.update(thread);
            });
            _this.addBinding('threads', 'update', 'data.threads.active');
            return _this;
        }
        MainView.prototype.render = function () {
            if (this.selectedThread.data) {
                this.selectedThread.update(this.data.threads.active[this.selectedThread.data.key]);
            }
            else {
                this.selectedThread.update(syncnode_client_1.SyncUtils.toArray(this.data.threads.active)[0]);
            }
        };
        return MainView;
    }(syncnode_client_1.SyncView));
    exports.MainView = MainView;
    var Threads = (function (_super) {
        __extends(Threads, _super);
        function Threads(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.list = _this.addView(new syncnode_client_1.SyncList({ item: ThreadItem }), '');
            _this.el.className += ' ';
            _this.list.on('selected', function (v, thread) { _this.emit('selected', thread); });
            _this.addBinding('list', 'update', 'data');
            return _this;
        }
        return Threads;
    }(syncnode_client_1.SyncView));
    exports.Threads = Threads;
    var ThreadItem = (function (_super) {
        __extends(ThreadItem, _super);
        function ThreadItem(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.text = _this.add('div', { "innerHTML": "", "className": "" });
            _this.el.className += ' pad-small';
            _this.el.className += ' ThreadItem_style';
            _this.el.addEventListener('click', _this.onClick.bind(_this));
            _this.addBinding('text', 'innerHTML', 'data.name');
            return _this;
        }
        ThreadItem.prototype.onClick = function () { this.emit('selected', this.data); };
        return ThreadItem;
    }(syncnode_client_1.SyncView));
    exports.ThreadItem = ThreadItem;
    var Thread = (function (_super) {
        __extends(Thread, _super);
        function Thread(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.header = _this.addView(new ThreadHeader(), '');
            _this.list = _this.addView(new syncnode_client_1.SyncList({ item: ThreadMessage }), '');
            _this.newMsg = _this.addView(new AddText(), '');
            _this.el.className += ' ';
            _this.addBinding('header', 'update', 'data');
            _this.addBinding('list', 'update', 'data.messages');
            _this.newMsg.on('add', function () {
                _this.data.messages.setItem({
                    text: _this.newMsg.input.value
                });
                _this.newMsg.input.value = '';
            });
            return _this;
        }
        Thread.prototype.render = function () {
            this.el.style.display = this.data ? 'block' : 'none';
        };
        return Thread;
    }(syncnode_client_1.SyncView));
    exports.Thread = Thread;
    var ThreadHeader = (function (_super) {
        __extends(ThreadHeader, _super);
        function ThreadHeader(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.name = _this.add('h2', { "innerHTML": "", "className": "pad-small row-fill h2_name_style pad-small row-fill" });
            _this.del = _this.add('button', { "innerHTML": "delete", "className": "row-nofill material-icons row-nofill material-icons" });
            _this.el.className += ' row';
            _this.addBinding('name', 'innerHTML', 'data.name');
            _this.del.addEventListener('click', function () { _this.data.parent.remove(_this.data.key); });
            return _this;
        }
        return ThreadHeader;
    }(syncnode_client_1.SyncView));
    exports.ThreadHeader = ThreadHeader;
    syncnode_client_1.SyncView.addGlobalStyle('.h2_name_style', " margin: 4px 0; ");
    var ThreadMessage = (function (_super) {
        __extends(ThreadMessage, _super);
        function ThreadMessage(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.text = _this.add('div', { "innerHTML": "", "className": "" });
            _this.el.className += ' pad-small';
            _this.el.className += ' ThreadMessage_style';
            _this.addBinding('text', 'innerHTML', 'data.text');
            return _this;
        }
        return ThreadMessage;
    }(syncnode_client_1.SyncView));
    exports.ThreadMessage = ThreadMessage;
    syncnode_client_1.SyncView.addGlobalStyle('.MainView_style', " max-width: 300px; border: 1px solid #00F; ");
    syncnode_client_1.SyncView.addGlobalStyle('.ThreadItem_style', " border-bottom: 1px solid #CCC; ");
    syncnode_client_1.SyncView.addGlobalStyle('.ThreadMessage_style', " border-bottom: 1px solid #CCC; ");
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, syncnode_client_1, Threads_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mainView = new Threads_1.MainView();
    document.body.appendChild(mainView.el);
    var client = new syncnode_client_1.SyncNodeClient();
    var reload = client.subscribe('reload');
    reload.on('reload', function () { return window.location.reload(); });
    var channel = client.subscribe('threads');
    channel.on('updated', function () {
        console.log('updated: ', channel.data);
        mainView.update(channel.data);
    });
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SyncNodeUtils = (function () {
        function SyncNodeUtils() {
        }
        SyncNodeUtils.equals = function (obj1, obj2) {
            // use === to differentiate between undefined and null
            if (obj1 === null && obj2 === null) {
                return true;
            }
            else if ((obj1 != null && obj2 == null) || (obj1 == null && obj2 != null)) {
                return false;
            }
            else if (obj1 && obj2 && obj1.version && obj2.version) {
                return obj1.version === obj2.version;
            }
            else if (typeof obj1 !== 'object' && typeof obj2 !== 'object') {
                return obj1 === obj2;
            }
            return false;
        };
        SyncNodeUtils.getHelper = function (obj, split) {
            var isObject = SyncNodeUtils.isObject(obj);
            if (split.length === 1) {
                return isObject ? obj[split[0]] : null;
            }
            if (!isObject)
                return null;
            return SyncNodeUtils.getHelper(obj[split[0]], split.slice(1, split.length));
        };
        SyncNodeUtils.isObject = function (val) {
            return typeof val === 'object' && val != null;
        };
        SyncNodeUtils.isSyncNode = function (val) {
            if (!SyncNodeUtils.isObject(val))
                return false;
            var className = val.constructor.toString().match(/\w+/g)[1];
            return className === 'SyncNode';
        };
        SyncNodeUtils.addNE = function (obj, propName, value) {
            Object.defineProperty(obj, propName, {
                enumerable: false,
                configurable: true,
                writable: true,
                value: value
            });
        };
        ;
        SyncNodeUtils.s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        SyncNodeUtils.guidShort = function () {
            // Often used as an Object key, so prepend with letter to ensure parsed as a string and preserve 
            // insertion order when calling Object.keys -JDK 12/1/2016
            // http://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
            return 'a' + SyncNodeUtils.s4() + SyncNodeUtils.s4();
        };
        return SyncNodeUtils;
    }());
    exports.SyncNodeUtils = SyncNodeUtils;
    var SyncNodeEventEmitter = (function () {
        function SyncNodeEventEmitter() {
            SyncNodeUtils.addNE(this, '__eventHandlers', {});
            SyncNodeUtils.addNE(this, '__anyEventHandlers', {});
        }
        SyncNodeEventEmitter.prototype.on = function (eventName, handler) {
            var id = SyncNodeUtils.guidShort();
            if (!this.__eventHandlers[eventName])
                this.__eventHandlers[eventName] = {};
            this.__eventHandlers[eventName][id] = handler;
            return id;
        };
        SyncNodeEventEmitter.prototype.onAny = function (handler) {
            var id = SyncNodeUtils.guidShort();
            // Add the eventName to args before invoking anyEventHandlers
            this.__anyEventHandlers[id] = handler;
            return id;
        };
        SyncNodeEventEmitter.prototype.removeListener = function (eventName, id) {
            if (!this.__eventHandlers[eventName])
                return;
            delete this.__eventHandlers[eventName][id];
        };
        SyncNodeEventEmitter.prototype.clearListeners = function () {
            this.__eventHandlers = {};
        };
        SyncNodeEventEmitter.prototype.emit = function (eventName) {
            var _this = this;
            var restOfArgs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                restOfArgs[_i - 1] = arguments[_i];
            }
            var handlers = this.__eventHandlers[eventName] || {};
            var args = new Array(arguments.length - 1);
            for (var i = 1; i < arguments.length; ++i) {
                args[i - 1] = arguments[i];
            }
            Object.keys(handlers).forEach(function (key) { handlers[key].apply(null, args); });
            // Add the eventName to args before invoking anyEventHandlers
            args.unshift(eventName);
            Object.keys(this.__anyEventHandlers).forEach(function (key) {
                _this.__anyEventHandlers[key].apply(null, args);
            });
        };
        return SyncNodeEventEmitter;
    }());
    exports.SyncNodeEventEmitter = SyncNodeEventEmitter;
    var SyncNode = (function (_super) {
        __extends(SyncNode, _super);
        function SyncNode(obj, parent) {
            var _this = _super.call(this) || this;
            _this.__isUpdatesDisabled = false;
            obj = obj || {};
            SyncNodeUtils.addNE(_this, '__isUpdatesDisabled', false);
            SyncNodeUtils.addNE(_this, 'parent', parent);
            Object.keys(obj).forEach(function (propName) {
                var propValue = obj[propName];
                if (SyncNodeUtils.isObject(propValue)) {
                    if (!SyncNodeUtils.isSyncNode(propValue)) {
                        propValue = new SyncNode(propValue);
                    }
                    SyncNodeUtils.addNE(propValue, 'parent', _this);
                    propValue.on('updated', _this.createOnUpdated(propName));
                }
                _this[propName] = propValue;
            });
            return _this;
        }
        SyncNode.prototype.createOnUpdated = function (propName) {
            var _this = this;
            return function (updated, merge) {
                if (!_this.__isUpdatesDisabled) {
                    var newUpdated = _this;
                    var newMerge = {};
                    newMerge[propName] = merge;
                    if (updated.version) {
                        _this.version = updated.version;
                    }
                    else {
                        _this.version = SyncNodeUtils.guidShort();
                    }
                    newMerge.version = _this.version;
                    _this.emit('updated', newUpdated, newMerge);
                }
            };
        };
        SyncNode.prototype.set = function (key, val) {
            var merge = {};
            var split = key.split('.');
            var curr = merge;
            for (var i = 0; i < split.length - 1; i++) {
                curr[split[i]] = {};
                curr = curr[split[i]];
            }
            curr[split[split.length - 1]] = val;
            var result = this.merge(merge);
            return this;
        };
        SyncNode.prototype.get = function (path) {
            if (!path)
                return this;
            return SyncNodeUtils.getHelper(this, path.split('.'));
        };
        SyncNode.prototype.remove = function (key) {
            if (this.hasOwnProperty(key)) {
                this.merge({ '__remove': key });
            }
            return this;
        };
        SyncNode.prototype.merge = function (merge) {
            var result = this.doMerge(merge);
            if (result.hasChanges) {
                this.emit('updated', this, result.merge);
            }
            return this;
        };
        SyncNode.prototype.doMerge = function (merge, disableUpdates) {
            var _this = this;
            if (disableUpdates === void 0) { disableUpdates = false; }
            var hasChanges = false;
            var isEmpty = false;
            var newMerge = {};
            if (!merge) {
                console.error('Cannot merge: merge is not defined');
                return { hasChanges: false, merge: {} };
            }
            Object.keys(merge).forEach(function (key) {
                if (key === '__remove') {
                    var propsToRemove = merge[key];
                    if (!Array.isArray(propsToRemove) && typeof propsToRemove === 'string') {
                        var arr = [];
                        arr.push(propsToRemove);
                        propsToRemove = arr;
                    }
                    propsToRemove.forEach(function (prop) {
                        delete _this[prop];
                    });
                    if (!disableUpdates) {
                        _this.version = SyncNodeUtils.guidShort();
                        newMerge['__remove'] = propsToRemove;
                        hasChanges = true;
                    }
                }
                else {
                    var currVal = _this[key];
                    var newVal = merge[key];
                    if (!SyncNodeUtils.equals(currVal, newVal)) {
                        if (!SyncNodeUtils.isObject(newVal)) {
                            // at a leaf node of the merge
                            // we already know they aren't equal, simply set the value
                            _this[key] = newVal;
                            if (!disableUpdates) {
                                _this.version = SyncNodeUtils.guidShort();
                                newMerge[key] = newVal;
                                hasChanges = true;
                            }
                        }
                        else {
                            // about to merge an object, make sure currVal is a SyncNode	
                            if (!SyncNodeUtils.isSyncNode(currVal)) {
                                currVal = new SyncNode({}, _this);
                            }
                            currVal.clearListeners();
                            currVal.on('updated', _this.createOnUpdated(key));
                            var result = currVal.doMerge(newVal, disableUpdates);
                            if (typeof _this[key] === 'undefined') {
                                result.hasChanges = true;
                            }
                            _this[key] = currVal;
                            if (!disableUpdates && result.hasChanges) {
                                if (typeof currVal.version === 'undefined') {
                                    currVal.version = SyncNodeUtils.guidShort();
                                }
                                _this.version = currVal.version;
                                newMerge[key] = result.merge;
                                hasChanges = true;
                            }
                        }
                    }
                }
            });
            if (!disableUpdates && hasChanges) {
                newMerge.version = this.version;
                return { hasChanges: true, merge: newMerge };
            }
            else {
                return { hasChanges: false, merge: newMerge };
            }
        };
        // Like set(), but assumes or adds a key property 
        SyncNode.prototype.setItem = function (item) {
            if (!SyncNodeUtils.isObject(item)) {
                console.error('SyncNode: item must be an object');
                return;
            }
            else {
                if (!('key' in item))
                    item.key = SyncNodeUtils.guidShort();
                this.set(item.key, item);
                return this[item.key];
            }
        };
        return SyncNode;
    }(SyncNodeEventEmitter));
    exports.SyncNode = SyncNode;
    var SyncNodeLocal = (function (_super) {
        __extends(SyncNodeLocal, _super);
        function SyncNodeLocal(id) {
            var _this = this;
            var data = JSON.parse(localStorage.getItem(id));
            _this = _super.call(this, data) || this;
            _this.on('updated', function () {
                localStorage.setItem(id, JSON.stringify(_this));
            });
            return _this;
        }
        return SyncNodeLocal;
    }(SyncNode));
    exports.SyncNodeLocal = SyncNodeLocal;
    var SyncNodeClient = (function (_super) {
        __extends(SyncNodeClient, _super);
        function SyncNodeClient() {
            var _this = _super.call(this) || this;
            if (!('WebSocket' in window)) {
                throw new Error('SyncNode only works with browsers that support WebSockets');
            }
            _this.socketUrl = window.location.origin.replace(/^http(s?):\/\//, 'ws$1://');
            _this.channels = {};
            //window.addEventListener('load', () => {
            _this.tryConnect();
            return _this;
            //});
        }
        SyncNodeClient.prototype.socketOnOpen = function (msg) {
            console.log('connected!');
            this.emit('open');
        };
        SyncNodeClient.prototype.socketOnClosed = function (msg) {
            var _this = this;
            console.log('Socket connection closed: ', msg);
            this.emit('closed');
            setTimeout(function () {
                console.log('Retrying socket connection...');
                _this.tryConnect();
            }, 2000);
        };
        SyncNodeClient.prototype.socketOnMessage = function (msg) {
            var deserialized = JSON.parse(msg.data);
            if (!deserialized.channel) {
                console.error('Error: msg is missing channel.', deserialized);
            }
            else {
                var channel = this.channels[deserialized.channel];
                if (channel) {
                    channel.handleMessage(deserialized);
                }
            }
        };
        SyncNodeClient.prototype.socketOnError = function (msg) {
            console.error(msg);
            this.emit('error', msg);
        };
        SyncNodeClient.prototype.send = function (msg) {
            this.socket.send(msg);
        };
        SyncNodeClient.prototype.tryConnect = function () {
            console.log('connecting...');
            var socket = new WebSocket(this.socketUrl);
            socket.onopen = this.socketOnOpen.bind(this);
            socket.onclose = this.socketOnClosed.bind(this);
            socket.onmessage = this.socketOnMessage.bind(this);
            socket.onerror = this.socketOnError.bind(this);
            this.socket = socket;
        };
        SyncNodeClient.prototype.subscribe = function (channelName) {
            if (!this.channels[channelName]) {
                this.channels[channelName] = new SyncNodeChannel(this, channelName);
            }
            return this.channels[channelName];
        };
        return SyncNodeClient;
    }(SyncNodeEventEmitter));
    exports.SyncNodeClient = SyncNodeClient;
    var SyncNodeChannel = (function (_super) {
        __extends(SyncNodeChannel, _super);
        function SyncNodeChannel(client, channelName) {
            var _this = _super.call(this) || this;
            _this.client = client;
            _this.channelName = channelName;
            client.on('open', function () { return _this.send('subscribe'); });
            return _this;
        }
        SyncNodeChannel.prototype.send = function (type, data) {
            var msg = {
                channel: this.channelName,
                type: type,
                data: data
            };
            var serialized = JSON.stringify(msg);
            this.client.send(serialized);
        };
        SyncNodeChannel.prototype.handleMessage = function (msg) {
            var _this = this;
            switch (msg.type) {
                case 'subscribed':
                    if (this.data) {
                        this.data.clearListeners();
                    }
                    this.data = new SyncNode(msg.data);
                    this.data.on('updated', function (data, merge) {
                        _this.send('updated', merge);
                    });
                    this.emit('updated');
                    break;
                case 'updated':
                    if (!this.data) {
                        console.log('Error: update before subscribed result.');
                    }
                    else {
                        this.data.doMerge(msg.data, true);
                        this.emit('updated');
                    }
                    break;
                default:
                    this.emit(msg.type, msg.data);
                    break;
            }
        };
        return SyncNodeChannel;
    }(SyncNodeEventEmitter));
    exports.SyncNodeChannel = SyncNodeChannel;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);