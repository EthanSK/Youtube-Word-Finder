"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_log_1 = __importDefault(require("electron-log"));
function log(message, type) {
    switch (type) {
        case "error":
            electron_log_1.default.error(message);
            break;
        case "info":
            electron_log_1.default.info(message);
        case "warn":
            electron_log_1.default.warn(message);
        default:
            break;
    }
}
exports.log = log;
