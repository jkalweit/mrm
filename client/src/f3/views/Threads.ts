import { SyncNode } from "syncnode-common";
import { SyncView, SyncList, SyncUtils } from "syncnode-client";


import * as Models from '../models/Threads';
import { AddText, AdminMode, Input, SimpleHeader } from '../../Components';

export class MainView extends SyncView<Models.Main> {
	title = this.add('div', {"innerHTML":"F3 York","className":"header-small header-small"});
	forumPost = this.addView(new ForumPost(), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' border-light';
		this.el.className += ' MainView_style';
	}
}

export class ForumPost extends SyncView<SyncNode> {
	title = this.addView(new Input({ label: 'Title', labelWidth: '150px' }), '', undefined);
	date = this.addView(new Input({ label: 'Workout Date', labelWidth: '150px' }), '', undefined);
	youtube = this.addView(new Input({ label: 'Name-O-Rama', labelWidth: '150px' }), '', undefined);
	q = this.addView(new Input({ label: 'Q', labelWidth: '150px' }), '', undefined);
	pax = this.addView(new Input({ label: 'PAX', labelWidth: '150px', textarea: true }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.el.className += ' ForumPost_style';
	}
}

export class Threads extends SyncView<Models.Threads> {
	threads = this.addView(new ThreadsList(), 'row-nofill border-light', undefined);
	selectedThread = this.addView(new Thread(), 'row-nofill border-light', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' row';
		this.threads.on('selected', (thread: Models.Thread) => { 
      this.selectedThread.update(thread);
     });
		this.addBinding('threads', 'update', 'data.active');
	}
	render() {
    if(this.selectedThread.data) {
      this.selectedThread.update((this.data.active as any)[this.selectedThread.data.key]);
    } else {
      this.selectedThread.update(SyncUtils.toArray(this.data.active)[0]);
    }
  }
}

export class ThreadsList extends SyncView<Models.Threads> {
	title = this.add('div', {"innerHTML":"Threads","className":"header-small header-small"});
	adminMode = this.addView(new AdminMode(), '', undefined);
	newThread = this.addView(new AddText(), ' AddText_newThread_style', undefined);
	list = this.addView(new SyncList({ item: ThreadItem }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.el.className += ' ThreadsList_style';
		this.adminMode.on('changed', (enabled: boolean) => { 
      this.newThread.el.style.display = enabled ? 'flex' : 'none';
     });
		this.newThread.on('add', () => { 
      let thread = this.data.setItem({
        createdAt: new Date().toISOString(),
        name: this.newThread.input.value,
        messages: {}
      });
      this.emit('selected', thread);
      this.newThread.input.value = '';
     });
		this.list.on('selected', (v, thread) => {  this.emit('selected', thread);  });
		this.addBinding('list', 'update', 'data');
	}
}

SyncView.addGlobalStyle('.AddText_newThread_style', ` display: none; `);
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
	header = this.add('div', {"innerHTML":"","className":"row header-small row header-small"});
	name = this.add('div', {"parent":"header","innerHTML":"","className":"row-fill row-fill"});
	del = this.add('button', {"parent":"header","innerHTML":"delete","className":"row-nofill material-icons button_del_style row-nofill material-icons"});
	list = this.addView(new SyncList({ item: ThreadMessage }), '', undefined);
	newMsg = this.addView(new AddText(), '', undefined);
	adminMode = this.addView(new AdminMode(), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.el.className += ' Thread_style';
		this.addBinding('name', 'innerHTML', 'data.name');
		this.del.addEventListener('click', () => {  this.data.parent.remove(this.data.key);  });
		this.addBinding('list', 'update', 'data.messages');
		this.newMsg.on('add', () => { 
      this.data.messages.setItem({
        text: this.newMsg.input.value
      });
      this.newMsg.input.value = '';
     });
		this.adminMode.on('changed', (enabled: boolean) => { 
      console.log('here3', enabled, this.del)
      this.del.style.display = enabled ? 'flex' : 'none';
     });
	}
	render() {
    this.el.style.display = this.data ? 'block' : 'none';
  }
}

SyncView.addGlobalStyle('.button_del_style', ` display: none; `);
export class ThreadMessage extends SyncView<Models.ThreadMessage> {
	text = this.add('div', {"innerHTML":"","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.el.className += ' ThreadMessage_style';
		this.addBinding('text', 'innerHTML', 'data.text');
	}
}

SyncView.addGlobalStyle('.MainView_style', ` height: 400px; `);
SyncView.addGlobalStyle('.ForumPost_style', ` width: 400px; margin-left: 4px; `);
SyncView.addGlobalStyle('.ThreadsList_style', ` min-width: 200px; `);
SyncView.addGlobalStyle('.ThreadItem_style', ` border-bottom: 1px solid #CCC; `);
SyncView.addGlobalStyle('.Thread_style', ` min-width: 300px; `);
SyncView.addGlobalStyle('.ThreadMessage_style', ` border-bottom: 1px solid #CCC; `);
