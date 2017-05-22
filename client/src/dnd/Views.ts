import { SyncNode } from "syncnode-common";
import { SyncView, SyncList, SyncUtils } from "syncnode-client";


import * as Models from './Models';
import { AdminMode, Modal, Input, TextArea, SimpleHeader, AddText } from '../Components';

function roll(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export class MainView2 extends SyncView<Models.Main> {
	title = this.add('h1', {"innerHTML":"test","className":""});
	t = this.addView(new TextArea({ key: 'test1' }), '', undefined);
	t2 = this.addView(new TextArea({ key: 'test2' }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('t', 'update', 'data');
		this.addBinding('t2', 'update', 'data');
	}
}

export class MainView extends SyncView<Models.Main> {
	title = this.add('h3', {"innerHTML":"The Phandalin 5","className":""});
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

SyncView.addGlobalStyle('.button_addEncounter_style', ` margin-top: 1em; `);
export class Toon extends SyncView<Models.Toon> {
	name = this.addView(new Input({ key: 'name' }), '', undefined);
	stats = this.add('div', {"innerHTML":"","className":"col col"});
	initStat = this.addView(new Input({ key: 'init', label: 'Init' }), '', this.stats);
	roll = this.add('div', {"innerHTML":"","className":"row row"});
	rollBtn = this.add('button', {"parent":"roll","innerHTML":"Init","className":"row-nofill row-nofill"});
	rollResult = this.add('div', {"parent":"roll","innerHTML":"","className":"row-fill row-fill"});
	note = this.addView(new TextArea({ key: 'note' }), ' TextArea_note_style', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' row-nofill';
		this.el.className += ' Toon_style';
		this.addBinding('name', 'update', 'data');
		this.addBinding('initStat', 'update', 'data.stats');
		this.rollBtn.addEventListener('click', () => { 
            const val = roll(1, 20);
            this.rollResult.innerHTML = val.toString();
         });
		this.addBinding('note', 'update', 'data');
	}
}

SyncView.addGlobalStyle('.TextArea_note_style', ` height: 400px; `);
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
SyncView.addGlobalStyle('.Toon_style', ` width: 200px; border: 1px solid #777; `);
SyncView.addGlobalStyle('.Encounter_style', ` width: 200px; border: 1px solid #777; `);
