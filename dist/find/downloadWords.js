"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const ffmpeg_1 = require("@ffmpeg-installer/ffmpeg");
const filesystem_1 = require("../filesystem");
const path_1 = __importDefault(require("path"));
function* downloadWords(clips) {
    //download non alt words first
    const nonAltClips = clips.filter(clip => !clip.isAlternative);
    for (const clip of nonAltClips) {
        yield downloadClip(clip);
    }
    const altWordClips = clips.filter(clip => clip.isAlternative);
    for (const clip of altWordClips) {
        yield downloadClip(clip);
    }
}
exports.downloadWords = downloadWords;
async function downloadClip(clip) {
    const folderName = `${clip.wordIndex}_${clip.wordSearchedText}`;
    //have an autoFound and manuallyFound dir
    const clipDir = path_1.default.join(filesystem_1.getDirName("wordsDir"), folderName);
    filesystem_1.createDirIfNeeded(clipDir); //so we only create the dirs if there is something to put in
    let proc = child_process_1.spawn(ffmpeg_1.path, [
        "-y",
        "-ss",
        "0",
        "-i",
        "",
        "-t",
        "1",
        "./playground/testFfmpegOut.mp4"
    ]);
    proc.stdout.setEncoding("utf8");
    proc.stdout.on("data", function (data) {
        console.log("stdout data: ", data);
    });
    proc.stderr.setEncoding("utf8");
    proc.stderr.on("data", function (data) {
        console.log("stderr data: ", data);
    });
    proc.on("close", (code, signal) => {
        console.log(code, signal);
    });
}
