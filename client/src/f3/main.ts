import { SyncNodeClient } from 'syncnode-client';
import * as Models from './models/Threads';
import { MainView } from './views/Threads';

let mainView = new MainView();
document.body.appendChild(mainView.el);

let client = new SyncNodeClient();

let reload = client.subscribe('reload');
reload.on('reload', () => window.location.reload());

let channel = client.subscribe('threads');
channel.on('updated', () => {
    console.log('updated: ', channel.data);
    mainView.update(channel.data as Models.Main);
});
