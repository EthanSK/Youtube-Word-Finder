"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const constants_1 = __importDefault(require("./constants"));
const main_1 = require("./main");
const path_1 = __importDefault(require("path"));
const logger_1 = require("./logger");
const findWordsForManualSearch_1 = require("./find/findWordsForManualSearch");
const filesystem_1 = require("./filesystem");
const electron_window_state_1 = __importDefault(require("electron-window-state"));
const downloadWords_1 = require("./find/downloadWords");
let wordFinderDataQueue = [];
function createWindow() {
    let mainWindowState = electron_window_state_1.default({
        defaultWidth: 750,
        defaultHeight: 600,
        file: "wordFinderWindow.json"
    });
    // Create the browser window.
    exports.wordFinderWindow = new electron_1.BrowserWindow({
        backgroundColor: "#282828",
        //remember to add icon here for linux coz appaz u need it. wow it didn't work in postilkesbot test
        width: mainWindowState.width,
        height: mainWindowState.height,
        x: mainWindowState.x,
        y: mainWindowState.y,
        minWidth: 200,
        minHeight: 200,
        webPreferences: {
            nodeIntegration: true
        },
        title: constants_1.default.wordFinder.name,
        parent: main_1.mainWindow
    });
    mainWindowState.manage(exports.wordFinderWindow);
    logger_1.sendToConsoleOutput("Started finding word manually", "info");
    // Open the DevTools.
    //   win.webContents.openDevTools()
    if (process.env.NODE_ENV === "development") {
        // wordFinderWindow.setPosition(getRandomInt(500, 700), getRandomInt(500, 700)) //slightly rando pos because user can overlay windows
        // and load the index.html of the app.
        exports.wordFinderWindow.loadURL("http://localhost:3000?wordFinder");
    }
    else {
        // and load  index.html of the app.
        // mainWindow.loadFile(path.join(__dirname, "../view/build/index.html")) //DON'T DIRECTLY LOAD FILE. DO LOAD URL
        exports.wordFinderWindow.loadURL(`file://${path_1.default.join(__dirname, "../view/build/index.html?wordFinder")}` //must use loadurl if using the query string ? to have multiple pages
        );
    }
    exports.wordFinderWindow.on("move", () => {
        mainWindowState.saveState(exports.wordFinderWindow); //so when opening multiple windows they spawn on top
    });
    // Emitted when the window is closed.
    exports.wordFinderWindow.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        logger_1.sendToConsoleOutput("Finished finding word manually", "info");
        exports.wordFinderWindow = null;
    });
}
electron_1.ipcMain.on("open-word-finder", (event, data) => {
    wordFinderDataQueue.push(data);
    createWindow(); //allow multiple windows open so user can work on multiple while others are loading
});
electron_1.ipcMain.on("go-to-file-path", (event, data) => {
    console.log("go to file in finder: ", data);
    electron_1.shell.showItemInFolder(data);
});
electron_1.ipcMain.on("reopen-window-url-expired", async (event, data) => {
    exports.wordFinderWindow.close(); //it will glitch out if we have multiple windows open and have changed window, but it such an edge case and not worth dealing with
    await filesystem_1.cleanupDirs(true);
    wordFinderDataQueue.push(data);
    createWindow();
    logger_1.sendToConsoleOutput("Reopening window and finding updated video metadata as raw URL had expired", "info");
});
electron_1.ipcMain.on("download-manually-found-word", async (event, data) => {
    filesystem_1.createWorkspaceFilesystem(true); //it might be deleted
    filesystem_1.createDirIfNeeded(filesystem_1.getDirName("wordsManuallyFoundDir", true));
    let path = "Could not get path";
    try {
        path = await downloadWords_1.downloadClip(data.clip, true);
        // console.log("manual clip path: ", path)
        const response = {
            downloadPath: path,
            index: data.index
        };
        if (!event.sender.isDestroyed())
            event.sender.send("downloaded-manually-found-word", response);
    }
    catch (error) {
        logger_1.sendToConsoleOutput("There was an error downloading the manually found clip: " +
            error.message, "error");
        const response = {
            downloadPath: path,
            index: data.index,
            isError: true,
            isVideoURLExpiredError: error.name === "URIError"
        };
        if (!event.sender.isDestroyed())
            event.sender.send("downloaded-manually-found-word", response);
    }
});
electron_1.ipcMain.on("request-word-finder-data", async (event, data) => {
    console.log("requested word finder data");
    //put it all in try catch to stop running if there was  a problem. we also need to tell the user in the manual search window
    const wordData = wordFinderDataQueue.shift(); //will defo exist otherwise our code is wrong
    if (!event.sender.isDestroyed())
        event.sender.send("response-word-finder-data-batch", {
            ...wordData,
            clips: []
        }); //send initial response to load in word data that we have instantly
    try {
        filesystem_1.createWorkspaceFilesystem(true);
        await findWordsForManualSearch_1.getMetadataForManualSearch(async (id) => {
            console.log("finding clips for id :", id);
            const clips = await findWordsForManualSearch_1.findClipsForManualSearch(wordData.word, wordData.arrIndex, id); //await it to catch errors
            let response = {
                ...wordData,
                clips: clips,
                didScanNewVideo: true
            };
            if (!event.sender.isDestroyed())
                event.sender.send("response-word-finder-data-batch", response);
        });
        // throw new Error("test error")
    }
    catch (error) {
        //dont send the stop running event to the manual search window, coz there could be an auto search in progress
        logger_1.sendToConsoleOutput(`There was an error manually searching for word ${wordData.word.mainWord}: ` +
            error.message, "error");
        if (!event.sender.isDestroyed())
            event.sender.send("response-word-finder-data-batch", {
                ...wordData,
                clips: [],
                isError: true
            });
    }
    if (!event.sender.isDestroyed())
        event.sender.send("response-word-finder-data-batch-finished");
});