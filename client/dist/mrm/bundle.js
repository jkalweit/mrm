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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const syncnode_common_1 = __webpack_require__(4);
class SyncNodeLocal extends syncnode_common_1.SyncNode {
    constructor(id) {
        let data = JSON.parse(localStorage.getItem(id));
        super(data);
        this.on('updated', () => {
            localStorage.setItem(id, JSON.stringify(this));
        });
    }
}
exports.SyncNodeLocal = SyncNodeLocal;
class SyncNodeClient extends syncnode_common_1.SyncNodeEventEmitter {
    constructor() {
        super();
        if (!('WebSocket' in window)) {
            throw new Error('SyncNode only works with browsers that support WebSockets');
        }
        this.socketUrl = window.location.origin.replace(/^http(s?):\/\//, 'ws$1://');
        this.channels = {};
        //window.addEventListener('load', () => {
        this.tryConnect();
        //});
    }
    socketOnOpen(msg) {
        console.log('connected!');
        this.emit('open');
    }
    socketOnClosed(msg) {
        console.log('Socket connection closed: ', msg);
        this.emit('closed');
        setTimeout(() => {
            console.log('Retrying socket connection...');
            this.tryConnect();
        }, 2000);
    }
    socketOnMessage(msg) {
        let deserialized = JSON.parse(msg.data);
        if (!deserialized.channel) {
            console.error('Error: msg is missing channel.', deserialized);
        }
        else {
            let channel = this.channels[deserialized.channel];
            if (channel) {
                channel.handleMessage(deserialized);
            }
        }
    }
    socketOnError(msg) {
        console.error(msg);
        this.emit('error', msg);
    }
    send(msg) {
        this.socket.send(msg);
    }
    tryConnect() {
        console.log('connecting...');
        let socket = new WebSocket(this.socketUrl);
        socket.onopen = this.socketOnOpen.bind(this);
        socket.onclose = this.socketOnClosed.bind(this);
        socket.onmessage = this.socketOnMessage.bind(this);
        socket.onerror = this.socketOnError.bind(this);
        this.socket = socket;
    }
    subscribe(channelName) {
        if (!this.channels[channelName]) {
            this.channels[channelName] = new SyncNodeChannel(this, channelName);
        }
        return this.channels[channelName];
    }
}
exports.SyncNodeClient = SyncNodeClient;
class SyncNodeChannel extends syncnode_common_1.SyncNodeEventEmitter {
    constructor(client, channelName) {
        super();
        this.client = client;
        this.channelName = channelName;
        client.on('open', () => this.send('subscribe'));
    }
    send(type, data) {
        let msg = {
            channel: this.channelName,
            type: type,
            data: data
        };
        let serialized = JSON.stringify(msg);
        this.client.send(serialized);
    }
    handleMessage(msg) {
        switch (msg.type) {
            case 'subscribed':
                if (this.data) {
                    this.data.clearListeners();
                }
                this.data = new syncnode_common_1.SyncNode(msg.data);
                this.data.on('updated', (data, merge) => {
                    this.send('updated', merge);
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
    }
}
exports.SyncNodeChannel = SyncNodeChannel;
class SyncView extends syncnode_common_1.SyncNodeEventEmitter {
    constructor(options = {}) {
        super();
        this.options = options;
        this.bindings = {};
        this.el = document.createElement(this.options.tag || 'div');
        this.el.className = options.className || '';
        this.style(this.options.style || {});
    }
    hasDataChanged(newData) {
        if (!newData)
            return true;
        if (this.__currentDataVersion && newData.version) {
            return this.__currentDataVersion !== newData.version;
        }
        return true;
    }
    add(tag, spec = {}) {
        let el = document.createElement(tag || 'div');
        el.innerHTML = spec.innerHTML || '';
        el.className = spec.className || '';
        if (spec.style) {
            Object.keys(spec.style).forEach((key) => { el.style[key] = spec.style[key]; });
        }
        if (spec.events) {
            Object.keys(spec.events).forEach((key) => {
                el.addEventListener(key, spec.events[key]);
            });
        }
        this.el.appendChild(el);
        return el;
    }
    addView(view, className, tag) {
        view.init();
        if (className)
            view.el.className += ' ' + className;
        this.el.appendChild(view.el);
        return view;
    }
    addBinding(memberName, prop, value) {
        var existing = this.bindings[memberName] || {};
        existing[prop] = value;
        this.bindings[memberName] = existing;
    }
    style(s) {
        SyncUtils.applyStyle(this.el, s);
    }
    init() {
    }
    update(data, force) {
        if (force || this.hasDataChanged(data)) {
            this.__currentDataVersion = data ? data.version : undefined;
            this.data = data;
            this.bind();
            this.render();
        }
    }
    bind() {
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
        Object.keys(this.bindings).forEach((id) => {
            var props = this.bindings[id];
            Object.keys(props).forEach((prop) => {
                var valuePath = props[prop];
                var value = traverse(this, valuePath.split('.'));
                if (prop === 'update') {
                    this[id].update(value);
                }
                else {
                    this[id][prop] = value;
                }
            });
        });
    }
    show() {
        this.el.style.display = this.el.style.display_old || 'block';
    }
    hide() {
        if (this.el.style.display !== 'none') {
            this.el.style.display_old = this.el.style.display;
            this.el.style.display = 'none';
        }
    }
    render() {
    }
    static createStyleElement() {
        var style = document.createElement('style');
        // WebKit hack :(
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        return style;
    }
    static addGlobalStyle(selector, style) {
        SyncView.globalStyles.sheet.addRule(selector, style);
    }
    static appendGlobalStyles() {
    }
}
SyncView.globalStyles = SyncView.createStyleElement();
exports.SyncView = SyncView;
class SyncUtils {
    static getProperty(obj, path) {
        if (!path)
            return obj;
        return SyncUtils.getPropertyHelper(obj, path.split('.'));
    }
    static getPropertyHelper(obj, split) {
        if (split.length === 1)
            return obj[split[0]];
        if (obj == null)
            return null;
        return SyncUtils.getPropertyHelper(obj[split[0]], split.slice(1, split.length));
    }
    static mergeMap(destination, source) {
        destination = destination || {};
        Object.keys(source || {}).forEach((key) => {
            destination[key] = source[key];
        });
        return destination;
    }
    static applyStyle(el, s) {
        SyncUtils.mergeMap(el.style, s);
    }
    static normalize(str) {
        return (str || '').trim().toLowerCase();
    }
    static toMap(arr, keyValFunc) {
        keyValFunc = keyValFunc || ((obj) => { return obj.key; });
        if (!Array.isArray(arr))
            return arr;
        let result = {};
        let curr;
        for (let i = 0; i < arr.length; i++) {
            curr = arr[i];
            result[keyValFunc(curr)] = curr;
        }
        return result;
    }
    static sortMap(obj, sortField, reverse, keyValFunc) {
        return SyncUtils.toMap(SyncUtils.toArray(obj, sortField, reverse), keyValFunc);
    }
    static toArray(obj, sortField, reverse) {
        let result;
        if (Array.isArray(obj)) {
            result = obj.slice();
        }
        else {
            result = [];
            if (!obj)
                return result;
            Object.keys(obj).forEach((key) => {
                if (key !== 'version' && key !== 'lastModified' && key !== 'key') {
                    result.push(obj[key]);
                }
            });
        }
        if (sortField) {
            let getSortValue;
            if (typeof sortField === 'function')
                getSortValue = sortField;
            else
                getSortValue = (obj) => { return SyncUtils.getProperty(obj, sortField); };
            result.sort(function (a, b) {
                let a1 = getSortValue(a);
                let b1 = getSortValue(b);
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
    }
    static forEach(obj, func) {
        if (!Array.isArray(obj)) {
            obj = SyncUtils.toArray(obj);
        }
        obj.forEach((val) => func(val));
    }
    static getByKey(obj, key) {
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                if (obj[i].key === key)
                    return obj[i];
            }
        }
        else {
            return obj[key];
        }
    }
    static param(variable) {
        let query = window.location.search.substring(1);
        let vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }
    static getHash() {
        let hash = window.location.hash;
        hash = SyncUtils.normalize(hash);
        return hash.length > 0 ? hash.substr(1) : '';
    }
    static group(arr, prop, groupVals) {
        let groups = {};
        if (Array.isArray(groupVals)) {
            groupVals.forEach((groupVal) => {
                groups[groupVal] = { key: groupVal };
            });
        }
        if (!Array.isArray(arr))
            arr = SyncUtils.toArray(arr);
        arr.forEach(function (item) {
            let val;
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
    }
    static filterMap(map, filterFn) {
        let result = {};
        map = map || {};
        Object.keys(map).forEach(key => {
            if (key !== 'version' && key !== 'key' && key !== 'lastModified' && filterFn(map[key])) {
                result[key] = map[key];
            }
        });
        return result;
    }
    static isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    }
    static formatCurrency(value, precision, emptyString) {
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
    }
    static toNumberOrZero(value) {
        if (typeof value === "number")
            return value;
        if (typeof value === "string") {
            if (value.trim() === "")
                return 0;
            let number = parseFloat(value);
            if (typeof number !== "number") {
                return 0;
            }
        }
        return 0;
    }
}
exports.SyncUtils = SyncUtils;
class SyncList extends SyncView {
    constructor(options) {
        super(options);
        this.views = {};
    }
    render() {
        var data = this.data || {};
        var itemsArr = SyncUtils.toArray(data, this.options.sortField, this.options.sortReversed);
        Object.keys(this.views).forEach((key) => {
            let view = this.views[key];
            if (!SyncUtils.getByKey(data, view.data.key)) {
                this.el.removeChild(view.el);
                delete this.views[view.data.key];
                this.emit('removedView', view);
            }
        });
        let previous;
        itemsArr.forEach((item) => {
            var view = this.views[item.key];
            if (!view) {
                //let toInit: SyncView.SyncNodeView<SyncNode.SyncData>[] = [];
                var options = {};
                this.emit('addingViewOptions', options);
                //view = this.svml.buildComponent(this.options.ctor || this.options.tag, options, toInit);
                view = new this.options.item(options);
                //toInit.forEach((v) => { v.init(); });
                this.views[item.key] = view;
                this.emit('viewAdded', view);
            }
            // Attempt to preserve order:
            this.el.insertBefore(view.el, previous ? previous.el.nextSibling : this.el.firstChild);
            view.onAny((eventName, ...args) => {
                args.unshift(view);
                args.unshift(eventName);
                this.emit.apply(this, args);
            });
            view.update(item);
            previous = view;
        });
    }
}
exports.SyncList = SyncList;
class SyncAppSimple {
    constructor(options) {
        this.options = options;
        window.addEventListener('load', () => {
            console.log('hereerre');
            (options.parent || document.body).appendChild(this.options.mainView.el);
            this.client = new SyncNodeClient();
            this.reload = this.client.subscribe('reload');
            this.reload.on('reload', () => window.location.reload());
            console.log('channel', this.options.channel);
            this.channel = this.client.subscribe(this.options.channel);
            this.channel.on('updated', () => {
                console.log('updated: ', this.channel.data);
                this.options.mainView.update(this.channel.data);
            });
        });
    }
}
exports.SyncAppSimple = SyncAppSimple;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const syncnode_client_1 = __webpack_require__(0);
const Components_1 = __webpack_require__(2);
class MainView extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h1', { "innerHTML": "Managment Review", "className": "pad-small pad-small" });
        this.title2 = this.add('h2', { "innerHTML": "9.3.2 Managment Review Inputs", "className": "pad-small pad-small" });
        this.tabs = this.addView(new Components_1.Tabs(), '');
        this.el.className += ' pad-small';
        this.el.className += ' MainView_style';
    }
    init() {
        this.tabs.addTab('a', new SectionA());
        this.tabs.addTab('b', new SectionB());
        this.tabs.addTab('c-1', new SectionC1());
        this.tabs.addTab('c-2', new SectionC2());
        this.tabs.addTab('c-3', new SectionC3());
        this.tabs.addTab('c-4', new SectionC4());
        this.tabs.addTab('c-5', new SectionC5());
        this.tabs.addTab('c-6', new SectionC6());
        this.tabs.addTab('c-7', new SectionC7());
        this.tabs.addTab('d', new SectionD());
        this.tabs.addTab('e', new SectionE());
        this.tabs.addTab('f', new SectionF());
        this.tabs.selectFirstTab();
    }
}
exports.MainView = MainView;
class SectionA extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h3', { "innerHTML": "The status of actions from previous management reviews", "className": "" });
        this.el.className += ' pad-small';
    }
}
exports.SectionA = SectionA;
class SectionB extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h3', { "innerHTML": "Changes in external and internal issues that are relevant to the quality management system", "className": "" });
        this.el.className += ' pad-small';
    }
}
exports.SectionB = SectionB;
class SectionC1 extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h3', { "innerHTML": "Trends in customer satisfaction and feedback from relevant interested parties", "className": "" });
        this.customerConcerns = this.addView(new CustomerConcernsView(), '');
        this.el.className += ' pad-small';
    }
    init() {
        console.log('sending request');
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://server1.imt.local/imtsqlrest/api/qa');
        //xhr.open('GET', 'http://localhost:60562/api/qa');
        xhr.onload = function () {
            if (xhr.status === 200) {
                let results = JSON.parse(JSON.parse(xhr.responseText));
                console.log('qa results', results);
                this.customerConcerns.update(results);
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        }.bind(this);
        xhr.send();
    }
}
exports.SectionC1 = SectionC1;
class SectionC2 extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h3', { "innerHTML": "The extent to which quality objectives have been met", "className": "" });
        this.el.className += ' pad-small';
    }
}
exports.SectionC2 = SectionC2;
class SectionC3 extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h3', { "innerHTML": "Process performance and conformity of products and services", "className": "" });
        this.exceptions = this.addView(new ExceptionsView(), '');
        this.el.className += ' pad-small';
    }
    init() {
        console.log('sending request');
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://server1.imt.local/imtsqlrest/api/exceptions');
        xhr.onload = function () {
            if (xhr.status === 200) {
                let results = JSON.parse(JSON.parse(xhr.responseText));
                this.exceptions.update({ exceptions: results });
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        }.bind(this);
        xhr.send();
    }
}
exports.SectionC3 = SectionC3;
class SectionC4 extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h3', { "innerHTML": "Nonconformities and corrective actions", "className": "" });
        this.el.className += ' pad-small';
    }
}
exports.SectionC4 = SectionC4;
class SectionC5 extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h3', { "innerHTML": "Monitoring and measurement results", "className": "" });
        this.el.className += ' pad-small';
    }
}
exports.SectionC5 = SectionC5;
class SectionC6 extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h3', { "innerHTML": "Audit results", "className": "" });
        this.el.className += ' pad-small';
    }
}
exports.SectionC6 = SectionC6;
class SectionC7 extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h3', { "innerHTML": "The performance of external providers", "className": "" });
        this.el.className += ' pad-small';
    }
}
exports.SectionC7 = SectionC7;
class SectionD extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h3', { "innerHTML": "The adequacy of resources", "className": "" });
        this.el.className += ' pad-small';
    }
}
exports.SectionD = SectionD;
class SectionE extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h3', { "innerHTML": "The effectiveness of actions taken to address risks and opportunities (see 6.1)", "className": "" });
        this.el.className += ' pad-small';
    }
}
exports.SectionE = SectionE;
class SectionF extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h3', { "innerHTML": "Opportunities for improvement", "className": "" });
        this.el.className += ' pad-small';
    }
}
exports.SectionF = SectionF;
class CustomerConcernsView extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h4', { "innerHTML": "Customer Concerns", "className": " h4_title_style" });
        this.internal = this.addView(new ExceptionsResponsibility(), '');
        this.external = this.addView(new ExceptionsResponsibility(), '');
        this.undetermined = this.addView(new ExceptionsResponsibility(), '');
        this.el.className += ' ';
        this.addBinding('internal', 'update', 'data.Internal');
        this.addBinding('external', 'update', 'data.External');
        this.addBinding('undetermined', 'update', 'data.Undetermined');
    }
}
exports.CustomerConcernsView = CustomerConcernsView;
syncnode_client_1.SyncView.addGlobalStyle('.h4_title_style', ` border-bottom: 1px solid #000; `);
class ExceptionsView extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('h4', { "innerHTML": "Exceptions", "className": " h4_title_style" });
        this.internal = this.addView(new ExceptionsResponsibility(), '');
        this.external = this.addView(new ExceptionsResponsibility(), '');
        this.undetermined = this.addView(new ExceptionsResponsibility(), '');
        this.el.className += ' ';
        this.addBinding('internal', 'update', 'data.exceptions.Internal');
        this.addBinding('external', 'update', 'data.exceptions.External');
        this.addBinding('undetermined', 'update', 'data.exceptions.Undetermined');
    }
}
exports.ExceptionsView = ExceptionsView;
syncnode_client_1.SyncView.addGlobalStyle('.h4_title_style', ` border-bottom: 1px solid #000; `);
class ExceptionsResponsibility extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.name = this.add('h4', { "innerHTML": "", "className": "" });
        this.s1 = this.add('span', { "innerHTML": "", "className": "spancol bold span_s1_style spancol bold" });
        this.s2 = this.add('span', { "innerHTML": "2017", "className": "spancol bold center spancol bold center" });
        this.s3 = this.add('span', { "innerHTML": "2016", "className": "spancol bold center spancol bold center" });
        this.s4 = this.add('span', { "innerHTML": "2015", "className": "spancol bold center spancol bold center" });
        this.s5 = this.add('span', { "innerHTML": "2014", "className": "spancol bold center spancol bold center" });
        this.s6 = this.add('span', { "innerHTML": "2013", "className": "spancol bold center spancol bold center" });
        this.s7 = this.add('span', { "innerHTML": "2012", "className": "spancol bold center spancol bold center" });
        this.list = this.add('div', { "innerHTML": "Loading...", "className": "" });
        this.el.className += ' ';
        this.addBinding('name', 'innerHTML', 'data.Name');
    }
    render() {
        this.list.innerHTML = '';
        syncnode_client_1.SyncUtils.forEach(this.data.Categories, (cat) => {
            let view = new ExceptionsViewCategory();
            view.update(cat);
            this.list.appendChild(view.el);
        });
    }
}
exports.ExceptionsResponsibility = ExceptionsResponsibility;
syncnode_client_1.SyncView.addGlobalStyle('.span_s1_style', ` width: 175px; padding-left: 3em; `);
class ExceptionsViewCategory extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.s1 = this.add('span', { "innerHTML": "", "className": "spancol span_s1_style spancol" });
        this.list = this.add('span', { "innerHTML": "", "className": "" });
        this.el.className += ' ';
        this.addBinding('s1', 'innerHTML', 'data.Name');
    }
    render() {
        this.list.innerHTML = '';
        syncnode_client_1.SyncUtils.forEach(this.data.Years, (year) => {
            var span = document.createElement('span');
            span.className = 'spancol center';
            span.innerHTML = year.Count;
            this.list.appendChild(span);
        });
    }
}
exports.ExceptionsViewCategory = ExceptionsViewCategory;
syncnode_client_1.SyncView.addGlobalStyle('.span_s1_style', ` width: 175px; `);
syncnode_client_1.SyncView.addGlobalStyle('.MainView_style', ` max-width: 900px; border: 1px solid #CCC; margin: 0 auto; `);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const syncnode_client_1 = __webpack_require__(0);
class Input extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({ twoway: true, labelWidth: '100px' }, options));
        this.label = this.add('span', { "innerHTML": "", "className": "" });
        this.input = this.add('input', { "innerHTML": "", "className": " input_input_style" });
        this.el.className += ' ';
        this.el.className += ' Input_style';
        this.el.addEventListener('change', this.onChange.bind(this));
    }
    onChange() {
        let val = this.input.value;
        if (this.options.twoway && this.options.key) {
            this.data.set(this.options.key, val);
        }
        this.emit('change', val);
    }
    value() {
        return this.input.value;
    }
    init() {
        this.label.style.width = this.options.labelWidth;
    }
    render() {
        if (this.options.label) {
            this.label.innerHTML = this.options.label;
        }
        this.label.style.display = this.options.label ? 'flex' : 'none';
        if (this.data) {
            this.input.value = this.options.key ? this.data.get(this.options.key) || '' : this.data || '';
        }
    }
}
exports.Input = Input;
syncnode_client_1.SyncView.addGlobalStyle('.input_input_style', `
            flex: 1;
            font-size: 1em;
            padding: 0.5em 0;
            background-color: transparent;
            border: none;
            border-bottom: 1px solid rgba(0,0,0,0.5);
    `);
