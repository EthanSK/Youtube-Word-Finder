import youtubedl from "youtube-dl"
import { createYoutubeDlFilePath, getDirName } from "../filesystem"
import { userDefaultsOnStart, userDefaultsKey } from "../userDefaults"
import { sendToConsoleOutput } from "../logger"
import fs from "fs"
import constants from "../constants"
import path from "path"
import { load } from "../store"

export default async function getVideoMetadata(
  videoUrl: string,
  useUpdatedDefaults: boolean = false
): Promise<string | undefined> {
  sendToConsoleOutput(
    `Getting metadata and subtitles for video ${videoUrl}`,
    "loading"
  )
  const userDefaults: UserDefaultsState = useUpdatedDefaults
    ? load(userDefaultsKey)
    : userDefaultsOnStart
  let id: string | undefined
  try {
    id = await downloadInfoAndSubs(videoUrl, useUpdatedDefaults)
  } catch (error) {
    sendToConsoleOutput("Error getting video metadata: " + error, "error")
    id = "GET_VIDEO_METADATA_ERROR" //this is horrid, but the only way using generators i tihnk
  }

  // sendToConsoleOutput("Got video metadata and subtitles", "info") //unecessary
  return id
}

export function getVideoUrlsFromTextFile(
  useUpdatedDefaults: boolean = false
): string[] {
  const userDefaults: UserDefaultsState = useUpdatedDefaults
    ? load(userDefaultsKey)
    : userDefaultsOnStart
  return fs
    .readFileSync(userDefaults.videoTextFile!, "utf8")
    .split(/\r\n|\r|\n/)
    .filter((url) => url) //non falsy urls only
    .map((url) => {
      return url
    })
}

//url can either be channel url or playlist url
export async function getVideoIdsFromUrl(url: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    let flags = ["--get-id", "--flat-playlist"]

    youtubedl.exec(url, flags, {}, function (err, output) {
      if (err) {
        return reject(err)
      }
      resolve(output)
    })
  })
}

//this should only get one video at a time. if using text file, don't need playlistIndex, else we do, othrewise it will adowlnoad the whole channel
async function downloadInfoAndSubs(
  videoUrl: string,
  useUpdatedDefaults: boolean
): Promise<string | undefined> {
  const userDefaults = useUpdatedDefaults
    ? load(userDefaultsKey)
    : userDefaultsOnStart

  if (!videoUrl || !videoUrl.includes("watch?v="))
    throw new Error("Detected an invalid URL " + videoUrl)

  return new Promise((resolve, reject) => {
    let flags = [
      "--write-info-json",
      "--skip-download",
      "--print-json",
      "--ignore-errors", //i don't think this throws a normal error - it crashes the program, so ignore errors. It also throws errors if the sub doesn't exist but only auto sub, so this is needed
      // "--write-sub ", //only using auto because it has individual word timings
      "--write-auto-sub", //prefer auto because it has individual word timings.
      "--sub-lang", //dont enable this without setting a sub lang after it
      userDefaults.subtitleLanguageCode!, //will always be set by default to something
    ]

    if (userDefaults.cookiesTextFile) {
      flags.push("--cookies", userDefaults.cookiesTextFile)
    }
    flags.push(
      "-o",
      createYoutubeDlFilePath("metadataDir", "id", useUpdatedDefaults)
    )
    console.log(
      "videoUrl: ",
      videoUrl,
      "flags: ",
      flags.reduce((a, b) => a + " " + b)
    )
    youtubedl.exec(videoUrl, flags, {}, function (err, output) {
      if (err) {
        return reject(err)
      }
      // console.log("outputt: ", output, JSON.parse(output.join("\n")).id)
      // console.log("outputtt: ", JSON.parse(output[0]).id)
      // fs.writeFileSync(path.join(getDirName("metadataDir"), "lol.json"), output) //no way to get subs straight to memory :/
      if (!output || (output.length === 1 && output[0] === "")) {
        //no more vids in playlist
        resolve(undefined)
      } else {
        resolve(JSON.parse(output.join("\n")).id)
      }
    })
  })
}

export async function getVideoUrls(): Promise<string[]> {
  let videoUrls: string[] = []
  if (userDefaultsOnStart.videoSource === "Playlist") {
    if (!userDefaultsOnStart.playlistUrl) {
      throw new Error("No playlist URL was provided")
    }
    videoUrls = await getVideoIdsFromUrl(userDefaultsOnStart.playlistUrl).then(
      (videoIds) => {
        return videoIds.map(
          (videoId) => constants.youtube.videoURLPrefix + videoId
        )
      }
    )
  } else if (userDefaultsOnStart.videoSource === "Channel") {
    if (!userDefaultsOnStart.channelUrl) {
      throw new Error("No channel URL was provided")
    }
    videoUrls = await getVideoIdsFromUrl(userDefaultsOnStart.channelUrl).then(
      (videoIds) => {
        return videoIds.map(
          (videoId) => constants.youtube.videoURLPrefix + videoId
        )
      }
    )
  } else if (userDefaultsOnStart.videoSource === "Text file") {
    if (!userDefaultsOnStart.videoTextFile) {
      throw new Error("No video text file was provided")
    }
    videoUrls = getVideoUrlsFromTextFile(false)
  }

  return videoUrls
}
