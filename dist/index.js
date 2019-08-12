"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
// const ffmpeg = spawn(ffmpegPath, [
//   "-i ../playground/testVideo.mp4 -ss 0 -t 1 ../playground/testFfmpegOut.mp4"
// ])=
const ffmpeg = child_process_1.spawn("ffmpeg", [
    "-i",
    "./playground/testVideo.mp4",
    "./playground/testFfmpegOut.mp4"
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
