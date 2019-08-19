"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ipc = window.require("electron").ipcRenderer;
function ipcSend(channel, data) {
    console.log("sending ipc", channel, data);
    ipc.send(channel, data);
}
exports.ipcSend = ipcSend;
//ipc listen events are done in the components themselves
