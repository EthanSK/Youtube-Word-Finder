"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const words_1 = require("./words");
const store_1 = require("./store");
const userDefaultsKey = "userDefaults";
electron_1.ipcMain.on("save-user-default", (event, data) => {
    for (const key in data) {
        saveUserDefault(key, data[key]);
        if (key === "wordsToFindTextFile")
            words_1.handleNewWordsTextFile();
    }
});
electron_1.ipcMain.on("restore-user-defaults", (event, data) => {
    setUserDefaultsInitialValuesIfNeeded();
    event.sender.send("restored-user-defaults", store_1.load(userDefaultsKey));
});
function setUserDefaultsInitialValuesIfNeeded() {
    function setIfNeeded(key, value) {
        if (loadUserDefault(key) === undefined) {
            saveUserDefault(key, value);
        }
    }
    setIfNeeded("paddingToAdd", 0);
    setIfNeeded("maxNumberOfVideos", 15);
    setIfNeeded("numberOfWordReps", 5);
    setIfNeeded("videoSource", "Channel");
    const emptyWord = { mainWord: "", originalUnfilteredWord: "" }; //so the user can add their own words without using the file
    setIfNeeded("words", [emptyWord]);
}
function saveUserDefault(key, value) {
    store_1.save(`${userDefaultsKey}.${key}`, value);
}
exports.saveUserDefault = saveUserDefault;
function loadUserDefault(key) {
    return store_1.load(`${userDefaultsKey}.${key}`);
}
exports.loadUserDefault = loadUserDefault;
