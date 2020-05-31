"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDefaultsCheck = void 0;
const electron_1 = require("electron");
const logger_1 = require("../logger");
const ipc_1 = require("../ipc");
const userDefaults_1 = require("../userDefaults");
const filesystem_1 = require("../filesystem");
const findWords_1 = __importDefault(require("./findWords"));
const downloadWords_1 = require("./downloadWords");
const store_1 = require("../store");
electron_1.ipcMain.on("start-pressed", (event, data) => {
    isRunning = true;
    stoppableRun();
});
electron_1.ipcMain.on("stop-pressed", async (event, data) => {
    logger_1.sendToConsoleOutput("Stopping (This may take some time)", "info");
    isRunning = false;
});
let isRunning = false;
async function setup() {
    userDefaults_1.setUserDefaultsOnStart();
    userDefaultsCheck();
    filesystem_1.createWorkspaceFilesystem();
}
function userDefaultsCheck(useUpdatedDefaults = false) {
    console.log("userdefaults check");
    const userDefaults = useUpdatedDefaults
        ? store_1.load(userDefaults_1.userDefaultsKey)
        : userDefaults_1.userDefaultsOnStart;
    if (userDefaults.videoSource === "Text file" && !userDefaults.videoTextFile) {
        throw new Error("No text file containing video URLs could be found");
    }
    if (userDefaults.videoSource === "Channel" && !userDefaults.channelId) {
        throw new Error("No channel ID was given");
    }
    if (userDefaults.videoSource === "Playlist" && !userDefaults.playlistId) {
        throw new Error("No playlist ID was given");
    }
    if (!userDefaults.outputLocation) {
        throw new Error("No output location was given");
    }
    if (!userDefaults.maxNumberOfVideos) {
        throw new Error("Maximum number of videos not set");
    }
    if (!userDefaults.numberOfWordReps) {
        throw new Error("Number of word repetitions not set");
    }
    if (!userDefaults.words ||
        userDefaults.words.filter((word) => {
            return word.mainWord !== "";
        }).length === 0) {
        throw new Error("No words could be found. You must provide words in a text file or in the word options");
    }
    //the rest either don't matter or are set by default. even words text file is not needed, as long as we provided words manually
}
exports.userDefaultsCheck = userDefaultsCheck;
function* run() {
    logger_1.sendToConsoleOutput(`Started running at ${new Date()}`, "startstop");
    yield setup(); //yield so we catch erros
    const clips = yield* findWords_1.default();
    console.log("clips", clips.length);
    yield* downloadWords_1.downloadWords(clips);
    //don't delete dirs after finish, keep em cached for manual word search
    logger_1.sendToConsoleOutput(`Finished running at ${new Date()}`, "startstop");
    ipc_1.ipcSend("stopped-running", { error: null });
}
async function stoppableRun() {
    const iter = run();
    let resumeValue;
    try {
        for (;;) {
            if (!isRunning) {
                ipc_1.ipcSend("stopped-running", null);
                logger_1.sendToConsoleOutput(`User stopped running early at ${new Date()}`, "startstop");
                return;
            }
            const n = iter.next(resumeValue);
            if (n.done) {
                return n.value;
            }
            resumeValue = await n.value;
        }
    }
    catch (error) {
        ipc_1.ipcSend("stopped-running", { error: null });
        logger_1.sendToConsoleOutput("Error running the bot: " + error.message, "error");
    }
}
exports.default = stoppableRun;
