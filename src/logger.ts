import electronLog from "electron-log"
import { ipcSend } from "./ipc"

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
