const ipc = window.require("electron").ipcRenderer

export type IPCRendererSendChannel = "log-console-output"

export function ipcSend(channel: IPCRendererSendChannel, data: any) {
  console.log("sending ipc", channel, data)
  ipc.send(channel, data)
}

ipc.on("testres", (event, data) => {
  console.log("renderer received test event")
})
