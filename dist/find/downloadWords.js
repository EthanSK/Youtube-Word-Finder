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
function* downloadWords(clips) {
    logger_1.sendToConsoleOutput("Downloading clips", "loading");
    filesystem_1.createDirIfNeeded(filesystem_1.getDirName("wordsDir"));
    //download non alt words first
    const sortedClips = clips.sort((a, b) => {
        return a.wordIndex - b.wordIndex;
    });
    const nonAltClips = sortedClips.filter(clip => !clip.isAlternative);
    for (const clip of nonAltClips) {
        yield downloadClip(clip);
    }
    const altWordClips = sortedClips.filter(clip => clip.isAlternative);
    for (const clip of altWordClips) {
        yield downloadClip(clip);
    }
    logger_1.sendToConsoleOutput("Finished downloading clips", "info");
}
exports.downloadWords = downloadWords;
async function downloadClip(clip) {
    const mainWord = userDefaults_1.userDefaultsOnStart.words[clip.wordIndex].mainWord;
    const folderName = `${clip.wordIndex}_${mainWord}`; //coz alt word goes in main word folder
    let startTime = clip.start;
    let endTime = clip.end;
    if (userDefaults_1.userDefaultsOnStart.paddingToAdd) {
        startTime = Math.max(startTime - userDefaults_1.userDefaultsOnStart.paddingToAdd, 0);
        endTime = endTime + userDefaults_1.userDefaultsOnStart.paddingToAdd; //if -to is longer than vid, it just stops at end which is fine
    }
    let clipDir = path_1.default.join(filesystem_1.getDirName("wordsDir"), folderName);
    filesystem_1.createDirIfNeeded(clipDir);
    //no, this is annoying
    // clipDir = path.join(clipDir, constants.folderNames.autoFound)
    // createDirIfNeeded(clipDir)
    if (clip.isAlternative) {
        clipDir = path_1.default.join(clipDir, constants_1.default.folderNames.alternativeWords);
        filesystem_1.createDirIfNeeded(clipDir);
        clipDir = path_1.default.join(clipDir, clip.wordSearchedText);
        filesystem_1.createDirIfNeeded(clipDir);
    }
    const fileName = `${clip.wordSearchedText}_${clip.id}_${clip.start}_${clip.end}`;
    const fullPath = path_1.default.join(clipDir, fileName + ".mp4");
    logger_1.sendToConsoleOutput(`Downloading clip of ${clip.isAlternative ? "alternative " : ""}word: ${clip.wordSearchedText}`, "loading");
    return new Promise((resolve, reject) => {
        if (fs_1.default.existsSync(fullPath)) {
            logger_1.sendToConsoleOutput(`Found clip ${fullPath} already downloaded so skipping`, "info");
            resolve();
            return;
        }
        let proc = child_process_1.spawn(ffmpeg_1.path, [
            "-y",
            "-i",
            clip.url,
            "-ss",
            startTime.toString(),
            "-to",
            endTime.toString(),
            fullPath
        ]);
        //stdout
        proc.stdout.setEncoding("utf8");
        proc.stdout.on("data", function (data) {
            // console.log("stdout data: ", data)
        });
        //stderr
        proc.stderr.setEncoding("utf8");
        proc.stderr.on("data", function (data) {
            // console.log("stderr data: ", data)
        });
        proc.on("exit", (code, signal) => {
            console.log("close", code, signal);
            logger_1.sendToConsoleOutput(`Downloaded clip to ${fullPath}`, "success");
            resolve();
        });
    });
}
