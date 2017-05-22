"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const path = require("path");
const express = require("express");
const syncnode_server_1 = require("syncnode-server");
const app = express();
const server = http.createServer(app);
const persistThreads = new syncnode_server_1.SyncNodePersistFile('testdata/threads.json', { threads: { active: {}, archived: {} } });
const persistMrm = new syncnode_server_1.SyncNodePersistFile('testdata/mrm.json', { mrms: {} });
const persistChecklists = new syncnode_server_1.SyncNodePersistFile('testdata/checklists.json', { checklists: {} });
const sync = new syncnode_server_1.SyncServer(server);
const threads = sync.createChannel('threads', persistThreads.data);
const mrm = sync.createChannel('mrm', persistMrm.data);
const checklists = sync.createChannel('checklists', persistChecklists.data);
const reload = sync.createChannel('reload');
app.set('port', process.env.PORT || 13379);
app.use('/', express.static(path.join(__dirname, './client/dist')));
app.use('/', (req, res) => res.sendFile(path.join(__dirname, './client/dist/index.html')));
syncnode_server_1.watch('./client/dist', reload); // For debugging, send a signal to reload the client when files change.
server.listen(app.get('port'), function () {
    console.log('Web server listening on port:  ' + app.get('port'));
});
