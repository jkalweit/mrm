import { SyncNode } from "syncnode-common";
import { SyncView, SyncList, SyncUtils } from "syncnode-client";


import * as Models from '../models/Threads';
import { Input, SimpleHeader } from '../../Components';

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

export class MainView extends SyncView<Models.Main> {
	title = this.add('h1', {"innerHTML":"F3 York","className":"pad-small pad-small"});
	newThread = this.addView(new AddText(), '');
	threads = this.addView(new Threads(), '');
	selectedThread = this.addView(new Thread(), '');
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.el.className += ' MainView_style';
		this.newThread.on('add', () => { 
      this.data.threads.active.setItem({
        createdAt: new Date().toISOString(),
        name: this.newThread.input.value,
        messages: {}
      });
      this.newThread.input.value = '';
     });
		this.threads.on('selected', (thread: Models.Thread) => { 
      this.selectedThread.update(thread);
     });
		this.addBinding('threads', 'update', 'data.threads.active');
	}
	render() {
    if(this.selectedThread.data) {
      this.selectedThread.update((this.data.threads.active as any)[this.selectedThread.data.key]);
    } else {
      this.selectedThread.update(SyncUtils.toArray(this.data.threads.active)[0]);
    }
  }
}

export class Threads extends SyncView<Models.Threads> {
	list = this.addView(new SyncList({ item: ThreadItem }), '');
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.list.on('selected', (v, thread) => {  this.emit('selected', thread);  });
		this.addBinding('list', 'update', 'data');
	}
}

export class ThreadItem extends SyncView<Models.Thread> {
	text = this.add('div', {"innerHTML":"","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.el.className += ' ThreadItem_style';
		this.el.addEventListener('click', this.onClick.bind(this));
		this.addBinding('text', 'innerHTML', 'data.name');
	}
	onClick() { this.emit('selected', this.data); }
}

export class Thread extends SyncView<Models.Thread> {
	header = this.addView(new ThreadHeader(), '');
	list = this.addView(new SyncList({ item: ThreadMessage }), '');
	newMsg = this.addView(new AddText(), '');
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.addBinding('header', 'update', 'data');
		this.addBinding('list', 'update', 'data.messages');
		this.newMsg.on('add', () => { 
      this.data.messages.setItem({
        text: this.newMsg.input.value
      });
      this.newMsg.input.value = '';
     });
	}
	render() {
    this.el.style.display = this.data ? 'block' : 'none';
  }
}

export class ThreadHeader extends SyncView<Models.Thread> {
	name = this.add('h2', {"innerHTML":"","className":"pad-small row-fill h2_name_style pad-small row-fill"});
	del = this.add('button', {"innerHTML":"delete","className":"row-nofill material-icons row-nofill material-icons"});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' row';
		this.addBinding('name', 'innerHTML', 'data.name');
		this.del.addEventListener('click', () => {  this.data.parent.remove(this.data.key);  });
	}
}

SyncView.addGlobalStyle('.h2_name_style', ` margin: 4px 0; `);
export class ThreadMessage extends SyncView<Models.ThreadMessage> {
	text = this.add('div', {"innerHTML":"","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.el.className += ' ThreadMessage_style';
		this.addBinding('text', 'innerHTML', 'data.text');
	}
}

SyncView.addGlobalStyle('.MainView_style', ` max-width: 300px; border: 1px solid #00F; `);
SyncView.addGlobalStyle('.ThreadItem_style', ` border-bottom: 1px solid #CCC; `);
SyncView.addGlobalStyle('.ThreadMessage_style', ` border-bottom: 1px solid #CCC; `);
