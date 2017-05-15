import * as http from 'http';
import * as path from 'path';
import * as express from 'express';
import { SyncServer, SyncNodePersistFile, watch } from 'syncnode-server';

const app = express();
const server = http.createServer(app);
const persistThreads = new SyncNodePersistFile('testdata/threads.json', { threads: { active: {}, archived: {}}});
const persistMrm = new SyncNodePersistFile('testdata/mrm.json', { mrms: {}});
const persistChecklists = new SyncNodePersistFile('testdata/checklists.json', { checklists: {}});


const sync = new SyncServer(server);
const threads = sync.createChannel('threads', persistThreads.data);
const mrm = sync.createChannel('mrm', persistMrm.data);
const checklists = sync.createChannel('checklists', persistChecklists.data);
const reload = sync.createChannel('reload');

app.set('port', process.env.PORT || 3000);
app.use('/', express.static(path.join(__dirname, './client/dist')));
app.use('/', (req, res) => res.sendFile(path.join(__dirname, './client/dist/index.html')));
watch('./client/dist', reload); // For debugging, send a signal to reload the client when files change.

server.listen(app.get('port'), function () {
    console.log('Web server listening on port:  ' + app.get('port'));
});