"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const constants_1 = __importDefault(require("./constants"));
const main_1 = require("./main");
const path_1 = __importDefault(require("path"));
function createWindow() {
    // Create the browser window.
    exports.wordOptionsWindow = new electron_1.BrowserWindow({
        backgroundColor: "#282828",
        //remember to add icon here for linux coz appaz u need it. wow it didn't work in postilkesbot test
        width: 700,
        height: 700,
        minWidth: 200,
        minHeight: 200,
        webPreferences: {
            nodeIntegration: true
        },
        title: constants_1.default.wordOptions.name,
        parent: main_1.mainWindow
    });
    // Open the DevTools.
    //   win.webContents.openDevTools()
    if (process.env.NODE_ENV === "development") {
        // wordOptionsWindow.setPosition(600, 600)
        // and load the index.html of the app.
        exports.wordOptionsWindow.loadURL("http://localhost:3000?wordOptions");
    }
    else {
        // and load  index.html of the app.
        // mainWindow.loadFile(path.join(__dirname, "../view/build/index.html")) //DON'T DIRECTLY LOAD FILE. DO LOAD URL
        exports.wordOptionsWindow.loadURL(`file://${path_1.default.join(__dirname, "../view/build/index.html?wordOptions")}` //must use loadurl if using the query string ? to have multiple pages
        );
    }
    // Emitted when the window is closed.
    exports.wordOptionsWindow.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        exports.wordOptionsWindow = null;
    });
}
electron_1.ipcMain.on("open-word-options", (event, data) => {
    if (!exports.wordOptionsWindow) {
        createWindow();
    }
});
