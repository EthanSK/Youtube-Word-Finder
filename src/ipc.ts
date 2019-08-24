import { ipcMain as ipc } from "electron"
import { log } from "./logger"
import { mainWindow } from "./main"

export type IPCMainSendChannel =
  | "write-to-console-output"
  | "restore-user-defaults"
  | "stopped-running"

//this sends to all renderer processes, as it is not a reply to an event
export function ipcSend(channel: IPCMainSendChannel, data: any) {
  if (!mainWindow)
    throw new Error(
      "main window is undefined when trying to send ipc to web contents"
    )
  // console.log("sending ipc from main: ", channel, data)
  mainWindow.webContents.send(channel, data)
}
