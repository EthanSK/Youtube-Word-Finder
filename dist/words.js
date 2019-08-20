"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const store_1 = require("./store");
async function parseWordsTextFile() {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(store_1.loadUserDefault("wordsToFindTextFile"), "utf8", (err, data) => {
            if (err)
                reject(err);
            else {
                resolve();
            }
        });
    });
}
