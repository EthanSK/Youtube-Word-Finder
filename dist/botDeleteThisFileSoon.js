"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const ffmpeg_1 = require("@ffmpeg-installer/ffmpeg");
// const ffmpeg = spawn(ffmpegPath, [
//   "-i",
//   "./playground/testVideo.mp4",
//   "./playground/testFfmpegOut.mp4"
// ])
const ffmpeg = child_process_1.spawn(ffmpeg_1.path, [
    "-ss",
    "0",
    "-i",
    "./playground/testVideo.mp4",
    "./playground/testFfmpegOut.mp4",
    "-t",
    "1"
]);
ffmpeg.stdout.setEncoding("utf8");
ffmpeg.stdout.on("data", function (data) {
    console.log("stdout data: ", data);
});
ffmpeg.stderr.setEncoding("utf8");
ffmpeg.stderr.on("data", function (data) {
    console.log("stderr data: ", data);
});
ffmpeg.on("close", (code, signal) => {
    console.log(code, signal);
});
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
