import youtubedl from "youtube-dl"
import { sendToConsoleOutput } from "./logger"
import path, { dirname } from "path"
import fs, { fstatSync } from "fs"
import { get } from "https"
import { ipcMain } from "electron"
import downloader from "youtube-dl/lib/downloader"
import { saveUserDefault, userDefaultsKey } from "./userDefaults"
import { load } from "./store"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //coz we get Error: certificate has expired https://stackoverflow.com/a/20497028/6820042

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" //without this, we get CERT_HAS_EXPIRED error after a while. this is fine since it's an electron app, not an actual web server. why do I have this twice lol oh well.

ipcMain.on("update-youtube-dl", async (event, data: string) => {
  try {
    await updateYoutubeDl()
  } catch (error: any) {
    sendToConsoleOutput(`Error updating youtube-dl: ${error.message}`, "error")
  }
})

export async function updateYoutubeDl() {
  sendToConsoleOutput("Updating youtube-dl", "loading")
  //@ts-ignore
  console.log("binary: ", youtubedl.getYtdlBinary())
  //@ts-ignore
  const binDir = path.dirname(youtubedl.getYtdlBinary())
  const binary = path.join(binDir, "youtube-dl")
  if (fs.existsSync(binary)) {
    fs.unlinkSync(binary)
  }
  await new Promise((resolve, reject) => {
    downloader(binDir, (err, message) => {
      if (err) {
        console.log("error: ", err)
        return reject(err)
      }
      console.log("done updating", message)
      sendToConsoleOutput(
        `youtube-dl (yt-dlp) updated at ${binDir}. Any custom youtube-dl binary set will be overwritten by this updated binary.`,
        "success"
      )
      //@ts-ignore
      const newBin = youtubedl.getYtdlBinary()
      saveUserDefault({ customYtdlBinary: newBin }) //remove it
      resolve(undefined)
    })
  })
}
