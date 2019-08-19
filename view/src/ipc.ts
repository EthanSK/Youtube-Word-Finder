const ipc = window.require("electron").ipcRenderer

export type IPCRendererSendChannel = "log-console-output"

export function ipcSend(channel: IPCRendererSendChannel, data: any) {
  console.log("sending ipc", channel, data)
  ipc.send(channel, data)
}

//ipc listen events are done in the components themselves
