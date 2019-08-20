const ipc = window.require("electron").ipcRenderer

export type IPCRendererSendChannel =
  | "log-console-output"
  | "save-user-default"
  | "open-word-options"
  | "restore-user-defaults"

export function ipcSend(channel: IPCRendererSendChannel, data?: any) {
  // console.log("sending ipc from renderer: ", channel, data)
  ipc.send(channel, data)
}
