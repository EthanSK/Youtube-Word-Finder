import { spawn } from "child_process"
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg"
import youtubedl from "youtube-dl"
import path from "path"

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
const pathsubs = path.join(process.cwd(), "subs")

console.log("path:", pathsubs)
youtubedl.getSubs(
  "https://www.youtube.com/watch?v=Pc6rnTFjJZI",
  {
    auto: true,
    all: false,
    lang: "en",
    cwd: pathsubs
  },
  (err, files) => {
    if (err) console.error("error subs:", err)
    console.log("subtitle files downloaded:", files)
  }
)

// youtube-dl --write-auto-sub https://www.youtube.com/watch?v=Pc6rnTFjJZI --skip-download -o playground/subs/subtest
