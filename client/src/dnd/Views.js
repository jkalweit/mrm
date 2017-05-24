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
    function roll(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    var MainView = (function (_super) {
        __extends(MainView, _super);
        function MainView(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.title = _this.add('h3', { "innerHTML": "The Shield of Phandalin", "className": "" });
            _this.rolls = _this.addView(new Roll(), ' Roll_rolls_style', undefined);
            _this.toons = _this.addView(new syncnode_client_1.SyncList({ item: Toon }), 'row', undefined);
            _this.addEncounter = _this.add('button', { "innerHTML": "Add Encounter", "className": " button_addEncounter_style" });
            _this.encounters = _this.addView(new syncnode_client_1.SyncList({ item: Encounter, sortField: 'createdAt', sortReversed: true }), 'row', undefined);
            _this.el.className += ' pad-small';
            _this.addBinding('toons', 'update', 'data.toons');
            _this.addEncounter.addEventListener('click', function () {
                _this.data.encounters.setItem({
                    createdAt: new Date().toISOString(),
                    name: '',
                    note: ''
                });
            });
            _this.addBinding('encounters', 'update', 'data.encounters');
            return _this;
        }
        return MainView;
    }(syncnode_client_1.SyncView));
    exports.MainView = MainView;
    syncnode_client_1.SyncView.addGlobalStyle('.Roll_rolls_style', " width: 300px; ");
    syncnode_client_1.SyncView.addGlobalStyle('.button_addEncounter_style', " margin-top: 1em; ");
    var Toon = (function (_super) {
        __extends(Toon, _super);
        function Toon(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.header = _this.add('div', { "innerHTML": "", "className": "row col-nofill row col-nofill" });
            _this.name = _this.addView(new Components_1.Input({ key: 'name' }), 'row-fill', _this.header);
            _this.showStats = _this.add('button', { "parent": "header", "innerHTML": "...", "className": "row-nofill row-nofill" });
            _this.stats = _this.addView(new ToonStats(), 'col-nofill hidden', undefined);
            _this.roll = _this.add('div', { "innerHTML": "", "className": "row col-nofill row col-nofill" });
            _this.rollBtn = _this.add('button', { "parent": "roll", "innerHTML": "Init", "className": "row-nofill row-nofill" });
            _this.rollResult = _this.add('div', { "parent": "roll", "innerHTML": "", "className": "row-fill row-fill" });
            _this.note = _this.addView(new Components_1.TextArea({ key: 'note' }), 'col-fill', undefined);
            _this.el.className += ' row-nofill col';
            _this.el.className += ' Toon_style';
            _this.addBinding('name', 'update', 'data');
            _this.showStats.addEventListener('click', function () { _this.stats.el.classList.toggle('hidden'); });
            _this.addBinding('stats', 'update', 'data.stats');
            _this.rollBtn.addEventListener('click', function () {
                var val = roll(1, 20);
                var finalVal = val + (_this.data.stats.init || 0);
                _this.rollResult.innerHTML = val.toString() + ' + ' + (_this.data.stats.init || 0) + ' = ' + finalVal;
            });
            _this.addBinding('note', 'update', 'data');
            return _this;
        }
        return Toon;
    }(syncnode_client_1.SyncView));
    exports.Toon = Toon;
    var ToonStats = (function (_super) {
        __extends(ToonStats, _super);
        function ToonStats(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.initStat = _this.addView(new Components_1.Input({ key: 'init', label: 'Init', number: true }), '', undefined);
            _this.strStat = _this.addView(new Components_1.Input({ key: 'strength', label: 'Strength', number: true }), '', undefined);
            _this.el.className += ' ';
            _this.addBinding('initStat', 'update', 'data');
            _this.addBinding('strStat', 'update', 'data');
            return _this;
        }
        return ToonStats;
    }(syncnode_client_1.SyncView));
    exports.ToonStats = ToonStats;
    var Encounter = (function (_super) {
        __extends(Encounter, _super);
        function Encounter(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.header = _this.add('div', { "innerHTML": "", "className": "row row" });
            _this.name = _this.addView(new Components_1.Input({ key: 'name' }), 'row-fill Input_name_style', _this.header);
            _this.delBtn = _this.add('button', { "parent": "header", "innerHTML": "delete", "className": "material-icons row-nofill material-icons row-nofill" });
            _this.note = _this.addView(new Components_1.TextArea({ key: 'note' }), ' TextArea_note_style', undefined);
            _this.el.className += ' row-nofill';
            _this.el.className += ' Encounter_style';
            _this.addBinding('name', 'update', 'data');
            _this.delBtn.addEventListener('click', function () { if (confirm('Delete encounter?')) {
                _this.data.parent.remove(_this.data.key);
            } });
            _this.addBinding('note', 'update', 'data');
            return _this;
        }
        return Encounter;
    }(syncnode_client_1.SyncView));
    exports.Encounter = Encounter;
    syncnode_client_1.SyncView.addGlobalStyle('.Input_name_style', " width: auto; ");
    syncnode_client_1.SyncView.addGlobalStyle('.TextArea_note_style', " height: 400px; ");
    var Roll = (function (_super) {
        __extends(Roll, _super);
        function Roll(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({}, options)) || this;
            _this.roll20 = _this.addView(new RollBtn({ label: 'Roll 20', max: 20 }), '', undefined);
            _this.roll12 = _this.addView(new RollBtn({ label: 'Roll 12', max: 12 }), '', undefined);
            _this.roll10 = _this.addView(new RollBtn({ label: 'Roll 10', max: 10 }), '', undefined);
            _this.roll8 = _this.addView(new RollBtn({ label: 'Roll 8', max: 8 }), '', undefined);
            _this.roll6 = _this.addView(new RollBtn({ label: 'Roll 6', max: 6 }), '', undefined);
            _this.roll4 = _this.addView(new RollBtn({ label: 'Roll 4', max: 4 }), '', undefined);
            _this.el.className += ' col';
            return _this;
        }
        return Roll;
    }(syncnode_client_1.SyncView));
    exports.Roll = Roll;
    var RollBtn = (function (_super) {
        __extends(RollBtn, _super);
        function RollBtn(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, syncnode_client_1.SyncUtils.mergeMap({ label: 'Roll', min: 1, max: 20 }, options)) || this;
            _this.rollBtn = _this.add('button', { "innerHTML": "", "className": "row-nofill row-nofill" });
            _this.rollRes = _this.add('span', { "innerHTML": "", "className": "row-fill span_rollRes_style row-fill" });
            _this.clearBtn = _this.add('button', { "innerHTML": "x", "className": "row-nofill row-nofill" });
            _this.el.className += ' row border';
            _this.rollBtn.addEventListener('click', function () {
                var val = roll(_this.options.min, _this.options.max);
                _this.rollRes.innerHTML = val.toString() + ', ' + _this.rollRes.innerHTML;
            });
            _this.clearBtn.addEventListener('click', function () { _this.rollRes.innerHTML = ''; });
            return _this;
        }
        RollBtn.prototype.init = function () {
            this.rollBtn.innerHTML = this.options.label;
        };
        return RollBtn;
    }(syncnode_client_1.SyncView));
    exports.RollBtn = RollBtn;
    syncnode_client_1.SyncView.addGlobalStyle('.span_rollRes_style', " \n      overflow-x: auto;\n    ");
    syncnode_client_1.SyncView.addGlobalStyle('.Toon_style', " width: 200px; border: 1px solid #777; ");
    syncnode_client_1.SyncView.addGlobalStyle('.Encounter_style', " width: 200px; border: 1px solid #777; ");
});
