"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const userDefaults_1 = require("./userDefaults");
//called in store userdefaults ipc listener
async function handleNewWordsTextFile() {
    const wordArr = await parseNewWordsTextFile();
    //make it an object for easy access to each word so we can change each one individually
    const wordObjs = wordArr.map(word => {
        // return { [word.mainWord]: word }
        return word;
    });
    userDefaults_1.saveUserDefault("words", wordObjs); //technically not REALLY a user default, but makes life 1million x easier since we have everythnig set up to handle user defaults easily. also it's kinda a user default. kinda.
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
    return word.replace(/[^a-z]/gi, "");
}
exports.filterWord = filterWord;
