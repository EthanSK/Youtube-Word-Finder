"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const constants_1 = __importDefault(require("./constants"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./ipc");
const store_1 = require("./store");
const utils_1 = require("./utils");
dotenv_1.default.config();
function createWindow() {
    // Create the browser window.
    exports.mainWindow = new electron_1.BrowserWindow({
        backgroundColor: "#282828",
        //remember to add icon here for linux coz appaz u need it. wow it didn't work in postilkesbot test
        width: 850,
        height: 600,
        minWidth: 300,
        minHeight: 400,
        webPreferences: {
            nodeIntegration: true
        },
        // titleBarStyle: "hiddenInset",
        title: constants_1.default.app.name
    });
    // Open the DevTools.
    //   win.webContents.openDevTools()
    if (process.env.NODE_ENV === "development") {
        exports.mainWindow.setPosition(300, 300);
        // and load the index.html of the app.
        exports.mainWindow.loadURL("http://localhost:3000");
    }
    else {
        // and load  index.html of the app.
        // mainWindow.loadFile(path.join(__dirnamed , "../public/index.html"))
        exports.mainWindow.loadFile(path_1.default.join(__dirname, "../view/build/index.html"));
    }
    exports.mainWindow.webContents.once("did-finish-load", async () => {
        await utils_1.delay(10);
        store_1.restoreUserDefaults(); //even did-finish-frame-load is buggy
    });
    // Emitted when the window is closed.
    exports.mainWindow.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        exports.mainWindow = null;
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on("ready", createWindow);
// Quit when all windows are closed.
electron_1.app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (exports.mainWindow === null) {
        createWindow();
    }
});
