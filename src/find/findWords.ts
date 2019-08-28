import { userDefaultsOnStart } from "../userDefaults"
import processVideoMetadata, { VideoMetadata } from "./processVideoMetadata"
import { filterWord } from "../words"
import getVideoMetadata from "./getVideoMetadata"

export interface ClipToDownload {
  id: string
  url: string
  start: number
  end: number
  wordSearchedText: string
  originalUnfilteredWord?: string //in case we wanna use it for folder names for non alt
  phraseMatched: string
  isAlternative: boolean
  wordIndex: number //needed for alt and non alt words too to decide download location
}

let wordFoundCounts: { wordCount: number; alternativeWordCount: [] }

export default function* findWords() {
  for (let i = 0; i < userDefaultsOnStart.maxNumberOfVideos!; i++) {
    const id = yield getVideoMetadata(i)
    const videoMetadata = processVideoMetadata(id)
    const clipsToDownload = searchWordsInSubs(videoMetadata)
    console.log("clipsToDownload", clipsToDownload.length)
  }
}

function searchWordsInSubs(videoMetadata: VideoMetadata): ClipToDownload[] {
  let result: ClipToDownload[] = []
  for (let i = 0; i < userDefaultsOnStart.words!.length; i++) {
    const word = userDefaultsOnStart.words![i]

    // if (wordFoundCounts[i] >= userDefaultsOnStart.numberOfWordReps!) continue
    const clips = searchWordText(
      videoMetadata,
      word.mainWord,
      false,
      i,
      word.originalUnfilteredWord
    )
    result.push(...clips)
    // console.log("result: ", result.length)

    // for (const altWordKey in word.alternativeWords) {
    //   const searchedAltWord = searchWordText(
    //     videoMetadata,
    //     word.alternativeWords[altWordKey].word
    //   )
    //   let start: number | undefined
    //   let end: number | undefined
    //   let phraseMatched: string | undefined

    //   if (searchedAltWord) {
    //     start = searchedAltWord.start
    //     end = searchedAltWord.end
    //     phraseMatched = searchedAltWord.phraseMatched
    //   }
    //   const altWordClip = {
    //     id: videoMetadata.id,
    //     url: videoMetadata.url,
    //     start,
    //     end,
    //     wordSearchedText: word.alternativeWords[altWordKey].word,
    //     phraseMatched
    //   }
    //   clip.altWordClips!.push(altWordClip)
    // }
  }
  return result
}

function searchWordText(
  videoMetadata: VideoMetadata,
  wordText: string,
  isAlternative: boolean,
  wordIndex: number,
  originalUnfilteredWord?: string
): ClipToDownload[] {
  let result: ClipToDownload[] = []
  for (const phrase of videoMetadata.subtitles.phrases) {
    const clip = {
      id: videoMetadata.id,
      url: videoMetadata.url,
      start: phrase.start,
      end: phrase.end,
      phraseMatched: phrase.text,
      wordSearchedText: wordText,
      originalUnfilteredWord,
      isAlternative,
      wordIndex
    }
    if (videoMetadata.subtitles.isIndividualWords) {
      if (wordText === filterWord(phrase.text)) {
        result.push(clip)
      }
    } else {
      for (const subPhrase of phrase.text.split(/\s+/)) {
        if (wordText === filterWord(subPhrase)) {
          result.push(clip)
          // break //don't use same phrase twice for one word, even if there are multiple occurrences. actually, the bot will finish faster and it will still have done its correct job, so do it.
        }
      }
    }
  }
  return result
}
