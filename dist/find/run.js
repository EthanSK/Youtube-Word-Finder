"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const logger_1 = require("../logger");
const ipc_1 = require("../ipc");
const userDefaults_1 = require("../userDefaults");
const filesystem_1 = require("../filesystem");
const findWords_1 = __importDefault(require("./findWords"));
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
    filesystem_1.createWorkspaceFilesystem();
    userDefaultsCheck();
}
function userDefaultsCheck() {
    if (!userDefaults_1.userDefaultsOnStart.videoTextFile) {
        throw new Error("No text file containing video URLs could be found");
    }
    if (!userDefaults_1.userDefaultsOnStart.outputLocation) {
        throw new Error("No output location was given");
    }
    if (!userDefaults_1.userDefaultsOnStart.maxNumberOfVideos) {
        throw new Error("Maximum number of videos not set");
    }
    if (!userDefaults_1.userDefaultsOnStart.numberOfWordReps) {
        throw new Error("Number of word repetitions not set");
    }
    if (!userDefaults_1.userDefaultsOnStart.words ||
        userDefaults_1.userDefaultsOnStart.words.filter(word => {
            return word.mainWord !== "";
        }).length === 0) {
        throw new Error("No words could be found. You must provide words in a text file or in the word options");
    }
    //the rest either don't matter or are set by default. even words text file is not needed, as long as we provided words manually
}
async function cleanup() {
    // cleanupDirs() // not during testing
}
function* run() {
    logger_1.sendToConsoleOutput(`Started running at ${new Date()}`, "startstop");
    yield setup(); //yield so we catch erros
    yield* findWords_1.default();
    // const videoURLs: VideoListItem[] = yield getNextVideosBatch() //this should actually only be called when we don't have any more videos
    // const id: string = yield downloadVideoMetadata(videoURLs[0].url)
    // const videoMetadata: VideoMetadata = yield processVideoMetadata(id)
    // console.log("video metadata: ", videoMetadata.subtitles.phrases[0])
    // yield* findWords(videoMetadata)
    // yield cleanup()
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
        await cleanup();
        ipc_1.ipcSend("stopped-running", { error: null });
        logger_1.sendToConsoleOutput("There was an error running the bot: " + error.message, "error");
    }
}
exports.default = stoppableRun;
