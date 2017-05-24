var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "syncnode-client"], function (require, exports, syncnode_client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Input = (function (_super) {
        __extends(Input, _super);
        function Input(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({ twoway: true, labelWidth: '100px', number: false }, options)) || this;
            _this.label = _this.add('span', { "innerHTML": "", "className": "row-nofill span_label_style row-nofill" });
            _this.input = _this.add('input', { "innerHTML": "", "className": "row-fill input_input_style row-fill" });
            _this.el.className += ' row';
            _this.el.className += ' Input_style';
            _this.el.addEventListener('change', _this.onChange.bind(_this));
            return _this;
        }
        Input.prototype.onChange = function () {
            var val = this.input.value;
            if (this.options.twoway && this.options.key) {
                if (this.options.number) {
                    val = parseInt(val);
                    if (isNaN(val)) {
                        alert('Value must be an integer.');
                        return;
                    }
                }
                this.data.set(this.options.key, val);
            }
            this.emit('change', val);
        };
        Input.prototype.value = function () {
            return this.input.value;
        };
        Input.prototype.clear = function () {
            this.input.value = '';
        };
        Input.prototype.init = function () {
            if (this.options.label) {
                this.label.innerHTML = this.options.label;
            }
            this.label.style.display = this.options.label ? 'flex' : 'none';
            if (this.options.labelWidth)
                this.label.style.width = this.options.labelWidth;
        };
        Input.prototype.render = function () {
            if (this.data) {
                var val = this.options.key ? this.data.get(this.options.key) || '' : this.data || '';
                if (this.input.value != val) {
                    this.input.value = val;
                }
            }
        };
        return Input;
    }(syncnode_client_1.SyncView));
    exports.Input = Input;
    syncnode_client_1.SyncView.addGlobalStyle('.span_label_style', "\n            display: flex;\n            flex-direction: column;\n            justify-content: center;\n        ");
    syncnode_client_1.SyncView.addGlobalStyle('.input_input_style', " \n            font-size: 1em; \n            padding: 0.5em 0;  \n            background-color: transparent;\n            border: none;\n            border-bottom = 1px solid rgba(0,0,0,0.25);\n        ");
    var TextArea = (function (_super) {
        __extends(TextArea, _super);
        function TextArea(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({ tag: 'textarea', twoway: true, labelWidth: '100px' }, options)) || this;
            _this.el.className += ' ';
            _this.el.className += ' TextArea_style';
            _this.el.addEventListener('input', _this.onInput.bind(_this));
            _this.el.addEventListener('change', _this.onChange.bind(_this));
            return _this;
        }
        TextArea.prototype.onInput = function () {
            this.autoresize();
        };
        TextArea.prototype.onChange = function () {
            var val = this.el.value;
            if (this.options.twoway && this.options.key) {
                this.data.set(this.options.key, val);
            }
            this.emit('change', val);
        };
        TextArea.prototype.value = function () {
            return this.el.value;
        };
        TextArea.prototype.clear = function () {
            this.el.value = '';
        };
        TextArea.prototype.autoresize = function () {
            var scrollLeft = window.pageXOffset ||
                (document.documentElement || document.body.parentNode || document.body).scrollLeft;
            var scrollTop = window.pageYOffset ||
                (document.documentElement || document.body.parentNode || document.body).scrollTop;
            this.el.style.minHeight = 'auto';
            this.el.style.minHeight = this.el.scrollHeight + 10 + 'px';
            window.scrollTo(scrollLeft, scrollTop);
        };
        TextArea.prototype.render = function () {
            if (this.data) {
                var val = this.options.key ? this.data.get(this.options.key) || '' : this.data || '';
                if (this.el.value != val) {
                    this.el.value = val;
                }
            }
            this.autoresize();
        };
        return TextArea;
    }(syncnode_client_1.SyncView));
    exports.TextArea = TextArea;
    var Modal = (function (_super) {
        __extends(Modal, _super);
        function Modal(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({ hideOnClick: true }, options)) || this;
            _this.viewContainer = _this.add('div', { "innerHTML": "", "className": "" });
            _this.el.className += ' ';
            _this.el.className += ' Modal_style';
            _this.el.addEventListener('click', _this.onClick.bind(_this));
            _this.viewContainer.addEventListener('click', function (e) { e.stopPropagation(); });
            return _this;
        }
        Modal.prototype.onClick = function () { if (this.options.hideOnClick) {
            this.hide();
        } };
        Modal.prototype.init = function () {
            var _this = this;
            this.hide();
            if (this.options.view) {
                this.view = new this.options.view();
                this.view.on('hide', function () {
                    _this.hide();
                    _this.emit('hide');
                });
                this.viewContainer.appendChild(this.view.el);
            }
        };
        Modal.prototype.render = function () {
            if (this.view)
                this.view.update(this.data);
        };
        return Modal;
    }(syncnode_client_1.SyncView));
    exports.Modal = Modal;
    var SimpleHeader = (function (_super) {
        __extends(SimpleHeader, _super);
        function SimpleHeader(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.title = _this.add('span', { "innerHTML": "", "className": "row-fill span_title_style row-fill" });
            _this.addBtn = _this.add('button', { "innerHTML": "Add", "className": "row-nofill row-nofill" });
            _this.el.className += ' row';
            _this.addBtn.addEventListener('click', function () { _this.emit('add'); });
            return _this;
        }
        SimpleHeader.prototype.showButtons = function (val) {
            this.addBtn.style.display = val ? 'flex' : 'none';
        };
        SimpleHeader.prototype.init = function () {
            this.title.innerHTML = this.options.title;
        };
        return SimpleHeader;
    }(syncnode_client_1.SyncView));
    exports.SimpleHeader = SimpleHeader;
    syncnode_client_1.SyncView.addGlobalStyle('.span_title_style', " \n            font-weight: bold; \n            font-size: 1.5em;\n        ");
    var Tabs = (function (_super) {
        __extends(Tabs, _super);
        function Tabs(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.tabsArr = [];
            _this.headers = _this.add('div', { "innerHTML": "", "className": "col-nofill row div_headers_style col-nofill row" });
            _this.scrollContainer = _this.add('div', { "innerHTML": "", "className": "col-fill div_scrollContainer_style col-fill" });
            _this.tabs = _this.add('div', { "parent": "scrollContainer", "innerHTML": "", "className": "" });
            _this.el.className += ' col';
            return _this;
        }
        Tabs.prototype.addTab = function (title, view) {
            var _this = this;
            var tab = new Tab();
            tab.header = new TabHeaderItem({ text: title });
            tab.header.tabsContainer = this;
            tab.header.init();
            tab.view = view;
            tab.view.init();
            tab.init();
            tab.header.on('selected', function () {
                _this.selectedItem = tab.header;
                _this.emit('selected', _this.selectedItem);
                _this.tabs.innerHTML = '';
                _this.tabs.appendChild(tab.view.el);
            });
            this.headers.appendChild(tab.header.el);
            this.tabsArr.push(tab);
        };
        Tabs.prototype.selectTab = function (index) {
            if (this.tabsArr.length > index) {
                this.tabsArr[index].header.select();
            }
        };
        return Tabs;
    }(syncnode_client_1.SyncView));
    exports.Tabs = Tabs;
    syncnode_client_1.SyncView.addGlobalStyle('.div_headers_style', " border-bottom: 1px solid #CCC; ");
    syncnode_client_1.SyncView.addGlobalStyle('.div_scrollContainer_style', " overflow-y: auto; ");
    var TabHeaderItem = (function (_super) {
        __extends(TabHeaderItem, _super);
        function TabHeaderItem(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.text = _this.add('span', { "innerHTML": "", "className": "" });
            _this.el.className += ' row-nofill pad-small no-select';
            _this.el.className += ' TabHeaderItem_style';
            _this.el.addEventListener('click', _this.onClick.bind(_this));
            _this.addBinding('text', 'innerHTML', 'options.text');
            return _this;
        }
        TabHeaderItem.prototype.select = function () {
            this.emit('selected', this);
        };
        TabHeaderItem.prototype.onClick = function () {
            this.select();
        };
        TabHeaderItem.prototype.init = function () {
            var _this = this;
            this.bind();
            this.tabsContainer.on('selected', function (item) {
                var selected = item === _this;
                _this.el.style.border = selected ? '1px solid #666' : '1px solid #BBB';
                _this.el.style.borderBottom = selected ? 'none' : '1px solid #BBB';
                _this.el.style.backgroundColor = selected ? '#FFF' : '#CCC';
            });
        };
        return TabHeaderItem;
    }(syncnode_client_1.SyncView));
    exports.TabHeaderItem = TabHeaderItem;
    var Tab = (function (_super) {
        __extends(Tab, _super);
        function Tab(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.el.className += ' ';
            return _this;
        }
        return Tab;
    }(syncnode_client_1.SyncView));
    exports.Tab = Tab;
    var AddText = (function (_super) {
        __extends(AddText, _super);
        function AddText(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({ btnText: 'add' }, options)) || this;
            _this.input = _this.add('input', { "innerHTML": "", "className": "row-fill row-fill" });
            _this.addBtn = _this.add('button', { "innerHTML": "", "className": "row-nofill material-icons row-nofill material-icons" });
            _this.el.className += ' row';
            _this.addBtn.addEventListener('click', function () { _this.emit('add', _this.input.value); });
            _this.addBinding('addBtn', 'innerHTML', 'options.btnText');
            return _this;
        }
        AddText.prototype.clear = function () { this.input.value = ''; };
        AddText.prototype.init = function () {
            this.bind();
        };
        return AddText;
    }(syncnode_client_1.SyncView));
    exports.AddText = AddText;
    var AdminMode = (function (_super) {
        __extends(AdminMode, _super);
        function AdminMode(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.enabled = false;
            _this.el.className += ' ';
            return _this;
        }
        AdminMode.prototype.init = function () {
            var _this = this;
            document.addEventListener('keypress', function (e) {
                if (e.keyCode === 30) {
                    _this.enabled = !_this.enabled;
                    _this.emit('changed', _this.enabled);
                }
            });
        };
        return AdminMode;
    }(syncnode_client_1.SyncView));
    exports.AdminMode = AdminMode;
    syncnode_client_1.SyncView.addGlobalStyle('.Input_style', " \n        display: flex; \n        flex-direction: row;\n        width: 100%;\n    ");
    syncnode_client_1.SyncView.addGlobalStyle('.TextArea_style', " \n        width: 100%;\n        display: flex; \n        flex: 1;\n        font-size: 1em;\n        padding: 0.5em;\n        background-color: transparent;\n    ");
    syncnode_client_1.SyncView.addGlobalStyle('.Modal_style', " \n        position: fixed;\n        left: 0; right: 0; top: 0; bottom: 0;\n        background-color: rgba(0,0,0,0.7);\n        overflow-y: scroll;\n        display: flex;\n        align-items: center;\n        justify-content: center;\t\n    ");
    syncnode_client_1.SyncView.addGlobalStyle('.TabHeaderItem_style', " border: 1px solid #BBB; min-width: 50px; text-align: center; ");
});
