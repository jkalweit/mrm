import { SyncNode } from "syncnode-common";
import { SyncView, SyncList, SyncUtils } from "syncnode-client";

export class Input extends SyncView<SyncNode> {
	label = this.add('span', {"innerHTML":"","className":""});
	input = this.add('input', {"innerHTML":"","className":" input_input_style"});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({ twoway: true, labelWidth: '100px' }, options));
		this.el.className += ' ';
		this.el.className += ' Input_style';
		this.el.addEventListener('change', this.onChange.bind(this));
	}
	onChange() { 
        let val = this.input.value;
        if(this.options.twoway && this.options.key) {
            this.data.set(this.options.key, val);
        }
        this.emit('change', val); 
    }
	value() {
        return this.input.value;
    }
	init() {
        this.label.style.width = this.options.labelWidth;
    }
	render() {		
        if(this.options.label) {
            this.label.innerHTML = this.options.label;
        }
        this.label.style.display = this.options.label ? 'flex' : 'none';
        if(this.data) {
            this.input.value = this.options.key ? this.data.get(this.options.key) || '' : this.data || '';
        }
    }
}

SyncView.addGlobalStyle('.input_input_style', `
            flex: 1;
            font-size: 1em;
            padding: 0.5em 0;
            background-color: transparent;
            border: none;
            border-bottom: 1px solid rgba(0,0,0,0.5);
    `);
export class Modal extends SyncView<SyncNode> {

        view: SyncView<SyncNode>;
    
 	viewContainer = this.add('div', {"innerHTML":"","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({ hideOnClick: true }, options));
		this.el.className += ' ';
		this.el.className += ' Modal_style';
		this.el.addEventListener('click', this.onClick.bind(this));
		this.viewContainer.addEventListener('click', (e) => {  e.stopPropagation();  });
	}
	onClick() { if(this.options.hideOnClick) { this.hide(); } }
	init() {
        this.hide();
        if(this.options.view) {
            this.view = new this.options.view();
            var _me = this;
            let handler = function(eventName: string) {
                if(eventName === 'hide') { _me.hide(); }
                _me.emit.apply(_me, arguments);
            };
            this.view.onAny(handler.bind(this));
            this.viewContainer.appendChild(this.view.el);
        }
    }
	render() {
        if(this.view) this.view.update(this.data);
    }
}

export class SimpleHeader extends SyncView<SyncNode> {
	title = this.add('span', {"innerHTML":"","className":"row-fill span_title_style row-fill"});
	addBtn = this.add('button', {"innerHTML":"Add","className":"row-nofill row-nofill"});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' row';
		this.addBtn.addEventListener('click', () => {  this.emit('add')  });
	}
	showButtons(val: boolean) {
        this.addBtn.style.display = val ? 'flex' : 'none';
    }
	init() {
        this.title.innerHTML = this.options.title;
    }
}

SyncView.addGlobalStyle('.span_title_style', ` 
            font-weight: bold; 
            font-size: 1.5em;
        `);
export class Tabs extends SyncView<SyncNode> {

    selectedItem: TabHeaderItem;
    tabsArr: Tab[] = [];
  
 	headers = this.add('div', {"innerHTML":"","className":"row div_headers_style row"});
	tabs = this.add('div', {"innerHTML":"","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
	}
	addTab(title: string, view: SyncView<SyncNode>) {
    let tab = new Tab();
    tab.header = new TabHeaderItem({ text: title });
    tab.header.tabsContainer = this;
    tab.header.init();
    tab.view = view;
    tab.view.init();
    tab.init();

    tab.header.on('selected', () => {
      this.selectedItem = tab.header;
      this.emit('selected', this.selectedItem);
      this.tabs.innerHTML = '';
      this.tabs.appendChild(tab.view.el);
    });

    this.headers.appendChild(tab.header.el);
    this.tabsArr.push(tab);
  }
	selectFirstTab() {
    if(this.tabsArr.length) {
        this.tabsArr[0].header.select();
    }
  }
}

SyncView.addGlobalStyle('.div_headers_style', ` border-bottom: 1px solid #CCC; `);
export class TabHeaderItem extends SyncView<SyncNode> {

    tabsContainer: Tabs;
  
 	text = this.add('span', {"innerHTML":"","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' row-nofill pad-small no-select';
		this.el.className += ' TabHeaderItem_style';
		this.el.addEventListener('click', this.onClick.bind(this));
		this.addBinding('text', 'innerHTML', 'options.text');
	}
	select() {
    this.emit('selected', this);
  }
	onClick() {
    this.select();
  }
	init() {
    this.bind();
    this.tabsContainer.on('selected', (item: TabHeaderItem) => {
      let selected = item === this;
      this.el.style.border = selected ? '1px solid #666' : '1px solid #BBB';
      this.el.style.borderBottom = selected ? 'none' : '1px solid #BBB';
      this.el.style.backgroundColor = selected ?  '#FFF' : '#CCC';
    });
  }
}

export class Tab extends SyncView<SyncNode> {

    header: TabHeaderItem;
    view: SyncView<SyncNode>;
  
 	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
	}
}

export class AddText extends SyncView<SyncNode> {
	input = this.add('input', {"innerHTML":"","className":"row-fill row-fill"});
	addBtn = this.add('button', {"innerHTML":"","className":"row-nofill material-icons row-nofill material-icons"});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({ btnText: 'add' }, options));
		this.el.className += ' row';
		this.addBtn.addEventListener('click', () => {  this.emit('add');  });
		this.addBinding('addBtn', 'innerHTML', 'options.btnText');
	}
	init() {
    this.bind();
  }
}

SyncView.addGlobalStyle('.Input_style', ` 
        width: 100%;
        display: flex; 
    `);
SyncView.addGlobalStyle('.Modal_style', ` 
        position: fixed;
        left: 0; right: 0; top: 0; bottom: 0;
        background-color: rgba(0,0,0,0.7);
        overflow-y: scroll;
        display: flex;
        align-items: center;
        justify-content: center;	
    `);
SyncView.addGlobalStyle('.TabHeaderItem_style', ` border: 1px solid #BBB; min-width: 50px; text-align: center; `);
