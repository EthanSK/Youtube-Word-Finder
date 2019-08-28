import { spawn } from "child_process"
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg"
import { ClipToDownload } from "./findWords"
import { getDirName, createDirIfNeeded } from "../filesystem"
import path from "path"

export function* downloadWords(clips: ClipToDownload[]) {
  //download non alt words first
  const nonAltClips = clips.filter(clip => !clip.isAlternative)
  for (const clip of nonAltClips) {
    yield downloadClip(clip)
  }

  const altWordClips = clips.filter(clip => clip.isAlternative)
  for (const clip of altWordClips) {
    yield downloadClip(clip)
  }
}

async function downloadClip(clip: ClipToDownload) {
  const folderName = `${clip.wordIndex}_${clip.wordSearchedText}`
  //have an autoFound and manuallyFound dir
  const clipDir = path.join(getDirName("wordsDir"), folderName)
  createDirIfNeeded(clipDir) //so we only create the dirs if there is something to put in

  let proc = spawn(ffmpegPath, [
    "-y",
    "-ss",
    "0",
    "-i",
    "",
    "-t",
    "1",
    "./playground/testFfmpegOut.mp4"
  ])

  proc.stdout.setEncoding("utf8")

  proc.stdout.on("data", function(data) {
    console.log("stdout data: ", data)
  })

  proc.stderr.setEncoding("utf8")
  proc.stderr.on("data", function(data) {
    console.log("stderr data: ", data)
  })

  proc.on("close", (code, signal) => {
    console.log(code, signal)
  })
}
