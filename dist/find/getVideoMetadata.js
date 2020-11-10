"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_dl_1 = __importDefault(require("youtube-dl"));
const filesystem_1 = require("../filesystem");
const userDefaults_1 = require("../userDefaults");
const logger_1 = require("../logger");
const fs_1 = __importDefault(require("fs"));
const constants_1 = __importDefault(require("../constants"));
const store_1 = require("../store");
async function getVideoMetadata(videoIndex, useUpdatedDefaults = false) {
    logger_1.sendToConsoleOutput(`Getting metadata and subtitles for video ${videoIndex + 1}`, "loading");
    const userDefaults = useUpdatedDefaults
        ? store_1.load(userDefaults_1.userDefaultsKey)
        : userDefaults_1.userDefaultsOnStart;
    let id;
    try {
        switch (userDefaults.videoSource) {
            case "Channel":
                id = await downloadInfoAndSubs(constants_1.default.youtube.channelURLPrefix + userDefaults.channelId, useUpdatedDefaults, videoIndex + 1);
                break;
            case "Playlist":
                id = await downloadInfoAndSubs(constants_1.default.youtube.playlistURLPrefix + userDefaults.playlistId, useUpdatedDefaults, videoIndex + 1);
                break;
            case "Text file":
                const url = fs_1.default
                    .readFileSync(userDefaults.videoTextFile, "utf8")
                    .split(/\r\n|\r|\n/)
                    .filter((url) => url) //non falsy urls only
                    .map((url) => {
                    return url;
                })[videoIndex];
                if (url)
                    id = await downloadInfoAndSubs(url, useUpdatedDefaults);
                break;
        }
    }
    catch (error) {
        logger_1.sendToConsoleOutput("Error getting video metadata: " + error, "error");
        id = "GET_VIDEO_METADATA_ERROR"; //this is horrid, but the only way using generators i tihnk
    }
    // sendToConsoleOutput("Got video metadata and subtitles", "info") //unecessary
    return id;
}
exports.default = getVideoMetadata;
//this should only get one video at a time. if using text file, don't need playlistIndex, else we do, othrewise it will adowlnoad the whole channel
async function downloadInfoAndSubs(url, useUpdatedDefaults, playlistIndex) {
    const userDefaults = useUpdatedDefaults
        ? store_1.load(userDefaults_1.userDefaultsKey)
        : userDefaults_1.userDefaultsOnStart;
    if (!url)
        throw new Error("Video input URL cannot be found");
    if (userDefaults.videoSource !== "Text file" && !playlistIndex)
        throw new Error("Playlist index is not set for channel or playlist url");
    if (userDefaults.videoSource === "Text file" && !url.includes("watch?v="))
        throw new Error("Detected an invalid URL in the videos text file");
    return new Promise((resolve, reject) => {
        let flags = [
            "--write-info-json",
            "--skip-download",
            "--print-json",
            "--ignore-errors",
            // "--write-sub ", //only using auto because it has individual word timings
            "--write-auto-sub",
            "--sub-lang",
            userDefaults.subtitleLanguageCode,
        ];
        if (userDefaults.videoSource !== "Text file") {
            //channel counts as playlist
            // flags.push(
            //   "--playlist-start",
            //   playlistIndex!.toString(),
            //   "--playlist-end",
            //   playlistIndex!.toString()
            // ) //only get video at this index
            flags.push("--playlist-items", playlistIndex.toString()); //new and improved way
        }
        if (userDefaults.cookiesTextFile) {
            flags.push("--cookies", userDefaults.cookiesTextFile);
        }
        flags.push("-o", filesystem_1.createYoutubeDlFilePath("metadataDir", "id", useUpdatedDefaults));
        console.log("url: ", url, "flags: ", flags);
        youtube_dl_1.default.exec(url, flags, {}, function (err, output) {
            if (err) {
                return reject(err);
            }
            console.log("outputt: ", output);
            // console.log("outputtt: ", JSON.parse(output[0]).id)
            // fs.writeFileSync(path.join(getDirName("metadataDir"), "lol.json"), output) //no way to get subs straight to memory :/
            if (!output || (output.length === 1 && output[0] === "")) {
                //no more vids in playlist
                resolve();
            }
            else {
                resolve(JSON.parse(output.join("\n")).id);
            }
        });
    });
}
