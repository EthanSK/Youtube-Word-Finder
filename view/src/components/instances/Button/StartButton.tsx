import React, { useEffect, useState } from "react"
import Button from "../../elements/Button/Button"
import { ipcSend } from "../../../ipc"
const { ipcRenderer } = window.require("electron")

const StatButton = () => {
  enum RunningState {
    "running",
    "stopping",
    "notRunning"
  }
  const [runningState, setRunningState] = useState(RunningState.notRunning)
  function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (runningState === RunningState.running) {
      setRunningState(RunningState.stopping)
      ipcSend("stop-pressed")
    }
    if (runningState === RunningState.notRunning) {
      setRunningState(RunningState.running)
      ipcSend("start-pressed")
    }
  }

  useEffect(() => {
    const channel = "stopped-running"
    var handleStopEvent = (
      even: Electron.IpcRendererEvent,
      data: { error?: string }
    ) => {
      setRunningState(RunningState.notRunning)
    }
    ipcRenderer.on(channel, handleStopEvent)
    return () => {
      ipcRenderer.removeListener(channel, handleStopEvent)
    }
  })
  return (
    <Button
      title={(function() {
        switch (runningState) {
          case RunningState.running:
            return "Stop"

          case RunningState.notRunning:
            return "Start"
          case RunningState.stopping:
            return "Stopping..."
        }
      })()}
      class="bigButton"
      onClick={handleClick}
    />
  )
}
export default StatButton
