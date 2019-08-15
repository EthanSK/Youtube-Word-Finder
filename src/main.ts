import { app, BrowserWindow } from "electron"
import constants from "./constants"
import path from "path"
import dotenv from "dotenv"

dotenv.config()
let mainWindow: BrowserWindow | null

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

  // Open the DevTools.
  //   win.webContents.openDevTools()
  if (process.env.NODE_ENV === "development") {
    mainWindow.setPosition(300, 300)
    // and load the index.html of the app.
    mainWindow.loadURL("http://localhost:3000")
  } else {
    // and load  index.html of the app.
    // mainWindow.loadFile(path.join(__dirnamed , "../public/index.html"))
    mainWindow.loadFile(path.join(__dirname, "../view/build/index.html"))
  }

  mainWindow.webContents.once("did-finish-load", () => {
    mainWindow!.webContents.send("test", "69 test message")
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
