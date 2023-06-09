import { ipcMain } from "electron"
import { sendToConsoleOutput } from "../logger"
import { ipcSend } from "../ipc"
import {
  setUserDefaultsOnStart,
  userDefaultsOnStart,
  userDefaultsKey,
} from "../userDefaults"
import { createWorkspaceFilesystem, cleanupDirs } from "../filesystem"
import findWords from "./findWords"
import { downloadWords } from "./downloadWords"
import { load } from "../store"
import youtubedl from "youtube-dl"

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

export function userDefaultsCheck(useUpdatedDefaults = false) {
  console.log("userdefaults check")
  const userDefaults: UserDefaultsState = useUpdatedDefaults
    ? load(userDefaultsKey)
    : userDefaultsOnStart
  if (userDefaults.videoSource === "Text file" && !userDefaults.videoTextFile) {
    throw new Error("No text file containing video URLs could be found")
  }
  if (userDefaults.videoSource === "Channel" && !userDefaults.channelUrl) {
    throw new Error("No channel URL was given")
  }
  if (userDefaults.videoSource === "Playlist" && !userDefaults.playlistUrl) {
    throw new Error("No playlist URL was given")
  }
  if (!userDefaults.outputLocation) {
    throw new Error("No output location was given")
  }
  if (!userDefaults.maxNumberOfVideos) {
    throw new Error("Maximum number of videos not set")
  }
  if (!userDefaults.numberOfWordReps) {
    throw new Error("Number of word repetitions not set")
  }
  if (
    !userDefaults.words ||
    userDefaults.words.filter((word) => {
      return word.mainWord !== ""
    }).length === 0
  ) {
    throw new Error(
      "No words could be found. You must provide words in a text file or in the word options"
    )
  }

  //the rest either don't matter or are set by default. even words text file is not needed, as long as we provided words manually
}

function setYtdlBinary() {
  if (userDefaultsOnStart.customYtdlBinary) {
    //@ts-ignore
    youtubedl.setYtdlBinary(userDefaultsOnStart.customYtdlBinary)
    console.log(
      "Using custom youtube-dl (yt-dlp) binary",
      userDefaultsOnStart.customYtdlBinary
    )
  }
  //@ts-ignore
  const binary = youtubedl.getYtdlBinary()
  sendToConsoleOutput(
    `Using this youtube-dl (yt-dlp) binary: ${binary}`,
    "info"
  )
}

function* run() {
  sendToConsoleOutput(`Started running at ${new Date()}`, "startstop")
  yield setup() //yield so we catch erros
  setYtdlBinary()

  const clips: ClipToDownload[] = yield* findWords()
  console.log("clips", clips.length)
  yield* downloadWords(clips)
  //don't delete dirs after finish, keep em cached for manual word search
  sendToConsoleOutput(`Finished running at ${new Date()}`, "startstop")
  ipcSend("stopped-running", { error: null })
}

export default async function stoppableRun() {
  const iter = run()
  let resumeValue: any
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
  } catch (error: any) {
    ipcSend("stopped-running", { error: null })
    sendToConsoleOutput("Error running the bot: " + error.message, "error")
  }
}
