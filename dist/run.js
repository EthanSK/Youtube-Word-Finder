"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const logger_1 = require("./logger");
const getSubtitles_1 = __importDefault(require("./youtubeDl/getSubtitles"));
const ipc_1 = require("./ipc");
const userDefaults_1 = require("./userDefaults");
const filesystem_1 = require("./filesystem");
// var runPromise = Promise.resolve() // Dummy promise to avoid null check.
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
function* run() {
    try {
        logger_1.sendToConsoleOutput(`Started running at ${new Date()}`, "startstop");
        setup();
        yield getSubtitles_1.default();
        logger_1.sendToConsoleOutput(`Finished running at ${new Date()}`, "startstop");
        ipc_1.ipcSend("stopped-running", { error: null });
    }
    catch (error) {
        logger_1.sendToConsoleOutput("There was an error running the bot: " + error.message, "error");
    }
}
async function stoppableRun() {
    const iter = run();
    let resumeValue;
    for (;;) {
        if (!isRunning) {
            console.log("stopping run early");
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
exports.default = stoppableRun;
