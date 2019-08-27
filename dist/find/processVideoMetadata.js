"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_webvtt_1 = __importDefault(require("node-webvtt"));
const filesystem_1 = require("../filesystem");
const logger_1 = require("../logger");
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const utils_1 = require("../utils");
const infoFileExt = ".info.json";
const subtitleFileExt = ".vtt"; //can't be sure if it will be .en.vtt if lang code is different
async function processVideoMetadata() {
    logger_1.sendToConsoleOutput("Processing video metadata and subtitles", "loading");
    const files = await filesystem_1.getFilesInDir(filesystem_1.getDirName("metadataDir"));
    const infoFiles = files.filter(file => file.slice(-infoFileExt.length) === infoFileExt);
    //loop through each json vtt file par, and if one is missing, or cannot be read, instead of throwing an error and stopping it from working, just console output an error and continue
    let result = [];
    for (const infoFile of infoFiles) {
        const fileNameNoExt = infoFile.slice(0, -infoFileExt.length);
        const correspondingSubsFile = files.filter(file => file.slice(0, fileNameNoExt.length) === fileNameNoExt && //if the extensionless name matches
            file.slice(-subtitleFileExt.length) === subtitleFileExt //if the extension also matches
        )[0];
        try {
            const subs = transformSubtitles(correspondingSubsFile);
            const jsonInfo = JSON.parse(fs_1.default.readFileSync(infoFile).toString());
            result.push({
                subtitles: subs,
                id: jsonInfo.id,
                url: jsonInfo.formats[jsonInfo.formats.length - 1].url //last format always seems to be for the best with video and audio
            });
        }
        catch (error) {
            //don't stop execution
            logger_1.sendToConsoleOutput(`Error processing video metadata or subtitles for file ${infoFile}: ${error.message}. This is not fatal and execution will attempt to continue with the other videos if any`, "error");
        }
    }
    logger_1.sendToConsoleOutput("Processed video metadata and subtitles", "info");
    return result;
}
exports.default = processVideoMetadata;
function doesTextIncludeTimingTag(text) {
    return text.includes("<c>") && text.includes("</c>");
}
function convertTimingFormat(timing) {
    const parsedTiming = moment_1.default(timing, "HH:mm:ss.SSS");
    const totalSeconds = parsedTiming.hours() * 3600 +
        parsedTiming.minutes() * 60 +
        parsedTiming.seconds() +
        parsedTiming.milliseconds() / 1000;
    return totalSeconds;
}
function transformSubtitles(file) {
    const subsFile = fs_1.default.readFileSync(file).toString();
    const subs = node_webvtt_1.default.parse(subsFile, { meta: true });
    const hasIndividualWordTimings = doesTextIncludeTimingTag(subsFile); //<c> tag is how individual timings are done. check for the closing /c tag to make sure it's not fluke.
    let result = {
        isIndividualWords: hasIndividualWordTimings,
        phrases: []
    };
    for (let i = 0; i < subs.cues.length; i++) {
        const cue = subs.cues[i];
        const words = hasIndividualWordTimings
            ? handleIndividualWordsCue(cue)
            : handlePhraseCue(cue);
        if (words)
            result.phrases.push(...words);
    }
    return result;
}
function handlePhraseCue(cue) {
    if (cue.text) {
        const result = {
            start: cue.start,
            end: cue.end,
            text: cue.text
        };
        return [result];
    }
    else {
        return;
    }
}
function handleIndividualWordsCue(cue) {
    function filterLinesWithWordTimings(text) {
        let result = "";
        for (const line of text.split(/\r\n|\r|\n/)) {
            if (doesTextIncludeTimingTag(line)) {
                result += line;
            }
        }
        return result;
    }
    function parseTextWithTimingInfo(text) {
        //we need to split into individual words
        //then we need to loop over every word 'package' and do what we need with the necessary info
        //if we split by </c>, we get every word grouped with its start time and its opening c tag
        //the first word will be included since it is not wrapped in any tags, so remove that one manually
        let result = [];
        const firstWord = text.split("<")[0];
        text = utils_1.removeFirstOccurrence(text, firstWord);
        const wordPkgs = text
            .split("</c>")
            .filter(el => el) //if not falsy
            .map(segment => {
            const startTime = segment
                .split("<c>")[0]
                .replace("<", "")
                .replace(">", "")
                .trim();
            const text = segment.split("<c>")[1].trim();
            return {
                startTime,
                text
            };
        });
        //create first word specially
        result.push({
            start: cue.start,
            end: convertTimingFormat(wordPkgs[0].startTime),
            text: firstWord
        });
        //then create other words before last word
        for (let i = 0; i < wordPkgs.length - 1; i++) {
            result.push({
                start: convertTimingFormat(wordPkgs[i].startTime),
                end: convertTimingFormat(wordPkgs[i + 1].startTime),
                text: wordPkgs[i].text
            });
        }
        //creat last word specially
        result.push({
            start: convertTimingFormat(wordPkgs[wordPkgs.length - 1].startTime),
            end: cue.end,
            text: wordPkgs[wordPkgs.length - 1].text
        });
        return result;
    }
    const textWithTimingInfo = filterLinesWithWordTimings(cue.text);
    if (!textWithTimingInfo)
        return; // cue has no timing info and should be ignored.
    const parsedTextWithTimingInfo = parseTextWithTimingInfo(textWithTimingInfo);
    // console.log("parsed ", parsedTextWithTimingInfo)
    return parsedTextWithTimingInfo;
}
/*
I<00:01:23.090><c> am</c><00:01:24.090><c> most</c><00:01:24.300><c> of</c><00:01:24.510><c> all</c><00:01:24.600><c> happy</c><00:01:24.960><c> and</c><00:01:25.260><c> grateful</c><00:01:25.740><c> to</c>

*/
