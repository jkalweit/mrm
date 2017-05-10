import { SyncNode } from "syncnode-common";
import { SyncView, SyncList, SyncUtils } from "syncnode-client";


import * as Models from './Models';
import { Input, SimpleHeader, Tabs } from '../Components';

export class MainView extends SyncView<Models.Main> {
	title = this.add('h1', {"innerHTML":"Managment Review","className":"pad-small pad-small"});
	title2 = this.add('h2', {"innerHTML":"9.3.2 Managment Review Inputs","className":"pad-small pad-small"});
	tabs = this.addView(new Tabs(), '');
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.el.className += ' MainView_style';
	}
	init() {
    this.tabs.addTab('a', new SectionA());
    this.tabs.addTab('b', new SectionB());
    this.tabs.addTab('c-1', new SectionC1());
    this.tabs.addTab('c-2', new SectionC2());
    this.tabs.addTab('c-3', new SectionC3());
    this.tabs.addTab('c-4', new SectionC4());
    this.tabs.addTab('c-5', new SectionC5());
    this.tabs.addTab('c-6', new SectionC6());
    this.tabs.addTab('c-7', new SectionC7());
    this.tabs.addTab('d', new SectionD());
    this.tabs.addTab('e', new SectionE());
    this.tabs.addTab('f', new SectionF());
    this.tabs.selectFirstTab();
  }
}

export class SectionA extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"The status of actions from previous management reviews","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
	}
}

export class SectionB extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"Changes in external and internal issues that are relevant to the quality management system","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
	}
}

export class SectionC1 extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"Trends in customer satisfaction and feedback from relevant interested parties","className":""});
	customerConcerns = this.addView(new CustomerConcernsView(), '');
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
	}
	init() {
      console.log('sending request')
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'http://server1.imt.local/imtsqlrest/api/qa');
			//xhr.open('GET', 'http://localhost:60562/api/qa');
			xhr.onload = function() {
   				if (xhr.status === 200) {
					  let results = JSON.parse(JSON.parse(xhr.responseText));
             console.log('qa results', results)
					  this.customerConcerns.update(results);
   				}
   				else {
       				alert('Request failed.  Returned status of ' + xhr.status);
   				}
			}.bind(this);
		  xhr.send();
  }
}

export class SectionC2 extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"The extent to which quality objectives have been met","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
	}
}

export class SectionC3 extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"Process performance and conformity of products and services","className":""});
	exceptions = this.addView(new ExceptionsView(), '');
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
	}
	init() {
      console.log('sending request')
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'http://server1.imt.local/imtsqlrest/api/exceptions');
			xhr.onload = function() {
   				if (xhr.status === 200) {
					  let results = JSON.parse(JSON.parse(xhr.responseText));
					  this.exceptions.update({ exceptions: results });
   				}
   				else {
       				alert('Request failed.  Returned status of ' + xhr.status);
   				}
			}.bind(this);
		  xhr.send();
  }
}

export class SectionC4 extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"Nonconformities and corrective actions","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
	}
}

export class SectionC5 extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"Monitoring and measurement results","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
	}
}

export class SectionC6 extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"Audit results","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
	}
}

export class SectionC7 extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"The performance of external providers","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
	}
}

export class SectionD extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"The adequacy of resources","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
	}
}

export class SectionE extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"The effectiveness of actions taken to address risks and opportunities (see 6.1)","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
	}
}

export class SectionF extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"Opportunities for improvement","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
	}
}

export class CustomerConcernsView extends SyncView<SyncNode> {
	title = this.add('h4', {"innerHTML":"Customer Concerns","className":" h4_title_style"});
	internal = this.addView(new ExceptionsResponsibility(), '');
	external = this.addView(new ExceptionsResponsibility(), '');
	undetermined = this.addView(new ExceptionsResponsibility(), '');
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.addBinding('internal', 'update', 'data.Internal');
		this.addBinding('external', 'update', 'data.External');
		this.addBinding('undetermined', 'update', 'data.Undetermined');
	}
}

SyncView.addGlobalStyle('.h4_title_style', ` border-bottom: 1px solid #000; `);
export class ExceptionsView extends SyncView<SyncNode> {
	title = this.add('h4', {"innerHTML":"Exceptions","className":" h4_title_style"});
	internal = this.addView(new ExceptionsResponsibility(), '');
	external = this.addView(new ExceptionsResponsibility(), '');
	undetermined = this.addView(new ExceptionsResponsibility(), '');
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.addBinding('internal', 'update', 'data.exceptions.Internal');
		this.addBinding('external', 'update', 'data.exceptions.External');
		this.addBinding('undetermined', 'update', 'data.exceptions.Undetermined');
	}
}

SyncView.addGlobalStyle('.h4_title_style', ` border-bottom: 1px solid #000; `);
export class ExceptionsResponsibility extends SyncView<SyncNode> {
	name = this.add('h4', {"innerHTML":"","className":""});
	s1 = this.add('span', {"innerHTML":"","className":"spancol bold span_s1_style spancol bold"});
	s2 = this.add('span', {"innerHTML":"2017","className":"spancol bold center spancol bold center"});
	s3 = this.add('span', {"innerHTML":"2016","className":"spancol bold center spancol bold center"});
	s4 = this.add('span', {"innerHTML":"2015","className":"spancol bold center spancol bold center"});
	s5 = this.add('span', {"innerHTML":"2014","className":"spancol bold center spancol bold center"});
	s6 = this.add('span', {"innerHTML":"2013","className":"spancol bold center spancol bold center"});
	s7 = this.add('span', {"innerHTML":"2012","className":"spancol bold center spancol bold center"});
	list = this.add('div', {"innerHTML":"Loading...","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.addBinding('name', 'innerHTML', 'data.Name');
	}
	render() {
    this.list.innerHTML = '';
    SyncUtils.forEach((this.data as any).Categories, (cat) => {
        let view = new ExceptionsViewCategory();
        view.update(cat);
        this.list.appendChild(view.el);
    });
  }
}

SyncView.addGlobalStyle('.span_s1_style', ` width: 175px; padding-left: 3em; `);
export class ExceptionsViewCategory extends SyncView<SyncNode> {
	s1 = this.add('span', {"innerHTML":"","className":"spancol span_s1_style spancol"});
	list = this.add('span', {"innerHTML":"","className":""});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.addBinding('s1', 'innerHTML', 'data.Name');
	}
	render() {
      this.list.innerHTML = '';
      SyncUtils.forEach((this.data as any).Years, (year: any) => {
        var span = document.createElement('span');
        span.className = 'spancol center';
        span.innerHTML = year.Count;
        this.list.appendChild(span);
      });
  }
}

SyncView.addGlobalStyle('.span_s1_style', ` width: 175px; `);
SyncView.addGlobalStyle('.MainView_style', ` max-width: 900px; border: 1px solid #CCC; margin: 0 auto; `);
