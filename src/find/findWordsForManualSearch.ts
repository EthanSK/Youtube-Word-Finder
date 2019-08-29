import { getDirName } from "../filesystem"
import fs from "fs"
import getVideoMetadata from "./getVideoMetadata"
import { loadUserDefault } from "../userDefaults"
import { sendToConsoleOutput } from "../logger"
import processVideoMetadata from "./processVideoMetadata"
import { searchWordText } from "./findWords"

function getCurrentlyDownloadedMetadataIds(): string[] {
  const outputFolder = getDirName("metadataDir", true) //up to date output folder
  const ids = fs
    .readdirSync(outputFolder)
    .filter(el => {
      return el.includes(".info.json")
    })
    .map(el => el.split(".")[0])
  return ids
}

export async function getMetadataForManualSearch(
  idRetrieved: (id: string) => void
) {
  const currentlyDownloaded = getCurrentlyDownloadedMetadataIds()

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
  arrIndex: number
): ClipToDownload[] {
  let result: ClipToDownload[] = []
  const currentlyDownloaded = getCurrentlyDownloadedMetadataIds()
  for (const id of currentlyDownloaded) {
    const videoMetadata = processVideoMetadata(id, true)

    if (word.mainWord === "") continue //it aint here boss

    const clips = searchWordText(
      videoMetadata,
      word.mainWord,
      false,
      arrIndex,
      true,
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
        true
      )
      result.push(...clips)
    }
  }
  return result
}
