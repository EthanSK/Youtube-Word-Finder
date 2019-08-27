import { ipcMain } from "electron"
import { sendToConsoleOutput } from "../logger"
import { ipcSend } from "../ipc"
import { setUserDefaultsOnStart } from "../userDefaults"
import { createWorkspaceFilesystem, cleanupDirs } from "../filesystem"
import getVideoMetadata from "./getVideoMetadata"
import processVideoMetadata from "./processVideoMetadata"
import { VideoMetadata } from "./processVideoMetadata"

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
  createWorkspaceFilesystem()
}

async function cleanup() {
  // cleanupDirs() // not during testing
}

function* run() {
  sendToConsoleOutput(`Started running at ${new Date()}`, "startstop")
  setup()
  yield getVideoMetadata()
  const videoMetadata = yield processVideoMetadata()
  console.log("video metadata: ", videoMetadata)
  yield cleanup()
  sendToConsoleOutput(`Finished running at ${new Date()}`, "startstop")
  ipcSend("stopped-running", { error: null })
}

export default async function stoppableRun() {
  const iter = run()
  let resumeValue
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
    try {
      resumeValue = await n.value
    } catch (error) {
      await cleanup()
      sendToConsoleOutput(
        "There was an error running the bot: " + error.message,
        "error"
      )
    }
  }
}
