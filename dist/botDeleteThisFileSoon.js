"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_dl_1 = __importDefault(require("youtube-dl"));
const path_1 = __importDefault(require("path"));
// const ffmpeg = spawn(ffmpegPath, [
//   "-i",
//   "./playground/testVideo.mp4",
//   "./playground/testFfmpegOut.mp4"
// ])
// ffmpeg.stdout.setEncoding("utf8")
// ffmpeg.stdout.on("data", function(data) {
//   console.log("stdout data: ", data)
// })electro
// ffmpeg.stderr.setEncoding("utf8")
// ffmpeg.stderr.on("data", function(data) {
//   console.log("stderr data: ", data)
// })
// ffmpeg.on("close", (code, signal) => {
//   console.log(code, signal)
// })
const pathsubs = path_1.default.join(process.cwd(), "subs");
console.log("path:", pathsubs);
youtube_dl_1.default.getSubs("https://www.youtube.com/watch?v=Pc6rnTFjJZI", {
    auto: true,
    all: false,
    lang: "en",
    cwd: pathsubs
}, (err, files) => {
    if (err)
        console.error("error subs:", err);
    console.log("subtitle files downloaded:", files);
});
// youtube-dl --write-auto-sub https://www.youtube.com/watch?v=Pc6rnTFjJZI --skip-download -o playground/subs/subtest
