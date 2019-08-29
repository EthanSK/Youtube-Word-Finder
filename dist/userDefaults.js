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
            if (
            //don't wanna just check falsy, that might be wrong
            loadUserDefault(keyTyped) === undefined ||
                loadUserDefault(keyTyped) === null ||
                loadUserDefault(keyTyped) === "") {
                store_1.save(`${exports.userDefaultsKey}.${keyTyped}`, userDefaults[keyTyped]); //cant use saveuserdefault
            }
        }
    }
    setIfNeeded({ paddingToAdd: 0.8 });
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
    if (!exports.userDefaultsOnStart.outputFolderName) {
        createOutputName(exports.userDefaultsOnStart);
    }
}
exports.setUserDefaultsOnStart = setUserDefaultsOnStart;
function createOutputName(userDefaults) {
    let result = "";
    if (userDefaults.videoSource === "Channel" && userDefaults.channelId)
        result = userDefaults.channelId;
    if (userDefaults.videoSource === "Playlist" && userDefaults.playlistId)
        result = userDefaults.playlistId;
    if (userDefaults.videoSource === "Text file" && userDefaults.videoTextFile)
        result = userDefaults.videoTextFile;
    result += "_" + Date.now().toString(); //so it's unique every time
    return result;
}
exports.createOutputName = createOutputName;
