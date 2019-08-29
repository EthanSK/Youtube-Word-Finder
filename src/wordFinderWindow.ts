import { app, BrowserWindow, ipcMain as ipc } from "electron"
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
import { createWorkspaceFilesystem } from "./filesystem"
import { delay } from "bluebird"

export let wordFinderWindow: BrowserWindow | null

let wordFinderDataQueue: WordFinderRequestWindowData[] = []

function createWindow() {
  // Create the browser window.
  wordFinderWindow = new BrowserWindow({
    backgroundColor: "#282828",
    //remember to add icon here for linux coz appaz u need it. wow it didn't work in postilkesbot test
    width: 700,
    height: 550,
    minWidth: 200,
    minHeight: 200,
    webPreferences: {
      nodeIntegration: true
    },
    title: constants.wordFinder.name
    // parent: mainWindow!
  })
  sendToConsoleOutput("Started finding word manually", "info")

  // Open the DevTools.
  //   win.webContents.openDevTools()
  if (process.env.NODE_ENV === "development") {
    wordFinderWindow.setPosition(getRandomInt(500, 700), getRandomInt(500, 700)) //slightly rando pos because user can overlay windows
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

ipc.on("open-word-finder", (event, data: WordFinderRequestWindowData) => {
  wordFinderDataQueue.push(data)
  createWindow() //allow multiple windows open so user can work on multiple while others are loading
})

ipc.on("request-word-finder-data", async (event, data) => {
  console.log("requested word finder data")

  //put it all in try catch to stop running if there was  a problem. we also need to tell the user in the manual search window
  const wordData: WordFinderRequestWindowData = wordFinderDataQueue.shift()! //will defo exist otherwise our code is wrong
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
        clips: clips
      }
      event.sender.send("response-word-finder-data-batch", response)
    })
    // throw new Error("test error")
  } catch (error) {
    //dont send the stop running event to the manual search window, coz there could be an auto search in progress
    sendToConsoleOutput(
      `There was an error manually searching for word ${
        wordData.word.mainWord
      }: ` + error.message,
      "error"
    )
    event.sender.send("response-word-finder-data-batch", {
      ...wordData,
      clips: [],
      isError: true
    })
  }
})
