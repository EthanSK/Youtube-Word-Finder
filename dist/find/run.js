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
const getVideoMetadata_1 = __importDefault(require("./getVideoMetadata"));
const processVideoMetadata_1 = __importDefault(require("./processVideoMetadata"));
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
}
async function cleanup() {
    // cleanupDirs() // not during testing
}
function* run() {
    logger_1.sendToConsoleOutput(`Started running at ${new Date()}`, "startstop");
    setup();
    yield getVideoMetadata_1.default();
    const videoMetadata = yield processVideoMetadata_1.default();
    console.log("video metadata: ", videoMetadata);
    yield cleanup();
    logger_1.sendToConsoleOutput(`Finished running at ${new Date()}`, "startstop");
    ipc_1.ipcSend("stopped-running", { error: null });
}
async function stoppableRun() {
    const iter = run();
    let resumeValue;
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
        try {
            resumeValue = await n.value;
        }
        catch (error) {
            await cleanup();
            logger_1.sendToConsoleOutput("There was an error running the bot: " + error.message, "error");
        }
    }
}
exports.default = stoppableRun;
