//THIS IS DECPRECATED

// import { sendToConsoleOutput } from "../logger"
// import { userDefaultsOnStart } from "../userDefaults"
// import constants from "../constants"
// import fs from "fs"
// import youtubedl from "youtube-dl"

// //if channel or playlist, get the --flat-playlist in batches of like 300, if text file, just parse the text file and return the id or something

// ///
// export interface VideoListItem {
//   url: string
// }

// export default async function getNextVideosBatch(): Promise<VideoListItem[]> {
//   let result: VideoListItem[]
//   switch (userDefaultsOnStart.videoSource) {
//     case "Channel":
//       sendToConsoleOutput(
//         `Getting batch of ${constants.settings.numVidsInBatch} video URLs from channel`,
//         "loading"
//       )
//       result = (await getVideoURLs(
//         constants.youtube.channelURLPrefix + userDefaultsOnStart.channelId
//       )).map(obj => {
//         return {
//           url: constants.youtube.videoURLPrefix + JSON.parse(obj).id
//         }
//       })

//       break
//     case "Playlist":
//       sendToConsoleOutput(
//         `Getting batch of ${constants.settings.numVidsInBatch} video URLs from playlist`,
//         "loading"
//       )
//       result = (await getVideoURLs(
//         constants.youtube.playlistURLPrefix + userDefaultsOnStart.playlistId
//       )).map(obj => {
//         return {
//           url: constants.youtube.videoURLPrefix + JSON.parse(obj).id
//         }
//       })

//       break
//     case "Text file":
//       sendToConsoleOutput(`Getting video URLs from text files`, "loading")
//       result = fs
//         .readFileSync(userDefaultsOnStart.videoTextFile!, "utf8")
//         .split(/\r\n|\r|\n/)
//         .filter(url => url) //non falsy urls only
//         .map(url => {
//           return { url }
//         })
//       break
//   }
//   sendToConsoleOutput("Got video URLs", "info")
//   console.log("result", result!)
//   return result!
// }

// //we need to set playlist start equal to the last playlist end when getting the next one
// async function getVideoURLs(channelOrPlaylistURL: string): Promise<any[]> {
//   if (!channelOrPlaylistURL) throw new Error("Video input URL cannot be found")
//   return new Promise((resolve, reject) => {
//     const flags = [
//       "--flat-playlist",
//       "--dump-json",
//       "--ignore-errors", //i don't think this throws a normal error - it crashes the program, so ignore errors. It also throws errors if the sub doesn't exist but only auto sub, so this is needed
//       "--playlist-end",
//       constants.settings.numVidsInBatch.toString() //won't apply if using txt file
//     ]
//     youtubedl.exec(channelOrPlaylistURL, flags, {}, function(err, output) {
//       if (err) return reject(err)
//       console.log("output: ", JSON.parse(output[0]).id)
//       resolve(output)
//     })
//   })
// }
