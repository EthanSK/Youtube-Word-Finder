import youtubedl from "youtube-dl"
import { getDirName, createYoutubeDlFilePath } from "../filesystem"
import { userDefaultsOnStart } from "../userDefaults"
import constants from "../constants"

async function getVideoMetadata() {
  switch (userDefaultsOnStart.videoSource) {
    case "Channel":
      const url =
        constants.youtube.channelURLPrefix + userDefaultsOnStart.channelId
      await downloadInfoAndSubs(url)
      break
    case "Playlist":
      break
    case "Text file":
      break
  }
}

async function downloadInfoAndSubs(playlistOrChannelUrl?: string) {
  if (!playlistOrChannelUrl) throw new Error("Video input URL cannot be found")
  return new Promise((resolve, reject) => {
    const flags = [
      "--write-info-json",
      "--skip-download",
      // "--ignore-errors",
      "--playlist-end",
      userDefaultsOnStart.maxNumberOfVideos!.toString(),
      "--write-sub",
      "--write-auto-sub",
      "--sub-lang",
      // "en",
      "-o",
      createYoutubeDlFilePath("metadataDir", "id")
    ]
    youtubedl.exec(playlistOrChannelUrl, flags, {}, function(err, output) {
      if (err) throw err
      console.log(output.join("\n"))
    })
  })
  // youtubedl.getInfo(url, function(err, _info) {
  //   if (err) throw err
  //   const info = _info as any
  //   console.log("id:", info.id)
  //   console.log("title:", info.title)
  //   console.log("url:", info.url)
  //   console.log("thumbnail:", info.thumbnail)
  //   console.log("description:", info.description)
  //   console.log("filename:", info._filename)
  //   console.log("format id:", info.format_id)
  // })
}

export default getVideoMetadata
