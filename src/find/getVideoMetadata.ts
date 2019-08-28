import youtubedl from "youtube-dl"
import { createYoutubeDlFilePath, getDirName } from "../filesystem"
import { userDefaultsOnStart } from "../userDefaults"
import { sendToConsoleOutput } from "../logger"
import fs from "fs"
import constants from "../constants"

export default async function getVideoMetadata(
  videoIndex: number
): Promise<string> {
  sendToConsoleOutput(
    `Getting video metadata and subtitles at index ${videoIndex}`,
    "loading"
  )
  let id: string
  switch (userDefaultsOnStart.videoSource) {
    case "Channel":
      id = await downloadInfoAndSubs(
        constants.youtube.channelURLPrefix + userDefaultsOnStart.channelId,
        videoIndex + 1
      )
      break
    case "Playlist":
      id = await downloadInfoAndSubs(
        constants.youtube.playlistURLPrefix + userDefaultsOnStart.playlistId,
        videoIndex + 1
      )
      break
    case "Text file":
      const url = fs
        .readFileSync(userDefaultsOnStart.videoTextFile!, "utf8")
        .split(/\r\n|\r|\n/)
        .filter(url => url) //non falsy urls only
        .map(url => {
          return url
        })[videoIndex]
      id = await downloadInfoAndSubs(url)
      break
  }
  sendToConsoleOutput("Got video metadata and subtitles", "info")
  return id!
}

//this should only get one video at a time. if using text file, don't need playlistIndex, else we do, othrewise it will adowlnoad the whole channel
async function downloadInfoAndSubs(
  url: string,
  playlistIndex?: number
): Promise<string> {
  if (!url) throw new Error("Video input URL cannot be found")
  if (userDefaultsOnStart.videoSource !== "Text file" && !playlistIndex)
    throw new Error("Playlist index is not set for channel or playlist url")
  if (
    userDefaultsOnStart.videoSource === "Text file" &&
    !url.includes("watch?v=")
  )
    throw new Error("Detected an invalid URL in the videos text file")

  return new Promise((resolve, reject) => {
    let flags = [
      "--write-info-json",
      "--skip-download",
      "--print-json",
      "--ignore-errors", //i don't think this throws a normal error - it crashes the program, so ignore errors. It also throws errors if the sub doesn't exist but only auto sub, so this is needed
      // "--write-sub ", //only using auto because it has individual word timings
      "--write-auto-sub",
      "--sub-lang", //dont enable this without setting a sub lang after it
      userDefaultsOnStart.subtitleLanguageCode! //will always be set by default to something
    ]
    if (userDefaultsOnStart.videoSource !== "Text file") {
      flags.push(
        "--playlist-start",
        playlistIndex!.toString(),
        "--playlist-end",
        playlistIndex!.toString()
      ) //only get video at this index
    }
    flags.push("-o", createYoutubeDlFilePath("metadataDir", "id"))

    youtubedl.exec(url, flags, {}, function(err, output) {
      if (err) return reject(err)
      // console.log("outputtt: ", JSON.parse(output[0]).id)
      // fs.writeFileSync(path.join(getDirName("metadataDir"), "lol"), output) //no way to get subs straight to memory :/
      resolve(JSON.parse(output[0]).id)
    })
  })
}
