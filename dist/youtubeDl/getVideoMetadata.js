"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_dl_1 = __importDefault(require("youtube-dl"));
const filesystem_1 = require("../filesystem");
const userDefaults_1 = require("../userDefaults");
const constants_1 = __importDefault(require("../constants"));
const logger_1 = require("../logger");
const fs_1 = __importDefault(require("fs"));
async function getVideoMetadata() {
    logger_1.sendToConsoleOutput("Getting video metadata and subtitles", "loading");
    switch (userDefaults_1.userDefaultsOnStart.videoSource) {
        case "Channel":
            await downloadInfoAndSubs(constants_1.default.youtube.channelURLPrefix + userDefaults_1.userDefaultsOnStart.channelId);
            break;
        case "Playlist":
            await downloadInfoAndSubs(constants_1.default.youtube.playlistURLPrefix + userDefaults_1.userDefaultsOnStart.playlistId);
            break;
        case "Text file":
            await downloadInfoAndSubsTextFile();
            break;
    }
    logger_1.sendToConsoleOutput("Got video metadata and subtitles", "info");
}
async function downloadInfoAndSubs(url) {
    if (!url)
        throw new Error("Video input URL cannot be found");
    return new Promise((resolve, reject) => {
        const flags = [
            "--write-info-json",
            "--skip-download",
            "--ignore-errors",
            "--playlist-end",
            userDefaults_1.userDefaultsOnStart.maxNumberOfVideos.toString(),
            "--write-sub",
            "--write-auto-sub",
            "--sub-lang",
            userDefaults_1.userDefaultsOnStart.subtitleLanguageCode,
            "-o",
            filesystem_1.createYoutubeDlFilePath("metadataDir", "id")
        ];
        youtube_dl_1.default.exec(url, flags, {}, function (err, output) {
            if (err)
                return reject(err);
            // console.log(output.join("\n"))
            resolve();
        });
    });
    // youtubedl.getInfo(url, function(err, _info) {
    //   if (err) throw err
    //   const info = _info as any
    //   console.log("id:", info.id)
    //   console.log("title:", info.title)
    //   console.log("url:", info.url)
    //   console.log("thumbnail:", info.thumbnail)
    //   console.log("description:", info.description)
    //   console.log("filename:", info._filename)
    //   console.log("format id:", info.format_id)
    // })
}
async function downloadInfoAndSubsTextFile() {
    if (!userDefaults_1.userDefaultsOnStart.videoTextFile)
        throw new Error("No text file containing video URLs could be found");
    const vidURLs = fs_1.default
        .readFileSync(userDefaults_1.userDefaultsOnStart.videoTextFile, "utf8")
        .split(/\r\n|\r|\n/)
        .filter(url => url); //non falsy lines only
    for (const url of vidURLs) {
        await downloadInfoAndSubs(url);
    }
}
exports.default = getVideoMetadata;
//
