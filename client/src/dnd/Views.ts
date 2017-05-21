import { SyncNode } from "syncnode-common";
import { SyncView, SyncList, SyncUtils } from "syncnode-client";


import * as Models from './Models';
import { AdminMode, Modal, Input, TextArea, SimpleHeader, AddText } from '../Components';

export class MainView extends SyncView<Models.Main> {
	title = this.add('h1', {"innerHTML":"The Phandalin 5","className":""});
	toons = this.addView(new SyncList({ item: Toon }), 'row', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('toons', 'update', 'data.toons');
	}
}

export class Toon extends SyncView<Models.Toon> {
	name = this.addView(new Input({ key: 'name' }), '', undefined);
	note = this.addView(new TextArea({ key: 'note' }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' row-nofill';
		this.el.className += ' Toon_style';
		this.addBinding('name', 'update', 'data');
		this.addBinding('note', 'update', 'data');
	}
}

SyncView.addGlobalStyle('.Toon_style', ` widht: 200px; border: 1px solid #777; `);
