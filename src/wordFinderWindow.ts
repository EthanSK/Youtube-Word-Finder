import { app, BrowserWindow, ipcMain as ipc } from "electron"
import constants from "./constants"
import { mainWindow } from "./main"
import path from "path"
import { sendToConsoleOutput } from "./logger"

export let wordFinderWindow: BrowserWindow | null

function createWindow() {
  // Create the browser window.
  wordFinderWindow = new BrowserWindow({
    backgroundColor: "#282828",
    //remember to add icon here for linux coz appaz u need it. wow it didn't work in postilkesbot test
    width: 640,
    height: 360,
    minWidth: 200,
    minHeight: 200,
    webPreferences: {
      nodeIntegration: true
    },
    title: constants.wordFinder.name,
    parent: mainWindow!
  })
  sendToConsoleOutput("Started finding word manually", "info")

  // Open the DevTools.
  //   win.webContents.openDevTools()
  if (process.env.NODE_ENV === "development") {
    // wordFinderWindow.setPosition(600, 600)
    // and load the index.html of the app.
    wordFinderWindow.loadURL("http://localhost:3000?wordFinder")
  } else {
    // and load  index.html of the app.
    // mainWindow.loadFile(path.join(__dirname, "../view/build/index.html")) //DON'T DIRECTLY LOAD FILE. DO LOAD URL
    wordFinderWindow.loadURL(
      `file://${path.join(__dirname, "../view/build/index.html?wordFinder")}` //must use loadurl if using the query string ? to have multiple pages
    )
  }

  // Emitted when the window is closed.
  wordFinderWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    sendToConsoleOutput("Finished finding word manually", "info")
    wordFinderWindow = null
  })
}

ipc.on("open-word-finder", (event, data: { word: Word; arrIndex: number }) => {
  createWindow() //allow multiple windows open so user can work on multiple while other is loading
})
