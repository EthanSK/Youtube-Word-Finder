"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_log_1 = __importDefault(require("electron-log"));
const ipc_1 = require("./ipc");
const electron_1 = require("electron");
electron_1.ipcMain.on("log-console-output", (event, data) => {
    // console.log("received event to log console output", data)
    const message = data.message;
    const messageType = data.messageType === "error" ? "error" : "info";
    log(message, messageType);
});
/**
 * Do NOT call log alongside sendToConsoleOutput in main process, renderer will send ipc * back to main with data to log, to keep it consistent.
 */
function log(message, type) {
    switch (type) {
        case "error":
            electron_log_1.default.error(message);
            break;
        case "info":
            electron_log_1.default.info(message);
            break;
        case "warn":
            electron_log_1.default.warn(message);
            break;
        default:
            break;
    }
}
exports.log = log;
function sendToConsoleOutput(message, messageType) {
    ipc_1.ipcSend("write-to-console-output", {
        message,
        messageType
    });
}
exports.sendToConsoleOutput = sendToConsoleOutput;
