"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const userDefaults_1 = require("./userDefaults");
const electron_1 = require("electron");
//called in store userdefaults ipc listener
async function handleNewWordsTextFile() {
    const words = await parseNewWordsTextFile();
    userDefaults_1.saveUserDefault("words", words);
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
                let wordsPkg = words
                    .map(word => {
                    const pkg = {
                        mainWord: filterWord(word),
                        originalUnfilteredWord: word
                    };
                    return pkg;
                })
                    .filter(wordPkg => {
                    return wordPkg.mainWord !== ""; //remove empty ones
                });
                wordsPkg.unshift({ mainWord: "", originalUnfilteredWord: "" }); //so the user can add their own words without using the file
                resolve(wordsPkg);
            }
        });
    });
}
function filterWord(word) {
    return word.replace(/[^0-9a-z]/gi, "").toLowerCase(); //allow letters and numbers, since yt subs use number numbers and word number interchangeably
}
exports.filterWord = filterWord;
electron_1.ipcMain.on("filter-word", (event, data) => {
    const filterWordObj = {
        word: filterWord(data.word),
        key: data.key //so we can identify the correct box if multiple are listening
    };
    event.sender.send("word-filtered", filterWordObj);
});