"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_dl_1 = __importDefault(require("youtube-dl"));
const filesystem_1 = require("../filesystem");
// --max-downloads 69
async function getSubtitles() {
    var url = "https://www.youtube.com/channel/UC-lHJZR3Gqxm24_Vd_AJ5Yw";
    var options = {
        // Write automatic subtitle file (youtube only)
        auto: true,
        // Downloads all the available subtitles.
        all: false,
        // Subtitle format. YouTube generated subtitles
        // are available ttml or vtt.
        format: "vtt",
        // Languages of subtitles to download, separated by commas.
        lang: "en",
        // The directory to save the downloaded files in.
        cwd: filesystem_1.getDirName("subtitlesDir")
    };
    return new Promise((resolve, reject) => {
        youtube_dl_1.default.getSubs(url, options, function (err, files) {
            if (err)
                reject(err);
            console.log("subtitle files downloaded:", files);
            resolve();
        });
    });
}
exports.default = getSubtitles;
