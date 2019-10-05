import youtubedl from "youtube-dl"
import { sendToConsoleOutput } from "./logger"
import path, { dirname } from "path"
import fs, { fstatSync } from "fs"
import { get } from "https"
import { ipcMain } from "electron"

let getBinary = require("youtube-dl/lib/get-binary")
let downloader = require("youtube-dl/lib/downloader")

ipcMain.on("update-youtube-dl", async (event, data: string) => {
  try {
    await updateYoutubeDl()
  } catch (error) {
    sendToConsoleOutput(`Error updating youtube-dl: ${error.message}`, "error")
  }
})

export async function updateYoutubeDl() {
  sendToConsoleOutput("Updating youtube-dl", "loading")
  console.log(getBinary())
  const binDir = path
    .dirname(getBinary())
    .replace("app.asar", "app.asar.unpacked")
  const binary = path.join(binDir, "youtube-dl")
  if (fs.existsSync(binary)) {
    fs.unlinkSync(binary)
  }
  await new Promise((resolve, reject) => {
    downloader(binDir, function error(err: string, done: any) {
      if (err) {
        console.log("error: ", err)
        return reject(err)
      }
      console.log("done updating", done)
      sendToConsoleOutput(`youtube-dl updated at ${binDir}`, "success")
      resolve()
    })
  })
}
