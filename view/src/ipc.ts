const ipc = window.require("electron").ipcRenderer

export type IPCRendererSendChannel =
  | "log-console-output"
  | "save-user-default"
  | "open-word-options"
  | "restore-user-defaults"
  | "filter-word"
  | "start-pressed"
  | "stop-pressed"
  | "open-url-browser"
  | "open-word-finder"
  | "request-word-finder-data"

export function ipcSend(channel: IPCRendererSendChannel, data?: any) {
  // console.log("sending ipc from renderer: ", channel, data)
  ipc.send(channel, data)
}
