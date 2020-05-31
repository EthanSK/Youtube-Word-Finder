"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOutputName = exports.setUserDefaultsOnStart = exports.userDefaultsOnStart = exports.loadUserDefault = exports.saveUserDefault = exports.userDefaultsKey = void 0;
const electron_1 = require("electron");
const words_1 = require("./words");
const store_1 = require("./store");
const filesystem_1 = require("./filesystem");
exports.userDefaultsKey = "userDefaults";
//it's better to just copy and paste the state interface that define a type union of keys, because we'll end up finding the full types useful in the main process code
electron_1.ipcMain.on("save-user-default", (event, data) => {
    saveUserDefault(data);
    if (data && data.wordsToFindTextFile)
        words_1.handleNewWordsTextFile();
    if (data &&
        (data.videoSource ||
            data.videoTextFile ||
            data.playlistId ||
            data.channelId)) {
        filesystem_1.cleanupDirs(true);
    } //if we change the video source, delete the cached metadata
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
    setIfNeeded({ paddingToAdd: 1.2 });
    setIfNeeded({ maxNumberOfVideos: 25 });
    setIfNeeded({ numberOfWordReps: 3 });
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
    let result = "AUTO_GEN_OUTPUT_NAME";
    if (userDefaults.videoSource === "Channel" && userDefaults.channelId)
        result = userDefaults.channelId;
    if (userDefaults.videoSource === "Playlist" && userDefaults.playlistId)
        result = userDefaults.playlistId;
    if (userDefaults.videoSource === "Text file" && userDefaults.videoTextFile)
        result = "textFileAsSource_AUTO_GEN_OUTPUT_NAME";
    // result += "_" + Date.now().toString() //so it's unique every time //NO the point is we need to call this function every time if no output folder was given. it should always be the same.
    return result;
}
exports.createOutputName = createOutputName;
