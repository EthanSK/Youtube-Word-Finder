import youtubedl from "youtube-dl"
import { getDirName, createYoutubeDlFilePath } from "../filesystem"
import { userDefaultsOnStart } from "../userDefaults"
import constants from "../constants"
import { sendToConsoleOutput } from "../logger"
import fs from "fs"

export default async function getVideoMetadata() {
  sendToConsoleOutput("Getting video metadata and subtitles", "loading")
  switch (userDefaultsOnStart.videoSource) {
    case "Channel":
      await downloadInfoAndSubs(
        constants.youtube.channelURLPrefix + userDefaultsOnStart.channelId
      )
      break
    case "Playlist":
      await downloadInfoAndSubs(
        constants.youtube.playlistURLPrefix + userDefaultsOnStart.playlistId
      )
      break
    case "Text file":
      await downloadInfoAndSubsTextFile()
      break
  }
  sendToConsoleOutput("Got video metadata and subtitles", "info")
}

async function downloadInfoAndSubs(url?: string) {
  if (!url) throw new Error("Video input URL cannot be found")
  return new Promise((resolve, reject) => {
    const flags = [
      "--write-info-json",
      "--skip-download",
      "--ignore-errors", //i don't think this throws a normal error - it crashes the program, so ignore errors. It also throws errors if the sub doesn't exist but only auto sub, so this is needed
      "--playlist-end",
      userDefaultsOnStart.maxNumberOfVideos!.toString(),
      "--write-sub",
      "--write-auto-sub",
      "--sub-lang", //dont enable this without setting a sub lang after it
      userDefaultsOnStart.subtitleLanguageCode!, //will always be set by default to something
      "-o",
      createYoutubeDlFilePath("metadataDir", "id")
    ]
    youtubedl.exec(url, flags, {}, function(err, output) {
      if (err) return reject(err)
      // console.log(output.join("\n"))
      resolve()
    })
  })
}

async function downloadInfoAndSubsTextFile() {
  if (!userDefaultsOnStart.videoTextFile)
    throw new Error("No text file containing video URLs could be found")
  const vidURLs = fs
    .readFileSync(userDefaultsOnStart.videoTextFile, "utf8")
    .split(/\r\n|\r|\n/)
    .filter(url => url) //non falsy urls only
  for (const url of vidURLs) {
    await downloadInfoAndSubs(url)
  }
}
