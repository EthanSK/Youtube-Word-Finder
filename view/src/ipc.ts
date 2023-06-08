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
  | "download-manually-found-word"
  | "go-to-file-path"
  | "reopen-window-url-expired"
  | "update-youtube-dl"
  | "re-encode-videos"
  | "open-file-dialog"

export function ipcSend(channel: IPCRendererSendChannel, data?: any) {
  // console.log("sending ipc from renderer: ", channel, data)
  ipc.send(channel, data)
}
