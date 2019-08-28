import webvtt, { SubtitleCue } from "node-webvtt"
import { getFilesInDir, getDirName } from "../filesystem"
import { sendToConsoleOutput } from "../logger"
import fs from "fs"
import moment from "moment"
import { removeFirstOccurrence } from "../utils"
import path from "path"
import { userDefaultsOnStart } from "../userDefaults"

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
  url: string
}

const infoFileExt = ".info.json"
const subtitleFileExt = ".vtt" //can't be sure if it will be .en.vtt if lang code is different

export default async function processVideoMetadata(
  id: string
): Promise<VideoMetadata> {
  sendToConsoleOutput(
    `Processing video metadata and subtitles for video with ID ${id}`,
    "loading"
  )

  const infoFile = path.join(getDirName("metadataDir"), `${id}.info.json`)
  const subsFile = path.join(
    getDirName("metadataDir"),
    `${id}.${userDefaultsOnStart.subtitleLanguageCode}.vtt`
  )

  const subs = transformSubtitles(subsFile)
  const jsonInfo = JSON.parse(fs.readFileSync(infoFile).toString())

  return {
    subtitles: subs,
    id: jsonInfo.id,
    url: jsonInfo.formats[jsonInfo.formats.length - 1].url //last format always seems to be for the best with video and audio
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

function transformSubtitles(file: string): TransformedSubtitles {
  const subsFile = fs.readFileSync(file).toString()
  const subs = webvtt.parse(subsFile, { meta: true })
  const hasIndividualWordTimings = doesTextIncludeTimingTag(subsFile) //<c> tag is how individual timings are done. check for the closing /c tag to make sure it's not fluke.
  let result: TransformedSubtitles = {
    isIndividualWords: hasIndividualWordTimings,
    phrases: []
  }
  for (let i = 0; i < subs.cues.length; i++) {
    const cue = subs.cues[i]
    const words = hasIndividualWordTimings
      ? handleIndividualWordsCue(cue)
      : handlePhraseCue(cue)
    if (words) result.phrases.push(...words)
  }

  return result
}

function handlePhraseCue(cue: SubtitleCue): Phrase[] | undefined {
  if (cue.text) {
    const result = {
      start: cue.start,
      end: cue.end,
      text: cue.text
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
      .filter(el => el) //if not falsy
      .map(segment => {
        const startTime = segment
          .split("<c>")[0]
          .replace("<", "")
          .replace(">", "")
          .trim()
        const text = segment.split("<c>")[1].trim()
        return {
          startTime,
          text
        }
      })

    //create first word specially
    result.push({
      start: cue.start,
      end: convertTimingFormat(wordPkgs[0].startTime),
      text: firstWord
    })
    //then create other words before last word
    for (let i = 0; i < wordPkgs.length - 1; i++) {
      result.push({
        start: convertTimingFormat(wordPkgs[i].startTime),
        end: convertTimingFormat(wordPkgs[i + 1].startTime),
        text: wordPkgs[i].text
      })
    }
    //creat last word specially
    result.push({
      start: convertTimingFormat(wordPkgs[wordPkgs.length - 1].startTime),
      end: cue.end,
      text: wordPkgs[wordPkgs.length - 1].text
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
