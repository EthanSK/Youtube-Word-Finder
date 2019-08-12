import { spawn } from "child_process"
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg"

const ffmpeg = spawn(ffmpegPath, [
  "-i",
  "./playground/testVideo.mp4",
  "./playground/testFfmpegOut.mp4"
])

ffmpeg.stdout.setEncoding("utf8")

ffmpeg.stdout.on("data", function(data) {
  console.log("stdout data: ", data)
})

ffmpeg.stderr.setEncoding("utf8")
ffmpeg.stderr.on("data", function(data) {
  console.log("stderr data: ", data)
})

ffmpeg.on("close", (code, signal) => {
  console.log(code, signal)
})
