"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_dl_1 = __importDefault(require("youtube-dl"));
const filesystem_1 = require("../filesystem");
const userDefaults_1 = require("../userDefaults");
const constants_1 = __importDefault(require("../constants"));
async function getVideoMetadata() {
    switch (userDefaults_1.userDefaultsOnStart.videoSource) {
        case "Channel":
            const url = constants_1.default.youtube.channelURLPrefix + userDefaults_1.userDefaultsOnStart.channelId;
            await downloadInfoAndSubs(url);
            break;
        case "Playlist":
            break;
        case "Text file":
            break;
    }
}
async function downloadInfoAndSubs(playlistOrChannelUrl) {
    if (!playlistOrChannelUrl)
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
            // "--sub-lang", //dont enable this without setting a sub lang
            // "en",
            "-o",
            filesystem_1.createYoutubeDlFilePath("metadataDir", "id")
        ];
        youtube_dl_1.default.exec(playlistOrChannelUrl, flags, {}, function (err, output) {
            if (err)
                throw err;
            console.log(output.join("\n"));
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
exports.default = getVideoMetadata;
