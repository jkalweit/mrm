import { SyncNode } from "syncnode-common";
import { SyncView, SyncList, SyncUtils } from "syncnode-client";


import * as Models from './Models';
import { AdminMode, Modal, Input, TextArea, SimpleHeader, AddText } from '../Components';

function roll(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class MainView extends SyncView<Models.Main> {
	title = this.add('h3', {"innerHTML":"The Shield of Phandalin","className":""});
	rolls = this.addView(new Roll(), ' Roll_rolls_style', undefined);
	toons = this.addView(new SyncList({ item: Toon }), 'row', undefined);
	addEncounter = this.add('button', {"innerHTML":"Add Encounter","className":" button_addEncounter_style"});
	encounters = this.addView(new SyncList({ item: Encounter, sortField: 'createdAt', sortReversed: true  }), 'row', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('toons', 'update', 'data.toons');
		this.addEncounter.addEventListener('click', () => { 
        this.data.encounters.setItem({
            createdAt: new Date().toISOString(),
            name: '', 
            note: ''
        });
     });
		this.addBinding('encounters', 'update', 'data.encounters');
	}
}

SyncView.addGlobalStyle('.Roll_rolls_style', ` width: 300px; `);
SyncView.addGlobalStyle('.button_addEncounter_style', ` margin-top: 1em; `);
export class Toon extends SyncView<Models.Toon> {
	header = this.add('div', {"innerHTML":"","className":"row col-nofill row col-nofill"});
	name = this.addView(new Input({ key: 'name' }), 'row-fill', this.header);
	showStats = this.add('button', {"parent":"header","innerHTML":"...","className":"row-nofill row-nofill"});
	stats = this.addView(new ToonStats(), 'col-nofill hidden', undefined);
	roll = this.add('div', {"innerHTML":"","className":"row col-nofill row col-nofill"});
	rollBtn = this.add('button', {"parent":"roll","innerHTML":"Init","className":"row-nofill row-nofill"});
	rollResult = this.add('div', {"parent":"roll","innerHTML":"","className":"row-fill row-fill"});
	note = this.addView(new TextArea({ key: 'note' }), 'col-fill', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' row-nofill col';
		this.el.className += ' Toon_style';
		this.addBinding('name', 'update', 'data');
		this.showStats.addEventListener('click', () => {  this.stats.el.classList.toggle('hidden');  });
		this.addBinding('stats', 'update', 'data.stats');
		this.rollBtn.addEventListener('click', () => { 
            const val = roll(1, 20);
            const finalVal = val + (this.data.stats.init || 0);
            this.rollResult.innerHTML = val.toString() + ' + ' + (this.data.stats.init || 0) + ' = ' + finalVal;
         });
		this.addBinding('note', 'update', 'data');
	}
}

export class ToonStats extends SyncView<Models.ToonStats> {
	initStat = this.addView(new Input({ key: 'init', label: 'Init', number: true }), '', undefined);
	strStat = this.addView(new Input({ key: 'strength', label: 'Strength', number: true }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.addBinding('initStat', 'update', 'data');
		this.addBinding('strStat', 'update', 'data');
	}
}

export class Encounter extends SyncView<Models.Encounter> {
	header = this.add('div', {"innerHTML":"","className":"row row"});
	name = this.addView(new Input({ key: 'name' }), 'row-fill Input_name_style', this.header);
	delBtn = this.add('button', {"parent":"header","innerHTML":"delete","className":"material-icons row-nofill material-icons row-nofill"});
	note = this.addView(new TextArea({ key: 'note' }), ' TextArea_note_style', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' row-nofill';
		this.el.className += ' Encounter_style';
		this.addBinding('name', 'update', 'data');
		this.delBtn.addEventListener('click', () => {  if(confirm('Delete encounter?')) { this.data.parent.remove(this.data.key); }  });
		this.addBinding('note', 'update', 'data');
	}
}

SyncView.addGlobalStyle('.Input_name_style', ` width: auto; `);
SyncView.addGlobalStyle('.TextArea_note_style', ` height: 400px; `);
export class Roll extends SyncView<SyncNode> {
	roll20 = this.addView(new RollBtn({ label: 'Roll 20', max: 20 }), '', undefined);
	roll12 = this.addView(new RollBtn({ label: 'Roll 12', max: 12 }), '', undefined);
	roll10 = this.addView(new RollBtn({ label: 'Roll 10', max: 10 }), '', undefined);
	roll8 = this.addView(new RollBtn({ label: 'Roll 8', max: 8 }), '', undefined);
	roll6 = this.addView(new RollBtn({ label: 'Roll 6', max: 6 }), '', undefined);
	roll4 = this.addView(new RollBtn({ label: 'Roll 4', max: 4 }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' col';
	}
}

export class RollBtn extends SyncView<SyncNode> {
	rollBtn = this.add('button', {"innerHTML":"","className":"row-nofill row-nofill"});
	rollRes = this.add('span', {"innerHTML":"","className":"row-fill span_rollRes_style row-fill"});
	clearBtn = this.add('button', {"innerHTML":"x","className":"row-nofill row-nofill"});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({ label: 'Roll', min: 1, max: 20 }, options));
		this.el.className += ' row border';
		this.rollBtn.addEventListener('click', () => { 
      const val = roll(this.options.min, this.options.max);
      this.rollRes.innerHTML = val.toString() + ', ' + this.rollRes.innerHTML;
     });
		this.clearBtn.addEventListener('click', () => {  this.rollRes.innerHTML = '';  });
	}
	init() {
    this.rollBtn.innerHTML = this.options.label;
  }
}

SyncView.addGlobalStyle('.span_rollRes_style', ` 
      overflow-x: auto;
    `);
SyncView.addGlobalStyle('.Toon_style', ` width: 200px; border: 1px solid #777; `);
SyncView.addGlobalStyle('.Encounter_style', ` width: 200px; border: 1px solid #777; `);
