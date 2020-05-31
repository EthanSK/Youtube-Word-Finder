"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldApplyWordFilter = exports.filterWord = exports.handleNewWordsTextFile = void 0;
const fs_1 = __importDefault(require("fs"));
const userDefaults_1 = require("./userDefaults");
//called in store userdefaults ipc listener
async function handleNewWordsTextFile() {
    const words = await parseNewWordsTextFile();
    userDefaults_1.saveUserDefault({ words });
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
                        mainWord: shouldApplyWordFilter(userDefaults_1.loadUserDefault("subtitleLanguageCode"))
                            ? filterWord(word)
                            : word,
                        originalUnfilteredWord: word
                    };
                    return pkg;
                })
                    .filter(wordPkg => {
                    return wordPkg.mainWord !== ""; //remove empty ones
                });
                resolve(wordsPkg);
            }
        });
    });
}
function filterWord(word) {
    return word.replace(/[^0-9a-z]/gi, "").toLowerCase(); //allow letters and numbers, since yt subs use number numbers and word number interchangeably
}
exports.filterWord = filterWord;
function shouldApplyWordFilter(subtitleLanguageCode) {
    return subtitleLanguageCode === "en"; //for non english languages, we can't possibly know what weird characters exist in the language, so just don't bother.
}
exports.shouldApplyWordFilter = shouldApplyWordFilter;
