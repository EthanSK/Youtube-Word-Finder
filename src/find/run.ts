import { ipcMain } from "electron"
import { sendToConsoleOutput } from "../logger"
import { ipcSend } from "../ipc"
import { setUserDefaultsOnStart, userDefaultsOnStart } from "../userDefaults"
import { createWorkspaceFilesystem, cleanupDirs } from "../filesystem"
import processVideoMetadata from "./processVideoMetadata"
import findWords from "./findWords"
import getVideoMetadata from "./getVideoMetadata"
import { VideoMetadata } from "./processVideoMetadata"
import { downloadWords } from "./downloadWords"

ipcMain.on("start-pressed", (event, data) => {
  isRunning = true
  stoppableRun()
})

ipcMain.on("stop-pressed", async (event, data) => {
  sendToConsoleOutput("Stopping (This may take some time)", "info")
  isRunning = false
})

let isRunning = false

async function setup() {
  setUserDefaultsOnStart()
  userDefaultsCheck()
  createWorkspaceFilesystem()
}

function userDefaultsCheck() {
  if (
    userDefaultsOnStart.videoSource === "Text file" &&
    !userDefaultsOnStart.videoTextFile
  ) {
    throw new Error("No text file containing video URLs could be found")
  }
  if (!userDefaultsOnStart.outputLocation) {
    throw new Error("No output location was given")
  }
  if (!userDefaultsOnStart.maxNumberOfVideos) {
    throw new Error("Maximum number of videos not set")
  }
  if (!userDefaultsOnStart.numberOfWordReps) {
    throw new Error("Number of word repetitions not set")
  }
  if (
    !userDefaultsOnStart.words ||
    userDefaultsOnStart.words.filter(word => {
      return word.mainWord !== ""
    }).length === 0
  ) {
    throw new Error(
      "No words could be found. You must provide words in a text file or in the word options"
    )
  }

  //the rest either don't matter or are set by default. even words text file is not needed, as long as we provided words manually
}

function* run() {
  sendToConsoleOutput(`Started running at ${new Date()}`, "startstop")
  yield setup() //yield so we catch erros
  const clips: ClipToDownload[] = yield* findWords()
  console.log("clips", clips.length)
  yield* downloadWords(clips)
  //don't delete dirs after finish, keep em cached for manual word search
  sendToConsoleOutput(`Finished running at ${new Date()}`, "startstop")
  ipcSend("stopped-running", { error: null })
}

export default async function stoppableRun() {
  const iter = run()
  let resumeValue
  try {
    for (;;) {
      if (!isRunning) {
        ipcSend("stopped-running", null)
        sendToConsoleOutput(
          `User stopped running early at ${new Date()}`,
          "startstop"
        )
        return
      }
      const n = iter.next(resumeValue)
      if (n.done) {
        return n.value
      }
      resumeValue = await n.value
    }
  } catch (error) {
    ipcSend("stopped-running", { error: null })
    sendToConsoleOutput(
      "There was an error running the bot: " + error.message,
      "error"
    )
  }
}
