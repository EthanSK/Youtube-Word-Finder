import electronLog from "electron-log"
import { ipcSend } from "./ipc"
import { ipcMain } from "electron"

ipcMain.on("log-console-output", (event, data) => {
  // console.log("received event to log console output", data)
  const message = data.message as string
  const messageType = data.messageType === "error" ? "error" : "info"
  log(message, messageType)
})

/**
 * Do NOT call log alongside sendToConsoleOutput in main process, renderer will send ipc * back to main with data to log, to keep it consistent.
 */
export function log(message: string, type: "error" | "info" | "warn") {
  switch (type) {
    case "error":
      electronLog.error(message)
      break
    case "info":
      electronLog.info(message)
      break
    case "warn":
      electronLog.warn(message)
      break
    default:
      break
  }
}

export type ConsoleOutputMessageType =
  | "instruction"
  | "info"
  | "error"
  | "loading"
  | "success"
  | "settings"
  | "sadtimes"
  | "startstop"

export function sendToConsoleOutput(
  message: string,
  messageType: ConsoleOutputMessageType
) {
  ipcSend("write-to-console-output", {
    message,
    messageType
  })
}
