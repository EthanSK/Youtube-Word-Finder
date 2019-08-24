"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_store_1 = __importDefault(require("electron-store"));
const store = new electron_store_1.default();
function save(key, value) {
    // console.log("store ", key, value)
    store.set(key, value);
    // store.clear()
} //
exports.save = save;
function load(key) {
    const loadVal = store.get(key);
    // console.log("load val: ", loadVal)
    return loadVal;
}
exports.load = load;
