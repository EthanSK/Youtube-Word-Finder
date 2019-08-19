"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_log_1 = __importDefault(require("electron-log"));
const ipc_1 = require("../view/src/ipc");
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
