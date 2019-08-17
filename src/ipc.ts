import { ipcMain as ipc } from "electron"

ipc.on("log-console-output", (event, data) => {
  console.log("received event to log console output")
})
