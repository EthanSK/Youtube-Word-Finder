import { ipcMain } from "electron"
import { sendToConsoleOutput } from "./logger"
import getSubtitles from "./youtubeDl/getSubtitles"
import { ipcSend } from "./ipc"
import { setUserDefaultsOnStart } from "./userDefaults"
import { createWorkspaceFilesystem } from "./filesystem"
import { delay } from "./utils"

// var runPromise = Promise.resolve() // Dummy promise to avoid null check.

ipcMain.on("start-pressed", (event, data) => {
  isRunning = true
  stoppableRun()
})

ipcMain.on("stop-pressed", async (event, data) => {
  isRunning = false
})

let isRunning = false

async function setup() {
  setUserDefaultsOnStart()
  createWorkspaceFilesystem()
}

export default async function stoppableRun() {
  const iter = run()
  let resumeValue
  for (;;) {
    if (!isRunning) {
      console.log("stopping run early")
      ipcSend("stopped-running", null)
      return
    }
    const n = iter.next(resumeValue)
    if (n.done) {
      return n.value
    }
    resumeValue = await n.value
  }
}

function* run() {
  try {
    sendToConsoleOutput(`Started running at ${new Date()}`, "startstop")
    setup()
    yield delay(1000)
    console.log("delay")
    yield delay(1000)
    console.log("delay")

    yield delay(1000)
    console.log("delay")

    yield delay(1000)
    console.log("delay")

    yield delay(1000)
    console.log("delay")

    yield getSubtitles()
    sendToConsoleOutput(`Finished running at ${new Date()}`, "startstop")
    ipcSend("stopped-running", { error: null })
  } catch (error) {
    sendToConsoleOutput(
      "There was an error running the bot: " + error.message,
      "error"
    )
  }
}
