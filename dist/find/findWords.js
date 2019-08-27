"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userDefaults_1 = require("../userDefaults");
async function findWords() {
    switch (userDefaults_1.userDefaultsOnStart.downloadOrder) {
        case "allMainThenAllAlt":
            handleAllMainThenAllAlt();
            break;
        case "allMainWithAllAlt":
            handleAllMainWithAllAlt();
            break;
        case "nextMainThenAllAlt":
            handleNextMainThenAllAlt();
            break;
        case "nextMainThenNextAlt":
            handleNextMainThenNextAlt();
            break;
    }
}
exports.default = findWords;
function handleAllMainThenAllAlt() {
    // for (let i = 0; i < userDefaultsOnStart.words.length; i++) {
    //     const element = array[i];
    // }
}
function handleAllMainWithAllAlt() { }
function handleNextMainThenAllAlt() { }
function handleNextMainThenNextAlt() { }
