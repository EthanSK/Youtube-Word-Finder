import webvtt, { Parsed } from "node-webvtt"
import { getFilesInDir, getDirName } from "../filesystem"
import { sendToConsoleOutput } from "../logger"
import fs from "fs"

interface VideoMetadata {
  id: string
  subtitles: Parsed
  url: string
}

const infoFileExt = ".info.json"
const subtitleFileExt = ".vtt" //can't be sure if it will be .en.vtt if lang code is different

export default async function processVideoMetadata(): Promise<VideoMetadata[]> {
  const files = await getFilesInDir(getDirName("metadataDir"))
  const infoFiles = files.filter(
    file => file.slice(-infoFileExt.length) === infoFileExt
  )
  //loop through each json vtt file par, and if one is missing, or cannot be read, instead of throwing an error and stopping it from working, just console output an error and continue
  let result: VideoMetadata[] = []
  for (const infoFile in infoFiles) {
    const fileNameNoExt = infoFile.slice(0, -infoFileExt.length)
    const correspondingSubsFile = files.filter(
      file =>
        file.slice(0, fileNameNoExt.length) === fileNameNoExt &&
        file.slice(-subtitleFileExt.length) === subtitleFileExt
    )[0]
    try {
      const subs = webvtt.parse(correspondingSubsFile, { meta: true })
      const jsonInfo = JSON.parse(fs.readFileSync(infoFile).toString())
      result.push({
        subtitles: subs,
        id: jsonInfo.id,
        url: jsonInfo.formats[jsonInfo.formats.length - 1].url //last format always seems to be for the best with video and audio
      })
    } catch (error) {
      sendToConsoleOutput(
        "Error processing video metadata or subtitles: " + error.message,
        "error"
      )
    }
  }
  return result
}
