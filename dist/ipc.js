"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.ipcMain.on("log-console-output", (event, data) => {
    console.log("received event to log console output");
});
