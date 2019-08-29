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
const utils_1 = require("./utils");
const findWordsForManualSearch_1 = require("./find/findWordsForManualSearch");
const filesystem_1 = require("./filesystem");
let wordFinderDataQueue = [];
function createWindow() {
    // Create the browser window.
    exports.wordFinderWindow = new electron_1.BrowserWindow({
        backgroundColor: "#282828",
        //remember to add icon here for linux coz appaz u need it. wow it didn't work in postilkesbot test
        width: 700,
        height: 450,
        minWidth: 200,
        minHeight: 200,
        webPreferences: {
            nodeIntegration: true
        },
        title: constants_1.default.wordFinder.name,
        parent: main_1.mainWindow
    });
    logger_1.sendToConsoleOutput("Started finding word manually", "info");
    // Open the DevTools.
    //   win.webContents.openDevTools()
    if (process.env.NODE_ENV === "development") {
        exports.wordFinderWindow.setPosition(utils_1.getRandomInt(500, 700), utils_1.getRandomInt(500, 700)); //slightly rando pos because user can overlay windows
        // and load the index.html of the app.
        exports.wordFinderWindow.loadURL("http://localhost:3000?wordFinder");
    }
    else {
        // and load  index.html of the app.
        // mainWindow.loadFile(path.join(__dirname, "../view/build/index.html")) //DON'T DIRECTLY LOAD FILE. DO LOAD URL
        exports.wordFinderWindow.loadURL(`file://${path_1.default.join(__dirname, "../view/build/index.html?wordFinder")}` //must use loadurl if using the query string ? to have multiple pages
        );
    }
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
electron_1.ipcMain.on("request-word-finder-data", async (event, data) => {
    console.log("requested word finder data");
    //we first need to get the sub files if we don't have already. check how many are downloaded, and download up until max vids
    //then we need to pick a word that matches the one theyre searching for
    //then we need to send the ClipToDownload object back to the window
    //put it all in try catch to stop running if there was  a problem. we also need to tell the user in the manual search window
    const wordData = wordFinderDataQueue.shift(); //will defo exist otherwise our code is wrong
    let response = {
        ...wordData,
        clips: []
    };
    try {
        filesystem_1.createWorkspaceFilesystem(true);
        await findWordsForManualSearch_1.getMetadataForManualSearch();
        const clips = await findWordsForManualSearch_1.findClipsForManualSearch(wordData.word, wordData.arrIndex); //await it to catch errors
        // response.clips = clips
    }
    catch (error) {
        //dont send the stop running event to the manual search window, coz there could be an auto search in progress
        logger_1.sendToConsoleOutput(`There was an error manually searching for word ${wordData.word}: ` +
            error.message, "error");
    }
    // event.sender.send("response-word-finder-data", response) //send found data here
});
