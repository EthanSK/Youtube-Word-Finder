"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const userDefaults_1 = require("./userDefaults");
//called in store userdefaults ipc listener
async function handleNewWordsTextFile() {
    const words = await parseNewWordsTextFile();
    userDefaults_1.saveUserDefault("words", words);
    console.log("word: ", words);
}
exports.handleNewWordsTextFile = handleNewWordsTextFile;
async function parseNewWordsTextFile() {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(userDefaults_1.loadUserDefault("wordsToFindTextFile"), "utf8", (err, data) => {
            if (err)
                reject(err);
            else {
                // console.log("words; ", data)
                const words = data.split(/\s+/);
                const wordsPkg = words.map(word => {
                    const pkg = {
                        mainWord: filterWord(word),
                        originalUnfilteredWord: word
                    };
                    return pkg;
                });
                resolve(wordsPkg);
            }
        });
    });
}
function filterWord(word) {
    return word.replace(/[^0-9a-z]/gi, ""); //allow letters and numbers, since yt subs use number numbers and word number interchangeably
}
exports.filterWord = filterWord;
