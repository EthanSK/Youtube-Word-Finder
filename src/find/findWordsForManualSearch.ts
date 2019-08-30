import { getDirName } from "../filesystem"
import fs from "fs"
import getVideoMetadata from "./getVideoMetadata"
import { loadUserDefault } from "../userDefaults"
import { sendToConsoleOutput } from "../logger"
import processVideoMetadata from "./processVideoMetadata"
import { searchWordText } from "./findWords"

async function getCurrentlyDownloadedMetadataIds(): Promise<string[]> {
  const outputFolder = getDirName("metadataDir", true) //up to date output folder
  return new Promise((resolve, reject) => {
    fs.readdir(outputFolder, (err, files) => {
      if (err) reject(err)
      const ids = files
        .filter(el => {
          return el.includes(".info.json")
        })
        .map(el => el.split(".")[0])
      resolve(ids)
    })
  })
}

export async function getMetadataForManualSearch(
  idRetrieved: (id: string) => void
) {
  const currentlyDownloaded = await getCurrentlyDownloadedMetadataIds()

  //first return all the ones already downloaded
  for (const id of currentlyDownloaded) {
    idRetrieved(id)
  }
  //then get the remaining subs needed
  for (
    let i = currentlyDownloaded.length;
    i < loadUserDefault("maxNumberOfVideos");
    i++
  ) {
    const id = await getVideoMetadata(i, true)
    if (!id) {
      sendToConsoleOutput("No more videos in playlist or channel", "info")
      break
    } //no more vids in playlist. this is so we don't waste a lot of time searching for hundreds of videos that aren't there.
    idRetrieved(id)
  }
}

export function findClipsForManualSearch(
  word: Word,
  arrIndex: number,
  id: string
): ClipToDownload[] {
  let result: ClipToDownload[] = []
  const videoMetadata = processVideoMetadata(id, true)

  if (word.mainWord === "") return result //it aint here boss

  const clips = searchWordText(
    videoMetadata,
    word.mainWord,
    false,
    arrIndex,
    true,
    word.mainWord,
    word.originalUnfilteredWord
  )
  //also need to limit size here as may have returned mor ethan no word reps in one call
  result.push(...clips)

  for (const altWordKey in word.alternativeWords) {
    if (!word.alternativeWords[altWordKey].isBeingUsed) continue

    const altWordText = word.alternativeWords[altWordKey].word
    const clips = searchWordText(
      videoMetadata,
      altWordText,
      true,
      arrIndex,
      true,
      word.mainWord
    )
    result.push(...clips)
  }

  return result
}