class Modal extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({ hideOnClick: true }, options));
        this.viewContainer = this.add('div', { "innerHTML": "", "className": "" });
        this.el.className += ' ';
        this.el.className += ' Modal_style';
        this.el.addEventListener('click', this.onClick.bind(this));
        this.viewContainer.addEventListener('click', (e) => { e.stopPropagation(); });
    }
    onClick() { if (this.options.hideOnClick) {
        this.hide();
    } }
    init() {
        this.hide();
        if (this.options.view) {
            this.view = new this.options.view();
            var _me = this;
            let handler = function (eventName) {
                if (eventName === 'hide') {
                    _me.hide();
                }
                _me.emit.apply(_me, arguments);
            };
            this.view.onAny(handler.bind(this));
            this.viewContainer.appendChild(this.view.el);
        }
    }
    render() {
        if (this.view)
            this.view.update(this.data);
    }
}
exports.Modal = Modal;
class SimpleHeader extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.title = this.add('span', { "innerHTML": "", "className": "row-fill span_title_style row-fill" });
        this.addBtn = this.add('button', { "innerHTML": "Add", "className": "row-nofill row-nofill" });
        this.el.className += ' row';
        this.addBtn.addEventListener('click', () => { this.emit('add'); });
    }
    showButtons(val) {
        this.addBtn.style.display = val ? 'flex' : 'none';
    }
    init() {
        this.title.innerHTML = this.options.title;
    }
}
exports.SimpleHeader = SimpleHeader;
syncnode_client_1.SyncView.addGlobalStyle('.span_title_style', ` 
            font-weight: bold; 
            font-size: 1.5em;
        `);
