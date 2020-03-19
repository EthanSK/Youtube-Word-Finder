import youtubedl from "youtube-dl"
import { createYoutubeDlFilePath, getDirName } from "../filesystem"
import { userDefaultsOnStart, userDefaultsKey } from "../userDefaults"
import { sendToConsoleOutput } from "../logger"
import fs from "fs"
import constants from "../constants"
import path from "path"
import { load } from "../store"

export default async function getVideoMetadata(
  videoIndex: number,
  useUpdatedDefaults: boolean = false
): Promise<string | undefined> {
  sendToConsoleOutput(
    `Getting metadata and subtitles for video ${videoIndex + 1}`,
    "loading"
  )
  const userDefaults: UserDefaultsState = useUpdatedDefaults
    ? load(userDefaultsKey)
    : userDefaultsOnStart
  let id: string | undefined
  switch (userDefaults.videoSource) {
    case "Channel":
      id = await downloadInfoAndSubs(
        constants.youtube.channelURLPrefix + userDefaults.channelId,
        useUpdatedDefaults,
        videoIndex + 1
      )
      break
    case "Playlist":
      id = await downloadInfoAndSubs(
        constants.youtube.playlistURLPrefix + userDefaults.playlistId,
        useUpdatedDefaults,
        videoIndex + 1
      )
      break
    case "Text file":
      const url = fs
        .readFileSync(userDefaults.videoTextFile!, "utf8")
        .split(/\r\n|\r|\n/)
        .filter(url => url) //non falsy urls only
        .map(url => {
          return url
        })[videoIndex]

      if (url) id = await downloadInfoAndSubs(url, useUpdatedDefaults)
      break
  }
  // sendToConsoleOutput("Got video metadata and subtitles", "info") //unecessary
  return id
}

//this should only get one video at a time. if using text file, don't need playlistIndex, else we do, othrewise it will adowlnoad the whole channel
async function downloadInfoAndSubs(
  url: string,
  useUpdatedDefaults: boolean,

  playlistIndex?: number
): Promise<string | undefined> {
  const userDefaults = useUpdatedDefaults
    ? load(userDefaultsKey)
    : userDefaultsOnStart

  if (!url) throw new Error("Video input URL cannot be found")
  if (userDefaults.videoSource !== "Text file" && !playlistIndex)
    throw new Error("Playlist index is not set for channel or playlist url")
  if (userDefaults.videoSource === "Text file" && !url.includes("watch?v="))
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
      userDefaults.subtitleLanguageCode! //will always be set by default to something
    ]
    if (userDefaults.videoSource !== "Text file") {
      //channel counts as playlist
      flags.push(
        "--playlist-start",
        playlistIndex!.toString(),
        "--playlist-end",
        playlistIndex!.toString()
      ) //only get video at this index
    }
    if (userDefaults.cookiesTextFile) {
      flags.push("--cookies", userDefaults.cookiesTextFile)
    }
    flags.push(
      "-o",
      createYoutubeDlFilePath("metadataDir", "id", useUpdatedDefaults)
    )

    youtubedl.exec(url, flags, {}, function(err, output) {
      if (err) {
        // return reject(err)
        //nahh don't reject, keep going
        sendToConsoleOutput("Error getting video metadata: " + err, "error")
      }
      // console.log("outputtt: ", JSON.parse(output[0]).id)
      // fs.writeFileSync(path.join(getDirName("metadataDir"), "lol.json"), output) //no way to get subs straight to memory :/
      if (!output) {
        //no more vids in playlist
        resolve()
      } else {
        resolve(JSON.parse(output.join("\n")).id)
      }
    })
  })
}
