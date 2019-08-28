import { userDefaultsOnStart } from "../userDefaults"
import processVideoMetadata, { VideoMetadata } from "./processVideoMetadata"
import { filterWord } from "../words"
import getVideoMetadata from "./getVideoMetadata"

export interface ClipToDownload {
  id: string
  url: string
  start?: number
  end?: number
  wordSearchedText: string
  altWordClips?: ClipToDownload[]
  phraseMatched?: string //might not exist if only alternative clips could be found
}

let wordFoundCounts: { wordCount: number; alternativeWordCount: [] }

export default function* findWords() {
  for (let i = 0; i < userDefaultsOnStart.maxNumberOfVideos!; i++) {
    const id = yield getVideoMetadata(i)
    const videoMetadata = processVideoMetadata(id)
    const clipsToDownload = searchWordsInSubs(videoMetadata)
    console.log(
      "clipsToDownload",
      clipsToDownload
        .filter(el => el.phraseMatched)
        .map(el => {
          return { phrase: el.phraseMatched, word: el.wordSearchedText }
        })
    )
    if (clipsToDownload.length === 0) {
      break // no more were found
    }
  }
}

function searchWordsInSubs(videoMetadata: VideoMetadata): ClipToDownload[] {
  let result: ClipToDownload[] = []
  for (let i = 0; i < userDefaultsOnStart.words!.length; i++) {
    const word = userDefaultsOnStart.words![i]

    // if (wordFoundCounts[i] >= userDefaultsOnStart.numberOfWordReps!) continue
    const searchedWord = searchWordText(videoMetadata, word.mainWord)
    let start: number | undefined
    let end: number | undefined
    let phraseMatched: string | undefined

    if (searchedWord) {
      start = searchedWord.start
      end = searchedWord.end
      phraseMatched = searchedWord.phraseMatched
    }

    const clip: ClipToDownload = {
      id: videoMetadata.id,
      url: videoMetadata.url,
      start,
      end,
      altWordClips: [],
      wordSearchedText: word.mainWord,
      phraseMatched
    }
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

    result.push(clip)
  }
  return result
}

function searchWordText(
  videoMetadata: VideoMetadata,
  wordText: string
): Partial<ClipToDownload> | undefined {
  for (const phrase of videoMetadata.subtitles.phrases) {
    const clip: Partial<ClipToDownload> = {
      start: phrase.start,
      end: phrase.end,
      phraseMatched: phrase.text
    }
    if (videoMetadata.subtitles.isIndividualWords) {
      if (wordText === filterWord(phrase.text)) {
        return clip
      }
    } else {
      for (const subPhrase of phrase.text.split(/\s+/)) {
        if (wordText === filterWord(subPhrase)) {
          return clip
        }
      }
    }
  }
}
