import { userDefaultsOnStart } from "../userDefaults"
import processVideoMetadata, { VideoMetadata } from "./processVideoMetadata"
import { filterWord, shouldApplyWordFilter } from "../words"
import getVideoMetadata from "./getVideoMetadata"
import { sendToConsoleOutput } from "../logger"

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

let wordFoundCounts: {
  wordCount: number
  alternativeWordCount: { [key: string]: number }
}[] = []
//remember, if all words have reached their max rep counts, just end the search. do NOT end the search if searchWordsInSubs returns an empty array, because that could be due to other reasons

export default function* findWords() {
  for (let i = 0; i < userDefaultsOnStart.maxNumberOfVideos!; i++) {
    const id = yield getVideoMetadata(i)
    if (!id) {
      sendToConsoleOutput("No more videos in playlist or channel", "info")
      break
    } //no more vids in playlist
    const videoMetadata = processVideoMetadata(id)
    const clipsToDownload = searchWordsInSubs(videoMetadata)
    sendToConsoleOutput(
      `Found ${Math.round(
        calculatePercentageFound("main")
      )}% of the main words (with repetitions) so far`,
      "info"
    )
    sendToConsoleOutput(
      `Found ${Math.round(
        calculatePercentageFound("alternative")
      )}% of the alternative words (with repetitions) so far`,
      "info"
    )
    console.log("clipsToDownload", clipsToDownload.length)
    console.log("word counts", wordFoundCounts.map(el => el.wordCount))
  }
}

function searchWordsInSubs(videoMetadata: VideoMetadata): ClipToDownload[] {
  let result: ClipToDownload[] = []
  for (let i = 0; i < userDefaultsOnStart.words!.length; i++) {
    if (!wordFoundCounts[i])
      wordFoundCounts[i] = { wordCount: 0, alternativeWordCount: {} }
    const word = userDefaultsOnStart.words![i]

    const clips = searchWordText(
      videoMetadata,
      word.mainWord,
      false,
      i,
      word.originalUnfilteredWord
    )
    //also need to limit size here as may have returned mor ethan no word reps in one call
    result.push(...clips)

    for (const altWordKey in word.alternativeWords) {
      if (!word.alternativeWords[altWordKey].isBeingUsed) continue

      const altWordText = word.alternativeWords[altWordKey].word

      if (!wordFoundCounts[i].alternativeWordCount[altWordText])
        wordFoundCounts[i].alternativeWordCount[altWordText] = 0

      const clips = searchWordText(videoMetadata, altWordText, true, i)
      result.push(...clips)
    }
  }
  return result
}

function searchWordText(
  videoMetadata: VideoMetadata,
  text: string,
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
      wordSearchedText: text,
      originalUnfilteredWord,
      isAlternative,
      wordIndex
    }
    if (videoMetadata.subtitles.isIndividualWords) {
      if (
        text ===
        (shouldApplyWordFilter(userDefaultsOnStart.subtitleLanguageCode!)
          ? filterWord(phrase.text)
          : phrase.text)
      ) {
        pushIfNeeded(clip)
      }
    } else {
      for (const subPhrase of phrase.text.split(/\s+/)) {
        if (
          text ===
          (shouldApplyWordFilter(userDefaultsOnStart.subtitleLanguageCode!)
            ? filterWord(subPhrase)
            : subPhrase)
        ) {
          pushIfNeeded(clip)
        }
      }
    }
  }

  function pushIfNeeded(clip: ClipToDownload) {
    if (isAlternative) {
      if (
        wordFoundCounts[wordIndex].alternativeWordCount[text] >=
        userDefaultsOnStart.numberOfWordReps!
      ) {
        return
      }
    } else {
      if (
        wordFoundCounts[wordIndex].wordCount >=
        userDefaultsOnStart.numberOfWordReps!
      ) {
        return
      }
    }
    result.push(clip)

    if (isAlternative) {
      wordFoundCounts[wordIndex].alternativeWordCount[text] += 1
    } else {
      wordFoundCounts[wordIndex].wordCount += 1
    }
  }
  return result
}

function calculatePercentageFound(words: "main" | "alternative"): number {
  if (words === "main") {
    const targetCount =
      userDefaultsOnStart.words!.length * userDefaultsOnStart.numberOfWordReps!
    let foundCount = 0
    wordFoundCounts.forEach(el => {
      foundCount += el.wordCount
    })
    return (foundCount / targetCount) * 100
  } else {
    let targetCount = 0
    userDefaultsOnStart.words!.forEach(el => {
      if (el.alternativeWords)
        targetCount +=
          Object.keys(el.alternativeWords).length *
          userDefaultsOnStart.numberOfWordReps!
    })
    let foundCount = 0
    wordFoundCounts.forEach(el => {
      foundCount += Object.keys(el.alternativeWordCount).length
    })
    return (foundCount / targetCount) * 100
  }
}
