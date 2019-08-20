import { app, BrowserWindow, ipcMain as ipc } from "electron"
import constants from "./constants"
import path from "path"
import dotenv from "dotenv"
import "./ipc"
import { sendToConsoleOutput } from "./logger"

import { restoreUserDefaults } from "./store"
import { delay } from "./utils"

dotenv.config()

export let mainWindow: BrowserWindow | null
export let wordOptionsWindow: BrowserWindow | null

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
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
    title: constants.app.name
  })
  // wordOptionsWindow = new BrowserWindow({
  //   width: 400,
  //   height: 300,
  //   webPreferences: {
  //     nodeIntegration: true
  //   },
  //   parent: mainWindow
  // })
  // wordOptionsWindow.loadURL("https://google.com")

  // Open the DevTools.
  //   win.webContents.openDevTools()
  if (process.env.NODE_ENV === "development") {
    mainWindow.setPosition(300, 300)
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
    await delay(10)
    restoreUserDefaults() //even did-finish-frame-load is buggy
  })

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow)

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
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
