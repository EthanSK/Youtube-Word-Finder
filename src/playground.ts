import { spawn } from "child_process"
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg"
import youtubedl from "youtube-dl"
import path from "path"

// const proc = spawn(ffmpegPath, [
//   "-i",
//   "./playground/testVideo.mp4",
//   "./playground/testFfmpegOut.mp4"
// ])
youtubedl.getInfo(
  "https://www.youtube.com/watch?v=aLFgbkN3-hM",
  // ["--get-url"],
  (err: any, info: any) => {
    console.log("info :", info.url)

    let proc = spawn(ffmpegPath, [
      "-y",
      "-ss",
      "0",
      "-i",
      info.url,
      "-t",
      "1",
      "./playground/testFfmpegOut.mp4"
    ])

    proc.stdout.setEncoding("utf8")

    proc.stdout.on("data", function(data) {
      console.log("stdout data: ", data)
    })

    proc.stderr.setEncoding("utf8")
    proc.stderr.on("data", function(data) {
      console.log("stderr data: ", data)
    })

    proc.on("close", (code, signal) => {
      console.log(code, signal)
    })
  }
)

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

//ffmpeg -y -ss 0 -i $(youtube-dl -f 22 -g 'https://www.youtube.com/watch?v=aLFgbkN3-hM') -t 1 playground/lol.mp4
