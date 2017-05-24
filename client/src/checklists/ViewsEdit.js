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
define(["require", "exports", "syncnode-client", "../Components"], function (require, exports, syncnode_client_1, Components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NewChecklist = (function (_super) {
        __extends(NewChecklist, _super);
        function NewChecklist(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.title = _this.add('h2', { "innerHTML": "New Checklist", "className": "" });
            _this.textInput = _this.addView(new Components_1.Input({ twoway: false }), 'col-nofill', undefined);
            _this.footer = _this.add('div', { "innerHTML": "", "className": "col-fill div_footer_style col-fill" });
            _this.addBtn = _this.add('button', { "parent": "footer", "innerHTML": "Create Checklist", "className": "" });
            _this.cancelBtn = _this.add('button', { "parent": "footer", "innerHTML": "Cancel", "className": "" });
            _this.el.className += ' modal-inner col';
            _this.addBtn.addEventListener('click', function () {
                var name = _this.textInput.value().trim();
                if (!name.length) {
                    alert('Name is required.');
                    return;
                }
                var item = {
                    name: name,
                    groups: {}
                };
                _this.data.setItem(item);
                _this.textInput.clear();
                _this.emit('hide');
            });
            _this.cancelBtn.addEventListener('click', function () { _this.emit('hide'); });
            return _this;
        }
        return NewChecklist;
    }(syncnode_client_1.SyncView));
    exports.NewChecklist = NewChecklist;
    syncnode_client_1.SyncView.addGlobalStyle('.div_footer_style', " margin: 1em 0; ");
    var EditChecklist = (function (_super) {
        __extends(EditChecklist, _super);
        function EditChecklist(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.title = _this.add('h2', { "innerHTML": "Edit Checklist", "className": "" });
            _this.textInput = _this.addView(new Components_1.Input({ label: 'Checklist Name:', key: 'name' }), 'col-nofill Input_textInput_style', undefined);
            _this.groupsContainer = _this.add('div', { "innerHTML": "", "className": " div_groupsContainer_style" });
            _this.groups = _this.addView(new syncnode_client_1.SyncList({ item: Group }), '', _this.groupsContainer);
            _this.addNew = _this.add('div', { "parent": "groupsContainer", "innerHTML": "", "className": "row div_addNew_style row" });
            _this.titleAddgroup = _this.add('div', { "parent": "addNew", "innerHTML": "Add Group:", "className": "row-nofill row-nofill" });
            _this.addGroup = _this.addView(new Components_1.AddText(), 'row-fill', _this.addNew);
            _this.footer = _this.add('div', { "innerHTML": "", "className": "col-fill div_footer_style col-fill" });
            _this.deleteBtn = _this.add('button', { "parent": "footer", "innerHTML": "Delete", "className": "" });
            _this.closeBtn = _this.add('button', { "parent": "footer", "innerHTML": "Close", "className": "" });
            _this.el.className += ' modal-inner col';
            _this.addBinding('textInput', 'update', 'data');
            _this.addBinding('groups', 'update', 'data.groups');
            _this.addGroup.on('add', function (text) {
                var group = {
                    name: text,
                    items: {}
                };
                _this.data.groups.setItem(group);
                _this.addGroup.clear();
            });
            _this.deleteBtn.addEventListener('click', function () {
                if (confirm('Delete Checklist?')) {
                    _this.data.parent.remove(_this.data.key);
                    _this.emit('hide');
                }
            });
            _this.closeBtn.addEventListener('click', function () { _this.emit('hide'); });
            return _this;
        }
        return EditChecklist;
    }(syncnode_client_1.SyncView));
    exports.EditChecklist = EditChecklist;
    syncnode_client_1.SyncView.addGlobalStyle('.Input_textInput_style', " background-color: #DDF; padding: 4px; ");
    syncnode_client_1.SyncView.addGlobalStyle('.div_groupsContainer_style', " margin-left: 1em; margin-top: 1em; ");
    syncnode_client_1.SyncView.addGlobalStyle('.div_addNew_style', " background-color: #DFF; padding: 4px; ");
    syncnode_client_1.SyncView.addGlobalStyle('.div_footer_style', " margin: 1em 0; ");
    var Group = (function (_super) {
        __extends(Group, _super);
        function Group(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.header = _this.add('div', { "innerHTML": "", "className": "row div_header_style row" });
            _this.textInput = _this.addView(new Components_1.Input({ label: 'Group:', key: 'name' }), 'col-nofill', _this.header);
            _this.items = _this.addView(new syncnode_client_1.SyncList({ item: Item }), ' SyncList_items_style', undefined);
            _this.addNew = _this.add('div', { "innerHTML": "", "className": "row div_addNew_style2 row" });
            _this.titleAdd = _this.add('div', { "parent": "addNew", "innerHTML": "Add Item:", "className": "row-nofill row-nofill" });
            _this.addItem = _this.addView(new Components_1.AddText(), 'row-fill', _this.addNew);
            _this.el.className += ' ';
            _this.addBinding('textInput', 'update', 'data');
            _this.addBinding('items', 'update', 'data.items');
            _this.addItem.on('add', function (text) {
                var item = {
                    name: text
                };
                _this.data.items.setItem(item);
                _this.addItem.clear();
            });
            return _this;
        }
        return Group;
    }(syncnode_client_1.SyncView));
    exports.Group = Group;
    syncnode_client_1.SyncView.addGlobalStyle('.div_header_style', " background-color: #DDF; padding: 4px; ");
    syncnode_client_1.SyncView.addGlobalStyle('.SyncList_items_style', " margin-left: 1em; ");
    syncnode_client_1.SyncView.addGlobalStyle('.div_addNew_style2', " margin-left: 1em; background-color: #FDF; padding: 4px; ");
    var Item = (function (_super) {
        __extends(Item, _super);
        function Item(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.name = _this.addView(new Components_1.Input({ key: 'name' }), 'row-fill', undefined);
            _this.deleteBtn = _this.add('button', { "innerHTML": "delete", "className": "material-icons material-icons" });
            _this.el.className += ' row';
            _this.el.className += ' Item_style';
            _this.addBinding('name', 'update', 'data');
            _this.deleteBtn.addEventListener('click', function () {
                _this.data.parent.remove(_this.data.key);
            });
            return _this;
        }
        return Item;
    }(syncnode_client_1.SyncView));
    exports.Item = Item;
    syncnode_client_1.SyncView.addGlobalStyle('.Item_style', " padding: 8px; border: 1px solid #777; ");
});
