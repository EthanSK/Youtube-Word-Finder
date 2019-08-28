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
function createWindow() {
    // Create the browser window.
    exports.wordFinderWindow = new electron_1.BrowserWindow({
        backgroundColor: "#282828",
        //remember to add icon here for linux coz appaz u need it. wow it didn't work in postilkesbot test
        width: 640,
        height: 360,
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
        // wordFinderWindow.setPosition(600, 600)
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
    createWindow(); //allow multiple windows open so user can work on multiple while other is loading
});
