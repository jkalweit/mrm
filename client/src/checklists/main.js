define(["require", "exports", "syncnode-client", "./Views"], function (require, exports, syncnode_client_1, Views_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mainView = new Views_1.MainView();
    mainView.init();
    document.body.appendChild(mainView.el);
    var client = new syncnode_client_1.SyncNodeClient();
    var reload = client.subscribe('reload');
    reload.on('reload', function () { return window.location.reload(); });
    var channel = client.subscribe('checklists');
    channel.on('updated', function () {
        console.log('updated: ', channel.data);
        mainView.update(channel.data);
    });
});
