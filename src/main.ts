import { app, BrowserWindow, ipcMain, dialog } from "electron"
import constants from "./constants"
import path from "path"
import dotenv from "dotenv"
import "./ipc"
import "./wordOptionsWindow"
import "./wordFinderWindow"
import "./userDefaults"
import "./find/run"
import windowStateKeeper from "electron-window-state"
import { updateYoutubeDl } from "./youtubeDlUpdate"
import { delay } from "./utils"
import "./youtubeDlUpdate"
import { setUserDefaultsOnStart } from "./userDefaults"

const youtubedl = require("youtube-dl")

dotenv.config()

youtubedl.setYtdlBinary(
  (function () {
    const curBin = youtubedl.getYtdlBinary()
    return curBin.includes("unpacked")
      ? curBin
      : curBin.replace("app.asar", "app.asar.unpacked")
  })()
)

setUserDefaultsOnStart() //otherwise if we go straight to manual word finder window and try and find a word it will give errorr

export let mainWindow: BrowserWindow | null

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 850,
    defaultHeight: 600,
    file: "mainWindow.json",
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    backgroundColor: "#282828",
    x: mainWindowState.x,
    y: mainWindowState.y,
    // icon: path.join(__dirname, "..", "resources", "512x512.png"), //remember to add icon here for linux coz appaz u need it. wow it didn't work in postilkesbot test WELL THIS DOES NOT FUCKING WORK REeeE.
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 300,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    // titleBarStyle: "hiddenInset",
    title: constants.app.name,
  })
  mainWindowState.manage(mainWindow)

  // Open the DevTools.
  //   win.webContents.openDevTools()
  if (process.env.NODE_ENV === "development") {
    // mainWindow.setPosition(300, 300)
    // and load the index.html of the app.
    mainWindow.loadURL("http://localhost:3000?app")
  } else {
    // and load  index.html of the app.
    // mainWindow.loadFile(path.join(__dirname, "../view/build/index.html")) //DON'T DIRECTLY LOAD FILE. DO LOAD URL
    mainWindow.loadURL(
      `file://${path.join(__dirname, "../view/build/index.html?app")}` //must use loadurl if using the query string ? to have multiple pages
    )
  }

  mainWindow.webContents.once("did-finish-load", async () => {
    await delay(1000)
    // restoreUserDefaults() //now responds to request from renderer
    // updateYoutubeDl()
    console.log(app.getPath("userData"))
  })

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    app.quit()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow)

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd +  Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on("open-file-dialog", (event, data) => {
  console.log("open file data: ", data)
  dialog
    .showOpenDialog(data.options)
    .then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        event.sender.send("selected-file", result.filePaths)
      }
    })
    .catch((err) => {
      console.log(err)
    })
})
