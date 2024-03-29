import webvtt, { SubtitleCue } from "node-webvtt"
import { getDirName } from "../filesystem"
import fs from "fs"
import moment from "moment"
import { removeFirstOccurrence } from "../utils"
import path from "path"
import { userDefaultsOnStart, loadUserDefault } from "../userDefaults"
import { sendToConsoleOutput } from "../logger"

export interface Phrase {
  start: number
  end: number
  text: string
}

export interface TransformedSubtitles {
  isIndividualWords: boolean
  phrases: Phrase[] //we can use the phrases array for both individual words and long phrases, but we must check isIndividualWords to search through differently for efficiency.
}

export interface VideoMetadata {
  id: string
  subtitles: TransformedSubtitles
  bestVideoUrl?: string
  bestAudioUrl?: string
  bestCombinedUrl?: string
}

export interface YoutubeVideoFormat {
  format_id: string
  format_note: string
  asr: number
  filesize: number
  tbr: number
  width: number
  height: number
  fps: number
  vcodec: string
  acodec: string
  url?: string //appaz sometimse it might not exist, better be safe than sorry, just skip if not present
}

const infoFileExt = "info.json"
const subtitleFileExt = "vtt" //can't be sure if it will be .en.vtt if lang code is different

export default function processVideoMetadata(
  id: string,
  useUpdatedDefaults?: boolean
): VideoMetadata | undefined {
  // sendToConsoleOutput(
  //   `Processing video metadata and subtitles for video with ID ${id}`,
  //   "loading"
  // ) //user doesn't need to know this lol

  const infoFile = path.join(
    getDirName("metadataDir", useUpdatedDefaults),
    `${id}.${infoFileExt}`
  )
  const subLangCode = useUpdatedDefaults
    ? loadUserDefault("subtitleLanguageCode")
    : userDefaultsOnStart.subtitleLanguageCode

  const subsFile = path.join(
    getDirName("metadataDir", useUpdatedDefaults),
    `${id}.${subLangCode}.${subtitleFileExt}`
  )

  const subs = transformSubtitles(subsFile, id)
  const jsonInfo = JSON.parse(fs.readFileSync(infoFile).toString())
  if (!subs) return
  return {
    subtitles: subs,
    id: jsonInfo.id,
    bestVideoUrl: selectBestVideoFormat(jsonInfo.formats)?.url,
    bestAudioUrl: selectBestAudioFormat(jsonInfo.formats)?.url,
    bestCombinedUrl: selectBestCombinedFormat(jsonInfo.formats)?.url,
  }
}

function doesTextIncludeTimingTag(text: string): boolean {
  return text.includes("<c>") && text.includes("</c>")
}

function convertTimingFormat(timing: string): number {
  const parsedTiming = moment(timing, "HH:mm:ss.SSS")
  const totalSeconds =
    parsedTiming.hours() * 3600 +
    parsedTiming.minutes() * 60 +
    parsedTiming.seconds() +
    parsedTiming.milliseconds() / 1000
  return totalSeconds
}

function transformSubtitles(
  file: string,
  id: string
): TransformedSubtitles | undefined {
  let subsFile
  try {
    subsFile = fs.readFileSync(file).toString()
  } catch (error) {
    sendToConsoleOutput(
      `Could not find subtitle file. This might be because the video with ID ${id} does not have subtitles. This is a non fatal error, and execution will continue. Error message: ${error}`,
      "error"
    )
    return
  }
  const subs = webvtt.parse(subsFile, { meta: true })
  const hasIndividualWordTimings = doesTextIncludeTimingTag(subsFile) //<c> tag is how individual timings are done. check for the closing /c tag to make sure it's not fluke.
  let result: TransformedSubtitles = {
    isIndividualWords: hasIndividualWordTimings,
    phrases: [],
  }
  for (let i = 0; i < subs.cues.length; i++) {
    const cue = subs.cues[i]
    try {
      const words = hasIndividualWordTimings
        ? handleIndividualWordsCue(cue)
        : handlePhraseCue(cue)
      if (words) result.phrases.push(...words)
    } catch (error) {
      sendToConsoleOutput(
        `There was an error trying to transform the subtitles of video with ID ${id}. This is a non fatal error, and execution will continue.`,
        "error"
      )
    }
  }

  return result
}

function handlePhraseCue(cue: SubtitleCue): Phrase[] | undefined {
  if (cue.text) {
    const result = {
      start: cue.start,
      end: cue.end,
      text: cue.text,
    }
    return [result]
  } else {
    return
  }
}

