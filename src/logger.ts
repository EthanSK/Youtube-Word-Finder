import electronLog from "electron-log"

export function log(message: string, type: "error" | "info" | "warn") {
  switch (type) {
    case "error":
      electronLog.error(message)
      break
    case "info":
      electronLog.info(message)
    case "warn":
      electronLog.warn(message)
    default:
      break
  }
}
