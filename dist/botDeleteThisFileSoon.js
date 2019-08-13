"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_dl_1 = __importDefault(require("youtube-dl"));
// const proc = spawn(ffmpegPath, [
//   "-i",
//   "./playground/testVideo.mp4",
//   "./playground/testFfmpegOut.mp4"
// ])
youtube_dl_1.default.getInfo("https://www.youtube.com/watch?v=aLFgbkN3-hM", 
// ["--get-url"],
(err, info) => {
    console.log("info :", info.url);
});
// const ffmpeg = spawn(ffmpegPath, [
//   "-ss",
//   "0",
//   "-i",
//   "./playground/testVideo.mp4",
//   "./playground/testFfmpegOut.mp4",
//   "-t",
//   "1"
// ])
// const proc = spawn("./node_modules/youtube-dl/bin/youtube-dl", [
//   "-f",
//   "22",
//   "-g",
//   "https://www.youtube.com/watch?v=aLFgbkN3-hM"
// ])
// proc.stdout.setEncoding("utf8")
// proc.stdout.on("data", function(data) {
//   console.log("stdout data: ", data)
// })
// proc.stderr.setEncoding("utf8")
// proc.stderr.on("data", function(data) {
//   console.log("stderr data: ", data)
// })
// proc.on("close", (code, signal) => {
//   console.log(code, signal)
// })
// const pathsubs = path.join(process.cwd(), "subs")
// console.log("path:", pathsubs)
// youtubedl.getSubs(
//   "https://www.youtube.com/watch?v=Pc6rnTFjJZI",
//   {
//     auto: true,
//     all: false,
//     lang: "en",
//     cwd: pathsubs
//   },
//   (err, files) => {
//     if (err) console.error("error subs:", err)
//     console.log("subtitle files downloaded:", files)
//   }
// )
// youtube-dl --write-auto-sub https://www.youtube.com/watch?v=Pc6rnTFjJZI --skip-download -o playground/subs/subtest
//ffmpeg -ss 0 -i $(youtube-dl -f 22 -g 'https://www.youtube.com/watch?v=aLFgbkN3-hM') -t 5 lol.mp4
