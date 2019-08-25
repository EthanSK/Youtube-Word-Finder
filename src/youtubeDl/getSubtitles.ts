import youtubedl from "youtube-dl"
import { getDirName } from "../filesystem"

// --max-downloads 69

async function getSubtitles() {
  // var url = "https://www.youtube.com/channel/UC-lHJZR3Gqxm24_Vd_AJ5Yw"
  // var options = {
  //   // Write automatic subtitle file (youtube only)
  //   auto: true,
  //   // Downloads all the available subtitles.
  //   all: false,
  //   // Subtitle format. YouTube generated subtitles
  //   // are available ttml or vtt.
  //   format: "vtt",
  //   // Languages of subtitles to download, separated by commas.
  //   lang: "en",
  //   // The directory to save the downloaded files in.
  //   cwd: getDirName("subtitlesDir")
  // }
  // return new Promise((resolve, reject) => {
  //   youtubedl.getSubs(url, options, function(err, files) {
  //     if (err) reject(err)
  //     console.log("subtitle files downloaded:", files)
  //     resolve()
  //   })
  // })
}

export default getSubtitles
