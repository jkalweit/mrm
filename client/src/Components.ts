import { SyncNode } from "syncnode-common";
import { SyncView, SyncList, SyncUtils } from "syncnode-client";

export class Input extends SyncView<SyncNode> {

        input: HTMLInputElement | HTMLTextAreaElement;
    
 	label = this.add('span', {"innerHTML":"","className":" span_label_style"});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({ twoway: true, labelWidth: '100px', textarea: false }, options));
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
	clear() {
        this.input.value = '';
    }
	init() {
        this.input = document.createElement(this.options.textarea ? 'textarea' : 'input');
        SyncUtils.mergeMap(this.input.style, {
            flex: 1,
            fontSize: '1em',
            padding: '0.5em 0',
            backgroundColor: 'transparent',
            border: 'none'
        });
        if(this.options.textarea) {
            this.el.style.border = '1px solid rgba(0,0,0,0.25)';
            this.el.style.padding = '4px';
        } else {
            this.el.style.borderBottom = '1px solid rgba(0,0,0,0.25)';
        }

        this.el.appendChild(this.input);

        this.label.style.width = this.options.labelWidth;
        if(this.options.label) {
            this.label.innerHTML = this.options.label;
        }
        this.label.style.display = this.options.label ? 'flex' : 'none';
    }
	render() {		
        if(this.data) {
            let val = this.options.key ? this.data.get(this.options.key) || '' : this.data || '';

            if(this.input.value != val) {
                this.input.value = val;
            }
        }
    }
}

SyncView.addGlobalStyle('.span_label_style', `
            display: flex;
            flex-direction: column;
            justify-content: center;
        `);
export class TextArea extends SyncView<SyncNode> {
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({ tag: 'textarea', twoway: true, labelWidth: '100px' }, options));
		this.el.className += ' ';
		this.el.className += ' TextArea_style';
		this.el.addEventListener('input', this.onInput.bind(this));
		this.el.addEventListener('change', this.onChange.bind(this));
	}
	onInput() {
        this.autoresize();
    }
	onChange() { 
        let val = (this.el as HTMLTextAreaElement).value;
        if(this.options.twoway && this.options.key) {
            this.data.set(this.options.key, val);
        }
        this.emit('change', val); 
    }
	value() {
        return (this.el as HTMLTextAreaElement).value;
    }
	clear() {
        (this.el as HTMLTextAreaElement).value = '';
    }
	autoresize() {
        var scrollLeft = window.pageXOffset ||
            (document.documentElement || document.body.parentNode || document.body).scrollLeft;

        var scrollTop  = window.pageYOffset || 
            (document.documentElement || document.body.parentNode || document.body).scrollTop;

        this.el.style.minHeight = 'auto';
        this.el.style.minHeight = this.el.scrollHeight + 10 + 'px';

        window.scrollTo(scrollLeft, scrollTop);
    }
	render() {		
        if(this.data) {
            let val = this.options.key ? this.data.get(this.options.key) || '' : this.data || '';

            if((this.el as HTMLTextAreaElement).value != val) {
                (this.el as HTMLTextAreaElement).value = val;
            }
        }
        this.autoresize();
    }
}

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
            this.view.on('hide', () => {
                this.hide();
                this.emit('hide');
            });
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
  
 	headers = this.add('div', {"innerHTML":"","className":"col-nofill row div_headers_style col-nofill row"});
	scrollContainer = this.add('div', {"innerHTML":"","className":"col-fill div_scrollContainer_style col-fill"});
	tabs = this.add('div', {"parent":"scrollContainer","innerHTML":"","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' col';
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
	selectTab(index: number) {
    if(this.tabsArr.length > index) {
        this.tabsArr[index].header.select();
    }
  }
}

SyncView.addGlobalStyle('.div_headers_style', ` border-bottom: 1px solid #CCC; `);
SyncView.addGlobalStyle('.div_scrollContainer_style', ` overflow-y: auto; `);
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
		this.addBtn.addEventListener('click', () => {  this.emit('add', this.input.value);  });
		this.addBinding('addBtn', 'innerHTML', 'options.btnText');
	}
	clear() { this.input.value = ''; }
	init() {
    this.bind();
  }
}

export class AdminMode extends SyncView<SyncNode> {

    enabled: boolean = false;
  
 	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
	}
	init() {
    document.addEventListener('keypress', e => {
			if(e.keyCode === 30) { // 30 = ctrl+^ && 94 = '^'
				this.enabled = !this.enabled;
				this.emit('changed', this.enabled); 
			}
		});
  }
}

SyncView.addGlobalStyle('.Input_style', ` 
        width: 100%;
        display: flex; 
    `);
SyncView.addGlobalStyle('.TextArea_style', ` 
        width: 100%;
        display: flex; 
        flex: 1;
        font-size: 1em;
        padding: 0.5em;
        background-color: transparent;
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