class Tabs extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.tabsArr = [];
        this.headers = this.add('div', { "innerHTML": "", "className": "row div_headers_style row" });
        this.tabs = this.add('div', { "innerHTML": "", "className": "" });
        this.el.className += ' ';
    }
    addTab(title, view) {
        let tab = new Tab();
        tab.header = new TabHeaderItem({ text: title });
        tab.header.tabsContainer = this;
        tab.header.init();
        tab.view = view;
        tab.view.init();
        tab.init();
        tab.header.on('selected', () => {
            this.selectedItem = tab.header;
            this.emit('selected', this.selectedItem);
            this.tabs.innerHTML = '';
            this.tabs.appendChild(tab.view.el);
        });
        this.headers.appendChild(tab.header.el);
        this.tabsArr.push(tab);
    }
    selectFirstTab() {
        if (this.tabsArr.length) {
            this.tabsArr[0].header.select();
        }
    }
}
exports.Tabs = Tabs;
syncnode_client_1.SyncView.addGlobalStyle('.div_headers_style', ` border-bottom: 1px solid #CCC; `);
class TabHeaderItem extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.text = this.add('span', { "innerHTML": "", "className": "" });
        this.el.className += ' row-nofill pad-small no-select';
        this.el.className += ' TabHeaderItem_style';
        this.el.addEventListener('click', this.onClick.bind(this));
        this.addBinding('text', 'innerHTML', 'options.text');
    }
    select() {
        this.emit('selected', this);
    }
    onClick() {
        this.select();
    }
    init() {
        this.bind();
        this.tabsContainer.on('selected', (item) => {
            let selected = item === this;
            this.el.style.border = selected ? '1px solid #666' : '1px solid #BBB';
            this.el.style.borderBottom = selected ? 'none' : '1px solid #BBB';
            this.el.style.backgroundColor = selected ? '#FFF' : '#CCC';
        });
    }
}
exports.TabHeaderItem = TabHeaderItem;
class Tab extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({}, options));
        this.el.className += ' ';
    }
}
exports.Tab = Tab;
class AddText extends syncnode_client_1.SyncView {
    constructor(options = {}) {
        super(syncnode_client_1.SyncUtils.mergeMap({ btnText: 'add' }, options));
        this.input = this.add('input', { "innerHTML": "", "className": "row-fill row-fill" });
        this.addBtn = this.add('button', { "innerHTML": "", "className": "row-nofill material-icons row-nofill material-icons" });
        this.el.className += ' row';
        this.addBtn.addEventListener('click', () => { this.emit('add'); });
        this.addBinding('addBtn', 'innerHTML', 'options.btnText');
    }
    init() {
        this.bind();
    }
}
exports.AddText = AddText;
syncnode_client_1.SyncView.addGlobalStyle('.Input_style', ` 
        width: 100%;
        display: flex; 
    `);
