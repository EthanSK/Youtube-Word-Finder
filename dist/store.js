"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_store_1 = __importDefault(require("electron-store"));
const electron_1 = require("electron");
const ipc_1 = require("./ipc");
const store = new electron_store_1.default();
const userDefaultsKey = "userDefaults";
electron_1.ipcMain.on("save-user-default", (event, data) => {
    save(userDefaultsKey, data);
});
function restoreUserDefaults() {
    ipc_1.ipcSend("restore-user-defaults", load(userDefaultsKey));
}
exports.restoreUserDefaults = restoreUserDefaults;
function save(key, value) {
    store.set(key, value);
}
exports.save = save;
function load(key) {
    return store.get(key);
}
exports.load = load;
