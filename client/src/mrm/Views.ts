import { SyncNode } from "syncnode-common";
import { SyncView, SyncList, SyncUtils } from "syncnode-client";


import * as Models from './Models';
import { Input, SimpleHeader, Tabs } from '../Components';

export class MainView extends SyncView<Models.Main> {
	title = this.add('h1', {"innerHTML":"Managment Review","className":"pad-small pad-small"});
	tabs = this.addView(new Tabs(), '');
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.el.className += ' MainView_style';
	}
	init() {
    this.tabs.addTab('a', new SectionA());
    this.tabs.addTab('b', new SectionB());
    this.tabs.selectFirstTab();
  }
}

export class SectionA extends SyncView<SyncNode> {
	title = this.add('h1', {"innerHTML":"Title Goes Here","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
	}
}

export class SectionB extends SyncView<SyncNode> {
	title = this.add('h1', {"innerHTML":"Title Goes Here","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
	}
}

SyncView.addGlobalStyle('.MainView_style', ` max-width: 900px; border: 1px solid #00F; `);
