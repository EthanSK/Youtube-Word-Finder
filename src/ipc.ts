import { ipcMain as ipc } from "electron"
import { log } from "./logger"
import { mainWindow } from "./main"

export type IPCMainSendChannel = "write-to-console-output"

export function ipcSend(channel: IPCMainSendChannel, data: any) {
  if (!mainWindow)
    throw new Error(
      "main window is undefined when trying to send ipc to web contents"
    )
  console.log("sending ipc", channel, data)
  mainWindow.webContents.send(channel, data)
}

ipc.on("log-console-output", (event, data) => {
  // console.log("received event to log console output", data)
  const message = data.message as string
  const messageType = data.messageType === "error" ? "error" : "info"
  log(message, messageType)
})
