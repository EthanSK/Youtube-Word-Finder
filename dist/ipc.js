"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipcSend = void 0;
const electron_1 = require("electron");
const main_1 = require("./main");
//this sends to all renderer processes, as it is not a reply to an event
function ipcSend(channel, data) {
    if (!main_1.mainWindow)
        throw new Error("main window is undefined when trying to send ipc to web contents");
    // console.log("sending ipc from main: ", channel, data)
    main_1.mainWindow.webContents.send(channel, data);
}
exports.ipcSend = ipcSend;
electron_1.ipcMain.on("open-url-browser", (event, data) => {
    electron_1.shell.openExternal(data);
});
