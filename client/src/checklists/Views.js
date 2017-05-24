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
define(["require", "exports", "syncnode-client", "../Components", "./ViewsEdit"], function (require, exports, syncnode_client_1, Components_1, ViewsEdit_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainView = (function (_super) {
        __extends(MainView, _super);
        function MainView(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.checklists = _this.addView(new Checklists(), 'row-nofill Checklists_checklists_style', undefined);
            _this.checklist = _this.addView(new Checklist(), 'row-fill Checklist_checklist_style', undefined);
            _this.el.className += ' row pad-small';
            _this.el.className += ' MainView_style';
            _this.checklists.on('selected', function (list) {
                console.log('list', list);
                _this.selectedChecklist = list;
                _this.bind();
            });
            _this.addBinding('checklists', 'update', 'data');
            _this.addBinding('checklist', 'update', 'selectedChecklist');
            return _this;
        }
        return MainView;
    }(syncnode_client_1.SyncView));
    exports.MainView = MainView;
    syncnode_client_1.SyncView.addGlobalStyle('.Checklists_checklists_style', " width: 250px; ");
    syncnode_client_1.SyncView.addGlobalStyle('.Checklist_checklist_style', " margin-left: 1em; ");
    var Checklists = (function (_super) {
        __extends(Checklists, _super);
        function Checklists(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.addModal = _this.addView(new Components_1.Modal({ view: ViewsEdit_1.NewChecklist }), '', undefined);
            _this.header = _this.add('div', { "innerHTML": "", "className": "row div_header_style row" });
            _this.title = _this.add('div', { "parent": "header", "innerHTML": "Checklists", "className": "row-fill bold row-fill bold" });
            _this.showModal = _this.add('button', { "parent": "header", "innerHTML": "New Checklist", "className": "row-nofill row-nofill" });
            _this.checklists = _this.addView(new syncnode_client_1.SyncList({ item: ChecklistListItem }), '', undefined);
            _this.el.className += ' ';
            _this.addBinding('addModal', 'update', 'data.checklists');
            _this.showModal.addEventListener('click', function () { _this.addModal.show(); });
            _this.checklists.on('selected', function (view, list) {
                _this.emit('selected', list);
            });
            _this.addBinding('checklists', 'update', 'data.checklists');
            return _this;
        }
        return Checklists;
    }(syncnode_client_1.SyncView));
    exports.Checklists = Checklists;
    syncnode_client_1.SyncView.addGlobalStyle('.div_header_style', " margin-bottom: 1em; ");
    var Checklist = (function (_super) {
        __extends(Checklist, _super);
        function Checklist(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.editModal = _this.addView(new Components_1.Modal({ view: ViewsEdit_1.EditChecklist }), '', undefined);
            _this.header = _this.add('div', { "innerHTML": "", "className": "row center-vert header-small row center-vert header-small" });
            _this.name = _this.add('div', { "parent": "header", "innerHTML": "", "className": "row-fill bold row-fill bold" });
            _this.editList = _this.add('button', { "parent": "header", "innerHTML": "Edit List", "className": "row-nofill row-nofill" });
            _this.resetList = _this.add('button', { "parent": "header", "innerHTML": "Reset List", "className": "row-nofill row-nofill" });
            _this.groups = _this.addView(new syncnode_client_1.SyncList({ item: Group }), ' SyncList_groups_style', undefined);
            _this.el.className += ' ';
            _this.el.className += ' Checklist_style';
            _this.addBinding('editModal', 'update', 'data');
            _this.addBinding('name', 'innerHTML', 'data.name');
            _this.editList.addEventListener('click', function () { _this.editModal.show(); });
            _this.resetList.addEventListener('click', function () {
                if (!confirm('Reset this checklist?'))
                    return;
                var merge = {};
                syncnode_client_1.SyncUtils.forEach(_this.data.groups, function (group) {
                    var groupMerge = { items: {} };
                    merge[group.key] = groupMerge;
                    syncnode_client_1.SyncUtils.forEach(group.items, function (item) {
                        groupMerge.items[item.key] = { completedAt: '' };
                    });
                });
                _this.data.groups.merge(merge);
            });
            _this.addBinding('groups', 'update', 'data.groups');
            return _this;
        }
        Checklist.prototype.render = function () {
            this.el.classList.toggle('hidden', !this.data);
        };
        return Checklist;
    }(syncnode_client_1.SyncView));
    exports.Checklist = Checklist;
    syncnode_client_1.SyncView.addGlobalStyle('.SyncList_groups_style', " margin-left: 1em; ");
    var Group = (function (_super) {
        __extends(Group, _super);
        function Group(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.header = _this.add('div', { "innerHTML": "", "className": "row row" });
            _this.name = _this.add('div', { "parent": "header", "innerHTML": "", "className": "row-fill bold center-vert header-small row-fill bold center-vert header-small" });
            _this.items = _this.addView(new syncnode_client_1.SyncList({ item: Item }), ' SyncList_items_style', undefined);
            _this.el.className += ' ';
            _this.addBinding('name', 'innerHTML', 'data.name');
            _this.addBinding('items', 'update', 'data.items');
            return _this;
        }
        return Group;
    }(syncnode_client_1.SyncView));
    exports.Group = Group;
    syncnode_client_1.SyncView.addGlobalStyle('.SyncList_items_style', " margin-left: 1em; ");
    var Item = (function (_super) {
        __extends(Item, _super);
        function Item(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.name = _this.add('div', { "innerHTML": "", "className": "center-vert center-vert" });
            _this.el.className += ' ';
            _this.el.className += ' Item_style';
            _this.el.addEventListener('click', _this.onClick.bind(_this));
            _this.addBinding('name', 'innerHTML', 'data.name');
            return _this;
        }
        Item.prototype.onClick = function () {
            this.data.set('completedAt', this.data.completedAt ? '' : new Date().toISOString());
        };
        Item.prototype.render = function () {
            this.name.style.textDecoration = this.data.completedAt ? 'line-through' : 'none';
        };
        return Item;
    }(syncnode_client_1.SyncView));
    exports.Item = Item;
    var ChecklistListItem = (function (_super) {
        __extends(ChecklistListItem, _super);
        function ChecklistListItem(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.name = _this.add('div', { "innerHTML": "", "className": "" });
            _this.el.className += ' ';
            _this.el.className += ' ChecklistListItem_style';
            _this.el.addEventListener('click', _this.onClick.bind(_this));
            _this.addBinding('name', 'innerHTML', 'data.name');
            return _this;
        }
        ChecklistListItem.prototype.onClick = function () {
            this.emit('selected', this.data);
        };
        return ChecklistListItem;
    }(syncnode_client_1.SyncView));
    exports.ChecklistListItem = ChecklistListItem;
    syncnode_client_1.SyncView.addGlobalStyle('.MainView_style', " max-width: 900px; margin: 1em auto; ");
    syncnode_client_1.SyncView.addGlobalStyle('.Checklist_style', " max-width: 400px; ");
    syncnode_client_1.SyncView.addGlobalStyle('.Item_style', " padding: 8px; border: 1px solid #777; ");
    syncnode_client_1.SyncView.addGlobalStyle('.ChecklistListItem_style', " \n    border: 1px solid #777;\n    padding: 8px;\n  ");
});
