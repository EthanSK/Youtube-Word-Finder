import { ipcMain } from "electron"
import { sendToConsoleOutput } from "./logger"
import { ipcSend } from "./ipc"
import { setUserDefaultsOnStart } from "./userDefaults"
import { createWorkspaceFilesystem } from "./filesystem"
import getVideoMetadata from "./youtubeDl/getVideoMetadata"

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

function* run() {
  try {
    sendToConsoleOutput(`Started running at ${new Date()}`, "startstop")
    setup()
    yield getVideoMetadata()
    // yield getSubtitles()
    sendToConsoleOutput(`Finished running at ${new Date()}`, "startstop")
    ipcSend("stopped-running", { error: null })
  } catch (error) {
    sendToConsoleOutput(
      "There was an error running the bot: " + error.message,
      "error"
    )
  }
}

export default async function stoppableRun() {
  const iter = run()
  let resumeValue
  for (;;) {
    if (!isRunning) {
      console.log("stopping run early")
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
      sendToConsoleOutput(
        "There was an error running the bot: " + error.message,
        "error"
      )
    }
  }
}
