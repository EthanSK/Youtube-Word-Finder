"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const logger_1 = require("./logger");
const main_1 = require("./main");
function ipcSend(channel, data) {
    if (!main_1.mainWindow)
        throw new Error("main window is undefined when trying to send ipc to web contents");
    console.log("sending ipc", channel, data);
    main_1.mainWindow.webContents.send(channel, data);
}
exports.ipcSend = ipcSend;
electron_1.ipcMain.on("log-console-output", (event, data) => {
    // console.log("received event to log console output", data)
    const message = data.message;
    const messageType = data.messageType === "error" ? "error" : "info";
    logger_1.log(message, messageType);
});
