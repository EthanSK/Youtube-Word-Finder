import { spawn } from "child_process"
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg"
import { ClipToDownload } from "./findWords"
import { getDirName, createDirIfNeeded } from "../filesystem"
import path from "path"
import { userDefaultsOnStart } from "../userDefaults"
import constants from "../constants"
import { sendToConsoleOutput } from "../logger"
import fs from "fs"

export function* downloadWords(clips: ClipToDownload[]) {
  sendToConsoleOutput("Downloading clips", "loading")
  createDirIfNeeded(getDirName("wordsDir"))
  //download non alt words first

  const sortedClips = clips.sort((a, b) => {
    return a.wordIndex - b.wordIndex
  })

  //i acc think its better to download main word with alternative, because when editing, you'll want everything that exists for that word, and therefore you can edit while the bot is downloading!
  for (const clip of sortedClips) {
    yield downloadClip(clip)
  }

  sendToConsoleOutput("Finished downloading clips", "info")
}

async function downloadClip(clip: ClipToDownload) {
  const mainWord = userDefaultsOnStart.words![clip.wordIndex].mainWord
  const folderName = `${clip.wordIndex}_${mainWord}` //coz alt word goes in main word folder
  let startTime = clip.start
  let endTime = clip.end
  if (userDefaultsOnStart.paddingToAdd) {
    startTime = Math.max(startTime - userDefaultsOnStart.paddingToAdd, 0)
    endTime = endTime + userDefaultsOnStart.paddingToAdd //if -to is longer than vid, it just stops at end which is fine
  }

  //to 2dpp
  startTime = Math.round(startTime * 100) / 100
  endTime = Math.round(endTime * 100) / 100

  let clipDir = path.join(getDirName("wordsDir"), folderName)
  createDirIfNeeded(clipDir)

  //no, this is annoying
  // clipDir = path.join(clipDir, constants.folderNames.autoFound)
  // createDirIfNeeded(clipDir)

  if (clip.isAlternative) {
    clipDir = path.join(clipDir, constants.folderNames.alternativeWords)
    createDirIfNeeded(clipDir)
    clipDir = path.join(clipDir, clip.wordSearchedText)
    createDirIfNeeded(clipDir)
  }

  const fileName = `${clip.wordSearchedText}_${clip.id}_${startTime}_${endTime}`

  const fullPath = path.join(clipDir, fileName + ".mp4")
  sendToConsoleOutput(
    `Downloading clip of ${clip.isAlternative ? "alternative " : ""}word: ${
      clip.wordSearchedText
    }`,
    "loading"
  )

  return new Promise((resolve, reject) => {
    if (fs.existsSync(fullPath)) {
      sendToConsoleOutput(
        `Found clip ${fullPath} already downloaded so skipping`,
        "info"
      )
      resolve()
      return
    }

    let proc = spawn(ffmpegPath, [
      "-y", //overwrite
      "-i",
      clip.url,
      "-ss",
      startTime.toString(),
      "-to",
      endTime.toString(),
      fullPath
    ])

    //stdout
    proc.stdout.setEncoding("utf8")
    proc.stdout.on("data", function(data) {
      // console.log("stdout data: ", data)
    })

    //stderr
    proc.stderr.setEncoding("utf8")
    proc.stderr.on("data", function(data) {
      // console.log("stderr data: ", data)
    })

    proc.on("exit", (code, signal) => {
      console.log("close", code, signal)
      sendToConsoleOutput(`Downloaded clip to ${fullPath}`, "success")
      resolve()
    })
  })
}