syncnode_client_1.SyncView.addGlobalStyle('.Modal_style', ` 
        position: fixed;
        left: 0; right: 0; top: 0; bottom: 0;
        background-color: rgba(0,0,0,0.7);
        overflow-y: scroll;
        display: flex;
        align-items: center;
        justify-content: center;	
    `);
syncnode_client_1.SyncView.addGlobalStyle('.TabHeaderItem_style', ` border: 1px solid #BBB; min-width: 50px; text-align: center; `);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const syncnode_client_1 = __webpack_require__(0);
const Views_1 = __webpack_require__(1);
let mainView = new Views_1.MainView();
mainView.init();
document.body.appendChild(mainView.el);
let client = new syncnode_client_1.SyncNodeClient();
let reload = client.subscribe('reload');
reload.on('reload', () => window.location.reload());
let channel = client.subscribe('mrm');
channel.on('updated', () => {
    console.log('updated: ', channel.data);
    mainView.update(channel.data);
});


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class SyncNodeUtils {
    static equals(obj1, obj2) {
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
    }
    static getHelper(obj, split) {
        let isObject = SyncNodeUtils.isObject(obj);
        if (split.length === 1) {
            return isObject ? obj[split[0]] : null;
        }
        if (!isObject)
            return null;
        return SyncNodeUtils.getHelper(obj[split[0]], split.slice(1, split.length));
    }
    static isObject(val) {
        return typeof val === 'object' && val != null;
    }
    static isSyncNode(val) {
        if (!SyncNodeUtils.isObject(val))
            return false;
        var className = val.constructor.toString().match(/\w+/g)[1];
        return className === 'SyncNode';
    }
    static addNE(obj, propName, value) {
        Object.defineProperty(obj, propName, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: value
        });
    }
    ;
    static s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    static guidShort() {
        // Often used as an Object key, so prepend with letter to ensure parsed as a string and preserve 
        // insertion order when calling Object.keys -JDK 12/1/2016
        // http://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
        return 'a' + SyncNodeUtils.s4() + SyncNodeUtils.s4();
    }
}
exports.SyncNodeUtils = SyncNodeUtils;
class SyncNodeEventEmitter {
    constructor() {
        SyncNodeUtils.addNE(this, '__eventHandlers', {});
        SyncNodeUtils.addNE(this, '__anyEventHandlers', {});
    }
    on(eventName, handler) {
        var id = SyncNodeUtils.guidShort();
        if (!this.__eventHandlers[eventName])
            this.__eventHandlers[eventName] = {};
        this.__eventHandlers[eventName][id] = handler;
        return id;
    }
    onAny(handler) {
        var id = SyncNodeUtils.guidShort();
        // Add the eventName to args before invoking anyEventHandlers
        this.__anyEventHandlers[id] = handler;
        return id;
    }
    removeListener(eventName, id) {
        if (!this.__eventHandlers[eventName])
            return;
        delete this.__eventHandlers[eventName][id];
    }
    clearListeners() {
        this.__eventHandlers = {};
    }
    emit(eventName, ...restOfArgs) {
        var handlers = this.__eventHandlers[eventName] || {};
        var args = new Array(arguments.length - 1);
        for (var i = 1; i < arguments.length; ++i) {
            args[i - 1] = arguments[i];
        }
        Object.keys(handlers).forEach((key) => { handlers[key].apply(null, args); });
        // Add the eventName to args before invoking anyEventHandlers
        args.unshift(eventName);
        Object.keys(this.__anyEventHandlers).forEach((key) => {
            this.__anyEventHandlers[key].apply(null, args);
        });
    }
}
exports.SyncNodeEventEmitter = SyncNodeEventEmitter;
class SyncNode extends SyncNodeEventEmitter {
    constructor(obj, parent) {
        super();
        this.__isUpdatesDisabled = false;
        obj = obj || {};
        SyncNodeUtils.addNE(this, '__isUpdatesDisabled', false);
        SyncNodeUtils.addNE(this, 'parent', parent);
        Object.keys(obj).forEach((propName) => {
            var propValue = obj[propName];
            if (SyncNodeUtils.isObject(propValue)) {
                if (!SyncNodeUtils.isSyncNode(propValue)) {
                    propValue = new SyncNode(propValue);
                }
                SyncNodeUtils.addNE(propValue, 'parent', this);
                propValue.on('updated', this.createOnUpdated(propName));
            }
            this[propName] = propValue;
        });
    }
    createOnUpdated(propName) {
        return (updated, merge) => {
            if (!this.__isUpdatesDisabled) {
                var newUpdated = this;
                var newMerge = {};
                newMerge[propName] = merge;
                if (updated.version) {
                    this.version = updated.version;
                }
                else {
                    this.version = SyncNodeUtils.guidShort();
                }
                newMerge.version = this.version;
                this.emit('updated', newUpdated, newMerge);
            }
        };
    }
    set(key, val) {
        let merge = {};
        let split = key.split('.');
        let curr = merge;
        for (var i = 0; i < split.length - 1; i++) {
            curr[split[i]] = {};
            curr = curr[split[i]];
        }
        curr[split[split.length - 1]] = val;
        var result = this.merge(merge);
        return this;
    }
    get(path) {
        if (!path)
            return this;
        return SyncNodeUtils.getHelper(this, path.split('.'));
    }
    remove(key) {
        if (this.hasOwnProperty(key)) {
            this.merge({ '__remove': key });
        }
        return this;
    }
    merge(merge) {
        var result = this.doMerge(merge);
        if (result.hasChanges) {
            this.emit('updated', this, result.merge);
        }
        return this;
    }
    doMerge(merge, disableUpdates = false) {
        var hasChanges = false;
        var isEmpty = false;
        var newMerge = {};
        if (!merge) {
            console.error('Cannot merge: merge is not defined');
            return { hasChanges: false, merge: {} };
        }
        Object.keys(merge).forEach((key) => {
            if (key === '__remove') {
                var propsToRemove = merge[key];
                if (!Array.isArray(propsToRemove) && typeof propsToRemove === 'string') {
                    var arr = [];
                    arr.push(propsToRemove);
                    propsToRemove = arr;
                }
                propsToRemove.forEach((prop) => {
                    delete this[prop];
                });
                if (!disableUpdates) {
                    this.version = SyncNodeUtils.guidShort();
                    newMerge['__remove'] = propsToRemove;
                    hasChanges = true;
                }
            }
            else {
                var currVal = this[key];
                var newVal = merge[key];
                if (!SyncNodeUtils.equals(currVal, newVal)) {
                    if (!SyncNodeUtils.isObject(newVal)) {
                        // at a leaf node of the merge
                        // we already know they aren't equal, simply set the value
                        this[key] = newVal;
                        if (!disableUpdates) {
                            this.version = SyncNodeUtils.guidShort();
                            newMerge[key] = newVal;
                            hasChanges = true;
                        }
                    }
                    else {
                        // about to merge an object, make sure currVal is a SyncNode	
                        if (!SyncNodeUtils.isSyncNode(currVal)) {
                            currVal = new SyncNode({}, this);
                        }
                        currVal.clearListeners();
                        currVal.on('updated', this.createOnUpdated(key));
                        var result = currVal.doMerge(newVal, disableUpdates);
                        if (typeof this[key] === 'undefined') {
                            result.hasChanges = true;
                        }
                        this[key] = currVal;
                        if (!disableUpdates && result.hasChanges) {
                            if (typeof currVal.version === 'undefined') {
                                currVal.version = SyncNodeUtils.guidShort();
                            }
                            this.version = currVal.version;
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
    }
    // Like set(), but assumes or adds a key property 
    setItem(item) {
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
    }
}
exports.SyncNode = SyncNode;
class SyncNodeLocal extends SyncNode {
    constructor(id) {
        let data = JSON.parse(localStorage.getItem(id));
        super(data);
        this.on('updated', () => {
            localStorage.setItem(id, JSON.stringify(this));
        });
    }
}
exports.SyncNodeLocal = SyncNodeLocal;
class SyncNodeClient extends SyncNodeEventEmitter {
    constructor() {
        super();
        if (!('WebSocket' in window)) {
            throw new Error('SyncNode only works with browsers that support WebSockets');
        }
        this.socketUrl = window.location.origin.replace(/^http(s?):\/\//, 'ws$1://');
        this.channels = {};
        //window.addEventListener('load', () => {
        this.tryConnect();
        //});
    }
    socketOnOpen(msg) {
        console.log('connected!');
        this.emit('open');
    }
    socketOnClosed(msg) {
        console.log('Socket connection closed: ', msg);
        this.emit('closed');
        setTimeout(() => {
            console.log('Retrying socket connection...');
            this.tryConnect();
        }, 2000);
    }
    socketOnMessage(msg) {
        let deserialized = JSON.parse(msg.data);
        if (!deserialized.channel) {
            console.error('Error: msg is missing channel.', deserialized);
        }
        else {
            let channel = this.channels[deserialized.channel];
            if (channel) {
                channel.handleMessage(deserialized);
            }
        }
    }
    socketOnError(msg) {
        console.error(msg);
        this.emit('error', msg);
    }
    send(msg) {
        this.socket.send(msg);
    }
    tryConnect() {
        console.log('connecting...');
        let socket = new WebSocket(this.socketUrl);
        socket.onopen = this.socketOnOpen.bind(this);
        socket.onclose = this.socketOnClosed.bind(this);
        socket.onmessage = this.socketOnMessage.bind(this);
        socket.onerror = this.socketOnError.bind(this);
        this.socket = socket;
    }
    subscribe(channelName) {
        if (!this.channels[channelName]) {
            this.channels[channelName] = new SyncNodeChannel(this, channelName);
        }
        return this.channels[channelName];
    }
}
exports.SyncNodeClient = SyncNodeClient;
class SyncNodeChannel extends SyncNodeEventEmitter {
    constructor(client, channelName) {
        super();
        this.client = client;
        this.channelName = channelName;
        client.on('open', () => this.send('subscribe'));
    }
    send(type, data) {
        let msg = {
            channel: this.channelName,
            type: type,
            data: data
        };
        let serialized = JSON.stringify(msg);
        this.client.send(serialized);
    }
    handleMessage(msg) {
        switch (msg.type) {
            case 'subscribed':
                if (this.data) {
                    this.data.clearListeners();
                }
                this.data = new SyncNode(msg.data);
                this.data.on('updated', (data, merge) => {
                    this.send('updated', merge);
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
    }
}
exports.SyncNodeChannel = SyncNodeChannel;


/***/ })
/******/ ]);