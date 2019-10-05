import { spawn } from "child_process"
import { path as ffmpegPathNoAsar } from "@ffmpeg-installer/ffmpeg"
import { getDirName, createDirIfNeeded } from "../filesystem"
import path from "path"
import { userDefaultsOnStart, loadUserDefault } from "../userDefaults"
import constants from "../constants"
import { sendToConsoleOutput } from "../logger"
import fs from "fs"
import { ipcMain } from "electron"
const ffmpegPath = ffmpegPathNoAsar.replace("app.asar", "app.asar.unpacked")

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

export async function downloadClip(
  clip: ClipToDownload,
  isForManualSearch = false
): Promise<string> {
  const folderName = `${clip.wordIndex}_${clip.mainWord}` //coz alt word goes in main word folder
  let startTime = clip.start
  let endTime = clip.end
  const paddingToAdd = isForManualSearch
    ? loadUserDefault("paddingToAdd")
    : userDefaultsOnStart.paddingToAdd
  if (paddingToAdd) {
    startTime = Math.max(startTime - paddingToAdd, 0)
    endTime = endTime + paddingToAdd //if -to is longer than vid, it just stops at end which is fine
  }

  //to 2dp
  startTime = Math.round(startTime * 100) / 100
  endTime = Math.round(endTime * 100) / 100

  let clipDir = path.join(
    isForManualSearch
      ? getDirName("wordsManuallyFoundDir", true)
      : getDirName("wordsDir"),
    folderName
  )
  createDirIfNeeded(clipDir)

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
    let wasErrorFound = false
    if (fs.existsSync(fullPath)) {
      sendToConsoleOutput(
        `Found clip ${fullPath} already downloaded so skipping`,
        "info"
      )
      resolve(fullPath)
      return
    }
    const shouldReEncode = isForManualSearch
      ? loadUserDefault("reEncodeVideos")
      : userDefaultsOnStart.reEncodeVideos

    let args = [
      "-y", //overwrite
      "-ss",
      startTime.toString(),
      "-to",
      endTime.toString(), //for some reason, have ss at -t after the -i makes it dl WAY slower. it's actually in the docs.
      "-headers",
      constants.ffmpeg.headers,
      "-i",
      clip.url
    ]

    if (shouldReEncode === false) {
      args.push(
        "-c", //this causes freeze at end
        "copy",
        "-f",
        "mp4"
      )
    }
    args.push(fullPath)

    let proc = spawn(ffmpegPath, args)

    //stdout
    proc.stdout.setEncoding("utf8")
    proc.stdout.on("data", function(data) {})

    //stderr
    proc.stderr.setEncoding("utf8")
    proc.stderr.on("data", function(data: string) {
      // console.log("stderr data: ", data)
      if (data.includes("HTTP error 403 Forbidden")) {
        console.log("raw video url expired")
        wasErrorFound = true
        reject(
          new URIError(
            "Raw video URL expired. Need to get updated metadata for video. If this problem persists, delete the temp folder in your chosen output location."
          )
        )
        return
      }

      if (data.includes("error") || data.includes("Error")) {
        reject(
          new Error(
            data //honestly idk what else to do.
          )
        )
      }
    })

    proc.stderr.on("error", function(err) {
      console.log("there was an error ffmpeg dl: ", err)
    })

    proc.on("exit", (code, signal) => {
      console.log("close", code, signal)
      if (wasErrorFound) return //don't resolve
      sendToConsoleOutput(`Downloaded clip to ${fullPath}`, "success")
      resolve(fullPath)
    })
  })
}
