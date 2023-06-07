import { userDefaultsOnStart, loadUserDefault } from "../userDefaults"
import processVideoMetadata, { VideoMetadata } from "./processVideoMetadata"
import { filterWord, shouldApplyWordFilter } from "../words"
import getVideoMetadata from "./getVideoMetadata"
import { sendToConsoleOutput } from "../logger"

let wordFoundCounts: {
  wordCount: number
  alternativeWordCount: { [key: string]: number }
}[] = []
//remember, if all words have reached their max rep counts, just end the search. do NOT end the search if searchWordsInSubs returns an empty array, because that could be due to other reasons

export default function* findWords() {
  let result: ClipToDownload[] = []
  wordFoundCounts = [] //i think not having this may have been causing the glitch earlier
  for (let i = 0; i < userDefaultsOnStart.maxNumberOfVideos!; i++) {
    try {
      const id: string = yield getVideoMetadata(i)
      if (id === "GET_VIDEO_METADATA_ERROR") {
        continue //there was an error getting 1 vid's metadata. don't stopp everything. just keep trying
      }
      if (!id) {
        sendToConsoleOutput(
          `There was no video at index ${
            i + 1
          }. Therefore, there are no more videos to get.`,
          "info"
        )
        break //if id is null but there was no error thrown (so catch above not trigged) then stop.
      } //no more vids in playlist
      const videoMetadata = processVideoMetadata(id)
      if (!videoMetadata) continue
      const clipsToDownload = searchWordsInSubs(videoMetadata)
      sendToConsoleOutput(
        `Found ${Math.round(
          calculatePercentageFound("main")!
        )}% of the main words (with repetitions) so far`,
        "info"
      )
      const altWordPercentFound = calculatePercentageFound("alternative")
      if (altWordPercentFound)
        sendToConsoleOutput(
          `Found ${Math.round(
            altWordPercentFound
          )}% of the alternative words (with repetitions) so far`,
          "info"
        )
      result.push(...clipsToDownload)
    } catch (error) {
      sendToConsoleOutput(
        `Error finding words for video at index ${i}: ${error}. Continuing execution to next video.`,
        "error"
      )
    }

    // console.log("clipsToDownload", clipsToDownload.length)
    // console.log("word counts", wordFoundCounts.map(el => el.wordCount))
  }
  return result
}

function searchWordsInSubs(videoMetadata: VideoMetadata): ClipToDownload[] {
  let result: ClipToDownload[] = []
  for (let i = 0; i < userDefaultsOnStart.words!.length; i++) {
    if (!wordFoundCounts[i])
      wordFoundCounts[i] = { wordCount: 0, alternativeWordCount: {} }
    const word = userDefaultsOnStart.words![i]
    if (word.mainWord === "") continue //it aint here boss

    const clips = searchWordText(
      videoMetadata,
      word.mainWord,
      false,
      i,
      false,
      word.mainWord,
      word.originalUnfilteredWord
    )
    //also need to limit size here as may have returned mor ethan no word reps in one call
    result.push(...clips)

    for (const altWordKey in word.alternativeWords) {
      if (!word.alternativeWords[altWordKey].isBeingUsed) continue

      const altWordText = word.alternativeWords[altWordKey].word

      if (!wordFoundCounts[i].alternativeWordCount[altWordText])
        wordFoundCounts[i].alternativeWordCount[altWordText] = 0

      const clips = searchWordText(
        videoMetadata,
        altWordText,
        true,
        i,
        false,
        word.mainWord
      )
      result.push(...clips)
    }
  }
  return result
}

export function searchWordText(
  videoMetadata: VideoMetadata,
  text: string,
  isAlternative: boolean,
  wordIndex: number,
  isForManualSearch: boolean,
  mainWord: string,
  originalUnfilteredWord?: string
): ClipToDownload[] {
  let result: ClipToDownload[] = []
  const subLangCode = isForManualSearch
    ? loadUserDefault("subtitleLanguageCode")
    : userDefaultsOnStart.subtitleLanguageCode! //doing this in the for loop is SO FUCKING DUMB DO U KNOW HOW LONG IT TAKES
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
      wordIndex,
      mainWord,
    }
    if (videoMetadata.subtitles.isIndividualWords) {
      if (
        text ===
        (shouldApplyWordFilter(subLangCode)
          ? filterWord(phrase.text)
          : phrase.text)
      ) {
        if (isForManualSearch) {
          result.push(clip)
        } else {
          pushIfNeeded(clip)
        }
      }
    } else {
      for (const subPhrase of phrase.text.split(/\s+/)) {
        if (
          text ===
          (shouldApplyWordFilter(subLangCode)
            ? filterWord(subPhrase)
            : subPhrase)
        ) {
          if (isForManualSearch) {
            result.push(clip)
          } else {
            pushIfNeeded(clip)
          }
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

function calculatePercentageFound(
  words: "main" | "alternative"
): number | undefined {
  if (words === "main") {
    const targetCount =
      userDefaultsOnStart.words!.length * userDefaultsOnStart.numberOfWordReps!
    let foundCount = 0
    wordFoundCounts.forEach((el) => {
      foundCount += el.wordCount
    })
    console.log("found count: ", foundCount, "target count: ", targetCount)
    return (foundCount / targetCount) * 100
  } else {
    let targetCount = 0
    userDefaultsOnStart.words!.forEach((el) => {
      if (el.alternativeWords)
        targetCount +=
          Object.keys(el.alternativeWords).length *
          userDefaultsOnStart.numberOfWordReps!
    })
    let foundCount = 0
    wordFoundCounts.forEach((el) => {
      foundCount += Object.keys(el.alternativeWordCount).length
    })
    if (targetCount !== 0) return (foundCount / targetCount) * 100
  }
}