function handleIndividualWordsCue(cue: SubtitleCue): Phrase[] | undefined {
  function filterLinesWithWordTimings(text: string): string {
    let result: string = ""
    for (const line of text.split(/\r\n|\r|\n/)) {
      if (doesTextIncludeTimingTag(line)) {
        result += line
      }
    }
    return result
  }

  function parseTextWithTimingInfo(text: string): Phrase[] {
    //we need to split into individual words
    //then we need to loop over every word 'package' and do what we need with the necessary info
    //if we split by </c>, we get every word grouped with its start time and its opening c tag
    //the first word will be included since it is not wrapped in any tags, so remove that one manually
    let result: Phrase[] = []
    const firstWord = text.split("<")[0]
    text = removeFirstOccurrence(text, firstWord)

    const wordPkgs = text
      .split("</c>")
      .filter((el) => el) //if not falsy
      .map((segment) => {
        const startTime = segment
          .split("<c>")[0]
          .replace("<", "")
          .replace(">", "")
          .trim()
        const text = segment.split("<c>")[1].trim()
        return {
          startTime,
          text,
        }
      })

    //create first word specially
    result.push({
      start: cue.start,
      end: convertTimingFormat(wordPkgs[0].startTime),
      text: firstWord,
    })
    //then create other words before last word
    for (let i = 0; i < wordPkgs.length - 1; i++) {
      result.push({
        start: convertTimingFormat(wordPkgs[i].startTime),
        end: convertTimingFormat(wordPkgs[i + 1].startTime),
        text: wordPkgs[i].text,
      })
    }
    //creat last word specially
    result.push({
      start: convertTimingFormat(wordPkgs[wordPkgs.length - 1].startTime),
      end: cue.end,
      text: wordPkgs[wordPkgs.length - 1].text,
    })
    return result
  }

  const textWithTimingInfo = filterLinesWithWordTimings(cue.text)
  if (!textWithTimingInfo) return // cue has no timing info and should be ignored.
  const parsedTextWithTimingInfo = parseTextWithTimingInfo(textWithTimingInfo)
  // console.log("parsed ", parsedTextWithTimingInfo)
  return parsedTextWithTimingInfo
}
/*
I<00:01:23.090><c> am</c><00:01:24.090><c> most</c><00:01:24.300><c> of</c><00:01:24.510><c> all</c><00:01:24.600><c> happy</c><00:01:24.960><c> and</c><00:01:25.260><c> grateful</c><00:01:25.740><c> to</c>

*/

//the following selection functions are from chatgpt, when i asked to to reproduce has ytdlp does it internally

function selectBestVideoFormat(
  formats: YoutubeVideoFormat[]
): YoutubeVideoFormat | null {
  // Filter out formats without video.
  const videoFormats = formats.filter(
    (format) => format.vcodec !== "none" && format.acodec === "none"
  )

  // Sort formats by resolution (width x height), then by bitrate.
  const sortedFormats = videoFormats.sort((a, b) => {
    const resA = (a.width || 0) * (a.height || 0)
    const resB = (b.width || 0) * (b.height || 0)

    if (resA !== resB) {
      return resB - resA // Highest resolution first
    }

    return (b.tbr || 0) - (a.tbr || 0) // Highest bitrate first
  })

  return sortedFormats[0] || null
}

function selectBestAudioFormat(
  formats: YoutubeVideoFormat[]
): YoutubeVideoFormat | null {
  // Filter out formats without audio.
  const audioFormats = formats.filter(
    (format) => format.acodec !== "none" && format.vcodec === "none"
  )

  // Sort formats by bitrate.
  const sortedFormats = audioFormats.sort(
    (a, b) => (b.tbr || 0) - (a.tbr || 0) // Highest bitrate first
  )

  return sortedFormats[0] || null
}

function selectBestCombinedFormat(
  formats: YoutubeVideoFormat[]
): YoutubeVideoFormat | null {
  // Filter out formats without either video or audio.
  const combinedFormats = formats.filter(
    (format) => format.vcodec !== "none" && format.acodec !== "none"
  )

  // Sort formats by resolution (width x height), then by bitrate.
  const sortedFormats = combinedFormats.sort((a, b) => {
    const resA = (a.width || 0) * (a.height || 0)
    const resB = (b.width || 0) * (b.height || 0)

    if (resA !== resB) {
      return resB - resA // Highest resolution first
    }

    return (b.tbr || 0) - (a.tbr || 0) // Highest bitrate first
  })
  console.log("best combined format : ", sortedFormats[0].format_id)
  return sortedFormats[0] || null
}
