import { SyncNode } from "syncnode-common";
import { SyncView, SyncList, SyncUtils } from "syncnode-client";


import * as Models from './Models';
import { Input, TextArea, SimpleHeader, Tabs } from '../Components';

export class MainView extends SyncView<Models.Main> {

    first: boolean = false;
    selectedMRM: Models.MRM;
    sectionA: SectionA;
    sectionB: SectionB;
    sectionC1: SectionC1;
    sectionC2: SectionC2;
    sectionC3: SectionC3;
    sectionC4: SectionC4;
    sectionC5: SectionC5;
    sectionC6: SectionC6;
    sectionC7: SectionC7;
    sectionD: SectionD;
    sectionE: SectionE;
    sectionF: SectionF;
  
 	section4_1 = this.addView(new Section4_1(), 'row-nofill page pad-big border Section4_1_section4_1_style', undefined);
	section9 = this.add('div', {"innerHTML":"","className":"row-nofill page pad-big border col div_section9_style row-nofill page pad-big border col"});
	top = this.add('div', {"parent":"section9","innerHTML":"","className":"col-no-fill col-no-fill"});
	title9 = this.add('h2', {"parent":"top","innerHTML":"9 Performance Evaluation","className":"pad-small highlight border-bottom pad-small highlight border-bottom"});
	title9_3 = this.add('h3', {"parent":"top","innerHTML":"9.3 Management Review","className":"pad-small highlight border-bottom pad-small highlight border-bottom"});
	title9_3_1 = this.add('h4', {"parent":"top","innerHTML":"9.3.1 General","className":"pad-small highlight border-bottom pad-small highlight border-bottom"});
	text9_3_1 = this.add('p', {"parent":"top","innerHTML":"Top management shall review the organization’s quality management system, at planned intervals, to ensure its continuing suitability, adequacy, effectiveness and alignment with  the strategic direction of the organization.","className":"highlight highlight"});
	title9_3_2 = this.add('h4', {"parent":"top","innerHTML":"9.3.2 Managment Review Inputs","className":"pad-small highlight border-bottom pad-small highlight border-bottom"});
	tabs = this.addView(new Tabs(), 'col-fill border Tabs_tabs_style', this.section9);
	section10 = this.add('div', {"innerHTML":"","className":"row-nofill page pad-big border row-nofill page pad-big border"});
	title10 = this.add('h2', {"parent":"section10","innerHTML":"10 Improvement","className":"pad-small highlight border-bottom pad-small highlight border-bottom"});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' row';
		this.addBinding('section4_1', 'update', 'selectedMRM.section4_1');
	}
	init() {
    document.body.style.backgroundColor = '#DDD';


    this.sectionA = new SectionA();
    this.sectionA.init();
    this.tabs.addTab('a', this.sectionA);

    this.sectionB = new SectionB();
    this.sectionB.init();
    this.tabs.addTab('b', this.sectionB);
    
    this.sectionC1 = new SectionC1();
    this.sectionC1.init();
    this.tabs.addTab('c-1', this.sectionC1);

    this.sectionC2 = new SectionC2();
    this.sectionC2.init();
    this.tabs.addTab('c-2', this.sectionC2);

    this.sectionC3 = new SectionC3();
    this.sectionC3.init();
    this.tabs.addTab('c-3', this.sectionC3);

    this.sectionC4 = new SectionC4();
    this.sectionC4.init();
    this.tabs.addTab('c-4', this.sectionC4);


    this.sectionC5 = new SectionC5();
    this.sectionC5.init();
    this.tabs.addTab('c-5', this.sectionC5);


    this.sectionC6 = new SectionC6();
    this.sectionC6.init();
    this.tabs.addTab('c-6', this.sectionC6);


    this.sectionC7 = new SectionC7();
    this.sectionC7.init();
    this.tabs.addTab('c-7', this.sectionC7);


    this.sectionD = new SectionD();
    this.sectionD.init();
    this.tabs.addTab('d', this.sectionD);


    this.sectionE = new SectionE();
    this.sectionE.init();
    this.tabs.addTab('e', this.sectionE);


    this.sectionF = new SectionF();
    this.sectionF.init();
    this.tabs.addTab('f', this.sectionF);

    this.tabs.selectTab(5);
  }
	addMRM() {
    /*
      this.data.mrms.setItem({
        name: '2017',
        section4_1: { positive: {}, negative: {}}
      });
    */
  }
	render() {
    if(!this.first) {
      this.first = true;
      this.selectedMRM = SyncUtils.toArray(this.data.mrms)[0];
      this.bind();
    }
    this.sectionA.update(this.data);
    this.sectionB.update(this.data);
    this.sectionC1.update(this.data);
    this.sectionC2.update(this.data);
    this.sectionC3.update(this.data);
    this.sectionC4.update(this.data);
    this.sectionC5.update(this.data);
    this.sectionC6.update(this.data);
    this.sectionC7.update(this.data);
    this.sectionD.update(this.data);
    this.sectionE.update(this.data);
    this.sectionF.update(this.data);
  }
}

