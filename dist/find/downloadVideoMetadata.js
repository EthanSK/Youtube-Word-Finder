"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_dl_1 = __importDefault(require("youtube-dl"));
const filesystem_1 = require("../filesystem");
const userDefaults_1 = require("../userDefaults");
const logger_1 = require("../logger");
async function downloadVideoMetadata(url) {
    logger_1.sendToConsoleOutput(`Getting video metadata and subtitles for ${url}`, "loading");
    const id = await downloadInfoAndSubs(url);
    logger_1.sendToConsoleOutput("Got video metadata and subtitles", "info");
    return id;
}
exports.default = downloadVideoMetadata;
async function downloadInfoAndSubs(url) {
    if (!url)
        throw new Error("Video input URL cannot be found");
    return new Promise((resolve, reject) => {
        const flags = [
            "--write-info-json",
            "--skip-download",
            "--print-json",
            "--ignore-errors",
            "--playlist-end",
            userDefaults_1.userDefaultsOnStart.maxNumberOfVideos.toString(),
            // "--write-sub ", //only using auto because it has individual word timings
            "--write-auto-sub",
            "--sub-lang",
            userDefaults_1.userDefaultsOnStart.subtitleLanguageCode,
            "-o",
            filesystem_1.createYoutubeDlFilePath("metadataDir", "id")
        ];
        youtube_dl_1.default.exec(url, flags, {}, function (err, output) {
            if (err)
                return reject(err);
            // console.log("outputtt: ", JSON.parse(output[0]).id)
            // fs.writeFileSync(path.join(getDirName("metadataDir"), "lol"), output) //no way to get subs straight to memory :/
            resolve(JSON.parse(output[0]).id);
        });
    });
}
