import { app, BrowserWindow, ipcMain as ipc } from "electron"
import constants from "./constants"
import { mainWindow } from "./main"
import path from "path"

export let wordOptionsWindow: BrowserWindow | null

function createWindow() {
  // Create the browser window.
  wordOptionsWindow = new BrowserWindow({
    backgroundColor: "#282828",
    //remember to add icon here for linux coz appaz u need it. wow it didn't work in postilkesbot test
    width: 600,
    height: 400,
    minWidth: 300,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: true
    },
    title: constants.wordOptions.name,
    parent: mainWindow!
  })

  // Open the DevTools.
  //   win.webContents.openDevTools()
  if (process.env.NODE_ENV === "development") {
    wordOptionsWindow.setPosition(600, 600)
    // and load the index.html of the app.
    wordOptionsWindow.loadURL("http://localhost:3000?wordOptions")
  } else {
    // and load  index.html of the app.
    // mainWindow.loadFile(path.join(__dirname, "../view/build/index.html")) //DON'T DIRECTLY LOAD FILE. DO LOAD URL
    wordOptionsWindow.loadURL(
      `file://${path.join(__dirname, "../view/build/index.html?wordOptions")}` //must use loadurl if using the query string ? to have multiple pages
    )
  }

  // Emitted when the window is closed.
  wordOptionsWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    wordOptionsWindow = null
  })
}

ipc.on("open-word-options", (event, data) => {
  if (!wordOptionsWindow) {
    createWindow()
  }
})
