import { userDefaultsOnStart } from "../userDefaults"
import processVideoMetadata, { VideoMetadata } from "./processVideoMetadata"
import { filterWord } from "../words"
import { load, save } from "../store"
import { Phrase } from "../find/processVideoMetadata"
import VideosContext from "./VideoContext"
import getVideoMetadata from "./getVideoMetadata"

const downloadedWordsKey = "downloadedWords"

export interface ClipToDownload {
  id: string
  url: string
  start: number
  end: number
  wordToFind: string
  phraseMatched: string
}

let wordFoundCounts: number[]

export default async function findWords() {
  wordFoundCounts = [...Array(userDefaultsOnStart.words!.length).fill(0)]

  for (let i = 0; i < userDefaultsOnStart.maxNumberOfVideos!; i++) {
    const id = await getVideoMetadata(i)
    const videoMetadata = await processVideoMetadata(id)
    const clipsToDownload = searchWordsInSubs(videoMetadata)
    console.log("clipsToDownload", clipsToDownload.length)
    if (clipsToDownload.length === 0) {
      break // no more were found
    }
  }
}

function searchWordsInSubs(videoMetadata: VideoMetadata): ClipToDownload[] {
  let result: ClipToDownload[] = []
  for (let i = 0; i < userDefaultsOnStart.words!.length; i++) {
    const word = userDefaultsOnStart.words![i]
    //here we need to continue if word has been found word rep times
    if (
      wordFoundCounts[i] &&
      wordFoundCounts[i] >= userDefaultsOnStart.numberOfWordReps!
    )
      continue
    for (const phrase of videoMetadata.subtitles.phrases) {
      const clip = {
        id: videoMetadata.id,
        url: videoMetadata.url,
        start: phrase.start,
        end: phrase.end,
        wordToFind: word.mainWord,
        phraseMatched: phrase.text
      }
      if (videoMetadata.subtitles.isIndividualWords) {
        if (word.mainWord === filterWord(phrase.text)) {
          result.push(clip)
          wordFoundCounts[i] += 1
        }
      } else {
        for (const subPhrase of phrase.text.split(/\s+/)) {
          if (word.mainWord === filterWord(subPhrase)) {
            result.push(clip)
            wordFoundCounts[i] += 1

            break //don't wanna reuse clip, even if there are two instances of word in clip.
          }
        }
      }
    }
  }
  return result
}

// function* findNextWord(word: Word) {
//   //scans next subtitles obj for a sub not already used
//   //if no free sub, downloads another subtitles file for another video not already used (have flag for this) and try prev step again
//   //if no free video, get another batch

//   const subtitles = videosContext.videoMetadata.slice(-1)[0].subtitles
//   for (const phrase of subtitles.phrases) {
//     //if phrase already in clipsToDownload, skip, otherwise try to generate new clipToDownload by scanning this phrase,
//     //if word match found, break this for loop
//   }

//thanks to our pre run check of userdefaults, we can be assured words will not be falsy

// export default function* findWords(_videosMetadata: VideoMetadata[]) {
//   videosMetadata = _videosMetadata
//   // currentlyDownloaded = load(downloadedWordsKey) //do it only once for efficiency
//   yield 1
//   console.log("1")
//   yield 2
//   console.log("2")
//   yield 3
//   console.log("3")

//   switch (userDefaultsOnStart.downloadOrder) {
//     case "allMainThenAllAlt":
//       yield* handleAllMainThenAllAlt()
//       break
//     case "allMainWithAllAlt":
//       handleAllMainWithAllAlt()
//       break
//     case "nextMainThenAllAlt":
//       handleNextMainThenAllAlt()
//       break
//     case "nextMainThenNextAlt":
//       handleNextMainThenNextAlt()
//       break
//   }
// }

// function* handleAllMainThenAllAlt() {
//   for (let i = 0; i < userDefaultsOnStart.words!.length; i++) {
//     const word = userDefaultsOnStart.words![i]
//   }
//   yield
// }
// function handleAllMainWithAllAlt() {}
// function handleNextMainThenAllAlt() {}
// function handleNextMainThenNextAlt() {}

// function findNext(searchWord: string): ClipToDownload {
//   for (let i = 0; i < videosMetadata.length; i++) {
//     const el = videosMetadata[i]
//     for (const phrase of el.subtitles.phrases) {
//       if (el.subtitles.isIndividualWords) {
//         if (searchWord === filterWord(phrase.text)) {
//           //create a new ClipToDownload and save it (not user defaults lol)
//           const clip: ClipToDownload = {
//             id: el.id,
//             url: el.url,
//             start: phrase.start,
//             end: phrase.end,
//             text: searchWord
//           }
//         } //found
//       } else {
//         for (const word in phrase.text.split(/\s+/)) {
//           if (searchWord === filterWord(word)) {
//           } //found
//         }
//       }
//     }
//   }
// }

//save the video id , the subtitle, and the time, and if it's been downloaded
// function saveClip(clip: ClipToDownload) { //this should actualyl only be called when the clip is downloaded
//   save(downloadedWordsKey, clip)
// } //there is actualyl no need to save to user defaults, we can use a different key. this is only for the main process anyway.

//we need to check from user defaults if we have already found/downloaded this word before (even between app sessions, hence the user defaults). if we used them all, notify user. if user has deleted videos from disk, we will still think they are there, so i guess we gotta check before skipping.
//actually just check if it's alreayd downloaded. no coz we also need the info about the word liek subtitle time and video id n shit
//we can identify if a clip is downloaded based on the word, the video id, the start, and the end times matching.

//decided we aren't gonna do ths. just do it for checking if the video is already downloaded so it doesn't doewnload again
// function isAlreadyDownloaded(clip: ClipToDownload): boolean {
//   for (const downloadedClip of currentlyDownloaded) {
//     if (
//       //don't compare urls - they might change
//       downloadedClip.id === clip.id &&
//       downloadedClip.start === clip.start &&
//       downloadedClip.end === clip.end &&
//       downloadedClip.word === clip.word
//     ) {
//       return true
//     }
//   }
//   return false
// }