SyncView.addGlobalStyle('.Section4_1_section4_1_style', ` width: 800px; max-height: 1000px; margin: 1em; background-color: #FFF; `);
SyncView.addGlobalStyle('.div_section9_style', ` width: 800px; max-height: 1000px; margin: 1em; background-color: #FFF; `);
SyncView.addGlobalStyle('.Tabs_tabs_style', ` height: 800px; `);
export class Section4_1 extends SyncView<Models.Section4_1> {
	title4 = this.add('h2', {"innerHTML":"4 Context of the organization","className":"highlight border-bottom highlight border-bottom"});
	title4_1 = this.add('h3', {"innerHTML":"4.1 Understanding the organization and it's context","className":"highlight border-bottom highlight border-bottom"});
	description = this.add('p', {"innerHTML":"The organization shall  determine external and internal issues that are relevant to its purpose and its strategic direction and that affect its ability to achieve the intended result(s) of its quality management system.","className":"highlight highlight"});
	title1 = this.add('h4', {"innerHTML":"Positive Issues","className":""});
	positive = this.addView(new SyncList({ item: Section4_1Item }), '', undefined);
	addPositive = this.add('button', {"innerHTML":"New Positive","className":" button_addPositive_style"});
	title2 = this.add('h4', {"innerHTML":"Negative Issues","className":""});
	negative = this.addView(new SyncList({ item: Section4_1Item }), '', undefined);
	addNegative = this.add('button', {"innerHTML":"New Negative","className":" button_addNegative_style"});
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.addBinding('positive', 'update', 'data.positive');
		this.addPositive.addEventListener('click', () => { 
      this.data.positive.setItem({
        createdAt: new Date().toISOString(),
        occurredAt: new Date().toISOString(),
        text: '',
        note: ''
      });
     });
		this.addBinding('negative', 'update', 'data.negative');
		this.addNegative.addEventListener('click', () => { 
      this.data.negative.setItem({
        createdAt: new Date().toISOString(),
        occurredAt: new Date().toISOString(),
        text: '',
        note: ''
      });
     });
	}
}

SyncView.addGlobalStyle('.button_addPositive_style', ` margin-top: 1em; `);
SyncView.addGlobalStyle('.button_addNegative_style', ` margin-top: 1em; `);
export class Section4_1Item extends SyncView<SyncNode> {
	text = this.addView(new TextArea({ key: 'text' }), 'row-fill', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' row';
		this.addBinding('text', 'update', 'data');
	}
}

export class SectionA extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"The status of actions from previous management reviews","className":"highlight highlight"});
	input = this.addView(new TextArea({ key: 'sectionA' }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('input', 'update', 'data');
	}
}

export class SectionB extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"Changes in external and internal issues that are relevant to the quality management system","className":"highlight highlight"});
	input = this.addView(new TextArea({ key: 'sectionB' }), '', undefined);
	exceptions = this.addView(new ExceptionsView(), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('input', 'update', 'data');
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

export class SectionC1 extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"Customer satisfaction and feedback from relevant interested parties","className":"highlight highlight"});
	input = this.addView(new TextArea({ key: 'sectionC1' }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('input', 'update', 'data');
	}
}

export class SectionC2 extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"The extent to which quality objectives have been met","className":"highlight highlight"});
	input = this.addView(new TextArea({ key: 'sectionC2' }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('input', 'update', 'data');
	}
}

export class SectionC3 extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"Process performance and conformity of products and services","className":"highlight highlight"});
	input = this.addView(new TextArea({ key: 'sectionC3' }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('input', 'update', 'data');
	}
}

export class SectionC4 extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"Nonconformities and corrective actions","className":"highlight highlight"});
	input = this.addView(new TextArea({ key: 'sectionC4' }), '', undefined);
	customerConcerns = this.addView(new CustomerConcernsView(), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('input', 'update', 'data');
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

export class SectionC5 extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"Monitoring and measurement results","className":"highlight highlight"});
	input = this.addView(new TextArea({ key: 'sectionC5' }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('input', 'update', 'data');
	}
}

export class SectionC6 extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"Audit results","className":"highlight highlight"});
	input = this.addView(new TextArea({ key: 'sectionC6' }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('input', 'update', 'data');
	}
}

export class SectionC7 extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"The performance of external providers","className":"highlight highlight"});
	input = this.addView(new TextArea({ key: 'sectionC7' }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('input', 'update', 'data');
	}
}

export class SectionD extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"The adequacy of resources","className":"highlight highlight"});
	input = this.addView(new TextArea({ key: 'sectionD' }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('input', 'update', 'data');
	}
}

export class SectionE extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"The effectiveness of actions taken to address risks and opportunities (see 6.1)","className":"highlight highlight"});
	input = this.addView(new TextArea({ key: 'sectionE' }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('input', 'update', 'data');
	}
}

export class SectionF extends SyncView<SyncNode> {
	title = this.add('h3', {"innerHTML":"Opportunities for improvement","className":"highlight highlight"});
	input = this.addView(new TextArea({ key: 'sectionF' }), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' pad-small';
		this.addBinding('input', 'update', 'data');
	}
}

export class CustomerConcernsView extends SyncView<SyncNode> {
	title = this.add('h4', {"innerHTML":"Customer Concerns","className":"border-bottom border-bottom"});
	internal = this.addView(new ExceptionsResponsibility(), '', undefined);
	external = this.addView(new ExceptionsResponsibility(), '', undefined);
	undetermined = this.addView(new ExceptionsResponsibility(), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.addBinding('internal', 'update', 'data.Internal');
		this.addBinding('external', 'update', 'data.External');
		this.addBinding('undetermined', 'update', 'data.Undetermined');
	}
}

export class ExceptionsView extends SyncView<SyncNode> {
	title = this.add('h4', {"innerHTML":"Exceptions","className":"border-bottom border-bottom"});
	internal = this.addView(new ExceptionsResponsibility(), '', undefined);
	external = this.addView(new ExceptionsResponsibility(), '', undefined);
	undetermined = this.addView(new ExceptionsResponsibility(), '', undefined);
	constructor(options: any = {}) {
		super(SyncUtils.mergeMap({}, options));
		this.el.className += ' ';
		this.addBinding('internal', 'update', 'data.exceptions.Internal');
		this.addBinding('external', 'update', 'data.exceptions.External');
		this.addBinding('undetermined', 'update', 'data.exceptions.Undetermined');
	}
}

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
