import { SyncNode } from "syncnode-common";
import { SyncView, SyncList, SyncUtils } from "syncnode-client";


import * as Models from './Models';
import { AdminMode, Modal, Input, SimpleHeader, AddText } from '../Components';
import { NewChecklist, EditChecklist } from './ViewsEdit'

export class MainView extends SyncView<Models.Main> {

    selectedChecklist: Models.List;
  
 	checklists = this.addView(new Checklists(), 'row-nofill Checklists_checklists_style', undefined);
	checklist = this.addView(new Checklist(), 'row-fill Checklist_checklist_style', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' row pad-small';
		this.el.className += ' MainView_style';
		this.checklists.on('selected', (list: Models.List) => { 
      console.log('list', list)
      this.selectedChecklist = list;
      this.bind();
     });
		this.addBinding('checklists', 'update', 'data');
		this.addBinding('checklist', 'update', 'selectedChecklist');
	}
}

SyncView.addGlobalStyle('.Checklists_checklists_style', ` width: 250px; `);
SyncView.addGlobalStyle('.Checklist_checklist_style', ` margin-left: 1em; `);
export class Checklists extends SyncView<Models.Main> {
	addModal = this.addView(new Modal({ view: NewChecklist }), '', undefined);
	header = this.add('div', {"innerHTML":"","className":"row div_header_style row"});
	title = this.add('div', {"parent":"header","innerHTML":"Checklists","className":"row-fill bold row-fill bold"});
	showModal = this.add('button', {"parent":"header","innerHTML":"New Checklist","className":"row-nofill row-nofill"});
	checklists = this.addView(new SyncList({ item: ChecklistListItem }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.addBinding('addModal', 'update', 'data.checklists');
		this.showModal.addEventListener('click', () => {  this.addModal.show();  });
		this.checklists.on('selected', (view: SyncView<SyncNode>, list: Models.List) => {  
      this.emit('selected', list); 
     });
		this.addBinding('checklists', 'update', 'data.checklists');
	}
}

SyncView.addGlobalStyle('.div_header_style', ` margin-bottom: 1em; `);
export class Checklist extends SyncView<Models.List> {
	editModal = this.addView(new Modal({ view: EditChecklist }), '', undefined);
	header = this.add('div', {"innerHTML":"","className":"row center-vert header-small row center-vert header-small"});
	name = this.add('div', {"parent":"header","innerHTML":"","className":"row-fill bold row-fill bold"});
	editList = this.add('button', {"parent":"header","innerHTML":"Edit List","className":"row-nofill row-nofill"});
	resetList = this.add('button', {"parent":"header","innerHTML":"Reset List","className":"row-nofill row-nofill"});
	groups = this.addView(new SyncList({ item: Group }), ' SyncList_groups_style', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.el.className += ' Checklist_style';
		this.addBinding('editModal', 'update', 'data');
		this.addBinding('name', 'innerHTML', 'data.name');
		this.editList.addEventListener('click', () => {  this.editModal.show();  });
		this.resetList.addEventListener('click', () => { 
        if(!confirm('Reset this checklist?')) return;
        let merge = {} as any;
        SyncUtils.forEach(this.data.groups, (group: Models.Group) => {
          let groupMerge = { items: {}} as any;
          merge[group.key] = groupMerge;
          SyncUtils.forEach(group.items, (item: Models.Item) => {
            groupMerge.items[item.key] = { completedAt: '' };
          });
        });
        this.data.groups.merge(merge);
       });
		this.addBinding('groups', 'update', 'data.groups');
	}
	render() {
    this.el.classList.toggle('hidden', !this.data);
  }
}

SyncView.addGlobalStyle('.SyncList_groups_style', ` margin-left: 1em; `);
export class Group extends SyncView<Models.Group> {
	header = this.add('div', {"innerHTML":"","className":"row row"});
	name = this.add('div', {"parent":"header","innerHTML":"","className":"row-fill bold center-vert header-small row-fill bold center-vert header-small"});
	items = this.addView(new SyncList({ item: Item }), ' SyncList_items_style', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.addBinding('name', 'innerHTML', 'data.name');
		this.addBinding('items', 'update', 'data.items');
	}
}

SyncView.addGlobalStyle('.SyncList_items_style', ` margin-left: 1em; `);
export class Item extends SyncView<Models.Item> {
	name = this.add('div', {"innerHTML":"","className":"center-vert center-vert"});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.el.className += ' Item_style';
		this.el.addEventListener('click', this.onClick.bind(this));
		this.addBinding('name', 'innerHTML', 'data.name');
	}
	onClick() {
    this.data.set('completedAt', 
      this.data.completedAt ? '' : new Date().toISOString()
    );
  }
	render() {
    this.name.style.textDecoration = this.data.completedAt ? 'line-through' : 'none';
  }
}

export class ChecklistListItem extends SyncView<SyncNode> {
	name = this.add('div', {"innerHTML":"","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.el.className += ' ChecklistListItem_style';
		this.el.addEventListener('click', this.onClick.bind(this));
		this.addBinding('name', 'innerHTML', 'data.name');
	}
	onClick() {
    this.emit('selected', this.data);
  }
}

SyncView.addGlobalStyle('.MainView_style', ` max-width: 900px; margin: 1em auto; `);
SyncView.addGlobalStyle('.Checklist_style', ` max-width: 400px; `);
SyncView.addGlobalStyle('.Item_style', ` padding: 8px; border: 1px solid #777; `);
SyncView.addGlobalStyle('.ChecklistListItem_style', ` 
    border: 1px solid #777;
    padding: 8px;
  `);
