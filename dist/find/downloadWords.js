"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const ffmpeg_1 = require("@ffmpeg-installer/ffmpeg");
const filesystem_1 = require("../filesystem");
const path_1 = __importDefault(require("path"));
const userDefaults_1 = require("../userDefaults");
const constants_1 = __importDefault(require("../constants"));
const logger_1 = require("../logger");
const fs_1 = __importDefault(require("fs"));
const ffmpegPath = ffmpeg_1.path.replace("app.asar", "app.asar.unpacked");
function* downloadWords(clips) {
    logger_1.sendToConsoleOutput("Downloading clips", "loading");
    filesystem_1.createDirIfNeeded(filesystem_1.getDirName("wordsDir"));
    //download non alt words first
    const sortedClips = clips.sort((a, b) => {
        return a.wordIndex - b.wordIndex;
    });
    //i acc think its better to download main word with alternative, because when editing, you'll want everything that exists for that word, and therefore you can edit while the bot is downloading!
    for (const clip of sortedClips) {
        yield downloadClip(clip);
    }
    logger_1.sendToConsoleOutput("Finished downloading clips", "info");
}
exports.downloadWords = downloadWords;
async function downloadClip(clip, isForManualSearch = false) {
    const folderName = `${clip.wordIndex}_${clip.mainWord}`; //coz alt word goes in main word folder
    let startTime = clip.start;
    let endTime = clip.end;
    const paddingToAdd = isForManualSearch
        ? userDefaults_1.loadUserDefault("paddingToAdd")
        : userDefaults_1.userDefaultsOnStart.paddingToAdd;
    if (paddingToAdd) {
        startTime = Math.max(startTime - paddingToAdd, 0);
        endTime = endTime + paddingToAdd; //if -to is longer than vid, it just stops at end which is fine
    }
    //to 2dp
    startTime = Math.round(startTime * 100) / 100;
    endTime = Math.round(endTime * 100) / 100;
    let clipDir = path_1.default.join(isForManualSearch
        ? filesystem_1.getDirName("wordsManuallyFoundDir", true)
        : filesystem_1.getDirName("wordsDir"), folderName);
    filesystem_1.createDirIfNeeded(clipDir);
    if (clip.isAlternative) {
        clipDir = path_1.default.join(clipDir, constants_1.default.folderNames.alternativeWords);
        filesystem_1.createDirIfNeeded(clipDir);
        clipDir = path_1.default.join(clipDir, clip.wordSearchedText);
        filesystem_1.createDirIfNeeded(clipDir);
    }
    const fileName = `${clip.wordSearchedText}_${clip.id}_${startTime}_${endTime}`;
    const fullPath = path_1.default.join(clipDir, fileName + ".mp4");
    logger_1.sendToConsoleOutput(`Downloading clip of ${clip.isAlternative ? "alternative " : ""}word: ${clip.wordSearchedText}`, "loading");
    return new Promise((resolve, reject) => {
        let wasErrorFound = false;
        if (fs_1.default.existsSync(fullPath)) {
            logger_1.sendToConsoleOutput(`Found clip ${fullPath} already downloaded so skipping`, "info");
            resolve(fullPath);
            return;
        }
        const shouldReEncode = isForManualSearch
            ? userDefaults_1.loadUserDefault("reEncodeVideos")
            : userDefaults_1.userDefaultsOnStart.reEncodeVideos;
        let args = [
            "-y",
            "-ss",
            startTime.toString(),
            "-to",
            endTime.toString(),
            "-headers",
            constants_1.default.ffmpeg.headers,
            "-i",
            clip.url
        ];
        if (shouldReEncode === false) {
            args.push("-c", //this causes freeze at end
            "copy", "-f", "mp4");
        }
        args.push(fullPath);
        let proc = child_process_1.spawn(ffmpegPath, args);
        //stdout
        proc.stdout.setEncoding("utf8");
        proc.stdout.on("data", function (data) { });
        //stderr
        proc.stderr.setEncoding("utf8");
        proc.stderr.on("data", function (data) {
            // console.log("stderr data: ", data)
            if (data.includes("HTTP error 403 Forbidden")) {
                console.log("raw video url expired");
                wasErrorFound = true;
                // reject(
                //   new URIError(
                //     "Raw video URL expired. Need to get updated metadata for video. If this problem persists, delete the temp folder in your chosen output location."
                //   )
                // )
                logger_1.sendToConsoleOutput("Error downloading video: raw video URL expired. Need to get updated metadata for video. If this problem persists, delete the temp folder in your chosen output location.", "error");
                return;
            }
            if (data.includes("error") || data.includes("Error")) {
                // reject(
                //   new Error(
                //     data //honestly idk what else to do.
                //   )
                // )
                //don't stop tryna continue, keep going!!
                logger_1.sendToConsoleOutput(`Error downloading video ${clip.id}: ${data}. Execution will continue.`, "error");
            }
        });
        proc.stderr.on("error", function (err) {
            console.log("there was an error ffmpeg dl: ", err);
        });
        proc.on("exit", (code, signal) => {
            console.log("close", code, signal);
            if (wasErrorFound)
                return; //don't resolve
            logger_1.sendToConsoleOutput(`Downloaded clip to ${fullPath}`, "success");
            resolve(fullPath);
        });
    });
}
exports.downloadClip = downloadClip;
