"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const words_1 = require("./words");
const store_1 = require("./store");
exports.userDefaultsKey = "userDefaults";
//it's better to just copy and paste the state interface that define a type union of keys, because we'll end up finding the full types useful in the main process code
electron_1.ipcMain.on("save-user-default", (event, data) => {
    saveUserDefault(data);
    if (data && data.wordsToFindTextFile)
        words_1.handleNewWordsTextFile();
});
electron_1.ipcMain.on("restore-user-defaults", (event, data) => {
    setUserDefaultsInitialValuesIfNeeded();
    event.sender.send("restored-user-defaults", store_1.load(exports.userDefaultsKey));
});
function setUserDefaultsInitialValuesIfNeeded() {
    function setIfNeeded(userDefaults) {
        for (const key in userDefaults) {
            const keyTyped = key;
            if (loadUserDefault(keyTyped) === undefined) {
                store_1.save(`${exports.userDefaultsKey}.${keyTyped}`, userDefaults[keyTyped]); //cant use saveuserdefault
            }
        }
    }
    setIfNeeded({ paddingToAdd: 0 });
    setIfNeeded({ maxNumberOfVideos: 15 });
    setIfNeeded({ numberOfWordReps: 5 });
    setIfNeeded({ subtitleLanguageCode: "en" });
    setIfNeeded({ videoSource: "Channel" });
    setIfNeeded({ downloadOrder: "allMainThenAllAlt" });
    const emptyWord = { mainWord: "", originalUnfilteredWord: "" }; //so the user can add their own words without using the file
    setIfNeeded({ words: [emptyWord] });
}
function saveUserDefault(userDefault) {
    for (const key in userDefault) {
        const keyTyped = key;
        store_1.save(`${exports.userDefaultsKey}.${keyTyped}`, userDefault[keyTyped]);
    }
}
exports.saveUserDefault = saveUserDefault;
function loadUserDefault(key) {
    return store_1.load(`${exports.userDefaultsKey}.${key}`);
}
exports.loadUserDefault = loadUserDefault;
function setUserDefaultsOnStart() {
    exports.userDefaultsOnStart = store_1.load(`${exports.userDefaultsKey}`);
    createOutputNameIfNeeded();
}
exports.setUserDefaultsOnStart = setUserDefaultsOnStart;
function createOutputNameIfNeeded() {
    if (!exports.userDefaultsOnStart.outputFolderName) {
        if (exports.userDefaultsOnStart.videoSource === "Channel" &&
            exports.userDefaultsOnStart.channelId)
            exports.userDefaultsOnStart.outputFolderName = exports.userDefaultsOnStart.channelId;
        if (exports.userDefaultsOnStart.videoSource === "Playlist" &&
            exports.userDefaultsOnStart.playlistId)
            exports.userDefaultsOnStart.outputFolderName = exports.userDefaultsOnStart.playlistId;
        if (exports.userDefaultsOnStart.videoSource === "Text file" &&
            exports.userDefaultsOnStart.videoTextFile)
            exports.userDefaultsOnStart.outputFolderName = exports.userDefaultsOnStart.videoTextFile;
    }
    if (!exports.userDefaultsOnStart.outputFolderName) {
        exports.userDefaultsOnStart.outputFolderName = Date.now().toString();
    }
}
