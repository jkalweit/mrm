import { SyncNodeClient } from 'syncnode-client';
import * as Models from './Models';
import { MainView } from './Views';

let mainView = new MainView();
mainView.init();
document.body.appendChild(mainView.el);

let client = new SyncNodeClient();

let reload = client.subscribe('reload');
reload.on('reload', () => window.location.reload());

let channel = client.subscribe('mrm');
channel.on('updated', () => {
    console.log('updated: ', channel.data);
    mainView.update(channel.data as Models.Main);
});
