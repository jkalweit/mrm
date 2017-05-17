import { SyncNode } from "syncnode-common";
import { SyncView, SyncList, SyncUtils } from "syncnode-client";


import * as Models from './Models';
import { AdminMode, Modal, Input, SimpleHeader, AddText } from '../Components';

export class NewChecklist extends SyncView<SyncNode> {
	title = this.add('h2', {"innerHTML":"New Checklist","className":""});
	textInput = this.addView(new Input({ twoway: false }), 'col-nofill', undefined);
	footer = this.add('div', {"innerHTML":"","className":"col-fill div_footer_style col-fill"});
	addBtn = this.add('button', {"parent":"footer","innerHTML":"Create Checklist","className":""});
	cancelBtn = this.add('button', {"parent":"footer","innerHTML":"Cancel","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' modal-inner col';
		this.addBtn.addEventListener('click', () => { 
        let name = this.textInput.value().trim();
        if(!name.length) {
          alert('Name is required.');
          return;
        }
        let item = {
          name: name,
          groups: {}
        };
        this.data.setItem(item);
        this.textInput.clear();
        this.emit('hide');
       });
		this.cancelBtn.addEventListener('click', () => {  this.emit('hide');  });
	}
}

SyncView.addGlobalStyle('.div_footer_style', ` margin: 1em 0; `);
export class EditChecklist extends SyncView<Models.List> {
	title = this.add('h2', {"innerHTML":"Edit Checklist","className":""});
	textInput = this.addView(new Input({ label: 'Name', key: 'name' }), 'col-nofill', undefined);
	groupsContainer = this.add('div', {"innerHTML":"","className":" div_groupsContainer_style"});
	groups = this.addView(new SyncList({ item: Group }), '', this.groupsContainer);
	addGroup = this.addView(new AddText(), '', this.groupsContainer);
	footer = this.add('div', {"innerHTML":"","className":"col-fill div_footer_style col-fill"});
	deleteBtn = this.add('button', {"parent":"footer","innerHTML":"Delete","className":""});
	closeBtn = this.add('button', {"parent":"footer","innerHTML":"Close","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' modal-inner col';
		this.addBinding('textInput', 'update', 'data');
		this.addBinding('groups', 'update', 'data.groups');
		this.addGroup.on('add', (text: string) => { 
        let group = {
          name: text,
          items: {}
        };
        this.data.groups.setItem(group);
        this.addGroup.clear();
       });
		this.deleteBtn.addEventListener('click', () => {  
        if(confirm('Delete Checklist?')) {
          this.data.parent.remove(this.data.key);
          this.emit('hide'); 
        }
       });
		this.closeBtn.addEventListener('click', () => {  this.emit('hide');  });
	}
}

SyncView.addGlobalStyle('.div_groupsContainer_style', ` margin-left: 1em; margin-top: 1em; `);
SyncView.addGlobalStyle('.div_footer_style', ` margin: 1em 0; `);
export class EditGroup extends SyncView<Models.Group> {
	title = this.add('h2', {"innerHTML":"Edit Checklist Group","className":""});
	textInput = this.addView(new Input({ label: 'Name', key: 'name' }), 'col-nofill', undefined);
	itemsContainer = this.add('div', {"innerHTML":"","className":""});
	items = this.addView(new SyncList({ item: EditItem }), ' SyncList_items_style', this.itemsContainer);
	addItem = this.addView(new AddText(), '', this.itemsContainer);
	footer = this.add('div', {"innerHTML":"","className":"col-fill div_footer_style col-fill"});
	closeBtn = this.add('button', {"parent":"footer","innerHTML":"Close","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' modal-inner col';
		this.addBinding('textInput', 'update', 'data');
		this.addBinding('items', 'update', 'data.items');
		this.addItem.on('add', (text: string) => { 
        let item = {
          name: text,
          completedAt: ''
        };
        this.data.items.setItem(item);
        this.addItem.clear();
       });
		this.closeBtn.addEventListener('click', () => {  this.emit('hide');  });
	}
}

SyncView.addGlobalStyle('.SyncList_items_style', ` margin-left: 1em; `);
SyncView.addGlobalStyle('.div_footer_style', ` margin: 1em 0; `);
export class EditItem extends SyncView<Models.Item> {
	name = this.addView(new Input({ key: 'name' }), 'row-fill', undefined);
	deleteBtn = this.add('button', {"innerHTML":"delete","className":"material-icons material-icons"});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' row';
		this.el.className += ' EditItem_style';
		this.addBinding('name', 'update', 'data');
		this.deleteBtn.addEventListener('click', () => {  
      this.data.parent.remove(this.data.key);
     });
	}
}

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
	header = this.add('div', {"innerHTML":"","className":"row row"});
	name = this.add('div', {"parent":"header","innerHTML":"","className":"row-fill bold center-vert header-small row-fill bold center-vert header-small"});
	groups = this.addView(new SyncList({ item: Group }), ' SyncList_groups_style', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.el.className += ' Checklist_style';
		this.addBinding('editModal', 'update', 'data');
		this.name.addEventListener('click', () => {  this.editModal.show();  });
		this.addBinding('name', 'innerHTML', 'data.name');
		this.addBinding('groups', 'update', 'data.groups');
	}
	render() {
    this.el.classList.toggle('hidden', !this.data);
  }
}

SyncView.addGlobalStyle('.SyncList_groups_style', ` margin-left: 1em; `);
export class Group extends SyncView<Models.Group> {
	editModal = this.addView(new Modal({ view: EditGroup }), '', undefined);
	header = this.add('div', {"innerHTML":"","className":"row row"});
	name = this.add('div', {"parent":"header","innerHTML":"","className":"row-fill bold center-vert header-small row-fill bold center-vert header-small"});
	items = this.addView(new SyncList({ item: Item }), ' SyncList_items_style', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.addBinding('editModal', 'update', 'data');
		this.name.addEventListener('click', () => {  this.editModal.show();  });
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

SyncView.addGlobalStyle('.EditItem_style', ` padding: 8px; border: 1px solid #777; `);
SyncView.addGlobalStyle('.MainView_style', ` max-width: 900px; margin: 1em auto; `);
SyncView.addGlobalStyle('.Checklist_style', ` max-width: 400px; `);
SyncView.addGlobalStyle('.Item_style', ` padding: 8px; border: 1px solid #777; `);
SyncView.addGlobalStyle('.ChecklistListItem_style', ` 
    border: 1px solid #777;
    padding: 8px;
  `);
