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
	textInput = this.addView(new Input({ label: 'Checklist Name:', key: 'name' }), 'col-nofill Input_textInput_style', undefined);
	groupsContainer = this.add('div', {"innerHTML":"","className":" div_groupsContainer_style"});
	groups = this.addView(new SyncList({ item: Group }), '', this.groupsContainer);
	addNew = this.add('div', {"parent":"groupsContainer","innerHTML":"","className":"row div_addNew_style row"});
	titleAddgroup = this.add('div', {"parent":"addNew","innerHTML":"Add Group:","className":"row-nofill row-nofill"});
	addGroup = this.addView(new AddText(), 'row-fill', this.addNew);
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

SyncView.addGlobalStyle('.Input_textInput_style', ` background-color: #DDF; padding: 4px; `);
SyncView.addGlobalStyle('.div_groupsContainer_style', ` margin-left: 1em; margin-top: 1em; `);
SyncView.addGlobalStyle('.div_addNew_style', ` background-color: #DFF; padding: 4px; `);
SyncView.addGlobalStyle('.div_footer_style', ` margin: 1em 0; `);
export class Group extends SyncView<Models.Group> {
	header = this.add('div', {"innerHTML":"","className":"row div_header_style row"});
	textInput = this.addView(new Input({ label: 'Group:', key: 'name' }), 'col-nofill', this.header);
	items = this.addView(new SyncList({ item: Item }), ' SyncList_items_style', undefined);
	addNew = this.add('div', {"innerHTML":"","className":"row div_addNew_style2 row"});
	titleAdd = this.add('div', {"parent":"addNew","innerHTML":"Add Item:","className":"row-nofill row-nofill"});
	addItem = this.addView(new AddText(), 'row-fill', this.addNew);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.addBinding('textInput', 'update', 'data');
		this.addBinding('items', 'update', 'data.items');
		this.addItem.on('add', (text: string) => { 
        let item = {
          name: text
        };
        this.data.items.setItem(item);
        this.addItem.clear();
     });
	}
}

SyncView.addGlobalStyle('.div_header_style', ` background-color: #DDF; padding: 4px; `);
SyncView.addGlobalStyle('.SyncList_items_style', ` margin-left: 1em; `);
SyncView.addGlobalStyle('.div_addNew_style2', ` margin-left: 1em; background-color: #FDF; padding: 4px; `);
export class Item extends SyncView<Models.Item> {
	name = this.addView(new Input({ key: 'name' }), 'row-fill', undefined);
	deleteBtn = this.add('button', {"innerHTML":"delete","className":"material-icons material-icons"});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' row';
		this.el.className += ' Item_style';
		this.addBinding('name', 'update', 'data');
		this.deleteBtn.addEventListener('click', () => {  
      this.data.parent.remove(this.data.key);
     });
	}
}

SyncView.addGlobalStyle('.Item_style', ` padding: 8px; border: 1px solid #777; `);
