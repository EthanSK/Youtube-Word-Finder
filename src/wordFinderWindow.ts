import { app, BrowserWindow, ipcMain as ipc, shell } from "electron"
import constants from "./constants"
import { mainWindow } from "./main"
import path from "path"
import { sendToConsoleOutput } from "./logger"
import { getRandomInt } from "./utils"
import { setUserDefaultsOnStart } from "./userDefaults"
import {
  getMetadataForManualSearch,
  findClipsForManualSearch
} from "./find/findWordsForManualSearch"
import {
  createWorkspaceFilesystem,
  getDirName,
  createDirIfNeeded,
  cleanupDirs
} from "./filesystem"
import windowStateKeeper from "electron-window-state"
import { downloadClip } from "./find/downloadWords"

export let wordFinderWindow: BrowserWindow | null

let wordFinderDataQueue: WordFinderRequestWindowData[] = []

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 750,
    defaultHeight: 600,
    file: "wordFinderWindow.json"
  })
  // Create the browser window.
  wordFinderWindow = new BrowserWindow({
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
    title: constants.wordFinder.name,
    parent: mainWindow!
  })
  mainWindowState.manage(wordFinderWindow)

  sendToConsoleOutput("Started finding word manually", "info")

  // Open the DevTools.
  //   win.webContents.openDevTools()
  if (process.env.NODE_ENV === "development") {
    // wordFinderWindow.setPosition(getRandomInt(500, 700), getRandomInt(500, 700)) //slightly rando pos because user can overlay windows
    // and load the index.html of the app.
    wordFinderWindow.loadURL("http://localhost:3000?wordFinder")
  } else {
    // and load  index.html of the app.
    // mainWindow.loadFile(path.join(__dirname, "../view/build/index.html")) //DON'T DIRECTLY LOAD FILE. DO LOAD URL
    wordFinderWindow.loadURL(
      `file://${path.join(__dirname, "../view/build/index.html?wordFinder")}` //must use loadurl if using the query string ? to have multiple pages
    )
  }

  wordFinderWindow.on("move", () => {
    mainWindowState.saveState(wordFinderWindow!) //so when opening multiple windows they spawn on top
  })

  // Emitted when the window is closed.
  wordFinderWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    sendToConsoleOutput("Finished finding word manually", "info")
    wordFinderWindow = null
  })
}

ipc.on("open-word-finder", (event, data: WordFinderRequestWindowData) => {
  wordFinderDataQueue.push(data)
  createWindow() //allow multiple windows open so user can work on multiple while others are loading
})

ipc.on("go-to-file-path", (event, data: string) => {
  console.log("go to file in finder: ", data)
  shell.showItemInFolder(data)
})

ipc.on(
  "reopen-window-url-expired",
  async (event, data: WordFinderRequestWindowData) => {
    wordFinderWindow!.close() //it will glitch out if we have multiple windows open and have changed window, but it such an edge case and not worth dealing with
    await cleanupDirs(true)
    wordFinderDataQueue.push(data)
    createWindow()
    sendToConsoleOutput(
      "Reopening window and finding updated video metadata as raw URL had expired",
      "info"
    )
  }
)

ipc.on(
  "download-manually-found-word",
  async (event, data: ClipToDownloadIPCPkg) => {
    createWorkspaceFilesystem(true) //it might be deleted
    createDirIfNeeded(getDirName("wordsManuallyFoundDir", true))
    let path = "Could not get path"
    try {
      path = await downloadClip(data.clip, true)
      // console.log("manual clip path: ", path)
      const response: ResponseClipToDownloadIPCPkg = {
        downloadPath: path,
        index: data.index
      }
      if (!event.sender.isDestroyed())
        event.sender.send("downloaded-manually-found-word", response)
    } catch (error) {
      sendToConsoleOutput(
        "There was an error downloading the manually found clip: " +
          error.message,
        "error"
      )
      const response: ResponseClipToDownloadIPCPkg = {
        downloadPath: path,
        index: data.index,
        isError: true,
        isVideoURLExpiredError: error.name === "URIError"
      }
      if (!event.sender.isDestroyed())
        event.sender.send("downloaded-manually-found-word", response)
    }
  }
)

ipc.on("request-word-finder-data", async (event, data) => {
  console.log("requested word finder data")
  //put it all in try catch to stop running if there was  a problem. we also need to tell the user in the manual search window
  const wordData: WordFinderRequestWindowData = wordFinderDataQueue.shift()! //will defo exist otherwise our code is wrong
  if (!event.sender.isDestroyed())
    event.sender.send("response-word-finder-data-batch", {
      ...wordData,
      clips: []
    }) //send initial response to load in word data that we have instantly

  try {
    createWorkspaceFilesystem(true)
    await getMetadataForManualSearch(async id => {
      console.log("finding clips for id :", id)
      const clips = await findClipsForManualSearch(
        wordData.word,
        wordData.arrIndex,
        id
      ) //await it to catch errors

      let response: WordFinderResponseWindowData = {
        ...wordData,
        clips: clips,
        didScanNewVideo: true
      }
      if (!event.sender.isDestroyed())
        event.sender.send("response-word-finder-data-batch", response)
    })
    // throw new Error("test error")
  } catch (error) {
    //dont send the stop running event to the manual search window, coz there could be an auto search in progress
    sendToConsoleOutput(
      `There was an error manually searching for word ${wordData.word.mainWord}: ` +
        error.message,
      "error"
    )
    if (!event.sender.isDestroyed())
      event.sender.send("response-word-finder-data-batch", {
        ...wordData,
        clips: [],
        isError: true
      })
  }
  if (!event.sender.isDestroyed())
    event.sender.send("response-word-finder-data-batch-finished")
})
