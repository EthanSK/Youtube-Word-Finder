import React, { useEffect, useState } from "react"
import Button from "../../elements/Button/Button"
import { ipcSend } from "../../../ipc"
const { ipcRenderer } = window.require("electron")

const StatButton = () => {
  const [isRunning, setIsRunning] = useState(false)
  function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (isRunning) {
      ipcSend("stop-pressed")
    } else {
      setIsRunning(true)
      ipcSend("start-pressed")
    }
  }

  useEffect(() => {
    const channel = "stopped-running"
    var handleStopEvent = (
      even: Electron.IpcRendererEvent,
      data: { error?: string }
    ) => {
      setIsRunning(false)
    }
    ipcRenderer.on(channel, handleStopEvent)
    return () => {
      ipcRenderer.removeListener(channel, handleStopEvent)
    }
  })
  return (
    <Button
      title={isRunning ? "Stop" : "Start"}
      class="bigButton"
      onClick={handleClick}
    />
  )
}
export default StatButton
